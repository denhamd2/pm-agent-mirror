# India Offer E-Signature: Aadhaar eSign via Adobe Sign (TBD Release)
Product Requirements Document  
March 2026

## Executive Summary

Workday strengthens India offer completion by pairing the existing Recruiting offer journey with Adobe Sign capabilities that support Aadhaar-based e-authentication where the customer’s Adobe tenant and legal posture allow it. Regional suites and omnichannel-first competitors still lead narrative on native +91 SMS, WhatsApp in core Recruiting UI, and Naukri-class multipost (see `research/competitive/in/in-competitive-scan-2026-03-30-INDIA-E2E-004.md` and `research/competitive/matrices/in-competitive-matrix.md`). This initiative does not close those True Gaps; it targets a narrower wedge: reducing friction and leakage on the India statutory offer and ID path by improving e-sign authentication alignment for offers, triangulated with customer evidence on OTP and government ID task pain (`research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md`).

For our customers, the feature set will improve candidate completion on the offer e-signature task when Aadhaar-class authentication is required or preferred, with clear consent and minimisation boundaries. It preserves auditability by keeping Workday as the system of record for task state while Adobe executes signing and Aadhaar authentication under the customer’s Adobe and UIDAI / ASP arrangements.

For Workday, this initiative will improve India win-story credibility on offer orchestration alongside honest channel and board positioning, lift Adobe Sign attach value in India hiring accounts, and supply measurable funnel metrics on Adobe-completed versus Workday task completion (see **Observability & Analytics** and **Measurement Appendix**). Success is stated against tenants that have Adobe Sign enabled for offers (denominator definition in Overview), not the entire Recruiting customer base.

Delivery depends on cross-vendor architecture confirmation (Workday, Adobe, and where applicable ASP licensing), legal sign-off on Aadhaar lawful basis, Requesting Entity roles, and data minimisation (token-oriented storage where required). Unresolved items remain under **Open Questions**.

**Epic Links:**

- India Aadhaar / Adobe Sign offer e-sign (EA): TBD  
- India Aadhaar / Adobe Sign offer e-sign (GA): TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | India enterprise and high-volume hiring programmes report offer path brittleness: OTP delivery issues, government ID tasks that conflict with policy, and e-signature flows that do not match local authentication expectations. Customer evidence cites material leakage between acceptance and join for specialised hiring, with OTP and ID friction as contributing factors (PMF Theme 2; India-ID-OTP-Leakage coding in thematic analysis). Without a governed path for Aadhaar-appropriate authentication in e-sign, recruiters rely on offline or parallel processes that weaken audit trails and time-to-fill. |
| **How is it done today?** | Customers use Adobe Sign (or other e-sign) alongside Workday offer tasks, often with tenant-level Adobe settings that may not distinguish per-offer authentication needs. Candidates may complete Adobe steps but Workday tasks remain incomplete if they do not return to confirm in-product (Deployment Agent constraint: see **Critical User Journey & Use Cases**). Review Document steps may be shared across offer types even when only some offers need Aadhaar-class handling, creating configuration tension. |
| **How is our approach uniquely different from others?** | • **Suite-anchored offer task:** Workday owns recruiter and candidate task orchestration, status, and reporting; Adobe delivers signing and Aadhaar e-authentication within the customer’s Adobe contract and India compliance posture.<br>• **Honest competitive framing:** Strengthens India offer completion without claiming resolution of native SMS, WhatsApp, or board multipost gaps (per DA-IN004 / matrix).<br>• **Governance:** Unbundled consent, EN/HI template strategy, DPDP-aligned minimisation and retention (token-only preference; 30-day cap where specified in legal NFR).<br>• **Global tenant safety:** Aadhaar options are scoped to India-relevant offers; Japan and Germany two-step offer jurisdictions are out of scope for this branching (no Aadhaar-specific single-step assumptions in those locales). |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Adoption denominator (mandatory):** All adoption, funnel, and completion-rate targets are calculated as a share of **tenants that have Adobe Sign enabled for offers** (integrated and active for the offer use case), not all Recruiting customers or all India tenants.<br><br>**Year 1 forecast (directional; legal and Adobe workshop gates apply):**<br>• Offer-task completion: increase Workday offer-task completion for India offers using the Aadhaar-capable path versus baseline (baseline sources: **Measurement Appendix**).<br>• Post-Adobe confirmation: reduce drop-off in the Adobe completed → Workday “OK” submitted funnel (see **Observability & Analytics**).<br>• Aadhaar-path OTP reliability: track OTP failure or abandonment on the Aadhaar authentication path inside the offer e-sign task only; do not treat this metric as a proxy for overall +91 SMS or WhatsApp reliability (True Gaps remain per matrix).<br><br>**Strategic value & outcomes:**<br>1. Deal narrative: credible India offer story paired with transparent channel/board partner map.<br>2. Platform growth: deeper Adobe Sign value in Recruiting; inputs to future statutory task patterns.<br>3. Risk reduction: fewer shadow PDF and email loops for India offer signing where Aadhaar auth is in scope. |

