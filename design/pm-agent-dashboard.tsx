import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { PageHeader, MetricCard, AlertBanner, DashboardGlobalNav } from './components';
import { ChartCard } from './components/GenUIPatterns';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG } from './components/sanaShellTheme';
import { DesignSystemTab } from './components/DesignSystemTab';
import { AgentFlowTab } from './components/AgentFlowTab';

import morningData from '../docs/morning-roundup-data.json';
import savedPrototypesData from '../docs/saved-prototypes.json';
import statsWarehouseData from '../docs/stats-warehouse-data-sources.json';
import rawPrototypesHtml from '../docs/pm-agent-prototypes.html?raw';
import { APPLICANT_VOLUME_BREAKDOWNS, VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import { Table } from '@workday/canvas-kit-react/table';
import { starIcon, starHalfIcon } from '@workday/canvas-system-icons-web';
import { SystemIcon } from '@workday/canvas-kit-react/icon';

type DashboardTab =
  | 'morning-roundup'
  | 'agent-health'
  | 'prototypes'
  | 'data-sources'
  | 'design-system'
  | 'agent-flow';

type PrototypeEntry = {
  slug: string;
  name: string;
  description: string;
  category?: string;
  route?: string;
  files?: string[];
  prd?: string;
  brief?: string;
  deck?: string;
};

type StatsWarehouseSource = (typeof statsWarehouseData.sources)[number];

const TAB_LABELS: Record<DashboardTab, string> = {
  'morning-roundup': 'Morning Roundup',
  'agent-health': 'Agent Health Scorecard',
  prototypes: 'Saved Prototypes',
  'data-sources': 'Data Sources',
  'design-system': 'Design System',
  'agent-flow': 'Agent Flow',
};

function formatResolvedSource(metric: { resolution: string; metricName: string | null; metricId: number | null; environment: string }): string {
  if (metric.resolution === 'live' && metric.metricName && metric.metricId != null) {
    return `Live IUM metric-name resolution: ${metric.metricName} (${metric.metricId}) via internal_usage_metrics_report_kafka · latest visible environment ${metric.environment}`;
  }
  return 'Legacy workspace snapshot via internal_usage_metrics_report_kafka (live metric-name unresolved)';
}

const VALUE_REALIZATION_METRICS_INVENTORY: { category: string; name: string; description: string; source: string; dashboard: string }[] = [
  {
    category: 'Value Realisation',
    name: 'Avg Time to Hire',
    description: VALUE_REALIZATION_IUMS.timeToHire.description,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.timeToHire),
    dashboard: 'Avg Time to Hire',
  },
  {
    category: 'Value Realisation',
    name: 'Avg Time to Fill',
    description: VALUE_REALIZATION_IUMS.timeToFill.description,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.timeToFill),
    dashboard: 'Avg Time to Fill',
  },
  {
    category: 'Value Realisation',
    name: 'Recruiter Capacity / Productivity',
    description: `${VALUE_REALIZATION_IUMS.recruiterProductivity.description} Tracker wording is Recruiter Capacity; the current live IUM metric name is Recruiter Productivity.`,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.recruiterProductivity),
    dashboard: 'Value Realisation',
  },
  {
    category: 'Value Realisation',
    name: 'Offers Accepted',
    description: VALUE_REALIZATION_IUMS.offersAccepted.description,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.offersAccepted),
    dashboard: 'Value Realisation / Data Sources',
  },
  {
    category: 'Value Realisation',
    name: 'Employment Agreement Acceptance',
    description: VALUE_REALIZATION_IUMS.employmentAgreementAcceptance.description,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.employmentAgreementAcceptance),
    dashboard: 'Value Realisation / Data Sources',
  },
  {
    category: 'Value Realisation',
    name: 'Internal Job Applications',
    description: VALUE_REALIZATION_IUMS.internalJobApplications.description,
    source: formatResolvedSource(VALUE_REALIZATION_IUMS.internalJobApplications),
    dashboard: 'Value Realisation / Data Sources',
  },
  {
    category: 'Applicant Volumes',
    name: 'Applicant Volumes by Gender',
    description: `Live IUM metric-name-resolved gender breakdowns across ${APPLICANT_VOLUME_BREAKDOWNS.gender.length} metrics, including female, male, no gender assigned, and non male/female gender counts.`,
    source: 'Live IUM metric-name resolution via internal_usage_metrics_report_kafka',
    dashboard: 'Value Realisation / Data Sources',
  },
  {
    category: 'Applicant Volumes',
    name: 'Applicant Volumes by Race / Ethnicity',
    description: `Live IUM metric-name-resolved race and ethnicity breakdowns across ${APPLICANT_VOLUME_BREAKDOWNS.raceEthnicity.length} surfaced metrics.`,
    source: 'Live IUM metric-name resolution via internal_usage_metrics_report_kafka',
    dashboard: 'Value Realisation / Data Sources',
  },
  {
    category: 'Applicant Volumes',
    name: 'Applicant Volumes by Age Band',
    description: `Live IUM metric-name-resolved applicant age-band breakdowns across ${APPLICANT_VOLUME_BREAKDOWNS.age.length} surfaced metrics.`,
    source: 'Live IUM metric-name resolution via internal_usage_metrics_report_kafka',
    dashboard: 'Value Realisation / Data Sources',
  },
];

