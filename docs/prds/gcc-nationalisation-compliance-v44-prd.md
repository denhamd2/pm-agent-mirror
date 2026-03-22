# GCC Nationalisation and Workforce Compliance (OOB) (TBC release)
Product Requirements Document  
March 2026

## Executive Summary

Workday is uniquely positioned to develop **out-of-the-box (OOB) GCC nationalisation and workforce compliance** capabilities for Recruiting and the broader HCM record, anchored on a single system of record. This initiative delivers **standard nationality, quota, diversity, and audit dimensions** for **Kingdom of Saudi Arabia (KSA)** (Nitaqat / Saudization alignment with **Qiwa- and evidence-ready exports**), **United Arab Emirates (UAE)** (Emiratisation), and **Kuwait** (Kuwaitisation), with **role-based security** and **customer-owned lawful basis configuration** for sensitive attributes. Target delivery phases are **TBC** pending engineering sizing; this PRD defines scope for **GCC-E2E-005 Step 3** from PMF v44 and user research (21 March 2026).

For our customers, this feature will **replace fragile custom-field and spreadsheet models** with **consistent definitions, dashboards, and audit exports**, reducing penalty risk from quota shortfalls and cutting time spent rebuilding compliance views in Excel or PowerBI. Research participants describe **financial penalties** for missing Nitaqat-style mandates and **board-level** pressure to evidence nationalisation and diversity metrics (P2, Baker Hughes; P1, Accenture; thematic synthesis, v44).

For Workday, this initiative will **strengthen GCC win rates and retention** against regional ATS vendors that market **built-in Saudization / Nitaqat / Emiratisation** support (v44 competitive landscape), **deepen the HCM plus Recruiting value story**, and **reduce implementation variance** by packaging repeatable country variants instead of one-off customer extensions.

This PRD sources **primary qualitative evidence** from `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v44.md` (120 PMF, Braun & Clarke) and `research/GCC/105-user-research-findings.md` (105 Path B). **PESTEL Legal** context includes **Nitaqat programme evolution (2026–2028 commentary; confirm MHRSD primary notices for implementation)**, **UAE Emiratisation enforcement and fines (press reporting; illustrative amounts)**, and **Kuwaitisation** policy signals (trade press). **Jurisdiction-specific percentages** in customer quotes are **customer-reported targets**, not Workday legal determinations; product must remain **configurable** and **non-prescriptive** on statutory rates.

**Epic Links (placeholders):**

- GCC Nationalisation Compliance EA: *[EPIC-ID-TBC]*
- GCC Nationalisation Compliance GA: *[EPIC-ID-TBC]*

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC employers must **track and evidence** nationalisation and related workforce quotas (Saudization / Nitaqat, Emiratisation, Kuwaitisation) alongside **gender** and **people with disabilities (PWD)** hiring expectations. Today, customers rely on **custom fields**, **manual spreadsheets**, and **exports into PowerBI** (P1, P3), which **break under scale**, **differ by implementer**, and **strain audit readiness**. P2 describes **penalties** for missing Nitaqat-style requirements and a desire for capability **"out of the box… versus… bandaids."** P3 notes **franchise / joint-venture** markets where **local compliance** often **does not roll up** cleanly, increasing reliance on **manual local returns**. Without OOB dimensions, dashboards, and exports, recruiters and TA operations leaders cannot **trust in-product views** for daily compliance management (P1: native dashboards "gave me a headache"; P3: **PowerBI** for recruitment KPIs). |
| **How is it done today?** | Customers **capture nationality and diversity-related attributes** where policy allows, often via **custom fields** and **offline Excel**. **Quota math** and **regulatory evidence packs** are assembled outside Workday or through brittle reporting. **Role-based access** to sensitive fields is inconsistent when implemented ad hoc. Franchise models may treat Workday as a **data source** only, with **manual** compliance steps (P3). |
| **How is our approach uniquely different from others?** | • **Single HCM plus Recruiting record** with **standard GCC workforce compliance dimensions** (not siloed ATS-only patches).<br>• **Country variants** for **KSA, UAE, Kuwait** with **tenant-configurable targets** and **evidence-oriented exports** (Qiwa / government touchpoints as **future integration hooks**, not blocking for MVP).<br>• **Security and privacy by design**: **role-based access**, **customer-configured lawful basis** and **retention** messaging for sensitive categories, **audit trails** on exports and definition changes.<br>• **Dashboards and operational metrics** aligned to recruiter workflows, reducing **BI tool exit** pressure (v44 Theme 5). |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast (illustrative; refine with GTM):**<br>• **Adoption Target:** *[X]%* of GCC-heavy Recruiting tenants enabling at least one **nationalisation dashboard** or **scheduled export**.<br>• **Usage Volume:** *[N]* **compliance export** runs / quarter; *[M]* active dashboard users.<br>• **Basis:** Tenant count with GCC hiring footprint × expected enablement of OOB compliance pack.<br><br>**Strategic Value & Outcomes:**<br>1. **Compliance confidence:** Measurable reduction in **time to produce audit / regulatory evidence** (baseline: customer-reported **hours per month** in Excel; target: **50% reduction** for pilot cohort).<br>2. **Data integrity:** **Single definition** of nationality / quota dimensions across Recruiting and HCM handoffs; fewer **reconciliation** breaks at hire.<br>3. **Commercial:** Improved **RFP fit** vs regional vendors (Talentera, ZenATS) on **Saudization / GCC compliance** narrative (v44). |

