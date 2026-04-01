/**
 * CandidateHomeLayout
 * 
 * Full-page candidate home with blue header, two-column layout (tasks + applications in main, widgets in sidebar)
 * 
 * Use for: Candidate portal home screens, task management interfaces
 * 
 * **Pattern**: Data-driven layout with customizable tasks, applications, and sidebar widgets
 */

import { ReactNode } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator, StatusIndicatorType } from '@workday/canvas-kit-react/status-indicator';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { colors } from '@workday/canvas-kit-react/tokens';

import {
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_SHADOW,
  SANA_CARD_RADIUS_LG,
  cardStyle,
} from './index';

export interface CandidateTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'completed';
  onAction: () => void;
  actionLabel?: string;
  completedLabel?: string;
  /** Optional: Show a "View" button for completed tasks */
  onView?: () => void;
}

export interface CandidateApplication {
  id: string;
  jobTitle: string;
  reqNumber: string;
  location: string;
  status: 'active' | 'inactive';
  statusLabel: string;
  statusType?: StatusIndicatorType;
  appliedDate: string;
}

export interface SidebarWidget {
  id: string;
  title: string;
  content: ReactNode;
}

export interface CandidateHomeLayoutProps {
  userName: string;
  userSubtitle: string;
  tasks: CandidateTask[];
  applications: CandidateApplication[];
  sidebarWidgets: SidebarWidget[];
}

function shellCardStyle() {
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
        color: colors.blueberry400,
        fontSize: 14,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      {children}
    </a>
  );
}

export const CandidateHomeLayout: React.FC<CandidateHomeLayoutProps> = ({
  userName,
  userSubtitle,
  tasks,
  applications,
  sidebarWidgets,
}) => {
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeApplications = applications.filter(a => a.status === 'active');
  const inactiveApplications = applications.filter(a => a.status === 'inactive');

  return (
    <Flex flexDirection="column" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`, backgroundColor: SANA_PAGE_CANVAS }}>
      <Box padding="xl" style={{ backgroundColor: colors.blueberry500, color: colors.frenchVanilla100 }}>
        <Heading size="large" color="inherit">{userName}</Heading>
        <BodyText size="medium" color="inherit">{userSubtitle}</BodyText>
      </Box>
      <Box padding="l" flex={1}>
        <Flex gap="l" alignItems="flex-start" flexWrap="wrap">
          {/* Main Column */}
          <Flex flexDirection="column" gap="l" flex={2} minWidth={400}>
            <Card padding="l" style={shellCardStyle()}>
              <Heading size="medium" marginBottom="m">My Tasks</Heading>
              <Tabs initialTab={todoTasks.length > 0 ? 'todo' : 'completed'}>
                <Tabs.List marginBottom="m">
                  <Tabs.Item data-id="todo">To Do</Tabs.Item>
                  <Tabs.Item data-id="completed">Completed</Tabs.Item>
                </Tabs.List>
                <Tabs.Panel data-id="todo">
                  {todoTasks.length > 0 ? (
                    <Flex flexDirection="column" gap="s">
                      {todoTasks.map(task => (
                        <Flex key={task.id} alignItems="center" justifyContent="space-between" padding="m" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                          <Box>
                            <Heading size="small" marginBottom="xxs">{task.title}</Heading>
                            <BodyText size="small" color="blackPepper600">{task.description}</BodyText>
                          </Box>
                          <PrimaryButton onClick={task.onAction}>{task.actionLabel || 'Start'}</PrimaryButton>
                        </Flex>
                      ))}
                    </Flex>
                  ) : (
                    <BodyText size="medium" color="blackPepper600">You have no pending tasks.</BodyText>
                  )}
                </Tabs.Panel>
                <Tabs.Panel data-id="completed">
                  {completedTasks.length > 0 ? (
                    <Flex flexDirection="column" gap="s">
                      {completedTasks.map(task => (
                        <Flex key={task.id} alignItems="center" justifyContent="space-between" padding="m" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                          <Box>
                            <Heading size="small" marginBottom="xxs">{task.title}</Heading>
                            <BodyText size="small" color="blackPepper600">{task.description}</BodyText>
                          </Box>
                          <Flex gap="s" alignItems="center">
                            <StatusIndicator 
                              type={StatusIndicator.Type.Green} 
                              emphasis={StatusIndicator.Emphasis.Low} 
                              label={task.completedLabel || 'Completed'} 
                            />
                            {task.onView && (
                              <SecondaryButton size="small" onClick={task.onView}>View</SecondaryButton>
                            )}
                          </Flex>
                        </Flex>
                      ))}
                    </Flex>
                  ) : (
                    <BodyText size="medium" color="blackPepper600">You have no completed tasks.</BodyText>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Card>

            <Card padding="l" style={shellCardStyle()}>
              <Heading size="medium" marginBottom="m">My Applications</Heading>
              <Tabs initialTab="active">
                <Tabs.List marginBottom="m">
                  <Tabs.Item data-id="active">Active</Tabs.Item>
                  <Tabs.Item data-id="inactive">Inactive</Tabs.Item>
                </Tabs.List>
                <Tabs.Panel data-id="active">
                  {activeApplications.length > 0 ? (
                    <Flex flexDirection="column" gap="s">
                      {activeApplications.map(app => (
                        <Box key={app.id} padding="m" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="xs">
                            <Heading size="small">{app.jobTitle}</Heading>
                            <StatusIndicator 
                              type={app.statusType || StatusIndicator.Type.Blue} 
                              emphasis={StatusIndicator.Emphasis.Low} 
                              label={app.statusLabel} 
                            />
                          </Flex>
                          <BodyText size="small" color="blackPepper600" marginBottom="xs">{app.reqNumber} · {app.location}</BodyText>
                          <BodyText size="small" color="blackPepper500">Applied: {app.appliedDate}</BodyText>
                        </Box>
                      ))}
                    </Flex>
                  ) : (
                    <BodyText size="medium" color="blackPepper600">You have no active applications.</BodyText>
                  )}
                </Tabs.Panel>
                <Tabs.Panel data-id="inactive">
                  {inactiveApplications.length > 0 ? (
                    <Flex flexDirection="column" gap="s">
                      {inactiveApplications.map(app => (
                        <Box key={app.id} padding="m" style={{ border: `1px solid ${colors.soap300}`, borderRadius: 8 }}>
                          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="xs">
                            <Heading size="small">{app.jobTitle}</Heading>
                            <StatusIndicator 
                              type={app.statusType || StatusIndicator.Type.Gray} 
                              emphasis={StatusIndicator.Emphasis.Low} 
                              label={app.statusLabel} 
                            />
                          </Flex>
                          <BodyText size="small" color="blackPepper600" marginBottom="xs">{app.reqNumber} · {app.location}</BodyText>
                          <BodyText size="small" color="blackPepper500">Applied: {app.appliedDate}</BodyText>
                        </Box>
                      ))}
                    </Flex>
                  ) : (
                    <BodyText size="medium" color="blackPepper600">You have no inactive applications.</BodyText>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Flex>

          {/* Sidebar */}
          <Flex flexDirection="column" gap="l" flex={1} minWidth={300}>
            {sidebarWidgets.map(widget => (
              <Card key={widget.id} padding="l" style={shellCardStyle()}>
                <Heading size="small" marginBottom="m">{widget.title}</Heading>
                {widget.content}
              </Card>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
