import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { PageHeader, MetricCard, FormSelect, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { ALL_TENANTS, TENANT_TIME_SERIES } from './data-avg-time-to-hire';
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

// ─── Workday-aligned chart palette ───
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

// ─── Raw data (Pharos IUM metric 2358, SANDBOX env, queried 10 Apr 2026) ───

interface TrendRow {
  ym: string;
  avg: number;
  tenants: number;
  min: number;
  max: number;
}

const TREND_DATA: TrendRow[] = [
  { ym: '2025-01', avg: 74.5, tenants: 3012, min: 1.0, max: 494.0 },
  { ym: '2025-02', avg: 72.0, tenants: 3041, min: 1.0, max: 482.9 },
  { ym: '2025-03', avg: 70.0, tenants: 3080, min: 0.1, max: 415.2 },
  { ym: '2025-04', avg: 71.3, tenants: 3116, min: 0.9, max: 451.3 },
  { ym: '2025-05', avg: 72.1, tenants: 6195, min: 0.5, max: 478.7 },
  { ym: '2025-06', avg: 71.8, tenants: 3118, min: 0.5, max: 481.2 },
  { ym: '2025-07', avg: 71.0, tenants: 3153, min: 0.3, max: 499.3 },
  { ym: '2025-08', avg: 68.8, tenants: 3196, min: 0.7, max: 478.4 },
  { ym: '2025-09', avg: 68.0, tenants: 3259, min: 1.0, max: 479.5 },
  { ym: '2025-10', avg: 67.2, tenants: 3259, min: 0.5, max: 499.0 },
  { ym: '2025-11', avg: 69.6, tenants: 3228, min: 0.9, max: 470.4 },
  { ym: '2025-12', avg: 74.1, tenants: 2546, min: 0.5, max: 494.1 },
  { ym: '2026-01', avg: 76.8, tenants: 2597, min: 0.2, max: 497.7 },
  { ym: '2026-02', avg: 71.7, tenants: 3404, min: 0.8, max: 490.4 },
];

interface RegionalRow { ym: string; v: number | null }
const REGIONAL_DATA: Record<string, RegionalRow[]> = {
  'Americas-East': [
    { ym: '2025-01', v: 79.2 }, { ym: '2025-02', v: 75.8 }, { ym: '2025-03', v: 74.2 },
    { ym: '2025-04', v: 75.1 }, { ym: '2025-05', v: 75.6 }, { ym: '2025-06', v: 73.3 },
    { ym: '2025-07', v: 74.4 }, { ym: '2025-08', v: 71.2 }, { ym: '2025-09', v: 70.4 },
    { ym: '2025-10', v: 70.5 }, { ym: '2025-11', v: 73.8 }, { ym: '2025-12', v: 77.0 },
    { ym: '2026-01', v: 79.3 }, { ym: '2026-02', v: 77.3 },
  ],
  'Americas-West': [
    { ym: '2025-01', v: 68.0 }, { ym: '2025-02', v: 68.5 }, { ym: '2025-03', v: 66.2 },
    { ym: '2025-04', v: 68.9 }, { ym: '2025-05', v: 69.4 }, { ym: '2025-06', v: 68.9 },
    { ym: '2025-07', v: 68.6 }, { ym: '2025-08', v: 65.7 }, { ym: '2025-09', v: 66.3 },
    { ym: '2025-10', v: 66.2 }, { ym: '2025-11', v: 70.1 }, { ym: '2025-12', v: 75.0 },
    { ym: '2026-01', v: 80.4 }, { ym: '2026-02', v: 71.5 },
  ],
  EMEA: [
    { ym: '2025-01', v: 78.3 }, { ym: '2025-02', v: 73.3 }, { ym: '2025-03', v: 71.0 },
    { ym: '2025-04', v: 70.3 }, { ym: '2025-05', v: 73.6 }, { ym: '2025-06', v: 77.8 },
    { ym: '2025-07', v: 73.4 }, { ym: '2025-08', v: 73.4 }, { ym: '2025-09', v: 77.9 },
    { ym: '2025-10', v: 71.6 }, { ym: '2025-11', v: 72.3 }, { ym: '2025-12', v: 87.0 },
    { ym: '2026-01', v: 87.7 }, { ym: '2026-02', v: 76.7 },
  ],
  Canada: [
    { ym: '2025-01', v: 61.7 }, { ym: '2025-02', v: 58.2 }, { ym: '2025-03', v: 55.8 },
    { ym: '2025-04', v: 56.6 }, { ym: '2025-05', v: 54.3 }, { ym: '2025-06', v: 58.8 },
    { ym: '2025-07', v: 58.4 }, { ym: '2025-08', v: 55.3 }, { ym: '2025-09', v: 59.1 },
    { ym: '2025-10', v: null }, { ym: '2025-11', v: null }, { ym: '2025-12', v: null },
    { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
  APAC: [
    { ym: '2025-01', v: 49.5 }, { ym: '2025-02', v: 66.9 }, { ym: '2025-03', v: 52.6 },
    { ym: '2025-04', v: 64.1 }, { ym: '2025-05', v: 72.2 }, { ym: '2025-06', v: null },
    { ym: '2025-07', v: null }, { ym: '2025-08', v: null }, { ym: '2025-09', v: null },
    { ym: '2025-10', v: null }, { ym: '2025-11', v: null }, { ym: '2025-12', v: null },
    { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
};

/** Pharos IUM `wd_dc_type` (AWS, GCP, Workday DC) — not industry; see data notes footer. */
const INFRA_DATA: Record<string, RegionalRow[]> = {
  AWS: [
    { ym: '2025-01', v: 57.3 }, { ym: '2025-02', v: 53.3 }, { ym: '2025-03', v: 51.3 },
    { ym: '2025-04', v: 51.6 }, { ym: '2025-05', v: 53.9 }, { ym: '2025-06', v: 53.0 },
    { ym: '2025-07', v: 54.4 }, { ym: '2025-08', v: 53.5 }, { ym: '2025-09', v: 53.4 },
    { ym: '2025-10', v: 56.1 }, { ym: '2025-11', v: 56.2 }, { ym: '2025-12', v: 60.0 },
    { ym: '2026-01', v: 61.0 }, { ym: '2026-02', v: 58.7 },
  ],
  GCP: [
    { ym: '2025-01', v: 69.9 }, { ym: '2025-02', v: 74.1 }, { ym: '2025-03', v: 74.8 },
    { ym: '2025-04', v: 75.7 }, { ym: '2025-05', v: 70.7 }, { ym: '2025-06', v: 75.0 },
    { ym: '2025-07', v: 68.3 }, { ym: '2025-08', v: 76.9 }, { ym: '2025-09', v: 69.1 },
    { ym: '2025-10', v: 68.0 }, { ym: '2025-11', v: 67.5 }, { ym: '2025-12', v: 66.0 },
    { ym: '2026-01', v: 64.0 }, { ym: '2026-02', v: 67.0 },
  ],
  WDAY: [
    { ym: '2025-01', v: 76.2 }, { ym: '2025-02', v: 73.9 }, { ym: '2025-03', v: 71.9 },
    { ym: '2025-04', v: 73.5 }, { ym: '2025-05', v: 74.3 }, { ym: '2025-06', v: 74.1 },
    { ym: '2025-07', v: 73.5 }, { ym: '2025-08', v: 70.8 }, { ym: '2025-09', v: 70.4 },
    { ym: '2025-10', v: 69.2 }, { ym: '2025-11', v: 72.3 }, { ym: '2025-12', v: 78.3 },
    { ym: '2026-01', v: 81.2 }, { ym: '2026-02', v: 75.2 },
  ],
};

interface TenantRow { name: string; days: number }
const FASTEST: TenantRow[] = [
  { name: 'WTO', days: 5.3 }, { name: 'Resolve Tech', days: 6.4 },
  { name: 'El Paraguas', days: 6.5 }, { name: 'Seafrigo', days: 7.3 },
  { name: 'Tegria', days: 7.6 }, { name: 'WeAreEverise', days: 7.8 },
  { name: 'GFR', days: 7.9 }, { name: 'Wegmans', days: 7.9 },
  { name: 'APA', days: 8.4 }, { name: 'CFX Way', days: 8.7 },
];
const SLOWEST: TenantRow[] = [
  { name: 'Salad and Go', days: 452.4 }, { name: "Peet's Coffee", days: 450.9 },
  { name: 'Revature', days: 414.3 }, { name: "Dave & Buster's", days: 379.4 },
  { name: 'Arriva', days: 378.1 }, { name: 'RJET', days: 361.9 },
  { name: 'GoBeacon', days: 353.2 }, { name: 'Priority One', days: 351.8 },
  { name: 'Napa Anesthesia', days: 343.7 }, { name: 'NASCAR', days: 324.3 },
];

interface DistRow { bucket: string; count: number }
const DISTRIBUTION: DistRow[] = [
  { bucket: 'No hires (0)', count: 3154 },
  { bucket: '1-30 days', count: 906 },
  { bucket: '31-60 days', count: 2380 },
  { bucket: '61-90 days', count: 1817 },
  { bucket: '91-120 days', count: 802 },
  { bucket: '120+ days', count: 569 },
];

interface AdoptionRow { ym: string; v: number }
const ADOPTION: AdoptionRow[] = [
  { ym: '2025-01', v: 3012 }, { ym: '2025-02', v: 3041 }, { ym: '2025-03', v: 3080 },
  { ym: '2025-04', v: 3115 }, { ym: '2025-05', v: 3136 }, { ym: '2025-06', v: 3114 },
  { ym: '2025-07', v: 3152 }, { ym: '2025-08', v: 3143 }, { ym: '2025-09', v: 3233 },
  { ym: '2025-10', v: 3257 }, { ym: '2025-11', v: 3228 }, { ym: '2025-12', v: 2536 },
  { ym: '2026-01', v: 2597 }, { ym: '2026-02', v: 3403 },
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

// ─── Filter bar value lists ───

const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  ...Object.keys(REGIONAL_DATA).map(r => ({ value: r, label: r })),
];

const INFRA_OPTIONS = [
  { value: 'all', label: 'All cloud platforms' },
  ...Object.keys(INFRA_DATA).map(i => ({ value: i, label: i === 'WDAY' ? 'Workday DC' : i })),
];

const TENANT_SET = new Set(ALL_TENANTS);

const RANGE_OPTIONS = [
  { value: '6', label: 'Last 6 months' },
  { value: '12', label: 'Last 12 months' },
  { value: 'all', label: 'All data' },
];

// ─── Tab definitions ───

type TabId = 'trend' | 'regional' | 'distribution' | 'infra' | 'tenants' | 'adoption';

const TABS: { id: TabId; label: string }[] = [
  { id: 'trend', label: 'Overall Trend' },
  { id: 'regional', label: 'By Region' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'infra', label: 'By cloud platform' },
  { id: 'tenants', label: 'Top / Bottom Tenants' },
  { id: 'adoption', label: 'Adoption Growth' },
];

// ─── Sub-components ───

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
      <Box style={{ width: `${(days / maxDays) * 100}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </Box>
    <BodyText size="small" style={{ minWidth: 60, textAlign: 'right', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
      {days}d
    </BodyText>
  </Flex>
);

// ─── Heatmap ───

const HeatmapGrid: React.FC<{ regionFilter: string }> = ({ regionFilter }) => {
  const regions = regionFilter === 'all'
    ? Object.keys(REGIONAL_DATA)
    : [regionFilter].filter(r => r in REGIONAL_DATA);

  const cellColor = (val: number | null): { bg: string; fg: string } => {
    if (val == null) return { bg: colors.soap100, fg: colors.soap400 };
    const intensity = Math.min(1, Math.max(0, (val - 45) / 45));
    const r = Math.round(255 - intensity * 60);
    const g = Math.round(255 - intensity * 130);
    const b = Math.round(255 - intensity * 180);
    return { bg: `rgb(${r},${g},${b})`, fg: intensity > 0.6 ? '#fff' : colors.blackPepper600 };
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `120px repeat(${LABELS.length}, 1fr)`,
      gap: 2,
      fontSize: 11,
    }}>
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

// ─── Main component ───

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
      <FormField.Label htmlFor="tenant-search">Tenant</FormField.Label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="tenant-search"
          list="tenant-datalist"
          value={value}
          onChange={handleChange}
          placeholder="Search tenants..."
          autoComplete="off"
          style={{
            width: '100%',
            padding: '8px 32px 8px 12px',
            fontSize: '14px',
            lineHeight: '20px',
            border: '1px solid #C5C5C5',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: '#333333',
            boxSizing: 'border-box',
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
        <datalist id="tenant-datalist">
          {ALL_TENANTS.map(t => <option key={t} value={t} />)}
        </datalist>
      </div>
    </FormField>
  );
};

export const AvgTimeToHireDashboard: React.FC = () => {
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
    return LABELS.length - Number(rangeFilter);
  }, [rangeFilter]);

  const labels = useMemo(() => LABELS.slice(rangeSlice), [rangeSlice]);
  const trendSliced = useMemo(() => TREND_DATA.slice(rangeSlice), [rangeSlice]);

  const latest = TREND_DATA[TREND_DATA.length - 1];
  const prev = TREND_DATA[TREND_DATA.length - 2];
  const avgDelta = latest.avg - prev.avg;

  // ─── Helpers: align tenant time series to our label set ───

  const alignToLabels = useCallback((series: { ym: string; v: number }[]) => {
    const map = new Map<string, number>();
    for (const pt of series) {
      if (!map.has(pt.ym)) map.set(pt.ym, pt.v);
    }
    return labels.map(l => map.get(l) ?? null);
  }, [labels]);

  // ─── Chart datasets (filtered, cross-chart) ───

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
        tension: 0.3,
        pointRadius: 3,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
        spanGaps: false,
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
        tension: 0.3,
        pointRadius: 3,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
      })),
    };
  }, [labels, infraFilter, rangeSlice]);

  const distChartData = useMemo(() => ({
    labels: DISTRIBUTION.map(d => d.bucket),
    datasets: [{
      label: 'Tenants',
      data: DISTRIBUTION.map(d => d.count),
      backgroundColor: [
        colors.soap300, colors.greenApple400, CK.primary, colors.blueberry300, CK.tertiary, colors.cinnamon400,
      ],
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

  // ─── Filtered tenant lists ───
  const filteredFastest = !activeTenant
    ? FASTEST
    : FASTEST.filter(t => t.name.toLowerCase() === activeTenant);
  const filteredSlowest = !activeTenant
    ? SLOWEST
    : SLOWEST.filter(t => t.name.toLowerCase() === activeTenant);

  const hasOverlays = regionFilter !== 'all' || infraFilter !== 'all' || !!activeTenant;

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="avg-time-to-hire" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 8 }}>
          <a href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/value-realization-metrics`} style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Value Realisation</a>
        </div>
        <PageHeader
          title="Average Time to Hire"
          subtitle={"Average tenant-level time to hire from first job posting to latest accepted offer, shown here as the monthly mean across reporting tenants.\nSource: dw.swh_raw.internal_usage_metrics_report_kafka · live metric-name resolution to Average Time to Hire (2358) · SANDBOX only in the current accessible warehouse."}
        />

        {/* ─── Filters ─── */}
        <Card
          padding="m"
          style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, marginBottom: '16px' }}
        >
          <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper500, marginBottom: '12px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
            Filters
          </BodyText>
          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="region-filter" label="Region" value={regionFilter} onChange={setRegionFilter} options={REGION_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="cloud-platform-filter" label="Cloud platform" value={infraFilter} onChange={setInfraFilter} options={INFRA_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <TenantSearchInput value={tenantSearch} onChange={setTenantSearch} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="range-filter" label="Time Range" value={rangeFilter} onChange={setRangeFilter} options={RANGE_OPTIONS} />
            </Box>
          </Flex>
        </Card>

        {/* ─── KPI row ─── */}
        <Flex gap="m" marginBottom="l" style={{ flexWrap: 'wrap' }}>
          <MetricCard
            label="Avg days to hire"
            value={latest.avg.toFixed(1)}
            helperText={`Feb 2026 · ${latest.tenants.toLocaleString()} active tenants`}
            changeIndicator={{
              text: `${avgDelta > 0 ? '+' : ''}${avgDelta.toFixed(1)} vs prev month`,
              sentiment: avgDelta > 0 ? 'negative' : 'positive',
            }}
            tooltip="IUM2358: mean of tenant-level average time-to-hire values for the month (SANDBOX tenants with non-zero data)."
          />
          <MetricCard
            label="Active tenants"
            value={latest.tenants.toLocaleString()}
            helperText="Tenants with non-zero time to hire"
            changeIndicator={{ text: '+13% YoY', sentiment: 'positive' }}
            tooltip="Count of tenants reporting a non-zero time to hire in the latest month after filters."
          />
          <MetricCard
            label="Fastest tenant"
            value={`${latest.min.toFixed(1)}d`}
            helperText="Minimum avg days reported"
            tooltip="Smallest tenant-level average time to hire observed in the latest month (distribution floor)."
          />
          <MetricCard
            label="P90 slowest"
            value={`${latest.max.toFixed(0)}d`}
            helperText="Capped at 500 days"
            changeIndicator={{ text: 'Outlier range', sentiment: 'neutral' }}
            tooltip="High end of the tenant-level average distribution in the latest month (capped to limit bad data spikes)."
          />
        </Flex>

        {/* ─── Tabs ─── */}
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

        {/* ─── Chart panels ─── */}

        {activeTab === 'trend' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Overall Monthly Trend</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Average days to hire across all active tenants (non-zero values only)
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
                    y: { ...BASE_LINE_OPTS.scales.y, ...(hasOverlays ? {} : { min: 60, max: 85 }) },
                  },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Time to hire has been relatively stable at 68-77 days over the past 14 months, with seasonal upticks in December-January (holiday slowdowns) and a slight downward trend through mid-2025 before rebounding.
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
              <Line
                data={regionalChartData}
                options={{ ...BASE_LINE_OPTS, scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, min: 40, max: 95 } } }}
              />
            </Box>
            <Box style={{ marginTop: '24px' }}>
              <Heading size="small" marginBottom="xs">Regional Heatmap</Heading>
              <HeatmapGrid regionFilter={regionFilter} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> EMEA consistently has the highest time to hire (73-88 days), peaking at 87.7 days in Jan 2026. Canada is the fastest major region (~55-61 days). APAC data is sparse after May 2025 but trended lower when available.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'distribution' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Tenant Distribution</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              How tenants cluster by average time to hire (last 90 days, distinct tenants per bucket)
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
              <strong>Insight:</strong> The largest active cohort is 31-60 days (2,380 tenants), followed by 61-90 days (1,817). A significant 3,154 tenants report zero - no completed hires in reporting period. 569 tenants exceed 120 days.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'infra' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">By cloud platform (wd_dc_type)</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Monthly trend segmented by hosting type (AWS, GCP, Workday DC)
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line
                data={infraChartData}
                options={{ ...BASE_LINE_OPTS, scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, min: 45, max: 85 } } }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> AWS-hosted tenants consistently hire ~15-20 days faster than Workday DC tenants (53-61 vs 70-81 days). This likely reflects that AWS tenants tend to be newer, cloud-native customers. AWS tenant count is growing rapidly (797 to 1,278).
            </InsightBox>
          </Card>
        )}

        {activeTab === 'tenants' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Top 10 Fastest &amp; Slowest Tenants</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Based on 6-month average, minimum 3 months data, capped at 500 days
            </BodyText>
            <Flex gap="xl" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: '1 1 360px' }}>
                <BodyText size="small" style={{ fontWeight: 700, color: colors.greenApple600, marginBottom: '12px' }}>
                  Fastest Tenants
                </BodyText>
                {(filteredFastest.length > 0 ? filteredFastest : FASTEST).map(t => (
                  <TenantBarRow key={t.name} name={t.name} days={t.days} maxDays={10} color={colors.greenApple500} />
                ))}
              </Box>
              <Box style={{ flex: '1 1 360px' }}>
                <BodyText size="small" style={{ fontWeight: 700, color: colors.cinnamon500, marginBottom: '12px' }}>
                  Slowest Tenants
                </BodyText>
                {(filteredSlowest.length > 0 ? filteredSlowest : SLOWEST).map(t => (
                  <TenantBarRow key={t.name} name={t.name} days={t.days} maxDays={460} color={colors.cinnamon500} />
                ))}
              </Box>
            </Flex>
            <InsightBox>
              <strong>Insight:</strong> Fastest tenants average 5-9 days (WTO, Resolve Tech, Seafrigo - small/specialist firms). Slowest reach 350-450 days (Salad and Go, Peet's, Revature) - may reflect high-volume seasonal hiring cycles or data quality issues.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'adoption' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Adoption Growth</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Monthly count of tenants with non-zero Average Time to Hire (active recruiting)
            </BodyText>
            <Box style={{ height: 340 }}>
              <Bar
                data={adoptionChartData}
                options={{
                  ...BASE_LINE_OPTS,
                  plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: false } },
                  scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: false, min: 2200 } },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Active recruiting tenants grew from 3,012 (Jan 2025) to 3,403 (Feb 2026) - a 13% increase. The December dip reflects holiday inactivity. Feb 2026 (3,403) is the highest on record.
            </InsightBox>
          </Card>
        )}

        {/* ─── Footer ─── */}
        <BodyText size="small" color={colors.blackPepper400} marginTop="l" style={{ lineHeight: 1.6, fontSize: 12 }}>
          <strong>Data notes:</strong> Source: Pharos <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>internal_usage_metrics_report_kafka</code> · metric_id 2358 · SANDBOX environment · Non-zero values only · Geographic regions mapped from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>wd_dc_physical</code> data centre codes · Values represent average calendar days from requisition open to hire completion · Industry segmentation not available natively in IUM data.
        </BodyText>
        </Box>
      </Box>
    </Flex>
  );
};

export default AvgTimeToHireDashboard;
