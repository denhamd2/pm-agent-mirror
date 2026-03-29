# User Research Findings: India Recruiting PMF (Customer Interviews)

**Analysis Date:** 28 March 2026  
**Data Sources:** 2 customer interview transcript files (group sessions, multiple recruiter voices per file)  
**Methodology:** Structured synthesis aligned with Braun & Clarke thematic coding (customer-only; Step 8)

---

## Fresh pass attestation

- **Mission ID:** IN-E2E-003
- **Transcript files read (this run):**
  - `research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`
  - `research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`
- **SME files read (this run):** *None* (SME analysis completed in Step 7; this output is customer-only.)
- **Completed (UTC):** 2026-03-28T12:00:00Z

---

### Interview Participants

| ID | Role (as stated) | Organisation |
|----|------------------|--------------|
| **P1** | Recruiting lead (agent / frontline hiring, India delivery site) | TP |
| **P2** | Frontline hiring lead (North & East India, multi-site) | TP |
| **P3** | Recruitment Manager, specialised internal recruiting team | TP |
| **P4** | Recruitment Manager, job requisitions & onboarding handoff | TP |
| **P5** | Recruitment Manager, leadership / confidential hiring (end-to-end per role) | TP |

*Note:* Transcripts are group interviews; additional colleagues (e.g. workforce, operations, analytics) are referenced but primary recruiter voices are mapped to P1–P5.

---

### Key Findings per Participant

#### P1 – Recruiting lead, TP (agent hiring, India)

**Role context:** Owns recruiting stages from review through ready for hire and onboarding coordination for agent hiring (grade bands A1/B2); ~9 years with TP; moved from legacy HRMS to Workday; security-scoped to agent hiring for India; Kolkata-focused volumes ~800–1,000 hires per month (India-wide TP can be higher).

**Key quotes:**

> "In a week… normally the numbers would be somewhere around 100… when there are peak, then we… it goes up to, say, 150… average, in a month, we hire around 800… to 1,000."

> "For an example, if I'm creating a job requisition for… process ADC. There is a supervisory org which you need to attach to it… the business does not give us the clarity to which it has to be attached… we are randomly picking up right now to create the job requisition."

> "For any application which comes in from referral, or from vendor, or a social media… it's a manual activity which a recruiter has to go… under that candidate profile, you have that duplicate check option."

**Pain points:**

- Seasonal and campaign-driven volume spikes (e.g. e-commerce, Diwali season) amplify any system friction.
- Supervisory organisation selection when business does not specify correct manager / org at scale; internal workaround (random pick) creates downstream alignment risk; framed as process + data governance more than pure product defect.
- Duplicate checking is manual and high-risk at volume; hygiene checks on paper are hard to enforce across all recruiters.

**JTBD (illustrative):** When we run high-volume agent hiring in India, I want demand, reqs, and candidate records to stay clean without per-profile manual checks, so we avoid wrong org tagging, duplicate submissions, and agency disputes.

---

#### P2 – Frontline hiring lead, TP (North & East India)

**Role context:** Manages frontline hiring across ~8–9 sites, multiple states; collective throughput ~1,500–2,000 people per week; seasonal ramps (e.g. Diwali) with very large short-window hiring; Workday go-live in July coincided with peak.

**Key quotes:**

> "When there was a peak… that's when we got really hit bad during our hiring this year… we were not able to onboard people… delays in joining… we lost business days… their NTID creation got delayed."

> "For a recruiter's life cycle, I think most of the time they spend on Workday… the overall candidate journey starts from Workday application."

> "Duplication… I would say duplication needs to get automated… validation needs to be on more parameters than just first name, phone numbers, and email address… Aadhar in India… if that duplication check is done on their ADHAR number, we'll be able to identify that."

**Pain points:**

- Hire-to-productivity impact when provisioning / credentials / Workday issues delay onboarding during peak.
- Duplicate detection and source attribution at agency scale (~300–400 agencies, thousands of profiles per day) drives dedicated headcount for manual review and approvals.
- Offer letter regeneration limitations (compensation / date changes) and lack of practical rescind / resend force manual, legally reviewed letters at very high daily offer volume (~100–150 offers/day across span).
- Scheduled Saturday maintenance clashes with India working week, causing material productivity loss.

**JTBD (illustrative):** When we run national frontline ramps, I want hiring, offers, and day-one readiness to stay on the critical path without manual rescues, so revenue and client SLAs hold.

---

#### P3 – Recruitment Manager, specialised team, TP

**Role context:** Manages a small team of specialised recruiters; day-to-day includes sourcing, interview alignment, offer processing, and people management (performance, goals, attendance in Workday).

**Key quotes:**

> "Their performance… setting their goals… how they working… set the agenda for day-to-day basis."

**Pain points:**

- Manager overhead split between recruiting delivery and HR systems (e.g. attendance) that are slow or error-prone; reduces bandwidth for candidate-facing work.

**JTBD (illustrative):** When I lead a recruiting pod, I want people and hiring workflows in one reliable system, so admin does not crowd out sourcing and closing.

