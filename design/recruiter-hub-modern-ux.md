# Workday Recruiter Hub - Modern UX Design

**Status**: Draft Design  
**Designer**: AI Design & Prototype Agent  
**Target User**: Recruiter (managing multiple requisitions, high-volume hiring)  
**Design Direction**: Visual & simple - card-based, clean, easy to scan  
**Date**: March 18, 2026

---

## Design Overview

The Workday Recruiter Hub is a comprehensive recruiting command center that provides:
- **Centralized Dashboard**: All recruiting activities and metrics in one place
- **Workflow Management**: Active requisitions and candidate pipeline
- **Intelligence & Insights**: AI-powered recommendations and real-time analytics
- **Quick Actions**: One-click access to common recruiting tasks

**Design Philosophy**: Clean, visual interface that surfaces critical information at a glance while keeping detailed actions accessible. Card-based layout for easy scanning with AI recommendations prominently featured.

---

## Information Architecture

```
Recruiter Hub
├── Hero Section (At-a-glance metrics)
├── AI Recommendations Panel (HiredScore, Paradox, Interview Team Skill)
├── Action Queue (Your To-Dos)
│   ├── Interviews to Schedule
│   ├── Offers to Send
│   └── Approvals Needed
├── Active Requisitions Dashboard
│   ├── Pipeline View
│   └── Health Indicators
├── Candidate Queue
│   ├── New Applicants
│   ├── Screening
│   └── Interview Stage
└── Team Collaboration Panel
```

---

## Key Screens

### Screen 1: Recruiter Hub - Main Dashboard

**Purpose**: Single-pane-of-glass view of all recruiting activity with immediate access to critical tasks

**Canvas Kit Components Used**:
- `Card` - Primary container for sections
- `Banner` - AI recommendations and alerts
- `StatusIndicator` - Requisition health, pipeline status
- `PrimaryButton` - Quick actions (Post Job, Schedule Interview)
- `SecondaryButton` - Secondary actions (View All, Filter)
- `Table` - Requisition and candidate lists
- `Badge` - Counts, status labels
- `Avatar` - Hiring managers, candidates
- `Icon` - Visual indicators throughout
- `Tabs` - Switch between views (My Reqs, Team Reqs, All Activity)
- `Tooltip` - Contextual help

**Layout Structure**:

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Recruiter Hub              [Search] [Notifications] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Hero Metrics (3 cards in row)                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │   15 Active  │ │   42 New     │ │  12 Action   │        │
│ │   Reqs       │ │   Applicants │ │  Items       │        │
│ │   ↑ 3 new    │ │   today      │ │  Due today   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ 💡 AI Recommendations                          [Dismiss All] │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⭐ HiredScore: 3 top candidates for Senior PM role      │ │
│ │ 📅 Paradox can schedule 8 interviews automatically     │ │
│ │ 👥 Interview Team Skill: Optimal team ready for SWE-89│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ Your Action Queue                               [View All]   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ □ Schedule interview: Sarah Chen - PM role              │ │
│ │ □ Send offer: Marcus Williams - Engineering Manager     │ │
│ │ □ Review screening: 5 candidates for Data Analyst      │ │
│ │ □ Approve requisition: Technical Writer (hiring mgr)   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ Active Requisitions (15)              [Filters] [+ Post Job] │
│                                                               │
│ [My Reqs] [Team Reqs] [All Activity]  <-- Tabs             │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Req ID  │ Role          │ Pipeline │ Health │ Actions  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ REQ-892 │ Senior PM     │ ●●●●○○   │ 🟢 Good│ [View]  │ │
│ │ REQ-887 │ SWE II        │ ●●○○○○   │ 🟡 Slow│ [View]  │ │
│ │ REQ-883 │ Data Analyst  │ ●●●●●○   │ 🟢 Good│ [View]  │ │
│ │ REQ-879 │ Eng Manager   │ ●●●●●●   │ 🔵 Offer│ [View] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Canvas Kit Implementation Details

### 1. Hero Metrics Cards

