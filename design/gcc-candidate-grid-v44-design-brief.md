# Discovery & Design Brief: Candidate Grid, Search, and AI Matching (GCC v44 #4)

**Research:** GCC PMF v44 — Theme 4 (grid density, search, AI matching); Priority 1 recommendation with customer-converged evidence  
**Feature summary (v44 #4):** Redesign candidate overview to reduce tab sprawl; strengthen boolean and semantic search; add similar-candidate and database-wide match with HiredScore alignment and mandatory human review for regulated hiring  
**Created:** 21 March 2026  
**Agent:** 315 — Prototype Discovery & Design (multi-pass)

---

## PASS 1: Layout strategy (grounding + design thinking)

### 1.1 Deployment Agent grounding (Workday today)

**Source:** Workday Deployment Agent (thread `32d2d3dc-4091-4303-8c07-98d70dc91de5`), March 2026.

- **Recruiter Hub** is the central entry; recruiters move between assigned requisitions and global candidate search.
- **Job requisition → candidate grid:** Configurable table of applicants; stages; filter/sort; optional **CV preview** in grid configuration; **HiredScore** grades (A–D) when enabled, sortable by fit.
- **Candidate profile (current):** Opening a candidate typically surfaces **multiple tabs** (e.g. Summary, Application, Feedback, Attachments) — this matches **v44 pain** (P2 Baker Hughes): switching tabs to see education vs CV is slow at 100–200 candidates.
- **Global search:** **Find Candidates** report — keywords and **boolean** (AND, OR, NOT) on resumes/profiles; facets (location, skills, experience, education, language, employer, etc.).
- **HiredScore (when on):** **Global Talent Search** for AI-powered database search; **Reverse Fetch** suggests matching open reqs for a candidate; talent pooling via **Candidate Lists** and **Fetch** inbox on reqs.

**Design implication:** The brief targets **reducing tab friction inside review**, **stronger boolean/semantic search UX**, and **explicit alignment** with HiredScore-style match signals — without implying fully automated hiring decisions.

### 1.2 Research quotes (scope anchor)

- **P2 (Baker Hughes):** Multi-tab navigation to education vs CV is **time-consuming** at high volume.
- **P2:** Boolean search “not that strong”; desire for **combinations**, **AI-assisted** search across **very large** internal databases, and **“who else is matching”**.

### 1.3 JTBD (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md` — Talent Acquisition cluster.

**Verbatim worksheet anchors**

- *Determine if candidate meets requirements of the job*  
- *Progress candidates through the stages of the pipeline as efficiently as possible*  
- *Source high quality candidates for active job requisitions*  
- *Maintain a pool of prospective candidates for future sourcing needs*

**Synthesised JTBD (recruiter)**

- **When** I am reviewing a large applicant pool or searching across a multi-million-record candidate database, **I want** decisive context (fit signal, skills, history) **and** the full CV in one continuous view, plus search that supports boolean, semantic, and “similar candidate” discovery, **so I can** shortlist and advance stages quickly without losing place or over-trusting automation.

**Prototype implications**

- **One review surface** (modal or full-screen panel) with **split layout**: summary + match on the left, **scrollable resume** on the right — **no horizontal tab strip** for core review (progressive disclosure only for edge cases if PRD insists).
- **Queue navigation:** Previous / next aligned to **current grid sort order**; keyboard shortcuts documented in UI.
- **Grid:** Dense, sortable **Table**; filters; optional **match grade** column when HiredScore is in scope.
- **Search row:** Boolean-friendly query input, optional **semantic / AI-assisted** mode toggle, and an action for **similar candidates** / **database-wide match** that always lands in a **human-reviewed** results table.

### 1.4 Shell pattern selection

**Reference manifest:** `design/references/recruiter-flow/README.md`

| Role | Pattern | Rationale |
|------|---------|-----------|
| **Primary workspace** (req Candidates or Find Candidates results) | **D — Dense workspace** | Matches `Recruiter_Hub_-_Candidates_for_a_Recruiter` and `Find_Candidates` references: hub chrome, filters, **Table** density, sustained scanning. |
| **Candidate deep-dive** | **C — Modal task** | Matches `Creat_Job_Application_-_Recruiter` modal idiom: **large overlay**, top nav visible behind, **focus on task completion** (review + decide). Deliberately avoids **Pattern B**’s multi-tab profile chrome for this GCC scope — we are **replacing tab sprawl** with a **split-panel** modal. |

**Secondary:** **A+** if the prototype entry is Recruiter Hub sidebar before landing on **D**.

### 1.5 Reference layouts (must cite)

- **Table + filters workspace:** `design/references/recruiter-flow/Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` (Pattern **D**)
- **Sourcing / search:** `design/references/recruiter-flow/Find_Candidates_-_Recruiter-fa9cffaf-588b-418c-a1e7-a3c183802f8e.png` (Pattern **A+** / search-led list)
- **Modal proportions:** `design/references/recruiter-flow/Creat_Job_Application_-_Recruiter-eb5ce0ed-99c8-4152-bc9e-ec008568c778.png` (Pattern **C**)
- **Sana shell parity:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (top nav + grey hub); for typography and card calm use `Sana_Style_UI-candidate-profile-whatsapp-panel.png` as density reference (comm dock optional — **off by default** unless PRD extends to messaging).

### 1.6 Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` — global pill search, utilities, avatar (`010-style-guide` / `sanaShellTheme`) |
| **Left** | `WorkdayLeftTabBar` — Recruiter Hub sections; on req route, secondary tabs include **Candidates** active |
| **Centre** | **Card**-wrapped **Table** (grid), filter bar, **enhanced search** (boolean + semantic toggle), bulk actions strip (prototype-level) |
| **Right** | Optional `CommunicationDock` **collapsed** by default — only if PRD includes outreach in same flow; else omit to reduce noise |

### 1.7 Hierarchy

1. **Dominant:** Candidate **Table** (scan + sort + select).  
2. **Secondary:** Open **review modal** — **resume column** draws the eye; left column supports **decision**.  
3. **Supporting:** Search help, AI disclosure, filter chips, pagination.

### 1.8 Interaction model

- **Modal** opens from row activation (click primary cell or explicit **Review** action).  
- **Inside modal:** **No breadcrumb / path strips** (`010` hard rule). Title = candidate name; subtitle = req title + stage + match.  
- **Prev / Next** in modal header — **ToolbarIconButton** pair + **BodyText** hint for keyboard.  
- **Tabs inside modal:** **Avoid** for MVP; if **Feedback** or **Attachments** must appear, use **secondary** `Tabs` **below the fold** or a **single** “More details” `Popup` — not the default view.

### 1.9 Layout framework (A–F)

| Letter | Checkpoint | Brief answer |
|--------|------------|----------------|
| **A** | JTBD | High-volume assessment + sourcing efficiency; human-owned decisions. |
| **B** | Shell | **D** (grid) + **C** (modal); **A+** entry acceptable. |
| **C** | Hierarchy | Table first; modal split panel; resume primary in modal. |
| **D** | Density | Configurable columns; compact key-value left column; readable resume line length in right column. |
| **E** | Accessibility | Modal focus trap; visible focus; sortable headers keyboard-accessible; AI and match labels not colour-only. |
| **F** | Canvas coverage | `Table`, `Modal`, `Card`, `FormField`, `TextInput`, `Select`, `Tabs` (sparingly), `Button`, tokens — see PASS 2. |

### 1.10 Six Hats (optional, lightweight)

| Hat | Note |
|-----|------|
| White | v44 evidence + Deployment Agent confirms grid, boolean, HiredScore surfaces exist — UX gap is **integration and friction**. |
| Red | Tab switching feels like the system wastes time on busy days. |
| Yellow | Unified modal + stronger search could lift throughput and satisfaction in GCC enterprise volumes. |
| Black | Semantic + similar-candidate features risk **false confidence** if disclosure and human review are weak; performance on huge result sets. |
| Green | Combine match column + “similar” drawer that reuses same modal layout for comparability. |
| Blue | Proceed with **human-in-the-loop** as a **non-negotiable** design constraint. |

---

## PASS 2: UI composition (Canvas Kit + Sana)

**Canvas Kit MCP:** `get-canvas-kit-tokens` consulted (v14 / token resources available). Prototype implements with repo-pinned Canvas Kit packages per `320-prototype-developer.mdc`.

### 2.1 Placement (where in Workday)

- **Primary:** **Recruiting → Job requisition → Candidates** (applicant grid on a specific req).  
- **Secondary:** **Find Candidates** / **Global Talent Search** (when HiredScore enabled) — same **Table + modal** pattern so behaviour is learnable once.  
- **Rejected for this concept:** Standalone-only profile with no grid context (breaks queue mental model).

### 2.2 Key UI elements

**A. Candidate grid (behind modal)**

- Filter row: `Select`, `TextInput` / `InputGroup` for quick filters, **Save filter** as `SecondaryButton` (prototype stub).
- **Table** with sortable headers: Name, Stage, Location, **Match** (grade or score), Applied date, Source, Flags.
- Row click opens **Modal**.

**B. Unified candidate review modal**

- **Modal** (`Modal` + `Modal.Overlay`): large width (~90vw max), white **Card** body, soft shadow (`SANA_CARD_SHADOW` / depth tokens).  
- **Header:** `Heading` + `BodyText` metadata; **Flex** toolbar: **Previous** / **Next** `ToolbarIconButton`; `SecondaryButton` Close; optional **Stage** `Select`.  
- **Body — two columns (`Flex` or CSS grid):**  
  - **Left (narrow ~320–400px):** `Card` with compact **FormField**-style rows OR dl-style **BodyText** lists: Name, Req, Stage, **Match score / grade**, **Skills summary**, Education snippet, Last activity, Owner. Use **semantic** `system.color` / `colors.*` for **match** (not blue chrome walls).  
  - **Right (flex 1):** `Card` with **resume** content — `Heading` “Resume / CV”, `BodyText` with comfortable line length; scroll container.  
- **Footer:** `PrimaryButton` (“Advance stage” / “Save” stub), `SecondaryButton` “View in full profile” optional link-out (if product keeps legacy profile).

**C. Search enhancements**

- **Search bar:** `InputGroup` with leading `SystemIcon` (`searchIcon`); placeholder e.g. “Search candidates with boolean (AND, OR, NOT)…”  
- **Boolean helper:** `TertiaryButton` or `Popup` with **non-blocking** examples (319 will tighten copy).  
- **Semantic / AI-assisted toggle:** `Switch` or `Checkbox` — **paired with disclosure** (see §3.3).  
- **Actions:** `SecondaryButton` “Find similar candidates” → opens **new Table state** or slide-in **Panel** listing matches with **same modal** on row open.

### 2.3 Canvas Kit component mapping

| UI need | Canvas Kit (v14) |
|---------|------------------|
| Page layout | `Box`, `Flex` |
| Shell | Shared `WorkdayTopNav`, `WorkdayLeftTabBar` from `design/components/` |
| Surfaces | `Card` |
| Data grid | `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`) |
| Overlay review | `Modal`, `Popup` |
| Inputs | `TextInput`, `InputGroup`, `Select`, `FormField` |
| Actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` |
| Text | `Heading`, `BodyText`, `Text` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |
| Tabs (sparse) | `Tabs` with `data-id` on `.Item` / `.Panel` |
| Feedback | `Banner` (errors only — **not** for mock-data disclaimer), `Toast` optional |
| Avatar | `Avatar` in header optional |

### 2.4 Sana Style notes (`010-style-guide.mdc`)

- **Page canvas:** `SANA_PAGE_CANVAS`; **rails:** `SANA_TOP_NAV_BG`, `SANA_SECONDARY_NAV_BG`; **cards:** white on grey field, `SANA_CARD_RADIUS_LG`, thin `soap300` borders.  
- **Accent discipline:** match indicators use **semantic** colour; links use `SANA_LINK_ACCENT` where CK blueberry is heavy.  
- **No breadcrumbs** or chevron path strips anywhere in `design/*.tsx`.  
- **Modal:** white content, generous radius, neutral backdrop — **not** full blueberry headers.

### 2.5 Navigation completeness (315 requirement)

**WorkdayLeftTabBar** (illustrative): Recruiter Hub **Overview**, **Job requisitions**, **Candidates**, **Dashboard** — **all** show representative content **or** a single-line stub is **not** acceptable; use lightweight **Card** summaries on non-focus tabs if this screen focuses on **Job requisitions → [Req] → Candidates**. Prefer mounting a **req-detail** shell where **Candidates** is the active secondary tab and other tabs show minimal realistic **Table** or **BodyText** summaries per `320` rule.

---

## PASS 3: Peer review (critical)

### 3.1 Strategy validation

- **JTBD:** Clear link to worksheet outcomes (assess fit + move pipeline + source).  
- **Shell:** **D + C** justified — table scan then modal depth; aligns to recruiter-flow manifest.  
- **HiredScore alignment:** Match column + similar-candidate flow **echoes** Deployment Agent capabilities without inventing a parallel “black box” brand.

### 3.2 Layout quality

- **3-second test:** Table dominates; modal opens with **resume** visible immediately.  
- **Competition risk:** Mitigated — left column stays compact; avoid duplicate titles.  
- **Distinctive vs generic:** Split modal is **purpose-built** for GCC volume; not a generic profile clone.

### 3.3 Design system validation

- Components are **standard Canvas Kit** composables; **no fantasy controls**.  
- **Sana:** Neutral shell; modal white; pill search in top nav.

### 3.4 Navigation completeness

- Hub + req context explicitly required for **320** (all tabs represented).  
- **Modal default** avoids tabs — good; if “More” is added, keep **secondary**.

### 3.5 Experience principles (`docs/experience-principles.md`)

- **Empower:** Recruiter controls stage advance; AI is **assistive**, not autonomous.  
- **Trust:** Disclose AI-assisted search; show **why** similar candidates returned (stub “Based on skills and req …” for prototype — **319** refines).  
- **Grow:** Search supports iteration (chips, editable query, similar loop).

### 3.6 060 / 319 flags (legal-sensitive)

| Area | Risk / requirement | Owner |
|------|-------------------|--------|
| **AI-assisted matching & similar candidates** | EU **AI Act** high-risk context for employment; **transparency** and **human oversight** required | **060** review before **330** handoff; **319** on all AI strings |
| **Automated ranking / grades** | **GDPR Art. 22** — meaningful **human review**; no **solely** automated decisions that significantly affect candidates | **060**; UI must show **human action** before adverse step (prototype: stage change confirms) |
| **Global database search** | Purpose limitation / transparency in customer messaging | **319** + PM; privacy notice surfacing **out of scope** for this prototype unless PRD adds |

**Prototype copy placeholders (for 319):**

- Near AI toggle: plain-language **disclosure** that suggestions are **assistive** and require recruiter judgement.  
- On “Similar candidates”: **short** explanation of **matching factors** (skills, experience, req text).  
- Avoid implying auto-reject or auto-hire.

---

## PASS 4: Final improvements (applied once)

1. **Explicitly dual entry** (req grid + Find Candidates) documented so **320** does not over-fit to one route.  
2. **Modal tab avoidance** clarified — **Tabs** only for **secondary** detail to kill v44 tab sprawl in the **default** path.  
3. **CommunicationDock** default **omitted** unless PRD expands scope — keeps focus on **assessment + search**.  
4. **Legal flags** table added for **060/319** handoff.

---

## Final Discovery & Design Brief (single-page handoff)

**Problem (v44):** Recruiters lose time switching **tabs** for education vs CV; boolean search feels **weak** for complex combinations; large databases need **semantic / similar** discovery — with **enterprise compliance** for AI-assisted hiring.

**Solution:** **Pattern D** workspace (filters + sortable **Table**) plus **Pattern C** **unified review Modal** with **left key facts + match** and **right resume**, **prev/next** queue controls, and a **search strip** supporting **boolean**, optional **semantic/AI** mode (with disclosure), and **similar candidates** results — all requiring **explicit recruiter action** for decisions.

**Placement:** **Job requisition → Candidates** (primary); **Find Candidates / Global Talent Search** (secondary).

**Shell:** `WorkdayTopNav` + `WorkdayLeftTabBar` + **Sana** tokens from `sanaShellTheme.ts`.

**Build notes for 320:** Call **`get-canvas-kit-tokens`** at build; no **Breadcrumbs**; no warning **`Banner`** for mock data; prototype **every** left-bar tab with representative content.

**Handoff line for orchestrator**

> Discovery & Design complete for **Candidate Grid, Search, and AI Matching (GCC v44 #4)**.  
> **Final Verdict: APPROVED.**  
> Discovery Brief: `design/gcc-candidate-grid-v44-discovery-brief.md`  
> **320:** Build Canvas Kit prototype from this brief; pair with PRD when available (`docs/prds/…`).

---

## Final Verdict: APPROVED

**Rationale:** JTBD, shell patterns, recruiter-flow references, Canvas Kit mapping, Sana compliance, experience principles, and **060/319** AI/GDPR flags are documented. Layout hierarchy is strong and buildable. **320** may proceed.

---

**Return summary**

- **Discovery Brief path:** `design/gcc-candidate-grid-v44-discovery-brief.md`  
- **Final Verdict status:** **APPROVED**
