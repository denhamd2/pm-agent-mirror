# Pattern: Candidate Smart View (Profile / Detail View)

**Figma Reference:** [Candidate Smart View](https://www.figma.com/design/H9MuNnyypzRiuB5PQ6BMGJ/Candidate-Smart-View?node-id=75-93506)

This pattern defines the standard layout and Canvas Kit component mapping for detailed profile views, specifically the Candidate Smart View, within Workday Recruiting. The pattern emphasizes side-by-side resume comparison with persistent candidate context, enabling efficient candidate review and decision-making.

## Core Layout Pattern: Three-Column Data-Focused Design

The Figma Candidate Smart View uses a **three-column layout** (~30% / 40% / 30%) optimized for resume comparison workflows. This differs from the hub-style layout and prioritizes data density over navigation chrome.

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ WorkdayTopNav (Global Header)                                   │
├─────────────────────────────────────────────────────────────────┤
│ Top Action Bar: Carousel + Quick Actions + Toggle               │
├─────────────────────────────────────────────────────────────────┤
│ Left Panel    │ Center Panel          │ Right Panel             │
│ (380px)       │ (flex: 1)             │ (380px)                 │
│               │                       │                         │
│ • Header Card │ • Resume Tabs         │ • Structured Resume     │
│ • Action Card │ • Original/Parsed     │ • Bio                   │
│ • Tabs        │ • Resume Display      │ • Experience Timeline   │
│ • Insights    │                       │ • Skills                │
│ • Fit & Gap   │                       │ • Education             │
│ • Prev Apps   │                       │ • Certifications        │
└───────────────┴───────────────────────┴─────────────────────────┘
```

**Why three columns?**
- **Left**: Persistent context (candidate identity, insights, actions) — doesn't change during carousel navigation
- **Center**: Original document view for visual scan and download
- **Right**: Structured/parsed data for quick comparison and scanning
- Recruiters can compare structured data (right) while viewing source document (center)

**Canvas Kit Implementation:**
```typescript
<Flex flex={1} padding="l" gap="l" style={{ overflow: 'auto' }}>
  {/* Left panel */}
  <Flex flexDirection="column" gap="m" style={{ width: 380, flexShrink: 0 }}>
    {/* Left panel content */}
  </Flex>
  
  {/* Center panel */}
  <Flex flexDirection="column" flex={1} gap="m">
    {/* Resume tabs and content */}
  </Flex>
  
  {/* Right panel */}
  <Box style={{ width: 380, flexShrink: 0 }}>
    {/* Structured resume */}
  </Box>
</Flex>
```

## Layout Hierarchy & Canvas Kit Mapping

### 0. Top Action Bar (Above Content)

Horizontal action bar for carousel navigation and quick actions, positioned between global nav and main content.

**Elements:**
- **Carousel controls:** Arrow buttons + "2 of 50 Candidates" text label
- **Quick actions:** Icon-only buttons (Accept ✓, Decline ✗, Favorite ⭐, More •, Toggle)
- **Show Resume toggle:** Controls right panel visibility

**Canvas Kit Components:**
- Container: `<Flex padding="m" justifyContent="space-between" alignItems="center">` on white background
- Carousel: `<SecondaryButton icon={arrowLeftIcon} size="small" />` + `<BodyText>` + `<SecondaryButton icon={arrowRightIcon} size="small" />`
- Quick actions: `<TertiaryButton size="small" icon={...} aria-label="..." />`

**Visual specs:**
- Background: White
- Border: Bottom border `1px solid ${colors.soap400}`
- Padding: `space.m` (12px)
- Gap between carousel and actions: `space.s`

### 1. Global Shell & Navigation

**Note:** The three-column Candidate Smart View pattern does NOT use `WorkdayLeftTabBar` secondary column. It uses a flat three-column grid instead, prioritizing data density over hub-style navigation.

*   **Global Header:** Use `WorkdayTopNav` (grey bar, white pill search, trailing utilities).
*   **No Left Tab Bar:** Unlike hub-style layouts, this pattern omits the secondary navigation column to maximize content space.

## Content Panels & Interaction Patterns

### Color & Spacing Specifications

**Backgrounds:**
- Page canvas: `SANA_PAGE_CANVAS` (#F5F5F5 light grey)
- Cards: White (#FFFFFF)
- Action card: Light blue (`colors.blueberry100`)
- Status badges: Green/Orange/Red backgrounds

**Text colors:**
- Primary: `colors.blackPepper600` (dark grey)
- Secondary: `colors.blackPepper500` (medium grey)
- Links: `colors.blueberry400` (blue)
- Metadata: Light grey

**Spacing:**
- Panel gaps: `space.l` (16px) between columns
- Card gaps: `space.m` (12px) between sections in left panel
- List items: `space.xs` (4px) between insight bullets
- Card padding: `space.l` (16px) internal padding

### Typography Hierarchy

- Candidate name: `<Heading size="large">` (~24px)
- Section headings: `<Heading size="medium">` (~18px)
- Subsection headings: `<Heading size="small">` (~14px)
- Body text: `<BodyText size="small">` (~13px)
- Metadata: `<BodyText size="small">` (~12px) in grey

### Carousel Navigation Pattern

**Interaction model:**
- Prev/Next buttons in top action bar
- Keyboard shortcuts: Left/Right arrows (blocked when modal open)
- Counter: "2 of 50 Candidates" text
- All three panels update simultaneously during navigation
- Screen reader announcement on navigation

**Accessibility:**
- `aria-label` on all icon buttons
- `aria-live="polite"` region for carousel announcements
- Keyboard navigation support
- Focus management during modal interactions

## Layout Variants by Context

### Standard Candidate Review (Three-Column)
- **Use when:** Recruiter needs to compare resumes and make decisions
- **Layout:** Left context + Center document + Right structured data
- **Actions:** Accept/Decline buttons prominent in action card

### Simplified Review (Two-Column)
- **Use when:** Less data density needed, or narrower viewport
- **Layout:** Left context + Center/Right merged
- **Actions:** Same action patterns but single content area

## Anti-Patterns to Avoid

❌ **Don't use WorkdayLeftTabBar secondary column for this pattern** - The three-column data layout is incompatible with hub-style navigation

❌ **Don't hide the right structured resume panel by default** - Key value is side-by-side comparison; always show parsed data

❌ **Don't use custom badge components when Canvas Kit StatusIndicator exists** - Use Canvas Kit for consistency

❌ **Don't hardcode colors** - Always use Canvas Kit color tokens

❌ **Don't implement custom collapsible logic** - Use the reusable `CollapsibleSection` component

❌ **Don't create duplicate insight list patterns** - Use `InsightListItem` component for all icon + text lists

❌ **Don't neglect keyboard navigation** - Carousel must support arrow keys and respect modal focus traps

## Responsive Behavior

**Three-column layout breakpoints:**
- **≥1400px (Wide):** All three columns visible at full width (380px / flex / 380px)
- **1200-1399px (Medium):** Reduce fixed widths to 320px
- **<1200px (Narrow):** Stack to two-column (left panel spans full width above, center/right side-by-side below)
- **<800px (Mobile):** Single column, tabs for switching between context/resume/parsed

**Responsive implementation:**
- Use CSS media queries or container queries
- Maintain content hierarchy in stacked layouts
- Preserve carousel navigation at all breakpoints

## Communication Dock (Optional)

An optional, sliding column on the right side of the screen for multi-channel communication (Email, SMS, WhatsApp, Notes). This can be added as a fourth panel when communication is critical to the workflow.

*   **Right Rail (Collapsed State):** A narrow rail containing icons for different communication channels.
    *   *Styling:* `communicationRailButtonStyle` (~10px rounded tile, active channel gets a light blue fill + link-colour icon ring).
*   **Sliding Panel (Expanded State):** Opens when a channel is clicked.
    *   *Header:* Channel name and actions on a white surface (`SANA_COMM_PANEL_SURFACE`).
    *   *Thread/History:* Message bubbles (`SanaCommMessageBubble`) with white backgrounds, `soap300` borders, and ~12px radii (`SANA_COMM_MESSAGE_RADIUS_PX`).
    *   *Composer:* Input area (`SanaCommComposer`) using a pill container (`SANA_COMM_COMPOSER_RADIUS_PX`), white fill, focus rings, and an inset circular send button.
    *   *Canvas Kit:* Wrap in a `<Card padding="zero">`. Use shared patterns from `design/components/SanaCommPanelPatterns.tsx`.

**Note:** Communication Dock is not shown in the primary Figma three-column pattern but can be added when message/email capability is required.

## Data Model

**Candidate interface extensions for Smart View:**
```typescript
interface Candidate {
  // Identity
  id: string;
  name: string;
  title: string;
  grade: 'A' | 'B' | 'C' | 'D'; // Derived from HiredScore
  badges: string[]; // Source tags (Hirevu, External Referral, etc.)
  
  // Contact
  location: string;
  email: string;
  phone: string;
  
  // Application
  appliedDate: string;
  appliedJob: string;
  awaitingTask: string;
  awaitingTaskDate: string;
  
  // Insights
  insights: Insight[];
  fitGapItems: FitGapItem[];
  previousApplications: PreviousApp[];
  
  // Resume
  bio: string;
  experience: ResumeEntry[];
  skills: string[];
  education: string[];
  certifications: string[];
  resumeUrl: string;
}

interface Insight {
  id: string;
  icon: CanvasSystemIcon;
  iconColor?: string;
  text: string;
  linkText?: string;
}

interface FitGapItem {
  id: string;
  requirement: string;
  evidenceText: string;
  met: boolean;
}

interface PreviousApp {
  id: string;
  position: string;
  appliedDate: string;
  result: string;
  resultType: 'declined' | 'not-selected' | 'accepted';
}

interface ResumeEntry {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
  isCurrent?: boolean;
}
```

## Implementation Notes

**Carousel state management:**
- Use `useState` for current candidate index
- Keyboard event listeners on window with focus guards
- Block carousel during modal interactions
- Screen reader live region for navigation announcements

**Tab state:**
- Left panel tabs: Use `<Tabs initialTab="review">` with `data-id` props
- Center panel tabs: Separate `<Tabs>` instance for Resume/Attachments
- No shared state needed between tab groups

**Modal interactions:**
- Accept modal: Stage selection (if applicable) + optional note
- Decline modal: Reason selection + optional note + warning banner
- Both modals use `useModalModel` with carousel blocking

**Performance considerations:**
- Memoize tab content with `useMemo` when appropriate
- Lazy load resume preview for original format
- Virtual scroll for large previous applications table

## Canvas Kit Component Summary

**Layout:**
- `Flex`, `Box` - Three-column grid, all internal layouts
- `Card` - All panel containers

**Typography:**
- `Heading` (large, medium, small) - Name, sections, subsections
- `BodyText` (medium, small) - All body content and metadata

**Actions:**
- `PrimaryButton` - Move Forward (action card)
- `SecondaryButton` - Decline, View Questionnaire, carousel arrows, toggle buttons
- `TertiaryButton` - Quick action icons (accept, decline, favorite, more)
- `Menu` - Dropdown menus for button options

**Data Display:**
- `StatusIndicator` - Status badges, skill chips, badge pills, previous app results
- `Table` - Previous Applications table
- `Tabs` - Left panel tabs (Review/History/Job Desc), Center tabs (Resume/Attachments)
- `SystemIcon` - All icons (imported from `@workday/canvas-kit-react/icon`)
- `Avatar` - Candidate profile image

**Custom Components (extracted from Figma):**
- `CandidateGradeBadge` - Circular letter grade with color coding
- `CollapsibleSection` - Progressive disclosure container
- `InsightListItem` - Icon + text + optional link
- `StructuredResume` - Full parsed resume layout

## Styling Notes (Sana Style)

*   **No Breadcrumbs:** Do not use breadcrumb trails or chevron path strips. Navigation via top action bar carousel.
*   **Surfaces:** `SANA_PAGE_CANVAS` for the background, white for all cards and panels.
*   **Typography:** Clear hierarchy with Canvas Kit typography components. Bold section titles, regular body text.
*   **Spacing:** Consistent use of Canvas Kit spacing tokens (`space.xs`, `space.s`, `space.m`, `space.l`, `space.xl`).
*   **Borders:** Use `colors.soap400` for subtle borders, `colors.soap300` for card borders.
*   **Shadows:** `SANA_CARD_SHADOW` for cards, `SANA_CARD_SHADOW_LIFTED` for elevated states.
*   **Radii:** `SANA_CARD_RADIUS_LG` for all cards (~16-20px).

## When to Use This Pattern

Use this pattern when:
- The primary user job is to **deeply review a single entity** (Candidate, Job Requisition, Employee Profile)
- **Side-by-side comparison** is critical (original document vs. parsed data)
- **Quick carousel navigation** through multiple entities is needed
- **Contextual actions** (Accept/Decline/Move Forward) must be readily accessible
- **Progressive disclosure** helps manage information density (collapsible insights)

## Related Patterns

- **Pattern: Hired Score Grid** (`design/references/pattern-hired-score-grid.md`) - List/grid view pattern, complements this detail view
- **ProfilePageLayout Component** - Alternative profile shell with communication dock built-in
- **CommunicationDock Pattern** - Multi-channel messaging for candidate engagement

## Example Implementation

See: `design/candidate-smart-view-v86.tsx` for full reference implementation with all patterns integrated.

**Key features demonstrated:**
- Three-column layout with fixed side panels
- Top action bar with carousel and quick actions
- Collapsible sections (Candidate Insights, Fit & Gap)
- Previous Applications table with status badges
- Resume format toggle (Original/Parsed)
- Structured resume with typography hierarchy
- Accept/Decline modals with form controls
- Keyboard navigation (arrow keys)
- Accessibility features (screen reader announcements, aria labels)