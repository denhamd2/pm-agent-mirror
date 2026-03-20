# Workday Recruiting Placement Patterns

This document captures common Workday Recruiting placement patterns discovered through the 315-ux-designer workflow. Use this as a reference library to speed up placement decisions for future features.

**Last Updated**: Wednesday Mar 18, 2026

---

## Pattern Categories

### 1. Extend Existing App

**When to use**: Feature adds a new capability to an existing workflow or adds a new channel/option to an existing feature.

**Examples**:
- **Campaigns App + WhatsApp**: Extend Campaigns with WhatsApp as a new channel alongside Email/SMS
  - Entry point: Campaigns dashboard → "Create campaign" → Channel selector (add WhatsApp option)
  - Reuses: Targeting, scheduling, tracking infrastructure
  - New: WhatsApp-specific message builder, consent tracking, phone preview

**Pattern characteristics**:
- ✅ Leverages familiar user workflow
- ✅ Reuses existing infrastructure
- ✅ Low learning curve
- ⚠️ Must follow existing app conventions

---

### 2. Add Tab to Existing Detail Page

**When to use**: Feature provides supplementary information or actions related to an existing entity (candidate, requisition, etc.).

**Examples**:
- **Candidate Detail + Compliance Tab**: Add "Compliance" tab to Candidate Detail page showing nationalization status, visa info, background check status
  - Entry point: Candidate Detail → Tab navigation → "Compliance" tab
  - Reuses: Candidate context, security permissions
  - New: Compliance data display, status indicators

