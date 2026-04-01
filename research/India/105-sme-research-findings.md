# Internal SME Research Findings: India Recruiting PMF

**Analysis date:** 31 March 2026  
**Data sources:** 5 internal SME interview / meeting note files  
**Methodology:** Braun & Clarke–style thematic synthesis (Path B) from full transcript re-ingestion  
**Mission context:** IN-E2E-005 – India regional E2E Step 7 (internal SME synthesis for PMF deck Section 8a)

---

## Fresh pass attestation

- **Mission ID:** IN-E2E-005  
- **Transcript files read (this run):** *None* (Step 7 scope: internal SME only; customer transcripts analysed in Step 8)  
- **SME files read (this run):**
  - `research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`
  - `research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`
- **Completed (UTC):** 31 March 2026  

---

## Internal SME participants

| SME ID | Name | Role | Organisation / context |
|--------|------|------|-------------------------|
| SME1 | Bernie | VP, Talent Product Management | Workday product leadership; India FY27 focus, strategic product gaps |
| SME2 | Fabiola Navarro | Sr. Product Advisor, Field Readiness | Workday; Lowe’s India/high-volume implementation experience |
| SME3 | Santosh Gulia | Sr. Functional Consultant, Global Services | Workday; NA + India deployments, BGC and document workflows |
| SME4 | David Lodola | Enterprise Architect (India), Workday Services | Genpact implementation; talent supply chain, internal mobility |
| SME5 | David Phillips | Director, Strategic Customer Engagement (Accenture), Workday | Accenture as anchor customer lens for India gaps |

*Note: Source file header for David Phillips uses “Philips” in one place; table uses the name as specified in the mission brief.*

---

## Key findings per SME

### SME1 – Bernie, VP, Talent Product Management

**Role context:** Executive product view on India as a strategic market (FY27 target opportunity), product gaps, and cross-functional follow-ups.

**Key insights**

- **Know Your Candidate (KYC) and fraud:** Framed as a major theme, analogous to banking KYC; large-scale resume and candidate-information fraud called out, including order-of-magnitude example (~100,000 resumes per month) and Accenture as a heavily affected segment.
- **Partnerships:** BrightHire discussed as an upcoming partner whose interview recording / skills-matching capability could support validation and consistency (complements fraud-trust narrative).
- **India product:** Explicit “India product gaps”; address localisation rollout for India addresses noted; regulations discussed in connection with KYC and fraud prevention.
- **Follow-through:** Action items reference consulting specific individuals (e.g. Andre, Alexis in Solution Enablement), internal brainstorms, and documents shared by Bernie.

**Hypotheses (from notes)**

- India readiness requires a coherent fraud/KYC story alongside localisation and roadmap clarity for FY27.
- Partner ecosystem (e.g. interview intelligence) may be part of the mitigation path, not product-only fixes.

**JTBD linkage (recruiter):** *Determine if candidate meets requirements* and *maintain data integrity* under extreme volume; *progress candidates efficiently* when trust in identity and credentials is uncertain.

---

### SME2 – Fabiola Navarro, Sr. Product Advisor, Field Readiness

**Role context:** Deep field implementation experience; primary example **Lowe’s** – **extremely high volume**, India-specific routing and automation.

**Key insights**

- **Offer and compensation (India):** Offer/compensation disclosure for India is repeatedly complex across projects: detailed tables, many calculated fields, frequent change requests, often **two documents** to the candidate (offer letter plus separate compensation breakdown). Fabiola characterises **compensation detail in offers** as the India theme she hears on **every** project where India is in scope.
- **High volume + speed vs. controls:** Heavy use of automation (auto-complete hire, automatic stage routing). **Start date** changes are common before hire completes; tension with auto-complete hire led to **Workday Extend** patterns to recreate start-date correction flows. Philosophy summarised as “get people in the seat,” then resolve changes – including **revising offers after hire** and **background checks continuing post-hire** – called out as **distinct to India** vs. typical US rigidity.
- **Background checks (India vs US):** More **flexibility** for India population: candidates could move toward hire **before** all background results returned (unlike US conditional rules). Friction was often **process**, not the integration vendor: customers want an **easy way to reinitiate** checks and to move candidates back/forward; parallel stages (e.g. drug + BGC in US) drove very complex business process and condition rules; **ASR** limitations when results return asynchronously required integration-driven forwarding.
- **Document collection:** Multiple candidate documents (e.g. past pay stubs, ID variants, **upload photo / passport photo**); tension with guidance that some data should not live in Workday – customer still required storage; patterns included **review document** / questionnaire with attachments.

