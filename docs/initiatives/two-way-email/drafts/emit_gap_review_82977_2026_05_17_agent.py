#!/usr/bin/env python3
"""One-off emitter: HRREC-82977 Tier B gap review HTML for Confluence (2026-05-17 agent run)."""
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SUMMARIES = json.loads((ROOT / "_gap82977_summaries_2026-05-17.json").read_text())

ORDER = sorted(SUMMARIES, key=lambda k: int(k.split("-")[1]))
OUT = ROOT / "gap_review_HRREC82977_2026-05-17_agent.html"

STATUS = {
    "Very High": ("Very High", "Red"),
    "High": ("High", "Yellow"),
    "Medium": ("Medium", "Blue"),
    "Low": ("Low", "Green"),
    "Very Low": ("Very Low", "Grey"),
}


def macro(title: str) -> str:
    t, c = STATUS[title]
    return (
        f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{t}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{c}</ac:parameter>'
        "</ac:structured-macro>"
    )


def tail(summary: str) -> str:
    if "PH:" in summary:
        return summary.split("PH:", 1)[1].strip()
    return summary.strip()


def row_cells(key: str) -> tuple[str, str, str, str, str, str, str, str]:
    summ = SUMMARIES[key]["summary"]
    thin = SUMMARIES[key]["thin"]
    t = tail(summ)
    esc_t = html.escape(t)
    esc_k = html.escape(key)

    if thin and key == "HRREC-92013":
        pm = f"Exploratory milestone text for {esc_t} still lacks concrete report names and pass/fail gates, so refinement cannot prove email did not regress adjacent channel reporting. [Epic scan; Salomon; DA]"
        qa = f"Without named reports, recruiters could ship believing dashboards are safe while only ad-hoc smoke ran on unrelated grids. [Jira]"
        dev = f"SUV XO search did not run this session; ask engineering which Candidate Communication / timeline integrations are in scope for {esc_k} versus owned elsewhere. [XO MCP]"
        ver = "<strong>Very High</strong>"
        find = f"Thin story body for {esc_k} leaves reporting guard-rails undefined."
        nxt = "Convert into a checklist of standard reports and CRFs with explicit pass criteria before milestone sign-off."
        gap = "Very High"
        bdd = "<p><strong>Blocked until AC exists</strong> — replace exploratory prose with a table of report keys, expected row deltas when an email sends, and owners.</p>"
        return pm, qa, dev, ver, find, nxt, gap, bdd

    if thin and key == "HRREC-92022":
        pm = f"{esc_k} is still a stub—alignment with OE on icon routing vs bell notifications is not captured in scenarios. [Epic scan; Salomon; DA]"
        qa = f"Recruiters may get duplicate or missing heads-up for inbound email replies until the notification surface contract is written down. [Jira]"
        dev = f"XO MCP was unavailable this session; confirm which header domains and security groups must change together for {esc_k}. [XO MCP]"
        ver = "<strong>Very High</strong>"
        find = f"{esc_k} cannot be sized until acceptance criteria exist beyond a one-line title."
        nxt = "Schedule OE alignment (Blythe Early per Jira note) and rewrite with explicit My Conversations vs bell behaviour."
        gap = "Very High"
        bdd = "<p><strong>Blocked until AC exists</strong> — draft Given/When/Then for each notification entry point after OE decisions land.</p>"
        return pm, qa, dev, ver, find, nxt, gap, bdd

    # Default: keyword-tuned single sentences (Tier B)
    pm_bits = []
    has_agency = (
        "agency" in t.lower()
        and "non-agency" not in t.lower()
        and "non agency" not in t.lower()
    )
    if "merge" in t.lower() or "merged" in t.lower():
        pm_bits.append(
            "Duplicate-management merges can strand conversation identity—pressure-test how email threads and primary-home validation stay aligned with UDMF expectations."
        )
    elif "purge" in t.lower() or "privacy" in t.lower():
        pm_bits.append(
            "Privacy admins need clarity that Recruiting Communications PDT coverage matches new email bodies, attachments, and notification events before legal sign-off."
        )
    elif "notification" in t.lower() or "unread" in t.lower():
        pm_bits.append(
            "Bell vs My Conversations routing and read/unread semantics should stay consistent with tenant email notification rules so recruiters are not surprised by silent drops."
        )
    elif has_agency or ("tab" in t.lower() and "non-agency" not in t.lower()):
        pm_bits.append(
            "Agency vs candidate isolation is a trust bar—pair UI tab promises with server-side scoping so agency users never infer cross-thread content."
        )
    elif ("attach" in t.lower() or "blob" in t.lower()) and "no attachment" not in t.lower():
        pm_bits.append(
            "Attachment encoding and Blobatory hand-offs can inflate payload size—align client limits with ingestion and bounce copy so recruiters see one truth."
        )
    elif "bounce" in t.lower() or "bounced" in summ.lower() or "not delivered" in t.lower():
        pm_bits.append(
            "Differentiate transport delays, consent blocks, and malware blocks in recruiter language so downstream support macros stay accurate."
        )
    elif "toggle" in t.lower() or "admin" in t.lower() or "lifecycle" in t.lower():
        pm_bits.append(
            "Tenant admins need auditable toggles and lifecycle windows that match how recruiters experience mid-flight disables versus historical read-only threads."
        )
    elif "initialisation" in t.lower() or "ssp" in t.lower() or "growth" in t.lower():
        pm_bits.append(
            "Sliding-panel growth and task ordering must stay coherent with other collaboration tasks so email does not steal focus from masked or restricted applications."
        )
    else:
        pm_bits.append(
            f"For {esc_t}, stress how this slice composes with opt-in, security-domain write access, and discard flows so the candidate experience stays predictable."
        )
    pm = f"{esc_k} — {pm_bits[0]} [Epic scan; Salomon; DA]"

    if "unread" in t.lower() or "marker" in t.lower():
        qa = f"Colour-only unread cues can fail accessibility—recruiters need a second signal if blue markers are the primary affordance for {esc_t}. [Jira]"
    elif "discard" in t.lower() or "draft" in t.lower():
        qa = f"Local-only drafts (per Message Builder note) mean navigation prompts must cover every exit path or recruiters lose long emails silently for {esc_t}. [Jira]"
    elif ("rest" in t.lower() or "send message" in t.lower()) and "validation" not in t.lower():
        qa = f"Mid-send security or opt-out changes plus refresh guidance must be user-visible, or recruiters copy text and refresh without understanding why {esc_t} failed. [Jira]"
    elif "agency" in t.lower() and has_agency:
        qa = f"Direct-object tampering attempts should return empty or forbidden views without leaking thread snippets for {esc_t}. [Jira]"
    else:
        qa = f"Edge cases in {esc_t} should be exercised on masked job applications, channel-off tenants, and slow networks so the UI does not lie about sent state. [Jira]"

    dev = (
        f"XO MCP did not return SUV metadata this session; have engineering point to the binding or service area implementing {esc_k} ({esc_t}) and confirm REST contracts against the scenarios. [XO MCP]"
    )

    # Verdict + gap + bdd heuristics
    bdd = ""
    if key == "HRREC-91994":
        ver = "<strong>High</strong>"
        find = f"{esc_k} combines optimistic UI, polling, and double-send prevention—timing bugs are likely without soak tests."
        nxt = "Add non-functional acceptance for max latency before showing retry affordances."
        gap = "High"
        bdd = """<p><strong>Scenario: Slow thread index</strong></p>
<p><strong>Given</strong> backend indexing lags after send<br/>
<strong>When</strong> the recruiter waits without refreshing<br/>
<strong>Then</strong> polling stops with clear guidance instead of duplicate sends.</p>"""
        return pm, qa, dev, ver, find, nxt, gap, bdd
    if key == "HRREC-92036":
        ver = "<strong>High</strong>"
        find = f"{esc_k} must keep Blobatory references, virus scan outcomes, and thread pills consistent when payloads include binaries."
        nxt = "Pair with backend on max encoded size and partial-failure rollback before UI promises a Sent tag."
        gap = "High"
        bdd = """<p><strong>Scenario: Partial attachment failure</strong></p>
<p><strong>Given</strong> one attachment fails virus scan while others pass<br/>
<strong>When</strong> send completes or aborts<br/>
<strong>Then</strong> the thread shows an honest per-attachment outcome without marking the whole message Sent prematurely.</p>"""
        return pm, qa, dev, ver, find, nxt, gap, bdd
    if key == "HRREC-92004":
        ver = "<strong>High</strong>"
        find = f"{esc_k} pairs refresh guidance with possible draft loss—copy-to-clipboard behaviour needs product-owned wording."
        nxt = "Align support copy with Doc writers before engineering freezes the error modal."
        gap = "High"
        bdd = """<p><strong>Scenario: Mid-session opt-out</strong></p>
<p><strong>Given</strong> a candidate opts out while I am composing<br/>
<strong>When</strong> I press Send and receive the blocked error<br/>
<strong>Then</strong> the modal tells me how to preserve text before refresh without contradicting discard rules.</p>"""
        return pm, qa, dev, ver, find, nxt, gap, bdd

    if any(x in summ.lower() for x in ["initialisation", "growth", "ssp"]):
        ver = "<strong>High</strong>"
        find = f"{esc_k} leaves open questions on panel reopen state and breakpoint behaviour that UX still owes."
        nxt = "Close Scenario 4/5 style questions in Jira with UX decisions before dev branches diverge."
        gap = "High"
        if key == "HRREC-91948":
            bdd = """<p><strong>Scenario: SSP growth state before email</strong></p>
<p><strong>Given</strong> I used the SSP growth affordance to widen the collaboration chrome<br/>
<strong>When</strong> I collapse to default width and then open the email task<br/>
<strong>Then</strong> the sliding email panel starts from the agreed baseline width without inheriting a stale expanded chrome state.</p>"""
        else:
            bdd = """<p><strong>Scenario: Reopen panel after navigation</strong></p>
<p><strong>Given</strong> I grew the panel then closed it from the candidate profile<br/>
<strong>When</strong> I reopen the email task in the same session<br/>
<strong>Then</strong> the panel width matches the agreed default vs last-grown state per UX decision.</p>"""
    elif "merge" in t.lower():
        ver = "<strong>Very High</strong>"
        find = f"{esc_k} ties email threads to merge survivorship and primary email changes—high regression surface."
        nxt = "Run a merge matrix with two JR applications and verify thread ownership plus send blocks in one refinement session."
        gap = "Very High"
        bdd = """<p><strong>Scenario: Merge survivor email change</strong></p>
<p><strong>Given</strong> two applications merge and primary home email flips<br/>
<strong>When</strong> I view historical threads<br/>
<strong>Then</strong> read-only history stays intact and new sends route only to the surviving address with clear info copy.</p>"""
    elif "purge" in t.lower():
        ver = "<strong>High</strong>"
        find = f"{esc_k} must align PDT scope with notification artefacts or admins may think purge cleared email when events remain."
        nxt = "Pair with privacy PM to list every sub-object removed when Recruiting Communications PDT runs."
        gap = "High"
        bdd = """<p><strong>Scenario: Purge verification</strong></p>
<p><strong>Given</strong> a purge targeting recruiting communications<br/>
<strong>When</strong> audit runs post purge<br/>
<strong>Then</strong> conversation bodies, attachments, and recruiting notification events are gone while unrelated audit logs remain.</p>"""
    elif "notification" in t.lower():
        ver = "<strong>High</strong>"
        find = f"{esc_k} depends on framework routing to My Conversations vs bell without duplicating email alerts."
        nxt = "Document the exact notification type and tenant routing prerequisites beside the instantiate event note."
        gap = "High"
        bdd = """<p><strong>Scenario: Domain lacks My Conversations modify</strong></p>
<p><strong>Given</strong> I participate in a thread but lack My Conversations domain modify<br/>
<strong>When</strong> a reply arrives<br/>
<strong>Then</strong> I still receive a compliant heads-up via bell or email per routing rules.</p>"""
    elif "style" in t.lower():
        ver = "<strong>Low</strong>"
        find = f"{esc_k} is styling-only with narrow delivery risk if Figma tokens drift."
        nxt = "No material gap surfaced—keep visual QA tied to the linked Figma baseline."
        gap = "Low"
        bdd = "<p>No additional BDD suggested beyond visual regression checklist in test plan.</p>"
    elif "bounce" in t.lower() or "bounced" in summ.lower():
        ver = "<strong>High</strong>"
        find = f"{esc_k} maps many SES variants—misclassification would show the wrong recruiter guidance for the same headline."
        nxt = "Publish a decision table mapping provider codes to the six scenario variants and who owns ongoing text changes."
        gap = "High"
        bdd = """<p><strong>Scenario: Ambiguous provider code</strong></p>
<p><strong>Given</strong> SES returns a new sub-type not in the six variants<br/>
<strong>When</strong> the recruiter opens the wide view<br/>
<strong>Then</strong> they see the technical-issue fallback with a support path instead of a misleading spam or delay story.</p>"""
    else:
        ver = "<strong>Medium</strong>"
        find = f"{esc_k} scenarios are credible but still benefit from cross-story ordering checks with adjacent compose/read stories."
        nxt = "In refinement, confirm dependencies with neighbouring milestones before sprint commit."
        gap = "Medium"
        bdd = f"<p>No extra GWT for {esc_k}; Jira scenarios stay the source unless refinement surfaces a new cross-row dependency.</p>"

    return pm, qa, dev, ver, find, nxt, gap, bdd


