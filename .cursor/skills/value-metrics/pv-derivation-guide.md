# Product Value (PV) Metrics Derivation Guide

This guide documents patterns for deriving Product Value metrics from JTBD job statements. PV metrics are product-specific, measurable outcomes that drive Business Value metrics.

## Derivation Framework

**From JTBD statement**: "When [situation], I want to [motivation], so I can [outcome]"

**Extract 3 PV metrics**:
1. **Time/Efficiency PV** (from "I want to" motivation - speed/duration)
2. **Volume/Throughput PV** (from outcome scale - capacity/quantity)
3. **Quality/Accuracy PV** (from desired end state - match rate/error rate)

## PV Metric Type 1: Time/Efficiency

**Characteristic**: Measures speed, duration, or time saved by the product capability

**JTBD indicators**: "quickly", "faster", "in less time", "reduce time", specific time targets ("<1 hour", "within 2 days")

**Metric patterns**:
- "Avg. time to [product capability]"
- "Time saved per [product action]"
- "Duration of [product process]"
- "Time from [start event] to [end event]"
- "[Process] completion time"

### Examples

**Example 1: AI Candidate Screening**

**JTBD**: "When reviewing 200+ applications, I want to identify qualified candidates **quickly** so I can shortlist in **<1 hour**"

**Time/Efficiency PV**: 
- **Metric**: "Avg. time to shortlist 10 candidates"
- **Measures**: Time from application batch received → shortlist complete
- **JTBD trace**: "quickly" + "<1 hour" target
- **Target**: <30 minutes (vs. 180-240 min baseline, 85% reduction)
- **Drives BV**: Time to Hire (faster shortlisting → faster overall hiring cycle)

---

**Example 2: Interview Scheduling Automation**

**JTBD**: "When coordinating interviews across 5 time zones, I want to **schedule automatically** so I can **eliminate 2-3 hours of back-and-forth emails**"

**Time/Efficiency PV**: 
- **Metric**: "Avg. time to confirm interview from request"
- **Measures**: Time from interview request sent → calendar invite confirmed
- **JTBD trace**: "2-3 hours" baseline + "automatically" speed expectation
- **Target**: <15 minutes (vs. 2-3 hours baseline, 90% reduction)
- **Drives BV**: Time to Hire, Interview Time

---

**Example 3: Bulk Offer Letter Generation**

**JTBD**: "When extending offers to 50+ campus hires, I want to **generate offer letters in bulk** so I can **reduce offer preparation from 3 days to 1 hour**"

**Time/Efficiency PV**: 
- **Metric**: "Avg. time to generate 50 offer letters"
- **Measures**: Time from offer initiation → 50 letters ready for signature
- **JTBD trace**: "3 days to 1 hour" explicit time reduction
- **Target**: <1 hour (vs. 3 days baseline, 95% reduction)
- **Drives BV**: Time to Hire, Productivity (Coordinator Capacity)

---

**Example 4: WhatsApp Candidate Messaging**

**JTBD**: "When GCC candidates don't respond to email, I want to message them on WhatsApp so I can **reach them where they communicate and fill roles 40% faster**"

**Time/Efficiency PV**: 
- **Metric**: "Time from message sent to candidate reply"
- **Measures**: Avg. hours between recruiter WhatsApp message → candidate response
- **JTBD trace**: "40% faster" overall + implied faster response time
- **Target**: <6 hours (vs. 48-72 hours email baseline)
- **Drives BV**: Time to Hire, Candidate Experience

---

**Example 5: Pre-Screen Question Automation**

**JTBD**: "When screening 100+ applications, I want to **auto-filter by minimum qualifications** so I can **focus only on qualified candidates and save 2 hours per role**"

**Time/Efficiency PV**: 
- **Metric**: "Time to screen 100 applications to qualified list"
- **Measures**: Time from application batch received → qualified list complete
- **JTBD trace**: "save 2 hours per role" explicit time savings
- **Target**: <20 minutes (vs. 2+ hours manual review baseline)
- **Drives BV**: Time to Hire, Productivity (Recruiter Capacity)

## PV Metric Type 2: Volume/Throughput

**Characteristic**: Measures capacity, quantity, or scale enabled by the product capability

**JTBD indicators**: "200+ applications", "50 campus hires", "manage more", "increase capacity", "scale", volume numbers

**Metric patterns**:
- "# of [items] processed per [user role]/[time period]"
- "Capacity increase: [metric]"
- "Volume of [product actions] per [user]/[time]"
- "[Product-enabled activity] throughput"
- "Max concurrent [items] handled"

