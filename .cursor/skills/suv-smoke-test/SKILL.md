---
name: suv-smoke-test
description: >-
  Standalone umbrella skill for running fast, post-write UI smoke checks on a
  Workday SUV. Drives the user-playwright-mcp browser MCP to verify that
  xo-developer Tier 2 writes (label edits, validation rules, prompt tweaks,
  method-expression changes, ModulR layouts) actually render and fire in the
  real UI - not just in XO metadata. Five modes plus a one-time auth-handshake
  bootstrap. Designed to run in parallel with @xo-code-reviewer after any
  xo-developer Tier 2 write, with findings surfaced back to xo-developer for
  triage. Out of E2E pipelines: never writes to MISSION_LOG, never chains into
  any rule. Activate ONLY on explicit trigger phrases or the @qa-engineer
  subagent wrapper. Dev SUV only; refuses shared/prod/staging hosts.
---

# SUV Smoke Test (Standalone Umbrella Skill)

Post-write UI smoke checks on your Workday SUV. One dispatcher skill, five smoke modes, one bootstrap mode. Each mode is self-contained in `modes/<name>.md`; this file is the router plus the shared contract.

## Trigger phrases

This skill activates ONLY when the user says one of the triggers below, **or** when the `@qa-engineer` subagent ([.cursor/agents/qa-engineer-agent.md](../../agents/qa-engineer-agent.md)) invokes it. Direct triggers run the skill as written; the subagent runs the same skill with a Principal QA Engineer advisory layer on top.

**Umbrella** (opens the mode catalogue menu):

- `/suv-smoke-test`
- "smoke test my SUV change"
- "QA this"
- "verify my XO edit"
- "check the UI renders"
- "is the label actually showing up"

**Mode-specific** (routes straight to that mode):

- `/suv-smoke-test auth-handshake` or "set up Playwright auth" / "SSO into my SUV for Playwright"
- `/suv-smoke-test label-check` or "confirm my label change rendered" / "verify copy-edit on the UI"
- `/suv-smoke-test validation-fire` or "prove the validation fires" / "trigger the validation rule"
- `/suv-smoke-test method-regression` or "check this method still works in the UI"
- `/suv-smoke-test page-smoke` or "does the page render" / "smoke test the ModulR page"
- `/suv-smoke-test console-and-network` or "check for JS errors on this page" / "pull network errors"

If the user asks about a capability without a trigger, answer the question but do **not** invoke the skill. Browser modes have side effects (they drive a real browser session) and must never run unannounced.

## Isolation Contract

This skill is deliberately isolated from the PM agent workflow. Invariants across every mode:

- **Explicit trigger only**: nothing auto-loads `suv-smoke-test` or any mode.
- **No orchestrator auto-chain into PM rules**: the skill does not trigger 200, 315, 320, 400, or any E2E step.
- **No `MISSION_LOG.md` writes**: smoke-test runs are reported inline and optionally stored as short-lived baselines in `.playwright/baselines/` (gitignored).
- **No rule edits**: running this skill edits zero files in `.cursor/rules/`.
- **Parallel with `@xo-code-reviewer`, not replacement**: this skill runs alongside the artefact reviewer after `@xo-developer` Tier 2 writes. It does not review XO metadata; it verifies the rendered UI.

**Narrow exception**: the `@qa-engineer` subagent ([.cursor/agents/qa-engineer-agent.md](../../agents/qa-engineer-agent.md)) is registered in [`000-master-orchestrator.mdc`](../../rules/000-master-orchestrator.mdc) as a specialised agent roster entry. This does NOT violate the isolation contract because the subagent is a thin wrapper that delegates execution to this skill.

## Invoking via @qa-engineer subagent

Any mode in this skill can be invoked via `@qa-engineer`. The subagent adds a Principal QA Engineer advisory layer on top of the mode:

- **Direct trigger** (e.g. `/suv-smoke-test label-check` or any phrase from "Trigger phrases"): runs the mode as written. No advisory layer.
- **@qa-engineer trigger** (e.g. `@qa-engineer, verify my copy-edit actually rendered`): runs the same mode AND adds QA judgement - flaky-selector warnings, cache-invalidation reminders, "is this test actually proving what we think" sanity checks, and escalation to Six Hats when the result is ambiguous.

