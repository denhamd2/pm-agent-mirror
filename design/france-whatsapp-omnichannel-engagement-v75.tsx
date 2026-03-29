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
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { speechBubbleIcon, xSmallIcon, mailIcon, uploadClipIcon, boldIcon, italicsIcon, underlineIcon, linkIcon, unorderedListIcon, chevronDownIcon, documentIcon, checkCircleIcon, dotIcon } from '@workday/canvas-system-icons-web';
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
  EmailPanel,
  type EmailThread,
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
  // emailScrollRef removed - using single scroll area

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
  }, [messages, messagingOpen]);

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
                    Candidate Summary
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                    Highly experienced product designer with a strong background in enterprise SaaS and design systems. Bilingual (French/English) and immediately available.
                  </BodyText>
                  <Flex gap="xl" marginBottom="m">
                    <Box>
                      <BodyText size="small" fontWeight="bold">Experience</BodyText>
                      <BodyText size="small" color={colors.blackPepper600}>7+ years</BodyText>
                    </Box>
                    <Box>
                      <BodyText size="small" fontWeight="bold">Education</BodyText>
                      <BodyText size="small" color={colors.blackPepper600}>Master's in HCI</BodyText>
                    </Box>
                  </Flex>
                  <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                    Top Skills
                  </BodyText>
                  <Flex gap="xs" flexWrap="wrap">
                    {['Figma', 'Design Systems', 'Accessibility', 'Prototyping'].map(skill => (
                      <StatusIndicator
                        key={skill}
                        type={StatusIndicator.Type.Gray}
                        emphasis={StatusIndicator.Emphasis.Low}
                        label={skill}
                      />
                    ))}
                  </Flex>
                </Card>
              </Box>
              <Box flex="1 1 320px" minWidth={0}>
                <Card padding="l" style={cardStyle()}>
                  <Heading size="small" marginBottom="m">
                    Active Application
                  </Heading>
                  <BodyText size="small" fontWeight="bold">Senior Product Designer</BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">REQ-2026-8841 · Paris, France</BodyText>
                  
                  <Box marginBottom="s">
                    <StatusIndicator
                      type={StatusIndicator.Type.Blue}
                      emphasis={StatusIndicator.Emphasis.Low}
                      label="Stage: Interview"
                      icon={dotIcon}
                    />
                  </Box>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">In progress for 10 days. Next step: Panel Interview.</BodyText>
                  
                  <Flex gap="s" flexWrap="wrap" marginBottom="m">
                    <SecondaryButton 
                      size="small" 
                      onClick={() => setActiveChannel('whatsapp')}
                      style={activeChannel === 'whatsapp' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
                    >
                      WhatsApp
                    </SecondaryButton>
                    <SecondaryButton 
                      size="small" 
                      onClick={() => setActiveChannel('email')}
                      style={activeChannel === 'email' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}
                    >
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
                  <Table.Header>Job Requisition</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Applied Date</Table.Header>
                  <Table.Header>Source</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>Senior Product Designer (REQ-2026-8841)</BodyText></Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicator.Type.Blue}
                      emphasis={StatusIndicator.Emphasis.Low}
                      label="Interview"
                    />
                  </Table.Cell>
                  <Table.Cell>18 Mar 2026</Table.Cell>
                  <Table.Cell>LinkedIn</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>Product Designer (REQ-2025-1102)</BodyText></Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicator.Type.Gray}
                      emphasis={StatusIndicator.Emphasis.Low}
                      label="Rejected"
                    />
                  </Table.Cell>
                  <Table.Cell>2 Feb 2025</Table.Cell>
                  <Table.Cell>Careers Site</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        );
      case 'screening':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Screening Results
            </Heading>
            <Flex gap="l" marginBottom="l" flexWrap="wrap">
              <Box flex="1 1 250px">
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Pre-screen Questionnaire</BodyText>
                <Flex alignItems="center" gap="xs">
                  <SystemIcon icon={checkCircleIcon} color={colors.green500} size={16} />
                  <BodyText size="small" color={colors.green600} fontWeight="bold">Passed (100%)</BodyText>
                </Flex>
                <BodyText size="small" color={colors.blackPepper600} marginTop="xs">All knockout questions answered favorably. Right to work in France confirmed.</BodyText>
              </Box>
              <Box flex="1 1 250px">
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Recruiter Phone Screen</BodyText>
                <Flex alignItems="center" gap="xs">
                  <SystemIcon icon={checkCircleIcon} color={colors.blueberry500} size={16} />
                  <BodyText size="small" color={colors.blueberry600} fontWeight="bold">Completed</BodyText>
                </Flex>
                <BodyText size="small" color={colors.blackPepper600} marginTop="xs">Strong communication skills. Salary expectations align with budget.</BodyText>
              </Box>
            </Flex>
            <Card padding="m" style={{ ...cardStyle(), boxShadow: 'none', backgroundColor: colors.soap100 }}>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                AI Skills Match (HiredScore)
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Grade: A. Candidate profile strongly matches required skills for Senior Product Designer based on resume parsing.
              </BodyText>
            </Card>
          </Card>
        );
      case 'interviews':
        return (
          <Card padding="l" style={cardStyle()}>
            <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
              <Heading size="small">Interview Schedule</Heading>
              <SecondaryButton size="small">Schedule Interview</SecondaryButton>
            </Flex>
            
            <Box marginBottom="m" paddingBottom="m" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>Panel Interview: Design & Product</BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
                    25 March 2026 · 14:00 - 15:30 CET · Video Conference
                  </BodyText>
                  <Flex gap="s" marginTop="s" alignItems="center">
                    <Avatar size={24} altText="Hiring Manager" as="div" />
                    <BodyText size="small" color={colors.blackPepper600}>Jean Dupont (Hiring Manager)</BodyText>
                  </Flex>
                  <Flex gap="s" marginTop="xs" alignItems="center">
                    <Avatar size={24} altText="Product Lead" as="div" />
                    <BodyText size="small" color={colors.blackPepper600}>Marie Martin (Product Lead)</BodyText>
                  </Flex>
                </Box>
                <Box padding="xxs s" style={{ backgroundColor: colors.blueberry100, color: colors.blueberry600, borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>Upcoming</Box>
              </Flex>
            </Box>
            
            <Box>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <BodyText size="small" fontWeight="bold">Recruiter Screen</BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
                    12 March 2026 · 10:00 - 10:30 CET · Phone
                  </BodyText>
                </Box>
                <Box padding="xxs s" style={{ backgroundColor: colors.green100, color: colors.green700, borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>Completed</Box>
              </Flex>
              <BodyText size="small" color={colors.blackPepper600} marginTop="s" style={{ fontStyle: 'italic', borderLeft: `2px solid ${colors.soap400}`, paddingLeft: space.s }}>
                "Camille is a very strong candidate. Great portfolio and communicates well. Proceeding to panel."
              </BodyText>
            </Box>
          </Card>
        );
      case 'offer':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Offer
            </Heading>
            <Box padding="l" style={{ backgroundColor: colors.soap100, borderRadius: 8, textAlign: 'center' }}>
              <BodyText size="small" color={colors.blackPepper600}>
                No offer in progress. Candidate remains in the interview stage.
              </BodyText>
            </Box>
          </Card>
        );
      case 'personal':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Contact & Personal Details
            </Heading>
            <Flex flexWrap="wrap" gap="xl">
              <Box flex="1 1 200px">
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Email</BodyText>
                <BodyText size="small" color={SANA_LINK_ACCENT} marginBottom="m">{MOCK.email}</BodyText>
                
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Mobile</BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">{MOCK.mobile}</BodyText>
                
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Location</BodyText>
                <BodyText size="small" color={colors.blackPepper600}>Paris, Île-de-France, France</BodyText>
              </Box>
              <Box flex="1 1 200px">
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">LinkedIn</BodyText>
                <BodyText size="small" color={SANA_LINK_ACCENT} marginBottom="m">linkedin.com/in/camilledubois</BodyText>
                
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Preferred Language</BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">French (Native), English (Fluent)</BodyText>
                
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">Right to Work</BodyText>
                <BodyText size="small" color={colors.blackPepper600}>Yes (Citizen)</BodyText>
              </Box>
            </Flex>
          </Card>
        );
      case 'job-history':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Experience
            </Heading>
            
            <Box marginBottom="l" paddingBottom="m" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
              <Flex justifyContent="space-between">
                <BodyText size="small" fontWeight="bold">Design Lead</BodyText>
                <BodyText size="small" color={colors.blackPepper500}>Oct 2019 – Present</BodyText>
              </Flex>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">TechCorp SaaS · Paris, France</BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Led a team of 4 designers to overhaul the core enterprise application. Established a comprehensive design system reducing UI inconsistencies by 40%.
              </BodyText>
            </Box>
            
            <Box>
              <Flex justifyContent="space-between">
                <BodyText size="small" fontWeight="bold">Product Designer</BodyText>
                <BodyText size="small" color={colors.blackPepper500}>Jan 2015 – Sep 2019</BodyText>
              </Flex>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">RetailSolutions · Lyon, France</BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Designed mobile POS interfaces and inventory management dashboards. Conducted weekly user testing sessions with store managers.
              </BodyText>
            </Box>
          </Card>
        );
      case 'comments':
        return (
          <Card padding="l" style={cardStyle()}>
            <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
              <Heading size="small">Comments & Notes</Heading>
              <SecondaryButton size="small">Add Note</SecondaryButton>
            </Flex>
            
            <Box padding="m" style={{ backgroundColor: colors.soap100, borderRadius: 8, marginBottom: 'm' }}>
              <Flex justifyContent="space-between" marginBottom="xs">
                <BodyText size="small" fontWeight="bold">Sophie Laurent (Recruiter)</BodyText>
                <BodyText size="small" color={colors.blackPepper500}>18 Mar 2026</BodyText>
              </Flex>
              <BodyText size="small" color={colors.blackPepper600}>
                Candidate is very responsive on WhatsApp. Prefers afternoon interviews. Salary expectations are within our band.
              </BodyText>
            </Box>
          </Card>
        );
      case 'attachments':
        return (
          <Card padding="l" style={cardStyle()}>
            <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
              <Heading size="small">Attachments</Heading>
              <SecondaryButton size="small">Upload</SecondaryButton>
            </Flex>
            
            <Flex flexDirection="column" gap="s">
              <Flex alignItems="center" gap="m" padding="s" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                <SystemIcon icon={documentIcon} size={24} color={colors.blackPepper500} />
                <Box flex={1}>
                  <BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>CV_Camille_Dubois_2026.pdf</BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>Added by Candidate · 18 Mar 2026 · 1.2 MB</BodyText>
                </Box>
              </Flex>
              <Flex alignItems="center" gap="m" padding="s" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                <SystemIcon icon={documentIcon} size={24} color={colors.blackPepper500} />
                <Box flex={1}>
                  <BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>Portfolio_Presentation.pdf</BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>Added by Candidate · 18 Mar 2026 · 5.4 MB</BodyText>
                </Box>
              </Flex>
            </Flex>
          </Card>
        );
      case 'business-process':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">
              Business Process History
            </Heading>
            
            <Flex flexDirection="column" gap="m">
              <Flex gap="m">
                <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.green500, marginTop: 4 }} />
                <Box>
                  <BodyText size="small" fontWeight="bold">Move to Interview</BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>Completed by Sophie Laurent · 20 Mar 2026</BodyText>
                </Box>
              </Flex>
              <Flex gap="m">
                <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.green500, marginTop: 4 }} />
                <Box>
                  <BodyText size="small" fontWeight="bold">Screening</BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>Completed by Sophie Laurent · 19 Mar 2026</BodyText>
                </Box>
              </Flex>
              <Flex gap="m">
                <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.green500, marginTop: 4 }} />
                <Box>
                  <BodyText size="small" fontWeight="bold">Application Received</BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>System · 18 Mar 2026</BodyText>
                </Box>
              </Flex>
            </Flex>
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
                  <SecondaryButton size="small">Reject</SecondaryButton>
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
        expandedWidthPx={activeChannel === 'email' ? 950 : DEFAULT_COMM_EXPANDED_PX}
        panel={
          activeChannel === 'email' ? (
            <EmailPanel
              threads={emailThreads}
              activeThreadId={activeEmailThreadId}
              onThreadSelect={(id) => {
                setActiveEmailThreadId(id);
                if (id) {
                  const thread = emailThreads.find((t) => t.id === id);
                  if (thread) setEmailSubject(thread.subject);
                  setEmailText('');
                }
              }}
              onNewEmail={() => {
                setActiveEmailThreadId(null);
                setEmailSubject('');
                setEmailText('');
              }}
              from={emailFrom}
              to={emailTo}
              cc={emailCc}
              subject={emailSubject}
              body={emailText}
              onFromChange={setEmailFrom}
              onToChange={setEmailTo}
              onCcChange={setEmailCc}
              onSubjectChange={setEmailSubject}
              onBodyChange={(html, text) => setEmailText(text)}
              onSend={handleSendEmail}
              onClosePanel={collapseMessaging}
              showBranding
              brandingChecked={applyBranding}
              onBrandingChange={setApplyBranding}
            />
          ) : (
            messagingPanel
          )
        }
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
