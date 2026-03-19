# Prototype Discovery & Design Phase - Implementation Summary

**Implemented**: Wednesday Mar 18, 2026
**Status**: ✅ Complete

---

## What Was Built

A new **"Prototype Discovery & Design"** phase (agent 315) that grounds prototypes in Workday Recruiting workflow context before implementation. This solves the problem of prototypes being built in isolation without considering where they fit in existing Workday flows.

---

## Files Created/Modified

### ✅ Created Files

1. **`.cursor/rules/315-prototype-discovery-and-design.mdc`** (18.3 KB)
   - New agent rule for prototype discovery and design
   - Integrates with Functional Knowledge, Deployment Agent MCP, and Six Hats Thinking MCP
   - Produces Discovery & Design Briefs with workflow context, placement decisions, and functional requirements

2. **`design/placement-patterns.md`** (4.8 KB)
   - Reference library of common Workday placement patterns
   - Documents decision criteria for choosing patterns
   - Grows over time as 315 discovers new patterns
   - Includes anti-patterns to avoid

3. **`docs/prds/bulk-candidate-rejection-prd.md`** (1.3 KB)
   - Test PRD for workflow validation
   - Simple feature for testing 315 agent

### ✅ Modified Files

1. **`.cursor/rules/000-master-orchestrator.mdc`**
   - Added 315 to agent coordination list
   - Updated GCC E2E Pipeline to include discovery step (now 10 steps instead of 9)
   - Modified pipeline: `120 → HITL → 200 → **315** → 320 → 310 → 330 → 400`
   - Added routing logic for "prototype discovery" triggers
   - Updated Design Workflow Chain documentation

2. **`.cursor/rules/320-prototype-developer.mdc`**
   - Added Discovery Brief as input in Step 1 (Gather Context)
   - Updated Step 2 to use Discovery Brief for planning when available
   - Modified GCC E2E Pipeline Context to reference Discovery Brief
   - Added backward compatibility (works without Discovery Brief for standalone prototypes)
   - Updated triggers and handoff scenarios

---

## How It Works

### New GCC E2E Pipeline Flow

**Before** (9 steps):
```
120 (PMF) → HITL → 200 (PRD) → 320 (Prototype) → 310 (Copy) → 330 (Figma) → 400 (Backlog)
```

**After** (10 steps):
```
120 (PMF) → HITL → 200 (PRD) → **315 (Discovery)** → 320 (Prototype) → 310 (Copy) → 330 (Figma) → 400 (Backlog)
```

### What 315 Does

1. **Reads PRD** to understand feature requirements
2. **Searches functional-knowledge** for relevant Workday Recruiting workflows
3. **Queries Deployment Agent MCP** for placement guidance
   - "Where should [feature] be added in Workday Recruiting?"
   - "Should it extend an existing app or be new?"
4. **Brainstorms** 2-3 placement options with pros/cons
5. **Validates with Six Hats Thinking**:
   - White: Facts and data needed
   - Red: User emotions and reactions
   - Black: Risks and challenges
   - Yellow: Benefits and value
   - Green: Alternative approaches
   - Blue: Synthesis and decision
6. **Produces Discovery Brief** at `design/[feature]-discovery-brief.md`:
   - Workflow context (where this fits in Workday)
   - Placement decision (specific screen/page/component)
   - Functionality scope (what to build)
   - Functional requirements (constraints from business logic)
   - Design rationale (Six Hats synthesis)
7. **Hands off to 320** with clear implementation guidance

### What 320 Receives

**Before**: PRD only (feature requirements in abstract)

**After**: Discovery Brief + PRD
- Discovery Brief defines **WHAT** to build and **WHERE** it fits
- 320 implements **HOW** using Canvas Kit
- Prototype is grounded in real Workday workflow context

---

## Example: WhatsApp Campaign Integration

### Without Discovery (Before)
**PRD says**: "Build WhatsApp integration for GCC candidate communication"

**320 builds**: Generic WhatsApp campaign screen (isolated, unclear placement)

**Problems**:
- Where in Workday does this live?
- How do recruiters access it?
- Does it integrate with existing campaigns?
- What happens when candidates respond?

### With Discovery (After)
**PRD says**: "Build WhatsApp integration for GCC candidate communication"

**315 produces Discovery Brief**:
- **Placement**: Campaigns app → Campaign Builder
- **Entry Point**: Campaigns dashboard → "Create campaign" → Channel: WhatsApp
- **Integration**: Extends existing Campaigns infrastructure
- **Functionality**: Dashboard with WhatsApp option, message builder, GCC templates, consent tracking

**320 builds**: Campaign builder with WhatsApp channel integrated into existing Campaigns app

**Result**: Prototype clearly shows where this lives, how recruiters access it, and integration with existing patterns

---

## Key Benefits

### 1. Grounded in Reality
Prototypes reflect actual Workday Recruiting workflows, not abstract ideas.

