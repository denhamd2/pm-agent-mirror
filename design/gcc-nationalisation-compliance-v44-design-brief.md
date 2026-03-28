# Discovery & Design Brief: GCC Nationalisation and Workforce Compliance (v44)

**Mission:** GCC-E2E-005 Step 4 (315)  
**Date:** 21 March 2026  
**PRD:** `docs/prds/gcc-nationalisation-compliance-v44-prd.md`  
**Research:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v44.md`  
**JTBD source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`  
**Experience principles:** `docs/experience-principles.md`

---

## PASS 1: Layout Strategy (design thinking)

### JTBD (worksheet-aligned)

**Verbatim cluster (HR Professional – Recruiting):**

- Foster an inclusive and equitable recruiting process  
- Understand the levels of candidate diversity within open job requisitions  
- Maintain data integrity throughout the recruiting process  
- Identify ways that my HR systems can better meet my workflow  

**Synthesised JTBD (When / I want / so I can):**

When I am hiring across **high-regulation GCC** markets and must **hit nationalisation and diversity targets**, I want **one trustworthy Workday view** for **quota status, pipeline coverage, and audit-ready exports**, so I can **evidence compliance and close gaps** without rebuilding spreadsheets or losing time to **PowerBI / Excel** workarounds (v44 Theme 1 & 5; P1–P3).

### Grounding in Workday (Deployment Agent MCP, March 2026)

**Facts used for placement and scope:**

- **Demographics on record:** Standard **Personal information** concepts include **primary nationality**, **additional nationalities**, **citizenship status**, **national / government IDs** (country-specific), passports and visas; visibility can be governed by configuration and security.  
- **Where recruiters see metrics today:** **Recruiter Hub Dashboard** (worklets / overview), **custom reports** (often surfaced via Reporting or embedded in dashboards), and **Prism Analytics** for advanced dashboards.  
- **Compliance / diversity patterns:** Mix of **standard and customised reports** (e.g. workers and government identifier data, citizenship, gender, disability where collected); **dashboards** assemble metrics for stakeholders.  
- **GCC nationalisation – avoid over-claiming without integrations:** Do **not** promise **automated Nitaqat colour** or **direct Qiwa submission** without certified integration; **file-based / customer-operated exports** align with MVP PRD.

**Implication for UX:** Position the **operational** experience on the **Recruiter Hub** (dashboard-first), with a **clear path** to **Reporting / Prism** for enterprise consumers called out as the analytical “home” for some tenants – the **prototype** should emphasise **hub dashboard + drill-down list + export**, which matches recruiter mental models from research (daily operations, not only month-end reporting).

### Six Hats Thinking MCP (strategic synthesis)

- **White hat:** Facts cluster on OOB packs, snapshots, exports, RBAC; Workday already has nationality / citizenship fields and reporting surfaces; gap: exact **worklet** product naming and whether a **standalone compliance app** is required long-term.  
- **Black hat:** Risks – **sensitive field exposure** without RBAC, **misleading statutory percentages** if not clearly customer-configured, **dashboard clutter** vs high-frequency recruiter tasks, **legal wording** on exports and definitions.  
- **Yellow hat:** Opportunity – **single trusted in-product** operational surface reduces **Excel / PowerBI** rebuild tax and supports **audit confidence** (v44).

### Shell pattern selection

| Role | Pattern | Justification |
|------|---------|----------------|
| **Primary** | **A+** | Recruiter Hub with **Dashboard** active – matches `design/references/recruiter-flow/README.md` (**Recruiter Hub – Dashboard**) and Deployment Agent guidance on **dashboard worklets** for at-a-glance quota health. |
| **Secondary** | **D** | Dense **candidates / exceptions** workspace: filters + **Table** + actions, aligned with **Recruiter Hub – Candidates** reference (tabs, filters, table density). |
| **Optional tertiary** | **B** | If the prototype demonstrates **profile context**, use **candidate profile** chrome (header card, secondary pills) only when drilling from a row – reuse Sana shell + **no CommunicationDock** unless PRD expands scope. |

**Primary pattern for handoff sentence:** **A+** (landing) with **D** for drill-down list in the same flow.

