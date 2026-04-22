/**
 * Offers Dashboard v01 — SUV live data
 *
 * Shows the 10 most recent offer events pulled from the development SUV via WQL:
 *   SELECT subject, status, dateAndTimeInitiated, businessProcessStepAwaitingAction,
 *          daysSinceInitiated
 *   FROM   activeAndRenegotiatedOfferEmploymentAgreementEvents
 *   ORDER  BY dateAndTimeInitiated DESC
 *   LIMIT  10
 *
 * Granular status:
 *  - Stage (Offer / Employment Agreement / Completed)
 *  - Step awaiting action (Initiation / Action / Review Documents / ...)
 *  - Supervisory org context
 *  - Days since initiated
 *
 * Route: /offers-dashboard-v01
 */
import React, { useMemo, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { Table } from '@workday/canvas-kit-react/table';
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
  documentIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
  MetricCard,
  type WorkdayLeftTabBarPrimaryItem,
} from './components';
import { OFFERS_PARSED, type OfferEventParsed } from './data-offers-latest';

const NAV_PRIMARY: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'HOME' },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'RECRUIT' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'ORG' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'LINKS' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'MORE' },
];

type StageFilter = 'all' | 'Offer' | 'Employment Agreement' | 'Completed';

function formatInitiatedOn(usDate: string): string {
  if (!usDate) return '-';
  const parts = usDate.split('/');
  if (parts.length !== 3) return usDate;
  const [mm, dd, yyyy] = parts;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (Number.isNaN(d.getTime())) return usDate;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function stageIndicatorType(stage: string): {
  type: keyof typeof StatusIndicatorType;
  emphasis: keyof typeof StatusIndicatorEmphasis;
} {
  switch (stage) {
    case 'Offer':
      return { type: 'Blue', emphasis: 'Low' };
    case 'Employment Agreement':
      return { type: 'Orange', emphasis: 'Low' };
    case 'Completed':
      return { type: 'Green', emphasis: 'Low' };
    default:
      return { type: 'Gray', emphasis: 'Low' };
  }
}

function ageTone(days: number): { type: keyof typeof StatusIndicatorType; label: string } {
  if (days <= 30) return { type: 'Green', label: `${days}d` };
  if (days <= 180) return { type: 'Gray', label: `${days}d` };
  if (days <= 365) return { type: 'Orange', label: `${days}d` };
  return { type: 'Red', label: `${days}d` };
}

export function OffersDashboardV01() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [selected, setSelected] = useState<OfferEventParsed | null>(null);

  const offers = OFFERS_PARSED;

  const inProgress = offers.filter((o) => o.status === 'In Progress');
  const avgAgeInProgress = inProgress.length
    ? Math.round(inProgress.reduce((acc, o) => acc + o.daysSinceInitiated, 0) / inProgress.length)
    : 0;
  const staleCount = offers.filter(
    (o) => o.status === 'In Progress' && o.daysSinceInitiated > 180
  ).length;
  const completedCount = offers.filter((o) => o.status === 'Successfully Completed').length;

  const filteredOffers = useMemo(() => {
    if (stageFilter === 'all') return offers;
    return offers.filter((o) => o.stage === stageFilter);
  }, [offers, stageFilter]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: offers.length };
    for (const o of offers) {
      counts[o.stage] = (counts[o.stage] ?? 0) + 1;
    }
    return counts;
  }, [offers]);

  const stageTabs: Array<{ id: StageFilter; label: string }> = [
    { id: 'all', label: 'All offers' },
    { id: 'Offer', label: 'Offer stage' },
    { id: 'Employment Agreement', label: 'Employment agreement' },
    { id: 'Completed', label: 'Completed' },
  ];

  return (
    <Flex style={{ height: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayLeftTabBar
        primaryItems={NAV_PRIMARY}
        secondaryTitle="Recruiting"
        secondarySubtitle="Alex Morgan · Senior Recruiter"
        tabs={[
          { id: 'offers', label: 'Offers' },
          { id: 'candidates', label: 'Candidates' },
          { id: 'requisitions', label: 'Requisitions' },
          { id: 'reports', label: 'Reports' },
        ]}
        activeTabId="offers"
        onTabChange={() => {}}
      />

      <Flex flex={1} flexDirection="column" style={{ minWidth: 0 }}>
        <WorkdayTopNav
          searchPlaceholder="Search offers, candidates, requisitions..."
          searchValue=""
          onSearchChange={() => {}}
        />

        <Box
          flex={1}
          style={{
            marginTop: WORKDAY_TOP_NAV_HEIGHT_PX,
            overflowY: 'auto',
            padding: space.xl,
          }}
        >
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            marginBottom="l"
            flexWrap="wrap"
            gap="m"
          >
            <Box>
              <Heading size="large" marginY="zero" color={colors.blackPepper600}>
                Offers
              </Heading>
              <BodyText size="medium" color={colors.blackPepper500} marginTop="xxs">
                Latest 10 offer events with granular stage and step. Live data from the development SUV.
              </BodyText>
            </Box>
            <Flex gap="s" alignItems="center">
              <SecondaryButton>Export</SecondaryButton>
              <SecondaryButton>Refresh</SecondaryButton>
            </Flex>
          </Flex>

          <Flex gap="m" flexWrap="wrap" marginBottom="l">
            <Box flex="1 1 220px" minWidth={220}>
              <MetricCard
                label="Offers in progress"
                value={String(inProgress.length)}
                helperText={`${offers.length} total events in this batch`}
              />
            </Box>
            <Box flex="1 1 220px" minWidth={220}>
              <MetricCard
                label="Average age (in progress)"
                value={`${avgAgeInProgress} days`}
                helperText="Time since initiation"
              />
            </Box>
            <Box flex="1 1 220px" minWidth={220}>
              <MetricCard
                label="Stale (>180 days)"
                value={String(staleCount)}
                helperText="Aged offers still in progress"
                changeIndicator={
                  staleCount > 0
                    ? { text: 'Needs action', sentiment: 'negative' }
                    : { text: 'On track', sentiment: 'positive' }
                }
              />
            </Box>
            <Box flex="1 1 220px" minWidth={220}>
              <MetricCard
                label="Completed"
                value={String(completedCount)}
                helperText="Successfully completed in this batch"
                changeIndicator={{ text: 'Closed', sentiment: 'positive' }}
              />
            </Box>
          </Flex>

          <Flex
            gap="xs"
            marginBottom="m"
            style={{
              backgroundColor: colors.frenchVanilla100,
              padding: 6,
              borderRadius: 999,
              border: `1px solid ${colors.soap300}`,
              alignSelf: 'flex-start',
              width: 'fit-content',
            }}
          >
            {stageTabs.map((t) => {
              const isActive = stageFilter === t.id;
              const count = stageCounts[t.id] ?? 0;
              return (
                <Box
                  key={t.id}
                  as="button"
                  onClick={() => setStageFilter(t.id)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: 999,
                    backgroundColor: isActive ? colors.blackPepper600 : 'transparent',
                    color: isActive ? colors.frenchVanilla100 : colors.blackPepper500,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.label}
                  <Box
                    as="span"
                    style={{
                      marginLeft: 8,
                      padding: '1px 7px',
                      borderRadius: 999,
                      fontSize: 11,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.16)' : colors.soap200,
                      color: isActive ? colors.frenchVanilla100 : colors.blackPepper400,
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              );
            })}
          </Flex>

          <Box
            style={{
              backgroundColor: colors.frenchVanilla100,
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
            }}
          >
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Candidate</Table.Header>
                  <Table.Header>Requisition</Table.Header>
                  <Table.Header>Stage</Table.Header>
                  <Table.Header>Step awaiting action</Table.Header>
                  <Table.Header>Initiated</Table.Header>
                  <Table.Header>Age</Table.Header>
                  <Table.Header>Status</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredOffers.map((o) => {
                  const stage = stageIndicatorType(o.stage);
                  const age = ageTone(o.daysSinceInitiated);
                  return (
                    <Table.Row
                      key={o.id}
                      onClick={() => setSelected(o)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Table.Cell>
                        <Box
                          as="button"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelected(o);
                          }}
                          style={{
                            appearance: 'none',
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            cursor: 'pointer',
                            color: SANA_LINK_ACCENT,
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'inherit',
                            textAlign: 'left',
                          }}
                        >
                          {o.candidate || 'Unknown candidate'}
                        </Box>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {o.requisition || '-'}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusIndicator
                          type={StatusIndicatorType[stage.type]}
                          emphasis={StatusIndicatorEmphasis[stage.emphasis]}
                          label={o.stage}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {o.step || '-'}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {formatInitiatedOn(o.initiatedOn)}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusIndicator
                          type={StatusIndicatorType[age.type]}
                          emphasis={StatusIndicatorEmphasis.Low}
                          label={age.label}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {o.status}
                        </BodyText>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
                {filteredOffers.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={7}>
                      <Box padding="l" style={{ textAlign: 'center' }}>
                        <BodyText size="small" color={colors.blackPepper400}>
                          No offers match this filter.
                        </BodyText>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Box>

          {selected && (
            <Box
              marginTop="l"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
                <Flex alignItems="center" gap="s">
                  <Box
                    as="span"
                    dangerouslySetInnerHTML={{ __html: documentIcon }}
                    style={{ width: 20, height: 20, color: colors.blueberry500 }}
                  />
                  <Heading size="small" marginY="zero">
                    {selected.candidate || 'Offer detail'}
                  </Heading>
                </Flex>
                <SecondaryButton size="small" onClick={() => setSelected(null)}>
                  Close
                </SecondaryButton>
              </Flex>
              <Flex gap="xl" flexWrap="wrap">
                <DetailField label="Requisition" value={selected.requisition || '-'} />
                <DetailField label="Stage" value={selected.stage} />
                <DetailField label="Step" value={selected.step || '-'} />
                <DetailField label="Supervisory organisation" value={selected.supOrg || '-'} />
                <DetailField label="Initiated" value={formatInitiatedOn(selected.initiatedOn)} />
                <DetailField label="Days open" value={`${selected.daysSinceInitiated}`} />
                <DetailField label="Status" value={selected.status} />
                <DetailField label="BP event WID" value={selected.id} mono />
              </Flex>
            </Box>
          )}

          <Box marginTop="l">
            <BodyText size="small" color={colors.blackPepper400}>
              Data source: WQL `activeAndRenegotiatedOfferEmploymentAgreementEvents`. Latest 10 events
              by initiation date. Fetched from the development SUV (not production). Last pull: 21 April
              2026.
            </BodyText>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box style={{ minWidth: 200 }}>
      <BodyText size="small" color={colors.blackPepper400} style={{ fontWeight: 600 }}>
        {label}
      </BodyText>
      <BodyText
        size="small"
        color={colors.blackPepper600}
        style={mono ? { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace' } : undefined}
      >
        {value}
      </BodyText>
    </Box>
  );
}

export default OffersDashboardV01;
