import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Table } from '@workday/canvas-kit-react/table';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Tooltip } from '@workday/canvas-kit-react/tooltip';
import {
  exportIcon,
  infoIcon,
  flagIcon,
  exclamationTriangleIcon,
  exclamationCircleIcon,
  clockIcon,
  checkIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_SHELL_RADIUS,
  SANA_CARD_SHADOW_LIFTED,
  SANA_LINK_ACCENT,
} from './components';

/**
 * GCC Nationalization & Compliance Dashboard
 *
 * MISSION-016 | PMF v39 E2E #1 | Epic HRREC-90967
 * PRD: docs/prds/gcc-nationalization-compliance-prd.md
 * Discovery: design/gcc-nationalization-compliance-discovery-brief.md
 *
 * Visual target: Sana-style neutrals (soap field, white cards, pill search via WorkdayTopNav).
 */

type ComplianceStatus = 'compliant' | 'at_risk' | 'non_compliant';

interface CountryMetric {
  country: string;
  program: string;
  currentPercent: number;
  thresholdPercent: number;
  status: ComplianceStatus;
  nationals: number;
  total: number;
}

interface DrillDownRow {
  department: string;
  country: string;
  nationals: number;
  total: number;
  percent: number;
  status: ComplianceStatus;
}

const COUNTRY_DATA: CountryMetric[] = [
  {
    country: 'Saudi Arabia',
    program: 'Nitaqat',
    currentPercent: 65,
    thresholdPercent: 60,
    status: 'compliant',
    nationals: 156,
    total: 240,
  },
  {
    country: 'UAE',
    program: 'Emiratisation',
    currentPercent: 18,
    thresholdPercent: 20,
    status: 'at_risk',
    nationals: 36,
    total: 200,
  },
  {
    country: 'Kuwait',
    program: 'Kuwaitisation',
    currentPercent: 52,
    thresholdPercent: 50,
    status: 'compliant',
    nationals: 52,
    total: 100,
  },
];

const DRILL_DOWN_DATA: DrillDownRow[] = [
  { department: 'Engineering', country: 'Saudi Arabia', nationals: 45, total: 80, percent: 56, status: 'at_risk' },
  { department: 'Engineering', country: 'UAE', nationals: 12, total: 60, percent: 20, status: 'compliant' },
  { department: 'Engineering', country: 'Kuwait', nationals: 18, total: 35, percent: 51, status: 'compliant' },
  { department: 'Operations', country: 'Saudi Arabia', nationals: 72, total: 100, percent: 72, status: 'compliant' },
  { department: 'Operations', country: 'UAE', nationals: 14, total: 80, percent: 18, status: 'at_risk' },
  { department: 'Sales', country: 'Saudi Arabia', nationals: 39, total: 60, percent: 65, status: 'compliant' },
  { department: 'Sales', country: 'UAE', nationals: 10, total: 60, percent: 17, status: 'non_compliant' },
];

const THRESHOLD_TOOLTIPS: Record<string, string> = {
  'Saudi Arabia':
    'Nitaqat 2026–2028: Employers must meet Saudi nationalisation % by sector and company size. Green = compliant, Yellow = warning, Red = non-compliant (work permit restrictions).',
  UAE:
    'Emiratisation: Private sector targets (e.g. 2% annual increase). Non-compliance results in fines; Nafis programme incentives for compliance.',
  Kuwait:
    'Kuwaitisation: Sector-specific Kuwaiti national quotas. Non-compliance affects work permits and government tenders.',
};

function getStatusColor(status: ComplianceStatus): string {
  switch (status) {
    case 'compliant':
      return colors.greenApple600;
    case 'at_risk':
      return colors.cantaloupe600;
    case 'non_compliant':
      return colors.cinnamon600;
    default:
      return colors.blackPepper400;
  }
}

function getStatusBgColor(status: ComplianceStatus): string {
  switch (status) {
    case 'compliant':
      return colors.greenApple100;
    case 'at_risk':
      return colors.cantaloupe100;
    case 'non_compliant':
      return colors.cinnamon100;
    default:
      return colors.soap200;
  }
}

function getStatusLabel(status: ComplianceStatus): string {
  switch (status) {
    case 'compliant':
      return 'Compliant';
    case 'at_risk':
      return 'At risk';
    case 'non_compliant':
      return 'Non-compliant';
    default:
      return 'Unknown';
  }
}

