# Native Nationalisation & Local Compliance Reporting (TBD Release)
Product Requirements Document  
March 2026  

**Revision note (Legal Advisor feedback):** Lawful bases and Art. 9 sensitivity mapped; retention/purge matrix for new data and audit artefacts; safeguards for hard blocks; DPIA expected before GA; UAE/KSA PDPL and v2 transfer/localisation flagged for programme legal review; candidate/employee notice and controller accountability strengthened; multinational tenant and v1 export/support access assessed. See **Open questions** for unresolved items.

## Executive Summary

Workday is uniquely positioned to develop **native nationalisation and local compliance reporting** for Gulf Cooperation Council (GCC) recruiting within a unified HCM and Talent Acquisition suite. This initiative elevates nationality, residency, and quota visibility from fragmented custom-field and spreadsheet workflows into **first-class Recruiting capabilities**: governed data capture, **real-time quota and composition views**, and **decision-time signals at offer**, while preserving a clear path to **future** government portal connectivity. Target delivery aligns with enterprise GCC readiness priorities and reduces compliance friction that today slows offers and inflates professional services effort.

For our customers, this feature will **cut manual reconciliation** before executive and statutory reporting, **surface quota risk earlier** in the hire funnel (especially before offer), and **lower the chance of quota miscalculation** that can trigger financial and reputational penalties. Success is measured by **ten GCC enterprise adoptions within the first six months**, a **thirty percent reduction in time spent compiling nationalisation compliance reports** among those customers, and **zero compliance breaches attributed to quota miscalculation** for early adopters during the initial measurement window. **Compliance gate (Legal):** a **Data Protection Impact Assessment (DPIA)** or regional equivalent is **expected to be completed and signed off before general availability** for tenants where EU/EEA data subjects, high-risk processing, or customer counsel require it; track **DPIA completion rate for design-partner and GA-blocking cohorts** as a release readiness metric (target: **100%** of in-scope early adopters before GA where Legal mandates DPIA).

For Workday, this initiative will **strengthen GCC win rates** against regional bundles that lead on payroll and local compliance adjacency, **increase platform stickiness** for multinational tenants with Saudi and UAE hiring footprints, and **create a reusable compliance pattern** extensible to other nationalisation regimes (for example Kuwaitisation, Omanisation). It also narrows a **structured competitive gap**: point-in-time competitive intelligence classifies **Qiwa and Mudad recruiting data exchange** as a **true gap** (no out-of-the-box connector), while **executive nationalisation views** are today primarily a **workaround** via custom reports and analytics; native product depth improves honest RFP positioning without over-claiming portal automation in version one.

Delivery is scoped as a **phased compliance programme**: version one focuses on **in-product tracking, dashboards, and offer-stage governance**; **direct API integration with government portals** (Qiwa, Mudad) for automated submission is **explicitly out of scope for version one** and reserved for a **subsequent release**, with manual export patterns retained as the interim bridge.

