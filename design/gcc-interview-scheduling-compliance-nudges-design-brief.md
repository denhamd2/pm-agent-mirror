# Design Brief: GCC Interview Scheduling and Compliance Nudges

**PRD:** `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`  
**Mission:** GCC-E2E-034 (Regional E2E Step 19 – Design peer review complete)  
**Created:** 5 April 2026  
**Status:** Peer reviewed **5 April 2026** – **Final Verdict: APPROVED** (PASS 3–4 and Final Verdict below). **320** may proceed; **319** / **060** still required for legal-sensitive strings before GA copy freeze.

---

## PASS 1: Layout Strategy

### 1.1 JTBD (mandatory)

**Worksheet alignment (recruiter):**  
Primary jobs from `docs/jtbd-recruiting-hr-professional-and-manager.md`:

- **Manage candidates throughout the recruiting process** → *Progress candidates through the stages of the pipeline as efficiently as possible*  
- **Maintain high standards of efficiency and effectiveness** → *Identify ways that my HR systems can better meet my workflow*  
- **Be an effective partner to hiring teams** → *Collaborate with hiring teams to hire the right candidate quickly*

**Secondary (hiring manager):** *Track the progress of candidates through the hiring process* (minimal exposure to rule engines; availability and confirmations only where configured).

**Tertiary (candidate):** Worker cluster *Choose the right job for me* → *Engage with hiring organisation* when self-scheduling from predefined slots (no claim of live calendar read in v1).

**Synthesised job statement:**  
When I am scheduling or confirming interviews for GCC requisitions (especially KSA-scoped roles), I want **in-product nudges and clear override consent** when local policy thresholds apply, so I can **move candidates quickly without losing auditability or breaking regional expectations**.

**Prototype implications:**  
• Surfaces must show **which rule fired**, **severity** (information vs warning), and **next actions** without hard-blocking panel mix.  
• **Exception paths** require explicit capture (who, when, reason) before confirm.  
• **Admin** and **audit** experiences must be discoverable for COE and Legal, not buried in dev-only config.

### 1.2 Shell pattern selection

| Primary | **A+** | Recruiter Hub chrome: global top nav (pill search), primary left rail (Overview / Job Requisitions / Candidates / Dashboard), **light grey page canvas**, white task cards. Scheduling and admin tasks render in the **centre workspace** while hub orientation stays consistent. |
| Secondary | **D** | Entry from **Job Requisition → Candidates** (dense table, filters, tabs, bulk actions). Align with `design/references/recruiter-flow/README.md` row *Job Requisitions* and `design/references/pattern-hired-score-grid.md` when HiredScore is present on the grid. |
| Modal overlay | **C** | **Exception consent**, **customer attestation** for sensitive rules, and **policy preview** use modal (or side panel) over dimmed backdrop; top nav remains visible per pattern C guidance. |

**Justification:** Interview work is **task-driven** (Schedule Interview from inbox or req) but recruiters expect **Recruiting Hub** continuity. Nudges belong **inline** in the scheduling steps; **consent** is a **focused interruption** (C), not a new shell.

### 1.3 Reference layouts (real Workday patterns)

1. **`Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png`** (Pattern **D**) – launch scheduling from req context, candidate list density.  
2. **`Creat_Job_Application_-_Recruiter-eb5ce0ed-99c8-4152-bc9e-ec008568c778.png`** (Pattern **C**) – stepped task in modal; analogue for **consent / attestation** modals (scheduling body may be full-page A+; modals match this chrome).  
3. **`My_Candidates_-_Recruiter-91261671-82cc-4369-8d5a-7429a8b3389d.png`** (Pattern **A+**) – alternate entry from candidate lists.

**HiredScore:** If the user opens scheduling from a grid that shows grades, specify **`HiredScoreGrading`** per `design/references/pattern-hired-score-grid.md` (`variant="full"` on grid rows). This feature does not replace that pattern where both apply.

**Candidate profile:** Post-schedule, interview artefacts appear on profile; deep profile layout follows `design/references/pattern-candidate-smart-view.md` only if the prototype includes profile review (optional for v1 brief; scheduling is in scope).

