# Discovery & Design Brief: GCC nationalisation and local compliance reporting (v61)

**Status:** **315 revision complete** (GCC-E2E-029 Step 7.5, single pass per **318** feedback). Copy Inventory carries **319** Step 7.5a strings; **PASS 4** implementation specs embedded in PASS 1–2. **Hand off to 320** (no second **318** cycle per orchestrator).  
**Pipeline:** GCC-E2E-029 — Step 7.5 (315), after PRD Step 6c Red Team and Step 6d revision.

**PRD (canonical):** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Prior brief (approved v59, reference only):** `design/gcc-nationalisation-local-compliance-reporting-v59-design-brief.md`  
**Prototype version note:** `design/gcc-nationalisation-local-compliance-reporting-v60.tsx` exists; **320** must use a **new** versioned file for any new build per workspace rules — not edit v60 in place for new mission output.  
**Date:** 27 March 2026

---

## Red Team / PRD design commitments (Step 6c → 6d)

The following must be **visible in UX and copy**, not only in PRD prose:

| Theme | Design response |
|--------|-----------------|
| **(1) Recruiting-only scope expectations** | Every primary surface carries a **scope subtitle** and **footer disclaimer**: evidence is **Recruiting-sourced** (pre-hire / pipeline / hire from Recruiting). **No** implication of full **Worker / HCM** workforce reporting, **government submission**, **certification**, or **fine calculation**. Link or cue to **HCM addendum** is **out of v1 UI** unless PM adds a separate artefact; do **not** promise cross-product joins in labels. |
| **(2) Run retention model (A vs B)** | **Engineering selects one path** before GA; design supports **both** in the brief so 320 can prototype the **chosen** path after PM/eng decision. **Path A:** run = **metadata + pointers** to current authoritative data; **re-run** may change numbers; UI states that clearly. **Path B:** any **new** row-level snapshot or export store shows **retention**, **purge alignment** with candidate/application purge and **legal hold**, and user-visible **artefact lifecycle** (where product exposes it). |
| **(3) Data quality / coverage** | **Report catalogue** and **Data quality** tab show **% of population with complete programme fields** for the selected slice, **gap** or validation list, and empty states that **do not** imply compliance when data is incomplete. Align with PRD **Data quality** and pilot **threshold** concept (exact threshold copy = pilot workbook; use placeholder in prototype). |
| **(4) Security DAP consult** | Formal **Data Access Policy** / security domains consult for **nationality and programme** reporting (**Recruiting and Candidate Reporting**, **Candidate Data: Personal Information** and related domains per Deployment Agent) is required **before GA**; **Open design dependencies** records **prototype waiver** and **post-prototype** documentation in **MISSION_LOG** / PRD **Contacts**. |

---

## Open design dependencies

• **DAP / Security (documentation — GCC-E2E-029):** **PM waiver for prototype:** Illustrative security roles and mock field visibility are acceptable for **320**. A formal **Data Access Policy** consult for nationality and programme reporting (**Recruiting and Candidate Reporting**, **Candidate Data: Personal Information** and related domains per Deployment Agent) is **scheduled post-prototype**. **Before GA**, named SME and written outcomes (which roles see which packs, summary vs row-level, intersection groups) must be recorded in **MISSION_LOG** and the PRD **Contacts** table. This satisfies **318**’s requirement to evidence closure or an explicit waiver **in this brief** at design artefact stage.  
• **Retention path:** PM + engineering confirm **A** or **B**; prototype implements **one** path’s messaging and panels.

---

## Grounding summary

### Functional knowledge (@functional-knowledge)

• **Recruiting Data Purge – Functional Overview** (see `functional-knowledge/VERIFICATION_REPORT.md`): Purge and retention are **compliance-critical**; reporting and **auditability** interact with what survives after purge. **v1** must align **run outputs** and **metadata** with **purge / legal hold** when path **B** applies; path **A** must not promise **immutable** point-in-time evidence in UI.  
• **Recruiting Duplicate Management (UDMF):** Merges affect **counts** and **field survivorship**; **Data quality** and **run result** footnotes should allow **engineering** to document **no double-count** rules (exact behaviour per PRD **Data quality**).  
• **Admin Guide – Authentication and Security:** **Security domains**, **DAP**, **constrained groups**, and **report sharing** gate sensitive fields. Align with **Candidate Data: Personal Information** subdomain patterns (see Deployment Agent).

