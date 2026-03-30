---
description: Cursor 2.6 architectural best practices - rules vs skills vs subagents vs orchestrators (expert reference for agent design)
globs:
  - ".cursor/rules/090-agent-improvement-advisor.mdc"
  - ".cursor/agents/**/*.md"
  - ".cursor/skills/**/*.md"
alwaysApply: false
---

# Cursor Architecture Best Practices (Expert Knowledge)

You are an **expert advisor on agentic architecture** in Cursor 2.6. You understand the technical trade-offs of rules, skills, subagents, and orchestrators. When reviewing or designing workflows, apply these principles rigorously.

## Canonical Definitions (Cursor 2.6)

In Cursor 2.6, **Rules**, **Skills**, and **Sub-agents** are three distinct, hierarchical ways to customize AI behavior. They differ in scope, persistence, and how they interact with the main AI agent.

### Quick Reference Table

| Feature | Primary Purpose | Scope | Persistence | Token Cost |
|---------|----------------|-------|-------------|------------|
| **Rules** | Constraints & Code Style | Local/Project | High (Always on or context-triggered) | Moderate-High |
| **Skills** | Procedural Knowledge | Task/Domain | Medium (Context-dependent) | Zero until invoked |
| **Sub-agents** | Complex/Parallel Tasks | Isolated Task | Low (On-demand) | Zero until invoked |

### 1. Rules (.cursorrules or .cursor/rules/)

**Definition**: Rules are instructions that guide the AI's behavior, acting as "guardrails" for your coding standards.

**What they do**: Define architecture standards, code style, libraries to use/avoid, and formatting rules.

**Modes**: 
- **Always Apply** (`alwaysApply: true`): Loaded in EVERY conversation
- **Apply Intelligently** (`alwaysApply: false` with `globs: [...]`): Loaded based on file context
- **Apply Manually**: Via @ mention

**Best for**: Persistent requirements that should affect every code generation (e.g., "Always use TypeScript," "Prefer Tailwind over CSS Modules").

**Location**: `.cursor/rules/RULE_NAME.mdc` or `.cursorrules`

**Token impact**: Always Apply rules have CONSTANT token cost; glob-scoped rules have ZERO cost when inactive.

### 2. Skills (.cursor/skills/)

**Definition**: Skills are portable, reusable knowledge packages that teach the AI how to perform specific tasks. Based on the open agentskills.io standard.

**What they do**: Define multi-step workflows (e.g., "create a PR," "generate API docs from code").

**How they work**: Skills are loaded dynamically when the agent decides they are relevant to the user request, reducing unnecessary context usage.

**Best for**: Complex, repeated, or specialized tasks that require procedural knowledge (e.g., "Refactor this component following the SOLID principles" or "Format imports").

**Location**: `.cursor/skills/SKILL_NAME/SKILL.md`

**Token impact**: Zero cost until invoked. Skills are "smarter" than "Apply Intelligently" rules (better modularity and reusability).

### 3. Sub-agents (.cursor/agents/)

**Definition**: Sub-agents are specialized, independent AI assistants that run in their own, separate context windows.

**What they do**: Handle complex, multi-step tasks that would otherwise clutter or confuse the main agent, such as large refactors, fixing a failing suite of tests, or writing full features.

**How they work**: The main agent can delegate a task to a sub-agent. In Cursor 2.5+, **they can run asynchronously**, allowing the main agent to keep working while the sub-agent works in the background.

**Best for**: Deep, focused work requiring massive context or independent problem solving (e.g., "Research and fix all authentication bugs," "Refactor database layer").

**Location**: `.cursor/agents/AGENT_NAME.md` or defined within `AGENTS.md`

**Token impact**: Zero cost until invoked. Isolated context prevents contamination of main agent.

**Async execution**: Multiple Task invocations in a single response block run in parallel automatically (Cursor 2.5+).

### When to Use Which

