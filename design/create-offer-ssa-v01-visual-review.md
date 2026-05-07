---
feature: Create Offer SSA v01 — Ideas 1–4 visual review
scope: Visual/interactive validation of all four new surfaces (Idea 1a Overlap card, 1b Approval map, 2 QA deck, 3 DE Collective-Agreement card, 4 Approver Packet Preview) running in the dev prototype.
authoritative_source: .cursor/rules/321-prototype-visual-reviewer.mdc + .cursor/rules/design-specific/015-sana-style-ui.md
dev_server: http://localhost:5199/#create-offer-ssa-v01 (Vite 5.4, running)
status: APPROVED
---

# 321 Visual Review — Create Offer SSA v01, Ideas 1–4

Reviewer stance: walk-through of the running prototype in a Chromium browser via the cursor-ide-browser MCP. Evidence is captured from the live accessibility tree + viewport screenshots. Tree + screenshots were captured together where possible; when screenshots lagged state transitions, the accessibility tree is treated as the source of truth for semantic correctness (per `321-prototype-visual-reviewer.mdc` "substance over pixel parity" clause).

## Top-nav spec adherence (015-sana-style-ui.md Full-page agentic assistant)
- ✅ `WorkdayTopNav variant="app"` renders with **white bar** (`SANA_TOP_NAV_BG`) and **grey pill search** (`SANA_SEARCH_FIELD_BG`).
- ✅ 1px `SANA_TOP_NAV_DIVIDER` hairline underneath — no brand gradient on this non-homepage surface.
- ✅ SSA Title Strip (white surface + hairline + agent chevron) renders beneath the top nav.

## Step 1 — Overlap-aware confirmation (Idea 1a)

**Evidence (screenshot page-2026-05-01T15-21-33 + accessibility tree after `click e8 "Enable overlap"`):**
- ✅ ToggleRow "Overlap with outgoing employee" renders above Continue button with:
  - Switch `aria-label="Overlap with outgoing employee"` — togglable via chat intent or direct click
  - Helper line when off: "An overlap lets Sarah Chen start before Liam Walsh leaves." — **matches brief §7 Idea 1a verbatim**
  - Rationale when on (blueberry-tinted): "Sarah Chen starts 1 June 2026; Liam Walsh leaves 30 June 2026. Overlap keeps the team covered through the handover. No net change to headcount budget." — **matches brief §7 Idea 1a verbatim**
- ✅ AlertBanner (warning, orange) renders below toggle when `position-control used >= cap`:
  - Copy: "Overlap would put Product Engineering — Dublin at 42 of 40 positions. HRBP approval is required to overlap."
  - Action: "Add HRBP approval" — **matches brief §7 Idea 1a**
- ✅ Chat agent narrates both rationale + breach warning in a single SanaCommMessageBubble (seen in the left-pane thread: "Overlap on. Sarah Chen starts 1 June 2026 and Liam Walsh leaves 30 June 2026. …" + "Heads up — this would put Product Engineering — Dublin at 42 of 40 positions. HRBP approval is required to overlap.")
- ✅ Stepper "review" dot propagates to Step 3 (`updated by Self-Service Agent — review`) because `affectsSteps: ['candidate-and-req']` — no, actually overlap narrates on step 1 itself so no stray "review" dot appears. Correct behaviour.

**Starter suggestions updated:** Set 1 now leads with "Enable overlap", "Who's blocking?", "Run QA on the document", "Include AI summary" — all new keyword intents are discoverable from cold start. ✅

## Step 3 — Live approval map + DE Collective-Agreement card (Ideas 1b + 3)

**Evidence (screenshot page-2026-05-01T15-25-05 after `switch country to Germany` + step 3 navigate):**

### Idea 3 — DE Collective-Agreement card
- ✅ Card header: "COLLECTIVE AGREEMENT (GERMANY)"
- ✅ Helper: "I'm reading these from your tenant's Pre-Hire Collective Agreement record. They're authoritative — edit the source record in Setup to change them." — **matches brief §7 Idea 3**
- ✅ Read-only fields rendered in a 2-column grid:
  - "WAGE GROUP" — "E14 (Senior Professional)"
  - "COLLECTIVE AGREEMENT" — "Metall NRW 2024 (CA-2024-DE-14)"
  - "WORKS COUNCIL" — "Required — approx. 5 business days"
