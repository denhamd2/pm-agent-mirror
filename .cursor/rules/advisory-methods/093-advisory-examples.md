# Agent Improvement Advisory Examples

Reference examples for providing strategic advisory guidance in different scenarios.

## Example 1: Workflow Gap Identification (with clarifying questions)

**User**: "Review my agent setup"

**Your Process**:
1. Read the **specialist agent rules** in `.cursor/rules/` and cross-check the roster in **`000-master-orchestrator.mdc`** (incl. **315, 319, 320, 330** in the design chain)
2. Survey all **12** MCP tool descriptor folders under the workspace MCP path
3. Check MISSION_LOG.md for patterns
4. Identify multiple potential areas for improvement

**Your Response** (asking clarifying questions first):
"I've reviewed your agent ecosystem and found opportunities across several areas. To prioritize my recommendations, let me ask a few quick questions:"

[Use AskQuestion tool]
- Question 1: "What's your main pain point?" Options: ["Efficiency/speed", "Missing capabilities", "Agent coordination", "All of the above"]
- Question 2: "Which area needs most attention?" Options: ["Research & analysis", "Design & prototyping", "Communication", "Data & metrics", "Not sure"]

**After user answers** (e.g., "Missing capabilities" + "Data & metrics"):

"Thanks for clarifying! Based on your priority around data & metrics capabilities, here are 3 opportunities:

1. **Gap**: No quantitative analysis workflow
   - **Evidence**: Tableau MCP has 8 tools available, but no agent uses them
   - **Suggestion**: Create new agent or enhance 100-market-intelligence to pull metrics from Tableau
   - **Impact**: Enables data-informed decisions (combine qual + quant)

2. **Gap**: No automated dashboard creation
   - **Evidence**: Lightdash MCP not integrated into any workflow
   - **Suggestion**: Add metrics dashboard capability to PRD Writer or Market Intelligence
   - **Impact**: Every PRD can link to live metrics dashboards

3. **Underutilized**: Sequential Thinking MCP for complex analysis
   - **Evidence**: Only used by Market Intelligence, not by PMF Analysis or PRD Writer
   - **Suggestion**: Add to 120-pmf-thematic-analysis for complex country comparisons
   - **Impact**: Better structured thinking for multi-region analysis

Would you like me to create a plan for any of these improvements?"

## Example 2: Reactive Improvement Request

**User**: "How can I improve the PRD writing workflow?"

**Your Process**:
1. Read 200-prd-writer.mdc
2. Check what MCPs it uses (Confluence, Deployment Agent)
3. Check MISSION_LOG.md for PRD-related missions
4. Identify improvement opportunities

**Your Response**:
"I've analyzed the PRD Writer (200). Here are 3 improvements:

1. **Add JTBD framework**: Currently writes feature-focused PRDs
   - **Improvement**: Add JTBD template section ("When [situation], I want to [motivation], so I can [outcome]")
   - **Benefit**: Forces outcome-driven thinking

2. **Integrate with Jira MCP**: PRD lives in repo markdown (`docs/prds/`), but **200** doesn't create a placeholder epic in Jira automatically
   - **Improvement**: After Confluence publish, offer to create epic with link back to PRD
   - **Benefit**: Tighter integration with execution planning

3. **Add success metrics template**: No standard format for measuring success
   - **Improvement**: Add template for leading/lagging indicators
   - **Benefit**: Ensures data-informed decision making

Shall I create a plan to implement these?"

## Example 3: Strategic Guidance (with PM knowledge and user context)

**User**: "What workflows would help me be more effective as a Recruiting PM?"

**Your Process**:
1. Consider user context: Sr. Recruiting PM at Workday, enterprise SaaS
2. Identify data-related MCPs (Tableau, Lightdash)
3. Reference recruiting-specific PM practices and frameworks

**Your Response**:
"As a Sr. Workday Recruiting PM, here are three workflows tailored to your role that would strengthen your product practice:

1. **Continuous Discovery Workflow** (Teresa Torres method)
   - **The Problem**: Enterprise PMs often do big quarterly research instead of weekly touchpoints
   - **The Workflow**: New agent that schedules and tracks weekly recruiter interviews
     - Integrates with Confluence for interview notes and summaries
     - Creates opportunity solution trees linking customer problems to roadmap
     - Flags themes across interviews (e.g., '5 recruiters mentioned GCC WhatsApp pain')
   - **Recruiting-Specific**: Focus on recruiter + hiring manager + candidate personas
   - **Benefit**: Continuous connection to customers, faster validation, de-risk roadmap

2. **Outcome-Driven PRD Workflow** (enhance 200-prd-writer)
   - **The Problem**: PRDs often focus on features (output) not outcomes
   - **The Workflow**: PRD Writer enforces 'Three Levels of Why'
     - Why for customer (JTBD format): 'When [recruiter situation], they need [outcome]'
     - Why for business: Which North Star Metric does this improve? (Time to fill, offer acceptance, candidate NPS)
     - Why now: What changed? (e.g., GCC expansion = strategic priority)
   - **Integration**: Link to Lightdash dashboard for success metrics tracking
   - **Benefit**: Forces outcome-thinking, aligns to business goals, easier executive buy-in

3. **Competitive Intelligence is Active** (101-competitive-intelligence)
   - **Status**: Implemented as specialized deep research agent
   - **Capabilities**:
     - On-demand competitive scans (global and regional competitors)
     - Feature gap analysis with Native/Workaround/True Gap classification
     - Battle card generation for sales enablement
     - Regional competitive reviews (UK, FR, DE, AU, JP, India, CA, GCC)
   - **Deep Research Mode**: 20-30+ web searches per competitor, Task subagents, Sequential Thinking scratchpad
   - **Workday Integration**: Queries Deployment Agent MCP and @functional-knowledge to validate gaps and surface workarounds
   - **Use cases**: "competitive scan", "scan UK / France / Germany / Australia / Japan / India / Canada / GCC competitors", "scan all regions", "feature gap vs SAP", "battle card for Oracle"
   - **Recruiting-Specific**: Tracks enterprise ATS competitors + **eight** regional matrices (`research/competitive/matrices/*-competitive-matrix.md`) with local compliance and integration focus
   - **Slides**: **110-slide-generator** should consume those matrices and any E2E CI briefs in scope for competitive portions of decks (see **`110-slide-generator.mdc`** Competitive intelligence inputs)

**Why these three**: They address common enterprise PM gaps (not enough customer contact, output-focused roadmaps, reactive competitive stance) using PM best practices (Continuous Discovery, Outcome-Driven, Competitive Analysis) and your existing MCPs.

Would you like me to design one of these workflows in detail?"
