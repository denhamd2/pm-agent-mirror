/**
 * Offer BP step-level metrics (PROD, Pharos).
 * Source: dw.swh.bp_event_record_stats
 * Queried: 11 April 2026
 * Window: wd_event_date >= current_date - 450 days AND creation_time in 2025-04 .. 2026-03 (aligned to dashboard LABELS)
 */

import { LABELS } from './data-bp-shared';

export interface OfferStepMonthlyPoint {
  ym: string;
  volume: number;
  tenants: number;
  avgHours: number | null;
  p90Hours: number | null;
}

export const OFFER_STEPS_SOURCE = {
  table: 'dw.swh.bp_event_record_stats',
  environment: 'PROD',
  bpTypeId: 'Offer',
  queriedOn: '11 April 2026',
  monthRange: '2025-04 to 2026-03',
  partitionFilter: 'wd_event_date >= current_date - interval \'450\' day',
  creationTimeFilter: "CAST(creation_time AS date) between 2025-04-01 and 2026-03-31",
} as const;

export const DOCUMENT_STEP_TASKS = ["Generate Document", "Review Documents", "Review Writer Generated Document", "Add Documents", "Manage Attachments"] as const;
export const APPROVAL_STEP_TASKS = ["Bulk Approve", "Approve Business Process (Web Service)"] as const;

