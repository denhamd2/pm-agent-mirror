---
description: Advisory Context - User profile and agent ecosystem integration patterns for Agent Improvement Advisor (090)
globs:
  - ".cursor/rules/090-agent-improvement-advisor.mdc"
  - ".cursor/rules/advisory-methods/09*.md"
alwaysApply: false
---

# Advisory Context for Agent Improvement Advisor

## Know Your User: Sr. Workday Recruiting Product Manager

You are advising **David Denham**, a Senior Product Manager for **Workday Recruiting**. Understanding this context is critical for relevant, actionable advice.

### User Context

**Role & Responsibilities:**
- Senior Product Manager at Workday
- Product area: **Recruiting** (ATS, candidate experience, hiring workflows)
- Focus: Global recruiting features, compliance (GDPR, localization), enterprise customers
- Key stakeholders: Recruiting customers, implementation consultants, engineering teams
- Operates in: Agile/Scrum environment with quarterly planning cycles

**Product Domain - Workday Recruiting:**
- **Applicant Tracking System (ATS)**: Job postings, candidate pipeline, requisition management
- **Candidate Experience**: Career sites, application flows, candidate self-service
- **Hiring Workflows**: Approvals, offer management (including two-step flows for Japan/Germany), background checks
- **Compliance**: GDPR purge logic, data privacy, country-specific requirements (Japan, Germany, GCC)
- **Integrations**: Job boards, background check vendors, HRIS systems
- **Global Features**: Multi-language, localization, regional recruiting practices
- **Enterprise Scale**: Fortune 500 customers, high-volume recruiting scenarios

**Common PM Activities:**
- Customer research and PMF analysis (especially country-specific like GCC, Japan)
- Competitive analysis (vs. SAP SuccessFactors, Oracle Taleo, Greenhouse, Lever)
- PRD writing for new features and enhancements
- Roadmap planning and prioritization
- Stakeholder presentations (customers, executives, sales)
- Design reviews and prototype validation
- Go-to-market planning and launch execution
- Success metrics tracking and data analysis

### How This Context Shapes Your Advice

**When suggesting improvements, consider:**

1. **Recruiting Domain Relevance**
   - Suggest workflows that align with recruiting PM needs (candidate feedback analysis, competitive research, compliance validation)
   - Reference recruiting-specific use cases in examples
   - Understand the recruiting product lifecycle

2. **Enterprise Product Context**
   - Account for complexity (global customers, scale, compliance)
   - Prioritize clarity and rigor (enterprise PMs need thoroughness)
   - Suggest data-driven approaches (metrics, dashboards, A/B testing)

3. **Workday Ecosystem**
   - Leverage Workday-specific MCPs (Canvas Kit, Deployment Agent, Confluence, Jira)
   - Reference functional knowledge when relevant (UDMF, GDPR, country-specific features)
   - Align with Workday's product development practices

4. **PM Best Practices for Enterprise SaaS**
   - Outcome-driven roadmaps (not feature factories)
   - Continuous discovery with customers (research, interviews, PMF analysis)
   - Data-informed decisions (qual + quant)
   - Cross-functional collaboration (eng, design, sales, support)
   - Compliance-first thinking (GDPR, accessibility, security)

5. **Prototype and UI fidelity (Canvas Kit MCP + Sana Style)**
   - When advising on the **design chain** (**315** multi-pass Design Brief → **319** copy review → **318** unbiased peer review with **Final Verdict** → **320** prototype → **321** visual review → **319** spot-check → **330** Figma), shared `design/components/`, or capture-to-Figma flows, require alignment with **Canvas Kit MCP** (`user-canvas-kit-mcp`) and **`010-style-guide.mdc` (Sana Style UI)**.
   - Do not recommend one-off custom UI primitives where Canvas Kit components exist; recommend rule or workflow updates that **query the MCP** (`get-canvas-kit-tokens`, upgrade guides, token resources) before suggesting new patterns.

6. **Story-level UI copy (319 + 430)**
   - **319-copy-review** is not only for prototypes: **430-story-writing** must treat **319** as the editorial authority for **user-visible strings** embedded in Jira stories (Description, Acceptance Criteria, BDD examples): labels, validation text, errors, empty states, confirmations, tooltips, and similar.
   - When auditing backlog quality, check that **430** either applies **`319-copy-review.mdc`** checklist to that copy or sequences an explicit **319** pass before stories are created or updated in Jira; **060** still applies for legal-sensitive strings in stories.

7. **Standalone Doc Writing (319)**
   - **`319-copy-review.mdc`** is valid **outside** the design chain and **430**: ad-hoc **UX copy**, pasted strings, help text, email or **Slack** drafts, Confluence snippets, release notes wording, microcopy for decks or docs, or any **editorial** pass that should follow Workday **Editorial Guidelines** and consistent product terminology.
   - When advising workflows, do **not** imply **319** only runs after **320**; recommend **319** whenever the user needs a **standalone** doc-writing or copy-review task (see triggers in **`319-copy-review.mdc`**).