```tsx
import { Card } from '@workday/canvas-kit-react/card';
import { Badge } from '@workday/canvas-kit-react/badge';
import { Icon } from '@workday/canvas-kit-react/icon';
import { trendUpIcon } from '@workday/canvas-system-icons-web';

<div className="hero-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: space.l }}>
  <Card>
    <div className="metric-value" style={{ fontSize: '32px', fontWeight: 'bold' }}>15</div>
    <div className="metric-label" style={{ color: colors.licorice300 }}>Active Requisitions</div>
    <Badge>
      <Icon icon={trendUpIcon} size="small" />
      3 new this week
    </Badge>
  </Card>
  
  <Card>
    <div className="metric-value" style={{ fontSize: '32px', fontWeight: 'bold' }}>42</div>
    <div className="metric-label" style={{ color: colors.licorice300 }}>New Applicants</div>
    <div style={{ color: colors.blueberry600 }}>Today</div>
  </Card>
  
  <Card>
    <div className="metric-value" style={{ fontSize: '32px', fontWeight: 'bold', color: colors.cinnamon600 }}>12</div>
    <div className="metric-label" style={{ color: colors.licorice300 }}>Action Items</div>
    <div style={{ color: colors.cinnamon600 }}>Due today</div>
  </Card>
</div>
```

### 2. AI Recommendations Banner

```tsx
import { Banner } from '@workday/canvas-kit-react/banner';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';

<Banner>
  <Banner.Icon icon={sparkleIcon} />
  <Banner.Label>AI Recommendations</Banner.Label>
  <Banner.ActionText>
    <div className="recommendations-list">
      <div className="recommendation-item">
        ⭐ <strong>HiredScore:</strong> 3 top candidates for Senior PM role
        <PrimaryButton size="small">View Candidates</PrimaryButton>
      </div>
      <div className="recommendation-item">
        📅 <strong>Paradox:</strong> Can schedule 8 interviews automatically
        <PrimaryButton size="small">Auto-Schedule</PrimaryButton>
      </div>
      <div className="recommendation-item">
        👥 <strong>Interview Team Skill:</strong> Optimal team ready for SWE-89
        <PrimaryButton size="small">Review Team</PrimaryButton>
      </div>
    </div>
  </Banner.ActionText>
  <SecondaryButton size="small">Dismiss All</SecondaryButton>
</Banner>
```

### 3. Action Queue

```tsx
import { Card } from '@workday/canvas-kit-react/card';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { SecondaryButton } from '@workday/canvas-kit-react/button';

<Card>
  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <h2>Your Action Queue</h2>
    <SecondaryButton size="small">View All</SecondaryButton>
  </div>
  
  <div className="action-list">
    <div className="action-item" style={{ display: 'flex', gap: space.m, padding: space.s }}>
      <Checkbox label="" />
      <div className="action-content">
        <div className="action-title">Schedule interview: Sarah Chen</div>
        <div className="action-subtitle" style={{ color: colors.licorice300 }}>
          Senior PM role • Due today
        </div>
      </div>
      <PrimaryButton size="small">Schedule</PrimaryButton>
    </div>
    
    <div className="action-item" style={{ display: 'flex', gap: space.m, padding: space.s }}>
      <Checkbox label="" />
      <div className="action-content">
        <div className="action-title">Send offer: Marcus Williams</div>
        <div className="action-subtitle" style={{ color: colors.licorice300 }}>
          Engineering Manager • Approved by hiring manager
        </div>
      </div>
      <PrimaryButton size="small">Send Offer</PrimaryButton>
    </div>
    
    {/* Additional action items... */}
  </div>
</Card>
```

### 4. Active Requisitions Table

