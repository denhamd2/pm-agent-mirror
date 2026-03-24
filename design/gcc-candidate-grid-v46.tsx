import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Card } from '@workday/canvas-kit-react/card';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Popup, usePopupModel } from '@workday/canvas-kit-react/popup';
import { Select } from '@workday/canvas-kit-react/select';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { InputGroup } from '@workday/canvas-kit-react/text-input';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  arrowLeftSmallIcon,
  arrowRightSmallIcon,
  searchIcon,
  userIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  SANA_LINK_ACCENT,
  SANA_SEARCH_FIELD_BG,
  FormSelect,
} from './components';

/**
 * GCC Candidate Grid v46 — unified modal, carousel (no wrap), anonymised variant, tabbed modal body.
 * Discovery: design/gcc-candidate-grid-redesign-v46-discovery-brief.md (APPROVED).
 * Canvas Kit MCP: get-canvas-kit-tokens consulted; colours via `colors.*` + Sana shell tokens.
 */

const COPY = {
  prevCandidate: 'Previous candidate',
  nextCandidate: 'Next candidate',
  moveToScreen: 'Move to screen',
  rejectCandidate: 'Reject candidate',
  close: 'Close',
  openCv: 'Open CV',
  openFullProfile: 'Open full profile',
  clearFilters: 'Clear filters',
  saveFilter: 'Save filter',
  applyFilters: 'Apply filters',
  searchCandidates: 'Search candidates',
  booleanSearchTips: 'Boolean search tips',
  errorCv:
    "We can't load this CV. Open the CV in a new tab or try again later.",
  errorMissing:
    "We can't open this candidate. Refresh the list or return to the grid.",
  errorGrid:
    "We can't load candidates right now. Check your connection and refresh.",
  emptyGrid: 'No candidates match your filters. Clear or adjust filters.',
  loadingProfile: 'Loading candidate profile…',
  loadingCv: 'Loading CV…',
  hiddenDetails:
    "Some details are hidden for this candidate based on your organisation's screening settings.",
  stage: 'Stage',
  appliedDate: 'Applied date',
  source: 'Source',
  matchScore: 'Match score',
  location: 'Location',
  name: 'Name',
  savedFilters: 'Saved filters',
  candidatesTitle: 'Candidates',
  candidateCol: 'Candidate',
  cvCol: 'CV',
  anonymisedBanner:
    'Anonymised review mode active per Works Council agreement',
  gdprNotice:
    "Candidate data is processed in line with your organisation's privacy notice and the consent provided when the candidate applied.",
} as const;

const SAMPLE_PDF_URL =
  'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf';

