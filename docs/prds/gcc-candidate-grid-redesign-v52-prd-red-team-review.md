# Red Team PRD Review: Candidate Grid Redesign (v52 PRD)

**Mode:** 1 (PRD risk analysis)  
**Date:** 22 March 2026  
**Artefact:** `docs/prds/gcc-candidate-grid-redesign-v52-prd.md`  
**CI inputs:** `research/competitive/gcc/e2e-ci-brief-candidate-grid-redesign-2026-03-22.md` (GCC-E2E-011); `research/competitive/matrices/gcc-competitive-matrix.md` (E2E-011 delta)

---

### Critical Risks (Blockers if not addressed)

*None identified beyond those already mitigated in the carried-forward v46/v50 text.* The **v52** delta is primarily **traceability** (PMF v52, fresh **101**, new Deployment Agent thread); core feasibility and competitive claims remain aligned with the CI brief.

---

### Important Issues (Should address before 315)

1. **“Viewed” / “unviewed” candidate indicator**  
   - **Evidence:** Deployment Agent (E2E-011) states there is **no native** viewed/unviewed flag; workaround is a **Reviewed** process step.  
   - **Impact:** Buyers comparing to tools with explicit review queues may still perceive a **workflow** gap even after unified modal ships.  
   - **Recommended fix:** Add a **short FAQ or Out of Scope note** in the PRD (or sales supplement) that states the leading-practice configuration pattern so field teams do not over-promise native badges.

2. **SmartRecruiters mentions in competitive conversations**  
   - **Evidence:** E2E-011 brief uses **secondary** review sites only for SmartRecruiters; PRD body does not over-cite them (good).  
   - **Impact:** Accidental slide-deck copy could treat review blogs as **feature fact**.  
   - **Recommended fix:** Keep **Greenhouse** + **Deployment Agent** as **primary** evidence in customer-facing materials; pull SmartRecruiters only from **official** product pages when needed.

---

### Feasibility Concerns (Workday System Constraints)

- **Sequential review:** Reconfirmed **native** on fresh DA query (`eb984a05-f81e-44f5-8c59-f7cf1575f0fc`). PRD correctly avoids claiming net-new carousel as the only value.  
- **Inline CV:** Still depends on document platform spike; PRD fallback path remains appropriate.

---

### Hidden Assumptions

- **Assumption:** Recruiters who want “unified” UX primarily mean **tab reduction inside profile**, not lack of **next/prev** (validated against DA).  
- **Assumption:** 60% adoption ramp remains ambitious; unchanged from prior Red Team commentary — monitor with leading telemetry.

---

### Real-World Failure Scenarios

- **Scenario:** Buyer demo compares **Greenhouse** three-panel screenshot to Workday **multi-tab** profile **after** GA of unified modal but **without** RTL fix — Arabic CV fails in inline pane → **GCC deal** damage. **Mitigation** already in PRD QA; hold line on GA criteria.  
- **Scenario:** AE claims “Workday cannot move candidate to candidate” — **false** per DA; **enablement** must reinforce **native** sequential navigation.

---

### Recommended Fixes (for 200 — one revision max)

1. Add **one paragraph or bullet** under **Risks** or **Competitive Analysis**: viewed/unviewed = **no native flag**; **Reviewed** step as leading practice (per Deployment Agent).  
2. No change required to core metrics or scope unless PM wants viewed indicators in a later epic.

---

**Summary for Orchestrator:** **0 critical risks**, **2 important issues** (viewed/unviewed buyer narrative; SmartRecruiters evidence hygiene). Optional **200** revision: add viewed/unviewed clarification (1 bullet).