### Research evidence (v44 and 105)

| **Source** | **Finding** |
|------------|-------------|
| **P1 (Accenture)** | *"I'm liable to hit… 20% Emiratisation, 60% national Saudization, 50% Kuwaitisation on my hiring… we track nationality… gender… PWD… regulatory requirement compliance."* (105). P1 also describes **4% PWD in KSA** and **5% in Egypt** as **regulatory compliance requirements** they must track (`research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`). |
| **P2 (Baker Hughes)** | *"Nitaqat key mandate… we get penalties if we don't meet… having that built into a more out of the box… versus… bandaids."* (105). |
| **P3 (Shell)** | *"Franchise countries… GCC areas… joint ventures… local variances that we're not able to roll up… workday would just be a data source and then manual bits."* (105). |
| **v44 appendix quotes** | P1: *"WhatsApp is an absolute necessary… immediate responses."* P2: *"We get penalties if we don't meet… out of the box… versus… bandaids."* P3: *"Arabic letters… it would just be squares rather than the actual characters."* (illustrates broader GCC product pressure; nationalisation PRD scope remains compliance dimensions and reporting). |
| **v44 PESTEL (Political / Legal)** | **Nitaqat** new phase **2026–2028** commentary (e.g. Mondaq summary; **confirm Arabic MHRSD primary notices** before any in-product legal copy). **UAE Emiratisation** enforcement: press cites **up to AED 108,000 per missing Emirati** in illustrative reporting (e.g. Gulf News; **not** hard-coded in product). **Kuwaitisation**: public-sector emphasis in trade press. **KSA PDPL**, **UAE PDPA**: data minimisation, transparency, transfers (v44 Legal PESTEL). |

### Audience / Personas

**Primary persona: HR Professional (Recruiter / TA operations)**  
Persona depth: `docs/workday-user-research/` (HR Professional supplemental guide) and `docs/jtbd-recruiting-hr-professional-and-manager.md`.

- Manage reqs and candidates across **high-regulation GCC** markets; must **hit nationalisation and diversity targets** without offline workarounds.
- **JTBD (verbatim cluster):** *Foster an inclusive and equitable recruiting process*; *Understand the levels of candidate diversity within open job requisitions*; *Maintain data integrity throughout the recruiting process*; *Identify ways that my HR systems can better meet my workflow* (`docs/jtbd-recruiting-hr-professional-and-manager.md`).
- **Synthesised JTBD:** When hiring across regulated GCC markets, recruiters want **one trustworthy system** for **compliance, clear pipeline visibility, and quota evidence**, so they can **meet nationalisation targets** without spreadsheet rebuilds (105, P1).

**Secondary persona: Talent / HRIS / People analytics lead**

- Owns **reporting stack**, **role-based access**, and **integration** to payroll / government systems; requires **audit exports** and **consistent definitions**.

**Tertiary persona: Hiring manager**

