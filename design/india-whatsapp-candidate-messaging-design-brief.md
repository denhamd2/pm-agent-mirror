# Design Brief: India WhatsApp and +91 SMS Candidate Messaging

**Status:** Draft after 315 PASS 1–2 (ready for 319 copy review, then 318 peer review)  
**Date:** 01 April 2026  
**Mission:** INDIA-PMF-006  
**PRD:** `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`  
**Target prototype:** `design/india-whatsapp-candidate-messaging-v88.tsx` (320, after 318 **APPROVED**)

**References read:** PRD; `design/candidate-smart-view-v86.tsx`; `design/docs/canvas-kit-patterns/communication-patterns.md`; `design/references/pattern-candidate-smart-view.md`; `design/references/pattern-hired-score-grid.md`; `docs/jtbd-recruiting-hr-professional-and-manager.md`; `docs/experience-principles.md`; Sana PNGs `Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` and `Sana_Style_UI-candidate-profile-whatsapp-panel.png`; Canvas Kit MCP `get-canvas-kit-tokens`; Workday Deployment Agent (placement).

---

## PASS 1: Layout Strategy

### 1. JTBD (worksheet-aligned)

**Primary persona:** Recruiter (high-volume, India).

**Worksheet alignment:** *Talent Acquisition → Manage candidates throughout the recruiting process*

- Progress candidates through the stages of the pipeline as efficiently as possible  
- *(Implicit)* Keep candidates engaged through the process  

**Synthesised job statement:**  
When I am moving India candidates through screening, interview, and offer steps, I want to reach them on WhatsApp or +91 SMS with governed templates and a clear consent and delivery record, so I can reduce chase time, avoid personal-device workarounds, and stay defensible for DPDP.

**Prototype implications:** One obvious **Messaging** workspace on the candidate record; **consent state** visible before send; **template-first** WhatsApp send; **SMS** with limits and auto footer; **thread + delivery metadata** on the record; **bulk** flow with per-candidate consent resolution and preview.

### 2. Shell pattern

**Individual candidate (primary): Pattern B (hub-style profile)** implemented via **`ProfilePageLayout`**: global `WorkdayTopNav`, optional `WorkdayLeftTabBar` hub navigation, main content as tabbed workspace, optional `CommunicationDock` (collapsed by default per communication patterns).

**Rationale:** PRD places **Messaging** alongside **Activity**, **Documents**, and **Questionnaire**. That matches hub-style profile navigation, not the three-column **Candidate Smart View** carousel in `candidate-smart-view-v86.tsx`. **v88** should reuse **v86’s Sana surface treatment** (e.g. `SANA_PAGE_CANVAS`, card radii, `StatusIndicator`, typography hierarchy) while using **ProfilePageLayout** for tabbed candidate profile structure.

**Secondary (bulk): Pattern per `pattern-hired-score-grid.md`:** `WorkdayTopNav` + `WorkdayLeftTabBar` + main column with filters + `Table`, toolbar bulk actions, `HiredScoreGrading` **`variant="full"`** in the grade column when HiredScore is shown.

### 3. Real layouts and pattern libraries

| Source | Use |
|--------|-----|
| `pattern-candidate-smart-view.md` | Visual density, card treatment, optional CommunicationDock notes; **do not** force three-column carousel if it fights the Messaging tab PRD |
| `communication-patterns.md` | `SanaCommMessageBubble`, `SanaCommComposer`, `sanaCommFormControlStyle`, channel `SecondaryButton` toggles, `CommunicationDock` widths (chat ~450px) |
| `pattern-hired-score-grid.md` | Find Candidates bulk messaging: table, bulk toolbar, filters |
| `candidate-smart-view-v86.tsx` | Token and component tone for recruiter-facing Sana UI (cards, borders, headings) |

### 4. Deployment Agent placement note

**Deployment Agent guidance:** Existing recruiter messaging patterns emphasise **Send Message** tasks, templates, history on the profile, and **collaboration-style panels** for contextual messaging rather than a primary tab.

**Design decision (PRD precedence for INDIA-PMF-006):** Ship **Messaging as a first-class profile tab** so consent, template choice, channel choice, delivery status, and audit-friendly history sit in the **main workspace** (DPDP transparency and training). **Optional later alignment:** same conversation opens from a **CommunicationDock** rail icon (collapsed default) without duplicating business rules; single underlying “conversation” model.

