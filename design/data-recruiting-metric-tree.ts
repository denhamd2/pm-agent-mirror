import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  FEEDBACK_SUBMISSION_TIME,
  JOB_APPLICATIONS_MONTHLY,
  SCHEDULE_INTERVIEW_TIME,
  SCHEDULE_INTERVIEW_TEAM_TIME,
} from './data-interview-metrics';
import { addDocumentsMonthly, tenantAdoptionPct } from './data-add-documents';
import { offerDocumentStepMonthly, offerApprovalStepMonthly } from './data-offer-steps';
import { employmentAgreementStepMonthly } from './data-employment-agreement-steps';

export type MetricTreeLevel =
  | 'Business Value Outcomes'
  | 'Product Value Outcomes'
  | 'User Outcomes'
  | 'Feature Adoption & Usage';

export type MetricTreeConfidence = 'Measured' | 'Directional';

/** MoM/YoY colouring: time-style metrics use lowerIsBetter; adoption, completion, volume use higherIsBetter. */
export type TrendGoodDirection = 'lowerIsBetter' | 'higherIsBetter';

export type MetricTreeNode = {
  id: string;
  title: string;
  shortTitle?: string;
  level: MetricTreeLevel;
  x: number;
  y: number;
  width?: number;
  value: string;
  valueContext: string;
  trend: number[];
  momPct: number | null;
  yoyPct: number | null;
  trendGoodDirection: TrendGoodDirection;
  source: string;
  confidence: MetricTreeConfidence;
  definition: string;
  caveat?: string;
};

export type MetricTreeEdge = {
  from: string;
  to: string;
  label: string;
  confidence: MetricTreeConfidence;
};

export const TREE_META = {
  title: 'Workday Recruiting Value Driver Tree',
  subtitle:
    'Twin north-star framing: "How fast do we hire?" (Avg Time to Hire) and "How efficiently do recruiters operate?" (Recruiter Capacity).\nOnly live, working metrics with a plausible operational chain to those outcomes are included.',
  sourceSummary:
    'Combines live metric-name-resolved IUMs (SANDBOX), production interview and offer analytics (PROD), and Add Documents usage.',
  caveat:
    'The tree favours metrics with a clear operational relationship to the north-star outcomes. Directional links indicate a credible driver hypothesis, but not a direct causal join. Pearson r is computed on short series (n~6) across mixed environments (SANDBOX IUM vs PROD analytics) - treat correlation strengths as exploratory, not validated.',
  canvas: { width: 1860, height: 1100 },
} as const;

function lastN(values: number[], count = 6): number[] {
  return values.slice(Math.max(0, values.length - count));
}

function formatDays(value: number): string {
  if (!Number.isFinite(value)) return '-- days';
  return `${value.toFixed(1)} days`;
}

function formatHours(value: number): string {
  if (!Number.isFinite(value)) return '-- hrs';
  return `${value.toFixed(0)} hrs`;
}

function formatPct(value: number): string {
  if (!Number.isFinite(value)) return '--%';
  return `${value.toFixed(1)}%`;
}

function changeText(series: number[]): string {
  if (series.length < 2) return 'Latest visible month';
  const delta = series[series.length - 1] - series[series.length - 2];
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(1)} vs prev month`;
}

function changeTextCount(series: number[]): string {
  if (series.length < 2) return 'Latest visible month';
  const delta = series[series.length - 1] - series[series.length - 2];
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(0)} vs prev month`;
}

function definedSeries(values: Array<number | null>): number[] {
  return values.filter((value): value is number => value != null && Number.isFinite(value));
}

function metricValue(value: number | null, fallback = 0): number {
  return value ?? fallback;
}

function computeMomPct(fullSeries: number[]): number | null {
  if (fullSeries.length < 2) return null;
  const latest = fullSeries[fullSeries.length - 1];
  const prev = fullSeries[fullSeries.length - 2];
  if (!Number.isFinite(prev) || prev === 0) return null;
  return ((latest - prev) / Math.abs(prev)) * 100;
}

function computeYoyPct(fullSeries: number[]): number | null {
  if (fullSeries.length < 12) return null;
  const latest = fullSeries[fullSeries.length - 1];
  const yearAgo = fullSeries[fullSeries.length - 12];
  if (!Number.isFinite(yearAgo) || yearAgo === 0) return null;
  return ((latest - yearAgo) / Math.abs(yearAgo)) * 100;
}

// ── Global series (static, precomputed) ──

const timeToHire = VALUE_REALIZATION_IUMS.timeToHire;
const recruiterCapacity = VALUE_REALIZATION_IUMS.recruiterProductivity;

