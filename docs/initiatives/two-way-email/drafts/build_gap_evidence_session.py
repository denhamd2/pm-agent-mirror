#!/usr/bin/env python3
"""Merge gap_review_82977_jira_bulk_session.json + epic MCP notes into evidence rows for generate_gap_review_page_82977.py."""
from __future__ import annotations

import json
import re
from pathlib import Path


def adf_to_plain(node) -> str:
    if node is None:
        return ""
    if isinstance(node, str):
        return node
    if isinstance(node, list):
        return " ".join(adf_to_plain(x) for x in node)
    if not isinstance(node, dict):
        return ""
    if node.get("type") == "text":
        return str(node.get("text", ""))
    return " ".join(adf_to_plain(c) for c in (node.get("content") or []))


def plain_description(raw: str) -> str:
    raw = raw or ""
    if not raw.strip():
        return ""
    if raw.strip().startswith("{"):
        try:
            return adf_to_plain(json.loads(raw)).strip()
        except json.JSONDecodeError:
            return raw[:8000]
    return raw.strip()[:8000]


SALOMON_RUN = (
    "This run (Salomon): Recruiting Communications PDT removes SMS from conversational messaging, "
    "attachments, conversation messages, notification events (see purge KB). "
    "Blank-body candidate-grid email when tenant Recruiting Communications template overrides recruiter selection (HRREC-90673). "
    "Agency duplicate review: UDMF vs legacy CRF matters for agency submissions (HRREC-80441 family). "
    "SMS opt-in/TCPA threads are strong in KB; treat as analogy risk for email notification/read semantics, not 1:1 parity."
)

XO_RUN = (
    "XO search (this run): Recruiting Email PRU/PU (Candidate Email create, External/Internal candidate parms), "
    "WATS Recruiting Email variable containers; Conversation Message (+ Derived), Status, Sender; Notification / Notification Configuration. "
    "Profile SSP two-way compose may not surface as a single named class in quick search—expect task/REST binding beyond these hits."
)

XO_RISK = (
    "Risk from absence: generic Notification classes do not prove inbound reply event routing or conversational-email-specific notif types; SUV + REST contract still required per story."
)

DA_RUN = (
    "DA (this run): Default vs Customer SMTP; set Reply-To via Edit Tenant Setup – Notifications (single address; no semicolon multi-address). "
    "Bell = system notifications; My Conversations = conversational SMS/email thread UX—different surfaces. "
    "QA: redirect outbound mail in lower envs; valid candidate domains; branding images can corrupt after scramble; internal candidates use work email."
)


def _clip_title(s: str, n: int) -> str:
    s = (s or "").strip()
    if len(s) <= n:
        return s
    return s[: max(0, n - 3)] + "..."


def extract_jira_bdd_hooks(plain: str) -> dict:
    """Light parse of wiki/plain description for gap-review HTML generator + audits."""
    plain = plain or ""
    titles: list[str] = []
    # Jira wiki coloured lines: *Scenario 1 - Title*{color}
    titles.extend(
        re.findall(
            r"(?i)\*Scenario\s*\d+\s*[-–—]+\s*([^*{]+?)(?:\*|\{color)",
            plain,
        )
    )
    # Classic headings
    titles.extend(re.findall(r"(?mi)h3\.\s*Scenario\s*\d+\s*:\s*([^\n]+)", plain))
    # Line-start "Scenario 1: Title" (requires digit + colon to avoid matching "Scenarios:")
    for m in re.finditer(r"(?mi)^\s*Scenario\s+\d+\s*:\s*(.+)$", plain):
        line = m.group(1).strip()
        if line and line not in titles:
            titles.append(line)

    cleaned: list[str] = []
    seen: set[str] = set()
    for t in titles:
        t = re.sub(r"\s+", " ", (t or "").strip())
        if len(t) < 8:
            continue
        low = t.lower()
        if low in seen:
            continue
        seen.add(low)
        cleaned.append(t)

    # {*}Given{*}: ... {color} or Given:* ... (ADF/plain quirks)
    givens = re.findall(
        r"(?i)(?:\{\*\})?Given(?:\{\*\})?\s*\*?\s*:\s*\*?\s*(.+?)(?=\r|\n|\{color|\{\*|\s*\*And\*|\Z)",
        plain,
        flags=re.DOTALL,
    )
    if not givens:
        givens = re.findall(r"(?mi)^\*Given\*\s*(.+)$", plain)
    first_given = (givens[0] or "").strip() if givens else ""
    first_given = re.sub(r"^\{[^}]+\}", "", first_given).strip()
    first_given = re.sub(r"\{color[^}]*\}", "", first_given, flags=re.I).strip()
    first_given = re.sub(r"\s+", " ", first_given).strip()

    scenario_count = len(cleaned)
    if scenario_count == 0 and givens:
        scenario_count = max(1, len(givens))
    elif scenario_count == 0:
        scenario_count = len(re.findall(r"(?i)\*Scenario\s*\d+", plain))

    first_scenario_title = _clip_title(cleaned[0], 200) if cleaned else ""

    return {
        "scenario_count": min(99, scenario_count),
        "first_given_line": first_given[:300],
        "first_scenario_title": first_scenario_title,
    }


