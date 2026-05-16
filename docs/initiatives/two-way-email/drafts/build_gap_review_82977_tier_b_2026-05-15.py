#!/usr/bin/env python3
"""Generate Tier B gap-review Storage HTML for HRREC-82977 (run 2026-05-15).

**Draft replay / formatter only** — not a substitute for `/user-story-gap-review`
Tier A or B **live** MCP runs. **Gap Likelihood** Confluence `status` macros here are driven
by `gap_pct` (bucket + key-stable jitter) then `gap_risk_status`; see
`.cursor/skills/user-story-gap-review/reference.md` + `reference-companion-whatsapp.md` → **Gap column (2)** and
**Repo formatters — honest disclaimer**. Disclose Tier B + draft replay on any publish.
"""
from html import escape
from pathlib import Path
import sys

_DRAFTS_DIR = Path(__file__).resolve().parent
if str(_DRAFTS_DIR) not in sys.path:
    sys.path.insert(0, str(_DRAFTS_DIR))

from gap_likelihood_confluence import gap_likelihood_status_macro

KEYS = [
    ("HRREC-91946", "[Initialisation] Recruiter can see Email Task on SSP (XO Only)"),
    ("HRREC-91948", "[Initialisation] Enabled SSP Growth/Expansion"),
    ("HRREC-91974", "PH: Recruiter sees Empty state of email task if opened"),
    ("HRREC-91975", "PH: Recruiter receives a notification"),
    ("HRREC-91978", "PH: Admin can enable or disable 2-way email as a comms channel"),
    ("HRREC-91979", "PH: Recruiter does not have access to the compose email task"),
    ("HRREC-91980", "PH: Recruiter sees the panel expand when clicking Add to compose an email"),
    ("HRREC-91982", "PH: Recruiter opens the message to read and reply"),
    ("HRREC-91985", "PH: Recruiter can compose an email to non-agency candidate"),
    ("HRREC-91986", "PH: Recruiter expands/collapses the panel to check candidate profile (context stays?)"),
    ("HRREC-91987", "PH: Recruiter can select To, From & Subject (UI) when composing an email"),
    ("HRREC-91988", "PH: Recruiter attaches documents (UI only)"),
    ("HRREC-91989", "PH: Recruiter can use the RTE & see the UI of buttons"),
    ("HRREC-91990", "PH: Recruiter can select From address from list of valid email addresses"),
    ("HRREC-91991", "PH: Recruiter does not see any tabs for non-agency candidate"),
    ("HRREC-91992", "PH: Recruiter attaches non-supported files"),
    ("HRREC-91993", "PH: Recruiter sees UI error validations on Send"),
    ("HRREC-91994", "PH: Send Message (No Attachments)"),
    ("HRREC-91995", "PH: Recruiter gets discard popup by changing pages"),
    ("HRREC-91996", "PH: Recruiter gets discard popup when they click the Discard button"),
    ("HRREC-91997", "PH: Recruiter sees list of messages with unread ones marked in blue"),
    ("HRREC-91998", "PH: Recruiter can see message threads when clicking on a message"),
    ("HRREC-91999", 'PH: Recruiter sees blue "unread marker" removed after clicking in the view a message in full'),
    ("HRREC-92001", "PH: Recruiter sees the panel expand & views full message when clicking the grow button or clicking a single message"),
    ("HRREC-92002", "PH: Style only - Recruiter sees messages showing, styled as per figma"),
    ("HRREC-92003", "PH: Recruiter sees error messages if their email has bounced"),
    ("HRREC-92004", "PH: Recruiter sees error when sending message (REST error)"),
    ("HRREC-92005", "PH: Recruiter sees info message and cannot send email if the candidate changes their email"),
    ("HRREC-92006", "PH: Candidates opt-out of receiving emails"),
    ("HRREC-92007", "PH: Recruiter can switch between tabs for candidate and agency comms"),
    ("HRREC-92008", "PH: Agency cannot see recruiter conversation"),
    ("HRREC-92009", "PH: Recruiter can see both closed and non-closed conversation in the same panel if one conversation is still active"),
    ("HRREC-92010", "PH: Recruiter sees tags on messages showing updating state (sent, not delivered)"),
    ("HRREC-92011", "PH: Privacy Admin purges PDTs for 2-way email - Candidate/Job App"),
    ("HRREC-92012", "PH: Admin can configure conversation lifecycle tenant setting?"),
    ("HRREC-92013", "PH: Existing reporting features are not broken"),
    ("HRREC-92014", "PH: Recruiter cannot see reply, or Add button when both conversations are closed & sees info message? that convo is closed"),
    ("HRREC-92015", "PH: Candidate has 2 applications to the same JR and gets merged"),
    ("HRREC-92016", "PH: Candidate attaches non-supported files"),
    ("HRREC-92022", "PH: My Conversations will require an XO (small) refactor"),
    ("HRREC-92029", "PH: Recruiter can compose an email to agency user or agency candidate"),
    ("HRREC-92030", "PH: Recruiter can select To address from list of valid email addresses"),
    ("HRREC-92035", "PH: Email communications are visible in Activity Stream, Timeline and Candidate Communications"),
    ("HRREC-92036", "PH: Send Message (With Attachments)"),
]


def key_num(key: str) -> int:
    return int(key.split("-")[1])


def _agency_intent(summary: str) -> bool:
    s = summary.lower()
    if "non-agency" in s or "non agency" in s:
        return False
    return "agency" in s


def bucket(summary: str) -> str:
    s = summary.lower()
    if "purge" in s or "pdt" in s:
        return "purge"
    if _agency_intent(summary) and (
        "tab" in s or "cannot see" in s or "switch between" in s or "agency user" in s or "agency candidate" in s
    ):
        return "agency"
    if "notification" in s or ("conversations" in s and "refactor" in s):
        return "notify"
    if "report" in s or "activity stream" in s or "timeline" in s:
        return "report"
    if "merge" in s or "merged" in s or ("email" in s and "change" in s):
        return "merge"
    if "lifecycle" in s or "closed" in s or "opt-out" in s:
        return "lifecycle"
    if "rest" in s or "bounce" in s or ("error" in s and "style" not in s):
        return "error"
    if "attach" in s or "send message" in s:
        return "send"
    if "initialisation" in s or "ssp" in s or "growth" in s:
        return "shell"
    if "empty" in s or "rte" in s or "discard" in s or "validation" in s:
        return "compose_ui"
    return "general"


def pick(seq: list[str], key: str) -> str:
    return seq[key_num(key) % len(seq)]


