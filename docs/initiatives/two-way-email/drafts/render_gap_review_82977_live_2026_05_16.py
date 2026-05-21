#!/usr/bin/env python3
"""Emit Storage HTML for HRREC-82977 Tier A gap review (2026-05-16 live MCP run).

Static row template: **Peanut —** is a placeholder. Live Tier A runs must follow
`.cursor/skills/user-story-gap-review/reference.md` **When to invoke Peanut**,
including **Cross-channel cited keys** (Peanut on `HRREC-…` keys named in
`Cross-channel (WhatsApp backlog) —` bullets), then replace Dev lens text from MCP.
"""
from __future__ import annotations

import csv
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "gap_82977_story_keys.csv"

# Canonical publish path for this Tier A formatter (see MISSION_LOG User-story-gap-review run log).
# Note: emit_gap_review_82977_2026_05_16.py can also write gap_review_publish_2026-05-16.html — prefer this
# script when rubric-aligned Gap + BDD behaviour matters.

# Gap Likelihood (column 2): Verdict + BDD rubric only — hand-judged from this run's evidence.
GAP: dict[str, tuple[str, str]] = {
    "HRREC-91946": ("Low", "Green"),
    "HRREC-91948": ("High", "Yellow"),
    "HRREC-91974": ("Medium", "Blue"),
    "HRREC-91975": ("Medium", "Blue"),
    "HRREC-91978": ("Medium", "Blue"),
    "HRREC-91979": ("Low", "Green"),
    "HRREC-91980": ("Medium", "Blue"),
    "HRREC-91982": ("Low", "Green"),
    "HRREC-91985": ("Medium", "Blue"),
    "HRREC-91986": ("Medium", "Blue"),
    "HRREC-91987": ("Medium", "Blue"),
    "HRREC-91988": ("Medium", "Blue"),
    "HRREC-91989": ("Low", "Green"),
    "HRREC-91990": ("Medium", "Blue"),
    "HRREC-91991": ("Low", "Green"),
    "HRREC-91992": ("Medium", "Blue"),
    "HRREC-91993": ("Low", "Green"),
    "HRREC-91994": ("Medium", "Blue"),
    "HRREC-91995": ("Medium", "Blue"),
    "HRREC-91996": ("Low", "Green"),
    "HRREC-91997": ("Medium", "Blue"),
    "HRREC-91998": ("Low", "Green"),
    "HRREC-91999": ("High", "Yellow"),
    "HRREC-92001": ("Low", "Green"),
    "HRREC-92002": ("Medium", "Blue"),
    "HRREC-92003": ("Low", "Green"),
    "HRREC-92004": ("High", "Yellow"),
    "HRREC-92005": ("Medium", "Blue"),
    "HRREC-92006": ("High", "Yellow"),
    "HRREC-92007": ("Medium", "Blue"),
    "HRREC-92008": ("High", "Yellow"),
    "HRREC-92009": ("High", "Yellow"),
    "HRREC-92010": ("Medium", "Blue"),
    "HRREC-92011": ("High", "Yellow"),
    "HRREC-92012": ("High", "Yellow"),
    "HRREC-92013": ("Medium", "Blue"),
    "HRREC-92014": ("Low", "Green"),
    "HRREC-92015": ("High", "Yellow"),
    "HRREC-92016": ("Medium", "Blue"),
    "HRREC-92022": ("Medium", "Blue"),
    "HRREC-92029": ("Medium", "Blue"),
    "HRREC-92030": ("Medium", "Blue"),
    "HRREC-92035": ("High", "Yellow"),
    "HRREC-92036": ("Medium", "Blue"),
}

