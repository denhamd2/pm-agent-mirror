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
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { InputGroup } from '@workday/canvas-kit-react/text-input';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  arrowLeftSmallIcon,
  arrowRightSmallIcon,
  panelListIcon,
  searchIcon,
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
 * GCC Candidate Review Experience v54 — GCC-E2E-014 Step 9 (320).
 * Discovery: design/gcc-candidate-review-experience-v54-discovery-brief.md (Final Verdict: APPROVED)
 * PRD: docs/prds/gcc-candidate-review-experience-v54-prd.md
 * Copy: §2.6 verbatim (319-approved). Canvas Kit tokens consulted via user-canvas-kit-mcp get-canvas-kit-tokens.
 */

/** §2.6 Copy inventory — implement exactly */
const COPY = {
  review: 'Review',
  viewPreviewAria: 'View candidate preview',
  prevCandidateAria: 'Previous candidate',
  nextCandidateAria: 'Next candidate',
  moveToScreen: 'Move to screen',
  reject: 'Reject',
  close: 'Close',
  openCv: 'Open CV',
  openFullProfile: 'Open full profile',
  openInNewTab: 'Open in new tab',
  clearFilters: 'Clear filters',
  saveFilter: 'Save filter',
  applyFilters: 'Apply filters',
  submitSearch: 'Submit search',
  clearSearch: 'Clear search',
  tryAgain: 'Try again',
  continueOnDesktop: 'Continue on desktop',
  returnToApplication: 'Return to application',
  requestAccess: 'Request access',
  labelSearchCandidates: 'Search candidates',
  helpSearchCandidates:
    'Use AND, OR and NOT between terms. Use quotation marks for an exact phrase.',
  labelFindCandidatesHelp:
    'Search supports keywords and Boolean operators. Semantic or AI-assisted matching is available only when your organisation activates the licensed product.',
  stage: 'Stage',
  appliedDate: 'Applied date',
  source: 'Source',
  location: 'Location',
  name: 'Name',
  savedFilters: 'Saved filters',
  jobAppliedFor: 'Job applied for',
  trustPreview:
    'Use Previous and Next to move between candidates without returning to the list.',
  trustFullProfile:
    'Opens the full candidate record. Return to the list to choose another candidate.',
  errCv: 'Unable to load this CV. Open it in a new tab or try again.',
  errNotFound: 'Unable to find this candidate. Return to the list or refresh the page.',
  errGrid: 'Unable to load candidates. Check your connection and try again.',
  errDoc:
    "You don't have access to this document for this candidate. Open the job application for this job or contact your administrator.",
  errAssessment:
    'Unable to open the assessment. Close the other tab and try again, or continue on a desktop browser.',
  errUpload:
    'Unable to upload this file from your phone. Try again or continue on a desktop browser.',
  successMoved: 'Candidate moved to screen',
  successFilters: 'Filters applied',
  emptyFilters:
    'No candidates match your filters. Adjust filters or clear them to see more results.',
  emptySearch: 'No candidates match your search. Try different keywords or filters.',
  loadingGrid: 'Loading candidates…',
  loadingCandidate: 'Loading candidate…',
  loadingCv: 'Loading CV…',
  loadingSearch: 'Loading search results…',
  submittingApplication: 'Submitting application…',
  licensedMatch:
    'Semantic and AI-assisted matching is available when your organisation activates it. A person still makes hiring decisions.',
  matchInsights:
    "Match insights are suggestions only. They don't replace your judgement.",
  anonymised: "Some candidate details are hidden based on your organisation's screening rules.",
  mobileAssessmentLeave:
    "You're leaving Workday to complete an assessment. When you're done, return here to finish your application.",
  tableCandidates: 'Candidates',
  colCandidate: 'Candidate',
  colCv: 'CV',
  colView: 'View',
  colActions: 'Actions',
  searchResults: 'Search results',
} as const;

type HubId = 'overview' | 'requisitions' | 'candidates' | 'dashboard';
type CenterMode = 'req' | 'find' | 'mobile';
type ReqTabId = 'overview' | 'candidates' | 'interviews' | 'details';
type ModalDemoState =
  | 'default'
  | 'loadingCandidate'
  | 'loadingCv'
  | 'cvError'
  | 'notFound'
  | 'docBlocked'
  | 'anonymised';

