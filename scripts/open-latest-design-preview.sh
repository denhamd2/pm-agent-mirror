#!/usr/bin/env bash
# Wait for the "Deploy design prototype preview" run for the current HEAD, download preview.env, open in browser.
# Requires: gh auth login, optional jq or python3 for matching run by commit SHA.
#
# Full URL in preview.env when repo variable PAGES_PUBLIC_ORIGIN is set (e.g. https://ghe.megaleo.com).
# Otherwise set PM_AGENT_PAGES_ORIGIN locally before running.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT" ]]; then
  echo "Run from inside the pm-agent git repository."
  exit 1
fi
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install and auth GitHub CLI: brew install gh && gh auth login"
  exit 1
fi

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
HEAD_SHA="$(git rev-parse HEAD)"

pick_run_id_for_sha() {
  local json
  json="$(gh run list --repo "$REPO" --workflow=deploy-design-preview.yml --limit 30 --json databaseId,headSha)"
  if command -v jq >/dev/null 2>&1; then
    echo "$json" | jq -r --arg sha "$HEAD_SHA" 'map(select(.headSha == $sha)) | .[0].databaseId // empty'
  else
    echo "$json" | python3 -c '
import json, sys
sha = sys.argv[1]
data = json.load(sys.stdin)
for r in data:
    if r.get("headSha") == sha:
        print(r.get("databaseId", "") or "")
        break
' "$HEAD_SHA"
  fi
}

echo "Looking for workflow run for commit ${HEAD_SHA:0:7}…"
RUN_ID=""
for _ in {1..72}; do
  RUN_ID="$(pick_run_id_for_sha)"
  if [[ -n "$RUN_ID" ]]; then
    break
  fi
  sleep 5
done

if [[ -z "$RUN_ID" ]]; then
  echo "No \"Deploy design prototype preview\" run found for this commit (within ~6 minutes)."
  echo "Did you push a commit that touches design/ or the workflow? Open Actions on GHE to check."
  exit 1
fi

echo "Watching run $RUN_ID…"
gh run watch "$RUN_ID" --repo "$REPO" --exit-status

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

gh run download "$RUN_ID" --repo "$REPO" -n preview-open -D "$TMP"

ENV_FILE="$(find "$TMP" -name preview.env -print -quit || true)"
if [[ -z "$ENV_FILE" || ! -f "$ENV_FILE" ]]; then
  echo "Artifact preview-open (preview.env) missing. Check workflow permissions (actions: write) and upload step."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

URL="${PREVIEW_OPEN_URL:-}"
if [[ -z "$URL" ]]; then
  ORIGIN="${PM_AGENT_PAGES_ORIGIN:-}"
  if [[ -z "$ORIGIN" ]]; then
    echo "PREVIEW_OPEN_URL is empty. Either set repo Actions variable PAGES_PUBLIC_ORIGIN (recommended)"
    echo "or export PM_AGENT_PAGES_ORIGIN (e.g. https://ghe.megaleo.com) and re-run this script."
    echo "PREVIEW_PATH=${PREVIEW_PATH:-}"
    exit 1
  fi
  URL="${ORIGIN%/}${PREVIEW_PATH:-}"
fi

echo "Opening in Chrome + Cursor Simple Browser: $URL"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/open-url-chrome-and-cursor-browser.sh" "$URL"
