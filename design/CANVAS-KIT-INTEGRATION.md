# Canvas Kit MCP Integration - Workday Recruiting Prototype

## Overview
This prototype actively uses Workday's Canvas Kit design system with proper styling patterns aligned to enterprise Workday applications.

## Canvas Kit Components Used

### Layout & Structure
- **Box** - Core layout primitive with style props
- **Flex** - Flexbox container with gap, alignment, and direction props
- **Card** - Elevated content container with consistent borders and shadows

### Navigation & Controls
- **PrimaryButton** - High-emphasis actions (Post job)
- **SecondaryButton** - Medium-emphasis actions (Settings, Review candidates)
- **TertiaryButton** - Low-emphasis actions (View all, navigation icons)
- **Table** - Compound component (Table.Head, Table.Body, Table.Row, Table.Header, Table.Cell)

### Content Display
- **Avatar** - User profile images with proper sizing
- **SystemIcon** - Icons from @workday/canvas-system-icons-web
- **Heading** - Typography for headings (large, medium, small)
- **BodyText** - Body copy with size and weight props
- **Subtext** - De-emphasized text
- **TextInput** - Form inputs with proper styling

### Design Tokens
- **colors** - Workday color palette (blueberry, cinnamon, soap, blackPepper, greenApple, cantaloupe)
- **space** - Consistent spacing scale (xxxs → xxxl)
- **type** - Typography tokens

## Styling Architecture

### Card Patterns
All cards follow consistent structure:
```tsx
<Card style={{ padding: 0, overflow: 'hidden' }}>
  {/* Header with border */}
  <Box style={{ padding: space.l, borderBottom: `1px solid ${colors.soap300}` }}>
    <BodyText size="medium" fontWeight="bold">Section Title</BodyText>
  </Box>
  
  {/* Content area */}
  <Box style={{ padding: space.l }}>
    {/* Content */}
  </Box>
</Card>
```

### Interactive States
- **Hover**: Background color transitions (150ms ease-in-out)
- **Active**: Scale down slightly (scale(0.98))
- **Selected**: Persistent background color change
- **Focus**: Proper focus rings on interactive elements

### Color Usage
- **Primary Actions**: blueberry600 (Workday blue)
- **Success States**: greenApple100/600
- **Warning States**: cantaloupe100/600
- **Critical States**: cinnamon500/600
- **Neutral**: soap100/200/300 for backgrounds and borders
- **Text**: blackPepper400/600 for hierarchy

### Spacing Scale
- **xxxs**: Minimal spacing
- **xxs**: Very tight spacing
- **xs**: Tight spacing
- **s**: Small spacing
- **m**: Medium spacing (default)
- **l**: Large spacing (card padding)
- **xl**: Extra large (page margins)
- **xxl**: Very large
- **xxxl**: Maximum spacing

## Canvas Kit Best Practices Applied

### 1. Compound Components
Using proper Canvas Kit compound component patterns:
- `Table.Head` / `Table.Body` / `Table.Row` / `Table.Header` / `Table.Cell`
- Proper semantic HTML structure

### 2. Icon Integration
- Icons from `@workday/canvas-system-icons-web`
- Size prop for consistent sizing (14, 16, 20, 24)
- Color prop for semantic coloring
- `iconPosition` prop for button icon placement

### 3. Typography Hierarchy
- `Heading` for section titles
- `BodyText` for primary content with `fontWeight` prop
- `Subtext` for de-emphasized content
- Consistent font sizing using Canvas Kit's type scale

### 4. Accessible Interactions
- Proper `aria-label` on icon-only buttons
- Keyboard navigation support via Canvas Kit defaults
- Focus management in interactive components
- Proper color contrast ratios

### 5. Responsive Patterns
- Flexbox with `flexWrap="wrap"` for responsive layouts
- `minWidth` constraints on flex items
- Percentage-based flex sizing (`flex: '1 1 55%'`)

## Migration Notes

This prototype uses Canvas Kit v11 with the old token system:
- `@workday/canvas-kit-react/tokens` (colors, space, type)
- Fruit-named colors (blueberry, cinnamon, cantaloupe, etc.)

### Future Migration Path (v14+)
Canvas Kit v14+ uses the new token system:
- `@workday/canvas-tokens-web`
- System tokens: `sys.color.bg.*`, `sys.color.fg.*`, `sys.color.border.*`
- Example: `colors.blueberry600` → `sys.color.bg.primary.default`

The Canvas Kit MCP tool provides migration guides for updating to newer versions.

## Interactive Features

### State Management
- `activeTab` - Tab selection state
- `selectedReq` - Table row selection
- `searchQuery` - Global search input
- Component-level hover states for micro-interactions

### Animations
All animations use Canvas Kit-compatible easing:
- `transition: 'all 150ms ease-in-out'` - Standard interactions
- `transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'` - Material design easing for cards
- Hover lift: `translateY(-2px)` with shadow enhancement

### Event Handlers
- `onClick` for primary interactions
- `onMouseEnter` / `onMouseLeave` for hover effects
- Proper event propagation and state updates

## Workday Design Patterns

### Global Navigation
- Blueberry600 header background
- White text and icons
- Global search with icon prefix
- Notification badges with pulse animation
- User avatar in top-right

### Content Structure
- Two-tier header (global + app-specific)
- Tab navigation below header
- Two-column layout (60/40 split)
- Left column: primary content (actions, table, queue)
- Right column: secondary content (AI recommendations, interviews, activity)

### Visual Hierarchy
- Section headers with icon + bold text
- Divider lines between sections (soap300)
- Consistent card elevation (1-3px shadows)
- Hover states increase elevation

### Density
- Compact spacing within lists (space.s)
- Generous card padding (space.l)
- Consistent vertical rhythm
- White space for breathing room

## Performance Considerations

### Optimizations
- React state for hover effects (vs CSS-only) for predictable animations
- Inline styles for dynamic values
- Static styles for consistent values
- Minimal re-renders via proper state management

### Bundle Size
- Canvas Kit tree-shaking enabled
- Only importing used components
- Icon library subset imported
- Current bundle: ~329KB (101KB gzipped)

## Testing Recommendations

### Visual Testing
- Verify hover states on all interactive elements
- Check card elevations and shadows
- Validate color contrast ratios
- Test responsive breakpoints

### Interaction Testing
- Tab navigation functionality
- Table row selection
- Button click handlers
- Search input behavior

### Accessibility Testing
- Keyboard navigation
- Screen reader labels
- Focus indicators
- Color contrast compliance

## Resources

- Canvas Kit Storybook: https://workday.github.io/canvas-kit/
- Canvas Design System: https://canvas.workday.com/
- Canvas Kit GitHub: https://github.com/Workday/canvas-kit
- Canvas Kit MCP: Available via `CallMcpTool` with server `user-canvas-kit-mcp`
