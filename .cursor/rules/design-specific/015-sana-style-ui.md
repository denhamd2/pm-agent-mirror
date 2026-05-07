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
- **Top navigation bar (MANDATORY spec)**: Background is **WHITE** (`SANA_TOP_NAV_BG` = `#FFFFFF`). Centre **pill search** uses a **GREY** fill (`SANA_SEARCH_FIELD_BG` = `#F3F4F6`) with a thin **`soap300`** border — the pill reads as a recessed affordance sitting on the white surface. Trailing utilities stay **dark outline** icons on the white bar. The nav's **bottom edge** depends on the page type:
  - **Homepage / welcome surfaces** (e.g. "Welcome back, Harry" dashboard, landing pages): render the Workday **brand gradient accent bar** — `SANA_HOMEPAGE_GRADIENT` at `SANA_HOMEPAGE_GRADIENT_HEIGHT_PX` (8px) — as a thick horizontal band directly under the nav. No 1px divider. Reference: `design/references/ssa-create-req-videos/frames-overlap/ov-5400.png`.
  - **All other pages** (SSA, profile hubs, task flows, dashboards, search, lists): render a **1px hairline** divider using `SANA_TOP_NAV_DIVIDER` (`#E5E7EB`). No gradient. Reference: `design/references/ssa-create-req-videos/frames-overlap/ov-2700.png` and the attached SSA Position Confirmation frames.
  - **Do not** render both at once. **Do not** substitute blueberry fills, dark chrome, or custom palettes for this spec.
- **Primary left icon rail**: Use **`SANA_PRIMARY_RAIL_BG`** (cool grey `#F3F4F6`, same as the shell column token `SANA_SHELL_COLUMN_BG`) with **stacked icon + uppercase micro-label** under each icon (`design/references/sana/Sana_Style_UI-employee-profile-comm-dock.png`). The rail is **decoupled from the top nav surface** — the top nav is white; the rail remains cool grey so the left shell columns still read as one continuous band.
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
- **`WorkdayTopNav`** (`design/components/WorkdayTopNav.tsx`): **White** bar (**`SANA_TOP_NAV_BG`** = `#FFFFFF`); Canvas Kit **`InputGroup`** + **`InputGroup.Input`** for a **grey** pill search (**`SANA_SEARCH_FIELD_BG`** = `#F3F4F6`) with a `soap300` hairline border; **`ToolbarIconButton`** utilities (dark icons); **`CountBadge`** on inbox/notifications; **`Avatar`**; optional tenant **`Heading`**. The **Workday logo** (`WorkdayWMark`) renders **without a white background circle** — just the orange swoosh and navy W directly on the white bar. Extend via props (`trailingActions`, `showMenuWordmark`, `showWMark`, `compactTrailing`, etc.); **do not** reimplement top chrome inline for new prototypes.
  - **`variant` prop (MANDATORY decision per prototype)**:
    - `variant="home"` → homepage / welcome surfaces. Renders `SANA_HOMEPAGE_GRADIENT` (navy → blue → violet → mauve → peach → orange) as an 8px accent bar directly under the nav. No 1px divider.
    - `variant="app"` (default) → every SSA / profile hub / task flow / dashboard / search / list page. Renders a 1px `SANA_TOP_NAV_DIVIDER` hairline under the nav. No gradient.
  - When authoring a new prototype, choose the variant **from the page's role in the product**, not the visual you want that week. Homepage = `home`. Everything else = `app`.