### Reference layouts (must mirror, not reinvent)

1. `design/references/recruiter-flow/Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png` – **KPI / chart cards**, hub sidebar, **Dashboard** active.  
2. `design/references/recruiter-flow/Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` – **filters + table** density for exception / candidate lists.

### Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` – grey Sana bar, pill search, utilities, avatar (global). |
| **Left** | `WorkdayLeftTabBar` – Recruiter Hub: **Overview**, **Job requisitions**, **Candidates**, **Dashboard** (this feature **lands with Dashboard active**). |
| **Centre** | White **content shell** on `SANA_PAGE_CANVAS`: page **Heading**, **filter row**, **KPI card grid**, **Tabs** (by country pack or “All enabled packs”), **Table** (drill-down / exceptions). |
| **Right** | **None** for MVP prototype (no `CommunicationDock`) – reserve width for future **context panel** if needed. |

### Hierarchy (3-second scan)

1. **Primary:** **Quota health** – large **metric cards** (%, gap to target, snapshot as-of date).  
2. **Secondary:** **Filters** (scope and time) + **Export** affordance.  
3. **Supporting:** **Exception / candidate table** – nationality, data completeness, stage / req metadata.

### Interaction model

- **Hub navigation:** `WorkdayLeftTabBar` switches hub areas; **Dashboard** shows compliance dashboard body.  
- **In-page `Tabs`:** Separate panels per **enabled country pack** (e.g. KSA / UAE / Kuwait) **or** a single dashboard with **country pack** `Select` – prefer **`Tabs`** if multiple packs enabled simultaneously (clearer mental model).  
- **Drill-down:** From a card (“Below target” / “Missing nationality”) **or** primary **Table** always visible under cards – row action **Open candidate** optional (tertiary).  
- **Export:** `PrimaryButton` or `SecondaryButton` **Export for audit** opens **`Modal`** with format (CSV / XLSX), **definition version** read-only text, **confirm** (audit log implied).  

### Layout framework (A–F)

| Letter | Lens | Application |
|--------|------|-------------|
| **A – JTBD** | Job clarity | Ground every widget in **quota evidence** and **gap closure**, not generic analytics. |
| **B – Shell** | Workday-native | **A+** hub + **D** table; no bespoke app chrome. |
| **C – Hierarchy** | Focus | Cards → filters → table; **no competing** full-width chrome bands. |
| **D – Density** | Scanning | Table supports **high-volume** rows with **sticky header** pattern via `Table` layout. |
| **E – Accessibility** | WCAG | Semantic table headers, **visible focus** on filters and export, **aria-labels** on icon buttons; semantic **positive / caution** only where KPI status is communicated (prefer **text + token**, not colour alone). |
| **F – Canvas coverage** | CK primitives | **All** hub tabs show **representative** content (see PASS 2); **Dashboard** tab carries the compliance feature depth. |

---

## PASS 2: UI Composition (Canvas Kit + Sana)

### Placement (where in Workday)

| Surface | Placement |
|---------|-----------|
| **Operational dashboard** | **Recruiting → Recruiter Hub → Dashboard** (primary). New **GCC workforce compliance** region implemented as **dashboard cards + in-page table** (worklet-equivalent layout in prototype). |
| **Enterprise / analyst depth** | **Reporting** and **Prism Analytics** – referenced in copy as **“Open in Reporting”** `TertiaryButton` (non-functional stub acceptable) for tenants that centralise compliance there. |
| **Candidate context** | **Candidates** hub tab: list **includes nationality column** (masked / hidden per RBAC in real product); optional **profile** drill shows **Personal** fields – prototype may use one **mock row** detail in `Modal` or inline **Drawer** pattern simplified as **Card** expansion. |

### Navigation completeness (320 requirement)

**`WorkdayLeftTabBar` tabs – each with representative UI:**

- **Overview** – tasks / announcements card strip (reuse patterns from hub overview references).  
- **Job requisitions** – compact **Table** or list snippet + filters.  
- **Candidates** – **Table** with **nationality** column (this feature’s column emphasis).  
- **Dashboard** – **hero** GCC compliance experience (cards, filters, export, table).  