export const offerDocumentStepMonthly: Record<string, OfferStepMonthlyPoint[]> = {
  "Generate Document": [{"ym":"2025-04","volume":1130713,"tenants":1138,"avgHours":6.729,"p90Hours":15.846},{"ym":"2025-05","volume":1100232,"tenants":1114,"avgHours":8.243,"p90Hours":15.82},{"ym":"2025-06","volume":1020487,"tenants":1095,"avgHours":6.498,"p90Hours":15.5},{"ym":"2025-07","volume":1002514,"tenants":1068,"avgHours":6.198,"p90Hours":14.821},{"ym":"2025-08","volume":1008205,"tenants":1054,"avgHours":5.833,"p90Hours":14.24},{"ym":"2025-09","volume":993500,"tenants":1046,"avgHours":5.402,"p90Hours":12.591},{"ym":"2025-10","volume":1082566,"tenants":1033,"avgHours":5.564,"p90Hours":12.768},{"ym":"2025-11","volume":830419,"tenants":1011,"avgHours":5.789,"p90Hours":14.074},{"ym":"2025-12","volume":752557,"tenants":1008,"avgHours":6.967,"p90Hours":16.087},{"ym":"2026-01","volume":751351,"tenants":998,"avgHours":5.928,"p90Hours":15.113},{"ym":"2026-02","volume":777039,"tenants":992,"avgHours":5.791,"p90Hours":14.922},{"ym":"2026-03","volume":920375,"tenants":974,"avgHours":5.394,"p90Hours":14.623}],
  "Review Documents": [{"ym":"2025-04","volume":1447310,"tenants":2460,"avgHours":19.92,"p90Hours":40.78},{"ym":"2025-05","volume":1467696,"tenants":2513,"avgHours":18.926,"p90Hours":40.761},{"ym":"2025-06","volume":1425780,"tenants":2538,"avgHours":18.618,"p90Hours":37.933},{"ym":"2025-07","volume":1555367,"tenants":2566,"avgHours":19.141,"p90Hours":38.607},{"ym":"2025-08","volume":1517568,"tenants":2600,"avgHours":20.941,"p90Hours":46.606},{"ym":"2025-09","volume":1529119,"tenants":2615,"avgHours":18.374,"p90Hours":37.411},{"ym":"2025-10","volume":1552990,"tenants":2675,"avgHours":17.013,"p90Hours":37.92},{"ym":"2025-11","volume":1260665,"tenants":2633,"avgHours":17.977,"p90Hours":41.206},{"ym":"2025-12","volume":1245943,"tenants":2622,"avgHours":21.196,"p90Hours":45.99},{"ym":"2026-01","volume":1208286,"tenants":2669,"avgHours":19.134,"p90Hours":42.607},{"ym":"2026-02","volume":1266729,"tenants":2672,"avgHours":18.154,"p90Hours":41.791},{"ym":"2026-03","volume":1684289,"tenants":2776,"avgHours":14.666,"p90Hours":35.589}],
  "Review Writer Generated Document": [{"ym":"2025-04","volume":1942394,"tenants":2047,"avgHours":6.974,"p90Hours":17.166},{"ym":"2025-05","volume":1933273,"tenants":2077,"avgHours":7.203,"p90Hours":17.169},{"ym":"2025-06","volume":1869997,"tenants":2140,"avgHours":6.659,"p90Hours":16.888},{"ym":"2025-07","volume":2054884,"tenants":2203,"avgHours":6.898,"p90Hours":16.887},{"ym":"2025-08","volume":2147782,"tenants":2245,"avgHours":6.879,"p90Hours":16.485},{"ym":"2025-09","volume":2277045,"tenants":2290,"avgHours":6.678,"p90Hours":16.08},{"ym":"2025-10","volume":2350562,"tenants":2330,"avgHours":6.712,"p90Hours":16.134},{"ym":"2025-11","volume":1871218,"tenants":2321,"avgHours":7.284,"p90Hours":16.758},{"ym":"2025-12","volume":1795192,"tenants":2390,"avgHours":8.365,"p90Hours":18.013},{"ym":"2026-01","volume":1897407,"tenants":2455,"avgHours":7.045,"p90Hours":17.284},{"ym":"2026-02","volume":2048404,"tenants":2478,"avgHours":6.713,"p90Hours":17.246},{"ym":"2026-03","volume":2511548,"tenants":2556,"avgHours":6.377,"p90Hours":17.251}],
  "Add Documents": [{"ym":"2025-04","volume":135838,"tenants":278,"avgHours":3.36,"p90Hours":0.122},{"ym":"2025-05","volume":135939,"tenants":294,"avgHours":3.084,"p90Hours":0.102},{"ym":"2025-06","volume":123595,"tenants":306,"avgHours":3.706,"p90Hours":0.143},{"ym":"2025-07","volume":135883,"tenants":310,"avgHours":4.058,"p90Hours":0.12},{"ym":"2025-08","volume":146986,"tenants":305,"avgHours":2.694,"p90Hours":0.089},{"ym":"2025-09","volume":153912,"tenants":309,"avgHours":2.77,"p90Hours":0.115},{"ym":"2025-10","volume":181859,"tenants":309,"avgHours":2.697,"p90Hours":0.109},{"ym":"2025-11","volume":161138,"tenants":320,"avgHours":2.42,"p90Hours":0.101},{"ym":"2025-12","volume":154477,"tenants":324,"avgHours":2.295,"p90Hours":0.113},{"ym":"2026-01","volume":148896,"tenants":326,"avgHours":1.755,"p90Hours":0.133},{"ym":"2026-02","volume":163175,"tenants":329,"avgHours":1.672,"p90Hours":0.109},{"ym":"2026-03","volume":199813,"tenants":344,"avgHours":1.357,"p90Hours":0.105}],
  "Manage Attachments": [{"ym":"2025-04","volume":467,"tenants":24,"avgHours":null,"p90Hours":null},{"ym":"2025-05","volume":343,"tenants":32,"avgHours":null,"p90Hours":null},{"ym":"2025-06","volume":327,"tenants":29,"avgHours":null,"p90Hours":null},{"ym":"2025-07","volume":330,"tenants":24,"avgHours":null,"p90Hours":null},{"ym":"2025-08","volume":515,"tenants":26,"avgHours":null,"p90Hours":null},{"ym":"2025-09","volume":429,"tenants":24,"avgHours":null,"p90Hours":null},{"ym":"2025-10","volume":390,"tenants":26,"avgHours":null,"p90Hours":null},{"ym":"2025-11","volume":294,"tenants":24,"avgHours":null,"p90Hours":null},{"ym":"2025-12","volume":348,"tenants":29,"avgHours":null,"p90Hours":null},{"ym":"2026-01","volume":277,"tenants":24,"avgHours":null,"p90Hours":null},{"ym":"2026-02","volume":325,"tenants":20,"avgHours":null,"p90Hours":null},{"ym":"2026-03","volume":391,"tenants":22,"avgHours":null,"p90Hours":null}],
};

