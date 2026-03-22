# Canvas Kit Compliance Verification

**Prototype**: `design/gcc-candidate-grid-search.tsx`  
**Date**: 20 March 2026  
**Mission**: MISSION-017 — GCC E2E v40 — HITL #6

---

## Canvas Kit Setup ✅

### Dependencies (package.json)
- ✅ `@workday/canvas-kit-react@14.2.37` - Core components
- ✅ `@workday/canvas-kit-react-fonts@14.2.37` - Roboto fonts
- ✅ `@workday/canvas-tokens-web@3.1.6` - CSS variables (see `main.tsx`)
- ✅ `@workday/canvas-tokens-web@^4.1.4` - Design tokens

### Token CSS Imports (main.tsx)
```typescript
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
```
✅ All three token CSS files imported correctly

### Provider Wrapper (main.tsx)
```typescript
<CanvasProvider>
  <GccCandidateGridSearch />
</CanvasProvider>
```
✅ Component wrapped in CanvasProvider

---

## Canvas Kit Components Used

### Layout Components
- ✅ `Box` - Layout primitives with spacing props
- ✅ `Flex` - Flexbox layout with gap, alignItems, justifyContent
- ✅ `Card` - Surface containers with elevation

### Interactive Components
- ✅ `PrimaryButton` - Main actions (Get AI suggestions, Add to pipeline)
- ✅ `SecondaryButton` - Secondary actions (Dismiss, Previous/Next)
- ✅ `TertiaryButton` - Tertiary actions (Boolean syntax help)
- ✅ `ToolbarIconButton` - Icon-only actions (modal navigation arrows)

### Typography Components
- ✅ `Heading` - Page and section titles (size: large, medium, small)
- ✅ `BodyText` - Body content (size: small with color variants)
- ✅ `Text` - Generic text wrapper

### Form Components
- ✅ `FormField` - Form field wrapper with label
- ✅ `TextInput` - Search input field
- ✅ Proper compound pattern: `FormField` → `FormField.Label` → `FormField.Input`

### Data Display Components
- ✅ `Table` - Candidate grid table
- ✅ Compound pattern used correctly: `Table.Head`, `Table.Body`, `Table.Row`, `Table.Header`, `Table.Cell`

### Feedback Components
- ✅ `Banner` - Status messages and compliance warnings
- ✅ Compound pattern: `Banner.Icon` + `Banner.Label`
- ✅ `hasError` prop used for compliance banner (EU AI Act warning)

### Icon Components
- ✅ `SystemIcon` - Canvas Kit system icons
- ✅ Icons from `@workday/canvas-system-icons-web`: 
  - `arrowLeftSmallIcon`, `arrowRightSmallIcon` (carousel navigation)
  - `chevronRightSmallIcon` (inline UI where needed; not for breadcrumb strips in repo prototypes)
  - `xSmallIcon` (close/dismiss actions)

---

## Canvas Kit Tokens Applied

### Color Tokens
- ✅ `colors.frenchVanilla100` - White surfaces (replaced all `#fff` hardcoded values)
- ✅ `colors.soap100`, `colors.soap200`, `colors.soap300` - Neutral greys for backgrounds and borders
- ✅ `colors.blackPepper400`, `colors.blackPepper500`, `colors.blackPepper600` - Text hierarchy
- ✅ `colors.greenApple100`, `colors.greenApple600` - HiredScore "A" grade (strong fit)
- ✅ `colors.blueberry500`, `colors.blueberry600` - HiredScore "B" grade (good fit)
- ✅ `colors.cantaloupe100`, `colors.cantaloupe600` - HiredScore "C" grade (moderate fit)
- ✅ `colors.cinnamon600` - Warning/notice elements
- ✅ `SANA_LINK_ACCENT` - Link and focus colors (from shared theme)

### Spacing Tokens
- ✅ `space.xxxs`, `space.xxs`, `space.xs` - Micro spacing
- ✅ `space.s`, `space.m`, `space.l`, `space.xl`, `space.xxl` - Component spacing
- ✅ Applied via Canvas Kit props: `padding`, `paddingX`, `paddingY`, `margin`, `marginBottom`, `gap`

### Shape Tokens (from shared theme)
- ✅ `SANA_CARD_RADIUS_LG` (~20px) - Card corners
- ✅ `SANA_SHELL_RADIUS` (~24px) - Main content shell
- ✅ Consistent with Sana Style UI guidelines

