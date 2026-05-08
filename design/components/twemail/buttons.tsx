import React from 'react';
import type { CSSProperties } from 'react';
import type { CanvasSystemIcon } from '@workday/design-assets-types';
import { TW } from './palette';
import { TwIcon } from './TwIcon';

const baseBtn: CSSProperties = {
  fontFamily: 'inherit',
  cursor: 'pointer',
  borderRadius: 4,
  fontWeight: 600,
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderStyle: 'solid',
};

export interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium';
  /** Optional leading icon (Canvas system icon SVG bundle). */
  icon?: CanvasSystemIcon;
}

export function PrimaryButton({ style, size = 'medium', children, ...rest }: BtnProps) {
  const pad = size === 'small' ? '6px 12px' : '10px 18px';
  const fs = size === 'small' ? 13 : 14;
  return (
    <button
      type="button"
      {...rest}
      style={{
        ...baseBtn,
        padding: pad,
        fontSize: fs,
        borderWidth: 0,
        backgroundColor: TW.blueberry500,
        color: TW.frenchVanilla100,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ style, size = 'medium', children, ...rest }: BtnProps) {
  const pad = size === 'small' ? '6px 12px' : '10px 18px';
  const fs = size === 'small' ? 13 : 14;
  return (
    <button
      type="button"
      {...rest}
      style={{
        ...baseBtn,
        padding: pad,
        fontSize: fs,
        borderWidth: 1,
        borderColor: TW.soap400,
        backgroundColor: TW.frenchVanilla100,
        color: TW.blackPepper600,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function TertiaryButton({ style, size = 'medium', children, icon, ...rest }: BtnProps) {
  const pad = size === 'small' ? '6px 10px' : '8px 14px';
  const fs = size === 'small' ? 13 : 14;
  const iconSize = size === 'small' ? 18 : 22;
  return (
    <button
      type="button"
      {...rest}
      style={{
        ...baseBtn,
        padding: pad,
        fontSize: fs,
        borderWidth: 0,
        backgroundColor: 'transparent',
        color: TW.blueberry600,
        gap: icon && children ? 6 : baseBtn.gap,
        ...style,
      }}
    >
      {icon ? <TwIcon icon={icon} size={iconSize} color={TW.blueberry600} /> : null}
      {children}
    </button>
  );
}

export interface ToolbarIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: CanvasSystemIcon;
  'aria-label': string;
}

export function ToolbarIconButton({ icon, style, ...rest }: ToolbarIconButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        padding: 0,
        border: 'none',
        borderRadius: 4,
        backgroundColor: 'transparent',
        cursor: 'pointer',
        ...style,
      }}
    >
      <TwIcon icon={icon} size={24} color={TW.blackPepper600} />
    </button>
  );
}
