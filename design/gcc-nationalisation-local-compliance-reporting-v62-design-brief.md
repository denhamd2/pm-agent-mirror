# Design Brief: GCC nationalisation and local compliance reporting (v62)

**Status:** **315 PASS 1–2 complete** | **318 PASS 3–4 complete** — **Final Verdict: APPROVED** (28 March 2026). **321 PASS 5** — **Prototype visual verdict: NEEDS REVISION** (28 March 2026; see PASS 5). **319** copy + **060** still required on legal-sensitive strings before freezing UI text in **320**.  
**Date:** 28 March 2026  
**PRD (canonical):** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Pipeline context:** GCC E2E — design discovery after PRD.

---

## Grounding summary

### Functional knowledge (`functional-knowledge`)

In-repo pointers (no PDF corpus in this workspace): **`functional-knowledge/VERIFICATION_REPORT.md`** and **`INITIALIZATION.md`** — use for **purge / retention / audit** sensitivity: nationalisation metrics and exports must **not** contradict **candidate purge**, **legal hold**, or **UDMF** merge survivorship; **v1** treats **customer-operated export** as outside Workday once downloaded (PRD **Retention and purge matrix**).

### Deployment Agent — placement guidance

**Thread ID:** `e8452b59-67d1-4836-9bed-dbf411a2486b` (March 2026).

**Summary for design:**

• **Job Requisition workspace** — central for **pipeline / candidate grid**; extend with **quota composition** and **role-appropriate** visibility (minimise sensitive columns per security tier).  
• **Offer** — **Job Application** / **Offer** business process is the natural place for **decision-time** **warnings** or **blocks** (with PRD safeguards: explanation, override path, audit).  
• **Dashboards / analytics** — **Recruiting dashboards** and **custom reports** are where **executive** and **COE** consumers already work; **native** experiences should feel like **first-class** dashboard and drill-down, not a one-off report menu only.  
• **Tenant configuration** — **Recruiting configuration** (admin) for **country packs**, **org-to-programme mapping**, **targets**, **thresholds**, **effective dating**.

**Design stance:** Prototype **one coherent Recruiting hub** shell that lets PMs **validate** four jobs: (1) **recruiter** quota view at **req** context, (2) **executive** rollup, (3) **offer-stage** signal, (4) **admin** programme setup — aligned to Deployment Agent **extend, don’t invent a parallel product**.

### Six Hats Thinking (trade-off check — as needed)

| Hat | Insight |
|-----|--------|
| **White** | Facts: **v1** excludes **automated** Qiwa/Mudad submission; **warn + audit** default; **hard blocks** need Legal-approved copy and override accountability. |
| **Red** | Recruiters feel **time pressure** at offer; surface **impact** in **plain language**, link to **why** (rule + population). |
| **Yellow** | Transparent **drill-down** supports **trust** and **RFP** narrative (**native** vs spreadsheet workaround). |
| **Black** | **Misread quotas** if data incomplete; **Data quality** strip and **coverage** indicators mandatory. **Discrimination risk**: no default **exclusion** filters on protected attributes. |
| **Green** | **Progressive disclosure**: hiring manager sees **minimal** signal; recruiter/COE see **full** context. |
| **Blue** | Single **Sana** shell (**A+** + **D** / **C** modal); **all** hub tabs populated; **no breadcrumbs**; **footer** disclaimers for scope and exports. |

---

# PASS 1: Layout strategy

## 1. Jobs to be done (worksheet-aligned)

**Sources:** `docs/jtbd-recruiting-hr-professional-and-manager.md` (Recruiter / HR Professional cluster).

**Verbatim worksheet cues (representative):**

• **Manage candidates throughout the recruiting process** — *Progress candidates through the stages of the pipeline as efficiently as possible*; *Make a successful offer to the chosen candidate*  
• **Manage my assigned job requisitions** — *Keep track of JRs across pipeline stages*; *Ensure that the details of each job requisition is accurate and up to date*  
• **Maintain high standards of efficiency and effectiveness** — *Maintain data integrity throughout the recruiting process*; *Identify ways that my HR systems can better meet my workflow*  
• **Be an effective partner to hiring teams** — *Help hiring teams understand the progress and status of a job requisition* (tertiary: **minimal** compliance signal for hiring manager)

