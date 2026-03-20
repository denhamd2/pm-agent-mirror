# GCC Candidate Grid, Search, and AI-Assisted Matching (2026R2)
Product Requirements Document  
March 2026

## Executive Summary

GCC PMF research (v40, MISSION-017 HITL **#6**) surfaces strong recruiter pain on the **candidate grid and search**: multi-tab navigation slows review, **boolean search** feels weaker than external tools, and recruiters want **database-wide matching** to the active requisition (“who in our talent pool fits this req?”) without losing human control. P2 (Baker Hughes) leads on grid and search friction; P1 (Accenture) relates workflow delays when moving candidates and reviewing pipeline context.

This PRD defines **Recruiting** enhancements for **high-volume GCC** customers: a **unified candidate summary view** (fewer context switches), **stronger search** (documented boolean operators, field scoping, saved searches), and **AI-assisted match suggestions** with **mandatory recruiter review** (EU AI Act high-risk alignment, GDPR Art. 22 transparency). Scope is **global** with **GCC** as the primary commercial driver; no change to Broadbean job board strategy.

**Research:** `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v40.md` (Theme 6)  
**Discovery brief:** `design/gcc-candidate-grid-search-discovery-brief.md`  
**Prototype:** `design/gcc-candidate-grid-search.tsx` (localhost `http://localhost:5199/`)

**Epic:** *(created in Jira during backlog step — link appended in MISSION_LOG)*

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core problem** | Recruiters spend excessive time switching tabs on the candidate profile, export to Excel/PowerBI for views Workday does not surface in one place, and struggle to express precise searches. They want faster “at a glance” review and optional AI-ranked suggestions that **do not** auto-advance or auto-reject candidates. |
| **How is it done today?** | Multiple tabs per candidate, manual exports, ad hoc spreadsheets, and sometimes external sourcing tools for boolean queries. AI matching, where used, must stay advisory. |
| **How is our approach different?** | Native **unified row** layout option; **in-product** boolean syntax help and scoped fields; **transparent** AI match panel with audit-friendly rationale snippets and explicit recruiter actions. |
| **Outcomes** | Reduce time-to-shortlist per req; increase in-product search adoption; maintain compliance posture for AI-assisted ranking (human oversight, no solely automated hiring decisions). |

### Audience / personas

- **Primary:** GCC recruiter (high-volume reqs, multi-country pipelines)  
- **Secondary:** Recruiting operations (search templates, reporting on usage)  
- **Tertiary:** Compliance / legal reviewers (AI disclosure, logging)

---

## Feature solution

• **Unified candidate summary (optional layout)** — Dense single-surface summary for pipeline review on requisition context (stage, key skills, location, last touchpoint) with link-through to full profile  
• **Boolean search upgrade** — Supported operators (AND, OR, NOT, phrases), field scoping where available, inline syntax reference, query validation messages  
• **Saved searches & quick filters** — Recruiter-saved queries for repeat hiring (e.g. “GCC national + Arabic + IC3”)  
• **AI-assisted match suggestions** — Ranked suggestions **for review only**; recruiter adds to pipeline or dismisses; system logs suggestion and action for audit  
• **Transparency** — Candidate- and recruiter-facing disclosure where AI influences ordering; no auto-stage movement from AI alone  
• **Performance** — Pagination / virtualisation for large candidate sets; targets to be set with engineering

---

## Critical user journeys

**UJ1: Review candidates on a req in unified view**  
Recruiter opens requisition → Candidates → selects **Unified summary** → scans table → opens full profile only when needed.

**UJ2: Run a boolean search across the database**  
Recruiter opens Find candidates → enters boolean query → sees validation or results → saves search for reuse.

**UJ3: Request AI match suggestions for this req**  
Recruiter clicks **Get suggestions** → reviews ranked list with short rationale → **Add to pipeline** or **Not a fit** (logged).

---

## UX designs for 2026R2

• **Requisition — Candidates (unified summary)** — [Figma TBD after 330 capture]  
• **Find candidates — Boolean syntax reference** — [Figma TBD]  
• **AI suggestions panel (human review)** — [Figma TBD]

---

## Releases and production thresholds

• **Legal / product:** AI-assisted matching treated as **high-risk** under EU AI Act (recruitment); human oversight, logging, and transparency required  
• **GDPR:** Art. 22 — no solely automated decisions with legal/significant effect; clear recruiter actions  
• **Accessibility:** WCAG AA for grid, search, and suggestion panel

---

## Target delivery and major milestones

| Milestone | Target |
|-----------|--------|
| PRD approval | Q2 2026 |
| UX / prototype sign-off | Q2 2026 |
| VS1 engineering | Q3 2026 |
| Controlled preview (select GCC tenants) | Q4 2026 |
| GA | 2027R1 (indicative) |

---

## Resources

• PMF v40: `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v40.md`  
• Customer evidence: Theme 6 — P2 primary on grid/search; P1 related workflow friction  
• JTBD: `docs/jtbd-recruiting-hr-professional-and-manager.md` — *Manage candidates throughout the recruiting process*; *Source high quality candidates for active job requisitions*

---

## Contacts

| Name | Role |
|------|------|
| David Denham | Sr. Product Manager |
| TBD | Recruiting PM lead |
| TBD | Engineering lead |

---

*Workday Confidential*
