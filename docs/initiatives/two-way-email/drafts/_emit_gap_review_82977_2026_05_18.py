#!/usr/bin/env python3
"""One-off emitter: HRREC-82977 gap review HTML for 2026-05-18 Tier B + XO outage."""
from __future__ import annotations

import html
import pathlib

OUT = pathlib.Path(__file__).with_name("gap_review_HRREC82977_2026-05-18_publish.html")

STORIES: list[tuple[str, str, str]] = [
    ("HRREC-91946", "[Initialisation] Recruiter can see Email Task on SSP (XO Only)", "init"),
    ("HRREC-91948", "[Initialisation] Enabled SSP Growth/Expansion", "shell"),
    ("HRREC-91974", "PH: Recruiter sees Empty state of email task if opened", "empty"),
    ("HRREC-91975", "PH: Recruiter receives a notification", "notify"),
    ("HRREC-91978", "PH: Admin can enable or disable 2-way email as a comms channel", "admin"),
    ("HRREC-91979", "PH: Recruiter does not have access to the compose email task", "sec"),
    ("HRREC-91980", "PH: Recruiter sees the panel expand when clicking Add to compose an email", "ux"),
    ("HRREC-91982", "PH: Recruiter opens the message to read and reply", "read"),
    ("HRREC-91985", "PH: Recruiter can compose an email to non-agency candidate", "compose"),
    ("HRREC-91986", "PH: Recruiter expands/collapses the panel to check candidate profile (context stays?)", "draft"),
    ("HRREC-91987", "PH: Recruiter can select To, From & Subject (UI) when composing an email", "header"),
    ("HRREC-91988", "PH: Recruiter attaches documents (UI only)", "attach"),
    ("HRREC-91989", "PH: Recruiter can use the RTE & see the UI of buttons", "rte"),
    ("HRREC-91990", "PH: Recruiter can select From address from list of valid email addresses", "from"),
    ("HRREC-91991", "PH: Recruiter does not see any tabs for non-agency candidate", "tabs"),
    ("HRREC-91992", "PH: Recruiter attaches non-supported files", "badatt"),
    ("HRREC-91993", "PH: Recruiter sees UI error validations on Send", "val"),
    ("HRREC-91994", "PH: Send Message (No Attachments)", "send"),
    ("HRREC-91995", "PH: Recruiter gets discard popup by changing pages", "discard"),
    ("HRREC-91996", "PH: Recruiter gets discard popup when they click the Discard button", "discard2"),
    ("HRREC-91997", "PH: Recruiter sees list of messages with unread ones marked in blue", "unread"),
    ("HRREC-91998", "PH: Recruiter can see message threads when clicking on a message", "thread"),
    ("HRREC-91999", "PH: Recruiter sees blue \"unread marker\" removed after clicking in the view a message in full", "readst"),
    ("HRREC-92001", "PH: Recruiter sees the panel expand & views full message when clicking the grow button or clicking a single message", "grow"),
    ("HRREC-92002", "PH: Style only - Recruiter sees messages showing, styled as per figma", "style"),
    ("HRREC-92003", "PH: Recruiter sees error messages if their email has bounced", "bounce"),
    ("HRREC-92004", "PH: Recruiter sees error when sending message (REST error)", "rest"),
    ("HRREC-92005", "PH: Recruiter sees info message and cannot send email if the candidate changes their email", "emailchg"),
    ("HRREC-92006", "PH: Candidates opt-out of receiving emails", "optout"),
    ("HRREC-92007", "PH: Recruiter can switch between tabs for candidate and agency comms", "agencytab"),
    ("HRREC-92008", "PH: Agency cannot see recruiter conversation", "isol"),
    ("HRREC-92009", "PH: Recruiter can see both closed and non-closed conversation in the same panel if one conversation is still active", "lifecycle"),
    ("HRREC-92010", "PH: Recruiter sees tags on messages showing updating state (sent, not delivered)", "tags"),
    ("HRREC-92011", "PH: Privacy Admin purges PDTs for 2-way email - Candidate/Job App", "purge"),
    ("HRREC-92012", "PH: Admin can configure conversation lifecycle tenant setting?", "lifeadmin"),
    ("HRREC-92013", "PH: Existing reporting features are not broken", "report"),
    ("HRREC-92014", "PH: Recruiter cannot see reply, or Add button when both conversations are closed & sees info message? that convo is closed", "closed"),
    ("HRREC-92015", "PH: Candidate has 2 applications to the same JR and gets merged", "merge"),
    ("HRREC-92016", "PH: Candidate attaches non-supported files", "cinatt"),
    ("HRREC-92022", "PH: My Conversations will require an XO (small) refactor", "mc"),
    ("HRREC-92029", "PH: Recruiter can compose an email to agency user or agency candidate", "agencycmp"),
    ("HRREC-92030", "PH: Recruiter can select To address from list of valid email addresses", "to"),
    ("HRREC-92035", "PH: Email communications are visible in Activity Stream, Timeline and Candidate Communications", "audit"),
    ("HRREC-92036", "PH: Send Message (With Attachments)", "sendatt"),
]


