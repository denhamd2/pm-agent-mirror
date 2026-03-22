import React, { useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { RadioGroup, Radio } from '@workday/canvas-kit-react/radio';
import { Select } from '@workday/canvas-kit-react/select';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  CommunicationDock,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  DEFAULT_COMM_EXPANDED_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW_LIFTED,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
} from './components';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { mailIcon } from '@workday/canvas-system-icons-web';

/**
 * GCC-E2E-005 Step 5 | GCC nationalisation & workforce compliance (v44)
 * Discovery: design/gcc-nationalisation-compliance-v44-discovery-brief.md
 * PRD: docs/prds/gcc-nationalisation-compliance-v44-prd.md
 *
 * Canvas Kit MCP: get-canvas-kit-tokens consulted for semantic colour roles (positive / caution / critical via fruit tokens in code).
 */

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'dashboard', label: 'Dashboard' },
] as const;

const DASH_INNER_TABS = [
  { id: 'metrics', label: 'Nationalisation metrics' },
  { id: 'packs', label: 'Country packs' },
  { id: 'pwd_gender', label: 'PWD & gender' },
  { id: 'audit', label: 'Audit & exports' },
] as const;

type HubId = (typeof HUB_TABS)[number]['id'];
type SortKey = 'name' | 'job' | 'nationality' | 'status' | 'completeness' | 'updated';

interface CandidateRow {
  name: string;
  job: string;
  nationality: string;
  status: string;
  completeness: string;
  updated: string;
  lob: string;
  location: string;
  pwdDisplay: string;
}

const MOCK_CANDIDATES: CandidateRow[] = [
  {
    name: 'Sara Al-Mansoori',
    job: 'Senior consultant — GCC',
    nationality: 'United Arab Emirates',
    status: 'Interview',
    completeness: 'Complete',
    updated: '21 Mar 2026',
    lob: 'Professional Services',
    location: 'Dubai',
    pwdDisplay: 'Not disclosed',
  },
  {
    name: 'Ahmed Al-Rashid',
    job: 'Principal PM — Recruiting',
    nationality: 'Saudi Arabia',
    status: 'Screen',
    completeness: 'Complete',
    updated: '20 Mar 2026',
    lob: 'Technology',
    location: 'Riyadh',
    pwdDisplay: 'Restricted',
  },
  {
    name: 'Fatima Al-Zahra',
    job: 'Graduate engineer',
    nationality: 'Kuwait',
    status: 'Offer',
    completeness: 'Missing visa class',
    updated: '19 Mar 2026',
    lob: 'Technology',
    location: 'Kuwait City',
    pwdDisplay: 'No',
  },
  {
    name: 'Omar Hassan',
    job: 'HR business partner',
    nationality: 'Egypt',
    status: 'New',
    completeness: 'Missing nationality',
    updated: '21 Mar 2026',
    lob: 'Corporate',
    location: 'Cairo',
    pwdDisplay: 'No',
  },
  {
    name: 'Layla Al-Sabah',
    job: 'TA partner — Sales',
    nationality: 'Kuwait',
    status: 'Hired',
    completeness: 'Complete',
    updated: '12 Mar 2026',
    lob: 'Sales',
    location: 'Kuwait City',
    pwdDisplay: 'No',
  },
  {
    name: 'Mariam Al-Farsi',
    job: 'Data analyst',
    nationality: 'United Arab Emirates',
    status: 'Interview',
    completeness: 'Complete',
    updated: '18 Mar 2026',
    lob: 'Technology',
    location: 'Abu Dhabi',
    pwdDisplay: 'Restricted',
  },
  {
    name: 'Khalid Al-Otaibi',
    job: 'Field engineer',
    nationality: 'Saudi Arabia',
    status: 'Screen',
    completeness: 'Complete',
    updated: '17 Mar 2026',
    lob: 'Operations',
    location: 'Dammam',
    pwdDisplay: 'No',
  },
  {
    name: 'Noor Rahman',
    job: 'Intern — Finance',
    nationality: 'Bahrain',
    status: 'Review',
    completeness: 'Pending ID verification',
    updated: '16 Mar 2026',
    lob: 'Finance',
    location: 'Manama',
    pwdDisplay: 'No',
  },
];

