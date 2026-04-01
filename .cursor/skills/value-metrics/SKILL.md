---
name: value-metrics
description: Suggests 3-tier Value Realization metrics (Business Value, Product Value, Adoption/Usage) from Workday's standardized framework. Integrates with /jtbd to derive Product Value metrics from customer jobs, auto-links PV→BV relationships using causality logic, and generates feature-specific Adoption/Usage metrics. Use when creating PRDs, analyzing outcomes, generating slide decks, or asking "what metrics for [feature]?" Returns complete metrics package: 1-3 BV metrics (from CSV), 3 PV metrics (JTBD-derived with BV linkages), 1 Adoption metric, 1 Usage metric.
---

# Value Realization Metrics

Intelligently suggests Value Realization metrics for Workday Recruiting features from a standardized metrics reference.

## When to Use

- Creating PRDs: Select metrics for "Strategic Value & Outcomes" section
- Ad-hoc queries: "What metrics for [feature]?"
- Slide decks: Identify outcome metrics for presentations
- Backlog refinement: Define epic success criteria

## Primary Function: Suggest Metrics

**Command**: `/value-metrics suggest [feature description]`

**Returns**: Complete 3-tier metrics package (BV + PV + Adoption/Usage)

### Process (Enhanced - 3-Tier Metrics)

1. **Extract JTBD**: Invoke `/jtbd` with feature description → receive job statement "When [situation], I want to [motivation], so I can [outcome]"
2. **Suggest BV metrics**: Read CSV `docs/metrics/talent-acquisition-value-metrics.csv` → map to categories → select 1-3 BV metrics
3. **Derive PV metrics**: From JTBD outcome dimension → generate 3 PV metrics:
   - **PV1: Time/Efficiency metric** (from "I want to" motivation - speed/duration)
   - **PV2: Volume/Throughput metric** (from outcome scale - capacity/quantity)
   - **PV3: Quality/Accuracy metric** (from desired end state - match rate/error rate)
4. **Auto-link PV→BV**: For each PV, identify which BV metric(s) it drives using category + causality logic
5. **Generate Adoption metric**: Pattern "% of [user role] using [feature capability]"
6. **Generate Usage metric**: Pattern "[Feature action] per [user role] per [time period]"

### Category Mapping

Map feature patterns to metric categories:

| Feature Pattern | Metric Categories |
|---|---|
| screening, ranking, matching, AI candidate | Time to Hire, Productivity |
| candidate-facing, application, career site | Candidate Experience, Applicant Volumes |
| interview, scheduling, feedback, team | Interview (Time/Volumes) |
| offer, employment agreement, negotiation | Offers/EAs |
| SMS, WhatsApp, messaging, communication | Candidate Experience (Reach, Applications) |
| internal candidate, internal mobility, career pathing | Internal Mobility |
| referral, employee referral | Referrals |
| retention, quality of hire, new hire | Retention |
| recruiter efficiency, coordinator capacity, automation | Productivity |

### PV→BV Linkage Logic

Auto-link Product Value metrics to Business Value metrics using category and causality:

| PV Metric Type | Drives BV Metrics | Causality Confidence |
|---|---|---|
| Time/Speed PV (duration, speed) | Time to Hire, Interview Time metrics | Direct (High) |
| Volume/Throughput PV (capacity, quantity) | Productivity (Capacity), Applicant Volumes | Direct (High) |
| Quality/Accuracy PV (match rate, error rate) | Retention (Quality of Hire), Time to Hire | Indirect (Medium) |
| Reach/Engagement PV (touchpoints, response rate) | Candidate Experience (Reach, Applications) | Direct (High) |
| Conversion PV (funnel metrics, drop-off rate) | Applicant Volumes, Candidate Experience | Direct (High) |

**Confidence levels**:
- **Direct**: PV metric directly causes BV metric change (e.g., faster shortlisting → faster Time to Hire)
- **Indirect**: PV metric influences BV metric through secondary effects (e.g., match accuracy → fewer interview cycles → faster Time to Hire)
- **Weak**: Tenuous link; flag for PM review

### Adoption/Usage Metric Generation