```tsx
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Badge } from '@workday/canvas-kit-react/badge';

<Card>
  <div className="card-header">
    <h2>Active Requisitions (15)</h2>
    <div className="actions">
      <SecondaryButton>Filters</SecondaryButton>
      <PrimaryButton icon={addIcon}>Post Job</PrimaryButton>
    </div>
  </div>
  
  <Tabs>
    <Tabs.List>
      <Tabs.Item>My Reqs</Tabs.Item>
      <Tabs.Item>Team Reqs</Tabs.Item>
      <Tabs.Item>All Activity</Tabs.Item>
    </Tabs.List>
  </Tabs>
  
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Req ID</Table.Header>
        <Table.Header>Role</Table.Header>
        <Table.Header>Pipeline</Table.Header>
        <Table.Header>Health</Table.Header>
        <Table.Header>Hiring Manager</Table.Header>
        <Table.Header>Actions</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>REQ-892</Table.Cell>
        <Table.Cell>
          <strong>Senior Product Manager</strong>
          <div style={{ color: colors.licorice300, fontSize: '12px' }}>
            Posted 14 days ago
          </div>
        </Table.Cell>
        <Table.Cell>
          <PipelineIndicator filled={4} total={6} />
          <div>12 candidates</div>
        </Table.Cell>
        <Table.Cell>
          <StatusIndicator variant="positive">Good</StatusIndicator>
          <div style={{ fontSize: '12px' }}>18 days avg</div>
        </Table.Cell>
        <Table.Cell>
          <Avatar size="small" />
          <span>J. Smith</span>
        </Table.Cell>
        <Table.Cell>
          <SecondaryButton size="small">View</SecondaryButton>
        </Table.Cell>
      </Table.Row>
      
      <Table.Row>
        <Table.Cell>REQ-887</Table.Cell>
        <Table.Cell>
          <strong>Software Engineer II</strong>
          <div style={{ color: colors.licorice300, fontSize: '12px' }}>
            Posted 28 days ago
          </div>
        </Table.Cell>
        <Table.Cell>
          <PipelineIndicator filled={2} total={6} />
          <div>5 candidates</div>
        </Table.Cell>
        <Table.Cell>
          <StatusIndicator variant="caution">Slow</StatusIndicator>
          <div style={{ fontSize: '12px' }}>34 days avg</div>
        </Table.Cell>
        <Table.Cell>
          <Avatar size="small" />
          <span>M. Johnson</span>
        </Table.Cell>
        <Table.Cell>
          <SecondaryButton size="small">View</SecondaryButton>
        </Table.Cell>
      </Table.Row>
      
      {/* Additional rows... */}
    </Table.Body>
  </Table>
</Card>
```

### 5. Quick Actions Floating Button (Optional)

```tsx
import { FloatingActionButton } from '@workday/canvas-kit-react/button';
import { Menu } from '@workday/canvas-kit-react/menu';

<FloatingActionButton
  icon={addIcon}
  aria-label="Quick Actions"
>
  <Menu>
    <Menu.Item icon={jobPostIcon}>Post New Job</Menu.Item>
    <Menu.Item icon={calendarIcon}>Schedule Interview</Menu.Item>
    <Menu.Item icon={documentIcon}>Send Offer</Menu.Item>
    <Menu.Item icon={userIcon}>Add Candidate</Menu.Item>
  </Menu>
</FloatingActionButton>
```

---

## Screen 2: Candidate Queue View

**Purpose**: Focused view of candidates requiring recruiter action, organized by stage

**Canvas Kit Components**: Same as main dashboard + `SegmentedControl` for stage filtering

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Candidate Queue                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ [New (42)] [Screening (18)] [Interviewing (24)] [Offers (3)]│
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 👤 Sarah Chen                            Senior PM       │ │
│ │    Applied 2 hours ago • Resume score: 94/100           │ │
│ │    ⭐ HiredScore recommends: Top candidate               │ │
│ │    [View Profile] [Schedule Screening]                  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 👤 Marcus Thompson                       SWE II          │ │
│ │    Applied 5 hours ago • Resume score: 87/100           │ │
│ │    [View Profile] [Quick Reject] [Schedule Screening]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Hover States
- **Cards**: Subtle elevation increase (`boxShadow: depth.2` → `depth.3`)
- **Table rows**: Light blue background (`blueberry100`)
- **Action buttons**: Canvas Kit default hover states

### Loading States
- **Initial load**: Full-page skeleton with card placeholders
- **Table refresh**: Shimmer effect on table rows
- **AI recommendations**: Loading spinner in banner

### Error States
- **Failed to load reqs**: `Banner` with error variant and retry button
- **AI service down**: Dismissible warning banner
- **Action failure**: `Toast` notification with error details

### Empty States
- **No active reqs**: Centered empty state with `PrimaryButton` to "Post Your First Job"
- **No action items**: "All caught up! 🎉" message
- **No candidates**: Suggestions to share job posting or review screening criteria

---

## Responsive Behavior

### Desktop (1920px+)
- 3-column hero metrics
- Full table with all columns
- Side-by-side layout for multiple cards

### Tablet (768px - 1919px)
- 2-column hero metrics, third wraps below
- Table remains full-width, scrolls horizontally if needed
- Cards stack vertically

