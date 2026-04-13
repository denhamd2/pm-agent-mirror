import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  SANA_PAGE_CANVAS,
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_MESSAGE_RADIUS_PX,
  SANA_COMM_PANEL_SURFACE,
  SanaCommMessageBubble,
  SanaCommComposer,
  A2UIRenderer,
  type A2UINode,
} from './components';
import { homeIcon, userIcon, homeBuildingIcon, linkIcon, dotIcon } from '@workday/canvas-system-icons-web';

type Message = {
  id: string;
  sender: 'assistant' | 'user';
  text?: string;
  a2uiNode?: A2UINode;
  quickReplies?: { label: string; action: string }[];
};

const PRIMARY_RAIL = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'Home', onClick: () => { window.location.hash = '/recruiter-home-v85'; } },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const TABS = [
  { id: 'hub', label: 'Hub landing' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'interviews', label: 'Interviews' },
];

const PRIORITY_SNAPSHOT_NODE: A2UINode = {
  id: 'priority-snapshot',
  component: 'Flex',
  props: { gap: 's', flexWrap: 'wrap' },
  children: [
    { id: 'priority-1', component: 'MetricCard', props: { label: 'Urgent requisitions', value: '3', helperText: '2 blocked by hiring manager feedback' } },
    { id: 'priority-2', component: 'MetricCard', props: { label: 'Candidates to review', value: '15', helperText: '6 scored A by HiredScore' } },
    { id: 'priority-3', component: 'MetricCard', props: { label: 'Interviews at risk', value: '4', helperText: 'Candidate no-response window < 24h' } },
  ],
};

const URGENT_REQS_NODE: A2UINode = {
  id: 'urgent-reqs',
  component: 'JobReqGrid',
  props: {
    reqs: [
      { id: 'REQ-2026-045', title: 'Data Scientist', daysOpen: 60, status: 'Sourcing', health: 'needs_attention' },
      { id: 'REQ-2026-001', title: 'Senior Software Engineer', daysOpen: 45, status: 'Missing HM feedback', health: 'needs_attention' },
      { id: 'REQ-2026-088', title: 'UX Designer', daysOpen: 12, status: 'Interviewing', health: 'healthy' },
    ],
  },
};

const SCREENING_NODE: A2UINode = {
  id: 'candidate-grid',
  component: 'CandidateGrid',
  props: {
    candidates: [
      { id: 'cand-101', name: 'Priya Patel', appliedDate: '12 Apr 2026', source: 'LinkedIn', hiredScoreFit: 92 },
      { id: 'cand-102', name: 'Marcus Johnson', appliedDate: '11 Apr 2026', source: 'Referral', hiredScoreFit: 88 },
      { id: 'cand-103', name: 'Noura Al Mansoori', appliedDate: '10 Apr 2026', source: 'Bayt', hiredScoreFit: 85 },
    ],
  },
};

const INTERVIEW_RISK_NODE: A2UINode = {
  id: 'interview-risk',
  component: 'Card',
  props: { padding: 'm' },
  children: [
    { id: 'risk-title', component: 'Heading', props: { size: 'small', text: 'Interview risk queue' } },
    { id: 'risk-item-1', component: 'BodyText', props: { size: 'small', text: '• REQ-2026-045: Candidate reply window closes in 8 hours' } },
    { id: 'risk-item-2', component: 'BodyText', props: { size: 'small', text: '• REQ-2026-001: 2 panelists have conflicts on Wednesday' } },
    { id: 'risk-item-3', component: 'BodyText', props: { size: 'small', text: '• REQ-2026-099: Offer discussion not booked within SLA' } },
  ],
};

const DRAFT_MESSAGE_NODE: A2UINode = {
  id: 'hm-ping-draft',
  component: 'DraftMessage',
  props: {
    recipient: 'Priya Nair, Hiring Manager',
    message:
      'Hi Priya - quick nudge on REQ-2026-001. Candidate shortlist is ready and we need feedback today to avoid a 48-hour delay. Would you like me to book a 15-minute review slot?',
  },
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Good morning, Alex. This landing view is tuned for your first 30 minutes: 3 urgent requisitions, 15 candidates to triage, and 4 interviews at risk. Start where you will create the most movement.',
    a2uiNode: PRIORITY_SNAPSHOT_NODE,
    quickReplies: [
      { label: 'Show my priorities', action: 'priorities' },
      { label: 'Triage urgent requisitions', action: 'reqs' },
      { label: 'Review top candidates', action: 'candidates' },
      { label: 'Stabilise this week interviews', action: 'interviews' },
    ],
  },
];

