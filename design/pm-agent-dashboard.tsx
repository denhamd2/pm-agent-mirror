import React, { useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { PageHeader, MetricCard, AlertBanner } from './components';
import { ChartCard } from './components/GenUIPatterns';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG } from './components/sanaShellTheme';
import { DesignSystemTab } from './components/DesignSystemTab';
import { AgentFlowTab } from './components/AgentFlowTab';

import morningData from '../docs/morning-roundup-data.json';
import savedPrototypesData from '../docs/saved-prototypes.json';
import statsWarehouseData from '../docs/stats-warehouse-data-sources.json';
import rawPrototypesHtml from '../docs/pm-agent-prototypes.html?raw';
import { Table } from '@workday/canvas-kit-react/table';
import { starIcon, starHalfIcon } from '@workday/canvas-system-icons-web';
import { SystemIcon } from '@workday/canvas-kit-react/icon';

type DashboardTab =
  | 'morning-roundup'
  | 'agent-health'
  | 'prototypes'
  | 'data-sources'
  | 'design-system'
  | 'agent-flow';

type PrototypeEntry = {
  slug: string;
  name: string;
  description: string;
  category?: string;
  route?: string;
  files?: string[];
  prd?: string;
  brief?: string;
  deck?: string;
};

type StatsWarehouseSource = (typeof statsWarehouseData.sources)[number];

const VALID_TABS = new Set<DashboardTab>([
  'morning-roundup',
  'agent-health',
  'prototypes',
  'data-sources',
  'design-system',
  'agent-flow',
]);

function getInitialTab(): DashboardTab {
  const tab = new URLSearchParams(window.location.search).get('tab');
  return VALID_TABS.has(tab as DashboardTab) ? (tab as DashboardTab) : 'morning-roundup';
}

function getPrototypeFiles(proto: PrototypeEntry): string[] {
  if (proto.files && proto.files.length > 0) {
    return proto.files;
  }
  const files = [`design/${proto.slug}.tsx`];
  if (proto.prd) files.push(proto.prd);
  if (proto.brief) files.push(proto.brief);
  if (proto.deck) files.push(proto.deck);
  return files;
}

const sourceChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  backgroundColor: colors.soap100,
  color: colors.blackPepper500,
  fontSize: 12,
  fontWeight: 600,
};

