/**
 * ProfilePageLayout
 * 
 * Reusable layout component for hub-style profile pages with:
 * - Header card (avatar, title, subtitle, actions)
 * - Tab navigation via WorkdayLeftTabBar
 * - Optional CommunicationDock integration
 * 
 * Use for: Candidate profiles, worker profiles, requisition details, hiring manager views
 * 
 * **Button Pattern**: For headerActions, use SecondaryButton for both positive and negative
 * actions to ensure equal visual weight. Never use TertiaryButton for destructive actions.
 * See prop documentation for examples.
 * 
 * ## Canvas Kit Content Patterns (Profile Pages)
 * 
 * When implementing profile page content with ProfilePageLayout, always use proper Canvas Kit
 * components. NEVER use custom Box components with inline styling.
 * 
 * ### Stage/Status Display
 * Use StatusIndicator with icon for stage/status badges:
 * ```tsx
 * import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
 * import { dotIcon } from '@workday/canvas-system-icons-web';
 * 
 * <StatusIndicator
 *   type={StatusIndicator.Type.Blue}
 *   emphasis={StatusIndicator.Emphasis.Low}
 *   label="Stage: Interview"
 *   icon={dotIcon}
 * />
 * ```
 * 
 * ### Skills/Tags
 * Use StatusIndicator with Gray type for skills, tags, categories:
 * ```tsx
 * <StatusIndicator
 *   type={StatusIndicator.Type.Gray}
 *   emphasis={StatusIndicator.Emphasis.Low}
 *   label="Figma"
 * />
 * ```
 * 
 * ### Communication Channel Selector (Current Implementation)
 * Use SecondaryButton with state-based styling for channel toggles:
 * ```tsx
 * <Flex gap="s">
 *   <SecondaryButton 
 *     size="small" 
 *     onClick={() => setChannel('whatsapp')}
 *     style={channel === 'whatsapp' ? { 
 *       backgroundColor: colors.blueberry400, 
 *       color: colors.frenchVanilla100 
 *     } : undefined}
 *   >
 *     WhatsApp
 *   </SecondaryButton>
 *   <SecondaryButton 
 *     size="small" 
 *     onClick={() => setChannel('email')}
 *     style={channel === 'email' ? { 
 *       backgroundColor: colors.blueberry400, 
 *       color: colors.frenchVanilla100 
 *     } : undefined}
 *   >
 *     Email
 *   </SecondaryButton>
 * </Flex>
 * ```
 * 
 * **Future pattern**: SegmentedControl from Canvas Kit Preview (requires model-based API integration).
 * See design/README.md for SegmentedControl guidance when upgrading.
 * 
 * ### Anti-Patterns to Avoid
 * ❌ Custom Box with inline styling for badges/chips
 * ❌ TertiaryButton for destructive actions  
 * ❌ Plain div elements for status indicators
 * ❌ Hardcoded colors instead of Canvas Kit tokens
 */

import { ReactNode } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { space } from '@workday/canvas-kit-react/tokens';

import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  CommunicationDock,
  DEFAULT_COMM_RAIL_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
} from './index';

import { cardStyle } from './profileHelpers';

export interface ProfileTab {
  id: string;
  label: string;
}

export interface CommunicationDockConfig {
  /** Array of channel identifiers (e.g., ['whatsapp', 'email']) */
  channels: string[];
  /** Currently active channel (null if closed) */
  activeChannel: string | null;
  /** Callback when channel changes */
  onChannelChange: (channel: string | null) => void;
  /** Render function for communication panel based on active channel */
  renderPanel: (activeChannel: string) => ReactNode;
  /** Render function for communication rail buttons */
  renderRail: () => ReactNode;
  /** Optional expanded width override per channel */
  getExpandedWidth?: (channel: string) => number;
}