def main() -> None:
    parts: list[str] = []
    parts.append('<h2>Executive summary (for PM)</h2>')
    parts.append("<ul>")
    parts.append(
        "<li><strong>Run tier:</strong> B (timeboxed)—44 HRREC-82977 Stories with fresh <code>getTicketDetails</code> this session; "
        "Salomon KB and Deployment Agent were theme-batched (not full per-key depth); Dev lens uses honest XO outage wording.</li>"
    )
    parts.append(
        "<li><strong>Scope:</strong> Skipped doc-writer Stories <code>HRREC-90852</code> (AG:) and <code>HRREC-90853</code> (RN:) per skill exclusions. "
        "<strong>Gap Likelihood</strong> reflects Verdict + suggested missing BDD only.</li>"
    )
    parts.append(
        "<li><strong>(3) Global XO MCP outage:</strong> XO MCP <code>search</code> did not return SUV metadata this session (transport/DNS failure), so Dev lens rows are engineering follow-ups—not proof that hooks are missing.</li>"
    )
    parts.append("</ul>")
    parts.append("<h3>Top 5 gaps (epic)</h3><ul>")
    for li in [
        "Draft persistence is local-only for several compose/discard stories—align on whether any MVP server draft is required before recruiters rely on navigation guards (HRREC-91995, HRREC-91996).",
        "Merge, primary-email changes, and thread read-only states intersect across multiple keys—run one consolidated duplicate-management workshop before sizing (HRREC-92015, HRREC-92005).",
        "Notification + My Conversations + bell routing needs an explicit cross-surface contract so inbound email replies are not noisy or invisible (HRREC-91975, HRREC-92022).",
        "Agency isolation and tab lifecycles are security-sensitive—pair UX tabs with forced server scoping and negative security tests (HRREC-92007, HRREC-92008, HRREC-92009).",
        "Thin-spec reporting smoke (HRREC-92013) and lifecycle admin story (HRREC-92012) need firmer acceptance tables before milestone sign-off.",
    ]:
        parts.append(f"<li>{html.escape(li)}</li>")
    parts.append("</ul>")
    parts.append("<h3>Top 5 strengths (epic)</h3><ul>")
    for li in [
        "Broad scenario coverage for compose, send, bounce taxonomy, and REST failures shows mature recruiter-facing thinking.",
        "Explicit opt-in, read-only security, and channel-disable stories reduce accidental non-compliant sends.",
        "Purge story names concrete PDT objects (messages, participants, attachments, notification events).",
        "Agency vs candidate tabs and agency-only visibility stories state clear confidentiality intent.",
        "Attachment and validation stories distinguish client-side limits from backend enforcement.",
    ]:
        parts.append(f"<li>{html.escape(li)}</li>")
    parts.append("</ul>")

    parts.append("<h2>Epic-level notes</h2><ul>")
    for li in [
        "Overlapping panel-grow behaviour appears in HRREC-91948, HRREC-91980, HRREC-92001—consolidate grow/shrink events so email and SSP do not fork incompatible panel contracts.",
        "Unread/read stories (HRREC-91997–91999) should share one product decision on per-user vs shared read models before QA writes assertions.",
        "Send without attachments vs with attachments (HRREC-91994 vs HRREC-92036) should reuse the same disable-send and polling language to avoid divergent REST client behaviour.",
    ]:
        parts.append(f"<li>{html.escape(li)}</li>")
    parts.append("</ul>")

    parts.append("<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>")
    parts.append(
        "<p><strong>Hard disclaimers (verbatim intent):</strong> Same surface, different channel—consent, templates, media, delivery semantics, and failure modes differ. "
        "Different backend/OE: WhatsApp partner delivery is not the same as Workday email. Bugs in partner epics are inspiration only, not proof 2WE is broken.</p>"
    )
    parts.append(
        "<p><strong>Frozen pattern corpus:</strong> companion snapshot dated 2026-05-16 in repo file "
        "<code>docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md</code>; "
        "<strong>no live Jira pull for WhatsApp companion this run (manifest-only).</strong></p>"
    )
    parts.append("<ul>")
    for li in [
        "<strong>Merge / identity</strong> — WhatsApp merge pain (e.g. <code>HRREC-90306</code> excerpt) suggests asking whether email threads attribute participants correctly after duplicate resolution.",
        "<strong>Preview vs send hydration</strong> — <code>HRREC-84403</code> / <code>HRREC-89856</code> excerpts remind PMs to align recruiter-visible preview with what actually sends for email tokens.",
        "<strong>Composer guard rails</strong> — <code>HRREC-90268</code> / <code>HRREC-92062</code> excerpts translate to disabling double-send and in-flight typing for email compose.",
        "<strong>Silent failures</strong> — <code>HRREC-89979</code> excerpt warns against errors that only surface on send; email should fail fast when limits or consent block a thread.",
        "<strong>Consent chrome</strong> — <code>HRREC-89899</code> excerpt nudges email opt-in UI to hide broken terms links when tenant notifications lack configured text.",
    ]:
        parts.append(f"<li>{li}</li>")
    parts.append("</ul>")

    parts.append("<table><thead><tr>")
    for h in (
        "Story",
        "Gap Likelihood",
        "PM lens",
        "QA lens",
        "Dev lens",
        "Verdict",
        "Suggested missing BDD (Given/When/Then)",
    ):
        parts.append(f"<th>{html.escape(h)}</th>")
    parts.append("</tr></thead><tbody>")

    for key in ORDER:
        summ = SUMMARIES[key]["summary"]
        pm, qa, dev, ver, find, nxt, gap, bdd = row_cells(key)
        story_cell = (
            f'<a href="https://jira2.workday.com/browse/{html.escape(key)}">{html.escape(key)}</a><br/>'
            f"{html.escape(summ)}"
        )
        verdict_cell = f"{ver}<ul><li><strong>Finding:</strong> {html.escape(find)}</li>"
        verdict_cell += f"<li><strong>Recommended next step:</strong> {html.escape(nxt)}</li></ul>"
        gap_cell = macro(gap)

        parts.append(f"<tr><!-- gap-review {html.escape(key)} --><td>{story_cell}</td>")
        parts.append(f"<td>{gap_cell}</td>")
        parts.append(f"<td>{pm}</td>")
        parts.append(f"<td>{qa}</td>")
        parts.append(f"<td>{dev}</td>")
        parts.append(f"<td>{verdict_cell}</td>")
        parts.append(f"<td>{bdd}</td></tr>")

    parts.append("</tbody></table>")

    parts.append('<h2>Possible missing stories (suggestions only)</h2>')
    parts.append(
        "<p>Holistic suggestions only—no Jira creation. Derived from this run&rsquo;s HRREC-82977 Story text plus epic notes; external PRD not auto-loaded.</p>"
    )
    parts.append("<table><thead><tr>")
    for h in ("User Story", "Reason why this may be missing", "BDD scenarios"):
        parts.append(f"<th>{html.escape(h)}</th>")
    parts.append("</tr></thead><tbody>")
    holistic = [
        (
            "As a tenant admin, I want a single readiness dashboard for conversational email pilot vs SMS/WhatsApp, so I can see toggles, domains, and notification routing side by side.",
            "Stories cover individual toggles and notifications but no explicit cross-channel readiness checklist for admins.",
            "<p><strong>Scenario: Pilot readiness</strong></p><p><strong>Given</strong> email pilot is on and SMS remains on<br/><strong>When</strong> an admin opens a readiness view<br/><strong>Then</strong> conflicting routing or missing My Conversations domains are highlighted before recruiters work items.</p>",
        ),
        (
            "As a recruiter, I want mobile or narrow-width behaviour defined for 2-way email on the profile, so I am not blocked when hiring managers work from smaller screens.",
            "Several grow/width stories target desktop breakpoints; mobile parity is not explicit for email compose.",
            "<p><strong>Scenario: Narrow screen compose</strong></p><p><strong>Given</strong> a recruiter on an S breakpoint opens compose<br/><strong>When</strong> they attach files and scroll the RTE<br/><strong>Then</strong> controls remain reachable and send stays discoverable.</p>",
        ),
        (
            "As a compliance partner, I want an auditable map from email content fields to retention and DSAR handling, so legal can sign off beyond purge story bullets.",
            "Purge scope is named but cross-object retention alignment with broader recruiting data policies is not spelled out as its own slice.",
            "<p><strong>Scenario: DSAR trace</strong></p><p><strong>Given</strong> a DSAR targets a candidate with email threads<br/><strong>When</strong> privacy runs approved tasks<br/><strong>Then</strong> every recruiter-visible email artefact is accounted for in the runbook.</p>",
        ),
    ]
    for us, reason, b in holistic:
        parts.append("<tr>")
        parts.append(f"<td>{html.escape(us)}</td>")
        parts.append(f"<td>{html.escape(reason)}</td>")
        parts.append(f"<td>{b}</td>")
        parts.append("</tr>")
    parts.append("</tbody></table>")

    body = "\n".join(parts)
    Path(OUT).write_text(body, encoding="utf-8")
    print(OUT, len(body))


if __name__ == "__main__":
    main()
