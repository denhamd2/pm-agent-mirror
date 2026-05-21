#!/usr/bin/env python3
"""Emit Storage HTML for HRREC-82977 Tier A gap review (2026-05-17 run).

Reads Jira text from gap_review_evidence_HRREC82977_2026-05-16.json (44 Stories).
Merges this-session Salomon KB + XO MCP notes from gap-review subagents.
Does not emit banned legacy tag strings.
"""
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EVIDENCE = ROOT / "gap_review_evidence_HRREC82977_2026-05-16.json"

# Session XO MCP + Salomon Internal Knowledge (paraphrase) per key — from 2026-05-17 subagent pulls
XO = {
    "HRREC-91946": "Conversational Email and Conversation classes surfaced; many hits were generic secured relationships, not a single recruiting-email task binding.",
    "HRREC-91948": "Sliding side panel WATS assets appeared; one search errored—confirm SSP grow/shrink events against SUV metadata for email compose.",
    "HRREC-91974": "conversationContextInstance layouts and REST checks exist—empty-state labels still need XO label container wiring confirmation for agency vs non-agency copy.",
    "HRREC-91975": "Candidate SMS Messages notification WATS loops dominate; conversational email may reuse categories—verify domain-driven My Conversations vs bell routing in metadata.",
    "HRREC-91978": "No crisp hit for a dedicated recruiting email channel toggle—admin enablement likely spans tenant tasks beyond generic toggles; engineering should name authoritative objects.",
    "HRREC-91979": "Conversation Write Access (146$157734) cited in story but direct class search errored—confirm REST contract for view-only vs send on conversationContext GET.",
    "HRREC-91980": "SSP sliding panel tests exist; no explicit XO hook named for grow-on-Add(email)—ask which layout emits grow/shrink events for messaging.",
    "HRREC-91982": "No YAML hits for two-way email recruit string—wide view/read path may be UI-layer until REST surfaces stabilise.",
    "HRREC-91985": "Message Builder and recruiting message searches were generic—opt-in gating likely crosses security domain evaluation rather than one class hit.",
    "HRREC-91986": "No SSP draft-state metadata found—draft persistence may be front-end only; confirm no remount wipes RTE state.",
    "HRREC-91987": "Message Builder convenience tasks only—custom To/From chrome must still align with MB validation contracts.",
    "HRREC-91988": "Attachment hits skewed to finance/OCR—not recruiting email attachment staging; confirm server limits vs UI-only story boundary.",
    "HRREC-91989": "Message Builder RTE references without SSP-specific instance—toolbar allowlist vs GenAI exclusion needs XO-backed config name.",
    "HRREC-91990": "Sender configuration recruiting search weak—From list likely OE-fed; confirm which service populates dropdown and failure modes.",
    "HRREC-91991": "No tab-scoping metadata—agency association likely job-application keyed; confirm REST filters for tab visibility.",
    "HRREC-91992": "Generic attachment relationships—not recruiter compose staging; align client validation with backend reject codes.",
    "HRREC-91993": "Feature toggle noise—inline validation may be UI rules; confirm MB-required fields integration with REST send pre-check.",
    "HRREC-91994": "REST error string search returned unrelated secured artefacts—send endpoint and idempotent disable-send belong in service layer review.",
    "HRREC-91995": "Discard/draft searches hit unrelated branding WATS—navigation guard likely app shell; confirm router hooks for SSP.",
    "HRREC-91996": "Same as 91995—Escape vs RTE focus order needs component-level spec, not XO class list.",
    "HRREC-91997": "Single boolean unread attribute—not a full thread read model—confirm per-user vs shared read in domain model.",
    "HRREC-91998": "My Conversations REST WATS loops confirm domain exists—thread fetch ordering should align with those security tests.",
    "HRREC-91999": "Mark-read WATS mostly non-recruiting—email read receipts vs bell unread may diverge; confirm product truth in metadata.",
    "HRREC-92001": "Sliding side panel masked-profile tests—wide view overlay should reuse same shell constraints as SMS/WhatsApp paths.",
    "HRREC-92002": "Conversation threads toggle unrelated—styling story depends on real message payloads from send/receive stories.",
    "HRREC-92003": "Email bounce snapshot / SES bounce ingestion tests exist—good downstream signal for mapping SES codes to UI copy.",
    "HRREC-92004": "REST recruiting search generic—error taxonomy should be defined beside transactional email services.",
    "HRREC-92005": "Primary Home Email WATS scenarios exist—merge/email-change pause should reuse person-email integrity checks.",
    "HRREC-92006": "Email opt-in/out REST scenarios found—opt-out in-between state should align with those service behaviours.",
    "HRREC-92007": "Recruiting agency typed fixtures exist—tab isolation is mostly UX/REST filtering; confirm agency role resolution endpoints.",
    "HRREC-92008": "Agency conversation security not a single XO class—IDOR prevention is REST + security policy led.",
    "HRREC-92009": "Lifecycle secured relationships generic—tab-level active/closed likely derives from conversation status fields.",
    "HRREC-92010": "Delivery status tags need Conversation Message class family—hits included Conversation Message / Status classes.",
    "HRREC-92011": "Recruiting Communications purge search returned empty YAML—purge scope must be validated with platform purge owners, not inferred from XO search alone.",
    "HRREC-92012": "Tenant Setup numeric attribute Days of Open Candidate Conversation After Disposition surfaced—good anchor for scheduler story.",
    "HRREC-92013": "No targeted reporting XO—exploratory story should not pretend SUV metadata coverage.",
    "HRREC-92014": "Conversation Message classes listed—terminal close likely maps to message status; confirm closed thread inbound handling.",
    "HRREC-92015": "Duplicate Candidate / Duplicate Resolution searches empty—merge thread continuity is a data model question for engineering.",
    "HRREC-92016": "Resume Attachment hits generic—virus scan surfacing is ingestion pipeline, not resume attachment class.",
    "HRREC-92022": "My Conversations REST WATS and security provisioning loops—small refactor should cite these existing domains.",
    "HRREC-92029": "Recruiting Agency User method bindings found—agency send path should reuse established person resolution.",
    "HRREC-92030": "Candidate Email class (1$19634) found—To list should bind to candidate email instances with correct security evaluation.",
    "HRREC-92035": "Activity Stream searches noisy—triple logging story needs integration test matrix more than XO search hits.",
    "HRREC-92036": "Blob WATS variable containers—not recruiter attachment send—confirm Blobatory payload contract with messaging service.",
}
SAL = {
    "HRREC-91946": "Internal articles still mix SMS two-way patterns with recruiting email expectations—call out customer education risk when ordering SSP tasks.",
    "HRREC-91948": "SSP acronym collision with statutory sick pay in some KB hits—keep UX copy distinct in admin comms.",
    "HRREC-91974": "Prior conversational channel KB stresses inconsistent mobile/desktop panels—empty state copy should be tested on both.",
    "HRREC-91975": "KB highlights Candidate SMS Messages routing name reused for email—tenant admin labelling and override rules need PM clarity.",
    "HRREC-91978": "KB mixes unrelated email-domain toggles with staffing channel governance—avoid conflating knobs in enablement guides.",
    "HRREC-91979": "KB warns view-only recruiters may still get notifications—align bell/My Conversations noise with domain split.",
    "HRREC-91980": "KB notes consolidated email transcript pain—grow-on-compose must not desynchronise from candidate context switching.",
    "HRREC-91982": "KB references masked-profile defects in messaging shells—wide read view should inherit masking parity tests.",
    "HRREC-91985": "KB emphasises opt-in/out and automated mail distinction—consent gating must stay aligned with notification templates.",
    "HRREC-91986": "KB flags HRREC ownership for messaging regressions—draft persistence is a credibility hotspot for recruiters.",
    "HRREC-91987": "KB shows Message Builder admin tasks heavily—custom header chrome must not drift from MB validation contracts.",
    "HRREC-91988": "KB mixes attachment visibility FAQs—recruiter-only vs candidate-visible attachments need explicit AC.",
    "HRREC-91989": "KB mentions RTE modernisation cross-dependencies—toolbar exclusions need accessibility parity checks.",
    "HRREC-91990": "KB surfaces deliverability and suppression sensitivities—From list should communicate no-reply vs personal consequences.",
    "HRREC-91991": "KB warns agency association is per application—tab hiding rules must be keyed to the focal job application.",
    "HRREC-91992": "KB notes routing ownership for candidate two-way messaging—attachment limits should cite platform mail payload caps.",
    "HRREC-91993": "KB references Send Message template CRF drift—align required-field validation with MB for email.",
    "HRREC-91994": "KB cautions tenant SMS redirect clashes causing flaky sends—polling design should avoid silent hangs analogous to SMS incidents.",
    "HRREC-91995": "KB shows discard modal precedents outside recruiting—navigation matrix still needs recruiting-specific router behaviour.",
    "HRREC-91996": "KB emphasises accessibility on discard flows—Escape handling must not trap recruiters.",
    "HRREC-91997": "KB highlights unread marker inconsistencies in other surfaces—define colour-plus-shape policy up front.",
    "HRREC-91998": "KB stresses email threading vs SMS numbering—chronological preview should state ordering rules under load.",
    "HRREC-91999": "KB sparse on shared inbox read models—decide per-user vs shared before automation spend.",
    "HRREC-92001": "KB notes hire/opt-in timing quirks for messaging visibility—overlay behaviour should respect suppressed messaging states.",
    "HRREC-92002": "KB references masked SMS obstruction—styling-only story still needs contrast targets.",
    "HRREC-92003": "KB reinforces bounce/suppression literacy—pair copy matrix with admin comms expectations.",
    "HRREC-92004": "KB cites REST payload quirks—mid-session opt-out should mirror honest error parsing guidance.",
    "HRREC-92005": "KB warns merge and email-order defects—identity continuity after merge is a known customer pain theme.",
    "HRREC-92006": "KB shows duplicate opt-in records can deadlock admin—opt-out in-between state needs data rules, not only UI.",
    "HRREC-92007": "KB highlights agency-submit edge cases—tab streams must not stitch cancelled artefacts.",
    "HRREC-92008": "KB reiterates HRREC ownership for conversational defects—agency confidentiality should get threat-model time.",
    "HRREC-92009": "KB references closed-conversation analytics behaviour—align unread and lifecycle counters across tabs.",
    "HRREC-92010": "KB notes recruiter-facing send/receive inconsistencies—Sent vs Not Delivered must tie to bounce taxonomy.",
    "HRREC-92011": "KB/admin expectations: purge breadth is compliance-critical—attachments and notification artefacts need authoritative scope confirmation.",
    "HRREC-92012": "KB cites tenant disposition-day knob—validate against story’s proposed hard cap and scheduler observability.",
    "HRREC-92013": "KB shows reporting regressions when channels land—exploratory placeholder should become explicit regression matrix.",
    "HRREC-92014": "KB references SMS closure bugs crossing channels—email terminal close should define post-close inbound behaviour.",
    "HRREC-92015": "KB underscores merge fallout on campaigns and profiles—pick survivor thread rules before QA scales.",
    "HRREC-92016": "KB differentiates attachment transports—system lines for blocked inbound must match ingestion contract.",
    "HRREC-92022": "KB notes My Conversations REST is API-heavy—refactor needs OE PM alignment called out in story.",
    "HRREC-92029": "KB warns agency questionnaire and non-rescindable submits—send-time validation must stay strict for candidates only.",
    "HRREC-92030": "KB reiterates work/home email hierarchy—To list labels must avoid misleading duplicate addresses.",
    "HRREC-92035": "KB distinguishes Activity Stream maintenance vs BP history—triple logging needs curator guidance.",
    "HRREC-92036": "KB references attachment-capable Send Message precedents—Blobatory IDs should be validated against platform limits.",
}

