# User Research Findings: India Recruiting (TP Onsite Customer Interviews)

**Analysis Date:** 01 April 2026  
**Data Sources:** 2 customer interview transcripts (5 distinct participant voices across specialist/confidential and high-volume sessions)  
**Methodology:** Braun & Clarke-informed thematic synthesis (Continuous Discovery; story-based evidence)  
**PM context (mission):** New market entry; customer conversations emphasised **high-volume hiring** and **Know Your Candidate** (identity verification, fraud risk, government ID compliance). This Step 8 output surfaces those voices prominently.

---

## Fresh pass attestation

- **Mission ID:** INDIA-PMF-006  
- **Transcript files read (this run):**
  - `research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`
  - `research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`
- **SME files read (this run):** *None* (internal SME analysis completed in **Regional E2E Step 7**; this step is **customer transcripts only**.)
- **Completed (UTC):** 01 April 2026

---

## Scope note (Step 7 vs Step 8)

- **Step 7** produced `research/India/105-sme-research-findings.md` from internal SME transcripts.  
- **This document (Step 8)** synthesises **only** the two customer transcript files listed above. Triangulation with SME findings is **@pmf-analyst** responsibility in the PMF report.

---

## Strategic Alignment Assessment

**Step 1 Strategy Context:** `research/India/strategy-context-2026-04-01-INDIA-PMF-006.md`

**Alignment analysis**

- **High alignment**
  - **High-volume hiring / automation at scale:** Customers describe thousands of profiles per day, dedicated headcount for duplicate checks, and peak ramps (e.g. seasonal e-commerce). This supports Q2 themes of **AI-powered efficiency**, **core ATS parity** (bulk actions, workflow automation), and the PDF direction on **real process automation** and recruiter efficiency.
  - **Trust / fraudulent or duplicate applications:** Customers ask for stronger identity-aware deduplication (e.g. government ID) and describe financial exposure when source attribution is wrong. This aligns with roadmap items cited in strategy context (**Fraudulent App Detection (Phase 1)**; social login / fraudulent candidate narrative on PDF extracts).
- **Strategy-customer tension (to resolve in prioritisation)**
  - **India regional row** in Q2 priorities stresses **DPDP compliance** and **local job boards**; customers spent more airtime on **volume**, **dedupe**, **offer/ID gating**, and **operational reporting** than on job boards in these two sessions. PMF should not assume job-board coverage alone addresses the pain surfaced here.
- **Neutral / operational**
  - **Saturday maintenance windows** and **India working week** (high-volume session) are operational expectations; relevant to GTM and customer success, less to a single Recruiting feature epic.

**Implications for @pmf-analyst**

- Weight **volume-sensitive** capabilities (dedupe, vendor upload throughput, offer-letter agility, candidate communications) heavily in India recommendations.
- Treat **government ID capture, OTP reliability, mandatory gating, and BGV handoff** as first-class **Know Your Candidate** requirements, not only compliance footnotes.
- Explicitly cross-reference **105-sme-research-findings.md** for convergence/divergence on the same themes.

---

### Interview Participants

- **P1** - Recruitment Manager, TP (specialised internal recruiting; three-person team)
- **P2** - Recruitment Manager, TP (job requisition creation, candidate engagement, onboarding handoffs; large team)
- **P3** - Leadership / confidential hiring, TP (confidential requisitions, leadership pipeline, offer and compliance intensity)
- **P4** - Recruiting Manager, Agent hiring (India; high-volume frontline), TP
- **P5** - Frontline hiring lead, TP (North and East India; multi-site high volume)

---

### Key Findings per Participant

#### P1 - Recruitment Manager, TP

**Role context:** Runs day-to-day recruiting for specialised internal roles: sourcing, interview co-ordination, offer processing, and team management for three specialised recruiters (all internal to TP).

**Key quotes:**

> "So, these are the day-to-day activities with the candidate. Apart from that, of course, I being the manager, I need to maintain the attendance for my team."

> "They're all internal to TP."

**Pain points:**

- Balances hands-on recruiting with managerial duties (e.g. attendance), which competes with pipeline throughput.
- Operates in a **specialised** segment distinct from highest-volume agent hiring; still dependent on same enterprise processes (approvals, data quality) described elsewhere in the session.

**JTBD:** *Manage my assigned job requisitions*; *Manage candidates throughout the recruiting process*; *Maintain high standards of efficiency and effectiveness* (`docs/jtbd-recruiting-hr-professional-and-manager.md`).

---

#### P2 - Recruitment Manager, TP

**Role context:** Creates job requisitions in Workday after **email-based** demand and approval threads; focuses on candidate engagement and onboarding (push to payroll, no-show handling) rather than releasing every offer; manages a large recruiting organisation.

**Key quotes:**

