#!/usr/bin/env python3
"""One-off emitter: HRREC-82977 gap review Storage HTML for Confluence (2026-05-17 run)."""
import html

STATUS = {
    "Very High": ("Red", "Very High"),
    "High": ("Yellow", "High"),
    "Medium": ("Blue", "Medium"),
    "Low": ("Green", "Low"),
    "Very Low": ("Grey", "Very Low"),
}


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def verdict_line_plain(vl: str) -> str:
    """Confluence Storage rejects some emoji (e.g. coloured circles); keep text only in Verdict."""
    if len(vl) > 2 and vl[1] == " ":
        return vl[2:]
    return vl


def macro(label: str) -> str:
    c, t = STATUS[label]
    return (
        f'<ac:structured-macro ac:name="status" ac:schema-version="1">'
        f'<ac:parameter ac:name="colour">{c}</ac:parameter>'
        f'<ac:parameter ac:name="title">{t}</ac:parameter>'
        "</ac:structured-macro>"
    )


def tr(key: str, summ: str, pm: str, qa: str, dev: str, gap: str, vl: str, find: str, nxt: str, bdd: str) -> str:
    return (
        f'<tr><!-- gap-review {key} --><td><a href="https://jira2.workday.com/browse/{key}">{key}</a><br/>{esc(summ)}</td>'
        f"<td>{macro(gap)}</td>"
        f"<td>{esc(pm)}</td><td>{esc(qa)}</td><td>{esc(dev)}</td>"
        f"<td><p>{esc(verdict_line_plain(vl))}</p><ul><li><strong>Finding:</strong> {esc(find)}</li>"
        f"<li><strong>Recommended next step:</strong> {esc(nxt)}</li></ul></td>"
        f"<td>{bdd}</td></tr>"
    )


preamble = """
<h2>Executive summary (for PM)</h2>
<ul>
<li>(1) Run tier: A (full contract). Gap Likelihood reflects Verdict + suggested missing BDD only.</li>
<li>(2) Scope: Stories under HRREC-82977 only; skipped doc-writer stories AG: HRREC-90852 and RN: HRREC-90853 from the main table per skill exclusions.</li>
<li>(3) Jira text refreshed via getTicketDetails on 2026-05-17 for every in-scope story; lenses below are keyed to those descriptions plus initiative CONTEXT/PRD pointers.</li>
</ul>
<h3>Top 5 gaps (epic)</h3>
<ul>
<li>Merge and primary-email changes can strand threads or wrong sender identity—close the gap before UAT with engineering on participant binding (HRREC-92015, HRREC-92005).</li>
<li>Notifications for inbound email must survive real tenant routing (My Conversations vs bell) and disabled-account edge cases (HRREC-91975).</li>
<li>Local-only drafts plus navigation/refresh errors create credible data-loss paths—copy and behaviour need explicit pairing (HRREC-91995, HRREC-92004).</li>
<li>Lifecycle admin story (HRREC-92012) and My Conversations refactor placeholder (HRREC-92022) are thin for sizing.</li>
<li>Reporting smoke story (HRREC-92013) needs named report surfaces so regressions are detectable.</li>
</ul>
<h3>Top 5 strengths (epic)</h3>
<ul>
<li>Strong scenario depth on send, validation, bounce taxonomy, and attachment limits across PH milestones.</li>
<li>Security-sensitive slices (agency isolation HRREC-92008, read-only compose HRREC-91979) already call out explicit UI hiding.</li>
<li>Purge story HRREC-92011 lists concrete data classes aligned with internal Recruiting Communications PDT guidance.</li>
<li>Unread/read stories HRREC-91997–91999 include accessibility and concurrency hooks.</li>
<li>Agency vs candidate tab set HRREC-92007–92009 spells independent lifecycles—a hard multi-tab problem stated plainly.</li>
</ul>
<h2>Epic-level notes</h2>
<ul>
<li>Many PH stories assume Message Builder chrome but exclude GenAI—keep that exclusion visible whenever RTE stories touch toolbar configuration.</li>
<li>Overlap: grow/expand appears in HRREC-91948, 91980, 92001—keep breakpoints and shrink rules consistent once UX decides reopen behaviour.</li>
<li>Dependency: HRREC-91990 and HRREC-92030 split From vs To lists—refinement should confirm ordering of delivery.</li>
</ul>
<h2>Cross-initiative pattern hints (WhatsApp — inspiration only)</h2>
<p><strong>Hard disclaimers (verbatim):</strong> (1) Same surface, different channel: WhatsApp and email differ on consent, templates, media, delivery semantics, and failure modes. (2) Different backend / OE: WhatsApp partner delivery is often Twilio-oriented; two-way email uses Workday email integration—not the same path. (3) Bugs under companion epics are delivery pain signals for pattern hints, not proof email is broken. (4) Inspiration only—phrase as translation questions for email.</p>
<p><strong>Corpus line (manifest-only):</strong> WhatsApp companion evidence from frozen snapshot dated 2026-05-16 with complete manifest (66 keys, 22 captured excerpts); no live WhatsApp Jira pull this run.</p>
<ul>
<li><strong>Merge / identity (HRREC-90306):</strong> After merge, outbound can show merged candidate as sender—ask whether email From/To and thread participants rebind to the survivor.</li>
<li><strong>Send guard (HRREC-90268):</strong> Disable send while in flight—mirror for email double-click on Send.</li>
<li><strong>Silent failures (HRREC-89979):</strong> Prefer failing fast on open when limits block new conversations, not only on send.</li>
<li><strong>Unread / refresh (HRREC-84533):</strong> Countdowns should stay accurate on refresh for any email expiry UI.</li>
<li><strong>Notifications (HRREC-84383 pattern via Salomon):</strong> My Conversations modify access vs bell fallback is a recurring admin configuration lesson.</li>
</ul>
"""

