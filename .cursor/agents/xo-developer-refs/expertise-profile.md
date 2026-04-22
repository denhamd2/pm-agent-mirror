# `@xo-developer` - Expertise Profile

This file captures what a Principal Workday Engineer **knows** and brings as context into any xo-builder mode. It is paired with [`advisory-playbook.md`](./advisory-playbook.md) - this file is **knowledge**; that file is **behaviours**.

**Loaded by**: [`.cursor/agents/xo-developer-agent.md`](../xo-developer-agent.md) on every invocation. The wrapper agent instructs its subagent runtime to Read this file at the start of its first message.

This is context for advisory output. **It is not workflow.** Workflow lives in [`.cursor/skills/xo-builder/SKILL.md`](../../skills/xo-builder/SKILL.md).

---

## xoUi task model
- **Convenience Task**: user-facing task backed by a high-level class; most common in Recruiting UIs.
- **Sequence Task**: multi-step guided flow (wizard-like).
- **Element Task**: single-element edit (often wraps an `element_content`).
- **BEM (Business Element Model) Task**: declarative BP-adjacent task backed by a BEM.
- **Web Service Task**: task that maps onto a REST or SOAP operation.

When a user asks "what is this page", default to calling `ui_task_analysis_get` via the `page-discovery` mode - that returns `task_type`, `task_domains`, and `element_contents[]` which map cleanly to these categories.

## Classes and work data
- Every element has a **proposed class** and a **work data type** (singular instance vs nonsingular collection).
- `class_get` and `class_data_view_get` reveal the field surface of a class; `method_binding_get` reveals how the UI binds response methods to that class.
- Work-data binding is *the* contract between UI and data; a ModulR layout is a tree whose leaves reference elements which reference classes via work data.

## Validations and prompts
- **Regular validations** are attached to a single element; **reusable validations** are defined once and bound to many elements via `ui_reusable_validation_bindings_create`.
- Validations run via **EBE** (Evaluate Boolean Expression) or **EC** (Evaluate Conditions) methods, created by `ebe_evaluate_boolean_expression_method_create` / `ec_evaluate_conditions_method_create`.
- **Editing an existing BA / EBE / EC method** (rename, change expression / SQL body) is handled by the `method-edit` mode. Creating methods from scratch still belongs in `validation-edit` (for validation-bound EBE/EC) or `rest-from-task` (for BA methods generated alongside a new REST resource).
- **Prompts** are short pick-lists attached to a single element; **prompt groups** are reusable sets of prompt options.
- Word buckets (`word_bucket_get`) are the source for translatable error messages.

## ModulR layout shape
- Layouts are JSON trees with **stages**, **children**, and **element references**.
- `workData` bindings inside a layout tell a child where to source its singular/nonsingular data.
- Maestro composes layouts in memory; the CRUD skill persists them to the SUV via REST.

## Public REST patterns
- Base path: `https://<tenantHostname>/ccx/api/<service>/<version>/...` for almost every service.
- **Prism Analytics exception**: `https://<tenantHostname>/api/prismAnalytics/v3/{tenant}/...` - different host template, OAS 3.0 (not 2.0), and outside xo-builder's scope.
- Recruiting v4 is mostly GET-only; writes are concentrated in Staffing v7 (`jobChanges`, `organizationAssignmentChanges`), Person v4 (contact-info change events), Business Process v1 (event-step actions), Connect v2 (message templates).
- **BP-gated mutations**: many Recruiting-adjacent "writes" are actually two-step: POST the object, then advance the BP via `POST /businessProcess/v1/eventSteps/{ID}/approve` etc.
- **WQL** (`POST /wql/v1/data`) is the read-side safety net. Any object exposed to the user is almost always WQL-queryable even if it has no structured REST surface.
- **Domain security gates every public call.** Public REST reads and writes are gated by **domain security**. A fresh superuser role on a bare dev SUV does NOT include every Recruiting / Staffing / Person domain by default. A 403 on a public endpoint is the signal to do one of three things: (a) request the missing domain via SUV admin, (b) fall back to WQL against the same underlying object, or (c) build a fixture from the pinned OAS schema in `research/workday-public-apis/` and swap in live data later. It is almost never a bug in the endpoint.

## Business Process model
- **Event**: an instance of a BP running for a specific object (e.g. a specific Offer).
- **Event step**: a node inside the event (Initial, Approval, To Do, Questionnaire, Complete).
- **Type**: the definition of the BP (what steps exist, in what order, who approves).
- Public action endpoints on event steps: `/approve`, `/deny`, `/sendBack` (targets from `GET /values/sendBack/to/`), `/reassign`, `/toDo`, `/questionnaire`. Event-level actions: `/cancel`, `/rescind`.
- Schema families worth knowing: `businessProcessEventAction_*`, `eventStepsSummary_*`, `businessProcessTypeDetails_*`, `questionnaireAnswers_*`.

## Contexto role
- **Context bridge**: Contexto is the repo at `~/contexto` that provides slash-commands which invoke MCP tool graphs (`/buildModulrLayout`, `/generate-openapi-spec`, `/wats-rest-builder`, `/xo-workflow-builder`, `/research-topic`).
- It is **only accessed** by the four xo-builder modes that switch workspace: `modulr-page`, `rest-from-task`, `rest-scaffold`, `wats-scenario`. Every other mode runs directly from the PM workspace using `user-xo-mcp` tools.
- You do NOT read from `~/contexto` yourself. If a user question needs Contexto-specific knowledge, route to the appropriate mode and let its workspace switch do the work.

## Maestro workflow (inside `modulr-page`)
- Six stages: **Initialize, Discover, Build, Bind, Review, Persist**.
- Two HITL gates: **`plan_approval`** (after Discover; before Build) and **`pre_suv_write`** (after Review; before Persist). Both are enforced by the Maestro Composer Agent; you do not skip or batch them.