> "On the emails we have approvals on emails it's not happening on right now and then once I have all of these approvals is when I raise a job requiring managers"

> "I'm raising them on work day as a job requisition but on email they come to us"

**Pain points:**

- **Friction between email approvals and Workday** requisition creation; recruiters carry **cost centre / LOB** detail that hiring managers do not always know, driving rework.
- **Time-to-offer risk:** Example given of **24 hours** lost correcting tables (line of business, cost centre) before an offer could be released for a senior hire.

**JTBD:** *Ensure that the details of each job requisition is accurate and up to date*; *Understand where in the approvals process a request or job requisition currently sits*; *Make a successful offer to the chosen candidate*.

---

#### P3 - Leadership / confidential hiring, TP

**Role context:** Leadership and **confidential** hiring: end-to-end from job requisition through offer; heavy reliance on **manual** approvals, document attachment, and parallel tools (**Thrive**) for dashboards; describes **800–900** career-site postings used tactically for candidate registration links.

**Key quotes (high volume + career site noise):**

> "we have 800 900 open position creating job for all of them then posting them externally"

> "there are I don't know n number of open positions which are not actually open because we have already identified the candidate for that we're just posting it online so that we can get that link"

**Key quotes (government ID / Know Your Candidate):**

> "you need to have all three IDs before an offer can be extended"

> "the candidate will upload one ID and then they're free to move forward. There's not stopping them but it will stop us to release the offer."

> "These are the unique government identifiates identity fraud or things like that to make sure that this becomes a major part of our background verification to check their identities"

**Key quotes (Aadhaar OTP / verification reliability):**

> "there are multiple times where candidates come back and say that we are not even receiving the OTP"

> "OTP will go to the registered mobile phone which is linked with the government identifiers"

**Pain points:**

- **Mandatory government ID policy vs weak UX gating:** Candidates can progress without completing all IDs; recruiters burn cycles renegotiating offers and chasing steps.
- **Offer drop-off:** Estimates **~16–17%** loss between offer release and join linked to process length and repeated steps; candidates **"anxious"** about repeated steps.
- **High-volume candidate review:** Example of **~700** applications for one requisition; must open profiles **one by one**; parser **not 100%** accurate (~60–70%), driving manual review.
- **Notifications:** Offers and tasks are easy to miss; recruiters phone candidates to check **task** UI; generic task emails (**thousands**) are not actionable.

**JTBD:** *Make a successful offer to the chosen candidate*; *Progress candidates through the stages of the pipeline as efficiently as possible*; *Maintain data integrity throughout the recruiting process* (IDs, audit trail).

---

#### P4 - Recruiting Manager, Agent hiring (India), TP

**Role context:** **Agent hiring** (grade bands A1/B2 level); security-scoped to India; **Kolkata** focus in discussion; typical **~100** hires/week (peak **~150**); **~800–1,000**/month in her span; cites **India-wide ~8,000–9,000**/month for TP India hiring.

**Key quotes (high volume):**

> "In a week… the numbers would be somewhere around 100… when there are peak, then we… it goes up to, say, 150?"

> "in a month, we hire around 800… 800 to 1,000"

**Key quotes (duplicates / agencies):**

> "for any application which comes in from DEFRIL, or from vendor, or a social media… it's a manual activity which a recruiter has to go… under that candidate profile, you have that duplicate check option."

> "if the recruiter is doing it, good. If not… if it is missed and later we identify that it was a duplicate, we lose out."

**Pain points:**

- **Supervisory organisation selection at scale:** With **~90,000** headcount geography and **2,000**/month hires, **random** supervisory-org tagging when business input is unclear; workaround is internal co-ordination, not a Workday defect per se but drives **misallocation risk**.
- **Vendor upload approval + duplicate check:** Recruiters must approve vendor uploads; at **100** profiles/day from a vendor, **dedicated** approvers are implied; removing approval clashes with **rehire / compliance** constraints (cannot delete employee data).

**JTBD:** *Source high quality candidates for active job requisitions*; *Determine if candidate meets requirements of the job*; *Meet my efficiency metrics as a recruiter*.

---

#### P5 - Frontline hiring lead, TP (North & East India)

**Role context:** Collectively with teams, **~1,500–2,000** hires/week across **8–9** sites; peak **~12,000** hires in **8–10** weeks; **July go-live** coincided with peak, causing **NTID / Workday credential** delays and lost training days.

**Key quotes (high volume / peak pain):**

> "when there was a peak… that's when we got really hit bad during our hiring this year"

> "we were not able to onboard people… delays in joining… we lost business days… their NTID creation got delayed"

**Key quotes (duplication / financial risk):**

> "We don't have a duplication check… it doesn't block… At times there is not even… information that it's a duplicate."

> "if that candidate gets hired, agency A who actually uploaded the profile first will not get paid."

