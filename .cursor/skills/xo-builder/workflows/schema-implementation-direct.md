# Direct Run Map - Schema Implementation

Use this map when `rest-from-task` executes schema implementation directly from the PM workspace.

## Inputs

- `schema-implementation-wip.md` (approved)
- `mapsToClass_decision` from Phase 2 preflight
- `api_scope`

## Output Artifacts

Update:

- `schema-implementation-wip.md` with created/updated WIDs and status.
- `objects-modified.json` with machine-readable object log.

## Step Sequence

1. **Load and Preflight**
   - Read plan and confirm required IDs are present.
   - Validate service/container references with:
     - `service_get`
     - `service_representation_workday_owned_get`
   - HITL: approve creation batch boundaries.

2. **Business Objects**
   - For rows marked New, create BOs as required.
   - Verify BO/class relationships:
     - `business_object_get`
     - `class_business_object_create` (if needed)

3. **Class Report Fields**
   - Update existing CRFs:
     - `class_report_field_get`
     - `class_report_field_patch`
   - Create new CRFs:
     - `class_report_field_create`
   - Resolve executable dependencies when needed:
     - `create_GRA_method`, `create_method_binding`, `method_binding_create`
     - `create_IOP_Method`, `IOP_invoke_method_ops_create`, `patch_IOP_Method`
   - HITL: approve each CRF write batch.

4. **Service**
   - Confirm target service exists and is writable:
     - `service_get`
   - If missing and non-creatable by tool surface, stop and escalate.

5. **Representations**
   - Create and patch representations:
     - `service_representation_workday_owned_create`
     - `service_representation_workday_owned_patch`
     - `service_representation_workday_owned_get`
   - Apply `mapsToClass_decision`.
   - HITL: explicit approval before create/patch.

6. **Representation Content**
   - Create/patch RC rows:
     - `representation_content_workday_owned_create`
     - `representation_content_workday_owned_patch`
     - `representation_content_workday_owned_get`
   - Verify `sampleData` shape is object, not string.

7. **Service Collection Resource**
   - Create/patch SCR:
     - `service_collection_resource_create`
     - `service_collection_resource_patch`
     - `service_collection_resource_get`

8. **Service Operations**
   - Create/patch operations:
     - `service_operation_create`
     - `service_operation_patch`
     - `service_operation_get`
   - Apply task domains for security provider.
   - HITL: approve operation creation batch.

9. **GET Verification**
   - Smoke GET collection + instance with:
     - `suv_rest_call`
   - Verify response shape against planned View representation fields.

10. **Review**
   - Run graph-constraint and object consistency checks.
   - Record blockers and unresolved items.

11. **Complete**
   - Mark status per object.
   - Prepare hand-off packet for Processing Creation.

## Required MCP Tools

- `service_get`
- `business_object_get`
- `class_business_object_create`
- `class_report_field_get`
- `class_report_field_create`
- `class_report_field_patch`
- `service_representation_workday_owned_get`
- `service_representation_workday_owned_create`
- `service_representation_workday_owned_patch`
- `representation_content_workday_owned_get`
- `representation_content_workday_owned_create`
- `representation_content_workday_owned_patch`
- `service_collection_resource_get`
- `service_collection_resource_create`
- `service_collection_resource_patch`
- `service_operation_get`
- `service_operation_create`
- `service_operation_patch`
- `suv_rest_call`

## Gate Rule

Stop the phase on first unresolved structural blocker (service missing, mapsToClass unresolved, invalid rep tree).