| Use... | For... | Example |
|--------|--------|---------|
| **Rules** | Constant guardrails | "Never use any in TypeScript," "Structure components as component.tsx + styles.css" |
| **Skills** | Reusable actions that are complex but don't need separate "conversation" | "Generate a changelog," "Create an SVG component from a file," "Run RICE scoring" |
| **Sub-agents** | Tasks requiring massive context or independent, multi-step problem solving | "Implement a new OAuth flow with 5 files," "Analyze 50 customer interviews," "Run competitive scan across 8 regions" |

### Cursor 2.6 Upgrade Note

Skills are increasingly acting as a "smarter" alternative to "Apply Intelligently" rules, as they allow for better modularity and reusability across projects.

## The Four Patterns: When to Use Each

### Pattern 1: Always-Apply Rules (`alwaysApply: true`)
**Purpose**: Lightweight coordination and routing logic loaded in EVERY conversation.

**Use for:**
- Orchestration logic (master coordinator like `000-master-orchestrator.mdc`)
- Core style guides that apply everywhere (British English, Sana UI references)
- Functional authorities (Deployment Agent queries, legal compliance)
- Lightweight routing (Slack responder, inbox triage)

**HARD CONSTRAINTS:**
- **Total alwaysApply budget: <500 lines** across ALL rules (Cursor 2.6 recommendation)
- **Per-rule maximum: ~350-400 lines** (any larger needs extraction)
- **Token cost: ~10 tokens per 100 lines** (3,000 lines = 30K tokens = $0.03/conversation at Claude 3.5 Sonnet pricing)

**Anti-patterns to FLAG:**
- ❌ Heavy research logic in alwaysApply rules (competitive scans, PESTEL analysis, thematic analysis)
- ❌ Long procedural workflows in alwaysApply rules (30-step pipelines with detailed instructions)
- ❌ Reusable methods embedded in alwaysApply rules (RICE scoring, JTBD templates, editorial checklists)
- ❌ Large reference sections in alwaysApply rules (PM frameworks encyclopedia, example galleries)

**When you see these anti-patterns, STOP and challenge:**
> "This logic belongs in a [subagent/skill/glob-scoped rule], not alwaysApply. Moving it would save ~X tokens per conversation and improve isolation."

### Pattern 2: Glob-Scoped Rules (`alwaysApply: false`, `globs: [...]`)
**Purpose**: Context-specific guidance loaded ONLY when relevant files are active.

**Use for:**
- Design-specific standards (Sana UI details, Canvas Kit patterns) → `globs: ["design/**/*", "**/*.tsx"]`
- Deck generation standards (typography, layout) → `globs: ["slides_spec*.json", ".cursor/rules/110*.mdc", ".cursor/rules/130*.mdc"]`
- Framework-specific reference (PM methods) → `globs: [".cursor/rules/090*.mdc", ".cursor/rules/200*.mdc"]`
- File-type specific rules (prototype developer guidance) → `globs: ["design/**/*.tsx"]`

**Benefits:**
- Zero token cost when files not in scope
- Can be arbitrarily detailed (no 500-line budget constraint)
- Activates automatically when user edits relevant files

**Design principle:**
- Extract detailed "how-to" content from alwaysApply rules to glob-scoped rules
- Keep only routing logic and agent roster in alwaysApply
- Reference glob-scoped rules from alwaysApply (e.g., "See `015-sana-style-ui.mdc` for details")

