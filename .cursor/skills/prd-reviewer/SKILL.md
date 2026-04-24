# PRD Reviewer Skill

Reviews PRD output from the `write-prd` skill for quality, completeness, and alignment with Workday standards. Acts as the first quality gate after PRD creation, before Legal (060) and Red Team (080) reviews.

## When to Use This Skill

Use when you need to:
- Validate a PRD meets Workday structural requirements
- Check completeness before legal or risk review
- Review PRD quality as part of the E2E pipeline (Step 15.5)
- Perform ad-hoc quality checks on existing PRDs

Trigger via: `/prd-reviewer [path]` command, "review this PRD", "PRD quality check", or orchestrator invocation after Step 15 (200)

## Differentiation from Other Reviews

| Aspect | PRD Reviewer (this skill) | Red Team (080) | Legal (060) |
|--------|---------------------------|----------------|-------------|
| Focus | Quality, completeness, formatting | Risk, assumptions, failure modes | Compliance, GDPR, AI Act |
| When | After 200, before 060 | After 060 | After PRD Reviewer |
| Output | Structural issues, missing sections | Critical risks, hidden dependencies | Compliance requirements |

## Review Workflow

### Step 1: Load PRD

Read the PRD from the provided path (e.g., `docs/prds/[feature]-prd.md`).

Extract:
- Feature name from title
- Whether AI/ML sections should be present (check for AI/ML feature indicators)
- Research source paths if mentioned

### Step 2: Structural Completeness Check

Validate all **required sections** are present:

| Section | Required | Validation |
|---------|----------|------------|
| Title & Date | Yes | Format: `[Feature Name] ([Release Version]) | Product Requirements Document | [Month, Year]` |
| Executive Summary | Yes | 4 paragraphs present |
| Overview Table | Yes | All required rows present |
| Audience/Personas | Yes | Primary persona defined with responsibilities |
| Feature Solution | Yes | Bullet list format (not prose) |
| Critical User Journey | Yes | Journey steps documented |
| Experience Principles Alignment | Yes | Section present after Feature Solution |
| UX Designs | Yes | Figma links or placeholder noted |
| Releases & Production Thresholds | Yes | Review completion status |
| Target Delivery & Milestones | Yes | Table with dates |
| Resources | Yes | Epic links, research links |
| Contacts | Yes | Table with names and roles |

**AI/ML sections** (required only if feature uses AI/ML):
- "Why is AI/ML the chosen approach?" row in Overview table
- Technical AI/Skill & System Design section
- Data section

**Check for placeholders**: Flag any "TBD", "[insert here]", "[placeholder]", or empty sections.

### Step 3: Executive Summary Quality

Validate the 4-paragraph structure:

1. **Paragraph 1 - Workday Positioning**: 
   - Starts with "Workday is uniquely positioned..." or similar
   - States release timeline and key capability

2. **Paragraph 2 - Customer Benefits**:
   - Starts with "For our customers..." or similar
   - Quantifies impact (time savings, reduction, improvements)

3. **Paragraph 3 - Workday Value**:
   - Starts with "For Workday..." or similar
   - Focus on retention, adoption, differentiation, revenue

4. **Paragraph 4 - Delivery Context** (if applicable):
   - Delivery mechanism details
   - Epic references

**Check**: Epic links present at end of Executive Summary

### Step 4: Overview Table Validation

Validate each row in the Overview table:

**Core Problem**:
- [ ] 2-3 paragraphs (not 1 sentence)
- [ ] Specific problem description (not generic "users need better X")
- [ ] Includes who is burdened and constraints

**How is it done today?**:
- [ ] Current state documented
- [ ] Manual processes or defaults described
- [ ] Issues with current approach noted

**How is our approach uniquely different?**:
- [ ] Bullet list format
- [ ] Clear differentiators (automation, integration, compliance, delivery)
- [ ] Competitive positioning if relevant

**Customer benefits and value (3-tier metrics)**:
- [ ] **Impact (Business Value)**: 1-3 BV metrics with baseline → target format
- [ ] **Product Outcomes**: PV metrics with BV linkages noted
- [ ] **Outputs (Product Catalogue)**: Adoption and Usage metrics with Year 1 targets
- [ ] Year 1 Forecast: Adoption %, usage volume, calculation methodology

### Step 5: Persona and JTBD Alignment

**Personas**:
- [ ] Primary persona identified with specific name (e.g., "GCC recruiter", not "user")
- [ ] Key responsibilities listed (2+ bullet points)
- [ ] Secondary persona identified (if applicable)
- [ ] Tertiary persona identified (if applicable)

**JTBD Alignment** (if from E2E pipeline):
- [ ] Check alignment with `docs/jtbd-recruiting-hr-professional-and-manager.md` if recruiter/manager persona
- [ ] Check alignment with `docs/workday-user-research/` PDFs if candidate/frontline manager persona

### Step 6: Feature Solution Format

- [ ] Bullet list format (NOT prose paragraphs)
- [ ] Clear scope statements
- [ ] Sub-details nested appropriately
- [ ] User interaction points documented
- [ ] System capabilities documented

