# Internal SME Research Findings: India Recruiting PMF

**Analysis Date:** 01 April 2026  
**Data Sources:** 5 internal SME interview notes / transcripts  
**Methodology:** Structured synthesis of internal expert perspectives (Teresa Torres opportunity framing; Braun & Clarke-style coding across SME narratives)  
**PM context (orchestrator):** New market entry; customer conversations flagged **high-volume hiring** and **Know Your Candidate** (fraud / identity verification). This pass prioritises SME evidence on those themes.

## Fresh pass attestation

- **Mission ID:** INDIA-PMF-006
- **Transcript files read (this run):** *None* (Step 7 SME-only; customer transcripts analysed in Step 8)
- **SME files read (this run):**
  - `research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`
  - `research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`
- **Completed (UTC):** 01 April 2026

---

## Internal SME Participants

| SME ID | Name | Role | Organisation / context |
|--------|------|------|-------------------------|
| SME1 | Bernie | VP of Talent Product Management | Workday product leadership; India PMF / fraud / partnerships |
| SME2 | Fabiola Navarro | Sr. Product Advisor, Field Readiness | Deployment and field patterns; India-scoped customer examples (e.g. Lowe's) |
| SME3 | Santosh Gulia | Sr. Functional Consultant, Global Services | Multi-customer India implementations; recruiting business process design |
| SME4 | David Lodola | Enterprise Architect (India), Workday Services | Genpact implementation; high-volume professional services / talent supply chain |
| SME5 | David Phillips | Director, Strategic Customer Engagement (Accenture), Workday | Accenture as anchor customer lens for India scale |

---

## Key findings per SME

### SME1 – Bernie, VP of Talent Product Management

**Role context:** Executive product view on India opportunity, fraud scale, and ecosystem levers (partners, FY27 focus).

**Key insights:**

- **Know Your Candidate (KYC) and resume fraud** are called out as a major theme, framed analogously to banking KYC; scale illustration includes order-of-magnitude handling of very large monthly resume volumes and Accenture called out again as acutely affected.
- **High-volume recruiting** sits alongside fraud as a core India narrative in the notes.
- **Partnerships:** BrightHire noted as an upcoming partner; narrative links interview recording / skills alignment to validating candidates and consistency (supporting trust in the funnel).
- **India market focus:** FY27 India TO (target opportunity) and explicit **India product gaps** called out; **address localisations** for India mentioned as a concrete rollout area.
- **Regulations** raised in connection with KYC / fraud prevention and Indian market complexity.
- **Follow-ups** in notes: loop in named stakeholders (e.g. Andre, Alexis in Solution Enablement), review brainstorm materials and docs Bernie shared.

**Hypotheses:**

- Product and GTM need a **single India narrative** that ties KYC / fraud, volume, and localisation to FY27 targets.
- **Partner-led verification** may need explicit positioning next to native Workday capabilities to close trust gaps at scale.

**Themes emphasised:** High-volume hiring; Know Your Candidate / fraud; India localisation and roadmap; partnerships; regulatory framing.

**Customer triangulation (Step 8 placeholder):** Await `105-user-research-findings.md`; expect reinforcement on volume + identity if customer P1–P5 match Accenture / Genpact-style scale.

---

### SME2 – Fabiola Navarro, Sr. Product Advisor, Field Readiness

**Role context:** Field Readiness; repeated exposure to **India in scope** on implementations; illustrated with Lowe's India-related configuration (offer / compliance complexity).

**Key insights:**

- **Offer and compensation in India** is repeatedly painful: complex offer letters, change requests, and need to keep updating compensation and offer details beyond standard flows.
- **High-volume operational reality:** Mass updates / extend forms discussed in context of moving many candidates; start-date and hiring-volume dynamics influence decisions such as **auto-complete hire**.
- **Background check timing and automation:** India-specific pattern discussed where **background check kicks off only after** certain milestones; **ASR** limitations noted when BGC completes at variable times, driving **custom integrations** to move candidates to ready-for-hire.
- **India-distinct lifecycle:** Interviewer and interviewee align that **updating the offer after hire** and **background check continuing post-hire** appears **especially characteristic of India** (not commonly heard elsewhere).
- **Genpact / David Lodola** cross-reference: Fabiola notes overlap with prior Genpact-heavy SME input (professional services, project-based, **high-volume internal mobility**).

**Hypotheses:**

- India needs **stronger BGC orchestration** (triggers, stage flexibility, post-hire continuation) without forcing brittle custom integrations for every large employer.
- **Offer management** (versioning, mass updates, hire-date churn) should be treated as a first-class India scale requirement, not only a localisation string problem.

**Themes emphasised:** High-volume hiring and mass change; offer/compensation complexity; BGC stage logic and integrations; India-specific post-hire / BGC patterns.

**Customer triangulation (Step 8 placeholder):** Map customer quotes on offer delays and BGC to Fabiola’s Lowe’s / ASR narrative; divergence would signal industry-specific vs pan-India patterns.

---

### SME3 – Santosh Gulia, Sr. Functional Consultant, Global Services

**Role context:** Hands-on India deployments; North American customers with India presence also in background; deep business process configuration.

**Key insights:**

- **High-volume hiring:** India clients process **very high candidate volumes**; firms want **ID and multiple proofs early** (sometimes **before interview**) to ensure they are engaging the **right person**; where Workday could not support, clients fall back to **email** (undesired).
- **Document collection:** India BGC is **extensive and varies by customer**; need **flexible candidate attachment** (conceptually a **candidate-home “box”**) for **non-standard** documents (education, certifications), not only standard government ID via fixed steps. **Review-document steps** that push docs to candidates and back are a **poor fit** for high-touch India flows.
- **Stage flexibility:** Need **attach points at multiple pipeline stages** (pre-interview, interview, BGC, offer); current BP constraints limit **recruiter asks for upload** without awkward review steps; offer-BP document features skew **recruiter-to-candidate review**, not **candidate self-attach** on demand.
- **Identity / fraud:** At **7 lakh** (~700,000) people scale with a major partner, **fake candidates** and **impersonation** at interview led to **legal** exposure; driving **pre-interview identity proofs** and **interviewer confirmation** prompts (ID shown vs person interviewed).
- **BGC vendors:** Custom integrations often work; vendor portals handle some uploads **outside Workday**; **pre-BGC document capture in Workday** is recruiter-centric for the patterns described.
- **Marketing communication opt-in:** GDPR-driven **opt-in** for marketing emails **blocks reach** when candidates do not act; India recruiters **cannot call everyone** to opt in; **opt-out** plus unsubscribe on each email suggested; **region-configurable** treatment requested (strict in Europe, different elsewhere). **Magic wand** ask: fix **opt-in / reach** for volume sourcing.
- **WhatsApp:** Ubiquitous for candidate comms; **links** shared via WhatsApp; roadmap awareness; **Paradox** mentioned in ecosystem; native **Workday messaging on WhatsApp** could tie to **scheduling** and **status** use cases.
- **Chatbot / AI:** Candidates chasing status when recruiters juggle many reqs; **scheduling** and **availability** via conversational flow; integration vision with WhatsApp.

**Hypotheses:**

- A **governed, flexible candidate document capture** model (profile vs job-application scoped) is a **primary India enabler** for KYC-lite and BGC prep at scale.
- **Configurable consent model** (marketing comms) by region is a **volume lever** as important as feature gaps in screening.

**Themes emphasised:** High-volume hiring; Know Your Candidate / impersonation; document capture flexibility; marketing comms consent; WhatsApp and messaging; AI / chatbot for status and scheduling.

**Customer triangulation (Step 8 placeholder):** Strong predicted **convergence** with customer themes on volume and identity; any **divergence** on email consent may appear if customers prioritise DPDP strictness over reach.

---

### SME4 – David Lodola, Enterprise Architect (India), Workday Services (Genpact)

**Role context:** Led architecture for **Genpact**; **~140k** employees; **~60%** internal fills; **Talent Supply Chain** bridging Recruiting, PSA/projects, and Workday Extend.

**Key insights:**

- **Industrial-scale recruiting:** **100–200+** openings in batch; **mass actions** needed for offers, agreements, approvals, sign-offs; **worksheets** not adopted for these processes; friction is **click-load**, not single-hire UX.
- **Know Your Candidate:** **Impersonation** (applicant ≠ interview attendee) called out as a **significant India** issue; need for **identity verification** (e.g. facial recognition) to protect interview integrity.
- **BGC:** **Contractual** with clients on sensitive programmes; native Workday BGC seen as **too basic**; **Tydy** (middleware, **Eightfold** context in notes) used; gap is **rich upfront data capture in Workday** to avoid **duplicate candidate entry** in vendor portals.
- **Auditability / fraud enabler:** **Career site** changes to **PII** (name, address, phone) with **weak audit trail** flagged as **security and compliance** risk and enabler of **BGC bypass / impersonation**.
- **Engagement:** High **no-show after offer accept**; Genpact buys **messaging** solutions for **high-touch** candidate engagement between offer and day one.
- **Magic wand:** **Proactive, en masse** recruiter and **Resource Manager** experience with **full talent supply chain visibility** (demand from PSA + supply of internal/external candidates).
- **Ecosystem:** Custom **Workday Extend** bridge app; **HireScore** internal sourcing gaps for workers **nearing project end** noted; need **PSA + Recruiting** cohesion and **internal rotation** support.

**Hypotheses:**

- **KYC + audit-grade PII change tracking** should be treated as one system story (identity + data integrity).
- **Bulk lifecycle actions** are a **table-stakes** requirement for India professional services and captives at scale.

**Themes emphasised:** High-volume and mass processing; Know Your Candidate / impersonation; BGC depth and middleware reality; auditability on career site; post-offer engagement; talent supply chain / internal mobility.

**Customer triangulation (Step 8 placeholder):** Expect overlap with **Accenture-scale** customer narratives; Lodola adds **PSA / internal mobility** lens beyond external funnel fraud.

---

### SME5 – David Phillips, Director, Strategic Customer Engagement (Accenture), Workday

**Role context:** Accenture as **primary** customer lens for **Indian market** gaps.

**Key insights:**

- **Scale:** ~200,000 applications; **duplicate** volume; **auto-merge** limited to **two** records at a time; need **multi-way** merge at scale.
- **Volume processing:** **Mass** job application **purge** and broader **mass operations** gaps.
- **Fraud / trickery:** India **intense competition** drives applicant **trickery**; **AI** suggested to **detect patterns** at volume; goal to return **hiring manager time**.
- **Know Your Candidate:** Need **ID validation** so **interviewee = actual candidate**; capability to combat **application fraud en masse**.
- **Governance:** **Do Not Hire / blacklist** automation to **disposition** against a list (ex-employees and others); noted **broader** applicability (e.g. Singapore government, US federal).
- **Strategic concept:** **Workday-powered validated professional network** (LinkedIn-like) with **HireScore**-style ranking and **pre-verified** credentials (monetisation ideas in notes; product implications need refinement).
- **Process split:** **~Half** of India applications **not** flowing through Workday today due to **internal compliance** (clarify policy vs regulatory drivers).

**Hypotheses:**

- **Identity + dedupe + DNH** form a **single trust triangle** for India at extreme scale.
- **AI-assisted fraud signal** should be framed with **human oversight** and local law (EU AI Act / DPDP) in downstream PRD work, not as fully automated rejection.

**Themes emphasised:** Extreme high-volume hiring; duplicates and merge limits; fraud and trickery; ID validation at interview; blacklist / DNH; AI as assistive lever.

**Customer triangulation (Step 8 placeholder):** Phillips and Lodola **converge** on impersonation / ID and volume; Step 8 should test whether **non-Workday compliance funnel** (50% bypass) still holds.

---

## Cross-SME thematic synthesis (for @pmf-analyst)

| Theme | SME coverage | Implication for product / roadmap storytelling |
|--------|----------------|-----------------------------------------------|
| **Know Your Candidate / impersonation / ID** | Bernie, Santosh, Lodola, Phillips (Fabiola indirect via BGC integrity) | Position **identity confidence** across **apply → interview → BGC**; avoid treating BGC vendors as sole fix. |
| **High-volume hiring and mass operations** | All five | **Bulk actions**, merge >2, purge, offer mass processing, Resource Manager workflows. |
| **Document capture and BGC orchestration** | Santosh, Fabiola, Lodola | Flexible **candidate-upload** surfaces; **stage-based** triggers; **India post-hire BGC** pattern. |
| **Data integrity / auditability** | Lodola, Phillips | **Career site PII change** audit; ties to fraud and compliance narratives. |
| **Consent / marketing reach** | Santosh | **Region-configurable** marketing comms model; **opt-out** framing for India volume. |
| **Channels (WhatsApp / messaging / AI)** | Santosh, Bernie (partners) | WhatsApp and conversational **status / scheduling** as **volume** and **experience** enablers. |
| **Ecosystem** | Bernie, Lodola, Phillips | Partners (BrightHire, Paradox, Tydy/Eightfold); native vs partner boundaries must be explicit in recommendations. |

**Related JTBD (indicative):** Recruiters and hiring teams **hire trustworthy candidates at scale** with **defensible process**; **minimise rework** on offers and BGC; **sustain candidate reach** in high-competition markets (`docs/jtbd-recruiting-hr-professional-and-manager.md`).

---

## Recommendations for SME Research Slides

**For @pmf-analyst / 130 when building the PMF report and deck:**

**SECTION 8a: Internal SME Interviews**

**Slide 1 – Internal SME interviews – Workday experts**

- Content: **Five** Workday SMEs with **India recruiting** exposure (VP Product, Field Readiness, Global Services, Services EA, Strategic Customer Engagement); date span **Jan 2025–Nov 2024** (Bernie notes dated Nov 2024) through **July 2025**; purpose: **triangulate** internal delivery reality ahead of customer Step 8; limitation: **internal views supplement, do not replace** customer evidence.

**Slide 2 – SME participants**

- Content: Table as in **Internal SME Participants** above (SME ID, Name, Role, Context).

**Slide 3 – SME1 – Bernie, VP Talent Product Management**

- **KYC / fraud:** Know Your Candidate, resume fraud at scale, Accenture severity.
- **Volume:** High-volume India recruiting as strategic theme.
- **Partnerships:** BrightHire-style validation; ecosystem lever.
- **India roadmap:** FY27 India focus, gaps, address localisation.
- **Hypothesis:** Unified India story: fraud + volume + localisation.
- **Triangulation:** Pending Step 8 customer themes.

**Slide 4 – SME2 – Fabiola Navarro, Sr. Product Advisor, Field Readiness**

- **Offer / compensation:** India offer-letter and comp complexity (Lowe's example).
- **Volume:** Mass changes, auto-complete hire considerations.
- **BGC / ASR:** Variable BGC completion drives custom automation; India kick-off timing.
- **India-specific:** Offer updates after hire; BGC continues post-hire.
- **Hypothesis:** BGC orchestration + offer lifecycle for India scale.
- **Triangulation:** Pending Step 8.

**Slide 5 – SME3 – Santosh Gulia, Sr. Functional Consultant, Global Services**

- **Volume + KYC:** Pre-interview proofs; email workarounds when Workday cannot attach flexibly.
- **Documents:** Candidate-home style attachment; avoid review-step overload.
- **Fraud:** Impersonation and legal exposure at very large population scale.
- **Comms:** Marketing opt-in vs volume; opt-out / regional config.
- **Channels:** WhatsApp; chatbot for status and scheduling.
- **Triangulation:** Pending Step 8.

**Slide 6 – SME4 – David Lodola, Enterprise Architect (Genpact)**

- **Mass processing:** Batches of reqs and starts; mass offers/approvals.
- **KYC:** Impersonation; facial recognition class solutions.
- **BGC:** Tydy middleware; upfront data in Workday.
- **Integrity:** Career site PII change audit gap.
- **Supply chain:** PSA, Extend, internal rotation, HireScore gaps.
- **Triangulation:** Pending Step 8.

**Slide 7 – SME5 – David Phillips, Director (Accenture engagement)**

- **Scale:** ~200k applications; duplicate volume; merge >2 records.
- **Trust:** DNH/blacklist; fraud/trickery; ID validation at interview.
- **AI:** Assistive detection at volume.
- **Funnel:** Partial Workday bypass for compliance; validate in customer research.
- **Triangulation:** Pending Step 8.

**Slide 8 – SME synthesis – India recruiting trust and scale**

- Content: **Three bullets** – (1) **Know Your Candidate** spans documents, interview identity, auditability, dedupe; (2) **High-volume** requires mass ops, BGC flexibility, comms reach; (3) **Ecosystem** (partners + native) must be intentional. Speaker notes: cite SME file paths from Fresh pass attestation.

---

### Full thematic analysis (optional deep dive)

No separate `research/India/thematic-analysis/…-SME-only.md` was generated in this pass; this file is the **canonical Step 7 artefact** for @pmf-analyst. Optionally run `/thematic` on the same five files to produce a formal Braun & Clarke appendix.

---

**Handoff:** Proceed to **Step 8** (`105-user-research-findings.md`, customer-only), then **@pmf-analyst** to triangulate SME + customer themes and feed **130** Section 8a and primary research sections.
