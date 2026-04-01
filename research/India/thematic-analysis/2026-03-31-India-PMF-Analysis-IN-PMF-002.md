# India PMF Thematic Analysis (Braun & Clarke)

**Mission:** IN-PMF-002 – India Market Entry PMF Research  
**Date:** 31 March 2026  
**Region:** India  
**Mission themes:** High-volume hiring; Know Your Candidate (fraud prevention, identity, BGV)  
**Output for:** Step 10 (060 legal review), Step 11 (130 PMF deck)

---

## Executive Summary

India PMF for IN-PMF-002 is dominated by **scale economics**: small product gaps become **full-time roles** when hire counts reach **hundreds per week** and **thousands per month** (Teleperformance India, P4–P5). **Know Your Candidate** is not an abstract compliance label; it is the **joining point of identity proof, duplicate detection, agency economics, and DPDP-era data minimisation**. Internal SMEs and customer interviews **converge** on **impersonation risk**, **resume/application fraud**, **weak duplicate signalling**, **India-specific offer and BGC flexibility**, and **document capture at multiple funnel stages**. Competitive intelligence (**matrix v1.7**, scan 31 March 2026) classifies **native +91 SMS**, **native WhatsApp core UI**, and **native UIDAI Aadhaar eKYC** as **True Gaps**, while **BGV business process + connectors**, **UDMF**, **bulk grid**, and **configurable consent / retention / purge** are **Native** (customer programme design with **060**, not certification).

**Strategic read:** `strategy-context-2026-03-31-IN-PMF-002.md` ties India to **scale growth**, **DPDP**, **local job boards**, and **8 target wins**; RICE **Business Impact** should favour items that unblock those outcomes. **PESTEL Legal** (DPDP phased rules, Aadhaar ecosystem, BGV vendor chains) and **SWOT** (suite + UDMF + BGV framework **vs** omnichannel and Naukri UX gaps) frame **cross-theme** trade-offs: **velocity** and **trust** must be designed together.

**Top product implications:** (1) Treat **dedupe + source-of-hire** as one India capability with **legal review** on use of government identifiers. (2) Ship **DPDP-aligned** BGV **consent granularity**, **retention / deletion evidence**, and **sub-processor transparency** alongside native BGV framework. (3) **Harden** configurable **KYC steps** so policy **mandatory** IDs match **UX**, **editability**, and **notification** behaviour. (4) **Reduce Extend snowflakes** for India **mass offer / start-date / BGC reinitiate** patterns. (5) **Honest** competitive story: **partner-mediated** Aadhaar, **Broadbean-class or Studio** Naukri, **CPaaS** + roadmap for **+91 / WhatsApp** per matrix.

---

## Methodology

**Framework:** Braun & Clarke (2006) six-phase thematic analysis, adapted for PMF and multi-source triangulation.

| Phase | Activity (this run) |
|-------|----------------------|
| **0** | Geographic scope fixed to India; no global CSV filter required. |
| **1** | Familiarisation: re-read **all** listed SME and customer `.txt` transcripts plus Steps 1–4 and 7–8 artefacts (see input sections). |
| **2** | Initial coding: PM-friendly shorthand codes with source tags **[SME]**, **[Customer]**, **[Strategy]**, **[PESTEL]**, **[SWOT]**, **[CI]** (no 106/108 this mission). |
| **3** | Theme generation: clustered codes into candidate themes. |
| **4** | Theme review: **SME + Customer** triangulation matrix (106/108 **not used**). |
| **5** | Theme definition: named themes with PMF implications and evidence strength. |
| **6** | Report: competitive landscape from **101** outputs only; roadmap impact with **dual-dimension RICE** per `strategy-context-2026-03-31-IN-PMF-002.md` and `~/.cursor/skills-cursor/rice-prioritisation/SKILL.md`. |

**Participant anonymization:** Customer participants **P1–P5**, **Teleperformance India**, roles preserved per style guide. Internal SMEs named as in source notes.

---

## Strategic Context inputs (Steps 1–3)

| Artefact | Path |
|----------|------|
| Strategy Context | `research/India/strategy-context-2026-03-31-IN-PMF-002.md` |
| PESTEL Analysis | `research/India/pestel-analysis-India-2026-03-31-IN-PMF-002.md` |
| SWOT Analysis | `research/India/swot-analysis-India-2026-03-31-IN-PMF-002.md` |

**Extracts used in scoring and themes**