### Deployment Agent placement validation (`ask_deployment_agent`)

**Thread ID:** `a136305f-ce4f-4b33-8300-7d815d8ea396`  
**Question focus:** Recruiting report access, **Report Run History**, sensitive candidate data security, lineage/versioning patterns, hub placement.

**Answer (summary for design):**

• **Access:** Recruiters reach reports via **global search**, **dashboard worklets**, and flows such as **`My Recruiting Jobs`** (custom copies). Leading practice: **Recruiting** (or role) **dashboard** as the operational home.  
• **Report Run History:** Tenant must enable **Edit Tenant Setup – Reporting and Analytics → Enable Access to Report Run History**; users run **`Report Run History`**; custom reporting can use **`Indexed Report Run History`** (**last six months** of indexed runs).  
• **Sensitive fields:** **`Candidate Data: Personal Information`** (and subdomains) control access; **`View Security for Securable Item`** shows which domain protects a field. Without permission, users see **blank** values. Share reports only to **authorised** groups; **summary / non-drillable** patterns for broader audiences.  
• **Definition version / column lineage:** Deployment Agent states there is **no** standard in-product **definition version history** or **column lineage on output** today. **v1 PRD** asks to **surface** runner, timestamp, **report definition version**, and **lineage** — treat as **specified new disclosure**, implemented per discovery (may be **read-only metadata** block, not existing OOTB pattern).  
• **Hub placement:** Prefer a **dashboard-style hub** (worklets + links) over a single menu item for **local compliance reporting** — consolidated, interactive **Recruiting** destination.

**Design implication:** Prototype uses **Recruiting hub** shell (**A+**) with a **Local compliance reporting** hub tab; inner **Tabs** for catalogue, run history, setup, data quality. **Run history** UI aligns conceptually with **Report Run History** / **Indexed** constraints (e.g. **6-month** hint on help text if showing indexed data). **Lineage / definition version** = dedicated **metadata** **Card** on run result; **run history** row opens a **`Modal`** with the same lineage pattern (**318**).

### Six Hats Thinking (trade-off check)

| Hat | Insight |
|-----|--------|
| **White** | Dashboard hub + **Report Run History** enablement; **Indexed** = **6 months**; **Personal Information** domains gate nationality-style fields. |
| **Red** | Buyers may **assume** Nitaqat / Emiratisation **completeness**; **Black** hat: mitigate with **scope** strips and **coverage** metrics. |
| **Yellow** | Transparent **coverage** + **catalogue** speeds **audit prep** and **PS** onboarding. |
| **Black** | **Path A** risks **“numbers moved”** after re-run — must be explained; **Path B** risks **retention/purge** bugs — needs **Legal/Privacy** alignment. |
| **Green** | **Reference dimensions** + **validation** tab reduce **Excel** rework; **metadata** block differentiates from **silent** custom reports. |
| **Blue** | Ship **Recruiting-only** framing, **four inner tabs** with full representative content, **coverage** everywhere reports run, **retention** messaging forked A/B in spec until eng locks. |

---

## PASS 1: Layout strategy

### 1. Jobs to be done (worksheet-aligned)

**Primary persona:** HR Professional (Recruiting) — GCC recruiter or recruiting operations lead (PRD).

**From `docs/jtbd-recruiting-hr-professional-and-manager.md` (verbatim cues):**

• **Maintain high standards of efficiency and effectiveness** — *Identify ways that my HR systems can better meet my workflow*  
• **Maintain data integrity throughout the recruiting process** (efficiency cluster)  
• **Manage my assigned job requisitions** — *Keep track of JRs across pipeline stages*  
• **Foster an inclusive and equitable recruiting process** — *Understand the levels of candidate diversity within open job requisitions* (here: **programme / nationalisation visibility** for **compliance evidence**, framed per customer **policy**, not as automated legal verdict)

**Synthesised JTBD (feature-specific):**

**When** I need **UAE, KSA, or Kuwait** nationalisation or **local workforce compliance evidence** from **Recruiting** for an internal audit, **I want** a **hub** with a **standard report catalogue**, **honest scope boundaries**, **run metadata** (runner, time, definition reference, lineage), **exports**, and **visible data coverage**, **so I can** assemble **Recruiting-sourced** evidence packs **without** Excel rework for **in-scope** scenarios **and without** mistaking outputs for **full workforce**, **statutory filing**, or **government certification**.