const HUB_TABS = [
  { id: 'requisitions', label: 'Requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'offers', label: 'Offers' },
  { id: 'analytics', label: 'Analytics' },
] as const;

type HubId = (typeof HUB_TABS)[number]['id'];
type SortKey =
  | 'name'
  | 'stage'
  | 'appliedDate'
  | 'source'
  | 'matchScore'
  | 'location';

interface CandidateRow {
  id: string;
  name: string;
  jobTitle: string;
  location: string;
  stage: string;
  source: string;
  matchScore: number;
  appliedDate: string;
  skills: string[];
  /** When true, row is used to illustrate DE anonymisation context in non-global mode copy only */
  germanyContext?: boolean;
}

interface ProfileDetail {
  email: string;
  phone: string;
  experience: string;
  education: string;
  skillsDetail: string;
  resume: string;
}

const MOCK_REQ = {
  id: 'R-2026-4410',
  title: 'Senior cybersecurity engineer — GCC nationalisation programme',
  location: 'Riyadh, KSA · Hybrid',
};

const MOCK_ROWS: CandidateRow[] = [
  {
    id: '1',
    name: 'Sara Al-Mansoori',
    jobTitle: MOCK_REQ.title,
    location: 'Dubai, UAE',
    stage: 'Interview',
    source: 'Career site',
    matchScore: 92,
    appliedDate: '2026-03-18',
    skills: ['Zero trust', 'Arabic EN', 'GRC'],
  },
  {
    id: '2',
    name: 'محمد العتيبي',
    jobTitle: MOCK_REQ.title,
    location: 'Riyadh, KSA',
    stage: 'Screen',
    source: 'Referral',
    matchScore: 81,
    appliedDate: '2026-03-17',
    skills: ['SOC', 'SIEM', 'Arabic'],
  },
  {
    id: '3',
    name: 'Priya Nair',
    jobTitle: MOCK_REQ.title,
    location: 'Doha, Qatar',
    stage: 'Review',
    source: 'LinkedIn',
    matchScore: 87,
    appliedDate: '2026-03-12',
    skills: ['Cloud', 'IAM', 'Stakeholders'],
  },
  {
    id: '4',
    name: 'Omar Haddad',
    jobTitle: MOCK_REQ.title,
    location: 'Kuwait City',
    stage: 'New',
    source: 'Agency',
    matchScore: 61,
    appliedDate: '2026-03-08',
    skills: ['Network', 'ISO 27001'],
  },
  {
    id: '5',
    name: 'فاطمة الشمري',
    jobTitle: MOCK_REQ.title,
    location: 'Dammam, KSA',
    stage: 'Interview',
    source: 'Career site',
    matchScore: 88,
    appliedDate: '2026-03-19',
    skills: ['Audit', 'Risk', 'Arabic EN'],
  },
  {
    id: '6',
    name: 'James Okonkwo',
    jobTitle: MOCK_REQ.title,
    location: 'Abu Dhabi, UAE',
    stage: 'Screen',
    source: 'Referral',
    matchScore: 74,
    appliedDate: '2026-03-16',
    skills: ['Kubernetes', 'DevSecOps'],
  },
  {
    id: '7',
    name: 'Mariam Al-Kuwari',
    jobTitle: MOCK_REQ.title,
    location: 'Doha, Qatar',
    stage: 'Offer',
    source: 'Career site',
    matchScore: 95,
    appliedDate: '2026-03-05',
    skills: ['Architecture', 'OT security'],
  },
  {
    id: '8',
    name: 'Hassan El-Masry',
    jobTitle: MOCK_REQ.title,
    location: 'Manama, Bahrain',
    stage: 'Review',
    source: 'LinkedIn',
    matchScore: 69,
    appliedDate: '2026-03-09',
    skills: ['AppSec', 'SDL'],
  },
  {
    id: '9',
    name: 'Lena Schmidt',
    jobTitle: MOCK_REQ.title,
    location: 'Berlin, Germany',
    stage: 'Screen',
    source: 'Career site',
    matchScore: 72,
    appliedDate: '2026-03-11',
    skills: ['IAM', 'GDPR programmes'],
    germanyContext: true,
  },
  {
    id: '10',
    name: 'Khalid Al-Otaibi',
    jobTitle: MOCK_REQ.title,
    location: 'Jeddah, KSA',
    stage: 'New',
    source: 'Agency',
    matchScore: 64,
    appliedDate: '2026-03-20',
    skills: ['GRC', 'NCA ECC'],
  },
  {
    id: '11',
    name: 'Noor Rahman',
    jobTitle: MOCK_REQ.title,
    location: 'Sharjah, UAE',
    stage: 'Interview',
    source: 'Referral',
    matchScore: 90,
    appliedDate: '2026-03-14',
    skills: ['Purple team', 'Detection'],
  },
  {
    id: '12',
    name: 'Yasmin Al-Qahtani',
    jobTitle: MOCK_REQ.title,
    location: 'Riyadh, KSA',
    stage: 'Screen',
    source: 'LinkedIn',
    matchScore: 83,
    appliedDate: '2026-03-15',
    skills: ['vCISO', 'Board reporting', 'Arabic EN'],
  },
  {
    id: '13',
    name: 'Thomas Weber',
    jobTitle: MOCK_REQ.title,
    location: 'Frankfurt, Germany',
    stage: 'Review',
    source: 'Career site',
    matchScore: 68,
    appliedDate: '2026-03-10',
    skills: ['SOC lead', 'Works council coordination'],
    germanyContext: true,
  },
  {
    id: '14',
    name: 'خالد القحطاني',
    jobTitle: MOCK_REQ.title,
    location: 'Doha, Qatar',
    stage: 'New',
    source: 'Career site',
    matchScore: 77,
    appliedDate: '2026-03-21',
    skills: ['Pen test', 'Red team', 'Arabic'],
  },
];

function anonymisedLabel(index: number): string {
  return `Candidate A${100 + index}`;
}

function defaultProfile(row: CandidateRow): ProfileDetail {
  return {
    email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    phone: '+971 4 000 0000',
    experience:
      'Illustrative experience for prototype — align with parsed CV in product.\n• Role A: scope, outcomes, tools.\n• Role B: team size, metrics.',
    education: 'Degree relevant to role (prototype)',
    skillsDetail: row.skills.join(', '),
    resume: `${row.name.toUpperCase()}\n${row.location}\n\nEXPERIENCE\n(Illustrative CV body for ${row.jobTitle}.)\n\nEDUCATION\nSee profile summary.\n\nSKILLS\n${row.skills.join(', ')}`,
  };
}

const PROFILE_DETAIL: Record<string, ProfileDetail> = Object.fromEntries(
  MOCK_ROWS.map((r) => [r.id, defaultProfile(r)])
);

function statusBadgeStyle(stage: string): { bg: string; fg: string } {
  switch (stage) {
    case 'Interview':
    case 'Offer':
      return { bg: colors.greenApple100, fg: colors.greenApple600 };
    case 'Screen':
      return { bg: colors.soap200, fg: colors.blueberry600 };
    case 'Review':
      return { bg: colors.cantaloupe100, fg: colors.cantaloupe600 };
    default:
      return { bg: colors.soap100, fg: colors.blackPepper600 };
  }
}

const StatusBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const { bg, fg } = statusBadgeStyle(stage);
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
      {stage}
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
    <Table.Header scope="col">
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

function isTextInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return el.getAttribute('contenteditable') === 'true';
}

