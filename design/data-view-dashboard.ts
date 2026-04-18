import { TENANT_FILTER_METADATA } from './data-dashboard-tenant-filters';

export interface QueryMeta {
  title: string;
  subtitle: string;
  queryDate: string;
  source: string;
  filters: string;
  environment: string;
  dateRange: string;
  launchDate?: string;
}

export const QUERY_META: QueryMeta = {
  title: 'HRREC-81393: Agency Types Feature Impact',
  subtitle: 'Adoption and usage metrics for the new bulk Post to Agency Types feature',
  queryDate: '17 April 2026',
  source: 'Pharos (dw.swh_raw.oms_requests)',
  filters: 'task_display_name = "Post Job", read_or_update = "U"',
  environment: 'PROD',
  dateRange: '20 Sep 2025 (launch) to 12 Apr 2026',
  launchDate: '20 September 2025',
};

export interface KPI {
  label: string;
  value: string;
  detail: string;
}

export const KPIS: KPI[] = [
  { label: 'Adoption Share', value: '1.10%', detail: 'Of all Post Job submissions (16 Apr)' },
  { label: 'Tenant Penetration', value: '11.13%', detail: 'Of all active Post Job tenants (16 Apr)' },
  { label: 'Agency-Touch NEW Share', value: '54.3%', detail: 'NEW vs NEW+OLD among flows with agency types (16 Apr)' },
  { label: 'Daily Submissions', value: '~1,400', detail: 'Using bulk Agency Types feature' },
  { label: 'Menu Migration', value: '26.6%', detail: 'New path vs legacy drill-down (16 Apr)' },
];

export interface Insight {
  finding: string;
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  recommendation: string;
  caveats: string[];
}

export const INSIGHTS: Insight[] = [
  {
    finding: 'Feature has reached steady-state adoption across ~11% of active tenants',
    evidence: 'Tenant penetration remained stable between March 18 (11.41%) and April 16 (11.13%), with ~365 tenants actively using the feature.',
    confidence: 'High',
    confidenceReason: 'Based on definitive OMS payload parsing for the combined prompt workset.',
    recommendation: 'Consider the feature successfully launched. Focus next on qualitative feedback to see if the bulk selection is meeting efficiency expectations.',
    caveats: ['Weekly Saturday samples; weekday spot-checks can differ from sampled volumes.'],
  },
  {
    finding: 'Legacy "Agency by Type" menu remains the dominant discovery path',
    evidence: 'Menu migration is at 26.6% (April 16), meaning recruiters still open the old drill-down menu ~3x more often than the new bulk types menu.',
    confidence: 'Medium',
    confidenceReason: 'Based on getReferencePrompt navigation events, which are a proxy for intent but not final submission.',
    recommendation: 'Evaluate if the old menu should be deprecated or if UI nudges are needed to guide users to the more efficient bulk path.',
    caveats: ['Navigation events do not guarantee the user actually selected an agency from that menu.'],
  },
  {
    finding: 'Among Post Job flows that touch agency types, the NEW bulk path accounts for a narrow majority of submissions',
    evidence: 'On 16 April 2026, 1,409 NEW vs 1,188 OLD-path submissions among rows with `15604$` in the payload; share NEW / (NEW + OLD) is 54.3%. 365 of 367 agency-touching tenants used the NEW path that day.',
    confidence: 'High',
    confidenceReason: 'Same partition filters as Metric A/B verification; single-day PROD slice.',
    recommendation: 'Use this denominator when discussing behaviour among customers who actually distribute via agency types, not overall Post Job volume.',
    caveats: ['Single day; Tuesday 15 Apr 2026 showed 1,252 NEW submissions (363 tenants), so Saturday samples are useful for trends but not peak daily volume.'],
  },
  {
    finding: 'IUM associations are statistically detectable but not causal',
    evidence: 'February 2026 SANDBOX IUM (`wd_event_date` in Feb 2026; warehouse `year`/`month` can lag calendar): Mann-Whitney U vs tenants not in `tenant-agency-types-usage.csv` - Avg Time to Hire (2358) adopters median 64.8 d vs non-adopters 57.7 d (p=2.77e-5); Recruiter Productivity / Capacity (2361) adopters median 16.7 vs 13.2 (p=1.37e-12).',
    confidence: 'Low',
    confidenceReason: 'Observational; adopters are not a randomised cohort; general TTH is a weak proxy for agency-posting efficiency.',
    recommendation: 'Treat as hypothesis-generating only until HRREC-89061 (or equivalent) exposes agency-scoped outcomes.',
    caveats: ['Two hypothesis tests: apply multiple-testing judgement; rank-biserial r about -0.13 (2358) and -0.20 (2361).'],
  },
];

