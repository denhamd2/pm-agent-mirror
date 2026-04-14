# Email Response Draft - Roche Multi-Location Purge

**To:** André Pille  
**Cc:** Lynda Taumann-Yrisarry, Megan O'Mera  
**Re:** Roche - Data Retention/Purging for Multi-Location Requisitions  
**Context:** Forwarded email thread, 13 April 2026 follow-up

---

## Recommended Response

Hi André,

Thanks for flagging this. I've reviewed the full thread and Conal's assessment - this is a legitimate product gap that affects global customers with location-agnostic hiring.

**Bottom Line:**  
Yes, we should prioritize this. It's a compliance risk (Roche's Data Governance Officer flagged it as non-compliant), technically feasible (Conal confirmed), and affects any customer hiring across jurisdictions with different retention rules.

**The Problem (Validated):**

Roche has requisitions where candidates can apply for roles in multiple countries (e.g., primary location Basel, additional location San Francisco). Our purge logic uses the req's **Primary Location** to set the retention clock, but they need to purge based on the **candidate's intended work location** because:
- Switzerland (GDPR): 6 months post-rejection  
- USA (EEOC): 6 years post-rejection

Without capturing the candidate's chosen location, they can't comply with both jurisdictions simultaneously - they're either over-retaining EU data (GDPR risk) or under-retaining US data (legal discovery risk).

**Why Our 2026R1 Purge Work Doesn't Solve This:**

The granular PDTs we shipped in 2026R1 (splitting attachments from personal info) address **what** to purge, not **when** to purge based on location. This is a separate gap in our data model: we don't currently expose the candidate's intended work location as a first-class attribute on the Job Application.

**Solution Approach (Conal is Right):**

The fundamental ask is exposing **"Candidate's Intended Work Location"** as a structured data point on Job Applications from multi-location requisitions. This would:

1. **Capture at application time**: Add a location selector (or prescreening question, but make it system-managed not recruiter-managed) when a candidate applies to a multi-location req  
2. **Store as structured data**: Surface this as a reportable field on Job Application (not buried in freeform questionnaire responses)  
3. **Enable location-based purge rules**: Privacy admins can then build purge plans using custom reports that filter by "Candidate Intended Location" and apply jurisdiction-specific PDTs and timelines

**Why This Matters Beyond Roche:**

- **Compliance risk**: Any global enterprise with cross-border hiring faces this (especially post-GDPR, DPDP Act, LGPD)  
- **Market differentiation**: SAP SuccessFactors and Oracle have similar limitations - we could lead here  
- **Scalable pattern**: This pattern extends to other jurisdiction-specific compliance needs (pay transparency, background check rules, etc.)

**What I Recommend We Tell Lynda/Roche:**

1. **Acknowledge the gap**: "You're right - our current purge logic doesn't support location-based routing for multi-location reqs. This is a known limitation."  
2. **Commit to roadmap evaluation**: "We're evaluating this for a future release. The solution requires exposing candidate intended location as a structured data point, which is technically feasible but needs to be scoped and prioritised against other compliance work."  
3. **Short-term mitigation**: "For now, the workaround is separate reqs per country (we know this is manual, but it's the only compliant path until we ship the data model enhancement). Alternatively, set retention to the longest required period (6 years) and accept over-retention in EU markets."  
4. **PER welcome**: "Please do open a PER - it helps us track customer demand and prioritise this work."

**Next Steps for Us:**

1. **Scope the work**: Partner with Recruiting Engineering to size the effort (likely a data model change + UI for location selector + validation rules)  
2. **Competitive scan**: Check what SAP/Oracle/Greenhouse do here (I suspect they have the same gap)  
3. **Roadmap slot**: Evaluate for 2026R2 or 2027R1 depending on complexity and other POI-488 (Compliance) commitments  
4. **Customer validation**: Talk to 2-3 other global customers (e.g., Accenture, Deloitte, Shell) to validate demand

**My Vote:**  
This should go into our compliance backlog as a **Medium** priority (not urgent enough to disrupt 2026R2 commitments, but important enough to roadmap for 2027R1). I'd position it as part of our broader "Compliance-First Global Recruiting" narrative.

Happy to discuss further - let me know if you want me on the call with Lynda/Roche.

— David

---

## Key Points for Email

- ✅ **Validates the gap**: Yes, this is a real product limitation  
- ✅ **Explains why 2026R1 doesn't solve it**: Different problem (what vs when/where)  
- ✅ **Proposes clear solution**: Expose candidate intended location as structured data  
- ✅ **Acknowledges compliance risk**: GDPR + EEOC creates impossible choice  
- ✅ **Recommends roadmap path**: Medium priority, 2027R1 candidate  
- ✅ **Gives Lynda clear customer messaging**: Acknowledge gap, commit to evaluate, provide mitigation  
- ✅ **Positions strategically**: Market differentiation + scalable compliance pattern

