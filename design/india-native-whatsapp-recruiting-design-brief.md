# Design Brief: Native WhatsApp Messaging in Core Recruiting UI (India)

**Status:** 319 copy review and 318 peer review complete (7 April 2026). **Final Verdict: APPROVED** — ready for **320** prototype.  
**Date:** 7 April 2026  
**Mission:** INDIA-E2E-005  
**PRD:** `docs/prds/india-native-whatsapp-recruiting-prd.md`  
**Target prototype:** `design/india-native-whatsapp-recruiting-vNN.tsx` (**320**, after 318 **APPROVED**)

**References read:** PRD (incl. Red Team revision: NFRs, UDMF/phone routing, Paradox matrix, consent contract); `docs/jtbd-recruiting-hr-professional-and-manager.md`; `docs/experience-principles.md`; `design/references/recruiter-flow/README.md`; `design/references/pattern-candidate-smart-view.md`; `design/docs/canvas-kit-patterns/communication-patterns.md`; `design/components/ProfilePageLayout.tsx`; `design/components/SanaCommPanelPatterns.tsx`; Sana PNGs `Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` and `Sana_Style_UI-candidate-profile-whatsapp-panel.png` (communication). **Workday Deployment Agent:** placement guidance for collaboration / conversational messaging on candidate profile. **Canvas Kit MCP:** `get-canvas-kit-tokens` **unavailable this session**; mapping aligns with **`320-prototype-developer.mdc`** and existing repo prototypes (**Canvas Kit v14**).

---

## PASS 1: Layout Strategy

### 1. JTBD (worksheet-aligned)

**Primary persona:** Recruiter (India, high-volume).

**Worksheet alignment:** *Talent Acquisition → Manage candidates throughout the recruiting process*

- Progress candidates through the stages of the pipeline as efficiently as possible  
- *(Implicit)* Keep candidates engaged through the process  

**Verbatim JTBD lines (excerpt file):** Same cluster as above; messaging supports **efficient progression** and **engagement** on the channel candidates already use (WhatsApp, per **P1–P5** research in PRD).

**Synthesised job statement:**  
When I am managing India candidates through active recruiting steps, I want to **send and read WhatsApp** from the **candidate record** with **visible consent, templates, and delivery state**, so I can **respond faster than email-only**, avoid **personal-device workarounds**, and keep an **auditable thread** for **DPDP** programmes.

**Prototype implications:** **Collaboration-style** messaging surface on the profile (Deployment Agent alignment with **Candidate SMS**); **consent** and **block** reasons before send; **templates-first** composer; **inbound** thread; **optional bulk** from Find Candidates with **preview + confirm**; **degraded** / **queued** states per PRD NFRs.

### 2. Shell pattern

**Primary: Pattern B (candidate profile hub)** via **`ProfilePageLayout`**: `WorkdayTopNav`, `WorkdayLeftTabBar` for Recruiter Hub + **profile tabs**, main workspace for tab content, **`CommunicationDock`** on the right for **conversational** WhatsApp (expanded width ~**450px** per communication patterns, not the default 420px if thread needs air).

**Rationale:** **Deployment Agent** recommends **collaboration panel** placement for **two-way** messaging, matching **Candidate SMS**. The PRD places WhatsApp on the **candidate profile**; combining **hub tabs** (Overview, Activity, Documents, **Messaging**) with **`CommunicationDock`** gives **parity** with established recruiter muscle memory **and** room for **consent history**, **bulk audit**, and **template** focus on the **Messaging** tab without hiding real-time chat behind only a tab.

**Secondary (optional v1 slice): Pattern D** for **Find Candidates** bulk: `WorkdayTopNav` + `WorkdayLeftTabBar` + filters + **`Table`** + bottom/toolbar bulk actions. If HiredScore appears in grid, use **`HiredScoreGrading variant="full"`** per `pattern-hired-score-grid.md` (**read** for bulk slice).

### 3. Real layouts and pattern libraries

