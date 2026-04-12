# Communication Patterns

Canvas Kit patterns for email, WhatsApp, SMS, and communication channels in Workday Recruiting prototypes.

## Email Channel Implementation

### Full Email (Gmail-style threading)

Use `EmailPanel` component for complete email experience with thread sidebar, history, and rich composition.

**Component**: `design/components/EmailPanel.tsx`

**Features**:
- Thread sidebar with conversation list
- Full email composition (To, Cc, Subject, Rich body)
- Email history with timestamps
- Template support
- GenAI enhancement
- Workday branding toggle

**Usage**:
```tsx
import { EmailPanel, type EmailThread } from './components';

<CommunicationDock
  channels={[
    { 
      id: 'email', 
      icon: mailIcon, 
      label: 'Email', 
      expandedWidthPx: 950,
      panel: (
        <EmailPanel
          threads={emailThreads}
          activeThreadId={activeEmailThreadId}
          onThreadSelect={setActiveEmailThreadId}
          onNewEmail={() => { /* reset fields */ }}
          from={from} to={to} cc={cc} subject={subject} body={body}
          onFromChange={setFrom} onToChange={setTo}
          onCcChange={setCc} onSubjectChange={setSubject}
          onBodyChange={(html, text) => setBody(text)}
          onSend={sendEmail}
          onClosePanel={collapse}
          showBranding brandingChecked={branding}
          onBrandingChange={setBranding}
        />
      )
    }
  ]}
/>
```

### Simple Email (Compose only)

Use `EmailComposer` for simple email composition without threading.

**Component**: `design/components/EmailComposer.tsx`

**Features**:
- To, Cc fields
- Subject line
- Rich text body
- Template support
- GenAI enhancement
- Send action

**Usage**:
```tsx
import { EmailComposer } from './components';

<EmailComposer
  to={to}
  cc={cc}
  subject={subject}
  body={body}
  onToChange={setTo}
  onCcChange={setCc}
  onSubjectChange={setSubject}
  onBodyChange={(html, text) => setBody(text)}
  onSend={sendEmail}
/>
```

### Rich Text Editor

Use `RichTextEditor` for any rich text composition needs.

**Component**: `design/components/RichTextEditor.tsx`

**Features**:
- Rich text toolbar (Bold, Italic, Lists, etc.)
- Template dropdown (6 recruiting templates)
- GenAI enhancement with sparkle icon
- Token replacement system
- Word/character count

**Templates** (built-in):
1. Interview Availability
2. Interview Confirmation
3. Offer Renegotiation
4. Application Status Update
5. Documents Request
6. Pre-Screen Follow-Up

**Token System**:
- `{{candidateFirstName}}` - Candidate's first name
- `{{jobTitle}}` - Job title
- `{{recruiterName}}` - Recruiter's name
- `{{companyName}}` - Company name
- Additional tokens as needed

**Usage with templates and GenAI**:
```tsx
<RichTextEditor
  value={body}
  onChange={(html, text) => setBody(text)}
  showTemplates
  showGenAI
  candidateData={{
    firstName: 'Sarah',
    jobTitle: 'Senior Product Manager',
    recruiterName: 'David Denham',
    companyName: 'Workday'
  }}
/>
```

**GenAI Enhancement**:
- Clicking sparkle icon improves text quality
- Adds professional greeting/closing
- Improves tone and clarity
- 1.5s mock transformation delay
- Realistic text improvements (not hallucinated content)

## WhatsApp Channel Implementation

### WhatsApp Panel

Use inline composition with Sana communication components.

**Components**:
- `SanaCommComposer` - Pill composer with send button
- `SanaCommMessageBubble` - Message bubbles with timestamps
- `sanaCommFormControlStyle` - Form control styling

**Import from**: `design/components/SanaCommPanelPatterns.tsx`

