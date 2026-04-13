import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { PageHeader, MetricCard, FormSelect, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { ALL_TENANTS, TENANT_TIME_SERIES } from './data-avg-time-to-fill';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CK = {
  primary: colors.blueberry500,
  primaryLight: colors.blueberry200,
  secondary: colors.greenApple400,
  tertiary: colors.cantaloupe400,
  quaternary: colors.cinnamon400,
  neutral: colors.soap400,
  muted: colors.blackPepper500,
};

const REGION_PALETTE: Record<string, string> = {
  'Americas-East': colors.blueberry500,
  'Americas-West': colors.blueberry300,
  'EMEA': colors.cantaloupe400,
  'Canada': '#0d9488',
  'APAC': colors.cinnamon400,
  'Other': colors.soap400,
};

const INFRA_PALETTE: Record<string, string> = {
  AWS: '#ff9900',
  GCP: '#4285f4',
  WDAY: colors.blackPepper600,
};

// ─── Historical raw data extract (older 2359 Time to Fill mapping, SANDBOX, queried 10 Apr 2026) ───

interface TrendRow { ym: string; avg: number; tenants: number; min: number; max: number }

const TREND_DATA: TrendRow[] = [
  { ym: '2025-04', avg: 120.8, tenants: 537, min: 1.0, max: 17975.0 },
  { ym: '2025-05', avg: 139.8, tenants: 559, min: 1.0, max: 22197.0 },
  { ym: '2025-06', avg: 154.5, tenants: 598, min: 1.0, max: 24685.0 },
  { ym: '2025-07', avg: 187.4, tenants: 546, min: 1.0, max: 25359.0 },
  { ym: '2025-08', avg: 175.5, tenants: 522, min: 1.0, max: 21078.0 },
  { ym: '2025-09', avg: 179.0, tenants: 527, min: 1.0, max: 19480.0 },
  { ym: '2025-10', avg: 186.6, tenants: 534, min: 1.0, max: 18631.0 },
  { ym: '2025-11', avg: 141.5, tenants: 485, min: 1.0, max: 14501.0 },
  { ym: '2025-12', avg: 182.0, tenants: 300, min: 1.0, max: 19023.0 },
  { ym: '2026-01', avg: 135.4, tenants: 340, min: 1.0, max: 14780.0 },
  { ym: '2026-02', avg: 127.9, tenants: 542, min: 1.0, max: 18284.0 },
];

interface RegionalRow { ym: string; v: number | null }
const REGIONAL_DATA: Record<string, RegionalRow[]> = {
  'Americas-East': [
    { ym: '2025-04', v: 92.3 }, { ym: '2025-05', v: 108.7 }, { ym: '2025-06', v: 120.3 },
    { ym: '2025-07', v: 130.1 }, { ym: '2025-08', v: 147.6 }, { ym: '2025-09', v: 141.3 },
    { ym: '2025-10', v: 195.8 }, { ym: '2025-11', v: 229.9 }, { ym: '2025-12', v: 179.5 },
    { ym: '2026-01', v: 164.8 }, { ym: '2026-02', v: 88.3 },
  ],
  'Americas-West': [
    { ym: '2025-04', v: 152.0 }, { ym: '2025-05', v: 171.7 }, { ym: '2025-06', v: 191.9 },
    { ym: '2025-07', v: 215.6 }, { ym: '2025-08', v: 202.0 }, { ym: '2025-09', v: 48.2 },
    { ym: '2025-10', v: 50.2 }, { ym: '2025-11', v: 53.4 }, { ym: '2025-12', v: 45.2 },
    { ym: '2026-01', v: 39.6 }, { ym: '2026-02', v: 30.2 },
  ],
  EMEA: [
    { ym: '2025-04', v: 126.9 }, { ym: '2025-05', v: 151.7 }, { ym: '2025-06', v: 174.2 },
    { ym: '2025-07', v: 236.6 }, { ym: '2025-08', v: 197.2 }, { ym: '2025-09', v: 213.7 },
    { ym: '2025-10', v: 210.1 }, { ym: '2025-11', v: 168.8 }, { ym: '2025-12', v: 155.5 },
    { ym: '2026-01', v: 200.3 }, { ym: '2026-02', v: 149.9 },
  ],
  Canada: [
    { ym: '2025-04', v: 234.0 }, { ym: '2025-05', v: 194.0 }, { ym: '2025-06', v: 113.0 },
    { ym: '2025-07', v: 83.0 }, { ym: '2025-08', v: 44.0 }, { ym: '2025-09', v: 23.0 },
    { ym: '2025-10', v: null }, { ym: '2025-11', v: null }, { ym: '2025-12', v: null },
    { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
  APAC: [
    { ym: '2025-04', v: 8.3 }, { ym: '2025-05', v: 14.3 },
    { ym: '2025-06', v: null }, { ym: '2025-07', v: null }, { ym: '2025-08', v: null },
    { ym: '2025-09', v: null }, { ym: '2025-10', v: null }, { ym: '2025-11', v: null },
    { ym: '2025-12', v: null }, { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
};

const INFRA_DATA: Record<string, RegionalRow[]> = {
  AWS: [
    { ym: '2025-04', v: 551.3 }, { ym: '2025-05', v: 496.7 }, { ym: '2025-06', v: 522.5 },
    { ym: '2025-07', v: 548.0 }, { ym: '2025-08', v: 484.4 }, { ym: '2025-09', v: 470.6 },
    { ym: '2025-10', v: 330.1 }, { ym: '2025-11', v: 44.7 }, { ym: '2025-12', v: 482.2 },
    { ym: '2026-01', v: 29.6 }, { ym: '2026-02', v: 289.1 },
  ],
  GCP: [
    { ym: '2025-04', v: 8.0 }, { ym: '2025-05', v: 17.5 }, { ym: '2025-06', v: 24.0 },
    { ym: '2025-07', v: 13.3 }, { ym: '2025-08', v: 18.7 }, { ym: '2025-09', v: 28.8 },
    { ym: '2025-10', v: 37.6 }, { ym: '2025-11', v: 30.6 }, { ym: '2025-12', v: 24.2 },
    { ym: '2026-01', v: 39.3 }, { ym: '2026-02', v: 20.6 },
  ],
  WDAY: [
    { ym: '2025-04', v: 91.1 }, { ym: '2025-05', v: 105.9 }, { ym: '2025-06', v: 120.6 },
    { ym: '2025-07', v: 154.7 }, { ym: '2025-08', v: 144.2 }, { ym: '2025-09', v: 152.7 },
    { ym: '2025-10', v: 169.3 }, { ym: '2025-11', v: 159.5 }, { ym: '2025-12', v: 139.1 },
    { ym: '2026-01', v: 151.0 }, { ym: '2026-02', v: 105.3 },
  ],
};

interface TenantRow { name: string; days: number }
const FASTEST: TenantRow[] = [
  { name: 'NGHS', days: 1.0 }, { name: 'Jurists', days: 1.0 },
  { name: 'Deepwater', days: 1.0 }, { name: 'BobSDF', days: 1.0 },
  { name: 'Adcorp Group', days: 1.0 }, { name: 'AHRI', days: 1.0 },
  { name: 'Merit', days: 1.0 }, { name: 'Simon', days: 1.0 },
  { name: 'CDCN', days: 1.0 }, { name: 'ALS Global', days: 1.0 },
];
const SLOWEST: TenantRow[] = [
  { name: 'Texas Roadhouse', days: 18854.5 }, { name: "Nando's", days: 14184.2 },
  { name: 'Finish Line', days: 8292.0 }, { name: 'TJX', days: 3349.8 },
  { name: 'JLP', days: 2698.2 }, { name: 'Nandos ANZ', days: 2131.3 },
  { name: 'AG', days: 2111.7 }, { name: 'Five Below', days: 1577.8 },
  { name: 'Barclays', days: 1575.5 }, { name: 'Circle K', days: 1563.0 },
];

interface DistRow { bucket: string; count: number }
const DISTRIBUTION: DistRow[] = [
  { bucket: '1-30 days', count: 538 },
  { bucket: '31-60 days', count: 70 },
  { bucket: '61-90 days', count: 37 },
  { bucket: '91-120 days', count: 15 },
  { bucket: '120+ days', count: 57 },
];

interface AdoptionRow { ym: string; v: number }
const ADOPTION: AdoptionRow[] = [
  { ym: '2025-04', v: 537 }, { ym: '2025-05', v: 559 }, { ym: '2025-06', v: 598 },
  { ym: '2025-07', v: 546 }, { ym: '2025-08', v: 522 }, { ym: '2025-09', v: 527 },
  { ym: '2025-10', v: 534 }, { ym: '2025-11', v: 485 }, { ym: '2025-12', v: 300 },
  { ym: '2026-01', v: 340 }, { ym: '2026-02', v: 542 },
];

// ─── Shared chart helpers ───

const LABELS = TREND_DATA.map(d => d.ym);

const BASE_LINE_OPTS: any = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { family: 'Roboto', size: 12 } } },
    tooltip: { backgroundColor: '#0b1f42', titleFont: { family: 'Roboto' }, bodyFont: { family: 'Roboto' }, cornerRadius: 8, padding: 10 },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Roboto', size: 11 }, color: colors.blackPepper400 } },
    y: { grid: { color: colors.soap200 }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: colors.blackPepper400 } },
  },
};

