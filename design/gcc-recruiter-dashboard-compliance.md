# Compliance note (060-style): GCC recruiter operations dashboard — GCC-E2E-002

**Scope:** `design/gcc-recruiter-dashboard.tsx` — aggregate KPIs, funnel table, LOB breakdown, export affordance.

## Applicable regulations

- **GDPR / global equivalents:** Purpose limitation, minimisation, and transparency for workforce analytics; export and download can create new copies of personal data.
- **EU AI Act:** Not triggered by **aggregate** dashboards alone; review again if future versions add predictive or automated ranking of **individuals**.

## Assessment

| Check | Status |
|-------|--------|
| No individual candidate identifiers in mock data | Pass |
| Illustrative / non-production data called out | Pass (neutral subtitle + brief copy) |
| Role-based access called out in banner | Pass (conceptual) |
| Export — logging, scope, lawful basis | Not implemented; flagged in PRD |

**Risk level:** Low for this **prototype** (mock aggregates only). **Medium+** for production if exports include identifiable candidate fields or cross-border reporting without DPA alignment.

## Recommended actions before GA

1. Define **export** contents (aggregates only vs. row-level); log exports and restrict by security group.
2. Confirm **default aggregation** (e.g. minimum cell size) with privacy to reduce re-identification risk.
3. Align refresh and **time zone** display with tenant and audit requirements.

**Not legal advice** — confirm with Workday Legal and Privacy.
