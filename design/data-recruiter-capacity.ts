import { VALUE_REALIZATION_IUMS } from './data-value-realization-iums';
import {
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
  INTERVIEW_SESSIONS_MONTHLY,
  AVG_TIME_IN_INTERVIEW_BP,
  MISST_MONTHLY,
  type MonthlySeries,
  type TimeSeries,
} from './data-interview-metrics';
import { FEATURE_ADOPTION } from './data-recruiting-adoption';

export const QUERY_META = {
  title: 'Recruiter Capacity',
  subtitle:
    'Shows the live Recruiter Productivity IUM that currently maps to the tracker metric Recruiter Capacity.\nThis page pairs recruiter load with interview and application context so PMs can see whether higher load is being absorbed cleanly or creating cycle-time pressure.',
  source:
    'Pharos dw.swh_raw.internal_usage_metrics_report_kafka (Recruiter Productivity, SANDBOX) plus interview analytics tables and Recruiting adoption usage metrics for context.',
  dateRange: 'Jun 2025 - Mar 2026',
  queryDate: '12 Apr 2026',
  note:
    'Recruiter Capacity is the tracker term. The live warehouse metric currently resolves as Recruiter Productivity. Context series come from production interview analytics and Recruiting adoption feeds, so this dashboard intentionally distinguishes direct load metrics from adjacent operational signals.',
} as const;

export type CapacityPoint = {
  ym: string;
  value: number;
  tenants: number;
};

export type ContextPoint = {
  ym: string;
  value: number | null;
};

export type CapacityKpi = {
  label: string;
  value: string;
  helperText: string;
  changeIndicator?: { text: string; sentiment: 'positive' | 'negative' | 'neutral' };
  tooltip: string;
};

const recruiterCapacitySeries = VALUE_REALIZATION_IUMS.recruiterProductivity.series
  .filter((point) => point.ym >= '2025-06')
  .filter((point): point is typeof point & { avgValue: number } => point.avgValue != null)
  .map((point) => ({
    ym: point.ym,
    value: point.avgValue,
    tenants: point.tenants,
  }));

export const LABELS = recruiterCapacitySeries.map((point) => point.ym);
export const CAPACITY_TREND: CapacityPoint[] = recruiterCapacitySeries;

function mapSeries<T extends { ym: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.ym, row]));
}

function alignMonthlySeries<T extends { ym: string }>(
  rows: T[],
  accessor: (row: T) => number | null
): ContextPoint[] {
  const byMonth = mapSeries(rows);
  return LABELS.map((ym) => {
    const row = byMonth.get(ym);
    return { ym, value: row ? accessor(row) : null };
  });
}

function perTenantVolume(rows: MonthlySeries[]): ContextPoint[] {
  return alignMonthlySeries(rows, (row) => (row.tenants > 0 ? row.value / row.tenants : null));
}

function averageTime(rows: TimeSeries[]): ContextPoint[] {
  return alignMonthlySeries(rows, (row) => row.avgValue);
}

const recruitingCoreAdoption = FEATURE_ADOPTION['Recruiting (core)'] ?? [];

export const CONTEXT_SERIES = {
  jobApplicationsPerTenant: perTenantVolume(JOB_APPLICATIONS_MONTHLY),
  interviewRoundsPerTenant: perTenantVolume(INTERVIEW_ROUNDS_MONTHLY),
  interviewSessionsPerTenant: perTenantVolume(INTERVIEW_SESSIONS_MONTHLY),
  avgTimeInInterviewBp: averageTime(AVG_TIME_IN_INTERVIEW_BP),
  misstSessionsPerReq: alignMonthlySeries(MISST_MONTHLY, (row) => row.sessionsPerReq),
  recruitingCoreAdoptionPct: alignMonthlySeries(recruitingCoreAdoption, (row) => row.adoption * 100),
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getDefinedValues(rows: ContextPoint[]): number[] {
  return rows.flatMap((row) => (row.value == null || Number.isNaN(row.value) ? [] : [row.value]));
}

function buildDirectionalIndex(
  series: Array<{ name: string; rows: ContextPoint[]; weight: number }>
): ContextPoint[] {
  const baselines = new Map<string, number>();
  for (const item of series) {
    const values = getDefinedValues(item.rows);
    baselines.set(item.name, average(values));
  }

  return LABELS.map((ym) => {
    let weightedTotal = 0;
    let totalWeight = 0;

    for (const item of series) {
      const point = item.rows.find((row) => row.ym === ym);
      const baseline = baselines.get(item.name) ?? 0;
      if (!point || point.value == null || baseline <= 0) continue;
      weightedTotal += (point.value / baseline) * item.weight;
      totalWeight += item.weight;
    }

    return {
      ym,
      value: totalWeight > 0 ? (weightedTotal / totalWeight) * 100 : null,
    };
  });
}

export const MODELLED_PRESSURE_INDEX = buildDirectionalIndex([
  { name: 'capacity', rows: CAPACITY_TREND.map((row) => ({ ym: row.ym, value: row.value })), weight: 0.45 },
  { name: 'jobApps', rows: CONTEXT_SERIES.jobApplicationsPerTenant, weight: 0.25 },
  { name: 'rounds', rows: CONTEXT_SERIES.interviewRoundsPerTenant, weight: 0.15 },
  { name: 'interviewBp', rows: CONTEXT_SERIES.avgTimeInInterviewBp, weight: 0.15 },
]);

function formatChange(current: number, previous: number, digits = 1): string {
  const delta = current - previous;
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(digits)} vs prev month`;
}

function formatPercentChange(current: number, previous: number): string {
  const delta = current - previous;
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta.toFixed(1)} pts vs prev month`;
}

