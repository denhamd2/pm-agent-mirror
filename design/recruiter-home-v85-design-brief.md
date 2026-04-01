# Workday Recruiter Homepage v85 - Design Brief

**Created:** 31 March 2026  
**Status:** Prototype Complete  
**Route:** `/recruiter-home-v85`  
**File:** `design/recruiter-home-v85.tsx`

## Overview

AI-native Workday Homepage designed for enterprise recruiters. Surfaces priority insights, smart recommendations, and key metrics to help recruiters start their day with clarity and take action on what matters most.

## Jobs to Be Done

**Primary persona:** HR Professional (Recruiter) — Talent Acquisition

**High-level outcome:** Maintain high standards of efficiency and effectiveness

**Core jobs addressed:**
1. Keep track of concurrent tasks that need to be completed
2. Ensure that time is made to action high priority items
3. Understand which job reqs are most in need of attention
4. Meet my efficiency metrics as a recruiter
5. Progress candidates through stages efficiently

**Synthesised JTBD:**  
*When I start my workday, I want to immediately see what needs my attention and why, so I can prioritise high-impact actions and keep my pipeline healthy.*

## Design Principles

### AI-Native Approach
- **Proactive insights**: AI identifies priority actions based on pipeline health, engagement signals, and historical patterns
- **Predictive analytics**: Forecasts offer acceptance, flags at-risk interviews, surfaces strong candidate matches
- **Contextual recommendations**: Smart candidate matches powered by HiredScore with AI-generated match reasons
- **Confidence indicators**: Show AI confidence levels to build trust

### Recruiter-Centric Information Architecture
1. **AI Daily Briefing** — Executive summary of what needs attention
2. **Key Metrics** — Personalized performance indicators
3. **Priority Insights** — AI-ranked actions by impact and urgency
4. **Smart Recommendations** — AI-matched candidates for active reqs
5. **Quick Actions** — Usage-based workflow shortcuts
6. **Pipeline Health** — Velocity and efficiency metrics with trend analysis
7. **Today's Schedule** — Interview calendar with panel confirmation status
8. **Requisitions Needing Attention** — AI-flagged reqs with stalled pipelines or deadlines

## Component Usage

### Reused from Design System
- **MetricCard**: 4 KPI cards (Priority actions, Active reqs, Candidates to review, Pipeline velocity)
- **ListItemCard**: Candidate recommendations with metadata and trailing HiredScore badges
- **HiredScoreGrading**: Compact variant for candidate match quality and req table

### Custom Implementations
- **AI Daily Briefing Card**: Branded blue container with sparkle icon, confidence indicator
- **AI Priority Insights**: Colour-coded cards by type (priority=blue, opportunity=green, risk=orange, success=green) with action buttons
- **Pipeline Health Metrics**: Detailed metric cards with status indicators, trends, and threshold comparisons
- **Today's Schedule**: Time-based list with confirmation status and panel info
- **Requisitions Table**: AI alerts column, clickable rows to candidate grid

## Visual Design (Sana Style)

### Colour Palette
- **Primary surface**: `frenchVanilla100` (neutral card backgrounds)
- **Page canvas**: `soap100` (Sana page background)
- **AI accent**: `blueberry100-600` gradient for AI-powered features
- **Status colours**: Green (success/healthy), Orange (risk/attention), Blue (priority)
- **Borders**: `soap300` (subtle card borders)

### Typography
- **Heading large**: Personalized greeting "Good [time of day], [name]"
- **Heading small**: Section titles
- **Body small**: Descriptions, metadata, helper text
- **Font weights**: 700 for emphasis (metric values, card titles), 600 for semi-bold labels

### Layout
- **Shell**: Sana 3-column (Primary rail 56px + Secondary nav 280px + Main content)
- **Grid system**: Flexbox with responsive wrapping
- **Card spacing**: `space.xl` between major sections, `space.m` between cards
- **Card radius**: `SANA_CARD_RADIUS_LG` (12px)
- **Left accent borders**: 4px coloured border on AI insight cards for visual hierarchy

## AI Features

### 1. AI Daily Briefing
Summarises pipeline health and top 4 priority items with confidence score. Shows:
- Priority items count
- Confidence percentage
- Data sources (pipeline velocity, engagement, historical patterns)

### 2. AI Priority Insights
Ranked action cards by impact and urgency:
- **Priority**: Time-sensitive actions (e.g., candidates waiting 18+ days)
- **Opportunity**: New matches or positive signals (e.g., 2 new A-grade candidates)
- **Risk**: Potential problems (e.g., interview panel not confirmed)
- **Success**: Predicted wins (e.g., 87% offer acceptance likelihood)

Each insight includes:
- Context-rich description with specific data points
- Action button linking to relevant workflow
- Visual type indicator (icon + colour)

### 3. AI Candidate Recommendations
HiredScore-powered matches with:
- Candidate name, job title, req ID
- Days in pipeline
- HiredScore grade (A/B/C)
- AI-generated match reason (e.g., "Strong PM background + Talent products expertise")

