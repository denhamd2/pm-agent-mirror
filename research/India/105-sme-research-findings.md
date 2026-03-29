# India PMF Research – Internal SME Findings (Step 7)

**Analysis type:** Internal SME interviews only (Regional E2E Step 7)  
**Region:** India  
**Output path:** `research/India/105-sme-research-findings.md`  
**Analysis date:** 28 March 2026  

---

## Fresh pass attestation

- **Mission ID:** IN-E2E-003  
- **Transcript files read (this run):** *None (customer transcripts are Step 8 only; not in scope for this file)*  
- **SME files read (this run):**
  - `research/India/internal-sme-transcripts/Meeting Notes for India Research with Bernie (VP of Talent Product Management) - 25th Nov.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Fabiola Navarro, Sr. Product Advisor, Field Readiness - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with Santosh Gulia, Sr. Functional Consultant, Global Services - India Research - 9th July 2025.txt`
  - `research/India/internal-sme-transcripts/s- Meeting Notes with David Lodola, Workday Services Enterprise Architect in India - India Research - 13th June 2025.txt`
  - `research/India/internal-sme-transcripts/Meeting Notes with David Phillips_ Director for Strategic Customer Engagement (Accenture), Workday - India PMF research (9 Jan 2025).txt`
- **Completed (UTC):** 2026-03-28T12:00:00Z  

---

## SME participant list

| SME ID | Name | Role | Organisation / context |
|--------|------|------|-------------------------|
| SME1 | Bernie | VP, Talent Product Management | Workday product strategy; India FY27 focus, fraud/KYC, partnerships |
| SME2 | Fabiola Navarro | Sr. Product Advisor, Field Readiness | Implementation patterns (e.g. Lowe’s India scope); offer and BP complexity |
| SME3 | Santosh Gulia | Sr. Functional Consultant, Global Services | Multi-customer India deployments; candidate documents, marketing comms, WhatsApp |
| SME4 | David Lodola | Enterprise Architect (Services, India) | Genpact implementation; talent supply chain, mass ops, BGC, career site audit |
| SME5 | David Phillips | Director, Strategic Customer Engagement (Accenture), Workday | Accenture India scale, blacklisting, fraud, auto-merge, ID validation |

*Note: SME names are retained per Step 7 instructions. Customer names cited by SMEs as implementation examples (e.g. Lowe’s, Genpact, Accenture) are organisational context from field interviews.*

---

## Key findings per SME

### SME1 – Bernie, VP, Talent Product Management

**Role context:** Executive product ownership for Talent; cross-customer view of India priorities and roadmap alignment.

**Key insights**

- **High volume and fraud:** India recruiting stress includes resume and candidate-information fraud at very large scale (notes reference ~100,000 resumes per month; Accenture called out as heavily affected). Framing aligns with a **Know Your Candidate (KYC)** style problem, analogous to KYC in banking.  
- **Partnerships:** BrightHire mentioned as an upcoming partner; value proposition includes interview recording and skills matching to support validation and consistency.  
- **India market focus:** Strategic emphasis on India around **FY27**; **address localisation** for India called out as a concrete product direction. **India product gaps** explicitly acknowledged at leadership level.  
- **Regulations:** Regulations discussed in connection with KYC/fraud and Indian market complexity (detail in source is high level).  
- **Follow-ups:** Notes reference consulting Andre, Alexis (Solution Enablement), Conall Markey, Daian Rasmussen; reviewing internal brainstorms and documents Bernie shared.

**Hypotheses (from SME narrative)**

- India PMF work should treat **trust, identity, and document integrity** as first-class roadmap themes, not edge cases.  
- **Partner ecosystem** (interview intelligence, verification) may be required alongside native product moves for FY27 India outcomes.

**Customer triangulation (Step 8 preview):** *Do not use this section as customer evidence;* use to frame questions for customer transcripts – e.g. do recruiters confirm KYC pain, offer letter complexity, and post-hire document churn at scale?

---

### SME2 – Fabiola Navarro, Sr. Product Advisor, Field Readiness

**Role context:** Deep implementation and BP design for enterprise Recruiting; recent India-scoped project experience.

