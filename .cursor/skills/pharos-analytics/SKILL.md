---
name: pharos-analytics
description: Query patterns, IUM metric reference, and dashboard generation templates for Pharos data warehouse analytics. Provides the @data-scientist subagent (and any agent needing Pharos data) with canonical SQL patterns, known metric IDs, segmentation dimensions, data quality notes, and the React/Canvas Kit dashboard scaffold. Use when querying Pharos, building data files, or creating metric dashboards.
---

# Pharos Analytics

Reusable reference for querying Workday's Pharos data warehouse and building insight dashboards.

## Pharos Connection

**MCP**: `user-pharos-cli` (Trino SQL engine, read-only DQL)
**CLI fallback**: `pharos sql run --sql "..."` (requires `PATH` includes `/Users/david.denham/.local/bin`)
**Auth**: `~/.pharos/profiles` (`[prod]` profile with `client_id` and `client_secret`)

## Canonical Source Inventory

The canonical, human-readable source inventory lives in:

- `docs/stats-warehouse-data-sources.json`

Use that file for:

- validated table descriptions
- plain-English source summaries
- which dashboards use which sources
- known cautions and PM-facing notes

Whenever you validate a new stats warehouse source, update that inventory so the PM dashboard and analytics guidance stay in sync.

## Mandatory Query Rules

1. **Partition filter required** on `wd_event_date`:
```sql
WHERE wd_event_date >= to_iso8601(current_date - interval '365' day)
```

2. **Value column is varchar** - always cast:
```sql
try_cast(value AS double)
```

3. **Monthly aggregation**:
```sql
CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) as ym
```

4. **Non-zero filter** (most metrics have many zero-value rows):
```sql
AND try_cast(value AS double) > 0
```

## IUM Metric Reference

**Table**: `swh_raw.internal_usage_metrics_report_kafka`

### Recruiting Metrics (confirmed available)

| metric_id | Name | Unit | Tenants (approx) | Notes |
|-----------|------|------|-------------------|-------|
| 2358 | Average Time to Hire | Days | ~3,400 | Most widely tracked; stable 68-77d range |
| 2359 | Average Time to Fill | Days | ~981 (with >0 filter) | Re-queried 11 Apr 2026. 0.0 = no data, not zero days. Always filter `try_cast(value AS double) > 0`. Extreme outliers common (>10,000d). |
| 2360 | Count of Positions with Open Job Requisitions | Count | ~800-870 | Seasonal: Dec-Jan dip to ~600 |
| 2361 | Count of Positions Filled | Count | ~3,900-4,300 | 5x more tenants than open reqs |
| 1757 | Add Documents configured BP definitions | Count | ~600 latest month | Verified 11 April 2026 |
| 1758 | Add Document references with no documents | Count | ~400 latest month | Verified 11 April 2026 |
| 1759 | Add Document references with documents | Count | ~400 latest month | Verified 11 April 2026 |
| 1760 | Add Documents created | Count | ~420 latest month | Verified 11 April 2026 |
| 2053 | Interview Sessions Scheduled | Count | TBD | |
| 2054 | Interview Feedback Submitted | Count | TBD | |

**Important:** do not reuse older informal mappings for `1757`-`1760`. In this workspace, the currently verified meaning is the Add Documents set above, sourced from the Offer dashboard work completed on 11 April 2026.

### Segmentation Dimensions

| Column | Values | Use as |
|--------|--------|--------|
| `wd_env_type` | SANDBOX, PROD | Environment filter (default: SANDBOX) |
| `wd_dc_physical` | ATL, PDX, ORE, DUB, MTL, SIN | Geographic proxy |
| `wd_dc_type` | AWS, GCP, WDAY | Cloud infrastructure |
| `tenant_name` | ~3,800+ distinct (SANDBOX) | Individual customer |
| `year`, `month` | Numeric | Time dimensions |

### Geographic Region Mapping

```sql
CASE
  WHEN wd_dc_physical IN ('ATL') THEN 'Americas-East'
  WHEN wd_dc_physical IN ('PDX', 'ORE') THEN 'Americas-West'
  WHEN wd_dc_physical IN ('MTL') THEN 'Canada'
  WHEN wd_dc_physical IN ('DUB') THEN 'EMEA'
  WHEN wd_dc_physical IN ('SIN') THEN 'APAC'
  ELSE 'Other'
END as region
```