• **India row:** scale growth; **DPDP compliance**; **local job boards**; **8 customer wins** (strategy context).  
• **RICE Business Impact guidance:** **3.0** when advancing India scale, DPDP readiness, or high-volume / KYC deal blockers; **0.5** for Q2-explicit non-priorities (e.g. career site redesign).  
• **PESTEL Legal:** DPDP Rules **phased** programme; **unbundled** BGV consent; **retention / deletion**; **cross-border** risk after full transfer rules; **Aadhaar** proportionate, **partner** / customer UIDAI compliance.  
• **PESTEL Social / Technological:** mobile-primary behaviour; **fraud / scam** salience; **AI** governance signals for **human oversight** on screening.  
• **SWOT:** **Strengths** – suite, UDMF, BGV BP, configurable privacy; **Weaknesses** – +91 SMS, WhatsApp, Naukri direct multipost, native Aadhaar; **Opportunities** – DPDP implementation budgets, GCC / fresher volume; **Threats** – India-first bundles, SAP / Oracle AI narratives, regulatory uncertainty.

---

## 105 SME inputs (Step 7)

**File:** `research/India/105-sme-research-findings.md`  
**Mission attestation:** IN-PMF-002, 31 March 2026.

### Phase 1 SME transcript coverage (confirm re-read)

All **five** internal SME sources were re-read for this report (not substituted by 105 markdown alone):

1. `research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`  
2. `research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`  
3. `research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`  
4. `research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`  
5. `research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`

---

## 105 Customer inputs (Step 8)

**File:** `research/India/105-user-research-findings.md`  
**Mission attestation:** IN-PMF-002, 31 March 2026.

### Phase 1 customer transcript coverage (confirm re-read)

Both customer session transcripts were re-read for this report:

1. `research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`  
2. `research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`

**Roster:** P1–P3 (specialist / confidential recruitment managers), P4–P5 (high-volume recruitment lead and frontline hiring manager), **Teleperformance India**.

---

## Competitive Intelligence inputs (Step 4)

| Artefact | Path |
|----------|------|
| India competitive matrix | `research/competitive/matrices/in-competitive-matrix.md` (**v1.7**, changelog **31 March 2026**) |
| Point-in-time scan | `research/competitive/in/in-competitive-scan-2026-03-31-IN-PMF-002.md` |

**106 / 108:** No brainstorm or gap-data sources for this run; **not** triangulated.

---

## Competitive Landscape (from Step 4 only)

*Sourced from matrix v1.7 and scan 2026-03-31-IN-PMF-002; no additional web research performed for this section.*

### Native (India-relevant, high volume + KYC)

• **BGV orchestration:** Job Application BP + Core Connector + Studio for non-standard vendors (**DA-IN-PMF-002-31Mar**, thread `9ef83319-6d4d-476e-a14e-118eff9e92f5`).  
• **UDMF** duplicate framework.  
• **Bulk grid / high-volume** recruiter actions.  
• **DPDP-style** configurable **consent, retention, purge** (programme with customer Legal, **060**).  
• **Hindi** language pack; **baseline** skills matching (**advanced** semantic tied to **Workday AI / HiredScore** SKUs per matrix).

### Workaround

• **India job boards (Naukri-class):** **Broadbean-class** multipartner = **leading practice**; **Workday Studio** custom integration possible where PS scopes (**no** OOTB native direct multipost).  
• **+91 SMS:** CPaaS / integration paths; **PS validation**; matrix notes **DA conflict** on native +91 elsewhere (**do not** flip battle cards without reconciliation).  
• **Mobile recruiter:** partial parity vs desktop (per prior DA summaries in matrix).  
• **Paradox-grade** conversational scheduling: partner / licence where required.

### True Gap (RFP-sensitive)

• **Native Workday Messaging SMS to +91** (per **DA-IN-PMF-002-31Mar**).  
• **Native WhatsApp** in **core** Recruiting UI.  
• **Native UIDAI Aadhaar eKYC** in-product; competitors show **marketplace / vendor** patterns (e.g. Zoho apps, SpringVerify narratives in scan).  
• **OOTB native direct** Naukri-class multipost (vs multiposter / Studio).  
• **Full** semantic AI without **Workday AI / HiredScore** activation.

### Focus: high volume + Know Your Candidate

