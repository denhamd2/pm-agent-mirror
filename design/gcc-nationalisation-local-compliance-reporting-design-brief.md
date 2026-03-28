# Discovery & Design Brief: GCC nationalisation and local workforce compliance reporting

**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**PMF / mission anchor:** `research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-025.md` (Priority 1 recommendation #1)  
**Date:** 27 March 2026  
**Agent:** 315 (Prototype Discovery & Design) — **PASS 1–2 only** (draft for **319** copy review, then **318** peer review)

---

## Orchestrator checkpoint

**Status:** PASS 1 and PASS 2 complete. **STOP** here per pipeline step (**319** → **318** next).  
**Scope:** **Recruiting-sourced** **v1** only; **HCM-composite** / post-hire packs are **out** of this brief’s KPI and default prototype flows unless a **separate PM addendum** extends scope.

**Competitive copy guardrail (PRD):** **319**, **318**, and **320** use **only** the **four** capability rows in **Appendix: Competitive classification** in the PRD (MOHRE reporting/dashboards OOTB; OOTB nationalisation programme dashboards; native packaged Qiwa/Mudad recruiting connectors; configurable candidate grid). Do **not** pull unrelated **101** scan rows (SMS, scheduling, and so on) into this initiative’s UI or parity strings.

---

## Grounding summary

### Deployment Agent (placement)

**Thread ID:** `b098bf54-ffc5-4b49-8493-3db5812fa844` (query 27 March 2026)

**Summary:** Recruiting-oriented **custom reports and dashboards** for compliance-style packs are best consumed through **custom dashboards** with **worklets**. The **Recruiting Dashboard** is a **leading-practice** place for curated operational and compliance analytics. **View Delivered Reports** suits **ad hoc** lookup more than a **curated** pack. **Maintain Dashboards** and **Create Custom Report** are **administrator** (or privileged) tasks; **end users** run what is **configured** for them via **dashboards and worklets**.

**Prototype IA (UX):** Land in **Recruiter Hub** with **Dashboard** (hub secondary item) **active**, and place **GCC nationalisation / local workforce compliance** content in the **main workspace** as **page-level tabs** (catalogue, run, history, setup, and so on). This matches **pattern A+** from `design/references/recruiter-flow/README.md` and aligns with **dashboard/worklet** consumption without asking recruiters to use **Tenant Setup** as the primary **read** surface.

### Functional knowledge (orientation)

**Source:** `functional-knowledge/VERIFICATION_REPORT.md` — **Recruiting Data Purge** and related docs stress **custom reports**, **security**, and **auditability** as part of Recruiting operations. This initiative **extends** the same mental model (standard definitions, **DAP**-bound access, **run** and **lineage** transparency) **without** claiming **purge** scope.

### Six Hats (placement and IA trade-offs)

| Hat | Note |
|-----|------|
| **White** | DA favours **dashboard/worklet** delivery; **Recruiter Hub → Dashboard** active is consistent for a **prototype** that shows **packs** and **runs** in one hub. |
| **Red** | **Frustration** if users cannot find a **single** place for **GCC** evidence; **mitigate** with clear **hub title**, **tabs**, and **labels** (not **breadcrumb** paths). |
| **Black** | **Risk** of implying **government** certification; **mitigate** with **Trust** copy and **bottom** disclaimers (see PRD **Run metadata** and **GTM** language). |
| **Yellow** | **Strong** alignment to **Theme 5 / 6** in research (**Excel** reduction, **operational** reporting). |
| **Green** | Alternatives (standalone **Compliance** app) **deferred**; would need **product IA** beyond this PRD. |
| **Blue** | **Decision:** **A+** shell, **Dashboard** hub active, **page tabs** for sub-functions; **no** **CommunicationDock** for **v1** (internal reporting task, not candidate messaging). |

### Experience principles (`docs/experience-principles.md`)

- **Empower:** Users **enable** programme packs and **mappings**; **runs** are **on demand**; **no** automated **legal** verdicts or **fine** calculations.  
- **Trust:** **Column lineage**, **definition version**, **runner** and **timestamp** on **run metadata**; **honest** **Qiwa** / **Mudad** **True Gap** and **MOHRE** / **nationalisation** **Workaround** elevation per **PRD appendix** (not **native** statutory **engine** claims).  
- **Grow:** **Run history** and **versioned** report definitions support **audit** conversations and **incremental** migration from **legacy** custom fields.

---

# PASS 1: Layout strategy

## A — JTBD (worksheet-aligned)

**Primary persona:** HR Professional (Recruiting) — GCC recruiter or recruiting operations lead (see PRD **Audience / Personas**).

**Verbatim jobs from** `docs/jtbd-recruiting-hr-professional-and-manager.md` **(Talent Acquisition cluster):**

- Maintain data integrity throughout the recruiting process  
- Identify ways that my HR systems can better meet my workflow  
- Meet my efficiency metrics as a recruiter  

**Synthesised JTBD:**  
When **I need nationalisation or local workforce compliance evidence for UAE, KSA, or Kuwait from recruiting data**, I want to **run standard report packs with clear field lineage and export from one place**, so I can **produce evidence faster with less Excel rebuild and defensible traceability**.

**Aligns with:** **Maintain high standards of efficiency and effectiveness** + **Maintain data integrity throughout the recruiting process** (same worksheet cluster).

**Prototype implications:** Show **catalogue → run → results → export**; **run metadata** (runner, time, definition version); **programme** and **country** filters; **admin** setup and **validation** on separate tabs; **bottom**-placed **legal** / **scope** disclaimers (not **warning** **Banner** for mock data alone).

---

## B — Shell pattern

**Primary:** **A+** — Global **Workday** chrome + **Recruiter Hub** secondary column (**Overview**, **Job requisitions**, **Candidates**, **Dashboard** with **Dashboard** active).

**Secondary borrow:** **D** (dense workspace) — **tabs**, **filters**, **tables** inside the main **Card** for **catalogue**, **history**, and **validation** lists.

**Justification:** Matches `design/references/recruiter-flow/README.md` (**Recruiter Hub dashboard** row) and Deployment Agent placement (**dashboard/worklet** consumption). **Not** **pattern B** (candidate profile) — **not** candidate-facing. **No** **CommunicationDock** — **v1** is **internal** reporting and compliance.

---

## C — Reference layouts

1. **`Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png`** — Hub **Dashboard** active; **KPI** / **card** rhythm for **summary** tab.  
2. **`Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png`** — **Filters** + **table** density for **catalogue** and **run history**.  
3. **`design/references/pattern-hired-score-grid.md`** — **Table** + **filters** + **toolbar** patterns for **report catalogue** and **result** grids.

---

## D — Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` — **Sana** grey bar, **pill** search, utilities, **avatar** (`010-style-guide.mdc`). |
| **Left** | `WorkdayLeftTabBar` — **Recruiter Hub**; **secondary** title e.g. **Recruiting** / **GCC compliance**; **Dashboard** active. **No** **breadcrumb** or **chevron** path. |
| **Centre** | **White** `Card` on **`SANA_PAGE_CANVAS`**: `<Heading size="large">` **page title**, then **`Tabs`** for **all** compliance areas (each tab **fully** populated in **320**). |
| **Right** | **None** — **CommunicationDock** **not** used for **v1**. |

---

## E — Hierarchy

1. **Dominant:** **Selected tab** content (**table** or **run** panel) **with** primary **Run report** / **Export** where relevant.  
2. **Secondary:** **Filters** and **programme** / **country** scope selectors.  
3. **Supporting:** **Run metadata** block and **bottom** **BodyText** disclaimers.

---

## F — Interaction model

- **Hub:** **Recruiter Hub** **Dashboard** remains **parent** context; **no** route change inside **prototype** beyond **tab** switches.  
- **Tabs:** **Page-level** `Tabs` for **Summary**, **Report catalogue**, **Run report**, **Run history**, **Programme setup**, **Data validation**.  
- **Modals:** Optional **modal** for **export** options (**CSV** / **Excel** **only** when **required**; **PRD** prefers **in-product** for **in-scope** audits). **320** may use **Modal** for **confirm** or **format** choice.  
- **No** **inline** **breadcrumb** navigation.

---

## Layout framework (A–F) — compact

| ID | Dimension | Decision |
|----|-----------|----------|
| **A** | JTBD | Evidence **packs** and **lineage** for **GCC** recruiting **compliance**; **worksheet** lines cited above. |
| **B** | Shell | **A+** + **D** borrow; **Dashboard** hub **active**. |
| **C** | Hierarchy | **Title** → **tabs** → **primary** **table** or **run** **form** → **metadata** / **disclaimers**. |
| **D** | Density | **Medium–high** on **catalogue** / **history**; **sparser** on **Summary**. |
| **E** | Accessibility | **FormField** labels, **table** **headers**, **focus** on **primary** actions; **no** colour-only **status**. |
| **F** | Canvas coverage | **Full** **tab** set **represented**; **tokens** via **Canvas Kit** + **`sanaShellTheme`**. |

---

# PASS 2: UI composition (Canvas Kit + Sana)

**Canvas Kit MCP:** `get-canvas-kit-tokens` consulted for **token** / **migration** context; **colour** **roles** and **contrast** resources available for **semantic** **status** (e.g. **validation** **severity**). **Prototype** **pin:** **Canvas Kit** **v14** patterns per **`320-prototype-developer.mdc`**.

## Shell and layout

| Element | Canvas Kit / shared component |
|---------|------------------------------|
| Page background | `Box` / `Flex` with **`SANA_PAGE_CANVAS`** from `design/components/sanaShellTheme.ts` |
| Top navigation | `WorkdayTopNav` from `design/components/WorkdayTopNav.tsx` |
| Hub navigation | `WorkdayLeftTabBar` — **primary** rail + **secondary** tabs; **Dashboard** **active** |
| Main content | `Card` (`padding` per **Sana**), `Flex` **column** |
| Page title | `Heading` **size="large"** — **first** **element** in **main** **content** |
| Section tabs | `Tabs` with `Tabs.List` / `Tabs.Item` / `Tabs.Panel`; **`data-id`** on **Item** and **Panel**; **`initialTab`** set |

## Tab-by-tab composition (all tabs must ship **real** **UI** in **320**)

### 1. Summary — `data-id="summary"`

- **Purpose:** **Management** **snapshot** of **programme** **health** (mock **KPIs**).  
- **Components:** `Card` grid or **stack**; `Heading` **size="small"** per **widget**; `BodyText` for **metrics**; optional **simple** **bar** or **donut** **placeholder** using **Box**/**Flex** (or **chart** **only** if **320** **keeps** **Canvas** **Kit** **+** **tokens**); **SecondaryButton** **View** **catalogue** or **Run** **report** **links** to **switch** **tab** (prototype **state**).  
- **No** **warning** **Banner** **only** for **mock** data — use **neutral** `BodyText` at **bottom** of **page**.

### 2. Report catalogue — `data-id="catalogue"`

- **Purpose:** **Standard** **report** **definitions** and **packs** **per** **UAE** / **KSA** / **Kuwait** **programme** **slice**.  
- **Components:** `FormSelect` (**SharedFormControls**) for **programme** / **country**; `TextInput` or **search** for **filter**; `Table` (`Table.Head` / `Body` / `Row` / `Header` / `Cell`) for **catalogue** **rows** (**name**, **definition** **version**, **last** **updated**, **owner**); **row** **SecondaryButton** or **`ToolbarIconButton` + `Menu`** for **View** **details** / **Run** (navigate to **Run** **tab** **with** **selection**).  
- **Pattern:** **`pattern-hired-score-grid.md`** — **filters** **left** or **top**; **table** **primary**.

### 3. Run report — `data-id="run"`

- **Purpose:** **On-demand** **run** (**v1** **manual** **only**; **no** **scheduled** **runs**).  
- **Components:** `FormSelect` / `FormDateInput` for **as-of** **date** **or** **range** (per **product** **rules**); **checkboxes** for **columns** **optional**; **PrimaryButton** **Run** **report**; **after** **run:** `Table` **results** + **panel** **Run** **metadata** (**runner**, **timestamp**, **definition** **version**, **tenant** **context** **label**); **PrimaryButton** / **SecondaryButton** **Export** **to** **CSV** / **Excel**.  
- **Empty** **state** before **run:** **neutral** **empty** **state** **copy** (see **Copy** **Inventory**).

### 4. Run history — `data-id="history"`

- **Purpose:** **Past** **runs** with **metadata** for **audit** **conversations**.  
- **Components:** `Table` **sortable** **appearance**; **filters** `FormSelect` **date** **range**; **link** or **button** **Open** **run** **details** (expand **row** or **Modal** with **metadata** + **lineage** **summary**).

### 5. Programme setup — `data-id="setup"`

- **Purpose:** **Admin** **enable** **UAE** / **KSA** / **Kuwait** **programmes**; **map** **reference** **dimensions** to **legacy** **fields** (mock **fields**).  
- **Components:** `Switch` or `Checkbox` per programme; `FormField` + `FormSelect` / `TextInput` mapping rows; `SecondaryButton` Save changes; `BodyText` help under groups.

### 6. Data validation — `data-id="validation"`

- **Purpose:** **Surface** **gaps** **and** **inconsistencies** (**legacy** **data**).  
- **Components:** `Table` **issue** **list** (**severity**, **object**, **field**, **count**); **optional** `Banner` **variant** **error** **only** for **actionable** **blocking** **state** (not **mock** **disclaimer**); **PrimaryButton** **Export** **validation** **summary**.

## Sana Style (`010-style-guide.mdc`)

- **Neutrals:** **`SANA_PAGE_CANVAS`**, **`SANA_CARD_RADIUS_LG`**, **thin** **`soap300`** **borders**.  
- **No** **large** **blue** **chrome** **blocks**; **primary** **blue** on **buttons** and **links** only.  
- Legal / mock notes at bottom via `BodyText` `size="small"`.

## Components **not** in scope for **v1** **prototype**

- **CommunicationDock**  
- **Breadcrumbs** or **path** **strips**  
- **Qiwa** / **Mudad** **direct** **connect** **UI** (**True** **Gap**; **PRD** **out**)

---

## Copy inventory (for **319** review)

**Convention:** **Sentence** **case**; **verb** + **noun** **buttons**; **numbers** as **numerals** in **UI** where **Editorial** **guidelines** **allow**.

### Buttons and CTAs

| Context | Copy |
|---------|------|
| Primary run | Run report |
| Export | Export to CSV; Export to Excel |
| Catalogue row | Run; View details |
| Save setup | Save changes |
| Refresh validation | Refresh validation results |
| Summary | View report catalogue; Run report |

### Form labels and help

| Field / group | Label | Help (optional) |
|---------------|-------|-----------------|
| Programme | Programme | Filter standard packs by nationalisation programme. |
| Country | Country / region | UAE, KSA, Kuwait (tenant configuration may limit list). |
| As-of date | As-of date | Reporting date for this evidence run. |
| Definition version | Report definition version | Read-only after run; ties to run metadata. |
| Mapping | Source field | Map legacy custom field to reference dimension. |

### Error messages

| Scenario | Copy |
|----------|------|
| Run failed | Unable to run report. Check your connection and try again. |
| Export failed | Unable to export. Check your connection and try again. |
| No permission | You do not have access to this report pack. Contact your administrator. |
| Validation incomplete | Some required mappings are missing. Complete programme setup before running validation. |

### Success / confirmation

| Action | Copy |
|--------|------|
| Run completed | Report run completed. Review results and run metadata below. |
| Export started | Preparing export. Download will begin shortly. |
| Setup saved | Programme setup saved. |

### Empty states

| Context | Heading | Body | CTA |
|---------|---------|------|-----|
| **Run** tab (no run yet) | No results yet | Select a report pack and run date, then run the report. | Run report (disabled until selections made) |
| **Catalogue** (no packs) | No report packs available | Your administrator has not enabled programme packs for your tenant. | Go to programme setup (if role allows) |
| **History** | No run history | Run a report to see history here. | Run report |
| **Validation** | No issues found | No data gaps detected for the selected criteria. | Run validation again |

### Loading states

| Action | Copy |
|--------|------|
| Running report | Running report... |
| Loading catalogue | Loading report catalogue... |
| Loading history | Loading run history... |

### Legal / compliance / transparency (flag for **060** via **319**)

| Element | Draft copy |
|---------|------------|
| **Non-authoritative** **scope** (footer) | Metrics reflect recruiting data and tenant configuration. They do not constitute legal advice or government submission. Customers are responsible for legal interpretation and external submission. |
| **Qiwa** / **Mudad** | Direct portal integrations are not included in this release. Plan evidence exports and any external steps separately. |
| **Sensitive** **attributes** | Nationality and programme-related fields are sensitive. Use and export only in line with your organisation’s policies and applicable law. |

### Competitive / parity **UI** (allowlist only)

- **Do** **not** **surface** **non-allowlisted** **rows** **in** **UI** **copy**.  
- If **parity** **callouts** **are** **needed** **in** **help** **only**, **tie** **to** **PRD** **appendix** **rows** (MOHRE / nationalisation **workaround** **elevation**; **Qiwa** / **Mudad** **connectors** **true** **gap**; **candidate** **grid** **native**).

---

## Handoff

- **Next:** **319-doc-writer** — **Copy** **Inventory** **editorial** **pass** and **060** **on** **legal** **strings**.  
- **Then:** **318-design-peer-reviewer** — **Final** **Verdict** **APPROVED** or **NEEDS** **REVISION**.  
- **320** — **Only** **after** **318** **APPROVED**; **new** **versioned** `design/*.tsx` **file** per **workspace** **rules**.

---

**End of PASS 1–2 (draft Discovery Brief)**

---

## PASS 3: Peer Review Findings (318 — Design Peer Reviewer)

**Review date:** 27 March 2026  
**Inputs checked:** This brief, `docs/jtbd-recruiting-hr-professional-and-manager.md` (Talent Acquisition cluster), `docs/experience-principles.md`, `design/references/recruiter-flow/README.md`, **010** / **320** constraints (no breadcrumbs, full tab coverage, Sana + Canvas Kit).

### Strategy and JTBD

- **Worksheet validation:** The three cited jobs (**Meet my efficiency metrics as a recruiter**, **Maintain data integrity throughout the recruiting process**, **Identify ways that my HR systems can better meet my workflow**) are verbatim lines under **Maintain high standards of efficiency and effectiveness** in the JTBD worksheet. The synthesised *When / I want / so I can* line is credible for GCC compliance evidence and matches the workflow (catalogue → run → export → metadata), not a feature laundry list.
- **Shell pattern:** **A+** with **D** borrow is justified: Recruiter Hub **Dashboard** active matches `recruiter-flow/README.md` (dashboard row) and Deployment Agent placement (dashboard/worklet consumption). **No CommunicationDock** for v1 is correct for internal reporting, not candidate messaging.

### Layout and hierarchy

- **Primary focus:** Dominant content is clear: tab-selected workspace with **Run report** / **Export** and tables as specified. **E — Hierarchy** and layout regions are coherent.
- **References:** PNGs and `pattern-hired-score-grid.md` are named; alignment with **known** recruiter-hub patterns is **not** generic.

### Design system and constraints

- **Canvas Kit:** Mapping uses shared shell components (`WorkdayTopNav`, `WorkdayLeftTabBar`), `Tabs` with **`data-id`** on **`Tabs.Item`** and **`Tabs.Panel`**, `Table` compound API, **FormSelect** from shared controls — consistent with **320** v14 guidance. **Sana:** `SANA_PAGE_CANVAS`, card radius, soap borders, no heavy blueberry chrome — aligned with **010**.
- **No-breadcrumb rule:** Stated explicitly in layout regions and **F — Interaction**; no chevron path substitutes. **Pass.**

### Navigation completeness

- **Six** page-level tabs are heavy but defensible for a compliance pack (summary, catalogue, run, history, setup, validation). Each tab has a stated purpose and component sketch — meets **full tab** expectation for **320** unless PRD scoped a single-tab demo (it does not).

### Experience principles

- **Empower:** On-demand runs, no automated legal verdicts, user-enabled programmes — matches **Empower** and the brief’s grounding bullets.
- **Trust:** Lineage, definition version, runner/timestamp, honest workaround/gap language — matches **Trust** and transparency expectations.
- **Grow:** Run history and versioned definitions — matches **Grow** (histories and iteration).

### Copy (spot check, pre-319)

- **Editorial:** Buttons are **verb + noun** where applicable (`Run report`, `Save changes`, `Export to CSV`). Error pattern is **problem + next step** (`Check your connection and try again`). **Pass** for draft quality.
- **Gaps to close in 319 (not blockers for design approval):**
  1. **Page title** — PASS 2 mandates `<Heading size="large">` first in main content, but **Copy inventory** does not list the **exact** main page title string (only hub secondary title hints). **320** needs one canonical line (e.g. nationalisation / local workforce compliance reporting) after **319** sentence-case pass.
  2. **Tab labels** — Listed in **F — Interaction model**; ensure **Copy inventory** duplicates them so **319** can standardise **sentence case** (e.g. **Programme setup** vs **Program setup**) across the whole surface.
  3. **Legal / sensitive** rows are flagged for **060** via **319** — **must** be completed before freezing prototype copy.

### Pipeline sequencing

- Brief **Orchestrator checkpoint** correctly **STOP**s after PASS 2 for **319** then **318**. If **318** runs before **319** has applied the **Copy inventory** editorial pass and **060** on legal strings, **complete 319 (+060)** before **320**; this peer review treats draft copy as **structurally** acceptable.

### Risks and mitigations (for 320)

- **Summary tab:** Optional chart/donut is loosely specified — **320** should either ship **KPI cards + BodyText only** for v1 or use a **token-safe** placeholder (Box/Flex) so the prototype does not drift into non-CK chart styling. Pick one in implementation.
- **Programme setup:** Admin-style actions — prototype should show **role-appropriate** mock (e.g. note in subtitle or footer) so the demo does not imply every recruiter edits tenant mappings.

---

## PASS 4: Final improvements (318)

- **No** edits to PASS 1–2 body text were applied by 318; findings above are **actionable** for **319** (copy inventory) and **320** (page title string, Summary visual commitment, admin affordance).
- **315** optional: add a single **Copy inventory** row for **Main page title** (`Heading` large) when consolidating after **319**.

---

## Final Verdict: APPROVED

**Rationale:** The brief is **grounded** in JTBD worksheet lines, **Recruiter Hub** / **A+** references, and **Sana + Canvas Kit** constraints. **Hierarchy**, **no-breadcrumb** rule, **Experience principles**, and **full tab** coverage are **clear enough** for **320** to implement. Remaining items are **copy completion** (page title in inventory, **319** + **060**) and **minor 320** choices (Summary chart vs cards), not a **failed** layout strategy.

**320 may proceed** after **319** (and **060** where applicable) has addressed the **Copy inventory** and legal strings; use this brief plus **PASS 3** notes as the **Gate** checklist.
