# India Recruiting PMF Thematic Analysis

**Date:** 1 April 2026  
**Mission:** INDIA-PMF-003  
**Analyst:** @pmf-analyst (Braun & Clarke 6-phase protocol)  
**PM context:** New market entry. Focus areas: **Know Your Candidate (KYC)** (identity verification, Aadhaar-aware flows, background checks) and **High Volume Hiring (HVH)** (mass recruitment, campus-scale and walk-in-scale workflows).

**Strategic inputs consumed (Steps 1–3, no new PESTEL/SWOT research):**  
`research/India/strategy-context-2026-04-01-INDIA-PMF-003.md`, `research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-003.md`, `research/India/swot-analysis-India-2026-04-01-INDIA-PMF-003.md`

**Competitive inputs consumed (Step 4, @competitive-intel only):**  
`research/competitive/matrices/in-competitive-matrix.md` (changelog **2026-04-01 — INDIA-PMF-003**), `research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-003.md`

**108 Gap analysis:** Step 6 did **not** run (no gap data in pipeline).

---

## Executive Summary

• **KYC and HVH converge on industrial-scale trust:** Internal SMEs and Teleperformance India customers both treat **identity assurance, deduplication, and source-of-hire integrity** as economic and compliance risks, not back-office hygiene. Customers explicitly ask for **government-identifier-aware matching** (Aadhaar called out) while **PESTEL Legal** and product strategy require **voluntary, consent-based** handling of Aadhaar-style data, not coercive rails.

• **HVH pain is recruiter-day economics:** Agency-led intake at **thousands of profiles per day** makes **manual duplicate checks** and **per-profile review** unsustainable. **106** quantitative voice (**Mass Action Capabilities** less negative than peers) supports investing in **bulk-safe automation** alongside **HiredScore** activation.

• **Offer and BGC journeys break under India policy strictness:** **P5** evidence on **PAN, Aadhaar, UAN** gating, **OTP failures**, and **offer acceptance visibility** aligns with SME themes on **reinitiate**, **parallel checks**, and **India vs US** BGC flexibility. **SWOT** positions **native BGV framework** as a strength; **gap** is **UX depth** and **notification design**, not absence of integration.

• **Communications are a strategic tension:** **SME5** and **106** flag **marketing opt-in** vs **India volume**; **P5** prefers **email traceability** for compliance-sensitive steps while **PESTEL Social** stresses **WhatsApp norms**. **Q2 strategy** centres **GCC** for channel work; India needs **configurable channel and consent policy**, not a single global default.

• **Competitive honesty (101):** **True Gaps** remain on **native +91 SMS**, **native WhatsApp in core UI**, **native UIDAI Aadhaar eKYC**, and **OOTB direct Naukri-class multipost**. **Native** strengths: **UDMF**, **BGV BP/connectors**, **bulk grid**, **Hindi**, **DPDP-style** privacy levers. Roadmap recommendations below stay **capability-focused** and respect **Broadbean-first** board strategy and **partner** paths for government-grade ID.

---

## Methodology

**Framework:** Braun & Clarke (2006) six-phase thematic analysis, adapted for multi-source PMF triangulation (Braun & Clarke, 2006, *Qualitative Research in Psychology*).

**Phase 0 – Geographic scope:** No `research/India/raw-data/` CSVs for this mission. No global CSV filter applied.

**Phase 1 – Familiarisation:** Re-read **primary** `.txt` sources (not 105 markdown alone):

• **Internal SME transcripts (5):**  
`research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`  
`research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`  
`research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`  
`research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`  
`research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`

• **Customer transcripts (2):**  
`research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`  
`research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`

**Note:** Customer `.txt` files are word-per-line exports; Phase 1 used full file open plus cross-check against Step 8 structured findings for accurate quotation themes.

**Phase 2 – Initial coding:** Generated **62** semantic codes with source tags (sample codebook in Appendix).

**Phase 3 – Candidate themes:** Eight candidate clusters reduced to **five** robust themes.

**Phase 4 – Triangulation:** Matrix across **SME**, **Customer (P1–P5)**, and **Customer Ideation Hub (106)**. **108** absent.

