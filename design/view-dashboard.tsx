import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard, DashboardGlobalNav } from './components';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
} from './components/sanaShellTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  QUERY_META,
  KPIS,
  INSIGHTS,
  OFFER_BOXES,
  EA_BOXES,
  TTH_BOXES,
  TTF_BOXES,
  TEST_RESULTS,
  DELTA_CHART,
  ADOPTION_COUNTS,
  type PercentileBox,
} from './data-view-dashboard';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
);

const CK = {
  primary: colors.blueberry500,
  primaryLight: colors.blueberry200,
  secondary: colors.greenApple400,
  secondaryLight: colors.greenApple200,
  tertiary: colors.cantaloupe400,
  neutral: colors.soap400,
};

const cardStyle: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 24,
};

function DeltaBarChart() {
  const dc = DELTA_CHART;
  return (
    <Card style={cardStyle}>
      <Heading size="small" style={{ marginBottom: 4 }}>
        Median Delta (Adopted - Not Adopted)
      </Heading>
      <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 12 }}>
        Positive = adopters take longer. Filled bars = statistically significant (p {'<'} 0.05).
      </BodyText>
      <div style={{ height: 250 }}>
        <Bar
          data={{
            labels: dc.labels,
            datasets: [{
              label: 'Delta (days)',
              data: dc.deltaMedians,
              backgroundColor: dc.significant.map(s =>
                s ? CK.primary : colors.soap400,
              ),
              borderColor: dc.significant.map(s =>
                s ? CK.primary : colors.soap500,
              ),
              borderWidth: 1,
              barPercentage: 0.5,
            }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
              y: { title: { display: true, text: 'Days' }, beginAtZero: true },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  afterLabel(ctx) {
                    const p = dc.pValues[ctx.dataIndex];
                    return `p = ${p < 0.001 ? '< 0.001' : p.toFixed(4)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}

function PercentileChart({ title, boxes }: { title: string; boxes: PercentileBox[] }) {
  const labels = boxes.map(b => `${b.label} (n=${b.n.toLocaleString()})`);
  return (
    <Card style={cardStyle}>
      <Heading size="small" style={{ marginBottom: 12 }}>{title}</Heading>
      <div style={{ height: 180 }}>
        <Bar
          data={{
            labels,
            datasets: [
              { label: 'P10', data: boxes.map(b => b.p10), backgroundColor: colors.soap300, barPercentage: 0.6 },
              { label: 'P25', data: boxes.map(b => b.p25 - b.p10), backgroundColor: CK.primaryLight, barPercentage: 0.6 },
              { label: 'Median', data: boxes.map(b => b.median - b.p25), backgroundColor: CK.primary, barPercentage: 0.6 },
              { label: 'P75', data: boxes.map(b => b.p75 - b.median), backgroundColor: CK.secondaryLight, barPercentage: 0.6 },
              { label: 'P90', data: boxes.map(b => b.p90 - b.p75), backgroundColor: CK.secondary, barPercentage: 0.6 },
            ],
          }}
          options={{
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
              x: { stacked: true, title: { display: true, text: 'Days' } },
              y: { stacked: true },
            },
            plugins: {
              legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 10 } } },
              tooltip: {
                mode: 'index' as const, intersect: false,
                callbacks: {
                  label(ctx) {
                    const box = boxes[ctx.dataIndex];
                    const map: Record<string, number> = { P10: box.p10, P25: box.p25, Median: box.median, P75: box.p75, P90: box.p90 };
                    const abs = map[ctx.dataset.label ?? ''];
                    return abs !== undefined ? `${ctx.dataset.label}: ${abs.toFixed(2)} d` : '';
                  },
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}

function TestResultsTable() {
  return (
    <Card style={cardStyle}>
      <Heading size="small" style={{ marginBottom: 12 }}>
        Mann-Whitney U Test Results
      </Heading>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.soap400}`, textAlign: 'left' }}>
              {['Metric', 'Env', 'n adopted', 'n not adopted', 'Adopted median', 'Not-adopted median', 'Delta (d)', 'U stat', 'p-value', 'r', 'Verdict'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Metric' || h === 'Env' || h === 'Verdict' ? 'left' : 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEST_RESULTS.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${colors.soap300}`, backgroundColor: i % 2 ? colors.soap100 : 'transparent' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600 }}>{t.metric}</td>
                <td style={{ padding: '8px 10px' }}>{t.env}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.nAdopted.toLocaleString()}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.nNotAdopted.toLocaleString()}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.adoptedMedian.toFixed(2)}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.notAdoptedMedian.toFixed(2)}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                  {t.deltaMedianDays > 0 ? '+' : ''}{t.deltaMedianDays.toFixed(2)}
                </td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.uStat.toLocaleString()}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: t.pValue < 0.05 ? 700 : 400, color: t.pValue < 0.05 ? CK.primary : 'inherit' }}>
                  {t.pValue < 0.001 ? '< 0.001' : t.pValue.toFixed(4)}
                </td>
                <td style={{ padding: '8px 10px', textAlign: 'right' }}>{t.rankBiserialR.toFixed(4)}</td>
                <td style={{ padding: '8px 10px', fontSize: 12 }}>{t.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function InsightsPanel() {
  return (
    <Card style={{ ...cardStyle, borderLeft: `4px solid ${CK.primary}`, marginTop: 24 }}>
      <Heading size="small" style={{ marginBottom: 16 }}>Data Scientist Insights</Heading>
      {INSIGHTS.map((ins, i) => (
        <Box key={i} style={{ marginBottom: i < INSIGHTS.length - 1 ? 20 : 0 }}>
          <BodyText size="medium" style={{ fontWeight: 600, marginBottom: 4 }}>{ins.finding}</BodyText>
          <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 4 }}>{ins.evidence}</BodyText>
          <Flex gap="xs" alignItems="center" style={{ marginBottom: 4 }}>
            <Box style={{
              display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              backgroundColor: ins.confidence === 'High' ? colors.greenApple100 : ins.confidence === 'Medium' ? colors.cantaloupe100 : colors.cinnamon100,
              color: ins.confidence === 'High' ? colors.greenApple600 : ins.confidence === 'Medium' ? colors.cantaloupe600 : colors.cinnamon600,
            }}>
              {ins.confidence} confidence
            </Box>
            <BodyText size="small" style={{ color: colors.licorice300 }}>{ins.confidenceReason}</BodyText>
          </Flex>
          <BodyText size="small" style={{ fontWeight: 500 }}>Recommendation: {ins.recommendation}</BodyText>
          {ins.caveats.length > 0 && (
            <Box style={{ marginTop: 4 }}>
              {ins.caveats.map((c, j) => (
                <BodyText key={j} size="small" style={{ color: colors.licorice300 }}>- {c}</BodyText>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Card>
  );
}

export const ViewDashboard = () => {
  const ac = ADOPTION_COUNTS;
  return (
    <div style={{ background: SANA_PAGE_CANVAS, minHeight: '100vh' }}>
      <DashboardGlobalNav activeMetricsSlug="view-dashboard" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 32px 0' }}>
        <a href="#bp-durations" style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Job App Stage Durations</a>
      </div>
      <PageHeader title={QUERY_META.title} subtitle={QUERY_META.subtitle} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 24 }}>
          {KPIS.map((kpi, i) => (
            <MetricCard key={i} label={kpi.label} value={kpi.value} helperText={kpi.detail} tooltip={kpi.tooltip} />
          ))}
        </Flex>

        <Card style={{ ...cardStyle, marginBottom: 24 }}>
          <BodyText size="small" style={{ color: colors.licorice300 }}>
            Population: {ac.totalTenants.toLocaleString()} tenants in PCA scorecard.{' '}
            <strong>{ac.addDocsAdopters}</strong> adopted Add Documents;{' '}
            <strong>{ac.nonAdopters.toLocaleString()}</strong> did not.
            Offer: {ac.offerTenants.toLocaleString()} tenants (PROD).
            EA: {ac.eaTenants} tenants (PROD).
            TTH: {ac.tthTenants.toLocaleString()} tenants (SANDBOX Average Time to Hire / 2358).
            TTF: {ac.ttfTenants} tenants (legacy SANDBOX Time to Fill extract using the older 2359 mapping).
          </BodyText>
        </Card>

        <div style={{ marginBottom: 24 }}>
          <DeltaBarChart />
        </div>

        <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 24 }}>
          <Box style={{ flex: '1 1 280px', minWidth: 0 }}>
            <PercentileChart title="Offer Duration (PROD)" boxes={OFFER_BOXES} />
          </Box>
          <Box style={{ flex: '1 1 280px', minWidth: 0 }}>
            <PercentileChart title="EA Duration (PROD)" boxes={EA_BOXES} />
          </Box>
        </Flex>

        <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 24 }}>
          <Box style={{ flex: '1 1 280px', minWidth: 0 }}>
            <PercentileChart title="Time to Hire (SANDBOX)" boxes={TTH_BOXES} />
          </Box>
          <Box style={{ flex: '1 1 280px', minWidth: 0 }}>
            <PercentileChart title="Time to Fill (Legacy SANDBOX)" boxes={TTF_BOXES} />
          </Box>
        </Flex>

        <div style={{ marginBottom: 24 }}>
          <TestResultsTable />
        </div>

        <InsightsPanel />

        <Box style={{ marginTop: 24, paddingBottom: 32 }}>
          <BodyText size="small" style={{ color: colors.licorice200, fontSize: 11 }}>
            Source: {QUERY_META.source} | Env: {QUERY_META.environment} | Range: {QUERY_META.dateRange} | Generated: {QUERY_META.queryDate}
          </BodyText>
        </Box>
      </div>
    </div>
  );
};

export default ViewDashboard;
