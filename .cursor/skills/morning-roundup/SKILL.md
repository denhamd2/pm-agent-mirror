# Morning Roundup Skill

**Trigger**: User says "/morning-roundup", "morning briefing", "daily roundup", "refresh morning roundup"

**Purpose**: Fetch David's Jira action items and competitor news, generate a fresh Morning Roundup dashboard for daily PM workflow.

## What This Skill Does

1. **Queries Jira** for action items requiring David's response
2. **Queries Jira** for customer escalations awaiting triage
3. **Searches web** for latest competitor news from major ATS vendors
4. **Analyses competitive implications** of each news item for Workday Recruiting
5. **Generates JSON data** file with structured results
6. **Opens Morning Roundup page** in Cursor browser

## Steps

### Step 1: Query Jira for Action Items

Use `user-jira-ghe` MCP `searchJiraTickets` tool with JQL:

```
comment ~ "David Denham" AND updated >= -14d AND status not in (Done, Resolved, Closed) ORDER BY updated DESC
```

This finds Jiras where David was mentioned in comments over the past 2 weeks.

**Important**: This query returns tickets where David is mentioned in ANY comment. Step 3 will filter to only include tickets where David is mentioned in the **LATEST** comment.

### Step 2: Query Jira for Unassigned Customer Issues

Use `user-jira-ghe` MCP `searchJiraTickets` tool with JQL:

```
issuetype = Bug AND assignee = "David Denham" AND status in (Open, Reopened) ORDER BY updated DESC
```

This finds unassigned Bug-type issues in Open or Reopened status.

**Post-processing filter**: After fetching ticket details in Step 3, apply BOTH filters:
1. Check if the ticket has a non-empty Customer field (custom field names may vary: `customfield_XXXXX`, `Customer`, `Customer[Dropdown]`). Only include tickets with Customer data populated.
2. Check if the Scrum Team field is EMPTY. Only include tickets where Scrum Team is blank/null. Discard tickets with a Scrum Team assigned (these are already being worked by a team).

### Step 3: Get Ticket Details and Filter

For each Jira found in Steps 1-2, use `user-jira-ghe` MCP `getTicketDetails` tool to fetch:
- Full description
- All comments (sorted by date)
- Custom fields (Customer name, Scrum Team, etc.)

**Action Items filtering (from Step 1):**
1. For each ticket, sort comments by creation date (newest first)
2. Check if "David Denham" is mentioned in the **most recent comment only**
3. If David is mentioned in the latest comment: INCLUDE in results
4. If David is only mentioned in older comments: DISCARD from results
5. If the latest comment **author** is "David Denham" or "david.denham": EXCLUDE from results (David has already responded)
6. Extract the latest comment author, date, and body for TLDR generation
7. Extract `fields.priority.name` (e.g., Blocker, Critical, Major, Minor, Trivial) and include as `priority` in the output

**Customer Issues filtering (from Step 2):**
1. For each ticket, check custom fields for Customer data AND Scrum Team
2. Look for Customer fields like: `customfield_XXXXX`, `Customer`, `Customer[Dropdown]`
3. Look for Scrum Team fields like: `customfield_XXXXX`, `Scrum Team`, `Scrum team`
4. If Customer field is populated AND Scrum Team field is empty/null: INCLUDE in results
5. If Customer field is empty or null: DISCARD from results
6. If Scrum Team field is populated: DISCARD from results (team is already working on it)

### Step 3a: Classify Customer Issues with Deployment Agent

For each customer issue ticket that passed Step 3 filtering:
1. Use `user-deployment-agent` MCP `ask_deployment_agent` tool
2. Query format: "Analyze this Workday Recruiting bug ticket. Is this likely: (A) Working as Designed, (B) Configuration Error, or (C) Product Bug? Provide classification with confidence level (High/Medium/Low) and brief reasoning. Ticket [key]: [summary]. Description: [first 500 chars of description]"
3. Parse Deployment Agent response to extract:
   - Classification: Bug | Config | WAD
   - Confidence: High | Medium | Low
   - Reasoning: 1-sentence explanation
