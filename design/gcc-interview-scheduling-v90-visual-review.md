# Visual Review: GCC interview scheduling compliance nudges (v90)

**Prototype URL**: `http://localhost:5199/gcc-interview-scheduling-v90`  
**Mission**: GCC-E2E-034 — Step 21 (321 prototype visual review)  
**Screenshots captured**: Multiple states via Cursor Simple Browser (default candidates grid, Schedule interview · Select time, Schedule interview · Panel, Admin · Rule packs, Candidate self-schedule)  
**Review date**: 5 April 2026  
**Reviewer**: 321-prototype-visual-reviewer  
**Rule**: `.cursor/rules/321-prototype-visual-reviewer.mdc` (no `321-visual-review.mdc` in repo)

## Screenshot analysis

### State 1: Recruiter hub — Candidates (WF1)

**Observations**

- Shell matches brief: `WorkdayTopNav`, `WorkdayLeftTabBar`, grey canvas, white table surface with border, hub tabs (Dashboard / Job requisitions / Candidates / Reports).
- Candidate table uses `Avatar`, `StatusIndicator` for stage, `HiredScoreGrading` with `variant="full"` (aligns with `pattern-hired-score-grid` guidance).
- Area switcher row (`Recruiter scheduling`, `Admin: GCC compliance`, etc.) reads clearly; active state uses inset focus ring styling.
- In the embedded browser viewport, **main workspace content was truncated horizontally** (titles and switcher labels clipped; horizontal scrollbar present). Same pattern on wider `browser_resize` calls, likely because the Simple Browser panel width stays narrow.

### State 2: Schedule interview · Select time (WF2)

**Observations**

- Step title and slot `Card` list match wizard pattern; selected slot uses blue border token (`SANA_LINK_ACCENT`).
- **Compliance copy is wrong when a compliant slot is selected**: the `Banner` always states that the selection is below the minimum notice threshold. In source this block is not gated on `noticeViolation` (see code review below). This contradicts the Design Brief (banner should reflect evaluated rule / severity).

### State 3: Schedule interview · Panel (WF3)

**Observations**

- `Banner` for panel mix + `View policy` link; interviewer rows use `Avatar` + `StatusIndicator` Gray/Low for roles.
- `Continue` correctly **disabled** until checkbox acknowledgement (good control). Automated click on the Canvas Kit checkbox failed (opacity-0 native input); expected for CK, not flagged as end-user defect.

### State 4: Admin — GCC interview compliance, Rule packs (WF6)

**Observations**

- `Tabs` for Rule packs / Scope mapping / Policy text / Sensitive rules; table content is realistic.
- Title and intro `BodyText` truncated in narrow viewport; horizontal scrollbar visible.

### State 5: Candidate self-schedule (WF9)

**Observations**

- Centred `Card` on `SANA_PAGE_CANVAS`, heading, disclosure `Banner`, slot `SecondaryButton`s, footer privacy line — matches brief intent.
- Slot button labels truncate when the viewport is narrow; horizontal scrollbar on page.

## Visual bugs identified

**Critical (fix before Figma / stakeholder demo)**

1. **Misleading minimum-notice banner on the time step (WF2)**  
   The banner always claims the selected slot is below the 48 business-hour threshold, even when `selectedSlot` is `s2` or `s3` (`noticeViolation === false`). This breaks **Trust** and misstates compliance state. **Fix**: drive banner visibility and copy from `noticeViolation` (and optionally a neutral “rule reminder” variant when compliant).

**Important**

2. **Overflow and truncation in constrained widths**  
   Repeated horizontal scrollbars and clipped headings/labels in the Simple Browser session. **Fix**: audit flex children for `minWidth: 0`, AreaSwitcher wrapping/stacking on small widths, and table/HiredScore column flex so the centre column does not force page-level horizontal scroll.

3. **Audit row “View details” uses a raw `<button>`**  
   Visually token-coloured but not Canvas Kit `SecondaryButton` / `TertiaryButton` or a typed link pattern. Prefer kit component for hover/focus consistency.

**Minor**

4. **Loading states** from the Copy Inventory are not shown (acceptable for a thin prototype if called out).
5. **Paradox (WF10)** as JSON `Card` is intentionally conceptual; fine for demo.
6. **Accessibility tree**: some `Banner` regions surfaced as `role: button` in snapshots — worth verifying CK banner semantics (low priority if kit default).

## Canvas Kit usage

**Correct**

- `Card`, `Flex`, `Box`, `Heading`, `BodyText`, `Tabs` (`data-id`), `Table` compound API, `Modal` + `useModalModel`, `FormField`, `TextArea`, `Checkbox`, `PrimaryButton` / `SecondaryButton`, `Banner`, `StatusIndicator`, `Avatar`, `SystemIcon` (via shell), shared `FormSelect` / `FormTextInput` / `FormDateInput`, `HiredScoreGrading`.

**Incorrect or questionable**

- Raw `<button>` for “View details” in the audit table (should align with Canvas Kit patterns).

## Sana Style compliance

**Strong**

- Grey page canvas (`SANA_PAGE_CANVAS`), white cards, `soap300` borders, large card radii (`SANA_CARD_RADIUS_LG`), sparing blue on primary actions and selection rings.

**Needs adjustment**

- Persistent horizontal overflow in narrow layouts undermines the polished shell; fix layout constraints as above.

## Design Brief alignment (WF1–WF10)

| Wireframe | Alignment |
|-----------|-----------|
| WF1 Entry / grid | Met: filters, table, HiredScore, Schedule interview. |
| WF2 Select time | **Partial**: structure OK; **banner logic incorrect** vs evaluated notice state. |
| WF3 Panel | Met: banner, avatars, role chips, acknowledgement, gating. |
| WF4 Review / send | Implemented in code (not fully screenshot-verified this session); stacked banners + summary card match intent. |
| WF5 Exception modal | Implemented; form + attestation + paired actions. |
| WF6 Admin tabs | Met. |
| WF7 Attestation modal | Met. |
| WF8 Audit | Met; empty state exists when filters exclude all rows; no dedicated rich empty illustration (optional). |
| WF9 Candidate | Met; still uses full top nav (acceptable prototype shortcut). |
| WF10 Paradox | Met as summary object. |

## Accessibility observations

**Good**

- Modal headings, labels on form fields, disabled primary until required inputs, keyboard-handled slot selection (`role="button"` on slot wrapper).

**Needs attention**

- Resolve horizontal scrolling for zoom/small-viewport users.
- Prefer kit-built control for “View details” for consistent focus rings.

## Experience principles (interactive assessment)

- **Empower**: Wizard and modals keep the recruiter in control; panel gating is clear.
- **Trust**: **Weakened** by the time-step banner always implying a notice violation when it may not be true.
- **Grow**: Admin and audit support configuration and history; adequate for prototype depth.

## Final Verdict: NEEDS REVISION

**Rationale**: There is at least one **critical** trust defect (misleading minimum-notice messaging on the time step) and **important** responsive overflow that shows up in embedded browser review and would risk poor Figma capture readability. **320** should fix the banner logic and tighten layout flex/overflow, then re-run **321** before **330**.

---

**Next steps**

- **320**: Gate WF2 `Banner` on `noticeViolation` (or split informational vs warning copy); fix horizontal overflow; replace audit “View details” with Canvas Kit button/link pattern.
- **330**: Proceed only after revised **321** sign-off.
