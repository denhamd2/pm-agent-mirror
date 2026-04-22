# Mode: label-check

**Tier:** 1 (read-only) • **Browser interaction:** No clicks (nav + snapshot only) • **Writes to SUV:** No

"Confirm my label change actually rendered." Post-write companion for [`copy-edit`](../../xo-builder/modes/copy-edit.md). Navigates to the target page, captures an accessibility-tree snapshot, asserts the new `overrideLabel` / `helpText` / `automationId` value appears, and pulls console + network as a sanity tail.

Catches the three most common "metadata patched, UI didn't update" failure modes:

1. **Stale cache** - UI still serving the old value from a CDN / localStorage cache.
2. **Unbound label** - `overrideLabel` set on an element content that is not actually bound to the rendered field.
3. **Role-gated element** - the PM's role does not see the element they changed; they patched one they can't see.

## Worked Example Prompts

- "Confirm the label change I just made renders on `/d/task/1$12345`."
- "Did the 'Required By' rename actually show up in the UI?"
- "Verify copy-edit on the Offer Amount help text."
- "Check the help text for element `<WID>` is visible."
- `/suv-smoke-test label-check`

## Inputs

- **SUV page URL**: full URL of the page where the changed element should render. Not a WID. Example: `https://<tenant>.workday.com/d/task/1$12345/...`.
- **Expected label / help text / automation ID value**: what the user should see after the copy-edit. Must match exactly (whitespace included). If the PM only has "Priority Offer", accept that and use substring match.
- **Field to verify**: one of `label`, `helpText`, `automationId`. Defaults to `label` if the PM doesn't specify.
- Optional: **anchor text near the field** (e.g. the section header) - helps disambiguate when the label appears multiple times on the page.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes-except-auth-handshake) passed.
- [ ] Target URL is a dev SUV (no `shared`, `prod`, `staging`).
- [ ] Expected value captured verbatim.

Authentication is NOT gated on storageState mtime. The session-presence probe at Flow step 2 detects unauthenticated state at runtime and routes the PM to [`auth-handshake`](auth-handshake.md) if needed. See [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle).

## Tools Used

- `user-playwright-mcp`:
  - `browser_navigate` - driven with the stored session.
  - `browser_wait_for` - waits for the page to settle (either an explicit selector if the PM provided one, or a short fixed timeout of 3-5 seconds as fallback).
  - `browser_snapshot` - captures the accessibility tree. Primary evidence source.
  - `browser_console_messages` - tail pull for JS errors.
  - `browser_network_requests` - tail pull for failed XHRs (status >= 400).
  - `browser_take_screenshot` - **only on failure**, attached to the finding as supplementary evidence.
  - `browser_close` - end-of-run cleanup.

## Flow

1. **Navigate.** Call `browser_navigate` with the SUV page URL. The Playwright MCP's persistent browser profile supplies the authenticated session automatically (see [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle)).

2. **Session-presence probe.** Call `browser_snapshot` once the navigation settles. Scan the accessibility tree for login-indicator markers (heading `Sign In` / `Single Sign-On`, a `form` with `Username` + `Password` textboxes, or a post-navigation URL containing `/login` / `/sso` / `/saml`). If any marker is present, stop immediately, emit a single `[ERROR]` tagged `session-expired` recommending `/suv-smoke-test auth-handshake`, call `browser_close`, and return. Do not continue to step 3.

3. **Wait for settle.** Either:
   - The PM provided an anchor selector -> `browser_wait_for` on that selector.
   - No anchor -> fixed 3-5s wait, then `browser_snapshot` twice with a 1s gap; proceed when consecutive snapshots are stable.

4. **Capture the accessibility tree.** Call `browser_snapshot`.

5. **Assert the expected value is present.** Two-stage match:
   - **Primary**: substring match on the expected value, scoped to the nearest accessible region containing the PM's anchor text (if provided). Accessibility-tree node types relevant: `label`, `text`, `textbox` (for help text shown as inline), `group` headers.
   - **Fallback**: full-tree substring match if no anchor was provided.

6. **Handle the three outcome cases:**

   **Case A - match found.** Finding:
   ```
   [INFO] label-check: "<expected value>" found at <tree-path>
     Scope: element content for "<field name>" on <URL>
     Evidence: snippet of accessibility tree showing the match
   ```
   Then tail-pull console + network for a secondary sanity check. If both are clean, verdict = `pass`. If console has warnings or network has non-2xx calls, add `WARNING` findings and verdict = `pass with warnings`.

   **Case B - old value still present.** Finding:
   ```
   [ERROR] label-check: expected "<expected value>", found "<old value>" at <tree-path>
     Likely cause: stale cache or PM viewing a cached tab
     Suggested next step: hard-refresh (Cmd-Shift-R) and re-run; if still failing, check element content binding
   ```
   Verdict = `fail`.

   **Case C - neither expected nor known-old value present.** Finding:
   ```
   [ERROR] label-check: "<expected value>" not found anywhere on page
     Likely cause: element content WID patched was not bound to any rendered field, or field is role-gated
     Suggested next step: run xo-builder page-discovery on this task to confirm the element content binding
   ```
   Verdict = `fail`. Attach a screenshot via `browser_take_screenshot` for the PM's eyeballs since the tree alone may not make the problem obvious.

7. **Tail the console and network.** Call `browser_console_messages` and `browser_network_requests`. Any `error`-severity console entry or any XHR with status >= 400 becomes a `WARNING` finding in its own right (scope: the URL, not the element content).

8. **Close the browser.** `browser_close`.

9. **Emit the findings report** per the output contract in [../SKILL.md](../SKILL.md#output-contract-shared-by-every-smoke-mode). Machine-triageable. `@xo-developer` (if the caller) consumes this and generates the PM-friendly recap per [Advisory #17](../../../agents/xo-developer-refs/advisory-playbook.md).

## Guardrails

- **Never click on anything.** This is a read-only verification. No links, no buttons, no form fills.
- **Never hard-refresh programmatically.** If cache is suspected, surface it as a finding and ask the PM to refresh.
- **Never print the storageState content.** Metadata only; see [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle).
- **Never batch across multiple element contents in one run.** If the PM wants to verify three renames, run the mode three times.
- **One page per run.** If the label should appear on two pages, ask the PM to specify which one matters and run the mode again if needed.

## Non-goals

- Asserting layout, styling, or position (use a screenshot-based tool for that, not this).
- Confirming the metadata itself (that's `@xo-code-reviewer`'s job).
- Bulk-verification across a task.
- Cross-tenant checks.

## Example run

```
User: "Confirm the 'Priority Offer' label renders on <SUV URL>."

Mode:
  1. Pre-flight: URL is dev; session-presence probe will run post-navigation
  2. browser_navigate -> <SUV URL>, loaded with saved session
  3. browser_wait_for / settle
  4. browser_snapshot -> captures tree
  5. Substring search for "Priority Offer" in tree -> match at <path>
  6. Finding: [INFO] label-check: "Priority Offer" found at group[Offer Details]>label
  7. Console tail: clean
  8. Network tail: all 200
  9. browser_close
 10. Verdict: pass
     Report:
       [INFO] label-check: "Priority Offer" rendered at <path> on <URL>
       [INFO] console clean, 12 XHRs all 200-299
```

## End-of-run

- Browser closed.
- Findings report emitted.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain. If caller is `@xo-developer`, the orchestrator hands findings back to `@xo-developer` for triage.
