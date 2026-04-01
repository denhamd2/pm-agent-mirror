# Design System Enhancement: Tab Pattern Components

**Date:** 31 March 2026  
**Source Prototype:** `candidate-grid-v84`  
**Status:** Complete

## Overview

Extracted 5 reusable UI patterns from the candidate grid v84 tab enhancements into the Canvas Kit component library. All components follow Sana Style guidelines and have been validated through prototype refactoring.

## New Components

### 1. MetricCard

**File:** `design/components/MetricCard.tsx`

**Purpose:** KPI metric display card for dashboards and analytics views

**Props:**
```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  helperText: string;
  changeIndicator?: {
    text: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  };
  onClick?: () => void;
}
```

**Key Features:**
- Responsive grid layout (`flex: 1 1 220px`)
- Sentiment-based color coding for change indicators
- Optional click handler for interactive cards
- Sana Style surfaces and borders

**Usage Examples:**
- Dashboard KPI grids (Open reqs, Active candidates, Interviews)
- Analytics summary cards
- Performance scorecards
- Report header metrics

**Validation:** Refactored Dashboard tab successfully - 4 instances replaced with component

---

### 2. FilterPill

**File:** `design/components/FilterPill.tsx`

**Purpose:** Interactive pill-shaped filter button for dataset filtering

**Props:**
```typescript
interface FilterPillProps {
  id: string;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: (id: string) => void;
}
```

**Key Features:**
- Full pill shape (border-radius 999px)
- Active/inactive visual states
- Automatic count badge formatting
- ARIA pressed attribute for accessibility

**Distinction:** Interactive filter control (vs. read-only `StatusIndicator`)

**Usage Examples:**
- Job requisition filters (All, Open, Draft, Closed)
- Report type filters
- Candidate stage quick filters
- Tag-based filtering

**Validation:** Refactored Job requisitions tab successfully - 4 filter pills replaced with component

---

### 3. ProgressBarWithBadge

**File:** `design/components/ProgressBarWithBadge.tsx`

**Purpose:** Progress bar with letter badge for distribution analytics

**Props:**
```typescript
interface ProgressBarWithBadgeProps {
  badge: string;
  label: string;
  count: number;
  total: number;
  color: string;
  ariaLabel?: string;
}
```

**Key Features:**
- Letter badge (28px × 28px, centered text)
- Automatic percentage calculation
- Grade-specific color support
- ARIA progressbar with value attributes

**Distinction:** Population distribution (vs. `HiredScoreGrading` for individual scores)

**Usage Examples:**
- HiredScore grade distribution (A/B/C/D bands)
- Skill level breakdowns
- Stage distribution analytics
- Performance band visualizations

**Validation:** Refactored Reports tab successfully - 4 grade band instances replaced with component

---

### 4. ReportCard

**File:** `design/components/ReportCard.tsx`

**Purpose:** Card component for report libraries and saved searches

**Props:**
```typescript
interface ReportCardProps {
  name: string;
  description: string;
  lastRun?: string;
  keyMetric?: string;
  onAction?: () => void;
  actionLabel?: string;
}
```

**Key Features:**
- Responsive grid layout (`flex: 1 1 280px`)
- Last run timestamp + key metric display
- Action button with customizable label
- Click event propagation control (stopPropagation on action button)

**Usage Examples:**
- Report libraries (Pipeline Velocity, Source Attribution)
- Saved search catalogs
- Template galleries
- Scheduled report cards

**Validation:** Refactored Reports tab successfully - 3 report cards replaced with component

---

### 5. ListItemCard

**File:** `design/components/ListItemCard.tsx`

**Purpose:** Nested card component for list items within larger cards

**Props:**
```typescript
interface ListItemCardProps {
  title: string;
  subtitle?: string;
  metadata?: string | string[];
  trailingElement?: React.ReactNode;
  onClick?: () => void;
}
```

**Key Features:**
- Nested surface color (`soap100`) for visual hierarchy
- Flexible metadata (string or array)
- Optional trailing element (badge, button, icon)
- Keyboard navigation support (tabindex, role)

**Usage Examples:**
- Recent candidates lists (Dashboard: Top candidates this week)
- Recent exports/downloads (Reports: 3 export cards)
- Related records
- Activity feeds
- Quick access items

**Validation:** Refactored Dashboard and Reports tabs successfully - 6 instances replaced with component

---

## Implementation Details

### Component Library Integration

**Updated Files:**
- `design/components/MetricCard.tsx` - New component
- `design/components/FilterPill.tsx` - New component
- `design/components/ProgressBarWithBadge.tsx` - New component
- `design/components/ReportCard.tsx` - New component
- `design/components/ListItemCard.tsx` - New component
- `design/components/index.ts` - Added 5 exports
- `design/gcc-candidate-grid-search.tsx` - Refactored to use new components
- `design/components/CandidateHomeLayout.tsx` - Fixed StatusIndicatorType import
- `design/main.tsx` - Removed stale v61 reference

### Canvas Kit Dependencies

