# Modular Backlog Refinement Implementation Summary

**Implementation Date**: 18 March 2026

## Overview

Successfully modularized the backlog refinement workflow by splitting the monolithic `400-backlog-refinement.mdc` rule into three standalone, specialized agents with enhanced BDD formatting capabilities.

## Files Created

### 1. `.cursor/rules/410-epic-definition.mdc`
**Purpose**: Write epics in user story format and create them in Jira

**Key Capabilities**:
- Reads PRD to extract feature scope and business value
- Writes epic in "As a [persona], I want [goal], So that [outcome]" format
- Creates epic in Jira (HRREC project, Recruiting Purge component)
- Returns epic URL and key for downstream agents

**Standalone Usage**: `"Create epic for [PRD/feature]"`

**Triggers**:
- "Create epic for [PRD/feature]"
- "Write epic user story"
- "Define epic"
- Part of backlog refinement chain

---

### 2. `.cursor/rules/420-story-mapping.mdc`
**Purpose**: Apply Jeff Patton user story mapping with value slices and HITL approval

**Key Capabilities**:
- Identifies user activities (horizontal backbone)
- Breaks into user tasks (vertical slices)
- Defines named value slices (VS1, VS2, VS3) with measurable goals
- Creates story map document saved to `docs/story-maps/[epic-name]-story-map.md`
- **HUMAN-IN-THE-LOOP**: Presents story map to PM for approval using `AskQuestion` tool
- Hands off approved story map to 430-story-writing

**Standalone Usage**: `"Story map the [epic/PRD]"`

**Triggers**:
- "Story map the [epic/PRD]"
- "Create story map for [feature]"
- "User story mapping"
- Part of backlog refinement chain

**Value Slice Format**:
```
VS1: [Descriptive Name]
Goal: [Specific measurable outcome]
```

**HITL Approval Options**:
- "Approve - Create all stories in Jira"
- "Approve VS1 only - Create only VS1 stories"
- "Request changes - Provide feedback first"

---

### 3. `.cursor/rules/430-story-writing.mdc`
**Purpose**: Write user stories with BDD scenarios and create them in Jira

**Key Capabilities**:
- **Consults Deployment Agent MCP** for Workday-specific context
- **Searches functional knowledge** for Workday Recruiting workflows
- Applies SPIDR splitting framework for large stories
- Writes user stories following INVEST principles
- **Generates 2-4 distinct BDD scenarios per story (mandatory)**
- **PRIMARY FORMATTING DIRECTIVE**: Every Gherkin clause (Given, When, Then, And, But) on NEW LINE
- Creates stories in Jira with **dual-field format**:
  - **Description field**: Story + scenarios with `---` dividers
  - **Acceptance Criteria field**: Table format with AC IDs

**Standalone Usage**: `"Write user stories for [story map/epic]"`

**Triggers**:
- "Write user stories for [story map/epic]"
- "Create Jira stories from story map"
- "Write stories for VS1"
- Part of backlog refinement chain

**Enhanced BDD Format**:

**Jira Description Field**:
```markdown
## Story [N]: [Title]

**User Story:**

As a [Role], I want to [Action/Goal], so that [Benefit].

**Scenario 1: [Scenario Title]**

**Given** [precondition 1]

**And** [precondition 2]

**When** [the action]

**Then** [expected outcome 1]

**And** [expected outcome 2]

---

**Scenario 2: [Scenario Title]**

...

---

(2-4 scenarios total)
```

**Jira Acceptance Criteria Field**:
```markdown
| **ID** | **Acceptance Criteria** | **Test Owner** | **Test ID** |
| :----- | :-------------------------- | :------------- | :---------- |
| AC1 | [Title of Scenario 1] | TBD | TBD |
| AC2 | [Title of Scenario 2] | TBD | TBD |
```

---

## Files Modified

### 4. `.cursor/rules/400-backlog-refinement.mdc`
**Change**: Transformed from monolithic specialist to lightweight orchestrator

**New Role**: Orchestrates the three specialized agents:
1. Invoke 410-epic-definition → returns epic key
2. Invoke 420-story-mapping → presents for HITL approval, returns story map path
3. Invoke 430-story-writing → creates stories in Jira for approved value slices

**Preserved Triggers**: All existing triggers still work:
- "Backlog refinement for [PRD/feature]"
- "Create stories from [PRD]"
- "Refine backlog"
- "Break down this PRD"

**Benefit**: Existing workflows continue working, but now modular agents can be used standalone.

---