**Key insights**

- **Offer and compensation complexity (India):** On projects where India is in scope, **offer compensation** is repeatedly the hardest area – detailed tables in offer letters (grades, fixed/variable pay, formulas), heavy use of **calculated fields**, iterative **change requests** when formulas were wrong. Often **two documents** go to the candidate (offer letter plus separate detailed compensation artefact). SME believes much of this is **legally required** disclosure granularity for India.  
- **Customer example – Lowe’s, high volume:** Extremely high volume; **custom routing** for candidates. **India vs US background check gating:** For India, candidates could **move to hire before** all background check results returned; US used stricter status checks – India needed more flexibility.  
- **Start date changes vs automation:** Customer used **auto-complete hire** and automation heavily; that removed a natural checkpoint to **confirm start date** before hire completed. Customer planned **Workday Extend** / app workflow for **start date changes** tied to rescind/revise offer and regenerate offer letters – more detailed than a simple date change.  
- **Pattern – keep pipeline moving:** Philosophy described as get people in seats, handle exceptions (start date, BGC) afterward – high-volume operational mindset.  
- **Background checks – process not integration:** Pushback was less on vendor integration quality than on **reinitiating** BGC, **parallel** drug screen + BGC, **condition rules** and **ready for hire** paths, and **integrations moving candidates forward** when ASR could not trigger on async BGC completion.  
- **Document collection:** Multiple candidate documents (pay stubs, ID variants, etc.); tension with **what should not be stored in Workday** – customer insisted; solutions included **questionnaires with attachment questions**, **review document** steps, **upload photo** / passport-style requirements on application.

**Hypotheses**

- **First-class India offer templates and calculation patterns** (or guided configuration) could reduce services cost and change-request churn.  
- **Configurable guardrails** for “hire before BGC complete” vs hard stops – productised per country/policy – would reduce Extend workarounds.  
- **Candidate document model:** Need clearer pattern for **ad hoc multi-document capture** at multiple stages without only “review document” loops.

**Customer triangulation (Step 8 preview):** Compare customer stories on offer letters, post-hire offer updates, and BGC timing with Fabiola’s Lowe’s pattern.

---

### SME3 – Santosh Gulia, Sr. Functional Consultant, Global Services

**Role context:** Hands-on Recruiting deployment for North American customers with India presence and India-heavy volumes.

**Key insights**

- **Background check and documents:** India BGC is **extensive and varies by customer**; documents requested at **different stages** (sometimes **before interview** for ID verification, not only at BGC). **Review document** steps in offer BP are a poor fit when the need is “candidate attach only” without recruiter sending a document first. **Add document** in offer is recruiter-centric (recruiter attaches to send to candidate), not “candidate drop zone.” Unsolved cases often fall back to **email** outside Workday.  
- **Proposed direction:** **Attachment “box” on candidate home** (or equivalent) for recruiter-requested uploads tied to **candidate profile**, optionally job-application scoped, with reuse when candidate moves across reqs – reduces duplicate uploads.  
- **Marketing communication opt-in:** Major pain for India clients: **marketing emails** require **opt-in** first (GDPR-driven product behaviour). High-volume recruiters cannot chase thousands for opt-in; **inaction = no send**. Recommendation: **region-configurable opt-out model** with **unsubscribe** on each email; clients ask why this cannot be **optional by region** (Europe strict, other regions flexible). Santosh’s **magic wand** #1: fix opt-in / reach.  
- **WhatsApp:** **Ubiquitous** in India (~90% of mobile internet users); preferred over SMS; used to share **links** and back-and-forth with recruiters; **apply via WhatsApp** less common than messaging and links. Customer awareness of roadmap timing vs pushback noted in conversation.  
- **Identity fraud at scale:** Partner context with **very high India headcount**; fake candidates in interview; legal issues; drives **pre-interview ID proof** and **interviewer prompts** (“are you sure this is the person?”).  
- **BGC vendors:** Custom integrations often used; major vendor names generally workable; **recruiter-held documents in Workday** vs **vendor portal** – SME positions ad hoc uploads as **for recruiter verification**, vendor flow separate when integration triggers vendor portal.  
- **Chatbot / AI:** Candidate status questions (“where is my application?”) when recruiters miss emails; **scheduling** via conversational flow; tie to **WhatsApp** when messaging available; prior experience with **Yellow.ai**-style bot for a client.