const MOCK_REQS = [
  { id: 'REQ-2026-0142', title: 'Senior consultant — GCC', loc: 'Dubai, UAE', status: 'Interview', cand: 23 },
  { id: 'REQ-2026-0118', title: 'Principal PM — Recruiting', loc: 'Riyadh, KSA', status: 'Screen', cand: 56 },
  { id: 'REQ-2026-0097', title: 'Graduate engineer', loc: 'Kuwait City', status: 'Offer', cand: 12 },
  { id: 'REQ-2026-0081', title: 'HR business partner', loc: 'Abu Dhabi, UAE', status: 'Approved', cand: 9 },
];

function KpiCard({
  title,
  value,
  gapText,
  denominatorHint,
}: {
  title: string;
  value: string;
  gapText: string;
  denominatorHint: string;
}) {
  return (
    <Card
      padding="l"
      style={{
        flex: '1 1 160px',
        minWidth: 150,
        maxWidth: 220,
        borderRadius: SANA_CARD_RADIUS_LG,
        boxShadow: SANA_CARD_SHADOW_LIFTED,
        backgroundColor: colors.frenchVanilla100,
        border: `1px solid ${colors.soap300}`,
      }}
    >
      <Heading size="small" marginBottom="xs">
        {title}
      </Heading>
      <BodyText size="large" fontWeight="bold" marginBottom="xxs">
        {value}
      </BodyText>
      <Subtext size="small" color={colors.blackPepper500} marginBottom="xxs">
        {gapText}
      </Subtext>
      <Subtext size="small" color={colors.blackPepper400}>
        {denominatorHint}
      </Subtext>
    </Card>
  );
}

function tableShell(children: React.ReactNode) {
  return (
    <Box
      style={{
        borderRadius: 12,
        border: `1px solid ${colors.soap300}`,
        overflow: 'auto',
        backgroundColor: colors.frenchVanilla100,
      }}
    >
      {children}
    </Box>
  );
}

