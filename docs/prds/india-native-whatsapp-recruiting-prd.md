# Native WhatsApp Messaging in Core Recruiting UI (2026R2+)
Product Requirements Document
April 2026

**Mission:** INDIA-E2E-005  
**Revision:** Legal Compliance Review (1 pass, April 2026). Adds cross-border transfer, consent artefact, retention, free-text and special-category controls, mandatory privacy risk assessment at scale, TRAI / commercial-comms framing, multi-jurisdiction acknowledgement, and Paradox coexistence rules. **Red Team revision (1 pass, 7 April 2026):** Non-functional requirements (throughput, queues, webhooks, bulk caps, SLOs); hardened **Enhanced candidate communication consent** API/field contract and GA gating; **UDMF** and phone routing; Paradox **default ownership matrix** and **support runbook**; governance-led positioning (replacing “uniquely positioned” claims); **baseline → target** table for adoption and response-time metrics.

## Executive Summary

Workday can **differentiate on governance and auditability** by delivering **native WhatsApp messaging inside the core Recruiting experience** for India enterprise tenants, alongside honest parity closure against regional and global competitors. The capability brings candidate conversations onto the **single candidate record**, with **DPDP-aligned consent, logging, and auditability**, instead of leaking context to personal devices and unmanaged channels.

For our customers, this feature will let high-volume India recruiting teams (including operations at **1,500–2,000 hires per week**) reach candidates on the channel they already use daily, while **reducing candidate response time** and eliminating the compliance blind spot created when recruiters rely on personal WhatsApp. Primary research with India enterprise recruiters (**P1–P5**, Teleperformance India) converged on WhatsApp as the **dominant candidate channel**; this product response turns that evidence into a governed system of record.

For Workday, this initiative supports **India scale growth** and deal competitiveness: the India competitive matrix classifies **native WhatsApp in core Recruiting UI** as a **True Gap** (validated April 2026), while suites such as **Zoho Recruit** (marketplace WhatsApp), **PeopleStrong** (omnichannel including WhatsApp), and enterprise benchmarks (**Oracle** Recruiting Cloud messaging materials, **iCIMS** Text Engagement with WhatsApp templates) already shape buyer expectations. Closing the gap with **suite-native** messaging, **UDMF**, and **configurable privacy levers** strengthens the **governance and systems-of-record** narrative versus point-channel tools (consent evidence, thread history, retention, and cross-border transparency), without implying exclusive channel capability.

For GA, this initiative ships as a **Recruiting-core** experience (candidate profile and collaborative recruiting surfaces), **India-first** activation, with explicit **out-of-scope** items for v1 (see **Scope boundaries**) so delivery stays tractable and legally reviewable. **Enhanced candidate communication consent** (granular, withdrawable) is a **tightly coupled** dependency for **100% consent capture** on WhatsApp touchpoints; sequencing with Legal and Privacy is required before GA. **Cross-border flows** to **Meta** and any **BSP** must be documented for **DPDP** transfer posture and **customer DPA** expectations (see **Cross-border data transfers**). A **privacy risk assessment** (DPIA-equivalent) is **mandatory for v1 at scale**, not conditional on Legal discretion alone (see **Releases and production thresholds**).

