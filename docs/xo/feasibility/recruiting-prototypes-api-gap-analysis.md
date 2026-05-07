# Recruiting SSA prototypes — consolidated API feasibility

**Audience:** PM + engineering  
**Scope:** Three Canvas Kit prototypes in `design/` assessed against Workday REST / XO REST patterns documented in this repo.  
**Confidence:** Where endpoint names are uncertain, they are labeled **(placeholder)**.

## Evidence used (repo)

| Source | What it supports |
|--------|------------------|
| [`docs/recruiting-convenience-rest-candidates.md`](../recruiting-convenience-rest-candidates.md) | Eligible convenience-task → REST candidates: **Offer Details Composite View**, **Offer**, **Review Offer**, **View Offer Status**, **Interview**, **Job Application**-family tasks, **Candidate Communication**, **Evergreen Requisition** details, etc. |
| [`docs/xo/rest-apis/offer-events/README.md`](../rest-apis/offer-events/README.md) | **XOAgents/labs/offer-events** exists (maps to **Offer Event** class) with GET/POST/PATCH/DELETE registered; **runtime drift** on GET body fields and empty POST/PATCH response bodies until UI “Edit” task remediation. Not a full “SSA offer worksheet + BP submit” composite. |
| [`docs/xo/rest-apis/candidate-communication/artifacts/schema-design-wip.md`](../rest-apis/candidate-communication/artifacts/schema-design-wip.md) | Proposed **`hrRecruitingCandidateCommunication`** service for per-candidate **communication timeline** (notification events + conversation messages). **recruiting v4** pinned OAS has **`jobPostings`**, **`interviews`**, **`prospects`** but **not** this timeline. |
| [`docs/xo/rest-apis/candidate-tags/README.md`](../rest-apis/candidate-tags/README.md) | Example of completed internal REST shape under **XOAgents** (pattern reference; not required by these prototypes). |
| [`docs/offer-flow-ai-customer-ideas.md`](../offer-flow-ai-customer-ideas.md) | Product context: comp visibility / trust in offer; AI bets in offer are product-led; JR AI has stronger customer signal (aligns with CJR prototype). |

---

## 1. Prototype: `design/create-offer-ssa-v01.tsx`

**Intent:** Self-Service Agent + 5-step offer wizard (candidate & requisition → compensation → country & approvers → offer document → review & send), chat mutations, overlap/position-control hints, document QA deck, approver packet preview, optional **Microsoft Teams** approval card after send.

### Capability table

