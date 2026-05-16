#!/usr/bin/env python3
"""Generate Storage-friendly HTML for Confluence gap review page HRREC-82977 (46 stories)."""
from __future__ import annotations

import html
import re
import sys
from html import unescape
from typing import Callable, List, Tuple

JIRA_BROWSE = "https://jira2.workday.com/browse"
EPIC = "HRREC-82977"
JQL = (
    'project = HRREC AND issuetype = Story AND "Epic Link" = HRREC-82977 ORDER BY key ASC'
)

KEYS: List[str] = [
    "HRREC-90852",
    "HRREC-90853",
    "HRREC-91946",
    "HRREC-91948",
    "HRREC-91974",
    "HRREC-91975",
    "HRREC-91978",
    "HRREC-91979",
    "HRREC-91980",
    "HRREC-91982",
    "HRREC-91985",
    "HRREC-91986",
    "HRREC-91987",
    "HRREC-91988",
    "HRREC-91989",
    "HRREC-91990",
    "HRREC-91991",
    "HRREC-91992",
    "HRREC-91993",
    "HRREC-91994",
    "HRREC-91995",
    "HRREC-91996",
    "HRREC-91997",
    "HRREC-91998",
    "HRREC-91999",
    "HRREC-92001",
    "HRREC-92002",
    "HRREC-92003",
    "HRREC-92004",
    "HRREC-92005",
    "HRREC-92006",
    "HRREC-92007",
    "HRREC-92008",
    "HRREC-92009",
    "HRREC-92010",
    "HRREC-92011",
    "HRREC-92012",
    "HRREC-92013",
    "HRREC-92014",
    "HRREC-92015",
    "HRREC-92016",
    "HRREC-92022",
    "HRREC-92029",
    "HRREC-92030",
    "HRREC-92035",
    "HRREC-92036",
]

SUMMARY: dict[str, str] = {
    "HRREC-90852": "AG: 2-way Email Communication in Workday Recruiting",
    "HRREC-90853": "RN: 2-way Email Communication in Workday Recruiting",
    "HRREC-91946": "[Initialisation] Recruiter can see Email Task on SSP (XO Only)",
    "HRREC-91948": "[Initialisation] Enabled SSP Growth/Expansion",
    "HRREC-91974": "PH: Recruiter sees Empty state of email task if opened",
    "HRREC-91975": "PH: Recruiter receives a notification",
    "HRREC-91978": "PH: Admin can enable or disable 2-way email as a comms channel",
    "HRREC-91979": "PH: Recruiter does not have access to the compose email task",
    "HRREC-91980": "PH: Recruiter sees the panel expand when clicking Add to compose an email",
    "HRREC-91982": "PH: Recruiter opens the message to read and reply",
    "HRREC-91985": "PH: Recruiter can compose an email to non-agency candidate",
    "HRREC-91986": "PH: Recruiter expands/collapses the panel to check candidate profile (context stays?)",
    "HRREC-91987": "PH: Recruiter can select To, From & Subject (UI) when composing an email",
    "HRREC-91988": "PH: Recruiter attaches documents (UI only)",
    "HRREC-91989": "PH: Recruiter can use the RTE & see the UI of buttons",
    "HRREC-91990": "PH: Recruiter can select From address from list of valid email addresses",
    "HRREC-91991": "PH: Recruiter does not see any tabs for non-agency candidate",
    "HRREC-91992": "PH: Recruiter attaches non-supported files",
    "HRREC-91993": "PH: Recruiter sees UI error validations on Send",
    "HRREC-91994": "PH: Send Message (No Attachments)",
    "HRREC-91995": "PH: Recruiter gets discard popup by changing pages",
    "HRREC-91996": "PH: Recruiter gets discard popup when they click the Discard button",
    "HRREC-91997": "PH: Recruiter sees list of messages with unread ones marked in blue",
    "HRREC-91998": "PH: Recruiter can see message threads when clicking on a message",
    "HRREC-91999": 'PH: Recruiter sees blue "unread marker" removed after clicking in the view a message in full',
    "HRREC-92001": "PH: Recruiter sees the panel expand & views full message when clicking grow or a message",
    "HRREC-92002": "PH: Style only - Recruiter sees messages showing, styled as per figma",
    "HRREC-92003": "PH: Recruiter sees error messages if their email has bounced",
    "HRREC-92004": "PH: Recruiter sees error when sending message (REST error)",
    "HRREC-92005": "PH: Recruiter sees info message and cannot send email if the candidate changes their email",
    "HRREC-92006": "PH: Candidates opt-out of receiving emails",
    "HRREC-92007": "PH: Recruiter can switch between tabs for candidate and agency comms",
    "HRREC-92008": "PH: Agency cannot see recruiter conversation",
    "HRREC-92009": "PH: Recruiter can see both closed and non-closed conversation in the same panel if one is active",
    "HRREC-92010": "PH: Recruiter sees tags on messages showing updating state (sent, not delivered)",
    "HRREC-92011": "PH: Privacy Admin purges PDTs for 2-way email - Candidate/Job App",
    "HRREC-92012": "PH: Admin can configure conversation lifecycle tenant setting?",
    "HRREC-92013": "PH: Existing reporting features are not broken",
    "HRREC-92014": "PH: Recruiter cannot see reply or Add when both conversations are closed & sees info message",
    "HRREC-92015": "PH: Candidate has 2 applications to the same JR and gets merged",
    "HRREC-92016": "PH: Candidate attaches non-supported files",
    "HRREC-92022": "PH: My Conversations will require an XO (small) refactor",
    "HRREC-92029": "PH: Recruiter can compose an email to agency user or agency candidate",
    "HRREC-92030": "PH: Recruiter can select To address from list of valid email addresses",
    "HRREC-92035": "PH: Email communications are visible in Activity Stream, Timeline and Candidate Communications",
    "HRREC-92036": "PH: Send Message (With Attachments)",
}

SALOMON_ROLLUP = (
    "Cross-story KB themes: Candidate Communication CRF aggregation across job applications (HRCRM-3421 / HRREC-83228); "
    "Workday Messaging retention, encryption, purge via Purge framework (#ask-messaging); "
    "Message Template language should prefer candidate language over recruiter locale (HRREC-76679)."
)

SALOMON_SOURCES = (
    "Sources: Slack #ask-messaging (messaging retention/security); Slack #hrrec_prodsupport / HRCRM-3421 (CRF enhancements); "
    "Jira HRREC-76679 (template translation triage)."
)

DA_ROLLUP = (
    "DA thread d7205e29-81ee-4e17-ad44-c6b9ec736c46 (May 2026): inbound conversational email is not documented like SMS/"
    "My Conversations—Reply-To / external inbox patterns remain common; Edit Tenant Setup - Notifications controls outbound "
    "routing, Reply-To, unsubscribe/manage preferences; Recruiting Communications PDT already includes recruiting email "
    "attachments, Send Message/Invite attachments, notification generated documents, and recruiting notification events; "
    "email-notification attachment leading practice cited at 7 MB vs several stories assuming ~30 MB cumulative—reconcile before GA."
)


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def ul(items: List[str]) -> str:
    """Each item is plain text (HTML-escaped)."""
    return "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul>"


def ul_html(items: List[str]) -> str:
    """Each item is already safe XHTML snippet for inside <li>...</li>."""
    return "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"


def story_cell(key: str) -> str:
    summ = SUMMARY[key]
    href = f"{JIRA_BROWSE}/{key}"
    return (
        f'<td><!-- gap-review {key} --><a href="{href}">{key}</a><br/>{esc(summ)}</td>'
    )


def thin_pm_qa_html() -> Tuple[List[str], List[str]]:
    """Thin-spec rows: use HTML strong (not Markdown) for Confluence Storage."""
    ins = "<strong>Insufficient spec</strong> — "
    pm = [
        ins + esc("Confirm intended customer-facing scope for release notes vs admin guide vs in-app only."),
        ins + esc("Identify which milestone owns first meaningful acceptance criteria."),
        ins + esc("Align with OE/Comms on whether this item blocks GA or is parallel track."),
        ins + esc("Decide owner for filling description (PM vs EM vs TW)."),
        ins + esc("Link any dependent epics or compliance gates once scope exists."),
    ]
    qa = [
        ins + esc("No executable scenarios yet — block formal test design until Given/When/Then exist."),
        ins + esc("Capture smoke checklist placeholder: environment, feature flag, SKU assumptions."),
        ins + esc("Record risk: hidden scope creep if engineering interprets title literally."),
        ins + esc("Add instrumentation expectations once flows are known (logs, analytics)."),
        ins + esc("Nightly automation: mark as not applicable until AC exist."),
    ]
    return pm, qa


