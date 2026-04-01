# Strategic Learning & Best Practices (archived from MISSION_LOG)

## Strategic Learning & Best Practices

### 31 March 2026: Cursor PM Strategic Learning Session (Noah)

**Source**: Presentation transcript from Cursor PM (Noah), Strategic Learning Session  
**Participants**: David (PM), Workday Design/PM team  
**Transcript**: `/Users/david.denham/Downloads/Cursor discussion.rtfd/TXT.rtf`  
**Documentation**: `.cursor/docs/figma-design-system-rules.md`, `.cursor/skills/README.md`

#### Model Selection Best Practices

**High Reasoning Async Models** (complex, long-running tasks):
- GPT 5.3, GPT 5.4, Opus 4.6
- Use for: Complex research (PESTEL, competitive analysis), strategic analysis, PMF thematic analysis
- Current usage: Subagents (@product-strategy-agent, @pmf-analyst, @competitive-intel)

**Fast Synchronous Models** (quick iterations):
- **Composer 2**: Code-only (prototypes, component scaffolding). NOT for PRDs/docs.
- **Sonnet**: Technical writing, PRDs, docs, research reports. Better prose than Composer.
- **Gemini Flash**: Most cost-efficient (not recommended by Noah personally)

**Critical Rule** (Noah):
> "It's not going to... like, I would not recommend switching models mid-chat for whatever you're doing. I would recommend either spitting out a sub-agent to switch models, if that's what you, like, you need to switch models for one reason or another, or opening a new chat entirely to do that next task."

**Rationale**: Switching models mid-chat breaks cache. For Opus, cache rewrite costs $6.25 **per switch** - burns unnecessary dollars.

**Action Item**: Document in new rule `.cursor/rules/016-cursor-best-practices.mdc`

#### Context Management & Chat Hygiene

**Best Practice** (Noah):
> "It's always going to be best practice to open a new chat when you have a new discrete task. So if we think about using Cursor to write PRDs, you might want to have one chat where you're working through, like, user stories, you might want to have another chat where you're actually working through requirement set 1, another chat where you're working through requirement set 2, etc."

**Chat Sharing for Collaboration**:
- Copy chat link → Share with colleague → They fork and continue
- Used by Cursor team for collaborative problem-solving
- Alternative to Slack integration (when security blocks Slack MCP)

**Current Implementation**: E2E pipeline creates mission-based chats (implicitly discrete per mission)

**Gap**: Team members may not follow "one chat per discrete task" when working standalone

#### Architecture Patterns (Rules → Skills → Sub-agents)

**Noah's Parking Analogy**:
- **Rules** = "Where you can park" (no-parking zones, time restrictions, constraints)
- **Skills** = "How to park" (parallel parking method, step-by-step)
- **Sub-agents** = "Valet parking" (give them the keys, they figure it out)

**Build Order**:
> "Sub-agents... I wouldn't touch those until, like, you have a good understanding of first rules, and then second skills. I think skills and rules, like, go hand-in-hand in tandem... But, like, sub-agents can invoke those skills, they can, like, respect those rules, and so it's, like, really important to have those skills and rules be kind of predefined before you start to crack open this idea of sub-agents."

**Current Implementation**: ✅ Already follows this pattern
- Rules: 000-master-orchestrator, 010-style-guide, 050-functional-knowledge, 060-legal, etc.
- Skills: /rice, /jtbd, /thematic, /editorial
- Sub-agents: @product-strategy-agent, @competitive-intel, @pmf-analyst, @ux-researcher, @ux-designer, @doc-writer

**Validation**: Architecture matches Cursor PM best practices

#### PRD Skill Extraction (Noah's Pattern)

**Date**: 31 March 2026  
**Source**: Noah's architectural guidance (Cursor PM presentation)  
**Implemented By**: 090-agent-improvement-advisor

**Architectural improvement**: Extracted PRD writing logic from 200-write-prd.mdc into reusable `/write-prd` skill following Noah's guidance (Cursor PM presentation).

**Pattern**: Skill (writing logic) + Rule (template)
- **Skill**: `.cursor/skills/write-prd/SKILL.md` - workflow, MCP integration, validation
- **Rule**: `200-prd-template.mdc` - template definitions, format standards (glob-scoped)

**Benefit**: Enables standalone PRD invocation (`/write-prd for [feature]`) while preserving E2E pipeline integration (orchestrator Step 15).

**Rationale**: User confirmed writing PRDs both ad hoc (standalone) and via E2E pipeline (after PMF research). Skill extraction provides dual-mode support aligned with Cursor 2.6 best practices.

