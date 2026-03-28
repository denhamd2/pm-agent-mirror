# Discovery & Design Brief: GCC Candidate Review Experience (v54)

**PRD:** `docs/prds/gcc-candidate-review-experience-v54-prd.md` (post–Red Team revision)  
**Pipeline:** GCC-E2E-014 — Step 8c (**315** PASS 3–4 complete; **319** copy incorporated)  
**Research:** `research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v54.md` — HITL recommendation **#3**  
**CI:** `research/competitive/gcc/e2e-ci-brief-candidate-review-2026-03-22-GCC-E2E-014.md`; `research/competitive/matrices/gcc-competitive-matrix.md`  
**Created:** 22 March 2026  
**Last updated:** 22 March 2026 (PASS 3–4, Final Verdict)  
**Agent:** 315 — Prototype Discovery & Design

---

## Status and checkpoint

**PASS 1–4 complete.** **319** has reviewed and approved the strings in §2.6 (Editorial Guidelines, British English per `010-style-guide.mdc`). **Final Verdict: APPROVED** — ready for **320** implementation.

**Legal:** Starred (\*) strings in §2.6 were treated as legal-sensitive in the **319** pass (AI transparency, cross-border/assessment context, document access, human-in-the-loop). **Formal 060 sign-off is still required before GA** or customer-facing release; wording below is validated for clarity and consistency in the 319 pass, not a substitute for Legal.

---

## PASS 1: Layout strategy (design thinking + grounding)

### 1.1 Deployment Agent grounding (mandatory)

**Source:** Workday Deployment Agent (`ask_deployment_agent`), thread **`9c0d7686-b087-4c9b-8166-9c9261631199`**, 22 March 2026 (continued for v54).

**Candidate review surfaces (requisition Candidates grid)**

• **Full profile:** opened via **candidate name** link — multi-tab profile; **no** native sequential next/previous between candidates (return to grid to pick another row).  
• **Row preview:** opened via **View (eye) icon** — pop-up modal with **up/down (or equivalent) controls** for **next/previous** candidate **without** returning to the grid.

**Find Candidates**

• **Find Candidates** is a **standard Workday report** — not embedded in Recruiter Hub by default; access via **search**, shortcuts, or navigation patterns the tenant uses. **Candidates** on the Hub links to **Candidate Job Applications** (different intent than global talent search).  
• **Native:** keyword search with **Boolean** (AND, OR, NOT) and quoted exact phrases.  
• **Licensed / add-on:** **semantic** / **AI-style** match is **not** core-native — requires **HiredScore** and/or **Enterprise Search Innovation Service** where activated.

**Document viewing and security (unified review implications)**

• Attachments (resume, cover letter, etc.) fall under **Candidate Data: Attachments** (security domain).  
• Permissions are **contextual**: a user may see a candidate for **this** requisition but be **blocked** from documents tied to **other** applications unless broader (including unconstrained) access applies.  
• **UX implication:** unified surfaces must support **per-document** permission states (show, mask, or blocked) without implying cross-application visibility.

### 1.2 Functional knowledge

**Workspace state:** `functional-knowledge/` in this repo holds verification metadata; authoritative PDFs may be off-disk. For **security/permissions**, align narrative with **Admin-Guide-Authentication-and-Security.pdf** themes (RBAC, constrained groups, domain policies) and PRD §**Regulatory** / §**Resources**. **420/430** should attach concrete PDF section pointers before GA copy references retention or audit.

### 1.3 JTBD (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

**Verbatim worksheet anchors**

• *Manage candidates throughout the recruiting process* — determine if candidate meets job requirements; progress candidates **efficiently** through stages.  
• *Maintain high standards of efficiency and effectiveness* — identify ways HR systems better meet **high-volume** workflow needs.  
• *Worker (candidate)* — find a relevant job; **apply**; track application (mobile context per PRD Pillar C).

**Synthesised JTBD (recruiter — Pillar A + B)**