XO = {k: (v[:72] + "…") if len(v) > 72 else v for k, v in XO.items()}
SAL = {k: (v[:76] + "…") if len(v) > 76 else v for k, v in SAL.items()}

WA_MAP = {
    "HRREC-91985": "89899",
    "HRREC-91987": "84403",
    "HRREC-91990": "89778",
    "HRREC-91994": "90268",
    "HRREC-91986": "92062",
    "HRREC-91996": "92062",
    "HRREC-92003": "84406",
    "HRREC-92004": "89979",
    "HRREC-92005": "90306",
    "HRREC-92009": "90243",
    "HRREC-92010": "84407",
    "HRREC-92011": "84388",
    "HRREC-92012": "84533",
    "HRREC-92015": "90306",
}


def status_macro(title: str) -> str:
    colour = {"Very High": "Red", "High": "Yellow", "Medium": "Blue", "Low": "Green", "Very Low": "Grey"}[title]
    return (
        f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{title}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{colour}</ac:parameter>'
        f"</ac:structured-macro>"
    )


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def pick_gap(key: str, summary: str, desc: str) -> tuple[str, str, str, str, str, str]:
    """Return gap_title, gap_colour, verdict_label, finding, rec, bdd_html"""
    d = (desc or "").lower()
    thin = len(desc or "") < 500 and "scenario" not in d

    if key == "HRREC-92013":
        return (
            "Very High",
            "Red",
            "🔴 Very High",
            "Exploratory placeholder without scenarios blocks sizing and regression design.",
            "Split into concrete reporting stories or add a time-boxed spike with an explicit test matrix.",
            "<p><strong>Scenario: Reporting smoke matrix</strong></p><p><strong>Given</strong> outbound and inbound emails with attachments across candidate and agency threads<br/><strong>When</strong> recruiters open Activity Stream, Timeline, and Candidate Communications report<br/><strong>Then</strong> each surface shows consistent sender, subject, timestamps, and attachment metadata without duplicate or missing rows.</p>",
        )
    if key == "HRREC-92011":
        return (
            "Very High",
            "Red",
            "🔴 Very High",
            "Purge scope lists conversational bodies and attachments while tenant guidance in this run’s Deployment Agent pass lacked a detailed Recruiting Communications PDT recipe—legal/product alignment is still a gating question.",
            "Run a short workshop with Privacy + platform purge owners to lock which objects delete, then reflect the authoritative list in AC before QA invests.",
            "<p><strong>Scenario: Purge verification sample</strong></p><p><strong>Given</strong> a sandbox candidate/job application with email threads and attachments logged<br/><strong>When</strong> a privacy admin runs the agreed Recruiting Communications purge path<br/><strong>Then</strong> authorised recruiters no longer see purged bodies or attachments in the panel while audit expectations for retained metadata are documented.</p>",
        )
    if "???" in (desc or "") or thin:
        return (
            "High",
            "Yellow",
            "🟡 High",
            "Jira still carries explicit unknowns or thin scenarios for this slice—refinement should answer them before hard sizing.",
            "Tighten AC with UX/security decisions called out in the description, then re-review dependencies.",
            "<p><strong>Scenario: Close the open design question</strong></p><p><strong>Given</strong> the ambiguous state described in Jira<br/><strong>When</strong> PM and engineering agree the expected behaviour<br/><strong>Then</strong> scenarios are updated with recruiter-visible outcomes and negative paths.</p>",
        )
    if "merge" in d and key == "HRREC-92015":
        return (
            "High",
            "Yellow",
            "🟡 High",
            "Merge plus email identity is a high-risk area; WhatsApp companion work on wrong sender after merge signals a translation test for email participant binding (HRREC-90306).",
            "Document which thread survives for continued sends and add a merge-matrix test plan shared with data engineering.",
            "<p><strong>Scenario: Merge survivor send path</strong></p><p><strong>Given</strong> two applications on the same requisition merged while both had email threads<br/><strong>When</strong> the recruiter resumes sending<br/><strong>Then</strong> outbound mail attributes the surviving person and threads remain selectable without stale addresses.</p>",
        )
    if "merge" in d and key == "HRREC-92005":
        return (
            "High",
            "Yellow",
            "🟡 High",
            "Primary email changes mid-thread can strand recruiters; WhatsApp merge identity notes (HRREC-90306) suggest you validate participant records after profile merge, not only address text.",
            "Pair with 92015 for a single merge-and-email matrix so QA does not split ownership.",
            "<p><strong>Scenario: Agency thread unaffected</strong></p><p><strong>Given</strong> parallel candidate and agency threads exist<br/><strong>When</strong> a merge changes only the candidate primary email<br/><strong>Then</strong> agency thread controls stay unchanged and candidate thread shows the informational lock without cross-tab leakage.</p>",
        )
    if key in ("HRREC-91997", "HRREC-91999"):
        bdd = (
            "<p><strong>Scenario: Concurrent recruiter read</strong></p><p><strong>Given</strong> two recruiters share inbox access on the same thread<br/>"
            "<strong>When</strong> one opens a message fully<br/><strong>Then</strong> the second recruiter’s unread marker updates per the agreed model without flicker.</p>"
        )
        if key == "HRREC-91999":
            bdd = (
                "<p><strong>Scenario: Peek vs full read for 91999</strong></p><p><strong>Given</strong> policy requires a full read to clear unread<br/>"
                "<strong>When</strong> a recruiter only peeks using the interaction defined in Jira<br/><strong>Then</strong> unread markers remain until the full-read criteria are satisfied.</p>"
            )
        return (
            "High",
            "Yellow",
            "🟡 High",
            "Unread/read policy still forks across concurrent recruiters—product decision is gating test depth.",
            "Publish the chosen per-user vs shared read model in Jira, then align list markers and notifications to that decision.",
            bdd,
        )
    if "discard" in d or "navigation" in d:
        return (
            "Medium",
            "Blue",
            "🔵 Medium",
            "Local-only drafts plus navigation warnings create credible data-loss confusion if copy is inconsistent across stories.",
            "Align discard/navigation strings with the REST error story so recruiters get one coherent save-or-lose story.",
            f"<p><strong>Scenario: {key} — discard guard</strong></p><p><strong>Given</strong> an unsent draft exists in this compose surface<br/><strong>When</strong> the recruiter attempts the navigation or keyboard action described for {key}<br/><strong>Then</strong> discard or preserve behaviour matches the single matrix agreed with UX for this milestone.</p>",
        )
    if "bounce" in d or "not delivered" in d:
        return (
            "Low",
            "Green",
            "🟢 Low",
            "Bounce and delivery diagnostics are comparatively well enumerated—remaining risk is engineering mapping of rare SES codes.",
            "Run a short copy/engineering table review for edge codes not named in Jira, then freeze for MVP.",
            f"<p>No additional BDD suggested for {key} beyond the SES subtype matrix already captured in Jira—only add rows if engineering surfaces new bounce codes.</p>",
        )
    return (
        "Medium",
        "Blue",
        "🔵 Medium",
        f"Scenarios for {key} are directionally useful but still overlap neighbouring SSP sizing, draft, or notification stories—tighten ownership in refinement.",
        "Schedule a milestone pass that lists dependent keys beside each scenario block so sizing does not double-count the same risk.",
        f"<p><strong>Scenario: {key} — adjacent-flow consistency</strong></p>"
        f"<p><strong>Given</strong> this story’s acceptance criteria are marked ready<br/>"
        f"<strong>When</strong> a recruiter runs the neighbouring compose, send, or read stories in the same sandbox session<br/>"
        f"<strong>Then</strong> behaviours documented for {key} still hold without contradicting the latest dependency notes in Jira.</p>",
    )


