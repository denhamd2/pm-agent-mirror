import React, { useMemo } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { LABELS } from './data-bp-durations';
import { HEADLINE_KPIS } from './data-interview-metrics';
import { FEATURE_ADOPTION } from './data-recruiting-adoption';
import { getSliceSubBpsAndHeadline, EMPTY_TENANT_FILTER } from './data-bp-durations-by-segment';

/** Cross-check against TA Business Value Metric Tracker (Jamie Moore PDF). Status = data we can surface in this workspace today. */
const TRACKER_COVERAGE: { category: string; metric: string; status: string; dashboard: string }[] = [
  { category: 'Time to Hire', metric: 'Time to Hire (IUM)', status: 'Yes · IUM 2358 · SANDBOX', dashboard: 'Average Time to Hire' },
  { category: 'Time to Hire', metric: 'Time to (first) Fill', status: 'No · deprioritised in tracker', dashboard: '—' },
  { category: 'Interview', metric: 'Time in Interview BP', status: 'Yes · Pharos aggregates', dashboard: 'Interview metrics' },
  { category: 'Interview', metric: 'Volumes, sessions, MISST, capacity', status: 'Yes', dashboard: 'Interview metrics' },
  { category: 'Productivity', metric: 'Recruiter / coordinator capacity', status: 'Yes · capacity tab', dashboard: 'Interview metrics' },
  { category: 'Offers / EAs', metric: 'Time in sub-BP (Offer, EA, …)', status: 'Yes · bp_event_stats (not same as tracker “Time in Offer/EA”)', dashboard: 'Sub-BP durations' },
  { category: 'Offers / EAs', metric: 'Time in Offer/EA (job-app chain per PDF)', status: 'Not yet · HRREC-90616 in progress', dashboard: 'Would need event-chain SQL / IUM' },
  { category: 'Offers / EAs', metric: '# Offers accepted, # EA accepted', status: 'Partial · use bp_event_stats volumes (not packaged as tracker IUMs here)', dashboard: 'Sub-BP durations' },
  { category: 'Retention', metric: 'New hire retention IUMs', status: 'Blocked / test tables per tracker', dashboard: '—' },
  { category: 'Candidate experience', metric: 'Career site funnel IUMs', status: 'In progress in prod per tracker', dashboard: '—' },
  { category: 'Internal mobility', metric: 'Internal applications IUM', status: 'Partial (81528 noted); not wired here', dashboard: '—' },
  { category: 'Applicant volumes', metric: 'Diversity IUMs (race, gender, age)', status: 'Not in these dashboards', dashboard: '—' },
 { category: 'Other', metric: 'Referrals, Peakon, JR Agent time, sourcing %', status: 'No / blocked / separate teams', dashboard: '—' },
];

const TOOLTIPS = {
  tth:
    'Mean tenant-level time to hire in days from IUM 2358. Each tenant contributes one value per month; we show the average across tenants with data (SANDBOX).',
  ttf:
    'Mean tenant-level time to fill in days from IUM 2359. Same averaging pattern as time to hire (SANDBOX).',
  pos:
    'IUM2360 (open) and 2361 (filled): average counts per tenant. Fill ratio is filled divided by open for the latest month.',
  interview:
    'Interview funnel KPIs from Pharos recruiting analytics: job applications, rounds, sessions, and mean time in Interview BP (completed-path averages, excludes right-censored months per series notes).',
  subBp:
    'Per sub-business-process duration from dw.swh.bp_event_stats: mean and median days for Completed events, aggregated by month. Employment Agreement uses bp_type_id Propose Compensation Offer/Employment Agreement.',
  scorecard:
    'Per-tenant scorecard: IUM time to hire/fill plus PCA feature adoption and bottleneck strip from sub-BP medians.',
  recruiting:
    'Module adoption and utilisation IUMs on PROD tenants (metrics 428, 314, 508) from internal usage feed.',
  offerBench:
    'Accenture vs Walmart Offer BP comparison from bp_event_stats: mean completed duration and monthly medians.',
};

// ─── Headline data (static snapshots from Pharos, latest month) ───

const HEADLINES = {
  timeToHire: {
    label: 'Avg Time to Hire',
    value: '71.7 days',
    helperText: 'Feb 2026 · 3,404 tenants · IUM 2358',
    change: { text: '-5.1 vs prev month', sentiment: 'positive' as const },
    href: '/avg-time-to-hire',
    description: 'Average calendar days from requisition open to hire completion across SANDBOX tenants.',
  },
  timeToFill: {
    label: 'Avg Time to Fill',
    value: '127.9 days',
    helperText: 'Feb 2026 · 542 tenants · IUM 2359',
    change: { text: '-7.5 vs prev month', sentiment: 'positive' as const },
    href: '/avg-time-to-fill',
    description: 'Average calendar days from requisition open to position filled across SANDBOX tenants.',
  },
  positionsFilled: {
    label: 'Positions Filled',
    value: '21.9 avg',
    helperText: 'Feb 2026 · 4,335 tenants · IUM 2361',
    change: { text: '+1.3 vs prev month', sentiment: 'positive' as const },
    href: '/positions-open-vs-filled',
    description: 'Average count of positions filled per tenant per month, with open requisition comparison.',
  },
};

