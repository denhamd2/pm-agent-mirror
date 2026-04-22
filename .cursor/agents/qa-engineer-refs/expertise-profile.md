# `@qa-engineer` - Expertise Profile

This file captures what a Principal QA Engineer **knows** and brings as context into any `suv-smoke-test` mode. It is paired with [`testing-playbook.md`](./testing-playbook.md) - this file is **knowledge**; that file is **behaviours**.

**Loaded by**: [`.cursor/agents/qa-engineer-agent.md`](../qa-engineer-agent.md) on every invocation. The wrapper agent instructs its subagent runtime to Read this file at the start of its first message.

This is context for QA advisory output. **It is not workflow.** Workflow lives in [`.cursor/skills/suv-smoke-test/SKILL.md`](../../skills/suv-smoke-test/SKILL.md).

---

## Workday SUV URL patterns

- **Task URLs**: `https://<tenant>.workday.com/d/task/1$<WID>/...` - most xoUi tasks. The `1$<WID>` segment is the task WID; the trailing path is view state and can usually be stripped without losing the target.
- **Element / xoUi URLs**: `https://<tenant>.workday.com/d/xoUi/<WID>` - direct link to a rendered element; `@xo-developer` uses this pattern in post-Persist advisories.
- **Home page**: `https://<tenant>.workday.com/d/home.htmld` - post-login landing; the `auth-handshake` mode verifies arrival here to confirm SSO completed.
- **Login**: `https://<tenant>.workday.com/<tenant>/login.flex` - redirects through SSO on click; do not assume a fixed post-login URL.

When the PM pastes a URL with trailing view state (query params, hash fragments, state tokens), strip to the canonical form for pre-flight but navigate to the full URL so deep-linked state survives.

## Accessibility-tree shapes for common Workday page elements

The `browser_snapshot` output is a structured representation of the page's a11y tree. Shapes you'll see repeatedly:

- **Labelled field** (input with visible label):
  ```
  group "<section name>"
    text "<label>"
    textbox value="<current value>"
  ```
  The `label-check` mode substring-matches on the `text` node adjacent to the `textbox`.

- **Help text**: typically a sibling `text` node inside the same group, or a `tooltip` role node anchored to the textbox. When a PM edits `helpText`, check both shapes.

- **Validation error**:
  ```
  alert "<error message>"
  ```
  or:
  ```
  region labelled "Errors"
    text "<error message>"
  ```
  `validation-fire` scans for either shape after the trigger event.

- **Spinner / loading**: `progressbar` or `status` role node with name "Loading" / "Processing". A snapshot capturing only a spinner = page hasn't settled; wait longer or the page is stuck.

- **Error banner** (page-level): `alert` role at the top of the tree with name "Something went wrong" / "Failed to load" / "Contact your administrator". Indicates a broken page, typically from an expression that threw or a 5xx on a page-data XHR.

- **Role-gated absence**: an element that exists in xoUi metadata but doesn't render for the current user's role simply isn't in the tree. This is the failure mode behind "I patched `overrideLabel` but `label-check` says it's not there" when the PM's role doesn't see the field.

## Known Workday SUV failure modes

A Principal QA Engineer pattern-matches smoke failures against these known causes before suggesting a fix:

- **Stale cache / CDN TTL**: patched label still showing old text. Mitigation: hard-refresh (`Cmd-Shift-R`). Diagnostic: run `label-check` twice 30 seconds apart; if the second run also fails, cache isn't the problem.
- **Unbound element content**: PM patched an `elementContent` WID that isn't bound to the rendered field on this page. Diagnostic: run `page-discovery` on the task to inspect `element_contents[]` and cross-reference with the patched WID.
- **Role-gated element**: the field is bound but the current user's role doesn't have view permission. Diagnostic: check the element's security domain; confirm the PM's role includes it.
- **BP-triggered async render**: a page that renders full state only after a BP event (e.g. approval, kickoff). Navigation alone shows an intermediate state. Diagnostic: `method-regression` with a button click that triggers the BP step.
- **`svc-xo-dev-agent` permission hole**: when `@xo-developer` wrote as the service account, certain graph-constrained modules (FINCORE, some HCM variants) reject the write silently, but the metadata appears to have been written. Diagnostic: smoke sees the old value; the reviewer sees the new value in metadata. Cross-reference.
- **Prompt group vs single prompt confusion**: editing a prompt option that's bound via a `prompt_group` vs a single `prompt` binding. A single-binding edit won't propagate to the group's consumers. Diagnostic: `page-discovery` reveals the binding shape.
- **Validation severity set to `info` (non-blocking)**: rule evaluates but doesn't produce a user-visible error. Diagnostic: `validation-fire` captures no error text; check `validation_get` for the severity field.
- **Session expired mid-run**: the smoke fires against a page but gets redirected to SSO. Diagnostic: the snapshot shows a login form. Fix: re-run `auth-handshake`.

