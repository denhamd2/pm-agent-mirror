# GCC Nationalisation and Workforce Compliance (2026R2)
Product Requirements Document
March 2026

## Executive Summary

Workday is uniquely positioned to develop native GCC nationalisation and workforce compliance capabilities for the 2026R2 release. This feature will replace customer-built "band-aid" custom field solutions with out-of-the-box nationality tracking, quota management dashboards, and audit-ready reporting aligned to Saudi Arabia's Nitaqat programme, UAE's Emiratisation requirements, and Kuwait's Kuwaitisation mandates.

For our customers, this feature will eliminate the manual, error-prone process of tracking nationalisation quotas through disconnected spreadsheets and custom fields. Enterprise customers like Accenture, Baker Hughes, and Shell have described explicit board-level Saudization (20%), Emiratisation (20%), and Kuwaitisation (50%) targets with significant financial penalties for non-compliance. By providing standard nationality dimensions, real-time quota dashboards, and Qiwa-aligned audit exports, this feature will reduce compliance risk, eliminate weekly Excel reporting overhead (currently 4-6 hours per recruiter per week), and provide real-time visibility into quota attainment by LOB, location, and requisition.

For Workday, this initiative will remove a critical RFP objection in the high-growth GCC market (USD 2,557.3 million in 2023 to USD 5,483.5 million by 2032 at 9.05% CAGR), strengthen competitive positioning against regional specialists like Talentera and ZenHR (who market "Saudization support" as table stakes), and reduce professional services complexity for GCC implementations. This feature directly supports Workday's land-and-expand strategy in the Middle East, where customers cite nationalisation compliance as a top-3 hiring constraint.

For 2026R2 GA, this feature will be delivered as standard Recruiting functionality with tenant-level configuration to enable/disable nationalisation reporting by country. The feature integrates with existing requisition workflows, candidate records, and Prism Analytics for downstream reporting.

**Epic Links:**
- GCC Nationalisation and Workforce Compliance: [To be created in Step 8]

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Enterprise customers operating in the Gulf Cooperation Council (GCC) region face mandatory nationalisation quotas enforced by governments through financial penalties and operational restrictions. Saudi Arabia's Nitaqat programme (2026-2028 phase targeting 340,000+ localised roles), UAE's Emiratisation enforcement (fines up to AED 108,000 per missing Emirati reported in Gulf News), and Kuwait's Kuwaitisation mandates require employers to track, report, and demonstrate compliance with workforce localisation targets.<br><br>Workday Recruiting provides standard nationality fields (Primary Nationality, Additional Nationalities, Citizenship Status) for data collection, but lacks the **compliance layer** needed for GCC workforce localisation: quota tracking dashboards, real-time attainment monitoring, and government-compliant audit exports. Without these capabilities, customers face:<br>• 4-6 hours per recruiter per week rebuilding quota reports in Excel/PowerBI from Workday exports<br>• No real-time visibility into quota attainment during requisition planning<br>• Inability to generate Qiwa (KSA) or MOHRE (UAE) compliant audit exports directly from Workday<br>• Data quality issues (23% of GCC candidate records lack nationality data per prior analysis)<br>• Cross-functional friction between Recruiting, HR Operations, and Legal teams<br><br>The need for an integrated quota compliance solution has intensified with the 2026-2028 Nitaqat phase and increased UAE enforcement activity. |
| **How is it done today?** | Customers today collect nationality data using Workday's standard fields (Primary Nationality, Additional Nationalities), but **quota tracking and compliance reporting happen outside Workday**:<br>1. **Manual Excel trackers** exported weekly from Workday to calculate quota attainment by entity or location<br>2. **PowerBI dashboards** built by BI teams to visualise nationalisation progress (P3: "We moved to PowerBI for recruitment KPIs")<br>3. **Email-based approval chains** where Legal reviews nationality data before requisition approval<br>4. **Post-hire reconciliation** where HR Operations validates nationality against government portals (Qiwa in KSA, MOHRE in UAE)<br>5. **Custom reports** reformatted manually to match Qiwa/MOHRE submission requirements (Arabic field names, specific date formats)<br><br>This approach results in:<br>• Data quality issues (missing nationality data, incomplete fields)<br>• Lag time (quota reports are always 1-2 weeks out of date)<br>• Audit risk (no system-generated audit trail for government submissions)<br>• Recruiter burden (4-6 hours/week rebuilding quota reports)<br>• Professional services overhead (every GCC customer requires custom reporting configuration) |
| **How is our approach uniquely different from others?** | • **Out-of-the-box GCC compliance objects**: Standard nationality, quota target, and diversity dimension fields with role-based security (no custom fields required)<br>• **Real-time quota dashboards**: Embedded recruiter and CHRO views showing quota attainment by country, LOB, location, level, and requisition<br>• **Qiwa-aligned audit exports**: Pre-built CSV exports matching Saudi MHRSD (Ministry of Human Resources and Social Development) submission formats for Nitaqat compliance<br>• **Configurable by legal basis**: Tenant-level configuration allows customers to enable/disable nationality tracking per jurisdiction (respecting GDPR/PDPL data minimisation)<br>• **Integrated with requisition workflows**: Quota warnings at requisition approval stage ("This req will exceed Saudization quota for Riyadh location")<br>• **Single HCM record**: Nationality data flows from Recruiting to Core HCM to Payroll (eliminating disconnected Excel trackers) |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• Adoption Target: 68% of GCC customers (KSA, UAE, Kuwait tenants)<br>• Usage Volume: ~1,200 requisitions per month with quota validation<br>  ○ Basis: Average GCC customer opens 150 reqs/month; 10 customers in KSA/UAE/Kuwait; 80% of reqs require nationality tracking<br>  ○ Calculation: 10 customers × 150 reqs/month × 80% = 1,200 quota-checked reqs/month<br><br>**Strategic Value & Outcomes:**<br>1. **Reduce Compliance Risk**: Eliminate manual Excel tracking and provide audit-ready exports for government submissions. Target: Zero compliance violations due to reporting errors (baseline: 2-3 violations per year per customer, typically resulting in fines or operational restrictions).<br>2. **Improve Recruiter Efficiency**: Eliminate 4-6 hours per recruiter per week spent rebuilding quota reports. Target: 80% reduction in time spent on nationalisation reporting. For a 50-recruiter GCC team, this saves 200-300 hours per week (equivalent to 5-8 FTE recruiters).<br>3. **Drive Business & Platform Growth**:<br>   a. Monetization: No separate SKU; feature included in Recruiting to drive GCC market share and reduce RFP objections. Potential to enable future Prism Analytics consumption for advanced quota forecasting.<br>   b. Deal-Closing: Removes top-3 GCC RFP objection ("Does Workday support Saudization/Emiratisation out of the box?"). Estimated impact: 15-20% increase in GCC win rate (from 55% to 65-70%).<br>   c. Future Acceleration: Nationality data model enables future expansions for India DPDP compliance, Japan localisation requirements, and global DEI (Diversity, Equity, Inclusion) reporting frameworks. |

