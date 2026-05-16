#!/usr/bin/env python3
"""Regenerate story-jira-mapping.json from story-shards (summaries/labels only).

Preserves jira_key, jira_id, jira_url, status, notes when merging from an existing
mapping file (same shard id).

Usage:
  ./generate-story-jira-mapping.py
  ./generate-story-jira-mapping.py --merge path/to/old-story-jira-mapping.json
"""
from __future__ import annotations

import argparse
import json
import pathlib


def load_merge(path: pathlib.Path | None) -> dict[str, dict]:
    if not path or not path.is_file():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    out: dict[str, dict] = {}
    for row in data.get("stories", []):
        sk = row.get("shard")
        if sk:
            out[sk] = {
                k: row.get(k)
                for k in ("jira_key", "jira_id", "jira_url", "status", "notes")
                if row.get(k) is not None
            }
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--merge",
        type=pathlib.Path,
        default=None,
        help="Existing story-jira-mapping.json to carry forward keys/status per shard",
    )
    args = ap.parse_args()
    merged = load_merge(args.merge)

    here = pathlib.Path(__file__).resolve().parent
    root = here.parent
    shard_dir = root / "story-shards"
    out_path = here / "story-jira-mapping.json"

    stories = []
    for i in range(38):
        shard = f"story_{i:03d}"
        item = json.loads((shard_dir / f"{shard}.json").read_text(encoding="utf-8"))
        row = {
            "shard": shard,
            "summary": item["summary"],
            "labels": item.get("labels", ""),
            "wrap_file": f"mcp_wrap_b64/wrap_{i:03d}.txt" if 1 <= i <= 37 else None,
            "jira_key": None,
            "jira_id": None,
            "jira_url": None,
            "status": "pending",
            "notes": "",
        }
        if shard in merged:
            row.update({k: v for k, v in merged[shard].items() if v is not None})
        stories.append(row)

    meta = {
        "epic": "HRREC-82977",
        "epic_url": "https://jira2.workday.com/browse/HRREC-82977",
        "project": "HRREC",
        "component": "Candidate Two-Way Messaging",
        "scrum_team_field": 'customfield_15100 -> [{"id": "122500"}] (HRREC-Team 007)',
        "dedupe_do_not_recreate_keys": [
            "HRREC-91974",
            "HRREC-91975",
            "HRREC-91978",
            "HRREC-91979",
            "HRREC-91980",
        ],
        "dedupe_notes": (
            "91974-91979: early hand-filed stories (see drafts/jira-*.md). "
            "91980: shard story_000. Shards story_001-003 cite HRREC-91946-91948 in titles; "
            "POSTing them creates new stories that reference those inits—confirm with PM."
        ),
        "pending_wrap_count": 37,
    }
    doc = {"meta": meta, "stories": stories}
    out_path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out_path)


if __name__ == "__main__":
    main()
