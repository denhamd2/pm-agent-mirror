#!/usr/bin/env python3
"""Weekly competitive intelligence deep rollup for GHA cron.

Aggregates the last 7 days of DAILY-CI briefs. When ANTHROPIC_API_KEY is set,
synthesises an executive summary via the Messages API; otherwise produces a
deterministic rollup. Updates matrix changelog and optionally notifies Telegram.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "research/competitive/.ci-last-run.json"
MATRIX_PATH = ROOT / "research/competitive/matrices/global-competitive-matrix.md"
REPORT_DIR = ROOT / "research/competitive/global"
USER_AGENT = "product-manager-agent-ci-weekly/1.0"

ANTHROPIC_MODEL = os.environ.get("CI_WEEKLY_ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
SYSTEM_PROMPT = """You are a competitive intelligence analyst for Workday Recruiting.
Synthesise the provided daily BRIEF excerpts into a weekly global competitive scan.
Use British English. Cite only facts present in the inputs. Flag M&A, major product launches,
and analyst recognition. Note items are unvalidated against Deployment Agent.
Output markdown with: Executive Summary (3-5 bullets), Themes, Workday Implications, Recommended Actions."""


@dataclass
class WeeklyResult:
    mission_id: str
    date_str: str
    report_path: Path | None = None
    used_anthropic: bool = False
    daily_sources: list[str] = field(default_factory=list)
    telegram_sent: bool = False


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def load_state() -> dict[str, Any]:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {}


def save_state(state: dict[str, Any]) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def collect_daily_briefs(days: int = 7) -> list[tuple[str, Path, str]]:
    cutoff = utc_now() - timedelta(days=days)
    out: list[tuple[str, Path, str]] = []
    for path in sorted(REPORT_DIR.glob("global-competitive-scan-*-DAILY-CI-*.md"), reverse=True):
        m = re.search(r"global-competitive-scan-(\d{4}-\d{2}-\d{2})-", path.name)
        if not m:
            continue
        try:
            file_date = datetime.strptime(m.group(1), "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            continue
        if file_date < cutoff:
            continue
        text = path.read_text(encoding="utf-8")
        out.append((m.group(1), path, text))
    return sorted(out, key=lambda x: x[0])


def extract_exec_section(text: str) -> str:
    if "## Executive Summary" in text:
        start = text.index("## Executive Summary")
        end = text.find("\n---", start)
        if end == -1:
            end = min(start + 2500, len(text))
        return text[start:end].strip()
    return text[:1500].strip()


def deterministic_rollup(sources: list[tuple[str, Path, str]]) -> str:
    lines = ["## Executive Summary (Weekly Rollup)", ""]
    if not sources:
        lines.append("No daily BRIEF reports found in the last 7 days. Run the daily workflow first.")
        return "\n".join(lines)

    lines.append(f"Aggregated from **{len(sources)}** daily BRIEF report(s):")
    lines.append("")
    for date_str, path, text in sources:
        excerpt = extract_exec_section(text)
        excerpt = re.sub(r"\n+", " ", excerpt)[:500]
        lines.append(f"- **{date_str}** (`{path.name}`): {excerpt}")
    lines.extend(
        [
            "",
            "## Themes",
            "",
            "- Review daily reports for recurring competitor names and AI/agent narratives.",
            "- Validate material signals via interactive @competitive-intel before enablement.",
            "",
            "## Workday Implications",
            "",
            "- Automated weekly tier; Deployment Agent validation not run in CI.",
            "",
            "## Recommended Actions",
            "",
            "1. Read linked daily reports for full citations.",
            "2. Run a manual deep scan if a theme appears in 2+ daily briefs.",
            "",
        ]
    )
    return "\n".join(lines)


def anthropic_synthesise(sources: list[tuple[str, Path, str]]) -> str | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key or not sources:
        return None

    chunks = []
    for date_str, path, text in sources:
        chunks.append(f"### Daily brief {date_str} ({path.name})\n\n{extract_exec_section(text)}")

    user_content = (
        "Synthesise these daily competitive intelligence briefs into a weekly global scan "
        "for Workday Recruiting leadership.\n\n" + "\n\n".join(chunks)
    )

    body = json.dumps(
        {
            "model": ANTHROPIC_MODEL,
            "max_tokens": 2048,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": user_content}],
        }
    ).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120, context=_ssl_context()) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"WARN: Anthropic API failed: {exc}", file=sys.stderr)
        return None

    content = data.get("content") or []
    parts = [b.get("text", "") for b in content if b.get("type") == "text"]
    return "\n".join(parts).strip() if parts else None


def _ssl_context() -> ssl.SSLContext:
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def fetch_url(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
        return resp.read()


def append_matrix_changelog(mission_id: str, date_str: str, report_rel: str, source_count: int) -> bool:
    if not MATRIX_PATH.exists():
        return False
    text = MATRIX_PATH.read_text(encoding="utf-8")
    entry = (
        f"**Changelog: {date_str} - {mission_id} - Weekly deep rollup (GHA)** — "
        f"Synthesised from {source_count} daily BRIEF report(s). See `{report_rel}`.\n\n"
    )
    marker = "## Change Log\n\n"
    if marker not in text:
        return False
    MATRIX_PATH.write_text(text.replace(marker, marker + entry, 1), encoding="utf-8")
    return True


def send_telegram(text: str) -> bool:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return False
    payload = urllib.parse.urlencode({"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}).encode()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    req = urllib.request.Request(url, data=payload, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30, context=_ssl_context()) as resp:
            return bool(json.loads(resp.read().decode()).get("ok"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return False


def run(*, dry_run: bool = False, skip_telegram: bool = False) -> WeeklyResult:
    now = utc_now()
    date_str = now.strftime("%Y-%m-%d")
    mission_id = f"WEEKLY-CI-{date_str}"
    sources = collect_daily_briefs(days=7)

    result = WeeklyResult(
        mission_id=mission_id,
        date_str=date_str,
        daily_sources=[p.name for _, p, _ in sources],
    )

    synthesis = anthropic_synthesise(sources)
    result.used_anthropic = synthesis is not None
    body = synthesis if synthesis else deterministic_rollup(sources)

    header = f"""# Global Competitive Scan: Weekly Deep Rollup