**File Changes**:
- Created: `.cursor/skills/write-prd/SKILL.md` (~450 lines, writing logic)
- Updated: `200-write-prd.mdc` → `200-prd-template.mdc` (~435 lines, template only)
- Updated: `000-master-orchestrator.mdc` (Step 15 reference, routing table)

**Invocation Modes**:
1. **Standalone**: `/write-prd for [feature description]`
2. **E2E Pipeline**: Orchestrator Step 15 → 200-prd-template.mdc → `/write-prd`
3. **Glob Activation**: Opening `docs/prds/*.md` → 200-prd-template.mdc → `/write-prd`

**Impact**: Zero breaking changes. E2E pipeline continues to work. New capability: ad hoc PRD writing without full research.

#### Slide Writer Skill Extraction (VP Audience Language)

**Date**: 31 March 2026  
**Source**: User request for VP Product Management audience-appropriate language  
**Implemented By**: 090-agent-improvement-advisor

**Architectural improvement**: Extracted slide language transformation logic into reusable `/slide-writer` skill to address tone/clarity issues in PMF roadmap decks.

**Pattern**: Skill (language transformation) + Rules (structure/density/template)
- **Skill**: `.cursor/skills/slide-writer/SKILL.md` - VP language guidelines, transformation patterns, clarity checks
- **Rules**: `110-slide-generator.mdc` and `130-pmf-slide-generator.mdc` - structure, density, typography (glob-scoped)

**Problem Identified**: Decks (e.g., `India_Recruiting_PMF_Roadmap_v81.pdf`) had "muddled, overly long in parts, not long enough in others, technical or incomprehensible in others" language for VP audience.

**Solution**: Skill invoked **before** JSON spec generation in both 110 and 130 to transform:
- Research language → Executive-ready insights
- Technical jargon → Simple, accessible terms
- Dense prose → Clear, scannable bullets
- Agent terminology → Business language

**Language Transformation Guidelines** (from ChatGPT recommendations):
1. **Simplicity & Accessibility**: Use "use" not "utilise", "improve" not "optimise", short sentences (≤20 words)
2. **Executive Tone**: Professional without casual language, confident without jargon
3. **Clarity Check**: 10-second comprehension test per slide
4. **Workday Context**: Preserve product names, maintain compliance/technical accuracy

**What 110/130 Still Control**:
- Framework selection and section structure
- Density validation (7-8 lines max, 45-char titles)
- Typography standards (14pt default, 16pt for sparse, 12pt for dense)
- Layout variety and visual design
- JSON spec generation

**File Changes**:
- Created: `.cursor/skills/slide-writer/SKILL.md` (~350 lines, language transformation)
- Updated: `110-slide-generator.mdc` (added Step 3: Transform Language)
- Updated: `130-pmf-slide-generator.mdc` (added Step 2: Transform language in MCP Workflow)
- Updated: `000-master-orchestrator.mdc` (removed 060 roadmap legal review, renumbered E2E steps 30→29)
- Updated: `001-e2e-pipeline-reference.md` (removed Step 10 060 legal review, renumbered all steps)
- Updated: `.cursor/agents/pmf-analyst-agent.md` (removed legal column from E2E Handoff table)

**Invocation Modes**:
1. **110-slide-generator**: Standalone short decks → Step 3 invokes `/slide-writer` before spec
2. **130-pmf-slide-generator**: Full PMF roadmap decks → Step 2 invokes `/slide-writer` before spec
3. **Standalone**: `/slide-writer transform this content for VP audience` (ad hoc)

**Pipeline Changes**: E2E pipeline Step 10 (060 roadmap legal review) removed per user request. PMF recommendations no longer require compliance review before deck generation. PRD legal review (Step 15, formerly Step 16) remains.

**Impact**: Language/tone quality improves for VP audience. Density and structural rules preserved. E2E pipeline reduced from 30 to 29 steps.

#### Async vs. Sync Work Delegation

**Third Era of AI Development** (Noah):
- Era 1 (4 years ago): Manual coding
- Era 2 (2022-2024): AI as assistant (Tab autocomplete) → AI as pair programmer (Ask mode)
- Era 3 (Dec 2024-present): AI as delegated team member (Cloud agents, async execution)

**Cursor Engineering Workflow**:
> "Essentially, like, a lot of the task of writing unit tests, writing documentation, all of that gets passed off to cloud agents to work asynchronously... And even within Cursor, internally, like, we now commit 30% of our PRs from cloud agents, so a lot of this work is being delegated to, like, synchronous [async] agents."

**Cloud Agent Use Cases** (what Cursor delegates):
- ✅ Writing unit tests
- ✅ Writing documentation
- ✅ Bug fixes (will write 20,000 lines of code)
- ✅ Security reviews
- ✅ UAT testing (generates video demonstrations from test scripts)
- ❌ New feature development (not recommended by Cursor team)

