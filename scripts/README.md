# Scripts

Utility scripts for this workspace.

## Repo-root helpers (run from repository root)

**Slide specs:** versioned JSON lives under [`docs/decks/specs/`](docs/decks/specs/). [`scripts/slide_specs_dir.py`](slide_specs_dir.py) exports `SLIDE_SPECS_DIR` for Python scripts. [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) and [`cleanup-old-artifacts.py`](cleanup-old-artifacts.py) target that directory.

| Script | Purpose |
|--------|---------|
| [`generate_presentation.py`](generate_presentation.py) | Fallback when Slide Deck MCP is unavailable: reads `--spec` JSON (default: `docs/decks/specs/slides_spec.json`), writes PPTX under `~/Downloads` (or `PM_DECK_OUTPUT_DIR`). Requires clone at `~/mcp-servers/wday-slidemcp` or set `WDAY_SLIDEMCP_ROOT`. |
| [`apply_style_guide.py`](apply_style_guide.py) | Post-process `docs/decks/specs/slides_spec.json` (British English, em-dash, HiredScore wording). |
| [`convert_pdfs.py`](convert_pdfs.py), [`run_morning_roundup.py`](run_morning_roundup.py) | Small utilities. |
| [`update_mission_log.py`](update_mission_log.py) | One-off MISSION_LOG line replace; edit in-script before running. |
| [`test_pptx.py`](test_pptx.py) | Quick PPTX sanity check. |
| [`figma_screen_inventory.py`](figma_screen_inventory.py) | Parses Figma MCP `get_metadata` XML (plain or `.gz`), deduplicates direct-child artboards by name + size, writes `screen-inventory.md`, JSON, and per-screen stubs. Used by [`docs/figma-extraction-2way-email-2024/`](../docs/figma-extraction-2way-email-2024/README.md). |

## Historical one-off slide generators (removed)

One-off Python builders that emitted mission-specific `slides_spec_v*.json` files lived under **`scripts/archive/`** until removed during a repo spring clean. They were never maintained product code. Restore from **git history** if you need to rerun an exact legacy generator; otherwise use **`130-pmf-slide-generator`**, write JSON under [`docs/decks/specs/`](docs/decks/specs/), and invoke the **Slide Deck MCP** (`create_presentation`, etc.).

Non-deck utilities remain in `scripts/` (cleanup, research export, git hooks, design preview helpers).
