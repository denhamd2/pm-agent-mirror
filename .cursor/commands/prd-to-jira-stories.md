# PRD to JIRA Stories Generator

## Description

As an expert Principal Product Manager, extract user stories from a PRD and create comprehensive, well-documented JIRA story tickets ready for **Engineering handoff**. Each story includes full context, acceptance criteria, dependencies, and proper Epic linking.

**Purpose**: Create JIRA stories with enough detail and context for:
- Engineering kickoff conversations
- Stakeholder alignment
- Clear definition of done
- Traceability back to PRD requirements

## Workflow Context

This command is part of the PRD-to-JIRA pipeline:

```
{{PREFIX}}prd-init → {{PREFIX}}prd-draft → {{PREFIX}}prd-to-epics → {{PREFIX}}prd-to-jira-stories (YOU ARE HERE) → {{PREFIX}}prd-to-mockups
```

**Where you are in the workflow**:
- Your PRD was created with `{{PREFIX}}prd-draft` (contains "Key Feature" sections with user story tables)
- Epics were just created with `{{PREFIX}}prd-to-epics` (stories will link to these epics)
- This command extracts stories from the PRD and links them to the epics you created

**What happens next**:
- Stories will be ready for Engineering handoff
- Optionally run `{{PREFIX}}prd-to-mockups` for design specifications

## Configuration

**CRITICAL: Read configuration file first**

Before starting, read the configuration file at `.prd-to-jira/config.json` in the current workspace. This file contains:
- JIRA project key
- Components array
- Default assignee
- Team field settings
- Default labels

If the config file doesn't exist, prompt the user to run `{{PREFIX}}prd-init` first.

**Use config values for**:
- `projectKey`: From `config.jira.projectKey`
- `defaultAssignee`: From `config.jira.defaultAssignee`
- `components`: From `config.jira.components` (fallback if Epic has none)
- `labels`: From `config.jira.defaultLabels` (fallback if Epic has none)

**Default values (if config missing)**:
- `projectKey`: "CMTYAEM"
- `components`: ["Integration"]
- `defaultAssignee`: "akash.majumder"
- `defaultLabels`: ["cmty-auth-gemini"]

## Instructions

### Step 1: Read Configuration

- Read `.prd-to-jira/config.json` from the current workspace
- Extract all JIRA settings
- If config doesn't exist, inform user and use defaults (recommend running `{{PREFIX}}prd-init`)

### Step 2: Accept PRD Input

**Accept either PDF or Markdown format**:
- Ask the user for the PRD file path if not provided
- Detect file type from extension (.pdf or .md)
- If PDF: Read and parse the PDF content
- If Markdown: Read the markdown file directly

**Note**: If user only has the PDF (from `{{PREFIX}}prd-draft`), use the PDF. If the original markdown is available, that's also fine.

### Step 3: Parse PRD and Extract Stories

**Detect if PRD is from `{{PREFIX}}prd-draft`** (look for these indicators):
- "Key Feature #1", "Key Feature #2" section headers
- HTML tables with columns: JIRA | Epic | Priority | Functional User Story | Theme / Component | Acceptance Criteria
- Structured sections: Business Background, Vision, Requirements

**If PRD is from `{{PREFIX}}prd-draft` (Primary Path)**:

Extract from each "Key Feature" section:

1. **Epic Information**:
   - Epic JIRA ID from "**Epic:** [Link] - [Name]" line
   - Epic name/title

2. **User Stories** from HTML tables:
   - Story placeholder ID (e.g., "Epic ID-1")
   - Epic link from table
   - Priority (Now/Next/Later)
   - **Full user story text** (preserve exactly)
   - **Theme/Component** (preserve exactly)
   - **Acceptance Criteria** (split on `<br>` tags, preserve all)

**If PRD is NOT from `{{PREFIX}}prd-draft` (Legacy PRDs)**:
- Analyze document structure to identify user stories
- Extract story details as best as possible
- Extract story-to-epic relationships (if epics are referenced in the PRD)
- Extract category/theme information if available (for grouping in epic descriptions)
- Present to user for validation
- **Note**: Epic descriptions may not have the standard 15-section structure. When updating epic descriptions with child story links (Step 9.5), append the "Child User Stories" section at the end if section 12 doesn't exist.