**Hypotheses**

- First-party product value is in **configurable India offer templates**, **safer bulk/mass post-offer corrections**, and **first-class “reinitiate / loop back” BGC UX** without bespoke Extend for every large India program.
- **Trust and compliance** intersect with document volume: candidate home or structured attachment flows (as Santosh also raises) reduce review-step sprawl.

**JTBD linkage:** *Make a successful offer* with legally sufficient disclosure; *progress candidates* at scale without breaking when dates and BGC outcomes shift.

---

### SME3 – Santosh Gulia, Sr. Functional Consultant, Global Services

**Role context:** Functional deployment perspective across regions; India-specific BGC, candidate communication, and channel behaviour.

**Key insights**

- **Background checks in India:** Described as **extensive** and **highly variable** by customer – hard to standardise in a single business process.
- **Candidate document capture:** Advocates for a flexible **candidate-facing “box” / attachment capability** (aligned to roadmap discussions he had seen) so recruiters can request **non-standard** documents beyond fixed templates – important when needs differ from “standard” government ID patterns and when **design sessions** otherwise go wrong.
- **Stage flexibility:** Customers want documents **at different stages** – sometimes **before interview** (ID proof for verification during interview), not only at BGC; standard BP design often forces **review document** steps that are **awkward** when combined with offer BP and separate BGC BP – **multiple review rounds** are poor candidate experience. **Offer “add document”** flows are recruiter-centric; gap for **candidate-initiated** attach where recruiter says “attach here.” Unsolved cases often fall back to **email**.
- **Marketing communications / opt-in:** **GDPR-style opt-in** for marketing emails means the first touch is an opt-in request; **no response = no send**. At India volumes recruiters cannot chase every candidate; clients ask whether **opt-out** (with unsubscribe on each mail) fits India better and whether behaviour can be **region-configurable** (Europe strict, other regions flexible). **Magic-wand** answer: fix **opt-in** reach (e.g. blast 2,000 → only ~100 opt-ins vs far higher reachable with opt-out). Competitors often use **unsubscribe**-first patterns.
- **WhatsApp:** Describes as **preferred** channel in India over SMS; used for **back-and-forth** and **sharing links** (not usually full apply-in-WhatsApp); very high penetration. Confirms **Workday WhatsApp** on roadmap (timing discussed as possibly delayed).
- **Identity and fraud:** On direct question: yes – worked with a **major partner** with **~7 lakh people in India**; **fake candidates at interview**, sometimes leading to **legal** consequences; drives the ask for **confirmation / identity proof before interview** so interviewers can validate who joined the session. **BGC vendor** flows stay in vendor portals; **recruiter verification** docs sit in Workday.
- **Chatbot / AI:** Candidate **status** (“where is my application?”) and **interview scheduling** (availability, notify recruiter); **Workday messaging on WhatsApp** could power scheduling prompts; **Paradox** known; interest in native Workday direction.

**Hypotheses**

- India needs **multi-stage, configurable document requests** without multiplying “review document” nodes in the core BP graph.
- **Pre-interview identity capture** is a recurring services pattern driven by fraud risk, not edge case.
- **Configurable consent (opt-in vs opt-out) by region/tenant** is a measurable **reach** lever for sourcing campaigns in India.

**JTBD linkage:** *Determine if candidate meets requirements* (identity truth) and *maintain data integrity*; candidate-side *upload the right evidence at the right time*; *stay informed* on application status via channels candidates actually use.

---

### SME4 – David Lodola, Enterprise Architect, Workday Services (Genpact)

