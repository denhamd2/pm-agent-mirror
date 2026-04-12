# Visual Review: Native WhatsApp Messaging — India (v91)

**Prototype URL**: `http://localhost:5199/india-native-whatsapp-v91`  
**Screenshots captured**: 3 states (initial load with dock open; dock closed Messaging tab; Overview tab after closing dock)  
**Review date**: 7 April 2026  
**Reviewer**: 321-prototype-visual-reviewer  
**Mission**: INDIA-E2E-005  

## Screenshot Analysis

### Screenshot 1: Messaging — CommunicationDock open

**Observations**:

- Neutral Sana surfaces: light canvas, white cards, green consent and template `StatusIndicator`s, orange degraded `Banner` with warning icon.
- Thread shows outbound/inbound bubbles with metadata lines and delivery `StatusIndicator` (Read) on outbound; matches brief intent for delivery + consent visibility.
- **Layout**: Horizontal scrollbar at bottom of viewport; vertical scrollbar on page plus scrollable thread/composer region → nested scrolling.
- **Dock**: Fixed-width panel header “WhatsApp · Ananya Rao”, close control, rail icon with WhatsApp accent.
- **Floating rail**: Communication rail sits at screen edge; expected pattern, but at narrow widths it crowds the dock.

### Screenshot 2: After resize / dock still open (narrow embedded browser)

**Observations**:

- Same structural issues: horizontal overflow, truncated top search placeholder (“Search or ask a c…”).
- Duplicate form sets in accessibility tree while both tab Messaging block and dock are mounted (expected for mirrored state; increases tab stops and duplicate `id`/`name` exposure for assistive tech).

### Screenshot 3: Overview tab — dock closed

**Observations**:

- **Critical layout**: Large light-grey region occupies much of the main content width; **Overview** heading appears truncated (“Ov…”); primary cards partially obscured. Suggests **CommunicationDock / flex layout not collapsing cleanly** when the panel is closed (reserved width or overlay).
- Horizontal scrollbar still present; left rail + main + residual dock column likely exceed viewport in embedded browser.
- Overview content uses cards, `StatusIndicator` for stage (with `dotIcon`) and source; typography and spacing align with Sana-style profile tabs.

## Visual Bugs Identified

**Critical (must fix before Figma)**:

1. **Main workspace obscured when dock is closed** — Empty or incorrectly sized grey column covers a large portion of the candidate profile; page title truncates. **Fix**: Ensure `ProfilePageLayout` / `CommunicationDock` collapses expanded width to zero when `activeChannel` is null; audit `flex`, `minWidth`, and `overflow` on the main + dock split.

2. **Horizontal overflow** — Persistent horizontal scrollbar in captured viewports. **Fix**: Trace `min-width` on header, cards, tables, and dock; set `overflow-x: hidden` or `min-width: 0` on flex children only where safe; avoid fixed widths that exceed small desktop.

**Important (should fix)**:

1. **Nested vertical scroll** — Thread `overflowY: 'auto'` inside page-level scroll reduces predictability. **Fix**: Prefer single scroll container for main column where possible, or clearly separate dock scroll from page scroll.

2. **Accessibility snapshot: degraded `Banner` exposed as `role: button`** with the full banner copy as the accessible name (duplicate entries when dock + tab both visible). **Fix**: Validate Canvas Kit `Banner` usage / version; if framework behaviour, add `role="status"` / `aria-live` pattern per product a11y guidance so the message is not announced as a generic button.

**Minor (polish)**:

1. Demo-only “Demo states” toolbar is dense; acceptable for review prototype, hide or collapse for Figma capture if desired.
2. `Checkbox` for free-text reported as `readonly` in snapshot — verify intended demo interaction (non-blocking if demo-only).

## Canvas Kit Usage

**Correct**:

- `ProfilePageLayout`, `Card`, `Heading`, `BodyText`, `Avatar`, `PrimaryButton` / `SecondaryButton`, `ToolbarIconButton`, `StatusIndicator` for consent, delivery, template, stage, source, document type, bulk excluded row.
- `Table` compound API on Documents and bulk modal.
- `Modal` with heading, body, actions for bulk preview, consent request, consent history.
- `Banner` for degraded and UDMF error states.
- `FormField`, `FormSelect`, `FormTextInput`, `Checkbox`, `SanaCommMessageBubble`, `SanaCommComposer`.
- `SystemIcon` for shell and metadata icons.
- Communication rail uses native `button` with **`aria-label="WhatsApp messages"`** per brief.

**Incorrect or questionable**:

- Raw `Box as="textarea"` for free-text message — acceptable for prototype; production would use Canvas Kit text area if available.
- Custom `WHATSAPP_GREEN` on rail icon — intentional channel cue; keep minimal (not full chrome wash).

## Sana Style Compliance

**Strong**:

- `SANA_PAGE_CANVAS`, card borders/shadow, pill search in top nav, restrained blue (links, primary actions, active cues).
- White cards on grey canvas; rounded cards; no breadcrumb strip.

**Needs adjustment**:

- Truncated headings and grey obstruction break hierarchy and scan clarity on Overview when dock closed.

## Design Brief Alignment

**Matches intent**:

- Shell **B + CommunicationDock**; candidate profile tabs (Overview, Activity, Documents, Questionnaire, Messaging) with representative richness on non-hero tabs.
- **Messaging** hero: consent row, legal banner copy, degraded + UDMF banners, template select + preview, E.164 phone, free-text gate, bulk “Send WhatsApp” → modal with preview table and excluded rows.
- Single shared thread state mirrored tab/dock (code-level).
- Footer disclaimer for prototype / Legal sign-off.

**Deviates from brief**:

- **Layout execution** when dock closed (see Critical above) — not specified in brief but blocks “feels like shipped product”.
- Brief mentions optional **template catalogue admin link placeholder** — not present (minor gap).

## Accessibility Observations

**Good**:

- Named controls: search, tabs, template field, WhatsApp number, composer, CTAs, modal close, rail `aria-label`.
- Focus moved to Overview tab after click (`active, focused, current`).
- Contrast on primary text and badges appears sufficient in screenshots.

**Needs attention**:

- Banner semantics in accessibility tree (see Important).
- Duplicate IDs/controls when tab + dock both mount — document as known prototype limitation or render dock panel only when open.
- Full keyboard path not exercised in this pass; recommend 320 spot-check Tab order through Messaging + modals.

## Experience Principles (Interactive Assessment)

**Empower**: Template choice, preview, consent actions, bulk preview before confirm — clear. Layout obstruction when dock closed undermines control and orientation.

**Trust**: Delivery badges, consent capture date, degraded and UDMF messages are clear and match approved copy. Visual glitch reduces perceived reliability.

**Grow**: Consent history modal, cycle states for review — good for demo. History copy notes withdrawal/version — appropriate placeholder.

**Overall**: Strong content and component choices; **layout collapse bug** is the main blocker to a confident ship-quality read.

## Final Verdict: NEEDS REVISION

**NEEDS REVISION**: Prototype has **2 critical** visual/layout bugs (main content obscured / truncated when CommunicationDock is closed; horizontal overflow). **320** should fix flex/dock collapse and width chain, re-verify at **1280px+** and with dock open and closed, before **330** Figma capture.

---

**Next steps**: Return to **320-prototype-developer** with the fix list above. After fixes, re-run **321** snapshot pass (dock open, dock closed, Overview + Messaging).