def salomon_pm(b: str, key: str) -> str:
    themes = {
        "purge": [
            "Theme purge: Recruiting Communications PDT lists conversation messages, participants, recruiting email attachments, and related notification content—check this story’s purge list matches Admin Guide language.",
            "Theme purge: Prior internal threads stress matching purge scope to what recruiters still see in the thread list after privacy actions.",
            "Theme purge: If Jira names only Candidate/Job App PDTs, confirm whether conversation rows in other surfaces are included or intentionally excluded.",
        ],
        "agency": [
            "Theme agency/UDMF: Duplicate job-requisition applications can block agency submissions when business-process conditions mis-fire—relevant when agency and candidate tabs coexist.",
            "Theme agency/UDMF: Internal notes compare UDMF duplicate checks with legacy CRF behaviour; align test matrix with tenant duplicate settings.",
            "Theme agency/UDMF: Agency isolation stories should include negative tests where an agency user attempts to open recruiter-only conversation URLs.",
        ],
        "notify": [
            "Theme templates/delivery: Email Analytics and SendGrid-style flows can reject blank subjects; compare with My Conversations and bell routing expectations.",
            "Theme templates/delivery: Mass-email discussions mention grid limits on some paths; this compose slice may differ—do not assume one cap without tenant proof.",
            "Theme templates/delivery: Recruiting Marketing vs Active Candidates notification types change how outbound mail is exercised in Edit Tenant Setup - Notifications.",
        ],
        "report": [
            "Theme reporting: Adding prior channels (example: WhatsApp) required reporting touch-ups; email logging should get the same milestone regression pass.",
            "Theme reporting: Activity Stream and Timeline consumers may dedupe events differently than Candidate Communications—call out expected cardinality in Jira.",
            "Theme reporting: Internal search did not return a dedicated email-conversation reporting recipe for this slice—treat export coverage as a design risk.",
        ],
        "merge": [
            "Theme merges: Automatic candidate merge toggles change how duplicate applications appear when a candidate changes contact data mid-thread.",
            "Theme merges: Two applications to the same requisition interact with duplicate detection; pair functional tests with merge on/off in tenant setup.",
            "Theme merges: Internal knowledge did not surface a single canonical rule for merged-thread unread state—capture expected UX explicitly.",
        ],
        "lifecycle": [
            "Theme lifecycle/opt-out: Closed conversation states interact with whether Add/Reply remain available; align with tenant conversation lifecycle admin task.",
            "Theme lifecycle/opt-out: Candidate opt-out mid-thread should be paired with recruiter-facing messaging in Jira, not only backend suppression.",
            "Theme lifecycle/opt-out: No extra Salomon hit tied narrowly to this title—document honest gap if behaviour is net-new.",
        ],
        "error": [
            "Theme errors: Bounce vs REST failure often need different user-visible copy; Salomon snippets mention vendor rejection paths for mail.",
            "Theme errors: Tag states like sent vs not delivered should map to support-visible diagnostics where available.",
            "Theme errors: Internal search did not return a direct precedent for this exact REST surface—keep engineering confirmation in test plan.",
        ],
        "send": [
            "Theme send/attach: Attachment size and type limits vary by channel; align unsupported-file stories with candidate vs recruiter upload paths.",
            "Theme send/attach: Branded Recruiting Communications templates can override recruiter picks and yield blank bodies in some tenants (HRREC-90673 class pattern).",
            "Theme send/attach: Default SMTP vs Email Analytics changes how quickly failures surface in UI—note in staging plan.",
        ],
        "shell": [
            "Theme shell/SSP: Growth-pack gating for SSP tasks should be explicit in acceptance criteria so QA does not test on the wrong tenant SKU.",
            "Theme shell/SSP: Internal hits emphasise Edit Tenant Setup - Notifications as the hub for outbound behaviour—relevant even for XO-only shell stories.",
            "Theme shell/SSP: No Salomon hit specific to SSP email task visibility alone—state that plainly and rely on Jira + DA for setup steps.",
        ],
        "compose_ui": [
            "Theme compose UI: Discard-on-navigation stories should name which shell routes still hold local draft versus which clear it.",
            "Theme compose UI: RTE parity often misses accessibility cases (keyboard toolbar, focus return after panel collapse).",
            "Theme compose UI: Empty-state copy should be checked against Message Builder vocabulary vs legacy Recruiting chrome.",
        ],
        "general": [
            "Theme tenant comms (general): Internal knowledge ties many defects to template health and mail-routing misconfiguration more than UI bugs.",
            "Theme tenant comms (general): Unread styling searches returned weak direct precedent—add explicit non-colour cues if Jira only mentions blue.",
            "Theme tenant comms (general): Style-only stories rarely carry Salomon precedent; keep evidence honest and lean on Jira + visual sign-off.",
            "Theme tenant comms (general): Branded template overrides can blank outbound mail—pair visual sign-off with one send trace per tenant lane.",
            "Theme tenant comms (general): Mixed mail vendors (Default SMTP vs Email Analytics) change failure timing—note which lane this story assumes.",
            "Theme tenant comms (general): Admin Guide mail tasks cluster on Edit Tenant Setup - Notifications; confirm whether this slice touches that path.",
            "Theme tenant comms (general): Internal threads tie noisy defects to duplicate active templates—call out how many branded templates stay on in staging.",
            "Theme tenant comms (general): Weak direct precedent for this title—state honestly and lean on Jira scenarios plus one tenant screenshot.",
            "Theme tenant comms (general): Privacy and masking rules interact with compose—flag if Jira silent on masked reply-to behaviour.",
        ],
    }
    return pick(themes.get(b, themes["general"]), key)


def da_pm(key: str, b: str) -> str:
    lines = {
        "purge": [
            f"For {key}, after purge completes, confirm the email side panel matches the privacy statement recruiters see (empty thread vs hard error).",
            f"For {key}, run purge on a tenant with both Default SMTP and Email Analytics available to see whether any mail vendor artefacts linger in UI.",
            f"For {key}, pair purge validation with a recruiter who still has Modify on the conversational email security domain.",
        ],
        "agency": [
            f"For {key}, bracket agency tests with UDMF duplicate checks on and off; DA notes misconfiguration shows up as false defects.",
            f"For {key}, use a tenant where agency users and internal recruiters differ by role—avoid shared test users that mask isolation bugs.",
            f"For {key}, confirm agency cannot access recruiter URLs by direct navigation, not only by absence of buttons.",
        ],
        "notify": [
            f"For {key}, validate bell vs My Conversations with realistic domain access; DA says optional email alerts depend on admin routing rules.",
            f"For {key}, confirm notification payload when candidate SMS/email message types are mixed in the same candidate profile.",
            f"For {key}, DA did not confirm a universal 1000-address mass-send cap for this compose path—probe limits in your SUV rather than assuming.",
        ],
        "report": [
            f"For {key}, snapshot report row counts before/after enabling 2-way email in a milestone tenant.",
            f"For {key}, include at least one custom report used by a large hiring customer if available in staging.",
            f"For {key}, verify Activity Stream vs Timeline ordering with rapid multi-message sends.",
        ],
        "merge": [
            f"For {key}, toggle automatic candidate merge under Edit Tenant Setup - Recruiting and repeat the duplicate-application scenario.",
            f"For {key}, capture whether merged candidates keep one conversation thread ID or split—DA expects engineering truth here.",
            f"For {key}, retest after candidate primary email change if Jira ties merge to contact updates.",
        ],
        "lifecycle": [
            f"For {key}, exercise opt-out and closed-thread states with the same recruiter session that composed the last outbound message.",
            f"For {key}, confirm admin conversation lifecycle default matches Jira’s question mark in the title—DA cannot answer without the final setting list.",
            f"For {key}, pair lifecycle changes with purge regression if privacy admins also use the tenant.",
        ],
        "error": [
            f"For {key}, simulate REST failure separately from SMTP bounce so UI copy stays distinct.",
            f"For {key}, use Email Analytics on one lane and Default SMTP on another to compare error latency.",
            f"For {key}, confirm whether not-delivered tags eventually clear when the vendor retries.",
        ],
        "send": [
            f"For {key}, test maximum allowed attachment count and cumulative size with the same template override states as plain send.",
            f"For {key}, candidate-side unsupported attach paths may differ from recruiter attach—mirror both if Jira mentions candidate.",
            f"For {key}, verify attachment chips still appear after collapsing and expanding the compose panel.",
        ],
        "shell": [
            f"For {key}, confirm SSP task visibility with growth pack both enabled and disabled per Jira’s initialisation intent.",
            f"For {key}, walk the same recruiter through My Tasks and candidate profile entry points so panel sizing matches both shells.",
            f"For {key}, DA highlights Edit Tenant Setup - Notifications even when story is XO-only—capture minimum tenant prep for QA.",
        ],
        "compose_ui": [
            f"For {key}, script navigation paths that skip the explicit Discard button to match Jira’s discard-on-page-change scenario.",
            f"For {key}, retest RTE after browser zoom and reduced-motion settings—common false visual defects.",
            f"For {key}, confirm From/To picklists respect masked addresses if privacy masking is on for the candidate.",
        ],
        "general": [
            f"For {key}, align staging with a single active Recruiting Communications branded template to reduce blank-body noise.",
            f"For {key}, document whether recruiters test with Email Analytics or Default SMTP in the QE runbook row for this key.",
            f"For {key}, DA reminds that mail misconfiguration often mimics product bugs—log tenant setup in defect tickets.",
        ],
    }
    return pick(lines.get(b, lines["general"]), key)


