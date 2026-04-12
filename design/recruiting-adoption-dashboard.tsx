import React, { useState, useMemo } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
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
import {
  QUERY_META,
  LABELS,
  FEATURE_ADOPTION,
  UTILISATION_TREND,
  OPERATIONAL_VOLUMES,
} from './data-recruiting-adoption';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const ADOPTION_PALETTE: Record<string, string> = {
  'Onboarding': colors.greenApple400,
  'Job Requisitions': colors.blueberry500,
  'Recruiting (core)': colors.blueberry300,
  'Prospects': colors.cantaloupe400,
  'Internal Career Site': '#0d9488',
  'Referrals': colors.cinnamon400,
  'Candidate Pools': colors.soap500,
};

const VOLUME_PALETTE: Record<string, string> = {
  'Requisitions Approved': colors.blueberry500,
  'Open Positions': colors.cantaloupe400,
  'Staffing Events': colors.greenApple400,
  'Filled Positions': colors.cinnamon400,
};

const chartCard: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
};

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

type TabId = 'adoption' | 'volumes' | 'utilisation' | 'comparison';

const TABS: { id: TabId; label: string }[] = [
  { id: 'adoption', label: 'Feature Adoption Trend' },
  { id: 'volumes', label: 'Operational Volumes' },
  { id: 'utilisation', label: 'Utilisation Score' },
  { id: 'comparison', label: 'Adoption Comparison' },
];

const InsightBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    padding="m"
    marginTop="m"
    style={{
      backgroundColor: colors.blueberry50 || '#EDF5FF',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: 1.6,
      color: colors.blackPepper600,
    }}
  >
    {children}
  </Box>
);

