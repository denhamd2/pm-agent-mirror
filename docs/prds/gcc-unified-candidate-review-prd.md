# Unified Candidate Review Surface (2026+)

Product Requirements Document  
March 2026

**Mission:** GCC-E2E-017  
**PM:** David Denham  
**Status:** Draft (revised Step 6b, GCC-E2E-017 — Red Team **080**)  
**Canonical path:** `docs/prds/gcc-unified-candidate-review-prd.md` (not published to Confluence)

---

## Executive Summary

Workday is uniquely positioned to deepen **tier 1 regional growth**, including **GCC**, by shipping recruiter experiences that match **high-volume, high-stakes** hiring: fewer hops, faster triage, and clearer collaboration on a candidate before and during early pipeline stages. This initiative delivers a **unified, high-density candidate review surface** on the requisition (summary, CV or resume, timeline, notes) that **complements** existing **Native sequential review**, and addresses **research-validated friction** on **tab navigation** and **pre-screen notes** behaviour. It explicitly includes a **HiredScore-style spotlight** region so tenants with **HiredScore** activated see prioritisation and fit signals **in context**, without replacing recruiter judgement.

For our customers, this feature will reduce **navigation tax** when reviewing **100–200+** applicants per requisition (and larger funnels where a small number of roles attract **hundreds of CVs**), support **faster identification of who merits attention** (aligned to **120** Theme 1 and **105** evidence), and improve **documented screening judgement** earlier in the pipeline where GCC and global teams collaborate. Success is measured through **time to first disposition**, **fewer view or tab events per review**, and **pre-screen note usability** (see Success criteria).

For Workday, this initiative will strengthen **Recruiting differentiation** in competitive cycles where **regional ATS** and **connected hiring** narratives (e.g. **Zoho Recruit** screening automation, **Bayzat** AI-assisted ATS positioning, **HiBob** AI CV summaries, **SAP / SmartRecruiters** connected hiring and AI companion story) emphasise **speed and single-pane triage**. Workday retains **platform depth**, **security**, and **auditability**, while closing the **experience gap** between **Native sequential review** (validated **Native** in **101** GCC-E2E-017) and **single-surface** expectations from the market.

For GA, this capability will feature as part of **Workday Recruiting** (specific release train **TBD** with Engineering). **101** classifies **sequential candidate review on req** as **Native**; this PRD **does not** remove that pattern—it **adds** an optional or primary consolidated view per design. **Candidate Notes** and **pre-screen** friction are **not** resolved by copy or **060** policy work alone until a **spike gate** classifies root cause (see **Pre-screen notes: spike gate**); consolidated **Deployment Agent** validation for this mission is in **Deployment Agent validation (GCC-E2E-017)** below.

**Epic links:** TBD (EA) | TBD (GA)

Workday Confidential — 1 of 12  
-- 1 of 12 --

---

## Overview

### Overview details

| **Section** | **Content** |
|-------------|-------------|
| **Core problem** | Enterprise recruiters in **GCC and other tier 1 regions** lose time opening **multiple tabs** (e.g. education vs CV) to assemble context for a single applicant. At **high volume**, this **navigation tax** delays triage and increases error risk. **105** reports inability to add notes in **pre-screen** contexts customers care about; **120** triangulation notes **Sequential Native ≠ single surface**. **Strategic driver (PM):** tier 1 regional growth priority including **GCC**. |
| **How is it done today?** | Recruiters work from the **job requisition** candidate list and **sequential review**, opening **candidate profile** areas across **separate tabs**. **101 / Deployment Agent (GCC-E2E-017)** confirms **sequential review on req** as **Native**. **Mass actions** exist for efficiency. Leading practices sometimes add **business process** steps to mark reviewed applicants. **HiredScore** (when activated) may surface insights **outside** this unified layout today—scope is to **embed a spotlight** in the new surface. |
| **How is our approach uniquely different from others?** | • **Complements Native workflow** rather than replacing enterprise **req-based** process and security. • **Single high-density surface** aligned to recruiter mental models for triage. • **HiredScore-style spotlight** in-view for licensed tenants—human-in-the-loop prioritisation (**010**: HiredScore assumed integrated when activated). • **Governed notes evolution**: after **spike gate** root-cause classification, apply **060** only where **(C) validated policy change** applies (see **Pre-screen notes: spike gate**). • **Honest competitive posture**: **efficiency parity** for this initiative is **limited to req-based candidate review UX and triage surface** (unified layout, navigation, in-context spotlight)—**not** omnichannel, government portals, or core semantic match; **True Gap** items from **GCC-E2E-017** are repeated under **Competitive and market context** for RFP discipline. |
| **Why is AI/ML the chosen approach?** | **Not the primary lever for the shell UX.** Optional **HiredScore** signals (when tenant has SKU) **augment** recruiter judgement in a dedicated **spotlight** component; recruiters remain the decision-makers. Align with **EU AI Act** high-risk employment context: **transparency**, **human oversight**, no auto-reject solely on model output. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 forecast (directional—refine with analytics):** • **Adoption target:** **35%** of pilot **Recruiter** users on unified surface weekly within **2 quarters** of GA in opted-in tenants. • **Usage volume:** **~250k–400k** candidate review sessions annually across pilot population (basis: pilot tenant headcount × estimated weekly reviews × 46 weeks × adoption). • **Strategic value & outcomes:** (1) **Time to first qualified action** — target **10–25%** median reduction vs baseline on reqs with **≥100** applicants. (2) **Navigation efficiency** — target **≥30%** reduction in distinct **view/tab opens** per candidate reviewed in lab and telemetry. (3) **Pre-screen notes** — target **≥80%** of pilot recruiters agreeing notes are usable when needed **before** screen stage, and/or measurable increase in early-stage note events **without** breaking compliance (validated with **060**). |

