# Discovery & Design Brief: GCC WhatsApp and Omnichannel Candidate Engagement (v45)

**PRD:** `docs/prds/gcc-whatsapp-omnichannel-candidate-engagement-prd.md`  
**Mission:** GCC-E2E-006 (Step 4 – 315 complete)  
**Research source:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v45.md`  
**Created:** 21 March 2026  
**Last updated:** 21 March 2026 (PASS 3–4, Final Verdict)  
**Agent:** 315-ux-designer  

**319 copy review:** `design/gcc-whatsapp-omnichannel-engagement-v45-copy-review.md`  

---

## Executive summary

This brief scopes **governed omnichannel candidate engagement** for GCC and global employers: **WhatsApp Business Platform** (templates, two-way within session rules), **email**, and **SMS (Workday Messaging) only where that product is available and eligible**, with **tenant policy**, **granular opt-in**, **retention**, **audit artefacts**, and **honest fallback** when WhatsApp is off or SMS is not eligible for the candidate number.

**Prototype intent (for 320, after approval):** deliver a **coherent pair of surfaces** reconciled with the narrower **`docs/prds/gcc-whatsapp-2way-communication-prd.md`** / **`design/gcc-whatsapp-2way-communication-discovery-brief.md`**: (1) **candidate profile** **Pattern B** with **`CommunicationDock`** and **unified timeline + omnichannel composer**; (2) **admin / configuration** **Pattern D** (dense workspace) for **channel policy, credentials / template sync, retention, and audit export**, referencing recruiter-flow table and hub density.

**Canvas Kit MCP:** `get-canvas-kit-tokens` consulted 21 March 2026; use **`docs://tokens/color-contrast`** and **`docs://tokens/color-roles`** for non-default semantic pairings.

**Deployment Agent (21 March 2026, thread `badd2e1a-61f1-4c0c-a4fc-092ca23dcaf5`):** 1-to-1 recruiter messaging today is **email** (**Send Message**, templates) and **SMS** (**Candidate Conversational Messaging for SMS**) from the **candidate profile collaboration panel** (**Candidate SMS** icon). Configuration aligns with patterns such as **Set Up Workday Messaging**, **Edit Tenant Setup - Notifications** (Recruiting notification delivery), **Edit Tenant Setup - Recruiting**, and **domain security** (e.g. **Manage: Candidate SMS Conversations**-style domains for a new channel).

**Functional knowledge:** In-repo PDFs under `functional-knowledge/` are not populated in this workspace snapshot; **data classification, purge, and retention** UI must stay aligned with **PRD Technical Architecture** and **050-functional-knowledge** when PDFs are available.

---

# PASS 1: Layout strategy

## 1. Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter (HR Professional) – primary

- **Outcome area:** **Manage candidates throughout the recruiting process** (plus implicit **keep candidates engaged** in that cluster).  
- **Verbatim worksheet lines:**  
  - Progress candidates through the stages of the pipeline as efficiently as possible  
  - Maintain data integrity throughout the recruiting process  
- **Synthesised JTBD:** *When I need to reach a candidate quickly on the channel my organisation allows (WhatsApp, email, or eligible SMS), I want **one governed place on the candidate profile to pick an enabled channel, use templates where required, and see a unified message history**, so I can **reduce shadow IT, respect consent and policy, and keep momentum** without switching to personal devices.*

### Recruiting / TA administrator – secondary

- **Outcome area:** Partner with people leaders / **maintain standards** (configuration and risk reduction).  
- **Synthesised JTBD:** *When corporate or regional policy changes (e.g. WhatsApp disabled for a legal entity), I want **clear tenant controls, retention settings, and audit exports**, so I can **enforce policy and support compliance processes** without custom engineering for standard toggles.*

### Candidate – tertiary (strings and recruiter-visible reflection only)

- **Worker cluster:** Engage with hiring organisation; transparent preferences.  
- **Prototype note:** Show **opt-in / opt-out state** and **consequences on send** on the recruiter surface; do not build the candidate handset UI.

### Prototype implications