def qa_jira_first_line(summary: str, key: str, b: str) -> str:
    """Jira-anchored QA bullet: lead with user-visible risk; second clause may add depth—no test-script openers (qa_ul strips 'Jira — ')."""
    s = summary.lower()
    tail = summary.strip()
    if "initialisation" in s or "ssp" in s or "growth" in s:
        return f"Jira — Recruiters on baseline vs growth-enabled mail should see the same task entry for {key}; second pass: log tenant pack and SKU in the defect so gating is not misread as a bug."
    if "empty state" in s:
        return "Jira — Recruiters should see consistent empty-state copy from My Tasks and from the profile with no ghost draft after refresh; second pass: name each route and the exact copy variant."
    if "notification" in s:
        return "Jira — Bell, device mail, and in-app surfaces should show the same candidate-facing fields for this profile; second pass: capture which channel lied when they disagree."
    if "admin" in s and "enable" in s:
        return "Jira — After admins flip the channel, recruiters should see eligibility change in the UI at the same time outbound rules change; second pass: note audit or support wording you expect."
    if "does not have access" in s or "no access" in s:
        return "Jira — Recruiters blocked from compose should see a specific reason (domain, role, channel, masking); second pass: cover domain off, role off, channel off, and masked candidate as separate rows."
    if "panel expand" in s or "grow button" in s or ("expand" in s and "panel" in s):
        return "Jira — Growing or shrinking the compose panel should keep scroll position and focus; second pass: watch for duplicate compose shells that read as a product bug."
    if "does not see any tabs" in s or "do not see any tabs" in s:
        return "Jira — Non-agency candidates should never see agency tab chrome or dead affordances; second pass: deep-link attempts should not expose recruiter-only routes."
    if "collapses" in s and "profile" in s:
        return "Jira — Collapsing the panel while on the profile should keep drafts and context chips stable; second pass: note any duplicate fetch or flicker recruiters would report."
    if "read and reply" in s or "message threads" in s or "clicking on a message" in s:
        return "Jira — Thread order and replies should stay sensible on slow networks and when polling cancels mid-flight; second pass: describe the broken recruiter experience, not only API timing."
    if "compose" in s and "non-agency" in s:
        return "Jira — Compose to a non-agency candidate should default To/From safely and hide agency-only paths; second pass: confirm masking on reply-to when enabled."
    if "compose" in s and ("agency user" in s or "agency candidate" in s):
        return "Jira — Agency compose must never show recruiter-only bodies in preview; second pass: duplicate JR numbers and allowed recipient lists belong in the ticket."
    if "to, from" in s or "from address" in s or "to address" in s:
        return "Jira — Picklists should recover when options are empty, revoked, or masked; second pass: list the bad combinations recruiters can hit and the message each should show."
    if "rte" in s or ("buttons" in s and "rte" in s):
        return "Jira — Toolbar and keyboard paths should match design for real paste-from-Word traffic; second pass: capture sanitised HTML vs Figma for one messy sample."
    if "attach" in s and "non-supported" in s:
        return "Jira — Unsupported or oversize files should block send with a clear inline error and no stuck chip; second pass: pair each failure with what the recruiter reads."
    if "attach" in s and "ui only" in s:
        return "Jira — Chips may be UI-only today but should still match future limits; second pass: document what recruiters see now vs after wire-up."
    if "validation" in s and "send" in s:
        return "Jira — Send-time errors should read in plain language (blank subject, overrides, concurrent edits); second pass: include the in-flight send case."
    if "send message" in s and "no attachment" in s:
        return "Jira — Plain sends should show progress and recover from failure without duplicating thread rows; second pass: timestamps and optimistic UI states belong in acceptance."
    if "send message" in s and "attachment" in s:
        return "Jira — Large attachments should survive panel collapse and vendor timeouts; second pass: multi-file and near-limit runs with what the recruiter saw."
    if "discard" in s and "page" in s:
        return "Jira — Leaving without Discard should never silently drop work; second pass: map back navigation, deep links, and task switches to discard vs autosave."
    if "discard" in s and "button" in s:
        return "Jira — Discard should feel single-shot—no double destructive prompts; second pass: cancel should land recruiters in a stable editor."
    if "unread" in s or "blue" in s:
        return "Jira — Unread cues should work without colour alone and stay honest when another recruiter reads the thread; second pass: screen reader label text to capture."
    if "style" in s and "figma" in s:
        return "Jira — Visual drift should be called out per breakpoint; second pass: reduced-motion or dark mode expectations if in scope."
    if "bounce" in s:
        return "Jira — Bounce copy should reference vendor-backed reasons recruiters can act on; second pass: confirm thread context is not wiped."
    if "rest error" in s:
        return "Jira — REST failures should read differently from bounces and offer a credible retry; second pass: correlation ID in the defect without drowning PM readers in jargon."
    if "candidate changes their email" in s:
        return "Jira — Mid-compose email changes should show a clear banner and block stale sends; second pass: draft retention when contact data shifts."
    if "opt-out" in s:
        return "Jira — Opt-out should stop outbound with a recruiter-visible reason while inbound policy stays understandable; second pass: candidate vs recruiter messaging."
    if "switch between tabs" in s or "tabs for candidate and agency" in s:
        return "Jira — Switching tabs should not leak drafts or recruiter-only bodies; second pass: context chips after rapid tab flips."
    if "agency cannot see" in s:
        return "Jira — Agency users hitting recruiter thread URLs should see a hard forbidden or empty experience, not missing buttons only; second pass: deep-link matrix."
    if "closed and non-closed" in s or "both conversations are closed" in s:
        return "Jira — Add/Reply should follow a clear matrix for closed vs open mixes; second pass: reopen behaviour included."
    if "sent, not delivered" in s or "tags on messages" in s:
        return "Jira — Delivery tags should line up with vendor reality after refresh; second pass: tooltip copy vs support KB."
    if "purge" in s or "pdt" in s:
        return "Jira — After purge, recruiters should see the privacy-aligned empty or archived states promised; second pass: list PDTs touched for support."
    if "lifecycle" in s and "tenant" in s:
        return "Jira — Tenant lifecycle defaults change Add/Reply—recruiters should not be surprised mid-draft; second pass: admin propagation lag."
    if "reporting" in s or "not broken" in s:
        return "Jira — Name the reports and exports that regressed; second pass: baseline row counts or hashes hiring managers can trust."
    if "merged" in s or "merge" in s:
        return "Jira — Merged applications can fork threads or unread counts; second pass: same candidate, two JR numbers—document expected thread IDs."
    if "candidate attaches" in s:
        return "Jira — Candidate rejections (type, virus scan) should surface as in-thread errors recruiters notice; second pass: copy for each rejection path."
    if "my conversations" in s and "refactor" in s:
        return "Jira — List user-visible regressions PMs can track (deep links, counts, mark-read); second pass: avoid code-only acceptance."
    if "activity stream" in s or "timeline" in s:
        return "Jira — Same email events should read consistently across Activity Stream, Timeline, and Candidate Communications; second pass: tolerance window in plain language."
    if "2-way email" in s and "comms channel" in s:
        return "Jira — Disabling the channel mid-flight should not strand drafts or confuse candidates; second pass: recruiter discoverability when toggled off."
    short = tail[:100] + ("…" if len(tail) > 100 else "")
    return f"Jira — Start from what recruiters or admins would see wrong for this slice ({short}); second pass: negatives should be unique to {key}, not copied from sibling stories."


