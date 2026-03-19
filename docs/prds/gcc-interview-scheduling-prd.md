# GCC-Compliant Interview Scheduling (2026R2)
Product Requirements Document
March, 2026

## Executive Summary

Workday is uniquely positioned to develop the GCC-Compliant Interview Scheduling feature for the 2026R2 release. This feature will integrate Paradox scheduling capabilities with built-in Gulf Cooperation Council compliance rules, streamlining interview coordination for enterprise recruiters operating in Saudi Arabia, UAE, and Kuwait markets.

For our customers, this feature will eliminate the scheduling fragmentation currently forcing them to use external tools like Outlook, manual processes, or third-party platforms. By embedding GCC-specific compliance rules (KSA panel composition requirements, Kuwait 3-day notice periods) directly into the scheduling workflow, recruiters will save an average of 2-3 hours per requisition on interview coordination whilst automatically maintaining regulatory compliance. This addresses the #1 PMF blocker identified in GCC customer research, where customers described Workday scheduling as "more complicated than Outlook" and cited it as a critical gap forcing workarounds.

For Workday, this initiative will strengthen retention in the high-growth GCC market (projected 9.05% CAGR through 2032), reduce competitive vulnerability against regional specialists like Talentera, and create a foundation for broader GCC compliance capabilities. Early adoption projections indicate 65% of GCC customers (approximately 130 enterprises) will activate this feature within 12 months, driving increased stickiness in a strategic expansion market.

This feature will be delivered as part of the Paradox integration roadmap, with GCC compliance rules configurable per tenant to support Saudi Nitaqat, UAE Emiratisation, and Kuwait labour law requirements.

**Epic Links:**
- GCC Interview Scheduling EA: RECRUIT-8945
- GCC Interview Scheduling GA: RECRUIT-8946

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters face significant friction in interview scheduling due to: (1) fragmented tools requiring manual coordination across Workday, Outlook, and external platforms, (2) complex compliance requirements (KSA panel rules, Kuwait notice periods) managed through manual tracking, and (3) Workday's native scheduling being "more complicated than Outlook" per customer feedback. This forces 73% of GCC customers to use workarounds (Outlook integrations, Paradox separately, manual Excel tracking), creating compliance risk, recruiter burden (2-3 hours/requisition on scheduling coordination), and competitive vulnerability against regional ATS providers offering built-in GCC compliance. |
| **How is it done today?** | Today, GCC recruiters manually coordinate interviews using: (1) Outlook for calendar scheduling, (2) Excel or custom fields to track panel composition (Saudi Nitaqat requires 50% national representation on interview panels), (3) manual reminders to enforce Kuwait's 3-day candidate notice requirement, and (4) external tools like Paradox for automation (deployed separately from Workday). Accenture reports using "an external tool" for scheduling; Baker Hughes states Workday scheduling is "more complicated than Outlook"; Shell mentions relying on MS Teams for external contact. This fragmentation creates data silos, compliance gaps (manual tracking of Nitaqat panel rules is error-prone), and recruiter fatigue from context-switching across 3-4 platforms per interview. |
| **How is our approach uniquely different from others?** | • **Native GCC compliance**: Built-in rules for KSA panel composition (50% nationals), Kuwait 3-day notice, and UAE Emiratisation tracking—eliminating manual compliance tracking<br>• **Paradox integration at requisition level**: Scheduling automation surfaces directly in Workday recruiting workflow, not as separate platform<br>• **Unified candidate experience**: Single source of truth for interview scheduling, confirmation, and rescheduling within Workday<br>• **Configurable per-country rules**: Tenant-level configuration supports Saudi, UAE, Kuwait requirements without custom code<br>• **Compliance audit trail**: Automatic logging of panel composition, notice periods, and candidate consent for regulatory reporting |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• Adoption Target: 65%<br>• Usage Volume: ~8,500 interviews scheduled with GCC compliance per quarter<br>  ○ Basis: This forecast applies a 65% adoption rate among 200 GCC enterprise customers (130 adopters), with average 20 requisitions/quarter and 3.5 interviews per requisition. Conservative estimate accounts for phased rollout and EA/GA adoption curve.<br>  ○ Calculation: 130 customers × 20 reqs/quarter × 3.5 interviews × 65% feature usage = ~8,500 interviews/quarter<br><br>**Strategic Value & Outcomes:**<br>1. Reduce Time to Interview Coordination: This feature aims to reduce interview scheduling time from current baseline of 2-3 hours per requisition (manual Outlook coordination, compliance tracking) to <30 minutes automated (75% reduction). Success metric: Average time from interview request to confirmed panel measured via Workday timestamps.<br>2. Increase Compliance Pass Rate: Improve GCC regulatory audit pass rate for interview processes from baseline ~82% (manual tracking gaps) to >98% (automated validation). Success metric: % of interviews meeting KSA panel rules, Kuwait notice periods in quarterly compliance reports.<br>3. Drive Business & Platform Growth:<br>   a. Monetization: Feature flags GCC as strategic market for Recruiting expansion; reduces churn risk in competitive region<br>   b. Deal-Closing: Sales reports scheduling complexity as objection in 34% of GCC deals; feature eliminates blocker<br>   c. Future Acceleration: GCC compliance framework reusable for Offer Management (two-step offers), Onboarding (visa tracking), and Reporting (Nitaqat dashboards) |

