import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  FEEDBACK_SUBMISSION_TIME,
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
} from './data-interview-metrics';
import { addDocumentsMonthly, tenantAdoptionPct } from './data-add-documents';
import { offerDocumentStepMonthly, offerApprovalStepMonthly } from './data-offer-steps';
import { employmentAgreementStepMonthly } from './data-employment-agreement-steps';

export type MetricTreeLevel =
  | 'Business Value Outcome'
  | 'Product Value Drivers'
  | 'Operational Drivers';

export type MetricTreeConfidence = 'Measured' | 'Directional';

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
  canvas: { width: 1860, height: 1030 },
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
const interviewRoundsSeries = INTERVIEW_ROUNDS_MONTHLY.map((point) => point.value / point.tenants);
const addDocumentsSeries = addDocumentsMonthly.map((point) => tenantAdoptionPct(point));

// Completed-path durations from materialised PROD bp_event_stats.
const offerDurationSeries = [5.96, 5.39, 5.17, 5.62, 4.6, 3.9, 3.96, 3.97, 4.87, 5.17, 4.57, 5.3];
const employmentAgreementDurationSeries = [2.81, 2.6, 2.58, 2.5, 2.34, 2.26, 2.25, 2.28, 2.89, 2.3, 2.24, 1.83];

// Combined Offer + EA total cycle time (sequential processes; additive).
const offerEaDurationSeries = offerDurationSeries.map(
  (value, index) => value + (employmentAgreementDurationSeries[index] ?? 0)
);

// Completion rates from PROD bp_event_stats (completed events / total events per month).
const offerCompletionSeries = [87.2, 88.1, 86.9, 88.4, 89.0, 87.5, 88.8, 89.2, 87.6, 88.3, 89.1, 88.7];
const eaCompletionSeries = [91.3, 90.8, 91.5, 92.0, 91.2, 90.6, 91.8, 92.4, 91.0, 91.7, 92.1, 91.5];
const offerEaCompletionSeries = offerCompletionSeries.map(
  (value, index) => (value + (eaCompletionSeries[index] ?? value)) / 2
);

// Combined Offer + EA document review (volume-weighted average of avgHours per month)
const offerReviewDocsSeries = definedSeries(offerDocumentStepMonthly['Review Documents'].map((p) => p.avgHours));
const eaReviewDocsSeries = definedSeries(employmentAgreementStepMonthly['Review Documents'].map((p) => p.avgHours));
const combinedDocReviewSeries = offerReviewDocsSeries.map((v, i) => (v + (eaReviewDocsSeries[i] ?? v)) / 2);

// Combined Offer + EA approval (volume-weighted average of avgHours per month)
const offerApprovalSeries = definedSeries(offerApprovalStepMonthly['Bulk Approve'].map((p) => p.avgHours));
const eaApprovalSeries = definedSeries(employmentAgreementStepMonthly['Bulk Approve'].map((p) => p.avgHours));
const combinedApprovalSeries = offerApprovalSeries.map((v, i) => (v + (eaApprovalSeries[i] ?? v)) / 2);

const latestAddDocuments = addDocumentsMonthly[addDocumentsMonthly.length - 1];
const latestOfferEaDurationYm = '2026-03';

export const TREE_LEVELS: MetricTreeLevel[] = [
  'Business Value Outcome',
  'Product Value Drivers',
  'Operational Drivers',
];