- **Profile:** Channel **eligibility** and **consent** visible before send; **channel picker** only lists **enabled + eligible** channels; **GCC** demo shows **email fallback** when WhatsApp is off and SMS ineligible.  
- **Unified timeline** with **filter by channel** and optional **search** (representative row set).  
- **WhatsApp:** Template-first session open; **EN/AR preview** and **RTL-safe** preview body.  
- **Admin:** Toggles, sync, retention guardrails, **export** actions, optional **inbound quarantine** list.  
- **No** campaign builder, **no** bulk recipient grid as hero, **no** AI drafting (per PRD).

---

## 2. Shell pattern selection

| Surface | Pattern | Justification |
|--------|---------|----------------|
| **Candidate profile – omnichannel messaging** | **B** | Matches recruiter-flow **Pattern B** (candidate hub + primary cards + **right utility rail**). **Deployment Agent** places 1-to-1 comms on the **collaboration panel**; extend **`CommunicationDock`** for **email, SMS, WhatsApp** tiles and **one** panel story with omnichannel timeline + composer. |
| **Admin – channel policy, retention, audit** | **D** | Matches **`Recruiter_Hub_-_Candidates_for_a_Recruiter-…`** and **Job Requisitions** style (**Pattern D**): **tabs, filters, table**, high scanning density. Admin tasks in product often mirror **tenant setup** density rather than profile chrome. |
| **Optional entry** | **A+ → B** | If the demo opens from **Find Candidates** or **My Candidates** list, use **A+** list frame from manifest, then **B** on profile (see recruiter-flow README). |

**Note:** The user hypothesis “hub with filters + primary workspace” maps to **Pattern D** for **admin** and **list entry**; the **messaging hero** remains **Pattern B** on the **candidate profile**, consistent with **`design/references/recruiter-flow/README.md`** and the **Communication prototypes** note (combine **B** + **`CommunicationDock`** + Sana comm patterns).

---

## 3. Reference layouts (recruiter-flow manifest)

**Authority:** `design/references/recruiter-flow/README.md`

| Reference file (manifest) | Use for this initiative |
|----------------------------|-------------------------|
| **Pattern B** + comm note | Primary profile + **CommunicationDock** composition; align with **`design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png`**. |
| **`My_Candidates_-_Recruiter-….png`** / **`Find_Candidates_-_Recruiter-….png`** | **A+** list entry before profile if the story needs sourcing context. |
| **`Recruiter_Hub_-_Candidates_for_a_Recruiter-….png`** | **Pattern D** reference for **admin** tables (filters, row density). |
| **`Recruiter_Hub_-_Job_Requisitions-….png`** | Secondary **D** reference for tab + filter + table rhythm on admin pages. |

---

## 4. Layout regions

### Candidate profile (Pattern B)

| Region | Content |
|--------|---------|
| **Top** | **`WorkdayTopNav`** – Sana grey bar, pill search, utilities, avatar. |
| **Left** | **`WorkdayLeftTabBar`** – candidate hub: primary rail + **secondary** hub tabs (full set below). |
| **Center** | **White** cards on **`SANA_PAGE_CANVAS`**: header card (avatar, name, req metadata), **primary** tab panel content. **No breadcrumbs**; use **`Heading`** + metadata `BodyText`. |
| **Right** | **`CommunicationDock`** – rail tiles (**Email, SMS, WhatsApp**); sliding panel = **unified timeline** + **channel filter** + **omnichannel composer**. Reserve **`DEFAULT_COMM_RAIL_PX`**. |

### Admin – candidate engagement settings (Pattern D)

| Region | Content |
|--------|---------|
| **Top** | **`WorkdayTopNav`**. |
| **Left** | **`WorkdayLeftTabBar`** – represent **Recruiting** admin context (secondary title e.g. **Recruiting admin** or **Tenant setup**; tabs below). |
| **Center** | **`Tabs`** for admin sections; each panel: **`Card`** + **`FormField`** rows and / or **`Table`** + toolbar actions. |
| **Right** | None by default (keep density); optional **help** `Card` only if it aids scannability. |

---

## 5. Hierarchy

