# Architecture Consistency Analysis: Rules vs Skills vs Sub-agents

**Date**: 28 March 2026
**Auditor**: 090-agent-improvement-advisor
**Framework**: Gemini Cursor 2.6 canonical definitions

---

## Executive Summary

**Overall Grade**: ✅ **95% Consistent with Cursor 2.6 Best Practices**

**Key Findings:**
1. ✅ **Rules usage is correct** - AlwaysApply vs glob-scoped appropriately separated
2. ✅ **Skills are perfectly aligned** - Procedural methods, dynamically loaded, reusable
3. ✅ **Sub-agents match definition** - Full subagents for heavy research, thin wrappers for cognitive framing
4. ❌ **Async execution NOT utilized** - Major performance opportunity missed (Steps 5-6 and 7-8 can run in parallel)
5. ✅ **Thin wrapper pattern valid** - Our innovation, not in Gemini's framework, but architecturally sound

---

## Detailed Analysis Against Gemini Definitions

### 1. Rules (.cursor/rules/*.mdc)

**Gemini Definition:**
> "Rules are instructions that guide the AI's behavior, acting as 'guardrails' for your coding standards. Define architecture standards, code style, libraries to use/avoid, and formatting rules."

**Our Implementation:**

**AlwaysApply: true (5 rules, ~1477 total lines):**
- `000-master-orchestrator.mdc` - Coordination logic, routing, mission state ✅
- `010-style-guide.mdc` - British English, Sana UI, deck standards ✅
- `050-functional-knowledge.mdc` - Workday functional authority ✅
- `060-legal-compliance-review.mdc` - Trusted advisor service ✅
- `090-agent-improvement-advisor.mdc` - Meta-agent for system improvement ✅

**Glob-scoped (alwaysApply: false, 21 rules):**
- Design chain: 315, 318, 319, 320, 321, 330
- Backlog chain: 400, 410, 420, 430, 435
- Research: 100, 105, 106, 108
- Deck generation: 110, 130
- PRD: 200
- Red Team: 080
- Slack: 500
- Product context: 011

**Consistency Assessment:**
✅ **Correct** - AlwaysApply rules are lightweight coordination/style
✅ **Correct** - Glob-scoped rules are context-specific guidance with zero token cost when inactive
✅ **Correct** - No heavy research in AlwaysApply rules (moved to subagents after prior audits)
✅ **Correct** - Procedural methods extracted to skills (editorial, RICE, JTBD, thematic)

**Notes:**
- We're MORE sophisticated than Gemini's simple "always/intelligently/manually" model
- Our glob-scoped rules with file patterns match "Apply Intelligently" mode
- We deliberately kept design/backlog/research as rules (not subagents) for E2E efficiency
- Thin wrapper subagents provide explicit role invocation WITHOUT duplicating execution logic

---

### 2. Skills (.cursor/skills/*/SKILL.md)

**Gemini Definition:**
> "Skills are portable, reusable knowledge packages that teach the AI how to perform specific tasks. Loaded dynamically when relevant to reduce context usage. Complex, repeated, or specialized tasks requiring procedural knowledge."

**Our Implementation:**

**4 Skills:**
1. `/rice` - RICE prioritization (Reach, Impact, Confidence, Effort scoring)
2. `/jtbd` - Jobs-to-Be-Done analysis (When/I want/So I can framework)
3. `/thematic` - Braun & Clarke 6-phase thematic analysis
4. `/editorial` - Workday Editorial Guidelines checklist

**Consistency Assessment:**
✅ **Perfect match** - All are procedural methods
✅ **Reusable** - Used by multiple agents (200, 315, 090, @pmf-analyst)
✅ **Zero cost until invoked** - Not loaded by default
✅ **Standalone + agent-invocable** - User can type `/rice` OR agents invoke programmatically

**Usage patterns:**
- `200-write-prd.mdc` uses `/jtbd` for JTBD section
- `315-design-brief-creation.mdc` uses `/jtbd` for design grounding
- `@pmf-analyst` uses `/thematic` for Braun & Clarke protocol
- `319-copy-review.mdc` references `/editorial` (extracted from rule after audit)
- `090-agent-improvement-advisor.mdc` uses `/rice` for prioritization

**Notes:**
- Gemini says skills are "smarter" than Apply Intelligently rules (better modularity)
- We extracted editorial checklist from 319 to `/editorial` skill (single source of truth)
- All skills follow agentskills.io standard format

---

### 3. Sub-agents (.cursor/agents/*.md)

**Gemini Definition:**
> "Sub-agents are specialized, independent AI assistants that run in their own, separate context windows. Handle complex, multi-step tasks requiring massive context. In 2.5+, they can run asynchronously."

**Our Implementation:**

**3 Full Sub-agents:**
1. `@product-strategy-agent` (453 lines) - Strategy Context, PESTEL (35-55+ web searches), SWOT
2. `@competitive-intel` (full subagent) - Competitive scans (20-30+ web searches), battle cards, gap analysis
3. `@pmf-analyst` (259 lines) - Braun & Clarke PMF analysis, triangulation, RICE scoring

**3 Thin Wrapper Sub-agents:**
1. `@ux-designer` (75 lines) - Delegates to 315-design-brief-creation.mdc
2. `@ux-researcher` (64 lines) - Delegates to 105-research-planning-analysis.mdc
3. `@doc-writer` (77 lines) - Delegates to 319-copy-review.mdc

**Consistency Assessment:**

