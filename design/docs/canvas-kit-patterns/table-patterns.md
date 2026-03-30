# Table Patterns

Canvas Kit table patterns for data display in Workday Recruiting prototypes.

## Canvas Kit v14 Table Component

Canvas Kit v14 uses **compound component pattern** with semantic sub-components.

**Import**:
```tsx
import { Table } from '@workday/canvas-kit-react/table';
```

**Structure**:
```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Column 1</Table.Header>
      <Table.Header>Column 2</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data 1</Table.Cell>
      <Table.Cell>Data 2</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

**CRITICAL**: NO LONGER use HTML elements (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`). Use Canvas Kit compound components only.

## Status Badges in Tables

Use Canvas Kit `StatusIndicator` component for status badges (NEVER custom Box with inline styles).

**Import**:
```tsx
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
```

**Active/In-Progress Status**:
```tsx
<Table.Cell>
  <StatusIndicator
    type={StatusIndicator.Type.Blue}
    emphasis={StatusIndicator.Emphasis.Low}
    label="Interview"
  />
</Table.Cell>
```

**Completed/Success Status**:
```tsx
<Table.Cell>
  <StatusIndicator
    type={StatusIndicator.Type.Green}
    emphasis={StatusIndicator.Emphasis.Low}
    label="Completed"
  />
</Table.Cell>
```

**Inactive/Rejected Status**:
```tsx
<Table.Cell>
  <StatusIndicator
    type={StatusIndicator.Type.Gray}
    emphasis={StatusIndicator.Emphasis.Low}
    label="Rejected"
  />
</Table.Cell>
```

**Why StatusIndicator**:
- Automatically uses Canvas Kit design tokens (`borderRadius.s`, semantic colors)
- Ensures WCAG contrast compliance
- Consistent with Workday design system
- Accessible by default

## Clickable Links in Tables

For table cells with links (requisition IDs, document names):

```tsx
import { SANA_LINK_ACCENT } from './components/sanaShellTheme';

<Table.Cell>
  <BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>
    Senior Product Designer (REQ-2026-8841)
  </BodyText>
</Table.Cell>
```

## Skills/Tags Display

Use `StatusIndicator` with Gray/Low for neutral pill appearance:

```tsx
<Flex gap="xs" flexWrap="wrap">
  {['Figma', 'Design Systems', 'Accessibility', 'Prototyping'].map(skill => (
    <StatusIndicator
      key={skill}
      type={StatusIndicator.Type.Gray}
      emphasis={StatusIndicator.Emphasis.Low}
      label={skill}
    />
  ))}
</Flex>
```

**Anti-pattern to avoid**:
```tsx
// ❌ WRONG - Custom Box with inline styling
<Box padding="xxs xs" style={{ 
  backgroundColor: colors.soap100, 
  borderRadius: 12, 
  border: `1px solid ${colors.soap300}` 
}}>
  <BodyText size="small">{skill}</BodyText>
</Box>

// ✅ CORRECT - Canvas Kit StatusIndicator
<StatusIndicator
  type={StatusIndicator.Type.Gray}
  emphasis={StatusIndicator.Emphasis.Low}
  label={skill}
/>
```

## Timeline/Process Indicator Pattern

For candidate journey, approval flows, interview stages:

```tsx
import { colors } from '@workday/canvas-kit-react/tokens';

<Flex gap="m">
  <Box style={{ 
    width: 12, 
    height: 12, 
    borderRadius: '50%', 
    backgroundColor: colors.green500, 
    marginTop: 4 
  }} />
  <Box>
    <BodyText size="small" fontWeight="bold">Step Name</BodyText>
    <BodyText size="small" color={colors.blackPepper600}>
      Completed by Sophie Laurent · 19 Mar 2026
    </BodyText>
  </Box>
</Flex>
```

## Document/Attachment Pattern

For CV, cover letter, reference documents in candidate profiles:

