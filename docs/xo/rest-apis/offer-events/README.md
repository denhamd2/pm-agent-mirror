# Offer Events REST API

REST API over the Offer Event class, built from the Offer (Sequence Task) via the `xo-builder` `rest-from-task` mode.
This README is the PM-workspace discoverability stub for the API. Rich Contexto build artefacts live in
`~/contexto/_bmad-output/implementation-artifacts/`; this file is the pointer.

## Naming reconciliation

| Layer | Name |
|---|---|
| UI Task | Offer (Sequence Task) |
| Source task slug | `offer-sequence-task` |
| Backing class | `Offer Event` |
| Target service | `XOAgents` (labs) |
| Resource URL | `/ccx/service/<tenant>/XOAgents/labs/offer-events` |
| MCP tool prefix | `{get,create,update,delete}_offer_event(s)` |
| Public JSON aliases | `role -> jobApplicationRole`, `job -> jobRequisition` (when rendered) |

## Canonical WIDs

- Backing class `Offer Event`: `1c619437537d4914a5482ac14eccc73f`
- Derived class `Offer Event (Derived)`: `31cd28f2a8f4100018842124e7440000`
- Service `XOAgents (labs - )`: `f25a77d68bd310001cc3c6bdf9f20000`
- Service Collection Resource `XOAgents/offer-events (labs - )`: `31cd28f2a8f41000187ec3a65aa80000`
- View rep `xoAgentOfferEventView`: `31cd28f2a8f410001872ce71a9550000`
- Edit rep `xoAgentOfferEventEdit`: `31cd28f2a8f410001872e110cbb40000`
- Service operations: GET `31cd28f2a8f4100018817ebc24930000`, POST `31cd28f2a8f410001881b9f7d5400000`, PATCH `31cd28f2a8f41000188224e9bb110000`, DELETE `31cd28f2a8f4100018826528aa7c0000`
- XO Agent tool registrations: `get_offer_events` `31cd28f2a8f4100019c6fb11bc130000`, `create_offer_event` `31cd28f2a8f4100019c726f10e4c0000`, `update_offer_event` `31cd28f2a8f4100019c713198f820000`, `delete_offer_event` `31cd28f2a8f4100019c739ce23930000`

## MCP tool wrappers

After the next Cursor MCP reconnect, these are callable from the PM workspace:

- `get_offer_events` (GET collection)
- `get_offer_event` (GET by id)
- `create_offer_event` (POST)
- `update_offer_event` (PATCH)
- `delete_offer_event` (DELETE)

## Known response shape (fresh SUV Phase 4 smoke, 23 April 2026)

| Step | Status | Design-time schema (View rep `xoAgentOfferEventView`) | Actual runtime | Drift? |
|---|---|---|---|---|
| GET list | 200 | `{ total, data: [{ id, descriptor, role, job, photo }] }` | `{ total, data: [{ id, descriptor }] }` | Yes - `role`, `job`, `photo` missing |
| GET by id | 200 | `{ id, descriptor, role, job, photo }` | `{ id, descriptor }` | Yes - same three fields missing |
| POST | 201 | Full resource body (View rep) | `{}` | Yes - empty body despite 2xx |
| PATCH | 200 | Full resource body (View rep) | `{}` | Yes - empty body despite 2xx |
| DELETE | 204 | Empty | Empty | No |

The `suv_rest_call` smoke on `i-0f863f6efa928c162` confirms the surface is callable and tool-registered, but runtime omissions remain: GET omits `role`/`job`/`photo` and POST/PATCH return empty bodies via MCP wrapper.

## Safe Harbour: single root cause, two symptoms

Workday XO's `rest-from-task` generator produces a **callable** REST API in ~5 minutes. What it does **not** do automatically is run the follow-up "Edit" task that kernel-level validators use to (a) activate new CRFs and RCs into the runtime rendering cache and (b) wire a separate response representation onto write operations. That follow-up task is UI-only.

### Attempted programmatic fixes (all failed as expected)

