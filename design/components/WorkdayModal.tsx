import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { SANA_CARD_RADIUS_LG } from './sanaShellTheme';
import { colors } from '@workday/canvas-kit-react/tokens';
import { xIcon } from '@workday/canvas-system-icons-web';

export interface WorkdayModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  width?: string;
}

/**
 * WorkdayModal - Externally controlled modal with Sana Style
 *
 * Uses a React portal so the overlay always sits above the page.
 * Sana guidelines: SANA_CARD_RADIUS_LG, neutral surfaces,
 * Header / Body / Footer layout, proper button hierarchy.
 */
export const WorkdayModal: React.FC<WorkdayModalProps> = ({
  title,
  children,
  isOpen,
  onClose,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText = 'Cancel',
  width = '500px',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Box
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Overlay backdrop */}
      <Box
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      />

      {/* Card */}
      <Box
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          width,
          maxWidth: '90vw',
          borderRadius: SANA_CARD_RADIUS_LG,
          backgroundColor: colors.frenchVanilla100,
          border: `1px solid ${colors.soap300}`,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          padding="m"
          style={{ borderBottom: `1px solid ${colors.soap300}` }}
        >
          <Heading size="small" style={{ margin: 0 }}>{title}</Heading>
          <TertiaryButton icon={xIcon} aria-label="Close" onClick={onClose} size="small" />
        </Flex>

        {/* Body */}
        <Box padding="l" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {children}
        </Box>

        {/* Footer */}
        <Flex
          gap="s"
          padding="m"
          justifyContent="flex-end"
          style={{
            borderTop: `1px solid ${colors.soap300}`,
            backgroundColor: colors.soap100,
          }}
        >
          <SecondaryButton onClick={onClose}>
            {secondaryActionText}
          </SecondaryButton>
          {primaryActionText && onPrimaryAction && (
            <PrimaryButton onClick={onPrimaryAction}>
              {primaryActionText}
            </PrimaryButton>
          )}
        </Flex>
      </Box>
    </Box>,
    document.body,
  );
};
