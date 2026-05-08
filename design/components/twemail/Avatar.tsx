import React from 'react';
import { TW } from './palette';

export function Avatar({ size = 40 }: { size?: number }) {
  const s = typeof size === 'number' ? size : 40;
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        backgroundColor: TW.soap200,
        flexShrink: 0,
      }}
      aria-hidden
    />
  );
}
