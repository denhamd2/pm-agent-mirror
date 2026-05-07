# XO Builder - Mode Index

Machine-readable index of every mode in `xo-builder/modes/`. Each entry lists: tier, workspace-switch requirement, SUV-write flag, primary tools, and complete trigger phrase list.

Use this file to check "is X covered by xo-builder?" without reading the full dispatcher.

Every mode below can be invoked two ways: via the direct skill trigger (as listed per mode) **or** via the `@xo-developer` subagent (`.cursor/agents/xo-developer-agent.md`), which runs the same mode with a Principal Workday Software Engineer advisory layer on top.

---

## Tier 1 - Read-only (no workspace switch, no writes)

### `modes/page-discovery.md`
- **Workspace switch:** No
- **Writes to SUV:** No
- **Primary tools:** `xo_search`, `ui_task_analysis_get`, `class_get`, `service_description_get`, `element_content_get`, `method_binding_get`
- **Triggers:**
  - `/xo-builder page-discovery`
  - "explain this page"
  - "what is this xoUi"
  - "reverse engineer this task"
  - "what does this SUV page do"
  - "walk me through this xoUi"

### `modes/api-catalogue.md`
- **Workspace switch:** No
- **Writes to SUV:** No
- **Primary tools:** All 12 pinned OAS files in `research/workday-public-apis/` (Recruiting v4, Staffing v7, Person v4, Business Process v1, Connect v2, WQL v1, Request v2, ASOR v1, Attachments v1, Communications v1, OAuth Client v1, Prism Analytics v3), `suv_rest_metadata_api_call`, `service_description_get`, `xo_search`
- **Triggers:**
  - `/xo-builder api-catalogue`
  - "what APIs exist for X"
  - "search the API catalogue"
  - "find endpoints for X"
  - "does Workday have an API for X"
  - "internal vs public API gap for X"

### `modes/wql-query.md`
- **Workspace switch:** No
- **Writes to SUV:** No (WQL `POST /data` is documented read-only; mode also refuses any non-SELECT token as defence in depth)
- **Primary tools:** Pinned `wql_v1_20260418_oas2.json` + `suv_rest_metadata_api_call` (`GET /wql/v1/dataSources`, `GET /wql/v1/dataSources/{ID}/fields`, `GET`/`POST /wql/v1/data`), `xo_search` for data-source resolution
- **Output:** inline preview or fixture at `design/fixtures/<slug>.json`
- **Triggers:**
  - `/xo-builder wql-query`
  - "run a WQL query"
  - "pull this data from my SUV"
  - "query the SUV with WQL"
  - "fixture from WQL"
  - "what does the data look like for X"

### `modes/validation-analysis.md`
- **Workspace switch:** No
- **Writes to SUV:** No (read-only gap analysis; writes go through `validation-edit`)
- **Primary tools:** `ui_task_analysis_get` (with `validations_only: true`), `service_operation_get`, `service_representation_workday_owned_get`, `representation_content_workday_owned_get`, `validation_get`, `xo_search`
- **Output:** Gap matrix table (UI validation vs REST constraint status)
- **Triggers:**
  - `/xo-builder validation-analysis`
  - "compare validations between task and REST"
  - "what validations are missing from the REST API"
  - "validation gap analysis"
  - "which UI validations should I port"
  - "are all validations covered"

---

## Tier 1 - Guarded build (workspace switch, Maestro HITL)

### `modes/modulr-page.md`
- **Workspace switch:** Yes (`~/contexto`)
- **Writes to SUV:** Yes (via Maestro HITL - `plan_approval` and `pre_suv_write` checkpoints)
- **Primary tools:** Contexto `/buildModulrLayout`
- **Triggers:**
  - `/xo-builder modulr-page`
  - **Legacy (back-compat):**
    - `/modulr-prototype`
    - "build a ModulR page on my SUV"
    - "build a ModulR layout on my SUV"
    - "mock this on my SUV with Maestro"
    - "ModulR prototype from this API response"
    - "ModulR layout on my SUV"
    - "scaffold a ModulR page"
    - "run the Maestro workflow on my SUV"

---

## Tier 2 - Guarded write (no workspace switch, diff-approve-apply-verify HITL)

### `modes/copy-edit.md`
- **Workspace switch:** No
- **Writes to SUV:** Yes (`element_content_patch`)
- **Primary tools:** `element_content_get`, `element_content_patch`
- **Scope:** `overrideLabel`, `helpText`, `automationId` only
- **Triggers:**
  - `/xo-builder copy-edit`
  - "change the copy on this element"
  - "update this label"
  - "edit element help text"
  - "rename this field"
  - "change this field's automation ID"

### `modes/validation-edit.md`
- **Workspace switch:** No
- **Writes to SUV:** Yes (`validation_create`, `validation_patch`, `ui_reusable_validation_bindings_create`)
- **Primary tools:** `validation_get`, `validation_create`, `validation_patch`, `ebe_evaluate_boolean_expression_method_create`, `ec_evaluate_conditions_method_create`, `reusable_validation_implementation_create`, `ui_reusable_validation_bindings_create`, `word_bucket_get`
- **Triggers:**
  - `/xo-builder validation-edit`
  - "add a validation that says X"
  - "edit this validation"
  - "add a rule that blocks X"
  - "require X when Y"
  - "show an error when X"