### Examples

**Example 1: AI Candidate Screening**

**JTBD**: "When reviewing **200+ applications**, I want to identify qualified candidates quickly so I can shortlist 10-15 for interviews"

**Volume/Throughput PV**: 
- **Metric**: "# of applications auto-screened per recruiter/month"
- **Measures**: Volume of applications processed by AI screening per recruiter
- **JTBD trace**: "200+ applications" scale requirement
- **Target**: 500+ applications/recruiter/month
- **Drives BV**: Productivity (Recruiter Capacity - enables more JRs per recruiter)

---

**Example 2: Bulk Offer Letter Generation**

**JTBD**: "When extending offers to **50+ campus hires**, I want to generate offer letters in bulk so I can reduce offer preparation time"

**Volume/Throughput PV**: 
- **Metric**: "# of offers generated per coordinator/week during campus season"
- **Measures**: Volume of offer letters created per coordinator in peak hiring periods
- **JTBD trace**: "50+ campus hires" batch scale
- **Target**: 100+ offers/coordinator/week (vs. 20-30 baseline)
- **Drives BV**: Productivity (Coordinator Capacity)

---

**Example 3: WhatsApp Candidate Messaging**

**JTBD**: "When GCC candidates don't respond to email, I want to message them on WhatsApp so I can reach them where they communicate"

**Volume/Throughput PV**: 
- **Metric**: "# of candidates engaged via WhatsApp per recruiter/month"
- **Measures**: Volume of unique candidates messaged per recruiter
- **JTBD trace**: Increased touchpoint volume to "reach them where they communicate"
- **Target**: 100+ candidates/recruiter/month
- **Drives BV**: Candidate Experience (Reach), Applicant Volumes

---

**Example 4: Interview Scheduling Automation**

**JTBD**: "When coordinating **interviews across 5 time zones**, I want to schedule automatically so I can eliminate back-and-forth"

**Volume/Throughput PV**: 
- **Metric**: "# of interviews auto-scheduled per coordinator/week"
- **Measures**: Volume of interview sessions scheduled via automation
- **JTBD trace**: "5 time zones" complexity scale + high interview volume
- **Target**: 50+ interviews/coordinator/week (vs. 15-20 manual baseline)
- **Drives BV**: Productivity (Coordinator Capacity), Interview Volumes

---

**Example 5: Talent Pool Matching**

**JTBD**: "When a new JR opens, I want to **instantly see matched candidates from talent pools** so I can **engage qualified candidates within 24 hours**"

**Volume/Throughput PV**: 
- **Metric**: "# of talent pool candidates auto-matched per JR"
- **Measures**: Volume of candidates surfaced by matching algorithm per job requisition
- **JTBD trace**: "instantly see matched candidates" implies high-volume matching
- **Target**: 20-50 matched candidates per JR (depending on role type)
- **Drives BV**: Time to Hire (faster sourcing), Productivity (Recruiter Capacity)

## PV Metric Type 3: Quality/Accuracy

**Characteristic**: Measures match rate, accuracy, error rate, or quality of product output

**JTBD indicators**: "qualified candidates", "right fit", "accurate", "reduce errors", "quality", "better matches"

**Metric patterns**:
- "Match accuracy: % of [items] correctly [classified/matched]"
- "Error rate in [product process]"
- "Quality score for [product output]"
- "% of [product suggestions] accepted by [user role]"
- "[Product-identified items] approval rate"

### Examples

**Example 1: AI Candidate Screening**

**JTBD**: "When reviewing 200+ applications, I want to identify **qualified candidates** quickly so I can shortlist for interviews"

**Quality/Accuracy PV**: 
- **Metric**: "Qualified candidate match accuracy"
- **Measures**: % of AI-screened candidates approved by hiring managers
- **JTBD trace**: "qualified candidates" quality requirement
- **Target**: >80% match rate (hiring manager approval as validation)
- **Drives BV**: Time to Hire (accurate matches → fewer wasted interviews), Retention (Quality of Hire - better matches → better hires)

---

**Example 2: Skills-Based Matching**

**JTBD**: "When sourcing for niche technical roles, I want to **match candidates by verified skills** so I can **find the right fit faster instead of keyword searching**"

**Quality/Accuracy PV**: 
- **Metric**: "Skills match accuracy for technical roles"
- **Measures**: % of skills-matched candidates passing technical screen
- **JTBD trace**: "right fit" + "verified skills" quality dimension
- **Target**: >70% pass rate (vs. 40% keyword-based baseline)
- **Drives BV**: Time to Hire (better matches → faster progression), Retention (Quality of Hire)