**Synthesised JTBD (primary):**

**When** I am **managing GCC requisitions and offers** under **nationalisation or local quota programmes**, **I want** **real-time visibility** into **pipeline and hire impact** against **customer-defined targets** with **clear warnings before irreversible offer steps**, **so I can** **stay compliant**, **avoid spreadsheet reconciliation**, and **keep hiring moving** without **silent** or **solely automated** decisions.

**Aligns with:** Recruiter JTBD cluster **Manage candidates throughout the recruiting process** + **Manage my assigned job requisitions** + **Maintain data integrity throughout the recruiting process** (efficiency cluster).

**Secondary (COE / analytics):** Programme configuration, thresholds, **audit** and **export** for **statutory** **manual** filing (PRD **Export**).  
**Tertiary (hiring manager):** **Outcome-focused** minimal signal on **offer impact** (PRD **Progressive disclosure**).

## 2. Shell pattern

| Layer | Pattern | Rationale |
|-------|---------|-----------|
| **Recruiting hub chrome** | **A+** | `WorkdayTopNav` + `WorkdayLeftTabBar` with Recruiting secondary nav — matches `design/references/recruiter-flow/README.md` (**Recruiter Hub – Overview / Dashboard**). |
| **Req pipeline / nationalisation dashboard** | **D** | Dense **tabs + filters + summary + table** — matches **`Recruiter_Hub_-_Job_Requisitions_…`** and **`design/references/pattern-hired-score-grid.md`**. |
| **Offer compliance decision** | **C** | **Modal** over hub (**Create Job Application** reference) for **initiate offer** / **compliance check** — keeps focus and matches **task completion** pattern. |
| **Executive summary** | **A+** inner | **Card**-based KPI / programme tiles on **`SANA_PAGE_CANVAS`** — matches **`Recruiter_Hub_-_Dashboard_for_a_Recruiter-…`**. |

**Primary pattern label for brief:** **A+** (hub) with **D** workspaces and **C** for offer modal.

## 3. Reference layouts (do not invent)

• `design/references/recruiter-flow/README.md` — shell **A+**, **D** manifest rows.  
• `design/references/pattern-hired-score-grid.md` — **filters + table** for candidate/req lists and **composition** tables.  
• `design/references/pattern-candidate-smart-view.md` — **header card**, **two-column** detail (reuse **structure** for **executive drill-down** cards, not candidate comms).  
• **Sana:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (shell); optional `Sana_Style_UI-candidate-profile-whatsapp-panel.png` **not** required (no **CommunicationDock** in v1 scope).

## 4. Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` — Sana grey bar, pill search, utilities, avatar. |
| **Left** | `WorkdayLeftTabBar` — primary rail + **Recruiting** secondary column (**all** tabs defined below). |
| **Centre** | White **Cards** on **`SANA_PAGE_CANVAS`**; **`Heading size="large"`** page title; **no breadcrumbs** ( **`010-style-guide.mdc`** ). |
| **Right** | **None** for v1 (**CommunicationDock** out of scope unless PM extends). |

## 5. Hierarchy

1. **Dominant:** **Quota / composition** vs **target** for selected **scope** (org, location, req).  
2. **Secondary:** **Trend**, **filters**, **candidate / req table** (role-gated columns).  
3. **Supporting:** **Data coverage**, **programme** context, **audit** / **export** actions, **footer** disclaimers.

## 6. Interaction model

• **Hub navigation:** `WorkdayLeftTabBar` switches **Overview**, **Job requisitions**, **Candidates**, **Dashboard**, **Nationalisation & compliance**.  
• **Job requisition drill-in (simulated):** From **Job requisitions** tab, **View requisition** opens **in-context** content in the **same** prototype via **state** (no route required for brief): shows **Tabs**: **Candidates** | **Compliance** | **Details**.  
• **Nationalisation & compliance hub tab:** Inner **`Tabs`** with `data-id`: **`recruiter-dashboard`**, **`executive-summary`**, **`programme-admin`**, **`exports-audit`**.  
• **Offer flow:** **`PrimaryButton`** “Initiate offer” (on a candidate row or header actions) opens **`Modal`** — **compliance panel** with **severity** (inform / warn / block per config), **drill-down** link, **override** path when allowed.  
• **Exports:** **`Modal`** or **side** **`Card`** confirming **customer responsibility** for downloaded files (PRD).

