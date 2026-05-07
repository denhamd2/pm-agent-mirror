---
feature: Agentic Create Offer flow on the Self-Service Agent (SSA)
mode: standalone via @ux-designer (you-decide path)
authoritative_source: .cursor/rules/315-design-brief-creation.mdc
status: v0.2 — Ideas 1–4 addendum added; ready for 318 peer review → 319 copy review → 320 code update → 321 visual review
canvas_kit_mcp: UNAVAILABLE at draft time (MCP errored — STATUS.md). Component selection grounded in `design/components/index.ts` (workspace wrappers around Canvas Kit) and `010-style-guide.mdc` / `015-sana-style-ui.md`. 320 must re-call `get-canvas-kit-tokens` before implementing.
---

# Create Offer on the Self-Service Agent — Design Brief

## Context Inquiry Notes (you-decide mode)

Per the `@ux-designer` standalone "you decide" path: the PM delegated the four contextual-inquiry questions to the designer. Each inference below is an **assumption**, not a requirement, with a one-line source. Question areas where evidence is too thin are tagged `- [ ] needs PM confirmation` and should be resolved before 318 sign-off.

### 1. Primary user + context (assumption)
- **Primary**: **Recruiter** (HR Professional, Talent Acquisition cluster) finalising the offer for an internal-approved candidate.
- **Secondary**: **Hiring Manager** (HCM Manager, Grow-and-maintain-my-team cluster) — receives an SSA-driven approval ping; can approve in Slack/Teams via Workday Everywhere rather than inside SSA.
- **Tertiary**: **Compensation Partner** — appears only when total comp falls outside band or requires sign-off.
- **Source**: `docs/jtbd-recruiting-hr-professional-and-manager.md` → Recruiter "Make a successful offer to the chosen candidate" + Manager "Finalize candidate's offer". Surface assumption from `design/references/ai-experience-guidance.md` §7 surface matrix (HR Pro = Workday Web; HM = Everywhere).
- **Where the user is today**: Recruiter is on **Workday Web**, often inside the candidate profile or req detail at the moment of "let's offer Sarah" — so the SSA is invoked **in-context** (not as a cold start from the global pill). When invoked from candidate context, the agent should **prefill** candidate, req, and last-known offer parameters.
- `- [ ] needs PM confirmation`: which entry surface is in scope for this design? (a) global SSA only, (b) candidate-profile-deep-link to SSA, (c) both? Also confirm whether **Hiring Manager-as-primary** is in scope or strictly approver/observer.

