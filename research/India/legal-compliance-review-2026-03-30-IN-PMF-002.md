# Legal & Compliance Review: India PMF Roadmap Recommendations

**Date:** 30 March 2026  
**Mission:** IN-PMF-002  
**Reviewer:** 060 Legal Compliance Review  
**Source:** `research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md`

## Purpose

This review assesses legal and compliance risks for the 12 India PMF roadmap recommendations before deck generation (Step 11) and PRD development. Recommendations are flagged by risk level with required actions for compliant implementation.

---

## Applicable Regulatory Framework

### India-Specific
- **DPDP Act 2023** (Digital Personal Data Protection Act): Consent-centric, data fiduciary obligations, cross-border transfer rules, phased enforcement through May 2027
- **IT Act 2000 & Rules**: Electronic signatures, data security
- **UIDAI Act 2016 & Aadhaar Regulations 2025**: Strict limitations on Aadhaar data collection, storage, and usage
- **Contract Labour Act**: Hiring and agency regulations
- **Employment law**: Interview regulations, offer requirements

### Global (where applicable)
- **GDPR** (Art. 6, 9, 17, 22, 35, 44-50): Where EU candidates apply to India roles
- **EU AI Act** (Regulation EU 2024/1689): High-risk AI in recruitment (screening, ranking, profiling)
- **CCPA/CPRA**: Where US candidates apply to India roles

---

## Risk Assessment by Recommendation

### 🔴 CRITICAL RISK (4 recommendations)

**Recommendation 2: Region-configurable marketing communication default (opt-out where lawful)**

**Risk Level:** 🔴 CRITICAL-RISK

**Applicable Regulations:**
- DPDP Act 2023: Section 6 (Consent), Section 7 (Notice)
- GDPR Article 6 (Lawful basis), Article 7 (Consent conditions) for EU candidates
- Telecom Commercial Communications Customer Preference Regulations 2018 (TRAI DNC)
- IT Rules 2011: Commercial communication requirements

**Compliance Requirements:**
1. **Legal interpretation mandatory**: DPDP vs. legacy SPDI Rules (2011) on opt-in/opt-out for recruiting communications
2. **Region-specific lawful basis**: Consent (opt-in) vs. legitimate interest (opt-out + unsubscribe)
3. **DNC registry compliance**: Check against TRAI Do Not Call registry for SMS/voice
4. **Clear unsubscribe mechanism**: One-click unsubscribe in all communications
5. **Cross-border consent**: EU candidates require GDPR-compliant opt-in regardless of India default

**Risk Factors:**
- **Legal ambiguity**: DPDP Act does not explicitly address recruiting communications; enforcement guidelines pending
- **Regulatory precedent limited**: SPDI Rules required opt-in; DPDP may shift interpretation
- **Penalty exposure**: DPDP penalties up to INR 250 crore (₹2.5 billion) for consent violations
- **Cross-border conflict**: Opt-out default for India + opt-in for EU requires complex tenant configuration

**Recommended Actions:**
1. **MANDATORY**: Engage Indian legal counsel for DPDP interpretation before ANY opt-out implementation
2. **Document lawful basis**: Written opinion on legitimate interest vs. consent for recruiting communications
3. **Implement region-specific consent flows**: Technical architecture for per-region consent management
4. **TRAI DNC check**: Integrate DNC registry validation for SMS/voice (if not already present)
5. **Audit trail**: Log all consent preferences, source, timestamp per DPDP Section 8
6. **Customer DPA amendments**: Add opt-out mechanics and lawful basis documentation

**Documentation Needed:**
- [ ] Legal opinion from Indian counsel on DPDP opt-in/opt-out for recruiting
- [ ] DPIA (high-risk profiling if combined with candidate scoring)
- [ ] Privacy notice updates (lawful basis per region)
- [ ] DPA amendments (sub-processor disclosure if using CPaaS/Paradox)
- [ ] Consent flow technical spec (region-based consent rules)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for consent configuration, region-based policy engine
- **PRD**: 200-write-prd must include DPDP compliance section, consent UX, audit requirements
- **Timeline**: Legal opinion required before customer commitment; phased rollout post-legal sign-off

