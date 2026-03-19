# GCC Nationalization & Compliance - Story Map

**Epic:** GCC Nationalization & Compliance ([HRREC-90883](https://jira2.workday.com/browse/HRREC-90883))  
**Source:** docs/prds/gcc-nationalization-compliance-prd.md  
**Prototype:** design/gcc-nationalization-compliance.tsx  
**Figma:** https://www.figma.com/design/xNmMG73Ic5BN20BvFQEF2K  
**Date:** 18 March 2026

---

## Epic (User Story Format)

**As a** GCC recruiter  
**I want** OOB nationalization tracking (Nitaqat, Emiratisation, Kuwaitisation) at application and compliance dashboards  
**So that** I can meet regulatory quotas without custom fields and manual reporting workarounds

**Regulatory Context:**
- **Saudi Arabia (Nitaqat)**: 2026–2028 phase localises 340,000+ jobs; Green/Yellow/Red tiers; work permit restrictions for non-compliance
- **UAE (Emiratisation)**: Sector-specific targets (e.g., 2% annual increase); MOHRE quarterly submissions; Nafis incentives
- **Kuwait (Kuwaitisation)**: Sector-specific quotas; work permit and tender implications

**Customer Evidence:**
- P1 (Accenture): "20% Emiratisation, 60% Saudization, 50% Kuwaitisation... we need the ability to track throughout Workday"
- P2 (Baker Hughes): "Nitaqat is a key mandate... we get penalties if we don't meet certain percentage... having that built into a more out-of-box situation versus bandaids"
- P2: "We added capturing of nationality in UAE and Saudi... as a custom field... out-of-box is only for US and UK"

---

## User Activities (Horizontal Backbone)

| Activity 1 | Activity 2 | Activity 3 | Activity 4 |
|------------|------------|------------|------------|
| **Capture nationality** | **View compliance** | **Export reports** | **Configure thresholds** |
| Apply for job (candidate) | Open dashboard (compliance lead) | Run report (compliance lead) | Set thresholds (admin) |
| Submit application with nationality | Drill down by org | Export to Excel/PDF | Enable per country/sector |

---

## User Tasks (Vertical Slices)

### Activity 1: Capture nationality
- Candidate applies via career site or referral
- Application flow presents Primary Nationality (required for GCC requisitions)
- Candidate selects nationality (Saudi Arabian, UAE national, Kuwaiti, or other)
- Data stored in candidate profile; available for reporting

### Activity 2: View compliance
- Compliance Lead opens GCC Nationalisation Compliance dashboard
- View nationalisation % by supervisory organisation
- Compare vs regulatory thresholds (Nitaqat tier, Emiratisation target, Kuwaitisation quota)
- Drill down by department/entity
- See trend over time (quarterly)
- View candidate pipeline: % nationals in application/hire funnel

### Activity 3: Export reports
- Run Nitaqat Quarterly Report (Saudi)
- Run Emiratisation Report (UAE)
- Run Kuwaitisation Report (Kuwait)
- Export to Excel/PDF for government portal submission (Qiwa, MOHRE)
- Internal audit trail

### Activity 4: Configure thresholds
- Tenant-level enable/disable per country (Saudi, UAE, Kuwait)
- Set thresholds by country and sector (Nitaqat tier, Emiratisation %, Kuwaitisation quota)
- Optional per-job or per-requisition override
- Maintain Localization Settings integration for Primary Nationality

---

## Value Slices

### VS1: Data Capture
**Goal:** Eliminate custom nationality fields; 100% of GCC applications capture nationality via OOB flow

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 1 | As a candidate I want to provide my nationality when applying for a Saudi requisition so that the employer can meet Nitaqat requirements | [HRREC-90884](https://jira2.workday.com/browse/HRREC-90884) | Given I am applying for a job in Saudi Arabia, When I reach the application form, Then I see Primary Nationality as a required field with Saudi Arabian and other options |
| 2 | As a candidate I want to provide my nationality when applying for a UAE requisition so that the employer can meet Emiratisation targets | [HRREC-90885](https://jira2.workday.com/browse/HRREC-90885) | Given I am applying for a job in UAE, When I reach the application form, Then I see Primary Nationality as a required field with UAE national and other options |
| 3 | As a candidate I want to provide my nationality when applying for a Kuwait requisition so that the employer can meet Kuwaitisation quotas | [HRREC-90886](https://jira2.workday.com/browse/HRREC-90886) | Given I am applying for a job in Kuwait, When I reach the application form, Then I see Primary Nationality as a required field with Kuwaiti and other options |
| 4 | As an HR Administrator I want OOB nationality fields for GCC so that I do not need custom fields or Personal Information Change steps | [HRREC-90887](https://jira2.workday.com/browse/HRREC-90887) | Given I am configuring Workday for a GCC customer, When I enable GCC nationalisation for Saudi/UAE/Kuwait, Then Primary Nationality is available in the application flow without custom configuration |

### VS2: Compliance Dashboard
**Goal:** Reduce time to assess compliance from hours (custom reports) to minutes; surface at-risk entities

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 5 | As a Compliance Lead I want to view nationalisation % vs thresholds by country so that I know which entities are compliant | [HRREC-90888](https://jira2.workday.com/browse/HRREC-90888) | Given I open the GCC Nationalisation Compliance dashboard, When I view the overview, Then I see Saudi (Nitaqat tier), UAE (Emiratisation % vs target), Kuwait (Kuwaitisation % vs quota) with compliant/at-risk/non-compliant status |
| 6 | As a Compliance Lead I want to drill down by supervisory organisation so that I can identify which departments need attention | [HRREC-90889](https://jira2.workday.com/browse/HRREC-90889) | Given I am viewing the dashboard, When I drill down by organisation, Then I see nationalisation % per department with status indicators |
| 7 | As a recruiter I want to see candidate pipeline nationalisation % so that I can adjust sourcing for requisitions below target | [HRREC-90890](https://jira2.workday.com/browse/HRREC-90890) | Given I view active requisitions for UAE, When I check pipeline status, Then I see % national candidates in application/hire funnel vs Emiratisation target |

### VS3: Reporting
**Goal:** Reduce time to prepare government submissions from days to hours; standard reports for Qiwa, MOHRE

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 8 | As a Compliance Lead I want to run Nitaqat Quarterly Report (Saudi) so that I can submit to Qiwa or government portal | [HRREC-90891](https://jira2.workday.com/browse/HRREC-90891) | Given I am a Compliance Lead for Saudi entities, When I run the Nitaqat Quarterly Report, Then I get headcount by nationality, nationalisation %, Nitaqat tier with export to Excel/PDF |
| 9 | As a Compliance Lead I want to run Emiratisation Report (UAE) so that I can submit to MOHRE | [HRREC-90892](https://jira2.workday.com/browse/HRREC-90892) | Given I am a Compliance Lead for UAE entities, When I run the Emiratisation Report, Then I get nationalisation % by sector with export to Excel/PDF |
| 10 | As a Compliance Lead I want to run Kuwaitisation Report (Kuwait) so that I can submit for government compliance | [HRREC-90893](https://jira2.workday.com/browse/HRREC-90893) | Given I am a Compliance Lead for Kuwait entities, When I run the Kuwaitisation Report, Then I get nationalisation % by sector with export to Excel/PDF |

### VS4: Configuration
**Goal:** Reduce implementation effort from ~80 hours (custom) to ~48 hours (OOB); tenant-level control

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 11 | As an HR Administrator I want to enable GCC nationalisation per country so that I can roll out Saudi, UAE, Kuwait independently | [HRREC-90894](https://jira2.workday.com/browse/HRREC-90894) | Given I am configuring the tenant, When I enable GCC nationalisation, Then I can toggle Saudi, UAE, and Kuwait independently |
| 12 | As an HR Administrator I want to set nationalisation thresholds by country and sector so that dashboards reflect our regulatory requirements | [HRREC-90895](https://jira2.workday.com/browse/HRREC-90895) | Given I am configuring thresholds, When I set Nitaqat tier (Green/Yellow/Red) or Emiratisation % or Kuwaitisation quota, Then the dashboard and reports use these values for compliance status |
| 13 | As an HR Administrator I want Maintain Localization Settings to integrate with Primary Nationality so that existing localisation config is respected | [HRREC-90896](https://jira2.workday.com/browse/HRREC-90896) | Given Maintain Localization Settings has Primary Nationality enabled for Saudi/UAE/Kuwait, When I enable GCC nationalisation, Then the application flow uses the same field without duplication |

---

## Story Count Summary

| Value Slice | Stories | Goal |
|-------------|---------|------|
| VS1: Data Capture | 4 | OOB nationality at application; no custom fields |
| VS2: Compliance Dashboard | 3 | Nationalisation % vs thresholds; drill-down; pipeline view |
| VS3: Reporting | 3 | Nitaqat, Emiratisation, Kuwaitisation reports; Excel/PDF export |
| VS4: Configuration | 3 | Per-country enable; thresholds by sector; localisation integration |
| **Total** | **13** | |

---

## Proposed User Stories (Full Detail)

### Story 1: Primary Nationality capture for Saudi requisitions
**Value Slice:** VS1 (Data Capture)

**As a** candidate applying for a job in Saudi Arabia  
**I want** to provide my Primary Nationality as part of the standard application  
**So that** the employer can meet Nitaqat requirements and report compliance

**Acceptance Criteria:**
- Application flow presents Primary Nationality when requisition is for Saudi entity
- Field is required for Saudi requisitions
- Options include Saudi Arabian and standard nationality list
- Data stored in candidate profile; available for Nitaqat reporting
- Privacy notice displayed per UAE PDPL/Saudi PDPL

**BDD Scenarios:**

Scenario: Saudi requisition shows nationality field
  Given I am applying for a job requisition in Saudi Arabia
  When I reach the application form
  Then I see Primary Nationality as a required field
  And I can select Saudi Arabian or other nationality

Scenario: Non-GCC requisition does not show nationality
  Given I am applying for a job requisition in the UK
  When I reach the application form
  Then Primary Nationality is not displayed (or optional)

---

### Story 2: Primary Nationality capture for UAE requisitions
**Value Slice:** VS1 (Data Capture)

**As a** candidate applying for a job in UAE  
**I want** to provide my Primary Nationality as part of the standard application  
**So that** the employer can meet Emiratisation targets

**Acceptance Criteria:**
- Application flow presents Primary Nationality when requisition is for UAE entity
- Field is required for UAE requisitions
- Options include UAE national and standard nationality list
- Data stored in candidate profile; available for Emiratisation reporting

**BDD Scenarios:**

Scenario: UAE requisition shows nationality field
  Given I am applying for a job requisition in UAE
  When I reach the application form
  Then I see Primary Nationality as a required field
  And I can select UAE national or other nationality

---

### Story 3: Primary Nationality capture for Kuwait requisitions
**Value Slice:** VS1 (Data Capture)

**As a** candidate applying for a job in Kuwait  
**I want** to provide my Primary Nationality as part of the standard application  
**So that** the employer can meet Kuwaitisation quotas

**Acceptance Criteria:**
- Application flow presents Primary Nationality when requisition is for Kuwait entity
- Field is required for Kuwait requisitions
- Options include Kuwaiti and standard nationality list
- Data stored in candidate profile; available for Kuwaitisation reporting

**BDD Scenarios:**

Scenario: Kuwait requisition shows nationality field
  Given I am applying for a job requisition in Kuwait
  When I reach the application form
  Then I see Primary Nationality as a required field
  And I can select Kuwaiti or other nationality

---

### Story 4: OOB nationality fields without custom configuration
**Value Slice:** VS1 (Data Capture)

**As an** HR Administrator configuring Workday for a GCC customer  
**I want** OOB nationality fields for Saudi, UAE, Kuwait  
**So that** I do not need custom fields or Personal Information Change business process steps

**Acceptance Criteria:**
- Enabling GCC nationalisation adds Primary Nationality to application flow without custom field configuration
- No custom Maintain Localization Settings beyond standard Primary Nationality for Saudi/UAE/Kuwait
- Implementation effort reduced vs custom configuration (target: 40% reduction)

**BDD Scenarios:**

Scenario: OOB configuration
  Given I am configuring Workday for a GCC customer
  When I enable GCC nationalisation for Saudi
  Then Primary Nationality appears in the application flow without creating custom fields
  And I can complete setup in fewer hours than custom configuration

---

### Story 5: Compliance dashboard overview by country
**Value Slice:** VS2 (Compliance Dashboard)

**As a** Compliance Lead  
**I want** to view nationalisation % vs regulatory thresholds by country  
**So that** I know which entities are compliant, at-risk, or non-compliant

**Acceptance Criteria:**
- Dashboard shows Saudi: Nitaqat tier (Green/Yellow/Red) and nationalisation %
- Dashboard shows UAE: Emiratisation % vs target
- Dashboard shows Kuwait: Kuwaitisation % vs quota
- Status indicators: compliant (green), at-risk (yellow), non-compliant (red)
- Trend over time (quarterly) visible

**BDD Scenarios:**

Scenario: Dashboard shows compliant entity
  Given I open the GCC Nationalisation Compliance dashboard
  When I view Saudi Arabia entity with 65% nationalisation (threshold 60%)
  Then I see compliant status (green)
  And Nitaqat tier is displayed

Scenario: Dashboard shows at-risk entity
  Given I open the GCC Nationalisation Compliance dashboard
  When I view UAE entity with 18% Emiratisation (target 20%)
  Then I see at-risk status (yellow)
  And gap to target is visible

---

### Story 6: Drill down by supervisory organisation
**Value Slice:** VS2 (Compliance Dashboard)

**As a** Compliance Lead  
**I want** to drill down by supervisory organisation  
**So that** I can identify which departments need attention

**Acceptance Criteria:**
- Drill-down from country view to supervisory organisation
- Each department shows: nationals, total, nationalisation %, status
- Drill-down preserves hierarchy and filters

**BDD Scenarios:**

Scenario: Drill down to department
  Given I am viewing the Saudi dashboard
  When I drill down by organisation
  Then I see nationalisation % per department
  And I can identify departments below threshold

---

### Story 7: Recruiter pipeline nationalisation view
**Value Slice:** VS2 (Compliance Dashboard)

**As a** recruiter  
**I want** to see candidate pipeline nationalisation % for my requisitions  
**So that** I can adjust sourcing for requisitions below Emiratisation/Kuwaitisation target

**Acceptance Criteria:**
- Active requisitions view shows % national candidates in pipeline
- Indicator when requisition is below target vs at/above target
- Filter by country (Saudi, UAE, Kuwait)

**BDD Scenarios:**

Scenario: Pipeline below target
  Given I view active requisitions for UAE
  When a requisition has 10% national candidates in pipeline (target 20%)
  Then I see at-risk indicator
  And I can adjust sourcing strategy

---

### Story 8: Nitaqat Quarterly Report (Saudi)
**Value Slice:** VS3 (Reporting)

**As a** Compliance Lead for Saudi entities  
**I want** to run the Nitaqat Quarterly Report  
**So that** I can submit to Qiwa or government portal

**Acceptance Criteria:**
- Report includes: headcount by nationality, nationalisation %, Nitaqat tier
- Export to Excel and PDF
- Filter by supervisory organisation, date range

**BDD Scenarios:**

Scenario: Export Nitaqat report
  Given I am a Compliance Lead for Saudi entities
  When I run the Nitaqat Quarterly Report
  Then I get headcount by nationality and nationalisation %
  And I can export to Excel for Qiwa submission

---

### Story 9: Emiratisation Report (UAE)
**Value Slice:** VS3 (Reporting)

**As a** Compliance Lead for UAE entities  
**I want** to run the Emiratisation Report  
**So that** I can submit to MOHRE

**Acceptance Criteria:**
- Report includes: nationalisation % by sector
- Export to Excel and PDF
- Filter by supervisory organisation, date range

**BDD Scenarios:**

Scenario: Export Emiratisation report
  Given I am a Compliance Lead for UAE entities
  When I run the Emiratisation Report
  Then I get nationalisation % by sector
  And I can export to Excel for MOHRE submission

---

### Story 10: Kuwaitisation Report (Kuwait)
**Value Slice:** VS3 (Reporting)

**As a** Compliance Lead for Kuwait entities  
**I want** to run the Kuwaitisation Report  
**So that** I can submit for government compliance

**Acceptance Criteria:**
- Report includes: nationalisation % by sector
- Export to Excel and PDF
- Filter by supervisory organisation, date range

**BDD Scenarios:**

Scenario: Export Kuwaitisation report
  Given I am a Compliance Lead for Kuwait entities
  When I run the Kuwaitisation Report
  Then I get nationalisation % by sector
  And I can export to Excel for government submission

---

### Story 11: Enable GCC nationalisation per country
**Value Slice:** VS4 (Configuration)

**As an** HR Administrator  
**I want** to enable GCC nationalisation per country (Saudi, UAE, Kuwait)  
**So that** I can roll out independently based on customer needs

**Acceptance Criteria:**
- Tenant-level toggle for Saudi, UAE, Kuwait
- Enabling Saudi: application capture + Nitaqat dashboard + Nitaqat report
- Enabling UAE: application capture + Emiratisation dashboard + Emiratisation report
- Enabling Kuwait: application capture + Kuwaitisation dashboard + Kuwaitisation report

**BDD Scenarios:**

Scenario: Enable Saudi only
  Given I am configuring the tenant
  When I enable GCC nationalisation for Saudi only
  Then Saudi application capture, dashboard, and report are available
  And UAE/Kuwait features are not shown

---

### Story 12: Set nationalisation thresholds by country and sector
**Value Slice:** VS4 (Configuration)

**As an** HR Administrator  
**I want** to set nationalisation thresholds by country and sector  
**So that** dashboards and reports reflect our regulatory requirements

**Acceptance Criteria:**
- Configure Nitaqat tier thresholds (Green/Yellow/Red) for Saudi
- Configure Emiratisation % target for UAE (by sector if applicable)
- Configure Kuwaitisation quota for Kuwait (by sector if applicable)
- Dashboard and reports use configured values for compliance status

**BDD Scenarios:**

Scenario: Set Emiratisation target
  Given I am configuring thresholds for UAE
  When I set Emiratisation target to 20% for a sector
  Then the dashboard shows compliant when nationalisation >= 20%
  And at-risk when below 20%

---

### Story 13: Maintain Localization Settings integration
**Value Slice:** VS4 (Configuration)

**As an** HR Administrator  
**I want** Maintain Localization Settings to integrate with Primary Nationality  
**So that** existing localisation config is respected and I avoid duplication

**Acceptance Criteria:**
- GCC nationalisation uses same Primary Nationality field as Maintain Localization Settings
- No duplicate fields when both are enabled
- Application flow respects Maintain Localization Settings for Saudi, UAE, Kuwait

**BDD Scenarios:**

Scenario: Existing localisation respected
  Given Maintain Localization Settings has Primary Nationality enabled for Saudi
  When I enable GCC nationalisation for Saudi
  Then the application flow uses the same Primary Nationality field
  And no duplicate nationality fields appear

---

## Jira Configuration

- **Project:** HRREC
- **Component:** Recruiting Purge
- **Assignee:** David Denham
- **Labels:** gcc, compliance, nationalization, VS1, VS2, VS3, VS4 (per story)
