# Cursor Skills: Creation, Management & Best Practices

**Last Updated**: 7 May 2026  
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

- **PM frameworks**: JTBD analysis, Value Realization metrics (`/value-metrics`), PRD writing; **RICE** framing lives in **092** (glob rule), not a standalone `/rice` skill; **Braun & Clarke PMF** runs via **`@pmf-analyst`** (subagent file), not a `/thematic` skill
- **Repeated workflows**: "Generate PRD from research", "Create PESTEL analysis"
- **Data visualisations**: Graphs, charts, dashboards with specific data queries
- **Template generation**: Slide decks, design briefs, test scripts
- **Integration workflows**: "Sync Jira with research findings", "Update PRD from Slack thread"; **net-new story gap review** → [`user-story-gap-review`](user-story-gap-review/SKILL.md) (Jira + **Salomon bundle** (internal knowledge + Salomon Jira `jira_search_tool` + Salomon Slack `slack_archive_search`) + DA + **Dev lens** read paths: **XO MCP** read-only + optional **Peanut** → Confluence **seven-column** table; **exec summary:** Top 5 gaps + Top 5 strengths per `reference.md`; **Tier A/B** run modes; **Publish pipeline** for large bodies; Salomon/DA synthesized **into** PM/QA cells; last column **Suggested missing BDD** to close gaps). **013 WhatsApp companion:** default **manifest-only** from [`docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](../../../docs/initiatives/two-way-email/reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md); opt-in **`WhatsApp live delta`** / **`WhatsApp refresh corpus`** per [`reference-companion-whatsapp.md`](user-story-gap-review/reference-companion-whatsapp.md); optional drift script [`diff_whatsapp_companion_manifest.py`](../../../docs/initiatives/two-way-email/drafts/diff_whatsapp_companion_manifest.py).

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
name: jtbd-analysis
description: "Jobs-to-Be-Done for Workday Recruiting personas"
triggers: ["/jtbd", "jobs to be done", "customer job"]
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

**Examples** (see **Canonical inventory** below for the full list):
- `/jtbd`, `/write-prd`, `/value-metrics`, `/editorial`, `/xo-builder`, `/workspace-audit`, `/morning-roundup`, `/cleanup`, Jira story description (see `jira-recruiting-story-description` skill), …

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
│   │   ├── jtbd-analysis/
│   │   ├── value-metrics/
│   │   └── write-prd/
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
- `/jtbd` (how to extract jobs from interviews)
- `/value-metrics` (how to pick BV/PV/adoption metrics)
- `/write-prd` (how to draft a PRD from research)

**Use both**:
- **Rule** `.cursor/rules/010-style-guide.mdc` sets tone and artefact standards
- **Skill** `.cursor/skills/jtbd-analysis/SKILL.md` shows *how* to run JTBD; **092** holds RICE narrative when you need Reach/Impact/Confidence/Effort without a dedicated skill folder

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
- `@product-strategy-agent` may load project skills when the task matches their descriptions (e.g. research-heavy steps)
- `@pmf-analyst` follows **`.cursor/agents/pmf-analyst-agent.md`** (Braun & Clarke); there is no `/thematic` skill in this repo
- Thin wrappers (e.g. `@ux-researcher`) delegate to glob rules such as **105**, which can point agents at **`/jtbd`**

## Examples from This Workspace

### Example 1: RICE, metrics, and PMF thematic (split across rule, skill, subagent)

- **RICE (Reach, Impact, Confidence, Effort)**: Use **`.cursor/rules/advisory-methods/092-pm-frameworks-reference.md`** (loaded with **090** / **200** / **315** globs). There is **no** `.cursor/skills/rice-prioritization/` folder.
- **Outcome metrics**: **`.cursor/skills/value-metrics/SKILL.md`** → `/value-metrics suggest …` (often pairs with `/jtbd`).
- **Braun & Clarke PMF**: **`.cursor/agents/pmf-analyst-agent.md`** invoked as **`@pmf-analyst`** via Task; **not** a `/thematic` skill.

### Example 2: JTBD Analysis (`/jtbd`)

**Location**: `.cursor/skills/jtbd-analysis/SKILL.md`

**What it does**: Applies Jobs-to-Be-Done framework to structure requirements around customer jobs.

**Key features**:
- JTBD statement format: "When [situation], I want to [motivation], so I can [outcome]"
- Integration with PRD writing, UX design, and `/value-metrics` for Product Value metrics
- Persona-specific JTBD library (Recruiter, Hiring Manager, Candidate)

**Why it's a good skill**:
- ✅ Reusable across research, PRDs, design
- ✅ Prevents feature-focused thinking
- ✅ Library of pre-defined jobs for Workday Recruiting personas

### Example 3: Value Realization Metrics (`/value-metrics`)

**Location**: `.cursor/skills/value-metrics/SKILL.md`

**What it does**: Suggests 3-tier Value Realization metrics (Business Value, Product Value, Adoption/Usage) from Workday's standardized framework

**Key features**:
- **3-tier metrics hierarchy**: BV metrics (from CSV) + PV metrics (JTBD-derived) + Adoption/Usage metrics (feature-specific)
- **JTBD integration**: Uses `/jtbd` to derive Product Value metrics from customer jobs where needed
- **Reference files**: `docs/metrics/talent-acquisition-value-metrics.csv`, `.cursor/skills/value-metrics/pv-derivation-guide.md`, `pv-bv-linkage-map.md`

**Why it's a good skill**:
- ✅ Reusable across PRDs, slide decks, research analysis, backlog refinement
- ✅ Separates data (CSV) from logic (skill) for easy updates

### Example 4: XO Builder (`xo-builder` umbrella)

**Location**: `.cursor/skills/xo-builder/SKILL.md`

**What it does**: Standalone XO / ModulR / REST workflows on your SUV with explicit triggers and isolation from E2E pipelines.

**Why it's a good skill**:
- ✅ Heavy procedural content stays out of alwaysApply rules
- ✅ Thin **`@xo-developer`** agent delegates here for implementation + advisory

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

❌ **Bad**: Separate skills for "JTBD for GCC" and "JTBD for India" that duplicate the same SKILL.md  
✅ **Good**: One `/jtbd` skill with regional context handled in prompts and inputs

### Pitfall 2: Skill Too Broad

❌ **Bad**: "PM workflow skill" that does research + PRD + design + backlog  
✅ **Good**: Separate skills: `/jtbd`, `/write-prd`, `/value-metrics` - each focused on one method

### Pitfall 3: Poor Description

❌ **Bad**: "JTBD skill"  
✅ **Good**: "Applies Jobs-to-Be-Done for Workday Recruiting personas. Use when structuring PRDs, interview synthesis, or design briefs from customer evidence."

### Pitfall 4: Not Iterating

❌ **Bad**: Create skill, never refine, wonder why it doesn't work  
✅ **Good**: Create, test, iterate in same chat, commit working version

### Pitfall 5: Forgetting Team Deployment

❌ **Bad**: Every PM forks the same skill with silent drift  
✅ **Good**: Publish to Team Marketplace → everyone uses canonical version

## Next Steps

### For New Skill Creators

1. **Identify repetitive workflow** (you've done 3+ times)
2. **Use `/create-skill`** (let agent generate structure)
3. **Test in same chat** (iterate until it works)
4. **Commit to git** (version control)
5. **Share with team** (via Marketplace if useful to others)

### For This Workspace

**Canonical inventory** (19 project skills, each with `SKILL.md`):

| Folder | Typical trigger / notes |
|--------|-------------------------|
| `ask-consultant` | Ask consultant / Slack archive queries |
| `cleanup-old-artifacts` | `/cleanup` |
| `create-dashboard` | Data Scientist / Pharos dashboards (`/view-dashboard` route) |
| `customer-issue-triage` | Customer issue triage workflow |
| `user-story-gap-review` | Net-new Jira story gap analysis → Confluence (`/user-story-gap-review`), **Salomon bundle** (KB + Jira index + Slack archive), **Top 5 gaps / Top 5 strengths** exec summary, seven-column table (**Dev lens** = XO MCP + optional Peanut), **Tier A/B**, **Publish pipeline**, **Suggested missing BDD** |
| `editorial-guidelines` | `/editorial` |
| `jira-recruiting-story-description` | HRREC Jira Story description layout (points to **430** + golden draft) |
| `jtbd-analysis` | `/jtbd` |
| `modulr-prototype` | Redirect stub → `xo-builder` modulr mode |
| `morning-roundup` | `/morning-roundup` |
| `pharos-analytics` | Pharos / analytics patterns for `@data-scientist` |
| `slide-writer` | `/slide-writer` (110/130) |
| `suv-smoke-test` | `@qa-engineer` / explicit SUV smoke phrases |
| `teachable-moment` | Plain-English explanations |
| `value-metrics` | `/value-metrics` |
| `workspace-audit` | `/workspace-audit` |
| `write-prd` | `/write-prd` (200-prd-template) |
| `xo-builder` | Explicit XO / REST / ModulR triggers |
| `xo-pr-comment-triage` | PR comment triage workflow |

**Not implemented as skills** (by design today): dedicated `/rice` and `/thematic` folders; use **092**, **`/value-metrics`**, and **`@pmf-analyst`** instead (see Examples above).

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