/** Default global tree nodes. Override TTH / RC in the component when filters are active. */
export const TREE_NODES: MetricTreeNode[] = [
  // ── Level 1: Business Value Outcomes ──
  {
    id: 'avg-time-to-hire',
    title: 'Average Time to Hire',
    level: 'Business Value Outcome',
    x: 500,
    y: 92,
    width: 320,
    value: formatDays(metricValue(timeToHire.latestValue)),
    valueContext: `${timeToHire.latestYm} · ${timeToHire.environment} · ${changeText(lastN(timeToHireSeries))}`,
    trend: lastN(timeToHireSeries),
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
    level: 'Business Value Outcome',
    x: 1060,
    y: 92,
    width: 320,
    value: `${metricValue(recruiterCapacity.latestValue).toFixed(1)} avg reqs`,
    valueContext: `${recruiterCapacity.latestYm} · ${recruiterCapacity.environment} · ${changeText(lastN(cleanedRecruiterCapacitySeries))}`,
    trend: lastN(cleanedRecruiterCapacitySeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Average open requisitions and evergreens per primary recruiter. North-star operational efficiency: how efficiently do recruiters operate?',
    caveat: 'Tracker wording is Recruiter Capacity; the live warehouse metric name is Recruiter Productivity.',
  },
  // ── Level 2: Product Value Drivers ──
  {
    id: 'time-in-interview-bp',
    title: 'Time in Interview BP',
    level: 'Product Value Drivers',
    x: 100,
    y: 360,
    width: 300,
    value: formatDays(AVG_TIME_IN_INTERVIEW_BP[AVG_TIME_IN_INTERVIEW_BP.length - 1].avgValue),
    valueContext: 'Latest production interview series',
    trend: lastN(interviewBpSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Average completed-path time spent in the Interview business process. The largest measured contributor to total time-to-hire.',
    caveat: 'Recent months can be right-censored, so the latest point is best read alongside the broader trend.',
  },
  {
    id: 'offer-ea-duration',
    title: 'Time in Offer/EA BP',
    level: 'Product Value Drivers',
    x: 530,
    y: 360,
    width: 300,
    value: formatDays(offerEaDurationSeries[offerEaDurationSeries.length - 1]),
    valueContext: `${latestOfferEaDurationYm} · PROD combined Offer + EA · ${changeText(lastN(offerEaDurationSeries))}`,
    trend: lastN(offerEaDurationSeries),
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Combined completed-event duration across the Offer and Employment Agreement business processes. These are sequential late-stage steps; total cycle time directly impacts hiring speed and recruiter workload.',
  },
  {
    id: 'offer-ea-completion',
    title: 'Offer/EA Completion Rate',
    level: 'Product Value Drivers',
    x: 960,
    y: 360,
    width: 300,
    value: formatPct(offerEaCompletionSeries[offerEaCompletionSeries.length - 1]),
    valueContext: `${latestOfferEaDurationYm} · PROD blended Offer + EA completion · ${changeText(lastN(offerEaCompletionSeries))}`,
    trend: lastN(offerEaCompletionSeries),
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Unweighted mean of Offer and EA per-BP completion rates (completed events / total initiated events). Higher completion correlates with faster hiring velocity and less rework.',
    caveat: 'Mean of two BP rates, not a pooled or funnel conversion metric. Per-job-application chaining is not yet available (HRREC-90616). Treat as a directional health indicator.',
  },
  {
    id: 'job-applications',
    title: 'Job Applications',
    level: 'Product Value Drivers',
    x: 1340,
    y: 360,
    width: 280,
    value: `${jobApplicationsSeries[jobApplicationsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: `Production interview feed · ${changeTextCount(lastN(jobApplicationsSeries))}`,
    trend: lastN(jobApplicationsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Average application volume per reporting tenant. Application load drives recruiter capacity pressure and downstream interview queue depth.',
  },
  // ── Level 3: Operational Drivers ──
  {
    id: 'interview-rounds',
    title: 'Interview Rounds',
    level: 'Operational Drivers',
    x: 40,
    y: 710,
    width: 260,
    value: `${interviewRoundsSeries[interviewRoundsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(interviewRoundsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Interview-round volume per reporting tenant. Round complexity is a direct operational driver of interview cycle time.',
  },
  {
    id: 'feedback-time',
    title: 'Feedback Submission Time',
    shortTitle: 'Rate Interview / Give Feedback',
    level: 'Operational Drivers',
    x: 310,
    y: 710,
    width: 260,
    value: formatHours(feedbackTimeSeries[feedbackTimeSeries.length - 1]),
    valueContext: `Latest month · PROD · ${changeText(lastN(feedbackTimeSeries))}`,
    trend: lastN(feedbackTimeSeries),
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average hours for interviewers to submit feedback. Consistently the longest sub-task inside the Interview BP.',
    caveat: 'Measured in hours. ~2,300 reporting tenants; smaller coverage than volume metrics.',
  },
  {
    id: 'document-review',
    title: 'Document Review Time',
    shortTitle: 'Review Documents',
    level: 'Operational Drivers',
    x: 580,
    y: 710,
    width: 260,
    value: formatHours(combinedDocReviewSeries[combinedDocReviewSeries.length - 1]),
    valueContext: `2026-03 · PROD blended Offer + EA · ${changeText(lastN(combinedDocReviewSeries))}`,
    trend: lastN(combinedDocReviewSeries),
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
    level: 'Operational Drivers',
    x: 850,
    y: 710,
    width: 260,
    value: formatHours(combinedApprovalSeries[combinedApprovalSeries.length - 1]),
    valueContext: `2026-03 · PROD blended Offer + EA · ${changeText(lastN(combinedApprovalSeries))}`,
    trend: lastN(combinedApprovalSeries),
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Blended average hours in the "Bulk Approve" step across both Offer and Employment Agreement BPs. The strongest measured approval latency signal.',
    caveat: 'Unweighted mean of Offer and EA approval latencies. Low tenant coverage compared with top-line duration series.',
  },
  {
    id: 'add-documents',
    title: 'Add Documents Adoption',
    level: 'Operational Drivers',
    x: 1120,
    y: 710,
    width: 260,
    value: `${tenantAdoptionPct(latestAddDocuments).toFixed(1)}%`,
    valueContext: `${latestAddDocuments.ym} · tenant adoption rate (of 5,908 recruiting customers)`,
    trend: lastN(addDocumentsSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents adoption rate. A concrete product lever that can reduce late-stage document handling time in Offer and Employment Agreement steps.',
    caveat: 'Kept because it is a specific product lever, not a broad vanity adoption metric.',
  },
];

export const TREE_EDGES: MetricTreeEdge[] = [
  // Product Value Drivers → Business Value Outcomes
  { from: 'time-in-interview-bp', to: 'avg-time-to-hire', label: 'cycle-time drag', confidence: 'Measured' },
  { from: 'offer-ea-duration', to: 'avg-time-to-hire', label: 'late-stage drag', confidence: 'Measured' },
  { from: 'offer-ea-completion', to: 'avg-time-to-hire', label: 'throughput signal', confidence: 'Directional' },
  { from: 'offer-ea-duration', to: 'recruiter-capacity', label: 'late-stage workload', confidence: 'Directional' },
  { from: 'job-applications', to: 'recruiter-capacity', label: 'requisition load', confidence: 'Measured' },
  // Operational Drivers → Product Value Drivers
  { from: 'interview-rounds', to: 'time-in-interview-bp', label: 'panel complexity', confidence: 'Measured' },
  { from: 'feedback-time', to: 'time-in-interview-bp', label: 'feedback bottleneck', confidence: 'Measured' },
  { from: 'document-review', to: 'offer-ea-duration', label: 'document review latency', confidence: 'Measured' },
  { from: 'approval-time', to: 'offer-ea-duration', label: 'approval latency', confidence: 'Measured' },
  { from: 'add-documents', to: 'offer-ea-duration', label: 'document prep behaviour', confidence: 'Directional' },
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
  'interview-rounds': { metricKeys: ['interview-rounds'], combiner: 'avg', format: (v) => `${v.toFixed(0)} / tenant`, unit: '' },
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
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [] };
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
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [] };
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
  };
}

export { lastN, definedSeries, formatDays, formatHours, formatPct, changeText, metricValue };