const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  ...Object.keys(REGIONAL_DATA).map(r => ({ value: r, label: r })),
];

const INFRA_OPTIONS = [
  { value: 'all', label: 'All infrastructure' },
  ...Object.keys(INFRA_DATA).map(i => ({ value: i, label: i === 'WDAY' ? 'Workday DC' : i })),
];

const TENANT_SET = new Set(ALL_TENANTS);

const RANGE_OPTIONS = [
  { value: '6', label: 'Last 6 months' },
  { value: '11', label: 'Last 11 months' },
  { value: 'all', label: 'All data' },
];

type TabId = 'trend' | 'regional' | 'distribution' | 'infra' | 'tenants' | 'adoption';

const TABS: { id: TabId; label: string }[] = [
  { id: 'trend', label: 'Overall Trend' },
  { id: 'regional', label: 'By Region' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'infra', label: 'By Infrastructure' },
  { id: 'tenants', label: 'Top / Bottom Tenants' },
  { id: 'adoption', label: 'Adoption Growth' },
];

const InsightBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    padding="m"
    marginTop="m"
    style={{
      backgroundColor: colors.blueberry50 || '#EDF5FF',
      borderRadius: '8px',
      borderLeft: `3px solid ${colors.blueberry400}`,
      fontSize: '13px',
      lineHeight: 1.6,
      color: colors.blackPepper600,
    }}
  >
    {children}
  </Box>
);

