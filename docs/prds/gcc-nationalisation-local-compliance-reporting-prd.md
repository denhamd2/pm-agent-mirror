# GCC Nationalisation and Local Workforce Compliance Reporting (TBD Release)

Product Requirements Document  
March 2026

## Executive Summary

Workday is uniquely positioned to strengthen **enterprise Recruiting** in the **Gulf Cooperation Council (GCC)** by elevating **nationalisation and local workforce compliance reporting** from **tenant-specific custom fields, manual Excel exports, and repeated Professional Services reconfiguration** toward **reference dimensions**, **catalogued audit-oriented report packs**, **documented implementation patterns**, and **clear data lineage** for employers subject to programmes such as **Nitaqat / Saudisation**, **Emiratisation**, and **Kuwaitisation**. The target release window remains **TBD** pending discovery sizing; this PRD defines **v1** scope, success measures, and honest competitive positioning.

For our customers, the solution will **cut nationalisation reporting configuration effort** (target: **60% reduction**, from roughly **two days** of custom work per client to **under one hour** for standard setup **only when** the **reference report catalogue** and **Professional Services (PS) implementation playbook** for this initiative are **published and in use** on pilot tenants; until then, targets are **aspirational** and baselined per **Appendix: Measurement definitions**), move toward **audit-ready reporting without Excel** for agreed in-product scenarios (target: **90%** of Nitaqat / Emiratisation-style report needs met in Workday per **PS feedback** on enrolled pilots), and support **commercial momentum** (target: **three or more** GCC enterprise pursuits in **Q2** where nationalisation reporting was a documented **blocker**, aligned to the regional objective of **ten GCC customer wins**; see **Appendix: Measurement definitions** for **blocker**, **progressed**, and **pursuit** definitions). **Primary research** with enterprise recruiters (Accenture, Baker Hughes, Shell) highlights **configuration churn** (“bandaids and configuration changes every time requirements shift”) and **compliance risk** when reporting gaps force offline workarounds.

**Buyer alignment:** **v1 success metrics and in-product evidence are scoped to Recruiting-sourced data** (pre-hire / pipeline / hire from Recruiting). They **do not**, by themselves, **certify** or **complete** **Nitaqat**, **Emiratisation**, or **Kuwaitisation** **government submissions** where buyers expect **full workforce** or **post-hire Worker** evidence. **GTM**, **SC**, and **RFP** materials must state **explicitly** what **v1 does and does not** cover; full-workforce narratives require an **HCM addendum** and **sequenced** delivery (see **Overview** and **Cross-product scope**).

For Workday, this initiative **reduces deal friction and PS load** in a **strategic growth region**, reinforces the **single platform** story (**global consistency**, **security**, **auditability**), and **differentiates on governance and traceability** versus **GCC-bundled HR suites** that market **statutory adjacency**. **Go-to-market** must stay aligned with validated **Native / Workaround / True Gap** language from the latest **GCC competitive baseline scan** and matrix (see **Overview** and **Appendix**).

Delivery is expected to follow **design discovery**, **copy and legal review for sensitive attributes**, **prototype**, and **Figma capture** as defined by the product operating model. This file is the **canonical PRD** in **`docs/prds/`** (not Confluence).

**Epic links**

• [GCC Nationalisation and Local Workforce Compliance Reporting] EA: TBD  
• [GCC Nationalisation and Local Workforce Compliance Reporting] GA: TBD  

---

## Overview

### Overview details

