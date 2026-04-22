# SUV Smoke Test - Mode Index

Machine-readable index of every mode in `suv-smoke-test/modes/`. Each entry lists: tier, browser-interaction flag, SUV-write flag, primary Playwright tools, and complete trigger phrase list.

Use this file to check "is X covered by suv-smoke-test?" without reading the full dispatcher.

Every mode below can be invoked two ways: via the direct skill trigger (as listed per mode) **or** via the `@qa-engineer` subagent ([.cursor/agents/qa-engineer-agent.md](../../agents/qa-engineer-agent.md)), which runs the same mode with a Principal QA Engineer advisory layer on top.

---

## Tier 0 - Bootstrap (one-time, re-run when session expires)

### `modes/auth-handshake.md`
- **Browser interaction:** Yes (user SSOs manually into the SUV)
- **Writes to SUV:** No
- **Primary auth mechanism:** Playwright MCP's persistent browser profile (survives `browser_close` and MCP restarts; every subsequent smoke mode inherits the logged-in session automatically - no reload step required).
- **Writes to workspace:** Yes, recovery-backup only (creates `.playwright/storageState.json`; gitignored). This backup is NOT auto-reloaded by downstream modes; it exists for forensic debugging. See [SKILL.md#authentication-lifecycle](SKILL.md#authentication-lifecycle).
- **Primary tools:** `browser_install`, `browser_navigate`, `browser_snapshot`, `browser_wait_for`, `browser_run_code` (for the recovery-backup export; allowed to fail without blocking handshake completion)
- **Triggers:**
  - `/suv-smoke-test auth-handshake`
  - "set up Playwright auth"
  - "SSO into my SUV for Playwright"
  - "bootstrap QA engineer auth"
  - "refresh my Playwright session"

---

## Tier 1 - Read-only smoke checks (no SUV writes, browser nav + inspection only)

### `modes/label-check.md`
- **Browser interaction:** No (navigation + snapshot only; no clicks)
- **Writes to SUV:** No
- **Primary tools:** `browser_navigate`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests`
- **Post-write companion for:** [xo-builder `copy-edit` mode](../xo-builder/modes/copy-edit.md)
- **Triggers:**
  - `/suv-smoke-test label-check`
  - "confirm my label change rendered"
  - "verify copy-edit on the UI"
  - "did the label actually update"
  - "check the help text shows up"

### `modes/page-smoke.md`
- **Browser interaction:** No (navigation + snapshot only)
- **Writes to SUV:** No
- **Primary tools:** `browser_navigate`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests`, `browser_take_screenshot` (only on failure)
- **Post-write companion for:** [xo-builder `modulr-page` mode](../xo-builder/modes/modulr-page.md) and any Tier 2 write that could break a page
- **Triggers:**
  - `/suv-smoke-test page-smoke`
  - "does the page render"
  - "smoke test the ModulR page"
  - "is the page loading"
  - "sanity check this URL"

### `modes/method-regression.md`
- **Browser interaction:** Nav + click to trigger the consumer page
- **Writes to SUV:** No (method execution is read-only from the test's perspective)
- **Primary tools:** `browser_navigate`, `browser_click`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests`
- **Post-write companion for:** [xo-builder `method-edit` mode](../xo-builder/modes/method-edit.md)
- **Triggers:**
  - `/suv-smoke-test method-regression`
  - "check this method still works"
  - "verify my method-edit didn't break the UI"
  - "test the method-edit downstream"
  - "regress the method I just changed"

### `modes/console-and-network.md`
- **Browser interaction:** No (tail mode; reads state from an existing browser session)
- **Writes to SUV:** No
- **Primary tools:** `browser_console_messages`, `browser_network_requests`
- **Invocation:** Callable standalone, or as a tail step from any other mode (not auto-chained).
- **Triggers:**
  - `/suv-smoke-test console-and-network`
  - "check for JS errors on this page"
  - "pull network errors"
  - "what did the console log"
  - "any failed XHRs"

---

## Tier 1 - Form-fill smoke checks (form interaction only; no final persist)

### `modes/validation-fire.md`
- **Browser interaction:** Yes (fills form fields, triggers blur/submit short of persist)
- **Writes to SUV:** No (mode refuses to click final Submit / Save / Done; only fills + triggers validation evaluation)
- **Primary tools:** `browser_navigate`, `browser_fill_form`, `browser_click` (only on non-persist elements), `browser_snapshot`, `browser_wait_for`
- **Post-write companion for:** [xo-builder `validation-edit` mode](../xo-builder/modes/validation-edit.md)
- **Triggers:**
  - `/suv-smoke-test validation-fire`
  - "prove the validation fires"
  - "trigger the validation rule"
  - "test the validation I just added"
  - "show me the error message"

---

## Non-goals (explicitly not covered by any mode in v1)

- Visual regression / pixel diff (use `browser_take_screenshot` manually if the PM insists; not a first-class mode).
- Load / perf testing.
- Cross-browser matrix (Playwright MCP drives one browser at a time).
- Production-tenant checks (refused by global pre-flight).
- Persistent regression suites (route to WATS via [xo-builder `wats-scenario` mode](../xo-builder/modes/wats-scenario.md)).
- Auto-promoting a passing smoke to WATS (flagged as future v2 work).

If the user asks for any of these, decline and route to the appropriate alternative.

---

## Umbrella triggers (open catalogue menu, no mode selected)

- `/suv-smoke-test`
- "smoke test my SUV change"
- "QA this"
- "verify my XO edit"
- "check the UI renders"
- "is the label actually showing up"
