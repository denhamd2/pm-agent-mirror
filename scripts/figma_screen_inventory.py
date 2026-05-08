#!/usr/bin/env python3
"""
Build a deduplicated screen inventory from Figma MCP get_metadata XML.

Usage:
  python3 scripts/figma_screen_inventory.py docs/figma-extraction-2way-email-2024/raw-metadata-page-mvp-26r2.xml.gz
  python3 scripts/figma_screen_inventory.py path/to/metadata.xml --write docs/figma-extraction-2way-email-2024/

Filters direct children of <canvas> that look like artboards (not section banners).
Dedupes by normalized frame name + rounded width x height (first occurrence wins).

Requires: Python 3.9+ (gzip stdin ok).
"""

from __future__ import annotations

import argparse
import gzip
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path
from typing import Any


FILE_KEY_DEFAULT = "HpAOHGAeXBORpHnyhsCMja"
FILE_SLUG_DEFAULT = "2-Way-Email_Recruiting_12_2024"


def figma_url(node_id: str, file_key: str = FILE_KEY_DEFAULT, file_slug: str = FILE_SLUG_DEFAULT) -> str:
    nid = node_id.replace(":", "-")
    return f"https://www.figma.com/design/{file_key}/{file_slug}?node-id={nid}"


def norm_key(name: str, w: float, h: float) -> tuple[str, int, int]:
    n = " ".join((name or "").split()).lower()
    return (n, round(w), round(h))


def slugify(name: str, node_id: str) -> str:
    s = name.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[-\s]+", "-", s).strip("-") or "screen"
    return f"{s}-{node_id.replace(':', '-')}"[:96]


def is_banner(w: float, h: float) -> bool:
    return h <= 200 and w > 1500


def is_tiny_artboard(w: float, h: float) -> bool:
    return max(w, h) < 600


def parse_canvas_children(xml_bytes: bytes) -> tuple[str, list[tuple[str, str, float, float]]]:
    root = ET.fromstring(xml_bytes)
    page = root.attrib.get("name", "").strip()
    rows: list[tuple[str, str, float, float]] = []
    for c in root:
        if c.tag != "frame":
            continue
        w = float(c.attrib.get("width", 0))
        h = float(c.attrib.get("height", 0))
        if is_banner(w, h) or is_tiny_artboard(w, h):
            continue
        rows.append((c.attrib["id"], c.attrib.get("name", ""), w, h))
    return page, rows


def dedupe(rows: list[tuple[str, str, float, float]]) -> tuple[
    list[tuple[str, str, float, float]], list[tuple[str, str, float, float, str]]
]:
    by_key: dict[tuple[str, int, int], list[tuple[str, str, float, float]]] = defaultdict(list)
    for r in rows:
        by_key[norm_key(r[1], r[2], r[3])].append(r)

    kept: list[tuple[str, str, float, float]] = []
    skipped: list[tuple[str, str, float, float, str]] = []
    for _k, lst in by_key.items():
        lst = sorted(lst, key=lambda x: x[0])
        kept.append(lst[0])
        canonical_id = lst[0][0]
        for dup in lst[1:]:
            skipped.append((*dup, f"duplicate_of:{canonical_id}"))
    kept.sort(key=lambda x: (x[2] * x[3], x[0]))
    return kept, skipped


def read_xml(path: Path) -> bytes:
    raw = path.read_bytes()
    if path.suffix == ".gz" or path.name.endswith(".xml.gz"):
        try:
            return gzip.decompress(raw)
        except OSError:
            return raw
    return raw


