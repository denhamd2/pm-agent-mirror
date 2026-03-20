# GCC Nationalization & Compliance (2026R2)
Product Requirements Document
March, 2026

## Executive Summary

Workday is uniquely positioned to deliver out-of-box (OOB) nationalization tracking for the Gulf Cooperation Council (GCC) region. Today, Workday offers OOB ethnicity and veteran status capture for US and UK, but GCC customers—facing Saudi Nitaqat, UAE Emiratisation, and Kuwait Kuwaitisation mandates—must implement custom fields and build custom reports. GCC PMF research identified this as a **regulatory blocker**: enterprise customers cannot comply without significant custom configuration, and penalties for non-compliance are material. The Nitaqat 2026–2028 phase alone localises 340,000+ jobs, escalating urgency.

For our customers, this feature will eliminate the need for custom fields and manual reporting workarounds. Recruiters will capture nationality at application, and compliance dashboards will surface nationalisation percentages against regulatory thresholds—reducing audit risk, penalty exposure, and implementation burden. P1 (Accenture) stated: "I'm liable to hit 20% Emiratisation, 60% national Saudization, 50% Kuwaitisation on my hiring... we need the ability to track throughout Workday." P2 (Baker Hughes): "Nitaqat is a key mandate... we get penalties if we don't meet certain percentage... having that built into a more out-of-box situation versus bandaids."

For Workday, this initiative will remove a critical PMF blocker in the high-growth GCC market, reduce competitive vulnerability against regional specialists (ZenHR, Talentera) offering native nationalisation tracking, and strengthen retention among enterprise customers who today rely on custom configuration. Early adoption projections indicate 65% of GCC enterprise customers will activate OOB nationalisation within 12 months of GA.

This feature will be delivered as part of the Recruiting Localisation roadmap, with Saudi, UAE, and Kuwait prioritised for initial rollout.

