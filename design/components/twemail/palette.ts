/**
 * 2-way email prototype palette — literal hex values (no Canvas Kit tokens dependency).
 * Tune against [`design/reference-screens/2way-email-refs/`](../reference-screens/2way-email-refs/).
 */

export const TW = {
  frenchVanilla100: '#FFFFFF',
  soap100: '#F0F2F4',
  soap200: '#E8EAEC',
  soap300: '#DFE2E6',
  soap400: '#C5C8CC',
  blackPepper300: '#949494',
  blackPepper400: '#6B6B6B',
  blackPepper500: '#494949',
  blackPepper600: '#333333',
  licorice300: '#6B6B6B',
  blueberry100: '#E8F2FD',
  blueberry200: '#CCE4FA',
  blueberry400: '#0875E1',
  blueberry500: '#0875E1',
  blueberry600: '#005CB9',
  greenApple100: '#E7F4E5',
  greenApple400: '#4B830D',
  cinnamon500: '#C23934',
  cinnamon600: '#A82E29',
  cantaloupe100: '#FFF5E6',
  cantaloupe400: '#F59E0B',
} as const;

/** Canvas spacing scale — px (aligned with CK space tokens used previously). */
export const SPACE = {
  zero: 0,
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
} as const;

export type SpaceToken = keyof typeof SPACE;

/** Maps spacing tokens (`m`, `s`, …) to px; passes numbers through. */
export function resolveSpacing(v: SpaceToken | number | string | undefined): string | number | undefined {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v in SPACE) return SPACE[v as SpaceToken];
  return v;
}

export function spacePx(k?: SpaceToken | keyof typeof SPACE | number): number | undefined {
  if (k === undefined) return undefined;
  if (typeof k === 'number') return k;
  return SPACE[k as keyof typeof SPACE];
}