const timeToHireSeries = definedSeries(timeToHire.series.map((point) => point.avgValue));
const recruiterCapacitySeries = recruiterCapacity.series
  .filter((point) => point.ym >= '2025-06')
  .map((point) => point.avgValue);
const cleanedRecruiterCapacitySeries = definedSeries(recruiterCapacitySeries);

const feedbackTimeSeries = FEEDBACK_SUBMISSION_TIME.map((point) => point.avgValue);
const interviewBpSeries = AVG_TIME_IN_INTERVIEW_BP.map((point) => point.avgValue);
const jobApplicationsSeries = JOB_APPLICATIONS_MONTHLY.map((point) => point.value / point.tenants);
const addDocumentsSeries = addDocumentsMonthly.map((point) => tenantAdoptionPct(point));

const scheduleInterviewSeries = SCHEDULE_INTERVIEW_TIME.map((p) => p.avgValue);
const createTeamSeries = SCHEDULE_INTERVIEW_TEAM_TIME.map((p) => p.avgValue);

// Completed-path durations from materialised PROD bp_event_stats.
const offerDurationSeries = [5.96, 5.39, 5.17, 5.62, 4.6, 3.9, 3.96, 3.97, 4.87, 5.17, 4.57, 5.3];
const employmentAgreementDurationSeries = [2.81, 2.6, 2.58, 2.5, 2.34, 2.26, 2.25, 2.28, 2.89, 2.3, 2.24, 1.83];

const offerEaDurationSeries = offerDurationSeries.map(
  (value, index) => value + (employmentAgreementDurationSeries[index] ?? 0)
);

// Completion rates from PROD bp_event_stats (completed events / total events per month).
const offerCompletionSeries = [87.2, 88.1, 86.9, 88.4, 89.0, 87.5, 88.8, 89.2, 87.6, 88.3, 89.1, 88.7];
const eaCompletionSeries = [91.3, 90.8, 91.5, 92.0, 91.2, 90.6, 91.8, 92.4, 91.0, 91.7, 92.1, 91.5];
const offerEaCompletionSeries = offerCompletionSeries.map(
  (value, index) => (value + (eaCompletionSeries[index] ?? value)) / 2
);

// Combined Offer + EA document review
const offerReviewDocsSeries = definedSeries(offerDocumentStepMonthly['Review Documents'].map((p) => p.avgHours));
const eaReviewDocsSeries = definedSeries(employmentAgreementStepMonthly['Review Documents'].map((p) => p.avgHours));
const combinedDocReviewSeries = offerReviewDocsSeries.map((v, i) => (v + (eaReviewDocsSeries[i] ?? v)) / 2);

// Combined Offer + EA approval
const offerApprovalSeries = definedSeries(offerApprovalStepMonthly['Bulk Approve'].map((p) => p.avgHours));
const eaApprovalSeries = definedSeries(employmentAgreementStepMonthly['Bulk Approve'].map((p) => p.avgHours));
const combinedApprovalSeries = offerApprovalSeries.map((v, i) => (v + (eaApprovalSeries[i] ?? v)) / 2);

const latestAddDocuments = addDocumentsMonthly[addDocumentsMonthly.length - 1];
const latestOfferEaDurationYm = '2026-03';

export const TREE_LEVELS: MetricTreeLevel[] = [
  'Business Value Outcomes',
  'Product Value Outcomes',
  'User Outcomes',
  'Feature Adoption & Usage',
];

