# User Research Findings: India Recruiting (Customer Interviews)

**Analysis Date:** 07 May 2026 (attestation refresh)  
**Data Sources:** 2 customer transcript files (5 participant voices: 3 specialist / confidential recruiters; 2 high-volume front-line leads)  
**Methodology:** Braun & Clarke-style thematic synthesis (Continuous Discovery; story-based evidence from transcripts)  
**PM context (mission framing):** Driver: New market entry. Analytical emphasis: **KYC / Know Your Candidate and fraud**, **high-volume hiring**, **WhatsApp**, and **two-way email** (threaded candidate replies visible to recruiters **on the candidate profile**).

---

## Fresh pass attestation

- **Mission ID:** INDIA-E2E-006  
- **Transcript files read (this run):**
  - `research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`
  - `research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`
- **SME files read (this run):** *None* (Step 7 covered internal SME transcripts separately.)
- **Completed (UTC):** 07 May 2026
- **PM-supplied lens:** Re-coded prior findings under **KYC/fraud**, **high volume**, **WhatsApp vs email**, and **two-way email continuity** for @pmf-analyst Step 9.

---

## Supplementary synthesis — omnichannel trust (INDIA-E2E-006)

**KYC / fraud:** P2–P3 evidence on **offline approvals** and **ID upload soft gates** supports a theme of **policy–system mismatch**—recruiters need **hard stops configurable per employer** without losing **conversion** on high-volume funnels.

**High volume:** P4–P5 (frontline / agent hiring) stress **throughput**, **batch-like offer motion**, and **manual SLA tracking**—anything that keeps comms **in-profile** reduces context loss.

**WhatsApp:** Prior INDIA-E2E-005 / native WhatsApp prototype track; customers treat mobile messaging as **primary** for nudges; **consent** and **template governance** remain blockers for enterprise rollout.

**Two-way email:** P2 explicitly describes **email-led approvals** before reqs; multiple voices use **email as coordination spine** while Workday holds **status**. **Thread capture on candidate** (inbound replies linked to recruiting messages) addresses **swivel-chair** and preserves **decision evidence** next to stage movement.

---

## Interview Participants

- **P1** – Recruitment Manager, Specialized Recruiting, Teleperformance (India)  
- **P2** – Recruitment Manager, Specialized Recruiting (job requisition creation, onboarding handoff), Teleperformance (India)  
- **P3** – Recruiter, Leadership / Confidential Hiring, Teleperformance (India)  
- **P4** – Recruiting Lead, Agent Hiring (East India focus), Teleperformance (India)  
- **P5** – Senior Manager, Frontline Hiring (North and East India), Teleperformance (India)

---

## Key Findings per Participant

### P1 – Recruitment Manager, Specialized Recruiting, Teleperformance (India)

**Role context:** Manages a small team of specialized internal recruiters; day-to-day spans sourcing, interview coordination, offer processing, and follow-up with candidates.

**Key quotes:**

> "These are the day-to-day activities with the candidate… I being the manager, I need to maintain the attendance for my team."

> "They are specialized recruiters… all internal to TP."

**Pain points:**

- Split attention between hands-on recruiting and people management (performance, goals, day-to-day team agenda).
- Same employer context as P2/P3: heavy reliance on email and offline steps adjacent to Workday for specialized lanes.

**JTBD:** *When* I run a specialized recruiting pod, *I want* predictable tools and clear handoffs, *so I can* hit offer and joiner SLAs without administrative drag.

---

### P2 – Recruitment Manager, Specialized Recruiting, Teleperformance (India)

**Role context:** Creates job requisitions in Workday after email-based approvals; focuses on candidate engagement and onboarding push to payroll; does not personally release offers. Describes approvals arriving via email (including global and India CHR / excom) before reqs are raised.

**Key quotes:**

> "On the emails we have approvals… it's not happening on [Workday] right now… once I have all of these approvals is when I raise a job requisition."

> "We have created a unique code for all the positions… we map each one position with the code."