const CARD_RADIUS = SANA_CARD_RADIUS_LG;
const SHELL_RADIUS = SANA_SHELL_RADIUS;

const ProgressBar: React.FC<{
  value: number;
  threshold: number;
  status: ComplianceStatus;
  height?: number;
}> = ({ value, threshold, status, height = 8 }) => {
  const fillPercent = Math.min(value, 100);
  const thresholdPercent = Math.min(threshold, 100);

  return (
    <Box position="relative" marginTop="xs">
      <Box
        style={{
          height,
          backgroundColor: colors.soap200,
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            width: `${fillPercent}%`,
            height,
            backgroundColor: getStatusColor(status),
            borderRadius: height / 2,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
      {thresholdPercent < 100 && (
        <Box
          style={{
            position: 'absolute',
            left: `${thresholdPercent}%`,
            top: -2,
            width: 2,
            height: height + 4,
            backgroundColor: colors.blackPepper400,
            borderRadius: 1,
          }}
          title={`Threshold: ${thresholdPercent}%`}
        />
      )}
    </Box>
  );
};

const MetricCard: React.FC<{ metric: CountryMetric }> = ({ metric }) => {
  const tooltip = THRESHOLD_TOOLTIPS[metric.country];

  return (
    <Card
      padding="l"
      flex="1"
      minWidth={280}
      style={{
        backgroundColor: '#fff',
        border: `1px solid ${colors.soap300}`,
        borderRadius: CARD_RADIUS,
        boxShadow: SANA_CARD_SHADOW_LIFTED,
      }}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
        <Box>
          <Heading size="small">{metric.country}</Heading>
          <BodyText size="small" color={colors.blackPepper500}>
            {metric.program}
          </BodyText>
        </Box>
        <Tooltip title={tooltip} type="describe">
          <span style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
            <SystemIcon icon={infoIcon} size={18} color={colors.blackPepper400} aria-label="Regulatory context" />
          </span>
        </Tooltip>
      </Flex>

      <Flex justifyContent="space-between" alignItems="baseline" marginBottom="xxs">
        <BodyText size="large" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
          {metric.currentPercent}%
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          of {metric.thresholdPercent}% required
        </BodyText>
      </Flex>

      <ProgressBar value={metric.currentPercent} threshold={metric.thresholdPercent} status={metric.status} />

      <Flex marginTop="m" alignItems="center" gap="s" flexWrap="wrap">
        <Box
          paddingX="s"
          paddingY="xxs"
          style={{
            backgroundColor: getStatusBgColor(metric.status),
            borderRadius: 12,
          }}
        >
          <BodyText size="small" color={getStatusColor(metric.status)} style={{ fontWeight: 600 }}>
            {getStatusLabel(metric.status)}
          </BodyText>
        </Box>
        <BodyText size="small" color={colors.blackPepper500}>
          {metric.nationals} / {metric.total} nationals
        </BodyText>
      </Flex>
    </Card>
  );
};

const COUNTRY_FROM_HASH: Record<string, string> = {
  saudi: 'Saudi Arabia',
  uae: 'UAE',
  kuwait: 'Kuwait',
};

const pillButton = (active: boolean): React.CSSProperties => ({
  borderRadius: 999,
  border: `1px solid ${active ? SANA_LINK_ACCENT : colors.soap300}`,
  backgroundColor: active ? colors.soap100 : '#fff',
  color: colors.blackPepper600,
  fontWeight: active ? 600 : 400,
});

type AlertSeverity = 'critical' | 'warning' | 'info';

interface ComplianceAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  country?: string;
  dateLabel: string;
  category: string;
}

const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'UAE Sales below Emiratisation minimum',
    description:
      'Sales in UAE is at 17% nationalisation vs 20% required. Government reporting window closes 15 April 2026. Prioritise hiring or redeployment of Emirati nationals.',
    country: 'UAE',
    dateLabel: 'Due in 26 days',
    category: 'Threshold breach',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Operations UAE trending toward risk',
    description:
      'Operations headcount is at 18% vs 20% target. Two open roles are filled by non-national offers; confirm start dates or adjust pipeline to stay above threshold.',
    country: 'UAE',
    dateLabel: 'Updated today',
    category: 'Trend',
  },
  {
    id: 'a3',
    severity: 'warning',
    title: 'Nitaqat classification review',
    description:
      'MHRSD sector reclassification may apply from Q3. Refresh your establishment size band in Workday and reconcile headcount before the published deadline.',
    country: 'Saudi Arabia',
    dateLabel: 'Review by 30 April 2026',
    category: 'Regulatory change',
  },
  {
    id: 'a4',
    severity: 'info',
    title: 'Kuwait tender eligibility verified',
    description:
      'Current Kuwaitisation rate supports active government tenders for listed contracts. No action required unless headcount drops by more than 3 roles.',
    country: 'Kuwait',
    dateLabel: 'Verified 18 March 2026',
    category: 'Positive signal',
  },
  {
    id: 'a5',
    severity: 'info',
    title: 'Quarterly compliance export scheduled',
    description:
      'Automated GCC nationalisation report will generate on 1 April 2026 for HR and Legal sign-off. Ensure payroll and national ID data are current.',
    dateLabel: 'Scheduled',
    category: 'Process',
  },
];

