# Candidate Experience Patterns

Canvas Kit patterns for external career sites, candidate homes, and conversational apply flows (e.g., Paradox-style candidate experiences).

## Core Components

These components are designed to create a slick, agentic, and personalized experience for candidates visiting an external career site or their personal dashboard.

**File**: `design/components/CandidateExperiencePatterns.tsx`

### CareerSiteHero

A large, prominent hero section for the top of an external career site. It features a personalized greeting and a prominent search prompt area, designed to initiate a conversational search flow.

**Props**:
- `greeting` (string): The personalized welcome message (e.g., "Hi Nora, let's find your next role").
- `searchPlaceholder` (string, optional): The placeholder text for the search input (e.g., "e.g. marketing roles in Dubai").
- `onSearch` (function, optional): Callback when the search button is clicked.

**Usage**:
```tsx
import { CareerSiteHero } from './components';

<CareerSiteHero
  greeting="Hi Nora, let's find your next role"
  searchPlaceholder="e.g. 'Software Engineer in London'"
  onSearch={() => initiateConversationalSearch()}
/>
```

### JobCard

A clean, structured card for displaying job listings on the career site search results or the candidate's home dashboard.

**Props**:
- `title` (string): The job title.
- `metadata` (string): Secondary information like location, department, or posting date.
- `onViewJob` (function, optional): Callback when the card or "View Job" button is clicked.

**Usage**:
```tsx
import { JobCard } from './components';

<JobCard
  title="Senior Software Engineer"
  metadata="London, UK • Engineering • Posted 2 days ago"
  onViewJob={() => navigateToJobDetails('REQ-123')}
/>
```

### JobDetailsStickyFooter

A bottom-docked Call-To-Action (CTA) bar designed for job description pages. It remains sticky at the bottom of the viewport, providing a constant prompt to "Apply with Assistant" (initiating a conversational apply flow).

**Props**:
- `promptText` (string, optional): The text next to the assistant avatar (default: 'Ready to apply?').
- `buttonText` (string, optional): The text on the primary action button (default: 'Apply with Assistant').
- `onApply` (function, optional): Callback when the primary button is clicked.

**Usage**:
```tsx
import { JobDetailsStickyFooter } from './components';

<Box style={{ position: 'relative', minHeight: '100vh' }}>
  {/* Job Description Content */}
  <Box padding="l" style={{ paddingBottom: '80px' }}>
    <Heading size="medium">Senior Software Engineer</Heading>
    <BodyText>Job description goes here...</BodyText>
  </Box>

  {/* Sticky Footer */}
  <JobDetailsStickyFooter
    promptText="Ready to start your application?"
    buttonText="Apply with Assistant"
    onApply={() => startConversationalApply()}
  />
</Box>
```

## Conversational Apply Flow

When a candidate clicks "Apply with Assistant" on the `JobDetailsStickyFooter`, the application should transition into a conversational flow.

**Best Practices**:
- **Layout**: Use the full-page agentic assistant pattern (see `communication-patterns.md`).
- **Components**: Use `SanaCommMessageBubble` and `SanaCommComposer`.
- **Navigation**: Use a simplified external career site navigation (e.g., just a company logo and a link back to "Candidate Home"), NOT the internal `WorkdayTopNav`.
- **State Management**: The conversational apply flow should track the `applyStep` (e.g., 'intro', 'resume_upload', 'screener_questions', 'success') and update the chat UI accordingly.
- **Scroll Behavior**: Ensure the chat container auto-scrolls to the *start* of the latest assistant message, keeping the context clear for the candidate.

## Best Practices
- ✅ Use `CareerSiteHero` to encourage conversational job discovery.
- ✅ Use `JobDetailsStickyFooter` to keep the primary call-to-action visible at all times on long job descriptions.
- ✅ Ensure external candidate experiences use a simplified navigation structure compared to internal recruiter tools.
- ❌ Do not use internal recruiter components (like `WorkdayLeftTabBar` or `WorkdayTopNav`) on external candidate-facing pages.