import React, { useState } from 'react';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Table } from '@workday/canvas-kit-react/table';
import { Select } from '@workday/canvas-kit-react/select';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_SHELL_RADIUS,
  SANA_CARD_SHADOW_LIFTED,
} from './components';

/**
 * GCC Recruiter operations dashboard (concept)
 * GCC-E2E-002 | PMF v41 HITL #7
 * PRD: docs/prds/gcc-recruiter-dashboard-prd.md
 */

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
] as const;

function KpiTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card
      padding="l"
      style={{
        flex: '1 1 200px',
        minWidth: 180,
        borderRadius: SANA_CARD_RADIUS_LG,
        boxShadow: SANA_CARD_SHADOW_LIFTED,
        backgroundColor: colors.frenchVanilla100,
      }}
    >
      <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
        {label}
      </BodyText>
      <Heading size="medium" style={{ marginBottom: space.xs }}>
        {value}
      </Heading>
      <BodyText size="small" color={colors.blackPepper500}>
        {hint}
      </BodyText>
    </Card>
  );
}

function tableShell(children: React.ReactNode) {
  return (
    <Box
      style={{
        borderRadius: 12,
        border: `1px solid ${colors.soap300}`,
        overflow: 'hidden',
        backgroundColor: colors.soap100,
      }}
    >
      {children}
    </Box>
  );
}

const MOCK_REQS = [
  { id: 'REQ-2026-0142', title: 'Principal Product Manager — Recruiting', loc: 'Dubai, UAE', status: 'Interview', cand: 23, owner: 'You' },
  { id: 'REQ-2026-0118', title: 'Senior TA Partner — Technology', loc: 'Riyadh, KSA', status: 'Screen', cand: 56, owner: 'You' },
  { id: 'REQ-2026-0097', title: 'Graduate Programme — Engineering', loc: 'Remote — GCC', status: 'Offer', cand: 12, owner: 'M. Al-Rashid' },
  { id: 'REQ-2026-0081', title: 'HR Business Partner — Corporate', loc: 'Abu Dhabi, UAE', status: 'Approved', cand: 0, owner: 'You' },
];

const MOCK_CANDIDATES = [
  { name: 'Sara Al-Mansoori', stage: 'Interview', req: 'REQ-2026-0142', loc: 'Dubai', activity: '19 March 2026' },
  { name: 'Ahmed Al-Rashid', stage: 'Screen', req: 'REQ-2026-0118', loc: 'Riyadh', activity: '18 March 2026' },
  { name: 'Fatima Al-Zahra', stage: 'Offer', req: 'REQ-2026-0097', loc: 'Kuwait City', activity: '17 March 2026' },
  { name: 'Omar Hassan', stage: 'New', req: 'REQ-2026-0142', loc: 'Sharjah', activity: '20 March 2026' },
  { name: 'Layla Al-Sabah', stage: 'Hired', req: 'REQ-2026-0081', loc: 'Manama', activity: '12 March 2026' },
];

