import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  FEEDBACK_SUBMISSION_TIME,
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
} from './data-interview-metrics';
import { addDocumentsMonthly } from './data-add-documents';
import { offerDocumentStepMonthly } from './data-offer-steps';
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
    'The tree favours metrics with a clear operational relationship to the north-star outcomes. Directional links indicate a credible driver hypothesis, but not a direct causal join.',
  canvas: { width: 1860, height: 1030 },
} as const;

function lastN(values: number[], count = 6): number[] {
  return values.slice(Math.max(0, values.length - count));
}

function formatDays(value: number): string {
  return `${value.toFixed(1)} days`;
}

function formatHours(value: number): string {
  return `${value.toFixed(0)} hrs`;
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
const addDocumentsSeries = addDocumentsMonthly.map((point) => point.adoptionRatePct);

// Global completed-path Offer duration extracted from the materialised PROD bp_event_stats export.
const offerDurationSeries = [5.96, 5.39, 5.17, 5.62, 4.6, 3.9, 3.96, 3.97, 4.87, 5.17, 4.57, 5.3];
const employmentAgreementDurationSeries = [2.81, 2.6, 2.58, 2.5, 2.34, 2.26, 2.25, 2.28, 2.89, 2.3, 2.24, 1.83];
const offerDocumentReviewSeries = definedSeries(
  offerDocumentStepMonthly['Review Documents'].map((point) => point.avgHours)
);
const employmentAgreementApprovalSeries = definedSeries(
  employmentAgreementStepMonthly['Bulk Approve'].map((point) => point.avgHours)
);

const latestAddDocuments = addDocumentsMonthly[addDocumentsMonthly.length - 1];
const latestOfferDurationYm = '2026-03';
const latestEaDurationYm = '2026-03';

export const TREE_LEVELS: MetricTreeLevel[] = [
  'Business Value Outcome',
  'Product Value Drivers',
  'Operational Drivers',
];

export const TREE_NODES: MetricTreeNode[] = [
  // ── Level 1: Business Value Outcomes (twin north stars) ──
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
    x: 180,
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
    id: 'offer-duration',
    title: 'Offer Duration',
    level: 'Product Value Drivers',
    x: 700,
    y: 360,
    width: 300,
    value: formatDays(offerDurationSeries[offerDurationSeries.length - 1]),
    valueContext: `${latestOfferDurationYm} · PROD offer sub-BP · ${changeText(lastN(offerDurationSeries))}`,
    trend: lastN(offerDurationSeries),
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average completed-event duration in the Offer business process. Because the live Time to Hire metric ends at latest accepted offer, slower offer handling is a direct late-stage drag on hiring speed.',
    caveat: 'Per-event Offer timing, not an Offer-to-EA chain metric.',
  },
  {
    id: 'employment-agreement-duration',
    title: 'Employment Agreement Duration',
    level: 'Product Value Drivers',
    x: 1220,
    y: 360,
    width: 300,
    value: formatDays(employmentAgreementDurationSeries[employmentAgreementDurationSeries.length - 1]),
    valueContext: `${latestEaDurationYm} · PROD EA sub-BP · ${changeText(lastN(employmentAgreementDurationSeries))}`,
    trend: lastN(employmentAgreementDurationSeries),
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average completed-event duration in the Employment Agreement sub-process. This does not feed the live Time to Hire metric directly, but it is a real late-stage workload and completion driver.',
    caveat: 'The live Time to Hire IUM excludes Employment Agreement, so read this as downstream operational efficiency rather than direct TTH logic.',
  },
  // ── Level 3: Operational Drivers ──
  {
    id: 'job-applications',
    title: 'Job Applications',
    level: 'Operational Drivers',
    x: 40,
    y: 710,
    width: 280,
    value: `${jobApplicationsSeries[jobApplicationsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(jobApplicationsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Average application volume per reporting tenant. Application load drives recruiter capacity pressure and downstream interview queue depth.',
  },
  {
    id: 'interview-rounds',
    title: 'Interview Rounds',
    level: 'Operational Drivers',
    x: 330,
    y: 710,
    width: 280,
    value: `${interviewRoundsSeries[interviewRoundsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(interviewRoundsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition:
      'Interview-round volume per reporting tenant. Round complexity is a direct operational driver of interview cycle time and feeds the decision pipeline toward offers.',
  },
  {
    id: 'feedback-time',
    title: 'Feedback Submission Time',
    shortTitle: 'Rate Interview / Give Feedback',
    level: 'Operational Drivers',
    x: 620,
    y: 710,
    width: 280,
    value: formatHours(feedbackTimeSeries[feedbackTimeSeries.length - 1]),
    valueContext: `Latest month · PROD · ${changeText(lastN(feedbackTimeSeries))}`,
    trend: lastN(feedbackTimeSeries),
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average hours for interviewers to submit feedback (Rate Interview / Give Interview Feedback). Consistently the longest sub-task inside the Interview BP and a direct actionable product lever.',
    caveat: 'Measured in hours. ~2,300 reporting tenants; smaller coverage than volume metrics.',
  },
  {
    id: 'offer-document-review',
    title: 'Offer Document Review',
    shortTitle: 'Review Documents',
    level: 'Operational Drivers',
    x: 910,
    y: 710,
    width: 280,
    value: formatHours(offerDocumentReviewSeries[offerDocumentReviewSeries.length - 1]),
    valueContext: `2026-03 · PROD task latency · ${changeText(lastN(offerDocumentReviewSeries))}`,
    trend: lastN(offerDocumentReviewSeries),
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average hours spent in the Offer "Review Documents" task. This is the clearest measured late-stage document bottleneck in the live Offer task telemetry.',
    caveat: 'Task-level step latency, not whole-offer duration.',
  },
  {
    id: 'add-documents',
    title: 'Add Documents Adoption',
    level: 'Operational Drivers',
    x: 1200,
    y: 710,
    width: 280,
    value: `${latestAddDocuments.adoptionRatePct.toFixed(1)}%`,
    valueContext: `${latestAddDocuments.ym} adoption rate`,
    trend: lastN(addDocumentsSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents adoption rate. A concrete product lever that can change how much late-stage document handling is pushed into Offer and Employment Agreement steps.',
    caveat: 'Kept because it is a specific product lever, not a broad vanity adoption metric.',
  },
  {
    id: 'ea-approval-time',
    title: 'EA Approval Time',
    shortTitle: 'Bulk Approve',
    level: 'Operational Drivers',
    x: 1490,
    y: 710,
    width: 280,
    value: formatHours(employmentAgreementApprovalSeries[employmentAgreementApprovalSeries.length - 1]),
    valueContext: `2026-03 · PROD approval step · ${changeText(lastN(employmentAgreementApprovalSeries))}`,
    trend: lastN(employmentAgreementApprovalSeries),
    source: 'bp_event_record_stats · PROD',
    confidence: 'Measured',
    definition:
      'Average hours spent in the Employment Agreement "Bulk Approve" step. This is the strongest measured EA approval latency signal currently available in the repo.',
    caveat: 'Approval-task latency is low-coverage compared with the top-line EA duration series, so read the trend as directional operations evidence.',
  },
];

export const TREE_EDGES: MetricTreeEdge[] = [
  // Product Value Drivers → Business Value Outcomes
  { from: 'time-in-interview-bp', to: 'avg-time-to-hire', label: 'cycle-time drag', confidence: 'Measured' },
  { from: 'offer-duration', to: 'avg-time-to-hire', label: 'late-stage drag', confidence: 'Measured' },
  { from: 'employment-agreement-duration', to: 'recruiter-capacity', label: 'late-stage workload', confidence: 'Directional' },
  { from: 'job-applications', to: 'recruiter-capacity', label: 'requisition load', confidence: 'Measured' },
  // Operational Drivers → Product Value Drivers
  { from: 'interview-rounds', to: 'time-in-interview-bp', label: 'panel complexity', confidence: 'Measured' },
  { from: 'feedback-time', to: 'time-in-interview-bp', label: 'feedback bottleneck', confidence: 'Measured' },
  { from: 'offer-document-review', to: 'offer-duration', label: 'document review latency', confidence: 'Measured' },
  { from: 'add-documents', to: 'offer-duration', label: 'document prep behaviour', confidence: 'Directional' },
  { from: 'ea-approval-time', to: 'employment-agreement-duration', label: 'approval latency', confidence: 'Measured' },
];