• *When I am shortlisting a large applicant pool on a requisition, I want **one dense review surface** and **honest** paths for sequential review, so I can complete fair reviews with fewer context switches.*  
• *When I am searching the talent database, I want **clear boolean search** and **transparent** paths to **licensed** semantic match, so I can find best-fit profiles without tool confusion or over-claiming.*

**Synthesised JTBD (candidate — Pillar C)**

• *When I apply on a **phone**, I want **reliable** steps for assessments and uploads, so I can finish the application without dead ends.*

**Prototype implications**

• **Pillar A:** Req **Candidates** grid + **unified high-density review** (modal or equivalent) with prev/next in **filtered grid order**; explicit copy distinguishing **row preview** vs **full profile** capabilities.  
• **Pillar B:** **Find Candidates**-style workspace with filter stack, results, and **in-product** education on boolean vs licensed semantic/AI match (**060** on AI strings).  
• **Pillar C:** Representative **mobile apply** slice showing assessment redirect and upload **fallback** messaging (problem + solution).  
• **Trust:** No breadcrumb path strips; no mock-data **warning** `Banner` — use neutral `BodyText` for illustrative data if needed (`010` / `320`).

### 1.4 Reference layouts (`design/references/recruiter-flow/`)

| Reference file | Shell pattern | Use for v54 |
|----------------|---------------|-------------|
| `Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png` | **D** | Req list / hub entry density |
| `Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` | **D** | **Candidates** table, filters, actions |
| `Creat_Job_Application_-_Recruiter-eb5ce0ed-99c8-4152-bc9e-ec008568c778.png` | **C** | Large **modal** over dimmed workspace |
| `Find_Candidates_-_Recruiter-fa9cffaf-588b-418c-a1e7-a3c183802f8e.png` | **A+** | **Find Candidates** — filters + results |
| `Recruiter_Hub_-_Overview_for_a_Recruiter-8fd60518-d750-4f1f-bf9a-ba06cc21aa3a.png` | **A+** | Hub **Overview** tab content density |

