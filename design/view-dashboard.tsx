import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { MetricCard } from './components';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
} from './components/sanaShellTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  QUERY_META,
  KPIS,
  INSIGHTS,
  OVERLAP_LABELS,
  OVERLAP_INFOBIP,
  OVERLAP_SEVEN_ELEVEN,
  MEAN_COMPARISON_LABELS,
  MEAN_COMPARISON_VALUES,
} from './data-view-dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const CK = {
  primary: colors.blueberry500,
  primaryLight: colors.blueberry200,
  secondary: colors.greenApple400,
  tertiary: colors.cantaloupe400,
  quaternary: colors.cinnamon400,
  neutral: colors.soap400,
  muted: colors.blackPepper500,
};

const chartCard: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
};

export const ViewDashboard = () => {
  const lineData = {
    labels: OVERLAP_LABELS,
    datasets: [
      {
        label: 'InfoBip TTH (days)',
        data: OVERLAP_INFOBIP,
        borderColor: CK.primary,
        backgroundColor: CK.primaryLight + '55',
        fill: true,
        tension: 0.25,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '7-Eleven TTH (days)',
        data: OVERLAP_SEVEN_ELEVEN,
        borderColor: CK.secondary,
        backgroundColor: colors.greenApple200 + '44',
        fill: true,
        tension: 0.25,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions: any = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: 'index' as const, intersect: false },
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Average time to hire (2358) — common months only (both tenants reported)',
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'Days' },
        beginAtZero: true,
      },
    },
  };

  const overlapBarData = {
    labels: OVERLAP_LABELS,
    datasets: [
      {
        label: 'InfoBip',
        data: OVERLAP_INFOBIP,
        backgroundColor: CK.primary,
        borderRadius: 6,
      },
      {
        label: '7-Eleven',
        data: OVERLAP_SEVEN_ELEVEN,
        backgroundColor: CK.secondary,
        borderRadius: 6,
      },
    ],
  };

  const overlapBarOptions: any = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: 'index' as const, intersect: false },
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Same 10 common months — side-by-side comparison',
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'Days' },
        beginAtZero: true,
      },
    },
  };

  const meanBarData = {
    labels: MEAN_COMPARISON_LABELS,
    datasets: [
      {
        label: 'Mean TTH (days)',
        data: MEAN_COMPARISON_VALUES,
        backgroundColor: [CK.primary, CK.tertiary],
        borderRadius: 6,
      },
    ],
  };

  const meanBarOptions: any = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      tooltip: { mode: 'index' as const, intersect: false },
      legend: { display: false },
      title: {
        display: true,
        text: 'Simple mean of reported months per tenant (different month counts)',
        font: { size: 14 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Days' },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box style={{ backgroundColor: SANA_PAGE_CANVAS, minHeight: '100vh', padding: 32 }}>
      <Box style={{ marginBottom: 24 }}>
        <Heading size="medium">{QUERY_META.title}</Heading>
        <BodyText size="small" style={{ marginTop: 8, color: colors.licorice300 }}>
          {QUERY_META.subtitle}
        </BodyText>
      </Box>

      <Flex gap="s" style={{ marginTop: 24 }} flexWrap="wrap">
        {KPIS.map((kpi, i) => (
          <MetricCard key={i} label={kpi.label} value={kpi.value} helperText={kpi.detail} />
        ))}
      </Flex>

      <Flex gap="s" style={{ marginTop: 24 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 640px' }}>
          <div style={{ height: 380 }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </Card>

        <Card style={{ ...chartCard, flex: '1 1 360px' }}>
          <div style={{ height: 380 }}>
            <Bar data={overlapBarData} options={overlapBarOptions} />
          </div>
        </Card>
      </Flex>

      <Card style={{ ...chartCard, marginTop: 24 }}>
        <div style={{ height: 300 }}>
          <Bar data={meanBarData} options={meanBarOptions} />
        </div>
      </Card>

      <Card style={{ ...chartCard, marginTop: 24 }}>
        <Heading size="small" style={{ marginBottom: 16 }}>
          Data Scientist Insights
        </Heading>

        {INSIGHTS.map((insight, i) => (
          <Box key={i} style={{ marginBottom: i < INSIGHTS.length - 1 ? 20 : 0 }}>
            <BodyText size="medium" style={{ fontWeight: 600, marginBottom: 4 }}>
              {insight.finding}
            </BodyText>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 4 }}>
              {insight.evidence}
            </BodyText>
            <Flex gap="xs" alignItems="center" style={{ marginBottom: 4 }}>
              <Box
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor:
                    insight.confidence === 'High'
                      ? colors.greenApple100
                      : insight.confidence === 'Medium'
                        ? colors.cantaloupe100
                        : colors.cinnamon100,
                  color:
                    insight.confidence === 'High'
                      ? colors.greenApple600
                      : insight.confidence === 'Medium'
                        ? colors.cantaloupe600
                        : colors.cinnamon600,
                }}
              >
                {insight.confidence} confidence
              </Box>
              <BodyText size="small" style={{ color: colors.licorice300 }}>
                {insight.confidenceReason}
              </BodyText>
            </Flex>
            <BodyText size="small" style={{ fontWeight: 500 }}>
              Recommendation: {insight.recommendation}
            </BodyText>
            {insight.caveats.length > 0 && (
              <Box style={{ marginTop: 4 }}>
                {insight.caveats.map((c, j) => (
                  <BodyText key={j} size="small" style={{ color: colors.licorice300 }}>
                    - {c}
                  </BodyText>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Card>

      <BodyText
        size="small"
        style={{ color: colors.licorice200, marginTop: 16, fontStyle: 'italic' }}
      >
        Source: {QUERY_META.source} | Environment: {QUERY_META.environment} | Date range:{' '}
        {QUERY_META.dateRange} | Queried: {QUERY_META.queryDate}
      </BodyText>
    </Box>
  );
};

export default ViewDashboard;
