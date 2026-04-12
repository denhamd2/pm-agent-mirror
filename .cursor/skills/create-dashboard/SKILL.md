# Create Dashboard Skill

Generates a visual, interactive dashboard from query results using Chart.js and Canvas Kit. Overwrites a single fixed route (`/view-dashboard`) every time, so the PM always sees the latest query results at the same URL.

## When to Use This Skill

Use whenever the Data Scientist needs to present query results visually:
- **Protocol 4 (Ad-hoc Query)**: DEFAULT - always generate a dashboard for ad-hoc data questions
- **Protocol 1 (EDA)**: Optional - use when exploration produces chartable results
- **Protocol 2 (Hypothesis-Driven)**: Optional - use when statistical findings benefit from visualisation
- **Protocol 5 (Metric Health Check)**: Optional - use for distribution and coverage charts

Do NOT use for Protocol 3 (permanent named dashboards like `avg-time-to-hire-dashboard.tsx`). Those have their own versioned files and routes.

## File Targets (Always Overwrite)

Every invocation overwrites these two files entirely:
- **`design/data-view-dashboard.ts`** - typed data exports
- **`design/view-dashboard.tsx`** - React dashboard component

The route `/view-dashboard` is registered once in `design/main.tsx` and `design/vite.config.ts`. Do NOT re-register it.

## Workflow

### Step 1: Query Pharos

Use the `pharos-analytics` skill for query patterns. Pull all data needed for the charts you plan to create.

### Step 2: Select Charts

Choose 2-4 chart types based on the data shape. Use your data science expertise to pick the most informative visualisations for the PM's question.

| Data Shape | Chart Type | react-chartjs-2 | When to Use |
|---|---|---|---|
| Time series (1 metric) | Line chart | `Line` | Trend over months, seasonal patterns |
| Time series (2+ metrics) | Dual-axis Line or stacked Bar | `Line` or `Bar` | Comparing two metrics over time |
| Categorical comparison | Horizontal Bar | `Bar` with `indexAxis: 'y'` | Comparing regions, infrastructure types |
| Distribution | Histogram | `Bar` with buckets | Value spread, outlier identification |
| Regional/segment breakdown | Grouped Bar or multi-line | `Bar` or `Line` | Segment-level trends |
| Top/bottom ranking | Horizontal Bar (sorted) | `Bar` with `indexAxis: 'y'` | Best/worst performers |
| Share/proportion | Doughnut | `Doughnut` | Market share, category split |
| Single-tenant deep dive | Line + context overlay | `Line` with dashed global avg | Tenant vs benchmark |

### Step 3: Write Data File

Write `design/data-view-dashboard.ts` with this structure:

```typescript
export interface QueryMeta {
  title: string;
  subtitle: string;
  queryDate: string;
  source: string;
  filters: string;
  environment: string;
  dateRange: string;
}

export const QUERY_META: QueryMeta = {
  title: 'Dashboard title describing the query',
  subtitle: 'One-line summary of the question being answered',
  queryDate: '10 April 2026',
  source: 'Pharos IUM (swh_raw.internal_usage_metrics_report_kafka)',
  filters: 'metric_id=2359, wd_env_type=SANDBOX',
  environment: 'SANDBOX',
  dateRange: 'April 2025 - March 2026',
};

export interface KPI {
  label: string;
  value: string;
  detail: string;
}

export const KPIS: KPI[] = [
  { label: 'Overall Average', value: '72.3 days', detail: 'Across all tenants' },
  // 2-4 KPIs
];

export interface Insight {
  finding: string;
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  recommendation: string;
  caveats: string[];
}

export const INSIGHTS: Insight[] = [
  {
    finding: 'One sentence summary of finding',
    evidence: 'Data point with context and comparison',
    confidence: 'Medium',
    confidenceReason: 'Why this confidence level',
    recommendation: 'What the PM should do with this',
    caveats: ['Caveat 1', 'Caveat 2'],
  },
];

// Chart-specific data exports - shape varies per dashboard
export const TREND_DATA = [ /* ... */ ];
export const REGIONAL_DATA = { /* ... */ };
// etc.
```

### Step 4: Write Dashboard Component

Write `design/view-dashboard.tsx` following this scaffold:

```typescript
import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard } from './components';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
} from './components/sanaShellTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { QUERY_META, KPIS, INSIGHTS /* chart data imports */ } from './data-view-dashboard';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const CK = {
  primary: colors.blueberry500,
  primaryLight: colors.blueberry200,
  secondary: colors.greenApple400,
  tertiary: colors.cantaloupe400,
  quaternary: colors.cinnamon400,
  neutral: colors.soap400,
  muted: colors.blackPepper500,
};
```

**Component structure (top to bottom):**

