# Schema design (WIP) — Candidate Communication REST surface

## Design goals

1. **Expose what the Candidate Communication task shows:** a **timeline** of **Recruiting Notification Event** and **Conversation Message** instances for a given **External or Internal Candidate**, with the same derived flags and related references (job application for SMS, invite-to-apply targets, sender, attachments).
2. **Avoid duplicating** public **Recruiting v4** / **Connect v2** / **Communications v1** surfaces where they already answer a different question (see comparison section in `schema-analysis-wip.md` / gap matrix below).
3. **Make polymorphism explicit** so clients can parse subtype-specific fields without silent nulls.

---

## Proposed service (new, dedicated)

| Attribute | Proposal |
|-----------|----------|
| **Service name** | `hrRecruitingCandidateCommunication` |
| **Version** | `v1` (internal/labs routing per SUV convention — confirm container with `service_description_get` during Phase 2 preflight) |
| **Rationale** | Isolated from narrow public `recruiting` v4 scope; name mirrors module **HR Recruiting:Candidate Communication** |

*Auto-generated alternative acceptable if naming policy requires a shorter token, e.g. `recruitingCandidateCommunication` — reconcile with existing service namespace in Phase 2.*

---

## Resource & URI shape (proposal)

**Collection resource (primary):** `candidateCommunicationItems`

**Proposed path pattern (candidate-scoped):**

`GET|POST /{service}/v1/candidates/{candidateWID}/candidateCommunicationItems`  
`GET|PATCH|DELETE /{service}/v1/candidates/{candidateWID}/candidateCommunicationItems/{itemWID}`

- **`candidateWID`:** External or Internal Candidate instance WID (same object the task uses as page context).
- **`itemWID`:** **Discriminated** — either a **Recruiting Notification Event** WID or a **Conversation Message** WID (both subclass `Candidate Communication Item`).

**Discriminator property (JSON):** `itemType` with enum-style values:

- `recruitingNotificationEvent`
- `conversationMessage`

Clients must use `itemType` to interpret which optional blocks are populated.

---

## Representation topology

| Representation | Purpose | `representsClass` candidate |
|----------------|---------|------------------------------|
| **View** | Read single item + collection | **`Candidate Communication Item`** (abstract) with subtype RC rows **or** two View reps merged under one SCR (decision below) |
| **Edit** | POST/PATCH body | **Only if PM confirms mutable fields** — likely `Conversation Message (Derived)` or concrete subclass; **often not applicable** for notification events |
| **Summary / Reference** | Optional for list projections | Lightweight: `id`, `itemType`, `timestamp`, one-line label |

**Open design fork (PM pick):**

- **Option A (recommended for clarity):** One SCR, **one View rep** on **`Candidate Communication Item`**, with **subtype-specific optional objects** `recruitingNotificationEvent` / `conversationMessage` embedded (nullable).
- **Option B:** Two SCRs or two resource names under the same service (`notificationEvents`, `conversationMessages`) — simpler schemas, client merges sort order.

---

## Field-level plan (View — full parity)

All fields are **read** unless PM later approves writes for a strict subset.

### Common (both subtypes where applicable)

| JSON (proposed) | Source | Notes |
|-----------------|--------|--------|
| `id` | Instance WID | Required |
| `itemType` | Derived from class | Required discriminator |
| `timestamp` | Conversation path: `Date Created (Seconds)`; RNE path: **TBD** — may need **sort key** from `Timelineable Node` / activity stream ordering (Phase 2: confirm attribute or sort CRF) | UI shows timestamp in convo branch; RNE rows may need alternate ordering field |

### `recruitingNotificationEvent` block (nullable)

| JSON | UI / XO source |
|------|----------------|
| `emailOrPushProcessed` | Boolean **Processed** (order 200) |
| `outgoingSmsToCandidate` | Boolean **Is Worker** (200b) |
| `smsProcessed` | Boolean **SMS Processed** (201) |
| `emailSubject` | Text **Notification Subject** (300) |
| `emailBody` | Text **Notification Message** stripped HTML (400) |
| `pushNotification` | Text **Push Notification Message** (500) |
| `sender` | Reference — **Process-maintained Role** from `Sent by Worker` (700) |
| `attachments` | Reference[] — **Attachment** via `Notification Event.has Attachment` (800) |
| `jobPostingsFromInviteToApply` | Reference[] — looped **Job Posting** / **Job Requisition Enabled** instances (600) |

### `conversationMessage` block (nullable)

| JSON | UI / XO source |
|------|----------------|
| `timestamp` | **Date Created (Seconds)** (100) |
| `jobApplicationForSms` | Reference — **Job Application** (200a) |
| `incomingSmsFromCandidate` | Boolean **Is Candidate** (202) |
| `smsMessageBody` | Text **Message Body** (401) |

---

## Operation scope (requested: full CRUD)

| Operation | **Proposed Phase 2–3 stance** | Notes |
|-----------|------------------------------|--------|
| **GET** collection | **In scope** | Primary value; sort order must match UI intent (likely **desc** by activity time — confirm) |
| **GET** singleton | **In scope** | Id is globally unique WID; still nested under candidate for URL symmetry |
| **POST** | **Blocked pending PM** | Task has no create semantics; could imply **synthetic** conversation actions — legal + product review |
| **PATCH** | **Blocked pending PM** | Same; only defensible if explicit mutable attributes exist (e.g. mark-as-read) — not present on this task |
| **DELETE** | **Blocked pending PM** | Purge/archive semantics; likely **out of scope** for convenience-task parity |

**Engineering note:** Delivering **GET-only** in v1 is often the correct product outcome even when the brief says “full CRUD”; the implementation plan lists **POST/PATCH/DELETE** as **conditional** on confirmed use cases.

---

## Gap matrix — existing public API coverage

| Surface | What it covers | Candidate Communication timeline? |
|---------|----------------|-------------------------------------|
| **recruiting v4** (pinned OAS) | `jobPostings`, `interviews`, `prospects` | **No** resource for notification events, conversation messages, or candidate email/SMS history |
| **connect v2** | Message templates, notification types (admin) | **No** per-candidate delivered-message history |
| **communications v1** | `POST /managedRecipient` (SMS opt-in/out consent) | **No** timeline read; **related** for compliance when **sending** or displaying SMS |
| **XO `xo_search`** `resource: candidate communication` / `service: candidate` | — | **No** matching collection resource in this tenant search slice |

**Conclusion:** **New** dedicated service is justified for **read** timeline data. **Reuse** existing CRFs where `forClass` is **Notification Event** or shared supertypes; **compose** recruiting-specific relationship CRFs for sender, attachments, invite-to-apply loops.

---

## HITL

Approve this design (service name, resource path, polymorphism option A vs B, and CRUD reality check) before **`schema-implementation-wip.md`** execution.