**Volume:** Competitors (**Darwinbox**, **PeopleStrong**, **greytHR**, etc.) market **AI screening** and **multipost**; Workday counters with **bulk operations**, **suite + security**, and **governed** AI (**HiredScore**) when licensed.  
**KYC / fraud:** Workday’s **honest** story is **UDMF + BGV framework + named partners** (SpringVerify, AuthBridge, First Advantage, etc.); **not** native government Aadhaar rails. **DPDP** and **fraud / deepfake** press (scan) raise the bar for **transparency**, **consent**, and **audit**.

---

## Phase 2: Initial codes (selected)

| Code | Sources | Example anchor |
|------|---------|----------------|
| KYC-Resume-Fraud-Scale | [SME] [PESTEL] | Bernie notes: order-of-magnitude resume fraud; Accenture stress |
| Impersonation-Interview | [SME] [Customer] | Lodola impersonation; P3/P5 ID validation; Santosh fake interviewee |
| UDMF-Dedupe-Agency-Source | [Customer] [SME] | P5 first-source vs last-approved; Phillips 200k apps / merge limit |
| India-Offer-Comp-Complexity | [SME] | Fabiola: tables, two documents, calc fields; “every India project” |
| BGC-Flex-Reinitiate | [SME] | Fabiola “easy button”; India forward before all statuses vs US |
| Doc-Volume-Review-Step-Sprawl | [SME] | Fabiola pay stubs / passport photo; Santosh review-document awkwardness |
| Pre-Interview-ID-Capture | [SME] | Santosh ID before interview for verifier |
| Mass-Clicks-Offers-Cohorts | [SME] | Lodola 100–200 reqs; mass offers; worksheet gap |
| Career-Site-PII-Audit-Gap | [SME] | Lodola untracked name/address/phone changes |
| DNH-Auto-Disposition | [SME] | Phillips Do Not Hire |
| Gov-ID-OTP-Gating | [Customer] [PESTEL] | P3 three IDs / soft mandatory; OTP failures; DPDP minimisation |
| Vendor-Upload-Manual-Scale | [Customer] | P5 thousands of profiles / site FTE |
| High-Volume-Apply-Flood | [Customer] | P4–P5 application volume; no knockout |
| Marketing-Opt-In-India-Friction | [SME] | Santosh GDPR opt-in vs India volume |
| WhatsApp-Channel-Expectation | [SME] [CI] | Santosh pervasive WhatsApp; matrix True Gap native |
| Naukri-Multipost-UX | [CI] [Strategy] | Matrix True Gap OOTB; Workable / greytHR benchmarks |
| Partner-Aadhaar-Not-Native | [CI] [PESTEL] | DA + Legal minimisation |

---

## Phase 3–4: Thematic map and triangulation

### Triangulation matrix (SME + Customer only)

| Theme | SME view | Customer view | Convergence | Divergence | PMF impact |
|-------|----------|---------------|-------------|------------|------------|
| **T1 Identity, impersonation, and interview trust** | Strong: Lodola impersonation; Santosh fake interview; Phillips ID validation; Bernie KYC framing | P3/P5 need **reliable** ID and interviewee match; OTP issues | **High** | SMEs add **career site** tampering (Lodola); customers emphasise **task / notification** UX | Core **Know Your Candidate** narrative; legal sensitivity on **biometric** language |
| **T2 Application fraud, duplicates, and agency economics** | Phillips fraud/trickery, merge limits, DNH; Bernie scale | P4/P5 **manual** dedupe; **last upload wins** vs contracts | **High** | SME **AI** pattern detection aspirational; customer **Aadhaar dedupe** explicit | **Deal blocker** for BPO / agency-heavy India; ties to **UDMF** roadmap |
| **T3 India offer, BGC timing, and post-hire change** | Fabiola: two docs, auto-hire, BGC after hire, reinitiate | P5 regenerate offer limits; **legal letters** outside Workday | **Medium–High** | Customer **quantifies** drop-off; SME **Lowe’s** depth | Differentiator vs **US-centric** rigid templates if productised safely |
| **T4 Document capture, stages, and candidate home** | Santosh **attachment box**; Fabiola questionnaire / review doc | P3 fields disappear after policy; chasing IDs | **High** | SME **opt-in email** tangent (India volume) less present in TP set | Drives **CX** and **DPDP** minimisation discussions together |
| **T5 Industrial mass operations** | Lodola mass offers; Phillips purge; Bernie volume | P4–P5 peak hiring; **maintenance window** vs six-day week | **Medium** | SME **PSA / internal mobility** (Genpact) not TP focus | **Scale growth** pillar; worksheets / bulk extensions |
| **T6 Channels: SMS, WhatsApp, notifications** | Santosh WhatsApp **preferred**; opt-in volume math | P3 wants **contextual** offer alerts; generic task emails | **Medium** | **CI** confirms **True Gap** native | **RFP risk** vs local suites; partner + roadmap story |

