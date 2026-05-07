# Archived one-off deck generators

Python scripts in this folder were **single-mission builders** that emitted Slide Deck MCP JSON for specific PMF / GCC / India / France engagements. They are **not** maintained product code.

## Slide spec output location

**Current convention:** new and maintained specs live under **`docs/decks/specs/`** (see repo [`scripts/slide_specs_dir.py`](../slide_specs_dir.py) and **130-pmf-slide-generator**).

Scripts in this directory were updated so **`Path(__file__).resolve().parents[2] / "docs" / "decks" / "specs"`** is the output directory (repo root = two levels up from `scripts/archive/<file>.py`).

When copying patterns from these files into new work, point `json.dump` / `OUT` at **`docs/decks/specs/slides_spec_vN.json`** — not the repository root.

## Running

From the **repository root**:

```bash
python3 scripts/archive/<script>.py
```

If a script reads a prior spec (e.g. v69 → v70), that input file must already exist under `docs/decks/specs/` or you must adjust paths in the script for your checkout.