def salomon_cell(extra: List[str] | None = None) -> str:
    parts: List[str] = []
    if extra:
        parts.append(esc(extra[0][:300]))
    parts.append(
        "Row-specific Salomon hits (if any) appear as the first bullet; full KB themes and Sources are in the "
        "<strong>Executive rollup</strong> bullets above."
    )
    return ul_html(parts)


def da_cell(extra: List[str] | None = None) -> str:
    parts: List[str] = []
    if extra:
        parts.append(esc(extra[0][:300]))
    parts.append(
        "Row-specific DA callouts (if any) appear as the first bullet; full tenant/config synthesis is in the "
        "<strong>Executive rollup</strong> bullets above (same DA thread)."
    )
    return ul_html(parts)


def sev(p: str, oq: List[str]) -> str:
    body = esc(p)
    if not oq:
        return body
    ol = "<ol>" + "".join(f"<li>{esc(x)}</li>" for x in oq) + "</ol>"
    return f"{body}<p><strong>Open questions:</strong></p>{ol}"


RowFn = Callable[[str], Tuple[List[str], List[str], List[str], str, str, str]]


def row_doc_ag_rn(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm, qa = thin_pm_qa_html()
    xo = [
        "No story-local XO artefacts: treat as documentation epic children until description lands.",
        "When scope firms up, re-run XO search for Message / Conversation classes tied to Recruiting email.",
        "Cross-check whether AG/RN split maps to Admin Guide vs Release Notes pipelines separately.",
        "Avoid binding implementation work to this key until AC exist.",
        "Track dependency on conversational email feature toggles and security domains once defined.",
    ]
    sal = salomon_cell(
        [
            "Admin Guide path for Candidate Engagement / campaigns often used when Community docs are incomplete (internal KB pattern).",
        ]
    )
    da_ = da_cell(
        [
            "Docs-only tickets rarely change tenant config; still confirm customer-visible behaviour statements with TW.",
        ]
    )
    sev_ = sev(
        "P2 — documentation placeholder",
        [
            "What exact artefacts (AG sections, RN bullets, screenshots) are in vs out of MVP?",
            "Which locales ship day one?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91946(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Delivers Email task affordance on candidate SSP ordering after notes and before SMS/WhatsApp per Figma.",
        "Masking: opening email task on masked job application shows same masked conversation treatment as SMS/WhatsApp.",
        "Consolidated masked icon across SMS/WhatsApp/Email when job application masked — reduces duplicate affordances.",
        "Explicitly excludes Messaging SKU requirement for 2-way email (per story notes).",
        "New Items Count may remain HRI-based for now with potential follow-up noted.",
    ]
    qa = [
        "Verify masking using Maintain Masked Recruiting Configurations (2997$16975) and Maintain Masked Job Requisition Defaults (2997$17078) plus Default All Job Requisitions.",
        "Cross-role: recruiter with masking vs without; ensure iconography matches SMS reference.",
        "Three-way visibility: email task hidden when domain absent vs greyed vs error.",
        "Tooltip and icon pixel diff against Figma node 6887-23498.",
        "Automation: story claims fully auto with UT — add coverage matrix for masked vs unmasked.",
    ]
    xo = [
        "XO-only story: confirm task binding for new Email side-panel task vs existing conversation tasks.",
        "Expect integration with conversation security domains referenced in HRREC-91979 follow-on.",
        "Validate ordering logic does not regress when WhatsApp disabled tenant-wide.",
        "Coffeehouse branch note (emily.oregan/emailSpike): ensure merge strategy documented before code freeze.",
        "Feature toggle interactions: run XO search on task visibility patterns for SSP conversation entry points.",
    ]
    sal = salomon_cell(
        [
            "Candidate communications visibility frequently spans job applications in CRFs unless filtered — relevance for icon appearing 'global' (HRREC-83228 discussion).",
        ]
    )
    da_ = da_cell(
        [
            "Masked recruiting behaviour is tenant-rule driven; document tester setup steps in internal runbook.",
        ]
    )
    sev_ = sev(
        "P1 — foundational navigation",
        [
            "Does email task appear when only legacy email (non-conversational) enabled?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91948(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Introduces explicit grow/shrink events for SSP side panel with width caps (1000px L+, 800px smaller) and modal shadow.",
        "XL screen: when content is pushed, grow overlays instead of further pushing layout.",
        "Open UX decision captured: reopen after close while composing — needs default.",
        "Switching tasks shrinks panel per Scenario 5 — impacts multi-channel workflows.",
        "Milestone test calls out My Tasks / Inbox embedding of candidate profile.",
    ]
    qa = [
        "Breakpoint matrix must match Canvas breakpoints (zero/s/m/l/xl) plus internal XXL=1920 behaviour.",
        "Event ordering: rapid grow then shrink; double dispatch; listener leaks.",
        "Verify shadow z-index against modals/toasts already on candidate profile.",
        "Keyboard and screen reader: focus trap when panel modal shadow active?",
        "My Tasks route: panel state persistence when navigating away and back.",
    ]
    xo = [
        "Panel controller likely lives outside Recruiting-only XO; document which team owns event contract.",
        "Two events (grow vs shrink) per dev notes — consumers must not infer toggle from single event.",
        "Check for existing SSP width constants to avoid drift with email compose maximum widths.",
        "Coordinate with HRREC-91980/92001 to avoid conflicting max width on Add vs Grow paths.",
        "If XO metadata not indexed for layout service, log explicit gap after hopper_search in future pass.",
    ]
    sal = salomon_cell(
        [
            "Responsive layout changes historically regress Inbox/SSP parity — search internal threads on sliding panel regressions when adding new events.",
        ]
    )
    da_ = da_cell(
        [
            "Customers with aggressive zoom/browser font scaling may hit different effective widths — capture usability caveat.",
        ]
    )
    sev_ = sev(
        "P1 — layout contract",
        [
            "Final decision on reopen state after close during compose?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91974(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "First-run experience before any thread: header, empty graphic, Compose + New + Grow visible (copy alignment with John Mugumya).",
        "Agency vs non-agency empty copy called out as open in dev notes — impacts tone and compliance.",
        "XO adds labels to Messaging Layout container and extends conversationContextInstance GET layout domain.",
        "Sets expectation that buttons can be non-functional initially but layout stable.",
        "Anchors to Figma node 6913-20249 and PRD Google doc.",
    ]
    qa = [
        "Accessibility: empty state graphic alt text; heading structure in side panel.",
        "Localization of all new labels; truncation in narrow panel.",
        "Feature off vs channel off vs no email on candidate — three distinct empty states?",
        "Ensure empty state not shown when read-only security should show historical thread instead.",
        "Visual regression against SMS empty parity patterns.",
    ]
    xo = [
        "Dev notes: new labels + New 6104$8743 in UI Label Container Messaging Layout 11111$220.",
        "Endpoint layout: conversationContextInstance view GET 5557$42319 domain extension for new labels.",
        "Re-read XO binding for empty state endpoint vs compose endpoint separation.",
        "Label keys must be discoverable for translators — confirm naming convention.",
        "If agency copy differs, plan separate label IDs to avoid conditional grammar in one string.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P1 — first impression",
        [
            "Agency-specific empty copy: yes or no for MVP?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91975(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Inbound reply triggers notification for primary recruiter and other participants after successful ingest + match.",
        "Clicking notification deep-links candidate profile and opens SSP with correct thread focused.",
        "Optional email alert path when tenant routes Candidate SMS/Email Messages notifications via email channel.",
        "Team only instantiates event; framework picks My Conversations vs Bell based on security domains.",
        "Depends on clear definition of 'participated' for multi-recruiter threads.",
    ]
    qa = [
        "Participant edge cases: forwarded threads, reassigned primary recruiter mid-thread, agency messages.",
        "Concurrent duplicate notifications for same message ID — idempotency expectations.",
        "Click-through when candidate profile URL blocked by security — graceful fallback?",
        "Email channel optional path: verify double delivery (in-app + email) acceptable.",
        "Localization of notification title/body; truncation on mobile clients.",
    ]
    xo = [
        "Expect notification type registration near existing Candidate SMS patterns; HRREC-92022 flags My Conversations refactor.",
        "Search XO for notification event bindings tied to Recruiting conversations when implementing.",
        "Security domain gating to Bell vs My Conversations must align with HRREC-91979 read vs send model.",
        "Cross-check IOP methods surfaced in My Conversations XO index (2663$168099 etc.) for touch risk.",
        "Document explicit WIDs for new notification event after creation.",
    ]
    sal = salomon_cell(
        [
            "Internal KB: Workday Messaging retention and purge patterns are mature; email-specific inbound routing in-product is not described same as SMS (DA follow-up).",
        ]
    )
    da_ = da_cell(
        [
            "DA: classic Reply-To pattern handles many inbound email replies outside conversational UI — clarify product commitment for in-app parity.",
        ]
    )
    sev_ = sev(
        "P0 — engagement loop",
        [
            "Is in-app notification mandatory if email-only users ignore Bell?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91978(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Tenant-level channel kill switch for 2-way email before recruiters see compose surfaces.",
        "Disable mid-flight blocks new sends while story calls for consistent disabled-channel messaging.",
        "Audit record on toggle change for compliance stakeholders.",
        "Rollout sequencing for pilot tenants vs GA flag.",
        "Intersects Edit Tenant Setup - Notifications patterns (DA) but story is product-level channel gate.",
    ]
    qa = [
        "Disable while REST send in flight: race with HRREC-91994 duplicate-send guard.",
        "Audit: verify immutability fields, who can read audit, retention.",
        "Partial enable: per org vs tenant vs candidate type — out of scope?",
        "Upgrade scenario: toggle persisted across weekly releases.",
        "Security: only system admin roles can mutate toggle.",
    ]
    xo = [
        "Expect integration with feature toggle services; capture WIDs when implemented.",
        "Cross-link to notification routing domain if channel disable also suppresses notifications.",
        "Search hopper for 'conversational email' toggle keys once named in metadata.",
        "Ensure REST contracts return explicit error code when disabled (paired with HRREC-92004).",
        "Validate no caching of old enablement state on client beyond TTL policy.",
    ]
    sal = salomon_cell([])
    da_ = da_cell(
        [
            "DA: admins already manage email as notification channel via Edit Tenant Setup - Notifications — align wording to avoid conflicting instructions.",
        ]
    )
    sev_ = sev(
        "P1 — enterprise rollout",
        [
            "Does disable also hard-stop inbound processing?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_91979(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "View-only recruiters must not see Add/Compose affordances; aligns trust in least-privilege UX.",
        "REST conversationContextInstance should expose write-capable boolean for UI gating.",
        "Pairs with HRREC-91985/92029 send validation stories for end-to-end consent + security model.",
        "Reduces mis-sent email risk when permissions change mid-session (see HRREC-92004).",
        "Documentation for which domain controls conversational email modify vs view.",
    ]
    qa = [
        "Security downgrade mid-compose: buttons disappear vs disabled with tooltip.",
        "Cached client state after permission revocation until refresh.",
        "Cross-check masked candidate path still allows read-only transcript.",
        "Automation: matrix domain view/modify/none for agency and non-agency.",
        "API error mapping when endpoint denies write but UI thought allowed.",
    ]
    xo = [
        "Story explicitly updates Conversation Write Access domain 146$157734 logic on REST endpoint.",
        "XO adjacency: also search Reusable Label Conversation Write Access 6104$183742 — reconcile label vs domain WID mismatch before coding.",
        "Endpoint: conversationContextInstance GET remains authoritative for header + gating flags.",
        "Consider method-level security annotations vs domain checks — document chosen pattern.",
        "Add WATS references once tests exist for permission drift.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P0 — security UX",
        [
            "Canonical WID for write access: 146$157734 vs 6104$183742?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_panel_grow(key: str, variant: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    if variant == "add":
        pm = [
            "Clicking Add (Plus) grows panel to email composition width with modal shadow per breakpoints.",
            "Ties compose initiation to explicit layout change distinct from passive reading.",
            "Depends on HRREC-91948 grow/shrink event semantics.",
            "Impacts first-time user muscle memory vs SMS compose.",
            "Figma alignment for shadow + overlay stacking.",
        ]
        qa = [
            "Double click Add spam; focus order into compose header.",
            "Screen reader announces expansion context change.",
            "When compose fails to open, panel should recover width.",
            "Tablet portrait: verify 800px cap behaviour.",
            "Concurrent Add then Grow button sequencing.",
        ]
    else:  # grow/read
        pm = [
            "Grow or open message expands to wide reading layout with overlay on XL pushed layouts.",
            "Reply in wide view opens Message Builder compose within same wide shell.",
            "Disabled conversation states hide Reply/Add with explanatory copy (closed/opt-out/etc.).",
            "Shares layout rules with HRREC-92001 structural story — avoid duplicate max-width logic.",
            "Attribution display for inbound vs outbound in expanded reading mode.",
        ]
        qa = [
            "Message click target vs row click vs Grow button — three entry points consistent.",
            "Long HTML email sanitization and XSS regression suite.",
            "When conversation disabled, ensure keyboard cannot reach hidden actions.",
            "Print/export not in scope but verify no broken overflow.",
            "Performance on long threads with images.",
        ]
    xo = [
        "Panel services likely orchestrate with Recruiting SSP shell; capture service names during hopper_search follow-up.",
        "Grow/shrink events must be idempotent at listener level.",
        "Check Message class 1$4471 relationships only if email content stored as Message instances.",
        "Coordinate attachment preview components with Blobatory references in HRREC-92036.",
        "Log if no XO class found for 'wide view' — risk from absence.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    if variant == "add":
        sev_ = sev(
            "P1 — UX shell",
            ["Does Add always start a brand-new thread vs continue an existing one?"],
        )
    else:
        sev_ = sev(
            "P1 — UX shell",
            [
                "Are Grow, row-click, and message-click guaranteed to land in the same wide-view state?",
            ],
        )
    return pm, qa, xo, sal, da_, sev_


def row_compose_nonagency(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Non-agency candidate: compose only when opted in and user has Modify on Conversational Email domain.",
        "Hides compose when not opted in — avoids illegal send attempt at UI layer.",
        "Read-only domain still allows historical read — pairs with HRREC-91979.",
        "Clarifies consent is candidate-centric not recruiter-centric.",
        "Sets stage for HRREC-91994/92036 actual dispatch stories.",
    ]
    qa = [
        "Opt-in state changes while panel open — polling vs websocket vs on-send only.",
        "Primary vs secondary email selection conflicts.",
        "Candidate without email on file — empty state vs error.",
        "Merge scenarios overlapping HRREC-92005/92015.",
        "Automation permutations for consent + security matrix.",
    ]
    xo = [
        "Expect server-side validation mirroring UI; document error codes.",
        "Conversation participant model must include candidate email snapshot.",
        "Search XO validations on candidate communications consent parallels to SMS.",
        "Feature toggles for email channel must align with HRREC-91978.",
        "If consent stored on separate BO, capture relationship WIDs.",
    ]
    sal = salomon_cell(
        [
            "KB: SMS opt-in/opt-out activity reporting exists — analogue may inform email consent reporting expectations.",
        ]
    )
    da_ = da_cell([])
    sev_ = sev("P0 — compliance", ["Is opt-in checked only on send or also on compose open?"])
    return pm, qa, xo, sal, da_, sev_


def row_draft_preserve(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Preserve rich text draft when recruiter temporarily shrinks/expands panel to peek profile fields.",
        "Maintains cursor position and formatting through transitions.",
        "Depends on local editor state — Message Builder does not persist server-side drafts (May 2026 note in discard stories).",
        "Impacts perceived reliability vs classic webmail autosave expectations.",
        "Coordinate copy with HRREC-91995/91996 discard flows.",
    ]
    qa = [
        "Stress test with large pasted content and attachments staged.",
        "Browser refresh loses draft — document known limitation prominently?",
        "Concurrent edits not in scope but single-user undo stack behaviour.",
        "Screen reader caret preservation.",
        "Mobile: virtual keyboard show/hide interactions.",
    ]
    xo = [
        "Editor likely Message Builder web component — confirm version pinned for email channel.",
        "Local storage not authorized — ensure no accidental persistence violating policy.",
        "Event hooks on panel shrink must not remount editor unnecessarily.",
        "Coordinate with MB team on lifecycle callbacks.",
        "If editor remount loses state, file defect against this story.",
    ]
    sal = salomon_cell([])
    da_ = da_cell(
        [
            "DA / story notes: no server-side draft persistence — set customer expectation accordingly.",
        ]
    )
    sev_ = sev(
        "P1 — editor state",
        [
            "Should we warn on refresh explicitly?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_header_ui(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Custom dropdowns replace native Message Builder free-text To/From fields visually.",
        "Subject line present as standard text field in email header cluster.",
        "Framework story: future recipient logic will populate dropdown data sources.",
        "Visual alignment with Figma for header spacing and error affordances.",
        "Explicitly defers actual address resolution to later stories (91990/92030).",
    ]
    qa = [
        "Keyboard navigation and typeahead in custom dropdowns.",
        "Long email addresses truncation with tooltip.",
        "RTL locales layout mirroring.",
        "Error states for required To/From before send (paired with 91993).",
        "Snapshot tests for header DOM structure.",
    ]
    xo = [
        "Message Builder configuration references generic Message class — ensure overrides do not fork MB core.",
        "Document which MB props are hidden vs disabled.",
        "Search for Message Template integration risks when subject prefilled.",
        "REST payload still canonical even if UI replaces controls.",
        "Capture MB version compatibility matrix in release notes.",
    ]
    sal = salomon_cell(
        [
            "KB: recruiter-locale vs candidate-language selection bugs historically lived in MB boolean expressions — relevant when From/To lists support localized display names.",
        ]
    )
    da_ = da_cell([])
    sev_ = sev("P2 — UI scaffold", ["When do invalid addresses surface if dropdown is custom?"])
    return pm, qa, xo, sal, da_, sev_


def row_attach_ui(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Visual attachment control in compose; pills with remove affordance.",
        "Client-side rejects disallowed types and oversize per tenant standards referenced.",
        "Pairs with HRREC-91992/92036 for negative paths and Blobatory payload.",
        "UI-only scope: no guarantee of backend ingest success here.",
        "Accessibility for file picker and pill remove buttons.",
    ]
    qa = [
        "Drag-drop vs pick file paths.",
        "Multiple files order stable for digest.",
        "Malicious file double extension attempts.",
        "Screen reader announces rejection reasons.",
        "Cross-browser differences for accept attribute.",
    ]
    xo = [
        "Blobatory IDs referenced in HRREC-92036 — UI must not leak internal IDs in user strings.",
        "Check attachment component reuse from other Workday surfaces for consistency.",
        "Client validation must mirror server allowlist to minimize frustrated sends.",
        "If MB exposes attachment hooks, document override points.",
        "Log explicit XO service for upload initiation when known.",
    ]
    sal = salomon_cell([])
    da_ = da_cell(
        [
            "DA highlights 7 MB email notification attachment practice vs stories citing ~30 MB cumulative — harmonize limits in copy and validation.",
        ]
    )
    sev_ = sev(
        "P1 — attachments",
        [
            "Which limit wins for conversational email MVP?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_rte_ui(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Renders Message Builder RTE + toolbar + Send/Discard buttons visually.",
        "Explicitly excludes GenAI sparkle button from toolbar configuration.",
        "Buttons are visual-only in this slice — actual send in HRREC-91994/92036.",
        "Formatting baseline: bold/italics/bullets per acceptance.",
        "Sets tone for future template variables if any.",
    ]
    qa = [
        "Toolbar keyboard traversal order.",
        "Ensure excluded GenAI cannot be re-enabled via tenant theme hacks.",
        "Discard and Escape handled in 91996 — cross-surface consistency.",
        "Sanitize pasted rich content from external word processors.",
        "Localization of toolbar tooltips.",
    ]
    xo = [
        "Message Builder toolbar configuration object must be documented once wired.",
        "Search MB bindings for AI assistant toggle default true.",
        "Confirm email channel uses same MB instance as SMS where possible.",
        "Capture dependency version on canvas-kit / modulr if applicable.",
        "If MB exposes unsupported plugins, disable list explicitly.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — UI parity", ["Any email-specific toolbar plugins required later?"])
    return pm, qa, xo, sal, da_, sev_


def row_from_list(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "From dropdown lists OE-provided configurations including personal vs no-reply style addresses.",
        "Impacts candidate reply routing expectations and deliverability reputation.",
        "Should surface disabled entries with rationale when configs invalid.",
        "Aligns with tenant notification Reply-To configuration (DA).",
        "Pairs with To list story HRREC-92030 for symmetrical UX.",
    ]
    qa = [
        "What happens when list empty — block compose vs fallback default.",
        "Changing From mid-thread: thread continuity rules.",
        "Verify SPF/DKIM implications only as smoke guidance, not full deliverability test.",
        "Accessibility for reading full address strings inside dropdown.",
        "Caching stale config after admin updates From list.",
    ]
    xo = [
        "Backend list endpoint must enforce security on which From identities recruiter may assume.",
        "Document WIDs for configuration business objects once known.",
        "Search XO for recruiting email sender configuration patterns.",
        "Ensure audit when From changes per message for compliance.",
        "Cross-check HRREC-92035 logging includes chosen From address.",
    ]
    sal = salomon_cell([])
    da_ = da_cell(
        [
            "DA: Reply-To and routing live under Edit Tenant Setup - Notifications — product should state interaction with per-message From list.",
        ]
    )
    sev_ = sev("P1 — deliverability", ["Who administers allowed From identities?"])
    return pm, qa, xo, sal, da_, sev_


def row_tabs_hide_nonagency(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Hides All/Candidate/Agency tabs when job application has no agency association.",
        "Default view shows direct candidate thread only — reduces clutter.",
        "Must not regress detection of agency-submitted applications incorrectly.",
        "Pairs with HRREC-92007 tab visibility for agency case.",
        "Telemetry on tab visibility might help monitor misclassification.",
    ]
    qa = [
        "Edge: agency removed after submission.",
        "Edge: multiple agencies? (if out of scope, document).",
        "Deep link with tab query param behaviour when tabs hidden.",
        "Automation matrix agency vs non-agency vs unknown state.",
        "Visual snapshot when only one thread but agency actually exists data-wise.",
    ]
    xo = [
        "Likely uses job application agency relationship fields — capture BO names.",
        "Ensure REST thread list endpoint does not return agency threads when UI hides tabs.",
        "Search XO for existing SMS tab model to mirror logic.",
        "Security: hidden tabs must not be fetchable via crafted API sequence.",
        "Document feature flag if gradual rollout needed.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — UI clarity", ["How do we message hidden agency history if data exists?"])
    return pm, qa, xo, sal, da_, sev_


def row_attach_reject(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Immediate client rejection for bad extensions, oversize single file, and cumulative > payload cap.",
        "Clear errors per scenario to reduce support tickets.",
        "Aligns numbers with HRREC-92036 server-side enforcement story.",
        "Supports security story for malware types.",
        "May need tenant-configurable allowlist later — flag product decision.",
    ]
    qa = [
        "Verify exact extension list matches backend parser.",
        "Localization of error strings with parameters for sizes.",
        "Drag-drop of folder vs file behaviours.",
        "Accessibility: assertive live region on rejection.",
        "Performance testing with max count of attachments.",
    ]
    xo = [
        "Client constants should be sourced from single shared config service if available.",
        "If not, hardcode must match XO validation table.",
        "Document divergence risk if tenant customizes limits.",
        "Hopper_search for attachment validation services when time permits.",
        "Pair telemetry codes with HRREC-92016 inbound attachment failures.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — safety", ["Confirm 30 MB vs 7 MB authoritative cap."])
    return pm, qa, xo, sal, da_, sev_


def row_send_validate(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Inline validation blocks Send when Subject or To missing.",
        "Multiple issues aggregate into red blocking alert count.",
        "Reduces failed REST round trips and support noise.",
        "Pairs with HRREC-91987 custom header controls requiring non-native validation.",
        "Should align error copy with Workday forms HIG.",
    ]
    qa = [
        "Tab order from alert to first invalid field.",
        "Screen reader announces summary + field errors.",
        "Dynamic validation as user fixes fields updates count live.",
        "Attachment-required flows not in this story — ensure no false positives.",
        "Automation snapshots for 1 vs many errors.",
    ]
    xo = [
        "Mirror server-side validation codes to avoid drift.",
        "Document REST error body contract for partial validation failures.",
        "Search XO for existing Evaluate Expression patterns on Message Builder send pipeline.",
        "If validation executed both client/server, map codes.",
        "Log risk if server adds new required field later without client update.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — form quality", [])
    return pm, qa, xo, sal, da_, sev_


def row_send_no_attach(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Happy path send without attachments via REST with immediate Sent tag in thread.",
        "Client polling/retry if GET thread lags behind write success.",
        "Duplicate send prevented while REST in-flight — critical UX reliability.",
        "Foundational for HRREC-92036 attachment extension.",
        "Observability: correlate client send id with server message id in logs.",
    ]
    qa = [
        "Network drop mid-flight: UI recovery state.",
        "Double tap on touch devices despite disable guard.",
        "Verify ordering in thread list after poll success.",
        "Load test rapid sends for same thread.",
        "Accessibility: Sent tag semantics for screen readers.",
    ]
    xo = [
        "Identify REST resource paths for POST message and GET thread once stabilized.",
        "Method bindings for idempotency keys if supported — document or gap.",
        "Search hopper for conversation message POST service.",
        "Align error mapping with HRREC-92004.",
        "Capture WATS scenario IDs when created.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P0 — core send", ["Idempotency token support yes/no?"])
    return pm, qa, xo, sal, da_, sev_


def row_discard_nav(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Warn on navigation away from candidate profile or closing panel with unsent edits.",
        "Cancel keeps compose context intact.",
        "Confirm discard clears local state only — no server draft.",
        "Aligns with HRREC-91996 explicit discard button behaviour.",
        "May intersect browser beforeunload limitations — call out engineering spike if needed.",
    ]
    qa = [
        "Browser back button vs in-app navigation hooks coverage.",
        "Multiple tabs same candidate — state isolation.",
        "Accessibility of modal focus trap.",
        "Automate cancel vs confirm paths.",
        "Ensure discard dialog respects dark mode tokens.",
    ]
    xo = [
        "Router integration points in SSP shell — document services subscribing to route changes.",
        "Ensure ModulR view unmount order does not bypass guard.",
        "If global navigation service exists, reuse rather than bespoke listener.",
        "Message Builder unmount should not auto-save silently.",
        "Log explicit gap if router not observable from Recruiting package.",
    ]
    sal = salomon_cell([])
    da_ = da_cell(
        [
            "Message Builder team: backend drafts unsupported — messaging in discard dialog must be honest about data loss on refresh still.",
        ]
    )
    sev_ = sev("P1 — data loss prevention", [])
    return pm, qa, xo, sal, da_, sev_


def row_discard_btn(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Discard confirmation when editor dirty; immediate close when empty.",
        "Escape key mirrors Discard path with same guardrails.",
        "Local-only clearing — pairs with HRREC-91995 navigation guard.",
        "Copy should cite lack of server draft persistence.",
        "Consider analytics on discard frequency to tune UX later.",
    ]
    qa = [
        "Mac vs Windows keyboard event parity for Escape.",
        "Discard while attachment staged — confirm full clear.",
        "Double modal risk if navigation discard also triggers.",
        "Screen reader reads warning severity appropriately.",
        "Undo not in MVP — document.",
    ]
    xo = [
        "Message Builder exposes onChange hooks — wire dirty tracking carefully.",
        "Avoid global window key listeners conflicting with typeahead.",
        "Document MB version where Escape default prevented.",
        "If editor swallows Escape, story may fail — add test.",
        "Coordinate z-index with other dialogs on candidate profile.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — UX safety", [])
    return pm, qa, xo, sal, da_, sev_


def row_unread_list(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Thread list shows unread markers in blue per design for fast triage.",
        "Must sync unread state after other recruiters read per chosen policy.",
        "Accessibility requires non-colour cue for colour-blind users.",
        "Pairs with HRREC-91998 list selection and HRREC-91999 clear-on-read.",
        "Potential analytics on unread volumes for adoption metrics.",
    ]
    qa = [
        "Server push vs polling refresh for unread badges.",
        "High-volume threads performance with thousands of rows.",
        "Theme tokens: ensure blue meets contrast on both themes.",
        "Edge: unread on outbound-only messages?",
        "Cross-device read sync timing expectations.",
    ]
    xo = [
        "Unread boolean likely stored per participant per thread — find BO fields.",
        "Search XO for notification read receipts analogues.",
        "Ensure API returns unread counts for tab headers if needed later.",
        "Coordinate with HRREC-91975 notification badge counts.",
        "If no XO field found, log risk-from-absence.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P2 — collaboration",
        [
            "Per-user vs shared unread model — decide explicitly.",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_thread_click(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Row click loads thread preview with newest-first ordering.",
        "Empty reply state still loads thread with only outbound message.",
        "Sets selection model for HRREC-91982 wide view transition.",
        "Should preserve scroll position when returning to list.",
        "Keyboard activation parity with mouse.",
    ]
    qa = [
        "Rapid clicks across rows race cancellation.",
        "Long threads pagination vs load-all.",
        "Screen reader announces loaded thread context.",
        "Error state when fetch fails mid-click.",
        "Empty list vs single thread edge cases.",
    ]
    xo = [
        "GET thread service pagination parameters — document once known.",
        "Cache policy on client to avoid stale message bodies.",
        "Search XO for conversation thread IOP operations.",
        "Security: ensure thread fetch checks job application scope.",
        "Coordinate ETags if available for polling stories.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — navigation", [])
    return pm, qa, xo, sal, da_, sev_


def row_unread_clear(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Unread marker clears only after full read criteria satisfied — not on peek.",
        "Concurrent recruiter reads should refresh consistently per model in 91997.",
        "Impacts perceived sync with notifications HRREC-91975.",
        "May require explicit 'mark read' API call on expand event.",
        "Privacy: do not mark read if only partial body visible due to security.",
    ]
    qa = [
        "Define objective 'full view' threshold (percentage visible, time on screen).",
        "Split view on ultra-wide monitors.",
        "Mark read offline/online transitions.",
        "Automation for two recruiters interleaved actions.",
        "Accessibility: live region when status changes.",
    ]
    xo = [
        "Server endpoint for read cursor — find or gap.",
        "Debounce rapid open/close toggling spamming writes.",
        "Search XO for similar SMS read receipts.",
        "Ensure agency vs candidate threads maintain independent read pointers if tabs used.",
        "Document WID for read state field once known.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P2 — state machine",
        [
            "Shared vs per-user read cursor?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_grow_dual(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Consolidates structural grow/shrink for standard and XL overlay behaviours.",
        "Explicit shrink path when switching tasks or re-toggling grow.",
        "Modal shadow interplay same as HRREC-91948 baseline.",
        "Potential overlap with HRREC-91980/91982 — ensure single source of truth for widths.",
        "Milestone label M5 in description for planning alignment.",
    ]
    qa = [
        "Regression suite covering HRREC-91948 scenarios still passes unchanged.",
        "Animation reduced-motion preference respected.",
        "Touch devices: grow targets size.",
        "Z-index with sticky candidate header bars.",
        "Performance on low-end laptops when shadow filters applied.",
    ]
    xo = [
        "Centralize constants for widths in shared module per dev note intent.",
        "Event bus names for grow/shrink must be documented in XO release notes.",
        "Search for duplicate listeners if both email and SMS register.",
        "If overlay toggles incorrectly, capture screenshot-driven bug template.",
        "Log explicit service owner for panel controller when identified.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — dedupe with 91948", ["Which story wins if behaviour diverges?"])
    return pm, qa, xo, sal, da_, sev_


def row_style_thread(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Visual-only styling of basic thread to match Figma ordering newest-first.",
        "No new business logic — schedule near end to absorb layout tweaks.",
        "Risk: style-only masks missing functional gaps — pair with QA sign-off checklist.",
        "Impacts recruiter trust in readability.",
        "Coordinate design tokens with Canvas.",
    ]
    qa = [
        "Visual diff tests across themes.",
        "Long subject lines wrapping rules.",
        "Inline images aspect ratio handling (even if out-of-scope display).",
        "RTL mirroring for message bubbles if applicable.",
        "Print stylesheet not required but ensure no overflow clipping.",
    ]
    xo = [
        "ModulR layout names — document once implemented.",
        "Avoid inline styles unsupported by email renderer if any shared components.",
        "Search XO for CSS class hooks used by automated UI tests.",
        "Coordinate with HRREC-92010 tags layout spacing.",
        "If no XO metadata, acceptable for pure front-end story — state explicitly.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P3 — polish", [])
    return pm, qa, xo, sal, da_, sev_


def row_bounce_copy(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Maps SES-like events to recruiter-facing headline/body pairs including spam, unsubscribe, virus, delay, catch-all.",
        "RenderingFailure explicitly out of scope — document dependency on templates future.",
        "Translation ticket TRANMGMT-2499 linked.",
        "Critical for deliverability trust and support deflection.",
        "Should align tone with legal/comms review.",
    ]
    qa = [
        "Table-driven tests for each variant string key.",
        "Unknown future event codes fall back to Scenario 6 text.",
        "Localization length overflow in narrow panel.",
        "Ensure HTML injection safe if provider returns partial HTML (should not).",
        "Accessibility: announce severity level appropriately.",
    ]
    xo = [
        "Event taxonomy mapping table in XO or integration service — document owner.",
        "Search hopper for inbound webhook processing service names.",
        "Align error codes with HRREC-92010 tags.",
        "Audit retention of bounce diagnostic text under privacy story HRREC-92011.",
        "If mapping incomplete, risk-from-absence in XO cell.",
    ]
    sal = salomon_cell(
        [
            "AWS SES event publishing docs linked in story — external precedent for taxonomy breadth.",
        ]
    )
    da_ = da_cell([])
    sev_ = sev(
        "P1 — supportability",
        [
            "Do we ever expose raw provider diagnostic to admins?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_rest_error(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Handles mid-session state changes (opt-out, security loss) with hard block + copy instructing copy/paste + refresh.",
        "Generic 500/timeouts show safe generic error without retry storm.",
        "Pairs with HRREC-91995/91996 discard flows: refresh loses unsaved draft — docs and error copy must align.",
        "Should expose structured error codes to UI where possible.",
        "Impacts recruiter trust during sensitive moments.",
    ]
    qa = [
        "Ensure no infinite auto-retry on non-idempotent failures.",
        "Telemetry on error class distribution.",
        "Localization of refresh instruction.",
        "Automation simulates 401/403/409/500 responses.",
        "Accessibility of blocking alert vs toast.",
    ]
    xo = [
        "REST error schema should include machine-readable code enum.",
        "Search XO for existing Recruiting REST error translators.",
        "Coordinate with HRREC-91978 disabled channel responses.",
        "Log correlation IDs in errors for support.",
        "If error payload empty, UI must still degrade gracefully.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P0 — failure handling",
        [
            "Can we offer clipboard export one-click?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_email_change(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Primary home email change mid-thread hides Reply/Add with explanation; thread read-only.",
        "Common trigger: candidate merge — explicit test note in story.",
        "Mirrors SMS channel behaviour per story note.",
        "Impacts deliverability and privacy narratives in admin comms.",
        "Pairs with HRREC-92015 merge duplication story.",
    ]
    qa = [
        "Merge automation scenarios with HRREC-92015.",
        "Partial update propagation delays vs UI state.",
        "Agency candidate path: does same rule apply?",
        "Accessibility of informational banner.",
        "Historical attachment access still allowed read-only?",
    ]
    xo = [
        "Validation method must watch same field as SMS channel for parity.",
        "Search XO for Candidate Merge event hooks.",
        "Document REST flag conversationLockedReason enum.",
        "Ensure thread fetch still returns historical ciphertext attachments as allowed.",
        "If mismatch between BO field used vs actual send address, file defect.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P0 — data integrity", [])
    return pm, qa, xo, sal, da_, sev_


def row_optout(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Opt-out intermediate state: cannot send new mail but conversation not fully closed per transcript notes.",
        "Re-opt-in restores send when policy allows.",
        "Aligns copy with HRREC-91982 disabled conversation state.",
        "Requires explicit policy owner (privacy vs recruiting).",
        "Telemetry to monitor stuck opt-out states.",
    ]
    qa = [
        "Boundary between opt-out vs closed vs email changed.",
        "Agency recipients unaffected? confirm.",
        "Automation toggling consent fields rapidly.",
        "Notification HRREC-91975 should not spam while opted out.",
        "Reporting on opt-out reasons if captured.",
    ]
    xo = [
        "State machine representation in conversation BO — document transitions.",
        "Search XO for SMS opt-out parity logic.",
        "Ensure REST send rejects with clear code when opted out.",
        "Coordinate PDT purge implications HRREC-92011 with intermediate state retention.",
        "If state values missing in XO, flag design risk.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P0 — consent lifecycle",
        [
            "Exact definition of 'not fully closed'?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_tabs_agency(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "All/Candidate/Agency tabs for agency-submitted applications with strict thread isolation per tab.",
        "Default All tab selected on load.",
        "Critical for agency hiring workflows and compliance boundaries.",
        "Pairs with HRREC-92008/92009 security and lifecycle stories.",
        "UX copy clarifies what All includes vs sum of tabs.",
    ]
    qa = [
        "Deep link to specific tab preserved on refresh.",
        "Keyboard shortcuts for tab switching.",
        "Ensure threads cannot leak via prefetch caches between tabs.",
        "Long thread names in tab headers truncation.",
        "Automation for three tabs with asymmetric message counts.",
    ]
    xo = [
        "Thread query must filter by participant role dimension — document query param names.",
        "Search XO for agency relationship on job application.",
        "Security joins must be enforced server-side not only UI tabs.",
        "Coordinate with HRREC-92030 recipient labels Candidate vs Agency.",
        "If All tab duplicates messages incorrectly, P0 defect risk.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P0 — agency workflows", [])
    return pm, qa, xo, sal, da_, sev_


def row_agency_isolation(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Agency users must never see recruiter-candidate threads; only agency↔recruiter threads.",
        "Direct object reference attempts must return 403/404 without content leakage.",
        "Enterprise confidentiality pillar story for MVP credibility.",
        "Pairs with tab UI HRREC-92007 and compose HRREC-92029.",
        "Requires red-team style adversarial test plan beyond happy path.",
    ]
    qa = [
        "Pen-test style matrix: guessed thread IDs, wid enumeration, shared links.",
        "Logging must not echo forbidden thread snippets in client console on error.",
        "Multi-agency user switching accounts on same machine.",
        "Session fixation concerns out of scope but note for security review.",
        "Accessibility of error pages without leaking info via verbose text.",
    ]
    xo = [
        "Security domain separation must be enforced at REST authorization layer with candidate data domain checks.",
        "Search XO for agency user security policy domains.",
        "Document method bindings for thread GET with agency context parameter.",
        "If generic Message service reused, verify policy filters cannot be bypassed.",
        "Add explicit statement if hopper_search not executed in this pass.",
    ]
    sal = salomon_cell(
        [
            "Internal KB stresses least-privilege in recruiting communications — align narrative in admin-facing docs once built.",
        ]
    )
    da_ = da_cell(
        [
            "DA did not return agency-specific tenant config precedents — treat as high design risk pending security review.",
        ]
    )
    sev_ = sev(
        "P0 — security",
        [
            "Independent penetration test before GA?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_active_closed_mix(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Candidate vs agency threads can differ in closed state; UI updates actions per active tab independently.",
        "Closed tab shows read-only history + info message; active tab keeps compose controls.",
        "Supports real workflows where agency admin outlives candidate disposition.",
        "Depends on lifecycle definitions HRREC-92012/92014.",
        "Reduces confusing global disabled states.",
    ]
    qa = [
        "Rapid tab switching while compose draft open — should not leak draft across contexts.",
        "Notification deep link chooses correct tab when one side closed.",
        "Automation for four combinations of open/closed states.",
        "Edge: both active but one thread empty.",
        "Accessibility announces tab disabled actions contextually.",
    ]
    xo = [
        "Thread state fields likely per conversation record — document cardinality.",
        "Ensure API returns closure reason per thread for messaging.",
        "Search XO for conversation status enumerations.",
        "Coordinate HRREC-92010 tags with closed banners.",
        "If closure reason missing, add open question.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — lifecycle UX", [])
    return pm, qa, xo, sal, da_, sev_


def row_status_tags(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Sent tag when handoff to provider succeeds without immediate error.",
        "Not Delivered tag when post-send delivery failure detected (bounce/virus).",
        "Connects UI surface to HRREC-92003 diagnostic copy.",
        "Trust signal for recruiters monitoring pipeline health.",
        "Potential future intermediate states (Queued) — scope explicitly.",
    ]
    qa = [
        "State transitions Sent → Not Delivered asynchronous timing flips.",
        "Multiple retries should not duplicate tags.",
        "Localization and iconography for tags.",
        "Screen reader text vs colour-only cues.",
        "Load test with bulk status updates.",
    ]
    xo = [
        "Webhook ingestion updates message row — identify BO fields for status.",
        "Search XO for outbound message status enumerations shared with SMS.",
        "Align telemetry with integration monitoring dashboards.",
        "If status stored only externally, document latency SLA.",
        "Coordinate purge behaviour HRREC-92011 when Not Delivered.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P2 — observability UX", [])
    return pm, qa, xo, sal, da_, sev_


def row_pdt_purge(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Privacy admin uses Recruiting Communications PDT to purge bodies, participants, attachments, recruiting notification events.",
        "Must align with compliance statements in PRD.",
        "Pairs with logging story HRREC-92035 for post-purge absence in reports.",
        "DA confirms PDT already lists email-like payloads — implementation must not miss new BOs introduced by MVP.",
        "Cross-functional review with Privacy PM mandatory.",
    ]
    qa = [
        "End-to-end purge verification in impl tenant with restore-not-possible checks.",
        "Partial purge failure rollback expectations.",
        "Attachments in Blobatory removed when email purged.",
        "Reporting HRREC-92035 after purge shows redacted rows vs disappearance — decide.",
        "Performance of large thread purge.",
    ]
    xo = [
        "Map each new email BO to purge metadata registration — document WIDs in privacy registry.",
        "Search XO for Purge Candidate recruiting communications task bindings.",
        "Ensure notification events tied to email also removed per story list.",
        "If new BOs not registered, legal blocker.",
        "Coordinate with HRREC-92011 duplicate wording to avoid gaps.",
    ]
    sal = salomon_cell(
        [
            "KB: messaging retention references purge framework for SMS — precedent for enterprise expectation setting.",
        ]
    )
    da_ = da_cell(
        [
            "DA: Recruiting Communications PDT already includes recruiting email attachments and notification events — verify engineering checklist covers conversational email tables.",
        ]
    )
    sev_ = sev(
        "P0 — privacy",
        [
            "Legal sign-off on retention vs purge timing?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_tenant_lifecycle(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Tenant-configurable post-disposition open window with hard one-year cap per job application conversation.",
        "Scheduler closes automatically with audit entry.",
        "Invalid admin values rejected with clear validation messaging.",
        "Intersects HRREC-92014 both-closed UI and HRREC-92009 mixed states.",
        "Needs admin guide updates once tasks finalized.",
    ]
    qa = [
        "Time zone handling for scheduler midnight boundaries.",
        "Changing policy retroactively vs only new conversations.",
        "Edge: disposition reversed after close — out of scope?",
        "Load test scheduler at tenant scale.",
        "Accessibility of admin validation errors.",
    ]
    xo = [
        "Tenant setup tasks likely under Recruiting functional area — capture task WIDs when known.",
        "Background job processing service for auto-close — hopper_search follow-up.",
        "Store config in auditable BO per Scenario 3.",
        "Ensure REST respects closed state from HRREC-92014.",
        "If XO not found, mark medium risk until spike completes.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P1 — policy engine",
        [
            "Who can edit cap — only system admin?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_explore_report(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm, qa = thin_pm_qa_html()
    xo = [
        "Expect touchpoints in reporting domains for Candidate Communications CRFs — search when story matures.",
        "Historical WhatsApp additions required reporting fixes — use as checklist template.",
        "No specific XO metadata cited in Jira body.",
        "Coordinate with HRREC-92035 for overlap once detailed.",
        "Track risk that exploratory work discovers late P0 defects.",
    ]
    sal = salomon_cell(
        [
            "KB: multiple candidate communication CRF enhancements (HRCRM-3421) show reporting regressions are common when new channels appear.",
        ]
    )
    da_ = da_cell(
        [
            "Milestone-style QA depends on stable tenant data fixtures — prepare early.",
        ]
    )
    sev_ = sev(
        "P3 — thin spec",
        [
            "Convert to concrete scenarios before release train hardens?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_both_closed(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "When both agency and candidate conversations closed, hide Reply/Add with clear info messaging per tab rules.",
        "Read-only history preserved for audit.",
        "Closed is terminal — new comms must be new channel or new thread policy per note.",
        "Pairs with HRREC-92009 mixed states inverse case.",
        "Impacts empty state when user opens email task after closure.",
    ]
    qa = [
        "Deep link after closure should not resurrect compose via cached client bundle.",
        "Notification click behaviour when both closed — still navigates read-only?",
        "Accessibility: landmark for read-only banner.",
        "Automation for closure reasons variants.",
        "Upgrade: policy change reopen not supported — verify copy.",
    ]
    xo = [
        "Terminal state flag on conversation — document enum including email-changed vs opted-out vs policy-close.",
        "REST must reject POST attempts with specific error for UI parity HRREC-92004.",
        "Search XO for conversation closed reason translations.",
        "Coordinate tags HRREC-92010 when closure due to bounce vs policy.",
        "If multiple enums diverge, consolidation tech debt callout.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — lifecycle", [])
    return pm, qa, xo, sal, da_, sev_


def row_merge_dup(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Duplicate candidate merge should keep both email threads visible for recruiter to choose continuation path.",
        "If merge changes primary email, apply HRREC-92005 pause rules.",
        "Duplicate Management Framework alignment critical.",
        "Impacts agency vs non-agency differently — call out in training.",
        "Communicate risk of duplicate sends if recruiter picks wrong thread post-merge.",
    ]
    qa = [
        "Automate merge with two active threads + unsent drafts behaviour.",
        "Permissions after merge inherit target candidate security.",
        "Large thread history performance after merge.",
        "Undo merge not supported — document.",
        "Reporting references HRREC-92035 should remap to merged candidate.",
    ]
    xo = [
        "Merge event hooks must update conversation foreign keys atomically.",
        "Search XO for Duplicate Candidate merge BPT extensions.",
        "Ensure REST lists threads across merged identities without exposing wrong candidate data.",
        "Coordinate Blob attachment ownership transfer HRREC-92036.",
        "If thread duplication ambiguous, add engineering spike ticket.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P0 — data migration",
        [
            "Single canonical thread vs two visible — product decision locked?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_inbound_attach_block(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Inbound candidate attachments blocked for type/virus/size show system messages in-thread while still showing safe body text.",
        "Backend ingestion owns rejection; UI surfaces outcomes transparently.",
        "Pairs with recruiter outbound attachment validation HRREC-91992.",
        "Support deflection: recruiters understand candidate attempted share.",
        "May intersect email security scanning SLAs.",
    ]
    qa = [
        "Partial body fetch when attachment stripped — formatting integrity.",
        "Localization of system messages with candidate-language considerations.",
        "Automation simulates each rejection class.",
        "Ensure no executable content rendered from candidate HTML email.",
        "Performance when multiple blocked attachments in single inbound.",
    ]
    xo = [
        "Inbound parser service should emit structured system message records — document schema.",
        "Search hopper for virus scanner integration names.",
        "Align error codes with HRREC-92003 bounce taxonomy where overlapping.",
        "Coordinate logging HRREC-92035 for system-generated rows.",
        "If UI guesses rejection reason incorrectly, P1 bug risk.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — inbound safety", [])
    return pm, qa, xo, sal, da_, sev_


def row_myconv_xo(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm, qa = thin_pm_qa_html()
    xo = [
        "Story explicitly signals XO refactor — expect touches to My Conversations indexed toggles/methods (9235$125773, 9235$115642, IOP methods 2663$168099 / 2663$149127 noted in prior XO search pass).",
        "Dependency risk: notification routing HRREC-91975 may block without this refactor ordering.",
        "Need hopper_search for service wiring between notification framework and conversation tasks.",
        "Capture WATS updates once known.",
        "Until AC written, treat as scheduling container not implementable work.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P2 — dependency container",
        [
            "Split into implementable stories with AC?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_agency_compose(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Compose controls visible upfront for agency profiles because recipient unknown until send.",
        "Agency user sends skip candidate opt-in; agency candidate sends require opt-in at send time.",
        "Balances UX immediacy vs compliance gate at last responsible moment.",
        "Pairs with HRREC-92007 tabs and HRREC-92030 To list labelling.",
        "Failure messaging when send blocked for opted-out candidate must be explicit.",
    ]
    qa = [
        "Attempt send to candidate without choosing To — validation interaction with HRREC-91993.",
        "Rapid switching recipient type without clearing body — should not leak content across contexts.",
        "Automation matrix: agency user happy, candidate opted-in, candidate opted-out.",
        "Accessibility of recipient selector labels Candidate vs Agency.",
        "Telemetry on blocked sends for monitoring mistaken operations.",
    ]
    xo = [
        "Send endpoint must enforce distinct authorization paths for agency user vs candidate participant types.",
        "Search XO for agency user email address storage fields.",
        "Ensure thread creation chooses correct conversation bucket per recipient.",
        "Coordinate security HRREC-92008 on thread listing filters.",
        "If validation only client-side, security defect.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P0 — agency compliance", [])
    return pm, qa, xo, sal, da_, sev_


def row_to_list(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "To dropdown lists candidate home email(s) with labels; agency case includes candidate and agency users with explicit labels.",
        "Pre-populate non-agency candidate primary email for speed.",
        "Determines which conversation thread reply attaches to — pairs with HRREC-92007 tabs.",
        "Should block ambiguous sends if multiple addresses conflict.",
        "Accessibility: label text must be parseable by assistive tech.",
    ]
    qa = [
        "Keyboard typeahead across long combined lists.",
        "Changing To after drafting should reset thread context or warn.",
        "Edge: agency user shares email domain with candidate — disambiguation.",
        "Automation verifying correct thread receives message post-send HRREC-91994.",
        "Localization of labels without breaking sorting.",
    ]
    xo = [
        "Backend endpoint must return stable IDs per selectable row not only display strings.",
        "Search XO for candidate home email fields on job application vs candidate profile.",
        "Ensure REST uses same primary home email definition as HRREC-92005.",
        "Coordinate HRREC-91987 header placeholder swap.",
        "If list source differs per tab, document parameterization.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev("P1 — recipient resolution", [])
    return pm, qa, xo, sal, da_, sev_


def row_activity_log(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Every inbound/outbound email recorded to job application activity stream, recruiting history timeline, and candidate communication report.",
        "Auditable history requirement for enterprise recruiting.",
        "Must include attachments metadata per acceptance.",
        "Intersects HRREC-92011 purge — decide appear redacted vs disappear.",
        "Potential performance impact on busy reqs — plan batching/indexing.",
    ]
    qa = [
        "Verify security domains on reports match conversation visibility HRREC-92008.",
        "Large attachment metadata row size limits in reporting.",
        "Localization of new event types.",
        "Regression on SMS/WhatsApp logging parity.",
        "Downstream integrations consuming report fields must not break.",
    ]
    xo = [
        "Identify business process or integration events fired on email send/receive for activity stream.",
        "Search XO for Candidate Communication report data source extensions.",
        "Ensure CRF IDs updated if new fields required (pattern from HRCRM-3421).",
        "Coordinate timeline ordering with HRREC-91998 thread ordering rules.",
        "If logging asynchronous, document max delay SLA.",
    ]
    sal = salomon_cell(
        [
            "KB: new processed-only communication CRF proposed historically — watch for overlap with email processed states.",
        ]
    )
    da_ = da_cell([])
    sev_ = sev(
        "P0 — auditability",
        [
            "Do purged emails leave tombstone rows?",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


def row_send_attach(key: str) -> Tuple[List[str], List[str], List[str], str, str, str]:
    pm = [
        "Send with attachments includes Blobatory IDs in REST payload; shows pills with Sent tag in thread.",
        "Extends HRREC-91994 happy path with binary handling and virus scan expectations server-side.",
        "Pairs with UI attachment stories HRREC-91988/91992.",
        "Critical for offers/benefits workflows cited in story intent.",
        "Observability for large payloads essential.",
    ]
    qa = [
        "Resume upload after network failure mid-multipart.",
        "Verify server rejects when Blob upload succeeds but message POST fails — UI recovery.",
        "Virus positive path surfaces HRREC-92016 inbound symmetry.",
        "Performance testing near limit sizes (watch 7 MB vs 30 MB conflict).",
        "Accessibility for attachment progress indicators.",
    ]
    xo = [
        "Document REST multipart schema and Blobatory reference generation steps.",
        "Search hopper for Blobatory upload services used by Recruiting.",
        "Align errors with HRREC-92004 mapping.",
        "Ensure purge HRREC-92011 removes blobs when message purged.",
        "Capture WATS IDs once scenarios authored.",
    ]
    sal = salomon_cell([])
    da_ = da_cell([])
    sev_ = sev(
        "P0 — payload integrity",
        [
            "Resolve 7 MB vs 30 MB authoritative maximum.",
        ],
    )
    return pm, qa, xo, sal, da_, sev_


ROUTER: dict[str, RowFn] = {
    "HRREC-90852": row_doc_ag_rn,
    "HRREC-90853": row_doc_ag_rn,
    "HRREC-91946": row_91946,
    "HRREC-91948": row_91948,
    "HRREC-91974": row_91974,
    "HRREC-91975": row_91975,
    "HRREC-91978": row_91978,
    "HRREC-91979": row_91979,
    "HRREC-91980": lambda k: row_panel_grow(k, "add"),
    "HRREC-91982": lambda k: row_panel_grow(k, "read"),
    "HRREC-91985": row_compose_nonagency,
    "HRREC-91986": row_draft_preserve,
    "HRREC-91987": row_header_ui,
    "HRREC-91988": row_attach_ui,
    "HRREC-91989": row_rte_ui,
    "HRREC-91990": row_from_list,
    "HRREC-91991": row_tabs_hide_nonagency,
    "HRREC-91992": row_attach_reject,
    "HRREC-91993": row_send_validate,
    "HRREC-91994": row_send_no_attach,
    "HRREC-91995": row_discard_nav,
    "HRREC-91996": row_discard_btn,
    "HRREC-91997": row_unread_list,
    "HRREC-91998": row_thread_click,
    "HRREC-91999": row_unread_clear,
    "HRREC-92001": row_grow_dual,
    "HRREC-92002": row_style_thread,
    "HRREC-92003": row_bounce_copy,
    "HRREC-92004": row_rest_error,
    "HRREC-92005": row_email_change,
    "HRREC-92006": row_optout,
    "HRREC-92007": row_tabs_agency,
    "HRREC-92008": row_agency_isolation,
    "HRREC-92009": row_active_closed_mix,
    "HRREC-92010": row_status_tags,
    "HRREC-92011": row_pdt_purge,
    "HRREC-92012": row_tenant_lifecycle,
    "HRREC-92013": row_explore_report,
    "HRREC-92014": row_both_closed,
    "HRREC-92015": row_merge_dup,
    "HRREC-92016": row_inbound_attach_block,
    "HRREC-92022": row_myconv_xo,
    "HRREC-92029": row_agency_compose,
    "HRREC-92030": row_to_list,
    "HRREC-92035": row_activity_log,
    "HRREC-92036": row_send_attach,
}


def build_table_rows() -> str:
    rows: List[str] = []

    def trim_lens(items: List[str], *, n: int = 5, max_len: int = 80) -> List[str]:
        out: List[str] = []
        for x in items[:n]:
            x = x.strip()
            if len(x) > max_len:
                x = x[: max_len - 1] + "…"
            out.append(x)
        return out

    for key in KEYS:
        pm, qa, xo, sal, da_, sev_ = ROUTER[key](key)
        pm, qa, xo = trim_lens(pm), trim_lens(qa), trim_lens(xo)
        pm_cell = ul_html(pm) if key in ("HRREC-90852", "HRREC-90853", "HRREC-92013", "HRREC-92022") else ul(pm)
        qa_cell = ul_html(qa) if key in ("HRREC-90852", "HRREC-90853", "HRREC-92013", "HRREC-92022") else ul(qa)
        rows.append(
            "<tr>"
            + story_cell(key)
            + f"<td>{pm_cell}</td>"
            + f"<td>{qa_cell}</td>"
            + f"<td>{ul(xo)}</td>"
            + f"<td>{sal}</td>"
            + f"<td>{da_}</td>"
            + f"<td>{sev_}</td>"
            + "</tr>"
        )
    return "\n".join(rows)


def build_page() -> str:
    rollup = [
        "Replaced broken Markdown pipe tables with a single Storage-friendly HTML table so all 46 Stories under HRREC-82977 are visible in one scan (JQL inventory complete; numeric gaps 91981/91983/91984 are not Stories on the epic).",
        "Highest-risk clusters: agency isolation (92008), consent + security gating (91979/91985/92006/92029), privacy purge coverage (92011) vs new tables, and notification/deep-link coherence (91975) where DA notes classic inbound email may route outside conversational UI unless product bridges it.",
        "Attachment size guidance conflicts: DA cited 7 MB email-notification practice while multiple stories reference ~30 MB cumulative limits — resolve before shipping validation copy and Blobatory payloads (91992/92036).",
        "Message Builder draft persistence is explicitly unsupported (91995/91996 notes) — PM + Docs must align expectations with recruiters to reduce incident volume on refresh/navigation.",
        "XO adjacency highlights: conversationContextInstance layout 5557$42319, Messaging label container 11111$220, Conversation Write Access WID discrepancy (146$157734 in Jira vs 6104$183742 label hit) must be reconciled before REST/UI diverge.",
        "Salomon synthesis — " + SALOMON_ROLLUP + " " + SALOMON_SOURCES,
        "DA synthesis — " + DA_ROLLUP,
    ]
    parts: List[str] = []
    parts.append("<h1>Net-New Story Gap Review &mdash; HRREC-82977 (2-way email)</h1>")
    parts.append(
        f"<p><strong>Epic:</strong> <a href=\"{JIRA_BROWSE}/{EPIC}\">{EPIC}</a> &mdash; conversational email in Recruiting (MVP backlog).</p>"
    )
    parts.append(f"<p><strong>JQL (Stories only):</strong> {esc(JQL)}</p>")
    parts.append(
        "<p><strong>Story count:</strong> 46 (canonical inventory via Jira search; Confluence prior markdown batches removed).</p>"
    )
    parts.append("<h2>Executive rollup</h2>")
    parts.append(ul(rollup))
    parts.append("<h2>Gap review table</h2>")
    parts.append(
        '<table class="relative-table wrapped" style="width: 100.0%;">'
        "<thead><tr>"
        "<th>Story</th><th>PM lens</th><th>QA lens</th><th>XO lens</th>"
        "<th>Salomon precedents</th><th>DA notes</th><th>Severity / open questions</th>"
        "</tr></thead><tbody>"
    )
    parts.append(build_table_rows())
    parts.append("</tbody></table>")
    parts.append("<!-- gap-review-all-stories-v2 -->")
    return "\n".join(parts)


def main() -> None:
    content = build_page()
    if len(sys.argv) > 1 and sys.argv[1] == "--check":
        assert len(KEYS) == 46
        assert set(KEYS) == set(SUMMARY.keys())
        print("OK", len(KEYS))
        return
    sys.stdout.write(content)


if __name__ == "__main__":
    main()