**No breadcrumbs** – use `Heading` + optional **subtitle** (`BodyText`) for context (e.g. snapshot date, scope). No chevron path strips.

### Key UI elements (PRD + step requirements)

**Dashboard cards (KPI row / responsive grid):**

- **Nitaqat / Saudization %** (KSA pack) – current %, **gap to target**, **as-of** snapshot date.  
- **Emiratisation %** (UAE pack).  
- **Kuwaitisation %** (Kuwait pack).  
- **PWD %** (where enabled – label **customer-configurable**).  
- **Gender diversity %** (where enabled – neutral framing, **aggregate** only in dashboard).  

Each card: `Card` + `Heading` (small) + big metric `Text` / `Heading` + `BodyText` for gap and denominator hint (“Headcount in scope” / “Candidates in funnel” – **must match PRD labelling**, not mixed silently).

**Filter bar (toolbar row):**

- **Line of business** – `Select` labelled **Supervisory organisation (LOB)** (maps PRD “LOB” to a familiar Workday org construct; customer may map differently).  
- **Location** – `Select` (location hierarchy).  
- **Date range** – **Start** / **End** using `FormField` + `TextInput` (type `date`) or two `Select`s for period presets (“This month”, “Last 30 days”) **plus** custom range – prototype can show **preset `Select`** + optional range for clarity.  

**Data table:**

- **Columns (minimum):** Candidate, Requisition, Stage, **Nationality** (or **Nationality band** if banding enabled), **Data completeness** (e.g. “Missing nationality”), Last updated.  
- **RBAC demo:** One row state with **“Restricted”** or masked cell for users without PWD view (per PRD FR-5).  

**Export:**

- **`SecondaryButton` or `PrimaryButton`:** **Export for audit**  
- Triggers **`Modal`**: format, scope summary, **definition version** string, **Download** / **Cancel**; post-action **Toast** optional.

### Canvas Kit components (specific)

**Layout & structure:** `Box`, `Flex`, `Card`  

**Navigation:** `Tabs` (`.List`, `.Item`, `.Panel` with matching **`data-id`**, `initialTab` set), `WorkdayTopNav`, `WorkdayLeftTabBar` (from `design/components/`)  

**Actions:** `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton`  

**Forms / filters:** `FormField`, `FormField.Label`, `FormField.Input` as `Select` / `TextInput`, `Checkbox` (e.g. “Include withdrawn”) if needed  

**Data display:** `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`)  

**Text:** `Heading`, `BodyText`, `Text`  

**Feedback:** `Modal`, `Toast` (export success), `Banner` **only** for real flow states (errors, blocking validation) – **not** for “mock data” disclaimers (`BodyText` only per 320).  

**Icons:** `SystemIcon` + `@workday/canvas-system-icons-web` (e.g. download, info for definition tooltip)  

**Tokens:** `colors`, `space` from `@workday/canvas-kit-react/tokens` and **`SANA_*`** from `design/components/sanaShellTheme.ts` for shell alignment.

### Canvas Kit MCP

**Called:** `get-canvas-kit-tokens` – use **`docs://tokens/color-roles`** and **`docs://tokens/color-contrast`** when choosing **status** colours for gap / complete states; prefer **semantic roles** (e.g. positive / caution) over ad hoc hex.

### Sana Style notes (`010-style-guide.mdc`)

- **Page canvas:** `SANA_PAGE_CANVAS` behind the main shell.  
- **Cards:** white `Card` on grey field, **`SANA_CARD_RADIUS_LG`**, thin **`soap300`** borders / hairline dividers, **`SANA_CARD_SHADOW`** subtle.  
- **Navigation:** grey **primary rail** + **secondary** column pills; **Dashboard** active state per `WorkdayLeftTabBar`.  
- **Accent:** reserve strong blue for **primary actions**, links (`SANA_LINK_ACCENT`), focus; **no** full-width blueberry headers.  
- **Typography:** Roboto via CK text components; **bold** card titles, **regular** body, smaller **metadata**.  

### Experience principles (`docs/experience-principles.md`)

