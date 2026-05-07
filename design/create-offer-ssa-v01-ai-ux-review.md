# AI UX review: Create Offer SSA (v01)

**Subject**: [`design/create-offer-ssa-v01.tsx`](create-offer-ssa-v01.tsx) — current state includes the Idea 1–4 enhancements, the cold-start SSA home, the `SsaShell` refactor, and the inline MS Teams Step 6 approver preview.
**Canon**: [`design/references/ai-experience-guidance.md`](references/ai-experience-guidance.md) (Workday Recruiting adaptation of AI Experiences Guidance 2.0 + Canvas AI Experience Guidelines). Also checks [`.cursor/rules/design-specific/016-ssa-canvas-pattern.md`](../.cursor/rules/design-specific/016-ssa-canvas-pattern.md) behavioural contract.
**Reviewer**: `@ux-designer-agent`, 2026-05-01.
**Method**: Walk each section of the AI Experience Guidance against the running prototype + rule adherence + frame evidence. Grades are A–F with justification. Improvements are ranked P0 (blocks a next shippable milestone), P1 (strongly recommended before customer demo), P2 (park or next iteration).

---

## Overall grade: **A− (3.7 / 4.0)**

Strong on Stance, Pattern, Surface, and Disclosure. Middling on Over Time (feedback loops, memory, fallback). One genuine gap: the prototype's AI work is product-led rather than answering the customer signal in the brainstorm hub (see [`docs/offer-flow-ai-customer-ideas.md`](../docs/offer-flow-ai-customer-ideas.md)) — the missing piece is **comp-visibility scope stamping**, which is the strongest customer-signal feature we haven't built.

At a glance:

| Section | Grade | Notes |
|---|---|---|
| §2 Anticipate / Amplify / Empower | A | All three stances mapped cleanly. |
| §3 Interaction Mode | B | Correct mode (Creating + Reviewing) but not explicitly tagged in the prototype header or brief. |
| §4 Phases (Before / During / Over Time) | C+ | Before and During strong; Over Time underbaked. |
| §5 Agent Terminology + Skill Mode | A− | Correct delegate-only framing; no rogue ambient behaviour. |
| §6 Pattern choice | A | Textbook-correct split-pane + task; cold-start added. |
| §7 Surface | A | Workday Web + Workday Everywhere (Teams Step 6) — cross-surface orchestration now explicit. |
| §8 Notifications | B+ | Teams approval card is spot-on; recruiter-side return notification is weak. |
| §9 Errors + Brand Voice | B+ | Out-of-scope reply is three-part; other error paths and fallback not modelled. |
| §10 Experience Principles (Empower / Trust / Grow) | B | Empower + Trust strong; Grow weakest (no learning loop). |
| §12 Review lens (checklist) | B+ | 8 of 11 items passing; 3 items partial or missing. |
| **Overall** | **A−** | Ready for internal demo. Not ready for customer demo without P0 fixes. |

---

## 1. Detailed grades and evidence

### §2 — Anticipate / Amplify / Empower — Grade **A**

**Every AI enhancement maps to at least one stance**:

| Feature | Stance | Evidence |
|---|---|---|
| Idea 1a — Overlap-aware confirmation | Anticipate | Overlap toggle is pre-enabled when the incumbent is still in-seat and the role is time-critical. Pre-answers the "what about Liam?" question before the recruiter asks. |
| Idea 1b — Live approval map | Amplify | Replaces a manual "who held this up?" chase with OOO / held-since / delegate signals inline. |
| Idea 2 — Document QA deck | Empower | Six automated checks (band, currency, template, classification, prose-vs-worksheet diff) that a recruiter could not reliably do unaided. |
| Idea 4 — Approver Packet Preview | Amplify + Empower | Amplifies writing the packet; empowers comp-redaction behaviour that would be intractable without AI. |

**Why not higher**: no features are speculative "AI for AI's sake". Stance discipline is solid.