**Triangulation status:** **Strong convergence** on **T1–T2** and **T4**; **T3** and **T6** need **configurable** India patterns and **060** on **consent / evidence**.

---

## Phase 5: Defined themes (PMF)

### Theme 1: Know Your Candidate – identity, impersonation, and audit surfaces

**Description:** India programmes face **impersonation** and **credential fraud**; employers want **identity assurance before interview**, **stable profile data** through BGV, and **auditable** change history.  
**PMF implication:** Pair **UDMF + BGV** with **career site / profile change** audit (Lodola) and **interviewer-facing** confirmations (Santosh). **Aadhaar** remains **partner-mediated** with **DPDP** minimisation (**PESTEL Legal**).  
**Evidence strength:** **Strong** (multiple SMEs + P3/P5).  
**Triangulation:** **Converged**.

### Theme 2: Duplicate detection and source integrity at agency scale

**Description:** High-volume agency models break when **duplicates** slip through and **source attribution** does not match **commercial** rules (**first source**, cooling-off).  
**PMF implication:** **Single initiative** for **matching rules**, **bulk vendor ingestion**, and **disposition automation**; explore **government identifier** matching only with **060** (storage, consent, purpose).  
**Evidence strength:** **Strong** (P4/P5 + Phillips).  
**Triangulation:** **Converged**.

### Theme 3: India-specific offer and BGC orchestration (velocity + compliance)

**Description:** India implementations favour **forward motion** (hire, start date) with **parallel** or **late** BGC completion; customers need **reinitiate**, **rollback**, and **offer revision** without **Extend** for every programme.  
**PMF implication:** First-class **operator UX** for **BGC re-run** and **cohort** date changes; align with **contractual** client requirements (Fabiola).  
**Evidence strength:** **Strong** on SME side; **medium** on customer (offer regeneration limits).  
**Triangulation:** **Converged** with gap on **product depth**.

### Theme 4: Document volume, funnel stages, and candidate task UX

**Description:** Non-standard documents and **pre-BGC** requests collide with **review document** sprawl; candidates drop out when **OTP** or **task** UX fails (**P3**).  
**PMF implication:** **Structured** document requests; **candidate home** attachment strategy (Santosh roadmap alignment); **hard/soft gating** that matches **policy** and **editability**.  
**Evidence strength:** **Strong**.  
**Triangulation:** **Converged**.

### Theme 5: Mass operations and workforce / demand integration (segment-specific)

**Description:** **Genpact-style** talent supply chain needs **mass** actions and **PSA** linkage; **Accenture-scale** needs **purge**, **DNH**, **multi-merge**.  
**PMF implication:** Segment **plays** for **services** India (internal + external) vs **BPO** agency **plays**; both under **scale growth**.  
**Evidence strength:** **Strong** SME; customer sample **narrow**.  
**Triangulation:** **Partial** (SME-led).

### Theme 6: Omnichannel reality vs native channel gaps

**Description:** **WhatsApp** and **SMS** are **default** expectations; matrix lists **True Gaps** for **native +91** and **WhatsApp**; marketing **opt-in** model hurts **reach** (Santosh).  
**PMF implication:** **Roadmap** + **CPaaS** + **Paradox** where licensed; **regional** comms consent model **configurable** for India vs EU.  
**Evidence strength:** **Strong** [SME]+[CI]; customer **medium**.  
**Triangulation:** **Converged** on importance; **divergence** on **Workday delivery** timing.

---

## Cross-theme insights (SWOT-informed)

• **Velocity without trust fails:** Auto-hire and **high** forward motion (**Fabiola**) amplify **fraud** and **impersonation** risk unless **identity** and **profile integrity** are addressed (**Lodola**, **P5**).  
• **DPDP makes “collect everything” expensive:** BGV chains need **purpose-limited** consent and **deletion evidence** (**PESTEL**); conflicts with **attachment sprawl** unless **taxonomy** and **retention** are designed (**Fabiola**, **Santosh**).  
• **Competitive honesty wins deals:** **Native Aadhaar** and **in-product Naukri** are **True Gaps**; **Broadbean + partners** and **Studio** must be **presales-scoped** with **PS** (**matrix**, **scan**).  
• **AI matching:** **HiredScore / Workday AI** aligns with **Q2 Priority 2** but must ship with **human oversight** narrative (**PESTEL Technological**, EU **AI Act** deployer context for multinationals).

