/**
 * Interview Intelligence Agent prototype (v96)
 * Design brief: design/interview-intelligence-agent-design-brief.md
 * PRD: docs/prds/interview-intelligence-agent-prd.md
 * Mission: INTERVIEW-INTEL-001
 *
 * Route: /interview-intelligence-agent-v96
 */
import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextArea } from '@workday/canvas-kit-react/text-area';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
// Tabs not used - custom tab bar instead for simpler state control
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText, Text } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Radio, RadioGroup } from '@workday/canvas-kit-react/radio';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
  SANA_CARD_SHADOW,
  HiredScoreGrading,
} from './components';
import type { WorkdayLeftTabBarPrimaryItem } from './components/WorkdayLeftTabBar';

/* ------------------------------------------------------------------ */
/*  Constants & mock data                                              */
/* ------------------------------------------------------------------ */

const HUB_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'job-reqs', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'interviews', label: 'Interviews' },
] as const;

const PRIMARY_RAIL: WorkdayLeftTabBarPrimaryItem[] = [
  {
    icon: homeIcon,
    ariaLabel: 'Home',
    railLabel: 'Home',
    onClick: () => { window.location.hash = '/gcc-recruiter-dashboard'; },
  },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const CANDIDATE = {
  name: 'Sarah Chen',
  role: 'Senior Software Engineer, Platform Team',
  hsFit: 92,
  interviewDate: 'Tuesday 8 April 2026 · 14:00–15:00',
  highlights: {
    strengths: [
      '8 years distributed systems experience (Go, Rust, Kubernetes)',
      'Led migration of monolith to microservices at previous role (40% latency reduction)',
      'Strong open-source contributions (3 CNCF projects)',
    ],
    probes: [
      'No direct experience with Workday-scale multi-tenant SaaS',
      'Career gap 2023–2024 (context needed)',
      'Limited people management experience for senior-level role',
    ],
  },
};

type Competency = 'technical-design' | 'collaboration' | 'problem-solving' | 'communication';

const COMPETENCY_LABELS: Record<Competency, string> = {
  'technical-design': 'Technical Design',
  collaboration: 'Collaboration',
  'problem-solving': 'Problem Solving',
  communication: 'Communication',
};

const PREP_QUESTIONS: {
  competency: Competency;
  question: string;
  followUps: string[];
}[] = [
  {
    competency: 'technical-design',
    question: 'Describe a system you designed that needed to handle significant scale increases. Walk me through your design decisions and trade-offs.',
    followUps: [
      'How did you validate your design before implementation?',
      'What would you change if you could redesign it today?',
      'How did you communicate trade-offs to non-technical stakeholders?',
    ],
  },
  {
    competency: 'technical-design',
    question: 'Tell me about a time you had to make a critical architectural decision with incomplete information. How did you approach it?',
    followUps: [
      'What signals told you it was time to decide rather than gather more data?',
      'How did the decision hold up over time?',
    ],
  },
  {
    competency: 'collaboration',
    question: 'Describe a situation where you needed to align multiple engineering teams on a shared technical direction. How did you build consensus?',
    followUps: [
      'How did you handle disagreement from a senior engineer?',
      'What documentation or artefacts did you create to maintain alignment?',
    ],
  },
  {
    competency: 'problem-solving',
    question: 'Walk me through a production incident you led the resolution for. How did you diagnose the root cause and prevent recurrence?',
    followUps: [
      'How did you prioritise between fixing the immediate issue and finding the root cause?',
      'What process changes resulted from the incident?',
    ],
  },
  {
    competency: 'communication',
    question: 'Tell me about a time you had to explain a complex technical concept to a non-technical audience. What approach did you take?',
    followUps: [
      'How did you know your explanation was effective?',
      'What would you do differently next time?',
    ],
  },
];

const PANELLISTS = [
  { id: 'mp', name: 'Maya Patel', role: 'Engineering Manager', initials: 'MP' },
  { id: 'jl', name: 'James Liu', role: 'Staff Engineer', initials: 'JL' },
  { id: 'ps', name: 'Priya Sharma', role: 'Product Manager', initials: 'PS' },
  { id: 'at', name: 'Alex Thompson', role: 'Team Lead', initials: 'AT' },
];

type Rating = 1 | 2 | 3 | 4 | 5;

const RATINGS: Record<Competency, Record<string, Rating>> = {
  'technical-design': { mp: 5, jl: 5, ps: 4, at: 4 },
  collaboration: { mp: 4, jl: 3, ps: 5, at: 4 },
  'problem-solving': { mp: 4, jl: 5, ps: 3, at: 5 },
  communication: { mp: 3, jl: 2, ps: 5, at: 4 },
};

const FEEDBACK_QUOTES: Record<Competency, Record<string, string>> = {
  'technical-design': {
    mp: 'Exceptional systems thinking. Her microservices migration case study showed real depth in distributed systems design.',
    jl: 'Strong architectural instincts. She immediately identified the right trade-offs for our scale requirements.',
    ps: 'Good technical depth but I wanted to see more consideration of product constraints in design decisions.',
    at: 'Solid design skills. Would benefit from more exposure to multi-tenant patterns specific to our platform.',
  },
  collaboration: {
    mp: 'Works well across teams. Gave strong examples of building consensus with competing priorities.',
    jl: 'Decent collaboration skills but her examples were mostly within her own team, not cross-functional.',
    ps: 'Excellent cross-functional communication. She naturally bridged engineering and product perspectives.',
    at: 'Good team player. Her open-source experience shows she can collaborate asynchronously at scale.',
  },
  'problem-solving': {
    mp: 'Methodical approach to incidents. Her root cause analysis process was thorough and well-documented.',
    jl: 'Outstanding debugging instincts. She described a systematic approach that would work well in our environment.',
    ps: 'Problem-solving was adequate but I felt she relied too heavily on technical tools without considering process improvements.',
    at: 'Strong problem solver. Her incident response example showed leadership under pressure.',
  },
  communication: {
    mp: 'Communication was fine but not exceptional. Her technical explanations could be more concise for executive audiences.',
    jl: 'Struggled to simplify complex concepts. Her explanations were accurate but too detailed for non-engineers.',
    ps: 'Clear and confident communicator. She adapted her language naturally for different audiences in the interview.',
    at: 'Good communicator overall. She asked clarifying questions and structured her responses well.',
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ratingColor = (r: Rating) => {
  if (r >= 4) return colors.greenApple400;
  if (r === 3) return colors.soap400;
  return colors.cantaloupe400;
};

const ratingBg = (r: Rating) => {
  if (r >= 4) return '#E8F5E9';
  if (r === 3) return colors.soap100;
  return '#FFF3E0';
};

const consensusStatus = (ratings: Record<string, Rating>): 'agrees' | 'differs' => {
  const vals = Object.values(ratings);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  return max - min <= 1 ? 'agrees' : 'differs';
};

const overallConfidence = (): 'High' | 'Medium' | 'Low' => {
  const statuses = (Object.keys(RATINGS) as Competency[]).map(c => consensusStatus(RATINGS[c]));
  const agreeCount = statuses.filter(s => s === 'agrees').length;
  if (agreeCount >= 3) return 'High';
  if (agreeCount >= 2) return 'Medium';
  return 'Low';
};

const confidenceColor = (c: 'High' | 'Medium' | 'Low') => {
  if (c === 'High') return { bg: '#E8F5E9', fg: colors.greenApple400 };
  if (c === 'Medium') return { bg: '#FFF3E0', fg: colors.cantaloupe400 };
  return { bg: '#FFF3E0', fg: colors.cantaloupe400 };
};

const aiSparkle = (
  <span
    role="img"
    aria-label="AI-generated content"
    style={{ marginRight: 6, fontSize: 14 }}
  >
    ✦
  </span>
);

/* ------------------------------------------------------------------ */
/*  View 1: Prep Card                                                  */
/* ------------------------------------------------------------------ */

function PrepCardView() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) =>
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <Box>
      {/* Candidate header */}
      <Card
        cs={{
          borderRadius: SANA_CARD_RADIUS_LG,
          boxShadow: SANA_CARD_SHADOW,
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <Flex gap="m" alignItems="center">
          <Avatar size={56} />
          <Box cs={{ flex: 1 }}>
            <Flex gap="s" alignItems="center">
              <Heading size="medium">{CANDIDATE.name}</Heading>
              <HiredScoreGrading fit={CANDIDATE.hsFit} variant="compact" />
            </Flex>
            <BodyText size="small" cs={{ color: colors.licorice300 }}>
              {CANDIDATE.role}
            </BodyText>
            <BodyText size="small" cs={{ color: colors.licorice300 }}>
              {CANDIDATE.interviewDate}
            </BodyText>
          </Box>
        </Flex>
      </Card>

      {/* AI prep card */}
      <Card
        cs={{
          borderRadius: SANA_CARD_RADIUS_LG,
          boxShadow: SANA_CARD_SHADOW,
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <Flex gap="xs" alignItems="center" cs={{ marginBottom: '16px' }}>
          {aiSparkle}
          <Heading size="small">
            Suggested interview questions for {CANDIDATE.name} · {CANDIDATE.role.split(',')[0]}
          </Heading>
        </Flex>

        <BodyText size="small" cs={{ color: colors.licorice300, marginBottom: '20px' }}>
          AI-generated suggestion for your debrief. Your team decides the hiring outcome.
        </BodyText>

        {PREP_QUESTIONS.map((q, idx) => (
          <Card
            key={idx}
            cs={{
              borderRadius: 12,
              border: `1px solid ${colors.soap300}`,
              padding: '16px',
              marginBottom: '12px',
              boxShadow: 'none',
            }}
          >
            <Flex gap="s" alignItems="center" cs={{ marginBottom: '8px' }}>
              <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label={COMPETENCY_LABELS[q.competency]} />
            </Flex>
            <BodyText size="medium" cs={{ fontWeight: 600, marginBottom: '8px' }}>
              {q.question}
            </BodyText>
            <TertiaryButton
              size="small"
              onClick={() => toggleExpand(idx)}
              aria-expanded={!!expanded[idx]}
            >
              {expanded[idx] ? 'Hide follow-up questions' : 'Show follow-up questions'}
            </TertiaryButton>
            {expanded[idx] && (
              <Box cs={{ paddingLeft: '16px', marginTop: '8px' }}>
                {q.followUps.map((fu, fi) => (
                  <BodyText key={fi} size="small" cs={{ color: colors.licorice300, marginBottom: '4px' }}>
                    • {fu}
                  </BodyText>
                ))}
              </Box>
            )}
          </Card>
        ))}

        <Flex gap="s" cs={{ marginTop: '16px' }}>
          <TertiaryButton size="small">Customise questions</TertiaryButton>
          <TertiaryButton size="small">Hide prep card</TertiaryButton>
          <Box cs={{ flex: 1 }} />
          <BodyText size="small" cs={{ color: colors.licorice300, alignSelf: 'center' }}>
            Was this helpful?
          </BodyText>
          <TertiaryButton size="small" aria-label="Helpful">👍</TertiaryButton>
          <TertiaryButton size="small" aria-label="Not helpful">👎</TertiaryButton>
        </Flex>
      </Card>

      {/* Candidate highlights */}
      <Card
        cs={{
          borderRadius: SANA_CARD_RADIUS_LG,
          boxShadow: SANA_CARD_SHADOW,
          padding: '24px',
        }}
      >
        <Heading size="small" cs={{ marginBottom: '16px' }}>Candidate highlights</Heading>

        {CANDIDATE.highlights.strengths.map((s, i) => (
          <Box
            key={`s-${i}`}
            cs={{
              borderLeft: `3px solid ${colors.greenApple400}`,
              paddingLeft: '12px',
              marginBottom: '10px',
            }}
          >
            <BodyText size="small">
              <Text cs={{ fontWeight: 600 }}>Strength: </Text>{s}
            </BodyText>
          </Box>
        ))}

        {CANDIDATE.highlights.probes.map((p, i) => (
          <Box
            key={`p-${i}`}
            cs={{
              borderLeft: `3px solid ${colors.cantaloupe400}`,
              paddingLeft: '12px',
              marginBottom: '10px',
            }}
          >
            <BodyText size="small">
              <Text cs={{ fontWeight: 600 }}>Area to explore: </Text>{p}
            </BodyText>
          </Box>
        ))}
      </Card>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  View 2: Panel Feedback                                             */
/* ------------------------------------------------------------------ */

function PanelFeedbackView() {
  const [expandedComp, setExpandedComp] = useState<Competency | null>(null);
  const competencies = Object.keys(RATINGS) as Competency[];

  return (
    <Box>
      {/* Status header */}
      <Card
        cs={{
          borderRadius: SANA_CARD_RADIUS_LG,
          boxShadow: SANA_CARD_SHADOW,
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <Flex gap="m" alignItems="center">
          <Avatar size={56} />
          <Box cs={{ flex: 1 }}>
            <Heading size="medium">{CANDIDATE.name}</Heading>
            <BodyText size="small" cs={{ color: colors.licorice300 }}>
              {CANDIDATE.role}
            </BodyText>
          </Box>
          <StatusIndicator type={StatusIndicatorType.Blue} emphasis={StatusIndicatorEmphasis.Low} label="All 4 panellists submitted feedback" />
        </Flex>
      </Card>

      {/* Advisory banner for communication competency */}
      <Banner cs={{ marginBottom: '20px', borderRadius: 8 }}>
        <Banner.Icon />
        <Banner.Label>
          Panel ratings differ for Communication. Compare feedback before the debrief.
        </Banner.Label>
      </Banner>

      {/* Synthesis heading */}
      <Flex gap="xs" alignItems="center" cs={{ marginBottom: '4px' }}>
        {aiSparkle}
        <Heading size="small">Interview feedback across the panel for {CANDIDATE.name}</Heading>
      </Flex>
      <BodyText size="small" cs={{ color: colors.licorice300, marginBottom: '16px' }}>
        AI-generated synthesis based on panellist feedback. Review before sharing.
      </BodyText>

      {/* Competency matrix */}
      <Card
        cs={{
          borderRadius: SANA_CARD_RADIUS_LG,
          boxShadow: SANA_CARD_SHADOW,
          padding: '0',
          marginBottom: '20px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header cs={{ width: '180px', padding: '12px 16px' }}>Competency</Table.Header>
              {PANELLISTS.map(p => (
                <Table.Header key={p.id} cs={{ textAlign: 'center', padding: '12px 8px' }}>
                  <Flex flexDirection="column" alignItems="center" gap="xxs">
                    <Avatar size={28} />
                    <BodyText size="small" cs={{ fontWeight: 600 }}>{p.name.split(' ')[0]}</BodyText>
                  </Flex>
                </Table.Header>
              ))}
              <Table.Header cs={{ textAlign: 'center', padding: '12px 16px', width: '100px' }}>Status</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {competencies.map(comp => {
              const status = consensusStatus(RATINGS[comp]);
              return (
                <React.Fragment key={comp}>
                  <Table.Row
                    cs={{ cursor: 'pointer' }}
                    onClick={() => setExpandedComp(expandedComp === comp ? null : comp)}
                    aria-expanded={expandedComp === comp}
                  >
                    <Table.Cell cs={{ padding: '12px 16px', fontWeight: 600 }}>
                      {COMPETENCY_LABELS[comp]}
                    </Table.Cell>
                    {PANELLISTS.map(p => {
                      const r = RATINGS[comp][p.id];
                      return (
                        <Table.Cell key={p.id} cs={{ textAlign: 'center', padding: '12px 8px' }}>
                          <Box
                            cs={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              backgroundColor: ratingBg(r),
                              color: ratingColor(r),
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {r}
                          </Box>
                        </Table.Cell>
                      );
                    })}
                    <Table.Cell cs={{ textAlign: 'center', padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex' }}>
                        {status === 'agrees' ? (
                          <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label="Agrees" />
                        ) : (
                          <StatusIndicator type={StatusIndicatorType.Orange} emphasis={StatusIndicatorEmphasis.Low} label="Differs" />
                        )}
                      </span>
                    </Table.Cell>
                  </Table.Row>

                  {/* Expanded evidence quotes */}
                  {expandedComp === comp && (
                    <Table.Row>
                      <Table.Cell
                        colSpan={PANELLISTS.length + 2}
                        cs={{ padding: '16px 24px', backgroundColor: colors.soap100 }}
                      >
                        <Heading size="small" cs={{ marginBottom: '12px' }}>What panellists said</Heading>
                        {PANELLISTS.map(p => (
                          <Box key={p.id} cs={{ marginBottom: '12px' }}>
                            <Flex gap="s" alignItems="center" cs={{ marginBottom: '4px' }}>
                              <Avatar size={24} />
                              <BodyText size="small" cs={{ fontWeight: 600 }}>
                                {p.name}
                              </BodyText>
                              <BodyText size="small" cs={{ color: colors.licorice300 }}>
                                {p.role}
                              </BodyText>
                              <Box
                                cs={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: ratingBg(RATINGS[comp][p.id]),
                                  color: ratingColor(RATINGS[comp][p.id]),
                                  fontWeight: 700,
                                  fontSize: 12,
                                }}
                              >
                                {RATINGS[comp][p.id]}
                              </Box>
                            </Flex>
                            <BodyText
                              size="small"
                              cs={{
                                color: colors.licorice300,
                                paddingLeft: '36px',
                                fontStyle: 'italic',
                              }}
                            >
                              "{FEEDBACK_QUOTES[comp][p.id]}"
                            </BodyText>
                          </Box>
                        ))}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
        </Table>
      </Card>

      <Flex gap="s">
        <PrimaryButton>Share with hiring team</PrimaryButton>
        <SecondaryButton>Ask panellist to clarify</SecondaryButton>
      </Flex>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  View 3: Debrief                                                    */
/* ------------------------------------------------------------------ */

function DebriefView() {
  const [selectedComp, setSelectedComp] = useState<Competency | null>(null);
  const [decision, setDecision] = useState<'advance' | 'no-advance' | null>(null);
  const [rationale, setRationale] = useState('');
  const [saved, setSaved] = useState(false);
  const modalModel = useModalModel();

  const competencies = Object.keys(RATINGS) as Competency[];
  const agrees = competencies.filter(c => consensusStatus(RATINGS[c]) === 'agrees');
  const differs = competencies.filter(c => consensusStatus(RATINGS[c]) === 'differs');
  const confidence = overallConfidence();
  const confColors = confidenceColor(confidence);

  const avgRating = (comp: Competency) => {
    const vals = Object.values(RATINGS[comp]);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const handleSave = () => {
    setSaved(true);
    modalModel.events.hide();
  };

  return (
    <Flex gap="l">
      {/* Left: Agenda */}
      <Box cs={{ flex: 3 }}>
        {/* AI recommendation */}
        <Card
          cs={{
            borderRadius: SANA_CARD_RADIUS_LG,
            boxShadow: SANA_CARD_SHADOW,
            padding: '24px',
            marginBottom: '20px',
            borderLeft: `4px solid ${confColors.fg}`,
          }}
        >
          <Flex gap="s" alignItems="center" cs={{ marginBottom: '8px' }}>
            {aiSparkle}
            <Heading size="small">Suggested next step</Heading>
            <Box
              cs={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: 20,
                backgroundColor: confColors.bg,
                color: confColors.fg,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              Suggestion confidence: {confidence}
            </Box>
          </Flex>

          <BodyText size="medium" cs={{ marginBottom: '8px' }}>
            Based on panel feedback, {CANDIDATE.name} demonstrates strong technical design and
            problem-solving skills with consistent agreement across the panel. Communication shows
            divergent views that warrant structured discussion before a decision.
          </BodyText>

          <BodyText size="small" cs={{ color: colors.licorice300, fontStyle: 'italic' }}>
            AI-generated suggestion for your debrief. Your team decides the hiring outcome.
          </BodyText>
        </Card>

        {/* Consensus items */}
        <Heading size="small" cs={{ marginBottom: '12px', color: colors.greenApple400 }}>
          Ready to confirm: panel agrees
        </Heading>

        {agrees.map(comp => (
          <Card
            key={comp}
            cs={{
              borderRadius: 12,
              borderLeft: `3px solid ${colors.greenApple400}`,
              padding: '16px',
              marginBottom: '10px',
              boxShadow: 'none',
              border: `1px solid ${colors.soap300}`,
              cursor: 'pointer',
              ...(selectedComp === comp ? { backgroundColor: colors.soap100 } : {}),
            }}
            onClick={() => setSelectedComp(comp)}
            aria-selected={selectedComp === comp}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <BodyText size="medium" cs={{ fontWeight: 600 }}>
                  {COMPETENCY_LABELS[comp]}
                </BodyText>
                <BodyText size="small" cs={{ color: colors.licorice300 }}>
                  Average rating: {avgRating(comp)} / 5 · All panellists within 1 point
                </BodyText>
              </Box>
              <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label="Agrees" />
            </Flex>
          </Card>
        ))}

        {/* Disagreement items */}
        <Heading size="small" cs={{ marginBottom: '12px', marginTop: '24px', color: colors.cantaloupe400 }}>
          Discussion needed: panel views differ
        </Heading>

        {differs.map(comp => {
          const vals = Object.values(RATINGS[comp]);
          const maxR = Math.max(...vals);
          const minR = Math.min(...vals);
          return (
            <Card
              key={comp}
              cs={{
                borderRadius: 12,
                borderLeft: `3px solid ${colors.cantaloupe400}`,
                padding: '16px',
                marginBottom: '10px',
                boxShadow: 'none',
                border: `1px solid ${colors.soap300}`,
                cursor: 'pointer',
                ...(selectedComp === comp ? { backgroundColor: colors.soap100 } : {}),
              }}
              onClick={() => setSelectedComp(comp)}
              aria-selected={selectedComp === comp}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <BodyText size="medium" cs={{ fontWeight: 600 }}>
                    {COMPETENCY_LABELS[comp]}
                  </BodyText>
                  <BodyText size="small" cs={{ color: colors.licorice300 }}>
                    Ratings range from {minR} to {maxR} · {Math.abs(maxR - minR)}-point spread
                  </BodyText>
                </Box>
                <StatusIndicator type={StatusIndicatorType.Orange} emphasis={StatusIndicatorEmphasis.Low} label="Differs" />
              </Flex>

              <Box cs={{ marginTop: '12px', padding: '12px', backgroundColor: '#FFF8E1', borderRadius: 8 }}>
                <BodyText size="small" cs={{ fontWeight: 600 }}>
                  Discussion prompt:
                </BodyText>
                <BodyText size="small" cs={{ color: colors.licorice300 }}>
                  {comp === 'communication'
                    ? 'Two panellists rated communication significantly lower than the others. Explore whether this reflects audience-specific communication (technical vs non-technical) or a broader concern.'
                    : 'Panel views differ on this competency. Discuss specific examples from each panellist to identify whether the gap reflects different evaluation criteria or genuine performance variation.'}
                </BodyText>
              </Box>
            </Card>
          );
        })}

        {/* Actions */}
        <Flex gap="s" cs={{ marginTop: '24px' }}>
          <Modal model={modalModel}>
            <Modal.Target>
              <PrimaryButton>Record decision</PrimaryButton>
            </Modal.Target>
            <Modal.Overlay>
              <Modal.Card cs={{ width: 500 }}>
                <Modal.CloseIcon aria-label="Close" />
                <Modal.Heading>Record debrief outcome</Modal.Heading>
                <Modal.Body>
                  <BodyText size="small" cs={{ color: colors.licorice300, marginBottom: '16px' }}>
                    This records the debrief outcome for the team. It does not change candidate status.
                  </BodyText>

                  <RadioGroup
                    value={decision ?? ''}
                    onChange={(val) => setDecision(val as 'advance' | 'no-advance')}
                  >
                    <Radio label="Advance candidate" value="advance" />
                    <Radio label="Do not advance" value="no-advance" />
                  </RadioGroup>

                  <FormField cs={{ marginTop: '16px' }}>
                    <FormField.Label>Decision rationale</FormField.Label>
                    <TextArea
                      value={rationale}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRationale(e.target.value)}
                      placeholder="Summarise the key factors in this decision..."
                    />
                  </FormField>

                  {!rationale && decision && (
                    <BodyText size="small" cs={{ color: colors.cinnamon500, marginTop: '4px' }}>
                      Add a short rationale so the team understands this outcome.
                    </BodyText>
                  )}

                  <Flex gap="s" cs={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                    <Modal.CloseButton>
                      <SecondaryButton>Cancel</SecondaryButton>
                    </Modal.CloseButton>
                    <PrimaryButton
                      onClick={handleSave}
                      disabled={!decision || !rationale}
                    >
                      Save decision
                    </PrimaryButton>
                  </Flex>
                </Modal.Body>
              </Modal.Card>
            </Modal.Overlay>
          </Modal>

          <SecondaryButton>Export debrief notes</SecondaryButton>
        </Flex>

        {saved && (
          <Banner cs={{ marginTop: '16px', borderRadius: 8 }}>
            <Banner.Icon />
            <Banner.Label>Debrief outcome saved.</Banner.Label>
          </Banner>
        )}
      </Box>

      {/* Right: Evidence panel */}
      <Box cs={{ flex: 2, position: 'sticky' as const, top: WORKDAY_TOP_NAV_HEIGHT_PX + 20, alignSelf: 'flex-start' }}>
        <Card
          cs={{
            borderRadius: SANA_CARD_RADIUS_LG,
            boxShadow: SANA_CARD_SHADOW,
            padding: '24px',
            minHeight: 300,
          }}
        >
          {selectedComp ? (
            <>
              <Heading size="small" cs={{ marginBottom: '16px' }}>
                What panellists said — {COMPETENCY_LABELS[selectedComp]}
              </Heading>
              {PANELLISTS.map(p => (
                <Box key={p.id} cs={{ marginBottom: '16px' }}>
                  <Flex gap="s" alignItems="center" cs={{ marginBottom: '4px' }}>
                    <Avatar size={28} />
                    <BodyText size="small" cs={{ fontWeight: 600 }}>{p.name}</BodyText>
                    <Box
                      cs={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: ratingBg(RATINGS[selectedComp][p.id]),
                        color: ratingColor(RATINGS[selectedComp][p.id]),
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {RATINGS[selectedComp][p.id]}
                    </Box>
                  </Flex>
                  <BodyText size="small" cs={{ color: colors.licorice300, fontStyle: 'italic', paddingLeft: '40px' }}>
                    "{FEEDBACK_QUOTES[selectedComp][p.id]}"
                  </BodyText>
                </Box>
              ))}
            </>
          ) : (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cs={{ height: 250, color: colors.licorice300 }}
            >
              <BodyText size="medium">Select a competency to view panellist evidence</BodyText>
            </Flex>
          )}
        </Card>
      </Box>
    </Flex>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function InterviewIntelligenceAgentV96() {
  const [activeTab, setActiveTab] = useState<'prep' | 'feedback' | 'debrief'>('prep');
  const [topSearch, setTopSearch] = useState('');

  return (
    <Box cs={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchPlaceholder="Search candidates, jobs, people..."
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={2}
        inboxBadge={3}
      />

      <Flex cs={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          secondaryTitle="Recruiting"
          secondarySubtitle="Interview Intelligence"
          showSecondaryTitleIcon
          tabs={HUB_TABS.map(t => ({ id: t.id, label: t.label }))}
          activeTabId="interviews"
          onTabChange={() => {}}
        />

        <Box
          cs={{
            flex: 1,
            padding: '24px 32px',
            maxWidth: 1200,
          }}
        >
          {/* Page title */}
          <Heading size="large" cs={{ marginBottom: '8px' }}>Interview Intelligence</Heading>
          <BodyText size="small" cs={{ color: colors.licorice300, marginBottom: '24px' }}>
            {CANDIDATE.name} · {CANDIDATE.role}
          </BodyText>

          {/* View tabs */}
          <Flex gap="s" cs={{ marginBottom: '24px', borderBottom: `2px solid ${colors.soap300}`, paddingBottom: 0 }}>
            {(['prep', 'feedback', 'debrief'] as const).map(tab => {
              const labels = { prep: 'Prep card', feedback: 'Panel feedback', debrief: 'Debrief' };
              const isActive = activeTab === tab;
              return (
                <Box
                  key={tab}
                  as="button"
                  onClick={() => setActiveTab(tab)}
                  cs={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? `2px solid ${SANA_LINK_ACCENT}` : '2px solid transparent',
                    padding: '8px 16px',
                    marginBottom: '-2px',
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? SANA_LINK_ACCENT : colors.licorice300,
                    fontSize: 14,
                    fontFamily: 'inherit',
                  }}
                  aria-selected={isActive}
                  role="tab"
                >
                  {labels[tab]}
                </Box>
              );
            })}
          </Flex>

          {activeTab === 'prep' && <PrepCardView />}
          {activeTab === 'feedback' && <PanelFeedbackView />}
          {activeTab === 'debrief' && <DebriefView />}
        </Box>
      </Flex>
    </Box>
  );
}