const COUNTRY_INSIGHTS: Record<
  string,
  { reviewDue: string; permitsNote: string; highlight: string }
> = {
  'Saudi Arabia': {
    reviewDue: '30 April 2026',
    permitsNote: '0 work permits flagged for Nitaqat review',
    highlight: 'Engineering is the only department below sector median; focus intern conversion.',
  },
  UAE: {
    reviewDue: '15 April 2026',
    permitsNote: '4 pending renewals tied to Emiratisation compliance',
    highlight: 'Sales requires two Emirati hires or internal moves to clear red status.',
  },
  Kuwait: {
    reviewDue: '12 May 2026',
    permitsNote: 'No Kuwaitisation blocks on active contracts',
    highlight: 'Maintain ratio when backfilling Operations roles in Ahmadi.',
  },
};

function alertAccent(sev: AlertSeverity): { border: string; icon: typeof exclamationTriangleIcon; bg: string } {
  switch (sev) {
    case 'critical':
      return {
        border: colors.cinnamon500,
        icon: exclamationCircleIcon,
        bg: colors.cinnamon100,
      };
    case 'warning':
      return {
        border: colors.cantaloupe500,
        icon: exclamationTriangleIcon,
        bg: colors.cantaloupe100,
      };
    default:
      return {
        border: colors.soap400,
        icon: infoIcon,
        bg: colors.soap100,
      };
  }
}