### Audience / Personas

**Primary Persona**: Recruiting Operations / TA Lead (India or India-hiring multinational)

- Configures offer and document tasks; accountable for joining conversion and compliance checkpoints  

**Secondary Persona**: Workday Tenant Administrator

- Manages Adobe Sign integration, authentication defaults, and security reviews  

**Tertiary Persona**: External Candidate (India)

- Completes e-sign and Aadhaar authentication steps; needs clear lawful basis, consent, and what happens next in Workday  

**Persona depth**: Recruiter and hiring-manager jobs align with `docs/jtbd-recruiting-hr-professional-and-manager.md`; candidate tone with `docs/workday-user-research/README.md` (External Candidate).

---

## Feature Solution

• India offer e-signature path using Adobe Sign with support for Aadhaar e-authentication where enabled in the customer Adobe tenant and permitted by UIDAI / ASP and customer legal posture  
  • Workday exposes offer task state, deep link or equivalent handoff to Adobe, and completion rules  
  • Adobe performs document presentation, signing, and Aadhaar authentication per tenant configuration or per-envelope settings (see **Technical Architecture**)  
  • Candidate must return to Workday and activate OK (or equivalent primary control) to complete the Recruiting task after Adobe reports completion (Deployment Agent validation: offer task completion requires in-product confirmation)  

• Tenant configuration: “India Aadhaar-capable offer signing” (name TBD)  
  • Visible only where country or legal profile allows; excluded where Japan or Germany two-step offer models apply (do not merge Aadhaar logic into those country templates)  
  • For multi-country tenants, India requisitions and offers use the India pattern; other countries unchanged  

• Consent and notices  
  • Unbundled consent copy for Aadhaar and e-sign purposes (EN + HI templates); legal compliance review before publish  
  • Purpose limitation and retention messaging consistent with DPDP programme  

• Data handling  
  • NFR: prefer token-only representations in Workday where legally and technically feasible; 30-day retention ceiling for any Aadhaar-related artefacts held in integration scope unless legal specifies otherwise  
  • DPA, subprocessors, cross-border transfers: follow Workday and Adobe contractual artefacts; DPIA where high-risk processing is identified  

### Technical Architecture

Clarify ownership of authentication method selection and integration boundaries. This is an **open architecture question** until an **Adobe API workshop** confirms available APIs and tenant controls.

| **Branch** | **Description** | **Workday responsibility** | **Adobe / customer responsibility** |
|------------|-----------------|------------------------------|-------------------------------------|
| **(a) Adobe-tenant-wide auth settings** | Simpler model: authentication methods (including Aadhaar where licensed) are set at Adobe organisation or tenant level; Workday sends envelopes that inherit those defaults. | Offer task orchestration, routing to Adobe, status sync, OK completion in Workday, reporting hooks. | Adobe admin configures auth policies; ASP and UIDAI compliance sit outside Workday configuration surface. |
| **(b) Per-offer auth via Workday → Adobe API** | Richer model: recruiter or template selects authentication method per offer or per envelope; Workday passes parameters through Adobe APIs. | Same as (a), plus UI and business rules for when the Aadhaar path is offered; validation of country and policy gates. | Adobe exposes and supports the API contract; customer maintains entitlements and ASP relationship. |

