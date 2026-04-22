# Mode: rest-from-task

**Tier:** 2 (guarded build) • **Workspace switch:** Yes (`~/contexto`) • **Writes to SUV:** Yes (heavily, via Contexto workflow HITL gates)

"Convert this UI task to a full REST API." Takes a UI Task WID and orchestrates Contexto's three-workflow chain - `schema-analysis`, `schema-implementation`, `processing-creation` - to produce a complete REST API with GET, POST, PATCH, and DELETE operations, including processing.

This mode is an **orchestrator wrapper**, not a reimplementation. It handles pre-flight validation in the PM workspace, switches to `~/contexto` for each workflow phase, and tracks progress across phases. Each Contexto workflow retains its own step-by-step HITL gates (`[C] Continue / [E] Edit / [Q] Questions`) - this mode does not compress or skip them.

## Worked Example Prompts

- "Convert this UI task to a REST API: Task WID `<WID>`. Full CRUD."
- "Build REST API from the Interview Feedback task, `<WID>` - GET-only for v1."
- "Create REST endpoints for the Candidate Tags task (`<WID>`), target service `candidateTags`, scope `GET` + `POST` + `PATCH`."
- "Convert the Edit Job Requisition task (`<WID>`) to REST - reuse existing `jobRequisitions` service if one exists."

## Inputs

- **Task WID** (required) - the UI task to convert. Supported types: Convenience Task, Sequence Task, Web Service Task.
- **Target service name** (optional) - the XO Service to host the new resource. Defaults to inferring from the task's backing class name. If a service already exists for this class, the workflow reuses it.
- **API scope** (optional) - which operations to build. Defaults to full CRUD (`GET`, `POST`, `PATCH`, `DELETE`). The user can request any subset (e.g. `GET`-only, `GET` + `POST` + `PATCH`). Passed as `api_scope` to `schema-analysis`.

## Pre-Flight (run in PM workspace)

