#!/usr/bin/env python3
"""One-off MISSION_LOG.md cleanup: archive completed missions, rebuild slim log."""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = ROOT / "MISSION_LOG.md"
ARCH_DIR = ROOT / "docs" / "mission-archive"

MISSION_HEADER = re.compile(r"^## Mission:\s*(?P<id>[A-Za-z0-9-]+)\s*[-\u2014].*$")


def normalize_agents(text: str) -> str:
    """Fix orchestrator naming drift per user request."""
    text = text.replace("120-pmf-thematic-analysis.mdc", "@pmf-analyst")
    text = text.replace("120-pmf-thematic-analysis", "@pmf-analyst")
    text = text.replace("101-competitive-intelligence", "@competitive-intel")
    text = text.replace("107-win-loss-analyser", "108-tableau-gap-analyser (legacy 107 deprecated)")
    # Pipeline shorthand (bold)
    text = re.sub(r"\*\*101\*\*", "**@competitive-intel**", text)
    text = re.sub(r"\*\*120\*\*", "**@pmf-analyst**", text)
    text = re.sub(r"\bCI \(101\)", "CI (@competitive-intel)", text)
    text = re.sub(r"Step 1 \(\*\*101\*\*\)", "Step 1 (**@competitive-intel**)", text)
    text = re.sub(r"\(\*\*101\*\*\)", "(**@competitive-intel**)", text)
    text = re.sub(r"Step 2b: 120 ", "Step 2b: @pmf-analyst ", text)
    text = re.sub(r"120 PMF Thematic Analysis", "@pmf-analyst PMF thematic analysis", text)
    text = re.sub(r"120 → HITL", "@pmf-analyst → HITL", text)
    text = re.sub(r"120 →", "@pmf-analyst →", text)
    text = re.sub(r"→ 120 →", "→ @pmf-analyst →", text)
    text = re.sub(r"101 →", "@competitive-intel →", text)
    text = re.sub(r"→ 101 →", "→ @competitive-intel →", text)
    text = re.sub(r"\*\*120\*\* report", "**@pmf-analyst** report", text)
    text = re.sub(r"\*\*120\*\* PMF", "**@pmf-analyst** PMF", text)
    text = re.sub(
        r"before \*\*120\*\*",
        "before **@pmf-analyst**",
        text,
    )
    text = re.sub(
        r"105 fresh.*before \*\*120\*\*",
        lambda m: m.group(0).replace("**120**", "**@pmf-analyst**"),
        text,
    )
    # Overview line: Step 2a before 120
    text = text.replace("before **120**.", "before **@pmf-analyst**.")
    text = text.replace("before **120**", "before **@pmf-analyst**")
    return text


def extract_mission_id(first_line: str) -> str | None:
    m = MISSION_HEADER.match(first_line.strip())
    return m.group("id") if m else None


def is_complete_block(block: str) -> bool:
    if "Mission Format Template" in block[:800]:
        return False
    for line in block.splitlines()[:50]:
        stripped = line.strip()
        if not stripped.lower().startswith("**status:**"):
            continue
        sl = stripped.lower()
        if "in progress" in sl or "blocked" in sl or "on hold" in sl:
            return False
        if "superseded" in sl:
            return True
        if "implemented and documented" in sl or "implemented and operational" in sl:
            return True
        if "implemented and awaiting data" in sl:
            return True
        if "complete" in sl or "✅" in stripped:
            return True
        return False
    return False


def split_missions(raw: str) -> tuple[str, list[tuple[str, str]]]:
    """Return preamble and list of (id, block) for each ## Mission (skip template)."""
    lines = raw.splitlines(keepends=True)
    preamble_end = 0
    missions: list[tuple[int, int]] = []
    for i, line in enumerate(lines):
        if line.startswith("## Mission: "):
            mid = extract_mission_id(line)
            if not mid or "[ID]" in line or "brief title" in line.lower():
                continue
            missions.append((i, -1))
    for j in range(len(missions)):
        start = missions[j][0]
        end = missions[j + 1][0] if j + 1 < len(missions) else len(lines)
        missions[j] = (start, end)

    if not missions:
        return raw, []

    first_start = missions[0][0]
    preamble = "".join(lines[:first_start])

    out: list[tuple[str, str]] = []
    for start, end in missions:
        block = "".join(lines[start:end])
        first = lines[start].strip()
        mid = extract_mission_id(first)
        if not mid or "[id]" in first.lower():
            continue
        out.append((mid, block))
    return preamble, out


