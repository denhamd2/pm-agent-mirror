/**
 * France WhatsApp omnichannel engagement — in-product messaging guidance (v75)
 *
 * Design brief: design/france-whatsapp-omnichannel-engagement-v75-design-brief.md
 * PRD: docs/prds/france-whatsapp-omnichannel-engagement-prd.md
 * Pipeline: France E2E · **320**
 *
 * Pattern B: candidate profile + CommunicationDock (guidance-only panel; no native WhatsApp composer).
 */

import { useCallback, useEffect, useState, type CSSProperties, useRef } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Table } from '@workday/canvas-kit-react/table';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { speechBubbleIcon, xSmallIcon, mailIcon, uploadClipIcon, boldIcon, italicsIcon, underlineIcon, linkIcon, unorderedListIcon, chevronDownIcon } from '@workday/canvas-system-icons-web';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { TextInput } from '@workday/canvas-kit-react/text-input';

import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  CommunicationDock,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  DEFAULT_COMM_EXPANDED_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
  SanaCommMessageBubble,
  SanaCommComposer,
  sanaCommFormControlStyle,
} from './components';

/** 319-approved copy — do not change without a new 319 pass */
const COPY = {
  railOpen: 'Open messaging options for this candidate',
  panelTitle: 'Messaging options',
  partnerLink: 'Learn about partner messaging paths',
  lead:
    'Workday Recruiting supports email and conversational SMS in product where your organisation has enabled the right subscriptions and policies. Native two-way WhatsApp inside core Recruiting is not available in this release.',
  partnerPath:
    'Many customers use an approved partner for WhatsApp or other messaging apps, alongside Workday. Your tenant administrator can confirm which integrations and subscriptions you have.',
  frSms:
    'For SMS to French mobile numbers, your organisation may need an approved partner or third-party SMS path. Ask your Workday contact before promising a specific setup.',
  successHelper:
    'Success Centre has the latest guidance for France and EMEA deals, including checklists for presales and administrators.',
  primaryCta: 'View channel options in Success Centre',
  copyLink: 'Copy Success Centre link',
  closePanel: 'Close panel',
  transparency:
    "Candidates may receive messages through your organisation's chosen channels. Your employer's privacy notice and lawful basis apply.",
  dataLocations:
    'Message content may be processed by Workday, your organisation, and approved partners. Retention and deletion may require coordinated steps across systems.',
  prototypeDisclaimer:
    'This screen is a prototype for review. Messaging capabilities depend on your subscriptions, policies, and region.',
} as const;

const SUCCESS_CENTRE_URL = 'https://doc.workday.com/';
const PARTNER_INFO_URL = 'https://www.workday.com/';

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'job-applications', label: 'Job applications' },
  { id: 'screening', label: 'Screening' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'offer', label: 'Offer' },
  { id: 'personal', label: 'Personal' },
  { id: 'job-history', label: 'Job history' },
  { id: 'comments', label: 'Comments' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'business-process', label: 'Business process' },
] as const;

const MOCK = {
  name: 'Camille Dubois',
  jobLine: 'Senior product designer · REQ-2026-8841 · Paris, France · Applied 18 March 2026',
  email: 'camille.dubois@example.com',
  mobile: '+33 6 12 34 56 78',
};

function cardStyle(): CSSProperties {
  return {
    borderRadius: SANA_CARD_RADIUS_LG,
    border: `1px solid ${colors.soap300}`,
    backgroundColor: colors.frenchVanilla100,
    boxShadow: SANA_CARD_SHADOW,
  };
}

