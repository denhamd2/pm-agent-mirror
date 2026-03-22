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
import { FormField } from '@workday/canvas-kit-react/form-field';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import {
  checkIcon,
  exclamationTriangleIcon,
  xSmallIcon,
  phoneIcon,
  mailIcon,
  arrowLeftSmallIcon,
  documentIcon,
  sendIcon,
  plusIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  CommunicationDock,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  DEFAULT_COMM_EXPANDED_PX,
  SANA_PAGE_CANVAS,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
  SANA_CARD_RADIUS_LG,
  SanaCommComposer,
  SanaCommMessageBubble,
  sanaCommFormControlStyle,
} from './components';

/**
 * GCC-E2E-004 — WhatsApp 2-way from candidate profile (Pattern B, no campaign builder).
 * PRD: docs/prds/gcc-whatsapp-2way-communication-prd.md
 * Brief: design/gcc-whatsapp-2way-communication-discovery-brief.md
 */

function WhatsAppMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

type ConsentStatus = 'opted_in' | 'no_consent' | 'opted_out';

interface Candidate {
  name: string;
  email: string;
  phoneE164: string;
  phoneDisplay: string;
  company: string;
  country: string;
  consent: ConsentStatus;
  consentRecorded: string;
  consentSource: string;
  requisitionId: string;
  jobTitle: string;
  stage: string;
  hiringManager: string;
  recruiter: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  body: string;
  variables: string[];
  bodyAr?: string;
}

interface ThreadMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  text: string;
  timestamp: string;
  meta?: string;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'interview_coord',
    name: 'Interview coordination (GCC)',
    body: 'Hi {{name}}, this is {{recruiter}} from {{company}} regarding {{role}}. Can you confirm {{date}} at {{time}} GST for your video interview?',
    variables: ['{{name}}', '{{recruiter}}', '{{company}}', '{{role}}', '{{date}}', '{{time}}'],
    bodyAr: 'مرحبا {{name}}، معك {{recruiter}} من {{company}} بخصوص {{role}}. هل يمكنك تأكيد {{date}} الساعة {{time}} بتوقيت الخليج لمقابلتك؟',
  },
  {
    id: 'offer_prep',
    name: 'Offer preparation',
    body: 'Hi {{name}}, we are preparing your offer for {{role}}. Please reply with any questions before we finalise documents.',
    variables: ['{{name}}', '{{role}}'],
    bodyAr: 'مرحبا {{name}}، نجهّز عرضك لوظيفة {{role}}. أرسل أي أسئلة قبل إنهاء المستندات.',
  },
  {
    id: 'quick_nudge',
    name: 'Application follow-up',
    body: 'Hi {{name}}, following up on your application for {{role}} at {{company}}. Are you still interested in moving forward?',
    variables: ['{{name}}', '{{role}}', '{{company}}'],
  },
];

const MOCK_CANDIDATE: Candidate = {
  name: 'Sara Al-Mansoori',
  email: 'sara.almansoori@example.com',
  phoneE164: '+971501234567',
  phoneDisplay: '+971 50 123 4567 (Mobile)',
  company: 'Emirates Growth Partners',
  country: 'United Arab Emirates',
  consent: 'opted_in',
  consentRecorded: '12 March 2026',
  consentSource: 'Job application — WhatsApp channel',
  requisitionId: 'JR-0142',
  jobTitle: 'Senior consultant — GCC',
  stage: 'Interview',
  hiringManager: 'Omar Haddad',
  recruiter: 'Layla Rahman',
};

function candidateTabId(label: string): string {
  return label.replace(/\s+/g, '_').toLowerCase();
}

const SIDEBAR_LABELS = [
  'Summary',
  'Overview',
  'Recruiting History',
  'Attachments',
  'Reminders',
  'Questionnaire Results',
  'Interview',
  'Screening',
  'Employment Offer',
  'Personal Notes',
] as const;

const CANDIDATE_TABS = SIDEBAR_LABELS.map((label) => ({ id: candidateTabId(label), label }));