**Key quotes (government ID in dedupe):**

> "Maybe social security number, just like we have Aadhar in India… if that duplication check is done on their ADHAR number, we'll be able to identify that."

> "that ID… is not being used as a validation in duplication."

**Key quotes (offers at volume):**

> "about 100 to 150 offers a day" (span described)

> "we're not able to… redo the offer letter for all the 20 people that were supposed to join the batch"

**Pain points:**

- **Duplicate detection** weaker than legacy tool (**cooling-off**, **source-of-truth** on agency, **first-source attribution**); **financial** and compliance exposure.
- **Offer letter rigidity:** Difficulty regenerating / resending after **compensation** or **join date** changes; workarounds drift to **manual** legal-reviewed letters.
- **Saturday maintenance** vs India **six-day** working week: material productivity impact at their scale.

**JTBD:** *Progress candidates through the stages of the pipeline as efficiently as possible*; *Maintain data integrity throughout the recruiting process*; *Identify ways that my HR systems can better meet my workflow*.

---

### Synthesised Themes

#### Theme 1: High-volume hiring breaks without automation and bulk intelligence

**Description:** At **hundreds to thousands** of hires per week in peaks, **manual** duplicate checks, **per-profile** vendor approvals, and **one-by-one** application review are described as **full-time roles** and **business-risk** workarounds. Evergreen and business-requisition patterns are used to shield client naming; that design choice **inflates** external applicant counts and review load.

**Evidence:** P3 (800–900 postings, 700 applications example), P4 (100–150/week; vendor batches), P5 (1,500–2,000/week; 2,000–3,000+ agency profiles/day; dedicated approver headcount).

**Triangulation:** Customer-only in this file; compare to Step 7 SME file for internal feasibility and roadmap alignment.

**Implication:** Prioritise **high-volume** investments: scalable **dedupe**, **bulk actions**, **queue intelligence**, and **actionable notifications** (not aggregate task spam).

**Representative quotes:**

> "I have to open each one separately… which is actually I'm using workday for sourcing" — **P3**

> "about… 2,000, 3,000, maybe more profiles during the day where one recruiter… would only sit on workday… find out whether it's duplicate or not, and it takes almost the entire day" — **P5**

---

#### Theme 2: Know Your Candidate (India) – government IDs, OTP, and BGV alignment

**Description:** Participants describe **PAN, Aadhaar, UAN** (and related steps) as **mandatory** for compliance and **background verification**, with **Aadhaar OTP** as a verification mechanism. **Gating** is inconsistent: candidates can **skip** required IDs yet recruiters **cannot** extend offers, driving **chase cycles**, **leadership escalation**, and **drop-off**. **OTP non-delivery** is raised as a **support** issue. **Deduplication** should consider **government ID**, not only email/phone, because candidates vary those fields.

**Evidence:** P3 (policy vs UX gating, OTP, BGV narrative), P5 (Aadhaar in dedupe; mandatory IDs yet recruiter chase).

**Triangulation:** Customer-only in this file.

**Implication:** Treat **identity verification UX**, **OTP reliability**, **hard stops vs recruiter exceptions**, and **UDMF / matching rules** (government ID) as a single **India Know Your Candidate** epic cluster; align with DPDP consent and minimisation in 060 downstream.

**Representative quotes:**

> "PP policy is that you need to have all three IDs before an offer can be extended… it also doesn't mark it as mandatory" — **P3**

> "candidates come back and say that we are not even receiving the OTP" — **P3**

> "if that duplication check is done on their ADHAR number, we'll be able to identify that" — **P5**

---

#### Theme 3: Offer experience, regenerate limits, and time-to-accept risk

**Description:** Offer **regeneration** limitations after **compensation** or **date** changes force **manual** legal letters. Combined with ID/policy friction, customers cite **double-digit** attrition between offer and join and **SVP-level** sensitivity to **repeated** transactional steps.

**Evidence:** P3 (16–17% drop-off narrative; renegotiation loops), P4 (wrong compensation history at scale; regenerate constraints), P5 (batch date moves; no mass redo; manual letters).

**Triangulation:** Customer-only in this file.

**Implication:** **Offer agility** (controlled rescind/regenerate, batch support where safe), **candidate notifications** (email trail for compliance), and **clear task copy** are scale features for India BPO-style hiring.

**Representative quotes:**

> "specialized sit at about 82 83%. Which is where… we're losing about 16 17% people… in the time that it takes for us to release the offer… they've already found [something else]" — **P3**

> "regenerate offer letter… I cannot use it for compensation change" — **P4**

> "the only workaround is that I start giving manual letters… legal teams… have to approve that document" — **P5**

---

#### Theme 4: Requisition truthfulness, approvals, and org data (email-first → Workday)