keys = """91946 91948 91974 91975 91978 91979 91980 91982 91985 91986 91987 91988 91989 91990 91991
91992 91993 91994 91995 91996 91997 91998 91999 92001 92002 92003 92004 92005 92006 92007
92008 92009 92010 92011 92012 92013 92014 92015 92016 92022 92029 92030 92035 92036""".split()

summaries = {
    "91946": "[Initialisation] Recruiter can see Email Task on SSP (XO Only)",
    "91948": "[Initialisation] Enabled SSP Growth/Expansion",
    "91974": "PH: Recruiter sees Empty state of email task if opened",
    "91975": "PH: Recruiter receives a notification",
    "91978": "PH: Admin can enable or disable 2-way email as a comms channel",
    "91979": "PH: Recruiter does not have access to the compose email task",
    "91980": "PH: Recruiter sees the panel expand when clicking Add to compose an email",
    "91982": "PH: Recruiter opens the message to read and reply",
    "91985": "PH: Recruiter can compose an email to non-agency candidate",
    "91986": "PH: Recruiter expands/collapses the panel to check candidate profile (context stays?)",
    "91987": "PH: Recruiter can select To, From & Subject (UI) when composing an email",
    "91988": "PH: Recruiter attaches documents (UI only)",
    "91989": "PH: Recruiter can use the RTE & see the UI of buttons",
    "91990": "PH: Recruiter can select From address from list of valid email addresses",
    "91991": "PH: Recruiter does not see any tabs for non-agency candidate",
    "91992": "PH: Recruiter attaches non-supported files",
    "91993": "PH: Recruiter sees UI error validations on Send",
    "91994": "PH: Send Message (No Attachments)",
    "91995": "PH: Recruiter gets discard popup by changing pages",
    "91996": "PH: Recruiter gets discard popup when they click the Discard button",
    "91997": "PH: Recruiter sees list of messages with unread ones marked in blue",
    "91998": "PH: Recruiter can see message threads when clicking on a message",
    "91999": "PH: Recruiter sees blue unread marker removed after clicking in the view a message in full",
    "92001": "PH: Recruiter sees the panel expand & views full message when clicking the grow button or clicking a single message",
    "92002": "PH: Style only - Recruiter sees messages showing, styled as per figma",
    "92003": "PH: Recruiter sees error messages if their email has bounced",
    "92004": "PH: Recruiter sees error when sending message (REST error)",
    "92005": "PH: Recruiter sees info message and cannot send email if the candidate changes their email",
    "92006": "PH: Candidates opt-out of receiving emails",
    "92007": "PH: Recruiter can switch between tabs for candidate and agency comms",
    "92008": "PH: Agency cannot see recruiter conversation",
    "92009": "PH: Recruiter can see both closed and non-closed conversation in the same panel if one conversation is still active",
    "92010": "PH: Recruiter sees tags on messages showing updating state (sent, not delivered)",
    "92011": "PH: Privacy Admin purges PDTs for 2-way email - Candidate/Job App",
    "92012": "PH: Admin can configure conversation lifecycle tenant setting?",
    "92013": "PH: Existing reporting features are not broken",
    "92014": "PH: Recruiter cannot see reply, or Add button when both conversations are closed & sees info message? that convo is closed",
    "92015": "PH: Candidate has 2 applications to the same JR and gets merged",
    "92016": "PH: Candidate attaches non-supported files",
    "92022": "PH: My Conversations will require an XO (small) refactor",
    "92029": "PH: Recruiter can compose an email to agency user or agency candidate",
    "92030": "PH: Recruiter can select To address from list of valid email addresses",
    "92035": "PH: Email communications are visible in Activity Stream, Timeline and Candidate Communications",
    "92036": "PH: Send Message (With Attachments)",
}

J = "[Jira]"
FK = "[Functional knowledge: CONTEXT.md + linked PRD]"
SAL = "[Salomon]"
DA = "[DA]"
XO = "[XO MCP]"
PJ = "[Peanut]"
SJ = "[Salomon Jira]"


