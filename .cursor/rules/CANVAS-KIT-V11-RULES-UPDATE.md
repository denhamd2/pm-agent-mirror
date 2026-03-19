# Canvas Kit v11 Rules Update

## Summary

Updated both the **UX Designer (430)** and **Prototype Developer (420)** rules based on critical learnings from recent Canvas Kit v11 prototype implementations.

---

## Key Updates Made

### 1. Canvas Tokens Web Requirement (CRITICAL)

**Added explicit warnings** that Canvas Kit v11 REQUIRES `@workday/canvas-tokens-web`:

- **Why**: Without this package, all Canvas Kit components have NO styling (no colors, spacing, borders, shadows)
- **What to install**: `npm install @workday/canvas-tokens-web`
- **What to import** in `main.tsx`:
  ```tsx
  import '@workday/canvas-tokens-web/css/base/_variables.css';
  import '@workday/canvas-tokens-web/css/system/_variables.css';
  import '@workday/canvas-tokens-web/css/brand/_variables.css';
  ```

**Root Cause**: Canvas Kit v11 moved from static styles to CSS variables. Components rely on these variables being defined, which only happens when Canvas Tokens CSS is imported.

---

### 2. Tabs Component Requirements

**Added specific implementation details**:

- **MUST** use `initialTab` prop to set default tab
- **MUST** use `data-id` prop (NOT `name`, NOT `id`) on both `Tabs.Item` AND `Tabs.Panel`
- The `data-id` values must match to link tabs to panels

**Example**:
```tsx
<Tabs initialTab="overview">
  <Tabs.List marginBottom="l">
    <Tabs.Item data-id="overview">Overview</Tabs.Item>
    <Tabs.Item data-id="pipeline">Pipeline</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel data-id="overview">
    <Box padding="l">Overview content</Box>
  </Tabs.Panel>
  <Tabs.Panel data-id="pipeline">
    <Box padding="l">Pipeline content</Box>
  </Tabs.Panel>
</Tabs>
```

**Root Cause**: Without `initialTab`, no tab loads by default. Without matching `data-id` props, tabs don't connect to their panels.

---

### 3. Table Component Pattern

**Clarified v11 compound component usage**:

- Must use `.Head`, `.Body`, `.Row`, `.Header`, `.Cell` subcomponents
- NO LONGER use HTML elements like `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`

**Example**:
```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Email</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

**Root Cause**: Canvas Kit v11 promoted the Preview Table to Main, which uses a different API than the old v10 Table.

---

### 4. TextInput Component

**Clarified styling approach**:

- Style props go directly on the component (NOT via `inputProps` object)
- Use `style={{}}` prop for custom styling

**Example**:
```tsx
<TextInput
  placeholder="Search..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  style={{
    width: '100%',
    backgroundColor: colors.soap100,
    padding: '8px 12px 8px 36px',
  }}
/>
```

**Root Cause**: The `inputProps` pattern doesn't exist in Canvas Kit's API and causes TypeScript errors.

---

### 5. Icon Components

**Added clarification**:

- Use `SystemIcon` component (the old `Icon` component is deprecated)
- Import icons from `@workday/canvas-system-icons-web`
- Common icons documented: `plusIcon`, `searchIcon`, `justifyIcon` (hamburger), `homeIcon`

**Example**:
```tsx
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { searchIcon, justifyIcon } from '@workday/canvas-system-icons-web';

<SystemIcon icon={searchIcon} size={16} color={colors.blackPepper400} />
```

---

### 6. ToolbarIconButton Component

**Added new component documentation**:

- Use `ToolbarIconButton` for icon-only buttons in headers/toolbars
- Requires `icon` prop and `aria-label` for accessibility

**Example**:
```tsx
import { ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { justifyIcon } from '@workday/canvas-system-icons-web';

<ToolbarIconButton icon={justifyIcon} aria-label="Menu" />
```

**Root Cause**: We discovered this component while building the top navigation and it's the correct pattern for toolbar icons.

---

### 7. Standard Workday Top Navigation Pattern

**Added complete reference implementation**:

**Structure**:
- **Left**: Hamburger menu + Workday logo
- **Center**: Search bar with icon positioned absolutely inside
- **Right**: User avatar

**Layout**:
- Flexbox with three sections
- Left/Right: `flex: 0 0 auto` (fixed)
- Center: `flex: 1 1 auto` (grows, max 600px)

**Full code example added to both rules** showing proper implementation with:
- `ToolbarIconButton` for menu
- Styled text logo
- `TextInput` with search icon overlay
- Responsive layout

---

### 8. Updated Component Lists

**Added missing components**:
- `ToolbarIconButton` to buttons list
- Specified icon source: `@workday/canvas-system-icons-web`
- Clarified Table and Tabs use compound component patterns

---

### 9. Enhanced DO/DO NOT Lists

**Added specific prohibitions**:
- ❌ DO NOT forget to install/import Canvas Tokens Web CSS
- ❌ DO NOT use old v10 patterns (HTML table elements, `name` props on Tabs)
- ❌ DO NOT use `inputProps` on TextInput

**Added specific requirements**:
- ✅ DO ALWAYS verify Canvas Tokens Web is installed and imported
- ✅ DO use `data-id` for Tabs component linking
- ✅ DO use compound components correctly
- ✅ DO follow standard Workday navigation pattern

---

## Files Updated

1. **`.cursor/rules/430-ux-designer.mdc`**
   - Added Canvas Tokens Web requirements
   - Added component-specific implementation notes
   - Added standard top nav pattern
   - Enhanced DO/DO NOT lists

2. **`.cursor/rules/420-prototype-developer.mdc`**
   - Added critical setup requirements section
   - Added component-specific implementation requirements
   - Added complete top nav pattern with code
   - Enhanced DO/DO NOT lists with specific examples

---

## Why These Updates Matter

### Before Updates
Agents would:
- ❌ Forget to install Canvas Tokens Web → no component styling
- ❌ Use wrong props on Tabs → tabs wouldn't work
- ❌ Use old Table patterns → TypeScript errors
- ❌ Try to use `inputProps` on TextInput → TypeScript errors
- ❌ Create inconsistent navigation patterns

### After Updates
Agents will:
- ✅ Always check for and install Canvas Tokens Web
- ✅ Use correct `data-id` props for Tabs
- ✅ Use v11 Table compound component pattern
- ✅ Style TextInput correctly
- ✅ Follow standard Workday navigation pattern
- ✅ Use proper icon components and buttons

---

## Testing the Updates

The rules were validated through the recent prototype implementations:

1. **Initial problem**: Blank prototype with no styling
   - **Root cause**: Missing Canvas Tokens Web
   - **Fix applied**: Added explicit requirement to rules

2. **Tabs not loading**: Overview tab blank
   - **Root cause**: Missing `initialTab` and incorrect `data-id` usage
   - **Fix applied**: Added specific Tabs component requirements

3. **Top nav needs**: Hamburger menu + logo + search
   - **Root cause**: No reference pattern in rules
   - **Fix applied**: Added complete standard pattern

All issues that arose during implementation are now documented in the rules to prevent future occurrences.

---

## Impact

These updates ensure that:
- First-time Canvas Kit v11 implementations will work correctly
- Common mistakes are prevented through explicit warnings
- Standard patterns are documented and reusable
- Both UX Designer and Prototype Developer rules are aligned
- Future prototypes will have proper styling from the start

The rules now encode the exact learnings from building a real Workday prototype with Canvas Kit v11.
