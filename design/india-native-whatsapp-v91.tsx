/**
 * Native WhatsApp Messaging in Core Recruiting UI — India (v91)
 *
 * Route: /india-native-whatsapp-v91
 * Mission: INDIA-E2E-005
 * Design Brief: design/india-native-whatsapp-recruiting-design-brief.md
 * PRD: docs/prds/india-native-whatsapp-recruiting-prd.md
 */
import { useState, useCallback, type ReactNode } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { PrimaryButton, SecondaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  speechBubbleIcon,
  xSmallIcon,
  fileIcon,
  dotIcon,
  mailIcon,
  locationIcon,
  inboxIcon,
  exclamationTriangleIcon,
} from '@workday/canvas-system-icons-web';
import { brand } from '@workday/canvas-tokens-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import {
  ProfilePageLayout,
  SanaCommMessageBubble,
  SanaCommComposer,
  FormSelect,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  SANA_CARD_SHADOW,
  SANA_LINK_ACCENT,
  SANA_COMM_META_FG,
  SANA_COMM_PANEL_SURFACE,
  SANA_PAGE_CANVAS,
  type ProfileTab,
} from './components';
import { cardStyle } from './components/profileHelpers';

const WHATSAPP_GREEN = '#25D366';
const DOCK_WIDTH_PX = 450;

type ConsentState = 'active' | 'pending' | 'missing';
type DeliveryLabel = 'sent' | 'delivered' | 'read' | 'failed';

interface ThreadMessage {
  id: string;
  direction: 'outbound' | 'inbound';
  text: string;
  timestamp: string;
  sender: string;
  delivery?: DeliveryLabel;
  templateName?: string;
  metaLine?: string;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  body: string;
}

const CANDIDATE = {
  name: 'Ananya Rao',
  title: 'Product Analyst',
  location: 'Hyderabad, Telangana',
  email: 'ananya.rao@email.com',
  phoneE164: '+919876543210',
  phoneDisplay: '+91 98765 43210',
  appliedJob: 'REQ-2026-IN-8891 · Senior Product Analyst, TA Operations',
  stage: 'Assessment',
  source: 'LinkedIn',
  consentCaptured: '28 March 2026',
};

const TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-status',
    name: 'Application status update',
    body: 'Hi {{firstName}}, your application for {{jobTitle}} has progressed. Our recruiting team will share next steps shortly. Reply if you have questions.',
  },
  {
    id: 'tpl-doc',
    name: 'Document request',
    body: 'Hi {{firstName}}, to move forward on {{jobTitle}}, please upload {{docList}} in the candidate portal when convenient.',
  },
  {
    id: 'tpl-interview',
    name: 'Interview reminder',
    body: 'Hi {{firstName}}, reminder: your interview for {{jobTitle}} is on {{date}}. Join using the link we sent by email.',
  },
];

function mergeTemplate(body: string): string {
  return body
    .replace(/\{\{firstName\}\}/g, CANDIDATE.name.split(' ')[0])
    .replace(/\{\{jobTitle\}\}/g, 'Senior Product Analyst, TA Operations')
    .replace(/\{\{docList\}\}/g, 'PAN, latest payslip')
    .replace(/\{\{date\}\}/g, '10 April 2026');
}

const INITIAL_THREAD: ThreadMessage[] = [
  {
    id: '1',
    direction: 'outbound',
    text: mergeTemplate(TEMPLATES[0].body),
    timestamp: '4 Apr 2026 · 09:12 IST',
    sender: 'Riya Kapoor',
    delivery: 'read',
    templateName: 'Application status update',
    metaLine: 'Sent by · 4 Apr 2026 · 09:12 IST',
  },
  {
    id: '2',
    direction: 'inbound',
    text: 'Thanks — when should I expect the written exercise?',
    timestamp: '4 Apr 2026 · 09:40 IST',
    sender: 'Ananya Rao',
  },
  {
    id: '3',
    direction: 'outbound',
    text: mergeTemplate(TEMPLATES[1].body),
    timestamp: '5 Apr 2026 · 11:05 IST',
    sender: 'Riya Kapoor',
    delivery: 'delivered',
    templateName: 'Document request',
    metaLine: 'Sent by · 5 Apr 2026 · 11:05 IST',
  },
];

