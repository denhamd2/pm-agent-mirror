import React, { type ReactNode } from 'react';
import { Flex, Box } from './twemail/layout';
import { SPACE } from './twemail/palette';
import { TW } from './twemail/palette';
import { TWEMAIL_PANEL_SHADOW } from './twoWayEmailDesignTokens';
import {
  CONV_EMAIL_RAIL_TILE_ACTIVE_BG,
  CONV_EMAIL_RAIL_TILE_RING,
  CONV_EMAIL_RAIL_TILE_RADIUS_PX,
} from './conversationalEmailPrototypeTheme';

export const DEFAULT_COMM_RAIL_PX = 56;
export const DEFAULT_COMM_EXPANDED_PX = 420;

export interface CommunicationDockProps {
  /** Offset from viewport top (usually main `WorkdayTopNav` height) */
  headerOffsetPx: number;
  /** When true, sheet has non-zero width and shows `panel` */
  expanded: boolean;
  /** Fixed right rail width */
  railWidthPx?: number;
  /** Target width of sliding **panel** (mail/chat surface) when expanded — rail width is added for total dock width */
  expandedWidthPx?: number;
  /** Background for the icon rail column */
  railBackgroundColor?: string;
  /**
   * When expanded, box-shadow on the dock container. Defaults to 2-way email panel shadow;
   * override for other prototypes if needed.
   */
  expandedPanelBoxShadow?: string;
  zIndex?: number;
  /**
   * When expanded, add subtle elevation on the rail so sheet + rail read as one dock (Figma parity).
   */
  unifiedRailElevation?: boolean;
  /** Sliding panel column (header + body). Hidden when `expanded` is false. */
  panel: ReactNode;
  /** Icon stack — rendered **left** of the panel (Figma: narrow rail then white surface) */
  rail: ReactNode;
}

/**
 * Right communication dock: **rail + panel animate together** (single width transition).
 * Icon rail sits **left** of the white panel; both slide in from the right edge as one unit.
 */
export const CommunicationDock: React.FC<CommunicationDockProps> = ({
  headerOffsetPx,
  expanded,
  railWidthPx = DEFAULT_COMM_RAIL_PX,
  expandedWidthPx = DEFAULT_COMM_EXPANDED_PX,
  railBackgroundColor,
  zIndex = 260,
  unifiedRailElevation = false,
  expandedPanelBoxShadow = TWEMAIL_PANEL_SHADOW,
  panel,
  rail,
}) => {
  const w = railWidthPx;
  /** Total horizontal footprint: panel target width + fixed rail (matches Figma Overview narrow dock). */
  const totalExpandedPx = expandedWidthPx + w;
  const outerWidth = expanded ? `min(${totalExpandedPx}px, 100%)` : `${w}px`;

  return (
    <Flex
      style={{
        position: 'fixed',
        top: headerOffsetPx,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        maxWidth: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box
        style={{
          width: outerWidth,
          maxWidth: '100%',
          minWidth: 0,
          height: '100%',
          overflow: 'hidden',
          transition: 'width 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          flexShrink: 0,
          boxShadow: expanded ? expandedPanelBoxShadow : 'none',
          pointerEvents: 'auto',
        }}
      >
        {/* Figma order: icon rail | panel (rail touches profile content) */}
        <Flex
          flexDirection="column"
          alignItems="center"
          paddingY="xs"
          style={{
            width: w,
            flexShrink: 0,
            backgroundColor: railBackgroundColor ?? TW.frenchVanilla100,
            borderLeft: `1px solid ${TW.soap300}`,
            paddingTop: SPACE.s,
            paddingBottom: SPACE.s,
            gap: SPACE.xxs,
            position: 'relative',
            overflow: 'visible',
            boxShadow:
              unifiedRailElevation && expanded
                ? '-6px 0 14px rgba(11, 31, 66, 0.07)'
                : undefined,
          }}
        >
          {rail}
        </Flex>
        <Box
          style={{
            flex: expanded ? '1 1 0%' : '0 1 0%',
            minWidth: 0,
            maxWidth: expanded ? undefined : 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            height="100%"
            style={{
              display: expanded ? 'flex' : 'none',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              borderLeft: expanded ? `1px solid ${TW.soap300}` : 'none',
              backgroundColor: TW.frenchVanilla100,
            }}
          >
            {expanded ? panel : null}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

/**
 * Shared rail tile sizing for recruiting / conversational email prototypes (inactive = transparent;
 * active = light blue rounded tile + blue icon accent).
 */
export function communicationRailButtonStyle(
  active: boolean,
  railWidthPx: number = DEFAULT_COMM_RAIL_PX,
): React.CSSProperties {
  const tile = railWidthPx - 8;
  return {
    width: tile,
    height: tile,
    borderRadius: CONV_EMAIL_RAIL_TILE_RADIUS_PX,
    border: 'none',
    backgroundColor: active ? CONV_EMAIL_RAIL_TILE_ACTIVE_BG : 'transparent',
    boxShadow: active ? `inset 0 0 0 1px ${CONV_EMAIL_RAIL_TILE_RING}` : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  };
}
