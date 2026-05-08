# Agent Improvement Advisor - Setup Verification

**Date**: 2026-03-17
**Status**: ✅ Complete

## Overview

The Agent Improvement Advisor (090-agent-improvement-advisor.mdc) has been successfully created and integrated into the agent ecosystem. This meta-agent serves as an on-demand brainstorming partner and strategic advisor for improving the entire agentic workspace.

## Files Created

### 1. `/Users/david.denham/product-manager-agent/.cursor/rules/090-agent-improvement-advisor.mdc`
- **Lines**: ~683 lines (significantly expanded)
- **Frontmatter**: 
  - `description`: Agent Improvement Advisor - Brainstorms workflows, optimizes rules, suggests PM best practices, and identifies opportunities to enhance the agent ecosystem
  - `alwaysApply`: true
- **Key Sections**:
  - **Know Your User**: Deep context on David Denham as Sr. Workday Recruiting PM
    - Role & responsibilities, product domain, common PM activities
    - How context shapes advice (recruiting relevance, enterprise context, Workday ecosystem)
  - Discovery Phase (MANDATORY)
  - **Clarifying Questions (When Needed)**: 1-3 questions using AskQuestion tool
  - Gap Analysis capabilities
  - Rule Optimization capabilities
  - Best Practice Suggestions
  - MCP Integration Ideas for all 12 MCPs
  - Workflow Design capabilities
  - Ideation Modes (Reactive, Proactive, Strategic)
  - Implementation Pattern (always uses CreatePlan)
  - **PM Best Practices Reference** (significantly expanded):
    - JTBD (Jobs to Be Done) with recruiting examples
    - RICE Prioritization with calculation examples
    - Continuous Discovery Habits (Teresa Torres)
    - Outcome-Driven Roadmaps (Melissa Perri)
    - Data-Informed Decisions (not data-driven)
    - North Star Metric
    - Product-Market Fit (PMF)
    - Opportunity Solution Trees
    - Now-Next-Later Roadmap
    - The Three Levels of Why
    - Kano Model
    - Story Mapping
    - OKRs
    - Dual-Track Agile
    - The Mom Test
    - Product-Led Growth
    - **Enterprise SaaS PM Best Practices** (Workday-specific):
      - Long sales cycles, complex implementations, quarterly releases
      - Recruiting-specific practices (high-volume, candidate experience, compliance)
      - Common enterprise pitfalls to avoid
  - Extensive trigger phrases
  - Example interactions showing PM knowledge and user context
  - Anti-patterns to avoid

## Files Updated

### 1. `/Users/david.denham/product-manager-agent/.cursor/rules/000-master-orchestrator.mdc`

**Changes made:**

1. **Agent List** (line 28): Added 090-agent-improvement-advisor.mdc as first agent in the list
2. **Decision Framework** (line 75): Added routing rule:
   ```
   "How can I improve" or "review my setup" or "what workflows am I missing" or "brainstorm improvements" or "audit my agent system" → Agent Improvement Advisor (090)
   ```
3. **Example Interactions** (line 149): Added example showing how advisor is invoked

## Verification Checklist

### ✅ Rule File Structure
- [x] Proper YAML frontmatter with description and alwaysApply
- [x] Clear role definition
- [x] Discovery phase documented as MANDATORY
- [x] All capabilities documented (Gap Analysis, Rule Optimization, etc.)
- [x] Trigger phrases listed
- [x] Implementation pattern using CreatePlan
- [x] Example interactions provided
- [x] Anti-patterns documented

### ✅ Orchestrator Integration
- [x] 090-agent-improvement-advisor added to Agent Coordination list
- [x] Routing logic added to Decision Framework
- [x] Example interaction added showing advisor invocation
- [x] Routing triggers include key phrases

### ✅ Discovery Phase Components
- [x] Reads all agent rules in `.cursor/rules/`
- [x] Surveys MCP capabilities in MCP folder
- [x] Checks MISSION_LOG.md for active context
- [x] Reviews design documentation in `design/` folder

### ✅ MCP Coverage
All 12 MCPs documented with their capabilities:
- [x] Figma (plugin-figma-figma)
- [x] Slack (plugin-slack-slack)
- [x] Jira/GHE (user-jira-ghe)
- [x] Confluence (user-confluence-mcp)
- [x] Deployment Agent (user-deployment-agent)
- [x] Canvas Kit (user-canvas-kit-mcp)
- [x] Slide Deck (user-slide-deck-mcp)
- [x] Tableau (user-tableau-mcp)
- [x] Sequential Thinking (user-sequential-thinking)
- [x] Six Hats (user-six-hats-thinking)
- [x] Lightdash (user-lightdash-docs)

### ✅ PM Best Practices Documented
- [x] JTBD (Jobs to Be Done)
- [x] RICE prioritization
- [x] Continuous Discovery Habits (Teresa Torres)
- [x] Outcome-driven roadmaps
- [x] Data-informed decision making
- [x] Design Thinking

## How to Invoke

The Agent Improvement Advisor can be invoked with any of these trigger phrases:

1. **Reactive requests** (explicit asks):
   - "How can I improve [workflow/rule/process]?"
   - "Review my agent setup"
   - "What workflows am I missing?"
   - "Are there better ways to use [MCP]?"
   - "Brainstorm improvements to [area]"
   - "Audit my agent system"
   - "What PM best practices should I follow for [task]?"
   - "How do I make [process] more efficient?"

2. **Via orchestrator**: The master orchestrator (000) will automatically route these requests to 090

## Expected Behavior

When invoked, the advisor will:

1. **Discovery Phase**: Read current state (rules, MCPs, MISSION_LOG.md, design docs)
2. **Clarifying Questions (if needed)**: Ask 1-3 focused questions using AskQuestion tool to narrow scope and understand priorities
3. **Analysis**: Identify 2-3 specific improvement opportunities based on discoveries and user answers
4. **Rationale**: Explain benefits using PM frameworks or efficiency gains
5. **Plan Creation**: Use CreatePlan tool to propose changes
6. **Await Approval**: Wait for user confirmation before implementing
7. **Implementation**: Execute changes exactly as planned after approval

## Example Invocation Test

**User says**: "Review my agent setup"

**Expected flow**:
1. Orchestrator routes to 090-agent-improvement-advisor
2. Advisor reads all `.mdc` rules
3. Advisor surveys MCP tool descriptors
4. Advisor checks MISSION_LOG.md
5. **Advisor asks 1-3 clarifying questions** using AskQuestion tool (e.g., "What's your main pain point?", "Which area needs most attention?")
6. User answers questions
7. Advisor identifies opportunities based on answers (gaps, underutilization, optimizations)
8. Advisor creates plan via CreatePlan tool
9. User reviews and approves
10. Advisor implements changes

## Success Criteria

All criteria from the plan have been met:

- ✅ User can invoke advisor with natural language requests
- ✅ Advisor always checks current state before suggesting
- ✅ Recommendations include clear rationale and examples
- ✅ All changes go through plan approval process
- ✅ Advisor can identify gaps across all 12 MCPs

## Next Steps

The Agent Improvement Advisor is now ready for use. To test it, simply ask:
- "Review my agent setup"
- "What workflows am I missing?"
- "How can I improve the design workflow?"

The advisor will perform its discovery phase and provide strategic recommendations.
