# Modal and Layout Patterns

Canvas Kit patterns for modals, popups, dialogs, and page layouts in Workday Recruiting prototypes.

## Modal Component

Canvas Kit `Modal` for dialog interactions, confirmations, forms.

**Component**: `design/components/WorkdayModal.tsx`

**Use for**: Standardized dialogs that enforce Sana Style radii and layout.

**Import**:
```tsx
import { WorkdayModal } from './components';
```

**Basic Pattern**:
```tsx
const [isOpen, setIsOpen] = useState(false);

<>
  <PrimaryButton onClick={() => setIsOpen(true)}>
    Open dialog
  </PrimaryButton>
  
  <WorkdayModal 
    title="Modal title"
    isOpen={isOpen} 
    onClose={() => setIsOpen(false)}
    primaryActionText="Confirm"
    onPrimaryAction={handleConfirm}
    secondaryActionText="Cancel"
  >
    <BodyText>Modal content goes here.</BodyText>
  </WorkdayModal>
</>
```

**Focus Management**:
- Canvas Kit automatically traps focus inside modal
- Focus returns to trigger element on close
- Escape key closes modal

**Accessibility**:
- `aria-labelledby` automatically set
- `aria-modal="true"`
- Focus trap enabled
- Keyboard navigation works

## Popup Component

Use `Popup` for tooltips, dropdowns, context menus.

**Import**:
```tsx
import { Popup } from '@workday/canvas-kit-react/popup';
```

**Basic Pattern**:
```tsx
<Popup>
  <Popup.Target as={TertiaryButton}>
    More options
  </Popup.Target>
  <Popup.Popper>
    <Popup.Card>
      <Popup.Body>
        <BodyText>Popup content</BodyText>
      </Popup.Body>
    </Popup.Card>
  </Popup.Popper>
</Popup>
```

## ProfilePageLayout Component

**Component**: `design/components/ProfilePageLayout.tsx`

**Use for**: Hub-style pages with header card, tab navigation, and optional communication channels.

**When to use**:
- Candidate profiles
- Worker profiles
- Requisition details
- Hiring manager views
- Any hub page with header + tabs + optional communication

**When NOT to use**:
- Simple list views
- Single-panel pages
- Settings pages without tabs
- Pages without profile/entity context

**Features**:
- Standardized header card with avatar, name, subtitle, actions
- Tab navigation (secondary column)
- Optional communication dock integration
- Sana shell styling built-in
- Automatic layout handling

**Usage**:
```tsx
import { ProfilePageLayout, type ProfileTab, cardStyle } from './components';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';

const TABS: ProfileTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'applications', label: 'Job applications' },
  { id: 'screening', label: 'Screening' },
  { id: 'history', label: 'Activity history' }
];

<ProfilePageLayout
  // Header card
  avatar={<Avatar size={64} altText={candidate.name} as="div" />}
  name={candidate.name}
  subtitle={`${candidate.title} · ${candidate.jobReq} · ${candidate.location}`}
  headerActions={[
    <SecondaryButton size="small">Move forward</SecondaryButton>,
    <SecondaryButton size="small">Reject</SecondaryButton>
  ]}
  
  // Tab navigation
  tabs={TABS}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
  secondaryTitle="Candidate"
  showSecondaryTitleIcon
  
  // Tab content (render prop)
  renderTabContent={(tabId) => {
    switch (tabId) {
      case 'overview':
        return (
          <Flex flexDirection="column" gap="l">
            <Card padding="l" style={cardStyle()}>
              <Heading size="small" marginBottom="m">Candidate Summary</Heading>
              
              {/* Skills with StatusIndicator */}
              <BodyText size="small" fontWeight="bold" marginBottom="xxs">
                Top Skills
              </BodyText>
              <Flex gap="xs" flexWrap="wrap" marginBottom="m">
                {['React', 'TypeScript', 'Figma'].map(skill => (
                  <StatusIndicator
                    key={skill}
                    type={StatusIndicator.Type.Gray}
                    emphasis={StatusIndicator.Emphasis.Low}
                    label={skill}
                  />
                ))}
              </Flex>
            </Card>
          </Flex>
        );
      
      case 'applications':
        return (
          <Card padding="l" style={cardStyle()}>
            <Heading size="small" marginBottom="m">Applications</Heading>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Job Requisition</Table.Header>
                  <Table.Header>Status</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Senior Designer (REQ-2026-1234)</Table.Cell>
                  <Table.Cell>
                    <StatusIndicator
                      type={StatusIndicator.Type.Blue}
                      emphasis={StatusIndicator.Emphasis.Low}
                      label="Interview"
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        );
      
      // ... other tabs
    }
  }}
  
  // Optional: Communication dock
  communicationDock={{
    channels: ['whatsapp', 'email'],
    activeChannel: activeChannel,
    onChannelChange: setActiveChannel,
    getExpandedWidth: (ch) => ch === 'email' ? 950 : 450,
    renderPanel: (ch) => ch === 'email' ? <EmailPanel {...} /> : <WhatsAppPanel />,
    renderRail: () => <Flex flexDirection="column" gap="xs">{/* rail buttons */}</Flex>
  }}
  
  // Optional: Footer disclaimer
  footerDisclaimer="This screen is a prototype for review."
/>
```

