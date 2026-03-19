# Design Workflow Guide

This guide explains how to use the modularized design agents: **410-doc-writer**, **420-prototype-developer**, and **430-ux-designer**.

---

## Overview

The design workflow has been split into three specialized agents:

| Agent | Purpose | Standalone Use | Part of Chain |
|-------|---------|----------------|---------------|
| **420-prototype-developer** | Build Canvas Kit prototypes (first in prototype-first flow) | Yes | Yes |
| **410-doc-writer** | Review UI copy against Editorial Guidelines | Yes | Yes |
| **430-ux-designer** | Extract design context from Figma, capture prototypes to Figma | Yes | Yes |

**Prototype-first** (primary): 420 builds → 410 reviews copy → 430 captures to Figma  
**Design-first** (when Figma exists): 430 analyzes → 410 reviews copy → 420 implements

---

## 🔗 How to Chain All 3 Agents Together

### Method 1: Explicit Chain Request (Recommended)

Use clear language that indicates you want the full design-to-code pipeline:

```
"Implement this Figma design: https://figma.com/design/xyz789/Timesheets?node-id=12-34"
```

**What happens**:
1. **430-ux-designer** extracts design context
2. **410-doc-writer** reviews all UI copy
3. **420-prototype-developer** implements with Canvas Kit

**Trigger phrases**: "Implement this Figma design: [URL]", "Build from [Figma URL]"

### Method 2: Step-by-Step Chain (Manual)

You can manually orchestrate the chain:

**Step 1**: Analyze design (430)
```
"Analyze this Figma file: https://figma.com/design/xyz789/Timesheets?node-id=12-34"
```
→ Invokes **430-ux-designer** → Returns design spec

**Step 2**: Review copy (410)
```
"Review the copy from the design analysis above"
```
→ Invokes **410-doc-writer** → Returns approved copy

**Step 3**: Implement (420)
```
"Implement the component using the design spec and approved copy above"
```
→ Invokes **420-prototype-developer** → Returns Canvas Kit code

### Method 3: Let the Orchestrator Decide

Share a Figma URL with implementation intent and the **000-master-orchestrator** will chain the agents:

```
User: "I need this design implemented: [Figma URL]"

Orchestrator:
1. Routes to 430-ux-designer (design-first) or 420-prototype-developer (prototype-first)
2. Routes to 410-doc-writer  
3. Routes to 420-prototype-developer or 430-ux-designer
4. Logs the workflow in MISSION_LOG.md
```

---

## 🎯 Individual Agent Usage

### 410-doc-writer (Standalone)

**Use when**: You want to review UI copy without implementing anything.

**Trigger phrases**:
- "Review the copy in this design"
- "Check if these button labels follow editorial guidelines"
- "Improve these error messages: [paste text]"
- "Is this empty state copy good?"
- "Review UX writing for [component name]"

**Example**:
```
User: "Review this button label: 'Click Here To Submit Your Application'"

410-doc-writer:
❌ Issues:
- Title Case (should be sentence case)
- "Click Here" is redundant
- Too wordy

✅ Recommended: "Submit application"

Rationale: Sentence case, removes redundancy, concise, action-oriented
```

**What you get**:
- Copy review with issues identified
- Recommendations for improvement
- Rationale based on Editorial Guidelines

**Output location**: Inline response (no file created)

---

### 430-ux-designer (Standalone)

**Use when**: You want to understand what's in a Figma file without implementing it.

**Trigger phrases**:
- "What's in this Figma file: [URL]"
- "Analyze this design: [URL]"
- "Extract design tokens from [URL]"
- "What components are in [URL]"
- "Break down this design: [URL]"

**Example**:
```
User: "What's in this design? https://figma.com/design/xyz789/Timesheets?node-id=12-34"

430-ux-designer:
Quick Summary: Timesheet approval interface with data table and action buttons.

Components:
- Table (Canvas Kit: Table)
- Filter dropdown (Canvas Kit: Select)
- Primary button "Approve" (Canvas Kit: PrimaryButton)
- Secondary button "Reject" (Canvas Kit: SecondaryButton)

Design Tokens:
- Colors: blue600, ink, paper
- Spacing: space.m (16px), space.s (8px)
- Typography: body.medium (14px)

[Analysis saved to /design/timesheets-analysis.md]
```

