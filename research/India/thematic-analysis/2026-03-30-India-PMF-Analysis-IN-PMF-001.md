# India Product-Market Fit Analysis — IN-PMF-001

**Mission:** IN-PMF-001  
**Date:** 30 March 2026  
**PM context (HITL):** New market entry  
**Mission themes:** Know Your Candidate / fraud prevention; high-volume hiring  
**Method:** Braun & Clarke six-phase thematic analysis with multi-source triangulation (SME + customer + strategy + competitive intelligence)

---

## Executive Summary

India PMF for Workday Recruiting is defined by **compounding scale and trust**: industrial hiring volumes (Accenture-scale applications, TP’s 12,000 hires in eight to ten weeks) amplify every friction point in **duplicate integrity**, **government ID and document capture**, and **offer lifecycle rigidity**. Internal SMEs and TP customer research **converge** on duplicate management and mass operations; customers surface **urgent, quantified crises** (source ownership favouring last-approved source, 400–500 candidates blocked on corrected offers after acceptance, 15–17% offer-to-join attrition partly tied to ID friction) that SMEs did not spell out in the same financial terms.

**PM focus themes** (explicit mission scope) synthesise as:

• **Know Your Candidate / fraud** — not only “more checks” but **auditable candidate records**, **first-source attribution**, **upfront Aadhaar/PAN/UAN discipline**, and **partner-mediated BGV** (native framework; no native UIDAI eKYC per competitive matrix).

• **High-volume hiring** — **batch offers**, **bulk approvals**, **UDMF at extreme scale**, and **offer amend/rescind paths** that match India’s cohort-based start dates and compensation corrections.

**Competitive posture:** Workday leads on **enterprise suite**, **UDMF**, **BGV business process + connectors**, and **DPDP-configurable** privacy levers; **Darwinbox**, **Keka**, **greytHR**, and **Zoho** win on **in-product omnichannel narratives**, **Naukri-adjacent workflows**, and **packaged BGV UX** (often SpringVerify). **SAP** (SuccessFactors + SmartRecruiters) and **Oracle** (Fusion agentic / Recruiting Booster) set **enterprise AI and integration** expectations. Recommendations below **avoid over-claiming** native **+91 SMS**, **WhatsApp in core UI**, **direct Naukri multipost**, and **government Aadhaar eKYC** until **Professional Services** or product documentation reconciles known Deployment Agent conflict on SMS (`d7ae197d` vs **DA-IN004**).

**Critical gaps for immediate attention:** (1) **Source ownership / first-source-within-cooling-period** and **automated duplicate detection at agency upload**; (2) **Offer rescind, regenerate after acceptance, and batch start-date changes** (plus role design so rescind is usable); (3) **Regional marketing communication model** (opt-in vs opt-out) and **channel roadmap** (WhatsApp / SMS) with **060** sign-off; (4) **Mandatory, parallel government ID capture** and **OTP reliability** tied to BGV readiness.

---

## Methodology

**Phase 0 — Scope:** India-only PMF; global CSV filtering not required (country folder inputs).

**Phase 1 — Familiarisation:** Read strategy context, PESTEL, SWOT, India competitive scan, matrix (v1.6), comprehensive CI report, and **105** SME and customer findings (with Fresh pass attestations). Re-read underlying evidence via structured summaries and cited quotes; **106** and **108** skipped (no data files).

**Phase 2 — Initial coding:** PM-friendly codes retained from **105** outputs (e.g. Source-Ownership-Last-Not-First, Opt-In-Blocks-Reach, Mass-Actions-Gap, Government-IDs-Not-Mandatory) plus CI codes (Native / Workaround / True gap).

**Phase 3 — Theme generation:** Seven SME themes and nine customer themes **clustered** into **six consolidated PMF themes** (below) to avoid redundant parallel narratives.

**Phase 4 — Triangulation:** Matrix crosses **SME**, **Customer**, and **Competitive intelligence** (proxy for market voice where 106/108 absent).

**Phase 5 — Theme definition:** Each theme named for PMF implication, with evidence strength and triangulation status.

