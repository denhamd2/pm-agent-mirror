# Mode: page-discovery

**Tier:** 1 (read-only) • **Workspace switch:** No • **Writes to SUV:** No

"Explain this Workday page to me." Reverse-engineer any xoUi, task, or SUV screen into a narrated summary: what it does, which elements render, what data it binds to, which domains secure it, and which public or internal APIs could reach the same data.

Runs entirely from the PM workspace using `user-xo-mcp` tools. No workspace switch. No writes.

## Worked Example Prompts

- "Explain this SUV page to me: `https://<SUV_HOST>/d/xoTasks/<WID>`."
- "Reverse engineer the View Candidate task."
- "What does the `Edit Job Requisition` xoUi do - walk me through the elements, bindings, and domains."
- "I have element WID `<WID>` - which task contains it and what data does it bind to?"

## Inputs (any one of these)

- **SUV URL** containing a task or xoUi reference (e.g. `https://<tenantHostname>/.../xoTasks/<WID>` or `.../xoUi/<WID>`).
- **xoUi element WID** (32-char hex).
- **Task WID** (Convenience Task, Sequence Task, Element, BEM, or Web Service Task).
- **Task name** (free text, e.g. "Edit Candidate Summary") - the mode resolves this to a WID via `xo_search`.

If the user provides only a description ("the page where I review candidate offers"), ask them for one of the above before proceeding. Do not guess.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] At least one input (above) captured.
- [ ] User understands this mode is **read-only** - no SUV changes will be made.

## Tools Used

All from `user-xo-mcp`:

- `xo_search` - resolve name to WID. Try multiple index types (e.g. `task: <name>`, `element: <name>`, `service: <name>`).
- `ui_task_analysis_get` - core tool. Returns `task_id`, `task_type`, `task_domains`, and `element_contents[]` with labels, validations, proposed classes, and work-data types.
- `class_get` - fetch backing class metadata once `ui_task_analysis_get` reveals proposed classes.
- `class_data_view_get` - see the data view for a class (what fields are exposed).
- `service_description_get` - if the task is REST-backed, fetch the service-level OpenAPI description.
- `service_operation_get` / `service_collection_resource_get` - drill into specific operations.
- `element_content_get` - inspect individual element content when needed.
- `method_binding_get` - reveal how UI response methods bind to data.
- `suv_rest_metadata_api_call` - when a task is BP-backed, call `GET /businessProcess/v1/types` to look up the BP type descriptor for the task's class and surface available event-step actions.

Pinned public-API specs consulted (read from disk, no MCP):

- [`recruiting_v4_20260418_oas2.json`](../../../../research/workday-public-apis/recruiting_v4_20260418_oas2.json), [`staffing_v7_20260418_oas2.json`](../../../../research/workday-public-apis/staffing_v7_20260418_oas2.json), [`person_v4_20260418_oas2.json`](../../../../research/workday-public-apis/person_v4_20260418_oas2.json) - core Recruiting-adjacent reachability.
- [`businessProcess_v1_20260418_oas2.json`](../../../../research/workday-public-apis/businessProcess_v1_20260418_oas2.json) - if the task is BP-backed, cite the relevant `POST /eventSteps/{ID}/<action>` endpoint for each action available on that BP type.

All read-only. Nothing mutates the SUV.

## Flow

1. **Resolve input to WID.**
   - If user gave a URL, extract the WID from the path.
   - If user gave a WID, use it directly.
   - If user gave a name, call `xo_search` with two or three index variants in parallel (`task: <name>`, `element: <name>`). Present the top 3 matches ranked by `searchScore` and ask the user to confirm which one if ambiguous.

2. **Fetch UI task analysis.**
   - Call `ui_task_analysis_get` with `instance_id = <resolved WID>`. Start with `validations_only: false` for the full picture.
   - Capture: `task_id`, `task_type`, `task_domains[]`, `element_contents[]`.

3. **Enrich in parallel.** For every unique `proposed_class` in `element_contents[]`, fetch `class_get` in parallel. If any elements have `built_by_executable`, fetch `method_binding_get` for those executables in parallel.

4. **Check for REST surface.** If any domain descriptor references a service, call `service_description_get` for that service. Also check the pinned OAS files in [`research/workday-public-apis/`](../../../../research/workday-public-apis/) for a matching resource - if the task reads/writes worker, person, job, or recruiting data, one of the core specs (Recruiting v4 / Staffing v7 / Person v4) likely has a matching endpoint.