- **`WorkdayLeftTabBar`** (`design/components/WorkdayLeftTabBar.tsx`): Primary rail = **`SystemIcon`** + **uppercase micro-label** (9px, wide letter-spacing, pepper grey). Secondary column = **same grey** as rail; hub **`Heading`** + optional **`userIcon`**; section tabs = **full pill** radius, **inactive** medium grey / **active** darker grey pill + bold near-black (tokens in **`sanaShellTheme.ts`**). Do not use **`TertiaryButton`** for section tabs. Use when the product surface is a hub-style desktop experience with persistent section navigation (canonical shape: `recruiter-hub-conversational-v99.tsx`). In SSA-style split-pane task flows, the rail is optional and should follow the prototype brief and comparison target.
- **No breadcrumbs in prototypes (hard rule)**: In **`design/*.tsx`** (and any future prototype entrypoints), do **not** import or render Canvas Kit **`Breadcrumbs`**, and do **not** build **ad hoc hierarchy strips** (labels separated by chevrons or slashes meant to read like a path, e.g. `Recruiting › Reqs › …`). **No exceptions** — not even when a PRD mentions hierarchy. Instead, you **MUST** use a primary Page Title (`<Heading size="large">`) at the top of the main content area to establish clear hierarchy before any tabs or cards. Secondary context belongs in subtitle lines, table captions, or metadata under the title — never a path strip.
- **`CommunicationDock`**: sliding column wrapped in Canvas Kit **`Card`** (`padding="zero"`); **defaults to collapsed** (user clicks rail icon to open). Narrow **right rail** uses **`communicationRailButtonStyle`** (Sana: **~10px rounded tile**, active channel = **light blue fill** + **link-colour** icon ring per `sanaShellTheme`). Panel **header** on **white** (`SANA_COMM_PANEL_SURFACE`); body fields use **shared comm patterns** below — **not** ad hoc 4px corners or soap100 fills for primary inputs.
- **Communication sliding panel (all channels)**: 
  - **WhatsApp, SMS, Notes, LINE** (simple messaging): Use `SanaCommComposer` + `SanaCommMessageBubble` inline per `SanaCommPanelPatterns.tsx`
  - **Email** (full-featured): Use `EmailPanel` component (950px width) - includes thread sidebar, rich text composer, Gmail-style expansion, templates, branding
  - **Email** (simple compose): Use `EmailComposer` component (no thread sidebar) - includes From/To/Cc/Subject + rich text
  - **Rich text** (any context): Use `RichTextEditor` component - functional formatting toolbar (Bold/Italic/Underline/Link/List)
  - **Thread expansion** (any channel): Use `ThreadExpansion` for Gmail-style inline collapsible history

- **Full-page conversational / agentic assistant**:
  - **Triggers**: "conversational AI", "agentic assistant", "scheduling assistant chat", "Paradox-style messaging surface", "candidate self-serve chat".
  - **Mandatory Component Stack**:
    - **Bubbles**: Use `SanaCommMessageBubble` from `design/components/SanaCommPanelPatterns.tsx`. Assistant rows pair with Canvas Kit `Avatar` (`as="div"`).
    - **Composer**: Use `SanaCommComposer` (pill, focus ring, circular send). Do not use a styled `Box` + `SecondaryButton`.
    - **Tokens**: Use `SANA_COMM_BUBBLE_BG`, `SANA_COMM_MESSAGE_RADIUS_PX`, `SANA_COMM_PANEL_SURFACE`, `SANA_COMM_COMPOSER_RADIUS_PX` from `design/components/sanaShellTheme.ts` for ancillary thread chrome.
    - **Trust / legal**: Disclosure is a **neutral italic `BodyText` line at the bottom of the chat pane** (e.g. *"This content was generated by AI. Review before use."*) with `SANA_SECONDARY_TAB_INACTIVE_FG` colour and ~12-13px size. **Do NOT** use Canvas Kit `Banner` (warning-yellow / error-red) for automated-assistant disclosure, agent identity, or any persistent ambient trust copy — `Banner` is reserved for in-flow state changes only (see `Banner` policy below). Reference frames: `design/references/ssa-create-req-videos/frames-overlap/ov-1800.png` (cold-start disclosure), `ov-2700.png` (in-flow disclosure docked under composer).
    - **Quick replies**: Use Canvas Kit `PrimaryButton` / `SecondaryButton` (or tertiary), not raw HTML buttons.
  - **Layout**: A narrow centred column (`maxWidth: 520`–`560px`) is acceptable for simple chat, but for **GenUI / rich agentic interfaces** (like Recruiter Hub), use a wider container (`maxWidth: '100%'`) so that embedded components (grids, charts, carousels) have room to breathe. Ensure the chat container has a fixed height (e.g., `height: calc(100vh - 64px)`) with an inner scrolling message area (`overflowY: 'auto'`) so the composer remains docked at the bottom of the viewport.
  - **Candidate Navigation**: For external candidates, do NOT use the internal `WorkdayTopNav`. Use a simpler external career site navigation (e.g., company logo, "Candidate Home" link).
  - **Scroll Behavior**: Implement auto-scrolling that focuses on the *start* of the latest assistant response (e.g., using `scrollIntoView({ block: 'start' })`), rather than just scrolling to the absolute bottom, to ensure long messages are readable from the top.
  - **Forbid**: Ad-hoc bubble/composer/gradient avatar treatments are strictly forbidden.
  - **Reference**: See `design/docs/canvas-kit-patterns/communication-patterns.md` and the GCC prototype file (`design/gcc-interview-scheduling-compliance-nudges-v90.tsx`) as the canonical example.

