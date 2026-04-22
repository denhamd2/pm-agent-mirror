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
- Derived class `Offer Event (Derived)`: `110d07c2bf081000154ac036a50b0000`
- Service `XOAgents (labs - )`: `f25a77d68bd310001cc3c6bdf9f20000`
- Service Collection Resource `XOAgents/offer-events (labs - )`: `110d07c2bf08100011ae49a281e60000`
- Edit rep `mapsToClass` decision: Outcome C (`generateClassBasedProcessing: true` on the Service Operation Processing Option - no explicit derived subclass binding on the Edit rep)

## MCP tool wrappers

After the next Cursor MCP reconnect, these are callable from the PM workspace:

- `get_offer_events` (GET collection)
- `get_offer_event` (GET by id)
- `create_offer_event` (POST)
- `update_offer_event` (PATCH)
- `delete_offer_event` (DELETE)

## Known response shape (Phase 4 smoke, 22 April 2026)

| Step | Status | Expected (View rep `xoAgentOfferEventView`) | Actual (runtime) | Drift? |
|---|---|---|---|---|
| GET list | 200 | `{ total, data: [{ id, descriptor, role, job, photo }] }` | `{ total, data: [{ id, descriptor }] }` | Yes - `role`, `job`, `photo` missing |
| GET by id | 200 | `{ id, descriptor, role, job, photo }` | `{ id, descriptor }` | Yes - same three fields missing |
| POST | 201 | Full resource body | Empty body | Yes - empty body despite 2xx |
| PATCH | 200 | Full resource body | Empty body | Yes - empty body despite 2xx |
| DELETE | 204 | Empty | Empty | No |

Design-time schema (`suv_rest_call` with `fetch_schema=True`) confirms all five fields should be present on the View rep. Runtime omission of the three reference-type fields (`role`, `job`, `photo`) is a known gap pending a follow-up edit task on the created Representation Content.

## Known follow-ups

- **Edit task on View representation content**: ensure `role`, `job`, and `photo` are materialised in the response. Per the Safe Harbour reminder, generated XO is development-quality until the edit task is run on every created object.
- **POST/PATCH response body**: empty-body-on-write is an XO pattern, not necessarily a bug. Decide per-resource whether to populate the response body or keep it thin; the Offer Events API currently takes the thin path.

## Prototype (dogfood)

A Canvas Kit playground that exercises the live REST response shape (including drift) lives at:

- `design/offers-playground-v01.tsx` (UI at `http://localhost:5199/offers-playground-v01`)
- `design/proxy/offer-events-proxy.mjs` (Node proxy on `http://localhost:8787`)

**Transport:** Browser -> local proxy -> hosted XO MCP (`workbench-mcp.prod.dev.megaleo.com/suv/mcp`) -> SUV REST. Earlier versions tried plain HTTP Basic directly against the SUV, but the modern `/ccx/api/...` paths require OAuth bearer tokens and the legacy `/ccx/service/...` paths 404 for XO Agents resources. The only auth channel that works end-to-end today is the hosted XO MCP's `suv_rest_call` tool, so the proxy forwards browser HTTP to MCP JSON-RPC. Response bodies shown in the playground are identical to a direct REST call - the drift story is preserved.

Credentials are read from the `xo-mcp` entry in `~/.cursor/mcp.json` (`Authorization`, `SUV_HOSTNAME`, `SUV_PASSWORD`). Nothing is written to disk.

Run with `npm run dev:proxy` in one terminal and `npm run dev` in another, both from `design/`.

## Source artefacts

Contexto build artefacts live in `~/contexto/_bmad-output/implementation-artifacts/`:

- Design: `schema-design-offer-sequence-task.md`
- Implementation plan: `schema-implementation-offer-sequence-task.md`

Schema and implementation artefacts are **not** duplicated here - this file is the PM-workspace pointer into the Contexto build trail.
