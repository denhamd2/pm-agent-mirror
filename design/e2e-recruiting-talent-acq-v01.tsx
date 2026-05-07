import React, { useMemo, useRef, useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Table } from '@workday/canvas-kit-react/table';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  checkCircleIcon,
  chevronDownSmallIcon,
  homeBuildingIcon,
  homeIcon,
  linkIcon,
  searchIcon,
  userIcon,
  xIcon,
} from '@workday/canvas-system-icons-web';
import {
  SsaAgentTurn,
  SsaStarterSuggestions,
  SsaUserPromptPill,
  SanaCommComposer,
  SparkleMark,
  WorkdayTopNav,
  SANA_COMM_PANEL_SURFACE,
  SANA_PAGE_CANVAS,
  SANA_SECONDARY_TAB_INACTIVE_FG,
} from './components';

type BeatId = 'home' | 'req-agent' | 'shortlist' | 'candidate-review' | 'scheduling' | 'candidate-outreach';

type Candidate = {
  id: string;
  name: string;
  grade: 'A' | 'B';
  currentRole: string;
  experience: string;
  education: string;
  type: string;
  appliedDate: string;
  stage: string;
  status: string;
  fit: number;
  location: string;
};

type Message = {
  id: string;
  role: 'agent' | 'user';
  text: string;
  sources?: string[];
  showSteps?: boolean;
  stepLines?: string[];
  hideFeedback?: boolean;
};

interface FlowState {
  beat: BeatId;
  searchValue: string;
  filterChips: string[];
  selectedCandidateId: string;
  scheduledSlot: string;
  candidateMessageSent: boolean;
}

const HOME_SUGGESTIONS: string[][] = [
  [
    'Show me my most critical role to be filled and identified top candidates',
    'Show me candidates with AI experience',
    'Show me candidates with strong React and Javascript experience',
  ],
  [
    'Find top candidates for Senior Buyer and schedule round 1',
    'Show me candidate fit-gap insights for this requisition',
    'Coordinate interview scheduling in Teams',
  ],
];

const IN_TASK_SUGGESTIONS: string[][] = [
  [
    'Show me candidates with leadership experience',
    'Open Sara Chen and review assessment signals',
    'Schedule round 1 with the panel',
  ],
  [
    'Add leadership filter',
    'Move Sara forward',
    'Send candidate outreach',
  ],
];

const CANDIDATES: Candidate[] = [
  {
    id: 'cand-henryk',
    name: 'Henryk Larson',
    grade: 'A',
    currentRole: 'Senior Buyer',
    experience: '6 years',
    education: 'BA',
    type: 'External',
    appliedDate: '11/14/2025',
    stage: 'Review',
    status: 'Review Candidate',
    fit: 94,
    location: 'Seattle, WA',
  },
  {
    id: 'cand-sara',
    name: 'Sara Chen',
    grade: 'A',
    currentRole: 'Senior Supply Chain Specialist',
    experience: '6 years',
    education: 'Masters',
    type: 'External Referral',
    appliedDate: '02/04/2026',
    stage: 'Review',
    status: 'Review Candidate',
    fit: 92,
    location: 'San Francisco, CA',
  },
  {
    id: 'cand-mia',
    name: 'Mia Andersson',
    grade: 'A',
    currentRole: 'Purchasing Executive',
    experience: '5 years',
    education: 'BA',
    type: 'External',
    appliedDate: '01/01/2026',
    stage: 'Screen',
    status: 'Waiting on HM',
    fit: 90,
    location: 'Austin, TX',
  },
  {
    id: 'cand-bryant',
    name: 'Bryant Buckley',
    grade: 'A',
    currentRole: 'Purchasing Executive',
    experience: '4 years',
    education: 'BA',
    type: 'External',
    appliedDate: '02/04/2026',
    stage: 'Review',
    status: 'Review Candidate',
    fit: 88,
    location: 'Chicago, IL',
  },
  {
    id: 'cand-goodman',
    name: 'Goodman Glenn',
    grade: 'B',
    currentRole: 'Senior Supply Chain Specialist',
    experience: '5 years',
    education: 'Masters',
    type: 'Sourced',
    appliedDate: '01/20/2026',
    stage: 'Review',
    status: 'Review Candidate',
    fit: 84,
    location: 'Denver, CO',
  },
  {
    id: 'cand-hardin',
    name: 'Hardin Horton',
    grade: 'B',
    currentRole: 'Senior Supply Chain Specialist',
    experience: '6 years',
    education: 'High School',
    type: 'Internal',
    appliedDate: '01/23/2026',
    stage: 'Interview',
    status: 'Schedule Interview',
    fit: 82,
    location: 'Portland, OR',
  },
];

const FLOW_SEED: FlowState = {
  beat: 'home',
  searchValue: '',
  filterChips: ['Top Candidates'],
  selectedCandidateId: 'cand-sara',
  scheduledSlot: 'Thu 30 April, 10 AM - 11 AM',
  candidateMessageSent: false,
};

let msgCounter = 0;
const msgId = () => `tad-${++msgCounter}`;

function cardStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${colors.soap300}`,
    borderRadius: 20,
    boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
    ...extra,
  };
}

function smallPill(label: string, tone: 'neutral' | 'blue' | 'purple' | 'green' = 'neutral') {
  const palette = {
    neutral: { bg: '#F3F4F6', border: colors.soap300, fg: colors.blackPepper600 },
    blue: { bg: '#EEF5FF', border: '#B7D5F4', fg: '#0F2E66' },
    purple: { bg: '#F3F0FF', border: '#C7BFFF', fg: '#2E235F' },
    green: { bg: '#E8F8EE', border: '#9BD2AE', fg: '#0E4230' },
  }[tone];

  return (
    <span
      key={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        color: palette.fg,
        padding: '3px 8px',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function LeftRail({ active = 'Recruiting' }: { active?: string }) {
  const items = [
    { label: 'Home', icon: homeIcon },
    { label: 'Recruiting', icon: userIcon },
    { label: 'Personal', icon: userIcon },
    { label: 'Organization', icon: homeBuildingIcon },
    { label: 'External Links', icon: linkIcon },
  ];

  return (
    <Box
      as="nav"
      aria-label="Workday apps"
      style={{
        width: 78,
        flexShrink: 0,
        backgroundColor: '#F3F4F8',
        borderRight: `1px solid ${colors.soap300}`,
        padding: '14px 8px',
      }}
    >
      <Flex flexDirection="column" gap="xs" alignItems="center">
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              style={{
                width: 62,
                minHeight: 54,
                border: 'none',
                borderRadius: 14,
                backgroundColor: isActive ? '#E4E8F1' : 'transparent',
                color: colors.blackPepper600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <SystemIcon icon={item.icon} size={18} color={colors.blackPepper600} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.02em' }}>{item.label}</span>
            </button>
          );
        })}
      </Flex>
    </Box>
  );
}

function MetricCard({ title, value, subtext }: { title: string; value: string; subtext: string }) {
  return (
    <Box style={cardStyle({ padding: 16, flex: 1, minWidth: 200 })}>
      <Flex alignItems="center" justifyContent="space-between">
        <BodyText size="small" style={{ fontWeight: 700 }}>
          {title}
        </BodyText>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          {value}
        </BodyText>
      </Flex>
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 8 }}>
        {subtext}
      </BodyText>
    </Box>
  );
}

function HomeDashboard({
  suggestionSet,
  onRotate,
  onSubmit,
  composer,
  onComposerChange,
}: {
  suggestionSet: number;
  onRotate: () => void;
  onSubmit: (text: string) => void;
  composer: string;
  onComposerChange: (text: string) => void;
}) {
  return (
    <Box style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 28px 40px' }}>
      <Box textAlign="center" marginBottom="m">
        <Heading size="large" style={{ margin: 0 }}>
          Good morning, Emma
        </Heading>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 8 }}>
          How can I help you with recruiting today?
        </BodyText>
      </Box>

      <Box style={cardStyle({ padding: 18, marginBottom: 18 })}>
        <BodyText size="small" style={{ fontWeight: 700, marginBottom: 8 }}>
          Hide Suggestions
        </BodyText>
        <SsaStarterSuggestions
          setIndex={suggestionSet}
          suggestionSets={HOME_SUGGESTIONS}
          onPick={onSubmit}
          onRotate={onRotate}
          variant="cold-start"
        />
        <Flex gap="xs" marginTop="m" style={{ flexWrap: 'wrap' }}>
          {['Top Candidates', 'Schedule Interviews', 'Pipeline Status', 'Review Resumes'].map((label) => (
            <SecondaryButton key={label} size="small" onClick={() => onSubmit(label)}>
              {label}
            </SecondaryButton>
          ))}
        </Flex>
        <Box marginTop="s">
          <SanaCommComposer
            value={composer}
            onChange={onComposerChange}
            onSend={() => onSubmit(composer)}
            placeholder='Try asking me to do something for you - like "Find top candidates" or "Schedule interviews"'
            sendDisabled={!composer.trim()}
          />
        </Box>
        <BodyText
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>

      <Flex gap="m" marginBottom="m" style={{ flexWrap: 'wrap' }}>
        <MetricCard title="Urgent Tasks" value="3" subtext="Review Sara Chen's application · Due in 2 hours" />
        <MetricCard title="Interviews Today" value="4" subtext="Jordan Ellis · 2:00 PM · Cashier" />
        <MetricCard title="Interview Feedback" value="" subtext="Feedback awaiting review · 2 strong hires recommended" />
      </Flex>

      <Box style={cardStyle({ padding: 16 })}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="s">
          <Heading size="small" style={{ margin: 0 }}>
            Candidate Pipeline
          </Heading>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>
            468 total · View Senior Buyer
          </BodyText>
        </Flex>
        <MiniCandidateTable compact />
      </Box>
    </Box>
  );
}

function AgentPanel({
  messages,
  composer,
  onComposerChange,
  onSubmit,
  suggestionSet,
  onRotate,
}: {
  messages: Message[];
  composer: string;
  onComposerChange: (text: string) => void;
  onSubmit: (text: string) => void;
  suggestionSet: number;
  onRotate: () => void;
}) {
  const threadRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      style={{
        width: 360,
        flexShrink: 0,
        backgroundColor: SANA_COMM_PANEL_SURFACE,
        borderLeft: `1px solid ${colors.soap300}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
        <Flex alignItems="center" gap="xxs">
          <SparkleMark size={18} />
          <BodyText size="small" style={{ fontWeight: 700 }}>
            Talent Acquisiti...
          </BodyText>
          <SystemIcon icon={chevronDownSmallIcon} size={16} color={SANA_SECONDARY_TAB_INACTIVE_FG} />
        </Flex>
        <ToolbarIconButton icon={xIcon} aria-label="Close Talent Acquisition Agent" />
      </Flex>
      <Box ref={threadRef} padding="m" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m) =>
          m.role === 'agent' ? (
            <SsaAgentTurn
              key={m.id}
              text={m.text}
              sources={m.sources}
              showSteps={m.showSteps}
              stepLines={m.stepLines}
              hideFeedback={m.hideFeedback}
            />
          ) : (
            <SsaUserPromptPill key={m.id} text={m.text} />
          ),
        )}
        <Box style={{ maxWidth: 330 }}>
          <SsaStarterSuggestions
            setIndex={suggestionSet}
            suggestionSets={IN_TASK_SUGGESTIONS}
            onPick={onSubmit}
            onRotate={onRotate}
            variant="in-task"
          />
        </Box>
      </Box>
      <Box padding="m" style={{ borderTop: `1px solid ${colors.soap300}` }}>
        <SanaCommComposer
          value={composer}
          onChange={onComposerChange}
          onSend={() => onSubmit(composer)}
          placeholder="What would you like to do?"
          sendDisabled={!composer.trim()}
          footer={
            <TertiaryButton size="small" onClick={() => undefined}>
              + Sources
            </TertiaryButton>
          }
        />
        <BodyText
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>
    </Box>
  );
}

function GradeTile({ grade }: { grade: Candidate['grade'] }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: grade === 'A' ? '#E4F0FF' : '#EEF3F8',
        border: `1px solid ${grade === 'A' ? '#B7D5F4' : colors.soap300}`,
        color: colors.blackPepper600,
        fontWeight: 800,
        fontSize: 11,
      }}
    >
      {grade}
    </span>
  );
}

