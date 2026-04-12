/**
 * Sub-BP dashboard segmentation helpers.
 * Row aggregates are materialised in `data-bp-durations.ts` (join path documented there):
 * `dw.swh.bp_event_stats` + `dw.user_test.interview_dashboard_tenant_filters` on tenant.
 */

import type { AggTuple, BpMonthly, StatusMetrics, SubBpConfig } from './data-bp-durations';
import {
  GLOBAL_ROWS,
  REGION_ROWS,
  INDUSTRY_ROWS,
  TENANT_ROWS,
  LABELS,
  SUB_BPS,
} from './data-bp-durations';
import {
  EMPLOYMENT_AGREEMENT_GLOBAL_ROWS,
  EMPLOYMENT_AGREEMENT_REGION_ROWS,
  EMPLOYMENT_AGREEMENT_INDUSTRY_ROWS,
  EMPLOYMENT_AGREEMENT_TENANT_ROWS,
  EMPLOYMENT_AGREEMENT_SUB_BP_META,
} from './data-employment-agreement-durations';

const SUB_BP_METAS: Array<{ key: string; label: string; description: string }> = SUB_BPS.map(b => ({
  key: b.key,
  label: b.label,
  description: b.description,
}));

/** Employment Agreement sits after Offer in flow views (bottleneck strip, overview legends) but before later stages like Ready for Hire. */
const EA_META = {
  key: EMPLOYMENT_AGREEMENT_SUB_BP_META.key,
  label: EMPLOYMENT_AGREEMENT_SUB_BP_META.label,
  description: EMPLOYMENT_AGREEMENT_SUB_BP_META.description,
};

const OFFER_IDX = SUB_BP_METAS.findIndex(b => b.key === 'offer');
const ALL_SUB_BP_DEFINITIONS: Array<{ key: string; label: string; description: string }> =
  OFFER_IDX >= 0
    ? [...SUB_BP_METAS.slice(0, OFFER_IDX + 1), EA_META, ...SUB_BP_METAS.slice(OFFER_IDX + 1)]
    : [...SUB_BP_METAS, EA_META];

/** Sub-BP keys valid in URL (?bp=) and detail picker (includes Employment Agreement after Offer). */
export const ALL_SUB_BP_KEYS: readonly string[] = ALL_SUB_BP_DEFINITIONS.map(d => d.key);

export type TenantRegionIndustryFilter = {
  tenant: string;
  region: string;
  industry: string;
};

export const EMPTY_TENANT_FILTER: TenantRegionIndustryFilter = {
  tenant: '',
  region: '',
  industry: '',
};

export type BpHeadlineEntry = {
  totalEvents: number;
  maxTenants: number;
  avgDaysCompleted: number;
  medianDaysCompleted: number;
  completionPct: number;
  cancellationPct: number;
};

export type BpHeadlineMap = Record<string, BpHeadlineEntry>;

function emptyStatus(): StatusMetrics {
  return {
    events: 0,
    avgDays: null,
    medianDays: null,
    avgSteps: null,
    pctSentBack: 0,
    pctCorrected: 0,
    pctReassigned: 0,
  };
}

function statusFor(rows: AggTuple[], bpKey: string, ym: string, status: string): StatusMetrics {
  const r = rows.find(x => x[1] === bpKey && x[2] === ym && x[3] === status);
  if (!r) return emptyStatus();
  return {
    events: r[4],
    avgDays: r[6],
    medianDays: r[7],
    avgSteps: r[8],
    pctSentBack: r[9],
    pctCorrected: r[10],
    pctReassigned: r[11],
  };
}

