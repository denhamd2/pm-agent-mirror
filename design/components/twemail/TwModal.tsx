import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Flex, Box } from './layout';
import { Heading } from './typography';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './buttons';
import { TW } from './palette';
import { xIcon } from '@workday/canvas-system-icons-web';

const MODAL_RADIUS_PX = 20;

export interface TwModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  width?: string;
}

/** Portal modal — bespoke TW palette (no Canvas Kit). */
export function TwModal({
  title,
  children,
  isOpen,
  onClose,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText = 'Cancel',
  width = '500px',
}: TwModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      />

      <Box
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          width,
          maxWidth: '90vw',
          borderRadius: MODAL_RADIUS_PX,
          backgroundColor: TW.frenchVanilla100,
          border: `1px solid ${TW.soap300}`,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          padding="m"
          style={{ borderBottom: `1px solid ${TW.soap300}` }}
        >
          <Heading size="small" style={{ margin: 0 }}>
            {title}
          </Heading>
          <TertiaryButton size="small" aria-label="Close" onClick={onClose} icon={xIcon} />
        </Flex>

        <Box padding="l" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {children}
        </Box>

        <Flex
          gap="s"
          padding="m"
          justifyContent="flex-end"
          style={{
            borderTop: `1px solid ${TW.soap300}`,
            backgroundColor: TW.soap100,
          }}
        >
          <SecondaryButton onClick={onClose}>{secondaryActionText}</SecondaryButton>
          {primaryActionText && onPrimaryAction ? (
            <PrimaryButton onClick={onPrimaryAction}>{primaryActionText}</PrimaryButton>
          ) : null}
        </Flex>
      </Box>
    </Box>,
    document.body,
  );
}