---

**Example 3: Duplicate Candidate Detection (UDMF)**

**JTBD**: "When candidates apply multiple times, I want to **automatically detect and merge duplicates** so I can **maintain clean data and avoid compliance risks**"

**Quality/Accuracy PV**: 
- **Metric**: "Duplicate detection accuracy"
- **Measures**: % of true duplicates correctly identified by UDMF matching rules
- **JTBD trace**: "automatically detect" accuracy requirement + "clean data"
- **Target**: >95% detection rate (false negatives <5%)
- **Drives BV**: Productivity (less manual cleanup), Compliance (data quality)

---

**Example 4: Automated Reference Checks**

**JTBD**: "When verifying candidate background, I want **automated reference checks** so I can **reduce verification errors and speed up final offer**"

**Quality/Accuracy PV**: 
- **Metric**: "Reference check data completeness"
- **Measures**: % of reference checks returning complete data (all required fields populated)
- **JTBD trace**: "reduce verification errors" quality goal
- **Target**: >90% completeness (vs. 70% manual baseline)
- **Drives BV**: Time to Hire (complete data → faster offer), Compliance (data quality)

---

**Example 5: Job Requisition Matching**

**JTBD**: "When posting a JR, I want to **auto-suggest similar past JRs** so I can **reuse accurate job descriptions and reduce time to post**"

**Quality/Accuracy PV**: 
- **Metric**: "JR suggestion relevance score"
- **Measures**: % of suggested past JRs marked as "relevant" by recruiter
- **JTBD trace**: "accurate job descriptions" quality dimension
- **Target**: >75% relevance rate
- **Drives BV**: Time to Hire (faster JR creation), Productivity (reduced rework)

## Cross-Cutting Patterns

### Multi-Metric Features

Some features justify multiple PV metrics across types. Example:

**AI Candidate Screening** (high-impact feature):
- **Time PV**: Avg. time to shortlist 10 candidates
- **Volume PV**: # of applications auto-screened per recruiter/month
- **Quality PV**: Qualified candidate match accuracy

**All 3 are warranted** because screening is a core workflow with time, scale, and quality dimensions.

### Single-Dimension Features

Simpler features may have 1-2 strong PV metrics. Example:

**SMS Notifications** (communication channel):
- **Reach PV**: Candidate response rate to SMS vs. email
- **Time PV**: Time from message sent to candidate reply

**Quality PV less relevant** because SMS is a channel, not a decision-making capability.

### Choosing the Right PV Metrics

**Always include**:
- 1 Time/Efficiency PV (speed is always measurable)
- 1 Volume/Throughput PV if scale is a factor
- 1 Quality/Accuracy PV if correctness/match rate matters

**Limit to 3 PV metrics** to maintain focus. More than 3 dilutes PM attention.

## Integration with `/jtbd` Skill

### Workflow

1. **Invoke `/jtbd`** with feature description
2. **Receive job statement**: Structured as "When [situation], I want to [motivation], so I can [outcome]"
3. **Extract PV dimensions**:
   - **Situation**: Identifies scale/volume cues ("200+ applications", "5 time zones")
   - **Motivation**: Identifies speed/efficiency cues ("quickly", "automatically", "reduce time")
   - **Outcome**: Identifies quality/success cues ("qualified candidates", "right fit", "accurate")
4. **Generate 3 PV metrics** using patterns from this guide
5. **Link to BV metrics** using causality logic (see `pv-bv-linkage-map.md`)

### Example Integration

**Feature**: "AI-powered resume parsing for structured data extraction"

**Step 1: `/jtbd` invocation**
```
/jtbd AI-powered resume parsing for structured data extraction
```

**Step 2: JTBD output**
```
"When processing 50+ resumes per day, I want to automatically extract skills, experience, and education so I can populate candidate profiles without manual data entry and reduce data entry time by 80%"
```

**Step 3: PV derivation**
- **Situation cue**: "50+ resumes per day" → **Volume PV**
- **Motivation cue**: "automatically" + "reduce time by 80%" → **Time PV**
- **Outcome cue**: "extract skills, experience, education" accuracy implied → **Quality PV**

**Step 4: Generated PV metrics**
1. **Time PV**: "Avg. time to populate candidate profile" (Target: <2 min vs. 10 min manual baseline)
2. **Volume PV**: "# of resumes parsed per recruiter/day" (Target: 50+ resumes/day)
3. **Quality PV**: "Data extraction accuracy" (Target: >90% field accuracy vs. manual entry baseline)