def themed_row(k: str, s: str, key: str) -> tuple[str, str, str, str, str, str, str, str]:
    """Per-key baseline when no high-priority override applies (Jira summary–grounded)."""
    if k == "91974":
        pm = f"Empty state copy still names open questions (agency vs non-agency labels, header wording)—lock before localization spend {FK}."
        qa = f"Buttons that intentionally do nothing in this milestone still need disabled styling expectations so recruiters are not misled {J}."
        dev = f"XO notes call out new labels on Messaging Layout and conversationContextInstance GET—confirm endpoint contract for empty vs populated thread {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Strong first-run story; copy and stubbed actions need crisp acceptance.", "Resolve header/subtitle owner and stub button states in AC."
        bdd = "<p><strong>Scenario:</strong> Agency vs non-agency copy</p><p><strong>Given</strong> agency candidate job application</p><p><strong>When</strong> recruiter opens email task empty state</p><p><strong>Then</strong> copy matches agreed agency variant</p>"
    elif k == "91979":
        pm = f"Read-only vs compose split depends on Conversation Write Access from REST—pair with recruiter messaging if view-only is common in pilots {FK}."
        qa = f"Hide Add entirely vs disabled affordance should match accessibility guidance and screen reader expectations {J}."
        dev = f"Jira points to Conversation Write Access domain updates plus conditional buttons from getConversationContextInstance—confirm field name and caching rules {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Security slice is clear; edge cases on mixed tab states remain.", "Add scenario for agency tab read-only while candidate tab writable."
        bdd = "<p><strong>Scenario:</strong> Mixed write access</p><p><strong>Given</strong> view-only on email domain</p><p><strong>When</strong> agency tab still allows agency thread compose</p><p><strong>Then</strong> buttons follow per-tab write flag</p>"
    elif k == "91980":
        pm = f"Add-to-compose expand must stay aligned with global grow/shrink events from HRREC-91948/92001 so recruiters do not see conflicting widths {FK}."
        qa = f"Modal shadow and focus order on expand should be covered for keyboard-only recruiters {J}."
        dev = f"Confirm which grow/shrink events Message Builder dispatches when opening compose from email vs other tasks {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Single-scenario story; depends on cross-story panel contract.", "Cross-link AC with HRREC-91948 breakpoints and HRREC-92001 overlay rule."
        bdd = "<p><strong>Scenario:</strong> Resize mid-compose</p><p><strong>Given</strong> compose open after Add</p><p><strong>When</strong> recruiter resizes browser</p><p><strong>Then</strong> width clamps per Canvas breakpoints without losing draft</p>"
    elif k == "91982":
        pm = f"Wide read path must stay coherent when conversation is disabled—mirror disabled copy with HRREC-92014 lifecycle messaging {FK}."
        qa = f"Reply hidden states need explicit assertions for screen reader text, not only button removal {J}."
        dev = f"Ask whether reply routing reuses same REST thread fetch as narrow list to avoid duplicate fetches {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Strong happy path; disabled conversation branch needs cross-story alignment.", "Tie disabled copy to HRREC-92014 wording table."
        bdd = "<p><strong>Scenario:</strong> Disabled while expanded</p><p><strong>Given</strong> conversation disabled for opt-out</p><p><strong>When</strong> recruiter opens wide view</p><p><strong>Then</strong> informational text matches lifecycle story</p>"
    elif k == "91985":
        pm = f"Opt-in gating for non-agency candidates should stay consistent with HRREC-92006 opt-out mid-flight states {FK}."
        qa = f"Send-time validation vs upfront hide creates different recruiter mental models—document which surfaces use which rule {J}."
        dev = f"Confirm server-side consent checks align with UI hide rules to avoid last-click surprises {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Compose eligibility is mostly spelled out; agency vs non-agency nuance remains.", "Add matrix row for agency candidate selecting candidate recipient."
        bdd = "<p><strong>Scenario:</strong> Opt-in flips while composing</p><p><strong>Given</strong> candidate opts out while draft open</p><p><strong>When</strong> recruiter attempts send</p><p><strong>Then</strong> blocked path matches HRREC-92006 messaging</p>"
    elif k == "91986":
        pm = f"Local-only drafts mean collapse/expand must never drop RTE content—pair with discard stories HRREC-91995/91996 for navigation edges {FK}."
        qa = f"Cursor preservation claim needs measurable acceptance (selection vs caret) to avoid subjective QA sign-off {J}."
        dev = f"Ask engineering how Message Builder state survives panel animations and task switches {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Draft persistence is entirely client-side per notes—high regression risk.", "Prototype longest realistic draft through collapse/expand on slow hardware."
        bdd = "<p><strong>Scenario:</strong> Collapse during attachment add</p><p><strong>Given</strong> draft text and staged attachment</p><p><strong>When</strong> recruiter collapses panel</p><p><strong>Then</strong> both persist on reopen</p>"
    elif k == "91987":
        pm = f"Custom To/From chrome must stay in sync with HRREC-91990/92030 data sources to avoid mismatched labels vs send payload {FK}."
        qa = f"Keyboard navigation between synthetic dropdowns needs tab order and typeahead behaviour spelled out {J}."
        dev = f"Confirm Message Builder still supplies native fallbacks if custom dropdown fails hydration {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "UI-only milestone; downstream send stories depend on honest data binding notes.", "Document loading and empty-list states for each dropdown."
        bdd = "<p><strong>Scenario:</strong> Empty From list</p><p><strong>Given</strong> OE returns zero valid From configs</p><p><strong>When</strong> recruiter opens compose</p><p><strong>Then</strong> recruiter-visible remediation appears</p>"
    elif k == "91988":
        pm = f"Attachment UI-only slice should align byte limits with HRREC-91992/92036 send paths so pills do not show files that later fail POST {FK}."
        qa = f"Remove control needs undo window policy or explicit none to match recruiter expectations on mistaken deletes {J}."
        dev = f"Ask how Blobatory IDs are surfaced to UI-only stage versus send-time validation {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Solid UI scenarios; integration timing with send is the gap.", "Reference max attachment count from send stories in Notes."
        bdd = "<p><strong>Scenario:</strong> Remove then send</p><p><strong>Given</strong> two attachments staged</p><p><strong>When</strong> recruiter removes one then sends</p><p><strong>Then</strong> payload matches remaining pill</p>"
    elif k == "91989":
        pm = f"GenAI exclusion on RTE must survive Message Builder upgrades—flag in release checklist {FK}."
        qa = f"Visual-only Send/Discard still needs focus order and activation states for accessibility audits {J}."
        dev = f"Confirm toolbar configuration ID used to hide sparkle icon is versioned per tenant {XO}."
        gap, vl, find, nxt = "Low", "🟢 Low", "Well bounded UI story with explicit out-of-scope GenAI.", "Add screenshot diff test for toolbar icon set."
        bdd = "<p><strong>Scenario:</strong> Toolbar upgrade drift</p><p><strong>Given</strong> MB toolbar gains new icon</p><p><strong>When</strong> recruiter opens compose</p><p><strong>Then</strong> sparkle remains absent</p>"
    elif k == "91990":
        pm = f"From list mixes personal vs no-reply—tenant admins need guidance on candidate-reply expectations {DA}."
        qa = f"Selecting no-reply should surface preview text that candidate replies may route to dead inbox {J}."
        dev = f"Validate REST payload field names for configuration list vs UI labels {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Single scenario; depends on OE configuration completeness.", "Pair with HRREC-92030 on recipient alignment when From changes."
        bdd = "<p><strong>Scenario:</strong> From changes after To selected</p><p><strong>Given</strong> recruiter picks candidate To</p><p><strong>When</strong> recruiter switches From to no-reply</p><p><strong>Then</strong> inline helper explains reply routing</p>"
    elif k == "91991":
        pm = f"Hiding tabs for direct applies reduces noise but must stay consistent with HRREC-92007/92009 when agency later appears {FK}."
        qa = f"Regression when agency relationship is added post-hire needs explicit transition behaviour {J}."
        dev = f"Ask whether thread IDs remain stable when tabs appear after agency linkage {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Narrow scenario; lifecycle change risk is the tension.", "Document data correction path when agency added retroactively."
        bdd = "<p><strong>Scenario:</strong> Agency added later</p><p><strong>Given</strong> non-agency profile today</p><p><strong>When</strong> agency association added tomorrow</p><p><strong>Then</strong> tabs appear without orphaned messages</p>"
    elif k == "91992":
        pm = f"Extension, per-file, and cumulative limits intersect with HRREC-91988 UI staging—keep error strings aligned {FK}."
        qa = f"Tenant-configurable block lists need fixture coverage per banned extension family {J}."
        dev = f"Confirm server rejects same files UI blocks to avoid double messaging {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Strong negative scenarios; cumulative limit needs realistic sizes in test data.", "Add boundary test at exactly payload cap minus one byte."
        bdd = "<p><strong>Scenario:</strong> Cumulative limit edge</p><p><strong>Given</strong> attachments near combined cap</p><p><strong>When</strong> recruiter adds final small file</p><p><strong>Then</strong> UI blocks with cumulative message</p>"
    elif k == "91993":
        pm = f"Multi-field validation banner should map to field anchors for recruiter fix speed {FK}."
        qa = f"Screen reader announcement for aggregated error count needs wording review {J}."
        dev = f"Ask whether Message Builder exposes grouped validation hook or custom wrapper owns it {XO}."
        gap, vl, find, nxt = "Low", "🟢 Low", "Scenarios are thorough for send-time validation.", "Add visual snapshot for two-field failure case."
        bdd = "<p><strong>Scenario:</strong> Fix one of two errors</p><p><strong>Given</strong> To and Subject invalid</p><p><strong>When</strong> recruiter fixes Subject only</p><p><strong>Then</strong> banner updates count without clearing To error</p>"
    elif k == "91995":
        pm = f"Navigation discard depends on local-only drafts—align copy with HRREC-92004 refresh guidance {DA}."
        qa = f"Browser back button vs in-app navigation should behave identically for discard prompts {J}."
        dev = f"Ask whether router hooks cover deep links and workspace switches {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Local-only drafts amplify perceived data loss on navigation.", "User-test longest realistic draft with multi-step navigation."
        bdd = "<p><strong>Scenario:</strong> Browser back</p><p><strong>Given</strong> unsaved draft</p><p><strong>When</strong> recruiter uses browser back</p><p><strong>Then</strong> same discard dialog appears</p>"
    elif k == "91996":
        pm = f"Escape-as-discard must not conflict with RTE shortcuts—document precedence {FK}."
        qa = f"Empty-editor fast path should ignore whitespace-only HTML from RTE {J}."
        dev = f"Confirm focus trap between modal and editor when confirmation opens {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Good parity between button and keyboard; whitespace edge remains.", "Add AC for whitespace-only HTML body."
        bdd = "<p><strong>Scenario:</strong> Whitespace-only body</p><p><strong>Given</strong> editor contains blank formatting</p><p><strong>When</strong> recruiter hits Discard</p><p><strong>Then</strong> no confirmation appears</p>"
    elif k == "91997":
        pm = f"Unread blue styling must meet non-colour cue requirement in Scenario 3—coordinate with design tokens {FK}."
        qa = f"Server refresh scenario needs timing SLA so automation stays stable {J}."
        dev = f"Ask which REST field drives unread vs read for list rows {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Accessibility clause is explicit; refresh timing is thin.", "Define max staleness before list auto-refreshes."
        bdd = "<p><strong>Scenario:</strong> High-contrast theme</p><p><strong>Given</strong> tenant enables high-contrast</p><p><strong>When</strong> recruiter views list</p><p><strong>Then</strong> unread cue remains perceivable without colour alone</p>"
    elif k == "91998":
        pm = f"Thread ordering newest-first must match HRREC-92002 styling expectations and recruiter muscle memory from other channels {FK}."
        qa = f"Empty reply thread after outbound-only send should still show sent marker per HRREC-92010 {J}."
        dev = f"Confirm pagination cursor for long threads in narrow view {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Two scenarios; long-thread performance not addressed.", "Add performance note for 200+ message fixture."
        bdd = "<p><strong>Scenario:</strong> Long thread scroll</p><p><strong>Given</strong> thread exceeds viewport</p><p><strong>When</strong> recruiter opens row</p><p><strong>Then</strong> scroll lands on newest message without jank</p>"
    elif k == "91999":
        pm = f"Peek vs full read policy must be explicit for recruiters sharing queues—pair with notification story HRREC-91975 {FK}."
        qa = f"Concurrent recruiter read model needs product decision surfaced to automation owners {J}."
        dev = f"Ask whether read receipts are per user or shared inbox {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Scenario 3 leaves shared read model undecided.", "Lock per-user vs shared model before writing automated tests."
        bdd = "<p><strong>Scenario:</strong> Shared inbox</p><p><strong>Given</strong> two recruiters share queue</p><p><strong>When</strong> one opens full view</p><p><strong>Then</strong> unread clears per agreed model</p>"
    elif k == "92001":
        pm = f"XL overlay rule must not fight HRREC-91948 push behaviour—needs single owner decision {FK}."
        qa = f"Shrink path when switching channels should clear shadows to avoid stuck modal state {J}."
        dev = f"Validate event ordering when grow then immediate shrink from rapid clicks {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Overlaps HRREC-91948; divergence risks double QA.", "Merge AC tables for grow/shrink between both stories."
        bdd = "<p><strong>Scenario:</strong> Rapid grow/shrink</p><p><strong>Given</strong> recruiter double taps grow</p><p><strong>When</strong> second tap toggles shrink</p><p><strong>Then</strong> panel ends in deterministic width</p>"
    elif k == "92002":
        pm = f"Style-only story still needs skeleton/loading states so list does not jump during fetch {FK}."
        qa = f"Visual regression should include RTL and condensed density modes {J}."
        dev = f"Ask which layout handles message bubble max width on small screens {XO}."
        gap, vl, find, nxt = "Low", "🟢 Low", "Narrow scope with clear Figma anchor.", "Add Percy/Chromatic coverage for thread list."
        bdd = "<p><strong>Scenario:</strong> Loading skeleton</p><p><strong>Given</strong> thread data pending</p><p><strong>When</strong> recruiter opens panel</p><p><strong>Then</strong> skeleton matches Figma spacing</p>"
    elif k == "92003":
        pm = f"Bounce taxonomy spans SES events—coordinate copy with TRANMGMT ticket noted in Jira {FK}."
        qa = f"Each variant needs fixture email with provider payload to avoid false greens {J}."
        dev = f"Confirm mapping table from SES event codes to UI variants is single-sourced {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Rich scenario set; operational monitoring of delays missing.", "Add observability note for repeated DeliveryDelay loops."
        bdd = "<p><strong>Scenario:</strong> Delay then success</p><p><strong>Given</strong> temporary delay event</p><p><strong>When</strong> later success arrives</p><p><strong>Then</strong> recruiter sees updated tag per HRREC-92010</p>"
    elif k == "92006":
        pm = f"In-between opt-out state intersects HRREC-92014 closed conversation rules—avoid duplicate banners {FK}."
        qa = f"Re-opt-in path needs consent timestamp assertions for audit {J}."
        dev = f"Ask how conversation status enums differ between opt-out vs closed lifecycle {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "State machine complexity across stories.", "Run joint refinement with HRREC-92014 owners."
        bdd = "<p><strong>Scenario:</strong> Opt-out then inbound mail</p><p><strong>Given</strong> candidate opted out</p><p><strong>When</strong> provider delivers stray reply</p><p><strong>Then</strong> system shows controlled handling per policy</p>"
    elif k == "92007":
        pm = f"Tab isolation must preserve independent unread badges per HRREC-91997/91999 decisions {FK}."
        qa = f"Agency user viewing as recruiter impersonation should be blocked—add security negative {J}."
        dev = f"Confirm separate conversationContextInstance IDs per tab channel {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Happy path clear; impersonation edge missing.", "Add scenario for recruiter proxy access denial."
        bdd = "<p><strong>Scenario:</strong> Tab switch preserves scroll</p><p><strong>Given</strong> recruiter deep in candidate tab</p><p><strong>When</strong> switching to agency tab</p><p><strong>Then</strong> each tab restores its own scroll position</p>"
    elif k == "92009":
        pm = f"Independent closure per tab must align with HRREC-92014 copy and HRREC-92006 opt-out states {FK}."
        qa = f"When both tabs differ, ensure notifications still route to correct thread per HRREC-91975 {J}."
        dev = f"Ask engineering about cross-tab websocket updates when one side closes {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Cross-story lifecycle matrix is large.", "Build tab matrix workshop before QA scripting."
        bdd = "<p><strong>Scenario:</strong> Close candidate first</p><p><strong>Given</strong> agency tab still active</p><p><strong>When</strong> candidate tab hits hard stop</p><p><strong>Then</strong> agency compose still works</p>"
    elif k == "92010":
        pm = f"Sent vs Not Delivered tags bridge to HRREC-92003 diagnostics—keep labels consistent {FK}."
        qa = f"Intermediate states (queued, delayed) may need interim tag; clarify scope {J}."
        dev = f"Confirm whether UI polls thread after send for async bounce updates {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Two-state model may be oversimplified for SES delays.", "Add interim state row if DeliveryDelay supported."
        bdd = "<p><strong>Scenario:</strong> Delayed delivery</p><p><strong>Given</strong> SES delay event</p><p><strong>When</strong> recruiter views thread</p><p><strong>Then</strong> tag shows interim state agreed with copy</p>"
    elif k == "92012":
        pm = f"Admin-configurable windows plus hard one-year cap need plain-language admin docs and audit expectations {DA}."
        qa = f"Scheduler scenarios require clock skew and timezone fixtures {J}."
        dev = f"Ask where job-application conversation records store cap metadata {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Policy story touches compliance; validation rules incomplete in title.", "Produce admin-facing worked example with numbers."
        bdd = "<p><strong>Scenario:</strong> Leap year boundary</p><p><strong>Given</strong> cap crosses leap day</p><p><strong>When</strong> scheduler runs</p><p><strong>Then</strong> closure timestamp matches tenant timezone</p>"
    elif k == "92014":
        pm = f"Closed-is-final rule conflicts with recruiter expectation on accidental closure—document comms fallback {FK}."
        qa = f"Independent tab closure matrix overlaps HRREC-92009—consolidate test data {J}."
        dev = f"Ask if inbound mail after closure is dropped or surfaced as system message {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Lifecycle severity high; cross-channel reopen policy absent.", "Host PM decision on reopen vs new thread."
        bdd = "<p><strong>Scenario:</strong> Inbound after closure</p><p><strong>Given</strong> conversation formally closed</p><p><strong>When</strong> candidate replies anyway</p><p><strong>Then</strong> recruiter sees policy-backed system handling</p>"
    elif k == "92016":
        pm = f"Inbound attachment failures must align outbound limits from HRREC-91992 and UI pills from HRREC-91988 {FK}."
        qa = f"Virus scanner false positive path needs support playbook {J}."
        dev = f"Confirm system message component reused vs bespoke per failure type {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Backend-first failures; UI coverage depends on payloads.", "Create fixture library for each failure scenario."
        bdd = "<p><strong>Scenario:</strong> Partial body with blocked attachment</p><p><strong>Given</strong> malware flagged</p><p><strong>When</strong> recruiter opens message</p><p><strong>Then</strong> body visible with attachment stripped per note</p>"
    elif k == "92029":
        pm = f"Deferred opt-in validation until send benefits agency comms but risks late-stage frustration—surface preview warnings {FK}."
        qa = f"Agency user send should never hit candidate consent checks—explicit negative test {J}."
        dev = f"Ask for single validation endpoint shared with HRREC-91985 {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Four scenarios; late validation still under-explained in UI copy.", "Add inline banner when recipient type toggles."
        bdd = "<p><strong>Scenario:</strong> Switch recipient after draft</p><p><strong>Given</strong> draft body exists</p><p><strong>When</strong> recruiter changes To from agency to candidate</p><p><strong>Then</strong> opt-in warning appears pre-send</p>"
    elif k == "92030":
        pm = f"To dropdown labels must stay aligned with HRREC-92007 tab semantics and HRREC-91990 From routing {FK}."
        qa = f"Pre-populated Home email should still allow change when multiple addresses exist {J}."
        dev = f"Validate search/filter inside long dropdowns for large agency rosters {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Recipient list complexity grows with agency size.", "Add performance acceptance for 200+ recipients."
        bdd = "<p><strong>Scenario:</strong> Duplicate addresses</p><p><strong>Given</strong> two roster rows share email</p><p><strong>When</strong> recruiter opens To list</p><p><strong>Then</strong> disambiguation label renders</p>"
    elif k == "92035":
        pm = f"Triple logging to Activity Stream, Timeline, and report raises duplication risk—define canonical event ID {FK}."
        qa = f"Report row must redact masked JR fields consistently with HRREC-91946 masking {J}."
        dev = f"Ask which integration services fan out email events to each surface {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Broad integration blast radius.", "Sequence diagram review with reporting owners."
        bdd = "<p><strong>Scenario:</strong> Partial failure on one sink</p><p><strong>Given</strong> Activity Stream write fails</p><p><strong>When</strong> email sends</p><p><strong>Then</strong> recruiter sees surfaced error and retry policy</p>"
    elif k == "92036":
        pm = f"Blobatory IDs on send must match HRREC-91988 staging and virus scan path from HRREC-92016 {FK}."
        qa = f"Retry after partial upload failure should not duplicate pills {J}."
        dev = f"Confirm REST payload size telemetry matches 30 MB guardrails {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Attachments + send is highest-risk integration.", "End-to-end test with largest allowed combined payload."
        bdd = "<p><strong>Scenario:</strong> One attachment fails virus scan post-staging</p><p><strong>Given</strong> two attachments staged</p><p><strong>When</strong> send invoked</p><p><strong>Then</strong> whole send aborts with clear remediation</p>"
    else:
        pm = f"The {s.split(':',1)[-1].strip()} slice should spell negative paths and tenant realism so recruiters are not surprised after send {FK}."
        qa = f"Recruiters notice when the UI promises a state the backend cannot honour—add at least one failure journey per milestone for {key} {J}."
        dev = f"SUV metadata shows conversationContextInstance REST and Conversation Write Access labels—confirm this story's REST/UI contract matches secured read/write for email {XO}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Scenarios are directionally strong but leave a few cross-surface assumptions open.", "Tighten one negative path in refinement tied to this summary."
        bdd = "<p>No additional BDD suggested for this pass.</p>"
    return pm, qa, dev, gap, vl, find, nxt, bdd