When a smoke fails, cycle through this list before inventing a new hypothesis. Matching the symptom to a known failure mode is cheaper than reasoning from first principles.

## Playwright MCP (`user-playwright-mcp`) tool surface

The skill uses a subset; this profile lists what's available so QA advisory can recommend tools the skill doesn't auto-pick. Full tool count: 22.

**Navigation + lifecycle**: `browser_install`, `browser_navigate`, `browser_navigate_back`, `browser_close`, `browser_resize`, `browser_tabs`.

**Inspection (primary for smoke modes)**: `browser_snapshot` (accessibility tree), `browser_take_screenshot` (supplementary evidence), `browser_console_messages`, `browser_network_requests`.

**Interaction**: `browser_click`, `browser_fill_form`, `browser_type`, `browser_press_key`, `browser_hover`, `browser_drag`, `browser_select_option`, `browser_file_upload`.

**Timing**: `browser_wait_for`.

**Dialogs + advanced**: `browser_handle_dialog`, `browser_evaluate` (arbitrary JS), `browser_run_code` (Playwright API access, used by `auth-handshake` to export storageState).

**When to reach beyond the skill's default tools**:

- **`browser_evaluate`** - for inspecting page internals that the a11y tree doesn't surface (e.g. a data attribute on a `div`). Use sparingly; prefer tree-based assertions.
- **`browser_navigate_back`** - rare; smoke modes are one-page by design. If a PM asks to smoke "after clicking through to the detail page", route to WATS or clarify which page actually matters.
- **`browser_tabs`** - a Workday feature that opens in a new tab will confuse a single-tab smoke. If expected, use this to switch; otherwise, flag it as a smoke-unfriendly flow.

## Storage-state authentication

- **Single file**: `.playwright/storageState.json` (workspace-relative, gitignored).
- **Format**: Playwright's standard storageState shape - `cookies[]` + `origins[]` (localStorage per origin). Binary-safe JSON.
- **Auth surface**: Workday SSO typically issues a session cookie plus one or more origin-scoped tokens in localStorage. The `auth-handshake` mode captures both in one call via `context.storageState({ path })`.
- **Lifetime**: 8-12 hours typical; expiry is signalled by a 401 on an XHR, a 302 to the SSO provider on navigation, or a snapshot that includes the login form.
- **No silent refresh**: there is no reliable way to refresh Workday SSO programmatically; any attempt is fragile and MFA-defeated. The only sanctioned path is re-running `auth-handshake` with PM assistance.

## When to escalate to WATS (and when NOT to)