function SortableHeader({
  label,
  active,
  ascending,
  onClick,
}: {
  label: string;
  active: boolean;
  ascending: boolean;
  onClick: () => void;
}) {
  return (
    <Table.Header>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Sort by ${label}${active ? `, ${ascending ? 'ascending' : 'descending'}` : ''}`}
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          margin: 0,
          font: 'inherit',
          color: active ? SANA_LINK_ACCENT : colors.blackPepper600,
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          fontWeight: active ? 700 : 600,
        }}
      >
        {label}
        {active ? (ascending ? ' \u25B2' : ' \u25BC') : ''}
      </button>
    </Table.Header>
  );
}

const EXPORT_DEFINITION_VERSION = 'GCC-WFC-2026.03.21 (customer targets; not statutory advice)';

const GccNationalisationComplianceV44: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [hubTab, setHubTab] = useState<HubId>('dashboard');
  const [lob, setLob] = useState('all');
  const [location, setLocation] = useState('all');
  const [period, setPeriod] = useState('30d');
  const [dateStart, setDateStart] = useState('2026-02-21');
  const [dateEnd, setDateEnd] = useState('2026-03-21');
  const [commExpanded, setCommExpanded] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const exportModal = useModalModel();

  const railReservePx = commExpanded ? DEFAULT_COMM_EXPANDED_PX : DEFAULT_COMM_RAIL_PX;

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((r) => {
      if (lob !== 'all' && r.lob !== lob) return false;
      if (location !== 'all') {
        const locMap: Record<string, string> = {
          dubai: 'Dubai',
          riyadh: 'Riyadh',
          kuwait: 'Kuwait City',
          abu: 'Abu Dhabi',
        };
        if (r.location !== locMap[location]) return false;
      }
      return true;
    });
  }, [lob, location]);

  const sortedCandidates = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    const rows = [...filteredCandidates];
    rows.sort((a, b) => {
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return rows;
  }, [filteredCandidates, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((s) => !s);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleExportDownload = () => {
    exportModal.events.hide();
    setExportToast(`Export queued (${exportFormat.toUpperCase()}). Your organisation is responsible for lawful use of this file.`);
    window.setTimeout(() => setExportToast(null), 5000);
  };

  const renderDashboardBody = () => (
    <>
      <Tabs initialTab="metrics">
        <Tabs.List marginBottom="l" gap="xs">
          {DASH_INNER_TABS.map((t) => (
            <Tabs.Item key={t.id} data-id={t.id}>
              {t.label}
            </Tabs.Item>
          ))}
        </Tabs.List>

        <Tabs.Panel data-id="metrics">
            <Box>
              <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m" marginBottom="m">
                <Box>
                  <Heading size="large" marginBottom="xs">
                    GCC workforce compliance
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Snapshot as of {dateEnd}. Targets are customer-entered; Workday does not determine statutory rates.
                  </BodyText>
                </Box>
                <TertiaryButton onClick={() => undefined}>Open in Reporting</TertiaryButton>
              </Flex>

              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <KpiCard
                  title="Nitaqat / Saudisation % (KSA pack)"
                  value="58%"
                  gapText="Gap to target: −2.0 pp vs 60% (customer target)"
                  denominatorHint="Headcount in scope: 240"
                />
                <KpiCard
                  title="Emiratisation % (UAE pack)"
                  value="21%"
                  gapText="Gap to target: +1.0 pp vs 20% (customer target)"
                  denominatorHint="Headcount in scope: 200"
                />
                <KpiCard
                  title="Kuwaitisation % (KW pack)"
                  value="49%"
                  gapText="Gap to target: −1.0 pp vs 50% (customer target)"
                  denominatorHint="Headcount in scope: 100"
                />
                <KpiCard
                  title="PWD % (configurable label)"
                  value="3.2%"
                  gapText="Gap to target: −0.8 pp vs 4.0% (example target)"
                  denominatorHint="In-scope headcount (where collected)"
                />
                <KpiCard
                  title="Gender diversity % (aggregate)"
                  value="42%"
                  gapText="Women in scoped population (aggregate only)"
                  denominatorHint="Customer definition v3 · compare to prior month +1 pp"
                />
              </Flex>

              <Flex gap="m" marginBottom="l" flexWrap="wrap" alignItems="flex-end">
                <Box style={{ flex: '1 1 220px', minWidth: 200 }}>
                  <FormField id="lob-filter">
                    <FormField.Label>Supervisory organisation (LOB)</FormField.Label>
                    <FormField.Input
                      as={Select}
                      value={lob}
                      onChange={(e) => setLob(e.target.value)}
                    >
                      <option value="all">All organisations</option>
                      <option value="Technology">Technology</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Sales">Sales</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </FormField.Input>
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 180 }}>
                  <FormField id="loc-filter">
                    <FormField.Label>Location</FormField.Label>
                    <FormField.Input
                      as={Select}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="all">All locations</option>
                      <option value="dubai">Dubai</option>
                      <option value="abu">Abu Dhabi</option>
                      <option value="riyadh">Riyadh</option>
                      <option value="kuwait">Kuwait City</option>
                    </FormField.Input>
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 180 }}>
                  <FormField id="period-filter">
                    <FormField.Label>Period preset</FormField.Label>
                    <FormField.Input
                      as={Select}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="30d">Last 30 days</option>
                      <option value="month">This month</option>
                      <option value="qtr">This quarter</option>
                    </FormField.Input>
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 140px', minWidth: 130 }}>
                  <FormField id="start-date">
                    <FormField.Label>Start date</FormField.Label>
                    <FormField.Input
                      as={TextInput}
                      type="date"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                    />
                  </FormField>
                </Box>
                <Box style={{ flex: '1 1 140px', minWidth: 130 }}>
                  <FormField id="end-date">
                    <FormField.Label>End date</FormField.Label>
                    <FormField.Input
                      as={TextInput}
                      type="date"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                    />
                  </FormField>
                </Box>
                <Modal model={exportModal}>
                  <Modal.Target as={SecondaryButton}>Export for audit</Modal.Target>
                  <Modal.Overlay>
                    <Modal.Card style={{ maxWidth: 480, width: '100%' }}>
                      <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
                        <Modal.Heading>Export for audit</Modal.Heading>
                        <Modal.CloseIcon aria-label="Close" />
                      </Flex>
                      <Modal.Body>
                        <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                          Scope: filters applied on this dashboard ({lob === 'all' ? 'all LOBs' : lob},{' '}
                          {location === 'all' ? 'all locations' : location}). An audit log entry will record user, role,
                          time, and definition version when you download.
                        </BodyText>
                        <BodyText size="small" fontWeight="bold" marginBottom="xs">
                          File format
                        </BodyText>
                        <RadioGroup
                          name="export-format"
                          value={exportFormat}
                          onChange={(v) => setExportFormat(v as 'csv' | 'xlsx')}
                        >
                          <Radio value="csv" label="CSV (.csv)" />
                          <Radio value="xlsx" label="Excel workbook (.xlsx)" />
                        </RadioGroup>
                        <Box
                          marginTop="m"
                          padding="m"
                          style={{
                            backgroundColor: colors.soap100,
                            borderRadius: 12,
                            border: `1px solid ${colors.soap300}`,
                          }}
                        >
                          <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                            Definition version
                          </BodyText>
                          <BodyText size="small" color={colors.blackPepper600}>
                            {EXPORT_DEFINITION_VERSION}
                          </BodyText>
                        </Box>
                        <BodyText size="small" color={colors.blackPepper500} marginTop="m">
                          This export supports customer-operated evidence packs. It does not submit data to government
                          portals. Your organisation remains responsible for lawful processing and regulatory filings.
                        </BodyText>
                        <Flex gap="s" marginTop="l" justifyContent="flex-end" flexWrap="wrap">
                          <Modal.CloseButton>Cancel</Modal.CloseButton>
                          <PrimaryButton onClick={handleExportDownload}>Download</PrimaryButton>
                        </Flex>
                      </Modal.Body>
                    </Modal.Card>
                  </Modal.Overlay>
                </Modal>
              </Flex>

              {exportToast && (
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  {exportToast}
                </BodyText>
              )}

              <Heading size="small" marginBottom="s">
                Candidates in scope
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                PWD column respects role-based access (sample: Restricted where view permission is missing).
              </BodyText>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <SortableHeader
                        label="Candidate"
                        active={sortKey === 'name'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('name')}
                      />
                      <SortableHeader
                        label="Job"
                        active={sortKey === 'job'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('job')}
                      />
                      <SortableHeader
                        label="Nationality"
                        active={sortKey === 'nationality'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('nationality')}
                      />
                      <SortableHeader
                        label="Status"
                        active={sortKey === 'status'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('status')}
                      />
                      <SortableHeader
                        label="Data completeness"
                        active={sortKey === 'completeness'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('completeness')}
                      />
                      <Table.Header>PWD</Table.Header>
                      <SortableHeader
                        label="Last updated"
                        active={sortKey === 'updated'}
                        ascending={sortAsc}
                        onClick={() => toggleSort('updated')}
                      />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {sortedCandidates.map((r) => (
                      <Table.Row key={r.name}>
                        <Table.Cell>{r.name}</Table.Cell>
                        <Table.Cell>{r.job}</Table.Cell>
                        <Table.Cell>{r.nationality}</Table.Cell>
                        <Table.Cell>{r.status}</Table.Cell>
                        <Table.Cell>{r.completeness}</Table.Cell>
                        <Table.Cell
                          style={
                            r.pwdDisplay === 'Restricted'
                              ? { color: colors.blackPepper400, fontStyle: 'italic' }
                              : undefined
                          }
                        >
                          {r.pwdDisplay}
                        </Table.Cell>
                        <Table.Cell>{r.updated}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Box>
        </Tabs.Panel>

        <Tabs.Panel data-id="packs">
            <Box paddingY="s">
              <Heading size="medium" marginBottom="s">
                Country packs (KSA, UAE, Kuwait)
              </Heading>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Enable packs independently per tenant. Full pack configuration, band mappings, and Reporting/Prism
                consumption ship outside this prototype.
              </BodyText>
              <Flex gap="m" flexWrap="wrap">
                <Card padding="l" style={{ flex: '1 1 240px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                  <Heading size="small" marginBottom="xs">
                    KSA
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600}>
                    Nitaqat-oriented metrics and Qiwa-evidence style exports (manual submission in MVP).
                  </BodyText>
                </Card>
                <Card padding="l" style={{ flex: '1 1 240px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                  <Heading size="small" marginBottom="xs">
                    UAE
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600}>
                    Emiratisation %, gap, and scheduled exports for TA operations.
                  </BodyText>
                </Card>
                <Card padding="l" style={{ flex: '1 1 240px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                  <Heading size="small" marginBottom="xs">
                    Kuwait
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600}>
                    Kuwaitisation tracking aligned to customer-validated private-sector scope.
                  </BodyText>
                </Card>
              </Flex>
            </Box>
        </Tabs.Panel>

        <Tabs.Panel data-id="pwd_gender">
            <Box paddingY="s">
              <Heading size="medium" marginBottom="s">
                PWD and gender metrics
              </Heading>
              <BodyText size="small" color={colors.blackPepper600}>
                Aggregate dashboards only; sensitive fields follow DAP and role design. Targets (for example 4% KSA / 5%
                Egypt) are illustrative customer entries, not legal advice.
              </BodyText>
            </Box>
        </Tabs.Panel>

        <Tabs.Panel data-id="audit">
            <Box paddingY="s">
              <Heading size="medium" marginBottom="s">
                Audit trail & export history
              </Heading>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Immutable log of exports: user, role, timestamp, filters, definition version. Detailed run history is
                built in product delivery.
              </BodyText>
              <TertiaryButton onClick={() => undefined}>Open export log in Reporting</TertiaryButton>
            </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  );

  const mainColumn = (
    <Box
      flex={1}
      minWidth={0}
      padding="l"
      style={{
        paddingRight: `calc(${railReservePx}px + ${space.l})`,
        boxSizing: 'border-box',
        overflow: 'auto',
        backgroundColor: SANA_PAGE_CANVAS,
      }}
    >
      <Box
        marginBottom="l"
        style={{
          borderRadius: SANA_SHELL_RADIUS,
          backgroundColor: colors.frenchVanilla100,
          boxShadow: SANA_CARD_SHADOW_LIFTED,
          minHeight: '100%',
        }}
      >
        {hubTab === 'overview' && (
          <Box padding="l">
            <Heading size="large" marginBottom="xs">
              Recruiting overview
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              Tasks and announcements for your hub. Representative content for navigation completeness.
            </BodyText>
            <Flex gap="m" marginBottom="l" flexWrap="wrap">
              <KpiCard title="Open requisitions" value="47" gapText="Owned or supported by you" denominatorHint="Across enabled GCC packs" />
              <KpiCard title="Candidates in motion" value="612" gapText="Active in pipeline" denominatorHint="Excludes withdrawn" />
              <KpiCard title="Compliance actions" value="8" gapText="Missing data or below target" denominatorHint="From dashboard exceptions" />
            </Flex>
            <Heading size="small" marginBottom="s">
              Announcements
            </Heading>
            {tableShell(
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Date</Table.Header>
                    <Table.Header>Topic</Table.Header>
                    <Table.Header>Owner</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>21 Mar 2026</Table.Cell>
                    <Table.Cell>Monthly Emiratisation snapshot published</Table.Cell>
                    <Table.Cell>TA operations</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>18 Mar 2026</Table.Cell>
                    <Table.Cell>Update nationality band mappings before Q2 close</Table.Cell>
                    <Table.Cell>HRIS</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            )}
          </Box>
        )}

        {hubTab === 'requisitions' && (
          <Box padding="l">
            <Heading size="large" marginBottom="xs">
              Job requisitions
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              Compact list with GCC location context.
            </BodyText>
            {tableShell(
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Requisition</Table.Header>
                    <Table.Header>Title</Table.Header>
                    <Table.Header>Location</Table.Header>
                    <Table.Header>Status</Table.Header>
                    <Table.Header>Candidates</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {MOCK_REQS.map((r) => (
                    <Table.Row key={r.id}>
                      <Table.Cell>{r.id}</Table.Cell>
                      <Table.Cell>{r.title}</Table.Cell>
                      <Table.Cell>{r.loc}</Table.Cell>
                      <Table.Cell>{r.status}</Table.Cell>
                      <Table.Cell>{r.cand}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Box>
        )}

        {hubTab === 'candidates' && (
          <Box padding="l">
            <Heading size="large" marginBottom="xs">
              Candidates
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              Nationality column emphasised for compliance workflows; visibility follows security.
            </BodyText>
            {tableShell(
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Candidate</Table.Header>
                    <Table.Header>Nationality</Table.Header>
                    <Table.Header>Stage</Table.Header>
                    <Table.Header>Requisition</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {MOCK_CANDIDATES.slice(0, 6).map((r) => (
                    <Table.Row key={`c-${r.name}`}>
                      <Table.Cell>{r.name}</Table.Cell>
                      <Table.Cell>{r.nationality}</Table.Cell>
                      <Table.Cell>{r.status}</Table.Cell>
                      <Table.Cell>{r.job}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Box>
        )}

        {hubTab === 'dashboard' && <Box padding="l">{renderDashboardBody()}</Box>}
      </Box>
    </Box>
  );

  return (
    <>
      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
        <WorkdayTopNav
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showWMark
          showMenuWordmark={false}
          notificationBadge={2}
          inboxBadge={4}
        />

        <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
          <WorkdayLeftTabBar
            showSecondaryTitleIcon
            secondaryTitle="Recruiter Hub"
            secondarySubtitle="Recruiting · GCC workforce compliance (concept)"
            tabs={[...HUB_TABS]}
            activeTabId={hubTab}
            onTabChange={(id) => setHubTab(id as HubId)}
          />
          {mainColumn}
        </Flex>
      </Box>

      <CommunicationDock
        headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
        expanded={commExpanded}
        panel={
          <Flex flexDirection="column" height="100%" style={{ minHeight: 0 }}>
            <Box
              padding="m"
              style={{
                backgroundColor: SANA_COMM_PANEL_SURFACE,
                borderBottom: `1px solid ${colors.soap300}`,
              }}
            >
              <Heading size="small">Messages</Heading>
              <Subtext size="small" color={colors.blackPepper500}>
                Email and work notifications (prototype)
              </Subtext>
            </Box>
            <Box flex={1} padding="m" style={{ overflow: 'auto' }}>
              <BodyText size="small" color={colors.blackPepper600}>
                No new compliance alerts. In production, quota threshold and data-quality nudges may surface here.
              </BodyText>
            </Box>
          </Flex>
        }
        rail={
          <Box
            as="button"
            type="button"
            aria-label={commExpanded ? 'Collapse messages' : 'Expand messages'}
            aria-expanded={commExpanded}
            onClick={() => setCommExpanded((e) => !e)}
            style={communicationRailButtonStyle(commExpanded, DEFAULT_COMM_RAIL_PX)}
          >
            <SystemIcon icon={mailIcon} size={22} color={commExpanded ? SANA_LINK_ACCENT : colors.blackPepper600} aria-hidden />
          </Box>
        }
      />
    </>
  );
};

export default GccNationalisationComplianceV44;