- **Self-Service Agent (SSA) Title Strip** (mandatory chrome for any prototype that brands itself as the Self-Service Agent or any equivalent named agent surface):
  - **Triggers**: "Self-Service Agent", "SSA", "Create Job Req SSA", "Create Offer SSA", "Workday agent shell", "agent split-pane shell".
  - **Pattern**: A slim secondary header strip (~48px tall) docked **immediately under `WorkdayTopNav` and immediately above the split-pane content**. Full-bleed white surface, 1px hairline divider underneath (`colors.soap300`).
  - **Anatomy** (left to right):
    - Left cluster: a **panel-toggle `ToolbarIconButton`** (`justifyIcon` from `@workday/canvas-system-icons-web`; aria-label "Toggle conversation panel"), then **plain `BodyText`** showing the agent name (`"Self-Service Agent"`) followed by a small **caret/chevron** (`chevronDownSmallIcon`) indicating agent switcher.
    - Spacer flex-grows the middle.
    - Right cluster: **minimise** `ToolbarIconButton` (`minusIcon`; aria-label "Minimise") + **close** `ToolbarIconButton` (`xIcon`; aria-label "Close Self-Service Agent"). Verify icon names against `@workday/canvas-system-icons-web` exports if you choose alternates — the workspace has historically had several "obvious" icon names that don't exist (`shieldIcon`, `envelopeIcon`, `pencilIcon`, `transcriptIcon`, `collapseViewIcon`, `sidePanelOpenIcon` are all MISSING).
  - **Tokens**: White background (`SANA_COMM_PANEL_SURFACE`), ink-coloured text (`colors.blackPepper600`), 14px font, hairline `borderBottom: 1px solid colors.soap300`. No drop shadow.
  - **Forbidden in this strip**: brand gradients, decorative graphics, status indicators, AI disclosure copy (disclosure goes at the bottom of the chat pane), heavy CTAs, pill buttons.
  - **Reference frames**: `design/references/ssa-create-req-videos/frames-overlap/ov-1800.png`, `ov-2700.png`, `ov-9900.png`. Treat these as canonical.
  - **Reuse**: Build a reusable `SsaTitleStrip` component when the next SSA prototype lands (extract from the first usage site). Until then, an inline implementation in a single SSA prototype is acceptable.

- **SSA Starter Suggestions** (canonical accompaniment to any SSA welcome message — visible in `ov-1800.png`):
  - **Pattern**: A short list of clickable prompt rows rendered **immediately below the first agent welcome message** (in the chat thread, indented under the bubble). Each row is a `<button>` with a leading `arrowCornerDownRightIcon` ("↳") and the prompt text in plain `BodyText` size 13. Rows are separated by a hairline `colors.soap300` divider. Below the list, a `[rotateIcon] See other suggestions` button rotates between 2-3 curated prompt sets.
  - **Behaviour**: Tapping a pill submits its text as if the user typed it (re-uses the same submit handler — keep the keyword / intent engine as the single source of truth). Pills disappear the moment `messages.length > 1` (i.e. the user has sent anything) **or** the flow has reached a terminal success state.
  - **Copy**: Sentence case, action-oriented, mirror what the conversation engine actually understands (don't advertise capabilities the agent can't deliver). Aim for 3-5 prompts per set. Include a low-stakes "Help — what can you do?" in at least one set.
  - **Forbidden**: don't render starter suggestions as `Banner`, `StatusIndicator`, big buttons, gradient cards, or persistent footer chrome. They are an ephemeral cold-start affordance, not the permanent UI.
  - **Reference frame**: `design/references/ssa-create-req-videos/frames-overlap/ov-1800.png` (cold start with 3 starter suggestions + "See other suggestions" toggle).
  - **Reuse**: Extract a `SsaStarterSuggestions` component into `design/components/` when a 2nd SSA prototype needs it (the `create-offer-ssa-v01.tsx` implementation is the reference).

