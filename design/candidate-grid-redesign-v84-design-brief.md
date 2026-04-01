# Design Brief: Candidate Grid Redesign v84
**Mission:** DESIGN-001  
**Created:** 31 March 2026  
**Status:** Draft (PASS 1-2 Complete, Awaiting 318 Review)  
**Designer:** UX Designer (315)

---

## Context

**User Request:** "Redesigned candidate grid for easier screening and selection"

**Design Goal:** Create a modern, efficient candidate grid that improves screening speed and selection accuracy for high-volume recruiters, leveraging HiredScore AI grading and Canvas Kit patterns.

**Target Users:**
- High-volume recruiters (screening 50-200+ candidates per req)
- Specialist recruiters (deeper evaluation, multiple data points)
- Hiring managers (quick review, shortlist approval)

---

## PASS 1: LAYOUT STRATEGY

### Jobs-to-Be-Done (JTBD)

**Primary JTBD** (from `docs/jtbd-recruiting-hr-professional-and-manager.md`):

**Aligns with: Recruiter JTBD → Screen & Shortlist → "Review candidates efficiently"**

> **When** I have a requisition with dozens or hundreds of applicants,  
> **I want to** quickly scan key qualifications, AI fit scores, and current stage to identify top candidates,  
> **So I can** shortlist the best matches without opening every profile individually and meet my daily screening targets.

**Secondary JTBD:**
- **Bulk actions**: Move multiple candidates through stages simultaneously
- **Saved views**: Resume screening workflow state across sessions
- **Filter precision**: Narrow large pools by location, source, skills, HiredScore grade

### Shell Pattern Selection

**Pattern: Shell B+ (Extended List Context)**

Rationale:
- **Primary focus**: Wide data grid with rich columns (name, score, location, source, stage, actions)
- **Left rail**: Faceted filters (stage, location, source, date range, HiredScore grade bands)
- **Top context**: Job req header with metadata (ID, title, hiring manager, target start date)
- **Right rail**: Optional CommunicationDock (collapsed by default, expands for candidate comms)

**Why B+ vs. B**: Enhanced with pipeline stage visualization above grid (A+ element) for at-a-glance funnel health.

### Layout Regions & Hierarchy

**Canonical Pattern**: `design/references/pattern-hired-score-grid.md` (Figma node 490-62877)

**Layout Regions:**
1. **Global Shell**:
   - Top nav: `WorkdayTopNav` (grey bar, white pill search, utilities)
   - Primary left rail: `WorkdayLeftTabBar` (Recruiting Hub icon + sections)
   - Secondary nav: Hub submenu (Dashboard, Job Reqs, Candidates, Reports)

2. **Main Content Area**:
   - **Context Header** (top):
     - Req title, metadata (ID, location, hiring manager, recruiter)
     - Tabs: Candidates | Details | Team
   - **Section Header**:
     - Title: "Active Candidates" (or "All Applicants" based on view)
     - Actions: Add Candidate, Export, Settings
   - **Pipeline Visualization** (horizontal):
     - Stage cards with counts (Applied: 87, Phone Screen: 12, Interview: 5, Offer: 2)
     - Visual progress indicator
   - **Grid Area** (split):
     - **Left column (20%)**: Faceted filters sidebar
     - **Right column (80%)**: Data grid with toolbar, table, pagination

**Hierarchy:**
1. **Primary**: Data grid (candidate rows, HiredScore column, action buttons)
2. **Secondary**: Filters (contextual refinement), Pipeline viz (funnel health)
3. **Supporting**: Context header (req metadata), saved views (quick filters)

### Interaction Model

**Grid Interactions:**
- **Row click**: Opens candidate profile modal (Sheet overlay)
- **Checkbox select**: Enables bulk action toolbar
- **HiredScore badge hover**: Shows grade breakdown tooltip
- **Column headers**: Sortable (click to sort by score, date, stage)
- **Row actions menu**: Quick actions (Move Forward, Reject, Schedule Interview)

**Filter Interactions:**
- **Checkbox groups**: Multi-select for stages, sources
- **Dropdown filters**: Single-select for location, date range
- **Clear all**: Resets filters to default view
- **Saved views**: Quick access to "My Top Picks", "New Today", "Needs Review"

**Bulk Actions:**
- Select multiple rows → Toolbar appears with Move to Stage, Send Message, Export
- Keyboard: Shift+click for range select

### Density & Scanning Optimization