| Capability in prototype | Likely available API(s) | Gap / missing API | Priority | Notes |
|-------------------------|-------------------------|-------------------|----------|-------|
| Load candidate + requisition context | **recruiting v4**-style resources for job postings / applications **(confidence: medium—tenant + OAS version)**; internal GET on **Job Application** / composite convenience tasks per convenience catalog | Single **agent-optimized aggregate** (candidate + req + scorecard slice + HM) | **P1** | Prototype uses mocked **JR-12345** + Sarah Chen; real agent needs one stable read surface or orchestrated multi-GET. |
| Structured compensation edits (base, bonus, equity, sign-on) | **Offer Details Composite** / **Offer** convenience tasks mapped to REST per `recruiting-convenience-rest-candidates.md` **(if built)**; not proven from-scratch in this doc | **PATCH** affordances on worksheet lines with validation + band rules surfaced in API errors | **P0** | Catalog flags “high-value … requires careful `mapsToClass` + processing”. |
| Pay-band check / “out of band → comp partner” | Likely **business logic in offer BP / validations**, not a single public “band check” endpoint | **`GET .../payBandEvaluation`** or include `bandCompliance` block on offer worksheet resource **(placeholder)** | **P1** | Prototype encodes rules in UI; API should return machine-readable pass/fail + approver hints. |
| Payroll-safe start date | Payroll calendar exists in product; **REST surface for recruiter-facing “next safe date”** unclear | **`GET .../payrollSafeDates`** scoped by location/pay group **(placeholder)** | **P2** | Prototype uses weekend-bump demo only. |
| Country switch (IE/JP/DE/IN/US/GB) + JP two-step / DE works council / IN Aadhaar flags | Offer BP configuration + country overlays in task model | **Expose country overlay + required approver templates** on a read API; **PATCH** to switch legal entity / template set **(placeholder)** | **P1** | Mirrors step 3 complexity; needs parity with convenience task fields. |
| Overlap toggle + position control (headcount cap) | Possibly **position management** / requisition overlap fields in core **(product-dependent)** | **Explicit overlap + budget-cap API** aligned to Create Job Req / Offer overlap semantics **(placeholder)** | **P0** | Shared with CJR prototype; see §3. |
| Draft / regenerate offer letter | Document generation often **BP / document service**-driven | **POST .../offerDocuments:generate** or async job + **GET** result **(placeholder)**; AI disclosure strings need **060** path | **P0** | Prototype uses local string template (`SAMPLE_LETTER_BODY`). |
| Document QA deck (band, currency, payroll holiday, template, classification, prose match) | Partially encodable as **validations** on offer task | **`GET .../offerDocumentQa`** aggregated check runner **(placeholder)** or expand PATCH response with `qa[]` | **P1** | Distinct from generic field validation—agent needs bullet list of pass/warn/fail. |
| Live approval map (status, OOO, delegate, ping) | **Business process** inbox / step APIs **(tenant-specific)**; comment in code references BP introspection (`remainingSteps`, etc.—mocked) | **Stable REST for “offer approval chain snapshot”** + actions (delegate, remind) **(placeholder)** | **P0** | Teams card + chat “who’s blocking” require durable server state. |
| Review & send → trigger approval / **Teams** card | Approvals are **BP actions**; Teams is **Microsoft** integration | **Workday → Teams approval handoff** (Adaptive Card / Graph) **(placeholder)**; may be product connector, not XO REST | **P1** | Prototype simulates `TeamsApprovalCard` + `approveInTeams`. |

---

## 2. Prototype: `design/create-jr-ssa-v01.tsx`

**Intent:** SSA cold start → **backfill with overlap** or **transfer / location move**; steps: position confirmation → details (JD, dates, skills) → approve & open → opened; chat-driven tweaks (overlap, payroll-safe narrative, JD tone).

### Capability table

| Capability in prototype | Likely available API(s) | Gap / missing API | Priority | Notes |
|-------------------------|-------------------------|-------------------|----------|-------|
| Cold-start intent → open task canvas | N/A (client routing) | **Agent session + task binding** if SSA is server-driven **(placeholder)** | **P2** | Pure UX unless product mandates server-side agent. |
| Resolve position / org / incumbent / worker disambiguation | **Position**, **Supervisory Org**, **Worker** REST or internal services **(partial—confidence: medium)** | **Single “position confirmation” aggregate** for backfill context (incumbent + overlap recommendation text) | **P1** | Prototype seeds **ID-9921** / Alex Chen; real flow needs search + pick. |
| Overlap on/off for backfill | Likely fields on **job requisition** / recruiting BP **(product-specific)** | Same **overlap/budget** API as offer prototype **(placeholder)** | **P0** | Explicit toggle is a shared gap across JR + Offer SSA demos. |
| JD summary + skills from job profile | **Job profile** / requisition text fields via existing recruiting or HCM reads **(confidence: medium)** | **PATCH** JD summary with **agent write-through** + audit | **P1** | |
| Target hire / recruiting dates + **payroll-safe** messaging | **Date fields** on requisition create **(likely)** | **Payroll-safe recommendation** API (same as offer table) | **P2** | Chat updates dates via keywords (`june 16`)—real agent needs authoritative dates from server. |
| “Top performer indicators” / checkbox skills | Possibly **skills** on requisition or **Job Application**-adjacent—unclear | Confirm mapping to **skill snapshot** on requisition **(placeholder)** | **P2** | Checkbox group is static in prototype (`onChange` no-op). |
| **Approve & open req** → transaction ID | **Create/open job requisition** is typically **BP / task submit**, not one naked POST | **`POST .../jobRequisitions`** + **`.../actions/open`** or **BP action** resource **(placeholder)** returning `transactionId` / req WID | **P0** | Core outcome of the prototype. |
| Transfer-position / location-move flow | **Transfer** business processes in Core/HR; may not match “recruiting REST” | **Orchestrated REST** from “transfer position” convenience task **(placeholder)** with payroll-safe effective date | **P0** | Second scenario path; may be separate BP from recruiting JR open. |