**Secondary (TA leadership):** same hub with **LOB / location** filters (prototype: illustrative `FormSelect` filters).  
**Tertiary (implementation):** **Programme setup** + **Data quality** for mapping and gap visibility.  
**Data integrity (318):** The **Data quality** tab is the primary surface for **Maintain data integrity throughout the recruiting process** (worksheet): completeness, gaps, and exports that **do not** imply compliance when data is missing.

### 2. Shell pattern

**Primary: A+** — `WorkdayTopNav` + `WorkdayLeftTabBar` **Recruiting hub** with **Overview**, **Job requisitions**, **Candidates**, and this feature on the primary rail. **Rail vs hub title (318):** Primary rail **`railLabel`:** `Compliance` (short — avoids wrap/clipping on 9px uppercase micro-labels). **Secondary column hub title** (full context): `Local compliance reporting`. Matches `design/references/recruiter-flow/README.md` (**Recruiter Hub – Overview / Dashboard** PNGs cited in v59 brief).

**Inner pattern: D** on the **Local compliance reporting** hub — **tabs + filters + table + actions** (see **Recruiter Hub – Job Requisitions** density).

**Justification:** Deployment Agent recommends a **dashboard-style** consolidated hub; prototype simulates that as a **dedicated hub tab** with **Sana** cards on **`SANA_PAGE_CANVAS`**.

### 3. Reference layouts (do not invent)

• **`Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png`** — optional **summary** strip on **Report catalogue** (KPI-style **coverage** cards, not compliance verdicts).  
• **`Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png`** — **filters + table** for **catalogue** and **run history**.  
• **`design/references/pattern-hired-score-grid.md`** — **filter + table** composition for catalogue and data quality lists (no fake pipeline chart required).

**Sana:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (shell).

### 4. Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` — pill search, utilities, avatar (**Sana** grey bar). |
| **Left** | `WorkdayLeftTabBar` — recruiter hubs + **Local compliance reporting** active. |
| **Centre** | **Card** workspace: `<Heading size="large">` page title, **scope subtitle** (`BodyText`), inner `Tabs`. |
| **Right** | **No** `CommunicationDock` (internal reporting). |

### 5. Hierarchy

1. **Dominant:** **Programme / pack** selection and **Run report** / **Export**.  
2. **Secondary:** **Coverage** summary, filters, table sort.  
3. **Supporting:** **Run metadata** (lineage, definition id/version, runner, timestamp), **retention** note (A or B), **disclaimers** at **bottom**.

### 6. Interaction model

• **Hub:** `WorkdayLeftTabBar` switches hubs.  
• **Feature:** `Tabs` with `data-id`: **`catalogue`**, **`run-history`**, **`programme-setup`**, **`data-quality`**.  
• **Run flow:** Row **Run report** → `Modal` (**FormSelect** / **FormDateInput** for period, programme slice, illustrative checkboxes) → result **`Table`** + **metadata** `Card`.  
• **Export:** `Modal` or footer **`SecondaryButton`** / **`PrimaryButton`** for export action.  
• **Run history drill-in (318):** Clicking a run history row opens a **`Modal`** (not inline expansion or side panel): run summary at top, **`Table`** or structured list for **column lineage** (`{{column}}` → `{{object}}.{{field}}`). Close returns to the table.  
• **Programme setup:** `Checkbox` toggles (UAE / KSA / Kuwait), `FormSelect` / `FormTextInput` for mapping hints. **Cancel (318):** If the user changed any field and chooses **Cancel**, show a confirm **`Modal`**: title **Discard changes?**, body **Your updates won’t be saved.**, primary **Discard**, secondary **Keep editing**. If nothing changed, **Cancel** closes without a confirm.  
• **No breadcrumbs** (`010-style-guide.mdc`).

### 7. Layout framework A–F

