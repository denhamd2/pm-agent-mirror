import React, { useMemo, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DashboardGlobalNav, MetricCard, PageHeader, FormSelect } from './components';
import { SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW, SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import {
  QUERY_META,
  LABELS,
  CONTEXT_SERIES as GLOBAL_CONTEXT_SERIES,
  INTERPRETATION_GUIDANCE,
} from './data-recruiter-capacity';
import { INDUSTRY_DATA, REGION_DATA, SIZE_DATA, type SegmentMonthly } from './data-interview-filters';
import { RECRUITER_CAPACITY_TENANT_SERIES } from './data-dashboard-tenant-filters';
import {
  aggregateTenantSeries,
  describeActiveFilters,
  EMPTY_DASHBOARD_FILTERS,
  filterTenantNames,
  INDUSTRY_FILTER_OPTIONS,
  normaliseTenantInput,
  REGION_FILTER_OPTIONS,
  SEGMENT_FILTER_OPTIONS,
  type DashboardFilterState,
} from './dashboard-filter-utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

type TabId = 'overview' | 'trend' | 'context' | 'guide';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'trend', label: 'Trend' },
  { id: 'context', label: 'Context' },
  { id: 'guide', label: 'Interpretation' },
];

const chartCardStyle: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
  border: `1px solid ${colors.soap300}`,
  backgroundColor: colors.frenchVanilla100,
};

const baseLineOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, padding: 14, font: { family: 'Roboto', size: 12 } },
    },
    tooltip: {
      backgroundColor: '#0b1f42',
      titleFont: { family: 'Roboto' },
      bodyFont: { family: 'Roboto' },
      cornerRadius: 8,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: colors.blackPepper400, font: { family: 'Roboto', size: 11 } },
    },
    y: {
      grid: { color: colors.soap200 },
      ticks: { color: colors.blackPepper400, font: { family: 'JetBrains Mono, monospace', size: 11 } },
    },
  },
};

function lastValue(rows: Array<{ value: number | null }>): number | null {
  return rows[rows.length - 1]?.value ?? null;
}

function previousValue(rows: Array<{ value: number | null }>): number | null {
  return rows[rows.length - 2]?.value ?? null;
}

function sentimentForChange(current: number | null, previous: number | null, lowerIsBetter = false): 'positive' | 'negative' | 'neutral' {
  if (current == null || previous == null || current === previous) return 'neutral';
  const improved = lowerIsBetter ? current < previous : current > previous;
  return improved ? 'positive' : 'negative';
}