function deliveryBadge(d: DeliveryLabel) {
  const map: Record<DeliveryLabel, { type: (typeof StatusIndicator.Type)[keyof typeof StatusIndicator.Type]; emphasis: (typeof StatusIndicator.Emphasis)[keyof typeof StatusIndicator.Emphasis]; label: string }> = {
    sent: { type: StatusIndicator.Type.Gray, emphasis: StatusIndicator.Emphasis.Low, label: 'Sent' },
    delivered: { type: StatusIndicator.Type.Blue, emphasis: StatusIndicator.Emphasis.Low, label: 'Delivered' },
    read: { type: StatusIndicator.Type.Green, emphasis: StatusIndicator.Emphasis.Low, label: 'Read' },
    failed: { type: StatusIndicator.Type.Red, emphasis: StatusIndicator.Emphasis.High, label: 'Failed' },
  };
  const x = map[d];
  return <StatusIndicator type={x.type} emphasis={x.emphasis} label={x.label} />;
}

function consentBadge(state: ConsentState) {
  if (state === 'active') {
    return (
      <StatusIndicator
        type={StatusIndicator.Type.Green}
        emphasis={StatusIndicator.Emphasis.Low}
        label="Consent: WhatsApp"
      />
    );
  }
  if (state === 'pending') {
    return (
      <StatusIndicator
        type={StatusIndicator.Type.Orange}
        emphasis={StatusIndicator.Emphasis.Low}
        label="Consent: pending"
      />
    );
  }
  return (
    <StatusIndicator
      type={StatusIndicator.Type.Red}
      emphasis={StatusIndicator.Emphasis.High}
      label="Consent: missing"
    />
  );
}

interface MessagingBlockProps {
  consent: ConsentState;
  messages: ThreadMessage[];
  composerValue: string;
  onComposerChange: (v: string) => void;
  selectedTemplateId: string;
  onTemplateChange: (id: string) => void;
  showUdmfConflict: boolean;
  onCloseDock?: () => void;
  onSend: () => void;
  sending: boolean;
  onRequestConsent: () => void;
  onViewConsentHistory: () => void;
  templateApproved: boolean;
}

