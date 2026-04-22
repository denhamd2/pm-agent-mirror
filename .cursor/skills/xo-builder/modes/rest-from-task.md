# Mode: rest-from-task

**Tier:** 2 (guarded build) • **Workspace switch:** Yes (`~/contexto`) • **Writes to SUV:** Yes (heavily, via Contexto workflow HITL gates)

"Convert this UI task to a full REST API." Takes a UI Task WID and orchestrates Contexto's three-workflow chain - `schema-analysis`, `schema-implementation`, `processing-creation` - plus a PM-workspace post-build cleanup-and-smoke pass, to produce a complete REST API with GET, POST, PATCH, and DELETE operations, including processing, constraint-cleanup, typed MCP wrappers, round-trip smoke, and a discoverability index in the PM workspace.

This mode is an **orchestrator wrapper**, not a reimplementation. It handles pre-flight validation in the PM workspace, switches to `~/contexto` for each of the three Contexto phases, tracks progress across phases, switches back for the final PM-workspace Phase 4. Each Contexto workflow retains its own step-by-step HITL gates (`[C] Continue / [E] Edit / [Q] Questions`) - this mode does not compress or skip them. Phase 4 follows the Tier 2 diff-approve-apply-verify template from [../SKILL.md](../SKILL.md#tier-2-hitl-template-shared-by-copy-edit-validation-edit-prompt-edit-method-edit).

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

## Four-Phase Flow

The full conversion runs through three Contexto workflows in sequence, followed by a PM-workspace Phase 4 that handles deterministic post-build cleanup (toggle attach, POST singleton-doc clear, XO Agent Tool registration, `mapsToClass` verify), a round-trip smoke, and a discoverability index write. Phases 1-3 require workspace switches to `~/contexto` and back; Phase 4 runs entirely in the PM workspace via XO MCP calls. The user drives each Contexto workflow from the Contexto workspace; Phase 4 runs through the Tier 2 HITL diff-approve-apply-verify template.

```
Phase 1: schema-analysis     Phase 2: schema-implementation  Phase 3: processing-creation  Phase 4: post-build + smoke
(Contexto, Steps 1-6)        (Contexto, Steps 1-11)          (Contexto, Steps 1-N)         (PM workspace, Steps 1-6)
┌────────────────────┐       ┌─────────────────────┐         ┌─────────────────────┐      ┌───────────────────────────┐
│ Understand task     │      │ Load plan + preflight│         │ Load schema + task  │      │ Toggle attach on new CRFs │
│ Investigate elements│      │ Create BOs           │         │ Wire DPU / PUMB / PU│      │ POST singleton-doc clear  │
│ Analyse CRFs        │      │ Create CRFs          │         │ Create ProcOpts     │      │ Register XO Agent Tools   │
│ Compare existing API│      │ Confirm Service      │         │ Verify POST/PATCH   │      │ Verify Edit rep mapsToClass│
│ Design schema       │      │ Create Representations│        └─────────────────────┘      │ Round-trip smoke (CRUD)   │
│ Implementation plan │      │ Create Rep Content   │                                      │ Write PM-workspace index  │
└────────────────────┘       │ Create SCR           │                                      └───────────────────────────┘
  Output:                    │ Create Operations    │                                        Output:
  schema-analysis-wip.md     │ GET verification     │                                        Recap + typed MCP tools
  schema-design-wip.md       │ Review + Complete    │                                        docs/xo/rest-apis/<slug>/
  schema-implementation-wip.md└─────────────────────┘                                            README.md
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
6. **Naming reconciliation recap.** Before the checkpoint, print a short reconciliation table so the PM can see every name this one API answers to. One API routinely carries four to six names across layers (task slug, backing class, target service, resource URL, MCP tool prefix, public JSON aliases), and each divergence is deliberate but the cognitive load is real. Pull values from the Phase 1 artefacts (`schema-analysis-wip.md`, `schema-design-wip.md`, `schema-implementation-wip.md`).

   Template (fill in from the artefacts; include a row only if it differs from the row above it):

   | Layer | Name |
   |---|---|
   | UI Task | `<Task display name, e.g. Offer (Sequence Task)>` |
   | Source task slug | `<kebab-case slug, e.g. offer-sequence-task>` |
   | Backing class | `<Class name, e.g. Offer Event>` |
   | Target service | `<Service name, e.g. xoAgents>` |
   | Resource URL | `<URL path, e.g. /offer-events>` |
   | MCP tool prefix | `{get,create,update,delete}_<singular>(s)` *(placeholders - exact wrappers land in Phase 4 step 3)* |
   | Public JSON aliases (if any) | `<alias -> CRF webServiceAlias, e.g. role -> jobRequisition>` |

   Record the final table verbatim in `schema-implementation-wip.md` frontmatter so it is available to Phase 4 step 6 (PM-workspace README) without re-deriving.

7. **Checkpoint.** Confirm with the user: *"Phase 1 (schema-analysis) complete. Implementation plan ready. Naming table recorded. Proceed to Phase 2 (schema-implementation)?"*

### Phase 2: Schema Implementation

#### Phase 2 pre-flight: Edit rep `mapsToClass` check

Before switching workspace and handing off to Contexto, resolve the Edit-representation `mapsToClass` question upfront. Skipping this step is the single most common cause of a POST/PATCH round-trip failing at Phase 4 smoke with a `"maps to class required"` runtime error - which is usually discovered hours after the Edit rep was already created.

1. **Read the plan.** From `schema-implementation-wip.md`, identify the `representsClass` WID the Edit representation will be bound to.
2. **Check for derived subclass (PM workspace, XO MCP, read-only).** Call `class_get` on `representsClass`. Inspect subclasses.
3. **Check for an existing in-service Edit rep (optional).** If the target service already exists for this class, call `service_description_get` and look for an existing Edit representation on the same class. If present, its `mapsToClass` pattern is the right one to mirror.
4. **Route into one of three outcomes and record the decision in `schema-implementation-wip.md` frontmatter** (as `mapsToClass_decision: derived-subclass | mirrors-existing-edit-rep | generate-class-based-processing`):

   - **Outcome A - a `(Derived)` subclass exists on `representsClass`** (e.g. `Offer Event (Derived)`): set the Edit rep's `mapsToClass` to the derived subclass WID in the Contexto implementation step. Safest path; preserves explicit class modelling.
   - **Outcome B - no derived subclass, but an existing in-service Edit rep exists on this class**: mirror that rep's `mapsToClass` pattern when Contexto creates the new Edit rep. Consistency with the rest of the service.
   - **Outcome C - no derived subclass AND no existing in-service Edit rep** (the offer-events case): tell the user Contexto should create the Edit rep's Service Operation Processing Option with `generateClassBasedProcessing: true`, which auto-materialises a `<Class> (Derived)` subclass at runtime. Documented fallback from `schema-implementation` step-file notes.

5. **HITL checkpoint on the decision (plain English).** Before handing off, surface the recap to the PM:
   > *"Edit-rep `mapsToClass` decision for `<Class>`: Outcome <A/B/C> (`<one-line rationale>`). When Contexto gets to the Representations step, use this option. Continue to Phase 2 hand-off?"*
   If the PM picks Outcome B or C incorrectly (e.g. insists on B but no edit rep exists), stop and re-check - this is a forked call that Advisory #19 (Six Hats) can resolve.

6. **Continue.** Proceed to the Hand off step below; no other Phase 2 step changes.

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
5. **Proceed to Phase 4.** Confirm with the user: *"Phase 3 (processing-creation) complete. Proceeding to Phase 4 (post-build cleanup + smoke) in the PM workspace."*

### Phase 4: Post-Build Cleanup + Smoke

Phase 4 runs entirely in the PM workspace using XO MCP write calls. No workspace switch. Every step uses the Tier 2 diff-approve-apply-verify HITL template from [../SKILL.md](../SKILL.md) - the PM sees the diff, approves the batch, and the mode applies and verifies. The six steps address three post-build constraint-cleanups that Contexto does not currently handle, one runtime guardrail (`mapsToClass` verify), a round-trip smoke to catch design-vs-runtime drift on day one rather than at WATS authoring time, and a PM-workspace index that makes the API discoverable from Cursor without re-reading Contexto artefacts.

Default: all six steps run in order. The PM can approve or skip each step independently. Any step can be skipped if already handled manually in Phase 2/3; surface the skip in the Phase 4 recap.

**Evidence base.** The four constraint-cleanup steps and the smoke step are all derived from the offer-events build post-mortem (see `~/contexto/_bmad-output/implementation-artifacts/schema-implementation-offer-sequence-task.md` frontmatter notes). Every step is deterministic and solved with one or two XO MCP calls.

1. **Toggle attach on new CRFs.**

   Newly created CRFs on XO Agents classes must have the active toggle attached (currently `CLE-9242` for the XO Agents PoC) before they render in REST responses. Without the toggle, GETs will silently omit the new fields.

   - Collect every CRF WID created in Phase 2 from `schema-implementation-wip.md` (look for the CRF table created in step "Create CRFs"). If the plan was Outcome A or B under Phase 2 pre-flight and only pre-existing CRFs were reused, skip this step.
   - For each CRF, call `class_report_field_get` to capture the current toggle list.
   - Resolve the active toggle WID via `xo_search` (term `CLE-9242` or whatever the current XO Agents PoC toggle is) if it is not already known from the tenant.
   - HITL diff recap template:
     > *"Phase 4 step 1 - Toggle attach. About to PATCH `<N>` CRFs to add toggle `<toggle name + WID>`. CRFs: `<list with name + WID + current toggle count>`. Approve, skip this step, or edit the CRF list?"*
   - On `approve`, call `class_report_field_patch` for each CRF adding the toggle to its `toggles` list. Stop and surface on first 4xx/5xx.
   - Verify: re-GET each CRF and confirm the toggle is present; report drift if any.

2. **POST singleton-doc clear.**

   Workday constraints reject POST Service Operations that carry `specificInstanceSummary` or `specificInstanceDocumentation`. `schema-implementation` sometimes carries these across from the source UI task, which blocks the POST from activating.

   - Collect every POST Service Operation WID created in Phase 2 from `schema-implementation-wip.md`.
   - For each POST op, call `service_operation_workday_owned_get` and inspect `specificInstanceSummary` and `specificInstanceDocumentation`. If both are blank, skip this step.
   - HITL diff recap template:
     > *"Phase 4 step 2 - POST singleton-doc clear. About to PATCH `<N>` POST Service Operations to clear `specificInstanceSummary` and `specificInstanceDocumentation`. Ops: `<list>`. Approve, skip, or edit?"*
   - On `approve`, call `service_operation_workday_owned_patch` on each op clearing both fields. Stop and surface on first 4xx/5xx.
   - Verify: re-GET each op and confirm both fields are empty; report drift if any.

3. **XO Agent Tool registration.**

   Each new Service Operation must be registered as an XO Agent Tool for the typed MCP wrapper (e.g. `get_offer_events`, `create_offer_event`) to auto-materialise in Cursor. Without this, the PM cannot call the API from the MCP surface - they must fall back to raw `suv_rest_call`.

   - Collect every Service Operation WID created in Phase 2 (GET, POST, PATCH, DELETE as scoped).
   - For each, draft the XO Agent Tool spec: name (usually `<verb>_<resource_singular_or_plural>`), description (one-liner from the operation's `displayName`), input/output schema (resolve from the op's representations).
   - HITL diff recap template:
     > *"Phase 4 step 3 - XO Agent Tool registration. About to create `<N>` XO Agent Tools: `<list of tool names>`. Each wraps one Service Operation so the PM can call the API from Cursor. Approve the batch, skip this step, or edit the names?"*
   - On `approve`, call `xo_agent_tool_create` for each. Stop and surface on first 4xx/5xx.
   - Verify: call `xo_search` on each tool name and confirm it resolves; report drift if any. Tell the PM the wrappers will appear in their MCP tool descriptors after the next Cursor MCP reconnect.

4. **Edit rep `mapsToClass` verify.**

   This is the runtime-side confirmation of the Phase 2 pre-flight decision. Catch `mapsToClass` drift here before the smoke in step 5, so the error is visible on the XO metadata layer rather than as an opaque `"maps to class required"` during the first POST attempt.

   - Identify the Edit representation WID from `schema-implementation-wip.md`.
   - Call `service_representation_workday_owned_get` on it.
   - If `mapsToClass` is populated, pass and move on.
   - If `mapsToClass` is blank, check the Service Operation Processing Option for the Edit rep's POST/PATCH op: if `generateClassBasedProcessing: true` is set, pass (Outcome C from Phase 2 pre-flight). If neither is present, **block Phase 4 at this step** and surface to the PM:
     > *"Phase 4 step 4 - Edit rep `mapsToClass` is blank AND Service Operation Processing Option does not have `generateClassBasedProcessing: true`. POST will fail at smoke. Two paths: (a) switch workspace to Contexto and patch the Processing Option to set `generateClassBasedProcessing: true`, or (b) patch the Edit rep directly via `service_representation_workday_owned_patch` to point `mapsToClass` at an existing derived subclass. Which?"*
   - Do not proceed to step 5 until this is resolved. A smoke against a blank `mapsToClass` just produces noise.

5. **Round-trip smoke (CRUD).**

   A single pass that catches design-vs-runtime drift immediately, rather than during WATS authoring. The offer-events build discovered that GETs returned only `id` and `descriptor` (not `role`, `job`, `photo`) and that POST/PATCH returned empty bodies despite 2xx status, after WATS tests were already authored against the expected shape. Catch this here.

   - Build a synthetic POST body from the Edit representation's fields (use sensible defaults: strings = `"smoke test"`, dates = today, booleans = `false`, WID references = resolve via `xo_search` to a sample instance or prompt the PM).
   - HITL diff recap template (before any writes):
     > *"Phase 4 step 5 - Round-trip smoke. About to run POST -> GET -> PATCH -> GET -> DELETE against `<resource URL>`. POST body sample: `<JSON>`. Approve, edit body, or skip smoke?"*
   - On `approve`, run the sequence via `suv_rest_call`:
     1. POST `<URL>` with synthetic body. Capture response status, headers, body, and the created instance WID (from body if returned, else from `Location` header).
     2. GET `<URL>/<id>`. Capture response body.
     3. PATCH `<URL>/<id>` with a small mutation (e.g. change one field value). Capture response body.
     4. GET `<URL>/<id>` again. Capture response body.
     5. DELETE `<URL>/<id>`. Capture response status.
   - **Build the drift table.** Compare actual response fields against the View representation's designed fields. For POST and PATCH, compare actual response body against the design (some Workday services return empty bodies on write - that is an XO pattern, not necessarily a bug, but worth flagging).

     | Step | Status | Expected (View rep) | Actual | Drift? |
     |---|---|---|---|---|
     | POST | `201` | full resource body | `<actual shape>` | `<yes/no + detail>` |
     | GET (after POST) | `200` | `<design fields>` | `<actual fields>` | `<yes/no + missing fields>` |
     | PATCH | `200` | full resource body | `<actual shape>` | `<yes/no + detail>` |
     | GET (after PATCH) | `200` | mutation reflected | `<actual>` | `<yes/no>` |
     | DELETE | `204` | empty | `<actual>` | `<yes/no>` |

   - Record the drift table in the `schema-implementation-wip.md` frontmatter (`phase_4_smoke_drift:`) so Phase 4 step 6 and downstream `wats-scenario` runs can consume it without re-running the smoke.
   - Drift is not a failure; it is information. Advisory #21 (post-build reality check) decides how to surface it to the PM.

6. **Write PM-workspace index.**

   Thirty seconds of Phase 4 work solves forever the "is there an X API?" discoverability problem. Rich artefacts live in `~/contexto/_bmad-output/` but are invisible from the PM workspace. Write one index stub on the PM side so `Glob`-ing `docs/xo/rest-apis/**/README.md` finds every REST API the mode has ever built.

   - Path (use the kebab-case resource slug from the Naming reconciliation table in Phase 1, which matches the resource URL stem):

     ```
     docs/xo/rest-apis/<resource-slug>/README.md
     ```

     Example: `docs/xo/rest-apis/offer-events/README.md`.

   - Template (fill from Phase 1 naming table, Phase 2 frontmatter WIDs, Phase 4 step 3 tool names, Phase 4 step 5 smoke drift table):

     ```markdown
     # <Display name> REST API

     One-line purpose. Built <date> from UI task `<Task display name>` (`<Task WID>`) via `rest-from-task` mode.

     ## Naming reconciliation

     <Paste Phase 1 reconciliation table verbatim here.>

     ## Canonical WIDs

     - Backing class: `<Class WID>`
     - Service: `<Service WID>`
     - Service Collection Resource: `<SCR WID>`
     - Representations: View `<WID>`, Edit `<WID>`
     - Service Operations: GET `<WID>`, POST `<WID>`, PATCH `<WID>`, DELETE `<WID>`
     - Edit rep `mapsToClass` decision: `<outcome A/B/C + one-line rationale>`

     ## MCP tool wrappers

     Auto-generated by Phase 4 step 3. After a Cursor MCP reconnect:

     - `<tool name 1>` (GET)
     - `<tool name 2>` (POST)
     - `<tool name 3>` (PATCH)
     - `<tool name 4>` (DELETE)

     ## Smoke-verified response shape (Phase 4 step 5)

     <Paste drift table verbatim here.>

     ## Known follow-ups

     - `<List any DRIFT rows from the smoke that need a follow-up edit task on created objects per Safe Harbour. None if no drift.>`

     ## Source artefacts

     Contexto build artefacts live in `~/contexto/_bmad-output/implementation-artifacts/`:

     - Design: `schema-design-<slug>.md`
     - Implementation plan: `schema-implementation-<slug>.md`
     - Preview (if any): `<slug>-preview.csv`

     Schema and implementation artefacts are **not** duplicated here - this file is the PM-workspace pointer into the Contexto build trail.
     ```

   - HITL diff recap template:
     > *"Phase 4 step 6 - PM-workspace index. About to write `docs/xo/rest-apis/<slug>/README.md` (approx `<N>` lines). This is a discoverability stub; does not touch `MISSION_LOG.md`, no rule chaining. Approve, edit the template, or skip?"*
   - On `approve`, write the file. Never overwrite an existing README at the same path without a second explicit approval - the PM may have hand-edited follow-up notes.
   - Verify: read the file back and confirm it parses as valid markdown with all sections populated.

## Post-Completion

After Phase 4 (or Phase 2 for GET-only scope), summarise to the user:

- **What was built**: list the created artifacts (Service, Resources, Operations, Representations) with WIDs.
- **Phase 4 recap**: one line per sub-step with `OK` / `FIXED` / `DRIFT` / `SKIPPED`. This is the input for `@xo-developer` Advisory #21 post-build reality check.
- **Typed MCP wrappers available**: list the XO Agent Tool names from Phase 4 step 3 so the PM knows what to invoke after their next MCP reconnect.
- **PM-workspace index path**: `docs/xo/rest-apis/<slug>/README.md` from Phase 4 step 6.
- **Code review reminder**: per Contexto's Safe Harbour, the generated XO may be incomplete. The user should run the edit task on created objects to catch code exceptions before treating anything as production-ready. Any DRIFT rows from the Phase 4 smoke need a follow-up edit task.
- **Next steps**: offer to (a) run `wats-scenario` mode to build automated tests (now cheaper because the drift table is already recorded), (b) run `rest-scaffold` document sub-mode to generate an OpenAPI spec, or (c) stop.

## Tools Used

- XO MCP (PM workspace):
  - **Pre-flight (read-only):** `ui_task_analysis_get`, `xo_search`.
  - **Phase 2 pre-flight (read-only):** `class_get`, `service_description_get`.
  - **Phase 4 reads:** `class_report_field_get`, `service_operation_workday_owned_get`, `service_representation_workday_owned_get`, `suv_rest_call`, `xo_search`.
  - **Phase 4 writes (Tier 2 HITL):** `class_report_field_patch` (step 1), `service_operation_workday_owned_patch` (step 2), `xo_agent_tool_create` (step 3), `service_representation_workday_owned_patch` (step 4 only if routing to the direct fix), `suv_rest_call` (step 5 - calls against the new resource URL).
- `cursor-app-control.move_agent_to_root` for Phase 1/2/3 workspace switches (Phase 4 stays in PM workspace).
- Contexto workflows (user-driven, in `~/contexto` workspace):
  - `schema-analysis` (Phase 1)
  - `schema-implementation` (Phase 2)
  - `processing-creation` (Phase 3)
- PM workspace file write (Phase 4 step 6 only): `docs/xo/rest-apis/<slug>/README.md`.

## Guardrails

- **Four HITL-gated phases.** Phases 1-3 each run the Contexto per-step HITL; Phase 4 runs six Tier 2 diff-approve-apply-verify gates (one per sub-step). This mode does not compress, skip, or batch any of them.
- **Workspace switch is non-optional for Phases 1-3.** The Contexto workflows and their step files do not exist in the PM workspace. If `cursor-app-control` is unavailable, fall back to telling the user to open `~/contexto` manually.
- **Phase 4 stays in PM workspace.** All six Phase 4 steps run via XO MCP against the SUV; no workspace switch. This is deliberate so the PM can follow the recap without context-switching Cursor windows.
- **Do not run Contexto workflows yourself.** The Contexto workflows use step-file architecture (`disable-model-invocation: true` patterns). They must be driven by the user in a Contexto-workspace chat.
- **Safe Harbour applies.** The generated XO is development-quality. Always remind the user to run edit tasks on created objects before check-in. Any DRIFT rows from the Phase 4 step 5 smoke need a follow-up edit task regardless of status codes.
- **No auto-chaining.** After completion, offer next-step options but never auto-invoke `wats-scenario`, `rest-scaffold`, or any other mode.
- **Default-BO CRF creation pitfall** (schema-implementation, Step 4+). When the target class uses Workday's default Business Object rather than a named BO, Contexto's `class_report_field_create` tool struggles to resolve the BO automatically and loops or fails with "could not resolve business object". **Workaround**: create the **first** CRF manually via `class_report_field_create`, passing the BO WID explicitly. Once one CRF exists on the class against that BO, subsequent CRF creates on the same class succeed without explicit BO passing (Contexto uses the first CRF as the anchor). Advise the user of this pattern at the start of Step 4 when they are building CRFs on a new class; it is a known Contexto limitation, not user error.
- **Phase 4 step 4 is a blocker, not a warning.** A blank `mapsToClass` with no `generateClassBasedProcessing: true` fallback **must** be resolved before step 5 runs. Smoking against a broken Edit rep wastes a round-trip and produces a misleading drift table.
- **No silent overwrites of the PM-workspace README** (Phase 4 step 6). If `docs/xo/rest-apis/<slug>/README.md` already exists (e.g. from a previous build of the same API), require a second explicit PM approval before overwriting - the file may carry hand-edited follow-ups.

## Non-goals

- **Editing existing REST services.** Use `rest-scaffold` for documenting or testing existing endpoints.
- **Auto-testing the built API.** Use `wats-scenario` for building WATS system tests after this mode completes.
- **Custom workflow creation.** Use Contexto's `/xo-workflow-builder` directly for building reusable analysis or review workflows.
- **Producing OpenAPI documentation.** Use `rest-scaffold` document sub-mode after this mode completes.

## End-of-run

- Workspace must be switched **back** to `product-manager-agent`. Confirm with the user.
- Do not write to `MISSION_LOG.md`. Do not invoke any rule. Do not chain into another mode.
- Ask the user if they want to run another mode. Do not assume.
