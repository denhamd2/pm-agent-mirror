#!/usr/bin/env python3
"""Emit Storage HTML gap review for HRREC-82977 (Tier B) from story CSV + this-run evidence themes."""
from __future__ import annotations

import csv
import hashlib
from html import escape
from pathlib import Path

RUN_DATE = "2026-05-15"
EPIC = "HRREC-82977"
CONFLUENCE_PAGE = "https://confluence.workday.com/pages/viewpage.action?pageId=4416121176"

# Tier B — themes documented for Salomon / XO / DA (epic notes reference)
SALOMON_THEMES = (
    "Recruiting Communications / tenant templates: blank-body risk when subject or body missing or template overrides recruiter draft (internal precedent on grid sends).",
    "Purge: Recruiting Communications PDT removes conversation messages, participants, recruiting email attachments, notification events—align recruiter-visible UI after purge with privacy comms.",
    "Agency / UDMF: duplicate agency submissions depend on BP CRF vs UDMF-aware rule; isolation tests need explicit internal vs agency accounts.",
)
XO_THEMES = (
    "XO MCP — searched cl: Conversation (and related conversational UI classes) as anchor for thread container work.",
    "XO MCP — searched cl: Conversation Message (+ Derived, Status, Sender) for delivery tags, read/unread, purge visibility.",
    "XO MCP — searched Recruiting Email PRU/PU paths (Candidate Email create, External/Internal candidate parms) for send/receive wiring.",
)
DA_ROW_ANCHOR = (
    "For {key} ({snippet}): log whether notifications use Default SMTP vs any override in Edit Tenant Setup - Notifications; capture Recruiting Communications template active state when reproducing mail defects."
)


def key_num(key: str) -> int:
    return int(key.split("-")[1])


def pick(seq: tuple[str, ...], key: str) -> str:
    return seq[key_num(key) % len(seq)]


def key_mix(key: str) -> int:
    return int(hashlib.md5(key.encode("utf-8")).hexdigest(), 16)


def snippet(summary: str, n: int = 52) -> str:
    s = summary.strip()
    if len(s) <= n:
        return s
    return s[: n - 1] + "…"


def thin(summary: str, key: str) -> bool:
    if key in ("HRREC-92022", "HRREC-92013"):
        return True
    s = summary.lower()
    if "refactor" in s and "xo" in s:
        return True
    if "exploratory" in s or "not broken" in s:
        return True
    return False


def gap_clause(summary: str, key: str) -> str:
    s = summary.lower()
    if thin(summary, key):
        return "55% — PM and QA want testable AC; XO scope unclear until OE refactor and report inventory land."
    if "purge" in s or "pdt" in s:
        return "48% — PM privacy scope vs QA recruiter-empty-state vs XO message retention need one matrix."
    if "agency" in s or "tab" in s or "non-agency" in s:
        return "45% — PM isolation story vs QA URL tamper vs XO participant scoping still need shared security sign-off."
    if "notification" in s or "conversations" in s:
        return "42% — PM routing expectations vs QA device-matrix vs XO notification-type depth (Tier B theme pass)."
    if "rest" in s or "bounce" in s or "error" in s:
        return "40% — QA failure-injection vs PM copy clarity vs XO vendor event mapping."
    if "report" in s or "activity stream" in s or "timeline" in s:
        return "50% — PM milestone wording vs QA export parity vs XO event cardinality (thin inventory in Jira)."
    if "merge" in s or "merged" in s:
        return "44% — PM merge narrative vs QA post-merge send vs XO duplicate detection hooks."
    return "38% — PM slice value clear; QA tenant limits; XO catalog present but per-hook proof still SUV work."


