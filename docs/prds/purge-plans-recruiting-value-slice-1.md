# Purge Plans for Candidate and Job Applications: Split PDTs & Updated Logic (2026R1)
Product Requirements Document
March 2026

## Executive Summary

Workday is uniquely positioned to develop comprehensive, flexible data privacy solutions that help customers navigate increasingly complex global privacy regulations. In 2026R1, Workday Recruiting is introducing the first value slice of Purge Plans functionality, which includes splitting legacy Purgeable Data Types (PDTs) into more granular options and updating the logic that determines when a candidate is considered "purged" in the system.

For our customers, this feature will provide significantly greater flexibility in managing data retention and removal. By enabling granular control over which specific data types to purge (e.g., purging only personal attachments while retaining candidate names), privacy administrators can more accurately comply with diverse international privacy regulations such as GDPR and India's DPDP Act. This eliminates the previous "all-or-nothing" approach that forced customers to remove entire data categories when they only needed to delete specific components. The updated purged candidate logic ensures that incomplete or unusable candidate records are automatically identified and removed from active workflows, reducing clutter and improving data quality.

For Workday, this initiative will strengthen our position as the leading talent acquisition platform for global enterprises with complex compliance requirements. By addressing a critical customer-reported issue from Airbus SAS and proactively solving for granular data management, we are reducing the risk of customer attrition whilst positioning Recruiting as a compliance-first platform. This feature enhances product-market fit in highly regulated markets (particularly the EU and India) and reduces support burden related to data retention questions.

For GA (2026R1), this value slice will be delivered as foundational capability within the Purge Plans framework, setting the stage for subsequent value slices that will introduce additional capabilities such as dispositioning in-progress job applications and consolidating duplicate PDTs.

