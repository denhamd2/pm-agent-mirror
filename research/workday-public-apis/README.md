# Workday Public API Specs

Dated snapshots of Workday's publicly documented REST API specs. Used as ground truth by the [xo-builder skill](../../.cursor/skills/xo-builder/SKILL.md) (and its legacy entry point [modulr-prototype](../../.cursor/skills/modulr-prototype/SKILL.md)) for PRD grounding, Canvas Kit prototype fixtures, internal-vs-public gap analysis, WQL-backed fixtures, and competitive-intelligence grounding.

Most specs are OAS 2.0 (`oas2.json`); Prism Analytics is OAS 3.0 (`oas3.json`). The `api-catalogue` mode handles both.

## What's here

| File | Service | Version | Captured | Confidence | Routing | OAS |
|---|---|---|---|---|---|---|
| `recruiting_v4_20260418_oas2.json` | Recruiting | v4 | 2026-04-18 | Production | Public | 2.0 |
| `staffing_v7_20260418_oas2.json` | Staffing | v7 | 2026-04-18 | Production | Public | 2.0 |
| `person_v4_20260418_oas2.json` | Person | v4 | 2026-04-18 | Production | Public | 2.0 |
| `businessProcess_v1_20260418_oas2.json` | Business Process | v1 | 2026-04-18 | Production | Public | 2.0 |
| `connect_v2_20260418_oas2.json` | Connect (messaging) | v2 | 2026-04-18 | Production | Public | 2.0 |
| `wql_v1_20260418_oas2.json` | WQL (Workday Query Language) | v1 | 2026-04-18 | Production | Public | 2.0 |
| `request_v2_20260418_oas2.json` | Requests | v2 | 2026-04-18 | Production | Public | 2.0 |
| `asor_v1_20260418_oas2.json` | ASOR (Agent System of Record) | v1 | 2026-04-18 | Production | Public | 2.0 |
| `attachments_v1_20260418_oas2.json` | Attachments | v1 | 2026-04-18 | Production | Public (companion) | 2.0 |
| `communications_v1_20260418_oas2.json` | Communications (recipient consent) | v1 | 2026-04-18 | Production | Public | 2.0 |
| `oAuthClient_v1_20260418_oas2.json` | OAuth Client Details | v1 | 2026-04-18 | Production | Public | 2.0 |
| `prismAnalytics_v3_20231120_oas3.json` | Prism Analytics | v3 | 2023-11-20 | Production | Public | 3.0 |

## How to refresh a snapshot

1. Open the Workday REST Services Directory: `https://community.workday.com/sites/default/files/file-hosting/restapi/index.html`. This is a JavaScript SPA, so use `cursor-ide-browser` or a regular browser to render it.
2. Navigate to the service you want (e.g. Recruiting, Staffing, Person, Business Process, Connect, WQL, Request, ASOR, Attachments, Communications, OAuth Client, Prism Analytics).
3. Download the OAS JSON spec for the desired version.
4. Save to this folder with the naming convention `<service>_v<N>_<YYYYMMDD>_oas<2|3>.json`. Keep the dated filename so past snapshots stay on disk and you can diff surface drift.
5. Update the table above with the new row.
6. Delete the old dated file for the same service when a new version is pinned (unless you explicitly want the historical snapshot for diffing).

## Current public surface (one-line summaries)

