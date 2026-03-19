# Canvas Kit MCP - Simplified Prototype Approach

## What Changed

We simplified the Workday Recruiting prototype to use **ONLY Canvas Kit MCP** as the source of truth, removing all over-engineered elements.

### Removed
- ❌ Custom Workday navigation bar (global header with logo, search)
- ❌ Microanimations (hover lift effects, transitions, pulse effects)
- ❌ Custom animations CSS file
- ❌ Complex hover state management
- ❌ Over-styled cards with custom borders and shadows
- ❌ External design system references (canvas.workday.com)

### Kept
- ✅ Canvas Kit components as-is
- ✅ Canvas Kit's built-in margin/padding props
- ✅ Simple, clean implementations
- ✅ Canvas Kit default behaviors

## New Prototype Structure

```tsx
// Clean, simple Canvas Kit usage
<Box padding="xl" backgroundColor={colors.soap100}>
  <Heading size="large" marginBottom="m">Welcome back, {name}</Heading>
  
  <Card padding="l" marginBottom="l">
    <Heading size="small" marginBottom="m">Section</Heading>
    <BodyText>Content</BodyText>
  </Card>
  
  <Tabs>
    <Tabs.List>
      <Tabs.Item>Overview</Tabs.Item>
    </Tabs.List>
    <Tabs.Panel>Content</Tabs.Panel>
  </Tabs>
</Box>
```

## Canvas Kit MCP as Single Source of Truth

### How to Use Canvas Kit MCP

**1. Call MCP tools:**
```typescript
CallMcpTool({
  server: "user-canvas-kit-mcp",
  toolName: "get-canvas-kit-tokens"
})
```

**2. Fetch MCP resources:**
```typescript
FetchMcpResource({
  server: "user-canvas-kit-mcp",
  uri: "docs://tokens/color-palette"
})
```

### Available MCP Resources
- `docs://tokens/color-palette` - Color system and palettes
- `docs://tokens/color-tokens` - Token naming conventions
- `docs://tokens/color-roles` - Semantic color roles
- `docs://tokens/color-contrast` - Accessibility guidelines
- `docs://upgrade-guides/11.0-UPGRADE-GUIDE` - Canvas Kit v11 info

## Component Usage Pattern

### Simple Pattern (Use This)
```tsx
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';

<Card padding="l" marginBottom="m">
  <Heading size="small" marginBottom="s">Title</Heading>
  <BodyText size="medium">Content</BodyText>
</Card>
```

### What NOT to Do
```tsx
// ❌ Don't create custom navigation
<Box style={{ backgroundColor: colors.blueberry600 }}>
  <Logo />
  <SearchBar />
  <UserMenu />
</Box>

// ❌ Don't add custom animations
<Card
  onMouseEnter={() => setHovered(true)}
  style={{
    transform: hovered ? 'translateY(-2px)' : 'none',
    transition: 'all 200ms ease'
  }}
>

// ❌ Don't overcomplicate styling
<Card style={{
  padding: 0,
  overflow: 'hidden',
  border: `1px solid ${colors.soap300}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
```

## Updated Rules

### 430-ux-designer.mdc
- Removed all external design system references
- Added Canvas Kit MCP as sole source of truth
- Simplified component guidance
- Removed pattern/framework references

### 420-prototype-developer.mdc
- Removed external documentation links
- Simplified to Canvas Kit MCP only
- Removed animation and interaction guidance
- Focused on simple, clean implementations
- Removed custom theming and branding sections

## Key Principles

1. **Trust Canvas Kit**: Components work as-is, don't modify them
2. **Use Props, Not Styles**: Use Canvas Kit's margin/padding props
3. **Keep It Simple**: No custom animations, complex state, or overrides
4. **MCP Only**: Never reference external docs

## Testing

Dev server running at: http://localhost:5174/

The prototype now:
- Uses only Canvas Kit components
- Has no custom navigation
- Has no micro-animations
- Uses simple, clean styling
- Follows Canvas Kit v11 patterns

## Future Work

When implementing new prototypes:
1. Check Canvas Kit MCP first
2. Use components as-is
3. Don't add custom styling unless absolutely necessary
4. Keep implementations straightforward
5. Trust the design system
