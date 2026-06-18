#!/usr/bin/env bash
# One-time GitHub Actions secrets setup for denhamd2/pm-agent-mirror
# Usage:
#   export TELEGRAM_BOT_TOKEN='your-bot-token-from-botfather'
#   export TELEGRAM_CHAT_ID='8046765892'   # optional; defaults below
#   ./scripts/ci_setup_github_secrets.sh

set -euo pipefail

REPO="${CI_GITHUB_REPO:-denhamd2/pm-agent-mirror}"
CHAT_ID="${TELEGRAM_CHAT_ID:-8046765892}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: brew install gh && gh auth login"
  exit 1
fi

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  echo "Set TELEGRAM_BOT_TOKEN (from @BotFather) and re-run."
  exit 1
fi

gh secret set TELEGRAM_BOT_TOKEN --repo "$REPO" --body "$TELEGRAM_BOT_TOKEN"
gh secret set TELEGRAM_CHAT_ID --repo "$REPO" --body "$CHAT_ID"

if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
  gh secret set ANTHROPIC_API_KEY --repo "$REPO" --body "$ANTHROPIC_API_KEY"
fi

if [[ -n "${SERPAPI_KEY:-}" ]]; then
  gh secret set SERPAPI_KEY --repo "$REPO" --body "$SERPAPI_KEY"
fi

echo "Secrets configured on $REPO"
echo "Trigger smoke test: gh workflow run competitive-intel-daily.yml --repo $REPO"
