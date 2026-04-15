import React, { useMemo, useRef, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  type ChartOptions,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { FormSelect, WorkdayModal } from './components';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import {
  TREE_META,
  TREE_NODES,
  TREE_EDGES,
  TREE_LEVELS,
  FULL_SERIES,
  FEATURE_FIRST_ADOPTION,
  getUpstreamPath,
  cumulativeAdoption,
  type MetricTreeConfidence,
  type MetricTreeNode,
  type TrendGoodDirection,
  type TrendPoint,
  lastN,
  definedSeries,
  formatDays,
  changeText,
  metricValue,
  buildFilteredNode,
} from './data-recruiting-metric-tree';
import {
  type DashboardFilterState,
  EMPTY_DASHBOARD_FILTERS,
  SEGMENT_FILTER_OPTIONS,
  REGION_FILTER_OPTIONS,
  INDUSTRY_FILTER_OPTIONS,
  filterTenantNames,
  describeActiveFilters,
  normaliseTenantInput,
} from './dashboard-filter-utils';
import { TENANT_TIME_SERIES, ALL_TENANTS } from './data-avg-time-to-hire';
import { RECRUITER_CAPACITY_TENANT_SERIES } from './data-dashboard-tenant-filters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend, annotationPlugin);

type ViewportState = { x: number; y: number; scale: number };
type DragState = { active: boolean; pointerX: number; pointerY: number; originX: number; originY: number };

const NODE_HEIGHT = 138;
const DEFAULT_NODE_WIDTH = 228;
const RAIL_WIDTH = 520;
/** Pannable world: title band above the metric SVG (moves with pan/zoom). */
const TREE_TITLE_BAND_PX = 52;
const FILTER_RAIL_EXPANDED_PX = 188;
const FILTER_RAIL_COLLAPSED_PX = 36;
/** Keep tree nodes/links to the right of grey section headers. */
const TREE_CONTENT_OFFSET_X = 210;

const LEVEL_Y: Record<(typeof TREE_LEVELS)[number], number> = {
  'Business Value Outcomes': 12,
  'Product Value Outcomes': 262,
  'User Outcomes': 510,
  'Feature Adoption & Usage': 760,
};

const CONFIDENCE_STYLE: Record<
  MetricTreeConfidence,
  { bg: string; fg: string; stroke: string; dash?: string; badge: string }
> = {
  Measured: {
    bg: colors.blueberry100,
    fg: colors.blueberry600,
    stroke: colors.blueberry400,
    dash: '6 5',
    badge: 'Measured',
  },
  Directional: {
    bg: colors.blueberry100,
    fg: colors.blueberry600,
    stroke: colors.blueberry400,
    dash: '6 5',
    badge: 'Directional',
  },
};

const STRENGTH_STYLE: Record<string, { bg: string; fg: string; dash?: string }> = {
  Strong: { bg: colors.greenApple100, fg: colors.greenApple600 },
  Moderate: { bg: '#fff3e0', fg: '#e67700' },
  Weak: { bg: colors.soap200, fg: colors.blackPepper500, dash: '4 4' },
};

/**
 * Fisher z-transformation for computing p-value of Pearson correlation.
 * z = 0.5 * ln((1 + r) / (1 - r))
 * SE = 1 / sqrt(n - 3)
 * z_score = z / SE
 * p-value = 2 * (1 - Φ(|z_score|)) for two-tailed test
 */
function fisherZPValue(r: number, n: number): number | null {
  if (n < 4 || Math.abs(r) >= 1) return null;
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zScore = Math.abs(z / se);
  const pValue = 2 * (1 - normalCDF(zScore));
  return pValue;
}

function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return 0.5 * (1 + sign * y);
}

function formatPValue(pValue: number | null): string {
  if (pValue == null) return 'p = N/A';
  if (pValue < 0.001) return 'p < 0.001';
  if (pValue < 0.01) return `p < 0.01`;
  if (pValue < 0.05) return `p < 0.05`;
  return `p = ${pValue.toFixed(3)}`;
}

