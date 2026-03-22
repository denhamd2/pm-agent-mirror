# Red Team PRD Review: GCC WhatsApp and Omnichannel Candidate Engagement

**Review Date**: 21 March 2026  
**PRD Reviewed**: `docs/prds/gcc-whatsapp-omnichannel-candidate-engagement-prd.md`  
**Reviewer**: Agent 080 (Red Team)  
**Pipeline**: GCC-E2E-006 Step 3a

---

## Critical Risks (Blockers if not addressed)

### 1. GCC "SMS fallback" contradicts current Workday Messaging geography

The PRD positions **SMS (Workday Messaging)** as a **sibling channel** and **fallback when WhatsApp is disabled**, including for **GCC** employers (overview table, scope, user journey "Fallback").

- **Evidence**: Deployment Agent states Workday Messaging supports SMS to **US and Canadian phone numbers only**, requires tenant hosted in **US or Dublin** data centres, separate **licence** and **Innovation Services Agreement**. That is incompatible with "recruiter uses SMS from the same panel" for **typical GCC candidate mobile numbers** unless a **separate, explicit product expansion** is in train and named in the PRD.
- **Impact**: Recruiters in GCC see **email-only** practical fallback today; the **unified omnichannel** story becomes **mostly WhatsApp + email**, not **WhatsApp + SMS + email**, undermining the executive summary and Shell-style policy narrative.
- **Recommended fix**: Add a **hard dependency section**: either (a) **programme commitment** to **non–US/CA SMS** (regions, timeline, compliance), or (b) **re-scope fallback** to **email + in-product guidance** when WhatsApp is off, and **remove or qualify** all GCC SMS fallback claims until true.

### 2. Core problem statement is partially stale vs shipped Candidate Engagement

The PRD states campaigns are **"fundamentally email-driven for multi-step automation"** and implies SMS is mainly ad hoc.

- **Evidence**: Deployment Agent: **SMS Campaigns** for **multi-step journeys** from **2025R1**; email remains primary for many designs but **SMS journey** is already native where Workday Messaging applies.
- **Impact**: **315** and stakeholders may **under-design** integration with **existing SMS campaign** capabilities, or **over-build** net-new journey logic that should **extend** current patterns.
- **Recommended fix**: Refresh **Overview** and **Technical Architecture** with **2025R1+** truth: **where** SMS campaigns live, **how** they differ from email steps, and **explicitly** what this epic **adds** (WhatsApp + unified UX) vs **reuses**.

### 3. Portfolio collision with the narrower 2-way WhatsApp PRD

The PRD references `docs/prds/gcc-whatsapp-2way-communication-prd.md` but does not resolve **single vs dual delivery**, shared **connector**, or **one comm panel** design system.

- **Evidence**: `MISSION_LOG.md` shows **GCC-E2E-004** already took **WhatsApp 2-way** through design/Figma; this omnichannel PRD is **broader** (admin, retention, reporting, omnichannel).
- **Impact**: **Duplicate epics**, **split engineering** on **webhooks/templates**, **inconsistent consent models**, or **two UIs** for the same recruiter task.
- **Recommended fix**: Add **"Relationship to gcc-whatsapp-2way-communication"**: supersede, merge, or **phase** (e.g. VS1 = profile thread only); **one** architecture owner and **one** candidate **preference** store.

---

## Important Issues (Should address before 315)

### 1. Notification Designer vs WhatsApp template reality

The PRD says **Notification Designer** templates apply to **email/SMS**, not WhatsApp-approved openers. Deployment Agent describes Notification Designer as **campaign email** layout/branding.

- **Evidence**: PRD overview; Deployment Agent (Notification Designer + SMS/campaign sections).
- **Impact**: **315** may assume a **single template framework** across channels; **WhatsApp** will need **provider catalogue + parameter merge**, not Notification Designer parity.
- **Recommended fix**: State **explicit non-goals**: WhatsApp templates are **not** Notification Designer objects; document **admin UX** for **Meta/BSP catalogue sync** separately.

### 2. "Immutable audit logs" vs retention and candidate data lifecycle

The PRD requires **immutable audit logs** and **configurable retention** for **message bodies** and **metadata**.

- **Evidence**: PRD Feature Solution / Technical Architecture. Functional-knowledge PDFs are **not ingested** in this workspace; prior discovery briefs cite **Recruiting Data Purge** and **GDPR** as relevant.
- **Impact**: **Purge jobs**, **DSR**, and **legal hold** can **conflict** with **append-only** stores unless **data classes** (content vs metadata vs audit index) are **defined**.
- **Recommended fix**: Add a **data classification** subsection: what is **immutable**, what is **purged**, how **legal hold** stops deletion, and **who** owns **retention guardrails** (product vs customer config).

### 3. Phone identity resolution at scale

**E.164 normalisation** and **disambiguation when multiple candidates match** are called out lightly.

- **Evidence**: PRD Technical Architecture. **UDMF / duplicates** are standard risk areas for **phone-keyed** messaging.
- **Impact**: **Wrong candidate** thread attachment, **compliance** incident, **irreversible** outbound to wrong person.
- **Recommended fix**: Add **acceptance-level** requirements: **no send** until **unique match** or **explicit recruiter disambiguation**; **log** resolution path in audit.