**Adoption Metric Pattern**:
- **Format**: "% of [user role] using [feature capability]"
- **Calculation**: `(Active users / Total eligible users) × 100`
- **Definition of "Active"**: User with ≥1 feature invocation in measurement period
- **Example**: "% of recruiters using AI screening"

**Usage Metric Pattern**:
- **Format**: "[Feature action] per [user role] per [time period]"
- **Calculation**: `Total actions / Active users / Time periods`
- **Time period**: Typically "per month" for consistency
- **Example**: "AI screening invocations per recruiter/month"

**Feature-Specific Patterns**:

| Feature Type | Adoption Metric | Usage Metric |
|---|---|---|
| AI/Skill | % of recruiters using [Skill] | [Skill] invocations per recruiter/month |
| Messaging (WhatsApp/SMS) | % of recruiters using [channel] | Messages sent per recruiter/month |
| Automation (workflows) | % of recruiters with active automations | Automation runs per recruiter/month |
| Analytics/Insights | % of hiring managers viewing [report] | Report views per manager/week |
| Bulk operations | % of recruiters using bulk [action] | Bulk operations per recruiter/month |

### Output Format (3-Tier Hierarchy)

```markdown
Impact (Business Value):

1. **[BV Metric Name]** (BV)
   - Category: [Category]
   - Calculation: [Calculation description from CSV]
   - Status: [Delivered/In Progress/Blocked/etc.]
   - Jira: [Jira link from CSV]
   - PM Owner: [Owner from CSV]

2. **[BV Metric Name]** (BV)
   - Category: [Category]
   - Calculation: [Calculation description from CSV]
   - Status: [Status]
   - Jira: [Jira link]
   - PM Owner: [Owner]

---

Product Outcomes:

**JTBD**: "[When situation, I want to motivation, so I can outcome]"

1. **[PV Metric 1]** (PV) → drives **BV#[N]**
   - Measures: [Specific calculation for this product metric]
   - JTBD alignment: [How this metric traces to JTBD language]
   - Target: [Specific target with baseline comparison]

2. **[PV Metric 2]** (PV) → drives **BV#[N]**
   - Measures: [Specific calculation]
   - JTBD alignment: [JTBD traceability]
   - Target: [Target with baseline]

3. **[PV Metric 3]** (PV) → drives **BV#[N], BV#[N]**
   - Measures: [Specific calculation]
   - JTBD alignment: [JTBD traceability]
   - Target: [Target with baseline]

---

Outputs (Product Catalogue):

- **Usage (Expected/Actual)**: [Feature action] per [user role]/[time]
  - Target: [N]+ [unit]/[time]
  - Measurement: [How to track via API/logging]

- **Adoption/Activation**: % of [user role] using [feature]
  - Target: [X]% Year 1
  - Measurement: (Users with ≥1 [action] / Total [users]) × 100

---

**Recommendation**: 
- **BV metrics**: Use #[N] ([Metric]) + #[N] ([Metric]) - [rationale]
- **PV metrics**: All 3 PV metrics align with JTBD and drive selected BV metrics
- **Adoption/Usage**: Targets based on [feature type/strategic importance]
```

### Example Usage

**Input**: `/value-metrics suggest AI-powered candidate screening for high-volume GCC roles`

