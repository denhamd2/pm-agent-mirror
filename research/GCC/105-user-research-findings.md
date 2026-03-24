# GCC User Research Findings

**Analysis Date:** 24 March 2026 | **Version:** v57 (GCC-E2E-017)

## Fresh pass attestation
- **Mission ID:** GCC-E2E-017
- **Transcript files read (this run):**
  - `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`
  - `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`
  - `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`
- **SME files read (this run):** *None*
- **Completed (UTC):** 24 March 2026

---

**Data sources:** 3 customer transcripts, 0 internal SME transcripts  
**Methodology:** Braun & Clarke-style thematic synthesis (codes and themes derived from full transcript re-read for this mission)

---

## Interview Participants

- **P1** - Recruiter Lead (Cyber Security & Campus Hiring), Accenture
- **P2** - Performance & Innovation Manager (Global TA), Baker Hughes  
- **P3** - Product Owner (Talent & Resourcing), Shell

---

## Key Findings per Participant

### P1 - Recruiter Lead, Accenture

**Role context:** Leads cyber security and campus hiring covering Egypt, GCC, and part of Africa; manages a team of five; uses Workday for priorities and performance; runs events and full lifecycle reqs (posting, sourcing, pipeline, notes).

**Key quotes:**
> "Why doesn't the system allow me that capability … it took me another what 5 10 minutes to go and assign the roles and then move the canvas across."

> "It's very restrictive when it comes to allowing you to add your notes to candidates … there's no option to add notes on a candidate if … you haven't moved them to the screen stage."

> "The system should manage the end to end process not just pockets of it and pockets are manage through a different … website."

> "WhatsApp is an absolute necessary … you get immediate responses, almost immediate responses."

**Pain points:**
- Moving candidates between requisitions blocked unless tagged to each req (admin overhead to add/remove self as assignee)
- Cannot add screening-style notes before the candidate reaches the screen stage
- Unclear whether Workday exposes rich historic funnel metrics per requisition (applied / screened / rejected splits)
- Interview scheduling handled in another integrated system; wants in-product scheduling, notifications, and hiring manager slot entry
- Offer generation rigid when outside pre-configured grade bands; long lead times for config changes drive offline contracts and approvals
- Candidate reporting and dashboards hard to interpret; exports and manual dashboard building described as tedious

**GCC- and KSA-specific:**
- Wants candidate document collection in Workday (upload by category) instead of email attachments (confidentiality, inbox clutter)
- KSA: interview panel rules (e.g. at least one Saudi national on panel; record nationality to validate ~50% nationals); scheduling tool should warn (not necessarily block) if interview is inside three-day notice unless candidate consent is documented
- Nationalization targets tracked in Workday (e.g. Emiratization, Saudization, Kuwaitization) plus gender and PWD (Egypt 5%, elsewhere 4%) via application fields and reporting
- Standard candidate language is English; limited experience with Arabic résumé parsing

**JTBD (illustrative):** When managing reqs and compliance across GCC, recruiters want one system to run pipeline, scheduling, offers, and reporting so they can hit targets without workarounds.

---

### P2 - Performance & Innovation Manager, Baker Hughes

**Role context:** Global TA tools, technology, analytics, and process owner; partners with technical Workday team; live on Workday since 2020; migrated from standalone ATS (Taleo) into unified HCM ecosystem.

**Key quotes:**
> "Can most of the important information be integrated into a single tab or in a more seamless way?"

> "I would definitely want to see a much more improved boolean search capabilities within workday."

> "We have … two million candidates in our workday database … can I see who else is matching that requirement … who have not applied for this job but are matching."

> "It felt more complicated than scheduling a meeting via Outlook."

**Pain points:**
- Candidate grid: critical information split across tabs (e.g. education vs CV); friction at high review volumes (100–200 candidates)
- Search: Boolean and field combinations feel weak; interest in AI-assisted and semantic matching across the full talent database
- Interview scheduling: trial of Workday scheduling felt harder than Outlook; desire to keep recruiters in one ecosystem
- Career site: limited native branding; uses Phenom with apply redirect (job board → Phenom → Workday), hurting seamless candidate experience
- Campaign tooling: WhatsApp and richer channels used via Phenom; Workday campaigns seen as email-centric

**GCC- and regional specifics:**
- WhatsApp valued for campaigns and communication in GCC and Saudi
- Apply language mix: English common for professional roles; Arabic more important for operational / blue-collar roles
- Heavy mobile apply: ~40%+ of career site traffic from mobile or handheld devices
- Nationalization: capturing nationality in UAE and Saudi via custom fields; desire for out-of-the-box localization reporting comparable to US/UK diversity-style delivery; penalties if mandates not met

