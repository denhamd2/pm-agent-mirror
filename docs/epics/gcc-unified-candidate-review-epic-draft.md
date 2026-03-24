# Epic draft: Unified candidate review surface (v57)

**PRD:** `docs/prds/gcc-unified-candidate-review-prd.md`  
**Discovery brief:** `design/gcc-unified-candidate-review-v57-discovery-brief.md` (Final Verdict: **APPROVED**)  
**Prototype:** `design/gcc-unified-candidate-review-v57.tsx`  
**Figma:** https://www.figma.com/design/tbyRMoc1CdtyE4ZSyoAoxf  
**Mission:** GCC-E2E-017 · Step 11 (**400**)  
**Status:** **Jira created (430)** — Epic [HRREC-91050](https://jira2.workday.com/browse/HRREC-91050) · Stories [91051](https://jira2.workday.com/browse/HRREC-91051)–[91061](https://jira2.workday.com/browse/HRREC-91061) (24 March 2026).

## Epic summary (for Jira Summary field)

Unified candidate review surface for high-volume requisition triage (GCC-E2E-017)

## User story

As a **recruiter or TA specialist** managing **high-volume job requisitions** (including **GCC** and other tier 1 regions)  
I want a **unified, high-density candidate review surface** on the requisition (**summary, CV, activity, notes**) with an **in-context prioritisation insight** region when **HiredScore** is activated, plus **reliable previous / next** movement and a clear path **back to the candidate list**  
So that I can **triage and document judgement faster** with **fewer tab hops**, **transparent advisory signals**, and **auditability**, while **complementing** (not replacing) **Native sequential review**

## Jira-ready description

Paste body for Jira epic description (markdown):

**User story**

As a recruiter or TA specialist managing high-volume job requisitions, I want a unified candidate review surface on the requisition with summary, CV, activity, and notes, an in-context prioritisation insight slot when HiredScore is activated, reliable previous and next navigation, and a clear return to the candidate list, so that I can triage faster with fewer context switches and documented screening judgement, while Native sequential review remains available.

**Links**

• **PRD:** `docs/prds/gcc-unified-candidate-review-prd.md`  
• **Discovery brief:** `design/gcc-unified-candidate-review-v57-discovery-brief.md` (**Final Verdict: APPROVED**)  
• **319 copy (audit):** `design/gcc-unified-candidate-review-v57-copy-review.md`, `design/gcc-unified-candidate-review-v57-copy-spot-check.md`  
• **Prototype:** `design/gcc-unified-candidate-review-v57.tsx` · http://localhost:5199/gcc-unified-candidate-review-v57  
• **Figma:** https://www.figma.com/design/tbyRMoc1CdtyE4ZSyoAoxf  

**Scope (in)**

• **Unified surface** from **requisition candidate management** (exact entry control **TBD** with PM; primary drill-in from candidate name per brief)  
• **Panels:** Summary, CV, Activity, Notes visible in default layout without mandatory profile tab churn  
• **Prioritisation insight** region: **mandatory slot**; **graceful** states when HiredScore inactive, unlicensed, or below minimum integration version (**Engineering** to record minimum version before GA)  
• **Sequential navigation:** **Previous candidate** / **Next candidate** on the same requisition; **navigation reliability** per PRD NFR (no wrong order, skip, stale context, focus loss)  
• **Return paths:** **Back to candidate list**; **Open full profile** fallback to Native experience  
• **Localisation:** EN + **AR**; **RTL** layout testing for recruiter shell  
• **Telemetry:** surface load, panel engagement, note created (stage at creation), previous / next, insight expand / collapse  

**Explicit sequencing / gates**

• **Pre-screen notes:** no broad policy programme until **Pre-screen notes: spike gate** completes (**A** config / **B** defect / **C** validated policy); stories cover **current** gating UX with **319**-approved messaging pending **060** final line  
• **HiredScore** disclosure and advisory copy: **060** may supersede strings before GA; implement **319**-approved baseline from the discovery brief  

**Out of scope (v1 unless PM re-opens)**

• Closing **True Gap** items from **101** (SMS, WhatsApp core UI, Qiwa / Mudad, semantic match in core SKU without optional SKUs)  
• **Split list + detail** default (phase 2 candidate per brief)  
• **Hiring manager** read-only slice unless pulled into v1  

**Success metrics (from PRD — directional)**

• **Navigation efficiency:** target **≥30%** reduction in distinct view or tab opens per candidate reviewed (lab + telemetry)  
• **Time to first qualified action:** **10–25%** median reduction vs baseline on reqs with **≥100** applicants  
• **Pre-screen notes usability:** **≥80%** pilot agreement when notes needed before screen stage, subject to spike outcome  

## Notes for story mapping

• **420:** **VS1** = end-to-end walking skeleton (open surface → four panels → previous / next → back to list → CV / activity / notes behaviours → policy-aware notes messaging)  
• **VS2** = prioritisation insight slot + telemetry + RTL / AR  
• **VS3** = spike gate execution story + NFR regression test pack for sequential navigation  
• **430** defaults: project **HRREC**, component **Recruiting Purge**, assignee **david.denham**; **319** editorial pass on all quoted UI in stories before create  
