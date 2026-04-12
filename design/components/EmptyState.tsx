import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton } from '@workday/canvas-kit-react/button';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { colors } from '@workday/canvas-kit-react/tokens';
import { CanvasSystemIcon } from '@workday/design-assets-types';

export interface EmptyStateProps {
  /** The icon to display above the text */
  icon: CanvasSystemIcon;
  /** The main heading text */
  title: string;
  /** The descriptive body text */
  description: string;
  /** Optional primary action text */
  actionText?: string;
  /** Optional callback when primary action is clicked */
  onAction?: () => void;
  /** Optional padding override (defaults to 'xl') */
  padding?: string;
}

/**
 * EmptyState - Standardized empty state pattern
 * 
 * Combines an icon, heading, description, and optional CTA.
 * Ensures consistent spacing and alignment when lists or grids are empty.
 * 
 * @example
 * ```tsx
 * <EmptyState 
 *   icon={userIcon}
 *   title="No candidates found"
 *   description="Try adjusting your filters or search terms."
 *   actionText="Clear filters"
 *   onAction={handleClearFilters}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  padding = 'xl',
}) => {
  return (
    <Flex 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      padding={padding}
      style={{ textAlign: 'center' }}
    >
      <Box 
        style={{ 
          backgroundColor: colors.soap100, 
          borderRadius: '50%', 
          padding: '16px',
          marginBottom: '16px',
          display: 'inline-flex'
        }}
      >
        <SystemIcon icon={icon} size={32} color={colors.blackPepper500} />
      </Box>
      <Heading size="small" marginBottom="xxs" color={colors.blackPepper600}>
        {title}
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom={actionText ? 'm' : 'zero'}>
        {description}
      </BodyText>
      {actionText && onAction && (
        <PrimaryButton onClick={onAction}>
          {actionText}
        </PrimaryButton>
      )}
    </Flex>
  );
};