interface CandidateRow {
  id: string;
  name: string;
  jobTitle: string;
  location: string;
  stage: string;
  source: string;
  appliedDate: string;
}

const HUB_TABS = [
  { id: 'overview' as const, label: 'Overview' },
  { id: 'requisitions' as const, label: 'Job requisitions' },
  { id: 'candidates' as const, label: 'Candidates' },
  { id: 'dashboard' as const, label: 'Dashboard' },
];

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
    appliedDate: '2026-03-18',
  },
  {
    id: '2',
    name: 'محمد العتيبي',
    jobTitle: MOCK_REQ.title,
    location: 'Riyadh, KSA',
    stage: 'Screen',
    source: 'Referral',
    appliedDate: '2026-03-17',
  },
  {
    id: '3',
    name: 'Priya Nair',
    jobTitle: MOCK_REQ.title,
    location: 'Doha, Qatar',
    stage: 'Review',
    source: 'LinkedIn',
    appliedDate: '2026-03-12',
  },
  {
    id: '4',
    name: 'Omar Haddad',
    jobTitle: MOCK_REQ.title,
    location: 'Kuwait City',
    stage: 'New',
    source: 'Agency',
    appliedDate: '2026-03-08',
  },
  {
    id: '5',
    name: 'James Okonkwo',
    jobTitle: MOCK_REQ.title,
    location: 'Abu Dhabi, UAE',
    stage: 'Screen',
    source: 'Referral',
    appliedDate: '2026-03-16',
  },
];

function formatApplied(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadgeStyle(stage: string): { bg: string; fg: string } {
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

function isTextInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return el.getAttribute('contenteditable') === 'true';
}

function readV54QueryFlags() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      gridError: p.get('gridError') === '1',
      emptyGrid: p.get('empty') === '1',
      emptySearch: p.get('emptySearch') === '1',
      mobileUpload: p.get('mobileUpload') === '1',
      mobileAssessment: p.get('mobileAssessment') === '1',
      assessmentError: p.get('assessmentError') === '1',
    };
  } catch {
    return {
      gridError: false,
      emptyGrid: false,
      emptySearch: false,
      mobileUpload: false,
      mobileAssessment: false,
      assessmentError: false,
    };
  }
}

