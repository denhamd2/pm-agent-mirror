import React, { type ReactNode } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import {
  SANA_COMM_RAIL_ACTIVE_BG,
  SANA_COMM_RAIL_ACTIVE_ICON,
} from './sanaShellTheme';

export const DEFAULT_COMM_RAIL_PX = 56;
export const DEFAULT_COMM_EXPANDED_PX = 420;

export interface CommunicationDockProps {
  /** Offset from viewport top (usually main `WorkdayTopNav` height) */
  headerOffsetPx: number;
  /** When true, sheet has non-zero width and shows `panel` */
  expanded: boolean;
  /** Fixed right rail width */
  railWidthPx?: number;
  /** Target width of sliding sheet when expanded */
  expandedWidthPx?: number;
  zIndex?: number;
  /** Sliding panel column (header + body). Hidden when `expanded` is false. */
  panel: ReactNode;
  /** Icon stack fixed to the right edge */
  rail: ReactNode;
}

/**
 * Right communication rail + sliding sheet using Canvas Kit `Card` for the panel surface and
 * `Flex` / `Box` for layout. Sheet overlays main content (no horizontal push).
 */
export const CommunicationDock: React.FC<CommunicationDockProps> = ({
  headerOffsetPx,
  expanded,
  railWidthPx = DEFAULT_COMM_RAIL_PX,
  expandedWidthPx = DEFAULT_COMM_EXPANDED_PX,
  zIndex = 260,
  panel,
  rail,
}) => {
  const w = railWidthPx;
  return (
    <Flex
      style={{
        position: 'fixed',
        top: headerOffsetPx,
        right: 0,
        bottom: 0,
        zIndex,
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      <Box
        aria-hidden={!expanded}
        style={{
          width: expanded ? `min(${expandedWidthPx}px, calc(100vw - ${w}px))` : 0,
          maxWidth: `calc(100vw - ${w}px)`,
          overflow: 'hidden',
          transition: 'width 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <Card
          height="100%"
          padding="zero"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            borderRadius: 0,
            border: 'none',
            borderLeft: `1px solid ${colors.soap300}`,
            boxShadow: expanded ? '-8px 0 24px rgba(15, 46, 102, 0.16)' : 'none',
          }}
        >
          {panel}
        </Card>
      </Box>
      <Flex
        flexDirection="column"
        alignItems="center"
        paddingY="xs"
        style={{
          width: w,
          flexShrink: 0,
          backgroundColor: colors.soap200,
          borderLeft: `1px solid ${colors.soap300}`,
          paddingTop: space.s,
          paddingBottom: space.s,
          gap: space.xxs,
          position: 'relative',
        }}
      >
        {rail}
      </Flex>
    </Flex>
  );
};

/**
 * Shared rail tile sizing for Canvas Kit prototypes (Sana reference:
 * inactive = transparent; active = light blue rounded tile + blue icon accent).
 */
export function communicationRailButtonStyle(
  active: boolean,
  railWidthPx: number = DEFAULT_COMM_RAIL_PX,
): React.CSSProperties {
  const tile = railWidthPx - 8;
  return {
    width: tile,
    height: tile,
    borderRadius: 10,
    border: 'none',
    backgroundColor: active ? SANA_COMM_RAIL_ACTIVE_BG : 'transparent',
    boxShadow: active ? `inset 0 0 0 1px ${SANA_COMM_RAIL_ACTIVE_ICON}` : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  };
}
