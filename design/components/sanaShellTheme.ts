/**
 * Sana-aligned shell tokens for Canvas Kit prototypes (see design/references/sana/).
 * Tuned to Sana-fied Workday reference (neutral greys, white search field on grey top bar, labelled icon rail).
 */

/** Page canvas behind cards (reference ~#F3F5F7) */
export const SANA_PAGE_CANVAS = '#F3F5F7';

/** Top navigation bar background (light grey strip; white W mark + white pill search sit on this) */
export const SANA_TOP_NAV_BG = '#F3F4F6';

/** Primary left icon rail — match top bar for one continuous grey band */
export const SANA_PRIMARY_RAIL_BG = SANA_TOP_NAV_BG;

/** Secondary hub column (tabs list) — same cool grey as icon rail (Sana reference; blends with rail) */
export const SANA_SECONDARY_NAV_BG = SANA_PRIMARY_RAIL_BG;

/** Active section tab pill — slightly darker than rail so selection reads clearly */
export const SANA_SECONDARY_TAB_ACTIVE_BG = '#E5E7EB';

/** Inactive tab label (medium grey on grey rail) */
export const SANA_SECONDARY_TAB_INACTIVE_FG = '#6B6B6B';

/** Active tab label (near-black) */
export const SANA_SECONDARY_TAB_ACTIVE_FG = '#1D1D1D';

/** Global search / ask field fill (white pill on grey top bar) */
export const SANA_SEARCH_FIELD_BG = '#FFFFFF';

/** Link and primary action accent (reference ~#005CB9–#0078D4) */
export const SANA_LINK_ACCENT = '#005CB9';

/** Dense notification badge red (reference ~#D73B3E); CK cinnamon is close */
export const SANA_BADGE_RED = '#D73B3E';

export const SANA_CARD_RADIUS_LG = 20;
export const SANA_SHELL_RADIUS = 24;
/** Section tabs in secondary column: pill highlight (Sana) */
export const SANA_TAB_PILL_RADIUS = 999;

export const SANA_CARD_SHADOW = '0 1px 2px rgba(15, 46, 102, 0.04)';
export const SANA_CARD_SHADOW_LIFTED = '0 1px 3px rgba(15, 46, 102, 0.08)';

/** Sliding panel depth shadow (2-layer for prominence on overlays) */
export const SANA_PANEL_SHADOW = '-8px 0 32px rgba(15, 46, 102, 0.20), -2px 0 8px rgba(15, 46, 102, 0.10)';

/** Primary icon rail — wide enough for stacked icon + uppercase label (Sana reference) */
export const SANA_PRIMARY_RAIL_WIDTH_PX = 64;

/** Secondary text nav column */
export const SANA_SECONDARY_NAV_WIDTH_PX = 232;

// --- Communication dock (sliding panel: Email, SMS, Notes, LINE, WhatsApp, etc.) ---

/** Message bubble corner radius (Sana reference: soft ~12px) */
export const SANA_COMM_MESSAGE_RADIUS_PX = 12;

/** Composer row: fully rounded pill */
export const SANA_COMM_COMPOSER_RADIUS_PX = 999;

/** Sliding panel inner surface (white card field) */
export const SANA_COMM_PANEL_SURFACE = '#FFFFFF';

/** Active channel tile on the narrow rail — light blue square (Sana reference) */
export const SANA_COMM_RAIL_ACTIVE_BG = '#E3F2FD';

/** Rail active tile icon / focus accent */
export const SANA_COMM_RAIL_ACTIVE_ICON = SANA_LINK_ACCENT;

/** Incoming / outgoing bubble fill */
export const SANA_COMM_BUBBLE_BG = '#FFFFFF';

/** Timestamp and meta in thread */
export const SANA_COMM_META_FG = '#6B6B6B';