function MessagingBlock({
  consent,
  messages,
  composerValue,
  onComposerChange,
  selectedTemplateId,
  onTemplateChange,
  showUdmfConflict,
  onCloseDock,
  onSend,
  sending,
  onRequestConsent,
  onViewConsentHistory,
  templateApproved,
}: MessagingBlockProps) {
  const canSend =
    consent === 'active' &&
    !showUdmfConflict &&
    composerValue.trim().length > 0 &&
    selectedTemplateId !== '';

  return (
    <Flex
      flexDirection="column"
      style={{
        height: '100%',
        minHeight: 0,
        backgroundColor: SANA_COMM_PANEL_SURFACE,
      }}
    >
      <Flex
          alignItems="center"
          justifyContent="space-between"
          padding="s"
          style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}
        >
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={speechBubbleIcon} size={20} color={SANA_LINK_ACCENT} />
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper600 }}>
              WhatsApp · {CANDIDATE.name}
            </BodyText>
          </Flex>
          {onCloseDock ? <ToolbarIconButton icon={xSmallIcon} aria-label="Close panel" onClick={onCloseDock} /> : null}
        </Flex>

      <Box padding="s" style={{ borderBottom: `1px solid ${colors.soap200}`, flexShrink: 0 }}>
        <Flex alignItems="center" gap="s" flexWrap="wrap">
          {consentBadge(consent)}
          {consent === 'active' ? (
            <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG, fontSize: 11 }}>
              Captured {CANDIDATE.consentCaptured}
            </BodyText>
          ) : null}
        </Flex>
      </Box>

      {showUdmfConflict ? (
        <Box padding="s" style={{ flexShrink: 0 }}>
          <Flex
            role="alert"
            alignItems="flex-start"
            gap="s"
            padding="xs"
            style={{
              borderRadius: 4,
              backgroundColor: `var(${brand.error.base})`,
              color: `var(${brand.error.accent})`,
            }}
          >
            <SystemIcon icon={exclamationTriangleIcon} size={24} color="currentColor" aria-hidden />
            <BodyText size="small" style={{ margin: 0, color: 'inherit', lineHeight: 1.45, flex: 1, minWidth: 0 }}>
              This phone number matches more than one candidate. Open the candidate profile you want to message, then try
              again.
            </BodyText>
          </Flex>
        </Box>
      ) : null}

      {consent === 'missing' ? (
        <Box padding="s" style={{ backgroundColor: SANA_PAGE_CANVAS, borderBottom: `1px solid ${colors.soap200}`, flexShrink: 0 }}>
          <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600 }}>
            You can&apos;t send WhatsApp messages until the candidate consents. Request consent or use another channel.
          </BodyText>
          <Flex gap="s" marginTop="s" flexWrap="wrap">
            <SecondaryButton size="small" onClick={onRequestConsent}>
              Request consent
            </SecondaryButton>
          </Flex>
        </Box>
      ) : null}

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: 'auto',
          padding: space.s,
        }}
      >
        {messages.length === 0 ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ minHeight: 180 }}>
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, marginBottom: 4 }}>
              No WhatsApp messages yet
            </BodyText>
            <BodyText size="small" style={{ color: SANA_COMM_META_FG, margin: 0, textAlign: 'center', marginBottom: 'm' }}>
              When you send a message or the candidate replies, it appears here.
            </BodyText>
            <PrimaryButton
              size="small"
              onClick={() => {
                onTemplateChange(TEMPLATES[0].id);
                onComposerChange(mergeTemplate(TEMPLATES[0].body));
              }}
            >
              Send message
            </PrimaryButton>
          </Flex>
        ) : (
          messages.map((msg) => (
            <Box key={msg.id}>
              <SanaCommMessageBubble align={msg.direction === 'outbound' ? 'end' : 'start'} timestamp={msg.timestamp}>
                {msg.text}
              </SanaCommMessageBubble>
              <Flex
                justifyContent={msg.direction === 'outbound' ? 'flex-end' : 'flex-start'}
                alignItems="center"
                gap="xxs"
                marginBottom="xs"
                flexWrap="wrap"
              >
                <BodyText size="small" style={{ fontSize: 10, color: SANA_COMM_META_FG, margin: 0 }}>
                  {msg.metaLine || `${msg.timestamp} · ${msg.sender}`}
                  {msg.templateName ? ` · ${msg.templateName}` : ''}
                </BodyText>
                {msg.direction === 'outbound' && msg.delivery ? deliveryBadge(msg.delivery) : null}
              </Flex>
            </Box>
          ))
        )}
      </Box>

      {consent === 'active' && !showUdmfConflict ? (
        <Box
          padding="s"
          style={{
            borderTop: `1px solid ${colors.soap300}`,
            backgroundColor: SANA_PAGE_CANVAS,
            flexShrink: 0,
          }}
        >
          <FormSelect
            id="wa-template-dock"
            label="Template"
            value={selectedTemplateId}
            onChange={(id) => {
              onTemplateChange(id);
              const t = TEMPLATES.find((x) => x.id === id);
              if (t) onComposerChange(mergeTemplate(t.body));
            }}
            options={[
              { value: '', label: 'Select a template' },
              ...TEMPLATES.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
          <BodyText size="small" style={{ margin: 0, marginTop: 4, color: SANA_COMM_META_FG, fontSize: 11 }}>
            Only approved templates can be sent on WhatsApp.
          </BodyText>

          <Box marginTop="m">
            <SanaCommComposer
              value={composerValue}
              onChange={onComposerChange}
              placeholder="Type a message or choose a template…"
              onSend={onSend}
              sendDisabled={!canSend || sending}
              sendLabel={sending ? 'Sending…' : 'Send message'}
            />
          </Box>

          <Flex gap="s" marginTop="m" flexWrap="wrap" alignItems="center">
            <SecondaryButton size="small" onClick={onRequestConsent}>
              Request consent
            </SecondaryButton>
            <SecondaryButton size="small" onClick={onViewConsentHistory}>
              View consent history
            </SecondaryButton>
          </Flex>

          {!templateApproved && selectedTemplateId ? (
            <BodyText size="small" style={{ margin: 0, marginTop: 's', color: colors.cinnamon600 }}>
              We couldn&apos;t send this template. Choose another template or try again.
            </BodyText>
          ) : null}
        </Box>
      ) : null}
    </Flex>
  );
}