export const PMAgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(getInitialTab);

  // Parse morning data
  const actionItems = morningData.jiraResponses || [];
  const customerIssues = morningData.customerIssues || [];
  const competitorNews = morningData.competitorNews || [];
  
  // Parse prototypes data
  const [savedPrototypes, setSavedPrototypes] = useState<string[]>(
    (savedPrototypesData.saved || []).map((p: any) => p.slug)
  );

  const allPrototypes = React.useMemo<PrototypeEntry[]>(() => {
    const match = rawPrototypesHtml.match(/<script id="prototypes-data" type="application\/json">([\s\S]*?)<\/script>/);
    return match ? JSON.parse(match[1]).prototypes : [];
  }, []);

  const orderedPrototypes = React.useMemo(() => {
    return [...allPrototypes].sort((a, b) => {
      const aSaved = savedPrototypes.includes(a.slug) ? 1 : 0;
      const bSaved = savedPrototypes.includes(b.slug) ? 1 : 0;
      if (aSaved !== bSaved) {
        return bSaved - aSaved;
      }
      return a.name.localeCompare(b.name);
    });
  }, [allPrototypes, savedPrototypes]);

  const sourceSummary = React.useMemo(() => {
    const sources = statsWarehouseData.sources as StatsWarehouseSource[];
    return {
      total: sources.length,
      validated: sources.filter(source => source.status.startsWith('validated')).length,
      exploratory: sources.filter(source => source.status === 'exploratory').length,
      dashboards: new Set(sources.flatMap(source => source.usedInDashboards)).size,
    };
  }, []);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const toggleSave = async (slug: string, proto: PrototypeEntry) => {
    const previousSaved = savedPrototypes;
    const isSaved = previousSaved.includes(slug);
    const newSaved = !isSaved;

    if (newSaved) {
      setSavedPrototypes([...new Set([...previousSaved, slug])]);
    } else {
      setSavedPrototypes(previousSaved.filter(s => s !== slug));
    }

    try {
      await fetch('http://localhost:8765/api/save-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, files: getPrototypeFiles(proto), saved: newSaved })
      });
    } catch (err) {
      console.error('Save failed:', err);
      setSavedPrototypes(previousSaved);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: SANA_PAGE_CANVAS,
        padding: '32px',
      }}
    >
      <Box style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <PageHeader
          title="PM Agent Dashboard"
          subtitle={`Last updated: ${new Date(morningData.generated).toLocaleString()}`}
          primaryActionText="Refresh Data"
          secondaryActionText="Export Report"
        />

        {customerIssues.length > 0 && (
          <AlertBanner
            type="error"
            message={`${customerIssues.length} customer escalation(s) require your attention today.`}
            actionText="View escalations"
            onClick={() => setActiveTab('morning-roundup')}
          />
        )}

        <Flex gap="s" marginBottom="l" style={{ borderBottom: `1px solid ${colors.soap300}`, paddingBottom: '8px' }}>
          <SecondaryButton 
            onClick={() => setActiveTab('morning-roundup')}
            style={activeTab === 'morning-roundup' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Morning Roundup
          </SecondaryButton>
          <SecondaryButton 
            onClick={() => setActiveTab('agent-health')}
            style={activeTab === 'agent-health' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Agent Health Scorecard
          </SecondaryButton>
          <SecondaryButton 
            onClick={() => setActiveTab('prototypes')}
            style={activeTab === 'prototypes' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Saved Prototypes
          </SecondaryButton>
          <SecondaryButton 
            onClick={() => setActiveTab('data-sources')}
            style={activeTab === 'data-sources' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Data Sources
          </SecondaryButton>
          <SecondaryButton 
            onClick={() => setActiveTab('design-system')}
            style={activeTab === 'design-system' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Design System
          </SecondaryButton>
          <SecondaryButton 
            onClick={() => setActiveTab('agent-flow')}
            style={activeTab === 'agent-flow' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
          >
            Agent Flow
          </SecondaryButton>
          <Box style={{ marginLeft: 'auto' }}>
            <SecondaryButton
              as="a"
              href="/value-realization-metrics"
              style={{
                borderColor: colors.blueberry400,
                color: colors.blueberry500,
                fontWeight: 600,
              }}
            >
              Value Realisation Metrics →
            </SecondaryButton>
          </Box>
        </Flex>

        <Box>
          {activeTab === 'morning-roundup' && (
            <Flex gap="m" marginBottom="l" flexWrap="wrap">
              <Box style={{ flex: '1 1 100%' }}>
                <Heading size="medium" marginBottom="m">Jira Action Items</Heading>
                {actionItems.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No action items today.</BodyText>
                ) : (
                  <Flex gap="m" flexDirection="column">
                    {actionItems.map((item: any, i: number) => (
                      <Card key={i} padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                        <Flex justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <BodyText size="medium" fontWeight="bold">
                              <a href={item.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry400, textDecoration: 'none' }}>
                                {item.key}: {item.summary}
                              </a>
                            </BodyText>
                            <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                              {item.tldrSummary}
                            </BodyText>
                          </Box>
                          <Box style={{ backgroundColor: colors.soap200, padding: '4px 8px', borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold">{item.priority}</BodyText>
                          </Box>
                        </Flex>
                        <Box marginTop="m" padding="s" style={{ backgroundColor: colors.frenchVanilla100, borderLeft: `4px solid ${colors.blueberry400}` }}>
                          <BodyText size="small" fontWeight="bold">{item.latestComment?.author} on {item.latestComment?.date}</BodyText>
                          <BodyText size="small" marginTop="xxs">{item.latestComment?.tldr}</BodyText>
                        </Box>
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>

              <Box style={{ flex: '1 1 100%', marginTop: space.l }}>
                <Heading size="medium" marginBottom="m">Customer Issues</Heading>
                {customerIssues.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No customer issues today.</BodyText>
                ) : (
                  <Flex gap="m" flexDirection="column">
                    {customerIssues.map((issue: any, i: number) => (
                      <Card key={i} padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, borderLeft: `4px solid ${colors.cinnamon500}` }}>
                        <Flex justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <BodyText size="medium" fontWeight="bold">
                              <a href={issue.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry400, textDecoration: 'none' }}>
                                {issue.key}: {issue.summary}
                              </a>
                            </BodyText>
                            <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                              Customer: {issue.customer} | Status: {issue.status} | Created: {issue.created}
                            </BodyText>
                            <BodyText size="small" marginTop="s">{issue.tldrSummary}</BodyText>
                          </Box>
                        </Flex>
                        {issue.diagnosis && (
                          <Box marginTop="m" padding="s" style={{ backgroundColor: colors.soap100, borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold">Deployment Agent Diagnosis ({issue.diagnosis.confidence} Confidence)</BodyText>
                            <BodyText size="small" marginTop="xxs">Classification: {issue.diagnosis.classification}</BodyText>
                            <BodyText size="small" marginTop="xxs">{issue.diagnosis.reasoning}</BodyText>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>

              <Box style={{ flex: '1 1 100%', marginTop: space.l }}>
                <Heading size="medium" marginBottom="m">Competitor News</Heading>
                {competitorNews.length === 0 ? (
                  <BodyText size="small" color={colors.licorice300}>No competitor news today.</BodyText>
                ) : (
                  <Flex gap="m" flexWrap="wrap">
                    {competitorNews.map((news: any, i: number) => (
                      <Card key={i} padding="m" style={{ flex: '1 1 300px', borderRadius: SANA_CARD_RADIUS_LG }}>
                        <BodyText size="small" fontWeight="bold" color={colors.licorice400}>{news.competitor} • {news.date}</BodyText>
                        <Heading size="small" marginTop="xs" marginBottom="s">
                          <a href={news.url} target="_blank" rel="noreferrer" style={{ color: colors.blueberry500, textDecoration: 'none' }}>
                            {news.title}
                          </a>
                        </Heading>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: colors.blackPepper500, fontSize: '14px' }}>
                          {news.bullets.map((bullet: string, j: number) => (
                            <li key={j} style={{ marginBottom: '4px' }}>{bullet}</li>
                          ))}
                        </ul>
                        {news.workdayImplication && (
                          <Box marginTop="m" padding="s" style={{ backgroundColor: colors.cantaloupe100, borderRadius: '4px' }}>
                            <BodyText size="small" fontWeight="bold" color={colors.cantaloupe600}>Workday Implication</BodyText>
                            <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">{news.workdayImplication}</BodyText>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>
            </Flex>
          )}

          {activeTab === 'agent-health' && (
            <Box>
              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <MetricCard
                  label="Active Missions"
                  value="6"
                  helperText="Currently in progress"
                  changeIndicator={{ text: "-30 archived", sentiment: "positive" }}
                />
                <MetricCard
                  label="AlwaysApply Budget"
                  value="662 / 500"
                  helperText="Lines of code in alwaysApply rules"
                  changeIndicator={{ text: "-33% from 982", sentiment: "positive" }}
                />
                <MetricCard
                  label="Total Rule Lines"
                  value="13,106"
                  helperText="Across 28 .mdc and .md rules"
                  changeIndicator={{ text: "-7% from 14,152", sentiment: "positive" }}
                />
                <MetricCard
                  label="Overall Grade"
                  value="A-"
                  helperText="Based on architecture health"
                  changeIndicator={{ text: "Up from B+", sentiment: "positive" }}
                />
              </Flex>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <Box style={{ flex: '1 1 400px' }}>
                  <ChartCard
                    title="AlwaysApply Token Budget"
                    type="doughnut"
                    data={{
                      labels: ['Used (000-orchestrator)', 'Used (010-style-guide)', 'Available'],
                      datasets: [
                        {
                          data: [427, 235, 0],
                          backgroundColor: [colors.blueberry400, colors.cantaloupe400, colors.soap300],
                        },
                      ],
                    }}
                  />
                </Box>
                <Box style={{ flex: '2 1 600px' }}>
                  <ChartCard
                    title="Rule Size Distribution (Lines)"
                    type="bar"
                    data={{
                      labels: ['110', '105', '330', '430', '094', '108', '435', '420', '080', '001', '320', '200', '000', '130', '050'],
                      datasets: [
                        {
                          label: 'Lines of Code',
                          data: [767, 709, 683, 630, 620, 596, 555, 536, 461, 455, 443, 435, 427, 413, 329],
                          backgroundColor: colors.blueberry400,
                        },
                      ],
                    }}
                  />
                </Box>
              </Flex>
            </Box>
          )}

          {activeTab === 'prototypes' && (
            <Box>
              <Heading size="medium" marginBottom="xxs">Prototypes and Dashboards</Heading>
              <BodyText size="small" color={colors.licorice400} marginBottom="m">
                Saved entries stay pinned at the top and can be protected from cleanup when the local dashboard server is running.
              </BodyText>
              {orderedPrototypes.length === 0 ? (
                <BodyText size="small" color={colors.licorice300}>No prototypes found.</BodyText>
              ) : (
                <Card padding="zero" style={{ borderRadius: SANA_CARD_RADIUS_LG, overflow: 'hidden' }}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Prototype</Table.Header>
                        <Table.Header>Description</Table.Header>
                        <Table.Header>Links</Table.Header>
                        <Table.Header>Save</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {orderedPrototypes.map((proto: PrototypeEntry) => {
                        const isSaved = savedPrototypes.includes(proto.slug);
                        const route = proto.route || proto.slug;
                        return (
                          <Table.Row key={proto.slug} style={isSaved ? { backgroundColor: colors.soap100 } : {}}>
                            <Table.Cell>
                              <BodyText size="medium" fontWeight="bold" color={colors.blackPepper600}>
                                {proto.name}
                              </BodyText>
                              {proto.category && (
                                <BodyText size="small" color={colors.licorice400} marginTop="xxs">
                                  {proto.category}
                                </BodyText>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small" color={colors.blackPepper500}>
                                {proto.description}
                              </BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <Flex gap="s" flexWrap="wrap">
                                <SecondaryButton size="small" as="a" href={`/${route}`} target="_blank">
                                  Open
                                </SecondaryButton>
                                {proto.prd && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.prd}`} target="_blank">
                                    PRD
                                  </SecondaryButton>
                                )}
                                {proto.brief && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.brief}`} target="_blank">
                                    Brief
                                  </SecondaryButton>
                                )}
                                {proto.deck && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/${proto.deck}`} target="_blank">
                                    Deck
                                  </SecondaryButton>
                                )}
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <SecondaryButton
                                size="small"
                                icon={isSaved ? starIcon : starHalfIcon}
                                aria-label={isSaved ? "Unsave prototype" : "Save prototype"}
                                onClick={() => toggleSave(proto.slug, proto)}
                                style={isSaved ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : {}}
                              >
                                {isSaved ? "Saved" : "Save"}
                              </SecondaryButton>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </Card>
              )}
            </Box>
          )}

          {activeTab === 'data-sources' && (
            <Box>
              <Heading size="medium" marginBottom="xxs">Stats Warehouse Data Sources</Heading>
              <BodyText size="small" color={colors.licorice400} marginBottom="m">
                Canonical inventory for the data sources we know, what they contain in plain English, and where they already power PM dashboards.
              </BodyText>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <MetricCard
                  label="Known sources"
                  value={String(sourceSummary.total)}
                  helperText={`Inventory reviewed ${statsWarehouseData.lastReviewed}`}
                />
                <MetricCard
                  label="Validated sources"
                  value={String(sourceSummary.validated)}
                  helperText="Safe for production dashboards"
                />
                <MetricCard
                  label="Exploratory sources"
                  value={String(sourceSummary.exploratory)}
                  helperText="Discovery only until validated"
                />
                <MetricCard
                  label="Dashboards covered"
                  value={String(sourceSummary.dashboards)}
                  helperText="Distinct dashboard uses recorded"
                />
              </Flex>

              <Flex gap="m" flexDirection="column">
                {(statsWarehouseData.sources as StatsWarehouseSource[]).map(source => (
                  <Card key={source.id} padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="m" flexWrap="wrap">
                      <Box style={{ flex: '1 1 560px' }}>
                        <Heading size="small" marginBottom="xs">{source.name}</Heading>
                        <BodyText size="small" color={colors.licorice400} marginBottom="s">
                          `{source.table}` · {source.freshness}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                          {source.plainEnglish}
                        </BodyText>
                        <Flex gap="s" flexWrap="wrap" marginBottom="m">
                          <Box style={sourceChipStyle}>{source.status}</Box>
                          {source.usedInDashboards.slice(0, 3).map(label => (
                            <Box key={label} style={sourceChipStyle}>{label}</Box>
                          ))}
                        </Flex>
                      </Box>
                    </Flex>

                    <Flex gap="m" flexWrap="wrap">
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">Useful data points</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.usefulDataPoints.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">Used in dashboards</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.usedInDashboards.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                      <Box style={{ flex: '1 1 260px' }}>
                        <BodyText size="small" fontWeight="bold" marginBottom="s">PM notes</BodyText>
                        <ul style={{ margin: 0, paddingLeft: 20, color: colors.blackPepper500, fontSize: 14, lineHeight: 1.6 }}>
                          {source.pmNotes.map(point => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </Box>
          )}

          {activeTab === 'design-system' && <DesignSystemTab />}

          {activeTab === 'agent-flow' && <AgentFlowTab />}
        </Box>
      </Box>
    </Box>
  );
};

export default PMAgentDashboard;
