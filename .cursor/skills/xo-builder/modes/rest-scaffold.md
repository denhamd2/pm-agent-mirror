# Mode: rest-scaffold

**Tier:** 2 (guarded build) • **Workspace switch:** Yes (`~/contexto`) • **Writes to SUV:** Document sub-mode no; Test sub-mode yes (via Contexto HITL)

"Document this REST API" or "build a REST test." Two sub-modes:

- **Document (`document`)** - generate an OAS 3.2.0 spec for an existing XpressO REST Service Resource or Service Operation on your SUV. Non-destructive: writes to `~/contexto/docs/openapi/`.
- **Test (`test`)** - build a WATS System Test for a specific endpoint. Delegates HITL to Contexto's own workflow.

Both sub-modes switch workspace to `~/contexto` and hand off to the relevant Contexto slash command. This mode is a **wrapper**, not a reimplementation.

## Worked Example Prompts

- "Use `/wats-rest-builder` to create a System Test for Service Collection Resource `XOAgents/buildAttributeMethod (labs - ) +TG`, `b84da77f255f100014dd2e3779dd0000`."
- "Document the `/recruiting/v4/jobApplications` endpoint - generate an OpenAPI spec."
- "Generate an OpenAPI 3.2.0 spec for the Candidate Offers Service Resource (`<WID>`) - default output path."
- "Build a REST test for the Approve event-step endpoint on the Offer BP (`POST /businessProcess/v1/eventSteps/{ID}/approve`)."
- "Scaffold WATS tests for Service Operation `<WID>` - smoke coverage only."

## Sub-mode A: Document

### Inputs

- **One of:**
  - Service Resource WID (preferred - generates a full resource spec), or
  - Service Operation WID (generates a single-operation spec), or
  - Human-readable name (e.g. "Candidate Offers Service Resource") - mode will ask you to resolve it via `xo_search` in the PM workspace before switching.
- Optional: output file name override. Default follows Contexto's own convention (`docs/openapi/<serviceName>.yaml`).

### Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Target WID resolved (use `xo_search` and `service_description_get` from PM workspace **before** switching if needed).
- [ ] Target is an existing REST resource/operation (not "I want to create one" - that's a different flow).
- [ ] User understands output lives in `~/contexto/docs/openapi/`, not in `product-manager-agent`.

### Flow

1. **Resolve target (PM workspace).** If the user gave a name, run `xo_search` (XO MCP) to resolve it to a WID. Confirm the resolution with the user.
2. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`.
3. **Hand off.** Tell the user exactly what to type:
   > Switched to `~/contexto`. Now run:
   > ```
   > /generate-openapi-spec
   > ```
   > When prompted, paste the Service Resource WID: `<WID>`.
4. **Do not attempt to run the slash command yourself.** Contexto's slash commands use `disable-model-invocation: true`. They must be typed by the user.
5. **After the command completes**, the user tells the mode it's done (or a file appears at `~/contexto/docs/openapi/<name>.yaml`). Confirm file path to user.
6. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.
7. **Report.** Tell the user: *"Spec generated at `~/contexto/docs/openapi/<name>.yaml`. Back in product-manager-agent workspace."*

### What this sub-mode does NOT do

- Modify SUV state. OpenAPI generation reads service metadata only.
- Invoke live sample fetches beyond what `/generate-openapi-spec` does internally.
- Create a new service. Use [`rest-from-task`](rest-from-task.md) to build a full REST API from a UI task (orchestrates Contexto's `schema-analysis` -> `schema-implementation` -> `processing-creation` chain).

## Sub-mode B: Test

### Inputs

- **Service Collection Resource WID** (SCR WID) - the endpoint under test.
- Optional: **sample instance WID** - a real instance of the resource to use as test data.
- Optional: **test goal** - free text, e.g. "validate that POST returns 201 and the created record is retrievable via GET."

### Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] SCR WID captured (use `xo_search` + `service_collection_resource_get` from PM workspace before switching if needed).
- [ ] User understands this writes a WATS system test to their SUV (`wats_system_test_create`, `wats_scenario_create`, etc. are called by Contexto's workflow).
- [ ] User understands HITL is inside Contexto's workflow, not in xo-builder.

### Flow

1. **Resolve target (PM workspace).** Use `xo_search` / `service_collection_resource_get` to confirm the SCR exists.
2. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`.
3. **Hand off.** Tell the user exactly what to type:
   > Switched to `~/contexto`. Now run:
   > ```
   > /wats-rest-builder
   > ```
   > When prompted, paste the SCR WID: `<WID>` (and sample instance WID `<WID2>` if you have one).
4. **Do not attempt to run the slash command yourself.** It executes Contexto's `wats-rest-plan` and `wats-rest-build` workflows with their own HITL checkpoints.
5. **After completion**, the user confirms the WATS test was created. Contexto's events are at `~/contexto/wip/<slug>/events.jsonl`.
6. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.
7. **Report.** Tell the user: *"WATS system test built via `/wats-rest-builder`. Event log at `~/contexto/wip/<slug>/events.jsonl`. Back in product-manager-agent workspace."*

## Tools Used

- XO MCP (PM workspace, resolution only, read-only):
  - `xo_search`, `service_description_get`, `service_collection_resource_get`, `service_operation_get`.
- `cursor-app-control.move_agent_to_root` for the workspace switch.
- Contexto slash commands (typed by the user):
  - Document sub-mode: `/generate-openapi-spec`.
  - Test sub-mode: `/wats-rest-builder`.

## Guardrails

- **No new services.** Both sub-modes target **existing** REST endpoints. If the user wants to create a service from scratch, route to `rest-from-task` mode (or Contexto's `/xo-workflow-builder` directly for non-task-based service creation).
- **Workspace switch is non-optional.** The Contexto slash commands do not exist in the PM workspace. If `cursor-app-control` is unavailable, fall back to telling the user to open `~/contexto` manually.
- **Do not fabricate** OpenAPI paths or schemas. Let `/generate-openapi-spec` do its job; this mode's value is the pre-flight, workspace hand-off, and clean return.
- **No MISSION_LOG writes.** All artefacts live in `~/contexto/`.

## Non-goals

- Creating new REST services from scratch. Use [`rest-from-task`](rest-from-task.md) for that.
- Editing an existing service's schema or behaviour (belongs in a proper epic).
- Running the WATS tests after build (that's a separate Contexto flow).
- Bulk documentation or bulk test creation across many services.

## End-of-run

- Workspace must be switched **back** to `product-manager-agent`. Confirm with the user.
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
- **Post-write handoff (artefact-generation, NOT UI-observable)**: per the orchestrator routing in [000-master-orchestrator.mdc](../../../rules/000-master-orchestrator.mdc), `@xo-code-reviewer` is auto-invoked on any WATS test artefacts created (test sub-mode) after this mode completes. `@qa-engineer` does **NOT** run in parallel - this mode is OpenAPI document generation or WATS test scaffolding, not a UI-observable change. Reviewer findings feed back to `@xo-developer` for triage per [Advisory Behaviour #17](../../../agents/xo-developer-refs/advisory-playbook.md). Iteration cap: 2 cycles.
