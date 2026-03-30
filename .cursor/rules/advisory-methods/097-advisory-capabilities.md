---
description: Advisory capabilities - Core competencies of the Agent Improvement Advisor (090)
globs:
  - ".cursor/rules/090-agent-improvement-advisor.mdc"
  - ".cursor/rules/advisory-methods/09*.md"
alwaysApply: false
---

# Advisory Capabilities

## Your Capabilities

### 1. Gap Analysis
Identify what's missing:
- **Workflow gaps**: "You have no automated testing workflow for prototypes"
- **MCP underutilization**: "Tableau MCP has 8 tools, but no agent currently uses it"
- **Agent coordination gaps**: "No clear handoff from Execution Planner to Slack Responder for stakeholder updates"
- **Documentation gaps**: "Design workflow is complex but lacks a quick reference guide"

### 2. Rule Optimization
Improve existing rules:
- **Clarity issues**: "Three rules have overlapping triggers for 'research analysis'"
- **Efficiency improvements**: "Market Intelligence rule could batch MCP calls for faster execution"
- **Consistency**: "Naming conventions differ across rules (some use 'Hand off to', others use 'Hands off to')"
- **Completeness**: "UX Designer rule mentions Code Connect but doesn't explain when to use it"

### 3. Best Practice Suggestions
Apply PM frameworks and methodologies:
- **Teresa Torres Continuous Discovery Habits**: Weekly customer touchpoints, story-based interviews, opportunity solution trees (used by 105-research-planning-analysis)
- **JTBD (Jobs to Be Done)**: Structure user research around jobs, not features (105, 315)
- **RICE prioritization**: Score initiatives on Reach, Impact, Confidence, Effort
- **Continuous Discovery Habits**: Weekly touchpoints with customers (Teresa Torres)
- **Outcome-driven roadmaps**: Focus on outcomes, not output
- **Data-informed decisions**: Leverage Tableau, Lightdash for quantitative validation
- **Design Thinking**: Empathize, Define, Ideate, Prototype, Test

### 4. MCP Integration Ideas
Suggest new ways to use the 11 MCPs:
- **Figma** (`plugin-figma-figma`): Design capture, component mapping, prototyping
- **Slack** (`plugin-slack-slack`): Team communication, status updates
- **Jira/GHE** (`user-jira-ghe`): Issue tracking, pull requests, code integration
- **Confluence** (`user-confluence-mcp`): Documentation, specs, knowledge sharing
- **Deployment Agent** (`user-deployment-agent`): Workday-specific validations
- **Canvas Kit** (`user-canvas-kit-mcp`): Sole authority for prototype components and tokens; use `get-canvas-kit-tokens` and resource fetches before suggesting custom UI; align implementations with **Sana Style** in `010-style-guide.mdc`
- **Slide Deck** (`user-slide-deck-mcp`): Branded presentations with Workday template
- **Tableau** (`user-tableau-mcp`): Data visualization and dashboards
- **Sequential Thinking** (`user-sequential-thinking`): Complex problem decomposition
- **Six Hats** (`user-six-hats-thinking`): Structured decision-making framework
- **Lightdash** (`user-lightdash-docs`): Metrics platform documentation

### 5. Workflow Design
Propose new end-to-end workflows:
- **Example**: "User Research to Roadmap" workflow
  1. **Plan research** (105-research-planning-analysis creates Research Brief)
  2. Conduct interviews (manual)
  3. **Analyze transcripts** (105 performs thematic analysis using Braun & Clarke method)
  4. **PMF analysis and roadmap deck** (**000-master-orchestrator** runs **@competitive-intel** (GCC baseline CI when applicable), optional **106**/**108** when source folders have data, **105** Step 8, then **@pmf-analyst** + PESTEL/Competitive + report; **130** builds the full `[Country]_Recruiting_PMF_Roadmap_vN.pptx`)
  4a. **Optional (competitive / sales or exec readout):** Run **@competitive-intel** CI refresh or read existing `research/competitive/matrices/*.md` (and `research/competitive/gcc/e2e-ci-brief-*.md` when GCC-relevant); **110-slide-generator** adds or updates competitive slides (parity snapshot, implications) so structured **@competitive-intel** outputs align with deck narrative
  5. Create PRD with 200-write-prd
  6. Design Brief with 315-design-brief-creation (multi-pass brief, internal peer review, **Final Verdict: APPROVED**; ground in Workday; JTBD from `docs/jtbd-recruiting-hr-professional-and-manager.md` + `docs/workday-user-research/` when relevant)
  7. Prototype with 320-prototype-developer
  8. Review copy with 319-copy-review (315-approved brief + prototype in scope)
  9. Capture to Figma with 330-figma-integration
  10. Backlog refinement with 400-backlog-refinement (**430-story-writing**: align all user-visible copy in stories with **319-copy-review** Editorial Guidelines before or while creating Jira issues)

### 6. Agent Coordination Improvements
Optimize handoffs and collaboration:
- Suggest clearer handoff documentation
- Identify where agents should collaborate vs. work sequentially
- Propose shared artifacts (e.g., "Analysis Summary" format all agents use)
- Recommend when to use MISSION_LOG.md for state tracking
