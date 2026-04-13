import React, { useMemo, useState, useCallback } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard, FormSelect, DashboardGlobalNav } from './components';
import { BottleneckFlowStrip, stagesFromSubBpsLatestMonth } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { getSliceSubBpsAndHeadline } from './data-bp-durations-by-segment';
import { LABELS } from './data-bp-shared';
import {
  SCORECARD_RECRUITER_CAPACITY_BY_TENANT,
  SCORECARD_RECRUITER_CAPACITY_YYYY_MM,
} from './data-scorecard-recruiter-capacity';
import {
  SCORECARD_SOURCE,
  ALL_RECRUITING_FEATURES,
  FEATURE_CORRELATIONS_GLOBAL,
  SCORECARD_TENANT_NAMES,
  SCORECARD_BY_TENANT,
  TENANT_DATA_SCIENTIST_INSIGHTS,
  TENANT_ENRICHMENT,
  REGION_OPTIONS,
  INDUSTRY_OPTIONS,
  getTenantScorecard,
  getTenantInsight,
  getTenantEnrichment,
  getTenantPeerBenchmarkInsight,
  getTenantDisplayName,
  type FeatureCorrelationStat,
} from './data-customer-scorecard';

function fmtDays(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return '-';
  const rounded = Math.round(v * 10) / 10;
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
}

function tenantFromSearch(): string {
  try {
    const raw = new URLSearchParams(window.location.search).get('tenant');
    if (!raw) return '';
    const decoded = raw.trim();
    return SCORECARD_TENANT_NAMES.includes(decoded) ? decoded : '';
  } catch {
    return '';
  }
}

const listCard: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
  backgroundColor: colors.frenchVanilla100,
};

const BOTTLENECK_STRIP_HELP =
  'Segment width = median completed-event duration in days for each sub-BP from dw.swh.bp_event_stats. Stages follow job-application flow; Employment Agreement is placed immediately after Offer.';

const bulletList = (items: string[]): React.ReactNode =>
  items.length === 0 ? null : (
    <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper600, fontSize: 14, lineHeight: 1.6 }}>
      {items.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  );

const countBadge = (count: number, total: number, colour: string): React.ReactNode => (
  <span
    style={{
      display: 'inline-block',
      backgroundColor: colour,
      color: '#fff',
      borderRadius: 12,
      padding: '2px 10px',
      fontSize: 12,
      fontWeight: 600,
      marginLeft: 8,
    }}
  >
    {count} / {total}
  </span>
);

function confidenceColor(confidence: 'high' | 'medium' | 'low'): string {
  if (confidence === 'high') return colors.greenApple500;
  if (confidence === 'medium') return colors.cantaloupe500;
  return '#6b7280';
}

function adjustConfidenceWithQValue(row: FeatureCorrelationStat): 'high' | 'medium' | 'low' {
  const minArm = Math.min(row.nOnTth, row.nOffTth);
  if (minArm < 10) return 'low';
  if (row.qTth > 0 && row.qTth <= 0.05 && minArm >= 30) return 'high';
  if (row.qTth === 0 && minArm >= 30) return 'high';
  return 'medium';
}

function sampleSizeColor(n: number): string {
  if (n < 10) return colors.cantaloupe400;
  return 'inherit';
}

function tthImpactColor(deltaTthDays: number | undefined): string {
  if (deltaTthDays == null) return 'rgba(0,0,0,0.04)';
  const clamped = Math.max(-15, Math.min(15, deltaTthDays));
  const AMBER_ZONE = 2; // days within which we show amber
  if (Math.abs(clamped) <= AMBER_ZONE) {
    return 'rgba(255,193,7,0.16)';
  }
  if (clamped > 0) {
    const t = (clamped - AMBER_ZONE) / (15 - AMBER_ZONE); // 0..1
    const alpha = 0.10 + t * 0.18;
    return `rgba(76,175,80,${alpha.toFixed(2)})`;
  }
  const t = (Math.abs(clamped) - AMBER_ZONE) / (15 - AMBER_ZONE);
  const alpha = 0.10 + t * 0.18;
  return `rgba(244,67,54,${alpha.toFixed(2)})`;
}

function tthImpactTextColor(deltaTthDays: number | undefined): string {
  if (deltaTthDays == null) return colors.blackPepper400;
  if (deltaTthDays > 2) return '#2e7d32';
  if (deltaTthDays < -2) return '#c62828';
  return '#e65100';
}

interface FeatureWithCorrelation {
  feature: string;
  stat: FeatureCorrelationStat | undefined;
}