5. **Detect backing Business Process (BP).** Some xoUi tasks represent steps in a Workday business process (approvals, hires, offers, check-ins). Detect this and surface the BP context:
   - Signals that the task is BP-backed:
     - `task_type` or the backing class name includes tokens like `Event`, `Approve`, `Review`, `Hire`, `Offer`, `OrganizationAssignment`, `JobChange`, `CheckIn`, `Questionnaire`, `ToDo`.
     - Backing class metadata (`class_get`) returns a class associated with a BP definition, or `method_binding_get` exposes binding methods named `approve`, `deny`, `sendBack`, `reassign`, `cancel`, or `rescind`.
     - The task belongs to a domain explicitly named after a BP type (e.g. `Manage: Offer`, `Manage: Hire`).
   - If BP-backed:
     - Call `GET /businessProcess/v1/types` via `suv_rest_metadata_api_call` and grep the `businessProcessTypeView_*` entries by name to find the matching BP type (e.g. "Offer", "Hire", "Change Job"). Optionally `GET /types/{ID}` for detail.
     - Surface: BP type name + ID, whether this task maps to a specific **event step** (Initial, Approval, To Do, Questionnaire, Complete).
     - Cite the relevant public event-step API endpoints for the actions available on this step: `POST /eventSteps/{ID}/approve`, `/deny`, `/sendBack`, `/reassign`, `/toDo`, `/questionnaire`, plus event-level `POST /events/{ID}/cancel` and `/rescind`.
   - If not BP-backed: skip this step and note "Not BP-backed" in the narration.

6. **Narrate.** Produce a markdown summary with:
   - **What the page does** - one-paragraph plain-English summary derived from task descriptor + element labels.
   - **Elements and their bindings** - table with columns: Element label, Work data type (singular/nonsingular), Backing class, Has validations (Y/N).
   - **Security** - which domains secure this task (from `task_domains[]`).
   - **Backing business process** (only when BP-backed):
     - BP type name + ID
     - Event-step kind (Initial / Approval / To Do / Questionnaire / Complete)
     - Public event-step actions available (list each with `businessProcess_v1` endpoint path)
   - **Data access paths** - "This data is reachable via:" sub-bullets:
     - Internal XO REST (list any matching `suv_rest_metadata_api_call` resource paths)
     - Public REST (list any matching endpoint from the pinned OAS specs, with file path + `#/paths/...`)
     - Public WQL (note whether the backing class maps to a queryable data source via `wql-query` mode)
     - SOAP (note the relevant WSDL if applicable)
   - **Non-goals** - explicit note: "This analysis was read-only. If you want to edit anything, use `copy-edit`, `validation-edit`, or `prompt-edit` mode. If you want to run the approval programmatically, the BP endpoints above are the ones to hit."

7. **Offer next step (do not auto-run).** Ask: "Do you want to (a) inspect a specific element, (b) run advanced analysis on all elements, (c) edit copy on one of these elements, (d) add a validation, (e) pull live data for this page with `wql-query`, (f) convert this task to a REST API, or (g) stop?" Respect the user's answer. Do not chain modes without explicit trigger.

## Advanced Analysis (optional, user-triggered via next-step option b)

A deeper per-element investigation that produces structured documentation for each element content and its validations. Run this when the user needs a comprehensive task reference document (e.g. before designing a REST API equivalent, or for onboarding documentation).

### Field Type Codes

Determine the Field Type Code from `work_data_type` on each element content:

| Code | Work data type |
|---|---|
| BL | Boolean |
| CL | Class |
| RL | Relationship |
| WS | Work Set |
| TX | Text |
| EL | Element |
| DT | Date |
| NU | Number |
| EN | Enumeration |

### Per-element deep-dive

For each element content in the `element_contents` array from `ui_task_analysis_get`:

1. Call `element_content_get` with `field_groups=["core", "display", "label", "validations", "values"]` to get detailed data.
2. Create a section header: `### [Element Content Descriptor] [Field Type Code], [Element Content WID]`
3. Document:
   - **BEM** (built_by_executable): the executable that builds this element content
   - **Display options**: all active display options (e.g. Not Enterable, Submit Not Enterable, Required, Hidden)
   - **Derived/dynamic display options**: any condition-driven display logic
   - **Condition logic**: boolean expressions or evaluate-conditions methods controlling visibility or editability
   - **Built-by executables**: method bindings and their expected outcomes
   - **Dependencies**: references to other element contents, classes, or validations

### Per-validation deep-dive

For each validation (from `ui_task_analysis_get` response and `derivedValidation` from `element_content_get`):

