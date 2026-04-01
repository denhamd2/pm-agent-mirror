# Write PRD Skill

Writes world-class Product Requirements Documents following Workday standards with Deployment Agent validation and value metrics integration.

## When to Use This Skill

Use when you need to:
- Create PRD for new feature or initiative
- Document product requirements with strategic context
- Validate PRD structure against Workday standards
- Integrate value metrics and legal compliance review
- Write PRDs standalone or as part of Regional E2E pipeline

Trigger via: `/write-prd` command or when 200-prd-template.mdc references it

## MCP Integration

### Deployment Agent (`user-deployment-agent`)
**Location**: `/Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/user-deployment-agent/`

Use this to:
- Validate PRD structure against Workday standards
- Check for required sections
- Ensure compliance with internal processes
- Get feedback on clarity and completeness

**Before using**: Read tool descriptors in the MCP folder to understand available tools.

### Confluence (`user-confluence-mcp`)

**Not used for PRDs.** Do not call `create_confluence_page` or otherwise publish PRDs to Confluence. If stakeholders need Confluence, the PM copies from the markdown file manually.

## PRD Creation Workflow

### Step 1: Gather Context
- Read any research files in `/research/`
- Search Confluence for related strategy docs, roadmap items
- Ask user for missing information:
  - Target user persona
  - Business objectives
  - Timeline constraints
  - Known dependencies
  - Whether this is an AI/ML feature (determines which sections to include)

### Step 1.5: Receive PM Framing (Regional E2E only)

**When invoked as part of Regional E2E pipeline** with PM framing in the Task prompt:

The orchestrator has already collected PM framing at **Step 14** (before invoking you). You receive:
1. Problem Statement (PM-approved or PM-refined)
2. Success Criteria (PM-approved metrics)
3. Scope Boundaries (PM-approved)
4. Strategic Intent (PM's "why now, why this")
5. Additional Context (PM's constraints/concerns)

**Use PM framing as PRIMARY input** when drafting PRD:
- PM-approved problem statement → "Core Problem" in Overview table
- PM-approved success criteria → "Customer benefits" section with Year 1 Forecast
- PM-approved scope boundaries → Implicit in "Feature Solution" and documented constraints
- PM strategic intent (#4) → "Executive Summary" paragraph 4 and "Why now?" context throughout
- PM additional context (#5) → Constraints, dependencies, assumptions sections

**Research as SUPPORTING evidence**:
- Use @pmf-analyst themes, 105 quotes, @competitive-intel competitive gaps to support PM's framing
- Cite research to back up PM's problem statement and metrics
- Don't override PM judgment with research data

**Proceed directly to Step 2** (Draft PRD Sections) without presenting kickoff questions.

**Key principle**: PM owns the thinking; agent structures and scales it with research evidence.

### Step 2: Draft PRD Sections

**Before drafting**: Review "No Agentic Metadata" rule in 200-prd-template.mdc. Do NOT include pipeline IDs, HITL references, or agent workflow terminology in the PRD.

**Required Sections (All PRDs):**
1. **Title & Date**: [Feature Name] ([Release Version]) | Product Requirements Document | [Month, Year]
2. **Executive Summary**: 3-4 paragraphs (Workday positioning, customer value, Workday value, delivery context)
3. **Overview Table**: Core Problem, How done today, Unique approach, Customer benefits with Year 1 forecast
4. **Audience/Personas**: Primary, Secondary, Tertiary (if applicable)
5. **Feature Solution**: Bullet list of solution flow
6. **Critical User Journey & Use Cases**: Bullet list of user journey steps
7. **UX Designs**: Figma links
8. **Releases & Production Thresholds**: Review completions
9. **Target Delivery & Major Milestones**: Table of milestones and dates
10. **Resources**: Epic links, review links, research links
11. **Contacts**: Table with names and roles

**Optional Sections (AI/ML Features Only):**
- **"Why is AI/ML the chosen approach?"** row in Overview table
- **Technical AI/Skill & System Design** (entire section)
  - AI Skill's Role, Capabilities, and Boundaries
  - Models and Model Capabilities
  - System Prompt Approach
  - Core AI Functions to Build
  - User Feedback and Human Oversight
  - Handling Model Failures and Low-Confidence Outputs
  - Required Level of Explanation
  - AI Model Integration
  - Key System Dependencies (expand for AI features)
  - Error and Exception Handling (AI-specific errors)
- **Data** section
  - Algorithm Logic Overview
  - Criteria for Filtering
  - LLM Prompt & Data Point Details
  - Evals / Performance

### Step 2.5: Suggest Value Metrics (Auto-invoked)

**When**: After drafting Feature Solution (Step 2, item 5), before finalizing Strategic Value & Outcomes

**Action**: Automatically invoke `/value-metrics suggest [feature description]`

**Process**:
1. Extract feature description from PRD context (Feature Solution section)
2. Invoke `/value-metrics suggest [feature description]`
3. Receive **complete 3-tier metrics package**:
   - **Impact (Business Value)**: 1-3 BV metrics from CSV with status, Jira, PM owner
   - **Product Outcomes**: JTBD statement + 3 PV metrics (with PV→BV linkages and rationale)
   - **Outputs (Product Catalogue)**: 1 Adoption metric + 1 Usage metric with targets
4. Present metrics package to PM for selection
5. PM selects final metrics based on:
   - BV metric relevance and baseline data availability (prefer Status: "Delivered")
   - PV metric alignment with JTBD and BV linkages
   - Adoption/Usage targets match strategic importance
6. Document selected metrics in "Strategic Value & Outcomes" section with:
   - **Impact (Business Value)**: Selected BV metrics with baseline → target
   - **Product Outcomes**: Selected PV metrics with JTBD trace and BV linkages
   - **Outputs (Product Catalogue)**: Adoption and Usage metrics with Year 1 targets
   - Rationale for selections

**Example invocation**:
```
Feature: "AI-powered candidate screening for high-volume GCC roles"

Auto-invoke: /value-metrics suggest AI-powered candidate screening for high-volume GCC roles

Receive:

Impact (Business Value):
1. Time to Hire (BV) - [Delivered, baseline available]
2. Productivity: Recruiter Capacity (BV) - [Delivered, baseline available]

Product Outcomes:
JTBD: "When reviewing 200+ applications, I want to identify qualified candidates quickly so I can shortlist in <1 hour"

1. Avg. time to shortlist 10 candidates (PV) → drives BV#1
2. # of applications auto-screened per recruiter/month (PV) → drives BV#2
3. Qualified candidate match accuracy (PV) → drives BV#1, BV#2

Outputs (Product Catalogue):
- Usage: AI screening invocations per recruiter/month (Target: 50+)
- Adoption: % of recruiters using AI screening (Target: 25% Year 1)

PM selects: All BV metrics (both have baseline data), all 3 PV metrics (strong JTBD alignment), both Adoption/Usage metrics
```

**Integration note**: This step is automatic during PRD creation. For ad-hoc metric queries, PM can invoke `/value-metrics suggest [feature]` directly.

### Step 3: Apply Workday Formatting Standards
- Use tables for structured information (Overview, Personas, Milestones, Contacts)
- Use bullet lists for features, capabilities, journeys
- Use numbered lists for sequential steps or priorities
- Include "Workday Confidential" and page numbers at bottom
- Professional tone: data-driven, strategic, crisp
- British English spelling throughout
- Quantify everything: adoption %, usage volume, time savings, baseline vs target metrics

### Step 4: Validate with Deployment Agent
- Check MCP tools: `/Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/user-deployment-agent/tools/`
- Use appropriate tool to validate PRD structure
- Incorporate feedback on Workday standards
- Ensure all required sections are complete

### Step 5: Save (canonical)
- Save to `/docs/prds/[product-name]-[feature-name]-prd.md`
- Link path from MISSION_LOG.md

### Step 6: Handoff
- Update MISSION_LOG.md with PRD status
- If execution planning needed, flag for 400-backlog-refinement.mdc
- Notify user of next steps (review, approval, planning)

## Legal Review Integration (Regional E2E Pipeline)

When invoked as part of Regional E2E pipeline (Step 15), the orchestrator will:
1. Invoke you to create PRD
2. **Invoke 060-legal-advisor** to review PRD for compliance (Step 16)
3. Pass 060 findings back to you for revision (Step 17, if needed)

**When receiving legal revision request:**
- Read 060 findings (provided by orchestrator)
- Address critical and important compliance issues
- Update relevant PRD sections (Success Metrics, Compliance Considerations, User Experience, Data Architecture)
- Maintain PRD structure and format
- **One revision pass only** - make best effort, document any unresolved issues in "Open Questions"
- Return revised PRD to orchestrator

**060 may flag:**
- GDPR Article 22 (automated decision-making) - ensure human oversight
- EU AI Act high-risk classification - document compliance requirements
- Cross-border data transfers - specify transfer mechanisms (SCCs, adequacy)
- Consent flows - validate consent language and placement
- Data retention - verify retention periods align with regulations
- Special categories of data (Article 9) - explicit consent required
- DPIA requirements - document high-risk processing scenarios

**What to update based on 060 findings:**

| 060 Flags | PRD Section to Update | What to Add |
|---|---|---|
| AI Act High-Risk | Overview → "Why AI/ML" | Note high-risk classification, compliance requirements |
| GDPR Art. 22 | Technical AI/System Design → Human Oversight | Strengthen human-in-the-loop language, document review points |
| DPIA Required | Releases & Production Thresholds | Add DPIA completion as prerequisite |
| Consent Issues | Feature Solution, Critical User Journey | Clarify consent collection, storage, withdrawal |
| Cross-Border Transfers | Data section, Technical Design | Document transfer mechanisms (SCCs, adequacy decisions) |
| Retention Violations | Data section | Align retention periods with GDPR/local law |

**Pattern**: Similar to Red Team (080) - advisory review, one revision pass, pipeline continues.

## Quality Checklist

Before finalizing a PRD, ensure:
- [ ] Executive Summary follows 4-paragraph structure (Workday positioning, customer value, Workday value, delivery context)
- [ ] Overview table includes all required rows
- [ ] Year 1 Forecast includes adoption target, usage volume, calculation basis
- [ ] Strategic Value & Outcomes quantifies impact with baseline and target metrics
- [ ] Value Realization metrics (3-tier: BV, PV, Adoption/Usage) selected via `/value-metrics suggest` in Step 2.5
- [ ] Personas clearly identify Primary, Secondary, Tertiary with their key responsibilities
- [ ] Feature Solution is a crisp bullet list (not prose paragraphs)
- [ ] UX Designs includes Figma links
- [ ] Milestones table includes target dates
- [ ] Resources section includes Epic IDs, review links, research links
- [ ] Contacts table complete with names and roles
- [ ] AI-specific sections included ONLY if feature uses AI/ML
- [ ] British English spelling used throughout
- [ ] Professional, data-driven tone maintained
- [ ] Page numbers formatted as "Workday Confidential    N" with "-- N of M --"
- [ ] PRD saved to `/docs/prds/[feature-name]-prd.md` and **not** published to Confluence

## Experience Principles Validation

**Reference**: `docs/experience-principles.md`

Before finalizing any PRD, validate the feature against **Workday's three Experience Principles**. Add a dedicated section to the PRD that demonstrates alignment.

### Validation Checklist

For each principle, ask these questions and document the answers in the PRD:

#### 1. Empower (Give Users Control)
- ✅ **Outcome-Focused**: Does this feature focus on the user's desired outcome (not force them through the system's model)?
- ✅ **Augment over Replace**: Does it keep the human in control as an active driver?
- ✅ **Stay Out of the Way**: Can users adopt basic functions without "earning a degree"?

**Red flags**: Feature obscures information, requires complex training, forces users through system workflow instead of their natural workflow.

#### 2. Trust (Build Their Confidence)
- ✅ **Transparency**: Will users understand what the system is doing?
- ✅ **Clarity & Familiarity**: Does it speak the user's language and feel natural?
- ✅ **Quality with Accuracy**: Does it create a sense of reliability?

**Red flags**: Unclear states, unfamiliar terminology, low-quality implementation that creates doubt.

#### 3. Grow (Enable Them To Change)
- ✅ **Easy Change**: Can users easily revise and iterate through self-service?
- ✅ **Change History**: Are changes and their implications clear?
- ✅ **Build Upon**: Can users build upon existing work without manual re-implementation?

**Red flags**: Changes are punishing, require support tickets, force users to recreate work, hide change history.

### PRD Section Template

Add this section to every PRD (after "Feature Solution" and before "Strategic Value & Outcomes"):

```markdown
### Experience Principles Alignment

**How this feature upholds Workday's Experience Principles:**

**Empower (Give Users Control)**
- [Specific way the feature keeps users in control]
- [How it focuses on user outcome, not system model]
- [Example: "Recruiters preview all 47 candidates before bulk-updating status, with clear undo"]

**Trust (Build Their Confidence)**
- [Specific way the feature builds transparency]
- [How it uses familiar language/patterns]
- [Example: "Clear preview: '3 candidates will be notified via WhatsApp. Review →'"]

**Grow (Enable Them To Change)**
- [Specific way the feature enables easy revision]
- [How change history is preserved/visible]
- [Example: "Campaign messages editable post-send; affects future sends only; history preserved"]

**Principle Validation:**
- [ ] Feature keeps user in control (not system-driven)
- [ ] Clear transparency about what's happening
- [ ] Easy to change/iterate without support tickets
```

### Example: GCC WhatsApp Integration

```markdown
### Experience Principles Alignment

**Empower (Give Users Control)**
- Recruiters control when/how messages are sent (system suggests, doesn't auto-send)
- Outcome-focused: Feature enables "reach GCC candidates effectively," not "navigate WhatsApp API"
- Preview every message before sending; bulk operations show impact before applying

**Trust (Build Their Confidence)**
- Transparent delivery status: "Sent to 12 candidates, 8 read, 3 replied" (real-time)
- Familiar language: "Message," "Send," "Reply" (not technical jargon)
- Quality: Messages are reliably delivered; system indicates failures clearly

**Grow (Enable Them To Change)**
- Self-service template editing (no IT dependency)
- Change history: "Template edited 3 times; affects future campaigns only"
- Builds on existing Campaigns: WhatsApp added as new channel (not separate app)
```

### When Principles Conflict

Sometimes principles create tension (e.g., "Empower" wants flexibility, "Trust" wants simplicity). Document the tradeoff in the PRD:

**Example:**
> **Principle Tradeoff**: We prioritized **Trust** (clarity) over **Empower** (maximum flexibility) by limiting custom WhatsApp templates to 5 pre-approved formats. This prevents compliance issues (GCC regulations) while still enabling personalization via merge fields. Future iteration could add custom templates with compliance validation.

## Handoff Scenarios
- **To Execution Planner (300)**: After PRD approval, for Jira ticket creation
- **To Slide Generator (110)**: To create executive presentation from PRD
- **To Market Intelligence (100)**: **Broader** market or industry research (macro trends, category dynamics) **outside** structured ATS/regional parity. **Do not** re-run **100** for a basic competitor list when **Regional E2E** already ran **@competitive-intel** at Step 4 and produced `[region-code]-competitive-scan-*-[MISSION-ID].md` + matrix delta (and optional legacy `e2e-ci-brief-*` if still present for the mission).
- **From Competitive Intelligence (@competitive-intel)**: **Regional E2E** – orchestrator runs **@competitive-intel** at **Step 4** before you. You **must** read the **mission-scoped** baseline scan and regional matrix (paths below) and ground competitive differentiation in **Native / Workaround / True Gap** with citations from those artifacts (not unsourced competitor marketing). If a separate **Pattern 5** `e2e-ci-brief-*` exists for the same mission, you may use it as **supplementary** evidence; baseline scan + matrix remain **required**.
- **From Design agents (320 Prototype, 319 Doc Writer, 315 UX Designer)**: To document design decisions and implementation in PRD

## Regional E2E Pipeline Context

When receiving **"Create PRD for the selected [region] opportunity: [recommendation]. Source: [path]. Part of [region] e2e pipeline"** or any invoke that includes **Required inputs:** **`[region-code]-competitive-scan-*-[MISSION-ID].md`** / **`[region-code]-competitive-matrix`** (orchestrator **Step 15** PRD step, after HITL), the recommendation is the PM-selected one from HITL. **@competitive-intel** baseline CI ran at **Step 4** (Pattern 1a), not after selection.

**NEW STEP 1.5: PM Framing Conversation (MANDATORY)**

Before drafting the PRD, activate PM Framing Conversation:

1. Read research artifacts (@pmf-analyst, 105, @competitive-intel)
2. Generate draft proposals for:
   - **Problem Statement**: 2-3 sentences from @pmf-analyst themes + 105 quotes + @competitive-intel gaps
   - **Success Criteria**: 2-3 metrics with research-based baselines and targets
   - **Scope Boundaries**: What's NOT in v1 (inferred from research scope + competitive positioning)
3. Ask PM for:
   - **Strategic Intent**: Why now? Why this over alternatives? (PM business context)
   - **Anything else**: Constraints, concerns, assumptions
4. **WAIT for PM response** - Pipeline is BLOCKED until PM approves/refines framing and answers #4 and #5
5. Proceed to original workflow with **PM framing as PRIMARY input** (research as supporting evidence)

**THEN continue with original workflow:**

1. Read the GCC PMF analysis from the source path (e.g., `research/GCC/thematic-analysis/[latest].md`)
2. **Read Competitive Intelligence outputs (mandatory for Regional E2E):**
   - `research/competitive/gcc/gcc-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` (path from orchestrator / MISSION_LOG for **this** E2E run — the **new** mission-scoped baseline scan from **@competitive-intel** Pattern 1a)
   - `research/competitive/matrices/gcc-competitive-matrix.md` (roster, tables, regional context; use changelog entry for this mission)
   - **Optional supplement:** `research/competitive/gcc/e2e-ci-brief-*-[MISSION-ID].md` if the orchestrator or MISSION_LOG references a **separate** Pattern 5 brief for the same mission (legacy or explicit add-on)
3. In **Overview** – *How is our approach uniquely different from others?* (and any **Competitive / market** subsection): **cite** the brief and matrix – summarise parity as **Native**, **Workaround** (with limits), or **True Gap** where relevant to the initiative; align narrative with PMF themes **without** contradicting **@competitive-intel** validation.
4. Use the recommendation as the PRD scope (problem, solution, success metrics)
5. Structure the PRD to support representative UI scope for **315** (design brief) and **320** (prototype)
6. **CRITICAL: Execute PRD workflow (markdown canonical)**:
   - Step 1: Save markdown to `/docs/prds/[feature-name]-prd.md`
   - Step 2: **Do not** publish to Confluence
   - Step 3: Provide the **markdown path** to the user
7. After the PRD file is saved, the orchestrator handles handoff to **315** (discovery)—no need to invoke **315** directly from **200**

## Example Usage

**User**: "Create a PRD for bulk timesheet approval"

**Your Actions:**
1. Ask: "Is this feature using AI/ML?" (determines which sections to include)
2. Search Confluence for related roadmap items and research
3. Ask clarifying questions about target users, timeline, constraints, usage volume forecasts
4. Draft PRD using Workday template with proper table formatting
5. Ensure Year 1 Forecast includes adoption %, volume, calculation methodology
6. Validate structure with Deployment Agent MCP
7. Save to `/docs/prds/timesheets-bulk-approval-prd.md`
8. Update MISSION_LOG.md with the markdown path
9. Provide user the path to `docs/prds/timesheets-bulk-approval-prd.md`
10. Ask: "Ready for review? Or should I create an execution plan next?"

## Template Reference

For PRD template definitions, section structures, and format examples, reference **200-prd-template.mdc** which provides:
- Executive Summary structure (4-paragraph format)
- Overview table rows and examples
- Feature Solution formatting
- Critical User Journey structure
- Technical AI/Skill & System Design sections (AI features only)
- Data section structure (AI features only)
- UX Designs section
- Releases & Production Thresholds
- Target Delivery & Major Milestones table
- Resources section
- Contacts table
- British English standards
- Professional tone guidelines

## Quality Standards

### Always ✅
- Read 200-prd-template.mdc for template structure before drafting
- Auto-invoke `/value-metrics suggest` at Step 2.5 for metrics integration
- Validate against Experience Principles (Empower, Trust, Grow)
- Include competitive context from @competitive-intel (E2E pipeline only)
- Use PM framing as PRIMARY input when provided (E2E Step 14)
- Save to `/docs/prds/` as markdown (canonical format)
- Validate with Deployment Agent MCP
- British English spelling throughout
- Professional, data-driven tone
- Quantify adoption, usage, impact with baseline → target

### Never ❌
- Include pipeline IDs, HITL references, agent numbers in PRD
- Publish PRDs to Confluence (markdown is canonical)
- Skip value metrics integration (Step 2.5 is mandatory)
- Skip Experience Principles validation section
- Override PM framing with research data (research supports PM thinking)
- Include AI/ML sections for non-AI features
- Use vague success metrics without baseline → target
- Forget page numbers ("Workday Confidential    N" and "-- N of M --")

## Invocation Modes

### Mode 1: Standalone (Ad Hoc PRD)
**Trigger**: `/write-prd for [feature description]`

**Workflow**:
1. Gather context via user questions (Step 1)
2. Draft PRD sections (Step 2)
3. Auto-invoke `/value-metrics` (Step 2.5)
4. Apply formatting (Step 3)
5. Validate with Deployment Agent (Step 4)
6. Save to docs/prds/ (Step 5)
7. Handoff (Step 6)

### Mode 2: E2E Pipeline (After PMF Research)
**Trigger**: Orchestrator Step 15 invokes 200-prd-template.mdc → calls `/write-prd`

**Workflow**:
1. Receive PM framing from orchestrator (Step 1.5)
2. Read research artifacts (@pmf-analyst, 105, @competitive-intel)
3. Draft PRD using PM framing as PRIMARY + research as SUPPORTING
4. Auto-invoke `/value-metrics` (Step 2.5)
5. Apply formatting (Step 3)
6. Validate with Deployment Agent (Step 4)
7. Save to docs/prds/ (Step 5)
8. Orchestrator invokes 060 for legal review (Step 16)
9. Revise PRD if 060 flags issues (Step 17)
10. Return to orchestrator for Step 18 (080 Red Team)

### Mode 3: Glob Activation (Working in docs/prds/)
**Trigger**: User opens or creates file in `docs/prds/` folder

**Workflow**:
- 200-prd-template.mdc glob activates
- Rule references this skill
- Follow Mode 1 (Standalone) workflow

## Integration with Other Skills

This skill integrates with:
- **`/value-metrics`**: Auto-invoked at Step 2.5 for BV/PV/Adoption/Usage metrics
- **`/jtbd`**: Referenced via 200-prd-template.mdc and value-metrics for persona/outcome framing
- **`/rice`**: May be used for feature prioritization context in research

## Integration with Other Agents

This skill is invoked by:
- **000-master-orchestrator**: E2E pipeline Step 15, standalone routing
- **200-prd-template.mdc**: Glob-scoped rule that activates in docs/prds/ folder
- **060-legal-compliance-review**: Reviews PRD for compliance (E2E Step 16)
- **080-red-team**: Stress tests PRD for risks (E2E Step 18)

This skill may handoff to:
- **400-backlog-refinement**: Epic/story breakdown after PRD approval
- **110-slide-generator**: Executive presentation from PRD
- **315-design-brief-creation**: Design discovery from PRD (E2E Step 19)

## Notes

- **Canonical PRD format**: Markdown in `/docs/prds/` (NOT Confluence)
- **Template lives in rule**: 200-prd-template.mdc provides section definitions
- **Logic lives in skill**: This file provides writing workflow and validation
- **Dual-mode support**: Standalone (`/write-prd`) and E2E pipeline (orchestrator Step 15)
- **Zero breaking changes**: E2E pipeline and glob activation continue to work
