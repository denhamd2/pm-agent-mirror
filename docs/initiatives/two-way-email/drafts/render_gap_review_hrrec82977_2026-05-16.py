#!/usr/bin/env python3
"""One-off renderer for HRREC-82977 gap review page 2026-05-16. Run from repo root."""
from __future__ import annotations

import html
import json
import sys
from pathlib import Path

_DRAFTS_DIR = Path(__file__).resolve().parent
if str(_DRAFTS_DIR) not in sys.path:
    sys.path.insert(0, str(_DRAFTS_DIR))

from gap_likelihood_confluence import gap_likelihood_cell_from_legacy_pct_clause

OUT = Path(__file__).with_name("gap_review_hrrec82977_2026-05-16.body.html")

# Merged evidence from parallel MCP bands + manifest-only WhatsApp snapshot 2026-05-16.
# Each entry: key, summary, gap, pm, qa, dev, verdict_find, verdict_next, bdd (HTML fragment or "")
ROWS: list[dict] = []


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def row(
    key: str,
    summary: str,
    gap: str,
    pm: list[str],
    qa: list[str],
    dev: list[str],
    vf: str,
    vn: str,
    bdd: str,
    cross: str | None = None,
) -> None:
    if cross:
        pm = pm + [cross]
    ROWS.append(
        {
            "key": key,
            "summary": summary,
            "gap": gap,
            "pm": pm,
            "qa": qa,
            "dev": dev,
            "vf": vf,
            "vn": vn,
            "bdd": bdd,
        }
    )


# --- Rows (content synthesized from this session Jira/Salomon/XO/DA; Peanut Jira fetch failed all keys) ---

row(
    "HRREC-91946",
    "[Initialisation] Recruiter can see Email Task on SSP (XO Only)",
    "38% — PM and Jira are clear on ordering; QA calls out masking matrix; Dev lens shows generic XO hits, not email-task wiring.",
    [
        "<strong>Jira —</strong> Strong scenario coverage for task order, masking when job application is masked, and combined masked icon across channels.",
        "<strong>Salomon —</strong> SSP visibility still depends on separate Candidate Notes vs Job Application Notes domains—confirm copy does not imply access the recruiter lacks.",
        "<strong>Deployment Agent —</strong> Channel rollout remains Edit Tenant Setup–Recruiting plus domain policies; plan which domains gate the new email task before UAT.",
    ],
    [
        "<strong>Jira —</strong> Risk: recruiter sees a masked icon but one channel is actually visible elsewhere—watch inconsistent masking across email vs SMS/WhatsApp.",
        "<strong>Salomon —</strong> Prior conversational panel glitches when tenant SMS redirect conflicts with two-way messaging suggest retesting SSP after unrelated tenant comms changes.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>conversational email</code>; results were generic secured-instance relationships, not the task derivation you described.",
        "<strong>XO MCP — risk:</strong> Ask engineering which XO task layout version lands the Conversational Email task relative to Notes for each breakpoint.",
        "<strong>Peanut —</strong> <code>collectBugData</code> failed (Jira fetch error in MCP this run)—no repo or similar-issue signal.",
    ],
    "Initialization story is scenario-rich; main residual risk is XO layout wiring vs generic search hits.",
    "Run one SSP walkthrough on a tenant with split Notes vs Job Application Notes domains before calling this slice done.",
    "<p><strong>Scenario: Masked application with partial domain access</strong></p><p><strong>Given</strong> a recruiter has Job Application Notes but not Candidate Notes domain access<br/><strong>When</strong> they open the candidate profile with a masked application<br/><strong>Then</strong> the email task affordance matches the same masking rules as SMS/WhatsApp and does not leak thread text.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> Snapshot excerpt HRREC-84555 (profile entry icon when opted in) — consider for 2WE if the email task should hide when consent or tenant email channel is off; email uses different consent surface than WhatsApp.',
)