**Information density**: Dense view (15-20 rows visible without scrolling)
- Row height: 56px (compact but readable)
- Column widths: Fixed for consistency, wider for name/title
- Progressive disclosure: Essential data in grid, details in modal

**Scanning optimization**:
- **Visual hierarchy**: HiredScore grade uses color + letter badge (A=green, B=blue, C=orange, D=grey)
- **Status indicators**: Stage pills with color coding
- **Quick actions**: Inline buttons for frequent actions (no menu hunting)

### Canvas Kit Coverage (High-Level)

Primary components:
- `Table` (grid)
- `Flex` layouts (split columns, pipeline cards)
- `Tabs` (context header)
- `Checkbox` (row selection, filters)
- `Button` variants (primary, secondary, toolbar icon buttons)
- `Menu` (row actions)
- `Sheet` (candidate profile modal)
- Custom: `HiredScoreGrading` component (A-D letter badges with progress bar)

---

## PASS 2: UI COMPOSITION (CANVAS KIT)

### Component Mapping

#### Global Shell Components

```typescript
// Top Nav
<WorkdayTopNav
  searchPlaceholder="Search candidates, jobs, people..."
  trailingButtons={[
    { icon: notificationsIcon, label: 'Notifications' },
    { icon: helpIcon, label: 'Help' },
    { icon: userIcon, label: 'Profile' },
  ]}
/>

// Left Rail
<WorkdayLeftTabBar
  primaryTabs={[
    { id: 'home', icon: homeIcon, label: 'HOME' },
    { id: 'recruiting', icon: recruitingIcon, label: 'RECRUITING', active: true },
    { id: 'talent', icon: talentIcon, label: 'TALENT' },
  ]}
  secondaryNav={{
    title: 'Recruiting Hub',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'job-reqs', label: 'Job Requisitions' },
      { id: 'candidates', label: 'Candidates', active: true },
      { id: 'reports', label: 'Reports' },
    ],
  }}
/>
```

#### Context Header

```typescript
<Box padding="l" backgroundColor="frenchVanilla100">
  <Flex alignItems="center" gap="s">
    <Heading size="large">Senior Product Manager</Heading>
    <StatusIndicator type="open" />
  </Flex>
  <Flex gap="l" marginTop="s">
    <Subtext>
      <Text>ID:</Text> <Text fontWeight="bold">REQ-2024-1234</Text>
    </Subtext>
    <Subtext>
      <Text>Location:</Text> <Text fontWeight="bold">San Francisco, CA</Text>
    </Subtext>
    <Subtext>
      <Text>Hiring Manager:</Text> <Text fontWeight="bold">Sarah Chen</Text>
    </Subtext>
    <Subtext>
      <Text>Target Start:</Text> <Text fontWeight="bold">June 2026</Text>
    </Subtext>
  </Flex>
  <Tabs marginTop="m">
    <Tab id="candidates" active>Candidates</Tab>
    <Tab id="details">Details</Tab>
    <Tab id="team">Team</Tab>
  </Tabs>
</Box>
```

#### Pipeline Visualization

```typescript
<Flex gap="s" padding="l" backgroundColor="frenchVanilla100">
  {stages.map(stage => (
    <Box
      key={stage.id}
      flex={1}
      padding="m"
      backgroundColor="white"
      borderRadius="m"
      border="1px solid"
      borderColor="soap300"
    >
      <Text size="small" fontWeight="bold">{stage.name}</Text>
      <Heading size="large" marginTop="xs">{stage.count}</Heading>
      <ProgressBar
        value={stage.count}
        max={totalCandidates}
        aria-label={`${stage.name} progress`}
      />
    </Box>
  ))}
</Flex>
```

#### Filter Sidebar (Left Column)

