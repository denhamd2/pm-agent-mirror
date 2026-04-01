/**
 * MetricCard Component
 * 
 * KPI metric card for dashboards and analytics views.
 * Displays a key metric with label, value, helper text, and optional change indicator.
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   label="Open requisitions"
 *   value="38"
 *   helperText="Assigned to you"
 *   changeIndicator={{ text: "+5 this week", sentiment: "positive" }}
 * />
 * ```
 */

import React from 'react';
import { Box, Heading, BodyText, Flex } from '@workday/canvas-kit-react';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG } from './sanaShellTheme';

export interface MetricCardProps {
  /** The metric label/title */
  label: string;
  /** The primary metric value */
  value: string | number;
  /** Helper text providing context for the metric */
  helperText: string;
  /** Optional change indicator with sentiment coloring */
  changeIndicator?: {
    text: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  };
  /** Optional click handler for interactive cards */
  onClick?: () => void;
}

const sentimentColors = {
  positive: colors.greenApple600,
  negative: colors.peachSchnapps600,
  neutral: colors.blueberry500,
};

/**
 * MetricCard - KPI metric display card
 * 
 * Standard card layout for displaying key performance indicators with:
 * - Label (metric name)
 * - Large value (primary number)
 * - Helper text (context)
 * - Change indicator (trend/comparison)
 * 
 * Follows Sana Style with neutral surfaces and blue restraint.
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  helperText,
  changeIndicator,
  onClick,
}) => {
  return (
    <Box
      padding="l"
      style={{
        flex: '1 1 220px',
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      <BodyText size="small" color={colors.blackPepper500} style={{ fontWeight: 600 }}>
        {label}
      </BodyText>
      <Heading size="large" marginY="xs">
        {value}
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
        {helperText}
      </BodyText>
      {changeIndicator && (
        <BodyText
          size="small"
          color={sentimentColors[changeIndicator.sentiment || 'neutral']}
          style={{ fontSize: 12 }}
        >
          {changeIndicator.text}
        </BodyText>
      )}
    </Box>
  );
};