**Output**:
```
Impact (Business Value):

1. **Time to Hire** (BV)
   - Category: Time to Hire
   - Calculation: Start Date (JR posted) → End Date (Latest Offer Accepted)
   - Status: Delivered
   - Jira: HRREC-81527
   - PM Owner: Joanne Neilan, Erin Overland

2. **Productivity: Recruiter Capacity** (BV)
   - Category: Productivity
   - Calculation: Avg. # of JRs a recruiter is assigned to
   - Status: Delivered
   - Jira: HRREC-86870

---

Product Outcomes:

**JTBD**: "When reviewing 200+ applications for high-volume roles, I want to identify qualified candidates quickly so I can shortlist 10-15 for interviews in <1 hour instead of 3-4 hours"

1. **Avg. time to shortlist 10 candidates** (PV) → drives **BV#1** (Time to Hire)
   - Measures: Time from application batch received → shortlist complete
   - JTBD alignment: Directly measures "identify qualified candidates quickly"
   - Target: <30 minutes (vs. current 180-240 min baseline, 85% reduction)

2. **# of applications auto-screened per recruiter/month** (PV) → drives **BV#2** (Recruiter Capacity)
   - Measures: Volume of applications processed by AI screening per recruiter
   - JTBD alignment: Automation enables "manage 200+ applications" at scale
   - Target: 500+ applications/recruiter/month

3. **Qualified candidate match accuracy** (PV) → drives **BV#1, BV#2**
   - Measures: % of AI-screened candidates approved by hiring managers
   - JTBD alignment: Accuracy determines whether job "shortlist for interviews" succeeds
   - Target: >80% match rate (hiring manager approval as validation)

---

Outputs (Product Catalogue):

- **Usage (Expected/Actual)**: AI screening invocations per recruiter/month
  - Target: 50+ invocations/month
  - Measurement: Track screening API calls per user (log feature_id=ai_screening, user_id, timestamp)

- **Adoption/Activation**: % of recruiters using AI screening
  - Target: 25% Year 1 (based on 4.5% standard GA uptake × high-value positioning)
  - Measurement: (Recruiters with ≥1 screening / Total recruiters) × 100

---

**Recommendation**: 
- **BV metrics**: Use #1 (Time to Hire) + #2 (Recruiter Capacity) - both have baseline data (Status: Delivered) and directly align with productivity/efficiency goals
- **PV metrics**: All 3 PV metrics align with JTBD outcome ("shortlist in <1 hour") and show clear causal path to BV metrics
- **Adoption/Usage**: Targets reflect high-value AI feature with expected strong uptake given productivity impact
```

## Secondary Function: List Metrics by Category

**Command**: `/value-metrics list [category]`

**Returns**: All metrics in the specified category

### Valid Categories

- Time to Hire
- Interview - Time
- Interview - Volumes
- Productivity
- Retention
- Candidate Experience
- Applicant Volumes
- Offers/EAs
- Referrals
- Internal Mobility

### Example Usage

**Input**: `/value-metrics list "Interview - Time"`

**Output**:
```
📊 Metrics in Category: Interview - Time

1. Time to First Interview Session (Delivered)
2. Time to First Interview Team Creation (Delivered)
3. Time from Interview Session to Interview Feedback (In Progress)
4. Time in Interview BP (Delivered)

See interview dashboard: https://nimbus.wdpharos.io/superset/dashboard/489134ab...
```

## Tertiary Function: Show Metric Details

**Command**: `/value-metrics show [metric name]`

**Returns**: Full details for a specific metric

### Output Format

```markdown
📊 Metric Details: [Metric Name]

**Category**: [Category]
**Status**: [Status]

**Calculation Description**:
[Full calculation from CSV]

**Instrumentation**:
- Jira: [Link]
- PM Owner: [Name]
- Dev Owner: [Name]

**Notes**:
[Any notes from CSV about calculation, approach, or context]

**Dashboard** (if available):
[Dashboard link]
```

## Integration with 200-write-prd.mdc

When invoked by **200-prd-writer** during Step 2.5 (after drafting Feature Solution):

1. Agent automatically invokes `/value-metrics suggest [feature description from PRD]`
2. Skill returns 3 metric suggestions
3. Agent presents suggestions to PM for selection (HITL)
4. PM selects 1-3 metrics for final PRD
5. Agent documents selected metrics in "Strategic Value & Outcomes" section with:
   - Year 1 Forecast calculation using metric
   - Baseline (current state) if Status = "Delivered"
   - Target (desired outcome)
   - Rationale for selection

## JTBD Resource Integration

This skill integrates with `/jtbd` for Product Value (PV) metric derivation. JTBD resources used:

**Primary source**: `/jtbd` skill (`.cursor/skills/jtbd-analysis/SKILL.md`)
- Contains **JTBD Library** with pre-extracted jobs for Recruiter, Hiring Manager, and Candidate personas
- Generates job statements: "When [situation], I want to [motivation], so I can [outcome]"
- Used in Step 1 of enhanced process to derive customer job context