STATUS = lambda title, colour: (
    f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
    f'<ac:parameter ac:name="title">{title}</ac:parameter>'
    f'<ac:parameter ac:name="colour">{colour}</ac:parameter></ac:structured-macro>'
)


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def companion_block() -> str:
    return """
<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>
<p><strong>Hard disclaimers (verbatim):</strong> (1) Same surface, different channel: WhatsApp and email differ on consent, templates, media, delivery, and failure modes.
(2) Different backend / OE: WhatsApp partner delivery is often Twilio-oriented; two-way email uses Workday’s email path—not the same as Twilio.
(3) Bugs under WhatsApp epics signal delivery pain, not proof that email is broken.
(4) Inspiration only—phrase as &quot;Consider for 2WE if…&quot;, never &quot;2WE must match WhatsApp.&quot;</p>
<p><strong>Corpus line (manifest-only):</strong> Frozen pattern corpus — snapshot_as_of 2026-05-16 in
<code>docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md</code> (manifest_complete: true, 66 Story+Bug keys in manifest, 22 captured excerpt headings).
<strong>No live Jira pull for WhatsApp companion this run (manifest-only).</strong> Theme bullets below anchor only to <strong>Captured excerpts</strong> keys—no invented live WhatsApp backlog text.</p>
<ul>
<li><strong>HRREC-90268 / HRREC-92062 (send in-flight):</strong> Disable input while send is processing to avoid duplicate or trailing text—ask whether the email composer disables RTE/Send the same way during slow REST.</li>
<li><strong>HRREC-89979 (silent until send):</strong> Failures that only surface on Send, not on open—ask whether email hits resource limits without starving recruiters of early warnings.</li>
<li><strong>HRREC-84389 / HRREC-90306 (merge &amp; identity):</strong> Merge can mis-attribute sender or survivor identity—ask how email threads and From/To bindings behave after candidate merge (email translation only).</li>
<li><strong>HRREC-84407 (read vs unread):</strong> OE timing risk on read state—ask what email promises vs receipts for &quot;read&quot; or unread markers in the SSP list.</li>
<li><strong>HRREC-89899 (consent chrome):</strong> Broken opt-in UI when tenant text missing—ask whether email opt-in surfaces hide broken links the same way.</li>
</ul>
""".strip()


def executive_block() -> str:
    return """
<h2>Executive summary (for PM)</h2>
<ul>
<li>Run tier: A (full contract). Skipped doc-writer Stories: HRREC-90852 (AG:), HRREC-90853 (RN:).</li>
<li>Gap Likelihood reflects Verdict + suggested missing BDD only—not a separate PM/QA/Dev score. Formatter guardrail: Medium/High draft lozenges that still had a generic Verdict and zero substantive Given/When/Then in column 7 were downgraded to Low (see <code>align_gap_to_verdict_bdd</code> in <code>render_gap_review_82977_live_2026_05_16.py</code>) per skill rubric.</li>
</ul>
<h3>Top 5 gaps (epic)</h3>
<ul>
<li>Panel growth and navigation (HRREC-91948 Scenario 4) still have an explicit &quot;???&quot; on reopen size—align with grow/shrink stories before sizing end-state QA.</li>
<li>REST send failures and mid-session opt-out/security loss (HRREC-92004) tell recruiters to copy text before refresh because drafts are not server-persisted—confirm copy-first UX and comms with Doc.</li>
<li>Unread/read model (HRREC-91999 Scenario 3) defers per-user vs shared read—close the product decision before blue-marker stories settle.</li>
<li>Cross-surface visibility (HRREC-92035) plus My Conversations refactor (HRREC-92022) needs an ordering spike so Activity Stream, Timeline, and in-app notifications stay coherent.</li>
<li>Agency isolation (HRREC-92008) and dual lifecycles (HRREC-92009) sit next to merge/email-change stories—schedule a short security + identity review so QA does not duplicate scenarios across keys.</li>
</ul>
<h3>Top 5 strengths (epic)</h3>
<ul>
<li>Bounce taxonomy (HRREC-92003) is unusually concrete—good recruiter-facing copy matrix tied to SES-style events.</li>
<li>Initialisation pair (HRREC-91946 / HRREC-91948) anchors SSP placement, masking, and responsive grow rules with Figma links.</li>
<li>Compose gating (HRREC-91985 / HRREC-91979) spells opt-in and domain view vs modify behaviour in recruiter language.</li>
<li>Send path splits no-attachment vs attachment clones (HRREC-91994 / HRREC-92036) with polling notes—clear sibling boundary.</li>
<li>Discard flows (HRREC-91995 / HRREC-91996) document no-backend-draft explicitly—reduces hidden QE assumptions.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li><strong>Overlapping scenarios:</strong> Panel grow/shrink appears across HRREC-91948, HRREC-91980, HRREC-91982, HRREC-92001—keep one breakpoint source of truth.</li>
<li><strong>Attachment stack:</strong> HRREC-91988, HRREC-91992, HRREC-92016, HRREC-92036 share limits—tenant allowlist and cumulative caps should be stated once then referenced.</li>
<li><strong>Ordering risk:</strong> HRREC-92022 (My Conversations) should land before or with HRREC-91975 and HRREC-92035 so notification and reporting stories do not churn twice.</li>
<li><strong>Skipped keys (doc writer):</strong> HRREC-90852, HRREC-90853 excluded from table and per-row MCP per scope rules.</li>
</ul>
""".strip()