---

#### P4 – Recruitment Manager, requisitions & onboarding, TP

**Role context:** Creates job requisitions in Workday after email-based approvals; responsible for onboarding steps and payroll handoff (push to payroll, no-show handling); does not personally release all offers but owns candidate engagement and positioning.

**Key quotes:**

> "On email we have approvals… once I have all of these approvals… is when I raise a job requisition… I'm raising them on Workday as a job requisition."

> "Once a person joins… you have to go back and complete the onboarding steps… if you don't do that then you're not a part of the payroll."

**Pain points:**

- End-to-end approval and financial metadata (cost centre, line of business) often unclear when recruiters intermediate hiring-manager demand; causes multi-day back-and-forth and missed offer SLAs (24–48h on paper vs actual delays).
- No-show processing blocked when onboarding tasks incomplete or system state inconsistent; creates attrition reporting and stakeholder friction.

**JTBD (illustrative):** When I open reqs and onboard joiners, I want correct org and approval data captured up front, so I do not rework reqs or fight payroll and no-show status later.

---

#### P5 – Recruitment Manager, leadership / confidential hiring, TP

**Role context:** Handles confidential leadership reqs from creation through offer; describes Workday as tool for opening reqs and releasing offers but with major reporting and workflow gaps versus legacy/parallel ATS (Thrive) for dashboards, parsing, and recruiter productivity.

**Key quotes:**

> "Workday is just a tool wherein we open the requisition… there is no other potential thing… we are not able to pull any reports… there is no view on the reports."

> "The first priority if we can work around it is… having the approvals through Workday… all the approvals… we are taking it offline."

> "Government identifiers… it's not always active… once the candidate accept all the policies suddenly it vanishes… TP policy is that you need to have all three IDs before an offer can be extended… it will not let you do that but it also doesn't mark it as mandatory."

> "Specialized… join… at about 82, 83%… we're losing about 16, 17% people… in the time that it takes for us to release the offer."

**Pain points:**

- Offline approvals for position, compensation, and leadership sign-off; wants auditable in-system threads.
- No in-product dashboards / Excel exports for pipeline, aging, SLA, and recruiter load; parallel ATS (Thrive) used for what they perceive Workday lacks.
- Sourcing friction: cannot parse or bulk-upload CVs from channels such as Naukri / LinkedIn; many career-site postings exist only to generate candidate registration links.
- High application volume without gating (e.g. hundreds of applicants per req); resume not always mandatory; parser accuracy ~60–70% when used.
- India government ID + OTP flow: OTP reliability issues; partial ID submission allowed while policy requires three IDs; drives multi-day recruiter chase, candidate anxiety, and estimated 16–17% offer-to-join leakage for specialised hiring.
- Offer acknowledgement is weak for audit (screenshots, no DocuSign in Workday); generic task emails (thousands in inbox) without req context; wants recruiter-targeted notifications.
- Referral experience fragmented; internal posting and confidential job promotion workflows need clearer process and permissions.
- Pay group assignment instability and attendance marking bugs called out as major time sinks (broader HCM but affects manager bandwidth).

**JTBD (illustrative):** When I run confidential leadership searches, I want approvals, evidence, reporting, and candidate compliance steps in one auditable flow, so we meet executive expectations and stop losing candidates to process delay.

---

### Synthesised Themes

#### Theme 1: Scale breaks manual duplicate, source, and agency workflows

**Description:** At agency and campaign scale, manual duplicate review, vendor upload approval, and last-touch source attribution do not match legacy-tool expectations (cooling-off periods, clear duplicate narratives). Financial exposure when wrong agency gets credit.

**Evidence:** P1, P2 (quantified agency counts and daily upload volumes); P2 explicit “duplication needs to get automated” and Aadhaar as desired match key.

**Triangulation:** Customer-only in this file (await Step 7 SME file for convergence).

**Implication:** Prioritise UDMF / matching parameter expansion, bulk-safe duplicate handling, and source-ownership rules that survive concurrent submissions; consider India ID fields in matching with DPDP governance.

**Representative quotes:**

> "Workday will identify that candidate to be referred by Agency B… Agency A who actually uploaded the profile first will not get paid." (P2)

---

#### Theme 2: Offer and compliance path rigidity (regenerate, rescind, India IDs)

**Description:** Customers need to revise offers after acceptance or ready-for-hire transitions (compensation errors, batch date moves, candidate-driven date changes). Regenerate offer and rescind / resend paths perceived as missing or inaccessible; India statutory steps (PAN, Aadhaar, UAN, OTP) misaligned with policy (partial completion allowed in UX, fields disappearing), stretching timelines and compliance risk.

**Evidence:** P1, P2 (bulk compensation errors, regenerate limits); P5 (three IDs, OTP failures, 16–17% leakage estimate).

**Implication:** Map India offer and pre-offer steps to DPDP consent and data minimisation; product gaps touch offer orchestration, candidate task UX, OTP reliability, and audit evidence (not only Recruiting configuration).

