# GCC Interview Scheduling - Story Map

**Epic:** GCC-Compliant Interview Scheduling  
**Source:** docs/prds/gcc-interview-scheduling-prd.md  
**Created:** March 17, 2026

---

## Epic (User Story Format)

**As a** GCC recruiter  
**I want** interview scheduling with built-in compliance rules (KSA panel, Kuwait notice)  
**So that** I can coordinate interviews efficiently without manual compliance tracking

---

## User Activities (Horizontal Backbone)

| Activity 1 | Activity 2 | Activity 3 | Activity 4 |
|------------|------------|------------|------------|
| Initiate scheduling | Select panel | Validate compliance | Confirm & notify |
| | | | |

---

## User Tasks (Vertical Slices)

### Activity 1: Initiate scheduling
- Open requisition and click "Schedule Interview"
- Select candidate and candidate location
- Select interview date

### Activity 2: Select panel
- Search/view available interviewers
- Select panel members (with nationality visible)
- Check panel composition against KSA rule

### Activity 3: Validate compliance
- KSA panel rule: ≥50% Saudi nationals
- Kuwait 3-day notice enforcement
- Display compliance indicators (pass/warning)
- Block or warn on non-compliant configurations

### Activity 4: Confirm & notify
- Review proposed schedule
- Confirm interview
- Send candidate confirmation (email/WhatsApp)
- Log audit trail (panel, notice, consent)

---

## Value Slices

### VS1: Compliance Foundation
**Goal:** Reduce KSA/Kuwait compliance violations to <5% of interviews

**Stories:**
1. Validate KSA panel composition before scheduling
2. Enforce Kuwait 3-day notice for Kuwait candidates
3. Display compliance status indicators (pass/warning)
4. Block scheduling when Kuwait notice violated
5. Log panel composition and notice period for audit trail

### VS2: Recruiter Efficiency
**Goal:** Decrease average scheduling time from 45min to 20min

**Stories:**
6. Panel member search with nationality filter
7. Bulk panel selection for recurring requisitions
8. Quick-schedule templates (common panel configurations)
9. In-context compliance hints during panel selection

### VS3: Candidate Experience
**Goal:** Increase candidate response rate from 60% to 80%

**Stories:**
10. WhatsApp confirmation for GCC candidates
11. Self-service reschedule with compliance re-validation
12. Candidate consent capture for Kuwait notice waiver (when applicable)
13. Multi-language confirmation (English/Arabic)

---

## Story Count by Value Slice

| Value Slice | Story Count | Measurable Goal |
|-------------|-------------|-----------------|
| VS1 | 5 | <5% compliance violations |
| VS2 | 4 | 45min → 20min scheduling time |
| VS3 | 4 | 60% → 80% response rate |
| **Total** | **13** | |

---

## Proposed User Stories (MVP = VS1)

### Story 1: Validate KSA panel composition before scheduling
**Value Slice:** VS1

**As a** GCC recruiter in Saudi Arabia  
**I want** the system to validate that my interview panel includes ≥50% Saudi nationals  
**So that** I comply with Nitaqat requirements before confirming the interview

**Acceptance Criteria:**
- System checks panel composition when recruiter clicks "Schedule Interview"
- If <50% Saudi nationals, display warning: "KSA compliance: Panel requires ≥50% Saudi nationals (Nitaqat)"
- Recruiter can proceed (warning only, not blocking) or adjust panel
- Panel composition logged for audit trail

**BDD Scenarios:**
- Scenario: Panel meets KSA 50% requirement
- Scenario: Panel does not meet KSA 50% requirement

---

### Story 2: Enforce Kuwait 3-day notice for Kuwait candidates
**Value Slice:** VS1

**As a** GCC recruiter scheduling for Kuwait candidates  
**I want** the system to enforce a 3-day minimum notice between invitation and interview  
**So that** I comply with Kuwait labour law (Article 67)

**Acceptance Criteria:**
- When candidate location is Kuwait, date picker blocks dates <3 days from today
- Display message: "Kuwait labour law requires 3-day notice. Earliest available: [date]"
- Recruiter cannot proceed until compliant date selected

**BDD Scenarios:**
- Scenario: Kuwait candidate, compliant date selected
- Scenario: Kuwait candidate, non-compliant date attempted

---

### Story 3: Display compliance status indicators
**Value Slice:** VS1

**As a** GCC recruiter  
**I want** clear visual indicators showing compliance status (pass/warning)  
**So that** I know at a glance whether my configuration meets GCC requirements

**Acceptance Criteria:**
- Green check for KSA Panel Rule when compliant
- Green check for Kuwait notice when compliant or N/A
- Yellow warning when KSA panel non-compliant
- Red block when Kuwait notice violated

---

### Story 4: Block scheduling when Kuwait notice violated
**Value Slice:** VS1

**As a** GCC recruiter  
**I want** the system to block scheduling when Kuwait 3-day notice is violated  
**So that** I cannot accidentally schedule non-compliant interviews

**Acceptance Criteria:**
- "Schedule Interview" button disabled when Kuwait candidate + date <3 days
- Tooltip explains: "Select a date at least 3 days from today for Kuwait candidates"

---

### Story 5: Log panel composition and notice period for audit trail
**Value Slice:** VS1

**As a** Recruiting Operations / Compliance Lead  
**I want** panel composition, notice period, and candidate consent logged automatically  
**So that** I can generate compliance reports for government filings without manual extraction

**Acceptance Criteria:**
- On interview confirmation, system logs: panel members + nationalities, notice period (hours), candidate consent (if Kuwait waiver)
- Data available for "GCC Interview Compliance Report"
- Export to CSV for Nitaqat/Emiratisation filings

---

## Jira Configuration

- **Project:** HRREC
- **Component:** Recruiting Purge
- **Assignee:** David Denham
- **Labels:** VS1, VS2, VS3 (per story)
