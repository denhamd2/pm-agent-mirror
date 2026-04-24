# Direct Run Map - Processing Creation

Use this map when `rest-from-task` executes processing creation directly from the PM workspace.

## Inputs

- Approved implementation artifacts from prior phases.
- Service operation WIDs (POST/PATCH/DELETE as scoped).
- Representation WIDs (View/Edit and optional nested reps).

## Output Artifacts

Update:

- `processing-wip.md`
- `objects-modified.json`
- `schema-implementation-wip.md` (`phase_3_processing_status` section)

## Step Sequence

1. **Understand**
   - Validate source object and operation scope:
     - `metadata_instance_get`
     - `service_operation_get`
   - Classify flow: create/update/delete.

2. **Investigate UI + REST Surfaces**
   - Extract task-side signals:
     - `sequence_task_get` or `ui_task_analysis_get`
     - `control_transaction_get` (toolbar and CT signal checks)
   - Extract API-side signals:
     - `service_representation_workday_owned_get`
     - `service_operation_get`
   - Persist RC mapping inputs for execution.

3. **Investigate Existing Processing**
   - Crawl current processing chains:
     - `service_operation_processing_option_get`
     - `linked_operation_processing_option_get_tg`
     - `method_binding_get`
     - `dpu_derived_process_update_method_get`
   - Decide create vs reuse vs patch per operation.

4. **Plan**
   - Build deterministic creation/patch plan for:
     - DPU
     - PUMB
     - PU
     - SOP/LOP lines
   - Resolve required class/workset references:
     - `class_get`
     - `class_attributes_get`
     - `xo_search` (fallback)
   - HITL: approve full processing plan.

5. **Execute**
   - Create/patch chain objects as approved:
     - `service_operation_processing_option_create` / `_patch`
     - `linked_operation_processing_option_create` / `_patch`
     - `dpu_derived_process_update_method_create` / `_patch`
     - `method_binding_create` / `method_binding_get`
     - `service_operation_patch` (attach option lines)
   - Use case helpers for constructor IOP / BPF linked options as needed.
   - HITL: batch approval before each write set.

6. **Review**
   - Re-read operations + processing links.
   - Confirm POST/PATCH/DELETE processing connected and enabled.
   - Mark unresolved drift for Phase 4 and follow-up.

## Required MCP Tools

- `metadata_instance_get`
- `sequence_task_get`
- `ui_task_analysis_get`
- `control_transaction_get`
- `service_operation_get`
- `service_operation_patch`
- `service_representation_workday_owned_get`
- `service_operation_processing_option_get`
- `service_operation_processing_option_create`
- `service_operation_processing_option_patch`
- `linked_operation_processing_option_get_tg`
- `linked_operation_processing_option_create`
- `linked_operation_processing_option_patch`
- `method_binding_get`
- `method_binding_create`
- `dpu_derived_process_update_method_get`
- `dpu_derived_process_update_method_patch`
- `class_get`
- `class_attributes_get`
- `xo_search`

## Gate Rule

Never proceed to Phase 4 until POST/PATCH/DELETE operations each have an explicit processing status of `ready`, `not_in_scope`, or `blocked_with_reason`.