```typescript
<Box
  width="280px"
  padding="m"
  backgroundColor="white"
  borderRight="1px solid"
  borderColor="soap300"
  overflowY="auto"
>
  <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
    <Heading size="small">Filters</Heading>
    <TertiaryButton size="small">Clear All</TertiaryButton>
  </Flex>

  {/* Saved Views */}
  <Box marginBottom="l">
    <Text size="small" fontWeight="bold" marginBottom="s">Saved Views</Text>
    <Stack spacing="xs">
      <Checkbox label="My Top Picks" />
      <Checkbox label="New Today" />
      <Checkbox label="Needs Review" />
    </Stack>
  </Box>

  {/* HiredScore Grade */}
  <Box marginBottom="l">
    <Text size="small" fontWeight="bold" marginBottom="s">HiredScore Grade</Text>
    <Stack spacing="xs">
      <Checkbox label="A - Strong Fit (85-100%)" />
      <Checkbox label="B - Good Fit (70-84%)" />
      <Checkbox label="C - Moderate Fit (55-69%)" />
      <Checkbox label="D - Developing Fit (0-54%)" />
    </Stack>
  </Box>

  {/* Stage */}
  <Box marginBottom="l">
    <Text size="small" fontWeight="bold" marginBottom="s">Stage</Text>
    <Stack spacing="xs">
      <Checkbox label="Applied" defaultChecked />
      <Checkbox label="Phone Screen" defaultChecked />
      <Checkbox label="Interview" defaultChecked />
      <Checkbox label="Offer" />
      <Checkbox label="Hired" />
      <Checkbox label="Rejected" />
    </Stack>
  </Box>

  {/* Source */}
  <Box marginBottom="l">
    <Text size="small" fontWeight="bold" marginBottom="s">Source</Text>
    <Select>
      <option value="all">All Sources</option>
      <option value="linkedin">LinkedIn</option>
      <option value="career-site">Career Site</option>
      <option value="referral">Employee Referral</option>
      <option value="agency">Agency</option>
    </Select>
  </Box>

  {/* Location */}
  <Box marginBottom="l">
    <Text size="small" fontWeight="bold" marginBottom="s">Location</Text>
    <Select>
      <option value="all">All Locations</option>
      <option value="sf">San Francisco, CA</option>
      <option value="ny">New York, NY</option>
      <option value="remote">Remote</option>
    </Select>
  </Box>
</Box>
```

#### Data Grid (Right Column)

```typescript
<Box flex={1} padding="l">
  {/* Saved Filters Quick Access */}
  <Flex gap="s" marginBottom="m">
    <Pill active>All Active (127)</Pill>
    <Pill>New Today (12)</Pill>
    <Pill>High Score (A-B) (45)</Pill>
    <Pill>Needs Review (23)</Pill>
  </Flex>

  {/* Bulk Action Toolbar (appears when rows selected) */}
  {selectedCount > 0 && (
    <Box
      padding="m"
      backgroundColor="blueberry100"
      borderRadius="m"
      marginBottom="m"
    >
      <Flex alignItems="center" gap="m">
        <Text fontWeight="bold">{selectedCount} selected</Text>
        <SecondaryButton size="small">Move to Stage</SecondaryButton>
        <SecondaryButton size="small">Send Message</SecondaryButton>
        <SecondaryButton size="small">Export</SecondaryButton>
        <TertiaryButton size="small">Deselect All</TertiaryButton>
      </Flex>
    </Box>
  )}

  {/* Data Table */}
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell width="40px">
          <Checkbox onChange={handleSelectAll} />
        </Table.HeaderCell>
        <Table.HeaderCell width="200px" sortable>Name</Table.HeaderCell>
        <Table.HeaderCell width="160px" sortable>HiredScore</Table.HeaderCell>
        <Table.HeaderCell width="150px" sortable>Location</Table.HeaderCell>
        <Table.HeaderCell width="120px" sortable>Source</Table.HeaderCell>
        <Table.HeaderCell width="120px">Stage</Table.HeaderCell>
        <Table.HeaderCell width="100px" sortable>Applied</Table.HeaderCell>
        <Table.HeaderCell width="120px">Actions</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {candidates.map(candidate => (
        <Table.Row
          key={candidate.id}
          onClick={() => openProfileModal(candidate.id)}
          hover
        >
          <Table.Cell>
            <Checkbox
              checked={selectedIds.includes(candidate.id)}
              onChange={(e) => {
                e.stopPropagation();
                toggleSelect(candidate.id);
              }}
            />
          </Table.Cell>
          <Table.Cell>
            <Flex flexDirection="column">
              <Text fontWeight="bold">{candidate.name}</Text>
              <Text size="small" color="blackPepper500">{candidate.title}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>
            <HiredScoreGrading
              score={candidate.hiredScore}
              grade={candidate.grade}
              variant="full"
            />
          </Table.Cell>
          <Table.Cell>{candidate.location}</Table.Cell>
          <Table.Cell>
            <SourceBadge source={candidate.source} />
          </Table.Cell>
          <Table.Cell>
            <StagePill stage={candidate.stage} />
          </Table.Cell>
          <Table.Cell>
            <Text size="small">{formatDate(candidate.appliedDate)}</Text>
          </Table.Cell>
          <Table.Cell>
            <Menu>
              <ToolbarIconButton icon={moreVerticalIcon} />
              <Menu.Popper>
                <Menu.Item onClick={() => moveForward(candidate.id)}>
                  Move Forward
                </Menu.Item>
                <Menu.Item onClick={() => scheduleInterview(candidate.id)}>
                  Schedule Interview
                </Menu.Item>
                <Menu.Item onClick={() => sendMessage(candidate.id)}>
                  Send Message
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={() => reject(candidate.id)} variant="destructive">
                  Reject
                </Menu.Item>
              </Menu.Popper>
            </Menu>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>

  {/* Pagination */}
  <Flex justifyContent="space-between" alignItems="center" marginTop="m">
    <Text size="small">Showing 1-20 of 127 candidates</Text>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </Flex>
</Box>
```

