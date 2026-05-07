# AI Acrobatics — Prompt & Rule Authoring Techniques

**Source**: Adapted from Workday's internal *AI Acrobatics — Build Your Own AI-Powered UX Workflows* (v1.0, January 2026). Re-contextualised for this workspace's Cursor agent / rule / skill authoring.

**Scope**: Read by [`090-agent-improvement-advisor.mdc`](../../.cursor/rules/090-agent-improvement-advisor.mdc) when reviewing or proposing new rules, skills, or subagents. Optional reference for any PM who is hand-authoring new agent logic.

**Intent**: This is a *slim* reference, not a playbook. Most of what AI Acrobatics teaches is **already embodied** in this workspace's architecture (orchestrator, sequential-thinking MCP, six-hats MCP, CreatePlan flow, multi-pass rules). This doc captures the vocabulary and the handful of techniques that aren't yet explicit, so that 090's audits can name them.

---

## 1. Quick-reference: the 10 techniques

| # | Technique | Short definition | Already used in workspace? |
|---|---|---|---|
| 1 | **Sequential Questions** | Break a complex request into a chain of focused sub-questions; don't ask for everything at once | Yes — 315 PASS 1/2, 318, 430 passes |
| 2 | **Forced Planning** | Require the agent to produce a plan before any execution (and get it approved) | Yes — `CreatePlan` tool, explicit in 090 |
| 3 | **Structured Output** | Constrain the response shape (JSON / markdown schema / required sections) | Partial — 200 PRD template, 315 output structure |
| 4 | **Progressive Depth** | Start shallow, then deepen if the user needs more — don't over-deliver on the first turn | Partial — used informally in AskQuestion flows |
| 5 | **Forced Reasoning** | Make the agent narrate *why* before it commits (e.g., "before you answer, list the three options and their trade-offs") | Yes — six-hats MCP, CreatePlan rationale sections |
| 6 | **Self-Validation** | Ask the agent to critique its own output against a checklist before handing off | Yes — 318 reviews 315; 318 PASS 1 Non-Negotiables checklists |
| 7 | **Diverge / Converge** | Generate multiple options, then narrow — don't converge too early | Yes — 318 is a dedicated converge gate; six-hats diverges |
| 8 | **Archetype Thinking** | Frame the agent as a specific role ("You are a Principal UX Designer…") | Yes — every subagent wrapper and role-scoped rule |
| 9 | **Conditional Adaptation** | Branch behaviour based on context (if A then X; if B then Y) | Yes — glob-scoped rules, conditional passes in 315/318 |
| 10 | **Slash Commands** | Expose recurring workflows as explicit invokable skills (`/rice`, `/jtbd`, `/editorial`, `/workspace-audit`) | Yes — established skill pattern |

**090 audit use**: when reviewing a new rule or skill, check that it uses at least 3 of these techniques explicitly. Vague "do your best" prompts without structure, validation, or forced reasoning are a signal to redesign.

---

## 2. Universal Bot / Rule Structure

AI Acrobatics proposes every agent rule or bot follow the same three-section skeleton. This workspace already does this implicitly — making it explicit in reviews helps catch drift.

```
# Purpose
  [One paragraph: who the agent is, what it produces, what it won't do.]

# Rules
  [Non-negotiables: MUST / MUST NOT, authoritative sources, tone, scope.]

# Process
  [Ordered steps or passes the agent executes, with gates between them.]
```

Mapping to this workspace:

- 315 — `Purpose` = "Principal UX Designer producing draft Design Brief"; `Rules` = NON-NEGOTIABLE RULES block; `Process` = PASS 1 → PASS 2.
- 319 — `Purpose` = "Copy Review specialist"; `Rules` = Editorial Guidelines Reference + Product Terminology; `Process` = Copy Review Workflow 4 steps.
- 430 — similar.

When auditing a new rule, 090 should check it has clear Purpose / Rules / Process sections even if they're not literally labelled that way.

---

## 3. Multi-model / multi-agent handoff discipline

AI Acrobatics treats a workflow as a chain of specialist models, each taking the previous one's structured output and producing structured output for the next. This workspace does this at the agent level: **200 → 315 → 319 → 318 → 320 → 330 → 400 → 430** with MISSION_LOG + file artefacts as the structured interface.

Principles worth naming explicitly in audits:

1. **Contract between steps** — each step has a defined input artefact (file path) and output artefact (file path). Agents read and write, they don't rely on memory of prior chat.
2. **Structured handoff** — the output file has a known section layout (e.g., `design/[feature]-design-brief.md` ends with `Final Verdict: APPROVED`).
3. **No upstream drift** — if step N fails quality, the orchestrator re-invokes step N-1, it doesn't patch at step N+1.
4. **Single authority** — one rule owns each decision; subagent wrappers delegate rather than duplicate.

When auditing a proposed pipeline step, 090 should verify all four are present. Missing contract or missing structured handoff is the usual failure mode.

---

## 4. What's already embodied (avoid re-inventing)

Name the existing equivalent instead of introducing a new method:

| AI Acrobatics concept | Workspace equivalent |
|---|---|
| Forced planning before execution | `CreatePlan` tool + 090 review flow |
| Sequential thinking / chain-of-thought | `user-sequential-thinking` MCP |
| Diverge / converge with multiple lenses | `user-six-hats-thinking` MCP |
| Universal bot structure | Cursor rules with `description` / `globs` / body |
| Multi-agent handoff | Regional E2E pipeline in `000-master-orchestrator.mdc` |
| Slash commands | Skills catalogue (`.cursor/skills/`) |
| Archetype thinking | Subagent wrappers (`.cursor/agents/*.md`) |
| Structured output | PRD template (200), Design Brief structure (315), JSON slide specs (110/130) |

**Operating rule**: before proposing a new "method", ask whether one of the above already does the job.

---

## 5. Flagged future opportunity: Evaluative Hooks

AI Acrobatics introduces **Evaluative Hooks** — hypothesis-driven prototypes where the AI is told *"design an experience that would surface whether this hypothesis is true/false in user testing"*. This is a method, not a one-off — it sits between research planning (105) and design brief creation (315).

**Status**: flagged, not scoped. If the PM decides to pursue it, open a separate plan to scaffold a `/evaluative-hooks` skill with:

- **Purpose**: Take a research hypothesis → output a low-fidelity prototype spec designed to prove/disprove it.
- **Inputs**: hypothesis statement, target persona, research question from 105.
- **Outputs**: prototype spec handed to 315 for design brief, with explicit evaluation criteria.
- **Rules**: must tie every UI choice back to the hypothesis; must state what observation would falsify it.
- **Handoff**: 105 → `/evaluative-hooks` → 315 → 320.

090 should not proactively create this skill. Flag it when the PM is scoping research-heavy or discovery-heavy work.

---

## 6. Authorship notes

- Original source: *V1.0 AI Acrobatics — Build Your Own AI-Powered UX Workflows* (Workday internal, Jan 2026, 54 pages). Much of the specific model-choice and tool-stack content (Gemini, Lovable, etc.) is deliberately omitted — it changes fast and is not load-bearing for Cursor-native agent authoring.
- Related: [`design/references/ai-experience-guidance.md`](../../design/references/ai-experience-guidance.md) handles the *product* AI guidance (patterns, surfaces, errors, brand voice). This doc handles the *authoring* side (how to write agents and rules that use AI well).
- Revision history:
  - v1.0 (May 2026) — Initial slim extract. Authored alongside `.cursor/plans/ai_guidance_docs_integration_e9ef0626.plan.md`.