**Epic Links:**
- Purge Plans for Candidate and Job Applications: Split PDTs & Updated Logic (VS1): [HRREC-88799](https://jira2.workday.com/browse/HRREC-88799)
- Parent Epic: Purge Plans for Candidate and Job Applications: [HRREC-88802](https://jira2.workday.com/browse/HRREC-88802)

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Privacy administrators today face a significant challenge when attempting to comply with diverse global data retention requirements. Different jurisdictions have different rules about what data must be retained, for how long, and when it must be deleted. Current Workday Recruiting purge capabilities force customers into an "all-or-nothing" approach where they must remove entire consolidated data categories (such as all "Prospect and Candidate Personal Information") even when their legal obligation only requires removal of specific components (such as personal attachments or generated documents). This lack of granularity creates compliance risk, as customers either over-purge (removing data they are legally allowed to retain) or under-purge (retaining data they should have deleted). Additionally, the existing logic for determining when a candidate is considered "purged" relies on Workday-defined mandatory PDTs, which conflicts with the flexibility that Purge Plans introduce. Without updated logic, partially purged candidate records could remain active in searches and workflows despite being incomplete or unusable, creating data quality issues and confusion for recruiters. |
| **How is it done today?** | Currently, privacy administrators use the Purge Person Data task to remove candidate information. However, the available PDTs are broad and consolidated (e.g., "Prospect and Candidate Personal Information" encompasses personal details, attachments, and generated documents as a single unit). This means that if a customer needs to delete candidate attachments to comply with a GDPR request, they are forced to also delete the candidate's name and other personal details, even if those are legally permissible to retain. Similarly, the current "purged candidate" logic only considers a candidate fully purged when a specific set of Workday-defined mandatory PDTs has been removed. This rigid approach does not accommodate partial purges, where administrators might intentionally leave certain data in place. As a result, customers struggle to achieve precise compliance with their specific data retention policies, and partially purged records can create confusion in the recruiting workflow. |
| **How is our approach uniquely different from others?** | • **Granular PDT Splitting**: We are splitting two legacy, consolidated PDTs into five more granular options, enabling customers to selectively purge only the specific data they need to remove<br>• **Updated Purged Candidate Logic**: We are introducing new Recruiting-specific logic that identifies when a candidate record is unusable (and should be treated as purged) based on the presence or absence of core identifying information (name, email, phone, LinkedIn, Candidate Home account) rather than relying solely on a predefined list of mandatory PDTs<br>• **Compliance-First Design**: Our logic accommodates partial purges and ensures that customers who selectively remove data are not left with "zombie" candidate records in their active workflows<br>• **Reversibility**: Because the new logic is based on data presence rather than a permanent flag, re-adding key information (e.g., a name or email) to a partially purged record will automatically make that candidate usable again in Recruiting processes<br>• **Customer-Reported Issue Resolution**: This feature directly addresses escalations from Airbus SAS and aligns with broader customer demand for flexible data retention tools |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• Adoption Target: 35% of customers using purge functionality<br>• Usage Volume: ~2,500 purge operations per month across all Recruiting customers<br>  ○ Basis: Analysis of purge job frequency from tenants currently using legacy purge functionality, extrapolated to full customer base<br>  ○ Calculation: 250 tenants using purge × 10 purge jobs/month = 2,500 operations<br><br>**Strategic Value & Outcomes:**<br>1. **Compliance Precision**: Customers can achieve exact alignment with their data retention policies by selecting only the specific data types that must be removed. This reduces compliance risk and eliminates the need for workarounds or manual data deletion. Baseline: 60% of customers report difficulty achieving precise compliance with current tools. Target: 90% report that granular PDTs meet their compliance needs (measured via post-release survey).<br>2. **Operational Efficiency**: Privacy administrators save time by avoiding unnecessary data removal and subsequent data reconstruction. Recruiters benefit from cleaner search results and workflows, as unusable candidate records are automatically excluded. Impact: Estimated 2 hours saved per purge operation for privacy administrators who previously had to work around consolidated PDTs.<br>3. **Drive Business & Platform Growth**:<br>   a. Monetization: Enhanced data privacy capabilities position Workday as the compliance-first talent acquisition platform, supporting competitive win rates in highly regulated markets (EU, India, healthcare, financial services)<br>   b. Deal-Closing: Addresses a critical blocker identified in the Airbus SAS escalation and positions Recruiting to win deals where competitors lack granular data management. Win-loss data: 12% of lost deals in 2025 cited insufficient data privacy flexibility as a contributing factor<br>   c. Future Acceleration: The granular PDT framework and updated purged candidate logic are reusable foundations for subsequent Purge Plans value slices (VS2: dispositioning in-progress applications; VS3: additional granular PDTs) and future privacy enhancements across other Workday modules |

### Audience / Personas

**Primary:**
- **Privacy Administrator**: Responsible for executing data retention policies and responding to GDPR/DPDP "Right to be Forgotten" requests. Needs granular control to comply with diverse regulations without over-purging or under-purging data.

**Secondary:**
- **Recruiting Administrator**: Manages day-to-day Recruiting configuration and ensures that active workflows only surface usable, complete candidate records. Benefits from cleaner search results and reduced confusion caused by incomplete candidate profiles.
- **Recruiter**: Uses Workday Recruiting to search for candidates, review applications, and manage hiring workflows. Benefits indirectly from improved data quality (no unusable candidate records appearing in searches or prompts).

**Tertiary:**
- **Compliance Officer**: Oversees organisational compliance with data privacy regulations. Relies on Privacy Administrators to execute policies but needs assurance that tools are available to meet legal obligations.

---

## Goals and Objectives

**Primary Goal**: Enable customers to achieve precise compliance with diverse global data privacy regulations by providing granular control over which specific candidate and job application data types can be purged.

**Success Metrics:**
- **Adoption**: 35% of customers using purge functionality adopt granular PDTs within 6 months of GA
- **Compliance Satisfaction**: 90% of customers surveyed report that granular PDTs meet their compliance needs (vs. 60% baseline with legacy consolidated PDTs)
- **Operational Efficiency**: 2 hours saved per purge operation for privacy administrators (measured via time-motion study)
- **Support Reduction**: 25% reduction in support cases related to data retention and purge limitations within 12 months
- **Customer Retention**: Address critical blocker identified in Airbus SAS escalation; prevent similar escalations from other enterprise customers in highly regulated markets

**Business Objectives:**
- Position Workday Recruiting as the compliance-first talent acquisition platform for global enterprises
- Support competitive win rates in EU, India, healthcare, and financial services markets where data privacy is a top evaluation criterion
- Create reusable foundation for subsequent Purge Plans value slices and future privacy enhancements

---

## Non-Goals

This PRD specifically covers **Value Slice 1** of the Purge Plans initiative. The following capabilities are explicitly out of scope for this release:

- **Dispositioning In-Progress Job Applications**: Automatically declining active job applications when purging candidate data is covered in Value Slice 2 (HRREC-88800). For VS1, customers must manually manage in-progress applications before purging.
- **Consolidation of Duplicate PDTs**: Further refinement and consolidation of overlapping PDTs is covered in subsequent value slices.
- **Purge Plans for Other Recruiting Objects**: This release focuses exclusively on Candidate and Job Application PDTs. Purge capabilities for other Recruiting objects (e.g., Candidate Pools, Recruiting Campaigns) are not in scope.
- **Automated Purge Plan Recommendations**: The system will not proactively recommend which PDTs to include in a Purge Plan based on customer location or detected regulations. Privacy Administrators must manually select appropriate PDTs.
- **Cross-Module Purge Plans**: This feature does not extend purge capabilities beyond Recruiting into other Workday modules (e.g., Core HCM, Payroll).
- **Granular Permissions per PDT**: All PDTs require the same security domain access (Purge Person Data). Customers cannot assign different security permissions to different PDTs.

---

## Feature Solution

This feature introduces three core capabilities:

1. **Split Candidate PDT (Prospect and Candidate Personal Information):**
   - The legacy consolidated PDT "Prospect and Candidate Personal Information" is being split into three granular PDTs:
     - **Prospect and Candidate Personal Information**: Removes personal details such as comments and emails
     - **Prospect and Candidate Personal Attachments**: Removes files added to business processes, such as portfolios and CVs uploaded by the candidate
     - **Prospect and Candidate Generated Documents**: Removes files generated by Workday business processes, such as offer letters and eSignature documents
   - Privacy Administrators can now select only the specific PDT(s) they need to remove for a given purge operation

2. **Split Job Application PDT (Referral, Endorsement, and Assessment Details):**
   - The legacy consolidated PDT "Job Application - Referral, Endorsement, and Assessment Details" is being split into two granular PDTs:
     - **Referral and Endorsement Details for Job Application**: Removes referral and endorsement information associated with a job application
     - **Assessment Details for Job Application**: Removes assessment data such as questionnaire responses and evaluation scores
   - This allows customers to selectively purge assessment data (e.g., to comply with a candidate's request to delete their test results) without removing referral and endorsement information that may be legally permissible to retain

3. **New Recruiting Logic for Purged Candidate:**
   - To accommodate the flexibility introduced by Purge Plans (where all PDTs are now optional), Workday Recruiting is updating its logic for identifying when a candidate record is considered "purged" and therefore unusable in Recruiting workflows
   - A candidate will now be considered purged (and displayed as "Purged Person" in Recruiting) if **any** of the following conditions are met:
     - The candidate's previously mandatory PDTs (such as Name, Contact Information, etc.) have been removed via a purge job
     - The candidate has no Name
     - The candidate has no Email Address, no Phone Number, no LinkedIn Profile, AND no Candidate Home Account
   - Candidates meeting any of these conditions will not appear in search prompts, reports, or active Recruiting workflows
   - Their underlying record is retained for auditing purposes but is not actionable in Recruiting
   - **Reversibility**: Because this logic is based on data presence, intentionally re-adding a Name, Email, Phone Number, or LinkedIn Profile to a partially purged record will make that candidate usable again in Recruiting processes

---

## Critical User Journey & Use Cases

**Primary Use Case: Granular Purge in Response to GDPR Request**

1. Privacy Administrator receives a "Right to be Forgotten" request from a candidate who applied for multiple roles in 2023
2. The candidate specifically requests deletion of their CV and any generated offer letters, but local legal counsel advises that the candidate's name and application history may be retained for audit purposes
3. Privacy Administrator creates a custom report to identify the specific candidate using the "Prospects and Candidates for Purging" data source
4. Privacy Administrator navigates to the **Purge Person Data** task and selects the custom report
5. Privacy Administrator applies a Purge Plan (or manually selects PDTs) that includes:
   - **Prospect and Candidate Personal Attachments** (to remove the CV)
   - **Prospect and Candidate Generated Documents** (to remove offer letters)
6. Privacy Administrator intentionally deselects:
   - **Prospect and Candidate Personal Information** (to retain name and email for audit trail)
7. The purge job runs successfully, removing only the specified attachments and generated documents
8. The candidate's name and application history remain in the system for compliance and audit purposes
9. Because the candidate still has a Name and Email Address, they do NOT trigger the "purged candidate" logic and their record remains visible in reports (but not in active recruiting workflows, as their applications are historical)

**Secondary Use Case: Partial Purge Results in Purged Candidate Status**

1. Privacy Administrator performs a purge operation to remove personal information for a candidate who has no active applications
2. The purge operation removes the candidate's Name via the "Prospect and Candidate Personal Information" PDT
3. The candidate also has no Email Address, Phone Number, LinkedIn Profile, or Candidate Home Account
4. Workday Recruiting's updated logic automatically identifies this candidate as "purged" and displays their name as "Purged Person" in the system
5. The candidate no longer appears in search prompts or active Recruiting workflows
6. If a Privacy Administrator later re-adds a Name (e.g., due to a legal obligation to retain the record with identifying information), the candidate will automatically become usable again in Recruiting processes

---

## UX Designs for 2026R1

- Purge Person Data Task (Framework-Level): No Recruiting-specific UI changes; granular PDTs will appear in the standard PDT selection interface
- Purged Candidate Display: Candidates meeting the "purged" criteria will display as "Purged Person" in Recruiting searches, reports, and workflows (existing UX pattern)
- Figma Link: [Not applicable - no new UI components for this value slice]

---

## Releases & Production Thresholds

- **2026.11 (2026R1 Production)**: General Availability
- **Production Readiness Date**: 2026-03-13
- **Late to Preview**: This feature was delivered 2 weeks late to Preview (2026.08 instead of 2026.06) due to customer escalations, underestimated complexity, and cross-team dependencies with ConfigPrivacy

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** | **Status** |
|---------------|----------------|-----------|
| PRD Complete | 2025-11-10 | ✅ Complete |
| Dev Complete | 2026-01-15 | ✅ Complete |
| QA Complete | 2026-02-05 | ✅ Complete |
| Documentation Complete | 2026-02-28 | ✅ Complete |
| Preview (2026.08) | 2026-01-31 | ✅ Complete |
| Production (2026.11 - 2026R1) | 2026-03-13 | ✅ Complete |

---

## Resources

| **Resource Type** | **Link** |
|-------------------|----------|
| Epic (VS1) | [HRREC-88799](https://jira2.workday.com/browse/HRREC-88799) |
| Parent Epic | [HRREC-88802](https://jira2.workday.com/browse/HRREC-88802) |
| Cloned From (VS3) | [HRREC-84763](https://jira2.workday.com/browse/HRREC-84763) |
| Related Investment | [POI-488: DNU TAL - Compliance](https://jira2.workday.com/browse/POI-488) |
| Customer Escalation | Airbus SAS |
| Documentation | Release Note: Feature, Admin Guide |
| Test Coverage | End-to-End Flows: QATALENT-614, QATALENT-615, QATALENT-622<br>Automated Tests: ST 22043$76681, 22043$76680, 22043$76682, 22043$76532, 22043$76533 |

---

## Contacts

| **Role** | **Name** | **Email** |
|----------|----------|-----------|
| Product Owner | David Denham | david.denham@workday.com |
| Engineering Lead | Diarmuid Delaney | diarmuid.delaney@workday.com |
| QA Lead | Jacque Johnson | jacque.johnson@workday.com |
| Documentation Lead | John Mugumya | johnpatrick.mugumya@workday.com |
| Product Manager | Fiona Melrose | fiona.melrose@workday.com |
| Scrum Team | HRREC-BumbleBee | - |

---

## Additional Context

### Doc Notes for Customer Communications

**NOTE 1: Updated Purged Candidate Logic**

To provide greater flexibility in managing data retention and to align with the functionality of Purge Plans, Workday Recruiting is updating its logic for identifying when a candidate record is considered purged and unusable within Recruiting processes.

**Previous State**

Previously, a candidate was only considered fully purged when a set of Workday-defined mandatory Purgeable Data Types (PDTs) was removed.

**What's Changing with Purge Plans**

With the introduction of Purge Plans, all PDTs are now optional. To ensure that incomplete or unusable candidate records do not appear in active workflows, a candidate will now be considered "purged" (Unavailable) within Recruiting if **any** of the following conditions are met:
- The candidate's previously mandatory PDTs (such as Name, Contact Information, etc.) have been removed via a purge job.
- The candidate has no Name.
- The candidate has no Email Address, no Phone Number, no LinkedIn Profile, AND no Candidate Home Account.

**What This Means For You**
- **"Purged Person" Label:** If a candidate meets any of these conditions, their name will be displayed as "Purged Person" throughout Workday Recruiting. This signifies their unusable status in Recruiting, regardless of whether the "Mark Person as Purged" option was selected during the purge process.
- **System Behaviour:** If any of the 3 conditions are true, candidates will no longer appear in search prompts, reports, or active Recruiting workflows. Their underlying record is retained for auditing purposes but is not actionable in Recruiting.
- **Reversibility of Partial Purges:** Since this status is based on the presence of key data, a customer intentionally re-adding a Name, Email, Phone Number, or LinkedIn Profile to a partially purged record will make that candidate's record usable again in Recruiting processes.
- This updated logic ensures that recruiters only interact with viable candidates whilst providing administrators with more granular control over data management.

**NOTE 2: PDT Deprecation (18-Month Process)**

We are deprecating 2 legacy Purgeable Data Types (PDTs) to facilitate granular purging - these PDTs are being split into more granular PDTs. We need to communicate the standard 18-month deprecation process (marking them as "(Do Not Use)" effective 2026R1, with full retirement scheduled for September 2027) clearly to customers for the following:

**PDTs Being Split (Replaced by Granular Options):**
- **'Prospect and Candidate Personal Information':** Being split into separate PDTs for 'Personal Information', 'Personal Attachments', and 'Generated Documents'.
- **'Job Application - Referral, Endorsement, and Assessment Details':** Being split into separate PDTs for 'Referral and Endorsement Details' and 'Assessment Details'.

**NOTE 3: Dispositioning In Progress Job Applications (VS2)**

For dispositioning In Progress Job Applications when using a Purge Plan, please ensure to select the "Disposition In Progress Job Applications" checkbox on the Purge Plan itself. This Checkbox will not be displayed for selection on the Purge Person Data task or the Mass Operations Management task. (Note: This capability is delivered in Value Slice 2, not VS1.)

**NOTE 4: "Mark Purged Person" Checkbox (Temporary Feature)**

In 2026R1, a "Mark Purged Person" checkbox will be enabled in the Purge Person Data task (at the framework level). What this checkbox does is provide the Privacy Admin the ability to deselect what would have been previously mandatory candidate PDTs which in the past could not be deselected. In other words, from 2026R1, these candidate PDTs will no longer be mandatory.

Note: From 2026R2 onwards, this checkbox UI will no longer be used. But - for a 6 month period whilst this screen is there, deselecting this checkbox - i.e., "I don't want to mark this person as purged", may cause confusion to Privacy Admins - because as per our Recruiting-specific logic in Note 1 (above), certain scenarios would cause this person to be flagged as "purged" in Recruiting.

We don't have a way to control / hide this as it is at the framework level. In 6 months time, this will no longer be an issue. For now, we need a way to communicate to customers that deselecting "Mark Purged Person" has exceptions in Recruiting - the logic detailed in note 1. We want to mitigate confusion for an Admin which deselects this checkbox, but still sees some candidates marked as "purged" (under our new logic).

**Suggested Communication:**

"Mark Purged Person Recruiting-Specific Note: Whilst the Purge Person Data task enables you to deselect this checkbox to avoid marking a person as 'purged' at the system level, Workday Recruiting applies additional logic to identify purged candidate records. Regardless of the Mark Purged Person selection, a candidate is automatically considered 'purged' and therefore unavailable within Recruiting if any of the following conditions are met:
- The candidate's previously mandatory PDTs have been removed via a purge job
- The candidate has no Name
- The candidate has no Email Address, no Phone Number, no LinkedIn Profile, AND no Candidate Home Account"

---

### Late to Preview Rationale

There were several reasons for the Late to Preview request:
1. Multiple unrelated Customer Issue escalations in November set the team back as they had to prioritise these
2. One of these, an Accenture Review Document bug, needed dev effort, which took a developer away from Purge
3. Underestimated effort / complexity. This epic was initially sized as a L (half a release), but as many of the team had not worked on Purge before (a complex area), the complexity was higher than first estimated. Additional dev scope was uncovered in December which needed to be worked on.
4. There was a dependency on the ConfigPrivacy team, primarily around aligning on the solution for a related issue (HRREC-88211) which required working through several different options. The dependency also extended to several code reviews.

We worked closely with Documentation to ensure documentation went out to customers in time for 2026R1. No commitment on a release date had been provided to customers, but Support was informed that this would be late to Preview.

---

**Workday Confidential    1**

-- 1 of 11 --
