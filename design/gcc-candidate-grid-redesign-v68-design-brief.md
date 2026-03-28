# Design Brief: Candidate Grid Redesign - Custom Fields & Quick Filters (v68)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v68-prd.md`  
**Pipeline:** GCC-E2E-028 (HITL: Candidate Grid Redesign - grid, custom fields, quick filters)  
**Related PRD / UX:** `docs/prds/gcc-candidate-grid-redesign-v52-prd.md` (unified candidate review - **do not** duplicate in this brief; align handoff only)  
**Research:** `research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-028.md` (Themes T1, T5)  
**CI / DA:** `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-028.md`; PRD **DA29** / saved-filter thread per PRD consolidated table  
**Created:** 27 March 2026  
**Agent:** **315** - PASS 1–2 only (hand off to **319** then **318**)

---

## PASS 1: Layout strategy (design thinking + grounding)

### 1.1 Deployment Agent grounding (placement)

**Source:** Workday Deployment Agent (`ask_deployment_agent`), thread **`958c1726-c84a-45ed-a300-b5e438d972db`**, 27 March 2026.

**Navigation to req candidate grid**

• **Recruiting Hub** → **Job Requisitions** → open a **job requisition** → **Candidates** tab (primary surface for this initiative).  
• **Alternate entry:** From req **Overview**, **Review Candidates** or drill-down on **Candidate Stage Metrics** opens a **pre-filtered** grid (same underlying screen).

**Standard structure (today)**

• **Grouped column tabs** in the grid (e.g. Overview, Contact, Experience, Resume) come from **Edit Grid Configuration** grouping - not arbitrary new tab types.  
• **Edit Grid Configuration** (admin): add/remove/reorder columns; group columns under tabs; column properties (e.g. read-only). Grid assignment via **Maintain Candidate List Assignment** (per DA narrative).  
• **Data source:** columns and filterable fields draw from **Job Applications, Prospects, and Referrals** business object (and related objects as configured).  
• **Saved filters:** **per user**, **per job requisition**, **maximum 10** - row filters only; they do not change underlying column layout.

**Extension guidance for v68 (tenant quick presets)**

• Introduce **admin-managed presets** in a **separate UX lane** from personal saved filters - e.g. labelled **Shared filters** or **Quick filters** (final labels via **319**).  
• Keeps the **10 personal saved filters** model intact and avoids conflating tenant catalogue with per-user caps.  
• **Recruiter-facing** behaviour in v68 is **one-click application** of those presets (PRD: chips or equivalent Canvas Kit pattern) **on the req candidate grid**, composable with column filters and saved views.

### 1.2 Functional knowledge (`@functional-knowledge`)

**Workspace state:** This repo’s `functional-knowledge/` folder is documented as holding **initialisation / verification** artefacts; **authoritative PDFs are not assumed on disk** for this pass. **Nationalisation** and **sensitive-field** handling must follow PRD **Regulatory & Compliance** and **060** at copy/legal gates; **420/430** should re-validate against indexed functional docs when available.

**Implications for UI**

• **Nationalisation status** is a **tenant-defined** categorical display (PRD Definitions) - **not** a Workday legal determination; empty states must not imply compliance.  
• **Security:** column visibility and **filter facets** that encode the same sensitive attributes must stay **consistent** (no filter bypass). Presets referencing forbidden facets are **hidden or suppressed** for users without domain access.

### 1.3 JTBD (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

**Verbatim worksheet anchors**

• **Manage candidates throughout the recruiting process:** *Determine if candidate meets requirements of the job*; *Progress candidates through the stages of the pipeline as efficiently as possible*.  
• **Foster an inclusive and equitable recruiting process:** *Ensure that there is a diverse candidate slate prior to hiring for an open job requisition*; *Understand the levels of candidate diversity within open job requisitions* (nationalisation lens is **operational visibility**, not automated compliance - wording stays non-statutory per PRD).

**Synthesised JTBD**

• *When I am triaging a high-volume requisition (dozens to hundreds of applicants), I want **mandate-relevant attributes** (including **nationalisation status**) visible **on the grid** and **one-click quick filters** that match how my team segments the pipeline, so I can **shortlist and progress stages in under a minute** without exporting to spreadsheets or jumping across tabs.*

