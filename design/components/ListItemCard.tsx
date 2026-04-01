/**
 * ListItemCard Component
 * 
 * Nested card component for displaying list items within larger cards.
 * Common pattern for recent items, related records, and quick access lists.
 * 
 * @example
 * ```tsx
 * <ListItemCard
 *   title="Jordan Ellis"
 *   subtitle="Principal PM, Talent products"
 *   metadata={["Applied 28 March 2026", "LinkedIn"]}
 *   trailingElement={<HiredScoreGrading fit={94} variant="compact" />}
 *   onClick={() => openProfile()}
 * />
 * ```
 */

import React from 'react';
import { Box, Flex, BodyText } from '@workday/canvas-kit-react';
import { colors } from '@workday/canvas-kit-react/tokens';

export interface ListItemCardProps {
  /** Primary text (title/name) */
  title: string;
  /** Optional secondary text (subtitle/role) */
  subtitle?: string;
  /** Optional tertiary text (metadata like dates, sources). Can be string or array. */
  metadata?: string | string[];
  /** Optional trailing element (badge, button, icon) */
  trailingElement?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * ListItemCard - Nested list item within cards
 * 
 * Standard layout for list items within larger card containers:
 * - Primary text (bold title)
 * - Secondary text (regular subtitle)
 * - Tertiary text (micro metadata)
 * - Trailing element (badge/button)
 * 
 * Uses nested surface color (soap100) to differentiate from parent card.
 * Follows Sana Style with soft radii and hover states.
 */
export const ListItemCard: React.FC<ListItemCardProps> = ({
  title,
  subtitle,
  metadata,
  trailingElement,
  onClick,
}) => {
  const metadataArray = Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];

  return (
    <Box
      padding="m"
      style={{
        backgroundColor: colors.soap100,
        borderRadius: 8,
        border: `1px solid ${colors.soap300}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap="m">
        <Flex flexDirection="column" gap="xxs" flex={1}>
          <BodyText size="small" style={{ fontWeight: 700 }}>
            {title}
          </BodyText>
          {subtitle && (
            <BodyText size="small" color={colors.blackPepper500}>
              {subtitle}
            </BodyText>
          )}
          {metadataArray.map((m, idx) => (
            <BodyText key={idx} size="small" color={colors.blackPepper500} style={{ fontSize: 12 }}>
              {m}
            </BodyText>
          ))}
        </Flex>
        {trailingElement && <Box>{trailingElement}</Box>}
      </Flex>
    </Box>
  );
};
