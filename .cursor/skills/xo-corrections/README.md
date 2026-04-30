# XO Corrections (PM-driven pattern library)

Reusable correction stubs captured from PM edits to `xo-builder` output. Triggered exclusively by [Advisory Behaviour #23](../../agents/xo-developer-refs/advisory-playbook.md#23-skill-capture-nudge-after-corrections) in the `@xo-developer` advisory playbook.

## What lives here

- One markdown file per captured correction pattern, named `<pattern-name>.md` (kebab-case, descriptive).
- `_offers-log.md` (this folder) - append-only audit log of every time Advisory #23 made the offer to capture, including declined offers. Required by the advisory; do not delete entries.

## What this folder is NOT

- Not an alwaysApply rule.
- Not a workflow specification.
- Not a substitute for `010-style-guide.mdc` - those are codified workspace standards. Corrections here are PM-specific patterns that emerge from real `xo-builder` runs and may or may not generalise.

## Pattern stub schema

Every capture file uses the schema in [Advisory #23](../../agents/xo-developer-refs/advisory-playbook.md#23-skill-capture-nudge-after-corrections):

```markdown
---
name: <pattern-name>
description: <one-line description of the correction>
---

# <Pattern Name>

## When to Apply
- <context where this correction applies>

## Correction
**Wrong:** <what the default behaviour produces>
**Right:** <what the PM corrected it to>

## Rationale
<why this is the correct pattern - PM's explanation, captured verbatim if given>

## Example
<concrete before/after example from the run that produced this capture>
```

## Offer log format

`_offers-log.md` is append-only. One line per offer:

```markdown
- YYYY-MM-DD | mode=<xo-builder mode> | trigger=<which Advisory #23 trigger fired> | accepted=<yes|no> | pattern="<short description>"
```

Triggers are one of: `literal-edit`, `convention-statement`, `repeat-correction`. Accepted=yes means the PM said "yes, capture it" and a stub file now exists in this folder; accepted=no means the offer was declined or ignored.

## Health checks

`/workspace-audit` consumes this folder during architectural reviews:

- **Zero offers logged in 4-6 weeks of active use**: Advisory #23 is theatre; route to `/090-agent-improvement-advisor` for a remove-vs-refine call.
- **High offer count, low acceptance** (e.g. 20 offers, 0 captures): the trigger criteria are firing too eagerly OR the offer phrasing isn't landing. Refine.
- **Captures exist but never referenced**: the corrections aren't being applied to future runs. Either bake them into `xo-builder` modes directly or surface in `@xo-developer` expertise-profile.
