/**
 * Sana-aligned shell tokens for Canvas Kit prototypes (see design/references/sana/).
 * Tuned to Sana-fied Workday reference: WHITE top nav with a GREY pill search (reference frames:
 * `design/references/ssa-create-req-videos/frames-overlap/ov-2700.png`, `ov-5400.png`). The left
 * icon rail and secondary hub column remain cool-grey so the shell columns still read as one band.
 */

/** Page canvas behind cards (reference ~#F3F5F7) */
export const SANA_PAGE_CANVAS = '#F3F5F7';

/**
 * Top navigation bar background — WHITE.
 * Reference frames: `design/references/ssa-create-req-videos/frames-overlap/ov-2700.png`
 * and `ov-5400.png` (homepage). The nav sits on white; what distinguishes homepage vs
 * app pages is the *bottom edge* — homepage gets the brand gradient bar below, all other
 * pages get a 1px `SANA_TOP_NAV_DIVIDER` hairline.
 */
export const SANA_TOP_NAV_BG = '#FFFFFF';

/**
 * Cool grey used for the shell columns under the nav (left icon rail + secondary hub column).
 * Exported explicitly so callers don't accidentally re-couple the rail to the nav surface.
 */
export const SANA_SHELL_COLUMN_BG = '#F3F4F6';

/** Primary left icon rail — stays cool grey (decoupled from the now-white top nav). */
export const SANA_PRIMARY_RAIL_BG = SANA_SHELL_COLUMN_BG;

/** Secondary hub column (tabs list) — same cool grey as the icon rail. */
export const SANA_SECONDARY_NAV_BG = SANA_SHELL_COLUMN_BG;

/** Active section tab pill — slightly darker than the rail so selection reads clearly */
export const SANA_SECONDARY_TAB_ACTIVE_BG = '#E5E7EB';

/** Inactive tab label (medium grey on grey rail) */
export const SANA_SECONDARY_TAB_INACTIVE_FG = '#6B6B6B';

/** Active tab label (near-black) */
export const SANA_SECONDARY_TAB_ACTIVE_FG = '#1D1D1D';

/**
 * Global search / ask field fill — GREY pill on the white top nav.
 * Matches the reference frames: grey, slightly recessed pill sitting on the white surface.
 */
export const SANA_SEARCH_FIELD_BG = '#F3F4F6';

// --- Top-nav underline treatment (homepage vs app pages) ---

/**
 * Hairline divider under the top nav on every non-homepage page (1px).
 * Kept as a named token so rules + reviewer checklists can point at the canonical colour.
 */
export const SANA_TOP_NAV_DIVIDER = '#E5E7EB';

/**
 * Homepage accent bar — Workday brand gradient rendered as a thick horizontal band
 * immediately below the top nav on homepage / welcome surfaces (see `ov-5400.png`:
 * "Welcome back, Harry"). Do NOT use on app / task pages — those get the 1px
 * `SANA_TOP_NAV_DIVIDER` instead.
 *
 * Stops approximate the brand spectrum: navy → blue → violet → mauve → peach → orange.
 */
export const SANA_HOMEPAGE_GRADIENT =
  'linear-gradient(90deg, ' +
  '#1E3A8A 0%, ' +
  '#2E6BC6 18%, ' +
  '#6E6BC2 38%, ' +
  '#B67BB6 58%, ' +
  '#E8B8AE 78%, ' +
  '#F3A160 90%, ' +
  '#EC7A2F 100%)';

/** Height of the homepage gradient accent bar in pixels. */
export const SANA_HOMEPAGE_GRADIENT_HEIGHT_PX = 8;

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
