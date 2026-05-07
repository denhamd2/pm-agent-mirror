# AI Experience Guidance (Workday Recruiting)

**Source**: Adapted from Workday's AI Experiences Guidance 2.0 (internal playbook, January 2026 — Owen Derby, Patrick Neeman, Anna Atiagina, Mia Donnell, Keta Patel et al.) and the Canvas Design System AI Experience Guidelines (February 2024+, Owen Derby). Re-contextualised for Workday Recruiting prototype and PRD work.

**Scope**: Read by [`315-design-brief-creation.mdc`](../../.cursor/rules/315-design-brief-creation.mdc) (PASS 1 step 10 — AI Experience Framing; PASS 2 step 7 Conversational Assistant copy), [`318-design-peer-reviewer.mdc`](../../.cursor/rules/318-design-peer-reviewer.mdc) (AI Experience Review lens), [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) (AI-Specific Copy Guidance), and [`320-prototype-developer.mdc`](../../.cursor/rules/320-prototype-developer.mdc) (pre-flight pattern lookup). Also cited by [`015-sana-style-ui.md`](../../.cursor/rules/design-specific/015-sana-style-ui.md) (GenUI / A2UI). **Product-specific SSA patterns** (split-pane agent + task, from PM demo keyframes): [`ssa-create-req-flow-best-practices.md`](ssa-create-req-flow-best-practices.md) — use with this doc, not instead of Canvas canon.

**How to use**:
- 315 PASS 1 → pick an **Interaction Mode** (section 3) and name the **Phase(s)** you are designing for (section 4), then use the pattern catalog (section 6) to select a pattern.
- 315 PASS 2 → use the **AI Error Structure** (section 9) and **Ask Workday Brand Voice** (section 9) when drafting Conversational Assistant copy.
- 318 → verify a mode is tagged, all three phases are considered, and the pattern/surface/disclosure/error choices are justified (section 12).
- 319 → apply the AI-Specific Copy Guidance (section 9) and link to live Canvas AI Persona.
- 320 → reference the pattern catalog to confirm which Canvas Kit / Sana components implement the chosen pattern.
- **SSA-style split-pane** (Self-Service Agent: chat + structured task) → see [`ssa-create-req-flow-best-practices.md`](ssa-create-req-flow-best-practices.md) (product demo keyframes; `visual-only; narration TBC` until PM annotates).

---

## 1. Authoritative sources (live links — fetch for canonical text)

Workday's canonical AI guidance lives on Canvas and evolves. Link to it; don't mirror it.

| Source | URL |
|---|---|
| Canvas — AI Experience Guidelines (the 12 principles) | https://canvas.workdaydesign.com/guidelines/ai-guidance/ai-experience-guidelines |
| Canvas — AI Elements (UI building blocks) | https://canvas.workdaydesign.com/guidelines/ai-guidance/ai-elements |
| Canvas — AI Persona (Ask Workday Brand Voice) | https://canvas.workdaydesign.com/guidelines/ai-guidance/ai-persona |
| Canvas — Interaction Modes (overview) | https://canvas.workdaydesign.com/guidelines/interaction-modes/overview |
| Canvas — Interaction Modes (mode families) | https://canvas.workdaydesign.com/guidelines/interaction-modes/mode-families |
| Medium backgrounder — Owen Derby, *Building trust in AI with Human Centered Design Guidelines* | https://medium.com/workday-engineering/building-trust-in-ai-with-human-centred-design-guidelines-93849e2060ff |
| Internal PDF — AI Experiences Guidance 2.0 (local, if available) | `/Users/david.denham/Downloads/AI Experiences Guidance 2.0.pdf` |
| Internal PDF — AI Acrobatics (local, if available) | `/Users/david.denham/Downloads/V1.0 AI Acrobatics - Build Your Own AI-Powered UX Workflows.pdf` |

**Operating rule**: when a brief needs the canonical text of a specific principle, UI element, or persona rule, **WebFetch the Canvas URL** rather than quoting from this doc. This doc carries Recruiting-specific callouts and cross-references only.

---

## 2. AI Experience Framing (Anticipate / Amplify / Empower)

Three stances Workday AI should take. Use them to check that an AI feature is doing meaningful work for the user, not "AI for AI's sake".