**Extended persona research** (optional depth for complex features):
- `docs/jtbd-recruiting-hr-professional-and-manager.md` - Curated worksheet excerpt (recruiter + hiring manager jobs)
- `docs/workday-user-research/HR-Professional-JTBD-Supplemental-Guide-V1.0.pdf` - Full HR Professional JTBD guide
- `docs/workday-user-research/Frontline-Manager-UX-Persona-V1.pdf` - Frontline Manager persona (hiring from floor)
- `docs/workday-user-research/External-Candidate-UX-Persona-V1.pdf` - External Candidate persona

**Integration flow**:
1. When `/value-metrics suggest [feature]` is invoked
2. Skill internally calls `/jtbd [feature description]`
3. `/jtbd` returns job statement using JTBD Library (lines 184-225)
4. Skill derives 3 PV metrics from job statement dimensions:
   - **PV1 (Time/Efficiency)**: From "I want to [motivation]" - speed/duration
   - **PV2 (Volume/Throughput)**: From "[outcome]" scale - capacity/quantity
   - **PV3 (Quality/Accuracy)**: From desired end state - match rate/error rate
5. PV metrics trace back to JTBD language for validation (e.g., PV1 "Avg. time to shortlist" links to JTBD "quickly identify candidates")

**Validation**: ✅ The `/jtbd` skill contains a comprehensive JTBD Library covering recruiter, hiring manager, and candidate jobs specific to Workday Recruiting. These pre-extracted jobs match the structure and language in `docs/workday-user-research/` PDFs. When `/value-metrics` invokes `/jtbd`, it has access to this Workday-specific job context.

**Path verification**: The JTBD resources at `docs/jtbd-recruiting-hr-professional-and-manager.md` and `docs/workday-user-research/*.pdf` are documented in agent rules (200, 315, 319, 320) and accessible to all skills.

## CSV Reference Structure

**Path**: `docs/metrics/talent-acquisition-value-metrics.csv`

**Key Columns**:
- **Category**: Metric category (Time to Hire, Candidate Experience, etc.)
- **Business Value Metric**: Metric name
- **Calculation Description**: How to measure
- **Status**: Delivered, In Progress, Blocked, Deprioritized, etc.
- **Jira Link**: Instrumentation epic/story
- **PM Owner**: Metric owner (Jamie Moore, Erin Overland, etc.)
- **Dev Owner of Data Gathering**: Dev responsible for instrumentation
- **Notes on Metric / Calculation**: Context, edge cases, approach

## Best Practices

### For Ad-Hoc Use
- Provide feature description with key capabilities (not just feature name)
- Example: "AI-powered candidate screening that ranks applicants by fit" (not "screening feature")

### For PRD Integration
- Select 1-3 metrics from the 3 suggestions
- Prioritize metrics with Status = "Delivered" for baseline data availability
- Align metric selection with PM framing and strategic intent
- Document calculation methodology in "Year 1 Forecast"

### For Slide Decks
- Use metric suggestions to populate "Value & Outcomes" slides
- Include baseline → target progression when available
- Cite Jira link for instrumentation status

## Updating the Reference CSV

**Owner**: Jamie Moore, Erin Overland (Metrics team)

To update metrics:
1. Replace `docs/metrics/talent-acquisition-value-metrics.csv` with new version
2. No skill code changes required (separation of data and logic)
3. Git tracks metric evolution over time

## Limitations

- **CSV-based**: Metrics are current as of last CSV update
- **Pattern matching**: May miss nuanced feature-metric relationships
- **No baseline data lookup**: Skill suggests metrics but doesn't fetch actual baseline values
- **Manual selection**: PM must select final metrics from suggestions (skill doesn't auto-decide)

## Future Enhancements

Consider augmenting CSV with additional columns:
- **Typical Baseline Values**: For Year 1 Forecast calculations
- **Feature Pattern Keywords**: Improve matching accuracy
- **Metric Tier**: Tier 1 (Must-have), Tier 2 (Nice-to-have), Tier 3 (Exploratory)

These additions wouldn't require skill logic changes (separation of concerns).