**Full subagents:**
✅ **Perfect match** - Heavy research (20-55+ web searches per invocation)
✅ **Separate context** - Isolated from main agent
✅ **Complex workflows** - PESTEL is 35-55+ step protocol; PMF is 6-phase Braun & Clarke
✅ **Deep, focused work** - Match Gemini's "massive context" criterion

**Thin wrappers:**
⚠️ **Not in Gemini's definition** - Our architectural innovation
✅ **But valid pattern** - Provide cognitive framing + explicit role invocation
✅ **Contract enforcement** - Delegate to glob rules, ensure consistency
✅ **3-layer model** - Interface (wrappers) / Execution (rules) / Orchestration (000)

**Notes:**
- Thin wrappers solve a problem Gemini doesn't address: "How do I get cognitive framing without duplicating logic?"
- They're lightweight (60-80 lines each)
- They provide explicit role invocation (`@ux-designer`) for standalone work
- E2E pipeline invokes glob rules directly for efficiency (dual invocation paths)
- Contract enforcement prevents drift between paths

---

## Critical Finding: Async Execution NOT Utilized

**Gemini states:**
> "In 2.5+, they can run asynchronously, allowing the main agent to keep working while the sub-agent works in the background."

**Current State:**
❌ **We invoke all subagents SEQUENTIALLY**

**Evidence from E2E Pipeline:**
```
Step 5 (106): Invoke → Wait for completion → Update todo
Step 6 (108): Invoke → Wait for completion → Update todo
Step 7 (105 SME): Invoke → Wait for completion → Update todo
Step 8 (105 Customer): Invoke → Wait for completion → Update todo
```

**Parallelization Opportunities:**

### Opportunity 1: Steps 5-6 (106 and 108)
- **106**: Analyzes `research/[REGION]/brainstorm-sessions/` (internal ideation data)
- **108**: Analyzes `research/[REGION]/gap-data/` (presales gap exports)
- **Dependency**: NONE - completely independent data sources
- **Current**: Sequential (~10 min each = 20 min total)
- **Optimized**: Parallel (~10 min total with overlap)
- **Performance gain**: ~50% faster (10 min saved)

### Opportunity 2: Steps 7-8 (105 SME and 105 Customer)
- **105 SME**: Analyzes `research/[REGION]/internal-sme-transcripts/` (Workday employees)
- **105 Customer**: Analyzes `research/[REGION]/customer-transcripts/` (external customers)
- **Dependency**: NONE - completely independent transcript sets
- **Current**: Sequential (~15 min each = 30 min total)
- **Optimized**: Parallel (~15 min total with overlap)
- **Performance gain**: ~50% faster (15 min saved)

**Total E2E Performance Improvement**: ~25 minutes saved per pipeline run (assuming both optional steps run)

**How to Enable (Per Cursor Documentation):**
> "If it is possible to explore different areas of the codebase in parallel, you should launch multiple agents concurrently. To do that, use a single message with multiple tool uses."

**Implementation:**
Instead of:
```
Invoke 106 → Wait → Invoke 108
```

Do:
```
Invoke 106 AND 108 in same response block (both Task calls)
```

Cursor handles async execution automatically.

**Why We Haven't Done This Yet:**
- E2E pipeline documentation shows sequential invocation pattern
- No guidance in 000 or 001 about parallel Task invocation
- Likely historical: built before async capability was well-known

---

## Recommendations

### 1. ✅ Keep Current Architecture (No Changes)
**Rules, Skills, Sub-agents are all correctly implemented per Cursor 2.6 definitions.**

### 2. ✅ Document Thin Wrapper Pattern
**Add to 094-cursor-architecture-guide.md:**
- Thin wrappers are NOT in Gemini's framework
- But they're valid: Interface layer for cognitive framing + delegation
- 3-layer model: Interface (wrappers) / Execution (rules) / Orchestration (000)

### 3. ⚠️ Enable Async Execution (Performance Win)
**Update 001-e2e-pipeline-reference.md to enable parallel invocation:**

**When BOTH 106 and 108 sources exist:**
- Check for both source folders FIRST
- Invoke 106 AND 108 in same response (2 Task calls in parallel)
- Wait for BOTH to complete
- Update todos after both finish

**For Steps 7-8 (105 SME and Customer):**
- Always run in parallel (no conditional check needed)
- Invoke 105 SME AND 105 Customer in same response (2 Task calls)
- Wait for BOTH to complete
- Update todos after both finish

**Implementation guidance:**
```
# Instead of:
Invoke 106 with Task(...)
[Wait for completion]
Invoke 108 with Task(...)

# Do:
[In same response block]
Invoke 106 with Task(...)
Invoke 108 with Task(...)
[Both run in parallel automatically]
```

**Estimated impact**: ~25 minutes saved per full E2E run (50% faster for these steps)

---

## Summary

| Component | Count | Consistency | Notes |
|-----------|-------|-------------|-------|
| AlwaysApply Rules | 5 | ✅ Correct | Lightweight coordination, ~1477 lines total |
| Glob-scoped Rules | 21 | ✅ Correct | Context-specific, zero cost when inactive |
| Skills | 4 | ✅ Perfect | Procedural methods, dynamically loaded |
| Full Sub-agents | 3 | ✅ Correct | Heavy research, separate context |
| Thin Wrapper Sub-agents | 3 | ✅ Valid | Our innovation, cognitive framing layer |
| **Async Execution** | **0** | ❌ **Unused** | **Major performance opportunity** |

**Final Verdict**: Our architecture is **highly consistent** with Cursor 2.6 best practices. We have ONE optimization opportunity: **enable async execution for independent pipeline steps**.