export const offerApprovalStepMonthly: Record<string, OfferStepMonthlyPoint[]> = {
  "Bulk Approve": [{"ym":"2025-04","volume":1588,"tenants":20,"avgHours":18.313,"p90Hours":41.938},{"ym":"2025-05","volume":1495,"tenants":15,"avgHours":16.181,"p90Hours":57.085},{"ym":"2025-06","volume":2093,"tenants":20,"avgHours":22.446,"p90Hours":70.78},{"ym":"2025-07","volume":2391,"tenants":18,"avgHours":16.004,"p90Hours":26.721},{"ym":"2025-08","volume":2490,"tenants":21,"avgHours":29.89,"p90Hours":45.425},{"ym":"2025-09","volume":2467,"tenants":22,"avgHours":17.052,"p90Hours":37.993},{"ym":"2025-10","volume":2246,"tenants":18,"avgHours":15.002,"p90Hours":38.387},{"ym":"2025-11","volume":1786,"tenants":15,"avgHours":13.012,"p90Hours":22.075},{"ym":"2025-12","volume":1271,"tenants":11,"avgHours":11.18,"p90Hours":22.177},{"ym":"2026-01","volume":2022,"tenants":18,"avgHours":24.245,"p90Hours":113.263},{"ym":"2026-02","volume":2016,"tenants":18,"avgHours":12.565,"p90Hours":22.954},{"ym":"2026-03","volume":1835,"tenants":20,"avgHours":17.561,"p90Hours":38.532}],
  "Approve Business Process (Web Service)": [{"ym":"2025-04","volume":1695,"tenants":3,"avgHours":9.196,"p90Hours":24.259},{"ym":"2025-05","volume":886,"tenants":3,"avgHours":12.918,"p90Hours":47.779},{"ym":"2025-06","volume":579,"tenants":2,"avgHours":8.073,"p90Hours":26.541},{"ym":"2025-07","volume":661,"tenants":2,"avgHours":10.791,"p90Hours":26.289},{"ym":"2025-08","volume":674,"tenants":2,"avgHours":7.371,"p90Hours":22.533},{"ym":"2025-09","volume":725,"tenants":2,"avgHours":12.853,"p90Hours":22.939},{"ym":"2025-10","volume":592,"tenants":2,"avgHours":6.063,"p90Hours":7.237},{"ym":"2025-11","volume":392,"tenants":2,"avgHours":7.545,"p90Hours":25.37},{"ym":"2025-12","volume":404,"tenants":2,"avgHours":10.297,"p90Hours":29.215},{"ym":"2026-01","volume":395,"tenants":2,"avgHours":11.172,"p90Hours":44.741},{"ym":"2026-02","volume":260,"tenants":2,"avgHours":9.447,"p90Hours":19.696},{"ym":"2026-03","volume":568,"tenants":2,"avgHours":12.318,"p90Hours":32.985}],
};

export function bottleneckScore(volume: number, avgHours: number | null): number {
  if (avgHours == null || avgHours <= 0) return 0;
  const v = Math.max(0, volume);
  return avgHours * Math.log10(1 + v);
}

export type OfferBottleneckRow = {
  taskName: string;
  group: 'document' | 'approval';
  latestYm: string;
  volume: number;
  tenants: number;
  avgHours: number | null;
  p90Hours: number | null;
  score: number;
  dominantFactor: 'volume' | 'duration' | 'low_tenant_coverage';
};

/** Latest month in LABELS (same axis as sub-BP dashboard). */
export function offerStepsLatestYm(): string {
  return LABELS[LABELS.length - 1]!;
}

function pointFor(task: string, ym: string): OfferStepMonthlyPoint | undefined {
  const doc = offerDocumentStepMonthly[task];
  if (doc) return doc.find(p => p.ym === ym);
  const appr = offerApprovalStepMonthly[task];
  if (appr) return appr.find(p => p.ym === ym);
  return undefined;
}

/** Rank validated document + approval steps for a single month (default: latest dashboard month). */
export function rankOfferBottlenecks(ym: string = offerStepsLatestYm()): OfferBottleneckRow[] {
  const rows: OfferBottleneckRow[] = [];
  const push = (taskName: string, group: 'document' | 'approval') => {
    const p = pointFor(taskName, ym);
    if (!p) return;
    const score = bottleneckScore(p.volume, p.avgHours);
    let dominantFactor: OfferBottleneckRow['dominantFactor'] = 'volume';
    if (p.tenants > 0 && p.volume / p.tenants < 50) dominantFactor = 'low_tenant_coverage';
    if (p.avgHours != null && p.avgHours >= 8 && p.volume > 5000) dominantFactor = 'duration';
    rows.push({
      taskName,
      group,
      latestYm: ym,
      volume: p.volume,
      tenants: p.tenants,
      avgHours: p.avgHours,
      p90Hours: p.p90Hours,
      score,
      dominantFactor,
    });
  };
  for (const t of DOCUMENT_STEP_TASKS) push(t, 'document');
  for (const t of APPROVAL_STEP_TASKS) push(t, 'approval');
  return rows.sort((a, b) => b.score - a.score);
}

/** Sufficient volume on approval tasks to show dedicated charts (PROD, locked task names). */
export const HAS_OFFER_APPROVAL_CHARTS = true;