**Phase 6 — Report:** Recommendations scored with **dual-dimension RICE** (Business Impact + Customer Impact → Composite Impact), per `strategy-context-2026-03-30-IN-PMF-001.md` RICE business-impact guidance and enhanced RICE skill (`~/.cursor/skills-cursor/rice-prioritisation/SKILL.md`).

**Participant anonymization:** Customer quotes reference **P1–P4** with role and **TP** (Teleperformance) per workspace standards.

---

## Input Sources

### 099 / Strategy (Steps 1–3)

• **Strategy context:** `research/India/strategy-context-2026-03-30-IN-PMF-001.md`  
• **PESTEL:** `research/India/pestel-analysis-India-2026-03-30-IN-PMF-001.md`  
• **SWOT:** `research/India/swot-analysis-India-2026-03-30-IN-PMF-001.md`  

### 101 Competitive Intelligence (Step 4)

• **Baseline scan:** `research/competitive/in/in-competitive-scan-2026-03-30-IN-PMF-001.md`  
• **Matrix:** `research/competitive/matrices/in-competitive-matrix.md` (v1.6)  
• **Comprehensive report:** `research/competitive/in/in-competitive-report-2026-03-30-IN-PMF-001.md`  

### 105 inputs (this run)

**SME research (Step 7):** `research/India/105-sme-research-findings.md`  
**Customer research (Step 8):** `research/India/105-user-research-findings.md`  

Both files contain Fresh pass attestations for Mission **IN-PMF-001**. Phase 1 treated listed transcript paths as the evidence base.

### 106 / 108 (optional)

**106 Customer Ideation Hub:** Skipped — no data files in `research/brainstorm-sessions/` or `research/India/brainstorm-sessions/`.  
**108 Gap data:** Skipped — no files in `research/gap-data/` or `research/India/gap-data/`.

---

## Consolidated Themes (SME + Customer + CI)

Themes **1** and **2** below deliberately **merge** what **105** treated as separate SME “KYC” and customer “duplicate crisis” narratives into one **integrity-at-scale** storyline, per mission instruction.

### Theme 1 — Trust, Identity & Candidate Record Integrity at Scale (PM: KYC + volume intersection)

**Description:** India hiring combines **fraud and impersonation risk** (resumes at 100,000/month scale, interview impersonation, legal exposure) with **extreme duplicate volume** and **financially material source attribution**. Workday must deliver a **single trustworthy candidate record**: who applied first, which agency owns the lead within cooling rules, and which government identifiers anchor deduplication.

**Triangulation status:** **Strong convergence** — SMEs (Bernie, Lodola, Santosh, Phillips); customers P2/P1 (source ownership, 2,000–3,000 vendor uploads/day, 1 FTE/site); CI (**UDMF Native**, BGV framework Native; Aadhaar gov eKYC not native).

**Evidence (illustrative):**

• **Bernie (SME):** Scale of resume fraud; Accenture pain.  
• **Lodola (SME):** Impersonation; career site change auditability gap.  
• **P2 (TP):** Last-approved source wins — wrong agency paid; “huge pile of cases.”  
• **P1 (TP):** Referral 3 Dec vs vendor 4 Dec; cooling period should favour first source.  
• **Matrix / CI:** Lead with UDMF; honest gap on native UIDAI verification.

**PMF implication:** Market entry **requires** UDMF and source logic to be **contract-grade** for agency-heavy employers; KYC is **operationalised** through **IDs, dedupe keys, and audit trails**, not a standalone “fraud feature” slide.

---

### Theme 2 — Industrial-Scale Hiring & Offer Velocity (PM: high volume + crisis offers)

**Description:** India’s largest employers recruit in **cohorts** (100–200+ roles, shared start dates, 100–150 offers/day per manager). Workday’s **one-by-one** offer and approval patterns and **inability to amend offers post-acceptance** create **compliance and throughput risk** (manual PDF offers outside the system).