**Pain points:**

- **Approvals outside Workday** for position and compensation, then manual attachment of evidence before offers.
- Friction when hiring managers lack correct **cost centre / line of business** data; example given of ~24–48 hours lost reconciling tables before offer release.
- Desire for **aging / SLA tracking** on requisitions; currently tracked manually in Excel.

**JTBD:** *When* I open a requisition after email approval, *I want* financial and org attributes correct the first time, *so I can* release offers within stated SLAs.

---

### P3 – Recruiter, Leadership / Confidential Hiring, Teleperformance (India)

**Role context:** Leadership hiring pod; confidential requisitions end-to-end from requisition through offer; describes Workday as primarily “open position → candidates apply → roll out offers” with **limited reporting** and **offline approvals** for compensation and position.

**Key quotes:**

> "For now all the approvals whether it's the compensation approval, the position approval we are taking it offline and then we are enclosing it as the documents before rolling out offers."

> "TP policy is that you need to have all three IDs before an offer can be extended… it will not let you do that but it also doesn't mark it as mandatory… the candidate will upload one ID and then they're free to move forward."

> "We are losing about 16–17% people… in the time that it takes for us to release the offer… a lot of people drop out before they even accept our offer because process is so [heavy]."

> "There are times when candidates come back and say that we are not even receiving the [Aadhaar] OTP… you have to raise a ticket on Workday."

**Pain points:**

- **Government identifiers (PAN, Aadhaar, UAN):** UI allows progression without collecting all three; recruiters still cannot extend offer compliantly → **repeated renegotiation** of offer letters and phone support (“choking bandwidth”). **OTP delivery failures** for Aadhaar-linked mobile; raised via support.
- **Candidate experience at senior levels:** SVP-level candidates push back on repeated transactional steps; exceptions sometimes taken to release offer despite incomplete IDs.
- **High volume of non-genuine applies:** Example of **~700 applications** on one posted role; must open profiles **one by one**; **resume not always uploaded**; parser accuracy described as ~60–70% with still-heavy manual review.
- **Career site noise:** Described **hundreds of roles** posted primarily to obtain registration links for identified candidates, not true open demand.
- **Notifications:** Generic task emails (e.g. thousands of tasks) without requisition ID; recruiters want **actionable, specific notifications** (and email copy for compliance traceability vs SMS/WhatsApp preference for audit).
- **Offer acceptance:** Acknowledgement-only (no DocuSign in flow); internal audit handled via **screenshots**; no recruiter-triggered email when candidate accepts.
- **Referrals:** Described as **hard to trace** in Workday without candidate ID; duplicate name search creates ambiguity.

**JTBD:** *When* I move a leadership candidate to offer, *I want* **hard gates** on India statutory IDs with **reliable verification** and **clear candidate comms**, *so I can* avoid offer rework and protect join rates.

---

### P4 – Recruiting Lead, Agent Hiring (East India), Teleperformance (India)

**Role context:** Owns recruiting stages from review through ready for hire and onboarding for **agent** populations (grades described as A1/B2); **9 years** with TP; Workday replaced prior HRMS. Kolkata-focused hiring ~**100 agents/week** in lean periods, up to **~150/week** at peak; cites **~800–1,000 hires/month** for her scope and **~8,000–9,000/month** for India agent hiring overall. Uses **evergreen** requisitions; delivery reqs may be **not posted** to external career site when naming would disclose client.

**Key quotes:**

> "When it comes to India, then we can go up to that number also… India hires around 8,000, 9,000 in a month."

> "When you create a job requisition… you need to attach [a] supervisory org… the business does not give us the clarity… we are randomly picking up right now."

> "We could not remove the approval for vendor uploads… if we remove it, then it will also not allow any rehire candidates… we cannot delete any employee data from the system."

**Pain points:**

