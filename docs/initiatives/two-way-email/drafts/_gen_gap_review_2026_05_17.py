#!/usr/bin/env python3
"""One-off generator: HRREC-82977 gap review HTML for Confluence (2026-05-17 run)."""
import html


def status(title: str, colour: str) -> str:
    return (
        f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{title}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{colour}</ac:parameter>'
        f"</ac:structured-macro>"
    )


def jl(k: str) -> str:
    return f'<a href="https://jira2.workday.com/browse/{k}">{k}</a>'


SKB = "Salomon (Knowledge) — Batched NET-NEW HRREC-82977 query hit Message Builder Admin Guide, SES bounce/suppression runbooks, HRREC-90673 blank-body override precedent, HRREC-88799 PDT split, merge troubleshooting—tenant realism only."
SJI = "Salomon (Jira index) — Batched JQL (two-way / conversational email) returned adjacent init keys HRREC-91946/91948/91974/91979 plus in-epic siblings—dependency cross-check only."
SSL = "Salomon (Slack) — HRREC-82977 phrase archive returned noisy generic HRREC traffic; weak signal."
DA = "Deployment Agent — Batched: Work Email view security, SMTP defaults, template pairs, COI, avoid test domains; platform attachment limit stated 20 MB/file—reconcile with 30 MB total payload stories."
XO = "XO MCP — Not connected this session—no SUV metadata reads."
PN = "Peanut — Not queried — Tier B sweep."


def R(key, title, gt, gc, pm, qa, cr, bdd, vf1, vf2):
    rows.append(
        dict(
            key=key,
            title=title,
            gt=gt,
            gc=gc,
            pm=pm,
            qa=qa,
            cr=cr,
            bdd=bdd,
            vf1=vf1,
            vf2=vf2,
        )
    )


rows: list = []