**Role context:** Rescue / enterprise architecture for **Genpact** – **~140k employees**, **~60% internal fills**, “talent supply chain” linking Recruiting, PSA, and Extend.

**Key insights**

- **Industrial scale:** Recruiting **“en masse”** (e.g. **100–200** openings at once); **too many individual clicks**; need **mass** processing for offers, employment agreements, approvals, sign-offs; large cohorts with same start date; **worksheets not used** for these flows (gap to understand or productise).
- **Know Your Candidate / fraud:** **Impersonation** – applicant **not the same person** as interview attendee; calls for **identity verification** (e.g. **facial recognition** raised as example).
- **BGC and data completeness:** BGC is **contractual** with clients on sensitive work; native Workday BGC seen as **too basic**; **Tydy** (middleware, Eightfold) used – needs **rich dataset**; desire to **collect all BGC data upfront in Workday** to avoid **double entry** and poor experience.
- **Auditability / fraud enabler:** **Career site** changes to **name, address, phone** with **little tracking** – **security risk**, can **bypass BGC** or support impersonation (connects to Phillips and fraud themes).
- **Engagement / no-show:** High **offer accept → no first-day**; third-party **messaging** for high-touch post-offer engagement.
- **Strategic ask (“magic wand”):** Recruiters **proactive**, **mass** actions, **full visibility** across **demand (PSA/projects)** and **supply** (internal + external); **Resource Manager as recruiter persona**; **HireScore** should better support **sourcing internal workers** nearing **project end** for rotation (per notes).

**Hypotheses**

- India high-volume services firms are a segment where **trust chain** (identity → auditable profile → BGC → hire) is as important as **throughput**.
- **PSA + Recruiting** unification is a differentiator for this ICP; fraud controls fail if candidate master data can change untracked.

**JTBD linkage:** *Manage requisitions and candidates at scale*; *collaborate with hiring teams* when demand is project-driven; integrity jobs under *maintain data integrity throughout the recruiting process*.

---

### SME5 – David Phillips, Director, Strategic Customer Engagement (Accenture), Workday

**Role context:** Accenture-centric view of **India scale** (e.g. **~200k** applications, duplicate volume) and market dynamics.

**Key insights**

- **Volume and compliance split:** Roughly **half** of India applications **not processed in Workday** (attributed to **internal compliance** – to clarify vs. regulatory).
- **Do Not Hire / blacklist:** Need to **auto-disposition** against a **Do Not Hire** list (ex-employees and others); noted as also relevant for **Singapore government** and **US federal** use cases.
- **Duplicates at scale:** **~200,000** duplicate applications; **auto-merge limited to two records** – need **merge of more than two records** for Accenture-scale churn and volume.
- **Fraud and “trickery” en masse:** India **high competition** drives **application fraud**; **AI** suggested to help **detect patterns** at volume; goal to return **time to hiring managers**.
- **ID validation:** Need to confirm **interviewee is the actual candidate** (direct alignment with Lodola impersonation theme).
- **Aspirational:** “Workday professional network” with **validated credentials** and **HireScore**-style ranking – illustrates demand for **pre-verified identity and skills** (strategic, not near-term requirement).

**Hypotheses**

- **DNH automation**, **multi-way merge**, and **interview-stage identity assurance** are Accenture-scale **table stakes** for India win-room.
- **Application fraud detection** (AI-assisted triage) is positioned as volume play, not only compliance.

**JTBD linkage:** *Efficiency metrics*; *data integrity*; *fair assessment* when fraud floods the funnel.

---

## Synthesized themes (SME-only)

Themes below are grounded in the five SME sources; **customer triangulation** awaits Step 8 (`105-user-research-findings.md`).

### Theme 1: Know Your Candidate, impersonation, and interview trust

**Description:** Multiple SMEs converge on **identity risk**: fake or mismatched interview attendees, need for **ID validation at interview**, and **pre-interview document** capture. Career site **editability without audit** amplifies risk (Lodola).