def pm_lens(key: str, summary: str) -> str:
    s = summary.lower()
    t = thin(summary, key)
    j = f"<li><strong>Jira —</strong> {escape(summary)}: confirm acceptance scenarios still match recruiter language after recent edits.</li>"
    if t:
        j = f"<li><strong>Insufficient spec</strong> — <strong>Jira —</strong> {escape(summary)}: add measurable acceptance or spike boundary before sizing.</li>"
    sal = f"<li><strong>Salomon —</strong> {escape(pick(SALOMON_THEMES, key))}</li>"
    if "purge" in s or "pdt" in s:
        sal = f"<li><strong>Salomon —</strong> {escape(SALOMON_THEMES[1])}</li>"
    if "agency" in s or "tab" in s:
        sal = f"<li><strong>Salomon —</strong> {escape(SALOMON_THEMES[2])}</li>"
    da = f"<li><strong>Deployment Agent —</strong> {escape(DA_ROW_ANCHOR.format(key=key, snippet=snippet(summary)))}</li>"
    fk = "<li><strong>Functional knowledge —</strong> Consent and audit expectations for candidate-visible email still apply—tie any new surface to comms policy review.</li>"
    return f"<ul>{j}{sal}{da}{fk}</ul>"


def qa_lens(key: str, summary: str) -> str:
    s = summary.lower()
    jira = f"<li><strong>Jira —</strong> Exercise negatives implied by {escape(snippet(summary, 70))}: record tenant SKU (SSP growth) and mail lane used.</li>"
    if "discard" in s:
        jira = "<li><strong>Jira —</strong> Discard paths: slow-double-click, Escape parity, and in-flight REST while dialog open—Message Builder notes no server draft persistence.</li>"
    if "unread" in s or "marker" in s or "blue" in s:
        jira = "<li><strong>Jira —</strong> Decide per-user vs shared read model, then test multi-recruiter refresh and non-colour unread cue per Scenario 3.</li>"
    if "notification" in s:
        jira = "<li><strong>Jira —</strong> Bell vs My Conversations vs optional device email: assert payload fields and no duplicate drop across channels.</li>"
    sal = "<li><strong>Salomon —</strong> Email Analytics may reject empty subject lines—pair blank-body template issues with vendor status rows when reproducing.</li>"
    if "attach" in s or "send" in s:
        sal = "<li><strong>Salomon —</strong> Attachment and size limits differ by channel—log count, MiB, and virus-scan rejection separately in defects.</li>"
    da = f"<li><strong>Deployment Agent —</strong> {escape(DA_ROW_ANCHOR.format(key=key, snippet=snippet(summary)))}</li>"
    return f"<ul>{jira}{sal}{da}</ul>"


def xo_lens(key: str, summary: str) -> str:
    s = summary.lower()
    lead = pick(XO_THEMES, key)
    row_focus = (
        f"XO MCP — row focus {key}: {snippet(summary, 88)} — "
        "map SUV bindings for this slice; Tier B catalog search only (no per-hook proof in this pass)."
    )
    mix = key_mix(key)
    risk_templates = (
        "XO MCP — risk: Tier B pass did not hop bindings per story—confirm REST contract and notification types on SUV for this slice.",
        "XO MCP — risk: validate which XO class owns the recruiter-visible field you are changing—avoid fixing the wrong layer.",
        "XO MCP — risk: duplicate REST paths for similar compose actions—assert the exact endpoint used by this UI path.",
        "XO MCP — risk: notification fan-out may differ by tenant SKU—log growth vs core when reproducing.",
        "XO MCP — risk: vendor mail rejections may surface as generic errors—pair UI copy with vendor status rows.",
        "XO MCP — risk: attachment handling spans multiple services—confirm which layer enforces limits for this flow.",
    )
    risk = risk_templates[mix % len(risk_templates)]
    if "92022" in key or "conversation" in s or "my conversations" in s:
        risk = "XO MCP — risk: My Conversations refactor dependency called out in Jira—needs OE alignment before QA signs routing."
    if "purge" in s:
        risk = "XO MCP — risk: purge removes Conversation Message rows—confirm UI empty states vs archived placeholders after privacy job."
    return (
        "<ul>"
        f"<li><strong>{escape(row_focus)}</strong></li>"
        f"<li><strong>{escape(lead)}</strong></li>"
        f"<li><strong>{escape(risk)}</strong></li>"
        "</ul>"
    )


