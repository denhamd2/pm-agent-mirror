"""Confluence Storage **Status** macros for gap-review **Gap Likelihood** column.

Shared by live-adjacent HTML builders under `docs/initiatives/two-way-email/drafts/`.
See `.cursor/skills/user-story-gap-review/reference.md` — **Gap column (2)**.
"""

from __future__ import annotations

import re
from html import escape

_GAP_LIKELIHOOD_COLOURS: dict[str, str] = {
    "Very High": "Red",
    "High": "Yellow",
    "Medium": "Blue",
    "Low": "Green",
    "Very Low": "Grey",
}


def gap_likelihood_title_from_heuristic_pct(pct: int) -> str:
    """Map a compact heuristic score (replay / formatter) to the five Gap Likelihood labels."""
    pct = max(0, min(100, int(pct)))
    if pct >= 72:
        return "Very High"
    if pct >= 58:
        return "High"
    if pct >= 46:
        return "Medium"
    if pct >= 34:
        return "Low"
    return "Very Low"


def split_legacy_pct_gap_cell(text: str) -> tuple[int, str]:
    r"""Parse ``'38% — clause'`` (em dash or hyphen) strings; default ``pct=40`` if unparseable."""
    t = (text or "").strip()
    m = re.match(r"^(\d{1,3})%\s*[—\-]\s*(.*)$", t, re.DOTALL)
    if m:
        return int(m.group(1)), m.group(2).strip()
    return 40, t


def gap_likelihood_title_to_colour(title: str) -> str:
    """Return Confluence `colour` parameter for a valid Gap Likelihood label."""
    try:
        return _GAP_LIKELIHOOD_COLOURS[title]
    except KeyError as e:
        raise ValueError(
            f"Invalid Gap Likelihood title {title!r}; expected one of {sorted(_GAP_LIKELIHOOD_COLOURS)}"
        ) from e


def gap_likelihood_status_macro(title: str) -> str:
    """Confluence Storage Format: coloured Status label (structured-macro)."""
    colour = gap_likelihood_title_to_colour(title)
    return (
        '<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{escape(title)}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{colour}</ac:parameter>'
        "</ac:structured-macro>"
    )


def gap_likelihood_cell_from_legacy_pct_clause(text: str) -> str:
    """Status macro + clause paragraph for frozen rows that still store ``NN% — …`` prose."""
    pct, clause = split_legacy_pct_gap_cell(text)
    title = gap_likelihood_title_from_heuristic_pct(pct)
    return gap_likelihood_status_macro(title) + f"<p>{escape(clause)}</p>"