/** Weekly sample dates (Saturdays) from launch; aligns with `hrrec-81393-agency-menu-daily-metrics.csv`. */
export const WEEKLY_LABELS = [
  '20 Sep', '27 Sep', '4 Oct', '11 Oct', '18 Oct', '25 Oct',
  '1 Nov', '8 Nov', '15 Nov', '22 Nov', '29 Nov',
  '6 Dec', '13 Dec', '20 Dec', '27 Dec',
  '3 Jan', '10 Jan', '17 Jan', '24 Jan', '31 Jan',
  '7 Feb', '14 Feb', '21 Feb', '28 Feb',
  '7 Mar', '14 Mar', '21 Mar', '28 Mar',
  '4 Apr', '11 Apr',
] as const;

export const ADOPTION_SHARE_DATA = {
  labels: [...WEEKLY_LABELS],
  datasets: [
    {
      label: 'Adoption Share (%)',
      data: [
        0.203, 0.82, 0.588, 1.027, 0.554, 1.295, 0.447, 0.896, 0.592, 0.951, 0.948, 0.995, 0.832,
        1.001, 0.4, 0.188, 0.54, 0.507, 0.834, 0.626, 0.594, 0.354, 0.758, 0.478, 0.372, 0.331,
        0.776, 0.723, 1.536, 0.627,
      ],
      borderColor: 'rgba(8, 117, 225, 1)',
      backgroundColor: 'rgba(8, 117, 225, 0.12)',
      fill: true,
      tension: 0.3,
    },
  ],
};

export const TENANT_PENETRATION_DATA = {
  labels: [...WEEKLY_LABELS],
  datasets: [
    {
      label: 'Tenant Penetration (%)',
      data: [
        1.689, 3.784, 3.303, 4.663, 2.303, 3.525, 3.213, 4.808, 2.951, 3.657, 4.144, 3.172, 2.636,
        3.624, 3.115, 2.022, 3.328, 2.841, 3.046, 3.351, 4.457, 2.201, 3.009, 3.412, 2.335, 2.653,
        3.357, 3.47, 3.113, 3.344,
      ],
      borderColor: 'rgba(23, 193, 152, 1)',
      backgroundColor: 'rgba(23, 193, 152, 0.12)',
      fill: true,
      tension: 0.3,
    },
  ],
};

export const MENU_MIGRATION_DATA = {
  labels: [...WEEKLY_LABELS],
  datasets: [
    {
      label: 'NEW menu opens (Agency Types)',
      data: [9, 3, 8, 8, 12, 7, 2, 2, 8, 2, 5, 4, 2, 5, 6, 4, 4, 0, 4, 6, 4, 1, 5, 4, 3, 1, 6, 7, 3, 5],
      borderColor: 'rgba(8, 117, 225, 1)',
      backgroundColor: 'rgba(8, 117, 225, 0.08)',
      fill: false,
      tension: 0.3,
    },
    {
      label: 'OLD menu opens (Agency by Type)',
      data: [19, 7, 12, 5, 14, 11, 2, 8, 4, 3, 7, 15, 3, 2, 5, 6, 7, 3, 5, 8, 6, 4, 9, 7, 6, 12, 4, 7, 6, 7],
      borderColor: 'rgba(205, 211, 217, 1)',
      backgroundColor: 'rgba(205, 211, 217, 0.08)',
      fill: false,
      tension: 0.3,
    },
  ],
};

export const SUBMISSIONS_TREND_DATA = {
  labels: [...WEEKLY_LABELS],
  datasets: [
    {
      label: 'NEW Agency Types Submissions',
      data: [18, 64, 49, 81, 42, 100, 29, 78, 45, 69, 42, 64, 52, 68, 17, 10, 43, 40, 69, 54, 53, 28, 65, 44, 33, 23, 53, 56, 101, 43],
      borderColor: 'rgba(8, 117, 225, 1)',
      backgroundColor: 'rgba(8, 117, 225, 0.1)',
      fill: true,
      tension: 0.3,
    },
  ],
};