4. Add `diagnosis` object to ticket data structure:
   ```json
   {
     "diagnosis": {
       "classification": "Bug",
       "confidence": "High",
       "reasoning": "Error message indicates null pointer in offer acceptance workflow"
     }
   }
   ```

### Step 5: Generate TLDRs

For each Jira:
- **Action Items**: Extract latest comment author, date, and body. Generate TLDR: "What is [commenter] asking David to do?"
- **Customer Issues**: Extract description and customer name. Generate TLDR: "What is the customer's problem in 1 sentence?"

Keep TLDRs to 1-2 sentences maximum, focusing on actionable information.

### Step 6: Search for Competitor News

Use `WebSearch` tool to find latest news from these competitors (past 7 days):
- Greenhouse
- Lever
- iCIMS
- SmartRecruiters
- Jobvite (Employ Inc)
- Oracle Taleo
- SAP SuccessFactors

**Search queries** (run 4-5 searches total, pick highest-value results):
1. "Greenhouse OR Lever OR iCIMS feature release announcement 2026"
2. "SmartRecruiters OR Jobvite AI recruiting announcement 2026"
3. "Oracle Taleo OR SAP SuccessFactors release notes latest"
4. "ATS recruiting software announcement OR release 2026"

Focus on:
- Feature releases
- AI/ML announcements
- Press releases
- Product updates

Return 3-5 most relevant news items total (across all competitors).

**For each news item, generate 3-5 concise bullet points** summarising the key facts:
- What was announced or released
- Key capabilities or features mentioned
- Market positioning or competitive angle
- Metrics or claims (if any)
- Target segment or use case

Store bullets as a `bullets` array of strings in the JSON output (not a single `summary` string).

### Step 6a: Generate Workday Implications per News Item

For each competitor news item gathered in Step 6:

1. Read the relevant competitive matrix from `research/competitive/matrices/` (e.g., `global-competitive-matrix.md` or region-specific matrix if applicable)
2. Identify which Workday Recruiting capability area the news item relates to (e.g., onboarding, AI screening, scheduling, duplicate detection)
3. Analyse the news in context of Workday's competitive position from the matrix
4. Generate a 1-line `workdayImplication` string (max 120 characters) answering: "What does this mean for Workday Recruiting?"

**Tone**: VP-facing, strategic, concise. Frame as competitive positioning insight.

**Examples**:
- "Greenhouse closing Workday onboarding gap; our native HCM handoff remains a differentiator"
- "iCIMS frontline AI push mirrors our HiredScore play; watch for overlap in high-volume verticals"
- "G2 ranking pressure; Greenhouse enterprise penetration growing, need to defend mid-market share"

**Output**: Add `workdayImplication` field to each `competitorNews` object in the JSON data structure.

**Fallback**: If no competitive matrix exists or the news item does not map to a clear Workday capability, generate the implication based on general ATS market knowledge.

### Step 7: Generate JSON Data File

Write results to `docs/morning-roundup-data.json`:

```json
{
  "generated": "2026-04-01T09:30:00Z",
  "jiraResponses": [
    {
      "key": "REC-1234",
      "summary": "Ticket title",
      "url": "https://jira.workday.com/browse/REC-1234",
      "latestComment": {
        "author": "Jane Smith",
        "date": "2026-03-31",
        "body": "David, can you review the architecture here?",
        "tldr": "Jane is asking for architecture review"
      },
      "tldrSummary": "Feature request for bulk candidate import with Excel",
      "priority": "Major"
    }
  ],
  "customerIssues": [
    {
      "key": "REC-5678",
      "summary": "API timeout in bulk offer flow",
      "url": "https://jira.workday.com/browse/REC-5678",
      "customer": "Accenture",
      "tldrSummary": "P1 escalation - API timing out when sending 500+ offers",
      "status": "Open",
      "created": "2026-03-29",
      "diagnosis": {
        "classification": "Bug",
        "confidence": "High",
        "reasoning": "API timeout suggests performance issue or resource contention in bulk processing"
      }
    }
  ],
  "competitorNews": [
    {
      "competitor": "Greenhouse",
      "title": "Greenhouse Announces AI-Powered Interview Scheduling",
      "url": "https://www.greenhouse.io/blog/...",
      "date": "2026-03-30",
      "bullets": [
        "AI scheduling assistant finds optimal interview times across multiple calendars",
        "Reduces recruiter scheduling time by up to 80% according to Greenhouse",
        "Supports multi-panel interviews with timezone-aware coordination",
        "Targets mid-market and enterprise segments with self-service scheduling"
      ],
      "type": "feature-release",
      "workdayImplication": "Greenhouse closing scheduling gap; our native HCM calendar integration remains a differentiator"
    }
  ]
}
```