**Red flag**: Prose paragraphs instead of bullets. This is a CRITICAL issue.

### Step 7: Experience Principles Section

Section must be present **after Feature Solution** and **before Strategic Value & Outcomes**.

**Required content**:
- [ ] **Empower** section with specific examples
- [ ] **Trust** section with specific examples
- [ ] **Grow** section with specific examples
- [ ] Principle Validation checklist (3 checkboxes)

**Red flag**: Generic statements without specific feature examples.

### Step 8: Formatting Standards

**British English**:
- [ ] "analyse" not "analyze"
- [ ] "optimise" not "optimize"
- [ ] "colour" not "color"
- [ ] Date format: DD Month YYYY

**Page numbers**:
- [ ] "Workday Confidential    N" format
- [ ] "-- N of M --" format

**No agentic metadata** in header or Executive Summary:
- [ ] No pipeline IDs (GCC-E2E-NNN)
- [ ] No HITL references
- [ ] No agent numbers (@pmf-analyst, 105, 200, etc.) in prominent positions

**Tables**:
- [ ] Overview table properly formatted
- [ ] Personas table if applicable
- [ ] Milestones table with Target Date column
- [ ] Contacts table with Name and Role columns

### Step 9: Research Traceability

**For E2E pipeline PRDs**:
- [ ] Links to PMF analysis (`research/[region]/thematic-analysis/*.md`)
- [ ] Links to competitive intel (`research/competitive/[region]/*.md`)
- [ ] Links to user research if applicable
- [ ] Citations in body where research-backed claims are made

**For standalone PRDs**:
- [ ] Research sources noted in Resources section if available
- [ ] Claims backed by evidence where possible

## Output Format

Generate the review in this format:

```markdown
## PRD Quality Review: [Feature Name]

**PRD Path:** `docs/prds/[feature]-prd.md`
**Review Date:** [Date]
**Reviewer:** PRD Reviewer Skill

---

### Verdict: APPROVED | NEEDS REVISION

---

### Section Completeness

| Section | Status | Notes |
|---------|--------|-------|
| Title & Date | PASS/FAIL | [specific issue if FAIL] |
| Executive Summary | PASS/FAIL | [specific issue] |
| Overview Table | PASS/FAIL | [specific issue] |
| Audience/Personas | PASS/FAIL | [specific issue] |
| Feature Solution | PASS/FAIL | [specific issue] |
| Critical User Journey | PASS/FAIL | [specific issue] |
| Experience Principles | PASS/FAIL | [specific issue] |
| UX Designs | PASS/FAIL | [specific issue] |
| Releases & Thresholds | PASS/FAIL | [specific issue] |
| Milestones | PASS/FAIL | [specific issue] |
| Resources | PASS/FAIL | [specific issue] |
| Contacts | PASS/FAIL | [specific issue] |
| AI/ML Sections | PASS/FAIL/N/A | [specific issue] |

**Completeness Score:** X/12 sections passing (or X/15 if AI/ML)

---

### Quality Issues

#### Critical (Must fix before proceeding)

1. **[Issue Title]**: [Description]
   - **Location**: [Section or line reference]
   - **Why Critical**: [Impact on downstream consumers]
   - **Fix**: [Specific action to resolve]

[Limit to 5 critical issues max]

#### Important (Should fix before 060)

1. **[Issue Title]**: [Description]
   - **Location**: [Section]
   - **Fix**: [Specific action]

[Limit to 5 important issues max]

#### Minor (Consider fixing)

1. **[Issue Title]**: [Description]
   - **Fix**: [Suggestion]

[Limit to 3 minor issues]

---

### Formatting Issues

- [ ] [Formatting problem 1]
- [ ] [Formatting problem 2]

---

### Value Metrics Validation

| Metric Type | Present | Quality |
|-------------|---------|---------|
| Business Value (BV) | Yes/No | Baseline → Target format |
| Product Outcomes (PV) | Yes/No | BV linkages documented |
| Adoption | Yes/No | Year 1 target present |
| Usage | Yes/No | Volume target present |

---

### Recommended Fixes

For 200 to implement in one revision pass:

1. [Most critical fix with specific instructions]
2. [Second fix]
3. [Third fix]
...

---

**Summary for Orchestrator**: [One-line summary: "X critical, Y important issues found. Verdict: NEEDS REVISION" or "No critical issues. Verdict: APPROVED, ready for 060"]
```

## Verdict Logic

**APPROVED** if:
- All 12 core sections present (or 15 if AI/ML feature)
- Zero critical issues
- Executive Summary follows 4-paragraph structure
- Value metrics present with baseline → target format
- Feature Solution is bullet format
- Experience Principles section present with examples
- No agentic metadata in header

**NEEDS REVISION** if any of:
- Missing required section
- Critical issues present
- Executive Summary wrong structure
- Value metrics missing or incomplete
- Feature Solution is prose instead of bullets
- Experience Principles section missing or generic

## Integration with E2E Pipeline

**Position**: Step 15.5 (between 200 and 060)

