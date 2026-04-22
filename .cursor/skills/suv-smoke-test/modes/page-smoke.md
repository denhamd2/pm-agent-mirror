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
- [ ] `.playwright/storageState.json` fresh.

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

1. **Load session + navigate.** `browser_navigate` to the URL.

2. **Wait for settle** - up to `max network wait` seconds. Two strategies:
   - If an anchor was provided: `browser_wait_for` on the anchor selector.
   - No anchor: wait 5s, then take two snapshots 1s apart and proceed when consecutive snapshots are stable (i.e. the DOM has stopped mutating).

3. **Capture snapshot.** `browser_snapshot`.

4. **Classify the page state** against four rubrics. Each rubric generates its own finding.

   **Rubric 1 - did anything render?**
   - Tree has a body with labelled regions (groups, headings, form controls) -> pass.
   - Tree is empty, or contains only a spinner / loading indicator, or contains a "Something went wrong" error region -> `[ERROR]` finding.

   **Rubric 2 - anchor present?** (only if anchor was provided)
   - Anchor found in tree -> pass.
   - Anchor missing -> `[WARNING]` finding: *"Expected anchor '<text>' not found; page rendered something else"*.

   **Rubric 3 - console clean?**
   - No console messages with severity `error` -> pass.
   - Any `error`-severity message -> `[WARNING]` or `[ERROR]` finding depending on content (e.g. "Uncaught TypeError" is `[ERROR]`; "deprecated API call" is `[WARNING]`).

   **Rubric 4 - network clean?**
   - All XHRs returned status 2xx or 3xx, no outstanding requests after settle -> pass.
   - Any 4xx/5xx -> `[ERROR]` finding with the failing URL + status code.
   - Outstanding requests after settle window -> `[WARNING]` finding: *"Page still fetching after <Ns>; may be slow or stuck"*.

5. **Aggregate verdict.**
   - All four rubrics pass -> `pass`.
   - At least one `[WARNING]` but no `[ERROR]` -> `pass with warnings`.
   - Any `[ERROR]` -> `fail`. Attach `browser_take_screenshot` for supplementary evidence.

6. **Close the browser.** `browser_close`.

7. **Emit findings report** per the shared output contract. Each rubric is a separate finding so `@xo-developer`'s triage protocol can route them independently (e.g. a 500 on an analytics beacon is an auto-apply suppression; a 500 on the primary page-data endpoint is an escalation).

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
  1. Pre-flight: URL is dev, storageState fresh
  2. browser_navigate -> URL
  3. browser_wait_for -> 5s fallback (no anchor)
  4. browser_snapshot -> tree has heading "Offer Details", form regions present
  5. Rubric 1: body rendered -> pass
  6. Rubric 2: skipped (no anchor)
  7. Rubric 3: console has 0 errors, 2 warnings (deprecated API) -> [WARNING] noted
  8. Rubric 4: 18 XHRs, all 2xx, no outstanding -> pass
  9. browser_close
     Verdict: pass with warnings
     Report:
       [INFO] page-smoke: page rendered cleanly at <URL>
       [WARNING] page-smoke: 2 console warnings for deprecated API calls
       [INFO] network clean, 18 XHRs 2xx
```

## End-of-run

- Browser closed.
- Findings report emitted.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain.
