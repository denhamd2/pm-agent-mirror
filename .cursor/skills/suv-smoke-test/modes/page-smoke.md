# Mode: page-smoke

**Tier:** 1 (read-only) • **Browser interaction:** No (nav + snapshot only) • **Writes to SUV:** No

"Does the page render." Post-write companion for any mode that could have broken a page - primarily [`modulr-page`](../../xo-builder/modes/modulr-page.md), but also useful after broad `method-edit` or `prompt-edit` changes that could cascade to a page load.

The quickest sanity check in the catalogue: navigate, snapshot, confirm the page has a recognisable rendered state (not blank, not error banner, not spinner that never resolves), and tail console + network.

Callable as a tail step from other modes - but only explicitly by the user or `@qa-engineer`; never auto-chained.

## Worked Example Prompts

- "Does the page at <URL> render?"
- "Smoke test the ModulR page I just built."
- "Sanity check this URL."
- "Is the page loading cleanly?"
- "Quick smoke on the Offer page."
- `/suv-smoke-test page-smoke`

## Inputs

- **SUV page URL**: full URL.
- Optional: **anchor selector** - an accessible label or role that the PM knows should be present (e.g. "Offer Details", "Submit for Approval"). Helps the mode settle cleanly without a fixed timeout.
- Optional: **max network wait** - seconds to wait for network to settle before snapshotting. Default 5s.

## Pre-Flight

- [ ] Global pre-flight passed.
- [ ] URL is dev SUV.
- [ ] Authentication is NOT gated on storageState mtime - the session-presence probe at Flow step 2 handles expired sessions at runtime. See [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle).

## Tools Used

- `user-playwright-mcp`:
  - `browser_navigate`
  - `browser_wait_for` - settle.
  - `browser_snapshot` - primary evidence.
  - `browser_console_messages` - full tail.
  - `browser_network_requests` - full tail; classify by status code and URL pattern.
  - `browser_take_screenshot` - on failure only.
  - `browser_close`.

## Flow

1. **Navigate.** `browser_navigate` to the URL. The Playwright MCP's persistent browser profile supplies the authenticated session automatically.

2. **Session-presence probe.** Call `browser_snapshot` immediately. Scan for login-indicator markers (heading `Sign In` / `Single Sign-On`, a `form` with `Username` + `Password` textboxes, or a post-navigation URL containing `/login` / `/sso` / `/saml`). If any marker is present, stop immediately, emit `[ERROR] session-expired` recommending `/suv-smoke-test auth-handshake`, call `browser_close`, and return.

3. **Wait for settle** - up to `max network wait` seconds. Two strategies:
   - If an anchor was provided: `browser_wait_for` on the anchor selector.
   - No anchor: wait 5s, then take two snapshots 1s apart and proceed when consecutive snapshots are stable (i.e. the DOM has stopped mutating).

4. **Capture primary snapshot.** `browser_snapshot`.

5. **Classify the page state** against four rubrics. Each rubric generates its own finding.

   **Rubric 1 - did anything render?**
   - Tree has a body with labelled regions (groups, headings, form controls) -> pass.
   - Tree is empty, or contains only a spinner / loading indicator, or contains a "Something went wrong" error region -> `[ERROR]` finding.

   **Rubric 2 - anchor present?** (only if anchor was provided)
   - Anchor found in tree -> pass.
   - Anchor missing -> `[WARNING]` finding: *"Expected anchor '<text>' not found; page rendered something else"*.

   **Rubric 3 - console clean?**
   - No console messages with severity `error` -> pass.
   - Any `error`-severity message -> candidate for `[WARNING]` or `[ERROR]` finding depending on content (e.g. "Uncaught TypeError" is `[ERROR]`; "deprecated API call" is `[WARNING]`).
   - **Allowlist lookup**: before emitting each candidate, check its source URL / message text against [`../noise-allowlist.md`](../noise-allowlist.md) entries with `scope: console` or `scope: both`. On match, downgrade to `[INFO]` and tag the evidence line with `(allowlisted noise: <entry-id>)`. See the skill-level allowlist contract in [`../SKILL.md#noise-allowlist`](../SKILL.md#noise-allowlist).

   **Rubric 4 - network clean?**
   - All XHRs returned status 2xx or 3xx, no outstanding requests after settle -> pass.
   - Any 4xx/5xx -> candidate for `[ERROR]` finding with the failing URL + status code.
   - Outstanding requests after settle window -> `[WARNING]` finding: *"Page still fetching after <Ns>; may be slow or stuck"*.
   - **Allowlist lookup**: before emitting each non-2xx / non-3xx candidate, check the request URL against [`../noise-allowlist.md`](../noise-allowlist.md) entries with `scope: network` or `scope: both`. On match, downgrade to `[INFO]` and tag the evidence line with `(allowlisted noise: <entry-id>)`.

   After both rubrics run, emit one rolled-up `[INFO]` summary if any allowlist matches fired:
   > `[INFO] noise-allowlisted-matches: N patterns matched; M console events and K network events auto-downgraded. See .cursor/skills/suv-smoke-test/noise-allowlist.md.`

6. **Aggregate verdict.**
   - All four rubrics pass -> `pass`.
   - At least one `[WARNING]` but no `[ERROR]` -> `pass with warnings`.
   - Any `[ERROR]` -> `fail`. Attach `browser_take_screenshot` for supplementary evidence.
   - Allowlist-downgraded `[INFO]` entries do NOT contribute to the verdict.

7. **Close the browser.** `browser_close`.

8. **Emit findings report** per the shared output contract. Each rubric is a separate finding so `@xo-developer`'s triage protocol can route them independently (e.g. a 500 on an analytics beacon is an auto-apply suppression; a 500 on the primary page-data endpoint is an escalation).

## Guardrails

- **Never click on anything.** Pure read.
- **Never fill anything.** Pure read.
- **Never loop / retry.** One navigation, one settle window, one snapshot. If the PM wants a "wait-and-retry" behaviour, they should pick a more specific mode.
- **Never run against prod.**

## Non-goals

- Asserting layout, performance budgets, or styling.
- Asserting specific values on the page (use `label-check` or `method-regression` for that).
- Multi-page crawl.

## Example run

```
User: "Smoke test https://<tenant>.workday.com/d/task/1$12345/..."

Mode:
  1. Pre-flight: URL is dev; session-presence probe runs post-navigation
  2. browser_navigate -> URL
  3. browser_snapshot (session probe) -> no login markers, continue
  4. browser_wait_for -> 5s fallback (no anchor)
  5. browser_snapshot (primary) -> tree has heading "Offer Details", form regions present
  6. Rubric 1: body rendered -> pass
  7. Rubric 2: skipped (no anchor)
  8. Rubric 3: console has 0 uncaught errors; 1 CORS error on CDN toggles endpoint -> allowlist match (cdn-toggles-cors-fallback) -> downgraded to [INFO]
  9. Rubric 4: 18 XHRs; 2 failures on CDN toggles + uxinsights beacon -> both allowlist matches -> downgraded to [INFO]; remaining 16 all 2xx
 10. browser_close
     Verdict: pass
     Report:
       [INFO] page-smoke: page rendered cleanly at <URL>
       [INFO] noise-allowlisted-matches: 2 patterns matched; 1 console event and 2 network events auto-downgraded. See .cursor/skills/suv-smoke-test/noise-allowlist.md.
       [INFO] network clean, 16 primary XHRs 2xx (+2 allowlisted)
```

## End-of-run

- Browser closed.
- Findings report emitted.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain.