- **Dominant:** On profile, the **open CommunicationDock panel** shows **timeline + composer**; the **center** supports context (summary, consent module on **Summary** tab).  
- **Secondary:** Hub tab navigation; **channel filter** on timeline.  
- **Supporting:** Admin **tables** and **secondary buttons** (export, sync).  

---

## 6. Interaction model

- **Hub:** **`WorkdayLeftTabBar`** switches candidate sections; **every** tab has representative content (315 / 320 rule).  
- **Dock:** **Collapsed by default**; user opens **Email / SMS / WhatsApp** tile; panel can show **unified** thread regardless of tile focus, or **focus** channel on tile click (pick one in 320; default recommendation: **tile sets default channel in composer** and **scrolls** to latest on that channel).  
- **Timeline filter:** `Select` or **`Tabs`** sub-control: **All, WhatsApp, Email, SMS**.  
- **Composer:** **`FormSelect`** (or **`Select`**) for **channel**; **WhatsApp** path → **template** `Select` + **Preview** modal or inline **`Card`**; **session window** messaging uses **`SanaCommComposer`** where allowed.  
- **Admin:** **PrimaryButton** **Save changes**; **SecondaryButton** **Sync templates**; **Export audit log** opens **Modal** with format / date range (mock).  
- **Blocking flows:** **Modal** for **phone disambiguation** (duplicate candidates) and **template rejection** retry (PRD error handling).  

---

## 7. Layout framework (A–F)

| ID | Topic | Application |
|----|--------|----------------|
| **A** | JTBD | Recruiter **omnichannel governed send + history**; admin **policy and audit**. |
| **B** | Shell | **B** profile + **D** admin; **A+** optional list prelude. |
| **C** | Hierarchy | Panel and timeline first; center cards support **trust** (consent, eligibility). |
| **D** | Density | Profile: comfortable comm density (Sana references); admin: **table-forward**. |
| **E** | Accessibility | Visible labels, **`aria-label`** on rail tiles, **keyboard** path to composer, **contrast** via CK tokens / MCP **colour-contrast** resource. |
| **F** | Canvas coverage | **Profile:** `WorkdayTopNav`, `WorkdayLeftTabBar`, `Card`, `Tabs`, `Table`, `FormField`, `Select`, `Modal`, `Banner` (in-flow only), `CommunicationDock`, `SanaCommComposer`, `SanaCommMessageBubble`. **Admin:** `Tabs`, `Table`, `FormField`, `Checkbox`, `PrimaryButton`, `SecondaryButton`. |

---

## 8. Design validation (Six Hats – concise)

- **White:** PRD requires **policy split by tenant**, **SMS geography honesty**, **template catalogue** (not Notification Designer), **unified timeline**, **audit** classes; Deployment Agent confirms **SMS** and **email** patterns on **candidate profile** and **tenant setup** style tasks.  
- **Red:** **Wrong-candidate** send, **ambiguous phone**, **hidden SMS** in GCC when not eligible, **legal copy** drift.  
- **Yellow:** **Single spine** reduces shadow IT; **Arabic-capable** preview; **admin self-service** for toggles and exports.  
- **Black:** **Enterprise WhatsApp bans**, **provider outages**, **retention vs erasure** tension (flag for Legal).  
- **Green:** **Quarantine inbox** for inbound resolution; **saved template parameters** (future); **reporting drill-through** from audit row (future).  
- **Blue:** **Ship Pattern B + D** pair; **one** omnichannel panel grammar on profile; **admin** as **Pattern D** sibling screen in the prototype router.  

---

# PASS 2: UI composition (Canvas Kit + Sana)

## 1. Sana Style (`010-style-guide.mdc`)

- **`SANA_PAGE_CANVAS`**, **`SANA_TOP_NAV_BG`**, **`WorkdayTopNav`** pill search, **`WorkdayLeftTabBar`** grey secondary column, **pill** active hub tab.  
- **CommunicationDock:** `communicationRailButtonStyle`, **`SanaCommComposer`**, **`SanaCommMessageBubble`**, **`sanaCommFormControlStyle`** from `design/components/SanaCommPanelPatterns.tsx`.  
- **No breadcrumbs** or chevron path strips.  
- **Do not** use **warning `Banner`** only to say data is mock; use neutral **`BodyText`** for illustrative disclaimers if needed.  
- **WhatsApp mark:** small **inline SVG** acceptable (same as existing WhatsApp prototypes).  

