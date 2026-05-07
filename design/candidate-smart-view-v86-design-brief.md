# Design Brief: Candidate Smart View v86 (Carousel Navigation)

**Date**: 31 March 2026  
**Version**: v86  
**Status**: APPROVED (Self-approved for rapid prototyping)

---

## PASS 1: LAYOUT STRATEGY

### Jobs to Be Done

**Primary JTBD** (from `docs/jtbd-recruiting-hr-professional-and-manager.md` - Recruiter JTBD: Screen & Shortlist):

> When reviewing multiple candidates for a requisition, I want to quickly compare resumes and key qualifications side-by-side, so I can efficiently shortlist the best-fit candidates without losing context or switching between multiple tabs.

**Aligns with Recruiter JTBD**: Screen & Shortlist (Worksheet Section: Review Applications)

**User Story**:
- As a recruiter reviewing candidates from a job requisition grid
- I want to click a candidate name and see their full profile with resume
- So I can quickly assess fit, compare with other candidates using carousel navigation, and take action (accept/decline) without returning to the grid

### Shell Pattern

**Shell**: **B (Full-screen with Communication Dock)**

**Justification**:
- Recruiter needs full screen real estate to read resumes comfortably
- Split-pane layout allows key info (left) + resume (right) simultaneously
- Communication dock available but not primary focus (can contact candidate if needed)
- Carousel controls enable rapid candidate-to-candidate navigation
- Action buttons (Accept/Decline) prominently placed for quick decisions

### Reference Layouts

**Primary reference**: `design/references/pattern-candidate-smart-view.md` (profile/detail view pattern)

**Canonical components**:
- `ProfilePageLayout` - provides header card, shell integration, comm dock support
- `WorkdayLeftTabBar` - secondary vertical tabs for profile sections (Overview, Resume, History, Assessments)
- `WorkdayTopNav` - global header with search
- `CommunicationDock` - optional sliding panel for messaging

### Layout Regions

**Top (Global Nav)**:
- `WorkdayTopNav` with pill search, utilities, avatar
- Height: ~60px

**Left (Navigation)**:
- Primary rail: Icon + micro-label (HOME, RECRUIT, etc.)
- Secondary column: Vertical tabs for candidate sections
  - Overview (key info, HiredScore, status)
  - Resume (PDF or structured display)
  - Work History
  - Assessments (if available)
- Width: Primary rail ~64px + Secondary ~220px

**Center (Primary Workspace)**:
- **Header card**: Avatar, name, applied job, metadata, HiredScore, carousel controls, actions
- **Tab content area**: Based on active tab selection
  - Overview tab: Two-column grid (summary left, quick facts right)
  - Resume tab: Full-width PDF viewer or structured resume display
  - Work History tab: Timeline cards
  - Assessments tab: Score cards

**Right (Communication Dock - Optional)**:
- Collapsed: Narrow rail with channel icons
- Expanded: Sliding panel with Email/WhatsApp/Notes
- Width: Collapsed ~48px, Expanded ~400px

### Hierarchy