R(
    "HRREC-91980",
    "Panel expand on Add",
    "Medium",
    "Blue",
    "Jira — One scenario; breakpoints/modal need design QA source of truth.",
    "Jira — Keyboard/focus/resize gaps.",
    "",
    "Add GWT for ESC, double Add click, boundary widths.",
    "Finding: Single happy-path scenario for a structural story.",
    "Recommended next step: Add edge GWT and align max width with 92001.",
)
R(
    "HRREC-91981",
    "Email task on SSP (init)",
    "Low",
    "Green",
    "Jira — Closed; visibility/hide scenarios adequate.",
    "Jira — Regression when toggles flip.",
    "",
    "Keep smoke when XO init toggles change.",
    "Finding: Well bounded init story.",
    "Recommended next step: Smoke in handoff checklist only.",
)
R(
    "HRREC-91983",
    "SSP growth/expansion",
    "Low",
    "Green",
    "Jira — Closed; narrow viewport + policy branches listed.",
    "Jira — 'If configurable' may be fiction—confirm.",
    "",
    "Name real tenant task or delete Scenario 3.",
    "Finding: Possible placeholder policy.",
    "Recommended next step: Confirm expansion toggle exists in product.",
)
R(
    "HRREC-91984",
    "Conversational email domain (XO)",
    "Medium",
    "Blue",
    "Jira — Closed; fail-closed security strong.",
    "Jira — Recruiter denial UX copy not specified.",
    "",
    "Add recruiter-visible message when domain missing.",
    "Finding: Security scenarios omit recruiter messaging.",
    "Recommended next step: Add denial copy + support path.",
)
R(
    "HRREC-91985",
    "Compose gated on opt-in + domain",
    "Low",
    "Green",
    "Jira — Hide vs view-only matrix clear.",
    "Jira — Mid-session consent flip not split.",
    "Cross-channel (WhatsApp backlog) — HRREC-84390: hide broken consent chrome when legal text missing—ask if email opt-in ever renders empty T&C (WhatsApp pattern only).",
    "Given consent changes while panel open, When recruiter taps Add, Then buttons refresh without stale enablement.",
    "Finding: Strong compliance framing.",
    "Recommended next step: Add live consent-change GWT.",
)
R(
    "HRREC-91986",
    "Panel toggle preserves draft",
    "Medium",
    "Blue",
    "Jira — Draft preservation; conflicts with no-server-draft notes elsewhere.",
    "Jira — Refresh/multi-tab not covered.",
    "Cross-channel (WhatsApp backlog) — HRREC-92062/90268: typing during send—define interaction with panel toggles (pattern only).",
    "Given send in flight, When recruiter collapses panel, Then define lock vs editable behaviour.",
    "Finding: Cross-story tension on draft persistence scope.",
    "Recommended next step: Document collapse behaviour during in-flight send.",
)
R(
    "HRREC-91987",
    "To/From/Subject chrome",
    "Medium",
    "Blue",
    "Jira — UI framework only.",
    "Jira — A11y for custom dropdowns missing.",
    "",
    "Add SR labels + empty-state affordances before Send story.",
    "Finding: Thin chrome story.",
    "Recommended next step: Attach a11y AC or merge with functional To/From stories.",
)
R(
    "HRREC-91988",
    "Attachments UI",
    "Medium",
    "Blue",
    "Jira — Client validation present.",
    "Jira — Explicit cross-ref to 91992 cumulative cap in DoR.",
    "",
    "Link UI-only vs send-path attachment stories in AC.",
    "Finding: Sibling dependency risk with 91992/92016.",
    "Recommended next step: Single attachment limits matrix in epic notes.",
)
R(
    "HRREC-91989",
    "RTE + Send/Discard chrome",
    "Low",
    "Green",
    "Jira — GenAI excluded—matches MVP boundary.",
    "Jira — Channel-specific toolbar exclusions incomplete.",
    "",
    "List disallowed toolbar actions for email channel explicitly.",
    "Finding: Good MVP scope guard.",
    "Recommended next step: Toolbar allowlist note for email.",
)
R(
    "HRREC-91990",
    "From list (OE configs)",
    "High",
    "Yellow",
    "Jira — Only one scenario.",
    "Jira — Empty list / mid-compose revocation gaps.",
    "Cross-channel (WhatsApp backlog) — HRREC-89778 CRF hydration scope—ask which security context builds From list (pattern only).",
    "Given zero From configs, When dropdown opens, Then actionable empty state.",
    "Finding: Under-specified happy path only.",
    "Recommended next step: Expand negative + OE failure paths.",
)
R(
    "HRREC-91991",
    "Hide tabs non-agency",
    "Medium",
    "Blue",
    "Jira — Direct apply UX clear.",
    "Jira — Agency removed after submit not covered.",
    "",
    "Given agency link removed retroactively, When panel reloads, Then tabs and threads reconcile.",
    "Finding: Common edge thinly covered.",
    "Recommended next step: Add retro agency removal scenario.",
)
R(
    "HRREC-91992",
    "Bad attachment blocking",
    "Low",
    "Green",
    "Jira — Strong negative paths.",
    "Jira — Virus path split with inbound 92016—tag relationship.",
    "",
    "Document who owns pre-upload scan vs server reject messaging.",
    "Finding: Solid recruiter-facing validation.",
    "Recommended next step: Cross-link inbound vs outbound attachment errors.",
)
R(
    "HRREC-91993",
    "Send-time validation",
    "Medium",
    "Blue",
    "Jira — Subject/To/multi-error flows covered.",
    "Jira — MB-required fields not integrated.",
    "",
    "Given MB marks field required, When Send, Then same alert pattern applies.",
    "Finding: Does not mention template-driven required fields.",
    "Recommended next step: Joint AC workshop with MB team.",
)
R(
    "HRREC-91994",
    "Send no attachments",
    "Medium",
    "Blue",
    "Jira — Polling for delayed visibility explicit.",
    "Jira — Async bounce vs Sent tag handoff to 92010 undefined.",
    "Cross-channel (WhatsApp backlog) — HRREC-90268 duplicate-send guard—confirm RTE path (pattern only).",
    "Given polling exhausts, When thread still empty, Then recoverable error.",
    "Finding: Good send path; weak failure tail.",
    "Recommended next step: Bind polling exhaustion UX.",
)
R(
    "HRREC-91995",
    "Discard on navigation",
    "High",
    "Yellow",
    "Jira — No server draft noted—align with 92004.",
    "Jira — In-app vs full navigation not split.",
    "",
    "Given in-app candidate tab switch only, When unsaved, Then confirm whether prompt appears.",
    "Finding: Data-loss risk on refresh path.",
    "Recommended next step: Copy review + navigation matrix.",
)
R(
    "HRREC-91996",
    "Discard button/Escape",
    "Medium",
    "Blue",
    "Jira — Empty editor fast path good.",
    "Jira — Escape bubbling from RTE unclear.",
    "",
    "Given RTE focused, When Escape, Then behaviour vs SSP close documented.",
    "Finding: Keyboard edge unspecified.",
    "Recommended next step: Add RTE focus GWT.",
)
R(
    "HRREC-91997",
    "Unread markers list",
    "High",
    "Yellow",
    "Jira — Colour-blind scenario present.",
    "Jira — Optimistic vs server mismatch not covered.",
    "Cross-channel (WhatsApp backlog) — HRREC-84407 read/unread timing—define email receipt promises vs UI (pattern only).",
    "Given cached list stale, When server disagrees, Then reconcile without flicker.",
    "Finding: Read model still ambiguous for teams.",
    "Recommended next step: Lock per-user vs shared read decision.",
)
R(
    "HRREC-91998",
    "Click row opens thread",
    "Medium",
    "Blue",
    "Jira — Empty thread case included.",
    "Jira — Long thread pagination absent.",
    "",
    "Given >N messages, When scroll top, Then paging loads with stable anchor.",
    "Finding: Basic list behaviour only.",
    "Recommended next step: Performance/pagination AC.",
)
R(
    "HRREC-91999",
    "Unread clears after full read",
    "High",
    "Yellow",
    "Jira — Scenario 3 defers concurrent recruiter model.",
    "Jira — Shared inbox confusion risk.",
    "",
    "Document chosen read model in AC before automation.",
    "Finding: Open product fork blocks QA depth.",
    "Recommended next step: PM decision memo + AC update.",
)
R(
    "HRREC-92000",
    "Read/reply loop",
    "Low",
    "Green",
    "Jira — Closed; MIME safe error present.",
    "Jira — Cross-check closed behaviour with 92014.",
    "",
    "Regression only in milestone suite.",
    "Finding: Closed with solid security note.",
    "Recommended next step: Keep in regression pack.",
)
R(
    "HRREC-92001",
    "Grow wide read view",
    "Medium",
    "Blue",
    "Jira — XL overlay rule explicit.",
    "Jira — Overlaps 91980 widths—duplicate risk.",
    "",
    "Epic single owner for max width constants.",
    "Finding: Structural overlap with Add-expand story.",
    "Recommended next step: Merge breakpoint tables.",
)
R(
    "HRREC-92002",
    "Thread styling Figma",
    "Medium",
    "Blue",
    "Jira — UI-only styling depends on real payloads.",
    "Jira — High-contrast theme not mentioned.",
    "",
    "Given high contrast theme, When thread renders, Then meet contrast targets.",
    "Finding: Style-only without accessibility targets.",
    "Recommended next step: Add contrast AC.",
)
R(
    "HRREC-92003",
    "Bounce diagnostics",
    "Low",
    "Green",
    "Jira — Six recruiter copy variants—strong.",
    "Jira — Internal code→copy matrix needs engineering sign-off.",
    "",
    "Add default for unknown SES subtype mapping.",
    "Finding: Rare mature copy matrix for early epic.",
    "Recommended next step: Engineering mapping workshop.",
)
R(
    "HRREC-92004",
    "REST send errors",
    "High",
    "Yellow",
    "Jira — Refresh loses draft—Doc note present.",
    "Jira — Idempotent retry policy for transient errors missing.",
    "Cross-channel (WhatsApp backlog) — HRREC-89979 silent failure: surface opt-out earlier if knowable (pattern only).",
    "Given HTTP 429, When Send, Then throttle message without blind refresh.",
    "Finding: Operational risk + data loss coupling.",
    "Recommended next step: Error taxonomy + copy workshop.",
)
R(
    "HRREC-92005",
    "Primary email changed / merge",
    "High",
    "Yellow",
    "Jira — Merge trigger explicit; KB merge articles support testing ideas.",
    "Jira — Agency thread unaffected not asserted negatively.",
    "Cross-channel (WhatsApp backlog) — HRREC-84389/90306 merge identity—verify email participant bindings (pattern only).",
    "Given parallel agency+candidate threads, When merge changes email, Then only impacted thread locks.",
    "Finding: High-impact identity edge.",
    "Recommended next step: Security matrix test plan.",
)
R(
    "HRREC-92006",
    "Candidate opt-out in-between",
    "High",
    "Yellow",
    "Jira — Thin transcript AC; re-opt-in vague.",
    "Jira — Candidate-visible comms out of scope but affects trust.",
    "",
    "Add recruiter banner AC when opt-out event arrives.",
    "Finding: Under-specified lifecycle state.",
    "Recommended next step: PM workshop on in-between semantics.",
)
R(
    "HRREC-92007",
    "Agency candidate tabs",
    "Medium",
    "Blue",
    "Jira — Default All + isolation intent good start.",
    "Jira — Only one scenario—empty threads missing.",
    "",
    "Given agency thread empty, When All tab, Then list composition rules stated.",
    "Finding: Needs sibling scenarios.",
    "Recommended next step: Expand empty/partial thread cases.",
)
R(
    "HRREC-92008",
    "Agency isolation security",
    "High",
    "Yellow",
    "Jira — IDOR test with 403/404—good seed.",
    "Jira — Search/notifications leak vectors not covered.",
    "",
    "Given agency global search, When query candidate, Then recruiter-only threads never appear.",
    "Finding: Strong security intent; surface coverage thin.",
    "Recommended next step: Threat-model pass with AppSec.",
)
R(
    "HRREC-92009",
    "Open+closed across tabs",
    "Medium",
    "Blue",
    "Jira — Independent lifecycles clear.",
    "Jira — Tab-level info copy consistency not required.",
    "Cross-channel (WhatsApp backlog) — HRREC-90243 lifecycle banner timing—show close banner on business event (pattern only).",
    "Align info strings with 92014 in copy deck.",
    "Finding: Behavioural complexity without copy contract.",
    "Recommended next step: Unified messaging spec across 92009/92014.",
)
R(
    "HRREC-92010",
    "Sent / Not Delivered tags",
    "Medium",
    "Blue",
    "Jira — Basic tags defined.",
    "Jira — Intermediate delayed state vs 9203 overlap.",
    "",
    "Define tag for SES delay vs hard fail.",
    "Finding: Delivery state machine overlaps bounce story.",
    "Recommended next step: Joint state diagram with 92003.",
)
R(
    "HRREC-92011",
    "PDT purge scope",
    "Very High",
    "Red",
    "Jira — Lists attachments in purge scope. Deployment Agent — This run's batched answer stated Recruiting Communications PDT does not purge attachments—contradicts story list; reconcile with platform/legal (see HRREC-52292 descriptions in Salomon KB trail).",
    "Jira — Purge fixture design blocked until scope truth is settled.",
    "",
    "Hold alignment: authoritative PDT scope vs HRREC-52292 descriptions.",
    "Finding: AC may contradict tenant purge guidance from Deployment Agent batch answer.",
    "Recommended next step: Engineering + legal truth on attachment objects before QE invests.",
)
R(
    "HRREC-92012",
    "Tenant lifecycle settings",
    "High",
    "Yellow",
    "Jira — Admin validation scenario exists.",
    "Jira — Scheduler observability/timezone edges missing.",
    "Cross-channel (WhatsApp backlog) — HRREC-84533/84534 expiry UI refresh—if timed closure, define recruiter notice cadence (pattern only).",
    "Add warning UI n days before hard close if product wants.",
    "Finding: Policy story needs operational observability.",
    "Recommended next step: Scheduler audit logging AC.",
)
R(
    "HRREC-92013",
    "Reporting exploratory",
    "Very High",
    "Red",
    "Jira — Placeholder only.",
    "Jira — No AC—regression blind spot.",
    "",
    "Replace with scoped tests or spike with matrix.",
    "Finding: Not build-ready.",
    "Recommended next step: Split into concrete reporting stories.",
)
R(
    "HRREC-92014",
    "Closed conversation UI",
    "Medium",
    "Blue",
    "Jira — Read-only history + hide actions clear.",
    "Jira — Inbound after terminal close not covered.",
    "",
    "Given inbound arrives post close, When recruiter opens thread, Then system message path defined.",
    "Finding: Closure finality stated; inbound tail missing.",
    "Recommended next step: Add post-close inbound GWT.",
)
R(
    "HRREC-92015",
    "Merge duplicate applications",
    "High",
    "Yellow",
    "Jira — Two scenarios; merge+email pause interplay.",
    "Jira — Which thread continues send not decided.",
    "Cross-channel (WhatsApp backlog) — HRREC-90306 wrong sender after merge—audit From keys (pattern only).",
    "Add decision tree for recruiter continuing a thread post-merge.",
    "Finding: Identity continuation ambiguous.",
    "Recommended next step: UX decision + negative matrix.",
)
R(
    "HRREC-92016",
    "Inbound attachment failures",
    "Medium",
    "Blue",
    "Jira — System messages for strip/virus/size inbound.",
    "Jira — Locale split between candidate/recruiter not stated.",
    "",
    "Define language policy for automated system lines.",
    "Finding: Solid inbound UX responsibilities.",
    "Recommended next step: i18n review with TRANMGMT.",
)
R(
    "HRREC-92017",
    "Forward (roadmap)",
    "Low",
    "Green",
    "Jira — Closed; MVP off documented.",
    "Jira — GA criteria future.",
    "",
    "None for MVP.",
    "Finding: Explicitly scoped out.",
    "Recommended next step: Roadmap doc only.",
)
R(
    "HRREC-92018",
    "Translations",
    "Low",
    "Green",
    "Jira — Closed; pseudo-loc scenario exists.",
    "Jira — Telemetry for missing bundles—privacy review.",
    "",
    "Confirm telemetry GDPR posture.",
    "Finding: Closed with i18n hygiene.",
    "Recommended next step: Privacy tick on telemetry.",
)


