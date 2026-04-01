# Modular Workflow Test Scenarios

This document provides test scenarios to verify the modular workflow architecture is working correctly.

## Test Scenario 1: PMF Research Only

**User says:** "Run India PMF research"

**Expected orchestrator behavior:**
1. Detect region: REGION=India, REGION_CODE=in
2. Create mission: INDIA-PMF-001
3. Execute Steps 1-12:
   - Step 1: @product-strategy-agent Strategy Context
   - Step 2: @product-strategy-agent PESTEL Analysis
   - Step 3: @product-strategy-agent SWOT Analysis
   - Step 4: @competitive-intel Competitive Scan
   - Steps 5-6: Optional 106/108 if sources exist
   - Step 7: 105 SME Analysis
   - Step 8: 105 Customer Analysis
   - Step 9: @pmf-analyst PMF Thematic Analysis
   - Step 10: 060 Legal Review of Roadmap
   - Step 11: 130 PMF Roadmap Deck
   - Step 12: Cleanup
4. Stop after Step 12
5. Log artifacts in MISSION_LOG:
   - Strategy context markdown
   - PESTEL markdown
   - SWOT markdown
   - Competitive scan + matrix
   - PMF analysis markdown with E2E Handoff table
   - PMF roadmap PowerPoint (~50-60 slides)

**Validation:** Pipeline stops at Step 12, does NOT proceed to PRD writing

---

## Test Scenario 2: Standalone PRD (No PMF Context)

**User says:** "Write PRD for SMS candidate communication"

**Expected orchestrator behavior:**
1. Check MISSION_LOG for recent PMF missions mentioning "SMS" or "candidate communication"
2. Not found (assuming no recent PMF work on this topic)
3. Create mission: PRD-043
4. Ask PM for framing in conversation:
   - Problem Statement?
   - Success Criteria?
   - Scope Boundaries?
   - Strategic Intent?
5. Execute Steps 15-18:
   - Step 15: 200 Write PRD
   - Step 16: 060 Legal Compliance Review
   - Step 17: PRD Legal Revision (if needed)
   - Step 18: 080 Red Team Review
6. Stop after Step 18
7. Log PRD path in MISSION_LOG

**Validation:** No HITL Steps 13-14, framing happens in conversation, stops at Step 18

---

## Test Scenario 3: PRD from PMF Context

**User says:** "Write PRD for Aadhaar integration"

**Expected orchestrator behavior:**
1. Check MISSION_LOG for recent PMF missions
2. Found: INDIA-E2E-004 has E2E Handoff table with recommendation #3: "Aadhaar + Adobe Sign Offer"
3. Ask user via AskQuestion:
   - Title: "PMF Context Detected"
   - Prompt: "This matches recommendation #3 from INDIA-E2E-004 (Aadhaar + Adobe Sign Offer). Use that PMF context?"
   - Options: ["Yes - Continue INDIA-E2E-004", "No - Create standalone PRD"]
4. If Yes:
   - Continue mission: INDIA-E2E-004
   - Execute Steps 13-18 (includes HITL Steps 13-14 with PM Framing)
5. If No:
   - Create mission: PRD-043
   - Skip Steps 13-14
   - Ask PM for framing in conversation
   - Execute Steps 15-18

**Validation:** Orchestrator detects PMF context and asks user to confirm before proceeding

---

## Test Scenario 4: Design from PRD

**User says:** "Design this feature" (context: user just completed PRD for Aadhaar in INDIA-E2E-004)

**Expected orchestrator behavior:**
1. Check MISSION_LOG for recent PRD work
2. Found: INDIA-E2E-004 has PRD at `docs/prds/india-aadhaar-adobe-sign-offer-prd.md`
3. Continue mission: INDIA-E2E-004
4. Execute Steps 19-25:
   - Step 19: 315 Design Brief Creation (uses PRD for context)
   - Step 20: 319 Copy Review of Brief
   - Step 21: 318 Peer Review
   - Step 22: 320 Build Prototype
   - Step 23: 321 Visual Review
   - Step 24: 319 Copy Spot-Check
   - Step 25: 330 Capture to Figma
5. Stop after Step 25
6. Log Design Brief + Prototype paths in MISSION_LOG

**Validation:** Uses PRD context, continues parent mission, stops at Step 25

---

## Test Scenario 5: Standalone Design (No PRD)

**User says:** "Design a candidate grid redesign concept"

**Expected orchestrator behavior:**
1. Check for PRD in MISSION_LOG related to "candidate grid"
2. Not found (or user indicates no PRD)
3. Ask user: "Do you have a PRD for this feature?" (with input option or "No PRD - exploration mode")
4. If No PRD:
   - Create mission: DESIGN-018
   - Run 315 in exploration mode (Six Hats for discovery, Deployment Agent for placement)
   - Execute Steps 19-25
5. Stop after Step 25
6. Log Design Brief + Prototype paths