- **Secondary** visibility only (e.g. requisition-level summary widgets where policy allows); not primary configure of lawful basis.

---

## Feature Solution

• **Standard GCC workforce compliance dimensions** (OOB): nationality / citizenship attributes for **application and candidate record** (where customer enables collection), **gender** reporting hooks, **PWD** flag or category (where legally permissible and customer-configured), aligned to **HCM worker** record at hire.

• **Country packs**: **KSA** (Nitaqat / Saudization-oriented **metrics**, **tier-agnostic** configurable targets, **evidence export** layouts suitable for **Qiwa-aligned** customer workflows); **UAE** (Emiratisation **%** and gap views); **Kuwait** (Kuwaitisation tracking). **No hard-coded statutory percentages**; customers enter **targets** and **effective dates**.

• **Nationality field (application capture)**: configurable **application question** or **derived-from-doc** workflow (future); **consent and transparency** copy owned by customer with Workday **templates** that flag **sensitive processing**; **optional** per requisition or per country.

• **Quota tracking and reporting**: numerator / denominator definitions **documented** (e.g. headcount by nationality band, FTE vs headcount **customer choice**); **time-stamped snapshots** for audit; **exception lists** (below target, missing data).

• **Dashboards**: recruiter and HR operations views for **Nitaqat / Saudization %**, **Emiratisation %**, **Kuwaitisation %**, **PWD %** (configurable targets, including **4% KSA / 5% Egypt** as **example P1 targets**), **gender diversity** metrics; filters by **legal entity, location, job family, requisition**.

• **Audit / compliance exports**: scheduled and ad hoc **CSV / XLSX** (and **reporting framework** integration) with **column dictionary**, **run history**, **user and role** who generated export; **immutable** export log.

• **Role-based security**: granular **view / manage** for nationality, PWD, and export actions; **DAP-compatible** patterns; **masked** or **hidden** fields where user lacks permission.

• **Customer lawful basis configuration**: tenant-level **purpose**, **retention**, and **legal basis** metadata for sensitive fields; **integration** with privacy notice links; **no** Workday legal advice in UI (neutral copy).

### Experience Principles Alignment

**Empower (give users control)**  
- Customers **configure** which countries, targets, and fields are active; recruiters see **explainable** quota math and **drill-through** to candidates (within security).

**Trust (build their confidence)**  
- **Transparent** definitions: "what counts as Emirati / Saudi / Kuwaiti for this dashboard" surfaced via **data dictionary** and **versioned** export headers.

**Grow (enable them to change)**  
- **Target and definition changes** are **audited**; historical snapshots support **restated** reporting without losing prior period evidence.

**Principle validation**

- [x] User stays in control of configuration and exports  
- [x] Clear transparency on metrics and snapshots  
- [x] Change history and auditability for compliance  

---

## Critical User Journey & Use Cases

• **Configure**: HRIS admin enables **KSA / UAE / Kuwait** pack, sets **targets** (e.g. P1-cited **20% Emiratisation, 60% Saudization, 50% Kuwaitisation** as **customer-entered** values), **PWD** targets (e.g. **4% KSA, 5% Egypt** per P1), connects **lawful basis** and **retention** for nationality and disability data.

• **Capture**: Candidate applies; **nationality** captured where allowed; data flows to **candidate** and later **worker** with **consistent** reference IDs.

• **Operate**: Recruiter opens **GCC compliance dashboard**; sees **gap to target** by unit; drills to **candidates missing required data** (masked per security).

• **Evidence**: TA operations schedules **monthly Nitaqat / Emiratisation / Kuwaitisation export**; system logs **who / when / what definition version**; customer submits to **Qiwa / MOHRE / internal audit** (manual in MVP).

• **Franchise / low volume**: P3-style markets use **same exports** at smaller grain; optional **lightweight pack** (future Priority 2, v44).

---

## Functional Requirements

### FR-1 Nationality and citizenship (application and candidate)

• Support **standardised nationality / citizenship** attributes aligned with **HCM** reference data.  
• Support **GCC-specific reporting groupings** (e.g. GCC national, non-GCC expatriate) as **configurable bands** where customer defines mappings.  
• **Acceptance criteria:** Given a tenant with KSA pack enabled, when a candidate submits an application with nationality captured, then the value is stored on the **candidate record** and available to **quota logic** and **exports** without duplicate custom fields.