### 1.4 Grounding: Deployment Agent (placement)

**Query (summary):** Interview scheduling is initiated from the **Job Requisition**, driven by the **Interview** business process; **Schedule Interview** task (often from **My Tasks**) is where scheduling occurs; details surface on **Candidate Profile** after completion.

**Navigation path (recruiter):** Req → Candidates → advance to Interview → **Schedule Interview** task → standard or **Recommended Interview Scheduling** (when entitled) → confirm.

**UX placement for compliance:** Deployment Agent recommends **final send/publish** as the strongest checkpoint for consent. **PRD** also requires nudges at **slot selection** and **panel confirmation**. **Design resolution:** use **inline banners** (early steps) for visibility + **mandatory consent modal** when proceeding past a **minimum notice** violation; **final step** repeats summary of open warnings and confirms audit logging. (See Six Hats below.)

### 1.5 Functional knowledge note

`functional-knowledge` PDFs in repo focus on purge, duplicate management, offers, security; **no cited excerpt** for Interview BP in this pass. Placement rests on **PRD**, **Deployment Agent**, and standard Recruiting task patterns. PS validation remains required per PRD parity table.

### 1.6 Six Hats (Black Hat) – trade-off check

**Topic:** Warnings at slot, panel, and final steps vs only at final confirmation.

**Risks:** Alert fatigue; ignored repeated warnings; consent missed if only final step; Paradox path may not mirror Workday steps one-to-one.

**Mitigations in layout:**  
• Use **information** severity (subtle `Banner`) where possible; reserve **high-emphasis warning** for threshold breach or missing data.  
• **Dismiss** with **logged acknowledgement** for non-blocking panel warnings (still auditable).  
• **Consent modal** only when **exception** path (below minimum notice) per PRD.  
• **Paradox:** surface equivalent **short disclosure + link to policy** in conversational turns; **Workday remains SoR** for audit events (PRD architecture).

### 1.7 Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav` – W logo, pill search, notifications, inbox, avatar |
| **Left** | `WorkdayLeftTabBar` – Recruiting Hub rail + secondary hub links |
| **Centre** | Primary scheduling wizard, admin rule packs, or audit table (white **Card** on `SANA_PAGE_CANVAS`) |
| **Right** | Optional `CommunicationDock` or messaging preview **only** if prototype demonstrates recruiter-candidate comms in same session; otherwise omit to reduce noise |

### 1.8 Hierarchy

1. **Dominant:** Step title + primary action (e.g. **Review and send interview invitation**)  
2. **Secondary:** Selected slot, panel list, calendar summary  
3. **Supporting:** Compliance **Banners** (stacked below step title, above main form), **Help** links to customer policy text

### 1.9 Interaction model

- **Recruiter scheduling:** Multi-step **vertical flow** (time → panel → review) with **Next** / **Back**; **SecondaryButton** + **PrimaryButton** pairing.  
- **Consent:** **Modal** blocks progression until **Record exception** or **Choose a different time**.  
- **Admin:** **Tabs** – e.g. **Rule packs**, **Scope mapping**, **Policy text**, **Sensitive rules** (gated).  
- **Audit:** **Table** + filters (`FormSelect` / `TextInput` date range) + row drill to interview.

### 1.10 Layout Framework A–F

| Letter | Application |
|--------|-------------|
| **A – JTBD** | Book compliant interviews fast with audit trail; partner with hiring team on panel and time. |
| **B – Shell** | A+ centre task + D entry + C for modals. |
| **C – Hierarchy** | Step title → compliance banners → form → sticky footer actions. |
| **D – Density** | Admin and audit dense; scheduling steps stay moderate (avoid >7 lines per viewport band). |
| **E – Accessibility** | Banners associated with fields via `aria-describedby`; modal focus trap; colour not sole severity cue (icon + text). |
| **F – Canvas coverage** | TopNav, LeftTabBar, Card, FormField, Banner, Modal, Table, Buttons, StatusIndicator, TextInput, TextArea, Select, Tabs, SystemIcon, Avatar. |