### NOT Available Natively in IUM
- Industry vertical: not in IUM, but available via `dw.user_test.interview_dashboard_tenant_filters.super_industry` (14 categories). Join on `tenant_name`.
- Region (business): not in IUM, but available via `interview_dashboard_tenant_filters.segment` (6 values: APAC, Corporate, EMEA, Japan, North America, US Federal). `wd_dc_physical` is a data centre proxy only.
- Company size / employee count
- Workday product edition / SKU
- Customer tenure / go-live date

## Offer BP Learnings

### Best tables for Offer analysis

1. `dw.swh.bp_event_stats`
   - Best for whole-Offer BP duration, completion, cancellation, and process quality.
   - Use this for dashboard-safe core Offer metrics.

2. `dw.swh.bp_event_record_stats`
   - Best current source for step-level Offer analysis.
   - Confirmed Offer task names from recent discovery include:
     - `Generate Document`
     - `Review Documents`
     - `Review Writer Generated Document`
     - `Add Documents`
     - `Manage Attachments`
   - Locked **approval** task names with material PROD volume (exact strings only): `Bulk Approve`, `Approve Business Process (Web Service)`.
   - Always filter `wd_event_date` (partition). When bucketing by `year(creation_time), month(creation_time)`, also bound `creation_time` or you will pull historical creation months into recent partitions.
   - Use narrow date windows and exact task-name filters after exploration.

3. `swh_raw.oms_requests`
   - Use to validate task semantics and inspect payload samples.
   - Good candidate for future attachment analysis via `task_display_name`, `processed_element_json`, and `oms_request_json`.

4. `swh_raw.cloudmaster_document_repository_event`
   - Supporting source for repository-side document events.
   - Do not treat `document_kind` as a PM-ready candidate attachment type without further validation.

### Current caution

- `Initiate Offer` has not yet been validated as a clean, chart-ready task in the accessible Pharos tables. Do not add an `Initiate Offer` chart until an exact-name proof query confirms it.

## PCA Feature Adoption Queries

**Tables**: `dw.uxinsights_prod.customer360` + `dw.user_data.task_to_pca_mapping`

Used by the Customer Scorecard to determine which Recruiting/TA features each tenant has enabled. Supersedes WUM boolean flags and `customer_monthly_feature_usage_test` for granular feature adoption.

### Canonical join pattern
```sql
SELECT c.tenant_n AS tenant_name,
       p.feature   AS feature_name,
       SUM(c.total_oms_transactions) AS total_txns,
       SUM(c.total_users) AS total_users
FROM   dw.uxinsights_prod.customer360 c
JOIN   dw.user_data.task_to_pca_mapping p
  ON   c.task_id = p.task_id
WHERE  c.wd_env_type = 'PROD'
  AND  c.wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND  (p.entitlement LIKE '%Recruiting%' OR p.entitlement LIKE '%Talent%')
  AND  c.tenant_n <> '- All Tenants'
GROUP BY 1, 2
HAVING SUM(c.total_oms_transactions) > 0 OR SUM(c.total_users) > 0
```

### Known caveats
- Superset may alias `total_oms_transactions` as `total_ons_transactions`; the physical column is `total_oms_transactions`.
- `task_to_pca_mapping` uses `task_xo_product` and `entitlement` for product filtering; there is no simple `product` column.
- Coverage: 74 PCA features, ~5,908 tenants (as of 11 Apr 2026).
- "Enabled" = any mapped task had usage > 0 in the 12-month window.

## Tenant Enrichment (Region + Industry)

**Table**: `dw.user_test.interview_dashboard_tenant_filters`

Provides region and industry per tenant. Used by the Customer Scorecard for segment filters and peer benchmarking, and by the BP Duration dashboard for segment breakdowns.

```sql
SELECT tenant_name,
       segment       AS region,
       super_industry AS industry
FROM   dw.user_test.interview_dashboard_tenant_filters
```

### Regions (6)
APAC, Corporate, EMEA, Japan, North America, US Federal

### Industries (14)
Education, Energy & Utilities, Federal / National Government, Financial Services, Healthcare, Hospitality, Manufacturing, Non-Profit, Other, Professional & Business Services, Public Sector, Retail, Technology & Media, Transportation

### Coverage
- ~5,971 tenants; ~225 have missing region/industry (set to "Unknown" in materialised data files).
- This table's original interview flag columns are no longer used on the Customer Scorecard (replaced by PCA-based adoption). Current role is enrichment only.

## Correlation Analysis Pattern

Established methodology used by the Customer Scorecard (`design/data-customer-scorecard.ts`). Reuse for any feature-vs-outcome correlation work.

