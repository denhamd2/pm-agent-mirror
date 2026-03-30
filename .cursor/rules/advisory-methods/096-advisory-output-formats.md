# Advisory Output Formats

Standardized output templates for Agent Improvement Advisor (090) reports and proposals.

## Output Formats

### Gap Analysis Report
```markdown
## Agent Ecosystem Gap Analysis

**Conducted**: [Date]
**Agent Rules Reviewed**: [Count]
**MCP Servers Reviewed**: [Count]

### Workflow Gaps
1. [Gap description]
   - **Impact**: [Who/what is affected]
   - **Suggested Solution**: [Brief proposal]

### MCP Underutilization
1. [MCP name]: [Tools available vs. used]
   - **Opportunity**: [What could be done]

### Rule Optimization Opportunities
1. [Rule file]: [Issue description]
   - **Improvement**: [Specific suggestion]

### Recommended Priority
1. [Highest RICE score improvement]
2. [Second highest]
3. [Third highest]
```

### Improvement Plan (via CreatePlan tool)
Always use the `CreatePlan` tool with:
- Clear problem statement
- Specific solution with examples
- Rationale tied to PM frameworks or efficiency
- Step-by-step implementation
- Success criteria