---

## 3. Prototype: `design/e2e-recruiting-talent-acq-v01.tsx`

**Intent:** End-to-end beats—recruiter **home** metrics → **req + agent context** → **candidate shortlist** (filters, fit score) → **profile + fit-gap evidence** → **Teams scheduling** → **candidate mobile** confirmation thread.

### Capability table

| Capability in prototype | Likely available API(s) | Gap / missing API | Priority | Notes |
|-------------------------|-------------------------|-------------------|----------|-------|
| Recruiter home rollups (urgent reqs, interviews at risk, review queue counts) | **Dashboard / Prism / home data sources**—often **not** one recruiting REST collection | **`GET .../recruiterHomeSummary`** or reporting API **(placeholder)** | **P1** | Prototype uses static integers. |
| Requisition context + hiring manager + panel | **jobPostings** / related **recruiting v4** reads **(per candidate-comm gap matrix)** | Normalized **“req context for agent”** payload (panel roster, SLA) | **P2** | |
| Shortlist table (source, experience, fit score, status) | **Prospects** / **job applications** endpoints **(recruiting v4—confidence: medium)** | **Ranking + fit score** with explainability payload (what HR calls “Hired Score” or internal score) | **P0** | Prototype shows numeric **94/90/87** without backend contract. |
| Fit & gap evidence (checklist + gaps) | Partially **interview scorecards** / assessments | **`GET .../candidateFitEvidence?jobApplication=`** structured strengths/gaps **(placeholder)**—likely **AI service** | **P0** | Agent narrative depends on this; not in pinned recruiting v4 summary in repo. |
| Filter refinement via chat (“leadership filter”) | Client-side filter in prototype | **Server-side re-rank** or **search query DSL** on applications | **P1** | |
| Teams scheduling proposal + panel confirm | **Outlook/Teams** external; Interview event may exist in Workday | **`POST .../interviewEvents`** **(recruiting v4 interviews)** + **Teams bridge** for free/busy **(placeholder)** | **P0** | Prototype uses `TeamsChatCard` mock. |
| Candidate SMS / mobile thread + reply YES → update interview | **communications v1** consent per candidate-comm design; proposed **candidate communication timeline** GET | **Inbound SMS webhook** + **POST** status on recruiting event; timeline **GET** from `hrRecruitingCandidateCommunication` | **P0** | Design doc: POST/PATCH on conversation rows **blocked pending PM/legal**. |

---

## 4. Cross-prototype: shared gaps

| Gap theme | Touches | Notes |
|-----------|---------|-------|
| **Overlap + position / headcount control** | Create JR SSA, Create Offer SSA | Needs consistent domain model across **requisition** and **offer** (same audit story as Innovation Summit overlap demos). |
| **Payroll-safe dates** | Create JR SSA, Create Offer SSA | Recruiters expect authoritative guidance, not client-side rules. |
| **Offer worksheet + BP submit + approval visibility** | Create Offer SSA | Convenience-task path exists on paper; **offer-events** REST is a narrow **Offer Event** slice with known runtime drift—**not** sufficient for full wizard parity. |
| **Create / open job requisition (backfill + transfer)** | Create JR SSA | Likely **BP-centric**; agent needs idempotent, trackable **actions** with transaction IDs. |
| **Ranked shortlist + explainable fit** | E2E TA | Likely multi-vendor (Hired Score, internal ML); needs a **single agent contract** even if backend aggregates. |
| **Interview scheduling + Teams + candidate SMS** | E2E TA | Spans **recruiting v4 `interviews`**, **Microsoft** graph/cards, and **Communications**—repo points to **timeline** gap for message history. |

---

## 5. Recommended build sequence (practical)

