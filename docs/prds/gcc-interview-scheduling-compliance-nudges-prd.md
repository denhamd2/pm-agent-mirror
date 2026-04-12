# GCC Interview Scheduling and Compliance Nudges (TBD Release)
Product Requirements Document  
April 2026  
**Revision:** Single pass after Red Team (Step 16), 5 April 2026.

## Executive Summary

Workday is uniquely positioned to deliver **in-product interview scheduling for Gulf Cooperation Council (GCC) enterprise recruiting** that pairs **conversational and slot-based scheduling** (Paradox and **Recommended Interview Scheduling** patterns, where licensed, entitled, and activated, including **calendar integration** and **innovation opt-in** where required) with **configurable compliance nudges** tuned to regional expectations, starting with **Kingdom of Saudi Arabia (KSA)**-style rules raised in customer research. **Recommended Interview Scheduling** is the official Deployment Assistant (DA) product name for capabilities historically discussed as “Interview Team Optimisation”; **Candidate Self-Scheduling** remains the candidate-facing booking experience where configured. Paradox delivers **conversational** scheduling and messaging-shaped journeys **when licensed**; this PRD’s compliance nudges must **compose** with both **Workday-native** scheduling surfaces and **Paradox-led** flows without implying a single SKU bundle. The initiative targets recruiters and coordinators who today **lose time in Outlook** and carry **regulatory risk** outside the audited Recruiting record. Version one **does not** close the **live Microsoft 365 or Google calendar read** gap for self-scheduling; that remains a **separate roadmap item** to avoid over-promising in bake-offs.

For our customers, this feature will **reduce median time from application to first interview session by 8–12%** for **GCC high-touch requisitions** in year one (against tenant-specific baselines from the Interview Management instrumentation family). **Stretch hypotheses (not baselined):** **60%+** of GCC tenants using **in-product scheduling** (Paradox and/or Recommended Interview Scheduling / standard scheduling surfaces per instrumentation definitions) within **12 months of activation**, and **80%+** of **KSA-based requisitions** with **compliance nudge rules enabled** where the pack is licensed. **Basis for targets:** these percentages are **planning anchors** derived from product narrative and segment ambition; there is **no GCC precedent** in this workspace for comparable **bundled** activation of conversational scheduling, Recommended Interview Scheduling, and compliance rule packs together, so **instrumentation and pilot readouts** must replace hypotheses with **observed adoption** before external commitment. Research participants described **KSA-specific needs** (minimum notice, documented consent when exceptions apply, panel nationality composition awareness) and a preference for **visible red warnings rather than silent blocks** for version one panel rules.

For Workday, this initiative will **strengthen ATS parity narratives** in contested GCC deals, **improve retention** where buyers compare suite scheduling depth to **SAP SuccessFactors plus SmartRecruiters** and **Oracle Fusion Recruiting** (including Recruiting Booster and coordination investments), and **differentiate on auditability**: compliance signals and consent artefacts **inside** the platform rather than only in email threads. Honest enablement requires grounding **“available today”** claims in **point-in-time Deployment Agent validation**: the **April 2026** feature table classifies **predefined-slot self-scheduling** as **Native** (standard flow **without** Workday Scheduling SKU per that thread) and **live interviewer calendar read** for self-scheduling as **True Gap**; **presales and tenant user acceptance testing** must confirm behaviour before customer commitments.

Delivery is scoped as **activation plus packaging** (Paradox, **Recommended Interview Scheduling** with **calendar integration** and **innovation opt-in** as required) **plus** a **first-party compliance nudge and consent-capture layer** extensible beyond KSA. **Out of scope for version one**: live M365 or Google calendar read, Qiwa or Mudad or MOHRE connectors, WhatsApp interview confirmations as a dedicated channel feature, and **hard blocks** on panel composition (warnings and audit only).

