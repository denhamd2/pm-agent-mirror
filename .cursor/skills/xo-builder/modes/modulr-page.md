# Mode: modulr-page

**Tier:** 1 (guarded build) • **Workspace switch:** Yes (`~/contexto`) • **Writes to SUV:** Yes (via Maestro HITL)

Build a ModulR UI layout on your Workday SUV using Contexto's Maestro workflow. This mode is a **thin pre-flight and post-flight wrapper** around `/buildModulrLayout` which lives in `~/contexto`. It does **not** orchestrate Maestro itself, does **not** duplicate Contexto tooling, and does **not** touch your PM agent rules.

## Worked Example Prompts

- "Add a Candidate summary panel to the View Candidate task showing full name, role applied for, and current stage - attach to element WID `<WID>`."
- "Build a ModulR page on my SUV from this API response: `<paste JSON>`. Goal: display the top five interview feedback entries."
- "Mock up an Offer review card on the Offer Approval step - attach to element `<WID>`, reference image at `design/fixtures/offer-review.png`."
- "Scaffold a ModulR layout for Candidate Tags management - target element `<WID>`, operation `create`."

## Two Entry Sub-modes

### Sub-mode A - From an existing xoUi element

Use when you already know which Workday container the layout should attach to (most common).

**Required inputs:**
1. **Goal** - one sentence describing what the layout should show or do. Example: *"Show a summary card with candidate name, role applied for, and status."*
2. **Target element WID** (`suv_target_element_id`) - the xoUi element this layout attaches to. Find it with `xo_search` (XO MCP) if unknown, or write `null` and note that in intent.json.
3. **Operation** - `create` (POST a new layout) or `update_existing` (PATCH an existing layout). If `update_existing`, you also need the existing **layout WID** (`suv_target_layout_id`).
4. **Reference image** (optional, strongly recommended) - a screenshot or Figma export of the desired UI. Significantly raises Maestro's layout confidence and reduces `inferred` bindings.

### Sub-mode B - From an API response

Use when you want to scaffold a layout from the shape of a JSON/XML payload (public Workday REST, internal XO REST, or converted SOAP).

**Required inputs:**
1. **Goal** - same as Sub-mode A.
2. **API response sample** - the actual JSON body, or an XML/SOAP body that you convert to JSON first (see the SOAP one-liner below).
3. **Target element WID** (optional but recommended) - the SUV binding still happens on the element's `workData`; the API response is a **layout-shape reference**, not a live data source. See "Binding caveat" below.
4. **Reference image** (optional).