### `modes/prompt-edit.md`
- **Workspace switch:** No
- **Writes to SUV:** Yes (`prompt_patch`, `prompt_group_patch`)
- **Primary tools:** `prompt_get`, `prompt_patch`, `prompt_group_get`, `prompt_group_patch`
- **Scope:** Regular prompts and prompt groups only. Prompt resources and smart-prompts out of scope for v1.
- **Triggers:**
  - `/xo-builder prompt-edit`
  - "tweak this prompt"
  - "change this prompt text"
  - "add a prompt option"
  - "edit this prompt group"
  - "rename this prompt"

### `modes/method-edit.md`
- **Workspace switch:** No
- **Writes to SUV:** Yes (type-specific `_patch` for BA / EBE / EC methods)
- **Primary tools:** `method_get`, type-specific `_get`/`_patch` (`ba_method_*`, `ebe_evaluate_boolean_expression_method_*`, `ec_evaluate_conditions_method_*`), `method_binding_get`
- **Scope:** `displayName` and `expression` (or equivalent body field) on an existing BA / EBE / EC method only. Creating, deleting, re-typing, or rebinding methods is out of scope.
- **Triggers:**
  - `/xo-builder method-edit`
  - "update this BA method"
  - "rename this method"
  - "edit this EBE method"
  - "edit this EC method"
  - "add a SQL filter to this method"
  - "change the expression on this method"

---

## Tier 2 - Guarded build (no workspace switch, direct XO MCP + HITL)

### `modes/rest-from-task.md`
- **Workspace switch:** No
- **Writes to SUV:** Yes (heavily - creates BOs, CRFs, Service, Representations, RCs, SCR, Operations, Processing via PM-workspace direct workflows with per-phase HITL)
- **Primary tools:** XO MCP direct toolchain (`ui_task_analysis_get`, `schema_analysis_get`, `class_report_field_*`, `service_*`, `representation_content_*`, `service_operation_*`, `service_operation_processing_option_*`, `linked_operation_processing_option_*`, `suv_rest_call`, `xo_agent_tool_registration_create`) + in-repo workflow maps (`workflows/schema-analysis-direct.md`, `workflows/schema-implementation-direct.md`, `workflows/processing-creation-direct.md`)
- **Triggers:**
  - `/xo-builder rest-from-task`
  - "convert this task to REST"
  - "build REST API from this task"
  - "create REST endpoints for this task"
  - "convert this UI task to a REST API"

---

## Tier 2 - Guarded build (workspace switch, Contexto HITL)

### `modes/rest-scaffold.md`
- **Workspace switch:** Yes (`~/contexto`)
- **Writes to SUV:** Yes (WATS test creation via `/wats-rest-builder`); Document sub-mode is non-destructive (writes only to `~/contexto/docs/openapi/`)
- **Primary tools:** Contexto `/generate-openapi-spec`, `/wats-rest-builder`
- **Sub-modes:** `document` (non-destructive OpenAPI spec generation), `test` (build WATS system test for an endpoint)
- **Triggers:**
  - `/xo-builder rest-scaffold`
  - "document this REST API"
  - "generate OpenAPI spec for X"
  - "build a REST test for X"
  - "scaffold WATS tests for this endpoint"

### `modes/wats-scenario.md`
- **Workspace switch:** Yes (`~/contexto`)
- **Writes to SUV:** Yes (WATS scenario/suite creation)
- **Primary tools:** Contexto `/wats-rest-builder` (for REST flows); direct XO MCP `wats_scenario_create`, `wats_scenario_wats_scenario_line_create`, `wats_suite_create`, `wats_system_test_create` (for UI flows)
- **Triggers:**
  - `/xo-builder wats-scenario`
  - "build a WATS scenario for X"
  - "create a test scenario for this flow"
  - "scaffold a test for this task"

---

## Non-goals (explicitly not covered by any mode in v1)

- Dashboards / worklets / home cards / reports (no XO primitive today)
- Business processes / sub-processes / BP types
- Integrations / integration services
- Notifications / alerts / email templates
- Security domain edits
- **Class / attribute / relationship schema changes** (creating new BOs, adding attributes, changing inheritance). Example ask: *"Create new Audited class 'Work Task' and Metadata class 'Work Task Status' from this UML, scoped to module `Financials:Budgets and Planning:Planning, 57$891`."* **Why not**: schema changes touch downstream BPs, security domains, reporting, and consumer integrations - they need formal epic/PRD routing, not vibe-coding. Route to [400-backlog-refinement](../../rules/400-backlog-refinement.mdc) for proper breakdown. If the user insists and it is a throwaway dev SUV, Contexto has slash commands (e.g. `/xo-workflow-builder` for custom workflows, or direct `business_object_create` calls) - but outside xo-builder scope
- Production writes (dev SUV only)
- Custom reusable workflows (use Contexto `/xo-workflow-builder` directly; see `@xo-developer` advisory #11)

If the user asks for any of these, decline and route them to the appropriate alternative (usually 400-backlog-refinement).

---

## Umbrella triggers (open catalogue menu, no mode selected)

- `/xo-builder`
- "vibe code on my SUV"
- "build me an XO [thing]"
- "what can xo-builder do"
