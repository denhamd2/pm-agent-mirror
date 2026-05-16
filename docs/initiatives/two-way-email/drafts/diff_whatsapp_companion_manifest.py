#!/usr/bin/env python3
"""
Compare frozen WhatsApp companion manifest keys to a live key set (Jira export).

Optional maintenance helper — not invoked by the gap-review skill by default.

Usage:
  python3 diff_whatsapp_companion_manifest.py \\
    --snapshot ../reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md \\
    --live-keys live_keys.txt

  python3 diff_whatsapp_companion_manifest.py \\
    --snapshot ../reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md \\
    --live-json search_export.json

live_keys.txt: one HRREC-nnnnn per line (comments and blanks ignored).
live_json: either a JSON array of keys, or {\"issues\": [{\"key\": \"...\"}, ...]}.

Exit codes: 0 = no diff, 1 = added or removed keys (or parse error), 2 = bad args.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

KEY_RE = re.compile(r"^HRREC-\d+$", re.IGNORECASE)


def parse_manifest_keys(snapshot_path: Path) -> set[str]:
    text = snapshot_path.read_text(encoding="utf-8")
    if "## Manifest" not in text:
        print("error: no '## Manifest' section in snapshot", file=sys.stderr)
        sys.exit(1)
    after = text.split("## Manifest", 1)[1]
    # stop at next ## heading
    chunk = re.split(r"\n## ", after, maxsplit=1)[0]
    keys: set[str] = set()
    for line in chunk.splitlines():
        line = line.strip()
        if KEY_RE.match(line):
            keys.add(line.upper())
    return keys


def parse_live_keys_file(path: Path) -> set[str]:
    keys: set[str] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if KEY_RE.match(line):
            keys.add(line.upper())
        else:
            print(f"warning: skipping non-key line: {line!r}", file=sys.stderr)
    return keys


def parse_live_json(path: Path) -> set[str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    keys: set[str] = set()
    if isinstance(data, list):
        for item in data:
            if isinstance(item, str) and KEY_RE.match(item):
                keys.add(item.upper())
    elif isinstance(data, dict) and "issues" in data:
        for issue in data["issues"]:
            if not isinstance(issue, dict):
                continue
            k = issue.get("key")
            if isinstance(k, str) and KEY_RE.match(k):
                keys.add(k.upper())
    else:
        print("error: JSON must be a list of keys or {\"issues\": [{\"key\": ...}]}", file=sys.stderr)
        sys.exit(1)
    return keys


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--snapshot",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "reference" / "WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md",
        help="Path to WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md",
    )
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--live-keys", type=Path, help="Text file: one Jira key per line")
    g.add_argument("--live-json", type=Path, help="JSON array of keys or Jira search issues payload")
    args = ap.parse_args()

    if not args.snapshot.is_file():
        print(f"error: snapshot not found: {args.snapshot}", file=sys.stderr)
        sys.exit(2)

    manifest = parse_manifest_keys(args.snapshot)
    if args.live_keys:
        live = parse_live_keys_file(args.live_keys)
    else:
        live = parse_live_json(args.live_json)

    added = sorted(live - manifest)
    removed = sorted(manifest - live)

    print(f"Manifest keys: {len(manifest)}  Live keys: {len(live)}")
    if not added and not removed:
        print("OK — manifest matches live set.")
        sys.exit(0)

    if added:
        print("\nIn live but NOT in manifest (add to manifest or investigate):")
        for k in added:
            print(f"  + {k}")
    if removed:
        print("\nIn manifest but NOT in live (staleness / moved issues):")
        for k in removed:
            print(f"  - {k}")
    sys.exit(1)


if __name__ == "__main__":
    main()
