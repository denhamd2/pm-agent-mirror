# Jobs-to-Be-Done (JTBD) Analysis Skill

Applies the Jobs-to-Be-Done framework (Christensen, Ulwick) to structure product requirements around customer jobs, not features. Use when defining problems, writing PRDs, analyzing user research, or designing UX.

## When to Use This Skill

Use when you need to:
- Frame product problems in customer outcomes, not solutions
- Write user research findings in JTBD format
- Structure PRD problem statements around jobs
- Create design briefs grounded in user jobs
- Analyze interviews for underlying jobs (not feature requests)

Trigger via: `/jtbd` command or when agent rules reference JTBD framework

## Core JTBD Concept

**People "hire" products to get a job done.**

- Focus on the **job** (desired outcome), not the **customer** (demographic)
- Focus on the **situation** (context), not the **feature** (solution)
- Understand **why** customers want something, not just **what** they say they want

## JTBD Statement Format

### Basic Format

**"When [situation], I want to [motivation], so I can [outcome]."**

**Components**:
- **When [situation]**: The circumstance or context that triggers the job
- **I want to [motivation]**: The action or capability needed
- **so I can [outcome]**: The desired end state or benefit

### Workday Recruiting JTBD Examples

**Recruiter JTBD:**

**Bad (feature-focused)**: "I want bulk actions so I can update requisitions faster"
**Good (job-focused)**: "When budget changes require updates to 50+ requisitions, I want to make changes in bulk so I can avoid 2 hours of manual work and meet the deadline"

**Bad**: "I want WhatsApp integration"
**Good**: "When candidates in GCC don't respond to email, I want to message them on WhatsApp so I can reach them where they actually communicate and fill roles faster"

**Hiring Manager JTBD:**

**Bad**: "I want better interview scheduling"
**Good**: "When coordinating interviews with 5 panel members across time zones, I want automated scheduling with real-time availability so I can book interviews in minutes instead of days of email back-and-forth"

**Candidate JTBD:**

**Bad**: "I want application status updates"
**Good**: "When I've applied for a role and haven't heard back in 2 weeks, I want to check my application status so I can reduce anxiety and decide whether to pursue other opportunities"

## JTBD vs. User Stories

**User Story (Agile)**: "As a [role], I want [feature] so that [benefit]"
- Role-focused, solution-implied

**JTBD**: "When [situation], I want to [capability], so I can [outcome]"
- Situation-focused, solution-neutral

**When to use which**:
- **JTBD**: Discovery, problem definition, research synthesis, PRD problem statements
- **User Stories**: Execution, backlog, Jira tickets (after solution is defined)

## JTBD Analysis Process

### Step 1: Identify the Job (from customer interviews or research)

**Listen for**:
- Workarounds customers use (signals unmet job)
- Frustrations and pain points (jobs not being done well)
- Time spent on tasks (jobs with high effort)
- Desired outcomes (what success looks like)

**Interview Technique** (The Mom Test):
- **Don't ask**: "Would you use a bulk action feature?" (leads to polite "yes")
- **Do ask**: "Tell me about the last time you had to update many requisitions at once. What did you do? How long did it take? What was frustrating?"

### Step 2: Structure as JTBD Statement

**Template**: "When [situation], I want to [motivation], so I can [outcome]"

**Validate**:
- **Situation** is specific and observable
- **Motivation** is a capability, not a feature
- **Outcome** is measurable value or result

### Step 3: Identify Job Dimensions

**Functional Job**: The practical task to accomplish
**Emotional Job**: How the customer wants to feel
**Social Job**: How the customer wants to be perceived

**Example for Recruiter**:
- **Functional**: Fill 10 roles this month
- **Emotional**: Feel in control, reduce stress
- **Social**: Be seen as efficient and professional by hiring managers

### Step 4: Map Solutions to Jobs (not the reverse)

Once job is clear, brainstorm **multiple solutions** that could do the job:
- Bulk actions (feature)
- Workflow automation (process)
- Templates (content)
- AI suggestions (intelligence)

**Don't assume the customer's suggested feature is the only solution.**

## JTBD for Different Contexts

### User Research (105-user-researcher)

When analyzing interview transcripts, extract JTBD statements:

**From transcript**:
> "When we had a budget freeze last quarter, I had to go through 73 reqs one by one and change the hiring manager approver. Took me all afternoon. If I could select all and change the approver in one go, I'd save hours."

**Extract JTBD**:
"When organizational changes require updates to many requisitions, I want to modify fields across multiple reqs at once so I can complete urgent changes in minutes instead of hours"

**Job Type**: Functional (efficiency) + Emotional (stress reduction)

### PRD Writing (200-prd-writer)

Structure problem statement as JTBD:

**PRD Section: Problem Statement**

**Current Approach (bad)**:
"Customers have requested bulk actions for requisitions."

**JTBD Approach (good)**:
"**Job to Be Done**: When recruiters face organizational changes (budget freezes, hiring manager transfers, location closures), they need to update 20-100+ requisitions quickly to maintain workflow integrity and meet deadlines.