### FR-2 Quota logic and snapshots

• Compute **periodic snapshots** (configurable: weekly / monthly) for each **defined quota** (Saudization, Emiratisation, Kuwaitisation, PWD, gender diversity).  
• Support **customer-defined denominators** (e.g. active employees in scope vs candidates in funnel **where product allows**; **clearly label** funnel vs hired population).  
• **Acceptance criteria:** Given a saved target set for UAE Emiratisation, when the monthly job runs, then the system stores a **time-stamped snapshot** with **numerator, denominator, %, gap**, and **definition version**.

### FR-3 Dashboards

• Deliver **OOB dashboard templates** per country pack; widgets: **current %**, **trend**, **gap to target**, **top units off target**, **data completeness**.  
• **Acceptance criteria:** Given a recruiter with dashboard access, when they open the UAE Emiratisation dashboard, then they see **Emiratisation %** and **gap** without building a custom report from scratch.

### FR-4 Audit and compliance exports

• Provide **pre-built export layouts** for **KSA** (columns suitable for customer **Qiwa / Nitaqat evidence** workflows), **UAE**, **Kuwait**; include **candidate / employee ID**, **role**, **location**, **nationality band**, **gender**, **PWD** (if collected), **hire / application dates** as permitted.  
• **Export audit log**: user, role, timestamp, filter set, definition version.  
• **Acceptance criteria:** When a compliance user runs export, then an **audit log entry** is written and the file includes a **definition version** row or metadata tab.

### FR-5 Security and privacy

• **Role-based** access to sensitive fields and exports; **segregation** between recruiter and **compliance officer** roles where configured.  
• **Acceptance criteria:** Given a recruiter without PWD view permission, when they open candidate profile, then **PWD** fields are **not visible**.

### FR-6 Lawful basis and retention (configuration)

• Tenant **metadata** for **lawful basis** and **retention** for nationality and disability processing; **link-out** to customer privacy notice.  
• **Acceptance criteria:** Given admin configures nationality collection, when candidate hits application, then **customer-supplied** transparency text is shown (neutral Workday shell).

---

## GCC Country Variants

| **Market** | **Product scope (MVP)** | **Regulatory context (inform product; customer legal owns interpretation)** |
|------------|-------------------------|----------------------------------------------------------------------------|
| **KSA** | Nitaqat / Saudization **dashboards**, **snapshots**, **exports**; hooks for **Qiwa / GOSI / Mudad** alignment in **column naming** and **future integration** | v44: **Nitaqat 2026–2028** phase commentary; **MHRSD** primary sources for rates and sector rules |
| **UAE** | Emiratisation **%, gap, exports** | v44: **MOHRE** enforcement; press on **fines** (illustrative; do not encode as legal fact) |
| **Kuwait** | Kuwaitisation **tracking** and exports | v44: **Kuwaitisation** emphasis in public sector reporting; customer validates private-sector scope |
| **Egypt (PWD)** | **PWD %** tracking where customer enables (P1 **5% Egypt** example) | Packaged as **extension** to PWD dimension, not KSA/UAE/KW nationalisation core |

---

## Non-functional requirements

• **Performance:** Dashboard refresh within **[TBC SLA]** for tenants within defined headcount band.  
• **Auditability:** **Immutable** export event log; **retention [TBC]** aligned to customer policy.  
• **Localisation:** **EN / AR** labels for **dashboards and exports** where Recruiting supports locale (RTL follow-on with **319**).  

---

## Legal / Compliance Considerations

• **GDPR Article 9:** Nationality and disability data may constitute **special categories** in EU/EEA contexts; **lawful basis** must be **customer-determined**; Workday provides **configuration**, **access control**, and **documentation hooks**.  
• **Purpose limitation and minimisation:** Collect **only** fields required for **stated customer purpose**; support **optional** nationality on application.  
• **KSA PDPL / UAE PDPA:** Transparency, transfers, and **DPA** alignment (v44 Legal); **ROPA-style** customer guidance in admin docs.  
• **DPIA:** Recommend **DPIA** for bundles combining **nationalisation reporting** with **high-risk** processing (v44 **060** recommendation).  
• **Disclaimer:** Product **does not** provide legal advice; **neutral** UI copy; **no** hard-coded assertion of **statutory** percentages.