**Sana shell:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`, `Sana_Style_UI-candidate-profile-whatsapp-panel.png` — neutral rails, white cards, pill search (via `WorkdayTopNav`).

### 1.5 Shell pattern selection

**Composite (matches PRD three-pillar story)**

• **A+:** `WorkdayTopNav` + `WorkdayLeftTabBar` (Recruiter Hub).  
• **D:** Dense **Candidates** workspace on **Job requisition → Candidates**; separate **Find Candidates** view uses **A+** + left filter stack per reference.  
• **C:** **Unified review** and **row-preview** education as **Modal** (primary Pillar A deliverable for **320**).  
• **Mobile (Pillar C):** Narrow viewport **Card** stack (single column) — not the full shell; embedded as a **demo region** or **route** so PM can screenshot apply friction states.

### 1.6 Layout regions

• **Top:** `WorkdayTopNav` — pill search, utilities, avatar; **Sana** greys (`sanaShellTheme.ts`).  
• **Left:** `WorkdayLeftTabBar` — primary rail + secondary tabs (**Overview**, **Job requisitions**, **Candidates**, **Dashboard**) with **representative** content on **every** tab.  
• **Centre:**  
  - **Mode: Requisition candidates** — title block (req metadata as `Heading` + `BodyText`, **no** breadcrumb), filter row, `Table`, mass-action affordances.  
  - **Mode: Find Candidates** — filter column + results list/table + search query field with boolean help.  
  - **Mode: Mobile apply (slice)** — compact step list + primary apply CTA + error/fallback panels.  
• **Right (optional desktop):** Collapsible **filters** / saved lists on Find Candidates; omit **CommunicationDock** unless scope expands.

### 1.7 Hierarchy

• **Primary:** Unified review **Modal** when open (summary + CV + notes + key activity).  
• **Secondary:** **Candidates** grid queue **or** **Find Candidates** results, depending on mode.  
• **Supporting:** Hub tabs, search education, licensed-match entry (stub link or `Card`).

### 1.8 Interaction model

• **Grid → unified modal:** Row action **Review** or row open (pick one in **320**, stay consistent).  
• **Prev/Next:** `ToolbarIconButton` + keyboard arrows; **disabled** at ends; order matches **current filter/sort** (PRD: stage primary sort fixed — do not invent secondary sort in copy).  
• **Row preview:** Keep **View (eye)** affordance in grid; optional **inline hint** `Popup` or `BodyText` comparing **quick sequential** preview vs **deep** unified modal / full profile.  
• **Full profile:** **Tertiary** control **Open full profile** — opens deep context; **no** false promise of carousel there (per Deployment Agent).  
• **Find Candidates:** Submit query, refine filters, open result row into same unified modal pattern **or** profile (prototype may stub “Open” → modal for consistency).  
• **Documents:** If attachment blocked — inline error + **Request access** or **Open the job application for this job** (approved copy in §2.6).  
• **Pillar C:** External assessment **Return to Workday** copy; upload **Try again** / **Continue on desktop** branches.

### 1.9 Six Hats (optional trade-offs)

| Hat | Note |
|-----|------|
| **White** | Facts: preview has sequential nav; full profile does not; boolean native; semantic licensed. |
| **Red** | Recruiters feel tab fatigue; buyers compare to “one-pane” ATS narratives. |
| **Yellow** | Unified modal + honest GTM reduces demo risk and speeds triage. |
| **Black** | Permission variance across documents; large CVs; RTL/Arabic QA adjacent. |
| **Green** | Optional later: next/prev on full profile **or** stronger routing to preview-first high-volume playbooks. |
| **Blue** | Ship **unified modal + Find Candidates education + mobile failure clarity** in prototype; profile carousel remains **roadmap**, not mocked as shipped. |

### 1.10 Layout framework A–F

| ID | Topic | Decision |
|----|--------|----------|
| **A** | JTBD | High-volume review, honest search packaging, mobile apply reliability signals. |
| **B** | Shell | A+ hub + D req workspace + C modal + Find Candidates A+ variant + mobile slice. |
| **C** | Hierarchy | Modal dominates when open; grid/search results secondary; mobile slice clearly labelled. |
| **D** | Density | Scan-first tables; modal uses two-column split + collapsible timeline/notes. |
| **E** | Accessibility | Focus trap in modal; visible focus; `aria-label` on icon prev/next; WCAG AA text. |
| **F** | Canvas coverage | All hub tabs populated; grid + modal + Find Candidates + mobile states; loading/error/empty/permission-denied document. |

### 1.11 Experience principles (`docs/experience-principles.md`)

• **Empower:** Recruiter chooses preview vs unified modal vs full profile; clear affordances.  
• **Trust:** Transparent copy on what search and match can do **without** a licence; no black-box auto-reject.  
• **Grow:** Saved filters / grid configuration build on existing native patterns (PRD).

### 1.12 Performance skeleton (PRD alignment)

• **First interactive:** shell + modal chrome + summary column **≤** prototype budget agreed with eng (PRD: **<500ms p95** applies to **existing row preview** first paint; unified shell may use **separate** milestone).  
• **Lazy:** CV/document panel, heavy timeline, secondary **Tabs** panels load on expand or after idle **unless** user navigates prev/next (show skeleton).  
• **320** implements skeleton → panel sequence explicitly in code comments or stub states.

---

## PASS 2: UI composition (Canvas Kit + Sana)

### 2.1 Canvas Kit MCP

**Called:** `get-canvas-kit-tokens` (user-canvas-kit-mcp) — use **v14** packages per `design/package.json`; consult MCP resources **`docs://tokens/color-roles`**, **`docs://tokens/color-contrast`** for semantic/status colours (match hints, errors, focus).

### 2.2 Component mapping

