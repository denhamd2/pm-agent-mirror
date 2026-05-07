# Unified Talent Acquisition keynote demo — design & interaction best practices (first pass)

**Status**: `visual-only; narration TBC` — framed from keyframe analysis of `WorkdayIS_Day1-140-UnifiedTalentAcDemo-v01.mp4` (no audio transcription). Add PM narration context to section 7 and tighten confidence in section 6 after review.

**Source video** (local scratch; not in git — see `.gitignore`):
- `design/references/talent-acq-videos/source/unified-talent-acq-demo.mp4`

**Keyframes** (gitignored):
- `design/references/talent-acq-videos/frames/tad-*.png`
- Extracted from 1920×1080 / ~59.94 fps source, scaled to 1280×720
- Sampling strategy: scene-change (`gt(scene,0.22)`) + safety net (`mod(n,240)==0`, ~4s)

---

## 1. Metadata (probed)

| Video | Duration | Resolution (source) | Video | Audio |
|------|----------|---------------------|-------|-------|
| Unified Talent Acquisition keynote demo | ~240.83 s (~4m 01s) | 1920 × 1080 | h264, yuv420p, ~59.94 fps | AAC stereo, 48 kHz |

**Extraction output**: 68 frames (`tad-00000.png` … `tad-14400.png`).

**Timestamp hint**: Frame filenames encode source frame indices (e.g. `tad-7200.png` ~= 7200 / 60 ~= 120 s).

---

## 2. Agentic intents observed (from visible UI)

**Surface intent**: recruiter-oriented Talent Acquisition copilot that helps prioritize critical requisitions, shortlist candidates, assist review/scheduling, and trigger coordinated outreach.

**What the agent does (visible)**:
- Starts from a recruiter home shell with suggestion chips and urgent-task context (`tad-00960.png`).
- Opens a split layout where left side remains system-of-record (candidate pipeline / profile) and right side runs conversational TA agent (`tad-02400.png`, `tad-04127.png`).
- Accepts natural-language filters (skills/experience) and writes outcomes back into structured candidate list filters (`tad-04800.png`, `tad-05278.png`).
- Supports candidate review workflow with insights and fit/gap evidence in profile context (`tad-05760.png`, `tad-06480.png`).
- Demonstrates recruiter coordination in external messaging surface (Teams-like chat) for interview scheduling and conflict resolution (`tad-09360.png`).
- Shows candidate-facing conversational outreach on mobile (`tad-10800.png`).

**Demo context note**:
- This is a keynote-stage recording. Some frames are presenter-focused (`tad-03595.png`, `tad-11890.png`) and must not be interpreted as UI behavior.
- Observations are separated into **Demo UI** vs **Presenter/stage context** in sections 3 and 6.

---

## 3. Screen-by-screen flow (representative frames)

Tables list evidence PNGs under `design/references/talent-acq-videos/frames/`. Approximate time = `frame_index / 60` seconds.

| ~Time | Evidence | Demo UI vs Presenter | Screen/state | Agent behavior | User/form behavior |
|------|----------|----------------------|--------------|----------------|--------------------|
| ~0 s | `tad-00000.png` | Presenter/stage context | Innovation Summit title card | N/A | N/A |
| ~16 s | `tad-00960.png` | Demo UI | Recruiter home with suggestions, quick actions, urgent tasks | Offers prompt starters and action shortcuts | User can launch by prompt or chip |
| ~40 s | `tad-02400.png` | Demo UI | Senior Buyer req page + TA agent side panel | Frames critical role + top candidates intent | Structured req/candidate table remains visible |
| ~69 s | `tad-04127.png` | Demo UI | Same split view, populated dialogue | Returns shortlist and asks follow-up intent | Recruiter follows via conversational prompts |
| ~88 s | `tad-05278.png` | Demo UI | Candidate list with active filter chips | Applies experience/leadership criteria from NL | Table reflects updated shortlist set |
| ~96 s | `tad-05760.png` | Demo UI | Candidate profile + resume + insight panel | Supports review with context and cues | Recruiter can move forward/decline in structured controls |
| ~108 s | `tad-06480.png` | Demo UI | Fit & gap evidence panel | Highlights qualification signal mapping | Recruiter reviews transparent evidence lines |
| ~144 s | `tad-08640.png` | Demo UI | External chat app context (empty thread before post) | Prepares outreach/scheduling step | Cross-app workflow begins |
| ~156 s | `tad-09360.png` | Demo UI | External chat with scheduling conflict negotiation | Proposes candidate/panel times, reconciles conflicts | Humans confirm updated slot in-thread |
| ~180 s | `tad-10800.png` | Demo UI | Mobile candidate message thread | Candidate outreach + interview confirmation | Candidate responds in channel |
| ~200 s | `tad-11890.png` | Presenter/stage context | Speaker close-up (no readable UI) | N/A | N/A |
| ~236 s | `tad-13938.png` | Presenter/stage context | Impact/results slide | N/A | N/A |

---

## 4. Interaction patterns (Before / During / Over Time)

Cross-walk to `design/references/ai-experience-guidance.md` phase spine.

### Before interaction
- **Intentful entry on recruiter home**: suggestion rows + quick action chips reduce blank-page friction (`tad-00960.png`).
- **Ambient + explicit launch paths**: user can ask in global prompt or click shortcuts.

### During interaction
- **Split-pane agent + task shell**: conversational reasoning on one side, live system-of-record table/profile on the other (`tad-02400.png`, `tad-04127.png`).
- **NL-to-structured write-through**: filters/refinements from chat become visible chips/tables (`tad-04800.png`, `tad-05278.png`).
- **Transparent evidence for ranking/review**: fit-gap lines and candidate insights presented near decision controls (`tad-06480.png`).
- **Cross-surface orchestration**: recruiting action continues in collaboration channel for panel alignment (`tad-09360.png`).

