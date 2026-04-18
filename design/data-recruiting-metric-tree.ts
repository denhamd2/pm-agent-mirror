import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  FEEDBACK_SUBMISSION_TIME,
  JOB_APPLICATIONS_MONTHLY,
  LABELS as INTERVIEW_LABELS,
  SCHEDULE_INTERVIEW_TIME,
  SCHEDULE_INTERVIEW_TEAM_TIME,
} from './data-interview-metrics';
import { addDocumentsMonthly, tenantAdoptionPct } from './data-add-documents';
import { ADD_DOCUMENTS_ADOPTED_TENANTS } from './data-add-documents-adoption-by-tenant';
import { offerDocumentStepMonthly, offerApprovalStepMonthly } from './data-offer-steps';
import { employmentAgreementStepMonthly } from './data-employment-agreement-steps';
import { LABELS as BP_LABELS } from './data-bp-shared';
import { SCORECARD_BY_TENANT } from './data-customer-scorecard';
import { TREE_TENANT_SERIES } from './data-tree-tenant-series';

/** HRREC-81393 (Agency Types) is not modelled on this tree: OMS adoption is measured, but general IUM 2358/2361 links would over-claim causation until agency-scoped outcome metrics exist (see `docs/analytics/hrrec-81393-impact-report.md`). */

const ADD_DOCUMENTS_ADOPTED_TENANT_SET = new Set(ADD_DOCUMENTS_ADOPTED_TENANTS);
const REGENERATE_OFFER_FEATURE = 'Regenerate Offer Documents Business Process';
const REGENERATE_EA_FEATURE = 'Regenerate Employment Agreement Business Process';

function buildFeatureAdopterSet(features: readonly string[]): Set<string> {
  const adopters = new Set<string>();
  const desired = new Set(features);
  Object.entries(SCORECARD_BY_TENANT).forEach(([tenant, row]) => {
    if (row.adoptedFeatures.some((feature) => desired.has(feature))) adopters.add(tenant);
  });
  return adopters;
}

const REGENERATE_OFFER_ADOPTED_TENANT_SET = buildFeatureAdopterSet([REGENERATE_OFFER_FEATURE]);
// The EA-specific regenerate feature is not yet split in the scorecard export.
// We currently use the regenerate-offer feature footprint as the best available proxy.
const REGENERATE_EA_ADOPTED_TENANT_SET = buildFeatureAdopterSet([
  REGENERATE_EA_FEATURE,
  REGENERATE_OFFER_FEATURE,
]);

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
  trendYm?: string[];
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

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function computeMomPct(fullSeries: number[]): number | null {
  if (fullSeries.length < 2) return null;
  const latest = fullSeries[fullSeries.length - 1];
  const prev = fullSeries[fullSeries.length - 2];
  if (!Number.isFinite(prev) || prev === 0) return null;
  return ((latest - prev) / Math.abs(prev)) * 100;
}

function computeYoyPct(fullSeries: number[]): number | null {
  if (fullSeries.length < 13) return null;
  const latest = fullSeries[fullSeries.length - 1];
  const yearAgo = fullSeries[fullSeries.length - 13];
  if (!Number.isFinite(yearAgo) || yearAgo === 0) return null;
  return ((latest - yearAgo) / Math.abs(yearAgo)) * 100;
}

// ── Global series (static, precomputed) ──

const timeToHire = VALUE_REALIZATION_IUMS.timeToHire;
const recruiterCapacity = VALUE_REALIZATION_IUMS.recruiterProductivity;

export type TrendPoint = { ym: string; value: number };

type AdoptionSeriesPoint = TrendPoint & {
  adoptedTenants: number;
  activeTenants: number;
};