function readV46QueryFlags() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      anonymised: p.get('mode') === 'anonymised',
      gridError: p.get('gridError') === '1',
      cvError: p.get('cvError') === '1',
      emptyGrid: p.get('empty') === '1',
    };
  } catch {
    return { anonymised: false, gridError: false, cvError: false, emptyGrid: false };
  }
}

export const GccCandidateGridV46: React.FC = () => {
  const [queryFlags] = useState(readV46QueryFlags);
  const anonymisedMode = queryFlags.anonymised;

  const [hubTab, setHubTab] = useState<HubId>('candidates');
  const [topSearch, setTopSearch] = useState('');
  const [gridQuery, setGridQuery] = useState('(cybersecurity OR GRC) AND (KSA OR UAE OR Qatar)');
  const [filterStage, setFilterStage] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [savedFilter, setSavedFilter] = useState('none');
  const [sortKey, setSortKey] = useState<SortKey>('matchScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  const booleanPopupModel = usePopupModel();
  const profileModal = useModalModel();

  const filteredRows = useMemo(() => {
    if (queryFlags.emptyGrid) return [];
    return MOCK_ROWS.filter((r) => {
      if (filterStage !== 'all' && r.stage !== filterStage) return false;
      if (filterSource !== 'all' && r.source !== filterSource) return false;
      return true;
    });
  }, [filterStage, filterSource, queryFlags.emptyGrid]);

  const sortedRows = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (sortKey === 'matchScore') {
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      }
      av = String(av).toLowerCase();
      bv = String(bv).toLowerCase();
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
      setSortAsc(key === 'name' || key === 'appliedDate' || key === 'stage');
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
      setProfileLoading(true);
      profileModal.events.show();
      window.setTimeout(() => setProfileLoading(false), 400);
    },
    [profileModal.events]
  );

  const goPrev = useCallback(() => {
    if (selectedIndex <= 0) return;
    setSelectedId(sortedRows[selectedIndex - 1].id);
  }, [selectedIndex, sortedRows]);

  const goNext = useCallback(() => {
    if (selectedIndex < 0 || selectedIndex >= sortedRows.length - 1) return;
    setSelectedId(sortedRows[selectedIndex + 1].id);
  }, [selectedIndex, sortedRows]);

  const closeModal = useCallback(() => {
    profileModal.events.hide();
  }, [profileModal.events]);

  const modalOpen = profileModal.state.visibility !== 'hidden';

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      if (isTextInputFocused()) return;
      e.preventDefault();
      if (e.key === 'ArrowRight') goNext();
      else goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, goNext, goPrev]);

  const toggleSelect = (id: string, on: boolean) => {
    setSelectedIds((prev) => {
      if (on) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedRows.length) setSelectedIds([]);
    else setSelectedIds(sortedRows.map((r) => r.id));
  };

  const displayName = (row: CandidateRow, indexInSorted: number) =>
    anonymisedMode ? anonymisedLabel(indexInSorted) : row.name;

  const candidatesWorkspace = (
    <Box padding="l">
      <Heading size="large" marginBottom="xxs">
        {COPY.candidatesTitle}
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
        {MOCK_REQ.id} · {MOCK_REQ.title}
      </BodyText>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
        {MOCK_REQ.location}
      </BodyText>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="l" style={{ maxWidth: 720 }}>
        {COPY.gdprNotice}
      </BodyText>

      <Card
        padding="l"
        style={{
          borderRadius: SANA_CARD_RADIUS_LG,
          border: `1px solid ${colors.soap300}`,
          boxShadow: SANA_CARD_SHADOW,
          backgroundColor: colors.frenchVanilla100,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {anonymisedMode && (
          <Box marginBottom="m">
            <Banner as="div" marginBottom="m">
              <Banner.Icon />
              <Banner.Label>{COPY.anonymisedBanner}</Banner.Label>
            </Banner>
          </Box>
        )}

        {queryFlags.gridError ? (
          <Banner as="div" hasError marginBottom="m">
            <Banner.Icon />
            <Banner.Label>{COPY.errorGrid}</Banner.Label>
          </Banner>
        ) : (
          <>
            <Heading size="small" marginBottom="m">
              Filters and search
            </Heading>

            <Box marginBottom="m">
              <label htmlFor="v46-search" style={{ display: 'block', marginBottom: space.xxs }}>
                <BodyText as="span" size="small" style={{ fontWeight: 600 }}>
                  {COPY.searchCandidates}
                </BodyText>
              </label>
              <Flex gap="s" alignItems="flex-start" flexWrap="wrap">
                <Box style={{ flex: '1 1 280px', minWidth: 200 }}>
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
                      id="v46-search"
                      aria-label={COPY.searchCandidates}
                      placeholder="e.g. (skill AND location) NOT agency"
                      value={gridQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGridQuery(e.target.value)}
                      style={{
                        backgroundColor: SANA_SEARCH_FIELD_BG,
                        border: 'none',
                        boxShadow: 'none',
                        fontSize: 14,
                      }}
                    />
                  </InputGroup>
                </Box>
                <Popup model={booleanPopupModel}>
                  <Popup.Target as={TertiaryButton}>{COPY.booleanSearchTips}</Popup.Target>
                  <Popup.Popper>
                    <Popup.Card width={360} padding="s" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                      <Popup.CloseIcon aria-label={COPY.close} />
                      <Popup.Heading>Boolean search</Popup.Heading>
                      <Popup.Body>
                        <BodyText size="small">
                          Use AND, OR, and NOT with parentheses. Example: (Arabic OR UAE) AND cybersecurity.
                        </BodyText>
                      </Popup.Body>
                    </Popup.Card>
                  </Popup.Popper>
                </Popup>
              </Flex>
            </Box>

            <Flex gap="m" flexWrap="wrap" marginBottom="m">
              <Box style={{ minWidth: 160 }}>
                <FormSelect
                  id="v46-stage"
                  label={COPY.stage}
                  value={filterStage}
                  onChange={setFilterStage}
                  options={[
                    { value: 'all', label: 'All stages' },
                    { value: 'New', label: 'New' },
                    { value: 'Review', label: 'Review' },
                    { value: 'Screen', label: 'Screen' },
                    { value: 'Interview', label: 'Interview' },
                    { value: 'Offer', label: 'Offer' },
                  ]}
                />
              </Box>
              <Box style={{ minWidth: 160 }}>
                <FormSelect
                  id="v46-source"
                  label={COPY.source}
                  value={filterSource}
                  onChange={setFilterSource}
                  options={[
                    { value: 'all', label: 'All sources' },
                    { value: 'Career site', label: 'Career site' },
                    { value: 'LinkedIn', label: 'LinkedIn' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Agency', label: 'Agency' },
                  ]}
                />
              </Box>
            </Flex>

            {selectedIds.length > 0 && (
              <Box
                marginBottom="m"
                padding="m"
                style={{
                  backgroundColor: colors.soap100,
                  borderRadius: 12,
                  border: `1px solid ${colors.soap300}`,
                }}
              >
                <BodyText size="small" marginBottom="s" style={{ fontWeight: 600 }}>
                  {selectedIds.length} selected
                </BodyText>
                <Flex gap="s" flexWrap="wrap">
                  <PrimaryButton onClick={() => undefined}>{COPY.moveToScreen}</PrimaryButton>
                  <SecondaryButton onClick={() => undefined}>{COPY.rejectCandidate}</SecondaryButton>
                </Flex>
              </Box>
            )}

            <Flex gap="s" flexWrap="wrap" marginBottom="m">
              <SecondaryButton onClick={() => undefined}>{COPY.saveFilter}</SecondaryButton>
              <TertiaryButton onClick={() => undefined}>{COPY.applyFilters}</TertiaryButton>
              <TertiaryButton
                onClick={() => {
                  setFilterStage('all');
                  setFilterSource('all');
                }}
              >
                {COPY.clearFilters}
              </TertiaryButton>
            </Flex>

            <Box
              style={{
                width: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <Box
                style={{
                  borderRadius: 12,
                  border: `1px solid ${colors.soap300}`,
                  backgroundColor: colors.soap100,
                  maxWidth: '100%',
                  display: 'inline-block',
                  minWidth: '100%',
                }}
              >
                <Table>
                  <Table.Head>
                    <Table.Row>
                    <Table.Header scope="col" style={{ width: '40px', minWidth: '40px' }}>
                      <Checkbox
                        checked={sortedRows.length > 0 && selectedIds.length === sortedRows.length}
                        onChange={() => toggleSelectAll()}
                        aria-label="Select all candidates in view"
                      />
                    </Table.Header>
                    <SortableHeader label={COPY.name} sortKey="name" activeKey={sortKey} ascending={sortAsc} onSort={toggleSort} />
                    <SortableHeader label={COPY.stage} sortKey="stage" activeKey={sortKey} ascending={sortAsc} onSort={toggleSort} />
                    <SortableHeader
                      label={COPY.appliedDate}
                      sortKey="appliedDate"
                      activeKey={sortKey}
                      ascending={sortAsc}
                      onSort={toggleSort}
                    />
                    <SortableHeader label={COPY.source} sortKey="source" activeKey={sortKey} ascending={sortAsc} onSort={toggleSort} />
                    <SortableHeader
                      label={COPY.location}
                      sortKey="location"
                      activeKey={sortKey}
                      ascending={sortAsc}
                      onSort={toggleSort}
                    />
                    <Table.Header scope="col" style={{ width: '90px', minWidth: '90px' }}>{COPY.cvCol}</Table.Header>
                    </Table.Row>
                  </Table.Head>
                <Table.Body>
                  {sortedRows.map((row, idx) => (
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
                      aria-label={`${COPY.candidateCol}: ${displayName(row, idx)}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <Table.Cell
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) => toggleSelect(row.id, e.target.checked)}
                          aria-label={`Select ${displayName(row, idx)}`}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" style={{ fontWeight: 600, color: SANA_LINK_ACCENT }}>
                          {displayName(row, idx)}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge stage={row.stage} />
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">{formatApplied(row.appliedDate)}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">{row.source}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">{anonymisedMode ? '—' : row.location}</BodyText>
                      </Table.Cell>
                      <Table.Cell
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {anonymisedMode ? (
                          <BodyText size="small" color={colors.blackPepper500}>
                            —
                          </BodyText>
                        ) : (
                          <TertiaryButton
                            onClick={() => {
                              openProfile(row.id);
                            }}
                          >
                            {COPY.openCv}
                          </TertiaryButton>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Box>
          </Box>

            {sortedRows.length === 0 && (
              <BodyText size="small" marginTop="m" color={colors.blackPepper600}>
                {COPY.emptyGrid}
              </BodyText>
            )}
          </>
        )}
      </Card>
    </Box>
  );

  const hubBody = () => {
    switch (hubTab) {
      case 'requisitions':
        return (
          <Box padding="l">
            <Heading size="large" marginBottom="m">
              Requisitions
            </Heading>
            <Box
              style={{
                borderRadius: 12,
                border: '1px solid var(--cnvs-sys-color-border-container)',
                overflow: 'hidden',
                backgroundColor: 'var(--cnvs-sys-color-bg-default)',
              }}
            >
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header scope="col">Requisition</Table.Header>
                    <Table.Header scope="col">Location</Table.Header>
                    <Table.Header scope="col">Stage</Table.Header>
                    <Table.Header scope="col">Candidates</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        {MOCK_REQ.id}
                      </BodyText>
                      <BodyText size="small">{MOCK_REQ.title}</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Riyadh / Dubai</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge stage="Interview" />
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">14</BodyText>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        R-2026-3981
                      </BodyText>
                      <BodyText size="small">Principal consultant — Qatar LNG</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Doha</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge stage="Screen" />
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">31</BodyText>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Box>
          </Box>
        );
      case 'candidates':
        return candidatesWorkspace;
      case 'offers':
        return (
          <Box padding="l">
            <Heading size="large" marginBottom="m">
              Offers
            </Heading>
            <Flex gap="m" flexWrap="wrap" marginBottom="l">
              <Card
                padding="l"
                style={{
                  flex: '1 1 200px',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: '1px solid var(--cnvs-sys-color-border-container)',
                  backgroundColor: 'var(--cnvs-sys-color-bg-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                <BodyText
                  size="small"
                  style={{
                    color: 'var(--cnvs-sys-color-fg-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                  marginBottom="s"
                >
                  Pending approval
                </BodyText>
                <Heading
                  size="large"
                  style={{
                    color: 'var(--cnvs-sys-color-text-strong)',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: 1.2,
                  }}
                >
                  3
                </Heading>
              </Card>
              <Card
                padding="l"
                style={{
                  flex: '1 1 200px',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: '1px solid var(--cnvs-sys-color-border-container)',
                  backgroundColor: 'var(--cnvs-sys-color-bg-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                <BodyText
                  size="small"
                  style={{
                    color: 'var(--cnvs-sys-color-fg-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                  marginBottom="s"
                >
                  Accepted (30 days)
                </BodyText>
                <Heading
                  size="large"
                  style={{
                    color: 'var(--cnvs-sys-color-text-strong)',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: 1.2,
                  }}
                >
                  5
                </Heading>
              </Card>
            </Flex>
            <Card
              padding="l"
              style={{
                borderRadius: SANA_CARD_RADIUS_LG,
                border: '1px solid var(--cnvs-sys-color-border-container)',
                backgroundColor: 'var(--cnvs-sys-color-bg-default)',
              }}
            >
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header scope="col">{COPY.candidateCol}</Table.Header>
                    <Table.Header scope="col">Role</Table.Header>
                    <Table.Header scope="col">Status</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small">Mariam Al-Kuwari</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Senior cybersecurity engineer</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge stage="Offer" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Card>
          </Box>
        );
      case 'analytics':
        return (
          <Box padding="l">
            <Heading size="large" marginBottom="m">
              Analytics
            </Heading>
            <Flex gap="m" flexWrap="wrap">
              <Card
                padding="l"
                style={{
                  flex: '1 1 220px',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: '1px solid var(--cnvs-sys-color-border-container)',
                  backgroundColor: 'var(--cnvs-sys-color-bg-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                <BodyText
                  size="small"
                  style={{ 
                    color: 'var(--cnvs-sys-color-fg-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                  marginBottom="s"
                >
                  Time in Screen (median)
                </BodyText>
                <Heading
                  size="large"
                  style={{
                    color: 'var(--cnvs-sys-color-text-strong)',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: 1.2,
                  }}
                >
                  4.2 days
                </Heading>
              </Card>
              <Card
                padding="l"
                style={{
                  flex: '1 1 220px',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: '1px solid var(--cnvs-sys-color-border-container)',
                  backgroundColor: 'var(--cnvs-sys-color-bg-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                <BodyText
                  size="small"
                  style={{ 
                    color: 'var(--cnvs-sys-color-fg-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                  marginBottom="s"
                >
                  Pass-through rate
                </BodyText>
                <Heading
                  size="large"
                  style={{
                    color: 'var(--cnvs-sys-color-text-strong)',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: 1.2,
                  }}
                >
                  38%
                </Heading>
              </Card>
              <Card
                padding="l"
                style={{
                  flex: '1 1 220px',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: '1px solid var(--cnvs-sys-color-border-container)',
                  backgroundColor: 'var(--cnvs-sys-color-bg-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                <BodyText
                  size="small"
                  style={{ 
                    color: 'var(--cnvs-sys-color-fg-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                  marginBottom="s"
                >
                  Sourcing mix
                </BodyText>
                <BodyText
                  size="small"
                  style={{ 
                    color: 'var(--cnvs-sys-color-text-strong)',
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  Career site 42% · LinkedIn 28% · Referral 21% · Agency 9%
                </BodyText>
              </Card>
            </Flex>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS, overflowX: 'hidden' }}>
        <WorkdayTopNav
          searchValue={topSearch}
          onSearchChange={setTopSearch}
          showWMark
          showMenuWordmark={false}
          notificationBadge={5}
          inboxBadge={42}
        />

        <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`, overflow: 'hidden' }}>
          <WorkdayLeftTabBar
            showSecondaryTitleIcon
            secondaryTitle="Recruiting"
            secondarySubtitle={`${MOCK_REQ.id} · ${MOCK_REQ.location}`}
            tabs={[...HUB_TABS]}
            activeTabId={hubTab}
            onTabChange={(id) => setHubTab(id as HubId)}
          />

          <Box
            flex={1}
            minWidth={0}
            style={{
              overflow: 'auto',
              backgroundColor: SANA_PAGE_CANVAS,
            }}
          >
            <Box
              style={{
                margin: space.l,
                borderRadius: SANA_SHELL_RADIUS,
                backgroundColor: colors.frenchVanilla100,
                boxShadow: SANA_CARD_SHADOW_LIFTED,
                minHeight: `calc(100% - ${space.l} * 2)`,
              }}
            >
              {hubBody()}
            </Box>
          </Box>
        </Flex>
      </Box>

      <Modal model={profileModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(92vw, 1240px)',
              maxWidth: '92vw',
              maxHeight: 'min(92vh, 900px)',
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
                <Box padding="l" style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}>
                  {anonymisedMode && (
                    <Box marginBottom="m">
                      <Banner as="div" marginBottom="m">
                        <Banner.Icon />
                        <Banner.Label>{COPY.anonymisedBanner}</Banner.Label>
                      </Banner>
                    </Box>
                  )}
                  <Flex justifyContent="space-between" alignItems="flex-start" gap="m" flexWrap="wrap">
                    <Flex alignItems="center" gap="m" flex="1 1 280px" minWidth={0}>
                      {anonymisedMode ? (
                        <Box
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: colors.soap200,
                            border: `1px solid ${colors.soap300}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          aria-hidden
                        >
                          <SystemIcon icon={userIcon} size={28} color={colors.blackPepper400} />
                        </Box>
                      ) : (
                        <Avatar size={64} altText="" as="div" />
                      )}
                      <Box minWidth={0}>
                        <Modal.Heading as="h2" style={{ marginBottom: space.xxs, fontSize: 20, fontWeight: 700 }}>
                          {displayName(activeRow, selectedIndex)}
                        </Modal.Heading>
                        {anonymisedMode ? (
                          <BodyText size="small" color={colors.blackPepper500}>
                            —
                          </BodyText>
                        ) : (
                          <BodyText size="small" color={colors.blackPepper500}>
                            {activeRow.jobTitle} · <StatusBadge stage={activeRow.stage} /> · {COPY.matchScore}{' '}
                            {activeRow.matchScore}%
                          </BodyText>
                        )}
                        {!anonymisedMode && activeRow.germanyContext && (
                          <BodyText size="small" color={colors.blackPepper500} marginTop="xxs">
                            {activeRow.location}
                          </BodyText>
                        )}
                      </Box>
                    </Flex>
                    <Flex alignItems="center" gap="s" flexWrap="wrap">
                      <ToolbarIconButton
                        icon={arrowLeftSmallIcon}
                        aria-label={COPY.prevCandidate}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                        disabled={selectedIndex <= 0}
                      />
                      <BodyText size="small" style={{ fontWeight: 600, minWidth: 120, textAlign: 'center' }}>
                        {selectedIndex + 1} of {sortedRows.length}
                      </BodyText>
                      <ToolbarIconButton
                        icon={arrowRightSmallIcon}
                        aria-label={COPY.nextCandidate}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goNext();
                        }}
                        disabled={selectedIndex < 0 || selectedIndex >= sortedRows.length - 1}
                      />
                      <Modal.CloseIcon aria-label={COPY.close} />
                    </Flex>
                  </Flex>
                </Box>

                <Modal.Body padding="zero" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  {profileLoading ? (
                    <Box padding="l">
                      <BodyText size="small">{COPY.loadingProfile}</BodyText>
                    </Box>
                  ) : (
                    <Tabs initialTab="overview">
                      <Tabs.List marginBottom="l" paddingX="l" paddingTop="m">
                        <Tabs.Item data-id="overview">Overview</Tabs.Item>
                        <Tabs.Item data-id="cv">CV preview</Tabs.Item>
                        <Tabs.Item data-id="activity">Activity timeline</Tabs.Item>
                        <Tabs.Item data-id="notes">Notes</Tabs.Item>
                      </Tabs.List>

                      <Box flex={1} minHeight={0} paddingX="l" paddingBottom="l" style={{ overflowY: 'auto' }}>
                        <Tabs.Panel data-id="overview">
                          {anonymisedMode ? (
                            <Box marginBottom="m">
                              <BodyText size="small" color={colors.blackPepper600}>
                                {COPY.hiddenDetails}
                              </BodyText>
                            </Box>
                          ) : (
                            <Card
                              padding="l"
                              style={{
                                borderRadius: SANA_CARD_RADIUS_LG,
                                border: `1px solid ${colors.soap300}`,
                                boxShadow: SANA_CARD_SHADOW,
                              }}
                            >
                              <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
                                Contact
                              </BodyText>
                              <BodyText size="small" marginBottom="s">
                                {detail.email}
                              </BodyText>
                              <BodyText size="small" marginBottom="m">
                                {detail.phone}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
                                Experience
                              </BodyText>
                              <BodyText size="small" marginBottom="m" style={{ whiteSpace: 'pre-wrap' }}>
                                {detail.experience}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
                                Education
                              </BodyText>
                              <BodyText size="small" marginBottom="m">
                                {detail.education}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
                                Skills
                              </BodyText>
                              <Flex gap="xs" flexWrap="wrap">
                                {activeRow.skills.map((s) => (
                                  <SkillPill key={s} label={s} />
                                ))}
                              </Flex>
                            </Card>
                          )}
                        </Tabs.Panel>

                        <Tabs.Panel data-id="cv">
                          {anonymisedMode ? (
                            <Banner as="div" marginBottom="m">
                              <Banner.Icon />
                              <Banner.Label>{COPY.hiddenDetails}</Banner.Label>
                            </Banner>
                          ) : queryFlags.cvError ? (
                            <Banner as="div" hasError marginBottom="m">
                              <Banner.Icon />
                              <Banner.Label>{COPY.errorCv}</Banner.Label>
                            </Banner>
                          ) : (
                            <Flex gap="l" flexWrap="wrap" alignItems="flex-start">
                              <Box style={{ flex: '0 0 200px' }}>
                                <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="s">
                                  Pages
                                </BodyText>
                                <Flex gap="s" flexWrap="wrap">
                                  {[1, 2, 3, 4].map((p) => (
                                    <Card
                                      key={p}
                                      padding="s"
                                      style={{
                                        width: 88,
                                        height: 112,
                                        borderRadius: 8,
                                        border: `1px solid ${colors.soap300}`,
                                        backgroundColor: colors.soap100,
                                      }}
                                    >
                                      <BodyText size="small">Page {p}</BodyText>
                                    </Card>
                                  ))}
                                </Flex>
                              </Box>
                              <Box flex={1} minWidth={280}>
                                <Flex justifyContent="space-between" alignItems="center" marginBottom="m" flexWrap="wrap" gap="s">
                                  <Heading size="small">{COPY.cvCol}</Heading>
                                  <TertiaryButton onClick={() => window.open(SAMPLE_PDF_URL, '_blank', 'noopener,noreferrer')}>
                                    {COPY.openCv}
                                  </TertiaryButton>
                                </Flex>
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
                                    maxHeight: 320,
                                    overflowY: 'auto',
                                  }}
                                >
                                  {detail.resume}
                                </Box>
                              </Box>
                            </Flex>
                          )}
                        </Tabs.Panel>

                        <Tabs.Panel data-id="activity">
                          <Card
                            padding="l"
                            style={{
                              borderRadius: SANA_CARD_RADIUS_LG,
                              border: `1px solid ${colors.soap300}`,
                              boxShadow: SANA_CARD_SHADOW,
                            }}
                          >
                            <BodyText size="small" marginBottom="m" style={{ fontWeight: 600 }}>
                              Application history
                            </BodyText>
                            <BodyText size="small" marginBottom="s">
                              19 March 2026 — Moved to {activeRow.stage} by you
                            </BodyText>
                            <BodyText size="small" marginBottom="s">
                              12 March 2026 — Application submitted
                            </BodyText>
                            <BodyText size="small">8 March 2026 — Sourced from {activeRow.source}</BodyText>
                          </Card>
                        </Tabs.Panel>

                        <Tabs.Panel data-id="notes">
                          <Card
                            padding="l"
                            style={{
                              borderRadius: SANA_CARD_RADIUS_LG,
                              border: `1px solid ${colors.soap300}`,
                              boxShadow: SANA_CARD_SHADOW,
                            }}
                          >
                            <BodyText size="small" marginBottom="m" style={{ fontWeight: 600 }}>
                              Recruiter notes
                            </BodyText>
                            <BodyText size="small" marginBottom="s">
                              Strong GCC enterprise references; confirm notice period.
                            </BodyText>
                            <BodyText size="small">Phone screen scheduled — panel availability TBC.</BodyText>
                          </Card>
                        </Tabs.Panel>
                      </Box>
                    </Tabs>
                  )}
                </Modal.Body>

                <Box
                  padding="l"
                  style={{
                    borderTop: `1px solid ${colors.soap300}`,
                    flexShrink: 0,
                    backgroundColor: colors.frenchVanilla100,
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="center" gap="m" flexWrap="wrap">
                    <Flex gap="s" flexWrap="wrap">
                      <PrimaryButton onClick={() => undefined}>{COPY.moveToScreen}</PrimaryButton>
                      <SecondaryButton onClick={() => undefined}>{COPY.rejectCandidate}</SecondaryButton>
                      <TertiaryButton onClick={() => undefined}>{COPY.openFullProfile}</TertiaryButton>
                    </Flex>
                    <SecondaryButton onClick={closeModal}>{COPY.close}</SecondaryButton>
                  </Flex>
                </Box>
              </>
            )}
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </>
  );
};

export default GccCandidateGridV46;