### 5. Six Hats synthesis (placement trade-off)

| Hat | Note |
|-----|------|
| White | PRD mandates tab + bulk; DA describes dock-first habit |
| Red | India recruiters expect WhatsApp in one obvious place |
| Yellow | Tab surfaces consent + template governance without hiding behind a rail |
| Black | Two entry points (tab + dock) could diverge if not one model |
| Green | Single conversation state; dock = optional launcher |
| Blue | **Proceed with Messaging tab as canonical; dock optional** |

### 6. Layout regions

**Candidate profile (Messaging tab):**

- **Top:** `WorkdayTopNav` (grey bar, pill search).  
- **Left:** `WorkdayLeftTabBar` hub: recruit sections + **profile tabs** including **Messaging**.  
- **Center (primary):** Messaging workspace: consent strip, channel toggle, thread, composer, template picker.  
- **Right (optional):** `CommunicationDock` collapsed; if expanded, WhatsApp/SMS panels reuse same bubble/composer patterns.

**Find Candidates (bulk flow):**

- **Top:** `WorkdayTopNav`.  
- **Left:** Primary + secondary hub nav.  
- **Center:** Filter column + grid `Table` + bulk action toolbar.  
- **Right:** None by default; bulk flow uses **Modal** overlay for preview.

### 7. Hierarchy

- **Dominant:** Message thread (read and scan).  
- **Secondary:** Consent status + channel (WhatsApp vs SMS) + template selector (WhatsApp).  
- **Supporting:** Delivery line on each message; recruiter attribution; link to consent history.

### 8. Interaction model

- **Tabs:** Profile-level `Tabs` or `WorkdayLeftTabBar`-driven panels: **Overview**, **Activity**, **Documents**, **Questionnaire**, **Messaging** (all navigable in v88; **Messaging** fully detailed, others representative content per 320 content-richness bar).  
- **Modals:** Bulk send **preview and confirm**; **Send consent request** confirmation; **Blocked** explanation when opted out.  
- **Inline:** SMS character count and footer preview; WhatsApp template merge field preview.

### 9. Layout Framework A–F

| Letter | Application |
|--------|-------------|
| **A – JTBD** | Engagement + pipeline speed + compliance on the record |
| **B – Shell** | Hub profile (B) + grid shell for bulk (canonical grid) |
| **C – Hierarchy** | Thread first; consent and channel above composer |
| **D – Density** | Thread scrolls; metadata small; avoid duplicate chrome |
| **E – Accessibility** | `FormField` labels, live region for send confirmation, modal focus trap, channel toggle keyboard support |
| **F – Canvas coverage** | v14: `Card`, `Flex`, `Box`, `Tabs`, `Table`, `Modal`, `Banner`, `FormField`, `TextInput`, `StatusIndicator`, `PrimaryButton`, `SecondaryButton`, `SystemIcon`, `Avatar`, `Pagination` where needed |

---

## PASS 2: UI Composition (Canvas Kit)

### 0. Canvas Kit discovery

**MCP:** `get-canvas-kit-tokens` returned resource index (colour roles, migration guides, v4 space/shape guides). Prototypes in this repo use **`@workday/canvas-kit-react` v14** with `colors`, `space` from `@workday/canvas-kit-react/tokens` per existing design files.

**Component set for this feature:** Layout (`Box`, `Flex`, `Card`), actions (`PrimaryButton`, `SecondaryButton`), text (`Heading`, `BodyText`), data display (`Table`, `StatusIndicator`, `Avatar`), navigation (`Tabs`), forms (`FormField`, `TextInput`, `Checkbox` for row select), feedback (`Modal`, `Banner`), icons (`SystemIcon`).

### 1. Map layout → components

**Profile shell**

| Area | Component |
|------|-----------|
| Page | `ProfilePageLayout` from `design/components/ProfilePageLayout.tsx` |
| Top | `WorkdayTopNav` |
| Hub | `WorkdayLeftTabBar` with tab ids: `overview`, `activity`, `documents`, `questionnaire`, `messaging` |
| Optional | `CommunicationDock` (default collapsed), channels WhatsApp / SMS / Email if demo needs parity with Sana refs |

**Messaging tab content (main column)**