export const GccCandidateReviewExperienceV54: React.FC = () => {
  const [queryFlags] = useState(readV54QueryFlags);
  const [hubTab, setHubTab] = useState<HubId>('candidates');
  const [centerMode, setCenterMode] = useState<CenterMode>('req');
  const [reqTab, setReqTab] = useState<ReqTabId>('candidates');
  const [topSearch, setTopSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [savedFilter, setSavedFilter] = useState('none');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalDemoState, setModalDemoState] = useState<ModalDemoState>('default');
  const [unifiedVsFull, setUnifiedVsFull] = useState<'unified' | 'full'>('unified');
  const [findQuery, setFindQuery] = useState('(cybersecurity OR GRC) AND (KSA OR UAE)');
  const [findLoading, setFindLoading] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);
  const [mobileSubmitting, setMobileSubmitting] = useState(false);

  const profileModal = useModalModel();
  const filteredRows = useMemo(() => {
    if (queryFlags.emptyGrid) return [];
    return MOCK_ROWS.filter((r) => {
      if (filterStage !== 'all' && r.stage !== filterStage) return false;
      if (filterSource !== 'all' && r.source !== filterSource) return false;
      return true;
    });
  }, [filterStage, filterSource, queryFlags.emptyGrid]);

  const selectedIndex = useMemo(() => {
    if (!selectedId) return -1;
    return filteredRows.findIndex((r) => r.id === selectedId);
  }, [selectedId, filteredRows]);

  const activeRow = selectedIndex >= 0 ? filteredRows[selectedIndex] : null;

  const openModal = useCallback(
    (id: string) => {
      setSelectedId(id);
      setUnifiedVsFull('unified');
      profileModal.events.show();
    },
    [profileModal.events]
  );

  const goPrev = useCallback(() => {
    if (selectedIndex <= 0) return;
    setSelectedId(filteredRows[selectedIndex - 1].id);
  }, [selectedIndex, filteredRows]);

  const goNext = useCallback(() => {
    if (selectedIndex < 0 || selectedIndex >= filteredRows.length - 1) return;
    setSelectedId(filteredRows[selectedIndex + 1].id);
  }, [selectedIndex, filteredRows]);

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
    if (selectedIds.length === filteredRows.length) setSelectedIds([]);
    else setSelectedIds(filteredRows.map((r) => r.id));
  };

  const runFindSearch = () => {
    setFindLoading(true);
    window.setTimeout(() => setFindLoading(false), 900);
  };

  const demoLoadingCandidate = modalDemoState === 'loadingCandidate';
  const demoLoadingCv = modalDemoState === 'loadingCv';
  const showCvError = modalDemoState === 'cvError';
  const showNotFound = modalDemoState === 'notFound';
  const showDocBlocked = modalDemoState === 'docBlocked';
  const showAnonymisedModal = modalDemoState === 'anonymised';

  const reqOverviewPanel = (
    <Box padding="l">
      <Heading size="small" marginBottom="m">
        Requisition overview
      </Heading>
      <Flex gap="m" flexWrap="wrap">
        <Card
          padding="l"
          style={{
            flex: '1 1 200px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            backgroundColor: colors.frenchVanilla100,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            Open roles
          </BodyText>
          <Heading size="large">1</Heading>
        </Card>
        <Card
          padding="l"
          style={{
            flex: '1 1 200px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            backgroundColor: colors.frenchVanilla100,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            Active candidates
          </BodyText>
          <Heading size="large">{MOCK_ROWS.length}</Heading>
        </Card>
      </Flex>
    </Box>
  );

  const reqInterviewsPanel = (
    <Box padding="l">
      <Heading size="small" marginBottom="m">
        Interviews
      </Heading>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header scope="col">{COPY.colCandidate}</Table.Header>
            <Table.Header scope="col">Round</Table.Header>
            <Table.Header scope="col">Status</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <BodyText size="small">Sara Al-Mansoori</BodyText>
            </Table.Cell>
            <Table.Cell>
              <BodyText size="small">Technical</BodyText>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge stage="Interview" />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Box>
  );

  const reqDetailsPanel = (
    <Box padding="l">
      <Heading size="small" marginBottom="m">
        Details
      </Heading>
      <BodyText size="small" marginBottom="s">
        {MOCK_REQ.id}
      </BodyText>
      <BodyText size="small">{MOCK_REQ.title}</BodyText>
      <BodyText size="small" marginTop="s" color={colors.blackPepper500}>
        {MOCK_REQ.location}
      </BodyText>
    </Box>
  );

  const candidatesGridCard = (
    <Card
      padding="l"
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        boxShadow: SANA_CARD_SHADOW,
        backgroundColor: colors.frenchVanilla100,
      }}
    >
      {toastBanner && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="m"
          marginBottom="m"
          padding="m"
          style={{
            backgroundColor: colors.greenApple100,
            border: `1px solid ${colors.soap300}`,
            borderRadius: 12,
          }}
        >
          <BodyText size="small">{toastBanner}</BodyText>
          <TertiaryButton onClick={() => setToastBanner(null)}>{COPY.close}</TertiaryButton>
        </Flex>
      )}

      {queryFlags.gridError ? (
        <Banner as="div" hasError marginBottom="m">
          <Banner.Icon />
          <Banner.Label>{COPY.errGrid}</Banner.Label>
        </Banner>
      ) : null}

      {!queryFlags.gridError && (
        <>
          <Flex gap="m" flexWrap="wrap" marginBottom="m">
            <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
              <FormSelect
                id="v54-stage"
                label={COPY.stage}
                value={filterStage}
                onChange={setFilterStage}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'New', label: 'New' },
                  { value: 'Screen', label: 'Screen' },
                  { value: 'Review', label: 'Review' },
                  { value: 'Interview', label: 'Interview' },
                ]}
              />
            </Box>
            <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
              <FormSelect
                id="v54-source"
                label={COPY.source}
                value={filterSource}
                onChange={setFilterSource}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'Career site', label: 'Career site' },
                  { value: 'Referral', label: 'Referral' },
                  { value: 'LinkedIn', label: 'LinkedIn' },
                  { value: 'Agency', label: 'Agency' },
                ]}
              />
            </Box>
            <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
              <FormSelect
                id="v54-saved"
                label={COPY.savedFilters}
                value={savedFilter}
                onChange={setSavedFilter}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'gcc-national', label: 'GCC nationals' },
                ]}
              />
            </Box>
          </Flex>

          <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
            {COPY.trustPreview}
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
            {COPY.trustFullProfile}
          </BodyText>

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
              <Flex gap="s" flexWrap="wrap">
                <PrimaryButton
                  onClick={() => {
                    setToastBanner(COPY.successMoved);
                  }}
                >
                  {COPY.moveToScreen}
                </PrimaryButton>
                <SecondaryButton onClick={() => undefined}>{COPY.reject}</SecondaryButton>
              </Flex>
            </Box>
          )}

          <Flex gap="s" flexWrap="wrap" marginBottom="m">
            <SecondaryButton onClick={() => undefined}>{COPY.saveFilter}</SecondaryButton>
            <TertiaryButton
              onClick={() => {
                setToastBanner(COPY.successFilters);
              }}
            >
              {COPY.applyFilters}
            </TertiaryButton>
            <TertiaryButton
              onClick={() => {
                setFilterStage('all');
                setFilterSource('all');
              }}
            >
              {COPY.clearFilters}
            </TertiaryButton>
          </Flex>

          <Box style={{ overflowX: 'auto' }}>
            <Box
              style={{
                borderRadius: 12,
                border: `1px solid ${colors.soap300}`,
                backgroundColor: colors.soap100,
                minWidth: '100%',
              }}
            >
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header scope="col" style={{ width: 44 }}>
                      <Checkbox
                        checked={
                          filteredRows.length > 0 && selectedIds.length === filteredRows.length
                        }
                        onChange={() => toggleSelectAll()}
                        aria-label="Select all candidates in view"
                      />
                    </Table.Header>
                    <Table.Header scope="col">{COPY.colCandidate}</Table.Header>
                    <Table.Header scope="col">{COPY.stage}</Table.Header>
                    <Table.Header scope="col">{COPY.appliedDate}</Table.Header>
                    <Table.Header scope="col">{COPY.source}</Table.Header>
                    <Table.Header scope="col">{COPY.location}</Table.Header>
                    <Table.Header scope="col">{COPY.colCv}</Table.Header>
                    <Table.Header scope="col">{COPY.colView}</Table.Header>
                    <Table.Header scope="col">{COPY.colActions}</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {filteredRows.map((row) => (
                    <Table.Row key={row.id}>
                      <Table.Cell>
                        <Checkbox
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) => toggleSelect(row.id, e.target.checked)}
                          aria-label={`Select ${row.name}`}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <TertiaryButton
                          onClick={() => {
                            openModal(row.id);
                            setModalDemoState('default');
                            setUnifiedVsFull('full');
                          }}
                        >
                          {row.name}
                        </TertiaryButton>
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
                        <BodyText size="small">{row.location}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <TertiaryButton onClick={() => openModal(row.id)}>{COPY.openCv}</TertiaryButton>
                      </Table.Cell>
                      <Table.Cell>
                        <ToolbarIconButton
                          icon={panelListIcon}
                          aria-label={COPY.viewPreviewAria}
                          onClick={() => {
                            openModal(row.id);
                            setModalDemoState('default');
                            setUnifiedVsFull('unified');
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <PrimaryButton
                          onClick={() => {
                            openModal(row.id);
                            setModalDemoState('default');
                            setUnifiedVsFull('unified');
                          }}
                        >
                          {COPY.review}
                        </PrimaryButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Box>
          </Box>

          {filteredRows.length === 0 && (
            <BodyText size="small" marginTop="m">
              {COPY.emptyFilters}
            </BodyText>
          )}
        </>
      )}
    </Card>
  );

  const requisitionWorkspace = (
    <Box padding="l">
      <Heading size="large" marginBottom="xxs">
        {MOCK_REQ.title}
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="xs">
        {MOCK_REQ.id}
      </BodyText>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
        {MOCK_REQ.location}
      </BodyText>

      <Flex gap="s" marginBottom="m" flexWrap="wrap">
        <TertiaryButton
          onClick={() => setCenterMode('req')}
          style={{ fontWeight: centerMode === 'req' ? 700 : 400 }}
        >
          Requisition candidates
        </TertiaryButton>
        <TertiaryButton
          onClick={() => setCenterMode('find')}
          style={{ fontWeight: centerMode === 'find' ? 700 : 400 }}
        >
          Find candidates workspace
        </TertiaryButton>
        <TertiaryButton
          onClick={() => setCenterMode('mobile')}
          style={{ fontWeight: centerMode === 'mobile' ? 700 : 400 }}
        >
          Mobile apply slice
        </TertiaryButton>
      </Flex>

      {centerMode === 'req' && (
        <>
          <Heading size="medium" marginBottom="m">
            {COPY.tableCandidates}
          </Heading>
          <Flex gap="xs" marginBottom="l" flexWrap="wrap">
            {(
              [
                ['overview', 'Overview'],
                ['candidates', 'Candidates'],
                ['interviews', 'Interviews'],
                ['details', 'Details'],
              ] as const
            ).map(([id, label]) => (
              <TertiaryButton
                key={id}
                onClick={() => setReqTab(id)}
                style={{
                  fontWeight: reqTab === id ? 700 : 400,
                  textDecoration: reqTab === id ? 'underline' : undefined,
                }}
              >
                {label}
              </TertiaryButton>
            ))}
          </Flex>
          {reqTab === 'overview' && reqOverviewPanel}
          {reqTab === 'candidates' && candidatesGridCard}
          {reqTab === 'interviews' && reqInterviewsPanel}
          {reqTab === 'details' && reqDetailsPanel}
        </>
      )}

      {centerMode === 'find' && (
        <Flex gap="l" alignItems="flex-start" flexWrap="wrap">
          <Card
            padding="l"
            style={{
              flex: '0 0 260px',
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              boxShadow: SANA_CARD_SHADOW,
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <Box marginBottom="m">
              <FormSelect
                id="v54-f-stage"
                label={COPY.stage}
                value={filterStage}
                onChange={setFilterStage}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'Interview', label: 'Interview' },
                ]}
              />
            </Box>
            <Box marginBottom="m">
              <FormSelect
                id="v54-f-applied"
                label={COPY.appliedDate}
                value="any"
                onChange={() => undefined}
                options={[
                  { value: 'any', label: 'Any' },
                  { value: '7d', label: 'Last 7 days' },
                ]}
              />
            </Box>
            <Box marginBottom="m">
              <FormSelect
                id="v54-f-source"
                label={COPY.source}
                value={filterSource}
                onChange={setFilterSource}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'Career site', label: 'Career site' },
                ]}
              />
            </Box>
            <Box marginBottom="m">
              <FormSelect
                id="v54-f-loc"
                label={COPY.location}
                value="all"
                onChange={() => undefined}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'uae', label: 'UAE' },
                ]}
              />
            </Box>
            <Box marginBottom="m">
              <FormSelect
                id="v54-f-name"
                label={COPY.name}
                value="all"
                onChange={() => undefined}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'starts', label: 'Starts with' },
                ]}
              />
            </Box>
            <Flex gap="s" flexWrap="wrap">
              <SecondaryButton onClick={() => undefined}>{COPY.saveFilter}</SecondaryButton>
              <TertiaryButton onClick={() => setToastBanner(COPY.successFilters)}>
                {COPY.applyFilters}
              </TertiaryButton>
              <TertiaryButton onClick={() => undefined}>{COPY.clearFilters}</TertiaryButton>
            </Flex>
          </Card>

          <Box flex="1" minWidth={280}>
            <Card
              padding="l"
              style={{
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
                boxShadow: SANA_CARD_SHADOW,
                backgroundColor: colors.frenchVanilla100,
                marginBottom: 'm',
              }}
            >
              <Heading size="small" marginBottom="s">
                {COPY.labelSearchCandidates}
              </Heading>
              <BodyText size="small" marginBottom="s">
                {COPY.helpSearchCandidates}
              </BodyText>
              <BodyText size="small" marginBottom="m" style={{ fontWeight: 600 }}>
                {COPY.labelFindCandidatesHelp}
              </BodyText>
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
                  aria-label={COPY.labelSearchCandidates}
                  value={findQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFindQuery(e.target.value)}
                  placeholder={COPY.labelSearchCandidates}
                  style={{
                    backgroundColor: SANA_SEARCH_FIELD_BG,
                    border: 'none',
                    boxShadow: 'none',
                    fontSize: 14,
                  }}
                />
              </InputGroup>
              <Flex gap="s" marginTop="m" flexWrap="wrap">
                <PrimaryButton onClick={runFindSearch}>{COPY.submitSearch}</PrimaryButton>
                <SecondaryButton onClick={() => setFindQuery('')}>{COPY.clearSearch}</SecondaryButton>
              </Flex>
            </Card>

            <Card
              padding="l"
              marginBottom="m"
              style={{
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
                backgroundColor: colors.soap100,
              }}
            >
              <BodyText size="small" marginBottom="s">
                {COPY.licensedMatch}
              </BodyText>
              <BodyText size="small">{COPY.matchInsights}</BodyText>
            </Card>

            {findLoading ? (
              <BodyText size="small">{COPY.loadingSearch}</BodyText>
            ) : (
              <>
                <Heading size="small" marginBottom="m">
                  {COPY.searchResults}
                </Heading>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header scope="col">{COPY.colCandidate}</Table.Header>
                      <Table.Header scope="col">{COPY.jobAppliedFor}</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {(queryFlags.emptySearch ? [] : MOCK_ROWS.slice(0, 3)).map((row) => (
                      <Table.Row key={row.id}>
                        <Table.Cell>
                          <TertiaryButton onClick={() => openModal(row.id)}>{row.name}</TertiaryButton>
                        </Table.Cell>
                        <Table.Cell>
                          <BodyText size="small">{row.jobTitle}</BodyText>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                {queryFlags.emptySearch && (
                  <BodyText size="small" marginTop="m">
                    {COPY.emptySearch}
                  </BodyText>
                )}
              </>
            )}
          </Box>
        </Flex>
      )}

      {centerMode === 'mobile' && (
        <Flex justifyContent="center" paddingY="l">
          <Card
            padding="l"
            style={{
              width: 'min(100%, 380px)',
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              boxShadow: SANA_CARD_SHADOW,
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              Illustrative mobile apply slice for PM review.
            </BodyText>
            {queryFlags.assessmentError ? (
              <Banner as="div" hasError marginBottom="m">
                <Banner.Icon />
                <Banner.Label>{COPY.errAssessment}</Banner.Label>
              </Banner>
            ) : queryFlags.mobileUpload ? (
              <Banner as="div" hasError marginBottom="m">
                <Banner.Icon />
                <Banner.Label>{COPY.errUpload}</Banner.Label>
              </Banner>
            ) : (
              <Banner as="div" marginBottom="m">
                <Banner.Icon />
                <Banner.Label>{COPY.mobileAssessmentLeave}</Banner.Label>
              </Banner>
            )}
            {mobileSubmitting && (
              <BodyText size="small" marginBottom="m">
                {COPY.submittingApplication}
              </BodyText>
            )}
            <Flex gap="s" flexWrap="wrap">
              <PrimaryButton
                onClick={() => {
                  setMobileSubmitting(true);
                  window.setTimeout(() => setMobileSubmitting(false), 1500);
                }}
              >
                {queryFlags.mobileUpload ? COPY.tryAgain : COPY.returnToApplication}
              </PrimaryButton>
              <SecondaryButton onClick={() => undefined}>{COPY.continueOnDesktop}</SecondaryButton>
              {!queryFlags.mobileUpload && (
                <TertiaryButton onClick={() => undefined}>{COPY.tryAgain}</TertiaryButton>
              )}
            </Flex>
          </Card>
        </Flex>
      )}
    </Box>
  );

  const hubOverview = (
    <Box padding="l">
      <Heading size="large" marginBottom="m">
        Overview
      </Heading>
      <Flex gap="m" flexWrap="wrap" marginBottom="l">
        <Card
          padding="l"
          style={{
            flex: '1 1 220px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            Tasks
          </BodyText>
          <BodyText size="small">3 approvals waiting · 2 feedback requests</BodyText>
        </Card>
        <Card
          padding="l"
          style={{
            flex: '1 1 220px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            This week
          </BodyText>
          <BodyText size="small">12 interviews scheduled · 48 candidates in review</BodyText>
        </Card>
      </Flex>
    </Box>
  );

  const hubRequisitions = (
    <Box padding="l">
      <Heading size="large" marginBottom="m">
        Job requisitions
      </Heading>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header scope="col">Requisition</Table.Header>
            <Table.Header scope="col">{COPY.location}</Table.Header>
            <Table.Header scope="col">{COPY.stage}</Table.Header>
            <Table.Header scope="col">{COPY.tableCandidates}</Table.Header>
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
              <BodyText size="small">{MOCK_ROWS.length}</BodyText>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Box>
  );

  const hubDashboard = (
    <Box padding="l">
      <Heading size="large" marginBottom="m">
        Dashboard
      </Heading>
      <Flex gap="m" flexWrap="wrap">
        <Card
          padding="l"
          style={{
            flex: '1 1 200px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            Time in Screen (median)
          </BodyText>
          <Heading size="large">4.2 days</Heading>
        </Card>
        <Card
          padding="l"
          style={{
            flex: '1 1 200px',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
            Pass-through rate
          </BodyText>
          <Heading size="large">38%</Heading>
        </Card>
      </Flex>
    </Box>
  );

  const hubBody = () => {
    switch (hubTab) {
      case 'overview':
        return hubOverview;
      case 'requisitions':
        return hubRequisitions;
      case 'candidates':
        return requisitionWorkspace;
      case 'dashboard':
        return hubDashboard;
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

        <Flex
          alignItems="stretch"
          style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`, overflow: 'hidden' }}
        >
          <WorkdayLeftTabBar
            showSecondaryTitleIcon
            secondaryTitle="Recruiting"
            secondarySubtitle="Recruiter Hub"
            tabs={[...HUB_TABS]}
            activeTabId={hubTab}
            onTabChange={(id) => setHubTab(id as HubId)}
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
                  GCC Candidate Review Experience v54 (GCC-E2E-014). Illustrative data for PM review.
                </BodyText>
              </Box>
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
            {activeRow && (
              <>
                <Box padding="l" style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}>
                  <Flex marginBottom="m" gap="m" flexWrap="wrap" alignItems="center">
                    <FormSelect
                      id="v54-modal-demo"
                      label="Modal demo state (engineering)"
                      value={modalDemoState}
                      onChange={(v) => setModalDemoState(v as ModalDemoState)}
                      options={[
                        { value: 'default', label: 'Default' },
                        { value: 'loadingCandidate', label: 'Loading candidate' },
                        { value: 'loadingCv', label: 'Loading CV' },
                        { value: 'cvError', label: 'CV error' },
                        { value: 'notFound', label: 'Not found' },
                        { value: 'docBlocked', label: 'Document blocked' },
                        { value: 'anonymised', label: 'Anonymised' },
                      ]}
                    />
                  </Flex>

                  {showAnonymisedModal && (
                    <Box marginBottom="m">
                      <Banner as="div">
                        <Banner.Icon />
                        <Banner.Label>{COPY.anonymised}</Banner.Label>
                      </Banner>
                    </Box>
                  )}

                  {showNotFound && (
                    <Box marginBottom="m">
                      <Banner as="div" hasError>
                        <Banner.Icon />
                        <Banner.Label>{COPY.errNotFound}</Banner.Label>
                      </Banner>
                    </Box>
                  )}

                  <BodyText size="small" color={colors.blackPepper600} marginBottom="xxs">
                    {COPY.trustPreview}
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                    {COPY.trustFullProfile}
                  </BodyText>

                  <Flex justifyContent="space-between" alignItems="flex-start" gap="m" flexWrap="wrap">
                    <Flex alignItems="center" gap="m" flex="1 1 280px" minWidth={0}>
                      <Avatar size={64} altText="" as="div" />
                      <Box minWidth={0}>
                        <Modal.Heading as="h2" style={{ marginBottom: space.xxs, fontSize: 20, fontWeight: 700 }}>
                          {activeRow.name}
                        </Modal.Heading>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {activeRow.jobTitle} · <StatusBadge stage={activeRow.stage} />
                        </BodyText>
                      </Box>
                    </Flex>
                    <Flex alignItems="center" gap="s" flexWrap="wrap">
                      <ToolbarIconButton
                        icon={arrowLeftSmallIcon}
                        aria-label={COPY.prevCandidateAria}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                        disabled={selectedIndex <= 0}
                      />
                      <BodyText size="small" style={{ fontWeight: 600, minWidth: 120, textAlign: 'center' }}>
                        {selectedIndex + 1} of {filteredRows.length}
                      </BodyText>
                      <ToolbarIconButton
                        icon={arrowRightSmallIcon}
                        aria-label={COPY.nextCandidateAria}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          goNext();
                        }}
                        disabled={selectedIndex < 0 || selectedIndex >= filteredRows.length - 1}
                      />
                      <Modal.CloseIcon aria-label={COPY.close} />
                    </Flex>
                  </Flex>

                  <Flex gap="s" flexWrap="wrap" marginTop="m">
                    <PrimaryButton onClick={() => setToastBanner(COPY.successMoved)}>
                      {COPY.moveToScreen}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => undefined}>{COPY.reject}</SecondaryButton>
                    <TertiaryButton onClick={() => undefined}>{COPY.openCv}</TertiaryButton>
                    <TertiaryButton
                      onClick={() =>
                        setUnifiedVsFull((v) => (v === 'unified' ? 'full' : 'unified'))
                      }
                    >
                      {COPY.openFullProfile}
                    </TertiaryButton>
                    <TertiaryButton onClick={() => window.open('about:blank', '_blank', 'noopener')}>
                      {COPY.openInNewTab}
                    </TertiaryButton>
                    {showDocBlocked && (
                      <TertiaryButton onClick={() => undefined}>{COPY.requestAccess}</TertiaryButton>
                    )}
                  </Flex>
                </Box>

                <Modal.Body padding="zero" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  {demoLoadingCandidate ? (
                    <Box padding="l">
                      <BodyText size="small">{COPY.loadingCandidate}</BodyText>
                    </Box>
                  ) : unifiedVsFull === 'full' ? (
                    <Box padding="l">
                      <BodyText size="small" marginBottom="m">
                        {COPY.trustFullProfile}
                      </BodyText>
                      <PrimaryButton onClick={() => setUnifiedVsFull('unified')}>{COPY.review}</PrimaryButton>
                    </Box>
                  ) : showCvError ? (
                    <Box padding="l">
                      <Banner as="div" hasError marginBottom="m">
                        <Banner.Icon />
                        <Banner.Label>{COPY.errCv}</Banner.Label>
                      </Banner>
                      <Flex gap="s">
                        <SecondaryButton onClick={() => undefined}>{COPY.openInNewTab}</SecondaryButton>
                        <TertiaryButton onClick={() => undefined}>{COPY.tryAgain}</TertiaryButton>
                      </Flex>
                    </Box>
                  ) : showDocBlocked ? (
                    <Box padding="l">
                      <Banner as="div" hasError marginBottom="m">
                        <Banner.Icon />
                        <Banner.Label>{COPY.errDoc}</Banner.Label>
                      </Banner>
                    </Box>
                  ) : demoLoadingCv ? (
                    <Box padding="l">
                      <BodyText size="small">{COPY.loadingCv}</BodyText>
                    </Box>
                  ) : (
                    <Tabs initialTab="summary">
                      <Tabs.List marginBottom="l" paddingX="l" paddingTop="m">
                        <Tabs.Item data-id="summary">Summary</Tabs.Item>
                        <Tabs.Item data-id="cv">CV</Tabs.Item>
                        <Tabs.Item data-id="notes">Notes</Tabs.Item>
                      </Tabs.List>
                      <Tabs.Panel data-id="summary" paddingX="l" paddingBottom="l">
                        <BodyText size="small">{activeRow.location}</BodyText>
                        <BodyText size="small" marginTop="m">
                          {COPY.matchInsights}
                        </BodyText>
                      </Tabs.Panel>
                      <Tabs.Panel data-id="cv" paddingX="l" paddingBottom="l">
                        <BodyText size="small">Illustrative CV body for {activeRow.name}.</BodyText>
                      </Tabs.Panel>
                      <Tabs.Panel data-id="notes" paddingX="l" paddingBottom="l">
                        <BodyText size="small">Recruiter notes (mock).</BodyText>
                      </Tabs.Panel>
                    </Tabs>
                  )}
                </Modal.Body>
              </>
            )}
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </>
  );
};

export default GccCandidateReviewExperienceV54;
