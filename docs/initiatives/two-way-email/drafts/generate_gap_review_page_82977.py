#!/usr/bin/env python3
"""Generate Storage HTML for Confluence gap review page HRREC-82977 from run evidence JSON.

Live `/user-story-gap-review` runs must synthesise all columns (including BDD) in-session
from fresh MCP evidence per the skill. This script is a replay/formatter for the frozen
evidence JSON only — not a substitute for a from-scratch skill execution.

**Canonical publish path** for this epic’s Storage HTML is this file; see also
`docs/initiatives/two-way-email/drafts/GAP_REVIEW_PUBLISH.md` and `gap_review_82977_evidence_META.json`.

CLI: default writes `gap_review_82977_confluence_body.html` (full cells).
`--compact` writes `gap_review_82977_confluence_body_compact.html`.
`--write-chunks` writes `confluence_publish_chunks/chunk_*.json` (compact rows, 6 stories per chunk)
for `smart_update_confluence_page` without reading the whole HTML into one MCP call.
"""
from __future__ import annotations

import html
import json
import sys
from datetime import date
from pathlib import Path

_DRAFTS_DIR = Path(__file__).resolve().parent
if str(_DRAFTS_DIR) not in sys.path:
    sys.path.insert(0, str(_DRAFTS_DIR))

from gap_likelihood_confluence import (
    gap_likelihood_status_macro,
    gap_likelihood_title_from_heuristic_pct,
)


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def trunc(s: str, n: int) -> str:
    s = s.strip()
    if len(s) <= n:
        return s
    return s[: max(0, n - 3)] + "..."


COMPACT = False


def thin_spec(r: dict) -> bool:
    g = r.get("gaps", "")
    if "No description" in g or "No Jira body" in g:
        return True
    if "Placeholder" in g or "Exploratory only" in g:
        return True
    if "Formal AC empty" in g or "Formal AC table empty" in g:
        return True
    k = r["key"]
    if k in ("HRREC-90852", "HRREC-90853", "HRREC-92022"):
        return True
    return False