## Advanced Patterns

### Composite PV Metrics

Some product capabilities require composite metrics:

**Example: Multi-Channel Candidate Engagement**

**JTBD**: "When candidates don't respond to email, I want to reach them via SMS, WhatsApp, and phone so I can maximize response rate and fill roles faster"

**Composite Volume PV**: "Total candidate touchpoints per recruiter/week across all channels"
- Combines: Email sends + SMS sends + WhatsApp messages + Phone calls
- Measures: Aggregate engagement volume enabled by multi-channel capability

**Rationale**: Single-channel volume metrics miss the cross-channel value

### Negative PV Metrics (Reduction Goals)

Some features aim to reduce negative outcomes:

**Example: Candidate Dropout Reduction**

**JTBD**: "When candidates abandon applications mid-flow, I want to identify friction points so I can reduce dropout rate and increase completed applications"

**Negative Quality PV**: "Application dropout rate"
- Measures: % of candidates who start but don't complete application
- **Inverted metric**: Lower is better (unlike most PV metrics where higher is better)
- Target: <15% dropout (vs. 30% baseline)
- **Drives BV**: Applicant Volumes (more completions), Candidate Experience

**Format note**: Flag negative metrics clearly in output ("Lower is better")

### Ratio PV Metrics

Some features improve efficiency through ratios:

**Example: Interview-to-Offer Conversion**

**JTBD**: "When scheduling final interviews, I want to focus on candidates most likely to accept so I can improve interview-to-offer conversion and reduce wasted interview time"

**Ratio Quality PV**: "Interview-to-offer conversion rate"
- Measures: (Offers accepted / Final interviews conducted) × 100
- JTBD trace: "most likely to accept" selection quality
- Target: >60% conversion (vs. 40% baseline)
- **Drives BV**: Productivity (fewer wasted interviews), Time to Hire (fewer cycles)

## PV Metric Quality Checklist

Before finalising a PV metric, validate:

- [ ] **Measurable**: Can this be calculated from product data/logs?
- [ ] **Product-specific**: Is this unique to the product capability (not just a BV metric reworded)?
- [ ] **JTBD-aligned**: Can you trace this metric to specific JTBD language?
- [ ] **BV-linked**: Does this PV clearly drive at least 1 BV metric?
- [ ] **Actionable**: If this PV metric decreases, can the PM identify product improvements?
- [ ] **Time-bounded**: Is there a clear measurement period (per day, per week, per month)?
- [ ] **User-segmented**: Is it calculated per user role (per recruiter, per coordinator)?

## Common Pitfalls

### ❌ Pitfall 1: PV metric is just a BV metric renamed

**Bad PV**: "Time to Hire via AI screening"
- **Problem**: This is just the BV metric "Time to Hire" scoped to a feature
- **Fix**: Focus on product-specific outcome - "Time to shortlist 10 candidates" (product capability, not full hiring cycle)

### ❌ Pitfall 2: PV metric is too broad

**Bad PV**: "Recruiter productivity improvement"
- **Problem**: Too vague, not measurable, overlaps with BV "Productivity: Recruiter Capacity"
- **Fix**: "# of applications auto-screened per recruiter/month" (specific, measurable product throughput)

### ❌ Pitfall 3: PV metric has no JTBD trace

**Bad PV**: "# of AI model retraining cycles"
- **Problem**: Technical metric, not outcome-oriented, no JTBD alignment
- **Fix**: Use outcome metric that customer cares about - "Match accuracy over time" (quality that degrades without retraining)

### ❌ Pitfall 4: PV→BV linkage is weak

**Bad linkage**: "Shortlist time" (PV) → "New Hire Retention" (BV)
- **Problem**: Tenuous causality - fast shortlisting doesn't directly improve retention
- **Fix**: Link to direct BV - "Shortlist time" → "Time to Hire" (direct path)

### ❌ Pitfall 5: No baseline comparison in target

**Bad target**: "Shortlist time: 30 minutes"
- **Problem**: No baseline, can't show improvement magnitude
- **Fix**: "Shortlist time: <30 minutes (vs. 180-240 min baseline, 85% reduction)"

## References

**JTBD Skill**: `.cursor/skills/jtbd-analysis/SKILL.md`
**PV→BV Linkage**: `.cursor/skills/value-metrics/pv-bv-linkage-map.md`
**BV Metrics CSV**: `docs/metrics/talent-acquisition-value-metrics.csv`
**Adoption/Usage Patterns**: See "Adoption/Usage Metric Generation" section in `SKILL.md`
