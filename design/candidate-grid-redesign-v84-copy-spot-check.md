# Copy Spot-Check: Candidate Grid Redesign v84 (Final)

**Reviewer:** Doc Writer (319)  
**Date:** 31 March 2026  
**Prototype:** `design/gcc-candidate-grid-search.tsx`  
**Route:** `/candidate-grid-v84`  
**Status:** ✅ APPROVED

---

## Spot-Check Scope

This is a **final validation** of implemented copy against the approved Copy Review (`design/candidate-grid-redesign-v84-copy-review.md`). All copy was pre-approved in the initial review; this confirms correct implementation.

---

## Copy Implementation Validation

### 319 Revisions Applied ✅

**1. HiredScore Filter Labels (En Dash Correction)**

❌ Original: "A - Strong Fit (85-100%)"  
✅ Implemented: "A – Strong Fit (85–100%)"

**Status:** ✅ **CORRECT** - En dash used for ranges throughout filter sidebar.

**2. Empty State Specificity**

❌ Original: "No candidates match your filters. Try clearing some filters or adjusting your search."  
✅ Implemented: "No candidates match your current filters. Try clearing filters or broadening your search criteria."

**Status:** ✅ **CORRECT** - More actionable language implemented.

**3. True Empty State (Zero Candidates)**

✅ Implemented: "No candidates have applied to this requisition yet. Post your job to career sites to start attracting candidates."

**Status:** ✅ **PRESENT** - Alternate copy path for zero candidates exists in code (not shown with current mock data, but correctly wired).

---

### Key Copy Elements Validation

| Element | Approved Copy | Implemented | Status |
|---------|---------------|-------------|--------|
| Page title | "Senior Product Manager - Candidates" | ✅ | CORRECT |
| Section header | "Active Candidates" | ✅ | CORRECT |
| Filter title | "Filters" | ✅ | CORRECT |
| Clear button | "Clear All" | ✅ | CORRECT |
| Saved views | "My Top Picks", "New Today", "Needs Review" | ✅ | CORRECT |
| Quick view pills | "All Active (127)", "New Today (12)", "High Score (A–B) (45)", "Needs Review (23)" | ✅ | CORRECT (en dash) |
| Bulk actions | "Move to Stage", "Send Message", "Export", "Deselect All" | ✅ | CORRECT |
| Table headers | "Name", "HiredScore", "Location", "Source", "Stage", "Applied", "Actions" | ✅ | CORRECT |
| HiredScore labels | "Strong fit", "Good fit", "Moderate fit", "Developing fit" | ✅ | CORRECT |
| Row actions | "Move Forward", "Schedule Interview", "Send Message", "Reject" | ✅ | CORRECT |
| Pagination | "Showing 1-20 of 127 candidates" | ✅ | CORRECT |
| HiredScore tooltip | "AI-powered candidate matching score based on skills, experience, and job requirements. Scores are suggestions; always review candidates individually." | ✅ | CORRECT |
| Selection count | "[N] selected" (aria-live) | ✅ | CORRECT |

---

### Accessibility Copy ✅

**ARIA Labels Validation:**

| Element | ARIA Label | Status |
|---------|------------|--------|
| Pagination Previous | "Previous page" | ✅ |
| Pagination Next | "Next page" | ✅ |
| Pagination Page N | "Go to page N" | ✅ |
| Select All Checkbox | "Select all candidates on this page" | ✅ |
| Row Checkbox | "Select [Name]" | ✅ |
| Stage Progress | "[Stage name] progress" | ✅ |
| HiredScore Tooltip | Includes breakdown + transparency text | ✅ |

**Screen Reader Announcements:**
- Selection count updates announced via aria-live="polite" ✅
- Sort state communicated via aria-sort attributes ✅

---

### Workday Terminology Compliance ✅

| Term | Usage | Compliance |
|------|-------|------------|
| Requisition | "Senior Product Manager" (req title) | ✅ CORRECT |
| Candidate | "Active Candidates", "127 candidates" | ✅ CORRECT |
| Stage | "Stage" column header, stage pills | ✅ CORRECT |
| Source | "Source" column, "All Sources" filter | ✅ CORRECT |
| HiredScore | "HiredScore" column header | ✅ CORRECT (product name) |
| Interview | "Schedule Interview" action | ✅ CORRECT |

**No abbreviations or jargon identified.** ✅

---

### Capitalization Standards ✅

| Element Type | Standard | Implementation | Status |
|--------------|----------|----------------|--------|
| Page titles | Title Case | "Senior Product Manager - Candidates" | ✅ |
| Buttons | Title Case | "Move to Stage", "Clear All" | ✅ |
| Table headers | Title Case | "Name", "HiredScore", "Stage" | ✅ |
| Body text | Sentence case | "Showing 1-20 of 127 candidates" | ✅ |
| Field labels | Sentence case | "Filters" (section header) | ✅ |

---

### Legal-Sensitive Copy Check ✅

**Scope:** No legal-sensitive copy present (as confirmed in initial 319 review).

**HiredScore AI Disclosure:** ✅ COMPLIANT
- Tooltip includes transparency text: "AI-powered candidate matching score..."
- Clarifies scores are suggestions, not automated decisions
- Human review emphasized: "always review candidates individually"

**060 Legal Review Required?** ❌ **No** - Internal recruiter tooling with appropriate AI transparency.

---

## Issues Found

### 🟢 None (All Copy Correct)

All approved copy from initial 319 review correctly implemented. No deviations, typos, or compliance issues identified.

---

## Final Verdict

**Copy Quality:** ✅ **APPROVED FOR PRODUCTION**

**Confidence:** 10/10

**Rationale:**
- All 319 revisions applied correctly (en dash, empty state, tooltip)
- Workday terminology used consistently throughout
- Capitalization standards met
- ARIA labels present and accurate
- No legal-sensitive copy requiring 060 review
- No typos or deviations from approved copy

**Ready for:** Figma Capture (330) → Production Release

---

*Copy Spot-Check Complete - 319 Final Approval*