const DashboardLink: React.FC<{
  href: string;
  title: string;
  description: string;
  metricCard: React.ReactNode;
}> = ({ href, title, description, metricCard }) => (
  <a
    href={href}
    style={{
      textDecoration: 'none',
      color: 'inherit',
      flex: '1 1 300px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Card
      padding="l"
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        boxShadow: SANA_CARD_SHADOW,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = colors.blueberry400;
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = SANA_CARD_SHADOW;
        e.currentTarget.style.borderColor = colors.soap300;
      }}
    >
      {metricCard}
      <Box style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.soap200}` }}>
        <Heading size="small" marginBottom="xxs">{title}</Heading>
        <BodyText size="small" color={colors.blackPepper400} style={{ lineHeight: 1.5 }}>
          {description}
        </BodyText>
        <BodyText
          size="small"
          style={{
            marginTop: '12px',
            color: colors.blueberry500,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          View dashboard →
        </BodyText>
      </Box>
    </Card>
  </a>
);

function fmtDays(n: number): string {
  if (n <= 0 || Number.isNaN(n)) return '—';
  return `${n.toFixed(1)} d`;
}

export const ValueRealizationMetrics: React.FC = () => {
  const { headline } = useMemo(() => getSliceSubBpsAndHeadline(EMPTY_TENANT_FILTER), []);
  const latestYm = LABELS[LABELS.length - 1];
  const offerH = headline.offer;
  const eaH = headline.employment_agreement;
  const interviewBp = HEADLINE_KPIS.avgTimeInBP;
  const latestRecruiting = FEATURE_ADOPTION['Recruiting (core)']?.slice(-1)[0];
  const recruitingPct = ((latestRecruiting?.adoption ?? 0) * 100).toFixed(1);

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="value-realization-metrics" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
        <PageHeader
          title="Value Realisation Metrics"
          subtitle="TA value tracker alignment · Pharos IUM and bp_event_stats · SANDBOX (unless noted)"
        />

        <BodyText size="small" color={colors.blackPepper500} style={{ marginBottom: 20, lineHeight: 1.6, maxWidth: 900 }}>
          This landing page maps the{' '}
          <strong>Talent Acquisition Business Value Metric Tracker</strong> (Jamie Moore) to dashboards in this workspace.
          <strong> Avg. time in [sub-BP]</strong> here is{' '}
          <strong>not</strong> the same as the tracker’s “Time in Offer/EA” definition (first EA start → final completed EA on a job application).
          We use <strong>per-event</strong> completed durations from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.swh.bp_event_stats</code>, monthly aggregates.
          Matching the tracker would need job-application-level chaining (HRREC-90616 direction) or the delivered IUM once in tables.
        </BodyText>

        <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
          <DashboardLink
            href={HEADLINES.timeToHire.href}
            title="Average Time to Hire"
            description={HEADLINES.timeToHire.description}
            metricCard={
              <MetricCard
                label={HEADLINES.timeToHire.label}
                value={HEADLINES.timeToHire.value}
                helperText={HEADLINES.timeToHire.helperText}
                changeIndicator={HEADLINES.timeToHire.change}
                tooltip={TOOLTIPS.tth}
              />
            }
          />
          <DashboardLink
            href={HEADLINES.timeToFill.href}
            title="Average Time to Fill"
            description={HEADLINES.timeToFill.description}
            metricCard={
              <MetricCard
                label={HEADLINES.timeToFill.label}
                value={HEADLINES.timeToFill.value}
                helperText={HEADLINES.timeToFill.helperText}
                changeIndicator={HEADLINES.timeToFill.change}
                tooltip={TOOLTIPS.ttf}
              />
            }
          />
          <DashboardLink
            href={HEADLINES.positionsFilled.href}
            title="Positions: Open vs Filled"
            description={HEADLINES.positionsFilled.description}
            metricCard={
              <MetricCard
                label={HEADLINES.positionsFilled.label}
                value={HEADLINES.positionsFilled.value}
                helperText={HEADLINES.positionsFilled.helperText}
                changeIndicator={HEADLINES.positionsFilled.change}
                tooltip={TOOLTIPS.pos}
              />
            }
          />
        </Flex>

        <Heading size="small" marginBottom="s">Related TA value dashboards</Heading>
        <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
          <DashboardLink
            href="/interview-metrics"
            title="Interview metrics"
            description="Volumes, time in Interview BP, MISST, scheduling, feedback latency, recruiter capacity."
            metricCard={
              <MetricCard
                label="Avg time in Interview BP"
                value={`${interviewBp.avg.toFixed(1)} days`}
                helperText={`${interviewBp.tenants.toLocaleString()} tenants · latest series`}
                changeIndicator={{ text: 'See Time tab', sentiment: 'neutral' }}
                tooltip={TOOLTIPS.interview}
              />
            }
          />
          <DashboardLink
            href="/bp-durations"
            title="Sub-BP durations and bottlenecks"
            description="Offer, Employment Agreement (after Offer in flow), and other recruiting sub-BPs: averages, medians, task bottlenecks."
            metricCard={
              <MetricCard
                label="Offer vs Employment Agreement (avg completed)"
                value={`${fmtDays(offerH?.avgDaysCompleted ?? 0)} · ${fmtDays(eaH?.avgDaysCompleted ?? 0)}`}
                helperText={`Global PROD slice · ${latestYm} headline`}
                changeIndicator={{ text: 'Detail tab per sub-BP', sentiment: 'neutral' }}
                tooltip={TOOLTIPS.subBp}
              />
            }
          />
          <DashboardLink
            href="/customer-scorecard"
            title="Customer scorecard"
            description="Per-tenant TTH/TTF, PCA adoption, and bottleneck flow strip (sub-BP medians including EA after Offer)."
            metricCard={
              <MetricCard
                label="Scorecard + bottlenecks"
                value="Tenant pickers"
                helperText="IUM + bp_event_stats + PCA"
                changeIndicator={{ text: 'Live', sentiment: 'positive' }}
                tooltip={TOOLTIPS.scorecard}
              />
            }
          />
        </Flex>

        <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
          <DashboardLink
            href="/recruiting-adoption"
            title="Recruiting adoption"
            description="Core Recruiting module adoption, onboarding attach rate, utilisation composite."
            metricCard={
              <MetricCard
                label="Recruiting adoption (core)"
                value={`${recruitingPct}%`}
                helperText={`${(latestRecruiting?.tenants ?? 0).toLocaleString()} PROD tenants · metric 428`}
                changeIndicator={{ text: 'Latest month in series', sentiment: 'neutral' }}
                tooltip={TOOLTIPS.recruiting}
              />
            }
          />
          <DashboardLink
            href="/view-dashboard"
            title="Offer BP benchmark"
            description="Accenture vs Walmart: average and median completed Offer duration from bp_event_stats."
            metricCard={
              <MetricCard
                label="Offer duration benchmark"
                value="11.6 d vs 1.6 d"
                helperText="12-mo means (example tenants)"
                changeIndicator={{ text: 'PROD', sentiment: 'neutral' }}
                tooltip={TOOLTIPS.offerBench}
              />
            }
          />
        </Flex>

        <Card padding="l" marginBottom="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
          <Heading size="small" marginBottom="m">Tracker coverage (this workspace)</Heading>
          <Box style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.soap300}`, textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Metric</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Data in workspace</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Dashboard</th>
                </tr>
              </thead>
              <tbody>
                {TRACKER_COVERAGE.map(row => (
                  <tr key={`${row.category}-${row.metric}`} style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                    <td style={{ padding: '8px 10px', color: colors.blackPepper600 }}>{row.category}</td>
                    <td style={{ padding: '8px 10px', color: colors.blackPepper600 }}>{row.metric}</td>
                    <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{row.status}</td>
                    <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{row.dashboard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>

        <Card padding="l" marginBottom="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
          <Heading size="small" marginBottom="xs">Defensible Add Documents impact snapshot</Heading>
          <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.7 }}>
            Latest robust readout is published in{' '}
            <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>
              docs/add-documents-adoption-impact-defensible.md
            </code>.
            It uses level effects (days), winsorised means, bootstrap confidence intervals, cohort month-coverage gates,
            threshold sensitivity checks, and segment consistency checks.
          </BodyText>
          <Box style={{ marginTop: 10, padding: '10px 12px', backgroundColor: colors.soap100, borderRadius: 8 }}>
            <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12, lineHeight: 1.6 }}>
              <strong>Current constraints:</strong> Offer in this artefact is SANDBOX while EA is currently PROD-derived.
              Treat results as directional operational evidence until we re-run on a single environment with explicit event-volume weighting.
            </BodyText>
          </Box>
          <BodyText size="small" style={{ marginTop: 10, fontWeight: 600 }}>
            Open dashboard: <a href="/add-documents-impact" style={{ color: colors.blueberry500 }}>Add Documents Impact</a>
          </BodyText>
        </Card>

        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
          <Heading size="small" marginBottom="xs">About These Metrics</Heading>
          <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.7 }}>
            Core IUM views query{' '}
            <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>internal_usage_metrics_report_kafka</code>.
            Sub-BP timing uses{' '}
            <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.swh.bp_event_stats</code>{' '}
            (tenant/month aggregates; PROD in bundled exports unless noted). Geography uses{' '}
            <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>wd_dc_physical</code>; infrastructure{' '}
            <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>wd_dc_type</code>.
          </BodyText>
          <Box style={{ marginTop: '16px', padding: '12px', backgroundColor: colors.soap100, borderRadius: '8px' }}>
            <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: 12 }}>
              <strong>Metric IDs:</strong> 2358 (Time to Hire) · 2359 (Time to Fill) · 2360 (Open Reqs) · 2361 (Positions Filled)
              <br />
              <strong>Data range:</strong> Last 365 days from query date (10 Apr 2026)
              <br />
              <strong>Last updated:</strong> 11 April 2026
            </BodyText>
          </Box>
        </Card>
      </Box>
      </Box>
    </Flex>
  );
};

export default ValueRealizationMetrics;