## 7. Layout framework A–F

| ID | Application |
|----|-------------|
| **A – JTBD** | Outcome: **faster, defensible** quota-aware hiring; human decision at offer. |
| **B – Shell** | **A+** + **D** + **C** (modal). |
| **C – Hierarchy** | **Title → scope line → actions → summary metrics → table/cards → footer**. |
| **D – Density** | Medium-high in tables; **sparkline** / **trend** text optional (simple **BodyText** if no chart CK). |
| **E – Accessibility** | **`FormField`** labels, table **headers**, **modal** focus trap, **aria-label** on icon actions. |
| **F – Canvas coverage** | **Every** left hub tab and **every** inner tab populated with **representative** CK content (no stubs). |

---

# PASS 2: UI composition (Canvas Kit)

## 0. Canvas Kit discovery

**MCP:** `user-canvas-kit-mcp` — **`get-canvas-kit-tokens`** invoked (28 March 2026). Resources available include **`docs://tokens/color-roles`**, **`docs://tokens/color-contrast`**, v14 migration guides. Prototype implementation (**320**) must use **`@workday/canvas-kit-react`** + **`design/components/sanaShellTheme.ts`** tokens (**`SANA_PAGE_CANVAS`**, **`SANA_CARD_RADIUS_LG`**, **soap300** borders) per **`010-style-guide.mdc`**.

**Candidate components:** `Box`, `Flex`, `Card`, `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`), `Tabs` (`.List`, `.Item`, `.Panel` + **`data-id`**), `Heading`, `BodyText`, `Text`, `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton`, `Modal`, `Banner` (for **in-flow** block/warn only — not for mock-data-only notices), `FormField`, `TextInput`, `Checkbox`, `Radio`, `Pagination`, `SystemIcon`, `Avatar`, `CountBadge`, `Toast` (optional success). **Filters:** `FormSelect`, `FormTextInput`, `FormDateInput` from **`design/components/SharedFormControls.tsx`** (not raw CK **Select** for simple dropdowns).

**Quota visualisation:** Use **`Flex`** + **`Box`** “bar” segments with **token** backgrounds (e.g. **soap200** track, **blueberry400** / **greenApple400** fills) unless a delivered CK chart pattern is introduced later.

## 1. Map layout → Canvas Kit (by surface)

### A. `WorkdayLeftTabBar` — Recruiting hub (all tabs)

| Secondary tab | Representative content |
|---------------|-------------------------|
| **Overview** | **Card** grid: **My tasks**, open req count, **Nationalisation alerts** teaser (link to hub tab). |
| **Job requisitions** | **FormSelect** filters + **`Table`** (req ID, title, location, **programme status** chip, actions). Row action opens **req detail** state. |
| **Candidates** | **pattern-hired-score-grid**: filter column + **`Table`** (name, req, stage, **classification** column if role allows — else masked). |
| **Dashboard** | **Card** KPI row (time to fill, **quota coverage** mock). |
| **Nationalisation & compliance** | Inner **`Tabs`** (see below). |

### B. Job requisition — **Compliance** tab (Pattern D)

• **Header card:** Req title **`Heading size="large"`**, metadata **`BodyText size="small"`** (ID, location, programme).  
• **Summary row:** **3× `Card`** — **Current composition** (% national / GCC / expat **illustrative**), **vs target**, **trend** (last 30 days **BodyText**).  
• **Pipeline strip:** **`Flex`** stages with **counts** (CK **Text** / **BodyText**).  
• **Table:** Candidates with **stage**, **programme classification** (role-gated), **risk** icon **`SystemIcon`** + **tooltip text** via **title** attr (prototype).  
• **Actions:** **`SecondaryButton`** “Export composition”, **`TertiaryButton`** “View data quality”.

