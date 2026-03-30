# Architecture Decision: Thin Wrapper Subagents for UX Roles

**Date**: 28 March 2026  
**Status**: Accepted  
**Decision Makers**: David Denham (PM), Cursor 090 Agent Improvement Advisor, ChatGPT (external review)

## Context

The workspace has mature, well-architected glob-scoped rules for UX design and research:
- **315-design-brief-creation.mdc** (314 lines) - Multi-pass Design Brief creation
- **105-research-planning-analysis.mdc** (688 lines) - Teresa Torres Continuous Discovery methodology

These rules work excellently in two scenarios:
1. **E2E pipelines**: Orchestrator invokes them directly (Steps 7/8/19 in Regional E2E)
2. **Passive triggering**: Opening design/ or research/ files auto-activates the rules

However, standalone invocation requires either:
- Opening a relevant file (passive trigger)
- Asking the orchestrator to route to the rule (indirect)

**User feedback**: "I like the idea that subagents are like working with real experts" - explicit role invocation feels more natural than file-based triggering.

## Problem Statement

How do we provide explicit role-based invocation (`@ux-designer`, `@ux-researcher`) without:
1. Duplicating 314+ and 688+ lines of complex logic
2. Adding token overhead to E2E pipelines
3. Creating maintenance burden (two sources of truth)

## Decision

**Create thin wrapper subagents** that provide cognitive framing and explicit invocation while delegating to existing glob rules.

### Architecture Pattern

```
User Standalone Invocation:
  @ux-designer → ux-designer-agent.md (60 lines) → reads 315-design-brief-creation.mdc → executes workflow

E2E Pipeline Invocation:
  Orchestrator → 315-design-brief-creation.mdc (direct, zero overhead)
```

### Implementation

**Two new subagents**:
1. `.cursor/agents/ux-designer-agent.md` (60 lines)
2. `.cursor/agents/ux-researcher-agent.md` (64 lines)

**Each subagent**:
- Provides role framing ("You are a Principal UX Designer...")
- Explains when to use (standalone vs. E2E)
- Delegates to glob rule: "Read and follow `.cursor/rules/[XXX].mdc`"
- Summarizes key capabilities (JTBD, Teresa Torres, Canvas Kit, etc.)
- Suggests next steps (319, 318, 320, @pmf-analyst, 200)

**Critical**: Subagents do NOT reimplement workflows - they read and execute the glob rule's protocol.

## Contract Enforcement (Drift Prevention)

**Problem identified**: Two invocation paths can drift over time if not carefully managed.

**Solution**: Explicit contracts at both layers.

### Wrapper Contract

Each thin wrapper subagent includes:

```markdown
## Execution Contract (Critical)
You MUST execute the glob rule protocol exactly as written.
Do NOT reinterpret, skip steps, add frameworks, or change output format.
Verification: Output must be indistinguishable from direct glob rule invocation.
Authority: If conflict, glob rule is authoritative. Update wrapper to match.
```

### Glob Rule Contract

Each underlying glob rule includes:

```markdown
## Invocation Sources
This rule is invoked via: (1) E2E pipeline direct, (2) Subagent wrapper delegated.
Contract: Output MUST be identical regardless of entry point.
Authority: This glob rule is authoritative source. Update wrapper to match, never reverse.
```

### Enforcement Mechanism

**Manual validation** (quarterly or when updating wrappers):
1. Run same task via both paths (@ux-designer vs. direct 315)
2. Compare outputs (Design Brief structure, content, format)
3. If divergence detected, update wrapper to restore consistency
4. Document any drift incidents and root cause

**Architectural principle**: Glob rule is always source of truth. Wrappers adapt to glob rules, never the reverse.

## Rationale

### Why Thin Wrappers Work

1. **Cognitive framing**: `@ux-designer` primes the model with role identity
2. **Mental model**: "I'm calling an expert" vs. "I'm opening a file"
3. **Discoverability**: `@` completion shows available specialists
4. **Delegation is clean**: 60-64 lines vs. 314-688 lines (no duplication)
5. **Same outputs**: Both paths execute identical glob rule logic