**Prototype implications**

• **Dominant surface:** req **Candidates** tab - **table scan** + **preset strip** + **column configuration** entry point.  
• **Nationalisation status** as a **first-class column** (sort/filter where type allows) with explicit **Not set** / **Unavailable** states.  
• **Quick presets** as **recognisable, removable** filter state (Trust - transparency).  
• **Mass actions** remain on the grid toolbar; presets **narrow** the selection set first.  
• **Handoff to v52 (if default drill-in changes):** row opens existing profile / review path - **v68** does not redesign the modal; avoid duplicating v52 filter logic in the modal without an explicit **315** alignment task on both PRDs.

### 1.4 Reference layouts (`design/references/recruiter-flow/` + pattern library)

**Recruiter-flow README (manifest)**

| Reference file | Pattern | Use for v68 |
|----------------|---------|-------------|
| `Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png` | **D** dense workspace | Req list / hub density, tabs + filters + table rhythm |
| `Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` | **D** | **Candidate table** baseline for grid-first scanning |
| `Recruiter_Hub_-_Overview_for_a_Recruiter-8fd60518-d750-4f1f-bf9a-ba06cc21aa3a.png` | **A+** | Hub sidebar + landing context when showing navigation into a req |

**Mandatory pattern doc**

• `design/references/pattern-hired-score-grid.md` - global shell (**WorkdayTopNav**, **WorkdayLeftTabBar**), context header + **Tabs**, filter column vs grid split, **Table** + **Pagination**, saved filter / view toggles. **v68** adapts this by adding a **preset chip row** above the grid and **column configuration** affordances per PRD.

**Sana**