def qa_da_line(key: str, b: str) -> str:
    """Larger pool of Deployment Agent QA lines; key picks independently of bucket."""
    pool = [
        f"Deployment Agent — {key}: log Default SMTP vs Email Analytics and single active branded template state per run.",
        f"Deployment Agent — {key}: capture Edit Tenant Setup - Notifications screenshot when reproducing mail defects.",
        f"Deployment Agent — {key}: note automatic candidate merge + UDMF duplicate settings in the defect template.",
        f"Deployment Agent — {key}: if agency involved, split agency user vs internal recruiter accounts—no shared logins.",
        f"Deployment Agent — {key}: after privacy purge, record whether thread list shows empty, archived, or error banner.",
        f"Deployment Agent — {key}: for notification defects, log device email alerts on/off and bell vs My Conversations entry.",
        f"Deployment Agent — {key}: for reporting defects, attach export file hash and tenant report pack version.",
        f"Deployment Agent — {key}: bracket high-volume send with realistic candidate count; do not assume a fixed mass-send cap.",
        f"Deployment Agent — {key}: when REST errors reproduce, attach correlation ID and whether lane was analytics or SMTP.",
        f"Deployment Agent — {key}: log tenant mail mode (Default SMTP vs vendor) so template misconfigurations are not misread as product bugs.",
        f"Deployment Agent — {key}: for compose defects, capture masking on/off and whether the tenant uses growth mail features.",
        f"Deployment Agent — {key}: stamp time zone and locale on screenshots—date ordering bugs often hide behind tenant defaults.",
        f"Deployment Agent — {key}: when reproducing agency isolation, use two browsers with distinct cookies—no impersonation shortcuts.",
    ]
    return pool[key_num(key) % len(pool)]


def qa_functional_extra(summary: str, key: str, b: str) -> str:
    s = summary.lower()
    if "unread" in s or "blue" in s:
        return '<li><strong>Functional knowledge —</strong> If unread is colour-only, add non-colour unread cues for accessibility beyond Jira’s blue wording.</li>'
    if "style" in s:
        return '<li><strong>Other —</strong> Visual-only: snapshot baselines per breakpoint and one reduced-motion run.</li>'
    if b == "purge":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: align purge verification with Recruiting Communications PDT scope in Admin Guide.</li>'
    if b == "agency":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: treat cross-role URL attempts as mandatory security negatives, not UI polish.</li>'
    if b == "error":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: pair each error UI state with the backing vendor or REST signal name in the ticket.</li>'
    if b == "send":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: cover attachment limits separately for recruiter vs candidate attach paths when both exist—each path should surface its own recruiter-visible error.</li>'
    if b == "shell":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: stamp SSP growth pack state; gating defects masquerade as missing email features.</li>'
    if b == "notify":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: include background-tab and multi-recruiter cases—recruiters should still get a trustworthy cue when another user already read the message.</li>'
    if b == "report":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: compare on-screen counts vs export rows—dedupe rules differ by surface.</li>'
    if b == "merge":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: retest after toggling automatic merge; thread IDs may change.</li>'
    if b == "lifecycle":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: matrix opt-out × closed thread × active draft—each cell needs an expected UI outcome.</li>'
    if b == "compose_ui":
        return f'<li><strong>Functional knowledge —</strong> {escape(key)}: discard flows differ by shell route—document which routes you exercised.</li>'
    short = escape(summary.strip()[:85]) + ("…" if len(summary.strip()) > 85 else "")
    return f'<li><strong>Functional knowledge —</strong> Tie security-domain and masking checks to this title: {short}</li>'


def qa_salomon(b: str, key: str) -> str:
    """Two variants per bucket so adjacent keys rarely share identical QA Salomon text."""
    stress = {
        "purge": [
            "Purge defects hurt trust; capture before/after thread list and side-panel screenshots.",
            "Match purge runbook steps to Recruiting Communications PDT scope so QA does not miss a surface.",
        ],
        "agency": [
            "Isolation failures are security-class; try direct URL reuse across agency vs recruiter sessions.",
            "UDMF duplicate settings can mask agency defects—log tenant duplicate mode in every bug.",
        ],
        "notify": [
            "Bell vs My Conversations drift is common; test with device notifications on and off.",
            "Mixed SMS/email routing in the same profile can change what recruiters see in notifications—compare payload fields carefully when both channels are on one profile.",
        ],
        "report": [
            "Reporting regressions often show only in exports—spot-check CSV row hashes, not just UI.",
            "Activity Stream vs Timeline ordering can invert under load—burst-send before comparing.",
        ],
        "merge": [
            "Merge toggles interact with duplicate detection; watch for duplicate thread rows after merge.",
            "Primary email change mid-flow can fork threads—retest with merge on and off.",
        ],
        "lifecycle": [
            "Opt-out plus closed-thread matrices are thin in internal search—build a small state table in Jira.",
            "Lifecycle admin defaults change Add/Reply availability—pair with purge regression when privacy is on.",
        ],
        "error": [
            "Vendor bounce vs REST failure need different copy; screenshot both paths for support alignment.",
            "Inject failures on both Default SMTP and Email Analytics lanes before signing off UI text.",
        ],
        "send": [
            "Attachment limits differ by channel; max count, size, and virus-scan rejection each deserve their own visible failure message.",
            "Template override can blank bodies—watch for recruiters seeing an empty body preview right before send.",
        ],
        "shell": [
            "SSP gating looks like a missing feature when SKU is wrong—stamp tenant pack in test data.",
            "XO-only shell stories still need mail setup proof—attach Notifications screenshot to defects.",
        ],
        "compose_ui": [
            "Discard double-submit is common under slow networks—throttle in automation if possible.",
            "RTE focus and keyboard toolbar regress on zoom—add one accessibility pass per milestone.",
        ],
        "general": [
            "Tenant mail and template health dominate false positives—log mail mode and active branded template in every defect.",
            "Weak Salomon precedent on this title—lean on Jira scenarios and add one explicit negative per row.",
            "Unread and notification stories need non-colour cues if Jira only references blue styling.",
            "Slow-network double-submit on discard/send still appears in support threads—note automation throttle only after user symptom is named.",
            "Attachment and virus-scan limits differ by channel—split recruiter vs candidate paths when both appear in the epic.",
            "Lifecycle and opt-out matrices are thin in search—capture a small state table in Jira before hardening.",
            "REST-only failures need different copy than SMTP bounce—pair each UI state with the backing signal name.",
            "Agency vs recruiter isolation regressions often need URL tamper checks, not only hidden buttons.",
            "Reporting surfaces dedupe events differently—call out expected counts per surface when Jira spans Activity Stream and Timeline.",
        ],
    }
    seq = stress.get(b, stress["general"])
    return "Salomon — " + pick(seq, key)


def xo_cell(key: str, summary: str, b: str) -> str:
    tail = [
        f"Batched <code>cl: Conversation</code> / <code>Conversation Message</code> hits apply; no extra class for {key}.",
        f"Nearest named hook from batch: <code>Purge Conversation Message Data</code>—confirm vs Jira PDT list for {key}.",
        f"WATS bindings on conversation messages surfaced; REST polling should be validated in code review for {key}.",
        f"No hopper match in batch for {key}—confirm ownership with engineering ({escape(summary[:50])}…).",
    ]
    risk = ""
    if key == "HRREC-92022" or b == "notify":
        risk = " XO MCP — risk: My Conversations / bell routing not visible in batch metadata—needs engineering map."
    body = "XO MCP — " + pick(tail, key) + risk
    replay = (
        " Peanut — Not queried (draft replay from frozen formatter output; "
        "live gap-review runs may add Peanut MCP when similar-issue or repo evidence warrants)."
    )
    return body + replay


