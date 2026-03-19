# ✅ Design Workflow Modularization - Complete

**Date**: March 18, 2026  
**Task**: Split 400-design-and-prototype.mdc into 3 specialized agents

> **Note (updated)**: Rule numbers were later swapped for prototype-first workflow: Prototype Developer is now **420**, UX Designer is now **430**. See DESIGN-WORKFLOW-GUIDE.md for current workflow.

---

## What Changed

### Before: Single Monolithic Rule
**400-design-and-prototype.mdc** (444 lines)
- Did everything: Figma analysis, UX writing, Canvas Kit implementation
- Users had to go through all 9 steps even if they only needed one capability
- Hard to maintain and update individual specializations

### After: 3 Modular Specialists

#### 410-doc-writer.mdc (NEW)
**Purpose**: Review UI copy against Workday Editorial Guidelines  
**Standalone use**: ✅ Yes  
**Size**: 350+ lines

**Key capabilities**:
- Review button labels, error messages, empty states, etc.
- Apply Editorial Guidelines (sentence case, concise, action-oriented)
- Provide copy recommendations with rationale
- Works with ANY UI text (not just Figma designs)

**Trigger phrases**:
- "Review the copy in this design"
- "Check if these button labels follow guidelines"
- "Improve these error messages"

#### 430-ux-designer.mdc (formerly 420)
**Purpose**: Extract design context from Figma files, capture prototypes to Figma  
**Standalone use**: ✅ Yes  
**Size**: 400+ lines

**Key capabilities**:
- Parse Figma URLs (fileKey, nodeId)
- Call Figma MCP to get design context
- Identify UI components and map to Canvas Kit
- Extract design tokens (colors, spacing, typography)
- Document design specifications

**Trigger phrases**:
- "What's in this Figma file: [URL]"
- "Analyze this design: [URL]"
- "Extract design tokens from [URL]"

#### 420-prototype-developer.mdc (formerly 430)
**Purpose**: Implement production-ready Canvas Kit prototypes (first in prototype-first flow)  
**Standalone use**: ✅ Yes  
**Size**: 650+ lines

**Key capabilities**:
- Implement components using Canvas Kit
- Apply design tokens (not hardcoded values)
- Handle all states (loading, error, empty, success)
- Ensure accessibility (WCAG AA, keyboard nav, ARIA)
- Create Code Connect mappings
- Validate with Deployment Agent

**Trigger phrases**:
- "Implement this component using Canvas Kit"
- "Create a prototype for [component name]"
- "Build [component] with Canvas Kit"

---

## How to Use Them Together

### Full Design-to-Code Pipeline (Chained)

**Single request triggers all 3**:
```
"Implement this Figma design: https://figma.com/design/xyz789/Timesheets?node-id=12-34"
```

**Workflow** (design-first when Figma URL provided):
1. **430-ux-designer** → Extracts design context, components, tokens
2. **410-doc-writer** → Reviews all UI copy, suggests improvements
3. **420-prototype-developer** → Implements with Canvas Kit

**Result**:
- `/design/timesheets-analysis.md` (design spec)
- Copy review with recommendations (inline)
- `/src/components/TimesheetApproval/` (production code)
- `/design/timesheets-approval-implementation.md` (docs)

### Individual Agent Usage

**430 only** (just analyze):
```
"What's in this Figma file: [URL]"
```

**410 only** (just review copy):
```
"Review these error messages: [paste text]"
```

**420 only** (just implement):
```
"Implement this component using Canvas Kit and this spec: [paste spec]"
```

---

## Files Created

### New Rules
✅ `/Users/david.denham/product-manager-agent/.cursor/rules/410-doc-writer.mdc`  
✅ `/Users/david.denham/product-manager-agent/.cursor/rules/420-prototype-developer.mdc`  
✅ `/Users/david.denham/product-manager-agent/.cursor/rules/430-ux-designer.mdc`

### Documentation
✅ `/Users/david.denham/product-manager-agent/design/DESIGN-WORKFLOW-GUIDE.md`
   - Complete guide on how to use each agent
   - Examples of chaining agents together
   - Troubleshooting tips
   - Quick reference table

### Editorial Guidelines
✅ `/Users/david.denham/product-manager-agent/design/guidelines/EMEA-Editorial-Guidelines-February-2026.pdf`
   - Copied from user's workspace
   - Referenced by 410-doc-writer

---

## Files Updated

### Master Orchestrator
✅ **000-master-orchestrator.mdc**
- Updated agent list (410, 420, 430 instead of 400)
- Added "Design Workflow Chain" section
- Added routing logic for Figma URLs
- Added standalone invocation patterns

### Execution Planner
✅ **300-execution-planner.mdc**
- Updated handoff: "420 → 410 → 430" instead of "400"

### Functional Knowledge
✅ **050-functional-knowledge.mdc**
- Updated integration: "420, 410, 430" instead of "400"
- Added UX terminology validation for 410

