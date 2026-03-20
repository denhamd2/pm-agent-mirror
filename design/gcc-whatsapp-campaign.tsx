import React, { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
} from './components';
import {
  checkIcon,
  exclamationTriangleIcon,
  xIcon,
  xSmallIcon,
  activityStreamIcon,
} from '@workday/canvas-system-icons-web';

const CAMPAIGN_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'activity', label: 'Activity' },
] as const;

/**
 * GCC WhatsApp Candidate Communication Prototype
 *
 * Demonstrates WhatsApp message sending from candidate profile via sliding side panel:
 * - Candidate profile view with action to open WhatsApp
 * - Right-hand sliding panel for message composition
 * - Message template selection
 * - Real-time message preview
 * - Send confirmation
 *
 * PRD: docs/prds/gcc-whatsapp-integration-prd.md
 * Discovery: design/gcc-whatsapp-integration-discovery-brief.md
 * MISSION-011 - GCC E2E Pipeline | Primary placement: Candidate Profile page
 */

type ConsentStatus = 'opted_in' | 'no_consent' | 'opted_out';

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
  bodyAr?: string;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'interview_reminder',
    name: 'Interview reminder',
    body: 'Hi {{name}}! Your interview with {{company}} is scheduled for {{date}} at {{time}}. Reply YES to confirm.',
    bodyAr: 'مرحبا {{name}}. موعد مقابلك مع {{company}} في {{date}} الساعة {{time}}. رد بنعم للتأكيد.',
  },
  {
    id: 'job_alert',
    name: 'Job alert',
    body: 'New role at {{company}}: {{job_title}}. Apply now: {{link}}',
    bodyAr: 'وظيفة جديدة في {{company}}: {{job_title}}. قدم الآن: {{link}}',
  },
  {
    id: 'offer_notification',
    name: 'Offer notification',
    body: 'Congratulations {{name}}! We would like to extend an offer for {{role}} at {{company}}. Please review and respond by {{date}}.',
  },
  {
    id: 'application_received',
    name: 'Application received',
    body: 'Thank you {{name}}! We have received your application for {{role}}. We will review it and get back to you within 3-5 business days.',
  },
];

const MOCK_CANDIDATE: Candidate = {
  id: '1',
  name: 'Ahmed Al-Sayed',
  email: 'ahmed.alsayed@example.com',
  phone: '+966 50 123 4567',
  company: 'Accenture',
  country: 'Saudi Arabia',
  consent: 'opted_in',
  appliedDate: '15 March 2026',
};

function getConsentLabel(status: ConsentStatus): string {
  switch (status) {
    case 'opted_in': return 'Opted in';
    case 'opted_out': return 'Opted out';
    default: return 'No consent';
  }
}