**Triangulation status:** **Strong convergence** — SMEs (Lodola, Phillips, Fabiola); customers P1/P2/P3 (400–500 backlog, batch date changes blocked, no mass offers); CI (bulk grid Native; competitors market volume AI — differentiate on **controls + governance**).

**Evidence (illustrative):**

• **Lodola (SME):** Mass processing for offers, agreements, approvals; same-day starts.  
• **Fabiola (SME):** Frequent start date changes; India hire-before-BGC-complete pattern.  
• **P1 (TP):** 400–500 wrong compensation letters; regenerate only when offer failed to send, not for content fixes.  
• **P2 (TP):** Cannot resend after date change for batches of 20+.  
• **P3 (TP):** Rescind not available in role.

**PMF implication:** **High-volume hiring** without **offer lifecycle flexibility** forces **non-auditable workarounds**; this is a **trust and DPDP narrative** risk (purpose limitation, accuracy, documentation).

---

### Theme 3 — Government IDs, Document Capture & BGV Readiness (PM: KYC operational layer)

**Description:** Aadhaar, PAN, and UAN are **mandatory for TP before offer** but **not enforced** in flow; fields **vanish** or allow partial completion, driving **multi-day recruiter chasing**, **OTP failures**, and **executive candidate** frustration. Shekhar links **Aadhaar as dedupe key** to fraud.

**Triangulation status:** **Convergent** — SMEs (Santosh document box; Fabiola multi-document Lowe’s; Lodola BGC dataset); customers P3/P2/P1; CI (competitors’ Aadhaar/PAN automation stories vs Workday **partner/custom** path).

**Quantified customer signal:** P3 attributes **15–17%** drop-off between offer and join; ID friction and offer rigidity are **contributors** alongside market competition.

**PMF implication:** **Know Your Candidate** in India is partly **“collect the right identifiers once, early, with validation and fallbacks”** — aligned to DPDP **minimisation** and **lawful basis** design (**060**), not optional post-offer scavenger hunts.

---

### Theme 4 — Candidate Reach, Channels & Regional Communication Policy

**Description:** Santosh quantifies **marketing communication opt-in** collapsing reach (~100 of 2,000 recipients); **WhatsApp** as default channel. TP did **not** surface this — possible adoption stage or different comms stack.

**Triangulation status:** **SME–CI convergence, customer divergence** — CI confirms **True gaps** on native **+91 SMS** and **WhatsApp** in core UI; matrix retains **DA-IN004** until SMS conflict reconciled.

**PMF implication:** **Channel strategy** is **competitive** (Darwinbox/Keka/Zoho) and **strategic** (Q2 India **scale growth**); must be **legally framed** for DPDP and marketing rules (**060**).

---

### Theme 5 — Requisition Fidelity, In-Product Approvals & Manager Visibility

**Description:** TP recruiters create JRs **without** cost centre / LOB certainty; **offline email approvals** break auditability; **supervisory org** guesswork at 90k headcount; **reporting** and **generic notifications** (3,500 tasks) drive **Excel + Thrive** dependency.

**Triangulation status:** **Customer-primary** — limited SME emphasis; **high PMF impact for BPO / billing-to-client** models.

**PMF implication:** **Data accuracy upstream** reduces **offer delay** and **client billing disputes** — second-order driver of **volume SLA** and **candidate drop-out**.

---

### Theme 6 — Background Check Flexibility & Ecosystem Maturity

**Description:** India BGC is **variable**, sometimes **post-hire**; **re-initiation** UX poor; Genpact **Tydy** middleware signals **native integration depth** limits.

**Triangulation status:** **SME-strong**; customer mentions BGC **dependency on IDs**; CI — **SpringVerify / AuthBridge / First Advantage** as **shared ecosystem** with suites.

**PMF implication:** Compete on **orchestration, audit, vendor choice**, and **data passed once** — not on claiming **native Aadhaar eKYC**.

---

### Adjacent signals (tracked, lower consolidation weight)

