import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Table } from '@workday/canvas-kit-react/table';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { space, colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import {
  plusIcon,
  searchIcon,
  sparkleIcon,
  chevronRightIcon,
  calendarIcon,
  sendIcon,
  documentIcon,
  videoIcon,
  phoneIcon,
  justifyIcon,
} from '@workday/canvas-system-icons-web';

/**
 * Recruiter Hub - Multi-page prototype demonstrating Workday Recruiting UI patterns
 * 
 * This prototype demonstrates:
 * - Multi-page navigation (Dashboard, Active Reqs, Candidates)
 * - Workday top navigation pattern (extracted from Figma reference)
 * - Canvas Kit v11 components with design tokens
 * - State-based routing for prototype
 * 
 * Design Reference: 2-Way Email Recruiting Figma (HpAOHGAeXBORpHnyhsCMja)
 * Tokens documented in: /design/workday-design-tokens.md
 */

interface RecruiterHubProps {
  recruiterName: string;
}

export const RecruiterHub: React.FC<RecruiterHubProps> = ({ recruiterName }) => {
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  // Multi-page navigation state
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'reqs' | 'candidates'>('dashboard');

  return (
    <Box>
      {/* Top Navigation - Pattern from Figma reference */}
      <Box
        paddingX="l"
        paddingY="s"
        style={{
          backgroundColor: 'white', // TODO: Extract from Figma (2-Way Email file) if custom
          borderBottom: `1px solid ${colors.soap300}`, // Figma token: [Border Color] → Canvas Kit: colors.soap300
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap="l">
          {/* Left section: Hamburger + Logo */}
          <Flex alignItems="center" gap="m" flex="0 0 auto">
            <ToolbarIconButton
              icon={justifyIcon}
              aria-label="Menu"
            />
            <Box
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.blueberry500, // Figma token: [Primary Brand] → Canvas Kit: colors.blueberry500
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              Workday
            </Box>
          </Flex>

          {/* Center section: Search bar */}
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
              style={{
                width: '100%',
                backgroundColor: colors.soap100,
                border: `1px solid ${colors.soap300}`,
                borderRadius: 4,
                padding: '8px 12px 8px 36px',
              }}
            />
          </Box>

          {/* Right section: Avatar */}
          <Flex alignItems="center" gap="m" flex="0 0 auto">
            <Avatar size={32} altText={recruiterName} as="div" />
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box padding="xl" backgroundColor={colors.soap100}>
      {/* Page Header */}
      <Flex justifyContent="space-between" alignItems="center" marginBottom="xl">
        <Box>
          <Heading size="large">Welcome back, {recruiterName}</Heading>
          <BodyText size="small">Tuesday, March 18, 2026</BodyText>
        </Box>
        <Flex gap="s">
          <SecondaryButton>Settings</SecondaryButton>
          <PrimaryButton icon={plusIcon} iconPosition="start">
            Post job
          </PrimaryButton>
        </Flex>
      </Flex>

      {/* AI Insight Banner */}
      <Card
        padding="m"
        marginBottom="xl"
        style={{
          borderLeft: `4px solid ${colors.blueberry500}`,
          backgroundColor: colors.blueberry100,
        }}
      >
      <Flex alignItems="center" gap="s">
        <SystemIcon icon={sparkleIcon} size={24} />
        <BodyText size="medium">
          <strong>AI Insight:</strong> 3 requisitions are at risk of exceeding time-to-fill
          targets. Review pipeline health and consider activating HiredScore screening.
        </BodyText>
      </Flex>
      </Card>

      {/* Metrics */}
      <Flex gap="l" marginBottom="xl" flexWrap="wrap">
        <MetricCard title="Active requisitions" value="24" trend="+3 this week" />
        <MetricCard title="Candidates in pipeline" value="187" trend="+12% vs last month" />
        <MetricCard title="Avg time-to-fill" value="28 days" trend="-5 days vs target" />
        <MetricCard title="Interviews this week" value="16" trend="3 today" />
      </Flex>

      {/* Tabs */}
      <Tabs initialTab="overview">
        <Tabs.List marginBottom="l">
          <Tabs.Item data-id="overview">Overview</Tabs.Item>
          <Tabs.Item data-id="pipeline">Pipeline</Tabs.Item>
          <Tabs.Item data-id="insights">Insights</Tabs.Item>
        </Tabs.List>

        <Tabs.Panel data-id="overview">
          {/* Two Column Layout */}
          <Flex gap="l" flexWrap="wrap">
            {/* Left Column */}
            <Box flex="1 1 60%" minWidth={400}>
              {/* Quick Actions */}
              <Card padding="l" marginBottom="l">
                <Heading size="small" marginBottom="m">
                  Quick actions
                </Heading>
                <Flex gap="s" flexWrap="wrap">
                  <SecondaryButton icon={searchIcon} iconPosition="start" size="small">
                    Review candidates
                  </SecondaryButton>
                  <SecondaryButton icon={calendarIcon} iconPosition="start" size="small">
                    Schedule interview
                  </SecondaryButton>
                  <SecondaryButton icon={sendIcon} iconPosition="start" size="small">
                    Send offer
                  </SecondaryButton>
                  <SecondaryButton icon={documentIcon} iconPosition="start" size="small">
                    Generate report
                  </SecondaryButton>
                </Flex>
              </Card>

              {/* Active Requisitions Table */}
              <Card padding="l" marginBottom="l">
                <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                  <Heading size="small">Active requisitions</Heading>
                  <TertiaryButton icon={chevronRightIcon} iconPosition="end" size="small">
                    View all
                  </TertiaryButton>
                </Flex>

                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Job title</Table.Header>
                      <Table.Header>Location</Table.Header>
                      <Table.Header>Status</Table.Header>
                      <Table.Header>Candidates</Table.Header>
                      <Table.Header>Days open</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small" fontWeight="bold">
                          Senior Product Manager
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>Pleasanton, CA</Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant="success">Active</StatusBadge>
                      </Table.Cell>
                      <Table.Cell>12</Table.Cell>
                      <Table.Cell>18</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small" fontWeight="bold">
                          Software Engineer II
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>Boulder, CO</Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant="success">Active</StatusBadge>
                      </Table.Cell>
                      <Table.Cell>23</Table.Cell>
                      <Table.Cell>12</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small" fontWeight="bold">
                          UX Designer
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>Dublin, Ireland</Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant="warning">At risk</StatusBadge>
                      </Table.Cell>
                      <Table.Cell>5</Table.Cell>
                      <Table.Cell style={{ color: colors.cinnamon600 }}>42</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <BodyText size="small" fontWeight="bold">
                          Data Analyst
                        </BodyText>
                      </Table.Cell>
                      <Table.Cell>Remote</Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant="success">Active</StatusBadge>
                      </Table.Cell>
                      <Table.Cell>31</Table.Cell>
                      <Table.Cell>8</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Card>

              {/* Candidate Queue */}
              <Card padding="l">
                <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
                  <Heading size="small">Candidates awaiting review</Heading>
                  <Box
                    padding="xxs"
                    style={{
                      background: colors.cinnamon500,
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 12,
                      minWidth: 20,
                      textAlign: 'center',
                    }}
                  >
                    8
                  </Box>
                </Flex>

                <CandidateRow name="Sarah Chen" position="Senior Product Manager" match={94} />
                <CandidateRow name="Marcus Johnson" position="Software Engineer II" match={89} />
                <CandidateRow name="Priya Sharma" position="UX Designer" match={91} />

                <Box marginTop="m" style={{ textAlign: 'center' }}>
                  <TertiaryButton size="small">View all 8 candidates</TertiaryButton>
                </Box>
              </Card>
            </Box>

            {/* Right Column */}
            <Box flex="1 1 35%" minWidth={300}>
              {/* AI Recommendations */}
              <Card padding="l" marginBottom="l">
                <Flex alignItems="center" gap="xs" marginBottom="m">
                  <SystemIcon icon={sparkleIcon} size={16} />
                  <Heading size="small">AI recommendations</Heading>
                </Flex>

                <AIRecommendation
                  title="Activate HiredScore for UX Designer"
                  description="94% of qualified candidates are screened out manually."
                  priority="high"
                />
                <AIRecommendation
                  title="Extend Data Analyst search"
                  description="31 candidates but low match scores."
                  priority="medium"
                />
                <AIRecommendation
                  title="Schedule Paradox interviews"
                  description="12 Senior PM candidates ready for screening."
                  priority="medium"
                />
              </Card>

              {/* Upcoming Interviews */}
              <Card padding="l" marginBottom="l">
                <Heading size="small" marginBottom="m">
                  Upcoming interviews
                </Heading>

                <InterviewRow time="10:00 AM" candidate="Sarah Chen" type="phone" />
                <InterviewRow time="2:30 PM" candidate="Marcus Johnson" type="video" />
                <InterviewRow time="4:00 PM" candidate="David Kim" type="video" />
              </Card>

              {/* Team Activity */}
              <Card padding="l">
                <Heading size="small" marginBottom="m">
                  Team activity
                </Heading>

                <ActivityRow user="Alex Rivera" action="scheduled interview" time="15 min ago" />
                <ActivityRow user="Emily Watson" action="posted job" time="1 hour ago" />
                <ActivityRow user="James Park" action="sent offer" time="2 hours ago" />
              </Card>
            </Box>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel data-id="pipeline">
          <Box padding="l">
            <Heading size="medium">Pipeline view coming soon...</Heading>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel data-id="insights">
          <Box padding="l">
            <Heading size="medium">Insights view coming soon...</Heading>
          </Box>
        </Tabs.Panel>
      </Tabs>
      </Box>
    </Box>
  );
};

// Supporting Components

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: string;
}> = ({ title, value, trend }) => (
  <Card padding="l" flex="1 1 200px">
    <BodyText size="small" color={colors.blackPepper400}>
      {title}
    </BodyText>
    <Heading size="large" marginTop="xs" marginBottom="xs">
      {value}
    </Heading>
    <BodyText size="small" color={colors.greenApple600}>
      {trend}
    </BodyText>
  </Card>
);

const StatusBadge: React.FC<{ variant: 'success' | 'warning'; children: React.ReactNode }> = ({
  variant,
  children,
}) => (
  <Box
    as="span"
    padding="xxs"
    style={{
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
      background: variant === 'success' ? colors.greenApple100 : colors.cantaloupe100,
      color: variant === 'success' ? colors.greenApple600 : colors.cantaloupe600,
    }}
  >
    {children}
  </Box>
);

const CandidateRow: React.FC<{
  name: string;
  position: string;
  match: number;
}> = ({ name, position, match }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    padding="s"
    marginBottom="s"
    style={{ borderBottom: `1px solid ${colors.soap300}` }}
  >
    <Flex alignItems="center" gap="s">
      <Avatar size={32} altText={name} as="div" />
      <Box>
        <BodyText size="small" fontWeight="bold">
          {name}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper400}>
          {position}
        </BodyText>
      </Box>
    </Flex>
    <Flex alignItems="center" gap="m">
      <Flex alignItems="center" gap="xxs">
        <SystemIcon icon={sparkleIcon} size={14} />
        <BodyText size="small" fontWeight="bold" color={colors.greenApple600}>
          {match}%
        </BodyText>
      </Flex>
      <SecondaryButton size="small">Review</SecondaryButton>
    </Flex>
  </Flex>
);

const AIRecommendation: React.FC<{
  title: string;
  description: string;
  priority: 'high' | 'medium';
}> = ({ title, description, priority }) => (
  <Box
    padding="s"
    marginBottom="s"
    style={{
      backgroundColor: priority === 'high' ? colors.cantaloupe100 : colors.soap100,
      borderLeft: `3px solid ${priority === 'high' ? colors.cinnamon500 : colors.blueberry400}`,
      borderRadius: 4,
    }}
  >
    <BodyText size="small" fontWeight="bold">
      {title}
    </BodyText>
    <BodyText size="small" color={colors.blackPepper400} marginTop="xxs">
      {description}
    </BodyText>
    <TertiaryButton size="small" icon={chevronRightIcon} iconPosition="end" marginTop="xs">
      Take action
    </TertiaryButton>
  </Box>
);

const InterviewRow: React.FC<{
  time: string;
  candidate: string;
  type: 'phone' | 'video';
}> = ({ time, candidate, type }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    padding="s"
    marginBottom="s"
    style={{ borderBottom: `1px solid ${colors.soap300}` }}
  >
    <Box>
      <BodyText size="small" fontWeight="bold">
        {time}
      </BodyText>
      <BodyText size="small" color={colors.blackPepper400}>
        {candidate}
      </BodyText>
    </Box>
    <SystemIcon icon={type === 'phone' ? phoneIcon : videoIcon} size={16} />
  </Flex>
);

const ActivityRow: React.FC<{
  user: string;
  action: string;
  time: string;
}> = ({ user, action, time }) => (
  <Box padding="s" marginBottom="s" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
    <BodyText size="small">
      <strong>{user}</strong> {action}
    </BodyText>
    <BodyText size="small" color={colors.blackPepper400}>
      {time}
    </BodyText>
  </Box>
);

export default RecruiterHub;
