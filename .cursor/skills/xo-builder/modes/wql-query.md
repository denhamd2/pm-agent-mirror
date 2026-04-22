# Mode: wql-query

**Tier:** 1 (read-only) • **Workspace switch:** No • **Writes to SUV:** No

"Pull this data from my SUV via WQL." Discover a Workday data source, draft a Workday Query Language query against it, execute it read-only via the WQL REST API, and return the rows. Optionally save them as a JSON fixture for Canvas Kit prototypes or hand off to `modulr-page` Sub-mode B.

Runs entirely from the PM workspace. No workspace switch. `POST /wql/v1/data` is documented read-only by the spec ("The read-only POST request accommodates queries greater than 2,048 characters"); this mode still refuses any WQL that looks non-declarative as a belt-and-braces guard.

## Worked Example Prompts

- "Pull all active job requisitions from my SUV into a fixture at `design/fixtures/open-reqs.json`."
- "Run a WQL query: candidates hired in the last 30 days with their primary skill and source."
- "What does the data look like for open requisitions in EMEA?"
- "Query `allWorkers` for everyone whose hire date is after `2025-01-01`, limit 50."
- "Fixture from WQL for candidate offers pending approval."

## When to use this mode

- Pull realistic fixture data for a Canvas Kit prototype (candidates, reqs, applications, worker summaries).
- Validate a PRD assumption ("does this data actually exist and is it queryable?").
- Gap-analyse "can a customer pull X via a public API" - if WQL can do it, the answer is usually yes.
- Seed a `modulr-page` Sub-mode B run without inventing a response shape.

## Inputs

- **Topic or data source** - one of:
  - Free text (e.g. "open requisitions in EMEA", "candidates hired in last 30 days"). The mode will resolve this to a data source via `GET /dataSources`.
  - Data source WID if the user already knows it.
  - A ready-to-run WQL string (user owns the query authoring).
- Optional: **row limit** (default 50, max 10,000 per spec).
- Optional: **output destination** - `inline` (default; print first N rows in the reply) or `fixture` (write to `~/product-manager-agent/design/fixtures/<slug>.json`).

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Topic or data source captured.
- [ ] User understands the mode is **read-only** and will not mutate any SUV object.
- [ ] If fixture output requested: target slug chosen (kebab-case); confirm that `design/fixtures/` is an acceptable sibling of existing design artefacts.
- [ ] `user-xo-mcp` is reachable (confirm via tool availability).

## Tools Used

- Pinned spec: [`research/workday-public-apis/wql_v1_20260418_oas2.json`](../../../../research/workday-public-apis/wql_v1_20260418_oas2.json) - 7 endpoints, 26 schemas, `basePath: /wql/v1`.
- `user-xo-mcp`:
  - `suv_rest_metadata_api_call` - the primary execution tool. Used to call the public WQL endpoints on the user's SUV with their credentials.
  - `xo_search` - fallback if the user says "worker skills data" without a data source WID.
- No Contexto. No workspace switch. No writes.

## Relevant WQL v1 endpoints (all GET unless flagged)

| Endpoint | Method | Purpose |
|---|---|---|
| `/dataSources` | GET | List all data sources the user can query. Primary business object + description. |
| `/dataSources/{ID}` | GET | Describe a single data source. |
| `/dataSources/{ID}/fields` | GET | List queryable fields for the data source (with types). |
| `/dataSources/{ID}/fields/{subresourceID}` | GET | Field detail including `workData` linkage. |
| `/dataSources/{ID}/dataSourceFilters` | GET | Discover supported filters. |
| `/dataSources/{ID}/dataSourceFilters/{subresourceID}` | GET | Filter detail. |
| `/data` | GET | Run a short WQL query (max 2,048 chars) as a URL parameter. |
| `/data` | **POST** (read-only per spec) | Run a longer WQL query; body schema `adhocQuery_62d3719129d610001871ae6373a41461`. |

## Flow

1. **Resolve the data source.**
   - If the user gave a WID: skip to step 2.
   - If the user gave free text: call `GET /dataSources` (via `suv_rest_metadata_api_call`) and grep the response's `dataSourceSummary_*` entries for matching names or descriptions. Present the top 3 matches ranked by name similarity; ask the user to confirm. Do **not** auto-pick on ambiguity.
   - **Note**: the `alias` query parameter on `GET /dataSources` is a **prefix match**, not substring. `?alias=interview` returns aliases starting with `interview` (e.g. `interviewTypes`), not every alias containing the word. Grep the full response body for substring matches; do not rely on `?alias=` alone.
   - If the user gave a ready WQL: skip to step 4 but still run steps 2 and 3 for context.

2. **Describe the source.** Call `GET /dataSources/{ID}` and `GET /dataSources/{ID}/fields` in parallel. Summarise: primary business object, notable fields, filter hooks. Show this to the user.

3. **Draft the query.** Based on the topic and the available fields, draft a WQL string. Show it as a fenced block. Example:

   ```sql
   SELECT Worker, JobProfile, PrimaryLocation, HireDate
   FROM allWorkers
   WHERE JobFamily = 'Software Engineering'
     AND HireDate >= DATE('2026-01-01')
   LIMIT 50
   ```

   Ask the user to **approve** the draft, `edit` it, or paste their own replacement. Do not execute without an approved query.

4. **Execute.**
   - For queries ≤ 2,048 characters: `GET /data?query=<encoded>&limit=<N>&offset=0`.
   - For longer queries or anything unsafe to URL-encode: `POST /data` with body `{ "query": "..." }` (request schema: `adhocQuery_*`).
   - Set `limit` from user input or default 50.
   - Use `suv_rest_metadata_api_call` to make the request with the user's SUV credentials.