Before switching workspace, confirm with the user:

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed (dev SUV, credentials, MCPs reachable).
- [ ] Task WID captured. Verify it resolves via `ui_task_analysis_get` (XO MCP). If the user gave a name instead of a WID, resolve via `xo_search` first.
- [ ] Task type confirmed as one of: Convenience Task, Sequence Task, Web Service Task. Other task types (BEM Task, Element Task) are not supported by `schema-analysis`.
- [ ] API scope confirmed (default: full CRUD).
- [ ] Target service name confirmed (or left to workflow default).
- [ ] Contexto credentials: `~/contexto/.env` must contain `SUV_HOST`, `SUV_USERNAME`, `SUV_PASSWORD`. If missing, offer the safe bootstrap from [../SKILL.md](../SKILL.md#safe-bootstrap-when-env-is-missing).
- [ ] Contexto freshness: run `git -C ~/contexto log -1 --format=%cI`. If older than 7 days, tell the user to `git -C ~/contexto pull` before kicking off `schema-analysis`. This mode chains three Contexto workflows back-to-back; a stale local Contexto against a SUV with a newer XORC revision produces "unknown tool" errors mid-chain that look like MCP outages but are drift. Cheap to check, expensive to debug halfway through `schema-implementation`.
- [ ] Contexto capability discovery (optional but recommended for first-time users or when in doubt which slash command maps to a step): once workspace has switched to `~/contexto`, suggest the user run `/help` in a Contexto chat. It returns the live summary of available Contexto commands and capabilities for the active SUV's XORC revision. This prevents "unknown slash command" fumbles mid-chain.
- [ ] `cursor-app-control` is reachable (for workspace switch). If not, fall back to manual instructions.

Capture a brief summary of the task analysis output (task name, backing class, element count, domain list) to give the user context before proceeding.

## Three-Phase Flow

The full conversion runs through three Contexto workflows in sequence. Each phase requires a workspace switch to `~/contexto` and back. The user drives each workflow from the Contexto workspace.

```
Phase 1: schema-analysis         Phase 2: schema-implementation     Phase 3: processing-creation
(Steps 1-6)                      (Steps 1-11)                       (Steps 1-N)
┌─────────────────────┐          ┌─────────────────────┐            ┌─────────────────────┐
│ Understand task      │          │ Load plan + preflight│            │ Load schema + task   │
│ Investigate elements │          │ Create BOs           │            │ Wire DPU / PUMB / PU │
│ Analyse CRFs         │          │ Create CRFs          │            │ Create ProcessingOpts │
│ Compare existing API │          │ Confirm Service      │            │ Verify POST/PATCH     │
│ Design schema        │          │ Create Representations│           └─────────────────────┘
│ Implementation plan  │          │ Create Rep Content   │
└─────────────────────┘          │ Create SCR           │
  Output:                        │ Create Operations    │
  schema-analysis-wip.md         │ GET verification     │
  schema-design-wip.md           │ Review               │
  schema-implementation-wip.md   │ Complete             │
                                 └─────────────────────┘
                                   Output:
                                   Updated WIP with WIDs
```

### Phase 1: Schema Analysis

1. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`.
2. **Hand off.** Tell the user:
   > Switched to `~/contexto`. Open a new Agent chat and reference the schema-analysis workflow:
   > ```
   > Analyze [Task Name], [Task WID] and create the equivalent REST API.
   > API scope: [GET/POST/PATCH/DELETE as selected].
   > ```
   > The workflow file is at `xo-agents/workflows/schema-analysis/workflow.md`. Drag it into the chat or reference it.
3. **Do not attempt to run the workflow yourself.** The Contexto workflows use step-file architecture with their own HITL at every step boundary.
4. **Wait for completion.** The user tells this mode when Phase 1 is done. Expected artifacts in `~/contexto/wip/<slug>/` or `~/contexto/_bmad-output/`:
   - `schema-analysis-wip.md` (source analysis, element dispositions, CRF mappings)
   - `schema-design-wip.md` (expected API schema, representation design)
   - `schema-implementation-wip.md` (exact implementation plan with BO/CRF/Rep/RC/SCR/Op tables)
5. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.
6. **Checkpoint.** Confirm with the user: *"Phase 1 (schema-analysis) complete. Implementation plan ready. Proceed to Phase 2 (schema-implementation)?"*

### Phase 2: Schema Implementation

1. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`.
2. **Hand off.** Tell the user:
   > Now run the schema-implementation workflow against the plan produced in Phase 1:
   > ```
   > Execute the schema-implementation plan in [path to schema-implementation-wip.md].
   > ```
   > The workflow file is at `xo-agents/workflows/schema-implementation/workflow.md`. Drag it into the chat or reference it.
3. **Wait for completion.** This is the heaviest phase - it creates BOs, CRFs, Service, Representations, Representation Content, SCR, and Service Operations on the SUV. Each step has its own HITL gate. The user tells this mode when done.
4. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.
5. **Checkpoint.** Confirm with the user: *"Phase 2 (schema-implementation) complete. GET endpoints should be testable. Proceed to Phase 3 (processing-creation) for POST/PATCH/DELETE processing?"*
6. **Early exit option.** If the user requested GET-only scope, skip Phase 3 and proceed to End-of-Run. GET operations work without processing.

### Phase 3: Processing Creation

1. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`.
2. **Hand off.** Tell the user:
   > Now run the processing-creation workflow to wire POST/PATCH/DELETE processing:
   > ```
   > Create processing for [Service Name] using source task [Task WID]
   > and the representations from the schema-implementation output.
   > ```
   > The workflow file is at `xo-agents/workflows/processing-creation/workflow.md`. Drag it into the chat or reference it.
3. **Wait for completion.** This wires DPU, PUMB, PU, and Processing Options for the write operations.
4. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.

## Post-Completion

After Phase 3 (or Phase 2 for GET-only scope), summarise to the user:

- **What was built**: list the created artifacts (Service, Resources, Operations, Representations).
- **How to test**: suggest `suv_rest_call` via XO MCP for a quick smoke test, or cURL/Bruno for manual testing. Offer a sample request body if POST/PATCH were in scope.
- **Code review reminder**: per Contexto's Safe Harbour, the generated XO may be incomplete. The user should run the edit task on created objects to catch code exceptions before treating anything as production-ready.
- **Next steps**: offer to (a) run `wats-scenario` mode to build automated tests, (b) run `rest-scaffold` document sub-mode to generate an OpenAPI spec, or (c) stop.

## Tools Used

- XO MCP (PM workspace, pre-flight only, read-only):
  - `ui_task_analysis_get`, `xo_search` (resolve and validate the task WID).
- `cursor-app-control.move_agent_to_root` for workspace switches.
- Contexto workflows (user-driven, in `~/contexto` workspace):
  - `schema-analysis` (Phase 1)
  - `schema-implementation` (Phase 2)
  - `processing-creation` (Phase 3)

## Guardrails

- **Three HITL-gated phases.** Each Contexto workflow has its own per-step HITL. This mode does not compress, skip, or batch any of them.
- **Workspace switch is non-optional.** The Contexto workflows and their step files do not exist in the PM workspace. If `cursor-app-control` is unavailable, fall back to telling the user to open `~/contexto` manually.
- **Do not run workflows yourself.** The Contexto workflows use step-file architecture (`disable-model-invocation: true` patterns). They must be driven by the user in a Contexto-workspace chat.
- **Safe Harbour applies.** The generated XO is development-quality. Always remind the user to run edit tasks on created objects before check-in.
- **No auto-chaining.** After completion, offer next-step options but never auto-invoke `wats-scenario`, `rest-scaffold`, or any other mode.
- **Default-BO CRF creation pitfall** (schema-implementation, Step 4+). When the target class uses Workday's default Business Object rather than a named BO, Contexto's `class_report_field_create` tool struggles to resolve the BO automatically and loops or fails with "could not resolve business object". **Workaround**: create the **first** CRF manually via `class_report_field_create`, passing the BO WID explicitly. Once one CRF exists on the class against that BO, subsequent CRF creates on the same class succeed without explicit BO passing (Contexto uses the first CRF as the anchor). Advise the user of this pattern at the start of Step 4 when they are building CRFs on a new class; it is a known Contexto limitation, not user error.

## Non-goals

- **Editing existing REST services.** Use `rest-scaffold` for documenting or testing existing endpoints.
- **Auto-testing the built API.** Use `wats-scenario` for building WATS system tests after this mode completes.
- **Custom workflow creation.** Use Contexto's `/xo-workflow-builder` directly for building reusable analysis or review workflows.
- **Producing OpenAPI documentation.** Use `rest-scaffold` document sub-mode after this mode completes.

## End-of-run

- Workspace must be switched **back** to `product-manager-agent`. Confirm with the user.
- Do not write to `MISSION_LOG.md`. Do not invoke any rule. Do not chain into another mode.
- Ask the user if they want to run another mode. Do not assume.