- **Supervisory organisation selection** without clear business input → **random assignment** workaround, misalignment when new hires reach operations after training.
- **Vendor upload approval + duplicate check** are **manual per profile**; at **300–400 agencies** × **10–20 profiles/day**, dedicated FTEs spend **full days** clicking approvals; **cannot auto-remove** approval without blocking **rehire / compliance** constraints.
- **Duplicate handling:** Legacy tool blocked duplicates within **cooling-off** and showed **first source**; Workday behaviour described as **not blocking**, **not always surfacing duplicate**, and attributing **last approver’s source** → **agency fee disputes** when Agency B is approved after Agency A first uploaded.
- **Regenerate offer letter** cannot fix **wrong compensation** after acceptance; **400–500** historical wrong-comp cases cited around go-live period; desire to store corrected letter **in system** even if issued outside.
- **Referral / search** experience: hard to find referred candidate without **exact ID** among many name matches.

**JTBD:** *When* agency and referral traffic spikes, *I want* **deterministic duplicate and source-of-hire rules**, *so I can* protect fee accuracy and recruiter capacity.

---

### P5 – Senior Manager, Frontline Hiring (North & East India), Teleperformance (India)

**Role context:** Manages frontline hiring across **North and East India**, **~8–9 sites**; with teams, **~1,500–2,000 hires/week** routinely; seasonal peaks (e.g. Diwali, e-commerce ramps) cited as **~12,000 hires in 8–10 weeks** including major client programmes. **Workday went live in July** during a peak; issues with **NTID / credentials / CCMS IDs** delayed onboarding and **lost business days** for training starts.

**Key quotes:**

> "When we come to objective issues on where our recruitment process used to get stuck, we were not able to onboard people… not able to get their IDs, CCMS IDs, done on Workday."

> "Duplication needs to get automated… validation needs to be on more parameters than just first name, phone numbers, and email address… if that duplication check is done on their Aadhaar number, we'll be able to identify that."

> "Government ID… while we are accepting the government ID at the application stage… for some reason, it is not being used as a validation in duplication."

> "Lot of downtimes are planned on a Saturday for Workday… India, we don't have Saturday as an off day… it is also impacting our business a lot."

**Pain points:**

- **Peak-season fragility:** Early-life Workday issues compounded **volume** (onboarding blockers).
- **End-to-end Workday use** for frontline journey (apply → assessments → interview → offer) but **pre-apply bot + landing page** workaround introduced **link delay / expiry** issues (Workday-native apply described as OK once reached).
- **Offer changes after ready-for-hire:** Cannot **regenerate** for date or compensation changes; **rescind / resend** not available to users; **manual legal-approved letters** as workaround.
- **Volume of offers:** **~100–150 offers/day** across span cited; **no mass offer** process; individual processing amplifies any friction.
- **India operating model vs maintenance windows:** **Saturday maintenance** hits India **six-day** work week; described as material productivity/revenue risk.

**JTBD:** *When* seasonal demand spikes, *I want* **stable identity, onboarding, and offer amendment paths**, *so I can* scale weekly joiners without manual legal workarounds.

---

## Synthesized Themes

### Theme 1: Know Your Candidate – government identity, verification, and trust

**Description:** India statutory identifiers (PAN, Aadhaar, UAN) sit at the intersection of **compliance**, **background verification**, and **offer release**. Participants describe **soft gating** (candidates can proceed without all IDs), **OTP reliability issues**, and heavy **recruiter chase** that lengthens time-to-offer and erodes candidate patience—especially painful for **leadership** and **high-intent** candidates.

**Evidence:** Strong across **P3, P4, P5**; supporting context from **P2** (offer SLAs delayed by upstream data issues).

**Triangulation:** Customer-only step; compare with Step 7 SME file for internal Workday perspective.

**Implication:** Product opportunities in **mandatory-field design**, **re-editable government ID steps** where policy allows, **OTP / verification resilience**, and **recruiter-visible completeness** before offer tasks unlock. Aligns with mission framing on **candidate fraud / trust** (identity assurance, not only UX).

**Representative quotes:**

> P3: "The candidate will upload one ID and then they're free to move forward… it will stop us to release the offer."