### C. **Nationalisation & compliance** hub — inner tabs

| `data-id` | Content |
|-----------|---------|
| **`recruiter-dashboard`** | Scope **`FormSelect`** (entity, location, programme pack **KSA/UAE**). **Card** with **composition** bars + **`Table`** of reqs breaching **warn** threshold. |
| **`executive-summary`** | **Dashboard**-style **Cards**: programme health, **franchise** roll-up placeholder (labelled **illustrative**), **drill-down** **`SecondaryButton`** to recruiter table. |
| **`programme-admin`** | **`Checkbox`** enable **KSA** / **UAE** packs; **`FormTextInput`** target %; **`FormDateInput`** effective date; **`FormSelect`** org mapping pattern; **`PrimaryButton`** “Save changes” / **`SecondaryButton`** “Cancel”. |
| **`exports-audit`** | **`Table`** — export history (who, when, template); **`SecondaryButton`** “Download template”; **metadata** **`Card`**; **footer** text on **customer governance** of downloads. |

### D. Offer-stage compliance — **`Modal`** (Pattern C)

• **`Modal`** title: **Review offer compliance** (copy for **319**).  
• **`Banner`** **variant** per severity: **default/info** (inform), **caution** (warn), **critical** or **error** (block — only if Legal-approved copy).  
• **Body:** **`BodyText`** explaining **rule**, **population**, **projected** post-hire state.  
• **`Table`** or **definition list** for **factors** (programme, band, headcount).  
• **Override (warn):** **`TextInput`** or **`FormField`** **Reason for override**; **`PrimaryButton`** “Continue with offer” / **`SecondaryButton`** “Go back”.  
• **Block:** **`PrimaryButton`** disabled or absent; **`SecondaryButton`** “Close”; **`TertiaryButton`** “Request exception” (routes to COE — illustrative).

## 2. Sana Style (mandatory)

• **`SANA_PAGE_CANVAS`** behind content; **white** **Cards**; **thin** **soap300** borders; **`SANA_CARD_RADIUS_LG`**; **pill** search in top nav; **neutral** rails; **sparing** blue (**links**, **primary** actions, **focus**).  
• **No** **breadcrumb** or chevron path.  
• **Legal / mock / scope** copy at **bottom** via **`BodyText size="small"`** — **not** warning **`Banner`** for “illustrative data” alone (**320** rule).

## 3. Experience principles (validation)

| Principle | How this design upholds it |
|-----------|----------------------------|
| **Empower** | **Warn** default; user **chooses** to continue; **override** with **reason**; **no** auto-reject. |
| **Trust** | **Drill-down** shows **which** rules and **which** population; **coverage** and **data quality** visible; **honest** **v1** scope (no portal automation). |
| **Grow** | **Admin** self-service for **targets** and **effective dating**; **audit** tables show **who** changed what; **exports** support **iterative** reporting. |

## 4. Copy inventory (for **319** review)

**Flag:** Strings involving **blocks**, **overrides**, **privacy**, **export responsibility**, and **sensitive** attributes require **060** via **319**.

### Buttons and CTAs

• Primary: **Save changes**, **Continue with offer**, **Run export**, **View requisition**, **Download template**  
• Secondary: **Cancel**, **Go back**, **Close**, **Export composition**, **Discard** (confirm modal)  
• Tertiary: **View data quality**, **Request exception**, **View drill-down**

### Form labels and help text

• **Programme pack:** label **Programme** | Help: **Select the nationalisation programme for this scope.**  
• **Organisation / entity:** label **Organisation** | Help: **Choose the supervisory organisation or legal entity for quota calculations.**  
• **Location:** label **Location** | Help: **Filter metrics by work location.**  
• **Target %:** label **Target nationalisation %** | Help: **Customer-maintained target for the selected programme.**  
• **Effective date:** label **Effective date** | Help: **When this target or mapping applies.**  
• **Enable packs:** labels **Saudi Arabia (KSA) programme**, **United Arab Emirates (UAE) programme**  
• **Override reason:** label **Reason for override** | Help: **Required when continuing past a compliance warning. Your entry is stored for audit.**  
• **Export format:** label **Export format** | Help: **Choose CSV or XLSX for manual upload to your government portal.**  

