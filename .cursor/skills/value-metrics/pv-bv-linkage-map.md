# PV→BV Linkage Map

This document defines causality rules for auto-linking **Product Value (PV) metrics** to **Business Value (BV) metrics**. Use these patterns when the `/value-metrics` skill generates PV metrics from JTBD analysis.

## Linkage Framework

Each PV metric should drive 1-2 BV metrics with clear causality. The skill auto-suggests linkages using:
1. **Category matching** (PV type → BV category)
2. **Causality logic** (how PV change causes BV change)
3. **Confidence level** (Direct/Indirect/Weak)

## Category-Based Linkage Rules

### Time/Speed PV → BV Linkages

**PV Metric Type**: Duration, speed, time saved

**Drives BV Metrics**:
- **Time to Hire** (Direct causality - High confidence)
- **Interview Time metrics** (Direct causality - High confidence)
- **Productivity metrics** (Indirect causality - Medium confidence, via time savings → capacity increase)

**Logic**: Faster product actions → shorter overall process duration

**Examples**:

| PV Metric | Drives BV | Causality Explanation | Confidence |
|---|---|---|---|
| Avg. time to shortlist 10 candidates | Time to Hire | Faster shortlisting → shorter hiring cycle | Direct (High) |
| Time from message sent to candidate reply | Time to Hire | Faster candidate responses → shorter funnel | Direct (High) |
| Time to schedule interview from request | Interview Time (Time to First Session) | Faster scheduling → shorter interview process | Direct (High) |
| Time to generate offer letter | Time to Hire | Faster offer prep → shorter offer stage | Direct (High) |
| Time to screen 100 applications | Productivity (Recruiter Capacity) | Time saved on screening → more capacity for other tasks | Indirect (Medium) |

**Validation rule**: If Time PV doesn't link to Time to Hire or Interview Time, flag as **Weak** (needs PM review)

---

### Volume/Throughput PV → BV Linkages

**PV Metric Type**: Capacity, quantity, scale

**Drives BV Metrics**:
- **Productivity metrics** (Direct causality - High confidence)
- **Applicant Volumes** (Direct causality - High confidence)
- **Interview Volumes** (Direct causality - High confidence)

**Logic**: Higher product throughput → increased capacity/volumes

**Examples**:

| PV Metric | Drives BV | Causality Explanation | Confidence |
|---|---|---|---|
| # of applications auto-screened per recruiter/month | Productivity (Recruiter Capacity) | Automation increases JR handling capacity | Direct (High) |
| # of candidates engaged via WhatsApp per recruiter/month | Candidate Experience (Reach), Applicant Volumes | More touchpoints → more reach + applications | Direct (High) |
| # of interviews auto-scheduled per coordinator/week | Productivity (Coordinator Capacity) | Automation increases interview volume capacity | Direct (High) |
| # of offers generated per coordinator/week | Productivity (Coordinator Capacity) | Bulk capability increases offer throughput | Direct (High) |
| # of talent pool candidates auto-matched per JR | Productivity (Recruiter Capacity) | Automation reduces sourcing time → more JRs manageable | Direct (High) |

**Validation rule**: Volume PV should always link to a Productivity or Volumes BV metric

---

### Quality/Accuracy PV → BV Linkages

**PV Metric Type**: Match rate, accuracy, error rate

**Drives BV Metrics**:
- **Retention (Quality of Hire)** (Indirect causality - Medium confidence)
- **Time to Hire** (Indirect causality - Medium confidence, via reduced rework/cycles)
- **Productivity metrics** (Indirect causality - Medium confidence, via reduced rework)

**Logic**: Better product accuracy → fewer errors/cycles → improved downstream BV outcomes

**Examples**:

| PV Metric | Drives BV | Causality Explanation | Confidence |
|---|---|---|---|
| Qualified candidate match accuracy | Time to Hire | Better matches → fewer wasted interviews → faster hiring | Indirect (Medium) |
| Qualified candidate match accuracy | Retention (Quality of Hire) | Better matches → better hires → higher retention | Indirect (Medium) |
| Skills match accuracy for technical roles | Time to Hire | Accurate skills matching → candidates pass screens faster | Indirect (Medium) |
| Duplicate detection accuracy | Productivity (Recruiter Capacity) | Clean data → less manual cleanup → more capacity | Indirect (Medium) |
| Reference check data completeness | Time to Hire | Complete data → faster offer decisions | Indirect (Medium) |
| JR suggestion relevance score | Productivity (Recruiter Capacity) | Accurate suggestions → less rework → time saved | Indirect (Medium) |

**Validation rule**: Quality PV typically links to Retention or Time to Hire through secondary effects

