import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { PageHeader, MetricCard, FormSelect, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { ALL_TENANTS, TENANT_TIME_SERIES } from './data-avg-time-to-hire';
import {
  aggregateTenantSeries,
  averageAcrossVisibleMonths,
  describeActiveFilters,
  EMPTY_DASHBOARD_FILTERS,
  filterTenantNames,
  getBreakdownValues,
  INDUSTRY_FILTER_OPTIONS,
  latestVisibleValues,
  normaliseTenantInput,
  REGION_FILTER_OPTIONS,
  SEGMENT_FILTER_OPTIONS,
  type DashboardFilterState,
} from './dashboard-filter-utils';
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
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const CK = {
  primary: colors.blueberry500,
  secondary: colors.greenApple500,
  tertiary: colors.cantaloupe400,
  quaternary: colors.cinnamon500,
  neutral: colors.soap400,
};

const BREAKDOWN_COLORS = [
  colors.blueberry500,
  colors.greenApple500,
  colors.cantaloupe400,
  colors.cinnamon500,
  '#0f766e',
  '#7c3aed',
  '#b45309',
  '#475569',
];

const LABELS = Array.from(
  new Set(Object.values(TENANT_TIME_SERIES).flatMap((series) => series.map((point) => point.ym)))
).sort((a, b) => a.localeCompare(b));

const DASHBOARD_TENANTS = ALL_TENANTS.filter((tenant) => !!TENANT_TIME_SERIES[tenant]);
const NORMALISED_TENANT_SERIES = Object.fromEntries(
  Object.entries(TENANT_TIME_SERIES).map(([tenant, series]) => [
    tenant,
    series.map((point) => ({ ym: point.ym, value: point.v })),
  ])
);

const BASE_LINE_OPTS: any = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { family: 'Roboto', size: 12 } } },
    tooltip: { backgroundColor: '#0b1f42', titleFont: { family: 'Roboto' }, bodyFont: { family: 'Roboto' }, cornerRadius: 8, padding: 10 },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Roboto', size: 11 }, color: colors.blackPepper400 } },
    y: { grid: { color: colors.soap200 }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: colors.blackPepper400 } },
  },
};

type TabId = 'trend' | 'segment' | 'region' | 'industry' | 'distribution' | 'tenants' | 'adoption';

const TABS: { id: TabId; label: string }[] = [
  { id: 'trend', label: 'Overall Trend' },
  { id: 'segment', label: 'By Segment' },
  { id: 'region', label: 'By Region' },
  { id: 'industry', label: 'By Industry' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'tenants', label: 'Top / Bottom Tenants' },
  { id: 'adoption', label: 'Adoption Growth' },
];

const InsightBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    padding="m"
    marginTop="m"
    style={{
      backgroundColor: colors.blueberry50 || '#EDF5FF',
      borderRadius: '8px',
      borderLeft: `3px solid ${colors.blueberry400}`,
      fontSize: '13px',
      lineHeight: 1.6,
      color: colors.blackPepper600,
    }}
  >
    {children}
  </Box>
);