function buildFeatureAdoptionSeries(
  adopters: ReadonlySet<string>,
  activityMetricKey: string,
  scopedTenants?: readonly string[],
): AdoptionSeriesPoint[] {
  const activitySeries = TREE_TENANT_SERIES[activityMetricKey] ?? {};
  const sourceTenants = scopedTenants
    ? scopedTenants.filter((tenant) => Boolean(activitySeries[tenant]))
    : Object.keys(activitySeries);
  if (sourceTenants.length === 0) return [];

  const ymSet = new Set<string>();
  sourceTenants.forEach((tenant) => {
    activitySeries[tenant]?.forEach((point) => ymSet.add(point.ym));
  });
  const yms = Array.from(ymSet).sort();

  return yms
    .map((ym) => {
      let activeTenants = 0;
      let adoptedTenants = 0;
      sourceTenants.forEach((tenant) => {
        const isActive = Boolean(activitySeries[tenant]?.some((point) => point.ym === ym));
        if (!isActive) return;
        activeTenants += 1;
        if (adopters.has(tenant)) adoptedTenants += 1;
      });
      if (activeTenants === 0) return null;
      return {
        ym,
        value: (adoptedTenants / activeTenants) * 100,
        adoptedTenants,
        activeTenants,
      };
    })
    .filter((point): point is AdoptionSeriesPoint => point != null);
}

function lastNTrendPoints(points: TrendPoint[], count = 6): TrendPoint[] {
  return points.slice(Math.max(0, points.length - count));
}

const timeToHirePoints: TrendPoint[] = timeToHire.series
  .filter((point): point is typeof point & { avgValue: number } => point.avgValue != null)
  .map((point) => ({ ym: point.ym, value: point.avgValue }));
const timeToHireSeries = timeToHirePoints.map((point) => point.value);

const recruiterCapacityPoints: TrendPoint[] = recruiterCapacity.series
  .filter((point): point is typeof point & { avgValue: number } => point.avgValue != null)
  .map((point) => ({ ym: point.ym, value: point.avgValue }));
const cleanedRecruiterCapacitySeries = recruiterCapacityPoints.map((point) => point.value);

const feedbackTimePoints: TrendPoint[] = FEEDBACK_SUBMISSION_TIME.map((point) => ({ ym: point.ym, value: point.avgValue }));
const feedbackTimeSeries = feedbackTimePoints.map((point) => point.value);
const interviewBpPoints: TrendPoint[] = AVG_TIME_IN_INTERVIEW_BP.map((point) => ({ ym: point.ym, value: point.avgValue }));
const interviewBpSeries = interviewBpPoints.map((point) => point.value);
const jobApplicationsPoints: TrendPoint[] = JOB_APPLICATIONS_MONTHLY.map((point) => ({ ym: point.ym, value: point.value / point.tenants }));
const jobApplicationsSeries = jobApplicationsPoints.map((point) => point.value);
const addDocumentsPoints: TrendPoint[] = addDocumentsMonthly.map((point) => ({ ym: point.ym, value: tenantAdoptionPct(point) }));
const addDocumentsSeries = addDocumentsPoints.map((point) => point.value);
const regenerateOfferAdoptionPoints = buildFeatureAdoptionSeries(REGENERATE_OFFER_ADOPTED_TENANT_SET, 'offer-duration');
const regenerateOfferAdoptionSeries = regenerateOfferAdoptionPoints.map((point) => point.value);
const regenerateEaAdoptionPoints = buildFeatureAdoptionSeries(REGENERATE_EA_ADOPTED_TENANT_SET, 'ea-duration');
const regenerateEaAdoptionSeries = regenerateEaAdoptionPoints.map((point) => point.value);

const scheduleInterviewPoints: TrendPoint[] = SCHEDULE_INTERVIEW_TIME.map((point) => ({ ym: point.ym, value: point.avgValue }));
const scheduleInterviewSeries = scheduleInterviewPoints.map((point) => point.value);
const createTeamPoints: TrendPoint[] = SCHEDULE_INTERVIEW_TEAM_TIME.map((point) => ({ ym: point.ym, value: point.avgValue }));
const createTeamSeries = createTeamPoints.map((point) => point.value);

// Completed-path durations from PROD bp_event_stats, queried 17 April 2026.
// Extended back to 2024-07 (earliest available partition: 2024-06-27).
// task_name = 'Offer (Web Service)', status = 'Successfully Completed', duration/86400.
const offerDurationPoints: TrendPoint[] = [
  { ym: '2024-07', value: 16.72 }, { ym: '2024-08', value: 32.83 },
  { ym: '2024-09', value: 3.69 }, { ym: '2024-10', value: 3.10 }, { ym: '2024-11', value: 3.04 }, { ym: '2024-12', value: 1.25 },
  { ym: '2025-01', value: 1.20 }, { ym: '2025-02', value: 1.62 }, { ym: '2025-03', value: 2.06 },
  { ym: '2025-04', value: 1.76 }, { ym: '2025-05', value: 1.83 }, { ym: '2025-06', value: 3.48 },
  { ym: '2025-07', value: 1.99 }, { ym: '2025-08', value: 2.23 }, { ym: '2025-09', value: 3.11 },
  { ym: '2025-10', value: 2.65 }, { ym: '2025-11', value: 8.71 }, { ym: '2025-12', value: 3.66 },
  { ym: '2026-01', value: 3.46 }, { ym: '2026-02', value: 2.43 }, { ym: '2026-03', value: 2.97 },
];
const offerDurationSeries = offerDurationPoints.map((p) => p.value);

