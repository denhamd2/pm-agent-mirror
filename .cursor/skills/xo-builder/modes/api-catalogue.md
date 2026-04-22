# Mode: api-catalogue

**Tier:** 1 (read-only) • **Workspace switch:** No • **Writes to SUV:** No

"What APIs exist for X?" Search across pinned public Workday OpenAPI specs and the internal XO REST surface on your SUV, return a combined catalogue, and flag gaps between the two.

Runs entirely from the PM workspace. No workspace switch. No writes.

## Worked Example Prompts

- "What APIs exist for interview feedback?"
- "Find endpoints for candidate contact info."
- "Does Workday have a public API for adding a candidate tag? If not, what's the internal XO REST equivalent?"
- "Internal vs public API gap for job requisition creation."
- "Search the API catalogue for `jobApplications`."

## Inputs

- **Topic / free-text query** - what the user is looking for. Examples: "worker contact info", "interview feedback", "job change events", "candidate skills", "person addresses".
- Optional: **resource name** if the user already knows it (e.g. `prospectSummary`, `jobRequisition`).
- Optional: **internal-only** or **public-only** flag if the user wants to scope the search.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Topic captured (at least one keyword).
- [ ] User understands this mode is **read-only** and does not call the APIs - just catalogues them.

## Tools Used

- Pinned OAS files in [`research/workday-public-apis/`](../../../../research/workday-public-apis/) (local grep, no MCP needed). Twelve specs, all dated 2026-04-18 unless noted:
  - **Recruiting core**:
    - [`recruiting_v4_20260418_oas2.json`](../../../../research/workday-public-apis/recruiting_v4_20260418_oas2.json) - 25 endpoints, 99 schemas.
    - [`staffing_v7_20260418_oas2.json`](../../../../research/workday-public-apis/staffing_v7_20260418_oas2.json) - 115 endpoints, 210 schemas.
    - [`person_v4_20260418_oas2.json`](../../../../research/workday-public-apis/person_v4_20260418_oas2.json) - 82 endpoints, 210 schemas.
  - **Platform plumbing**:
    - [`businessProcess_v1_20260418_oas2.json`](../../../../research/workday-public-apis/businessProcess_v1_20260418_oas2.json) - 21 endpoints, 93 schemas. BP events, event-step approve/deny/sendBack/reassign/cancel/rescind.
    - [`connect_v2_20260418_oas2.json`](../../../../research/workday-public-apis/connect_v2_20260418_oas2.json) - 7 endpoints, 26 schemas. Message templates + sendMessage.
    - [`wql_v1_20260418_oas2.json`](../../../../research/workday-public-apis/wql_v1_20260418_oas2.json) - 7 endpoints, 26 schemas. WQL data sources and query execution.
    - [`request_v2_20260418_oas2.json`](../../../../research/workday-public-apis/request_v2_20260418_oas2.json) - 5 endpoints, 81 schemas. Generic Workday self-service requests.
    - [`asor_v1_20260418_oas2.json`](../../../../research/workday-public-apis/asor_v1_20260418_oas2.json) - 3 endpoints, 42 schemas. Agent System of Record (A2A Agent Card).
  - **Narrow or companion specs (catalogue with caveats)**:
    - [`attachments_v1_20260418_oas2.json`](../../../../research/workday-public-apis/attachments_v1_20260418_oas2.json) - 1 endpoint, 5 schemas. Companion to other APIs that return `downloadID`.
    - [`communications_v1_20260418_oas2.json`](../../../../research/workday-public-apis/communications_v1_20260418_oas2.json) - 1 endpoint, 6 schemas. Recipient consent; **legal-compliance-relevant**.
    - [`oAuthClient_v1_20260418_oas2.json`](../../../../research/workday-public-apis/oAuthClient_v1_20260418_oas2.json) - 2 endpoints, 6 schemas. OAuth Client Details (OCFR).
  - **OAS 3.0 (different host pattern)**:
    - [`prismAnalytics_v3_20231120_oas3.json`](../../../../research/workday-public-apis/prismAnalytics_v3_20231120_oas3.json) (dated 2023-11-20) - 15 endpoints, 55 schemas. Prism tables, buckets, data changes. Primary consumer is `@data-scientist`.
  - See [research README](../../../../research/workday-public-apis/README.md) for full surface summaries and base-path rules (Prism uses `/api/prismAnalytics/v3/{tenant}/...`, everything else uses `/ccx/api/<service>/<version>/...`).
- `user-xo-mcp` tools for the internal surface:
  - `suv_rest_metadata_api_call` - fetch internal REST metadata on the SUV.
  - `service_description_get` - fetch service-level OpenAPI description.
  - `service_operation_get` - drill into specific operations.
  - `service_collection_resource_get` - inspect collection resources.
  - `xo_search` - resolve resource/service names to WIDs.

All read-only.

## Flow

1. **Parse the topic into search terms.** Expand synonyms. Example: "worker contact info" -> `["worker", "contact", "address", "phone", "email", "homeContact", "workContact"]`.