---

## 2. Navigation completeness

### A. Candidate profile – `WorkdayLeftTabBar` tabs

Implement **all** with representative Canvas Kit content (no stubs):

| Tab ID | Representative content |
|--------|-------------------------|
| `summary` | Overview cards; **channel eligibility** + **consent summary** module; key application fields |
| `overview` | Skills / experience cards |
| `recruiting_history` | `Table` of events / stages |
| `attachments` | File list + actions |
| `reminders` | Upcoming tasks |
| `questionnaire_results` | Scores / completion |
| `interview` | Scheduled interviews |
| `screening` | Screening status + notes |
| `employment_offer` | Offer state |
| `personal_notes` | Notes list + add field |

### B. Candidate profile – CommunicationDock rail

| Tile | Role |
|------|------|
| **Email** | Sets composer to **email** (or opens email sub-panel state); show **Send message** affordance. |
| **SMS** | Visible **only** when **Workday Messaging eligibility** mock is true; otherwise **hidden** or **disabled** with tooltip: **SMS isn't available for this candidate's number in Workday. Use email or WhatsApp when your organisation allows it.** |
| **WhatsApp** | Visible when tenant **enabled**; **hidden** when tenant **disabled** (per PRD). |

### C. Admin page – `WorkdayLeftTabBar` (Recruiting admin context)

Use a compact admin hub; secondary tab labels are **editorial-final** per **319** (sentence case):

| Tab ID | Content |
|--------|---------|
| `channel_policy` | **Channel policy** – toggles, legal entity scope `Select`, **fallback** guidance |
| `credentials_sync` | **Credentials & template sync** – connection status, **Sync templates** |
| `retention` | **Retention** – Class A/B fields with guardrail help text |
| `audit_export` | **Audit & export** – export actions + **Table** of audit index rows |
| `inbound_review` | **Inbound review** – **quarantine** rows for ambiguous match (PRD phone resolution) |

### D. Admin center structure

**PASS 4 refinement:** Prefer **one vertical stack of `Card`s per left-tab panel** (channel policy, credentials, retention preview). Avoid a second full **`Tabs`** bar in the center unless a panel becomes overcrowded; **Pattern D** density comes from **forms + `Table`**, not duplicate tab rails.

---

## 3. Canvas Kit mapping (v14)

**Shared imports:** `design/components/index.ts` – **`WorkdayTopNav`**, **`WorkdayLeftTabBar`**, **`CommunicationDock`**, **`sanaShellTheme`**, **`SanaCommComposer`**, **`SanaCommMessageBubble`**, **`sanaCommFormControlStyle`**.

| UI element | Canvas Kit / shared component |
|-------------|-------------------------------|
| Page structure | `Box`, `Flex`, `Card` |
| Primary actions | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` |
| Forms | `FormField`, `FormField.Label`, `FormField.Input as={TextInput}` / `Select`, `Checkbox`, `Radio`, `RadioGroup` |
| Shared controls | `FormSelect`, `FormTextInput`, `FormDateInput` from `design/components/SharedFormControls.tsx` where applicable |
| Navigation | `Tabs` (`.List`, `.Item`, `.Panel`, **`data-id` + `initialTab`**) |
| Data | `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`) |
| Feedback | `Banner` (errors, success, **blocking** validation only), `Toast` optional |
| Text | `Heading`, `BodyText`, `Text` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |
| Overlays | `Modal`, `Popup` |
| Avatar / badges | `Avatar`, `CountBadge` |

**Tokens:** `colors.*`, `space.*` from `@workday/canvas-kit-react/tokens`; shell **`SANA_*`** from `sanaShellTheme.ts`.

**MCP resources:** Use **`docs://tokens/color-contrast`** when pairing **status** text on **soap** / **white** surfaces; **`docs://tokens/color-roles`** for **critical / caution / positive** on audit states.

---