**Epic Links:**  
• Native Nationalisation & Local Compliance Reporting EA: TBD  
• Native Nationalisation & Local Compliance Reporting GA: TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters and HR leaders must **track and report on nationalisation quotas** (for example Saudization and Nitaqat, Emiratisation) **during** the hiring process, not only after hire. Today they rely on **manual workarounds**, **custom fields**, and **external spreadsheets** to approximate ratios before making offers. That increases **compliance risk**, slows **time-to-hire**, and leaves **franchise and low-volume** entities dependent on **manual** roll-ups outside the system. Political and board-level scrutiny on nationalisation programmes makes errors costly. |
| **How is it done today?** | Workday provides **primary nationality**, **additional nationalities** (where localisation enables), and **government ID** patterns suitable for foundational identity data. Customers typically **extend** with **custom fields** on candidate or job application, **calculated fields** for “local / GCC / expat” style derivations, **custom reports** grouped by organisation or location, and **dashboards** built from those reports. **Government portal submission** is not natively automated: **leading practice** is **export formatted extracts** and **manual upload** to authorities (**Deployment Agent** validation, March 2026). MOHRE-class and executive views remain **configuration-heavy** relative to competitors who market **bundled** local HR and payroll plus compliance narratives. |
| **How is our approach uniquely different from others?** | • **Suite-native compliance signal**: Quota and composition logic tied to **Recruiting and Core** hire objects, not only post-hire HRIS exports, with **offer-stage warnings** so decisions happen before irreversible steps. **• First-class dashboards**: Pre-built **nationalisation and statutory reporting** experiences reduce custom field sprawl called out in GCC research. **• Honest competitive posture**: Acknowledge **true gap** on **Qiwa/Mudad recruiting exchange** (no OOTB connector per competitive scan); **version one** closes the **executive and recruiter experience gap** while **version two** targets **portal APIs**. **• Governance**: Role-based access, audit-friendly views, and alignment to **PDPL-class** handling for sensitive attributes. **• Extensibility**: Saudi and UAE **out-of-the-box models** with a framework for additional GCC programmes. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:** **• Adoption target:** **10** GCC enterprise customers live on native nationalisation reporting within **6 months** of general availability (customer count; no percentage of base). **• Operational efficiency:** **30% reduction** in time spent **compiling nationalisation compliance reports** (self-reported baseline vs post-implementation survey or time-motion sample; methodology: customer success baseline workshop + 90-day check-in). **• Quality / risk:** **Zero** **quota miscalculation** incidents attributed to Workday-native calculations for **early adopter** cohort during initial **12-month** observation (defined with Legal and customer DPIA context). **• Compliance readiness:** **DPIA** (or equivalent) **completed before GA** for **100%** of **Legal-mandated** design-partner / blocking cohorts (see Executive Summary). **Basis:** Agreed product success criteria; qualitative support from GCC customer interviews (custom-field nationalisation tracking and penalty exposure; franchise reporting friction). **Strategic Value & Outcomes:** **1. Time-to-hire and offer velocity:** Fewer pre-offer spreadsheet cycles; target measurable reduction in offer-stage delays tied to quota checks (tenant-specific baseline captured at onboarding). **2. Deal conversion and retention:** Stronger parity narrative vs **Bayzat**-style **Mudad-adjacent** bundles and enterprise suite competitors in **GCC** evaluations. **3. Platform growth:** Reusable **country pack** pattern for compliance-heavy recruiting; future **monetisation** optional (packaged services, premium analytics) subject to packaging review; **deal-closing** value in **RFP** statutory sections; **future acceleration** via **version two** Qiwa/Mudad APIs. |

### Competitive and market context (GCC)

Grounding: `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-031.md` and `research/competitive/matrices/gcc-competitive-matrix.md` (baseline scan aligned with strategic GCC readiness).

| Topic | Workday position (validated classification) | Implication for this PRD |
|-------|-------------------------------------------|---------------------------|
| **Nationalisation / MOHRE-style executive dashboards** | **Workaround** today: custom reports, analytics, and dashboard composition rather than packaged executive product | **Version one** **productises** recruiter and leadership views and **reduces** bespoke sprawl; sales still validate **tenant-specific** statutory rules with PS and counsel. |
| **Qiwa / Mudad recruiting data exchange** | **True gap**: no OOTB connector; Studio, integration, or third-party patterns | **Out of scope for v1** (automated submission); **in scope for v2** roadmap; v1 may **define** export layouts that **ease** manual upload. |
| **Regional bundled competitors** (for example **Bayzat** + **Mudad** payroll narrative) | Lead on **local TCO** and **payroll-compliance** storytelling | Workday counters with **global enterprise depth**, **audit**, and **native v1** recruiting-time compliance **without** claiming portal automation prematurely. |
| **Enterprise ATS comparators** (**SAP**, **Oracle**) | Strong **AI** and **channel** narratives in **2026** materials | Position **governed compliance data** and **human-in-the-loop** offer decisions as differentiated **trust** story for **GCC** **RFPs**. |

*Note: Deployment Agent answers can **drift** across threads on adjacent topics (SMS, scheduling SKU). Nationalisation-specific validation for this PRD used a **March 2026** Deployment Agent thread confirming **no native Qiwa/Mudad submission** and **configuration-led** metrics today.*

