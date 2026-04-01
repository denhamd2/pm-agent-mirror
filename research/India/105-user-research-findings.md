# User Research Findings: India Recruiting (TP Customer Interviews)

**Analysis Date:** 31 March 2026  
**Data Sources:** 2 customer transcript files (5 distinct participant voices: 3 specialist/confidential recruiters; 2 high-volume front-line leads)  
**Methodology:** Braun & Clarke 6-phase thematic analysis (familiarisation, coding, theme generation, review, definition, reporting)  
**Scope:** Customer transcripts only (SME analysis completed in Step 7; not re-read here)

---

## Fresh pass attestation

- **Mission ID:** IN-E2E-005
- **Transcript files read (this run):**
  - `research/India/customer-transcripts/TP Onsite - Specialist & Confidential Recruiters Interview Transcript x3 - 2 Dec 2025 (1).txt`
  - `research/India/customer-transcripts/TP Onsite - High Volume Front-line Recruiters Interview Transcript x2 - 3 Dec 2025 (1).txt`
- **SME files read (this run):** *None* (Step 7 covered internal SME transcripts separately)
- **Completed (UTC):** 31 March 2026

---

## Interview Participants

| ID | Role (as described) | Organisation |
|----|---------------------|--------------|
| **P1** | Recruitment Manager (specialised internal team; sourcing through offer) | TP (India) |
| **P2** | Recruitment Manager (job requisition creation, onboarding to payroll; large team) | TP (India) |
| **P3** | Leadership / confidential hiring (requisition through offer; executive pipeline) | TP (India) |
| **P4** | Agent hiring lead (high-volume agent grades; East / Kolkata focus) | TP (India) |
| **P5** | Frontline hiring manager (North & East India; multi-site high volume) | TP (India) |

---

## Key Findings per Participant

### P1 - Recruitment Manager, TP (India)

**Role context:** Manages three specialised recruiters; day-to-day covers sourcing, interview alignment, resumes, offers, and follow-up; also team attendance in Workday.

**Key quotes:**
> "So, my day-to-day routine is like sourcing the candidates, aligning their interviews, passing their resume if they selected and processing for offers and followup."

> "Their performance setting their goals and their performance how they working set the agenda for day-to-day basis also and BT reviews."

**Pain points:**
- Split attention between hands-on recruiting and managerial duties (performance, goals, attendance).
- Same employer context as P2/P3 on email-based approvals and offline governance (referenced in roundtable).

**JTBD:** When managing a small specialised recruiting pod, I want clear system-of-record for hiring steps and team admin, so I can spend less time on parallel tools and status chasing.

---

### P2 - Recruitment Manager, TP (India)

**Role context:** Creates job requisitions in Workday after email-based approvals; owns onboarding command (push to payroll, no-show handling); does not personally release offers; candidate engagement; ~60-person team; positions mapped with unique codes via email before reqs.

**Key quotes:**
> "On email we have approvals on right now and then once I have all of these approvals is when I raise a job requiring managers."

> "I'm creating them on work day as a job I'm raising them on work day as a job requisition but on email they come to us."

**Pain points:**
- **Dual system:** Demand and approvals live in email; execution in Workday, increasing latency and traceability gaps.
- Hiring managers not always owning requisition creation drives back-and-forth on cost centre, line of business, and tagging.

**JTBD:** When opening approved headcount, I want hiring managers to raise accurate requisitions with correct org and finance tags, so I avoid rework before candidates apply.

---

### P3 - Leadership Recruiter (confidential hiring), TP (India)

**Role context:** Leadership hiring team; confidential requisitions end-to-end; heavy use of offline approvals, manual metrics (Excel), Thrive for some dashboards; Workday used for posting, candidates, offers but reporting and governance gaps.

**Key quotes:**
> "Work day is just a tool for us wherein we open the requisition and it is helping us to release the offers there is no other potential thing… we are not able to pull any reports from there."

> "The first priority if we can work around it is um having the approvals through work… hiring managers are approving the positions on work day itself."

> "We are losing about 16 17% people who are in the time that it takes for us to release the offer for them to accept it… a lot of people drop out before they even accept our offer because process is so [onerous]."

