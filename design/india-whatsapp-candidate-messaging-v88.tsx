/**
 * India WhatsApp & +91 SMS Candidate Messaging v88
 *
 * Route: /india-whatsapp-candidate-messaging-v88
 *
 * Layout: ProfilePageLayout (Pattern B hub) with CommunicationDock sliding right panel
 * Features: WhatsApp/SMS as expandable side panel, consent gating, template selection,
 *           threaded conversations, delivery status indicators, DPDP-compliant audit trail
 *
 * Design Brief: design/india-whatsapp-candidate-messaging-design-brief.md
 * PRD: docs/prds/india-whatsapp-sms-candidate-messaging-prd.md
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
  xIcon,
  xSmallIcon,
  fileIcon,
  dotIcon,
  mailIcon,
  notificationsIcon,
  locationIcon,
  inboxIcon,
} from '@workday/canvas-system-icons-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import {
  ProfilePageLayout,
  SanaCommMessageBubble,
  SanaCommComposer,
  FormSelect,
  communicationRailButtonStyle,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_LINK_ACCENT,
  SANA_COMM_META_FG,
  SANA_COMM_PANEL_SURFACE,
  type ProfileTab,
} from './components';
import { cardStyle } from './components/profileHelpers';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Channel = 'whatsapp' | 'sms';
type ConsentStatus = 'granted' | 'pending' | 'opted-out';
type DeliveryStatus = 'sent' | 'delivered' | 'read' | 'replied' | 'failed';

interface Message {
  id: string;
  channel: Channel;
  direction: 'outbound' | 'inbound';
  text: string;
  timestamp: string;
  sender: string;
  deliveryStatus: DeliveryStatus;
  templateName?: string;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  body: string;
  mergeFields: string[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const CANDIDATE = {
  name: 'Priya Sharma',
  title: 'Senior Software Engineer',
  location: 'Bengaluru, Karnataka',
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',
  appliedJob: 'REQ-2026-IN-4421 · Staff Engineer, Platform',
  stage: 'Interview',
  source: 'Naukri',
  consentWhatsApp: 'granted' as ConsentStatus,
  consentSms: 'granted' as ConsentStatus,
  consentDate: '18 March 2026',
};

const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-interview-schedule',
    name: 'Interview scheduling',
    body: 'Hi {{candidateFirstName}}, we would like to invite you for an interview for {{jobTitle}} at Workday. Please confirm your availability for {{interviewDate}}. Reply YES to confirm or NO to reschedule.',
    mergeFields: ['candidateFirstName', 'jobTitle', 'interviewDate'],
  },
  {
    id: 'tpl-application-update',
    name: 'Application status update',
    body: 'Hi {{candidateFirstName}}, thank you for your interest in {{jobTitle}}. Your application has moved to the next stage. Our team will be in touch shortly with next steps.',
    mergeFields: ['candidateFirstName', 'jobTitle'],
  },
  {
    id: 'tpl-document-request',
    name: 'Document request',
    body: 'Hi {{candidateFirstName}}, to proceed with your application for {{jobTitle}}, we need the following documents: {{documentList}}. Please upload them through the candidate portal.',
    mergeFields: ['candidateFirstName', 'jobTitle', 'documentList'],
  },
  {
    id: 'tpl-offer-follow-up',
    name: 'Offer follow-up',
    body: 'Hi {{candidateFirstName}}, we hope you had a chance to review your offer for {{jobTitle}}. Please let us know if you have any questions. We look forward to welcoming you to Workday.',
    mergeFields: ['candidateFirstName', 'jobTitle'],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    channel: 'whatsapp',
    direction: 'outbound',
    text: 'Hi Priya, we would like to invite you for an interview for Staff Engineer, Platform at Workday. Please confirm your availability for 25 March 2026. Reply YES to confirm or NO to reschedule.',
    timestamp: '20 Mar 2026 · 10:15',
    sender: 'Sophie Laurent',
    deliveryStatus: 'read',
    templateName: 'Interview scheduling',
  },
  {
    id: 'm2',
    channel: 'whatsapp',
    direction: 'inbound',
    text: 'YES - 25 March works for me. Looking forward to it!',
    timestamp: '20 Mar 2026 · 11:42',
    sender: 'Priya Sharma',
    deliveryStatus: 'replied',
  },
  {
    id: 'm3',
    channel: 'whatsapp',
    direction: 'outbound',
    text: 'Hi Priya, thank you for your interest in Staff Engineer, Platform. Your application has moved to the next stage. Our team will be in touch shortly with next steps.',
    timestamp: '26 Mar 2026 · 14:30',
    sender: 'Sophie Laurent',
    deliveryStatus: 'delivered',
    templateName: 'Application status update',
  },
  {
    id: 'm4',
    channel: 'sms',
    direction: 'outbound',
    text: 'Hi Priya, your interview for Staff Engineer, Platform at Workday is confirmed for 25 March 2026 at 14:00 IST. Location: Workday Bengaluru, RMZ Ecoworld. Reply STOP to opt out.',
    timestamp: '21 Mar 2026 · 09:00',
    sender: 'Sophie Laurent',
    deliveryStatus: 'delivered',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deliveryIndicator(status: DeliveryStatus) {
  const map: Record<DeliveryStatus, { type: any; emphasis: any; label: string }> = {
    sent: { type: StatusIndicator.Type.Gray, emphasis: StatusIndicator.Emphasis.Low, label: 'Sent' },
    delivered: { type: StatusIndicator.Type.Blue, emphasis: StatusIndicator.Emphasis.Low, label: 'Delivered' },
    read: { type: StatusIndicator.Type.Blue, emphasis: StatusIndicator.Emphasis.High, label: 'Read' },
    replied: { type: StatusIndicator.Type.Green, emphasis: StatusIndicator.Emphasis.Low, label: 'Replied' },
    failed: { type: StatusIndicator.Type.Red, emphasis: StatusIndicator.Emphasis.High, label: 'Failed' },
  };
  const cfg = map[status];
  return <StatusIndicator type={cfg.type} emphasis={cfg.emphasis} label={cfg.label} />;
}

function consentIndicator(status: ConsentStatus) {
  const map: Record<ConsentStatus, { type: any; emphasis: any; label: string }> = {
    granted: { type: StatusIndicator.Type.Green, emphasis: StatusIndicator.Emphasis.Low, label: 'Consent granted' },
    pending: { type: StatusIndicator.Type.Orange, emphasis: StatusIndicator.Emphasis.Low, label: 'Consent pending' },
    'opted-out': { type: StatusIndicator.Type.Red, emphasis: StatusIndicator.Emphasis.Low, label: 'Opted out' },
  };
  const cfg = map[status];
  return <StatusIndicator type={cfg.type} emphasis={cfg.emphasis} label={cfg.label} />;
}

function mergeTemplate(body: string, candidate: typeof CANDIDATE): string {
  return body
    .replace(/\{\{candidateFirstName\}\}/g, candidate.name.split(' ')[0])
    .replace(/\{\{jobTitle\}\}/g, 'Staff Engineer, Platform')
    .replace(/\{\{interviewDate\}\}/g, '2 April 2026')
    .replace(/\{\{documentList\}\}/g, 'PAN card, Aadhaar (masked), latest payslip')
    .replace(/\{\{companyName\}\}/g, 'Workday');
}

// ---------------------------------------------------------------------------
// Sliding Panel: WhatsApp / SMS messaging (CommunicationDock)
// ---------------------------------------------------------------------------

function MessagingPanel({
  channel,
  onClose,
}: {
  channel: Channel;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [whatsappBody, setWhatsappBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [sending, setSending] = useState(false);

  const consentModal = useModalModel();

  const channelMessages = messages.filter((m) => m.channel === channel);
  const consentStatus = channel === 'whatsapp' ? CANDIDATE.consentWhatsApp : CANDIDATE.consentSms;
  const canSend = consentStatus === 'granted';
  const channelLabel = channel === 'whatsapp' ? 'WhatsApp' : 'SMS';

  const template = WHATSAPP_TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleSend = useCallback(() => {
    const text = channel === 'whatsapp' ? whatsappBody : smsBody;
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => {
      const newMsg: Message = {
        id: `m${Date.now()}`,
        channel,
        direction: 'outbound',
        text,
        timestamp: '01 Apr 2026 · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        sender: 'Sophie Laurent',
        deliveryStatus: 'sent',
        templateName: template?.name,
      };
      setMessages((prev) => [...prev, newMsg]);
      setSending(false);
      setWhatsappBody('');
      setSmsBody('');
      setSelectedTemplate('');
    }, 800);
  }, [channel, whatsappBody, smsBody, template]);

  return (
    <Flex flexDirection="column" style={{ height: '100%', backgroundColor: SANA_COMM_PANEL_SURFACE }}>
      {/* Panel header */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="s"
        style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}
      >
        <Flex alignItems="center" gap="xs">
          <SystemIcon icon={speechBubbleIcon} size={20} color={SANA_LINK_ACCENT} />
          <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper600 }}>
            {channelLabel} · {CANDIDATE.name}
          </BodyText>
        </Flex>
        <ToolbarIconButton icon={xSmallIcon} aria-label="Close panel" onClick={onClose} />
      </Flex>

      {/* Consent strip */}
      <Box padding="s" style={{ borderBottom: `1px solid ${colors.soap200}`, flexShrink: 0 }}>
        <Flex alignItems="center" gap="xs" flexWrap="wrap">
          {consentIndicator(consentStatus)}
          <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG, fontSize: 11 }}>
            {consentStatus === 'granted' ? `Granted ${CANDIDATE.consentDate}` : ''}
          </BodyText>
        </Flex>
      </Box>

      {/* Blocked / pending states */}
      {consentStatus === 'opted-out' && (
        <Box padding="s" style={{ borderBottom: `1px solid ${colors.soap200}`, flexShrink: 0 }}>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={xIcon} size={16} color={colors.cinnamon500} />
            <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600, fontSize: 12 }}>
              Opted out on {CANDIDATE.consentDate}.
            </BodyText>
          </Flex>
          <SecondaryButton size="extraSmall" onClick={() => consentModal.events.show()} style={{ marginTop: 6 }}>
            Send consent request
          </SecondaryButton>
        </Box>
      )}
      {consentStatus === 'pending' && (
        <Box padding="s" style={{ borderBottom: `1px solid ${colors.soap200}`, flexShrink: 0 }}>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={notificationsIcon} size={16} color={colors.cantaloupe500} />
            <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600, fontSize: 12 }}>
              Consent request sent. Awaiting response.
            </BodyText>
          </Flex>
        </Box>
      )}

      {/* Thread area (scrollable) */}
      <Box style={{ flex: 1, overflowY: 'auto', padding: space.s }}>
        {channelMessages.length === 0 ? (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{ height: '100%', minHeight: 200 }}
          >
            <SystemIcon icon={speechBubbleIcon} size={32} color={colors.soap400} style={{ marginBottom: 8 }} />
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, marginBottom: 4 }}>
              No messages yet
            </BodyText>
            <BodyText size="small" style={{ color: SANA_COMM_META_FG, margin: 0, textAlign: 'center', fontSize: 12 }}>
              When you send a message, the conversation appears here.
            </BodyText>
          </Flex>
        ) : (
          channelMessages.map((msg) => (
            <Box key={msg.id}>
              <SanaCommMessageBubble align={msg.direction === 'outbound' ? 'end' : 'start'}>
                {msg.text}
              </SanaCommMessageBubble>
              <Flex
                justifyContent={msg.direction === 'outbound' ? 'flex-end' : 'flex-start'}
                alignItems="center"
                gap="xxs"
                marginBottom="xs"
                style={{ paddingLeft: 2, paddingRight: 2 }}
              >
                <BodyText size="small" style={{ fontSize: 10, color: SANA_COMM_META_FG, margin: 0 }}>
                  {msg.timestamp} · {msg.sender}
                  {msg.templateName ? ` · ${msg.templateName}` : ''}
                </BodyText>
                {msg.direction === 'outbound' && deliveryIndicator(msg.deliveryStatus)}
              </Flex>
            </Box>
          ))
        )}
      </Box>

      {/* Composer area (pinned to bottom) */}
      {canSend && (
        <Box
          padding="s"
          style={{
            borderTop: `1px solid ${colors.soap300}`,
            backgroundColor: SANA_PAGE_CANVAS,
            flexShrink: 0,
          }}
        >
          {channel === 'whatsapp' ? (
            <Box>
              <FormSelect
                id="whatsapp-template-select"
                label="Template"
                value={selectedTemplate}
                onChange={(val) => {
                  setSelectedTemplate(val);
                  const tpl = WHATSAPP_TEMPLATES.find((t) => t.id === val);
                  if (tpl) setWhatsappBody(mergeTemplate(tpl.body, CANDIDATE));
                }}
                options={[
                  { value: '', label: 'Select a template' },
                  ...WHATSAPP_TEMPLATES.map((t) => ({ value: t.id, label: t.name })),
                ]}
              />
              <Box marginTop="xs">
                <SanaCommComposer
                  value={whatsappBody}
                  onChange={(v) => { setWhatsappBody(v); if (selectedTemplate) setSelectedTemplate(''); }}
                  placeholder="Type a message..."
                  onSend={handleSend}
                  sendDisabled={!whatsappBody.trim() || sending}
                  sendLabel={sending ? 'Sending\u2026' : 'Send'}
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <BodyText size="small" style={{ margin: 0, marginBottom: 4, color: SANA_COMM_META_FG, fontSize: 11 }}>
                Standard SMS charges may apply. Opt-out footer added automatically.
              </BodyText>
              <SanaCommComposer
                value={smsBody}
                onChange={setSmsBody}
                placeholder="Type your SMS message..."
                onSend={handleSend}
                sendDisabled={!smsBody.trim() || sending}
                sendLabel="Send message"
                footer={
                  smsBody.trim() ? (
                    <BodyText size="small" style={{ fontSize: 10, color: SANA_COMM_META_FG, margin: 0 }}>
                      Reply STOP to opt out · {smsBody.length}/160
                      {smsBody.length > 160 ? ` (${Math.ceil(smsBody.length / 153)} segments)` : ''}
                    </BodyText>
                  ) : null
                }
              />
            </Box>
          )}
        </Box>
      )}

      {/* Consent Request Modal */}
      <Modal model={consentModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 480 }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Send consent request</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" style={{ color: colors.blackPepper600 }}>
                Send a consent request to this candidate? They must opt in before you can message them on this channel.
              </BodyText>
            </Modal.Body>
            <Flex gap="s" justifyContent="flex-end" padding="m">
              <SecondaryButton size="small" onClick={() => consentModal.events.hide()}>
                Cancel
              </SecondaryButton>
              <PrimaryButton size="small" onClick={() => consentModal.events.hide()}>
                Send consent request
              </PrimaryButton>
            </Flex>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Tab Content: Overview (representative)