## WATS conventions
- **System Test**: the top-level test artefact for a service.
- **Suite**: a grouping of scenarios within a system test.
- **Scenario**: a sequence of actions (lines) that exercises a flow.
- **Scenario Line**: a single action within a scenario.
- REST flows are scaffolded via Contexto `/wats-rest-builder`; UI flows use direct batched XO MCP calls (`wats_scenario_create`, `wats_scenario_wats_scenario_line_create`, `wats_suite_create`, `wats_system_test_create`).

## X2 MCP and SUV DevOps lifecycle
- **X2 MCP** (`x2-mcp`, `http://localhost:12050/mcp`) is a local MCP server that bridges Cursor and the X2 Chrome extension. It uses browser cookies for authentication - no separate token management.
- **Division of labour**: XO MCP handles **code generation** (task analysis, CRFs, representations, services, validations). X2 MCP handles the **DevOps lifecycle** (branching, auditing, pushing, impact analysis, code reviews).
- **Branch management**: `createSuvBranch` (create locally + Coffeehouse), `pushChanges` (push to Coffeehouse), `getBranches` (list branches for a SUV).
- **Audits**: `runAudits` (start linting for a branch + commit), `checkBranchAudits` (check status).
- **Impact analysis**: `runImpactAnalysis` (trigger IA on a SUV), `getImpactAnalysis` (retrieve results - impacted tests, fast path, runtime).
- **Code reviews**: `createCodeReview` (create a CRS code review / PR), `getPullRequestsForBranch` (get PR info).
- **SUV visibility**: `get_all_active_suvs_for_user` (list active SUVs), `get_active_suv_tabs_for_user` (open browser tabs with URLs and instance IDs), `get_suv_data` (SUV data wrapper), `getChangesForSuv` (metadata revisions).
- **Jira linking**: `linkJirasToBranch`, `getJirasForBranch`.
- **Tip**: because XO is unusual, when asking for branch operations you may need to mention X2 explicitly (e.g. "create a branch with X2" or "you're on an SUV, create a branch").
- **Contexto repo sync**: X2 MCP automatically keeps `~/code/contexto-N` repos' `.cursor/mcp.json` and Cursor ribbon colour in sync with your active SUV. Name SUVs with a number prefix (e.g. `1 - Feature work`) for this to work.

## XO MCP best practices
These patterns produce more reliable results when using XO MCP tools. Apply them by default in all modes and advisory output.

- **Dynamic tools header** (mandatory for full tool surface): the `xo-mcp` entry in `~/.cursor/mcp.json` MUST include `"ENABLE_DYNAMIC_TOOLS": "true"` in its `headers` block. Without this the server returns a ~72-tool back-up list instead of the full 110-300 tools discovered from the live SUV's XORC revision. **Sanity check on any "tool not found" error**: count tools in Cursor's MCP panel for `xo-mcp`. If it shows ~72, either the header is missing (fix: add the header, reconnect the MCP) or the active SUV is down (fix: provision or switch to an available SUV, then reconnect). Do not treat "tool not found" as a real capability gap until the count is confirmed > 100.
- **Finishing line pattern**: see [Advisory Behaviour #13](./advisory-playbook.md#13-finishing-line-pattern) for the user-facing template. Core idea: analyse first (e.g. `ui_task_analysis_get`), checkpoint with the user, then hand off the final generation step.
- **Be explicit about tools**: when you know which XO MCP tool is needed, name it in the prompt. "Use `class_data_view_get` to examine the Worker class" is more effective than "show me what is in the Worker class". This avoids the agent picking a less efficient path.
- **Break large tasks into steps**: instead of "build a complete REST API for the Benefits module", break it into discrete steps: (1) analyse the task structure, (2) examine the business object, (3) create a GET service operation. Each step gives a verification checkpoint.
- **Model selection**: Claude 4.6 Opus or Sonnet produce the most consistent results with XO MCP tool calls. The `auto` model selector sometimes has issues building the JSON needed for MCP tools (e.g. "data input should be a valid dictionary" errors). See [Advisory Behaviour #14](./advisory-playbook.md#14-tool-call-json-validation-errors---model-switch-nudge) for the user-facing nudge.
- **Plan mode for investigation, Agent mode for execution**: start in Plan mode to understand the problem and explore, switch to Agent mode when ready to execute. This maps naturally to xo-builder's Tier 1 read-only modes (investigation) vs Tier 2 write/build modes (execution).

## Recruiting field-location cheatsheet
Observed findings from one development SUV. Schema varies by tenant; always verify with `class_get` before asserting to the user.

- **Candidate class, direct attributes**: `Full Name (Derived)`, `First Name`, `Last Name`, `Email Address (Derived)`, `Location Name`. Safe to bind directly in a ModulR layout rooted on a Candidate element.
- **Job Application class**: stage / status, application date, requisition reference, current step in the hiring Business Process. `stage` and `source` are commonly assumed to live on Candidate but they do not.
- **Candidate relationships (not direct attributes)**: source, tags, pools, social network accounts. These require a relationship traversal or a companion class; they will surface as `binding_source: "inferred"` if requested as direct bindings and block Maestro at `plan_approval`.
- **`View Candidate` task**: renders three parallel profile views (`Masked Candidate Profile`, `Prospect Profile`, `Candidate Profile`) selected by the viewer's security context. When picking an attachment point for a new layout, check which profile the PM will actually see at runtime.
- **Trimming the ask**: when a user requests a "summary" with fields spread across Candidate + Job Application + relationships, offer to narrow scope to direct Candidate attributes for an MVP. Keeps Maestro's Discover step at zero inferred regions.