def main() -> None:
    data = json.loads(EVIDENCE.read_text(encoding="utf-8"))
    issues = data["issues"]

    preface = (
        "<h2>Executive summary (for PM)</h2>"
        "<ul>"
        "<li><strong>Run tier:</strong> A (full contract). <strong>Gap Likelihood</strong> reflects Verdict + suggested missing BDD only.</li>"
        "<li><strong>Jira ingest:</strong> Primary bodies from repo evidence JSON dated 2026-05-16; Salomon <code>jira_details_tool</code> + epic JQL re-checked 2026-05-17 for key inventory. "
        "<code>user-jira-ghe</code> <code>getTicketDetails</code> returned session errors this run—Salomon remained the live fallback.</li>"
        "</ul>"
        "<h3>Top 5 gaps (epic)</h3><ul>"
        "<li>Purge and reporting stories (92011, 92013) need authoritative platform scope before QA scales.</li>"
        "<li>Unread/read and concurrent recruiter models (91997, 91999) still fork—decide product truth before automation.</li>"
        "<li>Merge plus identity (92005, 92015) needs one shared matrix before QA scales duplicate scenarios.</li>"
        "<li>Draft is local-only across discard/navigation/REST error stories—copy and router hooks must tell one data-loss story.</li>"
        "</ul>"
        "<h3>Top 5 strengths (epic)</h3><ul>"
        "<li>Bounce copy matrix (92003) is unusually mature for an early epic.</li>"
        "<li>Agency confidentiality story (92008) seeds a real IDOR security scenario.</li>"
        "<li>Opt-in and domain gating (91985, 91979) are written in plain compliance language.</li>"
        "<li>Send with polling and double-send guard (91994) shows operational awareness.</li>"
        "<li>Tenant lifecycle knobs (92012) anchor to an actual numeric tenant attribute in XO search.</li>"
        "</ul>"
        "<h2>Epic-level notes</h2><ul>"
        "<li>Overlapping SSP grow/width behaviour appears across 91948, 91980, 92001—pick a single breakpoint owner.</li>"
        "<li>Attachment stories split UI-only, outbound validation, inbound malware—keep error ownership explicit between recruiter vs candidate views.</li>"
        "<li>My Conversations vs bell routing for inbound replies (91975) should be validated against Edit Tenant Setup – Notifications guidance for conversational messaging.</li>"
        "</ul>"
    )

    companion = (
        '<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>'
        "<p><strong>Hard disclaimers:</strong> Same surface, different channel; different backend/OE; bugs are delivery pain signals for WhatsApp, not proof email is broken; inspiration only—never parity claims.</p>"
        "<p><strong>Corpus line (manifest-only):</strong> Frozen pattern corpus dated <strong>2026-05-16</strong> in repo reference file for companion WhatsApp Story+Bug keys. "
        "<strong>No live WhatsApp Jira pull</strong> for companion keys this run.</p>"
        "<ul>"
        "<li>HRREC-90268 / HRREC-92062 — disable send / block typing while send is in flight: ask whether email compose disables input during REST in flight.</li>"
        "<li>HRREC-89979 — fail-early vs silent-until-send on limits: ask whether email surfaces resource limits when opening compose, not only on send.</li>"
        "<li>HRREC-90306 / HRREC-84389 — merge identity: ask whether email participant/from lines survive duplicate merge cleanly.</li>"
        "</ul>"
    )

    thead = (
        "<table><thead><tr>"
        "<th>Story</th><th>Gap Likelihood</th><th>PM lens</th><th>QA lens</th><th>Dev lens</th><th>Verdict</th>"
        "<th>Suggested missing BDD (Given/When/Then)</th>"
        "</tr></thead><tbody>"
    )
    rows = [thead]

    for issue in issues:
        key = issue["key"]
        summary = issue.get("summary") or ""
        desc = issue.get("description") or ""
        wa = WA_MAP.get(key)
        xo = XO.get(key, "XO MCP search did not return a narrow recruiting-email hit; treat as engineering confirmation item for this slice.")
        sal = SAL.get(key, "Salomon retrieval did not surface a crisp on-point article—still note routing ownership to candidate two-way messaging when defects appear.")

        pm = (
            f"{esc(summary[:80])}… {esc(sal[:80])} "
        )
        if wa:
            pm += (
                f"Consider a translation question from WhatsApp companion work (HRREC-{wa}) for email-only behaviour—do not assume channel parity. "
            )
        pm += "[Salomon]"
        if wa:
            pm += f" [WhatsApp companion: HRREC-{wa}]"
        if "notification" in desc.lower() or "my conversations" in desc.lower() or "bell" in desc.lower():
            pm += " Deployment Agent noted conversational reply routing may still be configured under legacy SMS-named notification types—confirm admin-facing copy for email. [DA]"
        pm = f"<p>{pm}</p>"

        focus = esc((summary or "").replace("PH:", "").strip()[:100])
        qa = (
            f"Story focus — {focus}: watch for recruiter-visible breaks where the UI promises a state the scenarios do not yet bind to a backend outcome "
            f"(slow network, mid-session permission loss, tab switches). [Jira]"
        )
        if wa:
            qa += (
                " Salomon Jira index on companion keys still shows active or historical WhatsApp delivery and merge issues—use them only as inspiration for email edge cases, not as proof of email defects. "
                "[Salomon Jira]"
            )
            qa += " Salomon Slack did not return substantive threads on the cited companion keys in this archive pass. [Salomon Slack]"

        dev = f"{esc((xo or '')[:160])} Confirm bindings with engineering before sizing. [XO MCP]"
        if key == "HRREC-92015" and wa:
            dev += (
                " Peanut on HRREC-90306 shows merge-related commits across two-way-messaging and hrrec repos—ask whether the SMS merge-sender fix path should be reviewed for conversational email participant resolution. [Peanut]"
            )

        gtitle, gcol, vlabel, find, rec, bdd = pick_gap(key, summary, desc)
        verdict = (
            f"<p>{esc(vlabel)}</p><ul>"
            f"<li><strong>Finding:</strong> {esc(find)}</li>"
            f"<li><strong>Recommended next step:</strong> {esc(rec)}</li>"
            "</ul>"
        )

        story_cell = (
            f'<tr><!-- gap-review {key} --><td><p><a href="https://jira2.workday.com/browse/{key}">{key}</a><br/>{esc(summary)}</p></td>'
            f"<td>{status_macro(gtitle)}</td>"
            f"<td>{pm}</td>"
            f"<td><p>{qa}</p></td>"
            f"<td><p>{dev}</p></td>"
            f"<td>{verdict}</td>"
            f"<td>{bdd}</td></tr>"
        )
        rows.append(story_cell)

    rows.append("</tbody></table>")

    holistic = (
        '<h2>Possible missing stories (suggestions only)</h2>'
        "<p>Holistic suggestions only—this skill does not create Jira tickets. PRD was not auto-loaded for this generator run; ideas are Jira- and epic-narrative grounded.</p>"
        "<table><thead><tr><th>Theme</th><th>Why it matters</th><th>Suggested story idea</th></tr></thead><tbody>"
        "<tr><td>Autosave / server drafts</td><td>Multiple stories assume local-only drafts</td><td>Future epic: optional autosave once REST supports it—explicitly out of MVP unless reopened</td></tr>"
        "<tr><td>Search / global discovery</td><td>92008 covers direct ID but not global search leakage</td><td>Spike: recruiter global search and notification deep links never surface agency-isolated threads in error</td></tr>"
        "<tr><td>Admin comms naming</td><td>Tenant admins configure conversational routing under SMS-named types</td><td>Enablement story: rename or dual-label notification configuration tasks for email-inclusive wording</td></tr>"
        "</tbody></table>"
    )

    title = "Net-New Story Gap Review — 2026-05-17 (HRREC-82977, Tier A)"
    body = preface + companion + "".join(rows) + holistic
    print(body)
    # Title echoed for MCP wrapper
    print("<!--TITLE:" + title + "-->")


if __name__ == "__main__":
    main()
