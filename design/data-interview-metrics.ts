// Pharos live data, queried 10 Apr 2026.
// Sources:
//   user_data.talent_ml_interview_initiation_make_decision_events   (job apps, rounds, BP time)
//   user_data.talent_ml_interview_schedule_interview_team_events    (Schedule Interview + Team time)
//   user_data.talent_ml_interviewer_engagement                      (raters, ratings)
//   user_data.talent_ml_interview_misst_events                      (MISST time, sessions)
//   user_test.class_relationship_interview_stats                    (session counts with enrichment)
//   user_test.job_req_status_daily                                  (JR to First MISST - snapshot Apr-Jul 2025)
//   swh.bp_event_record_stats                                       (feedback time, schedulers, SCE time)
// All user_data tables contain live data through 9 Apr 2026.

export const QUERY_META = {
  title: 'Interview Metrics Dashboard',
  subtitle: 'Interview management volumes, timing, and capacity across ~3,900 production tenants',
  source: 'Pharos (user_data.talent_ml_interview_*, user_test.class_relationship_interview_stats, swh.bp_event_record_stats, user_test.job_req_status_daily)',
  dateRange: 'Apr 2025 - Mar 2026',
  queryDate: '10 Apr 2026',
  note: 'All metrics now use live production tables with full 12-month coverage, except JR to First MISST (snapshot, Apr-Jul 2025 only). Recent months for "Avg time in Interview BP" and "JR to First MISST" show right-censoring bias (artificially low) since recent events have not had time to complete.',
};

export const LABELS = [
  '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
  '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03',
];

export interface MonthlySeries { ym: string; value: number; tenants: number }

/** Align a shorter series to the full LABELS array; missing months become null. */
export function toChartValues<T>(series: T[], accessor: (d: T) => number): (number | null)[] {
  const map = new Map<string, T>();
  for (const d of series) map.set((d as any).ym, d);
  return LABELS.map(ym => {
    const d = map.get(ym);
    return d != null ? accessor(d) : null;
  });
}

// ─── Section 1: Interview Volumes ───

// user_data.talent_ml_interview_initiation_make_decision_events - full 12 months
export const JOB_APPLICATIONS_MONTHLY: MonthlySeries[] = [
  { ym: '2025-04', value: 2734393, tenants: 3514 },
  { ym: '2025-05', value: 2920206, tenants: 3551 },
  { ym: '2025-06', value: 2878799, tenants: 3592 },
  { ym: '2025-07', value: 2906114, tenants: 3649 },
  { ym: '2025-08', value: 2715952, tenants: 3673 },
  { ym: '2025-09', value: 2930563, tenants: 3714 },
  { ym: '2025-10', value: 3075632, tenants: 3768 },
  { ym: '2025-11', value: 2719756, tenants: 3756 },
  { ym: '2025-12', value: 2327195, tenants: 3818 },
  { ym: '2026-01', value: 2666265, tenants: 3902 },
  { ym: '2026-02', value: 2669067, tenants: 3922 },
  { ym: '2026-03', value: 3037828, tenants: 3995 },
];

export const INTERVIEW_ROUNDS_MONTHLY: MonthlySeries[] = [
  { ym: '2025-04', value: 2098523, tenants: 3514 },
  { ym: '2025-05', value: 2300910, tenants: 3551 },
  { ym: '2025-06', value: 2233368, tenants: 3592 },
  { ym: '2025-07', value: 2135748, tenants: 3649 },
  { ym: '2025-08', value: 2089763, tenants: 3673 },
  { ym: '2025-09', value: 2265819, tenants: 3714 },
  { ym: '2025-10', value: 2346139, tenants: 3768 },
  { ym: '2025-11', value: 2128424, tenants: 3756 },
  { ym: '2025-12', value: 1840166, tenants: 3818 },
  { ym: '2026-01', value: 2007956, tenants: 3902 },
  { ym: '2026-02', value: 1876173, tenants: 3922 },
  { ym: '2026-03', value: 2229438, tenants: 3995 },
];

