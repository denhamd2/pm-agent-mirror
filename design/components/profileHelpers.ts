/**
 * Profile component helpers
 * 
 * Shared utilities for profile pages
 */

import { CSSProperties } from 'react';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './sanaShellTheme';

/**
 * Standard card styling for profile pages
 * Matches Sana Style UI with rounded corners, subtle border, and shadow
 */
export function cardStyle(): CSSProperties {
  return {
    borderRadius: SANA_CARD_RADIUS_LG,
    border: `1px solid ${colors.soap300}`,
    backgroundColor: colors.frenchVanilla100,
    boxShadow: SANA_CARD_SHADOW,
  };
}