**Epic Links:**  
• GCC Interview Scheduling and Compliance Nudges EA: TBD  
• GCC Interview Scheduling and Compliance Nudges GA: TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters using Workday lack **in-product interview scheduling** that **respects regional compliance expectations**. Primary research (**P1, Accenture**) described **KSA-specific guardrails**: minimum notice periods, **documented consent** when scheduling violates policy, and **panel nationality composition** rules, while still relying on **manual Outlook coordination**. **P2 (Baker Hughes)** found Workday scheduling **harder than Outlook**. **Paradox** (conversational scheduling) and **Recommended Interview Scheduling** (official DA name; **calendar integration** and **innovation opt-in** dependencies) exist in the portfolio but are **not packaged** with **GCC compliance framing**, clear enablement, and **configurable regional rules**. **Candidate Self-Scheduling** remains the standard candidate booking path where configured; parity and enablement must treat **Paradox**, **Recommended Interview Scheduling**, and **self-scheduling** as **related but not interchangeable**. Competitive pressure remains high: enterprise suites continue to invest in **interview coordination** and **candidate experience**, while **live calendar synchronisation** for self-scheduling is a **known True Gap** in the latest internal parity table, creating exposure if messaging overshoots reality. |
| **How is it done today?** | Teams **coordinate outside Workday** (calendar invites, email, instant messaging), or use **partial** in-product flows **without** GCC-specific **nudges** or **consent capture** for exceptions. **Predefined availability slots** can support self-scheduling in standard configurations; **dynamic read** of interviewer calendars for self-scheduling is **not** in version one. Compliance checks, where they exist, are often **manual** or **informal**, weakening **audit** narratives versus **in-product** logging. |
| **How is our approach uniquely different from others?** | • **Suite-native scheduling plus compliance**: Scheduling actions and **warnings** sit in **Recruiting** with **audit-friendly** logging, not only calendar tools. **• Configurable nudges**: Tenant-defined rules (notice, consent on override, panel composition **warnings**) align to **KSA examples** from research and extend to other GCC jurisdictions via configuration. **• Honest parity**: **Native** predefined-slot self-scheduling **per April 2026 internal classification**; **True Gap** on **live M365 or Google calendar read** called out explicitly so RFP language matches **PS and UAT**. **• Packaged activation**: Clear **GCC** narrative linking **Paradox**, **Recommended Interview Scheduling**, and **Candidate Self-Scheduling** to **compliance nudges** (licence, entitlement, **calendar integration**, and **innovation opt-in** dependent). **• Human-in-the-loop**: Version one **does not** auto-block hires based on panel mix; **warnings** and **documented override** preserve recruiter control. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Impact (Business Value):** • **Time to First Interview Session** (Delivered IUM family, **HRREC-87961**): tenant baseline → **8–12% reduction** in median time from application to first interview session for **GCC high-touch requisitions** (year one target; segment definition agreed with analytics). • **Productivity: Recruiter Capacity** (**HRREC-86870**): indirect lift where scheduling friction and context switching fall (pilot vs control cohort; hypothesis **+3–7%** effective capacity on affected reqs, subject to validation). **Product Outcomes:** • Median days from application to first scheduled interview session (PV) → drives **Time to First Interview Session** BV. • Share of interview events created **in-product** vs external-only coordination (PV) → adoption proxy. • Share of KSA-scoped requisitions with **at least one compliance rule pack active** (PV) → drives compliance narrative and risk reduction. **Outputs (Product Catalogue) – stretch hypotheses:** • **Adoption (stretch):** **60%+** of GCC tenants using **in-product scheduling** (Paradox and/or **Recommended Interview Scheduling** / standard scheduling surfaces as defined in instrumentation) within **12 months of feature activation**. **Basis:** planning anchor only; **no GCC precedent** for comparable bundled activation; replace with measured baselines post-pilot. • **Usage (stretch):** **80%+** of **KSA-based requisitions** (definition: primary location or legal entity in KSA per tenant mapping) with **compliance nudge rules enabled** where the pack is licensed. **Strategic Value & Outcomes:** **1. Velocity and time-to-hire inputs**: Faster first interview supports downstream **Time to Hire** narratives without claiming full hire-cycle causality. **2. Deal conversion**: Counters **SAP** and **Oracle** scheduling and experience stories with **governed, auditable** GCC workflows. **3. Platform growth**: Reusable **compliance nudge framework** for other regulated scheduling contexts; future **calendar read** item unlocks fuller **self-scheduling parity** when delivered. |

### Competitive and market context (GCC)

Grounding: `research/competitive/matrices/gcc-competitive-matrix.md` (**v1.25**, **5 April 2026**) and `research/competitive/gcc/gcc-competitive-scan-2026-04-05-GCC-E2E-034.md`. Classifications below reflect the **April 2026** scan feature table and **must** be **revalidated with PS and tenant UAT** before external commitments; earlier Deployment Agent threads **disagree** on scheduling SKU and live calendar behaviour.