def status(title: str, colour: str) -> str:
    return (
        '<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="title">{title}</ac:parameter>'
        f'<ac:parameter ac:name="colour">{colour}</ac:parameter>'
        "</ac:structured-macro>"
    )


def row(key: str, summary: str, tag: str) -> str:
    esc_s = html.escape(summary)
    # Tier B: story-keyed one-liners; Salomon/DA from themed KB + DA thread; no XO hits (outage).
    pm = {
        "init": f"The SSP email task should appear in the right order with icon and tooltip once other side-panel tasks are visible; confirm final header copy with design before sign-off. [Functional knowledge: CONTEXT.md; Salomon; DA]",
        "shell": f"Wide-panel growth must stay consistent with other side-panel tasks so recruiters are not surprised by width or shadow when email is not open. [Functional knowledge: CONTEXT.md; Salomon; DA]",
        "empty": f"First-open empty state needs clear next step and naming alignment for the conversational email header so recruiters know how to start a thread. [Functional knowledge: CONTEXT.md; Salomon; DA]",
        "notify": f"Inbound replies should surface where busy recruiters already look; align story language with tenant notification routing and training so email prompts land reliably. [Salomon; DA]",
        "admin": f"Channel toggle should read as rollout control: document what recruiters still see mid-flight when admins flip the switch during drafts. [DA]",
        "sec": f"View-only recruiters must never see affordances they cannot use; pair REST gate messaging with plain-language empty states for read-only paths. [DA]",
        "ux": f"Expand-on-Add should match modal shadow behaviour from the SSP growth story so two gestures do not fight. [Epic scan; DA]",
        "read": f"Wide read/reply must preserve attribution when switching from narrow list; clarify what happens if the candidate replies while the panel is collapsed. [Epic scan; DA]",
        "compose": f"Opt-in and domain checks belong at send-time for agency paths elsewhere in the epic—call out how this non-agency slice stays consistent. [Epic scan; DA]",
        "draft": f"Profile peek while composing is high-risk for silent draft loss; scenarios need explicit collapse/expand timing versus discard rules. [DA]",
        "header": f"Custom To/From chrome must stay in sync with future send validation and Message Builder channel limits—avoid duplicating conflicting rules in UI-only stories. [Salomon; DA]",
        "attach": f"UI-only attachment pills still need a contract for max count and failure copy when server rejects after send sibling stories wire REST. [Epic scan; DA]",
        "rte": f"Toolbar scope (GenAI excluded per AC) should be mirrored in admin comms so trainers do not promise tools recruiters will not see. [Salomon; DA]",
        "from": f"From-address list drives reply routing expectations; document recruiter-facing explanation when no-reply vs personal sender is chosen. [DA]",
        "tabs": f"Hiding tabs for direct applies must not hide agency-only affordances on misclassified applications—tighten data preconditions in refinement. [Epic scan; DA]",
        "badatt": f"Client blocks must line up with server-side rejection taxonomy so recruiters do not see different errors pre- vs post-send. [Epic scan; DA]",
        "val": f"Aggregate error banner should map cleanly to field-level fixes so recruiters are not stuck in a loop of blind retries. [DA]",
        "send": f"Polling for delayed thread visibility should have backoff and failure copy so recruiters do not assume duplicate sends when the thread lags. [Epic scan; DA]",
        "discard": f"Navigation discard depends on local-only drafts per notes—state the data-loss risk explicitly in release notes and training. [DA]",
        "discard2": f"Escape-key parity with Discard must not fight browser shortcuts on certain OS layouts—capture in UX review. [DA]",
        "unread": f"Blue unread markers need a non-colour cue per AC; align with accessibility review for dense lists. [DA]",
        "thread": f"Empty-reply thread state should mirror bounce and error stories so the list never shows phantom inbound. [Epic scan; DA]",
        "readst": f"Per-user vs shared read model in Scenario 3 needs a product decision before QA signs off on refresh behaviour. [Epic scan; DA]",
        "grow": f"Overlay behaviour on XL screens should reuse the same measurements as SSP growth to avoid double shadows when tasks stack. [Epic scan; DA]",
        "style": f"Pure styling still needs token parity with Figma across themes so future functional tweaks do not churn CSS twice. [DA]",
        "bounce": f"Bounce taxonomy should map to recruiter actions (retry vs alternate channel) and stay distinct from REST send failures. [Epic scan; DA]",
        "rest": f"Mid-session opt-out or security loss should preserve draft text per AC—confirm copy with legal if clipboard export is implied. [DA]",
        "emailchg": f"Primary email change should cross-link merge and agency isolation stories so recruiters understand why threads pause. [Epic scan; DA]",
        "optout": f"In-between opt-out state must be explained to candidates and recruiters with the same words on both sides of the thread. [DA]",
        "agencytab": f"Tab isolation plus send-time validation for agency candidates is easy to undertest—bundle acceptance across HRREC-92029 in milestone testing. [Epic scan; DA]",
        "isol": f"Agency-only visibility is a confidentiality bar; add explicit negative tests that candidate threads never leak URLs or previews. [DA]",
        "lifecycle": f"Parallel active/closed tabs need crisp icons so recruiters do not reply on the wrong tab after disposition changes. [Epic scan; DA]",
        "tags": f"Sent vs not-delivered promises should match what email receipts can prove—avoid WhatsApp-style timing expectations. [DA]",
        "purge": f"PDT purge breadth (messages, participants, attachments, notification events) needs an admin-readable checklist against reporting stories. [DA]",
        "lifeadmin": f"Configurable days vs one-year cap needs admin UX for invalid inputs and audit visibility when auto-close fires. [DA]",
        "report": f"Exploratory milestone note should name concrete reports and CRFs touched by email logging—not just SMS/WhatsApp parity smoke. [Epic scan; DA]",
        "closed": f"Final closed state is irreversible per notes—confirm recruiter comms playbooks when inbound mail arrives after closure. [DA]",
        "merge": f"Merge carrying two threads plus email-change pause should reference duplicate-management runbooks and survivor addressing rules. [Epic scan; DA]",
        "cinatt": f"Inbound stripped attachments need consistent system-message wording with outbound attachment failures for the same candidate view. [Epic scan; DA]",
        "mc": f"My Conversations refactor is thin on AC—needs OE alignment on domain packaging before sizing. [DA]",
        "agencycmp": f"Send-time opt-in only for agency candidates while showing compose up front needs careful error strings to avoid looking broken before send. [Epic scan; DA]",
        "to": f"To-dropdown labels for agency vs candidate must stay stable when addresses change mid-session—pair with HRREC-92005 scenarios. [Epic scan; DA]",
        "audit": f"Activity stream, timeline, and candidate communications report must agree on timestamps, attachment visibility, and redaction after purge. [Epic scan; DA]",
        "sendatt": f"Blobatory IDs on send extend HRREC-91994—define partial failure when one attachment fails server validation. [Epic scan; DA]",
    }[tag]

    qa = {
        "init": f"Recruiters could see the task but land on the wrong job application context if ordering drifts from other tasks—exercise ordering with SMS and notes tasks. [Jira]",
        "shell": f"Wide panel regressions on smaller breakpoints may clip email headers—spot-check L vs M breakpoints against Figma. [Jira]",
        "empty": f"If Compose and New both appear, mis-clicks could start duplicate drafts—watch empty-state focus order and keyboard traps. [Jira]",
        "notify": f"If My Conversations is misconfigured, recruiters may only get email prompts—verify dual routing in a tenant with mixed domain access. [Jira]",
        "admin": f"Disabling while drafts are open could strand attachments mid-upload—capture slow-network timing in tests. [Jira]",
        "sec": f"Read-only users might still see stale Send chrome from cache—force refresh cases after domain changes. [Jira]",
        "ux": f"Double shadows or lost focus when Add fires twice quickly should be caught in UI automation. [Jira]",
        "read": f"Long HTML bodies in wide view need scroll anchoring so recruiters do not lose place when new inbound arrives. [Jira]",
        "compose": f"Opt-in edge cases with internal candidates need explicit fixtures—risk of messaging work email addresses unintentionally. [Jira]",
        "draft": f"Panel collapse during autosave-less drafts is fragile—exercise rapid collapse/expand while typing throttled networks. [Jira]",
        "header": f"Custom dropdowns must expose screen-reader labels equivalent to visible To/From text—do not rely on colour alone. [Jira]",
        "attach": f"UI-only staging might diverge from server MIME rules—pair with send stories before declaring done. [Jira]",
        "rte": f"Paste-from-word often injects hidden styles—add a dirty-formatting case even if out of scope for MVP polish backlog. [Jira]",
        "from": f"From list with only no-reply could confuse reply expectations—negative test with single option tenants. [Jira]",
        "tabs": f"Mis-tagged agency applications could hide tabs entirely—data setup matrix in QA plan is essential. [Jira]",
        "badatt": f"Zip-with-executable inner files may bypass naive client filters—confirm server story coverage. [Jira]",
        "val": f"Multi-error banner order should map to tab order for keyboard users—WCAG check. [Jira]",
        "send": f"Double-tap send race: confirm disabled state also blocks keyboard submit shortcuts. [Jira]",
        "discard": f"Browser back button vs in-app navigation may not both trigger discard—document supported paths. [Jira]",
        "discard2": f"Empty-editor no-prompt path must ignore whitespace-only HTML from RTE. [Jira]",
        "unread": f"Concurrent recruiter reads should refresh counts without flicker—load test two browsers same user if model is shared. [Jira]",
        "thread": f"Selecting another row mid-fetch should cancel in-flight requests to avoid wrong-thread flash. [Jira]",
        "readst": f"Peek vs full-read threshold needs measurable steps for automation—avoid subjective peek definition. [Jira]",
        "grow": f"Touch devices without hover need an alternate grow affordance—mobile browser smoke if in scope. [Jira]",
        "style": f"Visual-only regressions still need snapshot tests for thread ordering regressions. [Jira]",
        "bounce": f"Soft vs hard bounce messaging should not contradict tags story statuses in the same minute. [Jira]",
        "rest": f"Clipboard copy suggestion after failure must not pull PII into logs—sanity review observability hooks. [Jira]",
        "emailchg": f"Merge plus email change same session needs an ordered event replay test. [Jira]",
        "optout": f"Partial thread visibility during opt-out transition could leak new inbound—time-bound tests. [Jira]",
        "agencytab": f"Tab defaults when one channel is closed—ensure All tab does not briefly show cross-thread bodies. [Jira]",
        "isol": f"Deep-link URL tests for agency users hitting candidate thread IDs should hard deny. [Jira]",
        "lifecycle": f"When one tab closes, ensure unread counts recompute only for the active tab scope. [Jira]",
        "tags": f"Delayed delivery updates should animate or notify accessibility tech—not silent icon swaps. [Jira]",
        "purge": f"Post-purge caches on profile could still show ghost previews—browser refresh and SSR tests. [Jira]",
        "lifeadmin": f"Scheduler auto-close across time zones needs clock skew cases. [Jira]",
        "report": f"Regression pack should include candidate communications report filters with email channel on. [Jira]",
        "closed": f"Inbound after closure should surface read-only banner without resurrecting compose—negative REST test. [Jira]",
        "merge": f"Two threads visible after merge should label survivor vs merged record clearly to avoid wrong reply. [Jira]",
        "cinatt": f"Virus-scan system messages should meet same tone guidelines as recruiter-authored mail for trust. [Jira]",
        "mc": f"Without AC, QA cannot define done—block test design until OE signs routing domains. [Jira]",
        "agencycmp": f"Agency user vs candidate recipient matrix needs four explicit fixtures including internal agency users if applicable. [Jira]",
        "to": f"Dropdown search with many agency contacts should perform under latency SLAs—stress list size. [Jira]",
        "audit": f"Attachment metadata in reports must respect redaction when partial purge removes only attachments—coordinate with HRREC-92011. [Jira]",
        "sendatt": f"Large combined payload near limit should show which attachment failed when Blobatory rejects one of many. [Jira]",
    }[tag]

    summ_short = html.escape(summary[:72] + ("…" if len(summary) > 72 else ""))
    dev = (
        f"{key} ({summ_short}): XO metadata search was attempted this session but the SUV search endpoint returned a transport error, "
        f"so confirm REST tasks, conversation security domains, and sliding-panel bindings on a healthy SUV before sizing. [XO MCP]"
    )

    lozenge: dict[str, tuple[str, str]] = {
        "mc": ("Very High", "Red"),
        "report": ("High", "Yellow"),
        "lifeadmin": ("High", "Yellow"),
        "merge": ("High", "Yellow"),
        "sendatt": ("Medium", "Blue"),
        "notify": ("Medium", "Blue"),
        "audit": ("Medium", "Blue"),
        "purge": ("Medium", "Blue"),
        "emailchg": ("Medium", "Blue"),
    }
    gl_title, gl_colour = lozenge.get(tag, ("Very Low", "Grey"))
    # Confluence Storage rejects coloured circle emoji in Verdict cells (400 Bad Request).
    label_line = f"<strong>{gl_title}</strong>"

    if tag == "mc":
        find = "Story text names an OE dependency but does not yet list testable acceptance criteria for My Conversations routing."
        nxt = "Run a short OE workshop with Blythe Early to turn the dependency note into DoR-ready AC before sizing."
    elif tag == "report":
        find = "Story is exploratory milestone text only—no concrete report or CRF checklist for email regressions yet."
        nxt = "Attach a named regression matrix (reports + CRFs) in Jira or split into a scoped story before milestone exit."
    elif tag == "merge":
        find = f"{key}: Duplicate candidate merge can surface two live threads plus survivor email rules—ordering with HRREC-92005 pause semantics is underspecified."
        nxt = "Hold a duplicate-management workshop to lock survivor addressing, thread pick-up, and pause messaging before sizing this slice."
    elif tag == "lifeadmin":
        find = f"{key}: Post-disposition windows vs one-year auto-close interact with closed-thread banners—admin validation and scheduler audit need explicit sequencing."
        nxt = "Sequence lifecycle admin with HRREC-92014 and closed-thread banner stories in engineering review so recruiters never see conflicting closure reasons."
    elif tag == "notify":
        find = f"{key}: In-app vs email prompt routing for inbound replies still depends on My Conversations domain work tracked thinly elsewhere in the epic."
        nxt = "Pair with HRREC-92022 OE outcome so notification copy matches the actual entry path recruiters will use."
    elif tag == "purge":
        find = f"{key}: Purge removes multiple artefact types—reporting and timeline slices must declare the same removal order to avoid ghost audit rows."
        nxt = "Joint session with privacy + reporting owners to publish an ordered purge checklist referenced from HRREC-92035 tests."
    elif tag == "emailchg":
        find = f"{key}: Email-change pause threads through merge and agency tabs—risk of mismatched banners if events arrive out of order."
        nxt = "Align event ordering assumptions with duplicate management and tab stories before hardening automation."
    elif tag == "sendatt":
        find = f"{key}: Partial Blobatory failures on multi-attach sends need explicit recruiter messaging distinct from HRREC-91994 happy path."
        nxt = "Extend REST contract review with attachments team so one failed blob does not silently drop sibling files."
    elif tag == "audit":
        find = f"{key}: Three logging surfaces (activity stream, timeline, candidate communications report) can disagree on attachment redaction after purge."
        nxt = "Add a single telemetry matrix in Jira Notes listing fields each surface must show for inbound/outbound email."
    else:
        find = f"{key}: Jira scenarios for this slice are detailed enough to drive build and QA for the stated MVP boundary."
        nxt = "No material gap surfaced in this Tier B pass—keep Jira as source of truth unless new routing or security rules land."

    verdict = f"""<p>{label_line}</p><ul>
<li><strong>Finding:</strong> {find}</li>
<li><strong>Recommended next step:</strong> {nxt}</li>
</ul>"""

    bdd = f"<p>No additional BDD suggested for {key} in this Tier B pass—Jira scenarios cover the primary path unless REST or security contracts shift.</p>"
    if tag in ("merge", "emailchg", "purge", "sendatt", "notify"):
        bdd = f"""<p><strong>Scenario: Cross-surface parity ({key})</strong><br/>
<strong>Given</strong> related epic stories on reporting, purge, or notifications have shipped their contracts for this job application<br/>
<strong>When</strong> recruiters complete the journey described in {key}<br/>
<strong>Then</strong> timestamps, redaction, and notification entry points match sibling story promises without contradictory copy</p>"""

    if tag == "audit":
        bdd = f"""<p><strong>Scenario: Audit trail alignment ({key})</strong><br/>
<strong>Given</strong> an email with attachments was purged per HRREC-92011<br/>
<strong>When</strong> a recruiter opens activity stream, recruiting timeline, and candidate communications report for that job application<br/>
<strong>Then</strong> each surface shows consistent timestamps and attachment visibility with no contradictory rows</p>"""

    if tag == "mc":
        bdd = """<p><strong>Scenario: AC placeholder</strong><br/>
<strong>Given</strong> engineering and OE agree the My Conversations domain packaging<br/>
<strong>When</strong> recruiters receive inbound email replies<br/>
<strong>Then</strong> in-app entry points and domains are listed in DoR with testable routing matrix</p>"""

    return f"""<tr><!-- gap-review {key} -->
<td><a href="https://jira2.workday.com/browse/{key}">{key}</a><br/>{esc_s}</td>
<td>{status(gl_title, gl_colour)}<p>Gap Likelihood from Verdict + column 7 only.</p></td>
<td>{pm}</td>
<td>{qa}</td>
<td>{dev}</td>
<td>{verdict}</td>
<td>{bdd}</td>
</tr>"""