### Audience / Personas

**Primary persona: HR Professional / Talent Acquisition lead (GCC)**  
• Owns **requisition** and **offer** outcomes under **nationalisation** targets. **•** Needs **real-time** visibility into **pipeline composition** vs quota and **defensible** reporting to leadership.  
*Persona depth: `docs/workday-user-research/README.md` (HR Professional JTBD supplemental guide) and `docs/jtbd-recruiting-hr-professional-and-manager.md`.*

**Secondary persona: HR / People analytics or COE partner**  
• Defines **quota models**, **organisational scope**, and **reporting** cadence; consumes **dashboards** and validates **methodology**.

**Tertiary persona: Hiring manager (GCC-facing reqs)**  
• Benefits from **clear, minimal** signals when a hire **affects** localisation targets (no requirement to master statutory bands).

---

## Feature Solution

• **Country and programme packs (v1 minimum: KSA, UAE)** delivering **pre-modelled** nationalisation concepts (for example local / national / expat / GCC classifications aligned to configurable rules), **without** replacing customer **legal** interpretation of Nitaqat bands or MOHRE categories.  
• **Native tracking of nationality and residency-relevant attributes** for **candidates and applications** (and hire handoff), using **standard fields where possible** and **controlled extensions** where statutory nuance requires; **synchronisation** with **worker** primary nationality patterns post-hire.  
• **Real-time quota calculation dashboards** at levels agreed in design (for example legal entity, supervisory organisation, location, requisition portfolio) showing **counts, percentages, and trend** against **customer-maintained targets** and thresholds.  
• **Warning and informational flags at offer stage** when proceeding would **breach** configured thresholds or **exacerbate** shortfall (severity tiers: block vs warn vs inform per tenant policy **and** Legal review). **Hard blocks** (preventing progression) must **not** ship without **additional safeguards** agreed with Legal: clear **in-product explanation** of why the block fired, **documented override path** with approver accountability, and **alignment** with **candidate/employee-facing transparency** (see **Compliance, data, and privacy**). Default posture for v1 should **bias toward warn + audit** unless the customer explicitly configures block with governance.  
• **Audit trail** for **who** viewed or changed **compliance classifications**, **thresholds**, and **offer decisions** linked to warnings.  
• **Role-based security** so **sensitive** attributes are **minimised** in the recruiter grid for users who do not require them (**Experience Principles** and Legal alignment).  
• **Export formats** (for example CSV / XLSX) **compatible** with **manual** government portal upload **where** authority layouts are documented **by the customer**; **no automated submission in v1**.  
• **Administrator experience** to **activate** packs, **map** organisations to **programmes**, **set targets**, and **override** with **approved** audit.  
• **Version two placeholder (not v1 deliverable):** **Direct API integration** with **Qiwa**, **Mudad**, and related **government** endpoints for **automated** data exchange and **status** sync; discovery and **partner** alignment **only** in v1 as **roadmap** artefact.

### Experience Principles Alignment

**Empower (give users control)**  
• Recruiters and TA leads **choose** when to proceed past warnings; the system **surfaces** risk but does not **silently** auto-reject candidates (human decision at offer). **•** **Outcome-focused**: “Meet quota **and** fill the req” rather than forcing a **single** rigid workflow. **•** **Progressive disclosure**: hiring managers see **only** what they need.

**Trust (build their confidence)**  
• **Transparent** calculation: users can **drill** into **which** population and **which** rules produced a **flag**. **•** **Familiar** language: **nationalisation**, **localisation**, and **quota** terms **localised** per **tenant** locale **without** unexplained acronyms in primary UI. **•** **Accuracy**: **versioned** rules and **effective dating** for programme changes.

**Grow (enable them to change)**  
• **Self-service** threshold and **target** updates within **security** boundaries; **history** of **changes** visible to COE. **•** **Extensible** packs for **additional** GCC countries **without** re-implementing **entire** custom field programmes.

**Principle validation**  
• [x] Feature keeps the user in control (no sole automated rejection for compliance outcome)  
• [x] Clear transparency for calculations and flags  
• [x] Change and audit history supported without mandatory services engagement for routine threshold edits  

