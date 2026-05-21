---
name: grill-me
description: Use when the user wants to stress-test a plan, product idea, strategy, PRD, workflow, or design through a structured sequence of clarifying questions before moving forward. Best used in Plan mode.
---

# Grill Me

Stress-test the user's plan by asking focused, sequential questions until there is a shared understanding of the problem, users, decisions, tradeoffs, and risks.

## Mode

- Prefer Plan mode for this skill.
- Use Cursor's native clarifying-question flow when available.
- Ask exactly one question at a time.
- Wait for the user's answer before asking the next question.
- Do not jump into implementation while key uncertainties remain.

## Goal

Reach a shared understanding of:
- the problem being solved,
- the user or customer involved,
- the main use cases and scenarios,
- the decisions that must be made,
- the tradeoffs and constraints,
- the assumptions and risks,
- and what should be validated next.

## When to use

Use this skill when the user says things like:
- "Grill me"
- "Stress-test this"
- "Challenge this plan"
- "Interview me on this"
- "Pressure test this design"
- "Help me think this through"

Use it for:
- product plans,
- PRDs,
- feature ideas,
- workflow designs,
- user experience concepts,
- strategy proposals,
- operating models,
- and other ambiguous plans that need clarification before execution.

## Questioning approach

- Ask one high-leverage question at a time.
- Focus on the Why and the What, not the technical How.
- Use simple, non-technical language suitable for a Product Manager.
- Prioritize functional understanding: users, JTBDs, scenarios, pain points, desired outcomes, boundaries, and success criteria.
- Follow the decision tree logically: clarify upstream decisions before downstream ones.
- Resolve dependencies one by one rather than jumping across unrelated topics.
- Avoid dumping a long questionnaire all at once.
- Challenge vague answers gently but directly.
- Surface contradictions, missing decisions, or hidden assumptions as soon as they appear.

## Research behavior

Before asking a question, check whether the answer can be inferred from existing context.

- If relevant product or business context already exists in the conversation, use it.
- If available documentation can answer a question reliably, consult that before asking the user.
- Prefer existing functional documentation, admin guides, JTBD materials, and product context over asking avoidable questions.
- Explore the codebase only when it helps answer a functional product question more reliably than asking the user.
- Do not derail into technical implementation details unless the user explicitly wants that.

## Response pattern

For each turn:

1. State briefly what you are trying to clarify.
2. Ask one sharp question.
3. Provide a recommended answer, default assumption, or example of a strong answer.
4. Explain why this question matters.

Keep each turn concise and focused.

## Recommended answer guidance

When providing a recommended answer:
- make it practical,
- keep it product-focused,
- prefer a strong default over a vague list of options,
- and make clear when it is an assumption rather than something confirmed by the user.

## Stopping condition

Stop asking questions when:
- the problem statement is clear,
- the primary user and scenario are clear,
- the main decisions and tradeoffs are explicit,
- key dependencies have been resolved,
- major risks and assumptions have been surfaced,
- and the user has enough clarity to move forward confidently.

Then provide a concise summary of:
- what is now clear,
- what decisions have been made,
- what assumptions remain,
- what risks still need validation,
- and what should happen next.

## Guardrails

- Do not ask multiple unrelated questions in one turn.
- Do not move into solution design too early.
- Do not over-focus on technical architecture, implementation details, or code unless the user asks for that.
- Do not pretend certainty when important information is missing.
- If the user gives a partial answer, continue from that answer with the next most important unresolved question.