• **No-show vs attrition KPI** (P3/P1) — process configuration and metrics hygiene.  
• **Resume parsing / Naukri / LinkedIn** — overlaps **010** Broadbean strategy; avoid “build native Naukri” recommendations; prefer **validated multipost** and **sourcing integrations** language.  
• **Attendance data persistence** (P3) — largely **HCM / Time**; flag for **cross-product** route, not Recruiting-only roadmap.

---

## Triangulation Matrix (SME × Customer × Competitive Intelligence)

| Consolidated theme | SME view | Customer view | Competitive intelligence (101) | Convergence | Divergence | PMF impact |
|--------------------|----------|----------------|--------------------------------|-------------|------------|------------|
| **1 Trust, identity & record integrity** | Fraud, impersonation, 200K dupes, merge limit 2 | Source ownership bug, 1 FTE/site dup checks, Aadhaar as dedupe key | UDMF Native; Aadhaar gov not native; BGV partners ubiquitous | **High** | SMEs less explicit on **last vs first source** | **Critical** — financial + legal exposure |
| **2 Mass hiring & offer velocity** | 100–200 roles, mass actions, Accenture scale | 12k/2 mo, 100–150 offers/day, 400–500 stuck, no mass offers | Bulk grid Native; suites market AI volume | **High** | — | **Critical** — system-of-record risk |
| **3 Government IDs & documents** | Document box, pre-interview ID, Lowe’s docs | Not mandatory, OTP fails, 15–17% drop-off | Zoho/SpringVerify doc automation; Workday partner path | **High** | — | **High** — KYC operational + CX |
| **4 Channels & comms policy** | Opt-in kills reach; WhatsApp | Not raised | True gap SMS +91, WhatsApp; CPaaS workaround | **Medium (SME+CI)** | **Customer silent** | **High** — reach & RFP |
| **5 JR data, approvals, reporting** | Low emphasis | Offline approvals, cost centre drift, Excel, Thrive | Boards / workflow expectations in enterprise deals | **Medium** | **SME gap** | **High** for BPO |
| **6 BGC flexibility** | Post-hire, re-initiate, Tydy | IDs gate BGC | Same BGV partners as competitors | **Medium** | Customer less detailed | **Medium–high** |

---

## Competitive Landscape (from 101 — no duplicate CI research)

**Workday — credible anchors:** Hire-to-retire suite; **UDMF**; **Job Application BP + Core Connector / Studio** for BGV; configurable **consent / retention / purge** for DPDP programmes; **Hindi**; **bulk grid**.

**Workday — honest gaps (matrix / scan):** Native **+91 SMS** and **WhatsApp** in core Recruiting UI; **native direct Naukri-class multipost**; **UIDAI Aadhaar eKYC** not productised; advanced semantic AI without **HiredScore / Workday AI** SKU.

**Differentiation playbook:**

• **vs Darwinbox / Keka / greytHR / Zoho:** Concede **TCO and omnichannel packaging** where true; win on **global template**, **security operating model**, **UDMF depth**, **processor governance**, and **single candidate record** across HCM — **if** integrity and volume themes are funded.  
• **vs SAP / Oracle:** Contest **integration tax** and **unified architecture** where Workday is deployed end-to-end; respect **SmartRecruiters** and **agentic** narratives with **human oversight, logging, and DPDP-aligned AI story** (PESTEL legal factor).  
• **vs Naukri / board ecosystem:** Do **not** recommend Workday build native board integrations (**010**); **validate Broadbean** (or approved multipost) per deal and document architecture for security reviews. **Naukri AI** pre-screening outside Workday (P2) is **compensating control** risk — address via **sourcing workflow and data handoff**, not denial.

---

## Cross-Theme Insights

• **KYC × volume:** Fraud surface and **per-candidate verification burden** **multiply** at TP/Accenture scale; fixes must be **batch-safe** and **auditably logged**.  
• **Financial liability thread:** Wrong **source**, wrong **cost centre**, wrong **offer PDF** — all hit **contracts and audits**; roadmap should treat them as one **data integrity** programme with Recruiting + HCM touchpoints.  
• **DPDP clock:** PESTEL notes phased obligations through **May 2027** for core conduct — product and collateral must support **notice, consent evidence, retention, erasure, breach** (**060**).  
• **“Offer tool only” risk (P3):** Without **interview, analytics, and sourcing** depth, Workday remains a **partial ATS** in high-volume India accounts — **Thrive** and **Naukri** fill gaps today.