> P5: "If that duplication check is done on their Aadhaar number, we'll be able to identify that."

---

### Theme 2: High-volume scale breaks manual duplicate, source, and vendor workflows

**Description:** At **thousands of applications and agency uploads per day**, **per-profile** duplicate checks and approvals become **dedicated FTE roles**. Participants want **automation**, **stronger matching keys** (including government ID), **cooling-off logic**, and **first-source attribution** to match legacy-tool behaviour and **agency contracts**.

**Evidence:** **P4, P5** primary; **P3** on application volume and review patterns.

**Implication:** Prioritise **UDMF / duplicate framework** configuration and roadmap items that support **India identifiers** in matching; **source tracking** rules that survive multiple inbound paths; **bulk approval** patterns that respect **rehire and data-retention** constraints.

**Representative quotes:**

> P4: "About 2,000, 3,000, maybe more profiles during the day where one recruiter… it takes almost the entire day."

> P5: "Duplication needs to get automated."

---

### Theme 3: Approvals and financial master data living outside Workday

**Description:** Position and compensation approvals often occur **by email** (global + India CHR / excom), then documents are attached for audit. Hiring managers may lack **cost centre / LOB** accuracy, causing **req edits** and **candidate re-application** in worst cases.

**Evidence:** **P2, P3**; **P4** on supervisory org ambiguity for agent hiring.

**Implication:** **In-product approval threads**, **hiring-manager-led requisition creation** with defaults from supervisory org, and **guided data capture** reduce rework—relevant to **new market entry** maturity.

**Representative quotes:**

> P2: "All the approvals… we are taking it offline and then we are enclosing it as the documents."

> P3: "We have to edit the requisition… get the candidate applying on that requisition again… start from the scratch."

---

### Theme 4: Offer document lifecycle and auditability

**Description:** **Regenerate offer** limitations after acceptance, lack of **rescind/resend** in security, and **acknowledgement-only** acceptance drive **manual letters**, **legal/risk review**, and **screenshot** evidence. High daily offer volumes multiply the cost.

**Evidence:** **P3, P4, P5**.

**Implication:** **Controlled post-acceptance amendment** paths, **e-signature** where customers require it, and **structured notifications** to recruiters on candidate action—with **requisition-scoped** alerts instead of generic task floods.

**Representative quotes:**

> P4: "Regenerate offer letter… I cannot use it for compensation change."

> P3: "There is no mail triggered when the candidate accepted our offer… we have to go back and check everything."

---

### Theme 5: Reporting, parallel tools, and operating cadence (India)

**Description:** Teams complement Workday with **Excel**, **internal codes**, and (for some lanes) **Thrive** for dashboards. **Saturday maintenance windows** clash with India **six-day** operations. Parser accuracy and **missing resume uploads** add review load.

**Evidence:** **P2, P3, P4, P5**.

**Implication:** **In-product operational reporting**, **maintenance scheduling** sensitive to non-US calendars, and **apply-flow guardrails** (required resume, screening questions) to reduce noise at scale.

---

## Pain points (aggregated)

- **Identity / KYC:** Incomplete gating on PAN / Aadhaar / UAN; OTP failures; offer blocked until IDs complete; senior-candidate experience risk.  
- **Duplicates & source:** Manual checks; weak cooling-off behaviour; **wrong agency credited** → fee disputes; rehire constraints block simple “remove approval”.  
- **Volume:** Hundreds of applications per role; one-by-one review; parser ~60–70%; vendor upload approval at extreme scale.  
- **Approvals & org data:** Email-first approvals; cost centre / supervisory org ambiguity; req rework.  
- **Offers:** Cannot regenerate for comp/date changes; rescind not available; manual external letters; weak recruiter notifications.  
- **Platform ops:** Saturday downtime impact on India; onboarding / pay-group edge cases called out (specialist session).

---

## Recommendations