function getConsentLabel(status: ConsentStatus): string {
  switch (status) {
    case 'opted_in':
      return 'Opted in to WhatsApp';
    case 'opted_out':
      return 'Opted out of WhatsApp';
    default:
      return 'No WhatsApp consent on file';
  }
}

function getConsentColor(status: ConsentStatus): string {
  switch (status) {
    case 'opted_in':
      return colors.greenApple600;
    case 'opted_out':
      return colors.cinnamon600;
    default:
      return colors.cantaloupe600;
  }
}

function renderPreview(template: MessageTemplate, c: Candidate): string {
  const first = c.name.split(' ')[0];
  return template.body
    .replace(/\{\{name\}\}/g, first)
    .replace(/\{\{recruiter\}\}/g, c.recruiter)
    .replace(/\{\{company\}\}/g, c.company)
    .replace(/\{\{role\}\}/g, c.jobTitle)
    .replace(/\{\{date\}\}/g, '26 March 2026')
    .replace(/\{\{time\}\}/g, '14:00');
}

function renderPreviewAr(template: MessageTemplate, c: Candidate): string | null {
  if (!template.bodyAr) return null;
  const first = c.name.split(' ')[0];
  return template.bodyAr
    .replace(/\{\{name\}\}/g, first)
    .replace(/\{\{recruiter\}\}/g, c.recruiter)
    .replace(/\{\{company\}\}/g, c.company)
    .replace(/\{\{role\}\}/g, c.jobTitle)
    .replace(/\{\{date\}\}/g, '26 مارس 2026')
    .replace(/\{\{time\}\}/g, '14:00');
}

const INITIAL_THREAD: ThreadMessage[] = [
  {
    id: 'm1',
    direction: 'outbound',
    text: renderPreview(TEMPLATES[0], MOCK_CANDIDATE),
    timestamp: 'Yesterday · 09:12',
    meta: 'Sent · Delivered',
  },
  {
    id: 'm2',
    direction: 'inbound',
    text: 'Yes, 26 March at 2pm works. Please send the calendar invite.',
    timestamp: 'Yesterday · 09:18',
    meta: 'Received',
  },
  {
    id: 'm3',
    direction: 'outbound',
    text: 'Invite sent to your email. Let me know if you need a different link.',
    timestamp: 'Yesterday · 09:21',
    meta: 'Sent · Read',
  },
  {
    id: 'm4',
    direction: 'inbound',
    text: 'Got it, thank you.',
    timestamp: 'Yesterday · 09:22',
    meta: 'Received',
  },
];