function buildMonth(rows: AggTuple[], bpKey: string, ym: string): BpMonthly {
  const completed = statusFor(rows, bpKey, ym, 'Completed');
  const inProgress = statusFor(rows, bpKey, ym, 'In Progress');
  const cancelled = statusFor(rows, bpKey, ym, 'Cancelled');
  const other = statusFor(rows, bpKey, ym, 'Other');
  const total = completed.events + inProgress.events + cancelled.events + other.events;
  const subset = rows.filter(r => r[1] === bpKey && r[2] === ym);
  const tenants = subset.length > 0 ? Math.max(...subset.map(r => r[5])) : 0;
  return {
    ym,
    completed,
    inProgress,
    cancelled,
    other,
    total,
    tenants,
    completionPct: total > 0 ? Math.round((completed.events / total) * 1000) / 10 : 0,
    cancellationPct: total > 0 ? Math.round((cancelled.events / total) * 1000) / 10 : 0,
    avgDays: completed.avgDays,
    medianDays: completed.medianDays,
  };
}

/** Rows for one slice (mutually exclusive: tenant > region > industry > global). */
export function rowsForTenantRegionIndustryFilter(f: TenantRegionIndustryFilter): AggTuple[] {
  if (f.tenant) {
    return [
      ...TENANT_ROWS.filter(r => r[0] === f.tenant),
      ...EMPLOYMENT_AGREEMENT_TENANT_ROWS.filter(r => r[0] === f.tenant),
    ];
  }
  if (f.region) {
    return [
      ...REGION_ROWS.filter(r => r[0] === f.region),
      ...EMPLOYMENT_AGREEMENT_REGION_ROWS.filter(r => r[0] === f.region),
    ];
  }
  if (f.industry) {
    return [
      ...INDUSTRY_ROWS.filter(r => r[0] === f.industry),
      ...EMPLOYMENT_AGREEMENT_INDUSTRY_ROWS.filter(r => r[0] === f.industry),
    ];
  }
  return [...GLOBAL_ROWS, ...EMPLOYMENT_AGREEMENT_GLOBAL_ROWS];
}

export function subBpsFromAggRows(rows: AggTuple[]): SubBpConfig[] {
  return ALL_SUB_BP_DEFINITIONS.map(meta => ({
    key: meta.key,
    label: meta.label,
    description: meta.description,
    data: [...LABELS].map(ym => buildMonth(rows, meta.key, ym)),
  }));
}

export function computeHeadlineFromSubBps(subBps: SubBpConfig[]): BpHeadlineMap {
  const out: BpHeadlineMap = {};
  for (const bp of subBps) {
    let totalEvents = 0;
    let maxTenants = 0;
    let wAvgNum = 0;
    let wAvgDen = 0;
    let wMedNum = 0;
    let wMedDen = 0;
    for (const m of bp.data) {
      totalEvents += m.total;
      maxTenants = Math.max(maxTenants, m.tenants);
      if (m.completed.events > 0 && m.completed.avgDays != null) {
        wAvgNum += m.completed.events * m.completed.avgDays;
        wAvgDen += m.completed.events;
      }
      if (m.completed.events > 0 && m.completed.medianDays != null) {
        wMedNum += m.completed.events * m.completed.medianDays;
        wMedDen += m.completed.events;
      }
    }
    const last = bp.data[bp.data.length - 1];
    out[bp.key] = {
      totalEvents,
      maxTenants,
      avgDaysCompleted: wAvgDen > 0 ? Math.round((wAvgNum / wAvgDen) * 100) / 100 : 0,
      medianDaysCompleted: wMedDen > 0 ? Math.round((wMedNum / wMedDen) * 100) / 100 : 0,
      completionPct: last?.completionPct ?? 0,
      cancellationPct: last?.cancellationPct ?? 0,
    };
  }
  return out;
}

export function getSliceSubBpsAndHeadline(f: TenantRegionIndustryFilter): {
  subBps: SubBpConfig[];
  headline: BpHeadlineMap;
  isGlobal: boolean;
} {
  const isGlobal = !f.tenant && !f.region && !f.industry;
  const rows = rowsForTenantRegionIndustryFilter(
    isGlobal ? { tenant: '', region: '', industry: '' } : f
  );
  const subBps = subBpsFromAggRows(rows);
  const headline = computeHeadlineFromSubBps(subBps);
  return { subBps, headline, isGlobal };
}