---

#### Theme 3: Approvals and financial metadata live outside Workday

**Description:** Headcount, CHR, global, and compensation approvals often live in email; recruiters lack hiring-manager context on cost centre / LOB; wrong metadata forces req edits and sometimes restarting candidate apply journey.

**Evidence:** P1 (supervisory org ambiguity); P2 (no in-WD req approval); P4, P5 (24h+ loops, “start from scratch”).

**Implication:** Hiring manager and finance self-service in req creation, plus in-flow approval and aging visibility, directly reduces recruiter toil and time-to-offer.

---

#### Theme 4: Reporting, notifications, and task noise at executive and volume scale

**Description:** Leaders need pipeline aging, SLA, and recruiter dashboards; instead they export or maintain Excel and parallel tools. Task and notification emails are voluminous and generic; recruiters miss offer accept events and must phone candidates.

**Evidence:** P5 (no reports, manual Excel aging, 3,500 tasks, delete-all-email behaviour); P2 (acknowledgement-only offers).

**Implication:** Improve actionable notifications (req/candidate context), manager insights, and filtered task experiences for high-volume tenants.

---

#### Theme 5: Candidate experience and channel design under India constraints

**Description:** Bridge pages and bot pre-steps before Workday apply caused earlier pain; in-Workday apply seen as OK once reached. Email preferred over SMS/WhatsApp for compliance trail. Desire for better gating, mandatory resume, and parsing/bulk upload to reduce junk applicants and manual review.

**Evidence:** P2 (legacy bot bridge issues vs “objectively… no issues” once in Workday); P5 (email for compliance; parsing and 600-applicant example).

**Implication:** India programme should pair channel expansion (strategy mentions WhatsApp) with customer-specific compliance preferences and evidence trails.

---

#### Theme 6: Operational risk at go-live and maintenance windows

**Description:** Go-live during peak hiring amplified issues; Saturday maintenance windows hurt India operations that work six-day weeks.

**Evidence:** P2 (July peak, newness factor); P2 closing feedback on Saturday downtimes.

**Implication:** Platform reliability and regional scheduling remain executive-level India account risks alongside feature gaps.

---

## Strategic Alignment Assessment

**Step 1 Strategy Context:** `research/India/strategy-context-2026-03-28-IN-E2E-003.md`

**Alignment analysis:**

- **High alignment**
  - **Core ATS parity, bulk, and scale efficiency:** Customer pain on manual duplicate handling, approvals, reporting, and offer-path friction supports Q2 narrative on table-stakes ATS depth and **8 India customer wins** tied to trust and execution.
  - **AI matching (HiredScore):** Volume hiring and screening load (hundreds of applicants per req, manual review) aligns with strategy to activate matching **with** governance; customers also use external AI shortlisting (e.g. Naukri portal) pre-Workday.
  - **DPDP and trust:** Government ID collection, OTP, consent, and audit evidence are central to customer stories; aligns with strategy emphasis on compliance-first India positioning.

- **Strategy–customer tension**
  - **WhatsApp / SMS vs compliance preference:** Strategy and roadmap stress omnichannel candidate engagement; P5 explicitly prefers email for regulatories and traceability. India GTM needs **channel optionality** and policy-controlled templates, not a single-channel assumption.
  - **GCC-first priority vs India severity:** GCC is Q2 Priority 1; India duplicate/agency and offer-admin pain is existential at described scale. **120** should still score India customer impact highly even when global priority list is GCC-heavy.

- **Neutral / adjacent**
  - **Attendance and pay group issues** are HCM / payroll adjacency; still erode recruiter-manager trust in Workday and should be noted as portfolio noise in India accounts.

**Implications for 120:**

- Weight recommendations that remove **manual duplicate and source-ownership** work and **offer / India ID** friction as high customer impact for India scale.
- Flag **WhatsApp** recommendations for PM decision where customers require **email-first** audit trails.
- Treat **supervisory org + approval** gaps as hiring-manager and finance enablement, not only recruiter training.

---

### Recommendations for Primary Research Slides

**For 120 / 130 to use when building the PMF report and roadmap deck:**

**SECTION 09: Customer Interviews (or equivalent)**

**Slide 1: Interview Participants Overview**

- Title: "Interview Participants"
- Content: Table with P1–P5, role summary, TP (note: two onsite sessions, Dec 2025)

**Slide 2–6: One slide per participant (P1–P5)**

- Title: "P1 – Recruiting lead, TP" (etc.)
- Content: Role context; 2–3 short quotes; top pain bullets

**Slide 7: Key Themes from User Research**

- Title: "Key Themes from User Research"
- Content: Themes 1–6 (one line each)

---

### Full Thematic Analysis Report

**Location:** *To be produced by 120 in* `research/India/thematic-analysis/` *after triangulation with Step 7 SME findings, 099 outputs, and Step 4 CI.*

---

*End of Step 8 customer-only findings (IN-E2E-003).*
