import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PrimaryButton, SecondaryButton, ToolbarIconButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText, Text } from '@workday/canvas-kit-react/text';
import { Table } from '@workday/canvas-kit-react/table';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { arrowLeftSmallIcon, arrowRightSmallIcon, chevronRightSmallIcon, xSmallIcon } from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_SHELL_RADIUS,
  SANA_CARD_SHADOW_LIFTED,
  SANA_LINK_ACCENT,
} from './components';

/**
 * GCC Candidate Grid, Search & AI-Assisted Matching (concept)
 *
 * MISSION-017 | PMF v40 E2E HITL #6
 * PRD: docs/prds/gcc-candidate-grid-search-prd.md
 * Discovery: design/gcc-candidate-grid-search-discovery-brief.md
 */

const REQ_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'interviews', label: 'Interviews' },
] as const;

interface Row {
  id: string;
  name: string;
  stage: string;
  location: string;
  skills: string;
  lastActivity: string;
}

interface ProfileExtra {
  email: string;
  phone: string;
  applied: string;
  source: string;
  workAuth: string;
  languages: string;
  resume: string;
}

const PROFILE_EXTRA: Record<string, ProfileExtra> = {
  '1': {
    email: 'sara.almansoori@email.com',
    phone: '+971 50 555 0142',
    applied: '18 March 2026',
    source: 'Career site — LinkedIn',
    workAuth: 'UAE residence, no sponsorship',
    languages: 'Arabic (native), English (fluent)',
    resume: `SARA AL-MANSOORI
Dubai, UAE · sara.almansoori@email.com

SUMMARY
Product manager with 6+ years in B2B SaaS and consulting delivery. Led discovery for HR tech rollouts across GCC; strong stakeholder alignment and Arabic/English facilitation.

EXPERIENCE
Senior Product Manager — Regional Solutions (2022–present)
• Owned roadmap for localisation and compliance features for enterprise ATS customers in UAE and KSA.
• Partnered with implementation and CS on Nitaqat reporting narratives for exec reviews.

Product Manager — Cloud Services (2019–2022)
• Shipped onboarding flows reducing time-to-value; A/B tested career site journeys.

EDUCATION
MBA, INSEAD · BSc Computer Science, American University of Sharjah

CERTIFICATIONS
Scrum Product Owner (CSPO)`,
  },
  '2': {
    email: 'j.okonkwo@email.com',
    phone: '+966 55 123 8890',
    applied: '16 March 2026',
    source: 'Employee referral',
    workAuth: 'KSA iqama — transferable',
    languages: 'English (fluent), Arabic (basic)',
    resume: `JAMES OKONKWO
Riyadh, Saudi Arabia

SUMMARY
Backend-leaning full-stack engineer (IC4) focused on platform reliability and Kubernetes operations at scale.

EXPERIENCE
Staff Software Engineer — Infra Platform (2021–present)
• Ran cluster upgrades and SLO dashboards for multi-tenant services.
• Mentored IC2–IC3 engineers on incident response.

Software Engineer — Payments (2017–2021)
• Built reconciliation pipelines and on-call playbooks.

EDUCATION
MEng Software Engineering, University of Lagos`,
  },
  '3': {
    email: 'priya.nair@email.com',
    phone: '+971 4 555 2211',
    applied: '12 March 2026',
    source: 'Talent pipeline',
    workAuth: 'UAE freelance permit',
    languages: 'English (fluent), Hindi (native), Malayalam (conversational)',
    resume: `PRIYA NAIR
Remote — GCC

SUMMARY
Data-focused PM (IC3): SQL-heavy analysis, stakeholder workshops, and delivery with analytics engineering teams.

EXPERIENCE
Product Manager — Data Products (2020–present)
• Defined metrics for hiring funnel dashboards; partnered with TA ops on Power BI extracts.
• Prioritised GDPR-aligned retention views for candidate data.

Associate PM — Operations (2018–2020)
• Process mapping for high-volume recruiting coordinators.

EDUCATION
BSc Statistics, University of Mumbai`,
  },
  '4': {
    email: 'omar.haddad@email.com',
    phone: '+965 9988 4410',
    applied: '8 March 2026',
    source: 'Indeed (Broadbean)',
    workAuth: 'Kuwait — sponsorship required',
    languages: 'Arabic (native), English (professional)',
    resume: `OMAR HADDAD
Kuwait City

SUMMARY
Operations specialist (IC2) with logistics and vendor coordination experience; seeking transition into tech-enabled recruiting operations roles.

EXPERIENCE
Operations Coordinator — Logistics (2019–present)
• Scheduled shipments, tracked SLAs, and ran weekly capacity reviews with 3PL partners.

Team Lead — Warehouse (2016–2019)
• Supervised 12 FTE; owned safety audits.

EDUCATION
Diploma, Supply Chain Management`,
  },
};

