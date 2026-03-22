# Canvas Kit Select Quick Reference

## TL;DR
- Simple dropdown? → Use `FormSelect` from shared components
- Autocomplete/search? → Use Canvas Kit Select compound component

---

## FormSelect (Recommended for 90% of cases)

**Use for**: Filters, status dropdowns, form selectors

**Implementation**:
```tsx
import { FormSelect } from './components';

<FormSelect
  id="stage-filter"
  label="Stage"
  value={stage}
  onChange={setStage}
  options={[
    { value: 'all', label: 'All stages' },
    { value: 'new', label: 'New' },
    { value: 'screen', label: 'Screen' },
    { value: 'interview', label: 'Interview' }
  ]}
/>
```

**Under the hood**: Native HTML `<select>` with Canvas Kit FormField wrapper

**Why this works**:
- Native `<select>` is simpler, faster, and fully accessible
- Wrapped in Canvas Kit FormField for label/error composition
- Inline styling ensures visual consistency with Canvas Kit
- Works in 100% of prototype filter/form scenarios
- No risk of compound component API confusion

**Location**: `design/components/SharedFormControls.tsx`

---

## Canvas Kit Select Compound Component (Advanced)

**Use for**: Autocomplete, searchable dropdowns, typeahead

**When needed** (rare in prototypes):
- Search/filter with dynamic results
- Multi-select with chips
- Typeahead suggestions
- Complex dropdown patterns requiring Search + List + Popper

**Implementation pattern**:
```tsx
import { Select } from '@workday/canvas-kit-react/select';

<Select>
  <Select.Input placeholder="Search..." />
  <Select.Popper>
    <Select.Card>
      <Select.List>
        <Select.Item data-id="option1">Option 1</Select.Item>
        <Select.Item data-id="option2">Option 2</Select.Item>
      </Select.List>
    </Select.Card>
  </Select.Popper>
</Select>
```

**Not recommended for prototypes** - adds complexity without UX benefit for simple filters

**For advanced usage**: Consult Canvas Kit MCP (`get-canvas-kit-tokens`) for full API details

---

## Decision Tree

```
Do you need a dropdown?
│
├─ YES → Is it a simple filter/form field with static options?
│        │
│        ├─ YES → Use FormSelect (shared component)
│        │        ✅ Stage, Source, Location, Status filters
│        │        ✅ Form select fields
│        │        ✅ Date/month selectors
│        │        ✅ 90% of prototype dropdowns
│        │
│        └─ NO → Do you need search/autocomplete/typeahead?
│                 │
│                 ├─ YES → Use Canvas Kit Select compound component
│                 │        ⚠️  Complex API, rare in prototypes
│                 │        ⚠️  Consult Canvas Kit MCP first
│                 │
│                 └─ NO → Use FormSelect anyway
│                          (You probably need a simple dropdown)
│
└─ NO → Use different component
         (Tabs, Radio, Checkbox, etc.)
```

---

## Common Mistakes to Avoid

❌ **Don't**: Use `FormField.Input as={Select}` (API confusion)  
✅ **Do**: Use `FormSelect` shared component

❌ **Don't**: Import Canvas Kit `Select` directly for simple dropdowns  
✅ **Do**: Use `FormSelect` from shared components

❌ **Don't**: Create custom styled dropdowns  
✅ **Do**: Use Canvas Kit components with tokens

❌ **Don't**: Try to use Canvas Kit Select compound component for simple filters  
✅ **Do**: Reserve compound Select for actual autocomplete/search scenarios

---

## Troubleshooting

### Problem: Dropdown appears as plain text or unstyled

**Solution**: You're likely using Canvas Kit Select compound component incorrectly

**Fix**: Replace with `FormSelect` from `design/components/SharedFormControls.tsx`

```tsx
// ❌ WRONG (compound component used as simple select)
<Select value={stage} onChange={setStage}>
  <option>New</option>
  <option>Screen</option>
</Select>

// ✅ CORRECT (shared component)
<FormSelect
  id="stage"
  label="Stage"
  value={stage}
  onChange={setStage}
  options={[
    { value: 'new', label: 'New' },
    { value: 'screen', label: 'Screen' }
  ]}
/>
```

### Problem: I need search functionality in my dropdown

**Solution**: Now you need the Canvas Kit Select compound component

**Action**: Consult Canvas Kit MCP (`get-canvas-kit-tokens`) for full implementation guide

---

## References

- **Shared Components**: `design/components/SharedFormControls.tsx`
- **Canvas Kit MCP**: `/Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/user-canvas-kit-mcp/`
- **Improvements Summary**: `design/CANVAS-KIT-IMPROVEMENTS-SUMMARY.md`
- **Agent Rules**: `.cursor/rules/320-prototype-developer.mdc`, `.cursor/rules/315-ux-designer.mdc`
- **Sana Style Guide**: `.cursor/rules/010-style-guide.mdc`

---

**Last Updated**: 2026-03-22  
**Version**: Canvas Kit v14.2.37
