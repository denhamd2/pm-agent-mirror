import React, { type ReactNode } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
} from '@workday/canvas-system-icons-web';
import {
  SANA_PRIMARY_RAIL_WIDTH_PX,
  SANA_SECONDARY_NAV_WIDTH_PX,
  SANA_TAB_PILL_RADIUS,
  SANA_PRIMARY_RAIL_BG,
  SANA_SECONDARY_NAV_BG,
  SANA_SECONDARY_TAB_ACTIVE_BG,
  SANA_SECONDARY_TAB_INACTIVE_FG,
  SANA_SECONDARY_TAB_ACTIVE_FG,
  SANA_LINK_ACCENT,
} from './sanaShellTheme';

const SECONDARY_HEADER_RULE = '1px solid rgba(15, 46, 102, 0.08)';

const focusRing = (el: HTMLButtonElement, on: boolean) => {
  if (on) {
    el.style.outline = `2px solid ${SANA_LINK_ACCENT}`;
    el.style.outlineOffset = '2px';
  } else {
    el.style.outline = 'none';
    el.style.outlineOffset = '0';
  }
};

export const WORKDAY_LEFT_TAB_BAR_PRIMARY_PX = SANA_PRIMARY_RAIL_WIDTH_PX;
export const WORKDAY_LEFT_TAB_BAR_SECONDARY_PX = SANA_SECONDARY_NAV_WIDTH_PX;

export interface WorkdayLeftTabItem {
  id: string;
  label: string;
}

type CanvasIcon = NonNullable<React.ComponentProps<typeof SystemIcon>['icon']>;

export interface WorkdayLeftTabBarPrimaryItem {
  icon: CanvasIcon;
  ariaLabel: string;
  /** Short label under icon (shown uppercase; Sana reference rail) */
  railLabel: string;
  onClick?: () => void;
}

export interface WorkdayLeftTabBarProps {
  /** Vertical icon rail with stacked labels (defaults: Home, Personal, Org, Links, More) */
  primaryItems?: WorkdayLeftTabBarPrimaryItem[];
  primaryWidthPx?: number;
  secondaryWidthPx?: number;
  secondaryTitle: string;
  secondarySubtitle?: string;
  /** e.g. Actions button row aligned with title */
  headerActions?: ReactNode;
  /** Content between header and tab list (e.g. quick contact chips) */
  belowHeader?: ReactNode;
  /** Show person icon beside secondary title (Sana profile / hub header) */
  showSecondaryTitleIcon?: boolean;
  tabs: WorkdayLeftTabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  /** Stretch to fill parent height (typical under top nav) */
  fillHeight?: boolean;
  'aria-label'?: string;
}