const VALID_TABS = new Set<DashboardTab>([
  'morning-roundup',
  'agent-health',
  'prototypes',
  'data-sources',
  'design-system',
  'agent-flow',
]);

function getTabFromHash(): DashboardTab | null {
  const h = window.location.hash.replace(/^#\/?/, '');
  const qIdx = h.indexOf('?');
  if (qIdx < 0) return null;
  const tab = new URLSearchParams(h.slice(qIdx)).get('tab');
  return VALID_TABS.has(tab as DashboardTab) ? (tab as DashboardTab) : null;
}

function getInitialTab(): DashboardTab {
  const fromHash = getTabFromHash();
  if (fromHash) return fromHash;
  const fromSearch = new URLSearchParams(window.location.search).get('tab');
  return VALID_TABS.has(fromSearch as DashboardTab) ? (fromSearch as DashboardTab) : 'morning-roundup';
}

function getPrototypeFiles(proto: PrototypeEntry): string[] {
  if (proto.files && proto.files.length > 0) {
    return proto.files;
  }
  const files = [`design/${proto.slug}.tsx`];
  if (proto.prd) files.push(proto.prd);
  if (proto.brief) files.push(proto.brief);
  if (proto.deck) files.push(proto.deck);
  return files;
}

const METRICS_INVENTORY: { category: string; name: string; description: string; source: string; dashboard: string }[] = [
  ...VALUE_REALIZATION_METRICS_INVENTORY,

  // Interview Metrics
  { category: 'Interview', name: 'Job Applications (monthly)', description: 'Total job applications submitted per month across all production tenants.', source: 'talent_ml_interview_initiation_make_decision_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Interview Rounds (monthly)', description: 'Total interview rounds created per month.', source: 'talent_ml_interview_initiation_make_decision_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Interview Sessions (monthly)', description: 'Total interview sessions with optional competency/questionnaire enrichment.', source: 'class_relationship_interview_stats', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Avg Time in Interview BP', description: 'Mean duration (days) of completed interview business processes. Right-censored in recent months.', source: 'talent_ml_interview_initiation_make_decision_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Time to First MISST Submission', description: 'Mean days from JR initiation to first Manage Interview Scheduling Settings submission (snapshot Apr-Jul 2025).', source: 'job_req_status_daily + talent_ml_interview_misst_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Avg MISST Time per Requisition', description: 'Mean total time (minutes) a recruiter spends in MISST per requisition.', source: 'talent_ml_interview_misst_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Time to First Interview Feedback', description: 'Mean days from interview session creation to first feedback submission (completed rating events).', source: 'bp_event_record_stats', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Unique Raters / Ratings per Rater', description: 'Count of distinct interviewers submitting ratings and avg ratings per rater per month.', source: 'talent_ml_interviewer_engagement', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Recruiter / Coordinator Capacity', description: 'Average number of open JRs assigned per recruiter and per recruiting coordinator.', source: 'talent_ml_interview_initiation_make_decision_events', dashboard: 'Interview Metrics' },
  { category: 'Interview', name: 'Schedule Interview Task Duration', description: 'Mean days for Schedule Interview and Schedule Interview Team tasks (completed, monthly).', source: 'talent_ml_interview_schedule_interview_team_events', dashboard: 'Interview Metrics' },

  // Sub-BP Durations
  { category: 'Sub-BP Durations', name: 'Offer BP Duration (avg/median)', description: 'Mean and median completed Offer sub-BP event duration in days. Filtered to PROD completed events, monthly aggregates.', source: 'dw.swh.bp_event_stats (bp_type: Offer)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Employment Agreement BP Duration', description: 'Mean and median completed EA (Propose Compensation Offer/EA) event duration in days.', source: 'dw.swh.bp_event_stats (bp_type: Propose Compensation Offer/EA)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Screen BP Duration', description: 'Mean and median completed Screen sub-BP event duration in days.', source: 'dw.swh.bp_event_stats (bp_type: Screen)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Reference Check BP Duration', description: 'Mean and median completed Reference Check sub-BP event duration in days.', source: 'dw.swh.bp_event_stats (bp_type: Reference Check)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Background Check BP Duration', description: 'Mean and median completed Background Check sub-BP event duration in days.', source: 'dw.swh.bp_event_stats (bp_type: Background Check)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Assessment BP Duration', description: 'Mean and median completed Assessment sub-BP event duration in days.', source: 'dw.swh.bp_event_stats (bp_type: Assessment)', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Sub-BP Completion Rate', description: 'Percentage of events reaching Completed status out of all events (completed + cancelled + in-progress).', source: 'dw.swh.bp_event_stats', dashboard: 'BP Durations' },
  { category: 'Sub-BP Durations', name: 'Sub-BP Cancellation Rate', description: 'Percentage of events cancelled out of all events per sub-BP.', source: 'dw.swh.bp_event_stats', dashboard: 'BP Durations' },

  // BP Durations - Offer Steps
  { category: 'Offer Steps', name: 'Generate Document Task Duration', description: 'Mean days for Generate Document step within Offer BP (completed events).', source: 'dw.swh.bp_event_record_stats', dashboard: 'BP Durations (Offer tab)' },
  { category: 'Offer Steps', name: 'Review Documents Task Duration', description: 'Mean days for Review Documents step within Offer BP.', source: 'dw.swh.bp_event_record_stats', dashboard: 'BP Durations (Offer tab)' },
  { category: 'Offer Steps', name: 'Add Documents Task Duration', description: 'Mean days for Add Documents step within Offer BP.', source: 'dw.swh.bp_event_record_stats', dashboard: 'BP Durations (Offer tab)' },
  { category: 'Offer Steps', name: 'Bulk Approve Task Duration', description: 'Mean days for Bulk Approve step within Offer BP.', source: 'dw.swh.bp_event_record_stats', dashboard: 'BP Durations (Offer tab)' },

  // EA Steps
  { category: 'EA Steps', name: 'EA Step Durations (6 steps)', description: 'Mean/median days for each step in the EA BP: Add Documents, Bulk Approve, Generate Document, Review Documents, Review Writer Generated Document, Send Back.', source: 'dw.swh.bp_event_record_stats', dashboard: 'BP Durations (EA tab)' },

  // Customer Scorecard
  { category: 'Customer Scorecard', name: 'Tenant Avg Time to Hire', description: 'Per-tenant mean TTH from live-resolved Average Time to Hire in SANDBOX. Used as the outcome metric behind scorecard ranking and peer benchmarking.', source: 'Average Time to Hire / 2358 (SANDBOX)', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'Tenant Avg Time to Fill', description: 'Per-tenant mean TTF from a historical SANDBOX extract that used the older 2359 mapping. Kept for tenant reference only, not for scorecard ranking.', source: 'Legacy Time to Fill extract (older 2359 mapping, SANDBOX)', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'PCA Feature Adoption (per tenant)', description: 'Binary adopted/not-adopted per feature per tenant. 75 Recruiting/TA features mapped via task_to_pca_mapping, usage from customer360.', source: 'customer360 + task_to_pca_mapping', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'Feature-TTH Correlation (global)', description: 'Median TTH comparison: median(TTH_off) - median(TTH_on) per feature. Ranked by deltaTthDays. Pre-baked with Mann-Whitney U q-values and Benjamini-Hochberg adjustment, then normalised in-app so impactMagnitudeDays = abs(deltaTthDays) and confidence follows q/n thresholds consistently.', source: 'IUM 2358 + PCA adoption', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'Feature-TTH Correlation (filtered)', description: 'Same median comparison recomputed at runtime for segment/industry filters. q-values are not recomputed for filtered slices. Support column is capped at medium (never high) - reflects sample size only, not statistical significance.', source: 'IUM 2358 + PCA adoption + tenant_filters', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'Peer Benchmark (top 3 missing features)', description: 'Top 3 features adopted by segment/industry peers but not by the selected tenant, ranked by deltaTthDays impact.', source: 'PCA adoption + correlations', dashboard: 'Customer Scorecard' },
  { category: 'Customer Scorecard', name: 'Bottleneck Flow Strip', description: 'Per-tenant sub-BP median durations (Offer, EA, Screen, Reference Check, etc.) from bp_event_stats, presented as visual flow strip.', source: 'dw.swh.bp_event_stats (tenant-level)', dashboard: 'Customer Scorecard' },

  // Add Documents / Impact
  { category: 'Add Documents', name: 'Configured BP Definitions', description: 'Count of tenants with Add Documents configured in business process definitions (IUM 1757).', source: 'IUM 1757 (SANDBOX)', dashboard: 'Add Documents Impact' },
  { category: 'Add Documents', name: 'Refs Without Docs', description: 'Count of document references created without attached documents (IUM 1758).', source: 'IUM 1758 (SANDBOX)', dashboard: 'Add Documents Impact' },
  { category: 'Add Documents', name: 'Refs With Docs', description: 'Count of document references created with attached documents (IUM 1759).', source: 'IUM 1759 (SANDBOX)', dashboard: 'Add Documents Impact' },
  { category: 'Add Documents', name: 'Documents Created', description: 'Count of documents created through Add Documents step (IUM 1760).', source: 'IUM 1760 (SANDBOX)', dashboard: 'Add Documents Impact' },
  { category: 'Add Documents', name: 'Offer Duration Impact (pre/post adoption)', description: 'Level effect in days comparing pre-adoption vs post-adoption Offer BP durations. Winsorised mean, bootstrap 95% CI.', source: 'bp_event_stats + IUM adoption flags', dashboard: 'Add Documents Impact' },

  // Recruiting Adoption
  { category: 'Recruiting Adoption', name: 'Recruiting (core) Adoption Rate', description: 'Proportion of PROD tenants with Recruiting module enabled (metric 428, boolean avg).', source: 'WUM metric 428 (PROD)', dashboard: 'Recruiting Adoption' },
  { category: 'Recruiting Adoption', name: 'Onboarding Adoption Rate', description: 'Proportion of PROD tenants with Onboarding enabled (metric 314, boolean avg).', source: 'WUM metric 314 (PROD)', dashboard: 'Recruiting Adoption' },
  { category: 'Recruiting Adoption', name: 'Total Applications Volume', description: 'Monthly average total applications submitted per tenant (metric 508).', source: 'WUM metric 508 (PROD)', dashboard: 'Recruiting Adoption' },

  // Segmentation / Enrichment
  { category: 'Segmentation', name: 'Tenant Region/Segment', description: 'Per-tenant segment (APAC, EMEA, North America, Japan, Corporate, US Federal) from interview dashboard tenant filters lookup table.', source: 'interview_dashboard_tenant_filters', dashboard: 'Multiple (Scorecard, BP Durations)' },
  { category: 'Segmentation', name: 'Tenant Industry (super_industry)', description: 'Per-tenant industry classification (14 industries). ~225 tenants have missing values.', source: 'interview_dashboard_tenant_filters', dashboard: 'Multiple (Scorecard, BP Durations)' },
  { category: 'Segmentation', name: 'Tenant Company Size Band', description: 'Per-tenant company size classification from tenant filters lookup.', source: 'interview_dashboard_tenant_filters', dashboard: 'Interview Metrics' },

  // Statistical Methods
  { category: 'Statistical Methods', name: 'Pearson Correlation (Value Driver Tree)', description: 'Standard Pearson r on monthly time series between linked metrics. Requires min 3 overlapping months; 5+ for non-Weak rating. Thresholds: |r| ≥ 0.75 Strong, ≥ 0.45 Moderate, else Weak. Exploratory only due to small n (~6) and no significance testing.', source: 'recruiting-metric-tree.tsx', dashboard: 'Value Driver Tree' },
  { category: 'Statistical Methods', name: 'Median TTH Impact (Customer Scorecard)', description: 'median(TTH_off) − median(TTH_on) per feature. Mann-Whitney U test with Benjamini-Hochberg FDR correction. Confidence rule is enforced consistently in-app: High = q ≤ 0.05 AND n ≥ 30 both arms; Medium = n ≥ 10; Low = otherwise. Cohen\'s d effect size is included. impactMagnitudeDays is normalised to abs(deltaTthDays).', source: 'IUM 2358 + PCA adoption', dashboard: 'Customer Scorecard' },
  { category: 'Statistical Methods', name: 'Bottleneck Score (BP Durations)', description: 'Composite ranking heuristic: avgHours × log10(1 + volume). Prioritises bottlenecks by combining duration and frequency. Not a statistical correlation - no hypothesis testing applied.', source: 'bp_event_record_stats', dashboard: 'BP Durations' },
];

const sourceChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  backgroundColor: colors.soap100,
  color: colors.blackPepper500,
  fontSize: 12,
  fontWeight: 600,
};

export const PMAgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(getInitialTab);

  // Parse morning data
  const actionItems = morningData.jiraResponses || [];
  const customerIssues = morningData.customerIssues || [];
  const competitorNews = morningData.competitorNews || [];
  
  const [savedPrototypes, setSavedPrototypes] = useState<string[]>(
    (savedPrototypesData.saved || []).map((p: any) => p.slug)
  );

  useEffect(() => {
    fetch('http://localhost:8765/api/saved-prototypes')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(resp => {
        setSavedPrototypes((resp.saved || []).map((p: any) => p.slug));
      })
      .catch(() => { /* server unavailable; keep bundled fallback */ });
  }, []);

  const allPrototypes = React.useMemo<PrototypeEntry[]>(() => {
    const match = rawPrototypesHtml.match(/<script id="prototypes-data" type="application\/json">([\s\S]*?)<\/script>/);
    return match ? JSON.parse(match[1]).prototypes : [];
  }, []);

  const orderedPrototypes = React.useMemo(() => {
    return [...allPrototypes].sort((a, b) => {
      const aSaved = savedPrototypes.includes(a.slug) ? 1 : 0;
      const bSaved = savedPrototypes.includes(b.slug) ? 1 : 0;
      if (aSaved !== bSaved) {
        return bSaved - aSaved;
      }
      return a.name.localeCompare(b.name);
    });
  }, [allPrototypes, savedPrototypes]);

  const sourceSummary = React.useMemo(() => {
    const sources = statsWarehouseData.sources as StatsWarehouseSource[];
    return {
      total: sources.length,
      validated: sources.filter(source => source.status.startsWith('validated')).length,
      exploratory: sources.filter(source => source.status === 'exploratory').length,
      dashboards: new Set(sources.flatMap(source => source.usedInDashboards)).size,
    };
  }, []);

  React.useEffect(() => {
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    const isOwnRoute = currentHash.startsWith('pm-agent-dashboard');
    if (!isOwnRoute) return;
    const newHash = `#pm-agent-dashboard?tab=${activeTab}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState({}, '', newHash);
    }
  }, [activeTab]);

  React.useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace(/^#\/?/, '');
      if (!h.startsWith('pm-agent-dashboard')) return;
      const tab = getTabFromHash();
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleSave = async (slug: string, proto: PrototypeEntry) => {
    const previousSaved = [...savedPrototypes];
    const isSaved = previousSaved.includes(slug);
    const newSaved = !isSaved;

    if (newSaved) {
      setSavedPrototypes([...new Set([...previousSaved, slug])]);
    } else {
      setSavedPrototypes(previousSaved.filter(s => s !== slug));
    }

    try {
      const res = await fetch('http://localhost:8765/api/save-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, files: getPrototypeFiles(proto), saved: newSaved }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
    } catch (err) {
      console.error('Save failed:', err);
      setSavedPrototypes(previousSaved);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: SANA_PAGE_CANVAS,
      }}
    >
      <DashboardGlobalNav activeMainTab={activeTab} showMetricsNav={false} />
      <Box style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <PageHeader
          title={TAB_LABELS[activeTab]}
          subtitle={`Last updated: ${new Date(morningData.generated).toLocaleString()}`}
          primaryActionText="Refresh Data"
          secondaryActionText="Export Report"
        />

        {customerIssues.length > 0 && (
          <AlertBanner
            type="error"
            message={`${customerIssues.length} customer escalation(s) require your attention today.`}
            actionText="View escalations"
            onClick={() => setActiveTab('morning-roundup')}
          />
        )}

        <Box>
          {activeTab === 'morning-roundup' && (
            <Flex gap="m" marginBottom="l" flexWrap="wrap">
              <Box style={{ flex: '1 1 100%' }}>
                <Heading size="medium" marginBottom="m">Jira Action Items</Heading>
                {actionItems.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No action items today.</BodyText>
                ) : (
                  <Flex gap="m" flexDirection="column">
                    {actionItems.map((item: any, i: number) => (
                      <Card key={i} padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                        <Flex justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <BodyText size="medium" fontWeight="bold">
                              <a href={item.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry400, textDecoration: 'none' }}>
                                {item.key}: {item.summary}
                              </a>
                            </BodyText>
                            <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                              {item.tldrSummary}
                            </BodyText>
                          </Box>
                          <Box style={{ backgroundColor: colors.soap200, padding: '4px 8px', borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold">{item.priority}</BodyText>
                          </Box>
                        </Flex>
                        <Box marginTop="m" padding="s" style={{ backgroundColor: colors.frenchVanilla100, borderLeft: `4px solid ${colors.blueberry400}` }}>
                          <BodyText size="small" fontWeight="bold">{item.latestComment?.author} on {item.latestComment?.date}</BodyText>
                          <BodyText size="small" marginTop="xxs">{item.latestComment?.tldr}</BodyText>
                        </Box>
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>

              <Box style={{ flex: '1 1 100%', marginTop: space.l }}>
                <Heading size="medium" marginBottom="m">Customer Issues</Heading>
                {customerIssues.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No customer issues today.</BodyText>
                ) : (
                  <Flex gap="m" flexDirection="column">
                    {customerIssues.map((issue: any, i: number) => (
                      <Card key={i} padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, borderLeft: `4px solid ${colors.cinnamon500}` }}>
                        <Flex justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <BodyText size="medium" fontWeight="bold">
                              <a href={issue.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry400, textDecoration: 'none' }}>
                                {issue.key}: {issue.summary}
                              </a>
                            </BodyText>
                            <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                              Customer: {issue.customer} | Status: {issue.status} | Created: {issue.created}
                            </BodyText>
                            <BodyText size="small" marginTop="s">{issue.tldrSummary}</BodyText>
                          </Box>
                        </Flex>
                        {issue.diagnosis && (
                          <Box marginTop="m" padding="s" style={{ backgroundColor: colors.soap100, borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold">Deployment Agent Diagnosis ({issue.diagnosis.confidence} Confidence)</BodyText>
                            <BodyText size="small" marginTop="xxs">Classification: {issue.diagnosis.classification}</BodyText>
                            <BodyText size="small" marginTop="xxs">{issue.diagnosis.reasoning}</BodyText>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>

              <Box style={{ flex: '1 1 100%', marginTop: space.l }}>
                <Heading size="medium" marginBottom="m">Competitor News</Heading>
                {competitorNews.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No competitor news today.</BodyText>
                ) : (
                  <Flex gap="m" flexWrap="wrap">
                    {competitorNews.map((news: any, i: number) => (
                      <Card key={i} padding="m" style={{ flex: '1 1 300px', borderRadius: SANA_CARD_RADIUS_LG }}>
                        <BodyText size="small" fontWeight="bold" color={colors.licorice400}>{news.competitor} • {news.date}</BodyText>
                        <Heading size="small" marginTop="xs" marginBottom="s">
                          <a href={news.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry500, textDecoration: 'none' }}>
                            {news.title}
                          </a>
                        </Heading>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: colors.blackPepper500, fontSize: '14px' }}>
                          {news.bullets.map((bullet: string, j: number) => (
                            <li key={j} style={{ marginBottom: '4px' }}>{bullet}</li>
                          ))}
                        </ul>
                        {news.workdayImplication && (
                          <Box marginTop="m" padding="s" style={{ backgroundColor: colors.cantaloupe100, borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold" color={colors.cantaloupe600}>Workday Implication</BodyText>
                            <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">{news.workdayImplication}</BodyText>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>
            </Flex>
          )}

          {activeTab === 'agent-health' && (
            <Box>
              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <MetricCard
                  label="Active Missions"
                  value="6"
                  helperText="Currently in progress"
                  changeIndicator={{ text: "-30 archived", sentiment: "positive" }}
                  tooltip="Count of missions marked in progress in MISSION_LOG (agent workspace health, not Pharos)."
                />
                <MetricCard
                  label="AlwaysApply Budget"
                  value="662 / 500"
                  helperText="Lines of code in alwaysApply rules"
                  changeIndicator={{ text: "-33% from 982", sentiment: "positive" }}
                  tooltip="Estimated token/line budget for always-applied Cursor rules vs target."
                />
                <MetricCard
                  label="Total Rule Lines"
                  value="13,106"
                  helperText="Across 28 .mdc and .md rules"
                  changeIndicator={{ text: "-7% from 14,152", sentiment: "positive" }}
                  tooltip="Sum of lines across orchestrator and specialist rule files in .cursor/rules."
                />
                <MetricCard
                  label="Overall Grade"
                  value="A-"
                  helperText="Based on architecture health"
                  changeIndicator={{ text: "Up from B+", sentiment: "positive" }}
                  tooltip="Qualitative workspace audit score from the agent health scorecard narrative."
                />
              </Flex>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <Box style={{ flex: '1 1 400px' }}>
                  <ChartCard
                    title="AlwaysApply Token Budget"
                    type="doughnut"
                    data={{
                      labels: ['Used (000-orchestrator)', 'Used (010-style-guide)', 'Available'],
                      datasets: [
                        {
                          data: [427, 235, 0],
                          backgroundColor: [colors.blueberry400, colors.cantaloupe400, colors.soap300],
                        },
                      ],
                    }}
                  />
                </Box>
                <Box style={{ flex: '2 1 600px' }}>
                  <ChartCard
                    title="Rule Size Distribution (Lines)"
                    type="bar"
                    data={{
                      labels: ['110', '105', '330', '430', '094', '108', '435', '420', '080', '001', '320', '200', '000', '130', '050'],
                      datasets: [
                        {
                          label: 'Lines of Code',
                          data: [767, 709, 683, 630, 620, 596, 555, 536, 461, 455, 443, 435, 427, 413, 329],
                          backgroundColor: colors.blueberry400,
                        },
                      ],
                    }}
                  />
                </Box>
              </Flex>
            </Box>
          )}

          {activeTab === 'prototypes' && (
            <Box>
              <Heading size="medium" marginBottom="xxs">Prototypes and Dashboards</Heading>
              <BodyText size="small" color={colors.licorice400} marginBottom="m">
                Saved entries stay pinned at the top and can be protected from cleanup when the local dashboard server is running.
              </BodyText>
              {orderedPrototypes.length === 0 ? (
                <BodyText size="small" color={colors.licorice300}>No prototypes found.</BodyText>
              ) : (
                <Card padding="zero" style={{ borderRadius: SANA_CARD_RADIUS_LG, overflow: 'hidden' }}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Prototype</Table.Header>
                        <Table.Header>Description</Table.Header>
                        <Table.Header>Links</Table.Header>
                        <Table.Header>Save</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {orderedPrototypes.map((proto: PrototypeEntry) => {
                        const isSaved = savedPrototypes.includes(proto.slug);
                        const route = proto.route || proto.slug;
                        return (
                          <Table.Row key={proto.slug} style={isSaved ? { backgroundColor: colors.soap100 } : {}}>
                            <Table.Cell>
                              <BodyText size="medium" fontWeight="bold" color={colors.blackPepper600}>
                                {proto.name}
                              </BodyText>
                              {proto.category && (
                                <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                                  {proto.category}
                                </BodyText>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small" color={colors.blackPepper500}>
                                {proto.description}
                              </BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <Flex gap="s" flexWrap="wrap">
                                <SecondaryButton size="small" as="a" href={`#${route}`} target="_blank">
                                  Open
                                </SecondaryButton>
                                {proto.prd && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.prd}`} target="_blank">
                                    PRD
                                  </SecondaryButton>
                                )}
                                {proto.brief && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.brief}`} target="_blank">
                                    Brief
                                  </SecondaryButton>
                                )}
                                {proto.deck && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/${proto.deck}`} target="_blank">
                                    Deck
                                  </SecondaryButton>
                                )}
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <SecondaryButton
                                size="small"
                                icon={isSaved ? starIcon : starHalfIcon}
                                aria-label={isSaved ? "Unsave prototype" : "Save prototype"}
                                onClick={() => toggleSave(proto.slug, proto)}
                                style={isSaved ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : {}}
                              >
                                {isSaved ? "Saved" : "Save"}
                              </SecondaryButton>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </Card>
              )}
            </Box>
          )}

          {activeTab === 'data-sources' && (
            <Box>
              <Heading size="medium" marginBottom="xxs">Stats Warehouse Data Sources</Heading>
              <BodyText size="small" color={colors.licorice400} marginBottom="m">
                Canonical inventory for the data sources we know, what they contain in plain English, and where they already power PM dashboards.
              </BodyText>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <MetricCard
                  label="Known sources"
                  value={String(sourceSummary.total)}
                  helperText={`Inventory reviewed ${statsWarehouseData.lastReviewed}`}
                  tooltip="Rows in stats-warehouse-data-sources.json catalogue."
                />
                <MetricCard
                  label="Validated sources"
                  value={String(sourceSummary.validated)}
                  helperText="Safe for production dashboards"
                  tooltip="Sources with validated status in the inventory (approved for PM-facing use)."
                />
                <MetricCard
                  label="Exploratory sources"
                  value={String(sourceSummary.exploratory)}
                  helperText="Discovery only until validated"
                  tooltip="Sources still in exploratory status; do not use for exec metrics without review."
                />
                <MetricCard
                  label="Dashboards covered"
                  value={String(sourceSummary.dashboards)}
                  helperText="Distinct dashboard uses recorded"
                  tooltip="Unique dashboard slugs referenced from the usedInDashboards field across sources."
                />
              </Flex>

              <Flex gap="m" flexDirection="column">
                {(statsWarehouseData.sources as StatsWarehouseSource[]).map(source => (
                  <Card key={source.id} padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="m" flexWrap="wrap">
                      <Box style={{ flex: '1 1 560px' }}>
                        <Heading size="small" marginBottom="xs">{source.name}</Heading>
                        <BodyText size="small" color={colors.licorice400} marginBottom="s">
                          `{source.table}` · {source.freshness}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                          {source.plainEnglish}
                        </BodyText>
                        <Flex gap="s" flexWrap="wrap" marginBottom="m">
                          <Box style={sourceChipStyle}>{source.status}</Box>
                          {source.usedInDashboards.slice(0, 3).map(label => (
                            <Box key={label} style={sourceChipStyle}>{label}</Box>
                          ))}
                        </Flex>
                      </Box>
                    </Flex>

                    <Flex gap="m" flexWrap="wrap">
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">Useful data points</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.usefulDataPoints.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">Used in dashboards</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.usedInDashboards.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">PM notes</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.pmNotes.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Flex>

              <Card padding="l" marginTop="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                <Heading size="medium" marginBottom="xxs">Comprehensive Metrics Inventory</Heading>
                <BodyText size="small" color={colors.licorice400} marginBottom="m">
                  Every metric gathered across Value Realisation, sub-BP durations, IUMs, Customer Scorecard, interview analytics, and recruiting adoption, with calculation details and data sources.
                </BodyText>
                <Box style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, lineHeight: 1.5 }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${colors.soap300}`, textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px', fontWeight: 700, whiteSpace: 'nowrap' }}>Category</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Metric Name</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700, minWidth: 280 }}>Description / Calculation</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700, whiteSpace: 'nowrap' }}>Data Source</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700, whiteSpace: 'nowrap' }}>Dashboard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {METRICS_INVENTORY.map((m, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${colors.soap200}`, backgroundColor: i % 2 === 0 ? 'transparent' : colors.soap100 }}>
                          <td style={{ padding: '8px 10px', color: colors.blackPepper600, fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{m.category}</td>
                          <td style={{ padding: '8px 10px', color: colors.blackPepper600, fontWeight: 500, verticalAlign: 'top' }}>{m.name}</td>
                          <td style={{ padding: '8px 10px', color: colors.blackPepper500, verticalAlign: 'top' }}>{m.description}</td>
                          <td style={{ padding: '8px 10px', color: colors.blackPepper400, fontSize: 11, verticalAlign: 'top' }}>{m.source}</td>
                          <td style={{ padding: '8px 10px', color: colors.blackPepper400, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{m.dashboard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Card>

              <Card padding="l" marginTop="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                <Heading size="medium" marginBottom="xxs">Correlation and Statistical Methods</Heading>
                <BodyText size="small" color={colors.licorice400} marginBottom="m">
                  This dashboard uses two distinct approaches for measuring relationships between metrics and features. Understanding their differences is important for interpreting confidence levels.
                </BodyText>

                <Flex gap="l" flexDirection="column">
                  <Box>
                    <Heading size="small" marginBottom="xs">Method 1: Value Driver Tree - Pearson Correlation</Heading>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                      Shows directional relationships between linked metrics in the driver tree.
                    </BodyText>
                    <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.8 }}>
                      <li><strong>Calculation:</strong> Standard Pearson correlation coefficient (r) on monthly time series</li>
                      <li><strong>Sample size:</strong> Requires minimum 3 overlapping months; 5+ for non-Weak rating</li>
                      <li><strong>Strength thresholds:</strong> |r| ≥ 0.75 Strong, ≥ 0.45 Moderate, else Weak (Cohen's conventions)</li>
                      <li><strong>Limitations:</strong> Short series (n~6), no significance testing, mixed environments (SANDBOX/PROD), time-series autocorrelation not addressed</li>
                      <li><strong>Interpretation:</strong> Treat as exploratory hypotheses about metric relationships, not validated causal links</li>
                    </ul>
                  </Box>

                  <Box>
                    <Heading size="small" marginBottom="xs">Method 2: Customer Scorecard - Median TTH Impact</Heading>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                      Ranks features by their association with faster Time to Hire.
                    </BodyText>
                    <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.8 }}>
                      <li><strong>Calculation:</strong> median(TTH_off) − median(TTH_on) per feature, where "on" = adopted, "off" = not adopted</li>
                      <li><strong>Statistical test:</strong> Mann-Whitney U (non-parametric, handles skewed distributions)</li>
                      <li><strong>Multiple comparison correction:</strong> Benjamini-Hochberg FDR (q-values) across 75 features</li>
                      <li><strong>Confidence levels:</strong> High = q ≤ 0.05 AND n ≥ 30 both arms; Medium = n ≥ 10; Low = otherwise, enforced consistently in-app</li>
                      <li><strong>Note:</strong> The impactMagnitudeDays field is normalised to absolute days (abs(deltaTthDays)), not a correlation coefficient. Cohen's d effect size is also computed to quantify standardised effect magnitude.</li>
                      <li><strong>Interpretation:</strong> High-confidence features have statistically significant TTH differences between adopters and non-adopters</li>
                    </ul>
                  </Box>

                  <Box style={{ backgroundColor: colors.soap100, padding: 16, borderRadius: 8 }}>
                    <BodyText size="small" color={colors.blackPepper600}>
                      <strong>Key distinction:</strong> The scorecard's "correlation" is observational - it shows association, not causation. Confounders (tenant size, industry, maturity) may explain differences. The Value Driver Tree correlations are exploratory due to small sample sizes (~6 months).
                    </BodyText>
                  </Box>
                </Flex>
              </Card>
            </Box>
          )}

          {activeTab === 'design-system' && <DesignSystemTab />}

          {activeTab === 'agent-flow' && <AgentFlowTab />}
        </Box>
      </Box>
    </Box>
  );
};

export default PMAgentDashboard;