function correlationTooltip(
  label: string,
  correlation: number | null,
  overlapPoints: number,
  strength: string
): string {
  const base = label;
  if (correlation == null) return `${base} · Insufficient data for correlation`;
  const rValue = `r = ${correlation.toFixed(2)}`;
  const nValue = `n = ${overlapPoints} months`;
  const pValue = fisherZPValue(correlation, overlapPoints);
  const pValueStr = formatPValue(pValue);
  const isSignificant = pValue != null && pValue < 0.05;
  const strengthNote = strength === 'Weak'
    ? 'Exploratory only: too few data points for reliable inference'
    : strength === 'Moderate'
    ? 'Moderate association: treat as directional hypothesis, not validated causal link'
    : 'Strong association: treat as directional hypothesis, not validated causal link';
  const sigNote = isSignificant
    ? '⚠️ Note: Statistical significance with small samples (n~6) should be interpreted cautiously due to low power.'
    : 'Not statistically significant at α = 0.05.';
  return `${base}\n${rValue} · ${nValue} · ${pValueStr}\n${strengthNote}\n\n${sigNote}\n\nCaveats: Pearson r computed on short time series. Mixed SANDBOX/PROD environments. Time-series autocorrelation not addressed.`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function edgePath(from: MetricTreeNode, to: MetricTreeNode): string {
  const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
  const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
  const startX = from.x + fromWidth / 2;
  const endX = to.x + toWidth / 2;
  const startY = from.y < to.y ? from.y + NODE_HEIGHT : from.y;
  const endY = from.y < to.y ? to.y : to.y + NODE_HEIGHT;
  const midY = (startY + endY) / 2;
  return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
}

const MIN_CORRELATION_OVERLAP = 5;

function alignSeriesByMonth(a: MetricTreeNode, b: MetricTreeNode): [number[], number[]] {
  if (!a.trendYm || !b.trendYm || a.trend.length !== a.trendYm.length || b.trend.length !== b.trendYm.length) {
    return [[], []];
  }
  const aByYm = new Map(a.trendYm.map((ym, index) => [ym, a.trend[index]]));
  const sharedYms = b.trendYm.filter((ym) => aByYm.has(ym));
  return [
    sharedYms.map((ym) => aByYm.get(ym) as number),
    sharedYms.map((ym) => b.trend[b.trendYm!.indexOf(ym)]),
  ];
}

function pearsonCorrelation(seriesA: number[], seriesB: number[]): number | null {
  if (seriesA.length < 3 || seriesB.length < 3) return null;
  const meanA = seriesA.reduce((sum, value) => sum + value, 0) / seriesA.length;
  const meanB = seriesB.reduce((sum, value) => sum + value, 0) / seriesB.length;
  const centeredA = seriesA.map((value) => value - meanA);
  const centeredB = seriesB.map((value) => value - meanB);
  const numerator = centeredA.reduce((sum, value, index) => sum + value * centeredB[index], 0);
  const varianceA = centeredA.reduce((sum, value) => sum + value * value, 0);
  const varianceB = centeredB.reduce((sum, value) => sum + value * value, 0);
  const denominator = Math.sqrt(varianceA * varianceB);
  if (!Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function correlationStrength(correlation: number | null, overlapPoints: number): 'Strong' | 'Moderate' | 'Weak' {
  if (correlation == null || overlapPoints < MIN_CORRELATION_OVERLAP) return 'Weak';
  const magnitude = Math.abs(correlation);
  if (magnitude >= 0.75) return 'Strong';
  if (magnitude >= 0.45) return 'Moderate';
  return 'Weak';
}

function formatLevelSummary(level: string): string {
  if (level === 'Business Value Outcomes') return 'North-star business results';
  if (level === 'Product Value Outcomes') return 'Measured product outcomes PMs can influence';
  if (level === 'User Outcomes') return 'User behaviours that speed up or slow down the layer above';
  return 'Feature adoption that drives user outcomes';
}

function chartData(values: number[], stroke: string, fill: string) {
  return {
    labels: values.map((_, index) => `P${index + 1}`),
    datasets: [{ data: values, borderColor: stroke, backgroundColor: fill, fill: true, borderWidth: 2, pointRadius: 0, tension: 0.35 }],
  };
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

const miniChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { line: { capBezierPoints: true } },
};

const railChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { display: false, grid: { display: false } },
    y: { display: true, grid: { color: 'rgba(15,23,42,0.08)' }, ticks: { color: colors.blackPepper400, maxTicksLimit: 4 } },
  },
};

const UPSTREAM_SERIES_COLORS: Record<string, string> = {
  'document-review': colors.cantaloupe400,
  'offer-ea-duration': colors.cinnamon400,
  'avg-time-to-hire': colors.greenApple500,
  'recruiter-capacity': colors.sourLemon500,
  'time-in-interview-bp': colors.watermelon400,
  'feedback-time': colors.juicyPear400,
  'schedule-interviews': colors.peach400,
  'create-interview-team': colors.plum400,
  'approval-time': colors.blueberry300,
  'offer-ea-completion': colors.licorice300,
  'job-applications': colors.pomegranate400,
};

const NODE_LABELS: Record<string, string> = {
  'add-documents': 'Add Documents Adoption',
  'regenerate-offer': 'Regenerate Offer Adoption',
  'regenerate-ea': 'Regenerate EA Adoption',
  'document-review': 'Document Review Time',
  'offer-ea-duration': 'Offer/EA Duration',
  'avg-time-to-hire': 'Avg Time to Hire',
  'recruiter-capacity': 'Recruiter Capacity',
  'time-in-interview-bp': 'Time in Interview BP',
  'feedback-time': 'Feedback Submission Time',
  'schedule-interviews': 'Schedule Interview Time',
  'create-interview-team': 'Create Interview Team Time',
  'approval-time': 'Approval Time',
  'offer-ea-completion': 'Offer/EA Completion Rate',
  'job-applications': 'Job Applications',
};

function normaliseSeriesMinMax(points: TrendPoint[]): TrendPoint[] {
  if (points.length === 0) return [];
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return points.map((p) => ({ ym: p.ym, value: 50 }));
  return points.map((p) => ({ ym: p.ym, value: ((p.value - min) / range) * 100 }));
}

function buildMultiSeriesChartData(
  nodeId: string,
  upstreamIds: string[],
  firstAdoptionYm: string | undefined
): {
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    borderWidth: number;
    pointRadius: number;
    tension: number;
    yAxisID: string;
    borderDash?: number[];
  }>;
  adoptionLineIndex: number | null;
} {
  const selectedSeries = FULL_SERIES[nodeId] ?? [];
  const isFeatureAdoption = nodeId.startsWith('add-documents') || nodeId.startsWith('regenerate-');
  
  const adoptionSeries = isFeatureAdoption ? cumulativeAdoption(selectedSeries) : selectedSeries;
  const adoptionYmSet = new Set(adoptionSeries.map((p) => p.ym));
  
  let startYm = firstAdoptionYm;
  if (!startYm && adoptionSeries.length > 0) {
    startYm = adoptionSeries[0].ym;
  }
  
  const upstreamData: Array<{ id: string; points: TrendPoint[] }> = [];
  for (const upId of upstreamIds) {
    const rawSeries = FULL_SERIES[upId] ?? [];
    if (rawSeries.length === 0) continue;
    const normalised = normaliseSeriesMinMax(rawSeries);
    upstreamData.push({ id: upId, points: normalised });
  }
  
  const allYms = new Set<string>();
  adoptionSeries.forEach((p) => allYms.add(p.ym));
  upstreamData.forEach(({ points }) => points.forEach((p) => allYms.add(p.ym)));
  
  let labels = Array.from(allYms).sort();
  
  if (startYm) {
    const startIndex = labels.indexOf(startYm);
    const monthsBefore = 12;
    const cutoffIndex = Math.max(0, startIndex - monthsBefore);
    labels = labels.slice(cutoffIndex);
  }
  
  const adoptionMap = new Map(adoptionSeries.map((p) => [p.ym, p.value]));
  const adoptionData = labels.map((ym) => adoptionMap.get(ym) ?? null);
  
  const datasets: Array<{
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    borderWidth: number;
    pointRadius: number;
    tension: number;
    yAxisID: string;
    borderDash?: number[];
  }> = [
    {
      label: NODE_LABELS[nodeId] ?? nodeId,
      data: adoptionData,
      borderColor: colors.blueberry500,
      backgroundColor: `${colors.blueberry500}22`,
      fill: true,
      borderWidth: 3,
      pointRadius: 0,
      tension: 0.35,
      yAxisID: 'y',
    },
  ];
  
  for (const { id, points } of upstreamData) {
    const pointMap = new Map(points.map((p) => [p.ym, p.value]));
    const data = labels.map((ym) => pointMap.get(ym) ?? null);
    datasets.push({
      label: NODE_LABELS[id] ?? id,
      data,
      borderColor: UPSTREAM_SERIES_COLORS[id] ?? colors.soap400,
      backgroundColor: 'transparent',
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.35,
      yAxisID: 'y1',
      borderDash: [4, 4],
    });
  }
  
  const adoptionLineIndex = startYm ? labels.indexOf(startYm) : null;
  
  return { labels, datasets, adoptionLineIndex };
}

