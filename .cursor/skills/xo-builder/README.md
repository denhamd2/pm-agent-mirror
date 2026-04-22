# XO Builder - Quick Start

Vibe-code Workday XO artefacts on your SUV. This skill is a standalone umbrella - it does **not** participate in any PM agent pipeline or rule chain. It runs on explicit invocation only.

## When to use

Use xo-builder when you want to **try something** on your SUV without filing a story or writing a PRD. Typical flows:

- "Explain this Workday page to me" -> [page-discovery](modes/page-discovery.md)
- "What APIs exist for X?" -> [api-catalogue](modes/api-catalogue.md)
- "Pull this data from my SUV / give me a fixture" -> [wql-query](modes/wql-query.md)
- "Mock up a new page for a demo" -> [modulr-page](modes/modulr-page.md)
- "Change the label on this element" -> [copy-edit](modes/copy-edit.md)
- "Add a validation that requires X when Y" -> [validation-edit](modes/validation-edit.md)
- "Tweak this prompt text or add an option" -> [prompt-edit](modes/prompt-edit.md)
- "Update this BA method / rename this EBE method / add a SQL filter" -> [method-edit](modes/method-edit.md)
- "Convert this UI task to a REST API" -> [rest-from-task](modes/rest-from-task.md)
- "Document this REST API as an OpenAPI spec" or "build a REST test" -> [rest-scaffold](modes/rest-scaffold.md)
- "Build a WATS scenario for this flow" -> [wats-scenario](modes/wats-scenario.md)

If what you want is a real feature (new class, new BP), stop and use the PM agent workflow ([400 Backlog Refinement](../../rules/400-backlog-refinement.mdc)) instead.

## When NOT to use

- You want a production change (xo-builder only targets dev SUVs).
- You want a dashboard, report, worklet, BP, integration, notification, or security change (all out of scope for v1).
- You want to create a new class or attribute (belongs in an epic).

## How it works

1. Say a trigger phrase (see [SKILL.md](SKILL.md#trigger-phrases)).
2. If you triggered the umbrella, pick a mode from the catalogue.
3. The mode walks you through its own pre-flight.
4. **Read-only modes** run directly from the PM workspace using XO MCP.
5. **Write modes** show you a diff, wait for your explicit `approve`, then apply via XO MCP and verify.
6. **Build modes** switch workspace to `~/contexto`, tell you which slash command to type, then switch back when done.
7. For engineering advisory on top of any mode, invoke `@xo-developer` (`.cursor/agents/xo-developer-agent.md`) - it runs the same mode with a Principal Workday Software Engineer framing (wrong-mode detection, query-shape smells, BP impact flags, WAD-vs-bug classification).

## Invariants you can rely on

- No orchestrator routes here.
- No rule chains into here.
- No mode writes to `MISSION_LOG.md`.
- No mode auto-invokes another mode.
- Every write requires your explicit `approve`.
- Every workspace switch is reversed on completion.
- Every run targets your personal dev SUV only.

## Ecosystem

xo-builder uses **XO MCP** for code generation. For the **DevOps lifecycle** (branching, auditing, pushing, impact analysis, code reviews), use **X2 MCP** (`x2-mcp`) - a local MCP server that bridges Cursor and the X2 Chrome extension. After a write mode completes, `@xo-developer` will suggest the X2 DevOps flow as a next step.

See [SKILL.md](SKILL.md) for the full dispatcher, [MODES.md](MODES.md) for the per-mode index, and `modes/*.md` for each mode's detail.