// ---------------------------------------------------------------------------

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
            <StatusIndicator
              type={StatusIndicator.Type.Gray}
              emphasis={StatusIndicator.Emphasis.Low}
              label={CANDIDATE.source}
            />
          </Box>
        </Flex>
      </Card>

      <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        <Heading size="small" marginBottom="s">
          Contact information
        </Heading>
        <Flex flexDirection="column" gap="xs">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={mailIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600 }}>{CANDIDATE.email}</BodyText>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={inboxIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600 }}>{CANDIDATE.phone}</BodyText>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={locationIcon} size={16} color={colors.blackPepper400} />
            <BodyText size="small" style={{ margin: 0, color: colors.blackPepper600 }}>{CANDIDATE.location}</BodyText>
          </Flex>
        </Flex>
      </Card>

      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        <Heading size="small" marginBottom="s">
          Key skills
        </Heading>
        <Flex gap="xs" flexWrap="wrap">
          {['TypeScript', 'React', 'Node.js', 'AWS', 'Kubernetes', 'System Design', 'GraphQL', 'PostgreSQL'].map(
            (skill) => (
              <StatusIndicator
                key={skill}
                type={StatusIndicator.Type.Gray}
                emphasis={StatusIndicator.Emphasis.Low}
                label={skill}
              />
            ),
          )}
        </Flex>
      </Card>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Tab Content: Activity (representative)