// class_relationship_interview_stats - full 12 months
export const INTERVIEW_SESSIONS_MONTHLY: MonthlySeries[] = [
  { ym: '2025-04', value: 1431771, tenants: 3458 },
  { ym: '2025-05', value: 1326885, tenants: 3495 },
  { ym: '2025-06', value: 1372436, tenants: 3546 },
  { ym: '2025-07', value: 1424138, tenants: 3600 },
  { ym: '2025-08', value: 1380483, tenants: 3627 },
  { ym: '2025-09', value: 1377655, tenants: 3673 },
  { ym: '2025-10', value: 1423215, tenants: 3719 },
  { ym: '2025-11', value: 1233331, tenants: 3712 },
  { ym: '2025-12', value: 996855, tenants: 3765 },
  { ym: '2026-01', value: 1346067, tenants: 3839 },
  { ym: '2026-02', value: 1635426, tenants: 3903 },
  { ym: '2026-03', value: 1706633, tenants: 3934 },
];

export const COMPETENCY_SESSIONS_MONTHLY: MonthlySeries[] = [
  { ym: '2025-04', value: 88334, tenants: 376 },
  { ym: '2025-05', value: 67019, tenants: 379 },
  { ym: '2025-06', value: 71704, tenants: 386 },
  { ym: '2025-07', value: 89337, tenants: 390 },
  { ym: '2025-08', value: 68522, tenants: 391 },
  { ym: '2025-09', value: 80635, tenants: 399 },
  { ym: '2025-10', value: 82381, tenants: 409 },
  { ym: '2025-11', value: 57677, tenants: 407 },
  { ym: '2025-12', value: 87112, tenants: 410 },
  { ym: '2026-01', value: 57711, tenants: 415 },
  { ym: '2026-02', value: 90897, tenants: 439 },
  { ym: '2026-03', value: 122217, tenants: 446 },
];

export const QUESTIONNAIRE_SESSIONS_MONTHLY: MonthlySeries[] = [
  { ym: '2025-04', value: 548553, tenants: 1147 },
  { ym: '2025-05', value: 437893, tenants: 1167 },
  { ym: '2025-06', value: 461292, tenants: 1195 },
  { ym: '2025-07', value: 604376, tenants: 1232 },
  { ym: '2025-08', value: 486598, tenants: 1247 },
  { ym: '2025-09', value: 579119, tenants: 1269 },
  { ym: '2025-10', value: 554121, tenants: 1286 },
  { ym: '2025-11', value: 531750, tenants: 1297 },
  { ym: '2025-12', value: 527625, tenants: 1321 },
  { ym: '2026-01', value: 437761, tenants: 1338 },
  { ym: '2026-02', value: 617600, tenants: 1369 },
  { ym: '2026-03', value: 712233, tenants: 1418 },
];

// ─── Section 2: Raters and Ratings (user_data.talent_ml_interviewer_engagement - full 12 months) ───

export interface RaterSeries { ym: string; raters: number; ratings: number; tenants: number }

export const RATERS_RATINGS_MONTHLY: RaterSeries[] = [
  { ym: '2025-04', raters: 116268, ratings: 782432, tenants: 2093 },
  { ym: '2025-05', raters: 118287, ratings: 771907, tenants: 2126 },
  { ym: '2025-06', raters: 118216, ratings: 751412, tenants: 2115 },
  { ym: '2025-07', raters: 125631, ratings: 829510, tenants: 2168 },
  { ym: '2025-08', raters: 121525, ratings: 767913, tenants: 2164 },
  { ym: '2025-09', raters: 121764, ratings: 732020, tenants: 2175 },
  { ym: '2025-10', raters: 126747, ratings: 830324, tenants: 2232 },
  { ym: '2025-11', raters: 114919, ratings: 664744, tenants: 2181 },
  { ym: '2025-12', raters: 110692, ratings: 630022, tenants: 2200 },
  { ym: '2026-01', raters: 108799, ratings: 633217, tenants: 2250 },
  { ym: '2026-02', raters: 112098, ratings: 637625, tenants: 2260 },
  { ym: '2026-03', raters: 121638, ratings: 714201, tenants: 2339 },
];

// ─── Section 3: Interview Time (full 12 months) ───

export interface TimeSeries { ym: string; avgValue: number; tenants: number }

// user_data.talent_ml_interview_initiation_make_decision_events
export const AVG_TIME_IN_INTERVIEW_BP: TimeSeries[] = [
  { ym: '2025-04', avgValue: 19.4, tenants: 3450 },
  { ym: '2025-05', avgValue: 18.8, tenants: 3485 },
  { ym: '2025-06', avgValue: 18.9, tenants: 3528 },
  { ym: '2025-07', avgValue: 19.1, tenants: 3581 },
  { ym: '2025-08', avgValue: 17.7, tenants: 3591 },
  { ym: '2025-09', avgValue: 17.4, tenants: 3638 },
  { ym: '2025-10', avgValue: 16.9, tenants: 3680 },
  { ym: '2025-11', avgValue: 18.5, tenants: 3664 },
  { ym: '2025-12', avgValue: 18.5, tenants: 3710 },
  { ym: '2026-01', avgValue: 14.5, tenants: 3777 },
  { ym: '2026-02', avgValue: 12.5, tenants: 3801 },
  { ym: '2026-03', avgValue: 7.5, tenants: 3872 },
];

