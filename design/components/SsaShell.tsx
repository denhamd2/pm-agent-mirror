/**
 * Self-Service Agent (SSA) — shell layout primitives.
 *
 * This file bundles the three building blocks every SSA prototype needs:
 *
 *   1. SsaShell          — mode-aware layout wrapper (cold-start vs split-pane).
 *   2. SsaTitleStrip     — slim secondary header (panel toggle, agent name, minimise/close).
 *   3. SsaStarterSuggestions — canonical "↳ prompt" list with rotate affordance.
 *   4. SparkleMark       — lightweight 4-point sparkle glyph used as the cold-start hero mark.
 *
 * Consumers own state (messages, composer, mode, intent handling) and supply the
 * chat-pane content and canvas content as slot props. SsaShell only handles
 * layout, chrome, and the mode-dependent visual shape.
 *
 * Canonical references:
 *   - Rule: .cursor/rules/design-specific/016-ssa-canvas-pattern.md
 *   - Visual: design/references/ssa-create-req-videos/frames-overlap/ov-1800.png (cold-start),
 *             ov-2700.png (split-pane), ov-9900.png (success).
 *   - Best-practice memo: design/references/ssa-create-req-flow-best-practices.md
 */
import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  justifyIcon,
  chevronDownSmallIcon,
  minusIcon,
  xIcon,
  arrowCornerDownRightIcon,
  rotateIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  type WorkdayTopNavProps,
} from './WorkdayTopNav';
import {
  SANA_PAGE_CANVAS,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
  SANA_SECONDARY_TAB_INACTIVE_FG,
} from './sanaShellTheme';

/* ----------------------------------------------------------------------- *\
 * Tokens — exported for prototypes that need to match shell heights
\* ----------------------------------------------------------------------- */

export const SSA_TITLE_STRIP_HEIGHT_PX = 48;
export const SSA_CHAT_PANE_WIDTH_PX = 520;
export const SSA_COLD_START_MAX_WIDTH_PX = 720;

/* ----------------------------------------------------------------------- *\
 * SparkleMark — 4-point sparkle hero glyph for the cold-start greeting.
 * Inline SVG so there's no dependency on a specific Canvas Kit icon (the
 * icon library does not ship a "sparkle" at the time of writing).
\* ----------------------------------------------------------------------- */

export function SparkleMark({ size = 20, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
        fill={color ?? SANA_LINK_ACCENT}
      />
    </svg>
  );
}

/* ----------------------------------------------------------------------- *\
 * SsaTitleStrip — slim chrome between WorkdayTopNav and the split-pane.
 *
 * Anatomy (left to right): panel-toggle button, agent name + caret, spacer,
 * minimise, close. See 015-sana-style-ui.md → SSA Title Strip for tokens and
 * forbidden elements (no brand gradients, no AI disclosure, no status pills).
\* ----------------------------------------------------------------------- */

export interface SsaTitleStripProps {
  agentName?: string;
  onTogglePane?: () => void;
  onMinimise?: () => void;
  onClose?: () => void;
}

export function SsaTitleStrip({
  agentName = 'Self-Service Agent',
  onTogglePane,
  onMinimise,
  onClose,
}: SsaTitleStripProps) {
  return (
    <Flex
      role="banner"
      alignItems="center"
      paddingLeft="xs"
      paddingRight="xs"
      style={{
        height: SSA_TITLE_STRIP_HEIGHT_PX,
        backgroundColor: SANA_COMM_PANEL_SURFACE,
        borderBottom: `1px solid ${colors.soap300}`,
      }}
    >
      <ToolbarIconButton
        icon={justifyIcon}
        aria-label="Toggle conversation panel"
        onClick={onTogglePane}
      />
      <Flex alignItems="center" gap="xxxs" marginLeft="xxs">
        <BodyText
          as="span"
          size="small"
          style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600 }}
        >
          {agentName}
        </BodyText>
        <SystemIcon
          icon={chevronDownSmallIcon}
          size={16}
          color={colors.blackPepper400}
        />
      </Flex>
      <Box flex={1} />
      <ToolbarIconButton icon={minusIcon} aria-label="Minimise" onClick={onMinimise} />
      <ToolbarIconButton icon={xIcon} aria-label={`Close ${agentName}`} onClick={onClose} />
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * SsaStarterSuggestions — canonical "↳ prompt" list below the first agent
 * message in cold-start (or below a re-entered cold-start after a flow
 * completes). Two variants:
 *   - "cold-start": generic SSA prompts; wider (max 560px), flush-left.
 *   - "in-task":    task-specific prompts; narrower (max 380px), indented.
\* ----------------------------------------------------------------------- */

export interface SsaStarterSuggestionsProps {
  setIndex: number;
  suggestionSets: string[][];
  onPick: (text: string) => void;
  onRotate: () => void;
  disabled?: boolean;
  variant?: 'cold-start' | 'in-task';
}

