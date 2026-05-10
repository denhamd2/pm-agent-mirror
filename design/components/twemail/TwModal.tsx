import React, { useEffect } from 'react';
import type { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { Flex, Box } from './layout';
import { Heading } from './typography';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './buttons';
import { TW } from './palette';
import { TwIcon } from './TwIcon';
import { xIcon } from '@workday/canvas-system-icons-web';

const MODAL_RADIUS_PX = 20;
const DESTRUCTIVE_MODAL_RADIUS_PX = 10;

const destructivePillBtn: CSSProperties = {
  fontFamily: 'inherit',
  cursor: 'pointer',
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13,
  padding: '8px 20px',
  borderStyle: 'solid',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export interface TwModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  width?: string;
  /**
   * `destructivePill` — compact confirm dialog: light header (no divider), black close icon,
   * flat footer (white), bottom-left actions: red pill primary first, outline pill cancel.
   */
  variant?: 'default' | 'destructivePill';
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
  variant = 'default',
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

  const isDestructivePill = variant === 'destructivePill';
  const modalRadius = isDestructivePill ? DESTRUCTIVE_MODAL_RADIUS_PX : MODAL_RADIUS_PX;

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
          borderRadius: modalRadius,
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
          style={{
            borderBottom: isDestructivePill ? 'none' : `1px solid ${TW.soap300}`,
          }}
        >
          <Heading
            size="small"
            style={{ margin: 0, ...(isDestructivePill ? { fontWeight: 700 as const } : {}) }}
          >
            {title}
          </Heading>
          {isDestructivePill ? (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TwIcon icon={xIcon} size={20} color={TW.blackPepper600} />
            </button>
          ) : (
            <TertiaryButton size="small" aria-label="Close" onClick={onClose} icon={xIcon} />
          )}
        </Flex>

        <Box padding="l" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {children}
        </Box>

        <Flex
          gap="s"
          padding="m"
          justifyContent={isDestructivePill ? 'flex-start' : 'flex-end'}
          style={{
            borderTop: isDestructivePill ? 'none' : `1px solid ${TW.soap300}`,
            backgroundColor: isDestructivePill ? TW.frenchVanilla100 : TW.soap100,
          }}
        >
          {isDestructivePill ? (
            <>
              {primaryActionText && onPrimaryAction ? (
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  style={{
                    ...destructivePillBtn,
                    borderWidth: 0,
                    backgroundColor: TW.cinnamon500,
                    color: TW.frenchVanilla100,
                  }}
                >
                  {primaryActionText}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                style={{
                  ...destructivePillBtn,
                  borderWidth: 1,
                  borderColor: TW.blackPepper600,
                  backgroundColor: TW.frenchVanilla100,
                  color: TW.blackPepper600,
                }}
              >
                {secondaryActionText}
              </button>
            </>
          ) : (
            <>
              <SecondaryButton onClick={onClose}>{secondaryActionText}</SecondaryButton>
              {primaryActionText && onPrimaryAction ? (
                <PrimaryButton onClick={onPrimaryAction}>{primaryActionText}</PrimaryButton>
              ) : null}
            </>
          )}
        </Flex>
      </Box>
    </Box>,
    document.body,
  );
}
