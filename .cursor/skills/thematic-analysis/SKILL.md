# Braun & Clarke Thematic Analysis Skill

Applies Braun & Clarke (2006) 6-phase thematic analysis method to qualitative data (interview transcripts, customer feedback, survey responses).

## When to Use This Skill

Use when you need to:
- Analyze customer interview transcripts for themes
- Synthesize qualitative research data (PMF studies, user research)
- Identify patterns across multiple data sources
- Structure unstructured qualitative feedback

Trigger via: `/thematic` command or when performing qualitative research analysis (105-user-researcher, 120-pmf-thematic-analysis)

## Braun & Clarke 6-Phase Method

### Phase 1: Familiarization with the Data

**Objective**: Immerse yourself in the data to understand the complete picture.

**Actions**:
1. Read ALL data sources completely (don't skim)
2. Read multiple times if needed
3. Take initial notes on patterns you observe
4. Understand context (who said what, when, why)

**For Workday Recruiting**:
- Read customer interview transcripts (`.txt` files)
- Read SME interview transcripts (internal experts)
- Read CSV data (Opportunity Detail, Idea Responses)
- Understand participant context (company size, industry, role)

**Output**: Deep familiarity with dataset; initial observations

### Phase 2: Generating Initial Codes

**Objective**: Create shorthand labels that capture semantic meaning in the data.

**Coding Approach**:
- **Semantic coding**: Capture meaning, not just keywords
- **Shorthand labels**: Use PM-friendly codes (e.g., "UI-Complexity", "WhatsApp-Gap", "Bulk-Actions-Need")
- **Stay close to data**: Code what's there, not what you expect
- **Code systematically**: Go through data source by source
- **Source tagging**: Mark each code with [SME], [Customer], [CSV], [Ideation], [GapData]

**Example Codes from GCC Recruiting Research**:
- "WhatsApp-Preferred-Channel" [Customer]
- "Email-Low-Response" [Customer]
- "Nitaqat-Reporting-Manual" [SME] [GapData]
- "Candidate-Duplicate-Frustration" [Customer]
- "Interview-Scheduling-Friction" [SME] [Customer]
- "Mobile-Apply-Broken" [Customer]
- "Paradox-Underutilized" [SME]

**Frequency Count**: Track how many times each code appears across data sources

**Output**: 30-100+ codes with frequency counts, source tags, example quotes

### Phase 3: Generating Themes

**Objective**: Cluster codes into broader, higher-level themes that tell a story.

**Theme Requirements**:
- **Substantial**: Captures significant pattern (not isolated code)
- **Coherent**: Codes within theme relate logically
- **Distinct**: Themes are separable (not overlapping)
- **Relevant**: Addresses research question (e.g., PMF, user needs)

**Process**:
1. Print all codes (or list them visually)
2. Group related codes together
3. Name each group (candidate theme)
4. Iterate: Move codes, merge themes, split themes

**Example Theme Clustering** (GCC Recruiting):

**Theme: Communication Channel Gaps**
- Codes: WhatsApp-Preferred-Channel, Email-Low-Response, SMS-Unreliable, LINE-Request
- Why together: All about how recruiters reach candidates

**Theme: Compliance & Localization**
- Codes: Nitaqat-Reporting-Manual, Arabic-RTL-Issues, Government-Portal-Gap, GDPR-Confusion
- Why together: All about local compliance and regional requirements

**Output**: Initial thematic map (4-8 candidate themes), codes grouped under themes

### Phase 4: Reviewing Themes

**Objective**: Validate themes at two levels and refine.

**Level 1 - Coded Data Extracts**: 
- Review all codes within each theme
- Check: Do codes form a coherent pattern?
- Action: Move misfit codes to other themes or create new themes

**Level 2 - Entire Dataset**:
- Re-read full transcripts with themes in mind
- Check: Do themes accurately represent the data?
- Check: Are there themes you missed (not coded yet)?
- Action: Refine theme boundaries, add missing themes

**Triangulation** (when multiple data sources):
- Compare SME vs. Customer perspective on each theme
- Identify convergence (both sources agree) vs. divergence (sources disagree)
- Assess evidence strength (quotes, frequency, intensity)

**Triangulation Matrix Format**:

| Theme | SME View | Customer View | Convergence | Divergence | PMF Impact |
|-------|----------|---------------|-------------|------------|------------|
| [Theme Name] | [SME perspective + quote] | [Customer perspective + quote] | [Where they align] | [Where they differ] | [What this means for PMF] |

**Output**: Refined thematic map (3-6 robust themes), triangulation matrix

### Phase 5: Defining and Naming Themes

**Objective**: Clearly define what each theme means and name it descriptively.

**For Each Theme**:
- **Theme Name**: Descriptive, captures essence (3-5 words)
- **Description**: What this theme is about (2-3 sentences)
- **Scope**: What's included and excluded
- **PMF Implication**: What this means for product-market fit

**Good Theme Names**:
- "Communication Channel Fragmentation" (not "Messaging Issues")
- "Localization and Compliance Burden" (not "GCC Problems")
- "Interview Coordination Friction" (not "Scheduling Complaints")

**Bad Theme Names**:
- "Pain Points" (too vague)
- "Feature Requests" (not thematic)
- "GCC" (geographic, not thematic)

**Output**: Fully defined themes with clear scope and PMF implications

### Phase 6: Producing the Report

**Objective**: Write a comprehensive, actionable analysis report.

**Report Structure**:

```markdown
# [Country/Topic] Thematic Analysis Report

**Date**: [YYYY-MM-DD]
**Analyst**: [Agent name]
**Data Sources**: [List: transcripts, CSVs, etc.]
**Participant Count**: [N SMEs, M Customers]

## Executive Summary
[3-5 key takeaways in bullet form]

## Methodology
[Braun & Clarke 6-phase method; data sources; participant anonymization note]

## Triangulation Matrix

| Theme | SME View | Customer View | Convergence | Divergence | PMF Impact |
|-------|----------|---------------|-------------|------------|------------|
[One row per theme]

## Themes

### Theme 1: [Name]

**Description**: [2-3 sentences defining the theme]

**Evidence Strength**: [High/Medium/Low] - [N codes, M sources]

**Triangulation Analysis**:
- **SME Perspective**: [What SMEs said + quote]
- **Customer Perspective**: [What customers said + quote]
- **Convergence**: [Where they align]
- **Divergence**: [Where they differ]

**High-Intensity Quotes**:
> "Quote 1" - P1 (Company), Job Title
> "Quote 2" - P3 (Company), Job Title

**Supporting Codes**:
- Code-Name-1 (Frequency: N) [Source]
- Code-Name-2 (Frequency: M) [Source]

**PMF Impact**: [What this means for product-market fit in 1-2 sentences]

**Product Roadmap Impact**:
- [Specific feature/change recommended]
- [RICE score if applicable]

[Repeat for each theme]

## Cross-Theme Insights
[Patterns across themes; overarching insights; strategic implications]

## Product Roadmap Recommendations
[Prioritized list of recommendations with RICE scores]

## Appendix
[Codebook, participant details, data sources]
```

## Quality Standards for Thematic Analysis

### Rigor
- [ ] All data sources read completely
- [ ] Systematic coding (every relevant segment coded)
- [ ] Themes reviewed against full dataset
- [ ] Triangulation performed when multiple sources
- [ ] High-intensity quotes included (vivid, illustrative)
- [ ] Evidence cited (transcript names, participant IDs, frequencies)

### Validity
- [ ] Themes are data-driven (not imposed from theory)
- [ ] Themes are distinct (minimal overlap)
- [ ] Themes are substantial (not trivial patterns)
- [ ] Triangulation shows convergence (not cherry-picked)

### Actionability (for PMF Analysis)
- [ ] Each theme has PMF implication
- [ ] Product recommendations are specific (not "improve UX")
- [ ] RICE scoring included for prioritization
- [ ] Strategic alignment noted (Business Impact)

## Integration with JTBD Framework

**Combine Thematic Analysis + JTBD for deeper insights:**

1. **Code for jobs, not features**:
   - Bad code: "Wants-Bulk-Actions"
   - Good code: "Job-Update-Many-Reqs-Quickly"

2. **Name themes as jobs**:
   - Bad: "Requisition Management Issues"
   - Good: "Job: Adapt Requisitions to Business Changes at Scale"

3. **Write theme descriptions in JTBD format**:
   "When recruiters face organizational changes (budget freezes, hiring manager departures), they need to update 20-100+ requisitions quickly to maintain workflow integrity. Current experience requires 1.5-2 hours of manual work. Desired outcome: Bulk updates in <5 minutes."

## Participant Anonymization Standards

**Mandatory for customer interviews**:
- Anonymize participant names as P1, P2, P3, etc.
- Preserve company name and job title
- Format: "P1 - Senior Recruiter, Accenture" or "P1 (Accenture)"

**SME interviews** (internal Workday experts):
- Use real names and roles (they're internal, not customer confidential)
- Format: "Bernie - VP of Talent Product Management, Workday"

**Apply consistently**: Reports, quotes, triangulation matrices, all documentation

## Common Pitfalls

### Pitfall 1: Coding Too Literally
❌ **Bad**: Code every mention of "WhatsApp" as "WhatsApp-Mention"
✅ **Good**: Code underlying job: "Job-Reach-Candidates-Preferred-Channel"

### Pitfall 2: Themes = Summary of Codes
❌ **Bad**: Theme "Communication Issues" with 20 codes listed
✅ **Good**: Theme "Recruiter-Candidate Communication Fragmentation" with narrative explaining the pattern

### Pitfall 3: Cherry-Picking Quotes
❌ **Bad**: Only include quotes that support your hypothesis
✅ **Good**: Include representative range; note divergence and outliers

### Pitfall 4: Too Many Themes
❌ **Bad**: 15 granular themes (overwhelming, loses forest for trees)
✅ **Good**: 3-6 robust themes (tells coherent story, actionable)

### Pitfall 5: Skipping Triangulation
❌ **Bad**: Combine all data sources without noting SME vs. Customer differences
✅ **Good**: Explicit triangulation matrix showing convergence and divergence

## Example Thematic Analysis Output

**Theme: Recruiter-Candidate Communication Fragmentation**

**Description**: Recruiters struggle to reach candidates using email-only communication, especially in regions where WhatsApp and SMS are preferred channels. This leads to low response rates (20-30% via email vs. 70-80% via WhatsApp in GCC), longer time-to-fill, and candidate drop-off.

**Evidence Strength**: High - 12 codes, 8 data sources, 4/5 customers mentioned

**Triangulation Analysis**:
- **SME Perspective**: SMEs observe WhatsApp preference across multiple GCC implementations; note Paradox workaround but limited adoption
- **Customer Perspective**: Customers report email response rates <30%; candidates ask "Why didn't you WhatsApp me?"
- **Convergence**: Both sources agree WhatsApp is critical for GCC candidate engagement
- **Divergence**: SMEs know Paradox workaround exists; customers unaware or unable to activate

**High-Intensity Quotes**:
> "We send 100 emails and get 20 responses. If we could WhatsApp them, we'd get 80 responses. It's that simple." - P2 (Company), Senior Recruiter
> "Candidates literally ask us why we're not using WhatsApp. It's embarrassing." - P4 (Company), Talent Acquisition Lead

**Supporting Codes**:
- WhatsApp-Preferred-Channel (8 sources) [Customer] [SME]
- Email-Low-Response-GCC (6 sources) [Customer]
- SMS-Unreliable (3 sources) [Customer]
- Paradox-Underutilized (2 sources) [SME]

**PMF Impact**: **High**. This theme represents a critical barrier to market fit in GCC. Customers have a clear alternative (WhatsApp) that delivers 3-4x better results than current solution (email). Workday has workaround (Paradox) but low awareness/activation.

**Product Roadmap Impact**:
- **Recommendation**: Native WhatsApp integration for Recruiting OR improve Paradox activation and awareness
- **RICE Score**: 840 (Reach: 2,000 GCC recruiters, Business Impact: 3.0, Customer Impact: 3.0, Composite: 3.0, Confidence: 70%, Effort: 5 pm)

---

**Remember**: Thematic analysis is about finding patterns in qualitative data and interpreting what those patterns mean. It's not just summarizing what people said — it's understanding the underlying story that explains *why* they said it and *what it means* for the product.
