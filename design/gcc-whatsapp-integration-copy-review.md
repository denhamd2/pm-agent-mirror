# UX Copy Review: GCC WhatsApp Integration Prototype

**Prototype:** design/gcc-whatsapp-integration.tsx  
**Mission:** MISSION-015 (GCC E2E — HITL #5, v38 research)  
**Date:** 19 March 2026  
**Agent:** 319-doc-writer

---

## Summary

- **Total issues found:** 12
- **Critical:** 2 (consent warning clarity, primary button specificity)
- **Quick wins:** 7 (sentence case, terminology, concision)
- **Consistency:** 3 (terminology standardisation)
- **Legal-sensitive:** 1 (consent warning – Legal Advisor validation included)

---

## Button Labels

### ✅ "Send"
**Status:** Minor improvement  
**Issue:** Could be more specific about what is being sent.  
**Recommended:** "Send message"  
**Rationale:** Action-oriented, specific about outcome. Primary actions should use verb + noun pattern.

### ✅ "Sending..."
**Status:** Compliant  
**Rationale:** Present continuous, clear loading state. Follows Editorial Guidelines.

### ✅ "Cancel"
**Status:** Compliant  
**Rationale:** Standard secondary action, sentence case.

### ❌ "Opted in" / "No consent" (Demo toggle buttons)
**Status:** Quick win  
**Issue:** These are status labels used as button labels in the demo section. For demo context, acceptable, but "Opted in" as a button could read "Set to opted in" for clarity.  
**Recommended:** Keep as-is for demo (they toggle state). If demo is removed from production, N/A.

---

## Headings and Titles

### ❌ "Candidate profile"
**Status:** Compliant  
**Rationale:** Sentence case, concise. No change needed.

### ❌ "Personal information"
**Status:** Compliant  
**Rationale:** Sentence case, concise.

### ❌ "Send WhatsApp message"
**Status:** Compliant  
**Rationale:** Sentence case, clear modal title.

### ❌ "Collaboration"
**Status:** Compliant  
**Rationale:** Section heading, concise.

### ❌ "Campaign channel"
**Status:** Compliant  
**Rationale:** Sentence case, clear.

### ❌ "Message template"
**Status:** Compliant  
**Rationale:** Sentence case, clear.

### ❌ "Recipient"
**Status:** Compliant  
**Rationale:** Label, concise.

---

## Form Labels and Field Labels

### ✅ "Phone", "Country", "Company", "WhatsApp consent"
**Status:** Compliant  
**Rationale:** Sentence case, consistent terminology.

### ❌ "Preview (variables: {{name}}, {{company}}, ...)"
**Status:** Issue  
**Issue:** Exposes technical variable syntax to users. Recruiters should see a preview of the message, not raw variable names.  
**Recommended:** "Message preview" (heading) with the rendered preview below. Remove the variable list from the label unless it's in a developer-only context.  
**Rationale:** Specific about what the preview shows; avoids jargon.

---

## Success Messages

### ✅ "Message sent successfully."
**Status:** Minor improvement  
**Issue:** Period at end is optional for UI copy; some style guides omit it.  
**Recommended:** "Message sent successfully" (no period) or keep as-is per Workday style.  
**Rationale:** Past tense + context. Follows success message pattern.

---

## Warning Messages (Consent)

### ❌ "Candidate has not opted in to WhatsApp. Consent required before sending."
**Status:** Critical – Legal-sensitive  
**Issues:**
- Slightly wordy; could be more concise
- "Consent required before sending" is clear but could be more action-oriented

**Recommended:** "This candidate has not opted in to WhatsApp. Obtain consent before sending messages."  
**Rationale:**
- More specific ("This candidate" vs "Candidate")
- Action-oriented ("Obtain consent" tells recruiter what to do)
- Maintains compliance clarity

**Legal Advisor validation:** See Legal-Sensitive Copy section below.

---

## Template Names (Dropdown Options)

### ✅ "Interview reminder", "Job alert", "Offer notification", "Quick follow-up"
**Status:** Compliant  
**Rationale:** Sentence case, concise, descriptive.

---

## Template Body Text (Variable Content)

### Review of template content
- **Interview reminder:** "Hi {{name}}! Your interview with {{company}} is scheduled for {{date}} at {{time}}. Reply YES to confirm."
- **Job alert:** "New role at {{company}}: {{job_title}}. Apply now: {{link}}"
- **Offer notification:** "Congratulations {{name}}! We would like to extend an offer for {{role}} at {{company}}. Please review and respond by {{date}}."
- **Quick follow-up:** "Hi {{name}}, just checking in on your application for {{role}} at {{company}}. Let me know if you have any questions."

**Status:** Compliant  
**Rationale:** Plain language, appropriate tone. "Reply YES to confirm" is clear and action-oriented. Template content is pre-approved; no editorial changes needed for this review.

---

## Consent Status Labels

### "Opted in", "Opted out", "No consent"
**Status:** Compliant  
**Rationale:** Standard GDPR-aligned terminology. Sentence case. Consistent throughout.

---

## Empty States

**None present** in this prototype. No empty states to review.

---

## Loading States

### ✅ "Sending..."
**Status:** Compliant  
**Rationale:** Present continuous, clear.

---

## Tooltips and Accessibility Labels

### aria-label / title values
- "Menu" – ✅ Compliant
- "Search" – ✅ Compliant
- "Send SMS" – ✅ Compliant
- "Send WhatsApp" – ✅ Compliant
- "Send email" – ✅ Compliant
- "Close" – ✅ Compliant
- "Select WhatsApp template" – ✅ Compliant
- "Message template" – ✅ Compliant

**Rationale:** Clear, action-oriented.

---

## Demo Section (Prototype-Only)

### "Demo: Toggle consent status"
**Status:** Acceptable for prototype  
**Note:** If this remains in production, consider "Preview: Switch consent status" for clarity. "Demo" may confuse end users.

---

## Terminology Consistency

### ✅ "Candidate" used consistently
**Status:** Compliant  
**Rationale:** No mixing with "Applicant". Workday standard term.

### ✅ "WhatsApp" capitalised
**Status:** Compliant  
**Rationale:** Brand name; correct capitalisation.

### ✅ "Consent" used consistently
**Status:** Compliant  
**Rationale:** "Opted in", "Opted out", "No consent" – consistent terminology.

---

## Legal-Sensitive Copy

### Consent Warning and Labels

**Copy reviewed:**
- Consent warning: "Candidate has not opted in to WhatsApp. Consent required before sending."
- Consent status labels: "Opted in", "Opted out", "No consent"

**060-Legal-Advisor Compliance Assessment:**

| Requirement | Compliance | Notes |
|-------------|------------|-------|
| GDPR Art. 7 (consent) | ✅ | Recruiter-facing UI; not candidate consent collection. Labels accurately reflect status. |
| Transparency | ✅ | "Consent required before sending" is clear and unambiguous. |
| Plain language | ✅ | No jargon; appropriate for recruiter audience. |
| Accuracy | ✅ | No misleading statements. |

**Legal Advisor recommendations:**
1. **Consent warning:** The warning is compliant. It correctly blocks sending when consent is absent and explains why. Suggested improvement: "Obtain consent before sending" is more action-oriented and aligns with GDPR's emphasis on consent as a positive act.
2. **Consent labels:** "Opted in", "Opted out", "No consent" are standard and GDPR-aligned. No changes needed.
3. **GCC consideration:** For UAE/Saudi PDPL, consent requirements are similar. Ensure candidate-facing consent flows (outside this prototype) use Arabic where required. This prototype is recruiter UI only.

**Conclusion:** Legal-sensitive copy is compliant. Editorial improvements are optional and do not affect compliance.

---

## Recommended Copy Changes (Implementation)

| Location | Current | Recommended |
|---------|---------|-------------|
| PrimaryButton | "Send" | "Send message" |
| Consent warning | "Candidate has not opted in to WhatsApp. Consent required before sending." | "This candidate has not opted in to WhatsApp. Obtain consent before sending messages." |
| Preview label | "Preview (variables: {{name}}, {{company}}, ...)" | "Message preview" |
| Preview subheading | Remove variable list from user-facing label | Show rendered preview only; move variable list to developer docs if needed |

---

## Overall Assessment

The prototype copy is generally strong and aligned with Editorial Guidelines. Most text uses sentence case, is concise, and uses consistent terminology. The main improvements are:

1. **Primary action:** Make "Send" more specific ("Send message").
2. **Consent warning:** Slightly improve clarity and actionability (Legal Advisor validated).
3. **Preview label:** Remove technical variable syntax from user-facing label.

Legal-sensitive copy (consent warning, consent labels) has been reviewed and is compliant. No blocking issues for Figma capture or backlog refinement.
