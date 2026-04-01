/**
 * Candidate Smart View v86 — Three-column carousel layout matching Figma design
 *
 * Route: /candidate-smart-view-v86
 * 
 * Layout: Top action bar + Three-column grid (Left: Context 380px | Center: Resume flex | Right: Parsed 380px)
 * Features: Carousel navigation, collapsible insights, fit-gap analysis, previous applications, structured resume
 */
import { useCallback, useEffect, useState } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { Table } from '@workday/canvas-kit-react/table';
import { Menu } from '@workday/canvas-kit-react/menu';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  arrowLeftIcon,
  arrowRightIcon,
  checkIcon,
  xIcon,
  starIcon,
  dotIcon,
  locationIcon,
  calendarIcon,
  fileIcon,
  userIcon,
  globeIcon,
  dollarIcon,
  plusIcon,
} from '@workday/canvas-system-icons-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import {
  WorkdayTopNav,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  CandidateGradeBadge,
  CollapsibleSection,
  InsightListItem,
  StructuredResume,
  type ResumeEntry,
} from './components';

interface Insight {
  id: string;
  icon: any;
  iconColor?: string;
  text: string;
  linkText?: string;
}

interface FitGapItem {
  id: string;
  requirement: string;
  evidenceText: string;
  met: boolean;
}

