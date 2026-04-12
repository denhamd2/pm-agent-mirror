# User Research Findings: GCC Recruiting PMF (Customer Interviews)

**Analysis Date:** 05 April 2026  
**Data Sources:** 3 customer transcripts (SME transcripts: none for this mission)  
**Methodology:** Braun & Clarke (2006) six-phase thematic analysis  
**Mission:** GCC-E2E-034 (Regional E2E Step 8 – customer interviews only)

## Fresh pass attestation

- **Mission ID:** GCC-E2E-034  
- **Transcript files read (this run):**
  - `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`
  - `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`
  - `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`
- **SME files read (this run):** *None* (Step 8 scope: customer transcripts only)  
- **Completed (UTC):** 2026-04-05T12:00:00Z  

---

### Interview Participants

- **P1** – Recruitment Lead (Cyber Security and Campus Hiring), Accenture  
- **P2** – Performance and Innovation Manager (Talent Acquisition functional lead), Baker Hughes  
- **P3** – Product Owner, Talent and Resourcing, Shell  

---

### Key Findings per Participant

#### P1 – Recruitment Lead (Cyber Security and Campus Hiring), Accenture

**Role context:** Leads cyber security hiring across Egypt, GCC, and parts of Africa; campus hiring and event capture in Workday; manages a small team; runs requisitions end to end (posting, sourcing, pipeline, notes). Multinational; candidates typically use English.

**Key quotes:**

> "Why doesn't the system allow me that capability … it took me another 5–10 minutes to go and assign the roles and then move the candidates across … then … remove my name as an assignee."

> "It's very restrictive when it comes to allowing you to add your notes to candidates … there's no option to add notes … if you haven't moved them to the screen stage."

> "If workday can give us those capabilities [historic funnel metrics on a requisition] … it would be absolutely brilliant."

> "I think if that capability is added to Workday directly where we can schedule interviews and it will send notifications … it will be a lot better."

> "When you're doing anything that's outside of what was already configured, it become near impossible … every time … we're given a two months deadline for developers."

> "If we can do that through Workday … documents … upload them against multiple categories … that would be brilliant … confidentiality issues as well."

> "Absolutely WhatsApp is an absolute necessary … when you're looking at WhatsApp, you get immediate responses."

> "If you're building a scheduling tool … it wouldn't block you but it will give you a notification in red … you're not meeting the regulatory requirements … are you sure you want to proceed."

**Pain points:**

- Security / role design blocks moving candidates across requisitions without temporary self-assignment workarounds.  
- Cannot capture screening-style notes until a specific pipeline stage.  
- Unclear or missing in-product requisition funnel analytics (applied / screened / advanced splits).  
- Interview scheduling lives in another system; wants hiring-manager slot entry and candidate notifications inside Workday.  
- Offer generation and extensions outside standard grade bands require long configuration cycles; drives offline contracts and approval risk.  
- Post-offer document collection via email is inefficient and raises confidentiality concerns.  
- KSA-specific needs: interview panel composition (e.g. nationality mix), minimum notice periods, documented candidate consent when exceptions apply.  
- In-product dashboards for candidate and requisition overview are hard to use; relies on export and manual dashboard building.  
- Kuwait rollout slow (generic “new country” setup pain).  

**Insights / JTBD (see `docs/jtbd-recruiting-hr-professional-and-manager.md`):** Recruiter job – *when* managing high-stakes, multi-country reqs, *I want* frictionless movement, notes, scheduling, and compliant offers *so I can* hit targets without workarounds. HR professional job – *when* reporting nationalisation and diversity, *I want* reliable fields and reporting *so I can* evidence compliance.

---

#### P2 – Performance and Innovation Manager, Baker Hughes

**Role context:** Global TA tools, analytics, reporting, and process; functional counterpart to technical Workday team; Baker Hughes on Workday since 2020. Uses Phenom CRM alongside Workday.

**Key quotes:**

> "Rather than having to go through multiple tabs, can most of the important information be integrated … so that they spend less time trying to navigate."

> "I don't think the boolean search is that strong on workday … I would definitely want to see a much more … improved boolean search capabilities."

> "We have two million candidates in our workday database … can I see who else is matching that requirement … who have not applied for this job but are matching."

> "We tried to utilize the workday scheduling capability … it felt more complicated than scheduling a meeting via Outlook."

> "Having something like a WhatsApp … would be helpful especially in markets like GCC and Saudi."

> "The campaign functionality in workday … is limited email campaigns at this point."

> "The career site … cannot be branded … we are … using a phenom solution … apply redirect … land on phenom … then … workday career site."

> "Almost 40% or more actually coming via a mobile or a handheld device … how intuitive is [applying] through a handheld."