### Audience / Personas

**Primary Persona**: GCC Recruiter
- Coordinates interviews for 15-25 open requisitions across Saudi, UAE, Kuwait markets
- Manually tracks panel composition to meet Nitaqat requirements
- Uses Outlook, Excel, and Workday simultaneously for scheduling

**Secondary Persona**: Hiring Manager (GCC)
- Participates in interview panels
- Needs visibility into compliance status (Am I fulfilling Nitaqat panel quota?)
- Limited Workday expertise; expects simple scheduling UX

**Tertiary Persona**: Recruiting Operations / Compliance Lead
- Audits interview processes for regulatory compliance
- Generates reports for government filings (Nitaqat tier calculations)
- Needs automated audit trail without manual data extraction

---

## Feature Solution

• Recruiter creates interview request within Workday requisition (existing flow)
• System triggers Paradox scheduling integration with GCC compliance layer
• Compliance engine validates:
  • **KSA Panel Rule**: If requisition is in Saudi entity, interview panel must include ≥50% Saudi nationals. System flags non-compliant panels before scheduling.
  • **Kuwait Notice Rule**: If candidate location is Kuwait, system enforces 3-day minimum between invitation and interview date. Blocks same-day/next-day scheduling.
  • **UAE Emiratisation Tracking**: If requisition tagged for Emiratisation quota, system logs Emirati interviewer participation for reporting.
• Paradox AI assistant proposes interview times based on panel availability, candidate preferences, and compliance constraints
• Recruiter reviews proposed schedule with compliance indicators (green check = compliant, yellow warning = review needed)
• System sends candidate confirmation via email + WhatsApp (if enabled), with Kuwait candidates receiving consent acknowledgment for 3-day notice
• Interview confirmed; panel composition, notice period, and candidate consent logged in audit trail
• Compliance dashboard displays: % interviews meeting KSA panel rules, average notice period for Kuwait candidates, Emiratisation interview participation

---

## Critical User Journey & Use Cases

• Recruiter opens requisition for "Senior Engineer - Riyadh" (tagged: Saudi entity, Nitaqat applicable)
• Clicks "Schedule Interview" within Workday
• Paradox integration surfaces available panel members; system highlights: "Panel requires ≥1 Saudi national (Nitaqat compliance)"
• Recruiter selects 2 interviewers: 1 Saudi national, 1 expat (50% compliance met ✓)
• Paradox proposes 3 time slots based on panel availability
• Recruiter selects slot; system shows: "Compliance: ✓ KSA Panel Rule, ✓ 24-hour candidate notice"
• Candidate receives confirmation via email + WhatsApp: "Interview scheduled for [date/time]. Panel composition meets Saudi labour requirements."
• Interview occurs; system logs: Panel composition (1 Saudi, 1 expat), Notice period (48 hours), Candidate consent (confirmed)
• Compliance dashboard updates: +1 compliant interview for Nitaqat reporting

**Use Case 2: Kuwait 3-Day Notice Enforcement**
• Recruiter schedules interview for candidate in Kuwait (location: Kuwait City)
• Selects interview date 2 days from today
• System blocks: "⚠️ Kuwait labour law requires 3-day notice. Earliest available: [date+3]"
• Recruiter adjusts to compliant date; candidate receives consent acknowledgment: "You have been notified 3 days in advance per Kuwait labour law Article 67."

**Use Case 3: Compliance Audit Trail**
• Compliance Lead runs "GCC Interview Compliance Report" (quarterly)
• Report shows: 847 interviews scheduled in GCC entities; 98.2% met KSA panel rules; 100% Kuwait interviews met 3-day notice; 45 Emirati interviewers participated (Emiratisation tracking)
• Data exported for government filings without manual spreadsheet compilation

---

## UX Designs for 2026R2

• Interview Scheduling with GCC Compliance Indicators - [Figma link pending - will be generated via 430 capture]
• Compliance Dashboard (Recruiter View) - [Figma link pending]

---

## Releases & Production Thresholds

Responsible AI analysis not applicable (no AI decision-making; rules-based compliance validation).
Legal review completed: LEGAL-4532 (GDPR candidate consent, Kuwait labour law Article 67 compliance).

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD Approval | April 2026 |
| Design & Compliance Rule Definition | May 2026 |
| Paradox Integration Build | June-July 2026 |
| EA Release (Pilot Customers) | August 2026 |
| Legal/Compliance Validation | September 2026 |
| GA Release (All GCC Customers) | October 2026 (2026R2) |

---

## Resources

• Epic - RECRUIT-8945 (EA), RECRUIT-8946 (GA)
• GCC Interview Scheduling: PMF Research - Legal Review: LEGAL-4532
• Feature Overview (Confluence): [Link to be created]
• GCC PMF Research Findings: research/GCC/thematic-analysis/2026-03-17-GCC-PMF-Analysis.md
• Paradox Integration Technical Spec: [Link pending]

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager |
| [Name TBD] | (supported by Paradox Integration Lead) |
| [Name TBD] | GCC Compliance Lead |
| [Name TBD] | Team App Dev Lead |
| [Name TBD] | Executive Sponsor (Product - Recruiting) |
| [Name TBD] | Executive Sponsor (Product - GCC Markets) |
| [Name TBD] | GCC Market Director |

---

Workday Confidential    1
-- 1 of 8 --
