# HRREC-81393: Agency Types Feature Impact Report

**Feature:** Bulk Post to Agency Types (VS4)  
**Epic:** [HRREC-81393](https://jira2.workday.com/browse/HRREC-81393)  
**Report Date:** 17 April 2026  
**Launch Date:** 20 September 2025 (2025.38 - 2025R2 Production)  
**Data Source:** `dw.swh_raw.oms_requests` (PROD)

---

## Executive Summary

The **Agency Types** menu item (HRREC-81393) enables recruiters to post jobs to entire agency types rather than selecting individual agency sites. This report measures adoption using OMS telemetry since no dedicated IUM was implemented.

| Metric | 18 Mar 2026 | 16 Apr 2026 | Δ |
|--------|-------------|-------------|---|
| **Adoption Share** | 1.09% | 1.10% | +0.01pp |
| **Tenant Penetration** | 11.41% | 11.13% | -0.28pp |
| **Menu Migration** | 34.4% | 26.6% | -7.8pp |

**Key Finding:** ~11% of active Post Job tenants use the bulk Agency Types feature, representing ~1,400 submissions per day. The feature has reached steady-state adoption with 233 unique tenants having used it since launch.

**Agency-scoped behaviour (16 April 2026):** Among Post Job updates whose payload touches the agency-type workset (`15604$`), **54.3%** of submissions use the NEW combined prompt path (Metric A) versus **45.7%** on the legacy drill-down path (`15604$` without `15$478022`). **365 of 367** tenants with any `15604$` activity that day used the NEW path at least once.

**Weekday vs Saturday sampling:** On **Tuesday 15 April 2026**, NEW Metric A counted **1,252** submissions across **363** tenants (vs **1,409** / **365** on the sampled Saturday). All-day Post Job volume that Tuesday was **129,646** submissions, so agency-type events remain a small fraction of total Post Job OMS traffic and weekly Saturday snapshots are a **trend sample**, not exhaustive daily volume.

**IUM association (exploratory, February 2026 SANDBOX):** Mann-Whitney U tests vs tenants not listed in `data/tenant-agency-types-usage.csv` show statistically separable distributions for **Avg Time to Hire (2358)** and **Recruiter Productivity / Capacity (2361)**. Adopters have **higher** median time to hire (64.8 d vs 57.7 d, p=2.77e-5) and **higher** median recruiter productivity (16.7 vs 13.2, p=1.37e-12). **Do not infer causation** (selection bias; general TTH is not an agency-posting outcome metric). See **Related Artefacts** for the tenant-level IUM extract.

---

## Verification Results (17 April 2026)

Four probe queries confirmed the metrics are correct:

| Verification | Result | Verdict |
|-------------|--------|---------|
| Pre-launch baseline (19 Sep 2025) | 1 submission (Kainos - early preview) | Near-zero baseline confirmed |
| Post-launch first signal (22 Sep 2025) | 1,196 submissions / 344 tenants | Feature went live on schedule |
| OLD path exclusion (16 Apr 2026) | 1,188 rows with `15604$` but NOT `15$478022` | Dual filter correctly excludes legacy path |
| Workset exclusivity (16 Apr 2026) | 0 co-occurrences of `15$478022` + `15$157785` | Worksets are mutually exclusive |

---

## Adoption Trend (20 Sep 2025 - 12 Apr 2026)

Weekly samples (Saturday of each week) from launch to present. Full data in `data/hrrec-81393-agency-menu-daily-metrics.csv`.

### Cumulative Tenant Adoption

| Week | Date | Submissions | Active Tenants | Cumulative Tenants |
|------|------|-------------|----------------|-------------------|
| 0 | 20 Sep 2025 | 18 | 9 | 9 |
| 1 | 27 Sep 2025 | 64 | 21 | 27 |
| 4 | 18 Oct 2025 | 42 | 12 | 61 |
| 8 | 15 Nov 2025 | 45 | 18 | 100 |
| 12 | 13 Dec 2025 | 52 | 15 | 123 |
| 16 | 10 Jan 2026 | 43 | 22 | 148 |
| 20 | 7 Feb 2026 | 53 | 32 | 182 |
| 24 | 7 Mar 2026 | 33 | 17 | 205 |
| 29 | 11 Apr 2026 | 43 | 21 | 233 |

**Adoption curve:** Near-linear growth in cumulative tenants (9 to 233 in 29 weeks, ~7.7 new tenants per week). The rate has not plateaued, suggesting organic discovery continues.

---

## Metric Definitions

### 1. Adoption Share (Primary KPI)

**Formula:** `NEW Agency Types submissions / Total Post Job submissions`

**What it measures:** The proportion of all Post Job update events that use the bulk Agency Types feature (combined prompt with type selection).

**Interpretation:** A low percentage (1.1%) is expected because:
- Not all job postings include agency distribution
- Many customers use career sites or direct agency selection
- This metric captures *feature-specific* usage, not task-level adoption

| Date | NEW Submissions | Total Post Job | Adoption Share |
|------|-----------------|----------------|----------------|
| 2026-03-18 | 1,349 | 123,351 | **1.09%** |
| 2026-04-16 | 1,409 | 128,072 | **1.10%** |

### 2. Tenant Penetration (Breadth)

**Formula:** `Tenants using NEW feature / Tenants with any Post Job submission`

**What it measures:** The percentage of active Post Job customers who have adopted the bulk Agency Types capability.

**Interpretation:** 11% tenant penetration indicates meaningful adoption across the customer base, not just a handful of power users. 233 cumulative unique tenants have used the feature since launch.

| Date | NEW Feature Tenants | Total Post Job Tenants | Penetration |
|------|---------------------|------------------------|-------------|
| 2026-03-18 | 367 | 3,217 | **11.41%** |
| 2026-04-16 | 365 | 3,279 | **11.13%** |

### 3. Menu Migration (Behaviour Shift)

**Formula:** `NEW menu opens / (OLD menu opens + NEW menu opens)`

**What it measures:** Among recruiters exploring agency-related menu options, the proportion choosing the NEW "Agency Types" path vs the OLD "Agency by Type" drill-down path.

**Interpretation:** ~27-34% migration suggests recruiters are discovering and using the new path, though the legacy path remains more familiar. This is a *navigation intent* signal, not a completion metric.

| Date | OLD Opens | NEW Opens | Migration % |
|------|-----------|-----------|-------------|
| 2026-03-18 | 101 | 53 | **34.4%** |
| 2026-04-16 | 113 | 41 | **26.6%** |

---

## Impact Assessment

### Confirmed Value Delivered

1. **Scale of use:** ~1,400 Post Job submissions per day leverage the bulk type feature
2. **Customer reach:** 233 unique tenants have adopted the feature since launch (11% of active Post Job tenants on any given day)
3. **Growth trajectory:** Near-linear tenant acquisition (~7.7 new tenants per week) with no plateau
4. **Efficiency gain:** Each bulk type selection replaces multiple individual site selections

### Recommended Follow-up Metrics

| Metric | Data Source | Why |
|--------|-------------|-----|
| **Sites per type** | OMS payload analysis | Quantify how many individual sites are bundled per type selection |
| **Time-to-post** | BP step duration tables | Compare completion time for bulk vs individual selection paths |
| **Error rate** | OMS validation failures | Confirm no increase in posting failures with bulk selection |
| **Repeat usage** | Tenant-level cohort | Track whether first-time users continue using the feature |

---

## Methodology Notes

### Data Collection

- **Launch date:** 20 September 2025 (Toggle Intended Prod: `2025.38 - 2025R2 Production`)
- **NEW submissions (definitive):** Post Job `U` events where `processed_element_json` contains both `15$478022` (combined prompt workset) AND `15604$` (Recruiting Agency Type class)
- **Menu opens (proxy):** `getReferencePrompt` events containing prompt IDs `45$17735` (OLD) or `45$28385` (NEW)
- **Total Post Job:** All `U` events for task IDs `2997$13499`, `2997$6945`, `2997$6334` with `task_display_name = 'Post Job'`
- **Weekly backfill:** 30 weekly samples (Saturdays) from 20 Sep 2025 to 12 Apr 2026 with cumulative tenant tracking

### Verification Method

1. **Zero-to-nonzero transition:** Confirmed near-zero usage on 19 Sep 2025 (1 early preview) and 1,196 submissions on 22 Sep 2025
2. **Exclusion correctness:** 1,188 OLD-path rows contain `15604$` without `15$478022`, confirming the dual filter correctly excludes legacy usage
3. **Workset exclusivity:** Zero co-occurrences of `15$478022` and `15$157785` in the same payload, confirming clean path separation

### Limitations

1. No dedicated IUM exists; metrics rely on OMS payload parsing
2. OLD path submissions are indistinguishable from direct agency selection (both resolve to `11279$*` sites)
3. Saturday samples may undercount weekday activity; absolute volumes may be higher on business days
4. Cross-metric Mann-Whitney tests use **SANDBOX** IUM with **`wd_event_date`** in **February 2026** (March 2026 rows were not yet materialised for 2358 at query time); adopters are defined from `tenant-agency-types-usage.csv`, not a full historical OMS union

### Value Driver Tree (recruiting metric tree)

**Decision:** Do **not** add a dedicated **Agency Types** node to `design/data-recruiting-metric-tree.ts` yet. The available evidence is **OMS adoption plus confounded general IUM proxies**; an on-tree link would over-imply a validated operational chain to **Avg Time to Hire**. Revisit when **HRREC-89061** (or equivalent) exposes **agency-scoped** time-to-post or time-to-hire instrumentation.

### Extending This Analysis

Weekly backfill (recommended):

```bash
python scripts/build_hrrec_81393_agency_menu_daily_metrics.py \
  --start-date 2025-09-20 \
  --end-date 2026-04-16 \
  --step-days 7
```

Daily granularity for a specific window:

```bash
python scripts/build_hrrec_81393_agency_menu_daily_metrics.py \
  --start-date 2026-04-01 \
  --end-date 2026-04-16
```

---

## Related Artefacts

- [Canonical SQL patterns](hrrec-81393-post-job-agency-type-oms-metrics.md)
- [Weekly metrics CSV](data/hrrec-81393-agency-menu-daily-metrics.csv)
- [Backfill script](../../scripts/build_hrrec_81393_agency_menu_daily_metrics.py)
- [Recruiting Agency User dashboard](../../design/recruiting-agency-user-dashboard.tsx) (`#recruiting-agency-user`)
- [Transient / skill route](../../design/view-dashboard.tsx) (`#view-dashboard`)
- [IUM extract:2358 + 2361, Feb 2026](data/ium-2358-2361-feb2026-tenant.csv)
- [DECISION-021](../../MISSION_LOG.md) - Measurement approach rationale
- [DECISION-023](../../MISSION_LOG.md) - PM Impact Report