def gap_pct(b: str, key: str) -> int:
    if key == "HRREC-92022" or key == "HRREC-92013":
        return 58
    base = {"purge": 54, "agency": 52, "notify": 50, "report": 48, "merge": 52, "lifecycle": 50, "error": 53, "send": 46, "shell": 42, "compose_ui": 44, "general": 40}
    return base.get(b, 40) + (key_num(key) % 5)


def gap_risk_status(p: int) -> tuple[str, str]:
    """Map legacy numeric tension (`gap_pct`) to Gap Likelihood label + colour (formatter / dedup aid)."""
    if p >= 56:
        return "Very High", "Red"
    if p >= 52:
        return "High", "Yellow"
    if p >= 48:
        return "Medium", "Blue"
    if p >= 44:
        return "Low", "Green"
    return "Very Low", "Grey"


def gap_risk_cell(b: str, key: str) -> str:
    """Confluence Storage: Gap Likelihood status macro (formatter heuristic)."""
    p = gap_pct(b, key)
    title, _colour = gap_risk_status(p)
    return gap_likelihood_status_macro(title)


def pm_jira_insight(summary: str, key: str, b: str) -> str:
    """PM-facing first Jira bullet: outcome / gap—avoid pasting the title alone (plain text; escaped in pm_ul)."""
    s = summary.lower()
    tail = summary.strip()
    if "initialisation" in s or "ssp" in s or "growth" in s:
        return pick(
            [
                f"Slice risk: SSP growth vs baseline changes whether recruiters see this email task—name which tenant pack Jira assumes for {key}.",
                "Refinement gap: My Tasks vs candidate profile entry should behave the same for visibility—call out if Jira only names one path.",
            ],
            key,
        )
    if "empty state" in s:
        return pick(
            [
                "Recruiters opening an empty thread should see trustworthy copy and no ghost draft after refresh—confirm both entry points in Jira.",
                "User-visible risk: empty state copy differs by route; say which recruiter journey must match Figma before build.",
            ],
            key,
        )
    if "notification" in s:
        return pick(
            [
                "Recruiters should see consistent notification content across bell, device mail, and in-app surfaces—Jira should name what ‘right’ looks like for this candidate.",
                "Risk: mixed channels on one profile can show mismatched fields—tighten acceptance around what the recruiter actually reads.",
            ],
            key,
        )
    if "admin" in s and "enable" in s:
        return "Product decision: when admins flip the 2-way email channel, recruiters and candidates should see eligibility change together—Jira should spell the visible before/after."
    if "does not have access" in s or "no access" in s:
        return "Recruiters blocked from compose should see a clear, honest reason (domain, role, channel, masking)—Jira should list each block state and expected message."
    if "panel expand" in s or "grow button" in s or ("expand" in s and "panel" in s):
        return pick(
            [
                "UX risk: panel grow/collapse should keep scroll position and focus; duplicate compose instances read as a product bug, not polish.",
                "Recruiters should not lose context when resizing the compose panel—name shells where behaviour must match.",
            ],
            key,
        )
    if "does not see any tabs" in s or "do not see any tabs" in s:
        return "Non-agency candidates should never see agency-only chrome or dead affordances—capture expected navigation and deep-link behaviour in Jira."
    if "collapses" in s and "profile" in s:
        return "When recruiters collapse the panel while viewing the profile, drafts and context chips should behave predictably—Jira should say what ‘wrong’ looks like."
    if "read and reply" in s or "message threads" in s or "clicking on a message" in s:
        return "Thread reading should stay ordered under slow networks and mid-poll cancels—describe the recruiter-visible failure modes Jira must cover."
    if "compose" in s and "non-agency" in s:
        return "Compose for non-agency candidates should hide agency-only paths and respect masking on To/From—tighten who sees what before build."
    if "compose" in s and ("agency user" in s or "agency candidate" in s):
        return "Agency compose must never leak recruiter-only bodies; refinement should name the cross-role stories that prove isolation."
    if "to, from" in s or "from address" in s or "to address" in s:
        return "Picklists for To/From should recover gracefully from empty, revoked, or masked addresses—Jira should list the recruiter-visible outcomes per bad combination."
    if "rte" in s or ("buttons" in s and "rte" in s):
        return "Rich text and toolbar behaviour (keyboard, paste, sanitised HTML) should match design intent—call out accessibility gaps as user-visible risks."
    if "attach" in s and "non-supported" in s:
        return "Unsupported files should surface clear errors and never leave half-uploaded chips—tie each failure to what the recruiter sees."
    if "attach" in s and "ui only" in s:
        return "UI-only attach still promises honest limits later—document what recruiters see now vs after wire-up so expectations stay aligned."
    if "validation" in s and "send" in s:
        return "Send-time validation should stop bad sends with plain-language errors (blank subject, overrides, concurrent edits)—list each recruiter-visible case."
    if "send message" in s and "no attachment" in s:
        return "Plain send should show honest progress and recover from failure without duplicating thread rows—name the visible states Jira owns."
    if "send message" in s and "attachment" in s:
        return "Large attachment sends should survive panel collapse and vendor timeouts—describe what recruiters experience when the edge is hit."
    if "discard" in s and "page" in s:
        return "Leaving the page without pressing Discard should never silently lose work—map each leave-route to discard vs autosave expectations."
    if "discard" in s and "button" in s:
        return "Discard should not double-fire destructive actions; cancel should return recruiters to a stable editor."
    if "unread" in s or "blue" in s:
        return "Unread cues should work without relying on colour alone and stay in sync when another recruiter reads the thread—accessibility + multi-reader risk."
    if "style" in s and "figma" in s:
        return "Visual-only stories still need breakpoints and motion preferences called out—say what ‘off spec’ means for recruiters scanning mail."
    if "bounce" in s:
        return "Bounced mail should show vendor-backed copy recruiters can act on without losing thread context—avoid generic error blobs."
    if "rest error" in s:
        return "REST failures should read differently from bounces and offer a credible retry path—capture correlation details for support without jargon walls."
    if "candidate changes their email" in s:
        return "Mid-compose email changes should block stale sends with a clear banner—describe the recruiter journey when contact data shifts."
    if "opt-out" in s:
        return "Candidate opt-out should stop outbound mail with a clear recruiter-facing reason while inbound policy stays understandable."
    if "switch between tabs" in s or "tabs for candidate and agency" in s:
        return "Switching agency vs candidate tabs must not bleed drafts or show recruiter-only bodies—name the visible leakage to guard against."
    if "agency cannot see" in s:
        return "Agency users should hit a hard empty/forbidden experience on recruiter-only URLs—not just missing buttons—document expected behaviour."
    if "closed and non-closed" in s or "both conversations are closed" in s:
        return "Closed vs open conversation mixes change Add/Reply—capture the recruiter-visible matrix before build."
    if "sent, not delivered" in s or "tags on messages" in s:
        return "Delivery tags should converge with vendor reality without confusing recruiters—note timing and tooltip expectations."
    if "purge" in s or "pdt" in s:
        return "After purge, recruiters should see the privacy-aligned thread state Jira promises—list which surfaces must go empty vs archived."
    if "lifecycle" in s and "tenant" in s:
        return "Tenant lifecycle defaults change Add/Reply—call out admin lag and active-draft interactions for this slice."
    if "reporting" in s or "not broken" in s:
        return "Reporting regression needs concrete report names and export baselines—say what ‘broken’ looks like to a hiring manager scanning dashboards."
    if "merged" in s or "merge" in s:
        return "Merged duplicate applications can fork threads or unread counts—document the recruiter-visible outcome when merge toggles differ."
    if "candidate attaches" in s:
        return "Candidate-side rejections should surface in-thread errors recruiters notice—pair file-type and virus-scan stories with visible copy."
    if "my conversations" in s and "refactor" in s:
        return "Refactor slice should list user-visible regressions (deep links, counts, mark-read) PMs can track without reading code."
    if "activity stream" in s or "timeline" in s:
        return "Same email events should read consistently across Activity Stream, Timeline, and Candidate Communications—name tolerance in plain language."
    if "2-way email" in s and "comms channel" in s:
        return "Turning the channel off mid-flight should not strand drafts or confuse candidates—spell recruiter + candidate messaging in Jira."
    short = tail[:100] + ("…" if len(tail) > 100 else "")
    return pick(
        [
            f"Slice focus for {key}: {short}—call out what is still ambiguous for recruiters or admins before build.",
            f"Refinement ask: translate this summary into explicit happy and unhappy paths recruiters can recognise ({short}).",
        ],
        key,
    )


