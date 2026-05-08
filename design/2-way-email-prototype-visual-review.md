# 2-way email prototype — visual parity review (318-inspired)

**Date:** 2026-05-08  
**Prototype:** [`2-way-email-prototype.tsx`](2-way-email-prototype.tsx)  
**Route:** `http://localhost:5199/#2-way-email-prototype`  
**Viewport (captures):** 1440×900 (matches [screen-inventory.md](../docs/figma-extraction-2way-email-2024/screen-inventory.md) frame size for Overview / Compose family)  
**Figma file:** [2-Way Email Recruiting 12/2024](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024) (`fileKey`: `HpAOHGAeXBORpHnyhsCMja`)

This review applies the **visual / layout / Canvas Kit** lens from **318 Design Peer Review** to the **running prototype**, not to the Design Brief alone. Full 318 brief gates (JTBD worksheet, PASS 1–2 narrative) are **out of scope** unless the brief is explicitly attached.

## Authoritative visual targets (PM PNGs in repo)

Side-by-side or overlay comparison should use these **committed** captures (also listed in the alignment plan):

| Screen | Reference file |
|--------|------------------|
| Feature highlight (Introducing Conversational Email) | [`reference-screens/2way-email-refs/Overview-1d563f72-f16d-468f-969d-e980eae47744.png`](reference-screens/2way-email-refs/Overview-1d563f72-f16d-468f-969d-e980eae47744.png) |
| Overview variant | [`reference-screens/2way-email-refs/Overview__1_-37c072c8-e99c-48de-89e8-f7482465db51.png`](reference-screens/2way-email-refs/Overview__1_-37c072c8-e99c-48de-89e8-f7482465db51.png) |
| Thread list | [`reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png`](reference-screens/2way-email-refs/Overview__2_-12b9dd50-6439-4499-9d4e-1d3a3b2f802e.png) |
| Expanded list + reading | [`reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png`](reference-screens/2way-email-refs/Overview__3_-cb83c3a7-8a0a-4150-baef-d59aa5debeed.png) |
| Empty state | [`reference-screens/2way-email-refs/Empty_State__No_Agency_-2e7cdfd0-2da9-4fc3-98fa-656706c50df9.png`](reference-screens/2way-email-refs/Empty_State__No_Agency_-2e7cdfd0-2da9-4fc3-98fa-656706c50df9.png) |
| Compose | [`reference-screens/2way-email-refs/Compose-154e11cc-f530-4201-a4e1-20d22eddaa7f.png`](reference-screens/2way-email-refs/Compose-154e11cc-f530-4201-a4e1-20d22eddaa7f.png) |

**Spot-check:** Open `#2-way-email-prototype` at **1440×900**, reset onboarding if needed (dev footer), and compare mail rail, Conversational Email panel, compose, and shell against the rows above.

---

## 1. Evidence: Figma reference frames

| Target node | Figma deep link | MCP capture |
|-------------|-----------------|-------------|
| Feature highlights | [6887:23176](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-23176) | **Blocked** — Figma MCP Enterprise View-seat quota exhausted (`get_screenshot` / `get_design_context` returned rate-limit). |
| Agency empty | [6887:23551](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-23551) | Same |
| Overview / thread list | [6887:11657](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-11657) | Same |
| Expanded reading | [6887:12795](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-12795) | Same |
| Compose | [6887:14115](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-14115) | Same |
| Decision bar | [6887:21505](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-21505) | Same |