2. **Search public OAS files in parallel.** For each of the 12 pinned specs, grep for each term across:
   - `paths` keys (endpoint patterns)
   - `definitions` keys (OAS 2.0) or `components.schemas` keys (OAS 3.0 - only Prism)
   - `tags` section (service groupings)
   - operation `summary` and `description` fields

   Capture: file path, `#/paths/<path>`, method, tag, operation ID, summary, request schema, response schema.

   **Cross-spec awareness**: some topics straddle multiple specs. Examples:
   - "contact info" -> Person v4 (primary) + Staffing v7 workers (related) + Recruiting v4 (candidate contact)
   - "approvals / workflows" -> Business Process v1 (always) + whichever domain spec describes the approvable object
   - "candidate messaging" -> Connect v2 (primary) + Communications v1 (consent) + Recruiting v4 (prospects)
   - "analytics / reporting" -> WQL v1 (queries) + Prism v3 (data lake)
   - "integrations / auth" -> OAuth Client v1 + ASOR v1 (agents)

   Surface the cross-spec links in the output so the user sees the full picture, not just the first-matching spec.

3. **Search internal surface in parallel.** Run `suv_rest_metadata_api_call` with the topic as a filter and `xo_search` with index variants (`resource: <term>`, `service: <term>`). Capture service WIDs and resource paths.

4. **Deduplicate and rank.** If the same resource appears in both public and internal, match them up. Rank by exact-match-in-name first, then by description relevance.

5. **Produce a combined markdown table.** Columns:
   - **Endpoint** (path, or service + resource for internal)
   - **Method** (GET/POST/PATCH/PUT/DELETE)
   - **Source** (Public Recruiting v4, Public Staffing v6, Public Person v3, or Internal XO REST)
   - **Tag / service** (e.g. `prospects`, `jobChanges`, `people`)
   - **Schema** (primary request or response schema name)
   - **Notes** (writeable/read-only, public/internal-only, any gotchas)

6. **Gap analysis section.** Call out:
   - Resources that exist internally but not publicly (e.g. "candidate offer is internal-only, not in Recruiting v4").
   - Resources that are GET-only in public but writeable internally (e.g. "Recruiting v4 exposes `GET /jobPostings` but no POST/PATCH").
   - Resources covered only by SOAP, not REST, if known.
   - Resources reachable **only via WQL** (public) vs structured REST - note this so the user knows whether `wql-query` mode is the right follow-up.
   - Resources gated by **Business Process v1** approvals (e.g. "offers write requires POST then BP approval via `eventSteps/{ID}/approve`").
   - **Domain-gated endpoints**: flag any public endpoint that is likely to return 403 for a bare superuser role because the gating domain is not included by default (e.g. `/recruiting/v4/interviews/*/feedback` → "Interview Feedback Public API" domain; specific `/businessProcess/v1/eventSteps/*/approve` calls → the BP's own approval domain). Name the likely gating domain when derivable. This is a permission reality on dev SUVs, not a bug in the catalogue.

7. **Offer next step (do not auto-run).** Ask: "Do you want to (a) narrow the results, (b) inspect a specific endpoint, (c) run a WQL query against this data with `wql-query` mode, (d) scaffold a REST test with `rest-scaffold` mode, or (e) stop?" Respect the user's answer.

### Fixture-from-OAS fallback

When the user hits 403 on a catalogued endpoint (domain-gated, see step 6) and `wql-query` also cannot bridge the gap (DS is gated by field-level security, or no equivalent public DS exists), the honest fallback is to build against the schema:

1. Extract the response schema from the pinned OAS file (e.g. `interviewEventWithJobApplicationJobRequisitionInterviewerDetails` from `recruiting_v4_20260418_oas2.json`).
2. Generate a realistic fixture shaped to that schema and write it to `design/fixtures/<slug>.json`.
3. Build the Canvas Kit prototype against the fixture - the UI contract (field names, shapes, enums) matches the live API exactly.
4. When live data unblocks (domain granted, or an equivalent WQL source found), swap the fetch call; the UI does not change.

Flag this path explicitly when recommending it: "live data is blocked by `<domain>` security on this SUV; building against the OAS schema as a fixture is the honest fallback, not a workaround."

## Output example (abridged)

```markdown
## APIs matching: "worker contact info"

**Public surface** (11 matches)

| Endpoint | Method | Source | Tag | Schema | Notes |
|---|---|---|---|---|---|
| `/people/{ID}` | GET | Person v3 | people | personRepresentation_e451... | Read-only on core person |
| `/people/{ID}/phones` | GET | Person v3 | people | phoneNumbers_d8f2... | Collection |
| `/homeContactInformationChanges` | POST | Person v3 | homeContactInformationChanges | homeContactChangeEvent_* | Creates a change event |
| `/workContactInformationChanges` | POST | Person v3 | workContactInformationChanges | workContactChangeEvent_* | Creates a change event |
| `/workers/{ID}` | GET | Staffing v6 | workers | worker_271b... | Worker core |
| ... | ... | ... | ... | ... | ... |

**Internal surface** (from SUV)
| Endpoint | Method | Service | Resource | Notes |
|---|---|---|---|---|
| `person/labs/personalDetails/{ID}` | GET, PATCH | Person Labs | personalDetails | Supports direct PATCH, public only supports change-event POST |

**Gaps**:
- Public API requires a **change event** to modify contact info; internal allows direct PATCH on `personalDetails`.
- No public endpoint exposes local-name overrides at the same granularity as the internal `personLocalizedNameComponentFormat_*` surface.
```

## Non-goals

- Calling the APIs (use `rest-scaffold` if you want a WATS test instead).
- Writing anything.
- Explaining the business logic of each endpoint - just catalogue and gap-flag.

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Return the catalogue + gap analysis. Ask if another mode is wanted. Do not assume.