export default function FranceWhatsappOmnichannelEngagementV75() {
  const [searchValue, setSearchValue] = useState('');
  const [activeTabId, setActiveTabId] = useState<string>('overview');
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email' | null>(null);
  const messagingOpen = activeChannel !== null;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi Camille, are you still available for an interview next week?', align: 'end' as const, timestamp: '18 Mar, 10:00' },
    { id: 2, text: 'Yes, I am available on Tuesday or Thursday afternoon.', align: 'start' as const, timestamp: '18 Mar, 10:15' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const emailScrollRef = useRef<HTMLDivElement>(null);

  // Email state
  const [activeEmailThreadId, setActiveEmailThreadId] = useState<string | null>(null);
  const [emailText, setEmailText] = useState('');
  const [emailTo, setEmailTo] = useState(MOCK.email);
  const [emailFrom, setEmailFrom] = useState('recruiter@example.com');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [applyBranding, setApplyBranding] = useState(true);
  const [emailThreads, setEmailThreads] = useState([
    {
      id: 'thread-1',
      subject: 'Interview Availability',
      messages: [
        { id: 1, text: 'Hi Camille, we received your application and would love to schedule a call.', align: 'end' as const, timestamp: '17 Mar, 09:00', attachments: ['Company_Brochure.pdf'] },
        { id: 2, text: 'Thank you! I am available next week.', align: 'start' as const, timestamp: '17 Mar, 10:30', attachments: [] },
      ]
    },
    {
      id: 'thread-2',
      subject: 'Screening Question',
      messages: [
        { id: 1, text: 'Could you please confirm your right to work in France?', align: 'end' as const, timestamp: '15 Mar, 14:00', attachments: [] },
        { id: 2, text: 'Yes, I am a French citizen.', align: 'start' as const, timestamp: '15 Mar, 15:20', attachments: [] },
      ]
    },
    {
      id: 'thread-3',
      subject: 'Offer Changes',
      messages: [
        { id: 1, text: 'We have updated the offer details as discussed.', align: 'end' as const, timestamp: '10 Mar, 11:00', attachments: ['Updated_Offer.pdf'] },
      ]
    }
  ]);

  const collapseMessaging = useCallback(() => setActiveChannel(null), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (emailScrollRef.current) {
      emailScrollRef.current.scrollTop = emailScrollRef.current.scrollHeight;
    }
  }, [messages, emailThreads, messagingOpen, activeChannel, activeEmailThreadId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: messageText.trim(),
      align: 'end' as const,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageText('');
  };

  const handleSendEmail = () => {
    if (!emailText.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: emailText.trim(),
      align: 'end' as const,
      timestamp: 'Just now',
      attachments: [],
    };
    
    if (activeEmailThreadId) {
      setEmailThreads(prev => prev.map(t => 
        t.id === activeEmailThreadId 
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      ));
    } else {
      const newThread = {
        id: `thread-${Date.now()}`,
        subject: emailSubject || 'No Subject',
        messages: [newMsg]
      };
      setEmailThreads(prev => [newThread, ...prev]);
      setActiveEmailThreadId(newThread.id);
    }
    setEmailText('');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && messagingOpen) setActiveChannel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [messagingOpen]);

  const copySuccessLink = () => {
    void navigator.clipboard?.writeText(SUCCESS_CENTRE_URL).catch(() => undefined);
  };

  const hubMain = () => {
    switch (activeTabId) {
      case 'overview':
        return (
          <Flex flexDirection="column" gap="l">
            <Flex flexWrap="wrap" gap="l" alignItems="stretch">
              <Box flex="1 1 320px" minWidth={0}>
                <Card padding="l" style={cardStyle()}>
                  <Heading size="small" marginBottom="m">
                    Summary
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
                    Strong fit for design systems and enterprise recruiting workflows. French and English fluency confirmed.
                  </BodyText>
                  <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                    Top skills
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    Figma, accessibility, localisation, cross-functional facilitation
                  </BodyText>
                </Card>
              </Box>
              <Box flex="1 1 320px" minWidth={0}>
                <Card padding="l" style={cardStyle()}>
                  <Heading size="small" marginBottom="m">
                    Job and history
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                    Current stage: Interview. Source: LinkedIn. Last activity: scheduling request sent by email.
                  </BodyText>
                  <Flex gap="s" flexWrap="wrap">
                    <SecondaryButton size="small" onClick={() => setActiveChannel('whatsapp')}>
                      WhatsApp
                    </SecondaryButton>
                    <SecondaryButton size="small" onClick={() => setActiveChannel('email')}>
                      Email
                    </SecondaryButton>
                  </Flex>
                </Card>
              </Box>
            </Flex>
          </Flex>
        );
      case 'job-applications':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Applications
            </Heading>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Job</Table.Header>
                  <Table.Header>Stage</Table.Header>
                  <Table.Header>Applied</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Senior product designer</Table.Cell>
                  <Table.Cell>Interview</Table.Cell>
                  <Table.Cell>18 Mar 2026</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Product designer</Table.Cell>
                  <Table.Cell>Rejected</Table.Cell>
                  <Table.Cell>2 Feb 2025</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        );
      case 'screening':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Screening
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              Pre-screen questionnaire completed. No knockout responses. Recruiter phone screen: scheduled.
            </BodyText>
            <Card padding="m" style={{ ...cardStyle(), boxShadow: 'none', backgroundColor: colors.soap100 }}>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                Assessment
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Work sample review — not requested for this requisition.
              </BodyText>
            </Card>
          </Card>
        );
      case 'interviews':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Interviews
            </Heading>
            <Box marginBottom="m" paddingBottom="m" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
              <BodyText size="small" color={colors.blackPepper500}>
                25 March 2026 · 14:00 CET
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Panel interview — Hiring manager, design lead
              </BodyText>
            </Box>
            <BodyText size="small" color={colors.blackPepper600}>
              Phone screen · 12 March 2026 — Complete
            </BodyText>
          </Card>
        );
      case 'offer':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Offer
            </Heading>
            <BodyText size="small" color={colors.blackPepper600}>
              No offer in progress. Candidate remains in interview stage.
            </BodyText>
          </Card>
        );
      case 'personal':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Contact details
            </Heading>
            <Box marginBottom="s">
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                Email
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK.email}
              </BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                Mobile
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK.mobile}
              </BodyText>
            </Box>
          </Card>
        );
      case 'job-history':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Job history
            </Heading>
            <Box marginBottom="m">
              <BodyText size="small" color={colors.blackPepper500}>
                2019 – present
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Design lead · Enterprise SaaS · Paris
              </BodyText>
            </Box>
            <Box>
              <BodyText size="small" color={colors.blackPepper500}>
                2015 – 2019
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Product designer · Retail technology · Lyon
              </BodyText>
            </Box>
          </Card>
        );
      case 'comments':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Notes
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              Strong portfolio; emphasise Workday design language familiarity in next round.
            </BodyText>
            <TertiaryButton size="small">Add note</TertiaryButton>
          </Card>
        );
      case 'attachments':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Attachments
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
              CV_Camille_Dubois.pdf · Uploaded 18 March 2026
            </BodyText>
            <BodyText size="small" color={colors.blackPepper600}>
              Portfolio_2026.pdf · Uploaded 18 March 2026
            </BodyText>
          </Card>
        );
      case 'business-process':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Business process history
            </Heading>
            <BodyText size="small" color={colors.blackPepper600}>
              Initiate Recruit — completed · Move to Interview — in progress · Offer — not started
            </BodyText>
          </Card>
        );
      default:
        return null;
    }
  };

  const messagingPanel = (
    <Flex
      flexDirection="column"
      flex={1}
      minHeight={0}
      style={{ overflow: 'hidden' }}
      role={messagingOpen ? 'dialog' : undefined}
      aria-modal={messagingOpen ? true : undefined}
      aria-labelledby={messagingOpen ? 'fr-msg-panel-title' : undefined}
    >
      <Box
        padding="m"
        style={{
          borderBottom: `1px solid ${colors.soap300}`,
          flexShrink: 0,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap="m">
          <Flex alignItems="center" gap="s">
            <SystemIcon icon={speechBubbleIcon} size={22} color={SANA_LINK_ACCENT} aria-hidden />
            <Heading size="small" id="fr-msg-panel-title">
              WhatsApp
            </Heading>
          </Flex>
          <ToolbarIconButton icon={xSmallIcon} aria-label={COPY.closePanel} onClick={collapseMessaging} />
        </Flex>
      </Box>

      <Box
        ref={scrollRef}
        padding="l"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          backgroundColor: colors.frenchVanilla100,
        }}
      >
        <Box marginBottom="l">
          <BodyText size="small" color={colors.blackPepper500} style={{ textAlign: 'center' }}>
            WhatsApp conversation started
          </BodyText>
        </Box>

        {messages.map((msg) => (
          <SanaCommMessageBubble key={msg.id} align={msg.align} timestamp={msg.timestamp}>
            {msg.text}
          </SanaCommMessageBubble>
        ))}
      </Box>

      <Box
        padding="m"
        style={{
          borderTop: `1px solid ${colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
      >
        <SanaCommComposer
          value={messageText}
          onChange={setMessageText}
          placeholder="Type a WhatsApp message..."
          onSend={handleSendMessage}
          sendDisabled={!messageText.trim()}
          footer={
            <Box marginTop="xs">
              <BodyText size="small" color={colors.blackPepper500}>
                {COPY.transparency}
              </BodyText>
            </Box>
          }
        />
      </Box>
    </Flex>
  );

  const emailPanel = (
    <Flex
      flexDirection="row"
      flex={1}
      minHeight={0}
      style={{ overflow: 'hidden' }}
      role={messagingOpen ? 'dialog' : undefined}
      aria-modal={messagingOpen ? true : undefined}
      aria-labelledby={messagingOpen ? 'fr-email-panel-title' : undefined}
    >
      {/* LEFT SIDEBAR: Thread List */}
      <Flex
        flexDirection="column"
        width={250}
        style={{ borderRight: `1px solid ${colors.soap300}`, backgroundColor: SANA_COMM_PANEL_SURFACE }}
      >
        <Box padding="m" style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}>
          <Flex alignItems="center" gap="s">
            <SystemIcon icon={mailIcon} size={22} color={SANA_LINK_ACCENT} aria-hidden />
            <Heading size="small" id="fr-email-panel-title">
              Email
            </Heading>
          </Flex>
        </Box>
        <Box padding="m" style={{ flexShrink: 0 }}>
          <PrimaryButton size="small" style={{ width: '100%' }} onClick={() => {
            setActiveEmailThreadId(null);
            setEmailSubject('');
            setEmailText('');
          }}>
            New
          </PrimaryButton>
        </Box>
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {emailThreads.map(thread => (
            <Box
              key={thread.id}
              padding="s"
              style={{
                cursor: 'pointer',
                backgroundColor: activeEmailThreadId === thread.id ? colors.soap200 : 'transparent',
                borderBottom: `1px solid ${colors.soap200}`
              }}
              onClick={() => {
                setActiveEmailThreadId(thread.id);
                setEmailSubject(thread.subject);
                setEmailText('');
              }}
            >
              <BodyText size="small" fontWeight="bold">{thread.subject}</BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                {thread.messages[thread.messages.length - 1]?.timestamp}
              </BodyText>
            </Box>
          ))}
        </Box>
      </Flex>

      {/* RIGHT SIDEBAR: Detail View */}
      <Flex flexDirection="column" flex={1} minWidth={0} style={{ backgroundColor: colors.frenchVanilla100 }}>
        {/* Header with Close Button */}
        <Box padding="m" style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0, backgroundColor: SANA_COMM_PANEL_SURFACE }}>
          <Flex justifyContent="flex-end">
            <ToolbarIconButton icon={xSmallIcon} aria-label={COPY.closePanel} onClick={collapseMessaging} />
          </Flex>
        </Box>

        {/* Thread History (Scrollable) */}
        <Box
          ref={emailScrollRef}
          padding="l"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.frenchVanilla100 }}
        >
          {activeEmailThreadId === null ? (
            <Flex flex={1} alignItems="center" justifyContent="center" height="100%">
              <BodyText size="small" color={colors.blackPepper500}>
                Start a new email or select a thread from the list.
              </BodyText>
            </Flex>
          ) : (
            emailThreads.find(t => t.id === activeEmailThreadId)?.messages.map(msg => (
              <SanaCommMessageBubble key={msg.id} align={msg.align} timestamp={msg.timestamp}>
                <Box>
                  <BodyText size="small">{msg.text}</BodyText>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <Flex gap="xs" marginTop="s" alignItems="center">
                      <SystemIcon icon={uploadClipIcon} size={16} color={colors.blackPepper500} />
                      <BodyText size="small" color={SANA_LINK_ACCENT}>
                        {msg.attachments[0]}
                      </BodyText>
                    </Flex>
                  )}
                </Box>
              </SanaCommMessageBubble>
            ))
          )}
        </Box>

        {/* Composer Footer (Fixed at bottom) */}
        <Box padding="m" style={{ borderTop: `1px solid ${colors.soap300}`, flexShrink: 0, backgroundColor: SANA_COMM_PANEL_SURFACE }}>
          <Flex flexDirection="column" gap="xs" marginBottom="s">
            <Flex alignItems="center" gap="s">
              <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
                From:
              </BodyText>
              <Box
                as="input"
                value={emailFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailFrom(e.target.value)}
                style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
              />
            </Flex>
            <Flex alignItems="center" gap="s">
              <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
                To:
              </BodyText>
              <Box
                as="input"
                value={emailTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailTo(e.target.value)}
                style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
              />
            </Flex>
            <Flex alignItems="center" gap="s">
              <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
                Cc:
              </BodyText>
              <Box
                as="input"
                value={emailCc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailCc(e.target.value)}
                placeholder="Add Cc..."
                style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
              />
            </Flex>
            <Flex alignItems="center" gap="s">
              <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
                Subj:
              </BodyText>
              <Box
                as="input"
                value={emailSubject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSubject(e.target.value)}
                style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
              />
            </Flex>
          </Flex>

          <Flex
            justifyContent="space-between"
            alignItems="center"
            padding="xxs"
            style={{
              border: `1px solid ${colors.soap300}`,
              borderRadius: '12px 12px 0 0',
              borderBottom: 'none',
              backgroundColor: colors.soap100,
            }}
          >
            <Flex gap="xxs">
              <ToolbarIconButton icon={boldIcon} aria-label="Bold" />
              <ToolbarIconButton icon={italicsIcon} aria-label="Italic" />
              <ToolbarIconButton icon={underlineIcon} aria-label="Underline" />
              <ToolbarIconButton icon={linkIcon} aria-label="Link" />
              <ToolbarIconButton icon={unorderedListIcon} aria-label="Bulleted list" />
            </Flex>
            <Flex gap="s" alignItems="center">
              <SecondaryButton size="small" icon={chevronDownIcon} iconPosition="end">
                Templates
              </SecondaryButton>
            </Flex>
          </Flex>

          <Box
            as="textarea"
            value={emailText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailText(e.target.value)}
            placeholder="Type an email..."
            style={{
              ...sanaCommFormControlStyle(),
              width: '100%',
              height: 100,
              padding: 8,
              borderRadius: '0 0 12px 12px',
              resize: 'vertical',
            }}
          />

          <Flex justifyContent="space-between" alignItems="center" marginTop="s">
            <Flex gap="m" alignItems="center">
              <ToolbarIconButton icon={uploadClipIcon} aria-label="Attach file" />
              <Checkbox
                checked={applyBranding}
                onChange={(e) => setApplyBranding(e.target.checked)}
                label="Apply company branding"
              />
            </Flex>
            <PrimaryButton size="small" onClick={handleSendEmail} disabled={!emailText.trim()}>
              Send Email
            </PrimaryButton>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );

  const railReserve = DEFAULT_COMM_RAIL_PX;

  return (
    <Box style={{ position: 'relative', minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav searchValue={searchValue} onSearchChange={setSearchValue} />

      <Flex style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          fillHeight
          showSecondaryTitleIcon
          secondaryTitle="Candidate"
          secondarySubtitle={MOCK.name}
          tabs={[...HUB_TABS]}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          aria-label="Candidate profile sections"
        />

        <Box
          flex={1}
          minWidth={0}
          padding="l"
          style={{
            paddingRight: `calc(${space.l} + ${railReserve}px)`,
            overflow: 'auto',
            borderTopLeftRadius: SANA_SHELL_RADIUS,
            marginTop: 0,
            backgroundColor: SANA_PAGE_CANVAS,
          }}
        >
          <Card
            padding="l"
            marginBottom="l"
            style={{
              ...cardStyle(),
              boxShadow: SANA_CARD_SHADOW,
            }}
          >
            <Flex alignItems="flex-start" gap="m" flexWrap="wrap">
              <Avatar size={64} altText={MOCK.name} as="div" />
              <Box flex="1" minWidth={200}>
                <Heading size="large" marginBottom="xs">
                  {MOCK.name}
                </Heading>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  {MOCK.jobLine}
                </BodyText>
                <Flex gap="s" flexWrap="wrap">
                  <SecondaryButton size="small">Move forward</SecondaryButton>
                  <TertiaryButton size="small">Reject</TertiaryButton>
                </Flex>
              </Box>
            </Flex>
          </Card>

          {hubMain()}

          <Box marginTop="xl" paddingBottom="l">
            <BodyText size="small" color={colors.blackPepper500}>
              {COPY.prototypeDisclaimer}
            </BodyText>
          </Box>
        </Box>
      </Flex>

      <CommunicationDock
        headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
        expanded={messagingOpen}
        railWidthPx={DEFAULT_COMM_RAIL_PX}
        expandedWidthPx={activeChannel === 'email' ? 800 : DEFAULT_COMM_EXPANDED_PX}
        panel={activeChannel === 'email' ? emailPanel : messagingPanel}
        rail={
          <Flex flexDirection="column" gap="xs" style={{ width: '100%', alignItems: 'center', paddingTop: space.s }}>
            <button
              type="button"
              aria-label="Open WhatsApp for this candidate"
              aria-expanded={activeChannel === 'whatsapp'}
              onClick={() => setActiveChannel((v) => (v === 'whatsapp' ? null : 'whatsapp'))}
              style={{
                ...communicationRailButtonStyle(activeChannel === 'whatsapp', DEFAULT_COMM_RAIL_PX),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SystemIcon
                icon={speechBubbleIcon}
                size={22}
                color={activeChannel === 'whatsapp' ? SANA_LINK_ACCENT : colors.blackPepper600}
                aria-hidden
              />
            </button>
            <button
              type="button"
              aria-label="Open Email for this candidate"
              aria-expanded={activeChannel === 'email'}
              onClick={() => setActiveChannel((v) => (v === 'email' ? null : 'email'))}
              style={{
                ...communicationRailButtonStyle(activeChannel === 'email', DEFAULT_COMM_RAIL_PX),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SystemIcon
                icon={mailIcon}
                size={22}
                color={activeChannel === 'email' ? SANA_LINK_ACCENT : colors.blackPepper600}
                aria-hidden
              />
            </button>
          </Flex>
        }
      />
    </Box>
  );
}
