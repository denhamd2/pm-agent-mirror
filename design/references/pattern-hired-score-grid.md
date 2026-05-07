# Pattern: HiredScore Grid (Data Grid / List View)

**CANONICAL as of 31 March 2026**

**Figma Reference:** [HiredScore - Grid (CANONICAL)](https://www.figma.com/design/PZAsU9yw1ID2ECXP9ZKqL2/Hired-Score---Grid?node-id=490-62877)

This pattern defines the standard layout and Canvas Kit component mapping for data grids, list views, and candidate pipelines within the Workday Recruiting Hub.

**Scope**: This canonical pattern applies to:
- **Job Req Detail** - Candidate grid under specific requisition context
- **Dashboard** - Candidate lists in dashboard/home views
- **All Candidates** - Global candidate search and review
- **All Actions** - Action-oriented candidate queues
- Any recruiter-facing list view with HiredScore integration

## Layout Hierarchy & Canvas Kit Mapping

The layout follows a standard shell with a main content area containing context headers, pipeline visualization, and a complex data grid with filtering.

### 1. Global Shell
*   **Global Header:** Use `WorkdayTopNav` (`variant="app"`) — **white bar**, **grey pill search**, 1px `SANA_TOP_NAV_DIVIDER` hairline, trailing utilities. See `design/TOP-NAV-UPDATE.md`.
*   **Primary Left Rail:** Use `WorkdayLeftTabBar` (primary rail with stacked icon + uppercase micro-label).
*   **Secondary Nav Menu (Hub):** Use the secondary column of `WorkdayLeftTabBar` (e.g., "Recruiting Hub" title, vertical sub-nav pills for sections).

### 2. Main Content Area
The main content area (`<Flex flex={1} flexDirection="column">`) contains the following vertical sections:

#### A. Context Header
*   **Title & Metadata:** A header card containing the primary title (e.g., "Product Manager") and metadata (e.g., Job Req ID, Location, Target hire date, Hiring Manager, Recruiter).
    *   *Canvas Kit:* `<Heading size="large">` for the title, `<BodyText size="small">` for metadata.
*   **Top-level Tabs:** Navigation for different views of the context (e.g., Candidates, Details, Team).
    *   *Canvas Kit:* `<Tabs>` component.

#### B. Section Header & Actions
*   **Section Title:** e.g., "Active Candidates".
    *   *Canvas Kit:* `<Heading size="medium">`.
*   **Primary/Secondary Actions:** Action buttons aligned to the right.
    *   *Canvas Kit:* `<SecondaryButton>` or `<PrimaryButton>`.

#### C. Pipeline Visualization
*   A horizontal visual representation of the candidate pipeline stages.
    *   *Canvas Kit:* Custom flex layout using `<Flex>` and `<Box>` to represent stages, often with counts.

#### D. Grid Area (Split View)
A two-column layout containing filters on the left and the data grid on the right.

*   **Left Column: Faceted Search / Filters**
    *   Header: "Filters" with a collapse/expand toggle.
    *   List of filter categories and options.
    *   *Canvas Kit:* `<Flex>` sidebar, `<Heading size="small">`, `<Checkbox>` or custom list items for filter options.

*   **Right Column: Data Grid**
    *   **Saved Filters / Views:** Quick toggles for saved filter states.
    *   **Action Bar / Toolbar:** Bulk actions for selected rows.
    *   **Contextual Action Bar:** Actions specific to the current view.
    *   **Data Table:**
        *   *Canvas Kit:* `<Table>` component.
        *   *Headers:* `<Table.Header>` (use `whiteSpace: 'nowrap'` for fixed-width columns, `width: '100%'` for expanding columns).
        *   *Rows:* `<Table.Row>` and `<Table.Cell>`.
        *   *Row Actions:* A menu or inline buttons for actions on a specific row (e.g., "Move Forward", "Reject"). Use `<Menu>` or `<ToolbarIconButton>`.
    *   **Pagination:** Controls at the bottom of the table.
        *   *Canvas Kit:* `<Pagination>` component.

## Styling Notes (Sana Style)
*   **Surfaces:** Use `SANA_PAGE_CANVAS` for the main background behind the grid. Use white (`#FFFFFF`) for the grid container and filter panels.
*   **Borders:** Use thin `soap300` borders for separating the filter panel from the grid and for table rows.
*   **Radii:** Use `SANA_CARD_RADIUS_LG` for the main grid container.
*   **Typography:** Maintain clear hierarchy. Use bold for column headers and regular weight for cell data.

## When to Use This Pattern
Use this pattern whenever the primary user job is to review, filter, and take action on a large list of items (candidates, job requisitions, reports, etc.).

---

## HiredScore Spotlight Grading (Visual Specification)

**Component**: `HiredScoreGrading` (see `design/components/HiredScoreGrading.tsx`)

### Grade Bands (A-D)

**Grade A (Strong Fit)**: 85-100%
- Letter badge: Green background (`greenApple100`), green text (`greenApple600`)
- Progress bar: `greenApple600`
- Label: "Strong fit"

**Grade B (Good Fit)**: 70-84%
- Letter badge: Light grey background (`soap200`), blue text (`blueberry600`)
- Progress bar: `blueberry500`
- Label: "Good fit"

**Grade C (Moderate Fit)**: 55-69%
- Letter badge: Orange background (`cantaloupe100`), orange text (`cantaloupe600`)
- Progress bar: `cantaloupe600`
- Label: "Moderate fit"

**Grade D (Developing Fit)**: 0-54%
- Letter badge: Grey background (`soap200`), dark grey text (`blackPepper500`)
- Progress bar: `soap400`
- Label: "Developing fit"

### Layout Specifications

**Full variant** (with progress bar):
- Letter badge: 28px min-width, 8px border-radius, 1px `soap300` border
- Percentage: Bold (`fontWeight: 600`), `blackPepper600` color
- Label text: `blackPepper500` color
- Progress bar: 4px height, 2px border-radius, `soap300` background, grade-specific fill
- Total width: ~140px max

**Compact variant** (no progress bar):
- Letter badge + percentage + label only
- Used in card views, condensed lists, profile headers

### Integration Notes

**In candidate grids**: Use full variant in dedicated HiredScore column
**In profile modals**: Use full variant in key details section
**In dashboard cards**: Use compact variant for space efficiency

**Canvas Kit Integration**: This is a custom component (HiredScore proprietary pattern), not a Canvas Kit primitive. However, it uses Canvas Kit tokens for colors, spacing, and typography to maintain design system consistency.

---

## Filter Panel Patterns

**Components**: `FilterPill` (see `design/components/FilterPill.tsx`)

### Filter Pill

Interactive pill-shaped filter button for dataset filtering.

**Visual Specification:**
- Border radius: 999px (full pill shape)
- Padding: 6px 14px
- Font size: 13px
- Border: 1px solid

**States:**
- **Active**: `SANA_LINK_ACCENT` border, `soap100` background, 600 font weight
- **Inactive**: `soap300` border, `frenchVanilla100` background, 400 font weight

**Usage:**
```tsx
<FilterPill
  id="open"
  label="Open"
  count={32}
  active={true}
  onClick={(id) => handleFilterChange(id)}
/>
```

**Distinction**: FilterPill is interactive (clickable filter control), whereas `StatusIndicator` is read-only (status display).

**Common contexts:**
- Job requisition filters (All, Open, Draft, Closed)
- Report type filters
- Candidate stage quick filters
- Tag-based filtering

---

## Dashboard Patterns

**Components**: `MetricCard`, `ListItemCard` (see `design/components/`)

### MetricCard - KPI Display

Card component for displaying key performance indicators on dashboards.

**Visual Specification:**
- Flex basis: `1 1 220px` (responsive grid)
- Surface: `frenchVanilla100`
- Border: `soap300` 1px
- Radius: `SANA_CARD_RADIUS_LG`
- Padding: large (24px)

**Content Structure:**
1. Label (small text, 600 weight, `blackPepper500`)
2. Value (large heading)
3. Helper text (small text, `blackPepper500`)
4. Change indicator (small text, 12px, sentiment color)

**Sentiment Colors:**
- Positive: `greenApple600`
- Negative: `peachSchnapps600`
- Neutral: `blueberry500`

**Usage:**
```tsx
<MetricCard
  label="Open requisitions"
  value="38"
  helperText="Assigned to you"
  changeIndicator={{ text: "+5 this week", sentiment: "positive" }}
/>
```

**Common contexts:**
- Dashboard KPI grids
- Analytics summary cards
- Report header metrics
- Performance scorecards

### ListItemCard - Nested List Items

Card component for displaying list items within larger card containers.

**Visual Specification:**
- Background: `soap100` (nested surface, lighter than parent)
- Border: `soap300` 1px
- Radius: 8px
- Padding: medium (16px)
- Cursor: pointer (when interactive)

**Content Structure:**
1. Title (small text, 700 weight)
2. Subtitle (small text, `blackPepper500`)
3. Metadata (small text, 12px, `blackPepper500`, can be array)
4. Trailing element (badge, button, icon - right-aligned)

**Usage:**
```tsx
<ListItemCard
  title="Jordan Ellis"
  subtitle="Principal PM, Talent products"
  metadata={["Applied 28 March 2026", "LinkedIn"]}
  trailingElement={<HiredScoreGrading fit={94} variant="compact" />}
  onClick={() => openProfile()}
/>
```

**Common contexts:**
- Recent candidates lists
- Recent exports/downloads
- Related records
- Quick access items
- Activity feeds

---

## Analytics Patterns

**Components**: `ProgressBarWithBadge`, `ReportCard` (see `design/components/`)

### ProgressBarWithBadge - Distribution Charts

Progress bar with letter badge for displaying distribution analytics across categories.

**Visual Specification:**
- Badge: 28px × 28px, 8px radius, `soap200` background, category-specific text color
- Progress bar: 6px height, 3px radius, `soap300` background, category-specific fill
- Layout: Badge + label (left), count + percentage (right), progress bar (full width below)

**Usage:**
```tsx
<ProgressBarWithBadge
  badge="A"
  label="Strong Fit (85-100%)"
  count={45}
  total={127}
  color={colors.greenApple600}
/>
```

**Distinction**: Shows population distribution (aggregate), whereas `HiredScoreGrading` shows individual candidate scores.

**Common contexts:**
- HiredScore grade distribution
- Skill level breakdowns
- Stage distribution analytics
- Performance band visualizations

### ReportCard - Report Library Items

Card component for report libraries, saved searches, and templates.

**Visual Specification:**
- Flex basis: `1 1 280px` (responsive grid)
- Surface: `frenchVanilla100`
- Border: `soap300` 1px
- Radius: `SANA_CARD_RADIUS_LG`
- Padding: large (24px)
- Cursor: pointer (when interactive)

**Content Structure:**
1. Name (small text, 700 weight)
2. Description (small text, `blackPepper500`)
3. Last run date (small text, 12px, `blackPepper500`)
4. Key metric (small text, 13px, 600 weight, `blueberry500`)
5. Action button (SecondaryButton small)

**Usage:**
```tsx
<ReportCard
  name="Pipeline Velocity"
  description="Time-in-stage analysis across all active reqs"
  lastRun="30 March 2026"
  keyMetric="8.2 days avg"
  onAction={() => runReport()}
  actionLabel="Run Report"
/>
```

**Common contexts:**
- Report libraries
- Saved search catalogs
- Template galleries
- Scheduled report management

---

## Grid Toolbar Patterns

*Section placeholder - to be documented when Figma analysis complete*

Expected content:
- Bulk action buttons (position, hierarchy)
- View switchers (unified/compact toggle)
- Saved filters quick access
- Action bar contextual display rules

---

## Row Interaction Patterns

*Section placeholder - to be documented when Figma analysis complete*

Expected content:
- Default row styling
- Hover state (background, cursor)
- Selected row styling
- Keyboard focus indicators
- Click behavior (open profile modal, navigate)
- Row action menu (if present)

---

## Layout Variants by Context

### Job Req Detail Layout
*To be documented from Figma node 490-62877*

### Dashboard Layout
*To be documented from Figma node 490-62877*

### All Candidates Layout
*To be documented from Figma node 490-62877*

### All Actions Layout
*To be documented from Figma node 490-62877*

---

## Changelog

**31 March 2026 (v84 enhancements)**: Added 5 new reusable components extracted from candidate grid v84 tab enhancements:
- `MetricCard` - KPI metric display cards
- `FilterPill` - Interactive filter pill buttons
- `ProgressBarWithBadge` - Distribution analytics with grade badges
- `ReportCard` - Report library item cards
- `ListItemCard` - Nested list item cards

Documented Dashboard Patterns, Analytics Patterns, and expanded Filter Panel Patterns sections.

**31 March 2026**: Updated to canonical Figma node 490-62877. Added layout scope (Job Req Detail, Dashboard, All Candidates, All Actions). Added HiredScore grading visual specification. Added section placeholders for comprehensive Figma analysis.