**Pain points:**
- **Offline approvals** for position, compensation, and leadership sign-off; documents attached manually before offer.
- **No team/progress visibility** in Workday for leadership pipeline; Excel and email tracking (including approval audit six months later).
- **Government IDs (PAN, Aadhaar-related OTP, UAN):** policy requires three IDs before offer; UX allows partial completion; fields "vanish"; candidates repeat steps; OTP delivery failures; escalations to support; **~82–83% join** cited vs drop-off before join.
- **Parsing / bulk upload:** cannot parse from Naukri/LinkedIn into Workday; must send external links; **800–900** career-site postings described as not truly "open" but used to obtain apply links.
- **High application volume** on posted reqs (e.g. **~700** on one role); **cannot review in bulk**; must open profiles one-by-one; resume not always mandatory on apply.
- **Offer acceptance:** simple acknowledgement, not DocuSign; recruiters take screenshots for audit; **no useful recruiter notification** when candidate accepts (generic task inbox with thousands of tasks).
- **Referrals:** scattered; hard to match referred candidate to correct requisition without deep search.
- **E-sign:** Donkey Sign outside integrated offer signing in Workday (as described).
- **HCM adjacent:** attendance marking unstable (hours reverting); pay group reassignment issues; no-show process blocked when onboarding tasks incomplete.

**JTBD:** When closing leadership hires under strict India compliance, I want gated, mandatory ID capture, reliable OTP, and in-system approvals, so I protect join rates and audit trails without phone-chasing executives.

---

### P4 - Agent hiring lead, TP (India)

**Role context:** End-to-end recruiting for agent grades (A1/B2 etc.) for India; security-scoped to agent hiring; Kolkata focus discussed; **~100 hires/week** (peak **~150**); **~800–1,000/month** in region; India scale cited up to **8,000–9,000/month** nationally for TP.

**Key quotes:**
> "Whatever is there from a recruiting perspective I'm managing that."

> "For India, we get requisition… on an average, if you talk about every day, yes, the team would have been spending some one or two hours… on an average… one and a half hours… on a requisition."

**Pain points:**
- **Supervisory organisation selection:** business does not always specify which manager/org attachs to high-volume indents; teams **randomly pick** supervisory org to unblock req creation; operations feedback that this is incorrect vs true reporting line after training.
- **Vendor upload + duplicate check:** manual per upload; recruiter must approve each lead; at **300–400 agencies** × **10–20 profiles/day**, dedicated FTEs spend full days clicking; **cannot remove vendor approval** without blocking rehire/pre-hire flows (compliance: no delete of worker data).
- **Duplicate and source ownership:** legacy tool enforced cooling-off and blocked duplicate source; Workday **does not reliably block** or attribute **first source**; **Agency B** can be credited over **Agency A** with **fee / contract implications**; manual pile of correction cases.
- **Regenerate offer letter:** cannot use for **compensation correction** after acceptance; **400–500** wrong-compensation cases cited around go-live period; cannot store corrected PDF as system of record in Workday (as described).
- **Chase on mandatory IDs** at offer despite configuration; recruiters still chase for timeliness.

**JTBD:** When running thousands of agency-sourced applications, I want automated duplicate detection (incl. government IDs), correct source attribution, and safe bulk processing, so I eliminate full-time "click approval" roles and pay agencies fairly.

---

### P5 - Frontline hiring manager, TP (India)

**Role context:** Frontline hiring for TP North and East India; **~1,500–2,000 people/week** across **8–9 sites**; seasonal peaks (e.g. **~12,000** in **8–10 weeks**); Workday go-live **July** during peak caused **NTID / credential delays** and lost training days.

**Key quotes:**
> "When we come to objective issues on where our recruitment process used to get stuck, we were not able to onboard people… CCMS IDs done on Workday… we lost business days being able to start their training."

> "Duplication… needs to get automated… validation needs to be on more parameters than just first name, phone numbers, and email address… if that duplication check is done on their Aadhar number, we'll be able to identify that."

> "Lot of downtimes are planned on a Saturday for… Workday… India, we don't have Saturday as an off day… it is also impacting our business a lot."

**Pain points:**
- **Peak-season cutover** amplified pain (onboarding blockers).
- **Requisition creation:** demand still via **email** with workforce/ops; **no approval workflow in Workday** today (known product capability not in use).
- **Evergreen + business reqs:** client-confidential naming → **delivery reqs not on public career site**; only evergreen exposed; process works but is sensitive to volume.
- **Pre-apply bot + landing page** workaround (outside Workday) had link expiry and delay issues; **Workday apply itself** acceptable once reached.
- **Offers:** cannot resend/regenerate for **date or compensation** changes at scale (**100–150 offers/day** span cited); **manual/legal-reviewed letters** as workaround; **no mass offer** actions.
- **eSign:** candidate **acknowledgement** only on candidate home (as described).
- **Positive:** overall flow and **manager visibility** (requisitions, fill rate) improved vs legacy; issues are **"small at volume = huge"**; **training on the job** during live hiring.

