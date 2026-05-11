#!/usr/bin/env bash
# Publish design/dashboard-public-dist to branch gh-pages (GHE / GitHub Pages catalogue).
# Uses a temp worktree so we never rsync --delete into the main repo root.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/design/dashboard-public-dist"
WT="${DEPLOY_GH_PAGES_WORKTREE:-/tmp/pm-agent-gh-pages-deploy}"

if [[ ! -f "$ROOT/design/package.json" ]]; then
  echo "Run from repo root context; expected $ROOT/design/package.json" >&2
  exit 1
fi

cd "$ROOT"
git fetch origin gh-pages 2>/dev/null || true

rm -rf "$WT"
mkdir -p "$WT"
git worktree add "$WT" gh-pages

# dashboard-public-dist has no .git; still exclude so worktree metadata is never deleted.
cd "$ROOT/design"
npm ci
VITE_BASE_PATH=/pages/david-denham/pm-agent/ npm run build:public

rsync -av --delete --exclude '.git' "$DIST/" "$WT/"

cd "$WT"
git add -A
if git diff --staged --quiet; then
  echo "No changes to publish."
else
  git commit -m "Deploy public prototype catalogue (scripts/deploy-public-pages.sh)"
  git push origin gh-pages
fi

cd "$ROOT"
git worktree remove "$WT" --force

echo "Done. Tip: confirm Pages serves branch gh-pages and hard-refresh the site."