### PRD Writer
✅ **200-prd-writer.mdc**
- Added handoff scenario from design agents (420/410/430)

---

## Files Deleted

❌ **400-design-and-prototype.mdc** (13,965 bytes)
   - Replaced by 410, 420, 430

---

## Benefits of Modularization

### ✅ Granular Invocation
Run just UX writing without implementing anything:
```
"Review the copy in this PRD"  → 410 only
```

### ✅ Clear Specialization
Each rule has one job and does it well:
- 410 = Copy expert
- 420 = Design analyst
- 430 = Canvas Kit developer

### ✅ Reusable Components
Doc Writer (410) can now review:
- Figma designs
- PRDs
- Slack messages
- Slide decks
- Any UI text!

### ✅ Better Triggers
More specific activation patterns:
- "Review copy" → 410
- "Analyze design" → 420
- "Implement" → 430
- "Implement [Figma URL]" → 420 → 410 → 430

### ✅ Easier Maintenance
Update UX guidelines without touching Canvas Kit logic.
Update Figma analysis without touching implementation code.

### ✅ Parallel Execution (Future)
Could run UX review and Figma analysis simultaneously for faster workflows.

### ✅ Cleaner Handoffs
Explicit orchestration by 000-master-orchestrator:
```
User shares Figma URL → 000 routes to 420 → 410 → 430
```

---

## Usage Examples

### Example 1: Full Chain
**Request**: "Implement this Figma design: [URL]"  
**Agents**: 420 → 410 → 430  
**Output**: Design spec + Copy review + Canvas Kit code

### Example 2: Just Analyze
**Request**: "What's in this Figma file: [URL]"  
**Agents**: 420 only  
**Output**: Design analysis document

### Example 3: Just Copy Review
**Request**: "Review these button labels: [paste text]"  
**Agents**: 410 only  
**Output**: Copy recommendations

### Example 4: Just Implementation
**Request**: "Build this component using Canvas Kit: [paste spec + copy]"  
**Agents**: 430 only  
**Output**: Canvas Kit code + documentation

### Example 5: Skip Implementation
**Request**: "Analyze [URL] and review the copy, but don't implement yet"  
**Agents**: 420 → 410  
**Output**: Design spec + Copy review (no code)

---

## Next Steps for User

1. **Read the guide**:
   ```
   open /Users/david.denham/product-manager-agent/design/DESIGN-WORKFLOW-GUIDE.md
   ```

2. **Try standalone agents**:
   - "Review this error message: [text]" → Tests 410
   - "What's in this Figma file: [URL]" → Tests 420

3. **Try the full chain**:
   - "Implement this Figma design: [URL]" → Tests 420 → 410 → 430

4. **Check MISSION_LOG.md**:
   - See how 000-master-orchestrator logs agent handoffs

---

## Technical Details

### Globs Configuration
- **410-doc-writer**: `design/**/*`, `docs/prds/**/*`, `**/*.md`
- **420-prototype-developer**: `design/**/*`, `**/*.tsx`, `**/*.jsx`
- **430-ux-designer**: `design/**/*`

### MCP Integration
All agents use:
- **Figma MCP** (`plugin-figma-figma`) - 420, 430
- **Canvas Kit MCP** (`user-canvas-kit-mcp`) - 420, 430
- **Deployment Agent** (`user-deployment-agent`) - 430
- **Editorial Guidelines PDF** - 410

### Cross-Agent Communication
Agents communicate through:
1. **Handoff messages** in chat
2. **MISSION_LOG.md** entries (via 000-master-orchestrator)
3. **Shared file outputs** (`/design/[name]-analysis.md`, etc.)

---

## Validation

### ✅ All old 400 references updated
- 000-master-orchestrator.mdc
- 300-execution-planner.mdc
- 050-functional-knowledge.mdc
- 200-prd-writer.mdc

### ✅ No broken references
```bash
grep -r "400-design-and-prototype\|400-canvas-designer" .cursor/rules/
# → No results (all updated)
```

### ✅ All new agents have proper structure
- Description
- Globs
- Your Role
- MCP Integration
- Workflow steps
- Triggers
- Handoff scenarios
- Example usage

### ✅ Documentation complete
- DESIGN-WORKFLOW-GUIDE.md covers all use cases
- Examples for standalone and chained usage
- Troubleshooting section included

---

## Summary

**Before**: 1 monolithic rule (400) doing 3 jobs  
**After**: 3 specialized rules (410, 420, 430) each doing 1 job well

**Impact**: 
- ✅ More flexible (use individually or chain together)
- ✅ More maintainable (update one without affecting others)
- ✅ More discoverable (clear triggers for each)
- ✅ More reusable (410 works beyond just Figma designs)

**User benefit**: Can now say exactly what they want and get just that, or chain the full pipeline with a single request.

🎉 **Modularization complete!**