export const RecruitingAdoptionDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('adoption');

  const featureNames = Object.keys(FEATURE_ADOPTION);

  const latestRecruiting = FEATURE_ADOPTION['Recruiting (core)']?.slice(-1)[0];
  const latestOnboarding = FEATURE_ADOPTION['Onboarding']?.slice(-1)[0];
  const latestUtil = UTILISATION_TREND.slice(-1)[0];
  const latestTenants = latestRecruiting?.tenants ?? 0;

  const adoptionChartData = useMemo(() => ({
    labels: LABELS,
    datasets: featureNames.map(name => ({
      label: name,
      data: FEATURE_ADOPTION[name].map(d => Math.round(d.adoption * 1000) / 10),
      borderColor: ADOPTION_PALETTE[name] || colors.soap400,
      backgroundColor: ADOPTION_PALETTE[name] || colors.soap400,
      tension: 0.25,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    })),
  }), [featureNames]);

  const adoptionOptions = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Feature adoption rate (% of PROD tenants)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: {
        ...BASE_LINE_OPTS.plugins.tooltip,
        callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%` },
      },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, min: 0, max: 100, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}%` } },
    },
  }), []);

  const volumeChartData = useMemo(() => ({
    labels: LABELS,
    datasets: Object.keys(OPERATIONAL_VOLUMES).map(name => ({
      label: name,
      data: OPERATIONAL_VOLUMES[name].map(d => d.avg),
      borderColor: VOLUME_PALETTE[name] || colors.soap400,
      backgroundColor: (VOLUME_PALETTE[name] || colors.soap400) + '33',
      tension: 0.25,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
      fill: false,
    })),
  }), []);

  const volumeOptions = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Average monthly volume per tenant', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: {
        ...BASE_LINE_OPTS.plugins.tooltip,
        callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v) } },
    },
  }), []);

  const utilChartData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Recruiting Utilisation %',
      data: UTILISATION_TREND.map(d => d.avg),
      borderColor: colors.blueberry500,
      backgroundColor: colors.blueberry200 + '55',
      fill: true,
      tension: 0.25,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2,
    }],
  }), []);

  const utilOptions = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Recruiting utilisation composite score (metric 508)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: {
        ...BASE_LINE_OPTS.plugins.tooltip,
        callbacks: { label: (ctx: any) => `Utilisation: ${ctx.parsed.y.toFixed(1)}%` },
      },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, min: 0, max: 100, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}%` } },
    },
  }), []);

  const comparisonData = useMemo(() => {
    const sorted = featureNames
      .map(name => {
        const latest = FEATURE_ADOPTION[name].slice(-1)[0];
        return { name, adoption: Math.round(latest.adoption * 1000) / 10 };
      })
      .sort((a, b) => b.adoption - a.adoption);

    return {
      labels: sorted.map(d => d.name),
      datasets: [{
        label: 'Adoption %',
        data: sorted.map(d => d.adoption),
        backgroundColor: sorted.map(d => ADOPTION_PALETTE[d.name] || colors.soap400),
        borderRadius: 4,
        barThickness: 32,
      }],
    };
  }, [featureNames]);

  const comparisonOptions = useMemo(() => ({
    ...BASE_LINE_OPTS,
    indexAxis: 'y' as const,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: `Feature adoption ranking (${LABELS[LABELS.length - 1]})`, font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: {
        ...BASE_LINE_OPTS.plugins.tooltip,
        callbacks: { label: (ctx: any) => `${ctx.parsed.x.toFixed(1)}%` },
      },
    },
    scales: {
      x: { ...BASE_LINE_OPTS.scales.x, min: 0, max: 100, ticks: { ...BASE_LINE_OPTS.scales.x?.ticks, callback: (v: number) => `${v}%` } },
      y: { ...BASE_LINE_OPTS.scales.y, grid: { display: false }, ticks: { font: { family: 'Roboto', size: 12 }, color: colors.blackPepper500 } },
    },
  }), []);

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="recruiting-adoption" />
      <Box padding="l" flex={1}>
      <PageHeader title={QUERY_META.title} subtitle={QUERY_META.subtitle} />

      <Flex gap="s" style={{ marginTop: 24 }} flexWrap="wrap">
        <MetricCard
          label="Recruiting adoption"
          value={`${((latestRecruiting?.adoption ?? 0) * 100).toFixed(1)}%`}
          helperText={`${latestTenants.toLocaleString()} PROD tenants`}
          changeIndicator={{ text: 'Core module (metric 428)', sentiment: 'neutral' }}
          tooltip="Share of PROD tenants with core Recruiting enabled (IUM428), averaged across tenants in the latest month."
        />
        <MetricCard
          label="Onboarding adoption"
          value={`${((latestOnboarding?.adoption ?? 0) * 100).toFixed(1)}%`}
          helperText="Highest adoption feature"
          changeIndicator={{ text: 'Metric 314', sentiment: 'positive' }}
          tooltip="Onboarding module attach rate (metric 314) among PROD tenants in the latest month."
        />
        <MetricCard
          label="Recruiting utilisation"
          value={`${(latestUtil?.avg ?? 0).toFixed(1)}%`}
          helperText="Composite score (metric 508)"
          changeIndicator={{ text: 'Measurement change Feb 2026', sentiment: 'negative' }}
          tooltip="Composite utilisation score (metric 508) from the usage metrics feed; definition follows PMO instrument spec."
        />
        <MetricCard
          label="PROD tenants"
          value={latestTenants.toLocaleString()}
          helperText={`As of ${LABELS[LABELS.length - 1]}`}
          changeIndicator={{ text: 'Growing from ~5,400', sentiment: 'positive' }}
          tooltip="Number of production tenants in the adoption series denominator for the latest month."
        />
      </Flex>

      <Flex gap="xs" style={{ marginTop: 24 }} flexWrap="wrap">
        {TABS.map(tab => (
          <SecondaryButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? colors.blueberry400 : undefined,
              color: activeTab === tab.id ? '#fff' : undefined,
              borderColor: activeTab === tab.id ? colors.blueberry400 : undefined,
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderRadius: 20,
              fontSize: 13,
            }}
          >
            {tab.label}
          </SecondaryButton>
        ))}
      </Flex>

      <Box style={{ marginTop: 24 }}>
        {activeTab === 'adoption' && (
          <Card style={chartCard}>
            <div style={{ height: 420 }}>
              <Line data={adoptionChartData} options={adoptionOptions} />
            </div>
            <InsightBox>
              <strong>Insight:</strong> Onboarding (90%) and Job Requisitions (81%) show the highest and most stable adoption.
              Recruiting core sits at 66%, down from 72% in Jan 2026 - likely reflecting a measurement methodology change in Feb 2026
              that also halved reported rates for Prospects, Referrals, Internal Career Site, and Candidate Pools.
              Pre-change, these features showed steady or slightly growing adoption.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'volumes' && (
          <Card style={chartCard}>
            <div style={{ height: 420 }}>
              <Line data={volumeChartData} options={volumeOptions} />
            </div>
            <InsightBox>
              <strong>Insight:</strong> Filled Positions (~10,300/tenant) dwarfs other volume metrics, reflecting cumulative headcount.
              Open Positions (~2,450) and Staffing Events (~2,030) track closely, while Requisitions Approved (~400/month) shows
              clear seasonal patterns with Nov and Feb dips. Feb 2026 saw an unusual drop in Staffing Events (1,672), potentially
              related to the same measurement change.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'utilisation' && (
          <Card style={chartCard}>
            <div style={{ height: 380 }}>
              <Line data={utilChartData} options={utilOptions} />
            </div>
            <InsightBox>
              <strong>Insight:</strong> Recruiting utilisation held steady at 61-63% from Apr 2025 through Jan 2026, then
              dropped sharply to ~36% in Feb-Mar 2026. This aligns with the measurement methodology change visible across
              multiple recruiting metrics. The pre-change baseline of ~63% is the more reliable benchmark for planning.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'comparison' && (
          <Card style={chartCard}>
            <div style={{ height: 380 }}>
              <Bar data={comparisonData} options={comparisonOptions} />
            </div>
            <InsightBox>
              <strong>Insight:</strong> Clear adoption tiers emerge: Onboarding and Job Requisitions form a top tier (80-90%),
              Recruiting core and Prospects sit mid-tier (41-66%), and Referrals, Internal Career Site, and Candidate Pools
              trail at 10-35%. Note: Feb/Mar 2026 values for the lower-tier features are affected by a measurement change -
              pre-change adoption was roughly double (51-72%).
            </InsightBox>
          </Card>
        )}
      </Box>

      <BodyText
        size="small"
        style={{ color: colors.licorice200, marginTop: 16, fontStyle: 'italic' }}
      >
        Source: {QUERY_META.source} | Environment: {QUERY_META.environment} | Date range: {QUERY_META.dateRange} |
        Queried: {QUERY_META.queryDate} |
        Note: Feb-Mar 2026 values for metrics 428-432 and 508 reflect a measurement methodology change; pre-change baseline is more reliable for trend analysis.
      </BodyText>
      </Box>
    </Flex>
  );
};

export default RecruitingAdoptionDashboard;