### Mobile (< 768px)
- Single column layout
- Hero metrics stack vertically
- Table becomes card-based list view
- Actions collapse into menu

---

## Accessibility Considerations

- **WCAG AA compliance**: All Canvas Kit components are accessible by default
- **Keyboard navigation**: Full tab order, Enter/Space for actions
- **Screen reader support**: 
  - ARIA labels for all interactive elements
  - Live regions for AI recommendations and action queue updates
  - Table headers properly associated
- **Focus management**: 
  - Focus trap in modals
  - Focus restoration after modal close
  - Visible focus indicators
- **Color contrast**: All text meets 4.5:1 ratio minimum
- **Error messaging**: Clear, actionable, associated with form fields

---

## Design Tokens

### Colors
- **Primary brand**: `blueberry600` (#0875E1) - Primary buttons, links
- **Success**: `greenApple600` - Positive status, good health
- **Warning**: `cantaloupe600` - Caution status, slow pipeline
- **Error**: `cinnamon600` - Error states, overdue items
- **Text primary**: `licorice500` - Body text
- **Text secondary**: `licorice300` - Supporting text
- **Background**: `soap100` - Page background
- **Card background**: `frenchVanilla100` - Card surfaces

### Spacing
- **Page margins**: `space.xl` (32px)
- **Card padding**: `space.l` (24px)
- **Element gaps**: `space.m` (16px)
- **Compact spacing**: `space.s` (8px)

### Typography
- **Hero metrics**: `fontSize: 32px, fontWeight: bold`
- **Card headers**: `fontSize: 20px, fontWeight: 600`
- **Body text**: Canvas Kit `body.medium` (14px)
- **Supporting text**: `fontSize: 12px, color: licorice300`

---

## Implementation Notes

### Integration Points
1. **HiredScore API**: Pull AI recommendations for top candidates
2. **Paradox API**: Fetch auto-scheduling suggestions
3. **Interview Team Skill**: Query optimal interview team recommendations
4. **Workday Recruiting Data**: 
   - Requisitions (status, pipeline, health metrics)
   - Candidates (applications, screening status, interview stage)
   - Actions (pending tasks, approvals needed)

### Performance Considerations
- **Lazy load**: Load candidate details on demand (not all 42 in initial payload)
- **Pagination**: Table pagination for reqs beyond 20
- **Caching**: Cache AI recommendations for 5 minutes
- **Real-time updates**: WebSocket for action queue updates

### State Management
- Use React Context or Redux for global state (filters, selected tab)
- Local component state for UI interactions (expanded cards, tooltips)
- Query library (React Query/SWR) for API data fetching and caching

---

## Open Questions

- **Q1**: Should AI recommendations be dismissible permanently or just for this session? → **PM Decision**
- **Q2**: What's the threshold for "slow" pipeline health? (days vs. historical average) → **Data/Analytics**
- **Q3**: Should we include recruiter workload balancing in team collaboration panel? → **PM + Recruiting Lead**
- **Q4**: Mobile-first or desktop-first implementation priority? → **PM Decision**

---

## Design Decisions

**Decision 1: Card-based layout over dense table**
- **Rationale**: Easier to scan visually, better responsive behavior, cleaner hierarchy. Recruiters prefer at-a-glance views over dense data tables for daily workflow.

**Decision 2: AI recommendations at top**
- **Rationale**: Proactive suggestions drive efficiency. Placing AI recommendations prominently encourages adoption and saves recruiters time.

**Decision 3: Action queue over traditional notifications**
- **Rationale**: Task-oriented view aligns with recruiter mental model. Clear "to-do list" format with checkboxes and CTAs is more actionable than notification list.

**Decision 4: Pipeline visual indicator (dots) vs. number**
- **Rationale**: Visual dots (●●●●○○) are faster to interpret than "4/6" text. Provides instant visual pattern recognition.

---

## Next Steps

1. **Prototype in Figma**: Create high-fidelity mockups with interactions
2. **User testing**: Validate with 3-5 recruiters for usability
3. **Canvas Kit validation**: Confirm all components are available in current version
4. **Technical feasibility**: Confirm API availability for AI integrations
5. **Implementation plan**: Break into epics/stories for development

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-18 | Initial design specification |

---

**Design Status**: Ready for stakeholder review and Figma prototyping