// user_data.talent_ml_interview_schedule_interview_team_events (xo_task_name = 'Schedule Interview')
export const SCHEDULE_INTERVIEW_TIME: TimeSeries[] = [
  { ym: '2025-04', avgValue: 49.25, tenants: 2425 },
  { ym: '2025-05', avgValue: 46.12, tenants: 2457 },
  { ym: '2025-06', avgValue: 45.88, tenants: 2495 },
  { ym: '2025-07', avgValue: 43.50, tenants: 2550 },
  { ym: '2025-08', avgValue: 44.54, tenants: 2566 },
  { ym: '2025-09', avgValue: 46.20, tenants: 2604 },
  { ym: '2025-10', avgValue: 47.59, tenants: 2647 },
  { ym: '2025-11', avgValue: 47.03, tenants: 2635 },
  { ym: '2025-12', avgValue: 57.69, tenants: 2684 },
  { ym: '2026-01', avgValue: 51.57, tenants: 2748 },
  { ym: '2026-02', avgValue: 46.97, tenants: 2774 },
  { ym: '2026-03', avgValue: 48.23, tenants: 2833 },
];

// user_data.talent_ml_interview_schedule_interview_team_events (xo_task_name = 'Schedule Interview Team')
export const SCHEDULE_INTERVIEW_TEAM_TIME: TimeSeries[] = [
  { ym: '2025-04', avgValue: 54.34, tenants: 628 },
  { ym: '2025-05', avgValue: 56.46, tenants: 624 },
  { ym: '2025-06', avgValue: 64.47, tenants: 617 },
  { ym: '2025-07', avgValue: 62.08, tenants: 607 },
  { ym: '2025-08', avgValue: 64.05, tenants: 600 },
  { ym: '2025-09', avgValue: 59.90, tenants: 607 },
  { ym: '2025-10', avgValue: 88.62, tenants: 606 },
  { ym: '2025-11', avgValue: 72.96, tenants: 599 },
  { ym: '2025-12', avgValue: 87.40, tenants: 599 },
  { ym: '2026-01', avgValue: 84.81, tenants: 600 },
  { ym: '2026-02', avgValue: 66.01, tenants: 596 },
  { ym: '2026-03', avgValue: 61.78, tenants: 591 },
];

// swh.bp_event_record_stats (task_name = 'Schedule Candidate Event')
export const SCHEDULE_CANDIDATE_EVENT_TIME: TimeSeries[] = [
  { ym: '2025-04', avgValue: 11.63, tenants: 44 },
  { ym: '2025-05', avgValue: 13.59, tenants: 43 },
  { ym: '2025-06', avgValue: 15.13, tenants: 42 },
  { ym: '2025-07', avgValue: 10.04, tenants: 51 },
  { ym: '2025-08', avgValue: 10.99, tenants: 51 },
  { ym: '2025-09', avgValue: 11.27, tenants: 50 },
  { ym: '2025-10', avgValue: 11.14, tenants: 54 },
  { ym: '2025-11', avgValue: 12.16, tenants: 56 },
  { ym: '2025-12', avgValue: 18.67, tenants: 50 },
  { ym: '2026-01', avgValue: 18.46, tenants: 53 },
  { ym: '2026-02', avgValue: 14.47, tenants: 54 },
  { ym: '2026-03', avgValue: 11.20, tenants: 55 },
];