> "We … added capturing of the nationality in UAE and Saudi … as a custom field … out of the box solution is only for US and UK … penalties if we don't meet … localization percentage."

**Pain points:**

- Candidate profile UX: critical data spread across tabs; slow for high-volume review.  
- Search: weak boolean; desire for database-wide matching and “not yet applied” suggestions (AI-assisted).  
- Interview scheduling in Workday perceived as harder than Outlook; productivity hit.  
- Campaigns: email-only limits vs WhatsApp-led engagement in GCC.  
- Career site branding and multi-hop apply flows (Phenom → Workday) hurt candidate experience.  
- Mobile-heavy applicants; mobile apply UX is a differentiator.  
- Nationalisation: custom-field workarounds vs native, country-aware compliance packages.  

**Insights / JTBD:** Recruiter – *when* reviewing large slates, *I want* single-surface candidate insight and stronger search *so I can* shortlist faster. TA operations – *when* expanding in GCC, *I want* local communication and compliance without extra vendors *so I can* reduce cost and integration risk.

---

#### P3 – Product Owner, Talent and Resourcing, Shell

**Role context:** Owns talent and resourcing landscape with heavy Workday use since 2020; interfaces with recruiters, sourcing, COE, operations (scheduling, offers), and HR digital. Global lens; GCC sits in “franchise” operating model (JVs, lower volume, more manual local reporting).

**Key quotes:**

> "Difficulties and challenges with workday is its reporting functionality … we did have to resort building a dashboard separately … in PowerBI."

> "Having that granular view per requisition and per candidate … how much time it takes … up to having that bigger overview … we have that everything in the PowerBI dashboard."

> "For offers specifically the Arabic countries … workday docs … Arabic letters … it would just be squares rather than the actual characters."

> "Franchise countries … local variances that we're not able to roll up … workday would just be a data source and then they'd also have to do some manual bits."

> "We try to also keep it official … we just avoid the company name being compromised … we can't use [WhatsApp] for official business purposes."

> "The struggle is really being able to know … across all of the hundreds of CV … who we should be paying attention to … we're looking at hired score etc."

> "In the GCC region … more meek and conservative approach … the demand to act upon those requirements largely lies on the western countries."

**Pain points:**

- Maturity of Workday dashboards vs need for multi-dimensional recruiting views (LOB, location, management level, stage timing).  
- Offer documentation: RTL / complex script rendering in Workday Docs historically blocked automation.  
- Franchise / GCC: small volumes, local legal reporting often Excel-based; risk of offline/email workflows outside controlled systems.  
- Corporate policy restricts unofficial channels (e.g. WhatsApp) despite regional norms; emphasis on email, SMS, Teams.  
- High application volume globally vs few openings drives interest in AI prioritisation (e.g. HiredScore).  

**Insights / JTBD:** HR / people analytics – *when* steering global and franchise hiring, *I want* trustworthy in-product reporting *so I can* avoid parallel BI stacks. Compliance – *when* handling sensitive candidate data, *I want* work in-platform *so I can* reduce email leakage and audit gaps.

---

### Braun & Clarke methodology trace

| Phase | What we did |
|-------|-------------|
| **1. Familiarisation** | Read all three transcripts end to end; noted recruiter, TA ops, and global product-owner perspectives; flagged GCC-specific (KSA panels, nationalisation, WhatsApp) vs global patterns (reporting, search, scheduling). |
| **2. Initial codes** | Examples: `Cross-Req-Move-Friction`, `Notes-Stage-Gate`, `Req-Funnel-Visibility`, `Scheduling-In-Product`, `Offer-Config-Lag`, `Document-Collection-Email`, `WhatsApp-Critical`, `Regulatory-Interview-Notice`, `Panel-Composition-KSA`, `Grid-Tab-Overload`, `Boolean-Search-Weak`, `Talent-Pool-Match-AI`, `Scheduling-vs-Outlook`, `Career-Site-Branding`, `Apply-Redirect`, `Mobile-Apply`, `Nationalisation-Custom-Field`, `Reporting-PowerBI-Workaround`, `Docs-RTL-Arabic`, `Franchise-Manual-Reporting`, `WhatsApp-Policy-Block`, `Volume-Shortlist-AI`. |
| **3. Search for themes** | Clustered codes into six candidate themes (workflow/config; scheduling + regulation; reporting; discovery/AI; candidate experience; compliance + identity of channel). |
| **4. Review themes** | Checked each theme against counter-evidence (e.g. Shell WhatsApp restriction vs Accenture/Baker Hughes enthusiasm); merged overlapping codes; ensured theme labels matched data scope. |
| **5. Define and name themes** | Final names below; boundaries drawn so “communication” and “compliance” stay distinct. |
| **6. Report** | This document; quotes anonymised as P1–P3 with company and role retained. |