**Current Experience**: Recruiters must open each requisition individually, make the change, save, and repeat. For 50 requisitions, this takes 1.5-2 hours of manual work.

**Desired Outcome**: Complete bulk updates in <5 minutes, reducing manual effort by 95% and eliminating error risk."

### UX Design (315-design-brief-creation)

Frame design briefs around jobs:

**Design Brief Section: Job Context**

"**Primary Job**: When reviewing 200+ applications for a high-volume role, recruiters need to quickly identify qualified candidates so they can shortlist 10-15 for interviews within 1 hour (vs. current 3-4 hours).

**Workflow**: Recruiter opens candidate grid → scans profiles → marks 'Qualified' or 'Not Qualified' → exports qualified list → schedules interviews.

**Pain Points** (jobs not done well):
1. Too many clicks to see candidate details (slows scanning)
2. No bulk qualification actions (manual one-by-one marking)
3. Grid doesn't remember sort/filter preferences (re-setup every session)"

## Integration with Other Frameworks

### JTBD + RICE Prioritization

**JTBD** defines the problem; **RICE** prioritizes the solution.

1. Extract JTBD from research
2. Brainstorm multiple solutions for the job
3. Score each solution with RICE
4. Prioritize highest RICE score

### JTBD + Thematic Analysis

When performing thematic analysis (120-pmf-thematic-analysis):
1. Code customer quotes by job (not feature requests)
2. Cluster jobs into themes
3. Write theme descriptions as JTBD statements
4. Map product recommendations to jobs

### JTBD + OKRs

**OKRs** set business outcomes; **JTBD** identifies customer jobs that drive those outcomes.

**Example**:
- **OKR**: Reduce time-to-fill by 20%
- **Customer JTBD**: "When I have 50 open roles and limited time, I want to identify top candidates instantly so I can focus energy on high-value interviews"
- **Solution**: AI candidate screening (addresses JTBD, drives OKR)

## JTBD Library (Workday Recruiting Personas)

### Recruiter Jobs

**Sourcing & Candidate Discovery:**
- "When I post a new role, I want qualified candidates to discover it immediately so I can build a pipeline within 48 hours"
- "When I'm sourcing passive candidates, I want to find people with specific skills who match my req criteria so I can avoid spending hours on LinkedIn"

**Candidate Review & Qualification:**
- "When I receive 200+ applications for one role, I want to quickly surface the most qualified so I can shortlist in under 1 hour"
- "When reviewing candidates, I want to see all relevant information in one place so I can make decisions without clicking through multiple screens"

**Communication & Engagement:**
- "When a qualified candidate goes silent, I want to reach them on their preferred channel so I can keep them engaged and avoid losing them to competitors"
- "When I need to update 30 candidates on interview times, I want to send bulk messages so I can communicate efficiently without copy-pasting"

**Workflow & Coordination:**
- "When hiring managers don't respond to my interview requests, I want to automate reminders so I can keep requisitions moving without manual follow-up"
- "When budget freezes require changes to 50+ reqs, I want to bulk update fields so I can respond to business changes within hours, not days"

### Hiring Manager Jobs

**Requisition Management:**
- "When I need to hire for my team, I want to create a requisition without learning complex HR systems so I can focus on defining the role, not navigating software"

**Candidate Review:**
- "When my recruiter sends me candidates to review, I want to quickly assess fit against my criteria so I can provide feedback within 24 hours"

**Interview Coordination:**
- "When scheduling interviews with my team, I want to see everyone's availability in one place so I can book interviews without 10+ emails"

### Candidate Jobs

**Application:**
- "When I find a job I'm interested in, I want to apply quickly from my mobile so I can submit before the opportunity closes"
- "When filling out an application, I want to avoid re-entering information from my resume so I can apply in <5 minutes"

**Status & Updates:**
- "When I've applied and haven't heard back, I want to check my status without calling HR so I can plan my job search accordingly"

**Interview Scheduling:**
- "When invited to interview, I want to pick a time that works for me so I can avoid phone tag with the recruiter"

## Quality Standards

### Always ✅
- Frame problems as jobs (situation → motivation → outcome)
- Focus on desired outcome, not requested feature
- Include specific, observable situation triggers
- Cite evidence from customer research (quotes, observations)
- Consider functional + emotional + social dimensions
- Map multiple solutions to each job

### Never ❌
- Write JTBD as "As a user, I want [feature]" (that's a user story, not JTBD)
- Assume customer's suggested feature is the only solution
- Skip the "When [situation]" context (situation defines job scope)
- Use vague outcomes like "be more productive" (measure value specifically)
- Confuse jobs with tasks (jobs are higher-level outcomes)

---

**Remember**: JTBD shifts thinking from "what should we build" to "what job is the customer trying to do." This leads to better solutions because you understand the underlying need, not just the surface request. A recruiter asking for "WhatsApp integration" might really have the job "reach candidates on their preferred communication channel" — which could also be solved with SMS optimization, LinkedIn messaging, or multi-channel orchestration.