---

## Product Roadmap Impact Summary (RICE, dual-dimension Impact)

**Strategic context for scoring:** `research/India/strategy-context-2026-03-31-IN-PMF-002.md` (India row: **DPDP**, **local boards**, **8 wins**; global priorities: **AI matching**, **core ATS parity**).  
**Formula:** Composite Impact = (Business Impact + Customer Impact) / 2; RICE = (Reach × Composite Impact × Confidence) / Effort.

### Priority 1 (highest RICE × India alignment)

**1. Government-ID-aware duplicate matching and agency source-of-hire integrity**  
**Action:** Extend **UDMF** matching and dispositioning for **India agency models**: configurable **first-touch / cooling-off** rules, **bulk** vendor upload handling, **audit** of source changes; **pilot** use of **PAN / UAN / masked Aadhaar** fields only after **060** data minimisation review.  
**Strategic alignment:** Business **3.0** (India scale + KYC blocker); Customer **3.0** (P5 explicit). **Composite 3.0.**  
**Reach:** 6,000 recruiter workflows / quarter (India enterprise + GCC India hiring proxy). **Confidence:** 72%. **Effort:** 10 pm.  
**RICE:** (6,000 × 3.0 × 0.72) / 10 = **1,296**  
**Strategic tension:** None flagged (Business ≈ Customer).

**2. DPDP-aligned BGV programme templates (consent, retention, deletion, sub-processors)**  
**Action:** Productise **granular** BGV **notices and consent** by check type, **retention schedules** and **evidence of deletion** for BGV artefacts, **sub-processor** transparency hooks; align with configurable purge (**matrix Native**).  
**Business 3.0**; **Customer 2.5** (indirect TP; strong **PESTEL** / India row). **Composite 2.75.**  
**Reach:** 8,000. **Confidence:** 70%. **Effort:** 6 pm.  
**RICE:** (8,000 × 2.75 × 0.70) / 6 ≈ **2,567**

**3. India KYC / offer-step gating, task clarity, and OTP failure playbooks**  
**Action:** Align **mandatory** government ID steps with **UI gating**, **post-step editability**, and **recruiter / candidate notifications** with **req + candidate context**; partner with support for **OTP** delivery diagnostics.  
**Business 3.0**; **Customer 3.0** (P3 friction, dropout estimate). **Composite 3.0.**  
**Reach:** 5,000. **Confidence:** 78%. **Effort:** 5 pm.  
**RICE:** (5,000 × 3.0 × 0.78) / 5 = **2,340**

**4. First-class BGC reinitiate and backward / parallel stage handling (India presets)**  
**Action:** Reduce **Extend** by shipping **operator** actions for **reinitiate**, **parallel** checks, and **readable** last-status for **ASR**-async outcomes (**Fabiola**).  
**Business 2.5**; **Customer 2.25** (indirect). **Composite 2.375.**  
**Reach:** 6,000. **Confidence:** 76%. **Effort:** 4 pm.  
**RICE:** (6,000 × 2.375 × 0.76) / 4 ≈ **2,708**

**5. HiredScore / Workday AI activation package for India high-volume shortlisting**  
**Action:** **Governed** activation playbook (human review, logging, customer comms); tie to **Priority 2** OKR narrative; **not** a substitute for **UDMF** fixes.  
**Business 3.0** (global AI priority + India volume); **Customer 2.5** (efficiency, not sole TP top quote). **Composite 2.75.**  
**Reach:** 4,000. **Confidence:** 65%. **Effort:** 4 pm.  
**RICE:** (4,000 × 2.75 × 0.65) / 4 = **1,788**

### Priority 2

**6. Mass offer, cohort start-date, and controlled post-hire amendment patterns**  
**Business 2.5**; **Customer 2.5** (P5 legal letters). **Composite 2.5.** Reach 5,000; Conf 70%; Effort 8 pm → **RICE ≈ 1,094**

