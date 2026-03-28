# Copy spot-check: GCC nationalisation and local compliance reporting (v59)

**Mission:** GCC-E2E-019 — Step 9 (319 final spot-check)  
**Date:** 25 March 2026  
**Prototype:** `design/gcc-nationalisation-local-compliance-reporting-v59.tsx`  
**Approved copy (SSOT):** `design/gcc-nationalisation-local-compliance-reporting-v59-copy-review.md`

---

## Summary

| Result | Count |
|--------|-------|
| **PASS** | 33 canonical strings (`C` object vs approved doc, character-identical) |
| **FAIL** | 0 |
| **Informational** | 2 approved error strings present in `C` but not referenced in any render path; navigation/table chrome outside 319 canonical list |

**Overall:** All user-visible strings that are wired through the approved `C` constants **match** the copy-review document exactly. No textual discrepancies found.

---

## Canonical strings (approved copy inventory)

Strings below are checked against `gcc-nationalisation-local-compliance-reporting-v59-copy-review.md` § **Approved copy (canonical for 320)**.

| # | Element / context | Approved text (abbrev.) | Status | Notes |
|---|-------------------|-------------------------|--------|--------|
| 1 | Primary run | Run report | **PASS** | Modal heading + row action |
| 2 | Export | Export | **PASS** | History row + pattern |
| 3 | Export CSV | Export to CSV | **PASS** | |
| 4 | Export Excel | Export to Excel | **PASS** | |
| 5 | View details | View details | **PASS** | |
| 6 | Open run | Open run | **PASS** | |
| 7 | Save | Save changes | **PASS** | |
| 8 | Cancel | Cancel | **PASS** | Run modal |
| 9 | Close | Close | **PASS** | Toasts, modals |
| 10 | Download validation | Download validation summary | **PASS** | Reference Data |
| 11 | Confirm run | Confirm run | **PASS** | |
| 12 | Programme label | Programme | **PASS** | |
| 13 | Programme help | Filter reports for a specific GCC programme. | **PASS** | |
| 14 | Search reports label | Search reports | **PASS** | |
| 15 | Search reports help | Search by report name or keyword. | **PASS** | |
| 16 | Period label | Period | **PASS** | |
| 17 | Period help | Choose the reporting period for this run. | **PASS** | |
| 18 | Include closed label | Include closed requisitions | **PASS** | |
| 19 | Include closed help | Include candidates tied to closed requisitions when selected. | **PASS** | |
| 20 | Enable UAE | Enable United Arab Emirates programme reports | **PASS** | |
| 21 | Enable KSA | Enable Kingdom of Saudi Arabia programme reports | **PASS** | |
| 22 | Enable Kuwait | Enable Kuwait programme reports | **PASS** | |
| 23 | Legacy map label | Map legacy field to reference dimension | **PASS** | `FormSelect` |
| 24 | Reference dimension label | Reference dimension | **PASS** | `FormSelect` |
| 25 | Error: connection | Unable to run report. Check your connection and try again. | **PASS** | In `C.errRun`; see coverage note below |
| 26 | Error: access | You don't have access to this report. Contact your Workday administrator. | **PASS** | In `C.errAccess`; see coverage note below |
| 27 | Error: period | Select a period before you run the report. | **PASS** | Wired when period empty |
| 28 | Success: run | Report run finished | **PASS** | |
| 29 | Success: export started | Export started. You'll get a file download when it's ready. | **PASS** | |
| 30 | Success: export complete | Export complete | **PASS** | |
| 31 | Success: settings | Programme settings saved | **PASS** | |
| 32 | Empty catalogue title | No reports match your filters | **PASS** | |
| 33 | Empty catalogue body | Try another programme or clear search. | **PASS** | |
| 34 | Clear filters | Clear filters | **PASS** | |
| 35 | Empty history title | No run history yet | **PASS** | |
| 36 | Empty history body | Run a programme report to see it listed here. | **PASS** | Also used in details modal fallback |
| 37 | Go to catalogue | Go to report catalogue | **PASS** | |
| 38 | Empty validation title | No validation issues found | **PASS** | |
| 39 | Empty validation body | We'll list data gaps when the validation job finds them. | **PASS** | |
| 40 | Loading reports | Loading reports… | **PASS** | Unicode ellipsis (U+2026) |
| 41 | Running report | Running report… | **PASS** | |
| 42 | Loading history | Loading run history… | **PASS** | |
| 43 | Saving changes | Saving changes… | **PASS** | |
| 44 | Disclaimer | Figures support internal management review… statutory audit processes. | **PASS** | Verbatim match |
| 45 | Programme setup help | Your organisation defines how programme fields map… fines or penalties. | **PASS** | |
| 46 | Run metadata caption | As-run snapshot. Definition version is shown for traceability. | **PASS** | |

---

## Implementation coverage (informational)

| Topic | Detail |
|-------|--------|
| **`C.errRun` / `C.errAccess`** | Values **match** approved copy. Neither is assigned to `runError` (or any other visible state) in this prototype; only **`C.errPeriod`** is shown in the run modal. If Step 9 requires **all** approved errors to be demonstrable in UI, add flows that set `runError` to these constants; this is **not** a copy mismatch. |
| **Strings outside 319 canonical list** | Hub labels (`Overview`, `Regulatory Reports`, …), regulatory sub-tabs (`UAE Emiratisation`, …), table column headers (`Report name`, `Completed time`, …), `WorkdayLeftTabBar` hub title **Recruiting**, period placeholder **—**, and mock table/dropdown option text are **not** listed in the copy-review “Approved copy” section. No PASS/FAIL vs SSOT; treat as illustrative / shell unless the Discovery Brief is updated to canonise them. |

---

## Method

1. Read `gcc-nationalisation-local-compliance-reporting-v59-copy-review.md` and `gcc-nationalisation-local-compliance-reporting-v59.tsx`.  
2. Compared each string in `const C` to the approved inventory (programmatic character equality for single-line entries; manual confirmation for multi-line `disclaimer`).  
3. Grepped JSX usage of `C.*` to confirm implemented strings reference the canonical object.

---

*Workday Confidential — GCC E2E pipeline Step 9.*