**Epic Links:**
- Native WhatsApp Messaging in Core Recruiting UI EA: TBD
- Native WhatsApp Messaging in Core Recruiting UI GA: TBD

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | India recruiters running **industrial-scale** hiring depend on **personal WhatsApp** to reach candidates because **Workday Recruiting** does not offer **native WhatsApp** in the core UI. That behaviour creates **DPDP and programme risk** (weak or missing **consent trail**, limited **audit visibility**), **lost candidate context** (threads outside the candidate record), and **slower responses** when work is fragmented across devices. Primary research (**P1–P5**, Teleperformance India) is **unanimous** that WhatsApp is the **primary candidate channel** in this segment. |
| **How is it done today?** | Recruiters message from personal WhatsApp or ad hoc tools, then **manually** reconcile status in Workday. Some enterprises use **partner or Studio** patterns for outbound messaging; these are **workarounds** with higher delivery cost, inconsistent UX, and heavier burden on **consent and logging** design. Email and generic task volume remain poor substitutes for **mobile-first, conversational** follow-up at India response-time expectations. |
| **How does our approach differ (governance and product)?** | • **True Gap closure (native):** Per India competitive intelligence (April 2026), **native WhatsApp in core Recruiting UI** is a **True Gap** for Workday; this feature closes it **in-product**, not only via partner slides.<br>• **Honest competitive framing:** **Zoho** (marketplace), **PeopleStrong** (omnichannel), **Oracle** / **iCIMS** (enterprise messaging narratives) set **table stakes**; Workday emphasises **single candidate record**, **audit trail**, **UDMF** depth, and **DPDP-style** configurable **consent / retention / purge** (Native in matrix), not parity with **UIDAI Aadhaar eKYC** or **OOTB Naukri direct multipost** (separate True Gaps / Workarounds per `in-competitive-matrix.md` v1.12).<br>• **Recruiter-controlled send:** Human-initiated sends and templates (v1 excludes **chatbot / AI automation**).<br>• **Collaborative visibility:** Conversation visible to authorised recruiting roles on the **candidate record** (aligned with existing messaging patterns where applicable).<br>• **Consent-first:** **100% DPDP consent capture** for WhatsApp outreach is a **declared success criterion**; implementation details require **Legal** sign-off.<br>• **Related True Gap (not v1 scope for this PRD):** **Native +91 SMS** via Workday Messaging remains a **True Gap** per the same matrix; **CPaaS + Studio** remains a **Workaround** pattern for SMS outcomes until native coverage exists. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Impact (Business Value):** Candidate reach on WhatsApp with **governed** consent and logging; segment **Time to Hire** supported by faster candidate replies where the channel fits (see **Baseline → target metrics** table below).<br><br>**Product Outcomes:**<br>• **Median time: recruiter WhatsApp sent → candidate reply** (PV) → drives **Time to Hire** and **Candidate Experience** BV narrative.<br>• **% of India-tenant recruiters active on native WhatsApp** (PV) → adoption and governance outcomes.<br>• **% of WhatsApp sends with valid consent artefact on record** (PV) → **DPDP** programme readiness (target **100%** for in-scope sends).<br><br>**Outputs (Product Catalogue):**<br>• **Usage:** WhatsApp messages sent per recruiter per month (scale with high-volume tenants; pilot baselines captured in **EA**).<br>• **Adoption:** see **Baseline → target metrics** table.<br><br>**Strategic Value & Outcomes:**<br>1. **Close India RFP / POC gap** on omnichannel: remove **True Gap** flag on **native WhatsApp** while keeping **honest** positioning on remaining gaps (**+91 SMS**, **Aadhaar gov eKYC**, **Naukri OOTB direct**, per matrix).<br>2. **Compliance posture:** auditable **consent + thread + delivery status** on the candidate record.<br>3. **Platform growth:** foundation for **future** **Phase 2** **WhatsApp Business API** automation (explicitly **out of v1**), without committing to **multi-channel orchestration engine** in v1. |

### Baseline → target metrics (India, activated tenants)

| **Metric** | **Baseline** | **Target** | **Measurement window** | **Notes** |
|------------|--------------|------------|------------------------|-----------|
| **Recruiter adoption (native WhatsApp)** | **0%** using **native** Workday WhatsApp on the tenant at channel activation (greenfield). Optional **EA** diagnostic: % of recruiters reporting **off-system** WhatsApp use pre-rollout (survey / interview, not a blocking KPI). | **80%** of **eligible** recruiters | **6 months** after tenant **WhatsApp activation** | **Eligible** = roles with messaging send permissions; exclude roles without rights. Denominator = eligible headcount at activation. |
| **Median candidate response time** | **Established in EA:** median hours from **first recruiter outbound** (email and/or off-system WhatsApp, per cohort definition) to **first candidate reply** on **India pilot** cohort. | **≥50% reduction** in median hours vs EA baseline for the **WhatsApp-native** send path on the same cohort definition | **EA** (baseline) → **post-GA** evaluation windows aligned with Value Realisation | Primary PV for “faster replies”; confirm **IUM** metric IDs and dashboards with Value Realisation (see **Open questions**). |
| **Consent artefact coverage** | N/A (feature off) | **100%** of **successful** in-scope outbound sends | From **GA** | A **successful** send must have a **valid consent artefact** per Annex; blocked attempts excluded from numerator. |

**Year 1 forecast (basis):** Adoption target as in table. Usage volume = pilot **messages per recruiter per month** × active recruiters × tenant rollout waves; baselines captured in IUM / product analytics during **EA**. Calculation must exclude recruiters in roles without messaging permissions.

**Source research (supporting evidence):** `research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md`  
**Competitive intelligence (required inputs):** `research/competitive/matrices/in-competitive-matrix.md` (v1.12, April 2026); `research/competitive/in/in-competitive-scan-2026-04-06-INDIA-E2E-005.md`

### Audience / Personas

**Primary Persona:** Recruiter (India, high-volume and specialist lanes)
- Runs large candidate pipelines (**including 1,500–2,000 hires per week** in cited research contexts).
- Needs **fast, traceable** WhatsApp outreach tied to **requisition and candidate state**.

**Secondary Persona:** Recruiting coordinator / sourcer (India)
- Sends **templated** updates (status, next steps, document requests) with **delivery visibility**.