### Pipeline
1. Compute per-tenant feature adoption from PCA (see above)
2. Join IUM outcome metrics (e.g., 2358 TTH, 2359 TTF) per tenant
3. For each feature: split tenants into "adopted" vs "not adopted"
4. Run Mann-Whitney U test (non-parametric; no normality assumption)
5. Apply Benjamini-Hochberg correction across all features (controls false discovery rate)
6. Compute composite score: `abs(mean_delta_ttf) + abs(mean_delta_tth)`
7. Assign confidence tiers: high (n >= 30 both groups, q < 0.05), medium (n >= 10, q < 0.10), low (otherwise)

### Segmentation
- Feature-count terciles: low_usage (<20 features), mid_usage (20-39), high_usage (>=40)
- Industry-aware peer benchmarking: filter peers by usage segment AND industry; fall back to segment-only if <5 industry peers
- Industry-aware recommendations: when >=10 same-industry+segment peers exist, mean-delta correlation is recomputed within the industry cohort for "missing features likely to improve TTF/TTH"; falls back to segment-level global correlations otherwise

### On-the-fly filtered re-ranking (UI)
When region/industry filters are applied on the landing page, a lightweight mean-delta computation runs client-side. q-values are not recomputed (require full Mann-Whitney U); confidence tiers serve as guidance. Minimum 10 tenants required per filtered group.

## Standard Query Templates

### 1. Monthly Trend (single metric)
```sql
SELECT
  CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) as ym,
  round(avg(try_cast(value AS double)), 1) as avg_val,
  count(DISTINCT tenant_name) as tenants,
  round(min(try_cast(value AS double)), 1) as min_val,
  round(max(try_cast(value AS double)), 1) as max_val
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND try_cast(value AS double) > 0
  AND year >= 2025
GROUP BY 1
ORDER BY 1
```

### 2. Regional Breakdown
```sql
SELECT
  CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) as ym,
  CASE WHEN wd_dc_physical IN ('ATL') THEN 'Americas-East'
       WHEN wd_dc_physical IN ('PDX','ORE') THEN 'Americas-West'
       WHEN wd_dc_physical IN ('MTL') THEN 'Canada'
       WHEN wd_dc_physical IN ('DUB') THEN 'EMEA'
       WHEN wd_dc_physical IN ('SIN') THEN 'APAC'
       ELSE 'Other' END as region,
  round(avg(try_cast(value AS double)), 1) as avg_val
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND try_cast(value AS double) > 0
  AND year >= 2025
GROUP BY 1, 2
ORDER BY 1, 2
```

### 3. Infrastructure Breakdown
```sql
SELECT
  CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) as ym,
  wd_dc_type as infra,
  round(avg(try_cast(value AS double)), 1) as avg_val
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND try_cast(value AS double) > 0
  AND year >= 2025
GROUP BY 1, 2
ORDER BY 1, 2
```

### 4. All Tenant Time Series (for per-tenant overlays)
```sql
SELECT
  tenant_name,
  CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) as ym,
  try_cast(value AS double) as val
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND try_cast(value AS double) > 0
  AND year >= 2025
ORDER BY tenant_name, ym
```

### 5. Top/Bottom Tenants
```sql
-- Fastest (lowest avg)
SELECT tenant_name, round(avg(try_cast(value AS double)), 1) as avg_days
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '180' day)
  AND try_cast(value AS double) > 0
  AND year >= 2025
GROUP BY tenant_name
HAVING count(*) >= 3
ORDER BY avg_days ASC
LIMIT 10

-- Slowest (highest avg): change ORDER BY to DESC
```

### 6. Distribution Buckets (customise ranges per metric)
```sql
SELECT
  CASE
    WHEN try_cast(value AS double) > 0 AND try_cast(value AS double) <= 30 THEN '1-30 days'
    WHEN try_cast(value AS double) > 30 AND try_cast(value AS double) <= 60 THEN '31-60 days'
    WHEN try_cast(value AS double) > 60 AND try_cast(value AS double) <= 90 THEN '61-90 days'
    WHEN try_cast(value AS double) > 90 AND try_cast(value AS double) <= 120 THEN '91-120 days'
    WHEN try_cast(value AS double) > 120 THEN '120+ days'
    ELSE 'No data (0)'
  END as bucket,
  count(DISTINCT tenant_name) as cnt
FROM internal_usage_metrics_report_kafka
WHERE metric_id = {METRIC_ID}
  AND wd_env_type = 'SANDBOX'
  AND wd_event_date >= to_iso8601(current_date - interval '90' day)
  AND year >= 2025
GROUP BY 1
ORDER BY 1
```

