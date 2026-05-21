# user-story-gap-review — reference

Long-form templates, HTML schema, and batching rules. Main workflow lives in `SKILL.md`.

## Contents

- [Run tiers](#run-tiers-tier-a-full-contract-vs-tier-b-timeboxed)
- [Dev lens vs PM lens — Message Builder and channel constraints (operator stance)](#dev-lens-vs-pm-lens--message-builder-and-channel-constraints-operator-stance)
- [Tier A subset — Message Builder / compose–heavy (HRREC-82977)](#tier-a-subset--message-builder--composeheavy-hrrec-82977)
- [Dev lens — KB backfill when XO is weak (narrow)](#dev-lens--kb-backfill-when-xo-is-weak-narrow)
- [From-scratch execution](#from-scratch-execution-mandatory-unless-user-opts-out)
- [Default Confluence target](#default-confluence-target)
- [Subset / smoke / local-only runs](#subset--smoke--local-only-runs)
- [Scope exclusions](#scope-exclusions-documentation-writer-tickets)
- [Companion channel cross-scan (013 / 2WE)](#companion-channel-cross-scan-013-2we) — stub; full contract: [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) (includes **Optional Peanut** anchors). **HRREC-82977:** step **2b** **mandatory** unless explicit opt-out—see annex **When to run**.
- [Page structure](#page-structure-audience-non-technical-sr-recruiting-pm)
- [Plain-language, story-specific, and source tags](#plain-language-story-specific-and-source-tags-mandatory)
- [Inline source citations (mandatory for PM / QA / Dev)](#inline-source-citations-mandatory-for-pm--qa--dev)
- [Salomon and DA — no separate Confluence columns](#salomon-and-da-no-separate-confluence-columns)
- [Three personas — criticality contract](#three-personas-criticality-contract)
- [Evidence grounding — no fabrication](#evidence-grounding-no-fabrication)
- [Gap column (2)](#gap-column-2--gap-likelihood-live-and-draft-html)
- [Gap likelihood — per story (Verdict + BDD)](#gap-likelihood--per-story-verdict--bdd)
- [Confluence HTML table skeleton](#confluence-html-table-skeleton)
- [Possible missing stories (holistic suggestions)](#possible-missing-stories-holistic-suggestions)
- [Thin-spec gate](#thin-spec-gate)
- [Suggested missing BDD](#suggested-missing-bdd-specificity-uniqueness-follow-on)
- [Net-new preamble (Salomon)](#net-new-preamble-salomon)
- [Net-new preamble (Deployment Agent)](#net-new-preamble-deployment-agent)
- [Net-new preamble (XO MCP)](#net-new-preamble-xo-mcp)
- [Net-new preamble (Peanut MCP)](#net-new-preamble-peanut-mcp)
- [Publish pipeline](#publish-pipeline-confluence-mcp)
- [Batching and chunking](#batching-and-chunking)
- [Sub-agents — policy](#sub-agents-policy)
- [Optional red team](#optional-red-team-080-red-team)
- [Optional follow-up](#optional-follow-up-not-v1)
- [Dry-run operator checklist](#dry-run-operator-checklist)

## Run tiers (Tier A full contract vs Tier B timeboxed)

Use this so large epics stay **honest** without abandoning the seven-column Confluence outcome.

| Tier | When to use | Salomon / Dev lens (XO + gated Peanut) / DA depth | Executive summary |
|------|----------------|-------------------------|---------------------|
| **Tier A** (default) | User asks for a **full** gap review, or no tier named | Satisfies **From-scratch execution** below: fresh Jira this session for every row; **at least one** Salomon query whose preamble + keywords tie to **that** story’s summary/AC (theme passes may *precede* but do **not** replace per-story pulls); **Dev lens:** XO attempt per row + **Peanut only when per-row triggers in** **Net-new preamble (Peanut MCP)** **fire** (default **no** `collectBugData` per story—see **When to invoke Peanut (2WE per-row)**); DA per-story **or** one batch with **row-anchored** synthesis (see **Deployment Agent — batched answers**). | Optional preface line **“Run tier: A (full contract).”** if useful; then **Top 5 gaps** / **Top 5 strengths** per **Page structure**. |
| **Tier B** (timeboxed epic sweep) | User **explicitly** asks for a fast / timeboxed pass, or token/time limits make Tier A infeasible in one session | Fresh Jira this session for every row remains **mandatory**. Salomon / **Dev lens (XO + gated Peanut)** / DA may be **theme-batched** (fewer MCP calls). **Default:** **no** per-row **`collectBugData`**—honest **`Peanut — Not queried — …`** per row unless the user widens scope or one epic-scoped Peanut batch was agreed. Each row must still carry **truthful** **Salomon —** / **`XO MCP —`** / **`Peanut —`** (when queried or honestly skipped) / **Deployment Agent —** lines—**no** invented per-key depth. | **Mandatory Tier B disclosure** in the **executive-summary preface** (see **Page structure**—up to two short items before **Top 5 gaps**), e.g. **“Run tier: B (timeboxed)—theme-based Salomon/DA and batched Dev lens (XO; Peanut gated per Net-new preamble (Peanut MCP)); not full reference per-key Salomon depth.”** Epic-level notes must list **which** themes were queried. If the page ships **draft replay** Storage HTML from a repo formatter that did **not** apply the **Verdict + BDD** rubric per row for **Gap Likelihood**, say so in the preface so Status lozenges are not mistaken for live judgment—see **Gap column (2)**. |

**Rules:** Default to **Tier A**. Move to **Tier B** only when the user names it or constraints are stated—**never** silently downgrade. Tier B still produces the same **page shape** (executive summary with **Top 5 gaps** / **Top 5 strengths**, epic notes, seven-column HTML, plus the **Possible missing stories** holistic table when epic-scoped—see **Possible missing stories (holistic suggestions)**); it trades MCP depth for speed **with disclosure**.

**Tier B — Dev lens anchor (mandatory):** When **Dev lens** relies on a shared XO outcome, outage fallback, or thin metadata, each published **Dev** sentence must still open or tightly weave **`KEY` plus a short fragment of that row’s Jira summary** so engineering asks are not identical across sibling rows (pairs with **Story-specificity** below).

## Dev lens vs PM lens — Message Builder and channel constraints (operator stance)

**Explicit decision (for operators and automation):**

1. **Product-level Message Builder behaviour** (what MB tends to do for templates, preview vs send, channel-specific tooling, admin template lifecycle, “what recruiters should expect”) belongs primarily in the **PM lens**, woven from **Salomon Internal Knowledge**, **Deployment Agent**, functional knowledge, and Jira—**not** repeated as ungrounded “the product works like X” inside **Dev** without a traceable source.

2. **Dev lens** stays **implementation-adjacent**: what XO metadata (and gated Peanut) suggest about **where** the slice is built, **patterns/constraints** the scenarios skip, and **what to ask engineering** when metadata is missing. That is why many rows still end with an **engineering confirmation**—XO often returns MB **admin/configuration** hits or cross-channel **WATS** neighbours instead of a crisp answer for **this** Recruiting email slice.

3. **Repetition is a failure mode, not a goal:** When many compose stories share weak XO, do **not** paste the same generic cross-channel question (e.g. email vs SMS embed constraints) on row after row—move the shared theme **once** to **Epic-level notes** or **Top 5 gaps**, then make each **Dev** line **story-keyed** (see **Tier B — Dev lens anchor** and **Story-specificity**).

4. **When you need MB guidance without an engineering meeting:** Prefer **Tier A** (or the **Tier A subset** below) with **narrow** Salomon queries and **Jira-anchored** XO strings—not invented Dev prose.

## Tier A subset — Message Builder / compose–heavy (HRREC-82977)

Use when the full 44-key epic pass was **Tier B** or XO-light and the PM wants **evidence-backed** depth on **Message Builder / SSP compose** slices only (still **fresh Jira** this session for each row in the subset).

**Example JQL (adjust keys to your refinement):** stories whose summaries mention compose chrome, RTE, header, attachment, discard, or sliding side panel—e.g. `(summary ~ "Message Builder" OR summary ~ "compose" OR summary ~ "Rich text" OR summary ~ "sliding side panel" OR summary ~ "attachment" OR summary ~ "discard") AND project = HRREC AND issuetype = Story AND "Epic Link" = HRREC-82977` (validate JQL field names in your Jira). A **manual key band** (e.g. HRREC-91982–91999) is acceptable if the PM names it.

**Salomon Internal Knowledge (per row in subset):** keep future-state framing; add **one** narrowing clause tied to that row’s summary, e.g. *“…for **email** Message Builder embeds in the recruiting sliding side panel (not SMS conversational chrome): preview vs send, CRF/field resolution, or template lifecycle risks.”*

**XO MCP:** run at least **two** attempts per row—first pass uses **summary nouns** from Jira; second pass uses any **class**, **WS**, **REST**, or **task** names visible in the description (`cl:…`, `ws:…`, or plain feature terms per **Net-new preamble (XO MCP)**). If the story names an integration surface, consider **`hopper_search`** / **`service_description_get`** on that surface (read-only).

**Publish target:** follow **Subset / smoke / local-only runs** unless the PM explicitly agrees to **replace** the rolling page with this partial matrix.

## Dev lens — KB backfill when XO is weak (narrow)

**Purpose:** Reduce hollow Dev cells that only repeat a generic “email vs SMS Message Builder” ask when **XO** returned nothing useful, **without** turning **Dev** into a second **PM** column or violating **Evidence grounding — no fabrication**.

**Published Dev lens may include at most one short clause paraphrasing Salomon Internal Knowledge** (same session, same row) **only when all** of the following hold:

1. **XO exhausted:** After the honest search pattern in **Net-new preamble (XO MCP)** (including a second, narrower attempt when the first pass is generic/off-topic), the row’s **implementation-area** outcome is **no substantive hit** for *this* slice **or** hits are **clearly off-topic** (e.g. only unrelated-channel WATS or unrelated convenience tasks)—and internal notes say so honestly.

2. **KB was on-topic for this row:** Salomon Internal Knowledge **already ran** for this key during **PM lens** synthesis and returned at least one hit that **directly** informs implementation risk for *this* story (preview vs send, template hydration / CRF scope, channel-specific MB behaviour, server vs client responsibility—not generic HR marketing pages).

3. **Supplementary only:** The **Dev** sentence still contains a **concrete engineering confirmation** (ownership, binding, class/workset, REST contract, or “where this lands in XO”)—the KB clause explains **why** that confirmation matters for hiring workflows; it does **not** replace the ask.

4. **No PM paste:** Do **not** duplicate the full **PM** sentence or stack multiple KB claims in **Dev**.

5. **No legacy tag starters:** Same **Banned string check** as other cells—no `Salomon (Knowledge) —` (or other em-dash **internal** tag starters) in the published **Dev** cell. **Whitelist** `[Salomon]`, `[XO MCP]`, `[Peanut]`, etc., per **Inline source citations** are **required** when those sources informed the sentence.

**Internal authoring:** You may note `Salomon (Knowledge) → Dev backfill (XO weak)` in scratch notes for traceability; **Evidence grounding** treats the paraphrase as traceable to the **same-run** Salomon hit used for PM on that key.

## From-scratch execution (mandatory unless user opts out)

**Tier A** runs must satisfy items **1–5** below per in-scope story. **Tier B** runs relax Salomon / Dev lens depth per **Run tiers** but still require fresh Jira (item **1**) and honest per-row source lines.

When the user says **run** the gap review (e.g. `/user-story-gap-review`, “rerun on the epic”), assume **no carry-over** of narrative analysis from:

- Prior Confluence versions of the same page  
- Pre-written row text in repo scripts (e.g. `gen_gap_review_*.py` story libraries)  
- Earlier chat turns, MISSION_LOG prose, or “we already know” memory  

**Per story in this run**, before writing that row’s PM/QA/**Dev lens** cells:

1. **Ingest** current Jira text (`getTicketDetails` or `jira_details_tool`) for that key in this session (**skip** keys excluded under **Scope exclusions**, e.g. **AG:** / **RN:** doc-writer tickets).  
2. **Functional knowledge** — Review uploaded functional knowledge files for this story's domain. This is the baseline for both PM and QA synthesis. Always run.
3. **PM lens sources** — Run in this order: (a) Epic birds-eye scan: review all in-scope story summaries for cross-story patterns and coverage gaps. (b) Salomon Internal Knowledge: 2–3 queries with future-state framing (what might be missing from the proposed scenarios given current functionality). (c) Deployment Agent: one question with future-state framing (what might be risky for typical tenant configurations given the proposed scenarios). (d) WhatsApp Jiras when cross-scan ran. Synthesise into PM sentence. Set WhatsApp match flag.
4. **Dev lens — XO MCP** — Search for the implementation area of this story. Look for patterns or constraints the current scenarios may not cover. Always run. State findings or honest absence in Dev sentence.
5. **QA + Dev conditional sources** — Run only when WhatsApp match flag is TRUE: (a) Salomon Jira index: query cited WhatsApp keys. (b) Salomon Slack: query cited WhatsApp keys. (c) Peanut MCP: query cited WhatsApp keys. Skip all three when WhatsApp match flag is FALSE.

Then synthesise PM/QA (with Salomon/DA woven in), **Dev lens**, **Verdict**, and **Suggested missing BDD** **from those fresh inputs**; assign **Gap Likelihood** (column 2) **last**, using **only** **Verdict** + suggested missing BDD per **Gap likelihood — per story (Verdict + BDD)**. Epic-level notes and the PM executive summary must be **re-derived** from the matrix you just produced (and this run’s Jira list), not copied from an older report file.

If **time or token limits** prevent full coverage, state that plainly in chat and add a bullet under **Epic-level notes** (“Partial run: stories X–Y not re-fetched”)—do not silently ship stale cells.

**Explicit opt-out:** only if the user clearly asks for a **diff-only**, **incremental**, or “reuse last Salomon pass” run may you skip full per-story MCP for unchanged keys—and say so on the page.

**Tier B alignment:** Under **Run tiers → Tier B**, the per-story Salomon minimum is satisfied by **documented theme queries** (epic notes) plus per-row **Salomon —** bullets that state which theme applies and honest absence where no hit applies to that story—not by duplicating full multi-query depth on every key. Apply the **Tier B — Salomon / Deployment Agent sentence reuse cap** under **Plain-language** so theme batches do not become identical paragraphs on sibling rows.

## Default Confluence target

- **Rolling gap-review page (David / two-way email epic runs):** `pageId` **4416121176** — `https://confluence.workday.com/pages/viewpage.action?pageId=4416121176`. On each **fresh run**, overwrite the entire Storage body with `smart_update_confluence_page` **`mode: "replace"`** (no incremental append to this page unless MCP/transport limits force a temporary fallback; then consolidate back to one logical page body—main seven-column table plus **Possible missing stories** table when applicable).
- **Page title pattern:** `Net-New Story Gap Review — YYYY-MM-DD (EPIC-KEY)` or similar so Confluence history shows the run date; keep the same `pageId` for rolling updates.
- **Never** reuse or overwrite pages titled for unrelated workflows (for example, pages whose sole purpose is customer-issue triage output).
- **Space:** PM must supply `spaceKey` in the prompt when creating a **new** page (or confirm an existing page URL / `pageId`). If omitted once, ask before `create_confluence_page`. For the rolling page above, **no** new page—always update in place.

## Subset / smoke / local-only runs

Use when the user reviews a **subset** of an epic (e.g. “first N stories”), asks for a **smoke** pass, or wants output **without** overwriting the default rolling Confluence page.

**Executive-summary preface (mandatory for these runs):** include **≤2** short items that state (or **≤3** when **Global XO MCP outage** item **(3)** from **Page structure** also applies—fold into a run-scope line if you must stay at two):

1. **Run scope** — explicit list or range of **in-scope** `HRREC-…` keys (and note skipped **AG:** / **RN:** keys in chat or here if applicable).
2. **Publish target** — one of: **Confluence skipped** (local-only), **`pageId` …** (scratch or alternate page—**replace** only that target), or **rolling replace confirmed** (only when the user explicitly agrees to overwrite the default rolling page with this subset—otherwise do **not** `replace` a full-epic rolling page with a partial table).

**Tier A contract on subsets:** Unless the user **explicitly** opts into **Tier B** or a **diff-only** run (**From-scratch execution**), each in-scope row still needs its own **Salomon** query tie (not a single epic-wide query pasted into every row), **`XO MCP —`** attempt, honest **`Peanut —`** line when Peanut is not run, and **row-anchored** **Deployment Agent —** synthesis (**For KEY (summary phrase):** …). For **HRREC-82977** subset/smoke runs, **step 2b** (WhatsApp companion cross-scan) is still **mandatory** per [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **When to run** unless the user used an **explicit companion opt-out** phrase there.

**Local artifact (recommended):** write Storage HTML to a repo file under `docs/initiatives/two-way-email/drafts/` (or another path the user names), then optionally run `python3 docs/initiatives/two-way-email/drafts/check_gap_review_row_dedup.py <path/to/file.html>` — see **Dry-run operator checklist**. This is **not** a substitute for publishing when the user asked for Confluence—make the publish choice explicit in the preface.

## Scope exclusions (documentation-writer tickets)

**Exclude from the gap-review table and from per-row MCP synthesis** any issue whose **Summary** (after trimming) starts with **`AG:`** or **`RN:`** (case-insensitive). Those keys are reserved for **documentation / release-note** workflows (doc writer), not product gap review.

- Still **list them once in chat** (and optionally a one-line note under **Epic-level notes**: “Skipped N keys: AG:/RN: doc-writer tickets — …”) so the PM sees nothing was silently dropped.
- Do **not** spend Salomon / **Dev lens (XO + gated Peanut)** / DA budget on excluded keys unless the user explicitly widens scope.

**JQL cookbook (first N product stories, not doc-writer):** `ORDER BY key ASC` alone often surfaces **AG:** / **RN:** first. Prefer filtering in JQL when your Jira dialect supports it, e.g.  
`project = HRREC AND issuetype = Story AND "Epic Link" = HRREC-82977 AND summary !~ "AG:*" AND summary !~ "RN:*" ORDER BY key ASC`  
If `!~` wildcards are unreliable in your environment, run the broader query and **post-filter** results before ingesting—still list skipped keys in chat once.

## Companion channel cross-scan (013 / 2WE)

**Stub (stable anchor):** Full rules for manifest-only / live delta with snapshot / full live corpus, Confluence **`h2`** / corpus line / **`Cross-channel (WhatsApp backlog) —`**, **Optional Peanut (code anchors)** (3–8 keys), operator preflight, and **Forbidden phrasing** are in **[`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)** (same folder). **013:** [`.cursor/rules/013-two-way-email-initiative-context.mdc`](../../rules/013-two-way-email-initiative-context.mdc).

**Default for two-way email:** Any `/user-story-gap-review` (or equivalent) whose **in-scope** keys are epic **HRREC-82977** stories/tasks **must** run step **2b** (companion corpus + page `h2` + corpus line per annex) **unless** the user opts out with a phrase named in the annex **When to run**.

For **Run tiers**, **From-scratch execution**, **Page structure**, **Gap likelihood**, and **Publish pipeline**, use this **`reference.md`**. When **step 2b** runs, execute the annex end-to-end.

**Quick links:** [`COMPANION_WHATSAPP_EPICS.md`](../../../docs/initiatives/two-way-email/COMPANION_WHATSAPP_EPICS.md) · [`WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](../../../docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md)


## Page structure (audience: non-technical Sr. Recruiting PM)

Order content top-to-bottom:

1. **PM executive summary (portfolio view)** — `h2` **“Executive summary (for PM)”**. This section is the **epic-wide headline for you**: what to worry about and what is already in good shape—**not** a second copy of every row’s lenses.
   - **Preface (when applicable):** before the two lists, a **short** `<ul>` with **at most two** `<li>` items, **or up to three** only when **(3)** applies: **(1)** **Run tier** (Tier **B** disclosure is **mandatory** when applicable—see **Run tiers**); optionally add the **Gap Likelihood** reader note in the same `<li>` when helpful: *“Gap Likelihood reflects **Verdict** + **suggested missing BDD** only—not a separate persona-tension score.”* **(2)** **Scope** (e.g. skipped **AG:** / **RN:** keys) and/or **draft replay** caveat when Status lozenges come from a repo formatter **without** per-row Verdict+BDD rubric (see **Gap column (2)**). **(3) Global XO MCP outage (mandatory when applicable):** when **every** in-scope `user-xo-mcp` `search` attempt in this session failed (transport, authentication, or upstream error—not merely empty YAML), add **one** `<li>` stating that **XO MCP did not return SUV metadata this session**, so **Dev lens** is engineering follow-up only and readers must **not** infer per-story SUV metadata gaps. **Omit** the entire preface `<ul>` only when **(1)**–**(2)** add nothing material **and** **(3)** does not apply. If **only (3)** applies, emit a **one-item** preface with that line.
   - **`h3` Top 5 gaps (epic)** — ordered `<ul>`, **at most five** `<li>`. **Default order:** gaps **before** strengths (action-first). Each line: **one sentence**, plain English, **actionable** (what to refine, decide, spike, or align in a session). Optional trailing **story keys** in parentheses when that sharpens ownership (e.g. `(HRREC-91975, HRREC-91997)`). **Do not pad** toward five—use fewer lines when the evidence does not support five distinct epic-level gaps.
   - **`h3` Top 5 strengths (epic)** — ordered `<ul>`, **at most five** `<li>`. Same one-sentence rule. Each strength must tie to **evidence** from this run (e.g. repeated clarity in Jira across keys, consistent Salomon/DA themes, or stable **Dev lens** signals)—**no generic praise** or filler.
   - **Plain language only**—no stack traces, no unexplained acronyms; if you mention a Workday artefact (e.g. “security domain”, “message template”), one short clause on why it matters to recruiters or candidates. **Epic-wide testing themes** (Reply-To staging, bell vs inbox, attachment limits, template health, purge scope) belong **once** in this summary or in **Epic-level notes**—not copy-pasted into every story row (see **Lens column brevity** and **Story-specificity**).
2. **Epic / scope coherence** — `h2` **“Epic-level notes”** (omit only if the run is a loose JQL bag with no shared epic): bullets for **duplicated or overlapping scenarios** across stories, **gaps** that span journeys (journey A without matching journey B), **dependency / ordering** risks, and **candidate missing stories** the PM should validate with engineering—material that does **not** fit a single one-line **Top 5 gaps** entry. **Do not** paste the same epic theme as a long paragraph in **Epic-level notes** and again across most table rows; keep the **portfolio** narrative in the executive summary’s 5+5, keep **cross-story mechanics** here, keep **story-specific** detail in the table.
3. **Cross-initiative pattern hints (WhatsApp)** — `h2` **“Cross-initiative pattern hints (WhatsApp — inspiration only)”** — include **only** when **Companion channel cross-scan (013 / 2WE)** ran (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)). **Omit** this block entirely when the scan did not run (non-2WE scope).
4. **Gap review table** — single Storage HTML `table` (see [Confluence HTML table skeleton](#confluence-html-table-skeleton)); seven columns per existing contract.
5. **Possible missing stories (holistic)** — `h2` **“Possible missing stories (suggestions only)”** immediately **under** the gap review table, then a short lead `<p>`: these rows are **not** Jira keys—the skill **does not** create issues; they are backlog **suggestions** from a holistic pass. When no PRD/initiative scope was loaded for this run (see **Possible missing stories (holistic suggestions)**), the lead must say the block is **Jira-holistic + epic narrative only**. For **loose JQL** runs with **no single shared epic**, **omit** this whole `h2` + table and instead emit one `<p>` under the main table: *Holistic “possible missing stories” table omitted—no single epic scope.* **Do not** duplicate content already captured as **Suggested missing BDD** on existing Story rows; this table is for **net-new slices** (missing journeys, cross-cutting admin/compliance, platform spikes) implied by the epic set + optional PRD.

**Tone for all narrative sections and table cells:** write as **recommendations and questions** a Sr. PM can take to refinement—**not** an engineering ticket dump. Technical depth belongs in the **Dev lens** column but still **translated** (“The platform metadata we searched did not show … therefore engineering should confirm …”; Peanut signals phrased as **what to ask engineering**, not raw diffs).

## Plain-language, story-specific, and source tags (mandatory)

**Story-specificity (anti–copy-paste):** PM, QA, and **Dev lens** cells **fail the skill** if the same multi-line boilerplate appears unchanged on **multiple** sibling rows. Epic-level reminders (mail redirect, notification types, attachment limits, purge breadth, template override) live in the **Executive summary (Top 5 gaps / Top 5 strengths)** and **Epic-level notes**—each story row must tie advice to **that** story’s summary, scenarios, and tensions. Respect **Lens column brevity** caps so rows stay scannable. **Exception (global XO outage):** when the preface includes **(3) Global XO MCP outage** per **Page structure**, you may still use a **short shared opener** that XO was unavailable—**but** each **Dev lens** must then diverge with **one story-keyed clause** (summary nouns from that row’s Jira) so the engineering ask is not identical across half the grid; do not paste the same long fallback on many rows without that anchor.

**Generic cross-channel Dev ban:** Do **not** publish the **same** generic engineering question (for example, “how Message Builder embed constraints differ for email versus SMS”) verbatim on **more than one** sibling row. State that theme **once** under **Epic-level notes** or **Top 5 gaps**, then vary each **Dev** line with **`KEY` + summary-specific nouns** and the row’s XO/KB outcome (see **Tier B — Dev lens anchor** and **Dev lens — KB backfill when XO is weak (narrow)**).

**Plain language:** prefer recruiter/admin/candidate wording. When a source uses jargon, **translate once** in the same bullet, e.g. “**REST / server contract** → the behind-the-scenes save or send check should match what the screen promises.” Avoid dumping internal class names, WIDs, or tool acronyms unless one short plain-English gloss is included.

### PM read-aloud gate (mandatory before publish)

Before shipping the Confluence table (and mirrored chat summary), **each story row** must pass this check: *Could I read the **PM** and **QA** lens cells aloud to a hiring manager who does not ship software, in about **90 seconds or less per row**, without stopping to define jargon?*

- Treat **bracket citations** (`[Functional knowledge: …]`, `[Salomon]`, `[DA]`, … on **PM**; `[Jira]` and others on **QA** where applicable) as **skimmable source hints**—they should not dominate the cell or force jargon; if they hurt read-aloud flow, merge sources into fewer bracket groups (still within the **citation budget**).
- If a bullet **opens** like a test script (**Assert…**, **Prove…**, **Verify…**, **Measure…** as the leading word) or is mostly **acronyms without a one-line “why it matters to hiring” gloss**, rewrite before publish.
- If the **published** **PM lens** sentence is only the **story title** restated, replace it with one sentence on **what is unclear, risky, or missing** for *this* slice in recruiter/admin/candidate terms (still grounded in Jira—see **Source tags** for internal routing).

### Inline source citations (mandatory for PM / QA / Dev)

Published **PM lens**, **QA lens**, and **Dev lens** Storage HTML cells must make **evidence traceable to a Sr. PM** using **whitelist bracket tokens** placed **after** the clause or sentence they support (never as leading bullets). This is **in addition to** plain-language synthesis—not a paste of MCP dumps.

**PM lens — do not cite `[Jira]`:** Fresh **Jira ingest** for every row is mandatory baseline work (**From-scratch execution**); it is **implied** and must **not** appear as a bracket token in the **PM** column. PM citations call out **non-Jira** evidence only (functional knowledge, Salomon KB, Deployment Agent, epic scan, WhatsApp companion, optional PRD path).

**Whitelist — use these exact bracket forms in published cells** (semicolon inside one bracket group is allowed to combine sources for one sentence):

| Token | When to cite |
|--------|----------------|
| `[Jira]` | **QA lens** (and **Dev lens** only when a clause truly rested on this row’s **ingested** Jira text beyond XO/KB/Peanut). **Do not** use `[Jira]` in the **PM lens**. |
| `[Salomon]` | Any clause grounded in **Salomon Internal Knowledge** hits this run. In **Dev**, cite `[Salomon]` **only** when **Dev lens — KB backfill when XO is weak (narrow)** applies (same-run KB as PM for that key). |
| `[DA]` | **Deployment Agent** (`ask_deployment_agent`) — `[DA]` is the short form for “Deployment Agent” in citations. |
| `[Functional knowledge: …]` | When a clause used **uploaded** functional knowledge or an explicitly loaded doc path / **050**-class rule: use the **file name** or short rule label inside the brackets (truncate long file names with `…` in the middle if needed). **Omit** this token only for clauses that did not use functional knowledge. |
| `[Epic scan]` | Optional — clause is clearly from **epic birds-eye** scan only (cross-story patterns, not ticket-local prose). |
| `[PRD: …]` | **PM lens** when a **named** PRD or initiative doc path was **actually loaded** for this run (repo path, user attachment, or Jira Notes link you read); use a short label inside the brackets. **Do not** invent PRD claims you did not read (**Evidence grounding**). |
| `[WhatsApp companion: HRREC-nnnnn]` | When step **2b** companion evidence informed that clause; include **at least one** cited `HRREC-…` key (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **WhatsApp match flag**). |
| `[Salomon Jira]` | **QA lens:** clause from **Salomon Jira index** (`jira_search_tool`) against cited WhatsApp keys (WhatsApp match TRUE). |
| `[Salomon Slack]` | **QA lens:** clause from **Salomon Slack** (`slack_archive_search`) against cited WhatsApp keys (WhatsApp match TRUE). |
| `[XO MCP]` | **Dev lens:** every row where XO was run (including “no useful hit” or outage-honest wording). |
| `[Peanut]` | **Dev lens:** when WhatsApp match is TRUE and Peanut was invoked, **or** when you state honest skip/failure in prose **without** using banned `Peanut — …` taxonomy strings. |

**QA — Salomon Jira vs Slack:** When WhatsApp match is TRUE and the sentence blends both, prefer one group `[Salomon Jira; Salomon Slack]`. If only one tool informed a clause, use `[Salomon Jira]` or `[Salomon Slack]` for that clause.

**Citation budget:** **At most four** bracket groups **total** per PM / QA / **Dev** cell (count each `[…]` as one group, including `[Functional knowledge: x]`). Prefer **one trailing group per sentence** when a sentence blends sources, e.g. `… [Functional knowledge: CONTEXT.md; Salomon]` on **PM**, or `… [Jira; Salomon Jira]` on **QA** when applicable, rather than many micro-brackets mid-clause.

**Verdict / BDD / executive summary:** **No** mandatory bracket scheme in this version—keep those sections readable as today.

**Banned string check (mandatory):** Before publishing, confirm **none** of the following **legacy** strings appear in any PM, QA, Dev, or Verdict cell: 'Salomon (Knowledge) —', 'Salomon (Jira index) —', 'Salomon (Slack) —', 'Deployment Agent —', 'Cross-channel (WhatsApp backlog) —', 'Batched NET-NEW', 'jira_search_tool', 'slack_archive_search', 'snapshot_as_of', 'manifest_complete', 'WHATSAPP_COMPANION_CORPUS_SNAPSHOT', 'Peanut — Not queried', 'Peanut — Unavailable', 'Tier B sweep'. **Whitelist** tokens such as `[Salomon]` and `[DA]` are **required** for PM/QA/Dev per this section and are **not** violations. If any **legacy** string appears, rewrite before publish.

### QA lens — user-visible risk first (mandatory)

The QA column stays **evidence-backed** (**internal** Salomon/Jira/Slack routing) but must **read like a Sr PM taking questions to refinement**, not an automation script.

1. **Order of thought:** When describing failure hunting, put **what the recruiter or candidate would notice first** (wrong copy, missing task, stuck spinner, misleading “sent” state, blocked send, privacy-unsafe leak), **then** (same or following **clause**) how QE could exercise it if needed.
2. **Banned leading words** on the **published** QA sentence: do **not** start with **Assert**, **Prove**, **Verify**, **Measure**, or **Trace** as the first word. Prefer **Recruiters see…**, **Candidates experience…**, **Risk:**, **Edge case:**, **Watch for…**.
3. **At most one** **clause** per row may read like a lab step; it must still name the **user-visible** symptom it guards against.

### Tier B — Salomon / Deployment Agent sentence reuse cap

Tier B allows **theme-batched** Salomon/DA; it does **not** allow **verbatim paste across sibling keys**.

- The **exact same sentence** (after trimming whitespace) may appear in a **Salomon —** or **Deployment Agent —** bullet on **at most two** stories in the same published table. From the **third** story onward, **paraphrase** for that story’s summary/AC, **or** use one cross-reference line: **Salomon —** Same theme as **HRREC-XXXX**—see that row; add **only** new detail if this story’s AC introduces it.
- Theme labels (“Theme tenant comms (general):”) must still vary the **clause that follows** per key—do not reuse the following clause unchanged down dozens of rows.

### Worked example — QA bullet (bad vs good)

**Bad (test-script voice):**  
`Jira — Assert empty-state copy, entry points (My Tasks vs profile), and that no phantom draft appears after refresh.`

**Good (PM-facing voice):**  
`Jira — Empty state: recruiters opening the task from My Tasks vs the candidate profile should see clear, consistent wording; if a draft reappears after refresh with no user action, call out which entry path reproduces it so refinement can split ownership.`

### Source tags in PM and QA columns

Source tags are **internal authoring labels** that route MCP evidence during synthesis (`Salomon (Knowledge) —`, `XO MCP —`, etc.). They determine which tool output feeds PM, QA, and Dev during **step 6–7** authoring. **Published** PM / QA / **Dev lens** cells must **not** use legacy **em-dash tag starters** as bullets or sentence prefixes (see **Banned string check**). Instead, **append whitelist bracket citations** per **Inline source citations (mandatory for PM / QA / Dev)** after each clause or sentence so a Sr. PM can see what backed the prose. Keep the routing table below as an **authoring** reference; **strip** legacy tag strings and **replace** with bracket tokens before publish.

**Authoring reference only — do not emit legacy `Source —` tag starters in published Confluence cells:**

| Source | Feeds | Trigger | Query target |
|--------|-------|---------|--------------|
| Uploaded functional knowledge | PM + QA | Always | Story domain |
| PRD (when loaded) | PM | Always when available | Story scope |
| Epic birds-eye scan | PM | Always | All in-scope stories |
| Salomon Internal Knowledge | PM | Always | Future-state framing |
| Salomon Internal Knowledge | Dev | **Optional** — only when **Dev lens — KB backfill when XO is weak (narrow)** gate passes; same-run hit already used for this row’s PM synthesis | Implementation-constraint subset only (e.g. preview vs send, CRF scope)—**at most one** paraphrased clause in the published **Dev** sentence |
| Deployment Agent | PM | Always | Future-state framing |
| WhatsApp Jiras (cross-scan) | PM | When cross-scan ran | Cited WhatsApp keys |
| Salomon Jira index | QA | WhatsApp match flag TRUE | Cited WhatsApp keys only |
| Salomon Slack | QA | WhatsApp match flag TRUE | Cited WhatsApp keys only |
| XO MCP | Dev | Always | Implementation area |
| Peanut MCP | Dev | WhatsApp match flag TRUE | Cited WhatsApp keys only |

**WhatsApp match flag:** Set to TRUE during PM lens synthesis when the **published** PM sentence includes a cited WhatsApp **`HRREC-…`** key **either** in legacy parenthetical form `(HRREC-nnnnn)` **or** in bracket form `[WhatsApp companion: HRREC-nnnnn]` (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)). Gates QA conditional sources (Salomon Jira index, Salomon Slack) and Dev conditional source (Peanut). When FALSE, those three sources do not run — no Salomon Jira/Slack in QA, no Peanut in Dev.

**Dev lens column:** While authoring, one `<ul>` of **`XO MCP —`** bullets for the implementation-area search (plain English: what region was searched, what was / was not found; optional **`XO MCP — risk:`** for risk-from-absence). When WhatsApp match flag is TRUE, add **`Peanut —`** bullets per **Peanut — taxonomy (gap review)**. When the **Dev lens — KB backfill when XO is weak (narrow)** gate passes, you may add **one** internal scratch bullet (not for publish) noting which **on-topic** Salomon excerpt supports a single plain-language clause in the published **Dev** sentence. **Published** cell is **one** or **two** synthesized sentences per **Output format contract** in [`SKILL.md`](SKILL.md), each with **whitelist bracket citations** per **Inline source citations**—no legacy em-dash tag starters and no raw tool-dump lines in publish.

### Verdict column (replaces “Severity / open questions”)

**Column header:** **Verdict** (not “Severity / open questions”).

**Purpose:** a **TL;DR** for busy PMs—**no** long numbered question lists.

**Skimming contract:** When **you** scan the gap table, read **Verdict** first on each row; PM / QA / **Dev lens** are supporting detail. **Verdict** must **not** paste or paraphrase long lists from those columns—keep it to the two-sentence **Finding** / **Recommended next step** contract below.

**Format:** exactly **two** bullets in one `<ul>`, **one sentence each** (aim ≤ ~140 characters per sentence; slightly over only if unavoidable):

**Verdict label:** Before the two bullets, emit a single coloured label on its own line indicating overall gap severity: 🔴 Very High / 🟡 High / 🔵 Medium / 🟢 Low / ⚪ Very Low. This label matches the Gap Likelihood lozenge assigned in column 2 and gives the PM an instant visual signal when skimming the table.

```html
<ul>
  <li><strong>Finding:</strong> …</li>
  <li><strong>Recommended next step:</strong> …</li>
</ul>
```

- **Finding:** one plain-language sentence summarising the **overall** outcome of the row (thin spec, alignment vs tension, or biggest thing to remember)—**only** what evidence supports.
- **Recommended next step:** one concrete **next** action when a gap exists (refine Jira, short decision meeting, spike, align with sibling story X). When no material gap surfaced, use an honest **no-action** line (see **Evidence grounding — no fabrication**).

**Cross-channel (WhatsApp) synthesis:** When this row’s **PM sentence** includes a WhatsApp signal via **parenthetical** `(HRREC-…)` **or** bracket `[WhatsApp companion: HRREC-nnnnn]`, **Finding** may compress that cross-initiative tension **together with** this story’s **2WE** Jira / lens evidence in one sentence—still **no** “WhatsApp bug ⇒ email defect” implication; still obey the **Skimming contract** (no pasted or long paraphrase lists from the lens columns).

Avoid severity codes (P1/P2) unless the team already standardises on them; prefer plain phrases like “Worth deciding before build” / “Lower risk once … is clarified”.

## Salomon and DA — no separate Confluence columns

Under **Tier A**, run Salomon and DA at the per-story (or row-anchored batched DA) depth described in **From-scratch** and **Run tiers**. Under **Tier B**, MCP calls may be **theme-batched** per **Run tiers**, but every row still records what ran in **Salomon —** / **Deployment Agent —** (no silent omission). **Do not** add **Salomon precedents** or **DA notes** as their own `<th>` / `<td>` columns.

| Source | Baked into **PM lens** | Baked into **QA lens** |
|--------|------------------------|-------------------------|
| **Salomon** | Product patterns, constraints, admin/compliance precedents, “what we usually document for customers” | Past bugs, regression patterns, support-heavy failure modes, edge cases called out in internal threads |
| **DA** | Tenant setup reality, best-practice limits, config vs product boundary, how recruiters/admins typically operate | How to exercise the story in a realistic tenant, misconfiguration gotchas, perf/limit assumptions for test planning |

When Salomon or DA returns **nothing useful**, state that **inside** the **synthesised** PM/QA cell (plain-language absence), not as a silent empty column.

## Three personas — criticality contract

Each row’s **PM / QA / Dev lens** cells must reflect **deliberate skepticism** (Salomon/DA are **part of** PM/QA, not extra columns):

- **PM lens** — Sources: uploaded functional knowledge, PRD when loaded, epic birds-eye scan, Salomon Internal Knowledge (future-state framing), Deployment Agent (future-state framing), WhatsApp Jiras when cross-scan ran. Reads existing scenarios. Asks each source what looks missing from the future state. Salomon and DA are queried as advisors on what current functionality suggests might be risky or underdefined in the proposed scenarios — not as a lookup for current behaviour. Sets WhatsApp match flag when a WhatsApp signal is folded into the PM sentence.
- **QA lens** — Baseline source: uploaded functional knowledge files (always). Conditional sources: Salomon Jira index and Salomon Slack, triggered only when WhatsApp match flag is TRUE, queried against cited WhatsApp Jira keys only (not the story's own Jira). Asks: what is untestable or missing in the current scenarios? When WhatsApp match: what failure modes from those WhatsApp Jiras might translate here?
- **Dev lens** — XO MCP (always): searches for the implementation area of this story in the codebase, looking for patterns or constraints the scenarios may not cover. Peanut MCP (conditional): triggered only when WhatsApp match flag is TRUE, queried against cited WhatsApp Jira keys only. **Optional:** one **Salomon-backed** clause in the published **Dev** sentence only under **Dev lens — KB backfill when XO is weak (narrow)**. Synthesises into plain English for engineering (confirmation ask plus any allowed backfill).

If all three read like generic praise, the row **fails** the skill’s intent—rewrite until each lens adds **distinct** pressure **without inventing facts** (see **Evidence grounding — no fabrication** below).

## Evidence grounding — no fabrication

**General rule:** Every **published** PM / QA / **Dev lens** cell, each **Verdict** line, and each **BDD** block must be **traceable** to at least one of:

- Jira description, acceptance criteria, or scenarios;  
- **Salomon** — a paraphrased or quoted excerpt from a hit, or an explicit **“no useful precedent returned”** line;  
- **Deployment Agent** — paraphrased answer text, or explicit **“no answer / only generic guidance”**;  
- **XO MCP** — what was searched and what was returned, or explicit **not found** + query terms;  
- **Salomon Internal Knowledge (Dev backfill only)** — when **Dev lens — KB backfill when XO is weak (narrow)** applies: **one** paraphrased clause in the published **Dev** cell, traceable to the **same-run, same-key** Salomon hit already used for **PM** synthesis on that row—**not** a second PM column and **not** a substitute for the engineering-confirmation part of **Dev**;
- **Peanut MCP** — when invoked per **When to invoke Peanut (2WE per-row)**: paraphrased similar-issue or code-search signal that matters for **this** row, or **Ran — no useful signal**; when not invoked: **Not queried** per **Peanut — taxonomy (gap review)**; on tool failure: **Unavailable**—**not** “not queried.”  
- **Companion Jira (WhatsApp epics)** — when **Companion channel cross-scan** ran: themes or failure patterns **paraphrased** from **(a)** **manifest-only:** repo **snapshot** manifest + **Captured excerpts** (`snapshot_as_of`) with **no** WhatsApp Jira pull, **or (b) live delta with snapshot:** same snapshot **plus** **`getTicketDetails`** for **new** live keys and any stable keys you explicitly refreshed, **or (c) full live:** paginated Story+Bug inventory plus **`getTicketDetails`** for keys successfully pulled this run—**primary** surfaces: a **WhatsApp `HRREC-…` citation in the published PM sentence** — parenthetical `(HRREC-nnnnn)` **or** bracket `[WhatsApp companion: HRREC-nnnnn]` (when the row warrants it) — and/or the companion **`h2`** section. **On the same row**, **Verdict** and **Suggested missing BDD** may **also** trace to that **WhatsApp translation question** (**Finding** may compress it alongside **2WE** evidence; **Recommended next step** may name an email-side refinement or spike; **at most one** additional **GWT** block may close it—still within the **0–4** BDD cap—see **Verdict column** and **Suggested missing BDD — specificity, uniqueness, follow-on**). Companion evidence is **not** a substitute for **2WE** `getTicketDetails` text; if the companion corpus was **partial**, do **not** over-claim coverage (see **Companion partial corpus / resume**); **never** treat the snapshot as “live Jira” without the corpus line matching the path (**manifest-only** vs **live delta outcome** vs **full live**);  
- **Functional knowledge —** only when a **050-functional-knowledge** (or equivalent) rule **clearly** applies—state the rule theme in plain English;  
- **Other —** at most when naming a **contradiction between two sources above** (say both).
- **Holistic “Possible missing stories” table** — each suggested row must trace to **(a)** patterns across **this run’s** in-scope Jira Story text (summaries/descriptions), **(b)** **Epic-level notes** / **Top 5 gaps** already written for the page, and/or **(c)** PRD/initiative scope **only** when the PM made it available without treating an external doc as auto-fetched SoT (Jira **Notes** PRD link, user attachment, or repo PRD path named in the prompt—see [`SKILL.md`](SKILL.md) “Do **not** auto-resolve external PRDs”). **Do not** invent PRD requirements you did not read.

**Do not** add persona “pressure,” Verdict drama, or BDD scenarios **solely** to fill cells, hit a scenario count, or inflate gap tension.

**Verdict:** **Finding** must restate only what the row’s evidence actually showed. **Recommended next step** must be a **real** next action when a gap exists; when lenses align and Jira is already strong, the second bullet may honestly say e.g. **“No material gap surfaced in this pass—keep Jira scenarios as source of truth unless new risks appear.”** Do not invent a meeting or spike “for show.”

**BDD:** Prefer **fewer** scenarios when Jira coverage is already strong and lenses agree (**0–2** blocks, or a single `<p>` stating **no suggested missing BDD** for this pass). **Never pad** toward the hard cap of **4**. Each block still traces to a row-level gap when present (see **Suggested missing BDD — specificity, uniqueness, follow-on**). When the **published** **PM sentence** includes a WhatsApp signal via **parenthetical** (`HRREC-…`) **or** `[WhatsApp companion: HRREC-nnnnn]`, **at most one** scenario block may **primarily** close that **email translation question** (still recruiter/admin/candidate language; no channel-parity assumptions). **Prioritisation while drafting column 7:** use PM / QA / **Dev lens** tension and Jira parse to decide **which** missing scenarios to write; **Gap Likelihood** is still assigned **only** from **Verdict + BDD** after column 7 exists (**Gap likelihood — per story (Verdict + BDD)**).

## Gap column (2) — Gap Likelihood (live and draft HTML)

The second table column is **Gap Likelihood** — an **ordinal** read on how much **refinement or spiking** is prudent **before** sizing/build for this story, shown as a coloured Confluence **Status** lozenge (**no percentages**).

| Mode | `<th>` | Cell contents | Where the "why" lives |
|------|--------|---------------|------------------------|
| **Tier A / Tier B live** (`/user-story-gap-review` with MCP) | **Gap Likelihood** | Confluence **Status** macro (`ac:structured-macro ac:name="status"` with `ac:schema-version="1"`) and `ac:parameter` **`title`** = **Very High** / **High** / **Medium** / **Low** / **Very Low**; **`colour`** = **Red** / **Yellow** / **Blue** / **Green** / **Grey** respectively (see **Status macro — title and colour** below). Optional: one short `<p>` **after** the macro summarising **Verdict + suggested BDD posture only** (e.g. "Blocker-class Finding; three missing scenarios")—**do not** replay PM vs QA vs **Dev lens** line-by-line in this cell. | **Verdict** and **Suggested missing BDD** (column **7**), per **Gap likelihood — per story (Verdict + BDD)**. PM / QA / **Dev lens** inform those outputs but are **not** scored against each other for the lozenge. |
| **Draft / replay HTML** (`build_gap_review_82977_tier_b_*.py`, `generate_gap_review_page_82977.py`, etc.) | **Gap Likelihood** | Same **Status** macro pattern when possible. If the formatter emits labels **without** real Verdict+BDD judgment for that row, disclose **draft replay** in the preface and treat badges as **layout / dedup-test aids** unless the pipeline applies the same rubric. |

### Status macro — title and colour

Example Storage fragment:

```html
<ac:structured-macro ac:name="status" ac:schema-version="1">
  <ac:parameter ac:name="title">Medium</ac:parameter>
  <ac:parameter ac:name="colour">Blue</ac:parameter>
</ac:structured-macro>
```

**Mapping (label → colour):** **Very High** → Red; **High** → Yellow; **Medium** → Blue; **Low** → Green; **Very Low** → Grey.

### Repo formatters — honest disclaimer

Scripts such as [`docs/initiatives/two-way-email/drafts/build_gap_review_82977_tier_b_2026-05-15.py`](../../../docs/initiatives/two-way-email/drafts/build_gap_review_82977_tier_b_2026-05-15.py) may use internal `gap_pct` (bucket plus key-stable jitter) **only** to pick a Status label for **HTML size or dedup experiments**. That is **not** the judgment rubric in **Gap likelihood — per story (Verdict + BDD)** unless the script is updated to consume emitted **Verdict** and column **7** text.

**Forbidden for live runs:** picking the lozenge from **hash(key)**, PRNG, modulo-of-ticket, ticket-number bands, or "how tense the three lenses read side by side" **without** that posture being **reflected in Verdict and/or suggested missing BDD** for that row.

## Gap likelihood — per story (Verdict + BDD)

**Assign column 2 last:** finish **Verdict** (two sentences) and **Suggested missing BDD** (column **7**) for the row, then choose **Gap Likelihood** from **only** those outputs (judgment; **no** percentages).

**Substantive missing BDD (count for this rubric):** each distinct block that includes a **`<strong>Scenario:</strong>`** title **or** an explicit **Given / When / Then** triad counts toward the count. Treat a single `<p>No additional BDD suggested …</p>` (or equivalent one-liner) as **0**. Treat a **`Blocked until AC exists`** (or thin-spec blocked framing with candidate GWT) as **≥1** block.

**Bands (ordinal):**

- **Very Low** — **Recommended next step** honestly signals **no material gap** / keep Jira as source of truth (or equivalent), **and** **0** substantive missing BDD.
- **Low** — Minor polish or a **small** alignment tweak in **Verdict** **and** **0** substantive BDD; **or** **1** very narrow clarifier scenario with a non-blocker **Finding**.
- **Medium** — **One** concrete follow-up in **Verdict** (refinement, OE/copy alignment, short decision) **or** exactly **1** substantive missing BDD **or** a modest **Finding** plus **1** scenario.
- **High** — **Finding** states a **clear material gap** (thin-spec beyond a single unknown, dependency, security/merge risk, documentation void) **and** **Recommended next step** is non-trivial **or** **2** substantive missing BDD blocks.
- **Very High** — **Finding** reads **blocker-class** (cannot size/build safely without spike or major decision memo) **or** **≥3** substantive missing BDD blocks **or** **`Blocked until AC exists`**-style framing **plus** a blocker-level **Finding**.

When **thin-spec** triggers, **Verdict** and column **7** usually surface high refinement need—**Very High** / **High** are common **when** those cells say so; do **not** map thin-spec to a lozenge without reading **Verdict** and BDD first.

**Drafting column 7:** you **may** still use PM / QA / **Dev lens** tension and Jira parse to **choose** which scenarios to add; **Gap Likelihood** itself must **not** be chosen by re-scoring the three persona columns in isolation.

## Confluence HTML table skeleton

**Prefer Storage-format-friendly HTML for any multi-column gap table.** Markdown is accepted by `create_confluence_page` / `smart_update_confluence_page` and converted, but **Markdown pipe (`|`) tables often land as plain text** in Confluence (literal pipe rows instead of a rendered grid). For gap reviews meant to be read as a table, **use the HTML skeleton below** and publish with `smart_update_confluence_page` **`mode: "replace"`** when the full body fits in one call. Chunk only when transport or MCP timeouts force it—and **still ship HTML `<tr>` rows**, not Markdown pipe tables.

```html
<table>
  <thead>
    <tr>
      <th>Story</th>
      <th>Gap Likelihood</th>
      <th>PM lens</th>
      <th>QA lens</th>
      <th>Dev lens</th>
      <th>Verdict</th>
      <th>Suggested missing BDD (Given/When/Then)</th>
    </tr>
  </thead>
  <tbody>
    <!-- one <tr> per story -->
  </tbody>
</table>
```

**Live skill (default):** use **Gap Likelihood** in the header and the **Status** macro pattern in each body cell (**Gap likelihood — per story (Verdict + BDD)**), assigned **after** **Verdict** and **Suggested missing BDD** for that row. **Draft replay HTML** must use the same header unless the page is explicitly a legacy excerpt; disclose formatter-only badges in the preface (**Gap column (2)**).

### Column cell patterns

| Column | Pattern |
|--------|---------|
| **Story** | Prefer `<tr><!-- gap-review KEY --><td>…` so chunk retries can use `dedupeMarker`. `<a href="https://jira2.workday.com/browse/KEY">KEY</a>` + `<br/>` + one-line summary (escape `&` as `&amp;` in HTML if not using Markdown). |
| **Gap Likelihood** (Tier A / Tier B **live** and draft HTML) | Confluence **Status** macro per **Gap column (2)** (**title** + **colour**). Optional one short `<p>` summarising **Verdict + BDD posture only**. See **Gap likelihood — per story (Verdict + BDD)**. |
| **PM lens** | One sentence (two maximum). Synthesized conclusion from ingested story text **plus** KB + DA + functional knowledge + epic scan + optional PRD + optional companion evidence; **do not** append `[Jira]` (ingest is implied). **After each sentence (or clause),** append whitelist bracket citations per **Inline source citations** (e.g. `[Functional knowledge: …; Salomon; DA]`). If a WhatsApp cross-channel signal applies, include `[WhatsApp companion: HRREC-nnnnn]` and/or legacy parenthetical prose **only** if the row still reads cleanly—**never** legacy `Cross-channel (WhatsApp backlog) —` starters. Plain English — recruiter/admin/candidate wording. |
| **QA lens** | One sentence (two maximum). What could break or is untestable for this specific story. Synthesized from Jira + functional knowledge + conditional Salomon Jira / Slack. **Bracket citations** per **Inline source citations** (e.g. `[Jira]`, `[Salomon Jira; Salomon Slack]` when WhatsApp match TRUE). No legacy em-dash tag starters. Lead with what a recruiter or candidate would notice. |
| **Dev lens** | One sentence (two maximum). What to ask engineering before sizing or building. Include **`[XO MCP]`** for every row where XO ran; add **`[Peanut]`** when WhatsApp match TRUE (invoked or honest skip/failure in prose without banned `Peanut —` strings); add **`[Salomon]`** only when **Dev lens — KB backfill when XO is weak (narrow)** applies. Other sources (`[DA]`, `[Jira]`) only when that clause truly rested on them—usually omit from Dev. No legacy em-dash tag starters. |
| **Verdict** | **Severity label** on its own line (per **Verdict column**), then exactly **two** bullets: `<li><strong>Finding:</strong> …</li><li><strong>Recommended next step:</strong> …</li>` — **one sentence each**, TL;DR for a non-technical PM. |
| **Suggested missing BDD (Given/When/Then)** | **0–4** scenario blocks per story (**hard cap 4**; **do not pad**—use **0–2** or a single “no additional BDD suggested” line when Jira is already strong and lenses agree; see **Evidence grounding — no fabrication**). When present, each block: short title (`<p><strong>Scenario: …</strong></p>`) then **labelled** steps: `<strong>Given</strong> …<br/><strong>When</strong> …<br/><strong>Then</strong> …` (Storage HTML). **Compact / chunked publish:** still use those three bold labels when scenarios exist—do not replace with “add GWT” prose bullets. Every scenario must **trace** to something in the **same row** (PM/QA/**Dev lens** text, **Verdict**, a WhatsApp **parenthetical** or `[WhatsApp companion: HRREC-nnnnn]` citation in the **published** PM sentence when present, or the same tension captured in **Verdict** / PM–QA)—**no** generic boilerplate. Prefer recruiter- or admin-facing actors in plain English. **Prioritisation:** address contradictions or open questions named in **Verdict** first, then the strongest lens-backed gap not yet covered. **Coverage hooks** (only when they appear in that row’s merged evidence): negative paths, tenancy (admin toggle, purge, template override), notification vs **My Conversations**, agency vs non-agency, attachment/size limits and server parity—not a laundry list copied from the epic. For **parse-first**, **banned placeholders**, **row uniqueness**, **actor/When precision**, and **dry-run** checks, see **Suggested missing BDD — specificity, uniqueness, follow-on** below. |

### Lens column brevity (mandatory)

Keep each row’s PM / QA / **Dev lens** cells short enough that a non-technical PM can skim the table. Caps are **per story row** (Storage `<li>` count); they do **not** relax evidence rules—merge weak bullets rather than inventing extra ones. Epic-wide themes belong in **Executive summary** / **Epic-level notes**, not repeated as long lists in every row.

| Mode | PM lens | QA lens | Dev lens |
|------|---------|---------|----------|
| **Tier A** | 1 sentence (2 max for complex stories) | 1 sentence (2 max) | 1 sentence (2 max) |
| **Tier B** | 1 sentence | 1 sentence | 1 sentence |
| **Thin-spec rows** | 1 sentence — state spec is insufficient and name the top open question | 1 sentence — state what is untestable until spec exists | 1 sentence — state what engineering cannot confirm without AC |

**Single-sentence discipline:** The published prose is a synthesized conclusion for a non-technical PM, not a log of tool calls. **Bracket citations** (on **PM:** `[Functional knowledge: …]`, `[Salomon]`, `[DA]`, …; on **QA:** `[Jira]` when applicable, `[Salomon Jira]`, …) are **short traceability suffixes**, not pasted MCP output—keep them within the **citation budget** in **Inline source citations**. If a lens cell reads like raw tool output (lists of hits, JQL, corpus metadata, or legacy `Tag —` lines), rewrite before publish.

**Do not** use these caps to justify **identical** short text on many sibling keys—that still violates **Story-specificity** and **Tier B — Salomon / Deployment Agent sentence reuse cap**. If a lens has nothing material to add after honest evidence, use fewer bullets.

## Possible missing stories (holistic suggestions)

After the **seven-column** gap table, add a **second** Storage HTML table for backlog slices that a holistic read suggests **may** be missing—**not** a substitute for per-row **Suggested missing BDD**, and **not** new Jira work created by the skill.

### When to include

| Situation | Action |
|-----------|--------|
| **Epic or coherent JQL** (single epic / clear initiative scope) | Include `h2` **Possible missing stories (suggestions only)** + three-column table (see skeleton below). |
| **Loose JQL bag** (no shared epic) | **Omit** the `h2` + table; one `<p>` under the main table explaining omission (see **Page structure** item **5**). |

### Content rules

- **User Story column:** Proposed **one-line** “As a … I want … so that …” or equivalent **user-facing slice title**—**not** a fake `HRREC-` key; do not label suggestions as existing Jira issues.
- **Reason why this may be missing:** Plain-language gap vs **the set of in-scope Stories + epic narrative** (and PRD when loaded); you may cite **adjacent** existing keys (“not clearly owned by HRREC-91975 …”) but do not duplicate that ticket’s column-7 BDD as the whole row.
- **BDD scenarios column:** Same Storage HTML style as main table column **7** (`<strong>Given</strong>` / **When** / **Then** on `<p>` lines with `<br/>`; **0–3** scenario blocks per row; **hard cap 3**—do not pad). **No** duplicate **Given + When** pairs across holistic rows (same uniqueness discipline as **Suggested missing BDD — specificity**).
- **Row count:** Default **3–8** holistic rows unless the user asks for a wider brainstorm; **Tier B** may ship **fewer** (≥0) with an honest lead line when timeboxed.
- **Anti-boilerplate:** The **exact same** **Reason** paragraph (after trim) may appear on **at most two** holistic rows; from the third onward, **rewrite** or merge. No rotating **tiny pools** of identical BDD blocks across rows (see **090** row-wise formatter guidance in the workspace).

### PRD and initiative scope

Do **not** auto-fetch external PRDs (Google Docs, etc.). Use a linked PRD in Jira **Notes**, a **user-attached** excerpt, or an **explicit repo path** in the prompt (e.g. initiative PRD under `docs/prds/` when the user scoped 013). If none: lead paragraph states **Jira-holistic only**.

### HTML skeleton (three columns)

Wrap the table for tooling / optional dedup scripts:

```html
<h2>Possible missing stories (suggestions only)</h2>
<p>…lead: suggestions only; no Jira creation; PRD loaded or Jira-holistic only…</p>
<!-- possible-missing-stories-table -->
<table>
  <thead>
    <tr>
      <th>User Story</th>
      <th>Reason Why This May Be Missing</th>
      <th>BDD scenarios</th>
    </tr>
  </thead>
  <tbody>
    <!-- possible-missing-story-row 1 -->
    <tr>
      <td>…</td>
      <td>…</td>
      <td>…</td>
    </tr>
  </tbody>
</table>
```

## Thin-spec gate

Before inventing detailed gaps, evaluate Jira **description + acceptance criteria** (and summary).

**Mark the row as “Insufficient spec — human input required”** in PM/QA cells (and restrict gap bullets to high-level questions only) when **any** of:

1. Combined description + acceptance text **&lt; 400 characters** (after stripping boilerplate headers), **or**
2. Fewer than **2** distinct scenario / acceptance bullets (lines starting with `-`, `*`, `1.`, or headings like `Scenario`, `AC`, `Given`), **or**
3. The story is explicitly a **placeholder** / **TBD** / **draft** in summary or description.

When thin-spec triggers, still run Salomon / **Dev lens (XO + Peanut only when triggers apply)** / DA with **narrow** queries, but label **PM/QA** cells accordingly and do not fabricate edge cases. **Gap Likelihood** for thin-spec rows usually lands **High** or **Very High** once **Verdict** and column **7** honestly reflect the placeholder—still assign the lozenge **after** those cells exist (**Gap likelihood — per story (Verdict + BDD)**).

**Suggested missing BDD** when thin-spec triggers: do **not** build elaborate GWT trees. At most **1–2** high-level scenarios, or a single block that states **Blocked until AC exists** with **candidate** Given/When/Then framing only (what refinement must decide before scenarios become testable).

## Suggested missing BDD — specificity, uniqueness, follow-on

Column 7 is **additive** to Jira: it extends, sharpens, or names **missing** paths relative to what is already written — **not** a generic re-statement of the whole story in meta-language.

| Rule | Guidance |
|------|----------|
| **Parse first** | Before writing column 7, extract from the Jira description (wiki/Gherkin, `h2. Scenarios`, `*Given*`, numbered AC) the **existing** scenario titles and count. If **≥1** scenario exists, the **first** suggested block must either (1) **extend** the last written scenario with a new **And**-style edge in plain English, or (2) be explicitly labelled **“Additional scenario (not in Jira yet)”** and reference **which** gap or open question it closes — **not** a second full duplicate happy path alongside Jira’s Scenario 1. |
| **Follow-on to existing Jira scenarios** | Prefer titles or lead-in lines such as **“Beyond Scenario N in Jira: …”** or **“Negative path not covered by Scenarios 1–3: …”** so readers see what is **new** vs what Jira already owns. |
| **Banned placeholders** | Do **not** use: “main success action,” “where relevant,” or “correct security domains” **without** naming the domains, toggles, or controls **as in Jira** (or **TBD** only when thin-spec applies and you label the row accordingly). |
| **Actor precision** | One **primary** actor per scenario; avoid “recruiter or admin” unless the story **explicitly** dual-actors. |
| **When clause** | Must name a **single** trigger: a concrete user action or system event implied by the **summary** or an existing scenario title (e.g. “I click **Send** on a draft at the 7MB boundary,” “I open the 2-way email task when no thread exists”) — not “I perform the action described in Jira.” |
| **Then clause** | Observable outcome: UI state, message or error copy, absence of a control, notification routing — not vague “matches intent” without pointing to what a recruiter or admin **sees**. |
| **Uniqueness (epic sweeps)** | **No** identical **Given + When** pair on two different story keys; if two siblings would converge, differentiate by **surface + trigger** from each summary (compose vs send vs purge vs notification). |
| **Second+ scenarios** | Each additional block maps to **one** of: **Verdict** (Finding / recommended gap), PM–QA disagreement, **Dev lens** gap (e.g. XO not found, Peanut signals misaligned with Jira), DA misconfiguration theme, or—when the companion step ran—a WhatsApp **parenthetical** or `[WhatsApp companion: …]` citation in the **published** PM sentence’s **email translation question** (**at most one** such companion-led block per row). **State that mapping** in the scenario title or first **Given** line. |
| **No padding** | If Jira scenarios and lenses already cover the risk, output **no** extra BDD or a single explicit “none suggested this pass” line—do **not** add scenarios to fill white space. |

**Cross-channel companion (column 7, when step 2b ran):** If the **published** **PM sentence** includes a WhatsApp **parenthetical** (`HRREC-…`) **or** `[WhatsApp companion: HRREC-nnnnn]`, you may add **up to one** **GWT** block whose scenario title or first **Given** names the **email-side** behaviour that closes the **translation question** (e.g. “Cross-channel follow-on (email): …”). Do **not** paste or lightly reword the companion **`h2`** theme list on every row; skip this block when Jira + lenses already cover the same gap.

**Initiative vocabulary (HRREC-82977 and similar):** keep surfaces and actors aligned with [`docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md`](../../../docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md) (e.g. **SSP**, **2-way email task**, **Message Builder**, **privacy admin**) so **When** clauses stay product-accurate.

**Cross-link — Jira hardening after gap review:** run **430 / 435** manually when promoting column 7 into formal Jira Scenarios; this skill does not auto-chain those rules.

## Net-new preamble (Salomon)

**Salomon Internal Knowledge — future-state framing (mandatory):** All `search_workday_internal_knowledge` queries for this skill must be framed as future-state gap-finding, not current-state lookup. Salomon knows current Workday functionality. Its value in this skill is as an advisor: given what it knows about how things work today, what might be missing, risky, or underdefined in the proposed future scenarios?

Query preamble pattern:

> `NET-NEW / PRE-BUILD GAP REVIEW. Story KEY: [key]. Summary: [summary]. These are the proposed future-state scenarios: [scenario titles or AC]. Given how [this feature area] currently works in Workday, what aspects of these scenarios might be underdefined, missing, or risky? We are not asking what currently exists — we are asking what the future state might be getting wrong.`

Then the actual keywords. Run **2–3** queries per story:

1. Feature + workflow terms from summary/description.
2. Compliance / privacy / retention / email / notification patterns if the story touches outbound comms or candidate data.
3. One query merged from **user prompt extras** (similar epic, URLs, “like HRREC-nnnn”).

**Salomon Jira index — conditional, WhatsApp keys only:** `jira_search_tool` runs ONLY when WhatsApp match flag is TRUE. Query target: the WhatsApp Jira keys cited in the PM sentence (e.g. `key in (HRREC-nnnnn, HRREC-mmmmm)`). Purpose: find failure modes from those WhatsApp issues that might translate to this email story. Do NOT run a general JQL against the story's own summary terms in this lens.

**Salomon Slack — conditional, WhatsApp keys only:** `slack_archive_search` runs ONLY when WhatsApp match flag is TRUE. Query using quoted WhatsApp Jira keys cited in the PM sentence. Purpose: surface discussion threads about those WhatsApp issues that might reveal relevant failure patterns. Do NOT search against the story's own summary terms here.

**Output contract:** Salomon Internal Knowledge results are **not** a separate Confluence column. Write product-side precedent into **PM** bullets as **Salomon (Knowledge) —**. Conditional Jira index / Slack hits (when the flag is TRUE) weave into **QA** as **Salomon (Jira index) —** / **Salomon (Slack) —** (see **Salomon and DA — no separate Confluence columns** above).

**Empty hits:** record as absence of precedent — **not** “low risk”—fold that honest absence into **PM** for Internal Knowledge, or into **QA** only when conditional tools ran and returned nothing useful.

**Off-topic hits:** if retrieved articles are clearly **not** about this story’s slice (wrong product area, generic tooling, unrelated workflows), do **not** weave them in for colour—either run **one** additional **narrower** query with the same future-state preamble and tighter keywords tied to **that** `KEY`, or write **`Salomon —`** Internal search did not return on-topic precedent for this slice (and one short clause on what you still watch for in QA). **Tier A** still needs traceable Internal Knowledge use per **From-scratch** item 3(b); “noise pasted as precedent” violates **Evidence grounding — no fabrication**.

## Net-new preamble (Deployment Agent)

`ask_deployment_agent` questions must use future-state framing. Deployment Agent knows current tenant configuration and product behaviour. Its value in this skill is advisory: given how tenants currently configure and operate this area, what might be missing or risky in the proposed future scenarios?

Query pattern:

> `NET-NEW story review for Recruiting. Story summary: [summary]. These are the proposed future-state scenarios: [scenario titles or AC]. Given how tenants currently configure [this area] in Workday Recruiting, what might be underdefined, missing, or risky in these scenarios? We are not asking how this currently works — we are asking what the future state might be getting wrong or leaving unaddressed for typical tenant configurations.`

Ask one consolidated question per story unless the answer is unusably short; then one short follow-up with `threadId` is allowed. **Synthesize answers into PM/QA cells** (product/config → PM; operational test realism → QA)—no separate DA column.

**Deployment Agent — batched answers, row-anchored synthesis:** A **single** `ask_deployment_agent` call covering many stories is allowed (especially under **Tier B**). **Each** row’s **Deployment Agent —** bullet must still **anchor to that key**: start with **For KEY (*summary phrase*):** or weave the story’s summary noun phrase in the **first clause**, then apply **one** concrete implication from the batch answer (tenant setup, staging, misconfiguration, limits, “how customers run Recruiting”). **Do not** paste the **same** unmodified DA paragraph on every row—that violates **distinct treatment in synthesis** (From-scratch item 3(c)).

## Net-new preamble (XO MCP)

**XO MCP — implementation area search (always run):** For each story, search XO for the area of the codebase where this story is likely to be implemented. Use summary nouns, feature area terms, and any class/service names visible in the Jira description to locate the relevant code region.

Goal: identify existing patterns, hooks, constraints, or service boundaries in that implementation area that the current story scenarios may not account for. This is not generic adjacency checking — it is targeted implementation context to inform what might be missing from the scenarios.

Opening framing for XO search (internal notes):

> `XO IMPLEMENTATION AREA SEARCH — read only. Story KEY: [key]. Looking for the implementation region for: [summary nouns]. Goal: find existing patterns or constraints in that area that current scenarios may not cover.`

If the implementation area cannot be located after 2 search attempts, state that honestly in the Dev sentence: "Could not locate the implementation area in XO for [search terms] — engineering should confirm where this will be built and whether existing patterns apply."

Read-only: use `search` with prefixes from story text (`cl:`, `ws:`, or general name). Optionally `hopper_search` or `service_description_get` when the story names a REST/integration surface — **read paths only**; no `suv_rest_call`, `method_binding_execute`, patches, or writes.

**Global XO MCP outage (session-wide):** If **every** `search` call for in-scope rows fails with the **same class of error** (e.g. MCP transport, HTTP 401/403/5xx, “Request error” from the client), treat that as **one infrastructure incident**, not evidence that each story’s implementation area is missing from the SUV. **Mandatory:** add preface item **(3)** per **Page structure** so PMs do not misread uniform Dev-lens fallbacks as per-key XO negatives. In **Epic-level notes**, you may add one bullet naming suspected causes (JWT/SUV host/VPN/upstream) **only** if you verified them in-session—otherwise keep the preface factual (“XO MCP did not return metadata this session”). Per-row **Dev lens** must still follow **Story-specificity** (global-outage exception): short shared “XO unavailable” clause + **distinct** story-keyed question for engineering.

## Net-new preamble (Peanut MCP)

Read-only (`user-peanut-mcp`). Frame **pre-build product risk**, not production break-fix triage—same spirit as Salomon/XO preambles.

**Per-row 2WE Peanut is not required for Tier A completeness** when WhatsApp match flag is FALSE for this row: an honest **`Peanut — Not queried — …`** line satisfies the contract. **High-value Peanut** for cross-initiative / git-level comparison stays the **Companion Peanut anchor pass** (opt-in, **3–8** WhatsApp keys)—see **Companion Peanut anchor pass** below and [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Optional Peanut**.

### When to invoke Peanut (2WE per-row)

**Default:** do **not** call **`collectBugData`** or **`searchCode`** for that story row. **`collectBugData`** pulls Jira context + similar issues + commit history; it needs a **successful Jira fetch** for the ticket you pass. A **Jira fetch error** / **`needsConfig`** means **MCP integration or credentials** (`~/.peanut/config.json`, **`JIRA_TOKEN`**, host, permissions)—**not** “engineering has not started yet” or “no commits exist.” Fix config once; do **not** paste the same **Unavailable** boilerplate on every row after a known outage.

**Invoke Peanut when (and only when):** WhatsApp match flag is TRUE for this row (PM lens identified a relevant WhatsApp pattern and included a cited `HRREC-…` key in **parenthetical** or **`[WhatsApp companion: …]`** form). When triggered, run **`collectBugData`** against the WhatsApp Jira keys cited in the PM sentence — NOT the story's own Jira key. Cap: **1–2** read-only calls per row. Paraphrase findings into the Dev sentence as a plain-English question for engineering.

**Do not invoke Peanut when:** WhatsApp match flag is FALSE for this row, regardless of other signals. Under **Tier B**, default no Peanut unless the user explicitly widens scope.

### Peanut — taxonomy (gap review)

Every in-scope **2WE** row must include **exactly one** readable pattern inside **`Peanut —`** (or the first **`Peanut —`** bullet) so operators can tell **skip** from **tool failure** from **ran**:

| Pattern | When |
|--------|------|
| **`Peanut — Not queried — …`** | WhatsApp match flag FALSE for this row; or **Tier B** default skip. |
| **`Peanut — Unavailable (<one line>)`** | Tool ran or MCP returned **`needsConfig`**, Jira fetch error, timeout—**not** the same as “not queried.” Note once in **chat** how to fix (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Operator preflight**). |
| **`Peanut — Ran — no useful signal …`** | Peanut returned empty / no similar issues / no relevant commits after an honest attempt. |
| **`Peanut —`** (narrative signal) | Paraphrase similar issues or code-area risk **for this row**—see **`SKILL.md`** **Dev lens evidence**. |

**Never** paste secrets or long raw diffs into Confluence—**paraphrase** into **`Peanut —`** bullets inside the **Dev lens** column.

Opening line pattern (internal notes or tool framing, **only when invoking**):

> `NET-NEW / PRE-BUILD GAP REVIEW — PEANUT (read-only). Cited WhatsApp KEY(s): … We need whether similar Jiras or recent code changes touch those issues—not full RCA.`

When invoking, prefer **`collectBugData`** with each **cited WhatsApp `jiraTicket`** from the PM parenthetical or **`[WhatsApp companion: …]`** bracket (cap **1–2** calls per row) and/or **`searchCode`** with a **small `searchPlanJson`** derived from those issues if justified.

**Companion Peanut anchor pass (WhatsApp only):** Use a distinct opener so outputs land in **`h3` Code evidence (WhatsApp anchors—Peanut)** per [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) (**Optional Peanut** + **Forbidden** lists there), not inside **2WE** **Dev lens** rows unless the user also asked for per-row 2WE Peanut:

> `COMPANION ANCHOR — WHATSAPP PATTERN VS 2WE PARITY (read-only Peanut). Anchor KEY: … We need commit/file signals in configured megaleo repos for translation to email— not full RCA.`

Each anchor key still gets a **unique** one- or two-sentence summary in the **`h3`** block—**no** duplicated prose across anchors (**Forbidden** list in the annex).

## Publish pipeline (Confluence MCP)

Use this **before** the first `smart_update_confluence_page` so you do not burn a bad `replace` or hit read/MCP size limits.

1. **Assemble Storage HTML** (executive summary + epic notes + main **seven-column** `<table>…</table>` + **Possible missing stories** holistic table when applicable per **Page structure** / **Possible missing stories (holistic suggestions)**) to a **file on disk** first when possible—do not depend on loading a 100k+ char body through a single read tool window.
2. **Pre-flight size:** Measure UTF-8 **bytes** or characters of the full `content` (e.g. `wc -c` on the file, or `len(html)` in a script). Treat **~90 000 characters** as a conservative single-call ceiling for `content` (below common agent/MCP truncation). **Include both tables** in the measurement.
3. **Preferred path:** One `smart_update_confluence_page` with **`mode: "replace"`** for the entire body (preamble + main gap table + holistic table or omission `<p>`).
4. **Chunked fallback:** If over threshold or the call times out: split into payloads (e.g. first chunk = `replace` with preamble + first `<tbody>` slice of the **main** table + `</table>` + holistic `h2`/table if it fits; later chunks = `append` with continuation heading + mini-table of additional `<tr>`s). **Emit each main story row with** `<!-- gap-review KEY -->` **inside the `<tr>`** (start of row) so operators can use `dedupeMarker` on partial reruns and spot duplicates. For holistic rows, use `<!-- possible-missing-story-row N -->`. **Never** run **parallel** `smart_update_confluence_page` calls—apply chunks **strictly in order** (chunk 0 `replace`, then chunk 1, 2, … `append`) so “Stories (continued …)” sections stay ordered.
5. **No placeholder replace on production rolling pages:** Do not `replace` the live rolling page with “test” or empty content to verify MCP—validate against a scratch `pageId`, local file only, or the first real `replace` payload.
6. **Optional consolidation:** If append produced multiple physical tables, a follow-up pass may merge to one table—only when the PM asks; otherwise continuation tables are acceptable **if** headings show story index ranges (see **Batching and chunking**).

## Batching and chunking

- **Soft cap:** warn in chat when **&gt; 12** stories; suggest splitting by epic or sprint.
- **Confluence (default):** one **Storage HTML** seven-column table for the full inventory when possible (single `replace` body: preamble + rollup + `<table>…</table>`), then the **Possible missing stories** table (or omission `<p>`) per **Page structure**. **Do not rely on Markdown pipe tables** for either grid—they often fail to render as tables (see HTML skeletons above).
- **Seven columns and payload size:** the **Suggested missing BDD** column widens each row. If MCP timeouts recur, use **smaller append chunks** (fewer rows per chunk), **shorter** BDD in a “compact” publish pass, or Confluence REST with an adequate client timeout—do not drop the column. **Verdict** stays two short bullets even in compact mode.
- **Confluence (chunked fallback only):** if the page body is too large for one MCP call or hits client timeouts, append in chunks of **3–4** rows using `smart_update_confluence_page` with `mode: "append"` (or `append_after_heading` with a per-batch `heading` like `Batch 2 — stories 5–8`). **Embed** `<!-- gap-review KEY -->` at the start of each `<tr>`; when re-appending a fixed slice, pass **`dedupeMarker`** matching that comment for that `KEY` so `smart_update_confluence_page` can skip duplicates. Prefer **splitting the HTML file** (see **Publish pipeline**) over switching to Markdown pipe tables.
- **Chat:** mirror the table in messages; for large batches send **one table per chunk** plus a short chat recap of **Top 5 gaps** / **Top 5 strengths** (and link)—not a dump of every row.

## Sub-agents — policy

- **Inline (default):** the invoking agent holds full context for epic coherence, **Gap Likelihood** assignment, and a single Confluence replace.
- **Parallel evidence (optional, large sets):** when story count is **high (≈18+)** or MCP latency dominates, spawn **`Task` / `generalPurpose`** subagents (or run inline) to gather **per-key evidence** (Jira text snippets + Salomon + DA + **Dev lens** notes: XO + Peanut **only when triggers** in **Net-new preamble (Peanut MCP)**) in **JSON or structured markdown**—subagents must have **`call_mcp_tool`**. **Do not** use **`subagent_type: shell`** for evidence that requires MCP (those sessions cannot call Confluence/Jira/Salomon). The parent **only** merges into **PM/QA/Dev lens** narrative (Salomon/DA never as separate columns), applies thin-spec, drafts **Verdict** and **Suggested missing BDD** per row from that merged evidence, assigns **Gap Likelihood** (column **2**) **after** those two columns per **Gap likelihood — per story (Verdict + BDD)**, writes epic notes, drafts the **Possible missing stories** holistic table per **Possible missing stories (holistic suggestions)**, and publishes **one** HTML page (or **sequential** chunked writes per **Publish pipeline**). **Avoid parallel Confluence writes**—always sequential chunk order.
- **Deep XO (`@xo-developer`):** only if the user explicitly says **“deep XO”** / **“implementation spike”** — spawn a **Task** subagent with story key + summary + XO search results; read-only structural opinion (bindings, extension points). **No apply/diff** unless the user also invokes the xo-builder skill workflow with HITL.

## Optional red team (`@080-red-team`)

Only when the user **attaches** a PRD, story map, or detailed spec **in addition** to Jira. Otherwise the cynical QA persona stays **inline** in the QA lens column; do not invoke **080** by default.

## Optional follow-up (not v1)

- **430 / 435** story-quality rules may be run manually after this skill to tighten wording — not auto-chained here.

## Dry-run operator checklist

1. Pick one child story under a known epic (e.g. HRREC epic from team backlog).
2. Run the skill from chat with that key; confirm `getTicketDetails` returns description.
3. Confirm Salomon returns either usable precedent/bug hints **or** explicit absence—and that absence appears in the **synthesised** PM/QA **published** sentences (or is honestly folded into narrative per **Evidence grounding**).
4. Confirm DA was asked and useful realism appears in **PM** (not an empty column).
5. Confirm XO `search` was attempted and **internal** **`XO MCP —`** notes support the **published** **Dev lens** sentence; when **every** in-scope `search` failed, confirm **Page structure** preface item **(3) Global XO MCP outage** is present. confirm **`Peanut —`** follows **Peanut — taxonomy (gap review)** (**Not queried** vs **Unavailable** vs **Ran**) while authoring—**most** rows should **not** be **`collectBugData`** unless triggers in **When to invoke Peanut (2WE per-row)** applied; repeated **Unavailable** across the grid usually means fix Peanut/Jira config, not rerun blindly. **Published** Dev cells must **not** surface banned taxonomy strings (see **Output format contract** in [`SKILL.md`](SKILL.md)).
6. Confirm Confluence page exists or updated; open via `scripts/open-url-chrome-and-cursor-browser.sh` with the final URL.
7. Spot-check HTML: **Executive summary** follows [`reference.md`](reference.md) **Page structure**—`h2` **Executive summary (for PM)** with optional **preface** (≤2 items, or ≤3 when **Global XO MCP outage** item **(3)** applies—see **Page structure**), then **`h3` Top 5 gaps (epic)** and **`h3` Top 5 strengths (epic)** (≤5 bullets each; gaps before strengths; no padding); then **`h2` Epic-level notes** when applicable; then **when the companion cross-scan ran**, **`h2` Cross-initiative pattern hints (WhatsApp — inspiration only)** before the main table (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)). Then the **seven-column** gap table; then **`h2` Possible missing stories (suggestions only)** with a **three-column** holistic table when epic-scoped (or the omission `<p>` when loose JQL—see **Possible missing stories (holistic suggestions)**). **Seven** columns in the main gap table (Story; column **2** = **Gap Likelihood**—see **Gap column (2)**; PM; QA; **Dev lens**; **Verdict**; **Suggested missing BDD**); holistic table has **User Story**, **Reason Why This May Be Missing**, **BDD scenarios**—**no** fake `HRREC-` keys in the User Story column; **AG:** / **RN:** keys absent from the main table; no placeholder-only prose where thin-spec did not trigger; confirm the agent **did not** skip per-story MCP without disclosure when the user asked for a full from-scratch run. On **2–3** sample main rows, confirm **Lens column brevity** caps (**Output format contract** in [`SKILL.md`](SKILL.md): one synthesized sentence per lens per tier; **Verdict** label + two bullets). Spot-check that each row’s BDD scenarios **map** to that row’s PM/QA/**Dev lens**/**Verdict** themes (not generic epic boilerplate). On **2–3** holistic rows, confirm **Reason** + BDD are distinct from each other and from main column-7 duplicates. Confirm **Verdict** uses a **severity label** plus exactly two one-line bullets (**Finding** / **Recommended next step**), does **not** duplicate long lens lists, and **published** PM/QA/Dev cells have **no** visible source-tag starters or **banned strings** from that contract. On **2–3** sample rows, apply **PM read-aloud gate** and confirm the **published** QA sentence follows **QA lens — user-visible risk first** (no **Assert** / **Prove** / **Verify** / **Measure** / **Trace** as the first words of that sentence).
8. **BDD specificity dry-run:** across a sample of sibling keys, **no** two rows share the same **Given + When** verbatim; each **When** uses at least one **concrete** verb, control, or surface from that row’s summary, an extracted Jira scenario title, or the gap text — not banned placeholders from **Suggested missing BDD — specificity, uniqueness, follow-on** above. Where Jira already lists scenarios, confirm the first suggested block is a **follow-on** or explicitly **additional**, not a duplicate Scenario 1.
9. **Optional script — row dedup (repo):** `python3 docs/initiatives/two-way-email/drafts/check_gap_review_row_dedup.py path/to/gap_review.html` fingerprints **PM lens, QA lens, Dev lens, Verdict,** and **Suggested missing BDD** on the **main** seven-column table (truncated tag-stripped text per column); warns when **≥5** rows share the same fingerprint (override with `--threshold N`). When the file contains `<!-- possible-missing-stories-table -->`, the script also fingerprints **Reason** + **BDD scenarios** on holistic rows (see script docstring). Exit 0; use before Confluence publish or after editing a **Tier B** HTML generator. Legitimate duplicates (e.g. several keys sharing one verdict theme) still merit a quick eye—tighten the table or accept the risk explicitly. On large matrices, also run `python3 docs/initiatives/two-way-email/drafts/check_gap_review_bdd_duplicates.py path/to/gap_review.html` to flag exact duplicate **Given/When/Then** bodies and template-collapsed clusters across sibling keys.
10. **Evidence grounding:** confirm **no** **published** PM/QA/**Dev lens** cell, **Verdict** line, or BDD block asserts facts that are not traceable to Jira, Salomon, DA, XO MCP, Peanut (when invoked), **Companion Jira (WhatsApp epics)** when that cross-scan ran (**manifest-only:** snapshot manifest + **Captured excerpts** only; **live delta with snapshot:** snapshot + **`getTicketDetails`** for delta keys as documented; **full live:** paginated Story+Bug + **`getTicketDetails` bodies**; if **partial**, do **not** claim full ingestion—see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Companion partial corpus / resume**; **no** “current WhatsApp backlog” claims from **manifest-only** or incomplete **live delta**), functional knowledge, or a named cross-source contradiction (**Other —**). Empty MCP tools are stated as empty—not invented precedent.
11. **Run tier:** confirm **Tier B** runs include the **mandatory first executive-summary bullet** (see **Run tiers**); **Tier A** runs did not silently skip per-story Salomon depth unless the user opted into diff-only mode.
12. **Publish path:** confirm **Publish pipeline** was followed—pre-flight size, **sequential** Confluence chunks if used, **no** parallel `smart_update`, **no** placeholder `replace` on the live rolling page.
13. **WhatsApp companion (when step 2b ran):** Rules live in [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md). Corpus line matches the path used: **manifest-only** — **`snapshot_as_of` + no live Jira for WhatsApp**; **live delta with snapshot** — **`snapshot_as_of` + live delta outcome** (and **PARTIAL** if live-delta rules say so); **full live** — complete only if every inventory key had `getTicketDetails`, else **PARTIAL** with epics/pending keys; chat mirrors partial status for resume. **Cross-initiative** theme `<li>`s each include a **key or paraphrase** anchor from **held evidence**. **Main-table** **published** PM cells cite WhatsApp via **parenthetical** `(HRREC-…)` and/or **`[WhatsApp companion: HRREC-nnnnn]`** (no standalone **`Cross-channel (WhatsApp backlog) —`** cell starters—see companion annex). When the manifest lists **AG:** / **RN:** Story keys, confirm **Cross-initiative** / companion **`h2`** bullets do **not** treat them as primary product pattern anchors unless the user widened scope—see the annex **AG: / RN:** subsection. If a **Companion Peanut anchor pass** ran, confirm **`h3` Code evidence (WhatsApp anchors—Peanut)** exists with **≤8** anchors, **one unique narrative unit per key**, no duplicate commit blurbs, and **full-history** clones / honest tool failure documented per the annex **Optional Peanut** section.
14. **Skill markdown contract (after editing skill docs):** From repo root, run `python3 scripts/verify_user_story_gap_review_skill_contract.py` — must exit **0** (validates critical headings and anchors in [`reference.md`](reference.md) + [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) + [`SKILL.md`](SKILL.md)).
15. **Manifest maintenance (optional):** After refreshing the frozen snapshot, run `python3 docs/initiatives/two-way-email/drafts/diff_whatsapp_companion_manifest.py --snapshot docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md --live-keys <export.txt>` (or `--live-json`) and resolve **added/removed** keys before setting **`manifest_complete: true`**.