#### HiredScore Grading Component (Custom)

```typescript
// Per pattern-hired-score-grid.md specification
interface HiredScoreGradingProps {
  score: number;        // 0-100
  grade: 'A' | 'B' | 'C' | 'D';
  variant?: 'full' | 'compact';
}

// Grade A: 85-100% - greenApple100 bg, greenApple600 text/bar, "Strong fit"
// Grade B: 70-84% - soap200 bg, blueberry600 text, blueberry500 bar, "Good fit"
// Grade C: 55-69% - cantaloupe100 bg, cantaloupe600 text/bar, "Moderate fit"
// Grade D: 0-54% - soap200 bg, blackPepper500 text, soap400 bar, "Developing fit"

<Flex alignItems="center" gap="xs">
  <Box
    minWidth="28px"
    padding="xxs"
    backgroundColor={gradeConfig[grade].badgeBg}
    borderRadius="s"
    border="1px solid"
    borderColor="soap300"
  >
    <Text
      size="small"
      fontWeight="bold"
      color={gradeConfig[grade].textColor}
    >
      {grade}
    </Text>
  </Box>
  <Flex flexDirection="column" gap="xxs" flex={1}>
    <Flex gap="xs" alignItems="baseline">
      <Text fontWeight="bold" color="blackPepper600">{score}%</Text>
      <Text size="small" color="blackPepper500">{gradeConfig[grade].label}</Text>
    </Flex>
    {variant === 'full' && (
      <ProgressBar
        value={score}
        max={100}
        height="4px"
        borderRadius="2px"
        backgroundColor="soap300"
        fillColor={gradeConfig[grade].barColor}
      />
    )}
  </Flex>
</Flex>
```

### Copy Inventory (for 319 Review)

| Element | Copy | Notes |
|---------|------|-------|
| Page title | "Senior Product Manager - Candidates" | Context-aware (req title + tab) |
| Section header | "Active Candidates" | Clear scope |
| Filter sidebar title | "Filters" | Standard |
| Clear filters button | "Clear All" | Action-oriented |
| Saved views | "My Top Picks", "New Today", "Needs Review" | Personal, time-bound, action-needed |
| HiredScore filter | "A - Strong Fit (85-100%)" | Grade + label + range for clarity |
| Stage checkboxes | "Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected" | Standard recruiting stages |
| Bulk action buttons | "Move to Stage", "Send Message", "Export" | Verb-first, clear actions |
| Table headers | "Name", "HiredScore", "Location", "Source", "Stage", "Applied", "Actions" | Scannable, concise |
| Row actions menu | "Move Forward", "Schedule Interview", "Send Message", "Reject" | Action verbs, recruiter language |
| Pagination | "Showing 1-20 of 127 candidates" | Clear range + total count |
| HiredScore labels | "Strong fit", "Good fit", "Moderate fit", "Developing fit" | Positive framing (even for D) |
| Empty state | "No candidates match your filters. Try clearing some filters or adjusting your search." | Helpful, actionable |

---

## PASS 3: Sana Style Alignment (Ready for 318 Review)

### Surfaces & Colours