const ByCountryTabContent: React.FC<{
  onOpenOverviewForCountry: (country: string) => void;
}> = ({ onOpenOverviewForCountry }) => (
  <Box
    style={{
      maxWidth: 1180,
      margin: `${space.l} auto 0`,
      padding: space.xl,
      backgroundColor: '#fff',
      border: `1px solid ${colors.soap300}`,
      borderRadius: SHELL_RADIUS,
      boxShadow: SANA_CARD_SHADOW_LIFTED,
    }}
  >
    <Heading size="large" marginBottom="xs">
      By country
    </Heading>
    <BodyText size="medium" color={colors.blackPepper600} marginBottom="xl" style={{ maxWidth: 720 }}>
      Deep view per jurisdiction: programme name, headcount, gap to threshold, and next compliance actions.
      Illustrative data for stakeholder walkthroughs.
    </BodyText>

    <Flex flexDirection="column" gap="l">
      {COUNTRY_DATA.map((metric) => {
        const insight = COUNTRY_INSIGHTS[metric.country];
        const gap = metric.thresholdPercent - metric.currentPercent;
        return (
          <Card
            key={metric.country}
            padding="l"
            style={{
              border: `1px solid ${colors.soap300}`,
              borderRadius: CARD_RADIUS,
              backgroundColor: colors.frenchVanilla100,
              boxShadow: 'none',
            }}
          >
            <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m" marginBottom="m">
              <Flex alignItems="flex-start" gap="m">
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: colors.soap200,
                    flexShrink: 0,
                  }}
                >
                  <SystemIcon icon={flagIcon} size={24} color={colors.blackPepper500} aria-hidden />
                </Flex>
                <Box>
                  <Heading size="small" marginBottom="xxs">
                    {metric.country}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500}>
                    {metric.program} programme
                  </BodyText>
                </Box>
              </Flex>
              <Box
                paddingX="s"
                paddingY="xxs"
                style={{
                  backgroundColor: getStatusBgColor(metric.status),
                  borderRadius: 999,
                }}
              >
                <BodyText size="small" color={getStatusColor(metric.status)} style={{ fontWeight: 600 }}>
                  {getStatusLabel(metric.status)}
                </BodyText>
              </Box>
            </Flex>

            <Flex gap="l" flexWrap="wrap" marginBottom="m">
              {[
                { label: 'Nationalisation rate', value: `${metric.currentPercent}%` },
                { label: 'Required threshold', value: `${metric.thresholdPercent}%` },
                { label: 'Nationals / total roles', value: `${metric.nationals} / ${metric.total}` },
                {
                  label: 'Gap to threshold',
                  value: gap <= 0 ? 'Met' : `${gap}% below`,
                },
              ].map((cell) => (
                <Box
                  key={cell.label}
                  padding="m"
                  style={{
                    minWidth: 140,
                    flex: '1 1 140px',
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.soap200}`,
                    borderRadius: 12,
                  }}
                >
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
                    {cell.label}
                  </BodyText>
                  <BodyText size="large" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
                    {cell.value}
                  </BodyText>
                </Box>
              ))}
            </Flex>

            <Box marginBottom="m">
              <BodyText size="small" fontWeight="bold" color={colors.blackPepper600} marginBottom="xs">
                Progress vs threshold
              </BodyText>
              <ProgressBar value={metric.currentPercent} threshold={metric.thresholdPercent} status={metric.status} />
            </Box>

            {insight ? (
              <Box
                padding="m"
                marginBottom="m"
                style={{
                  backgroundColor: colors.soap100,
                  borderRadius: 12,
                  border: `1px solid ${colors.soap200}`,
                }}
              >
                <Flex alignItems="center" gap="xs" marginBottom="s">
                  <SystemIcon icon={clockIcon} size={18} color={colors.blackPepper500} aria-hidden />
                  <BodyText size="small" fontWeight="bold" color={colors.blackPepper600}>
                    Next review: {insight.reviewDue}
                  </BodyText>
                </Flex>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
                  {insight.permitsNote}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper500}>
                  {insight.highlight}
                </BodyText>
              </Box>
            ) : null}

            <Flex gap="s" flexWrap="wrap">
              <SecondaryButton size="small" onClick={() => onOpenOverviewForCountry(metric.country)}>
                Open department breakdown
              </SecondaryButton>
              <Tooltip title={THRESHOLD_TOOLTIPS[metric.country] ?? ''} type="describe">
                <SecondaryButton size="small" icon={infoIcon} iconPosition="start">
                  Programme context
                </SecondaryButton>
              </Tooltip>
            </Flex>
          </Card>
        );
      })}
    </Flex>
  </Box>
);

const AlertsTabContent: React.FC = () => {
  const ordered = [...COMPLIANCE_ALERTS].sort((a, b) => {
    const rank: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  return (
    <Box
      style={{
        maxWidth: 1180,
        margin: `${space.l} auto 0`,
        padding: space.xl,
        backgroundColor: '#fff',
        border: `1px solid ${colors.soap300}`,
        borderRadius: SHELL_RADIUS,
        boxShadow: SANA_CARD_SHADOW_LIFTED,
      }}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m" marginBottom="l">
        <Box style={{ maxWidth: 640 }}>
          <Heading size="large" marginBottom="xs">
            Alerts
          </Heading>
          <BodyText size="medium" color={colors.blackPepper600}>
            Threshold breaches, regulatory changes, and process reminders. Sorted by severity. Data is illustrative.
          </BodyText>
        </Box>
        <Flex alignItems="center" gap="xs" padding="s" style={{ backgroundColor: colors.soap100, borderRadius: 12 }}>
          <SystemIcon icon={checkIcon} size={18} color={colors.greenApple600} aria-hidden />
          <BodyText size="small" color={colors.blackPepper600}>
            {ordered.filter((a) => a.severity === 'critical').length} critical ·{' '}
            {ordered.filter((a) => a.severity === 'warning').length} warnings ·{' '}
            {ordered.filter((a) => a.severity === 'info').length} informational
          </BodyText>
        </Flex>
      </Flex>

      <Flex flexDirection="column" gap="m">
        {ordered.map((alert) => {
          const { border, icon, bg } = alertAccent(alert.severity);
          return (
            <Card
              key={alert.id}
              padding="none"
              style={{
                border: `1px solid ${colors.soap300}`,
                borderRadius: CARD_RADIUS,
                overflow: 'hidden',
                boxShadow: 'none',
              }}
            >
              <Flex style={{ minHeight: '100%' }}>
                <Box style={{ width: 4, flexShrink: 0, backgroundColor: border }} aria-hidden />
                <Flex padding="l" flex={1} gap="m" alignItems="flex-start" flexWrap="wrap">
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: bg,
                      flexShrink: 0,
                    }}
                  >
                    <SystemIcon icon={icon} size={22} color={colors.blackPepper600} aria-hidden />
                  </Flex>
                  <Box flex={1} style={{ minWidth: 220 }}>
                    <Flex alignItems="center" gap="s" flexWrap="wrap" marginBottom="xs">
                      <BodyText size="small" fontWeight="bold" color={colors.blackPepper600}>
                        {alert.title}
                      </BodyText>
                      {alert.country ? (
                        <Box
                          paddingX="xs"
                          paddingY="xxs"
                          style={{
                            backgroundColor: colors.soap200,
                            borderRadius: 999,
                          }}
                        >
                          <BodyText size="small" color={colors.blackPepper600}>
                            {alert.country}
                          </BodyText>
                        </Box>
                      ) : null}
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper600} marginBottom="s" style={{ lineHeight: 1.45 }}>
                      {alert.description}
                    </BodyText>
                    <Flex gap="m" flexWrap="wrap" alignItems="center">
                      <BodyText size="small" color={colors.blackPepper500}>
                        {alert.category}
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper400}>
                        {alert.dateLabel}
                      </BodyText>
                    </Flex>
                  </Box>
                  <Flex gap="s" flexShrink={0}>
                    <SecondaryButton size="small">View details</SecondaryButton>
                    <SecondaryButton size="small">Dismiss</SecondaryButton>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
};

const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'by_country', label: 'By country' },
  { id: 'alerts', label: 'Alerts' },
] as const;

export const GCCNationalizationCompliance: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [leftNavTab, setLeftNavTab] = useState<string>('overview');

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[#&]country=([^&]+)/);
    if (match) {
      const country = COUNTRY_FROM_HASH[match[1].toLowerCase()];
      if (country) setSelectedCountry(country);
    }
  }, []);

  const filteredDrillDown = selectedCountry
    ? DRILL_DOWN_DATA.filter((r) => r.country === selectedCountry)
    : DRILL_DOWN_DATA;

  const handleExport = () => {
    setExportSuccess(true);
    window.setTimeout(() => setExportSuccess(false), 4000);
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        notificationBadge={20}
        inboxBadge={101}
        searchMaxWidthPx={560}
      />

      <Flex
        alignItems="stretch"
        style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}
      >
        <WorkdayLeftTabBar
          secondaryTitle="GCC compliance"
          secondarySubtitle="Nationalisation dashboards"
          tabs={[...DASHBOARD_TABS]}
          activeTabId={leftNavTab}
          onTabChange={setLeftNavTab}
        />
        <Box flex={1} minWidth={0} style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Box
            paddingX="l"
            paddingY="s"
            style={{
              backgroundColor: colors.soap200,
              borderBottom: `1px solid ${colors.soap300}`,
            }}
          >
            <BodyText size="small" color={colors.blackPepper500}>
              Recruiting{' '}
              <span style={{ color: colors.soap400, margin: '0 6px' }} aria-hidden>
                /
              </span>{' '}
              Dashboards{' '}
              <span style={{ color: colors.soap400, margin: '0 6px' }} aria-hidden>
                /
              </span>{' '}
              <span style={{ color: colors.blackPepper600, fontWeight: 600 }}>GCC nationalisation compliance</span>
            </BodyText>
          </Box>
          <Box padding="l" paddingBottom="xxl" style={{ flex: 1 }}
          >
          {leftNavTab === 'overview' ? (
            <Box
              style={{
                maxWidth: 1180,
                margin: `${space.l} auto 0`,
                padding: space.xl,
                backgroundColor: '#fff',
                border: `1px solid ${colors.soap300}`,
                borderRadius: SHELL_RADIUS,
                boxShadow: SANA_CARD_SHADOW_LIFTED,
              }}
            >
              <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="l" flexWrap="wrap" gap="m">
                <Box flex="1" style={{ minWidth: 280 }}>
                  <Heading size="large" marginBottom="xs">
                    GCC nationalisation compliance
                  </Heading>
                  <BodyText size="medium" color={colors.blackPepper600}>
                    Nationalisation rates vs regulatory thresholds for Saudi Arabia, UAE, and Kuwait. Data is illustrative.
                  </BodyText>
                </Box>
                <PrimaryButton onClick={handleExport} icon={exportIcon}>
                  Export report
                </PrimaryButton>
              </Flex>

              {exportSuccess && (
                <Box
                  marginBottom="l"
                  padding="m"
                  style={{
                    backgroundColor: colors.greenApple100,
                    borderRadius: 12,
                    border: `1px solid ${colors.greenApple600}`,
                  }}
                >
                  <BodyText size="medium" color={colors.greenApple600}>
                    Report exported successfully. Ready for government submission.
                  </BodyText>
                </Box>
              )}

              <Flex gap="l" marginBottom="xl" flexWrap="wrap">
                {COUNTRY_DATA.map((metric) => (
                  <MetricCard key={metric.country} metric={metric} />
                ))}
              </Flex>

              <Card
                padding="l"
                style={{
                  backgroundColor: colors.soap100,
                  border: `1px solid ${colors.soap300}`,
                  borderRadius: CARD_RADIUS,
                }}
              >
                <Heading size="medium" marginBottom="xs">
                  Breakdown by department
                </Heading>
                <BodyText size="small" marginBottom="l" color={colors.blackPepper600}>
                  Filter by country. Use row status to spot departments that need attention.
                </BodyText>

                <Flex gap="xs" marginBottom="l" flexWrap="wrap">
                  <SecondaryButton
                    size="small"
                    onClick={() => setSelectedCountry(null)}
                    style={pillButton(selectedCountry === null)}
                  >
                    All countries
                  </SecondaryButton>
                  {COUNTRY_DATA.map((m) => (
                    <SecondaryButton
                      key={m.country}
                      size="small"
                      onClick={() => setSelectedCountry(selectedCountry === m.country ? null : m.country)}
                      style={pillButton(selectedCountry === m.country)}
                    >
                      {m.country}
                    </SecondaryButton>
                  ))}
                </Flex>

                <Box
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    border: `1px solid ${colors.soap300}`,
                    overflow: 'hidden',
                  }}
                >
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Department</Table.Header>
                        <Table.Header>Country</Table.Header>
                        <Table.Header>Nationals</Table.Header>
                        <Table.Header>Total</Table.Header>
                        <Table.Header>Nationalisation %</Table.Header>
                        <Table.Header>Status</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {filteredDrillDown.map((row, idx) => (
                        <Table.Row key={`${row.department}-${row.country}-${idx}`}>
                          <Table.Cell>{row.department}</Table.Cell>
                          <Table.Cell>{row.country}</Table.Cell>
                          <Table.Cell>{row.nationals}</Table.Cell>
                          <Table.Cell>{row.total}</Table.Cell>
                          <Table.Cell>{row.percent}%</Table.Cell>
                          <Table.Cell>
                            <Box
                              paddingX="s"
                              paddingY="xxs"
                              style={{
                                backgroundColor: getStatusBgColor(row.status),
                                borderRadius: 12,
                                display: 'inline-block',
                              }}
                            >
                              <BodyText size="small" color={getStatusColor(row.status)} style={{ fontWeight: 600 }}>
                                {getStatusLabel(row.status)}
                              </BodyText>
                            </Box>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Box>
              </Card>
            </Box>
          ) : leftNavTab === 'by_country' ? (
            <ByCountryTabContent
              onOpenOverviewForCountry={(country) => {
                setSelectedCountry(country);
                setLeftNavTab('overview');
              }}
            />
          ) : (
            <AlertsTabContent />
          )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default GCCNationalizationCompliance;