export interface ProfilePageLayoutProps {
  // Top navigation
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Header card
  avatar: ReactNode;
  name: string;
  subtitle: string;
  /**
   * Action buttons displayed in the profile header card
   * 
   * **Button Hierarchy Patterns:**
   * 
   * **Equal weight (recommended for paired actions):**
   * ```tsx
   * headerActions={[
   *   <SecondaryButton size="small">Move forward</SecondaryButton>,
   *   <SecondaryButton size="small">Reject</SecondaryButton>
   * ]}
   * ```
   * 
   * **Emphasized positive action:**
   * ```tsx
   * headerActions={[
   *   <PrimaryButton size="small">Move forward</PrimaryButton>,
   *   <SecondaryButton size="small">Reject</SecondaryButton>
   * ]}
   * ```
   * 
   * **NEVER use TertiaryButton for destructive actions** - it appears as a text link,
   * too casual for important negative actions like "Reject". Always use SecondaryButton
   * for negative/destructive actions to ensure proper visual weight and accessibility.
   * 
   * @example
   * // ✅ CORRECT
   * <SecondaryButton>Reject</SecondaryButton>
   * 
   * // ❌ WRONG
   * <TertiaryButton>Reject</TertiaryButton>
   */
  headerActions?: ReactNode[];

  // Tab navigation
  tabs: ProfileTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  secondaryTitle?: string; // e.g., "Candidate", "Worker", "Requisition"
  showSecondaryTitleIcon?: boolean;

  // Tab content
  renderTabContent: (tabId: string) => ReactNode;

  // Communication dock (optional)
  communicationDock?: CommunicationDockConfig;

  // Footer disclaimer (optional)
  footerDisclaimer?: string;
}

export const ProfilePageLayout: React.FC<ProfilePageLayoutProps> = ({
  searchValue = '',
  onSearchChange = () => {},
  avatar,
  name,
  subtitle,
  headerActions = [],
  tabs,
  activeTabId,
  onTabChange,
  secondaryTitle,
  showSecondaryTitleIcon = false,
  renderTabContent,
  communicationDock,
  footerDisclaimer,
}) => {
  const railReserve = communicationDock ? DEFAULT_COMM_RAIL_PX : 0;
  const messagingOpen = communicationDock ? communicationDock.activeChannel !== null : false;

  return (
    <Box style={{ position: 'relative', minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav searchValue={searchValue} onSearchChange={onSearchChange} />

      <Flex style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <WorkdayLeftTabBar
          fillHeight
          showSecondaryTitleIcon={showSecondaryTitleIcon}
          secondaryTitle={secondaryTitle || 'Profile'}
          secondarySubtitle={name}
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={onTabChange}
          aria-label={`${secondaryTitle || 'Profile'} sections`}
        />

        <Box
          flex={1}
          minWidth={0}
          padding="l"
          style={{
            paddingRight: `calc(${space.l} + ${railReserve}px)`,
            overflow: 'auto',
            borderTopLeftRadius: SANA_SHELL_RADIUS,
            marginTop: 0,
            backgroundColor: SANA_PAGE_CANVAS,
          }}
        >
          {/* Header Card */}
          <Card
            padding="l"
            marginBottom="l"
            style={{
              ...cardStyle(),
              boxShadow: SANA_CARD_SHADOW,
            }}
          >
            <Flex alignItems="flex-start" gap="m" flexWrap="wrap">
              {avatar}
              <Box flex="1" minWidth={200}>
                <Heading size="large" marginBottom="xs">
                  {name}
                </Heading>
                <BodyText size="small" color="blackPepper600" marginBottom="m">
                  {subtitle}
                </BodyText>
                {headerActions.length > 0 && (
                  <Flex gap="s" flexWrap="wrap">
                    {headerActions}
                  </Flex>
                )}
              </Box>
            </Flex>
          </Card>

          {/* Tab Content */}
          {renderTabContent(activeTabId)}

          {/* Footer Disclaimer */}
          {footerDisclaimer && (
            <Box marginTop="xl" paddingBottom="l">
              <BodyText size="small" color="blackPepper500">
                {footerDisclaimer}
              </BodyText>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Communication Dock (optional) */}
      {communicationDock && (
        <CommunicationDock
          headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
          expanded={messagingOpen}
          railWidthPx={DEFAULT_COMM_RAIL_PX}
          expandedWidthPx={
            communicationDock.activeChannel && communicationDock.getExpandedWidth
              ? communicationDock.getExpandedWidth(communicationDock.activeChannel)
              : undefined
          }
          panel={
            communicationDock.activeChannel
              ? communicationDock.renderPanel(communicationDock.activeChannel)
              : null
          }
          rail={communicationDock.renderRail()}
        />
      )}
    </Box>
  );
};