def gap_score_clause(r: dict) -> tuple[int, str]:
    """Heuristic replay inputs only — internal score drives replay Gap Likelihood banding.

    Baseline uses gap text length, scenario_count, first Given presence, and stable
    per-key jitter so rows do not cluster on one default. **Not** shown as a `%`
    in the Confluence table; see ``gap_likelihood_title_from_heuristic_pct`` in ``gap_likelihood_confluence.py``.
    """
    g = r.get("gaps", "") or ""
    xo = r.get("xo", "") or ""
    key = r.get("key", "KEY")
    sc = int(r.get("scenario_count") or 0)
    score = 18 + min(8, len(g) // 50) + min(8, sc * 2)
    if (r.get("first_given_line") or "").strip():
        score += 3
    # Stable per-ticket variance (avoid ord()-of-key clustering / pseudo-random feel).
    suf = "".join(ch for ch in key.split("-")[-1] if ch.isdigit())
    score += (int(suf) % 9) if suf else 0
    reasons: list[str] = []
    if thin_spec(r):
        score += 14
        reasons.append("thin Jira AC")
    if "per-user" in g or "shared read" in g:
        score += 22
        reasons.append("open product semantics")
    if xo.lower().startswith("no ") or "No " in xo[:60] or "empty" in xo.lower():
        score += 12
        reasons.append("XO adjacency weak")
    if "SMS" in xo and "Email" in r.get("summary", ""):
        score += 6
        reasons.append("SMS proxy for email")
    if "REST" in g and ("no " in xo.lower() or "No " in xo[:20]):
        score += 10
        reasons.append("REST unspecified + no XO send op")
    if "30MB" in g or "Wire 20MB" in g:
        score += 6
        reasons.append("limit doc tension")
    if "agency" in g.lower():
        score += 4
        reasons.append("agency matrix called out")
    if "notification" in g.lower() or "purge" in g.lower():
        score += 3
    score = max(12, min(88, score))
    if reasons:
        clause = ", ".join(reasons)
    elif score <= 34:
        clause = "limited tension in this heuristic pass; lenses largely agree"
    elif score <= 48:
        clause = "minor residual signals—confirm in a live evidence pass"
    else:
        clause = "elevated signals in heuristics—cross-check PM vs QA vs XO text"
    return score, clause


def _is_doc_writer_story(r: dict) -> bool:
    s = (r.get("summary") or "").lstrip()
    u = s.upper()
    return u.startswith("AG:") or u.startswith("RN:")


def _verdict_summary_clip(summary: str) -> str:
    s = (summary or "").strip()
    if s.upper().startswith("PH:"):
        s = s[3:].strip()
    return s


def _one_line(s: str, n: int = 158) -> str:
    s = (s or "").strip()
    if len(s) <= n:
        return s
    return s[: max(0, n - 3)] + "..."


_REPLAY_SALOMON_PREFIX = "(Replay placeholder—not live Salomon excerpts.) "
_REPLAY_DA_PREFIX = "(Replay placeholder—not live Deployment Agent answers.) "
_REPLAY_XO_PREFIX = "(Replay placeholder—condensed from stub XO text.) "


def _salomon_story_sentence(r: dict) -> str:
    summ = (r.get("summary") or "").lower()
    g = (r.get("gaps") or "").lower()
    st = (r.get("first_scenario_title") or "").lower()
    if "notification" in summ or "notify" in summ or "bell" in summ:
        body = (
            "If internal search returns hits, check whether bell-style alerts vs the conversational inbox could confuse recruiters for this path."
        )
    elif "purge" in summ or "privacy" in summ or "retention" in summ:
        body = (
            "If KB hits mention purge breadth, confirm this story’s UX promises still match what admins can actually remove."
        )
    elif "agency" in summ:
        body = "If precedent exists for agency submissions, plan tests that cover agency vs direct paths for this ticket."
    elif _attachment_story_signal(r):
        body = "If internal threads mention attachment limits, align on-screen hints with what the system rejects for this slice."
    elif "bounce" in summ or "bounce" in g or "complaint" in summ:
        body = "If support-style threads exist, confirm how this slice surfaces delivery failure in plain recruiter language."
    elif "rest mentioned" in g:
        body = "If the ticket mentions system hooks, plan a short engineering check-in—search hits rarely prove end-to-end wiring."
    elif "template" in summ or "template" in g or "blank" in g:
        body = "If precedent exists for tenant templates overriding drafts, ask whether this story could hit the same pattern."
    elif "empty" in st or "empty" in summ:
        body = "If first-use / empty-thread UX is in scope, verify copy and actions match recruiter expectations on a cold start."
    else:
        body = (
            "Run Salomon on this ticket’s exact wording in a live review; this replay only mirrors summary/gap keywords—not real hits."
        )
    return _REPLAY_SALOMON_PREFIX + body


def _da_story_sentence(r: dict) -> str:
    summ = (r.get("summary") or "").lower()
    if "purge" in summ or "privacy" in summ:
        body = (
            "In a live review, ask DA how cleanup behaves in a sandbox so the story matches what customers really delete."
        )
    elif "notification" in summ or "reply" in summ:
        body = (
            "In a live review, ask DA how Reply-To and notification routing should be staged for realistic recruiter habits."
        )
    elif "send" in summ or "compose" in summ:
        body = "In a live review, ask DA how to stage send paths with slow networks and mid-flight cancels."
    elif "agency" in summ:
        body = "In a live review, ask DA how to stage agency vs direct candidates for this slice."
    else:
        body = "In a live review, ask DA which admin toggles mirror common customer misconfiguration for this area."
    return _REPLAY_DA_PREFIX + body


def _functional_story_sentence(r: dict) -> str:
    summ = (r.get("summary") or "").lower()
    if any(
        x in summ
        for x in ("email", "compose", "candidate", "conversation", "notify", "2-way", "two-way")
    ):
        return (
            "(Replay: general product checklist—confirm against functional-knowledge rules only if they apply.) "
            "For outbound candidate email work, keep consent, branding, and audit expectations on your PM checklist."
        )
    return ""


def _xo_weak_catalog_text(xo: str) -> bool:
    """True when frozen evidence has no usable XO directory narrative."""
    x = (xo or "").strip().lower()
    if not x:
        return True
    if x.startswith("no ") or "not found" in x:
        return True
    if len(x) < 80:
        return True
    return False


def _xo_catalog_body(xo: str, max_len: int = 260) -> str:
    """Strip boilerplate prefixes from evidence `xo` and return a readable catalog snippet."""
    x = (xo or "").strip()
    for prefix in ("XO search (this run):", "XO MCP —", "xo search (this run):"):
        if x.lower().startswith(prefix.lower()):
            x = x[len(prefix) :].strip()
    return _clip(x, max_len)


def _xo_story_bridge(r: dict) -> str:
    """One sentence tying catalog hits to this ticket (evidence `xo` is often identical per epic)."""
    key = r.get("key", "This ticket")
    ns = _norm_summary(r.get("summary") or "").lower()
    gx = ((r.get("gaps") or "") + " " + ns).lower()
    fg = (r.get("first_given_line") or "").lower()
    if "notification" in ns or "notify" in ns or "inbound" in ns:
        return (
            f"For {key}, map framework notification types and conversational notification domain access to the "
            "inbound-reply path this summary describes—not just generic Notification classes."
        )
    if "empty" in ns or ("empty" in fg and "state" in fg):
        return (
            f"For {key}, confirm which layout / REST fields drive first-open empty state vs first-message thread chrome."
        )
    if "purge" in ns or "privacy" in ns or "retention" in ns:
        return (
            f"For {key}, trace purge-related conversation + notification artefacts so UI promises match admin removal scope."
        )
    if "bounce" in ns or "complaint" in ns:
        return (
            f"For {key}, locate bounce/complaint surfaces in metadata or REST contracts—directory names alone do not prove telemetry."
        )
    if "agency" in ns or "agency" in gx:
        return (
            f"For {key}, reconcile agency vs direct predicates with Conversation Message / Recruiting Email bindings this slice assumes."
        )
    if "admin" in ns and ("channel" in ns or "enable" in ns or "disable" in ns):
        return (
            f"For {key}, tie tenant admin toggles to Recruiting Email / task enablement implied in Jira before UI copy locks."
        )
    if "read" in ns and "reply" in ns:
        return (
            f"For {key}, validate thread read/reply chrome against Conversation Message + Recruiting Email PRU bindings named in the catalog."
        )
    if "view" in fg and ("send" in fg or "modify" in fg) and "not" in fg:
        return (
            f"For {key}, prove domain-level View-without-Send gating in XO matches hidden compose affordances in the UI slice."
        )
    if "discard" in ns or "discard" in gx:
        return (
            f"For {key}, confirm discard/dirty-state handling is wired on the compose instance this story owns—not only generic task chrome."
        )
    if "attach" in ns or "attachment" in ns:
        return (
            f"For {key}, align attachment variable containers and send REST hooks with the size/type rules in Jira."
        )
    if "grow" in ns or "expand" in ns or "side panel" in gx or "ssp" in gx:
        return (
            f"For {key}, relate Profile SSP / sliding-panel layout metadata to expand/grow behaviour described in the summary."
        )
    if "merge" in ns or "merged" in ns:
        return (
            f"For {key}, verify merged-thread presentation against Conversation Message lineage fields implied in Jira."
        )
    return (
        f"For {key}, relate the catalog hits above to the REST/UI slice in Summary—treat hits as direction, not shipped proof."
    )


def _xo_resolved_risk(r: dict) -> str:
    """Normalised xo_risk line for display and for deduplication across sibling rows."""
    summary_l = (r.get("summary") or "").lower()
    risk = (r.get("xo_risk") or "").strip()
    if len(risk) > 280:
        risk = risk[:277] + "..."
    if not risk:
        risk = "Directory search alone does not prove inbound-reply behaviour—confirm with engineering for this story."
    elif "generic" in risk.lower() and "notification" in summary_l:
        risk = (
            "Because generic notification parts exist in the catalog, still confirm inbound-reply behaviour "
            "specifically for this email story."
        )
    elif "generic" in risk.lower() and _bdd_view_without_send_signal(r):
        risk = (
            "Directory hits show messaging domains; still prove View-without-Send wiring for compose chrome "
            "and REST gating on this slice."
        )
    return risk


def _xo_plain_pair(r: dict) -> tuple[str, str]:
    xo_raw = r.get("xo") or ""
    if _xo_weak_catalog_text(xo_raw):
        line = _REPLAY_XO_PREFIX + (
            "We did not find a crisp, named platform match for everything this ticket assumes—"
            "treat that as “needs a build-time check,” not a confident yes."
        )
    else:
        cat = _xo_catalog_body(xo_raw)
        bridge = _xo_story_bridge(r)
        line = _REPLAY_XO_PREFIX + "XO read-only pass surfaced: " + cat + " " + bridge
    return line, _xo_resolved_risk(r)


def _paraphrase_pm_gap_line(r: dict) -> str:
    """Avoid pasting identical REST boilerplate into every PM cell when gaps repeat."""
    g = (r.get("gaps") or "").strip()
    gl = g.lower()
    if not g:
        return "No gap heuristics were captured for this row in the frozen evidence file."
    if "rest mentioned" in gl and "server parity" in gl and len(g) < 220:
        return (
            "Make sure what happens on the server matches what recruiters see in the app for this story "
            "(errors, limits, and send behaviour)."
        )
    return g


def _tldr_rank_score(r: dict) -> int:
    pct, _clause = gap_score_clause(r)
    score = pct
    if thin_spec(r):
        score += 28
    ns = (r.get("summary") or "").lower()
    gl = (r.get("gaps") or "").lower()
    for needle, w in (
        ("placeholder", 22),
        ("exploratory", 18),
        ("92022", 16),
        ("purge", 14),
        ("privacy", 14),
        ("retention", 10),
        ("notification", 12),
        ("unread", 12),
        ("read", 6),
        ("agency", 10),
        ("bounce", 12),
        ("complaint", 10),
        ("reporting", 12),
        ("timeline", 12),
        ("activity stream", 12),
        ("merge", 8),
        ("closed", 8),
        ("per-user", 14),
        ("shared read", 14),
    ):
        if needle in ns or needle in gl:
            score += w
    return score


def _tldr_why_do(r: dict) -> tuple[str, str]:
    """Plain-language why / what-to-do for TL;DR bullets (replay heuristics)."""
    if thin_spec(r):
        return (
            "The ticket still reads too thin to size or test with confidence.",
            "Add clear recruiter-facing scenarios and acceptance before committing build time.",
        )
    ns = (r.get("summary") or "").lower()
    gl = (r.get("gaps") or "").lower()
    key = r.get("key", "")
    if "placeholder" in gl or "exploratory" in gl or key == "HRREC-92022":
        return (
            "Placeholder or exploratory work can expand and block teams without a crisp boundary.",
            "Write the minimum scope you will ship first, and list what must wait for a later release.",
        )
    if "purge" in ns or "privacy" in ns or "purge" in gl:
        return (
            "Deleting candidate communications touches trust, compliance, and what recruiters still see in the UI.",
            "Pair each purge-related promise in Jira with a privacy-admin walkthrough and recruiter-visible empty states.",
        )
    if "notification" in ns or "notify" in ns or "bell" in ns:
        return (
            "Alerts and inboxes are easy to misalign—recruiters may miss replies or chase the wrong entry point.",
            "Decide one story that owns bell vs inbox routing, then make the other stories point to that decision.",
        )
    if "activity stream" in ns or "timeline" in ns or ("activity" in ns and "stream" in ns):
        return (
            "If reporting or timelines are out of scope or partial, teams discover gaps only late in UAT.",
            "List which recruiter-visible history is in or out of scope for this epic, and where gaps are accepted risk.",
        )
    if "unread" in ns or "read" in ns or "badge" in ns or "per-user" in gl or "shared read" in gl:
        return (
            "Read/unread behaviour affects handoffs when more than one recruiter touches the same candidate.",
            "Pick the product rule (per person vs shared), write it in plain language in Jira, then align dependent stories.",
        )
    if "agency" in ns or ("agency" in gl and ("tab" in gl or "compose" in gl or "visibility" in gl)):
        return (
            "Agency and direct applications behave differently; mistakes show up as wrong tabs, missing threads, or surprise permissions.",
            "Stage paired agency vs direct examples in one QA plan and reference them from every affected story.",
        )
    if "attach" in ns or "attachment" in ns or _attachment_story_signal(r):
        return (
            "File limits and error text are a common source of recruiter confusion and support tickets.",
            "Align on-screen limits with what the server rejects, and capture the exact recruiter-visible error strings in Jira.",
        )
    if "bounce" in ns or "complaint" in ns or "bounce" in gl:
        return (
            "Delivery failures need to be visible and understandable—not silent.",
            "Spell out what recruiters should see when a hard bounce or complaint happens for this flow.",
        )
    pct, clause = gap_score_clause(r)
    if pct >= 52:
        return (
            f"This row tripped several tension signals ({clause}) in the automated pass.",
            "Hold a short trio review (PM, QA, engineering) on this story before locking dates.",
        )
    return (
        "Several teams need the same underlying behaviour to line up for this slice.",
        "Add two concrete recruiter-visible checks to Jira so build and QA share the same picture of done.",
    )


def html_tldr_top_five(by_key: dict[str, dict], order: list[str]) -> str:
    ranked = sorted(order, key=lambda k: _tldr_rank_score(by_key[k]), reverse=True)
    lines: list[str] = []
    for k in ranked[:5]:
        r = by_key[k]
        title = trunc(_verdict_summary_clip(r.get("summary") or k), 72)
        why, do = _tldr_why_do(r)
        lines.append(
            "<li><strong>"
            + esc(k)
            + "</strong> — "
            + esc(title)
            + "<br/>"
            + esc(why)
            + " "
            + esc(do)
            + "</li>"
        )
    return "<h2>TL;DR — five story fixes to prioritise</h2><ul>" + "".join(lines) + "</ul>"


def pm_cell(r: dict) -> str:
    ts = thin_spec(r)
    bullets: list[str] = []
    if ts:
        bullets.append(
            "<li><strong>Jira —</strong> <strong>Insufficient spec</strong>: description or acceptance is too thin to score deeply; "
            "keep questions high-level until the author expands the ticket.</li>"
        )
    else:
        bullets.append(f"<li><strong>Jira —</strong> {esc(_paraphrase_pm_gap_line(r))}</li>")
    scen = (r.get("first_scenario_title") or "").strip()
    if scen and not ts:
        bullets.append(
            f"<li><strong>Jira —</strong> First scenario in the ticket is titled “{esc(trunc(scen, 110))}”—"
            "confirm it still matches what recruiters will experience.</li>"
        )
    bullets.append(f"<li><strong>Salomon —</strong> {esc(_salomon_story_sentence(r))}</li>")
    bullets.append(f"<li><strong>Deployment Agent —</strong> {esc(_da_story_sentence(r))}</li>")
    fk = _functional_story_sentence(r)
    if fk:
        bullets.append(f"<li><strong>Functional knowledge —</strong> {esc(fk)}</li>")
    return "<ul>" + "".join(bullets) + "</ul>"


def pm_cell_compact(r: dict) -> str:
    ts = thin_spec(r)
    bits: list[str] = []
    if ts:
        bits.append("<li><strong>Jira —</strong> Thin spec—expand AC before deep review.</li>")
    else:
        bits.append(f"<li><strong>Jira —</strong> {esc(trunc(_paraphrase_pm_gap_line(r), 200))}</li>")
    bits.append(f"<li><strong>Salomon —</strong> {esc(trunc(_salomon_story_sentence(r), 200))}</li>")
    bits.append(f"<li><strong>Deployment Agent —</strong> {esc(trunc(_da_story_sentence(r), 180))}</li>")
    return "<ul>" + "".join(bits) + "</ul>"


def qa_cell(r: dict) -> str:
    ts = thin_spec(r)
    summ = (r.get("summary") or "").lower()
    g = (r.get("gaps") or "").lower()
    bullets: list[str] = []
    if ts:
        bullets.append(
            "<li><strong>Jira —</strong> Avoid inventing a long edge-case matrix until acceptance scenarios exist; "
            "smoke-test only what Jira already promises.</li>"
        )
    else:
        bullets.append(
            "<li><strong>Jira —</strong> Only add negative paths already implied by this ticket’s text—do not invent a deep edge-case matrix.</li>"
        )

    if "notification" in summ or "unread" in summ or "read" in summ:
        bullets.append(
            "<li><strong>Deployment Agent —</strong> "
            + esc(
                _REPLAY_DA_PREFIX
                + "In a live review, ask DA to validate who gets notified vs Reply-To and inbox habits for this flow."
            )
            + "</li>"
        )
    elif _attachment_story_signal(r):
        bullets.append(
            "<li><strong>Deployment Agent —</strong> "
            + esc(
                _REPLAY_DA_PREFIX
                + "In a live review, ask DA how to stage uploads at the limit this story owns and capture visible error text."
            )
            + "</li>"
        )
    elif "purge" in summ or "privacy" in summ:
        bullets.append(
            "<li><strong>Deployment Agent —</strong> "
            + esc(
                _REPLAY_DA_PREFIX
                + "In a live review, ask DA how purge behaves in a sandbox before trusting empty-state copy."
            )
            + "</li>"
        )
    else:
        bullets.append(
            "<li><strong>Deployment Agent —</strong> "
            + esc(
                _REPLAY_DA_PREFIX
                + "In a live review, ask DA which tenant toggles mirror common customer misconfiguration for this slice."
            )
            + "</li>"
        )

    if "bounce" in summ or "bounce" in g:
        bullets.append(
            "<li><strong>Salomon —</strong> "
            + esc(
                _REPLAY_SALOMON_PREFIX
                + "If bug threads exist, ask whether this ticket shows bounce headline/body in plain language."
            )
            + "</li>"
        )
    elif "agency" in summ:
        bullets.append(
            "<li><strong>Salomon —</strong> "
            + esc(
                _REPLAY_SALOMON_PREFIX
                + "If precedent exists for agency duplicates, target tests at those seams for this key."
            )
            + "</li>"
        )
    elif "rest mentioned" in g:
        bullets.append(
            "<li><strong>Salomon —</strong> "
            + esc(
                _REPLAY_SALOMON_PREFIX
                + "If tickets mention system hooks, pair each promised error with what actually saves—only if search supports it."
            )
            + "</li>"
        )
    else:
        bullets.append(
            "<li><strong>Salomon —</strong> "
            + esc(
                _REPLAY_SALOMON_PREFIX
                + "Search internal discussions on this ticket’s exact wording in a live run; if nothing returns, say “no precedent.”"
            )
            + "</li>"
        )
    return "<ul>" + "".join(bullets) + "</ul>"


def qa_cell_compact(r: dict) -> str:
    ts = thin_spec(r)
    summ = (r.get("summary") or "").lower()
    g = (r.get("gaps") or "").lower()
    if ts:
        return (
            "<ul>"
            "<li><strong>Jira —</strong> AC too thin for deep QA.</li>"
            "<li><strong>Salomon —</strong> Defer bug-pattern mining until the summary is firmer.</li>"
            "</ul>"
        )
    j = "Add one negative path tied to this summary."
    if "notification" in summ:
        j = "Check who gets notified vs Reply-To habits for this flow."
    elif _attachment_story_signal(r):
        j = "Test attachment boundary errors this story owns."
    elif "purge" in summ:
        j = "Reopen the flow after purge and read the empty state like a recruiter."
    s = _REPLAY_SALOMON_PREFIX + "In a live run, search Salomon on this key’s words—not a generic inbox checklist."
    if "agency" in summ:
        s = _REPLAY_SALOMON_PREFIX + "In a live run, ask Salomon about agency duplicate threads only if this slice owns that risk."
    elif "bounce" in summ or "bounce" in g:
        s = _REPLAY_SALOMON_PREFIX + "In a live run, ask Salomon whether bounce copy is visible—not silent."
    return f"<ul><li><strong>Jira —</strong> {esc(j)}</li><li><strong>Salomon —</strong> {esc(s)}</li></ul>"


def xo_cell(r: dict, xo_state: dict | None = None) -> str:
    xo_raw = (r.get("xo") or "").strip()
    canon_risk = _xo_resolved_risk(r)
    if xo_state is not None and xo_raw and xo_raw == xo_state.get("prev_xo"):
        bridge = _xo_story_bridge(r)
        line = _REPLAY_XO_PREFIX + (
            "Same read-only platform catalog snapshot as the previous row in this table (one epic-wide directory search "
            "in this frozen replay). "
        ) + bridge
        risk = canon_risk
        if canon_risk and canon_risk == xo_state.get("prev_canon_risk"):
            risk = (
                "Same catalog-level residual risk as other rows in this snapshot—still confirm the wiring matches this ticket."
            )
    else:
        line, risk = _xo_plain_pair(r)
    if xo_state is not None:
        xo_state["prev_xo"] = xo_raw
        xo_state["prev_canon_risk"] = canon_risk
    return (
        "<ul>"
        f"<li><strong>XO MCP —</strong> {esc(line)}</li>"
        f"<li><strong>XO MCP — risk:</strong> {esc(risk)}</li>"
        "</ul>"
    )


def xo_cell_compact(r: dict, xo_state: dict | None = None) -> str:
    xo_raw = (r.get("xo") or "").strip()
    canon_risk = _xo_resolved_risk(r)
    if xo_state is not None and xo_raw and xo_raw == xo_state.get("prev_xo"):
        bridge = _xo_story_bridge(r)
        line = _REPLAY_XO_PREFIX + (
            "Same catalog snapshot as the row above (one epic-wide search in this replay). "
        ) + bridge
        risk = canon_risk
        if canon_risk and canon_risk == xo_state.get("prev_canon_risk"):
            risk = "Same catalog-level risk as rows above—confirm wiring for this key."
    else:
        line, risk = _xo_plain_pair(r)
    if xo_state is not None:
        xo_state["prev_xo"] = xo_raw
        xo_state["prev_canon_risk"] = canon_risk
    return (
        "<p><strong>XO MCP —</strong> "
        + esc(_one_line(line, 300))
        + " <strong>Risk —</strong> "
        + esc(_one_line(risk, 220))
        + "</p>"
    )


def verdict_cell(r: dict) -> str:
    ts = thin_spec(r)
    pct, clause = gap_score_clause(r)
    summ = _verdict_summary_clip(r.get("summary") or r["key"])
    if ts:
        finding = _one_line(
            f"This ticket (“{trunc(summ, 46)}”) still reads thin—major unknowns until acceptance is written.",
            165,
        )
        step = _one_line(
            "Ask the author to add plain recruiter-facing scenarios, then rerun gap review before sizing.",
            165,
        )
    elif pct >= 58:
        finding = _one_line(f"Tension score {pct}% ({clause})—product, QA, and platform views do not fully match yet.", 165)
        step = _one_line(
            f"Hold a short refinement on “{trunc(summ, 44)}” to close the mismatches before build locks.",
            165,
        )
    elif pct <= 34 and not ts:
        finding = _one_line(
            "No strong cross-lens conflict showed up in this heuristic replay.",
            165,
        )
        scen = (r.get("first_scenario_title") or "").strip()
        scen_bit = trunc(scen, 42) if scen else r["key"]
        step = _one_line(
            f"Re-read Jira for “{scen_bit}” on {r['key']}; if nothing new surfaces, keep scenarios as written.",
            168,
        )
    else:
        topic = trunc(summ, 44)
        finding = _one_line(
            f"For “{topic}”, the three lenses mostly line up; biggest residual note: {clause}.",
            168,
        )
        step = _one_line(
            f"Tighten Jira with two recruiter-visible checks for “{trunc(summ, 48)}”.",
            165,
        )
    return (
        "<ul>"
        f"<li><strong>Finding:</strong> {esc(finding)}</li>"
        f"<li><strong>Recommended next step:</strong> {esc(step)}</li>"
        "</ul>"
    )


def verdict_cell_compact(r: dict) -> str:
    return verdict_cell(r)


def _clip(s: str, n: int) -> str:
    s = s.strip()
    if len(s) <= n:
        return s
    return s[: max(0, n - 3)] + "..."


def _norm_summary(summary: str) -> str:
    s = (summary or "").strip()
    if s.upper().startswith("PH:"):
        s = s[3:].strip()
    for marker in ("[Initialisation]", "[Initialization]", "[RFC]"):
        if s.startswith(marker):
            s = s[len(marker) :].strip()
    return s


def _attachment_story_signal(r: dict) -> bool:
    """True when BDD should talk about file attachments — not generic REST/parity gap boilerplate alone."""
    ns = _norm_summary(r.get("summary") or "").lower()
    st = (r.get("first_scenario_title") or "").lower()
    fg = (r.get("first_given_line") or "").lower()
    gaps = (r.get("gaps") or "").lower()
    story = f"{ns} {st} {fg}"
    if any(tok in gaps for tok in ("7mb", "7 mb", "20mb", "30mb", "30 mb", "20 mb", "wire 20")):
        return True
    if "attach" in story or "attachment" in story:
        return True
    if "no attach" in story or "without attachment" in story or "without an attachment" in story:
        return True
    if "file" in story and ("upload" in story or "send" in story):
        return True
    return False


def _template_override_signal(gx: str) -> bool:
    """Salomon replay text mentions templates for every row — only add BDD when Jira text signals override risk."""
    g = gx.lower()
    return any(k in g for k in ("template", "override", "blank send", "blank-send", "blank body"))


def _bdd_view_without_send_signal(r: dict) -> bool:
    ns = _norm_summary(r.get("summary") or "").lower()
    fg = (r.get("first_given_line") or "").lower()
    if "view" in fg and ("send" in fg or "modify" in fg):
        return True
    if "does not have access" in ns and "compose" in ns:
        return True
    if "read-only" in ns or "read only" in ns:
        return True
    return False


def _notification_primary_story(norm_sum: str, r: dict) -> bool:
    """True when the ticket is primarily about notifications — not admin channel stories whose gaps mention notifications."""
    s = norm_sum.lower()
    st = (r.get("first_scenario_title") or "").lower()
    if ("admin" in s or "tenant admin" in s) and ("channel" in s or "enable" in s or "disable" in s):
        return False
    return (
        "notification" in s
        or "notify" in s
        or "bell" in s
        or ("inbound" in s and "reply" in s)
        or "notification" in st
        or "notify" in st
        or ("inbound" in st and "reply" in st)
    )


def _infer_primary_actor(summary: str) -> str:
    sl = summary.lower()
    if "privacy admin" in sl:
        return "A privacy admin"
    if "purge" in sl and "admin" in sl:
        return "A privacy admin"
    if any(
        x in sl
        for x in (
            "tenant administrator",
            "tenant admin",
            "notification setup",
            "edit tenant setup",
        )
    ):
        return "A tenant administrator"
    if "admin" in sl and "channel" in sl and "email" in sl:
        return "A tenant administrator"
    if "agency" in sl:
        return "An agency recruiter with Modify/Send on conversational email where this slice applies"
    return "A recruiter with Modify/Send on conversational email where this slice applies"


def _when_from_summary_and_gaps(norm_sum: str, gx: str, r: dict) -> str:
    """Single concrete trigger — no meta placeholders."""
    c = (norm_sum + " " + gx).lower()
    c_story = (
        norm_sum + " " + (r.get("first_scenario_title") or "") + " " + (r.get("first_given_line") or "")
    ).lower()
    if "bounce" in c or "complaint" in c:
        return "A hard bounce or complaint path fires for a recruiting email in this slice; I open the thread or reporting surfaces Jira names"
    if "purge" in c and ("privacy" in c or "admin" in c):
        return "A privacy admin completes the purge or retention action this story depends on for the candidate/application context in Jira"
    if "purge" in c or "retention" in c:
        return "After purge or retention completes per policy, I reopen the 2-way email task or thread this story cares about"
    if _attachment_story_signal(r):
        return "I add, remove, or send with attachments at the boundary of the stated size/type rules for this ticket"
    if "send" in c and "no" in c and "attach" in c:
        return "I click Send on a draft with no attachments through the send path this story owns"
    if "send" in c and "message" in c:
        return "I click Send on the recruiting email draft for the states described in Jira (attachments only if this slice owns them)"
    if "discard" in c:
        return "I choose Discard (or navigate away) while the draft still has recruiter-entered content, exercising the chrome this story owns"
    if _bdd_view_without_send_signal(r):
        return (
            "I open the 2-way email task, thread list, and every Add / Compose affordance named in Jira "
            "while my domain access stays View-only per the first scenario"
        )
    if _notification_primary_story(norm_sum, r) and (
        "notification" in c or "notify" in c or ("inbound" in c and "reply" in c)
    ):
        return "An inbound reply event occurs that should drive conversational notifications per Jira for my user’s domain access"
    ns_admin = norm_sum.lower()
    if ("admin" in ns_admin or "tenant admin" in ns_admin) and (
        "channel" in ns_admin or "enable" in ns_admin or "disable" in ns_admin
    ):
        return (
            "I toggle the two-way recruiting email communications channel in the admin surfaces Jira describes "
            "and re-open recruiter-facing email task chrome affected by that change"
        )
    if "compose" in c or "to, from" in c or ("subject" in c and "header" in c):
        return "I open compose in the 2-way email task and edit To / From / Subject / body controls this story’s UI slice exposes"
    if "read" in c and ("unread" in c or "mark" in c or "badge" in c):
        return "I change read/unread markers or badges while another recruiter may share the same thread, per the semantics Jira targets"
    if "empty" in c and "state" in c:
        return "I open the 2-way email task in the SSP when no conversation exists yet for the candidate states listed in Jira"
    if "tab" in c and "agency" in c:
        return "I move between agency vs non-agency tabs or entry points this story owns while the candidate matches both contexts in QA"
    if "validation" in c or "invalid" in c or "disable" in c and "send" in c:
        return "I trigger the validation or disabled-send states described in Jira before send is allowed"
    if any(k in c_story for k in ("error", "retry", "fail", "timeout")):
        return "I provoke the error, retry, or timeout path named in the summary and follow the recovery UX this story promises"
    frag = _clip(norm_sum, 88).strip() or "this ticket’s Summary slice"
    return f"I exercise the recruiter-visible interaction described by: {frag}"


def _then_from_summary_and_gaps(norm_sum: str, gx: str, r: dict) -> str:
    c = (norm_sum + " " + gx).lower()
    if "bounce" in c or "complaint" in c:
        return "I see the specific failure headline/body or task status Jira promises — not a silent send without surfaced handling"
    if "purge" in c:
        return "Purged content stays absent from the 2-way email task, thread lists, and conversational notifications this story references"
    ns_admin = norm_sum.lower()
    if ("admin" in ns_admin or "tenant admin" in ns_admin) and (
        "channel" in ns_admin or "enable" in ns_admin or "disable" in ns_admin
    ):
        return (
            "Recruiter-visible channel availability, messaging, and email task entry points match Jira for both "
            "enabled and disabled states—no orphaned tasks or stale chrome"
        )
    if _notification_primary_story(norm_sum, r) and ("notification" in c or "bell" in c):
        return "Notifications and deep links respect conversational notification domain access — actionable only when policy allows"
    if _attachment_story_signal(r):
        return "Client and server outcomes match recruiter-visible error copy and thread contents at the stated attachment limits"
    if "empty" in c and "state" in c:
        return "Empty-state copy and affordances match Jira for each listed combination (no phantom thread or misleading send entry)"
    return "Observable UI, notification, or persisted thread state matches the acceptance criteria for this slice in recruiter-verifiable terms (harden wording under 430 / 319 before sign-off)"


def bdd_first_block_tuple(r: dict) -> tuple[str, str, str, str]:
    """First GWT block: story-specific + optional anchor to extracted Jira *Given* / scenario title."""
    summary = (r.get("summary") or "").strip() or r["key"]
    ns = _norm_summary(summary)
    first_given = (r.get("first_given_line") or "").strip()
    first_title = (r.get("first_scenario_title") or "").strip()
    scount = int(r.get("scenario_count") or 0)
    gx = ((r.get("gaps") or "") + " " + summary).lower()
    actor = _infer_primary_actor(summary)

    if scount >= 1 and first_title:
        title = f"Beyond Jira — {_clip(first_title, 72)}"
    elif scount >= 1:
        title = f"Follow-on from existing Jira Scenarios — {_clip(ns, 56)}"
    else:
        title = f"Additional scenario (not in Jira yet) — {_clip(ns, 60)}"

    surface = ""
    if "ssp" in gx or "sliding" in gx or "side panel" in gx:
        surface = "the 2-way email task in the sliding side panel (SSP)"
    elif "message builder" in gx or ("builder" in gx and "message" in gx):
        surface = "Recruiting Message Builder plus any custom To/From controls this slice owns"
    elif "thread" in gx or "conversation" in gx or "2-way" in gx or "two-way" in gx:
        surface = "the 2-way email task and thread chrome described in Jira"

    given = f"{actor} on a tenant staged for this epic"
    if surface:
        given += f", with {surface}"
    if first_given:
        given += "; Jira’s first *Given* already includes: " + _clip(first_given, 120)

    when = _when_from_summary_and_gaps(ns, gx, r)
    then = _then_from_summary_and_gaps(ns, gx, r)
    return title, given, when, then


def _bdd_block(title: str, given: str, when: str, then: str) -> str:
    """Full-row BDD: labels must read as GWT in Confluence (plain Given/When/Then is easy to miss)."""
    return (
        "<p><strong>"
        + esc(title)
        + "</strong><br/><strong>Given</strong> "
        + esc(given)
        + "<br/><strong>When</strong> "
        + esc(when)
        + "<br/><strong>Then</strong> "
        + esc(then)
        + "</p>"
    )


def _bdd_block_compact(title: str, given: str, when: str, then: str) -> str:
    """Compact publish path: short GWT, same visible labels as full table."""
    return (
        "<p><strong>"
        + esc(title)
        + "</strong><br/><strong>Given</strong> "
        + esc(_clip(given, 200))
        + "<br/><strong>When</strong> "
        + esc(_clip(when, 200))
        + "<br/><strong>Then</strong> "
        + esc(_clip(then, 200))
        + "</p>"
    )


def _bdd_followon_specs(r: dict, bdd_state: dict | None = None) -> list[tuple[str, str, str, str]]:
    """Additional (title, Given, When, Then) tuples after the first BDD block — shared by full + compact tables."""
    gaps = r.get("gaps", "") or ""
    summary = (r.get("summary") or "").strip() or r["key"]
    gx = (gaps + " " + summary).lower()
    ns = _norm_summary(summary).lower()
    xo = r.get("xo", "") or ""
    xol = xo.lower()
    pct, clause = gap_score_clause(r)
    out: list[tuple[str, str, str, str]] = []

    if "agency" in gx:
        out.append(
            (
                "Agency vs non-agency predicates",
                "the candidate has agency-linked and direct applications (or agency association toggles) as exercised in QA staging",
                "I open the email task and any tabs or compose entry points this story owns",
                "chrome and permissions follow the portfolio rules for each case without thread bleed or misleading empty tabs",
            )
        )
    if "bounce" in gx:
        out.append(
            (
                "Delivery failure surfaces",
                "the integration produces a hard bounce or complaint path the story references",
                "I review the thread and any notification or reporting surfaces in scope",
                "I see the specific status or copy promised (not a silent drop without analytics or suppression alignment)",
            )
        )
    if any(k in gx for k in ("notification", "notify", "bell", "my conversations")) and _notification_primary_story(
        _norm_summary(r.get("summary") or ""), r
    ):
        out.append(
            (
                "Inbound routing vs My Conversations (SMS legacy)",
                "inbound reply events exist for my tenant and domain access varies between recruiters",
                "a candidate reply lands while I do or do not hold conversational notification domain access",
                "I only receive actionable notifications and deep links when policy allows, and land on the correct candidate email thread",
            )
        )
    if "purge" in gx or "privacy" in gx or "retention" in gx:
        out.append(
            (
                "Privacy purge or retention edge",
                "a privacy admin has purged or constrained retained recruiting communications artefacts for this application per policy",
                "I reopen the thread after purge completes",
                "I see the documented empty or no-retained-messages state and purged content does not reappear via notifications or caches",
            )
        )
    if "discard" in gx:
        out.append(
            (
                "Draft discard integrity",
                "I have unsaved recruiter edits in compose chrome this story owns",
                "I choose Discard (or navigate away) and confirm any dialog",
                "the thread returns to the last saved recruiter-visible state with no silent partial send",
            )
        )
    if _bdd_view_without_send_signal(r):
        out.append(
            (
                "View-only security on compose affordances",
                "my security role matches the View / no-Send cases in Jira for this domain",
                "I open the 2-way email task, thread list, and any Add / Compose entry points this slice exposes",
                "send and compose entry points stay hidden or blocked with recruiter-clear copy—no back-door send",
            )
        )
    if ("admin" in ns or "tenant admin" in ns) and ("channel" in ns or "enable" in ns or "disable" in ns):
        out.append(
            (
                "Tenant admin channel ripple",
                "a tenant admin toggles the 2-way recruiting email channel the story names",
                "a recruiter opens the candidate email task on the same tenant before and after the toggle",
                "recruiter-visible availability, copy, and errors match Jira for both on and off states",
            )
        )
    if _template_override_signal(gx):
        out.append(
            (
                "Tenant template override",
                "tenant-level recruiting communications templates could override my drafted body",
                "I compose with recruiter-selected content and attempt send",
                "I either send my intended body or see a clear block with rationale — no silent blank or wrong-body send",
            )
        )
    if (
        xol.startswith("no ")
        or "no " in xol[:80]
        or "not found" in xol
        or "generic" in xol
        or ("REST" in gaps and "no " in xol[:120])
    ):
        out.append(
            (
                "Close XO–QA tension with an explicit contract",
                "XO metadata search did not evidence the server operation QA may assume for this slice",
                "I run the same flows against REST and UI with instrumented errors",
                "documented behaviour matches enforced server responses so open assumptions are resolved or tracked as a spike",
            )
        )
    if "read" in gx and "user" in gx:
        out.append(
            (
                "Shared inbox read or unread semantics",
                "two recruiters can access the same candidate email thread",
                "one marks content read while the other still needs unread cues",
                "badges and markers follow the agreed per-user or shared semantics without misleading counts",
            )
        )
    if _attachment_story_signal(r):
        out.append(
            (
                "Attachment limits client and server",
                "I stage allowed and disallowed files and sizes around the published limit",
                "I attempt send",
                "client validation, server rejection, and recruiter-visible error strings stay aligned (no orphan partial sends)",
            )
        )
    if "rest mentioned" in gx and not thin_spec(r):
        if bdd_state is not None:
            if not bdd_state.get("rest_parity_emitted"):
                out.append(
                    (
                        "REST parity spot-check (epic-wide template—use once per review)",
                        "I stage the tenant and candidate context this ticket’s REST mentions",
                        "I exercise the recruiter action and capture network responses for the operations Jira implies",
                        "UI errors, persisted thread state, and REST payloads stay aligned for this slice; reuse this pattern on sibling REST-mentioned stories",
                    )
                )
                bdd_state["rest_parity_emitted"] = True
        elif len(out) < 2:
            out.append(
                (
                    "REST parity spot-check",
                    "I stage the tenant and candidate context this ticket’s REST mentions",
                    "I exercise the recruiter action and capture network responses for the operations Jira implies",
                    "UI errors, persisted thread state, and REST payloads stay aligned for this slice",
                )
            )
    if len(out) < 2 and pct >= 58:
        out.append(
            (
                f"Refinement priority (gap {pct}%)",
                "the highest-tension risks implied by the Gap Likelihood / Verdict for this row",
                "I reproduce flows that would expose those contradictions in a realistic tenant",
                "the team records decisions or spikes that bring PM, QA, and XO assumptions back into alignment",
            )
        )
    return out


def bdd_cell(r: dict, bdd_state: dict | None = None) -> str:
    """Heuristic GWT from evidence fields — mirrors skill intent; not MCP-sourced."""
    if thin_spec(r):
        return (
            "<div>"
            "<p><strong>Blocked until AC exists</strong> — expand Jira description and Scenarios before "
            "these become executable acceptance tests.</p>"
            + _bdd_block(
                "Refinement framing (not a committed test)",
                "Actors, **Conversational Email** security domains, and tenant staging stay **TBD** until Jira AC expands beyond placeholder text",
                "Once Scenarios exist, I exercise the single control, send path, or purge step named in the Summary with QA-visible tenant setup",
                "Each *Then* is observable (UI, notification, or persisted thread state), not a vague pass — concrete assertions land in Jira during refinement",
            )
            + "</div>"
        )
    summary = (r.get("summary") or "").strip() or r["key"]
    pct, _clause = gap_score_clause(r)
    t0, g0, w0, th0 = bdd_first_block_tuple(r)
    blocks: list[str] = [_bdd_block(t0, g0, w0, th0)]
    for spec in _bdd_followon_specs(r, bdd_state=bdd_state):
        blocks.append(_bdd_block(*spec))
    out = "<div>" + "".join(blocks[:4]) + "</div>"
    sc = int(r.get("scenario_count") or 0)
    if len(blocks) == 1 and pct <= 34 and sc >= 3:
        out += (
            "<p><em>Replay note:</em> Several Jira scenarios detected and heuristic tension is low—"
            "no extra BDD blocks added; a live gap review should still confirm coverage.</p>"
        )
    return out


def bdd_cell_compact(r: dict, bdd_state: dict | None = None) -> str:
    """Must show explicit Given/When/Then — Confluence uses this path for chunked publish."""
    if thin_spec(r):
        return (
            "<div>"
            "<p><strong>Blocked until AC exists</strong> — expand Jira Scenarios before locking tests.</p>"
            + _bdd_block_compact(
                "Framing only (not committed QA)",
                "Jira AC is still too thin to author executable *Then* lines",
                "PM or engineering expands acceptance before build locks",
                "Outcome bullets become full wiki GWT in this ticket per 430 and docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md",
            )
            + "</div>"
        )
    pct, _clause = gap_score_clause(r)
    t0, g0, w0, th0 = bdd_first_block_tuple(r)
    blocks: list[str] = [_bdd_block_compact(t0, g0, w0, th0)]
    for spec in _bdd_followon_specs(r, bdd_state=bdd_state):
        blocks.append(_bdd_block_compact(*spec))
    out = "<div>" + "".join(blocks[:4]) + "</div>"
    sc = int(r.get("scenario_count") or 0)
    if len(blocks) == 1 and pct <= 34 and sc >= 3:
        out += (
            "<p><em>Replay note:</em> Jira scenarios look ample and heuristic tension is low—"
            "no extra compact BDD blocks beyond the first scenario extension.</p>"
        )
    return out


HEADERS = (
    "Story",
    "Gap Likelihood",
    "PM lens",
    "QA lens",
    "Dev lens",
    "Verdict",
    "Suggested missing BDD (Given/When/Then)",
)


def story_row_tr(
    r: dict,
    *,
    compact: bool,
    xo_state: dict | None = None,
    bdd_state: dict | None = None,
) -> str:
    pct, clause = gap_score_clause(r)
    key = r["key"]
    href = f"https://jira2.workday.com/browse/{key}"
    story_cell = f'<p><a href="{href}">{esc(key)}</a><br/>{esc(r["summary"])}</p>'
    title = gap_likelihood_title_from_heuristic_pct(pct)
    gap_cell = gap_likelihood_status_macro(title)
    gap_cell += f"<p><em>Replay heuristic:</em> {esc(clause)}</p>"
    if compact:
        cells = (
            story_cell,
            gap_cell,
            pm_cell_compact(r),
            qa_cell_compact(r),
            xo_cell_compact(r, xo_state=xo_state),
            verdict_cell_compact(r),
            bdd_cell_compact(r, bdd_state=bdd_state),
        )
    else:
        cells = (
            story_cell,
            gap_cell,
            pm_cell(r),
            qa_cell(r),
            xo_cell(r, xo_state=xo_state),
            verdict_cell(r),
            bdd_cell(r, bdd_state=bdd_state),
        )
    lines = ["<tr>"]
    for c in cells:
        lines.append(f"<td>{c}</td>")
    lines.append("</tr>")
    return "\n".join(lines)


def write_confluence_chunk_jsons(
    *,
    chunk_dir: Path,
    page_id: str,
    title: str,
    preamble: str,
    row_htmls: list[str],
    rows_per_chunk: int,
    footer_html: str = "",
) -> None:
    chunk_dir.mkdir(parents=True, exist_ok=True)
    thead_and_open = (
        "<table><thead><tr>\n"
        + "\n".join(f"<th>{h}</th>" for h in HEADERS)
        + "\n</tr></thead><tbody>"
    )
    table_close = "</tbody></table>"
    n = len(row_htmls)
    n_chunks = max(1, (n + rows_per_chunk - 1) // rows_per_chunk) if rows_per_chunk else 1
    idx = 0
    chunk_i = 0
    while idx < n:
        lo = idx
        hi = min(idx + rows_per_chunk, n)
        slice_rows = row_htmls[lo:hi]
        if chunk_i == 0:
            content = preamble + "\n" + thead_and_open + "\n" + "\n".join(slice_rows) + "\n" + table_close
            mode = "replace"
        else:
            content = (
                f'<hr/><h3>Stories (continued {lo + 1}–{hi} of {n})</h3>\n'
                + thead_and_open
                + "\n"
                + "\n".join(slice_rows)
                + "\n"
                + table_close
            )
            mode = "append"
        if chunk_i == n_chunks - 1 and footer_html:
            content += "\n" + footer_html
        payload = {"pageId": page_id, "mode": mode, "title": title, "content": content}
        out_path = chunk_dir / f"chunk_{chunk_i:02d}.json"
        out_path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        raw = out_path.read_text(encoding="utf-8")
        print(out_path, "chars", len(raw))
        idx = hi
        chunk_i += 1


def main() -> int:
    global COMPACT
    root = Path(__file__).resolve().parent
    write_chunks = "--write-chunks" in sys.argv
    compact_for_file = "--compact" in sys.argv
    COMPACT = compact_for_file or write_chunks
    ev_path = root / "gap_review_82977_evidence_2026-05-15.json"
    rows: list[dict] = json.loads(ev_path.read_text())
    rows = [r for r in rows if not _is_doc_writer_story(r)]
    by_key = {r["key"]: r for r in rows}
    order = sorted(by_key.keys())

    today = date.today().isoformat()
    title = f"Net-New Story Gap Review — {today} (HRREC-82977)"

    exec_bullets = [
        "For most customers, two-way recruiting email still behaves like “send from Workday, read replies in the mailbox”—say that plainly in launch and training so expectations match reality.",
        "Purging or deleting candidate communications is powerful: only promise “we keep a history” when privacy admins confirm what can be removed and what still appears to recruiters.",
        "Tenant-level recruiting message templates can override what a recruiter drafted—decide how you prevent silent blank sends and how you want customers to configure templates.",
        "Unread counts, bells, and the conversational inbox need one clear story for who sees what when a candidate replies—otherwise recruiters get conflicting cues across tickets.",
    ]
    epic_bullets = [
        "Many tickets repeat the same “make the server match the screen” check—use the first “REST parity spot-check” block in the table as a reusable pattern, then copy the findings into sibling stories instead of re-proving the same risk on every row.",
        "Compose, send-with-files, validations, and error-handling slices should share one agreed happy path and failure path so QA does not get conflicting mocks.",
        "Unread and read markers need a product decision before notification and badge work (for example 91997–91999 with 91975/91946) is treated as done.",
        "Agency vs non-agency tabs and compose (91991, 92007, 92008, 92029) share one predicate decision—one short architecture review lowers duplicate defects.",
        "Lifecycle admin, closed-thread behaviour, and purge (92012, 92009, 92014, 92011) must use the same meaning of “closed” in data and on screen.",
        "Placeholder-style keys (90852, 90853, 92022) should not absorb build capacity until acceptance boundaries are explicit.",
    ]
    if COMPACT:
        exec_bullets = exec_bullets[:4]
        epic_bullets = epic_bullets[:4]

    tldr_html = html_tldr_top_five(by_key, order)

    preamble_parts: list[str] = [
        tldr_html,
        "<h2>Executive summary (for PM)</h2><ul>",
    ]
    preamble_parts.extend(f"<li>{b}</li>" for b in exec_bullets)
    preamble_parts.append("</ul>")
    preamble_parts.append("<h2>Epic-level notes</h2><ul>")
    preamble_parts.extend(f"<li>{html.escape(b, quote=True)}</li>" for b in epic_bullets)
    preamble_parts.append("</ul>")
    preamble = "\n".join(preamble_parts)

    nstories = len(order)
    run_note = (
        f"<p><em>This run:</em> {nstories} stories in this table under HRREC-82977 "
        "(<strong>AG:</strong> / <strong>RN:</strong> doc-writer tickets excluded per user-story-gap-review skill). "
        "<strong>Jira:</strong> bulk REST ingest "
        "(<code>gap_review_82977_jira_bulk_session.json</code> — descriptions parsed to plain text for gap heuristics). "
        "<strong>Replay note:</strong> This HTML is generated from frozen evidence JSON (formatter only); "
        "live <code>/user-story-gap-review</code> runs use fresh MCP evidence per the skill. "
        "Scenario hooks: <code>scenario_count</code>, <code>first_scenario_title</code>, <code>first_given_line</code> from "
        "<code>build_gap_evidence_session.py</code>. "
        "Initiative vocabulary: <code>docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md</code>.</p>"
    )
    if COMPACT:
        run_note += (
            "<p><em>Compact table</em> for Confluence publish (MCP timeout). Full prose version: "
            "<code>docs/initiatives/two-way-email/drafts/gap_review_82977_confluence_body.html</code> in repo.</p>"
        )
    footer_html = (
        "<h2>How this table was produced (for operators)</h2>"
        + run_note
        + "<p>Canonical path: <code>docs/initiatives/two-way-email/drafts/GAP_REVIEW_PUBLISH.md</code>; "
        "replay flags: <code>gap_review_82977_evidence_META.json</code>.</p>"
    )

    xo_state: dict[str, str | None] = {"prev_xo": None, "prev_canon_risk": None}
    bdd_state = {"rest_parity_emitted": False}
    row_htmls = [
        story_row_tr(by_key[k], compact=COMPACT, xo_state=xo_state, bdd_state=bdd_state) for k in order
    ]

    table_lines = ["<table><thead><tr>"]
    for h in HEADERS:
        table_lines.append(f"<th>{h}</th>")
    table_lines.append("</tr></thead><tbody>")
    table_lines.extend(row_htmls)
    table_lines.append("</tbody></table>")
    table_html = "\n".join(table_lines)

    body = preamble + "\n" + table_html + "\n" + footer_html
    meta = {"title": title, "story_count": len(order)}
    if "--meta-json" in sys.argv:
        print(json.dumps(meta))
        return 0
    out_path = (
        root / "gap_review_82977_confluence_body_compact.html"
        if compact_for_file or write_chunks
        else root / "gap_review_82977_confluence_body.html"
    )
    out_path.write_text(body, encoding="utf-8")
    print(str(out_path), "bytes", len(body.encode("utf-8")))
    if write_chunks:
        chunk_dir = root / "confluence_publish_chunks"
        # Slightly smaller bands than 8 because the BDD column widens each row (MCP timeout safety).
        write_confluence_chunk_jsons(
            chunk_dir=chunk_dir,
            page_id="4416121176",
            title=title,
            preamble=preamble,
            row_htmls=row_htmls,
            rows_per_chunk=6,
            footer_html=footer_html,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
