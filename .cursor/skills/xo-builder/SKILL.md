---
name: xo-builder
description: >-
  Standalone umbrella skill for vibe-coding Workday XO artefacts on your SUV -
  ModulR UI layouts, XO page reverse-engineering, API catalogue search, copy
  edits, validation edits, prompt edits, REST API creation from UI tasks,
  REST API documentation/testing, and WATS test scenarios. Lives entirely
  outside the PM agent workflow: does NOT participate in E2E pipelines, does
  NOT chain into 315/320/330/400 or any rule, and does NOT write to
  MISSION_LOG. Ten modes across three tiers (read-only, guarded write,
  guarded build). Five modes run directly from the PM workspace using XO MCP
  tools; four modes switch workspace to ~/contexto and hand off to Contexto
  workflows or slash commands. Every write mode enforces a
  diff-approve-apply-verify HITL checkpoint. Activate ONLY on explicit trigger
  phrases. Legacy modulr-prototype triggers still work and route into this
  skill's modulr-page mode.
---

# XO Builder (Standalone Umbrella Skill)

Vibe-code XO artefacts on your Workday SUV. One dispatcher skill, ten modes, three tiers. Each mode is self-contained in `modes/<name>.md`; this file is the router + shared contract.

## Trigger phrases

This skill activates ONLY when the user says one of the triggers listed below, **or** when the user invokes the `@xo-developer` subagent (`.cursor/agents/xo-developer-agent.md`) which wraps this skill with a Principal Workday Software Engineer advisory layer. Direct triggers run the skill as written; the subagent runs the same skill with added engineering judgement. See "Invoking via @xo-developer subagent" below for details.

**Umbrella (opens catalogue menu):**
- `/xo-builder`
- "vibe code on my SUV"
- "build me an XO [thing]"
- "what can xo-builder do"

**Mode-specific (routes straight to that mode):**
- `/xo-builder modulr-page` or any legacy ModulR trigger (see Legacy below)
- `/xo-builder page-discovery` or "explain this page" / "what is this xoUi" / "reverse engineer this task"
- `/xo-builder api-catalogue` or "what APIs exist for X" / "search the API catalogue" / "find endpoints for X"
- `/xo-builder wql-query` or "run a WQL query" / "pull this data from my SUV" / "query the SUV with WQL" / "fixture from WQL" / "what does the data look like for X"
- `/xo-builder copy-edit` or "change the copy on this element" / "update this label" / "edit element help text"
- `/xo-builder validation-edit` or "add a validation that says X" / "edit this validation" / "add a rule that blocks X"
- `/xo-builder prompt-edit` or "tweak this prompt" / "change this prompt text" / "add a prompt option"
- `/xo-builder method-edit` or "update this BA method" / "rename this method" / "edit this EBE method" / "edit this EC method" / "add a SQL filter to this method" / "change the expression on this method"
- `/xo-builder rest-from-task` or "convert this task to REST" / "build REST API from this task" / "create REST endpoints for this task" / "convert this UI task to a REST API"
- `/xo-builder rest-scaffold` or "document this REST API" / "generate OpenAPI spec for X" / "build a REST test for X"
- `/xo-builder wats-scenario` or "build a WATS scenario for X" / "create a test scenario for this flow"

**Legacy (still work, route into modulr-page):**
- `/modulr-prototype`
- "build a ModulR page on my SUV"
- "build a ModulR layout on my SUV"
- "mock this on my SUV with Maestro"
- "ModulR prototype from this API response"
- "ModulR layout on my SUV"
- "scaffold a ModulR page"
- "run the Maestro workflow on my SUV"

If the user asks about any of these topics without one of these triggers, answer the question but do **not** invoke the skill. Modes have side effects (workspace switch, XO MCP writes) and must never run unannounced.

## Isolation Contract

This skill is deliberately isolated from the PM agent workflow. You can trust these invariants across **every mode**:

- **Explicit trigger only**: nothing auto-loads `xo-builder` or any mode.
- **No orchestrator entry**: `000-master-orchestrator.mdc` does not route to this skill.
- **No pipeline chain**: not invoked by 060, 080, 090, 100-level, 200, 315, 319, 320, 330, 400, 410, 420, 430, 435, any E2E workflow, or any agent-requestable rule.
- **No MISSION_LOG writes**: xo-builder work is tracked inside `~/contexto/wip/<slug>/events.jsonl` (Contexto's own event log for build modes) or reported inline (for read/write modes). This skill never touches `MISSION_LOG.md`.
- **No rule edits**: running this skill edits zero files in `.cursor/rules/`.
- **No auto-mode-chaining**: one mode never auto-invokes another. All mode transitions are user-triggered.

If you see any of these invariants drift (orchestrator adds a route, a rule starts calling this skill, a mode auto-chains into another), stop and flag it - the skill has leaked.

**Narrow exception**: the `@xo-developer` subagent (`.cursor/agents/xo-developer-agent.md`) is registered in `000-master-orchestrator.mdc` as a specialized agent roster entry and decision-framework mapping. This does NOT violate the isolation contract because the subagent is a thin wrapper that delegates execution to this skill; it inherits every invariant above (no E2E participation, no `MISSION_LOG.md` writes, no rule chain, explicit triggers only). If you see `@xo-developer` wired into any pipeline or auto-invocation path, that is drift - flag it.

## Invoking via @xo-developer subagent

Any mode in this skill can be invoked via the `@xo-developer` subagent (`.cursor/agents/xo-developer-agent.md`). The subagent adds a Principal Workday Software Engineer advisory layer on top of the mode:

- **Direct trigger** (e.g. `/xo-builder copy-edit`, `/modulr-prototype`, or any phrase from "Trigger phrases" above): runs the mode as written. No advisory layer.
- **@xo-developer trigger** (e.g. `@xo-developer, edit the label on <element>` or `@xo-developer, review this validation`): runs the same mode AND adds engineering judgement - wrong-mode detection, WQL query-shape smells, BP downstream-impact flags, WAD-vs-bug classification, and alt-mode suggestions.

The skill is authoritative for **workflow** (mode selection, pre-flight, HITL gates, SUV writes, workspace switches, isolation contract). The subagent is authoritative for **advisory framing** only. If the two conflict, the skill wins. The subagent MUST NOT skip HITL gates, reinterpret mode mechanics, invent new modes, or pre-empt the mode's pre-flight.

## Mode Catalogue

| Tier | Mode | Workspace switch? | Writes to SUV? | Primary tools |
|---|---|---|---|---|
| 1 read-only | [`page-discovery`](modes/page-discovery.md) | No | No | XO MCP: `ui_task_analysis_get`, `xo_search`, `class_get`, `service_description_get` |
| 1 read-only | [`api-catalogue`](modes/api-catalogue.md) | No | No | Pinned OAS files + XO MCP `suv_rest_metadata_api_call`, `service_description_get` |
| 1 read-only | [`wql-query`](modes/wql-query.md) | No | No | Pinned `wql_v1` spec + XO MCP `suv_rest_metadata_api_call` (`POST /wql/v1/data`) |
| 1 guarded build | [`modulr-page`](modes/modulr-page.md) | **Yes** (`~/contexto`) | Yes (via Maestro HITL) | Contexto `/buildModulrLayout` |
| 2 guarded write | [`copy-edit`](modes/copy-edit.md) | No | Yes (tight HITL) | XO MCP `element_content_get` -> diff -> `element_content_patch` |
| 2 guarded write | [`validation-edit`](modes/validation-edit.md) | No | Yes (tight HITL) | XO MCP `validation_create`, `validation_patch`, `reusable_validation_implementation_create`, `ui_reusable_validation_bindings_create` |
| 2 guarded write | [`prompt-edit`](modes/prompt-edit.md) | No | Yes (tight HITL) | XO MCP `prompt_get`, `prompt_patch`, `prompt_group_*` |
| 2 guarded write | [`method-edit`](modes/method-edit.md) | No | Yes (tight HITL) | XO MCP `method_get`, type-specific `_get`/`_patch` for BA / EBE / EC methods, `method_binding_get` |
| 2 guarded build | [`rest-from-task`](modes/rest-from-task.md) | **Yes** (`~/contexto`) | Yes (heavy, via Contexto workflow HITL) | XO MCP `ui_task_analysis_get`; Contexto `schema-analysis`, `schema-implementation`, `processing-creation` |
| 2 guarded build | [`rest-scaffold`](modes/rest-scaffold.md) | **Yes** (`~/contexto`) | Yes (via Contexto HITL) | Contexto `/generate-openapi-spec`, `/wats-rest-builder` |
| 2 guarded build | [`wats-scenario`](modes/wats-scenario.md) | **Yes** (`~/contexto`) | Yes (via Contexto HITL) | Contexto `/wats-rest-builder` or direct `wats_scenario_create`, `wats_suite_create` |

See [MODES.md](MODES.md) for a machine-readable index with per-mode trigger phrases, and [README.md](README.md) for the human quick-start.

## Routing Logic

When a trigger fires:

1. **If umbrella trigger** (no mode specified): print the Mode Catalogue table, ask "Which mode?", then stop. Do not auto-pick.
2. **If mode-specific trigger**: read `modes/<mode>.md` and follow its instructions exactly. Do not pre-empt the mode with guesses.
3. **If legacy trigger** (any phrase in the Legacy list above): route to `modes/modulr-page.md`.
4. **If ambiguous** (trigger matches multiple modes): ask the user which mode they meant; do not auto-pick.
5. **If the user signals confusion mid-mode** ("I don't understand", "what does X mean", "that's too technical", extended silence after a dense explanation): pause the mode, offer `/teachable-moment` on the concept that tripped them up, and only resume once they're oriented. A paused flow is cheaper than an abandoned one. See [`.cursor/skills/teachable-moment/SKILL.md`](../teachable-moment/SKILL.md).

## Global Pre-Flight (common to all modes)

Before executing any mode's own pre-flight, confirm:

- [ ] **Target SUV is dev, not shared**: confirm `$SUV_HOST` points to the user's personal dev SUV. If the host name contains `shared`, `prod`, `staging`, or the user is unsure, stop and ask.
- [ ] **XO MCP is reachable** (all modes): if `user-xo-mcp` tools are not listed as available, stop and tell the user.
- [ ] **XO MCP has the full dynamic-tool surface**: the `xo-mcp` entry in `~/.cursor/mcp.json` must include `"ENABLE_DYNAMIC_TOOLS": "true"` in its `headers` block, and Cursor's MCP panel for `xo-mcp` must report **> 100 tools**. If it reports ~72, either the header is missing or the active SUV is down; stop and tell the user which one to fix (add the header and reconnect the MCP, or provision/switch to an available SUV). Do NOT assume "tool not found" means the capability is missing until this check passes.
- [ ] **cursor-app-control is reachable** (modes that switch workspace): if `move_agent_to_root` is not available, fall back to telling the user to open `~/contexto` manually in Cursor.
- [ ] **Contexto credentials** (modes that switch workspace): `~/contexto/.env` must contain `SUV_HOST`, `SUV_USERNAME`, `SUV_PASSWORD`. If unsure, instruct the user to run `~/contexto/xo-agents/skills/maestro-modulr-crud/scripts/load-env.sh` after the switch.
- [ ] **Contexto freshness** (modes that switch workspace): run `git -C ~/contexto log -1 --format=%cI` from a `bash -c` subshell. If the last commit is older than **7 days**, tell the user to `git -C ~/contexto pull` before proceeding. Contexto's tool names and slash commands change with SUV XORC revisions (e.g. revision 899312 on 17 Apr 2026 renamed several tools); a stale local Contexto against a fresh SUV produces "unknown tool" errors that look like MCP outages but are actually drift. Do NOT switch workspace until either the pull is done or the user accepts the risk.

If any pre-flight item is missing, stop and ask the user before proceeding.

### Tool-specific pitfalls

- **`xo_search` argument format**: pass a single `search_string` in the form `"<index>: <term>"` (e.g. `"resource: interviews"`, `"service: recruiting"`, `"class: JobApplication"`). Do NOT pass separate `query` / `index` arguments - the tool will reject them with a validation error. This trips up modes that delegate to `xo_search` for resolution (notably `api-catalogue` and `page-discovery`).

### Safe bootstrap when `.env` is missing

A non-technical user often does not know their `SUV_HOST` / `SUV_USERNAME` / `SUV_PASSWORD` values but already has a working `user-xo-mcp` MCP server that talks to their SUV. The credentials exist in `~/.cursor/mcp.json` under the `xo-mcp` server (headers `SUV_HOSTNAME` and `SUV_PASSWORD`) but Contexto's `resolve_credentials.py` does not find them - it looks specifically for a server named `suv-remote` with header `SUV_ID`. This is a **header-name mismatch**, not a missing-credential problem.

When invoked via `@xo-developer`, the subagent MAY offer to bootstrap `.env` from the existing MCP config. It MUST NOT do so unprompted, and MUST apply all three guards below.

**Recipe** (documentation only - never auto-run):

```python
import json, os, stat, sys
mcp = json.load(open(os.path.expanduser("~/.cursor/mcp.json")))
h = (mcp.get("mcpServers", {}).get("xo-mcp", {}).get("headers") or {})
host = (h.get("SUV_HOSTNAME") or "").strip()
pw = (h.get("SUV_PASSWORD") or "").strip()
# Guard 1: refuse non-dev hosts
if any(m in host.lower() for m in ("shared", "prod.myworkday", "prd.myworkday", "production", "staging")):
    sys.exit("REFUSED: non-dev host")
# Guard 2: write with 0600 perms, never echo password
env_path = os.path.expanduser("~/contexto/.env")
fd = os.open(env_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as f:
    f.write(f"SUV_HOST={host}\nSUV_USERNAME=superuser\nSUV_PASSWORD={pw}\n")
# Guard 3: report only hostname and password length; never the password itself
print(f"Wrote {env_path}  host={host}  pw_length={len(pw)}  perms=0o600")
```

**Three non-negotiable guards:**

1. **Refuse non-dev hosts.** If `SUV_HOSTNAME` contains `shared`, `prod.myworkday`, `prd.myworkday`, `production`, or `staging`, stop immediately. Never write creds for a non-dev tenant.
2. **Never echo the password.** Print only `host`, `pw_length`, and file permissions. The password belongs in the file, not in chat history.
3. **Destination is fixed.** Only ever write to `~/contexto/.env` on the user's machine. Never a relative path, never elsewhere.

The subagent MUST ask the user before running this - no auto-bootstrap.

## Tier 2 HITL Template (shared by copy-edit, validation-edit, prompt-edit, method-edit)

Every Tier 2 write mode follows the **diff-approve-apply-verify** pattern. Do not shortcut this:

1. **Read current state.** GET the target object via its XO MCP `_get` tool. Show the user the relevant fields.
2. **Compute proposed diff.** Print `old -> new` for every field that will change. Keep this as a visible, readable code block; do not bury it inside reasoning.
3. **HITL checkpoint.** Ask for explicit confirmation. Three possible user responses:
   - `approve` -> proceed to step 4.
   - `reject` -> abort; report "no changes made" and stop.
   - anything else (edits, questions) -> treat as "edit", update the proposed change, loop back to step 2.
4. **Apply.** Call the relevant `_patch` / `_create` / `_delete` XO MCP tool with only the fields in the diff.
5. **Verify.** GET the target again; show the user the new state; confirm it matches the proposed diff. If drift is detected, surface it clearly.

Under no circumstance may a Tier 2 mode write to the SUV without the user having said `approve` (or an explicit synonym the skill instructions allow). Silent inference of approval is a bug.

## Workspace Switch Helpers (used by modulr-page, rest-from-task, rest-scaffold, wats-scenario)

When a mode needs to hand off to a Contexto slash command, use `cursor-app-control.move_agent_to_root`:

**To switch to Contexto:**
```json
{"rootPath": "/Users/david.denham/contexto"}
```

After the switch: tell the user exactly which slash command to type next, and what arguments to paste. Do NOT try to run the slash command yourself - Contexto's slash commands are `disable-model-invocation: true`.

**Capability discovery when unsure which Contexto command to use:** the `/help` slash command returns a live summary of available Contexto capabilities for the active SUV's XORC revision. When a mode knows *what* needs to happen in Contexto but you are not certain which slash command maps to it (e.g. a recently renamed command, or a new capability added in a recent XORC revision), tell the user to run `/help` in the Contexto workspace before typing the command. Do not invent slash command names from memory - they change between XORC revisions and names drift.

**To return to PM workspace (after the Contexto command completes or the user aborts):**
```json
{"rootPath": "/Users/david.denham/product-manager-agent"}
```

Confirm return with: *"Back in product-manager-agent workspace. Work tracked in `~/contexto/wip/<slug>/events.jsonl` - nothing written to MISSION_LOG."*

## Non-Goals (explicit)

xo-builder v1 will **not** do any of the following. If the user asks for any of these, decline and explain why:

- **Dashboards, worklets, home cards, reports** - no clear XO primitive in XO MCP today. Raise as a request to the API team.
- **Business processes (BPs), sub-processes, BP types** - out of scope; belongs in a full PM agent workflow (400).
- **Integrations, integration services** - out of scope.
- **Notifications, alerts, email templates** - out of scope.
- **Security domain edits** - too sensitive for vibe-coding.
- **Class / attribute / relationship schema changes** - belongs in a proper epic (410) with engineering review.
- **Production writes** - every mode targets the user's personal dev SUV only. Pre-flight blocks anything else.
- **Custom reusable workflows** - use Contexto's `/xo-workflow-builder` directly for creating custom analysis or review workflows (e.g. security impact review, code quality checks). See `@xo-developer` advisory #11 for guidance.

If a user asks "can xo-builder do X" and X is on this list, tell them: "Not in v1. Here's why [brief reason]. Consider [alternative]."

## X2 MCP Ecosystem Awareness

xo-builder handles **code generation** on the SUV (via XO MCP tools). The **DevOps lifecycle** - branching, auditing, pushing, impact analysis, code reviews - is handled by **X2 MCP** (`x2-mcp`, `http://localhost:12050/mcp`), a separate local MCP server that bridges Cursor and the X2 Chrome extension.

xo-builder does NOT invoke X2 MCP tools. However, when a write mode completes (especially `rest-from-task`, `modulr-page`, or any mode that creates XO artefacts), the `@xo-developer` advisory layer should suggest the X2 DevOps flow as a natural next step. See advisory #12 in `.cursor/agents/xo-developer-agent.md`.

**Key X2 tools** (for reference, not invoked by xo-builder):
- `createSuvBranch`, `pushChanges`, `getBranches` (branch management)
- `runAudits`, `checkBranchAudits` (linting)
- `runImpactAnalysis`, `getImpactAnalysis` (impact analysis)
- `createCodeReview`, `getPullRequestsForBranch` (code reviews)
- `get_all_active_suvs_for_user`, `get_active_suv_tabs_for_user` (SUV visibility)
- `linkJirasToBranch`, `getJirasForBranch` (Jira linking)

## End-of-run Hygiene

After any mode completes (success or abort):

- If the mode switched workspace, switch back to `product-manager-agent`.
- If the mode wrote to the SUV, summarise what changed and point to any verification URL or follow-up GET output.
- If invoked via `@xo-developer` and the mode wrote to the SUV, suggest the X2 DevOps flow: branch, push, audit, IA, code review (see advisory #12).
- Do not write to `MISSION_LOG.md`. Do not invoke any rule. Do not chain into another mode.
- Ask the user if they want to run another mode. Do not assume.

---

**Remember**: xo-builder is a standalone utility, not a workflow step. Run it when you want to try something on your SUV. Keep it out of pipelines.