**Backgrounds:**
- Main canvas: `SANA_PAGE_CANVAS` (#F5F6F8)
- Grid container: White (#FFFFFF)
- Filter sidebar: White (#FFFFFF)
- Context header: `frenchVanilla100`
- Bulk action toolbar: `blueberry100`

**Borders:**
- Grid container: `SANA_CARD_RADIUS_LG` (12px radius)
- Filter sidebar: 1px solid `soap300` (right edge)
- Table rows: 1px solid `soap300` (bottom)

**Text:**
- Primary headings: `blackPepper600`, bold
- Body text: `blackPepper600`, regular
- Supporting text: `blackPepper500`, regular
- Disabled text: `soap600`

### Typography

- Page title (Req name): `Heading size="large"` (24px, bold)
- Section headers: `Heading size="medium"` (18px, bold)
- Subsection headers: `Heading size="small"` (16px, bold)
- Table headers: 14px, bold
- Table cell text: 14px, regular
- Supporting text: 12px, regular

### Spacing

- Section padding: `padding="l"` (24px)
- Card padding: `padding="m"` (16px)
- Element gaps: `gap="m"` (16px) for major, `gap="s"` (8px) for minor
- Table row height: 56px (dense but readable)
- Filter sidebar width: 280px (fixed)

### Accessibility

- **Keyboard navigation**: Tab order follows reading order, row focus visible
- **Screen reader**: ARIA labels on all interactive elements
- **Contrast**: All text meets WCAG AA (4.5:1 minimum)
- **Focus indicators**: 2px blue outline on interactive elements
- **Sortable columns**: ARIA sort attributes, visual sort indicator (arrow icon)
- **Bulk select**: Announce selection count to screen readers

---

## Design Decisions & Rationale

### 1. HiredScore Prominence

**Decision:** Dedicated HiredScore column with full variant (letter badge + percentage + label + progress bar)

**Rationale:**
- High-volume recruiters cite AI scoring as primary screening tool
- Full variant provides at-a-glance grade + detailed percentage for confidence
- Visual color coding (green A → grey D) enables rapid scanning without reading text

### 2. Dense Row Height (56px)

**Decision:** 56px rows vs. standard 72px

**Rationale:**
- Maximize visible candidates without scrolling (15-20 vs. 10-12)
- Recruiter workflow is scanning-heavy, not reading-heavy
- Still meets touch target size for actions (48px minimum)

### 3. Faceted Filters (Left Sidebar)

**Decision:** Persistent left sidebar with collapsible sections

**Rationale:**
- Recruiters refine searches iteratively (not one-shot)
- Persistent visibility reduces cognitive load (no toggling filter panel)
- HiredScore grade filter is critical for volume screening

### 4. Saved Views (Quick Pills)

**Decision:** Horizontal pill navigation above grid, not dropdown

**Rationale:**
- Faster access to common views (no dropdown interaction)
- Visually reinforces view context (active pill = current state)
- Space-efficient for 3-5 common views

### 5. Inline Row Actions (Menu)

**Decision:** Three-dot menu in Actions column, not inline buttons

**Rationale:**
- Reduces visual clutter (4-5 buttons per row would dominate)
- Scales to additional actions without layout changes
- Primary action (open profile) is row click, not button

### 6. Bulk Action Toolbar (Contextual)

**Decision:** Appears only when rows selected, fixed position above table

**Rationale:**
- Reduces visual noise when not needed
- Clear focus on bulk actions when active (blue background)
- Fixed position prevents scrolling away from actions

---

## Open Questions for 318 Review

1. **Pipeline Viz Placement:** Should pipeline stage cards be above filters or integrated into filter sidebar as "Stage" section with counts?

2. **HiredScore Tooltip:** On hover, show grade breakdown (Technical Skills: 90%, Experience: 85%, Culture Fit: 80%)? Or is full variant sufficient?

3. **Saved Views Management:** Should "My Top Picks" be user-configurable filters, or hardcoded shortcuts? If configurable, where's the "Save Current View" button?

4. **Bulk Select All:** "Select all on this page" (20) vs. "Select all matching filters" (127)? Risk of accidental bulk actions on large sets.

5. **Column Customization:** Should recruiters be able to add/remove/reorder columns? Or is fixed column set sufficient for v1?

---

## Next Steps

1. **Copy Review (319)**: Validate all UI copy against Editorial Guidelines, check persona tone
2. **Peer Review (318)**: Harsh evaluation against Workday standards, Sana Style, Canvas Kit patterns
3. **Prototype (320)**: Build functional prototype using Canvas Kit components
4. **Figma Capture (330)**: Capture running prototype to Figma for design review

---

## References

- **JTBD Worksheet:** `docs/jtbd-recruiting-hr-professional-and-manager.md`
- **Canonical Pattern:** `design/references/pattern-hired-score-grid.md` (Figma node 490-62877)
- **Canvas Kit:** Components from Canvas Kit design system
- **Sana Style Guide:** `010-style-guide.mdc` → Design & Deck Standards
- **Editorial Guidelines:** `.cursor/skills/editorial-guidelines/SKILL.md`

---

*End of Design Brief v84 - PASS 1-2 Complete, Ready for 318 Review*