**Citations:**
- DPDP Act 2023: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
- TRAI DNC Regulations: https://trai.gov.in/

---

**Recommendation 4: India identity and offer hard-gating programme**

**Risk Level:** 🔴 CRITICAL-RISK

**Applicable Regulations:**
- **UIDAI Act 2016**: Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act
- **Aadhaar Regulations 2025**: Data protection, storage, and usage amendments
- **DPDP Act 2023**: Section 9 (Processing of children and persons with disability), Section 10 (Duties of Data Fiduciary)
- **IT Act 2000**: Electronic signatures, data security

**Compliance Requirements:**
1. **Aadhaar usage restrictions**: Permitted ONLY under UIDAI-approved use cases (employment verification may not qualify)
2. **No unauthorized Aadhaar storage**: Biometric data and Aadhaar numbers cannot be stored by private entities (UIDAI Regulations 2016, Reg. 27)
3. **OTP verification scope**: Aadhaar OTP for e-KYC requires UIDAI licensing (not freely available for recruiting)
4. **Alternative ID acceptance**: Must accept PAN, Passport, Voter ID, Driving License (avoid exclusive Aadhaar dependency)
5. **Purpose limitation**: Government ID collection must be limited to employment verification (not secondary uses)
6. **Retention limits**: Delete government ID data after verification complete or legal retention period ends

**Risk Factors:**
- **UIDAI enforcement**: Unauthorised Aadhaar usage penalties up to INR 1 crore (₹10 million) + 3 years imprisonment
- **Scope creep risk**: "Hard-gating at offer" may imply Aadhaar-exclusive verification (not legally permissible)
- **Integration complexity**: Aadhaar e-KYC API requires UIDAI licensing for Authentication Service Agency (ASA) or e-KYC User Agency (KUA)
- **Cross-border storage**: If Workday hosts candidate data outside India, DPDP cross-border transfer rules apply

**Recommended Actions:**
1. **CRITICAL**: DO NOT implement Aadhaar-exclusive verification without UIDAI legal opinion and licensing
2. **Accept multiple government IDs**: PAN, Passport, Voter ID, Driving License (avoid Aadhaar dependency)
3. **Aadhaar integration path**: If Aadhaar e-KYC desired, partner with UIDAI-licensed ASA/KUA (do not build in-house)
4. **Configurable gating**: Allow customers to choose which IDs are mandatory at offer stage
5. **OTP failure handling**: Graceful degradation (manual review path, alternative ID acceptance)
6. **Retention policy**: Delete government ID images/numbers after employment verification (DPDP data minimization)
7. **Audit trail**: Log verification attempts, failures, alternative paths for compliance demonstration

**Documentation Needed:**
- [ ] Legal opinion on Aadhaar usage for employment verification (UIDAI Act compliance)
- [ ] DPIA (sensitive personal data processing under DPDP)
- [ ] Privacy notice updates (government ID processing, purpose, retention)
- [ ] UIDAI licensing documentation (if Aadhaar e-KYC pursued)
- [ ] DPA amendments (cross-border transfer mechanisms if applicable)
- [ ] Data retention policy (government ID data lifecycle)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for ID field configuration, OTP integration, retention workflows
- **PRD**: 200-write-prd must include UIDAI compliance analysis, alternative ID flows, no-Aadhaar-exclusive design
- **Timeline**: Aadhaar integration requires 6-12 months for licensing; launch with PAN/Passport first

**Citations:**
- UIDAI Act 2016: https://uidai.gov.in/images/targeted_delivery_of_financial_and_other_subsidies_benefits_and_services_13072016.pdf
- Aadhaar Regulations 2016 (as amended): https://uidai.gov.in/legal-framework/regulations.html

---

**Recommendation 5: High-volume integrity: duplicates, source attribution, DNH**

**Risk Level:** 🔴 CRITICAL-RISK

