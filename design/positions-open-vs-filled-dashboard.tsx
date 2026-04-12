import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { PageHeader, MetricCard, FormSelect, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import {
  ALL_TENANTS_OPEN,
  ALL_TENANTS_FILLED,
  OPEN_TENANT_TIME_SERIES,
  FILLED_TENANT_TIME_SERIES,
} from './data-positions';
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
  secondary: colors.greenApple500,
  tertiary: colors.cantaloupe400,
  quaternary: colors.cinnamon400,
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

// ─── Raw data (Pharos IUM metrics 2360 + 2361, SANDBOX, queried 10 Apr 2026) ───

interface TrendRow { ym: string; avg: number; tenants: number; min: number; max: number }

const OPEN_TREND: TrendRow[] = [
  { ym: '2025-03', avg: 210.3, tenants: 773, min: 1.0, max: 23347.0 },
  { ym: '2025-04', avg: 204.1, tenants: 772, min: 1.0, max: 20865.0 },
  { ym: '2025-05', avg: 212.7, tenants: 787, min: 1.0, max: 23922.0 },
  { ym: '2025-06', avg: 220.5, tenants: 793, min: 1.0, max: 24961.0 },
  { ym: '2025-07', avg: 231.4, tenants: 821, min: 1.0, max: 26145.0 },
  { ym: '2025-08', avg: 206.0, tenants: 799, min: 1.0, max: 23902.0 },
  { ym: '2025-09', avg: 213.3, tenants: 836, min: 1.0, max: 24639.0 },
  { ym: '2025-10', avg: 223.3, tenants: 827, min: 1.0, max: 22585.0 },
  { ym: '2025-11', avg: 195.2, tenants: 835, min: 1.0, max: 19225.0 },
  { ym: '2025-12', avg: 99.6, tenants: 607, min: 1.0, max: 3030.0 },
  { ym: '2026-01', avg: 101.3, tenants: 599, min: 1.0, max: 3090.0 },
  { ym: '2026-02', avg: 177.8, tenants: 871, min: 1.0, max: 19631.0 },
];

const FILLED_TREND: TrendRow[] = [
  { ym: '2025-06', avg: 21.0, tenants: 3956, min: 1.0, max: 627.4 },
  { ym: '2025-07', avg: 21.0, tenants: 3990, min: 1.0, max: 623.9 },
  { ym: '2025-08', avg: 21.5, tenants: 3975, min: 1.0, max: 1856.0 },
  { ym: '2025-09', avg: 21.1, tenants: 4059, min: 1.0, max: 1288.1 },
  { ym: '2025-10', avg: 20.9, tenants: 4113, min: 1.0, max: 1069.4 },
  { ym: '2025-11', avg: 21.3, tenants: 4180, min: 1.0, max: 1505.8 },
  { ym: '2025-12', avg: 19.1, tenants: 3392, min: 1.0, max: 1457.3 },
  { ym: '2026-01', avg: 20.6, tenants: 3367, min: 1.0, max: 1406.3 },
  { ym: '2026-02', avg: 21.9, tenants: 4335, min: 1.0, max: 880.2 },
];

interface RegionalRow { ym: string; v: number | null }

const OPEN_REGIONAL: Record<string, RegionalRow[]> = {
  'Americas-East': [
    { ym: '2025-03', v: 272.5 }, { ym: '2025-04', v: 277.6 }, { ym: '2025-05', v: 299.1 },
    { ym: '2025-06', v: 309.9 }, { ym: '2025-07', v: 321.5 }, { ym: '2025-08', v: 303.5 },
    { ym: '2025-09', v: 340.3 }, { ym: '2025-10', v: 339.0 }, { ym: '2025-11', v: 257.3 },
    { ym: '2025-12', v: 84.2 }, { ym: '2026-01', v: 80.5 }, { ym: '2026-02', v: 245.6 },
  ],
  'Americas-West': [
    { ym: '2025-03', v: 287.5 }, { ym: '2025-04', v: 280.4 }, { ym: '2025-05', v: 278.9 },
    { ym: '2025-06', v: 273.9 }, { ym: '2025-07', v: 286.5 }, { ym: '2025-08', v: 224.8 },
    { ym: '2025-09', v: 254.2 }, { ym: '2025-10', v: 320.0 }, { ym: '2025-11', v: 328.6 },
    { ym: '2025-12', v: 179.0 }, { ym: '2026-01', v: 197.7 }, { ym: '2026-02', v: 237.0 },
  ],
  EMEA: [
    { ym: '2025-03', v: 184.4 }, { ym: '2025-04', v: 180.4 }, { ym: '2025-05', v: 190.8 },
    { ym: '2025-06', v: 201.3 }, { ym: '2025-07', v: 214.5 }, { ym: '2025-08', v: 197.9 },
    { ym: '2025-09', v: 194.6 }, { ym: '2025-10', v: 204.8 }, { ym: '2025-11', v: 190.8 },
    { ym: '2025-12', v: 103.9 }, { ym: '2026-01', v: 90.0 }, { ym: '2026-02', v: 170.5 },
  ],
  Canada: [
    { ym: '2025-03', v: 171.3 }, { ym: '2025-04', v: 125.0 }, { ym: '2025-05', v: 120.8 },
    { ym: '2025-06', v: 81.0 }, { ym: '2025-07', v: 65.8 }, { ym: '2025-08', v: 41.5 },
    { ym: '2025-09', v: 56.4 }, { ym: '2025-10', v: null }, { ym: '2025-11', v: null },
    { ym: '2025-12', v: null }, { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
  APAC: [
    { ym: '2025-03', v: 62.3 }, { ym: '2025-04', v: 59.8 }, { ym: '2025-05', v: 90.3 },
    { ym: '2025-06', v: null }, { ym: '2025-07', v: null }, { ym: '2025-08', v: null },
    { ym: '2025-09', v: null }, { ym: '2025-10', v: null }, { ym: '2025-11', v: null },
    { ym: '2025-12', v: null }, { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
};

const FILLED_REGIONAL: Record<string, RegionalRow[]> = {
  'Americas-East': [
    { ym: '2025-06', v: 22.7 }, { ym: '2025-07', v: 22.9 }, { ym: '2025-08', v: 24.3 },
    { ym: '2025-09', v: 23.5 }, { ym: '2025-10', v: 23.3 }, { ym: '2025-11', v: 23.6 },
    { ym: '2025-12', v: 21.1 }, { ym: '2026-01', v: 23.1 }, { ym: '2026-02', v: 24.4 },
  ],
  'Americas-West': [
    { ym: '2025-06', v: 22.2 }, { ym: '2025-07', v: 22.0 }, { ym: '2025-08', v: 22.1 },
    { ym: '2025-09', v: 22.4 }, { ym: '2025-10', v: 22.9 }, { ym: '2025-11', v: 23.5 },
    { ym: '2025-12', v: 21.3 }, { ym: '2026-01', v: 23.0 }, { ym: '2026-02', v: 24.5 },
  ],
  EMEA: [
    { ym: '2025-06', v: 18.3 }, { ym: '2025-07', v: 18.1 }, { ym: '2025-08', v: 17.7 },
    { ym: '2025-09', v: 17.6 }, { ym: '2025-10', v: 17.9 }, { ym: '2025-11', v: 18.5 },
    { ym: '2025-12', v: 16.9 }, { ym: '2026-01', v: 17.6 }, { ym: '2026-02', v: 18.9 },
  ],
  Canada: [
    { ym: '2025-06', v: 16.1 }, { ym: '2025-07', v: 16.6 }, { ym: '2025-08', v: 16.5 },
    { ym: '2025-09', v: 15.4 }, { ym: '2025-10', v: null }, { ym: '2025-11', v: null },
    { ym: '2025-12', v: null }, { ym: '2026-01', v: null }, { ym: '2026-02', v: null },
  ],
};

const OPEN_INFRA: Record<string, RegionalRow[]> = {
  AWS: [
    { ym: '2025-03', v: 143.8 }, { ym: '2025-04', v: 110.8 }, { ym: '2025-05', v: 110.5 },
    { ym: '2025-06', v: 127.4 }, { ym: '2025-07', v: 146.9 }, { ym: '2025-08', v: 98.3 },
    { ym: '2025-09', v: 107.3 }, { ym: '2025-10', v: 108.8 }, { ym: '2025-11', v: 85.1 },
    { ym: '2025-12', v: 80.1 }, { ym: '2026-01', v: 116.5 }, { ym: '2026-02', v: 134.3 },
  ],
  GCP: [
    { ym: '2025-03', v: 9.0 }, { ym: '2025-04', v: 11.5 }, { ym: '2025-05', v: 28.0 },
    { ym: '2025-06', v: 21.2 }, { ym: '2025-07', v: 34.7 }, { ym: '2025-08', v: 34.0 },
    { ym: '2025-09', v: 39.9 }, { ym: '2025-10', v: 33.0 }, { ym: '2025-11', v: 27.3 },
    { ym: '2025-12', v: 28.6 }, { ym: '2026-01', v: 21.3 }, { ym: '2026-02', v: 27.7 },
  ],
  WDAY: [
    { ym: '2025-03', v: 219.3 }, { ym: '2025-04', v: 217.5 }, { ym: '2025-05', v: 229.2 },
    { ym: '2025-06', v: 236.6 }, { ym: '2025-07', v: 248.7 }, { ym: '2025-08', v: 227.7 },
    { ym: '2025-09', v: 237.5 }, { ym: '2025-10', v: 253.3 }, { ym: '2025-11', v: 227.0 },
    { ym: '2025-12', v: 109.3 }, { ym: '2026-01', v: 103.2 }, { ym: '2026-02', v: 197.8 },
  ],
};

const FILLED_INFRA: Record<string, RegionalRow[]> = {
  AWS: [
    { ym: '2025-06', v: 18.2 }, { ym: '2025-07', v: 18.5 }, { ym: '2025-08', v: 19.2 },
    { ym: '2025-09', v: 19.2 }, { ym: '2025-10', v: 18.7 }, { ym: '2025-11', v: 18.9 },
    { ym: '2025-12', v: 16.6 }, { ym: '2026-01', v: 16.8 }, { ym: '2026-02', v: 19.5 },
  ],
  GCP: [
    { ym: '2025-06', v: 15.4 }, { ym: '2025-07', v: 18.5 }, { ym: '2025-08', v: 18.5 },
    { ym: '2025-09', v: 19.5 }, { ym: '2025-10', v: 17.3 }, { ym: '2025-11', v: 17.6 },
    { ym: '2025-12', v: 16.9 }, { ym: '2026-01', v: 19.1 }, { ym: '2026-02', v: 19.0 },
  ],
  WDAY: [
    { ym: '2025-06', v: 21.6 }, { ym: '2025-07', v: 21.5 }, { ym: '2025-08', v: 22.0 },
    { ym: '2025-09', v: 21.5 }, { ym: '2025-10', v: 21.7 }, { ym: '2025-11', v: 22.2 },
    { ym: '2025-12', v: 20.0 }, { ym: '2026-01', v: 21.6 }, { ym: '2026-02', v: 22.9 },
  ],
};

// ─── Shared chart helpers ───

const COMBINED_LABELS = ['2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

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

const ALL_TENANTS_COMBINED = Array.from(new Set([...ALL_TENANTS_OPEN, ...ALL_TENANTS_FILLED])).sort();
const TENANT_SET = new Set(ALL_TENANTS_COMBINED);

const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  ...Object.keys(OPEN_REGIONAL).map(r => ({ value: r, label: r })),
];

const INFRA_OPTIONS = [
  { value: 'all', label: 'All infrastructure' },
  ...Object.keys(OPEN_INFRA).map(i => ({ value: i, label: i === 'WDAY' ? 'Workday DC' : i })),
];

const RANGE_OPTIONS = [
  { value: '6', label: 'Last 6 months' },
  { value: '9', label: 'Last 9 months' },
  { value: 'all', label: 'All data' },
];

type TabId = 'combined' | 'open' | 'filled' | 'regional' | 'infra' | 'tenant';

const TABS: { id: TabId; label: string }[] = [
  { id: 'combined', label: 'Open vs Filled' },
  { id: 'open', label: 'Open Reqs Trend' },
  { id: 'filled', label: 'Filled Trend' },
  { id: 'regional', label: 'By Region' },
  { id: 'infra', label: 'By Infrastructure' },
  { id: 'tenant', label: 'Per Tenant' },
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
      <FormField.Label htmlFor="pos-tenant-search">Tenant</FormField.Label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="pos-tenant-search"
          list="pos-tenant-datalist"
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
        <datalist id="pos-tenant-datalist">
          {ALL_TENANTS_COMBINED.map(t => <option key={t} value={t} />)}
        </datalist>
      </div>
    </FormField>
  );
};

export const PositionsOpenVsFilledDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('combined');
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
    return Math.max(0, COMBINED_LABELS.length - Number(rangeFilter));
  }, [rangeFilter]);

  const labels = useMemo(() => COMBINED_LABELS.slice(rangeSlice), [rangeSlice]);

  const alignToLabels = useCallback((series: { ym: string; v: number }[]) => {
    const map = new Map<string, number>();
    for (const pt of series) {
      if (!map.has(pt.ym)) map.set(pt.ym, pt.v);
    }
    return labels.map(l => map.get(l) ?? null);
  }, [labels]);

  const openLatest = OPEN_TREND[OPEN_TREND.length - 1];
  const openPrev = OPEN_TREND[OPEN_TREND.length - 2];
  const filledLatest = FILLED_TREND[FILLED_TREND.length - 1];
  const filledPrev = FILLED_TREND[FILLED_TREND.length - 2];
  const openDelta = openLatest.avg - openPrev.avg;
  const filledDelta = filledLatest.avg - filledPrev.avg;

  // Combined chart
  const combinedChartData = useMemo(() => {
    const openMap = new Map(OPEN_TREND.map(d => [d.ym, d.avg]));
    const filledMap = new Map(FILLED_TREND.map(d => [d.ym, d.avg]));

    const datasets: any[] = [
      {
        label: 'Open Reqs (avg count)',
        data: labels.map(l => openMap.get(l) ?? null),
        borderColor: CK.primary,
        backgroundColor: `${CK.primary}14`,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: CK.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: 'y',
      },
      {
        label: 'Filled (avg count)',
        data: labels.map(l => filledMap.get(l) ?? null),
        borderColor: CK.secondary,
        backgroundColor: `${CK.secondary}14`,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: CK.secondary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: 'y1',
      },
    ];

    if (activeTenant) {
      if (OPEN_TENANT_TIME_SERIES[activeTenant]) {
        datasets.push({
          label: `${activeTenant} (open)`,
          data: alignToLabels(OPEN_TENANT_TIME_SERIES[activeTenant]),
          borderColor: colors.cinnamon500,
          backgroundColor: 'transparent',
          borderDash: [4, 2],
          tension: 0.3, pointRadius: 4, borderWidth: 2.5, spanGaps: false,
          yAxisID: 'y',
        });
      }
      if (FILLED_TENANT_TIME_SERIES[activeTenant]) {
        datasets.push({
          label: `${activeTenant} (filled)`,
          data: alignToLabels(FILLED_TENANT_TIME_SERIES[activeTenant]),
          borderColor: colors.cinnamon300,
          backgroundColor: 'transparent',
          borderDash: [4, 2],
          tension: 0.3, pointRadius: 4, borderWidth: 2.5, spanGaps: false,
          yAxisID: 'y1',
        });
      }
    }

    return { labels, datasets };
  }, [labels, activeTenant, alignToLabels]);

  // Open-only trend
  const openTrendData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Avg Open Reqs',
      data: OPEN_TREND.filter(d => labels.includes(d.ym)).map(d => d.avg),
      borderColor: CK.primary,
      backgroundColor: `${CK.primary}20`,
      fill: true,
      tension: 0.3, pointRadius: 5, borderWidth: 2.5,
      pointBackgroundColor: CK.primary, pointBorderColor: '#fff', pointBorderWidth: 2,
    }],
  }), [labels]);

  // Filled-only trend
  const filledTrendData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Avg Filled',
      data: FILLED_TREND.filter(d => labels.includes(d.ym)).map(d => d.avg),
      borderColor: CK.secondary,
      backgroundColor: `${CK.secondary}20`,
      fill: true,
      tension: 0.3, pointRadius: 5, borderWidth: 2.5,
      pointBackgroundColor: CK.secondary, pointBorderColor: '#fff', pointBorderWidth: 2,
    }],
  }), [labels]);

  // Regional comparison (bar chart: open vs filled side by side for latest month)
  const regionalBarData = useMemo(() => {
    const regionKeys = regionFilter === 'all'
      ? Object.keys(OPEN_REGIONAL).filter(r => r !== 'Other')
      : [regionFilter];

    return {
      labels: regionKeys,
      datasets: [
        {
          label: 'Open Reqs (avg)',
          data: regionKeys.map(r => {
            const pts = OPEN_REGIONAL[r] || [];
            const last = pts.filter(p => p.v != null).pop();
            return last?.v ?? 0;
          }),
          backgroundColor: `${CK.primary}CC`,
          borderRadius: 4,
          barPercentage: 0.7,
        },
        {
          label: 'Filled (avg)',
          data: regionKeys.map(r => {
            const pts = FILLED_REGIONAL[r] || [];
            const last = pts.filter(p => p.v != null).pop();
            return last?.v ?? 0;
          }),
          backgroundColor: `${CK.secondary}CC`,
          borderRadius: 4,
          barPercentage: 0.7,
        },
      ],
    };
  }, [regionFilter]);

  // Infra comparison
  const infraBarData = useMemo(() => {
    const infraKeys = infraFilter === 'all' ? Object.keys(OPEN_INFRA) : [infraFilter];

    return {
      labels: infraKeys.map(i => i === 'WDAY' ? 'Workday DC' : i),
      datasets: [
        {
          label: 'Open Reqs (avg)',
          data: infraKeys.map(i => {
            const pts = OPEN_INFRA[i] || [];
            const last = pts.filter(p => p.v != null).pop();
            return last?.v ?? 0;
          }),
          backgroundColor: `${CK.primary}CC`,
          borderRadius: 4,
          barPercentage: 0.7,
        },
        {
          label: 'Filled (avg)',
          data: infraKeys.map(i => {
            const pts = FILLED_INFRA[i] || [];
            const last = pts.filter(p => p.v != null).pop();
            return last?.v ?? 0;
          }),
          backgroundColor: `${CK.secondary}CC`,
          borderRadius: 4,
          barPercentage: 0.7,
        },
      ],
    };
  }, [infraFilter]);

  // Per-tenant chart
  const tenantChartData = useMemo(() => {
    if (!activeTenant) return null;
    const datasets: any[] = [];
    if (OPEN_TENANT_TIME_SERIES[activeTenant]) {
      datasets.push({
        label: 'Open Reqs',
        data: alignToLabels(OPEN_TENANT_TIME_SERIES[activeTenant]),
        borderColor: CK.primary,
        backgroundColor: `${CK.primary}14`,
        fill: true,
        tension: 0.3, pointRadius: 5, borderWidth: 2.5, spanGaps: false,
        pointBackgroundColor: CK.primary, pointBorderColor: '#fff', pointBorderWidth: 2,
      });
    }
    if (FILLED_TENANT_TIME_SERIES[activeTenant]) {
      datasets.push({
        label: 'Filled',
        data: alignToLabels(FILLED_TENANT_TIME_SERIES[activeTenant]),
        borderColor: CK.secondary,
        backgroundColor: `${CK.secondary}14`,
        fill: true,
        tension: 0.3, pointRadius: 5, borderWidth: 2.5, spanGaps: false,
        pointBackgroundColor: CK.secondary, pointBorderColor: '#fff', pointBorderWidth: 2,
      });
    }
    return datasets.length ? { labels, datasets } : null;
  }, [activeTenant, labels, alignToLabels]);

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="positions-open-vs-filled" />
      <Box padding="32px" flex={1}>
        <Box style={{ maxWidth: 1200, margin: '0 auto' }}>
        <PageHeader
          title="Legacy Positions: Open Requisitions vs Filled"
          subtitle={"Historical comparison of average open requisitions versus filled positions per reporting tenant.\nSource: materialised 10 Apr 2026 SANDBOX extract using older 2360/2361 mappings; current live warehouse names have drifted, so treat this page as legacy reference only."}
        />

        <Flex gap="m" marginBottom="l" style={{ flexWrap: 'wrap' }}>
          <MetricCard
            label="Avg open reqs"
            value={openLatest.avg.toFixed(0)}
            helperText={`Feb 2026 · ${openLatest.tenants.toLocaleString()} tenants`}
            changeIndicator={{
              text: `${openDelta > 0 ? '+' : ''}${openDelta.toFixed(1)} vs prev month`,
              sentiment: openDelta > 0 ? 'negative' : 'positive',
            }}
            tooltip="Historical extract of mean open requisitions per tenant for the month using the older 2360 mapping. Kept for legacy comparison only."
          />
          <MetricCard
            label="Avg filled"
            value={filledLatest.avg.toFixed(1)}
            helperText={`Feb 2026 · ${filledLatest.tenants.toLocaleString()} tenants`}
            changeIndicator={{
              text: `${filledDelta > 0 ? '+' : ''}${filledDelta.toFixed(1)} vs prev month`,
              sentiment: filledDelta > 0 ? 'positive' : 'negative',
            }}
            tooltip="Historical extract of mean filled positions per tenant for the month using the older 2361 mapping. Kept for legacy comparison only."
          />
          <MetricCard
            label="Fill ratio"
            value={`${((filledLatest.avg / openLatest.avg) * 100).toFixed(1)}%`}
            helperText="Filled / Open positions"
            changeIndicator={{ text: 'Higher is better', sentiment: 'neutral' }}
            tooltip="Simple ratio of average filled to average open for the latest month (descriptive, not a cohort conversion rate)."
          />
          <MetricCard
            label="Tenants tracking filled"
            value={filledLatest.tenants.toLocaleString()}
            helperText="5x more than open req tracking"
            changeIndicator={{ text: `${openLatest.tenants} track open`, sentiment: 'neutral' }}
            tooltip="Tenant counts reporting non-zero filled versus open values in the historical extract used for this page."
          />
        </Flex>

        <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, marginBottom: '16px' }}>
          <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper500, marginBottom: '12px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
            Filters
          </BodyText>
          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="pos-region-filter" label="Region" value={regionFilter} onChange={setRegionFilter} options={REGION_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="pos-infra-filter" label="Infrastructure" value={infraFilter} onChange={setInfraFilter} options={INFRA_OPTIONS} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <TenantSearchInput value={tenantSearch} onChange={setTenantSearch} />
            </Box>
            <Box style={{ flex: '1 1 180px' }}>
              <FormSelect id="pos-range-filter" label="Time Range" value={rangeFilter} onChange={setRangeFilter} options={RANGE_OPTIONS} />
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

        {activeTab === 'combined' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Open Requisitions vs Positions Filled</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Dual-axis: Open reqs (left axis, blue) vs Filled positions (right axis, green)
              {activeTenant && ` — ${activeTenant} overlaid as dashed lines`}
            </BodyText>
            <Box style={{ height: 380 }}>
              <Line
                data={combinedChartData}
                options={{
                  ...BASE_LINE_OPTS,
                  scales: {
                    x: BASE_LINE_OPTS.scales.x,
                    y: {
                      ...BASE_LINE_OPTS.scales.y,
                      position: 'left',
                      title: { display: true, text: 'Open Reqs (avg)', font: { family: 'Roboto', size: 12 }, color: CK.primary },
                    },
                    y1: {
                      ...BASE_LINE_OPTS.scales.y,
                      position: 'right',
                      grid: { drawOnChartArea: false },
                      title: { display: true, text: 'Filled (avg)', font: { family: 'Roboto', size: 12 }, color: CK.secondary },
                    },
                  },
                }}
              />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Open requisitions average 177.8 per tenant (Feb 2026) while filled positions average 21.9 - a ~12% fill ratio. Open reqs dipped sharply in Dec-Jan (holiday period, 99-101 avg) while filled positions remained relatively stable (19-21). This suggests hiring velocity is more consistent than requisition creation activity.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'open' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Open Requisitions Trend</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Average count of positions with open job requisitions per tenant
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line data={openTrendData} options={{
                ...BASE_LINE_OPTS,
                plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: false } },
              }} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Open reqs peaked at 231.4 (Jul 2025) before a seasonal decline. The Dec-Jan trough (99-101) aligns with reduced hiring activity. Feb 2026 rebounded to 177.8 with 871 active tenants - the highest tenant count on record.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'filled' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Positions Filled Trend</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Average count of positions filled per tenant per month
            </BodyText>
            <Box style={{ height: 340 }}>
              <Line data={filledTrendData} options={{
                ...BASE_LINE_OPTS,
                plugins: { ...BASE_LINE_OPTS.plugins, legend: { display: false } },
                scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, min: 18, max: 23 } },
              }} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Positions filled remain remarkably stable at 19-22 per tenant per month. The slight uptick to 21.9 (Feb 2026) alongside 4,335 tenants shows broad adoption. This metric tracks ~5x more tenants than open requisitions (4,335 vs 871).
            </InsightBox>
          </Card>
        )}

        {activeTab === 'regional' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Regional Comparison</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Latest month comparison: average open reqs vs filled by region
            </BodyText>
            <Box style={{ height: 340 }}>
              <Bar data={regionalBarData} options={{
                ...BASE_LINE_OPTS,
                scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: true } },
              }} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Americas regions have the highest open req counts (245-237 avg) but similar filled rates to others (22-24). EMEA shows a better ratio with 170.5 open vs 18.9 filled. Canada data is sparse after Sep 2025.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'infra' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Infrastructure Comparison</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Latest month comparison: average open reqs vs filled by cloud hosting
            </BodyText>
            <Box style={{ height: 340 }}>
              <Bar data={infraBarData} options={{
                ...BASE_LINE_OPTS,
                scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, beginAtZero: true } },
              }} />
            </Box>
            <InsightBox>
              <strong>Insight:</strong> Workday DC tenants carry the heaviest req loads (197.8 open avg) with 22.9 filled. AWS tenants show 134.3 open but only 19.5 filled. GCP tenants are the lightest (27.7 open, 19.0 filled) - smaller, newer customers.
            </InsightBox>
          </Card>
        )}

        {activeTab === 'tenant' && (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}`, boxShadow: SANA_CARD_SHADOW }}>
            <Heading size="small" marginBottom="xxs">Per-Tenant View</Heading>
            <BodyText size="small" color={colors.blackPepper400} marginBottom="m">
              Select a tenant above to see their open vs filled positions over time
            </BodyText>
            {tenantChartData ? (
              <Box style={{ height: 340 }}>
                <Line data={tenantChartData} options={BASE_LINE_OPTS} />
              </Box>
            ) : (
              <Box style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BodyText size="small" color={colors.blackPepper400}>
                  Search for a tenant in the filter bar to see their data
                </BodyText>
              </Box>
            )}
            <InsightBox>
              <strong>Tip:</strong> Use the tenant search in the filter bar above. The combined Open vs Filled tab also shows tenant overlays when a tenant is selected.
            </InsightBox>
          </Card>
        )}

        <BodyText size="small" color={colors.blackPepper400} marginTop="l" style={{ lineHeight: 1.6, fontSize: 12 }}>
          <strong>Data notes:</strong> Source: historical Pharos extract from <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>internal_usage_metrics_report_kafka</code> using the older 2360/2361 open-versus-filled mapping · SANDBOX environment · Non-zero values only · Open reqs data available from Mar 2025, Filled from Jun 2025 · Current live warehouse discovery now maps 2360/2361 to Employment Agreement Acceptance and Recruiter Productivity, so do not reuse these IDs for new work without metric-name revalidation.
        </BodyText>
        </Box>
      </Box>
    </Flex>
  );
};

export default PositionsOpenVsFilledDashboard;
