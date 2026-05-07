# Self-Service Agent: Create Job Req flows — design & interaction best practices (first pass)

**Status**: `promoted — canonical behaviour in [016-ssa-canvas-pattern.md](../../.cursor/rules/design-specific/016-ssa-canvas-pattern.md); visual evidence retained here`. The cold-start → split-pane → success arc and the 10 tagged best-practice hypotheses from §6 now inform the SSA Canvas rule (016) and the split-pane subsection in [`ai-experience-guidance.md`](ai-experience-guidance.md). PM narration in §7 is still outstanding; updating those answers will refine the hypotheses in §6 without changing the canonical contract in 016.

**Source videos** (local scratch; not in git — see [.gitignore](../../.gitignore)):
- `design/references/ssa-create-req-videos/source/location-move.mov` (copy of *GEV - Create Job Req - Location Move.mov*)
- `design/references/ssa-create-req-videos/source/overlap.mov` (copy of *GEV - Create Job Req - Overlap.mov*)

**Keyframes** (gitignored): `frames-location-move/*.png`, `frames-overlap/*.png` — sampled every ~3s at 1280px wide from 2892×1536 / ~60 fps H.264 source.

---

## 1. Metadata (probed)

| Video | Duration | Resolution (source) | Video | Audio |
|------|----------|---------------------|-------|-------|
| Location Move | ~183.6 s (~3m 04s) | 2892 × 1536 | h264 | AAC mono, 48 kHz |
| Overlap | ~193.1 s (~3m 13s) | 2892 × 1536 | h264 | AAC mono, 48 kHz |

**Extraction**: ffmpeg MCP — scene threshold 0.25 + `mod(n,180)==0` safety net; PNG output 1280×680; **62** frames (Location Move), **65** frames (Overlap).

**Timestamp hint**: Frame filenames encode source frame indices (e.g. `loc-6300.png` ≈ 6300÷60 ≈ **105 s** at 60 fps). Use filenames as stable evidence IDs even if wall-clock drifts slightly.

---

## 2. Agentic intents observed (from UI copy)

### Location Move (`location-move.mov`)

**Surface intent**: HR / manager initiates a **Change Job: Transfer Position** for an employee (**Maria**) moving **Guadalajara → Mexico City**.

**What the agent does (visible)**:
- Parses natural-language goal from chat.
- Surfaces **worker disambiguation** when multiple matches exist (two Marias) and **routes attention to the right-hand structured panel** rather than guessing in chat.
- Guides **effective date** selection with **pay-period alignment** rules; **auto-adjusts** invalid dates and labels the corrected value (**payroll-safe**).
- Surfaces **downstream impacts** before commit (e.g. **pay grade / compensation change**, benefits **re-enrollment** implications).
- On success: **transaction id**, **effective date**, **benefits reset** follow-up, dual confirmation (chat + right pane).

> **Naming note**: File title says "Create Job Req"; visible product chrome is **transfer / change job**. Treat this video as **agentic multi-step HR transaction + copilot**, analogous to create-req flows for pattern transfer — not as proof of a literal "Create Requisition" screen in this recording.

### Overlap (`overlap.mov`)

**Surface intent**: Recruiting user opens a **backfill** for **Alex** in **Portland** while incumbent may still be **in-seat**.

**What the agent does (visible)**:
- Resolves worker/position context (Senior Analyst, org, comp band) into a **structured Position Confirmation** panel.
- **Defaults Overlap on** when incumbent still in role, **explains why**, and asks user to **review before proceeding**.
- Pre-populates **job description** and **skills** from job profile; supports **NL refinement** of copy ("more interesting but still professional") with **bulleted change summary** in chat.
- Negotiates **target hire / recruiting dates** with **payroll-safe** rationale and **writes through** to the form; user can override in chat (e.g. "June 16th").
- Final step: **summary table + primary Approve & Open Req**; success shows **req number**, **overlap active** state, and celebratory right-pane confirmation.

---

## 3. Screen-by-screen flow (representative frames)

Tables list **evidence PNGs** under `design/references/ssa-create-req-videos/` (gitignored). Approximate time = `frame_index / 60` seconds (see §1).

### Location Move — selected beats

| ~Time | Evidence | Screen / state | Agent (chat) | User / form (right) |
|-------|----------|----------------|--------------|---------------------|
| ~0–30 s | `frames-location-move/loc-0000.png` … `loc-1080.png` | Home dashboard | — | — (entry from shell; assistant icon in header) |
| ~105 s | `frames-location-move/loc-6300.png` | Split SSA + **Effective Date** | Disambiguation message holds; form shows **payroll alignment** note + **auto-correct banner** (invalid date → next payroll-safe date) + **Confirm** CTA | Stepper: **Select Worker** done → **Effective Date** active |
| ~132 s | `frames-location-move/loc-7920.png` | **Details** | Same thread | New location + **impact** (grade upgrade, comp delta, optional fields affordance) |
| ~150 s | `frames-location-move/loc-9000.png` | **Submitted** | Success + **Txn ID** + **benefits reset** explainer | Stepper all complete; large success illustration |

