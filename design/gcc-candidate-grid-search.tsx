/**
 * Candidate grid redesign v84 (Job requisition — Candidates)
 * Design brief: design/candidate-grid-redesign-v84-design-brief.md (APPROVED 318)
 * Copy: design/candidate-grid-redesign-v84-copy-review.md
 *
 * Route: /candidate-grid-v84
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Menu } from '@workday/canvas-kit-react/menu';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import { Tooltip } from '@workday/canvas-kit-react/tooltip';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
  relatedActionsVerticalIcon,
  questionOutlineIcon,
  filterIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
  HiredScoreGrading,
  FormSelect,
  MetricCard,
  FilterPill,
  ProgressBarWithBadge,
  ReportCard,
  ListItemCard,
} from './components';
import type { WorkdayLeftTabBarPrimaryItem } from './components/WorkdayLeftTabBar';

type Stage =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

interface CandidateRow {
  id: string;
  name: string;
  title: string;
  fit: number;
  location: string;
  source: string;
  stage: Stage;
  appliedLabel: string;
  breakdown: { technical: number; experience: number; culture: number };
  topPick?: boolean;
  newToday?: boolean;
  needsReview?: boolean;
}

const HUB_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'job-reqs', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'reports', label: 'Reports' },
] as const;

const PRIMARY_RAIL: WorkdayLeftTabBarPrimaryItem[] = [
  { 
    icon: homeIcon, 
    ariaLabel: 'Home', 
    railLabel: 'Home',
    onClick: () => {
      window.location.hash = '/recruiter-home-v85';
    },
  },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const MOCK_CANDIDATES: CandidateRow[] = [
  {
    id: 'c1',
    name: 'Jordan Ellis',
    title: 'Principal PM, Talent products',
    fit: 94,
    location: 'San Francisco, CA',
    source: 'LinkedIn',
    stage: 'Interview',
    appliedLabel: '28 March 2026',
    breakdown: { technical: 92, experience: 95, culture: 94 },
    topPick: true,
  },
  {
    id: 'c2',
    name: 'Morgan Lee',
    title: 'Senior PM, HCM',
    fit: 88,
    location: 'New York, NY',
    source: 'Career site',
    stage: 'Phone Screen',
    appliedLabel: '27 March 2026',
    breakdown: { technical: 90, experience: 85, culture: 88 },
    newToday: true,
  },
  {
    id: 'c3',
    name: 'Riley Patel',
    title: 'Group PM, Platform',
    fit: 81,
    location: 'Remote',
    source: 'Employee referral',
    stage: 'Applied',
    appliedLabel: '26 March 2026',
    breakdown: { technical: 78, experience: 84, culture: 80 },
    needsReview: true,
  },
  {
    id: 'c4',
    name: 'Casey Nguyen',
    title: 'PM, Recruiting',
    fit: 76,
    location: 'San Francisco, CA',
    source: 'Agency',
    stage: 'Applied',
    appliedLabel: '25 March 2026',
    breakdown: { technical: 74, experience: 78, culture: 77 },
  },
  {
    id: 'c5',
    name: 'Taylor Brooks',
    title: 'Director, Product',
    fit: 71,
    location: 'Austin, TX',
    source: 'LinkedIn',
    stage: 'Phone Screen',
    appliedLabel: '24 March 2026',
    breakdown: { technical: 72, experience: 70, culture: 72 },
  },
  {
    id: 'c6',
    name: 'Jamie Rivera',
    title: 'PM, Growth',
    fit: 66,
    location: 'Chicago, IL',
    source: 'Career site',
    stage: 'Interview',
    appliedLabel: '22 March 2026',
    breakdown: { technical: 68, experience: 64, culture: 67 },
  },
  {
    id: 'c7',
    name: 'Avery Chen',
    title: 'IC4 PM',
    fit: 59,
    location: 'Seattle, WA',
    source: 'LinkedIn',
    stage: 'Applied',
    appliedLabel: '20 March 2026',
    breakdown: { technical: 58, experience: 60, culture: 58 },
  },
  {
    id: 'c8',
    name: 'Quinn Foster',
    title: 'PM, Enterprise',
    fit: 48,
    location: 'Denver, CO',
    source: 'Indeed',
    stage: 'Rejected',
    appliedLabel: '18 March 2026',
    breakdown: { technical: 45, experience: 52, culture: 46 },
  },
  {
    id: 'c9',
    name: 'Skyler Adams',
    title: 'Senior PM',
    fit: 91,
    location: 'San Francisco, CA',
    source: 'Employee referral',
    stage: 'Offer',
    appliedLabel: '17 March 2026',
    breakdown: { technical: 90, experience: 91, culture: 92 },
    topPick: true,
  },
  {
    id: 'c10',
    name: 'Reese Kumar',
    title: 'PM II',
    fit: 73,
    location: 'Remote',
    source: 'Career site',
    stage: 'Phone Screen',
    appliedLabel: '16 March 2026',
    breakdown: { technical: 75, experience: 71, culture: 73 },
    newToday: true,
  },
];

const PIPELINE_STAGES: { name: string; key: Stage | 'all'; count: number }[] = [
  { name: 'Applied', key: 'Applied', count: 87 },
  { name: 'Phone Screen', key: 'Phone Screen', count: 12 },
  { name: 'Interview', key: 'Interview', count: 5 },
  { name: 'Offer', key: 'Offer', count: 2 },
];

const TOTAL_PIPELINE = PIPELINE_STAGES.reduce((s, x) => s + x.count, 0);

const HIRED_SCORE_FILTERS = [
  { id: 'A', label: 'A – Strong Fit (85–100%)' },
  { id: 'B', label: 'B – Good Fit (70–84%)' },
  { id: 'C', label: 'C – Moderate Fit (55–69%)' },
  { id: 'D', label: 'D – Developing Fit (0–54%)' },
] as const;

const STAGE_FILTERS: Stage[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

function stageIndicator(stage: Stage) {
  const map: Record<Stage, { type: StatusIndicatorType; label: string }> = {
    Applied: { type: StatusIndicatorType.Gray, label: 'Applied' },
    'Phone Screen': { type: StatusIndicatorType.Blue, label: 'Phone Screen' },
    Interview: { type: StatusIndicatorType.Blue, label: 'Interview' },
    Offer: { type: StatusIndicatorType.Green, label: 'Offer' },
    Hired: { type: StatusIndicatorType.Green, label: 'Hired' },
    Rejected: { type: StatusIndicatorType.Red, label: 'Rejected' },
  };
  const m = map[stage];
  return (
    <StatusIndicator
      type={m.type}
      emphasis={StatusIndicatorEmphasis.Low}
      label={m.label}
    />
  );
}

function gradeMatchesFilter(fit: number, gradeIds: Set<string>): boolean {
  if (gradeIds.size === 0) return true;
  const letter =
    fit >= 85 ? 'A' : fit >= 70 ? 'B' : fit >= 55 ? 'C' : 'D';
  return gradeIds.has(letter);
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  extra,
}: {
  label: string;
  sortKey: string;
  activeKey: string;
  direction: 'ascending' | 'descending';
  onSort: (k: string) => void;
  extra?: React.ReactNode;
}) {
  const active = activeKey === sortKey;
  return (
    <Table.Header scope="col">
      <Flex alignItems="center" gap="xxs">
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          aria-sort={active ? direction : 'none'}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit',
            fontWeight: 700,
            color: colors.blackPepper600,
            textAlign: 'left',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          className="ck-sort-header"
        >
          {label}
          {active ? (
            <span aria-hidden>{direction === 'ascending' ? '▲' : '▼'}</span>
          ) : null}
        </button>
        {extra}
      </Flex>
    </Table.Header>
  );
}

const HIRED_SCORE_HEADER_TOOLTIP =
  'AI-powered candidate matching score based on skills, experience, and job requirements. Scores are suggestions; always review candidates individually.';

function HiredScoreCell({ row }: { row: CandidateRow }) {
  const breakdown = `Technical skills: ${row.breakdown.technical}%. Experience: ${row.breakdown.experience}%. Culture fit: ${row.breakdown.culture}%.`;
  return (
    <Tooltip title={breakdown} type="description" placement="top">
      <Box
        tabIndex={0}
        style={{ display: 'inline-block', maxWidth: 200 }}
        aria-label={`HiredScore breakdown for ${row.name}. ${breakdown}`}
      >
        <HiredScoreGrading fit={row.fit} variant="full" />
      </Box>
    </Tooltip>
  );
}

export const GccCandidateGridSearch: React.FC = () => {
  const [topSearch, setTopSearch] = useState('');
  const [hubTab, setHubTab] = useState<string>('candidates');
  const [reqTab, setReqTab] = useState('candidates');
  const [savedPill, setSavedPill] = useState<'all' | 'new' | 'high' | 'review'>('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [gradeFilters, setGradeFilters] = useState<Set<string>>(new Set());
  const [stageFilters, setStageFilters] = useState<Set<Stage>>(
    () => new Set(['Applied', 'Phone Screen', 'Interview', 'Offer'])
  );
  const [savedViewPicks, setSavedViewPicks] = useState({ top: false, today: false, review: false });
  const [sortKey, setSortKey] = useState<string>('applied');
  const [sortDir, setSortDir] = useState<'ascending' | 'descending'>('descending');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const pageSize = 8;

  const modal = useModalModel({ id: 'candidate-profile-v84' });
  const [profileCandidate, setProfileCandidate] = useState<CandidateRow | null>(null);

  /** Figma/html-to-design: `?capture=` loads a fixed state per frame (hash capture reloads the page). */
  const [captureMode] = useState(() =>
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('capture') || ''
      : ''
  );

  useEffect(() => {
    if (captureMode === 'bulk') {
      setSelected(new Set(['c1', 'c2', 'c3']));
    }
    if (captureMode === 'filters') {
      setSourceFilter('LinkedIn');
      setSavedViewPicks({ top: true, today: false, review: false });
    }
  }, [captureMode]);

  useEffect(() => {
    if (captureMode !== 'modal') return;
    const first = MOCK_CANDIDATES[0];
    setProfileCandidate(first);
    const id = requestAnimationFrame(() => {
      modal.events.show();
    });
    return () => cancelAnimationFrame(id);
  }, [captureMode, modal.events]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'ascending' ? 'descending' : 'ascending'));
    } else {
      setSortKey(key);
      setSortDir('descending');
    }
  };

  const filtered = useMemo(() => {
    return MOCK_CANDIDATES.filter((c) => {
      if (stageFilters.size > 0 && !stageFilters.has(c.stage)) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      if (locationFilter !== 'all') {
        const locKey =
          c.location === 'San Francisco, CA'
            ? 'sf'
            : c.location === 'New York, NY'
              ? 'ny'
              : c.location === 'Remote'
                ? 'remote'
                : '';
        if (locationFilter !== locKey) return false;
      }
      if (!gradeMatchesFilter(c.fit, gradeFilters)) return false;
      if (savedViewPicks.top && !c.topPick) return false;
      if (savedViewPicks.today && !c.newToday) return false;
      if (savedViewPicks.review && !c.needsReview) return false;
      if (savedPill === 'new' && !c.newToday) return false;
      if (savedPill === 'high' && c.fit < 70) return false;
      if (savedPill === 'review' && !c.needsReview) return false;
      return true;
    });
  }, [
    gradeFilters,
    stageFilters,
    sourceFilter,
    locationFilter,
    savedViewPicks,
    savedPill,
  ]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === 'ascending' ? 1 : -1;
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'fit':
          cmp = a.fit - b.fit;
          break;
        case 'location':
          cmp = a.location.localeCompare(b.location);
          break;
        case 'source':
          cmp = a.source.localeCompare(b.source);
          break;
        case 'stage':
          cmp = a.stage.localeCompare(b.stage);
          break;
        case 'applied':
        default:
          cmp = a.appliedLabel.localeCompare(b.appliedLabel);
          break;
      }
      return cmp * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = sorted.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const toggleGrade = (id: string) => {
    setGradeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPage(1);
  };

  const toggleStage = (st: Stage) => {
    setStageFilters((prev) => {
      const next = new Set(prev);
      if (next.has(st)) next.delete(st);
      else next.add(st);
      return next;
    });
    setPage(1);
  };

  const clearFilters = useCallback(() => {
    setGradeFilters(new Set());
    setStageFilters(new Set(STAGE_FILTERS));
    setSourceFilter('all');
    setLocationFilter('all');
    setSavedViewPicks({ top: false, today: false, review: false });
    setSavedPill('all');
    setPage(1);
  }, []);

  const toggleRowSelect = (id: string, index: number, shift: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shift && lastIndex !== null) {
        const start = Math.min(lastIndex, index);
        const end = Math.max(lastIndex, index);
        const slice = pageRows.slice(start, end + 1).map((r) => r.id);
        const allOn = slice.every((i) => next.has(i));
        slice.forEach((i) => {
          if (allOn) next.delete(i);
          else next.add(i);
        });
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
    setLastIndex(index);
  };

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const somePageSelected =
    pageRows.length > 0 && pageRows.some((r) => selected.has(r.id)) && !allPageSelected;

  const toggleSelectAllPage = () => {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const openProfile = (row: CandidateRow) => {
    setProfileCandidate(row);
    modal.events.show();
  };

  const hubMain = () => {
    if (hubTab === 'dashboard') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Heading size="large" marginBottom="m">
            Recruiting dashboard
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
            Your recruiting metrics, pipeline health, and action items. Data updates daily at 03:00 UTC.
          </BodyText>

          <Flex gap="m" flexWrap="wrap" marginBottom="xl">
            {[
              { k: 'Open requisitions', v: '38', h: 'Assigned to you', change: '+5 this week' },
              { k: 'Active candidates', v: '612', h: 'Across all reqs', change: '+47 this week' },
              { k: 'Interviews this week', v: '24', h: 'Confirmed slots', change: '18 complete, 6 upcoming' },
              { k: 'Avg. time-in-stage', v: '8.2 days', h: 'Applied → Offer', change: '-1.3 days vs. last month' },
            ].map((t) => (
              <MetricCard
                key={t.k}
                label={t.k}
                value={t.v}
                helperText={t.h}
                changeIndicator={{ text: t.change, sentiment: 'neutral' }}
              />
            ))}
          </Flex>

          <Flex gap="l" alignItems="stretch" flexWrap="wrap" marginBottom="xl">
            <Box
              flex="1 1 400px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                <Heading size="small">Top candidates this week</Heading>
                <SecondaryButton size="small">View All</SecondaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Highest HiredScore candidates applied in last 7 days. Review for fast-track consideration.
              </BodyText>
              <Flex flexDirection="column" gap="m">
                {MOCK_CANDIDATES.slice(0, 3).map((c) => (
                  <ListItemCard
                    key={c.id}
                    title={c.name}
                    subtitle={c.title}
                    metadata={`Applied ${c.appliedLabel} · ${c.source}`}
                    trailingElement={<HiredScoreGrading fit={c.fit} variant="compact" />}
                    onClick={() => openProfile(c)}
                  />
                ))}
              </Flex>
            </Box>

            <Box
              flex="1 1 350px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                <Heading size="small">Upcoming interviews</Heading>
                <SecondaryButton size="small">Calendar</SecondaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Scheduled interviews in next 7 days. Confirm attendance and prep materials.
              </BodyText>
              <Flex flexDirection="column" gap="s">
                {[
                  { candidate: 'Jordan Ellis', role: 'Senior PM', time: 'Today, 14:00–15:00', panel: 'Sarah Chen, Alex Morgan' },
                  { candidate: 'Morgan Taylor', role: 'Staff Engineer', time: 'Tomorrow, 10:00–11:00', panel: 'David Lee' },
                  { candidate: 'Casey Rivera', role: 'Senior PM', time: '2 April, 15:00–16:00', panel: 'Sarah Chen, Jamie Park' },
                ].map((i, idx) => (
                  <Box
                    key={idx}
                    padding="s"
                    style={{
                      borderLeft: `3px solid ${colors.blueberry400}`,
                      paddingLeft: space.s,
                    }}
                  >
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      {i.candidate}
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500}>
                      {i.role}
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                      {i.time}
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                      Panel: {i.panel}
                    </BodyText>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>

          <Heading size="small" marginBottom="m">
            Your requisitions
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
            Open and in-progress reqs assigned to you. Click row to open details and candidate pipeline.
          </BodyText>
          <Box
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Requisition</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Location</Table.Header>
                  <Table.Header>Hiring Manager</Table.Header>
                  <Table.Header>Candidates</Table.Header>
                  <Table.Header>Days Open</Table.Header>
                  <Table.Header>Top Score</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row
                  style={{ cursor: 'pointer' }}
                  onClick={() => setHubTab('candidates')}
                  tabIndex={0}
                >
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        Senior Product Manager
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1234
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Green}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Open"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">San Francisco, CA</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Sarah Chen</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      127
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">18 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={94} variant="compact" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{ cursor: 'pointer' }} tabIndex={0}>
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        Staff Engineer — Platform
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1188
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Blue}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="In Progress"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Remote</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">David Lee</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      54
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">32 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={88} variant="compact" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{ cursor: 'pointer' }} tabIndex={0}>
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        PM — Recruiting Experiences
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1156
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Green}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Open"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">New York, NY</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Jamie Park</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      89
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">12 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={91} variant="compact" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </Box>
      );
    }
    if (hubTab === 'job-reqs') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="m" flexWrap="wrap" gap="m">
            <Box>
              <Heading size="large" marginBottom="xs">
                Job requisitions
              </Heading>
              <BodyText size="small" color={colors.blackPepper500}>
                All requisitions in your scope. Click row to view candidates and req details.
              </BodyText>
            </Box>
            <Flex gap="s" flexWrap="wrap">
              <PrimaryButton>Create Requisition</PrimaryButton>
              <SecondaryButton>Export</SecondaryButton>
            </Flex>
          </Flex>

          <Flex gap="s" marginBottom="m" flexWrap="wrap">
            {[
              { id: 'all', label: 'All', count: 38, active: true },
              { id: 'open', label: 'Open', count: 32, active: false },
              { id: 'draft', label: 'Draft', count: 4, active: false },
              { id: 'closed', label: 'Closed', count: 2, active: false },
            ].map((p) => (
              <FilterPill
                key={p.id}
                id={p.id}
                label={p.label}
                count={p.count}
                active={p.active}
              />
            ))}
          </Flex>

          <Box
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Requisition</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Hiring Manager</Table.Header>
                  <Table.Header>Location</Table.Header>
                  <Table.Header>Target Start</Table.Header>
                  <Table.Header>Candidates</Table.Header>
                  <Table.Header>Days Open</Table.Header>
                  <Table.Header>Top Score</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row
                  style={{ cursor: 'pointer' }}
                  onClick={() => setHubTab('candidates')}
                  tabIndex={0}
                  aria-label="Open Senior Product Manager requisition details"
                >
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        Senior Product Manager
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1234
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Green}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Open"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Sarah Chen</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">San Francisco, CA</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">June 2026</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      127
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">18 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={94} variant="compact" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{ cursor: 'pointer' }} tabIndex={0}>
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        Staff Engineer — Platform
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1188
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Blue}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="In Progress"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">David Lee</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Remote</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">May 2026</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      54
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">32 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={88} variant="compact" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{ cursor: 'pointer' }} tabIndex={0}>
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        PM — Recruiting Experiences
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1156
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Green}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Open"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Jamie Park</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">New York, NY</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">July 2026</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      89
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">12 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <HiredScoreGrading fit={91} variant="compact" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{ cursor: 'pointer' }} tabIndex={0}>
                  <Table.Cell>
                    <Flex flexDirection="column" gap="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        Senior UX Designer
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                        REQ-2024-1089
                      </BodyText>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicatorType.Orange}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Draft"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Alex Morgan</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">San Francisco, CA</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">TBD</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      0
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">5 days</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" color={colors.blackPepper400}>
                      —
                    </BodyText>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </Box>
      );
    }
    if (hubTab === 'reports') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="m" flexWrap="wrap" gap="m">
            <Box>
              <Heading size="large" marginBottom="xs">
                Reports
              </Heading>
              <BodyText size="small" color={colors.blackPepper500}>
                Pipeline analytics, source effectiveness, and HiredScore distribution. Export or schedule for leadership readouts.
              </BodyText>
            </Box>
            <SecondaryButton>Schedule Report</SecondaryButton>
          </Flex>

          <Heading size="small" marginBottom="m" marginTop="xl">
            Pipeline reports
          </Heading>
          <Flex gap="m" flexWrap="wrap" marginBottom="xl">
            {[
              {
                name: 'Pipeline Velocity',
                desc: 'Time-in-stage analysis across all active reqs',
                lastRun: '30 March 2026',
                metrics: '8.2 days avg',
              },
              {
                name: 'Source Attribution',
                desc: 'Candidate sources by volume and quality',
                lastRun: '29 March 2026',
                metrics: 'LinkedIn 42%, Referrals 28%',
              },
              {
                name: 'Interview Conversion',
                desc: 'Phone screen → Offer conversion rates',
                lastRun: '30 March 2026',
                metrics: '34% conversion',
              },
            ].map((r) => (
              <ReportCard
                key={r.name}
                name={r.name}
                description={r.desc}
                lastRun={r.lastRun}
                keyMetric={r.metrics}
                actionLabel="Run Report"
              />
            ))}
          </Flex>

          <Heading size="small" marginBottom="m">
            HiredScore analytics
          </Heading>
          <Flex gap="m" flexWrap="wrap" marginBottom="xl">
            <Box
              flex="1 1 450px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Heading size="small" marginBottom="m">
                Score Distribution
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
                Active candidates by HiredScore grade across all your requisitions.
              </BodyText>
              <Flex flexDirection="column" gap="m">
                {[
                  { grade: 'A', label: 'Strong Fit (85-100%)', count: 45, pct: 36, color: colors.greenApple600 },
                  { grade: 'B', label: 'Good Fit (70-84%)', count: 38, pct: 30, color: colors.blueberry500 },
                  { grade: 'C', label: 'Moderate Fit (55-69%)', count: 28, pct: 22, color: colors.cantaloupe600 },
                  { grade: 'D', label: 'Developing Fit (0-54%)', count: 16, pct: 13, color: colors.soap400 },
                ].map((g) => (
                  <ProgressBarWithBadge
                    key={g.grade}
                    badge={g.grade}
                    label={g.label}
                    count={g.count}
                    total={127}
                    color={g.color}
                    ariaLabel={`${g.label}: ${g.count} candidates`}
                  />
                ))}
              </Flex>
            </Box>

            <Box
              flex="1 1 350px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Heading size="small" marginBottom="m">
                Recent Exports
              </Heading>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
                Your exported reports and scheduled deliveries. Downloads are available for 30 days.
              </BodyText>
              <Flex flexDirection="column" gap="m">
                {[
                  { name: 'Pipeline Summary Q1 2026', date: '29 March 2026, 08:15', size: '2.4 MB', format: 'XLSX' },
                  { name: 'Source Attribution - March', date: '28 March 2026, 14:30', size: '1.8 MB', format: 'PDF' },
                  { name: 'Interview Schedule - Week 13', date: '25 March 2026, 09:00', size: '856 KB', format: 'CSV' },
                ].map((e, idx) => (
                  <ListItemCard
                    key={idx}
                    title={e.name}
                    metadata={[e.date, `${e.size} · ${e.format}`]}
                    trailingElement={<TertiaryButton size="small">Download</TertiaryButton>}
                  />
                ))}
              </Flex>
            </Box>
          </Flex>

          <Heading size="small" marginBottom="m">
            Scheduled Reports
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
            Automated weekly and monthly reports sent to stakeholders. Manage schedules and recipients.
          </BodyText>
          <Box
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Report Name</Table.Header>
                  <Table.Header>Frequency</Table.Header>
                  <Table.Header>Recipients</Table.Header>
                  <Table.Header>Next Run</Table.Header>
                  <Table.Header>Status</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {[
                  {
                    name: 'Weekly Pipeline Summary',
                    freq: 'Every Monday, 06:00',
                    recip: 'Sarah Chen, David Lee',
                    next: '1 April 2026',
                    status: 'Active',
                  },
                  {
                    name: 'Monthly Source Effectiveness',
                    freq: 'First day of month, 08:00',
                    recip: 'Jamie Park, Alex Morgan, Leadership',
                    next: '1 April 2026',
                    status: 'Active',
                  },
                  {
                    name: 'Q1 Executive Readout',
                    freq: 'End of quarter',
                    recip: 'VP Talent, Finance',
                    next: '30 June 2026',
                    status: 'Scheduled',
                  },
                ].map((sr, idx) => (
                  <Table.Row key={idx} style={{ cursor: 'pointer' }} tabIndex={0}>
                    <Table.Cell>
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        {sr.name}
                      </BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">{sr.freq}</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small" color={colors.blackPepper500}>
                        {sr.recip}
                      </BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">{sr.next}</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusIndicator
                        type={
                          sr.status === 'Active'
                            ? StatusIndicatorType.Green
                            : StatusIndicatorType.Blue
                        }
                        emphasis={StatusIndicatorEmphasis.Low}
                        label={sr.status}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box>
        </Box>
      );
    }
    return null;
  };

  const reqDetailMain = (
    <>
      <Box
        padding="l"
        style={{
          backgroundColor: colors.frenchVanilla100,
          borderBottom: `1px solid ${colors.soap300}`,
        }}
      >
        <Flex alignItems="center" gap="s" flexWrap="wrap">
          <Heading size="large" style={{ margin: 0 }}>
            Senior Product Manager
          </Heading>
          <StatusIndicator
            type={StatusIndicatorType.Green}
            emphasis={StatusIndicatorEmphasis.Low}
            label="Open"
          />
        </Flex>
        <Flex gap="l" marginTop="s" flexWrap="wrap">
          <BodyText size="small" color={colors.blackPepper500}>
            <strong style={{ color: colors.blackPepper600 }}>ID:</strong> REQ-2024-1234
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            <strong style={{ color: colors.blackPepper600 }}>Location:</strong> San Francisco, CA
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            <strong style={{ color: colors.blackPepper600 }}>Hiring manager:</strong> Sarah Chen
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            <strong style={{ color: colors.blackPepper600 }}>Recruiter:</strong> Alex Morgan
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            <strong style={{ color: colors.blackPepper600 }}>Target start:</strong> June 2026
          </BodyText>
        </Flex>
        <Flex marginTop="m" gap="xs" role="tablist" aria-label="Requisition" flexWrap="wrap">
          {(
            [
              { id: 'candidates', label: 'Candidates' },
              { id: 'details', label: 'Details' },
              { id: 'team', label: 'Team' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={reqTab === t.id}
              id={`req-tab-${t.id}`}
              onClick={() => setReqTab(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${reqTab === t.id ? SANA_LINK_ACCENT : colors.soap300}`,
                backgroundColor: reqTab === t.id ? colors.soap100 : 'transparent',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: reqTab === t.id ? 600 : 400,
                color: colors.blackPepper600,
              }}
            >
              {t.label}
            </button>
          ))}
        </Flex>
      </Box>

      {reqTab === 'details' && (
        <Box padding="l" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
          <CardSection title="Requisition details">
            <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
              Full-time product leadership role owning roadmap for recruiter-facing workflows, partnering with design and engineering on Canvas Kit–based experiences.
            </BodyText>
            <BodyText size="small" color={colors.blackPepper500}>
              Posting refreshed 12 March 2026 · Compensation band IC4–IC5 · Travel up to 15%.
            </BodyText>
          </CardSection>
        </Box>
      )}

      {reqTab === 'team' && (
        <Box padding="l" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
          <CardSection title="Hiring team">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Name</Table.Header>
                  <Table.Header>Role</Table.Header>
                  <Table.Header>Notifications</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      Sarah Chen
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Hiring manager</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">On</BodyText>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      Alex Morgan
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Recruiter</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">On</BodyText>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </CardSection>
        </Box>
      )}

      {reqTab === 'candidates' && (
        <>
          <Flex
            paddingX="l"
            paddingY="m"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="m"
            style={{ backgroundColor: SANA_PAGE_CANVAS }}
          >
            <Heading size="medium" style={{ margin: 0 }}>
              Active Candidates
            </Heading>
            <Flex gap="s" flexWrap="wrap">
              <ToolbarIconButton
                icon={filterIcon}
                aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
                onClick={() => setFiltersOpen((prev) => !prev)}
                aria-pressed={filtersOpen}
                toggled={filtersOpen}
              />
              <PrimaryButton>Add Candidate</PrimaryButton>
              <SecondaryButton>Export</SecondaryButton>
              <SecondaryButton>Settings</SecondaryButton>
            </Flex>
          </Flex>

          <Box paddingX="l" paddingBottom="m" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
            <Flex gap="s" flexWrap="wrap">
              {PIPELINE_STAGES.map((s) => {
                const pct = Math.round((s.count / TOTAL_PIPELINE) * 100);
                return (
                  <Box
                    key={s.name}
                    flex={1}
                    padding="m"
                    style={{
                      minWidth: 140,
                      backgroundColor: colors.frenchVanilla100,
                      borderRadius: SANA_CARD_RADIUS_LG,
                      border: `1px solid ${colors.soap300}`,
                    }}
                  >
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      {s.name}
                    </BodyText>
                    <Heading size="large" marginTop="xs" style={{ marginBottom: space.xs }}>
                      {s.count}
                    </Heading>
                    <Box
                      role="progressbar"
                      aria-valuenow={s.count}
                      aria-valuemin={0}
                      aria-valuemax={TOTAL_PIPELINE}
                      aria-label={`${s.name}: ${s.count} of ${TOTAL_PIPELINE} candidates in pipeline`}
                      style={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.soap300,
                        overflow: 'hidden',
                      }}
                    >
                      <Box style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.blueberry400 }} />
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          </Box>

          <Flex
            flex={1}
            minHeight={0}
            alignItems="stretch"
            style={{ backgroundColor: SANA_PAGE_CANVAS, minWidth: 0 }}
          >
            <Box flex={1} minWidth={0} padding="l" style={{ display: 'flex', flexDirection: 'column' }}>
              <Flex gap="s" marginBottom="m" flexWrap="wrap" role="tablist" aria-label="Quick views">
                {(
                  [
                    { id: 'all' as const, label: 'All Active (127)' },
                    { id: 'new' as const, label: 'New Today (12)' },
                    { id: 'high' as const, label: 'High Score (A–B) (45)' },
                    { id: 'review' as const, label: 'Needs Review (23)' },
                  ] as const
                ).map((p) => {
                  const active = savedPill === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setSavedPill(p.id);
                        setPage(1);
                      }}
                      style={{
                        borderRadius: 999,
                        border: `1px solid ${active ? SANA_LINK_ACCENT : colors.soap300}`,
                        backgroundColor: active ? colors.soap100 : colors.frenchVanilla100,
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        color: colors.blackPepper600,
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </Flex>

              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0,0,0,0)',
                  border: 0,
                }}
              >
                {selected.size > 0 ? `${selected.size} selected` : ''}
              </div>

              {selected.size > 0 && (
                <Box
                  padding="m"
                  marginBottom="m"
                  style={{
                    backgroundColor: colors.blueberry100,
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                  }}
                >
                  <Flex alignItems="center" gap="m" flexWrap="wrap">
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      {selected.size} selected
                    </BodyText>
                    <SecondaryButton size="small">Move to Stage</SecondaryButton>
                    <SecondaryButton size="small">Send Message</SecondaryButton>
                    <SecondaryButton size="small">Export</SecondaryButton>
                    <TertiaryButton size="small" onClick={() => setSelected(new Set())}>
                      Deselect All
                    </TertiaryButton>
                  </Flex>
                </Box>
              )}

              <Box
                flex={1}
                minHeight={0}
                style={{
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: `1px solid ${colors.soap300}`,
                  overflow: 'auto',
                  backgroundColor: colors.frenchVanilla100,
                }}
              >
                {sorted.length === 0 ? (
                  <Box padding="xxl" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                    <Heading size="small" marginBottom="s">
                      No matching candidates
                    </Heading>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {MOCK_CANDIDATES.length === 0
                        ? 'No candidates have applied to this requisition yet. Post your job to career sites to start attracting candidates.'
                        : 'No candidates match your current filters. Try clearing filters or broadening your search criteria.'}
                    </BodyText>
                    <Box marginTop="m">
                      <SecondaryButton onClick={clearFilters}>Clear filters</SecondaryButton>
                    </Box>
                  </Box>
                ) : (
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header scope="col">
                          <Checkbox
                            checked={allPageSelected}
                            indeterminate={somePageSelected}
                            onChange={() => toggleSelectAllPage()}
                            aria-label="Select all candidates on this page"
                          />
                        </Table.Header>
                        <SortableHeader
                          label="Name"
                          sortKey="name"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                        />
                        <SortableHeader
                          label="HiredScore"
                          sortKey="fit"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                          extra={
                            captureMode === 'tooltip' ? (
                              <Flex flexDirection="column" alignItems="flex-start" gap="xxs">
                                <ToolbarIconButton
                                  icon={questionOutlineIcon}
                                  aria-label="About HiredScore"
                                />
                                <Box
                                  padding="s"
                                  style={{
                                    maxWidth: 280,
                                    backgroundColor: colors.frenchVanilla100,
                                    border: `1px solid ${colors.soap300}`,
                                    borderRadius: 8,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                  }}
                                >
                                  <BodyText size="small">{HIRED_SCORE_HEADER_TOOLTIP}</BodyText>
                                </Box>
                              </Flex>
                            ) : (
                              <Tooltip title={HIRED_SCORE_HEADER_TOOLTIP} type="description" placement="top">
                                <ToolbarIconButton
                                  icon={questionOutlineIcon}
                                  aria-label="About HiredScore"
                                />
                              </Tooltip>
                            )
                          }
                        />
                        <SortableHeader
                          label="Location"
                          sortKey="location"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                        />
                        <SortableHeader
                          label="Source"
                          sortKey="source"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                        />
                        <SortableHeader
                          label="Stage"
                          sortKey="stage"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                        />
                        <SortableHeader
                          label="Applied"
                          sortKey="applied"
                          activeKey={sortKey}
                          direction={sortDir}
                          onSort={handleSort}
                        />
                        <Table.Header scope="col">Actions</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {pageRows.map((row, idx) => {
                        return (
                          <Table.Row
                            key={row.id}
                            tabIndex={0}
                            aria-label={`Candidate ${row.name}, ${row.stage}. Press Enter to open profile.`}
                            onClick={() => openProfile(row)}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openProfile(row);
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                            className="v84-cand-row"
                          >
                            <Table.Cell
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                checked={selected.has(row.id)}
                                onChange={(e) => {
                                  const ne = (e as React.ChangeEvent<HTMLInputElement>)
                                    .nativeEvent as MouseEvent;
                                  toggleRowSelect(row.id, idx, ne.shiftKey);
                                }}
                                aria-label={`Select ${row.name}`}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Flex flexDirection="column" gap="xxs">
                                <BodyText size="small" style={{ fontWeight: 700 }}>
                                  {row.name}
                                </BodyText>
                                <BodyText size="small" color={colors.blackPepper500}>
                                  {row.title}
                                </BodyText>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell onClick={(e) => e.stopPropagation()}>
                              <HiredScoreCell row={row} />
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{row.location}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <StatusIndicator
                                type={StatusIndicator.Type.Gray}
                                emphasis={StatusIndicator.Emphasis.Low}
                                label={row.source}
                              />
                            </Table.Cell>
                            <Table.Cell>{stageIndicator(row.stage)}</Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{row.appliedLabel}</BodyText>
                            </Table.Cell>
                            <Table.Cell onClick={(e) => e.stopPropagation()}>
                              <Menu>
                                <Menu.Target
                                  as={ToolbarIconButton}
                                  icon={relatedActionsVerticalIcon}
                                  aria-label={`Row actions for ${row.name}`}
                                  aria-haspopup="true"
                                />
                                <Menu.Popper>
                                  <Menu.Card>
                                    <Menu.List>
                                      <Menu.Item data-id="move-forward" onClick={() => {}}>
                                        Move Forward
                                      </Menu.Item>
                                      <Menu.Item data-id="schedule" onClick={() => {}}>
                                        Schedule Interview
                                      </Menu.Item>
                                      <Menu.Item data-id="message" onClick={() => {}}>
                                        Send Message
                                      </Menu.Item>
                                      <Menu.Divider />
                                      <Menu.Item data-id="reject" onClick={() => {}}>
                                        Reject
                                      </Menu.Item>
                                    </Menu.List>
                                  </Menu.Card>
                                </Menu.Popper>
                              </Menu>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                )}
              </Box>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                marginTop="m"
                flexWrap="wrap"
                gap="m"
              >
                <BodyText size="small" color={colors.blackPepper500}>
                  Showing {(pageSafe - 1) * pageSize + 1}-
                  {(pageSafe - 1) * pageSize + pageRows.length} of {sorted.length} candidates
                </BodyText>
                <Flex gap="xs" alignItems="center" flexWrap="wrap">
                  <SecondaryButton
                    size="small"
                    disabled={pageSafe <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    Previous
                  </SecondaryButton>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <SecondaryButton
                      key={n}
                      size="small"
                      onClick={() => setPage(n)}
                      aria-label={`Go to page ${n}`}
                      aria-current={n === pageSafe ? 'page' : undefined}
                      style={
                        n === pageSafe
                          ? { boxShadow: `0 0 0 2px ${SANA_LINK_ACCENT}` }
                          : undefined
                      }
                    >
                      {n}
                    </SecondaryButton>
                  ))}
                  <SecondaryButton
                    size="small"
                    disabled={pageSafe >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    Next
                  </SecondaryButton>
                </Flex>
              </Flex>

              <BodyText size="small" color={colors.blackPepper500} marginTop="xl">
                Prototype uses illustrative candidate data for layout and interaction review.
              </BodyText>
            </Box>

            {filtersOpen && (
              <Box
                as="aside"
                aria-label="Candidate filters"
                width={300}
                flexShrink={0}
                padding="m"
                style={{
                  backgroundColor: colors.frenchVanilla100,
                  borderLeft: `1px solid ${colors.soap300}`,
                  overflowY: 'auto',
                }}
              >
                <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                  <Heading size="small">Filters</Heading>
                  <TertiaryButton size="small" onClick={clearFilters}>
                    Clear All
                  </TertiaryButton>
                </Flex>

                <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: space.l }}>
                  <legend>
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      Saved views
                    </BodyText>
                  </legend>
                  <Box marginTop="s">
                    <Checkbox
                      checked={savedViewPicks.top}
                      onChange={(e) => {
                        setSavedViewPicks((p) => ({ ...p, top: e.target.checked }));
                        setPage(1);
                      }}
                      label="My Top Picks"
                    />
                  </Box>
                  <Box marginTop="xs">
                    <Checkbox
                      checked={savedViewPicks.today}
                      onChange={(e) => {
                        setSavedViewPicks((p) => ({ ...p, today: e.target.checked }));
                        setPage(1);
                      }}
                      label="New Today"
                    />
                  </Box>
                  <Box marginTop="xs">
                    <Checkbox
                      checked={savedViewPicks.review}
                      onChange={(e) => {
                        setSavedViewPicks((p) => ({ ...p, review: e.target.checked }));
                        setPage(1);
                      }}
                      label="Needs Review"
                    />
                  </Box>
                </fieldset>

                <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: space.l }}>
                  <legend>
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      HiredScore grade
                    </BodyText>
                  </legend>
                  <Box marginTop="s">
                    {HIRED_SCORE_FILTERS.map((g) => (
                      <Box key={g.id} marginTop="xs">
                        <Checkbox
                          checked={gradeFilters.has(g.id)}
                          onChange={() => {
                            toggleGrade(g.id);
                          }}
                          label={g.label}
                        />
                      </Box>
                    ))}
                  </Box>
                </fieldset>

                <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: space.l }}>
                  <legend>
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      Stage
                    </BodyText>
                  </legend>
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xs" marginBottom="s">
                    Select stages to show only candidates at those pipeline steps.
                  </BodyText>
                  {STAGE_FILTERS.map((st) => (
                    <Box key={st} marginTop="xs">
                      <Checkbox
                        checked={stageFilters.has(st)}
                        onChange={() => {
                          toggleStage(st);
                        }}
                        label={st}
                      />
                    </Box>
                  ))}
                </fieldset>

                <Box marginBottom="l">
                  <FormSelect
                    id="v84-source"
                    label="Source"
                    value={sourceFilter}
                    onChange={(v) => {
                      setSourceFilter(v);
                      setPage(1);
                    }}
                    options={[
                      { value: 'all', label: 'All Sources' },
                      { value: 'LinkedIn', label: 'LinkedIn' },
                      { value: 'Career site', label: 'Career site' },
                      { value: 'Employee referral', label: 'Employee referral' },
                      { value: 'Agency', label: 'Agency' },
                      { value: 'Indeed', label: 'Indeed' },
                    ]}
                  />
                </Box>
                <FormSelect
                  id="v84-location"
                  label="Location"
                  value={locationFilter}
                  onChange={(v) => {
                    setLocationFilter(v);
                    setPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'All Locations' },
                    { value: 'sf', label: 'San Francisco, CA' },
                    { value: 'ny', label: 'New York, NY' },
                    { value: 'remote', label: 'Remote' },
                  ]}
                />
              </Box>
            )}
          </Flex>
        </>
      )}
    </>
  );

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <style>{`
        .v84-cand-row:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px ${SANA_LINK_ACCENT};
        }
        .ck-sort-header:focus-visible {
          outline: 2px solid ${SANA_LINK_ACCENT};
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>

      <WorkdayTopNav
        searchPlaceholder="Search candidates, jobs, people..."
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={3}
        inboxBadge={12}
      />

      <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          secondaryTitle="Senior Product Manager"
          secondarySubtitle="REQ-2024-1234 · Open"
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={setHubTab}
          fillHeight
        />

        <Box flex={1} minWidth={0} style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {hubTab === 'candidates' ? (
            <>
              <Heading
                as="h1"
                size="large"
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0,0,0,0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                Senior Product Manager - Candidates
              </Heading>
              {reqDetailMain}
            </>
          ) : (
            hubMain()
          )}
        </Box>
      </Flex>

      <Modal model={modal}>
        <Modal.Overlay style={{ zIndex: 1000 }}>
          <Modal.Card
            style={{
              maxWidth: 560,
              maxHeight: '80vh',
              overflow: 'auto',
              borderRadius: SANA_CARD_RADIUS_LG,
            }}
          >
            <Modal.CloseIcon aria-label="Close profile" />
            <Modal.Heading>Candidate profile</Modal.Heading>
            <Modal.Body>
              {profileCandidate ? (
                <>
                  <Heading size="small" marginBottom="s">
                    {profileCandidate.name}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                    {profileCandidate.title} · {profileCandidate.location}
                  </BodyText>
                  <HiredScoreGrading fit={profileCandidate.fit} variant="full" />
                  <Box marginTop="m">
                    <BodyText size="small">{stageIndicator(profileCandidate.stage)}</BodyText>
                  </Box>
                </>
              ) : (
                <BodyText size="small">No candidate selected.</BodyText>
              )}
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </Box>
  );
};

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      padding="l"
      style={{
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        marginBottom: space.m,
      }}
    >
      <Heading size="small" marginBottom="m">
        {title}
      </Heading>
      {children}
    </Box>
  );
}

export default GccCandidateGridSearch;
