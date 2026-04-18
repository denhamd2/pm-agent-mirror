import React, { useMemo } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { PageHeader, MetricCard, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { LABELS } from './data-bp-shared';
import { HEADLINE_KPIS } from './data-interview-metrics';
import { getSliceSubBpsAndHeadline, EMPTY_TENANT_FILTER } from './data-bp-durations-by-segment';
import { APPLICANT_VOLUME_BREAKDOWNS, QUERY_META as VALUE_IUM_QUERY_META, VALUE_REALIZATION_IUMS, type MetricSnapshot } from './data-value-realization-iums';
import { KPIS as AGENCY_TYPES_KPIS } from './data-view-dashboard';

/** Cross-check against TA Business Value Metric Tracker (Jamie Moore PDF). Status = data we can surface in this workspace today. */
const TRACKER_COVERAGE: { category: string; metric: string; status: string; dashboard: string; notes: string }[] = [
  { category: 'Time to Hire', metric: 'Time to Hire (IUM 2358)', status: 'Yes - SANDBOX', dashboard: 'Average Time to Hire', notes: 'Start: first posting date. End: latest offer accepted. Excludes EA.' },
  { category: 'Time to Hire', metric: 'Time to (first) Fill', status: 'Removed', dashboard: '-', notes: 'Legacy IUM with unresolved metric-name match. Removed from workspace.' },
  { category: 'Time to Hire', metric: 'TTH Internal / Agency Candidates', status: 'Not yet', dashboard: '-', notes: 'HRREC-89120, HRREC-89061. In progress.' },
  { category: 'Interview', metric: 'Time in Interview BP', status: 'Yes - Pharos', dashboard: 'Interview metrics', notes: 'Delivered.' },
  { category: 'Interview', metric: 'Time to First Interview Team Creation', status: 'Yes - Pharos', dashboard: 'Interview metrics', notes: 'JR initiation to first MISST submission.' },
  { category: 'Interview', metric: 'Time Interview to Feedback', status: 'Not yet', dashboard: '-', notes: 'HRREC-88029.' },
  { category: 'Interview', metric: 'Volumes (interviewers, sessions, applicants)', status: 'Yes', dashboard: 'Interview metrics', notes: 'All three delivered.' },
  { category: 'Productivity', metric: 'Recruiter Capacity / Productivity', status: 'Yes - live IUM', dashboard: 'Value Realisation', notes: 'Tracker wording is Recruiter Capacity; current live IUM metric name is Recruiter Productivity. Measures average open job reqs and evergreens per primary recruiter.' },
  { category: 'Offers / EAs', metric: 'Time in sub-BP (per event)', status: 'Yes - bp_event_stats', dashboard: 'Sub-BP durations', notes: 'Per-event completed durations. Different from tracker job-app chain.' },
  { category: 'Offers / EAs', metric: 'Time in Offer/EA (job-app chain)', status: 'Not yet', dashboard: '-', notes: 'HRREC-90616. 1st EA start to final completed EA.' },
  { category: 'Offers / EAs', metric: '# Offers/EAs Issued, Renegotiations', status: 'Proxy-only', dashboard: '-', notes: 'Live Pharos candidates exist, but none cleanly reproduce the tracker job-application event-chain definition yet.' },
  { category: 'Offers / EAs', metric: '# Offers/EA Accepted', status: 'Yes - live IUM', dashboard: 'Value Realisation / Data Sources', notes: 'Resolved live by metric_name: Number of Offers accepted. and Employment Agreement Acceptance.' },
  { category: 'Retention', metric: 'New Hire Retention', status: 'Proxy-only', dashboard: '-', notes: 'Retention study table exists, but not the tracker definition of recruiting-sourced hires retained after 12 months.' },
  { category: 'Candidate Experience', metric: 'Career site funnel (reach, started, submitted)', status: 'Proxy-only', dashboard: '-', notes: 'Career Hub events exist for reach and apply-start proxies; submitted applications still unresolved.' },
  { category: 'Applicant Volumes', metric: 'Total / by race / gender / age', status: 'Yes - live IUM', dashboard: 'Value Realisation / Data Sources', notes: 'Live metric-name resolution found gender, race/ethnicity, and age-band counts in internal_usage_metrics_report_kafka.' },
  { category: 'Internal Mobility', metric: 'Internal apps submitted', status: 'Yes - live IUM', dashboard: 'Value Realisation / Data Sources', notes: 'Resolved live by metric_name: Count of Internal Job Applications last month.' },
  { category: 'Referrals', metric: 'Total Referrals / Referral Hires', status: 'Blocked / proxy-only', dashboard: '-', notes: 'Only PCA usage proxies exist today; no direct count table was confirmed in live discovery.' },
  { category: 'Engagement', metric: 'Peakon new-hire scores', status: 'Blocked', dashboard: '-', notes: 'Peakon-adjacent table exists, but its schema does not expose new-hire score outcomes.' },
  { category: 'Other', metric: 'JR Agent time, sourcing %, quality hires', status: 'No / blocked', dashboard: '-', notes: 'Various teams. Quality hires needs HS grading.' },
];

const TOOLTIPS = {
  tth:
    'Live metric-name-resolved IUM: Average Time to Hire (currently metric_id 2358). Mean tenant-level time to hire in days from first job posting date to latest offer accepted date. Excludes Employment Agreement.',
  recruiterProductivity:
    'Live IUM metric-name-resolved card. Current live metric name is Recruiter Productivity (currently metric_id 2361). Jira HRREC-81526 defines this as the average number of open job requisitions and evergreens for each primary recruiter.',
  recruiterCapacityDashboard:
    'Dedicated recruiter-load dashboard. Uses the live Recruiter Productivity IUM as the primary KPI and pairs it with interview and application context so PMs can distinguish healthy scale from overload.',
  interview:
    'Interview funnel KPIs from Pharos recruiting analytics: job applications, rounds, sessions, and mean time in Interview BP (completed-path averages, excludes right-censored months per series notes).',
  subBp:
    'Average of Offer and Employment Agreement completed-event durations from dw.swh.bp_event_stats. Dashboard filters allow Offer-only or EA-only views.',
  scorecard:
    'Per-tenant scorecard: IUM time to hire/fill plus PCA feature adoption and bottleneck strip from sub-BP medians.',
  offerBench:
    'Accenture vs Walmart Offer BP comparison from bp_event_stats: mean completed duration and monthly medians.',
  metricTree:
    'Live-only value-driver canvas linking Recruiting business outcomes to measured product and operational drivers. Directional edges indicate credible driver logic without implying a direct causal join.',
};

const DashboardLink: React.FC<{
  href: string;
  title: string;
  description: string;
  metricCard: React.ReactNode;
}> = ({ href, title, description, metricCard }) => (
  <a
    href={href}
    onClick={(event) => {
      if (!href.startsWith('#')) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (window.location.hash !== href) {
        window.location.hash = href;
      }
    }}
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

function formatMonthLabel(ym: string | null): string {
  if (!ym) return 'Latest';
  const [year, month] = ym.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
}

function formatCountMetric(value: number | null): string {
  if (value == null || Number.isNaN(value)) return 'Unavailable';
  return `${value.toFixed(1)} avg`;
}

function formatDaysMetric(value: number | null): string {
  if (value == null || Number.isNaN(value)) return 'Unavailable';
  return `${value.toFixed(1)} days`;
}

function buildHelperText(metric: MetricSnapshot, opts?: { legacy?: boolean }): string {
  if (opts?.legacy || metric.resolution === 'legacy-unresolved') {
    return `${formatMonthLabel(metric.latestYm)} · ${metric.latestTenants.toLocaleString()} tenants · legacy workspace snapshot`;
  }
  return `${formatMonthLabel(metric.latestYm)} · ${metric.latestTenants.toLocaleString()} tenants · ${metric.metricName} (${metric.metricId}) · ${metric.environment}`;
}

function buildChangeIndicator(
  metric: MetricSnapshot,
  direction: 'lower-is-better' | 'higher-is-better'
): { text: string; sentiment: 'positive' | 'negative' | 'neutral' } {
  const liveSeries = metric.series.filter(point => point.avgValue != null);
  if (liveSeries.length < 2) {
    return { text: metric.resolution === 'live' ? 'Latest live month' : 'Legacy snapshot', sentiment: 'neutral' };
  }

  const current = liveSeries[liveSeries.length - 1].avgValue ?? 0;
  const previous = liveSeries[liveSeries.length - 2].avgValue ?? 0;
  const delta = current - previous;
  const abs = Math.abs(delta).toFixed(1);
  const prefix = delta >= 0 ? '+' : '-';

  if (delta === 0) {
    return { text: '0.0 vs prev month', sentiment: 'neutral' };
  }

  const improved =
    direction === 'lower-is-better'
      ? delta < 0
      : delta > 0;

  return {
    text: `${prefix}${abs} vs prev month`,
    sentiment: improved ? 'positive' : 'negative',
  };
}

export const ValueRealizationMetrics: React.FC = () => {
  const { headline } = useMemo(() => getSliceSubBpsAndHeadline(EMPTY_TENANT_FILTER), []);
  const latestYm = LABELS[LABELS.length - 1];
  const offerH = headline.offer;
  const eaH = headline.employment_agreement;
  const interviewBp = HEADLINE_KPIS.avgTimeInBP;
  const timeToHire = VALUE_REALIZATION_IUMS.timeToHire;
  const recruiterProductivity = VALUE_REALIZATION_IUMS.recruiterProductivity;
  const offersAccepted = VALUE_REALIZATION_IUMS.offersAccepted;
  const employmentAgreementAcceptance = VALUE_REALIZATION_IUMS.employmentAgreementAcceptance;
  const internalJobApplications = VALUE_REALIZATION_IUMS.internalJobApplications;

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="value-realization-metrics" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
        <PageHeader
          title="Value Realisation Metrics"
          subtitle="Your starting point for live Workday Recruiting outcome and adoption dashboards: time to hire, recruiter capacity, pipeline health, Add Documents, and other IUM-backed views you can open in one click."
        />
        <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
          Change badges on this page are absolute month-on-month deltas in metric units (for example days or average requisitions), not percentage change.
        </BodyText>

        <Heading size="small" marginBottom="s">Business Value Outcomes</Heading>
        <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
          <DashboardLink
            href="#avg-time-to-hire"
            title="Average Time to Hire"
            description={timeToHire.description}
            metricCard={
              <MetricCard
                label={timeToHire.label}
                value={formatDaysMetric(timeToHire.latestValue)}
                helperText={buildHelperText(timeToHire)}
                changeIndicator={buildChangeIndicator(timeToHire, 'lower-is-better')}
                tooltip={TOOLTIPS.tth}
              />
            }
          />
          <DashboardLink
            href="#recruiter-capacity"
            title="Recruiter Capacity"
            description={recruiterProductivity.description}
            metricCard={
              <MetricCard
                label="Recruiter Capacity"
                value={formatCountMetric(recruiterProductivity.latestValue)}
                helperText={buildHelperText(recruiterProductivity)}
                changeIndicator={buildChangeIndicator(recruiterProductivity, 'higher-is-better')}
                tooltip={TOOLTIPS.recruiterCapacityDashboard}
              />
            }
          />
        </Flex>

        <Tabs initialTab="dashboards">
          <Tabs.List marginBottom="l">
            <Tabs.Item data-id="dashboards">Dashboards</Tabs.Item>
            <Tabs.Item data-id="coverage">Coverage & Live Metrics</Tabs.Item>
            <Tabs.Item data-id="methods">Methods & Notes</Tabs.Item>
          </Tabs.List>

          <Tabs.Panel data-id="dashboards">
            <Heading size="small" marginBottom="s">Product Value Outcomes</Heading>
            <Flex gap="l" marginBottom="l" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
              <DashboardLink
                href="#interview-metrics"
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
                href="#bp-durations"
                title="Offer / EA durations and bottlenecks"
                description="Combined Offer and Employment Agreement sub-BP durations. Filter by Offer or EA on the dashboard."
                metricCard={
                  <MetricCard
                    label="Avg Time in Offer/EA BPs"
                    value={`${(((offerH?.avgDaysCompleted ?? 0) + (eaH?.avgDaysCompleted ?? 0)) / 2).toFixed(1)} days`}
                    helperText={`Offer ${fmtDays(offerH?.avgDaysCompleted ?? 0)} · EA ${fmtDays(eaH?.avgDaysCompleted ?? 0)} · ${latestYm}`}
                    changeIndicator={{ text: 'Filter by Offer or EA on dashboard', sentiment: 'neutral' }}
                    tooltip={TOOLTIPS.subBp}
                  />
                }
              />
              <DashboardLink
                href="#recruiting-agency-user"
                title="Recruiting Agency User"
                description="HRREC-81393 bulk Post to Agency Types: OMS-backed adoption share, tenant penetration, menu intent, and cumulative reach (Pharos PROD)."
                metricCard={
                  <MetricCard
                    label={AGENCY_TYPES_KPIS[0]?.label ?? 'Adoption Share'}
                    value={AGENCY_TYPES_KPIS[0]?.value ?? '—'}
                    helperText={AGENCY_TYPES_KPIS[0]?.detail ?? 'See dashboard for weekly trend'}
                    changeIndicator={{ text: 'OMS · weekly Saturday samples', sentiment: 'neutral' }}
                    tooltip="Definitive adoption uses Post Job payload filters (15$478022 + 15604$). No dedicated IUM; see docs/analytics/hrrec-81393-impact-report.md."
                  />
                }
              />
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel data-id="coverage">
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
                      <th style={{ padding: '8px 10px', fontWeight: 700 }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRACKER_COVERAGE.map(row => (
                      <tr key={`${row.category}-${row.metric}`} style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper600 }}>{row.category}</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper600 }}>{row.metric}</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{row.status}</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{row.dashboard}</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper400, fontSize: 12 }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Card>

            <Card padding="l" marginBottom="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
              <Heading size="small" marginBottom="xs">Newly Wired Live IUM Metrics</Heading>
              <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.7, marginBottom: 12 }}>
                These tracker metrics now resolve live from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.swh_raw.internal_usage_metrics_report_kafka</code> using metric-name resolution.
              </BodyText>
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.soap300}`, textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', fontWeight: 700 }}>Metric</th>
                      <th style={{ padding: '8px 10px', fontWeight: 700 }}>Current live metric</th>
                      <th style={{ padding: '8px 10px', fontWeight: 700 }}>Latest snapshot</th>
                      <th style={{ padding: '8px 10px', fontWeight: 700 }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      offersAccepted,
                      employmentAgreementAcceptance,
                      internalJobApplications,
                    ].map(metric => (
                      <tr key={metric.key} style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper600, fontWeight: 600 }}>{metric.label}</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{metric.metricName} ({metric.metricId})</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>{formatMonthLabel(metric.latestYm)} · {formatCountMetric(metric.latestValue)} · {metric.latestTenants.toLocaleString()} tenants</td>
                        <td style={{ padding: '8px 10px', color: colors.blackPepper400, fontSize: 12 }}>{metric.notes.join(' ')}</td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                      <td style={{ padding: '8px 10px', color: colors.blackPepper600, fontWeight: 600 }}>Applicant volumes</td>
                      <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>Gender ({APPLICANT_VOLUME_BREAKDOWNS.gender.length}) · Race/Ethnicity ({APPLICANT_VOLUME_BREAKDOWNS.raceEthnicity.length}) · Age ({APPLICANT_VOLUME_BREAKDOWNS.age.length})</td>
                      <td style={{ padding: '8px 10px', color: colors.blackPepper500 }}>
                        {formatMonthLabel(APPLICANT_VOLUME_BREAKDOWNS.gender[0]?.latestYm ?? null)} · live breakdowns available
                      </td>
                      <td style={{ padding: '8px 10px', color: colors.blackPepper400, fontSize: 12 }}>
                        Wired as live metric-name-resolved IUM groups in Data Sources and tracker coverage. Current surface exposes the grouped availability rather than charting every demographic series.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel data-id="methods">
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
                Open dashboard: <a href="#add-documents-impact" style={{ color: colors.blueberry500 }}>Add Documents Impact</a>
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
                  <strong>Live resolved metrics:</strong> {timeToHire.metricName} ({timeToHire.metricId}) · {recruiterProductivity.metricName} ({recruiterProductivity.metricId}) · {offersAccepted.metricName} ({offersAccepted.metricId}) · {employmentAgreementAcceptance.metricName} ({employmentAgreementAcceptance.metricId}) · {internalJobApplications.metricName} ({internalJobApplications.metricId})
                  <br />
                  <strong>Last refreshed:</strong> {VALUE_IUM_QUERY_META.queryDate}
                </BodyText>
              </Box>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Box>
      </Box>
    </Flex>
  );
};

export default ValueRealizationMetrics;
