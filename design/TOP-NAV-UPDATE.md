# Top Navigation Spec

**Canonical component:** `design/components/WorkdayTopNav.tsx`
**Canonical tokens:** `design/components/sanaShellTheme.ts`
**Canonical rule:** `.cursor/rules/design-specific/015-sana-style-ui.md` → Colour → Top navigation bar
**Reviewer checklist:** `.cursor/rules/321-prototype-visual-reviewer.mdc` → Sana Style Adherence

Any prototype under `design/*.tsx` MUST use `WorkdayTopNav` for internal Workday surfaces. Do not reimplement the top chrome inline.

## Colour spec

| Element | Token | Hex | Notes |
|---------|-------|-----|-------|
| Top nav background | `SANA_TOP_NAV_BG` | `#FFFFFF` | White bar |
| Centre pill search | `SANA_SEARCH_FIELD_BG` | `#F3F4F6` | Grey pill with `soap300` hairline border; reads as a recessed affordance on the white bar |
| Left icon rail + secondary hub column | `SANA_SHELL_COLUMN_BG` (= `SANA_PRIMARY_RAIL_BG` = `SANA_SECONDARY_NAV_BG`) | `#F3F4F6` | Decoupled from the top nav — stays cool grey so the left shell columns still read as one band |
| Hairline divider under nav (all non-homepage) | `SANA_TOP_NAV_DIVIDER` | `#E5E7EB` | 1px |
| Homepage brand accent bar | `SANA_HOMEPAGE_GRADIENT` | `linear-gradient(90deg, #1E3A8A 0%, #2E6BC6 18%, #6E6BC2 38%, #B67BB6 58%, #E8B8AE 78%, #F3A160 90%, #EC7A2F 100%)` | Thick (`SANA_HOMEPAGE_GRADIENT_HEIGHT_PX` = 8px) multi-stop band; **homepage / welcome surfaces only** |

## Variant — chosen from page role, not look-of-the-week

```tsx
<WorkdayTopNav variant="home" … />   // Homepage / "Welcome back" surfaces
<WorkdayTopNav variant="app"  … />   // Default — SSA, hub, task, dashboard, search, list pages
```

- `variant="home"` → renders `SANA_HOMEPAGE_GRADIENT` as an 8px accent bar directly under the nav. No 1px divider.
- `variant="app"` (default) → renders a 1px `SANA_TOP_NAV_DIVIDER` hairline under the nav. No gradient.
- **Never render both at once.** Gradient on a non-homepage page, or a hairline on the homepage, is a Critical visual bug and must return to 320 for fix.

## Reference frames

| Variant | Reference frame (repo-native) |
|---------|-------------------------------|
| `home`  | `design/references/ssa-create-req-videos/frames-overlap/ov-5400.png` ("Welcome back, Harry") |
| `app`   | `design/references/ssa-create-req-videos/frames-overlap/ov-2700.png` (SSA Position Confirmation), `ov-1800.png` (SSA cold start) |

## Anatomy (left → right)

1. **Menu / W mark** — `WorkdayWMark` (orange swoosh + navy W, no white circle) on the white bar. `showMenuWordmark` optionally adds a hamburger + "MENU" wordmark before a tenant label.
2. **Centre pill search** — Canvas Kit `InputGroup` + `InputGroup.Input`; grey fill with `soap300` hairline border and subtle shadow; icon inset uses `searchIcon` from `@workday/canvas-system-icons-web`.
3. **Trailing utility cluster** — `ToolbarIconButton` icons (refresh, apps/reports, inbox, notifications, help, chat depending on `compactTrailing` / `showLayoutUtilities`), `CountBadge` on inbox / notifications, then `Avatar`.

## Props summary

| Prop | Purpose |
|------|---------|
| `variant` | `'home' \| 'app'` — decides underline treatment (gradient vs hairline). Default `'app'`. |
| `tenantLabel`, `showMenuWordmark`, `showWMark` | Left-cluster identity options |
| `searchPlaceholder`, `searchValue`, `onSearchChange`, `searchMaxWidthPx` | Pill search wiring |
| `notificationBadge`, `inboxBadge` | `CountBadge` counts on the trailing cluster |
| `showLayoutUtilities`, `compactTrailing`, `trailingActions` | Trailing cluster composition |

## Knock-on changes when this spec was introduced

- Flipped `SANA_TOP_NAV_BG` (was `#F3F4F6` grey) and `SANA_SEARCH_FIELD_BG` (was `#FFFFFF`).
- Introduced `SANA_SHELL_COLUMN_BG` so `SANA_PRIMARY_RAIL_BG` / `SANA_SECONDARY_NAV_BG` no longer follow the top nav to white — the rail / secondary column stay cool grey.
- Added `SANA_TOP_NAV_DIVIDER`, `SANA_HOMEPAGE_GRADIENT`, `SANA_HOMEPAGE_GRADIENT_HEIGHT_PX`.
- `WorkdayTopNav` gained the `variant` prop and renders the accent bar when `variant="home"`.
- Reviewer checklist (`321`) now flags both the colour flip and the variant mismatch.
- Design briefs (`candidate-smart-view-v86`, `create-offer-ssa`) updated to describe the new spec.
