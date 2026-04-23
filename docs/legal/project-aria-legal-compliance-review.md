# Legal & Compliance Review: Project Aria - Ambient Recruiting Agent

**Reviewer:** Legal Compliance Advisor (060)
**PRD Author:** Jesse Sherb
**PRD Status:** Draft (Last Updated: 5 March 2026)
**Review Date:** 23 April 2026
**Risk Level:** 🔴 CRITICAL

---

## Executive Summary

Project Aria is one of the most legally complex AI products Workday has attempted in recruiting. The vision is compelling and the architecture is thoughtful - but as written, the PRD ships a **high-risk AI system under the EU AI Act with no DPIA, no candidate consent framework, and at least one feature that is actively deceptive to data subjects.**

There are **three critical red flags** that must be resolved before this product ships to any customer operating in a regulated market:

1. **"Delegated Access (On Behalf Of)" mode is fundamentally incompatible with GDPR and the EU AI Act.** Allowing Aria to impersonate a named human recruiter means candidates receive AI-generated communications believing they are from a person. This violates the AI Act's mandatory transparency requirements (Article 50) and GDPR's fairness and transparency principles (Article 5). This feature, as described, cannot legally ship in the EU, UK, or any jurisdiction with AI disclosure obligations.

2. **The Screening & Matching sub-agent constitutes automated decision-making with legal effect on candidates (GDPR Article 22) and qualifies as a High-Risk AI system (EU AI Act Annex III, Point 5).** The PRD acknowledges "autonomous screen" but does not include a candidate transparency notice, a meaningful human review mechanism, or a DPIA. These are not optional - they are legal prerequisites.

3. **Warm memory stores candidate facts "indefinitely."** GDPR's storage limitation principle (Article 5(1)(e)) requires personal data to be kept no longer than necessary. Storing semantic facts about candidates without a defined retention period or a legal basis for indefinite storage is non-compliant across every major privacy jurisdiction.

The PRD has genuine strengths: the bias audit capability, the HITL guardrails on compensation, and the observability/audit trail architecture are all compliance-positive. The product *can* be made compliant - but it requires a dedicated compliance sprint alongside the engineering build, not a post-launch patch.

**Immediate recommended actions:**
- Remove or redesign the Delegated Access impersonation mode before any customer pilot.
- Commission a DPIA before any data processing begins (GDPR Article 35 mandates this for AI screening of candidates).
- Define retention periods for all three memory tiers.
- Add a candidate-facing AI disclosure layer to every touchpoint where Aria communicates directly.

---

## 1. EU AI Act Classification

### Classification: HIGH-RISK (Annex III, Point 5)

Project Aria is unambiguously a high-risk AI system under the EU AI Act (Regulation EU 2024/1689). Multiple sub-agents fall squarely within **Annex III, Point 5 - Employment, workers management, and access to self-employment:**

| Sub-Agent | EU AI Act Classification | Rationale |
|---|---|---|
| Screening & Matching | **High-Risk** | AI system used for recruitment or selection of natural persons - screening, ranking, and recommending actions on candidates |
| Sourcing & Outreach | **High-Risk** | AI system identifying and targeting candidates for recruitment |
| Decision Support | **High-Risk** | AI assembling recommendation packages for hiring decisions |
| Pipeline Intelligence | **High-Risk** | AI monitoring and evaluating the effectiveness of recruitment processes |
| Interview Scheduling | Borderline / Transparency | Primarily logistical; however, transcript analysis and scorecard drafting touch Article 50 |

### High-Risk Compliance Requirements (Not Addressed in PRD)

The following are **mandatory legal obligations** for high-risk AI systems under Articles 8-15. None are addressed in the current PRD:

| Requirement | Article | Current PRD Status | Action Required |
|---|---|---|---|
| Risk management system | Art. 9 | Not mentioned | Establish continuous risk identification and mitigation process |
| Data governance | Art. 10 | Not mentioned | Document training data sources, bias testing methodology, representativeness |
| Technical documentation | Art. 11 | Partial (architecture docs) | Formal AI system technical documentation required for regulatory submission |
| Record-keeping / logging | Art. 12 | ✅ Good - audit trail built in | Ensure logs are retained for at least 6 years post-EU registration |
| Transparency to deployers | Art. 13 | Not mentioned | Customer-facing documentation on how Aria works, limitations, and failure modes |
| Human oversight | Art. 14 | Partial (HITL on some actions) | Systematic human oversight for all candidate screening outcomes - not just dispositions |
| Accuracy, robustness, cybersecurity | Art. 15 | Not mentioned | Formal validation, accuracy benchmarking, and security testing |
| Conformity assessment | Art. 43 | Not mentioned | Required before deployment in EU market |
| EU AI Database registration | Art. 71 | Not mentioned | Required by August 2027 |

### Compliance Timeline Risk

