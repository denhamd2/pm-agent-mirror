#!/usr/bin/env python3
"""Daily competitive intelligence BRIEF monitor for GHA cron.

Fetches public Google News RSS per global competitor, deduplicates against
research/competitive/.ci-last-run.json, writes a DAILY-CI markdown report when
new signals exist, appends a matrix changelog line, and optionally notifies Telegram.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "research/competitive/.ci-last-run.json"
MATRIX_PATH = ROOT / "research/competitive/matrices/global-competitive-matrix.md"
REPORT_DIR = ROOT / "research/competitive/global"

MAX_SEEN_URLS = 800
USER_AGENT = "product-manager-agent-ci-daily/1.0"

COMPETITOR_QUERIES: list[tuple[str, str]] = [
    ("SAP SuccessFactors / SmartRecruiters", "SAP SuccessFactors SmartRecruiters recruiting"),
    ("Oracle Taleo / Fusion Recruiting", "Oracle Fusion Cloud Recruiting talent acquisition"),
    ("Greenhouse", "Greenhouse ATS recruiting hiring"),
    ("iCIMS", "iCIMS recruiting talent acquisition"),
    ("Lever", "Lever ATS recruiting"),
    ("SmartRecruiters", "SmartRecruiters Winston hiring AI"),
]

CATEGORY_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("M&A", re.compile(r"\b(acquisition|acquires|acquired|merger|merges|buys|bought)\b", re.I)),
    ("Leadership", re.compile(r"\b(CEO|CPO|chief executive|chief product|names .+ (CEO|president))\b", re.I)),
    ("Analyst", re.compile(r"\b(Gartner|Magic Quadrant|Forrester|Fosway|Nucleus Research|analyst)\b", re.I)),
    ("Customer win", re.compile(r"\b(customer win|selects|chooses|adopts|partners with|case study)\b", re.I)),
    ("Product", re.compile(r"\b(release|launch|launches|feature|product update|announces|roadmap|integration)\b", re.I)),
]

FLAG_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("M&A", re.compile(r"\b(acquisition|acquires|merger)\b", re.I)),
    ("Major feature launch", re.compile(r"\b(launch|launches new|product release|major release)\b", re.I)),
    ("Pricing shift", re.compile(r"\b(pricing|price increase|new tier|packaging)\b", re.I)),
]


@dataclass
class Signal:
    competitor: str
    title: str
    url: str
    published: str | None
    source: str | None
    category: str
    summary: str = ""


@dataclass
class RunResult:
    mission_id: str
    date_str: str
    new_signals: list[Signal] = field(default_factory=list)
    report_path: Path | None = None
    matrix_updated: bool = False
    state_updated: bool = False
    telegram_sent: bool = False
    no_material_signals: bool = False


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def load_state() -> dict[str, Any]:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {"last_run": None, "seen_urls": [], "last_daily_report": None, "last_weekly_report": None}


def save_state(state: dict[str, Any]) -> None:
    seen = state.get("seen_urls") or []
    if len(seen) > MAX_SEEN_URLS:
        state["seen_urls"] = seen[-MAX_SEEN_URLS:]
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


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


def google_news_rss(query: str) -> list[dict[str, str]]:
    q = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
    try:
        raw = fetch_url(url)
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"WARN: RSS fetch failed for {query!r}: {exc}", file=sys.stderr)
        return []

    items: list[dict[str, str]] = []
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as exc:
        print(f"WARN: RSS parse failed for {query!r}: {exc}", file=sys.stderr)
        return []

    for item in root.findall(".//item"):
        title_el = item.find("title")
        link_el = item.find("link")
        pub_el = item.find("pubDate")
        desc_el = item.find("description")
        if title_el is None or link_el is None or not (title_el.text and link_el.text):
            continue
        pub = pub_el.text.strip() if pub_el is not None and pub_el.text else ""
        desc = desc_el.text if desc_el is not None and desc_el.text else ""
        desc_clean = re.sub(r"<[^>]+>", "", desc)
        source = None
        if " - " in title_el.text:
            parts = title_el.text.rsplit(" - ", 1)
            if len(parts) == 2:
                source = parts[1].strip()
        items.append(
            {
                "title": title_el.text.strip(),
                "url": link_el.text.strip(),
                "published": pub,
                "summary": desc_clean.strip(),
                "source": source or "",
            }
        )
    return items


def classify(text: str) -> str:
    for name, pattern in CATEGORY_RULES:
        if pattern.search(text):
            return name
    return "Other"


def detect_flags(signals: list[Signal]) -> list[str]:
    flags: list[str] = []
    blob = " ".join(f"{s.title} {s.summary}" for s in signals)
    for name, pattern in FLAG_RULES:
        if pattern.search(blob) and name not in flags:
            flags.append(name)
    return flags


def title_hash(title: str, url: str) -> str:
    norm = re.sub(r"\s+", " ", title.lower().strip())
    return hashlib.sha256(f"{norm}|{url}".encode()).hexdigest()[:16]


def find_prior_report() -> str | None:
    reports = sorted(REPORT_DIR.glob("global-competitive-scan-*-DAILY-CI-*.md"), reverse=True)
    if reports:
        return reports[0].name
    return None


def build_signals(state: dict[str, Any]) -> list[Signal]:
    seen_urls = set(state.get("seen_urls") or [])
    seen_titles = set(state.get("seen_title_hashes") or [])
    new: list[Signal] = []
    seen_this_run: set[str] = set()

    for competitor, query in COMPETITOR_QUERIES:
        for item in google_news_rss(query):
            url = item["url"]
            title = item["title"]
            th = title_hash(title, url)
            if url in seen_urls or th in seen_titles or url in seen_this_run:
                continue
            seen_this_run.add(url)
            text = f"{title} {item.get('summary', '')}"
            new.append(
                Signal(
                    competitor=competitor,
                    title=title,
                    url=url,
                    published=item.get("published") or None,
                    source=item.get("source") or None,
                    category=classify(text),
                    summary=item.get("summary", "")[:400],
                )
            )
    return new


def render_report(
    mission_id: str,
    date_str: str,
    signals: list[Signal],
    prior_report: str | None,
) -> str:
    by_cat: dict[str, list[Signal]] = {}
    for s in signals:
        by_cat.setdefault(s.category, []).append(s)

    exec_lines: list[str] = []
    for i, s in enumerate(signals[:5], start=1):
        src = f" ({s.source})" if s.source else ""
        exec_lines.append(f"{i}. **{s.competitor}** — {s.title}{src}. ([link]({s.url}))")

    if not exec_lines:
        exec_lines = ["No material new signals in this run."]

    prior_line = prior_report or "none on file"
    lines = [
        "# Global Competitive Scan: Top Global ATS Competitors vs. Workday Recruiting",
        "",
        f"**Date**: {date_str}",
        "**Analyst**: Competitive Intelligence Agent (scheduled GHA BRIEF)",
        f"**Mission ID**: {mission_id}",
        "**Region**: Global",
        "**Depth**: BRIEF (recurring monitor) — public RSS feeds (Google News), material categories only. "
        "Not a full deep scan; gap classifications **unvalidated against Deployment Agent**.",
        "",
        f"**Prior report**: `{prior_line}`",
        "",
        "---",
        "",
        "## Executive Summary (NEW Signals Since Prior Report)",
        "",
    ]
    lines.extend(exec_lines)
    lines.extend(["", "---", "", "## Recent Activity (Material Categories)", ""])

    for cat in ["M&A", "Product", "Leadership", "Analyst", "Customer win", "Other"]:
        group = by_cat.get(cat)
        if not group:
            continue
        lines.append(f"### {cat}")
        lines.append("")
        for s in group:
            pub = f" — {s.published}" if s.published else ""
            lines.append(f"- **{s.competitor}**{pub}: {s.title} ([source]({s.url}))")
        lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## Workday Competitive Response (summary)",
            "",
            "- **Automated tier:** Treat as early signal detection; validate material items via interactive "
            "[@competitive-intel](.cursor/subagents/competitive-intel-agent.md) before sales enablement.",
            "- **Strength:** Unified Paradox + HiredScore + Workday Recruiting vs competitors assembling AI via M&A.",
            "- **Watch:** SAP/SmartRecruiters suite consolidation, Greenhouse agent/MCP plays, Oracle Gartner MQ + Agent Studio.",
            "",
            "---",
            "",
            "*Generated by `scripts/ci_daily_brief.py` on GHE Actions. See "
            "[docs/competitive/ci-scheduling-setup.md](../../../docs/competitive/ci-scheduling-setup.md).*",
            "",
        ]
    )
    return "\n".join(lines)


def append_matrix_changelog(mission_id: str, date_str: str, signals: list[Signal], report_rel: str) -> bool:
    if not MATRIX_PATH.exists():
        return False
    text = MATRIX_PATH.read_text(encoding="utf-8")
    competitors = ", ".join(sorted({s.competitor for s in signals}))
    titles = "; ".join(s.title[:80] for s in signals[:4])
    if len(signals) > 4:
        titles += f"; +{len(signals) - 4} more"
    entry = (
        f"**Changelog: {date_str} - {mission_id} - Global brief monitor (GHA)** — "
        f"New signals ({competitors}): {titles}. See `{report_rel}`.\n\n"
    )
    marker = "## Change Log\n\n"
    if marker not in text:
        return False
    updated = text.replace(marker, marker + entry, 1)
    MATRIX_PATH.write_text(updated, encoding="utf-8")
    return True


def send_telegram(text: str) -> bool:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("SKIP: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set", file=sys.stderr)
        return False
    payload = urllib.parse.urlencode({"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}).encode()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    req = urllib.request.Request(url, data=payload, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30, context=_ssl_context()) as resp:
            body = json.loads(resp.read().decode())
            return bool(body.get("ok"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"WARN: Telegram send failed: {exc}", file=sys.stderr)
        return False


def build_telegram_digest(result: RunResult) -> str:
    if result.no_material_signals:
        return (
            f"🔍 CI BRIEF — Global — {result.date_str}\n\n"
            f"No material new signals since last run.\n\n"
            f"Mission: {result.mission_id}"
        )
    bullets = "\n".join(f"• {s.competitor}: {s.title[:120]}" for s in result.new_signals[:5])
    flags = detect_flags(result.new_signals)
    flag_line = f"\n\n⚠️ Flags: {', '.join(flags)}" if flags else ""
    files = ""
    if result.report_path:
        rel = result.report_path.relative_to(ROOT).as_posix()
        files = f"\n\n📄 Files:\n• {rel}\n• research/competitive/matrices/global-competitive-matrix.md (changelog)"
    return (
        f"🔍 CI BRIEF — Global — {result.date_str}\n\n"
        f"Key findings:\n{bullets}{flag_line}{files}"
    )


def run(*, dry_run: bool = False, skip_telegram: bool = False) -> RunResult:
    now = utc_now()
    date_str = now.strftime("%Y-%m-%d")
    mission_id = f"DAILY-CI-{date_str}"
    state = load_state()
    prior = find_prior_report()
    new_signals = build_signals(state)

    result = RunResult(mission_id=mission_id, date_str=date_str, new_signals=new_signals)

    # Always mark fetched URLs as seen to avoid duplicate alerts
    seen_urls = list(state.get("seen_urls") or [])
    seen_hashes = list(state.get("seen_title_hashes") or [])
    for s in new_signals:
        if s.url not in seen_urls:
            seen_urls.append(s.url)
        th = title_hash(s.title, s.url)
        if th not in seen_hashes:
            seen_hashes.append(th)
    state["seen_urls"] = seen_urls
    state["seen_title_hashes"] = seen_hashes
    state["last_run"] = now.isoformat()

    if not new_signals:
        result.no_material_signals = True
        if not dry_run:
            save_state(state)
            result.state_updated = True
        if not skip_telegram and not dry_run:
            result.telegram_sent = send_telegram(build_telegram_digest(result))
        print("No material new signals.")
        return result

    report_name = f"global-competitive-scan-{date_str}-DAILY-CI-{date_str}.md"
    report_path = REPORT_DIR / report_name
    report_body = render_report(mission_id, date_str, new_signals, prior)

    if dry_run:
        print(report_body[:2000])
        print(f"\n... ({len(new_signals)} signals, dry-run — no writes)")
        return result

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report_body, encoding="utf-8")
    result.report_path = report_path

    rel = report_path.relative_to(ROOT).as_posix()
    result.matrix_updated = append_matrix_changelog(mission_id, date_str, new_signals, rel)

    state["last_daily_report"] = report_name
    save_state(state)
    result.state_updated = True

    if not skip_telegram:
        result.telegram_sent = send_telegram(build_telegram_digest(result))

    print(f"Wrote {report_path} ({len(new_signals)} new signals)")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Daily competitive intelligence BRIEF monitor")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print only; no writes or Telegram")
    parser.add_argument("--skip-telegram", action="store_true", help="Skip Telegram notification")
    args = parser.parse_args()
    run(dry_run=args.dry_run, skip_telegram=args.skip_telegram)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
