# User Research Findings for GCC

## Fresh pass attestation

- **Mission ID:** GCC-E2E-032
- **Transcript files read (this run):**
  - `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`
  - `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`
  - `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`
- **SME files read (this run):** *None* (no `.txt` files in `research/GCC/internal-sme-transcripts/`)
- **Completed (UTC):** 2026-03-28T20:15:00Z

---

**Analysis Date:** 2026-03-28  
**Data Sources:** 3 customer transcripts, 0 SME transcripts  
**Methodology:** Braun & Clarke–informed thematic synthesis (Teresa Torres continuous discovery; story-based evidence extracted from full transcript read-through)

---

### Interview Participants

- **P1** - Recruitment Lead (Cyber Security & Campus Hiring), Accenture
- **P2** - Performance and Innovation Manager, Talent Acquisition, Baker Hughes
- **P3** - Product Owner, Talent and Resourcing, Shell

---

### Key Findings per Participant

#### P1 - Recruitment Lead (Cyber Security & Campus Hiring), Accenture

**Role context:** Leads cyber security and campus hiring covering Egypt, GCC, and Africa; manages a small team; uses Workday for performance management, campus events, and end-to-end requisition handling including posting, sourcing, pipeline moves, and candidate notes.

**Key quotes:**

> "Sometimes … this candidate is suitable … to a position that one of my recruiters are working on [but] the system … didn't allow me to move candidates unless I'm tagged to those requisitions … it took me another … 5–10 minutes to go and assign the roles and then move the candidates across."

> "Screening notes … it's very restrictive … there's no option to add notes on a candidate if … you haven't moved them to the screen stage."

> "If workday can have integration with WhatsApp and it starts sending messages to candidates and scheduling their interviews … it's just going to be absolutely brilliant."

> "If you're building a scheduling tool … it wouldn't block you but it will give you a notification in red to say … you're not meeting the regulatory requirements when it comes to setting up the interviews are you sure you want to proceed."

**Pain points:**

- Permissions and assignee tagging block efficient cross-requisition candidate moves for leads.
- Notes capture tied to pipeline stage limits pre-screen documentation.
- Unclear in-product funnel/historic metrics per requisition (funnel views).
- Interview scheduling relies on a separate integrated system; desire for native Workday scheduling with notifications and hiring-manager slot capture.
- Offer letter configuration rigidity and long lead times for changes; pressure to use offline contracts when levels or rules are missing.
- Candidate document collection via email vs structured upload categories in Workday.
- KSA-style rules: interview notice periods, panel composition/nationality, consent when waiving notice; wants soft warnings, not silent violations.
- In-product dashboards and candidate reporting described as hard to read; exports required to build custom views.
- Kuwait rollout delay called out as operational pain (country setup timeline).

**JTBD (linked to `docs/jtbd-recruiting-hr-professional-and-manager.md`):** When managing high-touch and compliance-heavy hiring across multiple GCC countries, recruiters want to move talent and document decisions in one system without workarounds, so they can hit targets and audit nationalisation and panel rules.

---

#### P2 - Performance and Innovation Manager, Talent Acquisition, Baker Hughes

**Role context:** Global TA technology and process owner; partners with technical Workday team; Baker Hughes on Workday since 2020; values single HCM ecosystem but notes recruiter-level constraints where changes affect downstream modules.

**Key quotes:**

> "The information is good but you have to navigate through different tabs … can most of the important information be integrated … into a single tab … when they're trying to go through 100 candidates or 200 candidates."

> "I don't think the boolean search is that strong on workday … I would definitely want to see a much more … improved boolean search capabilities … AI assisted searches … who else is matching that requirement."

> "We tried to utilize the workday scheduling capability … it felt more complicated than scheduling a meeting via Outlook."

> "Having something like a WhatsApp or other communication methodologies would be helpful especially in markets like GCC and Saudi."

> "We cannot get a … fully branded … career site … we are … using a phenom solution … apply redirect … somebody finds a job on a job board … they land on the phenom career site, then … on workday career site, then they apply."

**Pain points:**

- Candidate grid / profile navigation across tabs slows high-volume review.
- Search (boolean, field combinations, database-wide matching) seen as weaker than best-in-class ATS/CRM; interest in AI-assisted matching inside the req context.
- Native scheduling perceived as less productive than Outlook; interest in packaged Paradox if economics improve vs standalone.
- Campaigns: email-only campaign limits vs WhatsApp and multi-channel needs in GCC.
- Career site branding and multi-hop candidate journey (Phenom → Workday) harm experience and integration cost.
- Mobile-heavy apply traffic (~40%+ from handheld) raises bar for mobile apply UX.
- Arabic and English mix, especially for operational/blue-collar roles vs professional English norms.
- Nationalisation: custom fields for UAE/Saudi; desire for more out-of-the-box local compliance reporting vs "bandaid" solutions; penalties for missing localisation targets.