### Step 4: Fetch Epic Details from JIRA

For each Epic identified in the PRD:
- Use `getTicketDetails` to fetch current Epic details
- Extract labels (to inherit)
- Extract components (to inherit)
- Verify Epic exists in JIRA
- If Epic doesn't exist, warn user and ask how to proceed

### Step 5: Present Summary and Choose Mode

Display a structured summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STORIES EXTRACTED FROM PRD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found [N] stories across [M] Epics:

┌─────┬────────────────────────────────────────┬────────────────┬──────────┐
│  #  │ Story Summary (truncated)              │ Parent Epic    │ Priority │
├─────┼────────────────────────────────────────┼────────────────┼──────────┤
│  1  │ As a user, I want to receive...        │ CMTYAEM-5278   │ Now      │
│  2  │ As a developer, I need to...           │ CMTYAEM-5278   │ Now      │
│  3  │ As an admin, I want to configure...    │ CMTYAEM-5279   │ Next     │
│ ... │ ...                                    │ ...            │ ...      │
└─────┴────────────────────────────────────────┴────────────────┴──────────┘

Epic Breakdown:
  • CMTYAEM-5278 (AI Connection Engine): 5 stories
  • CMTYAEM-5279 (Connection Workflow): 4 stories
  • CMTYAEM-5280 (Analytics Dashboard): 3 stories

Settings from config:
  • Project: [config.jira.projectKey]
  • Default Assignee: [config.jira.defaultAssignee]
  • Labels: Inherited from Epic (fallback: [config.jira.defaultLabels])
  • Components: Inherited from Epic (fallback: [config.jira.components])

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Ask user to choose processing mode**:

```
How would you like to process these [N] stories?

  [1] Review Each (Recommended for first time)
      - Review and optionally refine each story before creation
      - Add dependencies not in PRD
      - Preview before creating

  [2] Fast Mode (For experienced users)
      - Create all stories with PRD content as-is
      - Inherit Epic labels/components automatically
      - Show summary at end

  [3] Priority Filter
      - Only process "Now" priority stories (create [X] stories)
      - Skip "Next" and "Later" for now

Enter choice (1/2/3):
```

### Step 6: Process Stories

#### Mode 1: Review Each Story

For each story, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STORY [X] of [Y]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FROM PRD:
   User Story: [Full user story text from PRD]
   Priority: [Now/Next/Later]
   Theme/Component: [From PRD]
   Parent Epic: [CMTYAEM-XXXX] - [Epic Name]

✅ ACCEPTANCE CRITERIA (from PRD):
   1. Given [context], When [action], Then [result]
   2. Given [context], When [action], Then [result]
   3. ...

🔗 WILL INHERIT FROM EPIC:
   Labels: [epic labels]
   Components: [epic components]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Actions:
  [C]reate as-is  |  [R]efine  |  [S]kip  |  [A]dd dependencies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If user chooses [R]efine**:
- Allow editing user story text
- Allow editing acceptance criteria
- Allow adding context to description
- Show comparison: "Original vs Refined"

**If user chooses [A]dd dependencies**:
- Ask: "What dependencies should be added? (other tickets, technical prerequisites, blockers)"
- Add to Dependencies section

**Before creating, show preview**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREVIEW: JIRA TICKET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary: [User story text - max 255 chars]
Type: Story
Project: [config.projectKey]
Epic Link: CMTYAEM-XXXX
Components: [inherited from Epic]
Labels: [inherited from Epic]
Assignee: [config.defaultAssignee]

