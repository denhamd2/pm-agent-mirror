# Cursor Skills: Creation, Management & Best Practices

**Last Updated**: 31 March 2026  
**Source**: Cursor PM presentation (Noah) + workspace experience

## Overview

Skills are **reusable workflows** that can be invoked by you or by agents to perform specific tasks. Think of skills as "how-to" guides that Cursor agents can execute autonomously.

**Cursor PM Analogy** (Noah):
> "Rules = where you can park (constraints, boundaries)  
> Skills = how to park (reusable workflows, methods)  
> Sub-agents = valet parking (independent execution)"

## When to Create a Skill

### Decision Tree

```
Is this workflow reusable (needed 2+ times)?
├─ NO → Don't create a skill (just prompt directly)
└─ YES → Is it specific to this project only?
   ├─ NO → Create user-level skill (~/.cursor/skills-cursor/)
   └─ YES → Is it used by 2+ people on team?
      ├─ NO → Create project-level skill (.cursor/skills/)
      └─ YES → Create project skill + publish to Team Marketplace
```

### ✅ Good Candidates for Skills

- **PM frameworks**: RICE prioritisation, JTBD analysis, thematic analysis
- **Repeated workflows**: "Generate PRD from research", "Create PESTEL analysis"
- **Data visualisations**: Graphs, charts, dashboards with specific data queries
- **Template generation**: Slide decks, design briefs, test scripts
- **Integration workflows**: "Sync Jira with research findings", "Update PRD from Slack thread"

### ❌ **Not** Good Candidates for Skills