---

## Critical User Journey & Use Cases

• **Activate programme**: Tenant admin enables **KSA** and/or **UAE** pack, maps **organisations** to **programmes**, imports or enters **targets** and **effective dates**.  
• **Recruit**: Recruiter views **requisition** or **pipeline** dashboard showing **composition** vs **target**; filters candidates **without** exposing unnecessary sensitive fields.  
• **Assess**: System derives **classification** from **nationality**, **residency**, and **configured** rules; **exceptions** routed to **COE** with **reason** capture.  
• **Offer**: On **offer initiation** or **approval**, system **evaluates** impact on **quota**; shows **warning** or **block** per policy; **records** **decision** and **approver**.  
• **Report**: Leader opens **executive dashboard**; exports **period** report for **board** or **statutory** **manual** filing.  
• **Audit**: Compliance user runs **audit** report of **classification changes**, **threshold edits**, and **offers** with **override**.  
• **Iterate**: COE adjusts **targets** after **government** **band** **change**; **effective dating** preserves **historical** accuracy.

---

## Compliance, data, and privacy

### Lawful basis and roles (controller vs processor)

• **Customer as controller**: For **candidate and employee** personal data used in nationalisation/quota workflows, the **customer organisation** is typically the **controller** (or co-controller where agreed). Workday acts as **processor** under the customer **Data Processing Agreement (DPA)** unless a specific Workday-controlled scenario applies; the PRD requires **artefacts** that help customers **demonstrate accountability** (purpose, necessity, retention), not only Workday internal minimisation.  
• **Lawful basis mapping (indicative, tenant-specific):** Product and documentation must **not** assert a single global basis; customers configure and document per jurisdiction. **Illustrative mapping** for PM and implementation (final basis = customer Legal):

| Processing activity | Typical controller lawful basis (non-exhaustive) | Notes |
|---------------------|---------------------------------------------------|--------|
| Collecting/storing **nationality**, **residency**, **government ID** for hiring and compliance | Contract (employment/recruitment); Legal obligation (where statute requires); **not** a substitute for notice | Align with **privacy notice** and **purpose** statements |
| **Derived** classifications (for example local / national / expat / GCC banding from rules) | Same as underlying data; **transparency** on derivation logic | Document in **record of processing** / DPIA |
| **Quota dashboards and reporting** (workforce and pipeline metrics) | Legitimate interests or legal obligation (programme-dependent); **EU**: balance test if LI | **Minimisation**: expose tiers by role |
| **Audit logs** (who changed classifications, thresholds, overrides) | Legitimate interests (compliance, security) or legal obligation | See **retention/purge matrix** |
| **Exports** for **manual** government filing | Legal obligation / contract; **purpose-limited** export | v1 **customer-operated** export reduces Workday transfer scope |

• **EU/EEA and UK (where applicable):** Where **nationality** or data revealing **ethnic origin** is processed, treat as **special category** data under **GDPR Article 9** unless a **specific** Article 9(2) derogation applies (for example **explicit consent**, **employment/social protection law** where authorised by Member State law, or **substantial public interest** with local basis). **Path**: customer Legal selects Article 9 condition; product provides **granular** collection, **notice**, and **documentation hooks**; **DPIA** expected where Legal flags high risk.

### High-sensitivity treatment (nationality and derived fields)

• **Nationality**, **additional nationalities**, **residency**-linked attributes, and **derived** nationalisation/classification fields are **high-sensitivity** for product design: **role-based access**, **purpose limitation**, **encryption in transit/at rest** per platform standards, **logging** of access where appropriate, and **no** use for **automated sole** hiring decisions.  
• **GCC PDPL**: Align handling with **UAE Federal PDPL** and **KSA PDPL** requirements (consent and/or other lawful bases, **data subject rights**, **cross-border** rules). **Programme-level legal review** is required before positioning **v2** **automated portal** flows or **new** **international transfers** or **localisation** commitments.

### Data architecture and data flows

