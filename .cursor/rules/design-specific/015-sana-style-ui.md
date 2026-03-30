---
description: Sana Style UI design standards for Canvas Kit prototypes
globs:
  - "design/**/*"
  - "**/*.tsx"
  - "**/*.jsx"
alwaysApply: false
---

# Sana Style UI (prototypes and visual design)

Apply to **all** in-repo Canvas Kit prototypes under `design/`, Figma capture targets, and any agent output that specifies **screen layout, colour, typography, or radii** for Workday UI (especially **315** design briefs and **320** implementations).

## Intent
**Sana** prioritises a **neutral, calm** interface: **white and light grey** surfaces, **muted** accent use, and **soft geometry**. It is **not** the older pattern of large **blue** header bands and heavy blueberry fills for every chrome region.

## Colour
- **Page canvas (full viewport behind shell)**: Use shared **`SANA_PAGE_CANVAS`** from `design/components/sanaShellTheme.ts` (reference ~`#F3F5F7`) for prototypes that mirror the latest Sana benchmark, or the closest **`soap`** token if you must stay token-only.
- **Top navigation bar**: Use **`SANA_TOP_NAV_BG`** (~`#F3F4F6`) — light grey strip (not white). Centre **pill search** uses **`SANA_SEARCH_FIELD_BG`** (white) with a thin **`soap300`** border and subtle shadow; trailing utilities stay **dark outline** icons on the grey bar.
- **Primary left icon rail**: Use **`SANA_PRIMARY_RAIL_BG`** (same grey band as top bar for continuity) with **stacked icon + uppercase micro-label** under each icon (`design/references/sana/Sana_Style_UI-employee-profile-comm-dock.png`). No heavy border between rail and **secondary** column — they share one grey field.
- **Secondary hub column (vertical tabs)**: Use **`SANA_SECONDARY_NAV_BG`** (same cool grey as the icon rail). **Inactive** tab labels: medium grey (**`SANA_SECONDARY_TAB_INACTIVE_FG`**). **Active** tab: **pill** fill **`SANA_SECONDARY_TAB_ACTIVE_BG`** (slightly darker than the rail), label **bold** near-black (**`SANA_SECONDARY_TAB_ACTIVE_FG`**). For worker / candidate profile hubs, set **`WorkdayLeftTabBar`** **`showSecondaryTitleIcon`** so a **person** icon sits beside the hub title (Sana reference).
- **Page and panel backgrounds**: Light greys and off-whites for chrome; **`#FFFFFF`** or **`frenchVanilla100`** for main **content** cards only (not the left hub column).
- **Link / primary accent (hex reference)**: **`SANA_LINK_ACCENT`** (~`#005CB9`) for inline link colour where CK blueberry is too heavy; still prefer Canvas Kit for buttons and focus.
- **Primary structure**: White **cards** on grey **canvas**; thin **`soap300`** (or token-equivalent) borders and hairline dividers.
- **Blue and brand colour**: Use **sparingly** for **hyperlinks**, **primary actions**, **selected states**, and **focus rings**. Avoid painting whole sidebars or page headers in saturated blueberry unless the reference screen explicitly requires it (e.g. legacy candidate column). Prefer **neutral** rails and **subtle** selection fills.
- **Badges and alerts**: Keep existing semantic colours (e.g. cinnamon for notification counts) where CK provides them.

## Typography
- **Font stack**: **Roboto** with Canvas Kit text primitives (`Heading`, `BodyText`, `Text`); match CK type sizes rather than inventing px scales.
- **Hierarchy**: **Bold** module and card titles; **regular** body; **smaller** secondary labels and metadata (British English in copy).

## Shape and layout
- **Global search**: **Pill** (`border-radius` fully rounded) with icon inset, matching Sana reference density.
- **Navigation**: Active items use **pill** or **soft rounded** highlight containers, not sharp rectangles.
- **Cards**: Corner radius in the **16–20px** range unless a Canvas Kit component dictates otherwise; shared theme uses **`SANA_CARD_RADIUS_LG`** (~20px) for large content cards.
- **Main shell / large regions**: Where a single content well wraps the page body, **large** corner radii (order of **24px**; **`SANA_SHELL_RADIUS`**) may apply, consistent with Sana reference layouts.
- **Compact UI** (chips, message bubbles, small controls): **~12px** radius for a softer, conversational feel.

