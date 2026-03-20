# 315 Rule Improvements - Implementation Summary

*Location: `docs/agent-notes/` (implementation log; the live rule is `.cursor/rules/315-ux-designer.mdc`).*

**Date**: 20 March 2026  
**Changes**: Priority 1 (Canvas Kit Verification) + Priority 2 (Props Examples)  
**Goal**: Ensure Canvas Kit is always used in prototypes + improve 315→320 handoff clarity

---

## Changes Made

### 1. Added Step 6.5: Canvas Kit Compliance Verification (MANDATORY)

**Location**: Between Step 6 (Classify visual shell & references) and Step 7 (Six Hats Thinking)

**What it does**:
- Forces 315 to verify every UI component against Canvas Kit v11 BEFORE Six Hats validation
- Creates a checklist of components, tokens, and shared Workday components
- Prevents "fantasy UI" specs that 320 cannot implement
- Documents any non-standard elements requiring Canvas Kit MCP consultation

**New Discovery Brief Section**: "Canvas Kit Component Mapping (Verified)"
- Checklist for: Buttons, Layout, Forms, Data Display, Navigation, Typography, Icons
- Token verification: Colors, Spacing, Shape
- Shared component verification: WorkdayTopNav, WorkdayLeftTabBar, CommunicationDock
- Non-standard elements documentation
- Quality check before handoff to 320

