# GCC Recruiting PMF Analysis - v57

**Analysis Date:** 24 March 2026  
**Mission ID:** GCC-E2E-017  
**Methodology:** Braun & Clarke (2006) 6-phase thematic analysis  
**Analyst:** 120-pmf-thematic-analysis (Step 2b)

---

## Executive Summary

GCC enterprise recruiting interviews (P1–P3) converge on workflow friction in core ATS tasks, omnichannel and mobile expectations, and compliance-adjacent configuration tax (nationalisation targets, interview logistics, documents). Step 1 competitive intelligence (**101**, GCC-E2E-017) sharpens the commercial frame: Oracle markets a packaged WhatsApp path; SAP pushes connected hiring and AI copilots; regional suites (Bayzat, Zoho) bundle Arabic, messaging ecosystem, and statutory adjacency (e.g. Mudad narrative). Fresh Deployment Agent reconciliation for this mission flags SMS to GCC via standard Workday Messaging as US-only (True Gap) and first-party WhatsApp in core Recruiting UI as True Gap, with Paradox as public workaround for conversational journeys; validate per tenant before bake-off claims (drift vs earlier E2E missions is explicit in the scan).

**Top customer-converged themes:** (1) Candidate review density and navigation tax (3/3), (2) Reporting and dashboard limits driving PowerBI / Excel spill-over (3/3), (3) Search and prioritisation at scale (2–3/3). **GCC-flavoured differentiators:** WhatsApp as default channel for some employers (P1, P2) vs enterprise comms policy forbidding WhatsApp (P3); nationalisation tracking via custom fields (P1, P2) vs franchise markets with manual local reporting (P3).

**Product implication (summary):** Prioritise scheduling and compliance hints, honest omnichannel packaging (Paradox, CPaaS, regional SMS reality), unified review surfaces, and OOB nationalisation reporting to reduce custom field debt, while closing document and offer rigidity called out in interviews and echoed in **101** RTL / document discussion.

---

## 105 inputs (this run)

**Source:** [`research/GCC/105-user-research-findings.md`](../../105-user-research-findings.md)

- **Mission ID (105 attestation):** GCC-E2E-017  
- **Phase 1 transcript re-read (this 120 run):** Primary `.txt` files were re-opened end-to-end for familiarisation; **105** markdown was not used as a substitute for transcript ingestion.
  - `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`
  - `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`
  - `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`
- **SME transcripts:** None present in folder (0 files); triangulation is customer-only for primary qual.
- **Alignment:** This section confirms the same file set as **105** `## Fresh pass attestation` for GCC-E2E-017.

---

## 101 Competitive Intelligence inputs (Step 1)

**Matrix:** `research/competitive/matrices/gcc-competitive-matrix.md` (changelog **2026-03-24 – GCC-E2E-017**, matrix v1.7)  
**Point-in-time report:** `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`  
**Deployment Agent thread (101 log):** `593c667b-32ad-43c3-83bf-0c82ddbcf84e`

**Synthesis (no additional web research for competitors):**

- **Market structure:** Evaluations split among GCC-first bundled suites, value ATS (Zoho + marketplace), and global stacks (Workday, SAP, Oracle). March 2026 SAP narrative: SmartRecruiters for SAP SuccessFactors with Joule / Winston-style assistance over time (validate SKU per tenant).
- **Workday parity grid (E2E-017):** Arabic UI / RTL shell Native (UAT for edge cases); RTL complex documents classified Native on this thread (drift vs E2E-014/015/016); SMS to GCC via standard WMS True Gap (US-only); WhatsApp first-party in core UI True Gap; Paradox workaround for WhatsApp-shaped flows (public January 2026 Workday newsroom; DA had no Paradox detail); Qiwa/Mudad recruiting exchange True Gap; MOHRE Workaround; nationalisation dashboards Workaround; core semantic AI match without optional SKUs True Gap; regional multipost Workaround; sequential candidate review on req Native.
- **Competitive pressure:** Oracle documented WhatsApp channel for Recruiting Cloud; Zoho Arabic and Feb 2026 automation/telephony additions; Bayzat Mudad/payroll adjacency and AI hiring story.

**Citation:** All competitor claims in the **Competitive Landscape** section below trace to the scan file and matrix changelog above.

---

## Methodology

### Phase 0: Geographic filtering