const latestCapacity = CAPACITY_TREND[CAPACITY_TREND.length - 1];
const previousCapacity = CAPACITY_TREND[CAPACITY_TREND.length - 2];
const capacityValues = CAPACITY_TREND.map((point) => point.value);
const minCapacity = Math.min(...capacityValues);
const maxCapacity = Math.max(...capacityValues);
const avgCapacity = average(capacityValues);

const latestInterviewBp = CONTEXT_SERIES.avgTimeInInterviewBp[CONTEXT_SERIES.avgTimeInInterviewBp.length - 1]?.value ?? null;
const previousInterviewBp =
  CONTEXT_SERIES.avgTimeInInterviewBp[CONTEXT_SERIES.avgTimeInInterviewBp.length - 2]?.value ?? null;
const latestRecruitingAdoption =
  CONTEXT_SERIES.recruitingCoreAdoptionPct[CONTEXT_SERIES.recruitingCoreAdoptionPct.length - 1]?.value ?? null;
const previousRecruitingAdoption =
  CONTEXT_SERIES.recruitingCoreAdoptionPct[CONTEXT_SERIES.recruitingCoreAdoptionPct.length - 2]?.value ?? null;
const latestPressure = MODELLED_PRESSURE_INDEX[MODELLED_PRESSURE_INDEX.length - 1]?.value ?? null;
const previousPressure = MODELLED_PRESSURE_INDEX[MODELLED_PRESSURE_INDEX.length - 2]?.value ?? null;

export const HEADLINE_KPIS: CapacityKpi[] = [
  {
    label: 'Recruiter Capacity',
    value: `${latestCapacity.value.toFixed(1)} avg reqs`,
    helperText: `${latestCapacity.tenants.toLocaleString()} SANDBOX tenants · live Recruiter Productivity IUM`,
    changeIndicator: {
      text: formatChange(latestCapacity.value, previousCapacity.value),
      sentiment: latestCapacity.value > previousCapacity.value ? 'negative' : 'positive',
    },
    tooltip:
      'Tracker wording is Recruiter Capacity. The live warehouse metric name is Recruiter Productivity, defined as the average open requisitions and evergreens per primary recruiter.',
  },
  {
    label: 'Reporting tenants',
    value: latestCapacity.tenants.toLocaleString(),
    helperText: `Latest visible month ${latestCapacity.ym} · SANDBOX recruiting IUM coverage`,
    changeIndicator: {
      text: `${(latestCapacity.tenants - previousCapacity.tenants).toLocaleString()} vs prev month`,
      sentiment: latestCapacity.tenants >= previousCapacity.tenants ? 'neutral' : 'negative',
    },
    tooltip:
      'Number of tenants emitting the live Recruiter Productivity IUM in the latest visible month. Coverage matters because sharp drops can reflect data availability rather than product behaviour.',
  },
  {
    label: 'Operating range',
    value: `${minCapacity.toFixed(1)} - ${maxCapacity.toFixed(1)}`,
    helperText: `12-month observed range · trailing average ${avgCapacity.toFixed(1)}`,
    changeIndicator: {
      text: latestCapacity.value >= avgCapacity ? 'Above trailing average' : 'Below trailing average',
      sentiment: latestCapacity.value >= avgCapacity ? 'negative' : 'positive',
    },
    tooltip:
      'Observed monthly operating range for recruiter load in the live series. This is a time-series range, not a tenant percentile distribution.',
  },
  {
    label: 'Modelled pressure index',
    value: latestPressure == null ? 'Unavailable' : latestPressure.toFixed(0),
    helperText: 'Directional index combining recruiter load, application volume, interview rounds, and Interview BP time',
    changeIndicator:
      latestPressure != null && previousPressure != null
        ? {
            text: formatChange(latestPressure, previousPressure, 0),
            sentiment: latestPressure > previousPressure ? 'negative' : 'positive',
          }
        : undefined,
    tooltip:
      'Directional, not causal. The index is normalised to each series trailing mean so PMs can see whether recruiter load is rising alongside adjacent throughput and timing pressure.',
  },
];

