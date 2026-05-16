---
name: Jira Recruiting story description
description: HRREC Story **Description** as **Atlassian wiki** for MCP/REST (`h2.`/`h3.`, `[label|url]` + `%5F` in paths, persona/Gherkin `*Given*` wiki bold, DoR `| … | |`). GFM lives in **430** for Git review only. Triggers: format Jira description, `setJiraTicketField`, `.jirawiki` pushes.
---

# Jira Recruiting story description

Thin router: **do not duplicate** the full template here. Always read **`430-story-writing.mdc`** (Step 5–7) for the authoritative rules.

## When to use

- "Format this for Jira", "Jira story description template", "HRREC story description", "apply DoR table to the story"
- Creating or updating **`user-jira-ghe`** `description` / `setJiraTicketField` payloads for **HRREC** Stories (use **`.jirawiki`** or equivalent **Atlassian wiki** — see **430** Step 6)
- Aligning a draft markdown story with the **two-way-email** placeholder pattern (GFM **`## Notes`** in `.md`; wiki **`h2. Notes`** + bullets in `.jirawiki` — Figma + PRD)

## What to do

1. Open and follow [`.cursor/rules/430-story-writing.mdc`](.cursor/rules/430-story-writing.mdc): **Step 1c** (epic scenario ledger) when formatting **batches** under one epic. **Step 5** defines **GFM draft** layout (BDD — tight vs extended Given/When/Then; **no** terminal `.` on **Given** / **When** / **Then** lines; markdown two-space breaks where applicable). **Step 6** defines **Atlassian wiki** for MCP/REST — translate Step 5 into wiki (**`h2.`** / **`h3.`**, `*Given*`, `[label|url]`, DoR pipes) before **`PUT`** / **`setJiraTicketField`** (see checklist below). **Step 7** (labels `M{n},VS{n}` when milestones apply, component from epic, assignee `david.denham`).
2. Use the worked examples: **wiki for Jira** — [`jira-first-placeholder-HRREC-empty-state.jirawiki`](docs/initiatives/two-way-email/drafts/jira-first-placeholder-HRREC-empty-state.jirawiki), [`jira-story-notification-payload.jirawiki`](docs/initiatives/two-way-email/drafts/jira-story-notification-payload.jirawiki). **GFM markdown** mirrors for review only: [`jira-first-placeholder-HRREC-empty-state.md`](docs/initiatives/two-way-email/drafts/jira-first-placeholder-HRREC-empty-state.md), [`jira-story-notification-payload.md`](docs/initiatives/two-way-email/drafts/jira-story-notification-payload.md).
3. For post-create validation, use [`.cursor/rules/435-story-validator.mdc`](.cursor/rules/435-story-validator.mdc) **§ Jira Format** (dual-field, DoR shape, component/labels).

### Wiki push checklist (HRREC)

- **Headings:** use **`h2.`** / **`h3.`** at line start for sections and scenario titles — **not** `##` / `###` (GFM hashes become broken nested numbering in the Jira editor).
- **External links:** wiki **`[label|url]`** (pipe between label and URL) — **not** markdown `[label](url)`. Encode path underscores as **`%5F`** in the URL so wiki does not treat `_…_` as italic.
- **Stored description vs MCP display:** Jira persists **`fields.description` as wiki markup** (`h2.`, `[label|url]`, etc.). Some MCP helpers surface a **markdown-style** rendering for readability — that is **not** what the REST `PUT` round-trips. For **search-and-replace updates** (e.g. relabelling Notes links), match the **wiki** form **`[Old display text|`** → **`[New display text|`**. Replacing only markdown **`[Old](https://`** leaves wiki issues **unchanged** even when the API returns **204**.
- **Persona/Gherkin emphasis (wiki in `fields.description` / REST `PUT`):** Use **single-asterisk wiki bold** around each token — `*As a*`, `*I want*`, `*So that*`, `*Given*`, `*When*`, `*Then*`, `*And*` (verify against `GET /rest/api/2/issue/{key}?fields=description` on a known-good HRREC story). **Do not** push markdown-style `**As a**` inside wiki bodies; the editor can show mangled asterisks (e.g. `***As a***`). **GFM drafts** in `.md` may still use `**…**` for Git readability — translate to `*…*` when building the wiki string for Jira.
- **DoR table:** header row **`||Criterion||Any blocking issues…||`** only; **every data row** starts with **one** `|`; empty Notes cell as **`| … | |`** (space between the last two pipes) so the right column does not collapse.
- **Notes list vs Gherkin:** Notes **bullets** use **`* `** (asterisk + space), e.g. `* Figma design:`. Scenario lines use **`*Given*`** / **`*When*`** / **`*Then*`** with **no** space between the leading `*` and the keyword so Jira treats them as bold tokens, not list items.
- **Cross-story:** Confirm **430 Step 1c** epic scenario ledger was applied for this epic — no duplicate **scenario themes** across sibling stories; **Notes** contain `deferred to HRREC-nnnn` (or equivalent pointer) where generic error UX is owned by another issue.
- **Two-way-email default link labels (wiki `[label|url]`):** Figma display text **`2-Way Email Recruiting - MVP designs`**; PRD display text **`2-Way Email PRD doc`** (URLs unchanged — see initiative `.jirawiki` examples).

## Out of scope

- Replacing **430** for full backlog chains (410→420→430) — this skill only helps **description formatting** and consistency.