---

## Product Roadmap Impact Summary (RICE — dual-dimension)

**Strategic context** (from `research/India/strategy-context-2026-03-30-IN-PMF-001.md` and Q2 priorities referenced therein):

• India **scale growth** and **8 Q2 wins**; explicit **DPDP** and **local job boards**.  
• **Core ATS parity** — bulk, mobile, BGV, Paradox activation.  
• **AI matching** — credible with **human review** and India **DPDP / AI governance** framing.

**Formula:** Composite Impact = (Business Impact + Customer Impact) / 2; RICE = (Reach × Composite Impact × Confidence) / Effort.

---

### Priority 1 (highest RICE / non-negotiable integrity)

**1. UDMF India enterprise integrity programme — first source within cooling, automated duplicate detection at upload, bulk merge, recruiter UX**

• **Action:** Implement **first-touch / first-approved-source-wins-within-cooling-period** rules (configurable); **automatic duplicate evaluation** on agency upload (reduce manual checkbox dependency); raise **auto-merge batch limits** for extreme scale; **cooling-period and source** visible on approval screens; decouple **vendor upload approval** from **rehire blocking** where compliance allows (per **060**).  
• **Reach:** 20,000 recruiter/admin workflows (India + comparable GCC agency-heavy tenants, conservative).  
• **Business Impact:** **3.0** — India scale growth, DPDP-aligned accuracy and auditability, core ATS parity on data integrity.  
• **Customer Impact:** **3.0** — P1/P2 financial liability, 1 FTE/site waste, “pile of cases.”  
• **Composite Impact:** **3.0**  
• **Confidence:** **90%**  
• **Effort:** **10** pm  
• **RICE:** (20,000 × 3.0 × 0.90) / 10 = **5,400**  
• **Competitive angle:** **Defend and extend** the **UDMF Native** lead vs suites with unproven dedupe depth; pair with **SpringVerify / AuthBridge / FADV** stories without conceding record integrity.

**Strategic tension:** None material — Business and Customer both maxed.

---

**2. Offer lifecycle flexibility — rescind/regenerate post-acceptance, batch start-date changes, versioning, role design**

• **Action:** Product and **deployment pattern** for **rescind and reissue**; **regenerate for compensation / benefit / date / location** changes with **version history**; **batch cohort updates**; fix **security policy** gaps blocking rescind at tenants like TP.  
• **Reach:** 8,000  
• **Business Impact:** **3.0** — India volume hiring, compliance-ready documentation.  
• **Customer Impact:** **3.0** — 400–500 live backlog, manual legal-reviewed emails outside Workday.  
• **Composite Impact:** **3.0**  
• **Confidence:** **90%**  
• **Effort:** **6** pm  
• **RICE:** (8,000 × 3.0 × 0.90) / 6 = **3,600**  
• **Competitive angle:** **SAP/Oracle** win on **process completeness** narratives; removing **manual offer** workarounds neutralises **audit** objections.

---

**3. Regional marketing communication configuration — opt-out default where legally viable + unsubscribe + channel roadmap**

• **Action:** **Region-configurable** marketing comms model (opt-in vs opt-out) with **unsubscribe** and **logging**; align India rollout to **DPDP** and marketing law (**060**); **roadmap** native **WhatsApp** / **+91 SMS** with **CPaaS** interim playbooks per matrix (no expanded native SMS claims until **DA** conflict resolved).  
• **Reach:** 20,000  
• **Business Impact:** **2.5** — India/GCC reach; slightly below 3.0 due to legal dependency and channel True gaps.  
• **Customer Impact:** **2.0** — **SME-quantified** 10× reach; **customers not raised** (adoption / segment gap).  
• **Composite Impact:** **2.25**  
• **Confidence:** **75%**  
• **Effort:** **4** pm (config + templates + legal; **excludes** full WhatsApp build)  
• **RICE:** (20,000 × 2.25 × 0.75) / 4 = **8,437**  
• **Strategic tension:** **Customer Impact 2.0 vs Business 2.5** — strong **SME** signal but **TP blind spot**; validate with **India pipeline customers**.  
• **Competitive angle:** Closes narrative gap vs **Zoho / suites** on **reach** without falsely claiming **native** SMS.