function ReqHeader() {
  return (
    <Box style={{ padding: '14px 22px 0', backgroundColor: '#FFFFFF' }}>
      <Flex alignItems="center" gap="xs" marginBottom="xxs">
        <TertiaryButton size="small" aria-label="Back to recruiting">
          ‹
        </TertiaryButton>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11 }}>
          Recruiting
        </BodyText>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11 }}>
          Senior Buyer
        </BodyText>
      </Flex>
      <Heading size="large" style={{ margin: '0 0 4px', fontSize: 26, lineHeight: 1.1 }}>
        Senior Buyer
      </Heading>
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 12 }}>
        Job Req: <strong style={{ color: colors.blackPepper500 }}>JR0047715</strong> · Location: San Francisco · Target
        hire date: 06/01/2026 · Hiring Manager: Henry Thompson · Recruiter: Emma Smith
      </BodyText>
      <Flex as="nav" gap="m" marginTop="s" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
        {['Overview', 'Candidates', 'Fetch', 'Details', 'Organizations', 'Qualifications', 'Job postings'].map((tab) => (
          <button
            type="button"
            key={tab}
            style={{
              border: 'none',
              borderBottom: tab === 'Candidates' ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
              background: 'transparent',
              padding: '8px 2px',
              color: tab === 'Candidates' ? colors.blackPepper600 : SANA_SECONDARY_TAB_INACTIVE_FG,
              fontWeight: tab === 'Candidates' ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </Flex>
    </Box>
  );
}

function CountStrip() {
  const counts = [
    ['50', 'All Candidates'],
    ['10', 'Screen'],
    ['5', 'Assessment'],
    ['3', 'Interview'],
    ['1', 'Reference'],
    ['1', 'Employment'],
    ['0', 'Offer'],
    ['1', 'Background'],
    ['0', 'Ready for hire'],
  ];
  return (
    <Flex gap="zero" paddingX="m" paddingTop="s" style={{ overflowX: 'auto', borderBottom: `1px solid ${colors.soap300}` }}>
      {counts.map(([value, label]) => (
        <Box
          key={label}
          style={{
            minWidth: 72,
            padding: '7px 8px 8px',
            borderBottom: label === 'All Candidates' ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
          }}
        >
          <BodyText size="small" style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>
            {value}
          </BodyText>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 10, marginTop: 3, whiteSpace: 'nowrap' }}>
            {label}
          </BodyText>
        </Box>
      ))}
    </Flex>
  );
}

function MiniCandidateTable({ compact = false }: { compact?: boolean }) {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Applicant</Table.Header>
          {!compact && <Table.Header>Current Role</Table.Header>}
          <Table.Header>Experience</Table.Header>
          <Table.Header>Stage</Table.Header>
          <Table.Header>Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {CANDIDATES.slice(0, compact ? 4 : CANDIDATES.length).map((c) => (
          <Table.Row key={c.id}>
            <Table.Cell>
              <Flex alignItems="center" gap="xs">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    backgroundColor: c.grade === 'A' ? '#E4F0FF' : '#EEF3F8',
                    color: colors.blackPepper600,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {c.grade}
                </span>
                <BodyText size="small" style={{ fontWeight: c.id === 'cand-sara' ? 700 : 500 }}>
                  {c.name}
                </BodyText>
              </Flex>
            </Table.Cell>
            {!compact && <Table.Cell>{c.currentRole}</Table.Cell>}
            <Table.Cell>{c.experience}</Table.Cell>
            <Table.Cell>{c.stage}</Table.Cell>
            <Table.Cell>{smallPill(c.status, c.status.includes('Waiting') ? 'purple' : 'neutral')}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function RequisitionPage({
  state,
  onSelectCandidate,
}: {
  state: FlowState;
  onSelectCandidate: (id: string) => void;
}) {
  return (
    <Box style={{ flex: 1, minWidth: 0, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
      <ReqHeader />
      <CountStrip />
      <Box paddingX="m" paddingTop="xs" paddingBottom="m">
        <Flex alignItems="center" justifyContent="space-between" marginBottom="xxs" style={{ minHeight: 32 }}>
          <Flex gap="xxs" alignItems="center" style={{ flexWrap: 'wrap', minHeight: 28 }}>
            <Flex alignItems="center" gap="xxs">
              <SystemIcon icon={searchIcon} size={14} color={SANA_SECONDARY_TAB_INACTIVE_FG} />
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontWeight: 700, fontSize: 12 }}>
                Filters
              </BodyText>
            </Flex>
            {state.filterChips.map((chip, index) => smallPill(chip, index === 0 ? 'blue' : 'purple'))}
            {!state.filterChips.includes('Leadership: 6 of 50') && smallPill('Leadership: 6 of 50', 'purple')}
            <TertiaryButton size="small">Add Group</TertiaryButton>
            <TertiaryButton size="small">AI Saved View</TertiaryButton>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 12 }}>
              Rows: 1-6 of 50 · Total Candidates: 50
            </BodyText>
            <SecondaryButton size="small">Show All</SecondaryButton>
          </Flex>
        </Flex>
        <Box style={{ borderTop: `1px solid ${colors.soap300}`, borderLeft: `1px solid ${colors.soap300}`, borderRight: `1px solid ${colors.soap300}`, overflow: 'hidden' }}>
          <Table style={{ width: '100%', tableLayout: 'fixed' }}>
            <Table.Head>
              <Table.Row>
                <Table.Header style={{ width: 34, padding: '7px 8px' }}>
                  <input type="checkbox" aria-label="Select all candidates" />
                </Table.Header>
                <Table.Header style={{ width: 42, padding: '7px 8px' }}>S...</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Applicants</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Current Role</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Experience</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Education</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Type</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Applied Date</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Stage</Table.Header>
                <Table.Header style={{ padding: '7px 8px' }}>Status</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {CANDIDATES.map((c) => (
                <Table.Row
                  key={c.id}
                  onClick={() => onSelectCandidate(c.id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: state.selectedCandidateId === c.id ? '#F3F7FF' : '#FFFFFF',
                  }}
                >
                  <Table.Cell style={{ padding: '7px 8px' }}>
                    <input type="checkbox" aria-label={`Select ${c.name}`} onClick={(e) => e.stopPropagation()} />
                  </Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px' }}>
                    <GradeTile grade={c.grade} />
                  </Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px' }}>
                    <Flex alignItems="center" gap="xxs">
                      <span
                        aria-hidden
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: colors.blueberry500,
                          display: 'inline-block',
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(c.id);
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: colors.blueberry500,
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {c.name}
                      </button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.currentRole}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.experience}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.education}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.type}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.appliedDate}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px', fontSize: 12 }}>{c.stage}</Table.Cell>
                  <Table.Cell style={{ padding: '7px 8px' }}>{smallPill(c.status, c.status.includes('Waiting') ? 'purple' : 'neutral')}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

function CandidateInsights() {
  const rows = [
    { label: 'Legally authorized to work in the US', icon: homeBuildingIcon },
    { label: 'Will require visa sponsorship for employment status', icon: userIcon },
    { label: 'Desired Salary of $150,000', icon: linkIcon },
    { label: 'Previously tenured at Bloomingdales', icon: checkCircleIcon },
    { label: 'Geographic location within 25 miles', icon: checkCircleIcon },
    { label: 'Worked at a Fortune 500 company', icon: homeBuildingIcon },
  ];
  return (
    <Box style={cardStyle({ padding: 16, borderRadius: 18, boxShadow: 'none' })}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap="xs">
          <SparkleMark size={16} />
          <Heading size="small" style={{ margin: 0, fontSize: 16 }}>
            Candidate Insights
          </Heading>
        </Flex>
        <SystemIcon icon={chevronDownSmallIcon} size={16} color={SANA_SECONDARY_TAB_INACTIVE_FG} />
      </Flex>
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4, fontSize: 12 }}>
        Based on questionnaire responses and application
      </BodyText>
      <Box style={{ marginTop: 12 }}>
        {rows.map((row) => (
          <Flex
            key={row.label}
            alignItems="center"
            gap="xs"
            style={{ padding: '10px 0', borderTop: `1px solid ${colors.soap300}` }}
          >
            <SystemIcon icon={row.icon} size={16} color={SANA_SECONDARY_TAB_INACTIVE_FG} />
            <BodyText size="small" style={{ fontSize: 13 }}>{row.label}</BodyText>
          </Flex>
        ))}
      </Box>
      <SecondaryButton size="small" style={{ marginTop: 12 }}>View Full Questionnaire</SecondaryButton>
    </Box>
  );
}

function FitGapPanel() {
  const rows = [
    {
      label: 'Supply Chain & Logistics Knowledge',
      status: 'gap',
      evidence: 'No mention of supply chain or logistics experience',
    },
    {
      label: 'Trend Forecasting & Fashion Awareness',
      status: 'fit',
      evidence: 'Trend forecasting and seasonal buying mentioned',
    },
    {
      label: 'Financial Acumen (Open-to-Buy, Margins, GMROI)',
      status: 'fit',
      evidence: 'Mentions 22% increase in GMROI year-over-year',
    },
    {
      label: 'Vendor Negotiation & Relationship Management',
      status: 'fit',
      evidence: 'Mentions vendor relationships and negotiations',
    },
    {
      label: 'Inventory Management & Planning',
      status: 'fit',
      evidence: 'Inventory levels maintained through systematic planning',
    },
    {
      label: 'Data Analytics & Retail Math',
      status: 'fit',
      evidence: 'Mentions analysing market trends and retail analytics tools',
    },
  ];
  return (
    <Box style={cardStyle({ padding: 16, borderRadius: 18, boxShadow: 'none', marginTop: 16 })}>
      <Flex alignItems="center" gap="xs">
        <SparkleMark size={16} />
        <Heading size="small" style={{ margin: 0, fontSize: 16 }}>
          Fit & Gap
        </Heading>
      </Flex>
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4, fontSize: 12 }}>
        Click on each fit & gap item to highlight source on candidate resume.
      </BodyText>
      <Box style={{ marginTop: 12 }}>
        {rows.map((row) => (
          <Flex
            key={row.label}
            gap="s"
            alignItems="flex-start"
            style={{ padding: '10px 0', borderTop: `1px solid ${colors.soap300}` }}
          >
            <SystemIcon
              icon={row.status === 'fit' ? checkCircleIcon : xIcon}
              size={16}
              color={row.status === 'fit' ? colors.greenApple600 : colors.cinnamon500}
              style={{ marginTop: 2 }}
            />
            <BodyText size="small" style={{ flex: '0 0 46%', fontWeight: 700, fontSize: 12 }}>
              {row.label}
            </BodyText>
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: colors.blueberry500,
                textAlign: 'left',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {row.evidence}
            </button>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

function ResumePreview({ candidate }: { candidate: Candidate }) {
  return (
    <Box style={cardStyle({ overflow: 'hidden', minHeight: 560, borderRadius: 14, boxShadow: '0 8px 20px rgba(15, 46, 102, 0.10)' })}>
      <Flex justifyContent="space-between" alignItems="center" padding="s" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
        <Flex alignItems="center" gap="xs">
          <SecondaryButton size="small">Resume</SecondaryButton>
          <TertiaryButton size="small">Attachments</TertiaryButton>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>1 of 1</BodyText>
          <SecondaryButton size="small">Download</SecondaryButton>
        </Flex>
        <Flex alignItems="center" gap="xs">
          <Box style={{ width: 190, position: 'relative' }}>
            <SystemIcon icon={searchIcon} size={14} color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ position: 'absolute', left: 10, top: 9 }} />
            <input
              aria-label="Search resume"
              placeholder="Search"
              style={{
                width: '100%',
                borderRadius: 8,
                border: `1px solid ${colors.soap300}`,
                padding: '7px 10px 7px 30px',
                fontSize: 12,
              }}
            />
          </Box>
          <Flex gap="xxs">{smallPill('Original', 'blue')}{smallPill('Parsed')}</Flex>
        </Flex>
      </Flex>
      <Box style={{ backgroundColor: '#F8F9FC', padding: 20, minHeight: 500 }}>
        <Box
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.soap300}`,
            boxShadow: '0 2px 8px rgba(15, 46, 102, 0.08)',
            maxWidth: 620,
            margin: '0 auto',
            padding: '28px 34px',
          }}
        >
          <Heading size="medium" style={{ margin: 0, letterSpacing: 0.5 }}>
            {candidate.name.toUpperCase()}
          </Heading>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4, fontSize: 12 }}>
            Senior Buyer | {candidate.location} | {candidate.name.toLowerCase().replace(' ', '.')}@example.com
          </BodyText>
          <Box style={{ borderTop: `2px solid ${colors.blackPepper600}`, marginTop: 14, paddingTop: 16 }}>
            <BodyText size="small" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8 }}>
              PROFESSIONAL SUMMARY
            </BodyText>
            <BodyText size="small" style={{ lineHeight: 1.55, marginTop: 8, fontSize: 12 }}>
              Results-driven Senior Buyer with 6+ years of experience in fashion retail buying and merchandising. Proven
              track record of driving profitability through strategic vendor partnerships, trend forecasting, and data-driven
              inventory planning.
            </BodyText>
            <BodyText size="small" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginTop: 20 }}>
              PROFESSIONAL EXPERIENCE
            </BodyText>
            <BodyText size="small" style={{ lineHeight: 1.65, marginTop: 8, fontSize: 12 }}>
              <strong>Senior Buyer, Women&apos;s Contemporary</strong>
              <br />
              Nordstrom | San Francisco, CA
              <br />
              • Managed $12M+ OTB budget across 45+ brands, achieving 18% margin improvement through strategic vendor
              negotiations and markdown optimisation.
              <br />
              • Analyse sales data and fashion trends to develop seasonal buying strategies, resulting in 22% increase in
              GMROI year-over-year.
              <br />
              • Lead cross-functional partnerships with planning, allocation, and visual merchandising teams.
            </BodyText>
            <BodyText size="small" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginTop: 20 }}>
              EDUCATION
            </BodyText>
            <BodyText size="small" style={{ lineHeight: 1.55, marginTop: 8, fontSize: 12 }}>
              Bachelor of Science in Fashion Merchandising
              <br />
              San Francisco State University
            </BodyText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CandidateReviewPage({
  candidate,
  candidatePosition,
  onPreviousCandidate,
  onNextCandidate,
  onSchedule,
}: {
  candidate: Candidate;
  candidatePosition: number;
  onPreviousCandidate: () => void;
  onNextCandidate: () => void;
  onSchedule: () => void;
}) {
  return (
    <Box style={{ flex: 1, minWidth: 0, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        style={{ height: 50, padding: '0 22px', borderBottom: `1px solid ${colors.soap300}` }}
      >
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ flex: 1, fontSize: 11 }}>
          Recruiting / Senior Buyer / {candidate.name}
        </BodyText>
        <Flex alignItems="center" justifyContent="center" gap="xs" style={{ flex: 1 }}>
          <button
            type="button"
            aria-label="Move candidate forward"
            onClick={onSchedule}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: 'none',
              backgroundColor: colors.blueberry500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SystemIcon icon={checkCircleIcon} size={18} color="#FFFFFF" />
          </button>
          <button
            type="button"
            aria-label="Decline candidate"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: 'none',
              backgroundColor: colors.cinnamon500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SystemIcon icon={xIcon} size={16} color="#FFFFFF" />
          </button>
          <SecondaryButton size="small">☆</SecondaryButton>
          <SecondaryButton size="small">⋮</SecondaryButton>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end" gap="xs" style={{ flex: 1 }}>
          <button
            type="button"
            aria-label="Previous candidate"
            onClick={onPreviousCandidate}
            style={{
              border: 'none',
              background: 'transparent',
              color: SANA_SECONDARY_TAB_INACTIVE_FG,
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ‹
          </button>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 12 }}>
            {candidatePosition} of 50 Candidates
          </BodyText>
          <button
            type="button"
            aria-label="Next candidate"
            onClick={onNextCandidate}
            style={{
              border: 'none',
              background: 'transparent',
              color: SANA_SECONDARY_TAB_INACTIVE_FG,
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ›
          </button>
          <Flex alignItems="center" gap="xxs">
            <span
              aria-hidden
              style={{
                width: 32,
                height: 18,
                borderRadius: 999,
                backgroundColor: '#1D315B',
                display: 'inline-flex',
                justifyContent: 'flex-end',
                padding: 2,
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#FFFFFF' }} />
            </span>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>Show Resume</BodyText>
          </Flex>
        </Flex>
      </Flex>

      <Box paddingX="m" paddingTop="s" paddingBottom="m">
        <Flex gap="m" alignItems="flex-start">
          <Box style={{ flex: '0 0 39%', minWidth: 370 }}>
            <Flex alignItems="center" gap="s" marginBottom="s">
              <GradeTile grade={candidate.grade} />
              <Box>
                <Heading size="large" style={{ margin: 0, fontSize: 26, lineHeight: 1.1 }}>
                  {candidate.name}
                </Heading>
                <Flex gap="xs" marginTop="xxs">
                  {smallPill('Review')}
                  {smallPill(candidate.type)}
                </Flex>
              </Box>
            </Flex>

            <Flex gap="m" marginBottom="s" style={{ flexWrap: 'wrap' }}>
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>{candidate.location}</BodyText>
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>Applied Apr 22, 2026</BodyText>
              <BodyText size="small" color={colors.blueberry500}>Contacts</BodyText>
              <BodyText size="small" color={colors.blueberry500}>View Other Profiles</BodyText>
            </Flex>

            <Box style={cardStyle({ padding: 16, backgroundColor: '#F3F0FF', borderRadius: 16, marginBottom: 14, boxShadow: 'none' })}>
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontWeight: 700 }}>
                Awaiting Me
              </BodyText>
              <Heading size="small" style={{ margin: '4px 0', fontSize: 16 }}>
                Review Candidate and Schedule Screening
              </Heading>
              <BodyText size="small">Application received on Apr 22, 2026</BodyText>
              <Flex gap="xs" marginTop="m">
                <PrimaryButton size="small" onClick={onSchedule}>Move Forward</PrimaryButton>
                <SecondaryButton size="small">Decline</SecondaryButton>
              </Flex>
            </Box>

            <Flex gap="s" marginBottom="s">
              {['Review', 'History', 'Job Description'].map((tab, index) => (
                <button
                  type="button"
                  key={tab}
                  disabled={index > 0}
                  style={{
                    border: 'none',
                    borderBottom: index === 0 ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
                    background: 'transparent',
                    color: index === 0 ? colors.blackPepper600 : SANA_SECONDARY_TAB_INACTIVE_FG,
                    padding: '6px 2px',
                    fontWeight: index === 0 ? 700 : 500,
                    cursor: index === 0 ? 'pointer' : 'default',
                  }}
                >
                  {tab}
                </button>
              ))}
            </Flex>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginBottom: 12, fontSize: 12 }}>
              AI-generated assessments. Review before deciding.
            </BodyText>
            <CandidateInsights />
            <FitGapPanel />
          </Box>

          <Box style={{ flex: 1, minWidth: 520 }}>
            <ResumePreview candidate={candidate} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

function ChatAvatar({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'purple' | 'green' | 'neutral' }) {
  const palette = {
    blue: { bg: '#E4F0FF', fg: colors.blueberry500 },
    purple: { bg: '#F3F0FF', fg: '#6F48D9' },
    green: { bg: '#E9F6EC', fg: colors.greenApple600 },
    neutral: { bg: '#EEF2F7', fg: colors.blackPepper600 },
  }[tone];

  return (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}

function TeamsSchedulingHandoff({ onSend }: { onSend: () => void }) {
  const threads = [
    { initials: 'RT', name: 'Ray Tanaka', preview: 'Louisa will send the initial list of...', time: '1:47 PM', section: 'Pinned' },
    { initials: 'BD', name: 'Beth Davies', preview: 'Thanks, that would be nice.', time: '1:43 PM', section: 'Pinned' },
    { initials: 'KM', name: 'Kayo Miwa', preview: 'I reviewed with the client on...', time: 'Yesterday', section: 'Pinned' },
    { initials: 'WK', name: 'Will, Kayo, Eric, +2', preview: 'Kayo: It would be great to sync.', time: '12:00 PM', section: 'Pinned' },
    { initials: 'AB', name: 'August Bergman', preview: "I haven't checked available time...", time: '1:20 PM', section: 'Pinned' },
    { initials: 'WA', name: 'Work..., Amanda, Angela, +1', preview: 'Hello! This is Workday Talent Acq...', time: '1:58 PM', section: 'Recent', active: true },
    { initials: 'EC', name: 'Emiliano Ceballos', preview: 'Sounds good?', time: '1:55 PM', section: 'Recent' },
    { initials: 'MB', name: 'Marie Beaudouin', preview: 'Sounds good?', time: '1:00 PM', section: 'Recent' },
    { initials: 'OK', name: 'Oscar Krogh', preview: 'Thanks! Have a nice...', time: '11:02 AM', section: 'Recent' },
    { initials: 'DF', name: 'Daichi Fukuda', preview: 'I think there are other...', time: '10:43 AM', section: 'Recent' },
  ];

  const slots = [
    { label: 'Tuesday April 30, 10:00-11:00 AM', people: 'Amanda', conflict: 'Conflict: 1:1 with Lisa Henry' },
    { label: 'Wednesday May 1, 11:30 AM-12:30 PM', people: 'Amanda, Henry', conflict: 'Conflict: Client Meeting' },
    { label: 'Friday May 3, 3:00-4:00 PM', people: 'Amanda, Henry, Angela', conflict: 'Conflict: Collection Review' },
  ];
  const appRailItems = ['Activity', 'Chat', 'Teams', 'Calendar', 'Calls', 'Files', 'Contoso', 'Apps'];
  const pinnedThreads = threads.filter((thread) => thread.section === 'Pinned');
  const recentThreads = threads.filter((thread) => thread.section === 'Recent');

  return (
    <Box style={{ flex: 1, minWidth: 0, backgroundColor: '#F4F5FA', overflow: 'hidden' }}>
      <Box style={{ height: 34, display: 'grid', gridTemplateColumns: '52px 220px 1fr 96px', alignItems: 'center', borderBottom: '1px solid #D9DBE8', backgroundColor: '#F5F5FB' }}>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ textAlign: 'center', fontSize: 16 }}>‹ ›</BodyText>
        <Box />
        <Box style={{ maxWidth: 410, height: 24, borderRadius: 4, border: '1px solid #D4D7E4', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 10px', color: SANA_SECONDARY_TAB_INACTIVE_FG, fontSize: 12 }}>
          Search
        </Box>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 12 }}>•••  WD</BodyText>
      </Box>
      <Flex style={{ height: 'calc(100% - 34px)' }}>
        <Box style={{ width: 52, flexShrink: 0, borderRight: '1px solid #D9DBE8', backgroundColor: '#EEF0FA', paddingTop: 8 }}>
          {appRailItems.map((item) => (
            <Flex
              key={item}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{
                height: 48,
                color: item === 'Chat' ? '#5B5FC7' : '#4B4D5F',
                fontSize: 9,
                fontWeight: item === 'Chat' ? 800 : 600,
                backgroundColor: item === 'Chat' ? '#E4E6F8' : 'transparent',
                borderLeft: item === 'Chat' ? '3px solid #5B5FC7' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>{item === 'Chat' ? '●' : '○'}</span>
              <span>{item}</span>
            </Flex>
          ))}
        </Box>
        <Box style={{ width: 246, flexShrink: 0, borderRight: '1px solid #D9DBE8', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <Flex justifyContent="space-between" alignItems="center" style={{ height: 44, padding: '0 14px', borderBottom: '1px solid #ECEEF7' }}>
            <Heading size="small" style={{ margin: 0, fontSize: 18 }}>Chat</Heading>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 14 }}>≡  ✎</BodyText>
          </Flex>
          <Box style={{ height: 'calc(100% - 44px)', overflowY: 'hidden' }}>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ padding: '10px 14px 4px', fontSize: 11, fontWeight: 700 }}>Pinned</BodyText>
            {pinnedThreads.map((thread) => (
              <Flex
                key={thread.name}
                gap="xs"
                alignItems="center"
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  borderLeft: '3px solid transparent',
                }}
              >
                <ChatAvatar label={thread.initials} tone="neutral" />
                <Box style={{ minWidth: 0, flex: 1 }}>
                  <Flex justifyContent="space-between" gap="xs">
                    <BodyText size="small" style={{ fontWeight: 700, fontSize: 11 }}>{thread.name}</BodyText>
                    <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 9 }}>{thread.time}</BodyText>
                  </Flex>
                  <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.preview}
                  </BodyText>
                </Box>
              </Flex>
            ))}
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ padding: '12px 14px 4px', fontSize: 11, fontWeight: 700 }}>Recent</BodyText>
            {recentThreads.map((thread) => (
              <Flex
                key={thread.name}
                gap="xs"
                alignItems="center"
                style={{
                  padding: '8px 12px',
                  backgroundColor: thread.active ? '#EDEFFC' : 'transparent',
                  borderLeft: thread.active ? '3px solid #5B5FC7' : '3px solid transparent',
                }}
              >
                <ChatAvatar label={thread.initials} tone={thread.active ? 'purple' : 'neutral'} />
                <Box style={{ minWidth: 0, flex: 1 }}>
                  <Flex justifyContent="space-between" gap="xs">
                    <BodyText size="small" style={{ fontWeight: thread.active ? 800 : 700, fontSize: 11 }}>{thread.name}</BodyText>
                    <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 9 }}>{thread.time}</BodyText>
                  </Flex>
                  <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.preview}
                  </BodyText>
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
        <Box style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
          <Flex justifyContent="space-between" alignItems="center" style={{ height: 48, padding: '0 16px', borderBottom: '1px solid #ECEEF7' }}>
            <Flex alignItems="center" gap="xs">
              <ChatAvatar label="W" tone="purple" />
              <Heading size="small" style={{ margin: 0, fontSize: 14 }}>Work..., Amanda, Angela, +1</Heading>
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>⌄</BodyText>
            </Flex>
            <Flex alignItems="center" gap="m" style={{ height: '100%' }}>
              <button type="button" style={{ border: 'none', borderBottom: '2px solid #5B5FC7', background: 'transparent', height: '100%', fontSize: 12, fontWeight: 800, color: '#242633' }}>Chat</button>
              <button type="button" style={{ border: 'none', borderBottom: '2px solid transparent', background: 'transparent', height: '100%', fontSize: 12, fontWeight: 600, color: SANA_SECONDARY_TAB_INACTIVE_FG }}>Files</button>
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>＋  •••</BodyText>
            </Flex>
          </Flex>
          <Box style={{ flex: 1, overflowY: 'auto', padding: '24px 34px 18px', backgroundColor: '#FFFFFF' }}>
            <Flex gap="s" alignItems="flex-start" style={{ maxWidth: 720, marginBottom: 16 }}>
              <ChatAvatar label="W" tone="purple" />
              <Box style={{ backgroundColor: '#F2F0FA', borderRadius: 2, padding: 12, flex: 1 }}>
                <BodyText size="small" style={{ fontWeight: 800, marginBottom: 4 }}>Workday Talent Acquisition Agent <span style={{ color: SANA_SECONDARY_TAB_INACTIVE_FG, fontWeight: 500 }}>12:56 PM</span></BodyText>
                <BodyText size="small" style={{ lineHeight: 1.55, marginBottom: 6 }}>
                  Hello! This is Workday Talent Acquisition Agent 👋
                </BodyText>
                <BodyText size="small" style={{ lineHeight: 1.55 }}>
                  Sara Chen has moved onto the Interview stage for <strong>Senior Buyer - JR0047715</strong>.
                  I need to schedule a Round 1 interview with a 3-person panel.
                </BodyText>
                <BodyText size="small" style={{ lineHeight: 1.55, marginTop: 10 }}>
                  I couldn&apos;t find a common availability for this week. Here&apos;s what I&apos;m seeing:
                </BodyText>
                <Box style={{ marginTop: 10 }}>
                  {slots.map((slot) => (
                    <Flex key={slot.label} alignItems="center" gap="xxs" style={{ padding: '3px 0' }}>
                      <BodyText size="small" style={{ flex: '0 0 225px', fontWeight: 800 }}>▣ {slot.label}</BodyText>
                      <BodyText size="small" color={colors.greenApple600}>{slot.people} ✓</BodyText>
                      <BodyText size="small" color={colors.cinnamon500}>✕ {slot.conflict}</BodyText>
                    </Flex>
                  ))}
                </Box>
                <Box style={{ marginTop: 10 }}>
                  <BodyText size="small" style={{ lineHeight: 1.55 }}>
                    <strong>@Amanda Evans</strong> - Your 1:1 with Lisa is at 10:00 AM. Any chance you could move it to
                    2:00 PM? Your 2-3 PM block is open.
                  </BodyText>
                </Box>
              </Box>
            </Flex>

            <Flex gap="s" alignItems="flex-start" style={{ maxWidth: 520, marginBottom: 10 }}>
              <ChatAvatar label="AE" tone="purple" />
              <Box style={{ backgroundColor: '#F5F5F5', borderRadius: 2, padding: 10 }}>
                <BodyText size="small" style={{ fontWeight: 700 }}>Amanda Evans <span style={{ color: SANA_SECONDARY_TAB_INACTIVE_FG, fontWeight: 500 }}>12:56 PM</span></BodyText>
                <BodyText size="small">Yes, I can move it to 2PM. Tuesday April 30th works for me!</BodyText>
              </Box>
            </Flex>
            <Flex gap="s" alignItems="flex-start" style={{ maxWidth: 520, marginBottom: 8 }}>
              <ChatAvatar label="HT" tone="green" />
              <Box style={{ backgroundColor: '#F5F5F5', borderRadius: 2, padding: 10 }}>
                <BodyText size="small" style={{ fontWeight: 700 }}>Henry Thompson <span style={{ color: SANA_SECONDARY_TAB_INACTIVE_FG, fontWeight: 500 }}>12:57 PM</span></BodyText>
                <BodyText size="small">It works for me as well.</BodyText>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end" style={{ marginBottom: 14 }}>
              <Box style={{ backgroundColor: '#EDEBFB', borderRadius: 2, padding: '8px 12px', maxWidth: 210 }}>
                <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 10 }}>1:30 PM</BodyText>
                <BodyText size="small">Perfect! Works for me</BodyText>
              </Box>
            </Flex>

            <Box style={{ backgroundColor: '#F2F0FA', borderRadius: 2, padding: 12, maxWidth: 720, marginLeft: 40 }}>
              <Flex gap="s" alignItems="flex-start">
                <ChatAvatar label="W" tone="purple" />
                <Box style={{ flex: 1 }}>
                  <BodyText size="small" style={{ fontWeight: 800 }}>Workday Talent Acquisition Agent <span style={{ color: SANA_SECONDARY_TAB_INACTIVE_FG, fontWeight: 500 }}>12:56 PM</span></BodyText>
                  <BodyText size="small" style={{ lineHeight: 1.55, marginTop: 4 }}>
                    Perfect. Thank you for moving, Amanda. I&apos;ve scheduled the interview on
                    <strong> Tuesday April 30, 10:00-11:00 AM</strong>, and I&apos;ll send the scheduling link to Sara.
                    In the meantime, I&apos;ve prepared interview prep materials for each of you.
                  </BodyText>
                  <Flex gap="s" marginTop="s">
                    <SecondaryButton size="small">View Interview Prep Materials</SecondaryButton>
                    <PrimaryButton size="small" onClick={onSend}>Send candidate outreach</PrimaryButton>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Box>
          <Box style={{ borderTop: '1px solid #ECEEF7', padding: '8px 26px 12px', backgroundColor: '#FFFFFF' }}>
            <Box style={{ border: '1px solid #D9DBE8', borderRadius: 4, minHeight: 54, padding: '8px 10px', color: SANA_SECONDARY_TAB_INACTIVE_FG, fontSize: 12 }}>
              Type a new message
            </Box>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 6, fontSize: 11 }}>
              A  ✎  🙂  📎  … 
            </BodyText>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

function CandidateOutreach({ sent }: { sent: boolean }) {
  return (
    <Box style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8FB', padding: 32 }}>
      <Box style={{ width: 360, minHeight: 640, borderRadius: 36, backgroundColor: '#111827', padding: 16, boxShadow: '0 24px 70px rgba(15,46,102,0.25)' }}>
        <Box style={{ height: '100%', borderRadius: 28, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <Box style={{ padding: 16, borderBottom: `1px solid ${colors.soap300}`, backgroundColor: '#F9FAFB' }}>
            <Heading size="small" style={{ margin: 0 }}>Sara Chen</Heading>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>Candidate channel</BodyText>
          </Box>
          <Box style={{ padding: 16 }}>
            <Box style={{ backgroundColor: '#EEF5FF', borderRadius: 16, padding: 12, marginBottom: 12 }}>
              <BodyText size="small">
                Hi Sara - your Round 1 interview for Senior Buyer is confirmed for Thu 30 April, 10 AM - 11 AM.
              </BodyText>
            </Box>
            <Box style={{ backgroundColor: '#F3F4F6', borderRadius: 16, padding: 12, marginLeft: 44 }}>
              <BodyText size="small">YES, confirmed. Thank you.</BodyText>
            </Box>
            {sent && (
              <Flex alignItems="center" gap="xs" marginTop="m">
                <SystemIcon icon={checkCircleIcon} size={20} color={colors.greenApple600} />
                <BodyText size="small">Confirmation written back to the interview event.</BodyText>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function parseStartIntent(input: string): boolean {
  const text = input.toLowerCase();
  return (
    text.includes('critical role') ||
    text.includes('top candidates') ||
    text.includes('senior buyer') ||
    text.includes('schedule') ||
    text.includes('candidate') ||
    text.includes('pipeline')
  );
}

export default function E2eRecruitingTalentAcqV01() {
  const [flow, setFlow] = useState<FlowState>(FLOW_SEED);
  const [composer, setComposer] = useState('');
  const [suggestionSet, setSuggestionSet] = useState(0);
  const [taskSuggestionSet, setTaskSuggestionSet] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId(),
      role: 'agent',
      text: "Hi! I'm the Talent Acquisition Agent.\n\nWith Talent Acquisition Agent, Sana can help you get the top candidates more efficiently. What are you looking to do today?",
      hideFeedback: true,
    },
  ]);

  const selectedCandidate = useMemo(
    () => CANDIDATES.find((candidate) => candidate.id === flow.selectedCandidateId) ?? CANDIDATES[1],
    [flow.selectedCandidateId],
  );
  const selectedCandidateIndex = useMemo(
    () => Math.max(0, CANDIDATES.findIndex((candidate) => candidate.id === selectedCandidate.id)),
    [selectedCandidate.id],
  );

  const appendPair = (userText: string, agent: Omit<Message, 'id' | 'role'>) => {
    setMessages((prev) => [
      ...prev,
      { id: msgId(), role: 'user', text: userText },
      { id: msgId(), role: 'agent', ...agent },
    ]);
  };

  const submit = (raw: string) => {
    const userText = raw.trim();
    if (!userText) return;
    const text = userText.toLowerCase();

    if (flow.beat === 'home') {
      if (parseStartIntent(userText)) {
        setFlow((prev) => ({ ...prev, beat: 'req-agent' }));
        appendPair(userText, {
          text: 'Here is your most critical role, Senior Buyer - JR0047715 and the top identified candidates, filtered by more than 4 years of experience.',
          sources: ['Requisition JR0047715', 'Candidate pipeline'],
          showSteps: true,
          stepLines: ['Identified urgent requisitions due soon.', 'Opened Senior Buyer candidate list.', 'Applied initial Top Candidates filter.'],
        });
      } else {
        appendPair(userText, {
          text: 'This prototype is scoped to the Unified Talent Acquisition flow. Try asking for top Senior Buyer candidates or interview scheduling.',
        });
      }
      setComposer('');
      return;
    }

    if (text.includes('leadership') || text.includes('filter') || text.includes('react') || text.includes('javascript')) {
      const nextChip = text.includes('leadership') ? 'Leadership: 6 of 50' : 'React + Javascript';
      setFlow((prev) => ({
        ...prev,
        beat: 'shortlist',
        filterChips: prev.filterChips.includes(nextChip) ? prev.filterChips : [...prev.filterChips, nextChip],
      }));
      appendPair(userText, {
        text: 'There are 6 candidates who have leadership experience. I have updated the candidate table to display these candidates.',
        sources: ['Application profile', 'Resume parser'],
      });
    } else if (text.includes('sara') || text.includes('profile') || text.includes('review') || text.includes('fit-gap')) {
      setFlow((prev) => ({ ...prev, beat: 'candidate-review', selectedCandidateId: 'cand-sara' }));
      appendPair(userText, {
        text: 'Opening Sara Chen with resume context and candidate insights. Review the AI-generated assessment before deciding.',
        sources: ['Candidate profile', 'Parsed resume', 'Questionnaire'],
      });
    } else if (text.includes('schedule') || text.includes('round 1') || text.includes('teams') || text.includes('move forward')) {
      setFlow((prev) => ({ ...prev, beat: 'scheduling', selectedCandidateId: 'cand-sara' }));
      appendPair(userText, {
        text: 'Opening the hiring panel coordination thread. I found conflicts, asked Amanda to move her 1:1, and prepared the confirmed Round 1 slot for Sara.',
        sources: ['Teams thread', 'Panel calendars', 'Interview event'],
      });
    } else if (text.includes('outreach') || text.includes('send') || text.includes('candidate message')) {
      setFlow((prev) => ({ ...prev, beat: 'candidate-outreach', candidateMessageSent: true }));
      appendPair(userText, {
        text: 'Candidate outreach sent. Sara confirmed the slot, and the confirmation is written back to the interview event.',
        sources: ['Candidate channel', 'Interview event'],
      });
    } else {
      appendPair(userText, {
        text: 'I can filter the Senior Buyer pipeline, open Sara Chen for review, schedule the panel, or send candidate outreach in this prototype.',
      });
    }
    setComposer('');
  };

  const openCandidate = (id: string) => {
    setFlow((prev) => ({ ...prev, selectedCandidateId: id, beat: 'candidate-review' }));
    appendPair(`Open ${CANDIDATES.find((candidate) => candidate.id === id)?.name ?? 'candidate'}`, {
      text: 'Opening candidate profile with resume and insights beside the decision controls.',
      sources: ['Candidate profile'],
    });
  };

  const navigateCandidate = (direction: -1 | 1) => {
    const nextIndex = (selectedCandidateIndex + direction + CANDIDATES.length) % CANDIDATES.length;
    const nextCandidate = CANDIDATES[nextIndex];
    setFlow((prev) => ({ ...prev, selectedCandidateId: nextCandidate.id, beat: 'candidate-review' }));
  };

  const scheduleCandidate = () => {
    setFlow((prev) => ({ ...prev, beat: 'scheduling' }));
    appendPair(`Move ${selectedCandidate.name} forward`, {
      text: `${selectedCandidate.name} has moved to the Interview stage. I opened the hiring panel coordination thread and prepared the Round 1 scheduling options.`,
      sources: ['Candidate stage', 'Teams thread', 'Panel calendars'],
    });
  };

  const sendOutreach = () => {
    setFlow((prev) => ({ ...prev, beat: 'candidate-outreach', candidateMessageSent: true }));
    appendPair('Send candidate outreach', {
      text: 'Done. I sent the interview details to Sara and recorded her confirmation on the interview event.',
      sources: ['Candidate channel', 'Interview event'],
    });
  };

  const renderContent = () => {
    if (flow.beat === 'home') {
      return (
        <HomeDashboard
          suggestionSet={suggestionSet}
          onRotate={() => setSuggestionSet((n) => n + 1)}
          onSubmit={submit}
          composer={composer}
          onComposerChange={setComposer}
        />
      );
    }

    if (flow.beat === 'candidate-review') {
      return (
        <CandidateReviewPage
          candidate={selectedCandidate}
          candidatePosition={selectedCandidateIndex + 1}
          onPreviousCandidate={() => navigateCandidate(-1)}
          onNextCandidate={() => navigateCandidate(1)}
          onSchedule={scheduleCandidate}
        />
      );
    }

    if (flow.beat === 'scheduling') {
      return <TeamsSchedulingHandoff onSend={sendOutreach} />;
    }

    if (flow.beat === 'candidate-outreach') {
      return <CandidateOutreach sent={flow.candidateMessageSent} />;
    }

    return <RequisitionPage state={flow} onSelectCandidate={openCandidate} />;
  };

  return (
    <Box style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={flow.searchValue}
        onSearchChange={(value) => setFlow((prev) => ({ ...prev, searchValue: value }))}
        searchPlaceholder="Search or ask a question"
        notificationBadge={1}
        inboxBadge={2}
        variant={flow.beat === 'home' ? 'home' : 'app'}
        tenantLabel="Innovation Summit"
        showWMark
      />
      <Flex style={{ flex: 1, minHeight: 0 }}>
        <LeftRail active="Recruiting" />
        <Box style={{ flex: 1, minWidth: 0, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {renderContent()}
          {(flow.beat === 'req-agent' || flow.beat === 'shortlist') && (
            <AgentPanel
              messages={messages}
              composer={composer}
              onComposerChange={setComposer}
              onSubmit={submit}
              suggestionSet={taskSuggestionSet}
              onRotate={() => setTaskSuggestionSet((n) => n + 1)}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
}