export const CUMULATIVE_TENANTS_DATA = {
  labels: [...WEEKLY_LABELS],
  datasets: [
    {
      label: 'Cumulative Unique Tenants',
      data: [9, 27, 39, 56, 61, 68, 74, 89, 100, 108, 112, 117, 123, 134, 137, 138, 148, 153, 161, 170, 182, 186, 193, 201, 205, 213, 215, 222, 226, 233],
      borderColor: 'rgba(23, 193, 152, 1)',
      backgroundColor: 'rgba(23, 193, 152, 0.1)',
      fill: true,
      tension: 0.3,
    },
  ],
};

export interface TenantUsage {
  tenant: string;
  mar_18: number;
  apr_16: number;
  total: number;
}

export const TENANT_USAGE_DATA: TenantUsage[] = [
  {
    "tenant": "rakuten",
    "mar_18": 10,
    "apr_16": 90,
    "total": 100
  },
  {
    "tenant": "barclays",
    "mar_18": 50,
    "apr_16": 34,
    "total": 84
  },
  {
    "tenant": "pwc",
    "mar_18": 28,
    "apr_16": 37,
    "total": 65
  },
  {
    "tenant": "broadridge",
    "mar_18": 56,
    "apr_16": 6,
    "total": 62
  },
  {
    "tenant": "micron",
    "mar_18": 23,
    "apr_16": 39,
    "total": 62
  },
  {
    "tenant": "dentsuaegis",
    "mar_18": 27,
    "apr_16": 30,
    "total": 57
  },
  {
    "tenant": "slihrms",
    "mar_18": 33,
    "apr_16": 23,
    "total": 56
  },
  {
    "tenant": "goldbeck",
    "mar_18": 30,
    "apr_16": 22,
    "total": 52
  },
  {
    "tenant": "mango",
    "mar_18": 30,
    "apr_16": 21,
    "total": 51
  },
  {
    "tenant": "fenwick",
    "mar_18": 21,
    "apr_16": 19,
    "total": 40
  },
  {
    "tenant": "accenture",
    "mar_18": 18,
    "apr_16": 17,
    "total": 35
  },
  {
    "tenant": "cc",
    "mar_18": 1,
    "apr_16": 30,
    "total": 31
  },
  {
    "tenant": "abbott",
    "mar_18": 16,
    "apr_16": 13,
    "total": 29
  },
  {
    "tenant": "wf",
    "mar_18": 15,
    "apr_16": 14,
    "total": 29
  },
  {
    "tenant": "gtlaw",
    "mar_18": 20,
    "apr_16": 8,
    "total": 28
  },
  {
    "tenant": "ag",
    "mar_18": 14,
    "apr_16": 12,
    "total": 26
  },
  {
    "tenant": "vca",
    "mar_18": 13,
    "apr_16": 13,
    "total": 26
  },
  {
    "tenant": "kiongroup",
    "mar_18": 12,
    "apr_16": 11,
    "total": 23
  },
  {
    "tenant": "sanofi",
    "mar_18": 15,
    "apr_16": 8,
    "total": 23
  },
  {
    "tenant": "dyson",
    "mar_18": 18,
    "apr_16": 4,
    "total": 22
  },
  {
    "tenant": "dlapiper",
    "mar_18": 13,
    "apr_16": 8,
    "total": 21
  },
  {
    "tenant": "cnx",
    "mar_18": 12,
    "apr_16": 8,
    "total": 20
  },
  {
    "tenant": "hitachi",
    "mar_18": 13,
    "apr_16": 7,
    "total": 20
  },
  {
    "tenant": "whitecase",
    "mar_18": 12,
    "apr_16": 8,
    "total": 20
  },
  {
    "tenant": "lilly",
    "mar_18": 14,
    "apr_16": 5,
    "total": 19
  },
  {
    "tenant": "wvumedicine",
    "mar_18": 12,
    "apr_16": 7,
    "total": 19
  },
  {
    "tenant": "bdouk",
    "mar_18": 4,
    "apr_16": 14,
    "total": 18
  },
  {
    "tenant": "evonik",
    "mar_18": 11,
    "apr_16": 7,
    "total": 18
  },
  {
    "tenant": "synnex",
    "mar_18": 2,
    "apr_16": 16,
    "total": 18
  },
  {
    "tenant": "chamberlain",
    "mar_18": 12,
    "apr_16": 5,
    "total": 17
  },
  {
    "tenant": "markelcorp",
    "mar_18": 12,
    "apr_16": 5,
    "total": 17
  },
  {
    "tenant": "dbs",
    "mar_18": 0,
    "apr_16": 16,
    "total": 16
  },
  {
    "tenant": "sagility",
    "mar_18": 6,
    "apr_16": 10,
    "total": 16
  },
  {
    "tenant": "db",
    "mar_18": 2,
    "apr_16": 13,
    "total": 15
  },
  {
    "tenant": "onedigital",
    "mar_18": 10,
    "apr_16": 5,
    "total": 15
  },
  {
    "tenant": "synchronyfinancial",
    "mar_18": 4,
    "apr_16": 11,
    "total": 15
  },
  {
    "tenant": "medtronic",
    "mar_18": 5,
    "apr_16": 9,
    "total": 14
  },
  {
    "tenant": "regeneron",
    "mar_18": 6,
    "apr_16": 8,
    "total": 14
  },
  {
    "tenant": "aia",
    "mar_18": 5,
    "apr_16": 8,
    "total": 13
  },
  {
    "tenant": "astrazeneca",
    "mar_18": 5,
    "apr_16": 8,
    "total": 13
  },
  {
    "tenant": "europcar",
    "mar_18": 12,
    "apr_16": 1,
    "total": 13
  },
  {
    "tenant": "nebraskamed",
    "mar_18": 7,
    "apr_16": 6,
    "total": 13
  },
  {
    "tenant": "stryker",
    "mar_18": 10,
    "apr_16": 3,
    "total": 13
  },
  {
    "tenant": "thegymgroup",
    "mar_18": 8,
    "apr_16": 5,
    "total": 13
  },
  {
    "tenant": "ayvens",
    "mar_18": 9,
    "apr_16": 3,
    "total": 12
  },
  {
    "tenant": "bdx",
    "mar_18": 5,
    "apr_16": 7,
    "total": 12
  },
  {
    "tenant": "fmr",
    "mar_18": 4,
    "apr_16": 8,
    "total": 12
  },
  {
    "tenant": "herbertsmithfreehills",
    "mar_18": 7,
    "apr_16": 5,
    "total": 12
  },
  {
    "tenant": "ms",
    "mar_18": 5,
    "apr_16": 7,
    "total": 12
  },
  {
    "tenant": "tp",
    "mar_18": 1,
    "apr_16": 11,
    "total": 12
  },
  {
    "tenant": "a1group",
    "mar_18": 6,
    "apr_16": 5,
    "total": 11
  },
  {
    "tenant": "brookfield",
    "mar_18": 2,
    "apr_16": 9,
    "total": 11
  },
  {
    "tenant": "danaher",
    "mar_18": 6,
    "apr_16": 5,
    "total": 11
  },
  {
    "tenant": "fis",
    "mar_18": 0,
    "apr_16": 11,
    "total": 11
  },
  {
    "tenant": "hyperiongrp",
    "mar_18": 9,
    "apr_16": 2,
    "total": 11
  },
  {
    "tenant": "jj",
    "mar_18": 3,
    "apr_16": 8,
    "total": 11
  },
  {
    "tenant": "kansashealthsystem",
    "mar_18": 1,
    "apr_16": 10,
    "total": 11
  },
  {
    "tenant": "powerdesigninc",
    "mar_18": 3,
    "apr_16": 8,
    "total": 11
  },
  {
    "tenant": "zebra",
    "mar_18": 0,
    "apr_16": 11,
    "total": 11
  },
  {
    "tenant": "zoll",
    "mar_18": 3,
    "apr_16": 8,
    "total": 11
  },
  {
    "tenant": "harman",
    "mar_18": 10,
    "apr_16": 0,
    "total": 10
  },
  {
    "tenant": "hpe",
    "mar_18": 9,
    "apr_16": 1,
    "total": 10
  },
  {
    "tenant": "ing",
    "mar_18": 9,
    "apr_16": 1,
    "total": 10
  },
  {
    "tenant": "manulife",
    "mar_18": 4,
    "apr_16": 6,
    "total": 10
  },
  {
    "tenant": "adient",
    "mar_18": 4,
    "apr_16": 5,
    "total": 9
  },
  {
    "tenant": "cai",
    "mar_18": 4,
    "apr_16": 5,
    "total": 9
  },
  {
    "tenant": "cmno",
    "mar_18": 0,
    "apr_16": 9,
    "total": 9
  },
  {
    "tenant": "fil",
    "mar_18": 3,
    "apr_16": 6,
    "total": 9
  },
  {
    "tenant": "guidehouse",
    "mar_18": 1,
    "apr_16": 8,
    "total": 9
  },
  {
    "tenant": "taskus",
    "mar_18": 1,
    "apr_16": 8,
    "total": 9
  },
  {
    "tenant": "thermofisher",
    "mar_18": 2,
    "apr_16": 7,
    "total": 9
  },
  {
    "tenant": "tsys",
    "mar_18": 4,
    "apr_16": 5,
    "total": 9
  },
  {
    "tenant": "awg",
    "mar_18": 3,
    "apr_16": 5,
    "total": 8
  },
  {
    "tenant": "chevron",
    "mar_18": 1,
    "apr_16": 7,
    "total": 8
  },
  {
    "tenant": "dell",
    "mar_18": 3,
    "apr_16": 5,
    "total": 8
  },
  {
    "tenant": "genmab",
    "mar_18": 5,
    "apr_16": 3,
    "total": 8
  },
  {
    "tenant": "heijmans",
    "mar_18": 6,
    "apr_16": 2,
    "total": 8
  },
  {
    "tenant": "jll",
    "mar_18": 6,
    "apr_16": 2,
    "total": 8
  },
  {
    "tenant": "mbda",
    "mar_18": 2,
    "apr_16": 6,
    "total": 8
  },
  {
    "tenant": "moog",
    "mar_18": 5,
    "apr_16": 3,
    "total": 8
  },
  {
    "tenant": "oaktree",
    "mar_18": 1,
    "apr_16": 7,
    "total": 8
  },
  {
    "tenant": "ocbc",
    "mar_18": 6,
    "apr_16": 2,
    "total": 8
  },
  {
    "tenant": "rgare",
    "mar_18": 5,
    "apr_16": 3,
    "total": 8
  },
  {
    "tenant": "sedgwick",
    "mar_18": 0,
    "apr_16": 8,
    "total": 8
  },
  {
    "tenant": "sunlife",
    "mar_18": 4,
    "apr_16": 4,
    "total": 8
  },
  {
    "tenant": "virbac",
    "mar_18": 1,
    "apr_16": 7,
    "total": 8
  },
  {
    "tenant": "amgen",
    "mar_18": 4,
    "apr_16": 3,
    "total": 7
  },
  {
    "tenant": "coorstek",
    "mar_18": 0,
    "apr_16": 7,
    "total": 7
  },
  {
    "tenant": "hhmi",
    "mar_18": 3,
    "apr_16": 4,
    "total": 7
  },
  {
    "tenant": "jabil",
    "mar_18": 1,
    "apr_16": 6,
    "total": 7
  },
  {
    "tenant": "lbg",
    "mar_18": 3,
    "apr_16": 4,
    "total": 7
  },
  {
    "tenant": "mgpru",
    "mar_18": 4,
    "apr_16": 3,
    "total": 7
  },
  {
    "tenant": "mizuho",
    "mar_18": 0,
    "apr_16": 7,
    "total": 7
  },
  {
    "tenant": "mufgub",
    "mar_18": 7,
    "apr_16": 0,
    "total": 7
  },
  {
    "tenant": "nb",
    "mar_18": 2,
    "apr_16": 5,
    "total": 7
  },
  {
    "tenant": "schreiberfoods",
    "mar_18": 0,
    "apr_16": 7,
    "total": 7
  },
  {
    "tenant": "theocc",
    "mar_18": 3,
    "apr_16": 4,
    "total": 7
  },
  {
    "tenant": "ultra",
    "mar_18": 5,
    "apr_16": 2,
    "total": 7
  },
  {
    "tenant": "usyd",
    "mar_18": 2,
    "apr_16": 5,
    "total": 7
  },
  {
    "tenant": "abb",
    "mar_18": 3,
    "apr_16": 3,
    "total": 6
  },
  {
    "tenant": "alfalaval",
    "mar_18": 1,
    "apr_16": 5,
    "total": 6
  },
  {
    "tenant": "allstate",
    "mar_18": 1,
    "apr_16": 5,
    "total": 6
  },
  {
    "tenant": "aresmgmt",
    "mar_18": 4,
    "apr_16": 2,
    "total": 6
  },
  {
    "tenant": "finastra",
    "mar_18": 6,
    "apr_16": 0,
    "total": 6
  },
  {
    "tenant": "geisinger",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "golubcapital",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "guardianlife",
    "mar_18": 1,
    "apr_16": 5,
    "total": 6
  },
  {
    "tenant": "masco",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "mlp",
    "mar_18": 3,
    "apr_16": 3,
    "total": 6
  },
  {
    "tenant": "moelis",
    "mar_18": 3,
    "apr_16": 3,
    "total": 6
  },
  {
    "tenant": "mourant",
    "mar_18": 4,
    "apr_16": 2,
    "total": 6
  },
  {
    "tenant": "perkinscoie",
    "mar_18": 6,
    "apr_16": 0,
    "total": 6
  },
  {
    "tenant": "prudential",
    "mar_18": 2,
    "apr_16": 4,
    "total": 6
  },
  {
    "tenant": "qualcomm",
    "mar_18": 2,
    "apr_16": 4,
    "total": 6
  },
  {
    "tenant": "rbc",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "relx",
    "mar_18": 3,
    "apr_16": 3,
    "total": 6
  },
  {
    "tenant": "ssctech",
    "mar_18": 0,
    "apr_16": 6,
    "total": 6
  },
  {
    "tenant": "tjx",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "ummh",
    "mar_18": 5,
    "apr_16": 1,
    "total": 6
  },
  {
    "tenant": "wk",
    "mar_18": 4,
    "apr_16": 2,
    "total": 6
  },
  {
    "tenant": "adec",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "amadeus",
    "mar_18": 2,
    "apr_16": 3,
    "total": 5
  },
  {
    "tenant": "cityofkent",
    "mar_18": 1,
    "apr_16": 4,
    "total": 5
  },
  {
    "tenant": "coke",
    "mar_18": 5,
    "apr_16": 0,
    "total": 5
  },
  {
    "tenant": "cubic",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "davidlloyd",
    "mar_18": 4,
    "apr_16": 1,
    "total": 5
  },
  {
    "tenant": "deepwater",
    "mar_18": 5,
    "apr_16": 0,
    "total": 5
  },
  {
    "tenant": "dollartree",
    "mar_18": 4,
    "apr_16": 1,
    "total": 5
  },
  {
    "tenant": "flir",
    "mar_18": 2,
    "apr_16": 3,
    "total": 5
  },
  {
    "tenant": "freseniusmedicalcare",
    "mar_18": 2,
    "apr_16": 3,
    "total": 5
  },
  {
    "tenant": "gdit",
    "mar_18": 3,
    "apr_16": 2,
    "total": 5
  },
  {
    "tenant": "gilead",
    "mar_18": 4,
    "apr_16": 1,
    "total": 5
  },
  {
    "tenant": "htsc",
    "mar_18": 1,
    "apr_16": 4,
    "total": 5
  },
  {
    "tenant": "kainos",
    "mar_18": 5,
    "apr_16": 0,
    "total": 5
  },
  {
    "tenant": "kimcorealty",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "liantis",
    "mar_18": 2,
    "apr_16": 3,
    "total": 5
  },
  {
    "tenant": "nandos",
    "mar_18": 1,
    "apr_16": 4,
    "total": 5
  },
  {
    "tenant": "nrf",
    "mar_18": 2,
    "apr_16": 3,
    "total": 5
  },
  {
    "tenant": "ontic",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "slrconsulting",
    "mar_18": 5,
    "apr_16": 0,
    "total": 5
  },
  {
    "tenant": "ssmh",
    "mar_18": 3,
    "apr_16": 2,
    "total": 5
  },
  {
    "tenant": "sunrise",
    "mar_18": 5,
    "apr_16": 0,
    "total": 5
  },
  {
    "tenant": "tranetechnologies",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "transmedics",
    "mar_18": 0,
    "apr_16": 5,
    "total": 5
  },
  {
    "tenant": "vanguard",
    "mar_18": 3,
    "apr_16": 2,
    "total": 5
  },
  {
    "tenant": "allens",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "analogdevices",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "axos",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "broadcom",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "cgm",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "citi",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "citicclsa",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "comfortsystemsusa",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "cooley",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "creationtech",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "crossvue",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "csl",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "ctp",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "draftkings",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "drivenbrands",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "eosenergystorage",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "exactsciences",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "fhlbc",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "freseniusglobal",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "gnw",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "harbourvest",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "icon",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "iqvia",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "kyndryl",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "linklaters",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "livenation",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "lonza",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "mmc",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "multicare",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "mydentist",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "nclh",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "nib",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "peopleservices",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "qbe",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "recar",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "repsol",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "richemont",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "southernwater",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "swisslife",
    "mar_18": 2,
    "apr_16": 2,
    "total": 4
  },
  {
    "tenant": "trendmicro",
    "mar_18": 0,
    "apr_16": 4,
    "total": 4
  },
  {
    "tenant": "ukgrantt",
    "mar_18": 4,
    "apr_16": 0,
    "total": 4
  },
  {
    "tenant": "westlake",
    "mar_18": 1,
    "apr_16": 3,
    "total": 4
  },
  {
    "tenant": "wexinc",
    "mar_18": 3,
    "apr_16": 1,
    "total": 4
  },
  {
    "tenant": "aeso",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "agilent",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "archgroup",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "asml",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "aztecgroup",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "ballardspahr",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "bbinsurance",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "beca",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "blackrock",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "canarywharf",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "capita",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "centrica",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "ciena",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "circlek",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "cognex",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "collectorsuniverse",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "convatec",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "daewoong",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "dsvgruppe",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "dxctechnology",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "edftrading",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "ffive",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "franklintempleton",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "globusmedical",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "gsknch",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "harriscomputer",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "hl",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "hoganlovells",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "insulet",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "jci",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "kbr",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "kering",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "lindtspruengli",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "logitech",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "magna",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "microchiphr",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "mksinst",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "oneoncology",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "otis",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "paloaltonetworks",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "paulhastings",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "pernodricard",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "qtsdatacenters",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "r1rcm",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "rivhs",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "rothschildandco",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "santander",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "shimano",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "spgi",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "stagecoach",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "thomsonreuters",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "tiaa",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "tmhcc",
    "mar_18": 1,
    "apr_16": 2,
    "total": 3
  },
  {
    "tenant": "trimedx",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "trumpf",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "tvh",
    "mar_18": 2,
    "apr_16": 1,
    "total": 3
  },
  {
    "tenant": "unum",
    "mar_18": 0,
    "apr_16": 3,
    "total": 3
  },
  {
    "tenant": "wellstar",
    "mar_18": 3,
    "apr_16": 0,
    "total": 3
  },
  {
    "tenant": "aamc",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "aig",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "airproducts",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "alight",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "alliance",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "alliancedata",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "amn",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "antaresunderwriting",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "arcticwolf",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "athene",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "austalusa",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "aviva",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "axiscapital",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "baincapital",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "baird",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "bakerhughes",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "bdoau",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "bronsonhg",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "cancerresearchuk",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "claytonutz",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "clydeco",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "csgi",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "danafarber",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "dentalcorp",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "dexus",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "edwards",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "eisai",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "eisneramper",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "empower",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "encore",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "enzazaden",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "finning",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "firstam",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "fiserv",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "flcancer",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "fox",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "freshfields",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "gamrentals",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "gevernova",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "glencorecorp",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "guggenheiminvestment",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "hamilton",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "hargreaveslansdown",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "hedgeserv",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "hoopp",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "ia",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "iaggbs",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "icf",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "icg",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "ideayabio",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "ig",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "insmed",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "ipsen",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "juliusbaer",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "kla",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "kwm",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "leidos",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "leonardocompany",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "lloyds",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "marshall",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "massgeneralbrigham",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "morningstar",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "nelnet",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "nngroup",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "novozymes",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "ntrs",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "omnionpower",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "onetp",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "oshkoshcorporation",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "outsystems",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "perpetual",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "pluralsight",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "pretiumenterpriseservices",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "prologis",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "proofpoint",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "quantiphi",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "renre",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "rollsroyce",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "rollsroycesmr",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "sarepta",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "sartorius",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "sec",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "spw",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "symbotic",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "td",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "toyotaau",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "transunion",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "travelers",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "ts",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "vhr_otsuka",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "viatris",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "walmart",
    "mar_18": 1,
    "apr_16": 1,
    "total": 2
  },
  {
    "tenant": "wellcome",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "wfscorp",
    "mar_18": 0,
    "apr_16": 2,
    "total": 2
  },
  {
    "tenant": "zeissgroup",
    "mar_18": 2,
    "apr_16": 0,
    "total": 2
  },
  {
    "tenant": "aaamidatlantic",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "aampower",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "acciona",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "agrana",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "agreenspace",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "altasciences",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "altusgroup",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "antares",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "apa",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "argenx",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "arrow",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "asx",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "barrywehmiller",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "baxter",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "beigene",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "bishopfleming",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "blackstone",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "blattner",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "bmo",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "boeing",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "bpinternational",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "brooksauto",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "bupa",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "burnesspaull",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "cabotcorp",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "carrier",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "catalent",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "cba",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "cisco",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "claires",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "clarionhg",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "cmegroup",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "conagrabrands",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "confluentmedical",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "conocophillips",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "coverys",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "covestro",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "cox",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "datev",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "dfwairport",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "dimensional",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "domesticandgeneral",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "dssmith",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "electrolux",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "elekta",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "epsa",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "equiniti",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "equinix",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "essentiahealth",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "everestre",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "fca",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "fei",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "firstcentral",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "flutterbe",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "formulaone",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "freddiemac",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "fwd",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "geaerospace",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "gehc",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "gellerco",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "ghr",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "goldentree",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "graco",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "gresearch",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "greystar",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "grosvenor",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "gsk",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "gtsgbu",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "guggenheim",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "guidestone",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "gunder",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "hastingsdirect",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "hcahealthcare",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "healthcare",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "healthfirst",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "hkex",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "hub24management",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "huron",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "illumina",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "irobot",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "jainglobal",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "jd",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "just",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "kar",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "kardex",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "kcura",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "kenvue",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "levistraussandco",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "lgt",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "lgtcp",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "littelfuse",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "madrigalpharma",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "marketplaces",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "medivet",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "melittagroup",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "metabo",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "methode",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "modernatx",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "montefiore",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "morganlewis",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "mpc",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "msd",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "mymoose",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "myview",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "nab",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "ncr",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "nghs",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "northmark",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "novartis",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "nutraceutical",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "oclc",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "omers",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "organon",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "orthoclinical",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "osv_cci",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "pacificlife",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "pag",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "paypal",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "pbk",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "pewtrusts",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "phcgroup",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "philips",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "plexus",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "ppg",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "propharmagroup",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "prysmiangroup",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "quilter",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "qvc",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "racetrac",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "railpen",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "rb",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "rbnz",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "rbs",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "recoveryfocus",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "renishaw",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "resmed",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "roche",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "rockwellautomation",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "rockwoolgroup",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "rrhs",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "ryancompanies",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "ryansg",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "saica",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "saxobank",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "seatrium",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "sentara",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "sierraspace",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "simedarby",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "skechers",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "sky",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "sleepnumber",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "smithfieldfoods",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "smithnephew",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "sparke",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "spectris",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "spectrumcontrol",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "stevenstransport",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "talkingrain",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "telpark",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "tera",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "terex",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "thales",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "theclearinghouse",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "tokiomarinekiln",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "transamerica",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "tricentis",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "tritonpartners",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "uobgroup",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "upp",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "valmont",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "vanderlande",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "ventas",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "veoliauki",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "vhr_unither",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "vishay",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "vst",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "wattswater",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "websteronline",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "westernalliancebank",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "westpacnz",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "wfp",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  },
  {
    "tenant": "wintrust",
    "mar_18": 0,
    "apr_16": 1,
    "total": 1
  },
  {
    "tenant": "xylem",
    "mar_18": 1,
    "apr_16": 0,
    "total": 1
  }
];
