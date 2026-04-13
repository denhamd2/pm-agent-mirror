import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
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
  { id: 'hub', label: 'Conversational Hub' },
  { id: 'reqs', label: 'Active Job Reqs' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'interviews', label: 'Interviews' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Good morning, Alex! You have 3 urgent requisitions that need attention and 15 new applicants to review. What would you like to focus on today?',
    quickReplies: [
      { label: 'Review urgent reqs', action: 'reqs' },
      { label: 'Screen new applicants', action: 'applicants' },
      { label: 'Check interview schedule', action: 'schedule' },
    ],
  },
];

const URGENT_REQS_NODE: A2UINode = {
  id: 'urgent-reqs',
  component: 'JobReqGrid',
  props: {
    reqs: [
      { id: 'REQ-2026-045', title: 'Data Scientist', daysOpen: 60, status: 'Sourcing', health: 'needs_attention' },
      { id: 'REQ-2026-001', title: 'Senior Software Engineer', daysOpen: 45, status: 'Missing HM feedback', health: 'needs_attention' },
      { id: 'REQ-2026-088', title: 'UX Designer', daysOpen: 12, status: 'Interviewing', health: 'healthy' },
    ]
  }
};

const NEW_APPLICANTS_NODE: A2UINode = {
  id: 'new-applicants',
  component: 'Flex',
  props: { gap: 'm', flexWrap: 'wrap' },
  children: [
    {
      id: 'cand-1',
      component: 'CandidateActionCard',
      props: {
        name: 'Priya Patel',
        role: 'Data Scientist',
        matchScore: 92,
        status: 'New Applicant',
        highlights: ['5 yrs Python', 'Machine Learning', 'Ex-Google'],
      }
    },
    {
      id: 'cand-2',
      component: 'CandidateActionCard',
      props: {
        name: 'Marcus Johnson',
        role: 'Senior Software Engineer',
        matchScore: 88,
        status: 'New Applicant',
        highlights: ['8 yrs React', 'Distributed Systems'],
      }
    }
  ]
};

export const RecruiterHubConversationalV98: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.quickReplies) {
        lastMsg.quickReplies = undefined;
      }
      return [...prev, userMsg];
    });
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let response: Message;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('req') || lowerText.includes('requisition')) {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Here are your urgent requisitions. The Data Scientist role has been open for 60 days.',
          a2uiNode: URGENT_REQS_NODE,
          quickReplies: [
            { label: 'Show candidates for Data Scientist', action: 'applicants' },
            { label: 'Ping Hiring Manager', action: 'ping' },
          ]
        };
      } else if (lowerText.includes('applicant') || lowerText.includes('candidate') || lowerText.includes('screen')) {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Here are the top applicants based on HiredScore matching. Priya Patel looks like a strong fit for the Data Scientist role.',
          a2uiNode: NEW_APPLICANTS_NODE,
          quickReplies: [
            { label: 'Advance Priya to Screen', action: 'advance' },
            { label: 'Reject Marcus', action: 'reject' },
          ]
        };
      } else if (lowerText.includes('advance')) {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I have advanced Priya Patel to the Screen stage and drafted an email to schedule a call.',
          quickReplies: [
            { label: 'Review email draft', action: 'draft' },
          ]
        };
      } else {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I can help you review requisitions, screen candidates, or manage your schedule. What would you like to do?',
          quickReplies: [
            { label: 'Review urgent reqs', action: 'reqs' },
            { label: 'Screen new applicants', action: 'applicants' },
          ]
        };
      }

      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleAction = (action: string, payload?: any) => {
    console.log('Action triggered:', action, payload);
    // In a real app, this would trigger side effects
  };

  return (
    <Flex height="100vh" flexDirection="column" style={{ backgroundColor: SANA_PAGE_CANVAS, overflow: 'hidden' }}>
      <WorkdayTopNav />
      <Flex flex={1} style={{ minHeight: 0 }}>
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          activePrimaryId="Recruiting"
          title="Recruiting"
          tabs={TABS}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        
        <Flex flex={1} flexDirection="column" style={{ minWidth: 0, position: 'relative' }}>
          {activeTab === 'hub' ? (
            <>
              <Box style={{ padding: '24px 32px 0 32px', flexShrink: 0 }}>
                <Heading size="large" marginBottom="s">Conversational Hub</Heading>
                <Banner marginBottom="m">
                  <Banner.Icon />
                  <Banner.Label>This is an AI-powered assistant. Verify important information before taking action.</Banner.Label>
                </Banner>
              </Box>

              <Box 
                flex={1} 
                style={{ 
                  overflowY: 'auto', 
                  padding: '24px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
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
                              maxWidth={msg.a2uiNode ? '100%' : 'min(100%, 600px)'}
                              width={msg.a2uiNode ? '100%' : 'auto'}
                            >
                              {msg.text && <Box marginBottom={msg.a2uiNode ? 'm' : 'zero'}>{msg.text}</Box>}
                              {msg.a2uiNode && <A2UIRenderer node={msg.a2uiNode} onAction={handleAction} />}
                            </SanaCommMessageBubble>
                            
                            {msg.quickReplies && msg.quickReplies.length > 0 && (
                              <Flex gap="s" marginTop="s" flexWrap="wrap">
                                {msg.quickReplies.map((reply, idx) => (
                                  <SecondaryButton 
                                    key={idx} 
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
                        Assistant is typing...
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
                      placeholder="Ask the assistant to review reqs, screen candidates, or schedule interviews..."
                      onSend={() => handleSend(inputValue)}
                      sendDisabled={!inputValue.trim() || isTyping}
                    />
                    <Flex justifyContent="center" marginTop="xs">
                      <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: 11 }}>
                        AI-generated content may be inaccurate. Privacy notice · Powered by Workday
                      </BodyText>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </>
          ) : (
            <Box padding="l">
              <Heading size="large">Standard {TABS.find(t => t.id === activeTab)?.label} View</Heading>
              <BodyText marginTop="m">This tab would contain the standard, non-conversational interface.</BodyText>
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