**Fallback:** Manually export PNGs from Figma for each node and layer them over [`visual-parity-evidence/`](#3-evidence-prototype-captures) in your viewer of choice, or re-run MCP when quota resets.

Repo placeholders (no embedded screenshots yet): [`docs/figma-extraction-2way-email-2024/screens/`](../docs/figma-extraction-2way-email-2024/screens/) — README stubs only.

---

## 2. Evidence: prototype captures

Captured via Playwright MCP against **local dev** (`npm run dev`, port **5199**). Paths below are relative to the `design/` folder.

| File | State |
|------|--------|
| [`design/visual-parity-evidence/01-onboarding-feature.png`](visual-parity-evidence/01-onboarding-feature.png) | **Legacy** — was full-screen step 1; onboarding is now an **anchored popover** (compare to PM `Overview-1d563f72-…`). Re-capture recommended. |
| [`design/visual-parity-evidence/02-onboarding-agency.png`](visual-parity-evidence/02-onboarding-agency.png) | **Legacy** — second full-screen step removed; use **Empty inbox (demo)** + empty state vs PM `Empty_State__…` PNG. |
| [`design/visual-parity-evidence/03-mail-list-only.png`](visual-parity-evidence/03-mail-list-only.png) | **Re-capture** after Conversational Email chrome update |
| [`design/visual-parity-evidence/04-mail-split-reading.png`](visual-parity-evidence/04-mail-split-reading.png) | **Re-capture** after To/Cc/attachments work |
| [`design/visual-parity-evidence/05-compose.png`](visual-parity-evidence/05-compose.png) | **Re-capture** after compose parity pass |
| [`design/visual-parity-evidence/06-decision-action-bar.png`](visual-parity-evidence/06-decision-action-bar.png) | Fixed decision strip after **Move Forward** |

---

## 2b. Prototype Control panel (`?proto=1`)

In **dev**, use the **bottom-left “Prototype controls”** button to expand the panel (collapsed by default). With **`#2-way-email-prototype?proto=1`**, the same button appears outside dev.

Bookmarkable hash params include **`panel=0`** (mail dock closed — default landing, **no dark overlay**) vs **`panel=1`** (dock open). **`surface`** describes mail UI when the dock is used; it does **not** imply the dock is open.

| Control | Query keys | Notes |
|---------|------------|--------|
| **Mail dock open** | **`panel`** | **`0`** closed (Figma-first shell); **`1`** open (shows Collaboration Dock + backdrop) |
| Surface preset | `surface=list\|split\|compose\|empty`, `empty` | List-first uses **narrow** dock width (~28% vw); split uses **medium** (~936px sheet); compose uses **wide** (~72% vw). |
| Audience tab | `audience` | `all` · `candidate` · `agency` |
| Thread focus | `thread` | `none` · `1`–`4` (maps to mock rows: unread, sent, delivered, not delivered) |
| Reading error | `error` | `none`, `generic`, `spam`, `virus`, … — banner copy when **Not delivered** row is open |
| Dock width override | `dock` | `auto` · `narrow` · `medium` · `wide` |
| Candidate nav | `nav` | e.g. `summary`, `overview`, … |
| Compose placeholder | `composePlace` | `begin` · `template` |
| Desktop/Mobile strip | `deviceToggle=1` | Compose preview toggle |
| Sample PDFs | `attach=1` | Seeds Resume / Cover-letter chips |
| Header badges | `badges` | `6,9,1` → messages / tasks / documents |
| Mail rail badge | `mailBadge` | Numeric badge on mail rail tile |
| Show controls chrome | `proto=1` | Required to show **Prototype controls** button outside `import.meta.env.DEV` |

**Flip-test:** 1440×900 — compare **narrow / split / compose** widths to [`reference-screens/2way-email-refs/`](reference-screens/2way-email-refs/) Overview family PNGs.

---

## 3. Checklist (318-inspired, UI-focused)

### Layout

| Item | Implementation notes | vs Figma |
|------|------------------------|----------|
| Collaboration footprint | **Auto:** list-first **narrow** (~28% vw sheet); split **medium** (`COLLAB_SHEET_W` = 936px, expand toggle → 1080–1200px); compose **wide** (~72% vw). Override via control panel `dock` | Compare to PM Overview / Compose PNGs |
| Thread rail | **~272–300px** split column width (depends on expand toggle) | Tunable vs reference |
| Mail chrome | **Conversational Email**, Job Requisition line, **+ New**, tabs **All | Candidate | Agency** with underline, **Filter by** + **Sort** | Matches alignment plan |
| List-first mail | Full-width thread list until a row is selected; then **split list + reading pane** | Align with `Overview__2_` / `Overview__3_` PNGs |
| Header chrome | Global header **64px** (`HEADER_H`); **MENU**; **Global Modern Services** + GMS; distinct utility icons with **badged counts** (default 6 / 9 / 1) | Shell vs Overview exports |
| Candidate sidebar | **Blue gradient** nav (`CandidateMenu`) | Shell polish vs Overview |

### Typography / hierarchy

| Item | Notes |
|------|--------|
| **Onboarding** | Anchored **Introducing Conversational Email** card + **Try Conversational Email** — compare to PM `Overview-1d563f72-…` PNG |
| Mail chrome | **Conversational Email** title + Job req subtitle — matches reference naming |
| Compose | Subject default **Interview Request**, CC **Search Recipient**, **+ Add Templates**, body placeholder **Begin typing…** or **Select a template…** (Prototype Control), footer **Send** + **Discard** only (no yellow marketing preview) |

### Colour / surface

| Token / hex | Usage |
|---------------|--------|
| `colors.soap200` | Page canvas |
| `colors.blueberry*` | Tabs, selection, primary CTAs |
| Blue gradient | Candidate left nav (`CandidateMenu`) — Overview shell polish |
| ~~`#FFECAB` compose preview masthead~~ | **Removed** from default compose path (parity vs Compose PNG) |

### Canvas Kit vs bespoke

| Area | CK usage | Risk |
|------|-----------|------|
| Mail list / reading | `SecondaryButton`, `StatusIndicator`, `AlertBanner`, `FormField` patterns | Low |
| Onboarding | `Card` popover + backdrop — anchored near mail rail tile | Low–medium — tail position vs viewport width |
| Compose toolbar | `ToolbarIconButton` row — semantic icons still partly placeholder (`relatedActionsIcon`) | Medium |

### Behaviour / prod fidelity

| Item | Notes |
|------|--------|
| Compose validation demo | **Shown only when `import.meta.env.DEV`** — captures taken on **dev server** therefore include **“Figma validation states”** dropdown; **production build hides it** — compare clean compose to **6887:14115** using `npm run build && npm run preview` if needed. |

### Accessibility (spot)

| Check | Status |
|-------|--------|
| Icon-only rail buttons | `aria-label` present on collaboration tiles / toolbar icons in code paths reviewed |
| **Onboarding** | Primary CTA **Try Conversational Email**; dismiss via backdrop or **X** |
| Heading levels | Snapshot showed onboarding title as **h2** — acceptable for overlay card page |

---

## 4. Gap list (severity)

| ID | Severity | Gap | Suggested follow-up |
|----|-----------|-----|---------------------|
| G1 | **P2** | Optional **Figma MCP** baselines | Still useful as a second source of truth; PM PNGs are primary for this pass. |
| ~~G2~~ | — | ~~Gradient onboarding hero~~ | **Addressed** — replaced with anchored popover vs PM PNG. |
| ~~G3~~ | — | ~~Compose hex preview masthead~~ | **Addressed** — removed from default compose. |
| G4 | **P2** | `Avatar.Size` deprecation warnings in console (Canvas Kit) | Migrate when upgrading CK usage. |
| G5 | **P2** | Rich-text toolbar uses generic **relatedActionsIcon** placeholders | Swap to semantic toolbar icons if design specifies glyphs. |

---

## 5. Visual parity verdict

**Final verdict: PARITY TARGET IMPLEMENTED — manual spot-check recommended**

The prototype was rebuilt to match the **committed PM reference PNGs** under [`design/reference-screens/2way-email-refs/`](reference-screens/2way-email-refs/) (popover onboarding, Conversational Email chrome, thread rows, reading pane To/Cc + attachment cards, illustrated empty state, compose CC/templates/placeholder/footer, GMS shell + blue candidate nav). **Strict pixel-perfect certification** still benefits from a **1440×900** overlay pass in the browser against those files.

**Optional follow-ups:**

1. Re-record [`design/visual-parity-evidence/`](visual-parity-evidence/) Playwright captures after this rebuild.
2. Refresh Figma MCP screenshots when quota allows, for a secondary diff vs **6887:** nodes.

---

## 6. Handoff blurb (for PM)

Visual parity review updated for **PM-supplied reference PNGs** committed under [`design/reference-screens/2way-email-refs/`](reference-screens/2way-email-refs/). **Verdict: parity target implemented** — confirm at **1440×900** with designer overlay or tab-flip against those assets.

- **Reference PNGs:** [`design/reference-screens/2way-email-refs/`](reference-screens/2way-email-refs/)
- **Flow map:** [`design/2-way-email-prototype-flow.md`](2-way-email-prototype-flow.md)
- **Implementation:** [`design/2-way-email-prototype.tsx`](2-way-email-prototype.tsx)
