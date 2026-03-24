# Red Team PRD Review: Candidate Grid Redesign (v50)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v50-prd.md`  
**Mode:** 080 Mode 1 (PRD risk analysis)  
**Review date:** 22 March 2026  
**Mission:** GCC-E2E-009 (HITL **#5**)  
**Inputs:** PRD v50; `research/competitive/gcc/e2e-ci-brief-candidate-grid-redesign-2026-03-22.md`; `research/competitive/matrices/gcc-competitive-matrix.md`; `research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v50.md` (E2E **#5**); prior v46 Red Team `docs/prds/gcc-candidate-grid-redesign-v46-prd-red-team-review.md` (carry-forward where still applicable).  
**Functional knowledge note:** Same as v46 review — repo `functional-knowledge/` may lack PDFs on disk; indexed corpus per `MISSION_LOG.md` remains the authority for purge/retention when stories reference logging.

---

### Critical risks (blockers if ignored)

1. **Positioning vs Deployment Agent / **101** CI (partially addressed in v50 PRD edit)**  
   **Sequential** next/previous candidate review is **native**. If sales, deck, or UX copy implies Workday lacks this, **credibility** and **CS** expectations break.  
   - **Evidence:** CI brief §2 (Deployment Agent summary): *“navigation arrows to move directly to the next candidate in the grid without returning to the main list.”*  
   - **Status after 200 revision:** Executive summary, Overview table, Feature Solution, and Competitive Analysis now anchor on **single-surface** / tab reduction.  
   - **Residual risk:** **320** prototype annotations and **430** story text must repeat the same framing — route through **319**.

2. **Inline CV / platform reality (unchanged from v46)**  
   PRD still bets on inline rendering with spike + fallback. Mis-scoping remains a **schedule** and **differentiation** risk if GA ships **viewer-only**.  
   - **Recommended fix:** Keep **Q2 spike** + **Open CV** fallback as explicit GA boundary in **Dependencies & Risks** (already present); **315** must visualise **both** states.

3. **Germany anonymisation + GCC Arabic/RTL (unchanged from v46)**  
   Full-context modal vs anonymised screening and RTL PDF legibility can still **block** default rollout if acceptance criteria are weak.  
   - **Recommended fix:** Retain journey bullets and QA gates; **060** on **319** legal-sensitive strings.

---

### Important issues (before 315 PASS 3–4)

1. **Success metric narrative** — **Addressed in PRD:** Executive Summary now references **~30%** thorough-review reduction, consistent with Success Metrics and Overview.  
2. **Greenhouse “parity” wording**  
   Competitive section now separates **sequential parity** from **single-surface** bet — ensure **101** matrix delta in `gcc-competitive-matrix.md` stays consistent when refreshed.  
3. **Version sprawl**  
   v46 PRD, v50 PRD, and multiple discovery briefs coexist — **430** should link **one** canonical PRD path (v50) for new Jira work.

*(Open important issues: **2** and **3** above.)*

---

### Feasibility / hidden assumptions (summary)

- Carry forward v46 Red Team items: PDF isolation model, adoption maths reconciliation (PRD already expanded ramp model), telemetry proxy (session dwell — present), CK v11 contingency (present).  
- **Assumption:** **HiredScore / AI** “if enabled” copy in modal does not expand **EU AI Act** scope in Phase 1 — **060** on any new AI strings.

---

### Return summary (orchestrator)

| Item | Value |
|------|--------|
| **Critical risks count** | **3** (positioning; inline CV; anonymisation/RTL) |
| **Important issues count** | **2** open (plus 1 closed: 40/30 harmonisation) |
| **Top finding** | **GTM and build must not oversell “new” sequential navigation** — differentiate on **single-surface context**. |
| **200 revision (7b)?** | **Yes** — applied in-repo: PRD v50 sections above; no further revision required this turn unless PM expands scope. |

---

**Summary for orchestrator:** v50 PRD updated for **101** positioning; residual risks are **implementation** (inline CV), **compliance** (DE / GCC docs), and **copy discipline** (319/430).