- **Anticipate** — surface what the user will likely need next (e.g., *suggested candidates based on requisition context*).
- **Amplify** — make an existing action faster or better (e.g., *draft an outreach email the recruiter can edit and send*).
- **Empower** — unlock something the user could not previously do (e.g., *summarise 80 page-long reference checks into a one-page shortlist rationale*).

Every Recruiting AI feature in the Design Brief should map to at least one stance. If it maps to none, cut it.

---

## 3. Interaction Modes (upstream of pattern choice)

Canvas treats **Interaction Modes** as canonical *user-mindset tags*. They describe how the user is engaging with the product at this moment, not what they're building. **Pick the mode before you pick the pattern** — mode informs which patterns and surfaces fit, and it's the signal AI-generated UI (GenUI / A2UI) uses to decide what to render.

### Cognitive Modes (focused on sensemaking and comprehension)

| Mode | User mindset | Recruiting example |
|---|---|---|
| **Analyzing** | Breaking data into parts to find insight | Talent Pool Insights dashboard — *which sources produced the highest-quality hires?* |
| **Reviewing** | Reflecting back to confirm or assess quality | Candidate shortlist review — *does the top 5 hold up?* |
| **Monitoring** | Keeping an eye on changes over time | Requisition health — *which reqs are stalled past SLA?* |

### Task-Oriented Modes (focused on execution and completion)

| Mode | User mindset | Recruiting example |
|---|---|---|
| **Configuring** | Setting up structure once so others can use it | Interview Kit setup, scorecards, offer templates |
| **Creating** | Producing an artefact | Drafting a job posting, composing candidate outreach |

**Notes**:
- Canvas's Mode Families page includes additional modes (e.g., *Deciding*, *Coordinating*, *Learning*) — WebFetch for the current list.
- A single Recruiting screen can span more than one mode (e.g., *All Candidates* view supports **Reviewing** + **Analyzing** + **Creating-from-template**). The Design Brief must pick a **primary** mode and acknowledge the secondary modes.
- For **Candidate-facing** flows (career site, apply chat), the mode is usually **Creating** (building an application) or **Reviewing** (checking status).

---

## 4. The canonical spine: 12 guidelines across 3 phases

Workday's AI Experience Guidelines are organised into 12 principles across three temporal phases (Owen Derby, Feb 2024). The full text of each principle lives on the Canvas page (see section 1) — WebFetch for the canonical copy. This doc captures Recruiting-specific callouts anchored to each phase.

### Phase 1 — Before Interaction

*Guidance for the user's first contact with the AI feature.*

Recruiting callouts:
- **Disclosure at entry**: every AI entry point (button, chat prompt, embedded suggestion) must say what is automated. Use a short automation notice, not a wall of legalese.
- **Capability expectations**: tell the user *what the AI can and cannot do for them* on this screen. For HiredScore: "HiredScore ranks candidates by historical hire likelihood — it does not decide who to advance." For Paradox apply: "The assistant will collect your application details and pass them to the recruiter — a human reviews every application."
- **Entry-point choice**: avoid surprising the user — ambient agents should announce themselves before they act (see section 5).

### Phase 2 — During Interaction

*Guidance for the user while the AI is doing something.*

Recruiting callouts:
- **User control and interruptibility**: the user can always stop, edit, or override. A Paradox chat must offer "talk to a human recruiter" within two turns of a complex question. A drafted outreach email must open in an editable composer, never auto-send.
- **Transparency of reasoning**: show the signal, not just the answer. *"Top match because: 8 years relevant experience, 3 shared skills, UK location."* Avoid unexplained confidence scores.
- **Error recovery**: every AI error follows the three-part structure in section 9. Never drop the user into a dead end.

### Phase 3 — Over Time

*Guidance for the user as they continue using the AI feature.*

Recruiting callouts:
- **Feedback loops**: the user can correct, thumbs-up/thumbs-down, or flag a result. Corrections should visibly change future behaviour, not vanish into a backend.
- **Memory and drift**: be clear about what the agent remembers (e.g., "I'll remember your preferred tone for outreach") and what it does not (e.g., "I don't remember individual candidate feedback between sessions unless you save a note").
- **Opt-out and off-switch**: the user can turn ambient features off. For recruiters, an "always off for this req" toggle matters more than a global off-switch.

---

## 5. Agent Terminology

Standard vocabulary Workday uses to describe what an agent does. Use these verbs in PRDs and briefs rather than inventing new ones.