| **Section** | **Content** |
|-------------|-------------|
| **Core problem** | GCC enterprise customers (including Accenture, Baker Hughes, Shell) face **mandated nationalisation reporting** (Nitaqat / Saudisation, Emiratisation, Kuwaitisation). **Workday Recruiting** today relies heavily on **custom fields**, **manual Excel exports**, and **workarounds**. Deployment Agent validation for the latest baseline classifies **out-of-the-box nationalisation dashboards** as **Workaround** (custom reporting and analytics), not as a packaged statutory engine. That drives **implementation drift**, **repeat PS engagement** when rules change, **month-end scramble**, and **audit exposure**. **Primary research** cites **bandaid configuration** and **gaps that create compliance risk**. |
| **How is it done today?** | Customers capture nationality and programme-related attributes through **configuration** and report via **custom reports and dashboards**, often **exporting** to **Excel** or **BI tools** for packs that in-product views do not yet standardise. **Regional competitors** and **bundled suites** (e.g. payroll plus **Mudad**-adjacent narratives) market **GCC-first compliance packaging**; Workday wins on **depth** and **enterprise governance** but must **close time-to-evidence** and **honesty of parity** gaps. |
| **How is our approach uniquely different from others?** | • **Reference model + report packs:** Curated **dimensions** and **standard report definitions** reduce one-off field proliferation and repeatable Excel rebuilds for **standard** audits.<br>• **Honest parity:** Per baseline **DA30** (March 2026), **nationalisation / Saudisation / Emiratisation OOTB dashboards** and **MOHRE-oriented reporting OOTB** are **Workaround** (custom reports / dashboards), **not** native government-certified products. **Triangulate** earlier Deployment Agent threads (**DA20–DA29**) and validate with **PS + tenant UAT** before absolute customer commitments.<br>• **True gaps visible:** **Packaged Qiwa / Mudad recruiting data exchange** remains **True Gap**; **v1** does **not** ship **direct government portal integrations**.<br>• **Enterprise differentiation:** **Single tenant**, **security model**, **Recruiting reporting fabric**, and **native bulk grid** (table stakes per same baseline) support **governance** and **scale** versus point ATS or mid-market bundles.<br>• **Coexistence with custom fields:** **v1** does **not** require elimination of existing custom fields; customers may keep them while adopting the **standard alternative** where it fits. |
| **Why is AI/ML the chosen approach?** | **Not applicable** to **v1**. **Advanced predictive analytics** and **AI-powered quota optimisation** are **explicitly out of scope**; focus is **audit-ready reporting** first. Do not bundle **HiredScore**, **Skills Cloud**, or **semantic match** narratives into nationalisation **GTM** collateral unless on a **separate** artefact. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 forecast**<br>• **Configuration time:** **Baseline** ≈ **2 days** custom work per client (to be **frozen** in pilot kickoff workbook) → **Target** **<1 hour** standard setup for **agreed** reference configuration (**60% reduction** minimum vs baseline once measured). **The 60% reduction claim applies only** when the **reference report catalogue** and **PS playbook** are **published** and used in timed exercises; otherwise report **raw** setup times only (see **Appendix: Measurement definitions**).<br>  ○ **Basis:** Timed setup exercises with **PS** and design partners on **standard** programme slices.<br>• **Audit-ready reporting without Excel:** **Target** **90%** of **in-scope** Nitaqat / Emiratisation (and agreed Kuwait) **report scenarios** completed **without** Excel export, measured via **structured PS feedback** on pilot tenants (denominator = **agreed** scenario catalogue). **In-scope** means **Recruiting-only** unless an **HCM addendum** extends numerators/denominators.<br>• **Commercial:** **≥3** GCC enterprise pursuits in **Q2** where nationalisation reporting was a **recorded blocker** and **progressed** after **packaged** positioning + artefact refresh (ties to **10 GCC wins** OKR; **leading** indicator; definitions in **Appendix: Measurement definitions**).<br><br>**Strategic value and outcomes**<br>1. **Time to evidence:** Reduce **median minutes** and **steps** to produce **agreed** compliance packs for **Recruiting-sourced**, **in-scope** scenarios (same measurement discipline as prior discovery: **frozen** baselines).<br>2. **Excel elimination:** Increase share of **standard** audits executed **fully in product** for **in-scope** packs (aligns with **90%** PS feedback target).<br>3. **Drive business and platform growth:**<br>   a. **Monetisation:** Core platform value; optional **services** for migration from legacy custom models.<br>   b. **Deal-closing:** Accurate **parity** sheet reduces **RFP surprise** on **portal True Gaps**.<br>   c. **Future acceleration:** **Reference dimensions** support a later **Qiwa / Mudad** phase without full **re-modelling**. |
| **Buyer communication and statutory submissions (GTM)** | **v1 does not** position Workday as **certifying**, **validating**, or **filing** **Nitaqat**, **Emiratisation**, or **Kuwaitisation** **submissions** to government portals. **v1 provides** **internal management evidence** from **Recruiting** for **agreed** scenarios: **on-demand** reports, **dashboards**, **exports**, **run metadata**, and **column lineage** aligned to **customer-configured** programme definitions. **Full workforce** or **post-hire** evidence for statutory filings is **out of v1 commercial promises** unless covered by a **written HCM addendum** and **product scope** that includes **Worker / HCM** joins. **Sequence:** ship and message **Recruiting-only v1** first; **HCM addendum** is a **separate** commitment (scope, metrics, timeline) so buyers do not infer **end-to-end statutory readiness** from Recruiting KPIs alone. |