| Topic | Workday position (April 2026 scan / matrix) | Implication for this PRD |
|-------|-----------------------------------------------|---------------------------|
| **Predefined-slot interview self-scheduling** | **Native**; standard predefined flow **does not** require Workday Scheduling SKU **per scan table** | **Version one** can lean on **native** slot-based flows for **honest** “in Workday” scheduling where configured. |
| **Live M365 or Google calendar read for candidate self-scheduling** | **True Gap** in **April 2026** scan (**predefined** slots only for **self-scheduling** in that classification) | **Explicitly out of scope for v1**; separate initiative; enablement must **not** imply **candidate** free or busy **read** until closed. **Note:** **Recruiter-led** Interview Management may expose **different** calendar integration patterns than **candidate** self-service; **validate** **per** **release** **and** **tenant** **with** **PS**. |
| **SAP SuccessFactors plus SmartRecruiters** | **March 2026** enterprise narrative on **connected** hiring and **AI**-driven experiences | Compete on **unified HCM record**, **audit**, and **GCC-specific nudges**; avoid **feature-list parity** without evidence. |
| **Oracle Fusion Recruiting** (26A–26B) | **Recruiting Booster**, **Redwood** coordination, **messaging** stack investments | Same as SAP: **differentiate** on **configurable compliance warnings** and **consent capture** in **Recruiting**, not only **UX chrome**. |
| **Paradox through Workday** | **Partner path** for **conversational** scheduling and **WhatsApp-shaped** flows **when licensed** | **Version one** **packages** Paradox **with** compliance nudge **hooks** in the **GCC** story; entitlement and **SKU** clarity in **enablement**. |
| **Regional bundles** (for example **Bayzat**, **Keka**, **Darwinbox**) | **Local** and **messaging-first** claims | Workday response: **enterprise governance**, **global templates**, and **first-party audit** for **scheduling decisions**. |

### Internal parity table (enablement lock)

**Purpose:** single **internal** reference for sales engineering, PS validation, and GTM. **Do not** treat DA thread IDs as customer-facing commitments until PS confirms. Refresh when Deployment Agent or matrix classifications change.

| Capability | Classification (Native / Workaround / True Gap) | Primary DA thread ID (internal) | PS validation owner | Customer-safe wording (indicative) |
|------------|--------------------------------------------------|-----------------------------------|---------------------|-------------------------------------|
| Predefined-slot **Candidate Self-Scheduling** (standard flow) | **Native** (per April 2026 GCC scan; confirm per tenant) | **TBD – link DA thread from PS** | **TBD – TA Scheduling / PS lead** | Candidates can book from **predefined interviewer availability** in Workday where configured; confirm **SKU and entitlement** with PS. |
| **Live** Microsoft 365 or Google **calendar read** for candidate self-scheduling | **True Gap** (April 2026 classification) | **TBD – link gap / roadmap thread** | **TBD – TA Scheduling / PS lead** | **Do not** claim **real-time** interviewer free/busy **read** for candidate booking in v1; position **predefined slots** or **recruiter-coordinated** scheduling. |
| **Recommended Interview Scheduling** (recruiter / coordinator optimisation, DA name) | **Native / partial** (depends on **calendar integration**, **innovation opt-in**, tenant config; **validate**) | **TBD – RIS DA thread** | **TBD – RIS PS owner** | Position **Recommended Interview Scheduling** only with **PS-confirmed** entitlement and **calendar** prerequisites; avoid legacy “ITO” shorthand externally. |
| **Paradox** conversational scheduling in Workday | **Partner path** / **Native** where certified integration shipped (**validate** per tenant) | **TBD – Paradox integration thread** | **TBD – Paradox / PS owner** | Conversational scheduling **when Paradox is licensed and activated**; AI transparency obligations apply (see Compliance). |
| **Arabic UI** and **RTL** for Recruiting scheduling surfaces | **Workaround** or **partial** for some surfaces (**validate** per release and tenant) | **TBD – localisation thread** | **TBD – PS i18n / Recruiting** | Do **not** promise full **RTL** parity in v1 without **release-specific** validation; align candidate consent copy strategy with actual **Arabic** coverage. |
| **Compliance nudges and exception consent** (this initiative) | **New / in build** (v1 scope) | **TBD – feature epic / DA** | **TBD – PM + PS** | **Configurable** warnings and **in-product** consent capture for **customer-defined** rules; not a substitute for **customer Legal** sign-off. |

### Audience / Personas

**Primary persona: Recruiter / recruiting coordinator (GCC, especially KSA-heavy reqs)**  
• Schedules interviews, manages panels, and needs **fast** coordination **without** breaking **local expectations**. **•** Uses **Workday Recruiting** as system of record.  
*Persona depth: `docs/workday-user-research/README.md` (HR Professional supplemental materials) and `docs/jtbd-recruiting-hr-professional-and-manager.md`.*

**Secondary persona: Talent acquisition lead / head of recruiting**  
• Sets **policy** for **which** rules apply by **country** or **entity**; cares about **audit** and **adoption** metrics.