1. Use `validation_get` for detailed validation data if needed.
2. Create a section header: `### [Validation Descriptor], [Validation WID]`
3. Document:
   - **Validation type**: element validation, reusable validation, derived validation
   - **Error message text**: the user-facing message
   - **Validation parameters**: any configurable thresholds or values
   - **Source WID/descriptor**: the validation definition
   - **True/false conditions**: what triggers the validation
   - **Expected outcome**: what happens when the validation fires (block save, warning, info)
   - **Severity**: error, warning, or informational
4. List multiple validations on the same element content separately.

### Output format

Append the advanced analysis as a new section in the narration markdown, after the standard summary:

```markdown
## Advanced Element Analysis

### Help Text [TX], abcd1234...
- **BEM**: HelpText@getHelpText
- **Display**: Required (display option), Submit Not Enterable
- **Dependencies**: none

### Favourite Class [CL], efgh5678...
- **BEM**: XOUIToRESTMCPDemo@getFavouriteClass
- **Display**: none
- **Validation**: XO UI To REST MCP Demo CP-You need to have a favourite class.-, 81c0...
  - Type: element validation
  - Message: "You need to have a favourite class."
  - Severity: error (blocks save)
```

After completing the advanced analysis, return to the next-step menu. Do not auto-chain into another mode.

## Critical: WIDs returned are NOT xoUi element WIDs

The WIDs you see in the narration (`element_content_wid` values from `ui_task_analysis_get`) are **metadata template definitions**, not instantiated xoUi elements on your SUV. They look identical (32-char hex) but are not interchangeable. Specifically:

- They cannot be used as `suv_target_element_id` inputs for `modulr-page` Sub-mode A.
- Probing them against `GET /ors/super/services/xoUi/v1/elements/{ID}` returns 404.

If the user wants to attach a ModulR layout after running this mode, direct them to either:

- **Browser URL (preferred)**: navigate to the target page on the SUV and copy the WID from the URL pattern `https://<SUV_HOST>/d/xoUi/<WID>`.
- **List endpoint**: `GET /ors/super/services/xoUi/v1/elements` returns instantiated elements with their `id`, `descriptor`, and bindable `workData`. Client-side filter by descriptor (server-side `?descriptor=` is ignored).

Flag this at narration time if the user's next intent is a ModulR build, not a read-only analysis.

## Output example (abridged)

```markdown
## Page: Review Candidate Offer (Task WID: abcd...)

**What it does**: Review and approve a candidate's offer letter before release.

**Elements** (7 total)
| Element | Work data | Class | Validations |
|---|---|---|---|
| Candidate Name | instance - singular | Candidate | No |
| Offer Amount | numeric | OfferAmount | Yes (2) |
| Start Date | date | Date | Yes (1) |
| Offer Letter | text | WordBucket | No |
| ... | ... | ... | ... |

**Security**: Tasks secured by domains: `Set Up: Recruiting`, `Manage: Candidate Offer`.

**Backing business process**: `Offer` (BP type ID `<WID>`). This task is an **Approval** step.
- `POST /businessProcess/v1/eventSteps/{ID}/approve`
- `POST /businessProcess/v1/eventSteps/{ID}/deny`
- `POST /businessProcess/v1/eventSteps/{ID}/sendBack` (targets from `GET /values/sendBack/to/`)
- `POST /businessProcess/v1/eventSteps/{ID}/reassign`
- `POST /businessProcess/v1/events/{ID}/cancel`, `/rescind` (event-level, not step-level)

**Data access paths**:
- Internal XO REST: `recruiting/labs/candidateOffers/{ID}` (GET, PATCH)
- Public REST: none - `candidateOffer` resource is not exposed in Recruiting v4 OAS spec.
- Public WQL: the `Offer` class is likely queryable via WQL (data source `allOffers` or similar); use `wql-query` mode to confirm and pull fixture data.
- Gap noted: public API cannot currently read or write candidate offers directly, but the approval step itself can be actioned via Business Process v1.
```

## Non-goals

- Writing anything to the SUV.
- Auto-invoking another mode.
- Running validations or scripts.
- Explaining implementation details beyond what XO MCP returns.
- **Returning xoUi element WIDs suitable for ModulR layout attachment.** This mode returns `element_content_wid` values which are metadata templates. For a live xoUi element WID, use the browser URL pattern or the `/ors/super/services/xoUi/v1/elements` list endpoint (see "Critical" section above).

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Return to the user with the narrated summary. Ask if they want another mode. Do not assume.