### 1.11 Wireframe descriptions (key screens)

**WF1 – Entry: Job requisition candidates (Pattern D)**  
Top nav + hub rail; main area = req header (title, metadata **BodyText small**), **Tabs** (e.g. Candidates, Details), filter row, **Table** of candidates. Row action **Schedule interview** opens scheduling flow (or deep-links to task). If HiredScore visible, **HiredScoreGrading** in row.

**WF2 – Schedule interview: Select time / slots**  
A+ shell; **Heading large** = step name. Below, **Banner** (information or warning) if notice rule evaluated: copy states rule name, required notice, selected start time. **Body** = slot picker (Recommended Interview Scheduling suggestions as **Card** list or calendar **placeholder** per product implementation). **PrimaryButton** = Continue.

**WF3 – Schedule interview: Panel**  
Same shell. **Banner** when panel composition rule fires (sensitive rules off by default): lists **threshold**, **current mix**, **View policy** link. **Avatar** + **BodyText** list of interviewers; **StatusIndicator** Gray/Low for role tags (e.g. Hiring manager). Checkbox **I understand and want to continue** if admin requires acknowledgement. **PrimaryButton** = Continue.

**WF4 – Review and send**  
Summary **Card**: date/time, location/video, panel list. **Stacked Banners** for any unresolved warning. **PrimaryButton** = Send invitation; **SecondaryButton** = Back. On submit, if notice violation, open **WF5** instead of completing.

**WF5 – Exception consent modal (Pattern C)**  
**Modal** with **Heading**; short explanation of violation; **FormField** + **TextArea** (reason, required/optional per config); checkbox(es) for attestation; **PrimaryButton** = Record consent and continue; **SecondaryButton** = Cancel (returns to review).

**WF6 – Admin: GCC interview compliance**  
A+ shell; **Tabs**. **Rule packs** tab: **Table** of packs (KSA template, future GCC), toggles **Active** (admin-only), **Edit thresholds**. **Sensitive panel rules** section: toggle **Off** by default; enabling opens **WF7**.

**WF7 – Customer attestation modal**  
Legal-gated copy; checkbox + **BodyText** recording that customer Legal approved policy and data categories; **PrimaryButton** = Confirm and enable; **SecondaryButton** = Cancel.

**WF8 – Audit: Overrides and consents**  
Dense **Table**: date, actor, candidate, interview, rule, action (warning acknowledged / consent recorded), link **View details**. Filters for org, date, rule pack. Empty state when no rows.

**WF9 – Candidate Career Site Home (Paradox-style)**
External career site header (brand logo + "Candidate Home"). Hero section with conversational prompt ("Hi Layla, what kind of role are you looking for today?"). Below, "To-Do" section featuring a lifted Card with the Assistant's Avatar, prompting the user to "Schedule your interview" or "Chat to apply". "Your Applications" list showing status of past roles.

**WF10 – Job Details & Conversational Apply**
Job description view with a sticky "Apply with Assistant" CTA. Clicking it opens the full-page conversational apply chat.

**WF11 – Conversational Apply Chat**
Full-page chat interface using `SanaCommMessageBubble`, `SanaCommComposer`, and `Avatar` (docked to bottom via fixed-height container). The AI assistant collects information chat-by-chat, asks screening questions inline, and confirms the application.

**WF12 – Paradox touchpoint (conceptual)**  
Conversational UI is Paradox-owned; Workday supplies **consistent rule outcomes** to display or speak. Design spec: **one compliance summary object** (warnings + consent required flag) so messaging stays aligned with WF2–WF5.

---

## PASS 2: UI Composition (Canvas Kit)

### 2.0 Canvas Kit discovery note

**MCP:** `user-canvas-kit-mcp` reported a server error (`STATUS.md`). Component mapping below uses **existing repo prototypes** (`design/gcc-candidate-grid-search.tsx`, `design/components/DocumentReviewTask.tsx`, `design/components/WorkdayLeftTabBar.tsx`, `design/references/pattern-hired-score-grid.md`) and standard **`@workday/canvas-kit-react`** imports. **320** should verify names against live Canvas Kit v14 docs or MCP when available.