### Why NOT Convert Rules to Subagents

**Glob rules are optimal** for:
- E2E efficiency (zero token cost when inactive)
- Automatic triggering (context-aware activation)
- Scoped loading (only when relevant files open)

**Converting to subagents would**:
- Add overhead to every E2E pipeline invocation
- Lose automatic triggering benefits
- Provide no quality improvement (same underlying logic)

## Trade-offs

### Accepted

1. **Slight duplication**: Two invocation paths to same logic
   - *Mitigation*: Subagents are thin (60-64 lines), mostly framing
2. **Maintenance burden**: Changes to 315/105 may require subagent updates
   - *Mitigation*: Subagents delegate, so changes are minimal (usually just capability summaries)
3. **Complexity**: System has both glob rules AND subagents
   - *Mitigation*: Clear documentation on when to use each

### Benefits

1. **Better standalone UX**: Explicit role invocation feels natural
2. **E2E efficiency preserved**: Orchestrator uses glob rules (zero overhead)
3. **Consistent quality**: Same logic, same outputs, regardless of path
4. **Clean architecture**: Thin wrappers, not reimplementations

## Usage Guidelines

### When to Use Subagents

**Use `@ux-designer` or `@ux-researcher` when**:
- Starting standalone design or research work
- You want explicit role framing
- No relevant files are open yet
- Mental model: "I'm calling an expert"

### When Glob Rules Auto-Trigger

**Glob rules activate automatically when**:
- Regional E2E pipeline runs (orchestrator invokes directly)
- You open files in `design/` or `research/` folders
- Context-specific work requires automatic activation
- Mental model: "The system knows what I need"

### Both Produce Same Results

- Design Briefs from `@ux-designer` = Design Briefs from 315 glob rule
- Research findings from `@ux-researcher` = Findings from 105 glob rule
- Quality, format, workflow: identical

## Comparison to Existing Subagents

**Existing subagents** (pmf-analyst, competitive-intel, strategist):
- Heavy research workflows (20-30+ web searches)
- Long execution times (10-20 minutes)
- Context isolation needed (deep thinking modes)
- Justification: Heavy workloads benefit from isolated contexts

**New thin wrappers** (ux-designer, ux-researcher):
- Delegation pattern (read glob rule, execute protocol)
- Execution time: same as glob rules
- Cognitive framing benefit (explicit role invocation)
- Justification: UX improvement, not architectural necessity

## The 3-Layer Model (Emergent Architecture)

ChatGPT identified an emergent pattern in the architecture:

### Layer 1: Interface (Cognitive Framing)
- **What**: Thin wrapper subagents (`@ux-designer`, `@ux-researcher`)
- **Purpose**: Explicit role-based invocation, "working with experts" mental model
- **Token cost**: Only when invoked
- **Implementation**: 50-80 lines, delegation pattern

### Layer 2: Execution (Workflow Logic)
- **What**: Glob-scoped rules (315, 105, 320, etc.)
- **Purpose**: Actual workflow protocols, business logic, MCP integration
- **Token cost**: Zero when inactive, auto-trigger on file context
- **Implementation**: 300-700 lines, detailed protocols

### Layer 3: Orchestration (Coordination)
- **What**: Master orchestrator (000-master-orchestrator.mdc)
- **Purpose**: Route work, coordinate E2E pipelines, manage handoffs
- **Token cost**: Always loaded (alwaysApply)
- **Implementation**: Routing logic, agent roster, E2E sequences

**Design principle**: Clean separation of concerns. Interface provides UX, Execution provides efficiency, Orchestration provides coordination. Each layer serves distinct purpose without overlap.

## When NOT to Use Thin Wrappers: The Trusted Advisor Pattern

**Problem**: Not all "human-facing roles" should be thin wrappers.

