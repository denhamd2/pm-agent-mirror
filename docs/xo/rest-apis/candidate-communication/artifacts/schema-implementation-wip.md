---
# Option B (split sub-resources) — current
api_design: option_b
actual_service_descriptor: hrrecruiting
actual_service_version: v1
actual_service_wid: a93ff6ca921610001fc9548bf018100f
actual_service_container_wid: ba74f44bc90e107329f60a13cd2e0013
parent_candidates_scr_wid: 53902ad9948f10000d60a1b15e420049
ssc_candidate_notification_events_wid: f19cefa311a510001cd897b1f9980000
ssc_candidate_conversation_messages_wid: f19cefa311a510001cd8bc8d4f540000
view_rep_rne_wid: f19cefa311a510001cbcf9af62400000
view_rep_conversation_message_wid: f19cefa311a510001cbd0eb6b3790000
get_op_notification_events_wid: f19cefa311a510001cda4364c76a0000
get_op_conversation_messages_wid: f19cefa311a510001cda5fa623780000
# Legacy Option A (superseded; optional cleanup)
legacy_cci_view_rep_wid: f19cefa311a510001bda1d3381c40000
resource_slug: candidate-communication
task_wid: e8482681f86a10000d7ea68cdaa54745
maps_to_class_decision: not_applicable_get_only_no_edit_rep
phase_4_smoke_drift:
  - id: REST_403
    detail: "suv_rest_call GET hrrecruiting/v1/candidates returned 403; nested collection GET not executed."
  - id: PUSH_WHITELIST
    detail: "Push Notification Message RC exists but is excluded from RNE rep contents."
  - id: SINGLETON_GET
    detail: "No second GET op for /{subResource}/{id} authored."
---

# Implementation plan → execution results

**PM decisions applied (current):** GET-only v1 • **Option B** — two SSCs under `hrrecruiting/candidates`: `candidateNotificationEvents` and `candidateConversationMessages`. Attachments included on **notification events** via Notification Event Attachments CRF. Invite-to-apply job posting multiset remains **out of surface** (CRF lives on **Recruiting Email** subclass).

**Historical:** Option A blocked on `UNION_RSMB` + `CCI_FIELD_WHITELIST` — see §5 table below for the archived attempt.

**Service strategy:** Attached new View representation to existing **`hrrecruiting`** `v1` container (same routing as incumbent internal recruiting APIs) rather than spawning a redundant top-level `Service` shell — aligns with SSC under `hrrecruiting/candidates`.

---

## 1. Object-change table (anticipated)

### 1.1 Business objects

| Action | Object | Notes |
|--------|--------|--------|
| **Reuse** | BO for **Candidate Communication Item** | Confirm existing BO ID via `business_object_get` |
| **Reuse** | BO for **Recruiting Notification Event** | Attachment/sender/job posting fields |
| **Reuse** | BO for **Conversation Message** | SMS text, timestamps, job application ref |

Likely **no new BO** if all fields bind to existing classes.

---

### 1.2 Class report fields (CRFs)

| Priority | Field concept | Likely strategy |
|----------|----------------|-----------------|
| P0 | Notification subject/message/push/sender/attachments/processed/SMS flags on **RNE** | Reuse inherited **Notification Event** text CRFs where valid; recruiting-specific RSMBs (e.g. Sent by Worker, invite loops) → verify or create WO CRF |
| P0 | Conversation: message body, timestamps, direction, job application | Reuse **`Conversation Message`** GA/GR-backed CRFs where they exist publicly or internally |
| P1 | **Sort key** for mixed timeline | If no single `timestamp`, add computed CRF or document **client-side merge** rule |
| P2 | **Invite-to-apply** instance multiset | Complex loop — may be **embedded reference array** representation content |

Phase 2: run `class_report_field_get` filtered by `class_=1ea0e2bfef1c100004ac5df9c51e009b` and `class_=92a4c7f0567610002806553fba310000` to inventory coverage.

---

### 1.3 Service / SCR / representations / operations

| Object | Descriptor (proposed) | Notes |
|--------|----------------------|-------|
| **Service** | `hrRecruitingCandidateCommunication` | New dedicated service |
| **Service collection resource** | `candidateCommunicationItems` | Nested under candidate in OpenAPI naming; SCR links to reps + ops |
| **View representation** | `candidateCommunicationItemView` | Polymorphic read shape (Option A design doc) |
| **Edit representation** | `candidateCommunicationItemEdit` | **Optional / may be omitted** if CRUD is read-only |
| **GET collection op** | `getCandidateCommunicationItems` | Candidate path param |
| **GET singleton op** | `getCandidateCommunicationItem` | Candidate + item WID |
| **POST op** | `createCandidateCommunicationItem` | **Conditional** |
| **PATCH op** | `updateCandidateCommunicationItem` | **Conditional** |
| **DELETE op** | `deleteCandidateCommunicationItem` | **Conditional** |

