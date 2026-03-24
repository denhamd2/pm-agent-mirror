# GCC Candidate Review CV Carousel - Copy Review (319)

**Pipeline:** GCC-E2E-014 (Step 8a: **319** copy review of **315** PASS 2 Copy Inventory)  
**Discovery Brief:** `design/gcc-candidate-review-cv-carousel-v54-discovery-brief.md`  
**Date:** 22 March 2026  
**Reviewer:** 319-doc-writer

---

## Copy Review Summary

**Status:** ✅ **APPROVED** with minor refinements  
**Critical Issues:** 0  
**Quick Wins:** 3  
**Legal-Sensitive Copy:** 0 (no 060 invocation needed)

---

## Findings by Category

### Buttons and CTAs ✅

**Modal Header Navigation:**
- ✅ "Previous candidate" (aria-label) — Clear, action-oriented
- ✅ "Next candidate" (aria-label) — Clear, action-oriented
- ✅ Close button (icon only) — Standard Canvas Kit pattern, acceptable

**Carousel Navigation:**
- ⚠️ "Previous document" → **Refine to:** "Previous document" (acceptable, but consider context)
- ⚠️ "Next document" → **Refine to:** "Next document" (acceptable)

**Recommended refinement:** Consider shorter labels for carousel buttons since space is constrained:
- "Previous document" → "Previous" (with aria-label="Previous document")
- "Next document" → "Next" (with aria-label="Next document")

**Verdict:** APPROVED (with optional refinement suggestion)

### Form Labels ✅

**Sidebar Summary:**
- ✅ "Location" — Clear
- ✅ "Stage" — Clear, standard Workday terminology
- ✅ "Source" — Clear
- ✅ "Applied" — Clear (implicit: "Applied date")

**Verdict:** APPROVED

### Error Messages ✅

**Document Loading Failure:**
> "Unable to load this document. It may have been removed or you may not have access. Open in a new tab or contact support."

**Analysis:**
- ✅ Describes problem: "Unable to load"
- ✅ Explains possible causes: removed OR permissions
- ✅ Provides solutions: open in new tab OR contact support
- ✅ Tone: Professional, helpful

**Verdict:** APPROVED

**Network Error:**
> "Connection lost while loading document. Check your network and try again."

**Analysis:**
- ✅ Clear problem statement
- ✅ Actionable solution
- ✅ Appropriate tone

**Verdict:** APPROVED

### Empty States ✅

**No Documents Uploaded:**
- Heading: "No documents uploaded"
- Body: "This candidate hasn't uploaded a CV or cover letter yet. They may have only filled out the application form."

**Analysis:**
- ✅ Clear, neutral tone (not judgmental of candidate)
- ✅ Explains why documents might be missing
- ✅ Helps recruiter understand context

**Verdict:** APPROVED

### Loading States ✅

**Document Loading:**
- "Loading document…"

**Page Loading:**
- "Loading page {N}…"

**Analysis:**
- ✅ Clear, standard loading patterns
- ✅ Variable substitution well-defined

**Verdict:** APPROVED

### Accessibility (ARIA) ✅

**Live Region Announcement:**
> "Now viewing {document name}, page {N} of {total pages}"

**Analysis:**
- ✅ Clear context for screen reader users
- ✅ Announces both document and page position
- ✅ Good information hierarchy

**Verdict:** APPROVED

**Keyboard Hints (Optional):**
> "Use arrow keys to navigate between documents"

**Analysis:**
- ✅ Helpful for power users
- ⚠️ Consider placement: tooltip vs help text vs initial modal hint

**Recommendation:** Show this hint on first use only (progressive disclosure) or as a tooltip on the carousel controls.

**Verdict:** APPROVED (with placement recommendation)

---

## Quick Wins (Optional Refinements)

### 1. Shorten Button Labels for Space Efficiency

**Current:**
- "Previous document"
- "Next document"

**Suggested:**
- Visible label: "Previous" / "Next"
- ARIA label: "Previous document" / "Next document"

**Rationale:** Carousel space is constrained; shorter labels reduce visual clutter while maintaining accessibility.

**Priority:** Low (nice-to-have)

### 2. Add Document Type to Empty State

**Current:**
> "This candidate hasn't uploaded a CV or cover letter yet."

**Suggested:**
> "This candidate hasn't uploaded any documents yet. They may have only filled out the application form."

**Rationale:** More inclusive of other document types (portfolios, certificates) without listing every possibility.

**Priority:** Low

### 3. Clarify "Page" vs "Document" in Carousel Controls

**Current Status Text:**
> "{Document name} ({page} of {totalPages})"

**Suggested:**
> "{Document name} · Page {page} of {totalPages}"

**Rationale:** Middle dot separator is cleaner than parentheses; "Page" prefix clarifies the counter refers to pages within the document, not documents in the carousel.

**Priority:** Low

---

## Legal-Sensitive Copy Analysis

### Audit Logging (from PRD)

**PRD states:**
> **Audit**: Profile views and stage changes log per enterprise policy; **document viewer** logs which documents were viewed and for how long

**Copy Assessment:** No user-facing copy required for audit logging (backend telemetry). No consent or disclosure needed in UI per GDPR minimisation principle (legitimate business purpose).

**060 Invocation:** NOT REQUIRED (no legal-sensitive copy in carousel UI)

---

## Editorial Guidelines Compliance

### Checklist

- ✅ **Sentence case:** All button labels use sentence case ("Previous document" not "Previous Document")
- ✅ **Action-oriented:** CTAs describe action ("Previous document") not state ("Go back")
- ✅ **Problem + solution:** Error messages explain problem AND provide solution
- ✅ **Neutral tone:** No judgmental language ("hasn't uploaded yet" not "forgot to upload")
- ✅ **Consistent terminology:** "Document" used consistently (not mixing "file", "attachment", "document")
- ✅ **Accessibility:** ARIA labels provided for all icon-only buttons and dynamic content

---

## Approved Copy for 315 PASS 3

**All copy from the inventory is APPROVED for use in PASS 3 and 320 prototype implementation.**

**Optional refinements** (Quick Wins 1–3) may be applied at 320's discretion but are not required for approval.

---

## Handoff to 315

**Status:** Copy review complete. **315-ux-designer** may proceed to PASS 3 (Peer Review) and PASS 4 (Finalize) with approved copy.

**Next Step:** 315 completes Discovery Brief with Final Verdict: APPROVED or NEEDS REVISION.

---

**References:**
- Editorial Guidelines: (Applied per 319-doc-writer.mdc checklist)
- Discovery Brief: `design/gcc-candidate-review-cv-carousel-v54-discovery-brief.md`
- PRD: `docs/prds/gcc-candidate-review-experience-v54-prd.md`