- **One-off tasks**: "Fix this bug in myfile.ts" (just prompt directly)
- **Context-heavy workflows**: Better as sub-agents with own context window
- **Simple commands**: "Run tests" (use Shell, don't need a skill)
- **Project-specific logic**: Better as rules (loaded automatically by context)

## How to Create a Skill

### Method 1: Interactive Creation (Recommended)

**Command**: `/create-skill`

**Workflow**:
1. Invoke `/create-skill` in chat
2. Cursor asks inline questions:
   - What does this skill do?
   - What inputs does it need?
   - What context is required?
   - Should it be user-level or project-level?
3. Agent generates skill files
4. Review and iterate (see "Testing Workflow" below)

**Pro Tip** (Noah's team):
> "When I'm creating my own skills, I'll come back up into here, and I'll rename this, and it'll just be, like, Jira dupe skill. And I'll, like, name it whatever. I typically work out of the editor view... But I will come to, like, search the agent, and then, like, I'll search by, like, skill, and I'll find that, like, Jira Dupe skill. And when I need to update it, like, I'll just click back into it with this same chat, and I go through and, like..."

**Takeaway**: Use **same chat** to iterate on a skill. Cursor maintains context for refinements.

### Method 2: From Existing Work

If you've already done a workflow manually, convert it to a skill:

**Prompt**:
```
Look at our past chat transcripts (last month).
Identify 5-10 workflows I've done repeatedly.
Suggest skills I should create.
```

**Noah's team uses this**:
> "Look at all of our past chat transcripts, come up with 5 to 10 skills that I could create to provide one-shot workflows from some of the things that we've chatted through."

### Method 3: Migrate from Commands

**Command**: `/migrate-to-skills`

If you have legacy commands (deprecated), migrate them to skills:

**Noah**:
> "Commands started as just a simple MD file... Skills are an open source primitive that all of these companies are now adopting. So, with skills, you can actually have, like, scripts and reference files and things like that stored within it as well."

## Anatomy of a Skill

### File Structure

```
.cursor/skills/
└── skill-name/
    ├── SKILL.md           # Main skill definition (required)
    ├── references/        # Optional: Reference files
    │   ├── template.md
    │   └── queries.sql
    └── scripts/           # Optional: Scripts to run
        └── process.py
```

### SKILL.md Structure

```markdown
# Skill Name

[Brief description in 1-2 sentences]

## When to Use This Skill

Use when you need to:
- [Specific use case 1]
- [Specific use case 2]

Trigger via: `/command` or when [context]

## [Main Content Sections]

[Step-by-step instructions, examples, frameworks]

## Integration with Other Agents

This skill is used by:
- [Agent 1]: [How it uses this skill]
- [Agent 2]: [How it uses this skill]

## Best Practices

### Always ✅
- [Do this]
- [Do that]

### Never ❌
- [Don't do this]
- [Don't do that]
```

### YAML Frontmatter (Optional, in some implementations)

Some skills use YAML frontmatter for metadata:

```yaml
---
name: rice-prioritization
description: "RICE scoring for product initiatives"
triggers: ["/rice", "prioritize", "score features"]
requires: ["strategic context", "customer research"]
---
```

### Critical: The Description Field

**Noah's Insight**:
> "What you name the skill is, like, really important, but then the description that you give it as well. All of this will be, like, indexed... We have some more meaning behind the words that we're using here, where, like, if the agent recognizes that this description matches something that is very close to the task that has been given, it will, like, intelligently invoke that skill, essentially."

**Semantic Awareness**:
- Cursor indexes skill descriptions
- Agent automatically invokes skills when task matches description
- Write descriptions with **user intent** language, not just technical terms

**Example**:

❌ **Bad description**:
```
"Applies RICE framework"
```

✅ **Good description**:
```
"Applies RICE (Reach, Impact, Confidence, Effort) scoring framework with dual-dimension Impact scoring for Workday Recruiting product prioritization. Use when scoring product initiatives, prioritizing backlog items, comparing feature options, or applying strategic alignment with customer pain analysis."
```

**Why good**: Includes keywords users would say ("prioritizing backlog", "comparing features") + context ("Workday Recruiting") + specific method ("dual-dimension Impact").

## Testing & Iteration Workflow

### Step 1: Create Skill

Use `/create-skill` to generate initial version.

### Step 2: Test in Same Chat

**Critical**: Stay in the **same chat** where you created the skill.

**Noah's workflow**:
> "When you're creating skills, like, probably the most important thing is gonna be, like, what is contained in the YAML here... I usually rely a lot on the agent to create these skills."

**Test prompt**:
```
Use the [skill-name] skill to [task].

[Provide test inputs]
```

### Step 3: Iterate

When skill doesn't work as expected:

**Prompt in same chat**:
```
Update the [skill-name] skill to:
- [Change 1]
- [Change 2]
- [Change 3]
```

**Noah**:
> "I'll just come back to this chat and tell it, like, update this skill to be like this. You don't have to, like, just do that within the chat. There's also times where I'll be, like, working on something... I can literally just say, like, update the skill so that it's always going to maintain this time frame in the UI."

### Step 4: Version Control & Checkpoints

Skills are files → version in git.

**Revert if needed**:
> "I can always come back here and, like, revert back to checkpoints. So now I've just removed all those risk changes."

**Best practice**:
- Commit skill after each working version
- Tag commits: `git tag skill-rice-v1.0`
- Easy rollback if changes break the skill

## Storage Locations

### User-Level Skills (~/.cursor/skills-cursor/)

**When to use**:
- Personal workflows (not team-shared)
- Cross-project skills (used in multiple repos)
- Experimental skills (testing before team deployment)

**Location**: `~/.cursor/skills-cursor/skill-name/`

**Examples**:
- `/pestel` (PESTEL analysis)
- `/canvas` (create visualisations)
- `/create-rule` (meta-skill for creating rules)

### Project-Level Skills (.cursor/skills/)

**When to use**:
- Team-shared workflows
- Project-specific logic
- Workday Recruiting PM workflows

**Location**: `/Users/david.denham/product-manager-agent/.cursor/skills/skill-name/`

**Examples**:
- `/rice` (RICE prioritisation for Workday context)
- `/jtbd` (Jobs-to-Be-Done for Recruiting personas)
- `/thematic` (Braun & Clarke analysis for PMF research)
- `/editorial` (UX copy guidelines for Workday UI)

**Pro Tip**: Project skills can reference project files:
```markdown
## References

- Strategic Context: `research/[Country]/strategy-context-*.md`
- Competitive Matrix: `research/competitive/matrices/*.md`
- JTBD Worksheet: `docs/jtbd-recruiting-hr-professional-and-manager.md`
```

## Team Deployment (Team Marketplace)

### Publishing Skills to Team

**Requirement**: Cursor admin (P&T or IT designated person)

**Workflow**:
1. **Package skills in GitHub repo** (e.g., `workday-pm-skills`)
2. **Admin publishes to Team Marketplace**:
   - Go to cursor.com/dashboard → Plugins → Team Marketplace
   - Import GitHub URL
   - Cursor parses skills from repo
3. **Team members install**: Click "Add to Cursor" → Skills available instantly

**Noah**:
> "If I want to, like, pull down on their [recruiting team's] skills and, like, MCPs that they use to do recruiting research, like, I can just literally click Add to Cursor, and it'll, like, take this whole plugin bundle and basically, like, add it into my account."

### Plugin Bundle Structure

```
workday-pm-skills/ (GitHub repo)
├── README.md
├── .cursor/
│   ├── skills/
│   │   ├── rice-prioritization/
│   │   ├── jtbd-analysis/
│   │   └── thematic-analysis/
│   └── rules/
│       └── 010-pm-standards.mdc
└── scripts/
    └── sync-skills.sh  # Optional: GitHub Actions for auto-sync
```

**GitHub Actions Pattern** (Noah's suggestion):
> "If you, like, update this within your repository, like, it should update here. If everyone has, like, their own spaces, then you can, like, start to look into GitHub Actions to, like, parse out those, like, skills from, like, my PM project to, like, Andrew's PM project to Siri's PM project, and, like, that just runs on a cron, like, once a day."

### Can Team Members Edit Installed Skills?

**Noah**:
> "I actually don't... think you can edit it today? Do you mean, like... if I made a plugin and you, like, installed it, can you make changes to it if you wanted to?... Say something about scheduling... it could just be good to have that as a framework, whereas we might have other plugins and other skills where it would be pretty concrete."

**Takeaway**:
- Installed skills are **read-only** (can't edit source)
- Can **override locally** by creating same-named skill in user directory
- Design skills as **frameworks** (team customises) vs. **concrete** (team uses as-is)

## Model Selection for Skills

**Noah's recommendation**:
> "For technical writing, I would recommend a Sonnet. It's a little bit more expensive, but I think that it writes really well. And the caveat I'll say, like, for a composer is it's great, but it's really only designed for coding."

**Model Selection by Skill Type**:

| Skill Type | Recommended Model | Rationale |
|------------|-------------------|-----------|
| **Coding workflows** (component scaffolding, refactors) | Composer 2 | Fast, cost-efficient, code-optimised |
| **Writing workflows** (PRD, research, docs) | Sonnet | Better prose, technical writing quality |
| **Complex analysis** (PESTEL, thematic, competitive) | GPT 5.4 / Opus 4.6 | High reasoning, handles ambiguity |
| **Data visualisation** (charts, dashboards) | Composer 2 | Code generation + fast iteration |

**Don't specify model in skill**: Let user/agent choose model based on context. Skills should be model-agnostic.

## Integration with Rules & Sub-agents

### Skills vs. Rules

**Rules define constraints** (always loaded by context):
- "Use British English"
- "PESTEL must have 6+ bullets per factor"
- "All prototypes use Canvas Kit, never custom components"

**Skills define methods** (invoked explicitly):
- `/pestel` (how to run PESTEL analysis)
- `/rice` (how to score with RICE framework)
- `/jtbd` (how to extract jobs from interviews)

**Use both**:
- **Rule** `.cursor/rules/010-style-guide.mdc` says "Use RICE scoring for roadmap recs"
- **Skill** `.cursor/skills/rice-prioritization/` shows *how* to apply RICE

### Skills vs. Sub-agents

**Skills** = Reusable workflows in **current chat context**  
**Sub-agents** = Independent chats with **own context window**

**When to use which**:

| Scenario | Use Skill | Use Sub-agent |
|----------|-----------|---------------|
| Quick workflow (< 5 mins) | ✅ | ❌ |
| Reusable across tasks | ✅ | ❌ |
| Heavy research (10+ web searches) | ❌ | ✅ |
| Needs isolated context | ❌ | ✅ |
| Parallel execution | ❌ | ✅ |

**Noah's hierarchy**:
> "Sub-agents will be really powerful for, like, encapsulating some of those personas... But then skills and rules are also really important here... I think skills and rules, like, go hand-in-hand in tandem, so, like, you know, you don't have to work bottom-up here. But, like, sub-agents can invoke those skills, they can, like, respect those rules, and so it's, like, really important to have those skills and rules be kind of predefined before you start to crack open this idea of sub-agents."

**Sub-agents can invoke skills**:
- `@product-strategy-agent` invokes `/pestel` skill
- `@pmf-analyst` invokes `/thematic` skill
- `@ux-researcher` invokes `/jtbd` skill

## Examples from This Workspace

### Example 1: RICE Prioritisation (`/rice`)

**Location**: `.cursor/skills/rice-prioritization/SKILL.md`

**What it does**: Scores product initiatives with RICE framework (dual-dimension Impact: Business + Customer)

**Key features**:
- 239 lines (comprehensive framework + examples)
- Integrates with strategic context (099-product-strategist)
- Used by: 100-market-intelligence, 105-user-researcher, 120-pmf-analyst, 200-prd-writer, 400-backlog-refinement
- Output format specified (table with all RICE components)

**Why it's a good skill**:
- ✅ Reusable across all roadmap decisions
- ✅ Clear trigger: `/rice` or "score features"
- ✅ Well-documented with Workday Recruiting examples
- ✅ Integration points specified (which agents use it)

### Example 2: JTBD Analysis (`/jtbd`)

**Location**: `.cursor/skills/jtbd-analysis/SKILL.md`

**What it does**: Applies Jobs-to-Be-Done framework to structure requirements around customer jobs

**Key features**:
- 247 lines (framework + examples + library of Workday jobs)
- JTBD statement format: "When [situation], I want to [motivation], so I can [outcome]"
- Integration with thematic analysis, PRD writing, UX design
- Persona-specific JTBD library (Recruiter, Hiring Manager, Candidate)

**Why it's a good skill**:
- ✅ Reusable across research, PRDs, design
- ✅ Prevents feature-focused thinking ("I want bulk actions" → "When budget changes require updates to 50+ reqs...")
- ✅ Library of pre-defined jobs for Workday Recruiting personas

### Example 3: Thematic Analysis (`/thematic`)

**Location**: `.cursor/skills/thematic-analysis/SKILL.md`

**What it does**: Applies Braun & Clarke 6-phase method to analyse interview transcripts

**Key features**:
- 307 lines (full methodology + examples + quality standards)
- 6-phase workflow (familiarisation → coding → themes → review → define → report)
- Triangulation matrix format (SME vs. Customer views)
- Integration with JTBD (code for jobs, not features)

**Why it's a good skill**:
- ✅ Complex methodology (can't just "wing it")
- ✅ Reusable for all PMF research (GCC, India, Japan, etc.)
- ✅ Enforces quality standards (rigor, validity, actionability)

### Example 4: Value Realization Metrics (`/value-metrics`)

**Location**: `.cursor/skills/value-metrics/SKILL.md`

**What it does**: Suggests 3-tier Value Realization metrics (Business Value, Product Value, Adoption/Usage) from Workday's standardized framework

**Key features**:
- **3-tier metrics hierarchy**: BV metrics (from CSV) + PV metrics (JTBD-derived) + Adoption/Usage metrics (feature-specific)
- **JTBD integration**: Automatically invokes `/jtbd` to derive Product Value metrics from customer jobs
- **Auto-linking**: PV→BV relationships generated using causality logic (Direct/Indirect/Weak confidence)
- **3 capabilities**: suggest (primary, returns complete package), list (by category), show (metric details)
- **Auto-invoked** by 200-prd-writer during Step 2.5 (after Feature Solution draft)
- **Reference files**: 
  - CSV: `docs/metrics/talent-acquisition-value-metrics.csv` (BV metrics, maintained by Jamie Moore)
  - PV patterns: `.cursor/skills/value-metrics/pv-derivation-guide.md`
  - Linkage rules: `.cursor/skills/value-metrics/pv-bv-linkage-map.md`

**Why it's a good skill**:
- ✅ Reusable across PRDs, slide decks, research analysis, backlog refinement
- ✅ Separates data (CSV) from logic (skill) for easy updates
- ✅ Dual-mode: Ad-hoc (`/value-metrics suggest [feature]`) AND auto-invoked (200-prd-writer)
- ✅ Complete metrics package in <30 seconds: 1-3 BV, 3 PV (linked), 1 Adoption, 1 Usage
- ✅ Reduces metric selection time from 15-20 min → 30 seconds (3x more comprehensive than BV-only)

## Best Practices

### Always ✅

- **Write semantic descriptions**: Use language users would say, not just technical jargon
- **Iterate in same chat**: Stay in skill creation chat for refinements (context preserved)
- **Version in git**: Commit after each working version
- **Test before sharing**: Validate skill works end-to-end before Team Marketplace
- **Document triggers**: Clear "When to Use This Skill" section
- **Show integration**: List which agents/rules use this skill
- **Include examples**: Workday Recruiting context makes skills more useful

### Never ❌

- Create skills for one-off tasks (just prompt directly)
- Specify model in skill (should be model-agnostic)
- Skip the description field (it's critical for semantic awareness)
- Forget to test with actual use case
- Publish untested skills to team (validate first)
- Make skills too granular (consolidate related workflows)
- Ignore existing skills (reuse before creating new)

## Common Pitfalls

### Pitfall 1: Skill Too Narrow

❌ **Bad**: Separate skills for "RICE scoring GCC features" and "RICE scoring India features"  
✅ **Good**: One `/rice` skill with regional context handled dynamically

### Pitfall 2: Skill Too Broad

❌ **Bad**: "PM workflow skill" that does research + PRD + design + backlog  
✅ **Good**: Separate skills: `/pestel`, `/rice`, `/jtbd` - each focused on one framework

### Pitfall 3: Poor Description

❌ **Bad**: "RICE scoring skill"  
✅ **Good**: "Applies RICE (Reach, Impact, Confidence, Effort) scoring framework with dual-dimension Impact scoring for Workday Recruiting product prioritization. Use when scoring product initiatives, prioritizing backlog items, or comparing feature options."

### Pitfall 4: Not Iterating

❌ **Bad**: Create skill, never refine, wonder why it doesn't work  
✅ **Good**: Create, test, iterate in same chat, commit working version

### Pitfall 5: Forgetting Team Deployment

❌ **Bad**: Every PM has their own copy of `/rice` skill (divergence over time)  
✅ **Good**: Publish to Team Marketplace → everyone uses canonical version

## Next Steps

### For New Skill Creators

1. **Identify repetitive workflow** (you've done 3+ times)
2. **Use `/create-skill`** (let agent generate structure)
3. **Test in same chat** (iterate until it works)
4. **Commit to git** (version control)
5. **Share with team** (via Marketplace if useful to others)

### For This Workspace

**Current skills** (all project-level):
- `/rice` - RICE prioritisation
- `/jtbd` - Jobs-to-Be-Done analysis
- `/thematic` - Braun & Clarke thematic analysis
- `/editorial` - UX copy guidelines
- `/value-metrics` - Value Realization metrics suggestion (NEW)

**Candidate skills to create** (from E2E pipeline patterns):
- `/pestel` - PESTEL analysis (currently in global skills, could customise for Workday)
- `/swot` - SWOT analysis (same as above)
- `/prd-from-pmf` - Generate PRD from PMF analysis report
- `/design-brief-from-prd` - Generate design brief from PRD
- `/story-map-from-prd` - Generate story map from PRD

**Team Marketplace setup**:
1. Designate Cursor admin
2. Create `workday-pm-skills` GitHub repo
3. Package skills + rules
4. Publish to Marketplace
5. Team installs "Paradox PM Toolkit"

## Related Documentation

- **`090-agent-improvement-advisor.mdc`** → Architectural patterns (skills vs. rules vs. sub-agents)
- **`000-master-orchestrator.mdc`** → How skills are invoked in E2E pipeline
- **`.cursor/rules/010-style-guide.mdc`** → British English, formatting standards
- **`design/docs/figma-design-system-rules.md`** → Auto-generating rules (parallel concept to skills)

## Cursor PM Insights Summary

Key takeaways from Noah's presentation:

1. **Skills = reusable methods** ("how to park")
2. **Description field is critical** (semantic indexing for auto-invocation)
3. **Iterate in same chat** (context preserved for refinements)
4. **Version control checkpoints** (easy rollback if changes break)
5. **Team Marketplace** (one-click deployment for whole team)
6. **Skills + Rules + Sub-agents hierarchy** (build bottom-up for quality)
7. **Model-agnostic** (don't specify model in skill)

---

**Remember**: Skills are "how-to" guides for Cursor agents. Write them like you're teaching a colleague a repeatable workflow. The better your description and examples, the more intelligently agents will invoke them.
