import React, { type ReactNode } from 'react';
import { ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { CountBadge } from '@workday/canvas-kit-react/badge';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { InputGroup } from '@workday/canvas-kit-react/text-input';
import {
  justifyIcon,
  searchIcon,
  speechBubbleIcon,
  inboxIcon,
  notificationsIcon,
  questionOutlineIcon,
  gridViewIcon,
  rotateIcon,
} from '@workday/canvas-system-icons-web';
import { SANA_LINK_ACCENT, SANA_TOP_NAV_BG, SANA_SEARCH_FIELD_BG } from './sanaShellTheme';

export const WORKDAY_TOP_NAV_HEIGHT_PX = 56;

/**
 * Workday W-mark: White circle with bold W and signature orange swoosh
 * (Simplified app mark for prototypes)
 */
export const WorkdayWMark: React.FC<{ size?: number }> = ({ size = 36 }) => {
  const scale = size / 36;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-label="Workday" role="img">
      {/* White background circle */}
      <circle cx={18} cy={18} r={17} fill="#FFFFFF" />
      {/* Orange swoosh above the W */}
      <path
        d="M 10 12 Q 18 8 28 13"
        fill="none"
        stroke="#F38B00"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Navy W */}
      <text
        x={18}
        y={21}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          fill: '#0F2E66',
        }}
      >
        W
      </text>
      {/* Subtle border */}
      <circle cx={18} cy={18} r={17} fill="none" stroke="#E6E8EA" strokeWidth={0.5} />
    </svg>
  );
};

function parseBadgeCount(value: string | number | undefined): number | null {
  if (value === undefined || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function IconWithCountBadge({
  children,
  count,
}: {
  children: ReactNode;
  count: string | number | undefined;
}) {
  const n = parseBadgeCount(count);
  if (n === null) {
    return <>{children}</>;
  }
  return (
    <Box
      position="relative"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
      <Box position="absolute" style={{ top: -2, right: -2, pointerEvents: 'none', lineHeight: 0 }}>
        <CountBadge count={n} limit={1000} />
      </Box>
    </Box>
  );
}

export interface WorkdayTopNavProps {
  /** Shown after optional MENU wordmark (e.g. tenant name) */
  tenantLabel?: string;
  /** Show hamburger + "MENU" label; set false for W-mark chrome */
  showMenuWordmark?: boolean;
  /** Replace MENU + tenant with circular W mark */
  showWMark?: boolean;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Badge on the notifications bell (numeric → Canvas Kit CountBadge) */
  notificationBadge?: string | number;
  /** Separate inbox badge */
  inboxBadge?: string | number;
  /** Refresh + grid icons before messaging cluster */
  showLayoutUtilities?: boolean;
  /** Omit chat and help when true (Sana reference strip) */
  compactTrailing?: boolean;
  /** Replace default chat, inbox, notifications, help, avatar cluster */
  trailingActions?: ReactNode;
  /** Max width of the pill search field */
  searchMaxWidthPx?: number;
}

/**
 * Shared recruiter / Workday-style top chrome using Canvas Kit: `InputGroup` + `TextInput` for
 * search, `ToolbarIconButton`, `CountBadge`, `Avatar`, `Heading` / `BodyText`.
 */
export const WorkdayTopNav: React.FC<WorkdayTopNavProps> = ({
  tenantLabel = 'Global Modern Services',
  showMenuWordmark = false,
  showWMark = true,
  searchPlaceholder = 'Search or ask a question',
  searchValue,
  onSearchChange,
  notificationBadge,
  inboxBadge,
  showLayoutUtilities = true,
  compactTrailing = true,
  trailingActions,
  searchMaxWidthPx = 560,
}) => {
  const defaultTrailing = (
    <>
      {showLayoutUtilities && (
        <>
          <ToolbarIconButton icon={rotateIcon} aria-label="Refresh" />
          <ToolbarIconButton icon={gridViewIcon} aria-label="Apps and reports" />
        </>
      )}
      {!compactTrailing && <ToolbarIconButton icon={speechBubbleIcon} aria-label="Chat" />}
      <IconWithCountBadge count={inboxBadge}>
        <ToolbarIconButton icon={inboxIcon} aria-label="Inbox" />
      </IconWithCountBadge>
      <IconWithCountBadge count={notificationBadge}>
        <ToolbarIconButton icon={notificationsIcon} aria-label="Notifications" />
      </IconWithCountBadge>
      {!compactTrailing && <ToolbarIconButton icon={questionOutlineIcon} aria-label="Help" />}
      <Avatar size={36} altText="Signed-in user" as="div" />
    </>
  );

  return (
    <Box
      paddingX="l"
      paddingY="xs"
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: SANA_TOP_NAV_BG,
        borderBottom: `1px solid ${colors.soap300}`,
        minHeight: `${WORKDAY_TOP_NAV_HEIGHT_PX}px`,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" gap="l" width="100%">
        <Flex alignItems="center" gap="s" flex="0 0 auto">
          {showWMark ? (
            <Box style={{ display: 'flex', alignItems: 'center' }} aria-hidden>
              <WorkdayWMark size={36} />
            </Box>
          ) : null}
          {showMenuWordmark && (
            <Flex alignItems="center" gap="xxs">
              <ToolbarIconButton icon={justifyIcon} aria-label="Open menu" />
              <BodyText size="small" fontWeight="bold" color={colors.blackPepper600}>
                MENU
              </BodyText>
            </Flex>
          )}
          {!showWMark && tenantLabel ? (
            <Heading as="span" size="medium" style={{ color: SANA_LINK_ACCENT, margin: 0 }}>
              {tenantLabel}
            </Heading>
          ) : null}
        </Flex>

        <Box flex="1 1 auto" maxWidth={searchMaxWidthPx} marginX="l" width="100%">
          <InputGroup
            width="100%"
            style={{
              borderRadius: 999,
              overflow: 'hidden',
              border: `1px solid ${colors.soap300}`,
              backgroundColor: SANA_SEARCH_FIELD_BG,
              boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
            }}
          >
            <InputGroup.InnerStart
              as={SystemIcon}
              icon={searchIcon}
              pointerEvents="none"
              color={colors.blackPepper400}
            />
            <InputGroup.Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              aria-label={searchPlaceholder}
              style={{
                backgroundColor: SANA_SEARCH_FIELD_BG,
                border: 'none',
                boxShadow: 'none',
                fontSize: 14,
                lineHeight: 1.35,
                color: colors.blackPepper600,
              }}
            />
          </InputGroup>
        </Box>

        <Flex alignItems="center" gap="xs" flex="0 0 auto">
          {trailingActions ?? defaultTrailing}
        </Flex>
      </Flex>
    </Box>
  );
};
