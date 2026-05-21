#!/usr/bin/env python3
"""One-off emitter: HRREC-82977 Tier A gap review Storage HTML from merged evidence JSON."""
from __future__ import annotations

import html
import json
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[0]
EVIDENCE_PATH = ROOT / "gap_review_evidence_HRREC82977_2026-05-16.json"
CONTEXT_PATH = ROOT / "gap_review_epic_mcp_context_2026-05-16.json"
# Optional sidecar: { "HRREC-12345": { "salomon_gap": "...", "functional": "..." }, ... }
OVERLAY_PATH = ROOT / "pm_knowledge_overlay_HRREC82977.json"
INITIATIVE_CONTEXT_PATH = ROOT.parent / "CONTEXT.md"

# Epic-level Deployment Agent note (HTML-safe; inserted once under Epic-level notes).
DA_EPIC_LI = (
    "<li><strong>Deployment Agent (epic):</strong> Tenant email and recruiting messaging are usually configured under "
    "<strong>Edit Tenant Setup - Recruiting</strong> with security on <strong>Candidate Communication</strong> "
    "and related sharing domains. The agent did not return HRREC-82977-specific runbooks this run—mirror "
    "production-like domains and notification types in your sandbox before sign-off.</li>"
)

THIN_SPEC_KEYS = frozenset(
    {
        "HRREC-91987",  # custom To/From/Subject UI — header chrome vs backend binding gaps
        "HRREC-91988",  # UI-only attachments — send truth delegated to siblings
        "HRREC-91989",  # RTE chrome only — toolbar scope vs GenAI exclusions
        "HRREC-92013",  # exploratory regression — no GWT in Jira
        "HRREC-92022",  # My Conversations XO refactor placeholder
    }
)

# Optional ≤1 cross-channel bullet (manifest excerpt anchors only)
CROSS: dict[str, str] = {
    "HRREC-91985": (
        "Cross-channel (WhatsApp backlog) — Frozen excerpt HRREC-84390: hide broken consent chrome when defaults "
        "missing; ask whether email opt-in/checkbox should disappear instead of showing a dead terms-and-conditions link."
    ),
    "HRREC-91994": (
        "Cross-channel (WhatsApp backlog) — HRREC-90268 / HRREC-92062 pattern: disable Send while a message is "
        "in flight so double-tap cannot enqueue duplicate logical sends on slow networks."
    ),
    "HRREC-92003": (
        "Cross-channel (WhatsApp backlog) — HRREC-84406: classify bounce vs validation vs policy failures and "
        "surface recruiter-readable copy in the right surface (thread vs composer), not only on send."
    ),
    "HRREC-91997": (
        "Cross-channel (WhatsApp backlog) — HRREC-84407: email read semantics differ from WhatsApp; state what "
        "you promise in the blue unread treatment versus what delivery or open receipts actually support."
    ),
    "HRREC-92005": (
        "Cross-channel (WhatsApp backlog) — HRREC-90306 / merge identity: primary email change plus merge should "
        "not leave recruiters replying as the wrong person or reading a thread keyed to a stale address."
    ),
    "HRREC-92011": (
        "Cross-channel (WhatsApp backlog) — HRREC-84388 purge: after privacy purge, confirm what recruiters and "
        "candidates still see in the email thread list versus WhatsApp-style hard-delete expectations."
    ),
    "HRREC-91988": (
        "Cross-channel (WhatsApp backlog) — HRREC-84403 / HRREC-89856: client-side attachment UI should still "
        "line up with server-side rejections so preview/send truth does not diverge on oversize or blocked types."
    ),
    "HRREC-91987": (
        "Cross-channel (WhatsApp backlog) — HRREC-89778 hydration scope: custom To/From/Subject chrome should "
        "stay consistent with Message Builder security rules for which fields resolve at preview vs send."
    ),
    "HRREC-92014": (
        "Cross-channel (WhatsApp backlog) — HRREC-90243 lifecycle copy: closed-thread messaging should appear at "
        "the business event (disposition, hire, formal close), not only after the first outbound template send."
    ),
    "HRREC-92036": (
        "Cross-channel (WhatsApp backlog) — HRREC-92062 composer input: attachment send in flight should not "
        "accept extra picker actions that confuse whether Blob IDs were included in the REST payload."
    ),
}


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def status_macro(title: str, colour: str) -> str:
    return (
        f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{esc(title)}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{esc(colour)}</ac:parameter>'
        f"</ac:structured-macro>"
    )


def ul(lines: list[str]) -> str:
    body = "".join(f"<li>{line}</li>" for line in lines)
    return f"<ul>{body}</ul>"


def verdict(finding: str, nxt: str) -> str:
    return (
        "<ul>"
        f"<li><strong>Finding:</strong> {esc(finding)}</li>"
        f"<li><strong>Recommended next step:</strong> {esc(nxt)}</li>"
        "</ul>"
    )


def gap_cell(title: str, colour: str, note: str) -> str:
    return status_macro(title, colour) + f"<p>{esc(note)}</p>"