**JTBD:** When hiring thousands per week across sites, I want zero Saturday maintenance windows in India business days, resilient onboarding IDs, and scalable offer amendments, so peaks do not cost revenue or compliance risk.

---

## Synthesized Themes

#### Theme 1: Governance and approvals outside Workday

**Description:** Position and compensation approvals, leadership sign-off, and audit trails often live in **email and spreadsheets**, not in workflow. Recruiters re-key data and attach evidence manually.

**Evidence:** P2, P3, P4, P5 (all five voices).

**Triangulation:** *Customer-only in this file.* SME views may add configuration vs product gap (Step 7).

**Implication:** India enterprise deals need **in-system approval chains**, attachment policies, and discoverable audit history to reduce cycle time and risk.

**Representative quotes:**
> P3: "All the approvals whether it's the compensation approval the position approval we are taking it offline and then we are enclosing it as the documents before rolling out offers."

> P5: "There is no approval process on Workday… I know that Workday has an option of… stage-wise approvals… today, it's just a requisition which gets created, and we start working on it."

---

#### Theme 2: India identity, offer readiness, and candidate drop-off

**Description:** **PAN / Aadhaar (OTP) / UAN** and policy timing create **partial completion**, **OTP failures**, and **repeated candidate tasks**; recruiters report **material drop-off** and executive frustration; compliance intent clashes with UX gating.

**Evidence:** P3 (primary), P4, P5.

**Implication:** Harden **mandatory gating**, **re-entry/edit** for government IDs, **OTP reliability**, and **recruiter + candidate notifications**; align with **DPDP** consent and transparency (see 060 in PMF/PRD).

**Representative quotes:**
> P3: "The PP policy is that you need to have all three IDs before an offer can be extended… it also doesn't mark it as mandatory… the candidate will upload one ID and then they're free to move forward."

> P3: "Candidates come back and say that we are not even receiving the OTP."

---

#### Theme 3: High-volume duplicate detection, vendor upload, and source attribution

**Description:** **Manual duplicate checks** and **per-upload approvals** do not scale at **thousands of profiles/day**. **First-source / cooling-off** logic from legacy ATS is missed; **financial and contractual** consequences for agency credit.

**Evidence:** P4 (primary), P5; P3 on referral scatter.

**Implication:** Invest in **UDMF / duplicate framework** parameters (e.g. government ID), **bulk-safe automation**, and **source precedence** rules that respect India commercial and compliance constraints.

**Representative quotes:**
> P5: "Duplication needs to get automated… validation needs to be on more parameters than just first name, phone numbers, and email address… Aadhar number."

> P4: "Workday is capturing the second source… employee referral uploaded on 3rd December… vendor uploaded on 4th December… ideally my source should be 3rd December."

---

#### Theme 4: Offer document lifecycle and scale (regenerate, rescind, mass actions, eSign)

**Description:** **Regenerate offer** limitations for **compensation and date changes**, **rescind** access unclear to users, **no mass offer** corrections for batch moves, **acknowledgement-only** acceptance drives **screenshot** workarounds and **weak recruiter signals**.

**Evidence:** P3, P4, P5.

**Implication:** Roadmap items for **offer versioning**, **controlled rescind/resend**, **batch corrections**, and **integrated eSign** (e.g. Adobe Sign India/Aadhaar where required) with clear audit.

**Representative quotes:**
> P4: "Regenerate offer letter… I cannot use it for compensation change… 400-500 people who came back with a wrong compensation."

> P3: "There is no mail triggered when the candidate accepted our offer… we have to go back and check everything."

---

#### Theme 5: Reporting, dashboards, and operational visibility

**Description:** Leadership and specialised teams **export or use parallel tools (Thrive, Excel)** for aging, SLA, and team KPIs; Workday **reporting gaps** drive manual **Excel formulas** and **full-time analytics roles**.

**Evidence:** P3 (primary), P1/P2 context.

**Implication:** Prioritise **recruiting operational dashboards**, requisition aging, and **role-scoped notifications** (not generic task floods).

**Representative quotes:**
> P3: "There is no view on the reports… if I have a team around me… what is the progress on their positions… we are not able to do currently."

> P3: "Thrive gives us a better clarity… Workday doesn't give us that option."

---

#### Theme 6: Sourcing efficiency and application volume

**Description:** **No parsing** from major channels; **fake-open postings** to generate apply links; **very large applicant counts** with **no bulk review** and **optional resume** causing wasted recruiter time.

