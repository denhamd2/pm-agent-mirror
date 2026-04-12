/**
 * Shared navigation for PM Agent Dashboard and standalone metrics dashboards.
 * Row 1: main dashboard tabs via /pm-agent-dashboard?tab=
 * Row 2: metrics prototype routes (pathname slugs from design/main.tsx).
 */

import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';

const MAIN_TAB_ITEMS = [
  { tab: 'morning-roundup', label: 'Morning Roundup' },
  { tab: 'agent-health', label: 'Agent Health Scorecard' },
  { tab: 'prototypes', label: 'Saved Prototypes' },
  { tab: 'data-sources', label: 'Data Sources' },
  { tab: 'design-system', label: 'Design System' },
  { tab: 'agent-flow', label: 'Agent Flow' },
] as const;

const METRICS_ITEMS = [
  { slug: 'customer-scorecard', label: 'Customer Scorecard' },
  { slug: 'add-documents-impact', label: 'Add Documents Impact' },
  { slug: 'avg-time-to-hire', label: 'Avg. Time to Hire' },
  { slug: 'avg-time-to-fill', label: 'Avg. Time to Fill' },
  { slug: 'positions-open-vs-filled', label: 'Positions Open vs Filled' },
  { slug: 'value-realization-metrics', label: 'Value Realisation' },
  { slug: 'recruiting-adoption', label: 'Recruiting Adoption' },
  { slug: 'interview-metrics', label: 'Interview Metrics' },
  { slug: 'bp-durations', label: 'Job App Sub-BPs' },
  { slug: 'view-dashboard', label: 'View Dashboard' },
] as const;

export type MetricsSlug = (typeof METRICS_ITEMS)[number]['slug'] | null;

export interface DashboardGlobalNavProps {
  activeMetricsSlug?: MetricsSlug;
  activeMainTab?: (typeof MAIN_TAB_ITEMS)[number]['tab'] | null;
  /** When false, only the Metrics row is shown (use under PM Agent Dashboard primary tabs). Default true. */
  showMainTabs?: boolean;
}

function pmDashboardHref(tab: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
  return `${base}/pm-agent-dashboard?tab=${encodeURIComponent(tab)}`;
}

function metricsHref(slug: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
  return `${base}/${slug}`;
}

export const DashboardGlobalNav: React.FC<DashboardGlobalNavProps> = ({
  activeMetricsSlug = null,
  activeMainTab = null,
  showMainTabs = true,
}) => {
  return (
    <Box
      style={{
        background: colors.frenchVanilla100,
        borderBottom: `1px solid ${colors.soap300}`,
        padding: '8px 16px 12px',
      }}
    >
      {showMainTabs ? (
        <Flex gap="xs" flexWrap="wrap" marginBottom="xs" style={{ alignItems: 'center' }}>
          {MAIN_TAB_ITEMS.map(({ tab, label }) => {
            const isActive = activeMainTab === tab;
            return (
              <a key={tab} href={pmDashboardHref(tab)} style={{ textDecoration: 'none' }}>
                <SecondaryButton
                  style={
                    isActive
                      ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 }
                      : undefined
                  }
                >
                  {label}
                </SecondaryButton>
              </a>
            );
          })}
        </Flex>
      ) : null}
      <Flex gap="xs" flexWrap="wrap" style={{ alignItems: 'center' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: colors.blackPepper400,
            marginRight: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Metrics
        </span>
        {METRICS_ITEMS.map(({ slug, label }) => {
          const isActive = activeMetricsSlug === slug;
          return (
            <a key={slug} href={metricsHref(slug)} style={{ textDecoration: 'none' }}>
              <SecondaryButton
                size="small"
                style={
                  isActive
                    ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 }
                    : { fontSize: 13 }
                }
              >
                {label}
              </SecondaryButton>
            </a>
          );
        })}
      </Flex>
    </Box>
  );
};
