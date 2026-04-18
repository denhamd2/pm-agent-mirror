import React, { useMemo, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Table } from '@workday/canvas-kit-react/table';
import { PageHeader, MetricCard, FormSelect, FormTextInput } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { QueryMeta } from './data-view-dashboard';
import {
  KPIS,
  INSIGHTS,
  ADOPTION_SHARE_DATA,
  TENANT_PENETRATION_DATA,
  MENU_MIGRATION_DATA,
  SUBMISSIONS_TREND_DATA,
  CUMULATIVE_TENANTS_DATA,
  TENANT_USAGE_DATA,
} from './data-view-dashboard';
import { TENANT_FILTER_METADATA } from './data-dashboard-tenant-filters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface AgencyTypesImpactDashboardBodyProps {
  queryMeta: QueryMeta;
  /** Optional content above the page header (e.g. Value Realisation back link). */
  leadSlot?: React.ReactNode;
}

export const AgencyTypesImpactDashboardBody: React.FC<AgencyTypesImpactDashboardBodyProps> = ({
  queryMeta,
  leadSlot,
}) => {
  const [tenantFilter, setTenantFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  const enrichedData = useMemo(() => {
    return TENANT_USAGE_DATA.map((t) => {
      const meta = TENANT_FILTER_METADATA[t.tenant] || {
        region: 'Unknown',
        industry: 'Unknown',
        segment: 'Unknown',
      };
      return {
        ...t,
        region: meta.region,
        industry: meta.industry,
        segment: meta.segment,
      };
    });
  }, []);

  const regions = useMemo(
    () => ['All', ...Array.from(new Set(enrichedData.map((d) => d.region))).sort()],
    [enrichedData]
  );
  const industries = useMemo(
    () => ['All', ...Array.from(new Set(enrichedData.map((d) => d.industry))).sort()],
    [enrichedData]
  );

  const filteredData = useMemo(() => {
    return enrichedData.filter((d) => {
      const matchTenant = d.tenant.toLowerCase().includes(tenantFilter.toLowerCase());
      const matchRegion = regionFilter === 'All' || d.region === regionFilter;
      const matchIndustry = industryFilter === 'All' || d.industry === industryFilter;
      return matchTenant && matchRegion && matchIndustry;
    });
  }, [enrichedData, tenantFilter, regionFilter, industryFilter]);

  return (
    <Box style={{ backgroundColor: SANA_PAGE_CANVAS, paddingBottom: 40 }}>
      <Box style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {leadSlot ? <Box style={{ marginBottom: 8 }}>{leadSlot}</Box> : null}
        <PageHeader title={queryMeta.title} subtitle={queryMeta.subtitle} />
        <Flex gap="m" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
          {KPIS.map((kpi, i) => (
            <Box key={i} style={{ flex: '1 1 180px', minWidth: 160 }}>
              <MetricCard
                label={kpi.label}
                value={kpi.value}
                helperText={kpi.detail}
                changeIndicator={{ text: 'See charts', sentiment: 'neutral' }}
              />
            </Box>
          ))}
        </Flex>

        <Flex gap="m" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
          <Card style={{ flex: '1 1 48%', borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, padding: 24 }}>
            <Heading size="small" style={{ marginBottom: 4 }}>
              Adoption Share (%)
            </Heading>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 16 }}>
              NEW Agency Types submissions / all Post Job updates, per weekly sample (Saturdays since{' '}
              {queryMeta.launchDate})
            </BodyText>
            <Box style={{ height: 300 }}>
              <Line
                data={ADOPTION_SHARE_DATA}
                options={{
                  animation: { duration: 0 },
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, max: 2, title: { display: true, text: '% of Post Job' } },
                    x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                  },
                }}
              />
            </Box>
          </Card>

          <Card style={{ flex: '1 1 48%', borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, padding: 24 }}>
            <Heading size="small" style={{ marginBottom: 4 }}>
              Tenant Penetration (%)
            </Heading>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 16 }}>
              Tenants using NEW feature / tenants with any Post Job activity, same weekly samples
            </BodyText>
            <Box style={{ height: 300 }}>
              <Line
                data={TENANT_PENETRATION_DATA}
                options={{
                  animation: { duration: 0 },
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, max: 6, title: { display: true, text: '% of tenants' } },
                    x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                  },
                }}
              />
            </Box>
          </Card>

          <Card
            style={{
              flex: '1 1 100%',
              borderRadius: SANA_CARD_RADIUS_LG,
              boxShadow: SANA_CARD_SHADOW,
              padding: 24,
              marginTop: 24,
            }}
          >
            <Heading size="small" style={{ marginBottom: 4 }}>
              Menu Opens (Navigation Proxy)
            </Heading>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 16 }}>
              getReferencePrompt counts for OLD vs NEW GST branch per weekly sample (not submission volume)
            </BodyText>
            <Box style={{ height: 300 }}>
              <Line
                data={MENU_MIGRATION_DATA}
                options={{
                  animation: { duration: 0 },
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Open events' } },
                    x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                  },
                }}
              />
            </Box>
          </Card>
        </Flex>

        <Flex gap="m" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
          <Card style={{ flex: '1 1 48%', borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, padding: 24 }}>
            <Heading size="small" style={{ marginBottom: 4 }}>
              Weekly Submissions Trend
            </Heading>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 16 }}>
              NEW Agency Types submissions per sampled Saturday since launch ({queryMeta.launchDate})
            </BodyText>
            <Box style={{ height: 300 }}>
              <Line
                data={SUBMISSIONS_TREND_DATA}
                options={{
                  animation: { duration: 0 },
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Submissions' } },
                    x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                  },
                }}
              />
            </Box>
          </Card>

          <Card style={{ flex: '1 1 48%', borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, padding: 24 }}>
            <Heading size="small" style={{ marginBottom: 4 }}>
              Cumulative Tenant Adoption
            </Heading>
            <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 16 }}>
              Running count of unique tenants who have ever used the feature since launch
            </BodyText>
            <Box style={{ height: 300 }}>
              <Line
                data={CUMULATIVE_TENANTS_DATA}
                options={{
                  animation: { duration: 0 },
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Cumulative Tenants' } },
                    x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                  },
                }}
              />
            </Box>
          </Card>
        </Flex>

        <Card style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, padding: 24, marginTop: 24 }}>
          <Heading size="small" style={{ marginBottom: 16 }}>
            Tenant Adoption Details
          </Heading>

          <Flex gap="m" style={{ marginBottom: 24 }}>
            <Box style={{ flex: 1 }}>
              <FormTextInput
                id="agency-types-tenant-search"
                label="Search Tenant"
                value={tenantFilter}
                onChange={(v) => setTenantFilter(v)}
                placeholder="e.g. workday"
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <FormSelect
                id="agency-types-region-filter"
                label="Region"
                value={regionFilter}
                options={regions.map((r) => ({ value: r, label: r }))}
                onChange={(v) => setRegionFilter(v)}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <FormSelect
                id="agency-types-industry-filter"
                label="Industry"
                value={industryFilter}
                options={industries.map((i) => ({ value: i, label: i }))}
                onChange={(v) => setIndustryFilter(v)}
              />
            </Box>
          </Flex>

          <Box style={{ maxHeight: 400, overflowY: 'auto', border: `1px solid ${colors.soap400}`, borderRadius: 4 }}>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Tenant</Table.Header>
                  <Table.Header>Region</Table.Header>
                  <Table.Header>Industry</Table.Header>
                  <Table.Header style={{ textAlign: 'right' }}>18 Mar Submissions</Table.Header>
                  <Table.Header style={{ textAlign: 'right' }}>16 Apr Submissions</Table.Header>
                  <Table.Header style={{ textAlign: 'right' }}>Total</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredData.map((row, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell style={{ fontWeight: 500 }}>{row.tenant}</Table.Cell>
                    <Table.Cell>{row.region}</Table.Cell>
                    <Table.Cell>{row.industry}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>{row.mar_18}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>{row.apr_16}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right', fontWeight: 500 }}>{row.total}</Table.Cell>
                  </Table.Row>
                ))}
                {filteredData.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} style={{ textAlign: 'center', padding: 24, color: colors.licorice300 }}>
                      No tenants match the selected filters.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Box>
          <BodyText size="small" style={{ color: colors.licorice300, marginTop: 12 }}>
            Showing {filteredData.length} of {enrichedData.length} tenants
          </BodyText>
        </Card>

        <Card
          style={{
            borderRadius: SANA_CARD_RADIUS_LG,
            boxShadow: SANA_CARD_SHADOW,
            borderLeft: `4px solid ${colors.blueberry500}`,
            padding: 24,
            marginTop: 24,
          }}
        >
          <Heading size="small" style={{ marginBottom: 16 }}>
            Data Scientist Insights
          </Heading>

          {INSIGHTS.map((insight, i) => (
            <Box key={i} style={{ marginBottom: i < INSIGHTS.length - 1 ? 20 : 0 }}>
              <BodyText size="medium" style={{ fontWeight: 600, marginBottom: 4 }}>
                {insight.finding}
              </BodyText>
              <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 4 }}>
                {insight.evidence}
              </BodyText>
              <Flex gap="xs" alignItems="center" style={{ marginBottom: 4 }}>
                <Box
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor:
                      insight.confidence === 'High'
                        ? colors.greenApple100
                        : insight.confidence === 'Medium'
                          ? colors.cantaloupe100
                          : colors.cinnamon100,
                    color:
                      insight.confidence === 'High'
                        ? colors.greenApple600
                        : insight.confidence === 'Medium'
                          ? colors.cantaloupe600
                          : colors.cinnamon600,
                  }}
                >
                  {insight.confidence} confidence
                </Box>
                <BodyText size="small" style={{ color: colors.licorice300 }}>
                  {insight.confidenceReason}
                </BodyText>
              </Flex>
              <BodyText size="small" style={{ fontWeight: 500 }}>
                Recommendation: {insight.recommendation}
              </BodyText>
              {insight.caveats.length > 0 && (
                <Box style={{ marginTop: 4 }}>
                  {insight.caveats.map((c, j) => (
                    <BodyText key={j} size="small" style={{ color: colors.licorice300 }}>
                      - {c}
                    </BodyText>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Card>

        <Box style={{ marginTop: 40, textAlign: 'center' }}>
          <BodyText size="small" style={{ color: colors.licorice300 }}>
            Source: {queryMeta.source} | Environment: {queryMeta.environment} | Filters: {queryMeta.filters}
          </BodyText>
          <BodyText size="small" style={{ color: colors.licorice300 }}>
            Date Range: {queryMeta.dateRange} | Generated: {queryMeta.queryDate}
          </BodyText>
        </Box>
      </Box>
    </Box>
  );
};