### Success metrics: baselines and boundaries

• **KPI boundary:** Configuration and **Excel** metrics apply to **Recruiting-only**, **in-scope** scenarios in the **audit-scenario matrix** (below) unless a **written HCM addendum** extends scope.  
• **Baseline (mandatory before pilot):** Document **median setup time** (minutes / hours), **step count**, and **Excel dependency** per **agreed** packs; **no external percentage claims** without **frozen** baseline.  
• **Minimum observation window:** **90 days** pilot before first readout; **12 months** post-GA for mature targets.  
• **Deal metric:** Track **GCC** pursuits with **nationalisation reporting** in scope; **minimum sample** before publishing **win-rate** claims (**minimum pilot N** and **pursuit** source of truth: **Appendix: Measurement definitions**).  
• **Configuration-time target caveat:** The **60% reduction** vs baseline is **reportable as a product target** only when **reference catalogue** + **PS playbook** are **published**; interim pilots measure **absolute** times and document **gap** to target.

### Audience / personas

**Primary persona:** **HR Professional (Recruiting)** — GCC recruiter or recruiting operations lead.  
• Owns **requisition** and **candidate** progression; supports **nationalisation** evidence and **audit** readiness.  
• Needs **in-product** **dashboards** and **report packs** that reduce **Excel** rebuild for **standard** mandates.

**Secondary persona:** **Recruiting / TA leadership** — regional or global.  
• Consumes **roll-ups** by **LOB**, **location**, and **programme**; requires **consistent definitions** across **entities**.

**Tertiary persona:** **Implementation / value consulting partner**  
• Configures **reference** setup; benefits from **PS patterns** and fewer **bespoke** field strategies.

Persona depth: **`docs/workday-user-research/README.md`** (HR Professional JTBD supplemental guide as needed) and **`docs/jtbd-recruiting-hr-professional-and-manager.md`**. **v1** is **recruiter- and compliance-owner**-heavy; **not** candidate-facing.

---

## Feature solution

### Cross-product scope (HCM vs Recruiting)

• **Where attributes live:** **Recruiting** owns **candidate- and application-stage** attributes and **pipeline / hire** report objects for **pre-hire** nationalisation views. **HCM / Worker** owns **post-hire** attributes. The **reference model** must **not** silently duplicate **Worker-authoritative** fields in **Recruiting**.  
• **v1 default slice:** Shippable **v1** is **Recruiting-sourced** programme **report groupings**, **dashboards**, and **exports** unless an **HCM addendum** expands scope.  
• **Co-ownership:** **HCM Reporting** and **Data & Analytics** stakeholders **co-own** alignment on **shared dimensions** when **HCM joins** are in scope.  
• **HCM addendum sequencing:** **Do not** imply **full workforce** or **statutory filing completeness** from **v1** Recruiting deliverables. An **HCM addendum** (separate PRD scope or amendment) defines **Worker-side** fields, **joins**, **metrics**, and **GTM** language **after** Recruiting v1 boundaries are clear; **commercial** commitments on **composite** workforce reporting require that addendum **before** **SC** or **sales** presents **end-to-end** **Nitaqat / Emiratisation** readiness.

### Audit-scenario matrix (metrics and PRD scope)

| **Scenario class** | **Data / product scope** | **In v1 success metrics and pilot KPIs?** | **Notes** |
|--------------------|--------------------------|---------------------------------------------|-----------|
| **Recruiting-only standard audit** | Evidence from **Recruiting-sourced** fields, **agreed** standard **programme** definitions, **on-demand** runs and exports | **Yes** | Baselines, configuration time, **Excel** elimination, **PS feedback** targets apply **here** |
| **HCM-composite / post-hire** | Pack needs **Worker** / **HCM** joins or **trended** Worker logic | **No** (unless **HCM addendum**) | Out of **metric** numerators / denominators until scope extended |

### Data quality (nationality and programme fields)