**Usage**:
```tsx
import { SanaCommComposer, SanaCommMessageBubble, sanaCommFormControlStyle } from './components';
import { colors } from '@workday/canvas-kit-react/tokens';

{/* Message thread */}
<Flex flexDirection="column" gap="m" padding="m">
  {messages.map(msg => (
    <SanaCommMessageBubble
      key={msg.id}
      text={msg.text}
      timestamp={msg.timestamp}
      isSent={msg.isSent}
    />
  ))}
</Flex>

{/* Composer at bottom */}
<Box padding="m" style={{ borderTop: `1px solid ${colors.soap300}` }}>
  <SanaCommComposer
    value={message}
    onChange={setMessage}
    onSend={sendMessage}
    placeholder="Type a message..."
  />
</Box>
```

**Styling Details** (from Sana reference):
- **Composer**: White pill background, soap300 border, link-colour focus ring
- **Send button**: Circular button inset bottom-right of composer
- **Message bubbles**: White background, soap300 hairline border, 12px radius
- **Timestamps**: Small grey text below bubbles

## SMS and Other Channels

**Pattern**: Reuse WhatsApp pattern (composer + bubbles) for consistency across messaging channels.

**Channels using same pattern**:
- SMS
- LINE (Japan)
- Notes (internal)
- Any future messaging channel

**Implementation**: Same as WhatsApp, just change channel branding/labels.

## Full-page agentic assistant (scheduling, screening, Q&A)

For full-page conversational AI experiences (like candidate self-scheduling or Paradox-style bots), use the same `SanaComm*` components as the WhatsApp panel, but laid out in a main column rather than a sliding dock. Ensure the chat container has a fixed height (e.g., `height: calc(100vh - 64px)`) with an inner scrolling message area (`overflowY: 'auto'`) so the composer remains docked at the bottom of the viewport.

**Candidate Navigation**: For external candidates, replace the internal `WorkdayTopNav` with a simplified career site header (e.g., Brand Logo + "Candidate Home" link).

**Scroll Behavior**: Implement auto-scrolling that focuses on the *start* of the latest assistant response (e.g., using `scrollIntoView({ block: 'start' })`), rather than just scrolling to the absolute bottom, to ensure long messages are readable from the top.

**Components**:
- `SanaCommComposer` - Pill composer with send button
- `SanaCommMessageBubble` - Message bubbles
- Canvas Kit `Avatar` - For the assistant identity

**Usage**:
```tsx
import { SanaCommComposer, SanaCommMessageBubble } from './components';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Flex, Box } from '@workday/canvas-kit-react/layout';

{/* Assistant Message Row */}
<Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
  <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
  <Box style={{ flex: 1, minWidth: 0 }}>
    <SanaCommMessageBubble align="start">
      Hi there! I'm the scheduling assistant.
    </SanaCommMessageBubble>
  </Box>
</Flex>

{/* User Message Row */}
<SanaCommMessageBubble align="end">
  Show me available times
</SanaCommMessageBubble>

{/* Composer at bottom */}
<Box padding="m" style={{ borderTop: `1px solid ${colors.soap300}` }}>
  <SanaCommComposer
    value={message}
    onChange={setMessage}
    onSend={sendMessage}
    placeholder="Type a message..."
  />
</Box>
```

## Communication Dock Integration

### CommunicationDock Component

**Component**: `design/components/CommunicationDock.tsx`

**Usage**: Sliding right panel for multi-channel communication.

**Default state**: **ALWAYS collapsed** (`expanded={false}` or controlled state with initial `false`)

**User interaction**: Click rail icon button to expand

**Rail Pattern** (Sana Style):
- Use `communicationRailButtonStyle` for narrow right rail tiles
- ~10px rounded tiles
- Active channel: Light blue fill + link-colour icon ring
- Import from `sanaShellTheme.ts`

**Panel Surface**:
- Header: White background (`SANA_COMM_PANEL_SURFACE`)
- Body: Uses shared comm patterns (composer, bubbles, form controls)

