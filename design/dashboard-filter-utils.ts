import {
  INDUSTRY_OPTIONS as INDUSTRY_VALUES,
  REGION_OPTIONS as REGION_VALUES,
  SEGMENT_OPTIONS as SEGMENT_VALUES,
  TENANT_FILTER_METADATA,
} from './data-dashboard-tenant-filters';

export type DashboardFilterState = {
  segment: string;
  region: string;
  industry: string;
  tenant: string;
};

export type TenantMetricPoint = {
  ym: string;
  value: number;
};

export type AggregatedMetricPoint = {
  ym: string;
  avg: number | null;
  tenants: number;
  min: number | null;
  max: number | null;
};

export const EMPTY_DASHBOARD_FILTERS: DashboardFilterState = {
  segment: 'all',
  region: 'all',
  industry: 'all',
  tenant: '',
};

export const SEGMENT_FILTER_OPTIONS = [
  { value: 'all', label: 'All segments' },
  ...SEGMENT_VALUES.map((value) => ({ value, label: value })),
];

export const REGION_FILTER_OPTIONS = [
  { value: 'all', label: 'All regions' },
  ...REGION_VALUES.map((value) => ({ value, label: value })),
];

export const INDUSTRY_FILTER_OPTIONS = [
  { value: 'all', label: 'All industries' },
  ...INDUSTRY_VALUES.map((value) => ({ value, label: value })),
];

export function normaliseTenantInput(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidMetric(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function safeFixed(value: number | null | undefined, digits = 1, fallback = '--'): string {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value.toFixed(digits);
}

export function getTenantMeta(tenant: string) {
  return TENANT_FILTER_METADATA[tenant];
}

export function matchesDashboardFilters(
  tenant: string,
  filters: DashboardFilterState
): boolean {
  const meta = getTenantMeta(tenant);
  if (!meta) return false;
  if (filters.segment !== 'all' && meta.segment !== filters.segment) return false;
  if (filters.region !== 'all' && meta.region !== filters.region) return false;
  if (filters.industry !== 'all' && meta.industry !== filters.industry) return false;
  if (filters.tenant && tenant !== normaliseTenantInput(filters.tenant)) return false;
  return true;
}

export function filterTenantNames(
  tenantNames: string[],
  filters: DashboardFilterState
): string[] {
  return tenantNames.filter((tenant) => matchesDashboardFilters(tenant, filters));
}

export function aggregateTenantSeries(
  labels: string[],
  tenantNames: string[],
  source: Record<string, TenantMetricPoint[]>
): AggregatedMetricPoint[] {
  return labels.map((ym) => {
    const values = tenantNames.flatMap((tenant) => {
      const point = source[tenant]?.find((row) => row.ym === ym);
      return point && Number.isFinite(point.value) ? [point.value] : [];
    });

    if (values.length === 0) {
      return { ym, avg: null, tenants: 0, min: null, max: null };
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    const avg = total / values.length;
    return {
      ym,
      avg: Number.isFinite(avg) ? avg : null,
      tenants: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });
}

export function latestVisibleValues(
  tenantNames: string[],
  source: Record<string, TenantMetricPoint[]>,
  ym: string
): number[] {
  return tenantNames.flatMap((tenant) => {
    const point = source[tenant]?.find((row) => row.ym === ym);
    return point ? [point.value] : [];
  });
}

export function averageAcrossVisibleMonths(
  tenant: string,
  visibleLabels: string[],
  source: Record<string, TenantMetricPoint[]>
): number | null {
  const values = visibleLabels.flatMap((ym) => {
    const point = source[tenant]?.find((row) => row.ym === ym);
    return point ? [point.value] : [];
  });

  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function describeActiveFilters(filters: DashboardFilterState): string[] {
  const parts: string[] = [];
  if (filters.segment !== 'all') parts.push(`Segment: ${filters.segment}`);
  if (filters.region !== 'all') parts.push(`Region: ${filters.region}`);
  if (filters.industry !== 'all') parts.push(`Industry: ${filters.industry}`);
  if (filters.tenant) parts.push(`Tenant: ${filters.tenant}`);
  return parts;
}

export function getBreakdownValues(
  dimension: 'segment' | 'region' | 'industry',
  tenantNames: string[]
): string[] {
  const values = new Set<string>();
  for (const tenant of tenantNames) {
    const meta = getTenantMeta(tenant);
    if (meta) values.add(meta[dimension]);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}
