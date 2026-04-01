## Mission: PM-DRIVEN-PRD-001 - PM-Driven PRD Workflow Enhancement
**Status:** ✅ Complete
**Pipeline Step:** Implementation complete
**Created:** 24 March 2026
**Owner:** 090-agent-improvement-advisor

**Objective:** Enhance PRD writing workflow to require PM framing upfront (problem, success, scope, strategy) with agent-proposed drafts based on research. Agent becomes thinking partner, not auto-writer.

**Problem Solved:** Current GCC E2E pipeline auto-generated PRDs from research artifacts after PM selects a recommendation. PM didn't define the problem or requirements themselves - they just picked an option and the agent wrote everything. This risked loss of PM ownership and shallow PRDs missing strategic intent.

**Solution Implemented:**
- Added **Step 4.5: PM Framing Conversation** to GCC E2E pipeline (between HITL and PRD generation)
- Agent proposes evidence-based drafts for:
  1. Problem Statement (from 120 themes + 105 quotes + 101 gaps)
  2. Success Criteria (2-3 metrics with research-based targets)
  3. Scope Boundaries (what's NOT in v1)
- PM refines or approves drafts and provides:
  4. Strategic Intent (why now, why this)
  5. Anything else (constraints, concerns)
- Agent uses **PM-approved framing as PRIMARY input** (research as supporting evidence)

**Files Modified:**
- ✅ `200-prd-writer.mdc`: Added Step 1.5 PM Framing Conversation (~120 lines)
- ✅ `080-red-team.mdc`: Added Risk Category 5 - Strategic Clarity & PM Ownership (~60 lines)
- ✅ `000-master-orchestrator.mdc`: Updated Step 6 PRD invocation + pipeline count (14→15 steps)
- ✅ `090-agent-improvement-advisor.mdc`: Documented enhancement in Relationship to Specialized Agents

**Red Team Enhancement:**
New validation lens ensures PRD reflects PM thinking, not just research synthesis:
- Flags generic problem statements
- Checks for explicit tradeoffs and scope boundaries
- Validates quantified success metrics
- Requires strategic "why now" rationale beyond research

**Benefits:**
- ✅ PM ownership of strategic thinking (not just menu selection)
- ✅ Agent as thinking partner (proposes, PM refines)
- ✅ Low friction (refine proposals vs. blank page)
- ✅ Evidence-informed (sees research before framing)
- ✅ Red Team validates PM ownership

**Next GCC E2E run** (GCC-E2E-017) will use new flow with PM Framing step + bug fixes.

---