def bdd_block(title: str, given: str, when: str, then: str) -> str:
    return (
        f"<p><strong>Scenario:</strong> {esc(title)}</p>"
        f"<p><strong>Given</strong> {esc(given)}<br/>"
        f"<strong>When</strong> {esc(when)}<br/>"
        f"<strong>Then</strong> {esc(then)}</p>"
    )


@dataclass(frozen=True)
class EpicHoist:
    """Epic-once evidence strings (plain text); esc() applied when embedded in row bullets."""

    jira_keys_display: str
    slack_one_liner: str
    xo_batch_excerpt: str
    peanut_one_liner: str
    initiative_context_excerpt: str = ""


def load_initiative_context_excerpt(path: Path, max_chars: int = 520) -> str:
    """Flatten first lines of CONTEXT.md for deterministic functional-knowledge grounding (no fabrication)."""
    if not path.is_file():
        return ""
    t = path.read_text(encoding="utf-8")
    t = re.sub(r"^#+\s+.+$", " ", t, flags=re.MULTILINE)
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
    t = re.sub(r"[`*_]{1,3}", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:max_chars] + ("…" if len(t) > max_chars else "")


def pm_salomon_lead(
    *,
    key: str,
    summary: str,
    sk: str,
    issue_kb_pm: str | None,
    overlay_gap: str | None,
) -> str:
    """Plain-text Salomon (Knowledge) lead; caller wraps with <strong> and esc()."""
    if issue_kb_pm and str(issue_kb_pm).strip():
        return str(issue_kb_pm).strip()[:420]
    if overlay_gap and str(overlay_gap).strip():
        return str(overlay_gap).strip()[:420]
    summ = (summary or "").strip()
    summ_short = (summ[:120] + ("…" if len(summ) > 120 else "")) if summ else "this slice"
    kb = (sk or "").strip()
    if kb:
        kb_clip = kb[:260] + ("…" if len(kb) > 260 else "")
        return (
            f"Epic-level internal knowledge themes surfaced: {kb_clip} "
            f"For {key}, translate that into recruiter-visible risk against «{summ_short}»—do not assume the happy path "
            f"covers tenant, security, or cross-story edges."
        )
    return (
        f"No on-topic Admin Guide or internal KB excerpt was pinned to this run for {key}. "
        f"Re-run Salomon internal knowledge scoped to «{summ_short}» or add salomon_kb_pm / overlay salomon_gap."
    )


def pm_jira_synthesis(
    *,
    key: str,
    summary: str,
    labels: list[object] | None,
    status: str,
    thin: bool,
) -> str:
    """PM synthesis from summary + labels (+ status) only—no description wiki."""
    s = (summary or "").strip()
    summ_clip = s[:180] + ("…" if len(s) > 180 else "")
    labs = labels or []
    lab_s = ", ".join(str(x) for x in labs[:8]) or "none"
    status_s = (status or "").strip() or "unknown"
    if thin:
        return (
            f"From title/summary alone «{summ_clip}» the end-to-end journey is still underspecified. "
            f"Before sizing: which neighbour owns REST/send truth; what should recruiters see if DoR stays UI-only or exploratory? "
            f"(status {status_s}; labels {lab_s})."
        )
    return (
        f"{key} «{summ_clip}» — status {status_s}; labels {lab_s}. "
        f"Close ambiguity on negative paths, mid-session admin or domain changes, and which surface owns error copy."
    )


def pm_functional_knowledge_bullet(e: dict, epic: EpicHoist, overlay_row: dict) -> str:
    """Functional knowledge bullet: evidence/overlay first, then initiative excerpt, else honest fallback."""
    raw = e.get("functional_knowledge_pm") or e.get("pm_functional_notes")
    if raw and str(raw).strip():
        return "<strong>Functional knowledge —</strong> " + esc(str(raw).strip()[:480])
    ov = (overlay_row.get("functional") or "").strip()
    if ov:
        return "<strong>Functional knowledge —</strong> " + esc(ov[:480])
    ex = (epic.initiative_context_excerpt or "").strip()
    if ex:
        summ = (e.get("summary") or "").strip()
        tail = summ[:100] + ("…" if len(summ) > 100 else "")
        hook = ex[:140] + ("…" if len(ex) > 140 else "")
        body = f"Per initiative context: {hook} Story tie-in: {tail}."
        return "<strong>Functional knowledge —</strong> " + esc(body[:520])
    return (
        "<strong>Functional knowledge —</strong> "
        "No workspace functional-knowledge excerpt or refinement transcript excerpt was pinned to this replay—open "
        "initiative CONTEXT.md transcripts, `.cursor/rules/050-functional-knowledge.mdc`, or add overlay `functional` / "
        "`functional_knowledge_pm` on the issue for traceable constraints."
    )


