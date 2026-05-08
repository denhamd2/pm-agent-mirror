import React from 'react';
import { Flex } from './layout';
import { TW } from './palette';

export const StatusIndicatorType = {
  Red: 'Red',
} as const;

export const StatusIndicatorEmphasis = {
  Low: 'Low',
} as const;

export interface TwStatusIndicatorProps {
  label: string;
  type?: typeof StatusIndicatorType.Red;
  emphasis?: typeof StatusIndicatorEmphasis.Low;
}

/** Lightweight replacement for Canvas Kit StatusIndicator (error chip). */
function TwStatusIndicatorInner({
  label,
  type = StatusIndicatorType.Red,
  emphasis = StatusIndicatorEmphasis.Low,
}: TwStatusIndicatorProps) {
  void type;
  void emphasis;
  const fg = TW.cinnamon600;
  const dot = TW.cinnamon500;
  return (
    <Flex alignItems="center" gap="xxs" style={{ flexShrink: 0 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: dot,
        }}
        aria-hidden
      />
      <span style={{ fontSize: 11, fontWeight: 600, color: fg }}>{label}</span>
    </Flex>
  );
}

export const StatusIndicator = Object.assign(TwStatusIndicatorInner, {
  Type: StatusIndicatorType,
  Emphasis: StatusIndicatorEmphasis,
});