**Why not "A+"**: the mapping isn't explicit anywhere in the prototype file header or in [`create-offer-ssa-design-brief.md`](create-offer-ssa-design-brief.md)'s visible structure. A reviewer has to reverse-engineer the stance per feature. Add a short stance-map comment block to the prototype header.

---

### §3 — Interaction Mode — Grade **B**

**Primary mode** (per Canvas Mode Families): **Creating** — recruiter is producing an artefact (the offer letter + approval routing).

**Secondary mode**: **Reviewing** — the Review & Send step + the new Teams preview are reviewing-stance surfaces.

**Evidence in prototype**: the step names (*Candidate & requisition → Compensation → Country & approvers → Offer document → Review & send → MS Teams preview*) track Creating → Reviewing cleanly.

**Where it loses a grade**: neither the prototype file header nor the design brief explicitly tags the mode. The AI Guidance §11 Quick Framing Checklist is not filled in anywhere we can find for this prototype.

**Fix**: add the §11 framing block to the top of [`create-offer-ssa-design-brief.md`](create-offer-ssa-design-brief.md) and cite it from the prototype file header. This is a 5-minute change that upgrades this grade to A.

---

### §4 — Phases (Before / During / Over Time) — Grade **C+**

This is the weakest single area. Detail per phase:

#### Before interaction — **B**
- **Disclosure at entry**: yes — neutral italic footer *"This content was generated by AI. Review before use."* on both cold-start and in-task composers. Not a Canvas Kit `Banner` (015 compliant).
- **Capability expectations**: partial — the cold-start capability line *"I can help answer general policy questions and help get things done."* is generic. It doesn't tell the user what the agent *can* do versus what it *can't*. Compare Canvas guidance: *"HiredScore ranks candidates by historical hire likelihood — it does not decide who to advance."*
- **Entry-point choice**: strong — no ambient surprises, user always triggers.

**Fix**: tighten the cold-start capability line to be specific about capability scope in this prototype. Example: *"I can help you create offers, open requisitions, or transfer positions. I can't answer time-off or performance questions in this prototype — use the relevant Workday page for those."*

#### During interaction — **A−**
- **User control and interruptibility**: strong — the chat can edit any field, the user can jump steps via the stepper, every AI-generated surface has a manual override (tone switcher, AI-summary toggle, edit in form).
- **Transparency of reasoning**: strong — QA deck shows specific pass/warn messages ("€95,000 is inside the Senior PM IE — Band 4 range"); approver packet carries citations with tooltips to source data; band-check includes numeric rationale.
- **Error recovery**: partial — only the out-of-scope intent replies use the three-part structure. Other error paths (e.g., what if the country switch to DE fails; what if comp is outside band) use inline validation copy that's not consistently three-part.

**Fix**: harmonise error copy across intent-handler mutations. When an intent can't complete cleanly, reply three-part. See §9 detail below.

#### Over time — **C**
This is the material gap.

- **Feedback loops**: missing. The AI summary tone switcher (`shorter` / `formal` / `plain`) does not ask for thumbs up/down, does not save user preference, does not say "I'll remember this for Priya next time".
- **Memory and drift disclosure**: missing. The prototype never tells the user what the agent will or won't remember.
- **Opt-out / off-switch**: partial — `includeAiApproverSummary` toggles the approver-packet AI summary; `tenantAllowsAiApproverSummary` models tenant-level disabling. But there's no finer-grained "always off for this req" or "always off for this approver" toggle, and no global AI-off affordance.

**Fix**: see P0 and P1 below. This is the single biggest upgrade opportunity.

---

### §5 — Agent Terminology + Skill Mode — Grade **A−**