def holistic_table() -> str:
    return """
<h2>Possible missing stories (suggestions only)</h2>
<p>Suggestions only—no Jira creation. Holistic read of HRREC-82977 Story set plus companion manifest; PRD not auto-loaded (Jira-holistic + initiative scope pointers from Notes links only).</p>
<!-- possible-missing-stories-table -->
<table>
<thead><tr><th>User Story</th><th>Reason Why This May Be Missing</th><th>BDD scenarios</th></tr></thead>
<tbody>
<tr>
<td>As a tenant admin, I want a single checklist task for SMTP, Reply-To, and Recruiting notification overrides, so pilots do not mis-wire inbound email routing.</td>
<td>No Story owns end-to-end &quot;tenant mail readiness&quot; for 2WE; HRREC-91978 toggles channel but DA notes show Reply-To and template pairing complexity sits outside individual compose slices.</td>
<td><p><strong>Scenario: Tenant mail readiness gate</strong></p><p><strong>Given</strong> a pilot tenant enables 2-way email</p><p><strong>When</strong> an admin walks the documented notification + SMTP checklist</p><p><strong>Then</strong> recruiters see consistent From/Reply-To behaviour on first send and inbound replies route back to Workday</p></td>
</tr>
<tr>
<td>As a recruiter, I want a visible &quot;sending…&quot; guard on the email composer, so double clicks do not enqueue duplicate REST sends.</td>
<td>HRREC-91994 disables Send while in flight; companion HRREC-90268 highlights in-flight typing risk—email-specific guard may need explicit ownership if not folded into RTE story.</td>
<td><p><strong>Scenario: Double-send guard</strong></p><p><strong>Given</strong> a slow network during Send</p><p><strong>When</strong> I click Send twice quickly</p><p><strong>Then</strong> only one outbound message is created and the composer shows a clear in-flight state</p></td>
</tr>
<tr>
<td>As a privacy admin, I want a purge verification report for conversational email PDTs, so I can prove candidate/job application scope after HRREC-92011 runs.</td>
<td>Purge story focuses behaviour; enterprise customers often ask for evidence pack—no row owns reporting of purge completion.</td>
<td><p><strong>Scenario: Purge attestation</strong></p><p><strong>Given</strong> a completed purge job for 2-way email artefacts</p><p><strong>When</strong> I open the admin verification UI</p><p><strong>Then</strong> I see counts by candidate and job application scope matching policy</p></td>
</tr>
<tr>
<td>As a PM owner, I want an explicit spike on internal vs external candidate email discovery, so Send Message assumptions match two-way profile email.</td>
<td>DA batch called out internal candidate email pitfalls; epic has re-hire merge (HRREC-92015) but no spike tying pre-hire email cleanup to 2WE.</td>
<td><p><strong>Scenario: Internal candidate addressing</strong></p><p><strong>Given</strong> an internal apply with a legacy work email on file</p><p><strong>When</strong> I attempt first send from the SSP email task</p><p><strong>Then</strong> the product either blocks with plain-language fix steps or resolves to the correct personal address</p></td>
</tr>
<tr>
<td>As a recruiter, I want consistent unread behaviour when another recruiter reads first, so the thread list does not lie in shared-inbox teams.</td>
<td>HRREC-91999 leaves concurrency model TBD; no sibling story defines multi-recruiter read receipts.</td>
<td><p><strong>Scenario: Shared inbox read</strong></p><p><strong>Given</strong> two recruiters share access to the same thread</p><p><strong>When</strong> one opens full view</p><p><strong>Then</strong> the second recruiter sees an understandable unread state after refresh</p></td>
</tr>
</tbody>
</table>
""".strip()