---

### Priority 2 (PM mission themes — structural investments)

**4. Mass hiring operations suite — batch offers, bulk approvals, purge/disposition at scale**

• **Reach:** 8,000  
• **Business Impact:** **3.0**  
• **Customer Impact:** **2.5** (P2/P3 no mass offers; SME cohort stories)  
• **Composite:** **2.75**  
• **Confidence:** **85%**  
• **Effort:** **10** pm  
• **RICE:** (8,000 × 2.75 × 0.85) / 10 = **1,870**  
• **Competitive angle:** Match **Darwinbox / greytHR** volume **demos** with **enterprise-grade controls** and **audit**.

---

**5. India Know Your Candidate — upfront government IDs, parallel capture, OTP reliability, candidate attachment hub, interviewer prompts**

• **Reach:** 8,000  
• **Business Impact:** **3.0** — explicit mission theme + DPDP minimisation story.  
• **Customer Impact:** **2.5** — strong P3/P2; 15–17% drop-off multi-causal.  
• **Composite:** **2.75**  
• **Confidence:** **85%**  
• **Effort:** **12** pm (flows + integrations + **060**)  
• **RICE:** (8,000 × 2.75 × 0.85) / 12 ≈ **1,558**  
• **Competitive angle:** Compete with **Zoho SpringVerify** doc automation via **partner + UX**; avoid **native UIDAI** claims.

---

**6. BGC flexibility enhancements — post-hire continuation, one-click re-initiation, parallel drug/BGC, richer vendor payload**

• **Reach:** 5,000  
• **Business Impact:** **2.5**  
• **Customer Impact:** **2.0**  
• **Composite:** **2.25**  
• **Confidence:** **75%**  
• **Effort:** **8** pm  
• **RICE:** (5,000 × 2.25 × 0.75) / 8 ≈ **1,055**

---

**7. Requisition quality & in-product approvals — HM-led JR where appropriate, workflow, validation rules**

• **Reach:** 5,000  
• **Business Impact:** **2.5**  
• **Customer Impact:** **2.5**  
• **Composite:** **2.5**  
• **Confidence:** **70%**  
• **Effort:** **8** pm  
• **RICE:** (5,000 × 2.5 × 0.70) / 8 ≈ **1,094**

---

**8. Recruiting manager dashboards & context-rich notifications**

• **Reach:** 5,000  
• **Business Impact:** **2.0**  
• **Customer Impact:** **2.0**  
• **Composite:** **2.0**  
• **Confidence:** **70%**  
• **Effort:** **5** pm  
• **RICE:** (5,000 × 2.0 × 0.70) / 5 = **1,400**

---

## E2E Handoff: Research Recommendations