const MOCK_ROWS: Row[] = [
  {
    id: '1',
    name: 'Sara Al-Mansoori',
    stage: 'Interview',
    location: 'Dubai, UAE',
    skills: 'IC3 PM, Arabic EN bilingual, SaaS',
    lastActivity: '2h ago',
  },
  {
    id: '2',
    name: 'James Okonkwo',
    stage: 'Screen',
    location: 'Riyadh, KSA',
    skills: 'IC4 Eng, Kubernetes, Arabic basic',
    lastActivity: '1d ago',
  },
  {
    id: '3',
    name: 'Priya Nair',
    stage: 'Review',
    location: 'Remote GCC',
    skills: 'IC3 Data, SQL, stakeholder mgmt',
    lastActivity: '3d ago',
  },
  {
    id: '4',
    name: 'Omar Haddad',
    stage: 'New',
    location: 'Kuwait City',
    skills: 'IC2 Ops, logistics, Arabic',
    lastActivity: '5d ago',
  },
];

const SUGGESTED_ORDER = ['1', '3', '2', '4'];
/** HiredScore-style fit % per candidate (illustrative). */
const MOCK_HIRED_SCORE_FIT: Record<string, number> = {
  '1': 92,
  '3': 87,
  '2': 74,
  '4': 61,
};

/** Illustrative Workday AI rerank % (can diverge slightly from HiredScore fit). */
const MOCK_AI_RERANK_MATCH: Record<string, number> = {
  '1': 94,
  '3': 90,
  '2': 71,
  '4': 55,
};

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

const HiredScoreFitCell: React.FC<{ fit: number; showBar?: boolean }> = ({ fit, showBar = true }) => {
  const { letter, shortLabel } = hiredScoreBand(fit);
  const { bg, fg, bar } = gradePillColors(letter);
  const clamped = Math.min(100, Math.max(0, fit));

  return (
    <Box style={{ minWidth: 120 }}>
      <Flex alignItems="center" gap="xs" marginBottom={showBar ? 'xxs' : undefined}>
        <Box
          aria-label={`HiredScore fit grade ${letter}, ${clamped} percent`}
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
            maxWidth: 140,
          }}
        >
          <Box style={{ width: `${clamped}%`, height: '100%', backgroundColor: bar }} />
        </Box>
      )}
    </Box>
  );
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: 999,
  border: `1px solid ${active ? SANA_LINK_ACCENT : colors.soap300}`,
  backgroundColor: active ? colors.soap100 : colors.frenchVanilla100,
  color: colors.blackPepper600,
  fontWeight: active ? 600 : 400,
});

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Box marginBottom="s">
      <BodyText size="small" color={colors.blackPepper500}>
        {label}
      </BodyText>
      <BodyText size="small" style={{ fontWeight: 500, color: colors.blackPepper600 }}>
        {value}
      </BodyText>
    </Box>
  );
}

