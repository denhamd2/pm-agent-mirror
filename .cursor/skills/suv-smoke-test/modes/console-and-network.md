# Mode: console-and-network

**Tier:** 1 (tail mode) • **Browser interaction:** No (reads from an existing browser session) • **Writes to SUV:** No

"Check for JS errors on this page." Lightweight tail mode that reads the current browser session's console messages and network requests, classifies them, and emits a findings report. No navigation, no clicks, no snapshot.

Primary use: standalone - the PM has noticed something "off" on a page open in the Playwright session and wants a quick classifier. Secondary use: callable by another mode as an inline sanity tail (but never auto-chained - the calling mode must explicitly reference this mode's contract).

## Worked Example Prompts

- "Check for JS errors on this page."
- "Pull network errors from the current session."
- "What did the console log?"
- "Any failed XHRs?"
- "Tail the console and network."
- `/suv-smoke-test console-and-network`

## Inputs

- None required - reads from the current `user-playwright-mcp` browser session.
- Optional: **severity floor** - one of `error` (default; only report console.error and XHR >= 400), `warning` (add console.warn and XHR >= 300), or `all` (everything). Most of the time the PM wants `error`.
- Optional: **URL pattern filter** - regex to limit network findings to XHRs whose URL matches. Useful when the page has noisy telemetry beacons.

## Pre-Flight

- [ ] `user-playwright-mcp` is reachable.
- [ ] A browser session is currently open. If no session is open, the mode refuses and tells the PM to start one by running `page-smoke` or `label-check` first, OR by re-running `auth-handshake` if their session expired.

## Tools Used

- `user-playwright-mcp`:
  - `browser_console_messages` - pulls the buffered console log.
  - `browser_network_requests` - pulls the buffered network log.

No navigation, no snapshot, no clicks, no close. The browser session remains as the caller left it.

## Flow

1. **Pull console messages.** `browser_console_messages`.

2. **Pull network requests.** `browser_network_requests`.

3. **Classify console messages:**
   - `error` severity -> `[ERROR]` finding per message with text + source file/line if available.
   - `warn` severity -> `[WARNING]` finding (suppressed if severity floor is `error`).
   - `info` / `log` / `debug` -> `[INFO]` finding (suppressed unless severity floor is `all`).

4. **Classify network requests:**
   - Status >= 500 -> `[ERROR]` with method + URL + status + response time if available.
   - Status 400-499 -> `[ERROR]` (client errors often indicate auth or schema problems).
   - Status 300-399 -> `[WARNING]` (redirects; often benign but worth flagging if unexpected).
   - Status 200-299 -> `[INFO]` (summary only: "N successful XHRs"); full list omitted unless severity floor is `all`.
   - Pending / unresolved after capture -> `[WARNING]` *"outstanding request at capture time"*.

5. **Apply URL pattern filter** if provided - include only matching XHRs in the findings.

6. **Emit findings report.** Because this is a tail mode, the aggregate verdict is scoped to just what was tailed:
   - Zero `[ERROR]` findings -> `pass` (tail-only; scope note: "no navigation; only reflects current session state").
   - Any `[WARNING]` without `[ERROR]` -> `pass with warnings`.
   - Any `[ERROR]` -> `fail`.

The scope note is important: a clean tail does NOT mean the page is healthy; it means nothing errored during whatever window the session has been alive for. Callers must frame this honestly.

## Guardrails

- **Never navigate.** Tail-only.
- **Never click, fill, snapshot, or close.** This mode touches state only to read it.
- **Never auto-invoke.** Must be triggered explicitly by the PM or referenced by another mode in that mode's documented flow.
- **Honest scope framing.** If the browser session was just opened (no navigation yet), the console and network buffers will be empty - a clean result here is meaningless. The mode detects this (session exists, zero network requests observed) and raises `[WARNING]` *"tail called on freshly-opened session; no meaningful activity to tail; consider page-smoke instead"*.

## Non-goals

- Anything that changes page state.
- Asserting that a specific log line is present.
- Real-time watching (this is a one-shot read of whatever the MCP has buffered).

## Example run

```
User: "Any console errors on the page I've got open?"

Mode:
  1. Pre-flight: browser session is open (page loaded 3 minutes ago)
  2. browser_console_messages -> 15 entries
     -> 1 error: "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')" at app.js:427
     -> 3 warnings: "deprecated API usage"
     -> 11 info/log
  3. browser_network_requests -> 42 entries
     -> 0 with status >= 400
     -> 42 with status 200
  4. Severity floor: error (default)
  5. Findings:
       [ERROR] console: TypeError at app.js:427 - "Cannot read properties of undefined (reading 'foo')"
       [INFO] network: 42 XHRs, all 2xx
     Verdict: fail (scope: tail of current session since navigation 3 min ago)
```

## End-of-run

- Browser session left untouched.
- Findings report emitted.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain to another mode.