### Banners / inline messages (offer modal)

• **Inform:** **This offer does not change your programme position.**  
• **Warn:** **This offer may move you further from your nationalisation target. Review the breakdown before you continue.**  
• **Block (Legal review required):** **You can’t proceed with this offer under current rules.** + **Plain-language** **why** + **who can override** (copy **TBD** with **060**).

### Error messages

• **Save failed:** **Unable to save programme settings. Check your connection and try again.**  
• **Export failed:** **Unable to generate export. Try again or contact your administrator.**  
• **Missing override reason:** **Enter a reason for override to continue.**  
• **Incomplete data:** **Some candidates are missing programme fields. Metrics may be incomplete until data is updated.**

### Success / confirmation

• **Saved:** **Programme settings saved**  
• **Export ready:** **Export ready. Download will start shortly.**  
• **Offer continued:** **Offer process continued. Compliance decision recorded.**

### Empty states

• **No requisitions in scope:** **No requisitions match your filters. Adjust filters or check programme mapping.**  
• **No audit rows:** **No exports yet. Run an export to see history here.**  
• **No alerts:** **No compliance alerts for this programme.**

### Loading states

• **Loading metrics:** **Loading compliance metrics…**  
• **Loading table:** **Loading candidates…**  
• **Preparing export:** **Preparing export…**

### Modals

• **Discard admin changes:** Title **Discard changes?** Body **Your updates won’t be saved.** Primary **Discard** Secondary **Keep editing**

### Legal / consent / export (high sensitivity — **319** + **060**)

• **Sensitive field helper:** **This field is used for nationalisation and local reporting. Your organisation’s privacy notice should explain how it is used.**  
• **Download responsibility:** **Files you download are governed by your organisation’s policies. Do not share outside authorised channels.**  
• **Scope disclaimer (footer):** **Figures reflect Recruiting data in Workday for the selected scope. They do not replace legal advice or government systems. Automated portal submission is not in scope for version one.**

### Page titles and headings

• **Nationalisation & compliance** (hub)  
• **Requisition compliance** (req context)  
• **Executive compliance summary**  
• **Programme administration**  
• **Exports and audit**  
• **Review offer compliance** (modal)

---

## Handoff

• **318-design-peer-reviewer** — **complete** (see **PASS 3–4** below).  
• **319-doc-writer** — review **Copy Inventory** (invoke **060** for legal-sensitive strings); align with **PASS 4** editorial notes.  
• **320** — new **versioned** prototype file (do **not** reuse prior `vNN.tsx` for a new mission); wire **all** hub and inner tabs per this brief; **mandatory:** **PASS 4** items 1–2 (Banner API, risk icon a11y).

---

**End of PASS 1–2 (315).**

---

## PASS 3: Peer Review Findings (318)

**Reviewer:** Design Peer Reviewer (318)  
**Date:** 28 March 2026  
**Scope:** GCC E2E pipeline — harsh review vs Workday standards, Sana Style, Canvas Kit, JTBD, shell pattern, `docs/experience-principles.md`, no-breadcrumb rule.

### Strategy and JTBD

• **Worksheet alignment:** Verbatim cues match `docs/jtbd-recruiting-hr-professional-and-manager.md` (**Manage candidates throughout the recruiting process**, **Manage my assigned job requisitions**, **Maintain data integrity throughout the recruiting process**, **Be an effective partner to hiring teams**). The synthesised *When / I want / so I can* line is outcome-led (compliance + speed + no silent automation), not a feature list. **Pass.**

• **Shell pattern (A+ / D / C):** Justified against Deployment Agent placement (extend req workspace, dashboards, offer BP, tenant config). Single hub with modal offer gate matches recruiter mental model and **task completion** pattern C. **Pass.**

### Layout quality and references