def is_doc_writer_ticket(summary: str) -> bool:
    s = (summary or "").lstrip()
    u = s.upper()
    return u.startswith("AG:") or u.startswith("RN:")


def gap_from_body(key: str, summary: str, body: str) -> str:
    b = body or ""
    low = (summary + " " + b).lower()
    if len(b) < 50:
        return "No description or formal AC in Jira — placeholder or AG/RN shell; expand before build."
    if len(b) < 400:
        return "Short Jira body (<400 chars plain) — thin AC; add explicit Scenarios and REST/UI split where send or purge is implied."
    hints = []
    if "per-user" in low or "shared read" in low:
        hints.append("per-user vs shared read semantics called out — confirm product decision.")
    if "agency" in low:
        hints.append("agency matrix — align with security domains and tab visibility siblings.")
    if "rest" in low:
        hints.append("REST mentioned — confirm server parity with UI errors and attachment limits.")
    if "purge" in low or "privacy" in low:
        hints.append("purge/privacy — pair UX with Recruiting Communications PDT scope.")
    if "notification" in low or "bell" in low:
        hints.append("notifications — align bell vs My Conversations entry and domain access.")
    if "bounce" in low or "complaint" in low:
        hints.append("bounce/complaint telemetry — confirm surfaced strings vs silent drop.")
    if "attach" in low or "mb" in low or "7 mb" in low:
        hints.append("attachments — align client vs server size/type rejection.")
    if not hints:
        hints.append("Review BDD Scenarios vs compose/send/notification siblings for overlapping REST contract.")
    return "; ".join(hints[:4])


def main() -> None:
    root = Path(__file__).resolve().parent
    bulk = json.loads((root / "gap_review_82977_jira_bulk_session.json").read_text())
    rows = []
    for iss in bulk["issues"]:
        summary = iss["summary"] or ""
        if is_doc_writer_ticket(summary):
            continue
        key = iss["key"]
        plain = plain_description(iss.get("description", ""))
        hooks = extract_jira_bdd_hooks(plain)
        rows.append(
            {
                "key": key,
                "summary": summary,
                "gaps": gap_from_body(key, summary, plain),
                "scenario_count": hooks["scenario_count"],
                "first_given_line": hooks["first_given_line"],
                "first_scenario_title": hooks["first_scenario_title"],
                "salomon": SALOMON_RUN,
                "xo": XO_RUN,
                "xo_risk": XO_RISK,
            }
        )
    out = root / "gap_review_82977_evidence_2026-05-15.json"
    out.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    # Optional sidecar for DA text (generator weaves DA into PM/QA via exec bullets; keep file for audit)
    (root / "gap_review_82977_da_session_note.txt").write_text(DA_RUN, encoding="utf-8")
    print("wrote", out, "rows", len(rows))


if __name__ == "__main__":
    main()