**Evidence:** Strong convergence – Bernie (KYC framing), Lodola (impersonation, facial recognition example), Phillips (ID validation, trickery), Santosh (fake candidates, legal cases, pre-interview proof).

**Implication:** Product should treat **identity assurance** and **audit trail on PII changes** as core India/high-volume investments, not optional hardening.

---

### Theme 2: Resume and application fraud at extreme scale

**Description:** **Volume of fraudulent or gaming behaviour** (Bernie: resume fraud at huge monthly scale; Phillips: “trickery,” AI to manage volume; Accenture stats).

**Evidence:** Bernie + Phillips (+ services scale context from Santosh’s 7-lakh partner).

**Implication:** Roadmap narrative: **detection, disposition, and recruiter efficiency** under fraudulent throughput; link to **HiredScore** / AI positioning with **human oversight** (EU AI Act / Art. 22 considerations for PMF/legal later).

---

### Theme 3: Industrial-scale operations (mass actions, merges, purge, DNH)

**Description:** **Clicks do not scale** for offers, approvals, and cohort starts; **duplicate explosion**; need **stronger blacklisting** and **application purge** at mass (Phillips); Genpact **mass processing** and **worksheet gap** (Lodola).

**Evidence:** Phillips (DNH, purge, multi-record merge, 200k apps), Lodola (mass offers/approvals, 100–200 reqs), Fabiola (automation-first, cohort behaviour).

**Implication:** PMF should bundle **bulk recruiter operations**, **UDMF/merge policy**, and **DNH** into one “**India scale operations**” epic family.

---

### Theme 4: India-specific offer, compensation, and post-hire change reality

**Description:** **Rich compensation disclosure** (tables, calcs, second document) is **pervasive** on India projects (Fabiola). **Start dates** and **offers** change **after** milestones US customers treat as final; **BGC** may **continue after hire**; India path **more permissive** on forward movement than US (Fabiola).

**Evidence:** Fabiola (Lowe’s); David Denham reflection in transcript that pattern is **unique to India**.

**Implication:** **Offer document generation**, **versioning**, and **controlled post-hire amendment** workflows are India differentiators; avoid forcing US-style rigidity without configurability.

---

### Theme 5: Background checks – integration depth, reinitiation, and stage placement

**Description:** BGC **varies by customer** (Santosh); **Tydy**-class richness vs. “basic” native (Lodola); **reinitiate** and **move backward** in process are recurring asks (Fabiola); **pre-BGC document** at interview (Santosh, Fabiola).

**Evidence:** All three implementation SMEs + fraud linkage.

**Implication:** Invest in **flexible BGC orchestration**, **candidate data once** into vendor, and **operator UX** for re-run / parallel outcomes – fewer Extend snowflakes.

---

### Theme 6: Document volume, storage tension, and candidate experience

**Description:** Many **non-standard attachments**; tension with **what should not be stored in Workday**; **review document** proliferation hurts CX (Fabiola, Santosh); candidate home **attachment hub** seen as desirable (Santosh, roadmap mention).

**Evidence:** Fabiola (Lowe’s documents, passport photo); Santosh (attachment “box”, stage flexibility).

**Implication:** Structured **document taxonomy**, **optional external vault** integration, and **fewer sequential review steps** – align with DPDP / retention thinking in later legal pass.

---

### Theme 7: Ecosystem and partners

**Description:** **BrightHire** (Bernie) for interview evidence; **Tydy** (Lodola) for BGC middleware; **messaging** tools for no-show (Lodola); Phillips’ **validated network** idea.

**Implication:** India PMF deck should show **native + partner** lanes; avoid implying Workday builds every verification modality alone.

---

### Theme 8: Candidate communications – marketing reach, consent model, and WhatsApp

**Description:** **Marketing communication opt-in** (GDPR-driven default) **starves reach** at India volumes; SMEs and customers need **region-configurable** **opt-out + unsubscribe** patterns where legally viable. **WhatsApp** is the **default** channel for candidate engagement and link-sharing in India; ties to **scheduling** and **status** chatbot concepts.