**Hypotheses**

- **Regional consent model** for marketing comms is a **direct India GTM and volume enabler** (coordinate with Legal / DPDP – not assumed equivalent to GDPR).  
- **Flexible candidate attachment surface** is a horizontal India enabler across BGC, fraud prevention, and interview scheduling.  
- **WhatsApp + agent** positioning matches channel reality; native/integrated path remains critical for enterprise policy.

**Customer triangulation (Step 8 preview):** Validate opt-in friction, email vs WhatsApp, and document upload workarounds with customer recruiters.

---

### SME4 – David Lodola, Enterprise Architect (India), Genpact implementation

**Role context:** Rescue / enterprise architecture for large India-centric professional services model; “talent supply chain” spanning Recruiting, PSA, and extensions.

**Key insights**

- **Business model:** ~140k employees; **~60% internal fills**; resource managers as internal recruiters; **project-based demand** must connect Recruiting to **PSA / projects** – Workday initially too **siloed**; **Workday Extend** bridge app for project-specific demand fields feeding recruiting.  
- **Mass actions:** Recruiting **100–200 roles** at a time; need **mass processing** for offers, employment agreements, approvals, sign-offs, same-day starts; **worksheets not used** for these processes (investigate why).  
- **KYC / impersonation:** India **candidate impersonation** (applicant ≠ interview attendee); need **identity verification** (facial recognition raised as example).  
- **BGC:** Client-contractual, not only policy; native BGC seen as **too basic**; **Tydy** (middleware, Eightfold) for comprehensive dataset; want **all BGC data captured in Workday upfront** to avoid double entry.  
- **Career site auditability:** Candidates can change **name, address, phone** with **weak audit trail** – security/fraud risk and BGC bypass concern.  
- **Post-offer ghosting:** High **no-show on day one** despite accepted offers; mitigated with **high-touch messaging** (third-party / purchased solutions).  
- **Magic wand:** Recruiters **proactive**, **mass** candidate management, **full visibility** across demand (PSA) and supply (internal + external); unify view for resource managers and recruiters.  
- **HiredScore:** Should better support **sourcing internal workers** nearing **project end** for rotation model (notes also mention limitations / reduced use for internal in some cases).

**Hypotheses**

- **Professional services / GCC-style India scale** segments need **bulk offer/approval** and **supply–demand visibility** as PMF pillars.  
- **Career site change auditing** and **KYC** are linked fraud controls for India BPO / outsourcing scale.

**Customer triangulation (Step 8 preview):** Test mass hire, internal mobility, and no-show patterns with India enterprise customers.

---

### SME5 – David Phillips, Director, Strategic Customer Engagement (Accenture), Workday

**Role context:** Strategic account lens on Accenture India Recruiting operations and Workday gaps.

**Key insights**

- **Gaps called out:** (1) **Blacklisting / do not hire** – auto-disposition against DNH lists at volume; (2) **Mass operations** for **job application purge**; (3) **Auto-merge >2 duplicates** – Accenture-scale **~200k** duplicate applications, merge **only two at a time** insufficient; (4) **Fraud / trickery at scale**; (5) **ID validation in interview process**.  
- **Volume:** ~**half** of India applications **not processed in Workday** due to **internal compliance** (clarify policy vs regulatory – action item in notes).  
- **Market narrative:** India risk of being an **afterthought** in product development; **competition for jobs** drives applicant **trickery** and admin burden – **AI** suggested to detect patterns.  
- **Aspirational:** “Workday professional network” with **validated credentials** and **HireScore**-style ranking (ideation, not current commitment).  
- **Broader reuse:** DNH / blacklist interest from **Singapore government**, **US federal** contexts.

**Hypotheses**

- **DNH automation** and **multi-way merge** are **scale table stakes** for India mega-deployments alongside fraud detection.  
- **Interview-stage ID validation** is a repeated cross-SME refrain (Phillips, Lodola, Santosh, Fabiola’s document patterns).