| Element | Component |
|---------|-----------|
| Page title | `Heading size="large"` (e.g. “Messaging”) |
| Consent summary | `Banner` variant per state (info / caution / critical) **or** `Card` + `StatusIndicator` rows for compact layout; pick one pattern per screen and stay consistent |
| Channel switch | Two `SecondaryButton`s (WhatsApp vs SMS) with active state `backgroundColor: colors.blueberry400`, `color: colors.frenchVanilla100` per `communication-patterns.md` |
| Thread | Vertical `Flex`; each message `SanaCommMessageBubble` from `SanaCommPanelPatterns.tsx` |
| Delivery row | `BodyText size="small"` + `StatusIndicator` for discrete states (see Visual Indicators) |
| WhatsApp template | `FormSelect` from `design/components/SharedFormControls.tsx` for template name; `TextInput` or read-only `Box` for merged preview |
| SMS body | `TextInput` multiline or `TextArea` if available; else `TextInput` with height; style helper `sanaCommFormControlStyle` |
| Composer | WhatsApp: show template-driven preview + optional note field if policy allows; SMS: `SanaCommComposer` pattern (pill + send) per patterns doc |
| Primary send | `PrimaryButton` “Send message” (disabled until consent OK / template valid) |
| Secondary | `SecondaryButton` “Send consent request”, `SecondaryButton` “View consent history” (opens `Modal` or navigates to panel) |

**Find Candidates bulk**