| ID | Item | Application |
|----|------|-------------|
| **A** | JTBD | Evidence on demand; **Recruiting-only** honesty; **coverage** visibility. |
| **B** | Shell | **A+** + **D**; dashboard-like hub tab. |
| **C** | Hierarchy | Actions → table → metadata → footer disclaimers. |
| **D** | Density | Medium-high in tables; **coverage** cards concise (1 line + figure). |
| **E** | Accessibility | `FormField` labels, `aria-label` on icon buttons, semantic table headers. |
| **F** | Canvas coverage | **All four** inner tabs populated with representative CK content. |

---

## PASS 2: UI composition (Canvas Kit)

### 0. Canvas Kit discovery

**MCP:** `user-canvas-kit-mcp` — `get-canvas-kit-tokens` called (v14 migration + **color roles** resources available: `docs://tokens/color-roles`, `docs://tokens/color-contrast`). Prototype uses **`@workday/canvas-kit-react`** primitives per **`320-prototype-developer.mdc`** and **`design/components/sanaShellTheme.ts`** (**SANA_PAGE_CANVAS**, **SANA_CARD_RADIUS_LG**, soap borders).

### 1. Component map (layout → Canvas Kit)

| UI element | Canvas Kit / shared component |
|------------|-------------------------------|
| Page shell | `Box`, `Flex`, `Card` |
| Top navigation | `WorkdayTopNav` (`design/components/WorkdayTopNav.tsx`) |
| Hub navigation | `WorkdayLeftTabBar` (`design/components/WorkdayLeftTabBar.tsx`) |
| Page title / subtitles | `Heading`, `BodyText` |
| Inner sections | `Tabs` (`.List`, `.Item`, `.Panel` + **`data-id`**) |
| Filters | `FormSelect`, `FormTextInput`, `FormDateInput` from **`SharedFormControls.tsx`** |
| Tables | `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`) |
| Actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton`; **`Menu`** (+ trigger) for dense table row actions (318) |
| Setup toggles | `Checkbox`, `FormField` composition |
| Run parameters / export | `Modal` + `FormField` |
| Coverage callout | `Card` + `BodyText`; optional **semantic** `Banner` **only** for **blocking** validation (e.g. cannot run — **not** for mock data) |
| Metadata | `Card` with structured `BodyText` / small `Heading` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |

### 2. Sana Style (mandatory)

• **`SANA_PAGE_CANVAS`** behind content; **white** `Card` on grey field; **soap300** borders.  
• **No** heavy blueberry chrome; **blue** for **primary** actions and **links** (`SANA_LINK_ACCENT` where needed).  
• **No** breadcrumb or chevron path.  
• **Legal / scope / mock** notes: **footer** `BodyText` (not warning `Banner` for “illustrative data only” per **320**).

### 2a. Dense table row actions (report catalogue) (318)

**Do not** use two heavy **primary/secondary** buttons per catalogue row. **320** uses **(a)** paired **`TertiaryButton`**s (**Run report**, **Export**) with tight spacing, **or (b)** one **`ToolbarIconButton`** + **`Menu`** (`aria-label`: **Actions for this row**) listing **Run report** and **Export** when the table is crowded. Page-level primaries remain **Run** inside the run **`Modal`** and **Save changes** on Programme setup.

### 3. Navigation completeness (all tabs)

| Tab | Representative content |
|-----|-------------------------|
| **Report catalogue** | Programme **FormSelect**, search/filter, **coverage** summary (**% complete** + short explanation), `Table` of packs (name, programme, objects, **required fields**, **last run**), row actions per **§2a** (**Run report** / **Export**). |
| **Run history** | `Table`: run id, report name, runner, timestamp, **definition version/id** (illustrative), optional **retention expiry** (path B) or **“current data”** badge (path A). **Row action** opens **lineage** in a **`Modal`** (see interaction model). Reference **6-month** window in help text if modelling **Indexed Report Run History**. |
| **Programme setup** | Enable **UAE / KSA / Kuwait** `Checkbox`es, mapping `FormSelect` / `FormTextInput`, **Save** (primary). |
| **Data quality** | **Slice** selector, **coverage %**, **gap** `Table` (req / candidates missing field X), link-style action to **validation** export (label only). |

### 4. Run retention: UI differences (A vs B)

| Element | Path **A** (metadata + pointers) | Path **B** (snapshot / artefact retention) |
|---------|-----------------------------------|--------------------------------------------|
| Result header | **“Results reflect current Recruiting data. Re-run to refresh.”** | **“Point-in-time snapshot”** (if applicable) + **retention until [policy]** |
| Run history row | Emphasises **run metadata**; no **expiry** | **Retains until** date or **purge** iconography per Legal |
| Footer | **Export** may still contain PII; customer responsible for storage | **Exports and snapshots** follow **tenant retention** and **purge**; **legal hold** exception text |

**320** implements **one** column of strings after PM selects A or B.

### 5. Experience principles (PASS 2 rationale)

• **Empower:** User **chooses** programme, pack, parameters, and export; **coverage** shows **what is missing** before they rely on numbers.  
• **Trust:** **Scope subtitle**, **lineage**, **definition id**, **no** certification language; **blank-field** behaviour described in help text where **security** hides fields.  
• **Grow:** **Programme setup** + **Data quality** support **iteration** without **PS** for every tweak; **version** label on definitions (illustrative) hints **upgrade** path.

---

## Copy Inventory (319-approved for 320)

**Canonical 319 artefact:** `design/gcc-nationalisation-local-compliance-reporting-v59-copy-review.md` (Editorial + **060**-sensitive disclaimer block). **Step 7.5a strings below are duplicated here** so **320** implements verbatim.

**Scope & disclaimers (persistent):**

• **Page subtitle** (under `<Heading size="large">`, `BodyText`): `Recruiting-sourced reports for internal evidence. Not for statutory filings, workforce-wide totals, or HCM.`  
• **Footer disclaimer** (`BodyText`, page bottom — **319** / **060**): `Figures support internal management review and evidence assembly from Recruiting data. They do not constitute legal advice, regulator-ready submissions, or a substitute for your organisation’s statutory audit processes.`  
• **Help tooltip** (catalogue — informational): `Sensitive fields may appear blank when your security profile doesn't include access.`