---

### 1.4 Processing / method bindings

- **Reads:** Prefer **existing** getters (GA/GR/RSMB/RAMB) surfaced via CRFs — minimal new processing.
- **Writes (if approved):** Require **explicit** `mapsToClass` decision (abstract vs derived subclass vs generate-class-based-processing) per `rest-from-task` Phase 2 preflight.
- **Loops (invite-to-apply, attachments):** May need **sub-resource processing** or **Representation Content** with multi-instance getters — spike in Phase 3.

---

## 2. WIDs to pre-resolve in Phase 2

Already known from Phase 1:

| Concept | WID |
|---------|-----|
| Task | `e8482681f86a10000d7ea68cdaa54745` |
| Candidate Communication Item (abstract) | `e7fc5a22aba610000a11bea3421b0000` |
| Recruiting Notification Event | `1ea0e2bfef1c100004ac5df9c51e009b` |
| Conversation Message | `92a4c7f0567610002806553fba310000` |
| External or Internal Candidate | `30a7c374f70610000a9b940ad6720000` |

To fetch in Phase 2: domain IDs for service security alignment, toggles (`toggleable_*`) if any attach to net-new CRFs, and BO WIDs via `business_object_get`.

---

## 3. Phase execution order (post-approval)

1. Phase 2 preflight: **Edit rep `mapsToClass`** branch — if **no edits**, omit Edit rep entirely and constrain operations to **GET-only**.
2. Create/patch **Service** shell.
3. Create **View** WO representation + representation content (**RC**) rows aligned to CRF inventory.
4. Create **SCR** + **operations** (GET ×2 minimum).
5. If CRUD confirmed: Edit rep + POST/PATCH/DELETE ops + Phase 3 processing options (DPU/PUMB/PU).
6. Phase 4: CRF toggle attach, singleton-doc clear, XO Agent tool registration, smoke, PM README index update.

Every write batch requires explicit **`approve`** per `rest-from-task` Tier 2 HITL.

---

## 4. Rollback narrative

See **`artifacts/objects-modified.json`** for the authoritative create ledger. Prefer Instance Edit remediation before CRS if auditors flag graph drift.

---

## 5. Option B — Phase 2–4 execution (current)

| Step | Status | Notes |
|------|--------|--------|
| Reconcile Option A artefacts | **DRIFT** | Left legacy **`candidateCommunicationItemTimelineView`** + four RCs in tenant; API surface no longer references them. Optional cleanup via Instance Edit. |
| RNE view rep + RC | **OK** | **`candidateNotificationEventTimelineView`** `f19cefa311a510001cbcf9af6240000` — subject, message body, **Notification Event Attachments** (`1f24472df25a100024071e14c4f60000`). |
| Push field on RNE rep | **DRIFT** | RC **`f19cefa311a510001cd0eb7446da0000`** POSTed; **`service_representation_workday_owned_patch`** response omits push from **`contents`** (whitelist behaviour analogous to Option A). |
| Conversation Message view rep + RC | **OK** | **`candidateConversationMessageTimelineView`** `f19cefa311a510001cbd0eb6b3790000` — message body, **`messageCreatedMoment`** (`722da80be44310000d71072e85620000`, alias rule blocked `…Date` suffix), body type. |
| SSC **candidateNotificationEvents** | **OK** | `f19cefa311a510001cd897b1f9980000`; RSMB `c319923a5645100006edd79ef1020687` (*External or Internal Candidate@…Recruiting Notification Events…*). |
| SSC **candidateConversationMessages** | **OK** | `f19cefa311a510001cd8bc8d4f540000`; RSMB `e7fc5a22aba610000e746da6fcf60000`. |
| GET operations ×2 | **OK** | `f19cefa311a510001cda4364c76a0000`, `f19cefa311a510001cda5fa623780000`; **`securityProvider`:** Self-Service **Candidate** `a2abd8cc2c58100006708e96adc6001c` (aligns parent **Get Candidate** op — differs from earlier **Candidate Communication** domain sketch). |
| Phase 3 processing | **OK** | GET-only — no POST/PATCH/DELETE SOPOs (see **`processing-wip.md`**). |
| Phase 4 | **PARTIAL** | Tool registrations **`f19cefa311a510001ce2ac669bac0000`**, **`f19cefa311a510001ce2b99b7acc0000`**. Toggle attach **skipped** (no new CRFs). Singleton-doc clear **skipped** (no MCP path). Smoke **blocked** HTTP **403** on `GET hrrecruiting/v1/candidates`. README index **not written** (requires explicit PM approval per skill). |

