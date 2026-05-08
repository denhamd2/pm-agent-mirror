import React from 'react';
import type { CSSProperties } from 'react';
import { resolveSpacing, type SpaceToken } from './layout';
import { TW } from './palette';

/** Matches legacy `profileHelpers.cardStyle` / Sana card shell — merge into `Card` via `style`. */
export function twProfileCardStyle(): CSSProperties {
  return {
    borderRadius: 20,
    border: `1px solid ${TW.soap300}`,
    backgroundColor: TW.frenchVanilla100,
    boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
  };
}

export interface TwCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SpaceToken | number | string;
  marginBottom?: SpaceToken | number | string;
  marginTop?: SpaceToken | number | string;
}

export function Card({ padding = 'l', marginBottom, marginTop, style, children, ...rest }: TwCardProps) {
  const p = resolveSpacing(padding);
  const mb = resolveSpacing(marginBottom);
  const mt = resolveSpacing(marginTop);
  const cardStyle: CSSProperties = {
    borderRadius: 20,
    border: `1px solid ${'#DFE2E6'}`,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
    padding: p,
    marginBottom: mb,
    marginTop: mt,
    boxSizing: 'border-box',
    ...style,
  };
  return (
    <div {...rest} style={cardStyle}>
      {children}
    </div>
  );
}