---

### Reach/Engagement PV → BV Linkages

**PV Metric Type**: Touchpoints, response rate, engagement

**Drives BV Metrics**:
- **Candidate Experience (Reach, Applications)** (Direct causality - High confidence)
- **Applicant Volumes** (Direct causality - High confidence)
- **Time to Hire** (Indirect causality - Medium confidence, via faster engagement)

**Logic**: More engagement → more candidate reach/applications

**Examples**:

| PV Metric | Drives BV | Causality Explanation | Confidence |
|---|---|---|---|
| Candidate response rate to WhatsApp vs. email | Candidate Experience (Reach) | Higher response rate → more candidates reached | Direct (High) |
| # of candidates viewing jobs via mobile career site | Applicant Volumes | More views → more applications | Direct (High) |
| Candidate engagement rate with interview scheduler | Candidate Experience | Self-service scheduling → better experience | Direct (High) |
| Referral invitation acceptance rate | Referrals (Referral Submissions) | More acceptances → more referrals | Direct (High) |

---

### Conversion PV → BV Linkages

**PV Metric Type**: Funnel metrics, drop-off rate, conversion rate

**Drives BV Metrics**:
- **Applicant Volumes** (Direct causality - High confidence)
- **Candidate Experience** (Direct causality - High confidence)
- **Time to Hire** (Indirect causality - Medium confidence, via funnel efficiency)

**Logic**: Better conversion rates → more candidates progressing through funnel

**Examples**:

| PV Metric | Drives BV | Causality Explanation | Confidence |
|---|---|---|---|
| Application completion rate (% who finish after starting) | Applicant Volumes | Fewer dropouts → more completed applications | Direct (High) |
| Interview acceptance rate (% who accept vs. decline) | Interview Volumes | Higher acceptance → more interviews conducted | Direct (High) |
| Offer acceptance rate | Time to Hire | More acceptances → fewer re-starts | Indirect (Medium) |
| Career site visit-to-application conversion | Applicant Volumes, Candidate Experience | Better conversion → more applications, better UX | Direct (High) |

## Multi-BV Linkages (1:N Pattern)

**A single PV metric can drive multiple BV metrics.** This is the **1:N relationship** mentioned in your metrics hierarchy.

### Example: Qualified Candidate Match Accuracy

**PV Metric**: "Qualified candidate match accuracy" (% of AI-screened candidates approved by hiring managers)

**Drives**:
1. **Time to Hire** (BV) - Better matches → fewer interview cycles → faster hiring
2. **Retention (Quality of Hire)** (BV) - Better matches → better hires → higher retention
3. **Productivity (Recruiter Capacity)** (BV) - Better matches → less rework → more capacity

**Rationale**: Quality PV metrics often have ripple effects across multiple BV outcomes

### Example: # of Applications Auto-Screened per Recruiter/Month

**PV Metric**: "# of applications auto-screened per recruiter/month"

**Drives**:
1. **Productivity (Recruiter Capacity)** (BV) - Automation → more JRs per recruiter
2. **Time to Hire** (BV) - Faster screening → faster overall hiring cycle

**Rationale**: Volume PV metrics that save time drive both capacity AND speed BV outcomes

## Confidence Levels

### Direct Causality (High Confidence)

**Definition**: PV metric directly causes BV metric change with clear, immediate causal path

**Examples**:
- "Shortlist time" (PV) → "Time to Hire" (BV) ✅
- "# applications screened" (PV) → "Recruiter Capacity" (BV) ✅
- "Candidate response rate" (PV) → "Candidate Experience (Reach)" (BV) ✅

**Action**: Auto-link in skill output without PM validation flag

---

### Indirect Causality (Medium Confidence)

**Definition**: PV metric influences BV metric through secondary effects or multiple steps

**Examples**:
- "Match accuracy" (PV) → "Time to Hire" (BV) - through reduced interview cycles
- "Data extraction accuracy" (PV) → "Recruiter Capacity" (BV) - through reduced data cleanup
- "Interview acceptance rate" (PV) → "Time to Hire" (BV) - through funnel efficiency

**Action**: Auto-link but note "Indirect causality - verify impact magnitude"

---

### Weak Causality (Low Confidence)

**Definition**: Tenuous link between PV and BV; logic requires significant assumptions

**Examples**:
- "Shortlist time" (PV) → "Retention" (BV) - fast shortlisting doesn't directly improve retention ❌
- "SMS sent" (PV) → "New Hire Retention" (BV) - messaging channel doesn't directly affect retention ❌
- "Career site page load time" (PV) → "Quality of Hire" (BV) - UX speed doesn't affect hire quality ❌