| Element | Component |
|---------|-----------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar`, `Flex` main |
| Grid | `Table` with `Checkbox` in first column |
| Grade column | `HiredScoreGrading variant="full"` |
| Bulk toolbar | `SecondaryButton` “Send message” when rows selected |
| Preview modal | `Modal` + `Table` of recipients, columns: name, channel, consent, blocking reason |
| Summary | `BodyText` + `StatusIndicator` counts (sent, delivered, read, replied) as per PRD |

### 2. Sana Style (mandatory)

Validated against:

- `Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`: light grey page canvas, white cards, soft radii, restrained blue for primary actions and active channel.  
- `Sana_Style_UI-candidate-profile-whatsapp-panel.png`: pill composer, circular send, bubble borders, vertical channel rail.

**Apply:** `SANA_PAGE_CANVAS` background; white `Card` with `SANA_CARD_RADIUS_LG` and `SANA_CARD_SHADOW`; `soap300` / `soap400` borders; blue accent for primary and active channel only.

### 3. Navigation completeness (all tabs)

| Tab id | Purpose | v88 content expectation |
|--------|---------|-------------------------|
| `overview` | Snapshot | Header metadata, stage, key contacts (representative) |
| `activity` | Timeline | Mixed activities (representative list) |
| `documents` | Files | Table of documents (representative) |
| `questionnaire` | Q&A | Short questionnaire summary (representative) |
| `messaging` | WhatsApp + SMS | **Full interactive spec** (this brief) |

No breadcrumbs or chevron path strips (`010-style-guide.mdc`).

### 4. Shared components (mandatory hooks)

- `WorkdayTopNav`, `WorkdayLeftTabBar`, `ProfilePageLayout`, `CommunicationDock` (optional).  
- Messaging: `SanaCommComposer`, `SanaCommMessageBubble`, `sanaCommFormControlStyle`.  
- Filters / template dropdown: `FormSelect`, `FormTextInput` from `SharedFormControls.tsx` where applicable.

### 5. Experience Principles (mandatory validation)

**Empower**  
Outcome is “message the candidate safely”, not “complete a system object”. Recruiter chooses channel and template; bulk preview shows who is excluded and why. **Rationale:** Explicit previews and channel choice keep the human in control.

**Trust**  
Show consent state, delivery state, and template name on send; immutable thread history. **Rationale:** Aligns with PRD audit and DPDP transparency.

**Grow**  
Template updates are admin-owned (out of band in v88); recruiter can revise SMS body before send; consent history discoverable. **Rationale:** Reduces one-off support escalations for “why can’t I send?”.

### 6. Copy Inventory (for 319 review)

#### Buttons and CTAs

- Primary: “Send message”  
- Secondary: “Cancel”, “Back”, “Close”, “View consent history”, “Send consent request”, “Use email instead” (fallback link if in scope)  
- Bulk: “Send message”, “Review selection”, “Confirm send”, “Download report” (optional, future)  

#### Form labels and help

- “Channel” (help: “Choose how to contact this candidate.”)  
- “Template” (help: “WhatsApp requires an approved template for outbound messages.”)  
- “Message preview”  
- “SMS message” (help: “Standard SMS charges may apply. An opt-out footer is added automatically.”)  
- “Personal note” (WhatsApp, if allowed: help: “Only add text your organisation allows inside the 24-hour window or template rules.”)  
- Search / filter (bulk): “Find candidates”, “Stage”, “Consent status”  

#### Errors

- “You can’t send a WhatsApp message until the candidate consents.”  
- “This candidate opted out of WhatsApp on [date]. Use another channel.”  
- “No mobile number on file. Add a number before sending SMS or WhatsApp.”  
- “This template is missing data for one or more merge fields.”  
- “Unable to send. Check your connection and try again.”  

#### Success / confirmation

- “Message sent.”  
- “Consent request sent.”  
- “Bulk send complete. [n] sent, [n] failed.”  

#### Empty states

- **No thread yet:** Heading: “No messages yet” / Body: “When you send a message, the conversation appears here.” / CTA: “Send message”  
- **No templates:** “No approved WhatsApp templates are available. Contact your administrator.”  

#### Loading

- “Loading messages…”  
- “Sending…”  
- “Loading candidates…”  

#### Legal / consent (flag 060 for 319)

- Consent strip (short): “Messaging consent: granted for recruiting (WhatsApp, SMS).” / “Messaging consent: not recorded.” / “WhatsApp opted out on [date].”  
- Consent request confirm: “Send a consent request to this candidate? They must opt in before you can message them on this channel.”  
- SMS footer preview label: “Opt-out footer (automatic):”  
- Bulk preview: “By confirming, you send only to candidates with valid consent. Others are skipped.”  

#### Bulk preview table

- Column headers: “Candidate”, “Channel”, “Consent”, “Status”  
- Row status examples: “Will send”, “Skipped – no consent”, “Skipped – opted out”  

#### CommunicationDock rail (if used)

- “WhatsApp”, “SMS”, “Email” (aria-labels match visible labels)  

### 7. Visual Indicators Specification (for 320)

**Delivery and read states (per message or aggregate)**

| Context | Specification |
|---------|----------------|
| Sent | `StatusIndicator type={Grey} emphasis={Low} label="Sent"` |
| Delivered | `StatusIndicator type={Blue} emphasis={Low} label="Delivered"` |
| Read | `StatusIndicator type={Blue} emphasis={High} label="Read"` |
| Replied | `StatusIndicator type={Green} emphasis={Low} label="Replied"` |
| Failed | `StatusIndicator type={Red} emphasis={High} label="Failed"` |

**Consent chips**

| Context | Specification |
|---------|----------------|
| Granted | `StatusIndicator type={Green} emphasis={Low} label="Consent granted"` |
| Pending | `StatusIndicator type={Orange} emphasis={Low} label="Consent pending"` |
| Withdrawn / opted out | `StatusIndicator type={Red} emphasis={Low} label="Opted out"` |

**Skills / tags** (e.g. source tags on profile header)

- `StatusIndicator type={Gray} emphasis={Low}` per chip.

**Button hierarchy**

- Send vs cancel: `PrimaryButton` + `SecondaryButton`.  
- Move forward / reject on header (if shown): **equal weight** → `SecondaryButton` + `SecondaryButton` per `ProfilePageLayout` doc.  
- Never `TertiaryButton` for destructive or blocking actions.

**Icons**

- Document link: `SystemIcon icon={fileIcon} size={20}`  
- Calendar / schedule merge: `SystemIcon icon={calendarIcon} size={16}`  
- Channel rail: chat / device / mail icons from `@workday/canvas-system-icons-web` at 20–24px  

**Avatars**

- Candidate header: `Avatar size={Avatar.Size.l}` or xl per existing profile patterns.  
- Bubble avatars: small circle per `SanaCommMessageBubble` implementation.

**Metadata**

- Timestamps: `BodyText size="small" color={colors.blackPepper600}` with middot separators where needed.

**HiredScore**

- Bulk grid: `HiredScoreGrading variant="full"` in dedicated column.

---

## Handoff

- **319:** Copy Inventory (section 6); legal strings flagged for 060.  
- **318:** Peer review against patterns, Sana, and Canvas Kit rules.  
- **320:** Implement `india-whatsapp-candidate-messaging-v88.tsx` from this brief + **APPROVED** verdict + PRD; register route and Vite slug per `320-prototype-developer.mdc`.

---

## STOP

315 PASS 1–2 complete. No PASS 3–4 in this document.

---

## 319 Copy Review

**Reviewer:** 319-copy-review (Editorial Guidelines skill + `319-copy-review.mdc`)  
**Date:** 01 April 2026  
**Mission:** INDIA-PMF-006  
**Inputs:** PASS 2 §6 Copy Inventory; PRD `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`; `.cursor/skills/editorial-guidelines/SKILL.md`

### Summary

| Category | Notes |
|----------|--------|
| **Baseline quality** | Copy Inventory is already mostly sentence case, action-led, and aligned with **Candidate** terminology. |
| **Changes** | A few errors need an explicit **next step**; one bulk success line should use clearer wording and numerals; channel fallback link should start with a verb. |
| **British English** | Use **organisation** in recruiter-facing help (already correct in personal note help). Avoid US-only shortenings such as **admin** in user-facing strings. |
| **060 Legal compliance** | All **consent**, **opt-out**, **DPDP-relevant** explanations, and **bulk-send legal confirmations** remain **pending 060**; editorial polish below does **not** replace legal sign-off. |

### Legal-sensitive strings (060 review required)

Flag for **060-legal-compliance-review** before freezing in product, marketing, or candidate-facing surfaces:

- Consent strip variants: *Messaging consent: granted…*, *not recorded*, *WhatsApp opted out on [date]*
- Consent request confirmation: *Send a consent request…* / *opt in* / *this channel*
- SMS footer preview label and any **shown** footer text (opt-out wording)
- Bulk preview: *By confirming, you send only to candidates with valid consent. Others are skipped.*
- Any candidate-visible consent request or SMS body (including auto-appended footer) defined in implementation
- Error copy that references **consent**, **opt-out**, or **channel blocking** where it could be construed as a legal statement

**060 status:** Not executed in this pass; **pending**.

### Approved copy (replace Copy Inventory strings with these unless 060 revises legal lines)

#### Buttons and CTAs

| Was (inventory) | Approved | Rationale |
|-----------------|----------|-----------|
| Send message | **Send message** | Keep. Verb + object, sentence case. |
| Cancel / Back / Close | **Cancel** / **Back** / **Close** | Keep. Standard patterns. |
| View consent history | **View consent history** | Keep. Verb-led link/button. |
| Send consent request | **Send consent request** | Keep. |
| Use email instead | **Send email instead** | Clearer action; avoids vague “use”. (060: confirm if email is in scope for v1.) |
| Review selection | **Review selection** | Keep. |
| Confirm send | **Confirm and send** | Slightly clearer consequence (two beats: confirm, then send). |
| Download report | **Download report** | Keep. Optional/future. |

#### Form labels and help

| Was | Approved | Rationale |
|-----|----------|-----------|
| Channel (+ help) | **Channel** · Help: **Choose how to contact this candidate.** | Keep. |
| Template (+ help) | **Template** · Help: **WhatsApp needs an approved template for outbound messages.** | “Requires” → “needs” reads more natural; same meaning. |
| Message preview | **Message preview** | Keep. |
| SMS message (+ help) | **SMS message** · Help: **Standard SMS charges may apply. An opt-out footer is added automatically.** | Keep; **060** on “charges” and footer claims. |
| Personal note (+ help) | **Personal note** · Help: **Only add text your organisation allows under the 24-hour window or template rules.** | “Inside” → “under”; British **organisation**. (060: template/window rules.) |
| Find candidates | **Find candidates** | Keep. |
| Stage | **Stage** | Keep. |
| Consent status | **Consent status** | Keep. |

#### Errors

| Was | Approved | Rationale |
|-----|----------|-----------|
| You can’t send a WhatsApp message until the candidate consents. | **You can’t send a WhatsApp message until this candidate consents. Send a consent request first.** | Problem + **explicit next step** (319 error pattern). “This candidate” matches nearby copy. |
| This candidate opted out of WhatsApp on [date]. Use another channel. | **This candidate opted out of WhatsApp on [date]. Use email or another channel your organisation allows.** | Problem + solution; ties to PRD fallback; **060** on channel claims. |
| No mobile number on file. Add a number before sending SMS or WhatsApp. | **No mobile number on file. Add a mobile number before you send SMS or WhatsApp.** | Minor clarity; keeps both channels. |
| This template is missing data for one or more merge fields. | **This template is missing data for one or more merge fields. Complete the missing values or choose another template.** | Adds **solution** sentence. |
| Unable to send. Check your connection and try again. | **We couldn’t send this message. Check your connection and try again.** | Slightly less blamey; still problem + action (editorial skill). |

#### Success / confirmation

| Was | Approved | Rationale |
|-----|----------|-----------|
| Message sent. | **Message sent.** | Keep. |
| Consent request sent. | **Consent request sent.** | Keep. |
| Bulk send complete. [n] sent, [n] failed. | **Bulk send finished. [n] sent, [n] failed.** | “Finished” avoids ambiguity with “complete” status; use **numerals** for live counts (Editorial Guidelines). |

#### Empty states

| Was | Approved | Rationale |
|-----|----------|-----------|
| No messages yet / body / CTA | **No messages yet** / **When you send a message, the conversation appears here.** / **Send message** | Keep. |
| No approved WhatsApp templates… | **No approved WhatsApp templates are available. Contact your Workday administrator.** | Adds **Workday** context; full word **administrator**. |

#### Loading

| Was | Approved | Rationale |
|-----|----------|-----------|
| Loading messages… | **Loading messages…** | Keep (ellipsis consistent). |
| Sending… | **Sending…** | Keep. |
| Loading candidates… | **Loading candidates…** | Keep. |

#### Legal / consent (wording suggestions; **all subject to 060**)

| Was | Suggested editorial draft | Note |
|-----|---------------------------|------|
| Messaging consent: granted for recruiting (WhatsApp, SMS). | **Messaging consent: granted for recruiting (WhatsApp and SMS).** | “And” reads cleaner in UK English; **060** must validate substance. |
| Messaging consent: not recorded. | **Messaging consent: not recorded.** | Keep unless Legal prefers “not on file” / purpose-specific wording. |
| WhatsApp opted out on [date]. | **WhatsApp: opted out on [date].** | Aligns with PRD-style status line; **060**. |
| Send a consent request… (confirm modal) | **Send a consent request to this candidate? They must opt in before you can message them on this channel.** | Keep with **060** pass for DPDP accuracy and channel definition. |
| Opt-out footer (automatic): | **Opt-out footer (automatic)** | Drop colon in labels if UI pattern is label + value below; otherwise keep colon per implementation. **060** on actual footer text. |
| By confirming, you send only… | **By confirming, you send only to candidates with valid consent. Other candidates are skipped.** | “Others” → **Other candidates** for clarity; **060**. |

#### Bulk preview table

| Was | Approved | Rationale |
|-----|----------|-----------|
| Candidate, Channel, Consent, Status | **Candidate**, **Channel**, **Consent**, **Status** | Keep (short column titles; sentence case equals same form here). |
| Will send | **Will send** | Keep. |
| Skipped – no consent | **Skipped - no consent** | Hyphen separator per **010-style-guide.mdc** (no em dash). |
| Skipped – opted out | **Skipped - opted out** | Same. |

#### CommunicationDock rail

| Was | Approved | Rationale |
|-----|----------|-----------|
| WhatsApp / SMS / Email | **WhatsApp**, **SMS**, **Email** | Keep; brand/channel nouns. **aria-label** should match visible label. |

#### Visual indicators (§7 labels for 320 alignment)

| Was | Approved | Rationale |
|-----|----------|-----------|
| Sent, Delivered, Read, Replied, Failed | **Sent**, **Delivered**, **Read**, **Replied**, **Failed** | Keep. |
| Consent granted / pending / Opted out | **Consent granted**, **Consent pending**, **Opted out** | Keep; consistent with strip copy. |

### Terminology consistency

- Use **candidate** (not applicant) for this recruiter-facing UI; already correct.
- Use **WhatsApp** and **SMS** consistently; **+91** may appear in field-level or admin docs per PRD but need not clutter every button label.
- Align **opted out** / **opt out** (verb) usage: status labels **Opted out**; body copy **opt out** as verb; OK.

### Gaps to add in 320 (not in original inventory)

Consider adding concise copy for:

- **Blocked send (generic):** **You can’t send to this candidate right now. Review consent or choose another channel.** (060)
- **24-hour window warning (WhatsApp):** if surfaced in UI, **060** + product policy
- **Partial bulk failure toast:** **Couldn't send to [n] candidates. Review the report or try again.** (numerals; British **couldn’t**)

### Handoff

- **318:** Peer review can assume §6 Copy Inventory as **draft**; **approved strings** for implementation are this **§319** table unless **060** overrides legal rows.
- **320:** Implement **Approved** column; legal rows only after **060** confirmation.
- **060:** Run compliance review on **Legal-sensitive strings** above before prototype handoff to **330**.


## PASS 3: Peer Review Findings

**Reviewer:** 318-design-peer-reviewer  
**Date:** 01 April 2026  
**Mission:** INDIA-PMF-006  
**Inputs:** This brief (PASS 1–2, §319); PRD `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`; `docs/jtbd-recruiting-hr-professional-and-manager.md`; `docs/experience-principles.md`; `design/references/pattern-candidate-smart-view.md`; `design/docs/canvas-kit-patterns/communication-patterns.md`; `design/references/sana/README.md` (PNG filenames cited in the brief are **not** present in the workspace; only the README lists them). Canvas Kit MCP `get-canvas-kit-tokens` invoked (resource index: token migration, colour roles, v14/v4 guides).

### PASS 1 (strategy, JTBD, shell, layout)

| Area | Verdict | Notes |
|------|---------|--------|
| **JTBD vs worksheet** | **Strong** | Cites **Talent Acquisition → Manage candidates throughout the recruiting process** with verbatim bullets; synthesised job statement is outcome-led (governed channels, consent, audit), not a feature list. |
| **Shell pattern** | **Strong** | **Pattern B (hub / `ProfilePageLayout`)** is justified against PRD (Messaging tab with Activity, Documents, Questionnaire). Explicit contrast with **Candidate Smart View** three-column carousel is correct per `pattern-candidate-smart-view.md` (that pattern omits hub nav and optimises resume compare). |
| **Primary focus (3 seconds)** | **Strong** | Dominant thread, consent and channel above composer; bulk flow defers detail to modal. Regions (top / left / centre / optional dock) are explicit. |
| **Deployment Agent tension** | **Documented** | Dock-first habit vs tab-first for DPDP/training is surfaced; Six Hats resolves **tab canonical, dock optional** with single conversation model. |
| **HiredScore bulk** | **Strong** | `HiredScoreGrading variant="full"` in grid column matches `pattern-hired-score-grid.md` and 318 checklist. |
| **recruiter-flow PNG callout** | **Minor gap** | Layout is grounded in pattern libs and `candidate-smart-view-v86.tsx`; there is no explicit pointer to a named file under `design/references/recruiter-flow/`. Acceptable given PRD-driven hub choice, but 320 should still match **WorkdayTopNav + hub** density from existing Sana shell prototypes. |

### PASS 2 (Canvas Kit, Sana, navigation, copy)

| Area | Verdict | Notes |
|------|---------|--------|
| **Component mapping** | **Strong** | `ProfilePageLayout`, `WorkdayTopNav`, `WorkdayLeftTabBar`, `SanaCommMessageBubble`, `SanaCommComposer`, `sanaCommFormControlStyle`, `CommunicationDock`, `Table`, `Modal`, `FormField`, `StatusIndicator`, `HiredScoreGrading` align with **315**, **320**, and `communication-patterns.md`. Email is optional in dock only; PRD-primary channels (WhatsApp, SMS) match **communication-patterns** (no invented threading). |
| **v75 checklist** | **Met** | Status and tags as `StatusIndicator` (not custom Box); button pairs avoid `TertiaryButton` for blocking/destructive; profile reuse via `ProfilePageLayout`. |
| **API precision** | **Flag for 320** | Visual Indicators table uses pseudocode `type={Grey}`. Canvas Kit **StatusIndicator** enums use **Gray** (US spelling), e.g. `StatusIndicator.Type.Gray`. 320 must implement valid v14 APIs, not copy `Grey` literally. |
| **SMS body control** | **Flag for 320** | “`TextInput` multiline or `TextArea` if available” is under-specified. Prefer **one** documented component after a quick check of shared patterns / Canvas Kit (avoid dual implementation paths in v88). |
| **Consent surface** | **Acceptable with discipline** | “`Banner` **or** `Card` + `StatusIndicator` — pick one” is correct to avoid duplication; 320 should default to **one** pattern for Messaging tab and stick to it across states (loading / error / consent). |
| **Sana validation** | **Blocked in repo** | Brief references PNGs under `design/references/sana/`; current tree has **README only**. Visual benchmark against those files cannot be done from version-controlled assets until PNGs are restored or reviewers use local copies. Token intent (`SANA_PAGE_CANVAS`, card radii, soap borders) remains consistent with **010** and **communication-patterns**. |
| **Navigation** | **Complete** | Tab ids and v88 expectations are clear; **no** breadcrumbs or chevron paths (010). |

### Experience principles (mandatory)

• **Empower** — **Upheld.** Channel and template choice sit with the recruiter; bulk preview lists who sends vs skips; no auto-send. Example: bulk modal columns (Candidate, Channel, Consent, Status) and secondary actions (“Send consent request”, “View consent history”).  
• **Trust** — **Upheld.** Consent strip, per-message delivery metadata, immutable thread framing, and 319-approved error copy (problem + next step) support transparency. **Caveat:** legal strings remain **060 pending** per §319.  
• **Grow** — **Partially upheld in brief narrative; align copy with PRD.** PRD states TA leaders can edit templates **without IT dependency** (self-service). PASS 2 §5 says template updates are **admin-owned out of band in v88**, which is a reasonable **prototype scope** cut but reads weaker than PRD for **Grow**. Recommendation: treat v88 as **no template-admin UI**, but clarify in prototype notes that product intent matches PRD self-service for GA; recruiter-side **SMS edit before send** and **consent history** still support Grow for the prototype story.

### Copy (spot check, post-319)

• **Strong:** Sentence case, verb-led CTAs, numerals in bulk summary, hyphens for “Skipped - …” per 010, British **organisation** where applied.  
• **060:** Legal/consent rows correctly flagged **not** final.

### Canvas Kit MCP

`get-canvas-kit-tokens` confirms documentation resources for **v14 migration**, **colour roles**, and **v4 space/shape** guides; brief’s use of `colors.blueberry400`, `colors.frenchVanilla100`, `colors.soap300`/`soap400` is consistent with existing repo prototypes and migration narratives. No **invented** Canvas Kit component names were identified in PASS 2 for core flows.

---

## PASS 4: Final Improvements

**For 320 (implementation)**

• Implement **StatusIndicator** with **`StatusIndicator.Type.Gray`** (not `Grey`) and matching **Emphasis** enums from `@workday/canvas-kit-react/status-indicator`.  
• Resolve **SMS body** to a **single** control (`TextInput` with multiline styling vs documented alternative) before shipping; document the choice in the prototype file comment if non-obvious.  
• Pick **either** `Banner` **or** `Card` + `StatusIndicator` for the **consent summary** on Messaging and use it for all consent variants (granted / not recorded / opted out).  
• Use **§319 Approved** column strings in UI; keep **060** gate on legal rows before Figma/customer-facing freeze.  
• If Sana PNGs are unavailable locally, compare against `sanaShellTheme.ts` + `communication-patterns.md` and existing hub prototypes for density and blue restraint.

**For 315 (optional doc polish, non-blocking)**

• In PASS 2 §5 **Grow**, add one sentence: **v88 prototype omits TA template-admin UI; PRD self-service template management remains the GA intent.**  
• Optionally add a single **recruiter-flow** reference filename once 320 chooses the closest existing shell reference for side-by-side check.

**No edits were made to PASS 1–2 or §319 body** as part of this review.

---

## Final Verdict: APPROVED

The brief meets the 318 bar: **clear hierarchy**, **worksheet-grounded JTBD**, **justified shell** vs Smart View, **canonical** comm and grid patterns, **Canvas Kit–faithful** mapping with minor **320** implementation notes (Gray spelling, SMS control, consent container consistency). **Grow** wording should stay honest about prototype scope vs PRD template self-service (PASS 4). **320** may proceed to `design/india-whatsapp-candidate-messaging-v88.tsx` per handoff in PASS 2.

**Handoff**

Design Peer Review complete for **India WhatsApp and +91 SMS candidate messaging**. **Final Verdict: APPROVED.**

- Design Brief: `design/india-whatsapp-candidate-messaging-design-brief.md`  
- PRD: `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`  

**320:** Build the Canvas Kit prototype from this brief and PRD. Strategy, Sana intent, and Canvas Kit mapping are pre-validated; apply PASS 4 implementation notes and **§319** approved copy (legal rows after **060**).