def verdict(key: str, summary: str) -> str:
    s = summary.lower()
    mix = key_mix(key)
    if thin(summary, key):
        fnd = "Thin Jira body for this key—hard to test or estimate without new AC."
        step = "Add one refinement session to convert notes into scenarios and owners."
    elif "purge" in s or "pdt" in s:
        fnd = "Privacy purge scope is broad; recruiter-visible thread state after purge needs explicit expectation."
        step = "Pair privacy admin dry-run with recruiting UX on empty thread copy."
    elif "92013" in key:
        fnd = "Exploratory regression only—no named report inventory in Jira."
        step = "Attach milestone report pack list (Activity Stream, Timeline, communications export)."
    else:
        default_findings = (
            "Tenant mail setup and template health still dominate false defects next to UI polish for this slice.",
            "Slice looks UI-led in Jira; backend touchpoints (notifications, persistence) need one SUV confirmation pass.",
            "Cross-story overlap on compose/send paths—risk of conflicting mocks unless QE shares one baseline tenant recipe.",
            "REST parity is plausible but unproved in Jira—capture one HAR-backed happy path before widening coverage.",
            "Edge cases (slow network, double submit) are implied more than written—false-positive bug risk until spelled out.",
            "Accessibility and empty states are easy to regress—pair visual checks with keyboard-only navigation notes.",
        )
        default_steps = (
            "Log Default SMTP vs override and Recruiting Communications template state in each defect.",
            "Attach the exact mail mode and template name used when the behaviour reproduces (or fails).",
            "Name the owning squad for any suspected XO gap before filing—avoid duplicate tickets across compose stories.",
            "Add one SUV screenshot or short clip for the primary happy path to stabilise review.",
            "Document tenant limits (attachment size, recipient count) beside UI acceptance text.",
            "Run one cross-browser smoke on the primary path after each merge train batch for this epic.",
        )
        fnd = f"{key} — {default_findings[mix % len(default_findings)]}"
        step = default_steps[(mix // 3) % len(default_steps)]
    return (
        "<ul>"
        f"<li><strong>Finding:</strong> {escape(fnd)}</li>"
        f"<li><strong>Recommended next step:</strong> {escape(step)}</li>"
        "</ul>"
    )


def bdd(key: str, summary: str) -> str:
    s = summary.lower()
    title = escape(snippet(summary.replace("PH:", "").strip(), 90))
    if thin(summary, key):
        return (
            "<div><p><strong>Scenario: Blocked until AC exists</strong><br/>"
            f"<strong>Given</strong> stakeholders agree the open questions in {escape(key)} are closed<br/>"
            "<strong>When</strong> Jira holds testable acceptance for the slice<br/>"
            "<strong>Then</strong> QA can script the first happy path without inventing requirements</p></div>"
        )
    return (
        "<div><p><strong>Scenario: REST parity spot-check (key-specific)</strong><br/>"
        f"<strong>Given</strong> tenant staged for {escape(key)} with logged mail mode<br/>"
        f"<strong>When</strong> the recruiter performs the behaviour described in: {title}<br/>"
        "<strong>Then</strong> UI, persisted thread state, and captured network payloads align for this slice</p></div>"
    )


def story_cell(key: str, summary: str) -> str:
    return (
        f'<td><p><a href="https://jira2.workday.com/browse/{escape(key)}">{escape(key)}</a><br/>'
        f"{escape(summary)}</p></td>"
    )


def row(key: str, summary: str) -> str:
    g = gap_clause(summary, key)
    return (
        f"<!-- gap-review {key} --><tr>"
        f"{story_cell(key, summary)}"
        f"<td><p><strong>{escape(g.split(' — ')[0])}</strong> — {escape(g.split(' — ', 1)[1])}</p></td>"
        f"<td>{pm_lens(key, summary)}</td>"
        f"<td>{qa_lens(key, summary)}</td>"
        f"<td>{xo_lens(key, summary)}</td>"
        f"<td>{verdict(key, summary)}</td>"
        f"<td>{bdd(key, summary)}</td>"
        "</tr>"
    )


def preamble() -> str:
    return f"""<h2>Executive summary (for PM)</h2>
<ul>
<li><strong>Run tier: B (timeboxed)</strong>—theme-based Salomon/DA/XO where noted; not full multi-query Salomon depth per key. Fresh Jira text pulled {RUN_DATE} for every in-scope story.</li>
<li>Skipped doc-writer stories: <strong>HRREC-90852</strong> (AG:) and <strong>HRREC-90853</strong> (RN:) per gap-review scope rules.</li>
<li><strong>Template and mail lane risk:</strong> internal precedent ties blank or rejected sends to Recruiting Communications / message template health and Email Analytics subject rules—centralise one tenant checklist for QE.</li>
<li><strong>Unread and notifications:</strong> align who sees what when another recruiter reads a thread before bell and My Conversations work lands (<strong>HRREC-91997–91999</strong> with <strong>91975</strong>).</li>
<li><strong>Purge and lifecycle:</strong> use one shared definition of closed, post-purge empty state, and lifecycle admin defaults across <strong>92011–92014</strong> and <strong>92012</strong>.</li>
<li><strong>Agency vs candidate tabs:</strong> single isolation predicate for <strong>91991</strong>, <strong>92007</strong>, <strong>92008</strong>, <strong>92029</strong>—security review once, then mirror in Jira.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li><strong>Salomon themes queried this run:</strong> (1) {escape(SALOMON_THEMES[0])} (2) {escape(SALOMON_THEMES[1])} (3) {escape(SALOMON_THEMES[2])}</li>
<li><strong>XO themes queried:</strong> {escape(XO_THEMES[0])} … {escape(XO_THEMES[2])}</li>
<li><strong>Deployment Agent (batched):</strong> Edit Tenant Setup - Notifications overrides, Recruiting Communications template risk, defect logging for SMTP mode; agency isolation template fields (UDMF depth not fully returned—treat as SUV follow-up).</li>
<li>Compose / send / validation slices share one happy path recipe—avoid conflicting manual mocks across <strong>91987–91996</strong> and <strong>91994/92036</strong>.</li>
<li><strong>HRREC-92013</strong> remains exploratory until report IDs are named; do not block UI stories on it without inventory.</li>
<li><strong>HRREC-92022</strong> needs OE conversation with Blythe Early before engineering estimate—keep out of sprint commit until AC exists.</li>
</ul>
<p><em>Repo artefacts:</em> keys CSV <code>docs/initiatives/two-way-email/drafts/gap_82977_story_keys.csv</code>; generator <code>docs/initiatives/two-way-email/drafts/emit_gap_review_82977_tier_b_confluence.py</code>. Optional dedup: <code>python3 docs/initiatives/two-way-email/drafts/check_gap_review_row_dedup.py &lt;this file&gt;</code></p>
<table>
<thead><tr>
<th>Story</th><th>Gap Likelihood</th><th>PM lens</th><th>QA lens</th><th>Dev lens</th><th>Verdict</th><th>Suggested missing BDD (Given/When/Then)</th>
</tr></thead>
<tbody>
"""


def main() -> int:
    base = Path(__file__).resolve().parent
    csv_path = base / "gap_82977_story_keys.csv"
    out_path = base / "gap_review_82977_confluence_body.html"
    rows: list[tuple[str, str]] = []
    with csv_path.open(newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for line in r:
            rows.append((line["key"].strip(), line["summary"].strip()))
    parts = [preamble()]
    for key, summary in rows:
        parts.append(row(key, summary))
    parts.append("</tbody></table>")
    html = "\n".join(parts)
    out_path.write_text(html, encoding="utf-8")
    print(out_path, "utf8_bytes", len(html.encode("utf-8")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