- **Generative UI (GenUI) / A2UI Patterns**:
  - **Triggers**: "GenUI", "A2UI", "dynamic pages", "agent-generated UI".
  - **Mindset taxonomy**: Before choosing a GenUI payload shape, tag the user's **Interaction Mode** (Analyzing / Reviewing / Monitoring / Configuring / Creating). Canvas treats modes as canonical tags that inform what AI-generated UI should render — see `https://canvas.workdaydesign.com/guidelines/interaction-modes/overview` and `https://canvas.workdaydesign.com/guidelines/interaction-modes/mode-families`, plus `design/references/ai-experience-guidance.md` (section 3).
  - **SSA split-pane (product reference)**: Self-Service Agent demos (chat left + structured task right — overlap backfill, transfer, job description NL refinement) — see `design/references/ssa-create-req-flow-best-practices.md` (`visual-only; narration TBC` until PM annotates).
  - **Split-pane agent + task shell (reusable guidance)**:
    - Use split-pane when the workflow is multi-step and high-consequence (regulated fields, disambiguation risk, irreversible commit) and users must keep system-of-record context visible while conversing.
    - In split-pane, chat handles intent/rationale and lightweight prompts; the adjacent task pane owns validation, field state, and final confirmation.
    - Do not use split-pane for simple read-only insight, single-field edits, or lightweight policy Q&A; prefer Embedded Content, Contextual Ingress, or Partial Panel Chat.
    - Product references: `design/references/ssa-create-req-flow-best-practices.md` and `design/references/talent-acq-demo-best-practices.md` (examples, not mandates).
  - **Rendering Engine**: Use `A2UIRenderer` (`design/components/A2UIRenderer.tsx`) to map JSON payloads to Canvas Kit components.
  - **Component Library**: Use `GenUIPatterns.tsx` for rich, agent-generated cards.
    - `CandidateActionCard`: For quick review (name, metadata, Reject/Advance).
    - `DraftMessage`: For agent-drafted communications (recipient, message body, Edit/Send).
    - `CandidateGrid` / `JobReqGrid`: For tabular data (uses Canvas Kit `Table`).
    - `CandidateCarousel`: For side-by-side comparison of `StructuredResume` components.
    - `ChartCard`: For data visualization (uses `react-chartjs-2` with Canvas Kit `Card` wrapper).
  - **Integration**: Pass the `A2UINode` to `A2UIRenderer` inside a `SanaCommMessageBubble` (ensure the bubble has `maxWidth="100%"` or `width="100%"` to accommodate wide grids/charts).

- **Candidate Experience Patterns**:
  - **Triggers**: "Career site", "Candidate home", "Paradox style apply".
  - **Components**: Use `CandidateExperiencePatterns.tsx`.
    - `CareerSiteHero`: Large search prompt area.
    - `JobCard`: Clean job listing card.
    - `JobDetailsStickyFooter`: Bottom-docked "Apply with Assistant" CTA.

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
  - **Inside `Table.Cell`**: Canvas Kit `Table.Cell` uses CSS Grid (`gridTemplateColumns: '1fr'`), which stretches direct children to full cell width. Always wrap `StatusIndicator` in `<span style={{ display: 'inline-flex' }}>` when placed inside a `Table.Cell` to prevent the badge background from stretching:
    ```tsx
    <Table.Cell>
      <span style={{ display: 'inline-flex' }}>
        <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label="Active" />
      </span>
    </Table.Cell>
    ```
  - **See**: `design/README.md` Content Patterns section and `320-prototype-developer.mdc` for detailed examples
- **Candidate profile (full page)**: Follow **`design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png`** together with existing shell references: **large header card** on **light grey** with **avatar**, name line, job meta; **vertical sub-nav** in the secondary column with **pill** active state (**`WorkdayLeftTabBar`**); **white** rounded **content cards** on **`SANA_PAGE_CANVAS`** with **thin soap borders**; **two-column grid** for overview + job/history where appropriate. **Do not** add **breadcrumb / chevron path** strips (see hard rule above). Reserve **`DEFAULT_COMM_RAIL_PX`** on the right when the **CommunicationDock** is present.
- **Agentic Recruiting workflow surfaces**: For recruiter agents, candidate review, interview scheduling, outreach, or generated recruiting artifacts, follow `design/references/recruiting-agentic-workflow-patterns.md` in addition to this visual rule.
  - **Recruiter grids**: Compact, high-scan density. Use thin `soap300` borders/dividers, low row padding, compact filter toolbars, understated count strips, small metadata, and sparing blue for active filters/links/focus only. Do not wrap high-frequency tables in large rounded dashboard cards unless the reference requires that treatment.
  - **Candidate profile review**: Decision controls and candidate previous/next navigation belong in the profile action bar. If the reference profile does not show a right chat panel, do not add one. Evidence cards (insights, fit/gap, source snippets) sit adjacent to the decision and resume surfaces.
  - **External collaboration handoff**: When panel scheduling happens in Teams/Slack-style collaboration, use neutral thread surfaces with message cards, participant metadata, proposed slots, conflict markers, and explicit human confirmation. Do not replace this with a native calendar-only view unless the brief/reference shows calendar as the primary surface.
  - **Generated document surfaces**: Use a document-first branded preview as the default state. Rich text editing, CRFs, QA checks, citations, template eligibility, and approval logic are progressive-disclosure panels opened by Edit / Show checks actions.
  - **Reference path text**: Some recordings show compact hierarchy text. In `design/*.tsx` prototypes, keep the hard no-breadcrumb rule: translate path text into a page title plus metadata/subtitle line rather than a chevron or slash path strip.