**Impact**: 
- ✅ Ensures Canvas Kit is always used (addresses your #1 goal)
- ✅ Catches implementation gaps early (before 320 starts building)
- ✅ Forces Canvas Kit MCP consultation when needed

---

### 2. Enhanced "Reusable Layout Components" with Concrete Props Examples

**Location**: Discovery Brief template section

**Before** (vague):
```markdown
- **`WorkdayTopNav`**: Yes / No
  - If yes: props summary (e.g. notificationBadge, inboxBadge, showWMark...)
```

**After** (concrete TSX examples):
```tsx
<WorkdayTopNav 
  notificationBadge={3}        // number for count badge, undefined for none
  inboxBadge={5}               // number for inbox count
  showWMark={true}             // show Workday logo (default true)
  showMenuWordmark={false}     // show "Recruiting Hub" text (optional)
  trailingActions={<...>}      // custom actions right of search (rare)
/>
```

**Components documented**:
- **WorkdayTopNav**: Full props API with inline comments
- **WorkdayLeftTabBar**: Tab configuration, title/subtitle patterns, optional actions
- **CommunicationDock**: Channels, rail behavior for messaging features

**Added**: "Example from current prototype" citations (e.g., `gcc-candidate-grid-search.tsx`)

**Impact**:
- ✅ 320 sees exact API surface, not vague descriptions
- ✅ Reduces back-and-forth between 315 and 320
- ✅ Creates reusable examples for future briefs
- ✅ Your GCC prototype becomes the reference implementation

---

### 3. Updated Workflow Steps to Include Canvas Kit Verification

**GCC E2E Pipeline Context** now shows:
```
6.5. Verify Canvas Kit compliance - map all UI components to Canvas Kit v11, 
     check tokens, document any non-standard elements
```

**Example Usage** updated to show Canvas Kit verification step:
```
6c. Canvas Kit verification: Verify all components (Card, TextInput, 
    PrimaryButton, Modal, CommunicationDock, etc.) map to Canvas Kit v11; 
    confirm WorkdayTopNav and CommunicationDock usage
```

---

### 4. Strengthened Discovery Brief Quality Criteria

**Added to "Strong brief includes"**:
- Canvas Kit Component Mapping (Verified) section with all UI components checked
- Reusable layout components with **concrete props examples**

**Added to "Weak brief lacks"**:
- No Canvas Kit verification (missing component mapping, token checks, or "fantasy UI")
- No shared component **props examples** (WorkdayTopNav/WorkdayLeftTabBar/CommunicationDock lack concrete TSX)

---

## Benefits

### For You (PM)
- ✅ **Canvas Kit compliance guaranteed**: Every brief now has mandatory verification checklist
- ✅ **No more rework**: 320 receives specs they can actually implement
- ✅ **Quality signal**: Briefs with Canvas Kit verification = higher fidelity prototypes

### For 315 (Prototype Discovery & Design Agent)
- ✅ **Clear process**: Knows exactly when to verify Canvas Kit (after shell, before Six Hats)
- ✅ **Actionable checklist**: Component/token mapping provides concrete verification steps
- ✅ **Early MCP consultation**: Identifies need for Canvas Kit MCP before Six Hats

### For 320 (Prototype Developer Agent)
- ✅ **Implementable specs**: No more "fantasy UI" that can't be built with Canvas Kit
- ✅ **Exact API surface**: Props examples show TSX, not prose descriptions
- ✅ **Faster builds**: Less time interpreting vague descriptions, more time coding

### For Design System
- ✅ **Consistency**: Every prototype uses same shared components (WorkdayTopNav, WorkdayLeftTabBar)
- ✅ **Pattern library grows**: Each prototype with props examples becomes reference for next
- ✅ **Sana Style compliance**: Token verification ensures neutrals, proper spacing, correct radii

---

## Example: How Canvas Kit Verification Would Work for GCC Candidate Grid

**Step 6.5 Output** (what 315 would produce):

```markdown
## Canvas Kit Component Mapping (Verified)

### Primary UI Components (checked against Canvas Kit v11)
- [x] **Buttons**: `PrimaryButton` (Get suggestions), `SecondaryButton` (Boolean syntax), `TertiaryButton` (modal close)
- [x] **Layout**: `Flex`, `Box`, `Card` (for AI suggestions, tab content)
- [x] **Forms**: `FormField`, `TextInput` (candidate search)
- [x] **Data Display**: `Table` (compound API - candidate grid), `Banner` (unified view explanation)
- [x] **Navigation**: `Modal` (Boolean syntax help), `Tabs` / hub nav (no breadcrumb strips in prototypes)
- [x] **Typography**: `Heading` (page title), `BodyText` (descriptions, labels)
- [x] **Icons**: `SystemIcon` (chevrons/arrows for inline controls and carousel as needed)

### Tokens Verified (from Canvas Kit)
- [x] **Colors**: `colors.soap100` (table bg), `colors.blackPepper500` (labels), `colors.blueberry600` (links - sparing)
- [x] **Spacing**: `space.m` (card padding), `space.s` (button gaps), `space.l` (section margins)
- [x] **Shape**: `SANA_CARD_RADIUS_LG` (card corners), `SANA_SHELL_RADIUS` (main content area)

### Shared Workday Components (from design/components/)
- [x] **WorkdayTopNav**: Yes - default config with notification/inbox badges
- [x] **WorkdayLeftTabBar**: Yes - 3 tabs (Overview, Candidates, Interviews), requisition title/subtitle
- [ ] **CommunicationDock**: No - not a messaging feature

### Non-Standard Elements
- Profile modal carousel: Uses standard Canvas Kit Modal + custom carousel logic (arrow key navigation)
- HiredScore fit cell: Custom component but uses Canvas Kit BodyText + color tokens

### Verification Notes
- **Canvas Kit MCP consulted**: No - all components available in v11 standard library
- **Reference prototype**: First comprehensive Sana-style prototype with WorkdayLeftTabBar tabs
```

**Result**: 320 receives a brief that's 100% implementable, with every component verified.

---

## Next Steps (Not Implemented Yet - Priority 3)

These improvements were **not** included (they were Priority 3 - nice-to-have):

### 3. Multi-Tab Layout Consistency Pattern
- Would add explicit guidance on keeping all tabs structurally consistent
- Would prevent the issue you encountered (Candidates tab using different structure than Overview/Interviews)
- **Recommendation**: Add this if you notice inconsistency patterns across multiple prototypes

### 4. JTBD → UI Element Mapping Table
- Would create direct traceability from job to interface
- Would become acceptance criteria for 320
- **Recommendation**: Add this if you want stronger JTBD-to-UI accountability

### 5. Reference Screen Fidelity Validation
- Would add explicit pattern-matching check against reference PNGs
- Would catch visual inconsistencies before 320 builds
- **Recommendation**: Add this if you notice prototypes drifting from Workday patterns

---

## Verification

To verify these changes work, the **next GCC E2E pipeline run** should:
1. 315 will pause after Step 6 to perform Canvas Kit verification
2. Discovery Brief will include new "Canvas Kit Component Mapping (Verified)" section
3. Discovery Brief will show TSX props examples for WorkdayTopNav and WorkdayLeftTabBar
4. 320 will receive implementable specs with zero ambiguity about component usage

---

## Files Modified

- `/Users/david.denham/product-manager-agent/.cursor/rules/315-ux-designer.mdc`
  - Added Step 6.5: Canvas Kit Compliance Verification (MANDATORY)
  - Enhanced Reusable layout components template with props examples
  - Updated GCC E2E Pipeline workflow to include Canvas Kit verification
  - Updated Example Usage to show Canvas Kit verification in action
  - Strengthened Discovery Brief Quality criteria

---

**Status**: ✅ **Complete** - Priority 1 (Canvas Kit Verification) + Priority 2 (Props Examples) implemented
