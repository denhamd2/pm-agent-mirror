# Mode: auth-handshake

**Tier:** 0 (bootstrap) • **Browser interaction:** Yes (user SSOs manually) • **Writes to SUV:** No • **Writes to workspace:** Yes (creates `.playwright/storageState.json`; gitignored)

"Set up Playwright auth for my SUV." One-time session bootstrap: opens a real browser and waits while the user SSOs into their dev SUV. Authenticated state persists in the Playwright MCP's **persistent browser profile** (the MCP server's own `user-data-dir`), which survives `browser_close` and MCP restarts - so every subsequent smoke mode inherits the logged-in session automatically.

As a **recovery artefact**, the mode also exports a backup of the session state to `.playwright/storageState.json`. This file is NOT auto-reloaded at the start of every smoke run (the Playwright MCP's sandbox cannot access Node `fs` to do that); it exists for forensic debugging and for future tooling that can inject storage state outside the sandbox. See [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle) for the full framing.

Must be re-run when any downstream mode's session-presence probe fires (login form detected after navigation) or reports a 401. Typical SSO session lifetime: 8-12 hours.

## Worked Example Prompts

- "Set up Playwright auth for my SUV."
- "SSO into my SUV for Playwright."
- "Refresh my Playwright session."
- "The smoke test said my session expired - fix it."
- `/suv-smoke-test auth-handshake`

## Inputs

- **SUV login URL**: the Workday SUV login page URL, e.g. `https://<tenant>.workday.com/<tenant>/login.flex`. If the user only has their tenant URL, accept that and the browser will redirect through login automatically.
- Optional: **custom storageState path** (defaults to `.playwright/storageState.json`). Rarely used; the PM workflow reuses the default.

## Pre-Flight

- [ ] **Playwright MCP is reachable**: confirm `user-playwright-mcp` tools are listed. If not, stop and tell the user to check Cursor's MCP panel.
- [ ] **Target SUV is dev, not shared**: hostname must not contain `shared`, `prod`, `staging`. If it does, refuse.
- [ ] **PM is ready to SSO manually**: this mode will pause and wait for the PM to complete their login (including MFA if required). Confirm they have 2-3 minutes and their auth app handy.
- [ ] **`.playwright/` directory exists** (create if missing) and `.playwright/` is in `.gitignore` (verify before writing).

If the `.gitignore` check fails, stop and ask the user to add `.playwright/` to `.gitignore` before proceeding. A committed `storageState.json` leaks session cookies.

## Tools Used

- `user-playwright-mcp`:
  - `browser_install` - one-time browser binary install (Playwright Chromium). Safe to call repeatedly; no-op when already installed.
  - `browser_navigate` - drives to the login URL.
  - `browser_wait_for` - pauses for the "you're logged in" signal (hostname change + accessibility-tree marker).
  - `browser_snapshot` - confirms the post-login landing page is reachable.
  - `browser_run_code` - exports the authenticated `storageState` to `.playwright/storageState.json` via Playwright's `context.storageState({ path })` API.
  - `browser_close` - tears the session down cleanly.

## Flow

1. **Confirm the bootstrap will happen.** Tell the PM, in one line: *"I'll open a browser, wait for you to SSO, then save the session to `.playwright/storageState.json`. This takes 2-3 minutes and happens once per ~8 hours."* Wait for `approve` before proceeding.

2. **Install the browser binary if needed.** Call `browser_install`. No-op if already installed; the tool handles that. If it fails, stop and report.

3. **Open the login page.** Call `browser_navigate` with the provided login URL. Resize to a reasonable desktop viewport via `browser_resize` (1440x900 recommended).

4. **Hand the browser to the PM and wait.** Print a visible message to the PM: *"Browser is open at `<URL>`. Please complete SSO and any MFA, then tell me `ready` when you're at the Workday home page."* Then pause for PM input.

   - If your runtime supports `browser_wait_for` with a longer timeout (3-5 minutes) and a selector that marks the post-login state (e.g. the home search bar), prefer that over a chat-level pause - the browser will auto-resume on successful login. Still expose the `ready` / `cancel` chat commands as a fallback.
   - If the PM says `cancel`, stop; call `browser_close` and report "auth handshake cancelled; no storageState written".

5. **Verify the PM is logged in.** Once the PM says `ready` (or `browser_wait_for` resolved), call `browser_snapshot`. Confirm the accessibility tree contains a post-login marker - typically the home search bar, the banner with the user's name, or the `Inbox` button. If the snapshot still shows a login form, the SSO did not complete; loop back to step 4 with a gentle prompt.

6. **Export the authenticated session (recovery backup only).** Call `browser_run_code` with a Playwright snippet that writes the storage state to the target path:

   ```js
   // Playwright context is available as `context`
   await context.storageState({ path: '.playwright/storageState.json' });
   return { ok: true, path: '.playwright/storageState.json' };
   ```

   If `browser_run_code` cannot see the `context` handle (known limitation of the Playwright MCP sandbox - no `require`, no `fs`, no dynamic import of Node modules), fall back to `browser_evaluate` with a script that reads what it can and write to disk via a shell helper outside the MCP. **Do not block the handshake on this step failing.** The persistent browser profile (next step) is what actually keeps the PM logged in for subsequent smoke runs; this file is a forensic backup.

7. **Verify the backup artefact (if written) exists and is gitignored.** Run a shell one-liner:

   ```bash
   [ -f .playwright/storageState.json ] && grep -q '^.playwright/' .gitignore && stat -f "mtime=%Sm size=%z path=%N" .playwright/storageState.json
   ```

   Report only: `{ exists: true, mtime: <ISO8601>, size_bytes: <N>, gitignored: true }`. If the file does not exist because step 6 hit a sandbox limitation, report `{ exists: false, reason: "sandbox could not reach context.storageState; primary auth still active via persistent profile" }` and proceed. **Never print the file's contents, cookies, tokens, or headers to chat.** Treat the storageState the same way you'd treat a password.

8. **Confirm the primary auth source is active.** The Playwright MCP's persistent browser profile now holds the authenticated session. Tell the PM:

   > *"Auth handshake complete. Primary auth: Playwright MCP's persistent browser profile (survives `browser_close`; every subsequent smoke mode will inherit this logged-in session automatically - no reload step required). Backup artefact: `.playwright/storageState.json` (mtime `<ISO8601>` if written; forensic only, not auto-reloaded). Expected SSO session lifetime: ~8-12 hours. Re-run this mode when any smoke mode's session-presence probe reports `session-expired`."*

   **Browser close is optional.** If the PM wants to immediately chain a smoke mode, leave the browser open and tell them so. If they plan to run smoke modes later, call `browser_close` to free resources - the persistent profile retains auth either way.

## Guardrails

- **Never commit `.playwright/storageState.json`.** Verify gitignored status at step 7 and refuse to proceed if it is not.
- **Never print the storageState content.** Not its cookies, not its headers, not its raw bytes. Metadata only.
- **Never auto-re-run.** If a downstream mode reports a stale session, surface the error and suggest this mode; do not re-handshake silently.
- **Never use this mode against a prod / shared tenant.** Pre-flight catches this; if a non-dev URL somehow reaches navigation, stop on first redirect.
- **One session per storageState.** Do not try to merge multiple logins into one file. If the PM needs to hit a second dev SUV, use a custom path (`.playwright/storageState-<suv-slug>.json`) and document the path choice for downstream modes.

## Non-goals

- Automating SSO (fragile, MFA-defeated, not worth it).
- Storing credentials anywhere other than `.playwright/storageState.json`.
- Managing multiple concurrent sessions automatically.
- Refreshing a stale session without PM interaction.

## Example run

```
User: "Set up Playwright auth for my SUV. The login URL is https://tenant-dev.workday.com/tenant-dev/login.flex"

Mode:
  1. Confirms: "I'll open a browser, wait for you to SSO, save the session. Approve?"
  2. User: "approve"
  3. browser_install  -> ok
  4. browser_navigate -> login page loads
  5. browser_resize   -> 1440x900
  6. "Browser is open at <URL>. Complete SSO + MFA, then tell me `ready`."
  7. User: "ready"
  8. browser_snapshot -> confirms home page markers present
  9. browser_run_code -> writes .playwright/storageState.json
 10. Shell check    -> exists, gitignored, mtime=2026-04-22T08:15:03Z, size=4821
 11. browser_close
 12. "Auth handshake complete. Session expires in ~8-12h; re-run if any smoke test reports 401."
```

## End-of-run

- Playwright MCP's persistent browser profile holds the authenticated session (this is the primary auth source for every subsequent smoke run).
- `.playwright/storageState.json` exists as a recovery backup, OR reports `{ exists: false }` with the sandbox-limitation reason if step 6 could not reach `context.storageState`. Either way, the persistent profile is active.
- Browser was closed via `browser_close`, OR left open because the PM wanted to chain a smoke mode immediately (confirm which before ending the turn).
- Do not write to `MISSION_LOG.md`. Do not invoke any rule.
- Ask the user if they want to run a smoke mode now that auth is set up, but do not auto-chain.