### 2. Walk-me-through of the real workflow + break-points (assumption)
**Inferred end-to-end (today's pain, derived from Workday data + functional knowledge):**

1. Recruiter selects candidate → opens Create Offer task → fills out compensation, equity, start date, location, reporting line.
2. Pay-grade lookup, currency conversion, tenant-configured offer template selection.
3. Hiring Manager and Comp Partner approval routing (configurable, often 2–4 approvers).
4. Offer letter document generation → review → eSign → candidate response.
5. Country-specific overlays (Japan two-step, Germany works-council, India Aadhaar/Adobe Sign).

**The pain (evidence-based)**:
- **Document generation + review is the biggest time sink** — Pharos `dw.swh.bp_event_record_stats` queried 11 Apr 2026 shows ~2.5M monthly "Review Writer Generated Document" events (avg 7h, p90 17h) and ~1.7M monthly "Review Documents" events (**avg ~14–21h**, p90 35–46h). Source: `design/data-offer-steps.ts` (PROD, 2025-04 to 2026-03).
- Currency / pay-grade lookup and band validation are manual or buried in subprocesses.
- Country-specific complexity is recruiter-memorised, not system-prompted. Source: `.cursor/rules/050-functional-knowledge.mdc` § Two-Step Offer Flows (Japan & Germany).
- Approval status visibility is poor; recruiters chase via email/Slack outside Workday.
- `- [ ] needs PM confirmation`: which of these breakpoints is the design's primary target — (a) compress the document loop, (b) automate comp/band validation, (c) make approvals visible inside SSA, (d) all three? Default assumption: **all three**, ranked (a)>(c)>(b).

### 3. Constraints + what 'good' looks like (assumption)
**Constraints (must honour):**
- **Two-step offer flows for Japan and Germany** (functional-knowledge §Critical Functional Areas). Agent must detect country and switch flow.
- **Pay transparency / EU Pay Directive** — band disclosure when relevant (EU hires).
- **GDPR + tenant config** for who sees comp data; Comp Partner approval is tenant-configurable.
- **Tenant-configured offer letter templates** — agent does not invent letters, it composes from tenant templates.
- **Audit trail for irreversible commits** — the moment "Send Offer" is pressed, downstream tasks (background check, eSign, candidate inbox) fire; design must show side-effects pre-commit.
- **Accessibility + globalisation non-negotiables** per `design/references/ux-quality-checklist.md`.

**What 'good' looks like in 3 months (assumption — explicitly tagged):**
- **Qualitative**: Recruiter says "Create Offer used to take me 35 minutes of context-switching; now I do it in one conversational pass without leaving the candidate's record."
- **Quantitative target candidates** (pick one with PM):
  - (a) **Median Generate Document → Review Documents cycle drops 30%** (from ~14.6h to ~10h on the latest month — `data-offer-steps.ts` Review Documents 2026-03 = 14.666h avg).
  - (b) **% of offers requiring recruiter rework after Comp Partner review drops 50%** (assumption: rework is a real signal — needs telemetry confirmation).
  - (c) **NPS / CSAT for SSA Create Offer ≥ 60** (parity with SSA Create Req baseline if any).
- `- [ ] needs PM confirmation`: which success metric is the actual contracted KPI? Default assumption: (a) document-cycle compression, because it has clean Pharos baseline.

### 4. Catch-all (assumption + flagged unknowns)
- **Pattern continuity with SSA Create Job Req**: This design must feel like the same SSA family as the demos in `design/references/ssa-create-req-flow-best-practices.md` (overlap, transfer). Mirror split-pane layout, payroll-safe corrections, dual-pane completion. Recruiters who learned Create Req should pattern-match instantly.
- **Leverage existing offer artefacts**: `design/offers-playground-v01.tsx`, `design/offers-dashboard-v01.tsx`, `design/components/AdobeSignAadhaarFlow.tsx` (India eSign) already exist — design should reuse and not duplicate.
- **India PRD precedent**: `docs/prds/india-aadhaar-adobe-sign-offer-prd.md` — country-specific overlay pattern is already in workspace.
- **Likely political note (assumption)**: Offers are sensitive (legal-binding, comp data, candidate-emotional). Comp leadership may push back on "AI drafted offer letter" framing — design should consistently show **draft + recruiter review + explicit Send** (Empower principle), never auto-send.
- `- [ ] needs PM confirmation`: any executive preference for split-pane vs full-screen chat? Any prior failed attempts at Create Offer automation that constrain language ("don't call it auto", "don't say AI")? Any roadmap dependency (Adobe Sign 2.0, Workday Pay rebrand, etc.) that affects this design's release window?

---

## PASS 1 — Layout Strategy (Design Thinking)

### A. JTBD

**Worksheet alignment**: Recruiter cluster — *Manage candidates throughout the recruiting process* → "**Make a successful offer to the chosen candidate**". Cross-references Manager cluster — *Grow and maintain my team* → "**Finalize candidate's offer**". Source: `docs/jtbd-recruiting-hr-professional-and-manager.md`.

**Synthesised job statement**:
> When **I have an approved candidate ready for offer and the comp / pay-grade / country specifics are non-trivial**, I want to **draft, validate, route for approval, and send the offer in one conversational pass with the system enforcing the rules**, so I can **get a signed offer in front of the candidate before they cool off — without context-switching across pay-grade tables, country-specific templates, approver chasing, and eSign portals**.

**Prototype implications**:
- Conversational entry that captures intent ("create offer for Sarah Chen on Req 12345") without forcing form-filling first.
- Structured task pane that shows compensation, dates, location, approvers, document, and post-send side-effects in one place.
- Rule enforcement (pay-grade band, country-specific 2-step, currency, approval routing) **explained**, not silently applied.
- Pre-commit summary with **everything that will happen** when Send is pressed.
- Post-send: traceable transaction id, approver inbox state, candidate inbox state, eSign status.

### B. Shell Pattern

**Primary**: **A** (global chrome only — full SSA shell as in the SSA Create Req demos) — full-width, two-pane: chat left, structured offer task right.

**Secondary**: **B** when the user enters from a candidate profile (candidate column briefly visible during ingress, then SSA takes over the canvas).

Justification (per `design/references/recruiter-flow/README.md` shell vocab): SSA is its own dedicated agent chrome with global header + the conversational + task split. It is not A+ (no recruiter hub sidebar inside SSA), not C (not modal — the work is non-trivial), not D (not table-heavy). The split-pane is the exact shell the SSA demos already use (`design/references/ssa-create-req-flow-best-practices.md` §3, evidence frames `loc-6300`, `loc-7920`, `ov-9900`).

### C. Real layouts referenced
- **SSA Create Req — Overlap** flow (`design/references/ssa-create-req-videos/frames-overlap/ov-2700.png` and onward): Position Confirmation card + smart-default explanation + stepper on right; chat reasoning on left. Mirror this exact split for Offer Confirmation.
- **SSA Create Req — Location Move**: payroll-safe date correction banner (`loc-6300.png`) and post-success illustration with txn id + side-effect explainer (`loc-9000.png`). Reuse the **correct + explain** and **dual-pane completion** patterns wholesale.
- **`design/offers-playground-v01.tsx`** and **`design/offers-dashboard-v01.tsx`**: existing offer-domain prototypes — pull the offer data shape, comp display patterns, and the document/approval step labels from `design/data-offer-steps.ts`.
- **`design/components/AdobeSignAadhaarFlow.tsx`**: country-specific overlay pattern for India eSign — model Japan and Germany overlays on the same pattern (component reuse).
- **NOT used here**: `pattern-hired-score-grid.md` (no candidate grid in this flow); `pattern-candidate-smart-view.md` (no profile being designed — only ingress reference).

### D. Layout Regions
- **Top**: `WorkdayTopNav` with `variant="app"` — **white bar** (`SANA_TOP_NAV_BG`) + **grey pill search** (`SANA_SEARCH_FIELD_BG`) + 1px `SANA_TOP_NAV_DIVIDER` hairline. Tenant logo + utilities + avatar on the white surface. The Workday brand gradient (`SANA_HOMEPAGE_GRADIENT`) is homepage-only and must not appear above the SSA flow.
- **Left**: **Conversation pane** — full-height chat thread, fixed width ~480–560px. `SanaCommMessageBubble` + `SanaCommComposer` per `015-sana-style-ui.md` Full-page conversational assistant section. Disclosure header at top (Banner) + privacy footer line below composer.
- **Center → Right**: **Structured Offer Task pane** — flexible-width (consumes remaining viewport), Sana page canvas `SANA_PAGE_CANVAS`, white cards with `SANA_CARD_RADIUS_LG` and `SANA_CARD_SHADOW`. Contains the stepper + the active step's content + persistent summary card.
- **No `WorkdayLeftTabBar` inside SSA** — SSA is dedicated agent chrome, not a hub. (Per SSA demo precedent.)
- **No CommunicationDock** — the entire left side is the agent conversation.

### E. Hierarchy
- **Primary focus** (right pane): the **active offer task step** card (e.g. *Compensation* or *Approvers* or *Send Offer*) with the **summary table** beneath. Big `<Heading size="large">` page title at the top of the right pane: "Create Offer for Sarah Chen — Senior Product Manager, Req 12345".
- **Secondary** (right pane): the **stepper** showing all phases (e.g. Candidate & Req → Compensation → Country & Approvals → Document → Review & Send), with current step highlighted as a Sana pill.
- **Supporting** (right pane): inline AlertBanner for rule corrections (pay-band, country switch), and a persistent footer with approver chips + side-effect pre-commit summary on the Send step.
- **Conversation** (left pane): equal cognitive weight to the right pane — chat carries intent, rationale, NL refinement, and questions back to the user. Quick-reply suggestion chips after agent turns where helpful.

### F. Interaction Model
- **Split-pane**, mandatory.
- **Stepper** in the right pane (5 steps proposed) — user can't randomly jump but can go back to revise.
- **NL write-through**: chat commands ("change start date to June 16th", "increase base by 8%", "switch to Germany template") **visibly update** the right-pane fields with a **bullet summary** in chat ("Updated: Base 90,000 → 97,200 (+8%); Pay band check: still within range.").
- **Smart defaults with explanation**: country detection, pay-band validation, approver routing — defaults pre-filled with one-line rationale; user can override in chat or the form.
- **Pre-commit summary table** before Send — required.
- **Dual-pane completion** on success — chat celebrates + lists side-effects (eSign sent, HM notified, background check launched); right pane shows large success state with txn id and offer pdf link.

### G. Layout Framework A–F
- **A. JTBD**: Make a successful offer to the chosen candidate (above).
- **B. Shell**: Pattern A, split-pane SSA.
- **C. Hierarchy**: Right-pane active step + summary + persistent stepper; left-pane chat with disclosure header and privacy footer.
- **D. Density**: Calm Sana density. ≤1 stepper + ≤1 active form region + ≤1 summary card visible in the right pane at a time. Conversation density paced by user typing.
- **E. Accessibility**: see PASS 2 §6 Quality Non-Negotiables.
- **F. Canvas coverage** (high-level): `WorkdayTopNav`, `SanaCommMessageBubble`, `SanaCommComposer`, Canvas Kit `Card`, `Heading`, `BodyText`, `StatusIndicator`, `Banner`, `PrimaryButton`, `SecondaryButton`, `FormSelect`, `FormTextInput`, `FormDateInput`, `FormRadioGroup`, `Avatar`, `Modal` (for country-specific overlays), `AdobeSignAadhaarFlow` (India), `AlertBanner`, `EmptyState`. Detailed mapping in PASS 2 §1.

### H. Extreme Scenarios & Unhappy Paths

| Scenario | Design response |
|---|---|
| Candidate already has an active offer in another req | Agent detects + asks: "Sarah has an active offer on Req 9876. Do you want to **rescind that** before drafting a new one, or **add this as an additional offer**?" Right pane shows both reqs in a small comparison card. |
| Comp outside band (above or below) | Block silent commit. Inline `AlertBanner` (warning) on the Compensation step + chat explanation: "Base of 140,000 is **18% above** the published band for Senior PM in Dublin. Comp Partner approval will be required and routed to **Aoife Murphy**." Recruiter chooses: revise / proceed with extra approval. |
| Currency mismatch (req in USD, hire in Tokyo) | Agent detects, suggests JPY conversion at today's rate, offers to switch the offer currency, and **explains** the FX source and date in chat. |
| Country switch detected (US → Japan / Germany) | Detect from candidate work location. Insert dedicated step "**Country requirements**" with the relevant 2-step / works-council flow inline. Source: `.cursor/rules/050-functional-knowledge.mdc`. |
| Approver chain unavailable (HM on PTO) | Agent detects out-of-office status, suggests delegate per Workday delegation rules, asks recruiter to confirm. |
| eSign provider down (Adobe Sign outage) | Three-part error (PASS 2 §7): "I can't send the offer for signature right now. Adobe Sign is unavailable. You can save this as a Draft and send when service resumes, or download the PDF and email manually." |
| Recruiter accidentally types "delete this candidate" | Out-of-scope — agent declines politely and offers a non-destructive alternative ("That isn't something I can do here. To withdraw a candidate, open their profile."). |
| Mass-create offers (batch) | **Out of scope** for v1 — agent surfaces a one-line note when intent is detected and offers to create a single offer instead. |
| Bot or fraudulent candidate (10,000-application req) | Inherits upstream candidate vetting; this flow assumes a recruiter-selected real candidate. Agent does **not** make adverse-impact decisions about the candidate — that is HiredScore's job, not Create Offer's. |
| Data-against-the-person check | Comp data, salary, equity, start date all sensitive. Conversation transcript and right-pane data must respect tenant data-access policies (only Recruiter, HM, Comp Partner with permission can see). Agent must refuse to read out comp data if the requester lacks access. **060 legal review required** before launch. |
| Overlap declined by HRBP or position control (Idea 1a) | Recruiter enables overlap; smart default detects the combination would push the req's position-control count above the tenant's ceiling. AlertBanner (caution) blocks Continue: "Overlap would put Product Engineering at 42 of 40 positions. HRBP approval is required to overlap." CTAs: [PrimaryButton "Add HRBP approval"] [SecondaryButton "Revise start date"]. |
| QA deck hard-fail blocks Send (Idea 2) | One or more Step 4 checks returns `fail` (e.g. letter prose contradicts the structured worksheet; template classification doesn't match country). AlertBanner (error) renders at the top of Step 4 + Send button disabled on Step 5 with a secondary "See what's wrong" link that jumps to Step 4. |
| DE works-council acknowledgement missing (Idea 3) | Recruiter switches country to Germany but tries to Continue from Step 3 without ticking the acknowledgement checkbox. Inline helper text turns error-red; Continue button disabled; agent posts a three-part message in chat explaining what the checkbox confirms and why it's required. |
| AI approver summary suppressed in regulated tenant (Idea 4) | Tenant has the AI-summary feature toggled off in Setup (mocked via a hard-coded tenant flag). Step 5 Switch renders disabled with helper text: "Your tenant doesn't allow AI summaries in approver notifications. Approvers will see the packet only." |
| Approver OOO with no delegate (Idea 1b) | Approval map shows an approver OOO for 12+ days with no delegate. Three-part error: Problem ("{Approver} is out for 12 days."); Reason ("They haven't set a delegate."); Next steps ("Pick a different approver, or skip this optional approver."). Pins in the chat feed and the approver row on the map. |
| Approver packet preview contains sensitive compensation — viewer lacks permission (Idea 4) | Approver packet is scoped per recipient; if a non-comp approver lacks comp-data permission, the "Comp band summary" section renders as a redaction chip ("Comp data not shared with this approver") with a tooltip on the chip. Recruiter cannot un-redact. |

### I. Global & Inclusive Users

- **Localisation built into the flow**: candidate work location auto-routes to country-specific overlay (Japan 2-step, Germany works council, India Aadhaar/Adobe Sign — already in workspace). Default mindset: "will this work in French / German / Japanese / Arabic?" before, not after.
- **Text expansion allowance**: +35% horizontal / +15% vertical reserved on all stepper labels, button copy, and AlertBanner text. The right pane column must **not** rely on tight horizontal space.
- **No gesture-based imagery**: no thumbs-up illustration on success — use a calm Sana confirmation illustration instead. Thumbs-up on individual chat turns is fine (universal in chat UI), but not as a status icon.
- **No text in images**: success illustrations carry text in HTML, not baked into PNG.
- **Microsoft Inclusive Design Spectrum**: keyboard-first interaction (no mouse-only steppers); high-contrast mode tested; cognitive-load minimised by one active step at a time; situational design for recruiters interrupted mid-offer (the SSA conversation auto-saves, recruiter can resume).
- **Authentic representation** in candidate names used in mocks (Sarah Chen, Aoife Murphy, Yuki Tanaka, Mateo Rivera) — not a US-default cast.
- **British English** throughout copy (workspace default, `010-style-guide.mdc`).

### J. AI Experience Framing (315 PASS 1 step 10)

```
AI Experience Framing:
- Interaction Mode (primary): Creating
- Secondary modes (if any): Reviewing (pre-commit summary review + Idea 2 Document QA deck + Idea 4 Approver Packet Preview — all position the recruiter as the reviewer of system-proposed content), Configuring (when a step touches tenant template choice, approver delegation, or the Idea 4 AI-summary toggle)
- Phases addressed: [x] Before Interaction  [x] During Interaction  [x] Over Time
- Stance: Amplify (faster, fewer mistakes) + Empower (recruiter unlocks country/comp expertise without leaving the conversation). Idea 2 and Idea 4 add a deliberate Reviewing stance — the system proposes evidence-backed QA results and approver-facing summaries; the recruiter is the explicit reviewer-of-record and the only actor who can Send.
- Agent classification: Conversational
- Skill mode: User-Triggered Delegate
- Pattern (from section 6): Split-pane Agent + Task
- Surface (from section 7): Workday Web (recruiter primary). Hiring Manager approvals route to Workday Everywhere (Slack/Teams) via existing approval framework — out of scope to design that surface here, but the SSA's send action triggers it.
- Disclosure location + copy: Header banner — "Self-Service Agent: Create Offer. I draft and validate offers — every send requires your confirmation. A human (you) reviews everything before the candidate sees it."
- Idea 4 additional disclosure: AI-summary switch carries an always-visible disclosure line ("Generated with Workday AI. Every number is a live link back to the source data. You can tune the tone in chat.") and is **off** by default in the demo tenant to model the regulated-tenant case. 060 legal review required.
- Fallback message: "I can't pull that up right now. You can [open Sarah's profile] to continue manually, or [retry] in a moment."
- Error message pattern: Three-part (Problem + Reason + Next steps). Fully specified in PASS 2 §7 Copy Inventory.
```

**Pattern justification**: Split-pane Agent + Task is the explicit recommended pattern for "Offer approval and open requisition workflow" in `design/references/ai-experience-guidance.md` §6 (table: Which pattern for which Recruiting scenario). It satisfies the constraints: high-consequence, multi-step, dependent fields (comp, approvers, country, document), commit gate (Send), audit-friendly confirmation. SSA Create Req uses the same pattern with proven recruiter familiarity (`ssa-create-req-flow-best-practices.md`).

**Patterns explicitly ruled out**:
- **Full-Screen Chat**: would hide the structured comp / approver / document state behind chat scrollback — fails the "regulated transaction with commit gate" test in §6 anti-pattern table.
- **Partial Panel Chat**: would force the recruiter to keep the underlying offer task screen visible *behind* the chat — but in SSA the conversation IS the workspace, so a partial panel inverts the model.
- **Contextual Ingress alone**: fine for invoking the agent from a candidate profile, but not the entire flow — a one-shot tip can't carry a 5-step transaction. (Design uses Contextual Ingress as the **entry**, then escalates to Split-pane Agent + Task per the §6 cross-pattern guidance: "Start lightweight in-form, escalate to split-pane when constraints/approvals appear.")
- **Content Generation alone**: fine for drafting the offer letter (and that step does use it inside the right pane), but not the entire transaction — it can't validate comp, route approvals, or commit.

### Constraints
- ✅ No Canvas Kit specifics in PASS 1 (high-level only — this section).
- ✅ Feels like an existing Workday screen (mirrors the SSA Create Req shell, mirrors the Sana style).
- ✅ Optimised for recruiter speed (one conversational pass; no context-switching).

---

## PASS 2 — UI Composition (Canvas Kit + Sana Style + Copy Inventory)

### 0a. Ideas 1–4 addendum (v0.2)

Four AI enhancements ship in this pass. Each is grounded in competitive intelligence, Workday data surfaces (XO Developer research), and Pharos telemetry on where today's Offer BP actually bleeds time. All four reuse existing Canvas Kit wrappers — **no new CK controls are introduced**.

| # | Name | Where it lives | JTBD hook | Source of evidence |
|---|---|---|---|---|
| 1 | Overlap-aware confirmation + live approval map | Step 1 (overlap card) + Step 3 and Step 5 (approval map) | "Make the offer commit without losing sight of who holds what" | `staffing/jobChanges.availableForOverlap`; BP introspection (`remainingSteps`, `toDo`, `inProgressSteps`); SSA Create Req overlap reference frame |
| 2 | Document loop QA deck | Step 4 (above the letter preview) | "Send a letter I can defend to Legal, Comp, and the candidate" | `hrrecruiting/offerWorksheet`; Employment-Agreement Embedded BI Data; Pharos `Review Documents` cycle (p90 ~35h) is the #1 time sink |
| 3 | Country system-held compliance card (DE) | Step 3 (injected when `country === 'DE'`) | "Don't make me memorise Germany's wage-group rules" | `Pre_Hire_Collective_Agreement_Data`; 050 functional knowledge § Works-council Germany |
| 4 | Approver packet preview with evidence-linked summary | Step 5 (above the pre-commit summary) | "Show me what my approver will see before I press Send" | `hrrecruiting/offerWorksheet`; BP introspection + Ashby-style AI summary pattern from competitive research |

**Idea 5 (worksheet-as-authority)** — deferred; not in this prototype pass.

**Mocked-data surfaces for 320 (no real XO calls from prototype)**:
- `staffing/jobChanges.availableForOverlap` — seed two scenarios (overlap OK; overlap would breach position-control window).
- BP introspection `remainingSteps`, `toDo`, `inProgressSteps` — seed a 3-approver chain with one OOO + delegate.
- `hrrecruiting/offerWorksheet` — seed a structured worksheet matching the Sarah Chen mock.
- Employment-Agreement Embedded BI Data — seed 6 QA check rows (band, currency, payroll-safe date, template, classification, worksheet-vs-prose).
- `Pre_Hire_Collective_Agreement_Data` (DE) — seed one wage-group record for the "Senior Product Manager" role in Berlin.

### 0. Canvas Kit MCP discovery
- **Status**: Canvas Kit MCP was **errored** at draft time (see `STATUS.md` for `user-canvas-kit-mcp`). 320 prototype dev MUST re-call `get-canvas-kit-tokens` and `docs://tokens/color-roles` before implementation.
- **Mitigation**: Component selection below is grounded in the workspace's existing Canvas Kit wrappers (`design/components/index.ts`) which are themselves Canvas-Kit-correct, and in `010-style-guide.mdc` + `015-sana-style-ui.md` token usage. No invented controls.

### 1. Layout → Canvas Kit components map

| Region | Component(s) | Source |
|---|---|---|
| Global top chrome | `WorkdayTopNav` | `design/components/WorkdayTopNav.tsx` |
| SSA shell (full viewport, no left tab bar) | Custom `Box` flexrow with `flex: 0 0 ~520px` (chat) + `flex: 1` (task pane) | New, but pattern from `design/gcc-interview-scheduling-compliance-nudges-v90.tsx` per `015-sana-style-ui.md` |
| Left: chat header / disclosure | Canvas Kit `Banner` (info variant) + `Heading size="medium"` | `015-sana-style-ui.md` Full-page agentic assistant § |
| Left: chat thread | `SanaCommMessageBubble` (assistant + user variants) + Canvas Kit `Avatar as="div"` for assistant rows | `design/components/SanaCommPanelPatterns.tsx` |
| Left: composer | `SanaCommComposer` | `SanaCommPanelPatterns.tsx` |
| Left: privacy footer | Canvas Kit `BodyText size="small" color={colors.blackPepper400}` | `319-copy-review.mdc` AI disclosure placement |
| Right: page title | Canvas Kit `<Heading size="large">` per Sana hard rule (no breadcrumbs) | `015-sana-style-ui.md` |
| Right: stepper (5 steps) | Canvas Kit `Tabs` (horizontal, pill style) — **NOT** ad-hoc dots; checked-step uses `StatusIndicator` Green/Low inline | `010-style-guide.mdc` and `315-design-brief-creation.mdc` PASS 2 §8 |
| Right: active-step content (forms) | `Card` wrapper + `FormSelect`, `FormTextInput`, `FormDateInput`, `FormRadioGroup`, `FormCheckboxGroup` from `design/components/SharedFormControls.tsx` | per 315 PASS 2 §4 mandatory |
| Right: comp band warning | `AlertBanner` from `design/components/AlertBanner.tsx` (caution variant) | exists in workspace |
| Right: country overlay (India) | `AdobeSignAadhaarFlow` from `design/components/AdobeSignAadhaarFlow.tsx` | reuse — already shipped |
| Right: country overlay (Japan / Germany) | New: `JapanTwoStepOfferOverlay` and `GermanyWorksCouncilOverlay` modelled on `AdobeSignAadhaarFlow` API shape | New components — flag in §8 implementation note for 320 |
| Right: pre-commit summary table | `Table` + `Table.Row` + `Table.Cell` (Canvas Kit) with `StatusIndicator` for each side-effect (wrap inside `<span style={{display:'inline-flex'}}>` per `015-sana-style-ui.md` Table.Cell rule) | per `010-style-guide.mdc` |
| Right: success state | `EmptyState` repurposed (success variant — no breadcrumbs, large `<Heading>` + body + primary "View offer" CTA + secondary "Send another") | `design/components/EmptyState.tsx` |
| Country-detect modal (when ambiguous) | Canvas Kit `Modal` via `WorkdayModal` wrapper | `design/components/WorkdayModal.tsx` |
| Send / Cancel CTAs | Canvas Kit `PrimaryButton` ("Send Offer") + `SecondaryButton` ("Save Draft") | `010-style-guide.mdc` button hierarchy |
| Approver chips | `StatusIndicator` Gray/Low for each approver name; pending = Orange/Low; approved = Green/Low; rejected = Red/Low | `315-design-brief-creation.mdc` PASS 2 §8 |
| Compensation breakdown card | `Card` + `Heading size="medium"` + nested `Table` for line items (Base / Bonus / Equity / Sign-on / Total) | Canvas Kit |
| Side-effect pre-commit list | `Card` + `BodyText` + `SystemIcon` (`mailIcon`, `envelopeIcon`, `calendarIcon`, `checkCircleIcon`) | `@workday/canvas-system-icons-web` |
| **Idea 1a — Step 1 Overlap-aware card** | Reuse the existing in-file `ToggleRow` (pattern already mirrors SSA Create Req `REFERENCE-position-confirmation-with-overlap-toggle.png`) + `AlertBanner` caution when overlap exceeds the position-control window | `design/create-offer-ssa-v01.tsx` (`ToggleRow` local component) + `design/components/AlertBanner.tsx` |
| **Idea 1b — Step 3/5 Live approval map** | New in-file `ApprovalMap` block: `Card` + row-per-approver (`Avatar` + name + role + `StatusIndicator` + `SystemIcon` `clockIcon` / `checkCircleIcon` / `xIcon`) + inline `SecondaryButton` "Delegate" + `TertiaryButton` "Ping" | Canvas Kit primitives; layout mirrors `CountryAndApproversStep` existing approver list |
| **Idea 2 — Step 4 Document QA deck** | New in-file `DocQaDeck` block: `Card` + per-check row (`StatusIndicator` + label + one-line message + optional "Open in Writer" `TertiaryButton` chip) + `AlertBanner` for hard-fail rows | Canvas Kit + `design/components/AlertBanner.tsx` |
| **Idea 3 — Step 3 DE Collective-Agreement card** | New in-file `CollectiveAgreementCard`: `Card` + read-only `DisplayCard`-style rows (wage group, collective-agreement ID, works-council status) + `FormCheckboxGroup` for the required acknowledgement + "Sourced from Pre-Hire Collective Agreement …" footer | Canvas Kit + `design/components/SharedFormControls.tsx` `FormCheckboxGroup` |
| **Idea 4 — Step 5 Approver Packet Preview** | New in-file `ApproverPacketPreview`: `Card` + `Switch` "Include AI summary in approver notification" + `CollapsibleSection` per packet section (Comp band summary, Role & reporting, Country requirements, Document version) + inline citation chips (pill-style `Box` with `arrowCornerDownRightIcon`) | `design/components/CollapsibleSection.tsx` + Canvas Kit `Switch` |

### 2. Sana Style application
- Page canvas: `SANA_PAGE_CANVAS` (~#F3F5F7) for the right task pane background; chat pane uses `SANA_COMM_PANEL_SURFACE` (white).
- Top nav: `WorkdayTopNav` `variant="app"` — **white bar** (`SANA_TOP_NAV_BG` `#FFFFFF`) with a **grey pill search** (`SANA_SEARCH_FIELD_BG` `#F3F4F6`) and a 1px `SANA_TOP_NAV_DIVIDER` hairline underneath. Homepage-only brand gradient (`SANA_HOMEPAGE_GRADIENT`) is forbidden on this surface.
- Cards: white on grey canvas, thin `soap300` border, `SANA_CARD_RADIUS_LG` (~20px), `SANA_CARD_SHADOW`.
- Stepper: pill-shaped active state per `SANA_TAB_PILL_RADIUS`; inactive = medium grey label; active = bold near-black inside Sana pill.
- Composer: pill, focus ring, circular send (per `SanaCommComposer`).
- Validated against `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` (composer / bubbles / surface) and `Sana_Style_UI-employee-profile-comm-dock.png` (overall shell density). No legacy blueberry chrome.
- Page title at top of right pane uses `<Heading size="large">` per the **no breadcrumbs / no chevron strips** hard rule.

### 3. Navigation completeness
SSA does not have left-tab-bar navigation inside its own shell. The right-pane stepper IS the navigation. All five steps are designed (no placeholders):
1. **Candidate & Req** — confirms candidate, req, manager, location. **+ Idea 1a**: Overlap-aware card surfaces when incumbent + start date indicate a transition; toggle enables overlap with a plain-language rationale; AlertBanner caution if the combination would breach the tenant's position-control window.
2. **Compensation** — base, bonus, equity, sign-on, total comp; pay-band validation; currency. (Unchanged in this pass.)
3. **Country & Approvers** — country overlay (if applicable) + approver chain (HM → Comp Partner → others) with delegation. **+ Idea 1b**: Live approval map replaces the existing approver list — per-approver status (pending / in progress / approved / rejected / overdue), "held since" timestamp, OOO + delegate surfaced with inline "Delegate" and "Ping" actions. **+ Idea 3**: When `country === 'DE'`, the Collective-Agreement Card injects above the approver list with read-only wage-group + works-council data and a required-acknowledgement checkbox that gates Continue.
4. **Offer document** — template selection (tenant-config), AI-drafted letter preview in `RichTextEditor`, edit / regenerate. **+ Idea 2**: QA deck renders above the letter preview with six mocked checks against the structured worksheet and Embedded BI data; hard-fail rows promote an AlertBanner and disable Send until resolved; warn rows render inline without blocking.
5. **Review & Send** — full pre-commit summary table + side-effect list + Send / Save Draft / Cancel. **+ Idea 4**: Approver Packet Preview card renders above the pre-commit summary with a per-approver view of what the approver will see in their Workday inbox, a "Include AI summary in approver notification" Switch (default off for regulated-tenant demo), inline citation chips on the AI summary, and a read-only re-render of the approval map so the recruiter sees the live status of the chain they're about to trigger.

Plus a terminal **Sent** state (not a step the user enters explicitly — it appears after Send) with txn id, offer PDF link, approver inbox status, candidate inbox status, and "Anything else?" continuity prompt.

### 4. Shared components
- `WorkdayTopNav` ✅
- `WorkdayLeftTabBar` ❌ (intentionally omitted — SSA is dedicated agent chrome)
- `CommunicationDock` ❌ (intentionally omitted — left pane IS the conversation)
- `SanaCommMessageBubble` + `SanaCommComposer` ✅
- `FormSelect`, `FormTextInput`, `FormDateInput`, `FormRadioGroup`, `FormCheckboxGroup` ✅
- `AlertBanner`, `EmptyState`, `PageHeader`, `WorkdayModal` ✅
- `AdobeSignAadhaarFlow` ✅ (reused for India)
- `RichTextEditor` ✅ (offer letter preview / edit)
- `A2UIRenderer` + `GenUIPatterns` (`DraftMessage`) — optional for the offer letter draft if A2UI payloads are in scope.

### 5. Experience Principles validation

**Empower (recruiter control):**
- ✅ Outcome-focused: design is around "get a signed offer in front of the candidate", not "fill out the offer form fields in the right order".
- ✅ Recruiter stays in control: every commit (band override, approver delegation, country overlay confirm, **Send**) is recruiter-confirmed.
- ✅ Tool recedes: most fields pre-populate from candidate + req + tenant config; recruiter confirms or edits in chat.

**Trust (transparency):**
- ✅ Transparent: every smart default (country detection, comp band check, approver routing, document template) carries plain-language rationale visible at the moment of decision (mirrors SSA Create Req `ov-2700.png` pattern).
- ✅ Clear and familiar: uses Workday-native vocabulary (req, candidate, offer letter, approver, business process, txn id) — no AI-jargon.
- ✅ Reliable: pre-commit summary table is the audit-friendly confirmation. No surprises after Send.

**Grow (easy change):**
- ✅ Recruiter can revise compensation in chat at any step before Send, with `bullet summary` confirmation in chat (mirrors SSA Create Req `ov-7200.png` NL-edit pattern).
- ✅ Change history: chat transcript IS the change history; pre-commit summary shows final state vs prior smart-default.
- ✅ Build upon existing: drafts auto-save; resume mid-flow; "Send another" repeats with prefilled candidate/req if recruiter is offering siblings.

### 6. Quality Non-Negotiables

**Accessibility:**
- Greyscale test: stepper status uses icon + colour (check, dot, pending icon), not colour alone.
- Text contrast: all body text ≥ 4.5:1; AlertBanner caution text ≥ 4.5:1 against banner fill; focus-state contrast ≥ 3:1.
- Exactly one H1 per pane: Page title is the only H1 in right pane; chat header is H2 in the left pane.
- All icon-only buttons (composer send, retry, regenerate) have visible tooltip on hover and focus.
- Tap targets ≥ 24×24px (web).
- Font-scaling: layout intact at 200% browser zoom — right pane scrolls vertically; chat pane stacks bubbles.
- Keyboard equivalents: all chat actions (send, regenerate, quick replies) keyboard-accessible; stepper navigable via Tab + Enter.

**Globalisation:**
- Pseudo-translation tested before high-fidelity sign-off. Stepper labels and button copy reserved +35% horizontal.
- No gesture-based imagery in success / empty states.
- No text embedded in images.
- +35% horizontal / +15% vertical text expansion confirmed on right pane.

**Equity & Inclusion:**
- Harm Less UX: comp data is sensitive — no comp shown to anyone outside permission scope (assumes upstream Workday DAP enforcement; design respects it).
- Recoverable mistakes: every step before Send has Edit / Regenerate / Save Draft. Send is the only irreversible action and requires a confirmation summary view.
- Data-use analysis: comp + start date + reporting line + offer letter are sensitive personal data. **060 legal review required before launch**: AI disclosure copy, consent for AI-drafted letter, GDPR retention of conversation transcripts, and tenant data-access policy alignment.

### 7. Copy Inventory (for 319 review)

**Buttons and CTAs:**
- Primary action (Send step): "Send offer"
- Primary action (per-step): "Continue"
- Secondary (per-step): "Back"
- Secondary (Send step): "Save draft"
- Tertiary (any step): "Cancel"
- Composer send: icon-only, tooltip "Send message" / aria-label "Send message"
- Regenerate (offer letter step): "Regenerate letter"
- Edit (offer letter step): "Edit letter"
- Retry (error states): "Try again"

**Form labels and help text:**
- Candidate: label "Candidate" | help "Pulled from your selection on Req {reqId}."
- Requisition: label "Requisition" | help "I'll only let you offer roles you're allowed to hire for."
- Hiring manager: label "Hiring manager" | help "Auto-routed for approval — you can delegate below."
- Work location: label "Work location" | help "Determines country-specific requirements (Japan, Germany, India, EU pay transparency)."
- Start date: label "Start date" | help "I'll align this to a payroll-safe date and explain if I have to move it." (mirrors SSA Create Req `loc-6300.png` payroll-safe pattern)
- Currency: label "Offer currency" | help "Defaults to the candidate's work-location currency. Override if needed."
- Base salary: label "Base salary" | help "I'll check this against your published pay band and flag if it's outside."
- Bonus target %: label "Bonus target (%)"
- Equity: label "Equity (units / value)"
- Sign-on bonus: label "Sign-on bonus" | help "One-time."
- Total comp: label "Total compensation" | help "Calculated. Read-only."
- Offer letter template: label "Letter template" | help "Tenant-configured templates for {country}. I'll draft from the one you choose."

**Error messages (three-part: Problem / Reason / Next steps + actions):**
- Comp outside band: "I can't continue without an extra approval. {Base} is {%} {above|below} the published band for {role} in {location}. Add Comp Partner approval and continue, or revise the comp." [PrimaryButton "Add Comp Partner approval"] [SecondaryButton "Revise comp"]
- Country mismatch: "Your req is set to {countryA}, but the candidate's work location is {countryB}. Country-specific requirements will change. Switch the country and reload the offer template, or keep the req country and override the candidate's location." [PrimaryButton "Switch to {countryB}"] [SecondaryButton "Keep {countryA}"]
- Currency mismatch: "Your req is in {currencyA}, but {countryB} typically uses {currencyB}. I'd convert at today's WD-FX rate ({date}). Switch currency, or keep {currencyA}." [PrimaryButton "Switch to {currencyB}"] [SecondaryButton "Keep {currencyA}"]
- eSign provider unavailable: "I can't send the offer for signature right now. {Provider} is unavailable. Save as a Draft and send when service resumes, or download the PDF and email manually." [PrimaryButton "Save draft"] [SecondaryButton "Download PDF"]
- Approver out of office: "{Approver name} is out of office until {date}. They've delegated approval to {Delegate name}. Route to {Delegate}, or pick a different approver." [PrimaryButton "Route to {Delegate}"] [SecondaryButton "Choose another approver"]
- Tenant template missing for country: "I can't draft an offer letter for {country}. Your tenant doesn't have a template configured. Add a template in Setup, or upload a one-off letter." [PrimaryButton "Open Setup"] [SecondaryButton "Upload letter"]
- Generic "I can't help with that": "That isn't something I can do here. To {alternative action}, open {alternative location}." [SecondaryButton "Open {alternative}"]

**Success / confirmation:**
- Per-step confirmation in chat: "Updated: {field} {old} → {new}. {One-line implication, e.g. 'Pay band check: still within range.' or 'Approval chain: now requires Comp Partner.'}"
- Pre-commit summary header: "Here's what'll happen when you send this offer."
- Send success (right pane): "Offer sent to {candidate name}." Body: "Transaction {txnId} • Offer PDF • Sent {timestamp} {timezone}." CTAs: [PrimaryButton "View offer"] [SecondaryButton "Send another"]
- Send success (chat): "Done. Offer is with {candidate name} for signature. {Hiring manager} has been notified for approval. Background check kicked off. Anything else I can help with?"

**Empty states:**
- New SSA invocation (no candidate context): heading "Who's the offer for?" body "Tell me the candidate or paste a candidate or req URL. I'll take it from there." CTA chips: "Offer for a candidate", "Offer from a req", "Help me decide compensation", "See offer best practices".
- Drafts list (out of scope this brief, but mention): "No saved drafts."

**Loading states:**
- Drafting letter: "Drafting your offer letter…" (composer area shows typing indicator).
- Validating comp: "Checking against your published pay band…" (Compensation step shows skeleton in band card).
- Sending: "Sending your offer…" (PrimaryButton shows spinner, disabled).

**Conversational assistant:**
- Assistant identity: "Self-Service Agent: Create Offer"
- Automation disclosure (header banner): "I draft and validate offers. Every send requires your confirmation. A human (you) reviews everything before the candidate sees it."
- Privacy / footer: "Conversations are saved to this offer's audit trail. AI-drafted letters are reviewed by you before send. {Link: How Workday handles AI in offers}"

**AI error copy — three-part structure**: see Error messages above (each follows Problem + Reason + Next steps + actions).

**Fallback message** (AI unavailable / low confidence): "I can't help with that part right now. {Specific reason or 'My systems are catching up'.} You can {open the candidate's profile / open the req / try again in a moment}." [SecondaryButton "Open profile"] [SecondaryButton "Try again"]

**Disclosure placement**:
- **Header**: full-width Banner at the top of the chat pane (above the first message), persistent throughout the session — assistant identity + scope + human-review reassurance.
- **Inline**: under each AI-drafted artefact (offer letter draft, smart-default rationale): "Drafted with Workday AI — review before sending."
- **Footer**: under composer — privacy / audit-trail / link to AI in offers explainer.

**Idea 1a copy — Overlap-aware card (Step 1):**
- Card title: "Overlap with outgoing employee"
- Switch label (aria): "Allow overlap"
- Helper line (always visible): "An overlap lets {candidate name} start before {incumbent name} leaves."
- Rationale when on (blueberry bodytext under switch): "{candidate name} starts {startDate}; {incumbent name} leaves {leaveDate}. Overlap keeps the team covered through the handover. No net change to headcount budget."
- Rationale when off: "No overlap. {candidate name} starts the day after {incumbent name}'s last day."
- Caution AlertBanner (when overlap breaches position control): "Overlap would put {costCentre} at {n} of {cap} positions. HRBP approval is required to overlap." [PrimaryButton "Add HRBP approval"] [SecondaryButton "Revise start date"]
- Chat acknowledgement on enable: "Overlap on. Position Product Engineering-Dublin keeps both heads from {startDate} to {leaveDate}. No new approvers needed."
- Chat acknowledgement on disable: "Overlap off. {candidate name} now starts {startDate}, the day after {incumbent name}'s last day."

**Idea 1b copy — Live approval map (Step 3 and Step 5):**
- Card title: "Approval map"
- Card helper (below title): "Live status from the business process. I'll ping or delegate when you tell me to."
- Per-approver status pill labels: "Pending" / "In progress" / "Approved" / "Rejected" / "Overdue".
- "Held since" microcopy: "Held since {relativeTime, e.g. '2 days ago'}."
- OOO microcopy (when approver has delegation set): "Out of office until {date}. Delegated to {delegate name}."
- OOO microcopy (when approver has no delegate): "Out of office until {date}. No delegate on file."
- Row CTAs: `<SecondaryButton size="small">Delegate</SecondaryButton>` + `<TertiaryButton size="small">Ping</TertiaryButton>`.
- Ping confirmation in chat: "Ping sent to {approver name}."
- Delegate dropdown placeholder: "Choose a delegate"
- Chat intent "who's blocking" response (three-part): "{Approver name} has it. They've had it for {duration}. I can ping them, or route to their delegate {delegate name}." [SecondaryButton "Ping {approver}"] [SecondaryButton "Route to {delegate}"].
- Chat intent "delegate to {name}" response: "Routed to {delegate name}. {Original approver} stays copied on the audit trail."
- Three-part error for OOO with no delegate: Problem "{Approver name} is out for {n} days." Reason "They haven't set a delegate, so I can't re-route automatically." Next steps "Pick a different approver, or skip this optional approver." [PrimaryButton "Choose another approver"] [SecondaryButton "Skip (if optional)"].

**Idea 2 copy — Document QA deck (Step 4):**
- Card title: "Quality check"
- Card helper: "I checked the draft against the structured worksheet. {passCount} of {totalCount} checks passed."
- Per-row labels (stable strings):
  - "Base salary vs pay band"
  - "Currency matches work location"
  - "Start date is payroll-safe"
  - "Letter template is tenant-approved"
  - "Job classification matches worksheet"
  - "Letter prose matches structured data"
- Pass label: "Passes — {short explainer}" (e.g. "Passes — €95,000 is inside the Senior PM IE band.")
- Warn label: "Worth a look — {short explainer}" (e.g. "Worth a look — start date is payroll-safe but falls on a public holiday.")
- Fail label: "Blocks send — {short explainer}" (e.g. "Blocks send — the letter references \"Germany permanent\" but the worksheet is set to Ireland.")
- "Open in Writer" chip: `<TertiaryButton size="small">Open in Writer</TertiaryButton>` (aria-label: "Open {check label} in the Writer editor").
- Header AlertBanner (error, when any fail): "I can't send this offer yet. {n} check{plural} didn't pass. See the QA deck above." [SecondaryButton "See what's wrong"].
- Chat intent "what's wrong with the document" / "run QA" response: "I ran {totalCount} checks. {passCount} passed, {warnCount} worth a look, {failCount} blocking send. The blockers: {bullet list of fail labels}. I can explain any of them."
- Chat intent "explain {check label}" response: "{Long explainer from the mocked evidence record}. {Suggested fix}." [SecondaryButton "Open in Writer"].

**Idea 3 copy — DE Collective-Agreement card (Step 3):**
- Card title: "Collective agreement (Germany)"
- Card helper: "I'm reading these from your tenant's Pre-Hire Collective Agreement record. They're authoritative — edit the source record in Setup to change them."
- Read-only field labels:
  - "Wage group" — value e.g. "E14 (Senior Professional)"
  - "Collective agreement" — value e.g. "Metall NRW 2024 (CA-2024-DE-14)"
  - "Works council" — value e.g. "Required — {n} business days"
- Required-acknowledgement checkbox label: "I've reviewed the collective-agreement terms with {candidate name} or will before Send."
- Helper text under checkbox: "This is your tenant's works-council compliance gate. Continue is locked until you tick it."
- Source footer: "Sourced from Pre-Hire Collective Agreement record CA-2024-DE-14. [Open in Setup]"
- Chat intent "explain collective agreement" / "what's this wage group" response: "Wage group E14 is the senior-professional tier under Metall NRW 2024. Base minimum: €78,400 a year. Your offer of €{base} sits above the minimum. Works council review adds about {n} business days to the cycle."
- Chat acknowledgement on tick: "Acknowledged. Works-council review will start after you press Send."

**Idea 4 copy — Approver Packet Preview (Step 5):**
- Card title: "What approvers will see"
- Card helper: "A live preview of the packet each approver will open in their Workday inbox."
- Switch label: "Include AI summary in approver notification"
- Switch helper (when off): "Approvers will see the packet only. No AI-generated text goes to them."
- Switch helper (when on): "Approvers will see a 3-line AI summary with links back to the source data. You can tune the tone."
- Switch disabled-helper (regulated tenant): "Your tenant doesn't allow AI summaries in approver notifications. Approvers will see the packet only."
- CollapsibleSection titles:
  - "Compensation and pay-band summary" (redacted for approvers without comp permission)
  - "Role, reporting line, and start date"
  - "Country requirements"
  - "Document version and QA result"
- Redaction chip: "Comp data not shared with this approver."
- AI summary inline-citation chip format: "{short label} ↗" (e.g. "Scorecard ↗", "Req approval trail ↗", "Pay band ↗"). Hover tooltip: "Source: {longer label}. Open the evidence in a new tab."
- AI summary disclosure (always under the summary when on): "Generated with Workday AI. Every number is a live link back to the source data. You can tune the tone in chat."
- Chat intent "shorten" response: "Shortened. The summary is now {wordCount} words. I kept the citations."
- Chat intent "make more formal" response: "Made it more formal. I removed the contractions and kept the structure."
- Chat intent "plain english" response: "Plainer. Same facts, fewer words, no jargon."
- Three-part error for regulated-tenant override attempt: Problem "I can't turn this on for your tenant." Reason "Your Workday Setup has AI summaries in approver notifications switched off." Next steps "Ask your Workday admin to enable AI summaries, or send the packet without one." [SecondaryButton "Send without summary"].

**Brand-voice check**:
- Contractions: I'll, can't, here's, you're.
- First person from the agent: "I'll align this to a payroll-safe date…", "I'd convert at today's WD-FX rate…", "I drafted…".
- Specific (numbers over "several"): "{%} {above|below} the published band", "{X} approvers needed", "Sent {timestamp}".
- Acknowledges uncertainty: "Based on what I can see…", "You may want to verify…" (used sparingly — most copy is confident statements about Workday data the agent owns, not vague hedging).
- British English throughout.
- Link to canonical [Canvas AI Persona](https://canvas.workdaydesign.com/guidelines/ai-guidance/ai-persona) for 319 reviewer to verify.

**Legal / consent (flag for 060):**
- Consent text (first time recruiter uses AI-drafted letter in this tenant): "Workday AI will draft an offer letter from your tenant's template. The letter is editable and not sent until you press Send. {Link: AI in Recruiting — what we do and don't do}." [PrimaryButton "OK"] [SecondaryButton "Don't use AI drafting"]
- Privacy notice: "Conversation transcripts are retained per your tenant's data retention policy and visible to users with permission to view this offer's audit trail."
- AI disclosure (candidate-facing — outside this brief but flagged): the candidate-facing offer letter must carry a short "Generated with assistance from Workday AI; reviewed and sent by {Recruiter name}" line at the bottom, per emerging EU AI Act transparency norms. **060 legal review required.**

### 8. Visual Indicators Specification (for 320)

**Status badges and indicators:**
- Stepper: completed step → `<StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Done"` icon={checkCircleIcon} />`
- Stepper: active step → `<StatusIndicator type={StatusIndicator.Type.Blue} emphasis={StatusIndicator.Emphasis.Low} label="In progress" icon={dotIcon} />`
- Stepper: upcoming step → no indicator, just label in medium grey
- Approver chip — pending → `<StatusIndicator type={StatusIndicator.Type.Orange} emphasis={StatusIndicator.Emphasis.Low} label="Pending: {name}" icon={clockIcon} />`
- Approver chip — approved → `<StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="{name}" icon={checkCircleIcon} />`
- Approver chip — rejected → `<StatusIndicator type={StatusIndicator.Type.Red} emphasis={StatusIndicator.Emphasis.Low} label="Rejected: {name}" icon={crossIcon} />`
- Country chip on Country & Approvers step → `<StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="{country flag emoji NO — text only} {country}" />` (no flag emoji per globalisation rule; text label only)

**Skills, tags, categories:**
- Comp band tag → `<StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="Band: {bandName}" />`
- "Within band" / "Outside band" → Green/Low or Red/Low respectively, with explanatory text in chat (not just colour).

**Button hierarchy:**
- Send step: `<PrimaryButton>Send offer</PrimaryButton>` + `<SecondaryButton>Save draft</SecondaryButton>` + `<TertiaryButton>Cancel</TertiaryButton>`. (Cancel as Tertiary is acceptable here because it's non-destructive within an unsent draft — destructive actions stay Secondary per `010-style-guide.mdc`.)
- All other steps: `<PrimaryButton>Continue</PrimaryButton>` + `<SecondaryButton>Back</SecondaryButton>`.
- AlertBanner inline actions (e.g. comp override): `<SecondaryButton>` pair (no PrimaryButton inside an AlertBanner — keeps the global page Send as the only Primary).

**Icons (Canvas Kit `SystemIcon`):**
- Chat send → `<SystemIcon icon={sendIcon} size={20} />` (or whatever `SanaCommComposer` provides natively).
- Regenerate letter → `<SystemIcon icon={refreshIcon} size={16} />`
- Edit letter → `<SystemIcon icon={pencilIcon} size={16} />`
- Side-effect rows on Send step:
  - Email → `<SystemIcon icon={envelopeIcon} size={20} />`
  - Approval routed → `<SystemIcon icon={checkInOutIcon} size={20} />`
  - Background check → `<SystemIcon icon={shieldIcon} size={20} />`
  - eSign sent → `<SystemIcon icon={documentIcon} size={20} />`
- Success → `<SystemIcon icon={checkCircleIcon} size={24} color={colors.greenery500} />`
- Warning (AlertBanner) → `<SystemIcon icon={alertIcon} size={20} color={colors.cantaloupe500} />`

**Avatars:**
- Assistant rows in chat → `<Avatar size={Avatar.Size.s} as="div" />` with Sana-style monogram, no gradient.
- Candidate / hiring manager / approver in summary → `<Avatar size={Avatar.Size.s} />` (24px) inline next to name.

**Communication channel selectors:** N/A (single conversation in SSA).

**Metadata formatting:**
- Pre-commit summary metadata: `BodyText size="small" color={colors.blackPepper600}` with middot separators — e.g. "Sarah Chen · Senior PM · Dublin · USD 150,000".
- Send success metadata: "Transaction WD-OFR-2026-04-01-A3 · Sent 14:32 BST · Offer PDF (87 KB)".

**Profile page reusability:** N/A — this is a transactional flow, not a profile hub. Do **not** use `ProfilePageLayout`.

**Implementation notes for 320:**
- Re-call `get-canvas-kit-tokens` MCP before starting (currently errored — see PASS 2 §0).
- Country overlays for Japan and Germany do **not** exist as components — model on `AdobeSignAadhaarFlow.tsx`. Treat as v1 scaffold (visual + flow only; does not have to wire to real Workday country business processes — this is a prototype).
- Versioning per `010-style-guide.mdc` and `320-prototype-developer.mdc`: new file `design/create-offer-ssa-v01.tsx` with route in `main.tsx`. Do not reuse `offers-playground-v01.tsx` or `offers-dashboard-v01.tsx` — different scope.
- Open in BOTH Google Chrome and Cursor Simple Browser via `scripts/open-url-chrome-and-cursor-browser.sh` per advisory standards.

---

## Handoff

- **319-doc-writer**: please review the Copy Inventory in PASS 2 §7 against Editorial Guidelines + AI-Specific Copy Guidance. The 060 legal-review flag is set on four items: AI disclosure (header banner), AI consent (first-time use), candidate-facing AI disclosure on the offer letter, and **new for v0.2** — the Idea 4 AI-summary switch + its always-on disclosure line (regulated-tenant behaviour). New copy to review lives under PASS 2 §7 "Idea 1a / 1b / 2 / 3 / 4" sub-blocks.
- **318-design-peer-reviewer**: please apply the AI Experience Review lens (`design/references/ai-experience-guidance.md` §12) and the standard 318 PASS 1 lenses. Particularly verify: (a) the four "needs PM confirmation" flags in Context Inquiry Notes are surfaced back to the PM before approval, (b) the pattern justification cites a ruled-out pattern (it does — four), (c) the Quality Non-Negotiables are addressed (they are — accessibility, globalisation, E&I), and **new for v0.2** — (d) Ideas 1–4 addendum (PASS 2 §0a) is coherent with the rest of the brief and introduces no new Canvas Kit components.

---

## PASS 3 — Peer Review Findings (v0.2 Ideas 1–4 addendum)

Reviewer stance: 318 peer review applied to the v0.2 addendum only. PASS 1 + base PASS 2 were approved in the prior cycle; only the new surfaces (Ideas 1–4) are in scope here.

### Strategy Validation
- **JTBD alignment**: ✅ Ideas 1–4 strengthen the "Make a successful offer" JTBD rather than expand it. Each idea targets documented pain (Pharos `Review Documents` p90 ~35h for Idea 2; approver-chase pain for Idea 1b; country expertise burden for Idea 3; approver trust / fraud-risk for Idea 4). No JTBD drift.
- **Shell**: ✅ Pattern A (split-pane SSA) unchanged; all four ideas live inside the existing right-pane stepper.

### Layout Quality
- **Idea 1a (Overlap card, Step 1)**: ✅ Reuses the existing in-file `ToggleRow` pattern which already mirrors the SSA Create Req overlap reference frame. No new pattern invention.
- **Idea 1b (Approval map, Step 3 + Step 5)**: ⚠️ **Minor**: the brief says the map "replaces" the existing approver list on Step 3; that's the right call (visual parity), but the ordering of the Step 3 cards needs to be explicit so 320 doesn't produce a double-list. **PASS 4 tweak**: specify card order on Step 3 as Country card → DE Collective-Agreement card (if DE) → Approval map card (replaces old approver list) → + Add extra approver link.
- **Idea 2 (QA deck, Step 4)**: ⚠️ **Minor**: the QA deck's default visibility state isn't specified. If all six checks pass, a full deck above the letter is noise. **PASS 4 tweak**: deck is **collapsed by default when all checks pass** (shows a single green summary row with "6 of 6 passed · expand"); **expanded by default when any `warn` or `fail` is present**.
- **Idea 3 (DE Collective-Agreement card, Step 3)**: ✅ Conditional rendering (only when `country === 'DE'`) keeps non-DE flows visually unchanged. Source-pointer footer ("Sourced from Pre-Hire Collective Agreement record CA-2024-DE-14") is a good transparency pattern.
- **Idea 4 (Approver Packet Preview, Step 5)**: ⚠️ **Minor density risk**: Step 5 now carries: DisplayCards × 7, ToggleRow (candidate-letter AI disclosure), Approver Packet Preview (new — CollapsibleSection × 4 + Switch), side-effect card, button row. **PASS 4 tweak**: define visual ordering as (1) summary DisplayCards, (2) Approver Packet Preview (sections collapsed by default), (3) existing ToggleRow for candidate-letter AI disclosure, (4) "What happens when you send" side-effects, (5) Send button row. Collapsed-by-default sections keep density in check.

### Design System Validation (Canvas Kit)
- ✅ All Ideas 1–4 components reuse existing Canvas Kit wrappers (`Switch`, `StatusIndicator`, `AlertBanner`, `Avatar`, `FormCheckboxGroup`, `CollapsibleSection`) or pre-existing in-file patterns (`ToggleRow`, `DisplayCard`). No new CK primitives introduced.
- ✅ Citation chips (Idea 4) are the only novel micro-pattern — pill-style `Box` with inline `arrowCornerDownRightIcon` + tooltip. This is acceptable because it's a text-only link decoration pattern and appears in `CanvasAIPersona` guidance.
- ⚠️ **Minor accessibility**: citation chips must be **real focusable `<a>` or `<button>` elements** with accessible names (e.g. `aria-label="Open pay band evidence in a new tab"`), not decorative `<span>` pills. Adding to PASS 4.
- ✅ StatusIndicator used for every status badge (no custom Box chips).
- ✅ Button hierarchy respected: PrimaryButton only on Send (Step 5) and "Add HRBP approval" CTA; everything else SecondaryButton / TertiaryButton.

### Navigation + Completeness
- ✅ All five steps' new surfaces documented in §3. Terminal Sent state unchanged.

### Copy Quality (spot check against Editorial Guidelines)
- ✅ British English: "organisation" / "acknowledgement" / "colour" / "cost centre" used. No US-spelling defects spotted.
- ✅ Contractions: "I'll", "can't", "they've", "you're" throughout agent voice.
- ✅ Specific numbers over "several": QA deck row counts, position-control counts, OOO-day counts.
- ✅ Three-part error pattern applied to Idea 1a HRBP block, Idea 1b OOO-with-no-delegate, Idea 2 QA hard-fail, Idea 4 regulated-tenant override attempt.
- ✅ AI disclosure line on Idea 4 summary is direct, audit-friendly, and includes affordance ("You can tune the tone in chat").

### Experience Principles
- **Empower**: ✅ Every AI-suggested result (overlap rationale, QA verdict, DE card, approver summary) is paired with an override path. The Idea 4 Switch defaults **off** for the regulated-tenant demo — strong Empower signal.
- **Trust**: ✅ Every AI output is evidence-linked: overlap rationale cites the dates; QA checks cite their source in the worksheet; DE card cites the source record; approver summary carries live citation chips. Aligns with `015-sana-style-ui.md` AI transparency rules.
- **Grow**: ✅ Recruiter can delegate, re-route, tune tone, override acknowledgement (where allowed), skip optional approvers. Chat transcript preserves the change history.

### Accessibility
- ✅ Colour + icon pairing on every status (QA deck, approval map, acknowledgement error state).
- ✅ Switch + FormCheckboxGroup both have proper labels.
- ⚠️ **Addressed in PASS 4**: citation chips must be focusable and named.
- ✅ Keyboard flow: Delegate / Ping / Open-in-Writer are real Canvas Kit buttons (tab order preserved).

### Equity & Inclusion
- ✅ Harm-less UX: Comp redaction chip (Idea 4) respects DAP; DE overlay doesn't assume cultural familiarity; OOO copy neither blames nor names personal reasons.
- ✅ Recoverable mistakes: every AI-proposed state is reversible before Send; regulated-tenant override is deliberately non-reversible (correct).

### Globalisation
- ✅ +35% horizontal allowance already specified; DE cards' long strings (e.g. "Metall NRW 2024 (CA-2024-DE-14)") fit the right-pane width.
- ✅ No flag emojis; text country labels only.
- ⚠️ **Minor**: approval map row copy ("held since {relativeTime}", "Out of office until {date}") needs to accommodate long date formats in locales (e.g. Japanese full dates). **PASS 4 tweak**: spec row layout as two-line-allowed on narrow widths — name on line 1, status + microcopy on line 2.

### AI Experience Review
- ✅ Interaction mode explicit: Creating + Reviewing.
- ✅ Stance explicit: Amplify + Empower + Reviewing.
- ✅ Pattern justified with four ruled-out alternatives.
- ✅ Disclosure at three placements (header, inline, footer) + new always-on disclosure on Idea 4 AI summary switch.
- ✅ Error messages three-part throughout.
- ✅ Fallback for Idea 4 defined ("Send without summary").
- ✅ Brand voice consistent with the base brief.
- ✅ 060 legal flag set on Idea 4 (GDPR retention of AI approver-facing text).

---

## PASS 4 — Final Improvements (minor tweaks applied below)

These tweaks are incorporated directly into the brief (no return trip to 315 required):

1. **Step 3 card order (Ideas 1b + 3)** — When `country === 'DE'`, render order is: Country card → **Collective-Agreement card** → **Approval map card (replaces old approver list)** → "+ Add extra approver" affordance. When non-DE: Country card → country overlay banners (Japan/India existing) → **Approval map card** → "+ Add extra approver" affordance.

2. **Step 4 QA deck default visibility (Idea 2)** — Collapsed by default when all checks `pass` (single summary row "6 of 6 passed · expand"); expanded by default when any row is `warn` or `fail`.

3. **Step 5 density + ordering (Idea 4)** — Step 5 top-to-bottom order: (a) summary DisplayCards (candidate / req / location / start date / compensation / approvers / letter template), (b) **new** Approver Packet Preview card with the four CollapsibleSections **collapsed by default** and the Switch **off by default** for the regulated-tenant demo, (c) existing candidate-letter AI-disclosure ToggleRow (renamed helper copy: "AI disclosure on the candidate's copy" to distinguish from the Idea 4 approver-summary switch), (d) "What happens when you send" side-effects card, (e) Send / Save draft / Cancel button row.

4. **Accessibility for citation chips (Idea 4)** — Chips render as `<a>` elements with `aria-label`, visible focus ring, and `target="_blank" rel="noopener"` semantics. In prototype they can be `<button>` with `aria-label="{check label} evidence"` since there's no real evidence URL to open.

5. **Approval-map row layout (Ideas 1b globalisation)** — Two-line-tolerant row: name + role on line 1; status pill + microcopy ("Held since 2 days ago" / "OOO until 8 May · Delegated to Ciara Flaherty") on line 2 when microcopy would otherwise wrap. Buttons ("Delegate" / "Ping") always right-aligned.

---

## Final Verdict: APPROVED

v0.2 Ideas 1–4 addendum is approved for 319 copy review → 320 prototype code update. PASS 4 tweaks above are binding on 320.