**Current Implementation**:
- ✅ E2E pipeline delegates heavy work to subagents (5-way parallel in Steps 4-8)
- ❌ **Blocked**: Cloud agents not available (Workday security review pending)

**High-Value Opportunities** (when cloud agents approved):
1. **Jira duplicate detector**: Auto-pair tickets in review status with backlog (Forms product line)
2. **Feedback synthesiser**: Slack #feedback channel → Jira insights (weekly cron or event-triggered)
3. **PRD sync**: Update PRDs from Slack design discussions (export CSV workaround until Slack MCP approved)

#### Team Deployment & Marketplace

**Team Marketplace Pattern** (Noah):
> "If I want to, like, pull down on their [recruiting team's] skills and, like, MCPs that they use to do recruiting research, like, I can just literally click Add to Cursor, and it'll, like, take this whole plugin bundle and basically, like, add it into my account."

**Setup Requirements**:
- Cursor admin (P&T or IT designated person)
- GitHub repo with skills/rules/MCPs
- Team Marketplace publish (cursor.com/dashboard → Plugins → Team Marketplace)

**Hierarchical Structure** (coming soon per Noah):
```
Workday (org level - provisioning, skim groups)
└── Paradox PM Team
    ├── Required plugins: PM toolkit, Canvas Kit MCP
    ├── Available plugins: Advanced research skills, Jira automations
```

**Current Status**: ❌ Not configured  
**Next Action**: Designate admin, create `workday-pm-skills` GitHub repo

#### Slack Integration & Collaboration

**Cursor Engineering Workflow** (Noah):
> "That's kind of the way that our engineers are working. They actually, like, work out of Slack a lot. So, like, most of the feature development is just happening in Slack, where the cloud agent is just, like, invoked at some point by tagging, like, at cursor in Slack, and all of the, like, back and forth between, like, logic decisions just happens in, like, Slack threads, essentially."

**Slack + Cloud Agents Pattern**:
1. Design discussion happens in Slack thread
2. Tag @cursor when decisions made
3. Cloud agent indexes thread context
4. Agent updates PRD to reflect logic
5. Work continues async while PM focuses elsewhere

**Workaround** (when Slack MCP blocked):
> "If you can't use, like, the Slack integration, you can always export the Google sheet as, like, a CSV, dump that in the cursor when you, you know you're kind of, like, done asking questions, and be, like, tag that sheet, like, update this PRD to reflect, like, the most up-to-date logic here."

**Current Status**: 
- ❌ Slack MCP not approved (Workday security posture TBD)
- ✅ Workaround viable: Export CSV from Google Sheets design discussions → Update PRD

**High-Value Use Case**: Async PRD updates from Slack threads would prevent context-switching for PM

#### Figma MCP Reality Check

**Noah's Assessment**:
> "Figma MCP has been, like, sort of hit or miss. Like, sometimes it works, sometimes it doesn't work... it's great for giving the agent an understanding of the flow in which you're operating through, but not actually great at, like, reproducing the designs from Figma. I... We've seen better success with just, like, redlining different components, building stuff out that way."

**Cursor Design Team Workflow**:
> "The way that cursor designers work is we have, basically, like, they use Figma, but it's only for, like, really large breadth of exploration, and then when they're actually, like, getting into, building something, they build it within a separate repository that they call Baby Cursor. And it has, like, all these components and stuff like that built out."

**Validation of Current Approach**:
- ✅ Workday workflow: 315 Design Brief → 320 Prototype (Canvas Kit) → 330 Capture to Figma
- ✅ Prototype-first matches Noah's "better success" recommendation
- ✅ Use Figma for context, not for code generation

**`create_design_system_rules` Reality** (Noah):
> "They have, like, a create design systems rule, so you can run this, like, a couple times, and it'll go and, like, look at your files, and then create an actual rule and cursor that tries to, like, encapsulate some of that design system. It's kind of like what we talked about earlier, like... it's alright. It's not perfect by any means."

**Takeaway**: Use as **timesaver** for bootstrapping rules, but expect to refine manually. See `.cursor/docs/figma-design-system-rules.md` for usage guide.

#### Automations Use Cases

**Cursor Internal Usage** (Noah):
> "In our actual, like, production, instance, I think we have, like, the last I looked, it was, like, 88 automations. Most of them are engineering-focused... We only have, like, 120 engineers. So... like... it's almost, like, one-to-one for, like, engineers building out automations."

