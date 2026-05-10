import React from 'react';
import { TW } from './palette';

/** Top-right compose summary — Figma-style: solid red bar, square corners, “N Errors”. */
export function ComposeInlineErrorSummary({ count }: { count: number }) {
  if (count < 1) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        padding: '8px 14px',
        borderRadius: 0,
        backgroundColor: TW.cinnamon600,
        color: TW.frenchVanilla100,
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.2,
        boxSizing: 'border-box',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: TW.frenchVanilla100,
          color: TW.cinnamon600,
          fontSize: 13,
          fontWeight: 800,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        !
      </span>
      <span>
        {count} {count === 1 ? 'Error' : 'Errors'}
      </span>
    </div>
  );
}
