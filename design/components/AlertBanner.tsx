import React from 'react';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Box } from '@workday/canvas-kit-react/layout';

export interface AlertBannerProps {
  /** The message to display in the banner */
  message: string;
  /** The type of alert (error = red, warning = yellow) */
  type?: 'error' | 'warning';
  /** Optional call to action text (e.g. "View details") */
  actionText?: string;
  /** Action to perform when the banner is clicked */
  onClick?: () => void;
  /** Whether the banner is sticky (full width, no rounded corners on one side) */
  isSticky?: boolean;
}

/**
 * AlertBanner - Standardized Canvas Kit Banner wrapper
 * 
 * Used for system-level alerts, validation errors, and warnings.
 * Enforces the rule: Do not use warning Banners for mock data disclaimers 
 * (use neutral BodyText at the bottom of the page instead).
 * 
 * @example
 * ```tsx
 * <AlertBanner 
 *   type="error" 
 *   message="3 candidates failed background checks" 
 *   actionText="Review"
 *   onClick={() => handleReview()}
 * />
 * ```
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  type = 'warning',
  actionText,
  onClick,
  isSticky = false,
}) => {
  const hasError = type === 'error';

  return (
    <Box marginBottom="m">
      <Banner 
        hasError={hasError} 
        isSticky={isSticky} 
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <Banner.Icon />
        <Banner.Label>{message}</Banner.Label>
        {actionText && <Banner.ActionText>{actionText}</Banner.ActionText>}
      </Banner>
    </Box>
  );
};
