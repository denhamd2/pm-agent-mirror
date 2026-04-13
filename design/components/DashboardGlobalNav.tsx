import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';

const PRIMARY_NAV_ITEMS = [
  { id: 'morning-roundup', label: 'Morning Roundup', hrefType: 'pm-tab' },
  { id: 'metrics', label: 'Value Realization Metrics', hrefType: 'metrics-home' },
  { id: 'prototypes', label: 'My Saved Prototypes', hrefType: 'pm-tab' },
  { id: 'agent-flow', label: 'Agent Flow', hrefType: 'pm-tab' },
  { id: 'data-sources', label: 'Data Sources', hrefType: 'pm-tab' },
  { id: 'design-system', label: 'Design System', hrefType: 'pm-tab' },
  { id: 'agent-health', label: 'Agent Health', hrefType: 'pm-tab' },
] as const;

const METRIC_ITEMS = [
  { slug: 'value-realization-metrics', label: 'Value Realisation' },
  { slug: 'customer-scorecard', label: 'Customer Scorecard' },
  { slug: 'recruiting-metric-tree', label: 'Value Driver Tree', newWindow: true },
  { slug: 'bp-durations', label: 'Job App Stage Metrics' },
] as const;

/** Maps child dashboard slugs to a parent nav item so the correct chip highlights. */
const CHILD_TO_PARENT: Record<string, string> = {
  'avg-time-to-hire': 'value-realization-metrics',
  'recruiter-capacity': 'value-realization-metrics',
  'positions-open-vs-filled': 'value-realization-metrics',
  'recruiting-adoption': 'value-realization-metrics',
  'add-documents-impact': 'value-realization-metrics',
  'interview-metrics': 'bp-durations',
  'view-dashboard': 'bp-durations',
};

type PrimaryNavId = (typeof PRIMARY_NAV_ITEMS)[number]['id'];
type ChildSlug = keyof typeof CHILD_TO_PARENT;
export type MetricsSlug = (typeof METRIC_ITEMS)[number]['slug'] | ChildSlug | null;
type MainTabId = Exclude<PrimaryNavId, 'metrics'>;
type MetricNavItem = { slug: string; label: string; newWindow?: boolean };
const ALL_METRIC_ITEMS: MetricNavItem[] = [...METRIC_ITEMS];

export interface DashboardGlobalNavProps {
  activeMetricsSlug?: MetricsSlug;
  activeMainTab?: MainTabId | null;
  showMainTabs?: boolean;
  showMetricsNav?: boolean;
}

function pmDashboardHref(tab: string): string {
  return `#pm-agent-dashboard?tab=${encodeURIComponent(tab)}`;
}

function metricsHref(slug: string): string {
  return `#${slug}`;
}

function metricDestination(
  item: { slug: string; newWindow?: boolean }
): { href: string; target?: '_blank'; rel?: string } {
  const href = metricsHref(item.slug);
  if (item.newWindow) {
    return { href, target: '_blank', rel: 'noopener noreferrer' };
  }
  return { href };
}

function primaryHref(item: (typeof PRIMARY_NAV_ITEMS)[number]): string {
  return item.hrefType === 'pm-tab' ? pmDashboardHref(item.id) : metricsHref('value-realization-metrics');
}

function topNavLinkStyle(active: boolean): React.CSSProperties {
  return {
    textDecoration: 'none',
    color: active ? colors.blueberry600 : colors.blackPepper500,
    fontSize: 14,
    fontWeight: active ? 700 : 600,
    padding: '10px 2px',
    borderBottom: active ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
    whiteSpace: 'nowrap',
  };
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: 999,
    border: active ? `1px solid ${colors.blueberry400}` : `1px solid ${colors.soap300}`,
    backgroundColor: active ? colors.blueberry100 : colors.frenchVanilla100,
    color: active ? colors.blueberry600 : colors.blackPepper500,
    fontSize: 12,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };
}

function metricLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 10,
    backgroundColor: active ? '#edf5ff' : '#ffffff',
    border: active ? `1px solid ${colors.blueberry300}` : `1px solid ${colors.soap200}`,
    color: active ? colors.blueberry600 : colors.blackPepper500,
    fontSize: 13,
    fontWeight: active ? 700 : 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };
}

export const DashboardGlobalNav: React.FC<DashboardGlobalNavProps> = ({
  activeMetricsSlug = null,
  activeMainTab = null,
  showMainTabs = true,
  showMetricsNav,
}) => {
  const metricsVisible = showMetricsNav ?? activeMetricsSlug != null;
  const activePrimaryId: PrimaryNavId | null = activeMetricsSlug ? 'metrics' : activeMainTab;
  const resolvedSlug = activeMetricsSlug
    ? CHILD_TO_PARENT[activeMetricsSlug] ?? activeMetricsSlug
    : null;
  const pageLabel =
    activeMetricsSlug
      ? ALL_METRIC_ITEMS.find((item) => item.slug === activeMetricsSlug)?.label
        ?? ALL_METRIC_ITEMS.find((item) => item.slug === resolvedSlug)?.label
        ?? 'Metrics'
      : PRIMARY_NAV_ITEMS.find((item) => item.id === activeMainTab)?.label ?? 'Workspace';

  return (
    <Box
      style={{
        borderBottom: `1px solid ${colors.soap300}`,
        background: '#ffffff',
      }}
    >
      <Box style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px' }}>
        <Flex justifyContent="space-between" alignItems="center" gap="l" style={{ flexWrap: 'wrap', marginBottom: showMainTabs ? 10 : 0 }}>
          <Box style={{ minWidth: 0 }}>
            <a href={pmDashboardHref('morning-roundup')} style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.1 }}>
                PM Agent Dashboard
              </div>
            </a>
            <div style={{ fontSize: 12, color: colors.blackPepper400, marginTop: 2 }}>
              {pageLabel}
            </div>
          </Box>
        </Flex>

        {showMainTabs ? (
          <Flex gap="m" style={{ overflowX: 'auto', paddingBottom: 4, alignItems: 'center' }}>
            {PRIMARY_NAV_ITEMS.map((item) => (
              <a key={item.id} href={primaryHref(item)} style={topNavLinkStyle(activePrimaryId === item.id)}>
                {item.label}
              </a>
            ))}
          </Flex>
        ) : null}

        {metricsVisible ? (
          <Flex gap="s" style={{ flexWrap: 'wrap', paddingTop: 4 }}>
            {ALL_METRIC_ITEMS.map((item) => {
              const destination = metricDestination(item);
              return (
                <a
                  key={item.slug}
                  href={destination.href}
                  target={destination.target}
                  rel={destination.rel}
                  style={chipStyle(resolvedSlug === item.slug)}
                >
                  {item.label}
                </a>
              );
            })}
          </Flex>
        ) : null}
      </Box>
    </Box>
  );
};
