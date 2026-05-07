# Direct Run Map - Schema Analysis

Use this map when `rest-from-task` runs Schema Analysis directly from the PM workspace.

## Inputs

- `task_wid` (required)
- `api_scope` (`ALL` by default)
- `target_service` (optional)

## Output Artifacts

Write under `docs/xo/rest-apis/<resource-slug>/artifacts/`:

- `schema-analysis-wip.md`
- `schema-design-wip.md`
- `schema-implementation-wip.md`

## Step Sequence

1. **Understand**
   - Validate source task with:
     - `ui_task_analysis_get` (task type / domains / element contents)
     - `xo_search` (service/resource lookup when name-based fallback is needed)
     - `metadata_instance_get` (when type ambiguity exists)
   - Confirm task type is supported: Convenience Task, Sequence Task, Web Service Task.
   - **Safe Harbour warning** (display before HITL):
     > The XO MCP schema toolchain is under active development. Objects created in this workflow may contain incomplete processing or missing bindings. If this API is destined for production check-in, you must run Instance Edit on each created object to catch code exceptions before CRS.
   - HITL: confirm task identity + API scope.

2. **Investigate**
   - Prefer `schema_analysis_get` for schema-ready element extraction.
   - Build source table with include/skip disposition.
   - Preserve per-element: work data, executable, display options, validations.
   - HITL: confirm include/skip edge cases before CRF analysis.

3. **Analyse**
   - Resolve CRFs from executable/context with:
     - `class_report_field_get`
     - `business_object_get`
     - `class_get` (hierarchy validation)
   - For ambiguous executable class vs representation class, validate superclasses before mapping direct RC.
   - HITL: confirm CRF mapping for non-obvious fields.

4. **Compare**
   - Optional when target service exists.
   - Crawl existing rep structures:
     - `service_representation_workday_owned_get`
     - `representation_content_workday_owned_get`
     - `class_report_field_get`
     - `service_description_get` (constraints)
   - Output gap matrix: Native / Reuse / New.

5. **Design**
   - Produce representation plan (View/Edit/Summary/Reference).
   - Define field-level alias and embed strategy.
   - Validate class hierarchy assumptions with `class_get`.
   - HITL: approve representation topology before implementation plan.

6. **Implementation Plan**
   - Materialize exact object-change tables for:
     - BOs
     - CRFs
     - Service
     - Representations
     - Representation Content
     - Service Collection Resource
     - Service Operations
   - Pre-resolve WIDs needed later (where feasible):
     - `business_object_get`
     - `service_representation_workday_owned_get` (service container / version references)
   - HITL: approve implementation plan before Schema Implementation phase.

## Required MCP Tools

- `ui_task_analysis_get`
- `schema_analysis_get`
- `xo_search`
- `metadata_instance_get`
- `class_get`
- `business_object_get`
- `class_report_field_get`
- `service_representation_workday_owned_get`
- `representation_content_workday_owned_get`
- `service_description_get`

## Gate Rule

No downstream writes are allowed until the PM approves the completed `schema-implementation-wip.md`.