• **Primary focus:** Hierarchy table (dominant → secondary → supporting) and interaction model make quota vs target and offer-time decision the obvious focal points within three seconds. **Pass.**

• **References:** `recruiter-flow/README`, `pattern-hired-score-grid`, `pattern-candidate-smart-view` (structure reuse), Sana shell PNG — appropriate; CommunicationDock correctly out of scope for v1. **Pass.**

• **Overview vs Dashboard:** Both are hub-level tabs; content differentiation is described (Overview = tasks + teaser, Dashboard = KPI row). **Minor risk:** labels could feel redundant to PMs — acceptable if **320** makes Overview clearly **action-oriented** and Dashboard **metrics-oriented** (copy and density).

### Sana Style and no-breadcrumb rule

• **`SANA_PAGE_CANVAS`**, white cards, soap borders, pill search, neutral rails, footer disclaimers instead of warning **Banner** for mock scope — aligned with **`010-style-guide.mdc`**. Explicit **no breadcrumbs** / no chevron path; page title via **`Heading size="large"`**. **Pass.**

### Canvas Kit and design system accuracy

• **Tab pattern:** `Tabs` with matching **`data-id`** on **`.Item`** and **`.Panel`** — correct for v14. **Table** compound structure — correct. **Shared** `FormSelect` / `FormTextInput` / `FormDateInput` — matches **320** pre-flight. **Pass.**

• **Banner (severity in offer modal):** PASS 2 names **`Banner` `variant`** values (**default/info**, **caution**, **critical**, **error**). In **Canvas Kit React v14** (this repo), **`Banner`** is a **compound** component driven by model props such as **`hasError`** (see `useBannerModel` and existing prototypes using **`Banner` + `Banner.Icon` + `Banner.Label`**), not a single `variant` enum matching inform / warn / block. **This is a spec inaccuracy** that could mislead **320** into non-existent APIs. **Must** be resolved at implementation time via **PASS 4** (map severities to supported **Banner** patterns + **MCP** / tokens). Flagged harshly as a handoff risk; not a full layout failure.

• **Risk icons:** Prototype **`title`** on hover for tooltips is weak for keyboard and screen-reader users. **320** should prefer **`FormField` hint text**, visible **BodyText**, or a CK-accessible popup pattern if available — at minimum **`aria-label`** on the icon control, not only `title`.

• **Pagination:** Listed as a candidate component without a scenario — harmless if unused; drop or tie to table spec to avoid stray imports.

### Navigation completeness

• All five **WorkdayLeftTabBar** secondary tabs and four **Nationalisation & compliance** inner tabs have representative content described; req drill-in **Candidates | Compliance | Details** is specified. **Pass** for **010** / **320** “no stub tabs” rule.

### Copy (spot check — Editorial Guidelines)

• **319** should run a full pass on the **Copy Inventory**: **sentence case** for headings and buttons, **British English** (**organisation**, not **organization**), and consistency for product terms (e.g. **requisition**, **programme**).

• Mixed **organisation** / **organization** in labels — standardise per **010**.

• Legal-sensitive strings already flagged for **060** — good.

### Experience principles (mandatory cross-check)

| Principle | Assessment |
|-----------|------------|
| **Empower** | Warn-first, override with reason, no auto-reject, human at offer — matches **Augment over Replace** and outcome focus. **Strong.** |
| **Trust** | Drill-down, coverage / data quality, honest v1 scope (no portal automation), Six Hats **Black** on discrimination — matches **Transparency** and **Quality with Accuracy**. **Strong.** |
| **Grow** | Admin self-service (packs, targets, effective dating), audit and export history — matches **Easy Change** and visible history. **Strong.** |

**Gap (minor):** **Tertiary hiring manager** job is acknowledged in JTBD but only concretely tied to the **offer modal**. Coherent for v1; if **320** adds any HM-facing teaser elsewhere, keep it strictly **minimal** per PRD progressive disclosure.

### Summary severity