**Hub & tabs:**

• **Primary rail `railLabel`:** `Compliance` (see PASS 1 shell)  
• **Secondary hub title (full):** `Local compliance reporting`  
• **Tab labels:** `Report catalogue`, `Run history`, `Programme setup`, `Data quality`

**Report catalogue:**

• Programme filter label: `Programme`  
• Coverage summary title: `Data coverage for this slice`  
• Coverage body pattern: `{{percent}}% of in-scope candidates have complete programme fields`  
• Empty coverage: `No coverage data for this slice. Adjust filters or complete programme mapping.`  
• Table columns: `Report pack`, `Programme`, `Primary objects`, `Required fields`, `Last run`  
• Primary row action: `Run report`  
• Secondary row action: `Export`  
• Empty table: `No report packs match your filters.`

**Run report modal:**

• Title: `Run report`  
• Primary: `Run`  
• Secondary: `Cancel`  
• Fields (illustrative): `Reporting period`, `Programme slice`, `Include closed requisitions` (checkbox label)

**Run result / metadata card:**

• Section title: `Run details`  
• Labels: `Run by`, `Run time`, `Report definition`, `Definition version`, `Data sources`  
• Path A note: `Results reflect current Recruiting data. Re-run this pack to refresh numbers.`  
• Path B note: `Snapshot retained per your organisation’s policy. Purge and legal hold rules apply.`  
• Lineage subheading: `Column lineage`  
• Lineage row pattern: `{{column}}` → `{{object}}.{{field}}`

**Run history:**

• Page section title (within tab): `Recent runs`  
• Help text (optional): `Indexed run history may reflect a limited time window.`  
• Table columns: `Report`, `Run by`, `Run time`, `Definition version`, `Status`  
• Empty: `No runs yet. Run a pack from the catalogue.`  
• **Lineage detail modal** (row open — 318): **`Modal`** title **`Run details`**; reuse **Column lineage** labels and row pattern from run result **Copy Inventory** above

**Programme setup:**

• Section title: `Programme enablement`  
• Checkbox labels: `United Arab Emirates programme`, `Kingdom of Saudi Arabia programme`, `Kuwait programme`  
• Primary: `Save changes`  
• Secondary: `Cancel`  
• **Unsaved changes confirm (318):** Modal title `Discard changes?`; body `Your updates won’t be saved.`; primary `Discard`; secondary `Keep editing`

**Data quality:**

• Section title: `Programme data quality`  
• Summary: `Completeness for selected programme`  
• Gap table title: `Records missing required fields`  
• Empty gaps: `All in-scope records have required programme fields.`  
• CTA (tertiary): `View validation guidance`

