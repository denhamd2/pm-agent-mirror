# HITL Workflow Verification: Story Map Approval BEFORE Jira Creation

**Date**: 18 March 2026
**Issue**: Ensure Jira stories are NOT created until AFTER human-in-the-loop review of story map
**Status**: ✅ VERIFIED AND ENHANCED

## Workflow Sequence (Correct Order)

### Step 1: Epic Creation (410-epic-definition)
**Action**: Create epic in Jira
**Jira Impact**: ✅ Epic created (HRREC-XXX)
**Human Approval**: Not required (epic creation is straightforward)

### Step 2: Story Mapping & HITL Approval (420-story-mapping)
**Action**: Create story map document and present for approval
**Jira Impact**: ❌ NO STORIES CREATED YET
**Human Approval**: ✅ REQUIRED BEFORE PROCEEDING

**What PM Reviews**:
1. Story map document path: `docs/story-maps/[epic-name]-story-map.md`
2. High-level structure:
   - Total activities
   - Total stories
   - Value slices with goals
3. **High-level story list** under each value slice:
   ```
   VS1: Compliance Foundation
   Goal: Reduce violations to <5%
   Stories (5):
     1. Validate KSA panel composition
     2. Validate Kuwait 3-day notice
     3. Display compliance warnings
     4. Log compliance checks
     5. Audit trail for compliance
   
   VS2: Recruiter Efficiency
   Goal: Decrease scheduling time by 30%
   Stories (4):
     1. Bulk panel selection
     2. Quick scheduling templates
     3. Keyboard shortcuts for scheduling
     4. Interview scheduling dashboard
   
   VS3: Candidate Experience
   Goal: Increase response rate to 80%
   Stories (3):
     1. WhatsApp notifications
     2. Self-service rescheduling
     3. Interview reminder preferences
   ```

**PM Options** (via `AskQuestion` tool):
- "Approve all - Create all stories in Jira (VS1, VS2, VS3)"
- "Approve VS1 only - Create only VS1 stories in Jira"
- "Request changes - Provide feedback on the story map first"

**CRITICAL NOTE**: The presentation explicitly states:
> "NO JIRA STORIES HAVE BEEN CREATED YET. This is the planning/review stage."

### Step 3: Story Writing & Jira Creation (430-story-writing)
**Action**: Create user stories in Jira with BDD scenarios
**Jira Impact**: ✅ STORIES CREATED (only for approved value slices)
**Human Approval**: Already completed in Step 2

**430's Responsibility**:
- Read approved story map
- Apply value slice filter from PM approval
- Consult Deployment Agent for Workday context
- Write stories with 2-4 BDD scenarios each
- Create stories in Jira with dual-field format
- Link to epic and label with value slice

**430 does NOT present for approval** - it assumes approval already happened in Step 2

## Key Safety Mechanisms

### In 420-story-mapping.mdc

**Line 234-236**:
```markdown
**CRITICAL**: Before handing off to story writing (430), present the story map to the PM for review.

**STOP and wait for user response. Do NOT proceed to story writing unless the user has explicitly approved. The pipeline is blocked until the user selects an option. Do NOT assume or default to approval.**
```

**Enhanced Presentation (lines 238-280)**:
- High-level story map structure
- Value slices with goals and story counts
- **Full list of story titles** under each value slice
- Explicit statement that NO JIRA STORIES CREATED YET
- Clear options for approval (all, VS1 only, or request changes)

### In 430-story-writing.mdc

**Lines 64-76** (Step 1: Read Context):
```markdown
**IMPORTANT**: This agent assumes the story map has ALREADY been approved by the PM in the HITL review (conducted by 420-story-mapping). This agent's job is to execute on the approved plan by creating Jira stories.

**This agent does NOT present for approval - that happens in 420-story-mapping BEFORE this agent is invoked.**
```

### In 400-backlog-refinement.mdc

**Step 2 description (lines 28-38)**:
```markdown
**HUMAN-IN-THE-LOOP**: 420 will present the story map structure with high-level story list for PM approval. 420 will use the `AskQuestion` tool to present:
- Story map overview (activities, total stories, value slices)
- High-level list of stories under each value slice
- **CRITICAL**: NO JIRA STORIES ARE CREATED YET - this is the planning/review stage

**Wait for approval** before proceeding to Step 3.
```