**Date**: {date_str}
**Analyst**: Competitive Intelligence Agent (scheduled GHA WEEKLY)
**Mission ID**: {mission_id}
**Region**: Global
**Depth**: WEEKLY — synthesis from last 7 days of DAILY-CI briefs. {"Anthropic API synthesis." if result.used_anthropic else "Deterministic rollup (set ANTHROPIC_API_KEY for AI synthesis)."}
**Sources**: {", ".join(f"`{n}`" for n in result.daily_sources) or "none"}

---

"""
    report = header + body + "\n\n---\n\n*Generated by `scripts/ci_weekly_deep.py`. See docs/competitive/ci-scheduling-setup.md.*\n"

    if dry_run:
        print(report[:3000])
        print(f"\n... dry-run ({len(sources)} daily sources, anthropic={result.used_anthropic})")
        return result

    report_name = f"global-competitive-scan-{date_str}-WEEKLY-CI-{date_str}.md"
    report_path = REPORT_DIR / report_name
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report, encoding="utf-8")
    result.report_path = report_path

    rel = report_path.relative_to(ROOT).as_posix()
    append_matrix_changelog(mission_id, date_str, rel, len(sources))

    state = load_state()
    state["last_weekly_report"] = report_name
    state["last_weekly_run"] = now.isoformat()
    save_state(state)

    if not skip_telegram:
        rel_posix = rel
        digest = (
            f"🔍 CI WEEKLY — Global — {date_str}\n\n"
            f"Synthesised {len(sources)} daily brief(s)."
            f"{' (Anthropic API)' if result.used_anthropic else ' (deterministic rollup)'}\n\n"
            f"📄 Files:\n• {rel_posix}"
        )
        result.telegram_sent = send_telegram(digest)

    print(f"Wrote {report_path}")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Weekly CI deep rollup")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-telegram", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run, skip_telegram=args.skip_telegram)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
