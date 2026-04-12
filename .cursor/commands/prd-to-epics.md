# PRD to JIRA Epics Generator

## Description

As an expert Principal Product Manager, convert a PRD (Product Requirements Document) into properly formatted JIRA epics. This command is optimized for PRDs created with `{{PREFIX}}prd-draft` but also supports existing PRDs from other sources.

## Workflow Context

This command is part of the PRD-to-JIRA pipeline:

```
{{PREFIX}}prd-init → {{PREFIX}}prd-draft → {{PREFIX}}prd-to-epics (YOU ARE HERE) → {{PREFIX}}prd-to-jira-stories → {{PREFIX}}prd-to-mockups
```

**Important**:
- If the PRD was created with `{{PREFIX}}prd-draft`, Epics are already defined as "Key Feature" sections with user stories grouped in tables. This command will **extract** them, not re-discover them.
- The "Child User Stories" documented in each Epic are for reference. To create actual JIRA story tickets linked to these epics, run `{{PREFIX}}prd-to-jira-stories` after this command completes.

## Configuration

**CRITICAL: Read configuration file first**

Before starting, read the configuration file at `.prd-to-jira/config.json` in the current workspace. This file contains:
- JIRA project key
- Components array
- Default assignee
- Team field settings (fieldId, teamId, teamName)
- Default labels

If the config file doesn't exist, prompt the user to run `{{PREFIX}}prd-init` first to set up configuration.

Use these config values throughout the command instead of hardcoded values. If a value is missing from config, use the defaults shown below but inform the user they should run `{{PREFIX}}prd-init` to configure properly.

**Default values (if config missing):**
- `projectKey`: "CMTYAEM"
- `components`: ["Integration"]
- `defaultAssignee`: "akash.majumder"
- `teamField.fieldId`: "customfield_13400"
- `teamField.teamId`: "3320"
- `teamField.teamName`: "CMTY Globetrotters"
- `defaultLabels`: ["cmty-auth-gemini"]
- `epicTemplateReference`: "CMTYAEM-5481" (Best Practices Reference Guide)

## Instructions

### Step 1: Read Configuration

- Read `.prd-to-jira/config.json` from the current workspace
- Extract all JIRA settings (projectKey, components, assignee, team, labels)
- If config doesn't exist, inform user and use defaults (but recommend running `{{PREFIX}}prd-init`)

### Step 2: Accept PRD Input

- Ask the user for the PDF file path if not provided
- Read the PDF content using appropriate tools

### Step 3: Detect PRD Type and Extract Epics

**Determine if this PRD was created with `{{PREFIX}}prd-draft`:**

Look for these indicators of a `{{PREFIX}}prd-draft` PRD:
- "Key Feature #1", "Key Feature #2", etc. section headers
- HTML tables with columns: JIRA | Epic | Priority | Functional User Story | Theme / Component | Acceptance Criteria
- "FY27 Community Objectives Alignment" section
- Structured sections: Business Background, Vision, Business Outcomes, Success Metrics, Features Overview, Requirements

**If PRD is from `{{PREFIX}}prd-draft` (Scenario 1 - Primary Path):**

1. **Extract Epics directly from "Key Feature" sections:**
   - Each "Key Feature #N: [Name]" section = One Epic
   - The feature name becomes the Epic title
   - User stories are already grouped in the HTML table under each Key Feature

2. **For each Key Feature, extract:**
   - Epic Title: The Key Feature name
   - User Stories: From the table rows (Functional User Story column)
   - Acceptance Criteria: From the table (already in Given/When/Then format)
   - Priority: From the Priority column
   - Theme/Component: From the Theme/Component column

3. **Also extract from the PRD:**
   - FY27 Alignment: From "FY27 Community Objectives Alignment" section
   - Business Outcomes: From "Business Outcomes" section
   - Success Metrics: From "Success Metrics" section
   - Assumptions: From "Assumptions" section
   - Dependencies: From context within the PRD

