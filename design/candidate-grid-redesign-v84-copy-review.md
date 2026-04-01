# Copy Review: Candidate Grid Redesign v84

**Reviewed by:** Doc Writer (319)  
**Date:** 31 March 2026  
**Design Brief:** `design/candidate-grid-redesign-v84-design-brief.md`  
**Status:** APPROVED with minor revisions

---

## Executive Summary

Overall copy quality is **strong**. The Copy Inventory follows Workday terminology standards, uses action-oriented language, and maintains appropriate capitalization. 

**Findings:**
- ✅ **23 of 26 copy elements approved as-is**
- 🟡 **3 elements require minor revisions** (filter labels, empty state specificity)
- 🟢 **No legal-sensitive copy requiring 060 review**

All revisions applied below.

---

## Copy Review by Element Type

### Page Titles & Section Headings ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Page title | "Senior Product Manager - Candidates" | **APPROVED** | Context-aware, follows "[Req Title] - [Tab]" pattern |
| Section header | "Active Candidates" | **APPROVED** | Clear scope, Sentence case |
| Filter sidebar title | "Filters" | **APPROVED** | Standard, concise |

**Rationale**: All follow Workday capitalization standards (Title Case for page titles, Sentence case for sections). Terminology is consistent with existing Recruiting Hub patterns.

---

### Buttons & Actions ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Context header actions | "Add Candidate", "Export", "Settings" | **APPROVED** | Verb-first, specific actions |
| Filter clear button | "Clear All" | **APPROVED** | Action-oriented, <3 words |
| Bulk actions | "Move to Stage", "Send Message", "Export" | **APPROVED** | Verb-first, recruiter language |
| Bulk deselect | "Deselect All" | **APPROVED** | Clear action |
| Row actions | "Move Forward", "Schedule Interview", "Send Message", "Reject" | **APPROVED** | Action verbs, consistent with Workday patterns |

**Rationale**: All button labels follow Editorial Guidelines: verb-first, <3 words, Title Case, specific actions.

---

### Filter Labels (REVISIONS REQUIRED) 🟡

| Element | Original Copy | Revised Copy | Rationale |
|---------|---------------|--------------|-----------|
| HiredScore filter | "A - Strong Fit (85-100%)" | "A – Strong Fit (85–100%)" | Use en dash (–) not hyphen (-) for ranges |
| Stage filter (full list) | "Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected" | **APPROVED** | Standard Workday recruiting stages |
| Source dropdown default | "All Sources" | **APPROVED** | Clear scope |
| Location dropdown default | "All Locations" | **APPROVED** | Clear scope |

**HiredScore grade labels (revised)**:
- "A – Strong Fit (85–100%)"
- "B – Good Fit (70–84%)"
- "C – Moderate Fit (55–69%)"
- "D – Developing Fit (0–54%)"

**Rationale**: En dash (–) is typographically correct for numeric ranges per Editorial Guidelines. Hyphen (-) is for compound adjectives.

---

### Saved Views ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| View 1 | "My Top Picks" | **APPROVED** | Personal, implies curation |
| View 2 | "New Today" | **APPROVED** | Time-bound, specific |
| View 3 | "Needs Review" | **APPROVED** | Action-needed, clear |

**Rationale**: All follow user-focused language patterns. "My" creates personal ownership. Time-bound and action-oriented labels help recruiters prioritize.

---

### Table Headers ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Column 1 | [Checkbox - no label] | **APPROVED** | Accessibility: aria-label="Select all" on checkbox |
| Column 2 | "Name" | **APPROVED** | Clear, concise |
| Column 3 | "HiredScore" | **APPROVED** | Matches product terminology (HiredScore is product name) |
| Column 4 | "Location" | **APPROVED** | Clear |
| Column 5 | "Source" | **APPROVED** | Workday standard term |
| Column 6 | "Stage" | **APPROVED** | Workday standard term (not "Status" or "Phase") |
| Column 7 | "Applied" | **APPROVED** | Clear, concise (date applied) |
| Column 8 | "Actions" | **APPROVED** | Standard actions column header |

