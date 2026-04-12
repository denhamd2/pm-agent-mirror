import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DashboardGlobalNav, PageHeader, MetricCard } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type PrimaryEstimate = {
  outcome: string;
  n: number;
  preMedian: number;
  postMedian: number;
  medianLevelChange: number;
  winsorMeanChange: number;
  ciLow: number;
  ciHigh: number;
  weightedLevelChange: number;
  avgPreM: number;
  avgPostM: number;
};

const PRIMARY: PrimaryEstimate[] = [
  {
    outcome: 'Offer',
    n: 10,
    preMedian: 0.125,
    postMedian: 0.015,
    medianLevelChange: -0.125,
    winsorMeanChange: -29.737,
    ciLow: -59.312,
    ciHigh: -4.382,
    weightedLevelChange: -32.638,
    avgPreM: 3.2,
    avgPostM: 4.0,
  },
  {
    outcome: 'Employment Agreement',
    n: 14,
    preMedian: 0.015,
    postMedian: 0.02,
    medianLevelChange: 0.0,
    winsorMeanChange: 0.189,
    ciLow: -0.135,
    ciHigh: 0.566,
    weightedLevelChange: 0.235,
    avgPreM: 4.5,
    avgPostM: 5.0,
  },
];

const OFFER_SENSITIVITY = [
  { threshold: 3, winsor: 'none', n: 10, median: -0.125, winsorMean: -29.737 },
  { threshold: 3, winsor: 'w10-90', n: 10, median: -0.125, winsorMean: -29.737 },
  { threshold: 3, winsor: 'w05-95', n: 10, median: -0.125, winsorMean: -29.737 },
  { threshold: 6, winsor: 'none', n: 0, median: null, winsorMean: null },
  { threshold: 9, winsor: 'none', n: 0, median: null, winsorMean: null },
];

const EA_SENSITIVITY = [
  { threshold: 3, winsor: 'none', n: 4, median: 0.46, winsorMean: 0.513 },
  { threshold: 3, winsor: 'w10-90', n: 4, median: 0.46, winsorMean: 0.513 },
  { threshold: 3, winsor: 'w05-95', n: 4, median: 0.46, winsorMean: 0.513 },
  { threshold: 6, winsor: 'none', n: 0, median: null, winsorMean: null },
  { threshold: 9, winsor: 'none', n: 0, median: null, winsorMean: null },
];

const chartCard: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
};

const barData = {
  labels: PRIMARY.map((x) => x.outcome),
  datasets: [
    {
      label: 'Median level change (days)',
      data: PRIMARY.map((x) => x.medianLevelChange),
      backgroundColor: [colors.blueberry400, colors.cantaloupe400],
      borderRadius: 6,
    },
    {
      label: 'Winsor mean change (days)',
      data: PRIMARY.map((x) => x.winsorMeanChange),
      backgroundColor: [colors.blueberry300, colors.cantaloupe300],
      borderRadius: 6,
    },
  ],
};

const barOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } },
    title: { display: true, text: 'Primary effect estimates (post - pre, days)' },
  },
  scales: {
    y: { title: { display: true, text: 'Days' } },
    x: { grid: { display: false } },
  },
};

function fmt(n: number | null | undefined, d: number = 3): string {
  if (n == null || Number.isNaN(n)) return 'n/a';
  return n.toFixed(d);
}

function SensitivityTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ threshold: number; winsor: string; n: number; median: number | null; winsorMean: number | null }>;
}) {
  return (
    <Card style={{ ...chartCard, flex: '1 1 500px' }}>
      <Heading size="small" marginBottom="s">
        {title}
      </Heading>
      <Box style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.soap300}`, textAlign: 'left' }}>
              <th style={{ padding: '8px 10px' }}>Min pre/post m</th>
              <th style={{ padding: '8px 10px' }}>Winsor</th>
              <th style={{ padding: '8px 10px' }}>n</th>
              <th style={{ padding: '8px 10px' }}>Median change</th>
              <th style={{ padding: '8px 10px' }}>Winsor mean</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.threshold}-${r.winsor}`} style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                <td style={{ padding: '8px 10px' }}>{r.threshold}</td>
                <td style={{ padding: '8px 10px' }}>{r.winsor}</td>
                <td style={{ padding: '8px 10px' }}>{r.n}</td>
                <td style={{ padding: '8px 10px' }}>{fmt(r.median)}</td>
                <td style={{ padding: '8px 10px' }}>{fmt(r.winsorMean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}

export const AddDocumentsImpactDashboard: React.FC = () => {
  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug={null} />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1280, margin: '0 auto' }}>
          <PageHeader
            title="Add Documents Impact: Offer and Employment Agreement"
            subtitle="Defensible operational readout from strict cohort, robust level effects, and sensitivity checks"
          />

          <Card padding="l" marginBottom="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
            <Heading size="small" marginBottom="xs">
              TLR
            </Heading>
            <BodyText size="small" style={{ lineHeight: 1.7 }}>
              <strong>Finding</strong>: No single full-cohort PM-defensible impact exists yet for Offer and EA because source environments are mixed and strict cohorts are underpowered at higher month-coverage gates.
              <br />
              <strong>Evidence</strong>: Offer uses SANDBOX in this artefact while EA is PROD-derived; strict `&gt;=6` month gate returns n=0 for both outcomes. Under fallback thresholds we observe Offer median level shift of -0.125 days (n=10) and EA median shift of 0.000 days (n=14), with wide uncertainty.
              <br />
              <strong>Confidence</strong>: Medium-low - methodology is robust for exploratory operational signal, but not causal and not environment-aligned.
              <br />
              <strong>So what</strong>: Use this dashboard as a directional risk/priority input only. Do not use for exec causal claims. Next milestone is a single-environment panel re-run with explicit event-volume weighting and event-study/DiD.
              <br />
              <strong>Caveat</strong>: This is event-duration (BP event stats), not tracker chain metric `Time in Offer/EA` from first event start to final completed event on the same job application.
            </BodyText>
          </Card>

          <Flex gap="m" marginBottom="l" style={{ flexWrap: 'wrap' }}>
            {PRIMARY.map((p) => (
              <MetricCard
                key={p.outcome}
                label={`${p.outcome} median level change`}
                value={`${fmt(p.medianLevelChange)} d`}
                helperText={`n=${p.n} · pre m ${fmt(p.avgPreM, 2)} · post m ${fmt(p.avgPostM, 2)}`}
                changeIndicator={{ text: `Winsor mean ${fmt(p.winsorMeanChange)} d`, sentiment: p.winsorMeanChange <= 0 ? 'positive' : 'neutral' }}
                tooltip={`95% CI for winsor mean: [${fmt(p.ciLow)}, ${fmt(p.ciHigh)}] days`}
              />
            ))}
          </Flex>

          <Card style={{ ...chartCard, marginBottom: 16 }}>
            <div style={{ height: 320 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </Card>

          <Card style={{ ...chartCard, marginBottom: 16 }}>
            <Heading size="small" marginBottom="s">
              Primary estimate table
            </Heading>
            <Box style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.soap300}`, textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Outcome</th>
                    <th style={{ padding: '8px 10px' }}>n</th>
                    <th style={{ padding: '8px 10px' }}>Pre median</th>
                    <th style={{ padding: '8px 10px' }}>Post median</th>
                    <th style={{ padding: '8px 10px' }}>Median change</th>
                    <th style={{ padding: '8px 10px' }}>Winsor mean</th>
                    <th style={{ padding: '8px 10px' }}>95% CI</th>
                    <th style={{ padding: '8px 10px' }}>Weighted change</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIMARY.map((p) => (
                    <tr key={p.outcome} style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                      <td style={{ padding: '8px 10px' }}>{p.outcome}</td>
                      <td style={{ padding: '8px 10px' }}>{p.n}</td>
                      <td style={{ padding: '8px 10px' }}>{fmt(p.preMedian)}</td>
                      <td style={{ padding: '8px 10px' }}>{fmt(p.postMedian)}</td>
                      <td style={{ padding: '8px 10px' }}>{fmt(p.medianLevelChange)}</td>
                      <td style={{ padding: '8px 10px' }}>{fmt(p.winsorMeanChange)}</td>
                      <td style={{ padding: '8px 10px' }}>
                        [{fmt(p.ciLow)}, {fmt(p.ciHigh)}]
                      </td>
                      <td style={{ padding: '8px 10px' }}>{fmt(p.weightedLevelChange)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <BodyText size="small" color={colors.blackPepper500} style={{ marginTop: 10 }}>
              Weighting uses month-coverage proxy (`min(pre_m, post_m)`) in this artefact because explicit event volumes are not present in the source markdown table.
            </BodyText>
          </Card>

          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <SensitivityTable title="Sensitivity - Offer" rows={OFFER_SENSITIVITY} />
            <SensitivityTable title="Sensitivity - Employment Agreement" rows={EA_SENSITIVITY} />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default AddDocumentsImpactDashboard;
