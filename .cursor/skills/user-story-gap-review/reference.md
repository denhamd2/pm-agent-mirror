# user-story-gap-review — reference

Long-form templates, HTML schema, and batching rules. Main workflow lives in `SKILL.md`.

## Contents

- [Run tiers](#run-tiers-tier-a-full-contract-vs-tier-b-timeboxed)
- [From-scratch execution](#from-scratch-execution-mandatory-unless-user-opts-out)
- [Default Confluence target](#default-confluence-target)
- [Subset / smoke / local-only runs](#subset--smoke--local-only-runs)
- [Scope exclusions](#scope-exclusions-documentation-writer-tickets)
- [Companion channel cross-scan (013 / 2WE)](#companion-channel-cross-scan-013-2we) — stub; full contract: [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) (includes **Optional Peanut** anchors). **HRREC-82977:** step **2b** **mandatory** unless explicit opt-out—see annex **When to run**.
- [Page structure](#page-structure-audience-non-technical-sr-recruiting-pm)
- [Plain-language, story-specific, and source tags](#plain-language-story-specific-and-source-tags-mandatory)
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

## From-scratch execution (mandatory unless user opts out)

**Tier A** runs must satisfy items **1–5** below per in-scope story. **Tier B** runs relax Salomon / Dev lens depth per **Run tiers** but still require fresh Jira (item **1**) and honest per-row source lines.

When the user says **run** the gap review (e.g. `/user-story-gap-review`, “rerun on the epic”), assume **no carry-over** of narrative analysis from:

- Prior Confluence versions of the same page  
- Pre-written row text in repo scripts (e.g. `gen_gap_review_*.py` story libraries)  
- Earlier chat turns, MISSION_LOG prose, or “we already know” memory  

**Per story in this run**, before writing that row’s PM/QA/**Dev lens** cells:

1. **Ingest** current Jira text (`getTicketDetails` or `jira_details_tool`) for that key in this session (**skip** keys excluded under **Scope exclusions**, e.g. **AG:** / **RN:** doc-writer tickets).  
2. **Salomon** — **Tier A:** at least one `search_workday_internal_knowledge` query whose preamble + keywords are tied to **that** story’s summary/AC (theme passes may precede, but do not replace story-level hits). If the first query returns **only off-topic** hits, run a **narrower** second query for **that** key or record a single honest **`Salomon —`** “no on-topic precedent” line—see **Net-new preamble (Salomon)**. **Tier B:** satisfy with **documented theme queries** plus per-row **Salomon —** lines per **Tier B alignment** below. **Skip** if the key is excluded.  
3. **Dev lens — XO MCP** — at least one `search` (or justified `hopper_search` / `service_description_get`) attempt; the **Dev lens** cell must reflect **this** attempt’s outcome with **`XO MCP —`** bullets. **Skip** if the key is excluded.  
4. **Dev lens — Peanut MCP (optional, signal-gated)** — **Default: do not call** Peanut for this key. Invoke **`collectBugData`** / **`searchCode`** only when **When to invoke Peanut (2WE per-row)** in **Net-new preamble (Peanut MCP)** applies (**Tier A**: cap **1–2** read-only calls per story when triggered; **Tier B**: default **no** per-row `collectBugData`—honest **`Peanut — Not queried — …`** or one epic-scoped batch if the user explicitly asked). Always include an explicit **`Peanut —`** line (**Peanut — taxonomy (gap review)**)—**no** invented commit or PR detail. **Skip** if the key is excluded.
5. **DA** — at least one `ask_deployment_agent` question that names the story context (DA may be **batched** across several keys in one message, but each story must receive distinct treatment in synthesis—not a single generic paragraph pasted into every row). **Skip** if the key is excluded.

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

**Executive-summary preface (mandatory for these runs):** include **≤2** short items that state:

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
   - **Preface (when applicable):** before the two lists, a **short** `<ul>` with **at most two** `<li>` items: **(1)** **Run tier** (Tier **B** disclosure is **mandatory** when applicable—see **Run tiers**); optionally add the **Gap Likelihood** reader note in the same `<li>` when helpful: *“Gap Likelihood reflects **Verdict** + **suggested missing BDD** only—not a separate persona-tension score.”* **(2)** **Scope** (e.g. skipped **AG:** / **RN:** keys) and/or **draft replay** caveat when Status lozenges come from a repo formatter **without** per-row Verdict+BDD rubric (see **Gap column (2)**). Tier **A** may omit the preface if nothing extra needs saying.
   - **`h3` Top 5 gaps (epic)** — ordered `<ul>`, **at most five** `<li>`. **Default order:** gaps **before** strengths (action-first). Each line: **one sentence**, plain English, **actionable** (what to refine, decide, spike, or align in a session). Optional trailing **story keys** in parentheses when that sharpens ownership (e.g. `(HRREC-91975, HRREC-91997)`). **Do not pad** toward five—use fewer lines when the evidence does not support five distinct epic-level gaps.
   - **`h3` Top 5 strengths (epic)** — ordered `<ul>`, **at most five** `<li>`. Same one-sentence rule. Each strength must tie to **evidence** from this run (e.g. repeated clarity in Jira across keys, consistent Salomon/DA themes, or stable **Dev lens** signals)—**no generic praise** or filler.
   - **Plain language only**—no stack traces, no unexplained acronyms; if you mention a Workday artefact (e.g. “security domain”, “message template”), one short clause on why it matters to recruiters or candidates. **Epic-wide testing themes** (Reply-To staging, bell vs inbox, attachment limits, template health, purge scope) belong **once** in this summary or in **Epic-level notes**—not copy-pasted into every story row (see **Lens column brevity** and **Story-specificity**).
2. **Epic / scope coherence** — `h2` **“Epic-level notes”** (omit only if the run is a loose JQL bag with no shared epic): bullets for **duplicated or overlapping scenarios** across stories, **gaps** that span journeys (journey A without matching journey B), **dependency / ordering** risks, and **candidate missing stories** the PM should validate with engineering—material that does **not** fit a single one-line **Top 5 gaps** entry. **Do not** paste the same epic theme as a long paragraph in **Epic-level notes** and again across most table rows; keep the **portfolio** narrative in the executive summary’s 5+5, keep **cross-story mechanics** here, keep **story-specific** detail in the table.
3. **Cross-initiative pattern hints (WhatsApp)** — `h2` **“Cross-initiative pattern hints (WhatsApp — inspiration only)”** — include **only** when **Companion channel cross-scan (013 / 2WE)** ran (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)). **Omit** this block entirely when the scan did not run (non-2WE scope).
4. **Gap review table** — single Storage HTML `table` (see [Confluence HTML table skeleton](#confluence-html-table-skeleton)); seven columns per existing contract.
5. **Possible missing stories (holistic)** — `h2` **“Possible missing stories (suggestions only)”** immediately **under** the gap review table, then a short lead `<p>`: these rows are **not** Jira keys—the skill **does not** create issues; they are backlog **suggestions** from a holistic pass. When no PRD/initiative scope was loaded for this run (see **Possible missing stories (holistic suggestions)**), the lead must say the block is **Jira-holistic + epic narrative only**. For **loose JQL** runs with **no single shared epic**, **omit** this whole `h2` + table and instead emit one `<p>` under the main table: *Holistic “possible missing stories” table omitted—no single epic scope.* **Do not** duplicate content already captured as **Suggested missing BDD** on existing Story rows; this table is for **net-new slices** (missing journeys, cross-cutting admin/compliance, platform spikes) implied by the epic set + optional PRD.

**Tone for all narrative sections and table cells:** write as **recommendations and questions** a Sr. PM can take to refinement—**not** an engineering ticket dump. Technical depth belongs in the **Dev lens** column but still **translated** (“The platform metadata we searched did not show … therefore engineering should confirm …”; Peanut signals phrased as **what to ask engineering**, not raw diffs).

## Plain-language, story-specific, and source tags (mandatory)

**Story-specificity (anti–copy-paste):** PM, QA, and **Dev lens** cells **fail the skill** if the same multi-line boilerplate appears unchanged on **multiple** sibling rows. Epic-level reminders (mail redirect, notification types, attachment limits, purge breadth, template override) live in the **Executive summary (Top 5 gaps / Top 5 strengths)** and **Epic-level notes**—each story row must tie advice to **that** story’s summary, scenarios, and tensions. Respect **Lens column brevity** caps so rows stay scannable.

**Plain language:** prefer recruiter/admin/candidate wording. When a source uses jargon, **translate once** in the same bullet, e.g. “**REST / server contract** → the behind-the-scenes save or send check should match what the screen promises.” Avoid dumping internal class names, WIDs, or tool acronyms unless one short plain-English gloss is included.

### PM read-aloud gate (mandatory before publish)

Before shipping the Confluence table (and mirrored chat summary), **each story row** must pass this check: *Could I read the **PM** and **QA** lens cells aloud to a hiring manager who does not ship software, in about **90 seconds or less per row**, without stopping to define jargon?*

- If a bullet **opens** like a test script (**Assert…**, **Prove…**, **Verify…**, **Measure…** as the leading word) or is mostly **acronyms without a one-line “why it matters to hiring” gloss**, rewrite before publish.
- If the **Jira —** bullet is only the **story title pasted again**, replace it with one sentence on **what is unclear, risky, or missing** for *this* slice in recruiter/admin/candidate terms (still tagged **Jira —**).

### QA lens — user-visible risk first (mandatory)

The QA column stays **evidence-backed** (Salomon/DA/Jira tags) but must **read like a Sr PM taking questions to refinement**, not an automation script.

1. **Order of thought:** When describing failure hunting, put **what the recruiter or candidate would notice first** (wrong copy, missing task, stuck spinner, misleading “sent” state, blocked send, privacy-unsafe leak), **then** (same or following bullet) how QE could exercise it if needed.
2. **Banned leading words** on QA bullets (after the source tag): do **not** start the body with **Assert**, **Prove**, **Verify**, **Measure**, or **Trace** as the first word. Prefer **Recruiters see…**, **Candidates experience…**, **Risk:**, **Edge case:**, **Watch for…**.
3. **At most one** bullet per row may read like a lab step; it must still name the **user-visible** symptom it guards against.

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

Structure PM and QA as `<ul>` bullets. **Each bullet must start with a bold source label** so a non-technical PM can see provenance:

| Tag | When to use |
|-----|-------------|
| **Jira —** | Findings grounded in this ticket’s description, acceptance criteria, or scenarios (including thin-spec). |
| **Salomon —** | Internal knowledge hits (or explicit “no useful precedent returned”). **Paraphrase** one or two ideas that matter **for this story**—never paste the same long Salomon paragraph on every row. |
| **Deployment Agent —** | Tenant realism, staging, misconfiguration, or “how customers actually run Recruiting” from DA. **Story-specific** phrasing only. |
| **Functional knowledge —** | Stable product rules from workspace **050-functional-knowledge** (or equivalent) that apply to this slice—state the rule in plain English, not rule-file jargon. |
| **Other —** | Synthesis, **Verdict**/BDD tension, or user-prompt context—use sparingly. |
| **Cross-channel (WhatsApp backlog) —** | **Only** when **Companion channel cross-scan (013 / 2WE)** ran: **≤1** bullet per row in **PM or QA**; theme tied to **this** 2WE slice, grounded in the **companion evidence** used this run—**manifest-only:** snapshot **Captured excerpts** (and manifest scope) only; **live delta with snapshot:** excerpts **plus** `getTicketDetails` for **new** delta keys (and any stable keys you refreshed); **full live:** `getTicketDetails` text per key—naming **which epic(s)** / example keys and **why email may differ**—see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md). **Never** imply WhatsApp bugs prove email defects. |

**Dev lens column:** one `<ul>`. Lead with **`XO MCP —`** bullets (plain English: what was searched, what was / was not found). Optional **`XO MCP — risk:`** for risk-from-absence. Add **`Peanut —`** per **Peanut — taxonomy (gap review)** when Peanut ran, was **Not queried**, **Unavailable**, or returned no useful signal—**paraphrase** only what matters for **this** story when there is a signal. Do **not** use the PM/QA tag set inside **Dev lens** unless you are explicitly quoting a cross-source tension.

### Verdict column (replaces “Severity / open questions”)

**Column header:** **Verdict** (not “Severity / open questions”).

**Purpose:** a **TL;DR** for busy PMs—**no** long numbered question lists.

**Skimming contract:** When **you** scan the gap table, read **Verdict** first on each row; PM / QA / **Dev lens** are supporting detail. **Verdict** must **not** paste or paraphrase long lists from those columns—keep it to the two-sentence **Finding** / **Recommended next step** contract below.

**Format:** exactly **two** bullets in one `<ul>`, **one sentence each** (aim ≤ ~140 characters per sentence; slightly over only if unavoidable):

```html
<ul>
  <li><strong>Finding:</strong> …</li>
  <li><strong>Recommended next step:</strong> …</li>
</ul>
```

- **Finding:** one plain-language sentence summarising the **overall** outcome of the row (thin spec, alignment vs tension, or biggest thing to remember)—**only** what evidence supports.
- **Recommended next step:** one concrete **next** action when a gap exists (refine Jira, short decision meeting, spike, align with sibling story X). When no material gap surfaced, use an honest **no-action** line (see **Evidence grounding — no fabrication**).

**Cross-channel (WhatsApp) synthesis:** When this row includes a **`Cross-channel (WhatsApp backlog) —`** bullet in **PM or QA**, **Finding** may compress that cross-initiative tension **together with** this story’s **2WE** Jira / lens evidence in one sentence—still **no** “WhatsApp bug ⇒ email defect” implication; still obey the **Skimming contract** (no pasted or long paraphrase lists from the lens columns).

Avoid severity codes (P1/P2) unless the team already standardises on them; prefer plain phrases like “Worth deciding before build” / “Lower risk once … is clarified”.

## Salomon and DA — no separate Confluence columns

Under **Tier A**, run Salomon and DA at the per-story (or row-anchored batched DA) depth described in **From-scratch** and **Run tiers**. Under **Tier B**, MCP calls may be **theme-batched** per **Run tiers**, but every row still records what ran in **Salomon —** / **Deployment Agent —** (no silent omission). **Do not** add **Salomon precedents** or **DA notes** as their own `<th>` / `<td>` columns.

| Source | Baked into **PM lens** | Baked into **QA lens** |
|--------|------------------------|-------------------------|
| **Salomon** | Product patterns, constraints, admin/compliance precedents, “what we usually document for customers” | Past bugs, regression patterns, support-heavy failure modes, edge cases called out in internal threads |
| **DA** | Tenant setup reality, best-practice limits, config vs product boundary, how recruiters/admins typically operate | How to exercise the story in a realistic tenant, misconfiguration gotchas, perf/limit assumptions for test planning |

When Salomon or DA returns **nothing useful**, state that **inside** a PM or QA bullet (e.g. “Internal search did not surface precedent—treat as design risk.”) rather than leaving a whole column empty.

## Three personas — criticality contract

Each row’s **PM / QA / Dev lens** cells must reflect **deliberate skepticism** (Salomon/DA are **part of** PM/QA, not extra columns):

- **PM lens** — Challenge slice completeness: who is left out, what “done” avoids saying, business / compliance implications, rollout and comms risks—**plus** Salomon product-side precedent and DA tenant/config realism (see table above). **Use source-tagged bullets** as in **Plain-language, story-specific, and source tags**.
- **QA lens** — Assume brittle UI and messy tenant data; hunt **edge cases, negative paths, state transitions**, accessibility, locale, and “how would we know it failed in prod?”—**plus** Salomon bug/failure patterns and DA operational test realism (see table above). **Use source-tagged bullets**; no copy-pasted epic-wide QA checklist across rows. Follow **QA lens — user-visible risk first** under **Plain-language, story-specific, and source tags** (banned test-script openers; user-visible symptom before lab detail).
- **Dev lens** — Challenge feasibility and fit: adjacent services/metadata (**XO MCP**), plus **Peanut** only per **When to invoke Peanut (2WE per-row)** (similar issues, narrow repo touchpoints). Lead with **`XO MCP —`**; add **`Peanut —`** per **Peanut — taxonomy (gap review)**. Explicit **risk-from-absence** when XO returns nothing useful—still in plain English for the PM reader (see **Plain-language, story-specific, and source tags**).

If all three read like generic praise, the row **fails** the skill’s intent—rewrite until each lens adds **distinct** pressure **without inventing facts** (see **Evidence grounding — no fabrication** below).

## Evidence grounding — no fabrication

**General rule:** Every bullet in **PM / QA / Dev lens**, each **Verdict** line, and each **BDD** block must be **traceable** to at least one of:

- Jira description, acceptance criteria, or scenarios;  
- **Salomon** — a paraphrased or quoted excerpt from a hit, or an explicit **“no useful precedent returned”** line;  
- **Deployment Agent** — paraphrased answer text, or explicit **“no answer / only generic guidance”**;  
- **XO MCP** — what was searched and what was returned, or explicit **not found** + query terms;  
- **Peanut MCP** — when invoked per **When to invoke Peanut (2WE per-row)**: paraphrased similar-issue or code-search signal that matters for **this** row, or **Ran — no useful signal**; when not invoked: **Not queried** per **Peanut — taxonomy (gap review)**; on tool failure: **Unavailable**—**not** “not queried.”  
- **Companion Jira (WhatsApp epics)** — when **Companion channel cross-scan** ran: themes or failure patterns **paraphrased** from **(a)** **manifest-only:** repo **snapshot** manifest + **Captured excerpts** (`snapshot_as_of`) with **no** WhatsApp Jira pull, **or (b) live delta with snapshot:** same snapshot **plus** **`getTicketDetails`** for **new** live keys and any stable keys you explicitly refreshed, **or (c) full live:** paginated Story+Bug inventory plus **`getTicketDetails`** for keys successfully pulled this run—**primary** surfaces: a **`Cross-channel (WhatsApp backlog) —`** bullet in **PM or QA** (when the row warrants it) and/or the companion **`h2`** section. **On the same row**, **Verdict** and **Suggested missing BDD** may **also** trace to that **`Cross-channel (WhatsApp backlog) —`** bullet when present (**Finding** may compress its translation question alongside **2WE** evidence; **Recommended next step** may name an email-side refinement or spike; **at most one** additional **GWT** block may close the translation question from that bullet—still within the **0–4** BDD cap—see **Verdict column** and **Suggested missing BDD — specificity, uniqueness, follow-on**). Companion evidence is **not** a substitute for **2WE** `getTicketDetails` text; if the companion corpus was **partial**, do **not** over-claim coverage (see **Companion partial corpus / resume**); **never** treat the snapshot as “live Jira” without the corpus line matching the path (**manifest-only** vs **live delta outcome** vs **full live**);  
- **Functional knowledge —** only when a **050-functional-knowledge** (or equivalent) rule **clearly** applies—state the rule theme in plain English;  
- **Other —** at most when naming a **contradiction between two sources above** (say both).
- **Holistic “Possible missing stories” table** — each suggested row must trace to **(a)** patterns across **this run’s** in-scope Jira Story text (summaries/descriptions), **(b)** **Epic-level notes** / **Top 5 gaps** already written for the page, and/or **(c)** PRD/initiative scope **only** when the PM made it available without treating an external doc as auto-fetched SoT (Jira **Notes** PRD link, user attachment, or repo PRD path named in the prompt—see [`SKILL.md`](SKILL.md) “Do **not** auto-resolve external PRDs”). **Do not** invent PRD requirements you did not read.

**Do not** add persona “pressure,” Verdict drama, or BDD scenarios **solely** to fill cells, hit a scenario count, or inflate gap tension.

**Verdict:** **Finding** must restate only what the row’s evidence actually showed. **Recommended next step** must be a **real** next action when a gap exists; when lenses align and Jira is already strong, the second bullet may honestly say e.g. **“No material gap surfaced in this pass—keep Jira scenarios as source of truth unless new risks appear.”** Do not invent a meeting or spike “for show.”

**BDD:** Prefer **fewer** scenarios when Jira coverage is already strong and lenses agree (**0–2** blocks, or a single `<p>` stating **no suggested missing BDD** for this pass). **Never pad** toward the hard cap of **4**. Each block still traces to a row-level gap when present (see **Suggested missing BDD — specificity, uniqueness, follow-on**). When a **`Cross-channel (WhatsApp backlog) —`** bullet exists on the row, **at most one** scenario block may **primarily** close that bullet’s **email translation question** (still recruiter/admin/candidate language; no channel-parity assumptions). **Prioritisation while drafting column 7:** use PM / QA / **Dev lens** tension and Jira parse to decide **which** missing scenarios to write; **Gap Likelihood** is still assigned **only** from **Verdict + BDD** after column 7 exists (**Gap likelihood — per story (Verdict + BDD)**).

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
| **PM lens** | One `<ul>` of **story-specific** bullets. **Every bullet starts with a source tag** (see **Plain-language, story-specific, and source tags**): **Jira —**, **Salomon —**, **Deployment Agent —**, **Functional knowledge —**, **Other —** as applicable. Plain English; translate jargon. **Do not** paste identical Salomon/DA paragraphs across rows—paraphrase only what matters for **this** summary. **Jira —** must not be only the title echo—state gap, ambiguity, or missing journey in PM language (see **PM read-aloud gate**). Prefix thin-spec rows with `<strong>Insufficient spec</strong> —` on the first **Jira —** bullet, then high-level questions only. |
| **QA lens** | One `<ul>`; **same source-tag rule** as PM. Edge cases and “how would we notice a defect?” **only when tied to this story** (not a generic epic QA checklist). Salomon/DA: one focused sentence each where those tools ran, or explicit absence. Follow **QA lens — user-visible risk first** (no Assert/Prove/Verify/Measure/Trace as sentence openers after the tag). |
| **Dev lens** | **`XO MCP —`** lead-in: what was searched and what was found or not found, in **plain English** (avoid raw metadata soup; at most one translated example in parentheses). Optional **`XO MCP — risk:`** for risk-from-absence. **`Peanut —`** per **Peanut — taxonomy (gap review)** (signal, **Not queried**, **Unavailable**, or **Ran — no useful signal**). Story-specific link to what this ticket assumes about platform behaviour. |
| **Verdict** | Exactly **two** bullets: `<li><strong>Finding:</strong> …</li><li><strong>Recommended next step:</strong> …</li>` — **one sentence each**, TL;DR for a non-technical PM (see **Verdict column** above). |
| **Suggested missing BDD (Given/When/Then)** | **0–4** scenario blocks per story (**hard cap 4**; **do not pad**—use **0–2** or a single “no additional BDD suggested” line when Jira is already strong and lenses agree; see **Evidence grounding — no fabrication**). When present, each block: short title (`<p><strong>Scenario: …</strong></p>`) then **labelled** steps: `<strong>Given</strong> …<br/><strong>When</strong> …<br/><strong>Then</strong> …` (Storage HTML). **Compact / chunked publish:** still use those three bold labels when scenarios exist—do not replace with “add GWT” prose bullets. Every scenario must **trace** to something in the **same row** (PM/QA/**Dev lens** text, **Verdict**, a **`Cross-channel (WhatsApp backlog) —`** bullet when present, or the same tension captured in **Verdict** / PM–QA)—**no** generic boilerplate. Prefer recruiter- or admin-facing actors in plain English. **Prioritisation:** address contradictions or open questions named in **Verdict** first, then the strongest lens-backed gap not yet covered. **Coverage hooks** (only when they appear in that row’s merged evidence): negative paths, tenancy (admin toggle, purge, template override), notification vs **My Conversations**, agency vs non-agency, attachment/size limits and server parity—not a laundry list copied from the epic. For **parse-first**, **banned placeholders**, **row uniqueness**, **actor/When precision**, and **dry-run** checks, see **Suggested missing BDD — specificity, uniqueness, follow-on** below. |

### Lens column brevity (mandatory)

Keep each row’s PM / QA / **Dev lens** cells short enough that a non-technical PM can skim the table. Caps are **per story row** (Storage `<li>` count); they do **not** relax evidence rules—merge weak bullets rather than inventing extra ones. Epic-wide themes belong in **Executive summary** / **Epic-level notes**, not repeated as long lists in every row.

| Mode | PM lens | QA lens | Dev lens (`XO MCP —` / `Peanut —` lines combined) |
|------|---------|---------|-----------------------------------------------------|
| **Tier A** | ≤4 bullets | ≤4 bullets | ≤4 tagged lines total |
| **Tier B** | ≤3 bullets | ≤3 bullets | ≤3 tagged lines total |
| **Thin-spec rows** | ≤2 bullets (after the required **Insufficient spec** lead on the first **Jira —** line, per **Thin-spec gate**) | ≤2 bullets | ≤2 tagged lines total |

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
| **Second+ scenarios** | Each additional block maps to **one** of: **Verdict** (Finding / recommended gap), PM–QA disagreement, **Dev lens** gap (e.g. XO not found, Peanut signals misaligned with Jira), DA misconfiguration theme, or—when the companion step ran—a **`Cross-channel (WhatsApp backlog) —`** bullet’s **email translation question** (**at most one** such companion-led block per row). **State that mapping** in the scenario title or first **Given** line. |
| **No padding** | If Jira scenarios and lenses already cover the risk, output **no** extra BDD or a single explicit “none suggested this pass” line—do **not** add scenarios to fill white space. |

**Cross-channel companion (column 7, when step 2b ran):** If this row’s PM or QA includes **`Cross-channel (WhatsApp backlog) —`**, you may add **up to one** **GWT** block whose scenario title or first **Given** names the **email-side** behaviour that closes the **translation question** in that bullet (e.g. “Cross-channel follow-on (email): …”). Do **not** paste or lightly reword the companion **`h2`** theme list on every row; skip this block when Jira + lenses already cover the same gap.

**Initiative vocabulary (HRREC-82977 and similar):** keep surfaces and actors aligned with [`docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md`](../../../docs/initiatives/two-way-email/STORY_WRITING_SUPPLEMENT.md) (e.g. **SSP**, **2-way email task**, **Message Builder**, **privacy admin**) so **When** clauses stay product-accurate.

**Cross-link — Jira hardening after gap review:** run **430 / 435** manually when promoting column 7 into formal Jira Scenarios; this skill does not auto-chain those rules.

## Net-new preamble (Salomon)

Every `search_workday_internal_knowledge` `message` must start with a scope line, for example:

> `NET-NEW / PRE-BUILD GAP REVIEW (not production defect triage). Story KEY: … Summary: … We need adjacent precedents, compliance/admin-guide constraints, and related product patterns before implementation.`

Then the actual keywords. Run **2–3** queries per story:

1. Feature + workflow terms from summary/description.
2. Compliance / privacy / retention / email / notification patterns if the story touches outbound comms or candidate data.
3. One query merged from **user prompt extras** (similar epic, URLs, “like HRREC-nnnn”).

**Output contract:** Salomon results are **not** a separate Confluence column. Write product-side precedent into **PM** bullets; write bug/failure/support patterns into **QA** bullets (see **Salomon and DA — no separate Confluence columns** above).

**Empty hits:** record as absence of precedent — **not** “low risk”—fold that honest absence into a **PM or QA** bullet, not a separate column.

**Off-topic hits:** if retrieved articles are clearly **not** about this story’s slice (wrong product area, generic tooling, unrelated workflows), do **not** weave them in for colour—either run **one** additional **narrower** query with the same net-new preamble and tighter keywords tied to **that** `KEY`, or write **`Salomon —`** Internal search did not return on-topic precedent for this slice (and one short clause on what you still watch for in QA). **Tier A** still needs traceable Salomon use per **From-scratch** item 2; “noise pasted as precedent” violates **Evidence grounding — no fabrication**.

## Net-new preamble (Deployment Agent)

`ask_deployment_agent` `question` should frame **product and tenant behaviour**, not customer break-fix, for example:

> `NET-NEW story review for Recruiting. How does this area typically behave in tenant config vs delivered product? What are common misconfigurations or limits we should design around? Story summary: … Acceptance hints: …`

Ask one consolidated question per story unless the answer is unusably short; then one short follow-up with `threadId` is allowed. **Synthesize answers into PM/QA cells** (product/config → PM; operational test realism → QA)—no separate DA column.

**Deployment Agent — batched answers, row-anchored synthesis:** A **single** `ask_deployment_agent` call covering many stories is allowed (especially under **Tier B**). **Each** row’s **Deployment Agent —** bullet must still **anchor to that key**: start with **For KEY (*summary phrase*):** or weave the story’s summary noun phrase in the **first clause**, then apply **one** concrete implication from the batch answer (tenant setup, staging, misconfiguration, limits, “how customers run Recruiting”). **Do not** paste the **same** unmodified DA paragraph on every row—that violates **distinct treatment in synthesis** (From-scratch item 4).

## Net-new preamble (XO MCP)

Read-only. Use `search` with prefixes from story text (`cl:`, `ws:`, or general name). Optionally `hopper_search` or `service_description_get` when the story names a REST/integration surface — **read paths only**; no `suv_rest_call`, `method_binding_execute`, patches, or writes.

Opening line in the agent’s internal notes (not necessarily in Confluence):

> `XO ADJACENCY ONLY — no SUV writes. Looking for tasks/services/BPTs related to: …`

If nothing relevant: Confluence cell **must** state no metadata found and name what was searched.

## Net-new preamble (Peanut MCP)

Read-only (`user-peanut-mcp`). Frame **pre-build product risk**, not production break-fix triage—same spirit as Salomon/XO preambles.

**Per-row 2WE Peanut is not required for Tier A completeness** when no trigger below applies: an honest **`Peanut — Not queried — …`** line satisfies the contract. **High-value Peanut** for cross-initiative / git-level comparison stays the **Companion Peanut anchor pass** (opt-in, **3–8** WhatsApp keys)—see **Companion Peanut anchor pass** below and [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Optional Peanut**.

### When to invoke Peanut (2WE per-row)

**Default:** do **not** call **`collectBugData`** or **`searchCode`** for that story row. **`collectBugData`** pulls Jira context + similar issues + commit history; it needs a **successful Jira fetch** for the ticket you pass. A **Jira fetch error** / **`needsConfig`** means **MCP integration or credentials** (`~/.peanut/config.json`, **`JIRA_TOKEN`**, host, permissions)—**not** “engineering has not started yet” or “no commits exist.” Fix config once; do **not** paste the same **Unavailable** boilerplate on every row after a known outage.

**Invoke** (any one is enough; still cap **1–2** calls per row under **Tier A** unless the user widens scope):

- The user asks for **repo / similar issues / commit** signals, or names **anchor bug keys** to compare.
- Jira description/summary shows **integration, regression, stack trace, PR, megaleo**, or other hooks where **XO MCP —** alone cannot bound risk.
- **`XO MCP — risk:`** (or equivalent) is real and you need **“has code moved here recently?”**—then a **narrow** Peanut pass, not a blanket **`collectBugData`** on every greenfield story.

**Do not invoke** (use **`Peanut — Not queried — <one-line reason>`** instead):

- Greenfield story with **no** repo/bug/regression language and XO already answers adjacency for the PM question.
- **Tier B** unless the user explicitly widens scope—default per-row **not queried** (or one documented epic-scoped batch if agreed in chat).

### Peanut — taxonomy (gap review)

Every in-scope **2WE** row must include **exactly one** readable pattern inside **`Peanut —`** (or the first **`Peanut —`** bullet) so operators can tell **skip** from **tool failure** from **ran**:

| Pattern | When |
|--------|------|
| **`Peanut — Not queried — …`** | Triggers above did not apply; or **Tier B** default skip. |
| **`Peanut — Unavailable (<one line>)`** | Tool ran or MCP returned **`needsConfig`**, Jira fetch error, timeout—**not** the same as “not queried.” Note once in **chat** how to fix (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Operator preflight**). |
| **`Peanut — Ran — no useful signal …`** | Peanut returned empty / no similar issues / no relevant commits after an honest attempt. |
| **`Peanut —`** (narrative signal) | Paraphrase similar issues or code-area risk **for this row**—see **`SKILL.md`** **Dev lens evidence**. |

**Never** paste secrets or long raw diffs into Confluence—**paraphrase** into **`Peanut —`** bullets inside the **Dev lens** column.

Opening line pattern (internal notes or tool framing, **only when invoking**):

> `NET-NEW / PRE-BUILD GAP REVIEW — PEANUT (read-only). Story KEY: … We need whether similar Jiras or recent code changes touch this slice—not full RCA.`

When invoking, prefer **`collectBugData`** with the **in-scope `jiraTicket`** and/or **`searchCode`** with a **small `searchPlanJson`** derived from the story summary.

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
3. Confirm Salomon returns either usable precedent/bug hints **or** explicit absence—and that absence appears **inside** a PM/QA bullet.
4. Confirm DA was asked and useful realism appears **inside** PM/QA (not an empty column).
5. Confirm XO `search` was attempted and the **Dev lens** cell’s **`XO MCP —`** lines state results or none; confirm **`Peanut —`** follows **Peanut — taxonomy (gap review)** (**Not queried** vs **Unavailable** vs **Ran**)—**most** rows should **not** be **`collectBugData`** unless triggers in **When to invoke Peanut (2WE per-row)** applied; repeated **Unavailable** across the grid usually means fix Peanut/Jira config, not rerun blindly.
6. Confirm Confluence page exists or updated; open via `scripts/open-url-chrome-and-cursor-browser.sh` with the final URL.
7. Spot-check HTML: **Executive summary** follows [`reference.md`](reference.md) **Page structure**—`h2` **Executive summary (for PM)** with optional **preface** (≤2 items), then **`h3` Top 5 gaps (epic)** and **`h3` Top 5 strengths (epic)** (≤5 bullets each; gaps before strengths; no padding); then **`h2` Epic-level notes** when applicable; then **when the companion cross-scan ran**, **`h2` Cross-initiative pattern hints (WhatsApp — inspiration only)** before the main table (see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md)). Then the **seven-column** gap table; then **`h2` Possible missing stories (suggestions only)** with a **three-column** holistic table when epic-scoped (or the omission `<p>` when loose JQL—see **Possible missing stories (holistic suggestions)**). **Seven** columns in the main gap table (Story; column **2** = **Gap Likelihood**—see **Gap column (2)**; PM; QA; **Dev lens**; **Verdict**; **Suggested missing BDD**); holistic table has **User Story**, **Reason Why This May Be Missing**, **BDD scenarios**—**no** fake `HRREC-` keys in the User Story column; **AG:** / **RN:** keys absent from the main table; no placeholder-only prose where thin-spec did not trigger; confirm the agent **did not** skip per-story MCP without disclosure when the user asked for a full from-scratch run. On **2–3** sample main rows, confirm **Lens column brevity** caps (PM/QA/Dev bullet counts). Spot-check that each row’s BDD scenarios **map** to that row’s PM/QA/**Dev lens**/**Verdict** themes (not generic epic boilerplate). On **2–3** holistic rows, confirm **Reason** + BDD are distinct from each other and from main column-7 duplicates. Confirm **Verdict** is exactly two one-line bullets (**Finding** / **Recommended next step**), does **not** duplicate long lens lists, and PM/QA bullets carry **source tags**. On **2–3** sample rows, apply **PM read-aloud gate** and confirm QA bullets follow **QA lens — user-visible risk first** (no **Assert** / **Prove** / **Verify** / **Measure** / **Trace** as the first word after the tag; **Jira —** is not only the story title pasted).
8. **BDD specificity dry-run:** across a sample of sibling keys, **no** two rows share the same **Given + When** verbatim; each **When** uses at least one **concrete** verb, control, or surface from that row’s summary, an extracted Jira scenario title, or the gap text — not banned placeholders from **Suggested missing BDD — specificity, uniqueness, follow-on** above. Where Jira already lists scenarios, confirm the first suggested block is a **follow-on** or explicitly **additional**, not a duplicate Scenario 1.
9. **Optional script — row dedup (repo):** `python3 docs/initiatives/two-way-email/drafts/check_gap_review_row_dedup.py path/to/gap_review.html` fingerprints **PM lens, QA lens, Dev lens, Verdict,** and **Suggested missing BDD** on the **main** seven-column table (truncated tag-stripped text per column); warns when **≥5** rows share the same fingerprint (override with `--threshold N`). When the file contains `<!-- possible-missing-stories-table -->`, the script also fingerprints **Reason** + **BDD scenarios** on holistic rows (see script docstring). Exit 0; use before Confluence publish or after editing a **Tier B** HTML generator. Legitimate duplicates (e.g. several keys sharing one verdict theme) still merit a quick eye—tighten the table or accept the risk explicitly.
10. **Evidence grounding:** confirm **no** PM/QA/**Dev lens** bullet, **Verdict** line, or BDD block asserts facts that are not traceable to Jira, Salomon, DA, XO MCP, Peanut (when invoked), **Companion Jira (WhatsApp epics)** when that cross-scan ran (**manifest-only:** snapshot manifest + **Captured excerpts** only; **live delta with snapshot:** snapshot + **`getTicketDetails`** for delta keys as documented; **full live:** paginated Story+Bug + **`getTicketDetails` bodies**; if **partial**, do **not** claim full ingestion—see [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) **Companion partial corpus / resume**; **no** “current WhatsApp backlog” claims from **manifest-only** or incomplete **live delta**), functional knowledge, or a named cross-source contradiction (**Other —**). Empty MCP tools are stated as empty—not invented precedent.
11. **Run tier:** confirm **Tier B** runs include the **mandatory first executive-summary bullet** (see **Run tiers**); **Tier A** runs did not silently skip per-story Salomon depth unless the user opted into diff-only mode.
12. **Publish path:** confirm **Publish pipeline** was followed—pre-flight size, **sequential** Confluence chunks if used, **no** parallel `smart_update`, **no** placeholder `replace` on the live rolling page.
13. **WhatsApp companion (when step 2b ran):** Rules live in [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md). Corpus line matches the path used: **manifest-only** — **`snapshot_as_of` + no live Jira for WhatsApp**; **live delta with snapshot** — **`snapshot_as_of` + live delta outcome** (and **PARTIAL** if live-delta rules say so); **full live** — complete only if every inventory key had `getTicketDetails`, else **PARTIAL** with epics/pending keys; chat mirrors partial status for resume. **Cross-initiative** theme `<li>`s each include a **key or paraphrase** anchor from **held evidence**; **`Cross-channel (WhatsApp backlog) —`** bullets cite only keys backed by **snapshot excerpts** (manifest-only) and/or **`getTicketDetails` this run** when that path ran (no pending keys, no staleness-only removed manifest keys as current proof). When the manifest lists **AG:** / **RN:** Story keys, confirm **Cross-channel** / companion **`h2`** bullets do **not** treat them as primary product pattern anchors unless the user widened scope—see the annex **AG: / RN:** subsection. If a **Companion Peanut anchor pass** ran, confirm **`h3` Code evidence (WhatsApp anchors—Peanut)** exists with **≤8** anchors, **one unique narrative unit per key**, no duplicate commit blurbs, and **full-history** clones / honest tool failure documented per the annex **Optional Peanut** section.
14. **Skill markdown contract (after editing skill docs):** From repo root, run `python3 scripts/verify_user_story_gap_review_skill_contract.py` — must exit **0** (validates critical headings and anchors in [`reference.md`](reference.md) + [`reference-companion-whatsapp.md`](reference-companion-whatsapp.md) + [`SKILL.md`](SKILL.md)).
15. **Manifest maintenance (optional):** After refreshing the frozen snapshot, run `python3 docs/initiatives/two-way-email/drafts/diff_whatsapp_companion_manifest.py --snapshot docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md --live-keys <export.txt>` (or `--live-json`) and resolve **added/removed** keys before setting **`manifest_complete: true`**.
