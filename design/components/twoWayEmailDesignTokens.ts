/**
 * 2-Way Email (Conversational Email) — **standalone** design tokens for the recruiting prototype.
 * Do not import `sanaShellTheme` here; values are either measured from canonical captures or named
 * aliases over Canvas Kit semantic colors for clarity.
 *
 * Visual targets:
 * - [`design/reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png`](../reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png)
 * - [`design/reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png`](../reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png)
 */
import { TW } from './twemail/palette';

// --- Dock rail (active mail tile) — literals from Overview family / former recruiting parity ---

/** Light blue fill behind active channel icon on the collaboration rail (`#D6E7FD`). */
export const TWEMAIL_RAIL_TILE_ACTIVE_BG = '#D6E7FD';

/** Active rail tile corners — **square** (0px); no rounded rect on mail/chat/WhatsApp rail selection. */
export const TWEMAIL_RAIL_TILE_RADIUS_PX = 0;

/** 1px inset ring / primary accent on active tile (`#005CB9`). */
export const TWEMAIL_RAIL_ACCENT = '#005CB9';

/** Expanded collaboration dock sheet elevation (same geometry as legacy panel shadow). */
export const TWEMAIL_PANEL_SHADOW =
  '-8px 0 32px rgba(15, 46, 102, 0.20), -2px 0 8px rgba(15, 46, 102, 0.10)';

// --- Thread list (semantic aliases over Canvas Kit) ---

/** Mail thread list column canvas — cool grey (`#F4F6F8`, PM capture `Screenshot_2026-05-08_at_16.07.45`). */
export const TWEMAIL_THREAD_LIST_CANVAS_BG = '#F4F6F8';

/** Selected thread row background — same light-blue wash as active mail rail tile (`TWEMAIL_RAIL_TILE_ACTIVE_BG`). */
export const TWEMAIL_THREAD_SELECTED_BG = TWEMAIL_RAIL_TILE_ACTIVE_BG;
/**
 * 4px left stripe on the **active** collaboration-rail channel tile (mail / chat / WhatsApp).
 * Selected thread row uses fill only — no left stripe (Overview family parity).
 */
export const TWEMAIL_THREAD_SELECTED_BAR = TW.blueberry500;
/** Hover wash slightly darker than list canvas (`#EDF0F3`). */
export const TWEMAIL_THREAD_ROW_HOVER_BG = '#EDF0F3';

// --- Structural borders / dividers (compose, split pane, toolbar — replaces misleading “SANA_SOAP” locals) ---

export const TWEMAIL_DIVIDER_SUBTLE = TW.soap200;

/** Horizontal rules between thread rows — mail list pane (`#E0E4E8`, capture parity). */
export const TWEMAIL_THREAD_DIVIDER = '#E0E4E8';
export const TWEMAIL_DIVIDER = TW.soap300;
export const TWEMAIL_BORDER_STRONG = TW.soap400;

// --- Primary actions (+ New, dock chrome) ---

export const TWEMAIL_PRIMARY_BLUE = TW.blueberry500;
export const TWEMAIL_PRIMARY_FG_ON_BLUE = TW.frenchVanilla100;
/** Dock CTAs (+ New, Compose Email, empty-state primary) — pill ends vs 4px “square” corners (Overview / Compose refs). */
export const TWEMAIL_PRIMARY_BUTTON_RADIUS_PX = 999;
export const TWEMAIL_DOCK_ICON_BUTTON_RADIUS_PX = 4;

// --- Rail notification badge (numeric unread on mail icon) ---

export const TWEMAIL_RAIL_BADGE_BG = TW.blueberry500;
export const TWEMAIL_RAIL_BADGE_FG = TW.frenchVanilla100;

export const TWEMAIL_RAIL_ICON_ACTIVE = TW.blueberry500;
export const TWEMAIL_RAIL_ICON_IDLE = TW.blackPepper400;

// --- E2E walkthrough / doc gallery shell (formerly `SANA_PAGE_CANVAS` / card chrome in e2e only) ---

/** Page canvas behind wide layouts */
export const TWEMAIL_DOC_PAGE_BG = '#F3F5F7';

export const TWEMAIL_DOC_CARD_RADIUS_LG = 20;

export const TWEMAIL_DOC_CARD_SHADOW = '0 1px 2px rgba(15, 46, 102, 0.04)';
