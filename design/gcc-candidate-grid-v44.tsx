import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Select } from '@workday/canvas-kit-react/select';
import { Switch } from '@workday/canvas-kit-react/switch';
import { Table } from '@workday/canvas-kit-react/table';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { InputGroup } from '@workday/canvas-kit-react/text-input';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  arrowLeftSmallIcon,
  arrowRightSmallIcon,
  searchIcon,
  mailIcon,
} from '@workday/canvas-system-icons-web';
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
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  SANA_COMM_PANEL_SURFACE,
  SANA_SEARCH_FIELD_BG,
  SANA_LINK_ACCENT,
  FormSelect,
  FormDateInput,
} from './components';

/**
 * GCC Candidate Grid v44 — Theme 4 (grid density, search, AI matching)
 * Discovery: design/gcc-candidate-grid-v44-discovery-brief.md (Final Verdict: APPROVED)
 * Canvas Kit MCP: get-canvas-kit-tokens consulted; semantic status via `colors.*` (greenApple, cantaloupe, cinnamon, blueberry, soap).
 */

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'dashboard', label: 'Dashboard' },
] as const;

type HubId = (typeof HUB_TABS)[number]['id'];
type SortKey = 'name' | 'jobTitle' | 'location' | 'status' | 'matchScore' | 'appliedDate';

interface CandidateRow {
  id: string;
  name: string;
  jobTitle: string;
  location: string;
  status: string;
  matchScore: number;
  appliedDate: string;
  skills: string[];
}

interface ProfileDetail {
  email: string;
  phone: string;
  experience: string;
  education: string;
  skillsDetail: string;
  resume: string;
}

const MOCK_REQS = [
  { id: 'R-2026-1842', title: 'Senior consultant — GCC', loc: 'Dubai, UAE', status: 'Interview', cand: 47 },
  { id: 'R-2026-1701', title: 'Principal PM — Recruiting', loc: 'Riyadh, KSA', status: 'Screen', cand: 56 },
  { id: 'R-2026-1599', title: 'Graduate engineer', loc: 'Kuwait City', status: 'Offer', cand: 12 },
];

const MOCK_ROWS: CandidateRow[] = [
  {
    id: '1',
    name: 'Sara Al-Mansoori',
    jobTitle: 'Senior consultant — GCC',
    location: 'Dubai, UAE',
    status: 'Interview',
    matchScore: 92,
    appliedDate: '2026-03-18',
    skills: ['Product strategy', 'Arabic EN', 'SaaS'],
  },
  {
    id: '2',
    name: 'James Okonkwo',
    jobTitle: 'Senior consultant — GCC',
    location: 'Riyadh, KSA',
    status: 'Screen',
    matchScore: 74,
    appliedDate: '2026-03-16',
    skills: ['Kubernetes', 'Platform', 'IC4'],
  },
  {
    id: '3',
    name: 'Priya Nair',
    jobTitle: 'Senior consultant — GCC',
    location: 'Remote GCC',
    status: 'Review',
    matchScore: 87,
    appliedDate: '2026-03-12',
    skills: ['SQL', 'Analytics', 'Stakeholders'],
  },
  {
    id: '4',
    name: 'Omar Haddad',
    jobTitle: 'Senior consultant — GCC',
    location: 'Kuwait City',
    status: 'New',
    matchScore: 61,
    appliedDate: '2026-03-08',
    skills: ['Operations', 'Logistics', 'Arabic'],
  },
  {
    id: '5',
    name: 'Layla Al-Sabah',
    jobTitle: 'Senior consultant — GCC',
    location: 'Kuwait City',
    status: 'Interview',
    matchScore: 88,
    appliedDate: '2026-03-19',
    skills: ['Change mgmt', 'Consulting', 'Finance'],
  },
  {
    id: '6',
    name: 'Ahmed Al-Rashid',
    jobTitle: 'Principal PM — Recruiting',
    location: 'Riyadh, KSA',
    status: 'Offer',
    matchScore: 95,
    appliedDate: '2026-03-05',
    skills: ['Roadmap', 'ATS', 'Leadership'],
  },
  {
    id: '7',
    name: 'Fatima Al-Zahra',
    jobTitle: 'Graduate engineer',
    location: 'Kuwait City',
    status: 'Screen',
    matchScore: 58,
    appliedDate: '2026-03-14',
    skills: ['Python', 'Graduate', 'Embedded'],
  },
  {
    id: '8',
    name: 'Khalid Al-Otaibi',
    jobTitle: 'Senior consultant — GCC',
    location: 'Dammam, KSA',
    status: 'Review',
    matchScore: 71,
    appliedDate: '2026-03-11',
    skills: ['Sales', 'Enterprise', 'Arabic'],
  },
  {
    id: '9',
    name: 'Noor Rahman',
    jobTitle: 'Senior consultant — GCC',
    location: 'Manama, Bahrain',
    status: 'New',
    matchScore: 64,
    appliedDate: '2026-03-20',
    skills: ['Coordination', 'TA ops', 'English'],
  },
  {
    id: '10',
    name: 'Mariam Al-Farsi',
    jobTitle: 'Senior consultant — GCC',
    location: 'Abu Dhabi, UAE',
    status: 'Interview',
    matchScore: 90,
    appliedDate: '2026-03-17',
    skills: ['Compliance', 'HRIS', 'Reporting'],
  },
  {
    id: '11',
    name: 'Hassan El-Masry',
    jobTitle: 'Principal PM — Recruiting',
    location: 'Cairo, Egypt',
    status: 'Screen',
    matchScore: 69,
    appliedDate: '2026-03-09',
    skills: ['Discovery', 'B2B', 'English'],
  },
  {
    id: '12',
    name: 'Yasmin Al-Qahtani',
    jobTitle: 'Senior consultant — GCC',
    location: 'Jeddah, KSA',
    status: 'Review',
    matchScore: 83,
    appliedDate: '2026-03-15',
    skills: ['UX research', 'Workshops', 'Arabic EN'],
  },
];

