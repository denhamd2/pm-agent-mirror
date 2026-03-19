# Bulk Candidate Rejection - PRD

**Feature**: Bulk Candidate Rejection
**Status**: Draft
**Created**: Wednesday Mar 18, 2026
**Owner**: David Denham

---

## Problem Statement

Recruiters need to reject multiple candidates at once (e.g., after filling a requisition or when candidates are no longer viable). Currently, they must reject candidates one by one, which is time-consuming when dealing with 50+ candidates per requisition.

## User Stories

**As a recruiter**, I want to reject multiple candidates at once, so that I can efficiently close out requisitions and manage my candidate pipeline.

**As a hiring manager**, I want bulk rejection to include personalized messages, so that candidates receive professional communication even in bulk actions.

## Success Criteria

- Recruiters can select and reject 2-100 candidates in a single action
- Rejection reason is required (dropdown selection)
- Optional email notification to candidates
- Action completes in < 5 seconds for 50 candidates
- Audit trail captures bulk action and timestamp

## Requirements

### Functional
- Select multiple candidates from candidate list
- Choose rejection reason (dropdown)
- Optional email template selection
- Confirmation before executing
- Success/error messaging

### Non-Functional
- Performance: Handle 100 candidates without timeout
- Accessibility: Keyboard navigation, screen reader support
- Security: Respect candidate access permissions
- Audit: Log bulk action with user, timestamp, candidates affected

## Compliance Considerations

- GDPR: Rejection triggers data retention countdown (12-month purge)
- Audit: Bulk action must be logged for compliance reporting
- Candidate notification: Must include opt-out link per GDPR Art. 21

---

## Out of Scope

- Bulk approval/hire actions (separate feature)
- Advanced filtering beyond standard list filters
- Scheduling future rejections