**Applicable Regulations:**
- **DPDP Act 2023**: Section 8 (Accuracy and data quality), Section 10 (Duties of Data Fiduciary)
- **GDPR Article 22**: Automated decision-making (if automated rejection)
- **EU AI Act Article 6-7, Annex III**: High-risk AI for recruitment decisions
- **Employment law**: Fairness in hiring, non-discrimination

**Compliance Requirements:**
1. **Automated rejection restrictions**: DNH (Do Not Hire) lists may constitute automated decision-making under GDPR Art. 22 and EU AI Act (high-risk)
2. **Human oversight mandatory**: Recruiter must review DNH matches; cannot auto-reject without human intervention
3. **Fairness and transparency**: Candidates have right to know why they were rejected; DNH lists must be justifiable
4. **Data accuracy**: DNH lists must be regularly reviewed and updated (DPDP data quality obligations)
5. **Purpose limitation**: DNH data collected for legitimate business reason (fraud prevention), not discriminatory purposes
6. **Retention limits**: DNH records must be purged after reasonable period (GDPR Art. 17, DPDP Section 10)

**Risk Factors:**
- **Discrimination risk**: DNH lists could perpetuate bias (previous rejections may not predict future performance)
- **Automated decision-making**: If DNH auto-blocks applications without human review, violates GDPR Art. 22
- **AI Act classification**: If DNH uses ML/matching algorithms → high-risk AI system → requires human oversight, transparency, logging
- **Merge >2 complexity**: Deterministic matchers using national ID (Aadhaar, PAN) may violate UIDAI/DPDP if implemented incorrectly
- **Agency fee disputes**: First-source attribution affects financial decisions → audit trail required

**Recommended Actions:**
1. **MANDATORY**: Human review for all DNH matches (no auto-rejection)
2. **Transparency to candidates**: If rejected due to DNH, provide explanation and right to contest
3. **Regular DNH audits**: Review and purge outdated DNH records quarterly (data minimization)
4. **Fairness assessment**: Validate DNH lists do not perpetuate protected characteristic discrimination
5. **If AI-powered**: Conduct DPIA, document AI logic, ensure human oversight (EU AI Act Art. 14)
6. **Aadhaar matching restrictions**: Do NOT use Aadhaar for deterministic duplicate matching without UIDAI legal opinion
7. **Use PAN/Email/Phone**: Safer matching keys than Aadhaar for duplicate detection
8. **Agency source attribution**: Log source changes with timestamp, reason, approver for audit trail

**Documentation Needed:**
- [ ] DPIA (if automated DNH or AI matching)
- [ ] Fairness impact assessment (DNH list bias analysis)
- [ ] Human oversight protocol (DNH review workflow)
- [ ] Transparency copy (candidate rejection messaging)
- [ ] Data retention policy (DNH purge schedule)
- [ ] Audit log spec (source attribution changes)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for UDMF configuration, DNH workflow, human-in-loop design
- **PRD**: 200-write-prd must include fairness section, human oversight requirements, no-auto-rejection design
- **Timeline**: Legal review before pilot; phased rollout with monitoring for discrimination signals

**Citations:**
- GDPR Article 22: https://gdpr-info.eu/art-22-gdpr/
- EU AI Act Annex III: https://artificialintelligenceact.eu/annex/3/
- DPDP Act 2023 Section 8: Data quality obligations

---

**Recommendation 8: HiredScore / Workday AI activation for India high-volume pilots**

**Risk Level:** 🔴 CRITICAL-RISK

**Applicable Regulations:**
- **EU AI Act** (Regulation EU 2024/1689): Articles 6-7 (High-risk AI), Annex III point 5 (AI for recruitment/selection)
- **GDPR Article 22**: Automated decision-making and profiling
- **GDPR Article 35**: Data Protection Impact Assessment (DPIA)
- **DPDP Act 2023**: Section 10 (Data fiduciary duties), transparency obligations