---

## Dependencies

| **Dependency** | **Type** | **Notes** |
|----------------|----------|-----------|
| **HCM Core / Worker** | **Hard** | Consistent nationality / diversity attributes at **hire** |
| **Reporting framework / Prism** | **Hard** | Dashboards and enterprise reporting consumption |
| **Recruiting candidate model** | **Hard** | Application and candidate fields, security |
| **Qiwa / GOSI / Mudad / MOHRE integrations** | **Future** | v44: **credible roadmap**; MVP is **export + manual** submission |
| **Data conversion / implementer playbook** | **Soft** | Migrate **custom fields** to standard dimensions |

---

## Out of scope (MVP)

• **Automatic** submission to government portals  
• **Legal interpretation** of Nitaqat **tier** or **sector** rules inside product logic  
• **AI**-inferred nationality or disability status  

---

## Success Metrics

| **Metric** | **Definition** | **Target (pilot)** |
|------------|----------------|-------------------|
| **Time to produce audit pack** | Customer-reported hours / month on compliance exports | **−50%** vs baseline (self-reported) |
| **Dashboard adoption** | % GCC tenants with ≥1 compliance dashboard enabled | **[TBC]%** |
| **Data completeness rate** | % in-scope records with required nationality for active reqs | **+[TBC] pp** |
| **Support / break-fix tickets** | Tickets related to **custom nationality** reconciliation | **Downward trend** |

---

## Acceptance Criteria (summary)

1. **AC-1:** OOB **KSA, UAE, Kuwait** packs can be enabled independently with **no cross-country** data leakage in default security.  
2. **AC-2:** **Nationality** captured on application appears on **candidate** and flows to **worker** on hire with **single source**.  
3. **AC-3:** **Dashboards** show **Saudization / Nitaqat-oriented %**, **Emiratisation %**, **Kuwaitisation %** (labels **customer-configurable** where needed).  
4. **AC-4:** **PWD** and **gender** metrics available where customer enables fields; **PWD** supports **per-country targets** (e.g. P1: **4% KSA, 5% Egypt**).  
5. **AC-5:** **Exports** include **definition version** and write **audit log**.  
6. **AC-6:** **RBAC** enforced on all sensitive attributes and exports.  
7. **AC-7:** **Lawful basis** and **retention** configuration **required** before go-live toggle for nationality on application (admin guardrail).

---

## UX Designs for [Release]

• GCC Nationalisation Dashboard (Recruiter) – *[Figma TBC]*  
• Compliance export wizard – *[Figma TBC]*  

---

## Releases & Production Thresholds

• **Privacy / Legal** review of **candidate-facing** transparency templates  
• **Security** review for **sensitive fields** and **export** roles  
• **Responsible AI:** N/A for MVP (no ML inference in scope)  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD approval | TBC |
| Discovery brief (315) | TBC |
| Technical design | TBC |
| MVP build complete | TBC |
| Pilot tenant (GCC) | TBC |
| GA | TBC |

---

## Resources

• Epic – *[EPIC-ID-TBC]*  
• PMF analysis: `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v44.md`  
• User research: `research/GCC/105-user-research-findings.md`  
• P1 transcript (PWD %): `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`  
• JTBD: `docs/jtbd-recruiting-hr-professional-and-manager.md`  
• Experience principles: `docs/experience-principles.md`  
• Feature overview (Confluence): https://confluence.workday.com/pages/viewpage.action?pageId=4349857362  
• Deployment Agent validation (March 2026): confirms standard fields (e.g. primary / additional nationality, citizenship, government ID) and **Job Application** localisation; **avoid** promising **automated Nitaqat colour**, **direct Qiwa submission**, or **real-time government compliance** without integration  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Recruiting |
| *[TBC]* | Engineering Lead |
| *[TBC]* | Product Design |
| *[TBC]* | Legal / Privacy Partner |

---

Workday Confidential — 1 of 1 (markdown compile)