## 4. Key UI blocks (profile panel)

1. **Panel header:** `Heading` + **Close** / collapse control (`ToolbarIconButton`).  
2. **Eligibility strip:** `BodyText` or **`Banner` variant="info"** when user-facing policy blocks (not mock disclaimer).  
3. **Consent row:** status + **View messaging consent** `TertiaryButton` → **`Modal`** with customer-owned legal copy (**060** before GA).  
4. **Timeline filter:** `FormSelect` – **All channels, WhatsApp, Email, SMS**.  
5. **Timeline:** scrollable list of **`SanaCommMessageBubble`** with **channel badge** (`Text` / `span` with token styling).  
6. **Composer:** `FormSelect` **Channel** → conditional: **Template** `FormSelect` + **Preview** for WhatsApp; **email** subject + body fields with Sana form control styles; **SMS** mirror SMS patterns when eligible.  
7. **Primary send:** `PrimaryButton` **Send message**; disabled with **`FormField` hint** when blocked.  

---

## 5. Key UI blocks (admin)

1. **Channel policy `Card`:** `Checkbox` **Enable WhatsApp**, **Enable SMS (Workday Messaging)** with help text on **geography**; `FormSelect` **Scope** (tenant / legal entity).  
2. **Credentials `Card`:** read-only **Connection status** `BodyText`; **SecondaryButton** **Sync templates**.  
3. **Retention `Card`:** numeric **retention** fields with **guardrail** captions (Legal-owned defaults).  
4. **Audit `Card`:** `Table` of **immutable index** rows (timestamp, actor, candidate ID, template, channel, outcome); **PrimaryButton** **Export audit log**; **SecondaryButton** **Download file** when export completes (mock).  
5. **Inbound review `Table`:** quarantine rows with **Resolve** → **Modal** to pick candidate.  

---

## 6. Experience principles (`docs/experience-principles.md`)

- **Empower:** Channel and template choices explicit; **no** silent send.  
- **Trust:** Delivery / error states; **honest** SMS eligibility; **clear** opt-out consequence.  
- **Grow:** Admin can **toggle** channels and **sync** templates; **export** audit without engineering.  

---

## 7. Approved copy inventory (319)

**Source:** `design/gcc-whatsapp-omnichannel-engagement-v45-copy-review.md` (21 March 2026). **320** implements these strings verbatim unless **060** / Legal revises **060-gated** lines before GA.

**060 before GA:** consent / opt-in / opt-out banners, messaging consent modal body, privacy link target, admin legal attestation checkbox, default retention help, and **319**-flagged template / session help if Legal requires wording changes. See copy-review **060** table.

### Buttons and CTAs

- Send message  
- Save changes  
- Export audit log  
- Sync templates  
- Resolve match  
- Apply template  
- Cancel  
- Close  
- Preview template  
- Download file  
- View messaging consent  
- Retry send  
- View channel policy  
- Learn about SMS eligibility  

### Labels and help (profile)

- **Channel** — *Only channels your organisation enabled for this candidate appear here.*  
- **Show** — *Filter messages by channel.*  
- **Template** — *WhatsApp needs an approved template to start or restart a conversation outside the session window.*  
- **Preview language:** English, Arabic  
- **Subject**, **Message**  
- **Session window:** *Session window: you can send free-form messages until [time]. After that, select a template.*  

### Banners (profile)

- **WhatsApp disabled:** **WhatsApp is turned off for your organisation. To contact this candidate, send an email.**  
- **SMS not eligible:** **SMS isn't available for this phone number in Workday. Use email, or WhatsApp if your organisation turned it on.**  
- **Combined:** **Use email to contact this candidate. WhatsApp is turned off for your organisation, and SMS isn't available for this number.**  
- **Consent missing:** **You can't send messages on this channel until the candidate opts in to messaging.** [060]  
- **Opt-out:** **This candidate opted out of messages on this channel. Sending is blocked.** [060]  

### Errors