**Customer triangulation (Step 8 preview):** Accenture-specific claims should be validated with **customer** interviews and **101** competitive scan – SME here is Workday-facing, not anonymous P1.

---

## Themes emphasised (cross-SME synthesis)

1. **Trust, identity, and fraud (KYC)** – Resume/application fraud, impersonation, interview ID proof, career site data changes, AI-assisted detection – **Bernie, Fabiola, Santosh, Lodola, Phillips**.  
2. **India offer and compensation rigour** – Tables, formulas, dual documents, legal granularity, change requests – **Fabiola** (strongest); touches **start date / post-hire offer revision** complexity.  
3. **Background checks: timing, flexibility, reinitiation** – Hire before complete results (India vs US), parallel stages, easy re-run, process/BP complexity vs vendor gaps – **Fabiola, Santosh, Lodola**.  
4. **Candidate documents and attachment UX** – Multi-document, multi-stage, pre-interview ID, recruiter vs vendor responsibilities, email workarounds – **Fabiola, Santosh, Lodola**.  
5. **Mass scale and bulk operations** – Mass offers/approvals, purge, duplicate merge limits, blacklisting – **Lodola, Phillips**; **Bernie** scale framing.  
6. **Marketing comms and channel reality** – GDPR-style **opt-in** killing reach; ask for **regional opt-out** + unsubscribe; **WhatsApp** ubiquity – **Santosh** (primary).  
7. **Talent supply chain / internal mobility** – PSA + Recruiting, resource manager persona, HiredScore internal sourcing – **Lodola**.  
8. **Ecosystem and partnerships** – BrightHire, Tydy, Paradox/Yellow.ai mentioned; Extend used heavily – **Bernie, Fabiola, Lodola, Santosh**.

---

## Recommendations for SME Research Slides (130 deck consumption)

Use **Section 8a** pattern: section divider + intro + participants table (this file’s table) + **one slide per SME** (7–8 lines each). Suggested slide titles and content focus:

| Slide | Title (≤45 chars where possible) | Focus (7–8 bullets total per slide) |
|-------|-----------------------------------|--------------------------------------|
| 8a-intro | Internal SME Perspectives – India | 2 bullets: why SMEs matter; triangulation with customer evidence in Section 9 |
| SME1 | Bernie – Strategy, FY27 India, KYC | Fraud/KYC at scale; FY27 India; address localisation; BrightHire; regulatory thread; consult network named in notes |
| SME2 | Fabiola Navarro – Offers & BP depth | India offer compensation complexity; Lowe’s volume; India BGC flexibility vs US; start date Extend; documents + review steps |
| SME3 | Santosh Gulia – Volume & channels | Candidate attachment “box”; opt-in reach problem → regional opt-out; WhatsApp ubiquity; fraud at scale; chatbot use cases |
| SME4 | David Lodola – Genpact supply chain | 60% internal; mass hire; KYC/impersonation; Tydy/BGC; career site audit; no-shows; PSA + Recruiting |
| SME5 | David Phillips – Accenture scale | DNH; mass purge; merge >2; fraud/trickery; ID validation; partial Workday processing; AI idea |

**Speaker notes guidance for 130**

- Cite **mission IN-E2E-003** and this file path for audit trail.  
- Clarify SME slides are **internal field perspective**; legal claims (e.g. “legally required” offer content) remain **hypotheses** until Legal/compliance review.  
- **Do not anonymise** SME names on SME slides; **customer** slides elsewhere remain **P1, P2…** per 010-style-guide.

---

## Method note

Synthesis is from **internal SME .txt sources only**. **Customer transcripts** in `research/India/customer-transcripts/` were **not** read for this Step 7 deliverable. Step 8 will produce `research/India/105-user-research-findings.md` for customer-only analysis.

---

## Handoff to Step 9 (120)

- **120** should read this file’s attestation and **re-read** underlying SME `.txt` files in Phase 1; do not substitute this summary alone for transcript ingestion.  
- Triangulate themes above with **105 Customer** output and **099** / **101** artefacts per orchestrator.
