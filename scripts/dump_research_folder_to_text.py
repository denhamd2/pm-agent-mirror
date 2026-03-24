#!/usr/bin/env python3
"""
Flatten research folder contents (txt, csv, xlsx, xls) into one UTF-8 markdown file
for agents **106** / **107** to ingest. Usage:

  pip install -r scripts/requirements-research-xlsx.txt   # once per machine/venv
  python3 scripts/dump_research_folder_to_text.py research/GCC/brainstorm-sessions \\
    -o research/GCC/brainstorm-analysis/_scratch-sources.md

Excludes: .gitkeep, dotfiles.
"""
from __future__ import annotations

import argparse
import csv
from pathlib import Path

TEXT_EXTENSIONS = {".txt", ".md"}
TABULAR_EXTENSIONS = {".csv", ".xlsx", ".xls"}


def dump_txt(path: Path) -> str:
    body = path.read_text(encoding="utf-8", errors="replace")
    return f"## FILE: `{path.name}`\n\n```\n{body}\n```\n"


def dump_csv(path: Path, max_rows: int) -> str:
    lines = [f"## FILE: `{path.name}` (CSV)\n"]
    with path.open(newline="", encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        rows = []
        for i, row in enumerate(reader):
            if i >= max_rows:
                rows.append([f"... truncated after {max_rows} rows ..."])
                break
            rows.append(row)
    if not rows:
        lines.append("_Empty CSV_\n")
        return "\n".join(lines) + "\n"
    # Simple markdown table (escape pipes loosely)
    header = rows[0]
    lines.append("| " + " | ".join(c.replace("|", "\\|") for c in header) + " |")
    lines.append("| " + " | ".join("---" for _ in header) + " |")
    for row in rows[1:]:
        pad = row + [""] * (len(header) - len(row))
        lines.append("| " + " | ".join(str(c).replace("|", "\\|") for c in pad[: len(header)]) + " |")
    lines.append("")
    return "\n".join(lines)


def dump_excel(path: Path, max_rows: int) -> str:
    try:
        import pandas as pd
    except ImportError as e:
        raise SystemExit(
            "pandas is required for .xlsx/.xls. Run: pip install -r scripts/requirements-research-xlsx.txt"
        ) from e

    parts: list[str] = []
    xl = pd.ExcelFile(path)
    for sheet in xl.sheet_names:
        df = pd.read_excel(path, sheet_name=sheet, dtype=str, nrows=max_rows)
        parts.append(f"## FILE: `{path.name}` | SHEET: `{sheet}`\n")
        if df.empty:
            parts.append("_Empty sheet_\n")
            continue
        parts.append(df.fillna("").to_string(index=False))
        parts.append("")
    return "\n".join(parts)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("folder", type=Path, help="e.g. research/GCC/brainstorm-sessions")
    ap.add_argument("-o", "--output", type=Path, required=True, help="Output .md path")
    ap.add_argument(
        "--max-rows",
        type=int,
        default=2000,
        help="Max rows per CSV sheet / Excel sheet (default 2000)",
    )
    args = ap.parse_args()
    folder: Path = args.folder
    if not folder.is_dir():
        raise SystemExit(f"Not a directory: {folder}")

    chunks: list[str] = [
        "# Scratch dump for agent ingestion\n",
        f"**Source folder:** `{folder}`\n",
        "",
    ]
    names = sorted(p for p in folder.iterdir() if p.is_file())
    for path in names:
        if path.name.startswith(".") or path.name == ".gitkeep":
            continue
        suf = path.suffix.lower()
        if suf in TEXT_EXTENSIONS:
            chunks.append(dump_txt(path))
        elif suf == ".csv":
            chunks.append(dump_csv(path, args.max_rows))
        elif suf in (".xlsx", ".xls"):
            chunks.append(dump_excel(path, args.max_rows))
        # else: skip unknown extensions

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(chunks), encoding="utf-8")
    print(f"Wrote {args.output} ({len(chunks)} sections)")


if __name__ == "__main__":
    main()
