---
name: grill-me
description: Use when the user wants to stress-test a plan, product idea, strategy, PRD, workflow, design, or Jira epic through a structured sequence of clarifying questions before moving forward. Best used in Plan mode.
---

# Grill Me

Stress-test the user's plan by asking focused, sequential questions until there is a shared understanding of the problem, users, decisions, tradeoffs, risks, scope, and gaps.

## Mode

- Prefer Plan mode for this skill.
- When clarification is needed, use Cursor's AskQuestion tool.
- Do not ask clarifying questions as plain chat text if the AskQuestion tool is available.
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
- the current delivery scope if live Jira work exists,
- and what should be validated next.

## When to use

Use this skill when the user says things like:
- "Grill me"
- "Stress-test this"
- "Challenge this plan"
- "Interview me on this"
- "Pressure test this design"
- "Help me think this through"
- "Review this epic"

Use it for:
- product plans,
- PRDs,
- feature ideas,
- workflow designs,
- user experience concepts,
- strategy proposals,
- operating models,
- Jira epics,
- and other ambiguous plans that need clarification before execution.

## Questioning approach

- Ask one high-leverage question at a time.
- Focus on the Why and the What, not the technical How.
- Use simple, non-technical language suitable for a Product Manager.
- Prioritize functional understanding: users, JTBDs, scenarios, pain points, desired outcomes, boundaries, success criteria, and tradeoffs.
- Follow the decision tree logically: clarify upstream decisions before downstream ones.
- Resolve dependencies one by one rather than jumping across unrelated topics.
- Avoid dumping a long questionnaire all at once.
- Challenge vague answers gently but directly.
- Surface contradictions, missing decisions, hidden assumptions, and unclear ownership as soon as they appear.

## Research behavior

Before asking a question, check whether the answer can be inferred from existing context.

- If relevant product or business context already exists in the conversation, use it.
- If available documentation can answer a question reliably, consult that before asking the user.
- Prefer existing functional documentation, admin guides, JTBD materials, and product context over asking avoidable questions.
- Explore the codebase only when it helps answer a functional product question more reliably than asking the user.
- Do not derail into technical implementation details unless the user explicitly wants that.

## Jira epic behavior

If the user asks about an epic, references a Jira epic, or provides an epic key:

- Use the Jira MCP to retrieve the live epic first.
- Review the epic's current summary, description, status, assignee, priority, labels, linked work, and acceptance context if available.
- Retrieve and review all meaningful child issues within the epic, including user stories, tasks, bugs, spikes, and other delivery-relevant work.
- Give special attention to user stories, because they usually provide the clearest picture of user value, scope coverage, scenario coverage, and functional intent.
- Use the epic and its child issues to understand the real scope, sequencing, coverage, gaps, risks, dependencies, and inconsistencies.
- Base your questions on the live Jira state, not only on the user's summary.
- If the epic and child issues reveal ambiguity, inconsistency, overlap, or missing coverage, ask about that directly.
- If the Jira MCP is unavailable or incomplete, say that clearly and then continue using the best available context.

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
- the live Jira scope has been understood if relevant,
- and the user has enough clarity to move forward confidently.

Then provide a concise summary of:
- what is now clear,
- what decisions have been made,
- what assumptions remain,
- what risks still need validation,
- what the live Jira scope suggests if relevant,
- and what should happen next.

## Guardrails

- Do not ask multiple unrelated questions in one turn.
- Do not move into solution design too early.
- Do not over-focus on technical architecture, implementation details, or code unless the user asks for that.
- Do not pretend certainty when important information is missing.
- If the user gives a partial answer, continue from that answer with the next most important unresolved question.