Description:
  ## Description
  [Generated description with context...]

  ## Acceptance Criteria
  [Formatted criteria...]

  ## Dependencies
  [Dependencies list...]

  ## Notes
  [Additional context...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create this ticket? [Y]es / [N]o / [E]dit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Mode 2: Fast Mode

- Process all stories without individual confirmation
- Use PRD content as-is
- Inherit Epic labels/components
- Show progress: "Creating story 3 of 12..."
- Continue on error, report at end

#### Mode 3: Priority Filter

- Same as Mode 1 or 2, but only for "Now" priority stories
- Ask: "Process 'Now' stories in Review mode or Fast mode?"

### Step 7: Preview Before Creation (Dry-Run)

Before creating any JIRA tickets, show a final preview of ALL stories that will be created:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
READY TO CREATE [N] STORIES IN JIRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: [config.jira.projectKey]
Default Assignee: [config.jira.defaultAssignee]

Stories to create:

Epic: CMTYAEM-1234 - [Epic Name]
┌─────┬────────────────────────────────────────────────┬──────────┐
│  #  │ Story Summary                                  │ Priority │
├─────┼────────────────────────────────────────────────┼──────────┤
│  1  │ As a user, I want to receive...                │ Now      │
│  2  │ As a developer, I need to...                   │ Now      │
└─────┴────────────────────────────────────────────────┴──────────┘

Epic: CMTYAEM-1235 - [Epic Name]
┌─────┬────────────────────────────────────────────────┬──────────┐
│  #  │ Story Summary                                  │ Priority │
├─────┼────────────────────────────────────────────────┼──────────┤
│  3  │ As an admin, I want to configure...            │ Next     │
│  4  │ As a user, I want to view...                   │ Later    │
└─────┴────────────────────────────────────────────────┴──────────┘

Summary:
  • Total stories: [N]
  • By priority: Now ([X]), Next ([Y]), Later ([Z])
  • Skipped: [N] (if any were skipped during review)

Labels: Inherited from parent Epic (fallback: [config.jira.defaultLabels])
Components: Inherited from parent Epic (fallback: [config.jira.components])

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proceed? [Y]es / [N]o / [R]eview again
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If user chooses [N]o:**
- Exit without creating any tickets
- Inform: "No stories were created. Run the command again when ready."

**If user chooses [R]eview again:**
- Return to Step 6 to review/modify stories

### Step 8: Create JIRA Tickets

For each approved story:

**Show progress**:

```
Creating Story [X] of [Y]: [Story summary truncated]...
```

**Create ticket using**:
- `createNewJiraTicket`:
  - `projectKey`: [From config: `config.jira.projectKey`]
  - `issueType`: "Story"
  - `summary`: User story text (max 255 chars)
  - `description`: Formatted markdown (see template below)
  - `components`: Array from parent Epic

**After creation, set fields**:
- `setJiraTicketField` for Epic Link: `customfield_10006` = [Epic Key]
- `setJiraTicketField` for assignee: [From config: `config.jira.defaultAssignee`]
- `setJiraTicketField` for priority: Map "Now"→"Highest", "Next"→"Medium", "Later"→"Low"
- `setJiraTicketField` for labels (if supported, else note for manual update)

**Track story metadata for epic description updates**:

After each story is successfully created, maintain a data structure grouped by Epic ID:

```javascript
{
  "CMTYAEM-1234": {  // Epic ID
    "stories": [
      {
        "jiraId": "CMTYAEM-5290",
        "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-5290",
        "summary": "As a user, I want to receive...",
        "priority": "Now",
        "category": "Core Features"  // From PRD Theme/Component if available
      },
      // ... more stories
    ]
  }
}
```

**Track for each created story**:
- Epic ID (parent epic)
- Story ID (created JIRA ticket)
- Story summary (from ticket summary field)
- Story priority (Now/Next/Later from PRD)
- Story category/theme (from PRD Theme/Component column if available)

**Show result**:

```
✅ Created: CMTYAEM-5290 - As a user, I want to receive...
   Epic: CMTYAEM-5278
   URL: https://jira.workday.com/browse/CMTYAEM-5290
```

**On error**:

```
❌ Failed: As a user, I want to receive...
   Error: [Error message]
   [R]etry / [S]kip / [A]bort
```

### Step 9: Update PRD with JIRA IDs

After creating all stories, update the source PRD to replace placeholder IDs with actual JIRA IDs.

**9a. Update ID Mapping File**

Update `.prd-to-jira/id-mapping.json` to add story mappings (this file was created by `{{PREFIX}}prd-to-epics`):

```json
{
  "prdFile": "[original PRD filename]",
  "createdAt": "[ISO timestamp from epics]",
  "updatedAt": "[ISO timestamp - now]",
  "epics": {
    "Key Feature #1": {
      "placeholder": "Epic ID",
      "jiraId": "CMTYAEM-1234",
      "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-1234",
      "title": "[Epic Title]"
    }
  },
  "stories": {
    "CMTYAEM-1234": {
      "Epic ID-1": {
        "placeholder": "Epic ID-1",
        "jiraId": "CMTYAEM-5290",
        "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-5290",
        "summary": "As a user, I want to receive..."
      },
      "Epic ID-2": {
        "placeholder": "Epic ID-2",
        "jiraId": "CMTYAEM-5291",
        "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-5291",
        "summary": "As a developer, I need to..."
      }
    },
    "CMTYAEM-1235": {
      "Epic ID-1": {
        "placeholder": "Epic ID-1",
        "jiraId": "CMTYAEM-5292",
        "jiraUrl": "https://jira.workday.com/browse/CMTYAEM-5292",
        "summary": "As an admin, I want to..."
      }
    }
  }
}
```

**9b. Update PRD Markdown**

If the original PRD markdown file is available:

1. **Find the markdown file**:
   - If PDF was provided, look for matching `.md` file in same directory
   - Check if markdown path was provided earlier
   - Ask user: "Would you like me to update the PRD markdown with actual Story JIRA IDs? Please provide the markdown file path (or 'skip'):"

2. **Replace placeholder Story IDs in the markdown**:
   - Update the JIRA column in HTML tables from placeholder to actual Story ID
   - Example replacement in table:
     ```
     Before: <td>Epic ID-1</td>
     After:  <td><a href="https://jira.workday.com/browse/CMTYAEM-5290">CMTYAEM-5290</a></td>
     ```
   - Preserve Epic IDs that were already updated by `{{PREFIX}}prd-to-epics`

3. **Show what was updated**:
   ```
   ✅ Updated PRD markdown with Story JIRA IDs:
      Epic CMTYAEM-1234:
        • Epic ID-1 → CMTYAEM-5290
        • Epic ID-2 → CMTYAEM-5291
      Epic CMTYAEM-1235:
        • Epic ID-1 → CMTYAEM-5292
        • Epic ID-2 → CMTYAEM-5293
   ```

**9c. Regenerate PDF (if markdown-to-pdf MCP available)**

After updating the markdown:

1. **Check if markdown-to-pdf MCP is available**:
   - Look for `mcp_markdown-to-pdf` tools
   - If not available, inform user they can regenerate manually

2. **If available, ask user**:
   ```
   Would you like to regenerate the PDF with updated Story JIRA IDs?
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

### Step 9.5: Update Epic Descriptions with Child Story Links

After creating all stories and updating the PRD, update each epic's description to include actual JIRA story links in the "Child User Stories" section.

**For each epic that had stories created:**

1. **Group stories by epic**: Use the story metadata tracked in Step 8 to collect all stories for each epic

2. **Fetch current epic description**:
   - Use `getTicketDetails` to retrieve the epic's current description
   - Extract the full description markdown

3. **Parse and locate "Child User Stories" section**:
   - Look for section 12: "### 12. Child User Stories" or similar heading
   - If section exists, identify its boundaries (from heading to next section or end)
   - If section doesn't exist, identify where to insert it (after section 11 "Acceptance Criteria" or at the end if structure differs)

4. **Build updated "Child User Stories" section**:

   **Format:**
   ```markdown
   ### 12. Child User Stories

   **IMPORTANT**: These are the actual JIRA story tickets linked to this epic. Created via `{{PREFIX}}prd-to-jira-stories`.

   ### Category 1 (e.g., Core Features)
   - **[CMTYAEM-5290](https://jira.workday.com/browse/CMTYAEM-5290):** As a user, I want to receive... (Priority: Now)
   - **[CMTYAEM-5291](https://jira.workday.com/browse/CMTYAEM-5291):** As a developer, I need to... (Priority: Now)

   ### Category 2 (e.g., Search Integration)
   - **[CMTYAEM-5292](https://jira.workday.com/browse/CMTYAEM-5292):** As an admin, I want to... (Priority: Next)
   ```

   **Grouping logic**:
   - If stories have categories/themes from PRD, group by category
   - If no categories, list all stories in a single list
   - Sort by priority (Now → Next → Later) within each category
   - Format each story as: `- **[JIRA-ID](URL):** [Story Summary] (Priority: [Now/Next/Later])`

5. **Update epic description**:
   - If section 12 exists: Replace the existing section with the updated version
   - If section 12 doesn't exist: Insert the new section after section 11 (Acceptance Criteria) or at the end if structure differs
   - Preserve all other sections exactly as they are
   - Use `setJiraTicketField` with `field`: "description" and `value`: updated description markdown

6. **Show progress and result**:

   ```
   Updating Epic CMTYAEM-5278 with child story links...
   ✅ Updated: CMTYAEM-5278 - Added 5 child story links
   ```

   **On error**:
   ```
   ⚠️ Failed to update Epic CMTYAEM-5278
      Error: [Error message]
      Continuing with remaining epics...
   ```

**Edge cases to handle**:

1. **Epic description doesn't have section 12**: Append the "Child User Stories" section after section 11 (Acceptance Criteria) or at the end if structure differs
2. **Epic description has different section numbering**: Detect section 12 by heading text ("Child User Stories" or similar) rather than number
3. **Stories were skipped**: Only update epics for stories that were actually created (skip epics with no created stories)
4. **Epic update fails**: Log error but continue with remaining epics, show summary at end
5. **Epic description format differs**: Parse markdown carefully, preserve all other sections exactly
6. **Multiple epics**: Process each epic independently, show progress for each
7. **Legacy PRDs**: For PRDs not from `{{PREFIX}}prd-draft`, epic descriptions may not have standard 15-section structure - append section at end if needed

**Show summary after all epic updates**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC DESCRIPTION UPDATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updated epic descriptions with child story links:

  • CMTYAEM-5278: ✅ Updated with 5 child story links
  • CMTYAEM-5279: ✅ Updated with 4 child story links
  • CMTYAEM-5280: ⚠️ Update failed (Error: [message])

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 10: Final Summary and Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STORY CREATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created [X] of [Y] stories successfully.

┌────────────────┬────────────────────────────────────┬────────────────┬────────────┐
│ JIRA ID        │ Story Summary                      │ Parent Epic    │ Status     │
├────────────────┼────────────────────────────────────┼────────────────┼────────────┤
│ CMTYAEM-5290   │ As a user, I want to receive...    │ CMTYAEM-5278   │ ✅ Created │
│ CMTYAEM-5291   │ As a developer, I need to...       │ CMTYAEM-5278   │ ✅ Created │
│ CMTYAEM-5292   │ As an admin, I want to...          │ CMTYAEM-5279   │ ✅ Created │
│ [Skipped]      │ As a user, I want to export...     │ CMTYAEM-5280   │ ⏭️ Skipped │
└────────────────┴────────────────────────────────────┴────────────────┴────────────┘

Stories by Epic:
  • CMTYAEM-5278: 5 stories created
  • CMTYAEM-5279: 4 stories created
  • CMTYAEM-5280: 2 stories created, 1 skipped

📄 PRD UPDATES:
   • ID Mapping: .prd-to-jira/id-mapping.json [✅ Updated with story IDs]
   • Markdown: [path/to/prd.md] [✅ Updated with Story JIRA IDs / ⏭️ Skipped]
   • PDF: [path/to/prd.pdf] [✅ Regenerated / ⏭️ Skipped / ℹ️ Manual regeneration needed]

📊 EPIC UPDATES:
   • CMTYAEM-5278: ✅ Updated with 5 child story links
   • CMTYAEM-5279: ✅ Updated with 4 child story links
   • CMTYAEM-5280: ⚠️ Update failed (Error: [message])

⚠️ MANUAL STEPS (if any):
   • Add labels manually to: CMTYAEM-5290, CMTYAEM-5291 (tool limitation)

📋 NEXT STEPS:
   1. Review created stories in JIRA with your Engineering team
   2. Use these stories for sprint planning and estimation
   3. Run `{{PREFIX}}prd-to-mockups` to generate design specifications (optional)

📊 READY FOR ENGINEERING HANDOFF:
   All stories include:
   ✓ Full context and rationale
   ✓ Acceptance criteria (Given/When/Then)
   ✓ Dependencies documented
   ✓ Linked to parent Epics
   ✓ Labels and components set

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## JIRA Story Description Template

All story descriptions follow this structure:

```markdown
## Description

**User Story:** [Full user story text from PRD]

[2-4 paragraphs of context explaining:]
- The "why" behind this story - what problem does it solve?
- Strategic importance - how does this contribute to the Epic/feature?
- Impact - what happens if this isn't implemented correctly?
- Platform considerations if relevant (AEM, Khoros, Drupal, etc.)

[Generate context by referencing:]
- PRD's Business Background and Vision sections
- The parent Epic's description
- The acceptance criteria (to understand scope)
- Theme/Component (to understand technical context)

## Acceptance Criteria

[Format all criteria in Given/When/Then format:]

* **Given** [initial context/state],
* **When** [action is performed],
* **Then** [expected outcome/result].

* **Given** [condition 2],
* **When** [action 2],
* **Then** [result 2].

[If technical notes are needed:]
* Tech Note: [Technical consideration or constraint]

## Dependencies

[List all dependencies:]
* [External dependency - e.g., "Successful contract and procurement processes"]
* [Technical dependency - e.g., "Access to UAT/Production environments"]
* [Related tickets - e.g., "Requires [CMTYAEM-XXXX](URL) to be completed first"]
* [Parent Epic - e.g., "Part of Epic [CMTYAEM-XXXX](URL)"]
* [User-provided dependencies from refinement step]

[If no dependencies:] No external dependencies identified.

## Notes

[Additional context and clarifications:]
* [Technical considerations or approach]
* [Platform-specific notes]
* [References to PRD sections]
* [Cross-references to related tickets]

[If no notes needed, omit section or state:] No additional notes.

## Theme / Component

[From PRD]

## Linked Epic

[Epic Name] - [CMTYAEM-XXXX](URL)
```

## Ground Rules

### Epic Inheritance

- Stories inherit labels from parent Epic
- Stories inherit components from parent Epic
- If Epic has none, use config defaults
- If config has none, ask user

### Multiple Epic Links

- If story is linked to multiple Epics in PRD, use FIRST Epic only
- Inform user when this happens

### Story ID Handling

- If PRD has placeholder IDs (e.g., "Epic ID-1"), create new tickets
- If PRD has real JIRA IDs, check if ticket exists:
  - If exists: Ask "Skip, Update, or Create new?"
  - If not exists: Create new

### Priority Mapping

| PRD Priority | JIRA Priority |
|--------------|---------------|
| Now | Highest |
| Next | Medium |
| Later | Low |

### Error Handling

- **Epic not found**: Ask user to create Epic first or link to different Epic
- **Ticket exists**: Ask Skip/Update/Create new
- **API failure**: Offer Retry/Skip/Abort
- **Missing labels/components**: Use config defaults or ask user

## Notes

- **Configuration**: Always read `.prd-to-jira/config.json` first
- **PRD Format**: Accept both PDF and Markdown - detect from file extension
- **PRD Source Detection**: Optimize extraction for `{{PREFIX}}prd-draft` PRDs (look for Key Feature sections)
- **Engineering Handoff**: Focus on comprehensive context, not sprint planning
- **Batch Processing**: Offer Fast Mode for experienced users with many stories
- **Progress Tracking**: Always show "Story X of Y" progress
- **User Confirmation**: In Review mode, always confirm before creating
- **Error Recovery**: Continue on error, report failures at end
- **Epic Description Updates**: After creating stories, epic descriptions are automatically updated with actual JIRA story links in the "Child User Stories" section (section 12). This works for both `{{PREFIX}}prd-draft` PRDs and legacy PRDs. Stories are grouped by category/theme if available from the PRD, and formatted as clickable JIRA links with priority information. If an epic description doesn't have section 12, it will be appended after section 11 (Acceptance Criteria) or at the end if the structure differs.
