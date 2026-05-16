#!/usr/bin/env python3
"""
Lightweight contract check for the user-story-gap-review skill.

Run from repo root:
  python3 scripts/verify_user_story_gap_review_skill_contract.py

Exits non-zero if required headings / cross-links are missing (e.g. after a bad merge).
"""
from __future__ import annotations

import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SKILL_DIR = REPO / ".cursor" / "skills" / "user-story-gap-review"


def _must_contain(path: Path, needles: list[str], label: str) -> list[str]:
    text = path.read_text(encoding="utf-8")
    missing = [n for n in needles if n not in text]
    if missing:
        return [f"{label} ({path.relative_to(REPO)}): missing {missing!r}"]
    return []


def main() -> int:
    errors: list[str] = []
    ref = SKILL_DIR / "reference.md"
    wa = SKILL_DIR / "reference-companion-whatsapp.md"
    skill = SKILL_DIR / "SKILL.md"

    if not ref.is_file():
        print("FAIL: reference.md not found", file=sys.stderr)
        return 2
    if not wa.is_file():
        print("FAIL: reference-companion-whatsapp.md not found", file=sys.stderr)
        return 2
    if not skill.is_file():
        print("FAIL: SKILL.md not found", file=sys.stderr)
        return 2

    errors += _must_contain(
        ref,
        [
            "## Run tiers (Tier A full contract vs Tier B timeboxed)",
            "## From-scratch execution (mandatory unless user opts out)",
            "## Companion channel cross-scan (013 / 2WE)",
            "reference-companion-whatsapp.md",
            "## Page structure (audience: non-technical Sr. Recruiting PM)",
            "## Evidence grounding — no fabrication",
            "4416121176",
            "check_gap_review_row_dedup.py",
            "verify_user_story_gap_review_skill_contract.py",
            "## Net-new preamble (Peanut MCP)",
            "### When to invoke Peanut (2WE per-row)",
            "### Peanut — taxonomy (gap review)",
            "## Gap likelihood — per story (Verdict + BDD)",
            "## Gap column (2) — Gap Likelihood (live and draft HTML)",
            "## Possible missing stories (holistic suggestions)",
            "<!-- possible-missing-stories-table -->",
        ],
        "reference.md",
    )

    errors += _must_contain(
        wa,
        [
            "## Routing quick reference",
            "## Companion channel cross-scan (013 / 2WE)",
            "### Optional Peanut (code anchors) for WhatsApp companion",
            "#### Operator preflight (before first `collectBugData`)",
            "### Forbidden phrasing",
            "### Confluence output (not table rows)",
            "COMPANION_WHATSAPP_EPICS.md",
        ],
        "reference-companion-whatsapp.md",
    )

    errors += _must_contain(
        skill,
        [
            "name: user-story-gap-review",
            "reference.md",
            "reference-companion-whatsapp.md",
            "2b. **Companion channel cross-scan",
            "**When to invoke Peanut (2WE per-row)**",
        ],
        "SKILL.md",
    )

    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        return 1
    print("OK: user-story-gap-review skill contract checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