• `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (shell), neutral rails, white cards, pill search via shared top nav.

### 1.5 Shell pattern selection

**Primary:** **A+** (Recruiting Hub navigation via `WorkdayLeftTabBar`) + **D** (dense req **Candidates** workspace: tabs, filters, table, action/toolbars).  
**Secondary (admin):** **C** optional - **Maintain quick filter presets** can be shown as **full-page task** under Recruiting admin context **or** large **Modal** over hub; **320** picks one and stays consistent.

**Rationale:** PRD scope is **operational grid ergonomics**, not candidate profile chrome (**B**) or messaging (**CommunicationDock** not required for v68). **Right rail:** optional **collapsed filter panel** (pattern doc) - **v68** prioritises **horizontal quick presets** + existing column filters; a **narrow filter stack** can remain **collapsible** for parity with HiredScore grid pattern.

### 1.6 Layout regions

• **Top:** `WorkdayTopNav` - Sana grey bar, pill search, utilities, avatar.  
• **Left:** `WorkdayLeftTabBar` - primary rail + secondary hub tabs; **job requisition** context with **Candidates** active for main demo.  
• **Centre (recruiter):** White **Card** on `SANA_PAGE_CANVAS` - req **page title** (`Heading` large) + metadata lines; **req-level Tabs** (e.g. Overview, **Candidates**, Interviews, Details); **Candidates** panel contains: **Quick filter preset row** → **active filter summary** → **toolbar** (search in grid, Edit grid configuration entry, mass actions) → **Table** → **Pagination**. **No breadcrumbs** - use title + subtitle for req ID / location.  
• **Right (optional):** Collapsible **Filters** column (faceted list) per pattern-hired-score-grid; **or** omit in narrow prototype if **320** implements **Popup** “Filters” instead - prefer **one** approach for consistency.  
• **Bottom:** Neutral `BodyText` for **mock / disclaimer** copy only (not warning `Banner`).

### 1.7 Hierarchy

• **Primary:** Candidate **data grid** + **active filter state** (presets + column filters).  
• **Secondary:** **Quick preset** strip and **Clear filters** / **Save view** affordances.  
• **Supporting:** Req metadata, stage pipeline summary (if present in tenant config), row checkboxes + mass action menu.

### 1.8 Interaction model

• **Preset apply:** single click applies tenant predicate bundle; **second click** or **dismiss** removes preset contribution (implement as **toggle** or **chip with dismiss** - **320** + **319** align).  
• **Composition:** presets **stack** with column header filters and **personal saved filters** (no regression - show both in active filter summary).  
• **Column management:** **Edit grid configuration** opens **admin flow** (separate task screen in product); prototype may use **Modal** stub with column pick list + **Nationalisation status** column in catalogue.  
• **Admin (TA Ops):** **Create / edit preset** - name, description/help, predicate builder (simplified in prototype: multi-select of dimensions **Nationalisation status**, **Stage**, etc.). **Publish** to tenant library; optional **role scope** (stub).  
• **Security variant:** user without sensitive access - **Nationalisation** column hidden; **presets** that reference that facet **not listed**; optional inline `BodyText` “Some quick filters are hidden based on your access.”  
• **Mobile (PRD):** presets **wrap** or **overflow menu** - prototype documents **menu** pattern for narrow width.  
• **Drill-in:** row action **Open candidate** / **View** - **out of scope** to build v52 modal here; link or placeholder only.

### 1.9 Six Hats (lightweight - preset placement)

• **White:** Facts - saved filters are **per user / per req / max 10**; presets must be a **separate** catalogue (DA guidance).  
• **Red:** Risk - chips overcrowd on small screens; **mitigate** with overflow **Menu** + “More filters”.  
• **Yellow:** Benefit - one-click segmentation hits PRD **under 60 seconds** target for common GCC lenses.  
• **Black:** Failure - preset could leak rows if security not tied to facets - **must** mirror column security (PRD).  
• **Green:** Creativity - **Shared quick filters** + **personal saved filters** side-by-side in active summary.  
• **Blue:** Decision - **horizontal preset strip** under section title, **Clear all filters** always visible, **active filter** text for screen readers.

### 1.10 Layout framework A–F

| ID | Topic | Decision |
|----|--------|----------|
| **A** | JTBD | High-volume req triage with **inline nationalisation** + **preset speed**; reduce export / tab tax. |
| **B** | Shell | **A+** hub + **D** dense **Candidates** workspace; admin preset maintenance **C** (modal or page). |
| **C** | Hierarchy | Grid + filter state dominate; req tabs secondary; admin secondary surface. |
| **D** | Density | Scan-optimised **Table**; preset row single-height; avoid duplicate filter chrome. |
| **E** | Accessibility | **WCAG AA** - keyboardable chips/menu, **live region** or **aria-live** for “Filters applied”, focus order toolbar → table. |
| **F** | Canvas coverage | All **req tabs** populated; grid states: default, preset active, cleared, empty filtered, no access to sensitive column, loading, error; admin: create preset, validation error. |

**Experience principles (`docs/experience-principles.md`)**

• **Empower:** presets are **suggestions**; users keep column control and personal saved views.  
• **Trust:** plain-language **active filter** summary; tenant-defined **nationalisation** labels only.  
• **Grow:** TA Ops evolves preset library; recruiters save personal views without IT tickets.

---

## PASS 2: UI composition (Canvas Kit + Sana)

### 2.1 Canvas Kit MCP

**Called:** `get-canvas-kit-tokens` (query: layout / filter / table patterns) - use **`colors` / `space`** from `@workday/canvas-kit-react/tokens` and **system colour roles** from MCP resources (`docs://tokens/color-roles`, `docs://tokens/color-contrast`) for selected preset fills, focus rings, and status text. **320** re-invokes MCP before implementation.

### 2.2 Component mapping (no fantasy UI)