def lens_for(k: str) -> tuple[str, str, str, str, str, str, str, str]:
    """Return pm, qa, dev, gap, verdict_label, find, next, bdd"""
    s = summaries[k]
    key = f"HRREC-{k}"
    pm, qa, dev, gap, vl, find, nxt, bdd = themed_row(k, s, key)

    if k == "91946":
        pm = f"Masking and combined-channel icon behaviour need recruiter-proof copy beside SMS/WhatsApp {SAL}."
        qa = f"Masked vs unmasked entry paths from My Tasks vs profile should not contradict the combined-icon rule {J}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Entry chrome intersects masking and multi-channel affordances.", "Run paired UX copy review with QE on masked JR scenarios."
    elif k == "91948":
        pm = f"Grow/reopen behaviour is still an open UX choice while drafts stay local-only {FK}."
        qa = f"Task-switch shrink vs close/reopen can feel like data loss even when text persists {J}."
        gap, vl, find, nxt = "High", "🟡 High", "Scenario 4 leaves reopen state undecided under local draft constraints.", "Lock UX default with one paragraph in AC."
        bdd = "<p><strong>Scenario:</strong> Reopen after grow</p><p><strong>Given</strong> a grown panel and draft text</p><p><strong>When</strong> recruiter closes then reopens</p><p><strong>Then</strong> documented grow state matches Figma intent</p>"
    elif k == "91975":
        pm = f"My Conversations vs bell routing mirrors WhatsApp admin guidance—email needs the same admin clarity {SAL}."
        qa = f"If tenant only emails bell alerts, recruiters may miss conversational replies they thought were covered {J} {DA}."
        dev = f"Confirm which notification type instantiates for inbound email replies and how domain loss suppresses both channels {XO}."
        gap, vl, find, nxt = "High", "🟡 High", "Routing depends on security domains easy to misconfigure in pilot tenants.", "Ship a short admin checklist with this epic's release notes."
        bdd = "<p><strong>Scenario:</strong> Missing My Conversations modify</p><p><strong>Given</strong> recruiter lacks modify on My Conversations</p><p><strong>When</strong> inbound reply arrives</p><p><strong>Then</strong> bell fallback still surfaces actionable copy</p>"
    elif k == "91978":
        pm = f"Disable mid-flight must pair with recruiter-visible messaging per tenant toggle guidance {DA}."
        qa = f"Silent failure when toggling off during send confuses recruiters—pair with deterministic banner {J}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Toggle story understates concurrent sessions.", "Add micro-scenario for two recruiters with opposite timing."
    elif k == "91994":
        pm = f"Double-send disable and polling after POST are the right guardrails—still align perceived Sent with async errors [WhatsApp companion: HRREC-90268] {FK}."
        qa = f"Slow thread refresh should never re-enable a second logical send while the first is in flight {J}."
        dev = f"two-way-messaging history shows in-flight send guards; confirm email reuses the same pattern {XO} {PJ}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Send path is mostly solid; async visibility remains the tension.", "Add one latency-oriented scenario with engineering."
        bdd = "<p><strong>Scenario:</strong> POST succeeds, GET lags</p><p><strong>Given</strong> send in flight</p><p><strong>When</strong> thread fetch is slow</p><p><strong>Then</strong> UI polls without duplicate send</p>"
    elif k == "92004":
        pm = f"Refresh to recover from blocked send drops local drafts—pair copy with Deployment Agent guidance on drafts when channels fail {DA}."
        qa = f"Recruiters need upfront copy-to-clipboard guidance before refresh is suggested {J}."
        gap, vl, find, nxt = "High", "🟡 High", "Data-loss anxiety is credible when security state changes mid compose.", "User-test error string with long drafts."
        bdd = "<p><strong>Scenario:</strong> Opt-out mid compose</p><p><strong>Given</strong> draft text exists</p><p><strong>When</strong> send blocked for state change</p><p><strong>Then</strong> recruiter can copy content before refresh</p>"
    elif k == "92005":
        pm = f"Primary home email change parallels WhatsApp merge identity risk—treat as translation question only [WhatsApp companion: HRREC-90306] {FK}."
        qa = f"Read-only history must stay trustworthy when address flips mid thread {J} {SJ}."
        dev = f"Peanut on HRREC-90306 shows merged participant mismatches in WhatsApp—ask if email participant records rebind the same way {XO} {PJ}."
        gap, vl, find, nxt = "High", "🟡 High", "Email change + merge class defects are a known cross-channel signal.", "Engineering review of participant binding for email before merge UAT."
        bdd = "<p><strong>Scenario:</strong> Merge then email</p><p><strong>Given</strong> merged candidates with different primary emails</p><p><strong>When</strong> recruiter opens thread</p><p><strong>Then</strong> actions and copy match survivor addressing</p>"
    elif k == "92015":
        pm = f"Merge with two applications on one JR should preserve coherent threads; WhatsApp merge sender bug is an inspiration-only hint [WhatsApp companion: HRREC-90306] {SAL}."
        qa = f"Wrong sender after merge confuses compliance—QE should script merge matrix with email sends {J} {SJ}."
        dev = f"HRREC-90306 notes MDS method uptake for SMS/WhatsApp—ask engineering whether email needs the same participant fix {XO} {PJ}."
        gap, vl, find, nxt = "High", "🟡 High", "Merge identity is a high-impact cross-cutting risk.", "Spike participant rebinding for email alongside merge stories."
        bdd = "<p><strong>Scenario:</strong> Post-merge send</p><p><strong>Given</strong> merged survivor</p><p><strong>When</strong> recruiter replies</p><p><strong>Then</strong> headers show survivor only</p>"
    elif k == "92022":
        pm = f"Placeholder lacks AC—blocks inbox integration confidence {FK}."
        qa = f"Cannot test notification landing zones until scope with OE exists {J}."
        dev = f"No email-specific My Conversations XO delta located in quick search—timebox discovery {XO}."
        gap, vl, find, nxt = "Very High", "🔴 Very High", "Story is not ready for sizing.", "Split into discovery vs implementation after OE alignment."
        bdd = "<p><strong>Scenario:</strong> Blocked until AC exists</p><p><strong>Given</strong> no acceptance criteria</p><p><strong>When</strong> refinement attempts sizing</p><p><strong>Then</strong> work stops until outcomes are listed</p>"
    elif k == "92013":
        pm = f"Exploratory regression should name three canonical reports to avoid vague sign-off {FK}."
        qa = f"Reporting failures surface late—pick concrete report names in AC {J}."
        gap, vl, find, nxt = "Medium", "🔵 Medium", "Story stays intentionally soft.", "List minimum report inventory in AC."
    elif k == "92011":
        pm = f"Purge scope aligns with internal Recruiting Communications PDT description—good anchor for privacy review {SAL}."
        qa = f"Privacy admins need visible confirmation that attachments and notification artefacts disappear together {J}."
        gap, vl, find, nxt = "Low", "🟢 Low", "Purge slice is unusually concrete.", "Keep parity with tenant purge runbook screenshots."
    elif k == "92008":
        pm = f"Agency isolation is security-critical; scenarios already state 403/404 expectation {FK}."
        qa = f"Direct object reference attempts should never leak candidate text in error payloads {J}."
        gap, vl, find, nxt = "Low", "🟢 Low", "Security story is tight for MVP.", "Add one penetration-test note for QA checklist."
    return pm, qa, dev, gap, vl, find, nxt, bdd


