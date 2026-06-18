# Scheduled competitive intelligence prompts

Use with **GHE Actions** (automated), **Claude Code Routines**, or manual Cursor/Claude invocation.

## Daily BRIEF (automated — GHA)

Handled by [`scripts/ci_daily_brief.py`](../../scripts/ci_daily_brief.py) and [`.github/workflows/competitive-intel-daily.yml`](../../.github/workflows/competitive-intel-daily.yml). No manual prompt required.

## Weekly deep (automated — GHA)

Handled by [`scripts/ci_weekly_deep.py`](../../scripts/ci_weekly_deep.py) and [`.github/workflows/competitive-intel-weekly-deep.yml`](../../.github/workflows/competitive-intel-weekly-deep.yml).

Set `ANTHROPIC_API_KEY` in GHE secrets for AI synthesis; otherwise a deterministic rollup is produced.

## Manual / Claude Routine — daily BRIEF

```
Run global competitive BRIEF monitor (not full deep scan).
Mission ID: DAILY-CI-{date}.
Region: Global.
Categories: M&A, product releases, leadership, analyst recognition (last 30 days).
Competitors: SAP/SmartRecruiters, Oracle, Greenhouse, iCIMS, Lever, SmartRecruiters.
Prior report: latest file matching research/competitive/global/global-competitive-scan-*-DAILY-CI-*.md
Skip repeating KNOWN signals already captured in that prior report.
Write report to research/competitive/global/global-competitive-scan-{date}-DAILY-CI-{date}.md
Append one-line changelog to research/competitive/matrices/global-competitive-matrix.md
Post Telegram digest to Saved Messages (competitive-intel digest format).
If no material new signals, say so explicitly in report and Telegram.
Gap classifications: label unvalidated against Deployment Agent if not checked.
```

Replace `{date}` with `YYYY-MM-DD`.

## Manual / Claude Routine — weekly deep

```
Run global competitive WEEKLY deep synthesis.
Mission ID: WEEKLY-CI-{date}.
Read all DAILY-CI reports from the last 7 days under research/competitive/global/.
Produce executive summary, themes, Workday implications, recommended actions.
Include SWOT paragraph for Workday Recruiting vs the combined competitor landscape if material themes emerged.
Write research/competitive/global/global-competitive-scan-{date}-WEEKLY-CI-{date}.md
Append matrix changelog. Post Telegram digest.
Validate critical gaps via Deployment Agent when MCP available; otherwise note unvalidated.
```

## Manual — on-demand deep scan (Cursor)

Use [@competitive-intel](../../.cursor/subagents/competitive-intel-agent.md) Pattern 1 (full deep research, 20+ queries).

Example: `competitive scan SAP and SmartRecruiters — do SWOT analysis`