def write_outputs(
    out_dir: Path,
    page_name: str,
    kept: list[tuple[str, str, float, float]],
    skipped: list[tuple[str, str, float, float, str]],
    file_key: str,
    file_slug: str,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    screens_dir = out_dir / "screens"
    screens_dir.mkdir(exist_ok=True)

    payload: dict[str, Any] = {
        "fileKey": file_key,
        "pageName": page_name,
        "kept": [
            {"nodeId": k[0], "name": k[1], "width": k[2], "height": k[3], "figmaUrl": figma_url(k[0], file_key, file_slug)}
            for k in kept
        ],
        "skipped": [
            {"nodeId": s[0], "name": s[1], "width": s[2], "height": s[3], "reason": s[4]}
            for s in skipped
        ],
    }
    (out_dir / "screen-inventory.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    pending = {
        "fileKey": file_key,
        "instructions": "Call Figma MCP get_design_context for each nodeId when quota allows.",
        "nodeIds": [k[0] for k in kept],
    }
    (out_dir / "pending-design-context.json").write_text(json.dumps(pending, indent=2) + "\n", encoding="utf-8")

    md_lines = [
        "# Screen inventory — 2-Way Email Recruiting",
        "",
        f"**Figma file**: [{file_key}](https://www.figma.com/design/{file_key}/{file_slug})",
        f"**Metadata page (canvas)**: `{page_name}`",
        "",
        "Direct-child frames on this canvas were treated as candidate artboards. Section header strips (very wide, ~111px tall) were excluded. Duplicates collapsed using **name + width × height** (first `nodeId` kept).",
        "",
        "| # | Screen name | nodeId | Size | Figma link |",
        "|---|-------------|--------|------|------------|",
    ]
    for i, (nid, name, w, h) in enumerate(kept, 1):
        md_lines.append(
            f"| {i} | {name} | `{nid}` | {int(w)}×{int(h)} | [Open]({figma_url(nid, file_key, file_slug)}) |"
        )
    md_lines.extend(["", "## Skipped (duplicate variants)", "", "| nodeId | Name | Size | Reason |", "|--------|------|------|--------|"])
    for s in skipped:
        md_lines.append(f"| `{s[0]}` | {s[1]} | {int(s[2])}×{int(s[3])} | {s[4]} |")
    (out_dir / "screen-inventory.md").write_text("\n".join(md_lines) + "\n", encoding="utf-8")

    used_slugs: set[str] = set()
    for nid, name, w, h in kept:
        base = slugify(name, nid)
        slug = base
        n = 2
        while slug in used_slugs:
            slug = f"{base}-{n}"
            n += 1
        used_slugs.add(slug)
        d = screens_dir / slug
        d.mkdir(exist_ok=True)
        readme = f"""# {name}

- **nodeId**: `{nid}`
- **Size**: {int(w)}×{int(h)} px
- **Figma**: [Open in Figma]({figma_url(nid, file_key, file_slug)})

## Design context extraction

Run when Figma MCP quota allows:

```text
get_design_context(fileKey="{file_key}", nodeId="{nid}")
```

Optional: save MCP response under this folder as `design-context.txt` (or split screenshot/assets per your workflow).
"""
        (d / "README.md").write_text(readme, encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build screen inventory from Figma metadata XML")
    ap.add_argument("xml_path", type=Path, help="Path to .xml or .xml.gz from get_metadata")
    ap.add_argument("--write", type=Path, help="Output directory (writes inventory + screen stubs)")
    ap.add_argument("--file-key", default=FILE_KEY_DEFAULT)
    ap.add_argument("--file-slug", default=FILE_SLUG_DEFAULT)
    args = ap.parse_args()

    xml_bytes = read_xml(args.xml_path)
    page, rows = parse_canvas_children(xml_bytes)
    kept, skipped = dedupe(rows)

    print(f"Page: {page}")
    print(f"Candidates: {len(rows)} → Kept: {len(kept)}, Skipped duplicates: {len(skipped)}")
    for k in kept:
        print(f"  {k[0]}\t{k[1]}\t{k[2]:.0f}x{k[3]:.0f}")

    if args.write:
        write_outputs(args.write, page, kept, skipped, args.file_key, args.file_slug)
        print(f"\nWrote {args.write}/screen-inventory.md and screens/*/README.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