## Prototype shell (mandatory for `design/*.tsx` Recruiting prototypes)
- **`WorkdayTopNav`** (`design/components/WorkdayTopNav.tsx`): Grey bar (**`SANA_TOP_NAV_BG`**); Canvas Kit **`InputGroup`** + **`InputGroup.Input`** for **white** pill search; **`ToolbarIconButton`** utilities (dark icons); **`CountBadge`** on inbox/notifications; **`Avatar`**; optional tenant **`Heading`**. The **Workday logo** (`WorkdayWMark`) renders **without a white background circle** - just the orange swoosh and navy W directly on the grey bar for a cleaner appearance. Extend via props (`trailingActions`, `showMenuWordmark`, `showWMark`, `compactTrailing`, etc.); **do not** reimplement top chrome inline for new prototypes.
- **`WorkdayLeftTabBar`** (`design/components/WorkdayLeftTabBar.tsx`): Primary rail = **`SystemIcon`** + **uppercase micro-label** (9px, wide letter-spacing, pepper grey). Secondary column = **same grey** as rail; hub **`Heading`** + optional **`userIcon`**; section tabs = **full pill** radius, **inactive** medium grey / **active** darker grey pill + bold near-black (tokens in **`sanaShellTheme.ts`**). Do not use **`TertiaryButton`** for section tabs. Use on every full-page prototype unless the brief explicitly scopes a modal-only or single-panel demo.
- **No breadcrumbs in prototypes (hard rule)**: In **`design/*.tsx`** (and any future prototype entrypoints), do **not** import or render Canvas Kit **`Breadcrumbs`**, and do **not** build **ad hoc hierarchy strips** (labels separated by chevrons or slashes meant to read like a path, e.g. `Recruiting › Reqs › …`). **No exceptions** — not even when a PRD mentions hierarchy. Instead, you **MUST** use a primary Page Title (`<Heading size="large">`) at the top of the main content area to establish clear hierarchy before any tabs or cards. Secondary context belongs in subtitle lines, table captions, or metadata under the title — never a path strip.
- **`CommunicationDock`**: sliding column wrapped in Canvas Kit **`Card`** (`padding="zero"`); **defaults to collapsed** (user clicks rail icon to open). Narrow **right rail** uses **`communicationRailButtonStyle`** (Sana: **~10px rounded tile**, active channel = **light blue fill** + **link-colour** icon ring per `sanaShellTheme`). Panel **header** on **white** (`SANA_COMM_PANEL_SURFACE`); body fields use **shared comm patterns** below — **not** ad hoc 4px corners or soap100 fills for primary inputs.
- **Communication sliding panel (all channels)**: 
  - **WhatsApp, SMS, Notes, LINE** (simple messaging): Use `SanaCommComposer` + `SanaCommMessageBubble` inline per `SanaCommPanelPatterns.tsx`
  - **Email** (full-featured): Use `EmailPanel` component (950px width) - includes thread sidebar, rich text composer, Gmail-style expansion, templates, branding
  - **Email** (simple compose): Use `EmailComposer` component (no thread sidebar) - includes From/To/Cc/Subject + rich text
  - **Rich text** (any context): Use `RichTextEditor` component - functional formatting toolbar (Bold/Italic/Underline/Link/List)
  - **Thread expansion** (any channel): Use `ThreadExpansion` for Gmail-style inline collapsible history

## Depth and Shadows

**Card shadows (in-flow content):**
- Standard cards: `SANA_CARD_SHADOW` - subtle depth (`0 1px 2px rgba(15, 46, 102, 0.04)`)
- Lifted/hover: `SANA_CARD_SHADOW_LIFTED` - slightly more prominent (`0 1px 3px rgba(15, 46, 102, 0.08)`)