## Dashboard Generation Pattern

### Data File Structure (`design/data-[slug].ts`)

```typescript
// Auto-generated from Pharos IUM metric {ID}, {DATE}
// All active tenants with non-zero {METRIC_NAME} (SANDBOX, last 365 days)

export const ALL_TENANTS: string[] = ['tenant1', 'tenant2', ...];

export interface TenantTimeSeries { ym: string; v: number }

export const TENANT_TIME_SERIES: Record<string, TenantTimeSeries[]> = {
  "tenant1": [{"ym":"2025-01","v":74.5}, ...],
  ...
};
```

For dual-metric dashboards (e.g., open vs filled), export separate arrays:
```typescript
export const ALL_TENANTS_OPEN: string[] = [...];
export const ALL_TENANTS_FILLED: string[] = [...];
export const OPEN_TENANT_TIME_SERIES: Record<string, TenantTimeSeries[]> = {...};
export const FILLED_TENANT_TIME_SERIES: Record<string, TenantTimeSeries[]> = {...};
```

### Dashboard Component Pattern (`design/[slug]-dashboard.tsx`)

Required imports:
```typescript
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { PageHeader, MetricCard, FormSelect } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import { Chart as ChartJS, ... } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
```

Standard layout:
1. `PageHeader` with metric title and source attribution
2. KPI row: 4x `MetricCard` (latest value, delta, key stats)
3. Filters card: Region, Infrastructure, Tenant search (`<input>` + `<datalist>`), Time Range
4. Tab bar: `SecondaryButton` per tab, active state = blueberry400 bg
5. Chart panels: `Card` with `Line`/`Bar` from react-chartjs-2
6. `InsightBox`: Blue-tinted annotation below each chart
7. Data notes footer with source attribution

Key patterns:
- `animation: { duration: 0 }` for instant filter updates
- `alignToLabels()` helper to map tenant series to label set
- Cross-chart filtering: overlay dashed datasets when filters active
- `hasOverlays` flag to toggle legend visibility and y-axis auto-scaling

### Route Registration

**`design/main.tsx`**: Add import, `prototypeFromLocation()` check (path + hash), `AppRoot()` render case
**`design/vite.config.ts`**: Add slug to the `slugs` Set in `prototypeSpaSlugFallback`

## Data Quality Notes (from experience)

### Time to Hire (2358)
- Most reliable metric; ~3,400 tenants; stable distribution
- Range: 0.1-500 days (capped); typical average 68-77 days
- Strong seasonal dip in Dec-Jan (holiday hiring freeze)

### Time to Fill (2359)
- Re-queried 11 Apr 2026 with `>0` filter: ~981 tenants with positive values (up from ~540 in earlier queries using narrower date windows)
- 0.0 values are "no data", not zero days. Always filter `try_cast(value AS double) > 0` and set null in materialised files where no data exists.
- Higher variance; extreme outliers common (>10,000 days)
- Outliers like Texas Roadhouse (18,854d) are data quality issues, not real fill times
- Americas-West shows suspicious data pattern (215→30 drop) - investigate before relying on

### Positions Open (2360)
- ~800-870 tenants; seasonal Dec-Jan dip to ~600
- Large outlier range (max 26,145); averages skewed by heavy-hiring tenants

### Positions Filled (2361)
- Most broadly tracked position metric (~4,300 tenants)
- Remarkably stable at 19-22 avg per tenant per month
- 5x more tenants track filled vs open requisitions

### PCA Feature Adoption
- 74 Recruiting/TA features across 5,908 tenants (as of 11 Apr 2026)
- "Enabled" = any mapped task had usage > 0 (users or transactions) in the 12-month window
- Supersedes WUM boolean flags and `customer_monthly_feature_usage_test` for Customer Scorecard feature adoption

### Tenant Enrichment
- 5,971 tenants in `interview_dashboard_tenant_filters`; ~225 have missing region/industry (set to "Unknown")
- Industry and region data are enrichment joins, not native IUM columns

### General
- SANDBOX environment may not reflect PROD behaviour; note this in all reports
- `wd_dc_physical` is a data centre proxy for geography, not actual customer location. For business region, use `interview_dashboard_tenant_filters.segment`.
- Industry segmentation is available via `interview_dashboard_tenant_filters.super_industry` (14 categories); it is NOT natively in IUM data. Always specify the source when claiming industry-level insights.
- Dec-Jan data always dips due to holiday inactivity; seasonal adjustment recommended for YoY comparisons
