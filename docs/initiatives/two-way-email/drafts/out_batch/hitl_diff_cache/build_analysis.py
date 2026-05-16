#!/usr/bin/env python3
"""Build HRREC-82977 HITL diff inventory, per-story tags, and markdown report."""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CACHE = BASE / "hitl_diff_cache"
MAPPING = BASE / "story-jira-mapping.json"
ORIG_WIKI = CACHE / "original_wiki_by_shard.json"
CURRENT = CACHE / "current_descriptions.json"


def norm(s: str) -> str:
    if not s:
        return ""
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    s = s.replace("\u00a0", " ").replace("\u200b", "")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip().lower()


def count_h3(s: str) -> int:
    return len(re.findall(r"^h3\.", s, re.MULTILINE | re.IGNORECASE))


def tech_surface(s: str) -> bool:
    """Heuristic: REST/XO/API/HTTP error language surfaced in description."""
    return bool(
        re.search(
            r"\b(rest\s+api|\brest\b|\bapi\b|\bxo\b|json|http\s+[45]\d\d|idempotent)\b",
            s,
            re.I,
        )
    )


def infer_plan_taxonomy(
    orig: str,
    cur: str,
    tags: list[str],
    sum_create: str,
    sum_jira: str,
) -> list[str]:
    """Map heuristics to the HRREC-82977 review plan buckets."""
    if norm(orig) == norm(cur):
        out = {"Metadata_only"}
        if norm(sum_create) != norm(sum_jira):
            out.add("Product_decision")
        return sorted(out)

    pt: set[str] = set()
    if "Security_IDOR_explicit" in tags:
        pt.add("Defer_error_UI")
    if "UX_numeric_or_breakpoint" in tags or "Push_overlay_refinement" in tags:
        pt.add("UX_numeric")
    if "Testing_exploratory_pivot" in tags or "Major_contraction_or_pivot" in tags:
        pt.add("Scope_trim")
        pt.add("Product_decision")
    if "Fewer_scenarios" in tags:
        pt.add("Scope_trim")
        if (
            "Testing_exploratory_pivot" not in tags
            and "Substantial_expansion" not in tags
        ):
            pt.add("Dedupe_across_stories")
    if "Substantial_expansion" in tags:
        pt.add("Wording_Gherkin")
    if "Other_copy_edit" in tags or "Whitespace_or_case_only" in tags:
        pt.add("Wording_Gherkin")
    if "Summary_rewritten" in tags or "Summary_agency_scope_clarity" in tags:
        pt.add("Product_decision")
    if "Notes_research_backfill" in tags or "Notes_external_links" in tags:
        pt.add("Product_decision")
    if "Explicit_negative_scope_GenAI" in tags:
        pt.add("Product_decision")
    if tech_surface(cur) and not tech_surface(orig):
        pt.add("XO_UI_split")
    if "More_scenarios" in tags:
        pt.add("Wording_Gherkin")
    if not pt:
        pt.add("Wording_Gherkin")
    return sorted(pt)


def load_rows():
    m = json.loads(MAPPING.read_text(encoding="utf-8"))
    dedupe = set(m["meta"]["dedupe_do_not_recreate_keys"])
    rows = []
    for st in m["stories"]:
        k = st["jira_key"]
        ex = k in dedupe
        rows.append(
            {
                "shard": st["shard"],
                "jira_key": k,
                "summary_at_create": st["summary"],
                "excluded_by_plan_dedupe": ex,
            }
        )
    return rows, dedupe


def classify(orig: str, cur: str, sum_create: str, sum_jira: str) -> list[str]:
    tags: list[str] = []
    if norm(orig) == norm(cur):
        tags.append("Unchanged_description")
        return tags
    if norm(orig.replace(" ", "")) == norm(cur.replace(" ", "")):
        tags.append("Whitespace_or_case_only")
        return tags

    lo, lc = len(orig), len(cur)
    ho, hc = count_h3(orig), count_h3(cur)
    if ho and hc < ho:
        tags.append("Fewer_scenarios")
    if hc > ho:
        tags.append("More_scenarios")
    if lc < lo * 0.45:
        tags.append("Major_contraction_or_pivot")
    elif lc > lo * 1.25:
        tags.append("Substantial_expansion")

    if "\r\n" in cur and "\r\n" not in orig:
        tags.append("Jira_editor_CRLF")

    if ("may 5th" in cur.lower() or "message builder team" in cur.lower()) and (
        "may 5th" not in orig.lower()
    ):
        tags.append("Notes_research_backfill")

    if "genai" in cur.lower() or "purple sparkle" in cur.lower():
        tags.append("Explicit_negative_scope_GenAI")

    if re.search(r"\b(403|404|forbidden)\b", cur, re.I) and not re.search(
        r"\b(403|404|forbidden)\b", orig, re.I
    ):
        tags.append("Security_IDOR_explicit")

    if re.search(r"\b(xl|breakpoint|800|1000|1920)\b", cur, re.I) and not re.search(
        r"\b(xl|breakpoint|800|1000|1920)\b", orig, re.I
    ):
        tags.append("UX_numeric_or_breakpoint")

    if "overlay" in cur.lower() and "overlay" not in orig.lower():
        tags.append("Push_overlay_refinement")

    if norm(sum_create) != norm(sum_jira):
        tags.append("Summary_rewritten")

    if "non-agency" in sum_jira.lower() and "non-agency" not in sum_create.lower():
        tags.append("Summary_agency_scope_clarity")

    if "exploratory" in cur.lower() and "exploratory" not in orig.lower():
        tags.append("Testing_exploratory_pivot")

    if "aws.amazon.com" in cur.lower() or "transmgmt" in cur.lower():
        tags.append("Notes_external_links")

    if not tags:
        tags.append("Other_copy_edit")
    return tags