export const GCCWhatsAppCampaign: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [leftTab, setLeftTab] = useState<string>('profile');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0];
  
  const previewMessage = selectedTemplate.body
    .replace('{{name}}', MOCK_CANDIDATE.name.split(' ')[0])
    .replace('{{company}}', MOCK_CANDIDATE.company)
    .replace('{{role}}', 'Senior Software Engineer')
    .replace('{{date}}', '25 March 2026')
    .replace('{{time}}', '10:00 AM')
    .replace('{{job_title}}', 'Senior Software Engineer')
    .replace('{{link}}', 'workday.com/apply/12345');

  const handleSendMessage = async () => {
    setIsSending(true);
    setSendError(null);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setIsPanelOpen(false);
    }, 3000);
  };

  const handleOpenPanel = () => {
    if (MOCK_CANDIDATE.consent !== 'opted_in') {
      setSendError('This candidate has not opted in to WhatsApp communication. Please obtain consent first.');
      return;
    }
    setIsPanelOpen(true);
    setSendError(null);
    setSendSuccess(false);
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        notificationBadge={20}
        inboxBadge={101}
        searchMaxWidthPx={600}
      />
      <Flex
        alignItems="stretch"
        style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}
      >
        <WorkdayLeftTabBar
          secondaryTitle={MOCK_CANDIDATE.name}
          secondarySubtitle={`Applied ${MOCK_CANDIDATE.appliedDate}`}
          tabs={[...CAMPAIGN_TABS]}
          activeTabId={leftTab}
          onTabChange={setLeftTab}
        />
        <Box
          flex={1}
          minWidth={0}
          padding="xl"
          style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', overflow: 'auto' }}
        >
      {leftTab === 'profile' ? (
      <>
        <Heading size="large" marginBottom="xs">
          Candidate profile
        </Heading>
        <BodyText size="medium" color={colors.blackPepper600} marginBottom="l">
          {MOCK_CANDIDATE.name} - Applied {MOCK_CANDIDATE.appliedDate}
        </BodyText>

        {sendError && !isPanelOpen && (
          <Box
            marginBottom="m"
            padding="m"
            style={{
              backgroundColor: colors.cinnamon100,
              borderRadius: 4,
              border: `1px solid ${colors.cinnamon600}`,
            }}
          >
            <BodyText size="medium" color={colors.cinnamon600}>
              {sendError}
            </BodyText>
          </Box>
        )}

        <Card padding="l" marginBottom="l">
          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="m">
            <Box>
              <Heading size="medium" marginBottom="xs">
                {MOCK_CANDIDATE.name}
              </Heading>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK_CANDIDATE.email}
              </BodyText>
            </Box>
            <Avatar size={64} altText={MOCK_CANDIDATE.name} as="div" />
          </Flex>

          <Box
            marginBottom="m"
            padding="m"
            style={{
              backgroundColor: colors.soap100,
              borderRadius: 4,
            }}
          >
            <Flex justifyContent="space-between" marginBottom="xs">
              <BodyText size="small" fontWeight="bold">
                Phone
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK_CANDIDATE.phone}
              </BodyText>
            </Flex>
            <Flex justifyContent="space-between" marginBottom="xs">
              <BodyText size="small" fontWeight="bold">
                Country
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK_CANDIDATE.country}
              </BodyText>
            </Flex>
            <Flex justifyContent="space-between" marginBottom="xs">
              <BodyText size="small" fontWeight="bold">
                Company
              </BodyText>
              <BodyText size="small" color={colors.blackPepper600}>
                {MOCK_CANDIDATE.company}
              </BodyText>
            </Flex>
            <Flex justifyContent="space-between">
              <BodyText size="small" fontWeight="bold">
                WhatsApp consent
              </BodyText>
              <Flex alignItems="center" gap="xs">
                {MOCK_CANDIDATE.consent === 'opted_in' ? (
                  <>
                    <SystemIcon icon={checkIcon} size={16} color={colors.greenApple600} aria-hidden />
                    <BodyText size="small" color={colors.greenApple600}>
                      {getConsentLabel(MOCK_CANDIDATE.consent)}
                    </BodyText>
                  </>
                ) : MOCK_CANDIDATE.consent === 'opted_out' ? (
                  <>
                    <SystemIcon icon={xIcon} size={16} color={colors.cinnamon600} aria-hidden />
                    <BodyText size="small" color={colors.cinnamon600}>
                      {getConsentLabel(MOCK_CANDIDATE.consent)}
                    </BodyText>
                  </>
                ) : (
                  <>
                    <SystemIcon icon={exclamationTriangleIcon} size={16} color={colors.cantaloupe600} aria-hidden />
                    <BodyText size="small" color={colors.cantaloupe600}>
                      {getConsentLabel(MOCK_CANDIDATE.consent)}
                    </BodyText>
                  </>
                )}
              </Flex>
            </Flex>
          </Box>

          <Flex gap="s">
            <PrimaryButton onClick={handleOpenPanel}>
              <Flex alignItems="center" gap="xs">
                <SystemIcon icon={activityStreamIcon} size={16} color="currentColor" aria-hidden />
                <span>Send WhatsApp message</span>
              </Flex>
            </PrimaryButton>
            <SecondaryButton>Email candidate</SecondaryButton>
            <SecondaryButton>View application</SecondaryButton>
          </Flex>
        </Card>

        <Card padding="l">
          <Heading size="small" marginBottom="m">
            Application summary
          </Heading>
          <BodyText size="medium" color={colors.blackPepper600} marginBottom="m">
            Position: Senior Software Engineer
          </BodyText>
          <BodyText size="medium" color={colors.blackPepper600} marginBottom="m">
            Status: Under review
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            The candidate has 8 years of experience in full-stack development with expertise in React, Node.js, and cloud infrastructure. Previous experience at Accenture and Shell.
          </BodyText>
        </Card>
      </>
      ) : (
        <Card padding="l">
          <Heading size="small" marginBottom="m">
            Activity
          </Heading>
          <BodyText size="medium" color={colors.blackPepper600}>
            Placeholder for timeline and message history. Profile tab contains the WhatsApp campaign actions.
          </BodyText>
        </Card>
      )}
        </Box>
      </Flex>

      {/* Sliding Side Panel */}
      {isPanelOpen && (
        <>
          {/* Overlay */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setIsPanelOpen(false)}
          />

          {/* Panel */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '480px',
              backgroundColor: 'white',
              boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              overflow: 'auto',
            }}
          >
            {/* Panel Header */}
            <Box
              padding="l"
              style={{
                borderBottom: `1px solid ${colors.soap300}`,
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="small">Send WhatsApp message</Heading>
                <ToolbarIconButton
                  icon={xSmallIcon}
                  aria-label="Close panel"
                  onClick={() => setIsPanelOpen(false)}
                />
              </Flex>
            </Box>

            {/* Panel Content */}
            <Box padding="l">
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
                      Message sent successfully to {MOCK_CANDIDATE.name.split(' ')[0]}.
                    </BodyText>
                  </Flex>
                </Box>
              )}

              {/* Recipient Info */}
              <Box
                marginBottom="l"
                padding="m"
                style={{
                  backgroundColor: colors.soap100,
                  borderRadius: 4,
                }}
              >
                <BodyText size="small" fontWeight="bold" marginBottom="xs">
                  Recipient
                </BodyText>
                <BodyText size="medium" marginBottom="xxs">
                  {MOCK_CANDIDATE.name}
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600}>
                  {MOCK_CANDIDATE.phone}
                </BodyText>
              </Box>

              {/* Template Selection */}
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

              {/* Message Preview */}
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
                  Message preview
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
                  {previewMessage}
                </BodyText>
                {selectedTemplate.bodyAr && (
                  <BodyText size="small" color={colors.blackPepper500} style={{ direction: 'rtl' }}>
                    {selectedTemplate.bodyAr
                      .replace('{{name}}', MOCK_CANDIDATE.name.split(' ')[0])
                      .replace('{{company}}', MOCK_CANDIDATE.company)
                      .replace('{{date}}', '25 March 2026')
                      .replace('{{time}}', '10:00 AM')
                      .replace('{{job_title}}', 'Senior Software Engineer')
                      .replace('{{link}}', 'workday.com/apply/12345')}
                  </BodyText>
                )}
              </Box>

              {/* WhatsApp Info Banner */}
              <Box marginBottom="m" style={{ width: '100%' }}>
                <Banner hasError={false} id="whatsapp-info" style={{ width: '100%', maxWidth: '100%' }}>
                  <Banner.Icon />
                  <Banner.Label>
                    WhatsApp messages typically receive responses in 5-15 minutes vs 24-48 hours for email. Ensure message complies with PDPL/PDPA requirements.
                  </Banner.Label>
                </Banner>
              </Box>

              {/* Action Buttons */}
              <Flex gap="s" marginTop="l">
                <PrimaryButton
                  onClick={handleSendMessage}
                  disabled={isSending}
                  aria-busy={isSending}
                  aria-label={isSending ? 'Sending message' : 'Send message'}
                  style={{ flex: 1 }}
                >
                  {isSending ? 'Sending message...' : 'Send message'}
                </PrimaryButton>
                <SecondaryButton onClick={() => setIsPanelOpen(false)} disabled={isSending}>
                  Cancel
                </SecondaryButton>
              </Flex>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GCCWhatsAppCampaign;
