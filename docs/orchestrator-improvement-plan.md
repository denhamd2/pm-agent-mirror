# Orchestrator Improvement Plan: Honor HITL Selection

## Problem

In MISSION-008, the orchestrator presented 5 GCC recommendations via HITL (Human-In-The-Loop):
1. Nationalization & Compliance (NEW)
2. Reporting & Dashboards (NEW)
3. Offer Generation Rigidity (NEW)
4. Interview Scheduling (MISSION-006)
5. WhatsApp Integration (MISSION-007)

**User selected: #5 (WhatsApp)**

**Orchestrator behavior:** Checked if WhatsApp was "already done" in MISSION-007, then **overrode the user's selection** and proceeded with #1 (Nationalization) instead.

**Why this is wrong:**
- Violates user autonomy: The PM explicitly selected #5
- Assumes intent: "Since WhatsApp is done, they must want something new"
- Breaks trust: HITL becomes meaningless if selections are ignored
- Misses valid use cases:
  - User wants to iterate on existing work (extend WhatsApp stories)
  - User wants to regenerate artifacts with new insights
  - User wants to test the pipeline with a known entity
  - User wants to create a v2 of the feature

## PM Best Practice Context

**HITL (Human-In-The-Loop) is sacred in product workflows:**
- PMs make strategic decisions based on business context the agent doesn't have
- A selection isn't just "what to build next" — it's prioritization, resourcing, timing
- Even if a feature is "done," there are valid reasons to revisit:
  - **Iteration**: Extend scope (WhatsApp Phase 2: two-way messaging)
  - **Refinement**: Improve existing backlog based on new research
  - **Validation**: Re-run pipeline to test improvements
  - **Versioning**: Create v2 PRD with updated evidence/metrics

**Analogy:** If a PM selects a feature in sprint planning, the team doesn't say "We did that last sprint, so we'll work on something else." They honor the selection or ask clarifying questions.

## Proposed Solution

**Change orchestrator behavior to ALWAYS honor HITL selection, with smart handling for previously-done recommendations.**

### New Logic (Step 3-4 in GCC E2E Pipeline)

**Current (BAD):**
```
3. Present recommendations via AskQuestion
4. If user selects a "done" recommendation → Override and proceed with default
```

**Proposed (GOOD):**
```
3. Present recommendations via AskQuestion; STOP and WAIT for response
4. Parse user selection
5. IF selection was done before:
   a. Acknowledge: "You selected [Recommendation], which was completed in [MISSION-ID]."
   b. Ask clarification: "Would you like to:
      - Extend the existing work (add more stories/features)
      - Regenerate artifacts with fresh research
      - Proceed as-is (re-run the pipeline)"
   c. WAIT for user response
   d. Honor their choice
6. ELSE (new recommendation):
   a. Proceed directly to step 5 (invoke 200-prd-writer)
```

### Example Implementation

**Scenario:** User selects #5 (WhatsApp), which was done in MISSION-007.

**Orchestrator response:**
```markdown
You've selected **#5: WhatsApp Integration**, which was completed in MISSION-007:
- PRD: docs/prds/gcc-whatsapp-integration-prd.md
- Jira Epic: HRREC-90871 (7 stories)
- Prototype: design/gcc-whatsapp-campaign.tsx
- Figma: https://www.figma.com/design/inRBCInF7QUoCyIPUzXKqd

Would you like to:
1. **Extend the work** - Add Phase 2 features (two-way messaging, document requests)
2. **Regenerate artifacts** - Create v2 PRD/prototype with updated research
3. **Proceed as-is** - Re-run the full pipeline (research → PRD → prototype → Figma → backlog)

Please select 1, 2, or 3.
```

**If user selects "1. Extend":**
- Invoke 200-prd-writer: "Update the WhatsApp PRD to add Phase 2 scope (two-way messaging, document requests). Source: research/GCC/thematic-analysis/2026-03-18-GCC-PMF-Analysis-v2.md + existing docs/prds/gcc-whatsapp-integration-prd.md"
- Continue pipeline: 320 (prototype Phase 2), 319 (copy review), 330 (Figma capture), 400 (backlog refinement for new stories)