**Content Standards**:
- Every tab must demonstrate world-class content richness
- Use StatusIndicator for skills/tags
- Show realistic data (names, dates, companies)
- Include metadata layers (timestamps, sources, roles)
- Professional polish (not wireframe placeholders)

**Shell Benefits**:
- Consistent header structure across all profiles
- Standardized tab pattern with Sana styling
- Automatic communication dock integration
- Built-in responsive behavior
- Sana color/radius tokens applied

## Candidate Profile Pattern

Full-page layout for candidate hub:

**Reference**: `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png`

**Structure**:
- Large header card on light grey with avatar, name, job metadata
- Vertical sub-nav in secondary column with pill active state (`WorkdayLeftTabBar`)
- White rounded content cards on `SANA_PAGE_CANVAS` with thin soap borders
- Two-column grid for overview + job/history where appropriate
- Reserve `DEFAULT_COMM_RAIL_PX` on right when `CommunicationDock` is present

**NO BREADCRUMBS**: Do not add breadcrumb/chevron path strips (workspace hard rule).

**Layout**:
```tsx
<ProfilePageLayout
  // Header with avatar, name, subtitle, actions
  avatar={<Avatar size={64} altText={name} as="div" />}
  name="Camille Dubois"
  subtitle="Product Designer · REQ-2026-8841 · Dubai, UAE"
  headerActions={[
    <SecondaryButton size="small">Move forward</SecondaryButton>,
    <SecondaryButton size="small">Reject</SecondaryButton>
  ]}
  
  // Tab navigation
  tabs={candidateTabs}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
  secondaryTitle="Candidate"
  showSecondaryTitleIcon
  
  // Tab content with rich data
  renderTabContent={(tabId) => {
    // ... see ProfilePageLayout example above
  }}
  
  // Communication channels
  communicationDock={{
    channels: ['whatsapp', 'email'],
    // ... see communication-patterns.md
  }}
/>
```

## Multi-Step Flow Pattern (Wizard/Stepper)

Use for sequential processes (application, onboarding, setup).

**Structure**:
```tsx
const [currentStep, setCurrentStep] = useState(1);
const totalSteps = 3;

return (
  <Box padding="xl">
    {/* Progress indicator */}
    <Tabs initialTab={`step${currentStep}`}>
      <Tabs.List marginBottom="l">
        <Tabs.Item data-id="step1" disabled={currentStep !== 1}>
          Step 1: Info
        </Tabs.Item>
        <Tabs.Item data-id="step2" disabled={currentStep !== 2}>
          Step 2: Details
        </Tabs.Item>
        <Tabs.Item data-id="step3" disabled={currentStep !== 3}>
          Step 3: Review
        </Tabs.Item>
      </Tabs.List>
    </Tabs>
    
    {/* Step content */}
    <Card padding="l" marginBottom="l">
      {currentStep === 1 && <Step1Content />}
      {currentStep === 2 && <Step2Content />}
      {currentStep === 3 && <Step3Content />}
    </Card>
    
    {/* Navigation */}
    <Flex justifyContent="space-between">
      <SecondaryButton 
        onClick={() => setCurrentStep(currentStep - 1)}
        disabled={currentStep === 1}
      >
        Back
      </SecondaryButton>
      <PrimaryButton onClick={() => setCurrentStep(currentStep + 1)}>
        {currentStep === totalSteps ? 'Submit' : 'Next'}
      </PrimaryButton>
    </Flex>
  </Box>
);
```