**Pattern characteristics**:
- ✅ Contextual to existing entity
- ✅ Non-intrusive (doesn't change main workflow)
- ✅ Easy to discover (tab is visible)
- ⚠️ Limited real estate within tab

---

### 3. Modal or Side Panel

**When to use**: Feature is a lightweight action that doesn't require full page context, or is an occasional/secondary action.

**Examples**:
- **Bulk Candidate Rejection**: Modal dialog triggered from Candidate List for rejecting multiple candidates
  - Entry point: Candidate List → Select multiple → "Reject" button → Modal
  - Reuses: Candidate selection, rejection logic
  - New: Bulk rejection UI, reason selection, email templates

**Pattern characteristics**:
- ✅ Doesn't disrupt main workflow
- ✅ Clear focus on single action
- ✅ Easy to dismiss/cancel
- ⚠️ Limited space for complex interactions

---

### 4. New Page within Existing Module

**When to use**: Feature is substantial enough to warrant dedicated real estate but belongs within an existing module.

**Examples**:
- **Recruiting Analytics Dashboard**: New page under Recruiting module for analytics and reporting
  - Entry point: Main nav → Recruiting → "Analytics" menu item
  - Reuses: Recruiting security context, data access
  - New: Dashboard layout, charts, filters

**Pattern characteristics**:
- ✅ Dedicated space for complex UI
- ✅ Still within familiar module context
- ⚠️ Requires navigation changes (menu item)
- ⚠️ May feel disconnected from workflow if not well-integrated

---

### 5. New Standalone App

**When to use**: Feature is a major new capability that doesn't fit within existing apps, or serves a distinct user persona.

**Examples**:
- **Interview Kiosk**: Standalone app for on-site interview check-in
  - Entry point: Main nav → "Interview Kiosk" app
  - Reuses: Candidate data, interview schedules
  - New: Check-in UI, kiosk mode, candidate self-service

**Pattern characteristics**:
- ✅ Complete design freedom
- ✅ Optimized for specific use case
- ⚠️ Requires user discovery (new app)
- ⚠️ May silo functionality if not well-integrated

---

### 6. Inline Enhancement

**When to use**: Feature enhances existing UI in-place without requiring new navigation.

**Examples**:
- **Req List + Nationalization Indicators**: Add nationalization status badges to requisition list
  - Entry point: Existing requisition list (no new navigation)
  - Reuses: Requisition list layout
  - New: Status badges, hover tooltips, color coding

**Pattern characteristics**:
- ✅ Highly discoverable (no navigation needed)
- ✅ Minimal learning curve
- ⚠️ Must not clutter existing UI
- ⚠️ Limited to simple enhancements

---

## Decision Criteria

### Choose "Extend Existing App" when:
- Feature adds a new option/channel to existing workflow (e.g., WhatsApp to Campaigns)
- Users already familiar with the app will naturally expect this feature there
- Infrastructure (targeting, scheduling, reporting) can be reused
- Example: "Add [new channel/method] to [existing app]"

### Choose "Add Tab" when:
- Feature provides supplementary info for existing entity
- Not part of primary workflow but needed occasionally
- Requires entity context (candidate, req, offer)
- Example: "Add [compliance/analytics/history] view to [entity] detail"

### Choose "Modal/Panel" when:
- Action is quick, occasional, or secondary
- Doesn't require full page context
- Can be completed in one flow
- Example: "Bulk [action]", "Quick [edit/approve/reject]"

### Choose "New Page in Module" when:
- Feature is substantial (complex UI, multiple views)
- Belongs conceptually within existing module
- Doesn't fit as a tab or modal
- Example: "[Reporting/Analytics/Setup] for [module]"

### Choose "New Standalone App" when:
- Feature serves distinct persona or use case
- Doesn't fit within existing app boundaries
- Major new capability that warrants dedicated space
- Example: "[New major workflow] that spans multiple areas"

### Choose "Inline Enhancement" when:
- Feature enhances existing view without new navigation
- Simple addition (badges, indicators, tooltips)
- High discoverability needed
- Example: "Show [status/indicator] on [existing list/detail]"

---

## Anti-Patterns (Avoid These)

### ❌ Creating Isolated Feature Islands
**Problem**: Feature doesn't integrate with existing workflows
**Example**: Building standalone WhatsApp app instead of extending Campaigns
**Why bad**: Confuses users, duplicates infrastructure, breaks workflow continuity

### ❌ Adding Too Many Tabs
**Problem**: Tab navigation becomes overwhelming
**Example**: Candidate Detail with 15+ tabs
**Why bad**: Important info gets buried, users give up finding what they need

### ❌ Overusing Modals
**Problem**: Modal for complex multi-step process
**Example**: Modal with 5-step wizard requiring scrolling
**Why bad**: Cramped UI, hard to navigate, easy to lose progress

### ❌ Ignoring Existing Patterns
**Problem**: Inventing new navigation when pattern exists
**Example**: Creating new sidebar nav when tab pattern is standard
**Why bad**: Inconsistent UX, higher learning curve, maintenance burden

---

## Validation Checklist

When deciding placement, ask:

- [ ] Does this fit within an existing app/module, or is it truly new?
- [ ] What's the user's entry point? Is it discoverable?
- [ ] Does this reuse existing infrastructure (targeting, permissions, etc.)?
- [ ] Is this a primary workflow or secondary/occasional action?
- [ ] Have similar features used this pattern successfully?
- [ ] Does this create isolated feature island or integrate smoothly?
- [ ] Is the UI complexity appropriate for the chosen pattern? (simple → inline/modal, complex → page/app)

---

## Examples Library

As 315-ux-designer discovers placements, document them here:

### WhatsApp Campaign Integration (GCC)
- **Pattern**: Extend Existing App (Campaigns)
- **Placement**: Campaigns app → Campaign Builder
- **Entry Point**: Campaigns dashboard → "Create campaign" → Channel: WhatsApp
- **Rationale**: Extends familiar pattern, reuses infrastructure, high impact
- **Discovered**: Wednesday Mar 18, 2026

### [Add more examples as discovered]

---

## Notes

- This document grows over time as 315-ux-designer runs
- Patterns are guidelines, not rigid rules - context matters
- When in doubt, consult Deployment Agent MCP for Workday-specific guidance
- Six Hats Thinking helps validate pattern choice from multiple perspectives