1. **India KYC / Know Your Candidate:** Treat **government ID collection and verification** as a single **hardened sub-journey**—configurable **true mandatory** stops, **OTP monitoring / retry / support playbook**, and **recruiter dashboard** for ID completeness **before** offer tasks. Pair with roadmap narrative on **fraudulent apply / trust** (social login, device signals) where appropriate for India.  
2. **High-volume duplicate and source governance:** Invest in **matching rules** that can use **Aadhaar / government identifiers** where legally and contractually allowed; restore **first-source wins** behaviour within cooling-off; **bulk duplicate review** UX for agency uploads without breaking **rehire / retention** rules.  
3. **Approvals in Workday:** Pilot **in-system approval chains** for position and compensation with **audit trail** to replace email attachment chains for India BPO-scale customers.  
4. **Offer lifecycle:** Close gaps on **post-acceptance amendment** (comp, start date) with **compliant rescind/regenerate** patterns; add **recruiter notifications** scoped by requisition/candidate.  
5. **Apply funnel hygiene:** **Required resume**, **knock-out questions**, and **disposition** support to reduce unqualified volume at source.  
6. **Customer success / platform:** Address **India calendar** impact of **Saturday maintenance**; document **Broadbean unpost** options for stale public postings where used as registration shells.

---

## Recommendations for Primary Research Slides

**For @pmf-analyst / 130 (SECTION 03: Primary Research – User Interviews)**

**Slide 1: Interview Participants**  
- Table: P1–P5 | Role | Organisation (Teleperformance India – anonymised segment labels as above).

**Slides 2–6: One slide per participant**  
- Title: `P# – Role, Teleperformance (India)`  
- Body: Role context (2–3 lines); 2 short verbatim quotes; 3 bullet pain points.

**Slide 7: Key Themes from User Research**  
- Theme titles: (1) Know Your Candidate / India IDs & verification, (2) Volume × duplicates & source, (3) Approvals outside Workday, (4) Offer lifecycle & audit, (5) Ops cadence & reporting.  
- One line implication per theme for India roadmap.

---

## Strategic Alignment Assessment

**Step 1 Strategy Context:** `research/India/strategy-context-2026-04-06-INDIA-E2E-005.md`

**Alignment analysis:**

- **High alignment:** **DPDP and trust** themes in Q2 India row match customer emphasis on **ID handling, consent traceability, and auditability** (email vs messaging preferences). **AI matching / efficiency** (Q2 Priority 2) aligns with **duplicate automation** and **volume screening** pain. March 2026 TA PDF mentions **Fraudulent App Detection (Phase 1)** and **enhanced candidate communication consent**—direct echo of **identity + OTP + notification** friction.  
- **Strategy–customer tension:** Q2 doc emphasises **GCC market readiness** as Priority 1 while India customers describe **India-specific statutory and operating cadence** issues (Saturday maintenance, Aadhaar OTP). India is **Scale growth** in the regional table but **not deeply detailed in the PDF extract**—risk of **under-weighting India BPO scale** in global narrative if GCC dominates execution airtime.  
- **Neutral / table stakes:** **Core ATS parity** (bulk actions, scheduling) aligns with **mass offer** gap and **interview tooling** mentions, but interviews stress **identity + agency economics** even more than generic parity lists.

**Implications for @pmf-analyst:**

- Elevate **Know Your Candidate / identity assurance** and **high-volume duplicate & source** into **validated themes** with explicit **India statutory** context.  
- Cross-check Step 7 SME findings for **configuration vs product gap** split (many issues may have **partial config** remedies).  
- Flag **Saturday maintenance / APAC scale** as **platform + GTM** risk, not only Recruiting feature backlog.

---

## Full Thematic Analysis Report

**Location:** *Not generated as a separate file in this Step 8 pass.* Synthesis is contained in this document for **customer-only** E2E Step 8. If a standalone Braun & Clarke log (coding frame, saturation notes) is required, invoke Path B with output to `research/India/thematic-analysis/` in a follow-on task.

---

*End of customer research findings (105 Path B, Step 8).*
