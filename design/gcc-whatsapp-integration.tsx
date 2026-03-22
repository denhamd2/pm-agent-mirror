import React, { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
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
  SanaCommComposer,
  SanaCommMessageBubble,
  sanaCommFormControlStyle,
} from './components';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { RadioGroup, Radio } from '@workday/canvas-kit-react/radio';
import { Table } from '@workday/canvas-kit-react/table';
import {
  checkIcon,
  exclamationTriangleIcon,
  xSmallIcon,
  phoneIcon,
  mailIcon,
  arrowLeftSmallIcon,
  documentIcon,
  speechBubbleIcon,
  copyIcon,
  sendIcon,
  caretDownSmallIcon,
  plusIcon,
} from '@workday/canvas-system-icons-web';

/** WhatsApp brand mark for the communication rail (system icons do not ship it). */
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

/**
 * GCC WhatsApp Candidate Communication Prototype
 *
 * MISSION-015 - GCC E2E Pipeline (HITL #5, PMF v38)
 * PRD: docs/prds/gcc-whatsapp-integration-prd.md
 * Discovery: design/gcc-whatsapp-integration-discovery-brief.md
 *
 * Scope:
 * 1. Candidate Profile with collaboration panel (Send WhatsApp action)
 * 2. Consent status on Personal Information card
 * 3. Right communication dock: email, SMS, WhatsApp rail; WhatsApp expands for templates and send
 * 4. Consent warning (when candidate hasn't opted in)
 * 5. Campaign channel selector (Email, WhatsApp, Email and WhatsApp)
 */

type ConsentStatus = 'opted_in' | 'no_consent' | 'opted_out';
type CampaignChannel = 'email' | 'whatsapp' | 'email_and_whatsapp';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  country: string;
  consent: ConsentStatus;
  appliedDate: string;
  requisitionId?: string;
  jobTitle?: string;
  address?: string;
  jobsInReview?: number;
  applicationLocation?: string;
  dateAppliedDisplay?: string;
  applicationSource?: string;
  evergreenRequisition?: string;
  hiringManager?: string;
  recruiter?: string;
  workCurrentRoleYears?: number;
  workTotalJobs?: number;
  workTotalYears?: number;
  educationSchool?: string;
  educationDetail?: string;
  languagesDisplay?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  body: string;
  variables: string[];
  bodyAr?: string;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'interview_reminder',
    name: 'Interview reminder',
    body: 'Hi {{name}}! Your interview with {{company}} is scheduled for {{date}} at {{time}}. Reply YES to confirm.',
    variables: ['{{name}}', '{{company}}', '{{date}}', '{{time}}'],
    bodyAr: 'مرحبا {{name}}. موعد مقابلك مع {{company}} في {{date}} الساعة {{time}}. رد بنعم للتأكيد.',
  },
  {
    id: 'job_alert',
    name: 'Job alert',
    body: 'New role at {{company}}: {{job_title}}. Apply now: {{link}}',
    variables: ['{{company}}', '{{job_title}}', '{{link}}'],
    bodyAr: 'وظيفة جديدة في {{company}}: {{job_title}}. قدم الآن: {{link}}',
  },
  {
    id: 'offer_notification',
    name: 'Offer notification',
    body: 'Congratulations {{name}}! We would like to extend an offer for {{role}} at {{company}}. Please review and respond by {{date}}.',
    variables: ['{{name}}', '{{role}}', '{{company}}', '{{date}}'],
  },
  {
    id: 'quick_followup',
    name: 'Quick follow-up',
    body: 'Hi {{name}}, just checking in on your application for {{role}} at {{company}}. Let me know if you have any questions.',
    variables: ['{{name}}', '{{role}}', '{{company}}'],
  },
];

const MOCK_CANDIDATE_OPTED_IN: Candidate = {
  id: '1',
  name: 'Chloe Clarkson',
  email: 'Chloe.Clarkson@gmail.com',
  phone: '+1 408-977-3477 (Mobile)',
  company: 'Global Modern Services',
  country: 'United States of America',
  consent: 'opted_in',
  appliedDate: '11 January 2025',
  requisitionId: 'JR-0073',
  jobTitle: 'Marketing Coordinator',
  address: '111 Jackson Blvd, Chicago, IL, 60604, United States of America',
  jobsInReview: 1,
  applicationLocation: 'Chicago',
  dateAppliedDisplay: '25 August 2024',
  applicationSource: 'Landing Page',
  evergreenRequisition:
    'E-00001 Multiple Customer Service Career Opportunities! (Evergreen) (Open)',
  hiringManager: 'Tomas Callahan',
  recruiter: 'Rachel Vaccaro',
  workCurrentRoleYears: 2,
  workTotalJobs: 2,
  workTotalYears: 2,
  educationSchool: 'Tuskegee University',
  educationDetail: 'B.A. | Marketing',
  languagesDisplay: 'English, Spanish',
};