function buildDetailChartOptions(adoptionLineIndex: number | null, _labels: string[]): ChartOptions<'line'> {
  const annotationConfig = adoptionLineIndex != null && adoptionLineIndex >= 0
    ? {
        annotations: {
          adoptionLine: {
            type: 'line' as const,
            xMin: adoptionLineIndex,
            xMax: adoptionLineIndex,
            borderColor: colors.cinnamon500,
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: true,
              content: 'First Adoption',
              position: 'start' as const,
              backgroundColor: colors.cinnamon100,
              color: colors.cinnamon600,
              font: { size: 10, weight: 'bold' as const },
              padding: 4,
            },
          },
        },
      }
    : {};
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 8,
          font: { size: 10 },
          color: colors.blackPepper500,
        },
      },
      annotation: annotationConfig,
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: colors.blackPepper400,
          font: { size: 9 },
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Adoption %',
          color: colors.blueberry500,
          font: { size: 10 },
        },
        grid: { color: 'rgba(15,23,42,0.08)' },
        ticks: { color: colors.blueberry500, maxTicksLimit: 5 },
        min: 0,
        max: 100,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Normalised (0-100)',
          color: colors.blackPepper400,
          font: { size: 10 },
        },
        grid: { drawOnChartArea: false },
        ticks: { color: colors.blackPepper400, maxTicksLimit: 5 },
        min: 0,
        max: 100,
      },
    },
  };
}

// ── Filtered node builder helpers ──

function buildFilteredTthNode(filteredTenants: string[], base: MetricTreeNode): MetricTreeNode {
  const labels = Array.from(new Set(filteredTenants.flatMap((t) => (TENANT_TIME_SERIES[t] ?? []).map((p) => p.ym)))).sort();
  const trendPoints = labels.map((ym) => {
    const values = filteredTenants
      .map((t) => TENANT_TIME_SERIES[t]?.find((p) => p.ym === ym)?.v)
      .filter((v): v is number => v != null && Number.isFinite(v));
    return values.length > 0 ? { ym, value: median(values) } : null;
  }).filter((point): point is { ym: string; value: number } => point != null);
  const series = trendPoints.map((point) => point.value);
  if (series.length === 0) return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [] };
  const latest = series[series.length - 1];
  const recent = trendPoints.slice(-6);
  return {
    ...base,
    value: formatDays(latest),
    valueContext: `Filtered (${filteredTenants.length} tenants) · ${changeText(lastN(series))}`,
    trend: recent.map((point) => point.value),
    trendYm: recent.map((point) => point.ym),
  };
}