The skill is authoritative for **workflow** (mode selection, pre-flight, output contract). The subagent is authoritative for **advisory framing** only. If the two conflict, the skill wins.

## Mode Catalogue

| Tier | Mode | Browser interaction? | Writes to SUV? | Primary tools |
|---|---|---|---|---|
| 0 bootstrap | [`auth-handshake`](modes/auth-handshake.md) | Yes (user SSO) | No | Playwright MCP: `browser_install`, `browser_navigate`, `browser_snapshot`, `browser_run_code` |
| 1 read-only | [`label-check`](modes/label-check.md) | No (nav + snapshot) | No | `browser_navigate`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests` |
| 1 read-only | [`page-smoke`](modes/page-smoke.md) | No (nav + snapshot) | No | `browser_navigate`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests`, `browser_take_screenshot` (only on failure) |
| 1 read-only | [`method-regression`](modes/method-regression.md) | Nav + click to trigger | No | `browser_navigate`, `browser_click`, `browser_snapshot`, `browser_console_messages`, `browser_network_requests` |
| 1 read-only | [`console-and-network`](modes/console-and-network.md) | Tail mode; no nav | No | `browser_console_messages`, `browser_network_requests` |
| 2 form-fill | [`validation-fire`](modes/validation-fire.md) | Yes (fill + submit) | No (SUV-side; no POST persisted by the test itself) | `browser_navigate`, `browser_fill_form`, `browser_click`, `browser_snapshot`, `browser_wait_for` |

See [MODES.md](MODES.md) for the machine-readable index with per-mode trigger phrases.

## Routing Logic

When a trigger fires:

1. **If umbrella trigger** (no mode specified): print the Mode Catalogue table, ask "Which mode?", then stop. Do not auto-pick.
2. **If mode-specific trigger**: read `modes/<mode>.md` and follow its instructions exactly. Do not pre-empt.
3. **If ambiguous** (trigger matches multiple modes): ask which mode; do not auto-pick.
4. **If storageState is missing or stale**: every mode except `auth-handshake` must refuse and route the user to `auth-handshake` first.
5. **If the user signals confusion** ("I don't understand", "what's a snapshot", extended silence): pause and offer `/teachable-moment` on the concept.

## Global Pre-Flight (common to all modes except auth-handshake)

Before any mode runs:

- [ ] **Target SUV is dev, not shared**: the mode's `<SUV_URL>` input must not contain `shared`, `prod`, `staging` in the hostname. If the user pastes one, stop and ask.
- [ ] **Playwright MCP is reachable**: if `user-playwright-mcp` tools are not listed as available, stop and tell the user to check Cursor's MCP panel.
- [ ] **storageState is fresh**: `.playwright/storageState.json` must exist and have been written within the last **8 hours** (Workday SSO sessions typically last 8-12 hours; err conservative). If stale or missing, route to `auth-handshake` and stop.
- [ ] **Target page URL**: the mode needs a full SUV URL (e.g. `https://<tenant>.workday.com/d/task/1$12345/...`). If the user only gave a task WID, ask for the URL.

If any pre-flight item is missing, stop and ask the user.

## storageState Lifecycle

Authenticated browser sessions are persisted to `.playwright/storageState.json` by the `auth-handshake` mode. This file contains session cookies and MUST NOT be committed to git.

- **Location**: `.playwright/storageState.json` (workspace-relative; `.playwright/` is gitignored).
- **Lifetime**: 8-12 hours typical; re-run `auth-handshake` when any mode reports a 401 / redirect-to-login.
- **Rotation**: automatic on `auth-handshake` re-run (overwrites the old file).
- **Never log the contents**: modes must not print cookies, tokens, or the file's raw bytes to chat. Report only `{ exists: bool, mtime: ISO8601, path: ".playwright/storageState.json" }`.

## Output Contract (shared by every smoke mode)