1. **PageHeader** with `QUERY_META.title` and `QUERY_META.subtitle`
2. **KPI row**: Map `KPIS` array to `MetricCard` components in a `Flex` row
3. **Chart grid**: 2-4 charts in `Card` containers, using `Flex` with `gap` and `flexWrap: 'wrap'`
4. **Insights panel**: Styled `Card` at the bottom (see Insights Section below)
5. **Data notes footer**: Source attribution, environment, date range from `QUERY_META`

**Chart configuration rules:**
- `animation: { duration: 0 }` on all charts for instant rendering
- Use `CK` palette constants for consistent Workday-aligned colours
- Responsive: `maintainAspectRatio: false` with explicit container height (300-400px)
- Tooltips enabled with `mode: 'index'`, `intersect: false`

**Export:**
```typescript
export const ViewDashboard = () => { /* component */ };
export default ViewDashboard;
```

### Step 5: Insights Panel Format

The Insights panel is a `Card` at the bottom of the dashboard with a left border accent. This is where the Data Scientist's expert interpretation goes.

```typescript
<Card
  style={{
    borderRadius: SANA_CARD_RADIUS_LG,
    boxShadow: SANA_CARD_SHADOW,
    borderLeft: `4px solid ${colors.blueberry500}`,
    padding: 24,
    marginTop: 24,
  }}
>
  <Heading size="small" style={{ marginBottom: 16 }}>
    Data Scientist Insights
  </Heading>

  {INSIGHTS.map((insight, i) => (
    <Box key={i} style={{ marginBottom: i < INSIGHTS.length - 1 ? 20 : 0 }}>
      <BodyText size="medium" style={{ fontWeight: 600, marginBottom: 4 }}>
        {insight.finding}
      </BodyText>
      <BodyText size="small" style={{ color: colors.licorice300, marginBottom: 4 }}>
        {insight.evidence}
      </BodyText>
      <Flex gap="xs" alignItems="center" style={{ marginBottom: 4 }}>
        <Box
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor:
              insight.confidence === 'High' ? colors.greenApple100 :
              insight.confidence === 'Medium' ? colors.cantaloupe100 :
              colors.cinnamon100,
            color:
              insight.confidence === 'High' ? colors.greenApple600 :
              insight.confidence === 'Medium' ? colors.cantaloupe600 :
              colors.cinnamon600,
          }}
        >
          {insight.confidence} confidence
        </Box>
        <BodyText size="small" style={{ color: colors.licorice300 }}>
          {insight.confidenceReason}
        </BodyText>
      </Flex>
      <BodyText size="small" style={{ fontWeight: 500 }}>
        Recommendation: {insight.recommendation}
      </BodyText>
      {insight.caveats.length > 0 && (
        <Box style={{ marginTop: 4 }}>
          {insight.caveats.map((c, j) => (
            <BodyText key={j} size="small" style={{ color: colors.licorice300 }}>
              - {c}
            </BodyText>
          ))}
        </Box>
      )}
    </Box>
  ))}
</Card>
```

### Step 6: Auto-Open in Cursor Browser (MANDATORY)

After writing both files, you MUST open the dashboard in the Cursor Browser. This step is NOT optional.

1. **Wait for HMR**: Pause ~2 seconds for Vite to pick up the file changes
2. **Navigate**: Use `cursor-ide-browser` MCP to call `browser_navigate` with URL `http://localhost:5199/view-dashboard`
3. **Verify**: Take a `browser_snapshot` to confirm the dashboard rendered correctly
4. **Report**: Tell the PM the dashboard is open and summarise the key insights

If the dev server is not running, start it first:
```bash
cd design && npm run dev
```
Then proceed with browser_navigate.

## Canvas Kit Imports Reference

Standard imports for dashboard components:

```typescript
// Layout
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';

// Typography
import { Heading, BodyText } from '@workday/canvas-kit-react/text';

// Tokens
import { colors } from '@workday/canvas-kit-react/tokens';

// Buttons (for tabs or actions)
import { SecondaryButton } from '@workday/canvas-kit-react/button';

// Forms (for filters)
import { FormField } from '@workday/canvas-kit-react/form-field';

// Shared components
import { PageHeader, MetricCard, FormSelect } from './components';

// Sana theme
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
} from './components/sanaShellTheme';

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
```

## Quality Checklist

Before opening the dashboard in the browser, verify:

- [ ] `data-view-dashboard.ts` has `QUERY_META`, `KPIS`, `INSIGHTS`, and chart data exports
- [ ] `view-dashboard.tsx` imports from `./data-view-dashboard` (not hardcoded data)
- [ ] All charts have `animation: { duration: 0 }`
- [ ] Insights panel uses the accent-bordered Card pattern
- [ ] Every insight has `finding`, `evidence`, `confidence`, `confidenceReason`, `recommendation`, `caveats`
- [ ] `QUERY_META` has accurate `queryDate`, `source`, `filters`, `environment`, `dateRange`
- [ ] Component exports both named (`ViewDashboard`) and default export
- [ ] No linter errors in either file