**If PRD is NOT from `{{PREFIX}}prd-draft` (Scenario 2 - Legacy PRDs):**

1. Analyze the document structure to identify:
   - Features and functional requirements
   - User stories or use cases
   - Major functional areas
   - Dependencies between features

2. Apply PM best practices for epic identification:
   - Epics should represent major features or capabilities
   - Each epic should be independently valuable
   - Epics should be scoped appropriately (not too large, not too granular)

3. Present identified epics to the user for validation before proceeding

### Step 4: Present Extracted Epics for Review

Display all extracted/identified epics in a summary table:

```
┌─────┬──────────────────────────────┬─────────────────────────────────┬────────────┐
│  #  │ Epic Title                   │ User Stories                    │ Priority   │
├─────┼──────────────────────────────┼─────────────────────────────────┼────────────┤
│  1  │ [Key Feature Name]           │ 3 stories extracted             │ Now        │
│  2  │ [Key Feature Name]           │ 5 stories extracted             │ Now        │
│  3  │ [Key Feature Name]           │ 2 stories extracted             │ Next       │
└─────┴──────────────────────────────┴─────────────────────────────────┴────────────┘
```

**Ask the user:**
1. "I've extracted [N] Epics from your PRD. Would you like to review each one before creation, or proceed with all?"
2. "In what order should I create these Epics? (Enter numbers like '1,2,3' or 'all' for the order shown)"

### Step 5: Collaborative Refinement (If User Chooses Review)

