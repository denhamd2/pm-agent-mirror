import React, { type ReactNode } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_LINK_ACCENT } from './sanaShellTheme';

export interface ThreadExpansionProps {
  messageCount: number;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode; // Pre-rendered message list
}

/**
 * Gmail-style inline thread toggle for any threaded communication.
 * 
 * Features:
 * - Compact toggle bar: "··· Show N previous messages ···" / "Hide previous messages"
 * - Collapsed by default
 * - Expands inline (no separate scroll area)
 * - Soap100 background, 8px radius, link-color text
 * - Takes pre-rendered messages as children prop
 */
export const ThreadExpansion: React.FC<ThreadExpansionProps> = ({
  messageCount,
  expanded,
  onToggle,
  children,
}) => {
  return (
    <Box>
      {/* Compact Toggle - Gmail Style */}
      <Box
        padding="s m"
        style={{
          cursor: 'pointer',
          borderTop: `1px solid ${colors.soap300}`,
          borderBottom: `1px solid ${colors.soap300}`,
          backgroundColor: colors.soap100,
          borderRadius: 8,
        }}
        onClick={onToggle}
      >
        <Flex justifyContent="center" alignItems="center" gap="s">
          <BodyText size="small" color={colors.blackPepper500}>
            ···
          </BodyText>
          <BodyText size="small" color={SANA_LINK_ACCENT} fontWeight="bold">
            {expanded ? 'Hide previous messages' : `Show ${messageCount} previous messages`}
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            ···
          </BodyText>
        </Flex>
      </Box>

      {/* Previous Messages - Expand Inline */}
      {expanded && <Box marginTop="m">{children}</Box>}
    </Box>
  );
};
