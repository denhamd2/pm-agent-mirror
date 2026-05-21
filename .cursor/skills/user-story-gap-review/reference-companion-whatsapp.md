# WhatsApp companion (013 / 2WE) — reference annex

This file holds the **full** contract for the **Companion channel cross-scan** (see **When to run** — **mandatory** for **HRREC-82977** / 013 two-way email gap reviews unless the user explicitly opts out) and the **Companion Peanut anchor pass** (still **opt-in** only). Main checklist: [`SKILL.md`](SKILL.md). Shared gap-review rules (run tiers, page structure, **Gap Likelihood** column, publish pipeline, evidence grounding): [`reference.md`](reference.md).

## Contents

- [Routing quick reference](#routing-quick-reference)
- [Companion channel cross-scan (013 / 2WE)](#companion-channel-cross-scan-013-2we)
- [Optional Peanut (code anchors) for WhatsApp companion](#optional-peanut-code-anchors-for-whatsapp-companion)

## Routing quick reference

| User intent / prompt signal | Companion corpus path | Peanut MCP on WhatsApp keys? |
|------------------------------|------------------------|------------------------------|
| Default 013 / HRREC-82977; snapshot **eligible**; no `WhatsApp live delta` / `WhatsApp refresh corpus` / `WhatsApp live-only` / `ignore WhatsApp snapshot` | **Manifest-only** | **No** (Companion code default) |
| **`WhatsApp live delta`** or **`WhatsApp refresh corpus`**; snapshot **eligible** | **Live delta with snapshot** | **No** unless anchor phrase or 3–8 key list also appears |
| **`WhatsApp live-only`** / **`ignore WhatsApp snapshot`**, or snapshot **ineligible** | **Full live corpus** | **No** unless anchor pass invoked |
| **`WhatsApp Peanut anchors`** / **`companion code anchors`** / **`Peanut anchors for WhatsApp comparison`**, or explicit **3–8** `HRREC-…` WhatsApp anchor keys | **Same corpus path as the matching row above** **plus** anchor pass | **Yes** (read-only; caps in **Optional Peanut** below) |

**Not the same labels:** Gap-review **Tier A** / **Tier B** ([Run tiers in reference.md](reference.md#run-tiers-tier-a-full-contract-vs-tier-b-timeboxed)) govern **2WE** seven-column depth only. **Companion code default** vs **Companion Peanut anchor pass** govern **WhatsApp** evidence only.

---

## Companion channel cross-scan (013 / 2WE)

**Purpose:** When the primary gap-review scope is **two-way recruiting email** (Jira epic **HRREC-82977** and initiative docs), mine **partner WhatsApp** epics for **pattern themes** and bug-led **failure-mode hints** that might inspire **missing scenarios** for email—without treating WhatsApp as a spec or implying channel/backend parity. For **HRREC-82977** runs this pass is **required** by default (see **When to run**); unrelated epics still treat it as optional unless the PM asks for cross-initiative patterns.

**Canonical epic keys, URLs, disclaimers, and theme buckets:** [`docs/initiatives/two-way-email/COMPANION_WHATSAPP_EPICS.md`](../../../docs/initiatives/two-way-email/COMPANION_WHATSAPP_EPICS.md). **013** glob: [`.cursor/rules/013-two-way-email-initiative-context.mdc`](../../rules/013-two-way-email-initiative-context.mdc).

**Epic keys (URLs in companion doc):** HRREC-89236, HRREC-84384, HRREC-89812, HRREC-82870, HRREC-91933.

### When to run (mandatory for 82977; opt-out explicit)

**Mandatory — run step 2b** (build companion corpus per **Manifest-only** / **Live delta with snapshot** / **Full live corpus** below) when **any** of the following is true, **unless** the user **explicitly opts out** (next bullet):

- Primary gap-review scope is epic **HRREC-82977** (e.g. JQL includes `"Epic Link" = HRREC-82977`, user says “first N stories of **our** epic” in **013** / two-way email context, keys are children of **HRREC-82977**, or the prompt references **INDIA-E2E-006** / two-way email gap review with that epic); **or**
- User runs `/user-story-gap-review` (or equivalent) and the **normalized in-scope keys** are **all** under **HRREC-82977** (subset/smoke included); **or**
- User asks for WhatsApp / companion / cross-initiative patterns on a **non-82977** scope (then 2b runs for that request even if epic differs).

**Explicit opt-out** (honor in executive-summary **preface** and **do not** emit the companion `h2` / corpus line / **`Cross-channel (WhatsApp backlog) —`**): user states one of **`no WhatsApp companion`**, **`skip companion cross-scan`**, **`omit WhatsApp companion`**, or **`2WE email only`** (case-insensitive). Use opt-out sparingly—default remains **companion on** for **82977**.

**Skip step 2b** when:

- **None** of the mandatory bullets apply **and** the user did not ask for companion/WhatsApp patterns; **or**
- User used an **explicit opt-out** phrase above (82977 runs without companion—state in preface).

Do **not** pull WhatsApp Jira for the companion pass on **unrelated** HRREC epics **unless** the user asks for companion/cross-initiative patterns or names **HRREC-82977** / 013 scope.

### AG: / RN: (doc-writer) keys in companion corpus vs 2WE table

**Scope exclusions** ([reference.md — Scope exclusions](reference.md#scope-exclusions-documentation-writer-tickets)) still **drop** **AG:** / **RN:** issues from the **seven-column gap table** and from **per-row** Salomon / XO / Peanut / DA for **2WE** keys.

For the **WhatsApp companion** only:

- **Manifest / inventory:** Story-typed **AG:** / **RN:** tickets may appear in the **frozen manifest** (and in **live delta** inventories when the user opts into **`WhatsApp live delta`** / **`WhatsApp refresh corpus`**). Keep them in the manifest for **inventory completeness** and honest tracking; on **live delta** runs, use them for **staleness / new-key** reconciliation as today.
- **Theme synthesis:** Do **not** use **AG:** / **RN:** keys as the **primary anchor** for companion **`h2`** theme bullets or for **`Cross-channel (WhatsApp backlog) —`** bullets on **2WE** rows **unless** the user explicitly widens companion scope—those tickets are **doc / release-note** workstreams, not product backlog pattern sources. If the manifest includes them, you may note once in the **corpus line** (e.g. “Doc-writer Story keys in manifest: …”) without implying they are 2WE delivery scope.

### Snapshot file (shared)

**Snapshot file:** [`docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](../../../docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) — see also [`reference/README.md`](../../../docs/initiatives/two-way-email/reference/README.md).

**Snapshot eligibility (for manifest-only or live-delta-with-snapshot):** the file exists; frontmatter **`manifest_complete: true`**; **`## Manifest`** lists at least one **`HRREC-…`** key. If **any** of these fail, use **Full live corpus** below—**do not** claim manifest-only or live-delta-with-snapshot in Confluence.

### Manifest-only (default when snapshot is eligible)

**When to use (all must be true):**

- Snapshot **eligibility** (above) is satisfied **and**
- The user did **not** ask for **`WhatsApp live delta`**, **`WhatsApp refresh corpus`**, **`WhatsApp live-only`**, or **`ignore WhatsApp snapshot`**.

**Steps:**

1. **Read** the snapshot only: frontmatter (`snapshot_as_of`, etc.), **`## Manifest`**, and optional per-key **`## Captured excerpts`** (or `### HRREC-…` excerpt sections—follow the file’s structure).
2. **No WhatsApp Jira MCP** for the companion pass: do **not** call `summarizeJiraEpic`, `searchJiraTickets`, or `getTicketDetails` **for companion epics / manifest keys** on this path. (The **2WE** table still uses fresh Jira for **in-scope 2WE** keys per **From-scratch execution**.)
3. **Synthesis:** Build the companion **`h2`** themes and any **`Cross-channel (WhatsApp backlog) —`** bullets from **Captured excerpts** and the **frozen manifest** scope statement only.
4. **Corpus line (manifest-only):** Must state: (a) **Frozen pattern corpus** — `snapshot_as_of` + short filename reference; (b) **No live Jira pull for WhatsApp companion this run (manifest-only).** Do **not** imply **current Jira** or **live backlog** for WhatsApp.

**Theme bullet anchors (manifest-only):** Each companion theme `<li>` still needs a **concrete anchor** (see **Confluence output**). **Prefer** a **Jira key + short paraphrase** drawn from **`Captured excerpts`** in the snapshot. For manifest keys **without** an excerpt: do **not** invent issue text—either **omit** that key as a primary anchor or extend the snapshot offline (optional **`## Manifest titles`** one-line-per-key export, or add an excerpt heading) on the next snapshot refresh—see **Manifest maintenance** in [`reference/README.md`](../../../docs/initiatives/two-way-email/reference/README.md).

### Live delta with snapshot (opt-in)

**When to use:** the user explicitly asks for **`WhatsApp live delta`** or **`WhatsApp refresh corpus`**, **and** snapshot **eligibility** (above) is satisfied. (If they ask for live delta but the snapshot is ineligible, use **Full live corpus** and say so in the corpus line.)

**Steps (same mechanics as the former “hybrid + live delta” path):**

1. **Read** the snapshot (manifest + **Captured excerpts**).
2. **Live delta (cheap):** For **each** companion epic, call `summarizeJiraEpic` (`user-jira-ghe`). Build the **live Story+Bug key set** from the tool output (filter by issue type; follow **`displayGuide`**). If child types are ambiguous, add **one** paginated `searchJiraTickets` pass per epic with `issuetype in (Story, Bug)` and merge keys.
3. **Compare** live keys to the **Manifest** (trim, dedupe, case-normalize project prefix):
   - **New keys** (in live, not in manifest): run **`getTicketDetails`** for **each** new key this run; merge into the working corpus.
   - **Removed keys** (in manifest, not in live): record **staleness** in the corpus line (list keys)—**do not** anchor theme bullets **only** to removed keys as if still current.
   - **Stable keys:** use **Captured excerpts** from the snapshot when present; if a stable key has **no excerpt**, you may use **one** `getTicketDetails` for that key **or** a **one-line** paraphrase from the epic summary child list—state which in the corpus line if material.
4. **Synthesis:** Theme `h2` and **`Cross-channel (WhatsApp backlog) —`** bullets may cite **snapshot `snapshot_as_of`** for excerpt-backed patterns **and** live **`getTicketDetails`** for delta keys—never imply **“current Jira”** for the whole corpus without stating the **live delta outcome** (including `no new keys` when true).
5. **Corpus line (live delta with snapshot):** **Frozen pattern corpus** — `snapshot_as_of` + filename; **Live delta** — `no new keys` / `N new keys merged (getTicketDetails this run)` / **staleness** if manifest keys disappeared from epics.

**User override — full live, ignore snapshot:** **`WhatsApp live-only`** or **`ignore WhatsApp snapshot`** in the prompt → **skip** reading the snapshot for the companion pass; run **Full live corpus** only (inventory + `getTicketDetails` per key).

### Full live corpus (Stories + Bugs + ticket bodies)

**Inventory of record:** For **each** companion epic in **COMPANION_WHATSAPP_EPICS.md**, run `user-jira-ghe` / `searchJiraTickets` with JQL:

`project = HRREC AND issuetype in (Story, Bug) AND "Epic Link" = <EPIC-KEY> ORDER BY key ASC`

- **Paginate:** advance `startAt` until the API indicates no further issues (typically **50** per page—follow **`displayGuide`** in the response). **Adjust** the epic field (`"Epic Link"`, `parent`, team-managed epic, etc.) when empty—same as **Expand epic** in `SKILL.md`.
- **Dedupe** keys across epics if any issue could match twice.

**Full bodies:** For **each** unique key from the inventory, run `getTicketDetails` with `{ "jiraTicket": "KEY" }` in **this** session. Synthesis for the companion `h2` and for **`Cross-channel (WhatsApp backlog) —`** bullets must be grounded in this corpus (paraphrase; do not paste entire descriptions into the main 2WE table).

**Optional reconciliation:** Call `summarizeJiraEpic` per epic and compare counts/types to the paginated Story+Bug set. If they diverge, **prefer the paginated Story+Bug list** for completeness claims and **note the delta** in the companion section (field quirks, sub-tasks excluded by JQL, etc.).

**Parallelism:** When the union of WhatsApp keys is **≈18+**, use **`Task` / `generalPurpose`** subagents on **disjoint key slices** (inventory + `getTicketDetails` JSON back to parent)—same MCP discipline as `SKILL.md` **Sub-agents**; **never** parallel Confluence writes.

**Still out of scope for WhatsApp keys:** Salomon, XO MCP, Peanut, DA **across the full companion manifest** unless the user **widens scope** or runs an explicit **Companion Peanut anchor pass** (see **Optional Peanut (code anchors) for WhatsApp companion** below)—then **only** for **3–8** named WhatsApp **Story/Bug** keys for read-only code evidence; **never** default Peanut on every manifest key. **Exception:** **Cross-channel referenced-key Peanut** in [`reference.md`](reference.md) **When to invoke Peanut (2WE per-row)**—narrow **`collectBugData`** on **`HRREC-…` keys cited inside** a **`Cross-channel (WhatsApp backlog) —`** bullet on a **2WE** row (**Tier A**; dedupe/caps in `reference.md`)—is **not** a manifest-wide sweep. **Do not** add WhatsApp issues as **rows** in the seven-column gap table unless the user scopes them there.

### Companion partial corpus / resume (mandatory honesty)

Applies to **Manifest-only**, **Live delta with snapshot**, and **Full live corpus** (track separately when mixing modes).

**Manifest-only:** If the snapshot file was read successfully, the companion pass is **complete** for publishing (there is no Jira pull to fail). If the file is **missing/unreadable**, do **not** run step **2b** as manifest-only—fall back to **Full live corpus** or **omit** the companion block and say why in chat.

**Full live:** Maintain a **checklist during step 2b**: (A) keys from paginated **inventory** per epic; (B) keys for which **`getTicketDetails` succeeded in this run**.

**Live delta with snapshot:** Track (A) manifest keys + snapshot excerpts present; (B) **live** Story+Bug key set after `summarizeJiraEpic` / search; (C) **new** keys that still need **`getTicketDetails`** this run; (D) **stable** keys you are relying on **only** from snapshot excerpt vs those you refreshed with **`getTicketDetails`**. If **`getTicketDetails` fails** for any **required** new key, or you cannot reconcile live vs manifest, treat the companion pass as **partial**.

- **Full live — complete:** If **every** inventory key has a successful **`getTicketDetails`** pull, the **corpus line** may state that **full** Story+Bug bodies were ingested this run (subject to user narrowing scope).
- **Live delta with snapshot — “complete” for publishing:** Every **new** live key has **`getTicketDetails`** this run **and** every **stable** key you cite in theme bullets has either a **snapshot excerpt** or a successful **`getTicketDetails`** / honest one-line epic-summary paraphrase (as allowed under **Live delta with snapshot**). The corpus line names **frozen `snapshot_as_of` + live delta outcome**—that is **not** the same wording as “full live corpus.”
- **Partial (live delta or full live):** If **any** required pull is missing (timeout, MCP error, session limit, deliberate stop, or live-delta reconciliation incomplete): you **must not** claim a **full** live corpus, **must not** claim a **complete live-delta** ingest, or imply every live/manifest key was read.
  - **Corpus line:** prefix clearly, e.g. **`PARTIAL companion corpus`** (or equivalent plain English), then list **which companion epic(s)** / **delta keys** are incomplete and **either** approximate **key ranges / counts missing** **or** the explicit key list still pending—whatever is accurate from your tracker. For **live delta with snapshot**, still state **snapshot date** and **how much of the live delta** was applied.
  - **Chat:** mirror the same partial status and pending epics/keys in the session summary so the PM can **resume** in a follow-up run.
  - **Theme bullets:** only cite anchors (**keys** / paraphrased titles) from **evidence you hold**: **`getTicketDetails` text this run** (live delta / full live) and/or **snapshot Captured excerpts** (manifest-only or stable keys)—do not fabricate anchors for missing pulls.

### Companion vs 2WE table tiering

- The **2WE** gap table remains Tier **A** or **B** per **Run tiers** independently of WhatsApp depth.
- When the **2WE** table is Tier **B** but the companion pass used **full** Story+Bug + `getTicketDetails`, **combine** into **one** executive-summary **preface** line if needed to stay within **≤2** preface items, e.g. *“Run tier: B (timeboxed) on 2WE rows; WhatsApp companion used full Story+Bug corpus (N keys, `getTicketDetails` this run)—see Cross-initiative h2 for per-epic counts.”* If the companion used **manifest-only**, say so in one short clause (**frozen `snapshot_as_of`, no live Jira for WhatsApp**). If the companion used **live delta with snapshot**, say so (**frozen snapshot date + live delta outcome**). If the companion corpus was **partial**, that same line must say **partial** and point to the corpus line for **which epics/keys** were not ingested—**never** imply a full WhatsApp read.

### Optional Peanut (code anchors) for WhatsApp companion

**Naming (avoid confusion):** **Companion code default** = no **bulk** Peanut across the whole WhatsApp manifest for the **`h2`** / corpus. **Companion Peanut anchor pass** = user-opt-in **3–8** anchors, output in **`h3` Code evidence**. **Cross-channel referenced-key Peanut** = **Tier A** row-scoped reads on **`HRREC-…` keys cited inside** a **`Cross-channel (WhatsApp backlog) —`** bullet—contract in [`reference.md`](reference.md) **When to invoke Peanut (2WE per-row)**. These are **not** the same labels as gap-review **Run tiers** (**Tier A** / **Tier B** for the **2WE** table)—see [Run tiers (Tier A / Tier B)](reference.md#run-tiers-tier-a-full-contract-vs-tier-b-timeboxed) in `reference.md`.

**Companion code default (no change to step 2b):** For the WhatsApp **`h2`** / corpus / theme synthesis, stay on **manifest-only**, **live delta with snapshot**, or **full live corpus** as already defined—**do not** run **bulk** `user-peanut-mcp` across the **entire** WhatsApp manifest on this path. **Exception (Tier A / 2WE table):** when a **2WE** row carries **`Cross-channel (WhatsApp backlog) —`** with cited **`HRREC-…`** keys, agents **must** follow [`reference.md`](reference.md) **When to invoke Peanut (2WE per-row)** **Cross-channel cited keys**—narrow read-only Peanut on those **referenced** keys (row **Dev lens**), with run-level dedupe and per-row caps documented there. That is **not** the same as the opt-in **Companion Peanut anchor pass** (user-anchored **3–8** keys, **`h3` Code evidence** block)—both may run in one session if the PM opted into anchors too.

**Companion Peanut anchor pass (opt-in only):** Run when the PM asks with explicit intent, e.g. **`WhatsApp Peanut anchors`**, **`companion code anchors`**, **`Peanut anchors for WhatsApp comparison`**, or a **numbered list of 3–8 `HRREC-…` keys** that are **WhatsApp companion** issues (from the manifest, live inventory, or user-narrowed subset)—**after** the companion corpus is built (or in parallel only if the user lists anchors up front), typically when **parity, consent, delivery channel, task derivation, or SSP / Message Builder** claims need **git-level** confirmation. **Do not** expand into a “Peanut column” on every manifest row; cap **3–8** anchor keys per run unless the user explicitly raises the cap.

**Preconditions (mandatory before relying on commit archaeology):**

1. **`~/.peanut/config.json`** — `git.repos` must list **absolute paths** to local clones of the megaleo repos the team uses for companion work (commonly **`UIC/sliding-side-panel`**, **`recruiting/two-way-messaging`**, **`xo-code-reviews/hrrec`**—adjust to your machine).  
2. **Full git history on disk** — Each listed repo must **not** be a shallow-only clone (`git rev-parse --is-shallow-repository` → `false`). If you previously cloned with `--depth 1`, run **`git fetch --unshallow`** in each repo root (or re-clone without `--depth`) **before** anchor passes; otherwise Peanut’s `git log` window will miss older WhatsApp-side commits.  
3. **`JIRA_TOKEN`** — Peanut MCP must receive **`JIRA_TOKEN`** in its server environment so **`collectBugData`** can fetch each anchor ticket from Jira2; without it, runs return **`needsConfig`** / fetch errors—record honestly in the output block, do not invent tickets or SHAs.  
4. **`git.searchWindow`** — For anchors tied to older epics, widen **`startDate` / `endDate`** in config (or the tool’s config override) to cover the **active coding period** for those stories—not only the default “bug created date ± 30 days” behaviour inside Peanut’s commit fetcher when unconfigured.

#### Operator preflight (before first `collectBugData`)

Run this **once per machine** before relying on Peanut output for anchor keys:

1. In **each** repo path under `git.repos` in `~/.peanut/config.json`, run `git rev-parse --is-shallow-repository` — output must be `false`. If `true`, run `git fetch --unshallow` (or re-clone without `--depth 1`).
2. Confirm the **Peanut MCP** server has **`JIRA_TOKEN`** in its environment ([INSTALLATION_NOTES.md — Peanut](../../../docs/onboarding/INSTALLATION_NOTES.md)). If missing, write **Peanut anchor pass skipped: Jira token not available** in **`h3` Code evidence**; do not invent SHAs.
3. Confirm `git.searchWindow` spans the anchors’ likely merge activity (not only Peanut’s default window inferred from ticket dates).
4. If any step fails: one honest line (**Peanut anchor pass skipped: …** with reason) and omit fabricated commit evidence.

**Execution:** For **each** anchor key, **≤2** read-only Peanut calls (`collectBugData` with that `jiraTicket`; optional **`searchCode`** with a **small** `searchPlanJson` derived from the anchor summary). Merge implications into **Epic-level notes** companion subsection below—not as extra **rows** in the seven-column table unless the user scoped WhatsApp there.

**Output contract — `h3` Code evidence (WhatsApp anchors—Peanut):** When this pass runs, add **`h3` Code evidence (WhatsApp anchors—Peanut)** under **`h2` Epic-level notes** *or* immediately **after** the companion **`h2` Cross-initiative pattern hints (WhatsApp — inspiration only)** (PM choice if unstated—default **under Epic-level notes** so the pattern `h2` stays Jira/snapshot grounded). For **each** anchor key, **exactly one** narrative unit (`<p>` or one `<li>` under a short `<ul>`) that **uniquely** includes:

- The **`HRREC-…`** key and a **one- or two-sentence** plain-English takeaway for **2WE translation** (what engineering proved in code vs what Jira implied).  
- **At most one** corroborating **commit SHA** (short form) **or** repo/file hint **when** Peanut returned a ranked signal—**or** an honest line that **no commits fell in the configured window** (then suggest widening the window or verifying clone paths / depth—no fabricated SHAs).

**Forbidden (090 row-wise hygiene):** Pasting the **same** multi-sentence commit narrative on **multiple** anchor keys; a **default** “Scenario (repo)” / identical **Verdict-style** block reused per key; treating Peanut output as **proof** of email defects (companion rules still apply—**pattern hints only**).

### Confluence output (not table rows)

Emit **after** **`h2` Epic-level notes** and **before** the seven-column **Gap review table** (omit entirely if step **2b** did not run):

- **`h2`:** `Cross-initiative pattern hints (WhatsApp — inspiration only)`
- **Corpus line (required when step 2b ran):** Immediately under the `h2`, one `<p>`:
  - **Manifest-only:** **Frozen pattern corpus** — `snapshot_as_of` from [`WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](../../../docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) + short filename; **No live Jira pull for WhatsApp companion this run (manifest-only).** Optional: note manifest key count or that theme anchors come from **Captured excerpts** only.
  - **Full live — complete:** total **Story** / **Bug** counts **per companion epic** (and grand total keys) and explicit confirmation that **`getTicketDetails` completed this run for every enumerated key** (unless the user narrowed scope—then describe the narrowing).
  - **Full live — partial:** start with an explicit **partial / incomplete** label; state per-epic **expected vs fetched** counts or **pending key list / ranges**; **do not** use wording like “full corpus” or “all keys ingested.”
  - **Live delta with snapshot — complete (per Companion partial corpus):** **Frozen pattern corpus** — `snapshot_as_of` + short filename; **Live delta** — `no new keys` or **`N` new keys** merged via **`getTicketDetails` this run**; note **staleness** (manifest keys no longer under epics) if any; per-epic **live** Story/Bug counts optional but helpful.
  - **Live delta with snapshot — partial:** same **frozen + delta** structure, but label **PARTIAL** and list **which delta pulls or stable-key refreshes** are missing—**never** imply “current Jira” for the whole backlog from the snapshot alone.
  - **Containment rule:** Corpus line language ('snapshot_as_of', 'manifest_complete', 'WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md', 'No live Jira pull for WhatsApp companion this run', 'PARTIAL companion corpus') is confined to the companion h2 section and the executive summary preface only. These strings must NOT appear inside individual story row cells (PM, QA, Dev, Verdict, or GWT columns).
- **Lead `<p>`:** Same **job application flow / candidate profile sliding side panel** UX shell as WhatsApp work; **not** a requirements import; **channel differs** (WhatsApp vs email); **backend / OE differs** (e.g. Twilio-oriented WhatsApp delivery vs email integration—**do not** equate defects).
- **Body (theme-grouped `<ul>`):** Group bullets under themes such as consent/opt-in, thread lifecycle, delivery/read semantics, attachments/media, notifications vs inbox, admin toggles, agency, locale, error/empty states. **Each** `<li>` must meet the **theme bullet quality bar:** include **at least one concrete anchor** from **evidence you hold**—**snapshot Captured excerpts** (manifest-only), and/or **`getTicketDetails` text this run** when the user ran **live delta with snapshot** or **full live**—as a **Jira key** (e.g. `HRREC-nnnnn`) **and/or** a **short paraphrase** of that issue’s summary/title. **Theme-only** lines with no key or paraphrase **fail** the companion section—rewrite or drop them. Each bullet still ends with **“Consider for 2WE if …”** (translation question)—**never** “2WE must …” or “WhatsApp bug ⇒ email bug.”
- **Optional:** small `<table>` — columns **Theme** | **WhatsApp signal** (epic keys / issue types) | **Email-specific translation question** (one short line per row).

### Per-row use on **2WE** stories (main table only)

- **Salomon bundle on 2WE rows:** When a row will carry **`Cross-channel (WhatsApp backlog) —`** with cited companion **`HRREC-…`** keys, thread those **cited keys** into **Salomon Jira index** (`jira_search_tool`) and **Slack archive** (`slack_archive_search`) queries (and optionally KB preamble/keywords) as the **primary anchors**—not only **2WE-local** JQL / summary-keyed Slack—per [`reference.md`](reference.md) **Net-new preamble (Salomon)** → **Cross-channel cited keys — Salomon anchor**. `getTicketDetails` ownership for the **in-scope 2WE** row key is unchanged.
- When a WhatsApp pattern is relevant to this row's slice, the signal merges into the **PM sentence** with a cited **`HRREC-…`** key — use **parenthetical** prose *(… (HRREC-nnnnn) …)* **and/or** bracket **`[WhatsApp companion: HRREC-nnnnn]`** per [`reference.md`](reference.md) **Inline source citations** — not as a separate tagged bullet. Example parenthetical phrasing: '...Similar pattern in WhatsApp (HRREC-nnnnn) suggests [translation question].' Do not emit a standalone Cross-channel (WhatsApp backlog) — bullet in any published cell.
- **WhatsApp match flag:** Set TRUE when the **published** PM sentence includes at least one WhatsApp companion **`HRREC-…`** key **either** in legacy parenthetical form `(HRREC-nnnnn)` **or** in bracket form `[WhatsApp companion: HRREC-nnnnn]` (same key must appear in either form for gating). This gates QA conditional sources (Salomon Jira index, Salomon Slack) and Dev conditional source (Peanut) for this row. All three query against the WhatsApp Jira keys cited in the PM sentence — not the story's own Jira key. If no WhatsApp signal was folded into the PM sentence, all three skip for this row.
- The bullet must name **which epic(s)** or issue types supported the hint and **why email may differ** (one short clause). Use **Jira keys or paraphrases** backed by **snapshot Captured excerpts** (manifest-only) and/or **`getTicketDetails` this run** (live delta / full live)—**do not** cite keys that remain **pending** in a partial corpus as evidence, and **do not** cite **staleness-only** removed manifest keys as current signal. **Do not** anchor **Cross-channel** hints on **AG:** / **RN:** WhatsApp keys unless the user widened scope—see **AG: / RN: (doc-writer) keys in companion corpus vs 2WE table** above. If no honest link, **omit**—no padding.

### Forbidden phrasing

Do **not** publish: implied causality from WhatsApp bugs to email defects, Twilio/SES stack-parity assumptions, untagged copy that reads like a second spec, **claims of a “full” WhatsApp corpus when `getTicketDetails` did not complete for every enumerated key** (use **partial** wording per **Companion partial corpus / resume**), or **“current WhatsApp backlog” / “as of today in Jira”** language when the run used **manifest-only** or **snapshot excerpts without a completed live delta** for those claims. On **live delta with snapshot**, do **not** imply **live Jira** for the entire corpus without stating the **live delta outcome** in the corpus line.

Do not emit companion corpus metadata ('snapshot_as_of', 'manifest_complete', 'WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md') inside individual story row cells. Do not emit 'Cross-channel (WhatsApp backlog) —' as a standalone tagged bullet in any published PM or QA cell — fold the signal into the PM sentence with a **parenthetical** and/or **`[WhatsApp companion: HRREC-nnnnn]`** bracket instead.