def bdd_negative_variant(key: str, summary: str) -> str:
    """Distinct default BDDs for medium rows (avoid one repeated 'Negative path clarity' template)."""
    frag = (summary or "").strip()
    when_anchor = frag[:130] + ("…" if len(frag) > 130 else "")
    h = sum(ord(c) for c in key)
    packs: list[tuple[str, str, str, str]] = [
        (
            "Sandbox permission realism",
            "a recruiter with Conversational Email access opens this candidate profile on a tenant configured like production",
            "administrators change Candidate Communication or recruiting messaging rights while the email panel stays open",
            "the recruiter-visible behaviour for this slice stays aligned with Jira—no silent loss of drafts and errors surface on the email task, not only generic page banners",
        ),
        (
            "Failure visibility on send and read paths",
            "two-way email compose is enabled and a realistic thread exists for this job application",
            "the team replays the riskiest branch described in Jira for this slice",
            "errors and empty states use the copy and controls described in Jira without contradictory banners elsewhere on the profile",
        ),
        (
            "Agency vs non-agency consistency",
            "the candidate relationship matches the agency or direct path assumed in this story",
            "a recruiter walks the compose and tab behaviour described in Jira on a sandbox with mixed profiles",
            "To/From eligibility, tabs, and opt-in timing stay coherent with neighbouring stories—no contradictory prompts",
        ),
        (
            "Attachment and validation hand-off",
            "tenant attachment rules and scanning match a production-like sandbox",
            "a recruiter stages edge files around the limits in this story’s Jira scenarios",
            "UI validation, server rejection, and thread messages stay consistent with sibling send and malware stories",
        ),
        (
            "Lifecycle and closed-thread clarity",
            "a thread exists in the state assumed by this story’s scenarios",
            "business events such as disposition, hire, or formal close occur while the panel is in use",
            "closed-thread banners, read-only history, and notification copy match policy and remain discoverable after the event",
        ),
        (
            "Cross-surface recruiter trust",
            "Activity Stream, Timeline, or reporting consumers are enabled for the sandbox",
            "this email slice logs events that downstream surfaces must display",
            "metadata and attachment signals stay aligned so audit and recruiter views do not contradict each other",
        ),
        (
            "Mid-session navigation and drafts",
            "a recruiter has an in-progress email draft for this slice",
            "they navigate away, collapse the panel, or switch candidates as described in Jira",
            "discard or keep behaviour matches the documented rules—no silent sends and no orphaned composer state",
        ),
    ]
    title, given, when_core, then = packs[h % len(packs)]
    when = f"{when_core} (focus: {when_anchor})" if when_anchor else when_core
    return bdd_block(title, given, when, then)


