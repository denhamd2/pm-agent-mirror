# Two-way email initiative — `drafts/`

This folder holds **working artefacts** for gap reviews, Confluence publish rehearsals, and HTML generators for [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977)–style runs. Treat paths here as **tooling and scratch**, not customer-facing product docs.

## Regenerable (safe to trim with automation)

These are typically **reproducible** from emitters, Jira/MCP re-runs, or chunked publish flows. Always **`--dry-run` first**. For a **scoped** prune that only touches Confluence/MCP chunk artefacts under this folder (and leaves PRDs, `design/`, and `research/` alone), use:

```bash
python3 scripts/cleanup-old-artifacts.py --two-way-email-drafts-only --dry-run
python3 scripts/cleanup-old-artifacts.py --two-way-email-drafts-only --keep 3
```

A **full** workspace cleanup (all script targets) omits `--two-way-email-drafts-only`; see the skill [`.cursor/skills/cleanup-old-artifacts/SKILL.md`](../../../../.cursor/skills/cleanup-old-artifacts/SKILL.md).

| Pattern (top-level `drafts/` only) | Examples |
|------------------------------------|------------|
| `_mcp_*.json` | MCP payload snapshots for Confluence smart-update |
| `_conf_*.html` | Confluence Storage body chunks |
| `gap_review_chunk*.html` | Split-tag replace/append bodies |
| `gap_review_chunk*.html.json` | Sidecar metadata next to chunk HTML |
| `confluence_args_*.json` | REST argument bundles for append/replace |

**Subfolder `conf_chunks/`:** Small set of named parts (`part0_header.html`, …). Do **not** bulk-delete via broad `*.html` globs at repo root; regenerate or edit as a set when changing chunking.

## Canonical tooling (keep)

Do **not** remove these unless you intentionally replace them and update [`reference.md`](../../../../.cursor/skills/user-story-gap-review/reference.md) / [`SKILL.md`](../../../../.cursor/skills/user-story-gap-review/SKILL.md):

- [`check_gap_review_row_dedup.py`](check_gap_review_row_dedup.py) — row fingerprint dedup before publish  
- [`check_gap_review_bdd_duplicates.py`](check_gap_review_bdd_duplicates.py) — BDD duplicate / template-collapse check  
- [`diff_whatsapp_companion_manifest.py`](diff_whatsapp_companion_manifest.py) — optional WhatsApp manifest diff (referenced from `reference.md`)

**Emitters / generators:** Python files named `emit_*.py`, `_emit_*.py`, `render_*.py`, `build_gap_review_*.py`, `generate_*.py`, etc., are **source** for HTML outputs. Prune **outputs** first; delete generators only when no mission notes or skills point at them.

## Audit trail vs disk

[`MISSION_LOG.md`](../../../../MISSION_LOG.md) **User-story-gap-review run log** may cite specific filenames (e.g. a given `gap_review_*publish*.html` or emitter) as the **source of a Confluence version**. Do **not** delete those named files until you no longer need that in-repo audit trail (or you have an equivalent copy elsewhere).

## What not to do

- No `git clean` or blanket `rm` on this directory.  
- Do not add this entire folder to `.gitignore` while hundreds of paths remain **tracked** in git (creates confusion).  
- Do not point cleanup at broad `*.html` or `*.json` for `drafts/` — that can remove canonical HTML or evidence you still reference.

For workspace-wide cleanup behaviour, see [`.cursor/skills/cleanup-old-artifacts/SKILL.md`](../../../../.cursor/skills/cleanup-old-artifacts/SKILL.md).