- **Understands** — interprets the user's input or context.
- **Thinks** — reasons, plans, decides.
- **Acts** — takes a concrete action (drafts, sends, schedules, ranks).
- **Learns** — adapts from feedback or outcomes over time.

### Skill Modes

- **User-Triggered (Delegate)** — the user explicitly asks the agent to do something. *Ask Workday Recruiter*, *Draft outreach for this candidate*, manual "Generate job description" button.
- **System-Triggered (Ambient)** — the agent acts on its own, surfacing results or suggestions without being asked. *Candidate Sourcing Agent*, *Compliance monitoring*, "auto-advance past Offer Extended stage after 7 days of inactivity".

**Recruiting reality**: most Workday Recruiting AI today is **Delegate**. Ambient is powerful but requires much stronger disclosure, trust, and opt-out affordances (section 4, Phase 1 and Phase 3).

---

## 6. AI Pattern Catalog (decision tree)

Use this to select the UI pattern for a **During Interaction** AI feature, filtered by the Interaction Mode chosen in section 3.

| Pattern | Why it works | When to use | When NOT to use | Typical Interaction Modes | Example |
|---|---|---|---|---|---|
| **Embedded Content** (cards, list, multi) | Keeps insight in-place where decisions already happen; low context-switch cost. | AI output is the primary content of a region. | User needs guided multi-step commit flow or long conversational clarification. | Reviewing, Analyzing, Monitoring | HiredScore ranked list in Job Req Detail; Talent Pool Insights cards |
| **Contextual Ingress** (quick-tip, suggested prompt, pop-up) | Adds acceleration without hijacking the existing workflow. | Offer an AI shortcut in-flow without taking over the screen. | Task needs audit trail, staged validation, or many dependent fields. | Creating, Configuring | "Suggest a job description from this template" quick-tip on the req creation form |
| **Content Generation** (popover, modal, content loader) | Separates generation from commitment; supports review-before-apply. | User asks AI to produce an artefact and wants visible progress and revision. | Task is read-only analytics or policy Q&A where no generated artefact exists. | Creating | "Draft outreach" opens a popover composer with AI draft + Edit / Send / Discard |
| **Partial Panel Chat** (Ask Workday in-context) | Preserves page context while enabling iterative refinement and Q&A. | User needs a conversational helper *without* leaving the page. | The task is transactional and requires persistent structured right-pane confirmation. | Reviewing, Analyzing, Creating | Right-side chat rail on Candidate Profile answering *"summarise interview feedback"* |
| **Full-Screen Chat** (immersive workflow) | Best for conversation-first journeys where chat is the whole job. | Entire task is conversational (candidate apply, guided 1:1 assistant session). | User must keep system-of-record grid/form visible while making regulated decisions. | Creating (candidate), Reviewing (recruiter 1:1 chat) | Candidate apply chat; full-page Ask Workday Recruiter session |
| **Split-pane Agent + Task** (conversational + structured transaction) | Balances Empower and Trust: chat captures intent/rationale; task pane enforces validation, disambiguation, and commit safety. | Multi-step, high-consequence workflows: regulated fields, irreversible commits, people disambiguation, policy/date constraints. | Single-field edits, pure informational lookups, ambient background nudges. | Creating, Reviewing, Configuring | SSA overlap/transfer-style flows and recruiter pre-screening + scheduling flows |

### Pattern decision guide (job shape -> pattern -> anti-pattern)

| Job shape | Recommended pattern | Anti-pattern to avoid |
|---|---|---|
| Read-only insight / score review | Embedded Content | Launching full-screen chat for static analysis |
| Quick assist inside existing form | Contextual Ingress | Forcing user into separate assistant workspace |
| Drafting outbound artefact (email, JD, summary) | Content Generation | Auto-applying generated content with no review state |
| In-page clarification while reviewing profile/list | Partial Panel Chat | Replacing core grid/profile with chat-only transcript |
| Candidate conversational journey (apply / status) | Full-Screen Chat | Fragmenting into many tiny modals and sidebars |
| Regulated or multi-step transaction with commit gate | Split-pane Agent + Task | Chat-only flow with hidden state and no structured confirmation |

### Cross-pattern principles learned from Recruiting demos

