# Mode: rest-from-task

**Tier:** 2 (guarded build) • **Workspace switch:** No • **Writes to SUV:** Yes (heavily, via XO MCP calls with explicit HITL gates)

"Convert this UI task to a full REST API." This mode executes all phases directly from the PM workspace.

Execution maps:

- `../workflows/schema-analysis-direct.md`
- `../workflows/schema-implementation-direct.md`
- `../workflows/processing-creation-direct.md`
- `../workflows/state-contract.md`

## Inputs

- **Task WID** (required) - supported types: Convenience Task, Sequence Task, Web Service Task.
- **Target service name** (optional).
- **API scope** (optional) - default full CRUD (`GET`, `POST`, `PATCH`, `DELETE`).

## Pre-Flight

Before execution:

- [ ] Global pre-flight from `../SKILL.md` passed (dev SUV, XO MCP reachable, dynamic tools >350).
- [ ] Task resolves via `ui_task_analysis_get` (or `xo_search` first if only a name is provided).
- [ ] Task type is supported.
- [ ] API scope and target service are confirmed.
- [ ] Artifact root is reserved: `docs/xo/rest-apis/<resource-slug>/artifacts/`.
- [ ] Rerun policy is explicit: reuse the same `artifacts/` filenames for the resource slug (latest-run semantics, no per-run subdirectories).
- [ ] `run-state.yaml` initialized per `../workflows/state-contract.md`.

## Four-Phase Flow

```
Phase 1: schema-analysis     Phase 2: schema-implementation  Phase 3: processing-creation  Phase 4: post-build + smoke
(PM workspace, direct steps) (PM workspace, direct steps)     (PM workspace, direct steps)  (PM workspace, direct steps)
┌────────────────────┐       ┌─────────────────────┐         ┌─────────────────────┐      ┌───────────────────────────┐
│ Understand task     │      │ Load plan + preflight│         │ Understand + inspect │      │ Toggle attach on new CRFs │
│ Investigate elements│      │ Create BOs           │         │ Plan DPU/PUMB/PU    │      │ POST singleton-doc clear  │
│ Analyse CRFs        │      │ Create CRFs          │         │ Create/patch options │      │ Register XO Agent Tools   │
│ Compare existing API│      │ Create reps + RC     │         │ Verify op linkage    │      │ Verify Edit rep mapsToClass│
│ Design schema       │      │ Create SCR + ops     │         └─────────────────────┘      │ Round-trip smoke (CRUD)   │
│ Implementation plan │      │ GET verification     │                                      │ Write PM-workspace index  │
└────────────────────┘       └─────────────────────┘                                      └───────────────────────────┘
```

### Phase 1: Schema Analysis (direct execution)

Use `../workflows/schema-analysis-direct.md`.

- Execute steps 1-6 directly with XO MCP tools.
- Write `schema-analysis-wip.md`, `schema-design-wip.md`, `schema-implementation-wip.md`.
- Keep HITL checkpoint before implementation-plan approval.
- Persist naming reconciliation in `schema-implementation-wip.md` frontmatter.

### Phase 2: Schema Implementation (direct execution)

Use `../workflows/schema-implementation-direct.md`.

#### Phase 2 pre-flight: Edit rep `mapsToClass` check

1. Identify `representsClass` for planned Edit representation.
2. Call `class_get` on `representsClass`; inspect subclasses.
3. If service exists, inspect existing Edit rep pattern via `service_description_get`.
4. Choose and persist one decision:
   - `derived-subclass`
   - `mirrors-existing-edit-rep`
   - `generate-class-based-processing`
5. HITL checkpoint: PM confirms decision before representation writes begin.

Then execute direct steps 1-11. Every write-heavy section requires explicit `approve`.

### Phase 3: Processing Creation (direct execution)

Use `../workflows/processing-creation-direct.md`.

- Execute Understand -> Investigate -> Plan -> Execute -> Review directly.
- Keep explicit HITL approval before each processing write batch.
- End phase with status per write operation: `ready`, `not_in_scope`, or `blocked_with_reason`.

### Phase 4: Post-Build Cleanup + Smoke

Phase 4 remains PM-workspace direct execution with six HITL steps:

1. Toggle attach on new CRFs.
2. POST singleton-doc clear.
3. XO Agent Tool registration.
4. Edit rep `mapsToClass` verify.
5. Round-trip smoke (CRUD).
6. Write PM-workspace index README.

Always update:

- `run-state.yaml`
- `objects-modified.json`
- `smoke-results.json`

## Tools Used

- **Discovery and analysis:** `ui_task_analysis_get`, `schema_analysis_get`, `xo_search`, `metadata_instance_get`, `class_get`, `business_object_get`, `class_report_field_get`, `service_description_get`.
- **Schema implementation writes:** `class_business_object_create`, `class_report_field_create`, `class_report_field_patch`, `service_representation_workday_owned_create`, `service_representation_workday_owned_patch`, `representation_content_workday_owned_create`, `representation_content_workday_owned_patch`, `service_collection_resource_create`, `service_collection_resource_patch`, `service_operation_create`, `service_operation_patch`.
- **Processing creation:** `service_operation_processing_option_create`, `service_operation_processing_option_patch`, `linked_operation_processing_option_create`, `linked_operation_processing_option_patch`, `method_binding_create`, `dpu_derived_process_update_method_patch` (plus supporting reads).
- **Validation and smoke:** `suv_rest_call`, `service_operation_workday_owned_get`, `service_operation_workday_owned_patch`, `service_representation_workday_owned_get`, `service_representation_workday_owned_patch`, `xo_agent_tool_registration_create`.

## Guardrails

- Four HITL-gated phases are mandatory.
- No inferred approval for writes - require explicit `approve`.
- Apply bounded retries for tool failures: retry only with new evidence, maximum 2 attempts for the same failure shape, then escalate.
- No auto-chaining into `wats-scenario` or `rest-scaffold`.
- Do not write to `MISSION_LOG.md`.
- Dev SUV only.
- No silent overwrite of `docs/xo/rest-apis/<slug>/README.md` without second explicit approval.

## Non-goals

- Editing unrelated existing REST services (use `rest-scaffold`).
- End-to-end test authoring in this mode (use `wats-scenario`).
- Custom reusable workflow authoring (use Contexto `/xo-workflow-builder` directly).

## End-of-run

Return:

- What was built (object list + WIDs).
- Phase recap (`OK` / `FIXED` / `DRIFT` / `SKIPPED`).
- Typed wrapper names.
- Artifact paths under `docs/xo/rest-apis/<slug>/`.
- Next-step options (WATS, OpenAPI, stop).
