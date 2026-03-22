# HITL Workflow Verification: Story Map Approval BEFORE Jira Creation

**Date**: 18 March 2026
**Issue**: Ensure Jira stories are NOT created until AFTER human-in-the-loop review of story map
**Status**: ✅ VERIFIED AND ENHANCED

## Workflow Sequence (Correct Order)

### Step 1: Epic draft (410-epic-definition)
**Action**: Write epic draft markdown to `docs/epics/*-epic-draft.md` (user story, scope, Jira-ready body)
**Jira Impact**: ❌ No Jira ticket yet
**Human Approval**: Not required (draft only)

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
- "Approve all - Create Jira epic + all stories (VS1, VS2, VS3)"
- "Approve VS1 only - Create Jira epic + VS1 stories only"
- "Request changes - Provide feedback on the story map first"

**CRITICAL NOTE**: The presentation explicitly states:
> "NO JIRA STORIES HAVE BEEN CREATED YET. This is the planning/review stage."  
> (Epic in Jira is also created only in **430**, after this approval.)

### Step 3: Epic + story writing & Jira creation (430-story-writing)
**Action**: Create **Jira epic** from the 410 draft (unless reusing a legacy epic key on the story map), then create user stories with BDD scenarios
**Jira Impact**: ✅ Epic + stories created (only for approved value slices)
**Human Approval**: Already completed in Step 2

**430's Responsibility**:
- Read approved story map and epic draft path
- Create Jira epic via MCP (or reuse existing key documented on the story map)
- Apply value slice filter from PM approval
- Consult Deployment Agent for Workday context
- Write stories with 2-4 BDD scenarios each
- Create stories in Jira with dual-field format
- Link stories to epic and label with value slice

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

**Step 1 / Step 1b**: Requires 420 HITL approval first; then **creates the Jira epic** from the epic draft (410 output) before creating stories. **410 does not call Jira.**

### In 400-backlog-refinement.mdc

**Step 2 description (lines 28-38)**:
```markdown
**HUMAN-IN-THE-LOOP**: 420 will present the story map structure with high-level story list for PM approval. 420 will use the `AskQuestion` tool to present:
- Story map overview (activities, total stories, value slices)
- High-level list of stories under each value slice
- **CRITICAL**: NO JIRA STORIES ARE CREATED YET - this is the planning/review stage

**Wait for approval** before proceeding to Step 3.
```

**Step 3 description**:
```markdown
**This step ONLY executes after PM approval in Step 2.** 430 creates the **Jira epic** from the draft, then creates stories for the approved value slices only.
```

## Example Workflow Execution

### Scenario: GCC Interview Scheduling

**Step 1 - Epic draft (410)**:
```
Input: GCC Interview Scheduling PRD
Output: docs/epics/gcc-interview-scheduling-epic-draft.md
Status: ✅ Draft on disk; no Jira yet
```

**Step 2 - Story Mapping & HITL (420)**:
```
Input: Epic draft path, PRD
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
     
     Which value slices would you like me to create Jira epic + stories for?"
  
  4. PM selects: "Approve VS1 only"
  
Output: Story map approved for VS1 (5 stories)
Status: ❌ NO JIRA EPIC OR STORIES YET (only story map document exists)
```

**Step 3 - Epic + story writing (430)**:
```
Input: Story map (VS1 filter), epic draft path
Action:
  1. Create Jira epic HRREC-125 from epic draft (createNewJiraTicket, issueType Epic)
  2. Read story map, filter for VS1 stories
  3. Consult Deployment Agent for Workday context
  4. Write 5 stories with 2-4 BDD scenarios each (14 scenarios total)
  5. Create stories in Jira:
     - HRREC-126: Validate KSA panel composition (3 scenarios)
     - HRREC-127: Validate Kuwait 3-day notice (3 scenarios)
     - HRREC-128: Display compliance warnings (2 scenarios)
     - HRREC-129: Log compliance checks (3 scenarios)
     - HRREC-130: Audit trail for compliance (3 scenarios)
  6. Link all stories to epic HRREC-125
  7. Label all stories with "VS1"

Output: Epic HRREC-125 + 5 stories in Jira (approved VS1 only)
Status: ✅ JIRA EPIC AND STORIES NOW EXIST
```

## Verification Checklist

- ✅ Epic **draft** (410) happens BEFORE story map
- ✅ Story map (420) is created as a document BEFORE any Jira epic or stories
- ✅ HITL approval (420) presents high-level story structure to PM
- ✅ HITL approval includes full list of story titles under each value slice
- ✅ HITL approval explicitly states no Jira stories yet (and epic is still pending until 430)
- ✅ Story writing (430) ONLY executes after PM approval
- ✅ 430 creates **Jira epic + stories** ONLY after approval (stories only for approved value slices)
- ✅ Workflow blocks at HITL until PM provides explicit approval

## Summary

The workflow is correctly structured with HITL approval BEFORE any Jira epic or story creation:

1. **410-epic-definition**: Writes epic draft to `docs/epics/` (no Jira)
2. **420-story-mapping**: Creates story map document → **HITL APPROVAL** → hands off to 430
3. **430-story-writing**: Creates **Jira epic** from draft, then creates stories (assumes approval already happened)

**PM reviews and approves the story map structure at a high level (story titles listed under each value slice) BEFORE the Jira epic and user stories are created.**