| UI need | Canvas Kit / shared repo |
|--------|---------------------------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar` (`design/components/`) |
| Layout | `Box`, `Flex`, `Card` |
| Req context | `Tabs` (`.List`, `.Item`, `.Panel`) with matching `data-id` |
| Section titles | `Heading`, `BodyText` |
| Quick presets | **Composable:** `SecondaryButton` / `TertiaryButton` for pill toggles **or** `SecondaryButton` + `SystemIcon` (dismiss); if product standardises **Tag**/chip in CK v14, prefer documented component after MCP check in **320** |
| Active filter summary | `BodyText` + inline `TertiaryButton` “Clear all filters” |
| Toolbar | `ToolbarIconButton`, `InputGroup` + `TextInput` (in-grid search), `Menu` for mass actions |
| Table | `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`), sort affordance on headers (icon via `SystemIcon`) |
| Row selection | `Checkbox` in first column |
| Pagination | `Pagination` |
| Dropdowns (filters / admin) | `FormSelect`, `FormTextInput`, `FormDateInput` from `design/components/SharedFormControls.tsx` where applicable |
| Admin preset builder | `Modal` or full page: `FormField` composition, `PrimaryButton` / `SecondaryButton`, `Table` for preset list |
| Overflow (mobile / many presets) | `Menu` triggered by `SecondaryButton` “More quick filters” |
| Feedback | `Banner` **only** for in-flow errors (e.g. failed filter apply); neutral `BodyText` for empty / hidden-preset explanation |

### 2.3 Sana Style (`010-style-guide.mdc`)

• **Page canvas:** `SANA_PAGE_CANVAS`; rails/tabs per `sanaShellTheme.ts`.  
• **Cards:** white on grey field; `SANA_CARD_RADIUS_LG`; `soap300` borders.  
• **Preset chips:** neutral default; **selected** state = subtle grey pill + **bold** label (match secondary nav active pill logic, not full blueberry bars).  
• **Primary actions:** mass actions remain **Primary** where product already uses primary for destructive confirmations - follow existing grid patterns in **320**.

### 2.4 Navigation completeness (every tab has representative UI)

**`WorkdayLeftTabBar` (Recruiting Hub)**

• Represent **Home / Requisitions / Candidates / Dashboard** (or tenant-equivalent labels) - each secondary selection shows at least a **Card** + plausible chrome for that hub area; **focus** stays on **Job requisition** drill-in.

**Job requisition - `Tabs` (example set; align to common customer config)**

• **Overview:** summary **Card** (req metadata, hiring manager, key dates) + **Review Candidates** **PrimaryButton** / **SecondaryButton** stub.  
• **Candidates (active):** full **v68** grid experience (presets, table, mass actions).  
• **Interviews:** **Table** or **Card** list of upcoming interviews (mock).  
• **Details:** read-only fields / **BodyText** blocks for req description and qualifications.  
• *(Optional fifth tab if needed for realism:* **Approvals** or **Team** - lightweight **Card** + status **BodyText**.)

**Admin - Maintain quick filter presets** (second composition)

• **Preset list** `Table`: Name, Status (Active/Draft), Last updated, Applicable roles (stub).  
• **PrimaryButton** “Create preset”, row action **Edit**.  
• **Editor** (`Modal` or slide-over): fields Name, Description/help, **Facet** rows (e.g. Nationalisation status **in** [multi-select], Stage **in** [multi-select]); **PrimaryButton** “Save”, **SecondaryButton** “Cancel”.  
• **Validation** states in copy inventory below.

### 2.5 Key states (for **320**)

• Default grid with **no** preset.  
• One **quick filter** active + column filter active (composed).  
• **Clear all filters** returns to baseline.  
• **Filtered empty:** “No candidates match your filters.” + **TertiaryButton** “Clear filters”.  
• **Nationalisation** cell **Not set** / **Unavailable**.  
• **Sensitive access denied:** column absent; restricted presets hidden + short explanation.  
• **Loading:** “Loading candidates…”  
• **Error:** `Banner` “Unable to load candidates. Check your connection and try again.”

### 2.6 Cross-PRD alignment (v52)

• **v68** prototype **does not** implement the unified review **modal**. Use **Open candidate** as **SecondaryButton** / row action that would navigate to existing profile (or noop with tooltip in demo).  
• If **v52** becomes default drill-in, **presets and columns remain on parent grid** - duplicate filter logic inside modal is **out of scope** unless PM runs explicit design alignment.

---

## Copy Inventory (for **319** review)

### Buttons and CTAs

• Primary: **Apply** (preset editor save context), **Save preset**, **Review candidates** (Overview), **Move to screen** / mass action labels per existing product (use PRD journey)  
• Secondary: **Cancel**, **Clear all filters**, **Edit grid configuration**, **More quick filters**, **Open candidate**, **Export** (if shown as secondary)  
• Tertiary / toolbar: **Clear filters** (empty state), icon buttons with `aria-label` **Filter**, **Columns**, **More actions**

### Labels and help text

• Page title: **Candidates** (under req title)  
• Section: **Quick filters**, **Active filters**, **All candidates**  
• Column header (configurable): **Nationalisation status** (tenant label may vary - note for **319**)  
• Admin: **Preset name** | Help: **Shown on the candidate grid as a quick filter.**  
• Admin: **Description** | Help: **Helps recruiters understand when to use this preset.**  
• Admin: **Applies to** | Help: **Choose which roles see this preset.**  
• Checkbox: **Include inactive candidates** (example facet - only if used in prototype)

### Error messages

• Preset save validation: **Enter a preset name.**  
• Preset save failure: **Unable to save preset. Check your connection and try again.**  
• Grid load failure: **Unable to load candidates. Check your connection and try again.**  
• Filter apply failure: **Unable to apply filters. Try again or clear filters.**

### Success / confirmation

• Preset saved: **Preset saved**  
• Preset published: **Preset published to quick filters**  
• Mass action (existing product strings): keep consistent with current grid

### Empty states

• No candidates on req: **No candidates yet.** | Body: **When candidates apply, they’ll appear here.**  
• Filtered empty: **No candidates match your filters.** | CTA: **Clear filters**  
• No presets for user (library empty): **No quick filters available.** | Body: **Your administrator hasn’t published quick filters yet.**

### Loading states

• Grid: **Loading candidates…**  
• Preset list admin: **Loading presets…**

### Security / access (non-legal, operational)

• Hidden presets explanation: **Some quick filters are hidden based on your access.**  
• Column empty (not permission - data): **Not set** / **Unavailable** (per PRD)

### Legal / consent (flag for **060** via **319**)

• Footnote (bottom of page, neutral `BodyText`): **Nationalisation status reflects your organisation’s data. It isn’t a legal determination by Workday.** *(Draft - **319** + **060** to finalise.)*

---

## Handoff

• **Next:** **319-doc-writer** - review Copy Inventory; **060** for nationalisation disclaimer and any sensitive strings.  
• **Then:** **318-design-peer-reviewer** - Final Verdict.  
• **320** - new versioned prototype file (`design/gcc-candidate-grid-redesign-vNN.tsx`), routes + `vite.config.ts` slugs per workspace rules.

**STOP - PASS 2 complete.**

---

## PASS 3: Peer Review Findings (318)

**Reviewer:** Design Peer Reviewer (**318**)  
**Date:** 27 March 2026  
**Scope:** Harsh pass against Workday placement, **Sana Style** (`010-style-guide.mdc`), Canvas Kit constraints, JTBD worksheet, shell pattern, **`docs/experience-principles.md`**, no-breadcrumb rule.

### Strategy and JTBD

• **Worksheet validation:** Verbatim anchors match `docs/jtbd-recruiting-hr-professional-and-manager.md` (manage candidates: determine fit, progress pipeline; foster inclusive process: diverse slate, diversity visibility).  
• **Synthesised JTBD** is outcome-led (triage, mandate-relevant attributes, under a minute), not a feature list. **Pass.**  
• **Shell A+ + D** is justified: hub navigation to req-scoped dense grid; no **CommunicationDock** bloat for this scope. **Pass.**

### Layout, hierarchy, and references

• **Primary focus** within a few seconds: table + filter state (presets, active summary, toolbar). Competing chrome is consciously ordered (preset row → summary → toolbar → grid). **Pass.**  
• **Grounding** is strong: DA thread cited, `pattern-hired-score-grid.md` mandatory, recruiter-flow PNG manifest, Sana shell reference. Does not read as a generic wireframe. **Pass.**  
• **Regions** are explicit (top / left / centre / optional right). **Right rail vs Popup** is still a fork; that is acceptable only if **320** commits to **one** pattern in the prototype (see PASS 4).  
• **No breadcrumbs / no chevron path:** Explicitly called out; aligns with **`010-style-guide.mdc`**. **Pass.**

### Canvas Kit and Sana

• Mapping stays within shared shell + CK primitives; **Banner** reserved for in-flow errors, neutral **BodyText** for disclaimers and empty copy. **Pass.**  
• **Gap:** Quick presets as **SecondaryButton** / **TertiaryButton** “pill toggles” is plausible but underspecified versus a first-class **Tag**/chip pattern. Not fantasy UI, but **320** must resolve via **Canvas Kit MCP** (`get-canvas-kit-tokens` + component inventory) and document the chosen primitive in code comments or a one-line implementation note.  
• **Sana:** Neutral pills, `SANA_PAGE_CANVAS`, card radii, soap borders, sparing blueberry. **Pass.**

### Navigation completeness

• **WorkdayLeftTabBar** secondary destinations each get representative UI; req **Tabs** cover Overview, Candidates (hero), Interviews, Details, optional fifth. Admin **Maintain quick filter presets** composition is scoped. **Pass.**  
• **v52** modal explicitly out of scope with a clear handoff rule (no duplicate filter logic). **Pass.**

### Experience principles

• **Empower:** Personal saved filters + column control preserved; presets are additive suggestions. **Pass.**  
• **Trust:** Active filter summary, removable preset state, nationalisation as tenant-defined data, legal footnote drafted for **319**/**060**. **Pass.**  
• **Grow:** TA Ops owns preset library; recruiters keep personal views. **Pass.**

### Copy and editorial (spot check)

• Error strings follow problem + solution pattern. **Pass.**  
• **Issues:**  
  • **Heading vs copy inventory:** §1.6 correctly places **req page title** as **`Heading` large** with metadata; Copy Inventory says *Page title: **Candidates** (under req title)*, which is easy for **320** to misread as “the large heading is Candidates”. Tighten wording so **one** line states: primary **`Heading size="large"`** = requisition title (and optional subtitle for ID/location); *Candidates* is the selected **req tab** and/or a smaller section heading, not the sole page title.  
  • **Sentence case:** §2.4 **Review Candidates** on a button should be **Review candidates** per Editorial Guidelines (verb-led, sentence case).  
  • **Success strings:** *Preset saved* / *Preset published to quick filters* are terse; acceptable for prototype if **319** has no objection (past tense + context is fine).

### Risk register (non-blocking)

• §1.2 **functional-knowledge** caveat is honest; compliance-heavy facets still depend on PRD + **060** + later functional validation. Acceptable for brief **if** **420**/**430** follow through.  
• **Pipeline note:** Handoff lists **319** then **318**; this file’s Copy Inventory reads like **pre-319** draft in places. **320** must implement **final** strings after **319**/**060**, not only this draft.

### Summary

| Area | Verdict |
|------|---------|
| JTBD / shell | Strong |
| Hierarchy / refs | Strong; one Copy/heading clarity fix |
| Sana / no crumbs | Compliant |
| Canvas Kit | Valid; preset control needs MCP-led pick |
| Tabs / states | Complete for stated scope |
| Experience principles | Aligned |

---

## PASS 4: Final Improvements

**For 315 (single edit before or during 320 kick-off):**

1. **Clarify page title vs tab** in Copy Inventory: state explicitly that the mandatory **large** page **`Heading`** is the **job requisition title** (and metadata lines for ID/location); **Candidates** is the active **Tabs.Item** label (and/or a secondary heading), matching §1.6 and **320** pre-flight.  
2. Change prototype copy **Review Candidates** → **Review candidates** in §2.4 (and Copy Inventory if repeated).

**For 320 (implementation binding):**

1. Choose **either** collapsible right **filter column** **or** **Popup** “Filters” for the recruiter grid, not both in the same demo, unless the brief is updated to show when each appears.  
2. Confirm preset UI control (**Tag** vs button group) via **Canvas Kit MCP** before shipping.

**No other brief sections require structural redesign.**

---

## Final Verdict: APPROVED

**318** approves this Design Brief for **320** prototype development, subject to the **PASS 4** clarifications (heading/copy line and sentence-case button). Core layout, Workday placement, Sana Style, Canvas Kit boundaries, JTBD, experience principles, and the **no-breadcrumb** rule are satisfied.

**Handoff to 320:** Build from `design/gcc-candidate-grid-redesign-v68-design-brief.md` and `docs/prds/gcc-candidate-grid-redesign-v68-prd.md`; use **final** copy after **319**/**060** where it supersedes draft strings in the Copy Inventory.