• **In-scope data**: Existing **Recruiting/Core** identity fields where used; **new** programme configuration (targets, thresholds, effective dates, rule versions); **derived** quota/composition metrics; **audit** events (views/changes to compliance classifications, threshold edits, offer-stage decisions linked to warnings/overrides).  
• **Flows (v1):** Data remains **within** the tenant boundary for **processing**; **government submission** is **customer-initiated** export (no Workday-to-authority API in v1). **Support and operations**: **Multinational tenants** and **Workday support** access to **high-sensitivity** attributes must follow **least privilege**, **customer-configurable** support access patterns where available, and **documented** **access logging** for audit exports; v1 **customer export** formats must **define** whether exports **include** raw nationality vs **aggregated** counts per **Legal**-approved **data minimisation** option.  
• **v2 (out of scope for v1 delivery):** **Direct APIs** to **Qiwa**, **Mudad**, or other portals imply **new** **subprocessors**, **transfer** analysis, and possibly **local** processing or residency requirements; **requires** **programme-level** Legal review (UAE PDPL, KSA PDPL, **SCCs** or alternatives, **localisation** decisions).

### Retention and purge matrix (new and existing artefacts)

| Data / artefact | Retention principle | Purge / expiry | Owner notes |
|-----------------|--------------------|----------------|-------------|
| **Candidate** nationality / residency / compliance fields | Align to **existing** recruiting **retention** and **candidate purge** schedules | **GDPR** / local **erasure** on **valid** request and purge jobs | No **indefinite** retention beyond customer policy |
| **Worker** post-hire nationality-linked data | **HCM** retention and **offboarding** rules | Per **tenant** configuration and law | Sync handoff from Recruiting |
| **Programme config** (targets, thresholds, mappings) | **Business** need for **statutory** periods | **Versioning**; retain **history** for **defence** per Legal advice | Admin **delete** vs **archive** per design |
| **Audit trail** (classification changes, overrides, offer decisions) | **Legitimate** compliance and **dispute** limitation periods | **Legal**-advised **retention** (jurisdiction-specific); **then** purge or anonymise | Balance **investigation** need vs **minimisation** |
| **Dashboard/query** **cache** or **derived** aggregates | **Operational** minimum | **Short** TTL where used | Avoid **stale** compliance decisions |
| **Export files** (customer download) | **Out of Workday** control once downloaded | Customer **DPA**/policy | UX: **warn** that **downloaded** files need **customer** governance |

### Candidate and employee transparency (controller accountability)

• **Privacy notices**: Customers must be able to reflect **purposes** (recruitment, **nationalisation/quota compliance**, reporting to authorities where applicable), **categories** of data (including **derived** classifications), and **retention** in **candidate** and **employee** privacy notices; product **copy** and **implementation guides** should **not** replace customer Legal wording but must **support** accurate disclosure.  
• **In-product**: Where **sensitive** fields are **shown** or **requested**, align with **just-in-time** **notice** patterns and **319/060** copy review; **no** **dark patterns** that obscure **why** data is collected.  
• **Consent**: Where **Article 9** or **local** law requires **explicit consent**, **capture** and **evidence** are **customer** responsibilities; product provides **technical** support (fields, audit) **as** agreed with Legal.

### User experience (fairness, blocks, and automation)

• **Hard blocks**: Require **Legal-approved** **messaging** (what is blocked, **what** data triggered it, **who** can override, **audit**). Prefer **warn + override with reason** for v1 unless customer mandates block.  
• **Discrimination risk**: Do **not** present **protected** characteristics as **default** **filters** for **exclusion**; **counsel** review on **defaults** and **wording**.  
• **No automated sole decision-making**: Flags **inform** humans; **offer** remains **human** decision; **GDPR Article 22** and **EU AI Act** **human oversight** principles apply where relevant.

### Cross-border and version two

• **v1**: Customer-managed **export** limits **new** Workday-initiated **international transfers** for **government** submission.  
• **v2**: **API integration** and **any** **new** **storage** location or **subprocessor** require **programme-level** Legal review (**UAE PDPL**, **KSA PDPL**, **transfer mechanisms**, **localisation**).

### DPIA and governance