interface PreviousApp {
  id: string;
  position: string;
  appliedDate: string;
  result: string;
  resultType: 'declined' | 'not-selected' | 'accepted';
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  grade: 'A' | 'B' | 'C' | 'D';
  badges: string[];
  location: string;
  appliedDate: string;
  appliedJob: string;
  email: string;
  phone: string;
  awaitingTask: string;
  awaitingTaskDate: string;
  insights: Insight[];
  fitGapItems: FitGapItem[];
  previousApplications: PreviousApp[];
  bio: string;
  experience: ResumeEntry[];
  skills: string[];
  education: string[];
  certifications: string[];
  resumeUrl: string;
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'David Martinez',
    title: 'Senior Frontend Developer',
    grade: 'A',
    badges: ['Hirevu', 'External Referral'],
    location: 'Los Angeles, CA, US',
    appliedDate: 'Nov 14, 2025',
    appliedJob: 'Senior Frontend Developer',
    email: 'david.martinez@example.com',
    phone: '+1 (555) 123-4567',
    awaitingTask: 'Review Candidate and Schedule Screening',
    awaitingTaskDate: 'Application received on Nov 14, 2026',
    insights: [
      { id: 'i1', icon: starIcon, text: 'Rated on questionnaire responses and portfolio' },
      { id: 'i2', icon: globeIcon, text: 'Legally authorized to work in the US' },
      { id: 'i3', icon: fileIcon, text: 'Will require visa sponsorship for employment status' },
      { id: 'i4', icon: dollarIcon, text: 'Desired salary of $100,000' },
      { id: 'i5', icon: checkIcon, text: 'Protected Veteran' },
      { id: 'i6', icon: userIcon, text: 'Referred by Temira Semano', linkText: 'View referrer profile' },
      { id: 'i7', icon: locationIcon, text: 'Geographic location within 25 miles' },
      { id: 'i8', icon: dotIcon, text: 'Worked at a Fortune 500 company' },
    ],
    fitGapItems: [
      {
        id: 'f1',
        requirement: 'React/Typescript expertise',
        evidenceText: 'Led multiple LL modernization initiatives',
        met: true,
      },
      {
        id: 'f2',
        requirement: 'Frontend leadership experience',
        evidenceText: 'Led multiple LL modernization initiatives',
        met: true,
      },
      {
        id: 'f3',
        requirement: 'UI/UX design sensibility',
        evidenceText: 'Mentions delivering exceptional user experience',
        met: true,
      },
      {
        id: 'f4',
        requirement: 'Next.js framework experience',
        evidenceText: 'Next.js framework skill mentioned',
        met: true,
      },
    ],
    previousApplications: [
      {
        id: 'p1',
        position: 'Frontend Developer',
        appliedDate: 'Jan 15, 2025',
        result: 'Declined by Candidate',
        resultType: 'declined',
      },
      {
        id: 'p2',
        position: 'UI Engineer',
        appliedDate: 'Mar 3, 2025',
        result: 'Not Selected',
        resultType: 'not-selected',
      },
      {
        id: 'p3',
        position: 'Senior Software Engineer',
        appliedDate: 'Aug 12, 2024',
        result: 'Offered - Accepted',
        resultType: 'accepted',
      },
    ],
    bio: 'Creative and detail-oriented frontend developer with 8+ years of experience building scalable web applications. Passionate about crafting exceptional user experiences and mentoring junior developers.',
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc',
        dateRange: 'Jan 2022 - Present',
        bullets: [
          'Led modernization of legacy React codebase to Next.js, reducing load times by 40%',
          'Architected design system used across 15+ product teams',
          'Mentored 5 junior developers, improving team velocity by 25%',
        ],
        isCurrent: true,
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        dateRange: 'Jun 2018 - Dec 2021',
        bullets: [
          'Built responsive web applications using React, TypeScript, and GraphQL',
          'Collaborated with designers to implement pixel-perfect UI components',
          'Optimized bundle size and performance, achieving 95+ Lighthouse scores',
        ],
      },
      {
        title: 'Junior Web Developer',
        company: 'Digital Agency Co',
        dateRange: 'Mar 2016 - May 2018',
        bullets: [
          'Developed client websites using HTML, CSS, JavaScript, and WordPress',
          'Implemented A/B testing and analytics tracking',
        ],
      },
    ],
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'CSS/Sass',
      'Node.js',
      'GraphQL',
      'Git',
      'Figma',
      'Jest',
      'Webpack',
    ],
    education: ['BS Computer Science, UCLA, 2016'],
    certifications: ['Meta Frontend Developer Professional Certificate, 2023'],
    resumeUrl: '/mock-resume.pdf',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    title: 'Product Manager',
    grade: 'B',
    badges: ['LinkedIn'],
    location: 'New York, NY, US',
    appliedDate: 'Nov 12, 2025',
    appliedJob: 'Senior Product Manager',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 987-6543',
    awaitingTask: 'Schedule Phone Screen',
    awaitingTaskDate: 'Application received on Nov 12, 2026',
    insights: [
      { id: 'i1', icon: starIcon, text: 'Strong product portfolio with enterprise B2B focus' },
      { id: 'i2', icon: globeIcon, text: 'Legally authorized to work in the US' },
      { id: 'i3', icon: dollarIcon, text: 'Desired salary of $150,000' },
      { id: 'i4', icon: locationIcon, text: 'Open to relocation' },
    ],
    fitGapItems: [
      {
        id: 'f1',
        requirement: 'Enterprise SaaS product experience',
        evidenceText: 'Workday and Salesforce product launches',
        met: true,
      },
      {
        id: 'f2',
        requirement: 'Technical background',
        evidenceText: 'CS degree and engineering experience',
        met: true,
      },
    ],
    previousApplications: [],
    bio: 'Product Manager with 6 years of experience in enterprise B2B SaaS. Specialized in HR technology and workflow automation.',
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'Workday',
        dateRange: 'Mar 2023 - Present',
        bullets: [
          'Led launch of AI-powered candidate matching feature, increasing placement rates by 30%',
          'Managed roadmap for Recruiting product line with $50M ARR',
        ],
        isCurrent: true,
      },
      {
        title: 'Product Manager',
        company: 'Salesforce',
        dateRange: 'Jun 2020 - Feb 2023',
        bullets: [
          'Shipped 3 major features for Service Cloud',
          'Conducted user research with 50+ enterprise customers',
        ],
      },
    ],
    skills: ['Product Strategy', 'User Research', 'SQL', 'Jira', 'Figma', 'A/B Testing'],
    education: ['MBA, Stanford GSB, 2020', 'BS Computer Science, MIT, 2018'],
    certifications: ['Pragmatic Marketing Certified (PMC-VI)', 'Certified Scrum Product Owner (CSPO)'],
    resumeUrl: '/mock-resume.pdf',
  },
];