| UI need | Canvas Kit / shared repo |
|--------|---------------------------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar` |
| Layout | `Box`, `Flex` |
| Surfaces | `Card` |
| Data | `Table` (compound `.Head`, `.Body`, `.Row`, `.Header`, `.Cell`) |
| Filters | `FormSelect`, `FormTextInput`, `FormDateInput` from `SharedFormControls.tsx`; `InputGroup` for search |
| Overlay | `Modal` |
| Actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` |
| Text | `Heading`, `BodyText`, `Text` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |
| Navigation | `Tabs` (`data-id` on `.Item` / `.Panel`) for modal sub-areas **if** scroll-only is insufficient |
| Feedback | `Banner` **error/success/info** for **in-flow** states only — not for mock data |
| Disclosure | `Popup` for boolean help; `Toast` optional for stage change confirmation |

### 2.3 Sana Style (`010-style-guide.mdc`)

• **Page canvas:** `SANA_PAGE_CANVAS`; rails/tabs from `sanaShellTheme.ts`.  
• **No breadcrumbs** or chevron path strips.  
• **Modal:** white body, neutral overlay; no large blueberry chrome blocks.

### 2.4 Navigation completeness (320 must implement)

**WorkdayLeftTabBar secondary tabs (example set — adjust labels to tenant copy if needed)**

• **Overview** — tasks/cards stub aligned with hub reference.  
• **Job requisitions** — table or list slice.  
• **Candidates** — link or embed **Candidate Job Applications** style list (lightweight but real controls).  
• **Dashboard** — KPI cards stub.

**Job requisition → horizontal tabs (if used)**

• **Overview**, **Candidates** (active for demo), **Interviews**, **Details** — each with representative content.

**Modes in centre (prototype routing or state)**

1. **Requisition Candidates** — grid + **View** icon column + **Review** action.  
2. **Find Candidates** — query + filters + results.  
3. **Mobile apply** — narrow column demo.

**Modal states**

• Default content; loading skeleton; CV load failure; candidate not found; **attachment forbidden**; optional **anonymised** variant (`BodyText` / `Banner` info); optional **HiredScore** / match stub with **human-in-the-loop** disclaimer (**060**).

### 2.5 Telemetry / analytics (copy only if shown)

If prototype shows a **privacy** or **analytics** note for instrumented review sessions, mark **legal-sensitive** and route through **319** → **060**. Default: **omit** unless PM requests.

---

### 2.6 Copy inventory (**319 approved** — 22 March 2026)

**Source:** **319-doc-writer** pass on this brief (Editorial Guidelines, `010-style-guide.mdc` British English). Implement **exactly** these strings in **320** unless eng constraints force a follow-up with **319**.

**Legal validation note:** Items marked **\*** are **legal-sensitive** (AI disclosure, assessment hand-off, document permissions, human oversight). They were **wordsmith-validated in the 319 pass** for transparency, accuracy, and plain language. **060 formal sign-off remains pending** before GA; do not treat this subsection as Legal approval.

#### Buttons and CTAs

• Review  
• View *(eye — aria-label: View candidate preview)*  
• Previous candidate *(aria-label)*  
• Next candidate *(aria-label)*  
• Move to screen *(stage label — align with tenant configuration if different)*  
• Reject  
• Close  
• Open CV  
• Open full profile  
• Open in new tab  
• Clear filters  
• Save filter  
• Apply filters  
• Submit search  
• Clear search  
• Try again  
• Continue on desktop  
• Return to application  
• Request access *(blocked document; exact behaviour tenant-dependent)*  

#### Form labels and help text

• Search candidates — help: **Use AND, OR and NOT between terms. Use quotation marks for an exact phrase.**  
• Find candidates — help: **Search supports keywords and Boolean operators. Semantic or AI-assisted matching is available only when your organisation activates the licensed product.**\*  
• Stage  
• Applied date  
• Source  
• Location  
• Name  
• Saved filters  
• Job applied for *(Find Candidates result meta)*  

#### Row preview vs full profile (trust copy)

• **Preview:** **Use Previous and Next to move between candidates without returning to the list.**  
• **Full profile:** **Opens the full candidate record. Return to the list to choose another candidate.**  

#### Errors (problem + solution)