```tsx
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { documentIcon } from '@workday/canvas-system-icons-web';
import { SANA_LINK_ACCENT } from './components/sanaShellTheme';

<Flex alignItems="center" gap="m" padding="s" style={{ 
  border: `1px solid ${colors.soap300}`, 
  borderRadius: 8 
}}>
  <SystemIcon icon={documentIcon} size={24} color={colors.blackPepper500} />
  <Box flex={1}>
    <BodyText size="small" fontWeight="bold" color={SANA_LINK_ACCENT}>
      CV_Camille_Dubois_2026.pdf
    </BodyText>
    <BodyText size="small" color={colors.blackPepper500}>
      Added by Candidate · 18 Mar 2026 · 1.2 MB
    </BodyText>
  </Box>
</Flex>
```

## Sana Color Roles for Tables

**Status and semantic colors**:

```tsx
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_LINK_ACCENT } from './components/sanaShellTheme';

// Active/In-Progress states
colors.blueberry100  // Background for active badges
colors.blueberry600  // Text for active badges

// Success/Completed states
colors.green100      // Background for success badges
colors.green500      // Icon color for completion dots
colors.green600      // Text for success messages
colors.green700      // Text for completed badges

// Error/Warning states
colors.cinnamon100   // Background for warning badges
colors.cinnamon600   // Text for warnings

// Inactive/Neutral states
colors.soap100       // Background for inactive chips/badges
colors.soap200       // Background for neutral badges
colors.soap300       // Borders for cards and separators

// Text hierarchy
colors.blackPepper600  // Primary body text
colors.blackPepper500  // Secondary metadata (dates, timestamps, sources)
colors.blackPepper400  // Disabled or tertiary text

// Interactive elements
SANA_LINK_ACCENT     // Clickable links, selected states (~#005CB9)
colors.blueberry500  // Primary button fills, focus rings
```

**Usage examples**:
- Interview stage badge: `blueberry100` bg + `blueberry600` text
- Completed step: `green500` dot + `blackPepper600` label
- Rejected status: `soap200` bg + `blackPepper600` text
- Metadata timestamp: `blackPepper500` color
- Clickable file name: `SANA_LINK_ACCENT` color

## Content Richness Standards

Every table must demonstrate **world-class** content quality:

**Realistic detail**:
- Job titles: "Senior Product Designer", not "Product Designer 1"
- Dates: "19 Mar 2026", not "01/01/2024"
- Names: "Sophie Laurent", "Camille Dubois" (realistic French names for GCC/France prototypes)
- Email: "sophie.laurent@workday.com", not "user@example.com"
- File names: "CV_Camille_Dubois_2026.pdf", not "document.pdf"
- Company names: "Baker Hughes", "Shell", "Accenture" (real GCC employers)
- Role titles: "Senior Recruiter", "HR Director" (realistic recruiting roles)

**Visual indicators**:
- Status badges for every row with state (Interview, Completed, Rejected)
- Skills/tags with StatusIndicator pills
- Icons for documents, attachments, actions
- Avatars for users

**Metadata layers**:
- Timestamps: "19 Mar 2026, 14:32"
- Sources: "Added by Candidate"
- File sizes: "1.2 MB"
- Participant roles: "Senior Recruiter"
- Stage durations: "3 days in Interview"

**Structured formatting**:
- Proper hierarchies (primary + secondary text)
- Logical groupings (related data together)
- Clear separators (borders, spacing)
- Not flat text blocks or minimal lists

**Professional polish**:
- Every tab feels like a shipped product screen
- Not wireframe placeholders or stub content
- Realistic workflows and user journeys

## Best Practices

### DO
- ✅ Use `Table.Head`, `Table.Body`, `Table.Row`, `Table.Header`, `Table.Cell` (v14 compound components)
- ✅ Use `StatusIndicator` for status badges (not custom Box)
- ✅ Use `SANA_LINK_ACCENT` for clickable links in cells
- ✅ Include realistic detail (names, dates, file names, companies)
- ✅ Add visual indicators (badges, icons, avatars)
- ✅ Show metadata (timestamps, sources, sizes, roles)
- ✅ Demonstrate world-class content richness on every tab

### DON'T
- ❌ Use HTML table elements (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`)
- ❌ Create custom badge components (use StatusIndicator)
- ❌ Use generic placeholder data ("User 1", "document.pdf", "user@example.com")
- ❌ Skip status indicators or visual hierarchy
- ❌ Build minimal/wireframe content (must feel production-ready)
- ❌ Use same status badge type for all rows (vary based on actual state)
