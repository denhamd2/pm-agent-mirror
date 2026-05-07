---
name: Teams UI and UX Designer Intelligence
overview: Refit the E2E scheduling handoff into a fuller Microsoft Teams-style UI and improve UX Designer guidance so future designs include flow visuals and learn layout patterns from recent prototypes.
todos:
  - id: teams-reference-refit
    content: Refit `TeamsSchedulingHandoff` to closely match the reference Teams frames (`tad-08640`, `tad-08880`, `tad-09360`, `tad-09840`).
    status: pending
  - id: ux-flow-visuals
    content: Update UX Designer / 315 guidance to require flow charts, decision trees, or journey maps for multi-screen, decision-heavy, or agentic designs.
    status: pending
  - id: prototype-pattern-learning
    content: Add guidance for UX Designer to review recent prototypes and extract reusable pattern lessons by use case.
    status: pending
  - id: review-and-validate
    content: Run typecheck/lints for prototype changes and validate updated guidance for consistency.
    status: pending
isProject: false
---

# Teams UI and UX Designer Intelligence Plan

## Problem
The current scheduling handoff is only Teams-like. The reference frames show a fuller Microsoft Teams UI, with a specific app rail, chat list, top command/search bar, selected group thread header, thread spacing, message composer, and tool row. The current prototype captures the idea of cross-surface collaboration but not enough of the visual structure.

Separately, the UX Designer now has stronger reference-fidelity and agentic workflow guidance, but it does not yet explicitly require high-level flow artifacts (flow charts, decision trees, journey maps) or a systematic learning loop from recent prototypes.

## Proposed Solution

### 1. Refit the scheduling handoff to full Teams UI
Update [`design/e2e-recruiting-talent-acq-v01.tsx`](../../product-manager-agent/design/e2e-recruiting-talent-acq-v01.tsx), specifically `TeamsSchedulingHandoff`, to match the reference frames more closely:

- Add a Teams-like top command/search bar inside the handoff surface.
- Rebuild the left Teams app rail with Activity, Chat, Teams, Calendar, Calls, Files, Contoso, Apps styling and selected Chat state.
- Rework the chat list into pinned/recent sections with avatars, timestamps, unread/active treatment, and reference-like row density.
- Rework the selected thread header to match `Work... Amanda, Angela, +1`, with Chat/Files tabs and top utility icons.
- Rework message cards to match the reference geometry: narrower centred thread, light message surfaces, inline proposed slots with conflict/success markers, human replies, right-aligned recruiter reply, final Workday agent confirmation, and `View Interview Prep Materials`.
- Preserve existing flow behavior: profile `Move Forward` opens the handoff; `Send candidate outreach` continues to candidate outreach.

### 2. Add UX flow visuals to design planning
Update [` .cursor/rules/315-design-brief-creation.mdc`](../../product-manager-agent/.cursor/rules/315-design-brief-creation.mdc) and [` .cursor/agents/ux-designer-agent.md`](../../product-manager-agent/.cursor/agents/ux-designer-agent.md) so the UX Designer produces visual planning artifacts when they add value.

Recommended rule:

- For multi-screen, multi-surface, decision-heavy, approval-heavy, or agentic flows, include at least one visual artifact in the design brief:
  - Flow chart for screen-to-screen sequence.
  - Decision tree for branching logic, policy gates, approval rules, or candidate/offer outcomes.
  - Journey map for cross-surface experiences such as workbench -> collaboration -> candidate channel.
- Keep visuals lightweight and implementation-oriented; use Mermaid in markdown unless a richer artifact is explicitly needed.
- Do not require diagrams for simple single-screen UI refinements.

### 3. Add prototype pattern learning to UX Designer guidance
Update the UX Designer / 315 guidance to make recent prototype review a formal input:

- When a new design resembles an existing prototype family, the UX Designer should review 2-3 recent prototypes and classify their layout pattern by use case.
- Capture the reusable lesson: when to use the pattern, when not to use it, density/style expectations, and component candidates.
- Use current worked examples:
  - E2E Talent Acquisition: recruiter workbench, candidate profile review, collaboration handoff.
  - Create Offer SSA: document-first generated offer, progressive disclosure of checks/CRFs/RTE.
  - Create Job Req SSA: SSA split-pane, reference-grounded generated job description, task canvas.
- Feed durable lessons back into `design/references/recruiting-agentic-workflow-patterns.md` or relevant design-system docs rather than burying them in one-off briefs.

## Rationale
The Teams refit improves reference fidelity and reduces the risk that future reviewers see a generic chat surface instead of a believable Workday Everywhere handoff.

The flow visuals are valuable because they make invisible design decisions explicit: where the user starts, when the agent acts, where state writes through, where human confirmation happens, and which surface owns each step. This is especially useful for agentic flows, where otherwise teams default to “add chat” instead of designing the whole journey.

The prototype learning loop is valuable because the UX Designer should not only follow rules; it should build a memory of proven layout patterns by use case. This makes it more likely future designs reuse the right shell and density instead of reinventing each prototype.

## Validation
- Run `npm run typecheck --prefix design` after the Teams UI code change.
- Run lints for `design/e2e-recruiting-talent-acq-v01.tsx`.
- Review updated UX guidance for consistency with the recently added `design/references/recruiting-agentic-workflow-patterns.md`.
- Confirm no new guidance contradicts the hard no-breadcrumb rule or Canvas Kit/Sana component guidance.