### 2.1 Layout → components

| UI element | Canvas Kit / shared component |
|------------|-------------------------------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar`, `sanaShellTheme` (grey canvas ~#F3F5F7) |
| Page structure | `Flex`, `Box`, `Card` |
| Titles / copy | `Heading` (large page title), `BodyText` (small for metadata **colors.blackPepper600**) |
| Compliance messages | `Banner` with `Banner.Icon`, `Banner.Label` (use `hasError` only for true errors; **warnings** use non-error emphasis per kit guidance when implementing) |
| Rule / stage chips | `StatusIndicator` type Gray, emphasis Low |
| Severity / compliance state | `StatusIndicator` type Orange or Red, emphasis High for prominent warning labels (not custom Box pills) |
| Primary actions | `PrimaryButton`, `SecondaryButton` (no `TertiaryButton` for destructive or high-stakes negative actions) |
| Consent / attestation | `Modal`, `useModalModel`, `FormField`, `TextArea`, `Checkbox` |
| Admin tables / audit | `Table` |
| Filters | `FormSelect` / shared `FormSelect` from `design/components/SharedFormControls.tsx` where applicable; `TextInput` for search |
| Slot list | `Card` or `SecondaryButton` list items for selectable slots |
| Icons | `SystemIcon` from `@workday/canvas-system-icons-web` (e.g. `exclamationCircleIcon`, `checkIcon`) sizes 16–24 |
| People | `Avatar` size `s` in lists, `m` in panel summary |
| Navigation in admin | `Tabs` |

### 2.2 Sana Style (mandatory checks)

Per `010-style-guide.mdc` and references **`design/references/sana/`** (e.g. full shell + candidate comm PNGs):

- Page canvas **light grey**; cards **white** with thin **soap300** borders; radii **~16–20px** on cards.  
- **Blue** sparingly: primary buttons, links, focus.  
- No breadcrumbs or chevron path strips in prototype routes.

### 2.3 Navigation completeness

**Recruiter:** Hub → Req → Candidates → Schedule interview task → Steps (Time → Panel → Review) → [Modal consent] → Complete.  
**Admin:** Hub → **Recruiting** configuration area (exact menu TBD by product) → **GCC interview compliance** → Tabs as in WF6.  
**Audit:** Report or task under compliance / recruiting analytics (TBD) → WF8.  
**Candidate:** External link → Self-schedule → slot selection → confirm (disclosures visible).

### 2.4 Experience principles (`docs/experience-principles.md`)

| Principle | How this design upholds it |
|-----------|----------------------------|
| **Empower** | Recruiter **chooses** to proceed after warnings; exception flow requires **explicit** consent; outcome-oriented copy (**book interviews**) not rule-engine jargon in primary headings. |
| **Trust** | Each nudge names **rule**, **impact**, and **remedy**; data quality states when attributes missing; no silent skip of evaluation. |
| **Grow** | Admin can tune thresholds and policy text (within security); audit lists **history** of overrides and consents; version effective dates per PRD direction. |

**Marketing constraint:** Candidate and enablement copy must **not** imply live calendar read for self-scheduling (Trust over oversell).

### 2.5 Copy Inventory (for 319 review)

Strings below are **draft**; **Legal-sensitive** items marked **[Legal TBD]** per PRD (060 before GA).

#### Buttons and CTAs

- Continue  
- Back  
- Send interview invitation  
- Cancel  
- Save  
- Save and activate pack  
- Record consent and continue  
- Choose a different time  
- View policy  
- View details  
- Enable sensitive panel rules  
- Confirm and enable  
- Filter  
- Export (audit)  
- Book this time (candidate)  
- Confirm booking (candidate)

#### Form labels and help

- Reason for exception **[Legal TBD – label and help]**  
- Help: Explain why minimum notice cannot be met (example placeholder)  
- I confirm that my organisation’s Legal team has approved the policy, data categories, and disclosures for this jurisdiction **[Legal TBD]**  
- Acknowledge panel composition warning (checkbox label)  
- Minimum notice (hours/days) (admin)  
- Calendar basis (admin – e.g. business days)  
- Threshold percentage / count (admin – panel rule)  
- Scope: organisation / requisition type / jurisdiction mapping (admin)  
- Policy summary (admin – rich text or text area)  
- Test mode: evaluate rules without sending (admin, optional)

#### Banners and inline messages

- This interview is scheduled with less than the minimum notice of [X]. You can choose a different time or record an exception. **[Legal TBD – final wording]**  
- Panel composition does not meet your organisation’s guideline: [short rule name]. You can still proceed; this will be logged.  
- Rule could not be evaluated: missing data for [interviewer attribute]. Update worker data or contact your administrator.  
- Recommended Interview Scheduling is not available. Use standard scheduling or contact your administrator. (entitlement)  
- Paradox conversational scheduling is turned off for this tenant. (if applicable)

#### Modal titles and body

- Record exception to minimum notice **[Legal TBD]**  
- Enable sensitive panel rules **[Legal TBD]**  
- Your organisation uses automated assistance for scheduling. **[Legal TBD – AI transparency]**  
- Scheduling decisions remain with your recruiter or hiring team. **[Legal TBD]**  
- We process scheduling times, panel attributes used for rules, and consent records as described in your organisation’s privacy notice. **[Legal TBD]**  
- Sensitive attributes may be used for warnings only; they do not automatically reject candidates. **[Legal TBD – if sensitive rules on]**  
- For privacy questions, contact: [customer placeholder] **[Legal TBD]**

#### Errors

- Unable to record consent. Try again or contact your administrator.  
- Unable to save rule pack. Check your permissions and try again.

#### Success

- Interview invitation sent.  
- Exception recorded.  
- Rule pack saved.  
- Sensitive rules enabled. Attestation recorded.

#### Empty states

- No audit events match your filters. Adjust filters or try a different date range.  
- No compliance rule packs configured. Add a pack to get started.

#### Loading

- Loading scheduling options…  
- Loading audit events…

#### Candidate-facing (placeholders)

- Hi Layla, what kind of role are you looking for today?
- Schedule your interview
- Chat to apply
- Apply with Assistant
- Great! Let's get started. Could you please upload your resume?
- Thanks! Based on your resume, I see you have 5 years of experience. Is that correct?
- Perfect. Your application for Senior Recruiter - Dubai has been submitted.
- **[Legal TBD]** Automation transparency (short paragraph)  
- **[Legal TBD]** Privacy notice link label, e.g. Privacy notice

### 2.6 Visual indicators specification (for 320)

- **Interview step** on review screen → `StatusIndicator` Type Blue, Emphasis Low, label e.g. **Scheduling**  
- **Warning active** → `StatusIndicator` Type Orange, Emphasis High + `SystemIcon` exclamation, adjacent to banner  
- **Consent recorded** on audit row → `StatusIndicator` Type Green, Emphasis Low **Consent recorded**  
- **Informational nudge** → `StatusIndicator` Type Gray, Emphasis Low for tag **Notice rule**  
- **Interviewer role** → `StatusIndicator` Gray/Low per interviewer  
- **Panel warning acknowledge** → paired **PrimaryButton** (Continue) + **SecondaryButton** (Back) on step; modal uses **PrimaryButton** (Record consent) + **SecondaryButton** (Cancel)  
- **Metadata line** → `BodyText` size small, middot separators: e.g. **14 May 2026 · 14:00–15:00 · Video**

---

## PASS 3: Peer Review Findings

**Reviewer:** 318-design-peer-reviewer  
**Date:** 5 April 2026  
**Inputs:** PRD `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`, JTBD `docs/jtbd-recruiting-hr-professional-and-manager.md`, Experience Principles `docs/experience-principles.md`, Sana Style `015-sana-style-ui.md`, rule `318-design-peer-reviewer.mdc`.

### Strategy and JTBD

- **Worksheet alignment:** Recruiter bullets are **verbatim** from the Talent Acquisition cluster (*Progress candidates…*, *Identify ways that my HR systems…*, *Collaborate with hiring teams…*). Hiring manager line matches **Track the progress of candidates through the hiring process**. Candidate tertiary maps correctly to **Choose the right job for me** / **Engage with hiring organisation**.
- **Synthesis:** The *When / I want / so I can* line is outcome-led (speed + auditability + regional expectations), not a feature dump. **Pass.**

### Shell pattern and Workday patterns

- **A+** (hub continuity) + **D** (req candidates entry) + **C** (consent / attestation modals) is **justified** for task-led scheduling with focused legal interrupts.
- **Deployment Agent** placement (Schedule Interview task, checkpoint at send/publish) matches PRD and is **resolved** in the brief with a sensible split: inline banners early, **mandatory** consent modal for minimum-notice exception, summary at final step.
- **HiredScore:** Canonical `HiredScoreGrading` + `variant="full"` on grid rows is called out where relevant. **Pass.**
- **No-breadcrumb rule:** Explicitly stated in PASS 2; hierarchy uses **Heading** + tabs + metadata. **Pass.**

### Layout quality and hierarchy

- **Primary focus within ~3 seconds:** Step title + primary action, with compliance banners **below** title and **above** form reads as a clear vertical scan order (PASS 1.8–1.9, WF2–WF4).
- **Regions** (top / left / centre / optional right comm) are **unambiguous**.
- **Risk (minor):** Stacking **Banner** plus adjacent **StatusIndicator** + icon for the same warning (see section 2.6) can **compete** visually; 320 should implement **one** dominant surface per severity (e.g. banner carries message, indicator only on summary row or audit table) unless user testing prefers both.

### Sana Style and Canvas Kit

- Grey canvas, white cards, `soap300`, radii **16–20px**, sparing blue: **consistent** with `015-sana-style-ui.md`.
- **Conversational Assistant:** The brief explicitly specifies `SanaCommMessageBubble`, `SanaCommComposer`, and `Avatar` for the agentic chat, docked to the bottom via a fixed-height container, adhering strictly to `015-sana-style-ui.md`. **Pass.**
- **Gap:** PASS 2 cites `design/references/sana/` generically; **320** should validate against at least **`Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`** and **`Sana_Style_UI-employee-profile-comm-dock.png`** (or equivalent listed in 015) when implementing shell chrome.

### Canvas Kit and shared components

- **StatusIndicator** for chips, severity, and stage labels (not custom Box pills): **aligned** with 318 v75 checklist.
- **Button hierarchy:** Primary + Secondary pairings for wizard and modals; no **TertiaryButton** for destructive or high-stakes negative paths: **Pass.**
- **Banner** composition (`Banner.Icon`, `Banner.Label`): **consistent** with existing repo prototypes.
- **Process gap (315 mandatory):** PASS 2 documents **Canvas Kit MCP** failure and defers verification to **320**. That is a **documented exception**; it does **not** invalidate layout strategy but **must** be closed in implementation (see PASS 4).
- **Shared form controls:** Audit filters map to `TextInput` / `FormSelect`; **`320-prototype-developer`** prefers **`FormTextInput`**, **`FormDateInput`**, and shared **`FormSelect`** from `design/components/SharedFormControls.tsx` for filter rows unless a control is absent there. **Call that out explicitly in prototype build.**

### Navigation completeness

- **Recruiter** path is end-to-end. **Admin** tab set (**Rule packs**, **Scope mapping**, **Policy text**, **Sensitive rules**) is **complete** for WF6; **entry menu labels** remain TBD (acceptable if called out in prototype notes).
- **Audit** WF8 is specified; entry **TBD** matches PRD-style discovery gap.
- **PRD slice not wireframed:** PRD **Report** / dashboard tiles for adoption and nudge activation are **out of scope** in WF1–WF10. **Not a blocker** for scheduling/admin/audit prototype if **320** scope is explicitly **scheduling + admin + audit list only**; add a **backlog** note for reporting tiles or a thin WF11 stub if the PM wants E2E parity with PRD §Critical User Journey.

### PRD alignment

- Slot / panel / send checkpoints; **no hard block** on panel mix; **sensitive rules default off** + attestation; **Paradox** as parallel surface with **Workday SoR** for audit; **no live calendar read** for candidate self-scheduling: **all reflected**.
- **Open PRD items** (missing interviewer attribute: block vs warn-only; EN/AR copy strategy): brief shows **eval failure** messaging; **Arabic** strings and RTL behaviour should flow through **319** + **060** and internal parity table, not invented here.

### Experience Principles (318 expanded check)

| Principle | Upholds | Concerns / improvements |
|-----------|---------|---------------------------|
| **Empower** | Explicit proceed vs change-time paths; exception consent before confirm; recruiter remains decision-maker for panel mix. | Ensure **dismiss with logged acknowledgement** (PASS 1.6) is **visibly** distinct from **silent** ignore in UI spec so analytics match user intent. |
| **Trust** | Rule name, impact, remedy in banners; missing-data message is actionable; marketing constraint on calendar read called out. | Candidate and Paradox **AI transparency** strings are **[Legal TBD]**; **060** before any customer-visible freeze. |
| **Grow** | Admin thresholds, policy text, audit history, versioned effective dates (PRD direction). | **Correction / append** model for consent records (PRD) is **not** detailed in wireframes; acceptable for v1 prototype if **320** uses audit row **View details** as placeholder for read-only history. |

### Copy Inventory (editorial spot check, not 319 substitute)

- **Strength:** Problem + solution pattern in errors; sentence case on most CTAs; consistent **requisition** / **candidate** / **interview** framing.
- **319 follow-ups:** Several **[Legal TBD]** items correctly flagged. Consider **Enable sensitive panel rules** vs product term **nationality-driven** or **sensitive-attribute** rules for **internal** admin clarity (customer-facing may stay legal-neutral). **Loading** strings: prefer **Loading scheduling options** (no ellipsis) or **Loading scheduling options…** consistently per Editorial Guidelines numerals/ellipsis policy in **319**.
- **Empty state** for audit is helpful; ensure **Export (audit)** behaviour is **permission-gated** in copy if not all roles see it.

### Critical issues summary

- **None** that warrant blocking **layout** or **shell** strategy.
- **Implementation must-haves:** Close MCP/token verification at **320** start; align filter inputs with **SharedFormControls**; avoid duplicate warning chrome (banner + badge) without intent.

---

## PASS 4: Final Improvements (instructions for 320 / 319; no PASS 1–2 rewrite required)

1. **320 – Pre-flight:** Call **`get-canvas-kit-tokens`** (Canvas Kit MCP) when the server is available; reconcile any renamed APIs against PASS 2 table before coding.
2. **320 – Filters:** Use **`FormTextInput`**, **`FormDateInput`**, shared **`FormSelect`** for audit (WF8) and admin filter rows unless missing from `SharedFormControls.tsx`.
3. **320 – Visual hierarchy:** Prefer **single** primary compliance treatment per step (banner **or** inline indicator, not redundant stacks) unless usability test dictates otherwise.
4. **320 – Scope note:** Omit **dashboard adoption tiles** unless PM extends brief; if extended, add a thin **reporting** view or link-out pattern.
5. **319 – Continue** full Copy Inventory pass + **060** on all **[Legal TBD]** and candidate-facing disclosure strings; add **EN/AR** placeholder rows when locale strategy is confirmed.

---

## Final Verdict

**Final Verdict: APPROVED**

**Rationale:** JTBD and shell patterns are **worksheet-grounded** and **distinctive** (not generic). Hierarchy, Sana constraints, **no breadcrumbs**, HiredScore grid rule, and PRD-critical behaviours (nudge points, consent, default-off sensitive rules, SoR / Paradox split) are **clear enough for 320**. Gaps are **procedural** (MCP verification deferred), **minor** (shared form control preference, optional reporting wireframe), or **owned by 319/060** (legal copy). **320** may implement from this brief plus PRD; address PASS 4 items in prototype notes or first commit.

---

**Output file path:** `design/gcc-interview-scheduling-compliance-nudges-design-brief.md`