| Source | Use |
|--------|-----|
| `design/references/recruiter-flow/README.md` | **Pattern B** + **CommunicationDock** for email/SMS/WhatsApp; Sana refs |
| `pattern-candidate-smart-view.md` | Card density, typography hierarchy; **not** forcing three-column carousel for this feature |
| `communication-patterns.md` | `SanaCommMessageBubble`, `SanaCommComposer`, channel toggles, `CommunicationDock` widths |
| `Sana_Style_UI-candidate-profile-whatsapp-panel.png` | WhatsApp panel chrome, neutral surfaces |

### 4. Deployment Agent placement note

**Deployment Agent (7 April 2026):** Conversational messaging belongs in the candidate profile **collaboration panel** (right-hand side), consistent with **Candidate SMS**; profile **tabs** such as **Candidate Communication** lean **historical/report** rather than primary **live chat**.

**Design decision (PRD + DA synthesis):** **`CommunicationDock`** hosts the **live WhatsApp thread + composer** (primary daily use). **`Messaging` tab** in the same profile shows the **same conversation model** in the **main column** when the dock is collapsed or for **wide** review, plus **consent summary**, **template picker** (large preview), **request consent**, and links to **history**. **Single thread state** across dock and tab (no divergent copies).

### 5. Layout regions

**Candidate profile**

- **Top:** `WorkdayTopNav` `variant="app"` — **white bar**, **grey pill search**, 1px `SANA_TOP_NAV_DIVIDER` hairline, utilities.  
- **Left:** `WorkdayLeftTabBar` (Recruiter Hub sections + profile tabs: Overview, Activity, Documents, Questionnaire, **Messaging**).  
- **Center:** Tab workspace; **Messaging** tab = consent strip, optional **Banner** for degraded queue, thread (`SanaCommMessageBubble` list), template selector, composer area, metadata (delivery, recruiter attribution).  
- **Right:** `CommunicationDock` rail icon **WhatsApp**; expanded panel = compact thread + composer mirroring tab content.

**Find Candidates (bulk, if in v1 demo)**

- **Top / Left:** Same shell **Pattern D** density.  
- **Center:** Filters + **`Table`** with row select + bulk **Send WhatsApp** (templates only).  
- **Overlay:** `Modal` preview table (included / excluded + reason codes) + secondary confirm.

### 6. Hierarchy

- **Dominant:** Message thread (scan inbound/outbound).  
- **Secondary:** Consent state + **block** explanation; template choice + merged preview.  
- **Supporting:** Delivery ticks / **StatusIndicator** per message; **channel origin** label (native vs external **TBD**); recruiter name and time.

### 7. Interaction model

- **Tabs:** Profile **`Tabs`** / `WorkdayLeftTabBar`-driven: all listed tabs navigable; **Messaging** fully detailed; others representative rich content per **320** content bar.  
- **Dock:** Tap rail **WhatsApp** → expand sheet; does not replace tab (same data).  
- **Modals:** Bulk **preview and confirm**; **Send consent request** confirm; **Blocked send** explainer; optional **verify phone** for UDMF/number-mismatch (**PRD**).  
- **Inline:** Template merge preview; **free-text** gated (off by default) uses `TextInput` with warnings pattern from PRD.

### 8. Layout Framework A–F

| Letter | Application |
|--------|-------------|
| **A – JTBD** | Faster, governed outreach on WhatsApp from the record |
| **B – Shell** | Pattern **B** hub profile + **CommunicationDock**; optional **D** for bulk grid |
| **C – Hierarchy** | Thread first; consent and template before send |
| **D – Density** | Dock compact; tab allows slightly more metadata without duplicating chrome |
| **E – Accessibility** | `FormField` labels; modal focus trap; live region for send result; icon buttons `aria-label` on rail |
| **F – Canvas coverage** | v14: `Card`, `Flex`, `Box`, `Tabs`, `Table`, `Modal`, `Banner`, `FormField`, `TextInput`, `StatusIndicator`, `PrimaryButton`, `SecondaryButton`, `SystemIcon`, `Avatar`, `Pagination` (grid) |

---

## PASS 2: UI Composition (Canvas Kit)

### 0. Canvas Kit discovery