**Panel shadows (overlays and sliding drawers):**
- Sliding panels: `SANA_PANEL_SHADOW` - layered depth for overlays
  - Primary layer: `-8px 0 32px rgba(15, 46, 102, 0.20)` (wide blur, stronger opacity)
  - Secondary layer: `-2px 0 8px rgba(15, 46, 102, 0.10)` (tight edge definition)
  - Applied to Box wrapper (parent), NOT Card (avoids overflow:hidden clipping)
  - Use for: CommunicationDock, modal overlays, drawers, flyouts

**Implementation note:** When building sliding panels with `overflow: hidden` for animation, apply `boxShadow` to the animating container (Box wrapper), not to inner content (Card), to prevent shadow clipping.

- **Profile page layout component**: For hub-style pages (candidate profiles, worker profiles, requisition details, hiring manager views), use **`ProfilePageLayout`** (`design/components/ProfilePageLayout.tsx`) - handles header card (avatar, title, subtitle, actions), tab navigation via `WorkdayLeftTabBar`, optional `CommunicationDock` integration, and consistent Sana styling. Provide tab content via `renderTabContent` render prop. Reduces boilerplate from ~200 lines of shell code to ~30 lines of props. Ensures consistency across all profile pages.
- **Profile content patterns (Canvas Kit components)**: Within profile page tabs, ALWAYS use proper Canvas Kit components for common patterns:
  - **Skills/tags**: Use `StatusIndicator` with `type={StatusIndicator.Type.Gray}` and `emphasis={StatusIndicator.Emphasis.Low}` - NEVER custom Box with inline styling
  - **Status badges**: Use `StatusIndicator` with appropriate type (Blue for active, Green for success, Gray for inactive, Orange for caution) and Low emphasis
  - **Why**: Ensures Canvas Kit design tokens, WCAG contrast compliance, consistent shape (borderRadius.s), and accessibility
  - **See**: `design/README.md` Content Patterns section and `320-prototype-developer.mdc` for detailed examples
- **Candidate profile (full page)**: Follow **`design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png`** together with existing shell references: **large header card** on **light grey** with **avatar**, name line, job meta; **vertical sub-nav** in the secondary column with **pill** active state (**`WorkdayLeftTabBar`**); **white** rounded **content cards** on **`SANA_PAGE_CANVAS`** with **thin soap borders**; **two-column grid** for overview + job/history where appropriate. **Do not** add **breadcrumb / chevron path** strips (see hard rule above). Reserve **`DEFAULT_COMM_RAIL_PX`** on the right when the **CommunicationDock** is present.
- **Theme exports**: Import **`SANA_PAGE_CANVAS`**, **`SANA_CARD_SHADOW`**, **`SANA_SHELL_RADIUS`**, etc. from `design/components/sanaShellTheme.ts` (re-exported in `design/components/index.ts`) instead of scattering one-off hexes.

## Canvas Kit MCP
Before adding new custom CSS for colour, spacing, or type, **check** **`user-canvas-kit-mcp`** (`get-canvas-kit-tokens` and token resources). Prefer **components** over raw markup.

**Prototype chrome:** Do not use **warning-styled `Banner`** only to flag mock data; use neutral **`BodyText`**. Implement **every** visible hub or page tab with real Canvas Kit content unless the PRD explicitly limits scope.

## Reference imagery
**Versioned benchmarks** (see `design/references/sana/README.md`):
- `design/references/sana/Sana_Style_UI-e0cea579-b804-4bf4-a662-30fc2a8cbe96.png` (earlier capture)
- `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (candidate profile + left tab bar + top nav; preferred for shell layout)
- `design/references/sana/Sana_Style_UI-secondary-nav-grey.png` (grey secondary hub tabs: inactive vs active pill)
- `design/references/sana/Sana_Style_UI-employee-profile-comm-dock.png` (Sana-fied shell: grey top bar, white pill search, labelled icon rail, comm dock)
- `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` (**candidate profile + WhatsApp sliding panel**: header card, sub-nav pills, white cards, comm rail tiles, **pill composer** with **focus ring** and **circular send**, message bubbles)

Use these to validate **neutrals, radii, and type hierarchy**, not to bypass Canvas Kit. Additional ad-hoc PNGs in Cursor assets may supplement but the repo paths are the default citations.