| Attempt | Tool | Target | Result |
|---|---|---|---|
| 1 | `representation_content_patch` | RC rows for role/job/photo on View rep | 200 OK, GET drift unchanged |
| 2a | `service_representation_workday_owned_patch` | View rep itself (name, description) | 200 OK, GET drift unchanged |
| 2b | `class_report_field_patch` | Role CRF, Photo CRF (descriptions) | 200 OK, GET drift unchanged |
| 3a | `service_operation_patch` POST/PATCH `defaultFieldRepresentations` -> View only | POST op, PATCH op | 500 `No 'Maps to Class' specified` - View rep has no `mapsToClass`, so request deserialisation broke |
| 3b | `service_operation_patch` POST/PATCH `defaultFieldRepresentations` -> [Edit, View] | POST op, PATCH op | 500 same error - runtime picks one rep, not both |
| 3c | Revert POST/PATCH to Edit-only | POST op, PATCH op | 201/200 with `{}` - baseline restored |
| 4a | `class_report_field_create` + `representation_content_workday_owned_create` | Added `photo` CRF `31cd28f2a8f410001afde59d05780000` and View RC `31cd28f2a8f410001b01f80bf3da0000` | Metadata create succeeded, runtime GET still omits fields |
| 4b | Ordered re-save pass using `*_patch` no-op updates | role CRF, job CRF, photo CRF, view rep, POST/PATCH ops | 200 OK on all updates, runtime drift unchanged |
| 4c | `service_operation_patch` POST/PATCH default reps -> `[View, Edit]` | POST op, PATCH op | Writes remain callable (no `mapsToClass` break), but response body still `{}` |

### Why these failed

The MCP-exposed patch tools (`*_patch`) write metadata fields but do not invoke the kernel-side validators or cache refresh that the UI "Edit" task runs. Specifically:

- **GET drift** needs a re-save through the Service Representation edit task that materialises RC rows into the runtime View-rendering cache. The RC/CRF/SR patches above touch the right objects but do not trigger the cache rebuild.
- **POST/PATCH drift** needs the View rep's `serviceOperations` back-reference to include POST and PATCH - this is a read-only field in `service_representation_workday_owned_patch`. Only the UI edit task can add that binding.

## Remediation (UI-only; follow-up work)

Run the XO "Edit" task in the SUV UI against these objects (fresh SUV WIDs):

1. CRF `Role as Event Subject +TG` - WID `31cd28f2a8f41000184349335bde0000`
2. CRF `Job Requisition` (pre-existing) - WID `5223eb025034100018991a2fce2c01b3`
3. CRF `Photo for Role +TG` - WID `31cd28f2a8f410001afde59d05780000`
4. Service Representation `xoAgentOfferEventView` - WID `31cd28f2a8f410001872ce71a9550000`
5. Service Operation `XOAgents/offer-events/post` - WID `31cd28f2a8f410001881b9f7d5400000` (ensure View rep binding for write response path)
6. Service Operation `XOAgents/offer-events/patch` - WID `31cd28f2a8f41000188224e9bb110000` (same)

After step 4, GET should begin returning `role`/`job`/`photo`. After steps 5-6, POST/PATCH should return a View-rep body.

Until those tasks run, the playground faithfully shows the runtime truth.

## Regression check

Contract assertions are codified in:

- `design/scripts/offer-events-contract-smoke.mjs`
- `npm run test:offer-events-contract` (from `design/`)

The script currently fails by design until drift is resolved, and prints a JSON report of missing fields and write-response emptiness.

## Prototype (dogfood)

A Canvas Kit playground that exercises the live REST response shape (including drift) lives at:

- `design/offers-playground-v01.tsx` (UI at `http://localhost:5199/offers-playground-v01`)
- `design/proxy/offer-events-proxy.mjs` (Node proxy on `http://localhost:8787`)

**Transport:** Browser -> local proxy -> hosted XO MCP (`workbench-mcp.prod.dev.megaleo.com/suv/mcp`) -> SUV REST. Earlier versions tried plain HTTP Basic directly against the SUV, but the modern `/ccx/api/...` paths require OAuth bearer tokens and the legacy `/ccx/service/...` paths 404 for XO Agents resources. The only auth channel that works end-to-end today is the hosted XO MCP's `suv_rest_call` tool, so the proxy forwards browser HTTP to MCP JSON-RPC. Response bodies shown in the playground are identical to a direct REST call - the drift story is preserved.

Credentials are read from the `xo-mcp` entry in `~/.cursor/mcp.json` (`Authorization`, `SUV_HOSTNAME`, `SUV_PASSWORD`). Nothing is written to disk.

Run with `npm run dev:proxy` in one terminal and `npm run dev` in another, both from `design/`.

## Source artefacts

Contexto build artefacts live in `~/contexto/_bmad-output/implementation-artifacts/`:

- Design: `schema-design-offer-sequence-task-fresh.md`
- Implementation plan: `schema-implementation-offer-sequence-task-fresh.md`

Schema and implementation artefacts are **not** duplicated here - this file is the PM-workspace pointer into the Contexto build trail.