**Compliance Requirements:**
1. **High-risk AI classification**: Candidate screening/shortlisting AI is HIGH-RISK under EU AI Act Annex III point 5
2. **Human oversight mandatory**: AI cannot make final hiring decisions; recruiter must review and approve (AI Act Art. 14, GDPR Art. 22)
3. **Transparency to candidates**: Inform candidates that AI is used in screening process (AI Act Art. 13, GDPR Art. 13-14)
4. **Transparency to customers**: Document AI logic, limitations, accuracy metrics (AI Act Art. 13 for deployers)
5. **Risk management system**: Continuous bias monitoring, validation, mitigation (AI Act Art. 9)
6. **Technical documentation**: Document training data, algorithms, decision logic (AI Act Art. 11)
7. **Record-keeping**: Log AI decisions for audit and explanation (AI Act Art. 12)
8. **Accuracy and robustness**: Regular testing, validation against bias (AI Act Art. 15)
9. **DPDP transparency**: Explain to Indian candidates how AI scoring works

**Risk Factors:**
- **EU AI Act timeline**: High-risk AI obligations effective August 2026; must register in EU database by August 2027
- **Bias risk**: AI trained on non-Indian data may perpetuate cultural or demographic bias
- **Automated rejection**: If AI auto-rejects without human review → GDPR Art. 22 violation + AI Act non-compliance
- **Customer liability**: Workday customers (deployers) have AI Act obligations; Workday must provide documentation and transparency
- **Cross-border**: If AI processes EU candidate data for India roles → GDPR + AI Act both apply

**Recommended Actions:**
1. **MANDATORY**: DPIA before India pilot launch (GDPR Art. 35, DPDP best practice)
2. **Human oversight protocol**: Recruiter reviews ALL AI recommendations; cannot auto-reject
3. **Transparency to candidates**: Add disclosure: "AI-assisted screening is used in this process; all decisions are reviewed by human recruiters"
4. **Transparency to customers**: Provide AI documentation: training data sources, accuracy metrics, limitations, bias mitigation measures
5. **Bias monitoring**: Pilot must include bias metrics (by gender, age, region if permissible under DPDP)
6. **Human oversight logging**: Track which AI recommendations were overridden by recruiters (demonstrates human control)
7. **EU AI Act preparation**: If pilot includes EU entities or candidates → full AI Act compliance (risk management system, conformity assessment, EU database registration)
8. **Customer contracts**: Update DPAs to include AI processing terms, transparency obligations, shared responsibility model

**Documentation Needed:**
- [ ] DPIA (mandatory for AI in recruitment)
- [ ] AI system documentation (training data, logic, accuracy, limitations per AI Act Art. 11)
- [ ] Risk management system spec (bias monitoring, validation, mitigation per AI Act Art. 9)
- [ ] Human oversight protocol (recruiter review workflow, override logging)
- [ ] Transparency copy for candidates (AI disclosure, human review assurance)
- [ ] Transparency documentation for customers (deployer obligations under AI Act Art. 13)
- [ ] Bias monitoring dashboard spec (pilot metrics)
- [ ] DPA amendments (AI processing terms, shared liability)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for human-in-loop workflow, audit logging, bias metrics
- **PRD**: 200-write-prd must include EU AI Act compliance section, human oversight requirements, transparency UX, no-auto-reject design
- **Timeline**: DPIA + legal review 2-3 months before pilot; phased rollout with monitoring

**Citations:**
- EU AI Act Annex III: https://artificialintelligenceact.eu/annex/3/
- GDPR Article 22: https://gdpr-info.eu/art-22-gdpr/
- GDPR Article 35: https://gdpr-info.eu/art-35-gdpr/

---

**Recommendation 4: India identity and offer hard-gating programme**

**(Duplicate entry - see above for full analysis)**

**Risk Level:** 🔴 CRITICAL-RISK  
**Key Issues:** UIDAI Act compliance, Aadhaar usage restrictions, cross-border storage, sensitive data retention

---

**Recommendation 1: Partner-validated India omnichannel enablement pack (+91 SMS, WhatsApp, Paradox)**

**Risk Level:** 🟡 HIGH-RISK (elevated from Medium due to sub-processor complexity)

**Applicable Regulations:**
- **DPDP Act 2023**: Section 10 (Data fiduciary duties), Section 16 (Cross-border transfer)
- **GDPR Articles 28, 44-50**: Data processor agreements, cross-border transfers (if EU candidates)
- **Telecom regulations**: SMS/WhatsApp commercial communication rules