**Primary focus**: Resume content (recruiter's main job is to read and assess)

**Secondary elements**:
- Carousel controls (Prev/Next candidate) - prominent in header
- Action buttons (Accept/Decline) - prominent in header, equal weight
- HiredScore badge - visible but not dominant
- Key metadata - structured, scannable

**Supporting content**:
- Communication options
- Secondary tabs (Work History, Assessments)
- Related requisition context

### Interaction Model

**Carousel navigation**:
- Prev/Next buttons in header card (left and right of candidate name)
- Keyboard shortcuts: Arrow Left (previous), Arrow Right (next)
- Maintains current tab when navigating between candidates
- Circular navigation (last candidate wraps to first)

**Tab navigation**:
- Vertical tabs in secondary column
- Overview (default), Resume, Work History, Assessments
- Active tab persists during carousel navigation

**Action buttons**:
- Accept button: Moves candidate forward in pipeline (modal prompts for stage selection)
- Decline button: Rejects candidate (modal prompts for reason)
- Equal visual weight (both SecondaryButton)
- Disabled state if candidate already processed

**Modal flows**:
- Accept → "Move Forward" modal with stage dropdown + optional note
- Decline → "Decline Candidate" modal with reason dropdown + optional note

### Layout Framework (A-F)

**A. JTBD**: Quickly compare candidates and assess resume fit with minimal friction

**B. Shell**: Full-screen split-pane (key info + resume) with optional comm dock

**C. Hierarchy**:
1. Resume content (dominant, right column in Overview, full-width in Resume tab)
2. Carousel controls + Actions (header card, always visible)
3. Key metadata + HiredScore (header card, scannable)
4. Secondary tabs (left column, progressive disclosure)

**D. Density**: Medium-high - maximize resume readability while surfacing key info

**E. Accessibility**:
- Keyboard navigation for carousel (Arrow keys)
- Focus management (modal traps focus, returns to trigger on close)
- Screen reader announcements for candidate changes
- High contrast action buttons

**F. Canvas Kit coverage**: All components use Canvas Kit or workspace components

---

## PASS 2: UI COMPOSITION (Canvas Kit)

### Canvas Kit Components Used

**Shell Components** (from `design/components/`):
- `ProfilePageLayout` - manages header, tabs, comm dock integration
- `WorkdayTopNav` - global header
- `WorkdayLeftTabBar` - primary rail + secondary vertical tabs
- `CommunicationDock` - optional sliding panel

**Canvas Kit Primitives**:
- `Card` - all content containers
- `Flex`, `Box` - layout
- `Heading`, `BodyText` - typography
- `Avatar` - candidate avatar (64px)
- `StatusIndicator` - stage, status, skills
- `SecondaryButton` - carousel controls, action buttons
- `PrimaryButton` - modal submit buttons
- `Modal` - Accept/Decline confirmation flows
- `SystemIcon` - icons (arrowLeft, arrowRight, etc.)

### Header Card Specification

**Layout**: White card on `SANA_PAGE_CANVAS`, `SANA_CARD_RADIUS_LG`, `SANA_CARD_SHADOW`

**Content Structure** (left to right):
1. **Carousel Prev Button** (far left)
   - Component: `<SecondaryButton size="small" icon={arrowLeftIcon} />` (icon-only)
   - Accessible label: "Previous candidate"
   - Disabled if at first candidate (circular nav)

2. **Avatar** (left of identity block)
   - Component: `<Avatar size={Avatar.Size.xl} />` (64px)
   - Fallback: Initials

3. **Identity Block** (flex-grow)
   - Candidate name: `<Heading size="large">`
   - Applied job: `<BodyText size="medium">` (e.g., "Senior Product Designer")
   - Metadata row: `<BodyText size="small" color={colors.blackPepper600}>` with middot separators
     - Example: "Applied 28 March 2026 · LinkedIn · Days in stage: 3"

4. **HiredScore Badge** (right of metadata)
   - Component: `<HiredScoreGrading fit={85} variant="compact" />`

5. **Action Buttons** (right-aligned, before carousel next)
   - Accept: `<SecondaryButton size="small">Accept</SecondaryButton>`
   - Decline: `<SecondaryButton size="small">Decline</SecondaryButton>`
   - Gap: `space.s`
   - Equal weight (both SecondaryButton for balanced decision)

6. **Carousel Next Button** (far right)
   - Component: `<SecondaryButton size="small" icon={arrowRightIcon} />` (icon-only)
   - Accessible label: "Next candidate"
   - Disabled if at last candidate (circular nav)

**Spacing**: Padding `xl` (24px), gap between elements `m` (12px)

### Tab Content: Overview (Default)

**Layout**: Two-column grid (1:1 ratio) with gap `space.l` (16px)

**Left Column** (Summary):
- Card title: `<Heading size="medium">Summary</Heading>`
- Bio text: `<BodyText size="medium">`
- Skills section:
  - Heading: `<Heading size="small">Top Skills</Heading>`
  - Skills: `<StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} />` in `<Flex flexWrap="wrap" gap="xs">`
- Stage indicator:
  - Current stage: `<StatusIndicator type={StatusIndicator.Type.Blue} label="Stage: Interview" icon={dotIcon} />`

**Right Column** (Quick Facts):
- Card title: `<Heading size="medium">Quick Facts</Heading>`
- Fact rows: `<Flex justifyContent="space-between">` for each fact
  - Label: `<BodyText size="small" color={colors.blackPepper600}>` (e.g., "Location")
  - Value: `<BodyText size="small">` (e.g., "San Francisco, CA")
- Facts: Location, Experience, Education, Notice Period, Salary Expectation

### Tab Content: Resume

**Layout**: Full-width content area

**Option 1: PDF Viewer** (if resume is PDF):
- Embed: `<iframe src={resumeUrl} style={{ width: '100%', height: '100%', border: 'none' }} />`
- Fallback: Download link if iframe fails

**Option 2: Structured Resume** (if parsed resume data available):
- Card-based sections: Work History, Education, Skills, Certifications
- Each section: `<Card padding="l">` with `<Heading size="medium">` title
- Timeline format for work/education

### Tab Content: Work History

**Layout**: Vertical timeline cards with gap `space.m`

**Each Work Entry**:
- `<Card padding="l">`
- Date range: `<BodyText size="small" color={colors.blackPepper600}>` (e.g., "Jan 2020 - Present")
- Company + Title: `<Heading size="small">` (e.g., "Senior Designer at Figma")
- Description: `<BodyText size="small">`
- Employment status: `<StatusIndicator type={StatusIndicator.Type.Green} label="Current" />` if active

### Tab Content: Assessments

**Layout**: Grid of assessment cards (2 columns) with gap `space.l`

**Each Assessment Card**:
- `<Card padding="l">`
- Assessment name: `<Heading size="small">`
- Score: `<Heading size="large">` (e.g., "85%")
- Completion date: `<BodyText size="small" color={colors.blackPepper600}>`
- Status: `<StatusIndicator type={StatusIndicator.Type.Green} label="Completed" />`

### Accept/Decline Modals

**Accept Modal**:
- Title: "Move Candidate Forward"
- Body: Stage selector dropdown + optional note textarea
- Actions: `<PrimaryButton>Confirm</PrimaryButton>` + `<SecondaryButton>Cancel</SecondaryButton>`

**Decline Modal**:
- Title: "Decline Candidate"
- Body: Reason dropdown + optional note textarea
- Warning: `<Banner type="warning">This action cannot be undone</Banner>`
- Actions: `<PrimaryButton>Decline</PrimaryButton>` + `<SecondaryButton>Cancel</SecondaryButton>`

### Carousel State Management

**Mock Data Structure**:
```typescript
interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  appliedJob: string;
  appliedDate: string;
  source: string;
  daysInStage: number;
  hiredScoreFit: number;
  stage: string;
  location: string;
  experience: string;
  education: string;
  noticePeriod: string;
  salaryExpectation: string;
  bio: string;
  skills: string[];
  resumeUrl?: string;
  workHistory: WorkEntry[];
  assessments: Assessment[];
}

const candidates: Candidate[] = [/* 5-10 mock candidates */];
const [currentIndex, setCurrentIndex] = useState(0);
```

**Navigation Functions**:
```typescript
const handlePrev = () => {
  setCurrentIndex((prev) => (prev === 0 ? candidates.length - 1 : prev - 1));
};

const handleNext = () => {
  setCurrentIndex((prev) => (prev === candidates.length - 1 ? 0 : prev + 1));
};
```

### Sana Style Application

**Surfaces**:
- Page canvas: `SANA_PAGE_CANVAS` (~`#F3F5F7`)
- Cards: White (`#FFFFFF`) with `SANA_CARD_SHADOW`
- Top nav: `WorkdayTopNav` with `variant="app"` — **white bar** (`SANA_TOP_NAV_BG`) + **grey pill search** (`SANA_SEARCH_FIELD_BG`) + 1px `SANA_TOP_NAV_DIVIDER` hairline. The Workday brand gradient (`SANA_HOMEPAGE_GRADIENT`) is homepage-only and must not appear on this surface.

**Radii**:
- Header card: `SANA_CARD_RADIUS_LG` (~20px)
- Content cards: `SANA_CARD_RADIUS_LG`
- Buttons: Canvas Kit default (~8px)

**Colors**:
- Primary text: `colors.blackPepper600`
- Secondary text: `colors.blackPepper500`
- Links/accents: `SANA_LINK_ACCENT` or `colors.blueberry400`
- Borders: `colors.soap300`

**Typography**:
- Roboto font family
- Canvas Kit text components (`Heading`, `BodyText`)

---

## Copy Inventory

### Header Card
- "Previous candidate" (accessible label for prev button)
- "Next candidate" (accessible label for next button)
- "{Candidate Name}" (dynamic, e.g., "Jordan Ellis")
- "{Applied Job Title}" (dynamic, e.g., "Senior Product Designer")
- "Applied {Date} · {Source} · Days in stage: {Number}" (dynamic metadata)
- "Accept" (action button)
- "Decline" (action button)

### Tabs
- "Overview" (tab label)
- "Resume" (tab label)
- "Work History" (tab label)
- "Assessments" (tab label)

### Overview Tab
- "Summary" (section heading)
- "Top Skills" (section heading)
- "Quick Facts" (section heading)
- "Location" (fact label)
- "Experience" (fact label)
- "Education" (fact label)
- "Notice Period" (fact label)
- "Salary Expectation" (fact label)
- "Stage: {Stage Name}" (status indicator, e.g., "Stage: Interview")

### Resume Tab
- "Resume" (page title if full-width view)
- "Download Resume" (fallback link if PDF fails to load)

### Work History Tab
- "{Date Range}" (e.g., "Jan 2020 - Present")
- "{Job Title} at {Company}" (e.g., "Senior Designer at Figma")
- "Current" (status indicator for active employment)

### Assessments Tab
- "{Assessment Name}" (card title)
- "{Score}%" (e.g., "85%")
- "Completed on {Date}" (e.g., "Completed on 20 March 2026")
- "Completed" (status indicator)

### Modals
- "Move Candidate Forward" (accept modal title)
- "Select stage" (dropdown label)
- "Add note (optional)" (textarea label)
- "Confirm" (submit button)
- "Cancel" (cancel button)
- "Decline Candidate" (decline modal title)
- "Select reason" (dropdown label)
- "This action cannot be undone" (warning banner text)
- "Decline" (submit button, destructive action)

---

## Navigation Integration

**From Candidate Grid**:
- Clicking candidate name row opens Smart View
- Route: `#/candidate-smart-view-v86?candidateId={id}&reqId={reqId}`
- Query params pass candidate ID and requisition context

**To Candidate Grid**:
- Browser back button returns to grid
- No explicit "Back to Grid" button (follow browser conventions)

**Keyboard Shortcuts**:
- Arrow Left: Previous candidate
- Arrow Right: Next candidate
- Escape: Close modal (if open), otherwise no action

---

## Implementation Notes

### File Structure
- Prototype file: `design/candidate-smart-view-v86.tsx`
- Route: `http://localhost:5199/candidate-smart-view-v86`
- Integration: Update `design/main.tsx` routing + `design/gcc-candidate-grid-search.tsx` click handlers

### Mock Data
- 5-10 mock candidates with varied profiles
- Include realistic names, jobs, dates, skills, work history
- HiredScore fits ranging 55-95% (mix of A/B/C/D grades)
- Some candidates with assessments, some without

### State Management
- React useState for carousel index
- useState for active tab
- useState for modal visibility
- No external state management needed (prototype scope)

### Canvas Kit Imports
```typescript
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { SecondaryButton, PrimaryButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Modal } from '@workday/canvas-kit-react/modal';
import { SystemIcon } from '@workday/canvas-system-icons-web';
import { arrowLeftIcon, arrowRightIcon, dotIcon } from '@workday/canvas-system-icons-web';
import { colors } from '@workday/canvas-kit-react/tokens';
```

### Accessibility
- Carousel buttons: `aria-label` for icon-only buttons
- Keyboard navigation: Arrow keys for carousel
- Focus management: Modal traps focus, returns to trigger on close
- Screen reader: Announce candidate name change on carousel navigation

---

## Experience Principles Validation

### Empower (Give Users Control)
- ✅ Recruiter controls candidate navigation (carousel, tabs)
- ✅ Quick actions (Accept/Decline) without leaving view
- ✅ Keyboard shortcuts for power users
- ✅ No forced workflows - recruiter decides when to act

### Trust (Build Their Confidence)
- ✅ Clear visual hierarchy (resume is dominant)
- ✅ HiredScore badge provides AI-driven confidence signal
- ✅ Confirmation modals prevent accidental actions
- ✅ Consistent Canvas Kit patterns feel reliable

### Grow (Enable Them To Change)
- ✅ Easy to compare candidates (carousel navigation)
- ✅ Flexible decision-making (accept or decline at any point)
- ✅ Extensible tabs (can add more sections like Interviews, Notes)

---

## Final Verdict

**APPROVED** for prototype implementation. Design follows:
- Canvas Kit component standards (no custom implementations)
- Sana Style UI guidelines (neutral surfaces, soft radii, sparing blue)
- Recruiter JTBD (Screen & Shortlist)
- Workday Experience Principles (Empower, Trust, Grow)

**Ready for**: 320-prototype-developer implementation