### 4. Forecast maths rest on unstated market sizing

**~60 GCC-material tenants**, **35% adoption**, **15 recruiters**, **7 threads/month** drive **~45k threads**.

- **Evidence**: PRD Year 1 forecast (no cited tenant census). Prior WhatsApp PRDs used **different** adoption figures.
- **Impact**: **Leadership** and **capacity planning** **disagree**; Red Team cannot validate **60** or **35%**.
- **Recommended fix**: **Footnote sources** (internal tenant segmentation or sales ops) and a **sensitivity table** (e.g. 40 tenants × 25% adoption).

### 5. Success metric "governed channel share ≥65%" is hard to measure

**"GCC mobile outreach on screened stages"** through Workday channels is **vague** (what counts as outreach, what is "screened", denominator from which system).

- **Evidence**: PRD strategic outcomes.
- **Impact**: **No baseline**, **no instrument**, **post-GA** argument.
- **Recommended fix**: Tie to **reportable events** (e.g. **logged sends** from profile + campaigns) and **explicit denominator** (e.g. **candidates in Interview** or **stage X** with **mobile number**).

---

## Feasibility Concerns (Workday System Constraints)

- **SMS to GCC numbers**: As described by the Deployment Agent, **current** Workday Messaging **does not** support **GCC SMS**. **Suggested validation**: Confirm with **Product / GTM** whether **non–US/CA SMS** is on roadmap for this epic; if not, **remove SMS from GCC fallback** in v1 scope.
- **Native audit "close the gap"**: Deployment Agent lists **Activity Stream**, **Recruiting History**, and **Candidate Communications Report** for **native** comms history. Custom WhatsApp **must** **integrate** into those surfaces or the PRD's **"audit gap"** story persists for **hybrid** builds. **Suggested validation**: **Explicit** requirement to **write** to **same** objects/reports customers already use for **email/SMS**.
- **Campaign channel expansion**: **SMS multi-step** already exists (2025R1). **Suggested validation**: **WhatsApp** as a **campaign step** is **out of scope** in v1 per PRD; confirm **no** dependency on **re-architecting** SMS journeys for **omnichannel composer** reuse.

---

## Hidden Assumptions (Make explicit in PRD)

- **Assumption**: **Workday Messaging** will be **expanded** to **GCC-relevant numbering** (or customers accept **email-only** fallback) **before** GA of this omnichannel positioning.
- **Assumption**: Customers can obtain and operate **WhatsApp Business Platform** accounts (or Workday **multi-tenant** BSP model) at **scale** with **acceptable** **Meta** **change-management** (template approvals, **quality rating**).
- **Assumption**: **~25–30%** policy-blocked multinationals is **stable** across your **install base** (Shell-style bans).
- **Assumption**: **Arabic RTL** can be **validated** in **composer/preview** with **current** Canvas Kit / host **constraints** (PRD flags **platform RTL issues** elsewhere).
- **Assumption**: **Inbound webhooks** can **reliably** resolve **candidate** identity from **phone + tenant** without **high** false-match rates.

---

## Real-World Failure Scenarios

- **Scenario 1**: Tenant **disables WhatsApp**; recruiter expects **SMS** from the **same panel** for **UAE mobile**; send is **blocked** or **unsupported** → **trust** collapse, return to **shadow IT** on personal WhatsApp.
- **Scenario 2**: **Template** rejected or **session window** expires during **high-volume** hiring; **bulk** of sends **fail** at month-end; **audit** shows **attempts** but **no** delivery → **SLA** and **compliance** disputes with **no** clear **retry** ownership between **Workday** and **BSP/Meta**.
- **Scenario 3**: **Duplicate candidates** share a **family** or **agency** number; **inbound** message attaches to **wrong** profile → **data breach**-class incident unless **disambiguation** is mandatory.

---

## Recommended Fixes (for 200 revision)

1. **Reconcile omnichannel with Deployment Agent facts**: **Document 2025R1 SMS campaigns**; **document US/CA-only SMS** and **tenant DC** constraints; **redefine GCC fallback** unless SMS expansion is **committed**.
2. **Add programme section**: **Relationship to `gcc-whatsapp-2way-communication`**, **single connector**, **phased scope**.
3. **Add template architecture**: **WhatsApp catalogue** vs **Notification Designer**; **no** implied parity.
4. **Add retention / purge / immutability**: **Data classes** and **legal hold** behaviour (align with **Recruiting Data Purge** thinking when PDFs exist).
5. **Tighten metrics**: **Sources** for tenant/recruiter assumptions; **operationalisable** **65%** metric.

---

**Summary for Orchestrator**: **3 critical risks, 5 important issues** found. Strongest blocker: **SMS as GCC fallback conflicts with current Workday Messaging (US/Canada-only) unless expansion is explicitly scoped and committed**; second: **PRD campaign description understates 2025R1 SMS journeys**; third: **unclear merge with existing WhatsApp 2-way PRD / prior E2E**. Recommend **200 revision before 315**.

**Functional knowledge note**: `@functional-knowledge` **PDFs are not present** in-repo. GCC compliance patterns for **purge/retention** should be re-checked when **Recruiting Data Purge** PDFs are available.

**Deployment Agent**: New thread `a420abd8-6ab2-4c8e-b1b5-63131ad3ebc8`
