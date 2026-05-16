# HRREC-82977 — Deep dive: summary rewrites and substantial expansion

This document explains **why** human-in-the-loop (HITL) edits clustered around **summary rewrites** and **substantial body expansion** for the bulk-created stories under epic [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977). It complements the quantitative rollup in [HITL_DIFF_REPORT.md](HITL_DIFF_REPORT.md).

---

## 1. Purpose and data sources

| Source | Role |
|--------|------|
| [original_wiki_by_shard.json](original_wiki_by_shard.json) | Bulk automation wiki (`all_invokes` payloads keyed by `story_NNN`) |
| [current_descriptions.json](current_descriptions.json) | Jira `fields.description` + `summary` after HITL (snapshot) |
| [per_story_analysis.json](per_story_analysis.json) | Per-key tags, summary before/after, shard mapping |
| [jira_fetch_2026-05-14.json](jira_fetch_2026-05-14.json) | MCP fetch wrapper (date of snapshot: **2026-05-14**) |

**Limitation:** Rationale is inferred from **text diffs and epic structure**, not from Slack, design files, or PRD workshops.

---

## 2. Executive synthesis

Bulk stories were written for **fast epic coverage**: transcript cues, multi-outcome flows, and capability language (“send”, “format”, “bounce diagnostics”) in few lines. Jira text after HITL reads like **vertical-slice backlog**: each ticket names **one MVP cut** in the summary, and the body spells out **testable UI behaviour**, **security/consent language**, **Message Builder vs Recruiting-owned chrome**, and sometimes **REST/polling** where the client owns the contract.

That shift explains both patterns:

- **Summary rewrites** route readers (PM, QA, policy) to the **correct slice** without opening the BDD.
- **Substantial expansion** supplies the **acceptance contract** that automation had left implicit—especially where Workday’s **Message Builder** defaults (toolbar, fields, persistence) conflict with **Recruiting’s** 2-way email shell.

---

## 3. Pattern 1 — Summary rewrites (seven tickets)

### 3.1 Before / after table

Summaries come from [per_story_analysis.json](per_story_analysis.json) (`summary_at_create` → `summary_current`).

