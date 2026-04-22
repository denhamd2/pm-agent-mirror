# Mode: validation-fire

**Tier:** 1 (form-fill, no persist) • **Browser interaction:** Yes (fills form, triggers validation) • **Writes to SUV:** No (refuses to click final Submit / Save / Done)

"Prove the validation actually fires." Post-write companion for [`validation-edit`](../../xo-builder/modes/validation-edit.md). Navigates to the form, fills the field with a value that should trigger the new rule, and asserts the error message appears.

Catches the two most common "validation patched, doesn't enforce" failure modes:

1. **Unbound validation** - rule created but not wired to any element content; UI accepts any value.
2. **Wrong trigger point** - rule fires on `onSubmit` but PM expected `onBlur`, or vice versa; error appears later than intended.

## Worked Example Prompts

- "Prove the 'email must end in @acme.com' rule fires on the Recruiter Email field."
- "Trigger the validation I just added."
- "Show me the error message when I enter an invalid amount."
- "Test the validation I just wired up to element `<WID>`."
- `/suv-smoke-test validation-fire`

## Inputs

- **SUV page URL**: full URL of the form page.
- **Target field**: either an accessible label (e.g. "Recruiter Email") or an `automationId`. Accessible label is preferred because it survives copy edits.
- **Trigger value**: what to type into the field to activate the validation. Must be a value the new rule should reject (e.g. `joe@gmail.com` for an acme.com-only rule).
- **Expected error message**: the exact (or near-exact) error copy the PM wrote into the validation. Substring match is acceptable.
- **Trigger point**: one of `blur` (tab out of the field), `change` (typing alone), or `submit` (click a non-persisting Next / Continue button that triggers validation). Default: `blur`.

## Pre-Flight