**Open architecture actions:** Schedule an Adobe technical workshop to confirm whether (b) is supported, licensed, and stable for Recruiting volumes; if (b) is not available, scope v1 to (a) with documentation for PS on tenant prep. Until the workshop completes, engineering plans must account for both models.

---

## Business Process Design

• Offer business process includes Send offer, Candidate review / sign, and post-signature steps consistent with existing Recruiting patterns  

• **Review Document conditionality (Deployment Agent constraint):** A single Review Document (or equivalent) step cannot apply different conditional document sets inside the same step for different candidates based on Aadhaar versus non-Aadhaar paths. If some offers require Aadhaar authentication and others do not, product may need parallel Review Document steps (or separate subprocess variants) so each step has a uniform document package. BP design must be validated with Deployment Agent and PS before promising per-candidate branching inside one step.  

---

## Critical User Journey & Use Cases

• Recruiter sends India offer with Adobe Sign and Aadhaar-capable path enabled (per tenant or template rules)  
• Candidate receives notification (channel agnostic; SMS and WhatsApp gaps are unchanged by this initiative) and opens signing experience in Adobe  
• Candidate completes Aadhaar e-authentication and signature in Adobe per tenant auth settings (branch (a) or (b) per **Technical Architecture**)  
• **Mandatory Workday return:** After Adobe marks the envelope completed, the candidate returns to Workday and selects OK (or equivalent primary control) to complete the Recruiting task. Product and enablement must surface this expectation so operations do not assume Adobe alone closes the task  
• Recruiter sees task completed only when both Adobe completion and Workday OK are satisfied  
• Observability records funnel: Adobe completed → Workday OK submitted (**Observability & Analytics**)  

---

## Competitive & Market Context

| **Theme** | **Implication for this initiative** |
|-----------|----------------------------------------|
| **Regional suites** (Darwinbox, Keka, Zoho) | Strong local omnichannel and HRMS bundling; Workday does not match native WhatsApp or Naukri multipost in core product (True Gaps). Positioning: offer trust and suite depth, not channel parity claims. |
| **Enterprise** (SAP, Oracle) | AI and embedded hiring narratives; Workday responds with hire-to-pay, governance, and honest integration maps. |
| **Workday strengths** (DA-IN004) | Hindi, DPDP-style consent, retention, and purge, bulk actions, baseline skills matching. |

**Sources:** `research/competitive/matrices/in-competitive-matrix.md` (v1.3); `research/competitive/in/in-competitive-scan-2026-03-30-INDIA-E2E-004.md`.

---

## Compliance Considerations

• **DPDP Act 2023** (and Rules): consent, purpose limitation, data fiduciary duties, retention, rights; customer legal owns lawful basis mapping  
• **Aadhaar Act / UIDAI:** authentication only through authorised channels; Requesting Entity and ASP obligations are customer and Adobe ecosystem concerns; Workday must not imply UIDAI approval without legal evidence  
• **Blocker flag (PRD):** Adobe ASP verification and licensing for Aadhaar e-sign must be confirmed before GA claims; track as release gate  
• **Section 8** Aadhaar use cases and eligibility: final wording requires qualified legal opinion; enablement uses approved templates only  
• Cross-border transfers and hosting: DPA and transfer mechanisms; no simplified reassurance in customer-facing copy  
• Legal compliance review on all candidate-facing and RFP strings  

---

## Data & Integrations

• Adobe Sign REST APIs (details TBD per workshop): envelope creation, status webhooks or polling, authentication parameters if branch (b)  
• Workday objects: Offer, candidate task, document metadata; no full Aadhaar number in Workday when token-only NFR applies  
• Integration monitoring: observability events for handoff, Adobe terminal states, and Workday OK events  

---

## Observability & Analytics

• **Funnel metrics (mandatory)**  
  • Count A: Adobe envelope completed (signed and auth success as defined in **Measurement Appendix**)  
  • Count B: Workday offer task completed via OK after A  
  • Rate B/A: Adobe completed → Workday OK submitted; target upward trend quarter over quarter post GA  

