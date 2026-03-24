/**
 * Unified candidate review surface (v57)
 *
 * Mission: GCC-E2E-017 · Step 8 (**320**)
 * Discovery Brief: design/gcc-unified-candidate-review-v57-discovery-brief.md
 * PRD: docs/prds/gcc-unified-candidate-review-prd.md
 *
 * Sana shell, high-density single surface, mandatory HiredScore spotlight region,
 * CV-dominant column, Summary / Activity / Notes, RTL demo toggle, CommunicationDock.
 */

import { useCallback, useMemo, useState, type ChangeEvent, type CSSProperties } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Table } from '@workday/canvas-kit-react/table';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { mailIcon } from '@workday/canvas-system-icons-web';

import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
  CommunicationDock,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  FormSelect,
  SanaCommComposer,
  SanaCommMessageBubble,
} from './components';

// -----------------------------------------------------------------------------
// Approved copy (319) — implement exactly
// -----------------------------------------------------------------------------
const COPY = {
  prevCandidate: 'Previous candidate',
  nextCandidate: 'Next candidate',
  backToList: 'Back to candidate list',
  openFullProfile: 'Open full profile',
  addNote: 'Add note',
  saveNote: 'Save note',
  cancel: 'Cancel',
  download: 'Download',
  showDetails: 'Show details',
  hideDetails: 'Hide details',
  aboutInsight: 'About this insight',
  aboutHS: 'About HiredScore insights',
  showMoreActivity: 'Show more activity',
  updateIntegration: 'Update integration',
  spotlightTitle: 'Prioritisation insight',
  summary: 'Summary',
  cv: 'CV',
  activity: 'Activity',
  notes: 'Notes',
  noteType: 'Note type',
  noteLabel: 'Note',
  noteHint: 'Add context for the hiring team.',
  noteTypeHint: 'Filter notes by type.',
  positionOf: (n: number, total: number) => `${n} of ${total} candidates`,
  hsDisclaimer: 'This insight is advisory. It doesn’t replace your judgement.',
  hsAiShort: 'This insight uses assisted matching. You make the final hiring decision.',
  hsUnavailableHeading: 'Prioritisation insights unavailable',
  hsUnavailableBody:
    'HiredScore isn’t activated for your organisation, or insights aren’t available for this candidate.',
  hsBelowMinHeading: 'Insights temporarily unavailable',
  hsBelowMinBody: 'Update your HiredScore integration to see prioritisation insights here.',
  noPreviewHeading: 'No preview available',
  noPreviewBody: 'Download the file to view this CV.',
  noActivityHeading: 'No activity yet',
  noActivityBody: 'Events appear as the candidate moves through the pipeline.',
  noNotesHeading: 'No notes yet',
  noNotesBody: 'Add a note to record your decision for this job requisition.',
  noteBlocked:
    'You can’t add a note at this stage. Open the candidate’s full profile or contact your administrator to adjust the process.',
  noteSaved: 'Note saved',
  expandAria: 'Show insight details',
  pipelineReady: 'Ready for review',
} as const;

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'dashboard', label: 'Dashboard' },
] as const;

const MOCK_REQ = {
  id: 'R-2026-7712',
  title: 'Principal security engineer — GCC nationalisation programme',
  location: 'Riyadh, KSA · Hybrid',
};

type HiredScoreDemo = 'active' | 'off' | 'belowMin';

type CandidateRow = {
  id: string;
  preferredName: string;
  jobPostingTitle: string;
  stage: string;
  source: string;
  applied: string;
  fitSnippet: string;
  hasParseableCv: boolean;
};