**Compliance Requirements:**
1. **Sub-processor agreements**: DPAs required with CPaaS providers (Twilio, Exotel, etc.), WhatsApp Business API providers, Paradox
2. **Data transfer mechanisms**: If sub-processors store data outside India → DPDP cross-border transfer compliance
3. **Purpose limitation**: Candidate phone numbers used only for recruiting communications (not marketing without separate consent)
4. **Consent for WhatsApp**: Explicit opt-in for WhatsApp may be required under DPDP (legal interpretation needed)
5. **Candidate transparency**: Privacy notice must disclose sub-processors (CPaaS, Paradox)
6. **No government ID verification claims**: Runbook must clarify this is communication enablement, NOT Aadhaar/government verification

**Risk Factors:**
- **Sub-processor chain**: CPaaS → WhatsApp Business → Meta increases data flow complexity
- **Cross-border data**: WhatsApp Business API may route through Meta servers outside India
- **Consent ambiguity**: DPDP does not explicitly address WhatsApp consent requirements
- **Paradox chatbot**: Conversational AI may require additional transparency disclosures

**Recommended Actions:**
1. **Execute DPAs**: Sign data processor agreements with CPaaS, WhatsApp API providers, Paradox
2. **Privacy notice updates**: Disclose sub-processors, data flows, cross-border transfers
3. **Consent mechanics**: Implement opt-in for WhatsApp (checkbox during application or candidate profile)
4. **Cross-border transfer documentation**: If applicable, document transfer mechanisms (SCCs, adequacy)
5. **Runbook accuracy**: Clearly state this is communication enablement, NOT native government ID verification
6. **Candidate opt-out**: Provide unsubscribe/opt-out mechanism for SMS and WhatsApp

**Documentation Needed:**
- [ ] DPAs with CPaaS providers (Twilio, Exotel, etc.)
- [ ] DPA with Paradox (chatbot service)
- [ ] WhatsApp Business API data processing terms
- [ ] Privacy notice updates (sub-processor disclosure)
- [ ] Cross-border transfer documentation (if applicable)
- [ ] Consent flow spec (WhatsApp opt-in)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for sub-processor integration, consent capture, opt-out workflow
- **PRD**: 200-write-prd must include sub-processor architecture, consent UX, no-government-ID-verification disclaimer
- **Timeline**: DPA execution before customer deployment; privacy notice updates before go-live

**Citations:**
- DPDP Act 2023 Section 10: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
- GDPR Article 28: https://gdpr-info.eu/art-28-gdpr/

---

### 🟡 MEDIUM RISK (4 recommendations)

**Recommendation 3: BGC re-initiation and parallel-path UX simplification**

**Risk Level:** 🟡 MEDIUM-RISK

**Applicable Regulations:**
- **DPDP Act 2023**: Section 6 (Consent), Section 8 (Data quality), Section 10 (Purpose limitation)
- **GDPR Article 6**: Lawful basis for re-screening
- **Employment law**: Background check fairness

**Compliance Requirements:**
1. **Re-screen consent**: If re-initiating background check after initial screening → obtain fresh candidate consent
2. **Purpose justification**: Re-screening must be for legitimate reason (e.g., elapsed time, job change), not arbitrary
3. **Candidate notification**: Inform candidate before re-initiating check (transparency)
4. **Data retention**: Delete previous BGC results if no longer needed (DPDP data minimization)
5. **Third-party processor**: BGC provider (SpringVerify, etc.) remains sub-processor; existing DPA covers re-initiation

**Risk Factors:**
- **Consent fatigue**: Repeated consent requests may frustrate candidates
- **Purpose creep**: Re-screening without justification may violate purpose limitation
- **Retention complexity**: Managing multiple BGC result versions requires clear purge logic

**Recommended Actions:**
1. **Candidate consent UX**: Clear explanation of why re-screen is needed (e.g., "Previous check is >12 months old")
2. **Retention policy**: Auto-purge previous BGC results after new check completes (unless legal hold)
3. **Audit trail**: Log re-initiation reason, approver, candidate consent timestamp
4. **Parallel-path clarity**: Document which checks run in parallel vs. sequential (affects candidate wait time disclosures)