function formatSeriesDelta(rows: Array<{ value: number | null }>, digits = 1): string {
  const current = lastValue(rows);
  const previous = previousValue(rows);
  if (current == null || previous == null) return 'Latest visible month';
  const delta = current - previous;
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(digits)} vs prev month`;
}

type ContextPoint = { ym: string; value: number | null };

type ScopedContextSeries = {
  jobApplicationsPerTenant: ContextPoint[];
  interviewRoundsPerTenant: ContextPoint[];
  interviewSessionsPerTenant: ContextPoint[];
  avgTimeInInterviewBp: ContextPoint[];
  misstSessionsPerReq: ContextPoint[];
  recruitingCoreAdoptionPct: ContextPoint[];
};

type CapacityTrendPoint = {
  ym: string;
  value: number | null;
  tenants: number;
  min: number | null;
  max: number | null;
};

type DashboardKpi = {
  label: string;
  value: string;
  helperText: string;
  changeIndicator?: { text: string; sentiment: 'positive' | 'negative' | 'neutral' };
  tooltip: string;
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hasDefinedValues(rows: ContextPoint[]): boolean {
  return rows.some((row) => row.value != null);
}

function nullSeries(): ContextPoint[] {
  return LABELS.map((ym) => ({ ym, value: null }));
}

function alignSegmentMetric(
  rows: SegmentMonthly[],
  accessor: (row: SegmentMonthly) => number | null
): ContextPoint[] {
  const byMonth = new Map(rows.map((row) => [row.ym, row]));
  return LABELS.map((ym) => {
    const row = byMonth.get(ym);
    return { ym, value: row ? accessor(row) : null };
  });
}

function buildScopedContextSeries(rows: SegmentMonthly[]): ScopedContextSeries {
  return {
    jobApplicationsPerTenant: alignSegmentMetric(rows, (row) => (row.tenants > 0 ? row.jobApps / row.tenants : null)),
    interviewRoundsPerTenant: alignSegmentMetric(rows, (row) => (row.tenants > 0 ? row.rounds / row.tenants : null)),
    interviewSessionsPerTenant: nullSeries(),
    avgTimeInInterviewBp: alignSegmentMetric(rows, (row) => row.avgBpDays),
    misstSessionsPerReq: nullSeries(),
    recruitingCoreAdoptionPct: nullSeries(),
  };
}

function buildDirectionalIndex(
  capacityTrend: CapacityTrendPoint[],
  contextSeries: ScopedContextSeries
): ContextPoint[] {
  const bundles = [
    { rows: capacityTrend.map((row) => ({ ym: row.ym, value: row.value })), weight: 0.45 },
    { rows: contextSeries.jobApplicationsPerTenant, weight: 0.25 },
    { rows: contextSeries.interviewRoundsPerTenant, weight: 0.15 },
    { rows: contextSeries.avgTimeInInterviewBp, weight: 0.15 },
  ];

  const baselines = bundles.map((bundle) => {
    const values = bundle.rows.flatMap((row) => (row.value == null ? [] : [row.value]));
    return average(values);
  });

  return LABELS.map((ym) => {
    let weightedTotal = 0;
    let totalWeight = 0;
    bundles.forEach((bundle, index) => {
      const point = bundle.rows.find((row) => row.ym === ym);
      const baseline = baselines[index];
      if (!point || point.value == null || baseline <= 0) return;
      weightedTotal += (point.value / baseline) * bundle.weight;
      totalWeight += bundle.weight;
    });
    return { ym, value: totalWeight > 0 ? (weightedTotal / totalWeight) * 100 : null };
  });
}

function buildHeadlineKpis(
  capacityTrend: CapacityTrendPoint[],
  pressureIndex: ContextPoint[],
  scopeLabel: string
): DashboardKpi[] {
  const latest = capacityTrend[capacityTrend.length - 1];
  const previous = capacityTrend[capacityTrend.length - 2];
  const capacityValues = capacityTrend.flatMap((point) => (point.value == null ? [] : [point.value]));
  const minCapacity = capacityValues.length > 0 ? Math.min(...capacityValues) : null;
  const maxCapacity = capacityValues.length > 0 ? Math.max(...capacityValues) : null;
  const avgCapacity = capacityValues.length > 0 ? average(capacityValues) : null;
  const latestPressure = lastValue(pressureIndex);
  const previousPressure = previousValue(pressureIndex);

  return [
    {
      label: 'Recruiter Capacity',
      value: latest?.value == null ? 'Unavailable' : `${latest.value.toFixed(1)} avg reqs`,
      helperText: `${latest?.tenants.toLocaleString() ?? '0'} tenants · ${scopeLabel}`,
      changeIndicator: latest?.value != null && previous?.value != null
        ? {
            text: formatSeriesDelta(capacityTrend.map((point) => ({ value: point.value }))),
            sentiment: latest.value > previous.value ? 'negative' : 'positive',
          }
        : undefined,
      tooltip:
        'Tracker wording is Recruiter Capacity. The live warehouse metric name is Recruiter Productivity, defined as the average open requisitions and evergreens per primary recruiter.',
    },
    {
      label: 'Reporting tenants',
      value: (latest?.tenants ?? 0).toLocaleString(),
      helperText: `Latest visible month ${latest?.ym ?? LABELS[LABELS.length - 1]}`,
      changeIndicator: previous
        ? {
            text: `${(latest?.tenants ?? 0) - previous.tenants} vs prev month`,
            sentiment: 'neutral' as const,
          }
        : undefined,
      tooltip:
        'Number of tenants contributing to the selected recruiter-load scope in the latest visible month.',
    },
    {
      label: 'Operating range',
      value: minCapacity == null || maxCapacity == null ? 'Unavailable' : `${minCapacity.toFixed(1)} - ${maxCapacity.toFixed(1)}`,
      helperText: avgCapacity == null ? 'Visible series range' : `Trailing average ${avgCapacity.toFixed(1)}`,
      changeIndicator: latest?.value != null && avgCapacity != null
        ? {
            text: latest.value >= avgCapacity ? 'Above trailing average' : 'Below trailing average',
            sentiment: latest.value >= avgCapacity ? 'negative' : 'positive',
          }
        : undefined,
      tooltip:
        'Observed monthly operating range for recruiter load in the visible series. This is a time-series range, not a tenant percentile distribution.',
    },
    {
      label: 'Modelled pressure index',
      value: latestPressure == null ? 'Unavailable' : latestPressure.toFixed(0),
      helperText: 'Directional index combining recruiter load, application volume, rounds, and Interview BP time',
      changeIndicator:
        latestPressure != null && previousPressure != null
          ? {
              text: formatSeriesDelta(pressureIndex, 0),
              sentiment: latestPressure > previousPressure ? 'negative' : 'positive',
            }
          : undefined,
      tooltip:
        'Directional, not causal. The index is normalised to each visible series mean so PMs can see whether recruiter load is rising alongside adjacent throughput and timing pressure.',
    },
  ];
}

function buildContextKpis(contextSeries: ScopedContextSeries): DashboardKpi[] {
  const interviewBpCurrent = lastValue(contextSeries.avgTimeInInterviewBp);
  const interviewBpPrev = previousValue(contextSeries.avgTimeInInterviewBp);
  const adoptionCurrent = lastValue(contextSeries.recruitingCoreAdoptionPct);
  const adoptionPrev = previousValue(contextSeries.recruitingCoreAdoptionPct);
  const applicationsCurrent = lastValue(contextSeries.jobApplicationsPerTenant);
  const misstCurrent = lastValue(contextSeries.misstSessionsPerReq);

  return [
    {
      label: 'Avg time in Interview BP',
      value: interviewBpCurrent == null ? 'Unavailable' : `${interviewBpCurrent.toFixed(1)} days`,
      helperText: 'Context signal for downstream cycle-time pressure',
      changeIndicator:
        interviewBpCurrent != null && interviewBpPrev != null
          ? {
              text: formatSeriesDelta(contextSeries.avgTimeInInterviewBp),
              sentiment: interviewBpCurrent > interviewBpPrev ? 'negative' : 'positive',
            }
          : undefined,
      tooltip:
        'Average completed-path time in the Interview business process. This helps distinguish healthy load absorption from cycle-time deterioration.',
    },
    {
      label: 'Recruiting adoption context',
      value: adoptionCurrent == null ? 'Unavailable' : `${adoptionCurrent.toFixed(1)}%`,
      helperText: 'Leading product-use context signal',
      changeIndicator:
        adoptionCurrent != null && adoptionPrev != null
          ? {
              text: formatSeriesDelta(contextSeries.recruitingCoreAdoptionPct),
              sentiment: adoptionCurrent >= adoptionPrev ? 'positive' : 'negative',
            }
          : undefined,
      tooltip:
        'Higher is better. This is a leading product-use context series, not a direct recruiter-capacity measure.',
    },
    {
      label: 'Applications per reporting tenant',
      value: applicationsCurrent == null ? 'Unavailable' : applicationsCurrent.toFixed(1),
      helperText: 'Volume context',
      tooltip:
        'Average monthly applications per reporting tenant. Higher recruiter load is more concerning when pipeline volume is rising at the same time.',
    },
    {
      label: 'MISST sessions per req',
      value: misstCurrent == null ? 'Unavailable' : misstCurrent.toFixed(2),
      helperText: 'Scheduling context',
      tooltip:
        'Average interview sessions created per requisition. This helps PMs separate recruiter load from downstream scheduling complexity.',
    },
  ];
}

function OverviewTab({
  capacityTrend,
  pressureIndex,
  contextNote,
}: {
  capacityTrend: CapacityTrendPoint[];
  pressureIndex: ContextPoint[];
  contextNote: string | null;
}) {
  const capacityValues = capacityTrend.map((point) => point.value);
  const pressureValues = pressureIndex.map((point) => point.value);

  return (
    <Flex flexDirection="column" gap="l">
      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '2 1 520px', minWidth: 320 }}>
          <Heading size="small" marginBottom="s">
            Recruiter load vs directional pressure
          </Heading>
          <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 16 }}>
            The blue line is the live recruiter-load IUM. The darker line is a directional pressure index built from the
            visible recruiter-load scope plus any matching context series that are materialised in the repo.
          </BodyText>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Recruiter Capacity',
                    data: capacityValues,
                    borderColor: colors.blueberry500,
                    backgroundColor: 'rgba(0,112,210,0.10)',
                    pointRadius: 2,
                    tension: 0.28,
                    fill: false,
                  },
                  {
                    label: 'Modelled pressure index',
                    data: pressureValues,
                    borderColor: colors.blackPepper500,
                    backgroundColor: 'rgba(56,65,74,0.08)',
                    pointRadius: 2,
                    tension: 0.28,
                    fill: false,
                    yAxisID: 'y1',
                  },
                ],
              }}
              options={{
                ...baseLineOptions,
                scales: {
                  ...baseLineOptions.scales,
                  y: {
                    ...baseLineOptions.scales.y,
                    title: { display: true, text: 'Avg open reqs per recruiter' },
                  },
                  y1: {
                    position: 'right' as const,
                    grid: { drawOnChartArea: false },
                    ticks: { color: colors.blackPepper400, font: { family: 'JetBrains Mono, monospace', size: 11 } },
                    title: { display: true, text: 'Index' },
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card style={{ ...chartCardStyle, flex: '1 1 320px', minWidth: 280 }}>
          <Heading size="small" marginBottom="s">
            PM readout
          </Heading>
          <Flex flexDirection="column" gap="m">
            <Box>
              <BodyText size="small" color={colors.blackPepper500} style={{ fontWeight: 600 }}>
                What this metric means
              </BodyText>
              <BodyText size="small" color={colors.blackPepper400}>
                It measures the average number of open job requisitions and evergreens per primary recruiter. Higher values
                can reflect healthy scale, but only if cycle time stays controlled.
              </BodyText>
            </Box>
            <Box>
              <BodyText size="small" color={colors.blackPepper500} style={{ fontWeight: 600 }}>
                What to watch next
              </BodyText>
              <BodyText size="small" color={colors.blackPepper400}>
                Compare rising recruiter load with applications per tenant, interview rounds per tenant, and Interview BP
                time. If all move up together, the product likely needs efficiency help rather than just more usage.
              </BodyText>
            </Box>
            <Box>
              <BodyText size="small" color={colors.blackPepper500} style={{ fontWeight: 600 }}>
                Important boundary
              </BodyText>
              <BodyText size="small" color={colors.blackPepper400}>
                This page tracks recruiter load. It does not replace the Interview dashboard&apos;s scheduling-capacity views for
                coordinators and raters.
              </BodyText>
            </Box>
          </Flex>
        </Card>
      </Flex>

      {contextNote && (
        <Card style={chartCardStyle}>
          <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
            <strong>Context note:</strong> {contextNote}
          </BodyText>
        </Card>
      )}
    </Flex>
  );
}

function TrendTab({
  capacityTrend,
  contextSeries,
}: {
  capacityTrend: CapacityTrendPoint[];
  contextSeries: ScopedContextSeries;
}) {
  return (
    <Flex flexDirection="column" gap="l">
      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '2 1 520px', minWidth: 320 }}>
          <Heading size="small" marginBottom="s">
            Recruiter Capacity trend
          </Heading>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Recruiter Capacity',
                    data: capacityTrend.map((point) => point.value),
                    borderColor: colors.blueberry500,
                    backgroundColor: 'rgba(0,112,210,0.12)',
                    fill: true,
                    pointRadius: 2,
                    tension: 0.3,
                  },
                ],
              }}
              options={baseLineOptions}
            />
          </div>
        </Card>

        <Card style={{ ...chartCardStyle, flex: '1 1 320px', minWidth: 280 }}>
          <Heading size="small" marginBottom="s">
            Reporting coverage
          </Heading>
          <div style={{ height: 320 }}>
            <Bar
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Reporting tenants',
                    data: capacityTrend.map((point) => point.tenants),
                    backgroundColor: colors.soap400,
                    borderRadius: 6,
                  },
                ],
              }}
              options={baseLineOptions}
            />
          </div>
        </Card>
      </Flex>

      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '1 1 420px', minWidth: 300 }}>
          <Heading size="small" marginBottom="s">
            Applications and interview rounds per tenant
          </Heading>
          <div style={{ height: 300 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Applications per tenant',
                    data: contextSeries.jobApplicationsPerTenant.map((point) => point.value),
                    borderColor: colors.cantaloupe400,
                    backgroundColor: 'rgba(255,159,10,0.10)',
                    pointRadius: 2,
                    tension: 0.28,
                  },
                  {
                    label: 'Interview rounds per tenant',
                    data: contextSeries.interviewRoundsPerTenant.map((point) => point.value),
                    borderColor: colors.greenApple500,
                    backgroundColor: 'rgba(51,153,102,0.10)',
                    pointRadius: 2,
                    tension: 0.28,
                  },
                ],
              }}
              options={baseLineOptions}
            />
          </div>
        </Card>

        <Card style={{ ...chartCardStyle, flex: '1 1 420px', minWidth: 300 }}>
          <Heading size="small" marginBottom="s">
            Interview sessions per tenant
          </Heading>
          <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 10 }}>
            A rise here suggests recruiter load is being accompanied by more downstream coordination work.
          </BodyText>
          <div style={{ height: 300 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Interview sessions per tenant',
                    data: contextSeries.interviewSessionsPerTenant.map((point) => point.value),
                    borderColor: colors.blackPepper500,
                    backgroundColor: 'rgba(56,65,74,0.08)',
                    pointRadius: 2,
                    tension: 0.28,
                    fill: true,
                  },
                ],
              }}
              options={baseLineOptions}
            />
          </div>
        </Card>
      </Flex>
    </Flex>
  );
}

function ContextTab({
  contextSeries,
  contextKpis,
  contextNote,
}: {
  contextSeries: ScopedContextSeries;
  contextKpis: ReturnType<typeof buildContextKpis>;
  contextNote: string | null;
}) {
  const hasMisst = hasDefinedValues(contextSeries.misstSessionsPerReq);
  const hasAdoption = hasDefinedValues(contextSeries.recruitingCoreAdoptionPct);

  return (
    <Flex flexDirection="column" gap="l">
      {contextNote && (
        <Card style={chartCardStyle}>
          <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
            <strong>Scope note:</strong> {contextNote}
          </BodyText>
        </Card>
      )}

      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '1 1 460px', minWidth: 320 }}>
          <Heading size="small" marginBottom="s">
            Time pressure context
          </Heading>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Avg time in Interview BP',
                    data: contextSeries.avgTimeInInterviewBp.map((point) => point.value),
                    borderColor: colors.peachSchnapps500,
                    backgroundColor: 'rgba(255,95,86,0.10)',
                    pointRadius: 2,
                    tension: 0.3,
                  },
                  ...(hasMisst
                    ? [{
                        label: 'MISST sessions per req',
                        data: contextSeries.misstSessionsPerReq.map((point) => point.value),
                        borderColor: colors.blueberry500,
                        backgroundColor: 'rgba(0,112,210,0.08)',
                        pointRadius: 2,
                        tension: 0.3,
                        yAxisID: 'y1',
                      }]
                    : []),
                ],
              }}
              options={{
                ...baseLineOptions,
                scales: {
                  ...baseLineOptions.scales,
                  y: {
                    ...baseLineOptions.scales.y,
                    title: { display: true, text: 'Days' },
                  },
                  ...(hasMisst
                    ? {
                        y1: {
                          position: 'right' as const,
                          grid: { drawOnChartArea: false },
                          ticks: { color: colors.blackPepper400, font: { family: 'JetBrains Mono, monospace', size: 11 } },
                          title: { display: true, text: 'Sessions / req' },
                        },
                      }
                    : {}),
                },
              }}
            />
          </div>
        </Card>

        <Card style={{ ...chartCardStyle, flex: '1 1 420px', minWidth: 300 }}>
          <Heading size="small" marginBottom="s">
            Product-usage context
          </Heading>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels: LABELS,
                datasets: [
                  {
                    label: 'Recruiting core adoption %',
                    data: contextSeries.recruitingCoreAdoptionPct.map((point) => point.value),
                    borderColor: colors.greenApple500,
                    backgroundColor: 'rgba(51,153,102,0.12)',
                    pointRadius: 2,
                    tension: 0.28,
                    fill: true,
                  },
                ],
              }}
              options={baseLineOptions}
            />
          </div>
          {!hasAdoption && (
            <BodyText size="small" color={colors.blackPepper400} style={{ marginTop: 10 }}>
              Adoption context is only materialised globally in the current repo snapshot.
            </BodyText>
          )}
        </Card>
      </Flex>

      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        {contextKpis.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            changeIndicator={metric.changeIndicator}
            tooltip={metric.tooltip}
          />
        ))}
      </Flex>
    </Flex>
  );
}

function GuideTab() {
  return (
    <Flex flexDirection="column" gap="l">
      <Card style={chartCardStyle}>
        <Heading size="small" marginBottom="s">
          How to read this dashboard
        </Heading>
        <BodyText size="small" color={colors.blackPepper400} style={{ lineHeight: 1.6 }}>
          Use Recruiter Capacity as the load signal, then read the surrounding series to understand whether the product is
          helping customers absorb that load efficiently. This page is deliberately separated from coordinator and rater
          capacity, which remain on the Interview Metrics dashboard.
        </BodyText>
      </Card>

      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        {INTERPRETATION_GUIDANCE.map((item) => (
          <Card key={item.title} style={{ ...chartCardStyle, flex: '1 1 280px', minWidth: 240 }}>
            <Heading size="small" marginBottom="xs">
              {item.title}
            </Heading>
            <BodyText size="small" color={colors.blackPepper400} style={{ lineHeight: 1.6 }}>
              {item.body}
            </BodyText>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
}

export const RecruiterCapacityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [filters, setFilters] = useState<DashboardFilterState>(EMPTY_DASHBOARD_FILTERS);

  const capacityTenants = useMemo(() => Object.keys(RECRUITER_CAPACITY_TENANT_SERIES), []);
  const exactTenant = useMemo(() => {
    const normalised = normaliseTenantInput(filters.tenant);
    return normalised && capacityTenants.includes(normalised) ? normalised : '';
  }, [capacityTenants, filters.tenant]);
  const effectiveFilters = useMemo(
    () => ({ ...filters, tenant: exactTenant }),
    [filters, exactTenant]
  );
  const filteredCapacityTenants = useMemo(
    () => filterTenantNames(capacityTenants, effectiveFilters),
    [capacityTenants, effectiveFilters]
  );
  const capacityTrend = useMemo(
    () =>
      aggregateTenantSeries(LABELS, filteredCapacityTenants, RECRUITER_CAPACITY_TENANT_SERIES).map((point) => ({
        ym: point.ym,
        value: point.avg,
        tenants: point.tenants,
        min: point.min,
        max: point.max,
      })),
    [filteredCapacityTenants]
  );

  const selectedDimensions = [
    filters.segment !== 'all' ? 'segment' : null,
    filters.region !== 'all' ? 'region' : null,
    filters.industry !== 'all' ? 'industry' : null,
  ].filter(Boolean) as Array<'segment' | 'region' | 'industry'>;

  const { contextSeries, contextNote } = useMemo(() => {
    if (exactTenant) {
      return {
        contextSeries: GLOBAL_CONTEXT_SERIES,
        contextNote:
          'Tenant-level recruiter-load filtering is live, but the surrounding context metrics are not materialised per individual tenant in this repo yet, so the context views stay on the global benchmark.',
      };
    }

    if (selectedDimensions.length > 1) {
      return {
        contextSeries: GLOBAL_CONTEXT_SERIES,
        contextNote:
          'The surrounding context series are only materialised globally or by a single aggregate dimension. With multiple aggregate filters selected, context falls back to the global benchmark.',
      };
    }

    if (selectedDimensions[0] === 'segment') {
      return {
        contextSeries: buildScopedContextSeries(SIZE_DATA.filter((row) => row.segment === filters.segment)),
        contextNote:
          'Context charts are scoped by company-size segment where that aggregate is available. Adoption, MISST, and interview-session context remain unavailable outside the global aggregate.',
      };
    }

    if (selectedDimensions[0] === 'region') {
      return {
        contextSeries: buildScopedContextSeries(REGION_DATA.filter((row) => row.segment === filters.region)),
        contextNote:
          'Context charts are scoped by business region where that aggregate is available. Adoption, MISST, and interview-session context remain unavailable outside the global aggregate.',
      };
    }

    if (selectedDimensions[0] === 'industry') {
      return {
        contextSeries: buildScopedContextSeries(INDUSTRY_DATA.filter((row) => row.segment === filters.industry)),
        contextNote:
          'Context charts are scoped by industry where that aggregate is available. Adoption, MISST, and interview-session context remain unavailable outside the global aggregate.',
      };
    }

    return { contextSeries: GLOBAL_CONTEXT_SERIES, contextNote: null };
  }, [exactTenant, filters.industry, filters.region, filters.segment, selectedDimensions]);

  const pressureIndex = useMemo(
    () => buildDirectionalIndex(capacityTrend, contextSeries),
    [capacityTrend, contextSeries]
  );
  const headlineKpis = useMemo(
    () => buildHeadlineKpis(capacityTrend, pressureIndex, describeActiveFilters(effectiveFilters).join(' · ') || 'selected scope'),
    [capacityTrend, pressureIndex, effectiveFilters]
  );
  const contextKpis = useMemo(() => buildContextKpis(contextSeries), [contextSeries]);

  const tabContent = useMemo(() => {
    if (activeTab === 'trend') return <TrendTab capacityTrend={capacityTrend} contextSeries={contextSeries} />;
    if (activeTab === 'context') return <ContextTab contextSeries={contextSeries} contextKpis={contextKpis} contextNote={contextNote} />;
    if (activeTab === 'guide') return <GuideTab />;
    return <OverviewTab capacityTrend={capacityTrend} pressureIndex={pressureIndex} contextNote={contextNote} />;
  }, [activeTab, capacityTrend, contextKpis, contextNote, contextSeries, pressureIndex]);

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="recruiter-capacity" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 8 }}>
            <a href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/value-realization-metrics`} style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Value Realisation</a>
          </div>
          <PageHeader title={QUERY_META.title} subtitle={QUERY_META.subtitle} />

          <BodyText size="small" color={colors.blackPepper500} style={{ marginBottom: 20, lineHeight: 1.6, maxWidth: 980 }}>
            Source: <strong>{QUERY_META.source}</strong>. Latest visible recruiter-load metric is SANDBOX-only in the current
            accessible IUM feed. The surrounding application, interview, and adoption series are production context signals used
            to interpret pressure, not to redefine the recruiter-load metric itself.
          </BodyText>

          <Card
            padding="m"
            style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, marginBottom: '16px' }}
          >
            <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper500, marginBottom: '12px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
              Filters
            </BodyText>
            <Flex gap="m" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="rc-segment-filter" label="Segment" value={filters.segment} onChange={(value) => setFilters((current) => ({ ...current, segment: value }))} options={SEGMENT_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="rc-region-filter" label="Region" value={filters.region} onChange={(value) => setFilters((current) => ({ ...current, region: value }))} options={REGION_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="rc-industry-filter" label="Industry" value={filters.industry} onChange={(value) => setFilters((current) => ({ ...current, industry: value }))} options={INDUSTRY_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect
                  id="rc-tenant-filter"
                  label="Tenant"
                  value={filters.tenant}
                  onChange={(value) => setFilters((current) => ({ ...current, tenant: value }))}
                  options={[
                    { value: '', label: 'All tenants' },
                    ...capacityTenants.map((tenant) => ({ value: tenant, label: tenant })),
                  ]}
                />
              </Box>
            </Flex>
            {describeActiveFilters(effectiveFilters).length > 0 && (
              <BodyText size="small" color={colors.blueberry500} style={{ marginTop: 10, fontSize: 12 }}>
                Showing: {describeActiveFilters(effectiveFilters).join(' · ')}
              </BodyText>
            )}
          </Card>

          <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap' }}>
            {headlineKpis.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                helperText={metric.helperText}
                changeIndicator={metric.changeIndicator}
                tooltip={metric.tooltip}
              />
            ))}
          </Flex>

          <Card style={{ ...chartCardStyle, marginBottom: 24, padding: 16 }}>
            <Flex gap="s" style={{ flexWrap: 'wrap' }}>
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <SecondaryButton
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={isActive ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
                  >
                    {tab.label}
                  </SecondaryButton>
                );
              })}
            </Flex>
          </Card>

          {tabContent}

          <Card style={{ ...chartCardStyle, marginTop: 24 }}>
            <Heading size="small" marginBottom="xs">
              Data notes
            </Heading>
            <BodyText size="small" color={colors.blackPepper400} style={{ lineHeight: 1.6 }}>
              {QUERY_META.note} Segment = company-size band, region = business region, and industry = super-industry from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.user_test.interview_dashboard_tenant_filters</code>.
            </BodyText>
          </Card>
        </Box>
      </Box>
    </Flex>
  );
};
