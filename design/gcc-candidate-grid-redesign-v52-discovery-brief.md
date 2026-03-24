# Discovery & Design Brief: Candidate Grid Redesign (v52)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v52-prd.md` (post–Red Team revision)  
**Red Team:** `docs/prds/gcc-candidate-grid-redesign-v52-prd-red-team-review.md`  
**Research:** `research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v52.md` — E2E recommendation **#5** (candidate grid / unified recruiter UX)  
**CI:** `research/competitive/gcc/e2e-ci-brief-candidate-grid-redesign-2026-03-22.md` (**GCC-E2E-011** fresh **101**)  
**Created:** 22 March 2026  
**Agent:** 315 — Prototype Discovery & Design (**PASS 1–2 only**; GCC-E2E-011)

---

## PASS 1: Layout strategy (design thinking + grounding)

### 1.1 Deployment Agent grounding (mandatory)

**Source:** Workday Deployment Agent (`ask_deployment_agent`), thread **`eb984a05-f81e-44f5-8c59-f7cf1575f0fc`** (GCC-E2E-011 **101** pass), March 2026.

**Job requisition → Candidates grid**

• Default grid often emphasises **on-point** candidates; **All Candidates** exposes the full applicant pool.  
• **Edit Grid Configuration** controls columns, **Show in Panel** (slide-out panel fields), and **CV preview**.  
• Grid is **user- and role-aware** (recruiter vs hiring manager may see different default views).

**Opening a candidate**

• Profile opens in the context of the **most relevant active job application** (permissions-aware); other applications via **Jobs Applied To**.  
• Candidate profile layout aligns with worker profile patterns; **Configure Profile Summary** orders summary cards.

**Slide-out panel vs deeper profile**

• **Slide-out panel** is a **configured** preview; **CV preview** can appear in panel or modal depending on configuration.  
• This initiative’s **delta** (per PRD + **101** CI brief + Red Team): a **unified full-context modal** with **carousel** (summary + inline CV + notes + timeline narrative) and **keyboard prev/next**, reducing **tab switching** versus **partial** panel content and **multi-tab** profile. **Positioning:** Workday already supports **sequential review** between candidates (Deployment Agent); sales and UX should stress **single-surface / tab reduction**, not “first time” next/previous navigation.

**CV / resume viewing (feasibility note)**

• Red Team + PRD acknowledge **today’s** isolation pattern (new tab / dedicated viewer) vs **target** inline rendering. **320** must implement **fallback**: **Open CV** when inline body fails or platform lags spike outcomes.

**Viewed / unviewed indicator (buyer narrative — not prototype scope)**

• Deployment Agent: **no native** viewed/unviewed flag on the grid; leading practice is a **Reviewed** recruitment process step. **Do not** prototype a native “unread” badge unless product later scopes it; enablement copy should align with PRD **Risks** section.

### 1.2 Functional knowledge

**Workspace state:** `functional-knowledge/` in this repo contains initialization/verification artefacts only (no PDFs on disk). **315** defers authoritative configuration citations to Deployment Agent + PRD; **420/430** should re-check indexed functional docs for purge/retention wording if story copy references logging.

### 1.3 JTBD (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

• **Worksheet (verbatim):** *Determine if candidate meets requirements of the job*; *Progress candidates through the stages of the pipeline as efficiently as possible*.  
• **Synthesised JTBD:** *When I am reviewing 100+ candidates on a requisition, I want a single surface that shows summary, CV, notes, and history together, so I can shortlist and progress stages without tab-switching fatigue.*

**Prototype implications**

• **One dominant review surface** (modal) with **scannable** left context and **readable** CV column.  
• **Queue continuity**: prev/next follows **filtered grid order**.  
• **In-modal actions** for the highest-frequency stage move (e.g. to **Screen**) without forcing return to grid.  
• **Configurable tenant behaviour** (anonymised screening) must **not** be contradicted by static chrome.

### 1.4 Reference layouts (`design/references/recruiter-flow/`)

| Reference file | Pattern (README) | Use for v52 |
|----------------|------------------|-------------|
| `Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png` | **D** dense workspace | Tabs, filters, **table** density for req workspace chrome |
| `Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` | **D** | **Candidate table** baseline — primary landing behind modal |
| `Creat_Job_Application_-_Recruiter-eb5ce0ed-99c8-4152-bc9e-ec008568c778.png` | **C** | **Large modal over hub** — backdrop, width, header/toolbar rhythm for unified review modal |

**Sana density / shell:** cross-check `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` and `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` for neutral rails, white cards, pill search (via shared `WorkdayTopNav`).

### 1.5 Shell pattern selection (layout regions)

**Orchestrator note:** The task names **shell B** as *primary left nav + centre workspace + optional right context*. In **`recruiter-flow/README.md`**, letter **B** denotes a **candidate profile** chrome variant; for **req → Candidates**, the closest **named** patterns are **A+** (Recruiter Hub sidebar) + **D** (dense grid workspace) + **C** (task-style **modal** overlay).