**Tertiary Persona:** TA leader / compliance partner
- Needs **audit trail**, **consent evidence**, and **withdrawal** handling for **DPDP** programmes.

*Persona depth supplemented by `docs/workday-user-research/README.md` (HR Professional / Recruiting) and `docs/jtbd-recruiting-hr-professional-and-manager.md`.*

---

## Feature Solution

• Recruiter opens a **candidate** in Workday Recruiting and accesses a **WhatsApp** experience embedded in the **core UI** (for example **Messaging** or **Communication** panel on the candidate profile, consistent with existing recruiting communication patterns).
• **Conversation thread** shows **history**, **delivery / read** indicators where the **WhatsApp Business API** provides them, and **inbound replies** mapped to the **same candidate record**.
• **Send flow** is **recruiter-initiated**; v1 **does not** include **unsupervised chatbot** or **AI-drafted** auto-send (see **Out of scope**).
• **Templates (default path):** Recruiter selects **approved** WhatsApp templates (provider constraints) with **merge fields** for candidate and job context. **Templates-first** is the **default** product posture to reduce **special-category** and **sensitive** free-text risk (see **Free-text messaging and special-category data**).
• **Free-text (when permitted):** Only where **Meta / BSP** rules and **tenant admin** configuration allow; subject to **monitoring / guardrails** and **Legal**-approved policy (same section).
• **Consent gate:** System **blocks** outbound WhatsApp where **required consent** is missing or **withdrawn**; recruiter sees **clear reason** and path to **request / refresh** consent where product allows. **Valid consent artefact** fields and evidence are specified in **Annex: Consent artefact** (Legal and Privacy own final wording and jurisdictional variants).
• **100% consent capture (success criterion):** For every **successful** outbound WhatsApp in v1, a **valid consent artefact** exists on the candidate record, **linked** to **WhatsApp / commercial communications** opt-in where required (see Annex).
• **Bulk / multi-candidate:** Optional v1 slice if feasible: send **template** WhatsApp from **Find Candidates** (or equivalent). **Requirements:** (1) **Per-candidate** consent re-evaluation **at send time** (not only at selection time) so revocations and eligibility changes are honoured; (2) **Explicit preview** listing **included** vs **excluded** candidates with **reason codes** (no consent, withdrawn, wrong channel, policy); (3) **Secondary confirmation** when excluded count > 0 or recipient count exceeds tenant **admin** threshold; (4) **no send** to any row failing consent or TRAI / tenant **commercial communications** rules without override where legally impossible. Bulk **free-text** is **disallowed** in v1 unless Legal explicitly approves an exception path (default: **templates only** for bulk).
• **Security and permissions:** Messaging respects **Recruiting security** domains; only authorised roles see **threads** and **send** actions.
• **Audit:** Each send logs **who**, **when**, **template**, **channel**, **delivery outcome**, and **consent reference** for audit export and investigations.
• **India-first configuration:** Tenant or region configuration enables **WhatsApp** for India hiring programmes; extensibility to other regions is **non-blocking** but **secondary** to India GA criteria.

### Experience Principles Alignment

**Empower (Give Users Control)**
- Recruiters **choose when** to send; no **auto-send** without recruiter action in v1.
- **Preview** and **explicit confirm** for bulk sends; **excluded** candidates are visible **before** send with **actionable reason** (consent, withdrawal, channel, **commercial communications** eligibility). **Per-candidate** checks run at **confirm**, not only when building the recipient list.

**Trust (Build Their Confidence)**
- **Transparent** delivery states and **clear** consent indicators on the profile.
- **Familiar** language: **WhatsApp**, **Send**, **Reply**, **Consent**, not internal codenames.

**Grow (Enable Them To Change)**
- **Template** lifecycle manageable by **TA admins** within **guardrails** (Legal-approved catalogue).
- **Consent withdrawal** updates **immediately** for **future** sends; **history** retained per **retention** policy.

**Principle validation**
- [x] User stays in control (recruiter-initiated v1).
- [x] Transparency on delivery and consent.
- [x] Change and auditability without **off-system** shadow threads.

---

## Critical User Journey & Use Cases

• Recruiter navigates from **requisition** or **candidate work queue** to **candidate profile**.
• Opens **WhatsApp** panel; system loads **thread** (if any) and **consent** badge.
• If **consent missing**, recruiter triggers **consent request** flow (aligned to **Enhanced candidate communication consent** initiative) or uses **alternate channel**; **block** with explanation if policy forbids send.
• Recruiter picks **template**, reviews **merged** body, **sends**; system records **audit** row and displays **delivery** progression.
• Candidate **replies**; message **lands** on thread; recruiter continues **in Workday**.
• **Coordinator** views same thread when security permits; **no** reliance on **personal device** exports.
• **Compliance** user exports **audit** or connects to **SIEM** per tenant programme (implementation-dependent).