export function SsaStarterSuggestions({
  setIndex,
  suggestionSets,
  onPick,
  onRotate,
  disabled = false,
  variant = 'in-task',
}: SsaStarterSuggestionsProps) {
  const items = suggestionSets[setIndex % suggestionSets.length];
  const maxWidth = variant === 'cold-start' ? 560 : 380;
  return (
    <Box
      marginTop="xs"
      marginLeft={variant === 'cold-start' ? 'zero' : 'm'}
      style={{ maxWidth }}
    >
      <ul
        aria-label="Starter suggestions"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {items.map((text) => (
          <li key={text} style={{ borderBottom: `1px solid ${colors.soap300}` }}>
            <button
              type="button"
              onClick={() => onPick(text)}
              disabled={disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: colors.blackPepper600,
                fontSize: 13,
                fontFamily: '"Roboto", sans-serif',
                textAlign: 'left',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <SystemIcon
                icon={arrowCornerDownRightIcon}
                size={16}
                color={SANA_SECONDARY_TAB_INACTIVE_FG}
              />
              <span>{text}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onRotate}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 4px',
          border: 'none',
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: SANA_SECONDARY_TAB_INACTIVE_FG,
          fontSize: 13,
          fontFamily: '"Roboto", sans-serif',
        }}
      >
        <SystemIcon icon={rotateIcon} size={16} color={SANA_SECONDARY_TAB_INACTIVE_FG} />
        <span>See other suggestions</span>
      </button>
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * SsaShell — mode-aware layout wrapper.
 *
 *   mode === "cold-start": renders a single centred column (max 720px) on a
 *     white surface. The `coldStart` slot owns its own greeting, starter
 *     suggestions, and composer.
 *   mode === "in-task":    renders the canonical split-pane (520px chat left,
 *     flex canvas right). The `chat` slot renders the chat thread + composer;
 *     the `canvas` slot renders the task surface.
 *
 * Layout math (top nav + title strip) is handled here; the consumer does not
 * need to know the exact pixel heights.
\* ----------------------------------------------------------------------- */

export interface SsaShellProps {
  /** Current mode. Parent owns the state and flips it when an intent fires. */
  mode: 'cold-start' | 'in-task';
  /** Top-nav tenant label (passed through to WorkdayTopNav). */
  tenantLabel?: string;
  /** Agent name shown in the title strip (default: "Self-Service Agent"). */
  agentName?: string;
  /** Extra props forwarded to WorkdayTopNav for rare customisation (e.g. hiding the W mark). */
  topNavProps?: Partial<WorkdayTopNavProps>;
  /** Title-strip event handlers. */
  onTogglePane?: () => void;
  onMinimise?: () => void;
  onClose?: () => void;
  /** Slot: cold-start centred content (greeting + suggestions + composer). */
  coldStart?: React.ReactNode;
  /** Slot: in-task chat pane content (thread + composer + disclosure). */
  chat?: React.ReactNode;
  /** Slot: in-task canvas content (header card + stepper + step content). */
  canvas?: React.ReactNode;
}

export function SsaShell({
  mode,
  tenantLabel,
  agentName = 'Self-Service Agent',
  topNavProps,
  onTogglePane,
  onMinimise,
  onClose,
  coldStart,
  chat,
  canvas,
}: SsaShellProps) {
  const bodyHeight = `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX + SSA_TITLE_STRIP_HEIGHT_PX}px)`;
  const mergedTopNavProps: WorkdayTopNavProps = {
    tenantLabel: tenantLabel ?? topNavProps?.tenantLabel,
    showWMark: topNavProps?.showWMark ?? true,
    showMenuWordmark: topNavProps?.showMenuWordmark ?? false,
    searchPlaceholder: topNavProps?.searchPlaceholder,
    searchValue: topNavProps?.searchValue ?? '',
    onSearchChange: topNavProps?.onSearchChange ?? (() => {}),
    notificationBadge: topNavProps?.notificationBadge,
    inboxBadge: topNavProps?.inboxBadge,
    showLayoutUtilities: topNavProps?.showLayoutUtilities,
    compactTrailing: topNavProps?.compactTrailing,
    trailingActions: topNavProps?.trailingActions,
    searchMaxWidthPx: topNavProps?.searchMaxWidthPx,
    variant: topNavProps?.variant,
  };

  const bodyContent =
    mode === 'cold-start' ? (
      <Flex
        style={{
          height: bodyHeight,
          width: '100%',
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
        justifyContent="center"
      >
        <Flex
          flexDirection="column"
          style={{
            width: '100%',
            maxWidth: SSA_COLD_START_MAX_WIDTH_PX,
            padding: '24px 32px 0',
          }}
        >
          {coldStart}
        </Flex>
      </Flex>
    ) : (
      <Flex
        style={{
          height: bodyHeight,
          width: '100%',
        }}
      >
        <Box
          style={{
            width: SSA_CHAT_PANE_WIDTH_PX,
            minWidth: SSA_CHAT_PANE_WIDTH_PX,
            display: 'flex',
            flexDirection: 'column',
            borderRight: `1px solid ${colors.soap300}`,
            backgroundColor: SANA_COMM_PANEL_SURFACE,
          }}
        >
          {chat}
        </Box>
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            padding: '20px 28px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {canvas}
        </Box>
      </Flex>
    );

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        {...mergedTopNavProps}
      />
      <SsaTitleStrip
        agentName={agentName}
        onTogglePane={onTogglePane}
        onMinimise={onMinimise}
        onClose={onClose}
      />
      {bodyContent}
    </Box>
  );
}
