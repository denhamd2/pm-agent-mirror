# Companion WhatsApp epics (2WE gap review — pattern hints only)

This document is **consultual knowledge** for [`/user-story-gap-review`](../../../.cursor/skills/user-story-gap-review/SKILL.md) when the primary scope is **two-way recruiting email (2WE)** — epic [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977). A partner initiative delivered **two-way WhatsApp** in a **similar UX shell** (job application flow, candidate profile **sliding side panel**). It is **not** a requirements import for email.

## Hard disclaimers (use verbatim in Confluence lead copy when publishing)

1. **Same surface, different channel:** WhatsApp and email are both outbound/inbound comms from Recruiting, but **consent, templates, media, delivery semantics, and failure modes** differ by channel.
2. **Different backend / OE:** WhatsApp partner delivery is commonly **Twilio-oriented** in internal discussions; **two-way email** uses Workday’s **email** integration path (not the same as Twilio). **Do not** treat a WhatsApp bug as proof an email defect exists.
3. **Bugs = delivery pain signals, not email defects:** Issues typed **Bug** under these epics show **where WhatsApp work hurt**; use them to brainstorm **missing scenarios or edge cases** for 2WE, not as evidence that 2WE is broken.
4. **Inspiration only:** Any bullet derived from this corpus must read as **“Consider for 2WE if …”** / **translation question**, never **“2WE must match WhatsApp.”**

## When to run the companion cross-scan

Run the **Companion channel cross-scan (013 / 2WE)** when **any** of:

- The user asks to include WhatsApp / companion epics / cross-initiative patterns; or
- Primary scope is clearly **HRREC-82977** or initiative docs under `docs/initiatives/two-way-email/` (including [CONTEXT.md](CONTEXT.md)); or
- The user points at this file.

**Default depth:** When the repo snapshot is eligible (`manifest_complete: true`, non-empty manifest), the gap-review skill uses **manifest-only** by default: read [`reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) (manifest + **Captured excerpts**) with **no live Jira pull** for WhatsApp companion keys—see [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) **Manifest-only (default when snapshot is eligible)**.

**Opt-in live Jira for WhatsApp:** Ask for **`WhatsApp live delta`** or **`WhatsApp refresh corpus`** to run **live delta with snapshot** (cheap epic inventory + `getTicketDetails` for new keys and any stable keys missing excerpts, per that reference section).

**Fallback — full live corpus:** If the user says **`WhatsApp live-only`** / **`ignore WhatsApp snapshot`**, or the snapshot is missing / **`manifest_complete: false`** / empty manifest, use **full** enumeration: for **each** epic below, **paginate** `searchJiraTickets` for every **Story** and **Bug**, then **`getTicketDetails` once per enumerated key** in this session. Optionally call `summarizeJiraEpic` per epic afterward to **reconcile** counts vs the paginated list; if they diverge, treat the **Story+Bug JQL union** as the inventory of record and document the delta in Confluence.

**User opt-out (narrower corpus):** Only if the user explicitly asks (e.g. “WhatsApp titles only” or “bugs only”), skip full bodies or narrow `issuetype`; state that narrowing in the companion **`h2`** lead paragraph.

**AG: / RN: (doc-writer) Stories:** Jira may return **AG:** / **RN:** **Story** issues under these epics; they can stay in the **manifest** for inventory tracking and optional **live delta** reconciliation when you opt into **`WhatsApp live delta`** / **`WhatsApp refresh corpus`**. For **pattern** **`h2`** bullets and **`Cross-channel (WhatsApp backlog) —`** rows on **2WE**, treat them like **scope exclusions**—do **not** use them as primary evidence anchors unless the PM explicitly widens companion scope (see [`reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) → **AG: / RN:** subsection).

## Canonical epic list (Jira)

| Key | URL |
|-----|-----|
| HRREC-89236 | https://jira2.workday.com/browse/HRREC-89236 |
| HRREC-84384 | https://jira2.workday.com/browse/HRREC-84384 |
| HRREC-89812 | https://jira2.workday.com/browse/HRREC-89812 |
| HRREC-82870 | https://jira2.workday.com/browse/HRREC-82870 |
| HRREC-91933 | https://jira2.workday.com/browse/HRREC-91933 |

**Hybrid path (deprecated name):** When the repo snapshot is eligible, gap review uses **manifest-only** by default; **`WhatsApp live delta`** / **`WhatsApp refresh corpus`** opt in to **live delta with snapshot**—see [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) instead of full paginated inventory + `getTicketDetails` on every key.

**Inventory (full live path):** For each epic key, `searchJiraTickets` with JQL such as:

`project = HRREC AND issuetype in (Story, Bug) AND "Epic Link" = HRREC-89236 ORDER BY key ASC`

**Paginate** with `startAt` (Jira returns **50** issues per page) until all issues for that epic are collected. **Adjust** `"Epic Link"` vs `parent` / team-managed epic field if the query returns empty (same variance as the gap-review skill’s epic expansion step). **Dedupe** keys if any overlap across epics.

**Bodies (full live path):** `getTicketDetails` with `{ "jiraTicket": "KEY" }` for **each** unique key from the inventory.

**Reconciliation (optional):** `summarizeJiraEpic` with `{ "epicTicket": "HRREC-…" }` per epic; compare child/story/bug signals to your paginated totals and document mismatches in the published companion section.

### Partial corpus / resume (honesty)

**Full live:** If **`getTicketDetails` does not complete** for every inventory key (limits, errors, or deliberate stop): the Confluence **corpus line** must be labelled **partial / incomplete**, name **which epic(s)** and **pending keys or counts**, and **never** claim a full read.

**Hybrid:** If the live delta or required **`getTicketDetails`** pulls for new keys do not complete, label **PARTIAL** per [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) **Companion partial corpus / resume** and still state **`snapshot_as_of` + what delta was applied**.

**Mirror the same in chat** so a follow-up session can resume. Theme bullets may only anchor to evidence you hold: **`getTicketDetails` this run** and/or **snapshot Captured excerpts**.

### Theme bullet quality (Confluence `h2` body)

Each theme bullet must include **at least one** **Jira key** and/or **short paraphrase** of an issue title/summary backed by **`getTicketDetails` this run** or a **snapshot excerpt**; **theme-only** bullets are not allowed.

## Theme buckets (synthesis guide)

When merging **ticket text** (live **`getTicketDetails`** and/or **snapshot excerpts**) from the corpus, group hints under themes such as: **consent / opt-in**, **thread or session lifecycle**, **delivery or read receipts**, **attachments or media**, **notifications vs inbox**, **admin or tenant toggles**, **agency**, **locale**, **error and empty states**. For each theme, add one **email-specific translation question** (what would recruiters or candidates see on the **email** path?).

## Full skill procedure

Workflow, Confluence `h2` template, per-row **`Cross-channel (WhatsApp backlog) —`** rules, and evidence grounding live in [`.cursor/skills/user-story-gap-review/SKILL.md`](../../../.cursor/skills/user-story-gap-review/SKILL.md) and [`reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) (**Companion channel cross-scan (013 / 2WE)**).
