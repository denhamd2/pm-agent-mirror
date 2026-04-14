# Slack Response Draft - Veterans Preference Attachment Purge

**To:** Hema Munnangi  
**Re:** HRREC-86263 - Veterans Preference Attachment purge and PDT question  
**Context:** PR #880, Ronan's question about whether relationship 3$117019 needs its own PDT

---

## Recommended Response

Hi Hema,

Thanks for reaching out. Looking at the PR and Ronan's question:

**Yes, I recommend a dedicated purge process for Veterans Preference Attachments, separate from the broader Job Application - Personal Information PDT.**

### Why a Dedicated Approach

1. **Protected attribute status:** Veteran status is a protected class under VEVRAA and other laws. This data requires a higher level of governance than general personal attachments (e.g., cover letters, portfolios). Treating it separately demonstrates appropriate care and minimizes compliance risk.

2. **Different retention requirements:** Veterans-related documentation may have jurisdiction-specific retention rules that differ from other job application data (e.g., OFCCP record-keeping for federal contractors). Grouping it with other attachments would force us to apply the longest retention period to everything, conflicting with data minimization principles. A dedicated process allows precise, compliant retention rules for this specific data type.

3. **Alignment with EEO strategy:** This supports our broader push to make EEO/protected-attribute data independently purgeable without purging the entire Job Application or Candidate record. This granular approach is exactly what Workday's modern purge framework is designed for, and it's a scalable model for other sensitive data (disability self-ID, etc.).

### Implementation Clarification

**Not a new PDT:** You don't need to create a new PDT (Workday manages those). Instead:
- Use a granular existing PDT like **Prospect and Candidate Personal Attachments**
- Build a highly specific custom report that isolates **only** Veterans Preference Attachments for purging
- This creates a dedicated purge process without requiring new PDTs

### Next Steps

1. Update your PR to use a more granular PDT (Prospect and Candidate Personal Attachments) rather than the broader Job Application - Personal Information PDT
2. Create a custom report that specifically targets Veterans Preference Attachments (relationship 3$117019)
3. Document the rationale (protected attribute, independent purge control) in your PR description

Happy to sync if you need more context on the implementation approach.

— David

---

## Key Points for Slack

- ✅ **Explicit answer:** Yes, use a dedicated purge process
- ✅ **Why:** Protected attribute, different retention requirements, EEO strategy alignment
- ✅ **How:** Granular existing PDT + specific custom report (not a new PDT)
- ✅ **Actionable:** Clear next steps for Hema to update the PR

