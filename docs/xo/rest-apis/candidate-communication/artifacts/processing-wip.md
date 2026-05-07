# Processing creation (Candidate Communication — Option B, GET-only)

**Status:** Phase 3 **complete** for scoped processing-gate — no POST/PATCH/DELETE; read GET operations rely on platform default read processing (no explicit `service_operation_processing_option_create` rows required for this build).

## Operation table

| Verb | Operation | Phase 3 status | Notes |
|------|-----------|----------------|--------|
| GET | `candidateNotificationEvents` collection | `ready` | Metadata-only read path; SSC + default GET op `f19cefa311a510001cda4364c76a0000`. |
| GET | `candidateConversationMessages` collection | `ready` | Metadata-only read path; SSC + default GET op `f19cefa311a510001cda5fa623780000`. |
| GET | Singleton `{notificationEventWid}` / `{messageWid}` under SSC | `not_in_scope` | Not authored — same pattern as several incumbent sub-collections (single default GET). |
| POST / PATCH / DELETE | — | `not_in_scope` | PM GET-first policy. |

## Processing options

Explicit DPU/PUMB/PU chains **not created** — appropriate for view GET on sub-collections when no write verbs are in scope.

## Follow-ups

1. If singleton GET-by-id is required for OpenAPI parity, add second GET op per SSC (named entry pattern) + security review.
2. Re-run `suv_rest_call` smoke when integration principal can `GET hrrecruiting/v1/candidates` (see `smoke-results.json`).
