# UX copy review: GCC recruiter operations dashboard (GCC-E2E-002)

**Prototype:** `design/gcc-recruiter-dashboard.tsx`  
**Date:** 20 March 2026  
**Agent:** 310-doc-writer (design chain)

## Summary

| Area        | Issues | Notes                                      |
|-------------|--------|--------------------------------------------|
| Headings    | 0      | Sentence case; hierarchy clear             |
| Buttons     | 0      | `Export summary`, `New requisition`, `Save view` — verb + noun |
| Filters     | 0      | Labels specific; options plain language    |
| KPI tiles   | 0      | Metric + short context line              |
| Legal / data| 0      | Mock-data context in neutral subtitle only (no warning `Banner`) |

## Findings

### Aggregate metrics and exports (legal-sensitive — 060)

- **Current:** Dashboard subtitle states concept metrics and tenant disconnect in neutral **`BodyText`**. Refresh line uses local timestamp.
- **Assessment:** Aligns with workspace rule: no yellow / warning **`Banner`** for mock-data disclaimers. Production should still define **export** policy (who may download, logging, retention).
- **Suggestion:** For GA, add admin-configurable export notice or tooltip if required by privacy; keep primary surface calm.

### Minor

- **"Watch" / "Improving" / "Flat"** (LOB trend column) — scan well; if localised, ensure short labels still fit table cells.

## Approved for prototype

Copy is acceptable for stakeholder demo; legal / privacy review on **export** and production metric definitions before GA.