def main() -> None:
    raw = LOG_PATH.read_text(encoding="utf-8")
    preamble, mission_blocks = split_missions(raw)

    by_id: dict[str, list[str]] = defaultdict(list)
    for mid, block in mission_blocks:
        by_id[mid].append(block)

    complete_ids: set[str] = set()
    for mid, blocks in by_id.items():
        if any(is_complete_block(b) for b in blocks):
            complete_ids.add(mid)

    ARCH_DIR.mkdir(parents=True, exist_ok=True)

    # Write archive files (merged blocks per ID for completed)
    summaries: list[tuple[str, str]] = []
    for mid in sorted(complete_ids):
        blocks = by_id[mid]
        merged_parts = []
        for k, b in enumerate(blocks):
            if len(blocks) > 1:
                merged_parts.append(f"<!-- Occurrence {k + 1} of {len(blocks)} in former MISSION_LOG -->\n\n")
            merged_parts.append(normalize_agents(b.rstrip()) + "\n")
        merged = "\n---\n\n".join(merged_parts)
        (ARCH_DIR / f"{mid}.md").write_text(merged.strip() + "\n", encoding="utf-8")
        title_line = blocks[-1].splitlines()[0].replace("## Mission: ", "").strip()
        summaries.append((mid, title_line))

    # Active: IDs not in complete_ids; use last block only
    active_blocks: list[str] = []
    for mid, blocks in sorted(by_id.items()):
        if mid in complete_ids:
            continue
        chosen = blocks[-1]
        active_blocks.append(normalize_agents(chosen.rstrip()))

    # Extract Strategic Learning section from preamble for archive
    sl_start = preamble.find("\n## Strategic Learning")
    copy_start = preamble.find("\n## Copy Review Timing")
    strategic_learning = ""
    preamble_trimmed = preamble
    if sl_start != -1 and copy_start != -1:
        strategic_learning = preamble[sl_start + 1 : copy_start].strip() + "\n"
        preamble_trimmed = preamble[:sl_start] + preamble[copy_start:]
        (ARCH_DIR / "STRATEGIC-LEARNING-2026-03-31.md").write_text(
            "# Strategic Learning & Best Practices (archived from MISSION_LOG)\n\n"
            + normalize_agents(strategic_learning),
            encoding="utf-8",
        )

    # Trim Current Status wall of text to a pointer
    preamble_trimmed = normalize_agents(preamble_trimmed)
    preamble_trimmed = re.sub(
        r"\*\*Last Updated:\*\*[^\n]+",
        "**Last Updated:** 31 March 2026 (mission log cleanup; see `docs/mission-archive/` for completed missions and strategic learning)",
        preamble_trimmed,
        count=1,
    )
    # Drop old "## Active Missions" + fenced template (replaced below)
    preamble_trimmed = re.sub(
        r"\n## Active Missions\n\n\*\*Mission Format Template.*?\n```\n\n?",
        "\n",
        preamble_trimmed,
        flags=re.DOTALL,
        count=1,
    )

    # Extract Recent Improvements + legacy Completed Missions summaries from original
    ri_start = raw.find("\n## Recent Improvements\n")
    dl_start = raw.find("\n## Decision Log\n")
    if ri_start != -1 and dl_start != -1:
        recent_chunk = raw[ri_start + 1 : dl_start].strip()
        (ARCH_DIR / "RECENT-IMPROVEMENTS-AND-LEGACY-COMPLETED.md").write_text(
            "# Recent Improvements + legacy Completed Missions summaries\n\n"
            "(Archived from MISSION_LOG during 31 March 2026 cleanup.)\n\n"
            + normalize_agents(recent_chunk),
            encoding="utf-8",
        )

    # Decision logs: take from first ## Decision Log to ## Handoff Queue
    hq = raw.find("\n## Handoff Queue\n")
    if dl_start != -1 and hq != -1:
        decision_chunk = raw[dl_start:hq]
        blocks = re.split(r"(?=^### DECISION-\d+)", decision_chunk, flags=re.MULTILINE)
        seen_d: set[str] = set()
        kept: list[str] = []
        for b in blocks:
            b = b.strip()
            if not b or b.startswith("## Decision Log"):
                continue
            m = re.match(r"^### (DECISION-\d+)", b)
            if m:
                if m.group(1) in seen_d:
                    continue
                seen_d.add(m.group(1))
            kept.append(b)
        decision_section = normalize_agents("\n\n".join(kept).strip())
    else:
        decision_section = ""

    # Overview GCC note line 6-7
    preamble_trimmed = preamble_trimmed.replace(
        "**105 fresh:** **Step 2a** — `research/GCC/105-user-research-findings.md` with **## Fresh pass attestation** before **120**.",
        "**105 fresh:** **Step 2a** — `research/GCC/105-user-research-findings.md` with **## Fresh pass attestation** before **@pmf-analyst**.",
    )
    preamble_trimmed = preamble_trimmed.replace(
        "before **120**. **106 / 108",
        "before **@pmf-analyst**. **106 / 108",
    )

    # System Health line 24
    preamble_trimmed = preamble_trimmed.replace(
        "incl. 050-functional-knowledge, **120** PMF thematic analysis, **130** PMF slide generator)",
        "incl. 050-functional-knowledge, **@pmf-analyst** PMF thematic analysis, **130** PMF slide generator)",
    )
    preamble_trimmed = preamble_trimmed.replace("**Active Agents:** 10+ (Orchestrator + specialists incl. **120** report + **130**", "**Active Agents:** 10+ (Orchestrator + specialists incl. **@pmf-analyst** report + **130**")

    table_rows = [
        "| Mission ID | Summary | Archive |",
        "|------------|---------|---------|",
    ]
    for mid, title in sorted(summaries, key=lambda x: x[0]):
        short = title.split(" - ", 1)[-1][:80]
        if len(title) < len(short) + 5:
            short = title
        table_rows.append(
            f"| {mid} | {short} | [Archive](docs/mission-archive/{mid}.md) |"
        )

    extra_archives = [
        ("STRATEGIC-LEARNING-2026-03-31", "Cursor PM session + architecture notes (Noah)"),
        ("RECENT-IMPROVEMENTS-AND-LEGACY-COMPLETED", "Regional scaffolding, story validator, RICE, legacy MISSION-013/005/001 blurbs"),
    ]
    for aid, desc in extra_archives:
        table_rows.append(f"| {aid} | {desc} | [Archive](docs/mission-archive/{aid}.md) |")

    active_section = "\n\n".join(active_blocks) if active_blocks else "_No active missions._"

    new_log = f"""{preamble_trimmed.rstrip()}

## Strategic Learning & Best Practices

Full content (Noah session, PRD/slide skills, async delegation, gaps): [Archive](docs/mission-archive/STRATEGIC-LEARNING-2026-03-31.md)

## Active Missions

**Mission format template:** `docs/mission-archive/MISSION-FORMAT-TEMPLATE.md`

{active_section}

## Completed Missions

Recent improvements and legacy MISSION-013 / MISSION-005 / MISSION-001 blurbs: [Archive](docs/mission-archive/RECENT-IMPROVEMENTS-AND-LEGACY-COMPLETED.md)

{chr(10).join(table_rows)}

## Decision Log

{decision_section}

## Handoff Queue
_Items requiring attention or delegation will appear here._

## Notes

- This file is maintained by the Master Orchestrator (`000-master-orchestrator.mdc`).
- Completed mission **full blocks** live under `docs/mission-archive/{{MISSION-ID}}.md` (nothing deleted).
- **Last structural cleanup:** 31 March 2026.
"""

    template = """## Mission: [ID] - [Brief Title]
**Status:** [Initializing|In Progress|Blocked|Handed Off|Complete]
**Owner:** [Agent or Human]
**Created:** [Timestamp]
**Last Updated:** [Timestamp]

**PM Context:**
- **Driver:** [Answer to Q1]
- **Additional context:** [Answer to Q2 or None]

**Objective:** [Clear goal]

**Next Actions:**
- [ ] Action item 1

**Blockers:** [None or list]

**Related Artifacts:**
- [Paths]
"""
    (ARCH_DIR / "MISSION-FORMAT-TEMPLATE.md").write_text(template, encoding="utf-8")

    new_log = normalize_agents(new_log)
    LOG_PATH.write_text(new_log, encoding="utf-8")

    print(f"Archived {len(complete_ids)} mission IDs; active {len(active_blocks)}; log lines {len(new_log.splitlines())}")


if __name__ == "__main__":
    main()