| # | Title | Action | Reach | Impact (C) | Business | Customer | Comp. | Conf. | Effort (pm) | RICE | Legal / compliance (060) |
|---|-------|--------|-------|------------|----------|----------|-------|-------|-------------|------|---------------------------|
| 1 | UDMF India integrity — source + auto-dedupe | First-source-within-cooling rules; auto duplicate check on agency upload; bulk merge; approval UX; rehire/vendor approval decouple where allowed | 20,000 | 3.0 | 3.0 | 3.0 | 3.0 | 90% | 10 | 5,400 | DPDP accuracy/retention; agency contracts; audit logs; automated disposition **Art. 22 EU** if any auto-reject |
| 2 | Regional comms opt-out + channel roadmap | Configurable marketing comms default by region; unsubscribe; WhatsApp/SMS roadmap + CPaaS runbook; no expanded native SMS claims until DA reconciled | 20,000 | 2.25 | 2.5 | 2.0 | 2.25 | 75% | 4 | 8,437 | DPDP consent/notice; marketing rules; processor contracts for CPaaS |
| 3 | Offer rescind/regenerate + cohort updates | Rescind/reissue; regenerate after acceptance; version history; batch start-date change; fix role restrictions | 8,000 | 3.0 | 3.0 | 3.0 | 3.0 | 90% | 6 | 3,600 | Employment law; e-signature validity; right-to-explanation on material terms |
| 4 | Mass hiring operations suite | Batch offers; bulk approvals; mass disposition/purge patterns; cohort operations | 8,000 | 2.75 | 3.0 | 2.5 | 2.75 | 85% | 10 | 1,870 | DPDP minimisation on purge; SOX / client audit for BPO |
| 5 | India KYC — government IDs + document hub | Mandatory parallel Aadhaar/PAN/UAN; OTP reliability; candidate attachment area; interviewer ID confirmation prompts | 8,000 | 2.75 | 3.0 | 2.5 | 2.75 | 85% | 12 | 1,558 | DPDP; UIDAI regulated use; **EU AI Act** if biometric/facial recognition contemplated |

**Note:** RICE rank order is **not** identical to **sequenced PRD** order — **#1** and **#3** address **live financial and compliance exposure**; **#2** leads RICE but requires **060** gating. **PM** should select **1 + 3 + 5** for **KYC + volume** mission focus, or **1 + 2 + 3** for **reach + crisis** — Step 13 HITL.

---

## SME Structured Output (for 130 deck consumption)

**Market:** India — Workday Recruiting  
**Mission:** IN-PMF-001  
**Headline PMF gaps:** (1) **Record integrity** — duplicates and **source attribution** at agency scale; (2) **Offer velocity** — post-acceptance change; (3) **Government ID** capture and **OTP** reliability; (4) **Channel reach** — opt-in model vs India behaviour; (5) **JR/approval** fidelity for BPO billing.  
**Top quotes (anonymized customers):** P2 — last source vs first; “pile of cases.” P1 — 400–500 wrong offers. P3 — 15–17% drop-off; government IDs not mandatory.  
**Top SME signals:** Bernie — fraud at 100k resumes/mo; Santosh — opt-in reach; Lodola — impersonation; Phillips — 200K dupes / merge limit.  
**Competitive headline:** **UDMF + BGV framework** vs **suite omnichannel + Zoho doc automation**; **honest gaps** on **SMS, WhatsApp, Naukri native, UIDAI**.  
**Recommended roadmap labels for slides:** **Integrity** | **Velocity** | **Identity & documents** | **Reach** | **Fidelity & visibility**  
**RICE leaders:** Regional comms config (8,437); UDMF integrity (5,400); Offer flexibility (3,600).

---

## Appendix — Legal and compliance flags (advisory — Step 10)

• **DPDP:** Notice, consent, withdrawal, retention, processor contracts, breach readiness (PESTEL Legal; **060**).  
• **EU AI Act:** Fraud AI, facial recognition, automated ranking — **high-risk** pathway; human oversight mandatory if in scope.  
• **Aadhaar:** Regulated authentication; **partner-mediated** patterns only; no over-claim.  
• **Manual offers outside Workday:** Undermines **audit trail** and **personal data** accountability — treat as **incident-class** risk until resolved.

---

## Appendix — Method references

• Braun & Clarke (2006) thematic analysis — six phases.  
• Triangulation: SME + Customer + **101** CI (106/108 absent).  
• RICE: Enhanced dual-impact skill; strategy context **IN-PMF-001** business-impact table.

---

**Disclaimer:** This document supports product strategy and prioritisation; it is **not** legal advice. Bindings interpretations belong to **counsel** and **060**.

**Next steps:** Step **10** — **060** review of roadmap recommendations; Step **11** — **130** deck from this report; Step **12** — mission cleanup.
