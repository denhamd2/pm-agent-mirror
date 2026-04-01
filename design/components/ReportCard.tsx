/**
 * ReportCard Component
 * 
 * Card component for report library items, saved searches, and templates.
 * Displays report metadata with action button.
 * 
 * @example
 * ```tsx
 * <ReportCard
 *   name="Pipeline Velocity"
 *   description="Time-in-stage analysis across all active reqs"
 *   lastRun="30 March 2026"
 *   keyMetric="8.2 days avg"
 *   onAction={() => runReport()}
 *   actionLabel="Run Report"
 * />
 * ```
 */

import React from 'react';
import { Box, Flex, BodyText, SecondaryButton } from '@workday/canvas-kit-react';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG } from './sanaShellTheme';

export interface ReportCardProps {
  /** Report name/title */
  name: string;
  /** Report description */
  description: string;
  /** Optional last run date/time */
  lastRun?: string;
  /** Optional key metric or summary */
  keyMetric?: string;
  /** Optional action handler */
  onAction?: () => void;
  /** Optional action button label (defaults to "Run Report") */
  actionLabel?: string;
}

/**
 * ReportCard - Report library item card
 * 
 * Standard card layout for report libraries with:
 * - Report name and description
 * - Last run metadata
 * - Key metric summary
 * - Action button (Run Report, Download, etc.)
 * 
 * Follows Sana Style with neutral surfaces and responsive grid layout.
 * Designed for use in flex/grid containers with `flex: 1 1 280px`.
 */
export const ReportCard: React.FC<ReportCardProps> = ({
  name,
  description,
  lastRun,
  keyMetric,
  onAction,
  actionLabel = 'Run Report',
}) => {
  return (
    <Box
      flex="1 1 280px"
      padding="l"
      style={{
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        cursor: onAction ? 'pointer' : 'default',
      }}
      tabIndex={onAction ? 0 : undefined}
      onClick={onAction}
    >
      <BodyText size="small" style={{ fontWeight: 700 }} marginBottom="xs">
        {name}
      </BodyText>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
        {description}
      </BodyText>
      <Flex justifyContent="space-between" alignItems="center" gap="m" flexWrap="wrap">
        <Box>
          {lastRun && (
            <BodyText size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
              Last run: {lastRun}
            </BodyText>
          )}
          {keyMetric && (
            <BodyText
              size="small"
              color={colors.blueberry500}
              style={{ fontWeight: 600, fontSize: 13 }}
              marginTop="xxs"
            >
              {keyMetric}
            </BodyText>
          )}
        </Box>
        {onAction && (
          <SecondaryButton size="small" onClick={(e) => { e.stopPropagation(); onAction(); }}>
            {actionLabel}
          </SecondaryButton>
        )}
      </Flex>
    </Box>
  );
};