export const GCCWhatsApp2WayCommunication: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [candidate, setCandidate] = useState<Candidate>(MOCK_CANDIDATE);
  const [activeNavId, setActiveNavId] = useState(candidateTabId('Summary'));
  const [whatsappExpanded, setWhatsappExpanded] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [messages, setMessages] = useState<ThreadMessage[]>(INITIAL_THREAD);
  const [sessionWindowOpen, setSessionWindowOpen] = useState(true);
  const [composerDraft, setComposerDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0],
    [selectedTemplateId]
  );

  const hasConsent = candidate.consent === 'opted_in';
  const optedOut = candidate.consent === 'opted_out';
  const railReservePx = DEFAULT_COMM_RAIL_PX;

  const collapseWhatsapp = useCallback(() => {
    if (!isSending) {
      setWhatsappExpanded(false);
      setSendSuccess(false);
    }
  }, [isSending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && whatsappExpanded && !isSending) {
        setWhatsappExpanded(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [whatsappExpanded, isSending]);

  const appendOutbound = (text: string, meta = 'Sent') => {
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, direction: 'outbound', text, timestamp: `Today · ${ts}`, meta },
    ]);
  };

  const handleSendTemplate = async () => {
    if (!hasConsent || optedOut) return;
    setProviderError(null);
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSending(false);
    appendOutbound(renderPreview(selectedTemplate, candidate), 'Template sent · Delivered');
    setSessionWindowOpen(true);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2500);
  };

  const handleSendComposer = async () => {
    if (!hasConsent || optedOut || !sessionWindowOpen || !composerDraft.trim()) return;
    setProviderError(null);
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    appendOutbound(composerDraft.trim(), 'Sent · Delivered');
    setComposerDraft('');
  };

  const simulateInbound = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `in-${Date.now()}`,
        direction: 'inbound',
        text: 'Sounds good — I will join five minutes early.',
        timestamp: `Today · ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        meta: 'Received',
      },
    ]);
  };

  const composerDisabled =
    !hasConsent || optedOut || isSending || !sessionWindowOpen || !composerDraft.trim();

  const renderMainColumn = () => {
    switch (activeNavId) {
      case 'summary':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Candidate summary
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="l">
              {candidate.requisitionId} · {candidate.jobTitle} · Stage: {candidate.stage}
            </BodyText>
            <Tabs initialTab="application">
              <Tabs.List marginBottom="l">
                <Tabs.Item data-id="application">Job application</Tabs.Item>
                <Tabs.Item data-id="personal">Personal</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel data-id="application">
                <Flex flexDirection="column" gap="l">
                  <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                    <Heading size="small" marginBottom="m">
                      Application snapshot
                    </Heading>
                    <Flex flexWrap="wrap" gap="xl">
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          Requisition
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {candidate.requisitionId}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          Role
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {candidate.jobTitle}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          Stage
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {candidate.stage}
                        </BodyText>
                      </Box>
                    </Flex>
                  </Card>
                  <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                    <Heading size="small" marginBottom="m">
                      WhatsApp consent and messaging
                    </Heading>
                    <Flex alignItems="flex-start" gap="m" flexWrap="wrap">
                      <Flex alignItems="center" gap="xs">
                        {candidate.consent === 'opted_in' ? (
                          <SystemIcon icon={checkIcon} size={18} color={colors.greenApple600} aria-hidden />
                        ) : candidate.consent === 'opted_out' ? (
                          <SystemIcon icon={xSmallIcon} size={18} color={colors.cinnamon600} aria-hidden />
                        ) : (
                          <SystemIcon icon={exclamationTriangleIcon} size={18} color={colors.cantaloupe600} aria-hidden />
                        )}
                        <BodyText size="medium" style={{ color: getConsentColor(candidate.consent) }}>
                          {getConsentLabel(candidate.consent)}
                        </BodyText>
                      </Flex>
                      <Box flex="1" minWidth={240}>
                        <BodyText size="small" color={colors.blackPepper600}>
                          Recorded {candidate.consentRecorded}. Source: {candidate.consentSource}.
                        </BodyText>
                        {!hasConsent && (
                          <BodyText size="small" color={colors.blackPepper600} marginTop="s">
                            Request consent through your organisation&apos;s process before sending WhatsApp. Do not send
                            unsolicited template messages.
                          </BodyText>
                        )}
                      </Box>
                    </Flex>
                    <Flex gap="s" marginTop="m" flexWrap="wrap">
                      <SecondaryButton size="small" onClick={() => setWhatsappExpanded(true)}>
                        Open WhatsApp thread
                      </SecondaryButton>
                      <TertiaryButton size="small" onClick={() => setTemplateModalOpen(true)}>
                        View approved templates
                      </TertiaryButton>
                    </Flex>
                  </Card>
                </Flex>
              </Tabs.Panel>
              <Tabs.Panel data-id="personal">
                <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                  <Heading size="small" marginBottom="m">
                    Contact
                  </Heading>
                  <Box marginBottom="s">
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Mobile (E.164)
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.phoneE164}
                    </BodyText>
                  </Box>
                  <Box marginBottom="s">
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Email
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.email}
                    </BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Country / region
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.country}
                    </BodyText>
                  </Box>
                </Card>
              </Tabs.Panel>
            </Tabs>
          </Box>
        );
      case 'overview':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Overview
            </Heading>
            <Flex flexDirection="column" gap="l">
              <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                <Heading size="small" marginBottom="m">
                  Professional summary
                </Heading>
                <BodyText size="small" color={colors.blackPepper600}>
                  Senior consultant with 8+ years across GCC digital transformation programmes. Strong stakeholder
                  management, Arabic and English fluency, experience with regulated industries.
                </BodyText>
              </Card>
              <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                <Heading size="small" marginBottom="m">
                  Skills
                </Heading>
                <Flex gap="s" flexWrap="wrap">
                  {['Change management', 'Stakeholder workshops', 'Agile delivery', 'Arabic (native)', 'English (fluent)'].map(
                    (s) => (
                      <Box
                        key={s}
                        paddingX="m"
                        paddingY="xs"
                        style={{
                          borderRadius: 999,
                          backgroundColor: colors.soap100,
                          border: `1px solid ${colors.soap300}`,
                        }}
                      >
                        <BodyText size="small">{s}</BodyText>
                      </Box>
                    )
                  )}
                </Flex>
              </Card>
            </Flex>
          </Box>
        );
      case 'recruiting_history':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Recruiting history
            </Heading>
            <Card padding="zero" style={{ borderRadius: SANA_CARD_RADIUS_LG, overflow: 'hidden' }}>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Date</Table.Header>
                    <Table.Header>Event</Table.Header>
                    <Table.Header>Owner</Table.Header>
                    <Table.Header>Details</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {[
                    ['18 Mar 2026', 'Stage change', candidate.recruiter, 'Advanced to Interview'],
                    ['10 Mar 2026', 'Screening complete', candidate.recruiter, 'Meets minimum requirements'],
                    ['4 Mar 2026', 'Application received', 'System', `Source: LinkedIn · ${candidate.requisitionId}`],
                  ].map(([d, ev, o, det]) => (
                    <Table.Row key={String(d)}>
                      <Table.Cell>
                        <BodyText size="small">{d}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">{ev}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">{o}</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {det}
                        </BodyText>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card>
          </Box>
        );
      case 'attachments':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Attachments
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              {[
                { name: 'Sara_AlMansoori_CV.pdf', size: '312 KB', date: '4 Mar 2026' },
                { name: 'Portfolio_Summary.docx', size: '88 KB', date: '5 Mar 2026' },
              ].map((f) => (
                <Flex
                  key={f.name}
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY="s"
                  style={{ borderBottom: `1px solid ${colors.soap200}` }}
                >
                  <Flex alignItems="center" gap="m">
                    <SystemIcon icon={documentIcon} size={20} color={colors.blackPepper400} aria-hidden />
                    <Box>
                      <BodyText size="small" fontWeight="bold">
                        {f.name}
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500}>
                        {f.size} · {f.date}
                      </BodyText>
                    </Box>
                  </Flex>
                  <TertiaryButton size="small">View</TertiaryButton>
                </Flex>
              ))}
            </Card>
          </Box>
        );
      case 'reminders':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Reminders
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              {[
                { title: 'Send interview briefing pack', due: '21 Mar 2026', owner: candidate.recruiter },
                { title: 'Collect panel feedback', due: '27 Mar 2026', owner: candidate.hiringManager },
              ].map((r) => (
                <Flex
                  key={r.title}
                  justifyContent="space-between"
                  alignItems="flex-start"
                  marginBottom="m"
                  paddingBottom="m"
                  style={{ borderBottom: `1px solid ${colors.soap200}` }}
                >
                  <Box>
                    <BodyText size="small" fontWeight="bold">
                      {r.title}
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      Due {r.due} · {r.owner}
                    </BodyText>
                  </Box>
                  <SecondaryButton size="small">Mark done</SecondaryButton>
                </Flex>
              ))}
              <PrimaryButton size="small" icon={plusIcon}>
                Add reminder
              </PrimaryButton>
            </Card>
          </Box>
        );
      case 'questionnaire_results':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Questionnaire results
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Questionnaire</Table.Header>
                    <Table.Header>Status</Table.Header>
                    <Table.Header>Score</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small">Consultant pre-screen</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Complete</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">82 / 100</BodyText>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small">Right to work checklist</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">In progress</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">—</BodyText>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Card>
          </Box>
        );
      case 'interview':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Interview
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Panel interview (video)
              </Heading>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
                26 March 2026 · 14:00–15:00 GST · Microsoft Teams
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Panel: {candidate.hiringManager}, principal consultant (TA note: confirm local holiday calendar).
              </BodyText>
              <Flex gap="s">
                <SecondaryButton size="small">Reschedule</SecondaryButton>
                <TertiaryButton size="small">Copy candidate instructions</TertiaryButton>
              </Flex>
            </Card>
          </Box>
        );
      case 'screening':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Screening
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Recruiter screening
              </Heading>
              <BodyText size="small" fontWeight="bold" marginBottom="xs">
                Status: Complete — advance to interview
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Notes: Strong examples of GCC client delivery; confirm travel availability for KSA onsite workshops.
              </BodyText>
            </Card>
          </Box>
        );
      case 'employment_offer':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Employment offer
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <BodyText size="small" fontWeight="bold" marginBottom="s">
                No offer in progress
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Offer tasks appear here after the interview outcome is recorded.
              </BodyText>
              <SecondaryButton size="small" disabled>
                Start offer (not available at this stage)
              </SecondaryButton>
            </Card>
          </Box>
        );
      case 'personal_notes':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Personal notes
            </Heading>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }} marginBottom="l">
              <FormField id="personal-note">
                <FormField.Label>Add note (visible to you)</FormField.Label>
                <FormField.Input
                  as={TextInput}
                  value={noteDraft}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteDraft(e.target.value)}
                  placeholder="e.g. Prefer afternoon slots; avoid Friday mornings."
                />
              </FormField>
              <PrimaryButton size="small" marginTop="m" onClick={() => setNoteDraft('')}>
                Save note
              </PrimaryButton>
            </Card>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Recent notes
              </Heading>
              {[
                { when: '17 Mar 2026', text: 'Confirmed Arabic fluency for client workshops.' },
                { when: '12 Mar 2026', text: 'Consent captured on application; WhatsApp enabled for tenant.' },
              ].map((n) => (
                <Box key={n.when} marginBottom="m" paddingBottom="m" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
                  <BodyText size="small" color={colors.blackPepper500}>
                    {n.when}
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {n.text}
                  </BodyText>
                </Box>
              ))}
            </Card>
          </Box>
        );
      default:
        return null;
    }
  };

  const whatsappPanel = (
    <Box
      role={whatsappExpanded ? 'dialog' : undefined}
      aria-modal={whatsappExpanded ? true : undefined}
      aria-labelledby={whatsappExpanded ? 'wa-2way-title' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
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
            <Box style={{ color: '#128C7E', display: 'flex' }} aria-hidden>
              <WhatsAppMark size={24} />
            </Box>
            <Heading size="small" id="wa-2way-title">
              WhatsApp
            </Heading>
          </Flex>
          <ToolbarIconButton icon={xSmallIcon} aria-label="Close WhatsApp panel" onClick={collapseWhatsapp} disabled={isSending} />
        </Flex>
        <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
          {candidate.requisitionId} · {candidate.jobTitle} · 1:1 thread on this application
        </BodyText>
      </Box>

      <Box padding="l" style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: SANA_COMM_PANEL_SURFACE }}>
        {sendSuccess && (
          <Card
            marginBottom="m"
            padding="m"
            style={{
              backgroundColor: colors.greenApple100,
              border: `1px solid ${colors.greenApple600}`,
              boxShadow: 'none',
            }}
          >
            <Flex alignItems="center" gap="xs">
              <SystemIcon icon={checkIcon} size={16} color={colors.greenApple600} />
              <BodyText size="medium" color={colors.greenApple600}>
                Message sent successfully.
              </BodyText>
            </Flex>
          </Card>
        )}

        {providerError && (
          <Banner as="div" hasError={true} marginBottom="m">
            <Banner.Icon />
            <Banner.Label>{providerError}</Banner.Label>
          </Banner>
        )}

        {optedOut && (
          <Banner as="div" hasError={true} marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              This candidate opted out of WhatsApp. Sending is blocked. Preference updates may take a few minutes to sync.
            </Banner.Label>
          </Banner>
        )}

        {!hasConsent && !optedOut && (
          <Banner as="div" hasError={true} marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              No WhatsApp consent on file. Request consent through your organisation&apos;s approved process before messaging.
            </Banner.Label>
          </Banner>
        )}

        {!sessionWindowOpen && hasConsent && !optedOut && (
          <Card
            marginBottom="m"
            padding="m"
            style={{
              backgroundColor: colors.soap100,
              border: `1px solid ${colors.soap300}`,
              boxShadow: 'none',
            }}
          >
            <BodyText size="small" color={colors.blackPepper600}>
              The 24-hour messaging window from the last candidate reply has closed. Choose an approved template below and send
              it to reopen a session for free-text replies (subject to Meta / WhatsApp policy and your tenant rules).
            </BodyText>
          </Card>
        )}

        <Card
          marginBottom="m"
          padding="m"
          style={{
            backgroundColor: colors.soap100,
            boxShadow: 'none',
            border: `1px solid ${colors.soap300}`,
          }}
        >
          <BodyText size="small" fontWeight="bold" marginBottom="xs">
            Consent
          </BodyText>
          <Flex alignItems="center" gap="xs" marginBottom="xxs">
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: getConsentColor(candidate.consent),
              }}
              aria-hidden
            />
            <BodyText size="small" style={{ color: getConsentColor(candidate.consent) }}>
              {getConsentLabel(candidate.consent)}
            </BodyText>
          </Flex>
          <BodyText size="small" color={colors.blackPepper600}>
            Recorded {candidate.consentRecorded} · {candidate.consentSource}
          </BodyText>
        </Card>

        <Card
          marginBottom="m"
          padding="m"
          style={{
            backgroundColor: colors.soap100,
            boxShadow: 'none',
            border: `1px solid ${colors.soap300}`,
          }}
        >
          <BodyText size="small" fontWeight="bold" marginBottom="xs">
            Recipient
          </BodyText>
          <BodyText size="medium">{candidate.name}</BodyText>
          <BodyText size="small" color={colors.blackPepper600}>
            {candidate.phoneDisplay}
          </BodyText>
        </Card>

        <Box marginBottom="m">
          <FormField id="wa-2way-template">
            <FormField.Label>Approved template</FormField.Label>
            <FormField.Input
              as="select"
              value={selectedTemplateId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTemplateId(e.target.value)}
              style={sanaCommFormControlStyle()}
              disabled={!hasConsent || optedOut}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </FormField.Input>
          </FormField>
        </Box>

        <Card
          padding="m"
          marginBottom="m"
          style={{
            backgroundColor: colors.frenchVanilla100,
            boxShadow: 'none',
            border: `1px solid ${colors.soap300}`,
          }}
        >
          <BodyText size="small" fontWeight="bold" marginBottom="xs">
            Preview (English)
          </BodyText>
          <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
            {renderPreview(selectedTemplate, candidate)}
          </BodyText>
          {renderPreviewAr(selectedTemplate, candidate) && (
            <>
              <BodyText size="small" fontWeight="bold" marginBottom="xs">
                Preview (Arabic, RTL)
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600} style={{ direction: 'rtl' }}>
                {renderPreviewAr(selectedTemplate, candidate)}
              </BodyText>
            </>
          )}
          <BodyText size="small" color={colors.blackPepper500} marginTop="s">
            Variables: {selectedTemplate.variables.join(', ')}
          </BodyText>
        </Card>

        <PrimaryButton
          marginBottom="l"
          onClick={handleSendTemplate}
          disabled={!hasConsent || optedOut || isSending}
        >
          {isSending ? 'Sending template…' : 'Send template'}
        </PrimaryButton>

        <BodyText size="small" fontWeight="bold" marginBottom="s">
          Thread
        </BodyText>
        <Box marginBottom="m">
          {messages.map((m) => (
            <SanaCommMessageBubble
              key={m.id}
              align={m.direction === 'outbound' ? 'end' : 'start'}
              timestamp={m.meta ? `${m.timestamp} · ${m.meta}` : m.timestamp}
            >
              {m.text}
            </SanaCommMessageBubble>
          ))}
        </Box>

        <SanaCommComposer
          value={composerDraft}
          onChange={setComposerDraft}
          placeholder={
            !sessionWindowOpen
              ? 'Window closed — send a template to continue.'
              : `Message ${candidate.name.split(' ')[0]}…`
          }
          onSend={handleSendComposer}
          sendDisabled={composerDisabled}
          sendLabel={isSending ? 'Sending…' : 'Send'}
          footer={
            <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="s">
              <TertiaryButton size="small" onClick={() => setTemplateModalOpen(true)}>
                Template library
              </TertiaryButton>
              <TertiaryButton size="small" onClick={simulateInbound}>
                Simulate inbound reply
              </TertiaryButton>
            </Flex>
          }
        />

        <SecondaryButton marginTop="m" onClick={collapseWhatsapp} disabled={isSending}>
          Close panel
        </SecondaryButton>
      </Box>
    </Box>
  );

  return (
    <Box style={{ position: 'relative' }}>
      <CommunicationDock
        headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
        expanded={whatsappExpanded}
        railWidthPx={DEFAULT_COMM_RAIL_PX}
        expandedWidthPx={DEFAULT_COMM_EXPANDED_PX}
        panel={whatsappPanel}
        rail={
          <>
            <Box
              as="button"
              type="button"
              aria-label={whatsappExpanded ? 'Collapse panel' : 'Expand panel'}
              onClick={() => setWhatsappExpanded((v) => !v)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <Box
                style={{
                  display: 'flex',
                  transform: whatsappExpanded ? 'rotate(180deg)' : undefined,
                  transition: 'transform 0.2s ease',
                }}
              >
                <SystemIcon icon={arrowLeftSmallIcon} size={20} color={colors.blackPepper600} aria-hidden />
              </Box>
            </Box>
            <Box
              as="button"
              type="button"
              aria-label="Email"
              title="Email"
              onClick={() => setWhatsappExpanded(false)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={mailIcon} size={20} color={colors.blackPepper600} aria-hidden />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label="SMS"
              title="SMS (Workday Messaging)"
              onClick={() => setWhatsappExpanded(false)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={phoneIcon} size={20} color={colors.blackPepper600} aria-hidden />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label={whatsappExpanded ? 'Collapse WhatsApp' : 'Expand WhatsApp'}
              title="WhatsApp"
              aria-expanded={whatsappExpanded}
              onClick={() => setWhatsappExpanded((v) => !v)}
              style={communicationRailButtonStyle(whatsappExpanded, DEFAULT_COMM_RAIL_PX)}
            >
              <Box style={{ color: whatsappExpanded ? SANA_LINK_ACCENT : '#128C7E', display: 'flex' }} aria-hidden>
                <WhatsAppMark size={20} />
              </Box>
            </Box>
          </>
        }
      />

      {templateModalOpen && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            backgroundColor: 'rgba(15, 46, 102, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setTemplateModalOpen(false)}
          role="presentation"
        >
          <Card
            padding="l"
            style={{ maxWidth: 520, width: '100%', borderRadius: SANA_CARD_RADIUS_LG, maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
              <Heading size="small">Approved WhatsApp templates</Heading>
              <ToolbarIconButton
                icon={xSmallIcon}
                aria-label="Close"
                onClick={() => setTemplateModalOpen(false)}
              />
            </Flex>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              Templates are approved in Meta Business Manager and synced to Workday. Final consent and privacy wording is owned
              by your organisation and must be signed off by Legal.
            </BodyText>
            {TEMPLATES.map((t) => (
              <Card key={t.id} padding="m" marginBottom="s" style={{ border: `1px solid ${colors.soap300}` }}>
                <BodyText size="small" fontWeight="bold">
                  {t.name}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginTop="xs">
                  {t.body}
                </BodyText>
              </Card>
            ))}
            <PrimaryButton onClick={() => setTemplateModalOpen(false)} marginTop="m">
              Done
            </PrimaryButton>
          </Card>
        </Box>
      )}

      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
        <WorkdayTopNav
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showWMark
          showMenuWordmark={false}
          notificationBadge={3}
          inboxBadge={5}
        />

        <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
          <WorkdayLeftTabBar
            showSecondaryTitleIcon
            secondaryTitle={candidate.name}
            secondarySubtitle={`${candidate.requisitionId} · ${candidate.jobTitle}`}
            headerActions={
              <SecondaryButton size="small" style={{ borderRadius: 999, minHeight: 28, fontSize: 11 }}>
                Actions
              </SecondaryButton>
            }
            belowHeader={
              <Flex justifyContent="space-between" gap="xxs">
                {[
                  { label: 'Phone', icon: phoneIcon, onClick: () => undefined },
                  {
                    label: 'Message',
                    icon: sendIcon,
                    onClick: () => setWhatsappExpanded(true),
                  },
                  { label: 'Resume', icon: documentIcon, onClick: () => undefined },
                ].map(({ label, icon, onClick }) => (
                  <Box
                    key={label}
                    as="button"
                    type="button"
                    onClick={onClick}
                    aria-label={label}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 999,
                      border: `1px solid ${colors.soap300}`,
                      backgroundColor: colors.soap100,
                      color: colors.blackPepper600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                    }}
                  >
                    <SystemIcon icon={icon} size={18} color={colors.blackPepper600} aria-hidden />
                    {label}
                  </Box>
                ))}
              </Flex>
            }
            tabs={CANDIDATE_TABS}
            activeTabId={activeNavId}
            onTabChange={setActiveNavId}
          />

          <Box
            flex={1}
            minWidth={0}
            padding="l"
            style={{
              paddingRight: `calc(${railReservePx}px + 1.5rem)`,
              boxSizing: 'border-box',
            }}
          >
            {renderMainColumn()}

            <Card
              marginTop="xl"
              padding="m"
              style={{
                backgroundColor: colors.soap100,
                boxShadow: 'none',
                border: `1px solid ${colors.soap300}`,
                borderRadius: SANA_CARD_RADIUS_LG,
              }}
            >
              <BodyText size="small" fontWeight="bold" marginBottom="s">
                Prototype controls
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Adjust consent, session window, and sample provider errors for stakeholder review.
              </BodyText>
              <Flex gap="s" flexWrap="wrap" marginBottom="m">
                <SecondaryButton
                  size="small"
                  onClick={() => setCandidate((c) => ({ ...c, consent: 'opted_in' }))}
                >
                  Consent: opted in
                </SecondaryButton>
                <SecondaryButton
                  size="small"
                  onClick={() => setCandidate((c) => ({ ...c, consent: 'no_consent' }))}
                >
                  Consent: none
                </SecondaryButton>
                <SecondaryButton
                  size="small"
                  onClick={() => setCandidate((c) => ({ ...c, consent: 'opted_out' }))}
                >
                  Consent: opted out
                </SecondaryButton>
              </Flex>
              <Flex gap="s" flexWrap="wrap" marginBottom="m">
                <SecondaryButton size="small" onClick={() => setSessionWindowOpen(true)}>
                  Session window: open
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setSessionWindowOpen(false)}>
                  Session window: closed (template required)
                </SecondaryButton>
              </Flex>
              <Flex gap="s" flexWrap="wrap">
                <SecondaryButton
                  size="small"
                  onClick={() =>
                    setProviderError('Template rejected by provider (code 131026). Try another template or contact your admin.')
                  }
                >
                  Show provider error
                </SecondaryButton>
                <TertiaryButton size="small" onClick={() => setProviderError(null)}>
                  Clear provider error
                </TertiaryButton>
              </Flex>
            </Card>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default GCCWhatsApp2WayCommunication;