// task_name = 'Employment Agreement (Web Service)', status = 'Successfully Completed'.
const eaDurationPoints: TrendPoint[] = [
  { ym: '2024-07', value: 4.18 }, { ym: '2024-08', value: 1.08 },
  { ym: '2024-09', value: 1.04 }, { ym: '2024-10', value: 1.31 }, { ym: '2024-11', value: 1.04 }, { ym: '2024-12', value: 1.01 },
  { ym: '2025-01', value: 2.08 }, { ym: '2025-02', value: 2.53 }, { ym: '2025-03', value: 2.75 },
  { ym: '2025-04', value: 2.57 }, { ym: '2025-05', value: 2.65 }, { ym: '2025-06', value: 2.26 },
  { ym: '2025-07', value: 2.17 }, { ym: '2025-08', value: 2.41 }, { ym: '2025-09', value: 2.19 },
  { ym: '2025-10', value: 2.23 }, { ym: '2025-11', value: 2.60 }, { ym: '2025-12', value: 2.53 },
  { ym: '2026-01', value: 2.34 }, { ym: '2026-02', value: 2.65 }, { ym: '2026-03', value: 2.31 },
];
const employmentAgreementDurationSeries = eaDurationPoints.map((p) => p.value);

// Combined Offer + EA duration joined by month.
const eaDurationMap = new Map(eaDurationPoints.map((p) => [p.ym, p.value]));
const offerEaDurationPoints: TrendPoint[] = offerDurationPoints
  .filter((p) => eaDurationMap.has(p.ym))
  .map((p) => ({ ym: p.ym, value: p.value + (eaDurationMap.get(p.ym) ?? 0) }));
const offerEaDurationSeries = offerEaDurationPoints.map((p) => p.value);

// Acceptance rates from PROD bp_event_stats (Successfully Completed / (Successfully Completed + Canceled)), queried 17 April 2026.
// Proxy until HRREC-90613 (issued count) is live. Extended back to 2024-07.
const offerAcceptancePoints: TrendPoint[] = [
  { ym: '2024-07', value: 93.1 }, { ym: '2024-08', value: 86.4 },
  { ym: '2024-09', value: 98.2 }, { ym: '2024-10', value: 94.8 }, { ym: '2024-11', value: 91.2 }, { ym: '2024-12', value: 84.6 },
  { ym: '2025-01', value: 78.0 }, { ym: '2025-02', value: 78.6 }, { ym: '2025-03', value: 77.7 },
  { ym: '2025-04', value: 78.6 }, { ym: '2025-05', value: 79.5 }, { ym: '2025-06', value: 80.7 },
  { ym: '2025-07', value: 81.8 }, { ym: '2025-08', value: 83.8 }, { ym: '2025-09', value: 86.5 },
  { ym: '2025-10', value: 89.8 }, { ym: '2025-11', value: 90.7 }, { ym: '2025-12', value: 86.8 },
  { ym: '2026-01', value: 86.3 }, { ym: '2026-02', value: 85.8 }, { ym: '2026-03', value: 84.4 },
];
const offerAcceptanceSeries = offerAcceptancePoints.map((p) => p.value);

const eaAcceptancePoints: TrendPoint[] = [
  { ym: '2024-07', value: 88.4 }, { ym: '2024-08', value: 87.4 },
  { ym: '2024-09', value: 87.4 }, { ym: '2024-10', value: 87.9 }, { ym: '2024-11', value: 87.7 }, { ym: '2024-12', value: 87.0 },
  { ym: '2025-01', value: 84.2 }, { ym: '2025-02', value: 85.7 }, { ym: '2025-03', value: 85.6 },
  { ym: '2025-04', value: 84.9 }, { ym: '2025-05', value: 85.3 }, { ym: '2025-06', value: 85.6 },
  { ym: '2025-07', value: 85.1 }, { ym: '2025-08', value: 86.5 }, { ym: '2025-09', value: 86.9 },
  { ym: '2025-10', value: 85.9 }, { ym: '2025-11', value: 89.5 }, { ym: '2025-12', value: 87.6 },
  { ym: '2026-01', value: 87.6 }, { ym: '2026-02', value: 86.7 }, { ym: '2026-03', value: 88.1 },
];
const eaAcceptanceSeries = eaAcceptancePoints.map((p) => p.value);