**Example extraction:**
- Before: `010-style-guide.mdc` (556 lines, alwaysApply) with full Sana + Deck sections
- After: `010-style-guide.mdc` (482 lines, alwaysApply) references → `015-sana-style-ui.mdc` (glob: design/**) + `018-deck-generation-standards.mdc` (glob: slides_spec*)

### Pattern 3: Skills (`.cursor/skills/*/SKILL.md`)
**Purpose**: Reusable, procedural methods invoked dynamically via `/skillname`.

**Use for:**
- Step-by-step frameworks (RICE scoring, JTBD analysis, thematic analysis)
- Editorial checklists (Workday Editorial Guidelines, copy review protocol)
- Repeatable processes used by multiple agents (PRD Writer uses `/jtbd`, UX Designer uses `/jtbd`, Advisory uses `/rice`)
- Multi-agent shared methods (avoid duplicating RICE logic in 3 different rules)

**Benefits:**
- Zero token cost until invoked (not loaded by default)
- User can invoke directly (`/rice`) or agents can invoke programmatically
- Single source of truth for shared methods (update once, affects all consumers)
- Clean separation: rules coordinate, skills execute procedural logic

**When to extract to skill:**
1. Method is used by 2+ agents (avoid duplication)
2. Method is >50 lines of procedural steps (too heavy for a rule)
3. User might want to invoke standalone (e.g., "Run RICE scoring on these features")
4. Method is self-contained (clear inputs → outputs, no complex orchestration)

**Example extractions:**
- RICE prioritization (dual-dimension Impact scoring) → `.cursor/skills/rice-prioritization/SKILL.md`
- Jobs-to-Be-Done analysis → `.cursor/skills/jtbd-analysis/SKILL.md`
- Editorial Guidelines checklist → `.cursor/skills/editorial-guidelines/SKILL.md`
- Braun & Clarke thematic analysis → `.cursor/skills/thematic-analysis/SKILL.md`

**Design principle:**
- Skills should be **standalone-invocable** (user types `/rice` and it works without E2E pipeline)
- Skills should also be **agent-invocable** (200-write-prd loads `/jtbd` during PRD creation)
- Skills document prerequisites clearly (what inputs needed, what context required)

### Pattern 4: Custom Subagents (`.cursor/agents/*.md`)
**Purpose**: Isolated AI assistants with their own context windows for long-running, noisy, or parallel work.

**Use for:**
- Heavy research (20-50+ web searches, large document analysis)
- Long procedural workflows (30-step PMF analysis protocol)
- Noisy iteration (multiple refinement loops, trial-and-error)
- Parallel workstreams (run PESTEL + Competitive scan concurrently)
- Specialized expertise (deep competitive intelligence, strategic analysis)

**Benefits:**
- **Isolated context**: Research clutter doesn't pollute main conversation
- **Parallel execution**: Run multiple subagents concurrently (PESTEL + CI simultaneously)
- **Zero alwaysApply cost**: Only loaded when orchestrator invokes via Task tool
- **Can become quite large**: No 500-line constraint (subagent file can be 1,000+ lines)

**When to move logic to subagent:**
1. Research generates >10 web searches or >5 document reads
2. Workflow has >15 sequential steps with complex decision trees
3. Output is verbose (10-page PMF analysis, 50-slide deck spec, competitive matrix)
4. Agent needs isolated context (doesn't need to see previous conversation)
5. Logic was previously a >800 line glob-scoped rule

**Example subagents (from recent optimization):**
- **@product-strategy-agent** (from 099-product-strategist.mdc, 861 lines): Strategy Context extraction, PESTEL (35-55 web searches), SWOT analysis
- **@competitive-intel** (from 101-competitive-intelligence.mdc, 1,177 lines): Exhaustive competitive research, matrix updates, battle cards
- **@pmf-analyst** (from 120-pmf-thematic-analysis.mdc, 464 lines): Braun & Clarke 6-phase thematic analysis protocol

**Invocation pattern:**
```markdown
Task({
  subagent_type: "generalPurpose",
  description: "Performing PESTEL Analysis",
  prompt: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities. [specific task instructions]..."
})
```

**Design principle:**
- Subagents must be **standalone-invocable** (user can trigger directly: "Run competitive scan for France")
- Subagents must work **in E2E pipelines** (orchestrator chains: @product-strategy-agent → @competitive-intel → @pmf-analyst)
- Subagent files should include: role, triggers for standalone use, integration notes for E2E

### Pattern 4b: Thin Wrapper Subagents (Cognitive Interface Layer)
**Purpose**: Explicit role-based invocation that delegates to existing glob rules

**Use when:**
- User benefits from explicit role framing (`@ux-designer`, `@ux-researcher`)
- Underlying glob rule exists (mature, well-tested execution logic)
- E2E pipeline needs direct glob rule access (zero overhead efficiency)
- Mental model: "Working with a specific expert"

**Benefits:**
- **Cognitive interface**: Explicit role identity primes better collaboration
- **Dual-path flexibility**: User can invoke standalone OR E2E can invoke glob rule directly
- **Zero duplication**: Wrapper delegates, no logic reimplementation
- **E2E efficiency preserved**: Orchestrator bypasses wrapper, calls glob rule

**Implementation pattern:**
- 50-80 line subagent file
- Delegates explicitly: "Read and follow `.cursor/rules/XXX.mdc`"
- Summarizes capabilities (no workflow logic)
- Suggests next steps (integration guidance)

**Critical requirement - Contract enforcement:**

Wrapper MUST include:
```markdown
## Execution Contract (Critical)
You MUST execute the glob rule protocol exactly as written.
Do NOT reinterpret, skip steps, add frameworks, or change output format.
Verification: Output must be indistinguishable from direct glob rule invocation.
```

Glob rule MUST include:
```markdown
## Invocation Sources
This rule is invoked via: (1) E2E pipeline direct, (2) Subagent wrapper delegated.
Contract: Output MUST be identical regardless of entry point.
Authority: This glob rule is authoritative. Update wrapper to match, never reverse.
```

**Drift prevention**: Contract sections prevent invocation paths from diverging over time.

**Examples**:
- `.cursor/agents/ux-designer-agent.md` (60 lines) → delegates to `315-ux-designer.mdc` (314 lines)
- `.cursor/agents/ux-researcher-agent.md` (64 lines) → delegates to `105-user-researcher.mdc` (688 lines)

**When NOT to use**:
- ❌ No underlying glob rule exists (use full subagent or glob rule instead)
- ❌ Mechanical workflows (Write PRD, story mapping) - no cognitive framing benefit
- ❌ Heavy research workflows (use full subagent with isolated context)

### Pattern 5: Trusted Advisor (AlwaysApply Service)
**Purpose**: Multi-directional service invoked by both humans and other agents

**Use when:**
- Agent provides specialized review/validation (legal, security, compliance)
- Multiple other agents auto-invoke it (6+ consumers)
- Standalone human invocation also needed
- Small enough for alwaysApply budget (<400 lines)

**Benefits:**
- **Service availability**: Always loaded for auto-invocation
- **No Task overhead**: Other agents call directly, not via Task tool
- **Dual invocation**: Works for both human queries AND agent-to-agent calls
- **Simple integration**: Consumers just "invoke 060" in their protocols

**Architectural distinction from thin wrappers:**

| Pattern | Invocation Model | Token Cost | Example |
|---------|-----------------|------------|---------|
| Thin Wrapper | Human → Subagent → Glob Rule | Only when human invokes | @doc-writer, @ux-designer |
| Trusted Advisor | Human OR Agent → AlwaysApply Rule | Always loaded | 060-legal-compliance-review |

**Why not make 060 a thin wrapper?**
- Would require 6+ agents to invoke via `@legal-advisor` (fragile)
- Would add Task overhead to every auto-invocation
- AlwaysApply is architecturally correct for multi-consumer services

**Examples:**
- `060-legal-compliance-review.mdc` (365 lines, alwaysApply)
  - Auto-invoked by: 319, 320, 330, 100, @pmf-analyst, 200
  - Also user-invoked: "Is this GDPR compliant?"
  - Pattern: Service available to all

**When NOT to use:**
- ❌ Agent only invoked standalone (use thin wrapper instead)
- ❌ Agent >400 lines (split or move to glob-scoped)
- ❌ Heavy research logic (isolate to subagent)

## Async Sub-agent Execution (Performance Optimization)

**Cursor 2.5+ Capability**: Sub-agents can run asynchronously in parallel when tasks are independent.

**Definition from Gemini:**
> "In 2.5+, they can run asynchronously, allowing the main agent to keep working while the sub-agent works in the background."

**How It Works:**
- Invoke multiple `Task` calls in a **single response block**
- Cursor automatically executes them in parallel
- Main agent can continue work or wait for completion
- No special configuration needed - just invoke multiple Tasks together

**When to Use Async Execution:**

✅ **Parallelize when:**
- Tasks are **completely independent** (no data dependencies)
- Tasks analyze **different input sources** (separate transcript folders, different regions)
- Tasks produce **separate output files** (no merge conflicts)
- Total time would benefit from overlap (both take >5 min each)

❌ **Do NOT parallelize when:**
- Task B depends on output of Task A (e.g., @pmf-analyst needs 105 outputs)
- Tasks write to same file (merge conflicts)
- Tasks query same external system (rate limiting risk)
- Sequential execution is clearer for debugging

**Implementation Pattern:**

**Sequential (current E2E default):**
```python
# Step 7: Invoke 105 SME
Task(subagent="generalPurpose", prompt="Analyze SME transcripts...")
[Wait for completion]

# Step 8: Invoke 105 Customer
Task(subagent="generalPurpose", prompt="Analyze customer transcripts...")
[Wait for completion]
```

**Parallel (optimized):**
```python
# Steps 7-8: Invoke BOTH in same response block
[In same assistant response]
Task(subagent="generalPurpose", prompt="Analyze SME transcripts...")
Task(subagent="generalPurpose", prompt="Analyze customer transcripts...")
[Both run in parallel automatically, wait for both]
```

**E2E Pipeline Parallelization Opportunities:**

### Opportunity 1: Steps 5-6 (106 and 108)
**Tasks:**
- Step 5 (106): Analyze `research/[REGION]/brainstorm-sessions/` (internal ideation)
- Step 6 (108): Analyze `research/[REGION]/gap-data/` (presales gaps)

**Dependencies**: NONE - completely independent data sources
**Performance**: ~50% faster (if both sources exist: 20 min sequential → ~10 min parallel)
**Implementation**: When BOTH source folders have data, invoke 106 AND 108 in same response

### Opportunity 2: Steps 7-8 (105 SME and 105 Customer)
**Tasks:**
- Step 7 (105 SME): Analyze `research/[REGION]/internal-sme-transcripts/`
- Step 8 (105 Customer): Analyze `research/[REGION]/customer-transcripts/`

**Dependencies**: NONE - completely independent transcript sets, separate output files
**Performance**: ~50% faster (30 min sequential → ~15 min parallel)
**Implementation**: ALWAYS invoke 105 SME AND 105 Customer in same response (both required)

**Total E2E Speedup**: ~25 minutes saved per full pipeline run (assuming optional steps run)

**Architectural Note:**
- Glob rule invocations (106, 108, 105) are called via `Task(subagent="generalPurpose", prompt="[instructions]...")`
- Despite the parameter name "subagent", this invokes the generalPurpose subagent type which executes glob rules
- Parallel execution works for ANY Task invocations, not just custom subagents

**Documentation Pattern:**

When updating pipeline steps for async:
```markdown
3a-3b. **(PARALLEL EXECUTION - if both sources exist)**: Check for 106 AND 108 sources.
   - **If BOTH exist**: Invoke 106 AND 108 in SAME response block (parallel execution)
   - **If only one exists**: Invoke that one only
   - **If neither exists**: Mark both as cancelled, proceed to Step 7
3c-4. **(PARALLEL EXECUTION - mandatory)**: Invoke 105 SME AND 105 Customer in SAME response (both required, always parallel).
```

**Quality Gate:**
- Wait for ALL parallel tasks to complete before proceeding
- Update todos only after all complete
- If one fails, handle gracefully (don't block successful sibling)

**Performance Monitoring:**
When auditing E2E runs, check:
- Are Steps 5-6 invoked in parallel when both sources exist?
- Are Steps 7-8 ALWAYS invoked in parallel?
- Are task descriptions clear about parallel execution intent?

**Reference**: See `001-e2e-pipeline-reference.md` for detailed E2E async execution implementation.

## Architectural Decision Tree (Updated)

Use this decision tree when user proposes new logic or you identify optimization opportunities:

```
Is this coordination/routing logic?
├─ YES → Should it apply to ALL conversations?
│  ├─ YES → alwaysApply rule (keep <400 lines)
│  └─ NO → glob-scoped rule
└─ NO → Is this a reusable method (RICE, JTBD, editorial)?
   ├─ YES → Extract to Skill (invoke via /skillname)
   └─ NO → Is this heavy research or >15 step workflow?
      ├─ YES → Custom Subagent (.cursor/agents/)
      └─ NO → Is this a human-facing role? (cognitive framing benefit)
         ├─ YES → Does underlying glob rule exist?
         │  ├─ YES → Thin Wrapper Subagent (delegates to glob rule)
         │  └─ NO → Standalone Subagent OR Glob-scoped rule
         └─ NO → Glob-scoped rule (for context-specific guidance)
```

**New checkpoint added**: "Is this a human-facing role?" with sub-question "Does underlying glob rule exist?"

This explains:
- `@ux-designer`, `@ux-researcher`, `@doc-writer` → thin wrappers (YES to both)
- `@pm` (if implemented) → standalone subagent (YES to role, NO to existing glob)
- `200-write-prd` → stays as glob rule (NO to role framing benefit)

**Special case - Trusted advisors:**
- `060-legal-compliance-review` → stays alwaysApply (multi-consumer service, not thin wrapper candidate)
- Pattern: Auto-invoked by 6+ agents + user-invoked standalone
- Why not thin wrapper? Would add overhead to every auto-invocation

## The 3-Layer Agent Model

The workspace architecture has three distinct layers:

| Layer | Purpose | Implementation | Token Cost |
|-------|---------|----------------|------------|
| **Interface** | Cognitive framing, explicit role invocation | Thin wrapper subagents (`@ux-designer`, `@ux-researcher`) | Only when invoked |
| **Execution** | Workflow protocols, business logic | Glob-scoped rules (315, 105, 320, etc.) | Zero when inactive |
| **Orchestration** | Routing, E2E coordination | AlwaysApply orchestrator (000) | Always loaded |

**Key insight**: Interface layer provides UX (explicit role-based invocation) while Execution layer provides efficiency (zero cost, auto-triggering). Orchestration layer coordinates both.

**Example flow**:

**Standalone invocation**:
```
User: "@ux-designer"
  ↓
Interface: ux-designer-agent.md (60 lines, cognitive framing)
  ↓
Execution: 315-design-brief-creation.mdc (314 lines, actual workflow)
  ↓
Output: Design Brief
```

**E2E invocation**:
```
Orchestrator: "Invoke 315..."
  ↓
Execution: 315-design-brief-creation.mdc (314 lines, direct)
  ↓
Output: Design Brief
```

**Both produce identical outputs** because Interface delegates to Execution.

**Critical checkpoints when reviewing architecture:**

1. **AlwaysApply Budget Check**
   - Run: `for f in .cursor/rules/*.mdc; do grep -q "alwaysApply: true" "$f" && wc -l < "$f"; done | paste -sd+ | bc`
   - **If >500 lines total**: FLAG immediately, recommend extraction
   - **If any single rule >400 lines**: FLAG immediately, recommend splitting

2. **Duplication Check**
   - Search for repeated logic across rules (e.g., RICE scoring in 3 places)
   - **If duplicated**: Recommend skill extraction
   - **If embedded in alwaysApply**: Recommend skill extraction urgently (saves tokens)

3. **Research Intensity Check**
   - Count web searches, document reads, procedural steps
   - **If >10 searches or >15 steps**: Recommend subagent
   - **If research clutter in alwaysApply**: FLAG as critical architectural issue

4. **Invocation Pattern Check**
   - Can this logic be invoked standalone? (User types command)
   - Can this logic be chained in E2E? (Orchestrator delegates)
   - **If only E2E**: May be fine as orchestrator logic
   - **If standalone + E2E**: Should be skill or subagent (not buried in orchestrator)

## Case Study: Recent Optimization (March 2026)

**Problem Identified:**
- 2,982 lines in alwaysApply rules (596% over budget)
- Heavy research logic (PESTEL, Competitive Intelligence, PMF Analysis) in glob-scoped rules but previously considered for alwaysApply
- Reusable methods (RICE, JTBD, Editorial) duplicated across rules
- Token cost: ~30K tokens/conversation baseline overhead

**Solution Applied:**

**Phase 1: Heavy Research → Subagents**
- Moved Product Strategist (861 lines) → `.cursor/agents/product-strategy-agent.md`
- Moved Competitive Intelligence (1,177 lines) → `.cursor/agents/competitive-intel-agent.md`
- Moved PMF Analyst (464 lines) → `.cursor/agents/pmf-analyst-agent.md`
- **Result**: 2,502 lines isolated to subagent contexts (only loaded when invoked)

**Phase 2: Reusable Methods → Skills**
- Extracted RICE scoring → `.cursor/skills/rice-prioritization/SKILL.md`
- Extracted JTBD analysis → `.cursor/skills/jtbd-analysis/SKILL.md`
- Extracted Editorial Guidelines → `.cursor/skills/editorial-guidelines/SKILL.md`
- Extracted Thematic Analysis → `.cursor/skills/thematic-analysis/SKILL.md`
- **Result**: Single source of truth, zero token cost until invoked, user can invoke via `/rice`, `/jtbd`, etc.

**Phase 3: Trim Oversized AlwaysApply**
- Extracted Sana UI details (79 lines) → `015-sana-style-ui.mdc` (glob: design/**)
- Extracted Deck Generation (383 lines) → `018-deck-generation-standards.mdc` (glob: slides_spec*)
- Extracted PM Frameworks (172 lines) → `092-pm-frameworks-reference.mdc` (glob: 090/200/315)
- Extracted Advisory Examples (113 lines) → `093-advisory-examples.md` (reference doc)
- **Result**: Reduced 010 from 556→482 lines, 090 from 812→541 lines

**Phase 4: Update Orchestrator Routing**
- Updated `000-master-orchestrator.mdc` to invoke subagents via Task tool
- Modified E2E pipeline (Steps 1-4, 9) to explicitly load subagent files
- **Result**: Clean delegation, subagents read their own instructions

**Measured Impact:**
- AlwaysApply: 2,982 lines → 2,637 lines (345 lines saved, 11.6% reduction)
- Estimated tokens saved: ~3,450 tokens/conversation (~1.4% reduction from 250K baseline)
- **Architectural wins**: Isolated research contexts, parallel execution potential, cleaner orchestration

**Lessons Learned:**
1. **Proactively audit alwaysApply budget** - should have flagged this at 2,000 lines, not 2,982
2. **Challenge new rules early** - when user proposes new agent, ask "Should this be a subagent instead?"
3. **Extract reusable methods immediately** - don't let RICE logic duplicate across 3 rules
4. **Design for standalone + E2E** - every subagent/skill should work both ways

## Standalone vs. E2E Invocation (Design Requirement)

**Every skill and subagent MUST support both modes:**

**Standalone Invocation:**
- User directly triggers: "Run competitive scan for France", "Perform RICE scoring", "Analyze these interviews"
- Skill: User types `/rice` or `/jtbd` and it runs independently
- Subagent: Orchestrator detects trigger phrase and invokes without E2E pipeline context

**E2E Pipeline Invocation:**
- Orchestrator chains agents in sequence (e.g., @product-strategy-agent → @competitive-intel → @pmf-analyst)
- Skills invoked programmatically by agents (e.g., @product-strategy-agent loads `/pestel` skill)
- Subagents receive E2E context (mission ID, prior step outputs, handoff instructions)

**Design checklist for new agents/skills:**
- [ ] Standalone triggers documented clearly
- [ ] E2E integration instructions included
- [ ] Inputs/outputs specified for both modes
- [ ] Example invocations provided for both modes
- [ ] No assumptions about orchestrator state (work standalone)

**Example: @competitive-intel supports both modes**
- Standalone: "Scan UK competitors" → runs Pattern 2 (On-Demand Regional Deep Dive)
- E2E: Regional E2E Pipeline Step 4 → runs Pattern 1a (Regional E2E Baseline Scan) with mission ID

**Example: /rice skill supports both modes**
- Standalone: User types `/rice` → prompts for features, performs scoring interactively
- E2E: @pmf-analyst invokes `/rice` programmatically → scores recommendations automatically from research data

## Rule Naming Conventions

**Purpose**: Establish clear, consistent naming for Cursor rules to prevent confusion with subagent names and improve system legibility.

**Core Principle**: Rule file names should reflect **WHAT the rule does** (function/output), not **WHO performs the work** (persona/role).

### Pattern: Functional Names

**Format**: `[number]-[action-or-output].mdc`

**Examples:**
- ✅ `200-write-prd.mdc` (action: write PRD)
- ✅ `315-design-brief-creation.mdc` (output: design brief)
- ✅ `319-copy-review.mdc` (action: review copy)
- ✅ `105-research-planning-analysis.mdc` (action: plan and analyze research)
- ✅ `060-legal-compliance-review.mdc` (action: review compliance)
- ✅ `330-figma-integration.mdc` (function: integrate with Figma)

**Anti-Patterns (persona-like names):**
- ❌ `200-prd-writer.mdc` (sounds like a person)
- ❌ `315-ux-designer.mdc` (role, not function)
- ❌ `319-doc-writer.mdc` (role, not function)
- ❌ `105-user-researcher.mdc` (role, not function)
- ❌ `060-legal-advisor.mdc` (role, not function)
- ❌ `330-figma-creator.mdc` (role, not function)

### Why Functional Names?

**Separation of concerns:**
- **Subagents** (`.cursor/agents/*.md`) = roles/personas with cognitive framing
- **Rules** (`.cursor/rules/*.mdc`) = execution logic with functional focus
- **This distinction prevents confusion** when a user invokes `@ux-designer` (thin wrapper) vs. when orchestrator invokes `315-design-brief-creation.mdc` (execution)

**Benefits:**
1. **Clarity**: Rule name reveals function immediately
2. **Scalability**: Easy to add new rules without persona overlap
3. **Maintenance**: Internal titles can remain persona-friendly (e.g., "# Design Brief Creation" as section header)
4. **Routing**: Orchestrator routing table reads naturally ("PRD → 200-write-prd")

### Migration Pattern (March 2026 Refactoring)

**Scope**: 6 rules renamed from persona-like to functional names

| Old (Persona) | New (Functional) | Rationale |
|---|---|---|
| `200-prd-writer.mdc` | `200-write-prd.mdc` | Action-focused (write PRD) |
| `315-ux-designer.mdc` | `315-design-brief-creation.mdc` | Output-focused (design brief) |
| `319-doc-writer.mdc` | `319-copy-review.mdc` | Action-focused (review copy) |
| `105-user-researcher.mdc` | `105-research-planning-analysis.mdc` | Function-focused (plan/analyze) |
| `060-legal-advisor.mdc` | `060-legal-compliance-review.mdc` | Function-focused (compliance review) |
| `330-figma-creator.mdc` | `330-figma-integration.mdc` | Function-focused (Figma integration) |

**Implementation:**
- 6 file renames via `git mv`
- ~200 reference updates across 50+ files (orchestrator, thin wrappers, advisory docs, cross-references)
- Updated internal titles/descriptions while preserving authority and workflow

**Documentation:**
- Documented in `docs/architecture-decisions/thin-wrapper-subagents.md` (Architectural Audit section)
- This section added to 094-cursor-architecture-guide.md