**Tertiary persona: Hiring manager**  
• Provides availability; benefits from **fewer** back-and-forth threads when scheduling is **in-product**; **minimal** exposure to compliance **detail** unless configured.

**Quaternary persona: Candidate (external)**  
• Self-schedules when invited; experiences **clear** timing and **professional** communications; **no** misleading claims about **real-time** calendar sync in v1.

---

## Feature Solution

### Realisation path (implementation hypothesis)

Two engineering realisation options frame scoping and sequencing:

| Path | Description | When to favour |
|------|-------------|----------------|
| **(A) Extend Interview business process and existing scheduling surfaces** | Implement compliance evaluation, warnings, consent capture, and audit events **inside** current Recruiting **interview scheduling** flows and related admin configuration (minimal **greenfield** UI). | **Default hypothesis** for v1: fastest path to **audited** behaviour where recruiters already work; aligns with **Recommended Interview Scheduling** and **Candidate Self-Scheduling** touchpoints. |
| **(B) Greenfield intercept layer** | Cross-cutting service or middleware that **intercepts** scheduling actions across channels (including future Paradox-heavy paths) before confirmation. | Consider if **(A)** cannot cover **required** Paradox or **multi-surface** consistency within release constraints; higher **integration** and **test** cost. |

**Product default:** pursue **(A)** unless technical discovery proves **unacceptable** coupling or **missing** extension points; document pivot to **(B)** in Open Questions if triggered.

**Non-goals if BP-only (Path A) for v1:** uniform enforcement **across** every **non-standard** or **partner-only** scheduling entry point without explicit integration work; **replacing** Paradox’s conversational UX with Workday-native screens; **centralised** rule execution **outside** Recruiting **SoR** boundaries without a follow-on initiative.

### Integration architecture (rules execution and consent storage)

• **Where rules run:** **Deterministic compliance rules** (notice, consent on override, panel composition **warnings**) run in the **Workday Recruiting** transaction path for **in-product** scheduling actions **unless** a future design explicitly delegates a **subset** of checks to **Paradox** (would require **signed integration contract**, **test** matrix, and **Legal** review). **Paradox** may **surface** scheduling choices and **messages**, but **must not** be the **sole** system of record for **audit** events required by this PRD unless Engineering and Legal agree **dual-write** or **Workday-authoritative** logging.  
• **Where consent is stored:** **Exception consent** and **override** decisions **must** be **retrievable on the interview / activity record** (SoR-aligned fields or tightly linked business object) for **customer audit** and **subject-rights** processes; **compliance audit events** (rule evaluated, warning shown, blocked path) may additionally be written to an **audit / event** object optimised for reporting. **Open design choice (documented in Open Questions):** single **SoR** object vs **SoR fields + audit stream**; Legal and Security must approve **immutability**, **retention**, and **export** semantics.

• **GCC scheduling enablement path** that documents **when to activate Paradox**, when **Recommended Interview Scheduling** applies (including **calendar integration** and **innovation opt-in**), and how **predefined interviewer slots** are configured for **Candidate Self-Scheduling** (entitlement and **SKU** language **validated** with PS).  
• **Compliance rule packs** (version one **includes KSA template**, additional GCC countries via **configuration** or **future** templates):  
  • **Minimum notice** between invitation or confirmation and **scheduled** start (configurable duration and **calendar** basis).  
  • **Exception consent**: if user proceeds **below** minimum notice, **capture structured consent** (who, when, reason, linked interview record) **before** confirmation.  
  • **Panel composition warnings** (not blocks): evaluate **declared** or **resolved** interviewer attributes (for example **nationality** or **local** classification per **tenant mapping**) against **configurable** thresholds; surface **prominent warnings** and **link to policy** text **admin-maintained**. **Nationality-driven** (or equivalent sensitive-attribute) rules are **off by default**; enabling them requires **explicit admin action** plus **customer attestation** (see Administrator experience).  
• **Interview scheduling UX**: nudges appear at **slot selection**, **panel confirmation**, and **send** or **publish** actions; **dismiss** or **proceed with override** flows per rule **severity** (v1: **information** vs **warning**; **no hard block** on panel mix).  
• **Audit and reporting**: events for **rule evaluated**, **warning shown**, **override with consent**, **override without consent** (disallowed paths), stored for **compliance** and **analytics** exports.  
• **Administrator experience**: enable **packs** by **tenant**, map **organisations** or **requisition types** to **jurisdiction**, edit **thresholds**, **maintenance** of **policy help text**, and **test** mode for **COE** validation. **Activation guard:** before **nationality-driven** (or other **sensitive-attribute**) rules can be turned **on**, the admin must complete a **customer attestation** (checkbox + recorded timestamp and role) that **customer Legal** has approved the **policy**, **data categories**, and **disclosures** for the jurisdiction; Workday provides **template** attestation **copy** only (Legal-gated).  
• **Localisation**: **Arabic** and **English** (minimum) for **nudge** strings and **consent** prompts; **RTL** layout **where Workday standards and validated release behaviour** support it (see **internal parity** table; **no** v1 promise of full scheduling **RTL** parity without PS sign-off).  
• **Explicit non-goals (v1)**: **Live** calendar read for self-scheduling; **Qiwa**, **Mudad**, **MOHRE** **connectors**; **WhatsApp** as **dedicated** interview **confirmation** channel (covered by **separate** recommendations); **hard enforcement** of panel composition.

