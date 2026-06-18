# Scheduled competitive intel — setup and security checklist

Unattended daily CI runs via **GitHub Actions** (no Cursor Cloud Agents). Weekly deep synthesis is optional via the same platform or Claude Code Routines.

## Where Actions run

**Primary:** push workflows to the **github.com mirror** (`ghmirror` → `denhamd2/pm-agent-mirror`). Cloud routines and GitHub Actions cannot reach corporate GHE; the mirror is the unattended host.

```bash
git push ghmirror main   # after merging CI workflow changes
```

Corporate GHE (`origin`) can hold the same files for source control, but **scheduled cron** should be enabled on the github.com mirror repo (Settings → Actions → General → allow scheduled workflows).

## Architecture

| Tier | Workflow | Script | Schedule |
|------|----------|--------|----------|
| **Daily BRIEF** | [`.github/workflows/competitive-intel-daily.yml`](../../.github/workflows/competitive-intel-daily.yml) | [`scripts/ci_daily_brief.py`](../../scripts/ci_daily_brief.py) | Weekdays 07:00 UTC |
| **Weekly deep** | [`.github/workflows/competitive-intel-weekly-deep.yml`](../../.github/workflows/competitive-intel-weekly-deep.yml) | [`scripts/ci_weekly_deep.py`](../../scripts/ci_weekly_deep.py) | Mondays 08:00 UTC |

Manual runs: **Actions → workflow → Run workflow** (`workflow_dispatch`).

## Required GHE secrets

Configure at **repo or org** level (Settings → Secrets and variables → Actions). Confirm with Workday security before adding.

| Secret | Required | Purpose |
|--------|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Yes (for notifications) | Bot token from [@BotFather](https://t.me/BotFather); used by HTTP API, not MCP |
| `TELEGRAM_CHAT_ID` | Yes | Target chat: your numeric user id (Saved Messages via bot) or private channel id |
| `SERPAPI_KEY` | No | Optional richer web search; daily script uses Google News RSS without it |
| `ANTHROPIC_API_KEY` | No | Weekly deep synthesis; without it, weekly job produces a deterministic rollup from daily briefs |

**Never commit tokens.** Rotate any token that appeared in chat logs or local settings files.

### Finding `TELEGRAM_CHAT_ID`

1. Message your bot once from the account that should receive digests.
2. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` and read `message.chat.id`.
3. Store that id as `TELEGRAM_CHAT_ID`.

## Security / policy checklist (confirm with IT)

- [ ] **Scheduled workflows** enabled on this GHE repo (org policy may restrict `schedule` cron).
- [ ] **Outbound network** from GHE runners to `news.google.com`, `api.telegram.org`, and optionally `serpapi.com` / `api.anthropic.com`.
- [ ] **Auto-commit to `main`** approved for bot commits from Actions (daily state + reports under `research/competitive/`).
- [ ] **Telegram bot** acceptable for internal competitive summaries (public sources only; no customer data in prompts).
- [ ] **Anthropic API** (weekly only) approved if using AI synthesis; otherwise weekly job runs without it.

## What CI cannot do (vs interactive Cursor agent)

- No Deployment Agent, Salomon, XO MCP, or Confluence MCP in Actions.
- Daily tier is **signal detection** from public RSS/search feeds, not full 20-query deep scans.
- Gap classifications in automated reports are labelled **unvalidated against Deployment Agent**.

For full MCP-heavy scans, run [`@competitive-intel`](../../.cursor/subagents/competitive-intel-agent.md) manually in Cursor or use a **Claude Code Routine** if Anthropic cloud execution is approved.

## Outputs

| Artifact | Path |
|----------|------|
| Daily report | `research/competitive/global/global-competitive-scan-YYYY-MM-DD-DAILY-CI-YYYY-MM-DD.md` |
| Weekly report | `research/competitive/global/global-competitive-scan-YYYY-MM-DD-WEEKLY-CI-YYYY-MM-DD.md` |
| Delta state | `research/competitive/.ci-last-run.json` |
| Matrix changelog | One-line append in [`research/competitive/matrices/global-competitive-matrix.md`](../../research/competitive/matrices/global-competitive-matrix.md) |

## Local test

```bash
# Dry run (no telegram, no matrix write)
python3 scripts/ci_daily_brief.py --dry-run

# Full run (set env vars first)
export TELEGRAM_BOT_TOKEN=...
export TELEGRAM_CHAT_ID=...
python3 scripts/ci_daily_brief.py
```

**macOS note:** If RSS fetches fail with `CERTIFICATE_VERIFY_FAILED`, run Python's **Install Certificates** command or test via GHE Actions (Ubuntu runners have valid CA bundles).

Weekly:

```bash
python3 scripts/ci_weekly_deep.py --dry-run
export ANTHROPIC_API_KEY=...  # optional
python3 scripts/ci_weekly_deep.py
```

## Claude Code Routine (alternative weekly deep)

If GHE Anthropic API is blocked but Claude Routines are allowed, use the prompt in [`ci-scheduled-prompt.md`](ci-scheduled-prompt.md) at [claude.ai/code/routines](https://claude.ai/code/routines).
