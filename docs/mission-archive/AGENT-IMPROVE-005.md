## Mission: AGENT-IMPROVE-005 - Workflow Context HITL
**Status:** Complete
**Date:** 30 March 2026
**Owner:** 090-agent-improvement-advisor
**Objective:** Add upfront contextual inquiry questions (HITL) at the start of each standalone workflow invocation to gather PM context before execution, while preserving fast chained execution for E2E mode.

**Context:** When workflows were invoked standalone, agents lacked context about the PM's intent, constraints, or priorities. This led to misaligned outputs, rework, and generic recommendations. The solution adds 2 contextual questions at workflow entry for standalone invocations only.

**Implementation:**

1. **Updated Workflow 1 entry logic in `.cursor/rules/000-master-orchestrator.mdc`:**
   - Added upfront HITL with 2 questions (Research Driver + Additional Context)
   - Detects E2E vs. standalone mode
   - Logs PM context in MISSION_LOG
   - Passes context to Step 1 (@product-strategy-agent)

2. **Updated Workflow 2 entry logic in `.cursor/rules/000-master-orchestrator.mdc`:**
   - Added upfront HITL with 2 questions (PRD Driver + Additional Context)
   - Skips upfront HITL when continuing from Workflow 1
   - Replaces Steps 13-14 framing conversation with structured HITL for standalone
   - Logs PM context in MISSION_LOG

3. **Updated Workflow 3 entry logic in `.cursor/rules/000-master-orchestrator.mdc`:**
   - Added upfront HITL with 2 questions (Design Goal + Additional Context)
   - Skips upfront HITL when continuing from prior workflows
   - Allows PRD path input in Q2 for context
   - Logs PM context in MISSION_LOG

4. **Updated Workflow 4 entry logic in `.cursor/rules/000-master-orchestrator.mdc`:**
   - Added upfront HITL with 2 questions (Delivery Timeline + Additional Context)
   - Skips upfront HITL when continuing from prior workflows
   - Allows PRD/Design path input in Q2
   - Logs PM context in MISSION_LOG

5. **Added E2E HITL behavior documentation to `.cursor/rules/001-e2e-pipeline-reference.md`:**
   - Documented that E2E mode asks Workflow 1 questions once at the beginning
   - Clarified that Workflows 2, 3, 4 skip upfront questions in E2E mode
   - Preserved existing HITL at Steps 13-14 and 28
   - Added standalone mode reference

6. **Updated MISSION_LOG format template:**
   - Added "PM Context" section with Driver and Additional context fields
   - Provides template for all future missions

**Benefits:**
- Better context upfront (agents understand PM intent before executing)
- Reduced rework (catch constraints and priorities early)
- Strategic alignment (work aligns with driver: competitive, customer, compliance)
- Flexible text input ("Anything else" captures edge cases)
- Fast E2E mode (asks once, not 4 times)
- Preserves existing HITL (Steps 13-14 and 28 unchanged)

**Changed Artifacts:**
- `.cursor/rules/000-master-orchestrator.mdc` (Workflow 1-4 entry logic updated)
- `.cursor/rules/001-e2e-pipeline-reference.md` (E2E HITL behavior documented)
- `MISSION_LOG.md` (Mission format template with PM Context section)