**Action**: **Flag for PM review** - "⚠️ Weak causality link; validate this relationship before using"

## Auto-Linking Algorithm

When the skill generates a PV metric, apply this logic:

```
1. Classify PV metric by type (Time/Volume/Quality/Reach/Conversion)
2. Look up category-based BV matches from table above
3. For each candidate BV metric:
   a. Check causality logic
   b. Assign confidence level (Direct/Indirect/Weak)
   c. If Direct or Indirect: Include in output
   d. If Weak: Flag for PM review
4. Provide causality explanation in output (1 sentence per PV→BV link)
```

### Example Algorithm Execution

**PV Metric**: "Avg. time to shortlist 10 candidates"

**Step 1**: Classify → **Time/Speed PV**

**Step 2**: Look up category matches → "Time to Hire", "Interview Time metrics", "Productivity metrics"

**Step 3a**: Check "Time to Hire" causality → Faster shortlisting directly reduces hiring cycle → **Direct (High)**

**Step 3b**: Check "Productivity" causality → Time saved on shortlisting increases capacity → **Indirect (Medium)**

**Step 4**: Output with explanations:
```
**Avg. time to shortlist 10 candidates** (PV) → drives **BV#1** (Time to Hire)
- Causality: Faster shortlisting directly reduces hiring cycle duration (Direct)
```

**Alternative output** (if including Productivity):
```
**Avg. time to shortlist 10 candidates** (PV) → drives **BV#1** (Time to Hire), **BV#2** (Recruiter Capacity)
- Causality: Direct impact on hiring speed; indirect impact on capacity via time savings
```

## Special Cases

### Case 1: Compliance/Legal PV Metrics

**Example PV**: "GDPR consent compliance rate" (% of candidates with valid consent)

**Drives BV**: 
- **Does NOT directly drive** standard BV metrics (Time to Hire, Productivity, etc.)
- **Creates**: New ad-hoc BV metric "Compliance Risk Mitigation"

**Action**: Flag as **special case** - "⚠️ Compliance PV: Does not drive standard BV metrics; creates new BV outcome (Compliance Risk Mitigation)"

### Case 2: Negative Metrics (Lower is Better)

**Example PV**: "Application dropout rate" (% who abandon application mid-flow)

**Inverted causality**: **Lower PV** → **Higher BV** (opposite of typical direction)

**Drives BV**: "Applicant Volumes" (fewer dropouts → more completions)

**Action**: Note inversion - "⚠️ Negative metric: Lower PV drives higher BV (fewer dropouts → more applications)"

### Case 3: Threshold/Binary PV Metrics

**Example PV**: "% of offers sent within 24 hours of interview" (threshold: >90%)

**Threshold-based**: Not a continuous improvement metric; goal is to exceed threshold

**Drives BV**: "Time to Hire" (faster offers → faster hiring)

**Action**: Note threshold - "Target: >90% (binary goal, not continuous optimization)"

## Validation Checklist for Auto-Linking

Before finalising PV→BV linkages, validate:

- [ ] **Causality is clear**: Can you explain how PV change causes BV change in 1 sentence?
- [ ] **Direction is correct**: Does PV increase cause BV increase (or decrease for negative metrics)?
- [ ] **Confidence is accurate**: Direct link vs. secondary effects?
- [ ] **No circular logic**: PV and BV aren't just reworded versions of same metric
- [ ] **1-2 BV links max**: Don't over-link (reduces clarity)

## Common Linkage Patterns (Quick Reference)

| PV Metric Pattern | Typical BV Linkage | Confidence |
|---|---|---|
| "Avg. time to [action]" | Time to Hire | Direct |
| "# of [items] processed per [user]/[time]" | Productivity (Capacity) | Direct |
| "Match accuracy: % [items] correct" | Time to Hire, Retention | Indirect |
| "[User] response rate to [channel]" | Candidate Experience (Reach) | Direct |
| "Conversion rate: [stage A] → [stage B]" | Applicant Volumes | Direct |
| "Error rate in [process]" | Productivity (via rework reduction) | Indirect |
| "Data quality: % [fields] complete" | Productivity (via cleanup reduction) | Indirect |
| "Engagement rate with [feature]" | Candidate Experience | Direct |

## Anti-Patterns (Do NOT Link)

### ❌ Anti-Pattern 1: Time PV → Retention BV

**Example**: "Shortlist time" (PV) → "New Hire Retention" (BV)

**Problem**: Fast shortlisting doesn't directly improve retention quality

**Fix**: Link to direct BV - "Shortlist time" → "Time to Hire"

