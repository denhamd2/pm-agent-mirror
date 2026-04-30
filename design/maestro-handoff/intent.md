# Maestro `/buildModulrLayout` Inputs - Agency Pipeline Card

**Slug:** `agency-pipeline-card`
**Sub-mode:** B (API-shape driven)
**Operation:** `create`
**Target element WID:** `null` *(rationale below)*
**Reference image:** `design/agency-pipeline-card-v01-reference.png`
**API response sample:** `design/maestro-handoff/api-response-sample.json`
**Localhost preview:** `http://localhost:5199/agency-pipeline-card-v01`

## Goal (one sentence)

> Show a Recruiting Agency User their active candidate pipeline as a grid of stage tiles (stage name, count, average days in stage, attention indicator), followed by a "needs attention" section listing candidates stuck more than five days, with a per-row drill-down link.

## Why `target_element_wid` is `null`

Per [`xo-builder/modes/modulr-page.md`](.cursor/skills/xo-builder/modes/modulr-page.md) Sub-mode B:
> "Target element WID (optional but recommended) - the SUV binding still happens on the element's workData; the API response is a layout-shape reference, not a live data source ... or write null and note that in intent.json."

Architectural reality on this SUV:
- **Conceptual target task**: `My Candidate Pipeline Tasks` (Convenience Task, WID `d13e56720a1c10000d0242aae8c10070`, instanceId `2998$38323`).
- The task WID returns 404 against `/ors/super/services/xoUi/v1/elements/{ID}` (confirmed via `get-element.sh`).
- All five `element_content_wid` values from `ui_task_analysis_get` also return 404 (they are metadata templates, not live xoUi instances - per page-discovery.md).
- The runtime UI URL pattern `/d/task/<WID>.htmld` is SSO-gated; the agent cannot scrape the live WID without browser SSO cookies.
- Result: there is no programmatically resolvable live xoUi element WID for this task on this SUV. We capture the layout shape via Maestro now; the Workday engineer attaches it manually to the rendered xoUi element WID later.

## Persona and JTBD

- **Persona**: Recruiting Agency User (external agency staff with constrained Workday access, scoped via `Manage: Recruiting Agency` security domain to their own agency's submissions).
- **JTBD**: "Track in-flight candidates and stage progression (status/visibility)" so I can prioritise follow-ups, escalate stuck candidates with the customer's recruiter, and demonstrate pipeline health to my agency leadership.

## Functional regions Maestro should produce

1. **Header strip** with title ("My active pipeline"), subtitle ("Candidates I've submitted to customer requisitions, by stage"), and a tertiary "View all candidates" action on the right.
2. **Stage grid** with 6 tiles (Submitted, Screen, HM review, Interview, Offer, Hired). Each tile renders:
   - Stage name (uppercase, micro caps)
   - Numeric count + "candidates" suffix
   - Average days in stage with a clock icon (cinnamon/red colour when >= 7 days)
   - Optional "needs attention" pill (orange) when at least one application in that stage has been stuck > 5 days
3. **"Needs attention" rail** below a horizontal divider:
   - Section heading ("Needs attention") and right-aligned summary count ("3 candidates stuck more than 5 days")
   - List of attention rows: warning icon + candidate name (bold) + req title and current stage and days-in-stage as inline metadata + "Follow up" tertiary action on the right

## Workday workData hints (for when Maestro plan_approval is reviewed by engineer)

When attaching this layout to the live xoUi element of `My Candidate Pipeline Tasks`, the engineer should bind:

| Layout region | Expected workData (from `ui_task_analysis_get`) |
|---|---|
| Stage tile heading | `Recruiting Stage (Workday Owned) Singular` (`d13e56720a1c10001637a6d3b875008e`) |
| Stage tile count | `Count` (`d13e56720a1c100016c6f836667a0098`) |
| Stage tile drill-down | `UI Task Singular` (`072eddeb897c10000f856147afb913b5`) |
| Container subview | `Pipeline for Inbox Items Subview` (`d13e56720a1c10000d55826491720079`) |
| Attention row candidate fields | Job Application class (`50104bbdccfb434ea077bb6df7aca59a`) - `Display ID`, `Instance Reference Descriptor`, `daysInStage` (derived) |

Days-in-stage and "stuck > 5 days" thresholds are **derived calculations**; if Maestro flags them as `inferred` at plan_approval, the engineer either provides a calculated field on `Recruiting Stage` or accepts a manual binding step post-persist.

## Reference image

`design/agency-pipeline-card-v01-reference.png` (74KB, 2x3 stage grid, all 6 stages visible, 'needs attention' section with 3 stuck-candidate rows). Built in Canvas Kit; localhost preview at `http://localhost:5199/agency-pipeline-card-v01`.

## API response sample

`design/maestro-handoff/api-response-sample.json` - synthetic JSON in the shape of stage-grouped pipeline data, sized to drive Maestro's structure inference. Field names are deliberately aligned to Recruiting v4 OAS schema language (`jobApplication`, `jobRequisition`, `candidate`) so Maestro can ground its layout reasoning in known shapes.

## Handoff execution status (30 Apr 2026)

- Discover-stage rehearsal ran in Contexto under `~/contexto/wip/agency-pipeline-card/` (`confidence-report.json`, `bindable-data-snapshot.json`, `execution-plan.json` proxy artefacts present).
- **`plan_approval` was cleared** after explicit review of `confidence-report.json` (target element remains `null`; dynamic regions stay low-confidence by design).
- **`discover.sh` completed successfully** — `validate-contract.sh agency-pipeline-card discover` → **CONTRACT OK** (see event log: `stage_completed` for `discover`).
- **Build is blocked** until the Maestro Composer runs MCP ops (`replay-plan.sh` / `export_suv_layout`). Attempting `build.sh` without an agent session yields **`MCP_AGENT_REQUIRED`** and no `structure-snapshot.json`.
- **Review / `persist.sh` were not run** — no SUV POST (correct while `suv_target_element_id` is unset). `persist.sh` does not auto-skip when the element is null; skipping SUV writes is a workflow choice, not a built-in persist shortcut.

### Manual continuation steps

1. Open the Contexto workspace (`~/contexto`) and run `/buildModulrLayout` (or follow `@maestro-composer-agent`) so MCP executes `execution-plan.json` and writes `wip/agency-pipeline-card/structure-snapshot.json` via `export_suv_layout`.
2. If `build.sh` left a failed attempt in the event log, use `xo-agents/lib/maestro/scripts/recover/recover-build.sh agency-pipeline-card` then replay MCP per the printed playbook.
3. Complete **Review** (`review.sh`) and only clear **`pre_suv_write`** after you have inspected `diff.json` / `approved-payload.json`.
4. Resolve the live xoUi element WID from an authenticated SUV browser session **before** running **`persist.sh`** / approving final POST.
