// Add Documents adoption correlation: Offer duration, EA duration, Time to Hire, Time to Fill
// Source: PCA feature adoption + dw.swh.bp_event_stats (PROD) + live TTH IUM 2358 (SANDBOX) + legacy TTF extract
// Generated 12 April 2026

export interface QueryMeta {
  title: string;
  subtitle: string;
  queryDate: string;
  source: string;
  filters: string;
  environment: string;
  dateRange: string;
}

export const QUERY_META: QueryMeta = {
  title: 'Add Documents Adoption: Impact on Offer, EA, TTH & TTF',
  subtitle:
    'Compares Add Documents adopters vs non-adopters using median deltas and Mann-Whitney U tests across Offer, EA, TTH, and legacy TTF outcomes.\nSources: PROD bp_event_stats for Offer and EA, SANDBOX IUM 2358 for TTH, and a historical SANDBOX TTF extract retained for reference.',
  queryDate: '12 April 2026',
  source:
    'PCA feature adoption (customer scorecard) + bp_event_stats PROD (Offer/EA) + live Average Time to Hire 2358 SANDBOX + legacy Time to Fill extract',
  filters:
    '534 Add Documents adopters vs 5,374 non-adopters from PCA. Offer: PROD, duration > 0, events >= 10. EA: PROD materialised. TTH: live SANDBOX IUM with value > 0. TTF: historical SANDBOX extract retained for reference.',
  environment: 'PROD (Offer, EA) / SANDBOX (TTH) / legacy SANDBOX extract (TTF)',
  dateRange: 'Rolling 12 months to April 2026',
};

export interface KPI {
  label: string;
  value: string;
  detail: string;
  tooltip?: string;
}

export const KPIS: KPI[] = [
  {
    label: 'Offer delta',
    value: '+0.67 d',
    detail: 'p < 0.001, small effect',
    tooltip: 'Median Offer completed duration: adopted 5.28 d vs not-adopted 4.61 d. Statistically significant but tiny effect (r = 0.12). PROD.',
  },
  {
    label: 'EA delta',
    value: '+0.10 d',
    detail: 'p = 0.87, no effect',
    tooltip: 'Median EA completed duration: adopted 1.54 d vs not-adopted 1.44 d. Not significant. PROD.',
  },
  {
    label: 'TTH delta',
    value: '+1.66 d',
    detail: 'p = 0.08, borderline',
    tooltip: 'Median time to hire: adopted 58.3 d vs not-adopted 56.7 d. Borderline (p = 0.08), tiny effect (r = 0.05). SANDBOX IUM 2358.',
  },
  {
    label: 'TTF delta',
    value: '+0.15 d',
    detail: 'p = 0.96, no effect',
    tooltip: 'Median time to fill: adopted 2.75 d vs not-adopted 2.60 d. Not significant. Uses the historical SANDBOX TTF extract based on the older 2359 mapping.',
  },
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
    finding:
      'Add Documents adoption has no meaningful association with any of the four recruiting outcome metrics.',
    evidence:
      'Across Offer duration, EA duration, TTH, and TTF, the largest observed delta is +1.66 days on TTH (p = 0.08, borderline, r = 0.05). Offer shows a statistically significant but trivially small +0.67 d (p < 0.001, r = 0.12). EA and TTF show effectively zero difference.',
    confidence: 'Medium',
    confidenceReason:
      'Large sample sizes (3,712 Offer tenants, 3,403 TTH tenants) provide strong statistical power. The consistent pattern across all four metrics - no practical effect - increases confidence in the null. Cross-sectional design limits causal inference.',
    recommendation:
      'Add Documents does not slow recruiting outcomes. The feature adds a document step which may marginally extend event-level Offer duration (+0.67 d), but this does not translate into longer time to hire or time to fill. Safe to promote Add Documents adoption without efficiency concerns.',
    caveats: [
      'Cross-sectional design: cannot prove causation, only association',
      'Offer/EA use PROD bp_event_stats; TTH uses a live SANDBOX IUM while TTF uses a historical SANDBOX extract (different environments and confidence levels)',
      'Confounders not controlled: company size, industry, region, process complexity, number of hiring steps',
      'Add Documents adopters may be systematically different from non-adopters (selection bias)',
      'TTF has extreme outliers (mean 50-97 d vs median 2.6-2.8 d) - heavily right-skewed; median is the reliable measure',
    ],
  },
  {
    finding:
      'The Offer +0.67 d signal is mechanistically expected and should not be interpreted as harmful.',
    evidence:
      'Add Documents introduces an additional document step into the Offer BP. A sub-day increase in event-level duration is the predictable cost of that step. Critically, this does NOT propagate to TTH (p = 0.08) or TTF (p = 0.96), meaning it is absorbed by the overall process.',
    confidence: 'Medium',
    confidenceReason:
      'Mechanistic reasoning is sound (more steps = slightly longer event). The TTH/TTF null results provide a natural placebo check confirming the Offer signal is contained.',
    recommendation:
      'Frame the Offer delta as a known, expected micro-cost offset by the business value of structured document collection. It does not impact the metrics customers and executives care about (TTH, TTF).',
    caveats: [
      'A causal pre/post panel study would strengthen this claim',
      'Industry-segmented analysis could reveal pockets where the effect differs',
    ],
  },
];

