import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Table } from '@workday/canvas-kit-react/table';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { Tooltip } from '@workday/canvas-kit-react/tooltip';
import {
  searchIcon,
  justifyIcon,
  infoIcon,
  exportIcon,
} from '@workday/canvas-system-icons-web';

/**
 * GCC Nationalization & Compliance Dashboard
 *
 * Prototype for Workday Recruiting GCC compliance metrics:
 * - Saudi Arabia (Nitaqat): 60% threshold
 * - UAE (Emiratisation): 20% threshold
 * - Kuwait (Kuwaitisation): 50% threshold
 *
 * Design Reference: 2-Way Email Recruiting Figma (HpAOHGAeXBORpHnyhsCMja)
 * PRD: docs/prds/gcc-nationalization-compliance-prd.md
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

const MetricCard: React.FC<{
  metric: CountryMetric;
}> = ({ metric }) => {
  const tooltip = THRESHOLD_TOOLTIPS[metric.country];

  return (
    <Card padding="l" flex="1" minWidth="280px">
      <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
        <Box>
          <Heading size="small">{metric.country}</Heading>
          <BodyText size="small" color={colors.blackPepper500}>
            {metric.program}
          </BodyText>
        </Box>
        <Tooltip title={tooltip} type="describe">
          <span style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
            <SystemIcon icon={infoIcon} size={16} color={colors.blackPepper400} />
          </span>
        </Tooltip>
      </Flex>

      <Flex justifyContent="space-between" alignItems="baseline" marginBottom="xs">
        <BodyText size="large" style={{ fontWeight: 600 }}>
          {metric.currentPercent}%
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          of {metric.thresholdPercent}% required
        </BodyText>
      </Flex>

      <ProgressBar value={metric.currentPercent} threshold={metric.thresholdPercent} status={metric.status} />

      <Flex marginTop="s" alignItems="center" gap="xs">
        <Box
          padding="xxs"
          paddingX="xs"
          style={{
            backgroundColor: getStatusBgColor(metric.status),
            borderRadius: 4,
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

export const GCCNationalizationCompliance: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

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
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <Box>
      {/* Top Navigation - Standard Workday pattern */}
      <Box
        paddingX="l"
        paddingY="s"
        style={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${colors.soap300}`,
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap="l">
          <Flex alignItems="center" gap="m" flex="0 0 auto">
            <ToolbarIconButton icon={justifyIcon} aria-label="Menu" />
            <Box
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.blueberry500,
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              Workday
            </Box>
          </Flex>

          <Box flex="1 1 auto" maxWidth="600px" style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <SystemIcon icon={searchIcon} size={16} color={colors.blackPepper400} />
            </Box>
            <TextInput
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: colors.soap100,
                border: `1px solid ${colors.soap300}`,
                borderRadius: 4,
                padding: '8px 12px 8px 36px',
              }}
            />
          </Box>

          <Flex alignItems="center" flex="0 0 auto">
            <Avatar size={32} altText="User" as="div" />
          </Flex>
        </Flex>
      </Box>

      {/* Main content */}
      <Box padding="xl" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="l" style={{ flexWrap: 'wrap', gap: space.m }}>
          <Box>
            <Heading size="large" marginBottom="xs">
              GCC nationalisation compliance
            </Heading>
            <BodyText size="medium" color={colors.blackPepper600}>
              Track nationalisation metrics against regulatory thresholds for Saudi, UAE, and Kuwait
            </BodyText>
          </Box>
          <PrimaryButton onClick={handleExport} icon={exportIcon}>
            Export report
          </PrimaryButton>
        </Flex>

        {exportSuccess && (
          <Box
            marginBottom="m"
            padding="m"
            style={{
              backgroundColor: colors.greenApple100,
              borderRadius: 4,
              border: `1px solid ${colors.greenApple600}`,
            }}
          >
            <BodyText size="medium" color={colors.greenApple600}>
              Report exported successfully. Ready for government submission.
            </BodyText>
          </Box>
        )}

        {/* Metrics cards */}
        <Flex gap="l" marginBottom="xl" style={{ flexWrap: 'wrap' }}>
          {COUNTRY_DATA.map((metric) => (
            <MetricCard key={metric.country} metric={metric} />
          ))}
        </Flex>

        {/* Drill-down section */}
        <Card padding="l">
          <Heading size="medium" marginBottom="m">
            Breakdown by department
          </Heading>
          <BodyText size="small" marginBottom="m" color={colors.blackPepper600}>
            Filter by country to see nationalisation % by department. Click a row to drill down further.
          </BodyText>

          <Flex gap="s" marginBottom="m" style={{ flexWrap: 'wrap' }}>
            <SecondaryButton
              onClick={() => setSelectedCountry(null)}
              style={
                selectedCountry === null
                  ? { backgroundColor: colors.blueberry100, borderColor: colors.blueberry500 }
                  : undefined
              }
            >
              All countries
            </SecondaryButton>
            {COUNTRY_DATA.map((m) => (
              <SecondaryButton
                key={m.country}
                onClick={() => setSelectedCountry(selectedCountry === m.country ? null : m.country)}
                style={
                  selectedCountry === m.country
                    ? { backgroundColor: colors.blueberry100, borderColor: colors.blueberry500 }
                    : undefined
                }
              >
                {m.country}
              </SecondaryButton>
            ))}
          </Flex>

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
                      padding="xxs"
                      paddingX="xs"
                      style={{
                        backgroundColor: getStatusBgColor(row.status),
                        borderRadius: 4,
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
        </Card>
      </Box>
    </Box>
  );
};

export default GCCNationalizationCompliance;