def main():
    rows, dedupe = load_rows()
    orig_map = json.loads(ORIG_WIKI.read_text(encoding="utf-8"))
    current = json.loads(CURRENT.read_text(encoding="utf-8"))

    inventory = {
        "epic": "HRREC-82977",
        "dedupe_keys_excluded_from_plan_scope": sorted(dedupe),
        "note_story_000_HRREC_91980": "Excluded per story-jira-mapping dedupe; original wiki still in all_invokes/story_000.json if needed.",
        "rows": [r for r in rows if not r["excluded_by_plan_dedupe"]],
    }
    (CACHE / "inventory.json").write_text(
        json.dumps(inventory, indent=2), encoding="utf-8"
    )

    per_story = []
    tag_counter: Counter[str] = Counter()
    examples: dict[str, list[str]] = defaultdict(list)
    plan_counter: Counter[str] = Counter()
    plan_examples: dict[str, list[str]] = defaultdict(list)

    for r in inventory["rows"]:
        shard = r["shard"]
        key = r["jira_key"]
        orig = orig_map.get(shard, "")
        if key not in current:
            per_story.append(
                {
                    "jira_key": key,
                    "shard": shard,
                    "error": "missing_from_jira_fetch",
                }
            )
            continue
        ent = current[key]
        cur = ent.get("description") or ""
        sum_j = ent.get("summary") or ""
        tags = classify(orig, cur, r["summary_at_create"], sum_j)
        plan = infer_plan_taxonomy(orig, cur, tags, r["summary_at_create"], sum_j)
        for t in tags:
            tag_counter[t] += 1
            if len(examples[t]) < 4:
                examples[t].append(key)
        for p in plan:
            plan_counter[p] += 1
            if len(plan_examples[p]) < 4:
                plan_examples[p].append(key)

        per_story.append(
            {
                "jira_key": key,
                "shard": shard,
                "summary_at_create": r["summary_at_create"],
                "summary_current": sum_j,
                "h3_original": count_h3(orig),
                "h3_current": count_h3(cur),
                "len_original": len(orig),
                "len_current": len(cur),
                "description_equal_normalized": norm(orig) == norm(cur),
                "tags": tags,
                "plan_taxonomy": plan,
            }
        )

    (CACHE / "per_story_analysis.json").write_text(
        json.dumps(per_story, indent=2), encoding="utf-8"
    )

    # Markdown report
    lines = [
        "# HRREC-82977 HITL diff review (automation vs current Jira)",
        "",
        "Epic: [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977).",
        "",
        "## Scope",
        "",
        "- **Original**: `all_invokes/story_NNN.json` wiki payloads + [`story-jira-mapping.json`](../story-jira-mapping.json).",
        "- **Current**: Jira `fields.description` + summary fetched via `user-jira-ghe` `executeApi` (cached in [`current_descriptions.json`](current_descriptions.json)).",
        f"- **Compared**: {len(inventory['rows'])} stories (keys **not** in `dedupe_do_not_recreate_keys`; HRREC-91980 story_000 excluded per mapping meta).",
        "",
        "## Plan taxonomy (review buckets)",
        "",
        "Heuristic mapping from diffs to the epic review categories (a story may have multiple buckets).",
        "",
        "| Bucket | Count | Example keys |",
        "|--------|-------|----------------|",
    ]
    for p, cnt in plan_counter.most_common():
        ex = ", ".join(plan_examples[p])
        lines.append(f"| {p} | {cnt} | {ex} |")
    lines.extend(
        [
            "",
            "- **Metadata_only** — Normalised description text unchanged (summary may still change → also **Product_decision**).",
            "- **Wording_Gherkin** — BDD rewrite, microcopy, CRLF aside, or more scenarios.",
            "- **Scope_trim** — Fewer `h3` scenarios and/or major contraction / exploratory testing pivot.",
            "- **Dedupe_across_stories** — Fewer scenarios **without** big expansion (likely moved concern to sibling).",
            "- **Product_decision** — Summary, Notes research, negative scope, exploratory milestone, or major pivot.",
            "- **UX_numeric** — Breakpoints / overlay behaviour spelled out.",
            "- **Defer_error_UI** — Explicit 403/404 / security copy added vs original.",
            "- **XO_UI_split** — REST/API/XO/HTTP language appears in current text but not in bulk wiki.",
            "",
            "## Pattern frequency (heuristic tags)",
            "",
            "| Tag | Count | Example keys |",
            "|-----|-------|----------------|",
        ]
    )
    for tag, cnt in tag_counter.most_common():
        ex = ", ".join(examples[tag])
        lines.append(f"| {tag} | {cnt} | {ex} |")
    lines.extend(
        [
            "",
            "## Per-story snapshot (sortable)",
            "",
            "| Key | Shard | H3 orig | H3 cur | Len Δ | Summary changed? | Plan buckets | Tags |",
            "|-----|-------|---------|--------|-------|------------------|----------------|------|",
        ]
    )
    for s in sorted(per_story, key=lambda x: x["jira_key"]):
        if "error" in s:
            lines.append(
                f"| {s['jira_key']} | {s['shard']} | — | — | — | — | — | {s['error']} |"
            )
            continue
        ch = "yes" if norm(s["summary_at_create"]) != norm(s["summary_current"]) else ""
        dlen = s["len_current"] - s["len_original"]
        tags = ", ".join(s["tags"])
        plan = ", ".join(s["plan_taxonomy"])
        lines.append(
            f"| [{s['jira_key']}](https://jira2.workday.com/browse/{s['jira_key']}) | {s['shard']} | {s['h3_original']} | {s['h3_current']} | {dlen:+d} | {ch} | {plan} | {tags} |"
        )

    lines.extend(
        [
            "",
            "## HITL playbook (inferred “why” from patterns)",
            "",
            "Narrative deep dive on **summary rewrites** and **substantial expansion** (evidence, drivers, 430 guidance): [HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md](HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md).",
            "",
            "1. **Summary rewrites** — Titles were tightened for **non-agency vs agency**, **UI-only** scope, or **split send stories** (e.g. compose vs To-field). *Skill:* tie summary to persona + channel + **MVP slice** in one line; avoid duplicating body.",
            "2. **Substantial expansion** — BDD was rewritten into **formal recruiter voice**, **explicit error strings**, **REST vs UI** split, and **negative scope** (GenAI toolbar). *430:* add default **Notes** bullets for “no draft persistence” / “copy before refresh” when mid-session errors appear.",
            "3. **Fewer scenarios** — Threads/list stories dropped to **two scenarios** or reporting pivoted to **exploratory milestone note** (HRREC-92013). *430 Step 5:* allow 2-scenario stories when second is **milestone/testing** deferral documented in Notes.",
            "4. **UX / layout** — Push vs **overlay on XL**, modal shadow, **numeric breakpoints** added where design caught up. *430:* require **Workday breakpoint vocabulary** (M/S vs L/XL) alongside pixels when known.",
            "5. **Dedupe / placement** — Channel-disabled vs empty state, agency tabs, security 403 paths surfaced on the **owning** story. Aligns with **Step 1c / §3c** already added to rules.",
            "6. **Jira editor CRLF** — Many edits introduced `\\r\\n`; normalise in diff tools. *Skill:* no change needed if wiki push is consistent.",
            "",
            "## Recommended rule / skill follow-ups",
            "",
            "- **430**: Add a short **two-way email summary checklist** — non-agency default, UI-only vs data population, milestone exploratory one-liner pattern for non-functional regression stories.",
            "- **430 Step 5**: When expanding error UX, require **Notes** cross-link if a sibling owns **generic REST error catalogue**.",
            "- **435 §3d**: FLAG if **Then** quotes **exact customer strings** without **319** pass (several stories now have long headline/body pairs — good, but validator should ensure problem+solution pattern).",
            "- **jira-recruiting-story-description SKILL**: Optional bullet — if HITL replaces body in Jira UI, re-export wiki via `GET` before next bulk automation run.",
            "",
            "## Validator (435) strategy",
            "",
            "- **Keep 435** as the **epic coherence** + **concern ownership** gate; removing it shifts rework to Three Amigos (this epic shows heavy HITL).",
            "- **Thin maintenance**: link epic context (e.g. `CONTEXT.md`) to this folder; keep **435** as checklist + report template rather than duplicating long examples inline.",
            "- **Fold into 430?** Only for **format-only** checks; keep **435** separate for **cross-story ownership** and **epic-level** gates (this batch shows **Dedupe_across_stories** + **Product_decision** dominating, which 430 alone will not catch reliably).",
            "",
            "## Re-fetch current Jira text",
            "",
            "Re-run `user-jira-ghe` `executeApi` with the key list in `inventory.json` or use `getTicketDetails` per key; overwrite `current_descriptions.json`.",
        ]
    )

    out_md = CACHE / "HITL_DIFF_REPORT.md"
    out_md.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", out_md)
    print("Heuristic tags:", dict(tag_counter))
    print("Plan taxonomy:", dict(plan_counter))


if __name__ == "__main__":
    main()