**JTBD:** When operating enterprise recruiting at scale across regions, TA operations want fewer tools and smoother recruiter and candidate journeys, so teams can comply locally without fragmenting data across Phenom, Outlook, and Workday.

---

#### P3 - Product Owner, Talent and Resourcing, Shell

**Role context:** Owns talent and resourcing tooling with heavy Workday use since 2020; interfaces with recruiters, sourcers, operations (scheduling, offers), and HR digital/DevOps; global remit with GCC framed as "franchise" joint-venture markets with lower volume and more manual local reporting.

**Key quotes:**

> "Difficulties and challenges with workday is its reporting functionality … we did have to resort building a dashboard separately … in PowerBI because the dashboard capabilities of workday was not able to accommodate what we needed."

> "For offers specifically the Arabic countries … workday docs … we had challenge … with the Arabic letters … it would just be squares rather than the actual characters."

> "From a messaging perspective … we're … not supposed to use WhatsApp for our European recruiting counterparts because … we can't use for official business … we saw … hired score … there's an integration."

> "GCC countries … franchise … local variances that we're not able to roll up from a global perspective … workday would just be a data source and then they'd also have to do some manual bits."

**Pain points:**

- Reporting and dashboards: exported to PowerBI for executive and operational views (requisition mix, time-in-stage, LoB demand); in-product maturity historically insufficient.
- Offer documentation: RTL/Arabic character rendering in Workday Docs was a blocker (since improved for some scripts; Arabic cited as historically problematic).
- Franchise / GCC: small requisition volumes, local legal reporting often handled outside BI (e.g. Excel); tension between global standardisation and local obligations.
- High application volume vs few openings globally drives interest in AI ranking (e.g. HiredScore); less urgent where volumes are tiny.
- Candidate communication: official channels emphasise email, SMS, MS Teams; WhatsApp discouraged for fraud/scam risk; contrasts with regional norms elsewhere.
- Data compliance: concern when franchise markets handle candidates via email outside the system.

**JTBD:** When governing a global template with local joint ventures, HR digital wants one auditable system of record with reporting that scales from global roll-ups to franchise exceptions, so compliance and efficiency do not force shadow processes.

---

### Synthesized Themes

#### Theme 1: Scheduling, panels, and labour-law nuance (GCC)

**Description:** Customers want scheduling that rivals calendar tools, embeds hiring-manager availability, and respects KSA/GCC rules (notice periods, panel composition, documented consent when exceptions apply).

**Evidence:** Strong in P1 (explicit regulatory examples); P2 (scheduling vs Outlook); P3 indirect (operations scheduling in scope).

**Triangulation:** Customer-only (no SME transcripts this run).

**Implication:** Position native or deeply integrated scheduling (e.g. Paradox) with configurable compliance prompts and audit-friendly panel metadata for KSA/UAE contexts.

**Representative quotes:**

> P1: "If you're building a scheduling tool … give you a notification in red … you're not meeting the regulatory requirements."

> P2: "Workday scheduling … felt more complicated than scheduling a meeting via Outlook."

---

#### Theme 2: Recruiter efficiency – grid, search, and notes

**Description:** High-volume recruiters need fewer clicks, stronger search (boolean, semantic/AI), and freedom to capture screening notes without artificial stage gates; leads need cross-req moves without assignee gymnastics.

**Evidence:** P2 (tabs, search, AI matching); P1 (notes, permissions, cross-req moves).

**Triangulation:** Customer-only.

**Implication:** Prioritise candidate review UX, search investment, and role design patterns that empower leads without compromising security.

**Representative quotes:**

> P2: "Rather than having go through multiple different tabs, can most of the important information be integrated … into a single tab."

> P1: "There's no option to add notes on a candidate if … you haven't moved them to the screen stage."

---

#### Theme 3: Nationalisation and local compliance reporting

**Description:** GCC hiring must support capture and reporting of nationality, gender, PWD, and local quotas; customers compare Workday to "US/UK out-of-the-box" diversity models and want first-class regional templates, not only custom fields.

**Evidence:** P1 (quotas, tracking); P2 (penalties, OOTB gap); P3 (franchise manual reporting, Excel for tiny volumes).

**Triangulation:** Customer-only.

**Implication:** Roadmap nationalisation dashboards, standard fields, and report packs for KSA/UAE/Kuwait-style mandates; clarify global vs franchise reporting patterns.

**Representative quotes:**

> P2: "If we don't meet … localization percentage we … get penalties."

> P1: "I need the ability to track … nationalization … gender … PWD … regulatory requirement compliance."

---

#### Theme 4: Candidate communication channels

**Description:** WhatsApp is described as essential for fast candidate response in GCC (P1, P2); enterprise policy may still forbid it (P3), creating a segmentation and trust narrative (official channels vs regional speed).

