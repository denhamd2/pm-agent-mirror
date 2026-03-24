# Copy Review: GCC Nationalization OOB Fields

**Discovery Brief:** `design/gcc-nationalization-oob-v56-discovery-brief.md`  
**Reviewer:** 319-doc-writer  
**Date:** 24 March 2026

---

## Summary
- **Total issues:** 3
- **Critical:** 0
- **Quick wins:** 2
- **Legal-sensitive:** 1 (060 flagged)

---

## Copy Inventory Review

### ✅ APPROVED (No Changes Needed)

**Screen A - Tenant Config:**
- "GCC Nationalization Configuration" ✅
- "Country" ✅
- "Quota Target (%)" ✅
- "Save configuration" ✅

**Screen B - Dashboard:**
- "Nationalization Compliance" ✅
- "Country | Hired | Target | Status" ✅

---

### Quick Wins (2)

#### 1. Help Text - Be More Specific
**Current:** "Enter target percentage for this country (e.g., 60 for Saudi Arabia)"  
**Issue:** Example assumes Saudi; could confuse other countries  
**✅ Recommended:** "Enter target percentage (0-100). Example: 60 for Saudization, 20 for Emiratization"  
**Rationale:** Clarifies both countries have different targets; more inclusive

#### 2. Empty State - Action-Oriented
**Current:** "No nationalization quotas configured. Set up targets in Admin > Tenant Setup."  
**Issue:** Slightly passive; could be more actionable  
**✅ Recommended:** "No nationalization quotas configured. Go to Admin > Tenant Setup > Nationalization to set targets."  
**Rationale:** Specific path reduces navigation friction

---

### Legal-Sensitive (060 Review Required)

#### 3. Legal Notice Wording
**Current:** "This information is collected for nationalization quota compliance purposes only."  
**Issue:** Legal-sensitive copy; needs 060 validation for GDPR/PDPL compliance  
**Status:** ⚠️ FLAGGED for 060 review before prototype finalization  
**Alternative (if 060 suggests):** "This information is used for government-mandated nationalization reporting. See Privacy Policy."  
**Action:** 320 can implement current wording; get 060 final approval before 330 Figma

---

## Dropdown Labels - Editorial Pass

**Current:** "Saudi Arabian" | "Emirati" | "Kuwaiti" | "Bahraini" | "Omani" | "Qatari"  
**Issue:** Consistent nationality adjective form  
**✅ Recommended:** Keep as-is (correct editorial form)  
**Rationale:** These are standard English nationality adjectives; accurate and clear

---

## Overall Assessment

Copy quality is **strong**. All text follows Editorial Guidelines (sentence case, action-oriented, concise). Two quick wins improve clarity. Legal notice needs 060 validation per standard protocol for compliance-related copy.

**Status:** APPROVED with quick wins applied + 060 flag noted for handoff to 320.

---