function FeatureImpactList({
  features,
  correlations,
  modelLabel,
}: {
  features: string[];
  correlations: readonly FeatureCorrelationStat[];
  modelLabel?: string;
}): React.ReactElement | null {
  if (features.length === 0) return null;

  const lookup = useMemo(() => {
    const m = new Map<string, FeatureCorrelationStat>();
    for (const row of correlations) m.set(row.feature, row);
    return m;
  }, [correlations]);

  const ranked: FeatureWithCorrelation[] = useMemo(() => {
    const withStat = features.map((f) => ({ feature: f, stat: lookup.get(f) }));
    withStat.sort((a, b) => {
      const aVal = a.stat?.deltaTthDays;
      const bVal = b.stat?.deltaTthDays;
      if (aVal == null && bVal == null) return a.feature.localeCompare(b.feature);
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return bVal - aVal; // highest beneficial impact first
    });
    return withStat;
  }, [features, lookup]);

  return (
    <div>
      {modelLabel && (
        <div style={{ fontSize: 11, color: colors.blackPepper400, marginBottom: 6 }}>
          Ranked by TTH impact - {modelLabel} model
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ranked.map(({ feature, stat }) => {
          const delta = stat?.deltaTthDays;
          const bg = tthImpactColor(delta);
          return (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: bg,
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              <span style={{ flex: 1, fontWeight: 500, color: colors.blackPepper600 }}>
                {feature}
              </span>
              {stat ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: tthImpactTextColor(delta),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {delta != null && delta > 0 ? '-' : '+'}
                    {delta != null ? Math.abs(delta).toFixed(1) : '?'} days TTH
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      borderRadius: 8,
                      padding: '1px 6px',
                      color: '#fff',
                      background: confidenceColor(stat.confidence),
                      fontSize: 10,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      lineHeight: 1.6,
                    }}
                  >
                    {stat.confidence}
                  </span>
                </span>
              ) : (
                <span style={{ fontSize: 11, color: colors.blackPepper400, fontStyle: 'italic' }}>
                  insufficient data
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 6px', position: 'sticky' as const, top: 0, backgroundColor: colors.frenchVanilla100, zIndex: 1 };
const thRight: React.CSSProperties = { ...thStyle, textAlign: 'right' };
const thCenter: React.CSSProperties = { ...thStyle, textAlign: 'center' };
const tdStyle: React.CSSProperties = { padding: '8px 6px' };
const tdRight: React.CSSProperties = { ...tdStyle, textAlign: 'right' };
const tdCenter: React.CSSProperties = { ...tdStyle, textAlign: 'center' };

function zebraRow(idx: number): React.CSSProperties {
  return { borderBottom: `1px solid ${colors.soap200}`, backgroundColor: idx % 2 === 1 ? colors.soap100 : undefined };
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (idx: number) => void }) {
  return (
    <Flex gap="xs" style={{ borderBottom: `1px solid ${colors.soap300}`, marginBottom: 16 }}>
      {tabs.map((label, idx) => (
        <button key={label} type="button" onClick={() => onChange(idx)} style={{
          padding: '8px 16px', fontSize: 13, fontWeight: active === idx ? 700 : 500, cursor: 'pointer',
          border: 'none', borderBottom: active === idx ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
          color: active === idx ? colors.blueberry600 : colors.blackPepper500, background: 'transparent',
        }}>{label}</button>
      ))}
    </Flex>
  );
}

function medianOfArr(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function validMetricValue(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

function formatBenchmarkDelta(value: number, unit: 'days' | 'reqs'): string {
  const rounded = Math.round(Math.abs(value) * 10) / 10;
  const display = Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
  return unit === 'days' ? `${display} days` : `${display} reqs`;
}

function benchmarkMedian(values: Array<number | null | undefined>): number | null {
  const filtered = values.filter(validMetricValue);
  if (filtered.length === 0) return null;
  return medianOfArr(filtered);
}

function comparisonSentence(
  current: number | null | undefined,
  benchmark: number | null,
  label: string,
  unit: 'days' | 'reqs'
): string {
  if (!validMetricValue(current) || benchmark == null) return `${label}: no benchmark`;
  const delta = current - benchmark;
  if (Math.abs(delta) < 0.05) return `${label}: in line with median`;
  return `${label}: ${formatBenchmarkDelta(delta, unit)} ${delta > 0 ? 'above' : 'below'} median`;
}

function tthBenchmarkIndicator(
  current: number | null | undefined,
  regionBenchmark: number | null,
  industryBenchmark: number | null
): { text: string; sentiment: 'positive' | 'negative' | 'neutral' } | undefined {
  if (!validMetricValue(current)) return undefined;
  const deltas = [regionBenchmark, industryBenchmark]
    .filter((value): value is number => value != null)
    .map((benchmark) => current - benchmark);
  if (deltas.length === 0) return undefined;
  if (deltas.every((delta) => delta < -0.05)) {
    return { text: 'Below both benchmarks', sentiment: 'positive' };
  }
  if (deltas.every((delta) => delta > 0.05)) {
    return { text: 'Above both benchmarks', sentiment: 'negative' };
  }
  return { text: 'Mixed benchmark picture', sentiment: 'neutral' };
}

function withReadyForHirePlaceholder(stages: ReturnType<typeof stagesFromSubBpsLatestMonth>) {
  if (stages.some((stage) => /ready for hire/i.test(stage.label))) return stages;
  return [
    ...stages,
    {
      key: 'ready_for_hire',
      label: 'Ready for Hire',
      days: 0,
      method: 'median' as const,
      isPlaceholder: true,
      note: 'Stage is part of the recruiting flow, but Ready for Hire duration is not present in the current sub-BP duration extract.',
    },
  ];
}

function computeFilteredCorrelations(
  regionFilter: string,
  industryFilter: string,
): FeatureCorrelationStat[] {
  const isGlobal = !regionFilter && !industryFilter;

  const matchingTenants = isGlobal
    ? SCORECARD_TENANT_NAMES
    : SCORECARD_TENANT_NAMES.filter((tn) => {
        const enr = TENANT_ENRICHMENT[tn];
        if (!enr) return false;
        if (regionFilter && enr.region !== regionFilter) return false;
        if (industryFilter && enr.industry !== industryFilter) return false;
        return true;
      });

  if (matchingTenants.length < 10) return [];

  const results: FeatureCorrelationStat[] = [];

  for (const feature of ALL_RECRUITING_FEATURES) {
    const ttfOn: number[] = [], ttfOff: number[] = [];
    const tthOn: number[] = [], tthOff: number[] = [];

    for (const tn of matchingTenants) {
      const sc = SCORECARD_BY_TENANT[tn];
      if (!sc) continue;
      const adopted = sc.adoptedFeatures.includes(feature);

      if (sc.avgTimeToFillDays != null && sc.avgTimeToFillDays > 0) {
        (adopted ? ttfOn : ttfOff).push(sc.avgTimeToFillDays);
      }
      if (sc.avgTimeToHireDays != null && sc.avgTimeToHireDays > 0) {
        (adopted ? tthOn : tthOff).push(sc.avgTimeToHireDays);
      }
    }

    const minN = 5;
    if (ttfOn.length < minN && tthOn.length < minN) continue;

    const deltaTtf = (ttfOn.length >= minN && ttfOff.length >= minN)
      ? medianOfArr(ttfOff) - medianOfArr(ttfOn) : 0;
    const deltaTth = (tthOn.length >= minN && tthOff.length >= minN)
      ? medianOfArr(tthOff) - medianOfArr(tthOn) : 0;

    if (deltaTth === 0) continue;

    const totalOn = Math.max(ttfOn.length, tthOn.length);
    const totalOff = Math.max(ttfOff.length, tthOff.length);
    const confidence: 'high' | 'medium' | 'low' =
      totalOn >= 10 && totalOff >= 10 ? 'medium' : 'low';

    const prebaked = isGlobal
      ? FEATURE_CORRELATIONS_GLOBAL.find((r) => r.feature === feature)
      : undefined;

    const row: FeatureCorrelationStat = {
      feature,
      correlationScore: Math.abs(deltaTth),
      deltaTtfDays: deltaTtf,
      deltaTthDays: deltaTth,
      qTtf: prebaked?.qTtf ?? 0,
      qTth: prebaked?.qTth ?? 0,
      confidence,
      nOnTtf: ttfOn.length,
      nOffTtf: ttfOff.length,
      nOnTth: tthOn.length,
      nOffTth: tthOff.length,
    };

    if (isGlobal && prebaked) {
      row.confidence = adjustConfidenceWithQValue(row);
    }

    results.push(row);
  }

  results.sort((a, b) => b.deltaTthDays - a.deltaTthDays);
  return results;
}

interface Top10Row {
  rank: number;
  tenant: string;
  adoptionScore: number;
  featuresAdopted: number;
  region: string;
  industry: string;
}

function computeTop10(): Top10Row[] {
  const entries = Object.entries(TENANT_DATA_SCIENTIST_INSIGHTS)
    .map(([tenant, insight]) => {
      const sc = SCORECARD_BY_TENANT[tenant];
      const enr = TENANT_ENRICHMENT[tenant];
      return {
        tenant,
        adoptionScore: insight.adoptionScore,
        featuresAdopted: sc?.adoptedFeatures.length ?? 0,
        region: enr?.region ?? 'Unknown',
        industry: enr?.industry ?? 'Unknown',
      };
    })
    .sort((a, b) => b.adoptionScore - a.adoptionScore)
    .slice(0, 10);

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

interface IndustryTop3 {
  industry: string;
  tenants: { tenant: string; adoptionScore: number; featuresAdopted: number; region: string }[];
  topTthFeatures: { feature: string; deltaTthDays: number; confidence: 'high' | 'medium' | 'low'; nOn: number; nOff: number }[];
}

function computeIndustryTop3(): IndustryTop3[] {
  const byIndustry: Record<string, { tenant: string; adoptionScore: number; featuresAdopted: number; region: string }[]> = {};
  for (const [tenant, insight] of Object.entries(TENANT_DATA_SCIENTIST_INSIGHTS)) {
    const enr = TENANT_ENRICHMENT[tenant];
    const industry = enr?.industry ?? 'Unknown';
    if (industry === 'Unknown') continue;
    if (!byIndustry[industry]) byIndustry[industry] = [];
    byIndustry[industry].push({
      tenant,
      adoptionScore: insight.adoptionScore,
      featuresAdopted: SCORECARD_BY_TENANT[tenant]?.adoptedFeatures.length ?? 0,
      region: enr?.region ?? 'Unknown',
    });
  }
  return Object.entries(byIndustry)
    .map(([industry, entries]) => {
      const industryTenantNames = entries.map((row) => row.tenant);
      const tthFeatureLifts = ALL_RECRUITING_FEATURES.map((feature) => {
        const tthOn: number[] = [];
        const tthOff: number[] = [];
        for (const tenant of industryTenantNames) {
          const scorecard = SCORECARD_BY_TENANT[tenant];
          if (!scorecard || scorecard.avgTimeToHireDays == null || scorecard.avgTimeToHireDays <= 0) continue;
          const adopted = scorecard.adoptedFeatures.includes(feature);
          (adopted ? tthOn : tthOff).push(scorecard.avgTimeToHireDays);
        }
        const minN = 5;
        if (tthOn.length < minN || tthOff.length < minN) return undefined;
        const deltaTthDays = medianOfArr(tthOff) - medianOfArr(tthOn);
        if (deltaTthDays <= 0) return undefined; // only keep features associated with lower TTH
        const confidence: 'high' | 'medium' | 'low' =
          tthOn.length >= 10 && tthOff.length >= 10 ? 'medium' : 'low';
        return { feature, deltaTthDays, confidence, nOn: tthOn.length, nOff: tthOff.length };
      }).filter((row): row is NonNullable<typeof row> => Boolean(row))
        .sort((a, b) => b.deltaTthDays - a.deltaTthDays)
        .slice(0, 3);

      return {
        industry,
        tenants: entries.sort((a, b) => b.adoptionScore - a.adoptionScore).slice(0, 3),
          topTthFeatures: tthFeatureLifts,
      };
    })
    .sort((a, b) => a.industry.localeCompare(b.industry));
}

export const CustomerScorecardDashboard = () => {
  const sortedTenants = useMemo(
    () => [...SCORECARD_TENANT_NAMES].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    [],
  );

  const [tenant, setTenant] = useState<string>(() => tenantFromSearch());
  const [regionFilter, setRegionFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [globalTab, setGlobalTab] = useState(0);
  const [tenantTab, setTenantTab] = useState(0);

  const datum = tenant ? getTenantScorecard(tenant) : undefined;
  const tenantInsight = tenant ? getTenantInsight(tenant) : undefined;
  const peerBenchmarkInsight = tenant ? getTenantPeerBenchmarkInsight(tenant) : undefined;
  const tenantEnrichment = tenant ? getTenantEnrichment(tenant) : undefined;

  const featureLists = useMemo(() => {
    if (!datum) return { adopted: [] as string[], notAdopted: [] as string[] };
    const adoptedSet = new Set(datum.adoptedFeatures);
    const adopted = [...datum.adoptedFeatures].sort((a, b) => a.localeCompare(b));
    const notAdopted = ALL_RECRUITING_FEATURES.filter((f) => !adoptedSet.has(f));
    return { adopted, notAdopted };
  }, [datum]);

  const featureTotal = ALL_RECRUITING_FEATURES.length;
  const tldrInsights = useMemo(() => {
    if (!tenantInsight) return [] as string[];
    const corr = tenantInsight.effectiveCorrelations;
    const adoptedSet = new Set(featureLists.adopted);
    const enabled = corr
      .filter((row) => adoptedSet.has(row.feature))
      .sort((a, b) => b.deltaTthDays - a.deltaTthDays);
    const missing = corr
      .filter((row) => !adoptedSet.has(row.feature))
      .sort((a, b) => b.deltaTthDays - a.deltaTthDays);

    const insights: string[] = [];
    insights.push(
      `Context model: ${tenantInsight.segmentModelUsed}. This ranking is tuned to ${tenantInsight.segment} usage peers${tenantInsight.industry !== 'Unknown' ? ` in ${tenantInsight.industry}` : ''}.`,
    );

    if (enabled.length > 0) {
      const topEnabled = enabled[0];
      insights.push(
        `Strongest enabled lever for median TTH is ${topEnabled.feature} at ${Math.abs(topEnabled.deltaTthDays).toFixed(1)} days ${topEnabled.deltaTthDays >= 0 ? 'lower' : 'higher'} TTH (${topEnabled.confidence} confidence).`,
      );
    }

    if (missing.length > 0) {
      const topMissing = missing[0];
      insights.push(
        `Best missing feature opportunity is ${topMissing.feature}, associated with ${Math.abs(topMissing.deltaTthDays).toFixed(1)} days ${topMissing.deltaTthDays >= 0 ? 'lower' : 'higher'} median TTH if adopted (${topMissing.confidence} confidence).`,
      );
    }

    const mediumOrHigh = corr.filter((row) => row.confidence !== 'low').length;
    insights.push(
      `${mediumOrHigh} of ${corr.length} feature correlations are medium/high confidence in this model; treat low-confidence rows as directional only.`,
    );
    return insights;
  }, [tenantInsight, featureLists]);

  const filteredCorrelations = useMemo(
    () => computeFilteredCorrelations(regionFilter, industryFilter),
    [regionFilter, industryFilter],
  );

  const top10 = useMemo(() => computeTop10(), []);

  const isFiltered = Boolean(regionFilter || industryFilter);

  const onTenantChange = useCallback((next: string) => {
    setTenant(next);
    try {
      const u = new URL(window.location.href);
      if (next) {
        u.searchParams.set('tenant', next);
      } else {
        u.searchParams.delete('tenant');
      }
      window.history.replaceState(null, '', `${u.pathname}${u.search}${u.hash}`);
    } catch {
      /* ignore */
    }
  }, []);

  const industryTop3 = useMemo(() => computeIndustryTop3(), []);

  const tenantOptions = useMemo(
    () => [{ value: '', label: 'Select tenant (or leave blank for global insight view)' }, ...sortedTenants.map((t) => ({ value: t, label: getTenantDisplayName(t) }))],
    [sortedTenants],
  );

  const regionSelectOptions = useMemo(
    () => [{ value: '', label: 'All regions' }, ...REGION_OPTIONS.map((r) => ({ value: r, label: r }))],
    [],
  );

  const industrySelectOptions = useMemo(
    () => [{ value: '', label: 'All industries' }, ...INDUSTRY_OPTIONS.map((i) => ({ value: i, label: i }))],
    [],
  );

  const globalBottleneckStages = useMemo(() => {
    const { subBps } = getSliceSubBpsAndHeadline({ tenant: '', region: '', industry: '' });
    return withReadyForHirePlaceholder(stagesFromSubBpsLatestMonth(subBps));
  }, []);

  const tenantBottleneckStages = useMemo(() => {
    if (!tenant) return [];
    const { subBps } = getSliceSubBpsAndHeadline({ tenant, region: '', industry: '' });
    return withReadyForHirePlaceholder(stagesFromSubBpsLatestMonth(subBps));
  }, [tenant]);

  const latestYm = LABELS[LABELS.length - 1];

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="customer-scorecard" />
      <Box padding="l" flex={1}>
        <Flex flexDirection="column" gap="l" maxWidth={1200} marginX="auto">
          <PageHeader
            title="Customer Scorecard"
            subtitle="Shows, in simple terms, which features customers have adopted and how that adoption correlates with better or worse Avg. Time to Hire across peer groups. It then shows the selected tenant's KPI snapshot."
          />
          <Box style={listCard}>
            <FormSelect
              id="scorecard-tenant"
              label="Tenant"
              value={tenant}
              onChange={onTenantChange}
              options={tenantOptions}
            />
            <BodyText size="small" marginTop="xs" style={{ color: colors.blackPepper500 }}>
              {tenant
                ? <>Viewing: <strong>{getTenantDisplayName(tenant)}</strong>. <button type="button" onClick={() => onTenantChange('')} style={{ background: 'none', border: 'none', color: colors.blueberry400, cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}>Back to global view</button></>
                : <>Leave tenant blank to view the global correlation leaderboard first. Deep link: <code style={{ fontSize: 12 }}>?tenant=&lt;tenant_name&gt;</code></>}
            </BodyText>
          </Box>

          {!tenant ? (
            <>
              <TabBar tabs={['Overview', 'Leaderboard']} active={globalTab} onChange={setGlobalTab} />
              {globalTab === 0 && (
                <>
                  <Box style={listCard}>
                    <BottleneckFlowStrip
                      title="Bottleneck analyser · job application flow"
                      titleHelp={BOTTLENECK_STRIP_HELP}
                      subtitle="Recruiting sub-business-process stages (global aggregate). Segment width is proportional to completed duration for each stage, using median first and labelling average whenever median is missing. Employment Agreement follows Offer."
                      stages={globalBottleneckStages}
                      footnote={`Source: dw.swh.bp_event_stats aggregates · completed events · latest month ${latestYm}`}
                    />
                  </Box>
                  <Heading as="h2" size="small" marginY="xs">
                    Feature Correlations With Median Time to Hire{isFiltered ? ' (filtered)' : ' (global)'}
                  </Heading>
                  <BodyText size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
                    {isFiltered
                      ? 'Showing median TTH delta for the selected segment. Positive values = adopters have lower TTH; negative = higher. q-values are not recomputed for filtered views; confidence capped at medium.'
                      : 'Correlation only, not causation. Positive values = adopters have lower TTH; negative = adopters have higher TTH. Ranked by median TTH impact, with q(TTH) and sample support checks.'}
                  </BodyText>
                  <Flex gap="m" flexWrap="wrap" marginBottom="s">
                    <Box flex="1 1 200px" maxWidth={280}>
                      <FormSelect id="corr-region" label="Region" value={regionFilter} onChange={setRegionFilter} options={regionSelectOptions} />
                    </Box>
                    <Box flex="1 1 200px" maxWidth={280}>
                      <FormSelect id="corr-industry" label="Industry" value={industryFilter} onChange={setIndustryFilter} options={industrySelectOptions} />
                    </Box>
                  </Flex>
                  {filteredCorrelations.length === 0 ? (
                    <Box style={listCard}>
                      <BodyText size="small" style={{ color: colors.blackPepper500 }}>Not enough tenants in this segment to compute meaningful correlations (minimum 10 required).</BodyText>
                    </Box>
                  ) : (
                    <Box style={listCard}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${colors.soap300}` }}>
                            <th style={thStyle}>Feature</th>
                            <th style={thRight}>Median TTH impact (days)</th>
                            {!isFiltered && <th style={thRight}>q(TTH)</th>}
                            <th style={thRight}>n(on)</th>
                            <th style={thRight}>n(off)</th>
                            <th style={thCenter}>Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCorrelations.map((row, idx) => (
                            <tr key={row.feature} style={{ borderBottom: `1px solid ${colors.soap200}`, backgroundColor: tthImpactColor(row.deltaTthDays) }}>
                              <td style={tdStyle}>{row.feature}</td>
                              <td style={{ ...tdRight, color: tthImpactTextColor(row.deltaTthDays), fontWeight: 500 }}>
                                {row.deltaTthDays > 0 ? '\u2212' : '+'}{Math.abs(row.deltaTthDays).toFixed(1)} days {row.deltaTthDays > 0 ? '(lower)' : row.deltaTthDays < 0 ? '(higher)' : ''}
                              </td>
                              {!isFiltered && <td style={tdRight}>{row.qTth.toFixed(3)}</td>}
                              <td style={tdRight} title={row.nOnTth < 10 ? 'Small cohort - interpret with caution' : undefined}>
                                <span style={{ color: sampleSizeColor(row.nOnTth), fontWeight: row.nOnTth < 10 ? 600 : 'normal' }}>{row.nOnTth}{row.nOnTth < 10 ? ' !' : ''}</span>
                              </td>
                              <td style={tdRight} title={row.nOffTth < 10 ? 'Small cohort - interpret with caution' : undefined}>
                                <span style={{ color: sampleSizeColor(row.nOffTth), fontWeight: row.nOffTth < 10 ? 600 : 'normal' }}>{row.nOffTth}{row.nOffTth < 10 ? ' !' : ''}</span>
                              </td>
                              <td style={tdCenter}>
                                <span style={{ display: 'inline-block', borderRadius: 10, padding: '2px 8px', color: '#fff', background: confidenceColor(row.confidence), fontSize: 11, textTransform: 'uppercase' }}>{row.confidence}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  )}
                </>
              )}
              {globalTab === 1 && (
                <>
                  <Heading as="h2" size="small" marginBottom="xs">Top 10 tenants by adoption score</Heading>
                  <BodyText size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
                    Ranked by PCA feature coverage (adopted / {featureTotal}). Click a tenant name to view their full scorecard.
                  </BodyText>
                  <Box style={listCard}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${colors.soap300}` }}>
                          <th style={thStyle}>#</th><th style={thStyle}>Tenant</th><th style={thRight}>Adoption score</th><th style={thRight}>Features</th><th style={thStyle}>Industry</th><th style={thStyle}>Region</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top10.map((row, idx) => (
                          <tr key={row.tenant} style={zebraRow(idx)}>
                            <td style={tdStyle}>{row.rank}</td>
                            <td style={tdStyle}>
                              <button type="button" onClick={() => onTenantChange(row.tenant)} style={{ background: 'none', border: 'none', color: colors.blueberry400, cursor: 'pointer', padding: 0, fontSize: 13, textDecoration: 'underline' }}>{getTenantDisplayName(row.tenant)}</button>
                            </td>
                            <td style={tdRight}>{row.adoptionScore.toFixed(1)}</td>
                            <td style={tdRight}>{row.featuresAdopted} / {featureTotal}</td>
                            <td style={tdStyle}>{row.industry}</td>
                            <td style={tdStyle}>{row.region}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                  <Heading as="h2" size="small" marginTop="m" marginBottom="xs">Top 3 customers by industry</Heading>
                  <BodyText size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
                    Highest adoption scores within each industry vertical. Click a name to view their full scorecard.
                  </BodyText>
                  <Flex flexDirection="row" flexWrap="wrap" gap="m">
                    {industryTop3.map((group) => (
                      <Box key={group.industry} flex="1 1 340px" maxWidth={480} style={listCard}>
                        <Heading as="h3" size="small" marginBottom="xs">{group.industry}</Heading>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${colors.soap300}` }}>
                              <th style={{ ...thStyle, padding: '4px 6px' }}>#</th><th style={{ ...thStyle, padding: '4px 6px' }}>Customer</th><th style={{ ...thRight, padding: '4px 6px' }}>Score</th><th style={{ ...thRight, padding: '4px 6px' }}>Features</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.tenants.map((t, idx) => (
                              <tr key={t.tenant} style={zebraRow(idx)}>
                                <td style={{ ...tdStyle, padding: '4px 6px' }}>{idx + 1}</td>
                                <td style={{ ...tdStyle, padding: '4px 6px' }}>
                                  <button type="button" onClick={() => onTenantChange(t.tenant)} style={{ background: 'none', border: 'none', color: colors.blueberry400, cursor: 'pointer', padding: 0, fontSize: 13, textDecoration: 'underline' }}>{getTenantDisplayName(t.tenant)}</button>
                                </td>
                                <td style={{ ...tdRight, padding: '4px 6px' }}>{t.adoptionScore.toFixed(1)}</td>
                                <td style={{ ...tdRight, padding: '4px 6px' }}>{t.featuresAdopted} / {featureTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ marginTop: 10, borderTop: `1px solid ${colors.soap200}`, paddingTop: 8 }}>
                          <BodyText size="small" style={{ color: colors.blackPepper500, marginBottom: 6 }}>Top 3 features correlated with lower median time to hire ({group.industry} context)</BodyText>
                          {group.topTthFeatures.length === 0 ? (
                            <BodyText size="small" style={{ color: colors.blackPepper500 }}>Not enough TTH coverage in this industry to estimate feature-level lifts.</BodyText>
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5, fontSize: 13 }}>
                              {group.topTthFeatures.map((row) => (
                                <li key={`${group.industry}-${row.feature}`}><strong>{row.feature}</strong> - {row.deltaTthDays.toFixed(1)} days lower median TTH ({row.confidence} confidence; n(on)={row.nOn}, n(off)={row.nOff})</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </Box>
                    ))}
                  </Flex>
                </>
              )}
            </>
          ) : !datum ? (
            <BodyText size="small">No scorecard data for this tenant.</BodyText>
          ) : (
            <>
              {(() => {
                const recruiterCapacity = SCORECARD_RECRUITER_CAPACITY_BY_TENANT[tenant];
                const regionPeers = tenantEnrichment
                  ? SCORECARD_TENANT_NAMES.filter((name) => name !== tenant && TENANT_ENRICHMENT[name]?.region === tenantEnrichment.region)
                  : [];
                const industryPeers = tenantEnrichment
                  ? SCORECARD_TENANT_NAMES.filter((name) => name !== tenant && TENANT_ENRICHMENT[name]?.industry === tenantEnrichment.industry)
                  : [];
                const regionTthBenchmark = benchmarkMedian(regionPeers.map((name) => SCORECARD_BY_TENANT[name]?.avgTimeToHireDays));
                const industryTthBenchmark = benchmarkMedian(industryPeers.map((name) => SCORECARD_BY_TENANT[name]?.avgTimeToHireDays));
                const regionCapacityBenchmark = benchmarkMedian(regionPeers.map((name) => SCORECARD_RECRUITER_CAPACITY_BY_TENANT[name]));
                const industryCapacityBenchmark = benchmarkMedian(industryPeers.map((name) => SCORECARD_RECRUITER_CAPACITY_BY_TENANT[name]));
                return (
              <Flex flexDirection="row" flexWrap="wrap" gap="m">
                <Box flex="1 1 240px" minWidth={200} style={{ minWidth: 0 }}>
                  <MetricCard
                    label="Avg. time to hire"
                    value={fmtDays(datum.avgTimeToHireDays)}
                    helperText={`${comparisonSentence(datum.avgTimeToHireDays, regionTthBenchmark, 'Segment', 'days')} · ${comparisonSentence(datum.avgTimeToHireDays, industryTthBenchmark, 'Industry', 'days')}`}
                    changeIndicator={tthBenchmarkIndicator(datum.avgTimeToHireDays, regionTthBenchmark, industryTthBenchmark)}
                    tooltip="Mean tenant-level time to hire in days from the scorecard IUM snapshot for this tenant month."
                  />
                </Box>
                <Box flex="1 1 240px" minWidth={200} style={{ minWidth: 0 }}>
                  <MetricCard
                    label="Recruiter Capacity"
                    value={fmtDays(recruiterCapacity)}
                    helperText={`${comparisonSentence(recruiterCapacity, regionCapacityBenchmark, 'Segment', 'reqs')} · ${comparisonSentence(recruiterCapacity, industryCapacityBenchmark, 'Industry', 'reqs')}`}
                    changeIndicator={{ text: 'Context from region and industry', sentiment: 'neutral' }}
                    tooltip="Live SANDBOX Recruiter Productivity IUM for this tenant, used here as Recruiter Capacity. Measures average open requisitions and evergreens per primary recruiter."
                  />
                </Box>
              </Flex>
                );
              })()}

              {tenantEnrichment && (
                <BodyText size="small" style={{ fontSize: 13, color: colors.blackPepper500 }}>
                  Benchmark context: segment = <strong>{tenantEnrichment.region}</strong> and industry = <strong>{tenantEnrichment.industry}</strong>.
                </BodyText>
              )}

              {(datum.avgTimeToHireDays == null || SCORECARD_RECRUITER_CAPACITY_BY_TENANT[tenant] == null) && (
                <BodyText size="small" style={{ fontSize: 13, color: colors.blackPepper500 }}>
                  One or both customer KPI values are missing for this tenant in the latest scorecard month. TTH uses {SCORECARD_SOURCE.iumYearMonth}; Recruiter Capacity uses {SCORECARD_RECRUITER_CAPACITY_YYYY_MM}.
                </BodyText>
              )}

              <Box style={listCard}>
                <BottleneckFlowStrip
                  title={`Bottleneck analyser · ${getTenantDisplayName(tenant)}`}
                  titleHelp={BOTTLENECK_STRIP_HELP}
                  subtitle="Job application sub-process stages for this tenant (when present in bp_event_stats). Width reflects completed days per stage, using median first and labelling average whenever median is missing. Employment Agreement follows Offer."
                  stages={tenantBottleneckStages}
                  footnote={`Source: dw.swh.bp_event_stats · tenant slice · latest month ${latestYm}`}
                />
              </Box>

              <Heading as="h2" size="small" marginTop="m" marginBottom="xs">
                Data Scientist adoption score and recommendations
              </Heading>
              <BodyText size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
                Segment and industry-aware correlation model. Recommendations prioritise missing features associated with lower median TTH among peers in the same usage segment and industry. Correlation does not imply causation.
              </BodyText>

              <TabBar tabs={['Feature Adoption Detail', 'Adoption & Recommendations', 'Peer Benchmark']} active={tenantTab} onChange={setTenantTab} />

              {tenantTab === 1 && (
                <>
                  {!tenantInsight ? (
                    <Box style={listCard}>
                      <BodyText size="small" style={{ color: colors.blackPepper500 }}>No data scientist insight available for this tenant yet.</BodyText>
                    </Box>
                  ) : (
                    <Flex flexDirection="row" flexWrap="wrap" gap="m">
                      <Box flex="1 1 100%" style={listCard}>
                        <Heading as="h3" size="small" marginBottom="s">Data Scientist TL;DR</Heading>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper600, fontSize: 14, lineHeight: 1.6 }}>
                          {tldrInsights.map((insight, index) => (<li key={`tldr-${index}`}>{insight}</li>))}
                        </ul>
                      </Box>
                      <Box flex="1 1 260px" style={listCard}>
                        <Heading as="h3" size="small" marginBottom="s">Adoption score</Heading>
                        <Heading as="h2" size="small" style={{ margin: 0 }}>{tenantInsight.adoptionScore.toFixed(1)} / 100</Heading>
                        <BodyText size="small" style={{ color: colors.blackPepper500 }}>Segment: {tenantInsight.segment} · Industry: {tenantInsight.industry}</BodyText>
                        <BodyText size="small" style={{ color: colors.blackPepper500, fontSize: 12, marginTop: 4 }}>Model: {tenantInsight.segmentModelUsed}</BodyText>
                        <BodyText size="small" style={{ color: colors.blackPepper500, marginTop: 8 }}>Strengths: {tenantInsight.strengthFeatures.length > 0 ? tenantInsight.strengthFeatures.join(', ') : 'none flagged'}</BodyText>
                      </Box>
                      <Box flex="2 1 420px" style={listCard}>
                        <Heading as="h3" size="small" marginBottom="s">Missing features likely to improve median time to hire{tenantInsight.industry !== 'Unknown' ? ` (${tenantInsight.industry})` : ''}</Heading>
                        {tenantInsight.recommendedMissingFeatures.length === 0 ? (
                          <BodyText size="small" style={{ color: colors.blackPepper500 }}>No high-value missing features detected under current correlation thresholds.</BodyText>
                        ) : (
                          <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper600, fontSize: 14, lineHeight: 1.6 }}>
                            {tenantInsight.recommendedMissingFeatures.map((rec) => (
                              <li key={rec.feature}><strong>{rec.feature}</strong> - associated with {Math.abs(rec.deltaTthDays).toFixed(1)} days {rec.deltaTthDays >= 0 ? 'lower' : 'higher'} median TTH ({rec.confidence} confidence)</li>
                            ))}
                          </ul>
                        )}
                      </Box>
                    </Flex>
                  )}
                </>
              )}

              {tenantTab === 2 && (
                <Box style={listCard}>
                  <Heading as="h3" size="small" marginBottom="s">
                    Peer benchmark{peerBenchmarkInsight ? ` (${peerBenchmarkInsight.industryFiltered ? `${peerBenchmarkInsight.industry}, ` : ''}${peerBenchmarkInsight.segment})` : ''}
                  </Heading>
                  {!peerBenchmarkInsight ? (
                    <BodyText size="small" style={{ color: colors.blackPepper500 }}>Not enough peers in this segment to benchmark yet.</BodyText>
                  ) : (
                    <>
                      <BodyText size="small" style={{ color: colors.blackPepper500 }}>
                        Your score: <strong>{tenantInsight?.adoptionScore.toFixed(1)}</strong> · Peer median: <strong>{peerBenchmarkInsight.segmentPeerMedian.toFixed(1)}</strong> · Peer p75: <strong>{peerBenchmarkInsight.segmentPeerP75.toFixed(1)}</strong> · Percentile: <strong>{peerBenchmarkInsight.tenantPercentile.toFixed(0)}th</strong>
                      </BodyText>
                      <BodyText size="small" style={{ color: colors.blackPepper500, marginTop: 6 }}>
                        {peerBenchmarkInsight.industryFiltered
                          ? `Benchmarked against ${peerBenchmarkInsight.industry} peers in the ${peerBenchmarkInsight.segment} segment.`
                          : `Industry pool too small for ${peerBenchmarkInsight.industry}; benchmarked against all ${peerBenchmarkInsight.segment} peers.`}
                        {' '}Directional, not causal proof.
                      </BodyText>
                      {peerBenchmarkInsight.topPeers.length === 0 ? (
                        <BodyText size="small" style={{ color: colors.blackPepper500, marginTop: 10 }}>No comparable peers with additional high-value features were found.</BodyText>
                      ) : (
                        <div style={{ marginTop: 12 }}>
                          <Heading as="h4" size="small" marginBottom="s">Top 3 peers</Heading>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                              <tr style={{ borderBottom: `1px solid ${colors.soap300}` }}>
                                <th style={thStyle}>Peer</th><th style={thRight}>Adoption score</th><th style={thRight}>Gap vs tenant</th><th style={thStyle}>Peer-only enabled features you do not have</th>
                              </tr>
                            </thead>
                            <tbody>
                              {peerBenchmarkInsight.topPeers.map((peer, idx) => (
                                <tr key={peer.peerTenant} style={zebraRow(idx)}>
                                  <td style={tdStyle}>
                                    <button type="button" onClick={() => onTenantChange(peer.peerTenant)} style={{ background: 'none', border: 'none', color: colors.blueberry400, cursor: 'pointer', padding: 0, fontSize: 13, textDecoration: 'underline' }}>{getTenantDisplayName(peer.peerTenant)}</button>
                                  </td>
                                  <td style={tdRight}>{peer.peerAdoptionScore.toFixed(1)}</td>
                                  <td style={tdRight}>{peer.scoreGapVsTenant >= 0 ? '+' : ''}{peer.scoreGapVsTenant.toFixed(1)}</td>
                                  <td style={tdStyle}>
                                    {peer.missingFeatures.length === 0 ? (
                                      <span style={{ color: colors.blackPepper500 }}>No differentiating features</span>
                                    ) : (
                                      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
                                        {peer.missingFeatures.map((feature) => (
                                          <li key={`${peer.peerTenant}-${feature.feature}`}><strong>{feature.feature}</strong> - {Math.abs(feature.deltaTthDays).toFixed(1)} days {feature.deltaTthDays >= 0 ? 'lower' : 'higher'} median TTH ({feature.confidence})</li>
                                        ))}
                                      </ul>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </Box>
              )}

              {tenantTab === 0 && (
                <>
                  <Heading as="h2" size="small" marginY="xs">
                    Talent Acquisition feature adoption (PCA)
                    {countBadge(featureLists.adopted.length, featureTotal, colors.greenApple400)}
                  </Heading>
                  <BodyText size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
                    Source of truth: PCA task-to-feature mapping. Enabled means any mapped task had usage (&gt;0 users or transactions) in the 12-month window.
                  </BodyText>
                  <Flex flexDirection="row" flexWrap="wrap" gap="m">
                    <Box flex="1 1 320px" style={listCard}>
                      <Heading as="h3" size="small" marginBottom="s">Enabled {countBadge(featureLists.adopted.length, featureTotal, colors.greenApple400)}</Heading>
                      {featureLists.adopted.length === 0 ? (
                        <BodyText size="small" style={{ color: colors.blackPepper500 }}>No PCA Talent Acquisition features marked as enabled for this tenant.</BodyText>
                      ) : (
                        <FeatureImpactList features={featureLists.adopted} correlations={tenantInsight?.effectiveCorrelations ?? []} modelLabel={tenantInsight?.segmentModelUsed} />
                      )}
                    </Box>
                    <Box flex="1 1 320px" style={listCard}>
                      <Heading as="h3" size="small" marginBottom="s">Not enabled {countBadge(featureLists.notAdopted.length, featureTotal, colors.cantaloupe400)}</Heading>
                      {featureLists.notAdopted.length === 0 ? (
                        <BodyText size="small" style={{ color: colors.blackPepper500 }}>All PCA Talent Acquisition features are enabled.</BodyText>
                      ) : (
                        <FeatureImpactList features={featureLists.notAdopted} correlations={tenantInsight?.effectiveCorrelations ?? []} modelLabel={tenantInsight?.segmentModelUsed} />
                      )}
                    </Box>
                  </Flex>
                </>
              )}

              <BodyText size="small" style={{ lineHeight: 1.6, color: colors.blackPepper500 }}>
                Usage source: <strong>{SCORECARD_SOURCE.customer360Table}</strong> ({SCORECARD_SOURCE.usageEnvironment}, {SCORECARD_SOURCE.usageDateRange}). Mapping source: <strong>{SCORECARD_SOURCE.taskToPcaTable}</strong>.
              </BodyText>
            </>
          )}

          <BodyText size="small" style={{ color: colors.blackPepper400 }}>
            Snapshot: {SCORECARD_SOURCE.queriedOn} · {SCORECARD_SOURCE.tenantCount} tenants · {SCORECARD_SOURCE.featureCount} PCA features · Correlation window: {SCORECARD_SOURCE.correlationWindow}
          </BodyText>
          <BodyText size="small" style={{ color: colors.blackPepper400, fontStyle: 'italic' }}>
            Environment note: feature adoption comes from <strong>PROD</strong> ({SCORECARD_SOURCE.customer360Table}); the live recruiting IUM outcome currently used for scoring is <strong>SANDBOX Average Time to Hire</strong> (2358), and the Time to Fill card is a <strong>legacy SANDBOX extract</strong> retained for reference while live replacement work remains open.
          </BodyText>
        </Flex>
      </Box>
    </Flex>
  );
};