**Exception**: If JTBD explicitly mentions quality ("shortlist **qualified** candidates quickly"), then add Quality PV metric that DOES link to Retention

---

### ❌ Anti-Pattern 2: Volume PV → Quality BV (without quality mechanism)

**Example**: "# of candidates messaged" (PV) → "Retention (Quality of Hire)" (BV)

**Problem**: Messaging volume doesn't improve hire quality

**Fix**: Link to Reach/Volumes BV - "# candidates messaged" → "Candidate Experience (Reach)", "Applicant Volumes"

---

### ❌ Anti-Pattern 3: Channel/UX PV → Quality BV

**Example**: "Mobile career site load time" (PV) → "Quality of Hire" (BV)

**Problem**: UX speed doesn't affect hire quality

**Fix**: Link to Experience/Volumes BV - "Load time" → "Candidate Experience", "Applicant Volumes" (via reduced bounce rate)

---

### ❌ Anti-Pattern 4: Technical PV → Business BV (no user outcome)

**Example**: "# of API calls per second" (PV) → "Time to Hire" (BV)

**Problem**: Technical metric, no clear user outcome in between

**Fix**: Use outcome-based PV - "Time to load search results" → "Time to Hire" (user-facing outcome, measurable)

## Worked Examples (End-to-End)

### Example 1: AI Candidate Screening

**Feature**: "AI-powered candidate screening that ranks applicants by fit for high-volume roles"

**JTBD**: "When reviewing 200+ applications, I want to identify qualified candidates quickly so I can shortlist 10-15 for interviews in <1 hour"

**Generated PV Metrics**:

1. **Avg. time to shortlist 10 candidates** (Time PV)
   - Drives: **Time to Hire** (BV)
   - Causality: Faster shortlisting → shorter hiring cycle
   - Confidence: Direct (High)

2. **# of applications auto-screened per recruiter/month** (Volume PV)
   - Drives: **Productivity (Recruiter Capacity)** (BV)
   - Causality: Automation → more JRs per recruiter
   - Confidence: Direct (High)

3. **Qualified candidate match accuracy** (Quality PV)
   - Drives: **Time to Hire** (BV), **Retention (Quality of Hire)** (BV)
   - Causality: Better matches → fewer interview cycles + better hires
   - Confidence: Indirect (Medium) for both

**Multi-BV linkage**: PV#3 drives 2 BV metrics (1:2 pattern)

---

### Example 2: WhatsApp Candidate Messaging (GCC)

**Feature**: "Bulk WhatsApp messaging for GCC candidate engagement"

**JTBD**: "When GCC candidates don't respond to email, I want to message them on WhatsApp so I can reach them where they communicate and fill roles 40% faster"

**Generated PV Metrics**:

1. **Candidate response rate to WhatsApp vs. email** (Reach PV)
   - Drives: **Candidate Experience (Reach)** (BV)
   - Causality: Higher response rate → more candidates reached
   - Confidence: Direct (High)

2. **Time from message sent to candidate reply** (Time PV)
   - Drives: **Time to Hire** (BV)
   - Causality: Faster replies → shorter funnel duration
   - Confidence: Direct (High)

3. **# of candidates engaged via WhatsApp per recruiter/month** (Volume PV)
   - Drives: **Candidate Experience (Reach)** (BV), **Applicant Volumes** (BV)
   - Causality: More touchpoints → more reach + more applications
   - Confidence: Direct (High)

**Multi-BV linkage**: PV#3 drives 2 BV metrics (1:2 pattern)

---

### Example 3: Interview Scheduling Automation

**Feature**: "Self-service interview scheduling with calendar integration"

**JTBD**: "When coordinating interviews across 5 time zones, I want to schedule automatically so I can eliminate 2-3 hours of back-and-forth emails per interview"

**Generated PV Metrics**:

1. **Avg. time to confirm interview from request** (Time PV)
   - Drives: **Interview Time (Time to First Session)** (BV)
   - Causality: Faster scheduling → shorter interview process
   - Confidence: Direct (High)

2. **# of interviews auto-scheduled per coordinator/week** (Volume PV)
   - Drives: **Productivity (Coordinator Capacity)** (BV)
   - Causality: Automation → more interview volume capacity
   - Confidence: Direct (High)

3. **Interview scheduling error rate** (Quality PV, negative metric)
   - Drives: **Candidate Experience** (BV)
   - Causality: Fewer errors → better candidate/interviewer experience
   - Confidence: Indirect (Medium)

**Note**: PV#3 is a **negative metric** (lower is better)

---

### Example 4: Talent Pool Matching

**Feature**: "AI-powered talent pool matching for instant candidate suggestions"