**Description:** **Demand** and **approvals** often live in **email**; Workday is where requisitions are **created** afterwards. **Cost centre / LOB** accuracy depends on hiring-manager knowledge; errors **restart** candidate journeys after requisition edits. **Supervisory org** selection for massive headcount is another **data-entry** bottleneck.

**Evidence:** P2 (email approvals, 24-hour rework example), P5 (no in-system requisition approval; legacy parity gap), P4 (supervisory org random tagging risk).

**Triangulation:** Customer-only in this file.

**Implication:** **Manager self-service** requisition creation with **guided org fields**, in-system **approval threads**, and **defaulting** (e.g. supervisory org from WFP) reduces recycle rates and protects candidate experience.

**Representative quotes:**

> "all the approvals… we are taking it offline and then we are enclosing it as the documents before rolling out offers" — **P3**

> "if in case we have one BU head… all of us will have different different cost centers… we again have to go back to the requisition… start from the scratch" — **P3**

> "the requisition gets created… There is no approval process on Workday" — **P5**

---

#### Theme 5: Visibility, reporting, and parallel ATS (Thrive)

**Description:** Leadership recruiters report **limited Workday dashboards** for ageing and pipeline metrics; **Excel** and **Thrive** fill gaps. **Task** notifications are **high-volume** and **low-context** (**3,500** tasks cited).

**Evidence:** P3 (manual Excel ageing; Thrive dashboards; task email noise), P5 (positive overall on reporting vs legacy, but "teething issues" remain).

**Triangulation:** Customer-only in this file.

**Implication:** **Actionable alerts** (requisition ID, candidate, next step), **role-scoped task feeds**, and **manager dashboards** for ageing/SLA close Thrive dependency over time.

**Representative quotes:**

> "Workday doesn't give us that option… Thrive gives us a better clarity" — **P3**

> "we see almost 3,500 tasks… humanly not possible… email should have a relevant content" — **P3**

---

### Direct quote bank: high-volume hiring (by participant)

| Participant | Quote |
|-------------|--------|
| **P4** | "in a month, we hire around 800… 800 to 1,000" |
| **P4** | "India hires around 8,000, 9,000 in a month" |
| **P5** | "we hire about 1,500 to 2,000 people a week, across multiple regions" |
| **P5** | "maybe we hire about 12,000 people in 8 to 10 weeks" |
| **P3** | "we have 800 900 open position… posting them externally" |
| **P5** | "about 100 to 150 offers a day" |
| **P5** | "2,000, 3,000, maybe more profiles during the day… it takes almost the entire day" |

---

### Direct quote bank: fraud, identity, and Know Your Candidate (by participant)

| Participant | Quote |
|-------------|--------|
| **P3** | "These are the unique government identifiates identity fraud or things like that… major part of our background verification" |
| **P3** | "you need to have all three IDs before an offer can be extended… it also doesn't mark it as mandatory" |
| **P3** | "candidates come back and say that we are not even receiving the OTP" |
| **P5** | "duplication needs to get automated… Maybe… Aadhar in India… if that duplication check is done on their ADHAR number, we'll be able to identify" |
| **P5** | "government ID… is not being used as a validation in duplication" |
| **P4** | "if… we identify that it was a duplicate, we lose out" |
| **P5** | "Agency A who actually uploaded the profile first will not get paid" |

---

### Recommendations for Primary Research Slides

**For @pmf-analyst / 130 (SECTION 03: Primary Research - User Interviews)**

**Slide 1: Interview Participants**  
- Table: P1–P5, role title, TP (segment: specialist / leadership / agent / frontline lead).

**Slides 2–6: One slide per participant**  
- Title: `P# - Role, TP`  
- Body: Role context (1 short paragraph), **2–3** bullets paraphrasing quotes, pain bullets aligned to themes above.

**Slide 7: Key Themes from User Research**  
- **High-volume scale and automation** (dedupe, vendor throughput, application review)  
- **Know Your Candidate India** (PAN/Aadhaar/UAN, OTP reliability, gating vs policy, BGV)  
- **Offer agility and notifications** (regenerate, batch changes, compliance-friendly comms)  
- **Requisition data quality and in-system approvals**  
- **Reporting and actionable tasks** (vs noise)

---

### Full Thematic Analysis Report

**Location (optional follow-on):** `research/India/thematic-analysis/2026-04-01-India-INDIA-PMF-006-Thematic-Analysis.md`  
This Step 8 artefact is the **structured handoff** for @pmf-analyst; a separate full Braun & Clarke codebook can be generated in that path if the pipeline requires a standalone thematic appendix.

---

**Next step:** Hand off to **@pmf-analyst** for PMF triangulation (with `105-sme-research-findings.md` + strategy/CI inputs), then **130** for deck if applicable.