**Chosen composite (buildable + faithful to references)**

• **A+:** `WorkdayTopNav` + `WorkdayLeftTabBar` (Recruiter Hub navigation).  
• **D:** Centre **Candidates** workspace — filters, **Table**, pagination/infinite scroll affordance, optional **bottom** selection/actions bar if PRD scope expands.  
• **Optional right column:** **Filter stack** or **saved filter** panel (progressive disclosure); **not** a CommunicationDock for this scope unless PRD changes.  
• **C:** **Unified candidate modal** above dimmed workspace (top nav may remain visible per reference **C**).

### 1.6 Layout regions (concrete)

• **Top:** `WorkdayTopNav` — global pill search, utilities, avatar (`010` Sana greys + white pill field).  
• **Left:** `WorkdayLeftTabBar` — primary rail + secondary tabs for **Job requisition** context (e.g. Overview, **Candidates** active, Interviews, Details — every tab gets representative content per `320` rule).  
• **Centre:** **Candidate grid** card — title block (`Heading` + req metadata `BodyText`), filter row, **Table**, pagination/footer. **No breadcrumb** or chevron path; use subtitle lines for req ID / location.  
• **Right (optional):** Collapsible **filters** / **Saved filters** (`Card` or narrow column); desktop-first; on narrow viewports collapse into **Popup** or top **secondary** row.

### 1.7 Hierarchy

• **Primary (dominant):** **Unified candidate modal** when open — recruiter attention on **CV + decision context**.  
• **Secondary:** **Grid** (queue + sort + filter).  
• **Supporting:** Hub tabs, global nav, inline help for boolean syntax.

### 1.8 Interaction model

• **Grid → modal:** Row activate (click or explicit **Review** action — pick one in **320** and stay consistent) opens **Modal**.  
• **Carousel:** **ToolbarIconButton** prev/next + **keyboard** ←/→; wrap behaviour **off** at list ends with disabled buttons.  
• **Stage action:** **Primary** in-modal action moves candidate to **Screen** (or configured target); optional **auto-advance** to next row in filtered set (PRD journey).  
• **Destructive:** **Reject** uses **SecondaryButton** or destructive variant per CK patterns; confirm if product policy requires confirmation modal (stub in prototype if PRD demands).  
• **Mobile:** Stack columns; swipe prev/next **where** supported; maintain visible **Previous** / **Next** controls.  
• **Germany / anonymised screening:** **Variant state** — masked identity fields + **banner** or `BodyText` explaining limited fields **until** stage rules allow full view; **no** fake data in prototype.

### 1.9 Six Hats (lightweight — trade-off clarity)

Modal-first vs expanding slide-out:

• **White:** Panel exists today but is **partial**; PRD targets **full narrative** in one scroll.  
• **Yellow:** Faster batch review; fewer navigation events.  
• **Black:** Large PDFs, RTL legibility, anonymisation conflicts — mitigations in PRD (fallback viewer, QA, masking).  
• **Green:** Optional **Open full profile** deep link for edge cases.  
• **Blue:** Proceed with **modal + carousel** as primary; panel remains **legacy/config** path.

### 1.10 Layout framework A–F

| ID | Topic | Decision |
|----|--------|----------|
| **A** | JTBD | High-volume req triage with unified context; stage progression without tab tax. |
| **B** | Shell | A+ hub + D grid workspace + C large modal; optional right filter column. |
| **C** | Hierarchy | Modal dominates when open; grid visible but de-emphasised under overlay. |
| **D** | Density | Table scan-optimised; modal uses **two-column** split + single scroll for notes/timeline block. |
| **E** | Accessibility | Focus trap in modal; visible focus; `aria-label` on icon nav; keyboard shortcuts documented in help `Popup` (stub). |
| **F** | Canvas coverage | Full hub tabs + grid states + modal states + anonymised variant + loading/error/empty (see PASS 2). |

---

## PASS 2: UI composition (Canvas Kit + Sana)

### 2.1 Canvas Kit MCP

**Expectation:** `get-canvas-kit-tokens` (user-canvas-kit-mcp) before **320** implements.  
**Implication:** Use repo-pinned **Canvas Kit v14** packages per `320-prototype-developer.mdc`; prefer `colors` / `space` from `@workday/canvas-kit-react/tokens` and **system** semantic roles from MCP resources (`docs://tokens/color-roles`, `docs://tokens/color-contrast`) when choosing status / match colouring.

### 2.2 Component mapping (no fantasy UI)