**Errors / blocking:**

• `Unable to run report. Check your connection and try again.`  
• `You don’t have access to this report. Contact your Workday administrator.`  
• `Required fields are missing for this slice. Fix coverage gaps before exporting.` (blocking **optional** — confirm with PM)

**Loading:**

• `Loading runs...`  
• `Loading report packs...`

**Security / DAP (informational only — complements footer; not a substitute for PRD/MISSION_LOG closure):**

• Inline note on catalogue: `Access to nationality and programme fields follows your organisation’s security policies.`

---

## Handoff

• **320:** Implement from this brief + PRD; use **Copy Inventory** strings **verbatim**; follow **§2a** row actions, **run history** lineage **`Modal`**, **Programme setup** discard confirm, and **Compliance** / **Local compliance reporting** rail vs title split.  
• **319:** Step 9 spot-check after prototype build.  
• **060:** As needed for any copy drift on legal surfaces.

---

## Revision based on 318 feedback (GCC-E2E-029 Step 7.5)

**Merged 319 Step 7.5a copy:** Page subtitle (scope) and footer disclaimer are fixed strings; tooltip for blank sensitive fields added; pointer to **`gcc-nationalisation-local-compliance-reporting-v59-copy-review.md`** for broader **319** history. **DAP / Security:** In-file **PM waiver** for prototype + post-prototype consult / **MISSION_LOG** + PRD **Contacts** requirement before GA. **Run history:** Row drill-in specified as **`Modal`** with lineage content. **Shell:** Short primary rail label **`Compliance`** + full secondary title **`Local compliance reporting`**. **Programme setup:** Unsaved-change confirm on **Cancel**. **Catalogue table:** Dense-row pattern via **`TertiaryButton`**s and/or **`Menu`** (**§2a**). Removed **318** PASS 3–4 and verdict sections after incorporation.

---

## Revision note (v61 vs v59)

v61 refreshes the draft for **GCC-E2E-029** PRD **Step 6d** content: **Recruiting-only** buyer boundaries, **retention A/B**, **data quality** indicators, **DAP** consult requirement, and **Deployment Agent** thread **`a136305f-ce4f-4b33-8300-7d815d8ea396`** (Report Run History, **Indexed** window, **Personal Information** domains, **no** native definition-version/lineage pattern). **Copy Inventory** now includes **319**-approved scope/footer strings and **318** revision pass fixes (March 2026).

---

## PASS 5: Visual Review (321)

**Prototype URL:** `http://localhost:5199/gcc-nationalisation-local-compliance-reporting-v61`  
**Screenshots analysed:** Desktop **1920×1080** (viewport + full-page capture); focused captures for **Run history**, **Programme setup**, **Data quality**, and **Run report** modal (Cursor IDE Browser).  
**Review date:** 27 March 2026  
**Mission:** GCC-E2E-029 · Step 9 (321)

### Visual bugs identified

**Critical (must fix before Figma):**

1. **Horizontal overflow at desktop width** — A **browser-level horizontal scrollbar** appears at **1920×1080**. The main white shell and/or tabbed content is **wider than the viewport**, which also **clips** scope copy and table chrome on the right. **Fix:** Trace the flex width chain (`WorkdayLeftTabBar` + `Flex` main + inner `Card` + `Tabs` + tables); ensure every flex child that should shrink has **`minWidth: 0`** (and avoid fixed min-width sums that exceed the available main column). Prefer **one** horizontal scroll owner (e.g. table wrapper only), not the whole page.
2. **Legal / scope text clipped** — The page subtitle, security note, and **footer disclaimer** are **cut off on the right** in the main column, undermining **Trust** and **060**-relevant transparency. **Fix:** Resolve root overflow; allow body text to wrap within the content well (`maxWidth: 100%` / correct padding).
3. **Fourth inner tab not visible without scrolling the tab list** — On default view, only **Report catalogue**, **Run history**, and **Programme setup** read as visible; **Data quality** required **interaction that scrolled nested tab UI** to expose. **PASS 2 F** expects all four tabs to be **obviously navigable**. **Fix:** Reduce tab label width (abbreviations with tooltip if needed), allow tab list to wrap, or increase horizontal space once overflow is fixed.