- **Explain defaults**: smart defaults (e.g. overlap/date suggestions) must include plain-language rationale and visible override.
- **Write-through visibility**: NL instructions must visibly update form fields/tables/chips; never keep consequential state chat-only.
- **Explain-and-revert**: when system rules correct user input, show before/after and provide an easy correction path.
- **Dual-pane completion**: for transactional flows, confirm outcomes in both conversation and structured panel.
- **Traceability and side effects**: terminal states include IDs plus downstream impacts (who is notified, what changed next).
- **Post-terminal continuity**: after success, provide clear next-action prompts instead of ending in a dead state.

### Which pattern for which Recruiting scenario

| Recruiting scenario | Recommended pattern | Why |
|---|---|---|
| Candidate outreach drafting | Content Generation | Needs draft-quality generation, human editing, and explicit send decision. |
| Interview scheduling with panel conflicts | Split-pane Agent + Task | Requires conversational negotiation plus structured availability/commit controls. |
| Offer approval and open requisition workflow | Split-pane Agent + Task | High-consequence workflow with dependent fields and audit-friendly confirmation. |
| Requisition creation from profile template | Contextual Ingress -> Split-pane Agent + Task | Start lightweight in-form, escalate to split-pane when constraints/approvals appear. |
| Policy Q&A (e.g., relocation, purge, compliance lookup) | Partial Panel Chat or Embedded Content | Mostly informational; avoid heavy transactional shell unless user starts acting. |

**Decision tree (simplified)**:

1. Is the AI output the primary content of the region? -> **Embedded Content**.
2. Is it a shortcut/offer inside an existing flow? -> **Contextual Ingress**.
3. Does the user need to see the AI *produce* an artefact (text, doc, email)? -> **Content Generation**.
4. Is it conversational and adjunct to the page? -> **Partial Panel Chat**.
5. Is it conversational and the whole experience? -> **Full-Screen Chat**.
6. Is it a high-consequence, multi-step transaction with validation/commit? -> **Split-pane Agent + Task**.

**Anti-pattern**: defaulting every AI feature to "just add a chat panel". Chat is the fallback, not the first choice. If the user's mode is Analyzing or Monitoring, chat is usually the wrong pattern.

### SSA split-pane transactions (Self-Service Agent canvas pattern)

The **Split-pane Agent + Task** row above is a generic pattern. The canonical Workday expression of it for **named agent surfaces** (Self-Service Agent, Create Offer SSA, Create Job Req SSA, Transfer Position SSA, etc.) adds one extra behavioural layer: a **cold-start home** that precedes the split-pane.

The full shape is:

1. **Cold-start** — the SSA boots into a generic centred chat home. No canvas on the right. The user can ask any policy question or start any transaction. See reference frame `ssa-create-req-videos/frames-overlap/ov-1800.png`.
2. **Intent trigger** — when the user's message (or starter-suggestion pick) matches a canvas-triggering intent (e.g. *"create an offer for Sarah Chen"*, *"help me backfill this role"*), the agent responds with a contextualising opener and the layout flips to split-pane. Chat history survives. See reference frame `ov-2700.png`.
3. **In-task split-pane** — chat stays on the left (520px), canvas on the right (flex). Chat narrates and writes-through; canvas owns validation + commit. See reference frame `ov-9900.png`.
4. **Commit gate** — Send / Post / Approve lives on the canvas review step, never in a chat reply. Chat may propose the commit; only the canvas can execute it.

**Why the cold-start matters.** It proves the *genericness* of the agent (the same SSA that can answer a policy question is the one that can draft an offer) and lets the Gen UI value prop — "the right pane is generated from the agent's intent" — show up as a discrete moment. Without the cold-start, the prototype looks like a dedicated wizard with a chat rail, which undersells the architecture.

**Contract for SSA prototypes.** Cold-start is mandatory, chat history must survive the transition, irreversible commits stay on the canvas, and out-of-scope prompts get a three-part honest decline (problem / reason / next step). Full behavioural contract and mandatory components: [`016-ssa-canvas-pattern.md`](../../.cursor/rules/design-specific/016-ssa-canvas-pattern.md). Worked example: [`create-offer-ssa-v01.tsx`](../create-offer-ssa-v01.tsx). Evidence: [`ssa-create-req-flow-best-practices.md`](ssa-create-req-flow-best-practices.md).

### Canvas Kit / Sana component mapping