### Experience Principles Alignment

**Empower (give users control)**  
• Recruiters **choose** to proceed after **warnings**; **consent** captures **explicit** acknowledgement when **exceptions** apply. **•** Outcome-focused: **“Book compliant interviews fast”** rather than **calendar tool mastery**. **•** Progressive disclosure: hiring managers see **availability**, not **full** rule engines.

**Trust (build their confidence)**  
• **Transparent** messaging: each nudge states **which rule** fired and **what** the user can do. **•** Familiar vocabulary: **notice period**, **consent**, **panel mix** without **opaque** codes. **•** Reliability: **no** silent failures; if rules **cannot** evaluate (missing data), show **actionable** **data quality** prompts.

**Grow (enable them to change)**  
• **Self-service** rule tuning within **security** roles; **versioned** **effective dates** for **threshold** changes. **•** **History** of **overrides** and **consents** **queryable** for **audits**.

**Principle validation**  
• [x] User remains **in control** of **final** scheduling decision  
• [x] **Transparency** on **why** a nudge appeared  
• [x] **Configurable** rules **without** **services** for **routine** threshold edits  

**Principle tradeoff**  
• **Trust** (accurate **parity** messaging) may **limit** marketing **claims** about **self-scheduling** until **live calendar read** ships; **prefer** **clear** **limitation** copy over **oversell**.

---

## Critical User Journey & Use Cases

• **Configure**: Admin activates **GCC interview compliance** for **KSA** (or other) scope, sets **notice** and **panel** **warning** thresholds, uploads **policy** summary for **in-product** help; **nationality-driven** panel rules remain **off** until explicitly enabled with **customer attestation**.  
• **Prepare**: Recruiter opens **candidate** or **req** scheduling flow; system loads **applicable** **rule pack** from **requisition** **location** or **legal entity**.  
• **Select time**: User picks **slot** or **proposes** time; system evaluates **notice**; if **violation**, shows **warning** and **consent** **capture** **modal** **before** **confirm**.  
• **Build panel**: User adds **interviewers**; system evaluates **composition** rules; shows **warnings** **only** (v1); user may **proceed** with **reason** **optional** or **required** per **admin** **config**.  
• **Confirm**: System **writes** **interview** **artefacts**, **logs** **compliance** **events**, sends **notifications** through **standard** channels (email, in-app; **not** **WhatsApp-specific** **v1** scope).  
• **Audit**: **Compliance** **partner** **filters** **overrides** and **consents** by **period** and **org**.  
• **Report**: **Dashboard** **tiles** for **adoption** of **in-product** **scheduling** and **nudge** **activation** **rates** (instrumentation **aligned** to **success** **criteria**).

---

## Compliance, data, and privacy

### Controller accountability

• Customers remain **controllers** for scheduling, workforce, and recruiting data processed in these flows; Workday acts as **processor** under the customer DPA except where Workday is controller for its own operations.  
• Workday provides tools to document decisions, warnings, and exception consents; **customer Legal** owns lawful basis selection, policy wording, privacy notices, and whether specific rule thresholds meet local labour or nationalisation requirements.  
• **Workday does not provide legal advice.** Enablement must not present Workday-authored text as a substitute for customer Legal sign-off on jurisdiction-specific rules.

### Consent scope (v1)

• **Version one** exception consent is **in-app only**: structured capture **inside** the Workday scheduling flow (who, when, reason, linked interview record) **without** requiring an **external document link** or **e-signature** integration as part of the **baseline** scope.  
• **Document-linked** or **attachment-based** consent (linking to **PDF**, **offer letter**, or **third-party** evidence) is **out of scope for v1** unless Legal and a **named** customer pilot explicitly expand scope; track as **v2** if demand solidifies.  
• **Alignment with Arabic / RTL:** internal parity classifies **Arabic** and **RTL** scheduling UX as **Workaround** or **partial** until **PS validates** per release; **in-app** consent **strings** must follow **actual** locale coverage (bilingual **EN/AR** where supported; **no** assumption of full **RTL** layout parity in v1). Customer-facing **promises** on **Arabic** consent must match **validated** UI behaviour.

