import React, { useMemo, useRef, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FormSelect } from './components';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import {
  TREE_META,
  TREE_NODES,
  TREE_EDGES,
  TREE_LEVELS,
  type MetricTreeConfidence,
  type MetricTreeNode,
  type TrendGoodDirection,
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip);

type ViewportState = { x: number; y: number; scale: number };
type DragState = { active: boolean; pointerX: number; pointerY: number; originX: number; originY: number };

const NODE_HEIGHT = 138;
const DEFAULT_NODE_WIDTH = 228;
const RAIL_WIDTH = 360;

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
    dash: '1.5 5',
    badge: 'Measured',
  },
  Directional: {
    bg: colors.blueberry100,
    fg: colors.blueberry600,
    stroke: colors.blueberry400,
    dash: '1.5 5',
    badge: 'Directional',
  },
};

const STRENGTH_STYLE: Record<string, { bg: string; fg: string }> = {
  Strong: { bg: colors.greenApple100, fg: colors.greenApple600 },
  Moderate: { bg: '#fff3e0', fg: '#e67700' },
  Weak: { bg: colors.soap200, fg: colors.blackPepper500 },
};

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

const MIN_CORRELATION_OVERLAP = 6;

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

// ── Filtered node builder helpers ──

function buildFilteredTthNode(filteredTenants: string[], base: MetricTreeNode): MetricTreeNode {
  const labels = Array.from(new Set(filteredTenants.flatMap((t) => (TENANT_TIME_SERIES[t] ?? []).map((p) => p.ym)))).sort();
  const trendPoints = labels.map((ym) => {
    const values = filteredTenants
      .map((t) => TENANT_TIME_SERIES[t]?.find((p) => p.ym === ym)?.v)
      .filter((v): v is number => v != null && Number.isFinite(v));
    return values.length > 0 ? { ym, value: values.reduce((a, b) => a + b, 0) / values.length } : null;
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
    return values.length > 0 ? { ym, value: values.reduce((a, b) => a + b, 0) / values.length } : null;
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

function NodeCard({ node, selected, onSelect }: { node: MetricTreeNode; selected: boolean; onSelect: (id: string) => void }) {
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
        left: node.x,
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
      <div style={{ fontSize: 12, fontWeight: 600, color: colors.blackPepper500, lineHeight: 1.25, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
        return { ...edge, correlation, strength, overlapPoints };
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
    setView({ scale, x: rect.width / 2 - (node.x + nodeWidth / 2) * scale, y: rect.height / 3 - (node.y + NODE_HEIGHT / 2) * scale });
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

  return (
    <Box style={{ position: 'relative', height: '100vh', overflow: 'hidden', backgroundColor: SANA_PAGE_CANVAS }}>
      {/* Viewport */}
      <div
        ref={viewportRef}
        onClick={() => { if (!dragMovedRef.current) setSelectedNodeId(null); }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: canvasWidth, overflow: 'hidden',
          cursor: drag.active ? 'grabbing' : 'grab', backgroundColor: SANA_PAGE_CANVAS,
          backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div style={{ position: 'absolute', width: TREE_META.canvas.width, height: TREE_META.canvas.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: 'top left' }}>
          <svg width={TREE_META.canvas.width} height={TREE_META.canvas.height} viewBox={`0 0 ${TREE_META.canvas.width} ${TREE_META.canvas.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {TREE_EDGES.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const confidence = CONFIDENCE_STYLE[edge.confidence];
              return (
                <path
                  key={`path-${edge.from}-${edge.to}`}
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={confidence.stroke}
                  strokeWidth={2}
                  strokeDasharray={confidence.dash}
                  opacity={0.9}
                  markerEnd={`url(#arrow-${edge.confidence})`}
                />
              );
            })}

            {TREE_LEVELS.map((level) => (
              <g key={level}>
                <rect x={32} y={LEVEL_Y[level]} width={310} height={38} rx={19} fill="rgba(15,23,42,0.06)" stroke="rgba(15,23,42,0.05)" />
                <text x={50} y={LEVEL_Y[level] + 16} fill={colors.blackPepper600} fontSize="12" fontWeight="700">{level}</text>
                <text x={50} y={LEVEL_Y[level] + 29} fill={colors.blackPepper400} fontSize="10">{formatLevelSummary(level)}</text>
              </g>
            ))}

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
                  <title>{edge.label}{insight?.correlation != null ? ` · r=${insight.correlation.toFixed(2)} · n=${insight.overlapPoints}` : ''}</title>
                  {/* Edge label pill */}
                  <rect x={labelX - 78} y={labelY - 13} width={156} height={30} rx={12} fill="#ffffff" opacity={0.94} />
                  <text x={labelX} y={labelY} textAnchor="middle" fill={colors.blackPepper500} fontSize="10" fontWeight="600">{edge.label}</text>
                  {/* Strength pill */}
                  <rect x={labelX - 26} y={labelY + 3} width={52} height={16} rx={8} fill={strengthStyle.bg} />
                  <text x={labelX} y={labelY + 14} textAnchor="middle" fill={strengthStyle.fg} fontSize="9" fontWeight="700">{strength}</text>
                </g>
              );
            })}
            <defs>
              {(['Measured', 'Directional'] as MetricTreeConfidence[]).map((c) => (
                <marker key={c} id={`arrow-${c}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIDENCE_STYLE[c].stroke} />
                </marker>
              ))}
            </defs>
          </svg>

          {treeNodes.map((node) => (
            <NodeCard key={node.id} node={node} selected={selectedNodeId === node.id} onSelect={(nodeId) => { setSelectedNodeId(nodeId); const n = nodeMap.get(nodeId); if (n) setViewForNode(n, 0.9); }} />
          ))}
        </div>
      </div>

      {/* Filter bar (top-left) */}
      <Box
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap',
          padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.95)', border: `1px solid ${colors.soap300}`, backdropFilter: 'blur(10px)', maxWidth: 680,
        }}
      >
        <Box style={{ width: 140 }}><FormSelect id="tree-segment" label="Segment" value={filters.segment} onChange={(v) => updateFilter('segment', v)} options={SEGMENT_FILTER_OPTIONS} /></Box>
        <Box style={{ width: 140 }}><FormSelect id="tree-region" label="Region" value={filters.region} onChange={(v) => updateFilter('region', v)} options={REGION_FILTER_OPTIONS} /></Box>
        <Box style={{ width: 160 }}><FormSelect id="tree-industry" label="Industry" value={filters.industry} onChange={(v) => updateFilter('industry', v)} options={INDUSTRY_FILTER_OPTIONS} /></Box>
        <Box style={{ width: 140 }}><FormSelect id="tree-tenant" label="Tenant" value={filters.tenant} onChange={(v) => updateFilter('tenant', v)} options={tenantOptions} /></Box>
        {isFiltered && (
          <SecondaryButton size="small" onClick={() => setFilters(EMPTY_DASHBOARD_FILTERS)} style={{ marginBottom: 2 }}>Clear</SecondaryButton>
        )}
      </Box>

      {isFiltered && filterParts.length > 0 && (
        <Box style={{ position: 'absolute', top: 80, left: 16, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.9)', fontSize: 11, color: colors.blackPepper500 }}>
          Scope: {filterParts.join(' · ')} — all metrics filtered to matching tenants
        </Box>
      )}
      <Box style={{ position: 'absolute', top: isFiltered ? 104 : 80, left: 16, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.9)', fontSize: 11, color: colors.blackPepper500 }}>
        Correlation strength uses month-aligned overlap (min {MIN_CORRELATION_OVERLAP} points for Moderate/Strong) and is exploratory, not causal.
      </Box>

      {/* Zoom controls */}
      <Flex gap="s" style={{ position: 'absolute', top: 16, right: selectedNode ? RAIL_WIDTH + 16 : 16, padding: 8, borderRadius: 999, background: 'rgba(255,255,255,0.92)', border: `1px solid ${colors.soap300}`, backdropFilter: 'blur(10px)' }}>
        <SecondaryButton size="small" onClick={() => setView((c) => ({ ...c, scale: clamp(c.scale * 0.9, 0.48, 1.4) }))}>-</SecondaryButton>
        <SecondaryButton size="small" onClick={() => setView((c) => ({ ...c, scale: clamp(c.scale * 1.12, 0.48, 1.4) }))}>+</SecondaryButton>
        <SecondaryButton size="small" onClick={() => setView({ x: 48, y: 18, scale: 0.74 })}>Reset</SecondaryButton>
      </Flex>

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

            <div style={{ height: 180, marginBottom: 16 }}>
              <Line data={chartData(selectedNode.trend.length > 0 ? selectedNode.trend : [0], colors.blueberry400, `${colors.blueberry400}22`)} options={railChartOptions} />
            </div>

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
                      {edge.correlation != null ? ` (r=${edge.correlation.toFixed(2)}, n=${edge.overlapPoints})` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: colors.blackPepper400 }}>Based on aligned recent trend points for the connected metrics.</div>
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