export const GccCandidateGridSearch: React.FC = () => {
  const [topSearch, setTopSearch] = useState('');
  const [leftTab, setLeftTab] = useState<string>('candidates');
  const [unifiedView, setUnifiedView] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [query, setQuery] = useState('(Arabic OR "Arabic speaking") AND location:Dubai*');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);

  const orderedRows = useMemo(() => {
    if (!aiLoaded) return MOCK_ROWS;
    const map = new Map(MOCK_ROWS.map((r) => [r.id, r]));
    return SUGGESTED_ORDER.map((id) => map.get(id)!).filter(Boolean);
  }, [aiLoaded]);

  const listCount = orderedRows.length;

  const openProfileAtRowId = useCallback(
    (rowId: string) => {
      const idx = orderedRows.findIndex((r) => r.id === rowId);
      if (idx < 0) return;
      setProfileIndex(idx);
      setProfileOpen(true);
    },
    [orderedRows]
  );

  const goPrevCandidate = useCallback(() => {
    setProfileIndex((i) => (i - 1 + listCount) % listCount);
  }, [listCount]);

  const goNextCandidate = useCallback(() => {
    setProfileIndex((i) => (i + 1) % listCount);
  }, [listCount]);

  useEffect(() => {
    if (!profileOpen || listCount === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNextCandidate();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevCandidate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [profileOpen, goNextCandidate, goPrevCandidate, listCount]);

  useEffect(() => {
    if (!profileOpen) return;
    setProfileIndex((i) => Math.max(0, Math.min(i, listCount - 1)));
  }, [listCount, profileOpen]);

  const handleGetSuggestions = () => {
    setAiLoaded(true);
  };

  const activeRow = listCount > 0 ? orderedRows[profileIndex] : null;
  const activeExtra = activeRow ? PROFILE_EXTRA[activeRow.id] : null;

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={12}
        inboxBadge={88}
        searchMaxWidthPx={560}
      />

      <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          secondaryTitle="Senior consultant — GCC"
          secondarySubtitle="R-2026-1842 · Open"
          tabs={[...REQ_TABS]}
          activeTabId={leftTab}
          onTabChange={setLeftTab}
        />

        <Box flex={1} minWidth={0} style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Box
            paddingX="l"
            paddingY="xs"
            style={{
              backgroundColor: colors.frenchVanilla100,
              borderBottom: `1px solid ${colors.soap300}`,
            }}
          >
            <Flex alignItems="center" style={{ fontSize: 13, color: colors.blackPepper500, height: 32 }}>
              <BodyText size="small">Recruiting</BodyText>
              <SystemIcon icon={chevronRightSmallIcon} size={16} color={colors.blackPepper400} style={{ margin: '0 4px' }} />
              <BodyText size="small">Job requisitions</BodyText>
              <SystemIcon icon={chevronRightSmallIcon} size={16} color={colors.blackPepper400} style={{ margin: '0 4px' }} />
              <BodyText size="small">R-2026-1842</BodyText>
              <SystemIcon icon={chevronRightSmallIcon} size={16} color={colors.blackPepper400} style={{ margin: '0 4px' }} />
              <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
                {leftTab === 'overview' && 'Overview'}
                {leftTab === 'candidates' && 'Candidates'}
                {leftTab === 'interviews' && 'Interviews'}
              </BodyText>
            </Flex>
          </Box>

          {leftTab === 'overview' && (
            <Box padding="l">
              <Heading size="large" marginBottom="m">
                Requisition Overview
              </Heading>
              <Card padding="l" style={{ marginBottom: space.m }}>
                <Heading size="small" marginBottom="s">Senior Product Manager — GCC</Heading>
                <Flex gap="m" marginBottom="m" style={{ flexWrap: 'wrap' }}>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Status</BodyText>
                    <BodyText size="small" style={{ fontWeight: 600 }}>Open</BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Location</BodyText>
                    <BodyText size="small" style={{ fontWeight: 600 }}>Dubai, UAE</BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Hiring Manager</BodyText>
                    <BodyText size="small" style={{ fontWeight: 600 }}>Sarah Chen</BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Recruiter</BodyText>
                    <BodyText size="small" style={{ fontWeight: 600 }}>Ahmed Al-Rashid</BodyText>
                  </Box>
                </Flex>
                <BodyText size="small" color={colors.blackPepper600}>
                  Senior product management role focused on GCC market expansion, localization features, and compliance requirements for enterprise SaaS recruiting platform.
                </BodyText>
              </Card>
              <Card padding="l">
                <Heading size="small" marginBottom="s">Pipeline Summary</Heading>
                <Flex gap="m" style={{ flexWrap: 'wrap' }}>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Total Candidates</BodyText>
                    <Heading size="medium">47</Heading>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>In Review</BodyText>
                    <Heading size="medium">12</Heading>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Interview</BodyText>
                    <Heading size="medium">8</Heading>
                  </Box>
                  <Box>
                    <BodyText size="small" color={colors.blackPepper500}>Offer</BodyText>
                    <Heading size="medium">2</Heading>
                  </Box>
                </Flex>
              </Card>
            </Box>
          )}

          {leftTab === 'interviews' && (
            <Box padding="l">
              <Heading size="large" marginBottom="m">
                Interviews
              </Heading>
              <Card padding="l">
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  8 interviews scheduled for this requisition. Integration with Paradox for GCC-compliant scheduling (KSA 3-day notice, panel requirements) planned for Q2 2026.
                </BodyText>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Candidate</Table.Header>
                      <Table.Header>Date</Table.Header>
                      <Table.Header>Type</Table.Header>
                      <Table.Header>Status</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><BodyText size="small" style={{ fontWeight: 600 }}>Sara Al-Mansoori</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">22 March 2026</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">Panel (final)</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small" color={colors.greenApple600}>Confirmed</BodyText></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><BodyText size="small" style={{ fontWeight: 600 }}>James Okonkwo</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">24 March 2026</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">Technical screen</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small" color={colors.greenApple600}>Confirmed</BodyText></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><BodyText size="small" style={{ fontWeight: 600 }}>Priya Nair</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">25 March 2026</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small">Hiring manager</BodyText></Table.Cell>
                      <Table.Cell><BodyText size="small" color={colors.cantaloupe600}>Pending</BodyText></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Card>
            </Box>
          )}

          {leftTab === 'candidates' && (
            <Box padding="l">
              <Heading size="large" marginBottom="m">
                Candidates
              </Heading>
              <Card padding="l">
                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  Senior Product Manager — GCC · Dubai, UAE · 47 active candidates
                </BodyText>

                <Flex gap="s" marginBottom="m" flexWrap="wrap" alignItems="flex-end">
                  <Box style={{ flex: '1 1 240px', minWidth: 200 }}>
                    <FormField label="Search candidates" inputId="gcc-cand-search-q">
                      <TextInput
                        id="gcc-cand-search-q"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Try: (skill:"Project management") AND location:Riyadh*'
                      />
                    </FormField>
                  </Box>
                  <SecondaryButton onClick={() => setHelpOpen(true)}>Boolean syntax</SecondaryButton>
                  <PrimaryButton onClick={handleGetSuggestions}>Get suggestions</PrimaryButton>
                </Flex>

                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  <strong>HiredScore fit grades (A–D)</strong> show for all candidates as baseline. {aiLoaded ? 'Table order now reflects an illustrative Workday AI rerank (advisory only — recruiter approves each action).' : 'Select Get AI suggestions to apply an illustrative rerank and show match scores.'} Click any row to open profile modal; use arrows to compare candidates.
                </BodyText>

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
                        <Table.Header>Name</Table.Header>
                        <Table.Header>HiredScore fit</Table.Header>
                        <Table.Header>Stage</Table.Header>
                        {unifiedView && <Table.Header>Location</Table.Header>}
                        {unifiedView && <Table.Header>Skills summary</Table.Header>}
                        {aiLoaded && <Table.Header>AI match</Table.Header>}
                        <Table.Header>Last activity</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {orderedRows.map((row) => (
                        <Table.Row
                          key={row.id}
                          onClick={() => openProfileAtRowId(row.id)}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openProfileAtRowId(row.id);
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
                            <HiredScoreFitCell fit={MOCK_HIRED_SCORE_FIT[row.id]} />
                          </Table.Cell>
                          <Table.Cell>{row.stage}</Table.Cell>
                          {unifiedView && <Table.Cell>{row.location}</Table.Cell>}
                          {unifiedView && (
                            <Table.Cell>
                              <BodyText size="small">{row.skills}</BodyText>
                            </Table.Cell>
                          )}
                          {aiLoaded && (
                            <Table.Cell>
                              <BodyText size="small" style={{ fontWeight: 600 }}>
                                {MOCK_AI_RERANK_MATCH[row.id]}%
                              </BodyText>
                              <BodyText size="small" color={colors.blackPepper500}>
                                Rerank vs HiredScore fit
                              </BodyText>
                            </Table.Cell>
                          )}
                          <Table.Cell>{row.lastActivity}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Box>

                {aiLoaded && (
                  <Box marginTop="m">
                    <Heading size="small" marginBottom="s">
                      AI-assisted shortlisting
                    </Heading>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                      Advisory only — all actions require recruiter approval
                    </BodyText>
                    <Banner hasError={true} marginBottom="m" style={{ width: '100%' }}>
                      <Banner.Icon />
                      <Banner.Label>
                        <BodyText size="small">
                          <strong>Human review required.</strong> AI suggestions do not change candidate status automatically. Full compliance review (EU AI Act Art. 14, GDPR Art. 22) required before GA.
                        </BodyText>
                      </Banner.Label>
                    </Banner>
                    <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                      Combines HiredScore baseline fit (A–D) with Workday AI rerank signal. Suggestions are illustrative only.
                    </BodyText>
                    <Flex gap="m" style={{ flexWrap: 'wrap' }}>
                      {SUGGESTED_ORDER.map((id) => {
                        const row = MOCK_ROWS.find((r) => r.id === id)!;
                        return (
                          <Box
                            key={id}
                            padding="m"
                            style={{
                              flex: '1 1 calc(50% - 8px)',
                              minWidth: 280,
                              backgroundColor: colors.soap100,
                              borderRadius: 12,
                              border: `1px solid ${colors.soap300}`,
                            }}
                          >
                            <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
                              <BodyText size="small" style={{ fontWeight: 600 }}>
                                {row.name}
                              </BodyText>
                              <HiredScoreFitCell fit={MOCK_HIRED_SCORE_FIT[id]} showBar={false} />
                            </Flex>
                            <BodyText size="small" color={colors.blackPepper500} marginBottom="s">
                              <strong>Why suggested:</strong> Keywords match; recent activity; location alignment; skill overlap (illustrative rationale).
                            </BodyText>
                            <Flex gap="xs">
                              <PrimaryButton size="small">Add to pipeline</PrimaryButton>
                              <SecondaryButton size="small">Dismiss</SecondaryButton>
                            </Flex>
                          </Box>
                        );
                      })}
                    </Flex>
                  </Box>
                )}
              </Card>
            </Box>
          )}
        </Box>
      </Flex>

      {helpOpen && (
        <Box
          role="presentation"
          onClick={() => setHelpOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 46, 102, 0.35)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.l,
          }}
        >
          <Card
            padding="l"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{
              maxWidth: 480,
              width: '100%',
              backgroundColor: colors.frenchVanilla100,
              borderRadius: SANA_CARD_RADIUS_LG,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              border: `1px solid ${colors.soap300}`,
            }}
          >
            <Heading size="small" marginBottom="m">
              Boolean search syntax
            </Heading>
            <BodyText size="small" marginBottom="s">
              • Use <strong>AND</strong>, <strong>OR</strong>, <strong>NOT</strong> between terms
            </BodyText>
            <BodyText size="small" marginBottom="s">
              • Phrase: <code style={{ color: colors.blackPepper600 }}>&quot;product manager&quot;</code>
            </BodyText>
            <BodyText size="small" marginBottom="s">
              • Field examples: <code style={{ color: colors.blackPepper600 }}>location:Dubai*</code>,{' '}
              <code style={{ color: colors.blackPepper600 }}>skill:&quot;Arabic&quot;</code>
            </BodyText>
            <BodyText size="small" marginBottom="l">
              • Parentheses group logic:{' '}
              <code style={{ color: colors.blackPepper600 }}>(A OR B) AND NOT C</code>
            </BodyText>
            <PrimaryButton onClick={() => setHelpOpen(false)}>Close</PrimaryButton>
          </Card>
        </Box>
      )}

      {profileOpen && activeRow && activeExtra && (
        <Box
          role="presentation"
          onClick={() => setProfileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 46, 102, 0.45)',
            zIndex: 1002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.m,
          }}
        >
          <Card
            padding="zero"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{
              width: 'min(1120px, 96vw)',
              maxHeight: 'min(880px, 90vh)',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colors.frenchVanilla100,
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
            }}
          >
            <Box
              padding="l"
              style={{
                borderBottom: `1px solid ${colors.soap300}`,
                backgroundColor: colors.soap100,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="m">
                <Box>
                  <Heading size="medium" marginBottom="xxs">
                    {activeRow.name}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Candidate profile · use previous and next to compare · arrow keys work when this dialog is open
                  </BodyText>
                </Box>
                <Flex alignItems="center" gap="s" flexWrap="wrap">
                  <ToolbarIconButton
                    icon={arrowLeftSmallIcon}
                    aria-label="Previous candidate"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      goPrevCandidate();
                    }}
                  />
                  <BodyText size="small" style={{ fontWeight: 600, minWidth: 56, textAlign: 'center' }}>
                    {profileIndex + 1} of {listCount}
                  </BodyText>
                  <ToolbarIconButton
                    icon={arrowRightSmallIcon}
                    aria-label="Next candidate"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      goNextCandidate();
                    }}
                  />
                  <SecondaryButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setProfileOpen(false);
                    }}
                  >
                    Close
                  </SecondaryButton>
                </Flex>
              </Flex>
            </Box>

            <Flex flex={1} style={{ minHeight: 0, maxHeight: '72vh' }}>
              <Box
                width={340}
                flexShrink={0}
                padding="l"
                style={{
                  borderRight: `1px solid ${colors.soap300}`,
                  backgroundColor: SANA_PAGE_CANVAS,
                  overflowY: 'auto',
                }}
              >
                <Heading size="small" marginBottom="m">
                  Key details
                </Heading>
                <Box marginBottom="m">
                  <HiredScoreFitCell fit={MOCK_HIRED_SCORE_FIT[activeRow.id]} />
                </Box>
                <DetailLine label="Stage" value={activeRow.stage} />
                <DetailLine label="Location" value={activeRow.location} />
                <DetailLine label="Skills summary" value={activeRow.skills} />
                <DetailLine label="Last activity" value={activeRow.lastActivity} />
                <Box marginTop="l" marginBottom="s" style={{ borderTop: `1px solid ${colors.soap300}`, paddingTop: space.m }}>
                  <Heading size="small" marginBottom="m">
                    Contact & sourcing
                  </Heading>
                </Box>
                <DetailLine label="Email" value={activeExtra.email} />
                <DetailLine label="Phone" value={activeExtra.phone} />
                <DetailLine label="Applied" value={activeExtra.applied} />
                <DetailLine label="Source" value={activeExtra.source} />
                <DetailLine label="Work authorisation" value={activeExtra.workAuth} />
                <DetailLine label="Languages" value={activeExtra.languages} />
                {aiLoaded && (
                  <Box marginTop="m" padding="s" style={{ backgroundColor: colors.soap200, borderRadius: 12 }}>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      AI match (rerank)
                    </BodyText>
                    <BodyText size="small">{MOCK_AI_RERANK_MATCH[activeRow.id]}% — illustrative signal</BodyText>
                  </Box>
                )}
              </Box>

              <Box flex={1} minWidth={0} padding="l" style={{ overflowY: 'auto', backgroundColor: colors.frenchVanilla100 }}>
                <Heading size="small" marginBottom="m">
                  Resume
                </Heading>
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
                  {activeExtra.resume}
                </Box>
              </Box>
            </Flex>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default GccCandidateGridSearch;