const MOCK_CANDIDATES: CandidateRow[] = [
  {
    id: 'c1',
    preferredName: 'Sara Al-Mansoori',
    jobPostingTitle: 'Principal security engineer — GCC nationalisation programme',
    stage: 'Screen',
    source: 'Career site',
    applied: '2026-03-20',
    fitSnippet: 'Strong alignment on cloud security certifications and GCC clearance language.',
    hasParseableCv: true,
  },
  {
    id: 'c2',
    preferredName: 'محمد العتيبي',
    jobPostingTitle: 'Principal security engineer — GCC nationalisation programme',
    stage: 'Review',
    source: 'Referral',
    applied: '2026-03-19',
    fitSnippet: 'Relevant SOC experience; review visa sponsorship notes in full profile.',
    hasParseableCv: true,
  },
  {
    id: 'c3',
    preferredName: 'Priya Nair',
    jobPostingTitle: 'Principal security engineer — GCC nationalisation programme',
    stage: 'Interview',
    source: 'LinkedIn',
    applied: '2026-03-18',
    fitSnippet: 'High signal on zero-trust architecture; confirm availability for Riyadh onsite.',
    hasParseableCv: false,
  },
];

const MOCK_REQ_TABLE = [
  { id: 'R-2026-7712', title: MOCK_REQ.title, loc: MOCK_REQ.location, cand: 128, status: 'Screen' },
  { id: 'R-2026-7601', title: 'Senior TA partner — Technology', loc: 'Dubai, UAE', cand: 56, status: 'Interview' },
  { id: 'R-2026-7400', title: 'Graduate programme — Engineering', loc: 'Remote — GCC', cand: 201, status: 'Approved' },
];