const PROFILE_DETAIL: Record<string, ProfileDetail> = {
  '1': {
    email: 'sara.almansoori@email.com',
    phone: '+971 50 555 0142',
    experience:
      'Senior Product Manager, Regional Solutions (2022–present) — Owned roadmap for localisation and compliance for enterprise ATS in UAE and KSA.\nProduct Manager, Cloud Services (2019–2022) — Onboarding and career site journeys.',
    education: 'MBA, INSEAD · BSc Computer Science, American University of Sharjah',
    skillsDetail: 'Product discovery, Arabic/English facilitation, stakeholder alignment, compliance-aware delivery.',
    resume: `SARA AL-MANSOORI — Dubai, UAE

EXPERIENCE
Senior Product Manager — Regional Solutions (2022–present)
• GCC rollout playbooks; Nitaqat-aware reporting narratives for exec reviews.
• Partnered with implementation on tenant configuration for high-volume recruiting.

Product Manager — Cloud Services (2019–2022)
• Shipped onboarding flows; A/B tested career site journeys.

EDUCATION
MBA, INSEAD · BSc Computer Science, American University of Sharjah`,
  },
  '2': {
    email: 'j.okonkwo@email.com',
    phone: '+966 55 123 8890',
    experience:
      'Staff Software Engineer — Infra Platform (2021–present) — Cluster upgrades, SLOs, incident response.\nSoftware Engineer — Payments (2017–2021) — Reconciliation pipelines.',
    education: 'MEng Software Engineering, University of Lagos',
    skillsDetail: 'Kubernetes, Go, reliability engineering, mentoring IC2–IC3.',
    resume: `JAMES OKONKWO — Riyadh

EXPERIENCE
Staff Software Engineer — Infra Platform (2021–present)
• Multi-tenant services; on-call playbooks.

EDUCATION
MEng Software Engineering, University of Lagos`,
  },
};

function defaultProfile(row: CandidateRow): ProfileDetail {
  return {
    email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    phone: '+971 4 000 0000',
    experience:
      'Illustrative experience block for prototype — replace with parsed CV in product.\n• Role A: scope, metrics, tools.\n• Role B: team size, outcomes.',
    education: 'Bachelor’s degree — field relevant to role (prototype)',
    skillsDetail: row.skills.join(', ') + ' — expanded skills narrative for assessors.',
    resume: `${row.name.toUpperCase()}\n${row.location}\n\nEXPERIENCE\n(Illustrative CV text for ${row.jobTitle}.)\n\nEDUCATION\nSee profile details.\n\nSKILLS\n${row.skills.join(', ')}`,
  };
}