const buildAssistantResponse = (text: string): Message => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('priorit')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'Here is your ranked priority snapshot. I can take you straight to requisitions, candidates, or interview recovery.',
      a2uiNode: PRIORITY_SNAPSHOT_NODE,
      quickReplies: [
        { label: 'Open urgent requisitions', action: 'reqs' },
        { label: 'Open top candidates', action: 'candidates' },
      ],
    };
  }
  if (lowerText.includes('req') || lowerText.includes('requisition') || lowerText.includes('triage')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'These requisitions are slowing down your funnel. I recommend escalating the Senior Software Engineer req first because hiring manager feedback is overdue.',
      a2uiNode: URGENT_REQS_NODE,
      quickReplies: [
        { label: 'Draft hiring manager nudge', action: 'ping' },
        { label: 'Switch to candidate review', action: 'candidates' },
      ],
    };
  }
  if (lowerText.includes('candidate') || lowerText.includes('screen') || lowerText.includes('review top')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'These candidates are pre-ranked for fast decisioning. Priya Patel is your strongest immediate move for the Data Scientist req.',
      a2uiNode: SCREENING_NODE,
      quickReplies: [
        { label: 'Advance Priya to screen', action: 'advance' },
        { label: 'Return to requisitions', action: 'reqs' },
      ],
    };
  }
  if (lowerText.includes('interview') || lowerText.includes('schedule') || lowerText.includes('stabilise')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'These interview items risk candidate drop-off this week. I can coordinate reminders after you confirm the priority sequence.',
      a2uiNode: INTERVIEW_RISK_NODE,
      quickReplies: [
        { label: 'Draft interview reminders', action: 'reminder' },
        { label: 'Review candidates first', action: 'candidates' },
      ],
    };
  }
  if (lowerText.includes('ping') || lowerText.includes('nudge') || lowerText.includes('draft')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'Draft ready. You can edit before sending.',
      a2uiNode: DRAFT_MESSAGE_NODE,
      quickReplies: [{ label: 'Send and continue triage', action: 'priorities' }],
    };
  }
  if (lowerText.includes('advance')) {
    return {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: 'Priya Patel has been moved to Screen and a scheduler email draft is prepared. Next highest impact is hiring manager follow-up for REQ-2026-001.',
      quickReplies: [
        { label: 'Draft hiring manager nudge', action: 'ping' },
        { label: 'Check interview risks', action: 'interviews' },
      ],
    };
  }
  return {
    id: `msg-${Date.now() + 1}`,
    sender: 'assistant',
    text: 'I can guide your landing priorities across requisitions, candidates, and interview risk. Tell me where you want momentum first.',
    quickReplies: [
      { label: 'Show my priorities', action: 'priorities' },
      { label: 'Triage urgent requisitions', action: 'reqs' },
      { label: 'Review top candidates', action: 'candidates' },
    ],
  };
};