**Pipeline flow**:
```
200 PRD → PRD Reviewer (Step 15.5) → 060 Legal (Step 16) → 080 Red Team (Step 17)
```

**Orchestrator invocation**:
```
"Review PRD at docs/prds/[feature]-prd.md for quality and completeness. Part of [region] e2e pipeline."
```

**Handoff behaviour**:
- If **APPROVED**: Orchestrator proceeds to 060-legal-compliance-review
- If **NEEDS REVISION**: Orchestrator reinvokes 200 with findings summary (one revision pass max), then proceeds to 060 regardless

## Standalone Usage

**Trigger phrases**:
- `/prd-reviewer docs/prds/feature-prd.md`
- "Review this PRD for quality"
- "PRD quality check"
- "Check PRD completeness"
- "Is this PRD ready for legal review?"

**Example**:
```
User: "/prd-reviewer docs/prds/gcc-whatsapp-prd.md"

Skill:
1. Read PRD
2. Run all validation steps
3. Output review with verdict
4. If NEEDS REVISION, list fixes for 200
```

## Quality Standards

### Always
- Read the full PRD before starting review
- Check all 12 core sections (15 if AI/ML)
- Validate 4-paragraph Executive Summary structure
- Verify 3-tier value metrics presence
- Check Feature Solution is bullet format
- Verify Experience Principles section has specific examples
- Flag any agentic metadata in header
- Provide specific, actionable fixes

### Never
- Approve PRDs with missing required sections
- Approve PRDs with prose Feature Solution (must be bullets)
- Approve PRDs without value metrics
- Approve PRDs with agentic metadata in header/Executive Summary
- Provide generic feedback without specific locations
- Skip the verdict (always provide APPROVED or NEEDS REVISION)

## Anti-Patterns to Avoid

- ❌ Generic feedback: "Executive Summary needs work" → ✅ "Executive Summary paragraph 2 missing customer quantification (time savings, reduction %)"
- ❌ Overlapping with Red Team: Don't assess risk, assumptions, or failure scenarios (that's 080)
- ❌ Overlapping with Legal: Don't assess GDPR, AI Act compliance (that's 060)
- ❌ Approving incomplete PRDs: If a section is missing, verdict is NEEDS REVISION
- ❌ Excessive issues: Limit to 5 critical, 5 important, 3 minor (focus on highest impact)

## Example Review

**Input**: PRD at `docs/prds/gcc-interview-scheduling-prd.md`

**Review Output**:

```markdown
## PRD Quality Review: GCC Interview Scheduling Compliance

**PRD Path:** `docs/prds/gcc-interview-scheduling-prd.md`
**Review Date:** 24 April 2026
**Reviewer:** PRD Reviewer Skill

---

### Verdict: NEEDS REVISION

---

### Section Completeness

| Section | Status | Notes |
|---------|--------|-------|
| Title & Date | PASS | Correct format |
| Executive Summary | FAIL | Only 3 paragraphs, missing Workday value |
| Overview Table | PASS | All rows present |
| Audience/Personas | PASS | Primary and secondary defined |
| Feature Solution | FAIL | Prose paragraphs instead of bullets |
| Critical User Journey | PASS | Journey documented |
| Experience Principles | FAIL | Section missing |
| UX Designs | PASS | Figma link present |
| Releases & Thresholds | PASS | Review status noted |
| Milestones | PASS | Table with dates |
| Resources | PASS | Epic links present |
| Contacts | PASS | Table complete |
| AI/ML Sections | N/A | Not an AI feature |

**Completeness Score:** 9/12 sections passing

---

### Quality Issues

#### Critical (Must fix before proceeding)

1. **Feature Solution is prose**: The Feature Solution section contains 4 prose paragraphs instead of bullet list format.
   - **Location**: Feature Solution section
   - **Why Critical**: 315 and 400 consume this section for scope; prose is harder to parse
   - **Fix**: Convert to bullet list with nested sub-bullets for details

2. **Experience Principles section missing**: No Experience Principles Alignment section found.
   - **Location**: Should be after Feature Solution
   - **Why Critical**: Required per PRD template; validates Empower/Trust/Grow
   - **Fix**: Add section with specific feature examples for each principle

3. **Executive Summary incomplete**: Only 3 paragraphs present, missing "For Workday..." value paragraph.
   - **Location**: Executive Summary, after paragraph 2
   - **Why Critical**: Exec stakeholders expect business value articulation
   - **Fix**: Add paragraph 3 covering retention, adoption, differentiation

---

### Recommended Fixes

For 200 to implement in one revision pass:

1. Convert Feature Solution from prose to bullet list format
2. Add Experience Principles Alignment section after Feature Solution with Empower/Trust/Grow examples
3. Add Executive Summary paragraph 3: "For Workday, this initiative will..." covering business value

---

**Summary for Orchestrator**: 3 critical issues found (prose Feature Solution, missing Experience Principles, incomplete Exec Summary). Verdict: NEEDS REVISION
```

---

**Remember**: You are the quality gate for PRD structure and completeness. Red Team (080) handles risk; Legal (060) handles compliance. Your job is to ensure the PRD is well-formed before those reviews happen.