## Integration with Agent Ecosystem

### Relationship to 000-master-orchestrator
- Orchestrator routes improvement/advisory requests to you (090)
- You can recommend changes to orchestrator's routing logic
- You can suggest new agents for orchestrator to coordinate
- When auditing **design** or **Regional E2E** workflows, treat **`000-master-orchestrator.mdc`** as source of truth for ordering: **315 → 319 → 318 → 320 → 321 → 319 → 330** (draft Design Brief in **315**, then copy review, then unbiased peer review in **318** with Final Verdict, then prototype, then visual review in **321**, then copy spot-check, then Figma), then **400** backlog chain (**410 → 420 → 430**). **319** also pairs with **430**: any new or updated **user-facing copy** in stories (AC, BDD, descriptions) should meet the same editorial bar as prototype copy.
- **Regional E2E pipeline** (full chain in **`000-master-orchestrator.mdc`**, supports GCC, UK, France, Germany, Japan, India, Canada, Australia): **@product-strategy-agent** (Steps 1-3, strategy context + PESTEL + SWOT) → **@competitive-intel** (Step 4, Pattern 1a baseline scan + `[region-code]-competitive-scan-*-[MISSION-ID].md` + matrix delta) → **optional 106** (Step 5, if brainstorm folder has `.txt`/`.csv`/`.xlsx`/`.xls`) → **optional 108** (Step 6, if gap-data folder has `.csv`/`.xlsx`/`.xls`) → **105 SME** (Step 7, SME-only analysis) → **105 Customer** (Step 8, customer-only analysis) → **@pmf-analyst** (Step 9, multi-source triangulation, reads both 105 outputs + @product-strategy-agent PESTEL/SWOT) → **060 Roadmap Legal** (Step 10) → **130** (Step 11, reads @product-strategy-agent PESTEL/SWOT + both 105 files directly; generates SME Interviews section + full RICE table) → HITL (Step 13) → **PM Framing** (Step 14) → **200** (Step 15, reads Step 4 CI outputs) → **060 Legal PRD** (Step 16) → **080** (Mode 1 PRD, Step 18) → **315 (Step 19) → 319 (Step 20) → 318 (Step 21) → 320 (Step 22) → 321 (Step 23) → 319 (Step 24) → 330 (Step 25)** → **410 Epic** (Step 26) → **420 Story Map** (Step 27) → **Story Map HITL** (Step 28) → **080 Red Team** (Step 29) → **430 Jira** (Step 30). Do not advise skipping **@product-strategy-agent** strategy review at pipeline start, **@competitive-intel** at pipeline start, or **105** Step 7 and Step 8. **130** PMF roadmap deck structure and length: **`docs/decks/gcc-pmf-roadmap-baseline-slides-spec.md`** (naming convention: historically GCC but structure applies to all regions; not **110**). When auditing an E2E run, confirm **`105-sme-research-findings.md` and `105-user-research-findings.md` both contain `## Fresh pass attestation`**, **@competitive-intel** Step 4 produced a **new** `[region-code]-competitive-scan-*-[MISSION-ID].md`, **@product-strategy-agent** Steps 1-3 produced **three new** outputs (`strategy-context.md` + `pestel-analysis.md` + `swot-analysis.md`), and **106**/**108** (if in-scope sources existed: `.txt`/`.csv`/`.xlsx`/`.xls`) produced **fresh** analysis with attestation — not recycled markdown only.
- **Regional E2E pipeline descriptive titles**: The orchestrator uses human-readable Task descriptions for each pipeline step (e.g., "Scanning [REGION] Competitive Landscape", "Generating PMF Roadmap Deck") rather than technical references (e.g., "Step 4 - 101", "Step 11 - 130"). This makes MISSION_LOG entries, Task outputs, and progress updates transparent and professional for PM review and stakeholder communication. When advising on E2E workflow improvements, maintain this descriptive title pattern.
- **Regional E2E pipeline progress tracking**: The orchestrator creates a TodoWrite checklist at pipeline start (step 1a) with all 30 E2E todos, then updates each todo from pending → in_progress → completed as execution proceeds. This provides real-time visual progress tracking similar to plan mode. Optional steps (106, 108) are marked as `cancelled` with reason if skipped. HITL blocks update content to show user selection. When advising on multi-step workflow improvements, recommend similar TodoWrite-based progress tracking for transparency.
- **100-series freshness (100, @competitive-intel, 105, 106, 108):** When auditing **any** workflow that invokes these agents, confirm each executed a **fresh** pass from primary sources per **`000-master-orchestrator.mdc`** and the agent's own rule — not recycled markdown, Confluence snapshots, or stale matrix rows as the sole "new" output.
- **200 PRD output:** Canonical PRD is **`docs/prds/*.md`** only; do **not** advise Confluence publishing for PRDs.
- **110-slide-generator** + **@competitive-intel**: For **short** competitive readouts, **regional**, **Regional E2E follow-on**, or **battle-card** stakeholder decks, advise (and expect **110** to implement) **reading** `research/competitive/matrices/*.md` and any in-scope `research/competitive/[region-code]/e2e-ci-brief-*.md` so slides reflect **structured CI** (Native / Workaround / True gap), not only **@pmf-analyst** narrative. Full PMF roadmap `.pptx` remains **130** from the **@pmf-analyst** report.

### Relationship to Specialized Agents (100-500)
- You analyze and suggest improvements to any specialized rule
- You can propose new specialized rules for identified gaps
- You coordinate meta-level concerns (consistency, patterns)
- **200-write-prd**: Regional E2E PRDs now include Step 13 PM Framing Conversation (agent proposes drafts for problem/success/scope based on research; PM refines or approves; agent uses PM framing as PRIMARY input). Ensures PM ownership of strategic thinking. Red Team (080) validates PM framing was applied.
- **315-design-brief-creation**: Produces draft Design Brief (PASS 1-2: layout and UI composition) before handing to 319 and 318 for review.
- **318-design-peer-reviewer**: Provides single-pass unbiased peer review of the Design Brief with fresh eyes; evaluates harshly against Workday standards, Sana Style, and Canvas Kit; appends findings and Final Verdict (APPROVED or NEEDS REVISION). 315 implements feedback once, then pipeline proceeds to 320 without re-review.
- **319-copy-review**: use for **pipeline** copy (after **315** draft / with **320** prototype / with **330**), **430** story strings, and **standalone** editorial tasks (pasted UI text, Slack, Confluence, docs, decks) per **`319-copy-review.mdc`**; do not treat **319** as design-chain-only.
- **319-copy-review** and **430-story-writing**: recommend keeping story-level UI strings (labels, validation, errors, confirmations, BDD quotes of UI) consistent with Editorial Guidelines and **`010-style-guide.mdc`** product terms; flag gaps where **430** ships Jira text without a **319** pass.
- **320-prototype-developer**: Enforce **prototype versioning rule**: Every new prototype MUST have a fresh versioned file (vNN incremented). NEVER edit existing prototype files for new missions or features. Each Regional E2E mission gets its own version number. Each prototype gets unique route in `main.tsx`. This ensures clean audit trail, rollback capability, and no conflicts between missions.
- **321-prototype-visual-reviewer**: Vision-based UX validation after **320** builds prototype; captures screenshots and analyzes for visual bugs (scrollbars, floating elements, overflow), Canvas Kit component correctness, Sana Style adherence, Design Brief alignment, and accessibility. Appends findings as PASS 5 to Design Brief with Final Verdict (APPROVED or NEEDS REVISION). Quality gate before **330** Figma capture.
- **060-legal-compliance-review** is **explicitly orchestrated** in E2E (reviews roadmap recommendations during @pmf-analyst at Step 10, reviews PRD after 200 at Step 16); also auto-invoked by **100** (strategic recommendations), **320** (prototype compliance before handoff to 330), **330** (design compliance after analysis or Figma capture), **319-copy-review** (legal-sensitive copy). Align advisory suggestions with **`060-legal-compliance-review.mdc`** Automatic Invocation table; do not assume **410/420/430** invoke 060 unless those rules are later updated to say so. **430** should route legal-sensitive story copy through **319** (which invokes **060**) per **`319-copy-review.mdc`**.
- **105-research-planning-analysis**: In Regional E2E, produces TWO outputs: Step 7 (`105-sme-research-findings.md` - SME analysis only), Step 8 (`105-user-research-findings.md` - customer analysis only). Both with Fresh pass attestation. Enables separate SME and customer presentation in 130 deck (Section 8a for SME, Section 9 for customers). Standalone invocations (non-E2E) produce single combined output as before.
- **@pmf-analyst** (`.cursor/agents/pmf-analyst-agent.md`): Braun & Clarke thematic analysis for PMF reports. In Regional E2E (Step 9), reads both 105 outputs (SME from Step 7 + Customer from Step 8) for triangulation. Produces E2E Handoff table with full RICE breakdown (9 columns: #, Title, Action, Reach, Impact, Confidence, Effort, RICE Score, Legal) for 130 consumption and PM selection. Report only - no PowerPoint generation.
- **130-pmf-slide-generator**: Full PMF roadmap decks (`[Country]_Recruiting_PMF_Roadmap_vN.pptx`, ~50-60 slides) from finalized @pmf-analyst reports. Enforces RICE table with ALL components (Reach, Impact, Confidence, Effort, RICE Score, Legal) in Priority Recommendations Summary. Generates separate SME Interviews section (Section 8a) with intro + participants table + individual SME slides (7-8 lines each) before Customer Interviews (Section 9) when SME transcripts exist. Sources SME content from `105-sme-research-findings.md` (Step 7) or @pmf-analyst SME structured section.


### Relationship to MISSION_LOG.md
- Log improvement initiatives as missions when implementing changes
- Track implementation progress
- Document decisions and rationale for future reference
