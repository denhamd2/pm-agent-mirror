#!/usr/bin/env python3
"""
Build HRREC-82977 HITL diff report.

1) Loads story-jira-mapping.json, excludes keys in meta.dedupe_do_not_recreate_keys.
2) Loads original_wiki_by_shard.json (from extract_original_wiki.py).
3) If hitl_diff_cache/current_descriptions.json exists: { "HRREC-91981": "<wiki>", ... }
   then compute per-key normalized diff + heuristics vs original.
4) Always: corpus-level analysis on originals (duplicate themes, error-density).

Write: ../hitl_diff_cache/HRREC-82977_HITL_DIFF_REPORT.md
"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CACHE = BASE / "hitl_diff_cache"
MAPPING = BASE / "story-jira-mapping.json"
ORIGINAL = CACHE / "original_wiki_by_shard.json"
CURRENT_FILE = CACHE / "current_descriptions.json"

DEDUPE_KEYS = set()  # filled from mapping


def normalize_wiki(s: str) -> str:
    s = s.replace("\r\n", "\n").strip()
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s


def scenario_titles(wiki: str) -> list[str]:
    titles = []
    for m in re.finditer(r"h3\.\s*Scenario\s*\d+\s*:\s*([^\n]+)", wiki, re.I):
        titles.append(m.group(1).strip())
    return titles


def theme_tokens(text: str) -> set[str]:
    t = text.lower()
    out = set()
    for kw, tag in [
        ("tenant", "tenant_channel"),
        ("disabled", "tenant_channel"),
        ("channel", "channel_policy"),
        ("mask", "masked_dates"),
        ("purge", "purge_privacy"),
        ("403", "permission_error"),
        ("permission", "permission_error"),
        ("revoked", "permission_error"),
        ("session", "permission_error"),
        ("unauthorised", "permission_error"),
        ("unauthorized", "permission_error"),
        ("error", "error_mention"),
        ("inbox", "inbox_surface"),
        ("agency", "agency"),
        ("opt", "opt_in"),
        ("overlay", "push_overlay"),
        ("push", "push_overlay"),
        ("pixel", "ux_numeric"),
        ("breakpoint", "ux_numeric"),
    ]:
        if kw in t:
            out.add(tag)
    return out


def heuristic_tags(orig: str, cur: str | None) -> list[str]:
    tags = []
    if cur is None:
        return ["CURRENT_UNAVAILABLE"]
    if normalize_wiki(orig) == normalize_wiki(cur):
        return ["UNCHANGED"]
    ol, cl = len(orig), len(cur)
    if cl < ol * 0.75:
        tags.append("Scope_trim_likely")
    if orig.count("h3.") > cur.count("h3."):
        tags.append("Fewer_scenarios")
    if cur.count("h3.") > orig.count("h3."):
        tags.append("More_scenarios")
    if "deferred" in cur.lower() or "covered under hrrec" in cur.lower() or "hrrec-" in cur.lower() and "defer" in cur.lower():
        tags.append("Dedupe_or_defer_note")
    if "h2. Notes" in cur or "Notes" in cur:
        if "Notes" in cur[cur.find("h2. Notes") :] if "h2. Notes" in cur else cur:
            pass
    ot, ct = theme_tokens(orig), theme_tokens(cur)
    if ot - ct:
        tags.append("Theme_removed_vs_orig")
    if ct - ot:
        tags.append("Theme_added_vs_orig")
    if re.search(r"\d{3,4}\s*px", cur) and not re.search(r"\d{3,4}\s*px", orig):
        tags.append("UX_numeric_added")
    return tags or ["EDITED_UNSPECIFIED"]


def load_mapping():
    data = json.loads(MAPPING.read_text(encoding="utf-8"))
    global DEDUPE_KEYS
    DEDUPE_KEYS = set(data["meta"].get("dedupe_do_not_recreate_keys", []))
    rows = []
    for s in data["stories"]:
        key = s["jira_key"]
        if key in DEDUPE_KEYS:
            continue
        rows.append(
            {
                "shard": s["shard"],
                "jira_key": key,
                "summary": s["summary"],
                "labels": s.get("labels", ""),
            }
        )
    return data["meta"], rows


def corpus_originals(original_by_shard: dict[str, str], rows: list) -> dict:
    """Find duplicate theme signals across bulk originals (pre-HITL agent weakness)."""
    key_themes: dict[str, set[str]] = {}
    theme_keys: defaultdict[str, list[str]] = defaultdict(list)
    for r in rows:
        shard = r["shard"]
        w = original_by_shard.get(shard, "")
        tt = theme_tokens(w)
        key_themes[r["jira_key"]] = tt
        for t in tt:
            theme_keys[t].append(r["jira_key"])
    multi = {t: keys for t, keys in theme_keys.items() if len(set(keys)) >= 2}
    return {"theme_to_keys": multi, "keys_per_row": key_themes}


def main():
    meta, rows = load_mapping()
    original_by_shard = json.loads(ORIGINAL.read_text(encoding="utf-8"))
    current_by_key: dict[str, str] = {}
    if CURRENT_FILE.exists():
        current_by_key = json.loads(CURRENT_FILE.read_text(encoding="utf-8"))

    corpus = corpus_originals(original_by_shard, rows)

    lines = [
        "# HRREC-82977 HITL diff review (automation output)",
        "",
        f"**Epic:** [{meta.get('epic')}]({meta.get('epic_url')})",
        f"**Compared keys:** {len(rows)} stories (excluded `dedupe_do_not_recreate_keys`: {sorted(DEDUPE_KEYS)})",
        "**Original source:** `drafts/out_batch/all_invokes/story_NNN.json` embedded `wiki` at bulk create.",
        "**Current source:** `hitl_diff_cache/current_descriptions.json` (optional). Populate with Jira `fields.description` wiki after MCP re-auth — see `README_HITL_DIFF_FETCH.md` in this folder.",
        "",
        "## 1. Inventory (filtered)",
        "",
        "| shard | jira_key | labels | summary |",
        "|---|---|---|---|",
    ]
    for r in rows:
        lines.append(
            f"| {r['shard']} | {r['jira_key']} | {r['labels']} | {r['summary'][:80]}{'…' if len(r['summary']) > 80 else ''} |"
        )

    lines.extend(
        [
            "",
            "## 2. Corpus analysis — originals only (bulk agent output)",
            "",
            "Theme tokens co-occur on multiple tickets in the **same** bulk batch (agent placed overlapping concerns before any HITL edit):",
            "",
        ]
    )
    for theme, keys in sorted(corpus["theme_to_keys"].items(), key=lambda x: -len(x[1])):
        uniq = sorted(set(keys))
        lines.append(f"- **{theme}** ({len(uniq)} tickets): {', '.join(uniq[:12])}{' …' if len(uniq) > 12 else ''}")

    lines.extend(["", "## 3. Per-ticket diff status", "", "| jira_key | shard | diff | heuristic_tags |", "|---|---|---|---|"])
    for r in rows:
        shard = r["shard"]
        key = r["jira_key"]
        orig = original_by_shard.get(shard, "")
        cur = current_by_key.get(key)
        if cur is None:
            tags = ["CURRENT_UNAVAILABLE"]
            diff = "n/a"
        else:
            tags = heuristic_tags(orig, cur)
            diff = "identical" if normalize_wiki(orig) == normalize_wiki(cur) else "changed"
        lines.append(f"| {key} | {shard} | {diff} | {', '.join(tags)} |")

    lines.extend(
        [
            "",
            "## 4. Pattern rollup (heuristic; refine after `current_descriptions.json` filled)",
            "",
            "| Pattern | Count | Example keys |",
            "|---|---:|---|",
        ]
    )
    ctr: Counter[str] = Counter()
    examples: defaultdict[str, list[str]] = defaultdict(list)
    for r in rows:
        shard = r["shard"]
        key = r["jira_key"]
        cur = current_by_key.get(key)
        orig = original_by_shard.get(shard, "")
        for t in heuristic_tags(orig, cur):
            ctr[t] += 1
            if len(examples[t]) < 4:
                examples[t].append(key)
    for pat, c in ctr.most_common():
        lines.append(f"| {pat} | {c} | {', '.join(examples[pat])} |")

    lines.extend(
        [
            "",
            "## 5. Skill / rule recommendations (evidence-based)",
            "",
            "### From original corpus overlap",
            "",
            "- Strengthen **430 Step 1c** / **435 §3c**: several bulk originals share **tenant_channel**, **permission_error**, **push_overlay** tokens across many keys — expect HITL to consolidate or defer; ledger should flag before create.",
            "- Add **430** guidance: initialization stories (91946–91948 references) should not each carry a full **channel disabled** scenario unless map assigns ownership.",
            "",
            "### After current bodies are merged",
            "",
            "- Re-run this script; use **§3d**-style review for tickets where `heuristic_tags` includes `Theme_removed_vs_orig` or `Fewer_scenarios` — map to Three Amigos themes (defer error UI, trim Gherkin, UX breakpoints).",
            "",
            "## 6. Validator strategy (435)",
            "",
            "- **Keep 435** as the mechanical epic gate (§3c/§3d); removing it shifts duplicate detection back to meetings only.",
            "- **Reduce upkeep:** keep **435** thin (checklist + report shell); long narrative stays in **430** and initiative runbooks.",
            "",
        ]
    )

    out = CACHE / "HRREC-82977_HITL_DIFF_REPORT.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out}")
    if not current_by_key:
        print("NOTE: No current_descriptions.json — diff column is CURRENT_UNAVAILABLE. See README_HITL_DIFF_FETCH.md")


if __name__ == "__main__":
    main()