- **Understands / Thinks / Acts / Learns**: first three used via chat narration ("I've identified…", "I've enabled the overlap toggle", "I've flagged one item worth a look"). Learns: not used — reasonable because the prototype doesn't actually learn.
- **Skill Mode**: **User-Triggered (Delegate)** throughout. Every AI action is initiated by the user (send a chat, click a starter prompt, click a step-specific button). No ambient surprises.
- **Consistency**: the tone is consistent across the whole flow — the agent speaks in first person, uses contractions, acknowledges uncertainty ("Worth a look — start date is payroll-safe, but…").

**Why not A**: there are a couple of places where the agent asserts ("I've enabled the overlap toggle by default") without offering the alternative ("Or I can turn it off — tell me") — this crosses from Delegate into quasi-ambient. Explicit opt-out affordances inline would close this gap.

---

### §6 — Pattern choice — Grade **A**

**Pattern**: **Split-pane Agent + Task** — correct per the guidance decision tree (high-consequence multi-step transaction with commit gate).

**Cold-start addition**: the new SSA cold-start home is the canonical product-specific expression of Split-pane (see §6 SSA subsection in the guidance doc). Fully compliant with [`016-ssa-canvas-pattern.md`](../.cursor/rules/design-specific/016-ssa-canvas-pattern.md) behavioural contract:

| Rule 016 contract item | Prototype behaviour | Pass? |
|---|---|---|
| Boot in cold-start mode | `mode` default is `'cold-start'` | ✓ |
| Consume `SsaShell` primitives | Yes — `SsaShell`, `SsaStarterSuggestions`, `SparkleMark` all from `design/components` | ✓ |
| Optional outer nav rail handled by shell composition (not mandatory for SSA) | Pass — split-pane behavior remains correct without relying on rail policy | ✓ |
| Intent handler returns `enterTaskMode: true` | Yes, `processUserIntent` reply carries `enterTaskMode` | ✓ |
| Chat history survives transition | Yes, messages array is preserved | ✓ |
| Irreversible commit on canvas only | Yes, `onSend` lives on the `ReviewAndSendStep`, not in chat | ✓ |
| Chat changes write through to canvas | Yes, country/tone/overlap all mutate canvas state | ✓ |
| Review dot on changed non-current steps | Yes (`changedSinceVisited` → ChipStepper) | ✓ |
| Out-of-scope = three-part decline | Yes (`processUserIntent` cold-start mode handler) | ✓ |
| No Canvas Kit `Banner` for AI disclosure | Yes, neutral italic `BodyText` line | ✓ |

All 10 contract items pass.

**Ruled-out patterns** (good practice per §12 of the guidance — the review lens asks for this):
- Full-Screen Chat — ruled out because the offer has structured validation (pay-band, country overlay, approval chain) that must be visible next to the conversation.
- Partial Panel Chat — ruled out because the offer is a high-consequence commit, not an in-context Q&A.
- Content Generation only (popover) — ruled out because the offer spans multiple dependent fields that can't be captured in a single generation popover.

**Fix**: add the ruled-out-patterns block to the prototype file header. Currently a reviewer has to infer. This is a 2-minute change.

---

### §7 — Surface — Grade **A**

- **Primary surface**: Workday Web. Correct for a recruiter creating a regulated offer.
- **Secondary surface**: Workday Everywhere (Microsoft Teams) via the new Step 6 approver preview. Correct per the §7 User × Surface matrix (Hiring Manager / Reviewing → Everywhere / Teams).
- **Cross-surface orchestration**: explicit in-demo. The recruiter stays in Workday Web, the approver receives the request in Teams, and the Workday TA Agent is the bot in the Teams thread. This is the exact pattern promoted in §15.1 Talent Acquisition demo ("cross-surface orchestration should be designed explicitly, not treated as accidental handoff").

**Why not higher**: the Teams preview is currently a *preview* of what the approver would see — the recruiter can click Approve in the mock to complete the demo. In a shippable version, this surface would actually route the card to the approver's Teams and wait. Acceptable for a prototype.

---

### §8 — Notifications — Grade **B+**

The Teams Adaptive Card in Step 6 is evaluated as a notification surface:

| Guidance check | Prototype behaviour | Pass? |
|---|---|---|
| Inbox taxonomy (Tasks vs Notifications vs Conversations) | Correct — it's in `Chat` (My Conversations) with a pinned thread + unread badge. | ✓ |
| Channel: Slack/Teams tone (casual, conversational, inline actions) | Yes — the bot message is short, greets with `@Amanda` mention, uses Adaptive Card with inline "Approve offer" and "Request changes" buttons. | ✓ |
| Awareness vs action | Explicit — header labels as "Offer · Approval request". Tone is action. | ✓ |
| CTA quality | Binary commit (Approve / Request changes) + "View in Workday" secondary link. Matches §8 table (Slack/Teams row: "Inline action buttons (Approve / Skip)"). | ✓ |
| Recruiter-side return notification | **Missing.** After the approver clicks Approve, the recruiter sees a chat message in the SSA and a Success state on the canvas — but there's no modelled inbox item or push notification saying "Aoife approved offer WD-OFR-…". | Partial |

**Fix (P1)**: model a recruiter-side inbox notification in the SuccessState card ("An inbox notification has been posted to your bell" — mock it visually as a small chip saying *My Tasks / My Notifications*).

---

### §9 — Errors + Brand Voice — Grade **B+**

**Three-part error structure**: present for the out-of-scope cold-start intent reply. Other error states don't consistently follow the pattern.

Checked paths:

| Error path | Three-part? | Example copy |
|---|---|---|
| Out-of-scope cold-start prompt | ✓ | *"This prototype is scoped to the offer flow. Try 'Create an offer for a candidate' to see the Self-Service Agent open a task canvas on the right."* |
| Base salary outside band (not modelled as an error state yet) | N/A | — |
| DE collective-agreement not acknowledged | ✗ | Disables Continue with a helper line *"Continue is locked until you tick the collective-agreement acknowledgement above."* — single-line, no three-part. |
| Review-and-send blocked (open QA warning / missing approver) | ✗ | Disables Send with a helper line *"Send is locked until you resolve the items above."* — single-line, no three-part. |
| AI summary disabled (tenant-level) | ✗ | The Idea-4 packet shows a disabled Switch + helper text. Not three-part. |

**Fallback message** (AI unavailable / low confidence): **missing**. The AI summary section has no "I couldn't summarise this right now — here's the raw data instead" fallback.

