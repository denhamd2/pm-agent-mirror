# Mode: wats-scenario

**Tier:** 2 (guarded build) • **Workspace switch:** Yes (`~/contexto`) • **Writes to SUV:** Yes (via Contexto HITL for REST flows; via diff-approve batched XO MCP calls for UI flows)

"Build a WATS scenario for this flow." Creates a WATS scenario (optionally wrapped in a suite and system test) covering a Workday flow. Two flow types, dispatched by input:

- **REST flow** - user provides an endpoint (SCR WID). Delegates to [rest-scaffold](rest-scaffold.md) test sub-mode, which wraps Contexto's `/wats-rest-builder` workflow.
- **UI flow** - user provides a task WID. Builds a scenario with batched `wats_scenario_create` + `wats_scenario_wats_scenario_line_create` calls directly from XO MCP, with a diff-approve HITL on the entire batched plan before any writes.

## Worked Example Prompts

- "Use `/wats-rest-builder` to create a System Test for Service Collection Resource `<name>`, `<WID>`." *(REST flow)*
- "Build a WATS scenario for the Edit Candidate Summary task (`<WID>`): open the task, edit the full name, save, confirm it persisted." *(UI flow)*
- "Create a test scenario for the Offer Approval flow - POST an offer, approve it via `/businessProcess/v1/eventSteps/{ID}/approve`, confirm state." *(REST flow)*
- "Scaffold a test for task `<WID>` - attach to existing suite `<WID>`."

## Inputs

- **Flow type** - REST or UI (mode asks if ambiguous).
- If REST: **SCR WID** (Service Collection Resource WID) + optional sample instance WID.
- If UI: **Task WID** + a description of the scenario to test (e.g. "Submit an offer with valid data and confirm it appears in Offers Pending Approval").
- Optional: **existing suite WID** to attach the scenario to, or confirmation that a new suite should be created.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Flow type identified.
- [ ] Target WID resolved.
- [ ] Scenario goal captured in one sentence.
- [ ] User acknowledges this writes WATS objects (scenario, lines, potentially suite, system test) to their dev SUV.

## Tools Used

- **REST flow** - delegates to [rest-scaffold](rest-scaffold.md) test sub-mode. All the underlying tools are Contexto's.
- **UI flow** (direct XO MCP):
  - `ui_task_analysis_get` - understand the task's elements and validations (used to draft scenario lines).
  - `wats_scenario_create` - create the scenario container.
  - `wats_scenario_wats_scenario_line_create` - create each scenario line (a step in the scenario).
  - `wats_suite_create` - create a suite if requested.
  - `wats_system_test_create` - optionally wrap scenarios into a system test.
  - `xo_search` - resolve any names to WIDs (task name, element name, etc.).

## Flow

### Optional pre-authoring: runtime-shape capture

**When to run.** Before generating a scenario from a REST API design contract, check whether the live runtime shape matches the design. Authoring tests against a contract the API doesn't keep wastes authoring effort (the scenario passes design review but fails at execution) and obscures real regressions (when everything fails, nothing is a signal). Runtime-shape capture is a 30-second read-only step that makes the difference between scenarios asserting on runtime truth vs scenarios asserting on aspirational design.

**When to skip.** Skip the hook if any of these hold:
- UI flow (runtime shape capture is REST-specific; UI flows assert on element presence, not response bodies).
- The API was built with `rest-from-task` and Phase 4 already ran - the smoke drift table lives in `~/contexto/_bmad-output/implementation-artifacts/schema-implementation-<slug>.md` frontmatter as `phase_4_smoke_drift:` and can be consumed directly without a fresh round-trip. **Prefer reuse over re-running**; a re-run churns SUV state for no new information.
- The user has explicitly confirmed the contract is stable (e.g. a pinned public OAS in `research/workday-public-apis/`).

**Inputs.** A resource URL (required), optionally a sample instance WID (skip POST and use this for GET/PATCH/DELETE if provided), optionally a scoped operation list (default: full CRUD).

**Sequence** (read-only where possible, one optional minimal write):

1. **Reuse existing Phase 4 smoke drift if available.** If this API was built with `rest-from-task` today, check for `phase_4_smoke_drift:` in the `schema-implementation-wip.md` frontmatter. If present, use it verbatim and skip straight to step 4. Log the reuse in the run summary.
2. **Otherwise, run a lightweight round-trip via `suv_rest_call`.** If a sample instance WID is provided: GET + (optional) PATCH + GET + DELETE against that instance. If not provided and POST is in scope: ask the user for approval to create one synthetic instance (one write, smallest possible body), then GET + DELETE; otherwise, GET-only against a real instance list (`GET /<resource>?limit=1`).
   - HITL diff recap before any write:
     > *"About to run a lightweight runtime-shape capture against `<resource URL>`. `<operation list>`. If POST is included, one synthetic instance will be created and deleted at the end. Approve, skip capture, or edit the op list?"*
3. **Build the drift table** - same shape as `rest-from-task` Phase 4 step 5 so outputs are interchangeable:

   | Op | Status | Expected (design / View rep) | Actual | Drift? |
   |---|---|---|---|---|
   | GET | `<code>` | `<design fields>` | `<actual fields>` | `<yes/no + detail>` |
   | POST | `<code>` | full resource body | `<actual>` | `<yes/no>` |
   | PATCH | `<code>` | full resource body | `<actual>` | `<yes/no>` |
   | DELETE | `<code>` | empty | `<actual>` | `<yes/no>` |

