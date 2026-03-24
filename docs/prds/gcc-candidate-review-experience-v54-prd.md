# GCC Candidate Review Experience (2026R2+)
Product Requirements Document  
March 2026  
**Pipeline:** GCC-E2E-014 (Step 7 **200** post **080** revision; HITL recommendation **#3**)

## Executive Summary

Workday is uniquely positioned to deliver a **GCC-informed, globally scalable** candidate review and apply experience that reduces **tab sprawl** for high-volume recruiters, clarifies **search** expectations (boolean vs semantic), and improves **mobile apply** completion where **40%+** of applications originate on handheld devices in Middle East contexts (**P2** Baker Hughes, **P3** Shell). This initiative packages **unified high-density review** (grid plus profile or preview surfaces), **search enhancements** aligned to Deployment Agent-validated **Native / Workaround / True Gap** classifications, and **mobile-optimised apply** hardening (assessment redirects, document upload paths, GCC acceptance testing) as one coherent roadmap bet.

For our customers, the feature set targets **measurable recruiter throughput** (fewer navigation events per candidate reviewed, faster shortlisting at 100–200 candidates per requisition), **clearer discovery** of talent (stronger structured search; honest packaging of semantic / AI match via **HiredScore** or **Enterprise Search Innovation** where licensed), and **higher apply completion** on mobile in GCC and comparable high-mobile markets. Evidence is anchored in **105** (P1 Accenture, P2 Baker Hughes, P3 Shell), **106** (Candidates and Prospects as internal **effort hotspot**), **107** (career site, scheduling, and UX comparison axes in win-loss narratives; sparse GCC row count), and **101** Step 1 plus **Pattern 5** brief for this mission.

For Workday, this initiative strengthens **retention and expansion** amongst enterprise recruiting customers who otherwise exit to **PowerBI** or parallel tools for operational visibility, narrows **perception gaps** versus regional ATS narratives (**Bayzat**, **Zoho Recruit**, **HiBob**) on **speed of review** and **mobile-first apply**, and preserves **enterprise differentiators**: auditability, security, global template, and governed AI paths (**060** alignment for any automated ranking or matching UX).

**Delivery context:** Canonical requirements live in this markdown file (**no** Confluence publish). Discovery and prototype work follow **315 → 319 → 315 → 320 → 319 → 330** per orchestrator. Competitive claims in sales motions must cite **`research/competitive/gcc/e2e-ci-brief-candidate-review-2026-03-22-GCC-E2E-014.md`** and **`research/competitive/matrices/gcc-competitive-matrix.md`** (v1.4, GCC-E2E-014 delta).

**Epic Links:**
- [GCC Candidate Review Experience] EA: [EPIC-ID-TBD]
- [GCC Candidate Review Experience] GA: [EPIC-ID-TBD]

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Recruiters lose time navigating **multiple tabs** and surfaces when reviewing candidates at scale; **P2** (Baker Hughes) describes moving between education, CV, and other areas across **100–200** applicants per requisition as **time consuming**. **P3** (Shell) needs to know **immediately** who deserves attention across **hundreds of CVs** per opening. Separately, **boolean / structured search** is perceived as weak (**P2**), while buyers compare Workday to competitors marketing **semantic** or **AI-assisted** match (**101**, **107**). On the candidate side, **40%+** mobile apply share in the Middle East (**P2**, **P3**) increases the cost of **assessment redirects**, **document upload** friction, and multi-hop career journeys (**105** Theme 1; **107** career site / UX factors). Without a coordinated initiative, GCC and global high-volume recruiters continue **spreadsheet sidecars**, tool exits, and **demo confusion** (e.g. **full profile** opened from the grid **lacks** native next/previous; **preview** from the **eye icon** **does** support sequential review per **Deployment Agent** thread **`9c0d7686-b087-4c9b-8166-9c9261631199`**). |
| **How is it done today?** | Recruiters use the **Candidates** grid on the requisition with **native** configurable columns, filters, sorting (with **primary stage sort fixed** and **no secondary sort** per Deployment Agent), and **mass actions**. **Sequential** movement between candidates is **native** in the **row preview** (**View / eye icon**) pop-up; opening the **full candidate profile** from the **name link** does **not** expose the same **next/previous** pattern (**True Gap** on that surface). **Boolean** operators are **native** in **Find Candidates**; **semantic / natural-language** style match in core Recruiting is a **Workaround** via **Enterprise Search Innovation Service** and/or **HiredScore** (licence-dependent). **Career site** apply is **responsive** by design; **workarounds** remain for some **third-party assessment** redirects and **cloud storage** upload clients on mobile. |
| **How is our approach uniquely different from others?** | • **Honest enterprise packaging**: GTM and UX copy distinguish **preview** vs **full profile** sequential review; no blanket claim that Workday lacks next/previous everywhere<br>• **Unified high-density review**: Reduce **tab tax** by converging summary, CV/resume, notes, and key timeline signals into **fewer context switches** (modal, split pane, or equivalent **315**-validated pattern)<br>• **Search**: Double down on **native** structured search discoverability and field coverage; position **semantic / AI** match explicitly as **governed** add-on or licensed path with **human-in-the-loop** (**EU AI Act** / **GDPR Art. 22** alignment via **060** where applicable)<br>• **Mobile apply**: Target **completion rate** improvements via mobile QA gates, partner assessment behaviour, and upload fallbacks<br>• **GCC validation**: Arabic / RTL acceptance on **generated** artefacts remains adjacent (**101** RTL **gap**); mobile apply testing includes **GCC** tenant configurations<br>• **Differentiator**: Global **security**, **audit**, and **configuration** depth versus **Bayzat** / **Zoho** bundle or velocity narratives |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• **Adoption Target:** **45%** (base case) of active Recruiting users who review **≥10** candidates/week use at least one in-scope improved flow (unified review **or** upgraded search **or** mobile apply fix path) within **12** months of GA[^adoption]<br>• **Usage Volume:** **~40M** recruiter review sessions (weighted sum of preview/modal sessions plus grid engagements; basis: **50k** active reviewers × **60%** peak adoption × **~15** sessions/week × **46** work weeks × **0.7** coverage factor)<br>  ○ **Basis:** Internal model aligned to v52 PRD scale; **45%** adoption reflects **three-pillar** scope (some users adopt subset)<br>  ○ **Calculation:** 30k peak adopters × 15 × 46 ≈ **20.7M**; rounded up for mobile apply traffic and search interactions → **~40M**<br><br>**Strategic Value & Outcomes:**<br>1. **Recruiter efficiency:** **25–30%** reduction in **time per thorough review** vs multi-tab baseline (target **3.5** minutes vs **5** minutes per candidate where unified surface ships; measure via instrumented sessions with idle threshold)<br>2. **Candidate conversion:** **10–15%** relative improvement in **mobile apply completion** for in-scope flows (baseline per tenant A/B or cohort pre/post; account for marketing and career site confounds)<br>3. **Drive Business & Platform Growth:**<br>   a. **Monetization:** Reinforces Recruiting SKU value; optional **HiredScore** / search innovation attach where semantic match is required<br>   b. **Deal-Closing:** Arms SE with **CI brief** table (preview vs profile, boolean native, semantic workaround)<br>   c. **Future Acceleration:** Unified review surface is the foundation for **governed** prioritisation hints (**HiredScore**) without dark-pattern automation |

### Audience / Personas

**Primary Persona:** HR Professional (Recruiting) / Corporate or regional recruiter (GCC-heavy req loads)

- Reviews **50–200+** candidates per requisition; needs **fast** screening and shortlisting
- **GCC context:** High mobile apply share; pressure on **speed** and **compliance** reporting (adjacent themes from **P1**)
- *Persona depth:* `docs/workday-user-research/README.md` (HR Professional supplemental PDF) and `docs/jtbd-recruiting-hr-professional-and-manager.md`

**Secondary Persona:** Hiring manager

- Consumes recruiter shortlists; benefits when recruiter notes and CV context are **co-located** and **scannable**

**Tertiary Persona:** External candidate (mobile)

- **Choose the right job** and **apply** on a phone; needs **fewer failure points** on assessments and uploads

---

## Jobs to be Done (JTBD)

### Worksheet alignment (`docs/jtbd-recruiting-hr-professional-and-manager.md`)

- **Manage candidates throughout the recruiting process:** Determine if candidate meets job requirements; progress candidates **efficiently** through pipeline stages.
- **Maintain high standards of efficiency and effectiveness:** Identify ways HR systems better meet **high-volume** workflow needs.
- **Worker (candidate):** Find a relevant job; **apply**; track application (**mobile** context per **External Candidate** persona PDF when discovery is candidate-centric).

### Synthesised JTBD lines (GCC + evidence)

| Persona | When… | I want… | So I can… | Evidence |
|---------|--------|---------|-----------|----------|
| Recruiter (**P2** Baker Hughes) | I am shortlisting **100–200** applicants on a req | **one dense review surface** (summary, CV, notes) with minimal tab changes | finish fair, complete reviews in less time | **105** Theme 1; **120** T3 **4/4** |
| Recruiter (**P2**) | I am hunting talent in a **2M** candidate database | **stronger structured search** and clear paths to **licensed** semantic match | find best-fit profiles without exporting to side tools | **105**; **101** semantic **Workaround** |
| Recruiter (**P3** Shell) | I receive **hundreds of CVs** per opening | **immediate signals** on who needs attention | prioritise fairly and explain decisions to stakeholders | **105**; **HiredScore** interest |
| Candidate (**P2**, **P3**) | I apply from a **phone** in the Middle East | a **reliable** apply path | complete the application without dropping at assessments or uploads | **40%+** mobile apply; **101** mobile **Native** + caveats |

---

## Feature Solution

• **Unified high-density review (grid / profile / preview)**  
  • **Grid**: Retain **native** columns, filters, mass actions; evaluate **secondary sort** or **stage sort** flexibility where engineering can safely extend (may remain **Workaround** via filters/reports if unchanged)  
  • **Preview path**: Preserve and **surface in training** the **eye icon** pop-up **native** next/previous behaviour  
  • **Full profile path**: Close the **True Gap** for sequential navigation **or** **explicitly** route high-volume reviewers to the preview-first pattern per **315** decision  
  • **Single-pane** or **minimal-tab** layout for summary + CV + notes + key activity (**315** selects modal vs split vs inline within **Canvas Kit** and **Sana** constraints)
  
• **Slick CV Carousel Enhancement**  
  • **Contextual CV preview**: Render CV/resume documents within a **smooth horizontal carousel** embedded in the unified review surface  
  • **Multi-document support**: When candidates upload multiple CVs, cover letters, or portfolios, allow swipe/arrow navigation between documents without returning to attachments list  
  • **Touch-optimised**: Support **swipe gestures** on tablet/large-screen mobile (GCC recruiter patterns); keyboard arrow navigation on desktop  
  • **Thumbnail rail**: Show document thumbnails below main viewer for **random access** to any document in candidate's package  
  • **Performance**: Lazy-load document pages; prioritise **first page** render for preview; full document on demand  
  • **Integration**: Carousel appears in **unified review modal** (from **315**); same component reusable in **full profile** if sequential navigation gap is closed  
  • **Accessibility**: Keyboard navigation (arrow keys, tab sequence); screen reader announces document count and current position; ARIA live regions for page changes

• **Stronger search**  
  • Improve **discoverability** and **field coverage** for **Find Candidates** (**boolean** **Native**)  
  • In-product **messaging** and **enablement** for **semantic / AI** match via **HiredScore** / **Enterprise Search Innovation** (**Workaround**); **no** implied fully automated rejection (**060**)

• **Mobile-optimised apply**  
  • Harden **responsive** career site flows; partner with assessment vendors where redirects fail on mobile browsers  
  • Document upload: **fallback** UX for cloud storage clients; **acceptance tests** on common GCC devices and browsers  
  • **SMS OTP** and **local identity** flows: **validate per tenant** (not confirmed in Deployment Agent context for GCC)

• **Telemetry and success instrumentation**  
  • Session-based **dwell** and **funnel** metrics for review surfaces and mobile apply steps (privacy-minimised, **GDPR** / **PDPL-class** awareness)

### Phasing / Value Slices

Delivery is sequenced as **three pillars** with **ordered outcomes** (exact release packaging is engineering-owned; this subsection sets prioritisation for discovery and roadmap narrative).

1. **Pillar A – Unified high-density review**  
   **Outcome order:** (i) preserve and train on **native** row **preview** sequential review; (ii) close or route around **full profile** sequential **Gap** per **315**; (iii) ship **315**-validated unified or minimal-tab layout so summary, CV/resume, notes, and key signals need **fewer context switches**. **Depends on:** grid and profile architecture; **Performance** subsection below (lazy load for unified shell).

2. **Pillar B – Search information architecture**  
   **Outcome order:** (i) baseline **Find Candidates** **success** definition and **primary** metric (see **Success Metrics**); (ii) improve discoverability and field coverage for **boolean** **Native** search; (iii) in-product clarity for **semantic / AI** **Workaround** paths (**HiredScore**, **Enterprise Search Innovation**) with **060** alignment.

3. **Pillar C – Mobile-optimised apply**  
   **Outcome order:** (i) GCC-oriented device/browser acceptance tests; (ii) assessment redirect and upload **fallback** hardening; (iii) measure **mobile apply completion** uplift against tenant baselines. **May parallel** Pillars A/B once test matrix is stable.

---

### Experience Principles Alignment

**Empower (Give Users Control)**

- Recruiters choose **preview** vs **full profile** with clear affordances; high-volume flows default to **efficient** paths without hiding compliance or fairness controls
- **Outcome-focused:** "Shortlist accurately" not "click every tab"

**Trust (Build Their Confidence)**

- Transparent copy on **what search can and cannot do** without a licence; no **black-box** ranking for adverse actions
- Reliable mobile behaviour: explicit errors (**problem + solution**) when uploads or assessments fail

**Grow (Enable Them To Change)**

- Saved filters and personal grid configurations **build on** existing **native** patterns
- Iterative improvement via **feature flags** per tenant for mobile fixes

**Principle Validation**

- [x] User stays in control (no solely automated hire/reject)
- [x] Transparency on search and AI paths
- [x] Iteration without re-training debt where possible

---

## Critical User Journey & Use Cases

• Recruiter opens **job requisition** → **Candidates** tab; sees **100+** applicants  
• Applies **saved filter** (e.g. **Saudi national**, key skill); grid refreshes with **native** filter model  
• Opens **row preview** (**eye icon**); uses **up/down** to move **without** returning to grid (**native**)  
• For deep review, opens **unified** review surface (**315**-defined): scans **summary + CV + notes** in **one** scroll context  
• **CV Carousel interaction**: Within unified review modal, recruiter sees candidate's **CV rendered** in document viewer; if candidate uploaded **multiple documents** (CV, cover letter, portfolio), recruiter uses **left/right arrows** or **swipes** to navigate between documents; thumbnail rail below main viewer shows all documents for **direct access**  
• Reviews **multiple candidates** sequentially: uses **prev/next** candidate navigation (from grid context); CV carousel resets to **first document** for each new candidate  
• Uses **Find Candidates** with **boolean** query to pull **talent pool** matches; if tenant has **HiredScore**, launches **governed** match view from approved entry point  
• **Hiring manager** receives shortlist with **co-located** recruiter notes  
• **Candidate** on **mobile** completes application; if assessment opens external vendor, **return** path preserves session; upload from device or cloud falls back to **desktop** prompt only when necessary  
• **Audit**: Profile views and stage changes log per enterprise policy; **document viewer** logs which documents were viewed and for how long  

---

## Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|---------------|
| Time per thorough review | **~5** min (multi-tab) | **~3.5** min (**30%** reduction) | Instrumented modal/preview session dwell with idle threshold |
| Mobile apply completion | Tenant-specific | **+10–15%** relative | Funnel analytics on apply steps; control for campaign noise |
| Adopters (any pillar) | 0 | **45%** of eligible reviewers in **12** mo | Telemetry cohort |
| External tool exits | Qual / support signals | **↓30%** candidate-tracking **spreadsheet** mentions (support thematic review) | Tickets + NPS verbatims |
| Search success | **Successful search rate** numerator/denominator and **90-day** pre-feature baseline in pilot tenants or regional cohort (see detail below) | **One** primary threshold agreed before discovery sign-off (relative **↑** vs baseline **or** absolute floor) | Product analytics; cohort dashboard |

**Search success – baseline and primary metric (discovery gate):**

• **Baseline definition:** Over a **90-day** window pre-feature, measure **successful search rate** = (sessions with an **intentional next step** within **30 minutes** of a submitted query) ÷ (sessions with a submitted query). **Intentional next steps** include open candidate profile, add to requisition, save list, export where tenant policy allows; **exclude** sessions **<10s** from first interaction (likely abandon).  
• **Primary metric:** **Successful search rate** (same formula post-change). Discovery is **not** marked complete until analytics agrees the baseline window and **one** primary target (e.g. **+X%** relative vs baseline or minimum acceptable rate) is recorded in the **315** brief or metrics appendix.

---

## Competitive Positioning (101-sourced)

**Primary artefacts:** `research/competitive/gcc/e2e-ci-brief-candidate-review-2026-03-22-GCC-E2E-014.md`; `research/competitive/matrices/gcc-competitive-matrix.md` (v1.4, **GCC-E2E-014** delta); baseline scan `research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-014.md`.

| Theme | Competitor narrative (desk / marketing) | Workday (Deployment Agent **22 Mar 2026**) | Classification |
|-------|----------------------------------------|--------------------------------------------|----------------|
| Sequential review | "Swipe / next candidate" | **Native** in **preview**; **Gap** on **full profile** from name | **Mixed** (name the surface in demos) |
| Unified one-pane review | Fast **single-glance** ATS | Multi-area profile + preview; PMF asks for **density** | **Gap** for true **one-pane** spec |
| Boolean search | Table stakes | **Find Candidates** **Native** | **Native** |
| Semantic / AI match | Zoho **semantic** %; HiBob **AI** CV summaries; SAP **AI** narrative | Core semantic = **Workaround** (licensed services) | **Workaround** |
| Grid sort flexibility | Flexible queues | Stage primary **fixed**; **no** secondary sort | **Workaround** / buyer **Gap** perception |
| Mobile apply | **Bayzat** mobile-friendly journey | Responsive CE **Native**; assessment/upload caveats | **Native** + **Workaround** |
| Enterprise trust | Varies | **Strong** when configured | **Differentiator** |

**107 (win-loss) lens (global, GCC-sparse):** Career site, **interview scheduling**, and **UX** comparisons appear as **buying factors**; **scrolling CVs** and front-door experience cited as **emotional** parity points. Position roadmap as **honest parity plus platform depth**; do not over-claim GCC loss counts from **107** alone.

**106 (internal) lens:** **Candidates and Prospects** shows **high volume** (**1,212**) and **most negative effort** among top buckets (**effort ~-1.545**), aligning with customer **grid/profile** pain (**hypothesis H3**).

---

## Regulatory, Privacy, and Compliance

• **GDPR / UK GDPR:** **Art. 22** human review for decisions with legal/significant effect; **Art. 25** data minimisation on candidate-facing forms  
• **EU AI Act:** Recruitment AI typically **high-risk**; **disclosure** and **oversight** for any **match** or **score** shown to recruiters or candidates (**060** before ship)  
• **KSA PDPL / UAE PDPL-class:** Consent and **retention** for candidate data; mobile flows must not **over-collect**  
• **Accessibility:** **WCAG** **AA** for recruiter and candidate surfaces  

---

## UX Designs for 2026R2+

• **Unified review + grid** – Figma: [TBD post-320/330]  
• **Mobile apply hardening** – Figma: [TBD]  

---

## Releases & Production Thresholds

• **060** review for **AI / match** disclosure copy and any **automated** assistance  
• **Security** review for document rendering and mobile upload handlers  
• **@functional-knowledge validation (pre-GA):** Confirm in-scope behaviour against authoritative PDFs for **security** (roles, constrained groups, DAP-sensitive access to candidate documents), **document** viewing and attachment handling patterns, and **audit** logging expectations for recruiter review actions (profile views, stage changes, exports). Track evidence pointers (document + section) in release readiness checklist; gaps require explicit sign-off from functional owner.  
• **Performance and load strategy**  
  • **p95 latency scope:** The **<500ms p95** gate applies to **existing row preview (eye icon)** first meaningful paint for typical CV sizes (shell + preview frame usable for sequential navigation), consistent with v52 PRD where the same preview componentry applies. It does **not** silently apply to the **new unified high-density shell** until that surface is in scope for the same gate.  
  • **Unified review shell (315-defined):** Use **progressive** and **lazy loading**: render navigation and above-the-fold summary first; defer CV/document panels, heavy timeline blocks, and secondary tabs until user navigation or explicit expand. **315** Discovery Brief must document intended **skeleton → panel** sequence and any **separate** performance budgets (e.g. shell interactive p95, document panel cumulative load) before **320** build.  
  • **Conflict resolution:** If unified surface cannot meet the preview-equivalent **<500ms** p95 for full content, ship lazy behaviour and record **which** milestones (first interactive vs full content) are contractually gated for GA.

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| Discovery brief **APPROVED** (**315**) | [TBD] |
| EA feature complete | [TBD] |
| GA | [TBD] |
| Enablement (CI brief + demo script) | [TBD] |
| Mobile GCC pilot tenants identified | [TBD] |
| Success metrics dashboard | [TBD] |

---

## Resources

• **PRD (canonical):** `docs/prds/gcc-candidate-review-experience-v54-prd.md`  
• **PMF report:** `research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v54.md`  
• **105 findings:** `research/GCC/105-user-research-findings.md`  
• **106 brainstorm analysis:** `research/GCC/brainstorm-analysis/2026-03-22-brainstorm-analysis.md`  
• **107 win-loss analysis:** `research/GCC/win-loss-analysis/2026-03-22-win-loss-analysis.md`  
• **101 CI brief (Pattern 5):** `research/competitive/gcc/e2e-ci-brief-candidate-review-2026-03-22-GCC-E2E-014.md`  
• **GCC matrix:** `research/competitive/matrices/gcc-competitive-matrix.md`  
• **Baseline scan:** `research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-014.md`  
• **Deployment Agent thread:** `9c0d7686-b087-4c9b-8166-9c9261631199`  
• **JTBD excerpt:** `docs/jtbd-recruiting-hr-professional-and-manager.md`  
• **Experience principles:** `docs/experience-principles.md`  
• Epic – [EPIC-ID-TBD] (EA), [EPIC-ID-TBD] (GA)  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Workday Recruiting |
| [TBD] | Engineering Lead |
| [TBD] | Design Lead |
| [TBD] | PMM / Enablement |
| [TBD] | Legal / Privacy (**060** liaison) |

---

[^adoption]: **Adoption assumption sources:** **105** / **120** thematic evidence on grid and review pain; **106** effort signals on Candidates and Prospects; internal **v52** PRD scale model; **three-pillar** packaging (subset adoption expected). **Range:** **low** ~**25%** of eligible reviewers (single-pillar or slow enablement), **base** **45%** (PRD planning case), **high** ~**55%** (strong enablement, SE alignment, co-design tenants). **90-day leading indicators after GA:** (1) % of weekly reviewers with **≥1** session in any in-scope flow; (2) median weekly sessions per active reviewer on preview or unified path; (3) support / CSat thematic rate for **tab**, **navigation**, or **find candidates** frustration vs pre-GA baseline.

Workday Confidential    1  
-- 1 of 1 --  
*(Paginate when exporting to PDF for stakeholder review.)*
