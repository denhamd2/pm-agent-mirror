import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  AVG_TIME_IN_INTERVIEW_BP,
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
  INTERVIEW_SESSIONS_MONTHLY,
  MISST_MONTHLY,
} from './data-interview-metrics';
import { FEATURE_ADOPTION } from './data-recruiting-adoption';
import { addDocumentsMonthly } from './data-add-documents';
import { EMPTY_TENANT_FILTER, getSliceSubBpsAndHeadline } from './data-bp-durations-by-segment';

export type MetricTreeLevel =
  | 'Business Value Outcomes'
  | 'Product Value Outcomes'
  | 'Adoption & Usage';

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
  title: 'Workday Recruiting KPI Tree',
  subtitle:
    'A PM-facing KPI map that starts with business value outcomes, then steps down into product value outcomes and adoption or usage signals.\nLive nodes use repo-backed metrics; legacy and future nodes stay labelled so the tree remains decision-useful without overstating causality.',
  sourceSummary:
    'Combines live metric-name-resolved IUMs, production interview analytics, global Job App sub-BP timing, Recruiting adoption metrics, and Add Documents usage.',
  caveat:
    'IUMs are mostly tenant-month outcome aggregates, while BP-stage metrics are event-level operational timings. Some links are therefore directional decomposition, not direct causal joins.',
  canvas: { width: 1840, height: 1260 },
} as const;

function lastN(values: number[], count = 6): number[] {
  return values.slice(Math.max(0, values.length - count));
}

function formatDays(value: number): string {
  return `${value.toFixed(1)} days`;
}

