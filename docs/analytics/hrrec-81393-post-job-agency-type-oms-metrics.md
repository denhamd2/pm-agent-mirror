# HRREC-81393: Post Job Agency menu usage (OMS / Pharos)

Canonical SQL patterns for measuring **Agency by Type** (OLD GST) vs **Agency Types** (NEW, VS4) from `dw.swh_raw.oms_requests` (PROD). No IUM exists for this feature (HRREC-84539 closed in favour of Portal SQL).

**Launch date:** 20 September 2025 (Toggle Intended Prod: `2025.38 - 2025R2 Production`)  
**Verified:** 17 April 2026 - pre-launch baseline confirmed (1 early preview on 19 Sep), post-launch signal confirmed (1,196 submissions on 22 Sep), workset exclusivity confirmed (zero `15$478022` + `15$157785` co-occurrence).

## XO reference (from XO MCP)

| Menu item | Behaviour | Prompt instance ID |
|-----------|-----------|--------------------|
| Agency by Type | Type then individual sites | `45$17735` |
| Agency Types | Types only; sites expanded in processing | `45$28385` |

| Workset | Meaning |
|---------|---------|
| `15$478022` | Job Posting Sites and Recruiting Agency Types (combined prompt after toggle) |
| `15$157785` | Job Posting Site for Post Job (legacy subedit path; can still carry `15604$` when drilling **Agency by Type**) |

| Class prefix in JSON | Meaning |
|----------------------|---------|
| `15604$` | Recruiting Agency Type instance |
| `11279$` | Recruiting Agency Site |
| `11278$` | External Job Posting Site |

## Metric A: NEW feature submissions (definitive)

Post Job **updates** where the combined workset includes at least one Agency Type instance. **Requires both** `15$478022` and `15604$` so OLD **Agency by Type** drill-down (which can emit `15604$` under `15$157785`) is excluded.

```sql
SELECT
  wd_event_date,
  COUNT(*) AS new_agency_types_submissions,
  COUNT(DISTINCT tenant_n) AS tenants_using
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{YYYY-MM-DD}'
  AND wd_env_type = 'PROD'
  AND task_id IN ('2997$13499', '2997$6945', '2997$6334')
  AND task_display_name = 'Post Job'
  AND read_or_update = 'U'
  AND processed_element_json LIKE '%15$478022%'
  AND processed_element_json LIKE '%15604$%'
GROUP BY 1
ORDER BY 1;
```

For monthly rollups, repeat per day or use a bounded `wd_event_date` range (wide ranges are slow; see Performance).

## Metric B: OLD menu opens (navigation proxy)

**Agency by Type** final submissions are not isolatable from other paths that yield `11279$` sites. Count **getReferencePrompt** rows that reference prompt `45$17735`.

```sql
SELECT
  wd_event_date,
  COUNT(*) AS agency_by_type_opens,
  COUNT(DISTINCT tenant_n) AS tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{YYYY-MM-DD}'
  AND wd_env_type = 'PROD'
  AND task_display_name = 'getReferencePrompt -> get reference prompt (System)'
  AND oms_request LIKE '%45$17735%'
GROUP BY 1
ORDER BY 1;
```

## Metric C: NEW menu opens (navigation proxy)

Same as B, for prompt `45$28385`.

```sql
SELECT
  wd_event_date,
  COUNT(*) AS agency_types_opens,
  COUNT(DISTINCT tenant_n) AS tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{YYYY-MM-DD}'
  AND wd_env_type = 'PROD'
  AND task_display_name = 'getReferencePrompt -> get reference prompt (System)'
  AND oms_request LIKE '%45$28385%'
GROUP BY 1
ORDER BY 1;
```

## Metric D: OLD-path submissions among agency-type touches (denominator for migration share)

Post Job **updates** that include **`15604$`** (agency type in payload) but **not** the combined workset **`15$478022`**. These are **legacy Agency by Type** drill-down submissions, not the VS4 bulk path.