parts = [preamble, '<table><thead><tr><th>Story</th><th>Gap Likelihood</th><th>PM lens</th><th>QA lens</th><th>Dev lens</th><th>Verdict</th><th>Suggested missing BDD (Given/When/Then)</th></tr></thead><tbody>']
for k in keys:
    key = f"HRREC-{k}"
    pm, qa, dev, gap, vl, find, nxt, bdd = lens_for(k)
    parts.append(tr(key, summaries[k], pm, qa, dev, gap, vl, find, nxt, bdd))
parts.append("</tbody></table>")
parts.append(
    '<h2>Possible missing stories (suggestions only)</h2>'
    "<p>Holistic suggestions only (no Jira creation). PRD not auto-loaded—Jira-holistic plus epic narrative.</p>"
    "<table><thead><tr><th>Reason</th><th>PM / QA angle</th><th>Suggested outline (not a Jira)</th></tr></thead><tbody>"
    "<tr><!-- possible-missing-story-row 1 --><td>Cross-candidate search while email thread open</td>"
    "<td>Recruiters jump candidates mid compose today outside email—risk of wrong recipient if global search ignores panel state.</td>"
    "<td>Spike: define whether compose closes or locks when candidate context changes.</td></tr>"
    "<tr><!-- possible-missing-story-row 2 --><td>Delegated recruiting assistant acting for hiring manager</td>"
    "<td>Notifications name primary recruiter; delegates may never see replies.</td>"
    "<td>Decide delegate visibility for conversational email events.</td></tr>"
    "<tr><!-- possible-missing-story-row 3 --><td>Audit export for regulators</td>"
    "<td>Purge + timeline visibility must satisfy legal requests beyond UI screenshots.</td>"
    "<td>Optional story pack for exportable email transcript artefact.</td></tr>"
    "</tbody></table>"
)

out = "".join(parts)
path = "/Users/david.denham/product-manager-agent/docs/initiatives/two-way-email/drafts/gap_review_HRREC82977_2026-05-17_publish.html"
with open(path, "w", encoding="utf-8") as f:
    f.write(out)
print(path, len(out))