**If user selects "2. Regenerate":**
- Invoke 200-prd-writer: "Create a v2 PRD for WhatsApp Integration. Source: research/GCC/thematic-analysis/2026-03-18-GCC-PMF-Analysis-v2.md. This is a refresh of the MISSION-007 PRD with updated evidence and metrics."
- Continue pipeline: 320 (rebuild prototype), 319 (copy review), 330 (Figma capture), 400 (regenerate story map + create new epic)

**If user selects "3. Proceed as-is":**
- Invoke 200-prd-writer: "Create a PRD for WhatsApp Integration. Source: research/GCC/thematic-analysis/2026-03-18-GCC-PMF-Analysis-v2.md. Part of GCC e2e pipeline MISSION-008."
- Continue pipeline normally (PRD → prototype → copy → Figma → backlog)

## Implementation Steps

### 1. Update `000-master-orchestrator.mdc`

**Location:** Lines 119-126 (GCC E2E Pipeline section)

**Current:**
```markdown
3. HUMAN-IN-THE-LOOP: Parse 120 output for the E2E Handoff table. Present the recommendations to the PM. Call AskQuestion with: Title "Which GCC research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with GCC compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc.). **STOP and wait for user response. Do NOT proceed to step 4 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.**
4. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation"
```

**Proposed:**
```markdown
3. HUMAN-IN-THE-LOOP: Parse 120 output for the E2E Handoff table. Present the recommendations to the PM. Call AskQuestion with: Title "Which GCC research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with GCC compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc.). **STOP and wait for user response. Do NOT proceed to step 4 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.**

4. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation"

5. **Check if recommendation was done before:**
   - Read MISSION_LOG.md to find if any completed mission used this recommendation
   - IF FOUND (e.g., "WhatsApp Integration" was in MISSION-007):
     a. Acknowledge: "You selected [Recommendation], which was completed in [MISSION-ID]. Artifacts: [PRD path], [Jira Epic URL], [Prototype path], [Figma URL]."
     b. Ask clarification via AskQuestion:
        - Title: "How would you like to proceed with [Recommendation]?"
        - Options:
          1. "Extend the work - Add new features/stories to existing backlog"
          2. "Regenerate artifacts - Create v2 PRD/prototype with updated research"
          3. "Proceed as-is - Re-run full pipeline (PRD → prototype → Figma → backlog)"
     c. **STOP and wait for user response. Do NOT proceed until the user has explicitly selected an option.**
     d. Parse user's choice and adjust pipeline accordingly:
        - **"Extend"**: Invoke 200 with "Update existing PRD to add [new scope]. Source: [new research] + [existing PRD]"
        - **"Regenerate"**: Invoke 200 with "Create v2 PRD for [feature]. Source: [new research]. This is a refresh with updated evidence."
        - **"Proceed as-is"**: Invoke 200 normally (fresh PRD from new research)
   - ELSE (new recommendation):
     a. Proceed directly to step 6 (invoke 200-prd-writer)

6. Invoke 200: "Create PRD for the selected GCC opportunity: [recommendation]. Source: research/GCC/thematic-analysis/[latest].md. This is part of GCC e2e pipeline."
```

**Update subsequent steps:** Renumber steps 5-10 to 6-11.

### 2. Update Orchestrator Decision Principle

**Location:** Lines 74-88 (Decision Framework section)

**Add new principle:**
```markdown
### HITL Selection Must Be Honored

**Golden Rule:** When the user makes an explicit HITL selection, ALWAYS honor it. Do not override based on assumptions about what they "should" want.

**If the selected recommendation was done before:**
1. Acknowledge the prior work (show artifacts)
2. Ask clarification: Extend, Regenerate, or Proceed as-is
3. Honor their clarification

**Never:**
- Override the user's selection with a "better" recommendation
- Assume the user wants something new just because old work exists
- Default to a different option without asking

**Why:** HITL selections reflect business context, prioritization, and strategy that the orchestrator doesn't have. PMs may want to iterate, refine, test, or version existing work.
```

### 3. Test the Fix

**Scenario 1: User selects NEW recommendation**
- Present options 1-5
- User selects #1 (Nationalization - NEW)
- Orchestrator proceeds directly to PRD generation ✅

**Scenario 2: User selects DONE recommendation + "Extend"**
- Present options 1-5
- User selects #5 (WhatsApp - DONE in MISSION-007)
- Orchestrator acknowledges prior work
- Orchestrator asks: Extend, Regenerate, or Proceed as-is
- User selects "Extend"
- Orchestrator invokes 200 with "Update WhatsApp PRD to add Phase 2 features" ✅