| Area | Rating |
|------|--------|
| JTBD + shell | Strong |
| Hierarchy + references | Strong |
| Sana + no breadcrumbs | Strong |
| Full tab coverage | Strong |
| CK mapping | Good — **Banner severity wording must be corrected at build** |
| Copy | Good — **319** pass still required for case and British spelling |
| Accessibility | **Tooltip / risk icon** pattern needs upgrade beyond `title` |

---

## PASS 4: Final Improvements (318 → 315 / 319 / 320)

1. **320 — Banner:** Do **not** implement fictional **`variant={inform|warn|block}`** on **Banner**. Use **`@workday/canvas-kit-react/banner`** compound pattern; map **inform / warn / block** to supported visuals (**`hasError`**, icon choice, semantic colours via **tokens** / **MCP colour-roles**) and document the mapping in code comments. Re-run **`get-canvas-kit-tokens`** if unsure.

2. **320 — A11y:** Replace **`title`-only** risk tooltips with **`aria-label`** on **`ToolbarIconButton`** / **`SystemIcon`** wrappers and/or visible helper text for **programme classification** risk.

3. **319:** Apply **sentence case** and **British English** across Copy Inventory; run **060** on block / override / export / privacy strings before freezing prototype copy.

4. **315 (optional tidy):** In PASS 2 §D, replace the line that cites **`Banner` `variant`** with **“severity styling via Canvas Kit `Banner` compound + `hasError` / tokens (see 318 PASS 4)”** so the brief and implementation stay aligned — **not required to unblock** if **320** follows PASS 4 item 1.

---

### Final Verdict: **APPROVED**

The brief is **buildable**, **well-grounded**, and **aligned** to recruiter workflows, Sana shell, experience principles, and full navigation coverage. **Approve** conditional on **320** treating **PASS 4 items 1–2** as mandatory and **319** completing editorial + **060** on legal-sensitive copy. **No full PASS 1–2 rewrite** required.

**320** may proceed from this brief + PRD once **319** outputs are reflected in implementation (or in parallel if orchestrator sequences copy fixes into the prototype pass).

---

## PASS 5: Visual Review (321)

**Reviewer:** Prototype Visual Reviewer (321)  
**Prototype URL:** `http://localhost:5199/gcc-nationalisation-local-compliance-reporting-v62`  
**Screenshots analysed:** Desktop viewport **1920×1080** (full-page capture) + viewport screenshot with **Review offer compliance** modal open  
**Review date:** 28 March 2026  
**Pipeline context:** GCC E2E — post-**320** gate before **330** Figma capture

### Visual bugs identified

**Critical (fix before Figma)**

1. **Main workspace horizontal overflow at desktop** — At **1920×1080**, the **Nationalisation & compliance** view shows a **horizontal scrollbar** on the primary content well. **Page subtitle**, **inner tab** label (**Programme administration** reads as truncated), and **Location** helper text are **visually clipped** on the right. This breaks scan-ability and undermines the brief’s hierarchy on the default hub tab. **Recommended fix:** Trace the flex/`minWidth: 0` chain from **`WorkdayLeftTabBar`** through the scrollable **`Box`** (`flex={1} minWidth={0}`) and **`shellCard`**; remove or localise **`overflowX: 'auto'`** on **`tableShell`** where it forces page-level width; ensure **`Tabs.List`** and filter **`Flex`** rows wrap without forcing intrinsic width past the viewport.

2. **Offer modal: inner scroll + clipped override field** — With **Review offer compliance** open (**warn** path), the modal body shows a **vertical scrollbar** and the **Reason for override** **`TextInput`** appears **cut off** at the bottom of the modal card. Users may not realise the field is usable. **Recommended fix:** Let **`Modal.Body`** grow within viewport (`maxHeight` + **`overflowY: 'auto'`** on body only), reduce fixed **`maxWidth`/`margin`** pressure, or shorten above-the-fold content; verify padding so the input and actions are not clipped.

**Important (should fix)**

1. **Stacked scrollbars** — Page-level vertical scroll plus modal inner scroll (and horizontal scroll on hub) creates a **heavy chrome** feel. Resolving overflow (above) should reduce this.

