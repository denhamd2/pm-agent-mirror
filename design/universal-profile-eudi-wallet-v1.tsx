import * as React from 'react';
import {
  Box,
  Flex,
  Card,
  Heading,
  BodyText,
  PrimaryButton,
  SecondaryButton,
  Avatar,
  StatusIndicator,
  SystemIcon,
} from '@workday/canvas-kit-react';
import {
  checkCircleIcon,
  lockIcon,
  jobInfoIcon,
  documentIcon,
  mailIcon,
  userIcon,
  searchIcon,
} from '@workday/canvas-system-icons-web';

import { WorkdayTopNav } from './components/WorkdayTopNav';
import { SanaCommMessageBubble, SanaCommComposer } from './components/SanaCommPanelPatterns';

// Sana Style Constants
const SANA_PAGE_CANVAS = '#F3F5F7';
const SANA_CARD_RADIUS_LG = '16px';

export default function UniversalProfilePrototype() {
  const [activeTab, setActiveTab] = React.useState<'apply' | 'paradox' | 'zk-pool' | 'recruiter'>('apply');
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <Box backgroundColor={SANA_PAGE_CANVAS} minHeight="100vh">
      <WorkdayTopNav 
        searchValue={searchValue} 
        onSearchChange={setSearchValue} 
      />
      <Flex maxWidth="1400px" margin="0 auto" padding="spacing.l" gap="spacing.l" alignItems="flex-start">
        
        {/* Left Sidebar for Navigation / Tabs */}
        <Flex flexDirection="column" gap="spacing.s" width="220px" flexShrink={0}>
          <Heading size="small" marginBottom="spacing.xs">Prototypes</Heading>
          <SecondaryButton 
            size="small"
            onClick={() => setActiveTab('apply')}
            style={activeTab === 'apply' ? { backgroundColor: '#0875e1', color: 'white', justifyContent: 'flex-start' } : { justifyContent: 'flex-start' }}
          >
            1. Candidate Apply
          </SecondaryButton>
          <SecondaryButton 
            size="small"
            onClick={() => setActiveTab('paradox')}
            style={activeTab === 'paradox' ? { backgroundColor: '#0875e1', color: 'white', justifyContent: 'flex-start' } : { justifyContent: 'flex-start' }}
          >
            2. Recruiter Agent Outreach
          </SecondaryButton>
          <SecondaryButton 
            size="small"
            onClick={() => setActiveTab('zk-pool')}
            style={activeTab === 'zk-pool' ? { backgroundColor: '#0875e1', color: 'white', justifyContent: 'flex-start' } : { justifyContent: 'flex-start' }}
          >
            3. Zero-Knowledge Pool
          </SecondaryButton>
          <SecondaryButton 
            size="small"
            onClick={() => setActiveTab('recruiter')}
            style={activeTab === 'recruiter' ? { backgroundColor: '#0875e1', color: 'white', justifyContent: 'flex-start' } : { justifyContent: 'flex-start' }}
          >
            4. Recruiter View
          </SecondaryButton>
        </Flex>

        {/* Main Content Area */}
        <Box flex={1} width="100%">
          {/* View 1: Candidate Apply Experience */}
          {activeTab === 'apply' && <CandidateApplyView />}

          {/* View 2: Conversational AI Outreach (Recruiter Agent Outreach) */}
          {activeTab === 'paradox' && <RecruiterOutreachView />}

          {/* View 3: Zero-Knowledge Talent Pools */}
          {activeTab === 'zk-pool' && <ZeroKnowledgePoolView />}

          {/* View 4: Recruiter View (Original Prototype) */}
          {activeTab === 'recruiter' && <RecruiterView />}
        </Box>

      </Flex>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// VIEW 1: CANDIDATE APPLY EXPERIENCE
// ---------------------------------------------------------------------------
function CandidateApplyView() {
  const [step, setStep] = React.useState<0 | 1 | 2 | 3>(0);

  return (
    <Flex flexDirection="column" gap="spacing.l" alignItems="center">
      <Card padding="spacing.xl" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300" width="100%" maxWidth="600px">
        
        {/* Step 0: Job Posting */}
        {step === 0 && (
          <Flex flexDirection="column" gap="spacing.m">
            <Heading size="large" margin="0">Senior Registered Nurse</Heading>
            <BodyText size="medium" color="blackPepper500">
              Global Health Partners · London, UK · Full-time
            </BodyText>
            <BodyText size="small" color="blackPepper600">
              We are seeking a highly qualified Senior Registered Nurse. Requirements: Verified BSc in Nursing and active NMC registration.
            </BodyText>
            <Flex gap="spacing.s" marginTop="spacing.m">
              <PrimaryButton onClick={() => setStep(1)} icon={lockIcon}>Apply with EUDI Wallet</PrimaryButton>
              <SecondaryButton>Apply Manually (Upload Resume)</SecondaryButton>
            </Flex>
          </Flex>
        )}

        {/* Step 1: QR Code / Deep Link */}
        {step === 1 && (
          <Flex flexDirection="column" gap="spacing.m" alignItems="center" textAlign="center">
            <Heading size="medium" margin="0">Connect your Wallet</Heading>
            <BodyText size="small" color="blackPepper600">
              Scan this code with your EUDI Wallet or compatible app to securely share your verified credentials.
            </BodyText>
            <Flex 
              width="200px" 
              height="200px" 
              backgroundColor="frenchVanilla100" 
              border="2px dashed" 
              borderColor="soap400"
              alignItems="center"
              justifyContent="center"
              borderRadius="8px"
            >
              <SystemIcon icon={searchIcon} size={48} color="soap400" />
            </Flex>
            <Flex gap="spacing.s" marginTop="spacing.m">
              <SecondaryButton onClick={() => setStep(0)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={() => setStep(2)}>Simulate Scan</PrimaryButton>
            </Flex>
          </Flex>
        )}

        {/* Step 2: Selective Disclosure */}
        {step === 2 && (
          <Flex flexDirection="column" gap="spacing.m">
            <Heading size="medium" margin="0">Information Request</Heading>
            <BodyText size="small" color="blackPepper600">
              <strong>Global Health Partners</strong> is requesting the following verified credentials to fast-track your application:
            </BodyText>
            <Box backgroundColor="frenchVanilla100" padding="spacing.m" borderRadius="8px" border="1px solid" borderColor="soap300">
              <Flex flexDirection="column" gap="spacing.s">
                <Flex alignItems="center" gap="spacing.s">
                  <SystemIcon icon={userIcon} />
                  <BodyText size="small" fontWeight="bold">Proof of Identity</BodyText>
                </Flex>
                <Flex alignItems="center" gap="spacing.s">
                  <SystemIcon icon={documentIcon} />
                  <BodyText size="small" fontWeight="bold">BSc Nursing (University College London)</BodyText>
                </Flex>
                <Flex alignItems="center" gap="spacing.s">
                  <SystemIcon icon={jobInfoIcon} />
                  <BodyText size="small" fontWeight="bold">Employment History (NHS Trust)</BodyText>
                </Flex>
              </Flex>
            </Box>
            <Flex gap="spacing.s" marginTop="spacing.m" justifyContent="flex-end">
              <SecondaryButton onClick={() => setStep(1)}>Decline</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)}>Approve & Share</PrimaryButton>
            </Flex>
          </Flex>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Flex flexDirection="column" gap="spacing.m" alignItems="center" textAlign="center">
            <SystemIcon icon={checkCircleIcon} size={64} color="greenery500" />
            <Heading size="medium" margin="0">Application Submitted!</Heading>
            <BodyText size="small" color="blackPepper600">
              Your verified credentials have been securely shared. Because your qualifications are cryptographically verified, your application has been fast-tracked.
            </BodyText>
            <PrimaryButton onClick={() => setStep(0)} marginTop="spacing.m">Return to Jobs</PrimaryButton>
          </Flex>
        )}

      </Card>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// VIEW 2: RECRUITER AGENT OUTREACH
// ---------------------------------------------------------------------------
function RecruiterOutreachView() {
  const [message, setMessage] = React.useState('');

  return (
    <Flex flexDirection="column" alignItems="center">
      <Card padding="spacing.m" borderRadius="24px" border="8px solid" borderColor="blackPepper500" width="100%" maxWidth="400px" backgroundColor="frenchVanilla100">
        
        {/* Phone Header */}
        <Flex justifyContent="space-between" alignItems="center" paddingBottom="spacing.s" borderBottom="1px solid" borderColor="soap300" marginBottom="spacing.m">
          <Flex alignItems="center" gap="spacing.xs">
            <Avatar size={Avatar.Size.s} />
            <Heading size="small" margin="0">Recruiter Agent Outreach</Heading>
          </Flex>
          <BodyText size="small" color="greenery500" fontWeight="bold">WhatsApp</BodyText>
        </Flex>

        {/* Chat Area */}
        <Flex flexDirection="column" justifyContent="space-between" minHeight="400px">
          <Flex flexDirection="column" gap="spacing.s">
            
            {/* Bot Message */}
            <SanaCommMessageBubble align="start" timestamp="10:02 AM">
              Hi Sarah, we have a new Senior Nursing role that requires a verified BSc and active certification. Your profile shows you hold these credentials. Would you like to instantly apply using your EUDI Wallet?
            </SanaCommMessageBubble>

            {/* User Message */}
            <SanaCommMessageBubble align="end" timestamp="10:05 AM">
              Yes, apply.
            </SanaCommMessageBubble>

            {/* Bot Message */}
            <SanaCommMessageBubble align="start" timestamp="10:05 AM">
              Great! Please click this link to authorize the presentation of your credentials:
              <Box marginTop="spacing.s">
                <PrimaryButton size="small">Share EUDI Credentials</PrimaryButton>
              </Box>
            </SanaCommMessageBubble>

          </Flex>

          {/* Composer */}
          <Box marginTop="spacing.m">
            <SanaCommComposer 
              value={message}
              onChange={setMessage}
              placeholder="Type a message..."
              onSend={() => setMessage('')}
            />
          </Box>
        </Flex>
      </Card>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// VIEW 3: ZERO-KNOWLEDGE TALENT POOLS
// ---------------------------------------------------------------------------
function ZeroKnowledgePoolView() {
  return (
    <Flex flexDirection="column" gap="spacing.l">
      <Flex justifyContent="space-between" alignItems="center" marginBottom="spacing.s">
        <Box>
          <Heading size="large" margin="0">Zero-Knowledge Talent Pool</Heading>
          <BodyText size="small" color="blackPepper500">Segment: Senior Nursing (London)</BodyText>
        </Box>
        <PrimaryButton icon={searchIcon}>Filter Pool</PrimaryButton>
      </Flex>

      <Card padding="spacing.l" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300">
        <Flex flexDirection="column" gap="spacing.m">
          
          {/* Candidate 1 */}
          <Flex justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="soap300" paddingBottom="spacing.m">
            <Flex gap="spacing.m" alignItems="center">
              <Avatar size={Avatar.Size.l} url="" /> {/* Anonymous Avatar */}
              <Box>
                <Heading size="small" margin="0">Candidate ZK-9482</Heading>
                <BodyText size="small" color="blackPepper500">Available · 98% Match</BodyText>
              </Box>
            </Flex>
            <Flex gap="spacing.s">
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified BSc Nursing" icon={checkCircleIcon} />
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified NMC Reg" icon={checkCircleIcon} />
            </Flex>
            <SecondaryButton icon={lockIcon}>Request Reveal</SecondaryButton>
          </Flex>

          {/* Candidate 2 */}
          <Flex justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="soap300" paddingBottom="spacing.m">
            <Flex gap="spacing.m" alignItems="center">
              <Avatar size={Avatar.Size.l} url="" />
              <Box>
                <Heading size="small" margin="0">Candidate ZK-1105</Heading>
                <BodyText size="small" color="blackPepper500">Passive · 92% Match</BodyText>
              </Box>
            </Flex>
            <Flex gap="spacing.s">
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified BSc Nursing" icon={checkCircleIcon} />
            </Flex>
            <SecondaryButton icon={lockIcon}>Request Reveal</SecondaryButton>
          </Flex>

          {/* Candidate 3 */}
          <Flex justifyContent="space-between" alignItems="center">
            <Flex gap="spacing.m" alignItems="center">
              <Avatar size={Avatar.Size.l} url="" />
              <Box>
                <Heading size="small" margin="0">Candidate ZK-3391</Heading>
                <BodyText size="small" color="blackPepper500">Available · 88% Match</BodyText>
              </Box>
            </Flex>
            <Flex gap="spacing.s">
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified MSc Nursing" icon={checkCircleIcon} />
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified NMC Reg" icon={checkCircleIcon} />
            </Flex>
            <PrimaryButton disabled>Reveal Pending</PrimaryButton>
          </Flex>

        </Flex>
      </Card>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// VIEW 4: RECRUITER VIEW (ORIGINAL)
// ---------------------------------------------------------------------------
function RecruiterView() {
  return (
    <Flex flexDirection="column" gap="spacing.l">
      {/* Page Header */}
      <Flex justifyContent="space-between" alignItems="center" marginBottom="spacing.s">
        <Heading size="large" margin="0">Candidate Profile</Heading>
        <Flex gap="spacing.s">
          <SecondaryButton icon={mailIcon}>Message</SecondaryButton>
          <SecondaryButton icon={lockIcon}>Request Credentials</SecondaryButton>
          <PrimaryButton>Move Forward</PrimaryButton>
        </Flex>
      </Flex>

      {/* Candidate Hub Header Card */}
      <Card padding="spacing.l" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300">
        <Flex gap="spacing.l" alignItems="center">
          <Avatar size={Avatar.Size.xl} />
          <Box flex={1}>
            <Flex alignItems="center" gap="spacing.s" marginBottom="spacing.xxs">
              <Heading size="medium" margin="0">Elena Rodriguez</Heading>
              <StatusIndicator 
                type={StatusIndicator.Type.Green} 
                emphasis={StatusIndicator.Emphasis.Low} 
                label="EUDI Identity Verified" 
                icon={checkCircleIcon} 
              />
            </Flex>
            <BodyText size="small" color="blackPepper600">
              Senior Software Engineer · Applied 2 days ago · Madrid, France
            </BodyText>
            <BodyText size="small" color="blackPepper600" marginTop="spacing.xxs">
              <strong>DID:</strong> did:web:eudi.eu:user:987654321
            </BodyText>
          </Box>
        </Flex>
      </Card>

      {/* Two Column Layout */}
      <Flex gap="spacing.l" alignItems="flex-start">
        
        {/* Main Content (Left) */}
        <Flex flexDirection="column" gap="spacing.l" flex={2}>
          
          {/* Experience Section */}
          <Card padding="spacing.l" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300">
            <Flex alignItems="center" gap="spacing.s" marginBottom="spacing.m">
              <SystemIcon icon={jobInfoIcon} size={24} />
              <Heading size="small" margin="0">Experience</Heading>
            </Flex>

            {/* Verified Experience */}
            <Box borderBottom="1px solid" borderColor="soap300" paddingBottom="spacing.m" marginBottom="spacing.m">
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Heading size="small" margin="0">Senior Solutions Architect</Heading>
                  <BodyText size="medium" color="blackPepper500">Accenture · Full-time</BodyText>
                  <BodyText size="small" color="blackPepper400">Jan 2020 - Present · 6 yrs 4 mos</BodyText>
                </Box>
                <StatusIndicator 
                  type={StatusIndicator.Type.Green} 
                  emphasis={StatusIndicator.Emphasis.Low} 
                  label="Verified by Accenture" 
                  icon={checkCircleIcon} 
                />
              </Flex>
              <BodyText size="medium" marginTop="spacing.s">
                Led cloud migration projects for Fortune 500 clients across EMEA.
              </BodyText>
            </Box>

            {/* Unverified Experience */}
            <Box>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Heading size="small" margin="0">Software Engineer</Heading>
                  <BodyText size="medium" color="blackPepper500">TechNova Solutions · Full-time</BodyText>
                  <BodyText size="small" color="blackPepper400">Mar 2016 - Dec 2019 · 3 yrs 10 mos</BodyText>
                </Box>
                <StatusIndicator 
                  type={StatusIndicator.Type.Gray} 
                  emphasis={StatusIndicator.Emphasis.Low} 
                  label="Self-reported" 
                />
              </Flex>
            </Box>
          </Card>

          {/* Education Section */}
          <Card padding="spacing.l" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300">
            <Flex alignItems="center" gap="spacing.s" marginBottom="spacing.m">
              <SystemIcon icon={documentIcon} size={24} />
              <Heading size="small" margin="0">Education</Heading>
            </Flex>

            <Box>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Heading size="small" margin="0">Technical University of Munich</Heading>
                  <BodyText size="medium" color="blackPepper500">M.Sc. Computer Science</BodyText>
                  <BodyText size="small" color="blackPepper400">2014 - 2016</BodyText>
                </Box>
                <StatusIndicator 
                  type={StatusIndicator.Type.Green} 
                  emphasis={StatusIndicator.Emphasis.Low} 
                  label="Verified by TUM" 
                  icon={checkCircleIcon} 
                />
              </Flex>
            </Box>
          </Card>

        </Flex>

        {/* Side Panel (Right) */}
        <Flex flexDirection="column" gap="spacing.l" flex={1}>
          <Card padding="spacing.l" borderRadius={SANA_CARD_RADIUS_LG} border="1px solid" borderColor="soap300" backgroundColor="blueberry100">
            <Heading size="small" margin="0" marginBottom="spacing.s">Verification Summary</Heading>
            <BodyText size="small" marginBottom="spacing.m">
              This candidate applied using a W3C Verifiable Credentials wallet. Cryptographic proofs have been validated against public issuer registries.
            </BodyText>
            <Flex flexDirection="column" gap="spacing.xs">
              <Flex justifyContent="space-between">
                <BodyText size="small" fontWeight="bold">Identity</BodyText>
                <BodyText size="small" color="greenery600">Verified</BodyText>
              </Flex>
              <Flex justifyContent="space-between">
                <BodyText size="small" fontWeight="bold">Education</BodyText>
                <BodyText size="small" color="greenery600">1 of 1 Verified</BodyText>
              </Flex>
              <Flex justifyContent="space-between">
                <BodyText size="small" fontWeight="bold">Experience</BodyText>
                <BodyText size="small" color="orange500">1 of 2 Verified</BodyText>
              </Flex>
            </Flex>
          </Card>
        </Flex>

      </Flex>
    </Flex>
  );
}