| Principle | Design hook |
|-----------|-------------|
| **Empower** | User chooses **scope** (filters), **export**, and **which pack tab** to inspect; no black-box scoring. |
| **Trust** | **Definition version**, **snapshot as-of**, and **“What counts”** info (`TertiaryButton` + `Modal` or tooltip) – aligns with PRD transparency. |
| **Grow** | Show **change over time** as a **secondary row** (sparkline optional **out of scope** for MVP prototype) or **“Compare to prior snapshot”** `Select` – at minimum **stamp** previous vs current period in `BodyText`. |

### Legal / copy handoff (060 / 319)

- Nationality, PWD, and **export disclaimers** are **legal-sensitive** – **319** must pass strings; **060** validates before Jira / GA.  
- UI must **not** imply Workday **sets statutory %** – targets shown as **customer-entered** (placeholder copy in prototype).

---

## PASS 3: Peer review (design reviewer)

| Criterion | Finding |
|-----------|---------|
| **JTBD alignment** | PASS – Tied to **diversity / integrity / systems meet workflow** jobs and v44 **nationalisation + reporting** themes. |
| **Shell consistency** | PASS – **A+** + **D** with named **recruiter-flow** PNGs; matches Deployment Agent **hub dashboard** guidance. |
| **Sana compliance** | PASS – Explicit **SANA_*** and **no blueberry chrome blocks**. |
| **Canvas Kit mapping** | PASS – No fantasy components; **Tabs** `data-id` rule noted. |
| **Experience principles** | PASS – Empower / Trust / Grow mapped to filters, definitions, snapshots. |
| **No-breadcrumb rule** | PASS – **Heading + metadata** only. |
| **Navigation completeness** | PASS – All **four** hub tabs specified with representative content. |
| **Risks** | **RBAC** and **non-prescriptive targets** must be visible in prototype states – addressed in table and card helper text. |

**Verdict after PASS 3:** Strong enough to finalise; one clarification applied in PASS 4.

---

## PASS 4: Final improvements

1. **LOB label:** Use **Supervisory organisation (LOB)** on the filter to stay Workday-familiar while satisfying the **LOB** requirement.  
2. **Reporting placement:** Name **Reporting / Prism** as **secondary** enterprise surfaces so PMs do not assume **only** hub for all tenants.  
3. **Qiwa / Nitaqat:** Reinforce in brief: **no automated colour / portal submit** in MVP – **export-first** story only.

---

## Final Discovery & Design Brief (320 handoff)

### Summary

Build a **Sana-aligned** Recruiting prototype using **`WorkdayTopNav` + `WorkdayLeftTabBar`** (**A+** shell). Land **GCC nationalisation and workforce compliance** on **Recruiter Hub → Dashboard** with **five KPI cards** (Nitaqat / Saudization, Emiratisation, Kuwaitisation, PWD, Gender), a **filter bar** (**Supervisory organisation (LOB)**, **Location**, **Date range**), a **`Table`** of candidates including **Nationality**, and **Export for audit** (`Modal` with **definition version**). Populate **every** hub tab with representative CK content. **No breadcrumbs.** Use **Canvas Kit** components and tokens per MCP; **060/319** own legal copy on exports and sensitive fields.

### Reusable layout components

- `WorkdayTopNav`, `WorkdayLeftTabBar` from `design/components/`  
- `SANA_PAGE_CANVAS`, `SANA_CARD_RADIUS_LG`, related tokens from `sanaShellTheme.ts`  

### Visual shell & references

- `design/references/recruiter-flow/README.md` – patterns **A+**, **D**  
- `Recruiter_Hub_-_Dashboard_for_a_Recruiter-*.png`  
- `Recruiter_Hub_-_Candidates_for_a_Recruiter-*.png`  
- `design/references/sana/` – neutral surfaces and type hierarchy  

---

## Final Verdict: **APPROVED**

**320** may implement from this brief + PRD. **319** reviews all UI strings; **060** reviews legal-sensitive copy. **330** captures after running prototype.

---

**Discovery Brief path:** `design/gcc-nationalisation-compliance-v44-discovery-brief.md`  
**Final Verdict status:** **APPROVED**