---

## Competitive and market context (India)

| **Classification** | **Capability** | **Notes** |
|--------------------|----------------|-----------|
| **True Gap (closing in v1)** | Native **WhatsApp** in **core Recruiting UI** | Validated **DA-INDIA-E2E-005** (April 2026); this PRD is the product response. |
| **True Gap (not this PRD)** | Native **+91 SMS** (Workday Messaging geography) | Remains **True Gap**; **Workaround** = **CPaaS + Studio + BP** with consent/logging caveats. |
| **Workaround** | **Paradox** (and similar) for **conversational** journeys | Use **where licensed**. **Coexistence (v1):** summarised below; see **Paradox coexistence: default ownership matrix** and **Support runbook**. Full **technical deduplication** of provider-level threads is **TBD** (see **Open questions**). |
| **Native (Workday, adjacent)** | **UDMF**, **bulk Find Candidates**, **DPDP-style** consent / retention / purge configuration | **Counter** to mid-market **omnichannel** marketing; avoid **over-claiming** **Aadhaar eKYC** or **Naukri OOTB direct**. |

Representative competitor **public** positioning is summarised in `research/competitive/in/in-competitive-scan-2026-04-06-INDIA-E2E-005.md` (**Zoho**, **PeopleStrong**, **Oracle**, **iCIMS**, **Darwinbox** / **SpringVerify** adjacent).

### Paradox coexistence: default ownership matrix (v1)

| **Journey / use case** | **Default owner** | **Native Workday WhatsApp (this PRD)** | **Configuration** |
|------------------------|-------------------|----------------------------------------|---------------------|
| **Paradox automated** flows (e.g. scheduling bot, structured prompts) | **Paradox** | **Does not replace** Paradox automation; **no duplicate** templated system message for the **same purpose** without **TA admin** rule | **TA admin** routing matrix |
| **Recruiter-initiated** template message on **candidate record** | **Native** | **System of record** for that **recruiter-led** thread when tenant enables native channel | Default when feature on |
| **One-way / operational** notifications initiated from **Paradox** templates | **Paradox** unless moved | Native **does not** intercept without explicit **routing** rule | **TA admin** |
| **Marketing / nurture** journeys (if licensed separately) | **Paradox** or **Recruiting Marketing** (tenant-dependent) | Native **excluded** unless purpose coded as **recruiting transactional** and **consent** covers it | **TA admin** + Legal purpose codes |

**Rules (carry-forward):** (1) **Opt-in** captured in Paradox **must** map to tenant **consent** fields or **explicit exclusion** from native send if incompatible. (2) **TA admin** defines **which use cases** use **native vs Paradox** for WhatsApp to avoid **conflicting** opt-ins. (3) Recruiters see **channel origin** indicators where feasible.

### Support runbook (v1, product + CS enablement)

| **Tier** | **Symptoms** | **First actions** | **Escalate when** |
|----------|--------------|-------------------|-------------------|
| **L1** | Send blocked; “no consent”; template missing | Verify **Enhanced consent** state, **WABA** activation, **template** approval in catalogue; confirm **India** channel toggle | Consent model correct but still blocked after **24h** |
| **L2** | Provider errors; stuck **queued**; delayed **delivery/read** | Check **queue depth**, **webhook** processing lag, **BSP** incident; use **retry** and **alternate template** per PRD | **SLO** breach > **1 hour** sustained or **tenant-wide** failure |
| **L3** | **Duplicate** or **split** threads; Paradox + native **overlap**; wrong-candidate attribution | Apply **ownership matrix**; pause **bulk** for affected cohort; open **engineering** bridge for **provider-level dedupe** (**TBD**) | **P1** data-integrity risk or **Legal** escalation |

**Reference:** Internal support KB draft to link **consent artefact IDs**, **WABA** IDs, and **tenant routing** config screenshots (**TBD** GTM asset).

---

## Out of scope (v1) — PM boundaries

• **WhatsApp Business API chatbot / AI automation** (**Phase 2**).
• **WhatsApp-based interview scheduling** via **Paradox** (separate roadmap item).
• **Multi-channel orchestration engine** (single hub routing across many channels).
• **Native +91 SMS** (separate initiative; may share **consent** patterns but not committed in this PRD).

---

## Technical design and dependencies (non-AI)

### Key system dependencies