const TenantBarRow: React.FC<{ name: string; days: number; maxDays: number; color: string }> = ({
  name, days, maxDays, color,
}) => (
  <Flex alignItems="center" gap="s" style={{ padding: '3px 0' }}>
    <BodyText size="small" style={{ minWidth: 130, fontWeight: 500 }}>{name}</BodyText>
    <Box style={{ flex: 1, height: 20, backgroundColor: colors.soap200, borderRadius: 4, overflow: 'hidden' }}>
      <Box style={{ width: `${Math.min(100, (days / maxDays) * 100)}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </Box>
    <BodyText size="small" style={{ minWidth: 80, textAlign: 'right', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
      {days.toLocaleString()}d
    </BodyText>
  </Flex>
);

const HeatmapGrid: React.FC<{ regionFilter: string }> = ({ regionFilter }) => {
  const regions = regionFilter === 'all'
    ? Object.keys(REGIONAL_DATA)
    : [regionFilter].filter(r => r in REGIONAL_DATA);

  const cellColor = (val: number | null): { bg: string; fg: string } => {
    if (val == null) return { bg: colors.soap100, fg: colors.soap400 };
    const intensity = Math.min(1, Math.max(0, (val - 20) / 220));
    const r = Math.round(255 - intensity * 60);
    const g = Math.round(255 - intensity * 130);
    const b = Math.round(255 - intensity * 180);
    return { bg: `rgb(${r},${g},${b})`, fg: intensity > 0.6 ? '#fff' : colors.blackPepper600 };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${LABELS.length}, 1fr)`, gap: 2, fontSize: 11 }}>
      <div />
      {LABELS.map(l => (
        <div key={l} style={{ textAlign: 'center', fontWeight: 700, color: colors.blackPepper400, padding: '6px 2px', fontSize: 10, textTransform: 'uppercase' }}>
          {l.replace('20', "'")}
        </div>
      ))}
      {regions.map(r => {
        const pts = REGIONAL_DATA[r] || [];
        return (
          <React.Fragment key={r}>
            <div style={{ fontWeight: 600, padding: '6px 4px', color: REGION_PALETTE[r] || colors.blackPepper500, fontSize: 12 }}>
              {r}
            </div>
            {LABELS.map((l, i) => {
              const val = pts[i]?.v ?? null;
              const { bg, fg } = cellColor(val);
              return (
                <div key={l} style={{ textAlign: 'center', padding: '6px 2px', borderRadius: 4, backgroundColor: bg, color: fg, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>
                  {val != null ? val.toFixed(0) : '-'}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TenantSearchInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <FormField>
      <FormField.Label htmlFor="ttf-tenant-search">Tenant</FormField.Label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="ttf-tenant-search"
          list="ttf-tenant-datalist"
          value={value}
          onChange={handleChange}
          placeholder="Search tenants..."
          autoComplete="off"
          style={{
            width: '100%', padding: '8px 32px 8px 12px', fontSize: '14px', lineHeight: '20px',
            border: '1px solid #C5C5C5', borderRadius: '4px', backgroundColor: '#FFFFFF',
            color: '#333333', boxSizing: 'border-box',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear tenant filter"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 16, color: colors.blackPepper400, lineHeight: 1, padding: '2px',
            }}
          >
            ×
          </button>
        )}
        <datalist id="ttf-tenant-datalist">
          {ALL_TENANTS.map(t => <option key={t} value={t} />)}
        </datalist>
      </div>
    </FormField>
  );
};

export const AvgTimeToFillDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('trend');
  const [regionFilter, setRegionFilter] = useState('all');
  const [infraFilter, setInfraFilter] = useState('all');
  const [tenantSearch, setTenantSearch] = useState('');
  const [rangeFilter, setRangeFilter] = useState('all');

  const activeTenant = useMemo(
    () => (tenantSearch && TENANT_SET.has(tenantSearch.toLowerCase()) ? tenantSearch.toLowerCase() : null),
    [tenantSearch],
  );

  const rangeSlice = useMemo(() => {
    if (rangeFilter === 'all') return 0;
    return Math.max(0, LABELS.length - Number(rangeFilter));
  }, [rangeFilter]);

  const labels = useMemo(() => LABELS.slice(rangeSlice), [rangeSlice]);
  const trendSliced = useMemo(() => TREND_DATA.slice(rangeSlice), [rangeSlice]);

  const latest = TREND_DATA[TREND_DATA.length - 1];
  const prev = TREND_DATA[TREND_DATA.length - 2];
  const avgDelta = latest.avg - prev.avg;

  const alignToLabels = useCallback((series: { ym: string; v: number }[]) => {
    const map = new Map<string, number>();
    for (const pt of series) {
      if (!map.has(pt.ym)) map.set(pt.ym, pt.v);
    }
    return labels.map(l => map.get(l) ?? null);
  }, [labels]);

  const trendChartData = useMemo(() => {
    const datasets: any[] = [{
      label: 'Overall Avg',
      data: trendSliced.map(d => d.avg),
      borderColor: CK.primary,
      backgroundColor: `${CK.primary}14`,
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: CK.primary,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      borderWidth: 2.5,
    }];

    if (regionFilter !== 'all' && REGIONAL_DATA[regionFilter]) {
      datasets.push({
        label: regionFilter,
        data: (REGIONAL_DATA[regionFilter]).slice(rangeSlice).map(p => p.v),
        borderColor: REGION_PALETTE[regionFilter] || CK.secondary,
        backgroundColor: 'transparent',
        borderDash: [6, 3],
        tension: 0.3, pointRadius: 4, borderWidth: 2, spanGaps: false,
      });
    }

    if (infraFilter !== 'all' && INFRA_DATA[infraFilter]) {
      datasets.push({
        label: infraFilter === 'WDAY' ? 'Workday DC' : infraFilter,
        data: (INFRA_DATA[infraFilter]).slice(rangeSlice).map(p => p.v),
        borderColor: INFRA_PALETTE[infraFilter] || CK.tertiary,
        backgroundColor: 'transparent',
        borderDash: [6, 3],
        tension: 0.3, pointRadius: 4, borderWidth: 2,
      });
    }

    if (activeTenant && TENANT_TIME_SERIES[activeTenant]) {
      datasets.push({
        label: activeTenant,
        data: alignToLabels(TENANT_TIME_SERIES[activeTenant]),
        borderColor: colors.cinnamon500,
        backgroundColor: 'transparent',
        borderDash: [4, 2],
        tension: 0.3, pointRadius: 4, borderWidth: 2.5, spanGaps: false,
      });
    }

    return { labels, datasets };
  }, [labels, trendSliced, regionFilter, infraFilter, activeTenant, rangeSlice, alignToLabels]);

  const regionalChartData = useMemo(() => {
    const regions = regionFilter === 'all' ? Object.keys(REGIONAL_DATA) : [regionFilter];
    return {
      labels,
      datasets: regions.filter(r => r in REGIONAL_DATA).map(r => ({
        label: r,
        data: (REGIONAL_DATA[r] || []).slice(rangeSlice).map(p => p.v),
        borderColor: REGION_PALETTE[r],
        backgroundColor: REGION_PALETTE[r],
        tension: 0.3, pointRadius: 3, pointBorderColor: '#fff', pointBorderWidth: 1.5, borderWidth: 2.5, spanGaps: false,
      })),
    };
  }, [labels, regionFilter, rangeSlice]);

  const infraChartData = useMemo(() => {
    const infras = infraFilter === 'all' ? Object.keys(INFRA_DATA) : [infraFilter];
    return {
      labels,
      datasets: infras.filter(i => i in INFRA_DATA).map(i => ({
        label: i === 'WDAY' ? 'Workday DC' : i,
        data: (INFRA_DATA[i] || []).slice(rangeSlice).map(p => p.v),
        borderColor: INFRA_PALETTE[i],
        backgroundColor: INFRA_PALETTE[i],
        tension: 0.3, pointRadius: 3, pointBorderColor: '#fff', pointBorderWidth: 1.5, borderWidth: 2.5,
      })),
    };
  }, [labels, infraFilter, rangeSlice]);

  const distChartData = useMemo(() => ({
    labels: DISTRIBUTION.map(d => d.bucket),
    datasets: [{
      label: 'Tenants',
      data: DISTRIBUTION.map(d => d.count),
      backgroundColor: [colors.greenApple400, CK.primary, colors.blueberry300, CK.tertiary, colors.cinnamon400],
      borderRadius: 6,
      borderSkipped: false as const,
      barPercentage: 0.7,
    }],
  }), []);

  const adoptionChartData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Active Tenants',
      data: ADOPTION.slice(rangeSlice).map(d => d.v),
      backgroundColor: ADOPTION.slice(rangeSlice).map(d =>
        d.ym.startsWith('2026') ? CK.primary : `${CK.primary}80`
      ),
      borderRadius: 4,
      borderSkipped: false as const,
      barPercentage: 0.65,
    }],
  }), [labels, rangeSlice]);

  const filteredFastest = !activeTenant ? FASTEST : FASTEST.filter(t => t.name.toLowerCase() === activeTenant);
  const filteredSlowest = !activeTenant ? SLOWEST : SLOWEST.filter(t => t.name.toLowerCase() === activeTenant);
  const hasOverlays = regionFilter !== 'all' || infraFilter !== 'all' || !!activeTenant;

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="avg-time-to-fill" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 8 }}>
          <a href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/value-realization-metrics`} style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Value Realisation</a>
        </div>
        <PageHeader
          title="Average Time to Fill"
          subtitle={"Historical tenant-level average time to fill from requisition open to filled position, shown here as the monthly mean across reporting tenants.\nSource: materialised 10 Apr 2026 SANDBOX extract originally keyed to IUM 2359 · keep as a legacy reference until a fresh live metric-name replacement is revalidated."}
        />

        <Flex gap="m" marginBottom="l" style={{ flexWrap: 'wrap' }}>
          <MetricCard
            label="Avg days to fill"
            value={latest.avg.toFixed(1)}
            helperText={`Feb 2026 · ${latest.tenants.toLocaleString()} active tenants`}
            changeIndicator={{
              text: `${avgDelta > 0 ? '+' : ''}${avgDelta.toFixed(1)} vs prev month`,
              sentiment: avgDelta > 0 ? 'negative' : 'positive',
            }}
            tooltip="Historical 10 Apr 2026 extract of tenant-level average time-to-fill values for the month. Retained as a legacy SANDBOX snapshot while the live metric-name mapping is revalidated."
          />
          <MetricCard
            label="Active tenants"
            value={latest.tenants.toLocaleString()}
            helperText="Tenants with non-zero time to fill"
            changeIndicator={{ text: `${((latest.tenants / TREND_DATA[0].tenants - 1) * 100).toFixed(0)}% growth`, sentiment: 'positive' }}
            tooltip="Count of tenants reporting a non-zero time to fill in the latest month after filters."
          />
          <MetricCard
            label="Fastest fill"
            value={`${latest.min.toFixed(1)}d`}
            helperText="Minimum avg days reported"
            tooltip="Smallest tenant-level average time to fill in the latest month."
          />
          <MetricCard
            label="Max fill time"
            value={`${(latest.max / 1000).toFixed(1)}k d`}
            helperText="Extreme outlier (data quality)"
            changeIndicator={{ text: 'Outlier', sentiment: 'neutral' }}
            tooltip="Largest tenant-level average in the series slice shown (scaled display for very large outliers)."
          />
        </Flex>

        <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, marginBottom: '16px' }}>
          <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper500, marginBottom: '12px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
            Filters
          </BodyText>
          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="ttf-region-filter" label="Region" value={regionFilter} onChange={setRegionFilter} options={REGION_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="ttf-infra-filter" label="Infrastructure" value={infraFilter} onChange={setInfraFilter} options={INFRA_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <TenantSearchInput value={tenantSearch} onChange={setTenantSearch} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="ttf-range-filter" label="Time Range" value={rangeFilter} onChange={setRangeFilter} options={RANGE_OPTIONS} />
            </Box>
          </Flex>
        </Card>

        <Flex gap="xs" marginBottom="m" style={{ borderBottom: `1px solid ${colors.soap300}`, paddingBottom: '8px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <SecondaryButton
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={activeTab === t.id ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
            >
              {t.label}
            </SecondaryButton>
          ))}
        </Flex>

        {activeTab === 'trend' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Overall Monthly Trend</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Average days to fill across all active tenants (non-zero values only)
              {hasOverlays && ' — filtered overlays shown as dashed lines'}
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line
                data={trendChartData}
                options={{
                  ...BASE_LINE_OPTS,
                  plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: hasOverlays } },
                  scales: {
                    ...BASE_LINE_OPTS.scales,
                    y: { ...BASE_LINE_OPTS.scales.y, ...(hasOverlays ? {} : { min: 100, max: 200 }) },
                  },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Average time to fill fluctuates between 120-187 days, considerably higher than time to hire. A July 2025 peak (187.4 days) followed by a November dip suggests seasonal patterns. Feb 2026 shows a decline to 127.9 days - potentially improving efficiency.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'regional' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">By Geographic Region</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Segmented by data centre location (ATL=Americas-East, PDX/ORE=Americas-West, DUB=EMEA, MTL=Canada, SIN=APAC)
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line data={regionalChartData} options={BASE_LINE_OPTS} />
            </Box>
            <Box style={{ marginTop: '24px' }}>
              <Heading size="small" marginBottom="xs">Regional Heatmap</Heading>
              <HeatmapGrid regionFilter={regionFilter} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Canada showed the longest fill times early (234 days Apr 2025) but data drops off after Sep 2025. Americas-East peaks at 229.9 days (Nov 2025). Americas-West saw a dramatic drop from 215.6 to 30.2 days over the period - worth investigating the data quality.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'distribution' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Tenant Distribution</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              How tenants cluster by average time to fill (last 90 days, distinct tenants per bucket)
            </BodyText>
            <Box style={{ height: 340 }}>
              <Bar
                data={distChartData}
                options={{
                  ...BASE_LINE_OPTS,
                  plugins: {
                    ...BASE_LINE_OPTS.plugins,
                    legend: { display: false },
                    tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toLocaleString()} tenants` } },
                  },
                  scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: true } },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> The vast majority of tenants (538) fill positions within 1-30 days. Only 57 tenants take over 120 days. This is a much tighter distribution than time to hire, suggesting most customers who track fill time are actively managing it.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'infra' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">By Cloud Infrastructure</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Monthly trend segmented by hosting type (AWS, GCP, Workday DC)
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line data={infraChartData} options={BASE_LINE_OPTS} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> AWS tenants show extremely volatile fill times (29.6-551.3 days), suggesting outlier tenants are skewing the data. GCP tenants are consistently the fastest (8-39 days). Workday DC tenants track the overall average most closely (91-169 days).
            </InsightBox>
          </Card>
        )}

        {activeTab === 'tenants' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Top 10 Fastest &amp; Slowest Tenants</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Based on 6-month average, minimum 3 months data
            </BodyText>
            <Flex gap="xl" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: '1 1 360px' }}>
                <BodyText size="small" style={{ fontWeight: 700, color: colors.greenApple600, marginBottom: '12px' }}>
                  Fastest Tenants
                </BodyText>
                {(filteredFastest.length > 0 ? filteredFastest : FASTEST).map(t => (
                  <TenantBarRow key={t.name} name={t.name} days={t.days} maxDays={2} color={colors.greenApple500} />
                ))}
              </Box>
              <Box style={{ flex: '1 1 360px' }}>
                <BodyText size="small" style={{ fontWeight: 700, color: colors.cinnamon500, marginBottom: '12px' }}>
                  Slowest Tenants
                </BodyText>
                {(filteredSlowest.length > 0 ? filteredSlowest : SLOWEST).map(t => (
                  <TenantBarRow key={t.name} name={t.name} days={t.days} maxDays={20000} color={colors.cinnamon500} />
                ))}
              </Box>
            </Flex>
            <InsightBox>
              <strong>Insight:</strong> The slowest tenants show extreme values (Texas Roadhouse at 18,854 days) - these are almost certainly data quality issues or misconfigurations rather than actual fill times. 10 tenants tie at 1.0 day for the fastest fill.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'adoption' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Adoption Growth</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Monthly count of tenants with non-zero Average Time to Fill
            </BodyText>
            <Box style={{ height: 340 }}>
              <Bar
                data={adoptionChartData}
                options={{
                  ...BASE_LINE_OPTS,
                  plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: false } },
                  scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: false, min: 200 } },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Active tenants peaked at 598 (Jun 2025), dropped to 300 in Dec 2025 (holiday period), and recovered to 542 by Feb 2026. The metric tracks ~540-600 tenants consistently, far fewer than the ~3,400 tenants that track Time to Hire.
            </InsightBox>
          </Card>
        )}

        <BodyText size="small" color={colors.blackPepper400} marginTop="l" style={{ lineHeight: 1.6, fontSize: 12 }}>
          <strong>Data notes:</strong> Source: historical Pharos extract from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>internal_usage_metrics_report_kafka</code> using the older 2359 Time to Fill assumption · SANDBOX environment · Non-zero values only · Geographic regions mapped from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>wd_dc_physical</code> data centre codes · Values represent average calendar days from requisition open to position filled · Current live warehouse discovery now shows 2359 on applicant age-band metrics, so do not reuse this ID without metric-name revalidation.
        </BodyText>
        </Box>
      </Box>
    </Flex>
  );
};

export default AvgTimeToFillDashboard;
