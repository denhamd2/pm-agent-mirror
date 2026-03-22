# Discovery & Design Brief: Candidate Grid Redesign (v46)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v46-prd.md` (revised post-Red Team)  
**Red Team:** `docs/prds/gcc-candidate-grid-redesign-v46-prd-red-team-review.md`  
**Research:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v46.md` (Theme 3: grid, search, tab fatigue; Theme 6: Arabic/RTL docs risk)  
**Created:** 21 March 2026  
**Agent:** 315 — Prototype Discovery & Design (multi-pass)

---

## PASS 1: Layout strategy (design thinking + grounding)

### 1.1 Deployment Agent grounding (mandatory)

**Source:** Workday Deployment Agent (`ask_deployment_agent`, thread `dafc420b-a6d5-4464-887e-8bd622f92215`), March 2026.

**Job requisition → Candidates grid**

• Default grid often emphasises **on-point** candidates; **All Candidates** exposes the full applicant pool.  
• **Edit Grid Configuration** controls columns, **Show in Panel** (slide-out panel fields), and **CV preview**.  
• Grid is **user- and role-aware** (recruiter vs hiring manager may see different default views).

**Opening a candidate**

• Profile opens in the context of the **most relevant active job application** (permissions-aware); other applications via **Jobs Applied To**.  
• Candidate profile layout aligns with worker profile patterns; **Configure Profile Summary** orders summary cards.

**Slide-out panel vs deeper profile**

• **Slide-out panel** is a **configured** preview; **CV preview** can appear in panel or modal depending on configuration.  
• This initiative’s **delta** (per PRD + Red Team): a **unified full-context modal** with **carousel** (summary + inline CV + notes + timeline narrative) and **keyboard prev/next**, reducing round-trips versus **partial** panel content and **multi-tab** profile.

**CV / resume viewing (feasibility note)**

• Red Team + PRD acknowledge **today’s** isolation pattern (new tab / dedicated viewer) vs **target** inline rendering. **320** must implement **fallback**: **Open CV** when inline body fails or platform lags spike outcomes.

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

| Reference file | Pattern (README) | Use for v46 |
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
• **Optional right column:** **Filter stack** or **saved filter** panel (progressive disclosure); **not** a CommunicationDock for v46 unless scope changes.  
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

**Called:** `get-canvas-kit-tokens` (user-canvas-kit-mcp).  
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

### 2.5 Copy inventory (for 319) — **draft strings**

**Buttons / CTAs**

• Previous candidate  
• Next candidate  
• Move to Screen  
• Reject  
• Close  
• Open CV  
• Open full profile  
• Clear filters  
• Save filter  
• Apply filters  

**Labels / fields**

• Search candidates (boolean)  
• Stage  
• Applied date  
• Source  
• Match score  
• Location  
• Name  
• Saved filters (select)  

**Table / chrome**

• Candidates  
• Candidate  
• CV  

**Errors**

• Unable to load CV  
• Candidate not found  
• Unable to load candidates  

**Empty states**

• No candidates match your filters  

**Loading**

• Loading candidate profile  
• Loading CV  

**Info / compliance (legal-sensitive — 060)**

• Some candidate details are hidden based on your organisation’s screening rules.  
• AI-assisted insights are suggestions only. A person makes the hiring decision. *(only if AI insights row present)*  

---

## CHECKPOINT: Copy review (319 + 060) — **synthetic pass for PASS 3–4**

*Orchestrator normally runs **319** here; below are **approved** strings for **320** to implement verbatim.*

### 319 editorial decisions

| Area | Draft | Approved | Rationale |
|------|-------|----------|-----------|
| Carousel | Next candidate | **Next candidate** | Sentence case; clear queue scope. |
| Carousel | Previous candidate | **Previous candidate** | Matches Next candidate pattern. |
| Stage action | Move to Screen | **Move to Screen** | Proper noun stage label per PRD; retain capital **S**. |
| Destructive | Reject | **Reject candidate** | Explicit object; destructive clarity. |
| Modal dismiss | Close | **Close** | Standard dismiss label. |
| Fallback | Open CV | **Open CV** | Concise verb + noun. |
| Deep link | Open full profile | **Open full profile** | Familiar Workday phrasing. |
| Filters | Clear filters | **Clear filters** | Verb + noun. |
| Filters | Save filter | **Save filter** | Singular task label. |
| Filters | Apply filters | **Apply filters** | Parallel with Clear. |
| Search label | Search candidates (boolean) | **Search candidates** | Remove parenthetical; add boolean **Help** link separately. |
| Boolean help | — | **Boolean search tips** | `TertiaryButton` / `Popup` trigger. |
| Error CV | Unable to load CV | **We can’t load this CV. Open the CV in a new tab or try again later.** | Problem + two solutions (British spelling **can’t**). |
| Error missing | Candidate not found | **We can’t open this candidate. Refresh the list or return to the grid.** | Problem + solution. |
| Error grid | Unable to load candidates | **We can’t load candidates right now. Check your connection and refresh.** | Problem + solution. |
| Empty grid | No candidates match your filters | **No candidates match your filters. Clear or adjust filters.** | Missing + action. |
| Loading profile | Loading candidate profile | **Loading candidate profile…** | Present continuous + ellipsis per guidelines. |
| Loading CV | Loading CV | **Loading CV…** | Present continuous. |
| Anonymisation | Some candidate details are hidden… | **Some details are hidden for this candidate based on your organisation’s screening settings.** | Neutral, accurate; **060** to confirm jurisdiction wording. |
| AI stub | AI-assisted insights… | **These insights are suggestions only. A person makes hiring decisions.** | Human oversight; **060** if shipped. |

### 060 legal-sensitive status

• **Anonymisation / masking copy** — **Review before GA** (Germany / GDPR configuration).  
• **AI match insights** strings — **Required 060** if **any** AI scoring text appears in UI beyond stub.  
• **Audit / logging** — no user-facing consent block required in this modal unless PRD adds; telemetry copy out of scope.

### Approved copy count

**30** discrete approved user-visible strings: **20** in the checkpoint table (revised high-impact copy) plus **10** baseline labels/titles (**Stage**, **Applied date**, **Source**, **Match score**, **Location**, **Name**, **Saved filters**, **Candidates**, **Candidate**, **CV**) carried forward unchanged from the PASS 2 inventory.

---

## PASS 3: Peer review findings (with approved copy incorporated)

### Strategy

• **JTBD** is tight and testable against PRD metrics (session-based dwell, modal adoption).  
• **Shell** composite (A+ / D / C) matches **recruiter-flow** manifest and **Deployment Agent** description of grid + optional panel/preview — v46 **narrows** the gap versus partial panel.  
• **Red Team** risks reflected: **inline CV fallback**, **RTL QA**, **anonymisation variant**, **performance** (lazy CV).

### Layout quality

• **3-second test:** Modal presents **identity + CV** immediately; notes/timeline **below fold** but **single scroll**.  
• **No breadcrumb** paths; req context in **subtitle** lines only.  
• **Right rail** optional filters avoid crowding **D** workspace.

### Design system

• **Canvas Kit only**; shared shell components; **Sana** neutrals enforced.  
• **Banner** discipline respected.

### Navigation completeness

• **Grid / modal / carousel / anonymised / loading / error / empty** documented.  
• **320** must prototype **all** left tabs or justified lightweight real content per rule.

### Copy quality

• Approved strings are **sentence case**, concise, and **problem + solution** for errors.  
• **Move to Screen** kept as stage label per PRD.

### Experience principles (`docs/experience-principles.md`)

• **Empower:** Recruiter controls **Next** / **Previous**, **Reject**, **Move to Screen**; no auto-advance without action.  
• **Trust:** Explicit **fallback** for CV; clear **anonymisation** explanation; no fake “encrypted” claims.  
• **Grow:** **Saved filters** and boolean help support iterative refinement.

---

## PASS 4: Final improvements (one pass)

1. **Clarified shell lettering** vs `recruiter-flow/README.md` to avoid **B** mismatch — documented **A+ / D / C** mapping to the user’s **left + centre + optional right** model.  
2. **Separated** boolean placeholder from label (**Search candidates** + **Boolean search tips**).  
3. **Added** anonymised + AI stub copy paths with **060** gates.  
4. **Anchored** Deployment Agent thread id for traceability.

---

## Final Discovery & Design Brief (production-ready handoff)

### Placement

• **Primary:** **Recruiting → Job requisition → Candidates**.  
• **Secondary (pattern parity only if scoped later):** **Find Candidates** may reuse **Table + modal** — **not** required for v46 prototype unless PM expands.

### Visual / component summary

• **WorkdayTopNav** + **WorkdayLeftTabBar** + **Sana** tokens.  
• **Dense grid** (`Table`) + **Modal** unified review + **carousel** navigation.  
• **FormField**-style summary **left**; **CV** **right**; **collapsible** notes/timeline (and optional AI insights stub).  
• **Germany / anonymisation** variant documented.

### PRD alignment notes

• **Performance:** lazy CV; **Open CV** fallback.  
• **Mobile:** swipe + visible buttons.  
• **Out of scope:** export/compare — **omit** from chrome.  
• **Phase 2:** database-wide AI matching — **do not** build full second surface in v46 unless instructed.

### Handoff to 320

Build `design/gcc-candidate-grid-redesign-v46.tsx` (or name provided by PM) using:

• Approved copy **exactly** as in CHECKPOINT table.  
• References: `recruiter-flow` PNGs cited above + Sana PNGs in `design/references/sana/`.  
• **get-canvas-kit-tokens** + token resources when choosing non-default colours.

---

## Final Verdict: **APPROVED**

**320** may proceed when this file is the source of truth. If **inline CV** spike fails, keep **layout** and swap right pane to **Open CV** primary action without revisiting shell verdict.

---

## Return summary (orchestrator)

| Item | Value |
|------|--------|
| **Discovery brief path** | `design/gcc-candidate-grid-redesign-v46-discovery-brief.md` |
| **Final Verdict** | **APPROVED** |
| **Key layout decisions** | A+ hub + D grid workspace + C unified modal; optional right filter column; carousel prev/next + in-modal **Move to Screen** / **Reject candidate** |
| **Canvas Kit** | `Modal`, `Table`, `InputGroup`, `Card`, `FormField`, buttons, `ToolbarIconButton`, `Heading`/`BodyText`, optional `Toast`/`Banner` (in-flow only) |
| **Copy review status** | **30** approved strings (synthetic **319** pass + **060** flags for anonymisation + AI stub) |