| UI need | Canvas Kit / shared repo |
|--------|---------------------------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar` (`design/components/`) |
| Layout | `Box`, `Flex` |
| Surfaces | `Card` |
| Grid | `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`) |
| Filters | `InputGroup`, `TextInput`, `Select`, `FormField` composition; optional `FormSelect` / shared controls (`SharedFormControls.tsx`) |
| Overlay | `Modal` (+ overlay pattern per CK) |
| Actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` |
| Text | `Heading`, `BodyText`, `Text` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |
| Feedback | `Banner` (**in-flow** errors/success only — never **warning** banner for mock data) |
| Notifications | `Toast` optional |
| Disclosure | `Tabs` **only** if a secondary area needs separation; default path remains **single scroll** in modal body |

### 2.3 Sana Style (`010-style-guide.mdc`)

• **Page canvas:** `SANA_PAGE_CANVAS`; rails/tabs per `sanaShellTheme.ts`.  
• **Cards:** white on grey field; `SANA_CARD_RADIUS_LG`; hairline `soap300` borders.  
• **Modal:** white body, neutral backdrop — **no** blueberry header bands.  
• **Accent:** links + primary buttons; match signals use **semantic** colours, not full-width blue chrome.

### 2.4 Navigation completeness (states)

**Hub / req**

• **WorkdayLeftTabBar:** each secondary tab shows representative UI (lightweight **Card** + `BodyText` acceptable on non-focus tabs if **320** needs scope control — prefer still-real patterns).  
• **Candidates tab:** filter row + table + footer.

**Grid**

• Default populated state; **filtered empty** state; **loading** skeleton or `BodyText` loading line; **error** banner for grid fetch failure.

**Modal — open**

• Header: name line (or masked label) + metadata; **Previous** / **Next** controls; **Close**.  
• Body: **left** summary column; **right** CV pane (inline text **or** placeholder with **Open CV**).  
• **Collapsible:** **Notes and activity** (and optional **AI match insights** stub **if enabled** — keep **human-in-the-loop** copy; **060** before GA strings).  
• Footer / action bar: **Move to Screen**, **Reject**, optional **Open full profile** link.

**Modal — Germany / anonymised**

• Masked fields; explanatory `BodyText` / `Banner` **info** variant (not mock-data warning).

**Keyboard**

• ← / → prev/next when modal focused; **do not** hijack when focus in text field.

### 2.5 Copy inventory — **approved (319, 22 March 2026)**

**Source:** `design/gcc-candidate-grid-redesign-v52-copy-review-319.md`. **320** implements these strings exactly. Icon-only carousel controls: use **`aria-label`** “Previous candidate” / “Next candidate”.

**Buttons / CTAs**

• Previous *(aria-label: Previous candidate)*  
• Next *(aria-label: Next candidate)*  
• Move to screen  
• Reject  
• Close  
• Open CV  
• Open full profile  
• Clear filters  
• Save filter  
• Apply filters  

**Labels / fields**

• Search candidates — hint: **Use AND, OR and NOT between terms.**  
• Stage  
• Applied date  
• Source  
• Match score  
• Location  
• Name  
• Saved filters  

**Table / chrome**

• Candidates  
• Candidate  
• CV  

**Errors**

• We couldn’t load this CV. Open it in a new tab or try again.  
• We couldn’t find this candidate. Return to the grid or refresh the page.  
• We couldn’t load candidates. Check your connection and try again.  

**Empty states**

• No candidates match your filters.  

**Loading**

• Loading candidate profile…  
• Loading CV…  

**Info / compliance (legal-sensitive — 060 before GA)**

• Some candidate details are hidden based on your organisation’s screening rules.  
• These insights are suggestions only. A person makes the hiring decision. *(only if AI insights stub is present)*  

**Not in-product:** Reviewed-step / viewed-status FAQ stays in enablement docs per **319** (avoid grid-badge promise in UI).

---

## PASS 3: Peer review (315)

• **Strategy:** JTBD matches worksheet + v52 PRD; shell A+ / D / C is justified for req → Candidates → modal.  
• **Layout:** Primary focus is the unified modal when open; grid remains scannable; references in `recruiter-flow/` align.  
• **Design system:** Canvas Kit mapping is valid; Sana neutrals and no-breadcrumb rule respected.  
• **Navigation:** All hub tabs require representative content in **320**; modal states cover default, loading, error, empty grid, anonymised variant.  
• **Copy:** Aligned to Editorial Guidelines via **319**; legal lines flagged for **060** at GA.

---

## PASS 4: Fixes applied

• Replaced draft copy inventory with **319** approved strings (§2.5).  
• Clarified carousel **aria-label** pattern and removed in-product FAQ line for reviewed badges.

---

## Final Verdict: APPROVED

**Handoff to 320:** Implement `design/gcc-candidate-grid-redesign-v52.tsx` from this brief and `docs/prds/gcc-candidate-grid-redesign-v52-prd.md`. Invoke **060** before Figma capture if AI or anonymisation strings ship in UI.

---