**7. Candidate document hub (multi-stage, non-standard attachments) + fewer review-document chains**  
**Business 2.0**; **Customer 2.5**. **Composite 2.25.** Reach 7,000; Conf 65%; Effort 7 pm → **RICE ≈ 1,463**

**8. Do Not Hire auto-disposition and merge >2 duplicate records (Accenture-scale pattern)**  
**Business 3.0**; **Customer 2.0** (not TP headline). **Composite 2.5.** Reach 3,000; Conf 70%; Effort 5 pm → **RICE = 1,050**

**9. India sales / PS kit: Naukri multipost (Broadbean validate + Studio scope) and Aadhaar partner path**  
**Business 3.0** (local boards row); **Customer 2.0**. **Composite 2.5.** Reach 5,000 (PS + sales touches); Conf 85%; Effort 2 pm → **RICE ≈ 5,313**  
*Note: high RICE reflects **low effort** enablement; still **Priority 2** if product eng stays on items 1–5.*

**10. Native +91 SMS and WhatsApp core UI roadmap / CPaaS interim**  
**Business 2.5**; **Customer 3.0** (channel reliability). **Composite 2.75.** Reach 10,000; Conf 55%; Effort 12 pm → **RICE ≈ 1,260**  
**Strategic tension:** **Customer 3.0** vs **uncertain** delivery (**Confidence** suppressed).

**11. Regional marketing comms model: configurable opt-out default for India (vs GDPR opt-in)**  
**Business 2.0** (India reach); **Customer 2.0** (indirect; **Santosh**). **Composite 2.0.** Reach 6,000; Conf 60%; Effort 5 pm → **RICE = 1,440**

**12. Career site / candidate profile change audit trail and impersonation hardening**  
**Business 2.5**; **Customer 2.0**. **Composite 2.25.** Reach 4,000; Conf 65%; Effort 6 pm → **RICE ≈ 975**

**13. High-volume apply path: screening questions, mandatory resume, bulk reviewer tools**  
**Business 2.5**; **Customer 2.75**. **Composite 2.625.** Reach 5,500; Conf 72%; Effort 6 pm → **RICE ≈ 1,733**

---

## E2E Handoff: Research Recommendations

| # | Title | Action | Reach | Impact (Composite) | Confidence | Effort (pm) | RICE Score | Legal / compliance (060) |
|---|-------|--------|-------|--------------------|------------|-------------|------------|----------------------------|
| 1 | Government-ID-aware dedupe + agency source integrity | Extend UDMF matching, cooling-off / first-source rules, bulk vendor flows; PAN/UAN/masked Aadhaar only with Legal minimisation review | 6,000 | 3.0 | 72% | 10 | 1,296 | **DPDP** purpose limitation, consent, storage; **Aadhaar** handling; vendor contracts |
| 2 | DPDP-aligned BGV consent and retention programme | Granular consent by check type; retention/deletion evidence; sub-processor transparency; align purge to BGV artefacts | 8,000 | 2.75 | 70% | 6 | 2,567 | **DPDP** core; **cross-border** processors; **DPIA**-likely for high-risk processing |
| 3 | India KYC / offer gating + notification UX | Match UI gating to policy; fix post-step edits; contextual offer/task notifications; OTP support diagnostics | 5,000 | 3.0 | 78% | 5 | 2,340 | **DPDP** notices/consent; **Aadhaar** OTP flows; candidate transparency |
| 4 | BGC reinitiate and parallel / async status handling | Operator actions for re-run; clearer async status; reduce Extend for India BGC | 6,000 | 2.375 | 76% | 4 | 2,708 | Vendor **DPA**; audit logs; human oversight for adverse action |
| 5 | HiredScore / Workday AI activation (governed) | Activation playbook, logging, human review; India high-volume use cases | 4,000 | 2.75 | 65% | 4 | 1,788 | **EU AI Act** high-risk employment AI; **DPDP** + **Art. 22**-style fairness for MNCs; disclosures |
| 6 | Mass offer + cohort start-date + post-hire amendment | Product patterns for batch dates, controlled offer revisions; reduce manual legal letters | 5,000 | 2.5 | 70% | 8 | 1,094 | Employment law / **Industrial Relations Code** change management (customer counsel); document retention |
| 7 | Candidate document hub + staged requests | Candidate-home attachment strategy; fewer sequential review-document steps | 7,000 | 2.25 | 65% | 7 | 1,463 | **DPDP** minimisation; sensitive attachment policy |
| 8 | DNH auto-disposition + merge >2 duplicates | Auto-disposition against DNH; improve multi-merge for extreme duplicate churn | 3,000 | 2.5 | 70% | 5 | 1,050 | Fair processing; **India** defamation / labour context via customer Legal |
| 9 | Naukri / Aadhaar presales kit (Broadbean + Studio + partners) | Validate boards per deal; Studio scoping; partner Aadhaar path; **no** native board build | 5,000 | 2.5 | 85% | 2 | 5,313 | Honest **DPDP** marketing; no over-claim on UIDAI |
| 10 | +91 SMS + WhatsApp native roadmap + CPaaS interim | Roadmap alignment; validated CPaaS patterns; Paradox where licensed | 10,000 | 2.75 | 55% | 12 | 1,260 | **DPDP** comms consent; **TCPA**-class patterns global; vendor DPAs |
| 11 | India marketing comms: configurable opt-out default | Region-specific consent model vs strict opt-in; unsubscribe on each mail | 6,000 | 2.0 | 60% | 5 | 1,440 | **DPDP** vs **GDPR** tension; **060** required |
| 12 | Career site profile change audit | Tamper-evident PII changes; fraud hardening per Lodola theme | 4,000 | 2.25 | 65% | 6 | 975 | **DPDP** security and accountability |
| 13 | High-volume apply screening + bulk review tools | Knockout questions; mandatory resume; bulk disposition for large queues | 5,500 | 2.625 | 72% | 6 | 1,733 | **EU AI Act** if knockout is automated scoring; fairness review |