def main() -> None:
    parts: list[str] = []
    parts.append("""<h2>Executive summary (for PM)</h2>
<ul>
<li>Run tier: B (timeboxed)—44 in-scope Stories under HRREC-82977 after excluding doc-writer AG:/RN: keys; theme-based Salomon/DA and batched Dev lens; not full per-key Salomon depth.</li>
<li>Gap Likelihood reflects Verdict + suggested missing BDD only—not a separate persona-tension score. Skipped gap table keys: HRREC-90852 (AG:), HRREC-90853 (RN:).</li>
<li>XO MCP did not return SUV metadata this session (transport error on search), so Dev lens rows are engineering follow-up questions, not proof of missing metadata.</li>
</ul>
<h3>Top 5 gaps (epic)</h3>
<ul>
<li>Thin-spec and cross-team spikes (notably My Conversations / OE packaging) sit beside UI-heavy stories—sequence dependencies before hard QA dates (HRREC-92022).</li>
<li>Draft lifecycle is explicitly local-only; navigation discard and refresh stories must be trained together or recruiters will perceive data loss as bugs (HRREC-91995, HRREC-91996).</li>
<li>Merge, email-change pause, and thread visibility interact—risk of contradictory UX if duplicate-management events arrive out of order (HRREC-92015, HRREC-92005).</li>
<li>Reporting + purge + candidate communications visibility must agree on attachment redaction and timestamps—milestone regression story is exploratory only today (HRREC-92035, HRREC-92011, HRREC-92013).</li>
<li>Notification entry points (My Conversations vs bell vs email prompts) need tenant-aligned language; internal KB stresses domain alignment for conversational channels (HRREC-91975).</li>
</ul>
<h3>Top 5 strengths (epic)</h3>
<ul>
<li>Most functional slices carry detailed Given/When/Then blocks already—strong refinement investment across compose, send, and error paths.</li>
<li>Agency vs non-agency branching is explicitly split across tabs, compose, and isolation stories—reduces accidental scope bleed.</li>
<li>Security read vs send split is called out with REST notes on HRREC-91979—good engineering handoff signal.</li>
<li>Attachment and validation stories distinguish client vs server responsibilities—helps QA plan negative paths.</li>
<li>Admin enable/disable and lifecycle admin stories show rollout-aware thinking for enterprise tenants.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li>Overlapping UI chrome: HRREC-91948, HRREC-91980, HRREC-92001, and HRREC-91982 all touch expand/grow—keep a single measurement source of truth in design specs.</li>
<li>HRREC-91994 and HRREC-92036 should share send/polling semantics; dedupe QA matrices.</li>
<li>HRREC-92013 is exploratory—tie to concrete report names before milestone sign-off.</li>
</ul>
<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>
<p><strong>Frozen pattern corpus</strong> — 2026-05-16 companion snapshot in repo; <strong>No live Jira pull for WhatsApp companion this run (manifest-only).</strong> Theme anchors below cite snapshot excerpt keys only—inspiration for email, not requirements.</p>
<p>Same candidate profile sliding side panel UX shell as WhatsApp work; not a requirements import; channel and backend differ; do not treat WhatsApp defects as proof email is broken.</p>
<ul>
<li><strong>Preview vs send</strong> — HRREC-84403 / HRREC-89856: consider for 2WE if email preview hydration could diverge from what actually sends when CRF scope or processing user differs?</li>
<li><strong>Merge / identity</strong> — HRREC-90306: consider for 2WE if merge could mis-attribute outbound email identity or threading after duplicate resolution?</li>
<li><strong>Composer guard</strong> — HRREC-90268 / HRREC-92062: consider for 2WE if double-send or typing-while-send races need the same in-flight disable pattern on email send?</li>
<li><strong>Lifecycle messaging</strong> — HRREC-90243: consider for 2WE if closed-thread or disposition banners should appear at the business event, not only after first outbound?</li>
<li><strong>Reporting field naming</strong> — HRREC-84556: consider for 2WE if mixed-channel dashboards need explicit email fields so SMS-oriented labels are not reused?</li>
</ul>
<table>
<thead><tr>
<th>Story</th><th>Gap Likelihood</th><th>PM lens</th><th>QA lens</th><th>Dev lens</th><th>Verdict</th><th>Suggested missing BDD (Given/When/Then)</th>
</tr></thead>
<tbody>
""")
    for key, summary, tag in STORIES:
        parts.append(row(key, summary, tag))
    parts.append("""</tbody></table>
<!-- possible-missing-stories-table -->
<h2>Possible missing stories (suggestions only)</h2>
<p>Holistic suggestions from this Jira pass only (external PRD not auto-loaded). These are not Jira keys.</p>
<table>
<thead><tr><th>User story (suggested)</th><th>Reason why this may be missing</th><th>BDD scenarios (Given/When/Then)</th></tr></thead>
<tbody>
<tr><td>As a recruiter, I want a single troubleshooting playbook when notifications route to email prompts vs My Conversations vs bell, so that I do not miss candidate replies during pilot.</td><td>91975 and HRREC-92022 imply routing complexity; KB articles describe My Conversations domain packaging for SMS that may parallel email rollout.</td><td><p><strong>Given</strong> mixed domain access recruiters<br/><strong>When</strong> inbound reply arrives<br/><strong>Then</strong> exactly one primary entry point is documented per tenant configuration</p></td></tr>
<tr><td>As a privacy admin, I want an explicit verification checklist after purge that reporting and activity stream tiles stay coherent, so that audits do not show ghost email events.</td><td>92011 purge list spans multiple artefacts; 92035 expects timeline/report logging—gap if partial purge ordering undefined.</td><td><p><strong>Given</strong> purge completed for candidate<br/><strong>When</strong> recruiter opens timeline and communications report<br/><strong>Then</strong> no stale email rows or attachment references remain</p></td></tr>
<tr><td>As a candidate, I want consistent opt-out language on both external email footers and in-app thread states, so that I understand what still blocks replies.</td><td>92006 in-between state risks mismatch with recruiter-visible banners in 92014.</td><td><p><strong>Given</strong> candidate opts out mid-thread<br/><strong>When</strong> both parties refresh views<br/><strong>Then</strong> copy matches within approved glossary</p></td></tr>
</tbody></table>
""")
    OUT.write_text("".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