function buildFilteredRcNode(filteredTenants: string[], base: MetricTreeNode): MetricTreeNode {
  const rcTenants = filteredTenants.filter((t) => RECRUITER_CAPACITY_TENANT_SERIES[t]);
  const labels = Array.from(new Set(rcTenants.flatMap((t) => (RECRUITER_CAPACITY_TENANT_SERIES[t] ?? []).map((p) => p.ym)))).sort();
  const trendPoints = labels.map((ym) => {
    const values = rcTenants
      .map((t) => RECRUITER_CAPACITY_TENANT_SERIES[t]?.find((p) => p.ym === ym)?.value)
      .filter((v): v is number => v != null && Number.isFinite(v));
    return values.length > 0 ? { ym, value: median(values) } : null;
  }).filter((point): point is { ym: string; value: number } => point != null);
  const series = trendPoints.map((point) => point.value);
  if (series.length === 0) return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [] };
  const latest = series[series.length - 1];
  const recent = trendPoints.slice(-6);
  return {
    ...base,
    value: `${latest.toFixed(1)} avg reqs`,
    valueContext: `Filtered (${rcTenants.length} tenants) · ${changeText(lastN(series))}`,
    trend: recent.map((point) => point.value),
    trendYm: recent.map((point) => point.ym),
  };
}

// ── NodeCard ──

const TREND_GOOD = '#188038';
const TREND_BAD = '#d93025';

function trendArrow(pct: number | null, direction: TrendGoodDirection): { symbol: string; color: string; text: string } {
  if (pct == null || !Number.isFinite(pct)) return { symbol: '', color: colors.blackPepper400, text: '--' };
  const abs = Math.abs(pct).toFixed(1);
  if (pct === 0) return { symbol: '', color: colors.blackPepper400, text: '0.0%' };
  const symbol = pct < 0 ? '\u2193' : '\u2191';
  const good =
    direction === 'lowerIsBetter' ? pct < 0 : pct > 0;
  return { symbol, color: good ? TREND_GOOD : TREND_BAD, text: `${abs}%` };
}

function NodeCard({
  node,
  selected,
  onSelect,
  xOffset = 0,
}: {
  node: MetricTreeNode;
  selected: boolean;
  onSelect: (id: string) => void;
  xOffset?: number;
}) {
  const stroke = colors.blueberry400;
  const fill = `${colors.blueberry400}22`;
  const mom = trendArrow(node.momPct, node.trendGoodDirection);
  const yoy = trendArrow(node.yoyPct, node.trendGoodDirection);
  return (
    <button
      type="button"
      onClick={(event) => { event.stopPropagation(); onSelect(node.id); }}
      style={{
        position: 'absolute',
        left: node.x + xOffset,
        top: node.y,
        width: node.width ?? DEFAULT_NODE_WIDTH,
        height: NODE_HEIGHT,
        borderRadius: 16,
        border: selected ? `2px solid ${colors.blueberry500}` : `1px solid ${colors.soap300}`,
        background: selected ? '#f7fbff' : colors.frenchVanilla100,
        boxShadow: selected ? '0 10px 26px rgba(0,112,210,0.18)' : '0 8px 22px rgba(0,0,0,0.08)',
        padding: '10px 12px',
        cursor: 'pointer',
        textAlign: 'left',
        overflow: 'hidden',
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: colors.blackPepper500, lineHeight: 1.25, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
        {node.title}
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.2, textAlign: 'center' }}>{node.value}</div>

      <div style={{ width: '100%', height: 28, marginTop: 4, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '88%', height: '100%' }}>
          <Line data={chartData(node.trend.length > 0 ? node.trend : [0], stroke, fill)} options={miniChartOptions} />
        </div>
      </div>

      <Flex justifyContent="center" gap="zero" style={{ marginTop: 6, borderTop: `1px solid ${colors.soap200}`, paddingTop: 4 }}>
        <Box style={{ flex: 1, textAlign: 'center', borderRight: `1px solid ${colors.soap200}`, padding: '0 4px' }}>
          <div style={{ fontSize: 9, color: colors.blackPepper400, fontWeight: 600, textTransform: 'uppercase' }}>MoM</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: mom.color }}>{mom.symbol}{mom.text}</div>
        </Box>
        <Box style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
          <div style={{ fontSize: 9, color: colors.blackPepper400, fontWeight: 600, textTransform: 'uppercase' }}>YoY</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: yoy.color }}>{yoy.symbol}{yoy.text}</div>
        </Box>
      </Flex>
    </button>
  );
}

// ── Main page component ──