Every mode ends with a **severity-tagged findings report**, modelled on the `@xo-code-reviewer` output contract so `@xo-developer`'s triage protocol ([Advisory #17](../../agents/xo-developer-refs/advisory-playbook.md)) can consume it without translation.

Each finding includes:

- **Severity**: `ERROR` (test failed; user-facing regression), `WARNING` (test passed but with a smell - slow load, flaky selector, unexpected console noise), or `INFO` (test passed cleanly; diagnostic data).
- **Scope**: which XO artefact the finding relates to (element content WID, validation WID, method WID, page URL). Matches the field-specific scope `@xo-code-reviewer` uses.
- **Evidence**: concrete anchor - accessibility-tree excerpt, console message, network entry, or screenshot path. Never a vague "looks off".
- **Suggested next step**: for `ERROR` and `WARNING`, one sentence on what the user (or `@xo-developer`) should do. For `INFO`, may be omitted.

**Verdict** at the end of the report: `pass`, `pass with warnings`, or `fail`.

This is machine-triageable output for `@xo-developer`. The PM sees the plain-English recap `@xo-developer` generates from it, not the raw findings.

## Safety Guardrails (apply to every mode)

- **Never navigate to a production tenant.** Pre-flight blocks this; if a URL slips through, stop on first navigation.
- **Never write to the SUV through the browser.** `validation-fire` fills forms to trigger rules, but does not click final Submit / Save buttons that persist data. Every mode's flow documents exactly which buttons are safe to click.
- **Never commit `.playwright/storageState.json`.** It contains live session cookies. The pre-commit secret scan should catch it if `.gitignore` drifts; the mode-level guard is: never print the file's contents, never `cat` it, never move it out of `.playwright/`.
- **Never run against a tenant the PM hasn't explicitly named in this session.** No "re-use last SUV URL silently" - always echo the target URL in the pre-flight block.
- **Screenshots only on failure.** `browser_take_screenshot` is expensive and not tree-stable; use accessibility-tree snapshots (`browser_snapshot`) as the primary evidence. Screenshots attach as supplementary evidence only when a finding is `ERROR` and tree evidence is insufficient.

## End-of-run Hygiene

After any mode completes (pass, warning, or fail):

- Close browser session via `browser_close` unless the user explicitly wants to keep it open for follow-up.
- Print the findings report in the output contract above.
- Do NOT write to `MISSION_LOG.md`. Do NOT invoke any rule. Do NOT chain into another mode.
- If invoked via `@qa-engineer`, the subagent layers QA advisory on top of the findings before surfacing.
- Ask the user if they want to run another mode. Do not assume.

## Non-Goals (explicit)

suv-smoke-test v1 will **not** do any of the following:

- **Visual regression / pixel diffing**. Workday UIs break pixel diffing too easily. Accessibility-tree snapshots are the right abstraction.
- **Production tenant access**. Dev SUV only; pre-flight blocks.
- **Persistent test suites**. WATS ([xo-builder `wats-scenario` mode](../xo-builder/modes/wats-scenario.md)) is the right tool for long-term engineering-owned tests. This skill is for fast, PM-owned, disposable smoke checks.
- **Cross-browser testing**. Playwright MCP drives one browser at a time. If cross-browser matters, route to WATS.
- **Load / performance testing**. Smoke only.
- **Schema or metadata validation**. That's `@xo-code-reviewer`'s job; this skill is runtime-only.
- **Auto-promoting a passing smoke to a WATS scenario**. Noted as a future follow-up (see "Related, out of scope for v1" below).

## Related, out of scope for v1

- **WATS bridge**: a future `promote-to-wats` mode could take a passing smoke test and generate a WATS scenario via the existing [`wats-scenario` mode](../xo-builder/modes/wats-scenario.md). Flagged but not built.
- **Baseline auto-management**: `method-regression` currently asks the user to confirm a baseline; a future mode could auto-manage baselines per-method under `.playwright/baselines/`.

---

**Remember**: `suv-smoke-test` is the "does my change actually render and fire in the real UI" checker. It is parallel to, not a replacement for, `@xo-code-reviewer` (artefact review) and WATS (persistent engineering tests). Run it after a Tier 2 XO write; keep it out of pipelines.