For each epic the user wants to review, present:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC: [Title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 EPIC SUMMARY:
[2-4 sentence executive summary - What/Who/Why]

🎯 GOALS & FY27 ALIGNMENT:
[How this epic supports FY27 Community Objectives - extracted from PRD]

📊 SUCCESS METRICS:
  • [Metric 1]: [Target] by [Timeframe]
  • [Metric 2]: [Target] by [Timeframe]

📝 USER STORIES (documented in Epic, created via {{PREFIX}}prd-to-jira-stories):
  • US-1: [User story text] (Priority: Now)
  • US-2: [User story text] (Priority: Now)
  • US-3: [User story text] (Priority: Next)

🔧 TECHNICAL REQUIREMENTS:
[Key technical specs extracted from PRD]

⚠️ DEPENDENCIES & RISKS:
  Dependencies: [Any blockers identified]
  Risks: [Key risks with mitigation approach]

🚀 RELEASE STRATEGY:
[Phased rollout / Big bang / Feature flag approach]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Actions: [A]pprove | [E]dit | [S]kip | [M]erge with another | [D]elete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Work with the user to:
- Refine epic titles and descriptions
- Split or merge epics as needed
- Add missing epics not captured in the PRD
- Remove or defer epics
- Adjust scope boundaries
- Confirm what's in scope and out of scope

### Step 6: Preview Before Creation (Dry-Run)

Before creating any JIRA tickets, show a final preview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
READY TO CREATE [N] EPICS IN JIRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: [config.jira.projectKey]
Component: [config.jira.components]
Assignee: [config.jira.defaultAssignee]
Team: [config.jira.teamField.teamName]
Labels: [config.jira.defaultLabels] (must be added manually)

Epics to create:
  1. [Epic Title 1]
  2. [Epic Title 2]
  3. [Epic Title 3]

Proceed? [Y]es / [N]o / [R]eview again
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Create JIRA Epics

For each approved epic, with progress indication:

```
Creating Epic 1 of [N]: [Epic Title]...
```

**Creation process:**

- **WORKAROUND FOR MCP TOOL LIMITATION**: The current MCP tool `mcp_jira-ghe_createNewJiraTicket` does not support setting Epic Name (customfield_10007) at creation time, which JIRA requires. Use this workaround:
  1. First, try creating the epic with the standard parameters:
     - `projectKey`: [Use value from config: `config.jira.projectKey`]
     - `issueType`: "Epic"
     - `summary`: The epic title (this will also be used as the Epic Name value)
     - `components`: [Use value from config: `config.jira.components`]
     - `description`: Well-formatted markdown description following the standard epic structure (see below)
     - **Epic Name**: Automatically set to match Summary during creation (customfield_10007)
     - **Assignee**: Set `field` to "assignee" and `value` to [Use value from config: `config.jira.defaultAssignee`]
     - **Team field**: Set `field` to [Use value from config: `config.jira.teamField.fieldId`] and `value` to [Use value from config: `config.jira.teamField.teamId`]
     - **Label**: Cannot be set via `setJiraTicketField` (requires array format). Must be added manually in JIRA UI or via direct API call. Use labels from config: `config.jira.defaultLabels`

After each epic is created, show:

```
✅ Created: [CMTYAEM-1234] [Epic Title]
   URL: https://jira.workday.com/browse/CMTYAEM-1234
```

If an error occurs:

```
❌ Failed: [Epic Title]
   Error: [Error message]
   Continuing with remaining epics...
```

**Epic Creation Checklist:**

JIRA Fields:
- ✅ `projectKey`: [From config: `config.jira.projectKey`]
- ✅ `issueType`: "Epic"
- ✅ `components`: [From config: `config.jira.components`]
- ✅ `description`: Well-formatted markdown description following the 15-section structure
- ✅ **Epic Name**: Automatically set to match Summary during creation
- ✅ **Assignee**: Set `field` to "assignee" and `value` to [From config: `config.jira.defaultAssignee`]
- ✅ **Team field**: Set `field` to [From config: `config.jira.teamField.fieldId`] and `value` to [From config: `config.jira.teamField.teamId`]
- ⚠️ **Label**: Cannot be set via `setJiraTicketField` (tool limitation - requires array). Add manually: [From config: `config.jira.defaultLabels`]

Epic Description Sections (include all applicable):
1. Epic Summary
2. Overview / Background
3. Goals & Business Outcomes
4. Success Metrics
5. Scope (What's Included)
6. Out of Scope
7. Technical Requirements
8. Dependencies
9. Risk & Mitigation
10. Acceptance Criteria
11. Release Strategy
12. Child User Stories
13. Story Configuration & Naming Convention
14. Implementation Notes (optional)
15. Related Documentation (optional)

### Step 8: Update PRD with JIRA IDs

After creating all epics, update the source PRD to replace placeholder IDs with actual JIRA IDs.

**8a. Create/Update ID Mapping File**

Create or update `.prd-to-jira/id-mapping.json` with the mapping of placeholder IDs to actual JIRA IDs:

```json
{
  "prdFile": "[original PRD filename]",
  "createdAt": "[ISO timestamp]",
  "updatedAt": "[ISO timestamp]",
  "epics": {
    "Key Feature #1": {
      "placeholder": "Epic ID",
      "jiraId": "CMTYAEM-1234",
      "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-1234",
      "title": "[Epic Title]"
    },
    "Key Feature #2": {
      "placeholder": "Epic ID",
      "jiraId": "CMTYAEM-1235",
      "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-1235",
      "title": "[Epic Title]"
    }
  },
  "stories": {}
}
```

**8b. Update PRD Markdown**

If the original PRD markdown file is available (check for `.md` file in same directory as PDF, or ask user):

1. **Find the markdown file**:
   - If PDF was provided, look for matching `.md` file in same directory
   - Ask user: "Would you like me to update the PRD markdown with actual JIRA IDs? Please provide the markdown file path (or 'skip'):"

2. **Replace placeholder IDs in the markdown**:
   - Replace "**Epic:** [Placeholder]" with "**Epic:** [CMTYAEM-1234](https://jira.workday.com/browse/CMTYAEM-1234)"
   - Update the JIRA column in HTML tables from placeholder to actual Epic ID
   - Example replacement in table:
     ```
     Before: <td>Epic ID</td>
     After:  <td><a href="https://jira.workday.com/browse/CMTYAEM-1234">CMTYAEM-1234</a></td>
     ```

3. **Show what was updated**:
   ```
   ✅ Updated PRD markdown with JIRA IDs:
      • Key Feature #1: Epic ID → CMTYAEM-1234
      • Key Feature #2: Epic ID → CMTYAEM-1235
      • Key Feature #3: Epic ID → CMTYAEM-1236
   ```

**8c. Regenerate PDF (if markdown-to-pdf MCP available)**

After updating the markdown:

1. **Check if markdown-to-pdf MCP is available**:
   - Look for `mcp_markdown-to-pdf` tools
   - If not available, inform user they can regenerate manually

2. **If available, ask user**:
   ```
   Would you like to regenerate the PDF with updated JIRA IDs?
   [Y]es / [N]o (you can do this later manually)
   ```

3. **If yes, regenerate**:
   - Use markdown-to-pdf MCP to convert updated markdown to PDF
   - Save to same location as original PDF (or ask user for path)
   - Show: `✅ Regenerated PDF: [path/to/updated-prd.pdf]`

4. **If MCP not available**:
   ```
   ℹ️ markdown-to-pdf MCP not detected. To regenerate the PDF:
      1. Install the markdown-to-pdf MCP server
      2. Run: {{PREFIX}}pdf-generate [markdown-file-path]
      Or manually convert the updated markdown to PDF.
   ```

### Step 9: Summary and Next Steps

After all epics are created, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC CREATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created [N] of [M] epics successfully.

┌────────────────┬──────────────────────────────────┬────────────┐
│ JIRA ID        │ Epic Title                       │ Status     │
├────────────────┼──────────────────────────────────┼────────────┤
│ CMTYAEM-1234   │ [Epic Title 1]                   │ ✅ Created │
│ CMTYAEM-1235   │ [Epic Title 2]                   │ ✅ Created │
│ CMTYAEM-1236   │ [Epic Title 3]                   │ ✅ Created │
└────────────────┴──────────────────────────────────┴────────────┘

📄 PRD UPDATES:
   • ID Mapping: .prd-to-jira/id-mapping.json [✅ Created/Updated]
   • Markdown: [path/to/prd.md] [✅ Updated with JIRA IDs / ⏭️ Skipped]
   • PDF: [path/to/prd.pdf] [✅ Regenerated / ⏭️ Skipped / ℹ️ Manual regeneration needed]

⚠️ MANUAL STEPS REQUIRED:
   • Add labels to each epic: [config.jira.defaultLabels]
   • Bulk add labels: [Provide JIRA bulk edit URL or instructions]

📋 NEXT STEPS:
   1. Run `{{PREFIX}}prd-to-jira-stories` to create JIRA story tickets linked to these epics
   2. Run `{{PREFIX}}prd-to-mockups` to generate design specifications (optional)

📊 DEPENDENCY MAP:
   [If dependencies were identified, show them here]
   • CMTYAEM-1234 depends on CMTYAEM-1235
   • CMTYAEM-1236 is independent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Standard JIRA Epic Structure

All epic descriptions must follow this structure. **When the PRD is from `{{PREFIX}}prd-draft`, populate these sections using content extracted from the PRD.**

> **Reference Template**: For detailed guidance and examples, see [CMTYAEM-5481](https://jira2.workday.com/browse/CMTYAEM-5481) - Epic Description Best Practices Reference Guide.

---

### 1. Epic Summary

A 2-4 sentence executive summary understandable by any stakeholder in 30 seconds. Answers: What is being built? For whom? Why does it matter?

**Source from PRD:**
- Combine the Key Feature name with context from Business Background and Vision sections

---

### 2. Overview / Background

Provides context for WHY this Epic exists.

#### Current State
Describe how things work today and pain points.

**Source:** Extract from PRD's "Business Background" and "Current State" sections.

#### Problem Statement
Clearly articulate the problem or opportunity this Epic addresses.

**Source:** Extract from PRD's "Vision" and "Problem Statement" sections.

#### Solution Approach
Briefly describe the proposed solution at a high level.

**Source:** Extract from the Key Feature description and "Proposed Solution" sections.

---

### 3. Goals & Business Outcomes

This is the "Why are we doing this?" section. Organize by category for clarity.

**Format by category:**
```
### Market Expansion / User Experience / Operational Efficiency / etc.
- **Goal Name:** Description of expected outcome
```

**Sources from PRD:**
- Extract from "Business Outcomes" section
- Include FY27 Community Objectives alignment from the PRD's "FY27 Community Objectives Alignment" section
- Reference "Success Metrics" where relevant

Examples:
- `**FY27 Alignment - [Objective Name]:** This epic directly supports [specific FY27 objective] by...`
- `**Improved User Satisfaction:** Provide a smooth, consistent experience by removing a significant point of friction.`

---

### 4. Success Metrics

Define quantifiable metrics with specific targets and timeframes. These should be measurable post-launch.

**Format as table:**
```
| Metric | Target | Timeframe | Measurement Method |
|--------|--------|-----------|-------------------|
| [Metric name] | [Target value] | [Timeframe] | [How measured] |
```

**Source from PRD:**
- Extract from "Success Metrics" section
- Ensure each metric ties back to Goals above

Examples:
| Metric | Target | Timeframe | Measurement Method |
|--------|--------|-----------|-------------------|
| User adoption rate | 40% of target users | 6 months post-launch | Adobe Analytics |
| Task completion time | <30 seconds | At launch | Performance monitoring |
| User satisfaction (CSAT) | >4.2/5.0 | 3 months post-launch | Survey results |

---

### 5. Scope (What's Included in this Epic)

Defines the "definition of done" and sets clear boundaries. Organize by feature area or platform.

**Format:**
```
### Feature Area 1
- **Specific deliverable**
- **Specific deliverable**

### Feature Area 2
- **Specific deliverable**
```

**Source from PRD:**
- Derive from the user stories listed under this Key Feature in the PRD table
- Each user story represents a capability that's in scope

---

### 6. Out of Scope

Prevents "scope creep" by explicitly stating what **will not** be built *as part of this epic*.

**Format:**
```
### Not Included in This Epic
- **Item 1** - Brief reason or future consideration
- **Item 2** - Brief reason or future consideration
```

**Source from PRD:**
- Check if the PRD has explicit exclusions
- Identify functionality mentioned elsewhere in the PRD that belongs to other epics
- Note any "Future Releases" items from the PRD that relate to this epic

---

### 7. Technical Requirements

Provide technical specifications that engineering needs to understand the implementation.

**Include as applicable:**
- Language codes, API specs, configuration details
- System integration requirements
- Performance requirements (latency, throughput, etc.)
- Code examples or reference patterns

**Format:**
```
### Technical Area 1
- **Specification:** Details
- **Code/Config:** `example`

### Performance Requirements
- API response time: <XXXms (p95)
- Page load: <X seconds
```

**Source from PRD:**
- Extract from "Technical Requirements" or "Implementation Details" sections
- Reference any architecture diagrams or technical specs mentioned
- Include performance targets from "Non-Functional Requirements" if present

---

### 8. Dependencies

List all prerequisites, blockers, and related work. Categorize by type.

**Format:**
```
### Prerequisites (Must be complete before work begins)
- **Dependency 1** - Status if known
- **Dependency 2** - Status if known

### Technical Dependencies
- System/component dependency

### External Dependencies
- Vendor, contract, or third-party dependency
```

**Source from PRD:**
- Check "Assumptions" section for dependencies
- Check "Dependencies" section if present
- Identify cross-epic dependencies based on Key Feature relationships

---

### 9. Risk & Mitigation

Identify potential risks separately from dependencies. Assess impact and document mitigation.

**Format as table:**
```
| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| [Risk description] | High/Medium/Low | High/Medium/Low | [Mitigation approach] |
```

**Source from PRD:**
- Check "Open Questions" section for risks
- Check "Assumptions" section for risk indicators
- Identify technical risks based on complexity

Examples:
| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| Third-party API unavailability | High | Low | Implement retry logic and fallback |
| Resource constraints | Medium | Medium | Parallel workstreams, flexible sprint planning |
| Translation quality <85% | High | Medium | Early LX review, model tuning |

---

### 10. Acceptance Criteria

Epic-level acceptance criteria that must ALL be met for the Epic to be considered complete.

**Format by platform/feature area:**
```
### Platform/Feature Area 1
- Criterion 1
- Criterion 2

### Platform/Feature Area 2
- Criterion 1
- Criterion 2
```

**Source from PRD:**
- Extract from the "Acceptance Criteria" column in the Key Feature table
- These are already in Given/When/Then format from `{{PREFIX}}prd-draft`
- Aggregate story-level criteria to epic-level where appropriate

---

### 11. Release Strategy

Describe how this Epic will be released.

**Format:**
```
### Release Approach
[Big bang / Phased / Gradual rollout / Feature flag]

### Phases
| Phase | Description | Timeline |
|-------|-------------|----------|
| Phase 1 | Description | Target date/sprint |
| Phase 2 | Description | Target date/sprint |
```

**Source from PRD:**
- Extract from "Target Dates" section if available
- Reference the Release Date/Quarter from the PRD header
- Check for phasing information in the PRD

---

### 12. Child User Stories

**IMPORTANT**: These are for documentation within the epic. Actual JIRA story tickets will be created when the user runs `{{PREFIX}}prd-to-jira-stories`.

**Format:**
```
### Category 1 (e.g., Core Features)
- **US 1:** [User story] (Priority: Now/Next/Later)
- **US 2:** [User story] (Priority: Now/Next/Later)

### Category 2 (e.g., Search Integration)
- **US 3:** [User story] (Priority: Now/Next/Later)
```

**Source from PRD:**
- Extract verbatim from the Key Feature table in the PRD
- Preserve the user story format: "As a [persona], I want [action], so that [benefit]"
- Include the Priority from the PRD table
- Group by theme/component from the PRD table

---

### 13. Story Configuration & Naming Convention

Define standards for ALL child stories under this Epic for consistency.

**Format:**
```
### Naming Convention
`<Team/Product><Category><Platform/Area> Description`

Examples:
- `<CX><Auth><AEM> Implement SSO Integration`
- `<CX><Shared><Infrastructure> Configure CDN`

### Standard Fields for All Stories
- **Epic Link:** [This Epic ID]
- **Team:** [Team name from config]
- **Component:** [Component from config]
- **Labels:** [Labels from config]
```

**Source from config:**
- Use `config.jira.teamField.teamName` for Team
- Use `config.jira.components` for Component
- Use `config.jira.defaultLabels` for Labels

---

### 14. Implementation Notes (Optional)

Additional context, architectural decisions, or notes for the implementation team.

**Include as applicable:**
- Architectural decisions and rationale
- Known gotchas or edge cases
- Performance optimization notes
- Migration considerations

**Source from PRD:**
- Extract from "Technical Notes" or "Implementation Considerations" if present
- Reference any ADRs (Architecture Decision Records) mentioned

---

### 15. Related Documentation (Optional)

Link to relevant documentation, designs, technical specs, or reference materials.

**Format:**
```
- [Design Document](link) - Figma/Sketch designs
- [Technical Spec](link) - Architecture details
- [Related Epic](link) - Dependent/related work
- [ADR-XXX](link) - Architecture Decision Record
```

**Source from PRD:**
- Extract any documentation links from the PRD
- Reference the source PRD itself

## Notes

### Configuration & Setup
- **Configuration**: Always read `.prd-to-jira/config.json` first. If it doesn't exist, prompt user to run `{{PREFIX}}prd-init`
- **Epic Template Reference**: Reference [CMTYAEM-5481](https://jira2.workday.com/browse/CMTYAEM-5481) for detailed guidance and examples on each section
- **Project Key**: Use value from config (`config.jira.projectKey`), but confirm with user before creating tickets
- **Components**: Use value from config (`config.jira.components`)

### PRD Processing
- **PRD Source Detection**: Automatically detect if PRD is from `{{PREFIX}}prd-draft` (look for Key Feature sections) and optimize extraction accordingly
- **Preserve PRD Content**: When the PRD is from `{{PREFIX}}prd-draft`, extract content verbatim rather than re-interpreting. The PRD has already been validated.
- **FY27 Alignment**: Always include FY27 Community Objectives alignment in the "Goals & Business Outcomes" section when available in the PRD

### Epic Structure Best Practices
- **15-Section Structure**: Follow the enhanced structure (Epic Summary through Related Documentation) for comprehensive epic documentation
- **Success Metrics**: Always include measurable targets with timeframes - this is critical for PM tracking and stakeholder alignment
- **Technical Requirements**: Include sufficient detail for engineering (API specs, performance targets, configurations)
- **Risk vs Dependencies**: Keep these as separate sections - dependencies are blockers, risks are uncertainties that need mitigation
- **Release Strategy**: Always document the rollout approach, especially for phased releases
- **Story Naming Convention**: Define consistent naming patterns to enable automated tooling and queries

### JIRA Field Handling
- **Epic Name**: Automatically set during creation to match the Summary field (customfield_10007)
- **Assignee**: Set after creation using `setJiraTicketField` with `field`: "assignee" and `value`: [From config: `config.jira.defaultAssignee`]
- **Team field**: Set after creation using `setJiraTicketField` with `field`: [From config: `config.jira.teamField.fieldId`] and `value`: [From config: `config.jira.teamField.teamId`]
- **Label**: Cannot be set via `setJiraTicketField` because the tool only accepts string values but labels require an array format. Labels must be added manually in JIRA UI. Use labels from config: `config.jira.defaultLabels`

### User Stories
- **User Stories Are Documentation**: The "Child User Stories" in each epic are for reference. Remind users to run `{{PREFIX}}prd-to-jira-stories` to create actual JIRA story tickets

### Operational
- **Progress Feedback**: Always show progress when creating multiple epics (e.g., "Creating Epic 2 of 5...")
- **Error Recovery**: If epic creation fails, continue with remaining epics and report failures at the end
- Follow JIRA epic naming conventions (typically: "Feature Name" or "Capability Name")
- Validate that epics are properly scoped (not stories, not initiatives)

### Quality Checklist (From Template)
Before creating each epic, verify:
- [ ] **Epic Summary**: Clear, concise, understandable in 30 seconds
- [ ] **Overview/Background**: Context and problem statement defined
- [ ] **Goals & Business Outcomes**: Specific, measurable outcomes with business value
- [ ] **Success Metrics**: Quantifiable targets with timeframes
- [ ] **Scope - What's Included**: Explicit list of deliverables
- [ ] **Out of Scope**: Clear boundaries set
- [ ] **Technical Requirements**: Sufficient detail for engineering
- [ ] **Dependencies**: All blockers and prerequisites identified
- [ ] **Risk & Mitigation**: Key risks identified with mitigation plans
- [ ] **Acceptance Criteria**: Testable criteria for Epic completion
- [ ] **Release Strategy**: Rollout approach defined
- [ ] **Child Stories**: Work breakdown with consistent naming
