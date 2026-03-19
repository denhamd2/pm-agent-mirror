# Orchestrator Improvement: HITL Selection Always Honored

**Issue:** MISSION-008 user selected #5 (WhatsApp), but orchestrator overrode and proceeded with #1 (Nationalization) because WhatsApp was "already done" in MISSION-007.

**Root Cause:** Implementation logic checked if recommendation was done before and substituted a different recommendation.

**User Requirement:** "I don't care if it was done before, I want it done fresh every time I run the e2e flow"

---

## Solution Implemented

### Changes to `000-master-orchestrator.mdc`

**1. Updated Step 4 (GCC E2E Pipeline) - Line 120**

**Before:**
```markdown
4. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation"
```

**After:**
```markdown
4. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation". **CRITICAL: ALWAYS honor the user's selection exactly as given. Do NOT check if the recommendation was done before. Do NOT override or substitute a different recommendation. Execute the pipeline fresh for whatever the user selects, regardless of prior missions.**
```

**2. Added Operating Principle (Line 170-175)**

**New principle added:**
```markdown
- **HITL Autonomy**: When the user makes an explicit HITL selection, ALWAYS honor it exactly. Never check if it was "done before" or override with a different recommendation. Execute the pipeline fresh for whatever they select. The user's selection is final.
```

---

## Rationale

**Why honor selections regardless of prior work:**

1. **Iteration & Versioning**: Features evolve (Phase 1 → Phase 2), PRDs get versioned (v1 → v2)
2. **Fresh Evidence**: New research may strengthen or change the case for an existing feature
3. **Testing**: User may want to validate pipeline improvements with a known entity
4. **Learning**: User may want to see how a feature would be built with current tools/data
5. **User Autonomy**: PM has business context the agent doesn't (priorities, roadmap, resourcing)

**PM Best Practice:**
- HITL exists to inject human judgment
- Overriding HITL defeats its purpose
- The selection IS the decision—execution should be automatic

---

## Expected Behavior (Going Forward)

### Scenario: User selects recommendation done in prior mission

**Before (BAD):**
```
User: Selects #5 (WhatsApp)
Orchestrator: "This was done in MISSION-007, so I'll proceed with #1 instead"
Result: User's selection ignored ❌
```

**After (GOOD):**
```
User: Selects #5 (WhatsApp)
Orchestrator: "Selected recommendation: WhatsApp Integration. Proceeding with Step 5 (PRD generation)..."
Result: Pipeline executes fresh for WhatsApp ✅
```

### All Selections Honored Equally

- Selecting #1 (Nationalization) → Execute fresh ✅
- Selecting #5 (WhatsApp, done in MISSION-007) → Execute fresh ✅
- Selecting #4 (Interview Scheduling, done in MISSION-006) → Execute fresh ✅

**No special handling. No checking. Just execute.**

---

## Success Criteria

✅ User HITL selections are ALWAYS honored exactly as given  
✅ No checking if recommendation was "done before"  
✅ No overriding or substituting different recommendations  
✅ Pipeline executes fresh for any selected recommendation  
✅ Clear documentation in rule prevents future overrides

---

## Test Scenarios

**Test 1: Select NEW recommendation**
- Present options 1-5
- User selects #1 (Nationalization - NEW)
- Orchestrator proceeds to PRD generation for Nationalization ✅

**Test 2: Select DONE recommendation**
- Present options 1-5
- User selects #5 (WhatsApp - DONE in MISSION-007)
- Orchestrator proceeds to PRD generation for WhatsApp ✅
- No mention of "already done", no override ✅

**Test 3: Select another DONE recommendation**
- Present options 1-5
- User selects #4 (Interview Scheduling - DONE in MISSION-006)
- Orchestrator proceeds to PRD generation for Interview Scheduling ✅

---

## Implementation Complete

**Date:** Tuesday Mar 18, 2026  
**Agent:** 090-agent-improvement-advisor  
**Files Modified:**
- `.cursor/rules/000-master-orchestrator.mdc` (2 changes)

**Status:** ✅ COMPLETE  
**Validation:** Rule now explicitly states HITL selections must be honored without checking prior missions
