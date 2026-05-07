# Scripts

Utility scripts for this workspace. Deck-related Python generators that used to live here are archived (see below).

## Repo-root helpers (run from repository root)

**Slide specs:** versioned JSON lives under [`docs/decks/specs/`](docs/decks/specs/). [`scripts/slide_specs_dir.py`](slide_specs_dir.py) exports `SLIDE_SPECS_DIR` for Python scripts. [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) and [`cleanup-old-artifacts.py`](cleanup-old-artifacts.py) target that directory.

| Script | Purpose |
|--------|---------|
| [`generate_presentation.py`](generate_presentation.py) | Fallback when Slide Deck MCP is unavailable: reads `--spec` JSON (default: `docs/decks/specs/slides_spec.json`), writes PPTX under `~/Downloads` (or `PM_DECK_OUTPUT_DIR`). Requires clone at `~/mcp-servers/wday-slidemcp` or set `WDAY_SLIDEMCP_ROOT`. |
| [`apply_style_guide.py`](apply_style_guide.py) | Post-process `docs/decks/specs/slides_spec.json` (British English, em-dash, HiredScore wording). |
| [`convert_pdfs.py`](convert_pdfs.py), [`run_morning_roundup.py`](run_morning_roundup.py) | Small utilities. |
| [`update_mission_log.py`](update_mission_log.py) | One-off MISSION_LOG line replace; edit in-script before running. |
| [`test_pptx.py`](test_pptx.py) | Quick PPTX sanity check. |

## Archived slide spec builders (`archive/`)

Nineteen one-off Python scripts were used to emit Slide Deck MCP JSON (`slides_spec_v*.json`) for specific missions (GCC v30 typography passes, E2E runs, France PMF v74, India PMF v75–v82, and related iterations). They were **not** a maintained product: each file hard-coded slide dicts for that engagement.

**Archived files** (historical reference only):

- GCC v30 typography: `build_gcc_slides_spec_v49_v30_typography.py`, `v50`, `v51`, `v52`, `v54`, `v55`, `v57`
- `build_slides_spec_v61.py`, `build_slides_spec_v64_e2e027.py`, `build_slides_spec_v67.py`, `build_slides_spec_v69_e2e029.py`, `build_slides_spec_v70.py`
- `build_france_pmf_slides_v74.py`
- `build_india_pmf_v75.py`, `build_india_pmf_v76.py`, `build_india_pmf_v78.py`, `build_india_pmf_v81.py`, `build_india_pmf_v82_spec.py`, `build_india_pmf_slides_spec.py`

There is **no** consolidated parameterised Python builder in `scripts/`. New full PMF roadmap decks should follow **`.cursor/rules/130-pmf-slide-generator.mdc`**, with the agent writing slide spec JSON and calling the **Slide Deck MCP** (`create_presentation`, etc.). That matches how deck work is done now.

### If you need the old Python helper pattern

Open any file under `scripts/archive/`. Typical structure:

- Small helpers: section dividers (`Section Title` layout), body text boxes (`Title Only` / `Title Only_Alt`), optional `pestel_slide`-style builders, product-implication paragraphs with yellow highlight.
- A `slides` list of dicts in Slide Deck MCP shape.
- `json.dump(...)` to `docs/decks/specs/slides_spec_vN.json` (older archive scripts may still target repo root — prefer the specs directory for new work).

**Examples to copy patterns from:** `build_gcc_slides_spec_v57.py`, `build_india_pmf_v82_spec.py`, `build_france_pmf_slides_v74.py`.

### Other scripts (unchanged)

Non-deck utilities remain in `scripts/` (for example cleanup, research export, git hooks, design preview helpers). Only `build_*.py` deck generators were moved to `archive/`.