// swh.bp_event_record_stats (task_name IN 'Rate Interview', 'Give Interview Feedback')
export const FEEDBACK_SUBMISSION_TIME: TimeSeries[] = [
  { ym: '2025-04', avgValue: 129.38, tenants: 2083 },
  { ym: '2025-05', avgValue: 130.29, tenants: 2116 },
  { ym: '2025-06', avgValue: 132.19, tenants: 2108 },
  { ym: '2025-07', avgValue: 130.12, tenants: 2164 },
  { ym: '2025-08', avgValue: 125.30, tenants: 2163 },
  { ym: '2025-09', avgValue: 129.26, tenants: 2181 },
  { ym: '2025-10', avgValue: 129.82, tenants: 2227 },
  { ym: '2025-11', avgValue: 133.95, tenants: 2183 },
  { ym: '2025-12', avgValue: 143.67, tenants: 2195 },
  { ym: '2026-01', avgValue: 153.81, tenants: 2238 },
  { ym: '2026-02', avgValue: 132.54, tenants: 2257 },
  { ym: '2026-03', avgValue: 131.78, tenants: 2340 },
];

// ─── Section 4: MISST Metrics ───

export interface MisstSeries {
  ym: string;
  avgSecondsPerReq: number;
  sessionsPerReq: number;
  tenants: number;
  nReqs: number;
}

// user_data.talent_ml_interview_misst_events (total per JR, outliers > 1h excluded)
export const MISST_MONTHLY: MisstSeries[] = [
  { ym: '2025-04', avgSecondsPerReq: 204.5, sessionsPerReq: 2.35, tenants: 698, nReqs: 43778 },
  { ym: '2025-05', avgSecondsPerReq: 188.5, sessionsPerReq: 2.18, tenants: 681, nReqs: 31993 },
  { ym: '2025-06', avgSecondsPerReq: 182.9, sessionsPerReq: 2.08, tenants: 699, nReqs: 32154 },
  { ym: '2025-07', avgSecondsPerReq: 182.8, sessionsPerReq: 2.13, tenants: 714, nReqs: 32908 },
  { ym: '2025-08', avgSecondsPerReq: 179.7, sessionsPerReq: 2.10, tenants: 705, nReqs: 30135 },
  { ym: '2025-09', avgSecondsPerReq: 170.5, sessionsPerReq: 2.06, tenants: 748, nReqs: 31792 },
  { ym: '2025-10', avgSecondsPerReq: 169.6, sessionsPerReq: 1.98, tenants: 718, nReqs: 32295 },
  { ym: '2025-11', avgSecondsPerReq: 175.4, sessionsPerReq: 1.98, tenants: 665, nReqs: 25840 },
  { ym: '2025-12', avgSecondsPerReq: 165.0, sessionsPerReq: 1.96, tenants: 633, nReqs: 26208 },
  { ym: '2026-01', avgSecondsPerReq: 182.1, sessionsPerReq: 2.01, tenants: 710, nReqs: 32091 },
  { ym: '2026-02', avgSecondsPerReq: 173.0, sessionsPerReq: 1.90, tenants: 686, nReqs: 32077 },
  { ym: '2026-03', avgSecondsPerReq: 135.3, sessionsPerReq: 1.48, tenants: 739, nReqs: 38332 },
];

// job_req_status_daily - snapshot: Apr-Jul 2025 (Aug truncated, excluded)
export const TIME_TO_FIRST_MISST_MONTHLY: TimeSeries[] = [
  { ym: '2025-04', avgValue: 18.5, tenants: 647 },
  { ym: '2025-05', avgValue: 17.7, tenants: 631 },
  { ym: '2025-06', avgValue: 15.1, tenants: 622 },
  { ym: '2025-07', avgValue: 10.4, tenants: 598 },
];

export const TIME_TO_FIRST_MISST = {
  avgDays: 16.6,
  tenants: 1037,
  nReqs: 109964,
};

export const TIME_TO_FIRST_INTERVIEW = {
  avgDays: 26.3,
  tenants: 3774,
};

// ─── Section 5: Capacity and Load Balance (full 12 months) ───

export interface CapacitySeries {
  ym: string;
  schedulersSIT: number;
  schedulersSCE: number;
  ratingsPerRater: number;
  raters: number;
  raterTenants: number;
  schedulerTenantsSIT: number;
  schedulerTenantsSCE: number;
}