**Documentation Needed:**
- [ ] Consent flow spec (re-screen consent UX)
- [ ] Data retention policy (BGC result lifecycle)
- [ ] Audit log requirements

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for BGC re-initiation workflow, consent capture, auto-purge triggers
- **PRD**: 200-write-prd must include consent UX, retention logic, audit requirements
- **Timeline**: Standard development; legal review of consent copy before launch

**Citations:**
- DPDP Act 2023 Section 6: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf

---

**Recommendation 7: Flexible candidate document capture (candidate-home pattern)**

**Risk Level:** 🟡 MEDIUM-RISK

**Applicable Regulations:**
- **DPDP Act 2023**: Section 8 (Data minimization), Section 10 (Purpose limitation, Retention)
- **GDPR Articles 5, 17**: Data minimization, right to erasure (if EU candidates)

**Compliance Requirements:**
1. **Data minimization**: Collect only documents necessary for hiring decision (not speculative collection)
2. **Purpose limitation**: Documents collected for specific job applications; reuse across applications requires justification
3. **Sensitive document handling**: Government IDs, certificates, health documents → enhanced security
4. **Retention limits**: Delete documents after hiring decision or legal retention period expires
5. **Candidate control**: Allow candidates to delete documents from profile (right to erasure)
6. **Cross-application reuse**: Transparent to candidate that documents are shared across applications

**Risk Factors:**
- **Over-collection**: "Attachment hub" may encourage collecting more documents than necessary
- **Retention bloat**: Reuse across applications may extend retention beyond single application lifecycle
- **Sensitive data exposure**: Centralized document hub increases impact of security breach
- **GDPR conflict**: If EU candidates apply → strict data minimization and purpose limitation apply

**Recommended Actions:**
1. **Purpose-based collection**: System prompts for document type and purpose (e.g., "Government ID for offer verification")
2. **Retention policy**: Auto-delete documents after 12 months if not associated with active application (configurable)
3. **Candidate transparency**: Privacy notice explains document reuse, retention, deletion rights
4. **Security measures**: Enhanced access controls for sensitive documents (government IDs, health data)
5. **Candidate deletion right**: Self-service document deletion (unless legal hold)
6. **Cross-application consent**: Checkbox: "Allow these documents to be used for future applications" (optional, not mandatory)

**Documentation Needed:**
- [ ] Privacy notice updates (document reuse, retention, deletion rights)
- [ ] Data retention policy (document lifecycle by type)
- [ ] Security requirements spec (access controls for sensitive documents)
- [ ] Candidate self-service spec (delete documents UX)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for document storage, retention triggers, candidate self-service
- **PRD**: 200-write-prd must include data minimization design, retention policy, candidate control UX
- **Timeline**: Standard development; privacy notice review before launch

**Citations:**
- DPDP Act 2023 Section 8: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
- GDPR Article 5: https://gdpr-info.eu/art-5-gdpr/

---

**Recommendation 10: Hire-to-pay edge-case playbook (no-show, pay group, onboarding)**

**Risk Level:** 🟡 MEDIUM-RISK

**Applicable Regulations:**
- **Employment law**: Payroll accuracy, onboarding requirements
- **DPDP Act 2023**: Data accuracy (Section 8)

**Compliance Requirements:**
1. **Payroll data accuracy**: No-show and pay group corrections must be accurate for legal compliance
2. **Legal copy restrictions**: Playbook cannot provide legal advice on employment termination or pay disputes (must defer to customer legal counsel)
3. **Audit trail**: Status changes (no-show, termination, pay group) must be logged for dispute resolution

**Risk Factors:**
- **Employment law complexity**: India has multiple labor laws (Contract Labour Act, state-specific regulations); playbook may oversimplify
- **Incorrect legal guidance**: If playbook provides employment law advice → could create customer liability
- **Payroll errors**: Incorrect pay group or no-show handling → wage payment violations