**Brand voice** (§9 DO / DON'T):
- ✓ Contractions, first-person, specific numbers, acknowledges uncertainty, British English.
- ✓ No error codes, no repeated apology.
- ✓ Candidate-facing AI disclosure on the offer letter (marked as TODO[060] pending legal sign-off — this is correct process).

**Fix (P1)**: harmonise error copy. Specifically:
- Replace the "Continue is locked…" and "Send is locked…" helper lines with three-part blocks.
- Add a fallback state for the AI summary ("I can't generate a packet summary right now. You can read the raw packet below, or try again in a moment.").

---

### §10 — Experience Principles (Empower / Trust / Grow) — Grade **B**

Cross-walked against [`docs/experience-principles.md`](../docs/experience-principles.md):

- **Empower**: strong. Recruiter can complete a 5-step offer in a single surface; AI does the heavy lifting on QA + packet.
- **Trust**: strong. Every AI claim is cited (QA evidence links, packet citations); comp-redaction is visible; tenant-level disable is modelled; AI disclosure is present; no Banner misuse.
- **Grow**: weakest. The recruiter doesn't visibly gain capability over time. No feedback loop, no memory, no "you've done this 20 times — want me to pre-fill more?" affordance. For a prototype this is fine; for a shippable it's a gap.

**Fix (P2)**: add a "Grow" affordance to the SuccessState. Example copy: *"Want me to use Aoife's preferred approval style next time? Yes / No"*. This takes us from A-pattern to A-pattern-with-learning.

---

### §12 — Review lens (canonical checklist) — Grade **B+**

| Checklist item | Status | Evidence |
|---|---|---|
| Interaction Mode explicitly tagged | Partial | Mode is *inferable* as Creating + Reviewing; not tagged in prototype header or brief. |
| All 3 phases addressed (or omission justified) | Partial | Before + During yes; Over Time mostly missing and not justified. |
| Pattern justified via decision tree | Pass | Matches §6 decision tree, SSA subsection. |
| Ruled-out pattern cited with reason | Fail | Not visible in prototype or brief. |
| Surface matches where the user does the job | Pass | Web for recruiter + Teams for HM. |
| Disclosure copy at right location | Pass | Footer italic, both modes. |
| Three-part error structure | Partial | Only out-of-scope path. |
| Fallback for AI unavailable / low confidence | Fail | Not modelled. |
| Brand voice compliance | Pass | Contractions, first-person, specific, no error codes. |
| Ambient opt-out affordance present | N/A | No ambient features. |
| 060 legal review invoked | Partial | `TODO[060]` in file header for candidate AI disclosure; nothing yet on AI summary disclosure to approvers. |

**Score**: 8 × pass + 3 × partial + 2 × fail / 11 items → **B+**.

---

## 2. Improvements — P0 / P1 / P2

### P0 — do before customer demo

**P0-1. Add Over Time affordances to the AI summary tone switcher.**
- **What**: Add `👍` / `👎` on the AI summary card. Thumbs up → persist the tone choice ("Shorter tone locked in for approvers in IE"). Thumbs down → offer three alternatives and open a free-text "tell me what was wrong" prompt.
- **Why**: closes the Grow + Over Time gap; maps to the Canvas AI Persona's "feedback visibly changes future behaviour" guidance.
- **Where**: `approverPacketSections` render block in `create-offer-ssa-v01.tsx`.
- **Copy**: *"Remember 'shorter' for IE approvers next time? Yes / No."*

**P0-2. Add a fallback state for AI summary unavailable.**
- **What**: When `includeAiApproverSummary` is on but the summary can't generate (simulate a `AI_UNAVAILABLE` flag), show a three-part fallback block.
- **Why**: §9 non-negotiable; closes the B+ → A gap on error handling.
- **Copy**: *"I can't generate a packet summary right now. / The summarising service isn't reachable. / Read the raw packet below, or try again in a moment."*

**P0-3. Add comp-visibility scope stamps to every comp surface.**
- **What**: On the Compensation card, the Review card, and the Approver Packet, add a small inline badge reading *"Visible because [role] is active on [req]. Access revokes when candidacy ends."*
- **Why**: this is the **only** Offer feature with strong, direct customer-signal endorsement (idea 743218–743224 in [`docs/offer-flow-ai-customer-ideas.md`](../docs/offer-flow-ai-customer-ideas.md)). Without it, the AI layer sits on an untrusted comp-visibility foundation.
- **Where**: `CompensationStep`, `ReviewAndSendStep`, approver-packet section renderer.

**P0-4. Specific capability expectations on the cold-start.**
- **What**: Replace the generic *"I can help answer general policy questions and help get things done."* with a scope-specific line.
- **Copy**: *"I can help you create offers, open requisitions, or transfer positions. For time-off, performance, or learning tasks, use the relevant Workday page — I'll route you there."*
- **Why**: closes the §4 Before-interaction capability-expectations gap.

### P1 — strongly recommended before next customer demo

**P1-1. Add the §11 Quick Framing Checklist to the design brief header.**
- **What**: fill in the 10-line block (mode, phases, stance, pattern, surface, disclosure, fallback, error pattern) in [`create-offer-ssa-design-brief.md`](create-offer-ssa-design-brief.md).
- **Why**: makes 318 peer review scannable; upgrades §3 grade from B to A.

**P1-2. Add a ruled-out-patterns block to the prototype file header.**
- **What**: 3-line comment listing Full-Screen Chat, Partial Panel Chat, and Content Generation (popover) as ruled-out, with one-line reasons.
- **Why**: §12 checklist item; 2-minute change.

**P1-3. Harmonise error copy.**
- **What**: replace "Continue is locked…" and "Send is locked…" single-line helpers with three-part blocks. Same for any intent-handler error reply.
- **Why**: consistency with §9; completes the §12 three-part-error item.

**P1-4. Recruiter-side return notification from the Teams approval.**
- **What**: after the approver clicks Approve in the Teams mock, show a small chip or toast in the Success canvas reading *"Inbox notification posted: Offer WD-OFR-… approved by Aoife."* — visually mocks the bell + My Notifications routing.
- **Why**: closes the §8 cross-surface-orchestration notification loop.

**P1-5. Memory and drift disclosure on the AI summary.**
- **What**: micro-copy under the tone switcher: *"I remember tone per approver in this prototype. I don't remember across sessions."*
- **Why**: closes the §4 Over Time memory gap; is also a 060 legal-friendly honesty statement.

### P2 — park / next iteration

- **P2-1. Per-approver-per-relationship comp-redaction previews.** Ties to customer idea 743219. Let the recruiter tab between what each approver will see in the AI summary. Large scope; defer.
- **P2-2. Grow affordance in SuccessState.** *"Save Aoife's preferred approval style for future offers?"* Yes/No. Minor; defer.
- **P2-3. Global + per-req AI opt-out toggle.** Important for ambient features; not urgent here because all AI is delegate.
- **P2-4. Pay-equity peers in-context on the Compensation step.** Strong customer signal adjacent; would need real pay-equity API — park until API feasibility (task 3) confirms availability.
- **P2-5. Counter-offer modelling / rescind-risk.** No customer signal in the brainstorm dump (§4 of `docs/offer-flow-ai-customer-ideas.md`). Keep off the roadmap.

---

## 3. What to hand back to the other agents

- **319 (copy review)**: please apply P0-2, P0-4, P1-3, P1-5 — these are all copy-only changes.
- **321 (visual review)**: please re-grade the cold-start + split-pane + Teams-preview after P0-3 comp-visibility badges land.
- **318 (peer review)**: please confirm P1-1 (framing checklist) is present on next pass.
- **060 (legal)**: invoke for (a) AI summary disclosure to approvers, and (b) the "remember per-approver" affordance in P0-1 — implicit learning + stored preference is a consent surface.
- **@ux-designer-agent** (self): re-run this grade after the P0s land; target grade **A+ (4.0 / 4.0)**.
- **@pm (human)**: decide on P1-2 (ruled-out block) and P1-4 (return notification) scope before the next demo slot. P0 items are not optional.

---

## 4. Evidence trail

- **Prototype**: [`design/create-offer-ssa-v01.tsx`](create-offer-ssa-v01.tsx) — 3,200 lines, with cold-start + split-pane flow + Teams Step 6.
- **Canon**: [`design/references/ai-experience-guidance.md`](references/ai-experience-guidance.md) — v1.2 May 2026.
- **Behavioural contract**: [`.cursor/rules/design-specific/016-ssa-canvas-pattern.md`](../.cursor/rules/design-specific/016-ssa-canvas-pattern.md).
- **Customer signal source**: [`docs/offer-flow-ai-customer-ideas.md`](../docs/offer-flow-ai-customer-ideas.md) (task-4 output from this pass).
- **Reference frames**: `design/references/ssa-create-req-videos/frames-overlap/ov-1800.png` (cold-start), `ov-2700.png` (split-pane + Teams surface), `ov-9900.png` (success).
- **Design brief**: [`design/create-offer-ssa-design-brief.md`](create-offer-ssa-design-brief.md) — will receive P1-1 checklist block as part of the P0+P1 remediation pass.

---

## 5. Revision history

- **v1.0 (2026-05-01)** — initial AI UX grade pass. Applied as part of the 6-task recruiting-prototypes-expansion plan.