### 4. Pipeline Health Analysis
AI analysis of recruiting metrics with trend indicators:
- Time-to-first-screen (4.8 days, 12% faster than target)
- Interview scheduling rate (76%, above threshold)
- Offer acceptance rate (82%, +8% vs. last quarter)
- Candidate response rate (64%, needs attention)

Status indicators show at-a-glance health (Green=healthy, Orange=needs attention).

### 5. Predictive Alerts (in Requisitions Table)
AI flags reqs needing attention with specific reasons:
- "3 A-grade candidates waiting 18+ days" (priority)
- "New strong matches available" (opportunity)
- "Target start date approaching (30 days)" (risk)

## Navigation & Integration

### Entry Points
- **Default route**: Homepage is now the default landing page (`/recruiter-home-v85`)
- **From Candidate Grid**: Click "Home" button in left nav
- **From any page**: Click HOME in primary rail

### Exit Points
- **RECRUIT button**: Navigate to candidate grid (`/candidate-grid-v84`)
- **"Review candidates" button**: Deep link to candidate grid from AI insight
- **"Review new applications" quick action**: Navigate to candidate grid
- **Requisitions table rows**: Click row to navigate to candidate grid

### Shell Integration
- **Left nav**: Consistent primary rail (HOME, RECRUIT, ORG, LINKS, MORE)
- **Top nav**: Search, notifications (3), inbox (12)
- **Secondary nav**: Shows "Recruiting Hub" title with recruiter identity

## Accessibility

- **Semantic HTML**: Proper heading hierarchy (h1 not used, h2 for sections)
- **Keyboard navigation**: All interactive elements are keyboard accessible (tabIndex, onClick)
- **ARIA labels**: Buttons have descriptive labels
- **Focus states**: Visual focus indicators on interactive elements
- **Status indicators**: Canvas Kit StatusIndicator components for semantic status communication

## Data Model (Mock)

### AiInsight Interface
```typescript
interface AiInsight {
  id: string;
  type: 'priority' | 'opportunity' | 'risk' | 'success';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}
```

### SmartRecommendation Interface
```typescript
interface SmartRecommendation {
  id: string;
  candidateName: string;
  jobTitle: string;
  reqId: string;
  score: number;
  reason: string;
  daysInPipeline: number;
}
```

## Implementation Notes

### State Management
- **Greeting logic**: Dynamic based on time of day (morning/afternoon/evening)
- **No persistent state**: Homepage displays read-only dashboard; actions navigate to work areas
- **Real-time updates**: "Updated 5 minutes ago" indicator (mock, would be live in production)

### Performance
- **Lazy loading candidates**: Only load visible recommendations (3 shown)
- **Efficient rendering**: Uses Canvas Kit primitives for optimal performance
- **Icon optimization**: SVG icons via `dangerouslySetInnerHTML` for system icons

### Future Enhancements
1. **Personalization**: User preferences for metric visibility and order
2. **Real-time updates**: WebSocket connection for live insight updates
3. **Action dismissal**: Mark insights as "done" or "snooze"
4. **Deeper AI explanations**: Expandable cards with full AI reasoning
5. **Customizable quick actions**: User-defined shortcuts based on personal workflow
6. **Integration with calendar**: Sync with Outlook/Google Calendar for interview scheduling
7. **Mobile responsive**: Adapt layout for tablet and mobile devices

## Design System Impact

This homepage demonstrates comprehensive use of existing components:
- **MetricCard**: Showcases 4-up grid layout for KPIs
- **HiredScoreGrading**: Integrated into recommendations and req table
- **ListItemCard**: (Not used in v85, but available for future list patterns)
- **Canvas Kit primitives**: Box, Flex, Heading, BodyText, StatusIndicator, Button variants

**New patterns introduced:**
- **AI-branded cards**: Blue gradient containers with sparkle icon for AI features
- **Insight cards**: Left-accent border pattern for categorized insights
- **Schedule timeline**: Time-based list with confirmation status badges
- **Alert column in tables**: Coloured dots + descriptive text for AI-identified issues

## Validation

✅ **Navigation**: Bidirectional links work (Home ↔ Candidate Grid)  
✅ **Responsive layout**: Cards wrap appropriately  
✅ **Sana Style compliance**: Neutral surfaces, controlled accent usage, soft radii  
✅ **Canvas Kit usage**: All components from official library  
✅ **TypeScript**: Fully typed interfaces for all data models  
✅ **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels  
✅ **Build**: Compiles successfully without errors

## File Locations

- **Prototype**: `design/recruiter-home-v85.tsx`
- **Routing**: `design/main.tsx` (updated with v85 route)
- **Integration**: `design/gcc-candidate-grid-search.tsx` (Home button onClick added)
- **Design Brief**: `design/recruiter-home-v85-design-brief.md` (this file)

---

**Design Philosophy**: An AI-native homepage isn't about adding AI badges everywhere - it's about surfacing the right information at the right time, with intelligent prioritization and predictive insights that help recruiters focus on high-impact work. The homepage replaces manual status checking with proactive alerts, replaces hunting for candidates with smart recommendations, and replaces guesswork with data-driven confidence.
