import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';

/**
 * HiredScore Grading Component
 * 
 * Displays HiredScore spotlight grading (A-D bands) with percentage,
 * label, and optional progress bar. Canonical pattern from Figma node 490-62877.
 * 
 * Usage:
 * - Full variant (with progress bar): Use in candidate grids, profile headers
 * - Compact variant (no bar): Use in dashboard cards, condensed lists
 * 
 * @see design/references/pattern-hired-score-grid.md
 */

export type HsLetter = 'A' | 'B' | 'C' | 'D';

export interface HiredScoreGradingProps {
  /** HiredScore fit percentage (0-100) */
  fit: number;
  /** Variant: 'full' shows progress bar, 'compact' shows grade+% only */
  variant?: 'full' | 'compact';
  /** Size variant for different contexts */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Maps fit percentage to letter grade (A-D) and label.
 * 
 * Grade bands:
 * - A (Strong fit): 85-100%
 * - B (Good fit): 70-84%
 * - C (Moderate fit): 55-69%
 * - D (Developing fit): 0-54%
 */
export function hiredScoreBand(fit: number): { letter: HsLetter; shortLabel: string } {
  if (fit >= 85) return { letter: 'A', shortLabel: 'Strong fit' };
  if (fit >= 70) return { letter: 'B', shortLabel: 'Good fit' };
  if (fit >= 55) return { letter: 'C', shortLabel: 'Moderate fit' };
  return { letter: 'D', shortLabel: 'Developing fit' };
}

/**
 * Returns Canvas Kit color tokens for each grade band.
 * 
 * Color scheme:
 * - A: Green (greenApple)
 * - B: Blue (blueberry) with grey background
 * - C: Orange (cantaloupe)
 * - D: Grey (soap/blackPepper)
 */
export function gradePillColors(letter: HsLetter): { bg: string; fg: string; bar: string } {
  switch (letter) {
    case 'A':
      return { bg: colors.greenApple100, fg: colors.greenApple600, bar: colors.greenApple600 };
    case 'B':
      return { bg: colors.soap200, fg: colors.blueberry600, bar: colors.blueberry500 };
    case 'C':
      return { bg: colors.cantaloupe100, fg: colors.cantaloupe600, bar: colors.cantaloupe600 };
    default:
      return { bg: colors.soap200, fg: colors.blackPepper500, bar: colors.soap400 };
  }
}

/**
 * HiredScore Grading component.
 * 
 * Displays candidate fit score with A-D letter grade, percentage,
 * label, and optional progress bar.
 */
export const HiredScoreGrading: React.FC<HiredScoreGradingProps> = ({ 
  fit, 
  variant = 'full',
  size = 'medium' 
}) => {
  const { letter, shortLabel } = hiredScoreBand(fit);
  const { bg, fg, bar } = gradePillColors(letter);
  const clamped = Math.min(100, Math.max(0, fit));
  const showBar = variant === 'full';

  return (
    <Box style={{ minWidth: 120 }}>
      <Flex alignItems="center" gap="xs" marginBottom={showBar ? 'xxs' : undefined}>
        <Box
          aria-label={`HiredScore fit grade ${letter}, ${clamped} percent`}
          paddingX="xs"
          paddingY="xxs"
          style={{
            backgroundColor: bg,
            borderRadius: 8,
            border: `1px solid ${colors.soap300}`,
            minWidth: 28,
            textAlign: 'center',
          }}
        >
          <BodyText size="small" style={{ fontWeight: 700, color: fg, lineHeight: 1.2 }}>
            {letter}
          </BodyText>
        </Box>
        <Box>
          <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
            {clamped}%
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500}>
            {shortLabel}
          </BodyText>
        </Box>
      </Flex>
      {showBar && (
        <Box
          marginTop="xxs"
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.soap300,
            overflow: 'hidden',
            maxWidth: 140,
          }}
        >
          <Box style={{ width: `${clamped}%`, height: '100%', backgroundColor: bar }} />
        </Box>
      )}
    </Box>
  );
};