### Lawful basis matrix (customer-owned)

The table below is a **product planning aid**, not legal advice. **Customers must** map actual lawful bases in their privacy notices and records of processing; Workday supplies configuration and audit artefacts only.

| Data category (illustrative) | Typical subjects | Primary processing purpose (v1) | EU notes (indicative) | GCC notes (indicative) |
|-----------------------------|------------------|----------------------------------|------------------------|-------------------------|
| **Candidate** scheduling data | Candidate | Invite, confirm, reschedule interviews; self-service slot selection | Often contract (steps prior to contract) and/or legitimate interests; transparency Art 13–14 | PDPL-style transparency and purpose limitation; Arabic disclosure may be required for notices surfaced to candidates |
| **Interviewer / worker** attributes used for rules | Interviewer, hiring team | Panel composition warnings (e.g. nationality or tenant-mapped local classification), availability | Art 9 sensitivity if nationality or similar special-category fields are used; explicit basis or employment exception per Legal | Treat as **high-sensitivity** in GCC contexts; minimise fields; align notices and HR policy |
| **Exception consent and override records** | Recruiter, coordinator | Evidence when minimum notice or other rules are overridden | Consent or legal/legitimate basis per Legal; retention and erasure per Art 17 | PDPL-style access, correction, deletion themes; align Arabic copy where user-facing |
| **Compliance audit events** | Mixed (actors + references to candidates/interviews) | Audit trail: rule evaluated, warning shown, override | Legitimate interests (compliance) vs employment law basis; DPIA if high risk | Local reporting or regulator expectations vary; customer defines retention |

• **Customer-owned privacy notice updates**: Activation of nationality-aware or jurisdiction-specific rule packs must be documented in **customer** privacy notices and candidate-facing disclosures where required; GTM and PS enablement must flag this as a **customer action item**, not a Workday-only deliverable.

### Nationality and panel composition processing (Art 9 and GCC-sensitive data)

• Where **nationality**, **citizenship**, or **tenant-derived local status** is used for panel composition **warnings**, treat processing as **special category or sensitive** in relevant jurisdictions (including **GDPR Art 9** where EU data subjects are in scope).  
• **Strict RBAC**: Only roles defined by the customer may view or manage rule inputs, thresholds, and evidence; default-deny for broad recruiter populations unless customer policy explicitly extends access.  
• **Purpose limitation**: Data used for scheduling compliance nudges **must not** be repurposed for analytics, model training, or secondary product features **without** a separate legal assessment, DPIA or equivalent, and product approval.  
• **DPIA-style gate before GA**: For configurations that evaluate sensitive attributes at scale (including cross-border tenants), **Legal** must complete a **DPIA or regional equivalent** and sign off **before** general availability of those capabilities in production for entitled customers.

### Retention, erasure, legal hold, and correction

• **Not immutable in the absolute sense**: Exception consents and audit events are **immutable to end users** (no casual edit or delete in standard UX) but must support **Legal-approved** lifecycle management.  
• **Retention and purge**: Retention periods, automated purge schedules, and tenant-specific rules follow **customer Legal** direction and Workday platform capabilities (including GDPR and PDPL-style storage limitation principles).  
• **Legal hold**: Records relevant to disputes, investigations, or regulatory requests must support **legal hold** and **suspension of routine deletion** per standard Workday practices.  
• **Correction and append model**: Where data subjects or customer admins have rights to rectification (**GDPR Art 16**, analogous PDPL-style correction), the product must support **correction via controlled append**, superseding metadata, or replacement flows **without** breaking audit integrity, per Legal and Security architecture.  
• **Art 17 and erasure**: Erasure requests are handled per **controller instructions** and statutory exceptions (including legal claims and legal hold); the PRD does not prescribe a single global retention number.

### EU AI Act: Paradox vs deterministic compliance nudge engine

**Do not treat “Responsible AI N/A” as applying to Paradox.** Paradox provides **conversational AI** that interacts with humans in scheduling journeys. That path triggers **EU AI Act Article 50** transparency obligations **at minimum** (users must be informed they are interacting with an AI system, subject to deployer and provider obligations). Depending on configuration and future capabilities, aspects of recruitment-related conversational automation may also fall under **Annex III high-risk** categories (e.g. employment-related AI); **Legal must classify** the shipped integration and document obligations for EU deployers.