- **Invalid phone:** **Enter a valid phone number in E.164 format (for example, +971 12 345 6789).**  
- **Ambiguous match:** **More than one candidate uses this phone number. Select the correct record, then send your message.**  
- **Template rejected:** **This template was rejected by the messaging provider. Review the error code, correct the template or parameters, then try again.**  
- **Send blocked – policy:** **Your organisation doesn't allow this channel for this candidate. Try another channel or contact your Workday administrator.**  
- **Webhook / transient:** **We couldn't send this message. Check your network connection and try again.**  

### Success / confirmation

- **Message sent**  
- **Template sync started. Refresh this page in a few minutes.**  
- **Export started. Download the file from your browser when it's ready.**  
- **Thread linked to this candidate record.**  

### Empty states

- **No messages yet. Select a channel to start the conversation.**  
- **No audit events match your filters.**  
- **No inbound messages need review.**  

### Loading states

- **Loading messages…**  
- **Sending message…**  
- **Syncing templates…**  

### Legal / consent (060 placeholders)

- **Messaging consent** (modal title)  
- Body: [Customer Legal copy — 060 review required]  
- **Privacy notice**  
- **I confirm that our legal team has reviewed the messaging disclosures.** [060]  

### Admin field labels

- **Enable WhatsApp** — *When this is off, recruiters don't see WhatsApp on the candidate profile.*  
- **Enable SMS (Workday Messaging)** — *SMS only works for supported regions, numbers, and tenant configuration. Recruiters see SMS only when this candidate and number are eligible.*  
- **Default retention (message bodies)** — *Keep retention within product guardrails and your organisation's legal retention policy.* [060]  
- **Apply to:** Entire tenant; Selected legal entity  

### Dock tiles (`aria-label`)

- Email messages  
- SMS messages  
- WhatsApp messages  

### SMS tile tooltip (gap filled by 319)

- **SMS isn't available for this candidate's number in Workday. Use email or WhatsApp when your organisation allows it.**  

---

## 8. Open points for 320 / programme

- Exact **security domain** names for WhatsApp actions (mirror **Manage: Candidate SMS Conversations** pattern).  
- Whether **email** composition in the dock uses the **exact** same task model as **Send Message** in production, or a **simplified** composer for the prototype.  
- **BSP vs Cloud API** credential fields (obscured secrets pattern).  

---

# PASS 3: Peer review (Design Reviewer)

## Strategy validation

| Check | Verdict |
|-------|---------|
| JTBD clear and worksheet-grounded | **Pass** — Recruiter omnichannel + admin policy jobs are specific and map to PRD outcomes. |
| Layout matches recruiter workflows | **Pass** — Profile collaboration panel + tenant setup density align with **Deployment Agent** placement. |
| Shell pattern justified | **Pass** — **B** for profile + dock; **D** for admin tables/forms; **A+ → B** optional for list entry per recruiter-flow README. |

## Layout quality

| Check | Verdict |
|-------|---------|
| Primary focus within ~3 seconds | **Pass** — Open **CommunicationDock** carries timeline + composer; **Summary** carries consent / eligibility. |
| Known Workday patterns | **Pass** — Recruiter-flow manifest + Sana WhatsApp panel reference; no breadcrumb strips. |
| Regions defined | **Pass** — Top / left / center / right on profile; admin omits right rail by design. |
| Visual competition | **Pass** — Single dock panel story; center cards support context without duplicating thread. |

## Design system validation

| Check | Verdict |
|-------|---------|
| Canvas Kit only | **Pass** — Mapping uses v14 compounds + shared `design/components`. |
| Sana Style | **Pass** — Tokens, dock, comm patterns per **010-style-guide.mdc**. |
| Invented UI | **None required** — WhatsApp SVG only, as allowed. |

## Navigation completeness

| Check | Verdict |
|-------|---------|
| All candidate hub tabs defined | **Pass** — Ten tabs with representative content mandated. |
| Dock rail + admin left nav | **Pass** — Email / SMS / WhatsApp + five admin sections. |
| Gap from 319 | **Closed** — SMS tooltip added to rail spec and copy inventory. |

## Copy quality (319-integrated)