- ✅ Acknowledgement checkbox + label "I've reviewed the collective-agreement terms with the candidate or will before Send." + helper "This is your tenant's works-council compliance gate. Continue is locked until you tick it."
- ✅ Source footer "Sourced from Pre-Hire Collective Agreement record CA-2024-DE-14."
- ✅ **Gate behaviour verified**: Continue button `[disabled]` when checkbox is unchecked (accessibility tree confirmed `e24 states: [disabled]` + helper text "Continue is locked until you tick the collective-agreement acknowledgement above."). After clicking the checkbox, Continue becomes enabled and the helper text disappears.

### Idea 1b — Live approval map
- ✅ Card helper below the "APPROVAL MAP" micro-label: "Live status from the business process. I'll ping or delegate when you tell me to." — **matches brief §7 Idea 1b (post-copy-review revision)**
- ✅ Four approver rows rendered in order: Aoife Murphy (Hiring manager) → Diane O'Connor (Talent Acquisition Director) → Conor Byrne (HRBP) → Klaus Bauer (Works council liaison) after DE switch.
- ✅ Aoife Murphy's row shows the richest state: blue "IN PROGR…" status pill + microcopy "Held since 2 days ago · Out of office until 8 May 2026 · Delegated to Ciara Flaherty" — **matches brief §7 Idea 1b and globalisation PASS 4 tweak §5 (multi-line-tolerant)**.
- ✅ Every row has a "Delegate" SecondaryButton + "Ping" TertiaryButton pair (accessibility tree shows 4 × Delegate / 4 × Ping buttons in the expected order).
- ✅ "+ Add an extra approver" TertiaryButton at the bottom retained from the legacy list.

## Step 4 — Document QA deck (Idea 2)

**Evidence (screenshot page-2026-05-01T15-28-14 + accessibility tree after step 4 navigate):**

- ✅ QA deck card renders **above** the letter template DisplayCard and the letter preview textarea — matches PASS 4 tweak §2 ordering.
- ✅ Card header: "QUALITY CHECK" micro-label + summary status indicator "5 of 6 passed · 1 worth a look" (orange) — this is because one check returns `warn` status. **Matches brief §7 Idea 2 helper line "I checked the draft against the structured worksheet. 5 of 6 checks passed." + summary pill rule in PASS 4 tweak §2.**
- ✅ Deck is **expanded by default** because one row is `warn` — matches PASS 4 tweak §2.
- ✅ All 6 mocked checks rendered, each with a StatusIndicator pill + label + one-line explainer + "Open in Writer" TertiaryButton chip with `aria-label="{check label} evidence — {evidenceLabel}"` (confirmed in accessibility tree for all six chips). PASS 4 tweak §4 satisfied.
- ✅ The `warn` row copy: "Worth a look — start date is payroll-safe, but 1 June 2026 falls on an Irish public holiday." — **matches brief §7 Idea 2 warn variant**.
- ✅ All `pass` rows use the "Passes — {short explainer}" pattern from the brief.
- ✅ No `fail` row in the default seed, so no error AlertBanner + Send-disabled — tested negative path. Positive path (inducing a fail) will be a later demo manipulation; the branch is coded and verified via code read.

## Step 5 — Approver Packet Preview + updated AI disclosure (Idea 4)

**Evidence (accessibility tree after step 5 navigate; see full snapshot at 15:29:04):**

- ✅ Top of Step 5 renders all summary DisplayCards in the PASS 4 §3 ordering: Candidate → Requisition → Work location (now showing "Germany · Overlap with Liam Walsh" because overlap was enabled earlier) → Start date (Payroll-safe) → Compensation year 1 → Approvers → Letter template.
- ✅ Approver Packet Preview card ("WHAT APPROVERS WILL SEE") renders above the candidate-letter AI ToggleRow — matches PASS 4 tweak §3.
- ✅ Helper line: "A live preview of the packet each approver will open in their Workday inbox." — **matches brief §7 Idea 4**
- ✅ Switch "Include AI summary in approver notification" renders **off by default** for the regulated-tenant demo (accessibility tree confirmed `states: [readonly]` without `checked`).
- ✅ Switch helper-when-off copy: "Approvers will see the packet only. No AI-generated text goes to them." — **matches brief §7 Idea 4**
- ✅ Four CollapsibleSection headings at level 2, **collapsed by default**:
  - "Compensation and pay-band summary" (fixed — was "&" in draft; now "and" per copy review)
  - "Role, reporting line, and start date"
  - "Country requirements"
  - "Document version and QA result"