- **Recruiting v4**: 25 endpoints across 4 tags (`jobPostings` 6, `prospects` 19, `interviews` 5, `Prompt Values` 1), 99 schema definitions. GET-heavy; only `POST /prospects` (plus subresource creates on languages, skills, educations, experiences, resumeAttachments) and `POST /interviews/{ID}/feedback` are writeable. No top-level candidates or job applications resource; no POST/PATCH/DELETE on requisitions or postings.
- **Staffing v7**: 115 endpoints across 8 tags (`Prompt Values` 36, `jobChanges` 35, `workers` 32, `organizationAssignmentChanges` 27, `supervisoryOrganizations` 6, `jobs` 4, `jobProfiles` 2, `jobFamilies` 2), 210 schema definitions, 38 writes concentrated on `jobChanges`, `organizationAssignmentChanges`, worker check-ins, and worker skill items.
- **Person v4**: 82 endpoints across 6 tags (`people` 36, `workContactInformationChanges` 28, `homeContactInformationChanges` 27, `Prompt Values` 17, `countries` 4, `phoneValidation` 1), 210 schema definitions, 34 writes concentrated on contact-information change events (addresses, emails, phones, instant messengers, web addresses).
- **Business Process v1**: 21 endpoints across 4 tags (`events` 9, `eventSteps` 8, `types` 3, `Prompt Values` 1), 93 schema definitions, 8 writes. The core approval plumbing: `POST /eventSteps/{ID}/approve|deny|sendBack|reassign|toDo|questionnaire` and `POST /events/{ID}/cancel|rescind`. Every Recruiting approval flow (requisition, offer, hire) runs on this.
- **Connect v2**: 7 endpoints across 4 tags (`messageTemplates` 5, `notificationTypes` 2, `Prompt Values` 2, `sendMessage` 1), 26 schema definitions, 4 writes (`POST/PUT/PATCH /messageTemplates`, `POST /sendMessage`). Candidate-messaging plumbing - relevant to Paradox acquisition and all Recruiting comms PRDs.
- **WQL v1**: 7 endpoints across 2 tags (`dataSources` 6, `data` 2), 26 schema definitions, 1 write (`POST /data` for large queries). Workday Query Language - programmatic read access to every data source exposed to the user. Used by `xo-builder/modes/wql-query.md` for fixtures and gap analysis.
- **Request v2**: 5 endpoints across 2 tags (`requests` 4, `types` 2), 81 schema definitions, 2 writes (`POST /requests`, `POST /requests/{ID}/close`). Generic Workday self-service requests - Recruiting-adjacent (background checks, referrals, reschedule asks).
- **ASOR v1**: 3 endpoints across 2 tags (`agentDefinition` 2, `registration` 2), 42 schema definitions, 1 write (`POST /agentDefinition`). Agent System of Record - registers AI agents per the A2A Agent Card spec. Strategic surface for CI (HiredScore, Paradox, Illuminate) rather than day-to-day PRD grounding.
- **Attachments v1**: 1 endpoint (`GET /graphql/{ID}`), 5 schema definitions. **Companion endpoint only** - downloads an attachment by a `downloadID` returned from a Graph API query elsewhere (e.g. Recruiting v4 `resumeAttachmentFileView`). Not useful on its own.
- **Communications v1**: 1 endpoint (`POST /managedRecipient`), 6 schema definitions. Manages a user's consent status for messaging channels. Narrow surface but **legal-compliance-relevant** (GDPR, TCPA); route any PRD use through `060-legal-compliance-review`.
- **OAuth Client v1**: 2 GET endpoints, 6 schema definitions, read-only. Returns OAuth Client Details for OCFR (Open Clients For Recruiting) clients. Integrations-adjacent; low day-to-day PRD value.
- **Prism Analytics v3**: 15 endpoints across 3 tags (`Data Changes` 9, `Buckets` 7, `Tables` 5), 55 schema definitions, 11 writes. Create tables, stage data in buckets, execute data changes, upload files. Primary consumer is `@data-scientist`; not wrapped by any xo-builder mode in v1.

**Combined (all 12 pinned specs)**: 304 endpoints, 727 schema definitions, ~113 writeable operations across the Recruiting core (Recruiting + Staffing + Person) and the platform plumbing (Business Process, Connect, WQL, Request, ASOR, Attachments, Communications, OAuth Client, Prism). Enough to ground most PRDs, Canvas Kit fixtures, WQL-driven prototypes, and competitive gap analyses without inventing field names.

## Base path

On any Workday tenant, most services are addressed as:

```
https://<tenantHostname>/ccx/api/<service>/<version>/...
```

For example: `/ccx/api/recruiting/v4/prospects`, `/ccx/api/staffing/v7/workers`, `/ccx/api/person/v4/people/{ID}`, `/ccx/api/businessProcess/v1/eventSteps/{ID}/approve`, `/ccx/api/connect/v2/messageTemplates`, `/ccx/api/wql/v1/data`. Each spec's `host` placeholder is `<tenantHostname>`; there is no single public `api.workday.com` endpoint.

**Exception**: Prism Analytics v3 (OAS 3.0) uses a different host pattern: `<tenantHostname>/api/prismAnalytics/v3/{tenant}/...` - note the `{tenant}` path segment and the absence of the `ccx/` prefix.

## Downstream consumers (who reads these specs)

| Consumer | Reads which specs | Why |
|---|---|---|
| `xo-builder/modes/api-catalogue.md` | All 12 | Greps for endpoints and schemas matching a user topic; public-vs-internal gap analysis |
| `xo-builder/modes/modulr-page.md` | Recruiting v4, Staffing v7, Person v4, Business Process v1 | Layout-shape references for Sub-mode B (ModulR from API response) |
| `xo-builder/modes/wql-query.md` | WQL v1 | Required for the mode itself |
| `xo-builder/modes/page-discovery.md` | Recruiting v4, Staffing v7, Person v4, Business Process v1 | Lists reachable public endpoints + BP types when analysing a task |
| `@competitive-intel` / `@product-strategy-agent` | ASOR v1 (primary), all others (as needed) | Agent ecosystem CI and API gap analysis vs competitors |
| `@data-scientist` | Prism v3 (primary), WQL v1 (secondary) | Analytics pipelines and data-warehouse-adjacent queries |
| 200 PRD writing (`/write-prd` skill) | Any - cited ad hoc | PRD grounding with real endpoint/schema references |
| 060 legal-compliance review | Communications v1 (primary) | GDPR / TCPA consent flows |

All consumers read these files directly from disk; no MCP is involved. Keep the naming convention stable so greps stay reliable.