**Epic Links:**
- GCC Nationalization (PMF v39 E2E): [HRREC-90967](https://jira2.workday.com/browse/HRREC-90967)
- Prior epic (MISSION-008): [HRREC-90883](https://jira2.workday.com/browse/HRREC-90883)

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC employers face mandatory workforce localisation with specific quotas and penalties. Saudi Nitaqat (2026–2028 phase localises 340,000+ jobs), UAE Emiratisation, and Kuwait Kuwaitisation require employers to collect nationality at application and report compliance. Workday offers OOB capture for US/UK (ethnicity, veteran status) but not for GCC. Today, customers add nationality as a custom field and build custom reports—creating implementation burden, data governance risk, and audit gaps. P2 (Baker Hughes): "We added capturing of nationality in UAE and Saudi... as a custom field... out-of-box is only for US and UK." Non-compliance results in penalties, work permit freezes, and government contract restrictions. |
| **How is it done today?** | Today, GCC customers: (1) add nationality as a custom field on the job application or candidate profile, (2) configure Maintain Localization Settings to enable Primary Nationality for Saudi, UAE, Kuwait, (3) add Personal Information Change step to the Job Application business process to request nationality from candidates, (4) build custom Advanced reports with calculated fields to compute nationalisation percentages by organisation, and (5) export to Excel or PowerBI for leadership dashboards. This approach is fragile, not standardised, and requires significant implementation effort. Regional competitors (ZenHR, Talentera) offer native nationalisation tracking. |
| **How is our approach uniquely different from others?** | • **OOB nationalization fields**: Native capture for Saudi (Nitaqat), UAE (Emiratisation), Kuwait (Kuwaitisation) at application—no custom fields<br>• **Application capture**: Nationality requested as part of standard job application flow, aligned with country of job requisition<br>• **Compliance dashboards**: Pre-built dashboards showing nationalisation % vs regulatory thresholds (Nitaqat tiers, Emiratisation targets, Kuwaitisation quotas)<br>• **Reporting**: Standard reports for government submissions and internal audit<br>• **Enterprise scale**: Designed for Fortune 500 GCC customers with high-volume recruiting |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• Adoption Target: 65%<br>• Usage Volume: ~180 GCC enterprise customers activating OOB nationalisation<br>  ○ Basis: ~280 GCC enterprise customers × 65% adoption<br>  ○ Calculation: 280 × 0.65 ≈ 182 adopters<br><br>**Strategic Value & Outcomes:**<br>1. **Reduce Compliance Risk**: Eliminate custom-field workarounds; standardise nationality capture and reporting. Success metric: % of GCC customers using OOB vs custom fields (target: 65% OOB within 12 months).<br>2. **Reduce Implementation Burden**: Target 40% reduction in implementation effort for nationalisation compliance vs custom configuration. Success metric: Implementation hours for nationalisation setup (baseline: ~80 hours custom; target: ~48 hours OOB).<br>3. **Drive Business & Platform Growth:**<br>   a. Monetization: Reduce churn risk; customers citing "no OOB nationalisation" as deal blocker<br>   b. Deal-Closing: Sales reports nationalisation as objection in GCC deals; feature eliminates blocker<br>   c. Future Acceleration: Foundation for Qatar, Oman, Bahrain nationalisation in later releases |

### Audience / Personas

**Primary Persona**: GCC Recruiter
- Manages requisitions across Saudi, UAE, Kuwait
- Liable for nationalisation targets (e.g., 20% Emiratisation, 60% Saudization, 50% Kuwaitisation)
- Today uses custom fields or manual tracking; needs OOB capture at application

**Secondary Persona**: Recruiting Operations / Compliance Lead
- Responsible for government reporting (Nitaqat, Emiratisation, Kuwaitisation submissions)
- Needs dashboards showing nationalisation % vs thresholds
- Today builds custom reports or exports to PowerBI/Excel

**Tertiary Persona**: HR Administrator / Implementation Consultant
- Configures Workday for GCC customers
- Today spends 80+ hours on custom nationalisation setup
- Needs OOB configuration to reduce implementation effort

---

## Feature Solution

• **OOB nationalization fields**: Workday delivers native fields for Saudi (Nitaqat), UAE (Emiratisation), Kuwait (Kuwaitisation) in the candidate/worker data model—no custom fields required
• **Application capture**: Job application flow includes nationality capture when the job requisition is associated with a GCC country (Saudi Arabia, UAE, Kuwait)
• **Country-specific logic**: Each program has distinct rules (Nitaqat tiers, Emiratisation %, Kuwaitisation quotas); system surfaces the relevant field(s) based on job country
• **Compliance dashboards**: Pre-built dashboards showing:
  - Nationalisation % by supervisory organisation
  - Comparison vs regulatory thresholds (Nitaqat tier, Emiratisation target, Kuwaitisation quota)
  - Trend over time (quarterly)
  - Candidate pipeline: % nationals in application/hire funnel
• **Standard reports**: Reports for government submissions and internal audit; export to Excel/PDF
• **Configuration**: Tenant-level enable/disable per country; optional per-job or per-requisition override
• **Data governance**: Nationality data stored in Workday; audit trail for compliance reviews

---

## Critical User Journey & Use Cases

**Use Case 1: Application Capture (Saudi Requisition)**
• Recruiter creates job requisition for Saudi Arabia entity
• Candidate applies via career site or internal referral
• Application flow presents "Primary Nationality" (required for Saudi) as part of standard application
• Candidate selects "Saudi Arabian" or other nationality
• Data captured and stored in candidate profile; available for Nitaqat reporting

**Use Case 2: Compliance Dashboard**
• Compliance Lead opens "GCC Nationalisation Compliance" dashboard
• Dashboard shows: Saudi entities—Nitaqat tier (Green/Yellow/Red) and nationalisation %; UAE entities—Emiratisation % vs target; Kuwait entities—Kuwaitisation % vs quota
• Drill-down by supervisory organisation
• Export for government submission or internal audit

**Use Case 3: Recruiter Pipeline View**
• Recruiter views "Active Requisitions" for UAE
• Pipeline shows: 15 requisitions; 8 have ≥20% national candidates in pipeline (Emiratisation target)
• Recruiter identifies 7 requisitions below target; adjusts sourcing strategy

**Use Case 4: Government Reporting**
• Compliance Lead runs "Nitaqat Quarterly Report" for Saudi entity
• Report includes: headcount by nationality, nationalisation %, Nitaqat tier
• Export to Excel for Qiwa or government portal submission

---

## Regulatory Context

### Saudi Arabia – Nitaqat
- **Nitaqat 2026–2028**: Phase localises 340,000+ jobs; enforcement escalates
- **Tiers**: Green (compliant), Yellow (warning), Red (non-compliant—work permit restrictions, transfer freezes)
- **Requirements**: Employers must meet Saudi nationalisation % by sector and company size
- **Penalties**: Non-compliance freezes work permits, transfers, government contracts

### UAE – Emiratisation
- **Targets**: Private sector Emiratisation % (e.g., 2% annual increase; sector-specific)
- **Penalties**: Fines for non-compliance; Nafis programme incentives for compliance
- **Reporting**: Quarterly submissions to Ministry of Human Resources and Emiratisation (MOHRE)

### Kuwait – Kuwaitisation
- **Quotas**: Sector-specific Kuwaiti national quotas
- **Requirements**: Employers must meet Kuwaitisation % by sector
- **Penalties**: Non-compliance affects work permits and government tenders

---

## Data & Privacy

• **Nationality data**: Sensitive personal data; stored in Workday with appropriate security domains
• **Consent**: Application capture must align with local data protection (UAE PDPL, Saudi PDPL, Kuwait data law); privacy notice required
• **Retention**: Align with candidate data retention policies; nationalisation reporting may require longer retention for audit
• **Access control**: Role-based access; compliance dashboards restricted to authorised users

---

## UX Designs for 2026R2

• Compliance Dashboard – GCC Nationalisation — [Figma (MISSION-008 capture)](https://www.figma.com/design/xNmMG73Ic5BN20BvFQEF2K) (refresh via 330 on `http://localhost:5199/` for MISSION-016)
• Application Flow – Nationality Capture (Saudi/UAE/Kuwait) — pending dedicated 330 capture
• Report – Nitaqat Quarterly — pending dedicated 330 capture

---

## Releases & Production Thresholds

Legal review required: UAE PDPL, Saudi PDPL, Kuwait data law—consent and data handling for nationality capture.
No AI/ML decision-making; data capture and reporting only.

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD Approval | April 2026 |
| OOB Field Design (Saudi, UAE, Kuwait) | May 2026 |
| Application Capture – Saudi | June 2026 |
| Application Capture – UAE, Kuwait | July 2026 |
| Compliance Dashboards | August 2026 |
| EA Release (GCC Pilot Customers) | September 2026 |
| GA Release (All GCC Customers) | November 2026 (2026R2) |

---

## Resources

• **Source Research (canonical for MISSION-016):** research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v39.md (recommendation #1)
• **Prior research:** research/GCC/thematic-analysis/2026-03-18-GCC-PMF-Analysis-v2.md
• **GCC PMF Theme**: Nationalization & Compliance Tracking (Theme 1)
• **Customer Evidence**: P1 (Accenture): "20% Emiratisation, 60% Saudization, 50% Kuwaitisation... we need the ability to track throughout Workday"; P2 (Baker Hughes): "Nitaqat is a key mandate... we get penalties... having that built into a more out-of-box situation versus bandaids"; P2: "We added capturing of nationality in UAE and Saudi... as a custom field... out-of-box is only for US and UK"
• **Deployment Agent Validation**: Workday currently has Maintain Localization Settings for Primary Nationality; no OOB for Nitaqat, Emiratisation, Kuwaitisation; customers build custom reports

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager |
| TBD | Recruiting Product Lead |
| TBD | Localisation Lead |
| TBD | Team App Dev Lead |
| TBD | Executive Sponsor (Product - Recruiting) |

---

*Workday Confidential    1*  
*-- 1 of 1 --*
