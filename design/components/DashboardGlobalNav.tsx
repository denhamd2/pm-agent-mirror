import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { colors } from '@workday/canvas-kit-react/tokens';

const PRIMARY_NAV_ITEMS = [
  { id: 'morning-roundup', label: 'Morning Roundup', hrefType: 'pm-tab' },
  { id: 'agent-health', label: 'Agent Health', hrefType: 'pm-tab' },
  { id: 'prototypes', label: 'Saved Prototypes', hrefType: 'pm-tab' },
  { id: 'data-sources', label: 'Data Sources', hrefType: 'pm-tab' },
  { id: 'design-system', label: 'Design System', hrefType: 'pm-tab' },
  { id: 'agent-flow', label: 'Agent Flow', hrefType: 'pm-tab' },
  { id: 'metrics', label: 'Metrics', hrefType: 'metrics-home' },
] as const;

const METRIC_GROUPS = [
  {
    id: 'portfolio-overview',
    label: 'Portfolio Overview',
    items: [
      { slug: 'value-realization-metrics', label: 'Value Realisation' },
      { slug: 'customer-scorecard', label: 'Customer Scorecard' },
      { slug: 'recruiting-metric-tree', label: 'Recruiting KPI Tree', newWindow: true },
    ],
  },
  {
    id: 'hiring-outcomes',
    label: 'Hiring Outcomes',
    items: [
      { slug: 'avg-time-to-hire', label: 'Time to Hire' },
      { slug: 'avg-time-to-fill', label: 'Time to Fill (Legacy)' },
    ],
  },
  {
    id: 'recruiting-operations',
    label: 'Recruiting Operations',
    items: [
      { slug: 'recruiter-capacity', label: 'Recruiter Load' },
      { slug: 'interview-metrics', label: 'Interview Process' },
      { slug: 'bp-durations', label: 'Job App Stage Durations' },
      { slug: 'view-dashboard', label: 'Offer Duration Benchmark' },
      { slug: 'positions-open-vs-filled', label: 'Open vs Filled (Legacy)' },
    ],
  },
  {
    id: 'feature-adoption',
    label: 'Feature Adoption',
    items: [
      { slug: 'recruiting-adoption', label: 'Recruiting Adoption' },
      { slug: 'add-documents-impact', label: 'Add Documents Effect' },
    ],
  },
] as const;

type PrimaryNavId = (typeof PRIMARY_NAV_ITEMS)[number]['id'];
export type MetricsSlug = (typeof METRIC_GROUPS)[number]['items'][number]['slug'] | null;
type MainTabId = Exclude<PrimaryNavId, 'metrics'>;
type MetricNavItem = { slug: string; label: string; newWindow?: boolean };
const ALL_METRIC_ITEMS: MetricNavItem[] = METRIC_GROUPS.flatMap((group) => [...group.items]) as MetricNavItem[];

export interface DashboardGlobalNavProps {
  activeMetricsSlug?: MetricsSlug;
  activeMainTab?: MainTabId | null;
  showMainTabs?: boolean;
  showMetricsNav?: boolean;
}

function basePath(): string {
  return (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
}

function pmDashboardHref(tab: string): string {
  return `${basePath()}/pm-agent-dashboard?tab=${encodeURIComponent(tab)}`;
}

function metricsHref(slug: string): string {
  return `${basePath()}/${slug}`;
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
  const activeGroup =
    METRIC_GROUPS.find((group) => group.items.some((item) => item.slug === activeMetricsSlug)) ?? METRIC_GROUPS[0];
  const pageLabel =
    activeMetricsSlug
      ? activeGroup.items.find((item) => item.slug === activeMetricsSlug)?.label ?? 'Metrics'
      : PRIMARY_NAV_ITEMS.find((item) => item.id === activeMainTab)?.label ?? 'Workspace';

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: `1px solid ${colors.soap300}`,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px 16px' }}>
        <Flex justifyContent="space-between" alignItems="flex-start" gap="l" style={{ flexWrap: 'wrap', marginBottom: 10 }}>
          <Box>
            <a href={pmDashboardHref('morning-roundup')} style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.1 }}>
                PM Agent Dashboard
              </div>
            </a>
            <div style={{ fontSize: 12, color: colors.blackPepper400, marginTop: 4 }}>
              {activeMetricsSlug ? 'Metrics workspace' : 'Workspace overview'} · {pageLabel}
            </div>
          </Box>
          {activeMetricsSlug ? (
            <Box style={{ minWidth: 240 }}>
              <div style={{ fontSize: 11, color: colors.blackPepper400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Quick jump
              </div>
              <select
                value={activeMetricsSlug}
                onChange={(event) => {
                  const selected = ALL_METRIC_ITEMS.find((item) => item.slug === event.target.value);
                  if (selected?.newWindow) {
                    window.open(metricsHref(selected.slug), '_blank', 'noopener,noreferrer');
                    return;
                  }
                  window.location.href = metricsHref(event.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${colors.soap300}`,
                  backgroundColor: '#fff',
                  color: colors.blackPepper500,
                  fontSize: 13,
                }}
              >
                {METRIC_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {group.items.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Box>
          ) : null}
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
          <Card style={{ marginTop: 14, padding: 14, borderRadius: 16, border: `1px solid ${colors.soap200}`, backgroundColor: '#fcfcfd' }}>
            <Flex justifyContent="space-between" alignItems="center" gap="m" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
              <Box>
                <div style={{ fontSize: 11, color: colors.blackPepper400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Metric Dashboards
                </div>
                <div style={{ fontSize: 14, color: colors.blackPepper500, marginTop: 4 }}>
                  Browse by dashboard group, then jump within the active group.
                </div>
              </Box>
            </Flex>

            <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
              {METRIC_GROUPS.map((group) => {
                const isActive = group.id === activeGroup.id;
                const { href } = metricDestination(group.items[0]);
                return (
                  <a key={group.id} href={href} style={chipStyle(isActive)}>
                    {group.label}
                  </a>
                );
              })}
            </Flex>

            <Flex gap="s" style={{ flexWrap: 'wrap' }}>
              {activeGroup.items.map((item) => {
                const destination = metricDestination(item);
                return (
                <a
                  key={item.slug}
                  href={destination.href}
                  target={destination.target}
                  rel={destination.rel}
                  style={metricLinkStyle(activeMetricsSlug === item.slug)}
                >
                  {item.label}
                </a>
              )})}
            </Flex>
          </Card>
        ) : null}
      </Box>
    </Box>
  );
};
