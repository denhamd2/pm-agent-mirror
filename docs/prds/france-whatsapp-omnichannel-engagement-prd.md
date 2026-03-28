# France Omnichannel Engagement: 2-Way WhatsApp & Email (TBD Release)
Product Requirements Document  
March 2026

## Executive Summary

Workday is uniquely positioned to defend enterprise France and EMEA deals with a native, compliance-aware response to omnichannel candidate messaging expectations. This initiative delivers a v1 package centred on native 2-way WhatsApp and Email messaging directly within the core Workday Recruiting UI (via the CommunicationDock), paired with a strong TCO and governance narrative versus Oracle Fusion Recruiting and Recruiting Booster. The release scope is a functional, embedded omnichannel communication experience, eliminating the need to rely solely on partner paths for core messaging capabilities.

For our customers, this feature set will reduce surprise in RFPs and executive demos by providing a native, integrated solution for candidate communication. It will improve win-rate hygiene on omnichannel objections by pairing suite depth (HCM, Recruiting, Payroll for France, GDPR-class controls) with actionable, in-product messaging tools (WhatsApp and Email) instead of spec-sheet debates alone.

For Workday, this initiative will lower competitive losses attributed to omnichannel and WhatsApp story gaps, lift measured adoption of native messaging features in France-relevant pipelines, and standardise objection handling against Oracle Booster stack and TCO claims. Success is measured against **RevOps-agreed** baselines and definitions for loss reasons and feature adoption (see **Phase 0** under Year 1 outcomes).

Delivery for GA is expected as a core product release (CommunicationDock with WhatsApp and Email channels), cross-functional enablement release (battle cards, Success Centre or equivalent artefacts, presales discovery checklist), with legal and privacy review on all candidate-facing and RFP language. SMS capability classification (Native vs Workaround) and single source of truth reconciliation across Deployment Agent threads are explicitly out of scope for this PRD and remain a separate initiative.

**Epic Links:**

- France WhatsApp / omnichannel gap response (EA): TBD  
- France WhatsApp / omnichannel gap response (GA): TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Oracle Recruiting Booster and regional ATS competitors position omnichannel candidate engagement, including WhatsApp and rich Email, as table stakes in France and EMEA enterprise evaluations. Previously, Workday Recruiting did not offer native two-way WhatsApp embedded in the core Recruiting UI. That asymmetry creates RFP risk and loss language when buyers compare omnichannel checklists without suite, TCO, and compliance context. French buyer expectations include omnichannel narratives; PESTEL Social nuance (per France PMF analysis) notes WhatsApp is less central than in Southern Europe but not absent in candidate experience comparisons. Without a native response, sellers default to partner-led claims that slow partner activation and complicate TCO. |
| **How is it done today?** | Field teams ad hoc assemble Paradox, integration, and Workday Messaging facts from memory, local decks, and one-off SC answers. Presales may either overclaim parity or stall on WhatsApp questions without a standard native story. Customers evaluating Oracle Booster rarely see a single Workday TCO and data-model comparison that includes messaging add-ons, implementation, and governance costs. |
| **How is our approach uniquely different from others?** | • **Native Omnichannel UI**: We are building 2-way WhatsApp and rich Email directly into the core Recruiting UI via the CommunicationDock, providing a seamless, unified experience for recruiters.<br>• **Suite and compliance anchor**: Lead with unified HCM + Recruiting + Payroll for France, retention/purge, and EU AI Act-aligned human-in-the-loop narratives where hiring AI SKUs appear, backed by native GDPR-compliant messaging.<br>• **TCO and policy**: Compare Oracle stack (Booster, channels, professional services) to Workday's native capabilities, including enterprise policy constraints on consumer WhatsApp use. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Phase 0 (gating, before Year 1 readout):** RevOps and sales operations agree **definitions** (what counts as omnichannel objection, native feature touch, France segment scope, minimum N for loss-reason stats) and establish **baselines** from CRM / win-loss; no public or customer-facing numeric commitments until that sign-off.<br><br>**Year 1 Forecast (directional; binds only after Phase 0):**<br>• **Adoption direction**: High adoption of the native CommunicationDock (WhatsApp and Email) in France enterprise opportunities where omnichannel was raised; **illustrative** stretch: order of **~25% uplift** vs the signed baseline once measured.<br>• **Commercial direction**: Reduction in competitive losses where primary coded reason includes omnichannel or WhatsApp gap; **illustrative** stretch: order of **~20%** vs signed baseline using the same taxonomy at year end.<br><br>**Strategic Value & Outcomes:**<br>1. **Deal quality**: Fewer last-minute surprises on WhatsApp rows in RFP matrices; faster executive alignment on native capabilities.<br>2. **Drive Business & Platform Growth**:<br>   a. **Monetisation**: Protect ARR at risk from suite displacement to Oracle or best-of-breed ATS on channel narrative alone.<br>   b. **Deal-closing**: Reusable battle card vs Oracle Booster omnichannel claims with citable sources.<br>   c. **Future acceleration**: v1 artefacts become input to any future deeper embedded messaging roadmap without rewriting positioning from zero. |

