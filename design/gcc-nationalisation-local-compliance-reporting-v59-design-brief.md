# Discovery & Design Brief: GCC nationalisation and local compliance reporting (v59)

**Status:** PASS 1–4 complete — **Final Verdict: APPROVED** (25 March 2026).  
**319 artefact:** `design/gcc-nationalisation-local-compliance-reporting-v59-copy-review.md` (approved strings for **320**).

**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Mission / analysis lineage:** GCC-E2E-019; PMF `research/GCC/thematic-analysis/2026-03-25-GCC-PMF-Analysis-v59.md` (recommendation #3)  
**Prototype precursor (v58, do not edit for new work):** `design/gcc-nationalisation-local-compliance-reporting-v58.tsx`  
**Date:** 25 March 2026  

---

## Grounding summary

### Functional knowledge (@functional-knowledge)

• **Recruiting Data Purge – Functional Overview** (and verification summary in `functional-knowledge/VERIFICATION_REPORT.md`): Recruiting reporting sits alongside compliance-critical lifecycle (purge, retention, security guardrails). **Reporting and auditability** is called out as an operational concern when data is removed or retained; customers often rely on **custom reports** and security domains for who can see candidate and application data. **Implication for this feature:** nationality and programme fields are **sensitive**; UI must surface **source object / field lineage** and avoid implying immutable statutory audit outcomes (aligned with PRD **Run metadata, exports, and audit posture**).

• **Admin Guide – Authentication and Security.pdf** (index in verification report): **Security domains**, **DAP**, and **report/data source** access are two-layer (domain + report share). Discovery placement must assume **Recruiting and Candidate Reporting** and related constrained groups gate what a recruiter sees.

• **No dedicated PDF** in the repo inventory titled “GCC nationalisation”; v1 scope remains **Recruiting-sourced** dimensions and reports per PRD **Cross-product scope**. HCM / Trended Worker joins are **out** unless a separate HCM addendum exists.

### Deployment Agent placement validation (`ask_deployment_agent`)

**Thread ID:** `8c2dd384-058c-421e-96bd-eb2d1fb51f5e`  
**Question (summary):** Where recruiters access operational reports/dashboards; how to group UAE / KSA / Kuwait programme reports; security domains; whether “country pack” SKUs exist; naming that avoids implying a separate licensed pack.

**Answer (summary for design):**

• **Access pattern:** Recruiters typically use the **Recruiting Dashboard** and **Recruiting worklet** on the homepage; leading practice is a **configured custom dashboard** as a one-stop hub (delivered + custom reports, Discovery Boards, task shortcuts).

• **Grouping programme-specific reports:** Prefer a **dedicated custom recruiting dashboard** (tabs/sections such as “Nationalisation programmes”) **inside Recruiting**, not a separate application. Workday does **not** ship **“country pack” style SKUs** for this; it is **configuration-driven** (reports, dashboard content, menu).

• **Menu / application:** Dashboards can be attached to the **Recruiting application menu** via **Configure Applications** so the hub is reachable like other Recruiting destinations.

• **Security:** Gate recruiting reports via domains such as **Recruiting and Candidate Reporting** and **Job Requisition for Recruiting and Candidate Reporting**; users also need the **report** shared to their group.

• **Naming:** Use **functional names** (e.g. **GCC recruiting operations**, **Recruiting – UAE programme**, **KSA recruiting – pipeline**) and **avoid** implying a **separate licensed product**. Prefix patterns for reports are acceptable (e.g. `UAE Recruiting – …`, `KSA Recruiting – …`).

**Design implication:** The prototype should feel like **Recruiter Hub + dashboard-style workspace** (see shell **A+** / **D** below), with in-page labels such as **programme**, **local compliance**, or **GCC programme reports** — **not** “country pack” in user-visible copy or GTM-facing strings.

### Six Hats Thinking (trade-off check)

| Hat | Insight |
|-----|--------|
| **White** | Deployment Agent confirms **no country-pack SKU**; grouping is **dashboard + reports + menu** under **Recruiting**. |
| **Red** | Recruiters feel time pressure at month-end; they need **one obvious place** to **run** and **export** without hunting custom report names. |
| **Yellow** | A **catalogue** with **programme filters** and **run metadata** reduces rebuild in Excel/Power BI and supports honest **Native / Workaround / True Gap** conversations. |
| **Black** | Risk of **over-claiming** statutory or regulator-ready outputs; risk of **dirty nationality/programme data** undermining trust — mitigate with **data quality** surfacing and **disclaimers**. |
| **Green** | **Reference dimensions + standard report definitions + validation** views address drift from one-off custom fields. |
| **Blue** | Proceed with **Recruiting hub** shell, **Local compliance reporting** hub tab, inner tabs for **catalogue / run history / programme setup / data quality** — matches PRD journeys and DA placement. |

---

## PASS 1: Layout strategy

### 1. Jobs to be done (worksheet-aligned)

**Primary persona:** HR Professional (Recruiting) — GCC recruiter or recruiting operations lead (PRD; **105** P1/P2 archetypes).

**From `docs/jtbd-recruiting-hr-professional-and-manager.md`:**

• **Maintain high standards of efficiency and effectiveness** — *Identify ways that my HR systems can better meet my workflow*  
• **Manage my assigned job requisitions** — *Keep track of JRs across pipeline stages*  
• **Foster an inclusive and equitable recruiting process** — *Understand levels of candidate diversity within open job requisitions* (interpreted here as **programme/nationalisation visibility** for **GCC compliance evidence**, not diversity-only framing)

**Synthesised JTBD (feature-specific):**

**When** I am preparing **UAE, KSA, or Kuwait** nationalisation or local compliance evidence from **Recruiting** data, **I want** a **guided catalogue of standard programme reports**, **transparent run metadata**, and **exports** with clear **field lineage**, **so I can** produce **internal evidence packs** faster **without** pretending the product replaces **statutory audit** systems or **government submissions**.

**Secondary (TA leadership):** roll-ups by LOB/location with consistent definitions (same surfaces; filters and saved parameters TBD in delivery).  
**Tertiary (implementation partner):** programme setup and mapping guidance (programme setup + data quality tabs).

### 2. Shell pattern

**Primary: A+** (global chrome + Recruiter Hub secondary nav) — matches **`Recruiter_Hub_-_Overview_for_a_Recruiter-8fd60518-d750-4f1f-bf9a-ba06cc21aa3a.png`** and dashboard reference **`Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png`** in `design/references/recruiter-flow/README.md`.

**Secondary: D** on the **Local compliance reporting** hub tab — matches **`Recruiter_Hub_-_Dashboard_for_a_Recruiter`** / **`Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter`** density: **tabs + filters + table + primary actions** (`design/references/recruiter-flow/README.md` pattern **D**).

**Justification:** Deployment Agent points to **Recruiting dashboard** as the operational home; PRD requires **catalogue, run, export, configuration** in **Recruiting** surfaces. **A+** gives fast switching between **requisitions/candidates** and the compliance workspace; **D** supports scan-heavy tables and run history.

### 3. Reference layouts (do not invent)

• **`Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png`** — KPI tiles, chart cards, sidebar **Dashboard** active. Use for **summary strip** optional on catalogue tab (neutral cards, Sana).  
• **`Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png`** — filters + table density for **catalogue** and **run history** tables.

**Sana chrome:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (shell), neutral cards on **`SANA_PAGE_CANVAS`**.

### 4. Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` — pill search, utilities, avatar (**Sana** grey bar). |
| **Left (primary + secondary)** | `WorkdayLeftTabBar` — recruiter hub: **Overview**, **Job requisitions**, **Candidates**, **Local compliance reporting** (micro-labels on rail; secondary column shows hub title + section tabs for the active hub). |
| **Centre** | Main **Card**-based workspace: page **Heading**, optional subtitle metadata (no breadcrumb path). |
| **Right** | **None by default** — **CommunicationDock not required** (internal reporting; no candidate messaging). Reserve width only if a future handoff adds **Notes**; v1 **omit** dock. |

### 5. Hierarchy

1. **Dominant:** Selected **report** context (catalogue row or run result) and **primary actions** (**Run report**, **Export**).  
2. **Secondary:** Programme filter, period/parameters, table sort.  
3. **Supporting:** Run metadata panel, disclaimers, definition version.

### 6. Interaction model

• **Hub-level:** Single **WorkdayLeftTabBar** hub switch (4 hubs).  
• **Feature hub:** Canvas Kit **`Tabs`** for **Report catalogue**, **Run history**, **Programme setup**, **Data quality** (`data-id` on **Tabs.Item** / **Tabs.Panel**).  
• **Run flow:** Selecting **Run report** opens **`Modal`** for **parameters** (period, include closed requisitions, programme slice) → **confirm** → results in **Table** (or embedded result card) + **metadata** block.  
• **Export:** **`Modal`** or full-width footer actions — **Export to Excel** / **Export to CSV** (labels TBD by platform; prototype uses PRD-aligned wording).  
• **Programme setup:** **`Checkbox`** toggles per **UAE / KSA / Kuwait** (enablement), **`FormSelect`** / **`FormTextInput`** for mapping hints (prototype uses illustrative fields).  
• **No breadcrumbs** — use **Heading** + hub/tab context only (`010-style-guide.mdc`).

### 7. Layout framework A–F

| ID | Item | Application |
|----|------|-------------|
| **A** | JTBD | Evidence assembly on demand; transparent lineage; honest boundaries vs statutory systems. |
| **B** | Shell | **A+** + **D** as above; Recruiting home. |
| **C** | Hierarchy | Actions → table → metadata/disclaimers. |
| **D** | Density | Medium-high in tables; generous whitespace for disclaimers. |
| **E** | Accessibility | Keyboard **Tabs**; **Modal** focus trap; table headers explicit; **aria-label** on icon buttons. |
| **F** | Canvas coverage | **All four hub tabs** populated (Overview, Job requisitions, Candidates, Local compliance reporting); **all four** inner tabs populated under Local compliance reporting. |

---

## PASS 2: UI composition (Canvas Kit)

**Canvas Kit MCP:** `get-canvas-kit-tokens` consulted (25 March 2026); prototypes use **`@workday/canvas-kit-react`** v14 patterns and **`colors` / `space`** from `@workday/canvas-kit-react/tokens` plus **`@workday/canvas-tokens-web`** CSS imports in `design/main.tsx` (per **320** rule).

### Shell and layout components

| Area | Component / module | Notes |
|------|---------------------|-------|
| Page background | `Box` + `SANA_PAGE_CANVAS` | From `design/components/sanaShellTheme.ts` via `design/components`. |
| Top navigation | `WorkdayTopNav` | Sana grey bar; pill search. |
| Hub navigation | `WorkdayLeftTabBar` | `tabs` = Overview, Job requisitions, Candidates, Local compliance reporting; **`showSecondaryTitleIcon`** optional for person icon on hub title if aligning to candidate-style refs (default **off** for this ops-heavy hub). |
| Content well | `Flex` / `Box` + `Card` (`@workday/canvas-kit-react/card` where used in v58) | Rounded cards **`SANA_CARD_RADIUS_LG`**, hairline borders. |
| Section navigation | `Tabs`, `Tabs.List`, `Tabs.Item`, `Tabs.Panel` | `initialTab` + matching **`data-id`**. |
| Tables | `Table`, `Table.Head`, `Table.Row`, `Table.Header`, `Table.Body`, `Table.Cell` | Catalogue, history, validation, optional results. |
| Actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` | Run, export, cancel, close. |
| Forms | `FormField` + `TextInput` / shared **`FormSelect`**, **`FormDateInput`**, **`FormTextInput`** from `design/components/SharedFormControls.tsx` | Filters and modal parameters. |
| Toggles | `Checkbox` | Enable programme slices; optional “include closed requisitions”. |
| Dialogs | `Modal`, `useModalModel` | Parameter preview before run; export confirm if needed. |
| Typography | `Heading`, `BodyText` | Sentence case titles per Editorial Guidelines. |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` | Consistent with other recruiting prototypes. |

**Sana:** Neutral greys, white cards, sparing blueberry; link accent **`SANA_LINK_ACCENT`** where inline links appear.

### Hub tab content (every tab has real UI)

| Hub tab | Representative content |
|---------|-------------------------|
| **Overview** | **My tasks** strip (table or card list), **open requisitions** snapshot **Table**, short **BodyText** summary; aligns to overview reference density. |
| **Job requisitions** | Filter row (`FormSelect` status/location), **Table** of mock reqs, **TertiaryButton** row actions. |
| **Candidates** | Simple filters, **Table** of mock candidates. |
| **Local compliance reporting** | Inner **Tabs** (below): full feature. |

### Local compliance reporting — inner tabs

| Inner tab | UI | Primary actions |
|-----------|-----|-----------------|
| **Report catalogue** | Filters: **Programme** (`FormSelect`: All, United Arab Emirates, Kingdom of Saudi Arabia, Kuwait), **Search** (`TextInput`). **Table**: report name, programme, short description, **Definition version**. Row actions: **View details** (`TertiaryButton`), **Run report** (`PrimaryButton` in row or toolbar). Optional **KPI strip** (2–3 small cards) for design-partner metrics — **neutral BodyText** only (no warning **Banner** for mock data). |
| **Run history** | **Table**: completed time, report name, run by, definition version, parameter summary. Actions: **Open run** (`TertiaryButton`), **Export** (`SecondaryButton`). **Metadata** block when row selected: runner, timestamp, tenant/environment label (mock), **definition version / hash** (mock). |
| **Programme setup** | **Checkbox** per geography enablement; **`FormSelect`** “Map legacy field to reference dimension” (illustrative); **Save changes** `PrimaryButton`. **BodyText** help: customer-configured obligations. |
| **Data quality** | **Table**: issue type, severity, count, programme; link **Download validation summary** `TertiaryButton`. |

**Explicitly out of v1 UI:** scheduled runs, government connector tiles, “audit certified” badges, AI/skills match cross-sell.

### Experience principles mapping (`docs/experience-principles.md`)

| Principle | Design behaviour in this feature | Principle anchor |
|-----------|-----------------------------------|------------------|
| **Empower** | Recruiter chooses programme, parameters, and export; explicit **Run report** / **Confirm run**; no automated compliance verdict or hidden pipeline changes. | Outcome-focused; human stays the driver (no “black box” statutory outcome). |
| **Trust** | Field lineage, definition version, run metadata, **as-run snapshot** caption; legal disclaimer states limits vs audit/regulator submissions; data quality tab surfaces gaps without blaming the user. | Transparency, clarity, quality with accuracy. |
| **Grow** | Versioned definitions visible; programme setup and legacy-to-dimension mapping support iterative configuration; run history gives an auditable trail without forcing Excel rebuilds for every question. | Easy change; clear history of what ran and under which definition. |

---

## Approved copy (319)

Canonical strings for **320** implementation. Full rationale and diff context: `design/gcc-nationalisation-local-compliance-reporting-v59-copy-review.md`.

### Buttons and CTAs

Run report · Export · Export to CSV · Export to Excel · View details · Open run · Save changes · Cancel · Close · Download validation summary · Confirm run  

### Form labels and help text

• **Programme** — Help: *Filter reports for a specific GCC programme.*  
• **Search reports** — Help: *Search by report name or keyword.*  
• **Period** — Help: *Choose the reporting period for this run.*  
• **Include closed requisitions** — Help: *Include candidates tied to closed requisitions when selected.*  
• **Enable United Arab Emirates programme reports** · **Enable Kingdom of Saudi Arabia programme reports** · **Enable Kuwait programme reports**  
• **Map legacy field to reference dimension** · **Reference dimension** (illustrative `FormSelect` labels)  

### Error messages

• Unable to run report. Check your connection and try again.  
• You don’t have access to this report. Contact your Workday administrator.  
• Select a period before you run the report.  

### Success / confirmation

• Report run finished  
• Export started. You’ll get a file download when it’s ready.  
• Export complete  
• Programme settings saved  

### Empty states

• **No reports match your filters** — *Try another programme or clear search.* CTA: **Clear filters**  
• **No run history yet** — *Run a programme report to see it listed here.* CTA: **Go to report catalogue**  
• **No validation issues found** — *We’ll list data gaps when the validation job finds them.*  

### Loading states

Loading reports… · Running report… · Loading run history… · Saving changes…  

### Legal / compliance (060-sensitive; verbatim unless Legal substitutes)

• **Disclaimer (page or modal footer):** Figures support internal management review and evidence assembly from Recruiting data. They do not constitute legal advice, regulator-ready submissions, or a substitute for your organisation’s statutory audit processes.  
• **Programme setup help:** Your organisation defines how programme fields map to its legal obligations. Workday does not calculate government fines or penalties.  
• **Run metadata caption:** As-run snapshot. Definition version is shown for traceability.  

**No AI disclosure** required for v1 (PRD: not in scope). **No candidate consent** on this internal surface; sensitive attributes remain recruiter-only with security domains per grounding summary.

---

## PASS 3: Peer review findings

| Lens | Finding | Verdict |
|------|---------|---------|
| **JTBD** | Synthesised job is specific to GCC evidence assembly, honest boundaries vs statutory systems, and Recruiting-sourced scope. | Pass |
| **Shell pattern** | **A+** + **D** aligned to Deployment Agent (Recruiting dashboard hub, no country-pack SKU); references named in recruiter-flow README. | Pass |
| **Sana Style** | `WorkdayTopNav`, `WorkdayLeftTabBar`, `SANA_PAGE_CANVAS`, neutral cards, no heavy blueberry chrome; CommunicationDock correctly omitted. | Pass |
| **Canvas Kit mapping** | Documented CK components + shared `FormSelect` / `FormTextInput`; `Tabs` with `data-id`; `Modal` for run parameters; no fantasy UI. | Pass |
| **Navigation completeness** | Four hub tabs and four inner tabs under Local compliance reporting each specified with representative content. | Pass |
| **Copy quality (319)** | Sentence case, verb-led CTAs, problem + solution errors; success states tightened; **Workday administrator** in access error; legal block unchanged for precision. | Pass |
| **Experience principles** | Empower / Trust / Grow mapped explicitly to behaviours (table above). | Pass |
| **No-breadcrumb rule** | Hierarchy via hub + `Heading` + inner `Tabs` only; no path strips. | Pass |

**Reviewer note:** No competing visual focal points beyond the stated hierarchy (actions → table → metadata/disclaimers). Layout is distinctive via programme slice + compliance metadata, not generic admin chrome.

---

## PASS 4: Final improvements

• Incorporated **319** approved copy throughout **Approved copy (319)** and linked `gcc-nationalisation-local-compliance-reporting-v59-copy-review.md`.  
• Expanded **Experience principles** table to cite `docs/experience-principles.md` outcomes (transparency, easy change, human in control).  
• No layout or component set changes required after peer review; **one** editorial pass only per **315** PASS 4 guidance.

---

## Final Verdict

**APPROVED** — Discovery & Design Brief is ready for **320** prototype implementation. **Do not** invoke **320** until this verdict is present; it is present in this revision.

---

## Open points (non-blocking for **320**)

• Arabic **RTL** for generated documents: **out of scope** for this PRD (track separately); prototype **English first** unless PM specifies otherwise.  
• Exact **report catalogue** rows: **design-time** mocks; align names with DA-style prefixes (**UAE Recruiting –**, **KSA Recruiting –**).  
• **Interim RACI** security acknowledgement: record named approver before pilot per PRD (does not block build).

---

## Handoff to **320**

Discovery & Design complete for **GCC nationalisation and local compliance reporting (v59)**. **Final Verdict: APPROVED.**

• **Discovery Brief:** `design/gcc-nationalisation-local-compliance-reporting-v59-discovery-brief.md`  
• **PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
• **Approved copy:** `design/gcc-nationalisation-local-compliance-reporting-v59-copy-review.md`  

**320:** Build a **new** Canvas Kit prototype file `design/gcc-nationalisation-local-compliance-reporting-vNN.tsx` (increment **NN** from repo highest; **do not** edit v58). Register route + slug in `design/main.tsx` and `design/vite.config.ts`. Implement **all** hub tabs and **all** inner tabs with representative data. Use **Approved copy (319)** exactly. **No breadcrumbs**; **no** warning-styled **Banner** solely for mock data. Invoke **060** before handoff to **330** for compliance spot-check on disclaimers and sensitive-field presentation.

---

*Workday Confidential — discovery brief for internal design and engineering alignment.*