**Deterministic compliance nudge engine** (purely **rule-based** evaluation of configured thresholds, notice periods, and panel mix warnings **without** machine learning or statistical inference in v1) may be assessed as **minimal / limited risk** for the engine itself, **provided** Legal confirms that classification for the as-shipped feature set. If ML or probabilistic scoring is added later, **reclassify** and revisit conformity, documentation, and human oversight requirements.

### Candidate-facing disclosure placeholders (Legal-gated design inputs)

Design and **319** must not finalise **candidate-visible** strings until **Legal** approves. Minimum **placeholder** set for **implementation planning** (exact wording **TBD** by Legal):

• **Automation transparency:** plain-language statement that the **scheduling experience** may use **automated** or **conversational** assistance (**Paradox** path) versus **purely** recruiter-driven scheduling, per **EU AI Act Art. 50** and deployer obligations where applicable.  
• **Human oversight:** statement that **scheduling** and **compliance** decisions remain **under recruiter / employer** control in v1 (no **solely automated** hiring decision from this feature).  
• **Data use:** short notice of **which** categories (**scheduling times**, **panel attributes** if rules enabled, **consent** records) are processed **for** the interview booking.  
• **Sensitive attributes:** when **nationality-driven** rules are **customer-enabled**, **additional** **just-in-time** disclosure that **sensitive** or **special-category** data may be **referenced** for **warnings** only (not **auto-rejection**).  
• **Contact / rights:** pointer to **customer-controlled** privacy notice or **contact** (not Workday Legal advice).

These placeholders are **inputs** to **315** Copy Inventory and **prototype** copy; **060** validates before **GA**.

### GCC jurisdiction notes (lightweight legal matrix)

| Jurisdiction | Sensitive / special-category touchpoints | Transfers and residency (indicative) | Arabic and disclosure notes |
|--------------|------------------------------------------|--------------------------------------|-----------------------------|
| **KSA** | Nationalisation and labour-policy-aligned rules; workforce nationality attributes | Cross-border processing subject to PDPL and customer transfer assessments | Candidate- and worker-facing text may require **Arabic**; align with customer Legal and official terminology |
| **UAE (mainland)** | Federal PDPL; sensitive personal data categories per local law | Transfer mechanisms and residency expectations per customer assessment | Bilingual UX preference common; notices owned by customer |
| **DIFC / ADGM** | Free-zone data protection regimes may differ from mainland UAE | Distinct transfer and DPA patterns possible for entities in those zones | Customer entity mapping drives which regime applies |
| **Bahrain** | Personal Data Protection Law (PDPL) context; HR and sensitive data care | Transfer and lawful basis per customer | Arabic disclosure as customer Legal directs |
| **Qatar** | PDP Law and HR-related sensitivity | Transfer assessments | Arabic / English per customer policy |

• This matrix is **non-exhaustive** and for **planning** only; **customer Legal** validates applicability per entity and contract.

### KSA labour law and policy disclaimer

• **Configurable rules implement customer policy only.** Thresholds, notice periods, and panel composition **warnings** reflect **customer-configured** rules and mappings, not Workday’s determination of compliance with **KSA labour law**, **Saudisation / related programmes**, or other nationalisation schemes.  
• **Workday does not provide legal advice.** Customers must have **customer Legal** validate that their configured rules, data sources, and notices meet applicable law and government programme requirements before reliance in production.

### Cross-border transfers

• Beyond **standard Workday processing locations and the Workday DPA**, **data exporters (customers as controllers)** remain responsible for selecting and documenting appropriate **transfer tools** (e.g. SCCs, adequacy, local derogations) and for **local law** compliance in each jurisdiction where data subjects are located.  
• Workday supports processing in line with contracted locations and security standards; **allocation of transfer responsibility** follows the DPA and order form. **v1** introduces **no new government API data flows**; any future connectors require a separate privacy and transfer assessment.

### Automated decision-making and human oversight

• **Nudges inform humans**; v1 does **not** auto-reject candidates or auto-block hires based on panel mix.  
• **GDPR Article 22** and **EU AI Act human oversight** principles apply **where relevant** (EU-touching tenants and any AI-interactive paths such as Paradox).  

---

## UX Designs for release

• Scheduling flow with **compliance** **banner** and **consent** **modal** – Figma TBD  
• **Admin**: **KSA** **rule** **pack** **configuration** (including **default-off** sensitive rules and **attestation** step) – Figma TBD  
• **Audit** **list** **view** **(overrides** **and** **consents**)** – Figma TBD  
• **Candidate-facing** screens: incorporate **Legal-gated** **disclosure placeholders** listed under **Compliance** (automation transparency, human oversight, data use, sensitive-attribute **JIT** copy, rights pointer); **Arabic / RTL** layouts **only** as validated per **internal parity** table.