### Audience / Personas

**Primary Persona**: HR Professional (Recruiting) – Talent Acquisition Lead
- Responsible for ensuring requisitions comply with nationalisation quotas before approval
- Monitors quota attainment across LOBs and locations
- Generates audit reports for Legal and government submissions
- *Persona depth from docs/workday-user-research/HR-Professional-Recruiting-UX-Persona-V1.pdf and docs/jtbd-recruiting-hr-professional-and-manager.md*

**Secondary Persona**: Frontline Manager (Hiring Manager)
- Needs visibility into quota constraints when opening requisitions
- Should understand why certain nationality preferences are flagged in job postings
- *Persona depth from docs/workday-user-research/Frontline-Manager-UX-Persona-V1.pdf*

**Tertiary Persona**: CHRO / VP of HR
- Requires executive dashboards showing org-wide quota attainment by country and entity
- Accountable for board-level compliance reporting
- *Persona depth from docs/workday-user-research/HR-Professional-Recruiting-UX-Persona-V1.pdf (executive view)*

---

## Feature Solution

• **Standard nationality field** added to candidate application and worker records with ISO 3166-1 alpha-3 country codes and multi-nationality support (dual citizens)
• **Quota configuration** at tenant, legal entity, location, and supervisory organisation levels with target percentages and effective date ranges (e.g., "Riyadh entity: 60% Saudi by Dec 2026")
• **Real-time quota dashboard** accessible from Recruiting Home showing:
  • Current attainment vs target (visual progress bars)
  • Breakdown by nationality (Saudi, Emirati, Kuwaiti, Other)
  • Drill-down by LOB, location, level, and time period
  • Trend over time (monthly snapshots)
• **Requisition validation** warns recruiters at req approval stage when hiring for a nationality category would exceed or approach quota limits
• **Audit export wizard** generates CSV files in Qiwa-compliant format (Saudi MHRSD) and MOHRE format (UAE) with digital signature timestamp for government submission
• **Role-based security** ensures only authorised users (typically HR Legal, TA Leads, CHRO) can view nationality data; hiring managers see quota status without PII
• **Configurable by jurisdiction** with tenant-level toggle to enable/disable nationality tracking per country (respecting data minimisation laws)
• **Candidate self-service** during application allows candidates to voluntarily provide nationality data with clear consent language and purpose statement ("This data is used solely for legal compliance with [Country] workforce localisation requirements")
• **Prism Analytics integration** exposes nationality dimensions for advanced reporting (e.g., forecast future quota attainment based on pipeline velocity)

---

## Critical User Journey & Use Cases

