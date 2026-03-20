#!/bin/sh
# Point this repo at version-controlled hooks and ensure they are executable.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
git config core.hooksPath .githooks
chmod +x .githooks/post-commit 2>/dev/null || true
echo "Git hooks path set to .githooks (post-commit will auto-push after each commit)."
echo "To disable: git config --unset core.hooksPath"