5. **Return results.**
   - If `inline`: show first N rows as a markdown table, plus row count and timing. If paging, note the offset and how to fetch more.
   - If `fixture`: pretty-print the full JSON response to `design/fixtures/<slug>.json` and confirm the path. Include a small preview inline so the user sees what was saved.

6. **Offer next step (do not auto-run).** Ask: "Do you want to (a) refine the query, (b) save as a fixture, (c) feed this into `modulr-page` Sub-mode B, (d) cross-check against pinned public specs with `api-catalogue`, or (e) stop?" Respect the user's answer.

## Safety / guardrails

- **Read-only enforcement (defence in depth).** The WQL `/data` POST is documented read-only by the spec. This mode additionally refuses to send any query containing (case-insensitive) `UPDATE `, `DELETE `, `INSERT `, `CREATE `, `DROP `, `ALTER `, `GRANT `, `REVOKE `, or `TRUNCATE ` tokens. If one appears, stop and tell the user. (WQL is a SELECT-like language by design, but guardrails are cheap.)
- **No credential echoing.** Credentials are handled by `suv_rest_metadata_api_call`; do not print or log tokens.
- **Row cap.** Never request more than 10,000 rows in one call (the WQL spec max). If the user wants more, paginate with `offset` and confirm each batch.
- **Dev SUV only.** Global pre-flight already checks this; re-confirm if the query could surface PII at scale (candidate contact info, offer amounts).
- **PII handling for fixtures.** When writing to `design/fixtures/*.json`, recommend the user scrub obvious PII before checking in (names, emails, phones). This mode does not auto-scrub; it just flags.
- **No execution of user-pasted WQL without review.** Even if the user pastes a full query, print it back and ask them to confirm before running.

## Common WQL failure modes

These are the exact error signatures this mode should pattern-match before burning retries. Name the trap and suggest the fix immediately; do not keep retrying the same shape of query.

- **`Invalid WQL syntax. | Field: at or near '('`** → the user tried to treat `dataSources` (or another REST collection) as a WQL source (e.g. `SELECT * FROM (dataSources)` or `SELECT alias FROM dataSources`). `dataSources` is a REST collection, not a WQL-queryable data source. Switch to `GET /dataSources?alias=<prefix>` (prefix match - see Flow step 1) and grep the response body for matches.
- **`Enter a valid report field. This field is invalid: <alias>`** → the selected or filtered alias is not a queryable field on this DS, or it is a dotted path (e.g. `candidateRecruitingStatus.descriptor`) in a WHERE clause. WHERE filters must use the flat alias from `GET /dataSources/{ID}/fields`. Dotted traversal is not supported in filters.
- **`Invalid WQL query: Specify a data source filter`** → this DS requires a mandatory prompt filter before any query can run (e.g. `jobApplications`). Call `GET /dataSources/{ID}/dataSourceFilters` to discover which filter to supply, or pick a less-restricted sibling DS.
- **HTTP 500 with `"security configuration ... does not allow access to fields: WID1, WID2"`** → the listed WIDs are the DS's own prompt / filter fields. Field-level security on those WIDs gates the **entire data source**, not just your SELECT list. Changing the SELECT will not help. Switch to a related but more permissive DS (e.g. `jobApplications` for interview-adjacent data, `allCandidates` for candidate-adjacent) or fall back to fixture-from-OAS (see `api-catalogue` mode).
- **`limit parameter invalid: must be between 1 and 100`** on `GET /dataSources/{ID}/fields` → the `/fields` sub-resource caps `limit` at **100**, not 200. Paginate with `offset=0,100,200,...` if the DS has more than 100 fields.

## Non-goals

- Writing to Workday (use `copy-edit`, `validation-edit`, `prompt-edit`, or Contexto flows for that).
- Running Prism Analytics queries or ingestion (use `@data-scientist` or Contexto for Prism).
- Building long-running data pipelines.
- Hitting internal-only XO REST routes (this mode uses the public WQL surface; internal metadata lookups use `suv_rest_metadata_api_call` against public `/wql/v1/*`).
- Sanitising or anonymising output at scale (flag only, do not auto-scrub).

## Example run

```
User: "Pull the last 30 days of hired candidates with their requisition titles. Save as a fixture for my pipeline prototype."

Mode pre-flight:
  - Topic: "hired candidates last 30 days"
  - Output: fixture
  - Slug: "pipeline-hired-30d"

1. Resolve data source:
   GET /dataSources -> top match "allCandidates" (primary business object: Candidate).
   User: "confirm"

2. Describe:
   GET /dataSources/<ID> + /fields -> fields include Candidate, JobRequisition, HireDate, Status, Source.

3. Draft query:
     SELECT Candidate, JobRequisition, HireDate, Source
     FROM allCandidates
     WHERE Status = 'Hired'
       AND HireDate >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
     LIMIT 200
   User: "approve"

4. Execute:
   POST /wql/v1/data with body { query: "..." } via suv_rest_metadata_api_call.
   -> 127 rows returned.

5. Return:
   Writes 127 rows to design/fixtures/pipeline-hired-30d.json (full response).
   Prints first 10 rows inline as a preview table.

6. Offer next step: "feed into modulr-page Sub-mode B?"
```

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- If a fixture was written, the only filesystem artefact is `design/fixtures/<slug>.json`. No other writes.
- Ask the user if they want to run another mode. Do not assume.