export const RecruitingMetricTreePage: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragMovedRef = useRef(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [view, setView] = useState<ViewportState>({ x: 48, y: 18, scale: 0.74 });
  const [drag, setDrag] = useState<DragState>({ active: false, pointerX: 0, pointerY: 0, originX: 0, originY: 0 });
  const [filters, setFilters] = useState<DashboardFilterState>(EMPTY_DASHBOARD_FILTERS);
  const [explainMetricsOpen, setExplainMetricsOpen] = useState(false);
  const [filterRailExpanded, setFilterRailExpanded] = useState(true);

  const isFiltered = filters.segment !== 'all' || filters.region !== 'all' || filters.industry !== 'all' || !!filters.tenant;

  const treeNodes = useMemo(() => {
    if (!isFiltered) return TREE_NODES;
    const filteredTenants = filterTenantNames(ALL_TENANTS, filters);
    return TREE_NODES.map((node) => {
      if (node.id === 'avg-time-to-hire') return buildFilteredTthNode(filteredTenants, node);
      if (node.id === 'recruiter-capacity') return buildFilteredRcNode(filteredTenants, node);
      return buildFilteredNode(node.id, filteredTenants, node);
    });
  }, [isFiltered, filters]);

  const nodeMap = useMemo(() => new Map(treeNodes.map((node) => [node.id, node])), [treeNodes]);
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null;
  const edgeInsights = useMemo(
    () =>
      TREE_EDGES.map((edge) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        const [fromSeries, toSeries] = !from || !to ? [[], []] : alignSeriesByMonth(from, to);
        const overlapPoints = Math.min(fromSeries.length, toSeries.length);
        const correlation = !from || !to ? null : pearsonCorrelation(fromSeries, toSeries);
        const strength = correlationStrength(correlation, overlapPoints);
        const pValue = correlation != null ? fisherZPValue(correlation, overlapPoints) : null;
        return { ...edge, correlation, strength, overlapPoints, pValue };
      }),
    [nodeMap]
  );
  const connectedEdges = useMemo(
    () => selectedNodeId ? edgeInsights.filter((edge) => edge.from === selectedNodeId || edge.to === selectedNodeId) : [],
    [edgeInsights, selectedNodeId]
  );

  const setViewForNode = (node: MetricTreeNode, scale = 0.96) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) { setView({ x: 40, y: 20, scale }); return; }
    const nodeWidth = node.width ?? DEFAULT_NODE_WIDTH;
    setView({
      scale,
      x: rect.width / 2 - (node.x + TREE_CONTENT_OFFSET_X + nodeWidth / 2) * scale,
      y: rect.height / 3 - (node.y + NODE_HEIGHT / 2) * scale,
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const nextScale = clamp(view.scale * (event.deltaY < 0 ? 1.08 : 0.92), 0.48, 1.4);
    const worldX = (pointerX - view.x) / view.scale;
    const worldY = (pointerY - view.y) / view.scale;
    setView({ scale: nextScale, x: pointerX - worldX * nextScale, y: pointerY - worldY * nextScale });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    dragMovedRef.current = false;
    setDrag({ active: true, pointerX: event.clientX, pointerY: event.clientY, originX: view.x, originY: view.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    if (Math.abs(event.clientX - drag.pointerX) > 2 || Math.abs(event.clientY - drag.pointerY) > 2) dragMovedRef.current = true;
    setView((c) => ({ ...c, x: drag.originX + (event.clientX - drag.pointerX), y: drag.originY + (event.clientY - drag.pointerY) }));
  };

  const stopDragging = () => setDrag((c) => ({ ...c, active: false }));
  const canvasWidth = selectedNode ? `calc(100vw - ${RAIL_WIDTH}px)` : '100vw';
  const filterParts = describeActiveFilters(filters);

  const updateFilter = (key: keyof DashboardFilterState, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const tenantOptions = useMemo(() => {
    const rcKeys = Object.keys(RECRUITER_CAPACITY_TENANT_SERIES);
    const allKeys = Array.from(new Set([...ALL_TENANTS, ...rcKeys])).sort();
    return [{ value: '', label: 'All tenants' }, ...allKeys.map((t) => ({ value: t, label: t }))];
  }, []);

  const railToggleStyle: React.CSSProperties = {
    border: `1px solid ${colors.soap300}`,
    background: colors.frenchVanilla100,
    borderRadius: 6,
    cursor: 'pointer',
    color: colors.blackPepper500,
    fontSize: 14,
    lineHeight: 1,
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Box style={{ position: 'relative', height: '100vh', overflow: 'hidden', backgroundColor: SANA_PAGE_CANVAS }}>
      <Box
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: canvasWidth,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {/* Narrow collapsible filter rail */}
        <Box
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          style={{
            width: filterRailExpanded ? FILTER_RAIL_EXPANDED_PX : FILTER_RAIL_COLLAPSED_PX,
            flexShrink: 0,
            transition: 'width 200ms ease',
            borderRight: `1px solid ${colors.soap300}`,
            background: 'rgba(255,255,255,0.97)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 3,
          }}
        >
          {filterRailExpanded ? (
            <Flex flexDirection="column" flex={1} minHeight={0} style={{ padding: '8px 10px', gap: 8, overflowY: 'auto' }}>
              <Flex justifyContent="space-between" alignItems="center" style={{ flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.blackPepper600 }}>Filters</span>
                <button
                  type="button"
                  aria-label="Collapse filter rail"
                  onClick={() => setFilterRailExpanded(false)}
                  style={railToggleStyle}
                >
                  {'\u2039'}
                </button>
              </Flex>
              <Box style={{ width: '100%' }}>
                <FormSelect id="tree-segment" label="Segment" value={filters.segment} onChange={(v) => updateFilter('segment', v)} options={SEGMENT_FILTER_OPTIONS} compact />
              </Box>
              <Box style={{ width: '100%' }}>
                <FormSelect id="tree-region" label="Region" value={filters.region} onChange={(v) => updateFilter('region', v)} options={REGION_FILTER_OPTIONS} compact />
              </Box>
              <Box style={{ width: '100%' }}>
                <FormSelect id="tree-industry" label="Industry" value={filters.industry} onChange={(v) => updateFilter('industry', v)} options={INDUSTRY_FILTER_OPTIONS} compact />
              </Box>
              <Box style={{ width: '100%' }}>
                <FormSelect id="tree-tenant" label="Tenant" value={filters.tenant} onChange={(v) => updateFilter('tenant', v)} options={tenantOptions} compact />
              </Box>
              {isFiltered && (
                <SecondaryButton size="small" onClick={() => setFilters(EMPTY_DASHBOARD_FILTERS)} style={{ fontSize: 11, minHeight: 28, padding: '4px 8px' }}>
                  Clear filters
                </SecondaryButton>
              )}
              {isFiltered && filterParts.length > 0 && (
                <BodyText size="small" style={{ fontSize: 10, color: colors.blackPepper500, lineHeight: 1.35, margin: 0 }}>
                  Scope: {filterParts.join(' · ')}
                </BodyText>
              )}
              <Box style={{ borderTop: `1px solid ${colors.soap300}`, marginTop: 4, paddingTop: 10, flexShrink: 0 }} />
              <SecondaryButton size="small" onClick={() => setExplainMetricsOpen(true)} style={{ fontSize: 11, minHeight: 28, padding: '4px 8px' }}>
                Explain metrics
              </SecondaryButton>
              <BodyText size="small" style={{ fontSize: 10, color: colors.blackPepper500, lineHeight: 1.35, margin: 0, marginTop: 4 }}>
                Correlation strength uses month-aligned overlap (min {MIN_CORRELATION_OVERLAP} points for Moderate/Strong) and is exploratory, not causal.
              </BodyText>
            </Flex>
          ) : (
            <Flex flex={1} alignItems="center" justifyContent="center" style={{ minHeight: 0 }}>
              <button
                type="button"
                aria-label="Expand filter rail"
                onClick={() => setFilterRailExpanded(true)}
                style={{ ...railToggleStyle, padding: '6px 4px' }}
              >
                {'\u203A'}
              </button>
            </Flex>
          )}
        </Box>

        {/* Tree viewport (full remaining width) */}
        <Box style={{ flex: '1 1 auto', minWidth: 0, position: 'relative', minHeight: 0 }}>
          <div
            ref={viewportRef}
            onClick={() => { if (!dragMovedRef.current) setSelectedNodeId(null); }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            style={{
              position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden',
              cursor: drag.active ? 'grabbing' : 'grab', backgroundColor: SANA_PAGE_CANVAS,
              backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: TREE_META.canvas.width,
                height: TREE_META.canvas.height + TREE_TITLE_BAND_PX,
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: TREE_TITLE_BAND_PX,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                  color: colors.blackPepper600,
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  textAlign: 'center',
                }}
              >
                Value Driver Tree - Workday Recruiting
              </div>
              <div style={{ position: 'absolute', left: 0, top: TREE_TITLE_BAND_PX, width: TREE_META.canvas.width, height: TREE_META.canvas.height }}>
              <svg width={TREE_META.canvas.width} height={TREE_META.canvas.height} viewBox={`0 0 ${TREE_META.canvas.width} ${TREE_META.canvas.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <g transform={`translate(${TREE_CONTENT_OFFSET_X}, 0)`}>
                {TREE_EDGES.map((edge) => {
                  const from = nodeMap.get(edge.from);
                  const to = nodeMap.get(edge.to);
                  if (!from || !to) return null;
                  const confidence = CONFIDENCE_STYLE[edge.confidence];
                  const insight = edgeInsights.find((item) => item.from === edge.from && item.to === edge.to);
                  const strength = insight?.strength ?? 'Weak';
                  const strengthStyle = STRENGTH_STYLE[strength] ?? STRENGTH_STYLE.Weak;
                  const dashArray = strengthStyle.dash ?? confidence.dash;
                  return (
                    <path
                      key={`path-${edge.from}-${edge.to}`}
                      d={edgePath(from, to)}
                      fill="none"
                      stroke={confidence.stroke}
                      strokeWidth={strength === 'Weak' ? 1.5 : 2}
                      strokeDasharray={dashArray}
                      opacity={strength === 'Weak' ? 0.6 : 0.9}
                      markerEnd={`url(#arrow-${edge.confidence})`}
                    />
                  );
                })}
                </g>

                {TREE_LEVELS.map((level) => (
                  <g key={level}>
                    <rect x={8} y={LEVEL_Y[level]} width={220} height={38} rx={19} fill="rgba(15,23,42,0.06)" stroke="rgba(15,23,42,0.05)" />
                    <text x={24} y={LEVEL_Y[level] + 16} fill={colors.blackPepper600} fontSize="12" fontWeight="700">{level}</text>
                    <text x={24} y={LEVEL_Y[level] + 29} fill={colors.blackPepper400} fontSize="10">{formatLevelSummary(level)}</text>
                  </g>
                ))}
                <g transform={`translate(${TREE_CONTENT_OFFSET_X}, 0)`}>
                {TREE_EDGES.map((edge) => {
                  const from = nodeMap.get(edge.from);
                  const to = nodeMap.get(edge.to);
                  if (!from || !to) return null;
                  const insight = edgeInsights.find((item) => item.from === edge.from && item.to === edge.to);
                  const strength = insight?.strength ?? 'Weak';
                  const strengthStyle = STRENGTH_STYLE[strength] ?? STRENGTH_STYLE.Weak;
                  const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
                  const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
                  const labelX = ((from.x + fromWidth / 2) + (to.x + toWidth / 2)) / 2;
                  const labelY = ((from.y < to.y ? from.y + NODE_HEIGHT : from.y) + (from.y < to.y ? to.y : to.y + NODE_HEIGHT)) / 2 - 10;
                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <title>{correlationTooltip(edge.label, insight?.correlation ?? null, insight?.overlapPoints ?? 0, strength)}</title>
                      {/* Edge label pill */}
                      <rect x={labelX - 78} y={labelY - 13} width={156} height={30} rx={12} fill="#ffffff" opacity={0.94} />
                      <text x={labelX} y={labelY} textAnchor="middle" fill={colors.blackPepper500} fontSize="10" fontWeight="600">{edge.label}</text>
                      {/* Strength pill with info indicator */}
                      <rect x={labelX - 26} y={labelY + 3} width={52} height={16} rx={8} fill={strengthStyle.bg} />
                      <text x={labelX} y={labelY + 14} textAnchor="middle" fill={strengthStyle.fg} fontSize="9" fontWeight="700">{strength}</text>
                      <text x={labelX + 30} y={labelY + 13} fill={strengthStyle.fg} fontSize="8" opacity={0.7}>{'\u24D8'}</text>
                    </g>
                  );
                })}
                </g>
                <defs>
                  {(['Measured', 'Directional'] as MetricTreeConfidence[]).map((c) => (
                    <marker key={c} id={`arrow-${c}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIDENCE_STYLE[c].stroke} />
                    </marker>
                  ))}
                </defs>
              </svg>

              {treeNodes.map((node) => (
                <NodeCard key={node.id} node={node} xOffset={TREE_CONTENT_OFFSET_X} selected={selectedNodeId === node.id} onSelect={(nodeId) => { setSelectedNodeId(nodeId); const n = nodeMap.get(nodeId); if (n) setViewForNode(n, 0.9); }} />
              ))}
              </div>
            </div>
          </div>

          <Flex gap="xxs" style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 2, padding: 6, borderRadius: 999, background: 'rgba(255,255,255,0.92)', border: `1px solid ${colors.soap300}`, backdropFilter: 'blur(10px)' }}>
            <SecondaryButton size="small" onClick={() => setView((c) => ({ ...c, scale: clamp(c.scale * 0.9, 0.48, 1.4) }))} style={{ minHeight: 28, padding: '2px 10px', fontSize: 13 }}>-</SecondaryButton>
            <SecondaryButton size="small" onClick={() => setView((c) => ({ ...c, scale: clamp(c.scale * 1.12, 0.48, 1.4) }))} style={{ minHeight: 28, padding: '2px 10px', fontSize: 13 }}>+</SecondaryButton>
            <SecondaryButton size="small" onClick={() => setView({ x: 48, y: 18, scale: 0.74 })} style={{ minHeight: 28, padding: '2px 10px', fontSize: 11 }}>Reset</SecondaryButton>
          </Flex>
        </Box>
      </Box>

      <WorkdayModal
        title="How to read this value driver tree"
        isOpen={explainMetricsOpen}
        onClose={() => setExplainMetricsOpen(false)}
        secondaryActionText="Close"
        width="620px"
      >
        <Flex flexDirection="column" gap="m">
          <Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xxs">What this view is for</BodyText>
            <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
              This is a value driver tree for Workday Recruiting. It connects outcomes you care about (chiefly how fast we hire, and how productive recruiters are) to product and usage signals further down the chain. It is a map for prioritisation and conversation, not a proof that one metric caused another.
            </BodyText>
          </Box>
          <Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xxs">Types of metrics you will see</BodyText>
            <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
              The rows group metrics into four layers: business value outcomes at the top, then product value outcomes, then user outcomes, then feature adoption and usage at the bottom. Higher layers are the results we want; lower layers are behaviours and adoption that we believe can influence those results.
            </BodyText>
          </Box>
          <Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xxs">Where the numbers come from</BodyText>
            <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
              {TREE_META.sourceSummary} Filters (segment, region, industry, tenant) narrow which customers feed the charts so you can compare like-for-like cohorts when data allows.
            </BodyText>
          </Box>
          <Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xxs">What the labels mean</BodyText>
            <BodyText as="p" size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, margin: '0 0 8px 0' }}>
              Each box is one metric with its latest value and a short trend. The curved lines show how we think work flows between metrics. The small text on each link is the relationship name (for example which outcome a behaviour is meant to support).
            </BodyText>
            <BodyText as="p" size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, margin: 0 }}>
              Each link is tagged in the data as measured or directional (how strong the underlying evidence is for that relationship in our model). Separately, you will see Strong, Moderate, or Weak for how closely the two metrics moved together in recent months. Weak co-movement is also drawn a little lighter on the canvas so it does not look as strong as moderate or strong links.
            </BodyText>
          </Box>
          <Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xxs">How link strength is worked out</BodyText>
            <BodyText as="p" size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, margin: '0 0 8px 0' }}>
              For each pair of metrics we line up the same calendar months and ask, in plain terms, whether the two series rise and fall together. That produces a score from weak to strong. We only show moderate or strong when there are at least {MIN_CORRELATION_OVERLAP} overlapping months; otherwise we keep the label weak so we do not over-claim from a thin slice of history.
            </BodyText>
            <BodyText as="p" size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, margin: 0 }}>
              Treat these strengths as exploratory: they help you spot patterns worth a deeper dive, not as statistical proof of causation. The detail panel can show a p-value for analysts; for product decisions, lean on the caveats and on whether the story matches how recruiting actually works in your segment.
            </BodyText>
          </Box>
        </Flex>
      </WorkdayModal>

      {/* Detail rail */}
      <Box
        onClick={(event) => event.stopPropagation()}
        style={{
          position: 'absolute', top: 0, right: 0, width: RAIL_WIDTH, height: '100%',
          background: 'rgba(255,255,255,0.98)', borderLeft: `1px solid ${colors.soap300}`, boxShadow: '-10px 0 24px rgba(15,23,42,0.08)',
          transform: selectedNode ? 'translateX(0)' : `translateX(${RAIL_WIDTH}px)`, transition: 'transform 180ms ease',
          overflowY: 'auto', pointerEvents: selectedNode ? 'auto' : 'none', padding: 20,
        }}
      >
        {selectedNode ? (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" gap="s" style={{ marginBottom: 12 }}>
              <Box>
                <Heading size="small" marginBottom="xxs">{selectedNode.title}</Heading>
                <BodyText size="small" color={colors.blackPepper400}>{selectedNode.level}</BodyText>
              </Box>
              <button type="button" onClick={() => setSelectedNodeId(null)} style={{ border: 'none', background: 'transparent', color: colors.blackPepper500, fontSize: 20, lineHeight: 1, cursor: 'pointer' }} aria-label="Close details">x</button>
            </Flex>

            <div style={{ fontSize: 30, fontWeight: 700, color: colors.blackPepper600, marginBottom: 4 }}>{selectedNode.value}</div>
            <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 12 }}>{selectedNode.valueContext}</BodyText>

            {(() => {
              const upstreamIds = getUpstreamPath(selectedNode.id);
              const firstAdoptionYm = FEATURE_FIRST_ADOPTION[selectedNode.id];
              const { labels, datasets, adoptionLineIndex } = buildMultiSeriesChartData(
                selectedNode.id,
                upstreamIds,
                firstAdoptionYm
              );
              const detailOptions = buildDetailChartOptions(adoptionLineIndex, labels);
              return (
                <div style={{ height: 320, marginBottom: 16 }}>
                  <Line data={{ labels, datasets }} options={detailOptions} />
                </div>
              );
            })()}

            <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, marginBottom: 14 }}>{selectedNode.definition}</BodyText>

            {selectedNode.caveat ? (
              <Box style={{ borderRadius: 12, padding: 12, background: '#fff8eb', border: '1px solid #f1d199', marginBottom: 16 }}>
                <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.5 }}><strong>Caveat:</strong> {selectedNode.caveat}</BodyText>
              </Box>
            ) : null}

            <Heading size="small" marginBottom="xs">Connected driver relationships</Heading>
            <Flex flexDirection="column" gap="s">
              {connectedEdges.map((edge) => {
                const peerId = edge.from === selectedNode.id ? edge.to : edge.from;
                const peerNode = nodeMap.get(peerId);
                if (!peerNode) return null;
                const sStyle = STRENGTH_STYLE[edge.strength] ?? STRENGTH_STYLE.Weak;
                return (
                  <Box key={`${edge.from}-${edge.to}`} style={{ borderRadius: 12, padding: 12, border: `1px solid ${colors.soap300}`, background: '#fff' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.blackPepper600, marginBottom: 4 }}>{peerNode.title}</div>
                    <div style={{ fontSize: 12, color: colors.blackPepper500, marginBottom: 4 }}>
                      {edge.label} · <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 6, background: sStyle.bg, color: sStyle.fg, fontSize: 10, fontWeight: 700 }}>{edge.strength}</span>
                      {edge.correlation != null ? ` (r=${edge.correlation.toFixed(2)}, n=${edge.overlapPoints}, ${formatPValue(edge.pValue)})` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: colors.blackPepper400, marginBottom: 4 }}>Fisher z-transformed p-value for two-tailed test of H₀: ρ = 0.</div>
                    {edge.pValue != null && edge.pValue >= 0.05 && (
                      <div style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: '#fff3e0', color: '#e67700' }}>
                        ⚠️ Not statistically significant (p ≥ 0.05). Treat as exploratory.
                      </div>
                    )}
                  </Box>
                );
              })}
            </Flex>
          </>
        ) : null}
      </Box>
    </Box>
  );
};