### Audience / personas

**Primary persona:** **Recruiter / TA specialist** (including **GCC** high-volume hiring)  
• Manages pipelines of **large applicant counts** per req.  
• Needs **fast scan**, **clear CV access**, **timeline**, and **collaborative notes**.

**Secondary persona:** **Recruiting coordinator**  
• Supports documentation and stage movement; benefits from **single surface** for handoffs.

**Tertiary persona:** **Hiring manager** (read-heavy, if scoped)  
• May consume **summary** and **spotlight** highlights where policy allows—**v1** may be recruiter-first; align with **docs/workday-user-research/README.md** and **`docs/jtbd-recruiting-hr-professional-and-manager.md`** if manager-facing slices are added.

Persona depth: **`docs/workday-user-research/README.md`** (HR Professional / Recruiting); JTBD lines from **`docs/jtbd-recruiting-hr-professional-and-manager.md`** for “review and disposition candidates efficiently” jobs.

Workday Confidential — 2 of 12  
-- 2 of 12 --

---

## Feature solution

• Recruiter opens **unified candidate review** from the **requisition candidate list** (entry point **TBD** with **315**: new action, default drill-in, or preference).  
• **Layout (high density):** primary canvas shows **Summary** (role fit, key fields, status), **CV / resume** viewer or embedded document panel, **Timeline** (applications, stages, key events), and **Notes** (create, view, filter by type where supported).  
• **HiredScore-style spotlight** component (mandatory in scope): prominent region for **fit / priority / summary signals** when **HiredScore** is **activated** for the tenant; **empty or hidden state** with clear copy when **not licensed** (no dead-end).  
• **Complement sequential review:** user can **advance to next candidate** from the unified surface without returning to grid-only flow; existing **Native sequential** patterns remain available.  
• **Pre-screen notes:** **no** broad policy or **060** sign-off on redesigned rules until **Pre-screen notes: spike gate** completes and branches **(A)**, **(B)**, or validated **(C)**; then execute the matching workstream (config/security, defect fix, or policy change).  
• **Accessibility and RTL:** unified surface must respect **Arabic** and **RTL** recruiter shell expectations per **101** (**Native** with **UAT** caveat from GCC-E2E-017).  
• **No breadcrumbs** in target UX per **`010-style-guide.mdc`**; use **hub / tabs / headings** only.  
• **Telemetry:** events for **surface load**, **panel engagement**, **note created** (stage at creation), **next candidate** navigation, **spotlight** expand/collapse.

### Experience principles alignment

**Empower (give users control)**  
• Recruiters choose **when** to rely on **HiredScore** spotlight; signals are **advisory**.  
• **Outcome-focused:** “Decide on this candidate faster,” not “complete ten clicks.”

**Trust (build their confidence)**  
• **Spotlight** copy explains **what** the signal represents; link to **HiredScore** help where applicable.  
• **Notes** show **who / when**; visibility rules transparent.

**Grow (enable them to change)**  
• Notes and dispositions **editable** per existing rules; timeline reflects **history**.  
• Users can **fall back** to legacy tabbed profile if needed during transition (**TBD** product decision).

**Principle validation**

- [x] Feature keeps the user in control (no auto-disposition from spotlight).  
- [x] Transparency for AI-assisted signals where HiredScore is shown.  
- [x] Iteration without re-entering data across tabs.