### Overlap — selected beats

| ~Time | Evidence | Screen / state | Agent (chat) | User / form (right) |
|-------|----------|----------------|--------------|---------------------|
| ~30 s | `frames-overlap/ov-1800.png` | SSA empty / typing | — | User drafts backfill intent in composer |
| ~45 s | `frames-overlap/ov-2700.png` | **Position Confirmation** | Identifies Alex role; **enables Overlap by default** + rationale | Cards: position id, worker type, org, comp overview; stepper step 1 |
| ~60 s | `frames-overlap/ov-3600.png` | Same phase | Reinforces **review right panel** | **Overlap** toggle ON + explainer band |
| ~90 s | `frames-overlap/ov-5400.png` | **Details** | User asks to refresh job description tone | JD card + **skills** chips + **recommended count** banner |
| ~120 s | `frames-overlap/ov-7200.png` | **Details** (post-edit) | **Done** + bullet list of edits | Skills taxonomy (required / preferred / top performers); **Confirm & Continue** |
| ~165 s | `frames-overlap/ov-9900.png` | **Approve & Open Req** | Suggests June dates; **updates form fields** | Summary table (profile, overlap, location, dates, skills) |
| ~189 s | `frames-overlap/ov-11340.png` | **Opened** | User refines date; **Req posted** + overlap callout | All steps checked; centre **Requisition Opened** state |

---

## 4. Interaction patterns (Before / During / Over Time)

Cross-walk to the three-phase spine in [`ai-experience-guidance.md`](ai-experience-guidance.md) §4.

### Before interaction

- **Clear entry**: Full-width **Self-Service Agent** shell with **starter suggestions** + **See other suggestions** (empty state in `ov-1800.png`).
- **Ambient trigger**: Home dashboard exposes assistant affordance in **global header** (both demos).
- **Expectation-setting**: First agent message explains scope at a high level (policy + **gets things done**).

### During interaction

- **Split-pane mental model**: **Chat = intent + reasoning + light actions**; **Right pane = system of record + validation + heavy confirmation** — consistent across both workflows.
- **Never silently pick among people**: **Disambiguation** with **explicit handoff** to structured selection (`loc` Maria example).
- **Constraint-first UX**: **Payroll-safe** dates — educate rule → offer recommended path → **correct + explain** when user deviates (`loc-6300.png`).
- **Smart defaults with transparency**: **Overlap on** when backfill while incumbent in-seat; **plain-language why** (`ov-2700.png`, `ov-3600.png`).
- **Grounding affordances**: **+ Sources**, **Show Steps** (when present), **thumbs up/down** on agent turns.
- **Human-in-the-loop for irreversible commits**: Stepper ends in **Review / Approve** with **Edit** affordances on rich content (JD card).

### Over time

- **Traceability**: **Transaction ID** (transfer) / **Requisition ID** (posting).
- **Side-effect disclosure after success**: **Benefits reset / open enrollment** messaging in chat (`loc-9000.png`).
- **Continuity prompt**: "Is there anything else I can help you with?" after terminal states.

---

## 5. UI component mapping (hypothesised → Canvas / Sana)

| Observed in demo | Prototype mapping (workspace) |
|------------------|-------------------------------|
| Global shell (menu, pill search, avatar rail) — **white top bar + grey pill search**, underlined by either the Workday brand gradient (homepage, `ov-5400.png`) or a 1px hairline (SSA / task pages, `ov-2700.png`) | `WorkdayTopNav` (`design/components/WorkdayTopNav.tsx`) with `variant="home"` on homepages and `variant="app"` everywhere else. Tokens: `SANA_TOP_NAV_BG` (`#FFFFFF`), `SANA_SEARCH_FIELD_BG` (`#F3F4F6`), `SANA_TOP_NAV_DIVIDER` (`#E5E7EB`), `SANA_HOMEPAGE_GRADIENT`. Full spec: [`015-sana-style-ui.md`](../../.cursor/rules/design-specific/015-sana-style-ui.md) → Colour → Top navigation bar. |
| SSA header + window controls | Treat as dedicated agent chrome (narrow max-width for empty; **split layout** needs full width for right pane) |
| Chat bubbles + composer pill | `SanaCommMessageBubble`, `SanaCommComposer` — [`communication-patterns.md`](../docs/canvas-kit-patterns/communication-patterns.md) § Full-Page Agentic Assistant |
| AI disclaimer footer | Align with [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) AI-Specific Copy → disclosure placement |
| Right-pane stepper + cards | Canvas **Tabs** / step indicators + `Card` / `FormField` patterns; rich selects as card list |
| Warning / info banners | Canvas `Banner` (variants for caution vs info) |
| Skill chips | `StatusIndicator` or pill pattern per [`320-prototype-developer.mdc`](../../.cursor/rules/320-prototype-developer.mdc) |
| Embedded GenUI payloads (future) | `A2UIRenderer` + `GenUIPatterns` per 015 / 320 |