**APIs and dependencies**
1. **Meta WhatsApp Business Platform** (or approved BSP): template management, send, webhooks for delivery and inbound.
2. **Workday Recruiting** candidate and application model: thread persistence, consent fields, security.
3. **Enhanced candidate communication consent**: data model and UX for **capture, storage, withdrawal** aligned to **DPDP** (Legal-driven). **Field/API contract (engineering + Legal):** v1 must expose a **versioned** read/write surface (services or integration-friendly equivalents) for all **Annex: Consent artefact** minimum fields, including **channel**, **purpose enumerations**, **legal basis hook**, **capture and withdrawal timestamps**, **scope flags** (bulk / free-text eligibility), and **correlation** to the **E.164** phone used for WhatsApp. **Withdrawal** events must be **consumable** by the WhatsApp service within the **propagation SLO** (see **Non-functional requirements**). **No silent overwrite** of historical consent rows (append-only / versioned model per Annex).
4. **Notifications / real-time** infrastructure: inbound message surfacing to recruiter UI.
5. **Analytics**: adoption, usage, response-time metrics for **India** cohort reporting.

**GA gating (dependency hardening)**
• **India native WhatsApp** outbound **send surfaces** (single and bulk) are **disabled** for a tenant until **all** of: (1) **Enhanced candidate communication consent** is **GA-available** and **enabled** for that tenant per product policy; (2) **Legal / Privacy** sign-off on consent copy and cross-border disclosures for the **WhatsApp** channel; (3) **WABA** (or BSP) configuration and **tenant admin** channel activation complete. **EA** may relax (3) only; (1) and (2) are **non-negotiable** for any production send.

**Authentication / security**
• OAuth / token model for **WhatsApp** integration; **secrets** in **Workday** secure configuration; **subprocessor** listing and **DPA** alignment for **India** processing and **cross-border** transfers (see **Cross-border data transfers**).

**Error and exception handling**
• **Template rejected** by provider: show actionable error, allow **retry** with alternate template.
• **Consent revoked** mid-flight: **block** new sends; display **state** change.
• **Webhook delay / failure**: **queue** and **reconcile**; show **degraded** state to recruiter when **stale**.

---

## Non-functional requirements (v1)

**Throughput and rate limiting**
• Architecture must support **high-volume India** tenants (research context **1,500–2,000 hires per week** at cited customers; per-recruiter concurrency varies). Define **per-tenant** sustained send targets with **Meta/BSP** limits; implement **client-side** and **server-side** throttling to avoid provider hard failures. Exact numeric **TPS** caps are **TBD** with engineering and provider quotas.

**Queues and reliability**
• **Outbound:** Durable **queue** for send jobs with **at-least-once** delivery semantics; **retry** with exponential backoff for transient provider errors; **dead-letter** path for permanent failures with **admin-visible** diagnostics.
• **Inbound / status:** Webhook payloads processed **asynchronously**; ordering **best-effort** (recruiters see **timestamp-ordered** thread with explicit **“ordering may vary”** only if Legal permits; default is **strong UX** ordering where technically feasible).

**Webhooks**
• **Verify** authenticity (signing secret / mTLS per provider); **idempotent** handling using provider message IDs; **dedupe** retries. **Poison** messages quarantined without blocking the whole tenant (tenant-scoped failure domains).

**Bulk caps**
• **Default maximum** recipients per bulk WhatsApp action: **500** per confirmation (configurable **downward** by tenant admin). **Hard ceiling** (e.g. **5,000**) subject to **Legal** and **performance** review; exceeding cap requires **batch** job pattern (**out of v1** unless prioritised).

**SLOs and operational targets (product-facing)**
• **Consent withdrawal → block new sends:** **p95 within 60 seconds** of committed withdrawal event (aligns with Annex target; engineering may improve).  
• **Webhook → visible delivery state:** **p95 processing within 60 seconds** under normal load (excluding provider outages).  
• **API availability** (Workday-facing send/read): target **99.9%** monthly for GA regions (standard enterprise bar; refine with SRE).  
• **Degraded mode:** when queues lag beyond threshold, show **non-blocking** recruiter banner and **read-only** thread where safe.

---

## UDMF, phone numbers, and message routing

**Purpose:** Reduce **wrong-thread**, **wrong-candidate**, and **post-merge** integrity failures when WhatsApp identifiers are **phone-based** and candidate records move under **UDMF**.

**UDMF merge and survivorship**
• On **candidate merge**, **all** WhatsApp **threads**, **delivery metadata**, and **audit rows** must **follow the surviving candidate ID**; **no orphaned** threads on merged-away IDs. **Provider** identifiers (e.g. conversation IDs) remapped or re-linked per engineering pattern; recruiters see **continuous** history on the survivor.
• **Merge preview** (where product already surfaces UDMF): show **warning** if both records had **active** WhatsApp threads or **conflicting** E.164 values; block merge completion until **resolved** per admin rule (**TBD** exact blocking vs warn-only with Legal).

**Shared numbers and organisational senders**
• Where tenants use a **shared WABA** or **organisation-owned** sender: UI must show **sender identity** consistent with **Meta** display rules; **inbound** routing uses **candidate phone + tenant context** to avoid **cross-candidate** leakage. **Mis-match** routes to **quarantine** queue for admin triage (**TBD** implementation depth for v1).

