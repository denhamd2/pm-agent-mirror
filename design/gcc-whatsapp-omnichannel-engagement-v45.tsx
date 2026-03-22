/**
 * GCC-E2E-006 Step 5 — Omnichannel candidate engagement (Pattern B + Pattern D).
 * Discovery Brief: design/gcc-whatsapp-omnichannel-engagement-v45-discovery-brief.md
 * PRD: docs/prds/gcc-whatsapp-omnichannel-candidate-engagement-prd.md
 * Copy: §7 Approved copy inventory (319). [060] strings flagged in UI.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Card } from '@workday/canvas-kit-react/card';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
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
  FormSelect,
  FormTextInput,
} from './components';

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
type ChannelKey = 'whatsapp' | 'email' | 'sms';
type ScreenKey = 'candidate' | 'admin';

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

interface TimelineMessage {
  id: string;
  channel: ChannelKey;
  direction: 'inbound' | 'outbound';
  text: string;
  timestamp: string;
  meta?: string;
}

const SMS_TILE_TOOLTIP =
  "SMS isn't available for this candidate's number in Workday. Use email or WhatsApp when your organisation allows it.";

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'interview_coord',
    name: 'Interview coordination (GCC)',
    body: 'Hi {{name}}, this is {{recruiter}} from {{company}} regarding {{role}}. Can you confirm {{date}} at {{time}} GST for your video interview?',
    variables: ['{{name}}', '{{recruiter}}', '{{company}}', '{{role}}', '{{date}}', '{{time}}'],
    bodyAr:
      'مرحبا {{name}}، معك {{recruiter}} من {{company}} بخصوص {{role}}. هل يمكنك تأكيد {{date}} الساعة {{time}} بتوقيت الخليج لمقابلتك؟',
  },
  {
    id: 'offer_prep',
    name: 'Offer preparation',
    body: 'Hi {{name}}, we are preparing your offer for {{role}}. Please reply with any questions before we finalise documents.',
    variables: ['{{name}}', '{{role}}'],
    bodyAr: 'مرحبا {{name}}، نجهّز عرضك لوظيفة {{role}}. أرسل أي أسئلة قبل إنهاء المستندات.',
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
  consentSource: 'Job application — messaging channels',
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

const INITIAL_TIMELINE: TimelineMessage[] = [
  {
    id: 'm0',
    channel: 'email',
    direction: 'outbound',
    text: 'Thanks for applying for Senior consultant — GCC. We will confirm your interview shortly.',
    timestamp: 'Mon · 09:40',
    meta: 'Sent',
  },
  {
    id: 'm1',
    channel: 'whatsapp',
    direction: 'outbound',
    text: renderPreview(TEMPLATES[0], MOCK_CANDIDATE),
    timestamp: 'Mon · 10:05',
    meta: 'Sent · Delivered',
  },
  {
    id: 'm2',
    channel: 'whatsapp',
    direction: 'inbound',
    text: 'Yes, 26 March at 2pm works. Please send the calendar invite.',
    timestamp: 'Mon · 10:12',
    meta: 'Received',
  },
];

const ADMIN_TABS = [
  { id: 'channel_policy', label: 'Channel policy' },
  { id: 'credentials_sync', label: 'Credentials & template sync' },
  { id: 'retention', label: 'Retention' },
  { id: 'audit_export', label: 'Audit & export' },
  { id: 'inbound_review', label: 'Inbound review' },
] as const;

function channelLabel(ch: ChannelKey): string {
  if (ch === 'whatsapp') return 'WhatsApp';
  if (ch === 'email') return 'Email';
  return 'SMS';
}

export const GccWhatsappOmnichannelEngagementV45: React.FC = () => {
  const [prototypeScreen, setPrototypeScreen] = useState<ScreenKey>('candidate');
  const [searchValue, setSearchValue] = useState('');
  const [candidate, setCandidate] = useState<Candidate>(MOCK_CANDIDATE);
  const [activeNavId, setActiveNavId] = useState(candidateTabId('Summary'));
  const [adminTabId, setAdminTabId] = useState<string>('channel_policy');

  const [tenantWhatsappOn, setTenantWhatsappOn] = useState(true);
  const [tenantSmsOn, setTenantSmsOn] = useState(true);
  const smsEligible = false;

  const [dockExpanded, setDockExpanded] = useState(false);
  const [activeRail, setActiveRail] = useState<'email' | 'sms' | 'whatsapp'>('whatsapp');
  const [timelineFilter, setTimelineFilter] = useState<'all' | ChannelKey>('all');
  const [composerChannel, setComposerChannel] = useState<ChannelKey>('whatsapp');
  const [messages, setMessages] = useState<TimelineMessage[]>(INITIAL_TIMELINE);
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
  const [sessionWindowOpen, setSessionWindowOpen] = useState(true);
  const [composerDraft, setComposerDraft] = useState('');
  const [emailSubject, setEmailSubject] = useState('Interview next steps');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [legalAttest, setLegalAttest] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [retentionBody, setRetentionBody] = useState('365');
  const [retentionMeta, setRetentionMeta] = useState('730');
  const [scopeApply, setScopeApply] = useState('tenant');
  const [inboundResolved, setInboundResolved] = useState(false);

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0],
    [selectedTemplateId]
  );

  const hasConsent = candidate.consent === 'opted_in';
  const optedOut = candidate.consent === 'opted_out';
  const railReservePx = DEFAULT_COMM_RAIL_PX;

  const filteredMessages = useMemo(() => {
    if (timelineFilter === 'all') return messages;
    return messages.filter((m) => m.channel === timelineFilter);
  }, [messages, timelineFilter]);

  const collapseDock = useCallback(() => {
    if (!isSending) {
      setDockExpanded(false);
      setSendSuccess(false);
    }
  }, [isSending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dockExpanded && !isSending) collapseDock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dockExpanded, isSending, collapseDock]);

  useEffect(() => {
    if (!tenantWhatsappOn && composerChannel === 'whatsapp') setComposerChannel('email');
    if (!smsEligible && composerChannel === 'sms') setComposerChannel('email');
  }, [tenantWhatsappOn, smsEligible, composerChannel]);

  const openDock = (rail: 'email' | 'sms' | 'whatsapp') => {
    if (rail === 'sms' && !smsEligible) return;
    if (rail === 'whatsapp' && !tenantWhatsappOn) return;
    setActiveRail(rail);
    setComposerChannel(rail === 'sms' ? 'sms' : rail === 'email' ? 'email' : 'whatsapp');
    setDockExpanded(true);
  };

  const appendOutbound = (text: string, channel: ChannelKey, meta = 'Sent') => {
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        channel,
        direction: 'outbound',
        text,
        timestamp: `Today · ${ts}`,
        meta,
      },
    ]);
  };

  const handleSend = async () => {
    if (composerChannel === 'whatsapp') {
      if (!hasConsent || optedOut) return;
      if (!sessionWindowOpen) return;
      if (!composerDraft.trim()) return;
    } else if (composerChannel === 'email') {
      if (!emailBody.trim()) return;
    } else if (!smsEligible) return;

    setProviderError(null);
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSending(false);
    if (composerChannel === 'whatsapp') {
      appendOutbound(composerDraft.trim(), 'whatsapp', 'Sent · Delivered');
      setComposerDraft('');
    } else if (composerChannel === 'email') {
      appendOutbound(`${emailSubject}\n\n${emailBody}`, 'email', 'Sent');
      setEmailBody('');
    } else {
      appendOutbound(composerDraft.trim(), 'sms', 'Sent');
      setComposerDraft('');
    }
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2800);
  };

  const handleApplyTemplate = async () => {
    if (!hasConsent || optedOut || !tenantWhatsappOn) return;
    setProviderError(null);
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    appendOutbound(renderPreview(selectedTemplate, candidate), 'whatsapp', 'Template sent · Delivered');
    setSessionWindowOpen(true);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2800);
  };

  const handleSyncTemplates = () => {
    setSyncBusy(true);
    setTimeout(() => setSyncBusy(false), 1500);
    window.alert('Template sync started. Refresh this page in a few minutes.');
  };

  const handleExport = () => {
    setExportBusy(true);
    setTimeout(() => {
      setExportBusy(false);
      setExportModalOpen(false);
      window.alert("Export started. Download the file from your browser when it's ready.");
    }, 1200);
  };

  const composerDisabled =
    isSending ||
    (composerChannel === 'whatsapp' &&
      (!hasConsent || optedOut || !sessionWindowOpen || !composerDraft.trim())) ||
    (composerChannel === 'email' && !emailBody.trim()) ||
    (composerChannel === 'sms' && (!smsEligible || !hasConsent || optedOut || !composerDraft.trim()));

  const channelOptions = useMemo(() => {
    const o: { value: ChannelKey; label: string }[] = [{ value: 'email', label: 'Email' }];
    if (tenantWhatsappOn) o.push({ value: 'whatsapp', label: 'WhatsApp' });
    if (smsEligible) o.push({ value: 'sms', label: 'SMS' });
    return o;
  }, [tenantWhatsappOn, smsEligible]);

  const renderCandidateMain = () => {
    const c = candidate;
    switch (activeNavId) {
      case 'summary':
        return (
          <Box>
            <Heading size="medium" marginBottom="m">
              Candidate summary
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="l">
              {c.requisitionId} · {c.jobTitle} · Stage: {c.stage}
            </BodyText>
            {!tenantWhatsappOn && (
              <Banner as="div" marginBottom="m">
                <Banner.Icon />
                <Banner.Label>
                  WhatsApp is turned off for your organisation. To contact this candidate, send an email.
                </Banner.Label>
              </Banner>
            )}
            {hasConsent && optedOut === false ? null : optedOut ? (
              <Banner as="div" hasError marginBottom="m">
                <Banner.Icon />
                <Banner.Label>
                  This candidate opted out of messages on this channel. Sending is blocked. [060]
                </Banner.Label>
              </Banner>
            ) : (
              <Banner as="div" hasError marginBottom="m">
                <Banner.Icon />
                <Banner.Label>You can&apos;t send messages on this channel until the candidate opts in to messaging. [060]</Banner.Label>
              </Banner>
            )}
            <Tabs initialTab="eligibility">
              <Tabs.List marginBottom="l">
                <Tabs.Item data-id="eligibility">Channel eligibility</Tabs.Item>
                <Tabs.Item data-id="personal">Personal</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel data-id="eligibility">
                <Flex flexDirection="column" gap="l">
                  <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
                    <Heading size="small" marginBottom="m">
                      Channel eligibility and consent
                    </Heading>
                    <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                      Email is always available for 1-to-1 messages from this profile when your role allows it.
                    </BodyText>
                    <Flex flexWrap="wrap" gap="m" marginBottom="m">
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          WhatsApp
                        </BodyText>
                        <BodyText size="small" style={{ color: tenantWhatsappOn ? colors.greenApple600 : colors.blackPepper500 }}>
                          {tenantWhatsappOn ? 'On for your organisation' : 'Off for your organisation'}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          SMS (Workday Messaging)
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {smsEligible ? 'Eligible for this number' : 'Not eligible for this number'}
                        </BodyText>
                      </Box>
                    </Flex>
                    <Flex alignItems="center" gap="xs" marginBottom="s">
                      <Box
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: getConsentColor(c.consent),
                        }}
                        aria-hidden
                      />
                      <BodyText size="small" style={{ color: getConsentColor(c.consent) }}>
                        {c.consent === 'opted_in'
                          ? 'Opted in to messaging'
                          : c.consent === 'opted_out'
                            ? 'Opted out of messaging'
                            : 'No messaging consent on file'}
                      </BodyText>
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                      Recorded {c.consentRecorded}. Source: {c.consentSource}.
                    </BodyText>
                    <Flex gap="s" flexWrap="wrap">
                      <TertiaryButton size="small" onClick={() => setConsentModalOpen(true)}>
                        View messaging consent
                      </TertiaryButton>
                      <TertiaryButton size="small" onClick={() => setPrototypeScreen('admin')}>
                        View channel policy
                      </TertiaryButton>
                      <TertiaryButton size="small">Learn about SMS eligibility</TertiaryButton>
                    </Flex>
                  </Card>
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
                          {c.requisitionId}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          Role
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {c.jobTitle}
                        </BodyText>
                      </Box>
                      <Box>
                        <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                          Stage
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper600}>
                          {c.stage}
                        </BodyText>
                      </Box>
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
                      {c.phoneE164}
                    </BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Email
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {c.email}
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
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }} marginBottom="l">
              <Heading size="small" marginBottom="m">
                Professional summary
              </Heading>
              <BodyText size="small" color={colors.blackPepper600}>
                Senior consultant with 8+ years across GCC digital transformation programmes. Arabic and English fluency.
              </BodyText>
            </Card>
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Skills
              </Heading>
              <Flex gap="s" flexWrap="wrap">
                {['Change management', 'Agile delivery', 'Arabic (native)', 'English (fluent)'].map((s) => (
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
                ))}
              </Flex>
            </Card>
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
                    ['18 Mar 2026', 'Stage change', c.recruiter, 'Advanced to Interview'],
                    ['10 Mar 2026', 'Screening complete', c.recruiter, 'Meets minimum requirements'],
                    ['4 Mar 2026', 'Application received', 'System', `LinkedIn · ${c.requisitionId}`],
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
                { title: 'Send interview briefing pack', due: '21 Mar 2026', owner: c.recruiter },
                { title: 'Collect panel feedback', due: '27 Mar 2026', owner: c.hiringManager },
              ].map((r) => (
                <Flex
                  key={r.title}
                  justifyContent="space-between"
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
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                26 March 2026 · 14:00–15:00 GST · Microsoft Teams
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
              <BodyText size="small" fontWeight="bold" marginBottom="s">
                Status: Complete — advance to interview
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                Strong GCC client delivery examples; confirm travel for KSA onsite workshops.
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
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                No offer in progress. Offer tasks appear after interview outcome is recorded.
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
                  placeholder="Prefer afternoon slots"
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
              <BodyText size="small" color={colors.blackPepper600}>
                12 Mar 2026 — Omnichannel messaging enabled for tenant demo.
              </BodyText>
            </Card>
          </Box>
        );
      default:
        return null;
    }
  };

  const dockPanel = (
    <Box
      role={dockExpanded ? 'dialog' : undefined}
      aria-modal={dockExpanded ? true : undefined}
      aria-labelledby={dockExpanded ? 'omni-msg-title' : undefined}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
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
          <Heading size="small" id="omni-msg-title">
            Messages
          </Heading>
          <ToolbarIconButton icon={xSmallIcon} aria-label="Close" onClick={collapseDock} disabled={isSending} />
        </Flex>
        <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
          {candidate.requisitionId} · {candidate.jobTitle}
        </BodyText>
      </Box>

      <Box padding="l" style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: SANA_COMM_PANEL_SURFACE }}>
        {!tenantWhatsappOn && (
          <Banner as="div" marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              WhatsApp is turned off for your organisation. To contact this candidate, send an email.
            </Banner.Label>
          </Banner>
        )}

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
                Message sent
              </BodyText>
            </Flex>
          </Card>
        )}

        {providerError && (
          <Banner as="div" hasError marginBottom="m">
            <Banner.Icon />
            <Banner.Label>{providerError}</Banner.Label>
          </Banner>
        )}

        {optedOut && (
          <Banner as="div" hasError marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              This candidate opted out of messages on this channel. Sending is blocked. [060]
            </Banner.Label>
          </Banner>
        )}

        {!hasConsent && !optedOut && (
          <Banner as="div" hasError marginBottom="m">
            <Banner.Icon />
            <Banner.Label>You can&apos;t send messages on this channel until the candidate opts in to messaging. [060]</Banner.Label>
          </Banner>
        )}

        <FormSelect
          id="timeline-filter"
          label="Show"
          value={timelineFilter}
          onChange={(v) => setTimelineFilter(v as 'all' | ChannelKey)}
          options={[
            { value: 'all', label: 'All channels' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
          ]}
        />
        <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" marginBottom="m">
          Filter messages by channel.
        </BodyText>

        <Box marginBottom="m" minHeight={120}>
          {filteredMessages.length === 0 ? (
            <BodyText size="small" color={colors.blackPepper600}>
              No messages yet. Select a channel to start the conversation.
            </BodyText>
          ) : (
            filteredMessages.map((m) => (
              <Box key={m.id} marginBottom="s">
                <BodyText
                  as="span"
                  size="small"
                  fontWeight="bold"
                  style={{ color: colors.blackPepper500, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11 }}
                >
                  {channelLabel(m.channel)}
                </BodyText>
                <SanaCommMessageBubble
                  align={m.direction === 'outbound' ? 'end' : 'start'}
                  timestamp={m.meta ? `${m.timestamp} · ${m.meta}` : m.timestamp}
                >
                  {m.text}
                </SanaCommMessageBubble>
              </Box>
            ))
          )}
        </Box>

        <FormSelect
          id="composer-channel"
          label="Channel"
          value={composerChannel}
          onChange={(v) => setComposerChannel(v as ChannelKey)}
          options={channelOptions.map((x) => ({ value: x.value, label: x.label }))}
          disabled={!hasConsent || optedOut}
        />
        <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" marginBottom="m">
          Only channels your organisation enabled for this candidate appear here.
        </BodyText>

        {composerChannel === 'whatsapp' && tenantWhatsappOn && (
          <>
            {!sessionWindowOpen && hasConsent && !optedOut && (
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                WhatsApp needs an approved template to start or restart a conversation outside the session window.
              </BodyText>
            )}
            {sessionWindowOpen && (
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Session window: you can send free-form messages until 26 March 2026, 15:12 GST. After that, select a template.
              </BodyText>
            )}
            <FormField id="wa-template">
              <FormField.Label>Template</FormField.Label>
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
            <FormSelect
              id="preview-lang"
              label="Preview language"
              value={previewLang}
              onChange={(v) => setPreviewLang(v as 'en' | 'ar')}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ar', label: 'Arabic' },
              ]}
            />
            <Card padding="m" marginBottom="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
              <BodyText size="small" color={colors.blackPepper600}>
                {previewLang === 'en'
                  ? renderPreview(selectedTemplate, candidate)
                  : renderPreviewAr(selectedTemplate, candidate) ?? renderPreview(selectedTemplate, candidate)}
              </BodyText>
            </Card>
            <Flex gap="s" flexWrap="wrap" marginBottom="m">
              <SecondaryButton onClick={() => setProviderError(null)}>Preview template</SecondaryButton>
              <PrimaryButton onClick={handleApplyTemplate} disabled={!hasConsent || optedOut || isSending}>
                Apply template
              </PrimaryButton>
            </Flex>
            <SanaCommComposer
              value={composerDraft}
              onChange={setComposerDraft}
              placeholder={
                !sessionWindowOpen ? 'Select a template to reopen the session window.' : `Message ${candidate.name.split(' ')[0]}…`
              }
              onSend={handleSend}
              sendDisabled={composerDisabled}
              sendLabel={isSending ? 'Sending message…' : 'Send message'}
            />
          </>
        )}

        {composerChannel === 'email' && (
          <>
            <FormTextInput id="email-subject" label="Subject" value={emailSubject} onChange={setEmailSubject} />
            <FormField id="email-body" marginTop="m">
              <FormField.Label>Message</FormField.Label>
              <FormField.Input
                as="textarea"
                value={emailBody}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailBody(e.target.value)}
                style={{ ...sanaCommFormControlStyle(), minHeight: 100, resize: 'vertical' as const }}
              />
            </FormField>
            <PrimaryButton marginTop="m" onClick={handleSend} disabled={composerDisabled}>
              {isSending ? 'Sending message…' : 'Send message'}
            </PrimaryButton>
          </>
        )}

        {composerChannel === 'sms' && smsEligible && (
          <SanaCommComposer
            value={composerDraft}
            onChange={setComposerDraft}
            placeholder="SMS message…"
            onSend={handleSend}
            sendDisabled={composerDisabled}
            sendLabel={isSending ? 'Sending message…' : 'Send message'}
          />
        )}

        <Flex gap="s" marginTop="m" flexWrap="wrap">
          <TertiaryButton
            size="small"
            onClick={() =>
              setProviderError(
                'This template was rejected by the messaging provider. Review the error code, correct the template or parameters, then try again.'
              )
            }
          >
            Demo: template rejected
          </TertiaryButton>
          <TertiaryButton
            size="small"
            onClick={() => setProviderError("We couldn't send this message. Check your network connection and try again.")}
          >
            Demo: network error
          </TertiaryButton>
          <TertiaryButton size="small" onClick={() => setProviderError(null)}>
            Clear errors
          </TertiaryButton>
        </Flex>
      </Box>
    </Box>
  );

  const dockRail = (
    <>
      <button
        type="button"
        aria-label={dockExpanded ? 'Collapse panel' : 'Expand panel'}
        onClick={() => setDockExpanded((v) => !v)}
        style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
      >
        <Box
          style={{
            display: 'flex',
            transform: dockExpanded ? 'rotate(180deg)' : undefined,
            transition: 'transform 0.2s ease',
          }}
        >
          <SystemIcon icon={arrowLeftSmallIcon} size={20} color={colors.blackPepper600} aria-hidden />
        </Box>
      </button>
      <button
        type="button"
        aria-label="Email messages"
        title="Email"
        onClick={() => openDock('email')}
        style={communicationRailButtonStyle(activeRail === 'email' && dockExpanded, DEFAULT_COMM_RAIL_PX)}
      >
        <SystemIcon icon={mailIcon} size={20} color={activeRail === 'email' && dockExpanded ? SANA_LINK_ACCENT : colors.blackPepper600} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="SMS messages"
        title={SMS_TILE_TOOLTIP}
        disabled={!smsEligible}
        onClick={() => openDock('sms')}
        style={{
          ...communicationRailButtonStyle(activeRail === 'sms' && dockExpanded, DEFAULT_COMM_RAIL_PX),
          opacity: smsEligible ? 1 : 0.45,
          cursor: smsEligible ? 'pointer' : 'not-allowed',
        }}
      >
        <SystemIcon icon={phoneIcon} size={20} color={colors.blackPepper400} aria-hidden />
      </button>
      {tenantWhatsappOn ? (
        <button
          type="button"
          aria-label="WhatsApp messages"
          title="WhatsApp"
          onClick={() => openDock('whatsapp')}
          style={communicationRailButtonStyle(activeRail === 'whatsapp' && dockExpanded, DEFAULT_COMM_RAIL_PX)}
        >
          <Box style={{ color: activeRail === 'whatsapp' && dockExpanded ? SANA_LINK_ACCENT : '#128C7E', display: 'flex' }} aria-hidden>
            <WhatsAppMark size={20} />
          </Box>
        </button>
      ) : null}
    </>
  );

  const renderAdminBody = () => {
    switch (adminTabId) {
      case 'channel_policy':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Channel policy
              </Heading>
              <Flex flexDirection="column" gap="m">
                <Checkbox
                  checked={tenantWhatsappOn}
                  onChange={() => setTenantWhatsappOn((v) => !v)}
                  label="Enable WhatsApp"
                />
                <BodyText size="small" color={colors.blackPepper600}>
                  When this is off, recruiters don&apos;t see WhatsApp on the candidate profile.
                </BodyText>
                <Checkbox checked={tenantSmsOn} onChange={() => setTenantSmsOn((v) => !v)} label="Enable SMS (Workday Messaging)" />
                <BodyText size="small" color={colors.blackPepper600}>
                  SMS only works for supported regions, numbers, and tenant configuration. Recruiters see SMS only when this
                  candidate and number are eligible.
                </BodyText>
                <FormSelect
                  id="scope-apply"
                  label="Apply to"
                  value={scopeApply}
                  onChange={setScopeApply}
                  options={[
                    { value: 'tenant', label: 'Entire tenant' },
                    { value: 'le', label: 'Selected legal entity' },
                  ]}
                />
              </Flex>
            </Card>
            <PrimaryButton onClick={() => undefined}>Save changes</PrimaryButton>
          </Flex>
        );
      case 'credentials_sync':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Credentials & template sync
              </Heading>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                Connection status: Connected (mock). Last successful sync 20 March 2026, 08:02 UTC.
              </BodyText>
              <SecondaryButton onClick={handleSyncTemplates} disabled={syncBusy}>
                {syncBusy ? 'Syncing templates…' : 'Sync templates'}
              </SecondaryButton>
            </Card>
          </Flex>
        );
      case 'retention':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Retention
              </Heading>
              <FormField id="ret-body">
                <FormField.Label>Default retention (message bodies)</FormField.Label>
                <FormField.Input
                  as={TextInput}
                  type="number"
                  value={retentionBody}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRetentionBody(e.target.value)}
                />
              </FormField>
              <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" marginBottom="m">
                Keep retention within product guardrails and your organisation&apos;s legal retention policy. [060]
              </BodyText>
              <FormField id="ret-meta">
                <FormField.Label>Operational metadata (days)</FormField.Label>
                <FormField.Input
                  as={TextInput}
                  type="number"
                  value={retentionMeta}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRetentionMeta(e.target.value)}
                />
              </FormField>
            </Card>
            <PrimaryButton>Save changes</PrimaryButton>
          </Flex>
        );
      case 'audit_export':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Audit & export
              </Heading>
              <Flex gap="s" flexWrap="wrap" marginBottom="m">
                <PrimaryButton onClick={() => setExportModalOpen(true)}>Export audit log</PrimaryButton>
                <SecondaryButton>Download file</SecondaryButton>
              </Flex>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Timestamp</Table.Header>
                    <Table.Header>Actor</Table.Header>
                    <Table.Header>Candidate ID</Table.Header>
                    <Table.Header>Template</Table.Header>
                    <Table.Header>Channel</Table.Header>
                    <Table.Header>Outcome</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small">21 Mar 2026 07:41</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">layla.rahman</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">CND-88912</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Interview coordination (GCC)</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">WhatsApp</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">Delivered</BodyText>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Card>
          </Flex>
        );
      case 'inbound_review':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
              <Heading size="small" marginBottom="m">
                Inbound review
              </Heading>
              {inboundResolved ? (
                <BodyText size="small" color={colors.greenApple600} marginBottom="m">
                  Thread linked to this candidate record.
                </BodyText>
              ) : null}
              {!inboundResolved ? (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Received</Table.Header>
                      <Table.Header>From</Table.Header>
                      <Table.Header>Preview</Table.Header>
                      <Table.Header />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small">21 Mar 2026 06:18</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">+971 50 999 8877</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">I am replying about the consultant role…</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <PrimaryButton size="small" onClick={() => setResolveModalOpen(true)}>
                          Resolve match
                        </PrimaryButton>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              ) : (
                <BodyText size="small" color={colors.blackPepper600}>
                  No inbound messages need review.
                </BodyText>
              )}
            </Card>
          </Flex>
        );
      default:
        return null;
    }
  };

  return (
    <Box style={{ position: 'relative', minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      {prototypeScreen === 'candidate' && (
        <CommunicationDock
          headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
          expanded={dockExpanded}
          railWidthPx={DEFAULT_COMM_RAIL_PX}
          expandedWidthPx={DEFAULT_COMM_EXPANDED_PX}
          panel={dockPanel}
          rail={dockRail}
        />
      )}

      <WorkdayTopNav
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showWMark
        showMenuWordmark={false}
        notificationBadge={3}
        inboxBadge={5}
      />

      <Box paddingX="l" paddingY="s" style={{ backgroundColor: colors.soap200, borderBottom: `1px solid ${colors.soap300}` }}>
        <Flex gap="s" alignItems="center" flexWrap="wrap">
          <BodyText size="small" fontWeight="bold">
            Prototype
          </BodyText>
          <SecondaryButton size="small" onClick={() => setPrototypeScreen('candidate')} aria-pressed={prototypeScreen === 'candidate'}>
            Candidate profile (Pattern B)
          </SecondaryButton>
          <SecondaryButton size="small" onClick={() => setPrototypeScreen('admin')} aria-pressed={prototypeScreen === 'admin'}>
            Recruiting admin (Pattern D)
          </SecondaryButton>
        </Flex>
      </Box>

      {consentModalOpen && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            backgroundColor: 'rgba(15, 46, 102, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.l,
          }}
          onClick={() => setConsentModalOpen(false)}
          role="presentation"
        >
          <Card
            padding="l"
            style={{ maxWidth: 480, width: '100%', borderRadius: SANA_CARD_RADIUS_LG }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
              <Heading size="small">Messaging consent</Heading>
              <ToolbarIconButton icon={xSmallIcon} aria-label="Close" onClick={() => setConsentModalOpen(false)} />
            </Flex>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              [Customer Legal copy — 060 review required]
            </BodyText>
            <TertiaryButton marginBottom="m">Privacy notice</TertiaryButton>
            <Box marginBottom="m">
              <Checkbox
                checked={legalAttest}
                onChange={() => setLegalAttest((v) => !v)}
                label="I confirm that our legal team has reviewed the messaging disclosures. [060]"
              />
            </Box>
            <Flex gap="s" justifyContent="flex-end">
              <SecondaryButton onClick={() => setConsentModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={() => setConsentModalOpen(false)}>Close</PrimaryButton>
            </Flex>
          </Card>
        </Box>
      )}

      {exportModalOpen && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            backgroundColor: 'rgba(15, 46, 102, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.l,
          }}
          onClick={() => setExportModalOpen(false)}
          role="presentation"
        >
          <Card
            padding="l"
            style={{ maxWidth: 440, width: '100%', borderRadius: SANA_CARD_RADIUS_LG }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Heading size="small" marginBottom="m">
              Export audit log
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              Choose format and date range (mock).
            </BodyText>
            <Flex gap="s" justifyContent="flex-end">
              <SecondaryButton onClick={() => setExportModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleExport} disabled={exportBusy}>
                {exportBusy ? 'Export started…' : 'Export audit log'}
              </PrimaryButton>
            </Flex>
          </Card>
        </Box>
      )}

      {resolveModalOpen && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            backgroundColor: 'rgba(15, 46, 102, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.l,
          }}
          onClick={() => setResolveModalOpen(false)}
          role="presentation"
        >
          <Card
            padding="l"
            style={{ maxWidth: 480, width: '100%', borderRadius: SANA_CARD_RADIUS_LG }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Heading size="small" marginBottom="m">
              Resolve match
            </Heading>
            <Banner as="div" hasError marginBottom="m">
              <Banner.Icon />
              <Banner.Label>
                More than one candidate uses this phone number. Select the correct record, then send your message.
              </Banner.Label>
            </Banner>
            <FormSelect
              id="pick-candidate"
              label="Candidate record"
              value="c1"
              onChange={() => undefined}
              options={[
                { value: 'c1', label: 'Sara Al-Mansoori — JR-0142' },
                { value: 'c2', label: 'Sara Al-Mansoori — JR-0199 (duplicate risk)' },
              ]}
            />
            <Flex gap="s" justifyContent="flex-end" marginTop="m">
              <SecondaryButton onClick={() => setResolveModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setResolveModalOpen(false);
                  setInboundResolved(true);
                }}
              >
                Resolve match
              </PrimaryButton>
            </Flex>
          </Card>
        </Box>
      )}

      {prototypeScreen === 'candidate' ? (
        <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px - 48px)` }}>
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
                    onClick: () => openDock(composerChannel === 'email' ? 'email' : 'whatsapp'),
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
            {renderCandidateMain()}
            <Card
              marginTop="xl"
              padding="m"
              style={{
                backgroundColor: colors.soap100,
                border: `1px solid ${colors.soap300}`,
                borderRadius: SANA_CARD_RADIUS_LG,
                boxShadow: 'none',
              }}
            >
              <BodyText size="small" fontWeight="bold" marginBottom="s">
                Demo states
              </BodyText>
              <Flex gap="s" flexWrap="wrap">
                <SecondaryButton size="small" onClick={() => setCandidate((x) => ({ ...x, consent: 'opted_in' }))}>
                  Consent: opted in
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setCandidate((x) => ({ ...x, consent: 'no_consent' }))}>
                  Consent: none
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setCandidate((x) => ({ ...x, consent: 'opted_out' }))}>
                  Consent: opted out
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setSessionWindowOpen(true)}>
                  Session window open
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setSessionWindowOpen(false)}>
                  Session window closed
                </SecondaryButton>
              </Flex>
            </Card>
          </Box>
        </Flex>
      ) : (
        <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px - 48px)` }}>
          <WorkdayLeftTabBar
            secondaryTitle="Recruiting admin"
            secondarySubtitle="Tenant setup — candidate engagement"
            tabs={ADMIN_TABS.map((t) => ({ id: t.id, label: t.label }))}
            activeTabId={adminTabId}
            onTabChange={setAdminTabId}
          />
          <Box flex={1} minWidth={0} padding="l">
            {renderAdminBody()}
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default GccWhatsappOmnichannelEngagementV45;
