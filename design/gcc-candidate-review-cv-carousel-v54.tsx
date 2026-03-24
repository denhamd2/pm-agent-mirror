/**
 * GCC Candidate Review Experience with CV Carousel (v54)
 *
 * Pipeline: GCC-E2E-014 (Step 9: **320** prototype from **315** APPROVED brief)
 * Discovery Brief: design/gcc-candidate-review-cv-carousel-v54-discovery-brief.md
 * PRD: docs/prds/gcc-candidate-review-experience-v54-prd.md
 * Copy: design/gcc-candidate-review-cv-carousel-v54-copy-review-319.md (APPROVED)
 *
 * Key Features:
 * - Unified candidate review modal (Pattern B+)
 * - CV carousel with multi-document support
 * - Keyboard navigation (arrow keys) + touch gestures (swipe simulation)
 * - Thumbnail rail for random access
 * - Progressive disclosure (notes below fold)
 * - Sana Style UI (neutral surfaces, minimal blue chrome)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  arrowLeftSmallIcon,
  arrowRightSmallIcon,
  panelListIcon,
  searchIcon,
  documentIcon,
  xSmallIcon,
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
  FormSelect,
} from './components/index';

// =============================================================================
// COPY (from 319 approved copy)
// =============================================================================
const COPY = {
  // Modal header
  prevCandidate: 'Previous candidate',
  nextCandidate: 'Next candidate',

  // Carousel navigation (applying 319 Quick Win #1: shortened labels)
  prevDoc: 'Previous',
  nextDoc: 'Next',
  prevDocAria: 'Previous document',
  nextDocAria: 'Next document',

  // Sidebar labels
  location: 'Location',
  stage: 'Stage',
  source: 'Source',
  applied: 'Applied',

  // Actions
  moveToStage: 'Move to screen',
  addNote: 'Add note',
  sendMessage: 'Send message',

  // Error messages
  errDocLoad:
    'Unable to load this document. It may have been removed or you may not have access. Open in a new tab or contact support.',
  errNetwork: 'Connection lost while loading document. Check your network and try again.',

  // Empty states
  emptyDocsHeading: 'No documents uploaded',
  emptyDocsBody:
    "This candidate hasn't uploaded any documents yet. They may have only filled out the application form.",

  // Loading states
  loadingDoc: 'Loading document…',
  loadingPage: 'Loading page {page}…',

  // Accessibility
  ariaDocPosition: 'Now viewing {name}, page {page} of {total}',
  ariaKeyboardHint: 'Use arrow keys to navigate between documents',

  // Other
  review: 'Review',
  close: 'Close',
  tableCandidates: 'Candidates',
  colCandidate: 'Candidate',
  colStage: 'Stage',
  colApplied: 'Applied',
  colSource: 'Source',
  colLocation: 'Location',
  colActions: 'Actions',
};

// =============================================================================
// MOCK DATA
// =============================================================================
const MOCK_REQ = {
  id: 'R-2026-4410',
  title: 'Senior cybersecurity engineer — GCC nationalisation programme',
  location: 'Riyadh, KSA · Hybrid',
};

const MOCK_CANDIDATES = [
  {
    id: '1',
    name: 'Sara Al-Mansoori',
    jobTitle: 'Senior Security Engineer',
    location: 'Dubai, UAE',
    stage: 'Interview',
    source: 'Career site',
    appliedDate: '2026-03-18',
    email: 'sara.almansoori@example.com',
    phone: '+971 50 123 4567',
    documents: [
      {
        id: 'doc1',
        name: 'CV - Sara Al-Mansoori.pdf',
        url: '/mock-cv-1.pdf',
        totalPages: 3,
        type: 'application/pdf',
      },
      {
        id: 'doc2',
        name: 'Cover Letter.pdf',
        url: '/mock-cover-1.pdf',
        totalPages: 1,
        type: 'application/pdf',
      },
      {
        id: 'doc3',
        name: 'Security Certifications.pdf',
        url: '/mock-cert-1.pdf',
        totalPages: 2,
        type: 'application/pdf',
      },
    ],
  },
  {
    id: '2',
    name: 'محمد العتيبي',
    jobTitle: 'Cybersecurity Analyst',
    location: 'Riyadh, KSA',
    stage: 'Screen',
    source: 'Referral',
    appliedDate: '2026-03-17',
    email: 'mohammed@example.com',
    phone: '+966 50 987 6543',
    documents: [
      {
        id: 'doc4',
        name: 'CV - Mohammed.pdf',
        url: '/mock-cv-2.pdf',
        totalPages: 2,
        type: 'application/pdf',
      },
    ],
  },
  {
    id: '3',
    name: 'Priya Nair',
    jobTitle: 'Information Security Specialist',
    location: 'Doha, Qatar',
    stage: 'Review',
    source: 'LinkedIn',
    appliedDate: '2026-03-12',
    email: 'priya.nair@example.com',
    phone: '+974 33 456 789',
    documents: [
      {
        id: 'doc5',
        name: 'Resume - Priya Nair.pdf',
        url: '/mock-cv-3.pdf',
        totalPages: 2,
        type: 'application/pdf',
      },
      {
        id: 'doc6',
        name: 'Portfolio.pdf',
        url: '/mock-portfolio-1.pdf',
        totalPages: 5,
        type: 'application/pdf',
      },
    ],
  },
  {
    id: '4',
    name: 'Omar Haddad',
    jobTitle: 'Security Operations Center Analyst',
    location: 'Kuwait City',
    stage: 'New',
    source: 'Agency',
    appliedDate: '2026-03-08',
    email: 'omar.haddad@example.com',
    phone: '+965 98 765 432',
    documents: [],
  },
  {
    id: '5',
    name: 'James Okonkwo',
    jobTitle: 'Senior Security Consultant',
    location: 'Abu Dhabi, UAE',
    stage: 'Screen',
    source: 'Referral',
    appliedDate: '2026-03-16',
    email: 'james.o@example.com',
    phone: '+971 55 234 5678',
    documents: [
      {
        id: 'doc7',
        name: 'James_Okonkwo_CV.pdf',
        url: '/mock-cv-4.pdf',
        totalPages: 4,
        type: 'application/pdf',
      },
    ],
  },
];

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'dashboard', label: 'Dashboard' },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
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

const StatusBadge = ({ stage }: { stage: string }) => {
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

// =============================================================================
// CV CAROUSEL COMPONENT
// =============================================================================
interface Document {
  id: string;
  name: string;
  url: string;
  totalPages: number;
  type: string;
}

interface CVCarouselProps {
  documents: Document[];
  candidateId: string;
}

const CVCarousel = ({ documents, candidateId }: CVCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDoc = documents[currentIndex];

  // Navigation handlers
  const goToPrevDoc = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentPage(1);
      setError(null);
    }
  }, [currentIndex]);

  const goToNextDoc = useCallback(() => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPage(1);
      setError(null);
    }
  }, [currentIndex, documents.length]);

  const jumpToDoc = useCallback((index: number) => {
    setCurrentIndex(index);
    setCurrentPage(1);
    setError(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in a text input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevDoc();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextDoc();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevDoc, goToNextDoc]);

  // ARIA live region announcement
  useEffect(() => {
    if (currentDoc) {
      const announcement = COPY.ariaDocPosition
        .replace('{name}', currentDoc.name)
        .replace('{page}', String(currentPage))
        .replace('{total}', String(currentDoc.totalPages));
      // In real implementation, this would announce to screen readers
      console.log('[ARIA]', announcement);
    }
  }, [currentDoc, currentPage]);

  // Empty state
  if (documents.length === 0) {
    return (
      <Card
        padding="xl"
        style={{
          borderRadius: SANA_CARD_RADIUS_LG,
          border: `1px solid ${colors.soap300}`,
          backgroundColor: colors.frenchVanilla100,
          textAlign: 'center',
        }}
      >
        <SystemIcon icon={documentIcon} size="large" color={colors.blackPepper300} />
        <Heading size="small" marginTop="m" marginBottom="s">
          {COPY.emptyDocsHeading}
        </Heading>
        <BodyText size="small" color={colors.blackPepper500}>
          {COPY.emptyDocsBody}
        </BodyText>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card
        padding="l"
        style={{
          borderRadius: SANA_CARD_RADIUS_LG,
          border: `1px solid ${colors.soap300}`,
          backgroundColor: colors.frenchVanilla100,
        }}
      >
        <Banner as="div" hasError marginBottom="m">
          <Banner.Icon />
          <Banner.Label>{error}</Banner.Label>
        </Banner>
        <TertiaryButton onClick={() => setError(null)}>Try again</TertiaryButton>
      </Card>
    );
  }

  return (
    <Card
      padding="zero"
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        backgroundColor: colors.frenchVanilla100,
        boxShadow: SANA_CARD_SHADOW,
      }}
    >
      {/* Document Viewer */}
      <Box
        style={{
          height: '600px',
          backgroundColor: colors.soap100,
          borderRadius: `${SANA_CARD_RADIUS_LG} ${SANA_CARD_RADIUS_LG} 0 0`,
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Box style={{ textAlign: 'center' }}>
            <BodyText size="small" color={colors.blackPepper500}>
              {COPY.loadingDoc}
            </BodyText>
          </Box>
        ) : (
          <Box
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: space.l,
            }}
          >
            {/* Mock document visualization */}
            <Box
              style={{
                width: '80%',
                maxWidth: '600px',
                backgroundColor: colors.frenchVanilla100,
                border: `2px solid ${colors.soap300}`,
                borderRadius: '8px',
                padding: space.l,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Heading size="small" marginBottom="m">
                {currentDoc.name}
              </Heading>
              <BodyText size="small" marginBottom="s" color={colors.blackPepper500}>
                <strong>Candidate ID:</strong> {candidateId}
              </BodyText>
              <BodyText size="small" marginBottom="s" color={colors.blackPepper500}>
                <strong>Document:</strong> {currentIndex + 1} of {documents.length}
              </BodyText>
              <BodyText size="small" marginBottom="s" color={colors.blackPepper500}>
                <strong>Page:</strong> {currentPage} of {currentDoc.totalPages}
              </BodyText>
              <Box
                marginTop="m"
                style={{
                  height: '300px',
                  backgroundColor: colors.soap100,
                  border: `1px dashed ${colors.soap400}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BodyText size="small" color={colors.blackPepper400}>
                  [Mock CV content would render here]
                </BodyText>
              </Box>
              <BodyText size="small" marginTop="m" color={colors.blackPepper400}>
                {COPY.ariaKeyboardHint}
              </BodyText>
            </Box>
          </Box>
        )}
      </Box>

      {/* Carousel Controls */}
      <Flex
        padding="m"
        justifyContent="space-between"
        alignItems="center"
        style={{ borderBottom: `1px solid ${colors.soap300}` }}
      >
        <TertiaryButton
          icon={arrowLeftSmallIcon}
          disabled={currentIndex === 0}
          onClick={goToPrevDoc}
          aria-label={COPY.prevDocAria}
        >
          {COPY.prevDoc}
        </TertiaryButton>

        <BodyText size="small" color={colors.blackPepper500}>
          {currentDoc.name} · Page {currentPage} of {currentDoc.totalPages}
        </BodyText>

        <TertiaryButton
          icon={arrowRightSmallIcon}
          iconPosition="end"
          disabled={currentIndex === documents.length - 1}
          onClick={goToNextDoc}
          aria-label={COPY.nextDocAria}
        >
          {COPY.nextDoc}
        </TertiaryButton>
      </Flex>

      {/* Thumbnail Rail */}
      <Flex
        padding="m"
        gap="s"
        style={{
          overflowX: 'auto',
          backgroundColor: colors.frenchVanilla100,
        }}
        role="group"
        aria-label="Document thumbnails"
      >
        {documents.map((doc, index) => (
          <Card
            key={doc.id}
            padding="s"
            onClick={() => jumpToDoc(index)}
            style={{
              minWidth: '120px',
              cursor: 'pointer',
              border:
                index === currentIndex
                  ? `2px solid ${colors.blueberry500}`
                  : `1px solid ${colors.soap300}`,
              borderRadius: '12px',
              transition: 'border-color 0.2s ease',
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${doc.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                jumpToDoc(index);
              }
            }}
          >
            <Box
              style={{
                height: '80px',
                backgroundColor: colors.soap200,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SystemIcon icon={documentIcon} size="large" color={colors.blackPepper400} />
            </Box>
            <BodyText
              size="small"
              marginTop="xs"
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {doc.name}
            </BodyText>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};

// =============================================================================
// CANDIDATE SUMMARY SIDEBAR
// =============================================================================
const CandidateSummaryPanel = ({ candidate }: { candidate: typeof MOCK_CANDIDATES[0] }) => {
  return (
    <Box>
      <Heading size="small" marginBottom="m">
        Candidate summary
      </Heading>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          {COPY.location}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {candidate.location}
        </BodyText>
      </Box>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          {COPY.stage}
        </BodyText>
        <StatusBadge stage={candidate.stage} />
      </Box>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          {COPY.source}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {candidate.source}
        </BodyText>
      </Box>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          {COPY.applied}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {formatApplied(candidate.appliedDate)}
        </BodyText>
      </Box>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          Email
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {candidate.email}
        </BodyText>
      </Box>

      <Box marginBottom="m">
        <BodyText size="small" style={{ fontWeight: 600 }} marginBottom="xxs">
          Phone
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {candidate.phone}
        </BodyText>
      </Box>

      <Box marginTop="l">
        <Heading size="small" marginBottom="s">
          Quick actions
        </Heading>
        <Flex flexDirection="column" gap="xs">
          <SecondaryButton size="small">{COPY.moveToStage}</SecondaryButton>
          <TertiaryButton size="small">{COPY.addNote}</TertiaryButton>
          <TertiaryButton size="small">{COPY.sendMessage}</TertiaryButton>
        </Flex>
      </Box>
    </Box>
  );
};

// =============================================================================
// NOTES AND ACTIVITY PANEL (below fold)
// =============================================================================
const NotesAndActivityPanel = ({ candidateId }: { candidateId: string }) => {
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Notes & Activity
      </Heading>
      <Card
        padding="m"
        style={{
          borderRadius: SANA_CARD_RADIUS_LG,
          border: `1px solid ${colors.soap300}`,
          backgroundColor: colors.frenchVanilla100,
        }}
      >
        <BodyText size="small" color={colors.blackPepper500}>
          No notes yet. Add a note to track your thoughts on this candidate.
        </BodyText>
      </Card>
    </Box>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export const GccCandidateReviewCvCarouselV54 = () => {
  const [hubTab, setHubTab] = useState('candidates');
  const [topSearch, setTopSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const profileModal = useModalModel();

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((c) => {
      if (filterStage !== 'all' && c.stage !== filterStage) return false;
      if (filterSource !== 'all' && c.source !== filterSource) return false;
      return true;
    });
  }, [filterStage, filterSource]);

  // Selected candidate index
  const selectedIndex = useMemo(() => {
    if (!selectedId) return -1;
    return filteredCandidates.findIndex((c) => c.id === selectedId);
  }, [selectedId, filteredCandidates]);

  const activeCandidate = selectedIndex >= 0 ? filteredCandidates[selectedIndex] : null;

  // Modal navigation
  const openModal = useCallback(
    (id: string) => {
      setSelectedId(id);
      profileModal.events.show();
    },
    [profileModal.events]
  );

  const goPrev = useCallback(() => {
    if (selectedIndex <= 0) return;
    setSelectedId(filteredCandidates[selectedIndex - 1].id);
  }, [selectedIndex, filteredCandidates]);

  const goNext = useCallback(() => {
    if (selectedIndex < 0 || selectedIndex >= filteredCandidates.length - 1) return;
    setSelectedId(filteredCandidates[selectedIndex + 1].id);
  }, [selectedIndex, filteredCandidates]);

  // Checkbox handlers
  const toggleSelect = (id: string, on: boolean) => {
    setSelectedIds((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  };

  return (
    <>
      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS, overflowX: 'hidden' }}>
        {/* Top Navigation */}
        <WorkdayTopNav
          searchValue={topSearch}
          onSearchChange={setTopSearch}
          showWMark={true}
          showMenuWordmark={false}
          notificationBadge={5}
          inboxBadge={42}
        />

        {/* Main Layout */}
        <Flex
          alignItems="stretch"
          style={{
            minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
            overflow: 'hidden',
          }}
        >
          {/* Left Navigation */}
          <WorkdayLeftTabBar
            showSecondaryTitleIcon={true}
            secondaryTitle="Recruiting"
            secondarySubtitle="Recruiter Hub"
            tabs={HUB_TABS}
            activeTabId={hubTab}
            onTabChange={(id) => setHubTab(id as string)}
          />

          {/* Main Content */}
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
              {/* Info Banner */}
              <Box padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
                <BodyText size="small" color={colors.blackPepper500}>
                  GCC Candidate Review with CV Carousel (v54, GCC-E2E-014). Illustrative prototype for
                  PM review. Features: Unified modal, multi-document carousel, keyboard navigation (arrow
                  keys), thumbnail rail.
                </BodyText>
              </Box>

              {/* Candidates Tab Content */}
              {hubTab === 'candidates' && (
                <Box padding="l">
                  <Heading size="large" marginBottom="m">
                    {MOCK_REQ.title}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                    {MOCK_REQ.id} · {MOCK_REQ.location}
                  </BodyText>

                  {/* Filters */}
                  <Flex gap="m" flexWrap="wrap" marginBottom="m">
                    <Box style={{ flex: '1 1 160px', minWidth: 140 }}>
                      <FormSelect
                        id="v54-stage"
                        label={COPY.colStage}
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
                        label={COPY.colSource}
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
                  </Flex>

                  {/* Candidates Table */}
                  <Box style={{ overflowX: 'auto' }}>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Header scope="col" style={{ width: 44 }}>
                            <Checkbox
                              checked={
                                filteredCandidates.length > 0 &&
                                selectedIds.length === filteredCandidates.length
                              }
                              onChange={() => toggleSelectAll()}
                              aria-label="Select all candidates"
                            />
                          </Table.Header>
                          <Table.Header scope="col">{COPY.colCandidate}</Table.Header>
                          <Table.Header scope="col">{COPY.colStage}</Table.Header>
                          <Table.Header scope="col">{COPY.colApplied}</Table.Header>
                          <Table.Header scope="col">{COPY.colSource}</Table.Header>
                          <Table.Header scope="col">{COPY.colLocation}</Table.Header>
                          <Table.Header scope="col">{COPY.colActions}</Table.Header>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {filteredCandidates.map((candidate) => (
                          <Table.Row key={candidate.id}>
                            <Table.Cell>
                              <Checkbox
                                checked={selectedIds.includes(candidate.id)}
                                onChange={(e) => toggleSelect(candidate.id, e.target.checked)}
                                aria-label={`Select ${candidate.name}`}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TertiaryButton onClick={() => openModal(candidate.id)}>
                                {candidate.name}
                              </TertiaryButton>
                            </Table.Cell>
                            <Table.Cell>
                              <StatusBadge stage={candidate.stage} />
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{formatApplied(candidate.appliedDate)}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{candidate.source}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small">{candidate.location}</BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <PrimaryButton size="small" onClick={() => openModal(candidate.id)}>
                                {COPY.review}
                              </PrimaryButton>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Box>
                </Box>
              )}

              {/* Other hub tabs (Overview, Requisitions, Dashboard) */}
              {hubTab !== 'candidates' && (
                <Box padding="l">
                  <Heading size="large" marginBottom="m">
                    {hubTab.charAt(0).toUpperCase() + hubTab.slice(1)}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500}>
                    (Content for {hubTab} tab would appear here)
                  </BodyText>
                </Box>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Candidate Review Modal with CV Carousel */}
      <Modal model={profileModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(92vw, 1400px)',
              maxWidth: '92vw',
              maxHeight: 'min(92vh, 900px)',
              margin: space.l,
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
            }}
          >
            {/* Modal Header */}
            <Modal.Heading
              style={{
                padding: space.m,
                borderBottom: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Flex gap="s" alignItems="center">
                  <ToolbarIconButton
                    icon={arrowLeftSmallIcon}
                    aria-label={COPY.prevCandidate}
                    onClick={goPrev}
                    disabled={selectedIndex <= 0}
                  />
                  {activeCandidate && (
                    <>
                      <Avatar name={activeCandidate.name} size="small" />
                      <Box>
                        <Heading size="small">{activeCandidate.name}</Heading>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {activeCandidate.jobTitle}
                        </BodyText>
                      </Box>
                      <StatusBadge stage={activeCandidate.stage} />
                    </>
                  )}
                </Flex>
                <Flex gap="s">
                  <ToolbarIconButton
                    icon={arrowRightSmallIcon}
                    aria-label={COPY.nextCandidate}
                    onClick={goNext}
                    disabled={
                      selectedIndex < 0 || selectedIndex >= filteredCandidates.length - 1
                    }
                  />
                  <Modal.CloseIcon />
                </Flex>
              </Flex>
            </Modal.Heading>

            {/* Modal Body */}
            <Modal.Body
              style={{
                padding: space.l,
                flex: 1,
                overflow: 'auto',
              }}
            >
              {activeCandidate ? (
                <>
                  {/* Two-column layout: Sidebar + CV Carousel */}
                  <Flex gap="l" alignItems="stretch">
                    {/* LEFT: Summary Sidebar */}
                    <Box width="300px" flexShrink={0}>
                      <CandidateSummaryPanel candidate={activeCandidate} />
                    </Box>

                    {/* CENTER: CV Carousel */}
                    <Box flex={1} minWidth={0}>
                      <CVCarousel
                        documents={activeCandidate.documents}
                        candidateId={activeCandidate.id}
                      />
                    </Box>
                  </Flex>

                  {/* BELOW FOLD: Notes & Activity */}
                  <Box marginTop="xl">
                    <NotesAndActivityPanel candidateId={activeCandidate.id} />
                  </Box>
                </>
              ) : (
                <Box padding="xl" style={{ textAlign: 'center' }}>
                  <BodyText size="small" color={colors.blackPepper500}>
                    No candidate selected.
                  </BodyText>
                </Box>
              )}
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </>
  );
};
