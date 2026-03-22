# Discovery & Design Brief: GCC Nationalization & Compliance

**PRD:** docs/prds/gcc-nationalization-compliance-prd.md  
**Created:** 20 March 2026  
**Agent:** 315-ux-designer  
**Mission:** MISSION-016 — GCC E2E, PMF v39 recommendation #1  
**Research:** research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v39.md  

---

## Executive summary

Deliver **OOB nationalization capture and compliance visibility** for Saudi (Nitaqat), UAE (Emiratisation), and Kuwait (Kuwaitisation) inside Workday Recruiting. The prototype focuses on the **compliance dashboard** (recruiter and compliance lead view): nationalisation % vs thresholds, status, drill-down by department, and export—grounded in **Recruiter Hub / dashboard** patterns (shell **A+** or **D**), not a standalone app. **Sana Style** neutrals; Canvas Kit **Table**, **Card**, **PrimaryButton**, tokens (`soap*`, `space.*`).

---

## Workflow context

### Existing Workday flow

- **App/module:** Recruiting; **Dashboards & Reports** and **Job Requisitions / Candidates** for pipeline context.
- **Today:** Customers add **Primary Nationality** via custom fields and **Maintain Localization Settings**; compliance math lives in Advanced Reporting, Excel, or PowerBI (P1/P2 evidence in v39).
- **Trigger:** Compliance lead or TA ops reviews nationalisation weekly or pre-submission; recruiters check pipeline health against targets.

### When this feature is used

- **Trigger:** Quarterly government submissions (Qiwa, MOHRE); audit prep; executive asks for status by entity.
- **Frequency:** Weekly–monthly for compliance leads; per-req for recruiters sourcing against quotas.
- **Personas:** GCC recruiter; Recruiting Operations / Compliance Lead; HR Administrator (configuration—out of prototype scope except labels).

---

## Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter (HR Professional)

- **Outcome area:** Manage my assigned job requisitions / Foster an inclusive and equitable recruiting process.
- **Worksheet JTBD:** *Understand which job reqs are most in need of attention*; *Ensure that there is a diverse candidate slate prior to hiring for an open job requisition*; *Understand the levels of candidate diversity within open job requisitions*.
- **Synthesised JTBD:** *When I am hiring against GCC nationalisation targets, I want to see how my reqs and pipeline compare to thresholds, so I can adjust sourcing and avoid penalties.*

### Manager (hiring manager)

- **Outcome area:** Grow and maintain my team — *Track the progress of candidates through the hiring process* (indirect; dashboard primarily for TA/compliance).

### Prototype implications

- Show **country-level and department-level** nationalisation % vs threshold with **compliant / at risk / non-compliant** states.
- **Export report** action for government-ready narrative (mock success state).
- **Tooltips** carry regulatory context (Nitaqat tiers, Emiratisation, Kuwaitisation)—flag for **060** on exact wording.

---

## Placement decision

### Recommended placement

- **Screen/page:** **Recruiting → Dashboards** (or dedicated **GCC Nationalisation Compliance** dashboard under same hub as other recruiting analytics).
- **Approach:** New pre-built dashboard template + standard report definitions (backend out of scope for prototype).
- **Entry:** Recruiter Hub → **Dashboards** → **GCC nationalisation compliance** (wording sentence case per 319).

### Integration points

- **Data:** Candidate nationality from application / profile; headcount by org; requisition country.
- **Downstream:** Standard reports (Nitaqat quarterly, Emiratisation, Kuwaitisation); export to Excel/PDF.

### Alternatives considered

- **Candidate profile only:** Rejected—does not solve **portfolio compliance** view P1/P2 asked for.
- **Custom report only:** Rejected—perpetuates PowerBI workaround; PRD targets **OOB dashboards**.

---

## Visual shell & references

- **Primary shell pattern:** **A+** (global chrome + recruiter sidebar) or **D** (dense table workspace). Prototype uses **top bar + content well** consistent with `design/references/recruiter-flow/README.md` density.
- **Reference:** `design/references/sana/Sana_Style_UI-e0cea579-b804-4bf4-a662-30fc2a8cbe96.png` — neutrals, card radii, restrained blue.
- **Canvas Kit MCP:** Use `get-canvas-kit-tokens` for any non-default surfaces.

---

## Reusable layout components (for 320)

- **`WorkdayTopNav`:** **Yes** — pill search, notifications, Sana-aligned chrome.
- **`WorkdayLeftTabBar`:** **Yes** — **Overview** (dashboard + department table), **By country** (per-country insight cards with stat tiles and actions), **Alerts** (sorted compliance alerts with severity accent and actions).
- **`CommunicationDock`:** **No**.

---

## Functionality scope (prototype)

1. **Overview tab:** Summary **metric cards** for Saudi / UAE / Kuwait with progress vs threshold and status; **filter** by country; **department breakdown** table; row-level status; **Export report** → success toast (mock); **tooltips** on info icons.
2. **By country tab:** One **card per GCC programme** (flag tile, headline stats, progress vs threshold, insight bullets, **Open department breakdown** switches to Overview with that country selected).
3. **Alerts tab:** List of **compliance alerts** (severity, programme, message, relative time, **View in overview** / **Acknowledge** actions), sorted critical-first.

### Out of scope (prototype)

- Live OData / real tenant data; full application-step UI (separate screen); admin threshold configuration screen.

---

## Functional knowledge & deployment agent (desk alignment)

- **Maintain Localization Settings** and **Primary Nationality** already exist for some tenants; this initiative **productises** GCC programmes and **dashboards**, reducing custom fields.
- **GDPR / PDPL:** Nationality is sensitive; RBAC on dashboard; privacy notice on application capture (candidate flow not in this prototype).

---

## Design rationale (Six Hats — synthesis)

- **White:** v39 theme #1; P1/P2 quotes; Win/Loss less central than interviews for this theme.
- **Red:** Recruiters want confidence they are not exposed to penalties; anxiety when numbers are red.
- **Black:** Wrong threshold config → false green/red; legal wording in tooltips must be validated.
- **Yellow:** Single place for leadership and MOHRE prep; removes Excel churn.
- **Green:** Future: alerts, workflow when req drops below target.
- **Blue:** Ship dashboard prototype first—it tells the ROI story and matches PRD use cases 2–3.

---

## Implementation guidance for 320

- **Components:** `Card`, `Table` (`.Head`/`.Body`/`.Row`/`.Header`/`.Cell`), `PrimaryButton`, `SecondaryButton`, `TextInput`, `Heading`, `BodyText`, `Flex`, `Box`, `SystemIcon`, `Tooltip`, tokens `colors.soap*`, `space.*`.
- **Success criteria:** Flow readable in under 2 minutes; statuses unambiguous; British English in copy; **060** review on tooltip and export strings.

---

## Deployment agent

- **Placement Q (recommended):** “Where should a GCC nationalisation compliance dashboard live for Recruiting customers—alongside existing recruiting dashboards or a new app?”  
- **Thread ID:** _Start new thread per 315 rule when running live MCP._

---

**Hand off to 320:** Implemented in `design/gcc-nationalization-compliance.tsx`; entry via `design/main.tsx` for MISSION-016 capture.