/** Default global tree nodes. */
export const TREE_NODES: MetricTreeNode[] = [
  // ── Level 1: Business Value Outcomes ──
  {
    id: 'avg-time-to-hire',
    title: 'Average Time to Hire',
    level: 'Business Value Outcomes',
    x: 500,
    y: 60,
    width: 320,
    value: formatDays(metricValue(timeToHire.latestValue)),
    valueContext: changeText(lastN(timeToHireSeries)),
    trend: lastN(timeToHireSeries),
    momPct: computeMomPct(timeToHireSeries),
    yoyPct: computeYoyPct(timeToHireSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Mean tenant-level time from first posting date to latest offer accepted date. North-star business outcome: how fast do we hire?',
    caveat: 'Current live recruiting IUM coverage is SANDBOX-only in the accessible warehouse.',
  },
  {
    id: 'recruiter-capacity',
    title: 'Recruiter Capacity',
    shortTitle: 'Live IUM name: Recruiter Productivity',
    level: 'Business Value Outcomes',
    x: 1060,
    y: 60,
    width: 320,
    value: `${metricValue(recruiterCapacity.latestValue).toFixed(1)} avg reqs`,
    valueContext: changeText(lastN(cleanedRecruiterCapacitySeries)),
    trend: lastN(cleanedRecruiterCapacitySeries),
    momPct: computeMomPct(cleanedRecruiterCapacitySeries),
    yoyPct: computeYoyPct(cleanedRecruiterCapacitySeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Average open requisitions and evergreens per primary recruiter. North-star operational efficiency: how efficiently do recruiters operate?',
    caveat: 'Tracker wording is Recruiter Capacity; the live warehouse metric name is Recruiter Productivity.',
  },
  // ── Level 2: Product Value Outcomes ──
  {
    id: 'time-in-interview-bp',
    title: 'Time in Interview BP',
    level: 'Product Value Outcomes',
    x: 100,
    y: 310,
    width: 300,
    value: formatDays(AVG_TIME_IN_INTERVIEW_BP[AVG_TIME_IN_INTERVIEW_BP.length - 1].avgValue),
    valueContext: changeText(lastN(interviewBpSeries)),
    trend: lastN(interviewBpSeries),
    momPct: computeMomPct(interviewBpSeries),
    yoyPct: computeYoyPct(interviewBpSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Average completed-path time spent in the Interview business process. The largest measured contributor to total time-to-hire.',
    caveat: 'Recent months can be right-censored, so the latest point is best read alongside the broader trend.',
  },
  {
    id: 'offer-ea-duration',
    title: 'Time in Offer/EA BP',
    level: 'Product Value Outcomes',
    x: 530,
    y: 310,
    width: 300,
    value: formatDays(offerEaDurationSeries[offerEaDurationSeries.length - 1]),
    valueContext: changeText(lastN(offerEaDurationSeries)),
    trend: lastN(offerEaDurationSeries),
    momPct: computeMomPct(offerEaDurationSeries),
    yoyPct: computeYoyPct(offerEaDurationSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Combined completed-event duration across the Offer and Employment Agreement business processes. These are sequential late-stage steps; total cycle time directly impacts hiring speed and recruiter workload.',
  },
  {
    id: 'job-applications',
    title: 'Job Applications',
    level: 'Product Value Outcomes',
    x: 960,
    y: 310,
    width: 280,
    value: `${jobApplicationsSeries[jobApplicationsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: changeTextCount(lastN(jobApplicationsSeries)),
    trend: lastN(jobApplicationsSeries),
    momPct: computeMomPct(jobApplicationsSeries),
    yoyPct: computeYoyPct(jobApplicationsSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Average application volume per reporting tenant. Application load drives recruiter capacity pressure and downstream interview queue depth.',
  },
  // ── Level 3: User Outcomes ──
  {
    id: 'create-interview-team',
    title: 'Create Interview Team',
    shortTitle: 'Schedule Interview Team',
    level: 'User Outcomes',
    x: 20,
    y: 560,
    width: 260,
    value: formatHours(createTeamSeries[createTeamSeries.length - 1]),
    valueContext: changeText(lastN(createTeamSeries)),
    trend: lastN(createTeamSeries),
    momPct: computeMomPct(createTeamSeries),
    yoyPct: computeYoyPct(createTeamSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Average hours to create and finalise the interview team. A key early bottleneck in the Interview BP that delays downstream scheduling.',
    caveat: '~600 reporting tenants - lower coverage than volume metrics.',
  },
  {
    id: 'schedule-interviews',
    title: 'Schedule Interviews',
    shortTitle: 'Schedule Interview',
    level: 'User Outcomes',
    x: 290,
    y: 560,
    width: 260,
    value: formatHours(scheduleInterviewSeries[scheduleInterviewSeries.length - 1]),
    valueContext: changeText(lastN(scheduleInterviewSeries)),
    trend: lastN(scheduleInterviewSeries),
    momPct: computeMomPct(scheduleInterviewSeries),
    yoyPct: computeYoyPct(scheduleInterviewSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Average hours to schedule interview sessions once the interview team is in place. Scheduling latency is the most visible drag on interview cycle time.',
    caveat: '~2,800 reporting tenants.',
  },
  {
    id: 'feedback-time',
    title: 'Feedback Submission Time',
    shortTitle: 'Rate Interview / Give Feedback',
    level: 'User Outcomes',
    x: 560,
    y: 560,
    width: 260,
    value: formatHours(feedbackTimeSeries[feedbackTimeSeries.length - 1]),
    valueContext: changeText(lastN(feedbackTimeSeries)),
    trend: lastN(feedbackTimeSeries),
    momPct: computeMomPct(feedbackTimeSeries),
    yoyPct: computeYoyPct(feedbackTimeSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average hours for interviewers to submit feedback. Consistently the longest sub-task inside the Interview BP.',
    caveat: '~2,300 reporting tenants; smaller coverage than volume metrics.',
  },
  {
    id: 'document-review',
    title: 'Document Review Time',
    shortTitle: 'Review Documents',
    level: 'User Outcomes',
    x: 830,
    y: 560,
    width: 260,
    value: formatHours(combinedDocReviewSeries[combinedDocReviewSeries.length - 1]),
    valueContext: changeText(lastN(combinedDocReviewSeries)),
    trend: lastN(combinedDocReviewSeries),
    momPct: computeMomPct(combinedDocReviewSeries),
    yoyPct: computeYoyPct(combinedDocReviewSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Blended average hours in the "Review Documents" step across both Offer and Employment Agreement BPs. The clearest measured late-stage document bottleneck.',
    caveat: 'Unweighted mean of Offer and EA step latencies. Task-level, not whole-BP duration.',
  },
  {
    id: 'approval-time',
    title: 'Approval Time',
    shortTitle: 'Bulk Approve',
    level: 'User Outcomes',
    x: 1100,
    y: 560,
    width: 260,
    value: formatHours(combinedApprovalSeries[combinedApprovalSeries.length - 1]),
    valueContext: changeText(lastN(combinedApprovalSeries)),
    trend: lastN(combinedApprovalSeries),
    momPct: computeMomPct(combinedApprovalSeries),
    yoyPct: computeYoyPct(combinedApprovalSeries),
    trendGoodDirection: 'lowerIsBetter',
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Blended average hours in the "Bulk Approve" step across both Offer and Employment Agreement BPs. The strongest measured approval latency signal.',
    caveat: 'Unweighted mean of Offer and EA approval latencies. Low tenant coverage compared with top-line duration series.',
  },
  {
    id: 'offer-ea-completion',
    title: 'Offer/EA Completion Rate',
    level: 'User Outcomes',
    x: 1370,
    y: 560,
    width: 280,
    value: formatPct(offerEaCompletionSeries[offerEaCompletionSeries.length - 1]),
    valueContext: changeText(lastN(offerEaCompletionSeries)),
    trend: lastN(offerEaCompletionSeries),
    momPct: computeMomPct(offerEaCompletionSeries),
    yoyPct: computeYoyPct(offerEaCompletionSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Unweighted mean of Offer and EA per-BP completion rates (completed events / total initiated events). Higher completion correlates with faster hiring velocity and less rework.',
    caveat: 'Mean of two BP rates, not a pooled or funnel conversion metric. Per-job-application chaining is not yet available (HRREC-90616). Treat as a directional health indicator.',
  },
  // ── Level 4: Feature Adoption & Usage ──
  {
    id: 'add-documents',
    title: 'Add Documents Adoption',
    level: 'Feature Adoption & Usage',
    x: 830,
    y: 810,
    width: 260,
    value: `${tenantAdoptionPct(latestAddDocuments).toFixed(1)}%`,
    valueContext: `${latestAddDocuments.ym} · tenant adoption rate`,
    trend: lastN(addDocumentsSeries),
    momPct: computeMomPct(addDocumentsSeries),
    yoyPct: computeYoyPct(addDocumentsSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents adoption rate. A concrete product lever that can reduce late-stage document handling time in Offer and Employment Agreement steps.',
    caveat: 'Kept because it is a specific product lever, not a broad vanity adoption metric.',
  },
];

export const TREE_EDGES: MetricTreeEdge[] = [
  // Product Value Outcomes → Business Value Outcomes
  { from: 'time-in-interview-bp', to: 'avg-time-to-hire', label: 'cycle-time drag', confidence: 'Measured' },
  { from: 'offer-ea-duration', to: 'avg-time-to-hire', label: 'late-stage drag', confidence: 'Measured' },
  { from: 'offer-ea-duration', to: 'recruiter-capacity', label: 'late-stage workload', confidence: 'Directional' },
  { from: 'job-applications', to: 'recruiter-capacity', label: 'requisition load', confidence: 'Measured' },
  // User Outcomes → Product Value Outcomes
  { from: 'create-interview-team', to: 'time-in-interview-bp', label: 'team setup delay', confidence: 'Measured' },
  { from: 'schedule-interviews', to: 'time-in-interview-bp', label: 'scheduling latency', confidence: 'Measured' },
  { from: 'feedback-time', to: 'time-in-interview-bp', label: 'feedback bottleneck', confidence: 'Measured' },
  { from: 'document-review', to: 'offer-ea-duration', label: 'document review latency', confidence: 'Measured' },
  { from: 'approval-time', to: 'offer-ea-duration', label: 'approval latency', confidence: 'Measured' },
  { from: 'offer-ea-completion', to: 'offer-ea-duration', label: 'completion throughput', confidence: 'Directional' },
  // Feature Adoption & Usage → User Outcomes
  { from: 'add-documents', to: 'document-review', label: 'document prep adoption', confidence: 'Directional' },
];

// ── Helpers for filtered tree recomputation ──

import { TREE_TENANT_SERIES } from './data-tree-tenant-series';

type NodeFormatter = {
  metricKeys: string[];
  combiner: 'avg' | 'sum';
  format: (v: number) => string;
  unit: string;
};

const NODE_FORMAT_MAP: Record<string, NodeFormatter> = {
  'time-in-interview-bp': { metricKeys: ['time-in-interview-bp'], combiner: 'avg', format: formatDays, unit: 'days' },
  'offer-ea-duration': { metricKeys: ['offer-duration', 'ea-duration'], combiner: 'sum', format: formatDays, unit: 'days' },
  'offer-ea-completion': { metricKeys: ['offer-completion', 'ea-completion'], combiner: 'avg', format: formatPct, unit: '%' },
  'job-applications': { metricKeys: ['job-applications'], combiner: 'avg', format: (v) => `${v.toFixed(0)} / tenant`, unit: '' },
  'create-interview-team': { metricKeys: ['time-in-interview-bp'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'schedule-interviews': { metricKeys: ['time-in-interview-bp'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'feedback-time': { metricKeys: ['feedback-time'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'document-review': { metricKeys: ['document-review'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'approval-time': { metricKeys: ['approval-time'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'add-documents': { metricKeys: ['add-documents'], combiner: 'avg', format: (v) => `${v.toFixed(1)}`, unit: 'refs' },
};

function aggregateFilteredSeries(
  metricKey: string,
  filteredTenants: string[],
): number[] {
  const source = TREE_TENANT_SERIES[metricKey];
  if (!source) return [];
  const matching = filteredTenants.filter((t) => source[t]);
  if (matching.length === 0) return [];
  const allYms = Array.from(
    new Set(matching.flatMap((t) => (source[t] ?? []).map((p) => p.ym)))
  ).sort();
  return allYms.map((ym) => {
    const values = matching
      .map((t) => source[t]?.find((p) => p.ym === ym)?.value)
      .filter((v): v is number => v != null && Number.isFinite(v));
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : NaN;
  }).filter(Number.isFinite);
}

export function buildFilteredNode(
  nodeId: string,
  filteredTenants: string[],
  base: MetricTreeNode,
): MetricTreeNode {
  const fmt = NODE_FORMAT_MAP[nodeId];
  if (!fmt) return base;

  const seriesPerKey = fmt.metricKeys.map((k) => aggregateFilteredSeries(k, filteredTenants));
  if (seriesPerKey.every((s) => s.length === 0)) {
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [], momPct: null, yoyPct: null };
  }

  let combined: number[];
  if (fmt.metricKeys.length === 1) {
    combined = seriesPerKey[0];
  } else {
    const maxLen = Math.max(...seriesPerKey.map((s) => s.length));
    combined = Array.from({ length: maxLen }, (_, i) => {
      const vals = seriesPerKey.map((s) => s[i]).filter((v): v is number => v != null && Number.isFinite(v));
      if (vals.length === 0) return NaN;
      return fmt.combiner === 'sum'
        ? vals.reduce((a, b) => a + b, 0)
        : vals.reduce((a, b) => a + b, 0) / vals.length;
    }).filter(Number.isFinite);
  }

  if (combined.length === 0) {
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [], momPct: null, yoyPct: null };
  }

  const latest = combined[combined.length - 1];
  const tenantCount = fmt.metricKeys.reduce((max, k) => {
    const src = TREE_TENANT_SERIES[k];
    return Math.max(max, src ? filteredTenants.filter((t) => src[t]).length : 0);
  }, 0);

  return {
    ...base,
    value: fmt.format(latest),
    valueContext: `Filtered (${tenantCount} tenants) · ${changeText(lastN(combined))}`,
    trend: lastN(combined),
    momPct: computeMomPct(combined),
    yoyPct: computeYoyPct(combined),
  };
}

export { lastN, definedSeries, formatDays, formatHours, formatPct, changeText, metricValue, computeMomPct, computeYoyPct };