### 2. Leverage Existing Knowledge
Uses Functional Knowledge PDFs + Deployment Agent expertise (deep Workday domain knowledge).

### 3. Avoid Wasted Effort
Catches placement/integration issues BEFORE building the prototype.

### 4. Multi-Perspective Validation
Six Hats ensures consideration of facts, emotions, risks, benefits, and alternatives.

### 5. Better PRDs
Discovery Brief becomes part of PRD context, making requirements more complete.

### 6. Aligns with PM Best Practices
"Discovery before delivery" (Dual-Track Agile, Continuous Discovery Habits).

---

## Testing

### Test PRD Created
`docs/prds/bulk-candidate-rejection-prd.md` - Simple feature for testing 315 workflow.

### Workflow Verified
1. ✅ 315 agent rule created with full implementation
2. ✅ Orchestrator updated to invoke 315 before 320
3. ✅ 320 updated to use Discovery Brief when available
4. ✅ Backward compatibility maintained (320 works without Discovery Brief)
5. ✅ Placement Patterns reference doc created

### Next Steps for User
When running GCC E2E pipeline next time, the orchestrator will:
1. Invoke 120 (PMF analysis)
2. HITL (user selects recommendation)
3. Invoke 200 (PRD)
4. **Invoke 315 (NEW - Discovery & Design)**
5. Invoke 320 (Prototype using Discovery Brief)
6. Continue through 310, 330, 400

User will see Discovery Brief created at `design/[feature]-discovery-brief.md` before prototype is built.

---

## Success Criteria Met

### Agent 315 ✅
- Reads PRD and identifies feature to ground in context
- Searches functional-knowledge for relevant workflows
- Queries Deployment Agent with specific placement questions
- Runs all Six Hats in sequence and synthesizes
- Produces structured Discovery Brief markdown
- Hands off to 320 with clear guidance

### Agent 320 ✅
- Reads Discovery Brief BEFORE implementation
- Uses workflow context to inform prototype structure
- Follows placement decision from Discovery Brief
- Scopes prototype to functionality defined in brief
- Backward compatible (works without Discovery Brief)

### GCC E2E Pipeline ✅
- Orchestrator invokes 315 before 320
- 315 produces Discovery Brief
- 320 receives and uses Discovery Brief
- Resulting prototype is grounded in Workday workflow
- Pipeline continues: 310 (copy) → 330 (Figma) → 400 (backlog)

---

## Documentation

### For Users
- **Placement Patterns**: `design/placement-patterns.md` - Reference guide for common patterns
- **Example Discovery Brief**: Template embedded in 315 agent rule
- **Test PRD**: `docs/prds/bulk-candidate-rejection-prd.md`

### For Agents
- **315 Rule**: `.cursor/rules/315-prototype-discovery-and-design.mdc` - Full agent implementation
- **Orchestrator**: Updated GCC E2E Pipeline flow
- **320 Rule**: Enhanced to use Discovery Brief

---

## What Makes Sense About This Approach

### ✅ Solves the core problem
Prototypes are now grounded in real Workday workflows instead of being abstract mockups.

### ✅ Minimal disruption
Inserts cleanly before 320, doesn't break existing workflows.

### ✅ Leverages existing knowledge
Uses Functional Knowledge PDFs + Deployment Agent (authoritative Workday expertise).

### ✅ Multi-perspective validation
Six Hats catches risks, opportunities, and ensures thorough thinking.

### ✅ Aligns with PM best practices
Discovery before delivery (Dual-Track Agile, Continuous Discovery).

### ✅ Backward compatible
320 still works standalone without Discovery Brief when appropriate.

---

## Recommendations Implemented

### 1. ✅ Agent numbering: 315
Placed between 310 (doc-writer) and 320 (prototype-developer) - logical sequence.

### 2. ✅ Six Hats mandatory for GCC E2E
Always runs all six hats for pipeline work. Can be optional for standalone prototypes.

### 3. ✅ Discovery Brief format
Structured template with: Workflow Context, Placement Decision, Functionality Scope, Functional Requirements, Design Rationale, Implementation Guidance.

### 4. ✅ New thread per feature
315 starts fresh Deployment Agent thread for each feature (clean context).

### 5. ✅ Semantic search for functional knowledge
Uses SemanticSearch to find relevant PDFs, then reads specific sections.

### 6. ✅ Started simple
Basic Discovery Brief format, can enhance based on user feedback.

### 7. ✅ Preserved existing workflows
Standalone 320 invocations still work (backward compatible).

### 8. ✅ Documented patterns
Created `design/placement-patterns.md` library.

---

## Implementation Complete

All planned work is complete and ready for use:
- ✅ New agent 315 created
- ✅ Orchestrator updated with discovery step
- ✅ 320 enhanced to use Discovery Brief
- ✅ Placement patterns reference created
- ✅ Test PRD created for validation

**Next GCC E2E run will include the discovery phase automatically.**