---

## 6. Best-practice hypotheses (tagged)

Generalisable patterns for **SSA-style agentic workflows** (create req, backfill, overlap, transfers). **Validate with PM narration** before elevating to mandatory rules.

| # | Practice | Evidence | Confidence | Canon link |
|---|----------|----------|------------|------------|
| 1 | **Pair chat with a persistent structured task surface** for multi-step transactions | Both videos | **High** | `ai-experience-guidance.md` §6 patterns (Contextual Ingress / Partial Chat + task surface) |
| 2 | **Disambiguate people in the form**, not via hidden model choice in chat | `loc-*` worker step | **High** | Trust / Experience principles |
| 3 | **Explain smart defaults** (especially legal/HR-sensitive toggles like Overlap) | `ov-2700`, `ov-3600` | **High** | `ai-experience-guidance.md` §9 voice; **`319`** disclosure |
| 4 | **When business rules break user input**, auto-correct **and** show **before/after + why** | `loc-6300` banner | **High** | `319` three-part error shape (adapt for warnings) |
| 5 | **Surface compensation / grade impacts before commit**, not only after | `loc-7920` | **High** | Empower + Trust |
| 6 | **Post-success: transaction id + downstream side effects** (benefits, notifications) | `loc-9000` | **High** | Phase 3 / Over time |
| 7 | **NL editing of long copy** should return a **short summary of edits** + pointer to review panel | `ov-7200` | **Medium** | Ask Workday voice / specific bullets |
| 8 | **Skills: pre-populate + editable taxonomy** with **quality nudge** ("N skills recommended") | `ov-5400`, `ov-7200` | **Medium** | Creating mode |
| 9 | **Date negotiation in chat writes through** to form fields with **rationale** | `ov-9900`, `ov-11340` | **Medium** | Anticipate / Amplify |
|10 | **Celebrate completion in both panes** (chat summary + right-pane illustration) | `loc-9000`, `ov-11340` | **High** | Consistency |

---

## 7. Open questions for narration (TBC)

1. **Product scope**: Why is Location Move titled "Create Job Req" in filenames while UI shows **Change Job: Transfer Position**? What should PMM call this in enablement?
2. **Disambiguation rules**: How does the agent decide **when** to ask vs auto-resolve (e.g. middle-name, cost centre)?
3. **Overlap policy**: Is default-on **Overlap** tenant-configurable? What happens if tenant forbids overlap — does the agent suppress posting or change messaging?
4. **JD rewrite**: Is there a **guardrail** (tone, inclusive language, compliance) beyond user prompt? Any diff view?
5. **Show Steps / Sources**: What do these expand to in prod (documents, tool traces, reasoning chain)?
6. **Error & edge paths**: Not observed in keyframes — intentional demo polish or gaps to design?

---

## 8. Next steps

1. **PM pass**: Fill §7; downgrade **Medium** items or promote to **High** with evidence quotes.
2. **Promote selectively** into [`ai-experience-guidance.md`](ai-experience-guidance.md) as a short **"SSA split-pane transactions"** subsection if narratives confirm.
3. **315 / 318**: Add optional checklist row: *SSA-style split pane? disambiguation in form? payroll-safe correction pattern? overlap default explained?*
4. **320**: When prototyping SSA, mirror **left chat + right task** aspect ratio and stepper; reuse `SanaComm*` per [`communication-patterns.md`](../docs/canvas-kit-patterns/communication-patterns.md).

---

## Workspace cross-references

| Document | Why |
|----------|-----|
| [`ai-experience-guidance.md`](ai-experience-guidance.md) | Phases, patterns, disclosure, errors, Ask Workday voice |
| [`015-sana-style-ui.md`](../../.cursor/rules/design-specific/015-sana-style-ui.md) | Agentic shell + GenUI width guidance |
| [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) | AI-specific copy and disclosure |
| [`communication-patterns.md`](../docs/canvas-kit-patterns/communication-patterns.md) | `SanaCommMessageBubble`, `SanaCommComposer`, scroll + composer |
| [`docs/experience-principles.md`](../../docs/experience-principles.md) | Empower / Trust / Grow examples |