**Step 3 description (lines 40-47)**:
```markdown
**This step ONLY executes after PM approval in Step 2.** 430 creates Jira stories for the approved value slices only.
```

## Example Workflow Execution

### Scenario: GCC Interview Scheduling

**Step 1 - Epic Creation (410)**:
```
Input: GCC Interview Scheduling PRD
Output: Epic HRREC-125 created in Jira
Status: ✅ Epic exists in Jira
```

**Step 2 - Story Mapping & HITL (420)**:
```
Input: Epic HRREC-125, PRD
Action: 
  1. Create story map document
  2. Identify 3 value slices (VS1, VS2, VS3) with 12 total stories
  3. Present high-level structure to PM:
     
     "I've created the story map for GCC Interview Scheduling.
     
     Story Map: docs/story-maps/gcc-interview-scheduling-story-map.md
     
     Overview:
     - 5 activities across the user journey
     - 12 total stories identified
     - 3 value slices defined
     
     Value Slices:
     
     VS1: Compliance Foundation - Reduce violations to <5%
     Stories (5):
       1. Validate KSA panel composition
       2. Validate Kuwait 3-day notice
       3. Display compliance warnings
       4. Log compliance checks
       5. Audit trail for compliance
     
     VS2: Recruiter Efficiency - Decrease scheduling time by 30%
     Stories (4):
       1. Bulk panel selection
       2. Quick scheduling templates
       3. Keyboard shortcuts
       4. Interview scheduling dashboard
     
     VS3: Candidate Experience - Increase response rate to 80%
     Stories (3):
       1. WhatsApp notifications
       2. Self-service rescheduling
       3. Interview reminder preferences
     
     NO JIRA STORIES HAVE BEEN CREATED YET. This is the planning/review stage.
     
     Which value slices would you like me to create stories for in Jira?"
  
  4. PM selects: "Approve VS1 only"
  
Output: Story map approved for VS1 (5 stories)
Status: ❌ NO JIRA STORIES CREATED YET (only story map document exists)
```

**Step 3 - Story Writing (430)**:
```
Input: Story map (VS1 filter), Epic HRREC-125
Action:
  1. Read story map, filter for VS1 stories
  2. Consult Deployment Agent for Workday context
  3. Write 5 stories with 2-4 BDD scenarios each (14 scenarios total)
  4. Create stories in Jira:
     - HRREC-126: Validate KSA panel composition (3 scenarios)
     - HRREC-127: Validate Kuwait 3-day notice (3 scenarios)
     - HRREC-128: Display compliance warnings (2 scenarios)
     - HRREC-129: Log compliance checks (3 scenarios)
     - HRREC-130: Audit trail for compliance (3 scenarios)
  5. Link all stories to epic HRREC-125
  6. Label all stories with "VS1"

Output: 5 stories created in Jira under epic HRREC-125
Status: ✅ JIRA STORIES NOW EXIST (only for approved VS1)
```

## Verification Checklist

- ✅ Epic creation (410) happens BEFORE story map
- ✅ Story map (420) is created as a document BEFORE Jira stories
- ✅ HITL approval (420) presents high-level story structure to PM
- ✅ HITL approval includes full list of story titles under each value slice
- ✅ HITL approval explicitly states "NO JIRA STORIES CREATED YET"
- ✅ Story writing (430) ONLY executes after PM approval
- ✅ 430 creates Jira stories ONLY for approved value slices
- ✅ Workflow blocks at HITL until PM provides explicit approval

## Summary

The workflow is correctly structured with HITL approval BEFORE Jira story creation:

1. **410-epic-definition**: Creates epic in Jira (no approval needed)
2. **420-story-mapping**: Creates story map document → **HITL APPROVAL** → hands off to 430
3. **430-story-writing**: Creates stories in Jira (assumes approval already happened)

**PM reviews and approves the story map structure at a high level (story titles listed under each value slice) BEFORE any user stories are created in Jira under the epic.**