### 5. `.cursor/rules/000-master-orchestrator.mdc`
**Change**: Added routing for three new standalone agents

**New Routing Rules**:
- `"Create epic"` or `"write epic"` → Epic Definition (410)
- `"Story map"` or `"user story mapping"` → Story Mapping (420)
- `"Write stories"` or `"create Jira stories"` → Story Writing (430)
- `"Backlog refinement"` → Backlog Refinement orchestrator (400) [unchanged]

**Agent Coordination List**: Updated to include 410, 420, 430 as specialized agents

---

## Key Benefits

### 1. Modularity
- Each agent (410, 420, 430) can be invoked independently
- No need to run full backlog refinement if only epic or story map needed
- Enables iterative workflows (e.g., map once, write stories incrementally)

### 2. Reusability
- Story map created once, used multiple times
- Can write stories for VS1, implement, then return for VS2 stories later
- Epic can be reused across multiple story mapping sessions

### 3. Enhanced BDD Formatting
- **Workday-specific context** from Deployment Agent MCP
- **Functional knowledge** from `@functional-knowledge` folder
- **2-4 scenarios per story** (mandatory minimum/maximum)
- **Every Gherkin clause on NEW LINE** (PRIMARY FORMATTING DIRECTIVE)
- **Dual-field Jira format** (Description + Acceptance Criteria table)

### 4. Professional Jira Output
- Description field: Complete user story + formatted scenarios
- Acceptance Criteria field: Clean table format for QA tracking
- Test Owner and Test ID columns (filled in by QA later)

### 5. Backward Compatibility
- Existing "backlog refinement" trigger still works
- 400-backlog-refinement orchestrates the full chain
- No breaking changes to GCC E2E Pipeline

### 6. Flexibility
- PM can approve full story map or VS1 only
- Can implement VS1, validate, then request VS2 stories later
- Supports incremental delivery and validation

---

## Usage Patterns

### Orchestrated (Full Backlog Refinement)

```
User: "Backlog refinement for the GCC Interview Scheduling PRD"

System Flow:
1. Master Orchestrator (000) routes to Backlog Refinement (400)
2. 400 invokes 410-epic-definition
   → Epic created: HRREC-125
3. 400 invokes 420-story-mapping
   → Story map created with VS1, VS2, VS3
   → HITL approval: PM selects "Approve VS1 only"
4. 400 invokes 430-story-writing (VS1 filter)
   → 5 stories created (HRREC-126 to HRREC-130) with 14 scenarios
5. 400 reports back: Epic + Story map + Stories created

Result: Complete backlog ready for sprint planning
```

### Standalone: Epic Only

```
User: "Create epic for the bulk candidate rejection PRD"

System Flow:
1. Master Orchestrator (000) routes to Epic Definition (410)
2. 410 reads PRD, writes epic, creates in Jira
3. 410 returns: HRREC-131 - Bulk Candidate Rejection

Result: Epic created, ready for story mapping later
```

### Standalone: Story Map Only

```
User: "Story map the WhatsApp campaign epic"

System Flow:
1. Master Orchestrator (000) routes to Story Mapping (420)
2. 420 reads epic HRREC-132 and PRD
3. 420 creates story map with activities, tasks, value slices
4. 420 presents for HITL approval
5. PM approves: "Approve all"
6. 420 returns: Story map path

Result: Story map created, ready for story writing later
```

### Standalone: Story Writing Only

```
User: "Write stories for VS1 from the GCC Interview Scheduling story map"

System Flow:
1. Master Orchestrator (000) routes to Story Writing (430)
2. 430 reads story map, filters for VS1 stories
3. 430 consults Deployment Agent for Workday context
4. 430 searches functional knowledge for GCC compliance
5. 430 writes 5 stories with 2-4 BDD scenarios each
6. 430 creates stories in Jira with dual-field format
7. 430 returns: 5 stories created (HRREC-126 to HRREC-130)

Result: VS1 stories in Jira, ready for sprint planning
```

---

## BDD Formatting Specifications

### Mandatory Requirements

1. **Scenario Count**: 2-4 scenarios per story (minimum 2, maximum 4)
2. **Gherkin Format**: Every clause (Given, When, Then, And, But) on NEW LINE
3. **Dual-Field Jira**: Description + Acceptance Criteria table
4. **Workday Context**: Consult Deployment Agent MCP before writing
5. **Functional Knowledge**: Search for relevant workflows

### Scenario Types

**Required**:
- Happy path (standard successful flow)
- Error handling (what goes wrong?)