• Unable to load this CV. Open it in a new tab or try again.  
• Unable to find this candidate. Return to the list or refresh the page.  
• Unable to load candidates. Check your connection and try again.  
• You don’t have access to this document for this candidate. Open the job application for this job or contact your administrator.*  
• Unable to open the assessment. Close the other tab and try again, or continue on a desktop browser.*  
• Unable to upload this file from your phone. Try again or continue on a desktop browser.*  

#### Success / confirmation

• Candidate moved to screen  
• Filters applied  

#### Empty states

• No candidates match your filters. Adjust filters or clear them to see more results.  
• No candidates match your search. Try different keywords or filters.  

#### Loading states

• Loading candidates…  
• Loading candidate…  
• Loading CV…  
• Loading search results…  
• Submitting application…  

#### Licensed / AI / match

• **Semantic and AI-assisted matching is available when your organisation activates it. A person still makes hiring decisions.**\*  
• **Match insights are suggestions only. They don’t replace your judgement.**\* *(if match stub shown)*  

#### Anonymised / screening

• Some candidate details are hidden based on your organisation’s screening rules.  

#### Mobile apply / assessment

• **You’re leaving Workday to complete an assessment. When you’re done, return here to finish your application.**\*  

#### Table / chrome

• Candidates  
• Candidate  
• CV  
• Search results  

---

## PASS 3: Peer review findings (internal checklist)

| Check | Result | Notes |
|-------|--------|--------|
| **JTBD** vs `docs/jtbd-recruiting-hr-professional-and-manager.md` | **Pass** | Synthesised lines in §1.3 map to worksheet anchors (efficient progression, high-volume systems, candidate apply/track). Pillars A–C trace to layout and modes. |
| **Shell pattern** (Sana) | **Pass** | Composite A+ / D / C / mobile slice matches references in §1.4–1.5; `SANA_*` tokens and no heavy blueberry chrome called out in §2.3. |
| **Canvas Kit mapping** | **Pass** | §2.2 uses documented CK compounds + shared `FormSelect` / `FormTextInput` / `FormDateInput`; `Banner` scoped to in-flow only per §2.2 and PRD alignment. |
| **Copy quality** (319) | **Pass** | §2.6 approved: sentence case, verb-led actions, problem + solution errors, British English (organisation, judgement), Boolean help explicit. |
| **Experience principles** (`docs/experience-principles.md`) | **Pass** | **Empower:** preview vs modal vs full profile choice and honest sequential behaviour. **Trust:** boolean vs licensed semantic/AI copy, document permission messaging, no false carousel on full profile. **Grow:** filters, saved filters, grid configuration tied to native patterns. |
| **No-breadcrumb rule** | **Pass** | §1.6, §1.3, §2.3 explicitly forbid breadcrumbs and chevron path strips; context via `Heading`, tabs, metadata. |

**Layout / strategy (315 harsh pass):** Primary focus when the unified review modal is open is clear (modal dominates; grid secondary). No generic “template” layout: anchored to named recruiter-flow references. Navigation completeness for hub and req tabs is specified in §2.4.

---

## PASS 4: Final improvements

**None required.** Draft strategy and composition stood up to peer review once **319** copy was merged. No second design iteration needed.

---

## Final Verdict: **APPROVED**

**Rationale:** JTBD, shell, hierarchy, and Canvas Kit mapping are coherent and buildable; Sana and no-breadcrumb rules are explicit; copy is **319-approved** with legal-sensitive strings flagged for **060** before GA. **320** may proceed.

---

## Handoff to **320**

Discovery and design complete for **GCC Candidate Review Experience (v54)**. **Final Verdict: APPROVED.**

• **Discovery Brief:** `design/gcc-candidate-review-experience-v54-discovery-brief.md`  
• **PRD:** `docs/prds/gcc-candidate-review-experience-v54-prd.md`

**320:** Build the Canvas Kit prototype from this brief and the PRD. Use **§2.6 strings verbatim**. Call `get-canvas-kit-tokens` at implementation. No breadcrumbs; full tab coverage per §2.4. Reserve **060** review on prototype for consent/AI/document flows before **330**.

---

**Output path:** `design/gcc-candidate-review-experience-v54-discovery-brief.md`
