#!/usr/bin/env python3
"""Find duplicate or near-identical **Suggested missing BDD** scenarios across Story rows.

Parses Storage HTML from `/user-story-gap-review` emitters: each data row has seven ``<td>`` cells;
column 0 must contain ``HRREC-``; column 6 holds BDD HTML.

Scenario blocks are split on ``<p><strong>Scenario:</strong>`` (standard ``bdd_block`` shape) or
treated as a single **special** cell when there is no Scenario heading (e.g. placeholder-only text).

Usage:
  python3 check_gap_review_bdd_duplicates.py path/to/gap_review.html
  python3 check_gap_review_bdd_duplicates.py path/to/gap_review.html --min-keys 2 --min-chars 30 --full-column

Exact matching fingerprints the **Given/When/Then** body. Rows that use the emitter default BDD differ only in
the Jira summary fragment inside **When**; those are additionally grouped via an internal template collapse.

Exit 0 always; prints human-readable groups to stdout.
"""
from __future__ import annotations

import argparse
import re
from collections import defaultdict


def _strip_tags(s: str) -> str:
    t = re.sub(r"<[^>]+>", " ", s)
    return " ".join(t.split())


def _extract_trs(html: str) -> list[str]:
    return re.findall(r"<tr>\s*(.*?)\s*</tr>", html, flags=re.DOTALL | re.IGNORECASE)


def _td_cells(tr_inner: str) -> list[str]:
    return re.findall(r"<td>(.*?)</td>", tr_inner, flags=re.DOTALL | re.IGNORECASE)


_SCENARIO_SPLIT = re.compile(
    r"(?=<p><strong>Scenario:</strong>)", flags=re.IGNORECASE
)
_SCENARIO_PAIR = re.compile(
    r"<p><strong>Scenario:</strong>\s*(.*?)</p>\s*"
    r"<p><strong>Given</strong>(.*?)</p>",
    flags=re.DOTALL | re.IGNORECASE,
)


def _parse_bdd_scenarios(bdd_html: str) -> list[tuple[str, str]]:
    """Return list of (scenario_title_plain, gwt_plain) for each structured block."""
    parts = [p for p in _SCENARIO_SPLIT.split(bdd_html) if p.strip()]
    out: list[tuple[str, str]] = []
    if not parts:
        return out

    if not re.search(r"<p><strong>Scenario:</strong>", bdd_html, flags=re.IGNORECASE):
        whole = _strip_tags(bdd_html).strip().lower()
        if whole:
            out.append(("", whole))
        return out

    for part in parts:
        m = _SCENARIO_PAIR.search(part)
        if not m:
            tail = _strip_tags(part).strip().lower()
            if len(tail) >= 20:
                out.append(("", tail))
            continue
        title = _strip_tags(m.group(1)).strip().lower()
        gwt = _strip_tags("<strong>Given" + m.group(2)).strip().lower()
        out.append((title, gwt))
    return out


def _row_keys_and_bdd(html: str) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for tr in _extract_trs(html):
        cells = _td_cells(tr)
        if len(cells) < 7:
            continue
        m = re.search(r"HRREC-\d+", cells[0], flags=re.IGNORECASE)
        if not m:
            continue
        rows.append((m.group(0).upper(), cells[6]))
    return rows


def _collapse_emitter_default_unhappy_path(title: str, gwt: str) -> str | None:
    """If this matches the default `bdd_block` from emit_gap_review_* (variant summary in When), return a stable fingerprint."""
    marker = "the system is in the unhappy path implied by this story title:"
    if marker not in gwt:
        return None
    t2 = re.sub(r"\bhrrec-\d+\b", "__KEY__", title, flags=re.IGNORECASE)
    g2 = re.sub(
        r"(\bwhen\b\s+the system is in the unhappy path implied by this story title:).+?(\bthen\b)",
        r"\1 __JIRA_SUMMARY_EXCERPT__ \2",
        gwt,
        flags=re.DOTALL,
    )
    return f"{t2}||{g2}"