**JTBD (illustrative):** When recruiters triage and match at scale, they want dense candidate context in one view and stronger search so they can fill reqs faster with less tool-switching.

---

### P3 - Product Owner, Shell

**Role context:** Owns talent and resourcing landscape globally; Workday TA and talent modules since 2020; interfaces with recruiters, sourcers, operations (scheduling, offers), and HR digital / DevOps.

**Key quotes:**
> "The dashboard capabilities of workday was not able to accommodate what we needed."

> "Knowing immediately who we should be paying attention to [from hundreds of CVs]."

> "Workday docs … we had challenge … with the Arabic letters … it would just be squares rather than the actual characters."

**Pain points:**
- Built PowerBI dashboards (from ~2022–23) because Workday dashboards and reporting did not meet multi-level needs (operational per-req/candidate timing through to leadership views by line of business and location)
- Franchise / joint-venture markets (includes GCC): different operating models, small volumes, local legal reporting often handled outside Workday (e.g. Excel) or with manual steps; risk of email-based workflows for candidate data
- Offer automation: Workday Docs limitation for Arabic (and historically Mandarin) character rendering blocked letter automation
- High application volume vs few openings globally drives need for prioritisation (e.g. HiredScore / AI exploration)

**GCC- and franchise-specific:**
- GCC countries classed as franchise / JV: lower external hiring volumes; may use agencies and minimal in-house recruiter footprint
- Shell policy restricts official WhatsApp for recruiting (fraud / brand impersonation concerns); prefers email, SMS, and Teams with verifiable identity
- On nationalization: from global Shell lens, Western markets drive stronger ethnicity/gender reporting obligations; GCC characterised as comparatively less demanding in how Shell prioritises those metrics, with exceptions elsewhere (e.g. Malaysia)

**JTBD (illustrative):** When orchestrating global and franchise hiring, talent teams want trustworthy reporting and document automation in-platform so local variants do not default to email and spreadsheets.

---

## Synthesized Themes

### Theme 1: Candidate review density and navigation tax

**Description:** Recruiters lose time opening multiple tabs or views to assemble education, CV, and screening context.

**Evidence:** P1 (notes and stage restrictions; multiple steps to move candidates), P2 (education vs CV on separate tabs at volume), P3 (hundreds of CVs vs few roles—need to know who matters)

**Triangulation:** 3/3 customer convergence

**Implication:** A more consolidated candidate review experience (single high-density view, notes policy review) supports GCC and global high-volume review.

**Representative quotes:**
> P2: "Rather than having go through multiple different tabs, can most of the important information be integrated … in a more seamless way."

> P3: "Knowing immediately who we should be paying attention to [from hundreds of CVs]."

---

### Theme 2: Search, matching, and AI-assisted discovery

**Description:** Customers want stronger Boolean and field logic plus database-wide matching of non-applicants to open reqs.

**Evidence:** P1 (interest in AI for workflow and historic insight), P2 (Boolean weak; 2M-candidate database; "who else matches"), P3 (prioritisation across high apply volume—HiredScore / AI)

**Triangulation:** 3/3 customer convergence

**Implication:** Semantic search, similar-candidate surfacing, and explainable ranking address a shared global need with extra payoff in large talent pools.

**Representative quotes:**
> P2: "Can I look at all of the people in our database [and] who are the people that have not applied for this job but are matching."

---

### Theme 3: Interview scheduling friction and end-to-end orchestration

**Description:** Scheduling is either external or perceived as harder than calendaring tools; desire for compliant, panel-aware scheduling in-product.

**Evidence:** P1 (external system; end-to-end in Workday; KSA notice and panel rules), P2 (Workday scheduling vs Outlook), P3 (less direct on scheduling—operations-heavy model)

**Triangulation:** 2/3 strong (P1, P2); P3 indirect via franchise / ops model

**Implication:** Native or deeply integrated scheduling (e.g. Paradox) plus configurable compliance hints for KSA notice and panel composition.

**Representative quotes:**
> P1: "If you're building a scheduling tool … it wouldn't block you but it will give you a notification in red … you're not meeting the regulatory requirements."

> P2: "It felt more complicated than scheduling a meeting via Outlook."

---

### Theme 4: Offers, documents, and configuration rigidity

**Description:** Offer letters and document workflows break when grades, languages, or processes fall outside standard configuration.

