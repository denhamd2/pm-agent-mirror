/**
 * ProgressBarWithBadge Component
 * 
 * Progress bar with letter badge for displaying distribution analytics.
 * Commonly used for grade distributions, score bands, and category breakdowns.
 * 
 * @example
 * ```tsx
 * <ProgressBarWithBadge
 *   badge="A"
 *   label="Strong Fit (85-100%)"
 *   count={45}
 *   total={127}
 *   color={colors.greenApple600}
 * />
 * ```
 */

import React from 'react';
import { Box, Flex, BodyText } from '@workday/canvas-kit-react';
import { colors } from '@workday/canvas-kit-react/tokens';

export interface ProgressBarWithBadgeProps {
  /** Badge text (typically a letter like A, B, C, D) */
  badge: string;
  /** Descriptive label for the category */
  label: string;
  /** Count of items in this category */
  count: number;
  /** Total items across all categories */
  total: number;
  /** Color for the badge text and progress bar fill */
  color: string;
  /** Optional custom ARIA label */
  ariaLabel?: string;
}

/**
 * ProgressBarWithBadge - Distribution analytics display
 * 
 * Shows category distribution with:
 * - Letter badge (grade/category identifier)
 * - Descriptive label with range
 * - Count and percentage
 * - Visual progress bar
 * 
 * Distinct from HiredScoreGrading (individual scores) - this shows
 * distribution across a population.
 * 
 * Follows Sana Style with neutral surfaces and category-specific colors.
 */
export const ProgressBarWithBadge: React.FC<ProgressBarWithBadgeProps> = ({
  badge,
  label,
  count,
  total,
  color,
  ariaLabel,
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="xs">
        <Flex alignItems="center" gap="s">
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: colors.soap200,
              border: `1px solid ${colors.soap300}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: color,
            }}
          >
            {badge}
          </Box>
          <BodyText size="small" style={{ fontWeight: 600 }}>
            {label}
          </BodyText>
        </Flex>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          {count} ({percentage}%)
        </BodyText>
      </Flex>
      <Box
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={ariaLabel || `${label}: ${count} items`}
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.soap300,
          overflow: 'hidden',
        }}
      >
        <Box style={{ width: `${percentage}%`, height: '100%', backgroundColor: color }} />
      </Box>
    </Box>
  );
};
