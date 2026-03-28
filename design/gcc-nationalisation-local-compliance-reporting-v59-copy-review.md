# UX copy review: GCC nationalisation and local compliance reporting (v59)

**Brief:** `design/gcc-nationalisation-local-compliance-reporting-v59-discovery-brief.md`  
**Date:** 25 March 2026  
**Pipeline:** GCC E2E-019 — **319** checkpoint before **315** PASS 3–4  

---

## Summary

• **Total strings reviewed:** Full Copy inventory from Discovery Brief PASS 2  
• **Critical issues:** None (errors already follow problem + solution)  
• **Quick wins:** Success and export messages tightened for past tense / clarity  
• **Legal-sensitive strings:** Flagged for **060**; wording below is **approved for prototype** pending any org legal edits  

---

## Approved copy (canonical for **320**)

Use these strings exactly in the prototype unless legal requests a change.

### Buttons and CTAs

| Element | Approved copy |
|--------|----------------|
| Primary run | Run report |
| Export (toolbar / row) | Export |
| Export formats | Export to CSV · Export to Excel |
| Tertiary | View details · Open run · Download validation summary |
| Save | Save changes |
| Dismiss | Cancel · Close |
| Modal primary | Confirm run |

### Form labels and help text

| Label | Help text (where shown) |
|-------|-------------------------|
| Programme | Filter reports for a specific GCC programme. |
| Search reports | Search by report name or keyword. |
| Period | Choose the reporting period for this run. |
| Include closed requisitions | Include candidates tied to closed requisitions when selected. |
| Enable United Arab Emirates programme reports | (checkbox; no help on rail) |
| Enable Kingdom of Saudi Arabia programme reports | (checkbox) |
| Enable Kuwait programme reports | (checkbox) |
| Map legacy field to reference dimension | (illustrative `FormSelect` label) |
| Reference dimension | (illustrative `FormSelect` label) |

### Error messages

• Unable to run report. Check your connection and try again.  
• You don’t have access to this report. Contact your Workday administrator.  
• Select a period before you run the report.  

### Success / confirmation

• Report run finished  
• Export started. You’ll get a file download when it’s ready.  
• Export complete  
• Programme settings saved  

### Empty states

| Context | Heading | Body | CTA |
|---------|---------|------|-----|
| Catalogue filter | No reports match your filters | Try another programme or clear search. | Clear filters |
| Run history | No run history yet | Run a programme report to see it listed here. | Go to report catalogue |
| Data quality | No validation issues found | We’ll list data gaps when the validation job finds them. | — |

### Loading states

• Loading reports…  
• Running report…  
• Loading run history…  
• Saving changes…  

### Legal / compliance (060-sensitive — use verbatim unless Legal substitutes)

**Disclaimer (page or modal footer):**  
Figures support internal management review and evidence assembly from Recruiting data. They do not constitute legal advice, regulator-ready submissions, or a substitute for your organisation’s statutory audit processes.

**Programme setup help:**  
Your organisation defines how programme fields map to its legal obligations. Workday does not calculate government fines or penalties.

**Run metadata caption:**  
As-run snapshot. Definition version is shown for traceability.

---

## Rationale (high level)

• **Sentence case** maintained on all UI strings.  
• **You don’t** / **You’ll** / **doesn’t** for natural contractions in UI.  
• **Workday administrator** specified in access error for clarity vs generic “administrator”.  
• **Select a period before you run the report** adds explicit action (run) after fix.  
• Success lines use **finished** / **started** / **complete** / **saved** for consistent past or state clarity.  
• Legal block keeps **do not constitute** / **does not calculate** for precision; non-legal strings use contractions where scannable.  

---

## Legal validation status

**060:** Strings in **Legal / compliance** reviewed for transparency, non-misleading claims, and alignment with internal-recruiter context. **No candidate-facing consent** on this surface. **Final binding copy** remains with Legal for production.

---

*Workday Confidential — editorial pass for GCC E2E design chain.*