• **Required fields (v1 discovery output):** The **agreed** **reference model** lists **minimum** attributes for each **programme** slice (e.g. nationality / citizenship, programme classification, application or hire stage markers as defined with **legal** and **field**). **Reports** and **dashboards** must document **which** fields are **required** for each **pack**; rows with **missing** required fields appear in **coverage** indicators, not silent omission.  
• **Merge and duplicate behaviour:** **UDMF** and **candidate merge** outcomes must be **defined** for programme fields: **surviving** record rules, **history** of changes for audit views, and **no double-count** in **aggregates** where merges occur during the reporting period (exact behaviour **validated** with **functional knowledge** and **engineering** in design).  
• **Empty states and coverage:** **In-product** surfaces expose **coverage** (e.g. % candidates / applications with **complete** programme data for the selected slice), **gap** lists or **validation** outputs from the **PS playbook**, and **empty-state** copy that **does not** imply compliance when data is **incomplete** (see **Compliance Considerations** disclaimers).  
• **Data quality gates for pilots:** Pilot **readiness** includes a **tenant** **data quality** checklist signed by **implementation**; **90%** Excel-bypass and similar KPIs use **denominators** that **exclude** or **segment** populations with **below-threshold** field completeness (**threshold** frozen in pilot workbook).

### Handoff to design: competitive allowlist (appendix only)

**Design and prototype work** should ground **parity copy** in the **four capability rows** in **Appendix: Competitive classification** only. Do **not** pull unrelated rows (e.g. SMS, scheduling) into this initiative’s brief unless the **PM** issues a **scope addendum**.

**Security (DAP) consult at design brief kickoff:** Before **315** PASS 1, the **PM** must **schedule** a **Data Access Policy (DAP) / security domains** consult for **sensitive** **nationality** and **programme** reporting (report shares, constrained groups, **Recruiting and Candidate Reporting** access). **Named consult owner:** assign via **Recruiting Security** or **HCM Security** roster (**placeholder until Security names the SME**; **do not** treat **Contacts** *TBD* as waiver). **318** peer review assumes DAP direction is **documented** or **explicitly waived in writing** by Security.

### Solution elements

• **Reference data model (UAE, KSA, Kuwait — extend per legal / PM)**  
  • Dimensions and attributes for **nationalisation / local compliance** reporting, subject to **legal** review and **minimisation**.  
  • Tenant configuration to enable **programme report groupings** without forcing new one-off custom fields for **standard** metrics.

• **Catalogue of standard reports and dashboards**  
  • Pre-built definitions for **pipeline** and **hire** views per **programme** slice (exact list in discovery).  
  • **On-demand** run plus export; **goal** is **no Excel** for **standard in-scope** audits; **edge** cases may still export.

• **Run metadata and audit posture (product)**  
  • Surface **runner**, **timestamp**, **report definition version**, and **column lineage** to **Recruiting** objects / fields on each run. **Integration:** Extend **existing** **Report Run History** (and related **Recruiting reporting audit** patterns where applicable) rather than inventing a **parallel** run store; **lineage** and **definition version** align to **same** **audit trail** consumers use today for **custom** / **standard** reports unless discovery proves a **gap** (then document **delta** in **Open questions**).  
  • **Design-phase retention choice (pick one path; document in technical design):** **(A)** **No persistent row-level snapshot** beyond **existing** Report Run History / export behaviour (runs are **metadata + pointers** to current authoritative data; **re-run** reflects current records), **or** **(B)** **Explicit** retention rules for any **new** run or export artefact plus **purge hooks** aligned to **candidate/application purge** and **legal hold** (see **Compliance Considerations**). **v1** must **not** leave retention **ambiguous** between these.  
  • **Out of v1:** **Regulator-grade immutability**, **third-party audit repository**, **tamper-evident chains**, **direct portal schema mapping**, **Qiwa / Mudad APIs**.

• **Onboarding and migration**  
  • **PS playbook** to map **legacy custom fields** to **reference** dimensions.  
  • **Validation** reports for **gaps** and **inconsistent** legacy data.

• **In-product transparency**  
  • Clear labels: metrics are **customer-configured** against **their** legal obligations; product does **not** compute **government fines** or provide **legal advice**.

• **GTM artefacts**  
  • **Internal** language: **nationalisation / MOHRE-oriented** views = **Workaround** **elevated** by **reference** + **standard** reports (**DA30**); **not** a **native government-certified** quota engine.  
  • **Qiwa / Mudad** packaged recruiting connectors = **True Gap**; **document** strategy; **do not** ship in **v1**.  
  • **External / buyer-facing:** Include a **standard** **scope blurb** on collateral: **Recruiting-sourced** evidence **only** in **v1** unless **HCM addendum**; **not** a **substitute** for **full workforce** filings; **no** **government certification** of outputs; **portal** submissions remain **customer** responsibility with **True Gap** on packaged connectors.