**Reassigned SIM / number recycling**
• If **E.164** on file **disagrees** with provider **last-seen** identity signals (where available), **block** auto-attach of inbound to thread and surface **“verify phone”** workflow for recruiter (**TBD** depth); do not attribute messages to the wrong person silently.

**Multiple profiles, one phone**
• When the same **E.164** appears on **more than one** candidate profile (data quality or household sharing): **disambiguation** at **send** and **inbound** routing; default **no send** until recruiter selects **authoritative** profile for that programme or **admin** resolves duplicate (**UDMF** alignment).

---

## Cross-border data transfers

**Scope:** Personal data originating from **India** hiring programmes may be processed in Workday and transferred to **Meta** (WhatsApp Business Platform) and/or an approved **BSP** for message delivery, webhook handling, and template operations.

**DPDP (India) posture (product framing):** The PRD assumes customers act as **data fiduciaries** (or determine roles per their legal advice) and require **lawful transfer** mechanisms, **notice**, and **consent** or other grounds as applicable. Workday must support **transparency** in **subprocessor** disclosures and **customer DPA** schedules: (1) **identity** of international recipients (**Meta**, named **BSP**); (2) **categories** of data transferred (e.g. **phone number**, **message content**, **delivery metadata**, **candidate identifiers** as implemented); (3) **purposes** (delivery, fraud abuse, provider analytics per **Meta** terms); (4) **safeguards** (contractual, organisational, technical) as determined by **Legal** and **Privacy** with customers.

**Customer DPA expectations:** Product and GTM enablement must allow customers to (a) **document** the transfer path **India → Meta / BSP →** potential **further** jurisdictions per provider policies; (b) **instruct** Workday within the **processor** model for in-scope processing; (c) **configure** retention and deletion aligned to **Retention and deletion** and their programme. **No** PRD commitment to **data localisation** inside India for **Meta** infrastructure; any **localisation** claim requires **Legal** sign-off and provider capability.

**Workday obligations:** Maintain accurate **subprocessor** notice, assist with **transfer impact** documentation, and implement **technical minimisation** (e.g. **pseudonymous** handles where possible, **template** preference over **free-text** where required).

---

## Retention and deletion

**Principle:** **Threads**, **metadata**, and **audit** logs serve **compliance**, **dispute resolution**, and **product** analytics; retention must be **definite**, **documented**, and **tenant-configurable** within **Legal**-approved bounds (floor and ceiling per region).

| **Data category** | **Default retention (indicative v1)** | **Tenant configurability** | **Notes** |
|-------------------|----------------------------------------|----------------------------|-----------|
| **Message thread body** (inbound / outbound content) | **24 months** active from last message on thread unless **Legal** prescribes otherwise | **Admin** may shorten within allowed range; extension only within **Legal** maximum | Aligned to typical **recruiting** dispute windows; subject to **DPDP** storage limitation and **customer** policy |
| **Delivery / read metadata** | Same as thread or **+90 days** if stored separately | Configurable with thread or separate shorter default | Provider receipts may have **shorter** provider-side lifecycle; Workday stores **copy** per policy |
| **Audit log rows** (who, when, template, channel, consent reference, outcome) | **7 years** default for **employment-related** audit **or** customer **legal** standard (whichever **Legal** mandates for India enterprise) | **Admin** choice among **Legal**-approved presets | Must support **export** and **SIEM**; **legal hold** pauses deletion |
| **Consent artefact** | **Life of candidate relationship + statutory limitation period** after relationship end (exact period **Legal**) | Withdrawal retained as **fact**; content minimised post-withdrawal | **Withdrawal** stops **future** sends immediately; **evidence** of past consent may be retained where **law** requires |

**Erasure vs retention:** **Candidate** or **customer** **erasure** requests trigger **deletion** workflows per **tenant** rules and **Legal** exceptions (**legal hold**, **litigation**). **Purge** jobs must **cascade** thread, metadata, and audit pointers consistently. **Right to correction** flows update **phone** and **consent** fields without breaking **audit** integrity (append-only correction log).

**Product requirements:** Expose **retention** presets in **admin** configuration; **block** settings outside **Legal**-allowed range; **document** effective dates and **timezone** (IST default for India tenants).

---

## Free-text messaging and special-category data

**Risk:** **Free-text** recruiting messages can capture **special-category** or **sensitive** personal data (e.g. **health**, **biometric** references, **religious** affiliation, **trade union**, **political** opinion) without structured fields, increasing **DPDP** and **GDPR** Article 9-style risk and **provider** abuse-policy exposure.