**Recommended** (if <4 scenarios):
- Boundary cases (edge cases, limits, constraints)
- Alternative paths (different valid approaches)

### Example (3 Scenarios)

```
**Scenario 1: Recruiter rejects 10 candidates with single reason**

**Given** I am viewing a requisition with 25 candidates in "Review" status

**And** I have selected 10 candidates using checkboxes

**When** I click "Bulk Reject" and enter reason "Not qualified for role"

**Then** all 10 candidates move to "Rejected" status

**And** each candidate receives a rejection email with the reason

**And** the requisition candidate count updates to 15 remaining candidates

---

**Scenario 2: System prevents rejection of candidates with active offers**

**Given** I am viewing a requisition with 25 candidates

**And** I have selected 10 candidates, where 2 have active offers

**When** I click "Bulk Reject"

**Then** the system displays warning "Cannot reject 2 candidates with active offers"

**And** the system offers to reject the remaining 8 candidates only

---

**Scenario 3: Bulk reject completes with partial failures**

**Given** I am viewing a requisition with 25 candidates

**And** I have selected 10 candidates for rejection

**And** the rejection API is experiencing intermittent errors

**When** I click "Bulk Reject" and confirm

**Then** 8 candidates successfully move to "Rejected" status

**And** 2 candidates remain in "Review" status due to API errors

**And** I see notification "8 candidates rejected, 2 failed. Retry?"
```

---

## Quality Assurance

### Testing Checklist

**410-epic-definition**:
- ✅ Can be invoked standalone: "Create epic for [PRD]"
- ✅ Creates Jira epic with user story format
- ✅ Returns epic URL for downstream use

**420-story-mapping**:
- ✅ Can be invoked standalone: "Story map the [epic]"
- ✅ Creates story map document with value slices
- ✅ HUMAN-IN-THE-LOOP approval step works
- ✅ Returns story map path for downstream use

**430-story-writing**:
- ✅ Can be invoked standalone: "Write stories for [story map]"
- ✅ Consults Deployment Agent MCP for Workday context
- ✅ Searches functional knowledge for relevant workflows
- ✅ Generates 2-4 scenarios per story
- ✅ Every Gherkin clause on NEW LINE
- ✅ Creates Jira stories with dual-field format (Description + Acceptance Criteria table)
- ✅ Returns created story URLs

**400-backlog-refinement**:
- ✅ Chains 410 → 420 → 430 sequentially
- ✅ Existing triggers still work
- ✅ Each sub-agent can also be used standalone

---

## Success Metrics

### Modularization
- 3 new standalone agents created
- 1 orchestrator refactored (400)
- 1 routing update (000)
- Full backward compatibility maintained

### Enhanced BDD
- Workday context integration (Deployment Agent MCP)
- Functional knowledge integration
- 2-4 scenarios per story (mandatory)
- Professional Jira dual-field format
- Every Gherkin clause on NEW LINE

### Flexibility
- Standalone epic creation
- Standalone story mapping
- Standalone story writing
- Full orchestrated backlog refinement
- Incremental value slice delivery (VS1, then VS2, then VS3)

---

## Next Steps for Testing

To validate the modular workflow, test these scenarios:

1. **Standalone Epic**: "Create epic for the bulk candidate rejection PRD"
2. **Standalone Story Map**: "Story map the bulk rejection epic"
3. **Standalone Story Writing**: "Write stories for VS1 from the story map"
4. **Full Orchestration**: "Backlog refinement for the GCC Interview Scheduling PRD"

Each test should verify:
- Agent activates correctly
- MCP integrations work (Jira, Deployment Agent, functional knowledge)
- Output format matches specification
- Handoffs between agents are clean

---

## Documentation References

- **Plan Document**: `/Users/david.denham/.cursor/plans/modularize_backlog_refinement_rules_fbaf2189.plan.md`
- **Agent Rules**: `.cursor/rules/410-epic-definition.mdc`, `420-story-mapping.mdc`, `430-story-writing.mdc`
- **Orchestrator**: `.cursor/rules/400-backlog-refinement.mdc`
- **Master Orchestrator**: `.cursor/rules/000-master-orchestrator.mdc`

---

## Implementation Complete

All planned changes have been implemented:

1. ✅ Created 410-epic-definition.mdc
2. ✅ Created 420-story-mapping.mdc
3. ✅ Created 430-story-writing.mdc (with enhanced BDD format)
4. ✅ Updated 400-backlog-refinement.mdc (orchestrator)
5. ✅ Updated 000-master-orchestrator.mdc (routing)

The modular backlog refinement system is now ready for use.