// --- Tabs (representative richness) ---

function OverviewTab() {
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Overview
      </Heading>
      <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        <Flex gap="l" flexWrap="wrap">
          <Box minWidth={240}>
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper500 }}>
              Applied position
            </BodyText>
            <BodyText size="small" style={{ margin: 0, color: SANA_LINK_ACCENT, cursor: 'pointer' }}>
              {CANDIDATE.appliedJob}
            </BodyText>
          </Box>
          <Box minWidth={160}>
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper500 }}>
              Stage
            </BodyText>
            <StatusIndicator
              type={StatusIndicator.Type.Blue}
              emphasis={StatusIndicator.Emphasis.Low}
              label={CANDIDATE.stage}
              icon={dotIcon}
            />
          </Box>
          <Box minWidth={160}>
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper500 }}>
              Source
            </BodyText>
            <StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label={CANDIDATE.source} />
          </Box>
        </Flex>
      </Card>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        <Heading size="small" marginBottom="s">
          Contact
        </Heading>
        <Flex flexDirection="column" gap="xs">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={mailIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0 }}>{CANDIDATE.email}</BodyText>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={inboxIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0 }}>{CANDIDATE.phoneDisplay}</BodyText>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={locationIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0 }}>{CANDIDATE.location}</BodyText>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}

const ACTIVITY_ROWS = [
  { id: 'a1', date: '5 Apr 2026', actor: 'Riya Kapoor', action: 'Sent WhatsApp', detail: 'Template: Document request' },
  { id: 'a2', date: '4 Apr 2026', actor: 'Ananya Rao', action: 'Replied on WhatsApp', detail: 'Asked about written exercise' },
  { id: 'a3', date: '4 Apr 2026', actor: 'Riya Kapoor', action: 'Sent WhatsApp', detail: 'Template: Application status update' },
  { id: 'a4', date: '28 Mar 2026', actor: 'Ananya Rao', action: 'Consent granted', detail: 'WhatsApp recruiting messages' },
];

function ActivityTab() {
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Activity
      </Heading>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        {ACTIVITY_ROWS.map((a, idx) => (
          <Flex
            key={a.id}
            gap="m"
            alignItems="flex-start"
            paddingBottom="s"
            marginBottom="s"
            style={idx < ACTIVITY_ROWS.length - 1 ? { borderBottom: `1px solid ${colors.soap200}` } : undefined}
          >
            <Box style={{ minWidth: 88 }}>
              <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG, fontSize: 12 }}>
                {a.date}
              </BodyText>
            </Box>
            <Box flex="1">
              <BodyText size="small" style={{ margin: 0, fontWeight: 600, color: colors.blackPepper600 }}>
                {a.action}
              </BodyText>
              {a.detail ? (
                <BodyText size="small" style={{ margin: 0, color: colors.blackPepper500, marginTop: 2 }}>
                  {a.detail}
                </BodyText>
              ) : null}
              <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG, fontSize: 11, marginTop: 2 }}>
                {a.actor}
              </BodyText>
            </Box>
          </Flex>
        ))}
      </Card>
    </Box>
  );
}

const DOCS = [
  { id: 'd1', name: 'Ananya_Rao_CV_2026.pdf', type: 'Resume', by: 'Ananya Rao', date: '12 Mar 2026', size: '298 KB' },
  { id: 'd2', name: 'Writing_Sample_Analytics.pdf', type: 'Writing sample', by: 'Ananya Rao', date: '18 Mar 2026', size: '412 KB' },
];

function DocumentsTab() {
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Documents
      </Heading>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Document</Table.Header>
              <Table.Header>Type</Table.Header>
              <Table.Header>Uploaded by</Table.Header>
              <Table.Header>Date</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {DOCS.map((d) => (
              <Table.Row key={d.id}>
                <Table.Cell>
                  <Flex alignItems="center" gap="xs">
                    <SystemIcon icon={fileIcon} size={16} color={colors.blackPepper400} />
                    <BodyText size="small" style={{ margin: 0, color: SANA_LINK_ACCENT, cursor: 'pointer' }}>
                      {d.name}
                    </BodyText>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label={d.type} />
                </Table.Cell>
                <Table.Cell>
                  <BodyText size="small" style={{ margin: 0 }}>{d.by}</BodyText>
                </Table.Cell>
                <Table.Cell>
                  <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG }}>{d.date}</BodyText>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </Box>
  );
}