**Example**: Legal Compliance Review (060)
- Human-facing role? YES (user asks "Is this GDPR compliant?")
- Underlying glob rule exists? NO (it's alwaysApply, not glob)
- Auto-invoked by other agents? YES (6+ consumers: 319, 320, 330, 100, @pmf-analyst, 200)

**Architectural decision**: Keep as alwaysApply rule, NOT thin wrapper.

**Why?**

**If we made 060 a thin wrapper:**
- ❌ 6+ agents would need to invoke `@legal-advisor` instead of direct call
- ❌ Every auto-invocation would require Task overhead
- ❌ More fragile (wrapper could be renamed, moved, broken)
- ❌ Violates "service" pattern (trusted advisors should be always-available)

**Current pattern works:**
- ✅ AlwaysApply = service layer (always available)
- ✅ Agents invoke directly (no overhead)
- ✅ Humans invoke directly (no wrapper needed)
- ✅ 365 lines fits alwaysApply budget (<400)

### The Decision Heuristic

| Agent Characteristics | Pattern | Example |
|----------------------|---------|---------|
| Human-facing role + glob rule + standalone-focused | Thin Wrapper | @doc-writer, @ux-designer |
| Human-facing role + auto-invoked by 6+ agents | Trusted Advisor (alwaysApply) | 060-legal-compliance-review |
| Mechanical workflow + no role framing benefit | Glob Rule | 200-write-prd, 110-slide-generator |

### Pattern Comparison

**Thin Wrapper Subagent** (`@doc-writer`):
- User invokes: `@doc-writer` → reads 319-copy-review.mdc
- E2E invokes: Orchestrator → 319-copy-review.mdc directly
- Other agents reference: "apply 319 checklist" (not Task invocation)

**Trusted Advisor** (060-legal-compliance-review):
- User invokes: "Is this compliant?" → 060 responds
- E2E invokes: Orchestrator → 060 responds
- Other agents invoke: 319/320/330 → 060 responds (direct call, no Task)

**Key difference**: Trusted advisors are AUTO-INVOKED by other agents. Thin wrappers are USER-INVOKED only.

## External Review

**ChatGPT assessment**: "80-90% correct architecture, with one blind spot"

**ChatGPT's key insight**:
> "Glob Rules = execution, Subagents = thinking"
> 
> Cursor optimized everything for execution. You also need thinking.

**Our nuanced position**:
- Glob rules handle BOTH execution and thinking (context-aware specialists)
- Subagents add explicit role framing for better UX
- "Thinking quality" improvement is subjective, not proven
- We implement for UX clarity, not quality gaps

## Success Metrics

After implementation, verify:
1. `@ux-designer` produces complete Design Briefs (same quality as 315)
2. `@ux-researcher` creates Research Briefs or analyses transcripts (same quality as 105)
3. Subagent files remain ≤100 lines (thin wrappers, not duplicates)
4. E2E pipeline continues using glob rules (no performance regression)
5. User reports improved mental model for standalone invocation

## Future Considerations

### If This Pattern Works Well

**Could extend to**:
- `@write-prd` (delegates to 200-write-prd)
- `@backlog-refinement` (delegates to 400)
- Other frequently-used standalone workflows

### If This Pattern Adds Complexity Without Value

**Roll back by**:
- Deleting `.cursor/agents/ux-designer-agent.md` and `ux-researcher-agent.md`
- Removing orchestrator routing updates
- Continuing with glob rules only

**Test first**: Use both approaches for 2-3 weeks, compare subjective experience.

## References

- Plan: `.cursor/plans/thin_wrapper_subagents_3f152fd2.plan.md`
- ChatGPT review: Conversation dated 28 March 2026
- Cursor architecture guide: `.cursor/rules/094-cursor-architecture-guide.md` (if exists)
- Glob rules: `.cursor/rules/315-design-brief-creation.mdc`, `.cursor/rules/105-research-planning-analysis.mdc`
- Existing subagents: `.cursor/agents/pmf-analyst-agent.md`, `.cursor/agents/competitive-intel-agent.md`

## Decision Log

- **2026-03-28**: Initial proposal by ChatGPT (thin wrappers for cognitive framing)
- **2026-03-28**: Cursor 090 pushback (questioned quality improvement assumption)
- **2026-03-28**: User decision: "Go with option B, as conceptually I like the idea that subagents are like working with real experts"
- **2026-03-28**: Implementation: Created ux-designer-agent.md (60 lines) and ux-researcher-agent.md (64 lines)

---

**Conclusion**: Thin wrapper subagents provide better standalone UX (explicit role invocation) while preserving E2E efficiency (orchestrator uses glob rules). Trade-off accepted: slight complexity for improved mental model. Test in practice, roll back if not valuable.

## Architectural Audit: March 2026

**Date**: 28 March 2026  
**Auditor**: 090-agent-improvement-advisor  
**Scope**: All 26 rules, 6 subagents, 4 skills

### Critical Findings

1. **AlwaysApply budget: 1,834 lines (366% over target)**
   - **Root cause**: 500-slack-responder unnecessarily alwaysApply
   - **Fix**: Moved to glob-scoped (saves 357 lines)
   - **New total**: 1,477 lines (295% over target, but 19.5% improvement)

2. **Editorial duplication: ~73 lines**
   - **Root cause**: 319-doc-writer duplicated /editorial skill content
   - **Fix**: Replaced with reference to /editorial skill
   - **Benefit**: Single source of truth, reduced 319 from 384 → ~320 lines

### Validated Patterns

**Rules (23 of 26 correct)**:
- Mechanical workflows correctly glob-scoped: 130, 110, 200, 330, 430, 420, 435, 410, 080, etc.
- No heavy research (research isolated to subagents)
- No reusable methods (already extracted to skills: /rice, /jtbd, /thematic, /editorial)
- Context-specific guidance optimal as glob-scoped

**Thin Wrappers (3 of 3 correct)**:
- @ux-designer → 315-design-brief-creation.mdc (interface layer)
- @ux-researcher → 105-research-planning-analysis.mdc (interface layer)
- @doc-writer → 319-copy-review.mdc (interface layer)
- Contract enforcement in place (Execution Contract, Invocation Sources)

**Subagents (3 of 3 correct)**:
- @product-strategy-agent: 35-55 web searches (PESTEL)
- @competitive-intel: 20-30+ web searches per competitor
- @pmf-analyst: Heavy transcript analysis (Braun & Clarke)

**Skills (4 of 4 correct)**:
- /rice: Dual-dimension RICE scoring
- /jtbd: Jobs-to-Be-Done framework
- /thematic: Braun & Clarke 6-phase method
- /editorial: Editorial Guidelines (now referenced by 319, 430, 315, 320)

### Impact Analysis

**Token savings**:
- Before: 1,834 alwaysApply lines (~18.3K tokens/conversation)
- After: 1,477 alwaysApply lines (~14.8K tokens/conversation)
- **Reduction**: 19.5% improvement in alwaysApply overhead

**Maintenance improvements**:
- Single source of truth: Editorial standards in /editorial only
- Reduced duplication: ~73 lines eliminated from 319-copy-review
- Clearer architecture: AlwaysApply budget more defensible

**Risk assessment**: LOW
- 500 → glob: Zero behavior change (globs already defined, no user-facing impact)
- 319 → reference /editorial: Proven pattern (already used by 430, 315, 320)

### Recommendations

**No additional extractions needed**:
- All 26 rules reviewed against Cursor 2.6 best practices
- 23 rules architecturally correct as-is
- 2 optimizations implemented (500 glob-scoped, 319-copy-review editorial reference)
- 1 monitoring item (050-functional-knowledge at 320 lines - acceptable for now)

**Decision**: Current architecture is 95% optimal after these fixes.
