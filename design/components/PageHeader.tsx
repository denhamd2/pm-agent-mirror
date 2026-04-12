import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';

export interface PageHeaderProps {
  /** The main page title */
  title: string;
  /** Optional subtitle or context line below the title */
  subtitle?: string;
  /** Optional primary action text (e.g. "Create Requisition") */
  primaryActionText?: string;
  /** Callback when primary action is clicked */
  onPrimaryAction?: () => void;
  /** Optional secondary action text (e.g. "Export") */
  secondaryActionText?: string;
  /** Callback when secondary action is clicked */
  onSecondaryAction?: () => void;
  /** Optional custom content to render on the right side instead of buttons */
  trailingContent?: React.ReactNode;
}

/**
 * PageHeader - Standardized top-of-page component
 * 
 * Enforces the strict "No Breadcrumbs" rule by providing a clear
 * primary Page Title (`<Heading size="large">`) at the top of the main
 * content area before any tabs or cards.
 * 
 * @example
 * ```tsx
 * <PageHeader 
 *   title="Recruiter Hub" 
 *   subtitle="Manage your active requisitions and candidates"
 *   primaryActionText="New Requisition"
 *   onPrimaryAction={() => handleNewReq()}
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  trailingContent,
}) => {
  return (
    <Flex 
      alignItems="center" 
      justifyContent="space-between" 
      marginBottom="l"
      flexWrap="wrap"
      gap="m"
    >
      <Box>
        <Heading size="large" marginY="zero" color={colors.blackPepper600}>
          {title}
        </Heading>
        {subtitle && (
          <BodyText size="small" color={colors.blackPepper500} marginTop="xxs">
            {subtitle}
          </BodyText>
        )}
      </Box>

      {trailingContent ? (
        <Box>{trailingContent}</Box>
      ) : (
        <Flex gap="s" alignItems="center">
          {secondaryActionText && onSecondaryAction && (
            <SecondaryButton onClick={onSecondaryAction}>
              {secondaryActionText}
            </SecondaryButton>
          )}
          {primaryActionText && onPrimaryAction && (
            <PrimaryButton onClick={onPrimaryAction}>
              {primaryActionText}
            </PrimaryButton>
          )}
        </Flex>
      )}
    </Flex>
  );
};