All components use:
- `@workday/canvas-kit-react/layout` - Flex, Box
- `@workday/canvas-kit-react/text` - Heading, BodyText
- `@workday/canvas-kit-react/button` - PrimaryButton, SecondaryButton, TertiaryButton
- `@workday/canvas-kit-react/tokens` - colors, space
- Custom Sana constants - SANA_CARD_RADIUS_LG, SANA_LINK_ACCENT

### Sana Style Adherence

All components follow:
- Neutral surfaces first (`frenchVanilla100`, `soap100`)
- Blue restraint (accent color only)
- Soft corner radii (8px, 12px)
- Consistent border usage (`soap300`)
- Typography hierarchy (600-700 for emphasis, 400 for body)
- Accessibility first (ARIA labels, roles, keyboard nav)

---

## Prototype Validation

**Build Status:** ✅ Successful
```
> tsc && vite build
✓ 1343 modules transformed.
✓ built in 1.71s
```

**Browser Testing:** ✅ All tabs functional
- Dashboard: MetricCard and ListItemCard components rendering correctly
- Job requisitions: FilterPill components with active states working
- Reports: ReportCard, ProgressBarWithBadge, and ListItemCard components functional

**Hot Reload:** ✅ Vite HMR working correctly with component refactoring

---

## Pattern Documentation

**Updated:** `design/references/pattern-hired-score-grid.md`

**New Sections Added:**
1. **Filter Panel Patterns** - FilterPill component specification
2. **Dashboard Patterns** - MetricCard and ListItemCard usage
3. **Analytics Patterns** - ProgressBarWithBadge and ReportCard usage

**Changelog Entry:**
```
31 March 2026 (v84 enhancements): Added 5 new reusable components 
extracted from candidate grid v84 tab enhancements with full 
specifications, usage examples, and context guidance.
```

---

## Reusability Matrix

| Component | Instances in v84 | Future Use Cases | Priority |
|-----------|------------------|------------------|----------|
| MetricCard | 4 (Dashboard) | All dashboards, analytics, scorecards | High |
| FilterPill | 4 (Job reqs) | All filter UIs, category selections | High |
| ListItemCard | 6 (Dashboard + Reports) | Recent items, activity feeds, related records | High |
| ReportCard | 3 (Reports) | Report libraries, templates, saved searches | Medium |
| ProgressBarWithBadge | 4 (Reports) | Distribution analytics, grade breakdowns | Medium |

---

## Design System Maturity

### Before v84 Enhancements
Component library focused on:
- Shell patterns (WorkdayTopNav, WorkdayLeftTabBar)
- Form controls (FormSelect, FormTextInput)
- Profile layouts (ProfilePageLayout)
- Communication patterns (EmailPanel, CommunicationDock)
- Domain-specific (HiredScoreGrading)

**Gap:** Limited dashboard, analytics, and filter patterns

### After v84 Enhancements
Component library now includes:
- Dashboard patterns (MetricCard)
- Filter patterns (FilterPill)
- Analytics patterns (ProgressBarWithBadge, ReportCard)
- List patterns (ListItemCard)

**Impact:** Significantly improved support for data-heavy, analytics-oriented UIs

---

## Benefits

### Code Reuse
- **Before:** ~150 lines of inline JSX per implementation
- **After:** ~5 lines per component usage
- **Reduction:** ~97% less code for repeated patterns

### Consistency
- Single source of truth for visual styling
- Guaranteed Sana Style adherence
- Uniform accessibility implementation

### Maintainability
- Centralized updates (change once, apply everywhere)
- Type safety through TypeScript interfaces
- Clear component boundaries and responsibilities

### Velocity
- Faster prototyping for future dashboard/analytics features
- Reduced copy-paste errors
- Lower cognitive load for new patterns

---

## Next Steps (Future Enhancements)

### Potential Variants
1. **MetricCard** - Add size variants (compact, standard, large)
2. **FilterPill** - Add icon support, color themes
3. **ProgressBarWithBadge** - Add sparkline trend variant
4. **ReportCard** - Add scheduled status badge
5. **ListItemCard** - Add multi-line metadata layout

### Additional Patterns to Extract
From other prototypes:
- Timeline item card (interview schedules, activity feeds)
- Stats comparison card (before/after metrics)
- Empty state card (no results, no data)
- Loading skeleton for cards

### Integration Opportunities
- Storybook documentation for each component
- Unit tests for prop variations
- Visual regression testing
- Usage analytics across prototypes

---

## Summary

Successfully extracted 5 production-ready components from candidate grid v84 tab enhancements into the design system. All components:

- ✅ Follow Sana Style guidelines
- ✅ Use Canvas Kit primitives
- ✅ Include TypeScript interfaces
- ✅ Support accessibility requirements
- ✅ Validated through prototype refactoring
- ✅ Documented in pattern library

**Prototype Status:** Fully functional with new components, builds successfully, hot reload working.

**Design System Impact:** Significantly expanded support for dashboard, analytics, and filter-heavy UIs.