export const CONTEXT_KPIS: CapacityKpi[] = [
  {
    label: 'Avg time in Interview BP',
    value: latestInterviewBp == null ? 'Unavailable' : `${latestInterviewBp.toFixed(1)} days`,
    helperText: 'Production interview analytics · completed-path mean',
    changeIndicator:
      latestInterviewBp != null && previousInterviewBp != null
        ? {
            text: formatChange(latestInterviewBp, previousInterviewBp),
            sentiment: latestInterviewBp > previousInterviewBp ? 'negative' : 'positive',
          }
        : undefined,
    tooltip:
      'Average completed-path time in the Interview business process from production interview analytics tables. This helps distinguish healthy load absorption from cycle-time deterioration.',
  },
  {
    label: 'Recruiting core adoption',
    value: latestRecruitingAdoption == null ? 'Unavailable' : `${latestRecruitingAdoption.toFixed(1)}%`,
    helperText: 'PROD usage metrics · Recruiting (core) adoption',
    changeIndicator:
      latestRecruitingAdoption != null && previousRecruitingAdoption != null
        ? {
            text: formatPercentChange(latestRecruitingAdoption, previousRecruitingAdoption),
            sentiment: latestRecruitingAdoption >= previousRecruitingAdoption ? 'positive' : 'negative',
          }
        : undefined,
    tooltip:
      'Share of production tenants with the Recruiting core capability enabled. This is a leading product-usage context signal rather than a direct recruiter-load measurement.',
  },
  {
    label: 'Applications per reporting tenant',
    value: (() => {
      const point = CONTEXT_SERIES.jobApplicationsPerTenant[CONTEXT_SERIES.jobApplicationsPerTenant.length - 1];
      return point?.value == null ? 'Unavailable' : point.value.toFixed(1);
    })(),
    helperText: 'Job applications divided by reporting tenants in the monthly interview feed',
    changeIndicator: {
      text: 'Volume context',
      sentiment: 'neutral',
    },
    tooltip:
      'Average monthly applications per reporting tenant, derived from production interview analytics tables. Higher recruiter load is more concerning when pipeline volume is rising at the same time.',
  },
  {
    label: 'MISST sessions per req',
    value: (() => {
      const point = CONTEXT_SERIES.misstSessionsPerReq[CONTEXT_SERIES.misstSessionsPerReq.length - 1];
      return point?.value == null ? 'Unavailable' : point.value.toFixed(2);
    })(),
    helperText: 'Production MISST analytics · sessions created per requisition',
    changeIndicator: {
      text: 'Scheduling context',
      sentiment: 'neutral',
    },
    tooltip:
      'Average interview sessions created per requisition. This helps PMs separate recruiter load from downstream scheduling complexity.',
  },
];

export const INTERPRETATION_GUIDANCE = [
  {
    title: 'Healthy scale-up',
    body:
      'Recruiter Capacity can rise without signalling trouble when Interview BP time stays flat or improves, MISST sessions per requisition are stable, and recruiting adoption is also rising.',
  },
  {
    title: 'Overload risk',
    body:
      'Rising recruiter load is a warning sign when applications per tenant and interview rounds per tenant rise at the same time and Interview BP time worsens. That pattern suggests genuine operational pressure rather than efficient scaling.',
  },
  {
    title: 'Metric caveat',
    body:
      'This page uses the live Recruiter Productivity IUM for load and pairs it with adjacent production process metrics. Those context metrics explain pressure, but they should not be interpreted as a one-to-one causal decomposition.',
  },
];
