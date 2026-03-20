#!/usr/bin/env bash
# Open a URL in Google Chrome (new window) and in Cursor's Simple Browser (VS Code–compatible deeplink).
# Usage: ./scripts/open-url-chrome-and-cursor-browser.sh "https://..."
#
# Disable in dev: VITE_NO_OPEN_BROWSERS=1 npm run dev
# Skip Cursor (Chrome only): OPEN_IN_CURSOR_BROWSER=0

set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo "Usage: $0 <url>"
  exit 1
fi

url_encode() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"
}

# Built-in Simple Browser in VS Code / Cursor (same handler on many installs).
simple_browser_deeplink() {
  local enc
  enc="$(url_encode "$URL")"
  echo "vscode://vscode/simple-browser/show?url=${enc}"
}

open_chrome() {
  if [[ "$(uname -s)" == "Darwin" ]]; then
    if [[ -d "/Applications/Google Chrome.app" ]]; then
      open -na "Google Chrome" --args --new-window "$URL"
      return 0
    fi
  fi
  if command -v google-chrome-stable >/dev/null 2>&1; then
    google-chrome-stable --new-window "$URL" &
    return 0
  fi
  if command -v google-chrome >/dev/null 2>&1; then
    google-chrome --new-window "$URL" &
    return 0
  fi
  if command -v chromium >/dev/null 2>&1; then
    chromium --new-window "$URL" &
    return 0
  fi
  echo "[open-url] Google Chrome not found; skipping Chrome."
  return 1
}

open_cursor_simple_browser() {
  if [[ "${OPEN_IN_CURSOR_BROWSER:-1}" == "0" ]]; then
    return 0
  fi
  local link
  link="$(simple_browser_deeplink)"
  if command -v cursor >/dev/null 2>&1; then
    if cursor --open-url "$link" 2>/dev/null; then
      return 0
    fi
  fi
  if [[ "$(uname -s)" == "Darwin" ]]; then
    if open "$link" 2>/dev/null; then
      return 0
    fi
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    if xdg-open "$link" 2>/dev/null; then
      return 0
    fi
  fi
  echo "[open-url] Could not open Cursor Simple Browser (deeplink). URL: $URL"
  echo "[open-url] Open Command Palette → \"Simple Browser: Show\" and paste the URL, or use Chrome only (OPEN_IN_CURSOR_BROWSER=0)."
  return 1
}

echo "[open-url] Chrome: $URL"
open_chrome || true

echo "[open-url] Cursor Simple Browser: $URL"
open_cursor_simple_browser || true