**Principle tradeoff (documented)**  
Higher **density** can reduce white space; **315** must validate **scannability** vs **Trust** (clarity). If conflict arises, prefer **clear section hierarchy** and **progressive disclosure** for secondary panels.

Workday Confidential — 3 of 12  
-- 3 of 12 --

---

## Critical user journey and use cases

• Recruiter lands on **requisition** with **120** active applicants.  
• Sorts or filters list; opens **unified review** for **Candidate A**.  
• Scans **HiredScore spotlight** (if active), **summary**, and **CV** without leaving the surface.  
• Scrolls or expands **timeline** to confirm prior events.  
• Adds a **pre-screen note** for the hiring team (**policy allows**).  
• **Moves forward** or **declines**; chooses **next candidate** in sequence.  
• If **HiredScore** off: spotlight shows **neutral state** (“Prioritisation insights unavailable” or equivalent—**319** copy).  
• **Audit:** note and disposition appear in **candidate history** per existing product rules.

**Edge cases**

• **Multiple applications** for same person: surface must show **context for this req**.  
• **Attachments only, no parseable CV:** CV panel shows **download** or **preview** fallback.  
• **Restricted data:** security respects **domain** and **masking**.

Workday Confidential — 4 of 12  
-- 4 of 12 --

---

## Competitive and market context (101 — GCC-E2E-017)

**Sources:** `research/competitive/matrices/gcc-competitive-matrix.md` (v1.7, changelog GCC-E2E-017); `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`.

| **Capability** | **Workday (GCC-E2E-017)** | **Competitive read (illustrative)** | **Implication for this PRD** |
|----------------|---------------------------|-------------------------------------|------------------------------|
| **Sequential / req-based review** | **Native** (see **Deployment Agent validation** table) | Regional ATS emphasise fast triage UX | We **retain** Native pattern; **add** unified surface. |
| **Single-pane triage + automation narrative** | **Experience enhancement** (this initiative) | **Zoho** (auto-trigger screening bot, Feb 2026); **Bayzat** (AI-assisted ATS); **HiBob** (AI CV summaries); **SAP/SR** (connected hiring + Winston / Joule narrative) | **UX / triage-surface efficiency** (unified review layout, fewer tab hops, in-context spotlight when licensed)—**not** full-stack parity with competitor **automation / omnichannel / statutory** stories. |
| **Arabic / RTL recruiter shell** | **Native** (UAT for edge cases) | Competitors cite **Arabic** (e.g. Zoho **27 languages**) | **RTL-safe** layout and typography in **315/320**. |
| **HiredScore / AI matching** | **Native path via optional SKU** (product strategy per **010**) | Competitors bundle **AI screening** stories | **Spotlight** surfaces existing **HiredScore** value **in context**. |

**RFP / positioning discipline — True Gap items (repeat from `gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`, do not imply this PRD closes them):**

• **SMS to GCC candidate mobiles** via standard **Workday Messaging** (native service): **True Gap** (US-only per **GCC-E2E-017** DA); international SMS via Twilio/Telesign described as **custom Studio/API**, not standard configuration.  
• **First-party WhatsApp** from core **Workday Recruiting** UI (no third-party conversational product): **True Gap**; **Paradox** = public **workaround** when licensed.  
• **Qiwa / Mudad recruiting exchange**: **True Gap** (no standard pre-built integration).  
• **Semantic AI job–candidate match** in **core SKU** without optional SKUs (e.g. **HiredScore**): **True Gap**.

**Sales / positioning note:** Do **not** bundle this UI change as closure of the **True Gaps** above. This initiative improves **req-based review UX and triage** only; omnichannel and statutory adjacency remain governed by **101** scan and **010** (e.g. **Broadbean** for boards).

Workday Confidential — 5 of 12  
-- 5 of 12 --

---

## Research traceability

| **Artifact** | **Use in this PRD** |
|--------------|---------------------|
| `research/GCC/thematic-analysis/2026-03-24-GCC-PMF-Analysis-v57.md` | **E2E Handoff #3**; Theme 1 **review density**; triangulation matrix (**Sequential Native ≠ single surface**). |
| `research/GCC/105-user-research-findings.md` | **Theme 1** quotes; **pre-screen notes** friction; **tab** friction at volume. |
| `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md` | **Native / Workaround / True Gap** grid; competitor **AI triage** narratives. |
| `research/competitive/matrices/gcc-competitive-matrix.md` | **v1.7** positioning, **Workday Competitive Response**, **GCC-E2E-017** changelog. |
| **Deployment Agent validation (GCC-E2E-017)** (this PRD, **Resources**) | Consolidated DA thread IDs and scope for **sequential review**, **notes**, **HiredScore** handoff. |