---

## SME Structured Output (130 deck consumption)

**Section 8a – Internal SME synthesis (India, IN-PMF-002)**

• **SME coverage:** 5 transcripts (Product VP, Field Readiness, Global Services, India Enterprise Architect, Accenture SCE).  
• **Convergent themes for slides:**  
  – **KYC / fraud / impersonation** (Bernie, Lodola, Phillips, Santosh).  
  – **Industrial scale** – mass actions, merge limits, DNH, purge (Lodola, Phillips).  
  – **India offer + compensation complexity** and **two-document** pattern (Fabiola).  
  – **BGC flexibility + reinitiate** (Fabiola).  
  – **Document sprawl + candidate attachment “box”** (Fabiola, Santosh).  
  – **Channel reality** – WhatsApp, opt-in email friction (Santosh).  
• **Customer bridge line for deck:** SMEs **predicted** TP pain on **dedupe** and **ID** before Step 8; **P4–P5 confirmed** at scale.  
• **References for speaker notes:** paths listed under **105 SME inputs** and **Phase 1 SME transcript coverage**.

**Section 03 – Customer synthesis**

• Use **P1–P5** table and quotes from `105-user-research-findings.md`; emphasise **agency economics**, **OTP**, **offer regeneration**, **peak hiring**.

---

## Appendix

### A. Illustrative evidence quotes

**SME (Fabiola, Lowe’s India volume):** “The compensation one I've heard on **every project that India is included on**.” (transcript ~00:15:41–00:15:56)  
**SME (Santosh):** “Sometimes there would be **fake candidates** who would appear on interview… **legal matters happened**.” (~00:20:12–00:20:37)  
**SME (Lodola notes):** “**Candidate impersonation**… person who applies… **not** the same person who shows up for the interview.”  
**Customer (P5, via Step 8 findings):** Duplication is the “**#1 automation**” ask; match on **Aadhaar**, not only email/phone.  
**Customer (P3, via Step 8 findings):** Policy expects **three IDs** before offer; UI allows **partial** completion; **~16–17%** loss cited in offer-to-join window (participant estimate).

### B. Limitations

• **Single customer organisation** in Step 8 (Teleperformance India); weight **SME multi-customer** patterns accordingly.  
• **Transcript ASR noise** and very long TP files; Step 8 summary used for **precision** on numerics alongside spot checks in source `.txt`.  
• **DA conflict** on native +91 SMS across threads (**matrix** retains **True Gap** until PS reconciliation).

### C. Disclaimer

This analysis supports product strategy and is **not** legal advice. **DPDP**, **Aadhaar**, and **AI** obligations require **060** and customer counsel for production decisions.

---

**Report path:** `research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md`  
**Next steps:** Step 10 **060** legal review of recommendations **#1–#13**; Step 11 **130** deck from this file + strategy / PESTEL / SWOT + CI artefacts.