**Evidence:** P1 and P2 strongly pro-WhatsApp; P3 explains corporate restrictions and scam risk.

**Triangulation:** **Divergence** across customers (policy vs regional norm).

**Implication:** Ship WhatsApp where legally and contractually allowed; support governance (verified sender, audit trails) and alternative channels (SMS, email, Teams) for restricted tenants.

**Representative quotes:**

> P1: "WhatsApp is an absolute necessary … when you're looking at WhatsApp, you get immediate responses."

> P3: "We try to also keep it official … we just avoid the company name being compromised … not supposed to use WhatsApp … for official business."

---

#### Theme 5: Offers, documents, and RTL

**Description:** Offer flexibility and document automation must cope with grade/level exceptions without multi-month configuration delays; Arabic script in generated documents was a cited historical pain.

**Evidence:** P1 (offer rigidity, offline documents); P3 (Arabic glyphs in Workday Docs).

**Triangulation:** Customer-only.

**Implication:** Shorten configuration cycle for offer variants; verify Docs/RTL parity for Arabic offer letters and candidate communications in GCC pilots.

---

#### Theme 6: Career site, apply journey, and mobile

**Description:** Multi-step external career site → ATS journeys hurt conversion; mobile share is material for Middle East applicants; language mix (Arabic for operational roles) matters.

**Evidence:** P2 (Phenom redirect chain, mobile %, language mix).

**Triangulation:** Customer-only.

**Implication:** Tighter partner or native career experiences, mobile-first apply, and locale-aware flows for professional vs operational hiring.

---

### Recommendations for Primary Research Slides

**For 120 / 130 to use when building the PMF report and roadmap deck:**

**SECTION 03: Primary Research - User Interviews**

**Slide 1: Interview Participants Overview**

- Title: "Interview Participants"
- Content: Table with P1–P3, role titles, companies (Accenture, Baker Hughes, Shell)

**Slides 2–4: One slide per participant**

- P1: Cross-req moves, notes, scheduling + compliance warnings, WhatsApp, dashboards, offers
- P2: Grid/tabs, search/AI, scheduling vs Outlook, WhatsApp/campaigns, career site journey, mobile, nationalisation OOTB
- P3: PowerBI reporting, Arabic Docs history, franchise GCC model, WhatsApp policy vs regional practice, HiredScore interest

**Slide 5: Key Themes from Interviews**

- Title: "Key Themes from User Research"
- Content: Scheduling & labour law; Recruiter efficiency (grid/search/notes); Nationalisation reporting; Communication channel divergence; Offers/RTL; Career site & mobile

---

### Strategic Alignment Assessment

**Step 0 Strategy Context:** `research/GCC/strategy-context-2026-03-28-GCC-E2E-032.md`

**Alignment analysis:**

- **High alignment:** WhatsApp and GCC messaging (P1, P2), interview scheduling friction (all three), nationalisation/compliance (P1, P2, P3), mobile/candidate experience (P2), AI-assisted search/matching (P2, P3) map directly to Q2 priorities (GCC market readiness, AI matching activation, core ATS parity including Paradox/scheduling narrative).
- **Strategy–customer tension:** Shell-style avoidance of WhatsApp for official business (P3) vs regional "must have" (P1, P2) implies product and GTM need **tenant-configurable** channel strategy and strong trust/compliance positioning, not a single global default.
- **Neutral / contextual:** Franchise low-volume GCC entities (P3) may under-index on PowerBI-scale investments; roadmap should still deliver in-product reporting slices so small markets are not forced entirely offline.

**Implications for 120:**

- Weight scheduling, messaging, nationalisation, and recruiter UX heavily in roadmap synthesis; cite **channel policy divergence** explicitly when scoring reach/confidence by segment.
- Pair AI matching themes with EU AI Act / regional AI governance from Step 0 PESTEL/SWOT when framing risk.

---

### Full Thematic Analysis Report

**Location:** Detailed Braun & Clarke PMF report with triangulation to **101** CI and optional **106**/**108** inputs is produced by **120** at `research/GCC/thematic-analysis/[YYYY-MM-DD]-GCC-PMF-Analysis.md` (this **105** file is the Step 2a structured input for that pass).

---

### Opportunity solution tree (sketch for downstream PRD / discovery)

- **Outcome:** Faster, compliant hiring in GCC with fewer tools and clearer audit trails.
- **Opportunities:** (1) Scheduling and regulatory guardrails, (2) Recruiter velocity on review/search/notes, (3) Nationalisation visibility, (4) Trusted omnichannel candidate comms, (5) Frictionless apply and offers including RTL.
- **Solutions (illustrative):** Integrated scheduling + Paradox; compliance-aware scheduling warnings; grid/search improvements; WhatsApp/SMS with governance; nationalisation report templates; career site / mobile investments; offer/document RTL hardening.