**Controls (v1):**
• **Templates-first:** Default UX emphasises **approved templates**; **free-text** is **secondary** and **gated** by **tenant admin** toggle (**off** by default for high-risk segments unless Legal approves).
• **Admin toggles:** **TA / Privacy admin** can (a) **disable** free-text **entirely**; (b) **enable** only for **roles** with **training** attestation; (c) **require** **template** for **bulk** always.
• **Detection and handling:** **Lightweight** keyword / pattern **warnings** (non-blocking where Legal requires **human** judgement) plus **recruiter** **in-product** guidance **not** to solicit sensitive data over WhatsApp; **optional** **blocking** patterns for known **high-risk** phrases if Legal approves.
• **Training and attestation:** Tenants may require **annual** **compliance** attestation for free-text **send** rights (tracked in **Learning** or **internal** attestation field **TBD** implementation).
• **Provider rules:** All sends comply with **Meta** **Commerce** and **Business** policies; **rejected** content surfaces **actionable** errors.

---

## Multi-jurisdiction processing

India-first activation does **not** remove **parallel** obligations for **non-India** candidates in the same tenant (e.g. **EU / EEA / UK** **GDPR**, **UK GDPR**, **Swiss** **FDPA**, or other **applicable** law). Product behaviour must (1) **evaluate** **jurisdiction** or **candidate** **privacy** **profile** where available; (2) **apply** **stricter** **consent**, **transfer**, and **retention** rules when **GDPR-class** **requirements** apply; (3) **surface** **blocks** or **alternate** channels when **WhatsApp** **transfer** or **basis** is **not** valid for that candidate; (4) **document** **multi-jurisdiction** handling in **customer** **enablement** and **DPA** **artifacts**. Exact **routing** rules per country are **Legal**-owned; engineering implements **configurable** **policy** hooks.

---

## India commercial communications (TRAI and tenant compliance)

**Legal classification support:** Workday provides **product** and **documentation** support so customers can run **India** **commercial communications** programmes **consistently** with **TRAI** **TCCCPR**-class obligations (e.g. **consent**, **preference**, **dnd** / **scrubbing** concepts) **as interpreted by** **customer** **Legal** for **recruiting** use cases. The product **does not** replace **enterprise** **telecom** **compliance** teams or **dlt** **template** **registration** workflows customers may need outside Workday.

**Tenant compliance:** **Admin** configuration captures whether **recruiting** WhatsApp is classified as **transactional** vs **promotional** for **internal** **governance**; **consent artefact** links **purpose** and **channel** to support **audit**. **Integration** with **external** **scrub** lists is **out of v1** unless **prioritised** (**Open questions**).

---

## UX Designs for 2026R2+

• Native WhatsApp in candidate profile — **Figma:** TBD (to be produced in **Design Brief** pass after PRD approval).
• Optional bulk WhatsApp from candidate grid — **Figma:** TBD.

---

## Releases & production thresholds

• **Legal / Privacy** review of **consent** copy, **processing purposes**, **retention**, **subprocessors**, **cross-border transfers**, and **India** **DPDP** alignment (**mandatory** before GA).
• **Responsible AI:** Not applicable to v1 (**no** **AI** **messaging** **automation** in scope).
• **Privacy risk assessment (mandatory):** For **v1** **GA** at **enterprise** **scale**, Workday completes a **Data Protection Impact Assessment** (**DPIA**) or **equivalent** **privacy** **risk** **assessment** **by default** (not **conditional** on ad hoc Legal **high-risk** **determination**). Scope includes **special-category** **risk** from **free-text**, **bulk** **sends**, **Meta** / **BSP** **transfers**, and **multi-jurisdiction** **candidates**. **Outcome**, **mitigations**, and **residual** **risk** sign-off are recorded in the **Legal** / **Privacy** **ticket** and **privacy** **register**.

---

## Target delivery & major milestones

| **Milestone** | **Target date** |
|----------------|-----------------|
| Legal / Privacy alignment on consent model and transfer / TRAI documentation | TBD |
| Privacy risk assessment (DPIA or equivalent) complete for v1 at scale | TBD |
| EA readiness (pilot tenants) | TBD |
| GA readiness (India) | TBD |
| Adoption review (**80%** recruiters at **6 months**) | TBD |

---

## Resources

• Epic — TBD (EA), TBD (GA)
• Legal review Jira: TBD
• DPIA / privacy risk assessment record (mandatory v1 at scale): TBD
• PRD (markdown): `docs/prds/india-native-whatsapp-recruiting-prd.md`
• PMF thematic analysis: `research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md`
• India competitive matrix: `research/competitive/matrices/in-competitive-matrix.md`
• India competitive scan: `research/competitive/in/in-competitive-scan-2026-04-06-INDIA-E2E-005.md`
• Experience principles: `docs/experience-principles.md`

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| TBD | Sr. Product Manager, Workday Recruiting |
| TBD | Engineering Lead |
| TBD | Product Design Lead |
| TBD | Legal / Privacy Partner |
| TBD | Executive Sponsor (Product - Talent Acquisition) |