def render_row_fixed(e: dict, epic: EpicHoist, overlay_row: dict) -> str:
    key = e["key"]
    summ = e["summary"]
    sk = (e.get("salomon_kb") or "").strip()
    labels = e.get("labels")
    status = str(e.get("status") or "")

    thin = key in THIN_SPEC_KEYS
    cc = CROSS.get(key)

    pm: list[str] = []
    salomon_body = pm_salomon_lead(
        key=key,
        summary=summ,
        sk=sk,
        issue_kb_pm=e.get("salomon_kb_pm"),
        overlay_gap=(overlay_row.get("salomon_gap") if overlay_row else None),
    )
    pm.append("<strong>Salomon (Knowledge) —</strong> " + esc(salomon_body))
    pm.append(pm_functional_knowledge_bullet(e, epic, overlay_row))
    jira_syn = pm_jira_synthesis(
        key=key, summary=summ, labels=labels if isinstance(labels, list) else None, status=status, thin=thin
    )
    if thin:
        pm.append(
            "<strong>Jira —</strong> <strong>Insufficient spec</strong> — "
            + esc(jira_syn)
            + " (Acceptance is thin or exploratory—tighten DoR before sizing.)"
        )
    else:
        pm.append("<strong>Jira —</strong> " + esc(jira_syn))
    pm.append(
        "<strong>Deployment Agent —</strong> "
        + "Check recruiting messaging setup and Candidate Communication security for this slice: "
        + esc((summ or "").strip()[:120] + ("…" if len((summ or "").strip()) > 120 else ""))
    )
    if cc:
        tail = cc.replace("Cross-channel (WhatsApp backlog) — ", "").strip()
        pm.append("<strong>Cross-channel (WhatsApp backlog) —</strong> " + esc(tail))

    qa: list[str] = []
    if thin:
        qa.append(
            "<strong>Jira —</strong> "
            + "Until DoR is complete, keep QA notes exploratory rather than pretending environments are fixed."
        )
        qa.append(
            "<strong>Salomon (Jira index) —</strong> Epic-level key list is under <strong>Epic-level notes</strong>; "
            "only widen the index for "
            + esc(key)
            + " if precedent beyond the excerpted themes is blocking sizing."
        )
    else:
        qa.append(
            "<strong>Jira —</strong> Exercise edge cases from Jira for "
            + esc((summ or "").strip()[:100] + ("…" if len((summ or "").strip()) > 100 else ""))
            + "—permissions, mid-session changes, and whether errors stay on the email task instead of generic page banners."
        )
        qa.append(
            "<strong>Salomon (Jira index) —</strong> Shared epic-level key list and intent are under "
            "<strong>Epic-level notes</strong>; widen the Salomon query only if this ticket needs richer precedent."
        )
    qa.append("<strong>Salomon (Slack) —</strong> " + esc(epic.slack_one_liner))

    summ_snip = esc(((summ or "").strip()[:85] + ("…" if len((summ or "").strip()) > 85 else "")))
    dev_lines = [
        "<strong>XO MCP —</strong> Ask which workset or REST view implements this UI slice (“"
        + summ_snip
        + "”). Generic SUV search noise is summarised once under <strong>Epic-level notes</strong>.",
        "<strong>Peanut —</strong> " + esc(epic.peanut_one_liner),
    ]

    # Defaults (story-key in Finding to avoid identical Verdict fingerprints across siblings)
    finding = (
        f"{key}: Jira scenarios sketch the happy path; lenses still flag negative paths and tenant configuration "
        f"to confirm before sizing."
    )
    nxt = "In the next refinement, pick one failure or permission edge from this summary and ask engineering for the expected recruiter-visible behaviour."
    bdd = bdd_negative_variant(key, summ)
    gap_t, gap_c, gap_note = "Medium", "Blue", "Modest follow-up; one substantive BDD."

    if thin:
        if key == "HRREC-92022":
            finding = "Placeholder story: My Conversations refactor scope, dependencies, and measurable outcomes are undefined."
            nxt = "Replace placeholder with DoR, dependencies, and acceptance language co-owned with OE before sizing."
            bdd = (
                "<p><strong>Scenario:</strong> Blocked until AC exists</p>"
                "<p><strong>Given</strong> OE and engineering publish the notification surfaces in scope<br/>"
                "<strong>When</strong> this story is rewritten with scenarios<br/>"
                "<strong>Then</strong> recruiters and QE can trace bell, hub, and profile behaviours without guesswork.</p>"
            )
            gap_t, gap_c, gap_note = "Very High", "Red", "Blocker-class Finding; blocked BDD framing."
        else:
            finding = "Story text is UI-first or exploratory while neighbouring keys still own send, security, or reporting truth—refinement should lock acceptance before sizing."
            nxt = "Tighten DoR: name the owning slice for preview vs send, REST contracts, or regression charter links so QE does not duplicate sibling coverage."
            if key == "HRREC-91980":
                bdd = bdd_block(
                    "DoR for Add-to-wide compose transition",
                    "a recruiter opens the email task and taps Add on a non-agency candidate with compose rights",
                    "they repeatedly expand and collapse the sliding panel while the composer is visible",
                    "the wide compose layout, modal shadow, and disabled states match Figma without losing unsent text to an undefined persistence rule",
                )
            elif key == "HRREC-91987":
                bdd = bdd_block(
                    "DoR for custom To/From/Subject chrome",
                    "Message Builder administrators have scoped which headers appear for email templates",
                    "a recruiter opens the custom dropdown headers described in Jira",
                    "the UI shows Subject alongside To/From with the same field resolution rules engineering will bind at send time",
                )
            elif key == "HRREC-91988":
                bdd = bdd_block(
                    "DoR for attachment pills vs server rejection",
                    "tenant attachment allowlists and VSS scanning are configured as in production-like sandboxes",
                    "a recruiter stages a file that passes UI validation but fails server-side scanning",
                    "the thread shows the agreed system message and the staged pill state matches HRREC-91992/92036 error handling without contradictory copy",
                )
            elif key == "HRREC-91989":
                bdd = bdd_block(
                    "DoR for RTE toolbar scope",
                    "GenAI sparkle remains disabled for this MVP slice while other tenants have richer Message Builder toolbars",
                    "a recruiter inspects Send and Discard placement next to the RTE",
                    "toolbar buttons visible in Jira stay within the documented MVP exclusions and still meet accessibility contrast targets",
                )
            elif key == "HRREC-92013":
                bdd = bdd_block(
                    "DoR for reporting smoke charter",
                    "QE maintains a finite list of recruiting reports that must stay green when email logs appear",
                    "the exploratory pass in Jira is executed against that checklist",
                    "each report row shows expected email metadata without blank columns and the charter is referenced from HRREC-92035",
                )
            else:  # HRREC-92036
                bdd = bdd_block(
                    "DoR for multipart happy path vs virus sibling",
                    "Blobatory IDs are available for a clean attachment under the 30 MB policy",
                    "a recruiter sends one in-thread message with attachments using the REST path described in Jira",
                    "Sent tags and pills line up with HRREC-92016 malware rejection stories and no silent drop of unstaged files occurs",
                )
            gap_t, gap_c, gap_note = "High", "Yellow", "Thin-spec row; blocked-style BDD until AC tightens."
    elif key == "HRREC-91978":
        finding = "Channel enable/disable must stay coherent for recruiters mid-session and leave an auditable admin trail without surprise loss of drafts."
        nxt = "Workshop toggle behaviour with OE: what happens to in-flight compose, queued sends, and thread visibility when the channel flips off."
        bdd = bdd_block(
            "Admin disables channel during active compose",
            "a recruiter has an unsent draft open on the email task",
            "a tenant administrator disables two-way email while that session is still active",
            "new sends are blocked with the agreed copy, prior threads remain readable per policy, and the recruiter is not left with a silent non-save",
        )
        gap_t, gap_c, gap_note = "High", "Yellow", "Toggle mid-flight gap; one BDD."
    elif key == "HRREC-92012":
        finding = "Conversation lifecycle numbers and hard caps need validation UX that matches recruiting policy and scheduler behaviour."
        nxt = "Facilitate one tenant-policy workshop covering invalid N, hard caps, and how closed threads surface in the panel."
        bdd = bdd_block(
            "Invalid lifecycle configuration",
            "a tenant administrator enters an out-of-range lifecycle value described in Jira",
            "they attempt to save the tenant setting",
            "the tenant UI rejects the value with copy that matches recruiting policy and leaves prior behaviour unchanged",
        )
        gap_t, gap_c, gap_note = "High", "Yellow", "Policy clarity gap; one BDD."
    elif key == "HRREC-92004":
        finding = "REST and network failures during send can lose recruiter trust if drafts and retry paths are ambiguous."
        nxt = "Align with engineering on idempotent send handling and whether drafts survive REST errors before QA hardens suites."
        bdd = bdd_block(
            "REST error recover-forward",
            "a recruiter composes a valid email on an active thread",
            "the first send attempt returns the REST error class described in Jira",
            "the thread and composer show the agreed error, preserve or discard drafts per policy, and allow a safe retry path",
        )
        gap_t, gap_c, gap_note = "High", "Yellow", "Material failure gap; one BDD."
    elif key == "HRREC-92005":
        finding = "Primary home email changes mid-thread can strand recruiters unless info banners and read-only history match policy."
        nxt = "Workshop merge plus email-change sequencing with engineering so pause rules match SMS precedents where intended."
        bdd = bdd_block(
            "Candidate email change mid-thread",
            "a recruiter has an active two-way email thread open on the candidate profile",
            "the candidate’s primary home email changes while the panel is still open",
            "Reply and Add hide with the info copy from Jira and historical messages remain read-only without silent resend targets",
        )
        gap_t, gap_c, gap_note = "High", "Yellow", "Identity change gap; one BDD."
    elif key == "HRREC-92015":
        finding = "Duplicate merge on the same requisition risks duplicate threads or wrong participant mapping unless merge rules are explicit."
        nxt = "Document merge survivor behaviour for conversation IDs and email addresses before end-to-end merge QA."
        bdd = bdd_block(
            "Merge with two applications same JR",
            "two applications to the same job requisition are merged per duplicate management",
            "the recruiter opens the email task after merge completes",
            "both prior threads remain discoverable with correct participant labels and no send target points at the merged-away record",
        )
        gap_t, gap_c, gap_note = "High", "Yellow", "Merge/thread integrity gap; one BDD."
    elif key == "HRREC-91975":
        finding = "Notification routing spans framework events, My Conversations, bell, and optional email alerts—Deployment Agent could not confirm India MVP defaults."
        nxt = "Confirm notification type names, default routes, and per-user read semantics with engineering before copy freeze."
        bdd = bdd_block(
            "Inbound reply notification surfaces",
            "two recruiters share access to the same candidate conversation",
            "an inbound reply is ingested while one recruiter already cleared unread",
            "bell and My Conversations behaviours follow the per-user vs shared read model documented in Jira",
        )
        gap_t, gap_c, gap_note = "Medium", "Blue", "Routing follow-up; one BDD."
    elif key == "HRREC-92035":
        finding = "Cross-surface audibility needs consistent metadata and attachment representation across Activity Stream, Timeline, and Candidate Communications."
        nxt = "Ask reporting PMs for one golden-record example per surface so engineering can align field IDs and attachment parity."
        bdd = bdd_block(
            "Report line metadata parity",
            "a two-way email with attachments is logged",
            "a recruiter opens Candidate Communications and the Activity Stream card",
            "subject, parties, timestamps, and attachment presence match between surfaces for audit reviewers",
        )
        gap_t, gap_c, gap_note = "Medium", "Blue", "Reporting alignment; one BDD."
    elif key == "HRREC-91946":
        finding = "Email task visibility is comparatively bounded; residual risk is masked job applications and icon ordering next to Notes/SMS."
        nxt = "Run one UX plus QE pass on masked requisitions confirming task order and tooltip copy before freeze."
        bdd = bdd_block(
            "Masked application — task ordering on SSP",
            "a candidate has a masked job application configured in tenant maintenance",
            "a recruiter opens the candidate profile sliding panel",
            "the Email task appears in the collaboration rail with icon, tooltip, and ordering per Figma without colliding with Notes or SMS affordances",
        )
        gap_t, gap_c, gap_note = "Low", "Green", "Minor clarifier; one narrow BDD."
    elif key == "HRREC-91948":
        finding = "SSP growth breakpoints and XL push versus overlay are called out as product open questions that affect compose width."
        nxt = "Resolve grow/shrink and persistence defaults with UX engineering before locking WATS breakpoints."
        bdd = bdd_block(
            "SSP breakpoints with compose open",
            "two-way email compose is enabled on a sandbox tenant",
            "a recruiter widens the panel through L, M, and XL widths described in Jira",
            "the panel respects the documented pixel classes and does not trap the composer under the overlay mode by mistake",
        )
        gap_t, gap_c, gap_note = "Low", "Green", "Breakpoint clarifier; one narrow BDD."
    elif key == "HRREC-92002":
        finding = "Style-only scope is narrow with limited engineering risk beyond token drift versus Figma."
        nxt = "Pin Figma version IDs to the story before visual sign-off."
        bdd = "<p>No additional BDD suggested beyond Jira’s styling scenario for this pass.</p>"
        gap_t, gap_c, gap_note = "Very Low", "Grey", "No material gap beyond cosmetic governance."
    elif key == "HRREC-92013":
        finding = "Exploratory regression needs a finite charter or it will expand without exit criteria."
        nxt = "Attach a short checklist of report types and channels with pass/fail thresholds before sprint commitment."
        bdd = bdd_block(
            "Channel reporting smoke charter",
            "two-way email logging is enabled on a sandbox tenant",
            "QE executes the agreed SMS, WhatsApp, and email report checklist",
            "no report shows blank columns or broken filters introduced by the new channel",
        )
        gap_t, gap_c, gap_note = "Medium", "Blue", "Exploratory scope; one BDD."

    story_cell = (
        f'<a href="https://jira2.workday.com/browse/{esc(key)}">{esc(key)}</a><br/>{esc(summ)}'
    )

    tr = (
        f'<!-- gap-review {key} --><tr>'
        f"<td>{story_cell}</td>"
        f"<td>{gap_cell(gap_t, gap_c, gap_note)}</td>"
        f"<td>{ul(pm[:4])}</td>"
        f"<td>{ul(qa[:4])}</td>"
        f"<td>{ul(dev_lines[:4])}</td>"
        f"<td>{verdict(finding, nxt)}</td>"
        f"<td>{bdd}</td>"
        "</tr>"
    )
    return tr


