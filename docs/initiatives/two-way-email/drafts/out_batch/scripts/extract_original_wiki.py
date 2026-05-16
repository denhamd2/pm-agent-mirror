#!/usr/bin/env python3
"""Extract wiki string from all_invokes/story_NNN.json (executeApi payload)."""
import json
import re
import sys
from pathlib import Path

WIKI_RE = re.compile(r'"wiki"\s*:\s*"((?:[^"\\]|\\.)*?)"\s*\}\s*;', re.DOTALL)


def extract_wiki(invoke_path: Path) -> str:
    data = json.loads(invoke_path.read_text(encoding="utf-8"))
    code = data.get("code", "")
    m = WIKI_RE.search(code)
    if not m:
        raise ValueError(f"No wiki in {invoke_path}")
    raw = m.group(1)
    # Unescape JS string (minimal: \\n \\t \\" \\)
    return (
        raw.replace("\\n", "\n")
        .replace("\\t", "\t")
        .replace('\\"', '"')
        .replace("\\\\", "\\")
    )


def main():
    base = Path(__file__).resolve().parents[1] / "all_invokes"
    out = {}
    for p in sorted(base.glob("story_*.json")):
        shard = p.stem
        out[shard] = extract_wiki(p)
    out_path = Path(__file__).resolve().parents[1] / "hitl_diff_cache" / "original_wiki_by_shard.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=0), encoding="utf-8")
    print(f"Wrote {len(out)} shards to {out_path}")


if __name__ == "__main__":
    main()