| Pattern | Workspace components |
|---|---|
| Embedded Content | Canvas Kit `Card` + `StatusIndicator`; `GenUIPatterns.CandidateActionCard`, `CandidateGrid`, `ChartCard` via `A2UIRenderer` |
| Contextual Ingress | Canvas Kit `Banner`, tooltip, `PrimaryButton` inline suggestion (no ad-hoc chips) |
| Content Generation | Canvas Kit `Modal` + `RichTextEditor` / `EmailComposer` (see `communication-patterns.md`) |
| Partial Panel Chat | `SanaCommMessageBubble` + `SanaCommComposer` inside `CommunicationDock` (see `015-sana-style-ui.md`) |
| Full-Screen Chat | Same `SanaComm*` stack in a wide container (`maxWidth: '100%'`, fixed viewport height, scrolling inner area) |

---

## 7. Surface Selection (Workday Web / Everywhere / Mobile / Sana Labs)

Where the AI surfaces. Pick the surface based on where the user actually does the job, not where it's easiest to build.

| Surface | When to use | Recruiting examples |
|---|---|---|
| **Workday Web** | Primary recruiter / HR Pro work | Ask Workday Recruiter, HiredScore grids, candidate profile summarisation |
| **Workday Everywhere** (Slack, Teams, Agentforce, Agentspace) | The user lives in a hub app, not Workday | Hiring manager approvals in Slack/Teams; "status of req" notifications |
| **Mobile** | Time-critical, location-independent tasks | Candidate-facing apply chat; hiring manager interview feedback on the go |
| **Sana Labs** | Experimental / conversational search | Future Workday Assistant with cross-tenant knowledge — out of scope for most Recruiting features today |

### Interaction-Mode × User-Type matrix

Extends the RAD matrix (HR Pro / Manager / Worker / Frontline) with **Candidate** — a first-class Recruiting user type that the canonical doc doesn't cover.

| Mode ↓ / User → | HR Pro (recruiter) | Hiring Manager | Frontline Manager | Worker | **Candidate (external)** |
|---|---|---|---|---|---|
| Analyzing | Workday Web | Workday Web / Everywhere | Mobile / Everywhere | Workday Web | — (not analysing internally) |
| Reviewing | Workday Web | Everywhere (Slack/Teams) | Mobile | Workday Web | Mobile web / chat ("status of my application") |
| Monitoring | Workday Web (dashboard) | Everywhere (push) | Mobile (push) | Workday Web | — |
| Configuring | Workday Web | Workday Web | — | — | — |
| Creating | Workday Web (job draft, outreach) | Workday Web (interview feedback) | Mobile (quick notes) | Workday Web | Full-Screen Chat (apply), Mobile |

---

## 8. Notifications (routing, tone, CTA)

Notifications belong to **Phase 3 — Over Time**. Bad notifications destroy trust in AI faster than any other thing.

### Inbox taxonomy

- **My Tasks** — something the user must do. Actionable, has a clear CTA, blocks progress if ignored.
- **My Notifications** — something the user should know. Informational, no CTA required, can be dismissed.
- **My Conversations** — ongoing thread with an agent or human (Paradox, Ask Workday). Chat-style, persistent.

### Channel routing

| Channel | When to use | Tone | Typical CTA |
|---|---|---|---|
| **Push** (mobile / web) | Time-critical, user benefits from immediate awareness | Brief, neutral | "Review now" / deep link |
| **In-app** (bell) | Standard async update | Neutral, specific | Link into the object |
| **Email** | Durable, formal, needs a trail | Professional, full context | Link + summary |
| **SMS / WhatsApp** | Candidate-facing, high open-rate, short | Short, warm, no Workday jargon | "Reply YES to schedule" / short link |
| **Slack / Teams** | Hiring manager lives there | Casual, conversational | Inline action buttons (Approve / Skip) |

### Awareness vs action

Every notification must say *explicitly* whether the user needs to do something. "Your requisition was approved" (awareness) versus "Approval needed: Req #1234" (action). Don't mix the two tones in one channel.

---

## 9. Error Handling and Ask Workday Brand Voice

### Three-part error structure

Every AI-surfaced error copies the structure below. No exceptions.

1. **State the problem** — plain language, no error codes. *"I couldn't generate a draft for this role."*
2. **Reason** — specific cause or known limit. *"The requisition is missing a job description field."*
3. **Next steps + actions** — what the user can do right now. *"Add a short description and try again."* + actionable button.

### Fallback message (when AI is unavailable or confidence too low)