- **`research/GCC/raw-data/`:** No `.csv` files present for this mission.  
- **Brainstorm / win-loss (106 / 107):** Not in scope for triangulation inputs: `brainstorm-sessions/` and `win-loss-interviews/` contain `.xlsx` only, not `.txt`/`.csv`/`.xls` text sources per orchestrator Step 2.5 / 2.75 rules; **106** and **107** were skipped.

### Phase 1: Familiarisation

- Re-read all three customer transcripts listed under **105 inputs**.  
- No SME `.txt` files.  
- **Initial patterns:** Tab navigation, scheduling outside Workday, offer rigidity, nationalisation capture, channel mix (WhatsApp vs policy-bound email/SMS/Teams), reporting exit to PowerBI / Excel.

### Phase 2: Initial codes (illustrative sample)

| Code | Sources | Freq. (indicative) | Example anchor |
|------|---------|-------------------|----------------|
| Req-assignee-blocker | [Customer] | 1 | P1 moving candidates across reqs |
| Notes-before-screen-stage | [Customer] | 1 | P1 exploratory call notes |
| Funnel-metrics-uncertainty | [Customer] | 1 | P1 historic req stats |
| End-to-end-vs-pockets | [Customer] | 1 | P1 scheduling in other system |
| Offer-rigidity-offline | [Customer] | 1 | P1 two-month change cycles |
| Post-offer-doc-upload | [Customer] | 1 | P1 email vs confidential upload |
| KSA-panel-notice-rules | [Customer] | 1 | P1 3-day notice, panel nationality |
| Nationalisation-fields | [Customer] | 2 | P1 quotas; P2 penalties |
| Tab-sprawl-candidate-grid | [Customer] | 2 | P2 education/CV tabs at volume |
| Boolean-weak-semantic-want | [Customer] | 2 | P2 2M database match |
| Scheduling-vs-Outlook | [Customer] | 1 | P2 trial harder than Outlook |
| WhatsApp-campaigns | [Customer] | 2 | P1 necessary; P2 Phenom |
| Career-site-redirect | [Customer] | 1 | P2 Phenom → Workday hops |
| Mobile-apply-share | [Customer] | 1 | P2 ~40%+ handheld traffic |
| PowerBI-exit | [Customer] | 1 | P3 dashboards insufficient |
| Franchise-manual-reporting | [Customer] | 1 | P3 Excel for tiny volumes |
| Arabic-docs-squares | [Customer] | 1 | P3 Workday Docs history |
| WhatsApp-policy-ban | [Customer] | 1 | P3 Shell official channel policy |
| High-volume-prioritisation | [Customer] | 1 | P3 hundreds of CVs vs few roles |

### Phases 3–5: Theme generation, review, naming

- Clustered codes into eight themes (see below).  
- **Triangulation:** Customer-only (no SME column); **101** used for competitive column where noted.

### Phase 6: Report production

- This document, plus PESTEL, Competitive Landscape (**101**-only), SWOT, Win/Loss DATA GAP, Ideation DATA GAP, Roadmap, E2E Handoff.

---

## PESTEL Analysis (GCC recruiting context)

**Note:** Legal factor summarises public frameworks; customer-reported practices (e.g. P1 interview notice) are not treated as statutory text without primary legal citation. **060** should validate citations before executive-facing hard commitments.

### Political

- Nationalisation programmes (Saudization, Emiratization, Kuwaitization) shape hiring quotas and reporting; P1 ties targets to Workday fields and decisions.  
- Vision 2030-style workforce localisation narratives continue to elevate compliance in RFP criteria (regional press and government comms; validate per country).  
- Government portals (Qiwa, Mudad, MOHRE) appear in **101** as integration and reporting pressure points (True Gap / Workaround mix).

**Product implication:** Treat nationalisation and portal expectations as first-class roadmap inputs paired with enablement that separates payroll statutory (Bayzat Mudad story) from recruiting scope to avoid apples-to-oranges losses.

### Economic