**Accessibility**:
- Use `aria-current="step"` on active step
- Announce step changes to screen readers
- Ensure keyboard navigation between steps works
- Validate each step before allowing "Next"

**Example: Candidate Application Wizard**:

**Flow**: Personal Info → Work History → Review & Submit

```tsx
export const CandidateApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    workHistory: [],
    submitted: false
  });

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Box padding="xl" maxWidth="800px" margin="0 auto">
      {/* Progress indicator styled as stepper */}
      <Flex marginBottom="l" gap="m">
        <StepIndicator 
          number={1} 
          label="Personal Info" 
          active={currentStep === 1} 
          completed={currentStep > 1} 
        />
        <StepIndicator 
          number={2} 
          label="Work History" 
          active={currentStep === 2} 
          completed={currentStep > 2} 
        />
        <StepIndicator 
          number={3} 
          label="Review" 
          active={currentStep === 3} 
          completed={false} 
        />
      </Flex>

      <Card padding="l">
        {currentStep === 1 && <PersonalInfoStep data={formData.personalInfo} onChange={...} />}
        {currentStep === 2 && <WorkHistoryStep data={formData.workHistory} onChange={...} />}
        {currentStep === 3 && <ReviewStep data={formData} />}
      </Card>

      <Flex justifyContent="space-between" marginTop="l">
        <SecondaryButton 
          onClick={() => setCurrentStep(currentStep - 1)} 
          disabled={currentStep === 1}
        >
          Back
        </SecondaryButton>
        <PrimaryButton onClick={handleNext}>
          {currentStep === 3 ? 'Submit Application' : 'Next'}
        </PrimaryButton>
      </Flex>
    </Box>
  );
};
```

## Multi-Page Navigation Pattern

Use for distinct screens/views (dashboard, list, detail).

### Simple State-Based Routing (Prototypes)

```tsx
// Simple state-based routing for prototypes
const [currentPage, setCurrentPage] = useState('dashboard');

const renderPage = () => {
  switch(currentPage) {
    case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
    case 'candidates': return <CandidateList onNavigate={setCurrentPage} />;
    case 'detail': return <CandidateDetail onNavigate={setCurrentPage} />;
    default: return <Dashboard onNavigate={setCurrentPage} />;
  }
};

return (
  <Box>
    {/* Persistent top nav */}
    <TopNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    
    {/* Page content */}
    <Box padding="xl">
      {renderPage()}
    </Box>
  </Box>
);
```

### React Router (Production-Level Prototypes)

For more complex navigation with URL routing:

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <TopNavigation />
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/candidates" element={<CandidateList />} />
    <Route path="/candidates/:id" element={<CandidateDetail />} />
  </Routes>
</BrowserRouter>
```

## Page Layout Standards

### Mandatory Page Title

**CRITICAL**: Every page MUST have a primary page title (`<Heading size="large">`) at the top of the main content area, establishing clear hierarchy before any tabs, cards, or other content.

**Component**: `design/components/PageHeader.tsx`

```tsx
import { PageHeader } from './components';

<Box padding="xl">
  <PageHeader 
    title="Candidates" 
    subtitle="Manage active candidates"
    primaryActionText="Add Candidate"
    onPrimaryAction={handleAdd}
  />
  
  {/* Tabs, filters, content below */}
  <Tabs initialTab="active">
    {/* ... */}
  </Tabs>
</Box>
```

**NO BREADCRUMBS**: Do not use Canvas Kit `Breadcrumbs` or build ad-hoc hierarchy strips (labels separated by chevrons/slashes like "Recruiting › Reqs › ..."). This is a workspace hard rule with no exceptions.

**Secondary context**: Use subtitle lines, table captions, or metadata under the title—never a path strip.

### Content Area Layout

**Standard padding**:
```tsx
<Box padding="xl">
  <Heading size="large" marginBottom="m">Page Title</Heading>
  
  {/* Content cards */}
  <Card padding="l" marginBottom="l">
    {/* Card content */}
  </Card>
