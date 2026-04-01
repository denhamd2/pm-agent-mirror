/**
 * CandidateGradeBadge
 * 
 * Circular letter grade badge (A/B/C/D) with color-coded backgrounds
 * Extracted from Figma Candidate Smart View design
 * 
 * Usage:
 * <CandidateGradeBadge grade="A" size="large" />
 */

import { colors } from '@workday/canvas-kit-react/tokens';

export interface CandidateGradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D';
  size?: 'small' | 'medium' | 'large';
}

const GRADE_COLORS = {
  A: {
    background: colors.greenApple100,
    text: colors.greenApple600,
  },
  B: {
    background: colors.soap200,
    text: colors.blueberry600,
  },
  C: {
    background: colors.cantaloupe100,
    text: colors.cantaloupe600,
  },
  D: {
    background: colors.soap200,
    text: colors.blackPepper500,
  },
};

const SIZE_MAP = {
  small: 28,
  medium: 40,
  large: 52,
};

export function CandidateGradeBadge({ grade, size = 'medium' }: CandidateGradeBadgeProps) {
  const colorScheme = GRADE_COLORS[grade];
  const diameter = SIZE_MAP[size];
  const fontSize = size === 'small' ? 14 : size === 'medium' ? 20 : 28;

  return (
    <div
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize,
        flexShrink: 0,
      }}
      role="img"
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </div>
  );
}