def pm_ul(summary: str, key: str, b: str) -> str:
    ji = escape(pm_jira_insight(summary, key, b))
    return (
        "<ul>"
        f'<li><strong>Jira —</strong> {ji}</li>'
        f'<li><strong>Salomon —</strong> {escape(salomon_pm(b, key))}</li>'
        f'<li><strong>Deployment Agent —</strong> {escape(da_pm(key, b))}</li>'
        "</ul>"
    )


def qa_ul(summary: str, key: str, b: str) -> str:
    sal_body = qa_salomon(b, key)
    if sal_body.startswith("Salomon — "):
        sal_body = sal_body[len("Salomon — ") :]
    j_raw = qa_jira_first_line(summary, key, b)
    if j_raw.startswith("Jira — "):
        j_body = j_raw[len("Jira — ") :].lstrip()
    else:
        j_body = j_raw
    da_qa = qa_da_line(key, b)
    d_head, d_tail = da_qa.split(" — ", 1)
    extra = qa_functional_extra(summary, key, b)
    return (
        "<ul>"
        f'<li><strong>Jira —</strong> {escape(j_body)}</li>'
        f'<li><strong>Salomon —</strong> {escape(sal_body)}</li>'
        f'<li><strong>{escape(d_head)} —</strong> {escape(d_tail)}</li>'
        f"{extra}"
        "</ul>"
    )


def _verdict_pick(pairs: list[tuple[str, str]], key: str) -> tuple[str, str]:
    """Stable per-key (Finding body, Recommended next step) from a pool."""
    return pairs[key_num(key) % len(pairs)]


def verdict_ul(summary: str, key: str, b: str) -> str:
    s = summary.lower()
    if key == "HRREC-92022":
        fnd = "Thin spec: OE dependency and refactor called out without testable AC."
        step = "Split refactor from notification behaviour; add measurable outcomes pre-sprint."
    elif key == "HRREC-92013":
        fnd = "Exploratory regression: no explicit report inventory or pass/fail gates."
        step = "Attach report pack list and owners (Activity Stream, Timeline, communications)."
    elif b == "purge":
        fnd = "Purge targets named; post-purge recruiter-visible thread state still ambiguous."
        step = "Align Privacy, Recruiting UX, QE on empty vs archived UI after purge."
    elif b == "agency":
        fnd = "Agency isolation needs stronger negative testing than the title alone."
        step = "Add URL tamper checks and UDMF on/off duplicate matrix to the test plan."
    elif b == "error":
        fnd = "Bounce vs REST failures need distinct copy and injectors per tenant lane."
        step = "Document which failure injectors the SUV supports before copy sign-off."
    elif b == "shell":
        fnd = "SSP initialisation depends on growth SKU and which shell hosts the task—false failures are common."
        step = "Publish a tiny matrix: growth on/off × My Tasks vs profile × expected visibility for this key."
    elif b == "send":
        fnd, step = _verdict_pick(
            [
                (
                    "Send and attachment limits sit on shared vendor rails—template blank-body risk bleeds across sibling mail stories.",
                    "Publish MiB, count, and file-type table for this key; add one Edit Tenant Setup - Notifications screenshot to the Jira.",
                ),
                (
                    "Large sends and template overrides interact: recruiters can see success UI while mail never leaves when body is blank.",
                    "Pair this story with the Notifications owner; name which lane (Default SMTP vs Email Analytics) each defect used.",
                ),
                (
                    "Retry and timeout behaviour is easy to duplicate across send keys—acceptance rarely says what the recruiter reads on failure.",
                    "Tie each failure UI string to bounce vs REST vs vendor timeout in Jira so support language stays consistent.",
                ),
                (
                    "Optimistic thread updates can double-append or reorder when two sends race—titles rarely spell the unhappy path.",
                    "Add a short note on concurrent send from two shells and expected thread ordering for this slice.",
                ),
                (
                    "Attachment-heavy sends stress panel collapse and background navigation—risk is skipped if only happy-path attach is tested.",
                    "Call out collapse-during-send and return-to-thread expectations explicitly for this key before hardening.",
                ),
                (
                    "Candidate vs recruiter attach limits may diverge—one story owning both paths reduces false ‘cannot reproduce’.",
                    "Tag whether this key owns candidate attach, recruiter attach, or both; link the paired key if split.",
                ),
            ],
            key,
        )
    elif b == "compose_ui":
        fnd, step = _verdict_pick(
            [
                (
                    "Compose and discard flows are navigation-sensitive; Jira rarely lists every leave-route recruiters actually use.",
                    "Enumerate back, deep link, and task-switch routes with discard vs autosave expectations per route for this key.",
                ),
                (
                    "Empty states and panel expand/collapse change what recruiters think was saved—stories overlap on Message Builder assumptions.",
                    "Name which shell opened compose and whether My Tasks vs profile entry must match for this slice.",
                ),
                (
                    "Discard modal timing vs autosave is a common gap when titles only mention one button path.",
                    "Document cancel vs confirm outcomes and whether a second discard prompt is acceptable for this flow.",
                ),
                (
                    "RTE-only or style-only slices still need recruiter-visible failure text when sanitisation strips content.",
                    "Add one ‘messy paste’ example and the expected recruiter-facing result to Jira for this key.",
                ),
                (
                    "Validation-on-send stories overlap field-level checks—ownership blur causes duplicated manual tests or holes.",
                    "List which validations are owned here vs in sibling send keys; drop duplicate rows from the test plan.",
                ),
            ],
            key,
        )
    elif b == "merge":
        fnd = "Merge and duplicate-application logic can fork threads or unread counts unexpectedly."
        step = "Document expected thread ID and unread behaviour with merge toggle on vs off in refinement."
    elif b == "lifecycle":
        fnd, step = _verdict_pick(
            [
                (
                    "Lifecycle, opt-out, and closed-thread states interact—Add/Reply rules are easy to contradict across neighbouring stories.",
                    "Add a compact state matrix (opt-out × closed × draft) with one recruiter-visible outcome per cell for this key.",
                ),
                (
                    "Closed-thread messaging overlaps opt-out and channel toggles—titles hide which banner wins when two apply.",
                    "Spell the copy stack: which message shows when closed, opted out, and channel off; link related keys explicitly.",
                ),
                (
                    "Tenant lifecycle defaults lag admin changes—recruiters can see stale Add/Reply while policy already moved.",
                    "Capture propagation delay expectations and what recruiters should see during the lag window for this slice.",
                ),
                (
                    "Candidate email changes mid-flight intersect lifecycle rules—risk is a silent send to the wrong address.",
                    "Pair this key with the contact-change story; say who owns banner text vs send blocking.",
                ),
                (
                    "Agency vs candidate tab switches amplify lifecycle edge cases—draft retention is underspecified in titles alone.",
                    "Note draft and context-chip behaviour when switching tabs under closed or opted-out states for this key.",
                ),
            ],
            key,
        )
    elif b == "notify":
        fnd = "Notification payload and routing (bell vs inbox vs device) are under-specified vs compose."
        step = "List observable notification fields and failure modes; align with My Conversations refactor owners."
    elif b == "report":
        fnd = "Reporting acceptance is fuzzy unless each surface names expected cardinality and timing."
        step = "Name concrete report IDs or exports and a burst-send recipe before calling this story done."
    elif any(x in s for x in ("read", "reply", "thread", "unread", "marker", "message")):
        fnd, step = _verdict_pick(
            [
                (
                    "Read-state and thread ordering depend on polling cadence and partial fetches—titles rarely spell the unhappy recruiter view.",
                    "Add mark-read ownership, multi-recruiter timing, and refresh cadence notes to Jira; link send-order risks where relevant.",
                ),
                (
                    "Unread markers and blue-dot removal interact with another recruiter reading the same thread—race stories cluster in QA.",
                    "Describe what the second recruiter should see within a few seconds; avoid colour-only cues in acceptance.",
                ),
                (
                    "Message list density and expand/collapse change which rows look unread—shell differences create false defects.",
                    "Stamp shell (My Tasks vs profile) and viewport size in the defect template for this slice.",
                ),
                (
                    "Thread read/reply entry points share Message Builder polling assumptions with compose—overlap causes skipped negatives.",
                    "Tag whether slow-network or mid-poll cancel cases belong to this key or a sibling read story.",
                ),
                (
                    "Clicking through from notifications into a thread reorders timestamps when ingest lags—acceptance is often silent.",
                    "Name expected ordering when vendor webhooks arrive late; pair with notification key if split.",
                ),
                (
                    "Unread counts in headers vs thread bodies can disagree under burst mail—PMs need explicit tolerance language.",
                    "Add a tolerance window in plain language and which surface is source of truth for this key.",
                ),
                (
                    "Full-message view vs list preview can show different read flags—recruiters report this as ‘random’ without guidance.",
                    "Document list vs detail read semantics and when each should flip for this slice.",
                ),
                (
                    "Tags like sent vs not delivered need tooltip and refresh behaviour—otherwise reporting and inbox disagree in demos.",
                    "Align tooltip copy with support KB; note refresh after vendor state changes for this key.",
                ),
            ],
            key,
        )
    elif any(x in s for x in ("compose", "rte", "from", "subject", "attach", "discard", "validation")):
        fnd, step = _verdict_pick(
            [
                (
                    "Compose work is buildable but overlaps neighbouring send and discard stories—risk is duplicated effort or skipped negatives.",
                    "Tag scenarios owned by this key vs send/discard siblings; remove duplicate manual rows from the plan.",
                ),
                (
                    "RTE, To/From, and subject lines share template and masking assumptions—titles hide cross-role leakage risks.",
                    "Call out agency vs recruiter preview boundaries and masked reply-to expectations for this slice.",
                ),
                (
                    "Attach UI-only paths promise limits that send-time paths must honour later—mismatch reads as churn to recruiters.",
                    "Document today’s recruiter-visible limits and the future wire-up owner in Jira for this key.",
                ),
                (
                    "Validation messaging overlaps send-time errors—two keys can ship contradictory copy if not coordinated.",
                    "List each validation string and the send path it pairs with; link the owning send key.",
                ),
                (
                    "Discard-by-navigation vs discard button doubles destructive paths—easy to contradict with autosave stories.",
                    "Map each leave route to discard modal, autosave, or silent keep for this key.",
                ),
                (
                    "Panel expand while editing To/From can reset picklists—feels like data loss though technically ‘refresh’.",
                    "Describe focus and selection retention expectations after resize for this slice.",
                ),
                (
                    "Non-agency vs agency compose hides different chrome—false ‘missing feature’ bugs when testers use the wrong persona.",
                    "State candidate type and role in the defect template; include one negative agency URL check if relevant.",
                ),
                (
                    "Style-only figma slices still need recruiter-visible drift rules—otherwise QA argues polish vs functional.",
                    "Add breakpoint list and one reduced-motion expectation if in scope for this key.",
                ),
            ],
            key,
        )
    else:
        fnd, step = _verdict_pick(
            [
                (
                    "Tenant mail setup (templates, SMTP vs analytics) still dominates whether this slice looks broken in SUV QA.",
                    "Keep draft-loss, polling, and REST-only failure call-outs where Jira references them; log mail mode in each defect.",
                ),
                (
                    "Admin toggles for mail and notifications change recruiter-visible eligibility faster than titles imply.",
                    "Capture before/after screenshots for Edit Tenant Setup - Notifications when reproducing odd compose behaviour.",
                ),
                (
                    "Branded template conflicts mimic product bugs—recruiters see blank or wrong bodies without obvious admin cause.",
                    "Note single active template state and any override rows tied to this key’s scenario.",
                ),
            ],
            key,
        )
    fnd = f"{key} — {fnd}"
    return (
        "<ul>"
        f"<li><strong>Finding:</strong> {escape(fnd)}</li>"
        f"<li><strong>Recommended next step:</strong> {escape(step)}</li>"
        "</ul>"
    )