const TenantBarRow: React.FC<{ name: string; days: number; maxDays: number; color: string }> = ({
  name,
  days,
  maxDays,
  color,
}) => (
  <Flex alignItems="center" gap="s" style={{ padding: '3px 0' }}>
    <BodyText size="small" style={{ minWidth: 150, fontWeight: 500 }}>{name}</BodyText>
    <Box style={{ flex: 1, height: 20, backgroundColor: colors.soap200, borderRadius: 4, overflow: 'hidden' }}>
      <Box style={{ width: `${maxDays > 0 ? (days / maxDays) * 100 : 0}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </Box>
    <BodyText size="small" style={{ minWidth: 64, textAlign: 'right', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
      {days.toFixed(1)}d
    </BodyText>
  </Flex>
);

const TenantSearchInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <FormField>
      <FormField.Label htmlFor="tenant-search">Tenant</FormField.Label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="tenant-search"
          list="tenant-datalist"
          value={value}
          onChange={handleChange}
          placeholder="Search tenants..."
          autoComplete="off"
          style={{
            width: '100%',
            padding: '8px 32px 8px 12px',
            fontSize: '14px',
            lineHeight: '20px',
            border: '1px solid #C5C5C5',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: '#333333',
            boxSizing: 'border-box',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear tenant filter"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 16,
              color: colors.blackPepper400,
              lineHeight: 1,
              padding: '2px',
            }}
          >
            ×
          </button>
        )}
        <datalist id="tenant-datalist">
          {DASHBOARD_TENANTS.map((tenant) => <option key={tenant} value={tenant} />)}
        </datalist>
      </div>
    </FormField>
  );
};

function buildBreakdownChartData(
  dimension: 'segment' | 'region' | 'industry',
  tenantNames: string[]
) {
  const values = getBreakdownValues(dimension, tenantNames);
  return {
    labels: LABELS,
    datasets: values.slice(0, 8).map((value, index) => {
      const scopedTenants = filterTenantNames(tenantNames, {
        ...EMPTY_DASHBOARD_FILTERS,
        [dimension]: value,
      } as DashboardFilterState);
      const aggregated = aggregateTenantSeries(LABELS, scopedTenants, NORMALISED_TENANT_SERIES);
      return {
        label: value,
        data: aggregated.map((point) => point.avg),
        borderColor: BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
        backgroundColor: BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
        tension: 0.28,
        pointRadius: 3,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
        spanGaps: false,
      };
    }),
  };
}

function bucketLabel(value: number): string {
  if (value <= 30) return '1-30 days';
  if (value <= 60) return '31-60 days';
  if (value <= 90) return '61-90 days';
  if (value <= 120) return '91-120 days';
  return '120+ days';
}

function latestNonNullIndex(values: Array<number | null>): number {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] != null) return index;
  }
  return values.length - 1;
}

function previousNonNullIndex(values: Array<number | null>, startIndex: number): number {
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    if (values[index] != null) return index;
  }
  return startIndex;
}

export const AvgTimeToHireDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('trend');
  const [filters, setFilters] = useState<DashboardFilterState>(EMPTY_DASHBOARD_FILTERS);

  const exactTenant = useMemo(() => {
    const normalised = normaliseTenantInput(filters.tenant);
    return normalised && DASHBOARD_TENANTS.includes(normalised) ? normalised : '';
  }, [filters.tenant]);

  const effectiveFilters = useMemo(
    () => ({ ...filters, tenant: exactTenant }),
    [filters, exactTenant]
  );

  const filteredTenantNames = useMemo(
    () => filterTenantNames(DASHBOARD_TENANTS, effectiveFilters),
    [effectiveFilters]
  );

  const aggregatedTrend = useMemo(
    () => aggregateTenantSeries(LABELS, filteredTenantNames, NORMALISED_TENANT_SERIES),
    [filteredTenantNames]
  );

  const avgValues = aggregatedTrend.map((point) => point.avg);
  const latestIndex = latestNonNullIndex(avgValues);
  const previousIndex = previousNonNullIndex(avgValues, latestIndex);
  const latest = aggregatedTrend[Math.max(0, latestIndex)];
  const previous = aggregatedTrend[Math.max(0, previousIndex)];
  const activeFilterSummary = describeActiveFilters(effectiveFilters);

  const trendChartData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: activeFilterSummary.length > 0 ? 'Filtered Avg' : 'Overall Avg',
      data: aggregatedTrend.map((point) => point.avg),
      borderColor: CK.primary,
      backgroundColor: `${CK.primary}14`,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: CK.primary,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      borderWidth: 2.5,
      spanGaps: false,
    }],
  }), [aggregatedTrend, activeFilterSummary.length]);

  const segmentChartData = useMemo(() => buildBreakdownChartData('segment', filteredTenantNames), [filteredTenantNames]);
  const regionChartData = useMemo(() => buildBreakdownChartData('region', filteredTenantNames), [filteredTenantNames]);
  const industryChartData = useMemo(() => buildBreakdownChartData('industry', filteredTenantNames), [filteredTenantNames]);

  const latestMonth = latest?.ym ?? LABELS[LABELS.length - 1];
  const latestValues = useMemo(
    () => latestVisibleValues(filteredTenantNames, NORMALISED_TENANT_SERIES, latestMonth),
    [filteredTenantNames, latestMonth]
  );

  const distributionBuckets = useMemo(() => {
    const bucketCounts = new Map<string, number>([
      ['1-30 days', 0],
      ['31-60 days', 0],
      ['61-90 days', 0],
      ['91-120 days', 0],
      ['120+ days', 0],
    ]);
    latestValues.forEach((value) => {
      const label = bucketLabel(value);
      bucketCounts.set(label, (bucketCounts.get(label) ?? 0) + 1);
    });
    return Array.from(bucketCounts.entries()).map(([bucket, count]) => ({ bucket, count }));
  }, [latestValues]);

  const distChartData = useMemo(() => ({
    labels: distributionBuckets.map((row) => row.bucket),
    datasets: [{
      label: 'Tenants',
      data: distributionBuckets.map((row) => row.count),
      backgroundColor: [
        colors.greenApple400,
        CK.primary,
        colors.blueberry300,
        CK.tertiary,
        colors.cinnamon400,
      ],
      borderRadius: 6,
      borderSkipped: false as const,
      barPercentage: 0.7,
    }],
  }), [distributionBuckets]);

  const tenantRankings = useMemo(() => {
    const ranked = filteredTenantNames
      .map((tenant) => ({
        name: tenant,
        avgDays: averageAcrossVisibleMonths(tenant, LABELS, NORMALISED_TENANT_SERIES),
      }))
      .filter((row): row is { name: string; avgDays: number } => row.avgDays != null)
      .sort((a, b) => a.avgDays - b.avgDays);
    return {
      fastest: ranked.slice(0, 10),
      slowest: [...ranked].reverse().slice(0, 10),
      maxDays: ranked.length > 0 ? Math.max(...ranked.map((row) => row.avgDays)) : 0,
    };
  }, [filteredTenantNames]);

  const adoptionChartData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Active Tenants',
      data: aggregatedTrend.map((point) => point.tenants),
      backgroundColor: LABELS.map((label) => label.startsWith('2026') ? CK.primary : `${CK.primary}80`),
      borderRadius: 4,
      borderSkipped: false as const,
      barPercentage: 0.65,
    }],
  }), [aggregatedTrend]);

  const avgDelta =
    latest?.avg != null && previous?.avg != null
      ? latest.avg - previous.avg
      : 0;

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="avg-time-to-hire" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 8 }}>
            <a href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/value-realization-metrics`} style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Value Realisation</a>
          </div>
          <PageHeader
            title="Average Time to Hire"
            subtitle={"Average tenant-level time to hire from first job posting to latest accepted offer, shown here as the monthly mean across the selected tenant scope.\nSource: dw.swh_raw.internal_usage_metrics_report_kafka · live metric-name resolution to Average Time to Hire (2358) · SANDBOX, enriched with company-size, region, and industry from interview_dashboard_tenant_filters."}
          />

          <Card
            padding="m"
            style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, marginBottom: '16px' }}
          >
            <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper500, marginBottom: '12px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
              Filters
            </BodyText>
            <Flex gap="m" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="segment-filter" label="Segment" value={filters.segment} onChange={(value) => setFilters((current) => ({ ...current, segment: value }))} options={SEGMENT_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="region-filter" label="Region" value={filters.region} onChange={(value) => setFilters((current) => ({ ...current, region: value }))} options={REGION_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <FormSelect id="industry-filter" label="Industry" value={filters.industry} onChange={(value) => setFilters((current) => ({ ...current, industry: value }))} options={INDUSTRY_FILTER_OPTIONS} />
              </Box>
              <Box style={{ flex: '1 1 180px' }}>
                <TenantSearchInput value={filters.tenant} onChange={(value) => setFilters((current) => ({ ...current, tenant: value }))} />
              </Box>
            </Flex>
            {activeFilterSummary.length > 0 && (
              <BodyText size="small" color={colors.blueberry500} style={{ marginTop: 10, fontSize: 12 }}>
                Showing: {activeFilterSummary.join(' · ')}
              </BodyText>
            )}
          </Card>

          <Flex gap="m" marginBottom="l" style={{ flexWrap: 'wrap' }}>
            <MetricCard
              label="Avg days to hire"
              value={latest?.avg == null ? 'Unavailable' : latest.avg.toFixed(1)}
              helperText={`${latestMonth} · ${latest?.tenants.toLocaleString() ?? '0'} active tenants`}
              changeIndicator={{
                text: `${avgDelta > 0 ? '+' : ''}${avgDelta.toFixed(1)} vs prev month`,
                sentiment: avgDelta > 0 ? 'negative' : avgDelta < 0 ? 'positive' : 'neutral',
              }}
              tooltip="Mean tenant-level Average Time to Hire for the selected scope in the latest visible month."
            />
            <MetricCard
              label="Active tenants"
              value={(latest?.tenants ?? 0).toLocaleString()}
              helperText="Tenants with non-zero time to hire in the latest visible month"
              tooltip="Distinct tenants contributing to the selected scope in the latest visible month."
            />
            <MetricCard
              label="Fastest tenant"
              value={latest?.min == null ? 'Unavailable' : `${latest.min.toFixed(1)}d`}
              helperText="Lowest tenant average in visible month"
              tooltip="Smallest tenant-level average time to hire inside the selected scope."
            />
            <MetricCard
              label="Slowest tenant"
              value={latest?.max == null ? 'Unavailable' : `${latest.max.toFixed(1)}d`}
              helperText="Highest tenant average in visible month"
              tooltip="Highest tenant-level average time to hire inside the selected scope."
            />
          </Flex>

          <Flex gap="xs" marginBottom="m" style={{ borderBottom: `1px solid ${colors.soap300}`, paddingBottom: '8px', flexWrap: 'wrap' }}>
            {TABS.map((tab) => (
              <SecondaryButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
              >
                {tab.label}
              </SecondaryButton>
            ))}
          </Flex>

          {activeTab === 'trend' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">Overall Monthly Trend</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Mean tenant-level time to hire across the currently selected scope.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Line data={trendChartData} options={BASE_LINE_OPTS} />
              </Box>
              <InsightBox>
                <strong>Read this as:</strong> the headline cards and the main trend now use the exact same selected scope, so the story does not drift when you change segment, region, industry, or tenant.
              </InsightBox>
            </Card>
          )}

          {activeTab === 'segment' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">By Company-Size Segment</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Breakdown of the selected tenant scope by company-size segment from the tenant filter lookup.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Line data={segmentChartData} options={BASE_LINE_OPTS} />
              </Box>
            </Card>
          )}

          {activeTab === 'region' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">By Business Region</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Region comes from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>interview_dashboard_tenant_filters.segment</code>, not data-centre geography.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Line data={regionChartData} options={BASE_LINE_OPTS} />
              </Box>
            </Card>
          )}

          {activeTab === 'industry' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">By Industry</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Industry uses <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>interview_dashboard_tenant_filters.super_industry</code>.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Line data={industryChartData} options={BASE_LINE_OPTS} />
              </Box>
            </Card>
          )}

          {activeTab === 'distribution' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">Tenant Distribution</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Distribution of tenant-level averages in {latestMonth} for the current filter scope.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Bar
                  data={distChartData}
                  options={{
                    ...BASE_LINE_OPTS,
                    plugins: {
                      ...BASE_LINE_OPTS.plugins,
                      legend: { display: false },
                      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toLocaleString()} tenants` } },
                    },
                    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: true } },
                  }}
                />
              </Box>
            </Card>
          )}

          {activeTab === 'tenants' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">Top 10 Fastest &amp; Slowest Tenants</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Ranking uses the average across the currently visible series for the selected tenant scope.
              </BodyText>
              <Flex gap="xl" style={{ flexWrap: 'wrap' }}>
                <Box style={{ flex: '1 1 360px' }}>
                  <BodyText size="small" style={{ fontWeight: 700, color: colors.greenApple600, marginBottom: '12px' }}>
                    Fastest Tenants
                  </BodyText>
                  {tenantRankings.fastest.map((row) => (
                    <TenantBarRow key={row.name} name={row.name} days={row.avgDays} maxDays={tenantRankings.maxDays} color={colors.greenApple500} />
                  ))}
                </Box>
                <Box style={{ flex: '1 1 360px' }}>
                  <BodyText size="small" style={{ fontWeight: 700, color: colors.cinnamon500, marginBottom: '12px' }}>
                    Slowest Tenants
                  </BodyText>
                  {tenantRankings.slowest.map((row) => (
                    <TenantBarRow key={row.name} name={row.name} days={row.avgDays} maxDays={tenantRankings.maxDays} color={colors.cinnamon500} />
                  ))}
                </Box>
              </Flex>
            </Card>
          )}

          {activeTab === 'adoption' && (
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
              <Heading size="small" marginBottom="xxs">Adoption Growth</Heading>
              <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
                Monthly count of reporting tenants inside the selected scope.
              </BodyText>
              <Box style={{ height: 340 }}>
                <Bar
                  data={adoptionChartData}
                  options={{
                    ...BASE_LINE_OPTS,
                    plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: false } },
                    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: true } },
                  }}
                />
              </Box>
            </Card>
          )}

          <BodyText size="small" color={colors.blackPepper400} marginTop="l" style={{ lineHeight: 1.6, fontSize: 12 }}>
            <strong>Data notes:</strong> Source: Pharos <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>internal_usage_metrics_report_kafka</code> with live metric-name resolution for Average Time to Hire. Segment = company-size band, region = business region, and industry = super-industry from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.user_test.interview_dashboard_tenant_filters</code>. All visible cards and charts are scoped to the selected filter set.
          </BodyText>
        </Box>
      </Box>
    </Flex>
  );
};

export default AvgTimeToHireDashboard;