const DEFAULT_PRIMARY: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'Home' },
  { icon: userIcon, ariaLabel: 'Personal', railLabel: 'Personal' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

/**
 * Sana-style primary rail: outlined icon + uppercase micro-label (not link-styled).
 */
function PrimaryRailItem({
  icon,
  railLabel,
  ariaLabel,
  onClick,
}: {
  icon: CanvasIcon;
  railLabel: string;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        width: '100%',
        padding: '6px 2px 8px',
        border: 'none',
        background: 'transparent',
        borderRadius: SANA_TAB_PILL_RADIUS,
        cursor: 'pointer',
        WebkitAppearance: 'none' as const,
        appearance: 'none' as const,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.soap300;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onFocus={(e) => focusRing(e.currentTarget, true)}
      onBlur={(e) => focusRing(e.currentTarget, false)}
    >
      <SystemIcon icon={icon} size={20} color={colors.blackPepper600} />
      <span
        style={{
          fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: colors.blackPepper500,
          textTransform: 'uppercase',
          lineHeight: 1,
          textAlign: 'center',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        {railLabel}
      </span>
    </button>
  );
}

/**
 * Reusable two-column left shell: labelled icon rail (Sana) + neutral section tabs.
 * Pair with `WorkdayTopNav`.
 */
export const WorkdayLeftTabBar: React.FC<WorkdayLeftTabBarProps> = ({
  primaryItems = DEFAULT_PRIMARY,
  primaryWidthPx = SANA_PRIMARY_RAIL_WIDTH_PX,
  secondaryWidthPx = SANA_SECONDARY_NAV_WIDTH_PX,
  secondaryTitle,
  secondarySubtitle,
  headerActions,
  belowHeader,
  showSecondaryTitleIcon = false,
  tabs,
  activeTabId,
  onTabChange,
  fillHeight = true,
  'aria-label': ariaLabel = 'Primary navigation',
}) => {
  return (
    <Flex
      alignItems="stretch"
      style={{
        flexShrink: 0,
        minHeight: fillHeight ? 0 : undefined,
        alignSelf: fillHeight ? 'stretch' : undefined,
      }}
      aria-label={ariaLabel}
    >
      <Flex
        flexDirection="column"
        alignItems="stretch"
        paddingY="xs"
        gap="xxs"
        style={{
          width: primaryWidthPx,
          backgroundColor: SANA_PRIMARY_RAIL_BG,
        }}
      >
        {primaryItems.map(({ icon, ariaLabel: al, railLabel, onClick }) => (
          <PrimaryRailItem key={al} icon={icon} railLabel={railLabel} ariaLabel={al} onClick={onClick} />
        ))}
      </Flex>

      <Box
        style={{
          width: secondaryWidthPx,
          flexShrink: 0,
          backgroundColor: SANA_SECONDARY_NAV_BG,
          borderRight: `1px solid ${colors.soap300}`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: fillHeight ? '100%' : undefined,
        }}
      >
        <Box padding="m" paddingBottom="s" borderBottom={SECONDARY_HEADER_RULE}>
          <Flex justifyContent="space-between" alignItems="flex-start" gap="s">
            <Box style={{ minWidth: 0 }}>
              <Flex alignItems="center" gap="xs">
                {showSecondaryTitleIcon ? (
                  <SystemIcon icon={userIcon} size={18} color={SANA_SECONDARY_TAB_ACTIVE_FG} aria-hidden />
                ) : null}
                <Heading
                  as="h2"
                  size="small"
                  marginY="zero"
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    color: SANA_SECONDARY_TAB_ACTIVE_FG,
                  }}
                >
                  {secondaryTitle}
                </Heading>
              </Flex>
              {secondarySubtitle ? (
                <BodyText
                  size="small"
                  marginTop="xxs"
                  style={{
                    lineHeight: 1.45,
                    fontSize: 12,
                    fontWeight: 400,
                    color: SANA_SECONDARY_TAB_INACTIVE_FG,
                    paddingLeft: showSecondaryTitleIcon ? 26 : 0,
                  }}
                >
                  {secondarySubtitle}
                </BodyText>
              ) : null}
            </Box>
            {headerActions ? <Box flexShrink={0}>{headerActions}</Box> : null}
          </Flex>
          {belowHeader ? <Box marginTop="s">{belowHeader}</Box> : null}
        </Box>

        <Flex
          as="nav"
          aria-label="Section navigation"
          flexDirection="column"
          paddingX="m"
          paddingY="m"
          gap="xxs"
          style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}
        >
          {tabs.map((tab) => {
            const active = tab.id === activeTabId;
            return (
              <Box
                key={tab.id}
                as="button"
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  border: 'none',
                  borderRadius: SANA_TAB_PILL_RADIUS,
                  backgroundColor: active ? SANA_SECONDARY_TAB_ACTIVE_BG : 'transparent',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  WebkitAppearance: 'none' as const,
                  appearance: 'none' as const,
                  minHeight: 36,
                  boxSizing: 'border-box',
                  display: 'block',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onFocus={(e) => focusRing(e.currentTarget, true)}
                onBlur={(e) => focusRing(e.currentTarget, false)}
              >
                <span
                  style={{
                    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 13,
                    lineHeight: 1.4,
                    fontWeight: active ? 700 : 400,
                    color: active ? SANA_SECONDARY_TAB_ACTIVE_FG : SANA_SECONDARY_TAB_INACTIVE_FG,
                    letterSpacing: active ? '-0.01em' : '0',
                  }}
                >
                  {tab.label}
                </span>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Flex>
  );
};