**Evidence:** P1 (rigid offers, long change cycles, offline contracts), P3 (Arabic glyphs in Workday Docs), P1 (candidate document upload vs email)

**Triangulation:** 2/3 explicit (P1, P3)

**Implication:** Flexible offer/document templates, RTL and Arabic character support in generated documents, and in-flow document collection reduce GCC and global risk.

**Representative quotes:**
> P3: "It would just be squares rather than the actual characters."

> P1: "Every time we say … we need this included, we're given a two months deadline for developers."

---

### Theme 5: Nationalization, diversity, and OOB compliance reporting

**Description:** GCC customers track nationality and localization targets; many use custom fields and want first-class, regional OOB reporting.

**Evidence:** P1 (Emiratization, Saudization, Kuwaitization, gender, PWD), P2 (UAE/Saudi nationality capture; penalties; "bandaids" vs OOB), P3 (franchise local reporting often manual; Shell de-prioritises GCC vs Western quota rigour)

**Triangulation:** 2/3 strong product gap signal (P1, P2); P3 contextual (franchise / volume)

**Implication:** Native nationalization dimensions and audit-ready reporting for KSA/UAE/Kuwait etc., without every customer re-implementing custom fields.

**Representative quotes:**
> P2: "If you're able to add more in terms of the local requirements … more out of the box … versus … bandaids."

---

### Theme 6: WhatsApp, campaigns, and channel policy divergence

**Description:** GCC recruiters treat WhatsApp as essential for speed; enterprise policy may forbid it (Shell), driving need for configurable official channels and strong email/ SMS in-product.

**Evidence:** P1 ("absolute necessary"), P2 (WhatsApp via Phenom; email-only campaigns in Workday), P3 (official restriction; email, text, Teams)

**Triangulation:** 3/3 discuss channels; 2/3 active WhatsApp use for hiring

**Implication:** Native WhatsApp where policy allows; robust campaign and two-way comms in Workday for customers who cannot use WhatsApp officially.

**Representative quotes:**
> P1: "When you're looking at WhatsApp, you get immediate responses, almost immediate responses."

> P3: "We just avoid … WhatsApp … classified as something that we … can't use for official business."

---

### Theme 7: Mobile-first apply and career site experience

**Description:** Large share of applications from phones; multi-hop apply redirect (partner career site → Workday) hurts experience.

**Evidence:** P2 (~40%+ mobile; Arabic for operational roles; Phenom redirect path), P1/P3 less numeric but aligned on digital journeys

**Triangulation:** 1/3 explicit metric; regional pattern reinforced by P2

**Implication:** Mobile-optimised apply, language choice by segment, and tighter career site / apply path options.

**Representative quotes:**
> P2: "Almost say 40% or more actually coming via a mobile or a handheld device."

---

### Theme 8: Reporting, dashboards, and BI spill-over

**Description:** In-app dashboards and reporting perceived as insufficient; customers export or rebuild in PowerBI or Excel.

**Evidence:** P1 (dashboards "gave me a headache"; download and rebuild), P2 (team feedback on presentation of data), P3 (PowerBI for multi-audience views; franchise Excel for tiny volumes)

**Triangulation:** 3/3 customer convergence

**Implication:** Configurable recruiter and leader dashboards, clearer funnel analytics per req, and export patterns that match how franchise and global teams consume data.

**Representative quotes:**
> P3: "The dashboard capabilities of workday was not able to accommodate what we needed."

> P1: "I can't go into workday and select … a nice dashboard of all these roles … I'll need to sort of download it and create my own."

---

## Recommendations for Primary Research Slides

**For 120 / 130 to use when building the PMF report and roadmap deck:**

**SECTION 03: Primary Research - User Interviews**

**Slide 1: Interview Participants Overview**
- Title: "Interview Participants"
- Content: Table with P1–P3, role, company (Accenture, Baker Hughes, Shell)

**Slide 2–4: One slide per participant**
- Title: "P1 - Recruiter Lead, Accenture" (and similarly for P2, P3)
- Content: Role context, 2–3 key quotes, pain points, GCC notes where stated

**Slide 5: Key Themes from Interviews**
- Title: "Key Themes from User Research"
- Content: Themes 1–8 above in short bullet form (navigation tax, search/AI, scheduling, offers/docs, nationalization OOB, WhatsApp vs policy, mobile apply, reporting/BI)

---

### Full Thematic Analysis Report

**Location:** To be produced by **120** at `research/GCC/thematic-analysis/[date]-GCC-PMF-Analysis.md` when PMF analysis runs.

---