4. **Feed the drift table into scenario authoring.** For each operation:
   - **No drift** - author full-fat assertions from the design contract (variable capture, field-level asserts, chained operations). This is the canonical happy path.
   - **Drift present** - author to runtime truth, not design truth. Record the divergence as a follow-up note on the WATS scenario (suite description or scenario comment) and surface it in the run summary as a DRIFT line. This prevents a passing scenario from hiding a real contract violation; the divergence is logged, not silently accepted.
   - **Both** (partial drift) - split assertions: fields that match get full-fat asserts; fields that drift get skipped or replaced with presence-only checks, with a comment naming the drift.
5. **Surface drift to the PM in plain English before writing the scenario** - one line per drift row. Example:
   > *"Heads-up before I author: GET returns `id, descriptor` but the View rep designs `id, descriptor, role, job, photo`. I'll author GET assertions against what the runtime returns and note the three missing fields as a follow-up. POST returns an empty body despite 201, so I'll capture the instance WID from the `Location` header instead of the body - same outcome. Proceed?"*

**Guardrails for this hook**:
- Read-only by default; the only write is a user-approved synthetic POST for capture, rolled back with DELETE in the same sequence.
- Never rerun the smoke if `phase_4_smoke_drift:` is already on file - reuse.
- No workspace switch; runs from PM workspace via XO MCP `suv_rest_call`.
- Drift table is information, not a blocker. Always feed forward into authoring rather than halting.
- This hook does not create the scenario; it precedes the author step. The main flow below still runs.

### REST flow (delegates to rest-scaffold test sub-mode)

1. Confirm flow type is REST.
2. **Run the runtime-shape capture hook above if in scope.** Skip the hook if Phase 4 drift is already recorded or the user waives it.
3. Read [rest-scaffold.md](rest-scaffold.md) and follow its Sub-mode B (Test) instructions exactly. Do not re-implement. If drift was captured, pass the drift table to `rest-scaffold` as additional authoring context.
4. Return control to the user after `rest-scaffold` reports completion. Include the drift table (or "no drift captured") in the final recap so the PM sees what was asserted vs what was waived.

### UI flow (direct XO MCP)

1. **Read the task (PM workspace).** Call `ui_task_analysis_get` with the task WID. Capture element list, validations, and `task_type`.

2. **Draft the scenario plan.** Based on the user's goal and the task structure, produce a written plan as a single block. Example:

   ```
   Flow type: UI
   Task: "Submit Candidate Offer" (WID abcd...)
   Goal: "Submit an offer with valid data, confirm it appears in Offers Pending Approval"
   
   Plan (6 writes):
     1. wats_suite_create
        name: "Candidate Offer - Happy Path Suite"
        -> returns suite WID
     2. wats_scenario_create
        name: "Submit valid offer"
        parentSuite: <suite WID from step 1>
        -> returns scenario WID
     3. wats_scenario_wats_scenario_line_create
        parent: <scenario WID>
        step: "Navigate to Submit Candidate Offer task"
     4. wats_scenario_wats_scenario_line_create
        step: "Enter Offer Amount: 100000"
     5. wats_scenario_wats_scenario_line_create
        step: "Enter Start Date: 2026-06-01"
     6. wats_scenario_wats_scenario_line_create
        step: "Submit and verify navigation to Offers Pending Approval"
   ```

3. **Switch workspace.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/contexto" })`. (Even though the UI flow uses XO MCP calls not slash commands, we switch workspace so any WATS artefacts Contexto auto-tracks land in `~/contexto/wip/`.)

   *Alternative lightweight path:* if the user prefers, skip the workspace switch and run the XO MCP calls from the PM workspace. If so, mark this in the run summary. Default is to switch.

4. **HITL checkpoint (full plan).** Ask: *"Approve this 6-step WATS plan? Reply `approve` to run all steps, `reject` to abort, or edit."*
   - `approve` -> proceed through all steps in order; on any step failure, stop and report state.
   - `reject` -> switch workspace back; report "no changes made."
   - edit -> loop to step 2.

5. **Apply in sequence.** Call each tool in order, injecting returned WIDs into subsequent calls. Do NOT re-ask for approval between steps unless a step fails.

6. **Verify.** Re-fetch the scenario (`wats_scenario_get`) and confirm each line was created with the correct parent WID. Report drift if any.

7. **Switch back.** Call `cursor-app-control.move_agent_to_root({ "rootPath": "/Users/david.denham/product-manager-agent" })`.

8. **Report.** *"Scenario '<name>' created with <N> lines. Suite WID: <...>, Scenario WID: <...>. Back in product-manager-agent workspace."*

## Guardrails

- **Approve the full plan, not step-by-step.** Make the batched approval explicit in step 4. Never write after step 1 and claim you'll ask later.
- **No destructive writes in v1.** Do not delete scenarios, lines, or suites from this mode.
- **No cross-task scenarios.** One task per scenario in v1.
- **REST flow always delegates.** Do not re-implement `/wats-rest-builder` logic inside this mode.
- **Workspace must be switched back** on any exit path (success, reject, error).

## Non-goals

- Running the scenarios after creation (that's WATS execution, different flow).
- Editing existing scenarios (different mode, not in v1).
- Cross-tenant test management.
- Manual test script writing (use Contexto workflows for WATS lifecycle).

## End-of-run

- Workspace must be switched **back** to `product-manager-agent`. Confirm with the user.
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