### Scope boundaries (**not** in **v1**) — PM-approved

• **Not** **direct government portal integrations** (**Qiwa**, **Mudad** APIs) — separate roadmap item; higher complexity.  
• **Not** **advanced predictive analytics** or **AI-powered quota optimisation** — reporting first.  
• **Not** expansion to **EEOC**, **OFCCP**, or other **non-GCC** compliance domains — **GCC-focused v1**.  
• **Not** **mandatory** **custom field elimination** — **standard alternative** coexists with existing customer config.

### Experience principles alignment

**Empower (give users control)**  
• Recruiters and admins choose **which** programme groupings to enable and how mappings align to **their** policies; the product does **not** silently reclassify candidates.  
• **Outcome-focused:** produce **evidence on demand** for **standard** audits without **Excel** rebuild where packs are in scope.

**Trust (build their confidence)**  
• **Transparency** on **data source** for each column; **no** hidden logic implying **government** authority.  
• **Honest** copy: **Workaround** depth for **nationalisation / MOHRE** OOTB per **DA30**; **True Gap** for **Qiwa / Mudad** packaged connectors.

**Grow (enable them to change)**  
• **Incremental** migration from **custom fields** with **validation** reports showing progress.  
• **Versioned** report definitions so tenants can adopt updates without losing **historical** run records (per discovery).

**Principle validation**  
• [x] User stays in control (no automated **compliance verdicts**).  
• [x] Clear transparency on what the product does **not** certify.  
• [x] Target **self-service** iteration for **standard** config without **PS** for every tweak (validate in pilot).

---

## Critical user journey and use cases

• **Configure programme grouping** — Admin enables **UAE / KSA / Kuwait** (and extensions per roadmap); maps **legacy** fields where needed; system runs **validation** and surfaces **data gaps**.  
• **Produce compliance evidence (on-demand)** — Recruiter opens **compliance** dashboard or **report catalogue**, selects **programme** slice and **pack**, runs **manually**; system shows **in-product** view **plus** export with **run metadata**.  
• **Executive review** — Leader filters by **LOB** / **location**; drills per **security**.  
• **Audit preparation** — Compliance owner uses **standard** **pack** without **Excel** for **in-scope** scenarios; optional exports for **edge** cases.  
• **Sales / SC conversation** — Account team uses **approved** parity: **nationalisation / MOHRE** = **Workaround** (**DA30**); **Qiwa / Mudad** = **True Gap**; **PS + UAT** before **single-thread** claims.

---

## Compliance Considerations

This section reflects **Legal Advisor** input (**GCC-E2E-029**, Step 6a) and **Step 6b** PRD revision. **Customers** remain **controllers** (or determine lawful basis with Workday as **processor** where applicable); product and GTM language must not imply statutory certification.

### Personal data categories and retention

• **High-sensitivity categories:** **Nationality**, **nationalisation / programme** fields (e.g. Nitaqat, Emiratisation, Kuwaitisation classifications), and **derived** reporting views built from them are **special category** data under **GDPR Article 9** where EU/EEA individuals are in scope, and are treated as **sensitive personal data** under **GCC data protection laws** (e.g. **KSA PDPL**, **UAE PDPA**, and analogous regimes). **Purpose** and **minimisation** must be explicit in customer configuration and documentation.  
• **Run metadata and exports:** **On-demand** report **runs** surface **runner identity**, **timestamps**, **report definition version**, and **column lineage**; **exports** may replicate candidate- and application-level **personal data**. **Retention** for run history, export files, and **audit-oriented** artefacts must be **defined** (tenant-configurable or product-default per discovery) and **aligned** with **Workday retention** and **purge** behaviour for **Recruiting** objects so customers can meet **storage limitation** and **erasure** obligations. **Design commitment:** PRD **Solution elements** path **(A)** or **(B)** selects whether **v1** adds **no** new **row-level** run snapshots beyond **existing** Report Run History patterns, or **explicit** retention + **purge** hooks for any **new** stores; **Legal** and **Privacy** review **both** paths before pilot.  
• **Purge alignment:** When candidates or applications are **purged** or **anonymised** under **GDPR** or **tenant** policy, **report outputs** and **metadata** that still **identify** individuals should **not** outlive the **authoritative** record without a **documented** exception (e.g. **legal hold**). **v1** must **not** silently retain **stale** personal data in **run stores** or **exports** beyond agreed rules. If path **(A)** is chosen, **historical** point-in-time **evidence** may require **customer** **export-at-time-of-audit** discipline; copy and **GTM** must **not** over-promise **immutable** in-product snapshots.

