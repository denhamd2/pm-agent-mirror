# Red Team PRD Review: Candidate Grid Redesign (v46)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v46-prd.md`  
**Mode:** 080 Mode 1 (PRD risk analysis)  
**Review date:** 21 March 2026  
**Inputs:** PRD v46; `MISSION_LOG.md` (GCC-E2E-007, GCC-E2E-002/003, GCC-CANDIDATE-GRID-001, MISSION-017); `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v46.md`; Workday Deployment Agent (`ask_deployment_agent`, thread `0365cbec-8be9-42b3-83e3-3f4ef2c28d80`); design briefs referencing prior grid work (`design/gcc-candidate-grid-v44-discovery-brief.md`, `docs/prds/gcc-candidate-grid-redesign-v42-prd.md`).  
**Functional knowledge note:** The repo folder `functional-knowledge/` currently contains only `INITIALIZATION.md` and `VERIFICATION_REPORT.md` (no PDFs on disk). Where purge/retention constraints apply, this review cites the **indexed** corpus described in `MISSION_LOG.md` (**Recruiting Data Purge - Functional Overview**, ~19MB) as the intended authority; **page-level citations are not available** from this workspace copy.

---

### 🔴 Critical Risks (Blockers if not addressed)

1. **`PDF Rendering Service` may not exist as specified**  
   The PRD depends on a **Platform team** “PDF Rendering Service” and **server-side PDF-to-text** for inline CV display. The Deployment Agent describes **today’s** pattern as opening attachments in a **new browser tab or dedicated document viewer** to isolate heavy rendering from the core UI—not an inline text pipeline.  
   - **Evidence:** Deployment Agent (Mar 2026): *“Workday typically handles this by opening the attachment in a new browser tab or a dedicated document viewer, which isolates the rendering process from the main application page.”*  
   - **Impact:** Engineering discovers mid-flight that inline CV requires **new** document processing, caching, security review, and tenant controls; **2026R2 GA** slips or scope collapses to “open in viewer” (no product differentiation).  
   - **Recommended fix:** **Dependencies & Risks** — Replace aspirational service name with a **spike outcome**: confirm existing document platform capabilities, owner team, and GA boundary; define **MVP fallback** (viewer pop-out + summary fields) matched to DA-grounded behaviour.

2. **Adoption target (60%) conflicts with usage volume maths**  
   Success metrics call for **60%** of active recruiters within 6 months of GA, while Year 1 volume uses **÷2 phased rollout** and **40% initial uptake** to land on **15M** reviews. At **30k adopters × 10/day × 250 days** the steady-state annual load is **75M** modal sessions, not 15M; the PRD mixes **60%**, **40%**, and **half-year phasing** without a single explicit curve.  
   - **Evidence:** PRD `docs/prds/gcc-candidate-grid-redesign-v46-prd.md` (Overview table, Success Metrics); arithmetic above.  
   - **Impact:** Executives align on **60%** adoption while finance/infra plan for **15M** events; capacity, CDN, and document processing are **under-provisioned** or success is declared **false negative/positive**.  
   - **Recommended fix:** **Success Metrics + Overview** — One table: definition of “active recruiter”, **ramp model** (month-by-month), upper-bound event rate, and which number is **planning ceiling** vs **Year 1 expected**.