### Over time
- **Channel continuity**: flow extends from recruiter workbench to collaboration and candidate messaging (`tad-09360.png`, `tad-10800.png`).
- **Outcome framing**: keynote closes with measurable business impact slide (`tad-13938.png`) — useful for storytelling, not a direct product pattern.

---

## 5. UI component mapping (hypothesised -> Canvas / Sana)

| Observed in demo | Prototype mapping (workspace) |
|------------------|-------------------------------|
| Recruiter shell with left nav + top search | `.cursor/rules/010-style-guide.mdc` and `.cursor/rules/design-specific/015-sana-style-ui.md` |
| Agent side panel beside canonical task surface | Split-pane agent shell guidance (to be codified in AI pattern catalog) |
| Conversational turns + suggestion prompts + sources | `design/docs/canvas-kit-patterns/communication-patterns.md` (`SanaComm*` patterns) |
| Candidate table with chips/filters | Canvas table/filter-chip patterns in existing system-of-record UI |
| Candidate insights / fit-gap evidence panel | Card + list + inline text evidence patterns; traceability copy in `319-copy-review.mdc` |
| Cross-app scheduling handoff | Contextual ingress pattern to collaboration surfaces; avoid fake in-app emulation if platform-native channel exists |
| Mobile candidate messaging surface | "Everywhere" surface selection from `ai-experience-guidance.md` |

---

## 6. Best-practice hypotheses (tagged)

Generalizable patterns for recruiter agentic workflows (pre-screening, scheduling, outreach, req prioritization). Validate with narration before promoting to strict standards.

| # | Practice | Evidence | Confidence | Concept vs Shippable | Demo UI vs Presenter | Canon link |
|---|----------|----------|------------|----------------------|----------------------|------------|
| 1 | Use **split-pane agent + task** for high-consequence recruiting tasks where context must stay visible while conversing. | `tad-02400`, `tad-04127` | High | Shippable-leaning | Demo UI | `ai-experience-guidance.md` §6 patterns |
| 2 | Treat recruiter prompt as a control layer that **writes through** to structured filters/tables; never keep key state chat-only. | `tad-04800`, `tad-05278` | High | Shippable-leaning | Demo UI | SSA parallels in `ssa-create-req-flow-best-practices.md` |
| 3 | Keep **evidence next to decisions** (fit-gap signals, insights) so shortlist actions are explainable. | `tad-05760`, `tad-06480` | High | Shippable-leaning | Demo UI | Trust / transparency guidance |
| 4 | For interview scheduling, let AI propose options but require **human confirmation in shared channel** for conflict trade-offs. | `tad-09360` | Medium-High | Shippable-leaning | Demo UI | `ai-experience-guidance.md` phase 2/3 |
| 5 | Design agent flows as **multi-surface journeys** (workbench -> collaboration -> candidate channel), not single-screen experiences. | `tad-09360`, `tad-10800` | High | Shippable-leaning | Demo UI | Surface selection matrix |
| 6 | Use starter prompts/chips to accelerate first action, but preserve freeform prompt path for expert recruiters. | `tad-00960` | High | Shippable-leaning | Demo UI | Before-interaction framing |
| 7 | Avoid over-reading keynote stage framing as product pattern; separate storytelling slides from UI canon. | `tad-00000`, `tad-11890`, `tad-13938` | High | Concept-only | Presenter/stage | This doc method guardrail |
| 8 | If data is loading mid-transition, use explicit skeleton states to prevent users mistaking lag for missing content. | `tad-08160` | Medium | Shippable-leaning | Demo UI | Existing async/loading standards |

---

## 7. Open questions for narration (TBC)

1. What exact triggers move work from recruiter shell to collaboration channel (manual command, policy threshold, or auto-delegate)?
2. In scheduling, what authority boundaries apply (suggest-only vs auto-book)?
3. Which fit-gap signals are model-generated vs sourced from explicit profile/resume fields?
4. Is mobile candidate thread a current product capability or a concept illustration?
5. Were any policy/compliance guardrails omitted in the keynote for brevity (consent, localization, legal copy)?
6. What completion artifacts should be canonical for these flows (task IDs, interview event IDs, audit links)?

---

## 8. Pattern candidates to promote to canon

Candidates for Track C integration into `ai-experience-guidance.md` and design-rule touchpoints:

1. **Split-pane agent + task shell** as default for regulated or multi-step recruiter workflows; chat-only for low-stakes informational asks.
2. **NL-to-structured write-through** as non-negotiable for trust (chat actions visibly reflected in filters/forms/tables).
3. **Evidence-adjacent decisions** (fit-gap rationale shown at decision point, not buried in separate views).
4. **Cross-surface orchestration pattern** (workbench -> collaborator channel -> candidate channel), with explicit ownership boundaries.
5. **Human-confirmed scheduling commits** even when agent proposes slots.
6. **Stagecraft separation guardrail** for future demo analysis docs (Demo UI vs Presenter must be explicit).

---

## Workspace cross-references

| Document | Why |
|----------|-----|
| `design/references/ai-experience-guidance.md` | AI patterns, phases, surface selection, trust/disclosure anchors |
| `design/references/ssa-create-req-flow-best-practices.md` | Prior split-pane SSA reference and pattern continuity |
| `.cursor/rules/design-specific/015-sana-style-ui.md` | Agentic shell / generative UI alignment |
| `design/docs/canvas-kit-patterns/communication-patterns.md` | Conversational component usage and layout guidance |
| `.cursor/rules/319-copy-review.mdc` | AI disclosure / explanatory copy discipline |
| `docs/experience-principles.md` | Empower / Trust / Grow grounding |