**Evidence:** Santosh (primary); aligns with Lodola’s post-offer **high-touch messaging** and Fabiola’s **speed-first** candidate progression.

**Implication:** PMF should pair **channel strategy** (WhatsApp roadmap) with **consent configuration** and **legal review** (DPDP, GDPR, market-specific marketing law); position **messaging + light automation** as throughput, not only compliance overhead.

---

## Strategic notes (for @pmf-analyst)

- **Convergence:** KYC/fraud, mass ops, and India offer/BGC flexibility are **multi-SME** themes – strong internal triangulation before customer readout.
- **Open items:** Phillips’ “internal compliance” split for Workday vs non-Workday application processing; Bernie’s **FY27 TO** acronym (clarify in strategy context).
- **Customer names in SME transcripts:** Lowe’s, Genpact, Accenture appear as **illustrative**; Step 8 customer quotes remain anonymised per P1–Pn rules.

---

## Recommendations for SME research slides (130 deck consumption)

**Section 8a: Internal SME interviews**

**Slide 1 – Internal SME interviews – Workday experts**

- Title: *Internal SME interviews – India recruiting*  
- Bullets (keep ≤7–8 lines total per 010):  
  - Five Workday SMEs (product VP, field readiness, global services, India enterprise architect, Accenture SCE)  
  - Multi-customer visibility: Lowe’s, Genpact, Accenture-scale patterns, major consultancy partner (Santosh)  
  - Dates: Jan 2025 – Jul 2025 + Nov 2024 (Bernie notes)  
  - Purpose: triangulate **high volume** and **Know Your Candidate** before customer primary research  
  - Limitation: internal lens; **not** a substitute for customer voices (Step 8)  

**Slide 2 – SME participants**

- Table: columns **SME | Name | Role | Context** (same as table above).

**Slide 3 – Bernie – VP, Talent Product Management**

- KYC / resume fraud at scale; India gaps + address localisation; FY27 India focus; BrightHire as interview validation angle; regulations + follow-ups (brainstorms, shared docs).

**Slide 4 – Fabiola Navarro – Field Readiness**

- Lowe’s: extreme volume; India offer/compensation complexity (tables, calcs, two documents); automation vs start-date / post-hire offer changes; India BGC flexibility vs US; reinitiate BGC; document collection and storage tension.

**Slide 5 – Santosh Gulia – Global Services**

- India BGC variability; candidate attachment “box” and roadmap alignment; documents before interview for ID; fake interview candidates and legal exposure; BP limitations with review-document steps across offer/BGC; **marketing opt-in vs opt-out** and India reach; **WhatsApp** as primary channel; chatbot for **status** and **scheduling** (incl. link to WhatsApp messaging).

**Slide 6 – David Lodola – Enterprise Architect, Genpact**

- Talent supply chain; mass hiring friction; impersonation + identity verification; Tydy BGC; career site audit gap; no-shows; resource manager persona; HireScore + internal rotation; PSA integration.

**Slide 7 – David Phillips – Accenture SCE**

- Application volume and Workday/compliance split; DNH; merge of more than two duplicate records; fraud/trickery + AI; ID validation at interview; validated credential network concept (vision).

**Slide 8 – SME synthesis – themes for India PMF**

- Bullets: **(1)** KYC / impersonation / interview ID **(2)** Mass ops – bulk, merge, DNH, purge **(3)** India offer + post-hire change **(4)** BGC depth + reinitiate **(5)** Documents + candidate home **(6)** Partner ecosystem **(7)** Comms – consent reach, WhatsApp, chatbot status/scheduling  

**Speaker notes cue for 130:** Each SME slide should carry **References:** file paths to the five `internal-sme-transcripts/*.txt` sources for auditability.

---

## Full thematic analysis

This file is the **canonical Step 7 artefact** for **IN-E2E-005**. A separate dated file under `research/India/thematic-analysis/` may be added if the pipeline requires a long-form Braun & Clarke appendix; the synthesised themes above are complete for **@pmf-analyst** and **130** Section 8a.

---

*End of SME findings (Step 7). Customer transcripts: Step 8 only.*