// Combined Offer + EA document review
const offerReviewDocsMap = new Map(
  offerDocumentStepMonthly['Review Documents']
    .filter((point) => point.avgHours != null)
    .map((point) => [point.ym, point.avgHours as number])
);
const eaReviewDocsMap = new Map(
  employmentAgreementStepMonthly['Review Documents']
    .filter((point) => point.avgHours != null)
    .map((point) => [point.ym, point.avgHours as number])
);
const combinedDocReviewPoints: TrendPoint[] = BP_LABELS
  .map((ym) => {
    const offer = offerReviewDocsMap.get(ym);
    const ea = eaReviewDocsMap.get(ym);
    if (offer == null && ea == null) return null;
    return { ym: ym as string, value: offer != null && ea != null ? (offer + ea) / 2 : (offer ?? ea ?? 0) };
  })
  .filter((point): point is TrendPoint => point != null);
const combinedDocReviewSeries = combinedDocReviewPoints.map((point) => point.value);

// Combined Offer + EA approval
const offerApprovalMap = new Map(
  offerApprovalStepMonthly['Bulk Approve']
    .filter((point) => point.avgHours != null)
    .map((point) => [point.ym, point.avgHours as number])
);
const eaApprovalMap = new Map(
  employmentAgreementStepMonthly['Bulk Approve']
    .filter((point) => point.avgHours != null)
    .map((point) => [point.ym, point.avgHours as number])
);
const combinedApprovalPoints: TrendPoint[] = BP_LABELS
  .map((ym) => {
    const offer = offerApprovalMap.get(ym);
    const ea = eaApprovalMap.get(ym);
    if (offer == null && ea == null) return null;
    return { ym: ym as string, value: offer != null && ea != null ? (offer + ea) / 2 : (offer ?? ea ?? 0) };
  })
  .filter((point): point is TrendPoint => point != null);
