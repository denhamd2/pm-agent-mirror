/**
 * Workday Recruiter Homepage v85 - AI-Native
 * 
 * AI-powered homepage for enterprise recruiters with:
 * - AI Daily Briefing (priority insights)
 * - Smart candidate recommendations
 * - Pipeline health alerts
 * - Quick actions
 * - Personalized metrics
 * 
 * Route: /recruiter-home-v85
 */
import React, { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
  sparkleIcon,
  rocketIcon,
  clockIcon,
  exclamationCircleIcon,
  checkCircleIcon,
  chartIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
  MetricCard,
  ListItemCard,
  HiredScoreGrading,
  type WorkdayLeftTabBarPrimaryItem,
} from './components';

interface AiInsight {
  id: string;
  type: 'priority' | 'opportunity' | 'risk' | 'success';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

interface SmartRecommendation {
  id: string;
  candidateName: string;
  jobTitle: string;
  reqId: string;
  score: number;
  reason: string;
  daysInPipeline: number;
}

const NAV_PRIMARY: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'HOME' },
  { 
    icon: userIcon, 
    ariaLabel: 'Recruiting', 
    railLabel: 'RECRUIT',
    onClick: () => {
      window.location.hash = '/candidate-grid-v84';
    },
  },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'ORG' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'LINKS' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'MORE' },
];

const MOCK_AI_INSIGHTS: AiInsight[] = [
  {
    id: '1',
    type: 'priority',
    title: 'Senior PM req needs attention',
    description: 'REQ-2024-1234 has been in "Applied" stage for 18 days. 3 high-scoring candidates (A grade) are waiting for phone screen. Average time-to-screen in your pipeline is 5 days.',
    actionLabel: 'Review candidates',
    actionUrl: '/candidate-grid-v84',
  },
  {
    id: '2',
    type: 'opportunity',
    title: '2 new A-grade candidates matched',
    description: 'Staff Engineer - Platform (REQ-2024-1188) received 2 new applications with 88%+ HiredScore. Both have 8+ years platform experience and current availability.',
    actionLabel: 'View matches',
  },
  {
    id: '3',
    type: 'risk',
    title: 'Interview slot at risk',
    description: 'Tomorrow 10:00 interview with Morgan Taylor has no confirmed panel members. Hiring manager David Lee needs to confirm attendance.',
    actionLabel: 'Notify panel',
  },
  {
    id: '4',
    type: 'success',
    title: 'Offer acceptance predicted at 87%',
    description: 'Jordan Ellis (Senior PM) is in final stage. Based on engagement signals, compensation alignment, and timeline, AI predicts high likelihood of acceptance.',
    actionLabel: 'Prepare offer',
  },
];

const MOCK_SMART_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    id: '1',
    candidateName: 'Jordan Ellis',
    jobTitle: 'Senior Product Manager',
    reqId: 'REQ-2024-1234',
    score: 94,
    reason: 'Strong PM background + Talent products expertise',
    daysInPipeline: 4,
  },
  {
    id: '2',
    candidateName: 'Morgan Lee',
    jobTitle: 'Senior Product Manager',
    reqId: 'REQ-2024-1234',
    score: 88,
    reason: 'HCM product experience + Leadership skills',
    daysInPipeline: 5,
  },
  {
    id: '3',
    candidateName: 'Alex Rivera',
    jobTitle: 'Staff Engineer — Platform',
    reqId: 'REQ-2024-1188',
    score: 92,
    reason: 'Platform architecture + Distributed systems',
    daysInPipeline: 2,
  },
];