**Recommended Actions:**
1. **Scope limitation**: Playbook covers Workday BP patterns only (not legal advice on employment law)
2. **Legal disclaimer**: "Consult employment counsel for termination, no-show, and pay decisions"
3. **Audit trail**: Log all status changes with timestamp, reason, approver
4. **Customer responsibility**: Emphasize customer owns employment law compliance decisions

**Documentation Needed:**
- [ ] Legal disclaimer for playbook (no employment law advice)
- [ ] Audit log requirements

**Implementation Considerations:**
- **Content**: CSG/Enablement toolkit with BP patterns, NOT legal employment advice
- **PRD**: If productising (not just playbook) → 200-write-prd must include audit requirements, legal disclaimer
- **Timeline**: Legal review of playbook copy before publication

**Citations:**
- DPDP Act 2023 Section 8: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf

---

### 🟢 LOW RISK (4 recommendations)

**Recommendation 6: Fraud / KYC presales kit + SpringVerify joint solution brief**

**Risk Level:** 🟢 LOW-RISK

**Applicable Regulations:**
- Marketing and claims accuracy
- Sub-processor disclosure (if positioning as integrated solution)

**Compliance Requirements:**
1. **Accurate claims**: Enablement kit must not over-claim Workday native capabilities
2. **Honest comparison**: SpringVerify positioning must be fair and factual
3. **Sub-processor disclosure**: If positioning SpringVerify as integrated solution → privacy notice implications

**Risk Factors:**
- **Over-claiming**: Risk of positioning SpringVerify capabilities as "native Workday" features
- **Competitive misrepresentation**: Comparison table must be accurate and defensible

**Recommended Actions:**
1. **Claims review**: Legal review of all feature claims before publication
2. **Honest positioning**: Emphasize Workday BGV framework + SpringVerify as ecosystem partner
3. **Competitive comparison accuracy**: Validate all competitor feature claims

**Documentation Needed:**
- [ ] Legal review of enablement kit claims
- [ ] Competitive comparison validation

**Implementation Considerations:**
- **Content**: Sales enablement focus; technical implementation via existing BGV framework (no new product development)
- **Timeline**: Claims review 1-2 weeks before publication

---

**Recommendation 9: In-product recruiter pipeline dashboards and aging**

**Risk Level:** 🟢 LOW-RISK

**Applicable Regulations:**
- Role-based access controls (security, not privacy-specific)

**Compliance Requirements:**
1. **Role-based access**: Dashboards must respect recruiter permissions (no unauthorized data access)
2. **No candidate PII exposure**: Aggregate metrics only (not individual candidate details without permissions)

**Risk Factors:**
- **Minimal**: Standard reporting feature with existing security controls

**Recommended Actions:**
1. **Security review**: Validate dashboard respects Workday security domain model
2. **Aggregate data focus**: Aging metrics, pipeline counts (not PII-heavy drill-downs unless authorized)

**Documentation Needed:**
- [ ] Security requirements spec (role-based access)

**Implementation Considerations:**
- **Technical**: 050-functional-knowledge for security configuration, dashboard permissions
- **PRD**: Standard security section; no special compliance requirements
- **Timeline**: Standard development; no legal review required

---

**Recommendation 11: Approval and demand signal governance workshop design**

**Risk Level:** 🟢 LOW-RISK

**Applicable Regulations:**
- Internal process governance (no direct privacy/compliance implications)

**Compliance Requirements:**
1. **Audit trail**: Approval decisions logged for accountability
2. **Role-based access**: Only authorized users can approve requisitions

**Risk Factors:**
- **Minimal**: Internal workflow optimization with standard audit requirements

**Recommended Actions:**
1. **Audit logging**: Track approval decisions with timestamp, approver, decision
2. **Security review**: Validate approver permissions model

**Documentation Needed:**
- [ ] Audit log requirements

**Implementation Considerations:**
- **Content**: Workshop design + governance model; technical implementation via standard Workday approval chains
- **Timeline**: No legal review required; standard business process design

---

**Recommendation 12: India maintenance window risk advisory (six-day operations)**