### Audience / Personas

**Primary Persona**: Talent Acquisition / Recruiting Operations Lead (France enterprise)

- Owns channel strategy (email, SMS, messaging apps) within policy guardrails  
- Accountable for candidate experience metrics and vendor evaluations  

**Secondary Persona**: IT / Workday Tenant Administrator

- Assesses integrations, data flows, subprocessors, and subscription dependencies  
- Implements partner connectors and security review artefacts  

**Tertiary Persona**: Candidate (external)

- Receives messages via approved channels; needs transparent lawful basis and opt-out clarity (GDPR Arts. 13 and 7)  

**Persona depth**: Recruiter and hiring-manager jobs align with `docs/jtbd-recruiting-hr-professional-and-manager.md`; candidate tone and anxiety points informed by `docs/workday-user-research/README.md` (External Candidate PDF) where candidate-facing copy is in scope.

---

## Feature Solution

• **France / EMEA battle card** (digital PDF or wiki) for internal use: Workday vs Oracle Booster on omnichannel (honest gap plus suite response)  
  • True Gap row: native WhatsApp in core Recruiting UI (DA-FR002, scan feature table)  
  • Native strengths: French language experience, GDPR-class controls, mobile, bulk actions, statutory hire-to-pay when Payroll deployed  
  • Partner path: Paradox (or approved success path) for conversational and messaging workflows where entitled  
  • TCO worksheet appendix: line items for Oracle Booster-class messaging vs Workday plus partner fees and implementation (ranges TBD with finance enablement; no customer quotes without approval)  
  • **Oracle claims hygiene (mandatory)**: Every bullet that references Oracle **Recruiting Booster** or Oracle **channel** coverage (email, SMS, WhatsApp, etc.) must **footnote the public Oracle document title, URL, and “valid as of [date]”**; where Oracle packaging or regional availability is **unknown**, the footnote reads **“verify in deal”** and escalates to deal desk / competitive response, not implied parity.

• **Presales discovery checklist** (5 to 10 questions) for France deals when WhatsApp or omnichannel appears  
  • Policy: Does the customer allow consumer WhatsApp for recruiting, or only approved enterprise channels?  
  • Entitlements: Paradox, Workday Messaging (SMS), other integrations already purchased?  
  • **France / SMS**: Confirm whether the customer needs **SMS to French mobile numbers**; if yes, capture intent to use **approved partner or third-party SMS** paths and plan **Deployment Agent** re-validation plus **PS** feasibility check on the tenant **before** any presales statement that Workday Messaging alone covers FR SMS.  
  • Compliance owner: Who signs off on candidate comms and retention (DPO / legal)?  

• **Success and field enablement kit**  
  • Two-minute talk track + FAQ (10 entries) covering Oracle doc citations and Workday response  
  • Optional webinar or Champion session template for France AE / SC communities  

• **In-product discovery (optional v1 if policy allows)**: neutral help entry or Success Centre link from Recruiting communications context that explains channel options and partner path without implying native WhatsApp in core UI  

• **Explicit non-goals (v1)**  
  • No greenfield native WhatsApp API integration built into core Recruiting UI  
  • No SMS Native vs Workaround reconciliation (DA-FR001 vs DA-FR002); do not change global SMS claims in this epic  

### Experience Principles Alignment

**How this feature upholds Workday's Experience Principles** (`docs/experience-principles.md`):

**Empower (Give Users Control)**

- Recruiters and tenant admins choose approved channels and partners with clear prerequisites, not hidden assumptions that WhatsApp exists natively in Workday.  
- Outcome-focused: enable reaching candidates effectively within policy, rather than forcing a single vendor messaging model.  

**Trust (Build Their Confidence)**

- Transparent True Gap statement matches Deployment Agent and competitive scan classification; no overclaim on native WhatsApp.  
- Familiar language in battle card and FAQ; plain English and French enablement variants TBD with localisation owner.  

**Grow (Enable Them To Change)**

- Versioned enablement artefacts (v1, v1.1) so when partner or product posture changes, customers receive updated guidance without ad hoc email chains.  
- Build upon existing Success and partner programmes rather than one-off slides per deal.  

**Principle Validation:**

- [x] Feature keeps customer and field in control (no fake native parity)  
- [x] Clear transparency on what Workday does vs partners  
- [x] Easy to update artefacts when facts change  