type HsLetter = 'A' | 'B' | 'C' | 'D';

function hiredScoreBand(fit: number): { letter: HsLetter; shortLabel: string } {
  if (fit >= 85) return { letter: 'A', shortLabel: 'Strong fit' };
  if (fit >= 70) return { letter: 'B', shortLabel: 'Good fit' };
  if (fit >= 55) return { letter: 'C', shortLabel: 'Moderate fit' };
  return { letter: 'D', shortLabel: 'Developing fit' };
}

function gradePillColors(letter: HsLetter): { bg: string; fg: string; bar: string } {
  switch (letter) {
    case 'A':
      return { bg: colors.greenApple100, fg: colors.greenApple600, bar: colors.greenApple600 };
    case 'B':
      return { bg: colors.soap200, fg: colors.blueberry600, bar: colors.blueberry500 };
    case 'C':
      return { bg: colors.cantaloupe100, fg: colors.cantaloupe600, bar: colors.cantaloupe600 };
    default:
      return { bg: colors.soap200, fg: colors.blackPepper500, bar: colors.soap400 };
  }
}

const MatchScoreIndicator: React.FC<{ score: number; showBar?: boolean }> = ({
  score,
  showBar = true,
}) => {
  const { letter, shortLabel } = hiredScoreBand(score);
  const { bg, fg, bar } = gradePillColors(letter);
  const clamped = Math.min(100, Math.max(0, score));
  return (
    <Box style={{ minWidth: 112 }}>
      <Flex alignItems="center" gap="xs" marginBottom={showBar ? 'xxs' : undefined}>
        <Box
          aria-label={`Match grade ${letter}, ${clamped} percent`}
          paddingX="xs"
          paddingY="xxs"
          style={{
            backgroundColor: bg,
            borderRadius: 8,
            border: `1px solid ${colors.soap300}`,
            minWidth: 28,
            textAlign: 'center',
          }}
        >
          <BodyText size="small" style={{ fontWeight: 700, color: fg, lineHeight: 1.2 }}>
            {letter}
          </BodyText>
        </Box>
        <Box>
          <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
            {clamped}%
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            {shortLabel}
          </BodyText>
        </Box>
      </Flex>
      {showBar && (
        <Box
          marginTop="xxs"
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.soap300,
            overflow: 'hidden',
            maxWidth: 132,
          }}
        >
          <Box style={{ width: `${clamped}%`, height: '100%', backgroundColor: bar }} />
        </Box>
      )}
    </Box>
  );
};