The EU AI Act's high-risk provisions take full effect **August 2026** - the same timeframe in which Project Aria would likely be in early customer pilots. This is not a future consideration; it is an imminent legal deadline.

---

## 2. GDPR Analysis

### 2.1 Automated Decision-Making - Article 22 🔴 CRITICAL

The Screening & Matching sub-agent performs automated scoring and recommends actions (advance, hold, or reject) for every incoming candidate. Even with "HITL required for rejections," the automated match score and qualification flags constitute **profiling with significant effect** on a data subject's access to employment.

**GDPR Article 22 requires:**
- The right not to be subject to solely automated decisions with legal or significant effect.
- The right to obtain human intervention, express one's view, and contest the decision.
- An explicit legal basis: consent, contract necessity, or EU/Member State law.

**PRD gaps:**
- No candidate-facing disclosure that automated scoring is occurring.
- No documented mechanism for candidates to request human review of their score.
- No specified legal basis for the automated profiling.
- The "autonomous screen" default mode appears to process candidates without explicit consent for AI evaluation.

### 2.2 Delegated Access Mode - Articles 5, 13, 14 🔴 CRITICAL

The PRD describes a "Delegated Access (On Behalf Of)" mode where:
> *"Aria operates using a human recruiter's credentials. Outreach and calendar invites appear to come from the recruiter."*

This is **deceptive by design.** It creates a false impression in the mind of the candidate that they are corresponding with a named human being. This violates:

- **GDPR Article 5(1)(a)**: Processing must be lawful, fair, and **transparent**.
- **EU AI Act Article 50(1)**: Persons interacting with AI systems intended to interact with natural persons must be informed they are interacting with an AI system - not a human.
- **Consumer protection law** in most EU jurisdictions (deceptive commercial practice).
- **UK ICO AI guidance** (equivalent obligations post-Brexit).

The PRD's own recommendation is agent identity as default, "with delegated access as an opt-in." This is insufficient - the mode as designed is legally impermissible, not merely non-preferred.

### 2.3 Storage Limitation - Article 5(1)(e) 🔴 CRITICAL

The memory architecture includes:

| Tier | Retention | GDPR Issue |
|---|---|---|
| Hot (session state) | Duration of session | ✅ Acceptable |
| Warm (semantic facts) | **"Indefinite (facts)"** | 🔴 Non-compliant - no legal basis for indefinite storage of candidate personal data |
| Warm (session archives) | 90 days | ⚠️ Needs justification - is 90 days proportionate? |
| Cold (older archives) | 1 year | ⚠️ Needs justification against purpose |
| Purged | Beyond policy | ✅ Hard delete is correct approach |

"Semantic facts" stored in warm memory include inferred preferences, candidate behaviours, and manager preferences learned from interactions. These are personal data. **There is no legal basis for indefinite retention.**

Required action: Define retention periods for all fact types in warm storage, tied to a specific legal basis (e.g., consent with a defined term, or legitimate interest with a balancing test).

### 2.4 Web Scraping of External Channels - Articles 5, 6, 13 🟠 HIGH RISK

The Sourcing sub-agent "scrapes external channels to find up to 50 semantic matches." Web scraping of candidate profiles constitutes collection of personal data without the data subject's knowledge. This requires:

- A lawful basis (legitimate interest is commonly relied upon, but requires a balancing test and privacy notice at point of first contact).
- A transparency notice delivered to the scraped individual before or at first contact (Article 13/14).
- Compliance with the terms of service of the scraped platforms (LinkedIn's ToS explicitly prohibits scraping without authorisation).

LinkedIn is listed as a tool. LinkedIn's **Recruiter System Connect (RSC)** is the compliant integration route - the PRD already references this for the LinkedIn Sourcing skill. It is critical that the "web scraping" language in the architecture section is not implemented as literal scraping of LinkedIn or any other platform with GDPR-covered individuals.

### 2.5 Interview Transcript Processing - Articles 9, 35 🟠 HIGH RISK

The Decision Support sub-agent ingests Sana meeting transcripts to auto-draft scorecards. Interview transcripts may contain **special category data** (health conditions, disability, religion, family circumstances) disclosed incidentally by candidates.

- Processing special category data requires explicit consent or an employment law exception (Article 9(2)(b)).
- A DPIA is required before this processing begins (Article 35 - processing of special category data using AI in an employment context triggers the mandatory threshold).
- Candidates must be informed before the interview that their transcript will be processed by an AI system.

### 2.6 Cross-Border Data Transfers - Articles 44-50 🟠 HIGH RISK

The PRD stores candidate data across Postgres/pgvector and S3/GCS with no mention of data residency, storage geography, or transfer mechanisms. For EU/EEA candidates:

- Data cannot be transferred to third countries without an adequacy decision, Standard Contractual Clauses (SCCs), or equivalent transfer mechanism.
- Cloud storage in US-based S3/GCS buckets for EU candidate data requires documented transfer mechanisms.
- GCC-deployed customers (Saudi Arabia, UAE) have **data localisation requirements** - candidate data must remain in-country.

### 2.7 DPIA Requirement - Article 35 🔴 CRITICAL

A **Data Protection Impact Assessment is mandatory** before processing begins. The following DPIA triggers are all present in this PRD:

- ✅ Large-scale processing of personal data (all candidates across enterprise customers).
- ✅ Systematic monitoring of data subjects (heartbeat polling every 15 minutes).
- ✅ Automated decision-making with legal/significant effect (candidate screening and scoring).
- ✅ Processing of special category data (interview transcripts may contain health/disability information).
- ✅ Use of new technologies (LangGraph-powered autonomous agent).

A DPIA is not optional here. It must be completed before any production data processing begins, and a supervisory authority consultation (Article 36) may be required given the risk profile.

---

## 3. Global Regulatory Considerations

### 3.1 US - OFCCP / EEO Compliance ⚠️ PARTIALLY ADDRESSED

The PRD references "federal hiring guidelines" compliance and OFCCP disposition reason codes. This is positive. However:

- The bias audit capability is described but not specified. What is the adverse impact threshold? What protected categories are monitored? What statistical test is used (4/5ths rule? Standard deviation analysis)?
- For US federal contractors, OFCCP requires that AI-assisted selection tools do not produce adverse impact. The Bias Audit skill must be documented to demonstrate that AI screening meets UGESP (Uniform Guidelines on Employee Selection Procedures) standards.
- The EEOC's April 2024 guidance on AI in employment decisions requires employers to ensure AI tools do not screen out protected groups at higher rates.

### 3.2 India - DPDP Act 2023 🟠 HIGH RISK

For India-based candidates or Workday customers processing Indian candidate data:

- The Digital Personal Data Protection Act 2023 requires **consent** as the primary lawful basis for most candidate data processing.
- Data Fiduciary obligations require a privacy notice in the language of the data subject's choice.
- Cross-border transfer restrictions are expected to apply; the data localisation rules are not yet fully in force but will constrain S3/GCS architecture choices.

### 3.3 GCC (UAE, Saudi Arabia, Qatar) 🟠 HIGH RISK

- Both the UAE Federal Decree-Law No. 45/2021 and Saudi Arabia's PDPL require data localisation for certain categories of data.
- AI-generated candidate communications in Arabic may require specific consent language.
- No GCC-specific compliance considerations are mentioned in the PRD.

### 3.4 UK - UK GDPR / ICO AI Guidance ⚠️ ATTENTION REQUIRED

Post-Brexit, the UK maintains equivalent obligations to EU GDPR. The ICO has published specific guidance on AI in recruitment (March 2023) requiring:

- Transparency to candidates about AI use in screening.
- Human review of AI-driven shortlisting decisions.
- Equality impact assessments for AI hiring tools.

### 3.5 Canada - PIPEDA / AIDA 🟠 HIGH RISK

Bill C-27 (Artificial Intelligence and Data Act - AIDA), while not yet in force, will impose obligations on "high-impact AI systems" in employment contexts materially similar to the EU AI Act.

---

## 4. Feature-Specific Risk Assessment

| Feature | Risk Level | Key Concern |
|---|---|---|
| Delegated Access impersonation mode | 🔴 Critical | Deceptive AI identity; violates AI Act Art. 50 and GDPR Art. 5 |
| Automated candidate screening & scoring | 🔴 Critical | Article 22 GDPR; requires disclosure + human review mechanism |
| Indefinite warm memory for semantic facts | 🔴 Critical | No legal basis for indefinite personal data storage |
| Interview transcript ingestion (Sana) | 🟠 High | Special category data risk; requires pre-interview disclosure |
| Web scraping of external channels | 🟠 High | Unlawful collection without consent; LinkedIn ToS violation risk |
| Autonomous candidate disqualification re: comp band | 🟠 High | Automated decision with significant effect; requires HITL + explanation |
| Heartbeat polling every 15 minutes | 🟡 Medium | Systematic monitoring triggers DPIA; ensure audit logs are complete |
| Candidate outreach via SMS | 🟡 Medium | TCPA (US) consent requirements for SMS; GDPR consent for EU |
| Manager preference learning (warm memory) | 🟡 Medium | Processing of employee behavioural data; separate consent/notice needed for employees |
| Cross-border S3/GCS storage | 🟠 High | Transfer mechanisms not documented; GCC localisation not addressed |
| Bias Audit capability | ✅ Positive | Strong compliance signal; needs specification of methodology and thresholds |
| Compensation always HITL | ✅ Positive | Correct approach; no compliance risk on this feature |
| Full audit trail / observability | ✅ Positive | Excellent foundation for AI Act Article 12 record-keeping requirement |
| Agent identity (default mode) | ✅ Positive | Correct default; supports AI Act Art. 50 transparency |

---

## 5. Recommended Actions

### Pre-Build (Before Any Data Processing Begins)

- [ ] **Commission and complete a DPIA** covering all five sub-agents and the memory architecture. Engage DPO if Workday has designated one. Supervisory authority consultation may be required.
- [ ] **Remove or fundamentally redesign Delegated Access impersonation mode.** If a "human face" on outreach is a genuine customer requirement, the solution is a human-initiated workflow with AI drafting assistance - not AI impersonating a named human. Document this decision.
- [ ] **Define retention periods for all memory tiers**, especially warm semantic facts. Map to a specific GDPR lawful basis for each category of data stored.
- [ ] **Appoint a legal basis for automated candidate profiling.** Consent is the cleanest option for Article 22; document the consent capture mechanism for each customer deployment.

### PRD Revisions Required

- [ ] Add a **Candidate Privacy & AI Disclosure** section covering: what data is collected, what AI processing occurs, how candidates can exercise rights (access, deletion, human review, objection), and how they are notified.
- [ ] Specify the **Bias Audit methodology** - protected categories monitored, statistical test, adverse impact threshold, escalation process, and data retention for audit results.
- [ ] Add a **Data Residency & Transfer Mechanisms** section documenting per-region storage architecture.
- [ ] Define **retention periods** for every data category in all three memory tiers.
- [ ] Clarify the **web scraping** reference in the architecture - confirm this means authorised API integrations (LinkedIn RSC), not literal scraping.
- [ ] Add **EU AI Act compliance requirements** as non-functional requirements (technical documentation, conformity assessment, database registration by August 2027).
- [ ] Specify **GDPR Article 13/14 notices** - what information is disclosed to candidates at each touchpoint where data is collected.

### Implementation Guardrails

- [ ] Every candidate-facing communication surface (Paradox Olivia, email, SMS, Workday chat) must display an AI disclosure before the first interaction.
- [ ] Candidates who received automated screening scores must have a documented pathway to request human review (this must be a product feature, not a manual support process).
- [ ] Sana transcript ingestion must be gated on pre-interview candidate consent, not triggered automatically.
- [ ] The "autonomous screen; HITL for disposition" model for Sub-Agent 2 must be reviewed - autonomous scoring that informs a HITL disposition decision is still automated profiling under Article 22 and requires disclosure.

---

## 6. Documentation Required

- [ ] **DPIA** (Data Protection Impact Assessment) - mandatory before processing
- [ ] **EU AI Act Technical Documentation** (Article 11) - required for high-risk AI
- [ ] **Conformity Assessment** (Article 43) - required before EU market deployment
- [ ] **Privacy Notices (Articles 13/14)** - candidate-facing, per-touchpoint
- [ ] **Data Retention Policy** - all three memory tiers
- [ ] **Bias Audit Methodology Documentation** - for OFCCP, EEOC, and AI Act Art. 10
- [ ] **Data Transfer Mechanism Documentation** (SCCs or equivalent) - for cross-border flows
- [ ] **DPA Amendments** for customers - Workday's Data Processing Agreement must cover Aria's processing activities

---

## 7. Citations

- EU AI Act (Regulation EU 2024/1689): https://artificialintelligenceact.eu/ai-act-explorer/
  - Article 5 (Prohibited practices), Article 6 + Annex III (High-risk AI classification)
  - Article 9 (Risk management), Article 10 (Data governance), Article 11 (Technical documentation)
  - Article 12 (Record-keeping), Article 13 (Transparency to deployers), Article 14 (Human oversight)
  - Article 50 (Transparency obligations for AI interacting with humans)
  - Article 71 (EU AI Database)
- GDPR (Regulation EU 2016/679): https://gdpr-info.eu/
  - Article 5 (Principles), Article 6 (Lawful basis), Article 9 (Special categories)
  - Article 13/14 (Transparency/notice), Article 17 (Erasure), Article 22 (Automated decisions)
  - Article 35 (DPIA), Article 36 (Prior consultation), Articles 44-50 (Cross-border transfers)
  - Article 83 (Penalties - up to €20M or 4% global annual turnover)
- ICO AI in Recruitment Guidance (UK, March 2023): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/
- EEOC Guidance on AI and Employment (April 2024): https://www.eeoc.gov/
- India DPDP Act 2023: https://www.meity.gov.in/
- OFCCP Adverse Impact Analysis: https://www.dol.gov/agencies/ofccp

---

## Disclaimer

This review provides compliance guidance to support product development and does not constitute legal advice. For binding legal opinions, regulatory submissions, or DPIA sign-off, engage Workday's qualified legal counsel and DPO. Use this guidance to inform PRD requirements, flag risks for engineering, and design compliant solutions.