**MCP:** `get-canvas-kit-tokens` **not available** in this environment; alignment uses repo canon: **`@workday/canvas-kit-react` v14**, tokens `colors`, `space` from `@workday/canvas-kit-react/tokens`, and **`design/docs/canvas-kit-patterns/*.md`**.

**Component set:** Layout (`Box`, `Flex`, `Card`), actions (`PrimaryButton`, `SecondaryButton`), text (`Heading`, `BodyText`), data (`Table`, `StatusIndicator`, `Avatar`), navigation (`Tabs`), forms (`FormField`, `TextInput`, `Checkbox` for bulk select), feedback (`Modal`, `Banner`), icons (`SystemIcon`), comm (`SanaCommMessageBubble`, `SanaCommComposer`).

### 1. Map layout → components

**Profile shell**

| Area | Component |
|------|-----------|
| Page | `ProfilePageLayout` from `design/components/ProfilePageLayout.tsx` |
| Top | `WorkdayTopNav` |
| Hub | `WorkdayLeftTabBar` — tab ids: `overview`, `activity`, `documents`, `questionnaire`, `messaging` |
| Right | `CommunicationDock` — rail icon stack includes **WhatsApp**; `expandedWidthPx` **450** (or communication-patterns recommendation) |

**Messaging tab + dock panel (shared patterns)**

| Element | Component |
|---------|-----------|
| Page title | `Heading size="large"` — “Messaging” |
| Consent summary | `StatusIndicator` row(s) or compact `Card`; use `Banner` only for **degraded** / **system** states (queue lag), not mock data |
| Channel | WhatsApp only in v1 PRD; optional **Email** `SecondaryButton` **disabled** or omitted for India-native scope |
| Thread | Vertical `Flex`; messages `SanaCommMessageBubble` from `SanaCommPanelPatterns.tsx` |
| Template | `FormSelect` (`SharedFormControls.tsx`) for template; read-only merged body in `TextInput` or `Box` |
| Free-text (if tenant on) | `TextInput` multiline + soft warning copy per PRD |
| Composer | `SanaCommComposer` for send affordance; **PrimaryButton** “Send” when template valid + consent OK |
| Secondary actions | `SecondaryButton` “Request consent”, “View consent history” (opens `Modal` or side sheet) |
| Degraded | `Banner` variant per Canvas Kit guidance — “Updates may be delayed” (copy in inventory) |

**Find Candidates bulk**

| Element | Component |
|---------|-----------|
| Grid | `Table` + `Checkbox` |
| Grade | `HiredScoreGrading variant="full"` if column present |
| Toolbar | `SecondaryButton` “Send WhatsApp” when selection non-empty |
| Preview | `Modal` + `Table` columns: candidate, consent, channel, **reason excluded** |

### 2. Sana Style (mandatory)