---

## Open questions

• Exact **IUM metric** IDs and **dashboard** cut for **India** **response-time** and **funnel** impact (confirm with **Value Realization**).
• **BSP vs direct** Meta relationship: procurement, data flow, and **on-call** model.
• **Provider-level** **thread** **deduplication** when **Paradox** and **native** WhatsApp both use the same **candidate** **phone**: technical **feasibility** and **privacy** of **merging** vs **display-only** **linking** (coexistence **rules** in **Competitive and market context** are **product** **routing**; **single** **pane** **merge** is **unsettled**).
• **TRAI** **integration** depth for v1: **native** **scrub** / **DND** **API** **integration** vs **customer** **external** **process** only.
• **Jurisdictional** **automation**: degree to which **candidate** **residence** / **GDPR** **applicability** is **auto-detected** vs **tenant** **policy** **matrix** **only**.

---

## Annex: Consent artefact

**Purpose:** Define the **minimum** **valid** **consent** **record** for **WhatsApp** **recruiting** **outbound** so **DPDP**, **GDPR-class**, **TRAI-aligned** **customer** programmes, and **Meta** **opt-in** **requirements** can be **evidenced**. **Legal** and **Privacy** own **final** **definitions**, **wording**, and **jurisdictional** **variants**.

### Required data fields (minimum set)

| **Field** | **Description** |
|-----------|-----------------|
| **Artefact ID** | Immutable **unique** **identifier** **per** **consent** **event** |
| **Candidate / subject reference** | Workday **candidate** **ID** (and **application** **context** if **scoped** **per** **req**) |
| **Channel** | **WhatsApp** (and **provider** **account** / **WABA** **reference** **if** **multi** **brand**) |
| **Purpose** | **Recruiting** **communications** **purposes** **as** **coded** **enumerations** (e.g. **status** **updates**, **interview** **coordination**, **document** **requests**) **aligned** **to** **privacy** **notice** |
| **Legal basis / ground** | **Customer** **selected** **ground** (e.g. **consent**, **contract** **steps**, **legitimate** **interest** **where** **valid**) **per** **jurisdiction** **hook** |
| **Consent version** | **Version** **ID** **of** **candidate** **facing** **text** **and** **privacy** **notice** **snapshot** **or** **hash** |
| **Language / locale** | **Language** **of** **presentation** **at** **capture** (e.g. **en-IN**, **hi-IN**) |
| **Capture timestamp** | **UTC** **and** **tenant** **timezone** |
| **Capture method** | **e.g.** **web** **form**, **in** **app** **apply** **flow**, **recruiter** **initiated** **request**, **import** |
| **Captured by** | **User** **ID** **or** **system** **job** **for** **audit** |
| **WhatsApp / commercial opt-in linkage** | **Evidence** **that** **business** **messaging** **opt-in** **meets** **Meta** **policy** (e.g. **keyword**, **checkbox** **artifact**, **double** **opt-in** **if** **required**) **and** **links** **to** **phone** **E.164** **on** **record** |
| **Withdrawal timestamp** | **Null** **if** **active**; **else** **UTC** **time** **withdrawal** **processed** |
| **Withdrawal channel** | **How** **withdrawn** (candidate **self** **service**, **admin**, **API**, **reply** **STOP** **equivalent** **if** **supported**) |
| **Scope flags** | **Bulk** **eligible** **Y/N**, **free-text** **eligible** **Y/N** **if** **tenant** **splits** **permissions** |

### Evidence

• **Immutable** **log** **append** **for** **create** **and** **withdraw**; **no** **silent** **overwrite** **of** **historical** **boolean**.
• **Hash** **or** **URI** **to** **stored** **consent** **copy** **shown** **to** **candidate** **where** **retained**.
• **Correlation** **IDs** **to** **first** **successful** **WhatsApp** **send** **after** **capture** **for** **proving** **chain**.

### Withdrawal mechanics

• **Withdrawal** **updates** **within** **seconds** **for** **future** **sends** (target **SLA** **TBD** **engineering**); **in-flight** **provider** **acceptance** **is** **best** **effort** **with** **clear** **recruiter** **messaging**.
• **Re** **opt-in** **follows** **fresh** **capture** **flow** **and** **new** **artefact** **row** **or** **versioned** **record** **per** **Legal**.

### Language and accessibility

• **Consent** **screens** **must** **support** **tenant** **configured** **languages** **for** **India** **programmes**; **default** **English** **plus** **Hindi** **where** **customer** **enables** **TBD**.

---

*When printed or exported to paginated format, use footers: `Workday Confidential` and page `-- N of ~18 --` per section boundary.*

Workday Confidential — April 2026  
-- 1 of 18 --