**What you get**:
- Component breakdown
- Canvas Kit mappings
- Design tokens (colors, spacing, typography)
- Design analysis document

**Output location**: `/design/[component-name]-analysis.md`

---

### 420-prototype-developer (Standalone)

**Use when**: You already have design specs and approved copy, and just need implementation.

**Trigger phrases**:
- "Implement this component using Canvas Kit"
- "Create a prototype for [component name]"
- "Build [component name] with Canvas Kit"
- "Implement the design spec from [file]"

**Example**:
```
User: "Implement a timesheet approval view using Canvas Kit. Here's the spec: [paste spec]"

420-prototype-developer:
[Implements component with:]
- Canvas Kit Table
- Canvas Kit Select for filter
- PrimaryButton for "Approve"
- SecondaryButton for "Reject"
- Loading, error, empty, success states
- Accessibility (keyboard nav, ARIA, focus)

[Code saved to /src/components/TimesheetApproval/]
[Docs saved to /design/timesheets-approval-implementation.md]
```

**What you get**:
- Production-ready Canvas Kit code
- TypeScript interfaces
- Accessibility implementation
- State management (loading, error, success)
- Implementation documentation

**Output location**: 
- Code: `/src/components/[ComponentName]/`
- Docs: `/design/[component-name]-implementation.md`

---

## 📋 Quick Reference: When to Use Which

| Your Goal | Agent(s) to Use | Example Request |
|-----------|----------------|-----------------|
| **Full design-to-code** | 420 → 410 → 430 | "Implement this Figma design: [URL]" |
| **Understand a design** | 420 only | "What's in this Figma file: [URL]" |
| **Review UI copy** | 410 only | "Review these error messages: [text]" |
| **Just implement** | 430 only | "Build [component] with Canvas Kit and this spec: [spec]" |
| **Design + copy review** (no code) | 420 → 410 | "Analyze [URL] and review the copy" |
| **Copy + implementation** (no Figma) | 410 → 430 | "Review copy then implement: [spec + text]" |

---

## 🎬 End-to-End Example

### Scenario: Implement a Timesheet Approval View from Figma

**Your request**:
```
"Implement this Figma design: https://figma.com/design/xyz789/Timesheets?node-id=12-34"
```

**What happens behind the scenes**:

#### Step 1: 430-ux-designer
```
Parsing Figma URL...
- fileKey: xyz789
- nodeId: 12:34

Calling get_design_context...
[Returns screenshot, generated code, hints]

Analyzing design...
✅ Components identified:
   - Table (Canvas Kit: Table)
   - Filter dropdown (Canvas Kit: Select)
   - Primary button (Canvas Kit: PrimaryButton)
   - Secondary button (Canvas Kit: SecondaryButton)

✅ Design tokens extracted:
   - Colors: blue600, ink, paper
   - Spacing: space.m, space.s
   - Typography: body.medium

✅ UI text extracted:
   - Button: "Approve"
   - Button: "Reject"  
   - Header: "Timesheet Approval"
   - Empty state: "No pending timesheets"

[Saved to /design/timesheets-analysis.md]

→ Handing off to 410-doc-writer for copy review...
```

#### Step 2: 410-doc-writer
```
Reviewing UI copy against Editorial Guidelines...

✅ Button: "Approve" - GOOD
   Sentence case ✓
   Action-oriented ✓
   Concise ✓

✅ Button: "Reject" - GOOD
   Sentence case ✓
   Action-oriented ✓
   Concise ✓

✅ Header: "Timesheet Approval" - GOOD
   Sentence case ✓
   Clear ✓

❌ Empty state: "No pending timesheets" - NEEDS IMPROVEMENT
   Issue: No call to action
   Recommended: "No pending timesheets. Check back later."

All copy approved with 1 improvement suggested.

→ Handing off to 420-prototype-developer for implementation...
```

