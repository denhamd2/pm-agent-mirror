/**
 * Conversational Email dock — prototype shell tokens aligned to canonical PM captures.
 *
 * Visual targets (overlay / flip-test at 1440×900):
 * - [`design/reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png`](../reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png) — list + filter + rail
 * - [`design/reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png`](../reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png) — split read + rail
 *
 * These values intentionally bypass Canvas Kit component chrome for **shell-only** surfaces
 * (collaboration rail tiles, dock header + New, thread list chrome) so styling matches PNGs
 * without fighting `PrimaryButton` / `TertiaryButton` internals. Compose body / profile shell
 * may continue to use Canvas Kit.
 *
 * Canonical literals live in `./twoWayEmailDesignTokens` (no `sanaShellTheme`).
 */
import type { CSSProperties } from 'react';
import {
  TWEMAIL_DOCK_ICON_BUTTON_RADIUS_PX,
  TWEMAIL_PRIMARY_BLUE,
  TWEMAIL_PRIMARY_BUTTON_RADIUS_PX,
  TWEMAIL_PRIMARY_FG_ON_BLUE,
  TWEMAIL_RAIL_ACCENT,
  TWEMAIL_RAIL_BADGE_BG,
  TWEMAIL_RAIL_BADGE_FG,
  TWEMAIL_RAIL_ICON_ACTIVE,
  TWEMAIL_RAIL_ICON_IDLE,
  TWEMAIL_RAIL_TILE_ACTIVE_BG,
  TWEMAIL_RAIL_TILE_RADIUS_PX,
  TWEMAIL_THREAD_DIVIDER,
  TWEMAIL_THREAD_ROW_HOVER_BG,
  TWEMAIL_THREAD_SELECTED_BAR,
  TWEMAIL_THREAD_SELECTED_BG,
} from './twoWayEmailDesignTokens';

/** Repo-relative path to committed Overview / Compose reference PNGs (for docs / tooling). */
export const CONVERSATIONAL_EMAIL_REFERENCE_SCREEN_DIR = 'design/reference-screens/2way-email-refs';

/** Mail channel tile — light blue rect behind envelope when active (square corners; full-bleed within rail hit target). */
export const CONV_EMAIL_RAIL_TILE_ACTIVE_BG = TWEMAIL_RAIL_TILE_ACTIVE_BG;

/** 1px inset ring / icon accent on active tile (canonical link blue). */
export const CONV_EMAIL_RAIL_TILE_RING = TWEMAIL_RAIL_ACCENT;

/** Tile corner radius — **square** (`TWEMAIL_RAIL_TILE_RADIUS_PX`); collaboration rail has no rounded corners. */
export const CONV_EMAIL_RAIL_TILE_RADIUS_PX = TWEMAIL_RAIL_TILE_RADIUS_PX;

export const CONV_EMAIL_RAIL_ICON_ACTIVE = TWEMAIL_RAIL_ICON_ACTIVE;
export const CONV_EMAIL_RAIL_ICON_IDLE = TWEMAIL_RAIL_ICON_IDLE;

/** Numeric badge on mail rail icon (unread count). */
export const CONV_EMAIL_RAIL_BADGE_BG = TWEMAIL_RAIL_BADGE_BG;
export const CONV_EMAIL_RAIL_BADGE_FG = TWEMAIL_RAIL_BADGE_FG;

/** Thread list row — selected background (no left stripe; stripe is on the rail tile only). */
export const CONV_EMAIL_THREAD_SELECTED_BG = TWEMAIL_THREAD_SELECTED_BG;
/** 4px left stripe on the active **collaboration-rail** tile (re-export of `TWEMAIL_THREAD_SELECTED_BAR`). */
export const CONV_EMAIL_THREAD_SELECTED_BAR = TWEMAIL_THREAD_SELECTED_BAR;
export const CONV_EMAIL_THREAD_ROW_HOVER_BG = TWEMAIL_THREAD_ROW_HOVER_BG;
export const CONV_EMAIL_THREAD_DIVIDER = TWEMAIL_THREAD_DIVIDER;

/** Dock header primary CTA (+ New, Send New Email) — flat fill vs CK button padding/theming. */
export function protoDockPrimaryButtonStyle(fullWidth?: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    lineHeight: 1.25,
    color: TWEMAIL_PRIMARY_FG_ON_BLUE,
    backgroundColor: TWEMAIL_PRIMARY_BLUE,
    border: 'none',
    borderRadius: TWEMAIL_PRIMARY_BUTTON_RADIUS_PX,
    cursor: 'pointer',
    boxSizing: 'border-box',
    ...(fullWidth ? { width: '100%' } : {}),
  };
}

/** Expand / collapse panel — square hit target, no CK tertiary chrome. */
export function protoDockIconButtonStyle(sizePx = 40): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizePx,
    height: sizePx,
    padding: 0,
    border: 'none',
    borderRadius: TWEMAIL_DOCK_ICON_BUTTON_RADIUS_PX,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}

/** Popover close control — slightly smaller icon button. */
export function protoDockPopoverCloseButtonStyle(): CSSProperties {
  return protoDockIconButtonStyle(32);
}