**Width**:
- Email: `expandedWidthPx: 950` (needs space for threading)
- WhatsApp/SMS: `expandedWidthPx: 450` (narrower, chat-style)

**Wrapping**:
- Dock wraps sliding column in Canvas Kit `Card` with `padding="zero"`
- Inner sections may use `Card`, `Banner`, `FormField` as needed

**Example**:
```tsx
import { CommunicationDock } from './components';

<CommunicationDock
  channels={[
    {
      id: 'whatsapp',
      icon: chatIcon,
      label: 'WhatsApp',
      expandedWidthPx: 450,
      panel: <WhatsAppPanel />
    },
    {
      id: 'email',
      icon: mailIcon,
      label: 'Email',
      expandedWidthPx: 950,
      panel: <EmailPanel />
    }
  ]}
  activeChannel={activeChannel}
  onChannelChange={setActiveChannel}
  defaultExpanded={false}
/>
```

## Full-Page Agentic Assistant

For full-page conversational AI interfaces (like scheduling assistants, screening bots, or Recruiter Hub GenUI):

**Components**: 
- `SanaCommMessageBubble` (from `SanaCommPanelPatterns.tsx`)
- `SanaCommComposer` (from `SanaCommPanelPatterns.tsx`)
- `A2UIRenderer` and `GenUIPatterns.tsx` (for rich, agent-generated UI)

**Features**:
- Fixed-height chat container with inner scrolling (`overflowY: 'auto'`)
- Bottom-docked composer
- Auto-scrolling to the *start* of new assistant messages
- Support for rich embedded UI (GenUI) via A2UI JSON payloads

**Usage**:
```tsx
import { SanaCommMessageBubble, SanaCommComposer, A2UIRenderer } from './components';

// Container
<Flex style={{ height: 'calc(100vh - 64px)', flexDirection: 'column' }}>
  
  // Scrollable message area
  <Flex flex={1} style={{ overflowY: 'auto', padding: '24px' }}>
    <Box style={{ maxWidth: '100%', width: '100%' }}>
      {messages.map(msg => (
        <Flex key={msg.id} alignItems="flex-start" gap="xs">
          <Avatar as="div" size="small" altText="Assistant" />
          <Box style={{ flex: 1, minWidth: 0 }}>
            {/* Use maxWidth="100%" to allow GenUI grids/charts to expand */}
            <SanaCommMessageBubble align="start" maxWidth={msg.a2uiNode ? '100%' : 'min(100%, 600px)'}>
              {msg.text && <Box marginBottom={msg.a2uiNode ? 'm' : 'zero'}>{msg.text}</Box>}
              {msg.a2uiNode && <A2UIRenderer node={msg.a2uiNode} onAction={handleAction} />}
            </SanaCommMessageBubble>
          </Box>
        </Flex>
      ))}
    </Box>
  </Flex>

  // Docked composer
  <Box style={{ padding: '16px', borderTop: `1px solid ${colors.soap300}` }}>
    <SanaCommComposer
      value={input}
      onChange={setInput}
      onSend={handleSend}
      placeholder="Ask me anything..."
    />
  </Box>
</Flex>
```

## Communication Channel Selectors

### Current Pattern (SecondaryButton with state styling)

Working pattern for channel tabs/selectors:

```tsx
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';

<Flex gap="s">
  <SecondaryButton 
    size="small" 
    onClick={() => setChannel('email')}
    style={channel === 'email' ? { 
      backgroundColor: colors.blueberry400, 
      color: colors.frenchVanilla100 
    } : undefined}
  >
    Email
  </SecondaryButton>
  <SecondaryButton 
    size="small" 
    onClick={() => setChannel('sms')}
    style={channel === 'sms' ? { 
      backgroundColor: colors.blueberry400, 
      color: colors.frenchVanilla100 
    } : undefined}
  >
    SMS
  </SecondaryButton>
  <SecondaryButton 
    size="small" 
    onClick={() => setChannel('whatsapp')}
    style={channel === 'whatsapp' ? { 
      backgroundColor: colors.blueberry400, 
      color: colors.frenchVanilla100 
    } : undefined}
  >
    WhatsApp
  </SecondaryButton>
</Flex>
```

