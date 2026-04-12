## Metric Audit Alignment - 12 April 2026

### Time to Hire policy

- Use **median Time to Hire** for bottleneck comparisons, scorecard correlations, peer benchmarking, and any tenant-versus-tenant comparison where skew and outliers can dominate the result.
- Use **average Time to Hire** for headline IUM KPI cards and trend dashboards when the warehouse metric itself is already a tenant-level average.
- Do not silently swap between median and average. If a visual falls back to average because median is missing, label it explicitly in the UI.

### Source and environment decisions

- `Average Time to Hire` remains the live recruiting outcome metric for dashboard work. In the currently accessible warehouse path, the latest visible month is `SANDBOX`.
- `Recruiter Productivity`, `Offers accepted`, `Employment Agreement Acceptance`, and `Internal Job Applications` are now treated as live Recruiting IUMs, resolved by `metric_name` first and described using the latest visible environment.
- `Time to Fill` remains a **legacy historical snapshot** in this workspace. The older `2359 = Time to Fill` assumption now conflicts with current live applicant age-band metric discovery, so the ID must not be reused without a fresh live metric-name match.
- The open-versus-filled positions dashboard is retained as a **legacy reference** only. Older `2360/2361` open-or-filled assumptions no longer match the current live warehouse names.

### Dashboard alignment completed

- Added plain-English header descriptions to the main audited dashboards.
- Updated the bottleneck strip so average fallback is labelled rather than presented as median.
- Reframed Customer Scorecard text so ranking is clearly based on **median TTH only**.
- Updated data-source surfaces to distinguish live metric-name-resolved IUMs from legacy snapshots.

### Remaining caveats

- The currently accessible warehouse path did not surface a clean latest-month PROD alternative for the recruiting IUM family used here.
- The Add Documents comparison dashboard still mixes PROD event metrics with SANDBOX IUM outcomes; this is acceptable for directional analysis, but should stay caveated.
- Any future Time to Fill reactivation should start with fresh live metric-name discovery rather than historical ID reuse.