---

## Critical User Journey & Use Cases

• RFP drops a requirement row for native WhatsApp in ATS  
• SC opens France battle card section True Gap + partner path  
• SC walks customer through checklist (policy, entitlements, DPO)  
• Customer requests TCO view vs Oracle Booster; AE uses appendix ranges and escalates custom pricing to deal desk  
• Success engages if Paradox or messaging partner activation is selected  
• Legal / privacy review signs off on external-facing wording before customer email send  
• RevOps tags opportunity with omnichannel objection and outcome using **Phase 0** definitions before Year 1 readout  

---

## Competitive & Market Context

| Capability | Classification (DA-FR002) | Implication for this initiative |
|------------|---------------------------|----------------------------------|
| Native WhatsApp two-way messaging in core Recruiting UI | True Gap | Central objection; respond with partner path plus suite TCO |
| Oracle Booster omnichannel (email, SMS, WhatsApp) | Competitor bundled narrative | Cite Oracle docs in battle card Sources |
| French UI, GDPR framework, mobile, bulk grid, DPAE/Payroll (when deployed) | Native | Win themes to pair with gap honesty |
| SMS to French mobiles | Workaround (DA-FR002) | Mention only at high level in v1; full reconciliation out of scope. **France presales**: pair with partner/third-party SMS path and DA + PS validation intent (see Overview and checklist). |
| Multipost without third-party multiposter | Workaround | Optional cross-link to Broadbean narrative if deal raises multidiffusion |

**Adjacent RFP rows (deal checklist pointers only; not v1 build scope)**  
• **`fr-competitive-matrix.md`**: When buyers expand the matrix beyond omnichannel, point them to the **AI recruiting / hiring AI SKU** row(s) for EU AI Act and HiredScore governance context without adding AI scope to this epic.  
• **`fr-competitive-scan-2026-03-28-FR-E2E-002.md`**: When RFPs ask for **Paradox-grade conversational interview scheduling**, point to scan/matrix treatment of scheduling + partner path; **do not** commit native parity in v1.

**Sources**: `research/competitive/matrices/fr-competitive-matrix.md` (v1.2, 28 March 2026); `research/competitive/fr/fr-competitive-scan-2026-03-28-FR-E2E-002.md`; PMF report `research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md` (roadmap item: Native WhatsApp gap response; Theme 2 omnichannel).

---

## Compliance Considerations

• **GDPR**: Lawful basis, transparency (Arts. 13 to 14), and retention for candidate messages delivered via partners remain customer responsibilities; enablement must not imply Workday operates WhatsApp as controller for customer scenarios without legal review. **Retention, export (portability), and erasure** for content that spans Workday, an approved messaging partner, and the employer may require **coordinated** action across those parties; artefacts must not promise single-system completion where partner or WhatsApp-side stores are in scope.  
• **ePrivacy / electronic communications**: Align messaging examples with EU framing for France collateral; avoid US-only TCPA as primary label on EMEA assets (per PMF handoff guidance on SMS-related rows).  
• **EU AI Act**: Not primary for this PRD; do not conflate conversational scheduling AI with simple WhatsApp delivery claims. **Segregate** messaging-channel enablement from **AI-assisted recruiting decisions** (screening, ranking, solely automated decisions) in all positioning; EU AI Act and Art. 22-style narratives apply to the latter, not to honest channel-gap plus partner-path descriptions alone.  
• **060** full review required before external publishing of candidate-facing copy or customer email templates.  

### Legal positioning

**Controller / processor map (conceptual only)**  
This PRD does **not** determine legal roles for any specific tenant or deal. Illustratively: the **customer employer** is typically **controller** for candidate personal data in recruiting (purposes, lawful basis, retention policy). **Workday** is typically **processor** (or sub-processor as defined in the customer agreement) for data processed in subscribed Workday services. An **approved messaging or conversational partner** (for example Paradox-class) is typically a **processor** or sub-processor under its own agreement with the customer and/or Workday; **WhatsApp / Meta** and other infrastructure providers may process data under their own terms and roles. Final classification follows the **DPA**, order form, and partner contracts.

**Forbidden claims (enablement, RFP, and customer-facing language)**  
• Do **not** imply **native Workday WhatsApp** (built-in two-way WhatsApp as part of core Recruiting UI); v1 is partner-led paths and honest True Gap framing.  
• Do **not** understate **cross-border transfer** complexity (including EU/EEA to third countries); avoid flat reassurance. Point reviewers to **DPA**, transfer mechanisms (for example SCCs), and jurisdiction-specific requirements rather than summarising transfers as trivial.  
• Do **not** merge **channel delivery** (sending or receiving messages via partner and WhatsApp) with **AI-assisted recruiting decisions**; keep scheduling or conversational AI governance separate from “we have WhatsApp” checklist responses.