### Elevation Tokens (from shared theme)
- ✅ `SANA_CARD_SHADOW_LIFTED` - Card shadows for depth

---

## Shared Component Imports

### From `design/components/`
- ✅ `WorkdayTopNav` - Global top navigation (pill search, notifications, inbox, avatar)
- ✅ `WorkdayLeftTabBar` - Left sidebar with Overview/Candidates/Interviews tabs
- ✅ Theme exports: `SANA_PAGE_CANVAS`, `SANA_LINK_ACCENT`, `SANA_CARD_RADIUS_LG`, etc.

### Alignment with Discovery Brief
✅ Discovery brief specified use of `WorkdayTopNav` and `WorkdayLeftTabBar`  
✅ Pattern D (dense workspace) correctly implemented  
✅ No custom reimplementation of chrome

---

## Canvas Kit Best Practices Applied

### ✅ Component Props over Inline Styles
Where possible, Canvas Kit props are used instead of inline styles:
```typescript
<Box padding="l" marginBottom="m" flex={1}>
<Flex gap="s" alignItems="center" flexWrap="wrap">
<Heading size="large" marginBottom="xs">
```

### ✅ Token-Based Styling
All colors, spacing, and shadows use Canvas Kit tokens:
```typescript
color={colors.blackPepper500}
backgroundColor: colors.frenchVanilla100
border: `1px solid ${colors.soap300}`
boxShadow: SANA_CARD_SHADOW_LIFTED
```

### ✅ Compound Components
Correct patterns for complex components:
```typescript
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Value</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

<Banner hasError={true}>
  <Banner.Icon />
  <Banner.Label>Message</Banner.Label>
</Banner>

<FormField>
  <FormField.Label>Label</FormField.Label>
  <FormField.Input as={TextInput} />
</FormField>
```

### ✅ Accessibility
- Proper `aria-label` on interactive elements
- `tabIndex={0}` on clickable table rows
- Keyboard event handlers (`onKeyDown` for Enter/Space)
- Screen reader text for icon-only buttons
- Focus management for modal navigation

### ✅ Semantic HTML
- Proper heading hierarchy (h1, h2, h3 via `Heading` size prop)
- `role="presentation"` on modal backdrops
- `role="main"` on main content area

---

## Areas Where Custom Styling is Appropriate

### Modal Implementation
Custom modal implementation using Canvas Kit primitives (Card, Box, Flex) rather than Canvas Kit Modal component is acceptable here because:
1. Requires custom carousel navigation (prev/next buttons)
2. Two-column layout (details left, resume right) not supported by standard Modal
3. Uses Canvas Kit tokens throughout for consistency

### HiredScore Fit Cell
Custom component for HiredScore grade display (A-D with percentage and bar) is appropriate because:
1. Domain-specific UI not covered by Canvas Kit
2. Uses Canvas Kit tokens for all colors and spacing
3. Built with Canvas Kit primitives (Box, Flex, BodyText)

### Pill-Style Toggle Buttons
Custom pill styling for view toggles uses Canvas Kit tokens:
```typescript
border: `1px solid ${active ? SANA_LINK_ACCENT : colors.soap300}`
backgroundColor: active ? colors.soap100 : colors.frenchVanilla100
```

---

## Compliance Summary

### ✅ Full Canvas Kit Integration
- All required packages installed
- Token CSS properly imported
- CanvasProvider wrapper in place
- Roboto fonts loading from Workday CDN

### ✅ Component Usage
- 15+ Canvas Kit components used correctly
- Compound component patterns followed
- No deprecated or incorrect patterns

### ✅ Token System
- All hardcoded colors replaced with Canvas Kit tokens
- Spacing uses Canvas Kit scale
- Shadows and elevations use shared theme tokens
- No arbitrary values (all from design system)

### ✅ Shared Chrome
- WorkdayTopNav and WorkdayLeftTabBar imported and used
- Sana Style theme tokens applied (neutral surfaces, sparing blue)
- Pattern D (dense workspace) correctly implemented

### ✅ Accessibility
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Semantic HTML structure

---

## Recommendation

**Status**: ✅ **COMPLIANT**

The prototype demonstrates proper Canvas Kit v11 integration with:
- Correct token usage throughout
- Appropriate component selection and patterns
- Shared chrome reuse (no reimplementation)
- Accessibility best practices
- Alignment with Sana Style UI guidelines

No Canvas Kit violations detected. The prototype is ready for stakeholder review and Figma capture.
