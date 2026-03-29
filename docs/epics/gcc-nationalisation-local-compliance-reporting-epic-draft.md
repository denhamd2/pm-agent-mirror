# Epic draft: Native GCC nationalisation and local compliance reporting

**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).  
**Pipeline:** GCC E2E (backlog step 410).

## Epic summary (for Jira Summary field)

Native GCC nationalisation tracking, dashboards, and offer-stage compliance signals (KSA and UAE v1)

## User story

As a GCC talent acquisition lead managing Saudization, Nitaqat, or Emiratisation obligations  
I want governed nationalisation data, real-time quota and pipeline views, and clear offer-stage warnings (with optional blocks where legally and operationally approved)  
So that we reduce manual spreadsheet reconciliation, surface quota risk before irreversible offer steps, and improve defensible reporting to leadership and authorities without mis-stating statutory automation

## Jira-ready description

Paste body for Jira epic description (markdown):

**User story**

As a GCC talent acquisition lead managing Saudization, Nitaqat, or Emiratisation obligations, I want governed nationalisation data, real-time quota and pipeline views, and clear offer-stage warnings (with optional blocks where legally and operationally approved), so that we reduce manual spreadsheet reconciliation, surface quota risk before irreversible offer steps, and improve defensible reporting to leadership and authorities without mis-stating statutory automation.

**PRD (canonical):** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`

**Problem**

GCC recruiters and HR leaders must track and report nationalisation quotas during hiring, not only after hire. Today they rely on custom fields, calculated fields, and external spreadsheets, which increases compliance risk, slows offers, and weakens franchise and low-volume roll-ups.

**Scope (version one)**

- Country and programme packs with **KSA** and **UAE** as the v1 minimum; pre-modelled nationalisation concepts and configurable rules (customer retains legal interpretation of statutory bands).
- Native tracking of nationality- and residency-relevant attributes across **candidates, applications, and hire handoff**, aligned with existing Core patterns post-hire where applicable.
- **Real-time quota and composition dashboards** at agreed levels (for example legal entity, supervisory organisation, location, requisition portfolio) with counts, percentages, and trends against **customer-maintained** targets and thresholds.
- **Offer-stage evaluation**: informational, warning, and (where configured and safeguarded) **block** behaviours; v1 should **bias to warn + audit** unless the tenant explicitly configures block with governance. Hard blocks require Legal-approved messaging, documented override with approver accountability, and candidate or employee transparency alignment.
- **Audit trail** for views or changes to compliance classifications, thresholds, and offer decisions linked to warnings or overrides.
- **Role-based security** and minimisation of sensitive attributes in high-traffic recruiter surfaces.
- **Exports** (for example CSV or XLSX) to support **customer-operated** manual filing; **no** automated submission to government portals in v1.
- **Administrator experience** to activate packs, map organisations to programmes, set targets and effective dates, and apply approved overrides with audit.

**Explicitly out of scope (version one)**

- Direct **API integration** with **Qiwa**, **Mudad**, or other government endpoints for automated exchange (reserved for a subsequent release; v1 may define export layouts that ease manual upload only).

**Personas**

- **Primary:** HR Professional / talent acquisition lead (GCC).  
- **Secondary:** HR or people analytics / COE partner (quota models, cadence, methodology).  
- **Tertiary:** Hiring manager on GCC-facing requisitions (minimal, outcome-oriented signals).

**Success criteria (from PRD)**

- **Adoption:** 10 GCC enterprise customers live on native nationalisation reporting within 6 months of GA (customer count).  
- **Efficiency:** ~30% reduction in time spent compiling nationalisation compliance reports among adopters (baseline vs post-implementation methodology per CS).  
- **Quality / risk:** Zero quota miscalculation incidents attributed to Workday-native calculations for the early adopter cohort during the initial 12-month observation window (defined with Legal and DPIA context).  
- **Compliance readiness:** DPIA or regional equivalent completed before GA where Legal mandates it for design-partner and GA-blocking cohorts (target 100% where mandated).

**Related research (supporting)**

- PMF thematic analysis: `research/GCC/thematic-analysis/2026-03-28-GCC-PMF-Analysis-GCC-E2E-031.md`  
- Competitive scan: `research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-031.md`  
- Competitive matrix: `research/competitive/matrices/gcc-competitive-matrix.md`

**Functional context (Workday)**

This epic extends **Recruiting** and **Core** identity and reporting patterns (nationality, government ID where used) and must align with **security**, **retention and purge** (Recruiting Data Purge functional overview), and **offer** workflows (Offer and Employment Agreement functional overview) without introducing sole automated hiring decisions.

## Notes for story mapping

- **420** should preserve an **end-to-end walking skeleton** in VS1: activate pack → see pipeline or req-level composition → reach offer with a visible compliance outcome → export or executive view → audit evidence. Split heavy **admin configuration**, **security tiers**, and **analytics depth** across VS2 or VS3 as needed.
- **Compliance and Legal (060):** Nationality and derived classifications are **high-sensitivity**; stories must allow **319** + **060** on block, override, privacy notice hooks, and export warnings. **DPIA** before GA is a **release readiness** theme, not a single UI story unless productised.
- **Discrimination and UX:** Do not default to protected-characteristic filters for exclusion; flag any grid or filter stories for counsel review in AC.
- **Data and retention:** Align new audit and configuration artefacts with the PRD **retention and purge matrix**; call out dependencies on existing candidate or worker purge behaviour.
- **Open questions (PRD):** Additional GCC countries beyond KSA and UAE, Nitaqat or MOHRE band depth (product vs customer tables), Prism vs standalone analytics, franchise or multinational roll-up boundaries, default warn vs block by segment, export field minimisation vs authority templates — capture spikes or placeholders in the map where they affect sequencing.
- **430 defaults (when epic is created):** Project **HRREC**, issue type **Epic**, component **Recruiting Purge**, assignee **David Denham** (per workspace convention).

---

**Handoff:** Epic draft path for **420-story-mapping:** `docs/epics/gcc-nationalisation-local-compliance-reporting-epic-draft.md`  
**Proposed Jira epic title:** same as **Epic summary** above.