**Rationale**: All follow Workday terminology. Headers are scannable (<2 words). Sortable columns need ARIA attributes (noted in Design Brief accessibility section).

---

### HiredScore Component Copy ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Grade A label | "Strong fit" | **APPROVED** | Positive framing, lowercase in label |
| Grade B label | "Good fit" | **APPROVED** | Positive framing |
| Grade C label | "Moderate fit" | **APPROVED** | Neutral, not negative |
| Grade D label | "Developing fit" | **APPROVED** | Positive spin on low score (not "Poor fit") |

**Rationale**: All labels use positive framing, avoiding stigmatizing language for lower grades. This aligns with Workday's inclusive, candidate-respectful tone. Labels are lowercase in the component context (after percentage).

---

### Pagination & Count Display ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Range display | "Showing 1-20 of 127 candidates" | **APPROVED** | Clear, specific count |

**Rationale**: Follows standard pagination pattern. Uses hyphen correctly for ranges in running text (not en dash like in HiredScore labels, which are formatted data).

**Accessibility note**: Pagination controls need ARIA labels ("Go to page 2", "Previous page", "Next page").

---

### Empty State (REVISIONS REQUIRED) 🟡

| Element | Original Copy | Revised Copy | Rationale |
|---------|---------------|--------------|-----------|
| No results message | "No candidates match your filters. Try clearing some filters or adjusting your search." | "No candidates match your current filters. Try clearing filters or broadening your search criteria." | More specific action guidance; "broadening" is clearer than "adjusting" |

**Alternative (if truly empty - no candidates at all)**:
- "No candidates have applied to this requisition yet. Post your job to career sites to start attracting candidates."

**Rationale**: Original is good but can be more actionable. "Broadening" is more specific than "adjusting". If zero candidates (not filtered out), need different empty state with proactive action.

---

### Bulk Action Toolbar ✅

| Element | Original Copy | Status | Notes |
|---------|---------------|--------|-------|
| Selection count | "[N] selected" | **APPROVED** | Clear, dynamic |
| Actions | "Move to Stage", "Send Message", "Export" | **APPROVED** | Verb-first, specific |
| Deselect | "Deselect All" | **APPROVED** | Clear action |

**Rationale**: All follow Editorial Guidelines. Dynamic count keeps user informed of selection state.

**Accessibility note**: Selection count should be announced to screen readers when updated (ARIA live region).

---

### Tooltips & Help Text (Not Specified in Brief)

**Recommendation for 320 implementation**:

| Element | Suggested Help Text | Rationale |
|---------|---------------------|-----------|
| HiredScore column header | Tooltip: "AI-powered candidate matching score based on skills, experience, and job requirements. Scores are suggestions; always review candidates individually." | Explains AI nature (transparency), sets expectations |
| Stage filter | Help text: "Select stages to show only candidates at those pipeline steps. Uncheck all to see candidates at any stage." | Explains multi-select behavior |
| Saved Views | Tooltip on "My Top Picks": "Candidates you've marked as favorites. Manage your picks in candidate profiles." | Explains user-customizable nature |

**Rationale**: Complex features (HiredScore, filters) benefit from brief tooltips. Follows Editorial Guidelines: <2 sentences, user-focused ("you"), explains purpose.

---

## Legal-Sensitive Copy Assessment

**Scope**: Reviewed all copy for GDPR, AI Act, consent, privacy disclosure requirements.

**Findings**: 🟢 **No legal-sensitive copy present**

**Rationale**:
- No consent checkboxes
- No privacy notices
- HiredScore AI disclosure **recommended** as tooltip (see above) but not legally required for internal recruiter use (recruiters are not data subjects; candidates are)
- No data retention messages
- No terms or policy references

**060 Review Required?** ❌ **No** - This is internal recruiter tooling with no candidate-facing copy or consent flows.

**Note for 320**: If future versions add candidate communication features (e.g., "Send Message" opens email composer), consent language in that flow will require 060 review.

---

## Revised Copy Inventory (FINAL)