| Key | Bulk-style summary | Current summary |
|-----|-------------------|-----------------|
| [HRREC-91985](https://jira2.workday.com/browse/HRREC-91985) | PH: Recruiter can compose an email if candidate is opted in & has modify access to new domain | PH: Recruiter can compose an email to **non-agency** candidate |
| [HRREC-91987](https://jira2.workday.com/browse/HRREC-91987) | PH: Recruiter can compose an email to agency user or candidate & select the appropriate email (To field selection) | PH: Recruiter can select **To, From & Subject (UI)** when composing an email |
| [HRREC-91988](https://jira2.workday.com/browse/HRREC-91988) | PH: Recruiter attaches documents to send to candidate/agency user | PH: Recruiter attaches documents **(UI only)** |
| [HRREC-91989](https://jira2.workday.com/browse/HRREC-91989) | PH: Recruiter wants to format the message & add subject | PH: Recruiter can use the **RTE & see the UI of buttons** |
| [HRREC-91994](https://jira2.workday.com/browse/HRREC-91994) | PH: Recruiter sends message - recipient receives it and recruiter sees it in the panel | PH: **Send Message (No Attachments)** |
| [HRREC-92010](https://jira2.workday.com/browse/HRREC-92010) | PH: Recruiter sees tags on messages showing updating state (sent, delivered etc.) | PH: Recruiter sees tags … (sent, **not delivered**) |
| [HRREC-92014](https://jira2.workday.com/browse/HRREC-92014) | PH: Recruiter cannot see reply, **forward** or Add button when both conversations are closed … | PH: Recruiter cannot see reply, **or** Add button … (**forward** dropped) |

### 3.2 Why summaries changed (interpretation)

**A. One slice per ticket (routing label for Three Amigos)**  
Bulk summaries often described **end-to-end** or **multi-channel** outcomes. Jira summaries were narrowed so the ticket name answers: *which part of the compose/send pipeline is this?* Examples: **To/From/Subject (UI)** vs **Send (No Attachments)** vs **attachments (UI only)**—each aligns with a different engineering vertical.

**B. Non-agency default and compliance hooks**  
For compose (91985), the title now foregrounds **non-agency** candidates—the dominant MVP path—instead of burying channel under “new domain” and “modify access”. Policy and RBAC readers get the hook in the title; the body carries **Conversational Email security domain** and **Modify/Send** wording (see §4.1).

**C. UI-only vs send path**  
91988’s “**(UI only)**” and 91989’s “**RTE & … buttons**” signal **visual / framework** work, not “message is delivered” or “server persists draft”. That reduces mistaken scope for QA (“why doesn’t Send hit the server on this story?”).

**D. MVP cut in the title**  
91994’s **Send Message (No Attachments)** matches the rewritten user story and scenarios: bulk treated send, thread visibility, and idempotency generically; Jira ties this card to **no-attachment** payload and explicitly names **REST** dispatch and client behaviour (see §4.3).

**E. Title tracks shipped or in-scope UI**  
92010 replaces vague “delivered etc.” with a **concrete state** (“not delivered”) for clearer test matrices. 92014 drops **forward** from the summary when the implemented chrome for closed conversations is **reply / Add** only.

### 3.3 Pull-quote — why 91987’s title matches the new body

Bulk **story_006** framed recipient choice as **routing** (“routing targets candidate channel endpoints”). Current Jira reframes the same shard as **header chrome**:

```text
*I want* the email composition view to visually render custom dropdowns for the "To" and "From" fields, alongside a standard "Subject" field,
*So that* the UI framework for the email header is in place …
*Then* … custom dropdown … for the "To" field instead of the native Message Builder free-text field
```

The summary **To, From & Subject (UI)** is therefore not a random rename: it encodes **Message Builder field replacement** on this card, while **routing to agency vs candidate** likely lives on sibling send/channel stories.

### 3.4 Skill takeaway (summary line)

One summary line should carry **persona + channel + which slice** (UI chrome vs REST send vs policy-only), and should **not** repeat the first scenario’s full Given. Let the body own Gherkin detail.

---

## 4. Pattern 2 — Substantial expansion (five drivers)

The automation run tagged **16** stories with substantial length increase ([HITL_DIFF_REPORT.md](HITL_DIFF_REPORT.md)). The expansions are not one uniform edit; they group as follows.

### 4.1 Driver: Compliance and consent explicitness

**Example:** [HRREC-91985](https://jira2.workday.com/browse/HRREC-91985) (`story_004`)

Bulk user story (abbreviated):

```text
*As a* recruiter
*I want* to compose when the candidate is opted in and I have modify access to the new domain
*So that* I only send compliant mail to candidates who can receive it
```

Current Jira (excerpt):

```text
*As a* Recruiter communicating with a non-agency candidate
*I want to* compose 2-way emails only when the candidate is opted in and I have "Modify/Send" access to the Conversational Email security domain,
*So that* I maintain data compliance and am not shown compose controls I cannot use.
```

**Why:** Readers beyond engineering (policy, audit) can scan **who** (non-agency), **which permission** (Modify/Send, domain name), and **risk outcome** (controls hidden vs shown). Bulk assumed “new domain” was enough.

---

### 4.2 Driver: UI-framework vs “user can complete the job”

**Examples:** [HRREC-91987](https://jira2.workday.com/browse/HRREC-91987), [HRREC-91988](https://jira2.workday.com/browse/HRREC-91988), [HRREC-91989](https://jira2.workday.com/browse/HRREC-91989)

Repeated patterns in current text:

- “**visually render**”, “**UI framework** is in place”
- “**sliding side panel**”
- “**instead of the native Message Builder free-text field**”

**91989** additionally locks **Send/Discard** as “**rendered for visual layout purposes only**” in a scenario—explicitly decoupling this story from dispatch persistence.

**Why:** Vertical-slice spikes need acceptance that is **observable on screen**, not “user achieves business outcome” alone. That avoids false failures when MB still handles persistence or server send on another ticket.

---

### 4.3 Driver: Integration contract (REST, polling, double-send)

**Example:** [HRREC-91994](https://jira2.workday.com/browse/HRREC-91994) (`story_013`)

Bulk focused on outcomes: thread state, idempotency in the abstract. Current scenarios (excerpts):

```text
*Then* the message text payload is successfully dispatched to the backend via REST API
*And* the message immediately appears in the sliding side panel conversation thread with a "Sent" status tag.
…
*Then* the client UI handles this by polling/retrying the GET methods … without requiring a manual page refresh.
…
*Then* the client automatically disables the "Send" button … when the REST API call is in flight
```

**Why:** Recruiting UI + Message Builder + thread APIs need **client-owned** acceptance: when the REST call returns, when polling applies, how double-tap is prevented. That is test automation fuel bulk did not supply.

---

### 4.4 Driver: Exact customer-visible strings and error taxonomy

**Examples:** [HRREC-92003](https://jira2.workday.com/browse/HRREC-92003), [HRREC-91993](https://jira2.workday.com/browse/HRREC-91993)

Bulk **92003** promised “bounce-specific messaging and next steps” in one line per scenario. Current Jira expands into **multiple failure classes** (hard bounce, complaint, unsubscribe, …) with **literal headline + body** pairs, e.g.:

```text
*Then* I see the headline: "We couldn't deliver this email."
*And* I see the body: "Try sending it again or contact the recipient using another method."
```

**91993** adds literal validation copy:

```text
*Then* I see inline/field-level validation "Error: Required field." …
```

**Why:** UX, localization, and QA need **string-stable** criteria; generic “I see validation” invites debate in sprint review.

---

### 4.5 Driver: Negative scope and edge cases (platform defaults)

**Example A — GenAI:** [HRREC-91989](https://jira2.workday.com/browse/HRREC-91989)

New scenario title and Then:

```text
h3. Scenario 2: Excluding the GenAI (AI Assistant) button from the toolbar
…
*Then* the GenAI (AI Assistant / purple sparkle) button is explicitly excluded/hidden from the toolbar configuration
```

**Why:** Message Builder may ship AI affordances elsewhere; this epic’s MVP explicitly **opts out** so scope is not inherited by default.

**Example B — Discard / navigation:** [HRREC-91995](https://jira2.workday.com/browse/HRREC-91995) (and sibling 91996)

Bulk discard stories were thin; current text spells **navigation away vs panel close**, **cancel preserves local UI state**, **confirm clears and proceeds**. (91996 covers **Discard button** vs 91995’s **navigation** split.)

**Why:** Ambiguity between **local editor state**, **Message Builder draft persistence**, and **SSP navigation** is a common defect cluster; HITL front-loads the distinctions scenarios must make.

### 4.6 Notes on “no draft persistence” / “copy before refresh” (430)

Those default **Notes** bullets are not generic boilerplate for this epic. Expansions repeatedly clarify:

- **UI-only** rendering vs backend dispatch  
- **Local unsent text** vs persisted drafts  
- **Polling / refresh** vs “message appears immediately”

If automation emits only happy-path BDD, reviewers add Notes to stop **wrong-owner** bugs (Recruiting chrome vs MB vs REST).

---

## 5. Where both patterns reinforce each other

| Key | Summary role | Body role |
|-----|--------------|-----------|
| 91985 | “**Non-agency**” in title | Security domain, Modify vs View, sliding panel entry |
| 91987 | “**To, From & Subject (UI)**” | MB native field replacement, three parallel scenarios |
| 91989 | “**RTE & buttons**” | GenAI exclusion + Send/Discard visual-only |
| 91994 | “**No Attachments**” | REST send, polling, disable Send while in flight |

**Pattern:** Title states the **slice**; body supplies the **test contract** (including negative and integration edges).

---

## 6. Actionable guidance (430 / jira-recruiting story skill)

Use these as **generation defaults** before bulk push, to reduce HITL:

1. **Summary template:** `[Persona] [verb] [object] [(UI only) | (No Attachments) | (non-agency default)]` when the epic splits compose/send/chrome.
2. **First Given line:** Name **surface** (sliding side panel) and **permission** (domain + Modify/Send vs View) when email touches consent or RBAC.
3. **MB boundary:** If the story replaces or wraps Message Builder controls, include one scenario that states **native MB control vs custom control** (dropdown vs free-text, toolbar buttons present vs functional).
4. **Negative scope:** If platform ships GenAI or other global toolbar actions, add an explicit **excluded/hidden** scenario when this MVP opts out.
5. **Send stories:** If attachments are out of scope, say **no attachments** in summary **and** first scenario Given; add **REST / client** behaviour only on the ticket that owns dispatch.
6. **Error / bounce stories:** Prefer **headline + body** literals (or “see copy key X”) plus **expanded wide view** context so UX and L10N can trace requirements.
7. **Discard / navigation:** Split **button discard** vs **route/panel away** if both exist in the design; mirror **Escape** and **empty editor** behaviour if spec requires.
8. **Notes (Definition of Ready or h2. Notes):** One bullet on **draft persistence ownership** and one on **refresh/polling** whenever thread visibility depends on async APIs.

---

## 7. Related artefacts

- [HITL_DIFF_REPORT.md](HITL_DIFF_REPORT.md) — counts, per-story tags, validator strategy  
- [build_analysis.py](build_analysis.py) — regenerates rollups from `current_descriptions.json`