function formatApplied(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StagePill({ stage }: { stage: string }) {
  const { bg, fg } = (() => {
    switch (stage) {
      case 'Interview':
        return { bg: colors.greenApple100, fg: colors.greenApple600 };
      case 'Screen':
        return { bg: colors.soap200, fg: colors.blueberry600 };
      case 'Review':
        return { bg: colors.cantaloupe100, fg: colors.cantaloupe600 };
      default:
        return { bg: colors.soap100, fg: colors.blackPepper600 };
    }
  })();
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
}

function cardChrome(extra?: CSSProperties): CSSProperties {
  return {
    borderRadius: SANA_CARD_RADIUS_LG,
    border: `1px solid ${colors.soap300}`,
    backgroundColor: colors.frenchVanilla100,
    boxShadow: SANA_CARD_SHADOW,
    ...extra,
  };
}

function HiredScoreSpotlight({
  state,
  expanded,
  onToggleExpand,
}: {
  state: HiredScoreDemo;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const accentBorder = `4px solid ${colors.soap400}`;

  if (state === 'off') {
    return (
      <Card padding="l" style={{ ...cardChrome({ borderLeft: accentBorder }) }}>
        <Heading size="small" marginBottom="s">
          {COPY.hsUnavailableHeading}
        </Heading>
        <BodyText size="small" color={colors.blackPepper500}>
          {COPY.hsUnavailableBody}
        </BodyText>
      </Card>
    );
  }

  if (state === 'belowMin') {
    return (
      <Card padding="l" style={{ ...cardChrome({ borderLeft: accentBorder }) }}>
        <Heading size="small" marginBottom="s">
          {COPY.hsBelowMinHeading}
        </Heading>
        <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
          {COPY.hsBelowMinBody}
        </BodyText>
        <SecondaryButton size="small">{COPY.updateIntegration}</SecondaryButton>
      </Card>
    );
  }

  return (
    <Card padding="l" style={{ ...cardChrome({ borderLeft: `4px solid ${SANA_LINK_ACCENT}` }) }}>
      <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m">
        <Box flex="1 1 240px" minWidth={0}>
          <Heading size="small" marginBottom="xs">
            {COPY.spotlightTitle}
          </Heading>
          <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
            Recommended priority: <strong>High</strong> for this requisition based on skills match and recency of
            application.
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            {COPY.hsDisclaimer}
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            {COPY.hsAiShort}
          </BodyText>
        </Box>
        <Flex gap="s" flexWrap="wrap" alignItems="center">
          <TertiaryButton size="small">{COPY.aboutInsight}</TertiaryButton>
          <TertiaryButton size="small">{COPY.aboutHS}</TertiaryButton>
          <TertiaryButton size="small" onClick={onToggleExpand} aria-label={COPY.expandAria}>
            {expanded ? COPY.hideDetails : COPY.showDetails}
          </TertiaryButton>
        </Flex>
      </Flex>
      {expanded ? (
        <Box
          marginTop="m"
          paddingTop="m"
          style={{ borderTop: `1px solid ${colors.soap300}` }}
        >
          <Flex gap="l" flexWrap="wrap">
            <Box>
              <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                Match dimensions
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                Role fit · Skills · Seniority · Location
              </BodyText>
            </Box>
            <Box>
              <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                Last model refresh
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                18 March 2026 (illustrative)
              </BodyText>
            </Box>
          </Flex>
        </Box>
      ) : null}
    </Card>
  );
}

export const GccUnifiedCandidateReviewV57 = () => {
  const [hubTab, setHubTab] = useState<string>('candidates');
  const [topSearch, setTopSearch] = useState('');
  const [unifiedMode, setUnifiedMode] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [commExpanded, setCommExpanded] = useState(false);
  const [spotlightExpanded, setSpotlightExpanded] = useState(true);
  const [hsDemo, setHsDemo] = useState<HiredScoreDemo>('active');
  const [rtlDemo, setRtlDemo] = useState(false);
  const [noteType, setNoteType] = useState('all');
  const [noteDraft, setNoteDraft] = useState('');
  const [notesBlockedDemo, setNotesBlockedDemo] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState<string | null>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailDraft, setEmailDraft] = useState('');

  const total = MOCK_CANDIDATES.length;
  const candidate = MOCK_CANDIDATES[candidateIndex];

  const toggleSelect = useCallback((id: string, on: boolean) => {
    setSelectedIds((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));
  }, []);

  const toggleSelectAll = useCallback(
    (rows: CandidateRow[]) => {
      if (selectedIds.length === rows.length) setSelectedIds([]);
      else setSelectedIds(rows.map((r) => r.id));
    },
    [selectedIds.length]
  );

  const openUnifiedAt = useCallback((index: number) => {
    setCandidateIndex(index);
    setUnifiedMode(true);
    setNoteFeedback(null);
  }, []);

  const goPrev = useCallback(() => {
    setCandidateIndex((i) => Math.max(0, i - 1));
    setNoteFeedback(null);
  }, []);

  const goNext = useCallback(() => {
    setCandidateIndex((i) => Math.min(total - 1, i + 1));
    setNoteFeedback(null);
  }, [total]);

  const mockNotes = useMemo(
    () => [
      { id: 'n1', type: 'Recruiter', who: 'You', when: '20 March 2026, 09:12', text: 'Strong written communication in screening answers.' },
      { id: 'n2', type: 'Hiring manager', who: 'A. Rahman', when: '19 March 2026, 16:40', text: 'Please confirm willingness to relocate within 90 days.' },
    ],
    []
  );

  const timelineRows = useMemo(
    () => [
      { t: 'Applied', d: '20 March 2026', m: 'Career site submission' },
      { t: 'Moved to Screen', d: '20 March 2026', m: 'Recruiter triage' },
      { t: 'Email sent', d: '19 March 2026', m: 'Invitation to complete pre-screen' },
      { t: 'Profile updated', d: '18 March 2026', m: 'Candidate edited phone number' },
      { t: 'Duplicate check', d: '18 March 2026', m: 'No duplicate merged' },
    ],
    []
  );

  const visibleTimeline = timelineExpanded ? timelineRows : timelineRows.slice(0, 3);

  const handleAddNote = () => {
    if (notesBlockedDemo) return;
    if (!noteDraft.trim()) return;
    setNoteFeedback(COPY.noteSaved);
    setNoteDraft('');
    window.setTimeout(() => setNoteFeedback(null), 4000);
  };

  const innerDir = rtlDemo ? 'rtl' : 'ltr';

  const shellMain = (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS, overflowX: 'hidden' }}>
      <WorkdayTopNav
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        showWMark
        showMenuWordmark={false}
        notificationBadge={3}
        inboxBadge={12}
      />
      <Flex
        alignItems="stretch"
        style={{
          minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
          overflow: 'hidden',
        }}
      >
        <WorkdayLeftTabBar
          showSecondaryTitleIcon
          secondaryTitle="Job requisitions"
          secondarySubtitle="Recruiter Hub"
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={setHubTab}
        />
        <Box flex={1} minWidth={0} style={{ overflow: 'auto', backgroundColor: SANA_PAGE_CANVAS }}>
          <Box
            style={{
              margin: space.l,
              borderRadius: SANA_SHELL_RADIUS,
              backgroundColor: colors.frenchVanilla100,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              minHeight: `calc(100% - ${space.l} * 2)`,
            }}
          >
            <Box padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              <BodyText size="small" color={colors.blackPepper500}>
                Unified candidate review (v57, GCC-E2E-017). Illustrative data. Use the RTL toggle to validate
                mirrored layout for Arabic recruiter shell testing.
              </BodyText>
            </Box>

            {hubTab === 'overview' && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  Requisition overview
                </Heading>
                <Card padding="l" style={cardChrome()}>
                  <Heading size="small" marginBottom="s">
                    {MOCK_REQ.title}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                    {MOCK_REQ.id} · {MOCK_REQ.location}
                  </BodyText>
                  <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xs">
                    Hiring team
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                    Recruiter: You · HM: A. Rahman · Coordinator: L. Khan
                  </BodyText>
                  <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xs">
                    Key dates
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Opened 1 March 2026 · Target start 1 June 2026
                  </BodyText>
                </Card>
              </Box>
            )}

            {hubTab === 'requisitions' && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  Job requisitions
                </Heading>
                <Box style={{ overflowX: 'auto' }}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Requisition</Table.Header>
                        <Table.Header>Title</Table.Header>
                        <Table.Header>Location</Table.Header>
                        <Table.Header>Candidates</Table.Header>
                        <Table.Header>Status</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {MOCK_REQ_TABLE.map((r) => (
                        <Table.Row key={r.id}>
                          <Table.Cell>
                            <BodyText size="small">{r.id}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{r.title}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{r.loc}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{r.cand}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{r.status}</BodyText>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Box>
              </Box>
            )}

            {hubTab === 'dashboard' && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  Dashboard
                </Heading>
                <Flex gap="m" flexWrap="wrap">
                  {[
                    { label: 'Active reqs', value: '24', hint: 'Assigned to you' },
                    { label: 'Candidates in Screen', value: '312', hint: 'All assigned reqs' },
                    { label: 'Time to first touch (median)', value: '1.8 d', hint: 'Pilot tenants, illustrative' },
                  ].map((k) => (
                    <Card key={k.label} padding="l" style={{ ...cardChrome(), flex: '1 1 200px', minWidth: 180 }}>
                      <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
                        {k.label}
                      </BodyText>
                      <Heading size="large" marginBottom="xs">
                        {k.value}
                      </Heading>
                      <BodyText size="small" color={colors.blackPepper500}>
                        {k.hint}
                      </BodyText>
                    </Card>
                  ))}
                </Flex>
              </Box>
            )}

            {hubTab === 'candidates' && !unifiedMode && (
              <Box padding="l">
                <Heading size="large" marginBottom="m">
                  {MOCK_REQ.title}
                </Heading>
                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  {MOCK_REQ.id} · {MOCK_REQ.location}
                </BodyText>
                <Box style={{ overflowX: 'auto' }}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header scope="col" style={{ width: 44 }}>
                          <Checkbox
                            checked={selectedIds.length === MOCK_CANDIDATES.length && MOCK_CANDIDATES.length > 0}
                            onChange={() => toggleSelectAll(MOCK_CANDIDATES)}
                            aria-label="Select all candidates"
                          />
                        </Table.Header>
                        <Table.Header>Candidate</Table.Header>
                        <Table.Header>Stage</Table.Header>
                        <Table.Header>Applied</Table.Header>
                        <Table.Header>Source</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {MOCK_CANDIDATES.map((row, idx) => (
                        <Table.Row key={row.id}>
                          <Table.Cell>
                            <Checkbox
                              checked={selectedIds.includes(row.id)}
                              onChange={(e) => toggleSelect(row.id, e.target.checked)}
                              aria-label={`Select ${row.preferredName}`}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <TertiaryButton onClick={() => openUnifiedAt(idx)}>{row.preferredName}</TertiaryButton>
                          </Table.Cell>
                          <Table.Cell>
                            <StagePill stage={row.stage} />
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{formatApplied(row.applied)}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{row.source}</BodyText>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Box>
                <BodyText size="small" color={colors.blackPepper500} marginTop="m">
                  Open a candidate name to load the unified review surface (primary drill-in pattern).
                </BodyText>
              </Box>
            )}

            {hubTab === 'candidates' && unifiedMode && candidate && (
              <Box padding="l" dir={innerDir}>
                <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m" marginBottom="m">
                  <Box flex="1 1 280px" minWidth={0}>
                    <Heading size="large" marginBottom="xxs">
                      {candidate.preferredName}
                    </Heading>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
                      {candidate.jobPostingTitle} · {MOCK_REQ.id} · {MOCK_REQ.location}
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                      {COPY.positionOf(candidateIndex + 1, total)}
                    </BodyText>
                    <Flex gap="s" flexWrap="wrap" alignItems="center">
                      <StagePill stage={candidate.stage} />
                      <StatusIndicator
                        type={StatusIndicator.Type.Green}
                        emphasis={StatusIndicator.Emphasis.Low}
                        label={COPY.pipelineReady}
                      />
                    </Flex>
                  </Box>
                  <Flex gap="s" flexWrap="wrap" alignItems="center">
                    <SecondaryButton
                      size="small"
                      onClick={goPrev}
                      disabled={candidateIndex <= 0}
                      aria-label={COPY.prevCandidate}
                    >
                      {COPY.prevCandidate}
                    </SecondaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={goNext}
                      disabled={candidateIndex >= total - 1}
                      aria-label={COPY.nextCandidate}
                    >
                      {COPY.nextCandidate}
                    </SecondaryButton>
                    <SecondaryButton size="small" onClick={() => setUnifiedMode(false)}>
                      {COPY.backToList}
                    </SecondaryButton>
                    <TertiaryButton size="small">{COPY.openFullProfile}</TertiaryButton>
                    <TertiaryButton size="small" onClick={() => setRtlDemo((v) => !v)}>
                      {rtlDemo ? 'Preview: LTR' : 'Preview: RTL'}
                    </TertiaryButton>
                  </Flex>
                </Flex>

                <Flex gap="xs" flexWrap="wrap" marginBottom="m">
                  <BodyText size="small" color={colors.blackPepper500}>
                    Demo — HiredScore region:
                  </BodyText>
                  <TertiaryButton size="small" onClick={() => setHsDemo('active')}>
                    Active
                  </TertiaryButton>
                  <TertiaryButton size="small" onClick={() => setHsDemo('off')}>
                    Unavailable
                  </TertiaryButton>
                  <TertiaryButton size="small" onClick={() => setHsDemo('belowMin')}>
                    Below min version
                  </TertiaryButton>
                  <TertiaryButton size="small" onClick={() => setNotesBlockedDemo((b) => !b)}>
                    {notesBlockedDemo ? 'Notes: allowed' : 'Notes: blocked (demo)'}
                  </TertiaryButton>
                </Flex>

                <Box marginBottom="m">
                  <HiredScoreSpotlight
                    state={hsDemo}
                    expanded={spotlightExpanded}
                    onToggleExpand={() => setSpotlightExpanded((e) => !e)}
                  />
                </Box>

                {/* Row 1: Summary | CV (dominant); stacks on narrow viewports */}
                <Flex gap="m" alignItems="stretch" marginBottom="m" flexWrap="wrap">
                  <Box
                    style={{
                      flex: '1 1 300px',
                      minWidth: 260,
                      maxWidth: '100%',
                    }}
                  >
                    <Card padding="l" style={{ ...cardChrome(), height: '100%' }}>
                      <Heading size="small" marginBottom="m">
                        {COPY.summary}
                      </Heading>
                      <Box marginBottom="m">
                        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                          Fit snippet
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {candidate.fitSnippet}
                        </BodyText>
                      </Box>
                      <Box marginBottom="m">
                        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                          Status
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          Active on this requisition
                        </BodyText>
                      </Box>
                      <Box marginBottom="m">
                        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                          Source
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {candidate.source}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
                          Applied
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {formatApplied(candidate.applied)}
                        </BodyText>
                      </Box>
                    </Card>
                  </Box>
                  <Box style={{ flex: '2 1 420px', minWidth: 320, maxWidth: '100%' }}>
                    <Card padding="l" style={{ ...cardChrome(), height: '100%' }}>
                      <Flex justifyContent="space-between" alignItems="center" marginBottom="m" flexWrap="wrap" gap="s">
                        <Heading size="small">{COPY.cv}</Heading>
                        <SecondaryButton size="small">{COPY.download}</SecondaryButton>
                      </Flex>
                      {candidate.hasParseableCv ? (
                        <Box
                          style={{
                            minHeight: 420,
                            backgroundColor: colors.soap100,
                            borderRadius: 12,
                            border: `1px dashed ${colors.soap400}`,
                            padding: space.l,
                            overflow: 'auto',
                          }}
                        >
                          <BodyText size="small" color={colors.blackPepper600}>
                            [Mock CV] {candidate.preferredName} — experience, education, and certifications would
                            render in the embedded viewer. Primary scan target for triage.
                          </BodyText>
                        </Box>
                      ) : (
                        <Box padding="l" style={{ textAlign: 'center' }}>
                          <Heading size="small" marginBottom="s">
                            {COPY.noPreviewHeading}
                          </Heading>
                          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                            {COPY.noPreviewBody}
                          </BodyText>
                          <PrimaryButton size="small">{COPY.download}</PrimaryButton>
                        </Box>
                      )}
                    </Card>
                  </Box>
                </Flex>

                {/* Row 2: Notes | Activity */}
                <Flex gap="m" alignItems="stretch" flexWrap="wrap">
                  <Box style={{ flex: '1 1 300px', minWidth: 260, maxWidth: '100%' }}>
                    <Card padding="l" style={cardChrome()}>
                      <Heading size="small" marginBottom="m">
                        {COPY.notes}
                      </Heading>
                      <Box marginBottom="m">
                        <FormSelect
                          id="v57-note-type"
                          label={COPY.noteType}
                          value={noteType}
                          onChange={setNoteType}
                          options={[
                            { value: 'all', label: 'All types' },
                            { value: 'recruiter', label: 'Recruiter' },
                            { value: 'hm', label: 'Hiring manager' },
                          ]}
                        />
                        <BodyText size="small" color={colors.blackPepper500} marginTop="xxs">
                          {COPY.noteTypeHint}
                        </BodyText>
                      </Box>
                      {notesBlockedDemo ? (
                        <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                          {COPY.noteBlocked}
                        </BodyText>
                      ) : (
                        <>
                          <FormField id="v57-note-body" marginBottom="m">
                            <FormField.Label htmlFor="v57-note-body-input">{COPY.noteLabel}</FormField.Label>
                            <FormField.Input
                              id="v57-note-body-input"
                              as="textarea"
                              value={noteDraft}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteDraft(e.target.value)}
                              rows={4}
                              style={{
                                width: '100%',
                                padding: space.s,
                                fontSize: 14,
                                borderRadius: 8,
                                border: `1px solid ${colors.soap300}`,
                                fontFamily: 'inherit',
                                resize: 'vertical' as const,
                              }}
                            />
                            <FormField.Hint>{COPY.noteHint}</FormField.Hint>
                          </FormField>
                          <Flex gap="s" flexWrap="wrap" marginBottom="m">
                            <PrimaryButton size="small" onClick={handleAddNote}>
                              {COPY.addNote}
                            </PrimaryButton>
                            <SecondaryButton size="small" onClick={() => setNoteDraft('')}>
                              {COPY.cancel}
                            </SecondaryButton>
                          </Flex>
                        </>
                      )}
                      {noteFeedback ? (
                        <BodyText size="small" color={colors.greenApple600} marginBottom="m">
                          {noteFeedback}
                        </BodyText>
                      ) : null}
                      <Box
                        marginTop="m"
                        paddingTop="m"
                        style={{ borderTop: `1px solid ${colors.soap300}` }}
                      >
                        {mockNotes.length === 0 ? (
                          <>
                            <Heading size="small" marginBottom="s">
                              {COPY.noNotesHeading}
                            </Heading>
                            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                              {COPY.noNotesBody}
                            </BodyText>
                            {!notesBlockedDemo ? (
                              <PrimaryButton size="small" onClick={() => document.getElementById('v57-note-body-input')?.focus()}>
                                {COPY.addNote}
                              </PrimaryButton>
                            ) : null}
                          </>
                        ) : (
                          mockNotes.map((n) => (
                            <Box key={n.id} marginBottom="m">
                              <BodyText size="small" style={{ fontWeight: 600 }}>
                                {n.who} · {n.type}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500}>
                                {n.when}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
                                {n.text}
                              </BodyText>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Card>
                  </Box>
                  <Box style={{ flex: '1 1 300px', minWidth: 260, maxWidth: '100%' }}>
                    <Card padding="l" style={cardChrome()}>
                      <Heading size="small" marginBottom="m">
                        {COPY.activity}
                      </Heading>
                      {timelineRows.length === 0 ? (
                        <>
                          <Heading size="small" marginBottom="s">
                            {COPY.noActivityHeading}
                          </Heading>
                          <BodyText size="small" color={colors.blackPepper500}>
                            {COPY.noActivityBody}
                          </BodyText>
                        </>
                      ) : (
                        <>
                          {visibleTimeline.map((ev, i) => (
                            <Box
                              key={i}
                              marginBottom="m"
                              paddingBottom="m"
                              style={{
                                borderBottom:
                                  i < visibleTimeline.length - 1 ? `1px solid ${colors.soap200}` : undefined,
                              }}
                            >
                              <BodyText size="small" style={{ fontWeight: 600 }}>
                                {ev.t}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500}>
                                {ev.d}
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
                                {ev.m}
                              </BodyText>
                            </Box>
                          ))}
                          {timelineRows.length > 3 ? (
                            <TertiaryButton size="small" onClick={() => setTimelineExpanded((x) => !x)}>
                              {timelineExpanded ? 'Show less activity' : COPY.showMoreActivity}
                            </TertiaryButton>
                          ) : null}
                        </>
                      )}
                    </Card>
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );

  return (
    <>
      {shellMain}
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
              <Heading size="small">Email</Heading>
              <BodyText size="small" color={colors.blackPepper500}>
                Thread preview (prototype)
              </BodyText>
            </Box>
            <Box flex={1} padding="m" style={{ overflow: 'auto' }}>
              <SanaCommMessageBubble align="start" timestamp="20 March 2026, 08:02">
                Thanks for your interest. Please confirm your earliest start date.
              </SanaCommMessageBubble>
              <SanaCommMessageBubble align="end" timestamp="20 March 2026, 09:15">
                I can start from 15 April 2026 subject to notice period.
              </SanaCommMessageBubble>
            </Box>
            <Box padding="m" style={{ borderTop: `1px solid ${colors.soap300}` }}>
              <SanaCommComposer
                value={emailDraft}
                onChange={setEmailDraft}
                placeholder="Write a reply…"
                onSend={() => setEmailDraft('')}
                sendLabel="Send"
              />
            </Box>
          </Flex>
        }
        rail={
          <Box
            as="button"
            type="button"
            aria-label={commExpanded ? 'Collapse email panel' : 'Expand email panel'}
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
    </>
  );
};
