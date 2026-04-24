# rest-from-task State and Artifact Contract (PM Workspace)

All direct-execution runs persist state under:

`docs/xo/rest-apis/<resource-slug>/artifacts/`

## Required Files

- `run-state.yaml` - phase status and canonical IDs.
- `schema-analysis-wip.md` - source/disposition analysis.
- `schema-design-wip.md` - representation and API design.
- `schema-implementation-wip.md` - implementation plan + realized WIDs.
- `processing-wip.md` - processing plan and execution status.
- `objects-modified.json` - machine-readable created/updated object ledger.
- `smoke-results.json` - round-trip smoke request/response snapshots.

## `run-state.yaml` Keys

```yaml
run_id: <timestamp-or-uuid>
task_wid: <wid>
task_name: <string>
api_scope: [GET, POST, PATCH, DELETE]
resource_slug: <kebab-case>
phase_status:
  phase_1_schema_analysis: pending|in_progress|complete|blocked
  phase_2_schema_implementation: pending|in_progress|complete|blocked
  phase_3_processing_creation: pending|in_progress|complete|blocked
  phase_4_post_build: pending|in_progress|complete|blocked
canonical_wids:
  backing_class_wid: <wid>
  service_wid: <wid>
  scr_wid: <wid>
  view_rep_wid: <wid>
  edit_rep_wid: <wid>
  get_operation_wid: <wid>
  post_operation_wid: <wid>
  patch_operation_wid: <wid>
  delete_operation_wid: <wid>
maps_to_class_decision: derived-subclass|mirrors-existing-edit-rep|generate-class-based-processing
created_object_counts:
  business_objects: 0
  class_report_fields: 0
  representations: 0
  representation_content: 0
  service_collection_resources: 0
  service_operations: 0
  processing_options: 0
smoke_summary:
  post: pass|drift|fail|skipped
  get_after_post: pass|drift|fail|skipped
  patch: pass|drift|fail|skipped
  get_after_patch: pass|drift|fail|skipped
  delete: pass|drift|fail|skipped
```

## Write Policy

- Update `run-state.yaml` at phase boundaries and after each approved write batch.
- Never overwrite an existing run directory; create a new run subdirectory when rerunning the same resource.
- `README.md` at `docs/xo/rest-apis/<resource-slug>/README.md` is the human-facing summary. Artifacts stay under `artifacts/`.
