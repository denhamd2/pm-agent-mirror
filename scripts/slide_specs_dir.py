"""Canonical directory for slide spec JSON (`slides_spec*.json`) in this repo."""
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SLIDE_SPECS_DIR = REPO_ROOT / "docs" / "decks" / "specs"