def _bdd_plain_title(summary: str) -> str:
    t = summary.strip()
    if t.upper().startswith("PH:"):
        t = t[3:].strip()
    return t


def bdd_cell(summary: str, key: str, b: str) -> str:
    s = summary.lower()
    title = escape(_bdd_plain_title(summary)[:110]) + ("…" if len(_bdd_plain_title(summary)) > 110 else "")
    kid = escape(key)

    def block(scenario: str, given: str, when: str, then: str) -> str:
        return (
            f"<p><strong>Scenario ({escape(scenario)})</strong></p>"
            f"<p><strong>Given</strong> {given}</p>"
            f"<p><strong>When</strong> {when}</p>"
            f"<p><strong>Then</strong> {then}</p>"
        )

    if key == "HRREC-92013":
        return block(
            "reporting",
            "standard and lightly customised recruiting reports chosen for milestone regression",
            "high-volume 2-way email events are generated across Activity Stream, Timeline, and Candidate Communications",
            "exports and on-screen totals stay within agreed tolerance versus pre-feature baselines and no new failure signatures appear",
        )
    if b == "purge":
        return block(
            "purge visibility",
            "an active 2-way email thread on a candidate job application covered by Jira’s purge list",
            "a privacy admin completes the Recruiting Communications purge task for that candidate",
            "the recruiter email panel shows the agreed post-purge state and purged bodies are not retrievable from in-scope UI paths",
        )
    if "discard" in s and "page" in s:
        return block(
            "navigation discard",
            "an unsent draft exists in the compose editor opened from the candidate profile shell",
            "the recruiter leaves the page via a route that does not press Discard first",
            "the discard confirmation appears and cancel preserves the draft per Jira",
        )
    if key == "HRREC-92036":
        return block(
            "attachments + templates",
            "a recruiter prepares the maximum allowed attachment mix for this channel",
            "a Recruiting Communications template override is active in Edit Tenant Setup - Notifications",
            "outbound mail still has non-empty body text and attachments expected by Jira’s own scenarios",
        )
    if b == "shell":
        return block(
            f"SSP shell {kid}",
            "two tenants differ only by SSP growth pack and mail setup is otherwise identical",
            f"the recruiter validates the behaviour in {title}",
            "task visibility and panel entry match the growth matrix documented in Jira—no false missing-feature defects",
        )
    if b == "notify":
        return block(
            f"notification {kid}",
            "device email alerts and bell vs My Conversations entry points are configured per the defect notes",
            f"the event in {title} fires for the candidate profile under test",
            "the delivered notification fields match Jira and no duplicate or silent drop occurs across channels",
        )
    if b == "agency":
        return block(
            f"agency isolation {kid}",
            "separate authenticated agency and recruiter sessions on the same tenant",
            f"the agency user attempts the recruiter-only flows implied by {title}",
            "agency sees only the allowed surfaces; recruiter-only URLs and bodies remain inaccessible",
        )
    if b == "error":
        return block(
            f"failure path {kid}",
            "the SUV lane (Default SMTP vs Email Analytics) is recorded in the test log",
            f"the failure mode in {title} is triggered with a captured correlation or vendor code",
            "UI copy matches the failure class (bounce vs REST) and recovery steps do not contradict support guidance",
        )
    if b == "merge":
        return block(
            f"merge {kid}",
            "automatic candidate merge and UDMF duplicate settings are set to the scenario under test",
            f"the candidate situation in {title} occurs on two applications to the same requisition",
            "thread IDs, unread badges, and send eligibility match the documented merge expectation for that toggle state",
        )
    if b == "lifecycle":
        return block(
            f"lifecycle {kid}",
            "conversation lifecycle admin defaults and opt-out flags match the matrix row under test",
            f"the recruiter or candidate state in {title} is exercised",
            "Add/Reply availability, info banners, and inbound handling match the matrix cell—no contradictions with sibling closed-thread stories",
        )
    if b == "report":
        return block(
            f"reporting {kid}",
            "named exports and on-screen widgets from Jira’s inventory exist on the SUV",
            f"email conversation events are generated for {title}",
            "each surface shows consistent counts and ordering within the agreed SLA window",
        )
    if "discard" in s and "button" in s:
        return block(
            f"discard button {kid}",
            "an unsent draft with edits exists in the compose editor",
            "the recruiter clicks Discard and confirms or cancels deliberately",
            "the dialog cannot double-submit a destructive action and cancel returns to a consistent editor state",
        )
    if b == "compose_ui" and "empty" in s:
        return block(
            f"empty state {kid}",
            "no prior conversation exists for the candidate application under test",
            f"the recruiter opens the email task per {title}",
            "empty-state messaging matches Figma and no skeleton loaders loop indefinitely",
        )
    # Unique default: key + summary hook + bucket-specific Then
    given_map = {
        "shell": "SSP SKU, mail routing, and security domains match the milestone SUV documented for this epic",
        "send": "attachment limits, virus-scan policy, and template override state are recorded for the lane under test",
        "compose_ui": "local draft exists and navigation routes in scope are enumerated in the test log",
        "merge": "duplicate detection and merge toggles are set per the matrix row before exercising the flow",
        "lifecycle": "opt-out and closed-thread flags are set per the matrix row before exercising the flow",
        "notify": "bell, device mail, and optional alerts are configured as described in the defect template",
        "report": "baseline export hashes for the named widgets exist before the burst-send recipe runs",
        "general": "tenant mail setup (Default SMTP vs Email Analytics, active template) is fixed for the run",
    }
    given = given_map.get(b, given_map["general"])
    then_map = {
        "shell": "observed shell behaviour matches Figma and SKU gating cannot explain the defect alone",
        "send": "send completes or fails with limits enforced and no blank outbound solely from template override",
        "compose_ui": "UI matches Figma for this slice and discard or validation behaves per the enumerated routes",
        "merge": "merge outcomes match the single documented expectation for thread and unread state",
        "lifecycle": "lifecycle-dependent buttons and banners match the documented matrix cell",
        "notify": "notification content and timing match Jira for this slice without cross-channel drift",
        "report": "each listed surface stays within tolerance versus baseline after the recipe",
        "general": "UI matches Figma and defects are not explained by undocumented mail misconfiguration alone",
    }
    then = then_map.get(b, then_map["general"])
    return block(
        kid,
        given,
        f"the recruiter performs the behaviour described for {kid}: {title}",
        then,
    )


