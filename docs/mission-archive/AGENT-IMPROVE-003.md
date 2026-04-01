## Mission: AGENT-IMPROVE-003 - Modular Workflow Architecture
**Status:** Complete
**Date:** 30 March 2026
**Owner:** 090-agent-improvement-advisor
**Objective:** Restructure the 30-step E2E pipeline into 4 modular workflows that can be invoked independently or chained together, while maintaining the full E2E option for comprehensive runs.

**Context:** The current 30-step E2E pipeline was monolithic - it assumed you always want to go from research to Jira stories in one continuous flow. User's actual work patterns are more modular: sometimes run PMF research and stop with a deck, sometimes write a PRD standalone, sometimes design/prototype independently, sometimes create backlog from a PRD without design.

**Implementation:**

1. **Added Modular Workflow Routing section to `.cursor/rules/000-master-orchestrator.mdc`:**
   - Workflow 1: PMF Research & Deck (Steps 1-12)
   - Workflow 2: PRD Writing (Steps 13-18, with from-PMF and standalone entry modes)
   - Workflow 3: Design & Prototype (Steps 19-25, with from-PRD, from-PMF, and standalone entry modes)
   - Workflow 4: Backlog Refinement (Steps 26-30, with from-PRD, from-design, and ad-hoc entry modes)
   - E2E Express Lane: All Steps 1-30 chained (unchanged)

2. **Updated E2E trigger documentation in 000-master-orchestrator.mdc:**
   - Clarified that E2E Express Lane executes "all 4 workflows chained"
   - Added reference to "Modular Workflow Routing above for standalone workflow invocation"

3. **Prepended Regional Pipeline Workflows section to `.cursor/rules/001-e2e-pipeline-reference.md`:**
   - Documented 4 modular workflows with trigger patterns
   - Mission ID patterns table showing inheritance and standalone IDs
   - Entry mode logic for each workflow
   - Handoff artifacts between workflows

4. **Updated trigger line in 001-e2e-pipeline-reference.md:**
   - Changed header to "Trigger (E2E Express Lane - all 4 workflows chained)"
   - Added note: "For standalone workflow invocation, see Modular Workflow Invocation section above"

5. **Added workflow entry logic and context detection to orchestrator:**
   - Workflow 1: Region detection, mission creation, execute Steps 1-12, stop
   - Workflow 2: PMF context detection via MISSION_LOG, AskQuestion for user confirmation, framing logic
   - Workflow 3: PRD context detection, exploration mode for standalone, Six Hats discovery
   - Workflow 4: PRD/Design context detection, ad-hoc mode with minimal context

6. **Created test scenarios document:** `.cursor/rules/002-modular-workflow-test-scenarios.md`
   - 10 test scenarios covering all workflows and entry modes
   - Validation checklist
   - Expected orchestrator behavior for each scenario

**New Trigger Patterns:**

- **Workflow 1:** "Run [region] PMF research", "Create [region] PMF deck", "[region] strategy and research"
- **Workflow 2:** "Write PRD for [feature]", "Create requirements for [feature]", "PRD from [PMF analysis path]"
- **Workflow 3:** "Design [feature]", "Create prototype for [feature]", "Ground in Workday for [feature]"
- **Workflow 4:** "Create backlog for [feature/PRD]", "Story map [feature]", "Break down [PRD] into stories"
- **E2E Express Lane (unchanged):** "Run [region] e2e", "[region] pipeline", "Full [region] workflow"

**Mission ID Patterns:**

| Workflow | Mission ID Format | Example |
|---|---|---|
| PMF Research & Deck | [REGION-CODE]-PMF-0NN | INDIA-PMF-001 |
| PRD (from PMF) | Inherit parent E2E ID | INDIA-E2E-001 (continues) |
| PRD (standalone) | PRD-0NN | PRD-042 |
| Design (from PRD) | Inherit parent ID | INDIA-E2E-001 or PRD-042 |
| Design (standalone) | DESIGN-0NN | DESIGN-018 |
| Backlog (from prior) | Inherit parent ID | INDIA-E2E-001 or PRD-042 |
| Backlog (ad hoc) | BACKLOG-0NN | BACKLOG-005 |
| E2E Express Lane | [REGION-CODE]-E2E-0NN | INDIA-E2E-005 |

**Benefits:**
1. Matches actual PM workflow patterns (modular invocation for focused work)
2. Reduces unnecessary steps (don't run 30 steps when you only need 12)
3. Maintains context (workflows can still reference prior work via MISSION_LOG)
4. Preserves E2E option (express lane still available for comprehensive runs)
5. Clear handoff points (each workflow outputs artifacts for next workflow)
6. Flexible mission IDs (parent IDs continue vs. standalone IDs for new work)

**Backward Compatibility:** All existing E2E triggers continue to work unchanged. No breaking changes to current missions or artifacts.

**Artifacts:**
- Updated: `.cursor/rules/000-master-orchestrator.mdc` (Modular Workflow Routing + entry logic)
- Updated: `.cursor/rules/001-e2e-pipeline-reference.md` (Regional Pipeline Workflows section)
- Created: `.cursor/rules/002-modular-workflow-test-scenarios.md` (10 test scenarios + validation)

**Next:** Use modular workflows in practice. Test scenarios include: "Run India PMF research" (stop at deck), "Write PRD for Aadhaar integration" (detect PMF context), "Design this feature" (ask for PRD), "Story map this PRD" (detect PRD + design).