def companion_section() -> str:
    return (
        '<h2>Cross-initiative pattern hints (WhatsApp &mdash; inspiration only)</h2>'
        "<p><strong>Hard disclaimers (verbatim intent):</strong> (1) Same surface, different channel: consent, templates, "
        "media, delivery semantics, and failure modes differ. (2) Different backend / OE: WhatsApp partner delivery is "
        "often Twilio-oriented; two-way email uses Workday&rsquo;s email path&mdash;do not assume parity. (3) Bugs under "
        "WhatsApp epics signal delivery pain, not proof of email defects. (4) Inspiration only&mdash;phrase as "
        "&ldquo;Consider for 2WE if&hellip;&rdquo;, never &ldquo;2WE must match WhatsApp.&rdquo;</p>"
        "<p><strong>Frozen pattern corpus</strong> &mdash; snapshot_as_of <strong>2026-05-16</strong> in "
        "<code>docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md</code>; "
        "<strong>manifest_complete: true</strong>; <strong>No live Jira pull for WhatsApp companion this run "
        "(manifest-only).</strong></p>"
        "<ul>"
        "<li><strong>HRREC-84403 / HRREC-89856</strong> &mdash; Preview vs send hydration and security context: ask "
        "whether email Message Builder previews use the same resolved fields the candidate ultimately receives.</li>"
        "<li><strong>HRREC-89979</strong> &mdash; Avoid &ldquo;silent until send&rdquo; when limits are hit; surface "
        "early when opening the email task if a conversation cannot be created.</li>"
        "<li><strong>HRREC-90243</strong> &mdash; Lifecycle banners should appear at the business event (decline, hire, "
        "close), not only after first outbound.</li>"
        "<li><strong>HRREC-90306 / HRREC-84389</strong> &mdash; After merge, confirm email identity and threading keys "
        "follow the surviving candidate, not a merged shadow record.</li>"
        "<li><strong>HRREC-84556</strong> &mdash; Reporting and CRF naming: plan email fields so mixed-channel dashboards "
        "stay interpretable.</li>"
        "</ul>"
    )