def main() -> int:
    ap = argparse.ArgumentParser(description="Report duplicate BDD scenarios across gap-review rows.")
    ap.add_argument("html_path", help="Path to gap review Storage HTML")
    ap.add_argument(
        "--min-keys",
        type=int,
        default=2,
        metavar="N",
        help="Minimum distinct story keys sharing a fingerprint to report (default: 2)",
    )
    ap.add_argument(
        "--min-chars",
        type=int,
        default=40,
        metavar="N",
        help="Ignore GWT fingerprints shorter than this after normalize (default: 40)",
    )
    ap.add_argument(
        "--full-column",
        action="store_true",
        help="Also report duplicate entire BDD column bodies (normalized)",
    )
    args = ap.parse_args()
    min_keys = max(2, args.min_keys)
    min_chars = max(10, args.min_chars)

    html = open(args.html_path, encoding="utf-8").read()
    keyed = _row_keys_and_bdd(html)

    gwt_to_keys: dict[str, set[str]] = defaultdict(set)
    gwt_sample_title: dict[str, str] = {}

    for key, bdd_html in keyed:
        for title, gwt in _parse_bdd_scenarios(bdd_html):
            if len(gwt) < min_chars:
                continue
            gwt_to_keys[gwt].add(key)
            if gwt not in gwt_sample_title and title:
                gwt_sample_title[gwt] = title

    dup_scenarios = [(gwt, keys) for gwt, keys in gwt_to_keys.items() if len(keys) >= min_keys]
    dup_scenarios.sort(key=lambda x: (-len(x[1]), -len(x[0])))

    print(f"File: {args.html_path}")
    print(f"Story rows with BDD column: {len(keyed)}")
    print(
        f"Duplicate **scenario GWT** groups (min_keys={min_keys}, min_chars={min_chars}): "
        f"{len(dup_scenarios)}\n"
    )

    for i, (gwt, keys) in enumerate(dup_scenarios[:50], 1):
        ks = sorted(keys)
        title = gwt_sample_title.get(gwt, "")
        print(f"--- Group {i} ({len(ks)} stories) ---")
        print(f"Keys: {', '.join(ks)}")
        if title:
            print(f"Scenario title (first seen): {title!r}")
        print(f"GWT fingerprint (normalized, {len(gwt)} chars): {gwt[:220]}{'…' if len(gwt) > 220 else ''}")
        print()

    if len(dup_scenarios) > 50:
        print(f"(… truncated; {len(dup_scenarios) - 50} more groups not shown)\n")

    if args.full_column:
        col: dict[str, set[str]] = defaultdict(set)
        for key, bdd_html in keyed:
            fp = _strip_tags(bdd_html).strip().lower()
            if len(fp) < min_chars:
                continue
            col[fp].add(key)
        dcol = [(fp, ks) for fp, ks in col.items() if len(ks) >= min_keys]
        dcol.sort(key=lambda x: -len(x[1]))
        print(f"Duplicate **entire BDD column** groups: {len(dcol)}\n")
        for i, (fp, keys) in enumerate(dcol[:20], 1):
            print(f"--- Full column group {i} ({len(keys)} stories) ---")
            print(f"Keys: {', '.join(sorted(keys))}")
            print(f"Body: {fp[:240]}{'…' if len(fp) > 240 else ''}\n")

    coll: dict[str, set[str]] = defaultdict(set)
    for key, bdd_html in keyed:
        for title, gwt in _parse_bdd_scenarios(bdd_html):
            fp = _collapse_emitter_default_unhappy_path(title, gwt)
            if fp is not None:
                coll[fp].add(key)
    tgroups = [(fp, ks) for fp, ks in coll.items() if len(ks) >= min_keys]
    tgroups.sort(key=lambda x: -len(x[1]))
    print(
        f"Template-collapsed groups (default unhappy-path BDD; summary in **When** stripped; min_keys={min_keys}): "
        f"{len(tgroups)}\n"
    )
    for i, (fp, keys) in enumerate(tgroups[:20], 1):
        ks = sorted(keys)
        print(f"--- Template group {i} ({len(ks)} stories) ---")
        print(f"Keys: {', '.join(ks)}")
        print(f"Collapsed fingerprint: {fp[:260]}{'…' if len(fp) > 260 else ''}\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
