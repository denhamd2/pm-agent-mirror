/**
 * India Aadhaar eSign via Adobe Sign (offer) — Canvas Kit prototype v01
 *
 * Design brief: design/aadhaar-adobe-sign-design-brief.md (318 APPROVED, PASS 2.5 copy canonical)
 * PRD: docs/prds/india-aadhaar-adobe-sign-offer-prd.md
 * Pipeline: INDIA-E2E-004 · Step 22 (320)
 *
 * Surfaces: recruiter (Review document, Workday awaiting confirmation), candidate task, tenant admin.
 */

import React, { useCallback, useState, type CSSProperties } from 'react';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Banner } from '@workday/canvas-kit-react/banner';

import {
  WorkdayTopNav,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_LINK_ACCENT,
  cardStyle,
  CandidateHomeLayout,
  CandidateTaskModal,
  AdobeSignAadhaarFlow,
  DocumentReviewTask,
  type CandidateTask,
  type CandidateApplication,
  type SidebarWidget,
} from './components';

/** 319 + 060 draft copy — PASS 2.5; do not change without new 319 pass */
const ORG_NAME = 'Acme Corporation';

function shellCardStyle(): CSSProperties {
  return {
    ...cardStyle(),
    boxShadow: SANA_CARD_SHADOW,
    borderRadius: SANA_CARD_RADIUS_LG,
  };
}

function LinkText({ children, href = '#' }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      style={{
        color: SANA_LINK_ACCENT,
        fontSize: 14,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      {children}
    </a>
  );
}

function SignedDocumentViewer({ onClose }: { onClose: () => void }) {
  return (
    <Box 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card padding="xl" style={{ ...shellCardStyle(), width: 700, maxHeight: '90vh', overflowY: 'auto' }}>
        <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="l">
          <Box>
            <Heading size="large" marginBottom="xs">Offer Letter</Heading>
            <BodyText size="small" color="blackPepper600">Senior Engineer — Cloud Platform</BodyText>
            <BodyText size="small" color="blackPepper600">REQ-2026-IND-4412</BodyText>
          </Box>
        </Flex>

        <Banner marginBottom="l">
          <Banner.Icon />
          <Banner.Label>Signed via Aadhaar e-Sign on 30 March 2026</Banner.Label>
        </Banner>

        <Card padding="l" marginBottom="l" style={{ backgroundColor: colors.soap100 }}>
          <Heading size="small" marginBottom="m">Offer Details</Heading>
          <Flex flexDirection="column" gap="m">
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Position</BodyText>
              <BodyText size="small">Senior Engineer — Cloud Platform</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Location</BodyText>
              <BodyText size="small">Bengaluru, India</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Start Date</BodyText>
              <BodyText size="small">15 April 2026</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Reporting Manager</BodyText>
              <BodyText size="small">Priya Sharma</BodyText>
            </Box>
          </Flex>
        </Card>

        <Card padding="l" marginBottom="l" style={{ backgroundColor: colors.soap100 }}>
          <Heading size="small" marginBottom="m">Signature Information</Heading>
          <Flex flexDirection="column" gap="s">
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Signature Method</BodyText>
              <BodyText size="small">Aadhaar e-Sign via Adobe Sign</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Signed By</BodyText>
              <BodyText size="small">Ananya Krishnan</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Signed On</BodyText>
              <BodyText size="small">30 March 2026, 14:32 IST</BodyText>
            </Box>
            <Box>
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">Authentication Provider</BodyText>
              <BodyText size="small">NSDL e-Governance Infrastructure Limited</BodyText>
            </Box>
          </Flex>
        </Card>

        <BodyText size="small" color="blackPepper600" marginBottom="l">
          This document has been electronically signed using Aadhaar-based digital signature as per the Information Technology Act, 2000. The signature is legally valid and equivalent to a handwritten signature.
        </BodyText>

        <Flex justifyContent="flex-end">
          <PrimaryButton onClick={onClose}>Close</PrimaryButton>
        </Flex>
      </Card>
    </Box>
  );
}

type AppState = 'candidate-home' | 'candidate-task' | 'adobe-sim' | 'view-document';

export default function AadhaarAdobeSignV01() {
  const [appState, setAppState] = useState<AppState>('candidate-home');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'completed'>('todo');
  const [candidatePreAdobe, setCandidatePreAdobe] = useState(true);
  const [search, setSearch] = useState('');

  // Data for CandidateHomeLayout
  const candidateTasks: CandidateTask[] = [
    {
      id: 'review-document',
      title: 'Review document',
      description: 'Senior Engineer — Cloud Platform',
      status: taskStatus,
      onAction: () => setAppState('candidate-task'),
      actionLabel: 'Start',
      onView: taskStatus === 'completed' ? () => setAppState('view-document') : undefined,
    },
  ];

  const candidateApplications: CandidateApplication[] = [
    {
      id: 'app-1',
      jobTitle: 'Senior Engineer — Cloud Platform',
      reqNumber: 'REQ-2026-IND-4412',
      location: 'Bengaluru, India',
      status: 'active',
      statusLabel: 'Offer',
      statusType: StatusIndicator.Type.Blue,
      appliedDate: '15 Feb 2026',
    },
  ];

  const sidebarWidgets: SidebarWidget[] = [
    {
      id: 'schedule',
      title: 'Interview Schedule',
      content: <BodyText size="medium" color="blackPepper600">No upcoming interviews scheduled.</BodyText>,
    },
    {
      id: 'alerts',
      title: 'Job Alerts',
      content: (
        <>
          <Flex alignItems="center" justifyContent="space-between" marginBottom="s">
            <BodyText size="medium">Engineering roles in India</BodyText>
            <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Active" />
          </Flex>
          <LinkText>Manage job alerts</LinkText>
        </>
      ),
    },
    {
      id: 'settings',
      title: 'Account Settings',
      content: (
        <Flex flexDirection="column" gap="s">
          <LinkText>Update contact information</LinkText>
          <LinkText>Change password</LinkText>
          <LinkText>Manage data privacy</LinkText>
        </Flex>
      ),
    },
  ];

  return (
    <Box style={{ position: 'relative', minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav searchValue={search} onSearchChange={setSearch} />
      
      <CandidateHomeLayout
        userName="Candidate Home"
        userSubtitle="Welcome, Ananya Krishnan! Manage your applications and tasks here."
        tasks={candidateTasks}
        applications={candidateApplications}
        sidebarWidgets={sidebarWidgets}
      />
      
      <CandidateTaskModal
        open={appState === 'candidate-task'}
        onClose={() => setAppState('candidate-home')}
      >
        <DocumentReviewTask
          preAdobe={candidatePreAdobe}
          orgName={ORG_NAME}
          onOpenAdobe={() => setAppState('adobe-sim')}
          onComplete={() => {
            setTaskStatus('completed');
            setAppState('candidate-home');
          }}
          onCancel={() => setAppState('candidate-home')}
        />
      </CandidateTaskModal>
      
      <AdobeSignAadhaarFlow
        open={appState === 'adobe-sim'}
        onComplete={() => {
          setCandidatePreAdobe(false);
          setAppState('candidate-task');
        }}
        orgName={ORG_NAME}
      />

      {appState === 'view-document' && (
        <SignedDocumentViewer onClose={() => setAppState('candidate-home')} />
      )}
    </Box>
  );
}
