# Design Brief: Interview Intelligence Agent (v96)

## PRD Reference
`docs/prds/interview-intelligence-agent-prd.md`

## Prototype Scope
End-to-end interview intelligence flow across three connected views, demonstrating all three agent capabilities in a single recruiter/hiring manager workflow.

## JTBD Framing

**Interviewer JTBD**: "When preparing for an interview with a candidate I haven't met, I want structured, role-relevant questions and candidate highlights so I can conduct a rigorous, fair interview without spending 30 minutes on ad-hoc preparation."

**Recruiter JTBD**: "When all panellists have submitted feedback, I want a synthesised view of where they agree and disagree so I can quickly identify whether we're ready for a debrief or need clarification."

**Hiring Manager JTBD**: "When running a debrief meeting with my interview panel, I want a structured agenda with evidence-based discussion prompts so I can make a confident hire/no-hire decision in one meeting."

---

## PASS 1: Layout Strategy

### Shell Pattern (Pattern A: Recruiting Hub)
- **WorkdayTopNav**: Standard Sana grey bar with pill search, notifications, avatar
- **WorkdayLeftTabBar**: Recruiting hub with secondary tabs. Active tab: "Interviews"
- **Main content area**: White card(s) on SANA_PAGE_CANVAS grey canvas
- **No CommunicationDock**: This prototype focuses on the interview intelligence surface, not messaging

### JTBD Worksheet Reference
- Recruiter: "Collaborate with hiring teams to hire the right candidate quickly" + "Ensure that candidates are assessed in a fair, equitable manner" (from `docs/jtbd-recruiting-hr-professional-and-manager.md`)
- Manager: "Determine if a candidate is the right fit" (from Manager hiring subset)

### Placement Reconciliation (PRD vs Prototype)
- **PRD Journey 1** (Prep Card): Interviewer opens interview detail page → prep card appears as card on that page. **Prototype simplification**: All three views accessible via tabs for demo flow.
- **PRD Journey 2** (Synthesis): Recruiter opens candidate detail → Feedback tab. **Prototype simplification**: Same tabbed interface; in production this would be the candidate Feedback tab.
- **PRD Journey 3** (Debrief): HM opens debrief view from candidate detail or notification. **Prototype simplification**: Same tabbed interface; in production this would be a dedicated debrief entry point.

### Information Architecture
Three connected views accessed via sub-navigation within the Interview detail page:

**View 1: Interview Prep Card (Capability 1 - Interview Coach)**
- Context: Interviewer opens their upcoming interview detail
- Layout: Single large card with candidate header + prep card content
- Sections:
  - Candidate header: Name, role, HiredScore grade badge, interview date/time
  - "Suggested Questions" section: 3-5 structured questions, each with competency tag, follow-up probes expandable
  - "Candidate Highlights" section: Key strengths (green indicators), areas to probe (amber indicators)
  - "Interview Tips" collapsible: Best practices reminders
- Actions: "Customise questions" edit mode, "Dismiss prep card", "Rate this prep card" feedback

**View 2: Feedback Synthesis (Capability 2 - Cross-panellist Analysis)**
- Context: Recruiter views candidate after all interviews complete
- Layout: Candidate header + synthesis card below
- Sections:
  - Candidate header: Name, role, interview status ("All feedback received")
  - Competency comparison matrix: Rows = competencies, columns = panellists, cells = rating (1-5 scale) with colour coding
  - Consensus indicators: Green check for agreement, amber warning for divergence
  - Expandable divergence detail: Click amber indicator to see competing evidence quotes from panellists
  - Consistency advisory banner (if triggered): Informational banner with statistical basis
- Actions: "Share with hiring team", "Request clarification from [panellist]"

**View 3: Structured Debrief (Capability 3 - Debrief Facilitation)**
- Context: Hiring manager opens debrief view before meeting
- Layout: Two-column layout - agenda on left, evidence panel on right
- Left column (Agenda):
  - AI recommendation card: Confidence badge (High/Medium/Low), summary sentence, "AI-generated suggestion - non-binding" label
  - Consensus items (green): Quick-confirm competencies with panel agreement
  - Disagreement items (amber): Discussion-needed competencies with structured prompts
- Right column (Evidence Panel):
  - When an agenda item is selected, shows per-panellist feedback quotes for that competency
  - Panellist avatars with names and individual ratings