---

## Releases & production thresholds

• **Legal** review of consent copy, policy surfaces, sensitive attribute handling, **lawful basis matrix**, **Paradox / AI Act** classification, and **DPIA-style gate** outcomes before development commit on scoped capabilities.  
• **Enablement** artefacts: **internal parity table** (this PRD) plus `gcc-competitive-scan-2026-04-05-GCC-E2E-034.md` (live calendar = True Gap until otherwise closed); refresh **DA thread IDs** and **PS owners** when PS confirms.  
• **Pilot** with design partner GCC tenants before broad GA (recommended).  
• **Responsible AI and AI Act alignment**:  
  • **Paradox** (conversational scheduling): **not** “N/A”; requires **Article 50** transparency at minimum and **Legal classification** for potential **Annex III** high-risk recruitment use cases; track obligations to deployers in EU.  
  • **Deterministic compliance nudge engine** (v1 rule-based): may be treated as **minimal / limited risk** for the engine **if** Legal confirms; **re-open** classification if ML or inferential logic is added.  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| Legal and privacy sign-off on v1 scope | TBD |
| Design brief approved (Sana / Canvas Kit) | TBD |
| KSA rule pack alpha | TBD |
| Paradox plus nudge integration beta (entitled tenants; Recommended Interview Scheduling / calendar prerequisites per tenant) | TBD |
| General availability | TBD |
| Follow-on: live calendar read initiative | TBD (separate PRD) |

---

## Open questions

• **Exact definition** of “GCC high-touch requisition” for the 8–12% metric (segment rules in IUM or dashboard filters).  
• **Enablement sequencing:** whether **Recommended Interview Scheduling**, **Paradox**, and **Candidate Self-Scheduling** are **one** GTM track or **sequenced** SKUs per region; dependency on **calendar integration** and **innovation opt-in**.  
• **Realisation path validation:** confirm **Interview BP extension (Path A)** is sufficient for **required** Paradox and **multi-surface** coverage; pivot to **intercept layer (Path B)** if discovery fails (owners: Engineering + PM).  
• **Populate parity table:** replace **TBD** DA thread IDs and **PS validation owners** with **live** references from Deployment Agent / PS roster.  
• **Consent storage design:** finalise **SoR field** vs **SoR + audit object** split and **export** semantics (Security + Legal).  
• **Data quality fallbacks** when interviewer nationality or classification is missing (block evaluation vs warn only), including **Art 9 / sensitive-data** minimisation trade-offs.  
• **Kuwait** or other GCC notice rules in v1 templates beyond KSA.  
• **Unresolved (Legal / product)**: Final **EU AI Act** provider vs deployer allocation for **Paradox-in-Workday** scheduling flows and required **technical documentation** artefacts for EU customers; **final** candidate-facing **disclosure** strings for **placeholder** set in Compliance.  
• **Unresolved**: Standard **retention default ranges** per audit event type when customer has not supplied a custom schedule (if any product default is permitted).  
• **Unresolved**: Whether **DIFC vs ADGM vs mainland UAE** rule packs ship as separate templates or a single configurable matrix in v2+.  
• **Unresolved**: Measured **baseline** for **60% / 80%** stretch adoption and usage hypotheses once **pilot** tenants are instrumented (no GCC bundled precedent today).  

---

## Resources

• Epic – TBD (EA), TBD (GA)  
• PRD (markdown): `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`  
• PMF thematic analysis: `research/GCC/thematic-analysis/2026-04-05-GCC-PMF-Analysis-GCC-E2E-034.md`  
• GCC competitive matrix: `research/competitive/matrices/gcc-competitive-matrix.md`  
• GCC competitive scan: `research/competitive/gcc/gcc-competitive-scan-2026-04-05-GCC-E2E-034.md`  
• Customer research: `research/GCC/105-user-research-findings.md`  
• Value metrics catalogue: `docs/metrics/talent-acquisition-value-metrics.csv` (Time to First Interview Session, Recruiter Capacity)  
• Legal review Jira: TBD  
• Responsible AI / AI Act: **Paradox path** requires Legal classification and transparency plan (Art 50 minimum); **rule-based nudge engine** subject to Legal confirmation of minimal / limited risk for v1; **candidate disclosure placeholders** in PRD are **not** final copy  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| TBD | Sr. Product Manager |
| TBD | Engineering Lead |
| TBD | Design Lead |
| TBD | Legal Partner |
| TBD | Executive Sponsor (Product – Talent Acquisition) |

---

Workday Confidential    1  

-- 1 of 1 --