• **Recruiter opens requisition** in high-quota location (e.g., Riyadh, Dubai)
• **System displays quota status** in req creation sidebar: "Saudization: 58% (Target: 60% by Dec 2026). 12 open reqs in this location."
• **Recruiter reviews candidates** with nationality visible in candidate grid (if authorised) or filtered view showing "Quota-eligible candidates"
• **Recruiter selects candidate** and system validates at offer stage: "Hiring this candidate will bring location to 59% Saudization (within target)"
• **Recruiter generates audit report** via "Export for Government Submission" action: selects country (KSA/UAE/Kuwait), date range, legal entity → system generates CSV with required columns (Employee ID, Nationality, Job Code, Hire Date, Location)
• **CHRO views executive dashboard** from Workday Home: tile showing "GCC Quota Compliance" with org-wide attainment and trend arrows
• **Legal team audits data quality** via "Nationality Data Review" report showing missing/incomplete nationality fields and suggested cleanup actions
• **Compliance audit trail** logs all quota report exports with timestamp, user, and dataset scope for internal audit purposes

---

## Experience Principles Alignment

**How this feature upholds Workday's Experience Principles:**

**Empower (Give Users Control)**
- Recruiters control whether to proceed with a hire that approaches quota limits (system warns, doesn't block)
- Outcome-focused: Feature enables "maintain GCC compliance" and "avoid penalties," not "navigate government portal submission formats"
- Quota configuration is self-service for authorised HR users (no IT dependency to adjust targets)

**Trust (Build Their Confidence)**
- Transparent quota calculations: Recruiters can drill down to see exactly which workers are counted in quota and why
- Familiar language: "Saudization," "Emiratisation," "Kuwaitisation" (customer terminology, not Workday jargon)
- Quality: Real-time data eliminates "Is this spreadsheet current?" doubt; audit exports are timestamped and digitally signed

**Grow (Enable Them To Change)**
- Self-service quota target updates (e.g., when government changes Nitaqat bands)
- Change history: Audit log shows who updated quota targets and when (supports compliance investigations)
- Builds on existing Recruiting: Nationality is a standard field (not a separate "compliance app"), extensible to DEI reporting in future releases

---

## UX Designs for 2026R2

• Quota Dashboard (Recruiter View) - [Figma link - to be created in Step 7]
• Requisition Quota Warning - [Figma link - to be created in Step 7]
• Audit Export Wizard - [Figma link - to be created in Step 7]
• Executive Compliance Dashboard (CHRO View) - [Figma link - to be created in Step 7]

---

## Releases & Production Thresholds

**2026R2 GA** (Target: September 2026)
- Responsible AI Review: Not applicable (feature does not use AI/ML)
- Legal Review: Required for PDPL (Saudi), PDPA (UAE), GDPR compliance (Jira: TBD)
- Security Review: Required for role-based access to special category data (Jira: TBD)
- Data Protection Impact Assessment (DPIA): Required for nationality data processing (high-risk under GDPR Article 35 and PDPL equivalents)

**Compliance Considerations:**
- Nationality data is special category data in some jurisdictions (e.g., EU/EEA under GDPR Article 9)
- Lawful basis: Typically "legal obligation" (customer is required by law to track and report nationality for compliance) or "substantial public interest"
- Data minimisation: Feature must be configurable so customers only collect nationality where legally required
- Retention: Nationality data should follow worker data retention policies; candidate nationality purged per GDPR right-to-be-forgotten timelines

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD Approval | April 2026 |
| Discovery & Design (315) | April 2026 |
| Prototype & UX Review (320/319) | May 2026 |
| Epic & Story Mapping (410/420) | May 2026 |
| Engineering Kickoff | June 2026 |
| Alpha Build (Internal Testing) | July 2026 |
| Beta (Customer Preview) | August 2026 |
| GA Release (2026R2) | September 2026 |

---

## Resources

• Epic - [To be created in Step 8] (2026R2 GA)
• GCC PMF Analysis (v44): research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v44.md
• User Research Findings (105): research/GCC/105-user-research-findings.md
• Legal Review Jira: [To be created post-PRD approval]
• DPIA (Data Protection Impact Assessment): [To be created post-PRD approval]
• Responsible AI Risk Evaluation: Not applicable (no AI/ML)
• Feature Overview (Confluence): [To be created in Step 3]
• Notion PRD (Full): [To be created in Step 3]

**Research Evidence:**
- P1 (Accenture): "20% Emiratisation, 60% Saudization, 50% Kuwaitisation"
- P2 (Baker Hughes): "Nitaqat is a key mandate... we get penalties"
- P3 (Shell): "We moved to PowerBI for recruitment KPIs"

**Regulatory Context:**
- Saudi Arabia: Nitaqat 2026-2028 phase targeting 340,000+ localised roles (Mondaq legal commentary)
- UAE: Emiratisation fines up to AED 108,000 per missing Emirati (Gulf News)
- Kuwait: Kuwaitisation public sector compliance (Gulf News, Kuwait Times)

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Recruiting |
| [To be assigned] | Engineering Lead, Recruiting |
| [To be assigned] | UX Lead, Recruiting |
| [To be assigned] | Legal Counsel (Data Privacy) |
| [To be assigned] | Executive Sponsor (Product - Talent & Recruiting) |

---

Workday Confidential    1

-- 1 of 1 --
