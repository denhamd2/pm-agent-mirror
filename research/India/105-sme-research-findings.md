# Internal SME Research Findings: India Recruiting PMF

**Analysis Date:** 07 May 2026 (attestation refresh)  
**Data Sources:** 5 internal SME interview / meeting note transcripts  
**Methodology:** Structured synthesis of internal expert perspectives (Teresa Torres-aligned opportunity framing; evidence-led coding from source text)  
**PM context (pipeline):** New market entry; **KYC / fraud**, **high volume**, **WhatsApp**, and **two-way email on profile** are explicit lenses for INDIA-E2E-006.

---

## Fresh pass attestation

- **Mission ID:** INDIA-E2E-006
- **Transcript files read (this run):** *None (Step 8 customer transcripts out of scope for this Step 7 artefact)*
- **SME files read (this run):**
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`
  - `research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`
  - `research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`
- **Completed (UTC):** 2026-05-07

---

## Internal SME participants

| SME ID | Name | Role | Organisation / context |
|--------|------|------|-------------------------|
| SME1 | Santosh Gulia | Sr. Functional Consultant, Global Services | India deployments; NA customers with India presence; high-volume recruiting patterns |
| SME2 | Fabiola Navarro | Sr. Product Advisor, Field Readiness | India-scoped implementations (e.g. Lowe's cited); offer / BGC process design |
| SME3 | David Lodola | Enterprise Architect, Workday Services (India) | Genpact implementation; talent supply chain, PSA bridge, scale hiring |
| SME4 | David Phillips | Director, Strategic Customer Engagement (Accenture), Workday | Accenture India recruiting scale and gap themes |
| SME5 | Bernie | VP of Talent Product Management | Product leadership view on India, KYC, fraud, FY27 focus |

---

## Key findings per SME

### SME1 – Santosh Gulia, Sr. Functional Consultant, Global Services

**Role context:** Hands-on deployment experience in India and with customers operating at high candidate volumes. Focus on how standard business processes meet (or fail) India-specific document and communication expectations.

**Key insights**

- **Background check and document capture:** India BGC is extensive and varies by customer; customers often want **documents at multiple stages** (not only formal BGC), including **pre-interview** ID and proof collection to confirm they are interviewing the right person. Standard BP steps (e.g. review document in offer) are awkward when the need is “candidate attaches” without recruiter sending a document first; **non-standard** items (education, certifications) add configuration load.
- **Workarounds:** Where Workday could not support in-flow attachment, clients used **email**; Santosh described firms wanting ID and multiple proofs **before interviews** to ensure the correct person attends.
- **Marketing comms and opt-in (volume impact):** GDPR-driven **marketing communication opt-in** creates friction in India: high volume means recruiters cannot phone every candidate to opt in; if the candidate **does nothing**, mail does not send. **Recommendation from practice:** **region-configurable opt-out** model (default send + unsubscribe link) for non-Europe; India candidates are not always prompt on email, so silent non-response loses reach and candidates.
- **WhatsApp:** **Ubiquitous** for back-and-forth and link sharing; preferred over “regular messaging”; roadmap awareness but timing dependency on channel engagement teams.
- **Identity / fraud:** Described **fake candidates** appearing for interview vs person who applied; legal issues in severe cases; desire for **interviewer prompts** tied to uploaded ID (“are you sure this is the person?”). Pre-interview document collection supports **Know Your Candidate** intent. BGC vendor integrations often **custom**; documents for recruiter-held record vs vendor portal split.
- **Chatbot / AI:** Candidate status questions and **scheduling via conversational flow**; tie to WhatsApp once messaging exists; reduces missed emails when recruiters juggle many reqs.

**Hypotheses**

- First-class **candidate-side attachment** patterns (including optional **candidate home** “box” / flexible attachments) and **stage-flexible** document collection reduce email leakage and support India BGC reality.
- **Configurable marketing comms consent** (opt-in vs opt-out by region/tenant) is a **high-leverage** change for India sourcing and campaigns.
- **Identity assurance** (document + interview-side confirmation) should be explicit in India PMF, not only “BGC integration depth.”

**Themes emphasised:** High volume; Know Your Candidate / impersonation; document timing; channel fit (WhatsApp); GDPR-global default vs India operational reality.

**Customer triangulation (Step 8):** Pending customer interview synthesis; expect overlap on volume, identity, and channels.

---

### SME2 – Fabiola Navarro, Sr. Product Advisor, Field Readiness

**Role context:** Field readiness and prior implementation experience with **India in scope**; deep examples from **Lowe’s** (named): extremely high volume, distinctive routing and automation posture.

**Key insights**

- **Offer / compensation disclosure (India):** When India is in scope, **offer compensation breakdown** is repeatedly heavy: tables, many **calculated fields**, sometimes **two documents** to the candidate (offer letter + detailed compensation annex). Believed **legally driven** level of detail; drives **change requests** and rework when formulas are wrong.
- **Start date and hire automation:** Tension between **auto-complete hire** / automation and need to **confirm or change start date** before hire completes; customer used **Workday Extend** to recreate start-date correction flows. Pattern: **keep pipeline moving** despite frequent start-date changes at scale.
- **India vs US BGC gating:** For India population, customer wanted **more flexibility** to **move to hire before** all BGC results returned (vs US side with stricter status checks). **India background check kick-off** timing could be **only after** certain steps (noted in notes). Aligns with “move forward, fix later” operating model under volume.
- **BGC “easy button”:** Push for **simple reinitiate** of BGC (and parallel drug screen in US contexts); **process and condition-rule complexity** (parallel stages, vendors per country, integrations moving candidates forward when ASR/trigger gaps exist) dominated over “integration missing.”
- **Document collection:** Multiple candidate documents (e.g. pay stubs, ID variants, **upload photo / passport photo**); tension with **what should live in Workday**; used **questionnaires with attachment questions**, **review document** steps, and creative BP design.

**Hypotheses**

- **Productised India offer templates / compensation presentation** (or guided configuration packs) could reduce services cost and errors.
- **Native support for flexible BGC gating by country** and **first-class reinitiate** reduces bespoke BP and integration gymnastics.
- **Attachment and questionnaire patterns** should be rationalised for **KYC-style** India packs without forcing non-compliant storage.

**Themes emphasised:** High volume (Lowe’s); India-specific offer and compensation; BGC timing vs hire; operational flexibility; document volume.

**Customer triangulation (Step 8):** Pending; Fabiola’s Lowe’s example should be cross-checked against anonymised customer quotes (no duplicate naming on customer slides unless customer-approved).

---

### SME3 – David Lodola, Enterprise Architect (India), Genpact implementation

**Role context:** Enterprise architecture for **Genpact**; **talent supply chain** linking recruiting to **PSA / projects**; post-recovery from prior partner engagement; Workday Extend as **bridge** for project-based demand.

**Key insights**

- **Scale:** Recruiting **en masse** (e.g. **100–200** openings at a time); large **same-day start** cohorts; **mass actions** needed for offers, agreements, approvals, sign-offs; **worksheets not used** for these processes (investigate why).
- **Know Your Candidate / fraud:** **Impersonation** – applicant ≠ person at interview; need for **identity verification** (e.g. **facial recognition** raised as example) to protect interview integrity.
- **BGC as contractual obligation:** BGC is **client contractual**, not only policy; native Workday BGC seen as **too basic**; **Tydy** (middleware, **Eightfold** context in notes) used; gap = **rich upfront data capture in Workday** so candidates do not **re-enter** the same data in another portal (**CX** and accuracy).
- **Career site auditability:** Candidates can change **name, address, phone** with **limited tracking**; **security / compliance risk** and enabler of **BGC bypass** and impersonation issues.
- **Post-offer no-show:** High **offer accept → no show on day one**; purchased **messaging** solutions for high-touch engagement between offer and start.
- **Magic wand:** Recruiters **proactive**, **mass** management, **full visibility** across **demand (PSA)** and **supply** (internal + external); **Resource Manager** as core persona; **HiredScore** / internal sourcing notes: need to surface **internal workers** nearing project end for rotation (notes mention limitations and desire for better single-screen supply/demand).

**Hypotheses**

- India PMF should treat **KYC, audit trail on candidate identity data, and BGC data capture** as one system story, not three disconnected gaps.
- **Bulk operations** and **project-aware recruiting** are differentiators for **India professional services** segment at **new market entry** scale.

**Themes emphasised:** Industrial-scale hiring; KYC / impersonation; BGC depth and duplicate data entry; data integrity on career site; engagement through volatile funnel.

**Customer triangulation (Step 8):** Strong preview of themes likely in services-heavy customers; validate privacy and AI Act framing when recommending biometric or facial recognition language for roadmap.

---

### SME4 – David Phillips, Director, Strategic Customer Engagement (Accenture), Workday

**Role context:** Strategic customer engagement with **Accenture** as primary lens for India market gaps.

**Key insights**

- **Volume:** ~**half** of India applications **not processed in Workday** (notes: **internal compliance** reasons; clarify policy vs regulatory drivers).
- **Do Not Hire / blacklist:** Need to **auto-disposition** against a **Do Not Hire** list (ex-employees and others); interest is **global** (Singapore government, US federal examples in notes).
- **Duplicates at scale:** **~200k** duplicate applications context; **auto-merge limited to two records**; need **merge >2** for operational reality.
- **Fraud / trickery at scale:** India market intensity drives **application fraud** and admin burden; **AI** raised to detect patterns and reduce manual work.
- **ID validation at interview:** Explicit need to validate **interviewee = candidate**.
- **Strategic concept:** “Workday professional network” with **validated credentials** and **HireScore**-style ranking (speculative / transformational; note monetisation ideas in source for awareness, not as committed product direction).

**Hypotheses**

- **UDMF / merge**, **DNH**, and **interview-stage identity checks** form a coherent **trust and scale** bundle for India enterprise accounts.
- Clarify **Workday vs non-Workday** processing story for India **compliance** to avoid understating adoption and PMF risk.

**Themes emphasised:** Extreme scale; fraud; identity; duplicate data; list-based eligibility; AI assist.

**Customer triangulation (Step 8):** Accenture appears in multiple SME sources; customer quotes in Step 8 must follow **P1–Pn anonymisation** rules even when Accenture is widely discussed internally.

---

### SME5 – Bernie, VP of Talent Product Management

**Role context:** Executive product framing for **India**, **fraud**, and **FY27** opportunity.

**Key insights**

- **Know Your Candidate (KYC):** Explicit analogy to **Know Your Customer** in banking; **large fraud** problem including **resume** and candidate data integrity; scale example **100,000 resumes / month**; **Accenture** again cited as severely affected.
- **Partners:** **BrightHire** mentioned as upcoming partner – interview recording / skills alignment as part of **validation** and consistency (per notes).
- **India focus:** **FY27 India** target opportunity called out (exact acronym “TO” unclear in notes); **India product gaps** explicitly acknowledged; **address localisations** for India mentioned as rollout area.
- **Regulations:** Linked in notes to KYC and fraud prevention in complex Indian market.
- **Follow-ups in notes:** Named contacts (Andre, Alexis, others) and **internal brainstorm** / **docs from Bernie** for deeper context (not reproduced here; treat as out-of-band inputs for PM).

**Hypotheses**

- Product leadership alignment: **KYC + high volume** are **strategic**, not niche services requests – supports PMF **new market entry** narrative.
- Partner ecosystem (e.g. interview intelligence) may complement **native** identity and fraud workflows.

**Themes emphasised:** KYC, resume fraud at scale, India FY27, localisation, regulations, partnerships.

**Customer triangulation (Step 8):** Executive themes should align with granular customer quotes; flag any tension between **biometric / facial recognition** language and compliance review (**060**) before deck finalisation.

---

## Synthesised themes across SMEs (India PMF)

| Theme | SME coverage | Implication for product / GTM |
|--------|----------------|--------------------------------|
| **Know Your Candidate / impersonation / interview identity** | SME1, SME3, SME4, SME5 (strongest) | Prioritise **interview-stage verification**, document capture, and **auditability** of identity-related changes; carefully scope any **biometric** claims with Legal. |
| **High volume and “industrial” operations** | SME1, SME2, SME3, SME4, SME5 | **Mass processing**, merge at scale, flexible BGC/hire ordering, and **channel reach** (email opt-in, WhatsApp) are one operational story. |
| **Document and BGC complexity** | SME1, SME2, SME3 | Multiple docs, non-standard types, vendor + in-tenant records; reduce **double entry** and email workarounds. |
| **Data quality: duplicates and blacklists** | SME4 (primary), SME3 (supply chain) | **UDMF / merge beyond pairs**, **DNH** automation tied to dispositioning. |
| **Candidate engagement and drop-off** | SME1, SME3 | WhatsApp + proactive messaging + conversational scheduling reduce **silence** and **no-show** between offer and start. |
| **India vs global defaults (privacy, BP)** | SME1 | **Region-configurable** comms consent models may be required so EU compliance does not **suppress** India reach. |
| **Offer / compensation localisation** | SME2 | India offer **disclosure density** is a repeatable implementation tax. |

---

## Recommendations for SME research slides

**For @pmf-analyst / 130 when building the PMF report and deck**

**SECTION 8a: Internal SME interviews**

**Slide 1 – Internal SME interviews – Workday experts**

- Title: **Internal SME interviews – Workday experts**
- Content bullets:
  - **5** Workday SMEs with **India recruiting** implementation, field, architecture, or strategic customer exposure (July 2025–Jan 2025 notes; VP notes Nov 2024).
  - Roles span **Global Services**, **Field Readiness**, **Enterprise Architecture (Genpact)**, **Strategic Customer Engagement (Accenture)**, **VP Talent Product Management**.
  - **Purpose:** Ground India **new market entry** PMF in **multi-customer** implementation reality before **customer interview** triangulation (Step 8).
  - **Limitation:** Internal views **supplement**; they are **not** substitutes for customer voices or Legal sign-off on compliance-heavy features.

**Slide 2 – SME participants**

- Title: **SME participants**
- Content: Table matching **Internal SME participants** (SME ID, Name, Role, Organisation/context) above.

**Slide 3 – SME1 – Santosh Gulia**

- Subheaders / themes: **High volume & comms**; **Documents & BGC stages**; **Channels & KYC**
- Bullets: Opt-in vs **opt-out** and India email behaviour; **multi-stage** India document asks; **WhatsApp** primacy; **impersonation** and pre-interview ID; chatbot for **status** and **scheduling**.

**Slide 4 – SME2 – Fabiola Navarro**

- Subheaders: **Offer & compensation (India)**; **Hire automation vs start date**; **BGC flexibility & documents**
- Bullets: **Lowe’s** high volume; compensation **tables / calcs / dual documents**; Extend for **start date**; India **hire before** full BGC vs US gating; **reinitiate BGC**; questionnaire / review doc for **many attachments**.

**Slide 5 – SME3 – David Lodola**

- Subheaders: **Talent supply chain**; **KYC & trust**; **BGC & career site**
- Bullets: **Mass actions**; **Genpact** scale; impersonation and **verification** (e.g. facial recognition in source); **Tydy** / rich BGC data; **career site change** audit gap; offer **no-show** engagement.

**Slide 6 – SME4 – David Phillips**

- Subheaders: **Scale & processing**; **Trust & fraud**; **Strategic concepts**
- Bullets: Partial **non-Workday** processing (compliance); **DNH**; **200k** duplicate context and **merge >2**; **fraud / trickery**; **AI** assist; **ID at interview**; optional one line on **validated credential network** as **vision** (clearly labelled exploratory).

**Slide 7 – SME5 – Bernie**

- Subheaders: **KYC at scale**; **India FY27**; **Ecosystem**
- Bullets: **KYC** and **resume fraud** (100k resumes / month example); **Accenture** severity; **BrightHire** partner note; **India gaps** and **address** localisation; regulations linkage.

**Slide 8 (optional) – SME synthesis – India recruiting PMF**

- Title: **SME synthesis – trust, volume, and local process reality**
- Content: **7–8 bullets** drawn from **Synthesised themes across SMEs** table; end with **Product implication** (yellow highlight in deck): *India new market entry requires native support for **high-volume trust** (identity, duplicates, lists, BGC timing) and **channel reach** (WhatsApp, comms consent), not only localisation.*

**Speaker notes (130):** Remind presenters that SME names are **attributable**; customer slides remain **P1–Pn**. Cite this file path: `research/India/105-sme-research-findings.md`.

---

## Related artefacts

- **Next pipeline step:** `research/India/105-user-research-findings.md` (Step 8, customer-only) for triangulation with this document.
- **Mission:** INDIA-E2E-005
