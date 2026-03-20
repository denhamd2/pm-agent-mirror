# GCC Recruiter Operations Dashboard (2026R2)
Product Requirements Document  
20 March 2026

## Executive Summary

GCC PMF research **v41** (MISSION-017 follow-on **#7**) shows customers **abandoning native Workday dashboards** for **PowerBI and Excel** because they cannot get **granular, at-a-glance operational metrics** (time to first review, stage conversion, views by line of business, location, and management level) without exporting data. P1 (Accenture) and P3 (Shell) describe unreadable or immature native dashboards; recruiters and TA ops need **in-product** operational visibility to run daily hiring.

This PRD defines a **Recruiter operations dashboard** in **Workday Recruiting**: configurable **filters**, **KPI tiles**, **funnel / stage conversion** views, and **drill-friendly** tables that reduce reliance on external BI for standard recruiting operations. Scope is **global** with **GCC** as a key research driver; reporting remains subject to **tenant security** and **data minimisation** (GDPR).

**Research:** `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v41.md` (Theme 6 — Reporting abandonment)  
**Discovery brief:** `design/gcc-recruiter-dashboard-discovery-brief.md`  
**Prototype:** `design/gcc-recruiter-dashboard.tsx` (localhost `http://localhost:5199/`)

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core problem** | Recruiters and TA ops cannot answer operational questions (how long to first review, where candidates stall, which LOBs are hottest) inside Workday without exports. Native dashboard experiences are perceived as hard to read or insufficiently granular. |
| **How is it done today?** | Export to Excel / PowerBI; manual refresh; fragmented views. Leadership and ops lack a shared in-product picture. |
| **How is our approach different?** | **Purpose-built recruiting operations dashboard** with standard KPIs, filters aligned to how TA talks (LOB, location, level), and clear empty / loading states — without replacing enterprise BI for bespoke analytics. |
| **Outcomes** | Fewer ad-hoc exports; faster operational reviews; higher trust in in-product metrics for recruiting. |

### Audience / personas

- **Primary:** Recruiter, recruiting coordinator (daily operations)  
- **Secondary:** TA ops / recruiting manager (team and LOB views)  
- **Tertiary:** HR leadership (read-only summary — future)

---

## Feature solution

• **Filter bar** — Line of business (or business unit), location / region, management level (illustrative dimensions in prototype)  
• **KPI tiles** — e.g. median time to first review, active requisitions, candidates in pipeline, screen → interview conversion (definitions configurable in product)  
• **Stage funnel table** — Counts and conversion rates by stage (illustrative)  
• **Breakdown table** — Metrics by LOB (or similar) with trend indicator placeholders  
• **Export** — Secondary action to export **summary** (scope TBD with legal — aggregate vs row-level)  
• **Trust & compliance** — Last refreshed timestamp; role-based visibility; no PII in aggregate tiles by default  

---

## Critical user journeys

**UJ1: Morning pipeline health**  
Recruiter opens **Recruiting → Dashboard** → scans KPIs → adjusts filters → spots bottleneck stage → drills to req list (out of prototype scope — link affordance only).

**UJ2: LOB review for manager**  
Manager sets LOB filter → compares conversion vs prior period (placeholder) → exports summary for staff meeting.

---

## UX designs for 2026R2

• **Recruiting — Recruiter operations dashboard** — [Figma after 330 capture]  

---

## Releases and production thresholds

• **Security:** Dashboard obeys recruiting domain security; no cross-tenant data  
• **GDPR / minimisation:** Aggregate tiles default; row-level export requires appropriate entitlements and audit  
• **Accessibility:** WCAG AA for filters, tables, KPI text  

---

## Target delivery and major milestones

| Milestone | Target |
|-----------|--------|
| PRD approval | Q2 2026 |
| UX / prototype sign-off | Q2 2026 |
| Engineering discovery | Q3 2026 |
| Preview | Q4 2026 (indicative) |

---

## Resources

• PMF v41 thematic analysis  
• JTBD: `docs/jtbd-recruiting-hr-professional-and-manager.md` — *Progress candidates efficiently*; *Manage req health*  

---

## Contacts

| Name | Role |
|------|------|
| David Denham | Sr. Product Manager |

---

*Workday Confidential*
