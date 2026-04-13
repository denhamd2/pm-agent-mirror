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
  CAPACITY_TREND,
  CONTEXT_SERIES,
  HEADLINE_KPIS,
  CONTEXT_KPIS,
  INTERPRETATION_GUIDANCE,
  MODELLED_PRESSURE_INDEX,
} from './data-recruiter-capacity';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

type TabId = 'overview' | 'trend' | 'context' | 'guide';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'trend', label: 'Trend' },
  { id: 'context', label: 'Context' },
  { id: 'guide', label: 'Interpretation' },
];

const RANGE_OPTIONS = [
  { value: '6', label: 'Last 6 months' },
  { value: 'all', label: 'All data' },
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

function OverviewTab({ rangeSlice }: { rangeSlice: number }) {
  const labels = LABELS.slice(rangeSlice);
  const capacityValues = CAPACITY_TREND.slice(rangeSlice).map((point) => point.value);
  const pressureValues = MODELLED_PRESSURE_INDEX.slice(rangeSlice).map((point) => point.value);

  return (
    <Flex flexDirection="column" gap="l">
      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '2 1 520px', minWidth: 320 }}>
          <Heading size="small" marginBottom="s">
            Recruiter load vs directional pressure
          </Heading>
          <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 16 }}>
            The blue line is the live recruiter-load IUM. The darker line is a modelled pressure index that rolls recruiter
            load together with application volume, interview rounds, and Interview BP time.
          </BodyText>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels,
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

      <Flex gap="l" style={{ flexWrap: 'wrap' }}>
        {CONTEXT_KPIS.map((metric) => (
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

function TrendTab({ rangeSlice }: { rangeSlice: number }) {
  const labels = LABELS.slice(rangeSlice);
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
                labels,
                datasets: [
                  {
                    label: 'Recruiter Capacity',
                    data: CAPACITY_TREND.slice(rangeSlice).map((point) => point.value),
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
                labels,
                datasets: [
                  {
                    label: 'Reporting tenants',
                    data: CAPACITY_TREND.slice(rangeSlice).map((point) => point.tenants),
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
                labels,
                datasets: [
                  {
                    label: 'Applications per tenant',
                    data: CONTEXT_SERIES.jobApplicationsPerTenant.slice(rangeSlice).map((point) => point.value),
                    borderColor: colors.cantaloupe400,
                    backgroundColor: 'rgba(255,159,10,0.10)',
                    pointRadius: 2,
                    tension: 0.28,
                  },
                  {
                    label: 'Interview rounds per tenant',
                    data: CONTEXT_SERIES.interviewRoundsPerTenant.slice(rangeSlice).map((point) => point.value),
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
                labels,
                datasets: [
                  {
                    label: 'Interview sessions per tenant',
                    data: CONTEXT_SERIES.interviewSessionsPerTenant.slice(rangeSlice).map((point) => point.value),
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

function ContextTab({ rangeSlice }: { rangeSlice: number }) {
  const interviewBpCurrent = lastValue(CONTEXT_SERIES.avgTimeInInterviewBp);
  const interviewBpPrev = previousValue(CONTEXT_SERIES.avgTimeInInterviewBp);
  const adoptionCurrent = lastValue(CONTEXT_SERIES.recruitingCoreAdoptionPct);
  const adoptionPrev = previousValue(CONTEXT_SERIES.recruitingCoreAdoptionPct);
  const labels = LABELS.slice(rangeSlice);

  return (
    <Flex flexDirection="column" gap="l">
      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card style={{ ...chartCardStyle, flex: '1 1 460px', minWidth: 320 }}>
          <Heading size="small" marginBottom="s">
            Time pressure context
          </Heading>
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Avg time in Interview BP',
                    data: CONTEXT_SERIES.avgTimeInInterviewBp.slice(rangeSlice).map((point) => point.value),
                    borderColor: colors.peachSchnapps500,
                    backgroundColor: 'rgba(255,95,86,0.10)',
                    pointRadius: 2,
                    tension: 0.3,
                  },
                  {
                    label: 'MISST sessions per req',
                    data: CONTEXT_SERIES.misstSessionsPerReq.slice(rangeSlice).map((point) => point.value),
                    borderColor: colors.blueberry500,
                    backgroundColor: 'rgba(0,112,210,0.08)',
                    pointRadius: 2,
                    tension: 0.3,
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
                    title: { display: true, text: 'Days' },
                  },
                  y1: {
                    position: 'right' as const,
                    grid: { drawOnChartArea: false },
                    ticks: { color: colors.blackPepper400, font: { family: 'JetBrains Mono, monospace', size: 11 } },
                    title: { display: true, text: 'Sessions / req' },
                  },
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
                labels,
                datasets: [
                  {
                    label: 'Recruiting core adoption %',
                    data: CONTEXT_SERIES.recruitingCoreAdoptionPct.slice(rangeSlice).map((point) => point.value),
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
        </Card>
      </Flex>

      <Flex gap="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        <MetricCard
          label="Interview BP context"
          value={interviewBpCurrent == null ? 'Unavailable' : `${interviewBpCurrent.toFixed(1)} days`}
          helperText="Use this beside recruiter load to detect true operational pressure."
          changeIndicator={{
            text: formatSeriesDelta(CONTEXT_SERIES.avgTimeInInterviewBp),
            sentiment: sentimentForChange(interviewBpCurrent, interviewBpPrev, true),
          }}
          tooltip="Lower is better. A rise alongside recruiter load suggests the organisation is carrying more work and taking longer to move candidates through interview steps."
        />
        <MetricCard
          label="Recruiting adoption context"
          value={adoptionCurrent == null ? 'Unavailable' : `${adoptionCurrent.toFixed(1)}%`}
          helperText="Higher adoption can justify more recruiter load if time metrics remain healthy."
          changeIndicator={{
            text: formatSeriesDelta(CONTEXT_SERIES.recruitingCoreAdoptionPct),
            sentiment: sentimentForChange(adoptionCurrent, adoptionPrev, false),
          }}
          tooltip="Higher is better. This is a leading product-use context series, not a direct recruiter-capacity measure."
        />
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
  const [rangeFilter, setRangeFilter] = useState('all');

  const rangeSlice = useMemo(() => {
    if (rangeFilter === 'all') return 0;
    return LABELS.length - Number(rangeFilter);
  }, [rangeFilter]);

  const tabContent = useMemo(() => {
    if (activeTab === 'trend') return <TrendTab rangeSlice={rangeSlice} />;
    if (activeTab === 'context') return <ContextTab rangeSlice={rangeSlice} />;
    if (activeTab === 'guide') return <GuideTab />;
    return <OverviewTab rangeSlice={rangeSlice} />;
  }, [activeTab, rangeSlice]);

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
              <Box style={{ flex: '1 1 180px', maxWidth: 240 }}>
                <FormSelect id="rc-range-filter" label="Time Range" value={rangeFilter} onChange={setRangeFilter} options={RANGE_OPTIONS} />
              </Box>
            </Flex>
          </Card>

          <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap' }}>
            {HEADLINE_KPIS.map((metric) => (
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
              {QUERY_META.note}
            </BodyText>
          </Card>
        </Box>
      </Box>
    </Flex>
  );
};
