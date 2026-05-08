import React from 'react';
import type { CSSProperties } from 'react';
import { resolveSpacing, type SpaceToken } from './layout';

const BODY_SMALL: CSSProperties = { fontSize: 14, lineHeight: 1.4 };
const BODY_MEDIUM: CSSProperties = { fontSize: 16, lineHeight: 1.5 };
const SUB_SMALL: CSSProperties = { fontSize: 12, lineHeight: 1.35 };

export interface TwHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'small' | 'medium' | 'large';
  marginBottom?: SpaceToken | number | string;
  marginTop?: SpaceToken | number | string;
  marginY?: SpaceToken | number;
}

export function Heading({ size = 'medium', style, marginBottom, marginTop, marginY, ...rest }: TwHeadingProps) {
  const mb = resolveSpacing(marginBottom);
  const mt = resolveSpacing(marginTop);
  const my = resolveSpacing(marginY);
  const sz =
    size === 'large'
      ? { fontSize: 22, fontWeight: 700 }
      : size === 'small'
        ? { fontSize: 16, fontWeight: 700 }
        : { fontSize: 18, fontWeight: 700 };
  return (
    <h2
      {...rest}
      style={{
        margin: 0,
        ...sz,
        marginTop: my ?? mt,
        marginBottom: my ?? mb,
        ...style,
      }}
    />
  );
}

export interface TwBodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'small' | 'medium';
  fontWeight?: CSSProperties['fontWeight'];
}

export function BodyText({ size = 'medium', style, fontWeight, ...rest }: TwBodyProps) {
  return (
    <p
      {...rest}
      style={{
        margin: 0,
        ...(size === 'small' ? BODY_SMALL : BODY_MEDIUM),
        fontWeight,
        ...style,
      }}
    />
  );
}

export interface TwSubProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'small';
}

export function Subtext({ size = 'small', style, ...rest }: TwSubProps) {
  return (
    <p
      {...rest}
      style={{
        margin: 0,
        ...SUB_SMALL,
        ...style,
      }}
    />
  );
}