def bdd_is_substantive(bdd: str) -> bool:
    """True when column 7 counts as substantive missing BDD per user-story-gap-review/reference.md."""
    return "<strong>Given</strong>" in bdd and "<strong>When</strong>" in bdd and "<strong>Then</strong>" in bdd


def verdict_is_generic(verdict_f: str) -> bool:
    """Default 'Jira is enough' Finding — not sufficient to carry Medium/High without substantive BDD."""
    return "lenses found no extra scenario worth adding this pass" in verdict_f


def align_gap_to_verdict_bdd(gap_title: str, gap_colour: str, bdd: str, verdict_f: str) -> tuple[str, str]:
    """Downgrade Medium/High when column 7 + Verdict contradict the rubric (reference.md Gap likelihood)."""
    if gap_title not in ("Medium", "High", "Very High"):
        return gap_title, gap_colour
    if bdd_is_substantive(bdd) or not verdict_is_generic(verdict_f):
        return gap_title, gap_colour
    return "Low", "Green"


def _focus(summary: str) -> str:
    t = summary.strip()
    if ":" in t:
        t = t.split(":", 1)[-1].strip()
    if len(t) <= 110:
        return t
    cut = t[:110].rsplit(" ", 1)[0]
    return cut + "…"


def row_html(key: str, summary: str) -> str:
    s = esc(summary)
    focus = esc(_focus(summary))
    gap_title, gap_colour = GAP[key]
    if "Agency cannot" in summary:
        gap_title, gap_colour = "High", "Yellow"
    cross = ""
    if key in ("HRREC-91997", "HRREC-91999"):
        cross = "<li><strong>Cross-channel (WhatsApp backlog) —</strong> Snapshot HRREC-84407 warns read/unread timing vs OE—decide what email unread markers promise vs delivery receipts before finalising blue list UX.</li>"
    elif key == "HRREC-92005":
        cross = "<li><strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84389 / HRREC-90306 merge identity pain—confirm email sender/thread keys after merge match survivor primary email rules in Jira Notes.</li>"
    elif key == "HRREC-91994":
        cross = "<li><strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-90268 double-send guard—mirror disable-in-flight behaviour with email composer controls.</li>"
    elif key == "HRREC-92010":
        cross = "<li><strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84406 asks failures to surface early—pair Sent vs Not Delivered tags with bounce copy (HRREC-92003) so recruiters are not surprised late.</li>"
    pm_extra = ""
    qa_extra = ""
    dev_extra = ""
    bdd = ""
    if key == "HRREC-91948":
        pm_extra = "<li><strong>Jira —</strong> Scenario 4 leaves reopen size ambiguous (&quot;???&quot;)—that is a refinement blocker for every grow/shrink sibling.</li>"
        bdd = """<p><strong>Scenario: Beyond Jira Scenario 4 — reopen width</strong></p>
<p><strong>Given</strong> I expanded the SSP email panel to wide view then closed it</p>
<p><strong>When</strong> I reopen the same task in the same session</p>
<p><strong>Then</strong> the width matches the agreed default documented in refinement (not an ad hoc QA guess)</p>"""
    elif key == "HRREC-92004":
        pm_extra = "<li><strong>Jira —</strong> Notes call out draft loss on refresh after blocked send—product comms should tell recruiters to copy first.</li>"
        bdd = """<p><strong>Scenario: Negative path not in Jira — clipboard guard</strong></p>
<p><strong>Given</strong> a mid-session opt-out blocks REST send</p>
<p><strong>When</strong> the error tells me to refresh</p>
<p><strong>Then</strong> I also see a short inline reminder to copy my draft because it is not auto-saved server-side</p>"""
    elif key == "HRREC-91999":
        pm_extra = "<li><strong>Jira —</strong> Scenario 3 explicitly punts per-user vs shared read—needs a one-line decision before QA writes matrices.</li>"
        bdd = """<p><strong>Scenario: Additional scenario — concurrent recruiters</strong></p>
<p><strong>Given</strong> two recruiters can open the same thread</p>
<p><strong>When</strong> the first finishes full-view read</p>
<p><strong>Then</strong> the second recruiter’s unread marker updates on refresh in the way PM signed off (shared vs per-user)</p>"""
    elif key == "HRREC-92006":
        pm_extra = "<li><strong>Jira —</strong> &quot;Not fully closed&quot; transcript semantics are shorthand—legal/comms may need plainer external language.</li>"
        bdd = """<p><strong>Scenario: Blocked until AC exists — candidate wording</strong></p>
<p><strong>Given</strong> a candidate re-opted in</p>
<p><strong>When</strong> they view external email footers</p>
<p><strong>Then</strong> copy matches whatever marketing/legal approves (fill after AC workshop)</p>"""
    else:
        bdd = f"<p>No incremental GWT for {esc(key)}: keep Jira scenarios as written; this pass did not find a new testable gap beyond {focus}.</p>"

    if key in ("HRREC-91988", "HRREC-91992", "HRREC-92016", "HRREC-92036"):
        qa_extra += "<li><strong>Salomon —</strong> Internal attachment widget guidance (size/type allowlists) exists; confirm recruiting-specific caps for this UI slice match tenant system settings.</li>"
    if "notification" in summary.lower():
        qa_extra += "<li><strong>Deployment Agent —</strong> My Conversations vs Bell routing depends on conversational email domain access—test both security postures.</li>"
    if "purge" in summary.lower() or "Privacy" in summary:
        qa_extra += "<li><strong>Salomon —</strong> Routing article for Candidate Two-Way Messaging plus purgeable data types (Recruiting Communications) surfaced—sanity-check purge vs reporting timelines.</li>"
    if "My Conversations" in summary:
        dev_extra += "<li><strong>XO MCP —</strong> Search hits include My Conversations tasks/capabilities—confirm refactor scope with engineering before landing notification stories.</li>"
    if key == "HRREC-91946":
        dev_extra += "<li><strong>XO MCP —</strong> conversationContextInstance layout + view GET referenced in Jira dev notes—good anchor for SSP task placement.</li>"
    if key == "HRREC-91989":
        dev_extra += "<li><strong>XO MCP —</strong> Message Builder configuration classes returned—ties RTE chrome to MB stack; confirm which toolbar buttons stay for MVP.</li>"
    if key == "HRREC-92012":
        dev_extra += "<li><strong>XO MCP —</strong> &quot;Days of Open Candidate Conversation After Move to Hire&quot; numeric attribute surfaced—tie lifecycle tenant setting story to that metadata name in refinement.</li>"

    has_bdd_block = bdd.startswith("<p><strong>")
    if "Agency cannot" in summary:
        verdict_f = "Isolating agency users from direct recruiter-candidate mail is trust-critical—tighten AC with security before wide QA."
        verdict_r = "Joint desk-check HRREC-92007 tabs with HRREC-92008 ORF expectations."
    elif "both closed and non-closed" in summary:
        verdict_f = "Parallel active vs closed threads in one panel is easy to mis-scan—confirm default tab and disabled affordances with design."
        verdict_r = "Align copy with HRREC-92014 closed-thread messaging in one refinement."
    elif pm_extra:
        verdict_f = f"Primary tension is the Jira gap noted for {key}—refine before hard commit."
        verdict_r = "Run a short refinement on the noted scenario gap, then re-size."
    elif has_bdd_block:
        verdict_f = f"Jira for {key} is strong enough to execute {focus} with standard tenant prep."
        verdict_r = "Keep Jira as source of truth unless new dependencies appear in sprint planning."
    else:
        verdict_f = f"Jira for {key} covers {focus}; lenses found no extra scenario worth adding this pass."
        verdict_r = "Keep Jira as source of truth unless new dependencies appear in sprint planning."

    pm = f"""<ul>
<li><strong>Jira —</strong> For {esc(key)}, confirm {focus} still matches Figma + PRD Notes after the latest SSP decisions.</li>
{pm_extra}
<li><strong>Salomon —</strong> KB mixed SMS/general messaging—only email-relevant consent/tenant-mail themes kept; Slack had no ticket-specific hit for {esc(key)}.</li>
<li><strong>Deployment Agent —</strong> Align Edit Tenant Setup - Notifications + domain grants for this slice or recruiters see false negatives.</li>
{cross}
</ul>"""

    qa = f"""<ul>
<li><strong>Jira —</strong> For {esc(key)}, watch wrong affordances, silent blocks, or misleading tags first—tie each to a scenario title.</li>
{qa_extra}
<li><strong>Salomon —</strong> Slack archive was generic for this id—no new defect class beyond Jira.</li>
</ul>"""

    dev = f"""<ul>
<li><strong>XO MCP —</strong> SUV keyword search from this summary returned mostly relationship noise—ask engineering for canonical services/classes for {esc(key)}.</li>
{dev_extra}
<li><strong>Peanut —</strong> Not queried — no per-row trigger.</li>
</ul>"""

    v = f"""<ul>
<li><strong>Finding:</strong> {esc(verdict_f)}</li>
<li><strong>Recommended next step:</strong> {esc(verdict_r)}</li>
</ul>"""

    gap_title, gap_colour = align_gap_to_verdict_bdd(gap_title, gap_colour, bdd, verdict_f)

    story_cell = f'<a href="https://jira2.workday.com/browse/{esc(key)}">{esc(key)}</a><br/>{s}'
    gap_cell = STATUS(gap_title, gap_colour)

    return f"""<tr><!-- gap-review {key} -->
<td>{story_cell}</td>
<td>{gap_cell}</td>
<td>{pm}</td>
<td>{qa}</td>
<td>{dev}</td>
<td>{v}</td>
<td>{bdd}</td>
</tr>"""


def main() -> None:
    rows: list[tuple[str, str]] = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append((row["key"], row["summary"]))
    parts = [
        executive_block(),
        companion_block(),
        "<table><thead><tr><th>Story</th><th>Gap Likelihood</th><th>PM lens</th><th>QA lens</th><th>Dev lens</th><th>Verdict</th><th>Suggested missing BDD (Given/When/Then)</th></tr></thead><tbody>",
    ]
    for key, summary in rows:
        parts.append(row_html(key, summary))
    parts.append("</tbody></table>")
    parts.append(holistic_table())
    body = "\n".join(parts)
    out = ROOT / "gap_review_publish_2026-05-16.html"
    out.write_text(body, encoding="utf-8")
    print(out)
    print("chars", len(body))


if __name__ == "__main__":
    main()