### Lawful basis, transfers, telemetry, and GCC country coverage

• **Article 9 (EU/EEA):** Where **Article 9** data is processed, the **customer** must rely on an **appropriate** lawful basis (e.g. **explicit consent**, **employment / social protection** bases where **national law** permits, or **substantial public interest** where **Union or Member State law** provides). The product **supports** transparency and **access controls**; it **does not** choose the **legal** basis for the tenant. **v1** remains **non-AI** for quota logic; **EU AI Act** high-risk recruitment rules apply only if **future** **automated decision-making** or **ranking** is introduced (out of **v1** scope).  
• **Cross-border transfers:** **Multinational** tenants may combine **GCC** workforce data with **EU**, **UK**, or **other** **third-country** **processing**. **Standard Contractual Clauses**, **adequacy**, **DPA** terms, and **supplementary measures** may apply to **reporting** and **export** flows; **feature** design should **avoid** unnecessary **off-region** **copies** and should **document** where **run** and **export** data **reside**.  
• **Telemetry (if introduced):** Any **product telemetry** for **configuration time**, **Excel** bypass, or **usage** must follow **privacy-by-design**: **minimisation**, **clear purpose**, **retention caps**, and **contractual** alignment with **DPA** / **subprocessor** terms. **Do not** log **Article 9**-equivalent **field values** in **telemetry** without **explicit** **legal** and **privacy** sign-off.  
• **Per-country GCC confirmation:** **KSA** and **UAE** are the **primary** **v1** **reference** **slices**; **Kuwait** depth is **TBD** with **legal** and **field**. For **Qatar**, **Kuwait**, **Bahrain**, and **Oman**, **statutory** labels, **sensitivity** treatment, and **enablement** of **programme** **packs** require **explicit** **legal** / **privacy** **confirmation** before **marketing** or **default-on** **tenant** configuration (see **Open questions**).

### UI and product posture

• **Disclaimers:** Outputs support **internal evidence** and **management review**; they **do not** constitute **legal advice**, **government** **submission**, or **fine** **calculation**.  
• **Principles:** **Purpose limitation**, **data minimisation**, **transparency**, and **security** (including **DAP** / **role**-appropriate access to **sensitive** **reports**) apply throughout **v1**.

---

## UX designs for TBD release

• **GCC nationalisation reference setup** — Figma TBD (post-capture).  
• **Standard compliance dashboards and report catalogue** — Figma TBD (post-capture).

---

## Releases and production thresholds

• **Legal review:** Privacy and **sensitive** attribute handling; **UI** disclaimers; **DPIA** need **confirmation** with **Legal** / **Privacy** per **Open questions**; **pilot** **legal** / **privacy** **worksheet** before **design** **partner** **enrolment** where **Article 9** / **GCC** **sensitive** **processing** applies.  
• **Localisation:** **English** + **Arabic** for new surfaces where required; **Arabic / RTL** in **complex Workday Docs** remains a **separate** **workaround** track per **DA30** (do not conflate with reporting UI).  
• **Responsible AI:** Not in **v1**.  
• **v1 recap — In scope:** Manual **on-demand** reports, dashboards, export, run metadata, reference setup, PS playbook. **Out:** Portal **APIs**, immutable third-party audit logs, **scheduled** recurring runs (unless **CR**), **HCM** joins without **addendum**.

---

## Target delivery and major milestones

| **Milestone** | **Target date** |
|---------------|-----------------|
| PRD approval | TBD |
| Design brief complete (peer-reviewed) | TBD |
| Prototype (versioned route) | TBD |
| Copy and legal-sensitive string review | TBD |
| Figma capture | TBD |
| Design partner pilot (target **3** tenants) | TBD |
| GA | TBD |

---

## Open questions