• **Aadhaar-path OTP metric:** failures or abandonment only when OTP is part of Aadhaar authentication inside this offer e-sign flow; report separately from general candidate comms OTP (SMS and WhatsApp True Gaps remain per `in-competitive-matrix.md`)  

• Dashboards: Recruiting operations view by tenant, legal entity, template  

---

## UX Designs for TBD Release

• Candidate: return-to-Workday prompt after Adobe; clear OK CTA  
• Recruiter: status badges distinguishing Adobe done versus task still open  
• Admin: India Aadhaar toggle and help text for multi-country tenants  
• Figma links: TBD after architecture gate  

---

## Releases & Production Thresholds

• Adobe API workshop complete; branch (a) or (b) selected and documented  
• ASP and licensing verification for customer archetypes  
• Legal: Requesting Entity wording, Section 8 position, consent templates (EN/HI) approved  
• Legal compliance sign-off on external copy  
• Deployment Agent re-validation of BP pattern (Review Document parallelism if needed)  
• Observability event schema in lower environments  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| Adobe technical workshop (auth branch decision) | TBD |
| Architecture decision record (a vs b) | TBD |
| Legal templates and DPIA checkpoint | TBD |
| BP design sign-off (Review Document strategy) | TBD |
| Engineering complete (integration and UX) | TBD |
| GA readiness review | TBD |

---

## Open Questions

1. Adobe API support for per-offer authentication selection (branch b); workshop date and owners  
2. Legal opinion on Section 8 and Requesting Entity framing for typical Workday customers  
3. Adobe ASP licence and UIDAI roadmap constraints blocking specific segments  
4. Data minimisation sign-off: token-only versus operational exceptions  
5. Hosting and cross-border transfer matrix for Aadhaar transaction metadata flowing through Adobe regions  

---

## Measurement Appendix

Traceability for baselines, denominators, and definitions used in success metrics, including OTP scope boundaries after stakeholder review.

| **Metric** | **Definition** | **Baseline sources** | **Scope / exclusions** |
|------------|----------------|----------------------|-------------------------|
| Offer-task completion (Workday) | Candidate submits OK in Workday and task closes per Recruiting rules | Historical task completion reports (owner TBD); pilot tenant pre-GA window | India offers with Adobe Sign enabled only |
| Adobe envelope completed | Adobe reports terminal success state for envelope (signed and required auth complete) | Adobe Sign reporting API or admin exports | Same cohort as row above |
| Adobe → Workday OK funnel | B/A as defined in **Observability & Analytics** | Derived from event stream post instrumentation | Mandatory post-GA KPI |
| OTP failure (Aadhaar path) | Count of failed or timed-out OTP steps during Aadhaar e-authentication inside the offer e-sign journey only | Integration and Adobe auth logs (schema TBD) | Does not include general Recruiting SMS or WhatsApp OTP; True Gaps for +91 SMS and WhatsApp remain tracked separately in `in-competitive-matrix.md` |
| Adoption % | Tenants using India Aadhaar-capable path divided by tenants with Adobe Sign enabled for offers | Entitlement and usage telemetry | Denominator is not “all Recruiting customers” |

**Note:** Product marketing and RevOps should align public targets with agreed baseline capture where applicable (see pattern in `docs/prds/france-whatsapp-omnichannel-engagement-prd.md`).

---

## Resources

• PRD (markdown): `docs/prds/india-aadhaar-adobe-sign-offer-prd.md`  
• PMF analysis: `research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md`  
• India competitive matrix: `research/competitive/matrices/in-competitive-matrix.md`  
• India competitive scan: `research/competitive/in/in-competitive-scan-2026-03-30-INDIA-E2E-004.md`  
• Deployment Agent (India parity): DA-IN004 thread `dac6739f-1c6e-49cf-a587-a06d6a8ababc`; offer and Adobe grounding thread `28947023-aeb7-4e0a-a769-bbc5619a7dfc`  
• Legal review Jira: TBD  
• Experience principles: `docs/experience-principles.md`  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Recruiting |
| TBD | Adobe Sign partner engineering |
| TBD | Legal Partner (Privacy / India) |
| TBD | Field Readiness / PS |
| TBD | Recruiting engineering |

---

Workday Confidential
