# Morning Roundup Skill

**Trigger**: User says "/morning-roundup", "morning briefing", "daily roundup", "refresh morning roundup"

**Purpose**: Fetch David's Jira action items and competitor news, generate a fresh Morning Roundup dashboard for daily PM workflow.

## What This Skill Does

1. **Queries Jira** for action items requiring David's response
2. **Queries Jira** for customer escalations awaiting triage
3. **Searches web** for latest competitor news from major ATS vendors
4. **Generates JSON data** file with structured results
5. **Opens Morning Roundup page** in Cursor browser

## Steps

### Step 1: Query Jira for Action Items

Use `user-jira-ghe` MCP `searchJiraTickets` tool with JQL:

```
comment ~ "David Denham" AND updated >= -14d AND status not in (Done, Resolved, Closed) ORDER BY updated DESC
```

This finds Jiras where David was mentioned in comments over the past 2 weeks.

**Important**: This query returns tickets where David is mentioned in ANY comment. Step 3 will filter to only include tickets where David is mentioned in the **LATEST** comment.

### Step 2: Query Jira for Customer Escalations

Use `user-jira-ghe` MCP `searchJiraTickets` tool with JQL:

```
issuetype = Bug AND assignee = "David Denham" AND status in (Open, Reopened) ORDER BY updated DESC
```

This finds Bug-type issues assigned to David in Open or Reopened status.

**Post-processing filter**: After fetching ticket details in Step 3, check if the ticket has a non-empty Customer field (custom field names may vary: `customfield_XXXXX`, `Customer`, `Customer[Dropdown]`). Only include tickets with Customer data populated.

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
5. Extract the latest comment author, date, and body for TLDR generation

**Customer Issues filtering (from Step 2):**
1. For each ticket, check custom fields for Customer data
2. Look for fields like: `customfield_XXXXX`, `Customer`, `Customer[Dropdown]`
3. If Customer field is populated: INCLUDE in results
4. If Customer field is empty or null: DISCARD from results

### Step 4: Generate TLDRs

For each Jira:
- **Action Items**: Extract latest comment author, date, and body. Generate TLDR: "What is [commenter] asking David to do?"
- **Customer Issues**: Extract description and customer name. Generate TLDR: "What is the customer's problem in 1 sentence?"

Keep TLDRs to 1-2 sentences maximum, focusing on actionable information.

### Step 5: Search for Competitor News

Use `WebSearch` tool to find latest news from these competitors (past 7 days):
- Greenhouse
- Lever
- iCIMS
- SmartRecruiters
- Jobvite (Employ Inc)
- Oracle Taleo
- SAP SuccessFactors

**Search queries** (run 3-4 searches total, pick highest-value results):
1. "Greenhouse OR Lever OR iCIMS feature release announcement 2026"
2. "SmartRecruiters OR Jobvite AI recruiting announcement 2026"
3. "Oracle Taleo OR SAP SuccessFactors release notes latest"

Focus on:
- Feature releases
- AI/ML announcements
- Press releases
- Product updates

Return top 3 most relevant news items total (across all competitors).

### Step 6: Generate JSON Data File

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
      "tldrSummary": "Feature request for bulk candidate import with Excel"
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
      "created": "2026-03-29"
    }
  ],
  "competitorNews": [
    {
      "competitor": "Greenhouse",
      "title": "Greenhouse Announces AI-Powered Interview Scheduling",
      "url": "https://www.greenhouse.io/blog/...",
      "date": "2026-03-30",
      "summary": "Greenhouse released an AI scheduling assistant that automatically finds interview times across multiple calendars...",
      "type": "feature-release"
    }
  ]
}
```

### Step 7: Open in Browser

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
- Page will display stale data warning if JSON is > 24 hours old
