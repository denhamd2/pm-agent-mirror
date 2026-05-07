# Recruiting Agentic Workflow Patterns

Reusable guidance for Workday Recruiting prototypes that combine agentic assistance with recruiter workbench, candidate profile, collaboration, or generated-document surfaces.

This guidance is grounded in the Unified Talent Acquisition demo analysis (`design/references/talent-acq-demo-best-practices.md`), the E2E Talent Acquisition prototype (`design/e2e-recruiting-talent-acq-v01.tsx`), and the Create Offer SSA prototype (`design/create-offer-ssa-v01.tsx`). Treat those as worked examples, not as the only acceptable layouts.

## Core Principle

Choose the surface from the work being done, not from the presence of AI.

- Structured filtering and ranking belongs in the requisition workbench.
- Candidate review belongs on the candidate profile, with decision controls and evidence in the main surface.
- Panel scheduling belongs in the collaboration surface where human trade-offs happen.
- Candidate confirmation belongs in candidate messaging or mobile outreach.
- Generated documents should open as polished artifacts first, with diagnostics and editing behind explicit controls.

## Reference-Frame Fidelity

When a prototype has video or screenshot references, the design brief must cite the exact frames and preserve the observed sequence unless the PM explicitly changes the story.

For each cited frame, record:

- Screen role: workbench, profile, collaboration, candidate channel, generated artifact, or presenter/stage context.
- Layout regions: top nav, left rail, primary workspace, right panel, collaboration thread, or mobile surface.
- Density: compact table/workbench, profile review, document preview, or conversational thread.
- State changes: filters applied, candidate opened, stage changed, evidence revealed, handoff started, message confirmed.
- Controls that must be interactive in the prototype.

Do not over-read keynote stage frames as product UI. If the frame shows presenter context or a temporary loading transition, tag it as such.

## Flow Visuals

For multi-screen, multi-surface, decision-heavy, approval-heavy, or agentic Recruiting designs, include a lightweight visual artifact before UI composition:

- Use a **flow chart** for screen-to-screen sequence and handoffs.
- Use a **decision tree** for branching logic, policy gates, approvals, or outcomes.
- Use a **journey map** for cross-surface flows such as workbench -> collaboration -> candidate channel.
- Use Mermaid in markdown by default so the artifact stays close to the design brief.
- Do not require diagrams for simple single-screen refinements.

The visual should make surface ownership, agent actions, human confirmation, and write-through state explicit.

## Prototype Pattern Learning Loop

Before designing a similar Recruiting workflow, review 2-3 recent prototypes and classify the reusable pattern by use case.

Recommended review set:

- `design/e2e-recruiting-talent-acq-v01.tsx`: recruiter workbench, candidate profile review, external collaboration handoff.
- `design/create-offer-ssa-v01.tsx`: document-first generated artifact, progressive disclosure of RTE / CRFs / QA / approval logic.
- `design/create-jr-ssa-v01.tsx`: SSA split-pane task canvas, reference-grounded generated content, chat-to-canvas state write-through.

Capture:

- When to use the pattern.
- When not to use it.
- Density and surface expectations.
- Required interactions, not just static layout.
- Component or design-system candidates to reuse or extract.

If the lesson will apply beyond one brief, update this file or a more specific `design/references/` pattern doc.

## Surface Ownership

Agentic Recruiting flows often span multiple surfaces. Each surface has a job:

| Surface | Owns | Do not use for |
|---|---|---|
| Requisition workbench | Candidate grid, filters, counts, shortlist state, table selection | Long-form rationale, panel negotiation |
| Candidate profile | Review decision, resume, insights, fit/gap evidence, profile-to-profile navigation | Persistent right chat when reference shows profile-only review |
| Collaboration channel | Panel availability, conflict negotiation, human confirmation, prep-material handoff | Pretending collaboration is a native calendar-only step |
| Candidate channel | Candidate-facing outreach, confirmation, reschedule response | Internal panel decision-making |
| Generated document preview | Artifact review, brand, candidate/approver view | Always-on diagnostics, CRF debugging, dense admin controls |

If a screen includes AI, define whether the AI is embedded content, contextual ingress, split-pane agent + task, collaboration handoff, or generated artifact support. Chat is not the default.

## AI Write-Through

AI suggestions must not live only in chat.

Visible write-through examples:

- A natural-language filter adds or updates filter chips and candidate rows in the grid.
- A profile navigation control updates the candidate name, grade, metadata, resume, and candidate counter.
- An offer edit changes the generated letter, marks affected steps for review, and shows CRF/QA status when checks are opened.
- A scheduling handoff changes the candidate stage and creates a visible coordination thread with proposed slots and conflicts.

Reject any design where the agent claims something happened but the system-of-record surface does not change.

## Evidence-Adjacent Decisions

High-consequence recruiter decisions need rationale beside the decision control.

Use evidence-adjacent cards for:

- Candidate insights near Move Forward / Decline.
- Fit & gap evidence beside the resume.
- Approval logic beside offer send/review.
- Document QA and dynamic-field health beside the generated document editor.
- Source citations in approver summaries or AI recommendations.

Evidence should be concise and linked to the source surface where possible. Avoid burying rationale in earlier chat turns.

## Contextual Density

Density should follow task mode:

- Recruiter grids: compact rows, thin dividers, small metadata, compact filter toolbar, understated count strip.
- Candidate profiles: tighter action header, strong candidate name, evidence cards, resume/document viewer; no unnecessary side chat.
- Collaboration handoffs: thread density similar to Teams or Slack, with readable message cards and clear human replies.
- Generated documents: document-first, calm, branded, readable; diagnostics and editors are progressive disclosure.

Do not apply spacious card-dashboard treatment to high-frequency recruiter tables unless the reference requires it.

## Progressive Disclosure

For generated artifacts and AI-heavy flows:

- Default to the output the user came for: the offer, summary, shortlist, or coordination thread.
- Hide diagnostics, CRFs, QA decks, template logic, and rich text editing until the user selects Edit, Show checks, or a similar action.
- Keep the audit trail available, not visually dominant.
- Use neutral disclosure copy; do not use alert banners for ambient AI identity or ordinary generated-content notices.

## Human-Confirmed Commit Gates

The agent can propose and prepare, but the user confirms the commit.

Examples:

- Candidate move-forward happens through explicit profile controls.
- Scheduling conflicts are resolved in the shared channel before candidate outreach is sent.
- Offer send remains on the review/send surface; chat cannot directly send.
- Generated copy may be pre-filled, but the user can preview, edit, and inspect checks.

For irreversible or externally visible actions, the design must show what will happen, why it is safe enough, and what the user can still change.

## Interaction Completeness

Visible controls in reference frames should be interactive in prototypes unless explicitly marked visual-only.

Minimum expectations:

- Candidate previous/next arrows update the profile in-place.
- Filter prompts update grid filters and row states.
- Move Forward opens the next observed surface in the reference sequence.
- Edit or Show checks changes the generated document surface.
- Send outreach produces visible candidate-channel confirmation.

## Reusable Pattern Candidates

Document first; extract code components when the same pattern appears in a second prototype or when implementation drift becomes visible.

- `RecruitingCandidateGrid`: compact requisition candidate table with count strip, filter toolbar, selectable rows, grade/status cells.
- `RecruitingCountStrip`: compact stage-count row with active underline.
- `CandidateProfileActionBar`: move/decline/star/more controls, previous/next candidate navigation, resume toggle.
- `CandidateEvidencePanel`: fit/gap and candidate insight panels with source-adjacent evidence.
- `ExternalCollaborationHandoff`: Teams-like scheduling coordination surface for Workday Everywhere handoffs.
- `GeneratedDocumentPreview`: document-first branded preview for Offer SSA and future generated documents.
- `AiDiagnosticsPanel`: progressive-disclosure checks for CRFs, QA, citations, template eligibility, and approval logic.

## Acceptance Criteria

A recruiting agentic design is reusable-ready when:

- It cites exact reference frames or documents and separates product UI from stage/demo context.
- It includes a screen sequence map for multi-surface flows.
- Every agent claim has a visible write-through target or a stated reason it is advisory only.
- Evidence appears beside the relevant decision, not only in chat.
- The selected surface matches the work being done.
- Dense recruiter workbench screens stay compact and scannable.
- Generated artifacts open as readable outcomes before showing diagnostics.
- Human confirmation is present for irreversible or externally visible actions.
- Reference-visible controls are interactive in the prototype.
- The design states which pattern it ruled out and why.