- **Theme exports**: Import **`SANA_PAGE_CANVAS`**, **`SANA_CARD_SHADOW`**, **`SANA_SHELL_RADIUS`**, etc. from `design/components/sanaShellTheme.ts` (re-exported in `design/components/index.ts`) instead of scattering one-off hexes.

## Canvas Kit MCP
Before adding new custom CSS for colour, spacing, or type, **check** **`user-canvas-kit-mcp`** (`get-canvas-kit-tokens` and token resources). Prefer **components** over raw markup.

**Prototype chrome:** Implement **every** visible hub or page tab with real Canvas Kit content unless the PRD explicitly limits scope.

**Canvas Kit `Banner` policy (default-deny):** Canvas Kit `Banner` (warning-yellow / error-red) is reserved for **actual in-flow state changes**: form-validation failures, request errors, critical user-blocking warnings tied to a specific action the user just took (e.g. "Pay-band breach — Comp Partner approval added"), or compliance interrupts that genuinely need a stop-the-press treatment. **`Banner` is NEVER the right choice for**:

- ❌ **AI disclosure / "drafted by AI" notices** → use neutral italic `BodyText` line at the bottom of the chat or under the draft.
- ❌ **Agent identity / "this is the Self-Service Agent"** → use the **SSA Title Strip** pattern above.
- ❌ **Brand strips** (rainbow gradient, tenant identity, "Workday Recruiting" labelling) → use the existing top-nav chrome only.
- ❌ **Mock-data disclaimers** ("this prototype uses fake data") → use neutral `BodyText` at the bottom of the page (`SANA_SECONDARY_TAB_INACTIVE_FG`, italic, small).
- ❌ **Helpful tips, onboarding hints, "did you know" copy** → use inline `BodyText` next to the relevant control.
- ❌ **Decoration / visual variety** → don't.
- ❌ **Persistent ambient trust copy** ("a human reviews every decision") → bottom-of-pane italic line.

When in doubt, **don't use `Banner`**. The yellow Banner has been actively complained about in design review; persistent yellow chrome reads as alarmist and trains users to ignore it. If the brief or the agent reflexively reaches for `Banner`, swap to neutral `BodyText`, the SSA Title Strip, or an inline `AlertBanner` only when a real warning state has just changed.

## Reference imagery
**Versioned benchmarks** (see `design/references/sana/README.md`):
- `design/references/sana/Sana_Style_UI-e0cea579-b804-4bf4-a662-30fc2a8cbe96.png` (earlier capture)
- `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (candidate profile + left tab bar + top nav; preferred for shell layout)
- `design/references/sana/Sana_Style_UI-secondary-nav-grey.png` (grey secondary hub tabs: inactive vs active pill)
- `design/references/sana/Sana_Style_UI-employee-profile-comm-dock.png` (legacy capture with grey top bar + white pill — use for icon rail labelling, shell density, and comm dock layout only; for the **current** top-nav colour spec go to `design/TOP-NAV-UPDATE.md` and the SSA reference frames `frames-overlap/ov-2700.png` + `ov-5400.png`)
- `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` (**candidate profile + WhatsApp sliding panel**: header card, sub-nav pills, white cards, comm rail tiles, **pill composer** with **focus ring** and **circular send**, message bubbles)

Use these to validate **neutrals, radii, and type hierarchy**, not to bypass Canvas Kit. Additional ad-hoc PNGs in Cursor assets may supplement but the repo paths are the default citations.