• **Exact** **v1** **programme** catalogue (**KSA**, **UAE**, **Kuwait** depth) and **Arabic** string scope — confirm with **legal** and **field**.  
• **HCM addendum** timing for **post-hire** **quota** views — if required for **largest** **GCC** **accounts**, sequence relative to **Recruiting-only** **GA** (PRD now **requires** separate **commercial** commitment; **date** still TBD).  
• **Telemetry** instrumentation for **configuration time** and **Excel** bypass — **owner**, **privacy** review, and **non-logging** of **Article 9**-equivalent **values** unless **explicitly** approved (see **Compliance Considerations**).  
• **DPIA** — confirm with **Legal** / **Privacy** whether a **Data Protection Impact Assessment** (or **equivalent**) is **required** for **v1** given **scale** of **nationality** / **programme** **processing** and **run** / **export** **artefacts**; document **outcome** in **pilot** readiness.  
• **Legal / privacy worksheet for pilots** — **template** and **completion** **gate** for **design** **partner** tenants (lawful basis, **retention**, **transfers**, **subprocessors**, **Arabic** / **local** **disclosures**).  
• **Per-country enablement gating** — whether **Qatar**, **Kuwait**, **Bahrain**, and **Oman** **programme** **packs** ship **off** by default, **feature-flagged**, or **excluded** from **v1** until **legal** **sign-off**; alignment with **GTM** and **SC** **messaging**.  
• **Run retention path (A) vs (B)** — **final** engineering choice after **Report Run History** gap analysis; **purge** implementation details for path **(B)** if selected; **customer** **education** if path **(A)** limits **point-in-time** reconstruction.  
• **Named Security DAP SME** — replace **placeholder** in **Contacts** / **Handoff to design** with **assigned** name and **channel** once Security **nominates** owner (**Step 6d** leaves **routing** via **Recruiting Security** until then).

---

## Revision history

• **GCC-E2E-029 Step 6d (March 2026):** PRD revised after **Step 6c Red Team** review. **Added:** **Buyer / GTM** boundaries for **Recruiting-only** vs **full workforce** **Nitaqat / Emiratisation** expectations; **HCM addendum sequencing**; **60% configuration target** caveat (**reference catalogue** + **PS playbook**); **purge / retention** design paths **(A)** / **(B)** and **Report Run History** integration; **Data quality** subsection; **Appendix: Measurement definitions**; **DAP consult** requirement at **315** kickoff (**named SME** still via Security). **Updated:** **Open questions** and **Compliance** purge language.  
• **GCC-E2E-029 Step 6b (March 2026):** PRD revised after **Step 6a Legal Advisor** review. **Added:** **Personal data categories and retention**; **expanded** **Compliance Considerations** (**Article 9** lawful basis notes, **cross-border** **transfers**, **telemetry** **privacy**, **per-country** **GCC** **confirmation** for **Qatar** / **Kuwait** / **Bahrain** / **Oman**); **Open questions** for **DPIA** **confirmation**, **pilot** **legal** / **privacy** **worksheet**, **per-country** **enablement** **gating**, and **retention** / **purge** **behaviour**. **Unresolved** items remain in **Open questions** above.

---

## Resources

• **Epic** — TBD (EA), TBD (GA)  
• **PRD (markdown, canonical):** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
• **PMF thematic analysis:** `research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-029.md` (Theme 5; **Priority 1** recommendation **nationalisation and local workforce compliance reporting**)  
• **User research:** `research/GCC/105-user-research-findings.md`  
• **Competitive matrix:** `research/competitive/matrices/gcc-competitive-matrix.md` (**v1.21**, changelog **27 March 2026**)  
• **Competitive scan (baseline):** `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-029.md`  
• **Deployment Agent (primary classification):** thread **`b34163fb-aaca-4670-b74e-a06d6b4a08b0`** (**DA30**, **27 March 2026**). **Triangulate** with earlier threads per matrix **Key Threats**; **PS + UAT** before contested customer claims.  
• **Deployment Agent (PRD structure check, March 2026):** thread **`4ac05d8f-b083-456c-b3b6-71dcd22f0a24`** — confirms **no** natively delivered Nitaqat / Emiratisation report packs; **Report Writer**, **Trended Workers** / **BPT** sources, **questionnaires**, and **EIB / Studio** for complex extracts align with **Workaround** framing in this PRD.  
• **Supplementary CI brief (if used):** `research/competitive/gcc/e2e-ci-brief-gcc-nationalisation-local-compliance-reporting-2026-03-27-GCC-E2E-025.md` — use only as **supplement** to **matrix** + **scan** above.  
• **Experience principles:** `docs/experience-principles.md`  
• **JTBD:** `docs/jtbd-recruiting-hr-professional-and-manager.md`  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Recruiting |
| *TBD* | Engineering lead, Recruiting |
| *TBD* | Product design, Recruiting |
| *TBD* | HCM reporting / analytics alignment |
| **Security DAP consult (design brief kickoff)** | **Consulted** — **PM** schedules **Data Access Policy / domains** session with **Recruiting Security** (or **HCM Security** DAP SME per routing); **named individual** to be **nominated** by **Security leadership** and **recorded** in **MISSION_LOG** / this table **before** **315** **peer** **review** (**Open questions** if still unassigned). |
| *TBD* | Value consulting / GCC field |
| *TBD* | Legal partner (sensitive attributes) |

