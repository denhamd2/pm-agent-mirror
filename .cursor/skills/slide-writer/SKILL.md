# Slide Writer Skill

Transforms research findings and technical content into executive-ready slide copy with VP-appropriate language, tone, and clarity.

## When to Use This Skill

Use when creating slide content for:
- PMF roadmap decks (invoked by 130-pmf-slide-generator)
- Executive briefings (invoked by 110-slide-generator)
- Strategic presentations for VP/SVP audiences
- Any slide deck requiring executive-ready language

Trigger via: `/slide-writer` command or when 110/130 rules reference it during content drafting

## Target Audience

**VP of Product Management for Workday Recruiting**

They need:
- High-level strategic insights (not raw data dumps)
- Clear business impacts (ARR, win rates, time-to-fill, adoption)
- Actionable recommendations (not implementation details)
- Fast comprehension (understand in 10 seconds or less)

They do NOT need:
- Technical jargon or system terminology
- Research methodology details (save for speaker notes)
- Overly granular data points
- Implementation or workflow details

## Core Principles

### 1. Simplicity & Accessibility

**Use plain, everyday language:**
- Write so any non-technical stakeholder (HR, finance, exec) can understand immediately
- Optimise for fast comprehension, not technical precision
- Avoid technical jargon, internal terminology, or niche product terms unless absolutely necessary
- If technical terms are required, simplify or clarify them inline

**Prefer simple words over complex ones:**
- "Use" instead of "utilise" or "leverage"
- "Improve" instead of "optimise" 
- "Help" instead of "facilitate"
- "Show" instead of "demonstrate"
- "Build" instead of "develop" or "implement"
- "Need" instead of "require"

**Avoid abstract or corporate phrasing:**
- Replace "enhance candidate engagement" with concrete language like "help candidates complete applications faster"
- Replace "facilitate stakeholder alignment" with "align teams on priorities"
- Focus on what is actually happening in simple terms

**Keep sentence structures short and direct:**
- One idea per sentence
- Avoid combining multiple ideas into one sentence
- Break complex statements into 2-3 shorter sentences

### 2. Executive Tone (Concise, Decisive, Conclusion-Led)

**Maintain professional executive tone:**
- Concise and decisive language
- Conclusion-first structure (cause → impact → implication)
- Strategic framing (business outcomes, competitive positioning)
- Data-driven assertions

**Do NOT make tone casual or informal:**
- Keep professional product management language
- Use market analysis terminology appropriately
- Focus on business outcomes and strategic value
- The goal is simple AND sharp, not simplistic

### 3. Workday Context

**Frame in Workday's enterprise SaaS model:**
- Suite adjacency (Recruiting + HCM + Talent)
- Global compliance requirements (GDPR, DPDP, AI Act)
- Enterprise scale (thousands of reqs, high-volume hiring)
- Competitive positioning (vs SAP, Oracle, regional specialists)

### 4. Density Preservation (Minimum Floors)

While simplifying language, you must maintain substantive executive density:
- **Never** reduce a bullet below its slide-type minimum character floor (e.g., 160 chars for PESTEL, 140 for SME).
- If simplification drops a bullet below the floor, you MUST enrich it by combining with adjacent context or adding concrete details from the research.
- **Mandate:** Every bullet MUST contain at least one concrete anchor: a number, a date, a named entity, a participant reference, or a clear cause-impact relationship. Do not leave vague, abstract statements.

### 5. Clarity Check (Pre-Finalisation Validation)

Before producing final slide content, ensure:
- Content can be understood in under 10 seconds
- A non-technical stakeholder could repeat the key message
- No sentence requires re-reading to understand
- Language is simple, direct, and unambiguous

## Language Transformation Patterns

### Pattern 1: Research Findings → Executive Insight

**Research language (technical, detailed):**
> "MeitY notified the Digital Personal Data Protection Rules, 2025 on 13 November 2025 with phased commencement: 13 November 2026 for consent manager registration (Rule 4) and 13 May 2027 for core obligations including notice, consent, security, retention, rights, and cross-border transfer rules per Hogan Lovells and JDSupra summaries."

**Executive language (simple, impact-focused):**
> "India's data privacy law takes effect May 2027, requiring consent and retention controls for candidate data; Workday must ship configurable notice patterns before enforcement."

**Transformation steps:**
1. Extract the core fact (law, date, requirement)
2. Remove methodology citations (move to speaker notes)
3. State business impact simply
4. Use active voice, present tense where possible

---

### Pattern 2: Technical Gaps → Business Problems