#### Step 3: 420-prototype-developer
```
Implementing with Canvas Kit...

✅ Component structure planned:
   TimesheetApproval
   ├── FilterBar (Select)
   ├── Table
   └── ActionBar (PrimaryButton, SecondaryButton)

✅ Canvas Kit imports added:
   - @workday/canvas-kit-react/table
   - @workday/canvas-kit-react/select
   - @workday/canvas-kit-react/button
   - @workday/canvas-kit-react/banner

✅ States implemented:
   - Loading state
   - Error state
   - Empty state (with improved copy)
   - Success state

✅ Accessibility added:
   - Keyboard navigation
   - ARIA labels
   - Focus management
   - WCAG AA color contrast

✅ Code saved to:
   /src/components/TimesheetApproval/TimesheetApproval.tsx
   /src/components/TimesheetApproval/types.ts

✅ Documentation saved to:
   /design/timesheets-approval-implementation.md

✅ Validation:
   - Canvas Kit usage: PASS
   - Accessibility: PASS
   - Editorial guidelines: PASS
   - Performance: PASS

Implementation complete! 🎉
```

**Your result**:
- Design analysis document
- Copy review with improvements
- Production-ready Canvas Kit code
- Implementation documentation
- All accessibility requirements met

---

## 💡 Tips and Best Practices

### Tip 1: Be Explicit About Intent
- ✅ "Implement [URL]" → Full chain (420 → 410 → 430)
- ✅ "What's in [URL]" → 420 only
- ✅ "Review copy in [URL]" → 420 → 410 only

### Tip 2: You Can Skip Steps
If you already have design specs:
```
"Review this copy: [paste copy]"  → Skip 420, use 410 only
```

If you already have specs + approved copy:
```
"Implement this: [paste specs + copy]"  → Skip 420 + 410, use 430 only
```

### Tip 3: Use for Non-Figma Designs Too
The 410-doc-writer works with ANY UI text:
```
"Review these Slack messages for tone"
"Check if this PRD copy follows guidelines"
"Improve this slide deck text"
```

### Tip 4: Iterate on Individual Steps
You can ask for revisions at any stage:
```
After 420: "Can you extract more detail about the spacing?"
After 410: "What if we made the error message more friendly?"
After 430: "Add loading animations to the table"
```

### Tip 5: Check MISSION_LOG.md
The **000-master-orchestrator** logs all agent handoffs in `MISSION_LOG.md`. Check it to see the workflow progress.

---

## 🔧 Troubleshooting

### "I asked to implement but only got design analysis"
**Issue**: Request wasn't clear about implementation intent.
**Fix**: Use explicit implementation language:
- "Implement this design: [URL]"
- "Build a prototype from [URL]"

### "The copy review seems generic"
**Issue**: 410-doc-writer needs more context about the UI element.
**Fix**: Provide element type:
- "Review this **error message**: [text]"
- "Review this **empty state**: [text]"

### "Implementation doesn't match the design"
**Issue**: 430 might not have received the full design spec from 420.
**Fix**: Manually pass the design analysis:
- "Implement using this spec: [paste /design/[name]-analysis.md]"

### "I want to use a different order"
**Solution**: You can invoke in any order you want:
- 410 → 420 → 430 (copy first, then design, then implement)
- 420 → 430 (skip copy review if already approved)
- Just tell the agent what order you want!

---

## 📚 Related Documentation

- **Editorial Guidelines**: `/design/guidelines/EMEA-Editorial-Guidelines-February-2026.pdf`
- **Figma MCP**: `/Users/david.denham/.cursor/projects/.../mcps/plugin-figma-figma/server-instructions.md`
- **Canvas Kit MCP**: `/Users/david.denham/.cursor/projects/.../mcps/user-canvas-kit-mcp/`
- **Master Orchestrator**: `/Users/david.denham/product-manager-agent/.cursor/rules/000-master-orchestrator.mdc`

---

## 🎯 Summary

**3 agents. Infinite combinations.**

- **Use all 3** for full design-to-code: `"Implement [Figma URL]"`
- **Use 420** to understand designs: `"What's in [Figma URL]"`
- **Use 410** to review copy: `"Review this [UI text]"`
- **Use 430** to just implement: `"Build [component] with Canvas Kit"`

Each agent is specialized, autonomous, and can be used standalone or chained for maximum flexibility.