const MOCK_CANDIDATE_NO_CONSENT: Candidate = {
  ...MOCK_CANDIDATE_OPTED_IN,
  consent: 'no_consent',
};

function getConsentLabel(status: ConsentStatus): string {
  switch (status) {
    case 'opted_in':
      return 'Opted in';
    case 'opted_out':
      return 'Opted out';
    default:
      return 'No consent';
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

function renderPreview(template: MessageTemplate, candidate: Candidate): string {
  const role = candidate.jobTitle ?? 'Marketing Coordinator';
  return template.body
    .replace('{{name}}', candidate.name.split(' ')[0])
    .replace('{{company}}', candidate.company)
    .replace('{{role}}', role)
    .replace('{{date}}', '25 March 2026')
    .replace('{{time}}', '10:00 AM')
    .replace('{{job_title}}', role)
    .replace('{{link}}', 'workday.com/apply/12345');
}

function isSaudiArabiaCandidate(c: Candidate): boolean {
  return c.country.toLowerCase().includes('saudi');
}

const SIDEBAR_NAV = [
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

function candidateTabId(label: string): string {
  return label.replace(/\s+/g, '_').toLowerCase();
}

const CANDIDATE_TABS = SIDEBAR_NAV.map((label) => ({ id: candidateTabId(label), label }));

export const GCCWhatsAppIntegration: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [candidate, setCandidate] = useState<Candidate>(MOCK_CANDIDATE_OPTED_IN);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [campaignChannel, setCampaignChannel] = useState<CampaignChannel>('email');
  const [whatsappExpanded, setWhatsappExpanded] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>(candidateTabId('Summary'));
  const [showEmailTeaser, setShowEmailTeaser] = useState(true);
  const [composerDraft, setComposerDraft] = useState('');

  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0];
  const hasConsent = candidate.consent === 'opted_in';
  /** Only the narrow rail is reserved; the expanded sheet overlays page content. */
  const railReservePx = DEFAULT_COMM_RAIL_PX;

  const handleSendMessage = async () => {
    if (!hasConsent) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSending(false);
    setSendSuccess(true);
    setComposerDraft('');
    setTimeout(() => {
      setSendSuccess(false);
      setWhatsappExpanded(false);
    }, 2000);
  };

  const collapseWhatsapp = () => {
    if (!isSending) {
      setWhatsappExpanded(false);
      setSendSuccess(false);
    }
  };

  return (
    <Box style={{ position: 'relative' }}>
      <CommunicationDock
        headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
        expanded={whatsappExpanded}
        railWidthPx={DEFAULT_COMM_RAIL_PX}
        expandedWidthPx={DEFAULT_COMM_EXPANDED_PX}
        panel={
          <>
        <Box
          role={whatsappExpanded ? 'dialog' : undefined}
          aria-modal={whatsappExpanded ? true : undefined}
          aria-labelledby={whatsappExpanded ? 'whatsapp-panel-title' : undefined}
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
              <Heading size="small" id="whatsapp-panel-title">
                Candidate WhatsApp
              </Heading>
            </Flex>
            <ToolbarIconButton
              icon={xSmallIcon}
              aria-label="Collapse WhatsApp panel"
              onClick={collapseWhatsapp}
              disabled={isSending}
            />
          </Flex>
          <BodyText size="small" color={colors.blackPepper600} marginTop="xxs">
            {candidate.requisitionId} · {candidate.jobTitle}
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

          {!hasConsent && (
            <Banner hasError={true} marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>
                Candidate has not opted in to WhatsApp. Consent required before sending.
              </Banner.Label>
            </Banner>
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
              Recipient
            </BodyText>
            <BodyText size="medium">{candidate.name}</BodyText>
            <BodyText size="small" color={colors.blackPepper600}>
              {candidate.phone}
            </BodyText>
          </Card>

          <Box marginBottom="m">
            <FormField id="gcc-wa-template">
              <FormField.Label>Message template</FormField.Label>
              <FormField.Input
                as="select"
                value={selectedTemplateId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedTemplateId(e.target.value)
                }
                style={sanaCommFormControlStyle()}
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
              backgroundColor: colors.soap100,
              boxShadow: 'none',
              border: `1px solid ${colors.soap300}`,
            }}
          >
            <BodyText size="small" fontWeight="bold" marginBottom="xs">
              Preview (variables: {selectedTemplate.variables.join(', ')})
            </BodyText>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
              {renderPreview(selectedTemplate, candidate)}
            </BodyText>
            {selectedTemplate.bodyAr && (
              <BodyText size="small" color={colors.blackPepper500} style={{ direction: 'rtl' }}>
                {selectedTemplate.bodyAr
                  .replace('{{name}}', candidate.name.split(' ')[0])
                  .replace('{{company}}', candidate.company)
                  .replace('{{date}}', '25 March 2026')
                  .replace('{{time}}', '10:00 AM')
                  .replace('{{job_title}}', candidate.jobTitle ?? 'Marketing Coordinator')
                  .replace('{{link}}', 'workday.com/apply/12345')}
              </BodyText>
            )}
          </Card>

          <Box marginBottom="m">
            <BodyText size="small" fontWeight="bold" marginBottom="s">
              Recent messages
            </BodyText>
            <SanaCommMessageBubble align="start" timestamp="Yesterday · 16:42">
              Hi, this is {candidate.recruiter?.split(' ')[0] ?? 'Rachel'} from recruiting. Can you confirm you can
              attend Thursday at 10:00?
            </SanaCommMessageBubble>
            <SanaCommMessageBubble align="end" timestamp="Yesterday · 17:05">
              Yes, Thursday works. Thank you.
            </SanaCommMessageBubble>
          </Box>

          <SanaCommComposer
            value={composerDraft}
            onChange={setComposerDraft}
            placeholder={`Type a message to ${candidate.name.split(' ')[0]}.`}
            onSend={handleSendMessage}
            sendDisabled={!hasConsent || isSending}
            sendLabel={isSending ? 'Sending' : 'Send message'}
            footer={
              <TertiaryButton
                size="small"
                icon={plusIcon}
                onClick={() => document.getElementById('gcc-wa-template')?.focus()}
              >
                Add template
              </TertiaryButton>
            }
          />

          <Flex gap="s" marginTop="m" flexDirection="column">
            <SecondaryButton onClick={collapseWhatsapp} disabled={isSending}>
              Close panel
            </SecondaryButton>
            {isSaudiArabiaCandidate(candidate) && (
              <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.4 }}>
                Saudi Arabia: send during local business hours and avoid prayer times and the weekend (Friday–Saturday)
                unless the candidate agreed otherwise; aligns with PDPL fairness, confirm wording with Legal.
              </BodyText>
            )}
          </Flex>
        </Box>
        </Box>
          </>
        }
        rail={
          <>
            <Box
              as="button"
              type="button"
              aria-label={whatsappExpanded ? 'Collapse panel' : 'Expand communication panel'}
              title="Expand or collapse"
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
              aria-label="Documents"
              title="Documents"
              onClick={() => setWhatsappExpanded(false)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={documentIcon} size={20} color={colors.blackPepper600} aria-hidden />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label="Chat"
              title="Chat"
              onClick={() => setWhatsappExpanded(false)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={speechBubbleIcon} size={20} color={colors.blackPepper600} aria-hidden />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label="Email"
              title="Email"
              onClick={() => {
                setWhatsappExpanded(false);
                setShowEmailTeaser(true);
              }}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={mailIcon} size={20} color={colors.blackPepper600} aria-hidden />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label="Copy link"
              title="Copy"
              onClick={() => setWhatsappExpanded(false)}
              style={communicationRailButtonStyle(false, DEFAULT_COMM_RAIL_PX)}
            >
              <SystemIcon icon={copyIcon} size={20} color={colors.blackPepper600} aria-hidden />
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
              <Box
                style={{
                  color: whatsappExpanded ? SANA_LINK_ACCENT : '#128C7E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden
              >
                <WhatsAppMark size={20} />
              </Box>
            </Box>
          </>
        }
      />

      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
        <WorkdayTopNav
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          notificationBadge={20}
          inboxBadge={101}
        />

        <Flex
          alignItems="stretch"
          style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}
        >
          <WorkdayLeftTabBar
            secondaryTitle={candidate.name}
            secondarySubtitle={[candidate.requisitionId, candidate.jobTitle].filter(Boolean).join(' · ')}
            headerActions={
              <SecondaryButton size="small" style={{ borderRadius: 999, minHeight: 28, fontSize: 11 }}>
                Actions
              </SecondaryButton>
            }
            belowHeader={
              <Flex justifyContent="space-between" gap="xxs">
                {[
                  { label: 'Phone', icon: phoneIcon, onClick: () => undefined },
                  { label: 'Message', icon: sendIcon, onClick: () => setWhatsappExpanded(false) },
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

          {/* Centre column — cards on light grey; reserve right dock */}
          <Box
            flex={1}
            minWidth={0}
            padding="l"
            style={{
              paddingRight: `calc(${railReservePx}px + 1.5rem)`,
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {showEmailTeaser && (
              <Card
                style={{
                  position: 'absolute',
                  top: 16,
                  right: `calc(${railReservePx}px + 8px)`,
                  zIndex: 5,
                  maxWidth: 260,
                  padding: 16,
                  boxShadow: '0 4px 16px rgba(15, 46, 102, 0.12)',
                }}
              >
                <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
                  <BodyText size="small" fontWeight="bold">
                    Introducing conversational email
                  </BodyText>
                  <Box
                    as="button"
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setShowEmailTeaser(false)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <SystemIcon icon={xSmallIcon} size={16} color={colors.blackPepper500} />
                  </Box>
                </Flex>
                <PrimaryButton
                  size="small"
                  onClick={() => {
                    setShowEmailTeaser(false);
                    setWhatsappExpanded(false);
                  }}
                >
                  Try conversational email
                </PrimaryButton>
              </Card>
            )}

            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 20,
                alignItems: 'start',
              }}
            >
              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Contact Information
                </Heading>
                <Box marginBottom="s">
                  <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                    Phone Number
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.phone}
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
                <Box marginBottom="s">
                  <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                    Location
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.address}
                  </BodyText>
                </Box>
                <Flex justifyContent="space-between" alignItems="center">
                  <BodyText size="small" fontWeight="bold">
                    Jobs In Review
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.jobsInReview ?? 0}
                  </BodyText>
                </Flex>
              </Card>

              <Card padding="l" style={{ position: 'relative' }}>
                <Heading size="small" marginBottom="m">
                  Job Application Details
                </Heading>
                <Box marginBottom="s">
                  <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                    Job Requisition
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.evergreenRequisition}
                  </BodyText>
                </Box>
                <Flex marginBottom="s" gap="xl" flexWrap="wrap">
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Location
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.applicationLocation}
                    </BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Date Applied
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.dateAppliedDisplay}
                    </BodyText>
                  </Box>
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      Source
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper600}>
                      {candidate.applicationSource}
                    </BodyText>
                  </Box>
                </Flex>
                <BodyText size="small" fontWeight="bold" marginBottom="s">
                  Stakeholders
                </BodyText>
                <Flex gap="l" marginBottom="m" flexWrap="wrap">
                  <Flex alignItems="center" gap="s">
                    <Avatar size={40} altText={candidate.hiringManager ?? 'Hiring manager'} as="div" />
                    <Box>
                      <BodyText size="small" fontWeight="bold">
                        {candidate.hiringManager}
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500}>
                        Hiring Manager
                      </BodyText>
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap="s">
                    <Avatar size={40} altText={candidate.recruiter ?? 'Recruiter'} as="div" />
                    <Box>
                      <BodyText size="small" fontWeight="bold">
                        {candidate.recruiter}
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500}>
                        Recruiter
                      </BodyText>
                    </Box>
                  </Flex>
                </Flex>
                <BodyText size="small" fontWeight="bold" marginBottom="xs">
                  In Progress
                </BodyText>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Plan</Table.Header>
                      <Table.Header>Step</Table.Header>
                      <Table.Header>Awaiting</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small">Review</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">Review</BodyText>
                      </Table.Cell>
                      <Table.Cell>
                        <BodyText size="small">1</BodyText>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Card>

              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Active Job Applications ({candidate.jobsInReview ?? 1})
                </Heading>
                <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                  {candidate.name} - {candidate.requisitionId} {candidate.jobTitle}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="xxs">
                  Location: {candidate.applicationLocation} | Date Applied: {candidate.appliedDate}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  Status: Review
                </BodyText>
                <Flex gap="s" flexWrap="wrap" alignItems="center">
                  <SecondaryButton
                    size="small"
                    icon={caretDownSmallIcon}
                    iconPosition="end"
                    style={{ borderRadius: 999 }}
                  >
                    Actions
                  </SecondaryButton>
                  <PrimaryButton style={{ borderRadius: 999 }}>Decline These Applications</PrimaryButton>
                </Flex>
              </Card>

              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Education
                </Heading>
                <BodyText size="small" fontWeight="bold">
                  {candidate.educationSchool}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600}>
                  {candidate.educationDetail}
                </BodyText>
              </Card>

              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Work History
                </Heading>
                <Flex justifyContent="space-between" marginBottom="xs">
                  <BodyText size="small" color={colors.blackPepper600}>
                    Current Job
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.workCurrentRoleYears} years
                  </BodyText>
                </Flex>
                <Flex justifyContent="space-between" marginBottom="xs">
                  <BodyText size="small" color={colors.blackPepper600}>
                    Total Jobs
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.workTotalJobs}
                  </BodyText>
                </Flex>
                <Flex justifyContent="space-between">
                  <BodyText size="small" color={colors.blackPepper600}>
                    Total Experience
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.workTotalYears} years
                  </BodyText>
                </Flex>
              </Card>

              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Languages
                </Heading>
                <BodyText size="small" color={colors.blackPepper600}>
                  {candidate.languagesDisplay}
                </BodyText>
              </Card>

              <Card padding="l" style={{ gridColumn: '1 / -1' }}>
                <Heading size="small" marginBottom="m">
                  Communications & collaboration
                </Heading>
                <Flex justifyContent="space-between" marginBottom="m" flexWrap="wrap" gap="m">
                  <Box>
                    <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                      WhatsApp consent
                    </BodyText>
                    <Flex alignItems="center" gap="xs">
                      {candidate.consent === 'opted_in' ? (
                        <SystemIcon icon={checkIcon} size={16} color={colors.greenApple600} aria-hidden />
                      ) : candidate.consent === 'opted_out' ? (
                        <SystemIcon icon={xSmallIcon} size={16} color={colors.cinnamon600} aria-hidden />
                      ) : (
                        <SystemIcon
                          icon={exclamationTriangleIcon}
                          size={16}
                          color={colors.cantaloupe600}
                          aria-hidden
                        />
                      )}
                      <BodyText size="small" style={{ color: getConsentColor(candidate.consent) }}>
                        {getConsentLabel(candidate.consent)}
                      </BodyText>
                    </Flex>
                  </Box>
                  <BodyText size="small" color={colors.blackPepper600} style={{ maxWidth: 420 }}>
                    Use the right-hand panel for documents, chat, email, copy, and WhatsApp. Open WhatsApp to send a
                    templated message.
                  </BodyText>
                </Flex>
                <BodyText size="small" fontWeight="bold" marginBottom="s">
                  Campaign channel
                </BodyText>
                <RadioGroup
                  name="channel"
                  value={campaignChannel}
                  onChange={(val) => setCampaignChannel(val as CampaignChannel)}
                >
                  <Radio value="email" label="Email" />
                  <Radio value="whatsapp" label="WhatsApp" />
                  <Radio value="email_and_whatsapp" label="Email and WhatsApp" />
                </RadioGroup>
              </Card>
            </Box>

            <Card
              marginTop="l"
              padding="m"
              style={{
                backgroundColor: colors.soap100,
                boxShadow: 'none',
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <BodyText size="small" fontWeight="bold" marginBottom="xs">
                Demo: Toggle consent status
              </BodyText>
              <Flex gap="s">
                <SecondaryButton size="small" onClick={() => setCandidate(MOCK_CANDIDATE_OPTED_IN)}>
                  Opted in
                </SecondaryButton>
                <SecondaryButton size="small" onClick={() => setCandidate(MOCK_CANDIDATE_NO_CONSENT)}>
                  No consent
                </SecondaryButton>
              </Flex>
            </Card>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default GCCWhatsAppIntegration;