export function RecruiterHomeV85() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  const insightIcon = (type: AiInsight['type']) => {
    switch (type) {
      case 'priority': return clockIcon;
      case 'opportunity': return rocketIcon;
      case 'risk': return exclamationCircleIcon;
      case 'success': return checkCircleIcon;
    }
  };

  const insightColor = (type: AiInsight['type']) => {
    switch (type) {
      case 'priority': return colors.blueberry500;
      case 'opportunity': return colors.greenApple600;
      case 'risk': return colors.peachSchnapps600;
      case 'success': return colors.greenApple600;
    }
  };

  return (
    <Flex style={{ height: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayLeftTabBar
        primaryItems={NAV_PRIMARY}
        secondaryTitle="Recruiting Hub"
        secondarySubtitle="Alex Morgan • Senior Recruiter"
        tabs={[{ id: 'home', label: 'Home' }]}
        activeTabId="home"
        onTabChange={() => {}}
      />

      <Flex flex={1} flexDirection="column">
        <WorkdayTopNav
          searchPlaceholder="Search candidates, jobs, people..."
          searchValue=""
          onSearchChange={() => {}}
        />

        <Box
          flex={1}
          style={{
            marginTop: WORKDAY_TOP_NAV_HEIGHT_PX,
            overflowY: 'auto',
            padding: space.xl,
          }}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="xl" flexWrap="wrap" gap="m">
            <Box>
              <Heading size="large" marginBottom="xs">
                {greeting}, Alex
              </Heading>
              <BodyText size="medium" color={colors.blackPepper500}>
                Here's what needs your attention today. AI-powered insights updated 5 minutes ago.
              </BodyText>
            </Box>
            <Flex gap="s">
              <SecondaryButton>View All Tasks</SecondaryButton>
              <SecondaryButton>Settings</SecondaryButton>
            </Flex>
          </Flex>

          <Box
            padding="l"
            marginBottom="xl"
            style={{
              backgroundColor: colors.blueberry100,
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.blueberry200}`,
              borderLeft: `4px solid ${colors.blueberry400}`,
            }}
          >
            <Flex alignItems="flex-start" gap="m">
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: colors.blueberry200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Box as="span" dangerouslySetInnerHTML={{ __html: sparkleIcon }} style={{ width: 20, height: 20, color: colors.blueberry600 }} />
              </Box>
              <Box flex={1}>
                <Heading size="small" marginBottom="xs">
                  AI Daily Briefing
                </Heading>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="s">
                  Your pipeline is healthy overall. 4 priority items need action today: 1 req needs screening, 2 candidates matched to active reqs, 1 interview at risk, and 1 offer ready to extend.
                </BodyText>
                <BodyText size="small" color={colors.blueberry600} style={{ fontSize: 12 }}>
                  Confidence: 92% • Based on pipeline velocity, candidate engagement, and historical patterns
                </BodyText>
              </Box>
            </Flex>
          </Box>

          <Flex gap="m" flexWrap="wrap" marginBottom="xl">
            <MetricCard
              label="Priority actions today"
              value="4"
              helperText="High impact tasks"
              changeIndicator={{ text: '2 completed this morning', sentiment: 'positive' }}
            />
            <MetricCard
              label="Active requisitions"
              value="38"
              helperText="Assigned to you"
              changeIndicator={{ text: '+5 this week', sentiment: 'neutral' }}
            />
            <MetricCard
              label="Candidates to review"
              value="23"
              helperText="New and needs review"
              changeIndicator={{ text: '12 reviewed today', sentiment: 'positive' }}
            />
            <MetricCard
              label="Pipeline velocity"
              value="8.2 days"
              helperText="Applied → Offer"
              changeIndicator={{ text: '-1.3 days vs. last month', sentiment: 'positive' }}
            />
          </Flex>

          <Heading size="medium" marginBottom="m">
            AI Priority Insights
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
            Actions ranked by impact and urgency. AI considers pipeline health, candidate engagement, and hiring manager expectations.
          </BodyText>
          <Flex flexDirection="column" gap="m" marginBottom="xl">
            {MOCK_AI_INSIGHTS.map((insight) => (
              <Box
                key={insight.id}
                padding="l"
                style={{
                  backgroundColor: colors.frenchVanilla100,
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: `1px solid ${colors.soap300}`,
                  borderLeft: `4px solid ${insightColor(insight.type)}`,
                }}
              >
                <Flex alignItems="flex-start" gap="m">
                  <Box
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: colors.soap100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      as="span"
                      dangerouslySetInnerHTML={{ __html: insightIcon(insight.type) }}
                      style={{ width: 20, height: 20, color: insightColor(insight.type) }}
                    />
                  </Box>
                  <Box flex={1}>
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="m" marginBottom="xs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        {insight.title}
                      </BodyText>
                      <StatusIndicator
                        type={
                          insight.type === 'risk'
                            ? StatusIndicatorType.Orange
                            : insight.type === 'success'
                            ? StatusIndicatorType.Green
                            : StatusIndicatorType.Blue
                        }
                        emphasis={StatusIndicatorEmphasis.Low}
                        label={insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                      />
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                      {insight.description}
                    </BodyText>
                    {insight.actionLabel && (
                      <TertiaryButton
                        size="small"
                        onClick={() => {
                          if (insight.actionUrl) {
                            window.location.hash = insight.actionUrl;
                          }
                        }}
                      >
                        {insight.actionLabel}
                      </TertiaryButton>
                    )}
                  </Box>
                </Flex>
              </Box>
            ))}
          </Flex>

          <Flex gap="l" alignItems="stretch" flexWrap="wrap" marginBottom="xl">
            <Box
              flex="1 1 450px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
              <Flex alignItems="center" gap="s">
                <Box
                  as="span"
                  dangerouslySetInnerHTML={{ __html: sparkleIcon }}
                  style={{ width: 20, height: 20, color: colors.blueberry500 }}
                />
                <Heading size="small">AI Candidate Recommendations</Heading>
              </Flex>
                <SecondaryButton size="small">View All</SecondaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Top candidates matched to your open reqs by HiredScore AI. Fast-track these for review.
              </BodyText>
              <Flex flexDirection="column" gap="m">
                {MOCK_SMART_RECOMMENDATIONS.map((rec) => (
                  <Box
                    key={rec.id}
                    padding="m"
                    style={{
                      backgroundColor: colors.soap100,
                      borderRadius: 8,
                      border: `1px solid ${colors.soap300}`,
                      cursor: 'pointer',
                    }}
                    tabIndex={0}
                  >
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="m" marginBottom="s">
                      <Box flex={1}>
                        <BodyText size="small" style={{ fontWeight: 700 }}>
                          {rec.candidateName}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {rec.jobTitle}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                          {rec.reqId} • {rec.daysInPipeline} days in pipeline
                        </BodyText>
                      </Box>
                      <HiredScoreGrading fit={rec.score} variant="compact" />
                    </Flex>
                    <Box
                      padding="s"
                      style={{
                        backgroundColor: colors.blueberry50,
                        borderRadius: 6,
                        borderLeft: `2px solid ${colors.blueberry300}`,
                      }}
                    >
                      <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 12 }}>
                        <Box as="span" style={{ fontWeight: 600 }}>AI Match Reason:</Box> {rec.reason}
                      </BodyText>
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Box>

            <Box
              flex="1 1 350px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                <Heading size="small">Quick Actions</Heading>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Most common actions based on your workflow. Powered by usage patterns.
              </BodyText>
              <Flex flexDirection="column" gap="s">
                {[
                  { label: 'Review new applications', count: 23, url: '/candidate-grid-v84' },
                  { label: 'Schedule interviews', count: 5 },
                  { label: 'Send candidate messages', count: 8 },
                  { label: 'Update requisition status', count: 3 },
                  { label: 'Generate pipeline report' },
                ].map((action, idx) => (
                  <Box
                    key={idx}
                    padding="m"
                    style={{
                      backgroundColor: colors.soap100,
                      borderRadius: 8,
                      border: `1px solid ${colors.soap300}`,
                      cursor: 'pointer',
                    }}
                    tabIndex={0}
                    onClick={() => {
                      if (action.url) {
                        window.location.hash = action.url;
                      }
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        {action.label}
                      </BodyText>
                      {action.count && (
                        <Box
                          style={{
                            backgroundColor: colors.blueberry500,
                            color: colors.frenchVanilla100,
                            borderRadius: 999,
                            padding: '2px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {action.count}
                        </Box>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>

          <Flex gap="l" alignItems="stretch" flexWrap="wrap" marginBottom="xl">
            <Box
              flex="1 1 400px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                <Flex alignItems="center" gap="s">
                  <Box
                    as="span"
                    dangerouslySetInnerHTML={{ __html: chartIcon }}
                    style={{ width: 20, height: 20, color: colors.greenApple600 }}
                  />
                  <Heading size="small">Pipeline Health</Heading>
                </Flex>
                <SecondaryButton size="small">View Details</SecondaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
                AI analysis of your recruiting pipeline. Green indicators show healthy progress.
              </BodyText>
              <Flex flexDirection="column" gap="m">
                {[
                  {
                    metric: 'Time-to-first-screen',
                    value: '4.8 days',
                    status: 'Healthy',
                    trend: '12% faster than target',
                    type: StatusIndicatorType.Green,
                  },
                  {
                    metric: 'Interview scheduling rate',
                    value: '76%',
                    status: 'Good',
                    trend: 'Above 70% threshold',
                    type: StatusIndicatorType.Green,
                  },
                  {
                    metric: 'Offer acceptance rate',
                    value: '82%',
                    status: 'Excellent',
                    trend: '+8% vs. last quarter',
                    type: StatusIndicatorType.Green,
                  },
                  {
                    metric: 'Candidate response rate',
                    value: '64%',
                    status: 'Needs attention',
                    trend: 'Below 70% target',
                    type: StatusIndicatorType.Orange,
                  },
                ].map((metric, idx) => (
                  <Box
                    key={idx}
                    padding="m"
                    style={{
                      backgroundColor: colors.soap100,
                      borderRadius: 8,
                      border: `1px solid ${colors.soap300}`,
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="m">
                      <Box flex={1}>
                        <BodyText size="small" style={{ fontWeight: 700 }} marginBottom="xxs">
                          {metric.metric}
                        </BodyText>
                        <Flex gap="s" alignItems="center">
                          <Heading size="small">{metric.value}</Heading>
                          <StatusIndicator
                            type={metric.type}
                            emphasis={StatusIndicatorEmphasis.Low}
                            label={metric.status}
                          />
                        </Flex>
                        <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }} marginTop="xxs">
                          {metric.trend}
                        </BodyText>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>

            <Box
              flex="1 1 350px"
              padding="l"
              style={{
                backgroundColor: colors.frenchVanilla100,
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
              }}
            >
              <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                <Heading size="small">Today's Schedule</Heading>
                <SecondaryButton size="small">Calendar</SecondaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                Upcoming interviews and meetings. AI monitors panel confirmations.
              </BodyText>
              <Flex flexDirection="column" gap="s">
                {[
                  { time: '14:00–15:00', candidate: 'Jordan Ellis', role: 'Senior PM', panel: 'Sarah Chen, Alex Morgan', status: 'Confirmed' },
                  { time: '16:30–17:15', candidate: 'Riley Patel', role: 'Group PM', panel: 'Jamie Park', status: 'Confirmed' },
                  { time: '17:30–18:00', event: 'Pipeline review with Sarah Chen', status: 'Scheduled' },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    padding="s"
                    style={{
                      borderLeft: `3px solid ${item.status === 'Confirmed' ? colors.greenApple500 : colors.blueberry400}`,
                      paddingLeft: space.s,
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="flex-start" gap="s" marginBottom="xxs">
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        {item.time}
                      </BodyText>
                      <Box
                        style={{
                          backgroundColor: item.status === 'Confirmed' ? colors.greenApple100 : colors.blueberry100,
                          color: item.status === 'Confirmed' ? colors.greenApple700 : colors.blueberry600,
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {item.status}
                      </Box>
                    </Flex>
                    {item.candidate ? (
                      <>
                        <BodyText size="small" style={{ fontWeight: 600 }}>
                          {item.candidate}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                          {item.role}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
                          Panel: {item.panel}
                        </BodyText>
                      </>
                    ) : (
                      <BodyText size="small" color={colors.blackPepper500}>
                        {item.event}
                      </BodyText>
                    )}
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>

          <Heading size="medium" marginBottom="m">
            Requisitions Needing Attention
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
            AI identified reqs with stalled pipelines or approaching deadlines. Click row to take action.
          </BodyText>
          <Box
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'hidden',
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            <Box style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.soap100 }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: colors.blackPepper600, borderBottom: `1px solid ${colors.soap300}` }}>
                      Requisition
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: colors.blackPepper600, borderBottom: `1px solid ${colors.soap300}` }}>
                      AI Alert
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: colors.blackPepper600, borderBottom: `1px solid ${colors.soap300}` }}>
                      Days Open
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: colors.blackPepper600, borderBottom: `1px solid ${colors.soap300}` }}>
                      Pipeline
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: colors.blackPepper600, borderBottom: `1px solid ${colors.soap300}` }}>
                      Top Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      title: 'Senior Product Manager',
                      reqId: 'REQ-2024-1234',
                      alert: '3 A-grade candidates waiting 18+ days',
                      alertType: 'priority' as const,
                      daysOpen: 18,
                      pipeline: '87 Applied, 12 Screening',
                      topScore: 94,
                    },
                    {
                      title: 'Staff Engineer — Platform',
                      reqId: 'REQ-2024-1188',
                      alert: 'New strong matches available',
                      alertType: 'opportunity' as const,
                      daysOpen: 32,
                      pipeline: '54 Applied, 8 Interview',
                      topScore: 88,
                    },
                    {
                      title: 'Senior UX Designer',
                      reqId: 'REQ-2024-1089',
                      alert: 'Target start date approaching (30 days)',
                      alertType: 'risk' as const,
                      daysOpen: 45,
                      pipeline: '12 Applied, 2 Offer',
                      topScore: 79,
                    },
                  ].map((req, idx) => (
                    <tr
                      key={idx}
                      style={{
                        cursor: 'pointer',
                        borderBottom: idx < 2 ? `1px solid ${colors.soap300}` : 'none',
                      }}
                      tabIndex={0}
                      onClick={() => {
                        window.location.hash = '/candidate-grid-v84';
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <BodyText size="small" style={{ fontWeight: 700, display: 'block' }}>
                          {req.title}
                        </BodyText>
                        <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12, display: 'block' }}>
                          {req.reqId}
                        </BodyText>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Flex alignItems="center" gap="xs">
                          <Box
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor:
                                req.alertType === 'priority'
                                  ? colors.blueberry500
                                  : req.alertType === 'opportunity'
                                  ? colors.greenApple600
                                  : colors.peachSchnapps600,
                            }}
                          />
                          <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13 }}>
                            {req.alert}
                          </BodyText>
                        </Flex>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <BodyText size="small">{req.daysOpen} days</BodyText>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <BodyText size="small" color={colors.blackPepper500}>
                          {req.pipeline}
                        </BodyText>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <HiredScoreGrading fit={req.topScore} variant="compact" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