**Phase 5 – Theme definitions:** Final names and PMF implications below.

**Phase 6 – Report:** This document, including RICE-scored recommendations (dual-dimension Impact per `rice-prioritisation` skill and India strategy-context rubric).

**Participant anonymization:** Customers **P1–P5**, Teleperformance India (company retained per workspace standards).

---

## 105 SME inputs (Step 7)

**Source:** `research/India/105-sme-research-findings.md`  
**Mission attestation:** INDIA-PMF-003, Fresh pass 2026-04-01.

**Role in analysis:** Triangulation lens for **multi-customer implementation** reality (Accenture scale, Genpact, Lowe's patterns, India deployments).

**Phase 1 transcript coverage (SME):** All **five** internal SME `.txt` files listed in Phase 1 were re-opened for this run. Content aligns with Step 7 synthesis (KYC/fraud, HVH, BGC depth, marketing opt-in, WhatsApp, offer compensation complexity).

---

## 105 Customer inputs (Step 8)

**Source:** `research/India/105-user-research-findings.md`  
**Mission attestation:** INDIA-PMF-003, Fresh pass 2026-04-01.

**Participants:** P1–P5, Teleperformance India (two transcript sessions).

**Phase 1 transcript coverage (Customer):** Both customer `.txt` files in `research/India/customer-transcripts/` were re-read in Phase 1 (format caveat above). Step 8 findings used for quote fidelity and theme cross-check.

---

## 106 inputs (Step 5)

**Source:** `research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md`

**Summary for triangulation:** P&T Idea Results Dashboard (**N ≈ 10,016** TA-filtered ideas; sentiment **-0.163**). **Theme validation matrix** links 105 themes to capabilities including **Candidates and Prospects**, **Candidate Job Application Flow**, **Communications and Notifications**, **Offers and Employment Agreements**, **Mass Action Capabilities**. **Pass 2** found **no India-tagged** net-new verbatims in the export; ideation **amplifies** 105 rather than replacing India-specific proof.

**Customer Ideation Hub (106) in matrix:** Third evidence column in Phase 4 table below.

---

## 101 Competitive Intelligence inputs (Step 4)

**Matrix:** `research/competitive/matrices/in-competitive-matrix.md` — changelog entry **2026-04-01 — INDIA-PMF-003** (DA thread `3ca8bc69-6c89-45fc-83bb-c5728ae19c40`, **DA-INDIA-PMF-003**).  
**Scan:** `research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-003.md`

The **Competitive Landscape** section is sourced from **@competitive-intel** outputs above; no separate web competitive research was performed for this report.

---

## Triangulation matrix (Phase 4)

| Theme | SME view | Customer view (P1–P5) | Customer Ideation Hub (106) | Convergence | Divergence | PMF impact |
|-------|----------|-------------------------|-----------------------------|-------------|------------|------------|
| **1. KYC: identity, dedupe, source integrity** | Fraud, impersonation, interview ID proof, Accenture dedupe limits, auditability | P2 Aadhaar in dedupe; P1 manual dup checks; P5 three-ID policy; source/agency economics | **Candidates and Prospects** / **Candidate Job Application Flow** high volume, negative sentiment and effort | **Strong** | SMEs discuss **BrightHire** / AI; customers focus on **rules + IDs** | **Highest** for India entry and DPDP trust narrative |
| **2. HVH: mass intake and automation** | Mass purge, bulk actions, 100k+ scale, resource-manager patterns | P2 agency volume maths; P4 700-applicant queues; P1 vendor approval | **Mass Action Capabilities** relatively less negative; **Agencies** hard workaround | **Strong** | SME **worksheets** adoption gaps less visible at TP | **High** for scale growth OKR row |
| **3. Offer, BGC, and gated compliance** | Reinitiate, India vs US gating, Tydy/middleware, two-offer docs | P5 OTP, DocuSign, drop-off; P4 offer regeneration | **Offers** very hard workaround; **Background Checks** on-theme | **Strong** | Customers quantify **drop-off**; SMEs emphasise **middleware** | **High** for compliance UX |
| **4. Comms, consent, notifications** | Marketing opt-in vs volume; WhatsApp ubiquitous | P5 email for audit; task noise; P2 Saturday maintenance | **Communications and Notifications** worst sentiment/effort | **Moderate** | **WhatsApp** strategy vs **email** compliance preference | **Medium–high**; policy and platform dependencies |
| **5. Fragmented workflows and analytics** | PSA/Extend, internal mobility | P3 email reqs; P4 Thrive/Excel SLAs; parse from Naukri | **Job Requisitions** high volume/friction; multi-location apply validation quotes | **Moderate** | Some **process** vs **product** boundary (supervisory org) | **Medium**; suite and reporting |

---

## Theme 1: KYC – identity, deduplication, and source integrity

**Description:** At India scale, **duplicate records** and **wrong source attribution** create **full-time manual roles**, **agency payment risk**, and **legal exposure** from impersonation. Government identifiers are **collected** but not always **driving** matching logic.

**Triangulation analysis:** SMEs (Bernie, Phillips, Lodola, Santosh) and customers (P1, P2, P5) **converge**. **106** reinforces **apply flow** and **candidate profile** as high-friction capability areas.

**Evidence strength:** **High** (all source types).

**High-intensity quotes (Customer):**

> "Duplication needs to get automated… validation needs to be on more parameters than just first name, phone numbers, and email address… like we have Aadhaar in India… if that duplication check is done on their Aadhaar number, we'll be able to identify that." (P2, Teleperformance India, paraphrased in 105 from transcript)

> "Government ID… we are accepting… at the application stage… for some reason it is not being used as a validation in duplication." (P2, via 105)

**Competitive note (@competitive-intel):** **UDMF** is **Native**; **native UIDAI Aadhaar eKYC** is **True Gap**; **Zoho** marketplace shows **Aadhaar/PAN** style extensions. Position **UDMF depth + partner** verification without claiming **government** eKYC in-product.

**PMF implication:** Invest in **configurable matching** and **identity signals** within **legal** guardrails (DPDP, voluntary Aadhaar use per PESTEL Legal).

**Supporting codes (sample):** `Gov-ID-Dedupe-Ask` [Customer,SME]; `Source-Lock-Agency` [Customer,SME]; `Impersonation-Risk` [SME]; `UDMF-Scale-Limit` [SME].

---

## Theme 2: HVH – mass intake, agency workflows, and bulk throughput

**Description:** **Agency-sourced** and **high-volume** pipelines require **automation** for duplicate disposition, **intake controls**, and **grid-scale** actions. Recruiters describe **all-day** manual review.

**Triangulation:** **Strong** SME + customer; **106** **Mass Action** relatively **less negative**, suggesting customers see bulk investment as **tractable**.

**Evidence strength:** **High**.

**Quote:**

> "We have about 300, 400 recruiting agencies… about 2,000, 3,000 profiles during the day where one recruiter… would only sit on Workday… it takes almost the entire day… no-brainer activity if it could be automated." (P2, via 105)

**Competitive note:** **greytHR**, **PeopleStrong**, **Darwinbox** market **high-volume** and **campus** narratives; Workday counters with **bulk grid** + **activated** **HiredScore** (SKU clarity).

**PMF implication:** Pair **bulk product patterns** with **AI activation** (Priority 2) for shortlist at scale.

**Supporting codes:** `Agency-Upload-Volume` [Customer]; `Bulk-Dispo-Need` [SME,Customer]; `Intake-Noise` [Customer]; `Mass-Purge` [SME].

---

## Theme 3: Offer, BGC, and gated compliance journeys

**Description:** **India** customers need **flexible yet auditable** BGC and offer steps: **reinitiate**, **parallel** checks, **compensation** changes after accept, and **clear** candidate-facing **ID** steps.

**Triangulation:** **Strong** across SME3, SME4, SME5 and P5, P4.

**Evidence strength:** **High** for leadership/confidential path; **medium** for generalisation beyond TP.

**Quote:**

> "Our policy is that you need to have all three IDs before an offer can be extended… it will not let you do that but it also doesn't mark it as mandatory… the candidate will upload one ID and then they're free to move forward… it will stop us to release the offer." (P5, via 105)

**PMF implication:** **First-class BGC reinitiate**, **vendor status readability**, and **mandatory-field UX** that survives **policy consumption** patterns.

**Supporting codes:** `Three-ID-Gap` [Customer]; `BGC-Reinitiate` [SME]; `Offer-Regen-Limit` [Customer,SME]; `OTP-Friction` [Customer].

---

## Theme 4: Communications, consent, and recruiter signal vs noise

**Description:** **Marketing** and **transactional** comms collide: **GDPR-style opt-in** hurts **India reach** (SME5); **P5** wants **email evidence** for sensitive steps; **task** volume drowns **offer accepted** signal.

**Triangulation:** **106** **Communications and Notifications** is **most negative** capability row, validating theme scale.

**Evidence strength:** **Medium–high**; **legal** validation required for any **opt-out** regional default.

**Strategic tension:** **Strategy** and **PESTEL Social** favour **messaging** innovation; **P5** and **DPDP** favour **traceable** channels for specific journeys. Flag for **configurable** policy.

**Supporting codes:** `Opt-In-Volume-Clash` [SME]; `Task-Noise` [Customer]; `Email-Audit-Preference` [Customer]; `WhatsApp-Norm` [SME,PESTEL].

---

## Theme 5: Fragmented workflows and recruiting analytics

**Description:** **Requisitions** and **approvals** live partly **outside** Workday; **SLAs** and **aging** live in **Excel** or **Thrive**; **sourcing** wants **parse/bulk** from **Naukri/LinkedIn**.

**Triangulation:** **Customer-heavy** (P3, P4); SMEs less central here.

**Evidence strength:** **Medium**.

**PMF implication:** **In-product approvals**, **pipeline health** reporting, and **partner** clarity for **sourcing** (avoid native board build; **Broadbean** validation per **010**).

**Supporting codes:** `Email-First-Req` [Customer]; `SLA-Outside-WD` [Customer]; `Parse-Channel-Friction` [Customer].

---

## Cross-theme insights (strategy, PESTEL, SWOT)

• **DPDP and labour formalisation (PESTEL Legal, Political):** Phased **DPDP Rules** and **labour code** commencement increase **auditability** demand. Themes **1, 3, 4** should be designed with **060**-aligned **consent**, **retention**, and **notice** patterns.

• **Economic and campus tailwinds (PESTEL Economic):** **IMARC** ATS growth and **campus** rebound support **HVH** investment (**Theme 2**) alongside **AI** (**Q2 Priority 2**).

• **SWOT strengths:** **UDMF**, **BGV framework**, **bulk grid**, **Hindi**, **privacy configuration** are **differentiators** when demos are **honest** about **True Gaps** (**SMS**, **WhatsApp**, **Aadhaar eKYC**, **direct Naukri multipost**).

• **SWOT threats:** **SAP/Oracle/iCIMS** **omnichannel** and **AI** narratives; **local suites** **INR** and **board** UX. Response is **activated HiredScore/Paradox**, **CPaaS runbooks**, **Broadbean** proof, not **overclaiming** native **Aadhaar**.

• **India regional row (strategy):** **8 customer wins**, **DPDP**, **local boards** align **Theme 1–3** with **Business Impact 3.0** candidates when tied to **sales unblockers**.

---

## Competitive Landscape (from @competitive-intel)

**Source:** `in-competitive-scan-2026-04-01-INDIA-PMF-003.md` and matrix changelog **INDIA-PMF-003**.

**Headline Workday classification (DA-INDIA-PMF-003):**

• **True Gap (native):** **+91 SMS**; **WhatsApp** in core Recruiting UI; **UIDAI Aadhaar eKYC**; **OOTB direct** multipost to **Naukri-class** boards without **multiposter/Studio**.  
• **Workaround:** **Broadbean-class** multiposter or **Studio** for boards; **CPaaS + Studio + BP** for **+91** with **DPDP** consent, logging, opt-out.  
• **Native:** **BGV** via **Job Application BP**, **Core Connector**, **Studio**; **UDMF**; **Hindi**; **bulk** grid; **DPDP-style** consent/retention/purge.

**Competitor pressure (scan):** **Zoho**, **PeopleStrong**, **HireCiel**, **Oracle Career Coach**, **iCIMS Frontline AI** on **SMS/WhatsApp**; **Keka**, **greytHR**, **Greenhouse**, **Workable** on **Naukri-class** posting productisation; **Darwinbox**, **Keka** on **AI** and **volume** stories; **SAP SmartRecruiters** embedded narrative **March 2026**.

**PMF takeaway:** India **PMF** wins require **honest gap language** plus **partner-led** closure (**Broadbean**, **BGV partners**, **CPaaS**, **Paradox**) and **native** investment in **UDMF**, **BGC UX**, **bulk**, and **privacy** depth.

---

## Product Roadmap Impact Summary

**Strategic context:** `strategy-context-2026-04-01-INDIA-PMF-003.md` — Q2 **Priority 2** AI matching, **Priority 3** core ATS parity, **India** row **scale growth** (8 wins, DPDP, local boards). **GCC** remains corporate **Priority 1**; India recommendations are **credible within portfolio**.

**RICE formula:** `(Reach × Composite Impact × Confidence%) / Effort` where **Composite Impact** = (**Business Impact** + **Customer Impact**) / 2 (0.25–3.0 scale each).

**Quality filter:** Recommendations are **product capabilities** only (no pure GTM or documentation items).

---

### Priority 1 recommendations (highest RICE, ordered by score)

**1. BGC reinitiate and latest vendor status surfacing**

**Recommendation:** Productise **one-click or guided BGC reinitiate** and show **latest vendor status** clearly on candidate/application for recruiters (reduce bespoke BP and integration forwards).

**Strategic alignment:** **Priority 3** parity and **India** KYC narrative; **SWOT** native BGV framework leverage.

**Customer evidence:** P5 escalation patterns; SME4 parallel checks and integration forwards.

**RICE breakdown:** Reach **4,000** recruiters/quarter; Business **2.0**; Customer **2.5**; **Composite 2.25**; Confidence **80%**; Effort **4** pm.

**RICE score:** **1,800**

**Success metric:** **Time to hire** (days from req approved to offer accepted), segmented India high-volume cohort; target directionally lower recruiter cycle time on BGC-hold candidates.

---

**2. Apply flow knock-out questions, required resume, and intake gating**

**Recommendation:** Strengthen **job application template** controls so recruiters can **require resume**, use **knock-out** questions, and reduce **unqualified volume** (aligns with P4 700-applicant pain).

**Strategic alignment:** **Priority 3** ATS parity; **106** career site / apply friction.

**Customer evidence:** P4 mandatory resume and filter asks.

**RICE breakdown:** Reach **4,500**; Business **2.0**; Customer **2.5**; **Composite 2.25**; Confidence **70%**; Effort **4** pm.

**RICE score:** **1,772**

**Success metric:** **Recruiter productivity** (applications reviewed per req per week) or proxy **qualified apply rate** where measured.

---

**3. Recruiter-targeted notifications for offer acceptance and key milestones**

**Recommendation:** **Contextual alerts** (req, candidate, milestone) instead of only generic **task** volume for offer accepted and comparable events.

**Strategic alignment:** **Priority 3**; reduces **NPS** drag at scale.

**Customer evidence:** P5 thousands of tasks; manual follow-up.

**RICE breakdown:** Reach **5,000**; Business **2.0**; Customer **2.5**; **Composite 2.25**; Confidence **75%**; Effort **5** pm.

**RICE score:** **1,688**

**Success metric:** **Time to hire** or **offer accept to complete hire** lag; reduce missed SLAs on acceptance handling.

---

**4. Mandatory government ID step UX (PAN, Aadhaar, UAN) with re-editable capture**

**Recommendation:** Align **candidate-facing** steps so **policy-mandated IDs** are **actually mandatory** and **re-accessible** for edit when policies consume fields; clear **validation** and **error** paths (incl. OTP reliability **handoffs** to platform ops where needed).

**Strategic alignment:** **India** row + **KYC**; **DPDP** lawful processing.

**Customer evidence:** P5 three-ID policy vs UX leak.

**RICE breakdown:** Reach **3,500**; Business **3.0**; Customer **3.0**; **Composite 3.0**; Confidence **75%**; Effort **5** pm.

**RICE score:** **1,575**

**Tension flag:** **Legal** review on **Aadhaar** optional vs mandatory framing (**PESTEL Legal**).

**Success metric:** **Candidate experience** completion rate for offer-stage ID steps; reduction in recruiter **chase** tickets.

---

**5. Bulk duplicate resolution and agency intake automation**

**Recommendation:** **Bulk** actions and **rules** for **agency-sourced** duplicates and disposition; reduce **per-upload** manual checkbox workflows.

**Strategic alignment:** **HVH** + **Priority 3** bulk narrative.

**Customer evidence:** P1, P2 agency scale.

**RICE breakdown:** Reach **4,000**; Business **2.5**; Customer **3.0**; **Composite 2.75**; Confidence **80%**; Effort **6** pm.

**RICE score:** **1,467**

**Success metric:** **Time to hire** or recruiter **hours per hire** for agency-sourced channel.

---

**6. HiredScore activation with unsupported attachment prevention at apply**

**Recommendation:** Block or convert **unsupported resume attachment types** at apply when **HiredScore** grading requires it (**106** verbatim case pattern); expand **activation** playbooks for India **HVH**.

**Strategic alignment:** **Priority 2** AI matching beta and activation OKR.

**Customer evidence:** **106** global ideation sample; **105** parser accuracy pain supports **attachment hygiene**.

**RICE breakdown:** Reach **2,500**; Business **3.0**; Customer **2.0**; **Composite 2.5**; Confidence **70%**; Effort **3** pm.

**RICE score:** **1,458**

**Success metric:** **Quality of hire** proxy via **interview-to-offer** conversion where grading is in use; or **screening time** reduction.

---

**7. Government-identifier signals in UDMF matching (configurable, legally reviewed)**

**Recommendation:** Extend **UDMF** / match rules to allow **customer-configured** use of **PAN, UAN**, and **consented** **Aadhaar**-class identifiers as **matching signals**, with **DPDP** and **Aadhaar Act** guardrails.

**Strategic alignment:** **India** **KYC** + **SWOT** UDMF strength reinforcement.

**Customer evidence:** P2 explicit Aadhaar dedupe ask; P1 source integrity.

**RICE breakdown:** Reach **5,000**; Business **3.0**; Customer **3.0**; **Composite 3.0**; Confidence **85%**; Effort **9** pm.

**RICE score:** **1,417**

**Tension flag:** **Business 3.0 / Customer 3.0**; **Effort** and **Legal** gate are high.

**Success metric:** **Duplicate rate** or **merge rate** post-deployment; **agency dispute** reduction (customer-reported).

---

### Priority 2 recommendations

**8. Region-aware marketing and nurturing consent defaults**

**Recommendation:** **Configurable** consent model for **candidate marketing** (e.g. opt-out stack with unsubscribe) for **non-EU/India** contexts with **Legal** sign-off; reduce **opt-in** starvation at volume.

**RICE:** Reach **6,000**; Composite **3.0**; Confidence **60%**; Effort **8** pm → **1,350**  
**Tension:** **Customer 3.0** vs **Legal** confidence **60%**.

**9. Recruiting pipeline health and SLA / aging reports**

**Recommendation:** Native **req and pipeline** aging, **SLA** views to reduce **Excel/Thrive** dependency for leadership.

**RICE:** Reach **4,000**; Composite **2.25**; Confidence **70%**; Effort **8** pm → **788**

**10. Candidate home attachment hub for variable BGC documents**

**Recommendation:** **Candidate-level** (and optional job-scoped) **document hub** for ad hoc **BGC** documents without BP proliferation (**Santosh** pattern).

**RICE:** Reach **4,000**; Composite **2.5**; Confidence **65%**; Effort **10** pm → **650**

**11. Career site / candidate profile change audit trail**

**Recommendation:** **Auditable** history when candidates change **name, address, phone** on career site (**Lodola** impersonation risk).

**RICE:** Reach **2,500**; Composite **2.5**; Confidence **70%**; Effort **7** pm → **625**

**12. Auto-disposition from do-not-hire / external exclusion lists**

**Recommendation:** **Rules** to auto-disposition from **customer-supplied DNH lists** beyond ex-employee only (**Phillips** Accenture pattern).

**RICE:** Reach **2,000**; Composite **2.25**; Confidence **70%**; Effort **6** pm → **525**

**13. Mass job application purge automation**

**Recommendation:** **Safe bulk purge** or mass withdraw for **application hygiene** at scale (**Phillips**).

**RICE:** Reach **2,000**; Composite **2.0**; Confidence **65%**; Effort **5** pm → **520**

**14. In-product hiring manager requisition approval**

**Recommendation:** Move **approval** chains **into Workday** to replace **email** routing (**P3, P4**).

**RICE:** Reach **3,500**; Composite **2.0**; Confidence **65%**; Effort **10** pm → **455**

**15. Offer compensation and start-date orchestration after acceptance**

**Recommendation:** **Governed** paths to **update compensation** and **start dates** post-accept without **manual legal letters** where possible (**P4, P5, SME4**).

**RICE:** Reach **3,000**; Composite **2.25**; Confidence **65%**; Effort **12** pm → **366**

---

## E2E Handoff: Research Recommendations

| # | Title | Action | Reach | Impact | Confidence | Effort | RICE Score |
|---|-------|--------|-------|--------|------------|--------|------------|
| 1 | BGC reinitiate and vendor status | Productise BGC reinitiate and surface latest vendor status for recruiters on candidate/application | 4,000 | 2.25 | 80% | 4 pm | 1,800 |
| 2 | Apply intake gating | Job application template controls: required resume, knock-out questions, reduce unqualified volume | 4,500 | 2.25 | 70% | 4 pm | 1,772 |
| 3 | Milestone notifications | Recruiter-targeted notifications for offer acceptance and key milestones beyond generic tasks | 5,000 | 2.25 | 75% | 5 pm | 1,688 |
| 4 | Mandatory government ID UX | Align PAN/Aadhaar/UAN steps as truly mandatory and re-editable with clear validation paths | 3,500 | 3.00 | 75% | 5 pm | 1,575 |
| 5 | Bulk agency duplicate automation | Bulk duplicate resolution and agency intake automation to replace all-day manual review | 4,000 | 2.75 | 80% | 6 pm | 1,467 |
| 6 | HiredScore attachment gating | Prevent unsupported resume types at apply when they break HiredScore grading; expand India activation playbooks | 2,500 | 2.50 | 70% | 3 pm | 1,458 |
| 7 | UDMF government-ID matching | Configurable UDMF use of PAN/UAN and consented Aadhaar-class signals under Legal guardrails | 5,000 | 3.00 | 85% | 9 pm | 1,417 |
| 8 | Region-aware marketing consent | Configurable marketing consent defaults (e.g. opt-out + unsubscribe) for India/non-EU with Legal sign-off | 6,000 | 3.00 | 60% | 8 pm | 1,350 |
| 9 | Pipeline SLA reports | Native recruiting pipeline health, SLA and aging reports to reduce Excel/Thrive dependency | 4,000 | 2.25 | 70% | 8 pm | 788 |
| 10 | Candidate attachment hub | Candidate-home style attachment area for variable BGC documents without BP proliferation | 4,000 | 2.50 | 65% | 10 pm | 650 |
| 11 | Profile change audit trail | Auditable history for career site/candidate profile changes to address impersonation risk | 2,500 | 2.50 | 70% | 7 pm | 625 |
| 12 | DNH auto-disposition | Auto-disposition from customer-supplied do-not-hire lists beyond ex-employee only | 2,000 | 2.25 | 70% | 6 pm | 525 |
| 13 | Mass application purge | Bulk purge or mass withdraw for application hygiene at very large scale | 2,000 | 2.00 | 65% | 5 pm | 520 |
| 14 | In-product req approval | Hiring manager and approval chain execution inside Workday instead of email-first routing | 3,500 | 2.00 | 65% | 10 pm | 455 |
| 15 | Offer and start-date orchestration | Governed update paths for compensation and start dates after offer acceptance | 3,000 | 2.25 | 65% | 12 pm | 366 |

*Impact column = Composite Impact (average of Business and Customer impact scores).*

---

## SME structured output (for 130 deck consumption)

**SME count:** 5 (Bernie, David Phillips, David Lodola, Fabiola Navarro, Santosh Gulia)

**Cross-SME headline bullets:**

• **KYC:** Know Your Candidate as banking-grade trust; fraud and impersonation at **100k+** monthly scale; interview-stage ID proof.  
• **HVH:** Mass actions, dedupe **two-at-a-time** limit vs **hundreds of thousands** of duplicates; mass purge; cohort starts.  
• **BGC:** Native depth perceived as light vs **Tydy**/middleware; upfront data capture; reinitiate **button** demand.  
• **Comms:** **Opt-in** email starves India reach; **WhatsApp** dominant; **Paradox** awareness.  
• **Offer:** India offer **compensation** complexity; start date churn vs **auto-complete hire**.

**Customer triangulation (P1–P5):** **Strong** on dedupe, Aadhaar signal, agency volume, offer/BGC UX; **tension** on email vs WhatsApp for compliance steps.

---

## Appendix

### A. Participant list (customers)

| ID | Role | Organisation |
|----|------|----------------|
| P1 | Recruitment lead (agent hiring) | Teleperformance India |
| P2 | Senior manager, frontline recruiting | Teleperformance India |
| P3 | Recruitment manager, specialised team | Teleperformance India |
| P4 | Recruitment manager, reqs and onboarding | Teleperformance India |
| P5 | Recruitment manager, leadership/confidential | Teleperformance India |

### B. Code book (abbreviated)

| Code | Sources | Freq band |
|------|---------|-----------|
| Gov-ID-Dedupe-Ask | C,S | High |
| Source-Lock-Agency | C,S | High |
| Agency-Upload-Volume | C | High |
| Bulk-Dispo-Need | C,S | High |
| UDMF-Scale-Limit | S | Med |
| Impersonation-Risk | S | Med |
| Three-ID-Gap | C | Med |
| BGC-Reinitiate | S | Med |
| Offer-Regen-Limit | C,S | Med |
| OTP-Friction | C | Med |
| Opt-In-Volume-Clash | S | Med |
| Task-Noise | C | Med |
| Email-Audit-Preference | C | Low |
| SLA-Outside-WD | C | Med |
| Email-First-Req | C | Med |
| Mass-Purge | S | Low |
| DNH-List | S | Low |
| Saturday-Maintenance | C | Low |
| Parser-Accuracy | C | Low |

*C = Customer, S = SME; Ideation = mapped via 106 capability rows in matrix.*

### C. Data sources index

• SME transcripts: 5 files (paths in Phase 1).  
• Customer transcripts: 2 files (paths in Phase 1).  
• `105-sme-research-findings.md`, `105-user-research-findings.md`  
• `2026-04-01-brainstorm-analysis.md` (106)  
• Strategy: `strategy-context-2026-04-01-INDIA-PMF-003.md`  
• PESTEL: `pestel-analysis-India-2026-04-01-INDIA-PMF-003.md`  
• SWOT: `swot-analysis-India-2026-04-01-INDIA-PMF-003.md`  
• CI: `in-competitive-matrix.md`, `in-competitive-scan-2026-04-01-INDIA-PMF-003.md`

---

## Compliance note

Roadmap items touching **Aadhaar**, **biometrics**, or **consent** defaults require **060** legal review before PRD or build commitment.

---

*End of report — INDIA-PMF-003 — @pmf-analyst report only (no PowerPoint). Hand off to **130** for `India_Recruiting_PMF_Roadmap_vN.pptx` when required.*