def main():
    parts = []
    parts.append("<h2>Executive summary (for PM)</h2><ul>")
    parts.append(
        "<li><strong>Jira ingest:</strong> <code>user-jira-ghe</code> unavailable (session error); "
        "used Salomon <code>jira_details_tool</code> fallback for all keys.</li>"
    )
    parts.append(
        "<li><strong>Run tier: B</strong> — 38 Stories; Salomon/Slack/Jira index + DA theme-batched (Epic-level notes). "
        "XO MCP not connected. Gap Likelihood = Verdict + BDD only.</li>"
    )
    parts.append("</ul>")
    parts.append("<h3>Top 5 gaps (epic)</h3><ul>")
    for x in [
        "PDT attachment scope vs Deployment Agent guidance (92011)—blocker-class alignment needed.",
        "Server-draft absence couples navigation/send errors to data loss (91995/91996/92004)—copy + flows workshop.",
        "Unread model fork (91997/91999) still open—decide before deep QA automation.",
        "Merge + email change + agency isolation—test as one security matrix (92015/92005/92008).",
        "92013 exploratory placeholder—reporting regression risk without AC.",
    ]:
        parts.append(f"<li>{html.escape(x)}</li>")
    parts.append("</ul><h3>Top 5 strengths (epic)</h3><ul>")
    for x in [
        "92003 bounce copy matrix is recruiter-ready.",
        "91985/91984 compliance gating is plain-language strong.",
        "92007–92009 + 92008 show clear agency confidentiality intent.",
        "91994 polling note reduces flaky send QA.",
        "92017/92018 explicitly closed or scoped—reduces noise.",
    ]:
        parts.append(f"<li>{html.escape(x)}</li>")
    parts.append("</ul>")
    parts.append("<h2>Epic-level notes</h2><ul>")
    parts.append(
        "<li>"
        + html.escape(
            "Tier B Salomon KB hits: Message Builder setup, SES bounce/suppression runbooks, "
            "HRREC-90673 blank-body Recruiting Communications override, HRREC-88799 PDT split, "
            "duplicate-merge troubleshooting, Recruiting Communications PDT Slack article."
        )
        + "</li>"
    )
    parts.append(
        "<li>"
        + html.escape(
            "Tier B Jira index JQL: project=HRREC text two-way/conversational email — "
            "surfacing HRREC-91946/91948/91974/91979 adjacent dependencies."
        )
        + "</li>"
    )
    parts.append(
        "<li>"
        + html.escape(
            "Tier B Slack: HRREC-82977 phrase archive noisy — weak signal."
        )
        + "</li>"
    )
    parts.append(
        "<li>"
        + html.escape(
            "Deployment Agent batch: Work Email security, SMTP defaults, template pairs, COI, test domains; "
            "20 MB/file attachment platform limit — reconcile with 30 MB total email payload stories."
        )
        + "</li>"
    )
    parts.append("</ul>")
    parts.append("<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>")
    parts.append(
        "<p><strong>Hard disclaimers:</strong> Same surface different channel; different backend/OE; "
        "bugs are signals not email defects; inspiration only—never parity claims.</p>"
    )
    parts.append(
        "<p><strong>Corpus line (manifest-only):</strong> Frozen corpus snapshot_as_of <strong>2026-05-16</strong> "
        "<code>WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md</code> manifest_complete true. "
        "<strong>No live WhatsApp Jira this run.</strong></p><ul>"
    )
    for t in [
        "HRREC-90268/92062 in-flight send guard — consider for email composer.",
        "HRREC-89979 fail-early vs on-send — consider for email resource limits.",
        "HRREC-84389/90306 merge identity — consider for email participant bindings.",
        "HRREC-84403/89856 preview vs send hydration — consider for MB email tokens.",
        "HRREC-89899/84390 hide broken consent UI — consider for email opt-in chrome.",
    ]:
        parts.append(f"<li>{html.escape(t)}</li>")
    parts.append("</ul><table><tbody>")
    parts.append(
        "<tr><th>Story</th><th>Gap Likelihood</th><th>Product (PM) lens</th>"
        "<th>Quality (QA) lens</th><th>Dev lens</th><th>Verdict</th><th>Suggested missing BDD</th></tr>"
    )
    for r in rows:
        pm = (
            f'<ul><li>{html.escape(r["pm"])}</li><li>{html.escape(SKB)}</li><li>{html.escape(DA)}</li>'
        )
        if r["cr"]:
            pm += f'<li>{html.escape(r["cr"])}</li>'
        pm += "</ul>"
        qa = (
            f'<ul><li>{html.escape(r["qa"])}</li><li>{html.escape(SJI)}</li><li>{html.escape(SSL)}</li></ul>'
        )
        dev = f"<ul><li>{html.escape(XO)}</li><li>{html.escape(PN)}</li></ul>"
        vf = (
            f"<ul><li>{html.escape(r['vf1'])}</li><li>{html.escape(r['vf2'])}</li></ul>"
        )
        bdd = f"<p>{html.escape(r['bdd'])}</p>"
        sc = f"<p>{jl(r['key'])} — {html.escape(r['title'])}</p>"
        parts.append(
            f'<!-- gap-review {r["key"]} --><tr><td>{sc}</td><td>{status(r["gt"], r["gc"])}</td>'
            f"<td>{pm}</td><td>{qa}</td><td>{dev}</td><td>{vf}</td><td>{bdd}</td></tr>"
        )
    parts.append("</tbody></table>")
    parts.append("<h2>Possible missing stories (suggestions only)</h2><table><tbody>")
    parts.append("<tr><th>Theme</th><th>Why it matters</th><th>Suggested story idea</th></tr>")
    for a, b, c in [
        ("Layout single source", "91980/92001/91983 overlap widths", "Spike: canonical SSP email breakpoints + z-order"),
        ("Notifications coherence", "Unread list relates to cross-surface notifications", "Story: Activity Stream / Timeline coherence with email unread (if in epic)"),
        ("PDT vs analytics", "Purge impacts reporting counts", "Child story: analytics after purge with conversational email rows"),
        ("Server drafts GA", "Local-only draft repeated", "Future epic: autosave—explicitly out of MVP unless reopened"),
    ]:
        parts.append(
            f"<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td><td>{html.escape(c)}</td></tr>"
        )
    parts.append("</tbody></table>")
    text = "\n".join(parts)
    path = "/Users/david.denham/product-manager-agent/docs/initiatives/two-way-email/drafts/gap_review_HRREC-82977_2026-05-17_run.html"
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(path, len(text))


if __name__ == "__main__":
    main()