- Actions: "Record decision" button (opens modal: Hire/No-hire + rationale text area), "Export debrief notes"

### View Navigation
A horizontal tab bar at the top of the main content area connects the three views:
- Tab 1: "Prep Card" (shows View 1)
- Tab 2: "Feedback Synthesis" (shows View 2)
- Tab 3: "Debrief" (shows View 3)

This tab bar represents different entry points in the interview lifecycle. In production, each view would be accessed contextually (interviewer sees Prep Card; recruiter sees Synthesis; HM sees Debrief). For prototype purposes, all three are navigable to demonstrate the connected flow.

---

## PASS 2: Canvas Kit Composition

### Shared Components (all views)
- `WorkdayTopNav`: Standard Sana shell
- `WorkdayLeftTabBar`: Recruiting hub, "Interviews" active tab
- `Heading` (size="large"): Page title "Interview Intelligence"
- `Tabs.Item` (Canvas Kit Tabs): View navigation (Prep Card | Feedback Synthesis | Debrief)
- `Card` with `SANA_CARD_RADIUS_LG`: Content containers
- `SANA_PAGE_CANVAS`: Page background

### View 1: Interview Prep Card
| UI Element | Canvas Kit Component | Notes |
|-----------|---------------------|-------|
| Candidate name | `Heading` size="medium" | Bold, ink colour |
| Role title | `BodyText` size="small" | Secondary text |
| HiredScore grade | `HiredScoreGrading` variant="compact" | Shows grade when HiredScore is active; hidden when off (PRD: omit grade) |
| Interview date/time | `BodyText` with clock icon | `SystemIcon` (clockIcon) |
| Question cards | `Card` with `padding="s"` | One per question, stacked |
| Competency tag | `StatusIndicator` type="gray" emphasis="low" | Neutral chip per Sana Style; no custom blue pills |
| Question text | `BodyText` size="medium" bold | The actual question |
| Follow-up probes | `BodyText` size="small" | Collapsed by default, expand on click |
| Candidate highlights | `Box` with left border | Green border for strengths, amber for probes |
| Dismiss button | `TertiaryButton` | "Dismiss prep card" |
| Feedback button | `TertiaryButton` | "Rate this prep card" thumbs up/down |

### View 2: Feedback Synthesis
| UI Element | Canvas Kit Component | Notes |
|-----------|---------------------|-------|
| Competency matrix | Canvas Kit `Table` (compound API: Table.Head, Table.Body, Table.Row, Table.Header, Table.Cell) | Rows=competencies, cols=panellists; sticky first column if needed |
| Rating cells | Styled `Box` | Colour-coded: green (4-5), neutral (3), amber (1-2) |
| Consensus icon | `StatusIndicator` (positive) | Green check |
| Divergence icon | `StatusIndicator` (orange) | Amber warning |
| Advisory banner | `Banner` (informational) | "Score variation detected..." |
| Panellist names | `BodyText` with `Avatar` | Column headers |
| Evidence quotes | `Card` with `BodyText` | Expandable section per divergence item |
| Share button | `PrimaryButton` | "Share with hiring team" |

### View 3: Structured Debrief
| UI Element | Canvas Kit Component | Notes |
|-----------|---------------------|-------|
| Recommendation card | `Card` with prominent styling | Top of left column |
| Confidence badge | Styled `Box` (pill) | Green=High, amber=Medium, red=Low |
| "AI-generated" label | `BodyText` size="small" italic | Trust transparency |
| Consensus items | `Card` with green left border | Compact, quick-confirm style |
| Disagreement items | `Card` with amber left border | Expandable, discussion prompts |
| Evidence panel | `Card` (right column) | Updates on item selection |
| Panellist quotes | `BodyText` with `Avatar` | Individual feedback excerpts |
| Record decision | `PrimaryButton` | Opens modal |
| Decision modal | `Modal` | Hire/No-hire radio + rationale text area |

### Mock Data
**Candidate**: Sarah Chen, Senior Software Engineer
**Role**: Senior Software Engineer, Platform Team
**HiredScore Grade**: A
**Panellists**: 4 interviewers (Maya Patel - Engineering Manager, James Liu - Staff Engineer, Priya Sharma - Product Manager, Alex Thompson - Team Lead)
**Competencies**: Technical Design (5 areas), Collaboration (3 areas), Problem Solving (3 areas), Communication (2 areas)