**Important (should fix):**

1. **Primary rail micro-label truncation** — The icon rail shows **COMPLIAN…** instead of **Compliance**, which reads broken and fights the brief’s **Compliance** / **Local compliance reporting** split. **Fix:** Widen rail label slot in **`WorkdayLeftTabBar`** for this prototype, or use a **shorter** 6–7 character rail label plus unchanged secondary title (coordinate with **315** if copy changes).
2. **Nested scrolling** — The main column shows **both** an inner vertical scroll region **and** page-level scroll in places, which feels heavy. **Fix:** After width fix, prefer a **single** vertical scroll for the main workspace where possible.
3. **Programme setup mapping row** — **Reference dimension** header appeared **truncated** (**Refer…**) when the page was horizontally clipped; should read in full once overflow is fixed.

**Minor (optional polish):**

1. **KPI tiles** — Dense but acceptable; confirm spacing after layout stabilises.
2. **Run report modal** — Visually sound; **Cancel** / **Run** hierarchy and fields match Copy Inventory.

### Canvas Kit usage

**Correct:**

• **`WorkdayTopNav`**, **`WorkdayLeftTabBar`**, **`Tabs`** (with **`data-id`** pattern in source), **`Table`** compound API, **`Modal`**, **`PrimaryButton`** / **`SecondaryButton`** / **`TertiaryButton`**, **`Checkbox`**, **`FormSelect`**, **`FormDateInput`**, **`Heading`** / **`BodyText`**, **`Card`** / **`Box`** / **`Flex`**.

**Incorrect or questionable:**

• None flagged at component-choice level; issues are **layout/CSS**, not wrong primitives.

### Sana Style compliance

**Strong:**

• **Neutral** page canvas (**`SANA_PAGE_CANVAS`**) with **white** elevated main shell; **light grey** top bar and left rails; **pill** global search; **sparing** blue on primary actions and active tab indicator; **rounded** shell/card corners; no heavy blueberry chrome blocks; **no breadcrumbs**.

**Needs adjustment:**

• Overflow-driven clipping **breaks** the intended calm, readable Sana density (text should not truncate mid-sentence in the main well).

### Design Brief alignment

**Matches intent:**

• Shell **A+** with **Compliance** rail + **Local compliance reporting** hub title; four hub areas (**Overview**, **Job requisitions**, **Candidates**, **Compliance**) with representative non-stub content in source.  
• Inner tabs and Copy Inventory strings (scope subtitle, security lines, **Data coverage for this slice**, **Run report** modal, **Path A** retention note in flows, **Programme enablement**, **Data quality**, footer disclaimer).  
• **§2a**-style **Run report** / **Export** as tertiary row actions.  
• **Run history** row action **View details** opening lineage **Modal** (verified in interaction).  
• **No** warning **`Banner`** for mock data.

**Deviates from brief:**

• **Discoverability and readability** of the **fourth inner tab** and **full-width content** fail until horizontal layout is corrected (implementation gap vs PASS 1–2 intent, not spec drift).

### Accessibility observations

**Good:**

• Landmark roles for tabs and navigation; labelled comboboxes; table headers present; modal fields labelled (**Reporting period**, **Programme slice**, **Include closed requisitions**).

**Needs attention:**

• **Clipped text** may hide legally material disclaimer content from sighted users (and complicate zoom/reflow). Fix with layout, not smaller text.

### Experience principles (interactive assessment)

**Empower — user control:** Filters, row actions, and modals are discoverable **once** horizontal overflow is fixed; until then, users may not realise **Data quality** or full table columns exist.

**Trust — confidence building:** Scope and footer copy are **correct in source** but **visually truncated** in review captures, which **undermines** transparency for compliance framing.

**Grow — change enablement:** **Programme setup** with **Save changes** / **Cancel** and discard confirm (per brief) supports iteration; mapping fields were usable where visible.

**Overall:** Strong information architecture and component choices; **execution quality** blocked by **layout overflow**.

### Final Verdict: NEEDS REVISION

**Prototype has layout defects.** **320** should address **critical** horizontal overflow, **full visibility** of all four inner tabs without hunting, and **untruncated** scope/footer copy, plus **important** rail label readability, **before** **330** Figma capture. **Revision pass:** one attempt (per orchestrator).
