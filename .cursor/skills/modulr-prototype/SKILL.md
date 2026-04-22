---
name: modulr-prototype
description: >-
  Redirect stub. All ModulR prototyping has moved to the xo-builder skill's
  modulr-page mode. Legacy trigger phrases below still work - they now route
  into xo-builder's modulr-page mode. See
  .cursor/skills/xo-builder/SKILL.md for the umbrella skill dispatcher, or
  .cursor/skills/xo-builder/modes/modulr-page.md for the current ModulR
  workflow. Isolation contract is preserved: this skill does NOT participate
  in E2E pipelines, does NOT chain into 315/320/330/400 or any rule, and
  does NOT write to MISSION_LOG. Activate ONLY on explicit trigger phrases:
  /modulr-prototype, "build a ModulR page on my SUV", "build a ModulR layout
  on my SUV", "mock this on my SUV with Maestro", "ModulR prototype from
  this API response", "ModulR layout on my SUV", "scaffold a ModulR page",
  "run the Maestro workflow on my SUV".
---

# modulr-prototype (moved)

This skill has moved. It now lives as one mode inside the broader `xo-builder` umbrella skill. Every legacy trigger phrase still resolves; nothing in your muscle memory breaks.

- **Current ModulR workflow:** [.cursor/skills/xo-builder/modes/modulr-page.md](../xo-builder/modes/modulr-page.md)
- **Full XO Builder umbrella (dispatcher, pre-flight, isolation contract):** [.cursor/skills/xo-builder/SKILL.md](../xo-builder/SKILL.md)
- **Quick start:** [.cursor/skills/xo-builder/README.md](../xo-builder/README.md)
- **Per-mode index (machine-readable):** [.cursor/skills/xo-builder/MODES.md](../xo-builder/MODES.md)

## What the move means for you

- **Same trigger phrases.** `/modulr-prototype`, "build a ModulR page on my SUV", "ModulR prototype from this API response", etc. all still work; they now route into `xo-builder`'s `modulr-page` mode.
- **Same isolation.** The `xo-builder` skill preserves the exact same invariants this skill had: no orchestrator entry, no rule chain, no `MISSION_LOG` writes, no E2E participation, workspace switch handled automatically with return on completion.
- **Same Maestro workflow.** Six stages (Initialize / Discover / Build / Bind / Review / Persist), two HITL checkpoints (`plan_approval`, `pre_suv_write`), same binding caveats.
- **More schemas available.** `modulr-page` now cites Recruiting v4, Staffing v6, and Person v3 OAS specs pinned at [`research/workday-public-apis/`](../../../research/workday-public-apis/) (not just Recruiting). See [README](../../../research/workday-public-apis/README.md).
- **More modes available.** If you want to do something other than build a ModulR layout - reverse-engineer a page, search the API catalogue, edit element copy, add a validation, tweak a prompt, document a REST API, build a WATS test - `xo-builder` has a mode for it. See [MODES.md](../xo-builder/MODES.md).

## How routing works

When any of the legacy trigger phrases fire:

1. The dispatcher at [.cursor/skills/xo-builder/SKILL.md](../xo-builder/SKILL.md) handles the trigger.
2. Legacy phrases resolve to the `modulr-page` mode automatically.
3. The mode runs exactly as before (pre-flight, workspace switch to `~/contexto`, `/buildModulrLayout`, post-flight return to `product-manager-agent`).

No action required from you. The move is purely a reorganization.
