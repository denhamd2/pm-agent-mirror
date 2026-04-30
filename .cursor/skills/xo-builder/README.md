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

## First 15 Minutes

If this is your first time using `@xo-developer` or the xo-builder skill, try these three prompts in order. Each is read-only or low-risk and builds your mental model before any serious write operation. If any response is too technical, type `/teachable-moment` to get a plain-English version with a diagram.

1. **Understand a task** (read-only, no SUV changes):
   `@xo-developer analyse the Offer Management task and summarise what it does in plain English`
   - Uses: [page-discovery](modes/page-discovery.md) mode.
   - What you get: a plain-English summary of what the task does, who uses it, its inputs, outputs, and validations.
   - Why start here: builds your mental model of how XO tasks are structured, without touching anything.

2. **List available APIs** (read-only, no SUV changes):
   `@xo-developer what public Workday APIs can I call for Recruiting?`
   - Uses: [api-catalogue](modes/api-catalogue.md) mode.
   - What you get: a shortlist of endpoints (Recruiting v4, Staffing v7, Person v4, WQL v1, etc.) with quickstart curls, grouped by intent (people, jobs, candidates, analytics).
   - Why next: useful for sizing "can we do X via API?" questions before spec work.

3. **Rename a method** (small guarded write, single field):
   `@xo-developer rename the BA method Candidate@getActiveJobApplications to getActiveApplications`
   - Uses: [method-edit](modes/method-edit.md) mode.
   - What you get: a diff showing the current and proposed display name, a `HITL approve` gate, the XO MCP patch, then `@xo-code-reviewer` and `@qa-engineer` running **in parallel** (artefact review + UI smoke), then a plain-English combined recap of what changed.
   - Why end here: teaches you the full four-stage loop (implement -> reviewer + QA in parallel -> triage-and-apply -> PM recap) on the smallest safe write. If anything goes wrong, it's a name change on a dev method - trivial to revert.

After these three, you'll have a working feel for read-only vs write modes, the HITL gate pattern, and the reviewer loop. From there, more ambitious prompts (REST scaffolding, ModulR layouts, validation creation) are safe to try.

## Micro-task cookbook

Quick prompts you can copy/paste when you want a narrow, outcome-focused run:

- **Map one task quickly (read-only)**
  - Prompt: `@xo-developer explain what task wid <TASK_WID> does and list its key validations`
  - Mode: [page-discovery](modes/page-discovery.md)
  - Output: task summary, inputs/outputs, validation touchpoints

- **Check if public APIs already solve a request (read-only)**
  - Prompt: `@xo-developer find public Workday APIs for candidate tagging and show likely endpoints`
  - Mode: [api-catalogue](modes/api-catalogue.md)
  - Output: API shortlist with candidate endpoints and usage notes

- **Create a small fixture for design or QA (read-only)**
  - Prompt: `@xo-developer run a WQL query for active candidates and save a fixture`
  - Mode: [wql-query](modes/wql-query.md)
  - Output: inline preview or `design/fixtures/<slug>.json`

- **Do a low-risk UI text change (guarded write)**
  - Prompt: `@xo-developer update the help text on element <ELEMENT_WID> to '<NEW_TEXT>'`
  - Mode: [copy-edit](modes/copy-edit.md)
  - Output: diff, HITL approval, patch, verification recap

- **Convert one UI task to REST with phase gates (guarded build)**
  - Prompt: `@xo-developer convert task wid <TASK_WID> to a full CRUD REST API`
  - Mode: [rest-from-task](modes/rest-from-task.md)
  - Output: phased recap, WIDs, wrappers, artifacts under `docs/xo/rest-apis/<slug>/`

## MCP health quick checks

Use this checklist when a mode fails early:

- **Symptom:** expected XO tools are missing or commands fail with tool-not-found
  - **Likely cause:** XO MCP is disconnected or dynamic tools are not enabled
  - **Fix:** in `~/.cursor/mcp.json`, verify `"ENABLE_DYNAMIC_TOOLS": "true"` under `xo-mcp` headers, reconnect MCP, and confirm MCP panel shows >350 tools

- **Symptom:** XO tool calls fail intermittently (timeouts/network errors)
  - **Likely cause:** temporary SUV or MCP transport instability
  - **Fix:** retry with new evidence (fresh call context) up to 2 times, then stop and escalate with the exact failing tool and payload shape

- **Symptom:** workspace-switch mode cannot move to `~/contexto`
  - **Likely cause:** `cursor-app-control` MCP unavailable
  - **Fix:** open `~/contexto` manually in Cursor and continue with the instructed slash command

- **Symptom:** Contexto slash command names differ from expected
  - **Likely cause:** stale local Contexto checkout vs current SUV XORC revision
  - **Fix:** run `git -C ~/contexto pull`, then use `/help` in Contexto to confirm current commands

- **Symptom:** Contexto mode fails with credential/setup errors
  - **Likely cause:** missing or stale `~/contexto/.env`
  - **Fix:** load env via `~/contexto/xo-agents/skills/maestro-modulr-crud/scripts/load-env.sh` and retry

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

## Resources

- **Contexto docs site**: Installation guides, tutorials, and demos (internal - ask in #xo-agents-mcp for the current URL).
- **#xo-agents-mcp Slack channel**: Support, announcements, and roadmap updates.
- **Contexto repo**: `~/contexto` - pull regularly to stay current with SUV XORC revisions.