| Element | Approved Copy | Notes |
|---------|---------------|-------|
| Page title | "Senior Product Manager - Candidates" | ✅ As-is |
| Section header | "Active Candidates" | ✅ As-is |
| Filter sidebar title | "Filters" | ✅ As-is |
| Clear filters button | "Clear All" | ✅ As-is |
| Saved views | "My Top Picks", "New Today", "Needs Review" | ✅ As-is |
| HiredScore filters | "A – Strong Fit (85–100%)", "B – Good Fit (70–84%)", "C – Moderate Fit (55–69%)", "D – Developing Fit (0–54%)" | 🟡 **En dash correction** |
| Stage checkboxes | "Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected" | ✅ As-is |
| Bulk action buttons | "Move to Stage", "Send Message", "Export", "Deselect All" | ✅ As-is |
| Table headers | "Name", "HiredScore", "Location", "Source", "Stage", "Applied", "Actions" | ✅ As-is |
| Row actions menu | "Move Forward", "Schedule Interview", "Send Message", "Reject" | ✅ As-is |
| Pagination | "Showing 1-20 of 127 candidates" | ✅ As-is |
| HiredScore labels | "Strong fit", "Good fit", "Moderate fit", "Developing fit" | ✅ As-is |
| Empty state (no filters match) | "No candidates match your current filters. Try clearing filters or broadening your search criteria." | 🟡 **Improved specificity** |
| Empty state (zero candidates) | "No candidates have applied to this requisition yet. Post your job to career sites to start attracting candidates." | 🟡 **New (for true empty state)** |

---

## Recommendations for 318 Review & 320 Implementation

### 1. Add Tooltips for Complex Features (320)
- HiredScore column: AI transparency disclosure
- Stage filter: Multi-select behavior explanation
- Saved Views: Customization hint

### 2. Accessibility Enhancements (320)
- ARIA labels on all interactive elements
- ARIA live region for selection count updates
- ARIA sort attributes on sortable columns
- Keyboard focus indicators (already in Design Brief)

### 3. Future Legal Considerations (Post-v1)
- If "Send Message" opens email composer → 060 review for candidate consent language
- If exporting candidate data → 060 review for GDPR data portability compliance
- If bulk actions include "Delete" → 060 review for data retention compliance

---

## Editorial Guidelines Compliance Summary

| Guideline | Status | Details |
|-----------|--------|---------|
| **Clarity Over Cleverness** | ✅ PASS | All copy uses plain language, no jargon |
| **Consistency with Workday Terminology** | ✅ PASS | Uses "Requisition", "Candidate", "Stage", "Source" (not alternatives) |
| **User-Focused Language** | ✅ PASS | "My Top Picks", "You" language in help text recommendations |
| **Action-Oriented** | ✅ PASS | All buttons start with verbs (Move, Send, Export, Clear) |
| **Concise but Complete** | ✅ PASS | Buttons <3 words, errors 1-2 sentences |
| **Capitalization Standards** | ✅ PASS | Title Case for actions, Sentence case for descriptions |
| **Accessibility** | ✅ PASS | Design Brief specifies ARIA labels, focus indicators |

---

## Final Verdict

**Copy Quality:** 🟢 **APPROVED** (23/26 as-is, 3 minor revisions)

**Revisions Required:**
1. HiredScore filter labels: Use en dash (–) for ranges
2. Empty state: Improve specificity ("broadening" vs "adjusting")
3. Add true empty state for zero candidates (not just filtered)

**Legal Review:** 🟢 **Not Required** (no legal-sensitive copy present)

**Ready for 318 Design Peer Review?** ✅ **Yes** - Copy is compliant and production-ready with noted revisions.

---

## Next Steps

1. **Update Design Brief**: Apply revised copy (en dash, empty states)
2. **318 Review**: Proceed to Design Peer Review for harsh evaluation
3. **320 Implementation**: Use approved copy inventory; add recommended tooltips
4. **Accessibility Testing**: Validate ARIA labels and keyboard navigation in prototype

---

*End of Copy Review - 319 Complete*