3. **GCC and Arabic document reality (Theme 6) vs inline CV promise**  
   v46 research codes **ARABIC-RTL-DOCS** (P3: Arabic rendering issues in Docs). A unified modal emphasising **inline CV** risks shipping **unreadable** or **layout-broken** previews for a material GCC segment unless RTL/complex-script PDFs are in scope for QA and platform.  
   - **Evidence:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v46.md` (Phase 2 codes, Theme 6).  
   - **Impact:** GCC commercial demos fail on **primary** differentiator; regional competitors (Talentera/ZenHR) win on **basic legibility**.  
   - **Recommended fix:** **Technical Considerations + GTM** — Explicit **acceptance criteria** for Arabic/RTL PDFs and scanned CVs; partner with Docs/rendering owners; flag **Phase 1** vs **Phase 2** if platform gaps remain.

4. **Germany / GDPR-style anonymised screening vs “full context” modal**  
   The Deployment Agent notes **Germany** may require **anonymised** candidate data in early stages (name/photo hidden) via security and grid configuration. The PRD’s unified modal centres **name, contact, full CV** in one surface.  
   - **Evidence:** Deployment Agent: *“In regions with strict data privacy regulations, such as Germany (under GDPR), there is often a requirement to anonymize candidate data during the initial review stages…”*  
   - **Impact:** Feature **cannot be rolled out** default-on for tenants with anonymised screening, or recruiters **breach** configured privacy mode; legal escalation.  
   - **Recommended fix:** **Critical User Journey + Regulatory** — Document **respect for existing security/anonymisation** (dynamic masking, stage-based fields); add **dependency on Security/Functional** config patterns before 315 assumes one layout globally.

5. **Telemetry-defined “time-to-review” is a weak proxy**  
   Efficiency metric uses **time delta between grid row click and stage movement**. Recruiters open a profile, pause, return later, or move stages in batch—**stage movement ≠ reading complete**.  
   - **Evidence:** PRD Success Metrics (Efficiency); standard recruiter behaviour described in v46 Theme 3 (high volume, interruption).  
   - **Impact:** **False optimisation** (gameable metric), **NPS** disconnect, and **GDPR** risk if high-granularity logging is expanded to “prove” the metric.  
   - **Recommended fix:** **Success Metrics** — Define **session-based** dwell time with idle thresholds; align with **Privacy** on **minimised** events; separate **leading** (modal open rate) from **lagging** (quality of hire proxies).

---

### 🟠 Important Issues (Should address before 315)

1. **Baseline inconsistency with prior candidate-grid PRD (v42)**  
   v46 uses **3 minutes/candidate** baseline; v42 cited **roughly 5–10 minutes per candidate** tab-switching tax.  
   - **Evidence:** `docs/prds/gcc-candidate-grid-redesign-v42-prd.md` Executive Summary vs v46 Overview / Success Metrics.  
   - **Impact:** **40% reduction** claims are **not comparable** across documents; stakeholders challenge credibility.  
   - **Recommended fix:** **Executive Summary + Success Metrics** — Reconcile baselines (definition of “review”, single candidate vs batch) or cite **new** measurement study.

2. **Canvas Kit v11 dependency lacks contingency**  
   PRD lists **Canvas Kit v11** and carousel/modal patterns without **GA date**, **fallback** if Design System slips, or **exception** path for tenants on older bundles.  
   - **Evidence:** PRD Dependencies & Risks; MISSION_LOG historical note that prototypes used Canvas Kit v11 (e.g. MISSION-013) does not prove **Recruiting** GA alignment for 2026R2.  
   - **Impact:** 315 designs **components that are not shippable** on target release; rework.  
   - **Recommended fix:** **Dependencies & Risks** — Named **DS liaison**, target CK version matrix, and **de-scoped** UI if v11 modal/carousel not available.

3. **“Export to comparison view (separate feature)” is an unmanaged dependency**  
   Critical journey references **export to comparison** without owner, release, or link to existing roadmap.  
   - **Evidence:** PRD Critical User Journey.  
   - **Impact:** Sales/CS promise **end-to-end** shortlisting; delivery is **fragmented**.  
   - **Recommended fix:** **Out of Scope** or **Dependencies** — Explicitly **exclude** from 2026R2 comms or attach **epic ID** and **interface contract**.

4. **“End-to-end encryption for recruiter notes” may over-state product reality**  
   The phrase invites **customer security review** beyond typical SaaS encryption-at-rest/in-transit messaging.  
   - **Evidence:** PRD Data Security & Privacy.  
   - **Impact:** **Security** and **Legal** challenge wording; deal-cycle friction.  
   - **Recommended fix:** Align wording with **Workday standard** data protection posture (exact terms from Security); avoid “E2E” unless **cryptographically** accurate.

5. **Regional residency one-liner (“Middle East AWS”) for CV cache**  
   GCC section asserts **regional data residency** for **CV rendering cache** without implementation path, product areas affected, or conflict with **global** tenants.  
   - **Evidence:** PRD Regulatory (UAE PDPA bullet).  
   - **Impact:** **Compliance** expects a control that **engineering** never scoped.  
   - **Recommended fix:** Move to **open decision** with **Legal + Hosting**; tie to **tenant** residency offerings if any.

---

### ⚙️ Feasibility Concerns (Workday System Constraints)

- **Inline PDF vs isolated viewer (performance model):** Deployment Agent describes **isolating** PDF rendering from the main app. A **<500ms modal open** with **lazy PDF** may still fight **browser** and **tenant** attachment policies.  
  - **Deployment Agent finding:** *“Displaying PDF attachments like resumes directly in the browser UI can be resource-intensive… opening the attachment in a new browser tab or a dedicated document viewer…”*  
  - **Suggested validation:** Perf test with **5MB and 10MB** PDFs, **scanned** multipage, and **concurrent** prefetch for **Prev/Next** carousel.

- **Grid scale and “All Candidates” load:** Large reqs hit **All Candidates** view with **column count** and **calculated fields** driving load time. PRD’s **50 per page / infinite scroll** may not match **configurable grid + on-point default** behaviour.  
  - **Deployment Agent finding:** Default grid emphasises **on-point**; **All Candidates** is separate; performance depends on **columns** and **calculated fields**.  
  - **Suggested validation:** Run **200+** and **1,000+** applicant scenarios with **customer-realistic** column sets.

- **What already exists:** Slide-out **panel**, **CV preview in grid**, and **tabs inside grid configuration** already reduce some tab friction.  
  - **Deployment Agent finding:** *“Logical extension of the existing slide-out panel functionality.”*  
  - **Suggested validation:** 315 must show **delta** vs **config-only** improvements to avoid **“we already paid for this in Professional Services”** objections.

---

### 🤔 Hidden Assumptions (Make explicit in PRD)

- **Assumption:** Recruiters will adopt **carousel + keyboard** workflow at scale (change management heavier than PRD’s **2-hour webinar** implies).  
- **Assumption:** **IE deprecation** is acceptable for **all** enterprise segments; no **%** of tenants on locked legacy browsers.  
- **Assumption:** **Mobile** is **responsive web** in browser, **not** a native iOS/Android app—PRD cites **dp** units and gestures but does not name **platform**.  
- **Assumption:** **Art. 30** logging of **all profile views** with **6-year** retention is **approved** by Privacy for **volume and purpose** (operations vs compliance).  
- **Assumption:** **HiredScore / AI insights** in the modal (**“if enabled”**) will not trigger **EU AI Act / Art. 22** scope creep in **Phase 1** implementation.

---

### 💥 Real-World Failure Scenarios

- **Scenario 1 (scale):** A **single req** with **800–1,000** applicants and **heavy** calculated columns: **All Candidates** load and **filter application** lag; recruiters **disable** the new modal as “slower than tabs.” **Mitigation:** Server-side **filter first**, **virtualised** grid, hard **column budget** guidance.

- **Scenario 2 (network):** GCC **mobile** users on **3G** or congested Wi-Fi: **carousel Prefetch** pulls **next** PDF; **battery** and **data cap** complaints; modal shows **blank** CV pane. **Mitigation:** **Wi-Fi-only prefetch** toggle, **low-data** mode (text summary first).

- **Scenario 3 (accessibility + power users):** **Screen reader** users with **carousel** and **inline PDF** may get **poor semantics**; **dual-monitor** users expect **detachable** viewer; **keyboard-only** users conflict with **grid** vs **modal** focus traps. **Mitigation:** WCAG **test plan** beyond “ARIA labels” bullet; optional **detach/undock** viewer pattern.

---

### ✅ Recommended Fixes

For **200** to implement in revision:

1. **Dependencies & Risks + Technical Considerations:** Replace generic **PDF Rendering Service** with **confirmed** platform approach; cite **Deployment Agent** grounding; add **fallback** UX and **spike** milestone in **Q2 EA** readiness checklist.  
2. **Success Metrics + Overview:** Single **adoption and events** model; remove contradictory **60% vs 40%** without explanation; add **capacity** implications.  
3. **Regulatory + User Journey:** **Germany anonymisation** and **GCC RTL PDF** as **explicit** requirements with **go/no-go** for GA.  
4. **Competitive / Differentiation:** Clarify **incremental value** over **existing** slide-out panel, **CV preview column**, and **grid tabs** (per Deployment Agent).  
5. **Cross-initiative:** Align **time-to-review** narrative with **GCC-E2E-002 Recruiter Dashboard** (`MISSION_LOG.md`) to avoid **duplicate** or **conflicting** metric ownership.

---

### MISSION_LOG pattern notes (Steps 7–8)

- **GCC-E2E-002 (Recruiter Dashboard):** Explicit pain on **time-to-review** and **PowerBI exits** — reinforces need for **clear metric ownership** between **grid UX** and **dashboards**.  
- **GCC-E2E-003 / MISSION-017 (Candidate grid prior):** Multiple parallel artefacts (v40 search PRD, v42 redesign, v44 prototype); **Figma/backlog** incomplete in places — risk of **version sprawl**; v46 should **reference** which prior epic (**e.g. HRREC-90976 / HRREC-90968**) is **superseded** or **merged**.  
- **GCC-CANDIDATE-GRID-001 (v44 prototype):** **060** flagged **medium** risk (AI, GDPR Art. 22, EU AI Act); v46 keeps AI mostly **Phase 2** but still mentions **AI match insights** in-modal — watch **scope creep**.

---

### Return summary (orchestrator)

| Item | Value |
|------|--------|
| **Critical risks count** | **5** |
| **Important issues count** | **5** |
| **Top 3 most impactful findings** | 1) **PDF “service”** misaligned with **current Workday** attachment handling (DA: new tab/viewer). 2) **Adoption / volume maths** internally inconsistent (**60% vs 40%**, **15M vs 75M** steady-state). 3) **GCC Arabic/RTL** and **Germany anonymisation** can **block** “unified full context” as a **default** experience. |
| **Recommended for 200 revision?** | **Yes** |

---

**Summary for Orchestrator:** **5 critical risks, 5 important issues found. Recommend 200 revision before 315.**