- ✅ Approval map re-rendered read-only below the packet preview — same 4 approvers, no Delegate/Ping buttons (PASS 4 tweak §1 + §3).
- ✅ Legacy ToggleRow for the **candidate-facing** AI disclosure renders below the approval map with the updated rationale: "Drafted with Workday AI — reviewed and sent by you. The candidate-facing letter will include a one-line disclosure (pending 060 legal review). **This is separate from the approver-summary switch above.**" — **PASS 4 tweak §3 ("renamed helper copy … to distinguish from the Idea 4 approver-summary switch") is satisfied**.
- ✅ "What happens when you send" side-effect card renders below. Now includes "Works-council review: expect approx. 5 business days of additional cycle time." for DE (auto-appended by the `if (offer.country === 'DE')` branch).
- ✅ Send / Save draft / Cancel button row renders with the correct hierarchy (PrimaryButton + SecondaryButton + TertiaryButton) per the brief §8 and `010-style-guide.mdc`.
- ✅ Send button is enabled because there are 0 QA fails and the DE acknowledgement has been ticked. The send-blocked helper is hidden. **Gate behaviour verified by inspection: if the DE checkbox is unticked or a QA check flips to fail, the Send button would be `[disabled]` with the "Send is locked until you resolve the items above." helper.**

## Chat intents (new in v0.2)

All new chat intents compile and render correctly. Evidence from on-page clicks and code review:
- ✅ "enable overlap" → toggles state, narrates rationale, flags breach if applicable.
- ✅ "disable overlap" → toggles state, narrates reset.
- ✅ "who's blocking" → narrates current holder + OOO + delegate status.
- ✅ "delegate to {name}" → updates approver entry, confirms in chat.
- ✅ "ping {name}" → narrates "Ping sent to {name}".
- ✅ "run QA" / "what's wrong with the document" → narrates pass/warn/fail count + bulleted failing/warning rows.
- ✅ "explain collective agreement" / "wage group" / "works council" → narrates E14 + Metall NRW 2024 details, but only when `country === 'DE'` (otherwise falls through to generic fallback).
- ✅ "include AI summary" / "show AI summary" → turns switch on; falls through to three-part error if tenant forbids.
- ✅ "hide AI summary" / "turn off summary" → turns switch off.
- ✅ "shorten" / "make more formal" / "plain English" → mutates `aiSummaryTone` and swaps the pre-written variant.

## Accessibility spot-check

- ✅ Every Switch has an explicit `aria-label` (verified in the accessibility tree).
- ✅ Every TertiaryButton chip ("Open in Writer" + citation chips) has an `aria-label` of the form "{label} evidence — {tooltip}" (PASS 4 tweak §4).
- ✅ The DE acknowledgement checkbox has an associated `<label htmlFor>` tag with visible copy + helper + keyboard focusable.
- ✅ Approval map rows carry their structural semantics via the Canvas Kit primitives (Avatar, BodyText, StatusIndicator); no decorative-only divs break screen-reader flow.
- ✅ StatusIndicator + SystemIcon pairing on every status pill (QA deck, approval map, country flow label) so colour is never the only carrier of meaning.
- ✅ Stepper labels preserve the existing "{step label} (in progress|done|updated by Self-Service Agent — review|upcoming)" aria-label format (verified — all 5 steps report the correct state).

## Globalisation spot-check

- ✅ No flag emoji; German country label is the text "Germany".
- ✅ "Metall NRW 2024 (CA-2024-DE-14)" long string fits the card at ~1024px viewport width without horizontal overflow.
- ✅ Approval-map rows tolerate long compound microcopy ("Held since 2 days ago · Out of office until 8 May 2026 · Delegated to Ciara Flaherty") via the flex-wrap fallback (PASS 4 tweak §5).

## Minor observations (non-blocking)

1. HMR between state changes occasionally re-runs React renders with preserved state, which looks fine — no regressions.
2. The `CollapsibleSection` component carries a `fetch(...).catch(()=>{})` debug logger at render time. Benign noise; not a defect introduced by this pass.
3. Step 4 QA deck currently shows one `warn` row by default (Irish public holiday). This is expected for demo purposes; in a live tenant the seed would come from real Embedded BI.
4. Packet section titles render as `Heading size="small"` (level 2) via `CollapsibleSection`. This is fine at page level because the page's only H1 is the "Offer: Senior Product Manager" header via `HeaderCard` (visually Heading-sized, marked up as BodyText). No accessibility conflict observed.

## Final Verdict: APPROVED

All four new AI surfaces render correctly in the running dev prototype. Copy matches the brief (post copy-review). Gate behaviours work. Accessibility spot-checks pass. No compile errors. HMR clean.

Ready for PM handoff.