</Box>
```

**With sidebar**:
```tsx
<Flex gap="l">
  {/* Main content (70%) */}
  <Box flex="1">
    <Heading size="large" marginBottom="m">Main Content</Heading>
    {/* Content */}
  </Box>
  
  {/* Sidebar (30%) */}
  <Box minWidth="300px">
    <Card padding="m">
      {/* Sidebar content */}
    </Card>
  </Box>
</Flex>
```

## Banner States

Use `AlertBanner` for system messages, not mock data disclaimers.

**Component**: `design/components/AlertBanner.tsx`

### Error State

```tsx
import { AlertBanner } from './components';

{error && (
  <AlertBanner 
    type="error" 
    message={error} 
  />
)}
```

### Warning State (In-Flow Only)

```tsx
<AlertBanner 
  type="warning" 
  message="This requisition is missing required approvals" 
/>
```

**NO YELLOW BANNERS FOR MOCK DATA**:
Do NOT use warning-styled `Banner` only to say data is mocked, illustrative, or for PM review. Use neutral `BodyText` at bottom of page for disclaimers. Reserve `Banner` for in-flow states the persona would see (submit error, success after action, blocking validation).

### Empty State

**Component**: `design/components/EmptyState.tsx`

```tsx
import { EmptyState } from './components';
import { userIcon } from '@workday/canvas-system-icons-web';

{data.length === 0 && (
  <Card padding="xl">
    <EmptyState 
      icon={userIcon}
      title="No active requisitions"
      description="Post your first job to start recruiting."
      actionText="Post job"
      onAction={() => navigate('/post-job')}
    />
  </Card>
)}
```

## Loading State Pattern

Show loading state during async operations:

```tsx
const [isLoading, setIsLoading] = useState(false);

<PrimaryButton onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? 'Submitting...' : 'Submit application'}
</PrimaryButton>

{/* For full-page loading */}
{isLoading && (
  <Box padding="xl" style={{ textAlign: 'center' }}>
    <BodyText>Loading...</BodyText>
  </Box>
)}
```

## Responsive Layout

### Desktop Layout (>1024px)
- Multi-column grids
- Sidebar patterns
- Full table widths

### Tablet Layout (768-1024px)
- Single column with cards stacked
- Tables remain horizontal scrollable
- Sidebar moves below main content

### Mobile Layout (<768px)
- Single column only
- Cards full width
- Tables use horizontal scroll
- Buttons stack vertically

**Implementation**:
```tsx
// Use CSS media queries or responsive utilities
<Flex 
  flexDirection={{ base: 'column', md: 'row' }}
  gap="l"
>
  <Box flex={{ base: '1', md: '0 0 70%' }}>
    {/* Main content */}
  </Box>
  <Box flex={{ base: '1', md: '0 0 30%' }}>
    {/* Sidebar */}
  </Box>
</Flex>
```

## Best Practices

### DO
- ✅ Use `ProfilePageLayout` for profile/hub pages
- ✅ Add mandatory page title (`Heading size="large"`)
- ✅ Use `Modal` for dialogs and confirmations
- ✅ Use `Banner` for in-flow states (error, success, warning)
- ✅ Implement empty states with helpful messaging
- ✅ Show loading states during async operations
- ✅ Plan responsive behavior for all layouts
- ✅ Use render props for flexible content
- ✅ Test keyboard navigation and focus management

### DON'T
- ❌ Build custom breadcrumbs or hierarchy path strips (hard rule)
- ❌ Use yellow Banner for mock data disclaimers (use neutral BodyText)
- ❌ Skip page titles (required for hierarchy)
- ❌ Build custom modal components (use Canvas Kit Modal)
- ❌ Forget empty states (show helpful messaging)
- ❌ Ignore responsive behavior (test on multiple sizes)
- ❌ Use fixed widths without responsive alternatives
- ❌ Skip focus management in modals