**Scenario 3: User selects DONE recommendation + "Regenerate"**
- Present options 1-5
- User selects #5 (WhatsApp - DONE in MISSION-007)
- Orchestrator acknowledges prior work
- Orchestrator asks: Extend, Regenerate, or Proceed as-is
- User selects "Regenerate"
- Orchestrator invokes 200 with "Create v2 PRD for WhatsApp with updated research" ✅

**Scenario 4: User selects DONE recommendation + "Proceed as-is"**
- Present options 1-5
- User selects #5 (WhatsApp - DONE in MISSION-007)
- Orchestrator acknowledges prior work
- Orchestrator asks: Extend, Regenerate, or Proceed as-is
- User selects "Proceed as-is"
- Orchestrator invokes 200 normally (fresh PRD as if new) ✅

## Success Criteria

✅ User HITL selections are ALWAYS honored  
✅ Orchestrator provides smart clarification for "done" recommendations  
✅ Three clear options: Extend, Regenerate, Proceed as-is  
✅ No overriding or defaulting without explicit user confirmation  
✅ Pipeline continues correctly based on user's clarification choice

## Rationale

**PM Best Practice: Respect User Autonomy**
- Product decisions involve context the agent doesn't have (roadmap priorities, stakeholder commitments, resourcing)
- HITL exists to inject human judgment; overriding it defeats the purpose

**Valid Use Cases for Re-running "Done" Work:**
1. **Iteration**: Add Phase 2 features (e.g., WhatsApp two-way messaging)
2. **Evidence refresh**: New research strengthens the case; update PRD with fresh quotes/metrics
3. **Versioning**: Create v2 of a feature with expanded scope
4. **Testing**: Validate pipeline improvements by re-running a known entity
5. **Learning**: New PM wants to see how a past feature was built

**Enterprise PM Context:**
- Features evolve over multiple releases (Phase 1 → Phase 2 → Phase 3)
- PRDs get versioned as scope/evidence changes
- Backlogs get refined as discovery continues
- Re-running a pipeline is common and valuable

## Before/After

### Before (Current Behavior)

**User:** Selects #5 (WhatsApp)

**Orchestrator:**
> "You've selected #5: WhatsApp Integration. However, this was already completed in MISSION-007... I'll proceed with #1 (Nationalization & Compliance) as the fresh recommendation for MISSION-008."

**Result:** User's selection ignored ❌

### After (Proposed Behavior)

**User:** Selects #5 (WhatsApp)

**Orchestrator:**
> "You've selected **#5: WhatsApp Integration**, which was completed in MISSION-007:
> - PRD: docs/prds/gcc-whatsapp-integration-prd.md
> - Jira Epic: HRREC-90871 (7 stories)
> - Prototype: design/gcc-whatsapp-campaign.tsx
> - Figma: https://www.figma.com/design/inRBCInF7QUoCyIPUzXKqd
>
> How would you like to proceed?
> 1. **Extend** - Add Phase 2 features (two-way messaging, document requests)
> 2. **Regenerate** - Create v2 PRD/prototype with updated research
> 3. **Proceed as-is** - Re-run full pipeline
>
> Please select 1, 2, or 3."

**User:** Selects "1. Extend"

**Orchestrator:**
> "Proceeding to extend WhatsApp Integration with Phase 2 features. Invoking 200-prd-writer..."

**Result:** User's intent honored ✅

---

## Implementation Owner

**Agent:** 090-agent-improvement-advisor (this agent)  
**Target File:** `.cursor/rules/000-master-orchestrator.mdc`  
**Estimated Effort:** 10 minutes (update ~30 lines, add clarification logic)  
**Risk:** Low (additive change, doesn't break existing new-recommendation flow)

---

## Next Steps

1. User approves this plan
2. Agent implements changes to `000-master-orchestrator.mdc`
3. Agent tests with example scenarios (mental walkthrough or live test)
4. Agent updates MISSION_LOG.md with improvement decision
5. Agent confirms completion

---

**Created:** Tuesday Mar 18, 2026  
**Issue ID:** Orchestrator-HITL-Override  
**Priority:** High (breaks user trust in HITL)