**Note:** **DAP** consult is **mandatory** at **design** **brief** **kickoff** (**315**); interim **RACI** **engineering** / **design** **TBDs** do **not** **waive** **Security** **consult**. **Named** **owners** **across** **RACI** **required** before **pilot** **kickoff**.

---

## Appendix: Measurement definitions (commercial and pilot KPIs)

**Purpose:** Operational definitions for **Executive Summary** and **Overview** metrics so **SC**, **field**, and **PM** count **blockers**, **progressed** pursuits, and **configuration** targets **consistently**.

• **Blocker (nationalisation reporting):** A **GCC enterprise opportunity** (active pursuit or qualified stage per source of truth below) where **account notes** or **deal review** explicitly record **nationalisation / local compliance reporting** (Nitaqat, Emiratisation, Kuwaitisation, or MOHRE-style evidence) as a condition that **delays** or **risks advancement** without a **product** or **packaged artefact** change. **Excludes** generic reporting asks with **no** nationalisation link unless reclassified by **PM** or **regional RC**.  
• **Progressed:** The **same opportunity identifier** moves forward at least **one** stage (for example to technical validation, proposal, or verbal commit) **after** the date nationalisation positioning or a deliverable (deck, brief, pilot commitment) was logged in the **CRM** or **account plan**. **Timestamp source:** CRM stage history **or** weekly deal review minutes (pick **one** as primary per quarter; document in pilot workbook).  
• **Pursuit / opportunity source of truth:** Single system of record agreed for **GCC-E2E-029** measurement (for example internal CRM opportunity object); no double-counting across regions or duplicate opportunities. **Owners:** PM and regional RC confirm field mapping before Q2 counting.  
• **Minimum pilot N (configuration and Excel KPIs):** At least **3** design partner tenants enrolled with signed data quality and legal readiness before first published **90%** / **60%** claims; fewer than 3 may report directional PS feedback only with **no** external percentage commitment.  
• **Minimum sample (deal / win-rate claims):** Do not publish win-rate or blocker conversion rates with **N < 10** completed pursuits in the denominator unless exec approval documents a confidence interval or equivalent caveat.  
• **60% configuration reduction:** Measurable only after the **reference report catalogue** and **PS playbook** are published; numerator = median setup time post-artefacts on a frozen standard slice; denominator = frozen baseline per pilot workbook.

---

Workday Confidential    1

-- 1 of 1 --

---

## Appendix: Competitive classification (GCC baseline, March 2026)

**Sources:** `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-029.md` (Feature Comparison); `research/competitive/matrices/gcc-competitive-matrix.md` (**v1.21**); Deployment Agent **DA30** thread **`b34163fb-aaca-4670-b74e-a06d6b4a08b0`**. **Triangulate** **DA20–DA30**; **PS + UAT** before **absolute** bake-off claims on contested rows.

| **Capability** | **Classification (DA30)** | **PRD implication** |
|----------------|-------------------------|---------------------|
| **MOHRE UAE labour reporting OOTB** | **Workaround** (custom reports) | **Elevate** dashboards + report packs with **honest Workaround** positioning; **no** “native OOTB MOHRE product” claim. |
| **Nationalisation / Saudisation / Emiratisation OOTB dashboards** | **Workaround** (custom reporting / analytics) | **Reference dimensions** + **standard reports / dashboards** + **PS patterns**. |
| **Native packaged Qiwa / Mudad recruiting connectors** | **True Gap** | **v1** **out** of scope; **document** integration **strategy** only. |
| **Configurable candidate grid** | **Native** | Continue **enterprise** strength in narrative. |

**Note:** **Candidate Skills Match** / **semantic AI** belong in **separate** artefacts; **do not** bundle into **nationalisation** **GTM**.