export const RecruiterHubConversationalV99: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');
  const [topSearchValue, setTopSearchValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) => {
      if (prev.length === 0) return [userMsg];
      const next = [...prev];
      const last = next[next.length - 1];
      next[next.length - 1] = { ...last, quickReplies: undefined };
      return [...next, userMsg];
    });
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, buildAssistantResponse(trimmed)]);
    }, 900);
  };

  const handleAction = (action: string, payload?: unknown) => {
    // Placeholder for future action orchestration.
    console.log('Action triggered:', action, payload);
  };

  return (
    <Flex height="100vh" flexDirection="column" style={{ backgroundColor: SANA_PAGE_CANVAS, overflow: 'hidden' }}>
      <WorkdayTopNav searchValue={topSearchValue} onSearchChange={setTopSearchValue} />
      <Flex flex={1} style={{ minHeight: 0 }}>
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          secondaryTitle="Recruiting"
          tabs={TABS}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />

        <Flex flex={1} flexDirection="column" style={{ minWidth: 0, position: 'relative' }}>
          {activeTab === 'hub' ? (
            <>
              <Box style={{ padding: '24px 32px 0 32px', flexShrink: 0 }}>
                <Heading size="large" marginBottom="s">Conversational recruiting hub</Heading>
                <BodyText size="small" marginBottom="s" color={colors.blackPepper500}>
                  Landing mode prioritises the first actions a recruiter should take to unblock pipeline movement.
                </BodyText>
                <Banner marginBottom="m">
                  <Banner.Icon />
                  <Banner.Label>This assistant can suggest and draft actions. Confirm important decisions before sending.</Banner.Label>
                </Banner>
              </Box>

              <Box
                flex={1}
                style={{
                  overflowY: 'auto',
                  padding: '24px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <Box style={{ maxWidth: 1000, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {messages.map((msg) => (
                    <Box key={msg.id}>
                      {msg.sender === 'assistant' ? (
                        <Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
                          <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <SanaCommMessageBubble
                              align="start"
                              maxWidth={msg.a2uiNode ? '100%' : 'min(100%, 680px)'}
                              width={msg.a2uiNode ? '100%' : 'auto'}
                            >
                              {msg.text && <Box marginBottom={msg.a2uiNode ? 'm' : 'zero'}>{msg.text}</Box>}
                              {msg.a2uiNode && <A2UIRenderer node={msg.a2uiNode} onAction={handleAction} />}
                            </SanaCommMessageBubble>

                            {msg.quickReplies && msg.quickReplies.length > 0 && (
                              <Flex gap="s" marginTop="s" flexWrap="wrap">
                                {msg.quickReplies.map((reply) => (
                                  <SecondaryButton
                                    key={reply.action}
                                    size="small"
                                    onClick={() => handleSend(reply.label)}
                                    style={{ borderRadius: 16 }}
                                  >
                                    {reply.label}
                                  </SecondaryButton>
                                ))}
                              </Flex>
                            )}
                          </Box>
                        </Flex>
                      ) : (
                        <Flex justifyContent="flex-end" style={{ width: '100%' }}>
                          <SanaCommMessageBubble align="end">
                            {msg.text}
                          </SanaCommMessageBubble>
                        </Flex>
                      )}
                    </Box>
                  ))}

                  {isTyping && (
                    <Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
                      <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
                      <Box
                        style={{
                          padding: '12px 20px',
                          borderRadius: SANA_COMM_MESSAGE_RADIUS_PX,
                          backgroundColor: SANA_COMM_BUBBLE_BG,
                          color: colors.blackPepper400,
                          fontSize: 14,
                        }}
                      >
                        Assistant is prioritising your next best action...
                      </Box>
                    </Flex>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
              </Box>

              <Box
                style={{
                  borderTop: `1px solid ${colors.soap300}`,
                  backgroundColor: SANA_COMM_PANEL_SURFACE,
                  padding: '16px 32px',
                  flexShrink: 0,
                }}
              >
                <Flex justifyContent="center">
                  <Box style={{ maxWidth: 1000, width: '100%' }}>
                    <SanaCommComposer
                      value={inputValue}
                      onChange={setInputValue}
                      placeholder="Ask for your priorities, urgent req triage, candidate review, or interview stabilisation..."
                      onSend={() => handleSend(inputValue)}
                      sendDisabled={!inputValue.trim() || isTyping}
                    />
                    <Flex justifyContent="center" marginTop="xs">
                      <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: 11 }}>
                        Internal concept prototype. AI suggestions can be incomplete - validate before action.
                      </BodyText>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </>
          ) : (
            <Box padding="l">
              <Heading size="large">{TABS.find((t) => t.id === activeTab)?.label}</Heading>
              <BodyText size="small" marginTop="m">
                This tab represents the standard non-conversational workspace and remains secondary to the conversational landing flow.
              </BodyText>
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