**Triangulation note:** No SME transcripts were in scope for this run. Themes are **customer-only**; @pmf-analyst should triangulate with SME findings (if any), CI, and PESTEL from other pipeline steps.

---

### Synthesized Themes

#### Theme 1: Recruiter workflow friction (security, stages, and configuration latency)

**Description:** Day-to-day recruiting actions bump into access rules, stage-gated notes, and slow configuration cycles for offers and edge cases, forcing manual workarounds and offline processes.

**Evidence:** All three organisations (P1 explicit on moves, notes, offers; P2 on integrated-system constraints touching HCM; P3 on franchise offline/email risk).

**Triangulation:** Customer-only (no SME file this run).

**Implication:** Prioritise permission patterns for “move and tag” with audit, flexible notes pre-stage, and faster-turnaround configurability for offer templates and grades in growth markets.

**Representative quotes:**

> P1: "It become near impossible … we're given a two months deadline for developers."

> P2: "We could not touch something because it will impact downstream HCM."

---

#### Theme 2: Interview scheduling – product usability and embedded compliance cues

**Description:** Customers want scheduling that rivals calendaring tools, with notifications to candidates and hiring managers; in KSA, scheduling must reflect panel rules and notice-period law, ideally via warnings rather than silent violation.

**Evidence:** P1 (strongest: regulatory detail + desire for in-product scheduling); P2 (Workday scheduling harder than Outlook); P3 (operations layer and franchise context, less GCC scheduling depth).

**Triangulation:** Customer-only.

**Implication:** Position Paradox / Interview Team Optimization as core GCC narrative; invest in configurable **compliance nudges** (notice period, panel mix) for KSA and extensible pattern for other markets.

**Representative quotes:**

> P1: "If you're building a scheduling tool … notification in red … regulatory requirements."

> P2: "Felt more complicated than scheduling a meeting via Outlook."

---

#### Theme 3: Reporting and in-product visibility (operational and executive)

**Description:** Native dashboards and drill-downs do not match how TA leaders run the business; customers export or rebuild in PowerBI/Excel, especially for franchise or low-volume entities.

**Evidence:** P1 (requisition overview, unreadable dashboards); P3 (PowerBI as primary; per-req and per-candidate timing); P2 indirect (analytics owner persona).

**Triangulation:** Customer-only.

**Implication:** Roadmap hooks for recruiter-friendly requisition portfolios, funnel metrics per req, and leadership slices; acknowledge franchise “small N” reporting in enablement.

**Representative quotes:**

> P1: "I can't go into workday and select … a nice dashboard of all these roles … tedious task."

> P3: "The dashboard capabilities of workday was not able to accommodate what we needed."

---

#### Theme 4: Talent discovery (search, boolean, and AI-assisted matching)

**Description:** Finding the right candidates inside large talent databases is labour-intensive; customers want stronger boolean/semantic search and proactive suggestions for matches who have not yet applied.

**Evidence:** P2 (primary); P3 (HiredScore / AI interest for high volume).

**Triangulation:** Customer-only.

**Implication:** Align with HiredScore and recruiter-agent narrative; GCC sales stories should include “find hidden matches in existing talent” not only external sourcing.

**Representative quotes:**

> P2: "Can I see who else is matching that requirement … people … not applied for this job but are matching."

> P3: "Knowing … who we should be paying attention to … we're looking at hired score."

---

#### Theme 5: Candidate experience (career site, mobile, language, documents)

**Description:** Multi-vendor apply paths and limited career site branding create drop-off; mobile is critical in Middle East flows; Arabic script in documents and offers must render correctly; structured document upload beats email.

**Evidence:** P2 (career site, apply redirect, mobile %, Arabic/English mix); P3 (Arabic glyphs in Workday Docs); P1 (post-offer document upload, English-standard CVs but GCC regulatory extras).

**Triangulation:** Customer-only.

**Implication:** Single-ecosystem apply, mobile-first apply UX, RTL-safe offer documents, and configurable document requests post-offer.

**Representative quotes:**

> P2: "Land on phenom … then … workday career site … more seamless experience."

> P3: "It would just be squares rather than the actual characters."

---

#### Theme 6: Nationalisation, diversity tracking, and communication channel strategy

**Description:** GCC customers must track nationality and local quotas, often via custom fields; penalties sharpen the need for native packages. WhatsApp is seen as essential for speed in GCC, but global enterprises may ban it for phishing and brand-risk reasons, favouring email, SMS, and Teams.

**Evidence:** P1 (nationality, gender, PWD quotas; WhatsApp); P2 (UAE/Saudi nationality capture, penalties, WhatsApp for campaigns); P3 (policy against WhatsApp; conservative GCC diversity reporting vs West).

**Triangulation:** Customer-only.