Template: *"I can't help with that right now. You can [human alternative] or try again in a moment."*

Example: *"I can't summarise this interview yet — the transcript is still processing. You can read the full transcript below, or check back in a few minutes."*

### DO / DON'T for AI copy (extract — see Canvas AI Persona for full guidance)

**DO**
- Use contractions: *I'm*, *can't*, *it's*, *you're*.
- Speak in first person from the agent: *"I noticed…"*, *"I drafted…"*.
- Be specific: *"3 candidates match"* beats *"several candidates match"*.
- Acknowledge uncertainty: *"Based on the data I have…"*, *"You may want to verify…"*.
- Use British English throughout (workspace default).

**DON'T**
- Use error codes, stack traces, or technical jargon in user-facing copy.
- Apologise repeatedly (*"I'm so sorry"*, *"my apologies"*) — sounds performative.
- Use second-person imperatives that blame the user (*"You entered invalid data"* → *"That input didn't match the expected format"*).
- Overclaim (*"I know exactly what you need"*) — be honest about confidence.
- Invent facts. If you don't know, say so.

**Always link out to the live Canvas AI Persona page** (`/guidelines/ai-guidance/ai-persona`) for the canonical Ask Workday Brand Voice — it evolves independently of this doc.

### AI disclosure line

Every AI-generated artefact must carry a short disclosure. Examples:

- Inline (under a draft): *"Drafted with Workday AI — review before sending."*
- Header (on a chat): *"Ask Workday is an automated assistant — a human reviews every candidate decision."*
- Footer (candidate apply): *"You're chatting with an automated assistant. To speak to a recruiter, type 'talk to a human'."*

---

## 10. Cross-references (what the workspace already owns)

Do not duplicate these — cite them.

- **Conversational / agentic shell, bubbles, composer, GenUI components**: [`.cursor/rules/design-specific/015-sana-style-ui.md`](../../.cursor/rules/design-specific/015-sana-style-ui.md) (Full-page conversational / agentic assistant, Generative UI / A2UI Patterns, Candidate Experience Patterns sections).
- **Email / WhatsApp / SMS channel components**: [`design/docs/canvas-kit-patterns/communication-patterns.md`](../docs/canvas-kit-patterns/communication-patterns.md).
- **GenUI renderer and cards**: `design/components/A2UIRenderer.tsx`, `design/components/GenUIPatterns.tsx`.
- **Sana theme tokens for chat chrome**: `design/components/sanaShellTheme.ts` (`SANA_COMM_*` constants).
- **Editorial Guidelines (non-AI copy baseline)**: `.cursor/skills/editorial-guidelines/SKILL.md` and `319-copy-review.mdc`.
- **Legal-sensitive copy (AI disclosure, consent, privacy)**: `.cursor/rules/060-legal-compliance-review.mdc` — always invoke for AI disclosure text before freezing it.
- **Experience principles (Empower / Trust / Grow)**: `docs/experience-principles.md` — AI features must satisfy all three.
- **UX Quality Checklist (accessibility, E&I, globalisation)**: [`design/references/ux-quality-checklist.md`](./ux-quality-checklist.md) — still applies to AI surfaces; AI guidance supplements it, does not replace it.

---

## 11. Quick framing checklist (use in 315 PASS 1 step 10)

Copy this block into the Design Brief and fill it in.

```
AI Experience Framing:
- Interaction Mode (primary): [Analyzing / Reviewing / Monitoring / Configuring / Creating]
- Secondary modes (if any): [...]
- Phases addressed: [ ] Before Interaction  [ ] During Interaction  [ ] Over Time
  - If any phase is omitted, state why in one line.
- Stance: [Anticipate / Amplify / Empower]
- Agent classification: [Conversational / Ambient]
- Skill mode: [User-Triggered Delegate / System-Triggered Ambient]
- Pattern (from section 6): [Embedded / Contextual Ingress / Content Generation / Partial Panel Chat / Full-Screen Chat / Split-pane Agent + Task]
- Surface (from section 7): [Workday Web / Everywhere / Mobile / Sana Labs]
- Disclosure location + copy: [inline / header / footer + short string]
- Fallback message: [short string — what the user sees when the AI can't help]
- Error message pattern: [confirm three-part structure is used]
```

---

## 12. AI Experience Review lens (used by 318)

When reviewing an AI feature, 318 verifies:

- [ ] An **Interaction Mode** is explicitly tagged, and it's the right one for the user's job.
- [ ] All three **phases** (Before / During / Over Time) are addressed, or absence is justified in one line.
- [ ] The **Pattern** choice is justified via the decision tree (section 6) — not defaulting to chat.
- [ ] Pattern choice cites at least one **ruled-out pattern** (anti-pattern check) with a brief reason.
- [ ] The **Surface** choice matches where the user actually does this job.
- [ ] **Disclosure** copy is present at the right location (inline / header / footer).
- [ ] **Error messages** follow the three-part structure (Problem + Reason + Next steps).
- [ ] **Fallback** is defined for "AI unavailable" / "low confidence".
- [ ] **Brand voice** follows Ask Workday Brand Voice (Canvas AI Persona) — contractions, first-person, specific, no error codes.
- [ ] If Ambient: opt-out affordance is present, user can turn it off at an appropriate scope (per-req, per-user, global).
- [ ] If feature collects/shows sensitive data: 060 legal review has been invoked (GDPR, AI disclosure, consent).

---

## 13. Out of scope for this doc

- **Native mobile component specs** — covered in `design/references/ux-quality-checklist.md` (Mobile topic).
- **Specific model choice, prompt engineering, or evaluation frameworks** — see [`docs/agent-authoring/ai-acrobatics-techniques.md`](../../docs/agent-authoring/ai-acrobatics-techniques.md) and Workday Model Governance.
- **Workday AI Risk Evaluation** — referenced by `ux-quality-checklist.md` E&I topic; invoke 060 for legal/compliance review of any HiredScore / Paradox / other AI-powered surface.
- **Sana Labs product specifics** — keep aware; not the Recruiting default today.

---

## 14. Self-Service Agent (SSA) — product reference (visual-first)

Keyframe-derived patterns from SSA PM demos (Create Job Req naming / backfill-overlap / transfer scenarios) live in **[`ssa-create-req-flow-best-practices.md`](ssa-create-req-flow-best-practices.md)**. That doc is **not** a replacement for Canvas Interaction Modes or the 12 principles; use it alongside sections 3–7 and 9 when designing **split-pane** experiences: conversational intent on the left, validated multi-step transaction on the right (disambiguation in-form, payroll-safe corrections, overlap defaults with rationale, NL job-description refinement, dual-pane success states). Status banner in that doc: **`visual-only; narration TBC`** until the PM annotates open questions there.

---

## 15. Talent Acquisition keynote patterns (visual-first)

Keyframe-derived observations from the Unified Talent Acquisition keynote demo live in **[`talent-acq-demo-best-practices.md`](talent-acq-demo-best-practices.md)**. Use this as an additional product reference for recruiter-focused agentic orchestration (pre-screening, scheduling, candidate outreach) while keeping **Demo UI vs Presenter** and **Concept vs Shippable** tags intact.

### 15.1 Pattern candidates promoted from Talent Acquisition demo

- **Split-pane recruiter shell** is confirmed as a reusable pattern for shortlist + scheduling decisions, not just Create Req.
- **NL-to-structured write-through** is mandatory: chat commands must visibly update candidate filters/lists/forms.
- **Evidence-adjacent decisions** (fit-gap context near actions) improves Trust in pre-screening decisions.
- **Cross-surface orchestration** (workbench -> collaboration chat -> candidate messaging) should be designed explicitly, not treated as accidental handoff.
- **Human-confirmed scheduling commits** remain the safe default in multi-party coordination.

---

## 16. Revision history

- v1.2 (May 2026) — Expanded pattern catalog with **why / when-to-use / when-NOT** guidance, added **Split-pane Agent + Task** entry, added pattern decision guide + recruiting scenario mapping, and added §15.1 Talent Acquisition keynote pattern promotions from `talent-acq-demo-best-practices.md`.
- v1.1 (May 2026) — Linked [`ssa-create-req-flow-best-practices.md`](ssa-create-req-flow-best-practices.md) (SSA Create Job Req / overlap / transfer demo keyframes) in scope § "How to use" and new §14.
- v1.0 (May 2026) — Initial Recruiting-adapted version, built from AI Experiences Guidance 2.0 (Jan 2026 PDF) + Canvas AI Experience Guidelines (Feb 2024+) + Canvas Interaction Modes. Authored alongside `.cursor/plans/ai_guidance_docs_integration_e9ef0626.plan.md`.

