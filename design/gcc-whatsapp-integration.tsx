import React, { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { RadioGroup, Radio } from '@workday/canvas-kit-react/radio';
import {
  searchIcon,
  justifyIcon,
  checkIcon,
  exclamationTriangleIcon,
  xSmallIcon,
  phoneIcon,
  mailIcon,
  activityStreamIcon,
} from '@workday/canvas-system-icons-web';

/**
 * GCC WhatsApp Candidate Communication Prototype
 *
 * MISSION-013 - GCC E2E Pipeline
 * PRD: docs/prds/gcc-whatsapp-integration-prd.md
 * Discovery: design/gcc-whatsapp-integration-discovery-brief.md
 *
 * Scope:
 * 1. Candidate Profile with collaboration panel (Send WhatsApp action)
 * 2. Consent status on Personal Information card
 * 3. Template selector modal (pre-approved templates with variable preview)
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
  name: 'Ahmed Al-Sayed',
  email: 'ahmed.alsayed@example.com',
  phone: '+966 50 123 4567',
  company: 'Accenture',
  country: 'Saudi Arabia',
  consent: 'opted_in',
  appliedDate: '15 March 2026',
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
  return template.body
    .replace('{{name}}', candidate.name.split(' ')[0])
    .replace('{{company}}', candidate.company)
    .replace('{{role}}', 'Senior Software Engineer')
    .replace('{{date}}', '25 March 2026')
    .replace('{{time}}', '10:00 AM')
    .replace('{{job_title}}', 'Senior Software Engineer')
    .replace('{{link}}', 'workday.com/apply/12345');
}

export const GCCWhatsAppIntegration: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [candidate, setCandidate] = useState<Candidate>(MOCK_CANDIDATE_OPTED_IN);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [campaignChannel, setCampaignChannel] = useState<CampaignChannel>('email');

  const modalModel = useModalModel();
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0];
  const hasConsent = candidate.consent === 'opted_in';

  const handleSendMessage = async () => {
    if (!hasConsent) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      modalModel.events.hide();
    }, 2000);
  };

  const handleCloseModal = () => {
    modalModel.events.hide();
  };

  return (
    <Box>
      {/* Top Navigation */}
      <Box
        paddingX="l"
        paddingY="s"
        style={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${colors.soap300}`,
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap="l">
          <Flex alignItems="center" gap="m" flex="0 0 auto">
            <ToolbarIconButton icon={justifyIcon} aria-label="Menu" />
            <Box
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.blueberry500,
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              Workday
            </Box>
          </Flex>

          <Box flex="1 1 auto" maxWidth="600px" style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <SystemIcon icon={searchIcon} size={16} color={colors.blackPepper400} />
            </Box>
            <TextInput
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
              style={{
                width: '100%',
                backgroundColor: colors.soap100,
                border: `1px solid ${colors.soap300}`,
                borderRadius: 4,
                padding: '8px 12px 8px 36px',
              }}
            />
          </Box>

          <Flex alignItems="center" flex="0 0 auto">
            <Avatar size={32} altText="User" as="div" />
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box padding="xl" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Heading size="large" marginBottom="xs">
          Candidate profile
        </Heading>
        <BodyText size="medium" color={colors.blackPepper600} marginBottom="l">
          {candidate.name} - Applied {candidate.appliedDate}
        </BodyText>

        <Flex gap="l" flexDirection="row" flexWrap="wrap">
          {/* Left: Profile + Personal Information */}
          <Box flex="1 1 400px" minWidth={0}>
            <Card padding="l" marginBottom="l">
              <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
                <Box>
                  <Heading size="medium" marginBottom="xs">
                    {candidate.name}
                  </Heading>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.email}
                  </BodyText>
                </Box>
                <Avatar size={64} altText={candidate.name} as="div" />
              </Flex>

              {/* Personal Information card with consent status */}
              <Box
                marginBottom="m"
                padding="m"
                style={{
                  backgroundColor: colors.soap100,
                  borderRadius: 4,
                }}
              >
                <Heading size="small" marginBottom="m">
                  Personal information
                </Heading>
                <Flex justifyContent="space-between" marginBottom="xs">
                  <BodyText size="small" fontWeight="bold">
                    Phone
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.phone}
                  </BodyText>
                </Flex>
                <Flex justifyContent="space-between" marginBottom="xs">
                  <BodyText size="small" fontWeight="bold">
                    Country
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.country}
                  </BodyText>
                </Flex>
                <Flex justifyContent="space-between" marginBottom="xs">
                  <BodyText size="small" fontWeight="bold">
                    Company
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600}>
                    {candidate.company}
                  </BodyText>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <BodyText size="small" fontWeight="bold">
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
                </Flex>
              </Box>

              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Position: Senior Software Engineer | Status: Under review
              </BodyText>
            </Card>
          </Box>

          {/* Right: Collaboration panel */}
          <Box flex="0 0 auto">
            <Card
              padding="m"
              style={{
                minWidth: 180,
                borderLeft: `4px solid ${colors.blueberry400}`,
              }}
            >
              <BodyText
                size="small"
                fontWeight="bold"
                marginBottom="m"
                style={{ display: 'block', color: colors.blackPepper600 }}
              >
                Collaboration
              </BodyText>
              <Flex flexDirection="column" gap="s">
                <ToolbarIconButton
                  icon={phoneIcon}
                  aria-label="Send SMS"
                  title="Send SMS"
                />
                <Modal model={modalModel}>
                  <Modal.Target
                    as={ToolbarIconButton}
                    icon={activityStreamIcon}
                    aria-label="Send WhatsApp"
                    title="Send WhatsApp"
                  />
                  <Modal.Overlay>
                    <Modal.Card
                      style={{ maxWidth: 520, width: '100%' }}
                      aria-label="Select WhatsApp template"
                    >
                      <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
                        <Modal.Heading>Send WhatsApp message</Modal.Heading>
                        <Modal.CloseIcon aria-label="Close" onClick={handleCloseModal} />
                      </Flex>
                      <Modal.Body>
                        {sendSuccess && (
                          <Box
                            marginBottom="m"
                            padding="m"
                            style={{
                              backgroundColor: colors.greenApple100,
                              borderRadius: 4,
                              border: `1px solid ${colors.greenApple600}`,
                            }}
                          >
                            <Flex alignItems="center" gap="xs">
                              <SystemIcon icon={checkIcon} size={16} color={colors.greenApple600} />
                              <BodyText size="medium" color={colors.greenApple600}>
                                Message sent successfully.
                              </BodyText>
                            </Flex>
                          </Box>
                        )}

                        {/* Consent warning */}
                        {!hasConsent && (
                          <Banner
                            hasError={true}
                            marginBottom="m"
                            style={{ width: '100%' }}
                          >
                            <Banner.Icon />
                            <Banner.Label>
                              Candidate has not opted in to WhatsApp. Consent required before sending.
                            </Banner.Label>
                          </Banner>
                        )}

                        {/* Recipient */}
                        <Box
                          marginBottom="m"
                          padding="m"
                          style={{
                            backgroundColor: colors.soap100,
                            borderRadius: 4,
                          }}
                        >
                          <BodyText size="small" fontWeight="bold" marginBottom="xs">
                            Recipient
                          </BodyText>
                          <BodyText size="medium">{candidate.name}</BodyText>
                          <BodyText size="small" color={colors.blackPepper600}>
                            {candidate.phone}
                          </BodyText>
                        </Box>

                        {/* Template selector */}
                        <Box marginBottom="m">
                          <BodyText
                            size="medium"
                            fontWeight="bold"
                            marginBottom="xs"
                            style={{ display: 'block' }}
                          >
                            Message template
                          </BodyText>
                          <Box
                            as="select"
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            aria-label="Message template"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: 14,
                              fontFamily: '"Roboto", sans-serif',
                              backgroundColor: colors.soap100,
                              border: `1px solid ${colors.soap300}`,
                              borderRadius: 4,
                              color: colors.blackPepper600,
                            }}
                          >
                            {TEMPLATES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </Box>
                        </Box>

                        {/* Variable preview */}
                        <Box
                          padding="m"
                          marginBottom="m"
                          style={{
                            backgroundColor: colors.soap100,
                            borderRadius: 4,
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
                            <BodyText
                              size="small"
                              color={colors.blackPepper500}
                              style={{ direction: 'rtl' }}
                            >
                              {selectedTemplate.bodyAr
                                .replace('{{name}}', candidate.name.split(' ')[0])
                                .replace('{{company}}', candidate.company)
                                .replace('{{date}}', '25 March 2026')
                                .replace('{{time}}', '10:00 AM')
                                .replace('{{job_title}}', 'Senior Software Engineer')
                                .replace('{{link}}', 'workday.com/apply/12345')}
                            </BodyText>
                          )}
                        </Box>

                        <Flex gap="s" marginTop="l">
                          <PrimaryButton
                            onClick={handleSendMessage}
                            disabled={!hasConsent || isSending}
                            aria-busy={isSending}
                            style={{ flex: 1 }}
                          >
                            {isSending ? 'Sending...' : 'Send'}
                          </PrimaryButton>
                          <SecondaryButton onClick={handleCloseModal} disabled={isSending}>
                            Cancel
                          </SecondaryButton>
                        </Flex>
                      </Modal.Body>
                    </Modal.Card>
                  </Modal.Overlay>
                </Modal>
                <ToolbarIconButton
                  icon={mailIcon}
                  aria-label="Send email"
                  title="Send email"
                />
              </Flex>
            </Card>

            {/* Campaign channel selector (optional) */}
            <Card padding="m" marginTop="l">
              <BodyText
                size="small"
                fontWeight="bold"
                marginBottom="m"
                style={{ display: 'block', color: colors.blackPepper600 }}
              >
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
        </Flex>

        {/* Toggle for demo: switch candidate consent */}
        <Box marginTop="l" padding="m" style={{ backgroundColor: colors.soap100, borderRadius: 4 }}>
          <BodyText size="small" fontWeight="bold" marginBottom="xs">
            Demo: Toggle consent status
          </BodyText>
          <Flex gap="s">
            <SecondaryButton
              size="small"
              onClick={() => setCandidate(MOCK_CANDIDATE_OPTED_IN)}
            >
              Opted in
            </SecondaryButton>
            <SecondaryButton
              size="small"
              onClick={() => setCandidate(MOCK_CANDIDATE_NO_CONSENT)}
            >
              No consent
            </SecondaryButton>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default GCCWhatsAppIntegration;