function QuestionnaireTab() {
  const rows = [
    { q: 'Notice period (days)?', a: '30' },
    { q: 'Willing to relocate to Bengaluru?', a: 'Yes' },
  ];
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Questionnaire
      </Heading>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        {rows.map((r, i) => (
          <Box
            key={i}
            paddingBottom="s"
            marginBottom="s"
            style={i < rows.length - 1 ? { borderBottom: `1px solid ${colors.soap200}` } : undefined}
          >
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper500 }}>
              {r.q}
            </BodyText>
            <BodyText size="small" style={{ margin: 0, marginTop: 4 }}>
              {r.a}
            </BodyText>
          </Box>
        ))}
      </Card>
    </Box>
  );
}

const TABS: ProfileTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'documents', label: 'Documents' },
  { id: 'questionnaire', label: 'Questionnaire' },
];

const BULK_ROWS = [
  { candidate: 'Ananya Rao', consent: 'Granted', channel: 'WhatsApp', excluded: false, reason: '' },
  { candidate: 'Vikram Mehta', consent: '—', channel: '—', excluded: true, reason: 'No consent' },
  { candidate: 'Neha Iyer', consent: 'Withdrawn', channel: '—', excluded: true, reason: 'Withdrawn' },
];

export function IndiaNativeWhatsappV91() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [dockOpen, setDockOpen] = useState<string | null>('whatsapp');

  const [messages, setMessages] = useState<ThreadMessage[]>(INITIAL_THREAD);
  const [composerValue, setComposerValue] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [consent, setConsent] = useState<ConsentState>('active');
  const [showUdmf, setShowUdmf] = useState(false);
  const [sending, setSending] = useState(false);
  const [templateRejected, setTemplateRejected] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const bulkModal = useModalModel();
  const consentModal = useModalModel();
  const historyModal = useModalModel();

  const handleSend = useCallback(() => {
    const text = composerValue.trim();
    if (!text || consent !== 'active' || showUdmf) return;
    setSending(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          direction: 'outbound',
          text,
          timestamp: `7 Apr 2026 · ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} IST`,
          sender: 'Riya Kapoor',
          delivery: 'sent',
          templateName: templateId ? TEMPLATES.find((t) => t.id === templateId)?.name : undefined,
          metaLine: 'Sent by · 7 Apr 2026 · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        },
      ]);
      setComposerValue('');
      setTemplateId('');
      setSending(false);
      setToast('WhatsApp message sent.');
      setTimeout(() => setToast(null), 4000);
    }, 600);
  }, [composerValue, consent, showUdmf, templateId]);

  const renderRail = useCallback(
    () => (
      <button
        type="button"
        aria-label="WhatsApp messages"
        title="WhatsApp"
        style={communicationRailButtonStyle(dockOpen === 'whatsapp', DEFAULT_COMM_RAIL_PX)}
        onClick={() => setDockOpen((p) => (p === 'whatsapp' ? null : 'whatsapp'))}
      >
        <SystemIcon icon={speechBubbleIcon} size={24} color={dockOpen === 'whatsapp' ? WHATSAPP_GREEN : colors.blackPepper400} />
      </button>
    ),
    [dockOpen],
  );

  const messagingProps: MessagingBlockProps = {
    consent,
    messages,
    composerValue,
    onComposerChange: setComposerValue,
    selectedTemplateId: templateId,
    onTemplateChange: setTemplateId,
    showUdmfConflict: showUdmf,
    onSend: handleSend,
    sending,
    onRequestConsent: () => consentModal.events.show(),
    onViewConsentHistory: () => historyModal.events.show(),
    templateApproved: !templateRejected,
  };

  const renderTab = useCallback(
    (tabId: string): ReactNode => {
      if (tabId === 'overview') return <OverviewTab />;
      if (tabId === 'activity') return <ActivityTab />;
      if (tabId === 'documents') return <DocumentsTab />;
      if (tabId === 'questionnaire') return <QuestionnaireTab />;
      return null;
    },
    [],
  );

  return (
    <>
      <ProfilePageLayout
        searchValue={search}
        onSearchChange={setSearch}
        avatar={<Avatar size={Avatar.Size.xl as never} />}
        name={CANDIDATE.name}
        subtitle={`${CANDIDATE.title} · ${CANDIDATE.location} · ${CANDIDATE.phoneDisplay}`}
        headerActions={[
          <SecondaryButton key="fwd" size="small">
            Move forward
          </SecondaryButton>,
          <SecondaryButton key="rej" size="small">
            Reject
          </SecondaryButton>,
        ]}
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        secondaryTitle="Candidate"
        showSecondaryTitleIcon
        renderTabContent={renderTab}
        footerDisclaimer="Prototype sample data for INDIA-E2E-005. Consent and cross-border copy require Legal sign-off before GA."
        communicationDock={{
          channels: ['whatsapp'],
          activeChannel: dockOpen,
          onChannelChange: setDockOpen,
          getExpandedWidth: () => DOCK_WIDTH_PX,
          renderPanel: () => <MessagingBlock {...messagingProps} onCloseDock={() => setDockOpen(null)} />,
          renderRail: renderRail,
        }}
      />

      <Modal model={bulkModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 720 }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Preview recipients</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" style={{ marginBottom: 'm', color: colors.blackPepper600 }}>
                Some candidates can&apos;t receive this message. Review the list before you confirm.
              </BodyText>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Candidate</Table.Header>
                    <Table.Header>Consent</Table.Header>
                    <Table.Header>Channel</Table.Header>
                    <Table.Header>Reason excluded</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {BULK_ROWS.map((row) => (
                    <Table.Row key={row.candidate}>
                      <Table.Cell>
                        <BodyText size="small" style={{ margin: 0 }}>
                          {row.candidate}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" style={{ margin: 0 }}>
                          {row.consent}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small" style={{ margin: 0 }}>
                          {row.channel}
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        {row.excluded ? (
                          <span title={row.reason}>
                            <StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="Excluded" />
                          </span>
                        ) : (
                          <BodyText size="small" style={{ margin: 0 }}>
                            —
                          </BodyText>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Modal.Body>
            <Flex gap="s" justifyContent="flex-end" padding="m" flexWrap="wrap">
              <SecondaryButton size="small" onClick={() => bulkModal.events.hide()}>
                Cancel
              </SecondaryButton>
              <SecondaryButton size="small" onClick={() => bulkModal.events.hide()}>
                Remove excluded candidates
              </SecondaryButton>
              <PrimaryButton
                size="small"
                onClick={() => {
                  bulkModal.events.hide();
                  setToast(
                    "We're sending your messages. You can leave this page. Progress is saved on each candidate record.",
                  );
                  setTimeout(() => setToast(null), 5000);
                }}
              >
                Confirm send
              </PrimaryButton>
            </Flex>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={consentModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 480 }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Request consent</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" color="blackPepper600">
                Send a consent request for WhatsApp recruiting messages.
              </BodyText>
            </Modal.Body>
            <Flex gap="s" justifyContent="flex-end" padding="m">
              <SecondaryButton size="small" onClick={() => consentModal.events.hide()}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                size="small"
                onClick={() => {
                  consentModal.events.hide();
                  setConsent('pending');
                }}
              >
                Request consent
              </PrimaryButton>
            </Flex>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={historyModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 520 }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Consent history</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" style={{ marginBottom: 's' }}>
                28 Mar 2026 · WhatsApp recruiting · Granted · en-IN · Artefact ID WD-CONS-99281
              </BodyText>
              <BodyText size="small" color="blackPepper500">
                Withdrawal and version history would list here per tenant configuration.
              </BodyText>
            </Modal.Body>
            <Flex gap="s" justifyContent="flex-end" padding="m">
              <SecondaryButton size="small" onClick={() => historyModal.events.hide()}>
                Close
              </SecondaryButton>
            </Flex>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </>
  );
}

export default IndiaNativeWhatsappV91;