**Research language:**
> "Native UIDAI Aadhaar eKYC integration is not present in core product; customers must implement partner APIs or offline verification workflows with manual reconciliation steps."

**Executive language:**
> "India government ID verification requires partner integrations; native support would reduce implementation effort and improve candidate experience."

**Transformation steps:**
1. State the gap simply (what's missing)
2. Explain business consequence (time, cost, experience)
3. Avoid system architecture terminology

---

### Pattern 3: Competitive Intelligence → Market Position

**Research language:**
> "Competitive matrix analysis reveals True Gaps on native +91 SMS and WhatsApp core UI per validation via Pattern 1a baseline scan; Darwinbox and Keka demonstrate channel posting with INR-tier bundling strategies."

**Executive language:**
> "India specialists lead on SMS and WhatsApp messaging; Workday relies on partner workarounds. This creates implementation friction in high-volume hiring."

**Transformation steps:**
1. Name competitors simply (no methodology)
2. State capability gap clearly
3. Explain customer impact
4. Remove internal process references (Pattern 1a, validation, etc.)

---

### Pattern 4: Customer Quotes → Actionable Insights

**Research language (verbatim quote):**
> "Supervisory organisation selection stayed unclear from the business at scale, so teams used random tags and operations pushed back on data quality." (P1, Teleperformance India)

**Executive language (synthesised insight):**
> "Unclear requisition metadata forces manual corrections at scale; data quality issues cascade to reporting and approvals. (P1, Teleperformance)"

**Transformation steps:**
1. Preserve attribution format: (P1, Company)
2. Convert quote to insight statement
3. State the problem simply
4. Show the cascade/impact
5. Keep to 1-2 sentences maximum

---

### Pattern 5: PESTEL Factors → Strategic Implications

**Research language (dense, academic):**
> "Political emphasis on formal job creation, GCC expansion, and digital public infrastructure shapes buyer expectations for scale, auditability, and statutory adjacency from hiring through payroll and benefits narratives. Employers expect hiring platforms to support audit trails that survive ministry and works-council-style scrutiny as formalisation accelerates."

**Executive language (simple, clear):**
> "India's focus on formal job creation drives demand for audit-ready hiring systems; employers need defensible data trails for government reviews as labour codes fully roll out."

**Transformation steps:**
1. Lead with the policy/trend simply
2. State buyer expectation clearly
3. Connect to product requirement
4. Remove nested clauses and academic phrasing

---

## Prohibited Language (MANDATORY)

**NEVER use in slide content:**
- Agent terminology: "agent", "rule", "model", "generation", "output", "pipeline", "orchestrator", "MCP", "invoke", "prompt", "E2E", "HITL", "handoff", "workflow", "pass", "attestation"
- Research methodology: "Phase 1", "triangulation" (unless in methodology slide), "validation via", "Pattern 1a", "baseline scan"
- System terminology: "business process", "tenant", "implementation", "configuration" (unless unavoidable)
- Technical research terms: "semi-structured interviews", "thematic coding", "n = 5 participants"

### Regex-Enforced Prohibited Patterns (MANDATORY - checked by validator)

These patterns are programmatically validated by `scripts/validate_slide_spec.py`. The model MUST also catch them during content drafting:

| Pattern | What it catches | Fix |
|---------|----------------|-----|
| `\b0[0-9]{2}\b` | Rule number references (060, 130, etc.) | Replace with descriptive term: "060" → "legal review", "130" → remove |
| `HRREC-\d+` | Jira ticket IDs | Remove entirely from slide body; move to speaker notes if needed |
| `\bDeployment Agent\b` | MCP tool name | "compliance validation" or "platform verification" |
| `\bDA thread` | MCP abbreviation | "compliance check" or remove |
| `\bvalue-metrics\b` | Skill reference | "metrics framework" or "success metrics" |
| `\bPMF\b` | Research methodology acronym | "product-market fit" (spelled out) or "market readiness" |
| Real participant names | SME name leaks (e.g. "Santosh") | Use SME1, SME2, SME3 etc. |

**Common leakage sources** (pay extra attention here):
- SME interview slides: internal references to "060 guidance", "DA alignment", "Deployment Agent" leak from research notes
- Recommendation slides: "HRREC-NNNNN" Jira IDs and "per value-metrics notes" leak from metric skill outputs
- Theme slides: Real SME names leak from analysis narratives (must anonymise to SME1-SME5)

**Use in speaker notes only** (not slide bullets):
- Methodology details
- Source citations with full paths
- Research protocol references
- Triangulation notes
- Jira ticket IDs (HRREC-NNNNN format)

---

## Transformation Workflow

### Step 1: Extract Key Facts
From research content, identify:
- Core fact or finding
- Business impact or consequence
- Stakeholder affected (customer, Workday, candidate)
- Competitive context (if applicable)

### Step 2: Simplify Language
Apply simplicity rules:
- Replace complex words with simple equivalents
- Break long sentences into shorter ones
- Remove nested clauses
- Use active voice

### Step 3: Add Context
Frame with Workday context:
- Enterprise SaaS positioning
- Compliance requirements (GDPR, DPDP, etc.)
- Competitive differentiation
- Strategic priorities (Q2 goals, OKRs, regional focus)

### Step 4: Validate Clarity
Run clarity check:
- Can a non-technical stakeholder understand in 10 seconds?
- Could they repeat the key message?
- Does any sentence require re-reading?
- Is language simple, direct, unambiguous?

### Step 5: Preserve Density Standards
Ensure transformed content meets density limits:
- Character counts per bullet type
- Total rendered lines per slide
- Bullet count caps
- Product implication word limits

**Critical**: Language transformation must NOT violate density rules from 110/130. Simplifying language often reduces character count, which is beneficial.

---

## Example Transformations

### PESTEL Political Factor

**Before (research language - 167 chars, too dense):**
> "India's consolidated labour codes, including the Industrial Relations Code, were widely reported as notified with implementation discussion into 2026 (Bar and Bench, Economic Times, labour.gov.in). Fixed-term employment parity rules raise the need for contract tracking."

**After (executive language - 128 chars, clearer):**
> "India's labour codes create contract tracking needs; fixed-term employment rules drive audit and compliance requirements for hiring systems."

**Character savings**: 39 chars (23% reduction)
**Clarity improvement**: Removed citations, simplified structure, made impact explicit

---

### Customer Interview Insight

**Before (verbatim quote - 142 chars):**
> "Duplication automation is the number one ask; match on Aadhaar, not only email and phone, because candidates vary those identifiers." (P5, Teleperformance India)

**After (synthesised insight - 115 chars):**
> "Manual duplicate checking is the top pain point; candidates change email and phone, requiring government ID matching. (P5, Teleperformance)"

**Character savings**: 27 chars (19% reduction)
**Clarity improvement**: Converted quote to insight, stated problem simply, kept attribution

---

### Recommendation Problem Statement

**Before (research language - 156 chars):**
> "Agency-heavy India programmes lose fee integrity when duplicates pass and last-approved upload wins attribution; thousands of daily vendor uploads make manual checks full-time roles."

**After (executive language - 118 chars):**
> "Thousands of daily agency uploads create duplicate candidates; manual checking is now a full-time role, and fee disputes arise."

**Character savings**: 38 chars (24% reduction)
**Clarity improvement**: Simple problem statement, clear business impact, no jargon

---

### SWOT Strengths

**Before (technical, dense - 198 chars):**
> "Enterprise suite hire-to-pay coherence for MNCs and GCCs; Configurable privacy retention purge with Legal programme design; UDMF plus BGV business process and named partners for Know Your Candidate."

**After (executive, clear - 145 chars):**
> "Full hiring-to-payroll suite for enterprise; configurable privacy and data retention; native duplicate detection and background check partnerships."

**Character savings**: 53 chars (27% reduction)
**Clarity improvement**: Removed jargon (UDMF, BGV business process), simplified terms, clearer structure

---

## Integration with 110 and 130

### 110 Integration (Short Decks)

**When 110 is drafting slide content** (after framework selection, before writing JSON):

1. For each slide bullet/text box content
2. Apply transformation patterns above
3. Validate clarity (10-second test)
4. Ensure density limits maintained
5. Move technical details to speaker notes

**110 still controls:**
- Framework selection (Hero's Journey, Pyramid Principle, etc.)
- Section structure and flow
- Layout variety and visual design
- Chart/table specifications
- HITL questions for audience/purpose

### 130 Integration (PMF Roadmap Decks)

**When 130 is drafting slide content** (after reading all sources, before writing JSON):

1. For each section (PESTEL, Customer, Themes, Recommendations)
2. Apply transformation patterns above
3. Validate clarity per section type
4. Ensure density limits maintained (7-line targets, character caps)
5. Move methodology/citations to speaker notes

**130 still controls:**
- Section structure (Executive Summary → PESTEL → Win/Loss → SME → Customer → Themes → Recommendations)
- Density validation (PRE-GENERATION checks)
- Typography standards (14pt default, 12pt dense slides)
- Bullet count caps (4 PESTEL, 4 Exec Summary, etc.)
- Product implication formatting (12pt bold, FFFF00 highlight)
- SWOT/table specifications

---

## Quality Standards

### Always ✅
- Use plain, everyday language
- Prefer simple words (use, improve, help, show, build, need)
- Keep sentences short and direct (one idea per sentence)
- Validate 10-second comprehension test
- Frame in Workday enterprise SaaS context
- Maintain professional executive tone (not casual)
- Preserve density limits from 110/130 rules
- Move technical details to speaker notes
- Remove prohibited agent/research terminology

### Never ❌
- Use technical jargon without clarification
- Include research methodology in slide bullets
- Reference internal processes (agents, pipelines, validation patterns)
- Make tone casual or informal
- Violate density rules from 110/130
- Include citations in bullet text (move to speaker notes)
- Use complex, nested sentence structures
- Write content requiring re-reading to understand

---

## Validation Checklist

Before finalising any slide content:

- [ ] **Simplicity**: Plain language used throughout; no unnecessary jargon
- [ ] **Word choice**: Simple words preferred (use vs utilise, improve vs optimise)
- [ ] **Sentence structure**: Short, direct sentences; one idea each
- [ ] **Comprehension**: Can be understood in under 10 seconds
- [ ] **Repeatability**: Non-technical stakeholder could repeat key message
- [ ] **Clarity**: No sentence requires re-reading
- [ ] **Tone**: Professional, executive-appropriate (not casual)
- [ ] **Context**: Framed in Workday enterprise SaaS positioning
- [ ] **Density**: Character counts and line limits from 110/130 preserved
- [ ] **Prohibited terms**: No agent/pipeline/research methodology language

---

## Usage Modes

### Mode 1: Invoked by 110 (Short Decks)

**When**: 110 is drafting slides for executive briefings, competitive readouts, PRD summaries

**Process**:
1. 110 selects framework and structures content
2. 110 invokes `/slide-writer` for language transformation
3. Skill applies simplicity guidelines to each bullet
4. Returns executive-ready content to 110
5. 110 validates density and writes JSON

### Mode 2: Invoked by 130 (PMF Roadmap Decks)

**When**: 130 is transcribing @pmf-analyst report into slide spec

**Process**:
1. 130 reads all sources (PESTEL, SWOT, themes, recommendations)
2. 130 invokes `/slide-writer` section by section
3. Skill transforms research language → executive language
4. Returns simplified content to 130
5. 130 validates density (PRE-GENERATION checks) and writes JSON

### Mode 3: Standalone (Ad Hoc)

**When**: User needs to transform research text into slide-ready copy

**Process**:
1. User provides source content (research paragraph, technical description, etc.)
2. Invoke `/slide-writer` with content
3. Skill applies transformation patterns
4. Returns executive-ready bullet text with character count

---

## Integration Notes

- **Density rules live in 110/130**: Character limits, bullet caps, line targets remain in the rules
- **Template structure lives in 110/130**: Section flows, layout patterns, typography specs
- **Language transformation lives here**: Simplicity, clarity, executive tone
- **Validation happens here**: 10-second comprehension test, plain language check
- **Final assembly in 110/130**: Rules combine transformed content with density validation and JSON generation

---

## Examples by Slide Type

> **⚠️ DENSITY PRESERVATION WARNING**: The examples below demonstrate language simplification, but you MUST ensure the final character counts meet the minimum floors defined in 130 (e.g., 180 chars for PESTEL, 200 for Exec Summary). If simplification makes a bullet too short, you must enrich it with concrete data, dates, or named entities from the research to meet the floor.

### PESTEL Factor Bullet

**Research input (167 chars):**
> "India's consolidated labour codes, including the Industrial Relations Code, were widely reported as notified with implementation discussion into 2026. Fixed-term employment parity rules raise the need for contract tracking."

**Transformed output (128 chars):**
> "India's labour codes create contract tracking needs; fixed-term employment rules drive audit requirements for hiring systems."

**Validation:**
- ✅ Plain language (no "consolidated", "notified")
- ✅ Simple words (create, need, drive)
- ✅ Short sentences (two clauses, semicolon separator)
- ✅ Clear impact (what employers need)
- ✅ Meets 180-240 char density floor for PESTEL bullets per 130

---

### Executive Summary Bullet

**Research input (215 chars):**
> "Internal experts and Teleperformance India interviews converge on impersonation risk, resume fraud, weak duplicate signalling, India-specific offer and BGC flexibility, and document capture across funnel stages."

**Transformed output (158 chars):**
> "Customer and expert interviews align on identity fraud, duplicate detection gaps, and India offer flexibility needs; document capture and background checks need better workflow."

**Validation:**
- ✅ Simple words (align, needs, better vs converge, signalling, flexibility)
- ✅ Removed jargon (BGC → background checks)
- ✅ Clear structure (what they said; what's needed)
- ✅ Meets 200-250 char density floor for exec summary per 130
- ✅ 10-second comprehension: "Interviews found fraud and process gaps"

---

### Customer Interview Insight

**Research input (142 chars, verbatim quote):**
> "Duplication automation is the number one ask; match on Aadhaar, not only email and phone, because candidates vary those identifiers." (P5)

**Transformed output (121 chars):**
> "Duplicate detection is the top automation need; candidates change email and phone, requiring government ID matching. (P5, Teleperformance)"

**Validation:**
- ✅ Quote → insight statement
- ✅ Simple words (need vs ask, change vs vary)
- ✅ Clear problem (candidates change details)
- ✅ Clear solution (government ID matching)
- ✅ Attribution preserved
- ✅ Meets 180-220 char density floor for customer bullets per 130

---

### Recommendation Problem

**Research input (168 chars):**
> "Agency-heavy India programmes lose fee integrity when duplicates pass and last-approved upload wins attribution; thousands of daily vendor uploads make manual checks full-time roles."

**Transformed output (118 chars):**
> "Thousands of daily agency uploads create duplicate candidates; manual checking is now a full-time role, and fee disputes arise."

**Validation:**
- ✅ Simple problem statement (duplicates, manual work, disputes)
- ✅ No jargon (removed "fee integrity", "attribution")
- ✅ Clear business impact (full-time role needed)
- ✅ Short sentences
- ✅ Meets 160-220 char density floor for recommendation bullets per 130

---

### SWOT Quadrant

**Research input (198 chars):**
> "Enterprise suite hire-to-pay coherence for MNCs and GCCs; Configurable privacy retention purge with Legal programme design; UDMF plus BGV business process and named partners for Know Your Candidate."

**Transformed output (145 chars):**
> "Full hiring-to-payroll suite for enterprise clients; configurable privacy and data retention controls; native duplicate detection and background check partnerships."

**Validation:**
- ✅ Simple terms (hiring-to-payroll vs hire-to-pay coherence)
- ✅ Removed acronyms where possible (UDMF → duplicate detection, BGV → background check)
- ✅ Clear capabilities listed
- ✅ Professional tone maintained
- ✅ Character reduction (27% savings)

---

## Word Substitution Guide

Common research terms → Executive equivalents:

| Research Term | Executive Equivalent |
|---------------|---------------------|
| Utilise, leverage | Use |
| Optimise | Improve |
| Facilitate | Help, enable |
| Demonstrate | Show |
| Implement, develop | Build |
| Require | Need |
| Consolidated | Combined (or remove) |
| Notified | Announced, issued |
| Convergence | Alignment, agreement |
| Signalling | Detection, indicators |
| Coherence | Integration, connection |
| Attribution | Credit, tracking |
| Orchestration | Management, workflow |
| Adjacency | Connection, related areas |
| Parity | Equivalence, match |
| Formalisation | Adoption, rollout |
| Scrutiny | Review, oversight |
| Proportionate | Appropriate, balanced |

---

## Clarity Check Protocol

**For every slide** (before finalising):

1. **Read bullet aloud**: Does it sound natural?
2. **10-second test**: Could VP grasp meaning in one quick scan?
3. **Repeat test**: Could non-technical exec repeat the key point?
4. **Re-reading test**: Any sentence need second pass?
5. **Jargon check**: Any terms need simplification?

**If ANY test fails**: Rewrite the bullet using transformation patterns above.

---

## Notes

- **This skill does NOT change density rules**: Character limits, bullet caps, line targets remain in 110/130
- **This skill does NOT change structure**: Section flows, layouts, typography specs remain in 110/130
- **This skill transforms language ONLY**: Research → Executive, Technical → Simple, Dense → Clear
- **Validation is dual**: Clarity check (here) + Density validation (110/130)
- **Speaker notes are key**: Move technical details, citations, methodology there

**Remember**: Simple AND sharp, not simplistic. The goal is fast comprehension with professional executive tone.