const combinedApprovalSeries = combinedApprovalPoints.map((point) => point.value);

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
    trendYm: lastNTrendPoints(timeToHirePoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(recruiterCapacityPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(interviewBpPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(offerEaDurationPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(jobApplicationsPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(createTeamPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(scheduleInterviewPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(feedbackTimePoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(combinedDocReviewPoints).map((point) => point.ym),
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
    trendYm: lastNTrendPoints(combinedApprovalPoints).map((point) => point.ym),
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
    id: 'offer-acceptance-rate',
    title: 'Offer Acceptance Rate',
    level: 'User Outcomes',
    x: 1300,
    y: 560,
    width: 260,
    value: formatPct(offerAcceptanceSeries[offerAcceptanceSeries.length - 1]),
    valueContext: changeText(lastN(offerAcceptanceSeries)),
    trend: lastN(offerAcceptanceSeries),
    trendYm: lastNTrendPoints(offerAcceptancePoints).map((point) => point.ym),
    momPct: computeMomPct(offerAcceptanceSeries),
    yoyPct: computeYoyPct(offerAcceptanceSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Percentage of Offer BP events that reached Completed status (accepted) out of all initiated Offer events. Proxy for tracker "# Offers Accepted" (HRREC-81532) / "# Offers/EAs Issued" (HRREC-90613, not yet live).',
    caveat: 'Uses BP completion as acceptance proxy. True acceptance rate requires HRREC-90613 (issued count) which is not yet data-ready. "Completed" in Offer BP = candidate accepted the offer.',
  },
  {
    id: 'ea-acceptance-rate',
    title: 'EA Acceptance Rate',
    level: 'User Outcomes',
    x: 1570,
    y: 560,
    width: 260,
    value: formatPct(eaAcceptanceSeries[eaAcceptanceSeries.length - 1]),
    valueContext: changeText(lastN(eaAcceptanceSeries)),
    trend: lastN(eaAcceptanceSeries),
    trendYm: lastNTrendPoints(eaAcceptancePoints).map((point) => point.ym),
    momPct: computeMomPct(eaAcceptanceSeries),
    yoyPct: computeYoyPct(eaAcceptanceSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'bp_event_stats · PROD',
    confidence: 'Measured',
    definition:
      'Percentage of Employment Agreement BP events that reached Completed status (accepted) out of all initiated EA events. Proxy for tracker "# EA Accepted" (HRREC-81533) / "# Offers/EAs Issued" (HRREC-90613, not yet live).',
    caveat: 'Uses BP completion as acceptance proxy. True acceptance rate requires HRREC-90613 (issued count) which is not yet data-ready. "Completed" in EA BP = candidate accepted the employment agreement.',
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
    trendYm: lastNTrendPoints(addDocumentsPoints).map((point) => point.ym),
    momPct: computeMomPct(addDocumentsSeries),
    yoyPct: computeYoyPct(addDocumentsSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents adoption rate. A concrete product lever that can reduce late-stage document handling time in Offer and Employment Agreement steps.',
    caveat: 'Kept because it is a specific product lever, not a broad vanity adoption metric.',
  },
  {
    id: 'regenerate-offer',
    title: 'Regenerate Offer Adoption',
    level: 'Feature Adoption & Usage',
    x: 1110,
    y: 810,
    width: 270,
    value: formatPct(regenerateOfferAdoptionSeries[regenerateOfferAdoptionSeries.length - 1] ?? 0),
    valueContext: regenerateOfferAdoptionPoints.length
      ? `${regenerateOfferAdoptionPoints[regenerateOfferAdoptionPoints.length - 1].ym} · active-tenant adoption`
      : 'No monthly adoption series',
    trend: lastN(regenerateOfferAdoptionSeries),
    trendYm: lastNTrendPoints(regenerateOfferAdoptionPoints).map((point) => point.ym),
    momPct: computeMomPct(regenerateOfferAdoptionSeries),
    yoyPct: computeYoyPct(regenerateOfferAdoptionSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'scorecard features + bp_event_stats · blended',
    confidence: 'Directional',
    definition:
      'Share of tenants active in Offer duration telemetry that also have Regenerate Offer Documents feature adoption.',
    caveat:
      'Adoption series is calculated against monthly active Offer tenants, not a dedicated regenerate-event metric.',
  },
  {
    id: 'regenerate-ea',
    title: 'Regenerate EA Adoption',
    level: 'Feature Adoption & Usage',
    x: 1400,
    y: 810,
    width: 250,
    value: formatPct(regenerateEaAdoptionSeries[regenerateEaAdoptionSeries.length - 1] ?? 0),
    valueContext: regenerateEaAdoptionPoints.length
      ? `${regenerateEaAdoptionPoints[regenerateEaAdoptionPoints.length - 1].ym} · active-tenant adoption`
      : 'No monthly adoption series',
    trend: lastN(regenerateEaAdoptionSeries),
    trendYm: lastNTrendPoints(regenerateEaAdoptionPoints).map((point) => point.ym),
    momPct: computeMomPct(regenerateEaAdoptionSeries),
    yoyPct: computeYoyPct(regenerateEaAdoptionSeries),
    trendGoodDirection: 'higherIsBetter',
    source: 'scorecard features + bp_event_stats · blended',
    confidence: 'Directional',
    definition:
      'Share of tenants active in Employment Agreement telemetry with regenerate-documents feature adoption footprint.',
    caveat:
      'EA-specific regenerate feature naming is not split in scorecard exports yet; this uses the current regenerate-documents feature footprint as proxy.',
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
  { from: 'offer-acceptance-rate', to: 'offer-ea-duration', label: 'offer acceptance throughput', confidence: 'Directional' },
  { from: 'ea-acceptance-rate', to: 'offer-ea-duration', label: 'EA acceptance throughput', confidence: 'Directional' },
  // Feature Adoption & Usage → User Outcomes
  { from: 'add-documents', to: 'document-review', label: 'document prep adoption', confidence: 'Directional' },
  { from: 'regenerate-offer', to: 'document-review', label: 'offer doc regen coverage', confidence: 'Directional' },
  { from: 'regenerate-ea', to: 'document-review', label: 'ea doc regen coverage', confidence: 'Directional' },
];

// ── Full time series for expanded detail panel ──

export const FULL_SERIES: Record<string, TrendPoint[]> = {
  'add-documents': addDocumentsPoints,
  'regenerate-offer': regenerateOfferAdoptionPoints,
  'regenerate-ea': regenerateEaAdoptionPoints,
  'document-review': combinedDocReviewPoints,
  'approval-time': combinedApprovalPoints,
  'offer-ea-duration': offerEaDurationPoints,
  'offer-acceptance-rate': offerAcceptancePoints,
  'ea-acceptance-rate': eaAcceptancePoints,
  'avg-time-to-hire': timeToHirePoints,
  'recruiter-capacity': recruiterCapacityPoints,
  'time-in-interview-bp': interviewBpPoints,
  'feedback-time': feedbackTimePoints,
  'schedule-interviews': scheduleInterviewPoints,
  'create-interview-team': createTeamPoints,
  'job-applications': jobApplicationsPoints,
};

/**
 * Convert point-in-time adoption to cumulative (monotonically increasing).
 * Useful for showing feature adoption growth over time.
 */
export function cumulativeAdoption(points: TrendPoint[]): TrendPoint[] {
  let cumulative = 0;
  return points.map((p) => {
    cumulative = Math.max(cumulative, p.value);
    return { ym: p.ym, value: cumulative };
  });
}

function firstPositiveYm(points: TrendPoint[]): string | null {
  const point = points.find((entry) => Number.isFinite(entry.value) && entry.value > 0);
  return point?.ym ?? null;
}

/** First adoption month for each feature (computed from observed monthly series). */
export const FEATURE_FIRST_ADOPTION: Record<string, string> = {
  'add-documents': firstPositiveYm(addDocumentsPoints) ?? addDocumentsPoints[0]?.ym ?? '',
  'regenerate-offer': firstPositiveYm(regenerateOfferAdoptionPoints) ?? regenerateOfferAdoptionPoints[0]?.ym ?? '',
  'regenerate-ea': firstPositiveYm(regenerateEaAdoptionPoints) ?? regenerateEaAdoptionPoints[0]?.ym ?? '',
};

/**
 * Get all upstream (outcome) nodes reachable from a given node by following edges.
 * Edges go from (driver) to (outcome), so upstream means following edge.to direction.
 */
export function getUpstreamPath(nodeId: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const upstreamEdges = TREE_EDGES.filter((e) => e.from === id);
    for (const edge of upstreamEdges) {
      result.push(edge.to);
      traverse(edge.to);
    }
  }

  traverse(nodeId);
  return result;
}

// ── Helpers for filtered tree recomputation ──

type NodeFormatter = {
  metricKeys: string[];
  combiner: 'avg' | 'sum';
  format: (v: number) => string;
  unit: string;
};

const NODE_FORMAT_MAP: Record<string, NodeFormatter> = {
  'time-in-interview-bp': { metricKeys: ['time-in-interview-bp'], combiner: 'avg', format: formatDays, unit: 'days' },
  'offer-ea-duration': { metricKeys: ['offer-duration', 'ea-duration'], combiner: 'sum', format: formatDays, unit: 'days' },
  'offer-acceptance-rate': { metricKeys: ['offer-completion'], combiner: 'avg', format: formatPct, unit: '%' },
  'ea-acceptance-rate': { metricKeys: ['ea-completion'], combiner: 'avg', format: formatPct, unit: '%' },
  'job-applications': { metricKeys: ['job-applications'], combiner: 'avg', format: (v) => `${v.toFixed(0)} / tenant`, unit: '' },
  'create-interview-team': { metricKeys: ['create-interview-team'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'schedule-interviews': { metricKeys: ['schedule-interviews'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'feedback-time': { metricKeys: ['feedback-time'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'document-review': { metricKeys: ['document-review'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'approval-time': { metricKeys: ['approval-time'], combiner: 'avg', format: formatHours, unit: 'hrs' },
  'add-documents': { metricKeys: ['add-documents'], combiner: 'avg', format: (v) => `${v.toFixed(1)}`, unit: 'refs' },
};

function buildFilteredFeatureAdoptionNode(
  base: MetricTreeNode,
  filteredTenants: string[],
  adopters: ReadonlySet<string>,
  activityMetricKey: string,
  caveat: string,
): MetricTreeNode {
  const scopedPoints = buildFeatureAdoptionSeries(adopters, activityMetricKey, filteredTenants);
  if (scopedPoints.length === 0) {
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [], trendYm: [], momPct: null, yoyPct: null };
  }
  const series = scopedPoints.map((point) => point.value);
  const latest = scopedPoints[scopedPoints.length - 1];
  return {
    ...base,
    value: formatPct(latest.value),
    valueContext: `Filtered (${latest.adoptedTenants}/${latest.activeTenants} active tenants) · ${latest.ym}`,
    trend: lastN(series),
    trendYm: lastNTrendPoints(scopedPoints).map((point) => point.ym),
    momPct: computeMomPct(series),
    yoyPct: computeYoyPct(series),
    caveat,
  };
}

function aggregateFilteredSeries(
  metricKey: string,
  filteredTenants: string[],
): TrendPoint[] {
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
    if (values.length === 0) return null;
    return { ym, value: median(values) };
  }).filter((point): point is TrendPoint => point != null);
}

export function buildFilteredNode(
  nodeId: string,
  filteredTenants: string[],
  base: MetricTreeNode,
): MetricTreeNode {
  if (nodeId === 'add-documents') {
    return buildFilteredFeatureAdoptionNode(
      base,
      filteredTenants,
      ADD_DOCUMENTS_ADOPTED_TENANT_SET,
      'offer-duration',
      'Filtered Add Documents trend uses monthly active Offer tenants with Add Documents feature adoption footprint.',
    );
  }
  if (nodeId === 'regenerate-offer') {
    return buildFilteredFeatureAdoptionNode(
      base,
      filteredTenants,
      REGENERATE_OFFER_ADOPTED_TENANT_SET,
      'offer-duration',
      'Filtered Regenerate Offer trend uses monthly active Offer tenants with regenerate-documents feature adoption.',
    );
  }
  if (nodeId === 'regenerate-ea') {
    return buildFilteredFeatureAdoptionNode(
      base,
      filteredTenants,
      REGENERATE_EA_ADOPTED_TENANT_SET,
      'ea-duration',
      'Filtered Regenerate EA trend uses monthly active EA tenants with current regenerate-documents feature footprint proxy.',
    );
  }

  const fmt = NODE_FORMAT_MAP[nodeId];
  if (!fmt) return base;

  const hasNoTenantData = fmt.metricKeys.every((k) => {
    const src = TREE_TENANT_SERIES[k];
    return !src || Object.keys(src).length === 0;
  });
  if (hasNoTenantData) {
    return { ...base, valueContext: `${base.valueContext} · aggregate (per-tenant data not available)` };
  }

  const seriesPerKey = fmt.metricKeys.map((k) => aggregateFilteredSeries(k, filteredTenants));
  if (seriesPerKey.every((s) => s.length === 0)) {
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [], trendYm: [], momPct: null, yoyPct: null };
  }

  let combinedPoints: TrendPoint[];
  if (fmt.metricKeys.length === 1) {
    combinedPoints = seriesPerKey[0];
  } else {
    const allYms = Array.from(new Set(seriesPerKey.flatMap((series) => series.map((point) => point.ym)))).sort();
    combinedPoints = allYms.map((ym) => {
      const vals = seriesPerKey
        .map((series) => series.find((point) => point.ym === ym)?.value)
        .filter((value): value is number => value != null && Number.isFinite(value));
      if (vals.length === 0) return null;
      return {
        ym,
        value: fmt.combiner === 'sum'
          ? vals.reduce((a, b) => a + b, 0)
          : vals.reduce((a, b) => a + b, 0) / vals.length,
      };
    }).filter((point): point is TrendPoint => point != null);
  }

  if (combinedPoints.length === 0) {
    return { ...base, value: 'Unavailable', valueContext: 'No matching tenants', trend: [], trendYm: [], momPct: null, yoyPct: null };
  }

  const combined = combinedPoints.map((point) => point.value);
  const lastCombinedPoints = lastNTrendPoints(combinedPoints);
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
    trendYm: lastCombinedPoints.map((point) => point.ym),
    momPct: computeMomPct(combined),
    yoyPct: computeYoyPct(combined),
  };
}

export { lastN, definedSeries, formatDays, formatHours, formatPct, changeText, metricValue, computeMomPct, computeYoyPct };