def row(key: str, summary: str) -> str:
    b = bucket(summary)
    story_cell = (
        f'<p><a href="https://jira2.workday.com/browse/{escape(key)}">{escape(key)}</a></p>'
        f"<p>{escape(summary)}</p>"
    )
    return (
        f'<!-- gap-review {key} --><tr>'
        f"<td>{story_cell}</td>"
        f"<td>{gap_risk_cell(b, key)}</td>"
        f"<td>{pm_ul(summary, key, b)}</td>"
        f"<td>{qa_ul(summary, key, b)}</td>"
        f"<td><p>{xo_cell(key, summary, b)}</p></td>"
        f"<td>{verdict_ul(summary, key, b)}</td>"
        f"<td>{bdd_cell(summary, key, b)}</td>"
        "</tr>"
    )


def main() -> str:
    rows = "\n".join(row(k, s) for k, s in KEYS)
    return f"""<h1>Net-New Story Gap Review &mdash; 2026-05-15 (HRREC-82977)</h1>
<h2>Executive summary (for PM)</h2>
<ul>
<li>Run tier: B (timeboxed)&mdash;theme-based Salomon/DA and batched Dev lens (XO/Peanut) where noted; not full reference per-key Salomon depth.</li>
<li><strong>Draft replay HTML:</strong> <strong>Gap Likelihood</strong> status lozenges map from a formatter helper (bucket + key-stable jitter), not the live <strong>Verdict + BDD</strong> rubric in the skill&mdash;treat detail as Verdict + PM/QA cells.</li>
</ul>
<h3>Top 5 gaps (epic)</h3>
<ul>
<li>Align OE dependencies (e.g. DROGON-1005), ingest, notification, and UI shells before edge-case hardening across HRREC-82977.</li>
<li>Centralise tenant realism for Notifications (template override / blank-body), SMTP vs Email Analytics, agency isolation, purge vs thread visibility, and UDMF/merge toggles&mdash;QE needs one shared checklist.</li>
<li>De-duplicate manual tests across compose/send/discard/read stories that share Message Builder assumptions.</li>
<li>Thin-spec rows (e.g. HRREC-92022 My Conversations refactor, HRREC-92013 reporting sweep) need sharper AC before sizing.</li>
<li>Sequence risk: land SSP shell work (91946/91948) before notification (91975) and reporting (92035) after send logging is stable.</li>
</ul>
<h3>Top 5 strengths (epic)</h3>
<ul>
<li>Strong internal precedent clusters on Recruiting Communications PDT/purge, templates, and agency/UDMF threads&mdash;good fuel for shared QA themes.</li>
<li>Child stories collectively cover compose through reporting without an obvious orphan surface in the inventory.</li>
<li>Every draft row carries Verdict + Gap Likelihood for fast skimming in this replay HTML.</li>
<li>Skipped doc-writer keys (HRREC-90852 AG:, HRREC-90853 RN:) are called out so scope is auditable.</li>
<li>Publish path documents <code>replace</code> plus continuation <code>append</code> when MCP payload limits hit&mdash;operators know how the page was assembled.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li>Salomon themes: (1) Recruiting Communications PDT / purge, (2) templates, blank-body, SMTP vs analytics, (3) UDMF / agency dupes, mass-send discussions.</li>
<li>Dev lens themes: <code>cl: Conversation</code>, <code>Conversation Message</code> (WATS, Purge Conversation Message Data)&mdash;XO MCP batch; Peanut not invoked in this draft replay (see Dev lens cells).</li>
<li>DA: one batch on Notifications, auto-merge, purge vs threads, uncertain universal mass-send cap for this compose path.</li>
<li>Spike candidate: My Conversations notification routing vs bell once engineering maps metadata.</li>
</ul>
<table>
<tbody>
<tr><th>Story</th><th>Gap Likelihood</th><th>PM</th><th>QA</th><th>Dev lens</th><th>Verdict</th><th>Missing BDD</th></tr>
{rows}
</tbody>
</table>
"""


if __name__ == "__main__":
    html = main()
    out = "/Users/david.denham/product-manager-agent/docs/initiatives/two-way-email/drafts/gap_review_82977_tier_b_2026-05-15.html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(out)
    print("utf8_bytes", len(html.encode("utf-8")))