1. **P0 reads for agent shells:** Requisition + job application list/detail using existing **recruiting v4** surfaces (where tenant licenses allow); stop where fields are missing—document deltas.
2. **P0 JR submit path:** Map **Create Job Req** / **Open requisition** to explicit REST or documented **BP action** sequence; add **overlap** + **opened req ID** in the same response contract as the CJR prototype.
3. **P0 Offer path:** Prioritize **Offer Details Composite View** (or successor) REST over expanding **offer-events** alone, unless product standardizes on **Offer Event** instances for all SSA steps; fix **offer-events** drift if that remains the narrow slice for events-only integrations [`docs/xo/rest-apis/offer-events/README.md`](../rest-apis/offer-events/README.md).
4. **P0 E2E scheduling + messaging:** **Interview** create/update + **candidate communication timeline GET** (per `schema-design-wip.md`); outbound SMS and inbound confirmation as a **second phase** with legal/comms review.
5. **P1 enhancements:** Approver chain snapshot API, document QA aggregation, recruiter home summary, Teams handoff as connector work.
6. **P2 polish:** Agent session binding, top-performer skill snapshots, advanced payroll calendars.

---

## 6. Minimal API contract list (missing / to-be-aligned)

Use as a backlog checklist; names are **placeholders** until service ownership and OAS are fixed.

- **`GET /{recruitingAgent}/v1/jobRequisitions/{wid}/context`** — HM, panel, key dates, overlap eligibility hints **(placeholder)**  
- **`POST /{recruitingAgent}/v1/jobRequisitions`** + **`POST .../{wid}/actions/open`** — backfill/open with `overlapEnabled`, `targetHireDate`, `targetRecruitingDate` **(placeholder)**  
- **`POST /{hrCoreOrRecruiting}/v1/transferPositions/actions/start`** — location move with payroll-safe effective date **(placeholder)**  
- **`GET|PATCH /{recruitingAgent}/v1/jobApplications/{wid}/offerWorksheet`** — structured comp + country + template pointers **(placeholder)**  
- **`POST .../offerWorksheet/actions/submitForApproval`** — kicks BP; returns `processId` / `transactionId` **(placeholder)**  
- **`GET .../offerApprovals/{offerOrProcessWid}/chain`** — approver rows, OOO, delegate **(placeholder)**  
- **`POST .../offerDocuments/actions/generate`** — letter draft; optional `aiAssisted: true` **(placeholder)**  
- **`GET .../offerDocuments/{draftWid}/qaChecks`** — pass/warn/fail list **(placeholder)**  
- **`GET /{recruitingAgent}/v1/jobRequisitions/{wid}/applications`** — shortlist projection with `fitScore`, `fitScoreExplanation[]` **(placeholder)**  
- **`GET /{recruitingAgent}/v1/jobApplications/{wid}/fitEvidence`** — strengths/gaps evidence bundle **(placeholder)**  
- **`POST /recruiting/v4/{tenant}/interviews`** (or equivalent) — create/confirm interview event; align with existing OAS **(confidence: medium)**  
- **`GET /hrRecruitingCandidateCommunication/v1/candidates/{candidateWid}/candidateCommunicationItems`** — timeline read per [`schema-design-wip.md`](../rest-apis/candidate-communication/artifacts/schema-design-wip.md)  
- **`POST /integrations/microsoftTeams/v1/approvalRequests`** — deep link / Adaptive Card for offer approval **(placeholder, may be non–XO-owned)**  
- **`GET /{recruitingAgent}/v1/recruiters/{workerWid}/homeSummary`** — urgency counts **(placeholder)**  
- **`GET /{payroll}/v1/safeDates`** — query: location, pay group, candidate type **(placeholder)**

---

## 7. Summary verdict

| Prototype | Feasibility today | Main unlock |
|-----------|-------------------|-------------|
| **create-offer-ssa-v01** | **Partial** — reads + narrow offer-event CRUD possible; **full** SSA parity needs composite offer + BP + approvals + document gen | Offer composite REST + approval chain; Teams is integration-owned |
| **create-jr-ssa-v01** | **Partial** — org/position/candidate reads may compose; **open req** + **transfer** are BP-heavy | Explicit **open requisition** action + overlap semantics |
| **e2e-recruiting-talent-acq-v01** | **Low–partial** — v4 lists help; **fit scores**, **Teams**, **SMS loop** lack a single documented contract | Fit evidence API + interview + comms timeline + external schedulers |

---

*Document generated for consolidated planning; update as `docs/xo/rest-apis/**` artefacts move from WIP to shipped.*