function changeText(series: number[]): string {
  if (series.length < 2) return 'Latest visible month';
  const delta = series[series.length - 1] - series[series.length - 2];
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(1)} vs prev month`;
}

function definedSeries(values: Array<number | null>): number[] {
  return values.filter((value): value is number => value != null && Number.isFinite(value));
}

function metricValue(value: number | null, fallback = 0): number {
  return value ?? fallback;
}

const timeToHire = VALUE_REALIZATION_IUMS.timeToHire;
const timeToFill = VALUE_REALIZATION_IUMS.timeToFill;
const recruiterCapacity = VALUE_REALIZATION_IUMS.recruiterProductivity;
const offersAccepted = VALUE_REALIZATION_IUMS.offersAccepted;
const eaAccepted = VALUE_REALIZATION_IUMS.employmentAgreementAcceptance;
const internalApplications = VALUE_REALIZATION_IUMS.internalJobApplications;

const timeToHireSeries = definedSeries(timeToHire.series.map((point) => point.avgValue));
const timeToFillSeries = definedSeries(timeToFill.series.map((point) => point.avgValue));
const recruiterCapacitySeries = recruiterCapacity.series
  .filter((point) => point.ym >= '2025-06')
  .map((point) => point.avgValue);
const cleanedRecruiterCapacitySeries = definedSeries(recruiterCapacitySeries);
const offersAcceptedSeries = definedSeries(offersAccepted.series.slice(-6).map((point) => point.avgValue));
const eaAcceptedSeries = definedSeries(eaAccepted.series.slice(-6).map((point) => point.avgValue));
const internalApplicationsSeries = definedSeries(internalApplications.series.slice(-6).map((point) => point.avgValue));

const interviewBpSeries = AVG_TIME_IN_INTERVIEW_BP.map((point) => point.avgValue);
const jobApplicationsSeries = JOB_APPLICATIONS_MONTHLY.map((point) => point.value / point.tenants);
const interviewRoundsSeries = INTERVIEW_ROUNDS_MONTHLY.map((point) => point.value / point.tenants);
const interviewSessionsSeries = INTERVIEW_SESSIONS_MONTHLY.map((point) => point.value / point.tenants);
const misstSeries = MISST_MONTHLY.map((point) => point.sessionsPerReq);
const recruitingAdoptionSeries = (FEATURE_ADOPTION['Recruiting (core)'] ?? []).map((point) => point.adoption * 100);
const addDocumentsSeries = addDocumentsMonthly.slice(-6).map((point) => point.adoptionRatePct);

const latestAddDocuments = addDocumentsMonthly[addDocumentsMonthly.length - 1];
const latestRecruitingAdoption = FEATURE_ADOPTION['Recruiting (core)']?.slice(-1)[0];

const { subBps } = getSliceSubBpsAndHeadline(EMPTY_TENANT_FILTER);
const topBottleneckStages = subBps
  .map((bp) => {
    const latest = bp.data[bp.data.length - 1];
    return {
      id: bp.key,
      label: bp.label,
      medianDays: latest?.medianDays ?? latest?.avgDays ?? 0,
      description: bp.description,
      trend: lastN(
        bp.data
          .map((point) => point.medianDays ?? point.avgDays ?? 0)
          .filter((value) => Number.isFinite(value))
      ),
    };
  })
  .filter((bp) => bp.medianDays > 0)
  .sort((a, b) => b.medianDays - a.medianDays)
  .slice(0, 3);

function stageSource(label: string): string {
  if (/employment agreement/i.test(label)) return 'bp_event_stats · PROD';
  return 'bp_event_stats · PROD';
}

const stagePositions = [
  { x: 1120, y: 520 },
  { x: 1380, y: 520 },
  { x: 1640, y: 520 },
];

const stageNodes: MetricTreeNode[] = topBottleneckStages.map((stage, index) => ({
  id: `stage-${stage.id}`,
  title: stage.label,
  shortTitle: 'Job App stage',
  level: 'Product Value Outcomes',
  x: stagePositions[index]?.x ?? 1200,
  y: stagePositions[index]?.y ?? 520 + index * 160,
  width: 210,
  value: formatDays(stage.medianDays),
  valueContext: `Latest median completed duration · ${changeText(stage.trend)}`,
  trend: lastN(stage.trend),
  source: stageSource(stage.label),
  confidence: 'Measured',
  definition: stage.description,
  caveat:
    'This is a completed-event stage timing metric. It explains where delay is showing up operationally, but it does not share the same grain as tenant-month IUM outcomes.',
}));

export const TREE_LEVELS: MetricTreeLevel[] = [
  'Business Value Outcomes',
  'Product Value Outcomes',
  'Adoption & Usage',
];

export const TREE_NODES: MetricTreeNode[] = [
  {
    id: 'avg-time-to-hire',
    title: 'Average Time to Hire',
    level: 'Business Value Outcomes',
    x: 780,
    y: 70,
    width: 300,
    value: formatDays(metricValue(timeToHire.latestValue)),
    valueContext: `${timeToHire.latestYm} · ${timeToHire.environment} · ${changeText(lastN(timeToHireSeries))}`,
    trend: lastN(timeToHireSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Mean tenant-level time from first posting date to latest offer accepted date. This is the north-star lagging outcome in the current Recruiting tree.',
    caveat: 'Current live recruiting IUM coverage is SANDBOX-only in the accessible warehouse.',
  },
  {
    id: 'time-to-fill',
    title: 'Time to First Fill',
    level: 'Business Value Outcomes',
    x: 440,
    y: 90,
    width: 240,
    value: formatDays(metricValue(timeToFill.latestValue)),
    valueContext: `Legacy snapshot · ${changeText(lastN(timeToFillSeries))}`,
    trend: lastN(timeToFillSeries),
    source: 'Legacy IUM snapshot',
    confidence: 'Directional',
    definition:
      'Historical time-to-fill reference retained for comparison to the tracker, but not used as a fully live-resolved metric in the workspace.',
    caveat: 'The old Time to Fill ID mapping drifted, so this remains legacy until a fresh live replacement is revalidated.',
  },
  {
    id: 'offers-accepted',
    title: 'Offers Accepted',
    level: 'Product Value Outcomes',
    x: 520,
    y: 320,
    width: 230,
    value: `${metricValue(offersAccepted.latestValue).toFixed(1)} avg`,
    valueContext: `${offersAccepted.latestYm} · ${offersAccepted.environment}`,
    trend: lastN(offersAcceptedSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition: 'Average number of offers accepted per reporting tenant for the month.',
  },
  {
    id: 'ea-accepted',
    title: 'EA Accepted',
    level: 'Product Value Outcomes',
    x: 790,
    y: 320,
    width: 230,
    value: `${metricValue(eaAccepted.latestValue).toFixed(1)} avg`,
    valueContext: `${eaAccepted.latestYm} · ${eaAccepted.environment}`,
    trend: lastN(eaAcceptedSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition: 'Average number of Employment Agreements accepted per reporting tenant for the month.',
  },
  {
    id: 'recruiter-capacity',
    title: 'Recruiter Capacity',
    shortTitle: 'Live IUM name: Recruiter Productivity',
    level: 'Product Value Outcomes',
    x: 780,
    y: 520,
    width: 300,
    value: `${metricValue(recruiterCapacity.latestValue).toFixed(1)} avg reqs`,
    valueContext: `${recruiterCapacity.latestYm} · ${recruiterCapacity.environment} · ${changeText(lastN(cleanedRecruiterCapacitySeries))}`,
    trend: lastN(cleanedRecruiterCapacitySeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Average number of open requisitions and evergreens per primary recruiter. Tracker wording is Recruiter Capacity; the live warehouse metric name is Recruiter Productivity.',
    caveat: 'Do not conflate this with interview-coordinator or rater capacity metrics on the Interview dashboard.',
  },
  {
    id: 'time-in-interview-bp',
    title: 'Time in Interview BP',
    level: 'Product Value Outcomes',
    x: 250,
    y: 320,
    width: 250,
    value: formatDays(AVG_TIME_IN_INTERVIEW_BP[AVG_TIME_IN_INTERVIEW_BP.length - 1].avgValue),
    valueContext: 'Latest production interview series',
    trend: lastN(interviewBpSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Average completed-path time spent in the Interview business process.',
    caveat: 'Recent months can be right-censored, so the most recent point is best read alongside the broader trend.',
  },
  {
    id: 'time-to-first-misst',
    title: 'Time to First Interview Team Creation',
    shortTitle: 'MISST',
    level: 'Adoption & Usage',
    x: 760,
    y: 920,
    width: 260,
    value: `${MISST_MONTHLY[MISST_MONTHLY.length - 1].sessionsPerReq.toFixed(2)} sessions/req`,
    valueContext: 'Latest production MISST series',
    trend: lastN(misstSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Interview-team creation and session activity are useful early signals for interview scheduling friction and downstream load.',
    caveat: 'This node uses sessions per requisition as the cleanest current live series in the repo, not the separate historical snapshot of days to first MISST.',
  },
  {
    id: 'offer-ea-chain',
    title: 'Offer / EA Timing',
    level: 'Product Value Outcomes',
    x: 250,
    y: 520,
    width: 250,
    value: 'Future metric',
    valueContext: 'Tracker expects job-app chain timing',
    trend: [0, 0, 0, 0, 0, 0],
    source: 'Blocked / future instrumentation',
    confidence: 'Future',
    definition:
      'Tracker definition expects first EA start through final completed EA on the job application chain, which differs from the per-event sub-BP durations currently available.',
    caveat: 'The repo can show Offer and Employment Agreement event timings today, but not the full tracker chain as a single live metric.',
  },
  {
    id: 'job-applications',
    title: 'Job Applications',
    level: 'Adoption & Usage',
    x: 230,
    y: 920,
    width: 230,
    value: `${jobApplicationsSeries[jobApplicationsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(jobApplicationsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Average application volume per reporting tenant. This is a pipeline-load driver rather than an end outcome.',
  },
  {
    id: 'interview-rounds',
    title: 'Interview Rounds',
    level: 'Adoption & Usage',
    x: 490,
    y: 920,
    width: 220,
    value: `${interviewRoundsSeries[interviewRoundsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(interviewRoundsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Interview-round volume per reporting tenant, useful for reading panel complexity and recruiter coordination burden.',
  },
  {
    id: 'interview-sessions',
    title: 'Interview Sessions',
    level: 'Adoption & Usage',
    x: 1030,
    y: 920,
    width: 220,
    value: `${interviewSessionsSeries[interviewSessionsSeries.length - 1].toFixed(0)} / tenant`,
    valueContext: 'Production interview feed',
    trend: lastN(interviewSessionsSeries),
    source: 'Interview analytics · PROD',
    confidence: 'Measured',
    definition: 'Interview-session volume per reporting tenant, capturing downstream scheduling and interviewer load.',
  },
  {
    id: 'internal-applications',
    title: 'Internal Applications',
    level: 'Adoption & Usage',
    x: 1290,
    y: 920,
    width: 240,
    value: `${metricValue(internalApplications.latestValue).toFixed(1)} avg`,
    valueContext: `${internalApplications.latestYm} · ${internalApplications.environment}`,
    trend: lastN(internalApplicationsSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition: 'Average number of internal job applications per reporting tenant, giving a candidate-mix signal in the pipeline.',
  },
  {
    id: 'career-site-funnel',
    title: 'Career Site Funnel',
    level: 'Adoption & Usage',
    x: 1550,
    y: 920,
    width: 230,
    value: 'Proxy / future',
    valueContext: 'Tracker intent exists, clean submitted signal not yet live here',
    trend: [0, 0, 0, 0, 0, 0],
    source: 'Future instrumentation',
    confidence: 'Future',
    definition:
      'Tracker expects reach, started, and submitted funnel stages. Repo evidence currently supports only partial proxies, so the full node stays future-facing.',
  },
  {
    id: 'recruiting-adoption',
    title: 'Recruiting Adoption',
    level: 'Adoption & Usage',
    x: 620,
    y: 1080,
    width: 250,
    value: `${((latestRecruitingAdoption?.adoption ?? 0) * 100).toFixed(1)}%`,
    valueContext: `${latestRecruitingAdoption?.ym ?? 'Latest'} · PROD adoption`,
    trend: lastN(recruitingAdoptionSeries),
    source: 'Usage metrics · PROD',
    confidence: 'Measured',
    definition:
      'Share of production tenants with core Recruiting enabled. This is a leading product-usage signal that helps explain whether higher load is supported by stronger platform adoption.',
  },
  {
    id: 'add-documents',
    title: 'Add Documents',
    level: 'Adoption & Usage',
    x: 930,
    y: 1080,
    width: 240,
    value: `${latestAddDocuments.adoptionRatePct.toFixed(1)}%`,
    valueContext: `${latestAddDocuments.ym} adoption rate`,
    trend: lastN(addDocumentsSeries),
    source: 'IUM · SANDBOX',
    confidence: 'Measured',
    definition:
      'Add Documents is a concrete leading product lever that can reduce late-stage friction in offer and employment-agreement steps.',
    caveat: 'This node is a feature-adoption lever, not an outcome metric on its own.',
  },
];

TREE_NODES.push(...stageNodes);

export const TREE_EDGES: MetricTreeEdge[] = [
  { from: 'time-to-fill', to: 'avg-time-to-hire', label: 'adjacent lagging KPI', confidence: 'Directional' },
  { from: 'offers-accepted', to: 'avg-time-to-hire', label: 'late-funnel completion', confidence: 'Measured' },
  { from: 'ea-accepted', to: 'avg-time-to-hire', label: 'post-offer completion', confidence: 'Measured' },
  { from: 'recruiter-capacity', to: 'avg-time-to-hire', label: 'operational load', confidence: 'Directional' },
  { from: 'time-in-interview-bp', to: 'avg-time-to-hire', label: 'interview cycle delay', confidence: 'Measured' },
  { from: 'time-to-first-misst', to: 'time-in-interview-bp', label: 'scheduling friction', confidence: 'Measured' },
  { from: 'offer-ea-chain', to: 'avg-time-to-hire', label: 'late-stage delay', confidence: 'Future' },
  { from: 'job-applications', to: 'recruiter-capacity', label: 'pipeline load', confidence: 'Measured' },
  { from: 'interview-rounds', to: 'time-in-interview-bp', label: 'panel complexity', confidence: 'Measured' },
  { from: 'interview-sessions', to: 'time-in-interview-bp', label: 'coordination load', confidence: 'Measured' },
  { from: 'internal-applications', to: 'job-applications', label: 'candidate mix', confidence: 'Measured' },
  { from: 'career-site-funnel', to: 'job-applications', label: 'upstream demand', confidence: 'Future' },
  { from: 'recruiting-adoption', to: 'recruiter-capacity', label: 'workflow scale lever', confidence: 'Directional' },
  { from: 'add-documents', to: 'offer-ea-chain', label: 'document completion', confidence: 'Directional' },
  ...stageNodes.map((node) => ({
    from: node.id,
    to: /offer|employment agreement/i.test(node.title) ? 'offer-ea-chain' : 'time-in-interview-bp',
    label: 'sub-BP delay',
    confidence: 'Measured' as const,
  })),
];