**Example Automations** (from Noah):
1. **Bug triage from Slack**:
   - Monitor #bug-report channel
   - Spin up virtual environment
   - Test and validate if it's a bug
   - Create Linear issue
   - Attempt fix automatically
   - Engineering validates fix

2. **Daily follow-ups from meeting notes**:
   - Uses Granola MCP for meeting transcripts
   - Runs every morning (cron)
   - Produces prioritised follow-ups from previous day

3. **Jira ticket pairing** (suggested for Workday):
   - Weekly cron or event-triggered
   - Review tickets in "Review" status
   - Search backlog for duplicates
   - Flag potential pairs (Forms product line filter)

4. **Feedback river synthesis** (suggested for Workday):
   - Monitor Slack #feedback channel
   - Weekly cron or per-message trigger
   - Extract insights → Match to existing Jira tickets
   - Suggest ticket updates OR send PM summary

**Blocked**: Cloud agents security review pending at Workday

#### Self-Driving Codebases (The Future)

**Noah**:
> "We... we think we're, like, right here at the cusp of AI being capable of being a whole engineering team, we have this idea that we talk a lot about of self-driving codebases, and it's not that they're not realistic, like, it... you can have a self-driving codebase, like, right now. The thing is, they're just extremely expensive to run."

**Cursor Experiment**:
- Task: "Build a browser from scratch"
- Duration: 1 week continuous
- Peak: 1,000 commits per hour
- Result: Self-organised sub-agent hierarchies, entire browser built
- Complexity: Too complex for humans to review

**Takeaway**: Technically possible today, but cost-prohibitive. Current focus: Affordable, practical async delegation.

#### Cursor Glass (New Interface)

**Expected Launch**: ~5 days from presentation date (late March 2026)  
**Status**: Alpha/Research Preview (personal accounts); enterprise rollout TBD

**Features**:
- Flexible layouts (browser, files, terminals in custom arrangements)
- Feature flags (control functionality visibility)
- Context management: Each chat = own workspace
- Browser/terminal/files persist per chat

**Use Case**: Managing multiple concurrent workflows without context fragmentation

**Action Item**: Test when available at Workday enterprise level; may improve E2E pipeline UX

#### Token Efficiency & Cost Management

**Industry Shift** (Noah):
> "I know with Workday, using Cursor, you guys are still on the request-based model. That's kind of all changing here in the future, in which, like, there is, like, some aspect where you kind of have to pay attention to, like, how expensive models are, going forward, because everything's kind of switching just across the industry to, like, usage-based, where everything comes back to, like, the end kind of API cost."

**Implications**:
- Workday moving from request-based to usage-based pricing
- Model selection will impact budget directly
- Cursor's infrastructure (dynamic context discovery, indexing) reduces token bloat vs. model labs (OpenAI Cloud Code, Anthropic Console)

**Cursor Advantage**:
> "We have infrastructure in place that actually, like, helps manage that more effectively, and that's kind of where the... indexing comes in, like, in handy, because we don't have to load everything straight into the context window... we can manage some of these things, like, a little bit more effectively."

**6 months ago**: One MCP call loaded 30-40% of context window (expensive)  
**Now**: Dynamic context discovery + indexing = lower token cost per MCP call

---

### Key Takeaways

**Architectural Validation**: ✅ Workday PM workspace already follows Cursor best practices (rules → skills → sub-agents hierarchy)

**Strengths to Maintain**:
1. Sophisticated E2E pipeline with 5-way parallelisation (Steps 4-8)
2. Thin wrapper subagents that delegate to glob rules (efficient)
3. Dual-mode skills (standalone + E2E pipeline)
4. Comprehensive MCP integration (12 MCPs)

**Critical Gaps to Address**:
1. **Cloud agents** (blocked on security review) → Prevents async delegation of tests, docs, UAT
2. **Team Marketplace** (need admin) → Skills not easily shared across team
3. **Slack MCP** (security review TBD) → Can't invoke @cursor in Slack threads for async PRD updates
4. **Chat hygiene documentation** → Team may not know best practices (never switch models mid-chat)

**High-Value Opportunities**:
1. Jira duplicate detector automation (when cloud agents available)
2. Feedback river synthesis (Slack → Jira insights)
3. PRD sync from Slack design discussions (workaround: CSV export)
4. Cursor Glass adoption (when available at enterprise level)

**Next Actions**:
- [ ] Create `.cursor/rules/016-cursor-best-practices.mdc` (model selection + chat hygiene)
- [ ] Designate Cursor admin for Team Marketplace setup
- [ ] Create `workday-pm-skills` GitHub repo for team deployment
- [ ] Follow up on cloud agents security review status
- [ ] Explore Slack MCP security posture with Workday IT
