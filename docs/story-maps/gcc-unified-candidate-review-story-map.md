# Story Map: Unified candidate review surface (GCC-E2E-017)

**Epic draft:** `docs/epics/gcc-unified-candidate-review-epic-draft.md`  
**Jira epic:** [HRREC-91050](https://jira2.workday.com/browse/HRREC-91050)  
**Stories:** HRREC-91051–91061 (11 issues: 6× VS1, 3× VS2, 2× VS3)  
**PRD:** `docs/prds/gcc-unified-candidate-review-prd.md`  
**Discovery brief:** `design/gcc-unified-candidate-review-v57-discovery-brief.md`  
**Figma:** https://www.figma.com/design/tbyRMoc1CdtyE4ZSyoAoxf  
**Created:** 24 March 2026  
**Author:** AI Story Mapping Specialist  

## HITL (GCC-E2E-017 Step 11)

**Recorded approval:** Full chain requested in mission Step 11: create **Jira epic + all stories** across **VS1, VS2, VS3** (orchestrated backlog refinement).

## Epic Context

As a recruiter or TA specialist managing high-volume job requisitions, I want a unified candidate review surface with summary, CV, activity, notes, optional HiredScore prioritisation insight, reliable sequential navigation, and return to the candidate list, so that I can triage faster with fewer tab hops and clear auditability.

**Key personas:** Recruiter / TA specialist (primary); recruiting coordinator (secondary)  
**Business goals:** Reduce navigation tax at scale; improve early-stage documented judgement; competitive UX parity for req-based triage (not omnichannel / statutory gaps)

## User Activities (Horizontal Backbone)

1. Open unified review from the requisition candidate list  
2. Scan context on one surface (insight, summary, CV, activity, notes)  
3. Move through candidates sequentially  
4. Return to list or fall back to full profile  
5. Capture and review notes with correct gating  
6. Ship insight slot, observability, and RTL quality bar  
7. De-risk notes policy and navigation NFR via spike and regression pack  

## User Tasks (Vertical Slices)

### Activity 1: Open unified review
- Drill into unified review from candidate name or row action → **VS1**

### Activity 2: Scan context
- Render four-panel layout with header (name, req context, stage, position) → **VS1**  
- Show prioritisation insight content or approved empty states → **VS2**  
- Mirror layout for RTL / Arabic → **VS2**

### Activity 3: Sequential navigation
- Previous candidate / next candidate with loading states → **VS1**  
- Avoid wrong order, skips, stale context (engineering + QA) → **VS3**

### Activity 4: Return / fallback
- Back to candidate list → **VS1**  
- Open full profile → **VS1**

### Activity 5: CV and activity
- CV preview, download, no preview empty, load errors → **VS1**  
- Activity timeline, empty state, show more activity, loading → **VS1**

### Activity 6: Notes
- Note composer, note type filter, save, cancel, success and error states → **VS1**  
- Policy-blocked note messaging (pending spike + 060) → **VS1**

### Activity 7: Insight slot and observability
- Show details / hide details, about this insight, advisory copy → **VS2**  
- Client telemetry for surface load, navigation, panels, notes, insight toggle → **VS2**

### Activity 8: Discovery / hardening
- Time-boxed pre-screen notes spike gate → **VS3**  
- Automated regression pack for sequential navigation reliability → **VS3**

## Value Slices

### VS1: Walking skeleton triage
**Goal:** On a pilot requisition, median time to complete first disposition from unified review is **no worse than** sequential review baseline, with **≥30%** fewer distinct navigation actions to reach CV + activity + notes (target for instrumentation in pilot).

**Stories:**

1. Open unified candidate review from the requisition candidate list  
2. Unified review layout with summary, CV, activity, and notes  
3. Previous candidate and next candidate navigation with loading and load failure handling  
4. Back to candidate list and open full profile from unified review  
5. CV and activity panels with preview, download, empty states, and errors  
6. Candidate notes with type filter, save flow, empty state, and policy-gated messaging  

**Total Stories:** 6

### VS2: Prioritisation insight, telemetry, RTL
**Goal:** **100%** of pilot sessions emit core telemetry events; **0** P1 defects on RTL / Arabic layout smoke tests for the unified surface.

**Stories:**

7. Prioritisation insight region for HiredScore with empty states, expand details, and transparency copy  
8. Client telemetry for unified review engagement  
9. RTL and Arabic layout for unified candidate review  

**Total Stories:** 3

### VS3: Spike and NFR hardening
**Goal:** Spike gate completes with a recorded branch (**A** / **B** / **C**); navigation reliability test pack linked to PRD NFR and DA references **executes in CI** with **no open sev-1** against defined scenarios.

**Stories:**

10. Pre-screen notes spike gate (time-boxed)  
11. Automated regression pack for sequential candidate navigation on unified review  

**Total Stories:** 2

## Story Map Visualization

```
Open          Scan           Navigate        Return         CV/Activity      Notes
---------------------------------------------------------------------------------
S1 (VS1)      S2 (VS1)       S3 (VS1)        S4 (VS1)       S5 (VS1)         S6 (VS1)
              S7 (VS2)                      Insight+tel    RTL (VS2)        S8 (VS2)
                                                            S9 (VS2)
Spike (VS3)   NFR tests (VS3)
```

## Summary

**Total Activities:** 8  
**Total Tasks / Stories:** 11  
**Value Slices:** 3  
**VS1 Stories:** 6  
**VS2 Stories:** 3  
**VS3 Stories:** 2  
