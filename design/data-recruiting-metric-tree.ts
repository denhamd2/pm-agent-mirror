import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  FEEDBACK_SUBMISSION_TIME,
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
} from './data-interview-metrics';
import { addDocumentsMonthly } from './data-add-documents';

export type MetricTreeLevel =
  | 'Business Value Outcome'
  | 'Product Value Drivers'
  | 'Operational Drivers';

export type MetricTreeConfidence = 'Measured' | 'Directional' | 'Future';

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
    'Twin north-star framing: "How fast do we hire?" (Avg Time to Hire) and "How efficiently do recruiters operate?" (Recruiter Capacity).\nOnly metrics with a plausible causal chain to these outcomes are included.',
  sourceSummary:
    'Combines live metric-name-resolved IUMs (SANDBOX), production interview analytics (PROD), and Add Documents usage.',
  caveat:
    'The tree favours metrics with a clear operational relationship to the north-star outcomes. Some links remain directional because the warehouse does not yet support direct causal joins across all layers.',
  canvas: { width: 1800, height: 1000 },
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
const offersAccepted = VALUE_REALIZATION_IUMS.offersAccepted;
const eaAcceptance = VALUE_REALIZATION_IUMS.employmentAgreementAcceptance;

const timeToHireSeries = definedSeries(timeToHire.series.map((point) => point.avgValue));
const recruiterCapacitySeries = recruiterCapacity.series
  .filter((point) => point.ym >= '2025-06')
  .map((point) => point.avgValue);
const cleanedRecruiterCapacitySeries = definedSeries(recruiterCapacitySeries);

const offersAcceptedSeries = definedSeries(offersAccepted.series.map((point) => point.avgValue));
const eaAcceptanceSeries = definedSeries(eaAcceptance.series.map((point) => point.avgValue));
const feedbackTimeSeries = FEEDBACK_SUBMISSION_TIME.map((point) => point.avgValue);

const interviewBpSeries = AVG_TIME_IN_INTERVIEW_BP.map((point) => point.avgValue);
const jobApplicationsSeries = JOB_APPLICATIONS_MONTHLY.map((point) => point.value / point.tenants);
const interviewRoundsSeries = INTERVIEW_ROUNDS_MONTHLY.map((point) => point.value / point.tenants);
const addDocumentsSeries = addDocumentsMonthly.slice(-6).map((point) => point.adoptionRatePct);

const latestAddDocuments = addDocumentsMonthly[addDocumentsMonthly.length - 1];

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
    x: 520,
    y: 72,
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
    x: 1080,
    y: 72,
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
    x: 200,
    y: 350,
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
    id: 'offers-accepted',
    title: 'Offers Accepted',
    level: 'Product Value Drivers',
    x: 700,
    y: 350,
    width: 300,
    value: `${metricValue(offersAccepted.latestValue).toFixed(0)} / tenant`,
    valueContext: `${offersAccepted.latestYm} · ${offersAccepted.environment} · ${changeTextCount(lastN(offersAcceptedSeries))}`,
    trend: lastN(offersAcceptedSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Average offers accepted per tenant per month. Throughput conversion metric: when offers are accepted faster and in greater volume, positions fill sooner and TTH drops.',
  },
  {
    id: 'offer-ea-chain',
    title: 'Offer / EA Timing',
    level: 'Product Value Drivers',
    x: 1200,
    y: 350,
    width: 300,
    value: 'Future metric',
    valueContext: 'Tracker expects job-app chain timing',
    trend: [0, 0, 0, 0, 0, 0],
    source: 'Blocked / future instrumentation',
    confidence: 'Future',
    definition:
      'Tracker definition expects first EA start through final completed EA on the job application chain, which differs from the per-event sub-BP durations currently available.',
    caveat: 'Keep this as a target driver only until a clean live chain metric exists.',
  },
  // ── Level 3: Operational Drivers ──
  {
    id: 'job-applications',
    title: 'Job Applications',
    level: 'Operational Drivers',
    x: 50,
    y: 700,
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
    x: 350,
    y: 700,
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
    x: 650,
    y: 700,
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
    id: 'add-documents',
    title: 'Add Documents',
    level: 'Operational Drivers',
    x: 950,
    y: 700,
    width: 280,
    value: `${latestAddDocuments.adoptionRatePct.toFixed(1)}%`,
    valueContext: `${latestAddDocuments.ym} adoption rate`,
    trend: lastN(addDocumentsSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents adoption rate. A concrete product lever that reduces late-stage document friction in offer and employment-agreement steps.',
    caveat: 'Kept because it is a specific product lever, not a broad vanity adoption metric.',
  },
  {
    id: 'ea-acceptance',
    title: 'EA Acceptance',
    shortTitle: 'Employment Agreement Acceptance',
    level: 'Operational Drivers',
    x: 1250,
    y: 700,
    width: 280,
    value: `${metricValue(eaAcceptance.latestValue).toFixed(0)} / tenant`,
    valueContext: `${eaAcceptance.latestYm} · ${eaAcceptance.environment} · ${changeTextCount(lastN(eaAcceptanceSeries))}`,
    trend: lastN(eaAcceptanceSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Average employment agreements accepted per tenant per month. Provides measured throughput evidence that EAs are completing, feeding the Offer/EA chain timing picture.',
  },
];

export const TREE_EDGES: MetricTreeEdge[] = [
  // Product Value Drivers → Business Value Outcomes
  { from: 'time-in-interview-bp', to: 'avg-time-to-hire', label: 'cycle-time drag', confidence: 'Measured' },
  { from: 'offers-accepted', to: 'avg-time-to-hire', label: 'throughput velocity', confidence: 'Measured' },
  { from: 'offer-ea-chain', to: 'avg-time-to-hire', label: 'late-stage delay', confidence: 'Future' },
  { from: 'time-in-interview-bp', to: 'recruiter-capacity', label: 'workload amplifier', confidence: 'Directional' },
  { from: 'job-applications', to: 'recruiter-capacity', label: 'requisition load', confidence: 'Measured' },
  // Operational Drivers → Product Value Drivers
  { from: 'job-applications', to: 'time-in-interview-bp', label: 'candidate volume', confidence: 'Directional' },
  { from: 'interview-rounds', to: 'time-in-interview-bp', label: 'panel complexity', confidence: 'Measured' },
  { from: 'feedback-time', to: 'time-in-interview-bp', label: 'feedback bottleneck', confidence: 'Measured' },
  { from: 'interview-rounds', to: 'offers-accepted', label: 'decision pipeline', confidence: 'Directional' },
  { from: 'add-documents', to: 'offer-ea-chain', label: 'document readiness', confidence: 'Directional' },
  { from: 'ea-acceptance', to: 'offer-ea-chain', label: 'completion signal', confidence: 'Measured' },
];