**Evidence:** P3 (primary); P5 on channel volume.

**Implication:** **Parser accuracy**, **mandatory resume**, **bulk disposition**, and **screening automation** (strategy-aligned: HiredScore, fraud detection) for India scale.

**Representative quotes:**
> P3: "I cannot parse CVs from… LinkedIn to work day… there should be an option… bulk uploading."

> P3: "I still have about 700 applications on that… I have to open each one separately."

---

## Strategic Alignment Assessment

**Step 1 Strategy Context:** `research/India/strategy-context-2026-03-31-IN-E2E-005.md`

**Alignment analysis:**

- **High alignment**
  - **Core ATS parity / scale** (Priority 3): Duplicate handling, bulk workflows, mobile/recruiter efficiency, and BGV-related identity capture match TP's pain (P4, P5, P3).
  - **AI matching and fraud** (Priority 2): High-volume grading and fraudulent-application detection align with **manual screening overload** and duplicate evasion (P4, P5).
  - **India regional pillars** (DPDP, identity, local workflows): Government ID, consent, and offer-stage data map directly to research themes.

- **Strategy–customer tension**
  - **Q2 GCC-first OKRs** vs **India revenue impact**: Saturday maintenance and **India working week** friction (P5) are not GCC-specific but affect **global reliability** narrative; India **8-customer** scale goal still needs **zero-downtime** and **peak-season readiness** story.

- **Neutral / cross-cutting**
  - **HCM processes** (attendance, pay group, no-show) affect same tenant journey but sit outside Recruiting-only scope; flag for **suite** conversations, not only Recruiting PM.

**Implications for @pmf-analyst**

- Weight **duplicate/source**, **offer lifecycle**, and **India ID/OTP** themes heavily in India PMF recommendations and RICE.
- Pair customer quotes with **060** on DPDP, EU AI Act (if AI screening), and **India-specific** identity handling.
- Treat **Thrive / Excel** as **workaround signal** for dashboard and notification gaps.

---

## Recommendations (product and research)

1. **Ship or enable in-system requisition and offer approvals** with audit trail and attachments, targeted at **email-first** enterprises in India; provide **adoption playbook** for stage-wise approvals (P2, P3, P5).
2. **Government ID and OTP reliability programme:** mandatory gates, editable pre-offer states, clear candidate messaging, and **support playbooks** for OTP failures; track **join-rate** pre/post (P3, P4).
3. **Scale duplicate and source ownership:** expand matching to **Aadhaar/PAN/UAN** where legally permissible; **first-source wins** within cooling-off; reduce **vendor approval** toil without breaking **rehire/compliance** (P4, P5).
4. **Offer management:** **regenerate** for compensation and start date, **rescind/resend** permissions, **batch** amend for cohort moves, **recruiter notifications** on acceptance, roadmap to **integrated eSign** (P3, P4, P5).
5. **High-volume UX:** **bulk candidate review**, **mandatory resume**, **parsing** and **bulk upload** from key India sources; align with **HiredScore** and roadmap **fraud detection** (P3, P4).
6. **Operational analytics:** requisition **aging**, SLA, and **role-scoped** alerts replacing generic task emails (P3, P5).
7. **Platform:** **Saturday / regional window** maintenance review for **India 6-day week** customers (P5).
8. **Next research:** validate with **1–2 additional India BPO/IT** tenants whether **agency fee / source** and **offer regeneration** patterns generalise beyond TP.

---

## Recommendations for Primary Research Slides

**For @pmf-analyst / 130 (SECTION 03: Primary Research - User Interviews)**

**Slide 1: Interview Participants**  
Table: P1–P5, role, TP (India).

**Slides 2–6: One slide per participant**  
Title: `P[n] - [Role], TP (India)`  
Body: Role context (2–3 bullets), 2 short quotes, top pain points.

**Slide 7: Key Themes from User Research**  
Bullets: (1) Approvals outside Workday, (2) India IDs and drop-off, (3) Duplicate/source at scale, (4) Offer lifecycle, (5) Reporting gaps, (6) Parsing and volume.

**Speaker note:** Cite transcript file paths and mission **IN-E2E-005** for audit.

---

## Full Thematic Analysis Report

**This document** contains the Braun & Clarke synthesis for Step 8. A separate deep-dive file under `research/India/thematic-analysis/` may be added if the PMF pipeline requires a standalone coded extract; **this run** treats `105-user-research-findings.md` as the canonical customer input for @pmf-analyst triangulation with `105-sme-research-findings.md`.

---

*End of report.*