**Callable URL shape (nominal):** `GET /hrrecruiting/v1/candidates/{candidateWID}/candidateNotificationEvents` and `GET /hrrecruiting/v1/candidates/{candidateWID}/candidateConversationMessages` (`limit`/`offset` per service conventions).

---

## 6. Archived: Option A Phase 2 execution (blocked)

| Step | Workflow ref | Status | Notes |
|------|----------------|--------|-------|
| 1 Load + preflight | `schema-implementation-direct` §1 | **OK** | Reused existing `hrrecruiting`; version `a93ff6ca921610001fc68a3c7cfc100d`. |
| 2 Business objects | §2 | **SKIPPED** | No new BO; reuse intended. |
| 3 Class report fields | §3 | **DRIFT / PARTIAL** | **No net-new CRFs created.** Experimented reuse CRF WIDs (`799649…` Conversation Message Message Body +TG; `2a52188…` Notification Subject on Notification Event superclass; `28c5c5…` Notification Message +TG; `577111…` Push Notification Message +TG). **Invite-to-apply + attachment CRF** mapping to RNE not completed. **`itemType` discriminator** not surfaced (would need whitelisted CCI-level or embedded-rep strategy). |
| 4 Service | §4 | **SKIPPED** | Existing `hrrecruiting`; no duplicate service created. |
| 5 Representation | §5 | **FIXED*** | **`candidateCommunicationItemTimelineView`** WID **`f19cefa311a510001bda1d3381c40000`**, `representsClass`=Candidate Communication Item (`e7fc5a22…`). *Whitelist validation failed on PATCH (see §6).* |
| 6 Representation Content | §6 | **DRIFT / BLOCKED** | Four RC POSTs succeeded; **`service_representation_workday_owned_patch`** to normalise **`contents`** failed **HTTP 400 A3347** — *Representation Content invalid — field must be member of CCI Service Representation enumerated valid CRF whitelist.* Cross-subtype CRF approach **not structurally validated** despite successful POSTs → **risk: Instance Edit rollback** before CRS. **`emailBodyStrippedHtml`** CRF executes **GA raw message**, not stripped RAMB parity with UI (**DRIFT**). |
| 7 Service Collection / Sub-collection resource | §7 | **BLOCKED** | **`service_sub_collection_resource_create`** admits **exactly one** `rsmb` **or** `customQuery`. Task UI merges **two** disjoint instance sets (**RNE** RSMB `c319923…` context EOIC • **Conversation Message** RSMB `e7fc5a22…` context Candidate). **No single RSMB expresses union.** |
| 8 Operations | §8 | **BLOCKED** | No SSC → no **`service_operation_create`** for GET-collect / GET-singleton. Candidate Communication domain **`e06648065c9110000e19d7d1bc0a0007`** earmarked as `securityProvider` once ops exist. |
| 9 GET verification (`suv_rest_call`) | §9 | **SKIPPED** | No endpoint. |
| 10 Review | §10 | **DRIFT** | Two structural risks: union-instance-set + CCI field whitelist / embed strategy. |
| 11 Complete | §11 | **BLOCKED** | No hand-off to Phase 4 smoke. |

**Phase 3 execution** *(Option A only — superseded)*

| Phase 3 workflow step | Status | Notes |
|------------------------|--------|-------|
| Understand / Investigate / Plan | **OK** | See `artifacts/processing-wip.md`. |
| Execute processing options | **BLOCKED** | No operations ⇒ no `service_operation_processing_option_*`. |
| Review | **OK** | POST/PATCH/DELETE marked **`not_in_scope`**; GET segments **`blocked_with_reason`** (pre-req SCC). |

**Rollback / cleanup recommendation**

Reverse order delete or Instance Edit remediation: RC WIDs **`f19cefa311…`00000 / `…047000` / `…c3000` / `…a4000`**, then View rep **`f19cefa311a510001bda1d3381c40000`** if platform flags inconsistent graph.

---

## 7. Remaining engineering options (product gaps)

1. **Union instance set**: Platform authoring of **composite RSMB** OR **authorised Custom Query Executable Returning Instance Set** returning **Candidate Communication Item** multiset for a given **Candidate** parent context (`hrrecruiting/candidates` SSC pattern).
2. **Option A polymorphism**: After whitelist review, pursue **explicit `contents` whitelist** alignment **or** **linked / embedded child representations** (RNE-view + Conversation-message-view facets) surfaced under one OpenAPI façade per REST architecture review.

**Option B status:** Metadata paths for **dual GET collections** exist; runtime smoke blocked on SUV **403** (see **`smoke-results.json`**).

**Singleton GET** and **invite-to-apply** (third subclass **Recruiting Email**) remain **follow-ups** if PM wants parity with full Candidate Communication task.