- **Escalate to WATS** when:
  - The PM needs the check to run on every revision of the module (persistent regression).
  - The scenario requires multi-step flows (navigate, click, wait, navigate, fill, submit).
  - Cross-browser coverage matters.
  - The test needs to be shared with engineering (WATS scenarios are versioned alongside code).
  - Value persistence matters (smoke passes don't persist; WATS does).
- **Do NOT escalate** when:
  - The PM wants a one-off vibe-check after a `copy-edit`.
  - The spec is vague enough that writing a WATS scenario would take longer than just re-running the smoke.
  - The test is genuinely disposable (e.g. verifying a label during an active iteration loop).
  - WATS coverage already exists for the target surface.

The [`xo-builder wats-scenario` mode](../../skills/xo-builder/modes/wats-scenario.md) is the route for WATS creation. Be honest with the PM about when WATS is the right tool - they don't always want to hear it.

## Toolbox awareness

Principal QA Engineer knows the adjacent tools. When the best next step is NOT a `suv-smoke-test` mode, route honestly. Full map:

### Sibling skills (reference-only; `@qa-engineer` can propose but the PM invokes)

- **[`xo-builder` skill](../../skills/xo-builder/SKILL.md)** - the source of the Tier 2 writes `@qa-engineer` is verifying. Recommend the relevant `xo-builder` mode when a smoke failure suggests an upstream fix (e.g. `validation-fire` fails -> route back to `validation-edit` to check the binding).
- **[`teachable-moment` skill](../../skills/teachable-moment/SKILL.md)** - offer whenever the PM uses a QA term the wrapper glossed. 30 seconds to clarify; cheaper than another failed smoke.
- **[`customer-issue-triage` skill](../../skills/customer-issue-triage/SKILL.md)** - when a smoke failure looks like a customer-side issue (their tenant config, their role gate) rather than a bug. Route the triage to this skill.
- **[`bug-triage` skill](../../../../.claude/skills/bug-triage/SKILL.md)** - when a smoke failure matches a Jira ticket, use `/bug-triage` for root-cause analysis on the underlying code.

### Sibling agents (thin wrappers for role-based invocation)

- **`@xo-developer`** - triages combined reviewer + QA findings; applies upstream fixes. Hand back to them when a smoke surfaces a metadata-level fix.
- **`@xo-code-reviewer`** - runs in parallel with `@qa-engineer` on the `@xo-developer` write loop. Don't duplicate their artefact review in your UI findings.
- **`@ux-designer`** - hand off when a smoke surfaces a design concern (truncation, hierarchy, a label that's semantically correct but visually wrong).
- **`@data-scientist`** - for "did the metric move after the change" questions that smoke can't answer.

### MCPs `@qa-engineer` can drive or hand off to

- **`user-playwright-mcp`** - the primary execution surface. Full 22-tool surface documented above.
- **`user-six-hats-thinking`** - multi-angle analysis for ambiguous verdicts. See [Testing Behaviour #8](./testing-playbook.md#8-six-hats-escalation-for-is-this-test-actually-proving-what-we-think-it-proves).
- **`user-sequential-thinking`** - for structured decomposition of a complex verdict (e.g. a failing smoke with three plausible causes). Use when the PM asks "walk me through what could have gone wrong".
- **`user-xo-mcp`** - `@qa-engineer` does NOT drive this directly (that's `@xo-developer`'s surface). But reference it when diagnosing: a failing `label-check` might warrant the PM running `element_content_get` to confirm the metadata actually persisted.

### Rules to stay out of

- `000-master-orchestrator.mdc` - read-only reference; the orchestrator routes TO `@qa-engineer`, not the other way.
- All E2E pipeline rules (100, 105, 106, 108, 130, 200, 315, 318, 319, 320, 330, 400, 410, 420, 430). `@qa-engineer` is explicitly out-of-pipeline.
- `015-auto-commit-deploy.mdc` - applies across the workspace. `@qa-engineer` never commits `.playwright/storageState.json`; the guardrail is gitignore-enforced, not runtime-enforced.

## Recruiting-specific cheatsheet

Common Recruiting SUV surfaces `@qa-engineer` will smoke:

- **Job Application task** - `Manage: Candidate` domain. Elements: candidate name, application status, resume attachment, assessment link.
- **Offer task** - the classic `copy-edit` target. Elements: Offer Amount, Start Date, Offer Letter, approval routing fields.
- **Interview task** - bound to `jobApplications` work data. Elements: interviewer panel, feedback links, scoring rubric.
- **Recruiting home page** - headless dashboard; a heavy `page-smoke` target after any `modulr-page` change.
- **Candidate profile** - cross-task concerns (contact info, tags, notes). Changes here often cascade to Job Application and Offer; smoke both after any candidate-side edit.

Role gates that commonly trip smoke tests in Recruiting:

- `Recruiter` vs `Recruiting Coordinator` - the Coordinator role has a subset of elements visible; a PM with Recruiter role can patch elements a Coordinator can't see.
- `Hiring Manager` - sees the candidate shortlist but not the full pipeline; validation edits targeted at the shortlist won't fire for Recruiter-only views.
- Custom security groups per tenant - when in doubt, `page-discovery` reveals the element's domain; cross-reference with the tenant's role matrix.

---

**Remember**: this is knowledge, not workflow. When running a smoke mode, the mode's own documentation is authoritative for execution. This profile informs advisory framing - the "why" behind a pushback, the "here's what this passes / doesn't prove" scope note, the "you might want WATS" routing.
