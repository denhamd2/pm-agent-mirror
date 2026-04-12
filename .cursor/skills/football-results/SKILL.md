# Football Results Skill

**Trigger**: User says "/football-results", "football scores", "Premier League results", "PL results"

**Purpose**: Fetch the latest Premier League football results and standings, generate a JSON data file, and open a dedicated HTML dashboard in the Cursor browser.

## What This Skill Does

1. **Searches web** for the latest Premier League results and current table standings.
2. **Parses and structures** the results into a JSON format.
3. **Generates JSON data** file with structured results.
4. **Embeds data** into the football dashboard HTML.
5. **Opens Football Results page** in Cursor browser.

## Steps

### Step 1: Web Search for Latest PL Results

Use the `WebSearch` tool to find the latest Premier League results and standings. Run 2-3 searches:
1. "Premier League results today 2026" or "Premier League scores this week 2026"
2. "Premier League table standings 2026"

### Step 2: Parse and Structure Results

Extract the following information from the search results:
- **Matchday**: The current matchday or gameweek (e.g., "Matchday 32")
- **Recent Results**: A list of the most recent matches, including:
  - Date of the match
  - Home team name
  - Away team name
  - Home team score
  - Away team score
  - Matchday
- **League Table**: The top 6 teams in the current standings, including:
  - Position (pos)
  - Team name
  - Played matches
  - Won
  - Drawn
  - Lost
  - Goal Difference (gd)
  - Points (pts)

### Step 3: Generate JSON Data File

Write the structured results to `docs/football-results-data.json`:

```json
{
  "generated": "2026-04-02T15:00:00Z",
  "matchday": "Matchday 32",
  "results": [
    {
      "date": "2026-04-01",
      "home": "Arsenal",
      "away": "Chelsea",
      "homeScore": 2,
      "awayScore": 1,
      "matchday": 32
    }
  ],
  "table": [
    {"pos": 1, "team": "Arsenal", "played": 31, "won": 22, "drawn": 5, "lost": 4, "gd": 38, "pts": 71}
  ]
}
```

### Step 4: Embed Data into Dashboard HTML

Read the `docs/pm-agent-football.html` file.
Replace the content of the `<script id="football-data" type="application/json">` tag with the newly generated JSON data from Step 3.
Write the updated HTML back to `docs/pm-agent-football.html`.

### Step 5: Open in Browser

Open `http://localhost:8765/docs/pm-agent-football.html` in the Cursor browser using the `cursor-ide-browser` MCP `browser_navigate` tool.

## Error Handling

- If web search fails or returns no results, include empty arrays in the JSON (don't fail).
- If JSON file write fails, report the error to the user.
- If browser open fails, provide the manual URL to the user.

## Output

User sees:
1. Confirmation message: "Football results fetched and dashboard updated."
2. Browser opens to the Football Results page automatically.
3. Data is cached in `docs/football-results-data.json` for the page to load.

## Notes

- This is a personal/leisure skill.
- Re-running overwrites previous data cleanly.
- Uses British English spelling.