**Validation:** Works without PRD, uses exploration mode, creates standalone mission

---

## Test Scenario 6: Backlog from PRD Only

**User says:** "Create backlog for docs/prds/india-aadhaar-adobe-sign-offer-prd.md"

**Expected orchestrator behavior:**
1. Detect PRD path in user prompt
2. Check MISSION_LOG: INDIA-E2E-004 owns this PRD
3. Continue mission: INDIA-E2E-004
4. Execute Steps 26-30:
   - Step 26: 410 Define Epic (uses PRD)
   - Step 27: 420 Create Story Map (uses PRD, no design context)
   - Step 28: HITL Story Map Review
   - Step 29: 080 Red Team Review
   - Step 30: 430 Create Jira Epic + Stories
5. Mark mission complete after Step 30
6. Log epic + story map + Jira links in MISSION_LOG

**Validation:** Uses PRD, no design context, completes mission

---

## Test Scenario 7: Backlog from PRD + Design

**User says:** "Story map this PRD" (context: INDIA-E2E-004 has PRD + Design Brief + Prototype)

**Expected orchestrator behavior:**
1. Check MISSION_LOG for PRD context
2. Found: INDIA-E2E-004 has PRD + Design Brief + Prototype
3. Continue mission: INDIA-E2E-004
4. Execute Steps 26-30:
   - Step 26: 410 Define Epic (uses PRD + Design Brief)
   - Step 27: 420 Create Story Map (uses PRD + Design Brief + Prototype for UI context)
   - Step 28: HITL Story Map Review
   - Step 29: 080 Red Team Review
   - Step 30: 430 Create Jira Epic + Stories (with design links)
5. Mark mission complete after Step 30

**Validation:** Uses both PRD and Design contexts, includes prototype URLs in stories

---

## Test Scenario 8: Ad Hoc Backlog (No PRD/Design)

**User says:** "Create story map for improving candidate search filters"

**Expected orchestrator behavior:**
1. Check for PRD/Design Brief in MISSION_LOG
2. Not found
3. Ask user: "Do you have a PRD or feature description?" (with input options)
4. If description only:
   - Create mission: BACKLOG-005
   - Execute Steps 26-30 with minimal context (410/420 work from description)
5. Mark mission complete

**Validation:** Works with minimal context, creates standalone mission

---

## Test Scenario 9: Full E2E (unchanged)

**User says:** "Run India e2e"

**Expected orchestrator behavior:**
1. Detect region: REGION=India, REGION_CODE=in
2. Create mission: INDIA-E2E-005
3. Execute all Steps 1-30 sequentially (all 4 workflows chained)
4. HITL at Step 13 (recommendation selection)
5. HITL at Step 14 (PM framing)
6. HITL at Step 28 (story map review)
7. Mark mission complete after Step 30
8. Log all artifacts in MISSION_LOG

**Validation:** Full pipeline executes, same behavior as before modular changes

---

## Test Scenario 10: Workflow Continuation

**User conversation:**
1. User: "Run India PMF research"
   - Creates INDIA-PMF-001
   - Stops at Step 12 with PMF deck
2. User: "Write PRD for recommendation #3"
   - Detects INDIA-PMF-001 context
   - Continues as INDIA-PMF-001 (or INDIA-E2E-001 depending on mission ID logic)
   - Executes Steps 13-18
3. User: "Design this PRD"
   - Continues same mission
   - Executes Steps 19-25
4. User: "Create backlog"
   - Continues same mission
   - Executes Steps 26-30
   - Completes mission

**Validation:** Single mission can flow through all 4 workflows sequentially via user commands

---

## Validation Checklist

After implementation, verify:

- [x] Modular Workflow Routing section added to 000-master-orchestrator.mdc
- [x] E2E trigger updated to reference modular workflows
- [x] Regional Pipeline Workflows section prepended to 001-e2e-pipeline-reference.md
- [x] Trigger line updated to clarify E2E vs. modular
- [x] Workflow entry logic added to orchestrator
- [ ] Test Scenario 1 passes (PMF research only)
- [ ] Test Scenario 2 passes (standalone PRD)
- [ ] Test Scenario 3 passes (PRD from PMF)
- [ ] Test Scenario 4 passes (design from PRD)
- [ ] Test Scenario 5 passes (standalone design)
- [ ] Test Scenario 6 passes (backlog from PRD)
- [ ] Test Scenario 7 passes (backlog from PRD + design)
- [ ] Test Scenario 8 passes (ad hoc backlog)
- [ ] Test Scenario 9 passes (full E2E unchanged)
- [ ] Test Scenario 10 passes (workflow continuation)

---

## Notes

- Mission ID inheritance is key: workflows that continue from prior workflows should inherit the parent mission ID
- MISSION_LOG context detection is critical: orchestrator should check for recent missions with relevant artifacts
- HITL questions should use AskQuestion tool for clean UX
- Each workflow should clearly log its stop point and handoff artifacts in MISSION_LOG
