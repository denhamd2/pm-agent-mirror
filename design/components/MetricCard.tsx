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
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { colors } from '@workday/canvas-kit-react/tokens';
import { arrowUpIcon, arrowDownIcon, minusIcon, infoIcon } from '@workday/canvas-system-icons-web';
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
  /** Short plain-language definition and calculation; shown on hover via info icon */
  tooltip?: string;
}

const sentimentConfig = {
  positive: {
    color: colors.greenApple600,
    bgColor: colors.greenApple100,
    icon: arrowUpIcon,
  },
  negative: {
    color: colors.peachSchnapps600,
    bgColor: colors.peachSchnapps100,
    icon: arrowDownIcon,
  },
  neutral: {
    color: colors.blueberry500,
    bgColor: colors.blueberry100,
    icon: minusIcon,
  },
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
  tooltip,
}) => {
  return (
    <Box
      padding="l"
      style={{
        flex: '1 1 220px',
        minWidth: 0,
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      <Flex alignItems="center" gap="xxs" style={{ marginBottom: '8px' }}>
        <BodyText size="small" color={colors.blackPepper500} style={{ fontWeight: 600, margin: 0 }}>
          {label}
        </BodyText>
        {tooltip ? (
          <span title={tooltip} style={{ display: 'inline-flex', cursor: 'help', flexShrink: 0 }}>
            <SystemIcon icon={infoIcon} size={14} color={colors.soap500} />
          </span>
        ) : null}
      </Flex>
      
      <Flex alignItems="baseline" gap="s" flexWrap="wrap" style={{ minWidth: 0 }}>
        <Heading size="large" marginY="zero" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {value}
        </Heading>
        
        {changeIndicator && (
          <Flex 
            alignItems="center" 
            gap="xxs"
            padding="xxs xs"
            style={{
              backgroundColor: sentimentConfig[changeIndicator.sentiment || 'neutral'].bgColor,
              borderRadius: '12px',
            }}
          >
            <SystemIcon 
              icon={sentimentConfig[changeIndicator.sentiment || 'neutral'].icon} 
              color={sentimentConfig[changeIndicator.sentiment || 'neutral'].color}
              size={16}
            />
            <BodyText
              size="small"
              color={sentimentConfig[changeIndicator.sentiment || 'neutral'].color}
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {changeIndicator.text}
            </BodyText>
          </Flex>
        )}
      </Flex>

      <BodyText size="small" color={colors.blackPepper500} style={{ marginTop: 'auto', paddingTop: '12px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {helperText}
      </BodyText>
    </Box>
  );
};