- Enterprise consolidation on single HCM stacks (P2 migration from Taleo; cost of multiple tools).  
- GCC smartphone market revenue and penetration remain high; Statista-style outlook cites strong GCC smartphone adoption and UAE penetration above 90% in recent industry summaries (see [Statista GCC smartphones outlook](https://www.statista.com/outlook/cmo/consumer-electronics/telephony/smartphones/gcc), [MENA smartphone penetration](https://www.statista.com/statistics/1190185/mena-smartphone-penetration-rate-forecast-by-region/)).  
- Vendor bundling (HR + payroll + insurance) competes on TCO vs best-of-breed depth (**101** executive summary).

**Product implication:** Mobile experience and integration tax are economic decision drivers; reduce tool sprawl with credible packaged scheduling, messaging, and career site paths.

### Social

- Bilingual hiring: English for professional roles; Arabic critical for operational cohorts per P2.  
- WhatsApp as default personal messaging norm in GCC; P1 describes near-immediate responses vs email latency.  
- Employer brand and fraud concerns (P3) push official channels (email, SMS, Teams) despite regional WhatsApp norms.

**Product implication:** Support configurable official channels and auditable threads so global policy and local behaviour both fit, without forcing a single channel.

### Technological

- AI-assisted matching and semantic search are buyer expectations (P2, P3; **101** True Gap on core semantic without optional SKUs).  
- Paradox through Workday is public 2026 positioning for conversational workflows (**101**); Oracle and Zoho ship competing automation narratives.  
- Sequential review on req is Native per **101**; differentiation moves to single-surface density and fewer tab switches.

**Product implication:** Activate HiredScore and Paradox where licensed, and close honest gaps in core search and AI narrative with roadmap clarity.

### Environmental

- **DATA GAP** for direct recruiting environmental mandates in this dataset. Optional watch: national net-zero commitments may indirectly shape employer branding and location policy, not ATS features.

**Product implication:** Do not claim recruiting features from Environmental factor in this pass; **130** should retain a DATA GAP or minimal slide unless the PM adds sustainability hiring requirements.

### Legal

- UAE PDPL (Federal Decree-Law No. 45 of 2021) establishes data subject rights and lawful bases relevant to recruiting and screening (see e.g. [Addleshaw Goddard briefing](https://addleshawgoddard.com/en/insights/insights-briefings/2021/data-protection/uae-federal-data-protection-law-2021), [Practical Law pre-employment screening UAE](https://content.next.westlaw.com/practical-law/document/Iafe9446392a511e9adfea82903531a62/Pre-Employment-Screening-and-Data-Protection-Law-Requirements-UAE?contextData=%28sc.Default%29&transitionType=Default&viewType=FullText)).  
- KSA and other GCC PDPL-class regimes increase consent, retention, and cross-border scrutiny on candidate data (high-level; **060** to validate per country).  
- Sensitive attributes (nationality, gender, PWD) collected for compliance per P1; design must respect minimisation and local law on special categories where applicable.  
- P1 describes interview scheduling rules (three-day notice, panel composition) as operational compliance; treat as requirements input for scheduling UX (warn / document consent) pending legal confirmation.

**Product implication:** Scheduling nudges, audit trails, and in-product document collection reduce email leakage risk and support PDPL-class transparency; pair with **060** before mandatory blocking behaviour in KSA flows.

---

## Competitive Landscape (sourced from 101, GCC-E2E-017 only)

### Regional and value ATS

- **Bayzat:** GCC HR + payroll + ATS narrative, Mudad-centric payroll, AI hiring pages, Whitecarrot partnership (scan Competitor Profiles).  
- **Zoho Recruit:** Published pricing, Feb 2026 What's New (job alerts, screening bot, telephony, shared ownership), Arabic language support cited on vendor blog.  
- **HiBob:** Bob Hiring and AI CV summaries; GCC office not confirmed this pass.

### Global enterprise stacks

- **Oracle:** WhatsApp channel for Recruiting Cloud (Redwood, Recruiting Booster, provider ecosystem); 26A gen AI skills suggestions cited in scan.  
- **SAP:** SmartRecruiters integration into SuccessFactors (Mar 2026 press); Winston / Joule positioning for AI assistance.  
- **Workday:** See feature table and Workday Competitive Response in `gcc-competitive-scan-2026-03-24-GCC-E2E-017.md` (parity grid and six response bullets: platform depth, omnichannel honesty, Arabic/RTL UAT, nationalisation workaround acknowledgement, SAP narrative testing, statutory vs recruiting framing).

---

## SWOT — Workday Recruiting in GCC (aligned to 101 + interviews)

| | **Strengths** | **Weaknesses** |
|---|----------------|----------------|
| **Internal** | Enterprise workflow depth, security, audit; sequential review Native; Arabic UI / RTL broadly Native (per E2E-017 DA) | First-party WhatsApp True Gap; GCC SMS via WMS True Gap; core semantic match True Gap without optional SKUs; nationalisation dashboards Workaround |
| **External** | Paradox path for conversational journeys; HiredScore when activated; Broadbean multipost story (per **010** style guide) | Oracle packaged WhatsApp; SAP connected hiring noise; Bayzat bundled TCO + Mudad adjacency |

| | **Opportunities** | **Threats** |
|---|-------------------|------------|
| **External** | Unified review surface matches P1–P3 pain; scheduling plus GCC hints differentiate vs Outlook toggle | Buyers conflate payroll statutory with recruiting parity; SMS / RTL drift across DA threads erodes trust if unresolved |

---

## Win / Loss and Ideation Hub

### Win-Loss analysis (107)

**DATA GAP:** **107** was not run (orchestrator rule: `win-loss-interviews/` lacks `.txt` / `.csv` / `.xls` sources; only `.xlsx` present). Do not infer win-loss themes from prior markdown without fresh **107**.

### Customer ideation / opportunity CSV

**DATA GAP:** No `research/GCC/raw-data/*.csv` in repo for this mission.

---

## Thematic analysis — defined themes

### Theme 1: Candidate review density and navigation tax

**Description:** Recruiters lose time across tabs, restricted notes, and assignee rules when moving candidates.

**Triangulation:** Customer 3/3 (P1 assignee and notes; P2 education vs CV; P3 prioritisation at volume). SME: n/a. **101:** Sequential review Native but does not remove tab burden.

**Evidence (quotes):**

> "Rather than having go through multiple different tabs, can most of the important information be integrated … in a more seamless way." — **P2** (Baker Hughes)

> "Why doesn't the system allow me that capability … it took me another what 5 10 minutes to go and assign the roles and then move the canvas across." — **P1** (Accenture)

**PMF impact:** High for enterprise GCC and global high-volume recruiters.

**Product roadmap impact:** Single-surface review (summary, CV, timeline, notes) plus policy review on pre-stage notes.

---

### Theme 2: Search, matching, and AI-assisted discovery

**Description:** Boolean and field search feel weak; buyers want database-wide match and ranking.

**Triangulation:** P2 explicit (2M candidates); P3 (HiredScore / AI exploration); P1 AI for workflow and insight. **101:** Core semantic True Gap without optional SKUs.

**Evidence:**

> "Can I look at all of the people in our database [and] who are the people that have not applied for this job but are matching." — **P2** (Baker Hughes)

**PMF impact:** High competitive parity risk vs SAP, Zoho, Oracle narratives.

**Product roadmap impact:** Ship clear SKU story for HiredScore; improve Boolean and similar-candidate surfacing in core where feasible.

---

### Theme 3: Interview scheduling friction and end-to-end orchestration

**Description:** Scheduling often outside Workday or feels harder than Outlook; desire for notifications, HM slots, and GCC logistics.

**Triangulation:** P1 strong (external tool, end-to-end ask); P2 (trial vs Outlook); P3 indirect (ops model). **101:** Paradox workaround for advanced scheduling.

**Evidence:**

> "The system should manage the end to end process not just pockets of it and pockets are manage through a different … website." — **P1** (Accenture)

> "It felt more complicated than scheduling a meeting via Outlook." — **P2** (Baker Hughes)

**PMF impact:** High; ties to Paradox integration and KSA scheduling hints from P1.

**Product roadmap impact:** Deep Paradox integration plus configurable warnings for customer-validated KSA rules (notice, panel composition) after **060** review.

---

### Theme 4: Offers, documents, and configuration rigidity

**Description:** Offers break outside pre-configured bands; document automation failed for Arabic glyphs historically per P3; P1 wants in-system post-offer document upload.

**Triangulation:** P1 and P3 explicit; **101** RTL documents Native on E2E-017 DA (contradicts P3 historic experience — treat as tenant and template validation item).

**Evidence:**

> "Every time we say … we need this included, we're given a two months deadline for developers." — **P1** (Accenture)

> "It would just be squares rather than the actual characters." — **P3** (Shell)

**PMF impact:** High for GCC Arabic offers and fast-moving grade exceptions.

**Product roadmap impact:** Faster safe config patterns for offer exceptions; document QA for Arabic templates; structured candidate document collection in flow.

---

### Theme 5: Nationalisation, diversity, and OOB compliance reporting

**Description:** GCC customers track nationality, gender, PWD targets with custom fields; penalties if missed (P2).

**Triangulation:** P1, P2 strong; P3 (franchise / Excel — lower Workday cadence). **101:** Nationalisation dashboards Workaround.

**Evidence:**

> "If you're able to add more in terms of the local requirements … more out of the box … versus … bandaids." — **P2** (Baker Hughes)

**PMF impact:** High in GCC RFP and retention.

**Product roadmap impact:** OOB dimensions and audit-ready reports for KSA, UAE, Kuwait (validate list with legal).

---

### Theme 6: WhatsApp, campaigns, and channel policy divergence

**Description:** WhatsApp essential for some GCC teams; others ban official WhatsApp use (fraud / brand).

**Triangulation:** P1 and P2 vs P3. **101:** WhatsApp True Gap first-party; Paradox workaround; Oracle native comparison.

**Evidence:**

> "WhatsApp is an absolute necessary … you get immediate responses, almost immediate responses." — **P1** (Accenture)

> "We just avoid … WhatsApp … classified as something that we … can't use for official business." — **P3** (Shell)

**PMF impact:** High commercial and policy dimension.

**Product roadmap impact:** Package Paradox WhatsApp where allowed; strengthen email, SMS, and Teams patterns plus two-way email ingest for policy-bound tenants; align GCC SMS enablement story with E2E-017 DA (PS validation).

---

### Theme 7: Mobile-first apply and career site experience

**Description:** Large mobile apply share; multi-hop career site hurts experience.

**Triangulation:** P2 (~40%+ mobile); P1 / P3 aligned on digital journeys. **101:** Regional competitors stress mobile and branding.

**Evidence:**

> "Almost say 40% or more actually coming via a mobile or a handheld device." — **P2** (Baker Hughes)

**PMF impact:** Medium–High for candidate NPS and conversion.

**Product roadmap impact:** Mobile apply optimisation; reduce redirect chains where customers stay on Workday career site or approved partner pattern.

---

### Theme 8: Reporting, dashboards, and BI spill-over

**Description:** In-app dashboards insufficient; PowerBI / Excel used for ops and leadership cuts.

**Triangulation:** P1 (dashboard readability and export rebuild); P3 (PowerBI since 2022–23); P2 (team feedback on data presentation). **101** nationalisation Workaround reinforces report tax.

**Evidence:**

> "The dashboard capabilities of workday was not able to accommodate what we needed." — **P3** (Shell)

**PMF impact:** High for enterprise governance.

**Product roadmap impact:** Recruiter and exec dashboard templates; funnel per req clarity; franchise-aware export patterns.

---

## Triangulation matrix (customer-only primary qual)

| Theme | Customer view (P1–P3) | SME view | 101 / CI lens | Convergence | PMF impact |
|-------|-------------------------|----------|---------------|-------------|------------|
| 1 Review density | Strong 3/3 | n/a | Sequential Native ≠ single surface | High | High |
| 2 Search / AI | Strong 2–3/3 | n/a | True Gap core semantic | High | High |
| 3 Scheduling | Strong 2/3 | n/a | Paradox workaround | Medium–High | High |
| 4 Offers / docs | Strong 2/3 | n/a | RTL Native (DA drift vs P3 history) | Medium (validate) | High |
| 5 Nationalisation | Strong 2/3; P3 nuanced | n/a | Workaround today | High for GCC enterprise | High |
| 6 Channels | Split policy | n/a | WhatsApp gap vs Oracle | Medium | High |
| 7 Mobile / career site | P2 lead | n/a | Competitor mobile stress | Medium | Medium–High |
| 8 Reporting | Strong 3/3 | n/a | Custom nationalisation | High | High |

---

## Cross-theme insights

- **Convergence:** Tab sprawl, reporting exit, and scheduling fragmentation co-occur with **101** gaps on omnichannel and semantic AI.  
- **Tension:** WhatsApp norms vs global enterprise comms policy requires configurable architecture, not one channel only.  
- **Risk:** DA drift on SMS and RTL documents must be resolved with PS before roadmap claims land in sales decks.

---

## Legal and compliance note (060 handoff)

Before **130** and executive readouts, **060** should validate PESTEL Legal citations, AI Act and GDPR posture for any automated matching, and sensitive attribute collection for nationalisation fields. Scheduling “block vs warn” behaviour for KSA must not ship as mandatory without legal sign-off.

---

## Product Roadmap Impact Summary

### Priority 1 (high impact + strong customer convergence and/or competitive exposure)

1. **Interview scheduling and end-to-end orchestration** — Deep Paradox and calendar experience so recruiters avoid parallel tools; design GCC scheduling hints for customer-described KSA constraints (warn and audit first).  
2. **Omnichannel candidate engagement (honest packaging)** — Position Paradox for WhatsApp-shaped journeys; clarify GCC SMS path per E2E-017 DA (US-only WMS, custom CPaaS) vs competitor claims; strengthen email, SMS, and Teams for policy-bound tenants.  
3. **Unified candidate review surface** — Reduce tab navigation and align notes policy with pre-screen reality; preserve Native sequential review as complement.

### Priority 2 (medium–high impact, validation or dependency-heavy)

4. **Nationalisation and localisation reporting (OOB)** — First-class fields and dashboards for Saudization / Emiratization / Kuwaitization-style reporting to replace custom “bandaids”.  
5. **Search upgrade and AI-assisted matching narrative** — Boolean improvements plus tenant SKU clarity for HiredScore and semantic capabilities vs “2M database” asks.  
6. **Mobile-first apply and career site path** — Optimise handheld apply (P2 evidence); reduce multi-hop Phenom → Workday friction where customers seek single ecosystem.  
7. **Recruiter and leadership dashboards** — Funnel per req, readable defaults, and LOB / location cuts to slow PowerBI exits.  
8. **Offer flexibility and Arabic document quality** — Faster safe paths for grade / band exceptions; template and tenant validation for Arabic documents given P3 history and E2E-017 DA drift.  
9. **Structured post-offer document collection** — Category-based candidate upload in Workday to replace email attachments (confidentiality and audit).

---

## E2E Handoff: Research Recommendations

| # | Title | Action |
|---|-------|--------|
| 1 | Interview scheduling and end-to-end orchestration | Deepen Paradox and calendar integration so scheduling and notifications live in Workday; add configurable GCC scheduling hints for customer-described KSA constraints (warn and audit trail first; legal validation before any hard block). |
| 2 | Omnichannel candidate engagement (honest packaging) | Package Paradox for WhatsApp-shaped journeys where licensed; align GCC SMS enablement story with E2E-017 Deployment Agent findings (WMS US-only; CPaaS custom); strengthen email, SMS, and Teams patterns for policy-bound tenants. |
| 3 | Unified candidate review surface | Deliver high-density single-surface review (summary, CV, timeline, notes); relax or redesign notes policy for pre-screen stages; complement existing Native sequential review on req. |
| 4 | Nationalisation and localisation reporting (OOB) | Ship first-class nationality and quota reporting for KSA, UAE, Kuwait-style mandates to replace custom field workarounds and reduce penalty risk. |
| 5 | Search upgrade and AI-assisted matching | Improve Boolean and field logic; clarify HiredScore and semantic SKU for database-wide matching and prioritisation at scale. |
| 6 | Mobile-first apply and career site path | Optimise mobile apply flows; reduce multi-hop career site redirects where customers target a single Workday-native or approved partner experience. |
| 7 | Recruiter and leadership dashboards | Improve in-product dashboards and per-requisition funnel analytics; support LOB and location cuts to reduce PowerBI and manual rebuild cycles. |
| 8 | Offer flexibility and Arabic document quality | Shorten safe configuration paths for offer exceptions outside standard bands; run tenant validation on Arabic and RTL document generation to reconcile historic customer issues with current DA classification. |
| 9 | Structured post-offer document collection | Enable category-based candidate document upload in Workday after offer acceptance to replace email-based exchanges and improve confidentiality and auditability. |

---

## Appendix

### Participant list

- **P1** — Recruiter Lead (Cyber Security & Campus Hiring), Accenture  
- **P2** — Performance & Innovation Manager (Global TA), Baker Hughes  
- **P3** — Product Owner (Talent & Resourcing), Shell  

### Data sources (this report)

- `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`  
- `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`  
- `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`  
- `research/GCC/105-user-research-findings.md` (attestation and cross-check only; Phase 1 used transcripts)  
- `research/competitive/matrices/gcc-competitive-matrix.md` (changelog GCC-E2E-017)  
- `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`  

---

**Report complete:** 24 March 2026 — **GCC-E2E-017** Step 2b (**120** only; no PowerPoint).  
**Next:** Orchestrator HITL on E2E Handoff table; optional **130** deck from this file after PM selection and **060** validation of recommendations.