**DPA, subprocessors, and Workday + partner + WhatsApp**  
Any statement that describes processing involving **Workday**, an **approved partner**, and **WhatsApp** (or equivalent) must be **grounded in** the customer’s **Data Processing Agreement (DPA)** and **Workday’s official subprocessor list**, plus the **partner’s** privacy notice and subprocessor disclosures where applicable. **Do not** invent or maintain a bespoke subprocessor inventory in this PRD; use pointers to the **current** contractual and published lists and escalate deal-specific questions to Legal.

---

## Data & Integrations

• No new Workday business object for WhatsApp messages in v1.  
• Partner systems (for example Paradox) remain system of engagement for WhatsApp where used; data flow diagrams belong in implementation guides TBD with partners. **Retention, export, and erasure** workflows for message content and metadata may require **Workday + partner + employer** alignment; implementation guides should state that purge in Workday alone may not remove copies held by the partner or on consumer messaging platforms.  
• **Deployment Agent note (March 2026)**: Workday Messaging supports two-way conversational messaging with candidates in Recruiting context as a separate add-on; it is SMS-oriented, not WhatsApp. **For France**: presales and RFP language must **not** assume unrestricted Workday Messaging SMS to **French mobiles**; default narrative is **partner or third-party SMS** where required until **Deployment Agent** thread re-validation and **PS** sign-off on tenant feasibility. Prior validation thread: `47d0dd16-80b5-4f61-9052-a0efdb377505`.  

---

## UX Designs for TBD Release

• Battle card and checklist (Confluence or PDF) — link TBD  
• Optional in-product help / Success Centre entry — Figma TBD if scoped  

**315 (UX Designer) scope for this PRD**: **Surfaces only** (for example neutral help entry, Success Centre link pattern, or lightweight in-product discovery placement with Copy Inventory). **Out of scope**: a **full communications product prototype** (no end-to-end multi-channel composer, thread model, or comms hub build in 320 for v1; partner-led and enablement-first).

---

## Releases & Production Thresholds

• **Phase 0 complete**: RevOps-signed metric definitions and baselines (see Overview table) before any external numeric goal language  
• Legal review (060) complete on customer-facing and RFP-facing strings  
• Partner review (Paradox or success owner) on path accuracy  
• Sales enablement sign-off (France RVP or delegate)  
• RevOps agreement on loss reason codes and reporting for success metrics  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| Draft battle card + checklist internal review | TBD |
| 060 legal pass on external assets | TBD |
| Partner alignment workshop | TBD |
| Enablement publish + SKO / webinar slot | TBD |
| Phase 0: RevOps metric definitions + baseline capture | TBD |
| Year 1 metric readout (after Phase 0) | TBD |

---

## Open Questions

1. RevOps-owned minimum deal count and significance testing for any **post-Phase 0** loss-reduction target (replaces fixed 20% assumption until agreed).  
2. Exact partner SKU names and entitlement flags to show in internal tools (if any).  
3. French language artefacts: translation owner and timeline.  
4. In-product link placement approval (Recruiting product / platform governance).  
5. Target date for **PS** workflow to confirm FR SMS / Workday Messaging feasibility per tenant when presales flags FR mobile SMS.  

---

## Resources

• Epic — TBD (EA / GA)  
• PRD (markdown): `docs/prds/france-whatsapp-omnichannel-engagement-prd.md`  
• PMF analysis: `research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md`  
• France competitive matrix: `research/competitive/matrices/fr-competitive-matrix.md`  
• France competitive scan: `research/competitive/fr/fr-competitive-scan-2026-03-28-FR-E2E-002.md`  
• Deployment Agent: DA-FR002 thread `72acf33b-3896-4144-a68f-6f58e89a95fe`; PRD validation query thread `47d0dd16-80b5-4f61-9052-a0efdb377505`  
• Legal review Jira: TBD  
• Experience principles: `docs/experience-principles.md`  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Recruiting |
| TBD | Product Marketing, Talent Acquisition |
| TBD | Field Readiness / SC Leadership |
| TBD | Legal Partner (Privacy) |
| TBD | Partner Success (Paradox / messaging) |
| TBD | RevOps / Sales Operations |

---

Workday Confidential    1

-- 1 of 8 --

Workday Confidential    2

-- 2 of 8 --

Workday Confidential    3

-- 3 of 8 --

Workday Confidential    4

-- 4 of 8 --

Workday Confidential    5

-- 5 of 8 --

Workday Confidential    6

-- 6 of 8 --

Workday Confidential    7

-- 7 of 8 --

Workday Confidential    8

-- 8 of 8 --