### Colour Tokens
- Green indicators: `greenApple400` (Canvas Kit semantic)
- Amber indicators: `cantaloupe400`
- Confidence High: `greenApple400` pill
- Confidence Medium: `cantaloupe400` pill
- Confidence Low: `cantaloupe400` pill (caution, not error)
- Competency tags: neutral grey (StatusIndicator Gray/Low pattern)
- Card backgrounds: `frenchVanilla100` (white)
- Page canvas: `SANA_PAGE_CANVAS`

---

## Copy Inventory

### View 1 Copy
- Page title: "Interview Intelligence"
- Tab label: "Prep card"
- Prep card heading: "Suggested interview questions for Sarah Chen · Senior Software Engineer"
- Competency tag labels: "Technical Design", "Collaboration", "Problem Solving", "Communication"
- Question format: "[Behavioural question text]"
- Follow-up label: "Show follow-up questions" / "Hide follow-up questions"
- Highlights heading: "Candidate highlights"
- Strength prefix: "Strength:"
- Probe prefix: "Area to explore:"
- Edit mode: "Customise questions"
- Dismiss: "Hide prep card"
- Feedback: "Was this helpful?"
- Tips heading: "Interview best practices"
- Loading state: "Loading interview prep..."
- Error state: "Unable to generate suggested questions. Use the competency framework for this role to guide your interview."
- Limited data: "Based on role requirements only (limited candidate data available)"

### View 2 Copy
- Tab label: "Panel feedback"
- Section heading: "Interview feedback across the panel for Sarah Chen"
- Status: "All 4 panellists submitted feedback"
- Consensus label: "Agrees"
- Divergence label: "Differs"
- Advisory banner: "Panel ratings differ for [competency]. Compare feedback before the debrief."
- Share button: "Share with hiring team"
- Request button: "Ask [panellist] to clarify"
- Evidence section: "What panellists said"
- Incomplete panel: "[N] of [M] panellists have submitted feedback"
- Limited panel: "Limited panel size - synthesis based on [N] panellists"
- Loading state: "Loading panel feedback..."

### View 3 Copy
- Tab label: "Debrief"
- Recommendation heading: "Suggested next step"
- Non-binding label: "AI-generated suggestion for your debrief. Your team decides the hiring outcome."
- Confidence prefix: "Suggestion confidence:"
- Consensus section: "Ready to confirm: panel agrees"
- Disagreement section: "Discussion needed: panel views differ"
- Discussion prompt prefix: "Discussion prompt:"
- Evidence heading: "What panellists said"
- Record button: "Record decision"
- Export button: "Export debrief notes"
- Modal title: "Record debrief outcome"
- Modal body: "This records the debrief outcome for the team. It does not change candidate status."
- Modal options: "Advance candidate" / "Do not advance"
- Rationale label: "Decision rationale"
- Rationale placeholder: "Summarise the key factors in this decision..."
- Rationale validation: "Add a short rationale so the team understands this outcome."
- Submit: "Save decision"
- Cancel: "Cancel"
- Success toast: "Debrief outcome saved."

---

## Visual Indicators

### Trust and Transparency
- Every AI-generated element includes a subtle "sparkle" icon (accessible name: "AI-generated content") to indicate AI involvement
- Recommendation cards include "AI-generated suggestion for your debrief. Your team decides the hiring outcome." in muted text
- Confidence levels use colour-coded pills with text labels (not colour alone, for accessibility)

### Accessibility
- All colour indicators paired with text labels or icons (not colour-only)
- Rating matrix uses both colour fill and numeric value
- Advisory banners use Canvas Kit `Banner` for proper ARIA roles
- Modal uses Canvas Kit `Modal` for focus trapping and keyboard navigation
- Expandable sections (probes, divergence, evidence) use `aria-expanded`, keyboard activation (Enter/Space), and logical focus order
- Custom `Box` borders for highlights paired with text prefixes ("Strength:", "Area to explore:")
- Sparkle icon has `aria-label="AI-generated content"` (not decorative-only)
- Narrow viewport: debrief two-column layout stacks to single column (evidence panel below agenda)

---

## Prototype File
`design/interview-intelligence-agent-v96.tsx`

## Route
- Slug: `interview-intelligence-agent-v96`
- Import in: `design/main.tsx`
- Add to: `design/vite.config.ts` slugs set