**Implication:** Product: country-aware compliance templates and reporting. GTM: position **optional** WhatsApp with governance; ensure strong email/SMS/Teams parity for regulated employers.

**Representative quotes:**

> P2: "We'll get penalty … if we don't meet … localization percentage."

> P3: "We can't use [WhatsApp] for official business purposes … shame … hired score … integration."

---

## Strategic Alignment Assessment

**Step 1 Strategy Context:** `research/GCC/strategy-context-2026-04-05-GCC-E2E-034.md`

**Alignment analysis:**

- **High alignment – GCC market readiness (Q2 Priority 1):** Themes 2 (scheduling + KSA rules), 5 (mobile, language, documents), and 6 (nationalisation, WhatsApp where allowed) match stated priorities on WhatsApp/SMS, nationalisation, and localisation.  
- **High alignment – AI candidate matching (Priority 2):** Theme 4 and P3’s HiredScore discussion support AI matching and shortlisting narratives.  
- **High alignment – Core ATS parity (Priority 3):** Themes 1 and 3 (workflow, reporting, scheduling vs Outlook) are table-stakes blockers in sales cycles.  
- **Strategy–customer tension – Channel governance:** Q2 doc stresses WhatsApp for GCC; P3 (Shell) illustrates **enterprise policy** blocking unofficial messaging. Roadmap and enablement must show **channel choice** and trusted comms, not WhatsApp-only positioning.  
- **Neutral / nuanced:** P3’s view that diversity reporting intensity is lower in GCC than in Western markets **does not remove** P1/P2 legal penalty drivers; interpret as **segment variation** (franchise vs high-local-compliance professional services).

**Implications for @pmf-analyst:**

- Weight **nationalisation and interview-law guardrails** heavily in GCC recommendations (P1, P2).  
- Surface **reporting and dashboard** gaps as parity risks alongside communication features.  
- Call out **customer segment split**: high-touch WhatsApp-led TA vs regulated global employers restricting channels.  
- Use **Paradox + compliance nudges** as a bundled story to address Theme 2.

---

### Recommendations for downstream consumption (@pmf-analyst and 130 deck)

**For @pmf-analyst (PMF report):**

- Elevate **six validated customer themes** above as primary qualitative evidence; map each to opportunity areas (scheduling/reg tech, reporting, talent discovery, CX/localisation, compliance packages, channel strategy).  
- Add **RICE-style hooks**: e.g. scheduling + regulatory warnings (reach: GCC KSA-heavy tenants; impact: deal unblocker + audit risk reduction).  
- Explicit **segment matrix**: “WhatsApp-first regional TA” vs “global enterprise comms policy” with product mitigations (email/SMS/Teams, consent, audit trails).  
- Cross-reference **Broadbean** for boards (strategy context) when discussing candidate journey; do not propose native board builds per product context rule.  
- Cite this file’s **Fresh pass attestation** for audit trail.

**For 130 (Primary Research / Customer slides):**

- **Slide – Participants:** Table: P1 – Recruitment Lead (Cyber Security & Campus), Accenture; P2 – Performance and Innovation Manager, Baker Hughes; P3 – Product Owner, Talent and Resourcing, Shell.  
- **Slide – P1:** Quotes on cross-req moves, notes gate, scheduling wish, offer rigidity, WhatsApp, KSA scheduling law; pain bullets as above.  
- **Slide – P2:** Tabs/grid friction; search/AI matching; Outlook vs Workday scheduling; career site + mobile; nationalisation custom fields.  
- **Slide – P3:** PowerBI workaround; Arabic docs; franchise manual reporting; WhatsApp policy vs regional norm; HiredScore interest.  
- **Slide – Key themes:** Six theme titles with one-line descriptions (from Synthesized Themes).  
- **Speaker notes:** Flag **divergence** on WhatsApp (P1/P2 vs P3) for presenter guidance.

**Opportunity solution tree (Teresa Torres hook for PRD / discovery):**

- **Outcome:** Faster, compliant hiring in GCC with fewer tools and exports.  
- **Opportunities:** (a) In-product scheduling with regulatory guardrails, (b) Talent discovery at scale, (c) Trustworthy reporting, (d) Unified candidate journey and documents, (e) Configurable compliance data models, (f) Channel-flexible candidate comms.  
- **Solutions:** Map to Paradox, HiredScore, Recruiting reporting roadmap, career site / apply, Docs/i18n, CE channels (WhatsApp, SMS, email), nationalisation templates.

---

### Full Thematic Analysis Report

**Location:** Methodology trace and themes are consolidated in this file (`research/GCC/105-user-research-findings.md`) for GCC-E2E-034 Step 8. A separate dated file under `research/GCC/thematic-analysis/` may be added in future missions if the orchestrator requests a split artefact.

---

*End of report.*