**Why this works**: Provides immediate visual feedback, simple state management, Canvas Kit styling.

### Future Pattern (SegmentedControl)

When team has capacity for model-based API setup:

```tsx
import { SegmentedControl } from '@workday/canvas-kit-preview-react/segmented-control';

<SegmentedControl
  initialValue={channel}
  onChange={(event) => setChannel(event.target.value)}
>
  <SegmentedControl.List aria-label="Communication channel selector">
    <SegmentedControl.Item value="email">Email</SegmentedControl.Item>
    <SegmentedControl.Item value="sms">SMS</SegmentedControl.Item>
    <SegmentedControl.Item value="whatsapp">WhatsApp</SegmentedControl.Item>
  </SegmentedControl.List>
</SegmentedControl>
```

**Benefits**: Semantically correct (toggle group), better accessibility, matches Canvas Kit view-switching patterns.

**Trade-off**: Requires model-based API integration. Use SecondaryButton pattern for prototypes unless specifically requested.

## Communication Form Controls

For form inputs within communication panels (To, Cc, Subject fields):

**Style**: `sanaCommFormControlStyle` from `SanaCommPanelPatterns.tsx`

**Characteristics**:
- White background
- 12px border radius
- 44px minimum height
- Matches Sana reference: `Sana_Style_UI-candidate-profile-whatsapp-panel.png`

**Usage**:
```tsx
import { sanaCommFormControlStyle } from './components/SanaCommPanelPatterns';

<TextInput
  placeholder="To"
  value={to}
  onChange={(e) => setTo(e.target.value)}
  style={sanaCommFormControlStyle}
/>
```

## Sana Communication References

**Visual benchmarks**: `design/references/sana/`
- `Sana_Style_UI-candidate-profile-whatsapp-panel.png` - Full candidate profile with WhatsApp panel
- `Sana_Style_UI-employee-profile-comm-dock.png` - Employee profile with communication dock

**Key visual elements**:
- Pill composer with focus ring
- Circular send button inset
- White message bubbles with soap borders
- Narrow right rail with rounded channel tiles
- 12px radius for compact elements

## Best Practices

### DO
- ✅ Use `EmailPanel` for full email experience
- ✅ Use `EmailComposer` for simple email-only
- ✅ Use `RichTextEditor` with templates + GenAI
- ✅ Reuse Sana comm components (composer, bubbles, form controls)
- ✅ Use `SanaCommComposer` and `SanaCommMessageBubble` for full-page agentic chat
- ✅ Use `A2UIRenderer` and `GenUIPatterns` for rich, agent-generated UI payloads
- ✅ Default `CommunicationDock` to collapsed
- ✅ Use channel-specific widths (email: 950px, chat: 450px)
- ✅ Follow Sana reference PNGs for styling validation

### DON'T
- ❌ Build custom email threading UI (use EmailPanel)
- ❌ Create ad-hoc message bubble components (use SanaCommMessageBubble)
- ❌ Build fake pill composers with `Box` + `SecondaryButton` for chat (use SanaCommComposer)
- ❌ Let the chat container scroll the whole page (use fixed height with inner scrolling so composer stays docked)
- ❌ Constrain agentic chat bubbles to narrow widths when they contain rich UI (grids, charts, carousels)
- ❌ Hardcode 4px radii for comm controls (use sanaCommFormControlStyle)
- ❌ Default CommunicationDock to expanded (user should expand)
- ❌ Use same width for all channels (email needs more space)
- ❌ Skip template/GenAI features in email flows (they're built-in)