// swh.bp_event_record_stats (schedulers) + user_data.talent_ml_interviewer_engagement (raters)
export const CAPACITY_MONTHLY: CapacitySeries[] = [
  { ym: '2025-04', schedulersSIT: 23973, schedulersSCE: 948, ratingsPerRater: 3.28, raters: 116268, raterTenants: 2093, schedulerTenantsSIT: 556, schedulerTenantsSCE: 44 },
  { ym: '2025-05', schedulersSIT: 24956, schedulersSCE: 1027, ratingsPerRater: 3.16, raters: 118287, raterTenants: 2126, schedulerTenantsSIT: 549, schedulerTenantsSCE: 44 },
  { ym: '2025-06', schedulersSIT: 24245, schedulersSCE: 1061, ratingsPerRater: 3.07, raters: 118216, raterTenants: 2115, schedulerTenantsSIT: 546, schedulerTenantsSCE: 43 },
  { ym: '2025-07', schedulersSIT: 24887, schedulersSCE: 1038, ratingsPerRater: 3.11, raters: 125631, raterTenants: 2168, schedulerTenantsSIT: 543, schedulerTenantsSCE: 51 },
  { ym: '2025-08', schedulersSIT: 25042, schedulersSCE: 1026, ratingsPerRater: 3.02, raters: 121525, raterTenants: 2164, schedulerTenantsSIT: 530, schedulerTenantsSCE: 51 },
  { ym: '2025-09', schedulersSIT: 25631, schedulersSCE: 1096, ratingsPerRater: 2.87, raters: 121764, raterTenants: 2175, schedulerTenantsSIT: 538, schedulerTenantsSCE: 51 },
  { ym: '2025-10', schedulersSIT: 25167, schedulersSCE: 1084, ratingsPerRater: 3.01, raters: 126747, raterTenants: 2232, schedulerTenantsSIT: 549, schedulerTenantsSCE: 55 },
  { ym: '2025-11', schedulersSIT: 21859, schedulersSCE: 946, ratingsPerRater: 2.82, raters: 114919, raterTenants: 2181, schedulerTenantsSIT: 524, schedulerTenantsSCE: 56 },
  { ym: '2025-12', schedulersSIT: 18915, schedulersSCE: 783, ratingsPerRater: 2.76, raters: 110692, raterTenants: 2200, schedulerTenantsSIT: 521, schedulerTenantsSCE: 51 },
  { ym: '2026-01', schedulersSIT: 19512, schedulersSCE: 841, ratingsPerRater: 2.87, raters: 108799, raterTenants: 2250, schedulerTenantsSIT: 527, schedulerTenantsSCE: 54 },
  { ym: '2026-02', schedulersSIT: 20232, schedulersSCE: 908, ratingsPerRater: 2.76, raters: 112098, raterTenants: 2260, schedulerTenantsSIT: 527, schedulerTenantsSCE: 54 },
  { ym: '2026-03', schedulersSIT: 22293, schedulersSCE: 988, ratingsPerRater: 2.83, raters: 121638, raterTenants: 2339, schedulerTenantsSIT: 533, schedulerTenantsSCE: 56 },
];

// ─── Computed summaries ───

function sumField(arr: MonthlySeries[]): number {
  return arr.reduce((s, d) => s + d.value, 0);
}
function avgField(arr: { avgValue: number }[]): number {
  return arr.reduce((s, d) => s + d.avgValue, 0) / arr.length;
}
function latestTenants(arr: { tenants: number }[]): number {
  return arr[arr.length - 1]?.tenants ?? 0;
}

export const VOLUME_TOTALS = {
  jobApplications: sumField(JOB_APPLICATIONS_MONTHLY),
  interviewRounds: sumField(INTERVIEW_ROUNDS_MONTHLY),
  interviewSessions: sumField(INTERVIEW_SESSIONS_MONTHLY),
  competencySessions: sumField(COMPETENCY_SESSIONS_MONTHLY),
  questionnaireSessions: sumField(QUESTIONNAIRE_SESSIONS_MONTHLY),
  totalRaters: RATERS_RATINGS_MONTHLY.reduce((s, d) => s + d.raters, 0),
  totalRatings: RATERS_RATINGS_MONTHLY.reduce((s, d) => s + d.ratings, 0),
};

export const HEADLINE_KPIS = {
  jobApplications: { total: VOLUME_TOTALS.jobApplications, tenants: latestTenants(JOB_APPLICATIONS_MONTHLY) },
  interviewRounds: { total: VOLUME_TOTALS.interviewRounds, tenants: latestTenants(INTERVIEW_ROUNDS_MONTHLY) },
  interviewSessions: { total: VOLUME_TOTALS.interviewSessions, tenants: latestTenants(INTERVIEW_SESSIONS_MONTHLY) },
  avgTimeInBP: { avg: Math.round(avgField(AVG_TIME_IN_INTERVIEW_BP.slice(0, 9)) * 100) / 100, tenants: latestTenants(AVG_TIME_IN_INTERVIEW_BP) },
};
