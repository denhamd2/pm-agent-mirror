# GCC Candidate Grid Redesign — Unified Profile Experience (2026R2)
Product Requirements Document  
March 2026

## Executive Summary

Workday is uniquely positioned to reduce recruiter time-on-task in **Requisition → Candidates** by replacing fragmented **multi-tab profile review** with a **unified candidate profile surface** optimised for triage. GCC PMF research (**v42**, GCC-E2E-003 HITL **#2**) reinforces a **global** pain signal: recruiters lose **roughly 5–10 minutes per candidate** switching tabs for education, CV, notes, and history; P1 (Accenture) and P2 (Baker Hughes) are explicit on grid friction and **notes-before-screen** constraints.

For our customers, this initiative will **shortlist faster** on high-volume requisitions, **retain context** (stage, fit signal, last touchpoint) in one view, and **cut export-to-Excel workarounds** used when in-product layouts feel unreadable. Scope for this PRD is **layout and interaction redesign** (unified **modal or slide-over** with **left rail**: key details, stage, notes, fit; **right pane**: resume / CV preview), not a net-new search engine or mandatory AI ranking (those remain adjacent backlog items; see `gcc-candidate-grid-search-prd.md`).

For Workday, this initiative will **defend Recruiting NPS in GCC and enterprise high-volume segments**, **increase in-product dwell** versus external tools, and **de-risk compliance** by keeping review and decisions **explicitly human-led** in the UI.

**Research:** `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v42.md` (Theme: Candidate Grid Complexity Tax; E2E #2)  
**Discovery brief:** `design/gcc-candidate-grid-redesign-v42-discovery-brief.md`  
**Prototype:** `design/gcc-candidate-grid-search.tsx` (concept; mount via `design/main.tsx` for capture)

**Related (broader):** `docs/prds/gcc-candidate-grid-search-prd.md` (MISSION-017 — boolean + AI suggestions)

**Epic:** [HRREC-90976](https://jira2.workday.com/browse/HRREC-90976)

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core problem** | Recruiters review dozens to hundreds of applicants per requisition. Today, **disconnected tabs** force repeated navigation; some workflows **block notes** until a candidate reaches a specific stage, slowing legitimate triage. The **cognitive load** drives fatigue and pushes work into spreadsheets. |
| **How is it done today?** | Tabbed candidate profile, manual tracking of “what I already read”, occasional exports; recruiting leads may **reassign themselves to reqs** just to move candidates (P1). |
| **How is our approach uniquely different from others?** | • **Single triage surface** with persistent **stage** and **key facts** visible alongside resume<br>• **Native Workday** pattern — no new vendor for core review<br>• **Configurable depth** — summary first, deep profile on demand<br>• **Accessibility** — keyboard **prev/next** across candidates in queue (where supported) |
| **What customer benefits and value does our solution deliver?** | **Year 1 forecast (indicative):**<br>• Adoption: recruiters on **high-volume reqs** in GCC + global enterprise<br>• Outcome: reduce **minutes per candidate reviewed**; target set with UX research post-prototype<br>**Strategic outcomes:**<br>1. Faster time-to-shortlist<br>2. Fewer context switches and mis-clicks<br>3. Stronger alignment with **Sana** density and readability goals |

### Audience / personas

- **Primary:** Recruiter (GCC and global high-volume)  
- **Secondary:** Recruiting lead / coordinator  
- **Tertiary:** TA ops (layout defaults, permissions)

---

## Feature solution

• **Unified candidate review panel** — Opening a candidate from the req grid launches a **large modal or slide-over** (prototype pattern) with **two columns**: **left** — identity, stage, location, skills summary, **recruiter notes** (including **before-screen** where policy allows), last activity; **right** — **resume / CV** text preview (scrollable)  
• **Prev / next in queue** — From the panel, move to adjacent candidates on the **current filtered grid** without returning to the table (keyboard and control affordances)  
• **Grid remains hero** — Table sort/filter unchanged at MVP concept level; panel is **additive**  
• **Optional “compact row” density** — Future: row layout that surfaces more fields without opening panel (out of scope for prototype beyond labels)  
• **Explicit non-goals (this PRD)** — Boolean query language redesign; automated AI ranking; auto stage changes

---

## Critical user journeys

**UJ1: Triage candidates on a requisition**  
Recruiter opens **Job requisition → Candidates** → clicks candidate → **unified panel** → reads left context + right resume → adds note → **Next** → repeats.

**UJ2: Compare adjacent candidates quickly**  
Recruiter uses **prev/next** within panel to walk the shortlist queue without closing the surface.

**UJ3: Return to grid**  
Recruiter closes panel; grid scroll position and filters preserved (concept: `design` prototype simulates with state).

---

## UX designs for 2026R2

• **Requisition — Candidates — Unified review panel** — Figma after 330 capture  
• **Keyboard patterns** — Documented in discovery brief

---

## Releases and production thresholds

• **Permissions:** Notes and stage actions respect **existing** Recruiting security domains  
• **Accessibility:** WCAG AA for panel focus order, escape to close, prev/next  
• **Data minimisation:** Left rail shows **job-relevant** fields only; no new special-category fields in this PRD

---

## Target delivery and major milestones

| Milestone | Target |
|-----------|--------|
| PRD / discovery sign-off | Q2 2026 |
| Engineering sizing | Q2 2026 |
| Preview tenant (select) | Q4 2026 (indicative) |
| GA | TBD with eng capacity |

---

## Resources

• PMF v42: `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v42.md`  
• JTBD: `docs/jtbd-recruiting-hr-professional-and-manager.md` — *Progress candidates through the stages of the pipeline as efficiently as possible*

---

## Contacts

| Name | Role |
|------|------|
| David Denham | Sr. Product Manager |

---

*Workday Confidential*