function statusBadgeStyle(status: string): { bg: string; fg: string } {
  switch (status) {
    case 'Interview':
      return { bg: colors.greenApple100, fg: colors.greenApple600 };
    case 'Offer':
      return { bg: colors.greenApple100, fg: colors.greenApple600 };
    case 'Screen':
      return { bg: colors.soap200, fg: colors.blueberry600 };
    case 'Review':
      return { bg: colors.cantaloupe100, fg: colors.cantaloupe600 };
    case 'New':
      return { bg: colors.soap100, fg: colors.blackPepper600 };
    default:
      return { bg: colors.soap200, fg: colors.blackPepper600 };
  }
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { bg, fg } = statusBadgeStyle(status);
  return (
    <Box
      as="span"
      paddingX="xs"
      paddingY="xxs"
      style={{
        display: 'inline-block',
        backgroundColor: bg,
        color: fg,
        borderRadius: 8,
        border: `1px solid ${colors.soap300}`,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {status}
    </Box>
  );
};

const SkillPill: React.FC<{ label: string }> = ({ label }) => (
  <Box
    as="span"
    paddingX="s"
    paddingY="xxs"
    style={{
      display: 'inline-block',
      borderRadius: 999,
      backgroundColor: colors.frenchVanilla100,
      border: `1px solid ${colors.soap300}`,
      fontSize: 12,
      color: colors.blackPepper600,
    }}
  >
    {label}
  </Box>
);

function SortableHeader({
  label,
  sortKey,
  activeKey,
  ascending,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  ascending: boolean;
  onSort: (k: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <Table.Header>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        style={{
          background: 'none',
          border: 'none',
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
        {active ? (ascending ? ' ▲' : ' ▼') : ''}
      </button>
    </Table.Header>
  );
}

function formatApplied(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const GccCandidateGridV44: React.FC = () => {
  const [hubTab, setHubTab] = useState<HubId>('candidates');
  const [topSearch, setTopSearch] = useState('');
  const [gridQuery, setGridQuery] = useState(
    '(Arabic OR "Arabic speaking") AND (Dubai OR Riyadh)'
  );
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateStart, setDateStart] = useState('2026-03-01');
  const [dateEnd, setDateEnd] = useState('2026-03-21');
  const [aiSimilar, setAiSimilar] = useState(false);
  const [searchDatabase, setSearchDatabase] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('matchScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [commExpanded, setCommExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const profileModal = useModalModel();

  const railReservePx = commExpanded ? DEFAULT_COMM_EXPANDED_PX : DEFAULT_COMM_RAIL_PX;

  const filteredRows = useMemo(() => {
    return MOCK_ROWS.filter((r) => {
      if (filterLocation !== 'all') {
        const city = filterLocation;
        if (!r.location.toLowerCase().includes(city)) return false;
      }
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      const applied = new Date(r.appliedDate + 'T12:00:00').getTime();
      const start = new Date(dateStart + 'T12:00:00').getTime();
      const end = new Date(dateEnd + 'T12:00:00').getTime();
      if (applied < start || applied > end) return false;
      return true;
    });
  }, [filterLocation, filterStatus, dateStart, dateEnd]);

  const sortedRows = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === 'matchScore') {
        av = a.matchScore;
        bv = b.matchScore;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      }
      av = String(a[sortKey]).toLowerCase();
      bv = String(b[sortKey]).toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return rows;
  }, [filteredRows, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((s) => !s);
    else {
      setSortKey(key);
      setSortAsc(key === 'name' || key === 'appliedDate');
    }
  };

  const selectedIndex = useMemo(() => {
    if (!selectedId) return -1;
    return sortedRows.findIndex((r) => r.id === selectedId);
  }, [selectedId, sortedRows]);

  const activeRow = selectedIndex >= 0 ? sortedRows[selectedIndex] : null;
  const detail = activeRow ? PROFILE_DETAIL[activeRow.id] ?? defaultProfile(activeRow) : null;

  const openProfile = useCallback(
    (id: string) => {
      setSelectedId(id);
      profileModal.events.show();
    },
    [profileModal.events]
  );

  const goPrev = useCallback(() => {
    if (sortedRows.length === 0 || selectedIndex < 0) return;
    const next = (selectedIndex - 1 + sortedRows.length) % sortedRows.length;
    setSelectedId(sortedRows[next].id);
  }, [selectedIndex, sortedRows]);

  const goNext = useCallback(() => {
    if (sortedRows.length === 0 || selectedIndex < 0) return;
    const next = (selectedIndex + 1) % sortedRows.length;
    setSelectedId(sortedRows[next].id);
  }, [selectedIndex, sortedRows]);

  const modalOpen = profileModal.state.visibility !== 'hidden';

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, goNext, goPrev]);

  useEffect(() => {
    if (!modalOpen || sortedRows.length === 0) return;
    if (selectedIndex < 0 && selectedId) {
      const still = sortedRows.find((r) => r.id === selectedId);
      if (!still) {
        setSelectedId(sortedRows[0].id);
      }
    }
  }, [modalOpen, sortedRows, selectedIndex, selectedId]);

  useEffect(() => {
    if (modalOpen && sortedRows.length === 0) {
      profileModal.events.hide();
    }
  }, [modalOpen, sortedRows.length, profileModal.events]);

  const mainShell = (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        showWMark
        showMenuWordmark={false}
        notificationBadge={12}
        inboxBadge={88}
      />

      <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          showSecondaryTitleIcon
          secondaryTitle="Recruiter Hub"
          secondarySubtitle="Job requisition · Candidates (concept)"
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={(id) => setHubTab(id as HubId)}
        />

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
                  Overview
                </Heading>
                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  Tasks and requisition health for this hub. Representative content for navigation completeness.
                </BodyText>
                <Flex gap="m" flexWrap="wrap" marginBottom="l">
                  <Card padding="l" style={{ flex: '1 1 200px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                    <Heading size="small" marginBottom="xs">
                      Open requisitions
                    </Heading>
                    <Heading size="large">47</Heading>
                    <BodyText size="small" color={colors.blackPepper500}>
                      Owned or supported by you
                    </BodyText>
                  </Card>
                  <Card padding="l" style={{ flex: '1 1 200px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                    <Heading size="small" marginBottom="xs">
                      Candidates in review
                    </Heading>
                    <Heading size="large">12</Heading>
                    <BodyText size="small" color={colors.blackPepper500}>
                      Awaiting next stage
                    </BodyText>
                  </Card>
                  <Card padding="l" style={{ flex: '1 1 200px', borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                    <Heading size="small" marginBottom="xs">
                      Interviews this week
                    </Heading>
                    <Heading size="large">8</Heading>
                    <BodyText size="small" color={colors.blackPepper500}>
                      Panel and HM slots
                    </BodyText>
                  </Card>
                </Flex>
                <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                  <Heading size="small" marginBottom="s">
                    Recent activity
                  </Heading>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Time</Table.Header>
                        <Table.Header>Event</Table.Header>
                        <Table.Header>Owner</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Today</Table.Cell>
                        <Table.Cell>Boolean search saved for GCC consultant req</Table.Cell>
                        <Table.Cell>You</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Yesterday</Table.Cell>
                        <Table.Cell>Similar-candidate suggestions refreshed (assistive)</Table.Cell>
                        <Table.Cell>System</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </Box>
            )}

            {hubTab === 'requisitions' && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  Job requisitions
                </Heading>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>ID</Table.Header>
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
              </Box>
            )}

            {hubTab === 'dashboard' && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  Dashboard
                </Heading>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  Pipeline velocity and sourcing funnel for your scope. Figures are illustrative for this prototype.
                </BodyText>
                <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
                  <Heading size="small" marginBottom="s">
                    Stage conversion (illustrative)
                  </Heading>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Stage</Table.Header>
                        <Table.Header>Count</Table.Header>
                        <Table.Header>Δ vs last week</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>New</Table.Cell>
                        <Table.Cell>24</Table.Cell>
                        <Table.Cell>+3</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Screen</Table.Cell>
                        <Table.Cell>18</Table.Cell>
                        <Table.Cell>−1</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Interview</Table.Cell>
                        <Table.Cell>11</Table.Cell>
                        <Table.Cell>+2</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </Box>
            )}

            {hubTab === 'candidates' && (
              <Box padding="l">
                <Heading size="large" marginBottom="xs">
                  Candidates
                </Heading>
                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  R-2026-1842 · Senior consultant — GCC · Enhanced search and unified review (split modal). Match scores
                  are assistive; recruiters confirm all stage changes.
                </BodyText>

                <Card
                  padding="l"
                  marginBottom="m"
                  style={{
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                    boxShadow: SANA_CARD_SHADOW,
                  }}
                >
                  <Heading size="small" marginBottom="s">
                    Search and filters
                  </Heading>
                  <Flex gap="m" flexWrap="wrap" alignItems="flex-end" marginBottom="m">
                    <Box style={{ flex: '2 1 280px', minWidth: 240 }}>
                      <FormField id="v44-grid-search">
                        <FormField.Label>Search candidates (boolean)</FormField.Label>
                        <InputGroup
                          width="100%"
                          style={{
                            borderRadius: 999,
                            overflow: 'hidden',
                            border: `1px solid ${colors.soap300}`,
                            backgroundColor: SANA_SEARCH_FIELD_BG,
                            boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
                          }}
                        >
                          <InputGroup.InnerStart
                            as={SystemIcon}
                            icon={searchIcon}
                            pointerEvents="none"
                            color={colors.blackPepper400}
                          />
                          <InputGroup.Input
                            as={TextInput}
                            placeholder="Use AND, OR, NOT — e.g. (skill:&quot;PM&quot;) AND location:Dubai*"
                            value={gridQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGridQuery(e.target.value)}
                            aria-label="Candidate search with boolean operators"
                            style={{
                              backgroundColor: SANA_SEARCH_FIELD_BG,
                              border: 'none',
                              boxShadow: 'none',
                              fontSize: 14,
                            }}
                          />
                        </InputGroup>
                      </FormField>
                    </Box>
                    <TertiaryButton onClick={() => undefined}>Boolean examples</TertiaryButton>
                  </Flex>

                  <Flex gap="m" flexWrap="wrap" alignItems="flex-end" marginBottom="m">
                    <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
                      <FormSelect
                        id="v44-loc"
                        label="Location"
                        value={filterLocation}
                        onChange={setFilterLocation}
                        options={[
                          { value: 'all', label: 'All' },
                          { value: 'dubai', label: 'Dubai' },
                          { value: 'riyadh', label: 'Riyadh' },
                          { value: 'kuwait', label: 'Kuwait' },
                          { value: 'bahrain', label: 'Bahrain' },
                          { value: 'jeddah', label: 'Jeddah' },
                          { value: 'cairo', label: 'Cairo' },
                          { value: 'abu', label: 'Abu Dhabi' },
                          { value: 'dammam', label: 'Dammam' },
                          { value: 'remote', label: 'Remote' },
                        ]}
                      />
                    </Box>
                    <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
                      <FormSelect
                        id="v44-status"
                        label="Status"
                        value={filterStatus}
                        onChange={setFilterStatus}
                        options={[
                          { value: 'all', label: 'All' },
                          { value: 'New', label: 'New' },
                          { value: 'Screen', label: 'Screen' },
                          { value: 'Review', label: 'Review' },
                          { value: 'Interview', label: 'Interview' },
                          { value: 'Offer', label: 'Offer' },
                        ]}
                      />
                    </Box>
                    <Box style={{ flex: '1 1 140px', minWidth: 130 }}>
                      <FormDateInput
                        id="v44-start"
                        label="Applied from"
                        value={dateStart}
                        onChange={setDateStart}
                      />
                    </Box>
                    <Box style={{ flex: '1 1 140px', minWidth: 130 }}>
                      <FormDateInput
                        id="v44-end"
                        label="Applied to"
                        value={dateEnd}
                        onChange={setDateEnd}
                      />
                    </Box>
                  </Flex>

                  <Flex gap="l" flexWrap="wrap" alignItems="center" marginBottom="s">
                    <Flex alignItems="center" gap="s">
                      <Switch
                        id="v44-ai-similar"
                        checked={aiSimilar}
                        onChange={() => setAiSimilar((v) => !v)}
                      />
                      <label htmlFor="v44-ai-similar" style={{ cursor: 'pointer' }}>
                        <BodyText size="small" style={{ fontWeight: 600 }}>
                          AI similar candidates
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          Surface matches by skills, experience, and req text (assistive).
                        </BodyText>
                      </label>
                    </Flex>
                    <Flex alignItems="center" gap="s">
                      <Switch
                        id="v44-db-wide"
                        checked={searchDatabase}
                        onChange={() => setSearchDatabase((v) => !v)}
                      />
                      <label htmlFor="v44-db-wide" style={{ cursor: 'pointer' }}>
                        <BodyText size="small" style={{ fontWeight: 600 }}>
                          Search across database
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          Broaden to tenant candidate records (respects security).
                        </BodyText>
                      </label>
                    </Flex>
                  </Flex>

                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                    AI-assisted ranking — human review required. Suggestions do not change candidate status or outcomes
                    without an explicit recruiter action. Similar-candidate and database-wide modes are transparency
                    aids only in this prototype.
                  </BodyText>

                  {(aiSimilar || searchDatabase) && (
                    <Box
                      marginBottom="m"
                      padding="s"
                      style={{
                        backgroundColor: colors.soap100,
                        borderRadius: 12,
                        border: `1px solid ${colors.soap300}`,
                      }}
                    >
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        {aiSimilar && searchDatabase
                          ? 'Similar candidates + database-wide scope active (illustrative).'
                          : aiSimilar
                            ? 'Similar candidates mode on — results emphasise skill and req overlap.'
                            : 'Database-wide search on — results may include candidates outside this req view.'}
                      </BodyText>
                    </Box>
                  )}

                  <Flex gap="s" flexWrap="wrap" marginBottom="m">
                    <SecondaryButton onClick={() => undefined}>Save filter</SecondaryButton>
                    <TertiaryButton onClick={() => undefined}>Clear filters</TertiaryButton>
                  </Flex>

                  <Box
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${colors.soap300}`,
                      overflow: 'hidden',
                      backgroundColor: colors.soap100,
                    }}
                  >
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <SortableHeader
                            label="Name"
                            sortKey="name"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                          <SortableHeader
                            label="Job title"
                            sortKey="jobTitle"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                          <SortableHeader
                            label="Location"
                            sortKey="location"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                          <SortableHeader
                            label="Status"
                            sortKey="status"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                          <SortableHeader
                            label="Match score"
                            sortKey="matchScore"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                          <SortableHeader
                            label="Applied date"
                            sortKey="appliedDate"
                            activeKey={sortKey}
                            ascending={sortAsc}
                            onSort={toggleSort}
                          />
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {sortedRows.map((row) => (
                          <Table.Row
                            key={row.id}
                            onClick={() => openProfile(row.id)}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openProfile(row.id);
                              }
                            }}
                            tabIndex={0}
                            aria-label={`Open profile for ${row.name}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <Table.Cell>
                              <BodyText size="small" style={{ fontWeight: 600, color: SANA_LINK_ACCENT }}>
                                {row.name}
                              </BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{row.jobTitle}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{row.location}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <StatusBadge status={row.status} />
                            </Table.Cell>
                            <Table.Cell>
                              <MatchScoreIndicator score={row.matchScore} showBar={false} />
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{formatApplied(row.appliedDate)}</BodyText>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Box>

                  {sortedRows.length === 0 && (
                    <BodyText size="small" marginTop="m" color={colors.blackPepper500}>
                      No candidates match these filters. Widen the date range or clear status.
                    </BodyText>
                  )}
                </Card>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );

  return (
    <>
      {mainShell}

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
                Collapsed by default. Expand to preview outreach from the candidate grid flow.
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
            <SystemIcon
              icon={mailIcon}
              size={22}
              color={commExpanded ? SANA_LINK_ACCENT : colors.blackPepper600}
              aria-hidden
            />
          </Box>
        }
      />

      <Modal model={profileModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(90vw, 1200px)',
              maxWidth: '90vw',
              maxHeight: 'min(90vh, 880px)',
              margin: space.l,
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            {activeRow && detail && (
              <>
                <Box
                  padding="l"
                  style={{
                    borderBottom: `1px solid ${colors.soap300}`,
                    flexShrink: 0,
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="flex-start" gap="m" flexWrap="wrap">
                    <Box flex="1 1 280px" minWidth={0}>
                      <Modal.Heading as="h2" style={{ marginBottom: space.xxs, fontSize: 20, fontWeight: 700 }}>
                        {activeRow.name}
                      </Modal.Heading>
                      <BodyText size="small" color={colors.blackPepper500}>
                        {activeRow.jobTitle} · <StatusBadge status={activeRow.status} /> · Match {activeRow.matchScore}%
                      </BodyText>
                    </Box>
                    <Flex alignItems="center" gap="s" flexWrap="wrap">
                      <ToolbarIconButton
                        icon={arrowLeftSmallIcon}
                        aria-label="Previous candidate"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                      />
                      <BodyText size="small" style={{ fontWeight: 600, minWidth: 120, textAlign: 'center' }}>
                        {selectedIndex + 1} of {sortedRows.length}
                      </BodyText>
                      <ToolbarIconButton
                        icon={arrowRightSmallIcon}
                        aria-label="Next candidate"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goNext();
                        }}
                      />
                      <BodyText size="small" color={colors.blackPepper500}>
                        ← →
                      </BodyText>
                      <Modal.CloseIcon aria-label="Close profile" />
                    </Flex>
                  </Flex>

                  <Flex
                    marginTop="m"
                    paddingTop="m"
                    style={{ borderTop: `1px solid ${colors.soap200}` }}
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap="m"
                  >
                    <Flex alignItems="center" gap="s" flexWrap="wrap">
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        Similar candidates available
                      </BodyText>
                      <TertiaryButton onClick={() => undefined}>View</TertiaryButton>
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper600} style={{ maxWidth: 420 }}>
                      AI-assisted ranking — human review required. No automatic reject or advance.
                    </BodyText>
                  </Flex>
                </Box>

                <Modal.Body padding="zero" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <Flex flex={1} style={{ minHeight: 0 }}>
                    <Box
                      width="40%"
                      flexShrink={0}
                      padding="l"
                      style={{
                        backgroundColor: SANA_PAGE_CANVAS,
                        overflowY: 'auto',
                        boxShadow: `inset -1px 0 0 ${colors.soap200}`,
                      }}
                    >
                      <Card
                        padding="l"
                        style={{
                          borderRadius: SANA_CARD_RADIUS_LG,
                          border: `1px solid ${colors.soap300}`,
                          boxShadow: SANA_CARD_SHADOW,
                        }}
                      >
                        <Flex alignItems="center" gap="m" marginBottom="m">
                          <Avatar size={64} altText="" as="div" />
                          <Box minWidth={0}>
                            <Heading size="small">{activeRow.name}</Heading>
                            <BodyText size="small" color={colors.blackPepper500}>
                              {detail.email}
                            </BodyText>
                            <BodyText size="small" color={colors.blackPepper500}>
                              {detail.phone}
                            </BodyText>
                          </Box>
                        </Flex>
                        <Box marginBottom="m">
                          <MatchScoreIndicator score={activeRow.matchScore} />
                        </Box>
                        <Box marginBottom="m">
                          <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
                            Current status
                          </BodyText>
                          <StatusBadge status={activeRow.status} />
                        </Box>
                        <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
                          Skills summary
                        </BodyText>
                        <Flex gap="xs" flexWrap="wrap" marginBottom="l">
                          {activeRow.skills.map((s) => (
                            <SkillPill key={s} label={s} />
                          ))}
                        </Flex>
                        <Flex gap="s" flexWrap="wrap">
                          <PrimaryButton onClick={() => undefined}>Advance</PrimaryButton>
                          <SecondaryButton onClick={() => undefined}>Reject</SecondaryButton>
                          <TertiaryButton onClick={() => undefined}>Message</TertiaryButton>
                        </Flex>
                      </Card>
                    </Box>

                    <Box
                      flex={1}
                      minWidth={0}
                      padding="l"
                      style={{ overflowY: 'auto', backgroundColor: colors.frenchVanilla100 }}
                    >
                      <Card
                        padding="l"
                        style={{
                          borderRadius: SANA_CARD_RADIUS_LG,
                          border: `1px solid ${colors.soap300}`,
                          boxShadow: SANA_CARD_SHADOW,
                        }}
                      >
                        <Heading size="small" marginBottom="m">
                          Resume / CV
                        </Heading>
                        <Heading as="h3" size="small" marginBottom="s" style={{ fontSize: 14 }}>
                          Experience
                        </Heading>
                        <BodyText size="small" marginBottom="l" style={{ whiteSpace: 'pre-wrap' }}>
                          {detail.experience}
                        </BodyText>
                        <Heading as="h3" size="small" marginBottom="s" style={{ fontSize: 14 }}>
                          Education
                        </Heading>
                        <BodyText size="small" marginBottom="l">
                          {detail.education}
                        </BodyText>
                        <Heading as="h3" size="small" marginBottom="s" style={{ fontSize: 14 }}>
                          Skills detail
                        </Heading>
                        <BodyText size="small" marginBottom="l" style={{ whiteSpace: 'pre-wrap' }}>
                          {detail.skillsDetail}
                        </BodyText>
                        <Box
                          padding="m"
                          style={{
                            backgroundColor: colors.soap100,
                            border: `1px solid ${colors.soap300}`,
                            borderRadius: 12,
                            fontFamily: 'Roboto Mono, Menlo, Monaco, monospace',
                            fontSize: 12,
                            lineHeight: 1.55,
                            whiteSpace: 'pre-wrap',
                            color: colors.blackPepper600,
                          }}
                        >
                          {detail.resume}
                        </Box>
                      </Card>
                    </Box>
                  </Flex>
                </Modal.Body>
              </>
            )}
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </>
  );
};

export default GccCandidateGridV44;