- [ ] Global pre-flight passed.
- [ ] Target URL is a dev SUV.
- [ ] Trigger value and expected message captured verbatim.
- [ ] Authentication is NOT gated on storageState mtime - the session-presence probe at Flow step 2 handles expired sessions at runtime. See [../SKILL.md#authentication-lifecycle](../SKILL.md#authentication-lifecycle).
- [ ] **No persist button will be clicked.** The mode NEVER clicks Submit, Save, Done, or any label that persists data. Confirm the PM's "trigger point" is one of: `blur`, `change`, or `submit on a non-persist button` (e.g. `Next`, `Continue`, `Validate`). If the PM asks for a Save click, refuse and explain the guardrail.

If the trigger point is unclear or risks a persist, stop and ask for a binary choice.

## Tools Used

- `user-playwright-mcp`:
  - `browser_navigate` - loads the form page with saved session.
  - `browser_wait_for` - waits for form rendered.
  - `browser_snapshot` - captures pre-fill state (for scope reference).
  - `browser_fill_form` - types the trigger value into the target field. Uses accessible label as selector.
  - `browser_press_key` - for explicit `Tab` to trigger `blur`, or `Enter` if a non-persist submit is wired to Enter.
  - `browser_click` - **only** on non-persist elements (Next, Continue, Validate). Mode blocks Submit / Save / Done.
  - `browser_snapshot` (second time) - captures post-trigger state, including any error message.
  - `browser_console_messages` + `browser_network_requests` - tail for validation-related XHR calls.
  - `browser_close`.

## Flow

1. **Navigate.** `browser_navigate` to the form URL. The Playwright MCP's persistent browser profile supplies the authenticated session automatically.

2. **Session-presence probe.** Call `browser_snapshot` after navigation settles. Scan the accessibility tree for login-indicator markers (heading `Sign In` / `Single Sign-On`, a `form` with `Username` + `Password` textboxes, or a post-navigation URL containing `/login` / `/sso` / `/saml`). If any marker is present, stop immediately, emit `[ERROR] session-expired` recommending `/suv-smoke-test auth-handshake`, call `browser_close`, and return.

3. **Wait for form render.** `browser_wait_for` on the target field selector (accessible label match). Time out at 10s with a clear failure message if the field never appears.

4. **Pre-fill snapshot.** `browser_snapshot`. Confirm the target field exists in the tree and captures its state (empty / default value).

5. **Fill the trigger value.** `browser_fill_form` with the target field's accessible label and the trigger value.

6. **Trigger evaluation** (branch on trigger point):
   - `blur` -> `browser_press_key('Tab')` to move focus off the field.
   - `change` -> typing is the trigger; no extra action.
   - `submit` -> `browser_click` on the non-persist button. Verify the button's accessible name is NOT in the persist blocklist (`Submit`, `Save`, `Done`, `Submit for Approval`, `Confirm`, `Apply`). If it is, refuse and report.

7. **Wait briefly for async validation.** `browser_wait_for` 2-3 seconds, or on an error-region selector if the PM provided one.

8. **Post-trigger snapshot.** `browser_snapshot`.

9. **Assert the expected error message.** Substring match on the expected message string, scoped to the nearest error / alert region of the accessibility tree (nodes of type `alert`, `status`, or `text` inside a region labelled "error" / "validation").

10. **Handle the outcome cases:**

   **Case A - error present, matches expected.** Finding:
   ```
   [INFO] validation-fire: error "<expected message>" fired on <trigger> of field "<label>"
     Scope: validation WID <WID> on element content "<label>"
     Evidence: accessibility tree alert node with matching text
   ```
   Verdict = `pass`.

   **Case B - error present but different text.** Finding:
   ```
   [WARNING] validation-fire: an error fired, but message was "<found text>" not "<expected text>"
     Likely cause: the validation fired (good), but the message copy does not match what the PM wrote
     Suggested next step: re-check the validation's message field via validation_get; may be a caching issue
   ```
   Verdict = `pass with warnings` (the rule fires; the text is off).

   **Case C - no error at all after trigger.** Finding:
   ```
   [ERROR] validation-fire: expected error "<expected message>" did not fire after <trigger>
     Trigger value: "<value>"
     Likely cause: validation not bound to this element content, wrong trigger point, or validation severity set to info (non-blocking)
     Suggested next step: run xo-builder page-discovery to confirm the validation binding, OR re-check validation-edit's verify step
   ```
   Verdict = `fail`. Attach a `browser_take_screenshot` for supplementary PM evidence.

   **Case D - page errored out (console error, XHR 500).** Finding:
   ```
   [ERROR] validation-fire: page threw an error when fired, not a validation response
     Evidence: console / network details
     Suggested next step: the rule expression may be malformed; review validation_get output
   ```
   Verdict = `fail`.

11. **Tail console and network.** Any console `error` or XHR status >= 500 raises a `WARNING` or `ERROR` finding.

12. **Close the browser.** `browser_close`.

13. **Emit the findings report** per the shared output contract.

## Guardrails

- **Never click Submit / Save / Done / Confirm / Apply / Submit for Approval.** Persist-button blocklist enforced before every `browser_click` call. If the PM's configured "submit" trigger uses one of those labels, refuse and explain.
- **Never fill more than the one target field.** Validations often depend on other fields' values; if the PM needs multi-field context, they must fill those fields themselves before the mode runs - or switch to WATS.
- **Never run against prod.** Pre-flight catches this.
- **Stop on first persist guardrail hit.** Do not retry with a different selector.

## Non-goals

- Multi-step wizards requiring a cross-page flow (route to WATS).
- Validating that the validation did NOT fire on a good value (that's a different mode / future work).
- Asserting the exact position / styling of the error.
- Running against production tenants.

## Example run

```
User: "Prove the 'must end in @acme.com' rule fires on the Recruiter Email field at <URL>.
       Trigger with joe@gmail.com, error should say 'Must use an @acme.com address'."

Mode:
  1. Pre-flight: URL is dev, no persist click planned (blur trigger)
  2. browser_navigate -> <URL>
  3. browser_wait_for -> Recruiter Email field visible
  4. browser_snapshot (pre)
  5. browser_fill_form -> Recruiter Email: "joe@gmail.com"
  6. browser_press_key -> Tab (blur)
  7. browser_wait_for -> 2s
  8. browser_snapshot (post)
  9. Tree search for "Must use an @acme.com address" in alert region -> found
 10. Finding: [INFO] validation-fire: error "Must use an @acme.com address" fired on blur
 11. Console: clean. Network: all 2xx.
 12. browser_close
     Verdict: pass
```

## End-of-run

- Browser closed.
- Findings report emitted.
- Do not write to `MISSION_LOG.md`.
- Do not auto-chain.