• **DPIA**: **Prudent and expected before GA** per Legal for processing that combines **sensitive** attributes with **decision-time** workflows at scale; complete **before** **GA** for **in-scope** deployments where Legal requires.  
• **Documentation**: Technical and **operational** measures, **subprocessors** (if any new for this feature), **residual risk** acceptance **via** customer and Workday **governance**.

---

## UX Designs for release

• Nationalisation dashboard (recruiter) – Figma TBD  
• Executive compliance summary – Figma TBD  
• Offer-stage compliance panel – Figma TBD  
• **Privacy-aligned patterns**: just-in-time **notice** / help for **sensitive** fields, **block** and **override** **explanations**, **export** **warnings** (customer responsibility for downloaded files) – copy via **319** with **060** for legal-sensitive strings  

---

## Releases & production thresholds

• **Legal review** of PRD and **offer** / **warning** / **block** / **export** copy prior to development commit (sensitive processing).  
• **DPIA** (or regional equivalent) **completed and signed off before GA** where Legal mandates it (**expected** for typical multinational and EU-touching deployments using this capability); track as **release readiness** criterion alongside functional exit criteria.  
• **UAE PDPL and KSA PDPL**: **Programme-level** Legal review for **market** packaging, **DPA** disclosures, and any **v2** **transfer** or **localisation** claims.  
• **Responsible AI**: not applicable to **v1** scope (no ML classification in base scope; if **ML** introduced later, **re-open** review).  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| Legal and privacy sign-off on v1 scope | TBD |
| Design brief approved (Sana / Canvas Kit) | TBD |
| Country pack alpha (KSA + UAE) | TBD |
| Beta with design partner customers | TBD |
| General availability | TBD |
| v2 discovery: Qiwa / Mudad API | TBD |

---

## Open questions

• **Exact v1 country list** beyond **KSA** and **UAE** (Kuwait, Qatar, Bahrain, Oman) and **priority** order.  
• **Depth of Nitaqat / MOHRE band logic** delivered as **product** vs **customer-configured** lookup tables.  
• **Integration** with **Prism** or **standalone** Recruiting analytics **only** for v1.  
• **Franchise** and **multi-tenant** **reporting** boundaries for **global** **parents** with **GCC** **subs**.  
• **Offer** **block** vs **warn** **default** **by** **industry** **segment** (semi-government vs private).  
• **Unresolved (Legal):** Final **Article 9** / **special category** **positioning** per **Member State** **employment** law variations when EU candidates/workers are in scope (customer-specific).  
• **Unresolved (Legal):** **Minimum** **audit** **retention** periods vs **purge** for **GCC** vs **EU** tenants when **conflicting** (programme decision).  
• **Unresolved (Legal):** **v1** **customer export** **minimum** **field set** for **MOHRE/Qiwa-style** filings vs **maximal** **minimisation** (per-authority **templates** TBD).  
• **Unresolved:** **Multinational** tenant **rollup** dashboards that **combine** **GCC** **quota** views with **EU** **workforce** data without **impermissible** **inference** or **transfer** (architecture and Legal **sign-off**).  
• **Unresolved:** **Workday support** **access** model for **blocked** or **escalated** **classification** **disputes** (break-glass, customer approval, regional **support** **staff** **constraints**).

---

## Resources

• Epic – TBD (EA), TBD (GA)  
• PRD (markdown): `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
• PMF thematic analysis: `research/GCC/thematic-analysis/2026-03-28-GCC-PMF-Analysis-GCC-E2E-031.md`  
• Competitive scan: `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-031.md`  
• Competitive matrix: `research/competitive/matrices/gcc-competitive-matrix.md`  
• Strategy context (supporting): `research/GCC/strategy-context-2026-03-27-GCC-E2E-031.md`  
• Experience principles: `docs/experience-principles.md`  
• Deployment Agent validation thread (nationalisation patterns): `fc94020a-bf96-4bfa-88da-347692130bbf`  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Workday Recruiting |
| TBD | Engineering Lead |
| TBD | Design Lead |
| TBD | Legal Partner |
| TBD | Customer Success Lead (GCC) |

---

Workday Confidential — end of document — approximate length 12 pages if printed  

-- 12 of 12 --
