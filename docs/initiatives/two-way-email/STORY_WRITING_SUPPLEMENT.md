# Story writing supplement — profile two-way recruiting email (HRREC-82977)

**Layer 1 (initiative-specific).** Use with **430-story-writing** (universal process).  
**Hand-in-hand rule:** **430** defines how to write Jira stories; *this file* defines what **this** epic must say. Read this **after** story map + epic draft, **before** drafting summaries and BDD (Steps 5–6).

## Canonical links

| Artefact | Path / URL |
|----------|------------|
| Initiative manifest | [CONTEXT.md](CONTEXT.md) |
| PRD (requirements SoT) | [India candidate profile two-way recruiting email PRD](../../prds/india-candidate-profile-email-conversation-prd.md) |
| Decision log | [decisions.md](decisions.md) |
| Compose MVP exclusions (GenAI toolbar, templates, etc.) | `.cursor/rules/012-conversational-email-compose-mvp.mdc` |
| HITL pattern deep dive (why summaries expanded) | [drafts/out_batch/hitl_diff_cache/HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md](drafts/out_batch/hitl_diff_cache/HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md) |
| Shard → Jira mapping (bulk vs keys) | [drafts/out_batch/story-jira-mapping.json](drafts/out_batch/story-jira-mapping.json) |

**Jira epic:** [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977)

---

## Default `## Notes` / `h2. Notes` bullets (Jira Description)

Unless the PM opts out, include **exactly** these two bullets **after** the Definition of Ready table (GFM draft) and mirror them in **Atlassian wiki** (`* ` list + `[label|url]`, encode `_` in URLs as `%5F` per **430** Step 6):

1. **2-Way Email Recruiting - MVP designs** — Figma: `https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6913-20249&t=z4GjQzGKwojLlwJw-1`
2. **2-Way Email PRD doc** — Google Doc: `https://docs.google.com/document/d/13JkI_kUlyz6JfLDuEfSyheLPZ6K-P_oMP9ZeoHcvG_w/edit?usp=sharing`

**Wiki examples** (REST/MCP payloads): [drafts/jira-first-placeholder-HRREC-empty-state.jirawiki](drafts/jira-first-placeholder-HRREC-empty-state.jirawiki), [drafts/jira-story-notification-payload.jirawiki](drafts/jira-story-notification-payload.jirawiki)

### Gap review → Jira (`/user-story-gap-review`)

When you lift **Suggested missing BDD (Given/When/Then)** from the gap-review Confluence table into Jira, treat it as **draft** acceptance material until **430** Step 5–6 hardens it:

- Keep the same **Scenarios** / `*Given* / *When* / *Then* / *And*` shape as in the wiki examples above and **430** wiki output.
- Reconcile actors (**recruiter**, **privacy admin**, **candidate** context) and surfaces (**2-way email task**, **SSP**) with the vocabulary table in this supplement.
- Run **319** on any customer-visible **Then** strings before calling the text final.

---

## Summary line conventions (this initiative)

- **Prefix:** Use **`PH:`** in Jira **Summary** when the story map / team convention requires it (match existing children under HRREC-82977).
- **Slice in the title:** One MVP cut per ticket — e.g. **(UI only)**, **To, From & Subject (UI)**, **Send Message (No Attachments)** — so Three Amigos see routing without opening the BDD.
- **Persona/channel:** Prefer **non-agency** default in compose/consent stories when the PRD path is direct candidate; call out **agency** only when the story owns agency-specific chrome or routing.
- **Do not** duplicate the first scenario’s full **Given** in the Summary; keep persona + outcome + slice only.

---

## Vocabulary and surfaces (use consistently)

| Topic | Preferred wording (examples) |
|-------|-------------------------------|
| Permission | **Modify/Send** vs view-only; **Conversational Email** security domain (match PRD / XO naming). |
| Surface | **2-way email task** in the **sliding side panel** (SSP / candidate profile context as in PRD). |
| Message Builder | Distinguish **native Message Builder** controls vs **Recruiting custom** controls (e.g. custom **To** / **From** dropdowns replacing MB free-text). |
| UI-only spikes | **Visually render**, **UI framework in place**, **for visual layout purposes only** when send/persistence is owned elsewhere. |
| Send path | Stories that **dispatch** mail own **REST API**, polling/retry for thread visibility, double-send prevention — do not duplicate that contract on header-only stories. |

---

## Split-send matrix (avoid duplicate themes across siblings)

When breaking work from the story map, align summaries with **one row**:

| Slice | Typical summary focus | Body must not silently own |
|-------|-------------------------|----------------------------|
| Compose access | Opt-in, domain access, **non-agency** default, hide vs show controls | Full send + attachment delivery |
| Header chrome | **To, From, Subject** UI vs MB native fields | Recipient routing endpoints (unless this ticket owns API) |
| Attachments | Upload UI, validation, pills | Server-side send of attachment payload (unless owned here) |
| RTE / toolbar | MB editor + toolbar + Send/Discard **chrome** | GenAI on toolbar (**012** — explicit exclusion scenario if toolbar ships with AI elsewhere) |
| Send (no attachments) | REST dispatch, in-thread appearance, polling, disable Send in flight | Attachment-specific send |
| Bounce / errors | Literal headline + body copy, variants (hard bounce, complaint, …) | Generic “see error” without strings |

Use **Step 1c** ledger in **430** to ensure scenario titles do not collide with sibling issues.

---

## Negative / edge paths (initiative defaults)

- **012:** For compose-path stories, add scenarios for **excluded** MVP items (e.g. GenAI / templates) when the UI could otherwise imply they exist.
- **Discard / navigation:** Split **navigate away** vs **Discard button** vs **Escape** vs **empty editor** when the design specifies different behaviour; clarify **local UI state** vs server persistence in **Notes** when ambiguity caused HITL churn (see deep-dive doc).
- **Consent / RBAC:** First **Given** should name **opt-in state** and **domain access** when the story gates compose or send.

---

## Optional Notes bullets (430 alignment)

When stories touch **async thread visibility**, **draft loss on refresh**, or **MB vs Recruiting persistence**, add initiative-approved **Notes** lines (beyond the two default design links) — see deep-dive § on “no draft persistence” / polling.

---

## Related initiative docs

- User stories BDD draft: [drafts/user-stories-bdd-2-way-email.md](drafts/user-stories-bdd-2-way-email.md)
- HITL quantitative rollup: [drafts/out_batch/hitl_diff_cache/HITL_DIFF_REPORT.md](drafts/out_batch/hitl_diff_cache/HITL_DIFF_REPORT.md)