2. **Hidden tab panels and accessibility snapshots** — Browser snapshots while on **Nationalisation & compliance** listed content from multiple inner **`Tabs.Panel`** regions at once. If that reflects the DOM (not only tooling), verify **Canvas Kit** **`Tabs`** **`hidden`** / **`inert`** behaviour so inactive panels are not exposed to assistive tech.

**Minor (polish)**

1. **Demo severity toggles** — **TertiaryButton** row **Demo: inform / warn / block** is valuable for PM review but reads as **engineering chrome** in a stakeholder or Figma capture. Consider collapsing under **Advanced** or documenting as prototype-only in capture notes.

### Canvas Kit usage

**Correct**

• **`WorkdayTopNav`**, **`WorkdayLeftTabBar`**, **`Tabs`** with **`data-id`** on **`.Item`** / **`.Panel`**, compound **`Table`**, **`Modal`**, **`PrimaryButton` / `SecondaryButton` / `TertiaryButton`**, **`FormSelect` / `FormTextInput` / `FormDateInput`**, **`Checkbox`**, **`Heading` / `BodyText`**, **`SystemIcon`** / **`ToolbarIconButton`**, **`Banner`** with **`Banner.Icon`** + **`Banner.Label`**.

• **318 PASS 4 item 1 (Banner):** Implemented without fictional **`variant`** — **`hasError={false}`** for inform and warn (warn uses **caution** left border via **`colors.cantaloupe600`**), **`hasError={true}`** for block. Matches brief intent.

• **318 PASS 4 item 2 (risk affordance):** **Requisition → Candidates** row risk uses **`ToolbarIconButton`** with a descriptive **`aria-label`** (not **`title`**-only).

**Incorrect or questionable**

• None on component choice; issues observed are **layout/sizing**, not wrong primitives.

### Sana Style compliance

**Strong**

• **`SANA_PAGE_CANVAS`** field, **neutral** left chrome, **pill** search, **white** main **`shellCard`** with lifted shadow, **cards** with **`SANA_CARD_RADIUS_LG`** / **soap** borders, **sparing** blue on links and primaries, **footer** disclaimer as **small** **`BodyText`** (no mock-data **Banner**).

**Needs adjustment**

• **Truncation and horizontal scroll** on the hub undermine the **calm, scannable** Sana bar; fix overflow so typography and tabs read as **intentional**, not cramped.

### Design Brief alignment

**Matches intent**

• **A+** shell with **Recruiting** hub, **all five** secondary tabs populated, **Nationalisation & compliance** inner tabs (**recruiter-dashboard**, **executive-summary**, **programme-admin**, **exports-audit**) with representative content. **Req drill-in** with **Candidates | Compliance | Details**, composition bars, export modal, discard confirmation, **no breadcrumbs**.

**Deviates**

• **Visual execution** of the hub and offer **modal** does not yet meet the brief’s **readable hierarchy** and **offer-stage** clarity until overflow is corrected.

### Accessibility observations

**Good**

• **ToolbarIconButton** **`aria-label`** on risk; modal actions and **Continue with offer** disabled state with **`title`** hint when override empty; form labels and table headers present in snapshots.

**Needs attention**

• **Clipped copy** and **modal clipping** harm **low-vision** and **motor** users; **tab panel** exposure (if real) needs **inert** inactive panels.

### Experience principles (interactive)

**Empower**

• Controls and **warn** path with **override** are clear in concept, but **clipped** modal input risks users feeling **blocked** without understanding why. Fix layout to restore **predictable** continuation.

**Trust**

• **Banner** severity and **composition** storytelling align with **Trust**; **layout glitches** (scrollbars, truncation) reduce **perceived quality**.

**Grow**

• **Admin** dirty state, **discard** modal, and **export** flow support **Grow**; **horizontal scroll** on the hub makes **self-service** scanning feel fragile.

**Overall:** Intent is strong; **execution** must be tightened before **330**.

### Final Verdict: **NEEDS REVISION**

**320** should address **critical** items **1–2** (hub horizontal overflow / clipping; modal body height and override field visibility) in **one revision pass**, then **321**-equivalent re-check or PM sign-off before **330** Figma capture.