export function CandidateSmartViewV86() {
  // #region agent log
  fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:281',message:'Component mounted',data:{},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const [searchValue, setSearchValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resumeFormat, setResumeFormat] = useState<'original' | 'parsed'>('parsed');
  const [showResume, setShowResume] = useState(true);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  const acceptModal = useModalModel({ id: 'accept-modal' });
  const declineModal = useModalModel({ id: 'decline-modal' });
  const [carouselBlocked, setCarouselBlocked] = useState(false);

  const candidate = MOCK_CANDIDATES[currentIndex]!;
  const totalCandidates = MOCK_CANDIDATES.length;

  // #region agent log
  fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:295',message:'State initialized',data:{currentIndex,candidateName:candidate.name,hasInsights:candidate.insights.length,hasFitGap:candidate.fitGapItems.length},timestamp:Date.now(),hypothesisId:'B,D'})}).catch(()=>{});
  // #endregion

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? MOCK_CANDIDATES.length - 1 : i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i === MOCK_CANDIDATES.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    setSrAnnouncement(`Now viewing ${candidate.name}, candidate ${currentIndex + 1} of ${totalCandidates}`);
  }, [candidate.name, currentIndex, totalCandidates]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (carouselBlocked) return;
      const t = e.target as HTMLElement;
      if (t?.closest?.('textarea, input, select, [role="dialog"]')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [carouselBlocked, handlePrev, handleNext]);

  const openAccept = () => {
    setCarouselBlocked(true);
    acceptModal.events.show();
  };

  const closeAccept = () => {
    acceptModal.events.hide();
    setCarouselBlocked(false);
  };

  const openDecline = () => {
    setCarouselBlocked(true);
    declineModal.events.show();
  };

  const closeDecline = () => {
    declineModal.events.hide();
    setCarouselBlocked(false);
  };

  const confirmAccept = () => {
    closeAccept();
  };

  const confirmDecline = () => {
    closeDecline();
  };

  const getStatusColor = (type: 'declined' | 'not-selected' | 'accepted') => {
    switch (type) {
      case 'accepted':
        return StatusIndicator.Type.Green;
      case 'not-selected':
        return StatusIndicator.Type.Orange;
      case 'declined':
        return StatusIndicator.Type.Red;
    }
  };

  return (
    <Flex flexDirection="column" style={{ height: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {srAnnouncement}
      </span>

      <WorkdayTopNav searchValue={searchValue} onSearchChange={setSearchValue} />

      {/* Top Action Bar */}
      <Flex
        padding="m"
        justifyContent="space-between"
        alignItems="center"
        style={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${colors.soap400}`,
        }}
      >
        {/* Carousel controls */}
        <Flex gap="s" alignItems="center">
          <SecondaryButton
            size="small"
            icon={arrowLeftIcon}
            aria-label="Previous candidate"
            onClick={handlePrev}
          />
          <BodyText size="medium">
            {currentIndex + 1} of {totalCandidates} Candidates
          </BodyText>
          <SecondaryButton
            size="small"
            icon={arrowRightIcon}
            aria-label="Next candidate"
            onClick={handleNext}
          />
        </Flex>

        {/* Quick action icons */}
        <Flex gap="xs" alignItems="center">
          <TertiaryButton
            size="small"
            icon={checkIcon}
            aria-label="Accept candidate"
            onClick={openAccept}
          />
          <TertiaryButton
            size="small"
            icon={xIcon}
            aria-label="Decline candidate"
            onClick={openDecline}
          />
          <TertiaryButton size="small" icon={starIcon} aria-label="Add to favorites" />
          <TertiaryButton size="small" icon={dotIcon} aria-label="More actions" />
          <TertiaryButton
            size="small"
            icon={showResume ? checkIcon : xIcon}
            aria-label="Toggle resume display"
            onClick={() => setShowResume(!showResume)}
          />
        </Flex>
      </Flex>

      {/* Three-column content grid */}
      <Flex flex={1} padding="l" gap="l" style={{ overflow: 'auto' }}>
        {/* LEFT PANEL - Candidate context */}
        <Flex flexDirection="column" gap="m" style={{ width: 380, flexShrink: 0 }}>
          {/* Candidate Header Card */}
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}>
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:444',message:'Rendering header card',data:{grade:candidate.grade},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
            <Flex gap="m" alignItems="center" marginBottom="m">
              <CandidateGradeBadge grade={candidate.grade} size="large" />
              <Box flex={1}>
                <Heading size="large" marginBottom="xxs">
                  {candidate.name}
                </Heading>
                <Flex gap="xs" flexWrap="wrap" marginBottom="xs">
                  {candidate.badges.map((badge) => (
                    <StatusIndicator
                      key={badge}
                      type={StatusIndicator.Type.Blue}
                      emphasis={StatusIndicator.Emphasis.Low}
                      label={badge}
                    />
                  ))}
                </Flex>
              </Box>
            </Flex>

            {/* Metadata row */}
            <Flex flexDirection="column" gap="xs">
              <Flex gap="xs" alignItems="center">
                <SystemIcon icon={locationIcon} size={16} color={colors.blackPepper600} />
                <BodyText size="small">{candidate.location}</BodyText>
              </Flex>
              <Flex gap="xs" alignItems="center">
                <SystemIcon icon={calendarIcon} size={16} color={colors.blackPepper600} />
                <BodyText size="small">Applied {candidate.appliedDate}</BodyText>
              </Flex>
              <Flex gap="xs" alignItems="center">
                <SystemIcon icon={fileIcon} size={16} color={colors.blackPepper600} />
                <BodyText size="small">{candidate.appliedJob}</BodyText>
              </Flex>
            </Flex>
          </Card>

          {/* Blue Action Card */}
          <Card
            padding="l"
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              boxShadow: SANA_CARD_SHADOW,
              backgroundColor: colors.blueberry100,
            }}
          >
            <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
              Awaiting Me:
            </BodyText>
            <Heading size="medium" marginBottom="xs">
              {candidate.awaitingTask}
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              {candidate.awaitingTaskDate}
            </BodyText>
            <Flex gap="s">
              <PrimaryButton size="small" onClick={openAccept}>
                Move Forward
              </PrimaryButton>
              <SecondaryButton size="small" onClick={openDecline}>
                Decline
              </SecondaryButton>
            </Flex>
          </Card>

          {/* Horizontal Tabs */}
          <Tabs initialTab="review">
            <Tabs.List>
              <Tabs.Item data-id="review">Review</Tabs.Item>
              <Tabs.Item data-id="history">History</Tabs.Item>
              <Tabs.Item data-id="job-desc">Job Description</Tabs.Item>
            </Tabs.List>

            {/* Tab Content */}
            <Tabs.Panel data-id="review">
              <Flex flexDirection="column" gap="m" marginTop="m">
              {/* Candidate Insights - Collapsible */}
              <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}>
                {/* #region agent log */}
                {(() => { fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:522',message:'Rendering collapsible insights',data:{insightsCount:candidate.insights.length},timestamp:Date.now(),hypothesisId:'B,C'})}).catch(()=>{}); return null; })()}
                {/* #endregion */}
                <CollapsibleSection title="Candidate Insights" defaultOpen={true}>
                  <Flex flexDirection="column" gap="xs" marginTop="s">
                    {candidate.insights.map((insight) => (
                      <InsightListItem
                        key={insight.id}
                        icon={insight.icon}
                        iconColor={insight.iconColor}
                        text={insight.text}
                        linkText={insight.linkText}
                        onLinkClick={() => console.log('View details')}
                      />
                    ))}
                  </Flex>
                  <Box marginTop="m">
                    <SecondaryButton size="small">View Full Questionnaire</SecondaryButton>
                  </Box>
                </CollapsibleSection>
              </Card>

              {/* Fit & Gap - Collapsible */}
              <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}>
                <CollapsibleSection title="Fit & Gap" defaultOpen={true}>
                  <Flex flexDirection="column" gap="xs" marginTop="s">
                    {candidate.fitGapItems.map((item) => (
                      <InsightListItem
                        key={item.id}
                        icon={checkIcon}
                        iconColor={item.met ? colors.greenApple600 : colors.cinnamon500}
                        text={item.requirement}
                        linkText={item.evidenceText}
                        onLinkClick={() => console.log('View evidence')}
                      />
                    ))}
                  </Flex>
                </CollapsibleSection>
              </Card>

              {/* Previous Applications Table */}
              {candidate.previousApplications.length > 0 && (
                <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}>
                  <Heading size="small" marginBottom="s">
                    Previous Applications
                  </Heading>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Position</Table.Header>
                        <Table.Header>Applied</Table.Header>
                        <Table.Header>Result</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {candidate.previousApplications.map((app) => (
                        <Table.Row key={app.id}>
                          <Table.Cell>
                            <BodyText size="small">{app.position}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <BodyText size="small">{app.appliedDate}</BodyText>
                          </Table.Cell>
                          <Table.Cell>
                            <StatusIndicator
                              type={getStatusColor(app.resultType)}
                              emphasis={StatusIndicator.Emphasis.Low}
                              label={app.result}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card>
              )}
            </Flex>
            </Tabs.Panel>

            <Tabs.Panel data-id="history">
              <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, marginTop: space.m }}>
                <BodyText size="small" color={colors.blackPepper600}>
                  Candidate history and timeline will appear here.
                </BodyText>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel data-id="job-desc">
              <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, marginTop: space.m }}>
                <Heading size="medium" marginBottom="m">
                  {candidate.appliedJob}
                </Heading>
                <BodyText size="small">
                  Full job description and requirements will appear here, showing what the candidate applied for.
                </BodyText>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Flex>

        {/* CENTER PANEL - Resume display */}
        <Flex flexDirection="column" flex={1} gap="m">
          {/* Resume/Attachments tabs */}
          <Card
            padding="m"
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              boxShadow: SANA_CARD_SHADOW,
            }}
          >
            <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
              <Tabs initialTab="resume">
                <Tabs.List>
                  <Tabs.Item data-id="resume">Resume</Tabs.Item>
                  <Tabs.Item data-id="attachments">Attachments</Tabs.Item>
                </Tabs.List>

                <Tabs.Panel data-id="resume">
                  <Flex justifyContent="flex-end" gap="xs" marginBottom="m">
                    <SecondaryButton
                      size="small"
                      onClick={() => setResumeFormat('original')}
                      style={{
                        backgroundColor: resumeFormat === 'original' ? colors.blueberry400 : 'transparent',
                        color: resumeFormat === 'original' ? 'white' : colors.blackPepper600,
                      }}
                    >
                      Original
                    </SecondaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={() => setResumeFormat('parsed')}
                      style={{
                        backgroundColor: resumeFormat === 'parsed' ? colors.blueberry400 : 'transparent',
                        color: resumeFormat === 'parsed' ? 'white' : colors.blackPepper600,
                      }}
                    >
                      Parsed
                    </SecondaryButton>
                  </Flex>

                  <Box
                    padding="l"
                    style={{
                      minHeight: 400,
                      backgroundColor: colors.frenchVanilla100,
                      borderRadius: '4px',
                      border: `1px solid ${colors.soap400}`,
                    }}
                  >
                    {/* #region agent log */}
                    {(() => { fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:669',message:'Rendering resume content',data:{format:resumeFormat,experienceCount:candidate.experience.length,skillsCount:candidate.skills.length},timestamp:Date.now(),hypothesisId:'D,E'})}).catch(()=>{}); return null; })()}
                    {/* #endregion */}
                    {resumeFormat === 'original' ? (
                      <Flex flexDirection="column" alignItems="center" justifyContent="center" gap="m" style={{ minHeight: 400 }}>
                        <SystemIcon icon={fileIcon} size={48} color={colors.blackPepper400} />
                        <BodyText size="medium" color={colors.blackPepper600}>
                          Original resume preview (PDF)
                        </BodyText>
                        <SecondaryButton size="small">Download Resume</SecondaryButton>
                      </Flex>
                    ) : (
                      <StructuredResume
                        candidateName={candidate.name}
                        title={candidate.title}
                        location={candidate.location}
                        email={candidate.email}
                        bio={candidate.bio}
                        experience={candidate.experience}
                        skills={candidate.skills}
                        education={candidate.education}
                        certifications={candidate.certifications}
                      />
                    )}
                  </Box>
                </Tabs.Panel>

                <Tabs.Panel data-id="attachments">
                  <Box
                    padding="l"
                    style={{
                      minHeight: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BodyText size="small" color={colors.blackPepper600}>
                      No additional attachments for this candidate.
                    </BodyText>
                  </Box>
                </Tabs.Panel>
              </Tabs>
            </Flex>
          </Card>
        </Flex>

        {/* RIGHT PANEL - Structured resume (only shown when toggle is on) */}
        {/* #region agent log */}
        {(() => { fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'candidate-smart-view-v86.tsx:714',message:'Right panel render check',data:{showResume},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{}); return null; })()}
        {/* #endregion */}
        {showResume && (
          <Box style={{ width: 380, flexShrink: 0 }}>
            <Card
              padding="l"
              style={{
                borderRadius: SANA_CARD_RADIUS_LG,
                boxShadow: SANA_CARD_SHADOW,
                height: '100%',
                overflow: 'auto',
              }}
            >
              <StructuredResume
                candidateName={candidate.name}
                title={candidate.title}
                location={candidate.location}
                email={candidate.email}
                bio={candidate.bio}
                experience={candidate.experience}
                skills={candidate.skills}
                education={candidate.education}
                certifications={candidate.certifications}
              />
            </Card>
          </Box>
        )}
      </Flex>

      {/* Accept Modal */}
      <Modal model={acceptModal}>
        <Modal.Overlay style={{ zIndex: 1000 }}>
          <Modal.Card style={{ maxWidth: 440, width: 'min(100%, calc(100vw - 32px))' }}>
            <Modal.CloseIcon aria-label="Close" onClick={closeAccept} />
            <Modal.Heading>Move {candidate.name} Forward</Modal.Heading>
            <Modal.Body>
              <BodyText size="medium" marginBottom="m">
                Select the next stage for this candidate.
              </BodyText>
              <Flex justifyContent="flex-end" gap="s" marginTop="l">
                <SecondaryButton onClick={closeAccept}>Cancel</SecondaryButton>
                <PrimaryButton onClick={confirmAccept}>Confirm</PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      {/* Decline Modal */}
      <Modal model={declineModal}>
        <Modal.Overlay style={{ zIndex: 1000 }}>
          <Modal.Card style={{ maxWidth: 440, width: 'min(100%, calc(100vw - 32px))' }}>
            <Modal.CloseIcon aria-label="Close" onClick={closeDecline} />
            <Modal.Heading>Decline {candidate.name}</Modal.Heading>
            <Modal.Body>
              <BodyText size="medium" marginBottom="m" color={colors.cinnamon600}>
                This action cannot be undone.
              </BodyText>
              <Flex justifyContent="flex-end" gap="s" marginTop="l">
                <SecondaryButton onClick={closeDecline}>Cancel</SecondaryButton>
                <PrimaryButton onClick={confirmDecline}>Decline</PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      {/* Footer */}
      <Box padding="m" style={{ textAlign: 'center', backgroundColor: 'white', borderTop: `1px solid ${colors.soap400}` }}>
        <BodyText size="small" color={colors.blackPepper500}>
          Prototype v86 — Figma-matched three-column layout — Mock data for demonstration
        </BodyText>
      </Box>
    </Flex>
  );
}