/* ── Full test results table ── */
export interface TestResult {
  metric: string;
  env: string;
  nAdopted: number;
  nNotAdopted: number;
  uStat: number;
  pValue: number;
  rankBiserialR: number;
  deltaMedianDays: number;
  deltaMeanDays: number;
  adoptedMedian: number;
  notAdoptedMedian: number;
  verdict: string;
}

export const TEST_RESULTS: TestResult[] = [
  {
    metric: 'Avg Time in Offer',
    env: 'PROD',
    nAdopted: 452,
    nNotAdopted: 3260,
    uStat: 824690,
    pValue: 0.000038,
    rankBiserialR: -0.1193,
    deltaMedianDays: 0.67,
    deltaMeanDays: 0.67,
    adoptedMedian: 5.28,
    notAdoptedMedian: 4.61,
    verdict: 'Significant (p < 0.001), small effect (|r| = 0.12)',
  },
  {
    metric: 'Avg Time in EA',
    env: 'PROD',
    nAdopted: 112,
    nNotAdopted: 685,
    uStat: 38740,
    pValue: 0.866389,
    rankBiserialR: -0.0099,
    deltaMedianDays: 0.10,
    deltaMeanDays: -0.19,
    adoptedMedian: 1.54,
    notAdoptedMedian: 1.44,
    verdict: 'Not significant (p = 0.87)',
  },
  {
    metric: 'Avg Time to Hire',
    env: 'SANDBOX',
    nAdopted: 419,
    nNotAdopted: 2984,
    uStat: 658016,
    pValue: 0.080947,
    rankBiserialR: -0.0526,
    deltaMedianDays: 1.66,
    deltaMeanDays: 4.69,
    adoptedMedian: 58.33,
    notAdoptedMedian: 56.67,
    verdict: 'Borderline (p = 0.08), trivial effect (|r| = 0.05)',
  },
  {
    metric: 'Avg Time to Fill',
    env: 'SANDBOX',
    nAdopted: 184,
    nNotAdopted: 797,
    uStat: 73518,
    pValue: 0.955293,
    rankBiserialR: -0.0026,
    deltaMedianDays: 0.15,
    deltaMeanDays: -46.89,
    adoptedMedian: 2.75,
    notAdoptedMedian: 2.60,
    verdict: 'Not significant (p = 0.96)',
  },
];

/* ── Percentile data for distribution charts ── */
export interface PercentileBox {
  label: string;
  n: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  mean: number;
}

export const OFFER_BOXES: PercentileBox[] = [
  { label: 'Adopted', n: 452, p10: 2.08, p25: 3.31, median: 5.28, p75: 8.68, p90: 14.14, mean: 7.55 },
  { label: 'Not adopted', n: 3260, p10: 1.67, p25: 2.71, median: 4.61, p75: 7.58, p90: 12.21, mean: 6.88 },
];

export const EA_BOXES: PercentileBox[] = [
  { label: 'Adopted', n: 112, p10: 0.05, p25: 0.21, median: 1.54, p75: 4.07, p90: 6.82, mean: 2.85 },
  { label: 'Not adopted', n: 685, p10: 0.04, p25: 0.19, median: 1.44, p75: 3.73, p90: 6.82, mean: 3.04 },
];

export const TTH_BOXES: PercentileBox[] = [
  { label: 'Adopted', n: 419, p10: 32.19, p25: 40.82, median: 58.33, p75: 82.63, p90: 113.76, mean: 75.77 },
  { label: 'Not adopted', n: 2984, p10: 31.61, p25: 38.94, median: 56.67, p75: 78.39, p90: 107.82, mean: 71.08 },
];

export const TTF_BOXES: PercentileBox[] = [
  { label: 'Adopted', n: 184, p10: 0.73, p25: 1.23, median: 2.75, p75: 9.83, p90: 52.28, mean: 50.40 },
  { label: 'Not adopted', n: 797, p10: 0.70, p25: 1.20, median: 2.60, p75: 10.40, p90: 57.20, mean: 97.29 },
];

/* ── Delta bar chart data ── */
export const DELTA_CHART = {
  labels: ['Offer (PROD)', 'EA (PROD)', 'TTH (SANDBOX)', 'TTF (legacy SANDBOX)'],
  deltaMedians: [0.67, 0.10, 1.66, 0.15],
  pValues: [0.000038, 0.866389, 0.080947, 0.955293],
  significant: [true, false, false, false],
};

/* ── Sample sizes ── */
export const ADOPTION_COUNTS = {
  totalTenants: 5908,
  addDocsAdopters: 534,
  nonAdopters: 5374,
  offerTenants: 3712,
  eaTenants: 797,
  tthTenants: 3403,
  ttfTenants: 981,
};
