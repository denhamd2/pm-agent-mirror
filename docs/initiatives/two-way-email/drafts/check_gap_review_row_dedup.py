#!/usr/bin/env python3
"""Warn when many gap-review table rows share nearly identical cell bodies.

Expects the standard **seven** Storage HTML columns per [`user-story-gap-review`]:
Story, column **2** (**Gap Likelihood** — Confluence `status` macro on live MCP runs and draft HTML), PM lens, QA lens, Dev lens, Verdict, Suggested missing BDD.

When the file contains ``<!-- possible-missing-stories-table -->``, also parses the **first** following ``<table>`` (holistic **Possible missing stories** grid) and fingerprints **Reason Why This May Be Missing** + **BDD scenarios** (columns 2 and 3, 0-based indices 1 and 2) per data row (exactly **three** ``<td>`` cells per ``<tr>``). Warns when at least ``--holistic-threshold`` rows share the same combined fingerprint (default **4**; use **3** for a stricter pass).

Usage:
  python3 check_gap_review_row_dedup.py path/to/gap_review.html
  python3 check_gap_review_row_dedup.py path/to/gap_review.html --threshold 4
  python3 check_gap_review_row_dedup.py path/to/gap_review.html --holistic-threshold 3

Exit 0 always; prints warnings to stdout. Intended as an optional manual gate before Confluence publish.
"""
from __future__ import annotations

import argparse
import re
import sys
from collections import Counter

# (column label, td index, fingerprint max length after tag strip)
_GAP_REVIEW_COLUMNS: tuple[tuple[str, int, int], ...] = (
    ("PM lens", 2, 420),
    ("QA lens", 3, 500),
    ("Dev lens", 4, 520),
    ("Verdict", 5, 400),
    ("Suggested missing BDD", 6, 640),
)

_HOLISTIC_MARKER = "<!-- possible-missing-stories-table -->"


def _strip_tags(s: str) -> str:
    t = re.sub(r"<[^>]+>", " ", s)
    return " ".join(t.split())


def _extract_trs(html: str) -> list[str]:
    return re.findall(r"<tr>\s*(.*?)\s*</tr>", html, flags=re.DOTALL | re.IGNORECASE)


def _td_cells(tr_inner: str) -> list[str]:
    return re.findall(r"<td>(.*?)</td>", tr_inner, flags=re.DOTALL | re.IGNORECASE)


def _slice_first_table(html_fragment: str) -> str | None:
    """Return the first complete <table>...</table> starting in html_fragment, or None."""
    m = re.search(r"<table\b", html_fragment, flags=re.IGNORECASE)
    if not m:
        return None
    start = m.start()
    i = m.end()
    lower = html_fragment.lower()
    depth = 1
    while depth > 0 and i < len(html_fragment):
        next_open = lower.find("<table", i)
        next_close = lower.find("</table>", i)
        if next_close < 0:
            return None
        if 0 <= next_open < next_close:
            depth += 1
            i = next_open + 6
        else:
            depth -= 1
            if depth == 0:
                return html_fragment[start : next_close + len("</table>")]
            i = next_close + len("</table>")
    return None


def _holistic_reason_bdd_fingerprints(table_html: str) -> list[str]:
    """One fingerprint per holistic data row (Reason + BDD combined after tag strip)."""
    fps: list[str] = []
    for tr in _extract_trs(table_html):
        cells = _td_cells(tr)
        if len(cells) != 3:
            continue
        c0 = _strip_tags(cells[0]).strip().lower()
        if c0 == "user story":
            continue
        reason = _strip_tags(cells[1])[:420]
        bdd = _strip_tags(cells[2])[:640]
        fps.append(f"{reason}||{bdd}")
    return fps


def main() -> int:
    ap = argparse.ArgumentParser(description="Warn on duplicate gap-review table column text.")
    ap.add_argument("html_path", help="Path to gap review Storage HTML")
    ap.add_argument(
        "--threshold",
        type=int,
        default=5,
        metavar="N",
        help="Warn when at least N data rows share the same fingerprint (default: 5)",
    )
    ap.add_argument(
        "--holistic-threshold",
        type=int,
        default=4,
        metavar="N",
        help="Holistic Possible missing stories table: warn when ≥N rows share same Reason+BDD fingerprint (default: 4)",
    )
    args = ap.parse_args()
    path = args.html_path
    threshold = max(2, args.threshold)
    holistic_threshold = max(2, args.holistic_threshold)

    html = open(path, encoding="utf-8").read()
    rows = _extract_trs(html)
    keys: list[str] = []
    columns: dict[str, list[str]] = {label: [] for label, _, _ in _GAP_REVIEW_COLUMNS}
    skipped_short = 0
    skipped_nonstory = 0

    for tr in rows:
        cells = _td_cells(tr)
        if len(cells) < 7:
            skipped_short += 1
            continue
        m = re.search(r"HRREC-\d+", cells[0], flags=re.IGNORECASE)
        if not m:
            skipped_nonstory += 1
            continue
        keys.append(m.group(0))
        for label, idx, maxlen in _GAP_REVIEW_COLUMNS:
            raw = cells[idx] if idx < len(cells) else ""
            columns[label].append(_strip_tags(raw)[:maxlen])

    def report(label: str, texts: list[str]) -> None:
        if len(texts) != len(keys):
            return
        ctr = Counter(texts)
        dup = [(t, n) for t, n in ctr.items() if n >= threshold and t.strip()]
        dup.sort(key=lambda x: -x[1])
        for t, n in dup[:8]:
            print(f"WARN {label}: {n} rows share similar text (first 120 chars): {t[:120]!r}…")

    for label, _, _ in _GAP_REVIEW_COLUMNS:
        report(label, columns[label])

    if _HOLISTIC_MARKER in html:
        pos = html.find(_HOLISTIC_MARKER)
        holistic_table = _slice_first_table(html[pos:])
        if holistic_table:
            h_fps = _holistic_reason_bdd_fingerprints(holistic_table)
            ctr_h = Counter(h_fps)
            dup_h = [(t, n) for t, n in ctr_h.items() if n >= holistic_threshold and t.strip()]
            dup_h.sort(key=lambda x: -x[1])
            for t, n in dup_h[:8]:
                print(
                    f"WARN holistic (Reason+BDD): {n} rows share similar text (first 120 chars): {t[:120]!r}…"
                )
            print(
                f"Holistic table: checked {len(h_fps)} rows (holistic_threshold={holistic_threshold})."
            )
        else:
            print(
                "WARN holistic: marker present but no <table> found after <!-- possible-missing-stories-table -->."
            )

    print(
        f"Checked {len(keys)} story rows (threshold={threshold}; "
        f"skipped {skipped_short} rows with fewer than seven td cells, {skipped_nonstory} rows without HRREC key in col 0)."
    )
    if keys:
        print(f"Keys sampled: {', '.join(keys[:5])}{' …' if len(keys) > 5 else ''}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