```sql
SELECT
  wd_event_date,
  COUNT(*) AS old_path_agency_type_submissions,
  COUNT(DISTINCT tenant_n) AS tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{YYYY-MM-DD}'
  AND wd_env_type = 'PROD'
  AND task_id IN ('2997$13499', '2997$6945', '2997$6334')
  AND task_display_name = 'Post Job'
  AND read_or_update = 'U'
  AND processed_element_json LIKE '%15604$%'
  AND processed_element_json NOT LIKE '%15$478022%'
GROUP BY 1
ORDER BY 1;
```

**Agency-scoped NEW share:** `Metric A count / (Metric A count + Metric D count)` for the same day. Interprets adoption **conditional on** a Post Job flow touching agency types, not versus all Post Job volume.

## Sample results (PROD, ad hoc run 17 April 2026)

| Date | Metric A (submissions) | Tenants A | Metric B (opens) | Tenants B | Metric C (opens) | Tenants C |
|------|------------------------|-----------|------------------|-----------|------------------|-----------|
| 2026-03-18 | 1,349 | 367 | 101 | 36 | 53 | 27 |
| 2026-04-16 | 1,409 | 365 | 113 | 35 | 41 | 27 |

**Agency-scoped share (16 Apr 2026, PROD):** Metric D = **1,188** submissions / **321** tenants (same task filters). NEW / (NEW + OLD) = 1,409 / (1,409 + 1,188), approx. **54.3%**. Tenants with any `15604$` activity: **367** distinct; **365** also had Metric A activity.

**Weekday calibration (15 Apr 2026):** Metric A only: **1,252** submissions, **363** tenants. All Post Job `U` rows that day (no agency filter): **129,646** submissions (illustrates Saturday weekly series is a sample, not total daily Post Job volume).

Interpretation: **Metric A** is adoption of the VS4 bulk-type path on the combined prompt. **B vs C** compares how often recruiters open each GST branch (intent); OLD branch remains more opened than NEW on these two days, while NEW submissions are high-volume because each Post Job can include types.

## Performance

- Prefer **single `wd_event_date`** (partition) per query; full-month `GROUP BY` over `oms_requests` can exceed interactive timeouts.
- Metric A with both LIKE filters completed in ~20–25s in testing; Metrics B/C on one day were ~50–75s (full partition scan with LIKE on `oms_request`).
- For production dashboards, use Portal SQL or a scheduled job that aggregates by day into a smaller table.

## Daily backfill script

Use `scripts/build_hrrec_81393_agency_menu_daily_metrics.py` to run partition-by-partition and emit a CSV:

```bash
# Weekly backfill from launch to present (recommended)
python scripts/build_hrrec_81393_agency_menu_daily_metrics.py \
  --start-date 2025-09-20 \
  --end-date 2026-04-16 \
  --step-days 7

# Daily granularity for a specific window
python scripts/build_hrrec_81393_agency_menu_daily_metrics.py \
  --start-date 2026-04-01 \
  --end-date 2026-04-16
```

Default output:

`docs/analytics/data/hrrec-81393-agency-menu-daily-metrics.csv`

The script computes:
- Metric A (NEW submissions): `15$478022` + `15604$`
- Metric B (OLD opens): prompt `45$17735`
- Metric C (NEW opens): prompt `45$28385`
- **Total Post Job** row counts and distinct tenants (same task filters as the impact report denominator)
- Metric D is available via the SQL above (not yet in the script output)
- **Cumulative unique tenants**: Running union of distinct `tenant_n` across all sample dates

To backfill **total Post Job** columns on an older CSV produced before this field existed, run `scripts/enrich_hrrec_81393_csv_post_job_totals.py` (re-queries Pharos per row).

## Related

- Epic: [HRREC-81393](https://jira2.workday.com/browse/HRREC-81393)
- Pharos partition rules: `.cursor/skills/pharos-analytics/SKILL.md`
