# SUV Smoke Test - Noise Allowlist

Persistent background console and network events that appear on every Workday dev SUV page, independent of whatever change the PM is verifying. Listed here once so smoke modes can auto-downgrade them and stop padding every findings report with irrelevant warnings.

## Why this file exists

The first real `/suv-smoke-test page-smoke` runs surfaced 4-8 identical `[WARNING]` findings per page load that had nothing to do with the change under test. Every one of them was one of:

- A CDN mirror that fails CORS pre-flight while the primary domain serves the same payload successfully.
- An external analytics beacon (uxInsights) that is unreachable from dev SUVs by design.

Leaving these in every report trains the reader to ignore warnings and degrades `@xo-developer`'s Advisory #17 triage signal-to-noise. The fix is a skill-scoped allowlist: matched URLs get downgraded to `[INFO]` with an `(allowlisted noise)` tag, still counted in the report summary so the PM can see they happened, but not promoted to warnings or errors.

## Consumers

The following modes consult this file during their classification step:

- [`modes/page-smoke.md`](modes/page-smoke.md) - Rubric 3 (console) and Rubric 4 (network).
- [`modes/console-and-network.md`](modes/console-and-network.md) - console and network classification.

Other modes may opt in by referencing this file in their own classification step. If a mode does not reference this file, it does NOT apply the allowlist (explicit opt-in, not implicit).

## How the lookup works

For each console message or network request a mode would emit as `[WARNING]` or `[ERROR]`:

1. Normalise the URL / source file of the event to its absolute form.
2. Walk the entries below. An entry matches when the event's URL matches the entry's `pattern` (glob semantics; `**` crosses path segments, `*` does not).
3. On match: downgrade the finding severity to `[INFO]`, append the tag `(allowlisted noise)` to the evidence line, and record the matching entry's `id` so the summary can roll matches up.
4. Emit one rolled-up summary `[INFO]` at the end of the rubric:
   > `[INFO] noise-allowlisted-matches: N patterns matched; M console events and K network events auto-downgraded. See .cursor/skills/suv-smoke-test/noise-allowlist.md.`

If no entries match, no summary line is emitted and the rubric behaves as before.

## Scope and invariants

- **Read-only reference.** Modes never write to this file at runtime. PMs edit it by hand when they observe new background noise.
- **Downgrade-only.** An allowlist entry can lower a finding's severity (ERROR or WARNING -> INFO). It can never raise severity, never suppress entirely (the match still appears in the summary count), and never cross-classify (a console entry cannot match a network-only pattern).
- **Skill-scoped.** This allowlist applies only to `suv-smoke-test` modes. Other skills or agents must not read from it.
- **No hostnames beyond Workday / AWS CDN / AWS API Gateway.** If a new entry targets any other domain, stop and ask before adding; that's a sign the noise belongs elsewhere.

## Adding a new entry

When a smoke run surfaces a recurring warning that is clearly independent of the change under test:

1. Confirm the warning appears on at least 2 separate SUV pages (persistence, not page-specific).
2. Confirm the underlying behaviour is expected in dev (e.g. check with a Workday engineer, or verify the functional equivalent succeeds on the primary domain).
3. Add an entry below with a unique `id`, a precise `pattern` (prefer narrow; avoid over-matching), a `scope` (`console` | `network` | `both`), and a one-line `rationale` explaining why this is benign.
4. Re-run the failing mode; confirm the warning is downgraded and the summary count is accurate.

---

## Entries

### Entry `cdn-toggles-cors-fallback`

- **Pattern**: `**.workdaysuvcdn.com/wday/calypso/uip/appcontext/**/toggles*`
- **Scope**: `both` (console CORS error + network ERR_FAILED pair)
- **Downgrade to**: `[INFO]`
- **Rationale**: CDN mirror fails CORS pre-flight while the primary `workdaysuv.com` domain serves the identical toggles payload with 200. The front-end falls back automatically; no user-facing impact. Observed on every dev SUV page load in this workspace since at least 21 April 2026.
- **Evidence anchor for PM**: the 200 response from the primary domain appears immediately after the CDN failure in the network log; look for `workdaysuv.com/wday/calypso/uip/appcontext/.../toggles` with status 200 as confirmation the fallback worked.
- **Remove when**: Workday retires the CDN mirror fallback OR starts returning correct CORS headers on the CDN origin.

### Entry `uxinsights-analytics-beacon`

- **Pattern**: `https://8j288kaqxi.execute-api.us-east-1.amazonaws.com/prod/log*`
- **Scope**: `both` (console `ERR_CONNECTION_CLOSED` + network failure pair)
- **Downgrade to**: `[INFO]`
- **Rationale**: uxInsights external analytics sink. Unreachable from dev SUVs by design; this is non-user-facing telemetry. Failing to reach it does not affect the page's behaviour or the feature under test.
- **Evidence anchor for PM**: none needed - this endpoint is pure telemetry; its failure is invisible to end users.
- **Remove when**: Workday re-homes the uxInsights beacon to a dev-reachable endpoint, OR Workday removes uxInsights from dev SUV builds.

---

**Remember**: this file is for *persistent, cross-page, environmentally-expected* noise only. A one-off warning on one page is a signal, not noise - do NOT allowlist it. When in doubt, leave it as a `[WARNING]` and let the triage layer decide.