row(
    "HRREC-91948",
    "[Initialisation] Enabled SSP Growth/Expansion",
    "42% — UX numbers settled in Q and A; Dev lens only surfaced WATS side-panel tests; PM leaves product question on grown-state persistence.",
    [
        "<strong>Jira —</strong> Widths and XL overlay are specified; Scenario 4 explicitly flags open product question on reopen behaviour after grow.",
        "<strong>Salomon —</strong> UI Platform docs distinguish modal vs side-panel focus and refresh—use them when deciding persist-vs-reset on navigation.",
    ],
    [
        "<strong>Jira —</strong> Recruiters may lose in-flight email compose if grow state resets unpredictably—capture expected behaviour for close/reopen and task switch.",
        "<strong>Salomon —</strong> Collaboration panel push vs overlay discussions (HRRECUI-459) are a precedent for desktop breakpoint edge cases.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>sliding side panel</code>; hits are WATS layout and SMS/WhatsApp sliding panel tests—automation exists, not product answers for email grow state.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Good visual spec with an intentional open point on whether grown layout survives navigation.",
    "Resolve Scenario 4 with UX + eng in one decision memo, then fold into discard/navigation sibling stories.",
    "<p><strong>Scenario: Task switch after grow</strong></p><p><strong>Given</strong> the recruiter expanded the panel to the wide email layout<br/><strong>When</strong> they switch to another SSP task and back<br/><strong>Then</strong> the story documents whether width resets or persists so QA can script it once.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84533 excerpt (countdown accuracy on refresh) — consider for 2WE if any expiry or reply-window UI for email must refresh timers when the panel reloads; channel timing semantics differ.',
)

row(
    "HRREC-91974",
    "PH: Recruiter sees Empty state of email task if opened",
    "35% — Jira names REST label work; QA informed by WhatsApp empty-state precedent; XO found conversationContextInstance artefacts.",
    [
        "<strong>Jira —</strong> Clear empty-state UI with Compose/New/Grow; calls out header label check with PM contact.",
        "<strong>Salomon —</strong> WhatsApp EA empty-state pattern (HRREC-84383) and blank conversational panel issues suggest parallel negative tests.",
    ],
    [
        "<strong>Jira —</strong> Watch header wording vs accessibility when no messages exist; buttons are no-op until later stories—recruiters may think the product is broken.",
        "<strong>Salomon —</strong> Prior instability when tenant messaging redirect conflicts with two-way flows—retest empty state after comms admin changes.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>conversationContextInstance</code>; surfaced service representation and WATS REST tests—adjacent to the GET endpoint named in Jira.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Solid slice for first-run experience with explicit REST label dependencies.",
    "Confirm which REST version recruiters hit in dev SUV matches the label container instance named in Jira before freezing strings.",
    "<p><strong>Scenario: No conversation yet</strong></p><p><strong>Given</strong> no thread exists for the job application<br/><strong>When</strong> the recruiter opens the email task<br/><strong>Then</strong> empty-state graphic and actions match Figma and no phantom draft appears.</p>",
    None,
)

row(
    "HRREC-91975",
    "PH: Recruiter receives a notification",
    "55% — Jira assumes framework routing; Deployment Agent says My Conversations today is SMS-primary; tension for email notifications.",
    [
        "<strong>Jira —</strong> Covers participant routing, deep link into SSP thread, and optional standard email alert when admin routes Candidate SMS/Email Messages.",
        "<strong>Deployment Agent —</strong> My Conversations currently emphasises SMS conversational paths; bell vs email notifications remain tenant choices in Notifications setup.",
    ],
    [
        "<strong>Jira —</strong> Recruiters without domain access may see bell-only signals—exercise both participant and non-participant recruiters.",
        "<strong>Deployment Agent —</strong> Risk of duplicate noise if both bell and email notifications fire for the same reply—decide default for 2WE.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>My Conversations</code>; surfaced WATS REST scenario and security-policy loops wiring recruiter groups to the My Conversations domain.",
        "<strong>XO MCP — risk:</strong> HRREC-92022 notes an XO refactor—confirm notification event names land where My Conversations listeners expect them for email.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Functional story hinges on tenant notification routing that still skews SMS in admin guidance.",
    "Hold a 30-minute OE alignment on whether email replies mirror SMS My Conversations suppression or reuse bell defaults.",
    "<p><strong>Scenario: Participant vs non-participant</strong></p><p><strong>Given</strong> an inbound email reply is ingested<br/><strong>When</strong> the primary recruiter lacks the same security as a secondary watcher<br/><strong>Then</strong> each person gets an in-product or email notification path consistent with tenant notifications configuration.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> WhatsApp security-domain gating (internal articles referenced in Salomon) — consider for 2WE if email replies should bypass My Conversations when domains differ from SMS; backend differs from Twilio-oriented WhatsApp.',
)

row(
    "HRREC-91978",
    "PH: Admin can enable or disable 2-way email as a comms channel",
    "48% — Jira is high-level; DA gives Recruiting + Notifications tasks; XO search returned zero hits for the plain-text query two way email.",
    [
        "<strong>Jira —</strong> States auditable enable/disable with recruiter-visible consequences—needs concrete admin task names in AC.",
        "<strong>Deployment Agent —</strong> Channels tie to Edit Tenant Setup – Recruiting and Notifications, plus security domains such as Manage: Candidate SMS Conversations for SMS—expect parallel domain work for email.",
    ],
    [
        "<strong>Jira —</strong> Risk that disable still surfaces compose entry points cached in SSP until refresh—call out forced refresh behaviour.",
        "<strong>Deployment Agent —</strong> Reminder to activate pending security policy changes after domain edits—common miss in UAT.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>two way email</code>; <strong>total 0</strong> on SUV—toggle metadata not discoverable with that string.",
        "<strong>XO MCP — risk:</strong> Ask engineering for the canonical toggle class or domain key so future gap reviews can search precisely.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Tenant-facing story is directionally right but thin on where admins click and which domains move with the toggle.",
    "Attach AC lines that name the exact tenant tasks and security domains impacted when the channel is flipped off.",
    "<p><strong>Scenario: Disable mid-session</strong></p><p><strong>Given</strong> a recruiter already has the SSP compose surface open<br/><strong>When</strong> an admin disables two-way email<br/><strong>Then</strong> the UI blocks new sends with messaging consistent with HRREC-92014-style closed-channel copy.</p>",
    None,
)

row(
    "HRREC-91979",
    "PH: Recruiter does not have access to the compose email task",
    "40% — Mirrors SMS view-only precedent; XO did not return Conversation Write Access domain hits with naive search.",
    [
        "<strong>Jira —</strong> Explicitly ties Add visibility to write access on Conversation Write Access domain and REST getConversationContextInstance.",
        "<strong>Salomon —</strong> HRREC-79830 SMS pattern: send UI suppressed without Modify on Candidate SMS Conversations—good analogue for acceptance language.",
        "<strong>Deployment Agent —</strong> View-only is achieved by granting View without Modify on the relevant messaging domain (pattern described for SMS).",
    ],
    [
        "<strong>Jira —</strong> Recruiters with partial access might still see Reply in wide view if another story regresses—cross-check with HRREC-91982.",
        "<strong>Deployment Agent —</strong> After domain tweaks, activation of pending security policy changes is required or behaviour looks flaky.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>Conversation Write Access</code>; only generic relationship hits—domain not surfaced by label alone.",
        "<strong>XO MCP — risk:</strong> Confirm exact domain ID and functional area name that gates email compose vs SMS.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Clear security-driven slice with SMS precedent; metadata search needs the precise domain name.",
    "Ask security admin to document the new email conversation domain alongside SMS domains in the rollout guide.",
    "<p><strong>Scenario: View-only recruiter</strong></p><p><strong>Given</strong> a recruiter has only View on the conversational email domain<br/><strong>When</strong> they open the email task<br/><strong>Then</strong> Add/Reply/New stay hidden in both list and wide layouts.</p>",
    None,
)

row(
    "HRREC-91980",
    "PH: Recruiter sees the panel expand when clicking Add to compose an email",
    "33% — Narrow UI motion story; XO echoes SSP WATS coverage; low cross-lens conflict.",
    [
        "<strong>Jira —</strong> Single scenario ties Add click to expansion widths and shadow per Figma.",
        "<strong>Salomon —</strong> UI Platform microtransaction references reinforce modal vs side-panel shadow differences—use to avoid double shadows.",
    ],
    [
        "<strong>Jira —</strong> Edge: double-click Add should not create duplicate compose shells—pair with HRREC-91994 send-disable behaviour.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>Sliding Side Panel</code>; WATS layout and SMS/WhatsApp SSP tests returned—automation anchors only.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Small interaction story with clear Figma dependency.",
    "Have UX attach a short Loom for Add double-click behaviour so QA does not guess.",
    "<p>No additional BDD suggested—keep Jira single scenario as source of truth.</p>",
    None,
)

row(
    "HRREC-91982",
    "PH: Recruiter opens the message to read and reply",
    "45% — Combines read, reply, and disabled states; Salomon drifted to generic RTE articles; needs tighter email-thread scope in QA.",
    [
        "<strong>Jira —</strong> Wide read view plus Reply opening RTE compose; disabled conversation hides actions with explanatory copy.",
        "<strong>Salomon —</strong> Many RTE/help hits are adjacent; none replace explicit email-thread disabled rules—treat as reminder to cite product not help.",
    ],
    [
        "<strong>Jira —</strong> Reply hidden states must align with HRREC-92014 terminal closure and HRREC-92006 opt-out—regression risk at intersection.",
        "<strong>Salomon —</strong> Notification designer misapplication bugs show copy can mis-fire—watch placeholder text when conversation is disabled.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>Message Builder</code>; convenience tasks for MB configuration—not runtime compose binding.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Important glue story between list, wide view, and compose; depends on sibling closure rules.",
    "Add one cross-links table in Jira listing which sibling owns each disabled reason (opt-out, bounce, close).",
    "<p><strong>Scenario: Disabled thread</strong></p><p><strong>Given</strong> HRREC-92014 closed-conversation state<br/><strong>When</strong> the recruiter opens the message in wide view<br/><strong>Then</strong> Reply stays hidden and the info message matches the closed-reason copy deck.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-90243 excerpt (lifecycle banner timing) — consider for 2WE if "conversation closing" email copy should appear on business events, not only after first send; WhatsApp session rules do not copy to email.',
)

row(
    "HRREC-91985",
    "PH: Recruiter can compose an email to non-agency candidate",
    "50% — Opt-in and domain gates are clear; XO search for Conversational Email returned generic noise; QA worries about cross-story drift.",
    [
        "<strong>Jira —</strong> Three scenarios for opt-in, not opted in, and view-only—maps cleanly to PRD language.",
        "<strong>Salomon —</strong> Internal routing notes emphasise HRREC ownership of candidate messaging panel—useful for defect triage, not extra requirements.",
    ],
    [
        "<strong>Jira —</strong> Recruiters may confuse this slice with agency clone HRREC-92029—ensure scenarios name “non-agency” explicitly in UAT scripts.",
        "<strong>Salomon —</strong> Blank panel after opt-out/in (HRREC-79728) suggests retesting compose visibility toggles around consent changes.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>Conversational Email</code>; only generic secured relationships—no named conversational email class.",
        "<strong>XO MCP — risk:</strong> Ask engineering for the class or REST resource backing opt-in checks so future searches are precise.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Consent-aware compose slice is logically sound; metadata search did not confirm backing implementation hooks.",
    "Pair with HRREC-92006 in refinement to align opt-out strings and disabled affordances.",
    "<p><strong>Scenario: Opt-in flips while compose open</strong></p><p><strong>Given</strong> a candidate opts out while the recruiter is composing<br/><strong>When</strong> the recruiter attempts Send<br/><strong>Then</strong> HRREC-92004-style error path blocks send and preserves text per notes.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84390 excerpt (recruiter opt-in GWT) — consider for 2WE if recruiter-side consent mirrors WhatsApp opt-in patterns; email consent copy lives in different admin tasks.',
)

row(
    "HRREC-91986",
    "PH: Recruiter expands/collapses the panel to check candidate profile (context stays?)",
    "52% — Question mark in title reflects uncertainty; Salomon weak on draft retention; XO surfaced Conversation classes unrelated to draft state.",
    [
        "<strong>Jira —</strong> Scenario demands draft persistence across SSP collapse/expand—high value but competes with “no backend drafts” notes in discard stories.",
        "<strong>Salomon —</strong> Little direct precedent; Succession replaced sliding panels with popups—do not over-interpret, but signals platform inconsistency risk.",
    ],
    [
        "<strong>Jira —</strong> Risk: recruiter loses RTE content when collapsing if only local state is supported—document storage boundary with HRREC-91995/91996.",
        "<strong>Salomon —</strong> Kernel navigation docs may matter if collapse triggers route change vs CSS hide—QA should know which behaviour is expected.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>cl: Conversation</code>; returned core Conversation classes without draft lifecycle fields in summary.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Draft persistence vs “local only” backend stance is the real tension.",
    "Decide with engineering whether collapse uses unmount (loses draft) or keeps mounted; update Jira title question mark accordingly.",
    "<p><strong>Scenario: Collapse with unsent text</strong></p><p><strong>Given</strong> the recruiter typed body text and collapses the SSP without navigating away<br/><strong>When</strong> they expand again<br/><strong>Then</strong> the story states whether the draft survives and matches discard-popup expectations.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-92062 excerpt (disable input while send in flight) — consider for 2WE if collapse during in-flight send should queue or discard partial RTE content; channel differs but UX race is similar.',
)

row(
    "HRREC-91987",
    "PH: Recruiter can select To, From & Subject (UI) when composing an email",
    "36% — UI-only header controls; Salomon gives MB admin context; XO repeats MB tasks.",
    [
        "<strong>Jira —</strong> Custom dropdowns replace native MB free-text fields per design—important scope boundary for MB team.",
        "<strong>Salomon —</strong> Admin Guide MB concepts and Financials email letter example show MB can auto-populate To/From/Subject—align wording so recruiters are not confused.",
    ],
    [
        "<strong>Jira —</strong> Subject maxlength and character set not stated—pair with HRREC-91993 validations.",
    ],
    [
        "<strong>XO MCP —</strong> Searched <code>Message Builder</code>; configuration convenience tasks only.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Straightforward UI shell story with dependency on MB/OE list population elsewhere.",
    "Confirm in refinement who owns dropdown data contracts (REST field names) before VS sign-off.",
    "<p>No additional BDD suggested beyond Jira scenarios.</p>",
    None,
)

# Band 2 keys
row(
    "HRREC-91988",
    "PH: Recruiter attaches documents (UI only)",
    "30% — Three scenarios, clear UI-only boundary; modest lens tension.",
    [
        "<strong>Jira —</strong> Covers render, attach/remove pill, and client-side type/size validation.",
        "<strong>Salomon —</strong> MB admin + routing articles remind that actual allowlists may still be tenant/OE driven beyond UI mocks.",
    ],
    [
        "<strong>Jira —</strong> Recruiters might pass UI validation but still fail server validation on Send—call out dependency on HRREC-92036.",
    ],
    [
        "<strong>XO MCP —</strong> Message Builder configuration tasks surfaced—configuration not runtime widget.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "UI-only attachment shell is well bounded; server parity is explicitly out of scope but note the handoff.",
    "Tag HRREC-92036 in AC as the integration point for Blobatory-backed attachments.",
    "<p><strong>Scenario: Server rejects allowed UI file</strong></p><p><strong>Given</strong> UI accepted a file within stated limits<br/><strong>When</strong> Send calls REST with stricter policy<br/><strong>Then</strong> recruiter sees HRREC-92004 messaging without silent drop (document owner in HRREC-92036).</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84403 excerpt (hydrate failures must surface in composer) — consider for 2WE if attachment preview vs send could disagree; WhatsApp hydration differs from email Blobatory path.',
)

row(
    "HRREC-91989",
    "PH: Recruiter can use the RTE & see the UI of buttons",
    "28% — Explicitly excludes GenAI button; aligns with compose MVP exclusions in rule 012.",
    [
        "<strong>Jira —</strong> Scenario 2 explicitly hides GenAI sparkle—matches MVP boundary from product rules.",
        "<strong>Salomon —</strong> Several GenAI-in-MB articles exist—use only to defend exclusion, not to add AI scope.",
    ],
    [
        "<strong>Jira —</strong> Risk: platform RTE upgrade reintroduces sparkle by default—add regression note for MB upgrades.",
    ],
    [
        "<strong>XO MCP —</strong> Same MB configuration hits as other compose stories.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "RTE presentation story is clear and policy-aligned.",
    "Add a single regression checkpoint for MB upgrades in the test plan, not new scenarios.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-91990",
    "PH: Recruiter can select From address from list of valid email addresses",
    "41% — Clones HRREC-92030; Salomon mixed Canvas and SMTP topics; XO weak on recruiting email string.",
    [
        "<strong>Jira —</strong> Backend-provided list including no-reply vs personal—good business framing.",
        "<strong>Salomon —</strong> Default Workday SMTP From patterns appear—useful for admin comms, not always candidate reply routing.",
    ],
    [
        "<strong>Jira —</strong> If clone diverges, recruiters see inconsistent From lists between agency vs non-agency paths—keep scenarios synced.",
    ],
    [
        "<strong>XO MCP —</strong> <code>recruiting email</code> search returned generic relationships only.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Logical dependency story; keep clone HRREC-92030 text aligned.",
    "Run a quick diff review between HRREC-91990 and HRREC-92030 before sprint planning to avoid drift.",
    "<p>No additional BDD suggested—dedupe with clone.</p>",
    None,
)

row(
    "HRREC-91991",
    "PH: Recruiter does not see any tabs for non-agency candidate",
    "37% — Clear tab-hiding rule; Salomon adds security-domain noise; XO surfaced two-way country onboarding bindings.",
    [
        "<strong>Jira —</strong> Scenario states All/Candidate/Agency tabs hidden and defaults to single thread—simple acceptance.",
        "<strong>Salomon —</strong> Candidate Notes tab security references remind that hidden tabs do not remove underlying access checks.",
    ],
    [
        "<strong>Jira —</strong> Edge: agency relationship added after apply should dynamically show tabs—confirm if in or out of scope.",
    ],
    [
        "<strong>XO MCP —</strong> <code>two way messaging</code> hits include onboarding method bindings and WATS mocks—country enablement, not tab logic.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "UI rule is crisp; dynamic agency association after apply may be unspecified.",
    "Add one sentence in Jira on whether late-bound agency linkage re-renders tabs without refresh.",
    "<p><strong>Scenario: Agency linked post-apply</strong></p><p><strong>Given</strong> the candidate applied direct then an agency is associated<br/><strong>When</strong> the recruiter reopens email task<br/><strong>Then</strong> tabs appear or stay hidden per the clarified rule.</p>",
    None,
)

row(
    "HRREC-91992",
    "PH: Recruiter attaches non-supported files",
    "34% — Three concrete negative scenarios; Salomon rich on platform attachment limits.",
    [
        "<strong>Jira —</strong> Client-side blocks for extension, single oversize, and cumulative payload—matches enterprise expectations.",
        "<strong>Salomon —</strong> REST and GraphQL attachment limit articles reinforce that tenant caps may be stricter than UI defaults—document source of truth.",
    ],
    [
        "<strong>Jira —</strong> Cumulative 30 MB example must match OE actuals—mis-stated limits become defects.",
    ],
    [
        "<strong>XO MCP —</strong> <code>attachment</code> search returned generic Attachment derived classes—not recruiting-specific guardrails.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Strong negative-path story; confirm the numeric limits against OE documentation.",
    "Ask OE for the authoritative max attachment size and count before locking QA data.",
    "<p>No additional BDD suggested.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-90311 excerpt (Meta marketing template US block) — consider for 2WE only as a reminder that channel-specific validation exists; do not import Meta rules—define email-specific blocked content policy separately.',
)

row(
    "HRREC-91993",
    "PH: Recruiter sees UI error validations on Send",
    "32% — Inline validation for Subject/To; Salomon references other email send concurrency notes.",
    [
        "<strong>Jira —</strong> Blocking errors with aggregate count—good recruiter-visible pattern.",
        "<strong>Salomon —</strong> CoffeeHub TDD notes on recruiting email vs candidate email highlight concurrency risks—optional awareness for QA pairing.",
    ],
    [
        "<strong>Jira —</strong> Ensure error strings differ for To vs From vs Subject so recruiters can fix quickly.",
    ],
    [
        "<strong>XO MCP —</strong> <code>validation</code> returned many generic WATS “[SC]: Validation” scenarios—little recruiting specificity.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Focused validation slice with clear Given/When/Then.",
    "Align error copy with Message Builder standards to avoid a second tone of voice.",
    "<p>No additional BDD suggested.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-90268 excerpt (disable Send while sending) — consider for 2WE if inline validation should coexist with disabled-send during in-flight REST; email should avoid double-send like WhatsApp composer.',
)

row(
    "HRREC-91994",
    "PH: Send Message (No Attachments)",
    "46% — Core send path; Salomon cites SMS QA API split; XO weak on Recruiting Email; depends on HRREC-92036 clone.",
    [
        "<strong>Jira —</strong> REST dispatch, polling/retry, duplicate-send prevention—covers critical reliability themes.",
        "<strong>Salomon —</strong> Two-way SMS QA material contrasts XO vs REST/Drogon—useful spike pointer if email hits similar gaps.",
    ],
    [
        "<strong>Jira —</strong> Polling story must cap backoff to avoid UI spinners stuck forever—state max wait in AC.",
        "<strong>Salomon —</strong> SMS panel oddities after phone change hint environment sensitivity—run on fresh candidate emails too.",
    ],
    [
        "<strong>XO MCP —</strong> <code>Recruiting Email</code> search returned generic secured relationships only.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Central send story is strong but needs explicit polling limits and clone alignment to attachments.",
    "Add numeric polling timeout + single error path matrix shared with HRREC-92036 before hardening sprint.",
    "<p><strong>Scenario: Polling timeout</strong></p><p><strong>Given</strong> REST accepted send but status lags<br/><strong>When</strong> polling exceeds the agreed timeout<br/><strong>Then</strong> recruiter sees a actionable message and thread shows intermediate state per design.</p>",
    None,
)

row(
    "HRREC-91995",
    "PH: Recruiter gets discard popup by changing pages",
    "44% — Navigation discard; Note says no backend drafts; Salomon kernel navigation docs; XO generic discard WATS.",
    [
        "<strong>Jira —</strong> Warns on navigation with unsaved text; aligns with May 2026 MB backend stance in Notes.",
        "<strong>Salomon —</strong> Kernel navigate.modal guidance may matter if discard uses modal route vs in-panel dialog.",
    ],
    [
        "<strong>Jira —</strong> Browser refresh vs in-app navigation—ensure scenario names which loses draft.",
    ],
    [
        "<strong>XO MCP —</strong> <code>discard</code> hits are generic WATS discard scenarios—not recruiting-specific.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Discard-on-navigation complements HRREC-91996; boundary on refresh still fuzzy.",
    "Add explicit browser refresh behaviour (expect data loss vs warn) to avoid QA arguing severity.",
    "<p><strong>Scenario: Browser refresh</strong></p><p><strong>Given</strong> unsent text in compose<br/><strong>When</strong> the recruiter refreshes the browser<br/><strong>Then</strong> Jira states whether the same discard dialog appears or data loss is accepted risk.</p>",
    None,
)

row(
    "HRREC-91996",
    "PH: Recruiter gets discard popup when they click the Discard button",
    "34% — Button and Escape parity; Salomon cites modal precedents; similar discard WATS noise in XO.",
    [
        "<strong>Jira —</strong> Distinguishes empty vs unsent text and Escape key parity—good detail.",
    ],
    [
        "<strong>Jira —</strong> Risk: Escape captured by RTE first—confirm event ordering with UX.",
    ],
    [
        "<strong>XO MCP —</strong> Discard WATS hits only.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Solid micro-interaction story tied to local-only draft stance.",
    "Pair test cases with HRREC-91995 so navigation and button paths cannot contradict.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-91997",
    "PH: Recruiter sees list of messages with unread ones marked in blue",
    "43% — Unread markers + server refresh + accessibility; Salomon mixed colour-blindness articles.",
    [
        "<strong>Jira —</strong> Scenario 3 calls out non-colour cue—important compliance hook.",
        "<strong>Salomon —</strong> Unread count articles for other channels—reminder to sync iconography with SMS/WhatsApp where intentional.",
    ],
    [
        "<strong>Jira —</strong> Concurrent read updates must define eventual consistency window—otherwise recruiters argue unread drift.",
    ],
    [
        "<strong>XO MCP —</strong> <code>unread</code> surfaced notifications WATS and case unread queries—adjacent domain, not recruiting thread list.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Unread list story is mostly complete; needs timing clarity on cross-recruiter read state.",
    "Add one AC line for refresh cadence (polling vs websocket) so QA knows how fast blue clears.",
    "<p><strong>Scenario: Two recruiters</strong></p><p><strong>Given</strong> two recruiters view the same thread list<br/><strong>When</strong> one marks read<br/><strong>Then</strong> the other sees blue clear within the stated refresh interval.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84407 excerpt (read/unread OE timing) — consider for 2WE if email “read” markers promise more than delivery receipts support; do not assume WhatsApp read semantics.',
)

row(
    "HRREC-91998",
    "PH: Recruiter can see message threads when clicking on a message",
    "38% — Thread ordering and empty reply-only threads; Salomon references unanswered conversations card.",
    [
        "<strong>Jira —</strong> Specifies descending chronological order and outbound-only threads.",
    ],
    [
        "<strong>Jira —</strong> Long threads performance not mentioned—flag as non-functional risk if transcripts can be huge.",
    ],
    [
        "<strong>XO MCP —</strong> <code>conversation</code> hits include WATS create/view conversation tasks—platform coverage exists.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Thread preview story is clear; performance is the latent gap.",
    "If transcripts can exceed a few dozen messages, add a spike line or lazy-load note in Jira.",
    "<p>No additional BDD suggested.</p>",
    None,
)

# Band 3
row(
    "HRREC-91999",
    'PH: Recruiter sees blue "unread marker" removed after clicking in the view a message in full',
    "47% — Read receipt semantics; Salomon references participant read index; XO mixed helpers; partial Jira excerpt in band data.",
    [
        "<strong>Jira —</strong> Requires unread clears only after full read, not peek—policy-sensitive.",
        "<strong>Salomon —</strong> Internal notes on participant read tracking and API completeness—worth an engineering read on parity between UI marker and server truth.",
    ],
    [
        "<strong>Jira —</strong> Recruiters may disagree on what counts as “full read” for long messages—define scroll depth or viewport threshold.",
    ],
    [
        "<strong>XO MCP —</strong> Search returned What’s New items and 2-way messaging helper WATS—weak direct binding.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Read/unread policy is materially underspecified beyond the headline.",
    "Add explicit acceptance for partial scroll vs expanded wide view before QA scripts multiply.",
    "<p><strong>Scenario: Long message partial scroll</strong></p><p><strong>Given</strong> an inbound message taller than the viewport<br/><strong>When</strong> the recruiter scrolls halfway<br/><strong>Then</strong> unread marker behaviour matches the agreed policy.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84407 excerpt — consider for 2WE read marker promises vs email receipts; inspiration only.',
)

row(
    "HRREC-92001",
    "PH: Recruiter sees the panel expand & views full message when clicking the grow button or clicking a single message",
    "35% — Overlaps HRREC-91948 sizing; Salomon UI platform modal vs panel guidance.",
    [
        "<strong>Jira —</strong> XL overlay called out—consistent with initialization story.",
    ],
    [
        "<strong>Jira —</strong> Clicking a single message vs Grow might diverge—ensure both entry paths tested.",
    ],
    [
        "<strong>XO MCP —</strong> Sliding side panel WATS same as earlier stories.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Overlaps other expand stories; keep one owner for width tokens.",
    "Consolidate width numbers into a single design token appendix referenced by all expand stories.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92002",
    "PH: Style only - Recruiter sees messages showing, styled as per figma",
    "25% — Style-only reduces risk; Salomon routing notes; XO operational purge tasks appear noisy.",
    [
        "<strong>Jira —</strong> UI-only styling with newest-first ordering—scope is tight.",
    ],
    [
        "<strong>Jira —</strong> Style-only still must not regress accessibility roles on thread bubbles.",
    ],
    [
        "<strong>XO MCP —</strong> Mixed operational conversation message tasks—low interpretability for this slice.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Low gap style slice; still verify a11y basics.",
    "Ask for a single visual diff checklist rather than more BDD.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92003",
    "PH: Recruiter sees error messages if their email has bounced",
    "58% — Rich Jira on SES variants; Deployment Agent says no recruiter-visible bounce guidance documented; tension.",
    [
        "<strong>Jira —</strong> Many provider-aligned error strings—strong product intent.",
        "<strong>Salomon —</strong> SES operations depth is excellent for ops, not for in-app copy—translate carefully.",
        "<strong>Deployment Agent —</strong> No specific documentation for what recruiters see inside Workday on hard bounce vs complaint—flag as documentation risk.",
    ],
    [
        "<strong>Jira —</strong> Recruiters may see jargon if SES errors surface raw—pair with copy review.",
        "<strong>Deployment Agent —</strong> Without admin-guide clarity, UAT may pass while prod tenants misconfigure suppression visibility.",
    ],
    [
        "<strong>XO MCP —</strong> Only bounced campaign email WATS loop and analytics smoke—thin for conversational email bounce UI.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Strong scenario list meets a documentation void on in-product bounce UX.",
    "Schedule a short session with OE/comms to map each SES code to recruiter-facing copy and surfacing location.",
    "<p><strong>Scenario: Admin visibility</strong></p><p><strong>Given</strong> a bounce occurs<br/><strong>When</strong> an admin reviews tenant email health<br/><strong>Then</strong> clarify whether recruiters, admins, or only logs see the failure (document decision).</p>",
    None,
)

row(
    "HRREC-92004",
    "PH: Recruiter sees error when sending message (REST error)",
    "49% — Mid-session state loss and generic 500 paths; Salomon SMS opt-out and REST articles.",
    [
        "<strong>Jira —</strong> Explicit copy-text-and-refresh path when state changes mid-session—honest UX trade.",
    ],
    [
        "<strong>Jira —</strong> Draft loss on refresh is painful—ensure same copy referenced in HRREC-91995 decisions.",
    ],
    [
        "<strong>XO MCP —</strong> Conversation class hits present after error; first search errored per band note—risk from tooling flakiness.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Error story is pragmatic; draft-loss messaging must stay consistent with discard policy.",
    "Centralise REST error copy in one spreadsheet referenced by HRREC-92003/92004/91993.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92005",
    "PH: Recruiter sees info message and cannot send email if the candidate changes their email",
    "44% — Mirrors SMS phone-change class; Salomon merge and connector hits; XO surfaced Candidate SMS Conversations domain WATS.",
    [
        "<strong>Jira —</strong> Read-only history with info message—clear; merge called out as trigger.",
        "<strong>Salomon —</strong> Merge primary email selection and connector change detection give realistic test seeds.",
    ],
    [
        "<strong>Jira —</strong> Edge: agency vs candidate email change timing with HRREC-92029—coordinate scenarios.",
    ],
    [
        "<strong>XO MCP —</strong> Candidate SMS Conversations domain WATS loops—analogous security wiring likely for email when named.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Solid cross-channel parity intent without over-claiming SMS defects.",
    "Align merge test data with DMF playbooks Salomon referenced before QA spends time building actors.",
    "<p><strong>Scenario: Merge mid-thread</strong></p><p><strong>Given</strong> two applications merge while a thread is open<br/><strong>When</strong> primary email resolves to a new value<br/><strong>Then</strong> recruiter sees the info message and cannot send until refresh rules in Jira apply.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-90306 excerpt (merge wrong sender) — consider for 2WE if merge could repoint From or thread identity incorrectly; WhatsApp bug is not proof of email defect—audit email identity mapping.',
)

row(
    "HRREC-92006",
    "PH: Candidates opt-out of receiving emails",
    "46% — Opt-out hides actions; Salomon SMS lifecycle articles; XO weak on SMS opt class.",
    [
        "<strong>Jira —</strong> Conversation remains readable but not sendable—matches compliance intuition.",
        "<strong>Salomon —</strong> SMS opt-out auditing and mass opt-in admin tasks—useful for tenant test setup only.",
    ],
    [
        "<strong>Jira —</strong> Re-opt-in path must align with marketing vs transactional email rules—outside Jira today.",
    ],
    [
        "<strong>XO MCP —</strong> SMS Preferences candidate task appeared after broader search—possible analogue hook.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Candidate opt-out is described; legal/marketing classification for re-entry is not.",
    "Ask legal/privacy for one paragraph on re-opt-in constraints specific to recruiting transactional mail.",
    "<p><strong>Scenario: Re-opt-in</strong></p><p><strong>Given</strong> a candidate opts back in<br/><strong>When</strong> they receive the next recruiter message<br/><strong>Then</strong> document whether a fresh consent artifact is required for email (not SMS rules).</p>",
    None,
)

row(
    "HRREC-92007",
    "PH: Recruiter can switch between tabs for candidate and agency comms",
    "43% — Tab content separation; Salomon agency-heavy precedents; XO recruiting agency classes.",
    [
        "<strong>Jira —</strong> Default All tab and per-tab filters are clear for agency-submitted applications.",
        "<strong>Salomon —</strong> Agency BP and duplicate handling articles help build realistic fixtures.",
    ],
    [
        "<strong>Jira —</strong> Risk of cross-tab leakage if thread IDs reused—security story HRREC-92008 must be exercised together.",
    ],
    [
        "<strong>XO MCP —</strong> Recruiting Agency User classes found—useful vocabulary for eng questions.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Tab UX is clear; security validation belongs to sibling HRREC-92008.",
    "Run joint QA session with HRREC-92008 for tab switching plus forbidden cross-thread fetches.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92008",
    "PH: Agency cannot see recruiter conversation",
    "52% — Security-heavy; Salomon mixed auth articles; XO agency user classes; needs explicit HTTP expectations in Jira excerpt.",
    [
        "<strong>Jira —</strong> Requires 403/404 without leakage—good security bar if REST paths are explicit in full ticket.",
        "<strong>Salomon —</strong> Agency authentication delegation articles are noisy—stay focused on authz matrix from Jira.",
    ],
    [
        "<strong>Jira —</strong> UI might hide tabs but REST could still leak—QA must hammer direct REST attempts, not only UI.",
    ],
    [
        "<strong>XO MCP —</strong> Recruiting Agency User class hits—confirm security policies wrap new email REST collections.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Authorization slice is high stakes; UI-only testing would miss the risk Jira names.",
    "Add explicit REST negative tests (agency token) to AC table, not only UI tab absence.",
    "<p><strong>Scenario: Agency REST direct fetch</strong></p><p><strong>Given</strong> an agency user bearer token<br/><strong>When</strong> they call the candidate-only thread endpoint<br/><strong>Then</strong> response is 403/404 and body contains no candidate-only text snippets.</p>",
    None,
)

row(
    "HRREC-92009",
    "PH: Recruiter can see both closed and non-closed conversation in the same panel if one conversation is still active",
    "45% — Mixed open/closed states per tab; Salomon active conversation reporting references.",
    [
        "<strong>Jira —</strong> Independent closure with per-tab read-only behaviour—clear scenario intent.",
    ],
    [
        "<strong>Jira —</strong> Edge: which tab wins default focus when one closes mid-read—specify to avoid flicker bugs.",
    ],
    [
        "<strong>XO MCP —</strong> Conversation Topic classes returned—metadata adjacent, not UI state machine.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Useful complexity story; tab focus default is the hidden gap.",
    "Add AC for default tab selection after partial closure events.",
    "<p><strong>Scenario: Close while composing on other tab</strong></p><p><strong>Given</strong> the recruiter is composing on Candidate tab<br/><strong>When</strong> Agency tab closes automatically<br/><strong>Then</strong> Candidate compose state remains intact without silent navigation.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84534 excerpt (24h expiry messaging) — consider for 2WE if mixed open/closed tabs need time-bounded copy; email lifecycle differs from WhatsApp session windows.',
)

row(
    "HRREC-92010",
    "PH: Recruiter sees tags on messages showing updating state (sent, not delivered)",
    "40% — Delivery state tags; Salomon SES + SMS undelivered references; XO found Conversation Message Status class.",
    [
        "<strong>Jira —</strong> Sent vs Not Delivered distinction after provider handoff—matches recruiter mental model.",
        "<strong>Salomon —</strong> SES verification docs help QA seed failure cases responsibly.",
    ],
    [
        "<strong>Jira —</strong> Latency between Sent and Not Delivered should be bounded to avoid flicker.",
    ],
    [
        "<strong>XO MCP —</strong> Conversation Message Status class hit—positive adjacency for status enum questions.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Tag story is coherent and backed by a concrete status class hint in XO.",
    "Ask engineering for the canonical enum values for message status to align copy and colour tokens.",
    "<p>No additional BDD suggested.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-89979 excerpt (silent until send) — consider for 2WE if delivery failures should surface when opening thread, not only after send; translation question only.',
)

# Band 4
row(
    "HRREC-92011",
    "PH: Privacy Admin purges PDTs for 2-way email - Candidate/Job App",
    "56% — Privacy-sensitive; Salomon GDPR hits; DA had no purge visibility guidance; XO purge WATS present.",
    [
        "<strong>Jira —</strong> Lists purge objects including messages, participants, attachments, notification events—broad blast radius.",
        "<strong>Salomon —</strong> GDPR purge patterns remind that async jobs and blob storage complicate verification.",
        "<strong>Deployment Agent —</strong> No specific admin expectation doc for post-purge recruiting communications visibility—treat as open documentation gap.",
    ],
    [
        "<strong>Jira —</strong> Risk: partial purge leaves broken threads visible—define success criteria per surface (timeline, reports, SSP).",
    ],
    [
        "<strong>XO MCP —</strong> Recruiting Communications purge WATS inline assignment hit—positive test anchor.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Strong privacy intent with missing tenant-facing documentation on what disappears where.",
    "Partner with privacy PM to publish a purge checklist covering Activity Stream, Timeline, and Candidate Communications referenced in HRREC-92035.",
    "<p><strong>Scenario: Post-purge recruiter view</strong></p><p><strong>Given</strong> purge completed for a candidate<br/><strong>When</strong> a recruiter opens the same job application<br/><strong>Then</strong> email task and reports show the agreed empty or placeholder state without orphaned attachments.</p>",
    None,
)

row(
    "HRREC-92012",
    "PH: Admin can configure conversation lifecycle tenant setting?",
    "41% — Question mark in summary; Deployment Agent gives concrete Recruiting tenant knobs; Salomon aligned.",
    [
        "<strong>Jira —</strong> Scenarios for post-disposition window, one-year scheduler cap, invalid input rejection—solid admin story candidate.",
        "<strong>Deployment Agent —</strong> Edit Tenant Setup – Recruiting exposes days-after-hire and days-after-disposition open conversation settings—maps directly to this slice.",
        "<strong>Salomon —</strong> Admin-guide lifecycle references reinforce behaviour.",
    ],
    [
        "<strong>Jira —</strong> Question mark suggests draft—confirm whether email reuses SMS conversation lifecycle or forks.",
    ],
    [
        "<strong>XO MCP —</strong> Conversation and Conversational UI Conversation classes found.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Tenant knobs exist for conversation days; email-specific fork still ambiguous in title.",
    "Rename summary to drop placeholder question mark once PM confirms reuse vs fork, and cite exact tenant field labels from Deployment Agent answer.",
    "<p>No additional BDD suggested once Jira summary is finalised.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84533/84534 excerpts (expiry UI) — consider for 2WE if lifecycle admin numbers surface the same countdown copy patterns as WhatsApp; still different channel rules.',
)

row(
    "HRREC-92013",
    "PH: Existing reporting features are not broken",
    "48% — Exploratory milestone; thin on concrete scenarios; Salomon reporting noise; XO weak signal.",
    [
        "<strong>Jira —</strong> Exploratory regression intent across SMS/WhatsApp reporting with email addition—valuable but not testable as written.",
        "<strong>Salomon —</strong> Reporting definitions articles support building a checklist, not automated AC.",
    ],
    [
        "<strong>Jira —</strong> Without a matrix, QA will either over-test or miss a channel—pick owner and artefact.",
    ],
    [
        "<strong>XO MCP —</strong> <code>recruiting conversation</code> returned generic secured relationships—no reporting class linkage.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Important epic hygiene story that reads like a milestone placeholder, not acceptance-ready slices.",
    "Split into a lightweight test matrix attachment (channels × reports) or spike before calling it a Story.",
    "<p><strong>Scenario: Candidate Communications row</strong></p><p><strong>Given</strong> a sent email with attachment<br/><strong>When</strong> the report runs<br/><strong>Then</strong> row shows parties, subject, timestamp per HRREC-92035 without breaking SMS rows.</p>",
    None,
)

row(
    "HRREC-92014",
    "PH: Recruiter cannot see reply, or Add button when both conversations are closed & sees info message? that convo is closed",
    "46% — Title punctuation suggests draft; Salomon closed conversation articles; XO zero on two-way email string.",
    [
        "<strong>Jira —</strong> Terminal closure hides Reply/Add with info message—matches HRREC-92009 dependencies.",
        "<strong>Salomon —</strong> Inbound-after-close may not appear—remind QA not to expect new mail after hard close.",
    ],
    [
        "<strong>Jira —</strong> Title clarity: candidate vs agency closure combinations need explicit matrix.",
    ],
    [
        "<strong>XO MCP —</strong> <code>two way email</code> returned 0 hits—metadata not indexed under that phrase.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Behaviour is understandable but Jira title/grammar undermines scanability and AC precision.",
    "Rewrite summary for recruiter-facing tone and add small table of closure combinations vs visible actions.",
    "<p>No additional BDD suggested after rewrite.</p>",
    None,
)

row(
    "HRREC-92015",
    "PH: Candidate has 2 applications to the same JR and gets merged",
    "50% — Merge edge; Salomon DMF playbooks; XO weak on merge-specific hits.",
    [
        "<strong>Jira —</strong> Calls out showing both contexts and email change pauses—good merge awareness.",
        "<strong>Salomon —</strong> DMF/UDMF merge references give data setup realism.",
    ],
    [
        "<strong>Jira —</strong> Two threads with same visible subject after merge could confuse—ask for UI differentiation.",
    ],
    [
        "<strong>XO MCP —</strong> <code>candidate merge messaging</code> low signal—mostly unrelated relationships.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Merge is a high-impact edge; metadata search did not surface dedicated hooks.",
    "Pair with engineering spike on thread key stability across DMF survivor IDs before QA invests.",
    "<p><strong>Scenario: Two threads same JR</strong></p><p><strong>Given</strong> duplicate applications merged<br/><strong>When</strong> recruiter opens email task<br/><strong>Then</strong> both threads remain distinguishable per Jira without wrong recipient preselection.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-84389 excerpt (merge threads) — consider for 2WE if email threads should follow survivor identity; WhatsApp merge rules are pattern hints only.',
)

row(
    "HRREC-92016",
    "PH: Candidate attaches non-supported files",
    "40% — Candidate-side mirror to recruiter attachments; Salomon ingestion testing depth; XO Message class hits.",
    [
        "<strong>Jira —</strong> UI surfaces system messages for virus/size/type failures—clear separation from backend enforcement.",
        "<strong>Salomon —</strong> Email ingestion cross-team testing references help QA coordinate with VSS/DROGON.",
    ],
    [
        "<strong>Jira —</strong> Candidate-visible copy must stay non-technical—avoid internal error codes.",
    ],
    [
        "<strong>XO MCP —</strong> Message class hits generic messaging platform—not candidate UI specific.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Candidate-side attachment surfacing is defined; copy and code hygiene are the residual risks.",
    "Run copy review with candidate-facing guidelines parallel to recruiter HRREC-91992.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92022",
    "PH: My Conversations will require an XO (small) refactor",
    "62% — Placeholder DoR; Salomon API split notes; XO My Conversations WATS; high thin-spec tension.",
    [
        "<strong>Jira —</strong> Placeholder with DoR table and OE PM discussion—insufficient spec per gate.",
        "<strong>Salomon —</strong> XO vs REST conversational messaging split underscores why this refactor matters.",
    ],
    [
        "<strong>Jira —</strong> Without acceptance, this is a schedule risk masquerading as a story.",
    ],
    [
        "<strong>XO MCP —</strong> My Conversations REST scenario and security policy loops found—good anchor once scoped.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Thin placeholder blocks planning for HRREC-91975 notification acceptance.",
    "Either convert to Spike with exit criteria or split into concrete XO tasks with AC referencing notification events.",
    "<p><strong>Blocked until AC exists</strong></p><p><strong>Given</strong> email replies will surface in My Conversations<br/><strong>When</strong> engineering completes refactor<br/><strong>Then</strong> document which XO objects and REST endpoints change for downstream QA.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> Internal Salomon themes on My Conversations SMS-first routing — consider for 2WE if email should appear there or remain bell/inbox weighted; WhatsApp delivery path differs.',
)

row(
    "HRREC-92029",
    "PH: Recruiter can compose an email to agency user or agency candidate",
    "48% — Agency-specific compose; Salomon noisy performance minutes; XO weak agency candidate email string.",
    [
        "<strong>Jira —</strong> Differentiates agency user vs agency-candidate opt-in rules—important nuance.",
    ],
    [
        "<strong>Jira —</strong> Easy to regress against HRREC-91985 non-agency rules—cross-link scenarios explicitly.",
    ],
    [
        "<strong>XO MCP —</strong> Agency candidate email search weak—privacy relationships dominated.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Agency compose path adds consent complexity beyond non-agency HRREC-91985.",
    "Create a side-by-side scenario table in epic notes: agency user vs agency candidate vs direct candidate.",
    "<p><strong>Scenario: Agency candidate opted out</strong></p><p><strong>Given</strong> agency-submitted application and candidate opted out of email<br/><strong>When</strong> recruiter attempts send to agency candidate<br/><strong>Then</strong> send is blocked with the same class of messaging as HRREC-92006.</p>",
    None,
)

row(
    "HRREC-92030",
    "PH: Recruiter can select To address from list of valid email addresses",
    "39% — Clone of HRREC-91990 directionally; Salomon primary email references; XO recruiting class hits generic.",
    [
        "<strong>Jira —</strong> To field lists labelled candidate vs agency addresses—composes HRREC-91987 dependency.",
        "<strong>Salomon —</strong> Primary Home Email and agency duplicate grids help testers seed addresses.",
    ],
    [
        "<strong>Jira —</strong> Multiple emails per person—confirm picker dedupes and shows preferred primary.",
    ],
    [
        "<strong>XO MCP —</strong> Generic Recruiting classes—not To-field binding.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "To-address population is clear engineering-wise; clone sync with HRREC-91990 remains the process gap.",
    "Maintain one owner to update both To stories whenever OE changes address book rules.",
    "<p>No additional BDD suggested.</p>",
    None,
)

row(
    "HRREC-92035",
    "PH: Email communications are visible in Activity Stream, Timeline and Candidate Communications",
    "47% — Broad visibility slice; Salomon prior attachment visibility bug; XO weak Candidate Communication hit.",
    [
        "<strong>Jira —</strong> Activity Stream, Recruiting History timeline, and Candidate Communications report—three surfaces in one story.",
        "<strong>Salomon —</strong> HRREC-72549 attachment filename visibility issues remind to clarify attachment clickability vs stream.",
    ],
    [
        "<strong>Jira —</strong> Cross-surface ordering and PII redaction rules not spelled out—large QA combinatorial space.",
    ],
    [
        "<strong>XO MCP —</strong> Candidate Communication search produced generic relationships—needs precise BO name from eng.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "High-value cross-cutting logging story that will sprawl without a surface-by-surface matrix.",
    "Split scenarios per surface or attach a traceability matrix before sprint commit.",
    "<p><strong>Scenario: Timeline ordering</strong></p><p><strong>Given</strong> email and SMS events same day<br/><strong>When</strong> recruiter opens timeline<br/><strong>Then</strong> ordering rule is explicit and stable across time zones.</p>",
    None,
)

row(
    "HRREC-92036",
    "PH: Send Message (With Attachments)",
    "45% — Blobatory payload; Salomon SSP patterns; XO Blobatory search nearly empty in band note.",
    [
        "<strong>Jira —</strong> Happy path with Blob IDs in REST and visual indicators—ties to HRREC-91988 UI shell.",
        "<strong>Salomon —</strong> SSP HRREC-69046 references remind about panel context when verifying send outcomes.",
    ],
    [
        "<strong>Jira —</strong> Partial attachment failure mid-send needs decision—all-or-nothing vs partial.",
    ],
    [
        "<strong>XO MCP —</strong> Blobatory search did not return strong class hits in subagent run—ask engineering for REST schema link.",
        "<strong>Peanut —</strong> Not available this run (Jira fetch error).",
    ],
    "Attachment send completes the stack started in UI-only HRREC-91988.",
    "Document REST payload example with multiple attachments including failure rollback behaviour.",
    "<p><strong>Scenario: One attachment fails virus scan</strong></p><p><strong>Given</strong> multiple attachments staged<br/><strong>When</strong> one fails scanning at send<br/><strong>Then</strong> recruiter sees which attachment failed and whether entire send aborts.</p>",
    '<strong>Cross-channel (WhatsApp backlog) —</strong> HRREC-89778 excerpt (CRF scope for MB) — consider for 2WE if attachment metadata fields in reports respect the same CRF scoping as MB hydration; email uses different attachment store than WhatsApp media.',
)


def ul(items: list[str]) -> str:
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def build_page() -> str:
    parts: list[str] = []
    parts.append("<h2>Executive summary (for PM)</h2>")
    parts.append("<ul>")
    parts.append(
        "<li><strong>Run tier:</strong> A (full contract). <strong>Companion:</strong> manifest-only WhatsApp frozen corpus 2026-05-16 — no live Jira for WhatsApp companion keys this run.</li>"
    )
    parts.append(
        "<li><strong>Scope:</strong> 44 Stories under HRREC-82977; skipped doc-writer keys HRREC-90852 (AG:), HRREC-90853 (RN:). <strong>Peanut MCP</strong> returned Jira fetch errors for every <code>collectBugData</code> attempt — Dev lens documents that honestly.</li>"
    )
    parts.append("</ul>")
    parts.append("<h3>Top 5 gaps (epic)</h3><ul>")
    gaps = [
        "Placeholder security refactor HRREC-92022 lacks acceptance while HRREC-91975 depends on notification routing — align OE before build commitment.",
        "Cross-surface logging HRREC-92035 bundles Activity Stream, Timeline, and reporting without a per-surface matrix — split or attach traceability before QA load explodes.",
        "Bounce/recruiter-visible error paths HRREC-92003 conflict with Deployment Agent silence on in-product bounce UX — schedule OE copy mapping for SES outcomes.",
        "Draft persistence vs “no backend drafts” tension spans HRREC-91986, HRREC-91995, and HRREC-91996 — decide collapse/navigation behaviour once.",
        "XO metadata searches often returned generic relationships for plain-text queries such as two way email and Recruiting Email — engineering should publish canonical class/REST names for gap reviews.",
    ]
    for g in gaps:
        parts.append(f"<li>{esc(g)}</li>")
    parts.append("</ul>")
    parts.append("<h3>Top 5 strengths (epic)</h3><ul>")
    strengths = [
        "Initialization pair HRREC-91946/91948 grounds SSP placement, masking, and responsive width with explicit Figma and scenario detail.",
        "Compose stack HRREC-91987–91994 chains header fields, RTE, validation, discard, and send with explicit UI-only vs REST boundaries.",
        "Agency security cluster HRREC-92007–92008 names forbidden cross-thread access — rare explicit authz language for a recruiting UI epic.",
        "Operational realism stories HRREC-92003–92005 and HRREC-92010 translate SES and merge edge cases into recruiter-visible messaging.",
        "Tenant lifecycle HRREC-92012 aligns with documented Edit Tenant Setup – Recruiting conversation day settings from Deployment Agent.",
    ]
    for s in strengths:
        parts.append(f"<li>{esc(s)}</li>")
    parts.append("</ul>")

    parts.append("<h2>Epic-level notes</h2><ul>")
    notes = [
        "Overlapping expand/collapse stories (91948, 91980, 92001) should share one design token appendix to avoid conflicting widths in QA.",
        "Send path split HRREC-91994 vs HRREC-92036 (attachments) must keep polling, duplicate-send prevention, and Blobatory payload docs synchronized.",
        "Reporting regression HRREC-92013 should either link to a living test matrix or be demoted to Task/Spike — current text is milestone tone, not acceptance-ready.",
        "Notification + My Conversations + email redirect triangle (91975, Deployment Agent B) needs a single one-page decision memo to prevent duplicate alerts.",
    ]
    for n in notes:
        parts.append(f"<li>{esc(n)}</li>")
    parts.append("</ul>")

    parts.append("<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>")
    parts.append(
        "<p><strong>Frozen pattern corpus</strong> — snapshot_as_of <strong>2026-05-16</strong> in "
        "<code>docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md</code> "
        "(66 manifest keys). <strong>No live Jira pull for WhatsApp companion this run (manifest-only).</strong> "
        "Theme anchors use <strong>Captured excerpts</strong> only — not current WhatsApp backlog.</p>"
    )
    parts.append(
        "<p><strong>Same surface, different channel:</strong> WhatsApp and email are both inbound/outbound Recruiting comms, but "
        "consent, templates, media, delivery semantics, and failure modes differ. "
        "<strong>Different backend / OE:</strong> WhatsApp partner delivery is often Twilio-oriented in internal discussions; "
        "two-way email uses Workday’s email integration path. "
        "<strong>Bugs = delivery pain signals, not email defects.</strong> "
        "<strong>Inspiration only</strong> — never treat WhatsApp issues as proof email is broken.</p>"
    )
    parts.append("<ul>")
    themes = [
        "<li><strong>HRREC-84403 / HRREC-89856</strong> (template preview vs send hydration) — <em>Consider for 2WE if</em> MB preview and sent email bodies always resolve tokens under the same recruiter security context?</li>",
        "<li><strong>HRREC-90268 / HRREC-92062</strong> (disable send / typing while in flight) — <em>Consider for 2WE if</em> email compose should disable Send and buffer typing during slow REST responses?</li>",
        "<li><strong>HRREC-89979</strong> (failures surfacing late) — <em>Consider for 2WE if</em> recruiter-visible errors appear when opening a thread, not only after pressing Send?</li>",
        "<li><strong>HRREC-90306 / HRREC-84389</strong> (merge identity) — <em>Consider for 2WE if</em> candidate merge could mis-attribute email threads or From addresses?</li>",
        "<li><strong>HRREC-89899</strong> (broken consent chrome when tenant text missing) — <em>Consider for 2WE if</em> email opt-in UI hides broken links when tenant notification text is incomplete?</li>",
    ]
    parts.extend(themes)
    parts.append("</ul>")

    parts.append("<table><thead><tr>")
    for h in [
        "Story",
        "Gap Likelihood",
        "PM lens",
        "QA lens",
        "Dev lens",
        "Verdict",
        "Suggested missing BDD (Given/When/Then)",
    ]:
        parts.append(f"<th>{h}</th>")
    parts.append("</tr></thead><tbody>")

    for r in ROWS:
        parts.append(f"<!-- gap-review {r['key']} --><tr>")
        story_cell = f'<a href="https://jira2.workday.com/browse/{r["key"]}">{r["key"]}</a><br/>{esc(r["summary"])}'
        parts.append(f"<td>{story_cell}</td>")
        parts.append(f"<td>{gap_likelihood_cell_from_legacy_pct_clause(r['gap'])}</td>")
        parts.append(f"<td>{ul(r['pm'])}</td>")
        parts.append(f"<td>{ul(r['qa'])}</td>")
        parts.append(f"<td>{ul(r['dev'])}</td>")
        verdict = (
            "<ul>"
            f"<li><strong>Finding:</strong> {esc(r['vf'])}</li>"
            f"<li><strong>Recommended next step:</strong> {esc(r['vn'])}</li>"
            "</ul>"
        )
        parts.append(f"<td>{verdict}</td>")
        parts.append(f"<td>{r['bdd']}</td>")
        parts.append("</tr>")

    parts.append("</tbody></table>")
    return "\n".join(parts)


def main() -> None:
    assert len(ROWS) == 44, len(ROWS)
    body = build_page()
    OUT.write_text(body, encoding="utf-8")
    print(OUT, len(body))


if __name__ == "__main__":
    main()
