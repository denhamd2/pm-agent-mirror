# Schema analysis (WIP) — Candidate Communication convenience task

**Task WID:** `e8482681f86a10000d7ea68cdaa54745`  
**Run:** `2026-05-01-phase1-candidate-communication-schema-analysis`

## Safe harbour (mandatory)

> The XO MCP schema toolchain is under active development. Objects created in this workflow may contain incomplete processing or missing bindings. If this API is destined for production check-in, you must run Instance Edit on each created object to catch code exceptions before CRS.

---

## Step 1 — Task understanding (`ui_task_analysis_get`)

| Field | Value |
|--------|--------|
| **task_type** | Convenience Task (**supported**) |
| **task_descriptor** | Candidate Communication |
| **security domain** | Candidate Communication (`e06648065c9110000e19d7d1bc0a0007`) |

**Element contents (count):** 14 rows from `ui_task_analysis_get` (no `proposed_class` / `proposed_class_report_fields` populated by introspection — class/CRF resolution deferred to `schema_analysis_get` + explicit CRF lookup).

---

## Step 2 — Schema-ready extraction (`schema_analysis_get`)

`schema_analysis_get` returns **15 `elementContent` rows** (includes the nested **Element** `Candidate Communication Subview [EL]` that groups the subview fields under a BEM with **dual loop-on-instances** RSMBs).

### 2.1 Root context

| Order | Descriptor (short) | Label | Work data | Schema note |
|-------|-------------------|-------|-----------|---------------|
| 00 | External or Internal Candidate [CL] | External or Internal Candidate | Class: **External or Internal Candidate** (`30a7c374f70610000a9b940ad6720000`), singular | Page title; BEM: `Instance@get This Instance(GSS)(public)[rsmb]` |
| 11 | Candidate Communication Subview [EL] | — | Element: Candidate Communication Subview | **Container**: loops **Recruiting Notification Event** + **Conversation Message** via nested RSMBs, then builds subview via `Candidate Communication Item@build Candidate Communication Subview(BE)[remb]` |

### 2.2 Leaf fields under subview (all **include** for representation parity with UI)

| Order | UI label | Work data type | Context class(es) | Binding summary |
|-------|----------|----------------|-------------------|-----------------|
| 100 | Timestamp | Date Attribute — DateTime (minute) | Conversation Message | `Conversation Message@get Date Created (Seconds)(GA)` |
| 200 | Email or Push Notification Successfully Sent? | Boolean — Processed | Recruiting Notification Event | Derived: processed flag for email/mobile push channel |
| 200a | Job Application for SMS | Work Set — Job Application (singular) | Conversation Message | `Conversation@get Job Application for Conversation Message...` |
| 200b | Outgoing SMS to Candidate? | Boolean — Is Worker | Recruiting Notification Event | Derived boolean |
| 201 | SMS Successfully Sent? | Boolean — SMS Processed | Recruiting Notification Event | EC-driven from RNE context |
| 202 | Incoming SMS from Candidate? | Boolean — Is Candidate | Conversation Message | EBE compares sender vs external contactable |
| 300 | Email Subject | Text — Notification Subject | Recruiting Notification Event | `Notification Event@get Notification Subject(GA)` |
| 400 | Email Body | Text — Notification Message (wide) | Recruiting Notification Event | Stripped HTML via RAMB on notification message |
| 401 | SMs *(label typo in tenant)* | Text — SMS Message (wide) | Conversation Message | `Conversation Message@get Message Body(GA)*O` |
| 500 | Push Notification | Text — Push Notification Message | Recruiting Notification Event | Derived from notification event channels |
| 600 | Job Postings from Invite to Apply | Work Set — Instance (multi-class loop: Job Posting, Job Requisition Enabled) | RNE loops | Invite-to-apply related instances |
| 700 | Sender | Relationship — Process-maintained Role | Recruiting Notification Event | `Recruiting Notification Event@get Sent by Worker(GRS)[rsmb]` |
| 800 | Attachments | Relationship — Notification Event.has Attachment | Recruiting Notification Event | GR on attachment |

**Disposition:** **Include** all of the above in the REST read model unless PM explicitly scopes down. **Skip** nothing for Phase 1 parity with the task.

**Display options (UX-only, not separate CRFs):** “Do Not Show if Empty”, “Wide Text”, “Show No When False”, “Display As Page Title” — inform null/omitted-in-JSON behaviour only.

---

## Step 3 — Validations

`ui_task_analysis_get` with `validations_only: true` surfaced **one** introspected validation:

| Element | Source | Effect |
|---------|--------|--------|
| External or Internal Candidate [CL] | `External or Internal Candidate` validation source `30a7c374f70610000a9b940ad6720000` | Error: “Select a valid value for this field.” |

Interpretation: **required reference / allowable value constraint on the candidate context**, not on subview literals. Maps to REST as **missing or invalid `{candidate}` path/id** or **403/404 domain security**, not necessarily a duplicated field-level validator on timeline rows.

Subview fields had **no** separate validation payloads in introspection runs.

---

## Step 4 — Class hierarchy checkpoints (`class_get`)

| Class | WID | Relevance |
|-------|-----|-----------|
| **Candidate Communication Item** | `e7fc5a22aba610000a11bea3421b0000` | Abstract parent of timeline row types (**module:** HR Recruiting:Candidate Communication) |
| **Recruiting Notification Event** | `1ea0e2bfef1c100004ac5df9c51e009b` | Subclass of `Candidate Communication Item`; email/push/SMS-send metadata |
| **Conversation Message** | `92a4c7f0567610002806553fba310000` | Subclass of `Candidate Communication Item`; SMS body, direction flags, timestamp |
| **External or Internal Candidate** | `30a7c374f70610000a9b940ad6720000` | Abstract candidate root; **task page context** |

---

## Step 5 — CRF notes (sample)

`ui_task_analysis_get` did **not** attach CRFs to elements. Sample lookup for **Notification Subject**:

- CRF `2a52188e4951484ca8a736cca8f5478f` — **`forClass`: Notification Event** (supertype), **`wqlAlias`:** `notificationSubject`, executes **`Notification Event@get Notification Subject(GA)(public)`**.

**Phase 2 work:** Enumerate **per-attribute** CRFs for each exposed field on **Recruiting Notification Event**, **Conversation Message**, relationships (attachments, sender), and derived booleans — reuse inherited CRFs where `forClass` is a superclass; otherwise create net-new Workday-owned CRFs scoped to recruiting notification / conversation surfaces.

---

## Step 6 — Risks surfaced in analysis

1. **Polymorphism:** One UI “row” is either **Recruiting Notification Event** or **Conversation Message**. A single flat class representation will not match without a discriminator + subtype-specific payloads or split resources.
2. **Full CRUD vs behaviour:** Task is **read/composite** only. POST/PATCH/DELETE may not map to stable instance lifecycle (notifications are pipeline-generated). Requires explicit PM/engineering confirmation before Phase 2 writes.
3. **Derived / EC / EBE fields:** Several columns are computed (processed flags, direction). Representations must reference existing GET/GR/RSMB-backed CRFs or processing, not imaginary mutable attributes.

---

## HITL — Phase 1 checkpoint

Waiting for explicit PM **approval** of:

- Inclusion of **invite-to-apply** instance bundle (order 600) and **attachments** (800) in v1 representation scope.
- Whether **reads** anchor on **candidate** vs **conversation** vs **dual resource** URIs.

No Phase 2 schema implementation writes until **`schema-implementation-wip.md` is approved**.