// ---------------------------------------------------------------------------

interface ActivityEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  detail?: string;
}

const ACTIVITIES: ActivityEntry[] = [
  { id: 'a1', date: '26 Mar 2026', actor: 'Sophie Laurent', action: 'Sent WhatsApp message', detail: 'Template: Application status update' },
  { id: 'a2', date: '25 Mar 2026', actor: 'System', action: 'Interview completed', detail: 'Technical panel · Score: 4.2/5' },
  { id: 'a3', date: '21 Mar 2026', actor: 'Sophie Laurent', action: 'Sent SMS', detail: 'Interview confirmation with venue details' },
  { id: 'a4', date: '20 Mar 2026', actor: 'Sophie Laurent', action: 'Sent WhatsApp message', detail: 'Template: Interview scheduling' },
  { id: 'a5', date: '20 Mar 2026', actor: 'Priya Sharma', action: 'Replied on WhatsApp', detail: 'Confirmed interview availability' },
  { id: 'a6', date: '18 Mar 2026', actor: 'Priya Sharma', action: 'Consent granted', detail: 'WhatsApp and SMS for recruiting communications' },
  { id: 'a7', date: '15 Mar 2026', actor: 'Sophie Laurent', action: 'Sent consent request', detail: 'WhatsApp and SMS channels' },
  { id: 'a8', date: '12 Mar 2026', actor: 'System', action: 'Moved to Interview stage' },
  { id: 'a9', date: '10 Mar 2026', actor: 'Sophie Laurent', action: 'Screened application', detail: 'Shortlisted for technical interview' },
  { id: 'a10', date: '8 Mar 2026', actor: 'Priya Sharma', action: 'Applied via Naukri' },
];

