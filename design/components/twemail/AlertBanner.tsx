import React from 'react';
import { TW } from './palette';

export interface TwAlertBannerProps {
  message: string;
  type?: 'error' | 'warning';
}

/** Bespoke banner — no Canvas Kit Banner. Error: square corners, pale red wash, left accent only, circular alert glyph. */
export function AlertBanner({ message, type = 'warning' }: TwAlertBannerProps) {
  const parts = message.split('\n\n');

  if (type === 'error') {
    return (
      <div
        role="alert"
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 0,
          backgroundColor: 'rgba(194, 57, 52, 0.06)',
          border: 'none',
          borderLeft: `6px solid ${TW.cinnamon600}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          boxSizing: 'border-box',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: TW.cinnamon600,
            color: TW.frenchVanilla100,
            fontSize: 13,
            fontWeight: 800,
            lineHeight: 1,
            flexShrink: 0,
            marginTop: 1,
            fontFamily: 'inherit',
          }}
        >
          !
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {parts.map((p, i) => (
            <p
              key={i}
              style={{
                margin: i === 0 ? 0 : '6px 0 0',
                fontWeight: i === 0 ? 700 : 400,
                fontSize: i === 0 ? 14 : 13,
                lineHeight: 1.45,
                color: i === 0 ? TW.blackPepper600 : TW.blackPepper500,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const bg = TW.cantaloupe100;
  const border = TW.cantaloupe400;
  return (
    <div
      style={{
        marginBottom: 16,
        padding: '12px 16px',
        borderRadius: 8,
        borderLeft: `4px solid ${border}`,
        backgroundColor: bg,
        fontSize: 14,
        lineHeight: 1.45,
        color: TW.blackPepper600,
      }}
      role="alert"
    >
      {parts.map((p, i) => (
        <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0', fontWeight: i === 0 ? 700 : 400 }}>
          {p}
        </p>
      ))}
    </div>
  );
}