**JTBD**: "When a new JR opens, I want to instantly see matched candidates from talent pools so I can engage qualified candidates within 24 hours instead of 3-5 days of sourcing"

**Generated PV Metrics**:

1. **Time to surface matched candidates from JR post** (Time PV)
   - Drives: **Time to Hire** (BV)
   - Causality: Instant matching → faster sourcing → faster hiring
   - Confidence: Direct (High)

2. **# of talent pool candidates auto-matched per JR** (Volume PV)
   - Drives: **Productivity (Recruiter Capacity)** (BV)
   - Causality: Automation reduces sourcing time → more JRs manageable
   - Confidence: Direct (High)

3. **Talent pool match relevance rate** (Quality PV)
   - Drives: **Time to Hire** (BV)
   - Causality: Relevant matches → fewer sourcing iterations → faster hiring
   - Confidence: Indirect (Medium)

---

### Example 5: Offer Letter Automation

**Feature**: "Bulk offer letter generation with template library"

**JTBD**: "When extending offers to 50+ campus hires, I want to generate offer letters in bulk so I can reduce offer preparation from 3 days to 1 hour"

**Generated PV Metrics**:

1. **Avg. time to generate 50 offer letters** (Time PV)
   - Drives: **Time to Hire** (BV)
   - Causality: Faster offer prep → shorter offer stage → faster hiring
   - Confidence: Direct (High)

2. **# of offers generated per coordinator/week** (Volume PV)
   - Drives: **Productivity (Coordinator Capacity)** (BV)
   - Causality: Bulk capability → more offer throughput per coordinator
   - Confidence: Direct (High)

3. **Offer letter error rate** (Quality PV, negative metric)
   - Drives: **Candidate Experience** (BV)
   - Causality: Fewer errors → better offer experience → less candidate confusion
   - Confidence: Indirect (Medium)

**Note**: PV#3 is a **negative metric** (lower is better)

## Edge Case Handling

### Case 1: PV Cannot Be Linked to Standard BV Metrics

**Example**: "System uptime for career site" (Technical PV)

**Problem**: Uptime is infrastructure, not a product outcome metric

**Fix**: Reframe as user-facing outcome:
- **Better PV**: "Career site page load time" (UX metric)
- **Drives BV**: Candidate Experience (better UX), Applicant Volumes (lower bounce rate)

**If technical metric is unavoidable**, flag it:
- "⚠️ Technical PV: No direct BV linkage; use as instrumentation metric only"

### Case 2: PV Links to Non-Standard BV Metric

**Example**: "Compliance audit pass rate" (Quality PV)

**Problem**: No standard BV metric for compliance

**Solution**: Create ad-hoc BV metric:
- **New BV**: "Compliance Risk Mitigation"
- **PV→BV link**: "Audit pass rate" (PV) → "Compliance Risk Mitigation" (BV)
- **Flag in output**: "⚠️ Ad-hoc BV metric (not in standard CSV); validate with Metrics team"

### Case 3: Multiple Time PV Metrics for Same Feature

**Example**: Feature has 3 time-based PV metrics

**Problem**: All 3 would link to "Time to Hire", creating redundancy

**Solution**: Prioritise by impact magnitude:
1. Keep PV with largest time savings (biggest impact on Time to Hire)
2. Consider combining into composite metric
3. Or diversify PV types (keep 1 Time PV, replace others with Volume/Quality PV)

**Validation**: Limit to 1-2 Time PV metrics per feature

## Output Formatting

When the `/value-metrics` skill presents PV→BV linkages, use this format:

```markdown
1. **[PV Metric Name]** (PV) → drives **BV#[N]** ([BV Metric Name])
   - Measures: [PV calculation]
   - JTBD alignment: [Trace to JTBD language]
   - Target: [Target with baseline]
   - Causality: [1-sentence explanation] ([Confidence level])
```

**Multi-BV example**:
```markdown
3. **Qualified candidate match accuracy** (PV) → drives **BV#1** (Time to Hire), **BV#2** (Retention)
   - Measures: % of AI-screened candidates approved by hiring managers
   - JTBD alignment: "qualified candidates" quality requirement
   - Target: >80% match rate
   - Causality: Better matches → fewer interview cycles (BV#1, Indirect) + better hires (BV#2, Indirect)
```

## References

**PV Derivation Patterns**: `.cursor/skills/value-metrics/pv-derivation-guide.md`
**JTBD Integration**: `.cursor/skills/jtbd-analysis/SKILL.md`
**BV Metrics Reference**: `docs/metrics/talent-acquisition-value-metrics.csv`
**Skill Logic**: `.cursor/skills/value-metrics/SKILL.md`