function ActivityTab() {
  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Activity
      </Heading>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        {ACTIVITIES.map((a, idx) => (
          <Flex
            key={a.id}
            gap="m"
            alignItems="flex-start"
            paddingBottom="s"
            marginBottom="s"
            style={idx < ACTIVITIES.length - 1 ? { borderBottom: `1px solid ${colors.soap200}` } : undefined}
          >
            <Box style={{ minWidth: 100 }}>
              <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG, fontSize: 12 }}>
                {a.date}
              </BodyText>
            </Box>
            <Box flex="1">
              <BodyText size="small" style={{ margin: 0, fontWeight: 600, color: colors.blackPepper600 }}>
                {a.action}
              </BodyText>
              {a.detail && (
                <BodyText size="small" style={{ margin: 0, color: colors.blackPepper500, marginTop: 2 }}>
                  {a.detail}
                </BodyText>
              )}
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

// ---------------------------------------------------------------------------
// Tab Content: Documents (representative)
// ---------------------------------------------------------------------------

interface DocEntry {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  size: string;
}

const DOCUMENTS: DocEntry[] = [
  { id: 'd1', name: 'Priya_Sharma_Resume_2026.pdf', type: 'Resume', uploadedBy: 'Priya Sharma', date: '8 Mar 2026', size: '342 KB' },
  { id: 'd2', name: 'Cover_Letter_Staff_Engineer.pdf', type: 'Cover letter', uploadedBy: 'Priya Sharma', date: '8 Mar 2026', size: '128 KB' },
  { id: 'd3', name: 'Technical_Assessment_Results.pdf', type: 'Assessment', uploadedBy: 'System', date: '25 Mar 2026', size: '89 KB' },
  { id: 'd4', name: 'Interview_Scorecard_Panel.pdf', type: 'Scorecard', uploadedBy: 'Raj Patel', date: '25 Mar 2026', size: '45 KB' },
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
              <Table.Header>Size</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {DOCUMENTS.map((d) => (
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
                  <StatusIndicator
                    type={StatusIndicator.Type.Gray}
                    emphasis={StatusIndicator.Emphasis.Low}
                    label={d.type}
                  />
                </Table.Cell>
                <Table.Cell>
                  <BodyText size="small" style={{ margin: 0 }}>{d.uploadedBy}</BodyText>
                </Table.Cell>
                <Table.Cell>
                  <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG }}>{d.date}</BodyText>
                </Table.Cell>
                <Table.Cell>
                  <BodyText size="small" style={{ margin: 0, color: SANA_COMM_META_FG }}>{d.size}</BodyText>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Tab Content: Questionnaire (representative)
// ---------------------------------------------------------------------------

function QuestionnaireTab() {
  const questions = [
    { q: 'Are you authorised to work in India without sponsorship?', a: 'Yes' },
    { q: 'What is your expected annual compensation (INR)?', a: '45,00,000 - 55,00,000' },
    { q: 'Are you willing to work from the Bengaluru office 3 days per week?', a: 'Yes' },
    { q: 'Do you have experience leading teams of 5 or more engineers?', a: 'Yes, currently leading a team of 8' },
    { q: 'What is your earliest possible start date?', a: '1 May 2026' },
  ];

  return (
    <Box>
      <Heading size="medium" marginBottom="m">
        Questionnaire
      </Heading>
      <Card padding="l" style={{ ...cardStyle(), boxShadow: SANA_CARD_SHADOW }}>
        {questions.map((item, idx) => (
          <Box
            key={idx}
            paddingBottom="s"
            marginBottom="s"
            style={idx < questions.length - 1 ? { borderBottom: `1px solid ${colors.soap200}` } : undefined}
          >
            <BodyText size="small" style={{ fontWeight: 600, margin: 0, color: colors.blackPepper500 }}>
              {item.q}
            </BodyText>
            <BodyText size="small" style={{ margin: 0, marginTop: 4, color: colors.blackPepper600 }}>
              {item.a}
            </BodyText>
          </Box>
        ))}
      </Card>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Communication Rail (right-side icon stack)
// ---------------------------------------------------------------------------

const WHATSAPP_GREEN = '#25D366';
const SMS_ICON_COLOR = colors.blueberry400;

function CommRail({
  activeChannel,
  onToggle,
}: {
  activeChannel: Channel | null;
  onToggle: (ch: Channel) => void;
}) {
  return (
    <>
      <button
        aria-label="WhatsApp"
        title="WhatsApp"
        style={communicationRailButtonStyle(activeChannel === 'whatsapp')}
        onClick={() => onToggle('whatsapp')}
      >
        <SystemIcon icon={speechBubbleIcon} size={22} color={activeChannel === 'whatsapp' ? WHATSAPP_GREEN : colors.blackPepper400} />
      </button>
      <button
        aria-label="SMS"
        title="SMS"
        style={communicationRailButtonStyle(activeChannel === 'sms')}
        onClick={() => onToggle('sms')}
      >
        <SystemIcon icon={inboxIcon} size={22} color={activeChannel === 'sms' ? SMS_ICON_COLOR : colors.blackPepper400} />
      </button>
      <button
        aria-label="Email"
        title="Email"
        style={communicationRailButtonStyle(false)}
        onClick={() => {}}
      >
        <SystemIcon icon={mailIcon} size={22} color={colors.blackPepper400} />
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const TABS: ProfileTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'documents', label: 'Documents' },
  { id: 'questionnaire', label: 'Questionnaire' },
];

export function IndiaWhatsappCandidateMessagingV88() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [dockChannel, setDockChannel] = useState<Channel | null>('whatsapp');

  const handleChannelChange = useCallback((ch: string | null) => {
    setDockChannel(ch as Channel | null);
  }, []);

  const handleToggleDock = useCallback((ch: Channel) => {
    setDockChannel((prev) => (prev === ch ? null : ch));
  }, []);

  const renderTab = useCallback(
    (tabId: string): ReactNode => {
      switch (tabId) {
        case 'overview':
          return <OverviewTab />;
        case 'activity':
          return <ActivityTab />;
        case 'documents':
          return <DocumentsTab />;
        case 'questionnaire':
          return <QuestionnaireTab />;
        default:
          return null;
      }
    },
    [],
  );

  const renderDockPanel = useCallback(
    (activeChannel: string): ReactNode => (
      <MessagingPanel
        channel={activeChannel as Channel}
        onClose={() => setDockChannel(null)}
      />
    ),
    [],
  );

  const renderDockRail = useCallback(
    () => <CommRail activeChannel={dockChannel} onToggle={handleToggleDock} />,
    [dockChannel, handleToggleDock],
  );

  return (
    <ProfilePageLayout
      searchValue={search}
      onSearchChange={setSearch}
      avatar={<Avatar size={Avatar.Size.xl as any} />}
      name={CANDIDATE.name}
      subtitle={`${CANDIDATE.title} · ${CANDIDATE.location} · ${CANDIDATE.phone}`}
      headerActions={[
        <SecondaryButton key="forward" size="small">
          Move forward
        </SecondaryButton>,
        <SecondaryButton key="reject" size="small">
          Reject
        </SecondaryButton>,
      ]}
      tabs={TABS}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      secondaryTitle="Candidate"
      showSecondaryTitleIcon
      renderTabContent={renderTab}
      footerDisclaimer="This prototype uses sample data for demonstration purposes. Messaging features require WhatsApp Business API integration and DPDP-compliant consent collection before production use."
      communicationDock={{
        channels: ['whatsapp', 'sms'],
        activeChannel: dockChannel,
        onChannelChange: handleChannelChange,
        renderPanel: renderDockPanel,
        renderRail: renderDockRail,
      }}
    />
  );
}

export default IndiaWhatsappCandidateMessagingV88;