**Today vs coming-soon:**
- **Today**: the API response is written to `~/contexto/wip/<slug>/reference-data.json` and passed to `/buildModulrLayout` as additional context alongside an optional screenshot. Maestro reasons about the shape; you still approve the plan.
- **Coming soon** (per Rachel's demo, "Maestro x Contexto - Data Providers"): the REST data-provider path accepts the response directly and auto-scaffolds. When shipped, swap the pre-flight step to invoke that path.

## Mode Pre-Flight Checklist (run in PM workspace first)

Before switching workspace, confirm with the user:

- [ ] Sub-mode (A or B) selected.
- [ ] Goal written in one sentence.
- [ ] Target element WID captured (or explicitly `null` with reason noted).
- [ ] **WID verified on the live SUV** via `~/contexto/xo-agents/skills/maestro-modulr-crud/scripts/get-element.sh <WID>` (run in a fresh `bash -c` subshell). Expected outcomes: 2xx is green; 404 means the WID is not a live xoUi element on this tenant (most often happens when a WID was copied from `page-discovery`'s `element_content_wid` output, which is a metadata template, not an instantiated element); 401/403 means credentials need refresh. Do NOT switch workspace until this passes.
- [ ] Operation (`create` vs `update_existing`); layout WID captured if update.
- [ ] Screenshot attached or confirmed not available.
- [ ] If Sub-mode B: JSON body captured; XML converted to JSON (see helper below).
- [ ] Slug chosen for this run (short kebab-case, e.g. `candidate-summary-card`). Used by Maestro for `wip/<slug>/`.
- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed (dev SUV, credentials, MCPs reachable).

If any pre-flight item is missing, stop and ask the user before switching workspace.

### Why verify the WID before switching workspace

Maestro's Discover stage calls `/ors/super/services/xoUi/v1/elements/{ID}/workData` on your SUV. If the WID does not resolve there, Maestro aborts Discover and you have wasted the workspace switch plus the setup of `wip/<slug>/`. Two specific traps:

- **`element_content_wid` vs xoUi element WID**: `page-discovery` returns `element_content_wid` values from `ui_task_analysis_get`. Those are **metadata template definitions**, not instantiated xoUi elements on your SUV. They look identical (32-char hex) but are not interchangeable. The `get-element.sh` probe catches this in 2 seconds.
- **Browser-URL fallback**: if your WID 404s, open your SUV in a browser, navigate to the page you want the layout on, and copy the WID from the URL. The pattern is typically `https://<SUV_HOST>/d/xoUi/<WID>` or similar. Paste that WID back and re-probe before switching workspace.

## Workspace Switch

Once the pre-flight checklist passes, switch the agent root to Contexto using `cursor-app-control`:

```json
{"rootPath": "/Users/david.denham/contexto"}
```

Call `cursor-app-control.move_agent_to_root` with this argument. After the switch, Contexto's own rules load (`.cursor/rules/maestro.mdc`, `main.mdc`, etc.) and the `/buildModulrLayout` slash command becomes available.

**Tell the user exactly what to type next.** Example message:

> Switched to `~/contexto`. Now run:
> ```
> /buildModulrLayout
> ```
> When prompted, paste: goal `"Show a summary card..."`, element WID `<WID>`, operation `create`, reference image attached.

## Six Maestro Stages (what to expect)

Once `/buildModulrLayout` runs, Contexto's `@maestro-composer-agent` executes six stages. Two of them block for your explicit approval. Walk the user through what each one does.

| Stage | What happens | HITL? |
|---|---|---|
| 1. Initialize | Creates `wip/<slug>/` shard and seeds `events.jsonl`. | No |
| 2. Discover | Fetches bindable `workData` for the element; produces `intent.json`, `execution-plan.json`, `confidence-report.json`. | **YES - `plan_approval`** |
| 3. Build | Replays `execution-plan.json` through Maestro MCP (`create_component`, `create_grid`, `bind_data_to_component`, etc.) to assemble the structure tree in memory. | No |
| 4. Bind | Maps `workData` IDs to layout regions; writes `structure-with-bindings.json` and `template-fields.json`. | No |
| 5. Review | Generates a semantic diff vs. the SUV baseline; surfaces the final payload. | **YES - `pre_suv_write`** |
| 6. Persist | POST or PATCH to the SUV via `post-layout.sh` or `patch-layout.sh`. Exits 0 when done. | No |

**Checkpoint rules to enforce:**

- If Discover reports any region with `binding_source: "inferred"`, `evaluate.sh` will block at `plan_approval` regardless of confidence scores. Do not coach the user to override. Tell them to either provide a better reference image or accept that some regions need manual tuning.
- After `persist.sh` exits 0, **do not** try to fetch or report the layout WID. The POST response body is intentionally discarded. Confirm success by layout-level GET afterwards if the user wants verification.
- **Always invoke Maestro shell scripts (`load-env.sh`, `get-element.sh`, `get-bindable-data.sh`, `post-layout.sh`, `patch-layout.sh`) inside a fresh `bash -c '...'` subshell.** Sourcing `load-env.sh` into a long-lived persistent shell has been observed to produce false "Missing required credentials" errors from stale state. A clean subshell resolves credentials correctly every time.

## Post-Flight Return

When Maestro finishes (or the user aborts), switch the agent root back:

```json
{"rootPath": "/Users/david.denham/product-manager-agent"}
```

Call `cursor-app-control.move_agent_to_root` with this argument. Confirm to the user: *"Back in product-manager-agent workspace. ModulR run tracked in `~/contexto/wip/<slug>/events.jsonl` - nothing written to MISSION_LOG."*

**Post-write handoff (UI-observable Tier 2)**: per the orchestrator routing in [000-master-orchestrator.mdc](../../../rules/000-master-orchestrator.mdc), `@xo-code-reviewer` (artefact review on the persisted layout JSON) and `@qa-engineer` (UI smoke via [`suv-smoke-test`](../../suv-smoke-test/SKILL.md), typically `page-smoke` against the post-Persist URL `https://<SUV_HOST>/d/xoUi/<WID>`) are auto-invoked **in parallel** after this mode completes (standalone, out-of-E2E). Both streams feed back to `@xo-developer` for combined triage per [Advisory Behaviour #17](../../../agents/xo-developer-refs/advisory-playbook.md). Iteration cap: 2 cycles. PM never sees raw findings - `@xo-developer` produces one combined plain-English recap that includes the post-Persist URL ([Advisory #8](../../../agents/xo-developer-refs/advisory-playbook.md)).

## Public Workday APIs as layout-shape references

Three pinned OAS2 specs live in [`research/workday-public-apis/`](../../../../research/workday-public-apis/). Any of them can seed a Sub-mode B run.

**Pinned specs (ground truth, Recruiting core):**

- [recruiting_v4_20260418_oas2.json](../../../../research/workday-public-apis/recruiting_v4_20260418_oas2.json) - 25 endpoints, 99 schemas. `basePath: /recruiting/v4`.
- [staffing_v7_20260418_oas2.json](../../../../research/workday-public-apis/staffing_v7_20260418_oas2.json) - 115 endpoints, 210 schemas, 38 writes. `basePath: /staffing/v7`.
- [person_v4_20260418_oas2.json](../../../../research/workday-public-apis/person_v4_20260418_oas2.json) - 82 endpoints, 210 schemas, 34 writes. `basePath: /person/v4`.

**Also available for layout-shape seeding** (platform plumbing that underlies most Recruiting flows):

- [businessProcess_v1_20260418_oas2.json](../../../../research/workday-public-apis/businessProcess_v1_20260418_oas2.json) - BP events + event-steps. Good seed for approval queue UIs, to-do cards, step history timelines.
- [connect_v2_20260418_oas2.json](../../../../research/workday-public-apis/connect_v2_20260418_oas2.json) - Message templates and send-message. Good seed for candidate-messaging and template-editor UIs.
- [wql_v1_20260418_oas2.json](../../../../research/workday-public-apis/wql_v1_20260418_oas2.json) - WQL data sources and data payloads. Good seed for tabular / list / report-style UIs (often paired with the `wql-query` mode to pull live fixture data).
- [request_v2_20260418_oas2.json](../../../../research/workday-public-apis/request_v2_20260418_oas2.json) - Self-service requests. Good seed for request-submission forms.

Refresh instructions and full surface summary in [`research/workday-public-apis/README.md`](../../../../research/workday-public-apis/README.md). Confidence **Production**, routing **Public**, addressable on any tenant as `https://<tenantHostname>/ccx/api/<service>/<version>/...`.

### Useful schemas to cite in layout reference

From Recruiting v4 (`#/definitions/`):
- Candidate / prospect: `candidate`, `candidateSummary`, `candidateTag(s)`, `candidatePhoneDetails`, `candidateLanguageSkillDetails`, `candidateEducationDetails`, `candidateSkillItemDetails`, `prospectSummary`, `prospectExperienceDetails`
- Job / requisition: `jobRequisition`, `jobRequisitionPublic`, `jobApplication`, `jobApplicationPublic`, `jobPostingAnchorSummary`, `jobSite`, `jobFamilyGroupDetail`, `primaryLocation`, `additionalLocations`
- Attachments: `resumeAttachmentDetailsCreate`, `resumeAttachmentDetailsView`, `resumeAttachmentFileView`
- Interviews: `interviewDetailSummary`, `interviewFeedbackRatingSummary`, `workerForInterviewRepresentation`, `workersPendingFeedback`
- Questionnaires: `questionnaireDetails`, `questions`, `questionItemDetails`, `branchingQuestion`, `possibleAnswers`

From Staffing v7 (`#/definitions/`):
- Worker core: `workerData_c2466b0778c610000d1936006720000e`, `workerType_3f78eeedc01d1000138d97d80e5a0000`, `workerJobView_fab4a151b24810000e7ff8d0c7f0126d`
- Job changes: `changeJobBusinessTitle_*`, `changeJobPositionData_*`, `changeJobLocation_*`, `changeJobJobProfileData_*`, `changeJobJobClassificationData_*`, `changeJobAdministrativeDetailsData_*`, `changeJobContractDetailsData_*`, `changeJobMoveTeamData_*`, `changeJobOpeningData_*`, `changeJobAdditionalJobClassificationData_*`, `jobChangesStartDetailsData_ce861a6a360d10002d40f176b7180020`
- Organization assignment changes: `organizationAssignmentChangesBusinessUnitData_*`, `organizationAssignmentChangesCompanyData_*`, `organizationAssignmentChangesCostCenterData_*`
- Job profiles and families: `jobProfileDetailView_*`, `jobProfileJobView_*`, `jobProfileExemptRelatedView_*`, `jobFamilyGroup_*`, `jobFamilyGroupView_*`, `jobFamilyRelatedView_*`, `jobCategory_*`, `jobLevel_*`
- Check-ins and topics: `checkInsSummary_*`, `associatedCheckInsSummary_*`, `associatedCheckIns_*`, `associatedTopicsSummary_*`, `associatedTopics_*`
- Supervisory orgs: `supervisoryOrganization_*`, `supervisoryOrganizationView_*`, `supervisoryOrganizationJobView_*`

From Person v4 (`#/definitions/`):
- Person core: `personRepresentation_e451ce2c8b48100007c312f3f72700b3`, `personalInformation_414c4cee7d91100023fe329d6f900018`
- Contact containers: `addresses_d8f2aecf3d63100018c36066efa602a4`, `emails_d8f2aecf3d63100017e85a350c0b025d`, `phoneNumbers_*`, `webAddresses_d8f2aecf3d6310001bdd0d6312f202b8`, `instantMessengerAccount_*`
- Contact change events: `homeContactUsage_c1bb9f46f65210002d3c341a5dc400b8`, `workContactChangeEvent_d72a8353f91e1000169a839c31a0046d`, `workContactChangeEventView_*`, `workContactUsage_*`, `changeContactInformationEvent_765b18aa13af1000064a10bf37b800ed`
- Name and localization: `name_33e26848dc0010002f1ae76d63ec0061`, `localName_*`, `localPersonName_*`, `personLocalizedNameComponentFormat_*`, `personLocalizedAddressComponentFormat_*`, `personCountryViewDefinition_*`
- Reference wrappers: `emailReference_*`, `emailAddressReference_*`, `phoneReference_*`, `addressReference_*`, `webAddressReference_*`, `homeAddressReference_*`

From Business Process v1 (`#/definitions/` - useful when the layout renders approval queues, step history, or to-do cards):
- Event shapes: `businessProcessEventAction_*`, `businessProcessEventStepTodo_*`, `eventAttachmentsView_*`, `eventStepsSummary_*`, `eventStepsView_*`, `eventStepRemainingView_*`, `eventStepCompletedView_*`
- Type shapes: `businessProcessTypeDetails_*`, `businessProcessTypeView_*`
- Action payloads: `questionnaireAnswers_*`, `questionnaireAttachment_*`, `toDoAction_*` (used by `POST /eventSteps/{ID}/toDo`, `/approve`, `/deny`, `/sendBack`, `/reassign`, `/questionnaire`)

From Connect v2 (`#/definitions/` - useful for candidate-messaging and template-editor UIs):
- Template shapes: `messageTemplate_*`, `messageTemplateSummary_*`, `messageTemplateLocalized_*`, `notificationType_*`
- Send payloads: `sendMessageRequest_*`, `audienceCriteria_*`, `recipient_*`

**SOAP alternative** for surfaces not exposed in REST (e.g. requisition writes): the Recruiting WSDL at `https://community.workday.com/sites/default/files/file-hosting/productionapi/Recruiting/v<XX.X>/Recruiting.wsdl` still covers operations like `Get_Job_Requisitions` and `Put_Candidate`. Convert XML responses with the one-liner below.

## SOAP to JSON one-liner

SOAP responses are XML; Maestro wants JSON. Convert before Sub-mode B:

```bash
# Requires node; install xml2json once: npm i -g xml2json-command
cat response.xml | xml2json > response.json

# Or pure-python fallback (no deps beyond stdlib):
python3 -c "import xmltodict, json, sys; print(json.dumps(xmltodict.parse(sys.stdin.read()), indent=2))" < response.xml > response.json
```

Pick whichever is already installed. Then treat `response.json` as the Sub-mode B input.

## Binding caveat (critical)

The persisted ModulR layout binds to **internal `workData`** on the SUV element, not to the public API endpoint. The public API shape guides *structure* (what fields, what nesting, what list-vs-object); it does not become the *data source* at render time. If an equivalent internal binding does not exist on the element, Maestro will flag that region as `inferred` and block at `plan_approval`.

## Risks and Limits

- **EA stage**: Contexto README (March 2026) states the Maestro MCP APIs are under active development and may create incomplete XpressO. Run the edit task on created layouts to catch exceptions before treating anything as production-ready.
- **SUV availability is on the critical path**: if `$SUV_HOST` is flaky, the persist stage fails. This is a build-and-experiment tool, not a demo-under-deadline tool without a backup.
- **Manual MCP tool approval**: a full run approves dozens of Maestro MCP tool calls one at a time. Do not leave the IDE unattended.
- **Binding constraint**: layouts bind to the element's `workData`, not to external APIs. Public API responses seed structure, not data.
- **Two HITL gates, non-skippable**: `plan_approval` and `pre_suv_write` are enforced by `evaluate.sh`. Inflating confidence scores to bypass them will not work (the script re-reads `intent.json`).
- **Workspace switch is the whole integration**: if `cursor-app-control` is not available or `move_agent_to_root` fails, fall back to manually opening `~/contexto` in Cursor and running `/buildModulrLayout` directly.

## End-to-End Example

```
User: "Build a ModulR page on my SUV to show candidate stage history"

Mode pre-flight (PM workspace):
  - Goal: "Show candidate stage history as a timeline"
  - Target element WID: "b8a...xyz" (user provides)
  - Operation: create
  - Screenshot: attached (Figma export from design team)
  - Slug: "candidate-stage-history"

Mode workspace switch:
  -> cursor-app-control.move_agent_to_root({ rootPath: "/Users/david.denham/contexto" })

Mode hand-off instruction:
  "Now run /buildModulrLayout in this workspace with the captured inputs."

User runs the command.

Maestro:
  Initialize -> Discover -> [plan_approval] -> Build -> Bind -> Review -> [pre_suv_write] -> Persist

Mode post-flight:
  -> cursor-app-control.move_agent_to_root({ rootPath: "/Users/david.denham/product-manager-agent" })
  "Done. Layout persisted. Event log at ~/contexto/wip/candidate-stage-history/events.jsonl."
```

---

**Remember**: this is a mode within xo-builder. The umbrella's isolation contract applies. Do not chain into another mode without explicit user trigger.