export const GccRecruiterDashboard: React.FC = () => {
  const [topSearch, setTopSearch] = useState('');
  const [leftTab, setLeftTab] = useState<string>('dashboard');
  const [lob, setLob] = useState('all');
  const [location, setLocation] = useState('all');
  const [level, setLevel] = useState('all');
  const [reqSearch, setReqSearch] = useState('');
  const [reqStatus, setReqStatus] = useState('all');
  const [candSearch, setCandSearch] = useState('');

  const filteredReqs = MOCK_REQS.filter((r) => {
    const q = reqSearch.trim().toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const matchS = reqStatus === 'all' || r.status === reqStatus;
    return matchQ && matchS;
  });

  const filteredCands = MOCK_CANDIDATES.filter((c) => {
    const q = candSearch.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.req.toLowerCase().includes(q);
  });

  const mainShell = (
    <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
      <WorkdayLeftTabBar
        secondaryTitle="Recruiting — GCC & international"
        secondarySubtitle="Operating metrics · Concept data"
        tabs={[...HUB_TABS]}
        activeTabId={leftTab}
        onTabChange={setLeftTab}
      />
      <Box flex={1} minWidth={0} style={{ overflow: 'auto', backgroundColor: SANA_PAGE_CANVAS }}>
        <Box
          margin="l"
          style={{
            borderRadius: SANA_SHELL_RADIUS,
            backgroundColor: colors.frenchVanilla100,
            boxShadow: SANA_CARD_SHADOW_LIFTED,
            minHeight: '100%',
          }}
        >
          {leftTab === 'overview' && (
            <Box padding="l">
              <Heading size="large" marginBottom="xs">
                Recruiting overview
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Snapshot of open work and pipeline health for your scope.
              </BodyText>
              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <KpiTile label="Open requisitions" value="47" hint="Assigned to you or your team" />
                <KpiTile label="Candidates in motion" value="612" hint="Active in pipeline" />
                <KpiTile label="Offers out" value="18" hint="Awaiting response" />
              </Flex>
              <Heading size="small" marginBottom="s">
                Recent activity
              </Heading>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>When</Table.Header>
                      <Table.Header>Event</Table.Header>
                      <Table.Header>Requisition</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Today, 08:40</Table.Cell>
                      <Table.Cell>Candidate moved to interview</Table.Cell>
                      <Table.Cell>REQ-2026-0142</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Yesterday</Table.Cell>
                      <Table.Cell>New application batch (12)</Table.Cell>
                      <Table.Cell>REQ-2026-0118</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>18 Mar</Table.Cell>
                      <Table.Cell>Offer accepted</Table.Cell>
                      <Table.Cell>REQ-2026-0097</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </Box>
          )}

          {leftTab === 'requisitions' && (
            <Box padding="l">
              <Heading size="large" marginBottom="xs">
                Job requisitions
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Search and filter requisitions you own or support.
              </BodyText>
              <Flex gap="m" marginBottom="m" flexWrap="wrap" alignItems="flex-end">
                <Box style={{ flex: '1 1 220px', minWidth: 180 }}>
                  <FormField label="Search" inputId="req-search">
                    <TextInput
                      id="req-search"
                      value={reqSearch}
                      onChange={(e) => setReqSearch(e.target.value)}
                      placeholder="Title or req ID"
                    />
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 160 }}>
                  <FormField label="Status" inputId="req-status">
                    <Select id="req-status" value={reqStatus} onChange={(e) => setReqStatus(e.target.value)}>
                      <option value="all">All statuses</option>
                      <option value="Interview">Interview</option>
                      <option value="Screen">Screen</option>
                      <option value="Offer">Offer</option>
                      <option value="Approved">Approved</option>
                    </Select>
                  </FormField>
                </Box>
                <SecondaryButton>New requisition</SecondaryButton>
              </Flex>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Req ID</Table.Header>
                      <Table.Header>Title</Table.Header>
                      <Table.Header>Location</Table.Header>
                      <Table.Header>Status</Table.Header>
                      <Table.Header>Candidates</Table.Header>
                      <Table.Header>Recruiter</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {filteredReqs.map((r) => (
                      <Table.Row key={r.id}>
                        <Table.Cell>{r.id}</Table.Cell>
                        <Table.Cell>{r.title}</Table.Cell>
                        <Table.Cell>{r.loc}</Table.Cell>
                        <Table.Cell>{r.status}</Table.Cell>
                        <Table.Cell>{r.cand}</Table.Cell>
                        <Table.Cell>{r.owner}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Box>
          )}

          {leftTab === 'candidates' && (
            <Box padding="l">
              <Heading size="large" marginBottom="xs">
                Candidates
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Review candidates across your open requisitions.
              </BodyText>
              <Flex gap="m" marginBottom="m" flexWrap="wrap" alignItems="flex-end">
                <Box style={{ flex: '1 1 280px', minWidth: 200 }}>
                  <FormField label="Search" inputId="cand-search">
                    <TextInput
                      id="cand-search"
                      value={candSearch}
                      onChange={(e) => setCandSearch(e.target.value)}
                      placeholder="Name or requisition"
                    />
                  </FormField>
                </Box>
                <SecondaryButton>Save view</SecondaryButton>
              </Flex>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Candidate</Table.Header>
                      <Table.Header>Stage</Table.Header>
                      <Table.Header>Requisition</Table.Header>
                      <Table.Header>Location</Table.Header>
                      <Table.Header>Last activity</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {filteredCands.map((c) => (
                      <Table.Row key={`${c.name}-${c.req}`}>
                        <Table.Cell>{c.name}</Table.Cell>
                        <Table.Cell>{c.stage}</Table.Cell>
                        <Table.Cell>{c.req}</Table.Cell>
                        <Table.Cell>{c.loc}</Table.Cell>
                        <Table.Cell>{c.activity}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Box>
          )}

          {leftTab === 'dashboard' && (
            <Box padding="l">
              <Heading size="large" marginBottom="xs">
                Recruiter operations dashboard
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Median time to review, stage conversion, and LOB breakdown. Concept metrics for review; not connected to tenant
                data.
              </BodyText>

              <Flex gap="m" marginBottom="m" flexWrap="wrap" alignItems="flex-end">
                <Box style={{ flex: '1 1 200px', minWidth: 160 }}>
                  <FormField label="Line of business" inputId="dash-filter-lob">
                    <Select id="dash-filter-lob" value={lob} onChange={(e) => setLob(e.target.value)}>
                      <option value="all">All lines of business</option>
                      <option value="corp">Corporate functions</option>
                      <option value="tech">Technology</option>
                      <option value="ops">Operations</option>
                    </Select>
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 160 }}>
                  <FormField label="Location / region" inputId="dash-filter-loc">
                    <Select id="dash-filter-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="all">All locations</option>
                      <option value="gcc">GCC</option>
                      <option value="uae">United Arab Emirates</option>
                      <option value="ksa">Saudi Arabia</option>
                      <option value="emea">EMEA (non-GCC)</option>
                    </Select>
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 160 }}>
                  <FormField label="Management level" inputId="dash-filter-level">
                    <Select id="dash-filter-level" value={level} onChange={(e) => setLevel(e.target.value)}>
                      <option value="all">All levels</option>
                      <option value="ic">Individual contributor</option>
                      <option value="mgr">Manager</option>
                      <option value="dir">Director+</option>
                    </Select>
                  </FormField>
                </Box>
                <SecondaryButton>Export summary</SecondaryButton>
              </Flex>

              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Last refreshed: 20 March 2026, 09:15 (local) · Filters apply to tiles and tables below.
              </BodyText>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <KpiTile label="Median time to first review" value="18 h" hint="Vs prior 30 days" />
                <KpiTile label="Active requisitions" value="47" hint="Open · assigned to you or your team" />
                <KpiTile label="Candidates in pipeline" value="612" hint="Across filtered scope" />
                <KpiTile label="Screen → interview" value="34%" hint="Conversion · trailing 90 days" />
              </Flex>

              <Heading size="small" marginBottom="s">
                Stage funnel
              </Heading>
              <Box marginBottom="l">
                {tableShell(
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Stage</Table.Header>
                        <Table.Header>Candidates</Table.Header>
                        <Table.Header>Share of total</Table.Header>
                        <Table.Header>Conv. from prior</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>New</Table.Cell>
                        <Table.Cell>184</Table.Cell>
                        <Table.Cell>30%</Table.Cell>
                        <Table.Cell>—</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Screen</Table.Cell>
                        <Table.Cell>156</Table.Cell>
                        <Table.Cell>26%</Table.Cell>
                        <Table.Cell>85%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Interview</Table.Cell>
                        <Table.Cell>142</Table.Cell>
                        <Table.Cell>23%</Table.Cell>
                        <Table.Cell>91%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Offer</Table.Cell>
                        <Table.Cell>88</Table.Cell>
                        <Table.Cell>14%</Table.Cell>
                        <Table.Cell>62%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Hired</Table.Cell>
                        <Table.Cell>42</Table.Cell>
                        <Table.Cell>7%</Table.Cell>
                        <Table.Cell>48%</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                )}
              </Box>

              <Heading size="small" marginBottom="s">
                Breakdown by line of business
              </Heading>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Line of business</Table.Header>
                      <Table.Header>Open reqs</Table.Header>
                      <Table.Header>Median days in screen</Table.Header>
                      <Table.Header>Trend</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Technology</Table.Cell>
                      <Table.Cell>19</Table.Cell>
                      <Table.Cell>4.2</Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" style={{ fontWeight: 600, color: colors.greenApple600 }}>
                          Improving
                        </BodyText>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Operations</Table.Cell>
                      <Table.Cell>14</Table.Cell>
                      <Table.Cell>6.1</Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper500}>
                          Flat
                        </BodyText>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Corporate functions</Table.Cell>
                      <Table.Cell>14</Table.Cell>
                      <Table.Cell>5.0</Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" style={{ fontWeight: 600, color: colors.cantaloupe600 }}>
                          Watch
                        </BodyText>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={2}
        inboxBadge={4}
      />
      {mainShell}
    </Box>
  );
};

export default GccRecruiterDashboard;