def main() -> None:
    ctx = json.loads(CONTEXT_PATH.read_text())
    raw = json.loads(EVIDENCE_PATH.read_text())
    issues = raw["issues"] if isinstance(raw, dict) else raw
    themes: list[str] = ctx["salomon_kb_themes"]
    jira_keys = ", ".join(ctx["salomon_jira_index_keys"][:10])
    slack_line = (ctx["salomon_slack"] or "").strip()
    if len(slack_line) > 280:
        slack_line = slack_line[:280] + "…"
    xo_raw = ctx["xo_mcp_search"] or ""
    xo_excerpt = xo_raw[:520] + ("…" if len(xo_raw) > 520 else "")
    peanut_raw = (ctx["peanut_default"] or "").strip()
    if peanut_raw.startswith("Peanut —"):
        peanut_short = peanut_raw[9:].strip()
    else:
        peanut_short = peanut_raw
    if len(peanut_short) > 200:
        peanut_short = peanut_short[:200] + "…"

    pm_overlay: dict[str, dict] = {}
    if OVERLAY_PATH.is_file():
        ob = json.loads(OVERLAY_PATH.read_text(encoding="utf-8"))
        if isinstance(ob, dict):
            for ok, ov in ob.items():
                if str(ok).startswith("_"):
                    continue
                pm_overlay[str(ok)] = ov if isinstance(ov, dict) else {}

    initiative_excerpt = load_initiative_context_excerpt(INITIATIVE_CONTEXT_PATH)

    epic = EpicHoist(
        jira_keys_display=jira_keys,
        slack_one_liner=slack_line or "No archived Slack hits for the epic-level query this run.",
        xo_batch_excerpt=xo_excerpt,
        peanut_one_liner=peanut_short or "Not queried in this batched pass.",
        initiative_context_excerpt=initiative_excerpt,
    )

    for i, issue in enumerate(issues):
        desc = issue.get("description") or ""
        flat = re.sub(r"\{[^}]*\}", " ", desc)
        flat = re.sub(r"\s+", " ", flat).strip()
        issue["description_excerpt"] = flat[:520]
        issue["salomon_kb"] = themes[i % len(themes)]

    by_key = {x["key"]: x for x in issues}
    order = [x["key"] for x in issues]
    rows: list[str] = []
    for k in order:
        rows.append(render_row_fixed(by_key[k], epic, pm_overlay.get(k, {})))

    tbody = "\n".join(rows)
    row_chunks = re.findall(r"(<!-- gap-review HRREC-\d+ -->.*?</tr>)", tbody, flags=re.DOTALL)
    if len(row_chunks) != len(order):
        raise RuntimeError(f"row parse mismatch: {len(row_chunks)} vs {len(order)}")

    thead = """<table>
<thead>
<tr>
<th>Story</th>
<th>Gap Likelihood</th>
<th>PM lens</th>
<th>QA lens</th>
<th>Dev lens</th>
<th>Verdict</th>
<th>Suggested missing BDD (Given/When/Then)</th>
</tr>
</thead>
<tbody>
"""

    table_close = "</tbody>\n</table>\n"

    epic_evidence_block = (
        DA_EPIC_LI
        + "<li><strong>Salomon Jira index (epic):</strong> Sample keys from the shared sweep: "
        + esc(jira_keys)
        + " — use each row only to interpret what matters for that story.</li>"
        + "<li><strong>Slack archive (epic):</strong> "
        + esc(epic.slack_one_liner)
        + "</li>"
        + "<li><strong>XO MCP batch search (epic):</strong> "
        + esc(epic.xo_batch_excerpt)
        + "</li>"
        + "<li><strong>Peanut:</strong> "
        + esc(epic.peanut_one_liner)
        + "</li>"
        + "<li><strong>How to read abbreviations:</strong> XO = Experience Orchestration (where engineers map UI to "
        "metadata); REST = API-style services; WATS = automated UI regression suite; DoR = readiness checklist "
        "before sizing.</li>"
    )

    preamble = f"""<h2>Executive summary (for PM)</h2>
<ul>
<li><strong>What this is:</strong> A net-new story gap table for two-way email on the candidate profile (<strong>HRREC-82977</strong>), refreshed <strong>2026-05-16</strong>. Internal research (Salomon), Jira precedent search, and Slack were each run <strong>once for the whole epic</strong>, then woven into each story row (not 44 fully independent deep dives). <strong>Gap Likelihood</strong> lines up with the Verdict and the suggested BDD in the last column.</li>
<li><strong>Scope:</strong> {len(order)} stories (doc-writer stories with AG:/RN: prefixes excluded). Jira descriptions were refreshed this session.</li>
</ul>
<p><em>Operator note:</em> Confluence Status colours follow the emitter rubric in this repo; if you regenerate from an older script version, say so at the top of the page.</p>
<h3>Top 5 gaps (epic)</h3>
<ul>
<li>Notification routing (bell, My Conversations, optional email) still needs explicit India MVP defaults and per-user read semantics (HRREC-91975).</li>
<li>Admin channel toggle and conversation lifecycle stories pack policy, audit, and mid-session recruiter experience into adjacent tickets (HRREC-91978, HRREC-92012).</li>
<li>Identity-heavy slices (merge, primary email change, REST send failures) need recover-forward behaviour recruiters can trust (HRREC-92005, HRREC-92015, HRREC-92004).</li>
<li>Cross-surface audibility (Activity Stream, Timeline, Candidate Communications) must stay metadata- and attachment-aligned (HRREC-92035).</li>
<li>My Conversations refactor remains a thin placeholder without DoR-backed acceptance (HRREC-92022).</li>
</ul>
<h3>Top 5 strengths (epic)</h3>
<ul>
<li>Broad scenario coverage across compose, validation, discard, thread reading, agency isolation, and delivery states.</li>
<li>Explicit UI-only vs send-path separation for RTE, attachments, and styling stories reduces scope creep.</li>
<li>Privacy purge story names the product data objects to remove, which helps GDPR-style conversations.</li>
<li>Initialisation stories anchor SSP ordering, masking, and panel growth with Figma-first language.</li>
<li>Slack archive returned <strong>no hits</strong> at epic level—operational colour leans on Jira text plus the shared Jira index note below.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li><strong>Overlap:</strong> Compose, To/From, attachments, send, and discard stories interlock; sequencing refinements should call out which story owns cross-cutting error copy.</li>
<li><strong>Agency vs non-agency:</strong> Tabs, compose eligibility, and To-list stories should share one recruiter-facing mental model to avoid contradictory opt-in timing.</li>
<li><strong>Reporting:</strong> HRREC-92013 exploratory pass should consume the same logging assumptions as HRREC-92035 to avoid duplicate QE effort.</li>
<li><strong>Engineering mapping:</strong> Plan a short readout to map these UI stories to concrete layouts and services—the batch XO search on the SUV snapshot skewed to SMS-related hits, so do not treat it as the owning design for two-way email.</li>
{epic_evidence_block}
</ul>
{companion_section()}
"""

    holistic = """<h2>Possible missing stories (suggestions only)</h2>
<!-- possible-missing-stories-table -->
<table>
<thead>
<tr>
<th>User Story</th>
<th>Reason Why This May Be Missing</th>
<th>BDD scenarios (suggestions)</th>
</tr>
</thead>
<tbody>
<!-- possible-missing-story-row 1 -->
<tr>
<td>Candidate-facing consent and frequency caps for recruiting email replies</td>
<td>Epic focuses on recruiter SSP; candidate consent journeys may live in adjacent teams or channels.</td>
<td>
<p><strong>Scenario:</strong> Candidate consent clarity</p>
<p><strong>Given</strong> a candidate receives the first two-way recruiting email<br/>
<strong>When</strong> they review footer or profile controls<br/>
<strong>Then</strong> they can understand how to opt out without breaking legitimate application communications.</p>
</td>
</tr>
<!-- possible-missing-story-row 2 -->
<tr>
<td>Operational monitoring for inbound email ingestion failures</td>
<td>Stories cover recruiter-visible errors; runbooks for SES throttling or DNS misconfiguration may sit outside HRREC.</td>
<td>
<p><strong>Scenario:</strong> Ingestion alert</p>
<p><strong>Given</strong> inbound ingestion fails for a tenant<br/>
<strong>When</strong> operations staff review monitoring dashboards<br/>
<strong>Then</strong> they can correlate failures with affected job applications within support SLAs.</p>
</td>
</tr>
<!-- possible-missing-story-row 3 -->
<tr>
<td>Migration / coexistence with legacy grid email and campaigns</td>
<td>MVP emphasises profile task; bulk or campaign sends may need explicit non-goals or guardrails.</td>
<td>
<p><strong>Scenario:</strong> Non-goal guardrail</p>
<p><strong>Given</strong> a recruiter attempts to originate the same body from a campaign and the profile task<br/>
<strong>When</strong> routing rules are evaluated<br/>
<strong>Then</strong> the behaviour matches the documented MVP boundary without duplicate sends.</p>
</td>
</tr>
</tbody>
</table>
"""

    # Chunk rows for Confluence MCP (~90k char ceiling per call)
    i1, i2 = 18, 36
    chunk0 = preamble + thead + "\n".join(row_chunks[:i1]) + table_close
    chunk1 = (
        "<h3>Net-new story gap table (continued &mdash; rows 19&ndash;36)</h3>"
        + thead
        + "\n".join(row_chunks[i1:i2])
        + table_close
    )
    chunk2 = (
        "<h3>Net-new story gap table (continued &mdash; rows 37&ndash;44)</h3>"
        + thead
        + "\n".join(row_chunks[i2:])
        + table_close
        + holistic
    )

    page = chunk0 + chunk1 + chunk2
    out = ROOT / "gap_review_publish_2026-05-16.html"
    out.write_text(page, encoding="utf-8")
    (ROOT / "gap_review_chunk0_replace.html").write_text(chunk0, encoding="utf-8")
    (ROOT / "gap_review_chunk1_append.html").write_text(chunk1, encoding="utf-8")
    (ROOT / "gap_review_chunk2_append.html").write_text(chunk2, encoding="utf-8")
    print(out, len(page), "chunk0", len(chunk0), "chunk1", len(chunk1), "chunk2", len(chunk2))


if __name__ == "__main__":
    main()