| Check | Verdict |
|-------|---------|
| Editorial Guidelines | **Pass** — Sentence case, verb + noun primaries (**Send message**), British **organisation**, problem + solution errors. |
| Consistency | **Pass** — Harmonised **WhatsApp turned off**, **messaging provider**, **Workday administrator**. |
| Legal-sensitive | **Flagged** — **060** gates documented in copy review; brief does not claim Legal sign-off. |

## Experience principles (`docs/experience-principles.md`)

| Principle | How the design satisfies it |
|-----------|-----------------------------|
| **Empower** | Explicit channel + template choices; sends blocked with readable reasons. |
| **Trust** | Honest SMS / WhatsApp eligibility; provider and network errors are specific. |
| **Grow** | Admin toggles, sync, export without engineering for standard policy changes. |

**Peer review outcome:** No blocking design defects. Proceed to **PASS 4** once-through tightening only.

---

# PASS 4: Final improvements (one pass)

| Issue (from PASS 3 / 319) | Change applied |
|----------------------------|----------------|
| Primary CTA label | **Send** → **Send message** in key UI blocks and interaction model. |
| SMS rail gap | Tooltip string from **319** added to **CommunicationDock** table. |
| Consent CTA | **View consent details** → **View messaging consent** (319). |
| Admin button labels | **Sync templates now** → **Sync templates**; export / download aligned to **Export audit log** / **Download file**. |
| Redundant admin `Tabs` risk | Clarified: **center = `Card` stack per left tab**; avoid duplicate tab rails unless content forces it. |
| Copy inventory drift | **§7** replaced with **319-approved** inventory + **[060]** markers. |

**PASS 4 outcome:** Design is implementation-ready for **320** at prototype fidelity; remaining risk is **Legal** on gated strings, not layout or system fit.

---

# Final Discovery & Design Brief (handoff to 320)

## Scope snapshot

- **Screen A (Pattern B):** Candidate profile with full **`WorkdayLeftTabBar`**, **`CommunicationDock`** (Email / SMS / WhatsApp), unified timeline with **Show** filter, omnichannel composer, **319** banners and errors.  
- **Screen B (Pattern D):** Recruiting admin – **`WorkdayLeftTabBar`** sections **Channel policy**, **Credentials & template sync**, **Retention**, **Audit & export**, **Inbound review**; forms + tables; **no** right rail by default.  

## Implementation rules

1. Import **`WorkdayTopNav`**, **`WorkdayLeftTabBar`**, **`CommunicationDock`**, **`SanaCommComposer`**, **`SanaCommMessageBubble`**, **`sanaCommFormControlStyle`**, **`SANA_PAGE_CANVAS`** from `design/components`.  
2. **No `Breadcrumbs`** or path strips.  
3. **Dock collapsed by default**; rail `aria-label`s: **Email messages**, **SMS messages**, **WhatsApp messages**.  
4. Use **approved copy** in **§7** for all user-visible strings; **[060]** lines need Legal before customer-facing GA.  
5. Call **`get-canvas-kit-tokens`** when adding new semantic colours; use MCP **colour-contrast** for status text on neutrals.  

## Approved strings (canonical for 320)

Use **§7. Approved copy inventory (319)** in this document as the single in-brief source (mirrors `design/gcc-whatsapp-omnichannel-engagement-v45-copy-review.md`).

---

## Final Verdict: **APPROVED**

**315** completes **GCC-E2E-006 Step 4** with **Final Verdict: APPROVED**. **320-prototype-developer** may build from this brief + PRD at `docs/prds/gcc-whatsapp-omnichannel-candidate-engagement-prd.md`.

**Handoff:**

```
Discovery & Design complete for GCC WhatsApp and omnichannel candidate engagement (v45). Final Verdict: APPROVED.

Discovery Brief: design/gcc-whatsapp-omnichannel-engagement-v45-discovery-brief.md
PRD: docs/prds/gcc-whatsapp-omnichannel-candidate-engagement-prd.md
319 copy review: design/gcc-whatsapp-omnichannel-engagement-v45-copy-review.md

320: Build the Canvas Kit prototype from the Final Discovery & Design Brief and PRD. Implement §7 strings verbatim; respect [060] gates for production Legal sign-off.
```