Workday Confidential — 6 of 12  
-- 6 of 12 --

---

## Functional requirements

1. **Unified surface entry** from requisition candidate management (**exact control** per **315**).  
2. **Panels:** Summary; CV/resume; Timeline; Notes—**all visible** in default layout without mandatory tab churn (sub-tabs only if validated for density).  
3. **HiredScore spotlight:** configurable component slot; displays **tenant-appropriate** content when tenant meets **minimum integration version** (**Dependencies and risks**); **graceful degradation** and **fallback** when inactive or below minimum.  
4. **Sequential navigation:** **Next** / **Previous** candidate on same requisition from unified view; must meet **Non-functional requirements** for navigation reliability (incl. regression vs DA-cited instability).  
5. **Notes:** after **Pre-screen notes: spike gate** produces **(A)**, **(B)**, or validated **(C)**, implement the **PM-approved** branch—**060** sign-off on **policy** copy and rules **only** for **(C)**; for **(A)** deliver security/config requirements; for **(B)** defect fix scope with no spurious policy programme.  
6. **Mass actions:** remain reachable (return to grid or side panel **TBD**—must not strand users).  
7. **Localisation:** EN + **AR** strings for GCC; **RTL** layout testing.  
8. **Performance:** meet **Non-functional requirements** minima; Engineering may tighten SLOs during sizing.

## Pre-screen notes: spike gate (060 / policy root cause)

**Purpose:** Prevent **060** and policy redesign from starting on a **misclassified** problem (config vs bug vs true policy).

**Before** any **v1** programme to “relax pre-screen notes” or equivalent:

1. Run a **time-boxed spike** (length **TBD** with Engineering) that reproduces **105** scenarios in controlled tenants and reconciles with **Deployment Agent validation (GCC-E2E-017)** for **Candidate Notes**.  
2. **Outcomes branch v1** into exactly one primary track (secondary tracks documented if co-existent):  
   • **(A) Security / configuration / discoverability** — behaviour matches product intent but **tenant role**, **DAP**, **BP**, or **UI discoverability** blocks recruiters; v1 = enablement, documentation, or config guidance + any **product nudges** that do not change legal basis of notes.  
   • **(B) Product defect** — implementation or regression vs documented capability; v1 = fix path, not policy paper.  
   • **(C) True policy change** — spike **validates** that a **new or revised** notes policy is required; **only then** run full **060** / Legal / Security policy workstream and PRD updates to **visibility**, **retention**, and **audit**.  
3. **Forbidden:** treating **Deployment Agent** summary alone as proof of **(C)** without spike evidence; **forbidden:** skipping spike when **105** and DA disagree.

## Non-functional requirements

• **Security / DAP:** respect recruiting and candidate data policies.  
• **Accessibility:** WCAG-aligned targets per Workday standard.  
• **Observability:** metrics named in Feature solution.  
• **EU AI Act / GDPR:** for **HiredScore** surfaces, maintain **human oversight** and **transparent** copy; DPIA posture per existing HiredScore programme.  
• **Performance (minimum bar):** Engineering sets final SLOs during sizing; **minimum** acceptance until superseded:  
  • **Initial load:** unified surface reaches **interactive** state **no worse than p75/p95** of current **sequential review** entry for the same req class on **reference pilot hardware** (baseline captured in QA plan).  
  • **Candidate switch:** **Next** / **Previous** completes **within Engineering-agreed** p75/p95 budgets once document/summary data for the target candidate is cached or within normal network variance—**no systematic regression** vs baseline sequential flow on the same dataset size band (**≥100** applicants).  
• **Navigation reliability:** **Next** / **Previous** on the unified surface must **not reintroduce** **Next/Previous instability** patterns that **Deployment Agent** or pilot tenants have associated with native **sequential review** (wrong candidate order, skip, stale context, or loss of focus); **blocking GA**: automated + exploratory tests that explicitly **regress** those scenarios—test pack **must** cite the relevant **Deployment Agent** thread(s) or Engineering defect IDs in the QA plan (anchor: **593c667b-32ad-43c3-83bf-0c82ddbcf84e** plus any follow-up DA notes on sequential navigation).

Workday Confidential — 7 of 12  
-- 7 of 12 --

---

## Dependencies and risks