### Step 7a: Generate Manifest and Embed Nav Links

After writing `docs/morning-roundup-data.json`, generate navigation links for all dashboard pages:

1. **Scan for latest artefacts** using the same logic as `/workspace-audit` Step 5:
   - Latest deck: scan `~/Downloads/*_Roadmap_v*.pptx`, copy newest to `docs/downloads/`
   - Latest PRD: scan `docs/prds/*.md` (exclude `*-red-team*.md`)
   - Latest Design Brief: scan `design/*-design-brief*.md`
   - Latest Epic: scan `docs/epics/*.md` (exclude `README.md`)
2. **Read `design/main.tsx`** and extract all versioned route strings (regex for `'([\w-]+-v\d+)'`), pick the one with the highest version number
3. **Build nav-links JSON** with fully resolved URLs:
   ```json
   {
     "prototype": {"href": "http://localhost:5199/#/<latest-route>", "title": "<latest-route>"},
     "deck": {"href": "docs/downloads/<deck-filename>", "title": "<deck-filename>"},
     "prd": {"href": "docs/pm-agent-viewer.html?file=docs/prds/<prd-filename>", "title": "<prd-filename>"},
     "brief": {"href": "docs/pm-agent-viewer.html?file=design/<brief-filename>", "title": "<brief-filename>"},
     "epic": {"href": "docs/pm-agent-viewer.html?file=docs/epics/<epic-filename>", "title": "<epic-filename>"}
   }
   ```
4. **Embed into ALL dashboard HTML pages** by replacing the content of `<script id="nav-links" type="application/json">` tag in:
   - `docs/pm-agent-morning-roundup.html`
   - `docs/pm-agent-scorecard.html`
   - `docs/pm-agent-architecture.html`
   - `docs/pm-agent-design-system.html`
   - `docs/pm-agent-viewer.html`
5. **Also embed morning data** into `docs/pm-agent-morning-roundup.html` by replacing the content of `<script id="morning-data" type="application/json">` tag with the JSON from `docs/morning-roundup-data.json`

This ensures nav links stay current every time `/morning-roundup` runs, without any runtime `fetch()` calls.

### Step 8: Open in Browser

Open `http://localhost:8765/docs/pm-agent-morning-roundup.html` in Cursor browser using the `cursor-ide-browser` MCP `browser_navigate` tool.

## Error Handling

- If Jira queries return 0 results, include empty arrays in JSON (don't fail)
- If web search fails, include empty `competitorNews` array
- If JSON file write fails, report error to user
- If browser open fails, provide manual URL to user

## Output

User sees:
1. Confirmation message: "Morning Roundup generated with X action items, Y customer issues, Z competitor news"
2. Browser opens to Morning Roundup page automatically
3. Data is cached in `docs/morning-roundup-data.json` for page to load

## Notes

- **Run this skill fresh every morning** for latest data
- Jira queries use David's display name "David Denham" (not email)
- Competitor news searches prioritize announcements from past 7 days
- TLDRs should be actionable and concise (1-2 sentences max)
- Page always shows the last fetched data regardless of age; the timestamp indicates when data was last refreshed
- Nav links across all dashboard pages are refreshed every time this skill runs (Step 7a)