- Page canvas: **`SANA_PAGE_CANVAS`** (~#F3F5F7) from `sanaShellTheme.ts`.  
- Cards: white on canvas, **`soap300`** borders, **`SANA_CARD_RADIUS_LG`**.  
- Top nav: grey strip, **pill** search (`WorkdayTopNav`).  
- **Blue** sparingly: primary send, links, active channel **`blueberry400`** on `SecondaryButton` selected state.  
- Match **`Sana_Style_UI-candidate-profile-whatsapp-panel.png`** for panel density.

### 3. Navigation completeness

All **WorkdayLeftTabBar** profile tabs listed above must appear with **representative** content on each (**320** richness); **Messaging** is the hero. **CommunicationDock** rail shows at least **WhatsApp**; additional icons (e.g. Email) optional for visual parity only if PRD scope allows.

### 4. Experience Principles (mandatory rationale)

- **Empower:** Recruiter **chooses** template and send moment; **preview** and **confirm** on bulk; **clear block** with next step (**request consent**). System does not auto-send.  
- **Trust:** **Delivery** and **consent** visible; **plain language** (“WhatsApp”, “Consent”, “Delivered”); **degraded** banner when queues lag (**NFR**).  
- **Grow:** Thread and consent **history** discoverable; **template** catalogue managed by admins (out of prototype scope but **link** placeholder); **withdrawal** reflected in UI state.

### 5. Copy Inventory (**319-approved**, 7 April 2026)

**Buttons and CTAs**

- Primary action: “Send message” *(was “Send”; aligns with verb + object pattern and clarifies channel context in composer)*  
- Secondary actions: “Request consent”, “View consent history”, “Preview recipients”, “Confirm send”, “Cancel”, “Retry send”, “Choose a different template”, “Go to candidate profile”  
- Bulk: “Send WhatsApp”, “Remove excluded candidates” *(was “Remove excluded from selection”; clearer object)*  

**Form labels and help text**

- Template: “Template” | Help: “Only approved templates can be sent on WhatsApp.”  
- Merged preview: “Message preview” | Help: “Preview shows the template with this candidate’s details filled in.” *(tighter, user-focused)*  
- Phone (if shown): “WhatsApp number” | Help: “Uses the phone number on the candidate’s record in E.164 (international) format.”  
- **Free-text gate (when tenant enables):** Label: “Message” | Help: “Don’t include health, religion, or other sensitive personal details. Use templates when possible.” *(PRD §249–257; **060** to approve final wording.)*  
- **CommunicationDock rail (`aria-label`):** “WhatsApp messages” *(accessibility string for icon button)*  

**Error messages**

- No consent: “You can’t send WhatsApp messages until the candidate consents. Request consent or use another channel.”  
- Template rejected: “We couldn’t send this template. Choose another template or try again.” *(user-focused opening)*  
- Provider / rate limit: “WhatsApp is temporarily unavailable. Your message is queued. Try again later.”  
- Bulk partial block: “Some candidates can’t receive this message. Review the list before you confirm.”  
- Phone / UDMF ambiguity: “This phone number matches more than one candidate. Open the candidate profile you want to message, then try again.”  

**Success / confirmation**

- Sent: “WhatsApp message sent.”  
- Bulk scheduled / queued: “We’re sending your messages. You can leave this page. Progress is saved on each candidate record.”  

**Empty states**

- No thread: “No WhatsApp messages yet” + body “When you send a message or the candidate replies, it appears here.” + CTA “Send message”  
- No templates: “No templates available” + body “Ask your administrator to add approved WhatsApp templates.”  

**Loading states**

- Thread loading: “Loading messages…”  
- Sending: “Sending…”  
- Webhook refresh: “Updating delivery status…”  

**Legal / consent (flag for 060 — do not ship without Legal sign-off)**

- Consent banner (short): “WhatsApp is used only when allowed by your organisation’s policies and the candidate has consented to recruiting messages on this channel.” *(more specific than draft; **060** to validate against DPDP / consent artefact and privacy notice linkage.)*  
- Consent request (recruiter-facing CTA description): “Send a consent request for WhatsApp recruiting messages.” *(was “Ask the candidate…”; action-oriented; **060** must align with actual candidate-facing copy in **Enhanced candidate communication consent** flow.)*  

**Degraded / NFR**

- Queue lag: “Delivery updates may be slower than usual. Recent messages might not show the latest status yet.”  

### 6. Visual Indicators Specification (for 320)

- **Consent:** Active → `StatusIndicator type={Green} emphasis={Low} label="Consent: WhatsApp"`; missing → `type={Red} emphasis={High}`; pending → `type={Orange} emphasis={Low}`.  
- **Message delivery:** Sent → `Gray/Low` “Sent”; delivered → `Blue/Low` “Delivered”; read → `Green/Low` “Read” (if provider supports); failed → `Red/High` “Failed”.  
- **Template state:** Approved → `Green/Low` “Approved template”; archived → `Gray/Low` “Unavailable”.  
- **Bulk row excluded:** `StatusIndicator type={Gray} emphasis={Low} label="Excluded"` + tooltip text via `title` or helper (implementation detail).  
- **Icons:** WhatsApp rail icon → `SystemIcon` appropriate icon from `@workday/canvas-system-icons-web` (or comms icon set used in `SanaCommPanelPatterns`) size **24**.  
- **Avatars:** Candidate header `Avatar size={Avatar.Size.xl}`; message bubbles use pattern defaults.  
- **Channel / mode:** If Email toggle present for demo parity, use two `SecondaryButton`s per `ProfilePageLayout` doc (active `backgroundColor: colors.blueberry400`).  
- **Metadata:** `BodyText size="small" color={colors.blackPepper600}` with middot separators for “Sent by · 7 Apr 2026 · 14:32 IST”.

---

**Handoff:** **320** — implement prototype from this brief + PRD. **060** — sign off legal/consent strings before GA copy freeze.

---

## PASS 3: Peer Review Findings (318 — 7 April 2026)

### Strategy and JTBD
- **Worksheet check:** The stated cluster matches `docs/jtbd-recruiting-hr-professional-and-manager.md` — **Talent Acquisition → Manage candidates throughout the recruiting process**, with explicit bullets on pipeline efficiency and engagement. The synthesised *When / I want / so I can* line is outcome-led (governed speed, auditability, DPDP), not a feature list. **Pass.**

### Layout and shell
- **Pattern B + CommunicationDock** is justified by Deployment Agent alignment to **Candidate SMS** and PRD placement on the **candidate profile**. The **single thread state** rule across dock and **Messaging** tab removes a common failure mode (divergent histories). **Pass.**
- **Primary focus** within three seconds: thread-first hierarchy, consent and template before send, matches recruiter scanning. **Pass.**
- **No breadcrumb / chevron path:** Explicitly avoided; page title + tabs + metadata carry hierarchy per **015-sana-style-ui.md**. **Pass.**

### Canvas Kit and Sana Style
- Mapping uses real repo primitives: **`ProfilePageLayout`**, **`SanaCommMessageBubble`**, **`SanaCommComposer`**, **`StatusIndicator`**, **`CommunicationDock`**, shared **`FormSelect`** — no custom badge pills or ad hoc chat chrome. Sana tokens and reference PNGs cited. **Pass.**
- **Caveat (non-blocking):** PASS 2 notes **Canvas Kit MCP** unavailable this session; **320** should run **`get-canvas-kit-tokens`** once before implementation to confirm no v14 API drift (e.g. `Tabs` `data-id`, `Table` compound API).

### Navigation completeness
- **WorkdayLeftTabBar** profile tabs are enumerated with **320** responsible for representative richness on non-hero tabs. **Messaging** is the hero; scope is clear. **Pass.**

### Copy (post-319)
- Error pattern is **problem + next step**; terminology uses **Candidate** consistently; British spelling in approved strings (**organisation**, **couldn’t** as applicable). Legal lines are **flagged for 060**, not treated as final.

### Experience principles (`docs/experience-principles.md`)
- **Empower:** Recruiter-initiated send, preview/confirm on bulk, clear block with **Request consent** — matches *Give users control*.  
- **Trust:** Delivery and consent surfaced; degraded banner for queue lag; plain language (**WhatsApp**, **Consent**, **Delivered**).  
- **Grow:** Consent history, template catalogue admin link placeholder, withdrawal reflected in state — *Enable them to change*.

### Risks noted (not verdict blockers)
- Optional **Find Candidates** bulk slice adds complexity; brief keeps it secondary and template-only — acceptable if **320** does not let the grid overshadow the profile story.  
- **Paradox / channel coexistence** is PRD-owned; brief does not over-claim deduplication — OK.

---

## PASS 4: Final Improvements (318)

- Incorporated **319-approved** Copy Inventory in §5 above (single source of truth for **320**).  
- **320** must: add **`aria-label`** “WhatsApp messages” on the dock rail control; use **060**-approved strings for any **candidate-facing** consent message (recruiter-facing CTA text is not a substitute).  
- Pull **free-text** help/warning final wording from **060** after PRD §249–257 review if product enables free-text in the prototype.

---

## Final Verdict: APPROVED

**318** — Design Brief is **aligned to Workday recruiter patterns, Sana Style, Canvas Kit constraints, JTBD, experience principles, and the no-breadcrumb rule**. **320** may proceed. **060** remains required for consent/privacy strings before production copy freeze.

---

Workday Confidential — INDIA-E2E-005 — 315 PASS 1–2; **319** + **318** complete (7 April 2026)