• **HiredScore**  
  • **Minimum integration version:** **TBD** — Engineering + **HiredScore** programme owner must record the **minimum tenant bundle / API / adapter version** that supports the **in-context spotlight** contract **before GA**; document the locked version in the epic and release notes.  
  • **Fallback (non-compliant tenants):** Tenants **below** minimum version, **without** HiredScore activation, or **non-compliant** configuration must still **ship** the unified surface: **spotlight** region shows the approved **empty / neutral** state (**319** copy); **no** hard dependency that blocks core panels (Summary, CV, Timeline, Notes); **acceptance:** spotlight failure or absence **never** errors the page or blocks disposition actions.  
• **Candidate profile** and **notes** data model—resolved via **Pre-screen notes: spike gate** before committing policy work.  
• **315 → 319 → 320** design chain; **Canvas Kit MCP** for implementation.  
• **Cross-team:** Recruiting UX, HiredScore squad (if separate), Security, Legal, Localization.

Workday Confidential — 8 of 12  
-- 8 of 12 --

---

## Open questions

1. **Notes friction:** addressed by **Pre-screen notes: spike gate** (outcome **(A)**, **(B)**, or **(C)**); spike closes this open question for v1 planning.  
2. **Default experience:** does unified surface **replace** default profile drill-in for opted-in tenants only, or become **global** default?  
3. **Hiring manager** slice in v1 or v2?  
4. **Mobile** recruiter use: in or out of v1?

Workday Confidential — 9 of 12  
-- 9 of 12 --

---

## UX designs for target release

• **Unified candidate review surface** — Figma **TBD** (post **330** capture from **320** prototype).  
• **Discovery brief** — `design/gcc-unified-candidate-review-discovery-brief.md` (**TBD**; **315**).

---

## Releases and production thresholds

• **Legal (060):** notes visibility and **HiredScore** disclosure copy.  
• **Responsible AI / HiredScore** programme artefacts: follow existing **HiredScore** release gates when spotlight ships.  
• **Accessibility** sign-off.  
• Links **TBD** when epics created.

Workday Confidential — 10 of 12  
-- 10 of 12 --

---

## Target delivery and major milestones

| **Milestone** | **Target date** |
|---------------|-----------------|
| PRD approval (PM + Red Team **080**) | TBD |
| Discovery brief **315** (**Final Verdict: APPROVED**) | TBD |
| Prototype **320** + copy **319** | TBD |
| Figma **330** | TBD |
| Engineering sizing and release assignment | TBD |
| Pilot tenant selection (GCC + non-GCC) | TBD |
| GA | TBD |

Workday Confidential — 11 of 12  
-- 11 of 12 --

---

## Resources

• **Epic:** TBD (EA), TBD (GA)  
• **PRD (markdown):** `docs/prds/gcc-unified-candidate-review-prd.md`  
• **PMF analysis:** `research/GCC/thematic-analysis/2026-03-24-GCC-PMF-Analysis-v57.md`  
• **105 findings:** `research/GCC/105-user-research-findings.md`  
• **101 scan:** `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`  
• **Matrix:** `research/competitive/matrices/gcc-competitive-matrix.md`  

### Deployment Agent validation (GCC-E2E-017)

**Date:** 24 March 2026 | **Mission:** GCC-E2E-017 | **Source scan:** `research/competitive/gcc/gcc-competitive-scan-2026-03-24-GCC-E2E-017.md`

| Topic | Deployment Agent thread ID | Summary (PRD use) |
|-------|----------------------------|-------------------|
| **GCC parity grid** (sequential review on req, RTL/Arabic, SMS, WhatsApp, Qiwa/Mudad, MOHRE, nationalisation dashboards, semantic AI core, multipost, etc.) | `593c667b-32ad-43c3-83bf-0c82ddbcf84e` | **Sequential candidate review on req: Native**; **True Gaps** and **Workarounds** as in scan and **Competitive and market context**; **Next/Previous** instability signals (if any) feed **NFR navigation reliability** regression tests. |
| **Candidate Notes** (availability, stage behaviour, pre-screen context) | `b6d8a019-23b1-4241-a0e6-34c93e96da2a` | Baseline DA position on notes vs **105** friction; **spike gate** must reconcile before **(C)** policy work. |
| **HiredScore / in-context spotlight** | *No separate thread in GCC-E2E-017 scan* — treat as **programme + Engineering** confirmation | **Native path via optional SKU** per **010** / product strategy; **minimum integration version** and **fallback** per **Dependencies and risks**. |

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Workday Recruiting |
| TBD | Engineering lead |
| TBD | Design lead |
| TBD | HiredScore PM / partner PM |
| TBD | Legal partner (**060**) |

Workday Confidential — 12 of 12  
-- 12 of 12 --