**Risk Level:** 🟢 LOW-RISK

**Applicable Regulations:**
- Service availability (SLA-related, not compliance-specific)

**Compliance Requirements:**
- **None specific**: Operational communication, not regulatory compliance feature

**Risk Factors:**
- **Minimal**: Advisory communication to customers about maintenance windows

**Recommended Actions:**
1. **Customer communication plan**: Coordinate with Ops team on messaging
2. **SLA transparency**: Clearly document maintenance windows in customer agreements

**Documentation Needed:**
- [ ] Customer communication template

**Implementation Considerations:**
- **Content**: Account engineering guidance; no product development required
- **Timeline**: No legal review required

---

## Summary: Risk Distribution

| Risk Level | Count | Recommendations |
|------------|-------|-----------------|
| 🔴 CRITICAL | 4 | Rec 2 (Opt-out consent), Rec 4 (Aadhaar gating), Rec 5 (DNH automation), Rec 8 (AI pilots) |
| 🟡 HIGH | 1 | Rec 1 (Omnichannel sub-processors) |
| 🟡 MEDIUM | 2 | Rec 3 (BGC re-initiation), Rec 7 (Document capture) |
| 🟢 LOW | 4 | Rec 6 (Presales kit), Rec 9 (Dashboards), Rec 11 (Approvals), Rec 12 (Maintenance advisory) |

---

## Critical Actions Required Before Customer Commitment

### Immediate (Pre-PRD)
1. **Recommendation 2**: Engage Indian legal counsel for DPDP opt-in/opt-out interpretation
2. **Recommendation 4**: Obtain UIDAI legal opinion on Aadhaar usage for employment verification
3. **Recommendation 5**: Conduct fairness assessment for DNH automation; document human oversight protocol
4. **Recommendation 8**: Conduct DPIA for AI pilot; document EU AI Act compliance approach

### Before Customer Deployment
1. **Recommendation 1**: Execute DPAs with CPaaS/Paradox sub-processors
2. **Recommendation 2**: Legal sign-off on region-specific consent flows
3. **Recommendation 4**: Aadhaar integration only with UIDAI licensing OR design alternative ID flows
4. **Recommendation 5**: Human review workflow implemented and tested for DNH
5. **Recommendation 7**: Privacy notice updates for document reuse and retention
6. **Recommendation 8**: Bias monitoring dashboard operational; human oversight logging active

### Documentation Package for PRD Writers
- 4 CRITICAL-RISK recommendations require legal review BEFORE PRD scope finalization
- 3 recommendations require DPIA or equivalent data protection assessment
- 5 recommendations require privacy notice updates
- 4 recommendations require sub-processor DPA execution or updates

---

## Recommendations for @pmf-analyst Revision

**No revision required.** The E2E Handoff table already includes accurate "Legal / compliance (060)" column entries that align with this assessment. The roadmap recommendations are appropriately flagged.

**For 130 deck generation (Step 11):** Include legal compliance flags in recommendation slide speaker notes. Highlight CRITICAL-RISK items (Recs 2, 4, 5, 8) for PM visibility before HITL selection.

---

## Handoff to Step 11 (130 Deck Generation)

**Input for 130:**
- 4 recommendations flagged as CRITICAL-RISK: Must include legal compliance warnings in speaker notes
- 3 recommendations require DPIA: Note in recommendation slides
- Emphasize: Legal counsel engagement is mandatory before customer commitment for Recs 2, 4, 5, 8

**Proceed to Step 11:** Deck generation can proceed. Legal flags are advisory for roadmap prioritization, not blockers for deck creation.

---

**Citations:**
- DPDP Act 2023: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
- UIDAI Act 2016: https://uidai.gov.in/legal-framework/act-and-rules.html
- EU AI Act: https://artificialintelligenceact.eu/
- GDPR: https://gdpr-info.eu/

---

**Legal Compliance Review Complete: 30 March 2026**  
**Reviewer:** 060 Legal Compliance Review  
**Mission:** IN-PMF-002 Step 10  
**Output:** `research/India/legal-compliance-review-2026-03-30-IN-PMF-002.md`
