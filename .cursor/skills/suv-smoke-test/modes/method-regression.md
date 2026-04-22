# Mode: method-regression

**Tier:** 1 (read-only, single click allowed to trigger consumer) • **Browser interaction:** Nav + one click to trigger the consumer page • **Writes to SUV:** No

"Check this method still works in the UI." Post-write companion for [`method-edit`](../../xo-builder/modes/method-edit.md). Navigates to a page that consumes the edited method (e.g. a button that invokes a BA method, a page that displays an EC method's derived value), captures a `browser_snapshot`, and diffs it against a cached baseline (if one exists) or reports the current state for PM review.

Catches the most common "method metadata updated, consumer page breaks" failure modes:

1. **Expression regression** - the edited expression throws at runtime (empty UI, error banner, 500 on an XHR).
2. **Return-shape change** - the method now returns a different type or column set and the consumer UI binds to the old shape.
3. **Permission drift** - the PM edited a method they don't have execute rights on in this context.

## Worked Example Prompts

- "Check the `calculateOfferAmount` method still works on the Offer page."
- "Regress the method I just changed."
- "Verify my method-edit didn't break the consumer UI at <URL>."
- "Make sure the derived field still renders after the method change."
- `/suv-smoke-test method-regression`

## Inputs

- **Consumer page URL**: full URL of the page that consumes the edited method.
- **Method WID** or **method name**: for scoping the finding back to the XO artefact. If only a name is provided, the mode records the name but cannot cross-check without a WID.
- **Consumer locator**: where on the page the method's effect shows up. Options:
  - An accessible label (e.g. "Offer Amount") - the mode will find the field and capture its rendered value.
  - A button label (e.g. "Calculate Now") - the mode will click it once and capture post-click state.
  - "Whole page" - the mode captures a full snapshot with no click.
- Optional: **baseline snapshot path** - if the PM has run this mode before against the same consumer, the mode compares current to baseline. Baselines live in `.playwright/baselines/<slug>.json` (gitignored); naming convention `<method-WID-or-slug>-<consumer-url-slug>.json`.

## Pre-Flight

- [ ] Global pre-flight passed.
- [ ] Consumer URL is dev SUV.
- [ ] Method WID or name captured for finding scope.
- [ ] `.playwright/storageState.json` fresh.
- [ ] If a baseline path is provided, the file exists. If missing, the mode will run in "capture baseline" mode and record the current state as the new baseline (with explicit PM approval before writing).

## Tools Used

- `user-playwright-mcp`:
  - `browser_navigate` - consumer page.
  - `browser_wait_for` - settle.
  - `browser_snapshot` - primary evidence.
  - `browser_click` - single click on the consumer locator, if the locator is a button. Persist-button blocklist enforced (no `Submit` / `Save` / `Done`).
  - `browser_console_messages` + `browser_network_requests` - tail.
  - `browser_take_screenshot` - on failure only.
  - `browser_close`.

## Flow

1. **Load session + navigate.** `browser_navigate` to the consumer URL.

2. **Wait for settle.** `browser_wait_for` on the consumer locator.

3. **Pre-click snapshot.** `browser_snapshot`. If the locator is a field (no click needed), this is the primary evidence.

4. **If locator is a button**, click it once. Verify it is NOT on the persist blocklist. After click, `browser_wait_for` for 2-3s and take a second `browser_snapshot` (post-click = primary evidence).

5. **Handle baseline logic:**

   **Case A - baseline exists.** Diff current snapshot against baseline. Compare:
   - Presence of the consumer locator (field or button region).
   - Any displayed value near the locator (e.g. a derived amount, a rendered status).
   - Accessibility-tree role of the locator (text / button / alert / status).

   If current matches baseline -> `[INFO] method-regression: consumer state matches baseline`. Verdict = `pass`.

   If current differs -> surface the diff in a readable form:
   ```
   [WARNING] method-regression: consumer state diverged from baseline
     Before: <baseline excerpt>
     After: <current excerpt>
     Suggested next step: confirm whether the divergence is intentional (expected output of the method edit) or a regression
   ```
   Verdict = `pass with warnings` - the PM reviews the diff.

   **Case B - no baseline, capture mode.** The mode records the current snapshot and asks the PM: *"No baseline exists for this method / consumer. Save current state as the baseline for future comparisons? `approve` / `reject`."*
   - `approve` -> write snapshot to `.playwright/baselines/<slug>.json`. Finding: `[INFO] method-regression: baseline captured at <path>`. Verdict = `pass (baseline captured)`.
   - `reject` -> skip baseline write; finding: `[INFO] method-regression: current state captured, no baseline saved`. Verdict = `pass (no baseline)`.

6. **Check for error signals on the consumer page.** These promote the verdict regardless of baseline status:
   - Console error messages -> `[WARNING]` or `[ERROR]` finding depending on content.
   - XHR 5xx responses on the page load or post-click -> `[ERROR]` finding; this is likely the method itself throwing.
   - An accessibility-tree alert node with error text (e.g. "Failed to load", "Something went wrong") -> `[ERROR]` finding.

   If any `[ERROR]` is raised, verdict downgrades to `fail` regardless of baseline match.

7. **Close browser.** `browser_close`.

8. **Emit findings report.** Machine-triageable; `@xo-developer` consumes and translates for the PM.

## Guardrails

- **Single click maximum.** If the PM's consumer requires a multi-click sequence (e.g. expand a drawer, then click Calculate), the mode refuses and suggests WATS.
- **Persist-button blocklist.** Never click `Submit`, `Save`, `Done`, `Submit for Approval`, `Confirm`, `Apply`. The button the method is wired to is almost never one of these, but verify before click.
- **Baseline writes are gated by PM approval.** Never auto-write a baseline.
- **Baselines are short-lived artefacts.** They live under `.playwright/baselines/` (gitignored). If the method's intended output changes, delete the baseline and re-capture; the mode does not auto-invalidate.
- **Never run against prod.** Pre-flight.

## Non-goals

- Unit-test-style value assertions (e.g. "value equals exactly 12,450.00"). That is a WATS job.
- Multi-step consumer flows.
- Auto-managing baseline lifecycle across method revisions.
- Method metadata validation (that's `@xo-code-reviewer`).

## Example run

```
User: "Regress the calculateOfferAmount method I just changed. Consumer is <URL>, locator 'Calculate Now' button."

Mode:
  1. Pre-flight: URL is dev, locator is a non-persist button, no baseline yet
  2. browser_navigate -> <URL>
  3. browser_wait_for -> Calculate Now visible
  4. browser_snapshot (pre-click)
  5. browser_click -> Calculate Now
  6. browser_wait_for -> 2s
  7. browser_snapshot (post-click)
  8. Error-signal check: clean (console ok, no 5xx, no alert)
  9. No baseline -> ask PM: "Save current as baseline?"
 10. User: "approve"
 11. Baseline written to .playwright/baselines/<slug>.json
 12. browser_close
     Verdict: pass (baseline captured)
     Finding: [INFO] method-regression: baseline captured; derived field rendered "12,450.00 USD" at <path>
```

## End-of-run

- Browser closed.
- Findings report emitted.
- Baseline write (if any) happened only with explicit PM approval.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain.
