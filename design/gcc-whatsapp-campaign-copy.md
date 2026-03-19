# UX Copy Review: GCC WhatsApp Candidate Campaign Prototype

**Source:** `design/gcc-whatsapp-campaign.tsx`  
**Context:** MISSION-009 – GCC E2E Pipeline  
**Reviewed:** 18 March 2026  
**Reviewer:** 310-doc-writer (Editorial Guidelines)

---

## Summary

- **Total issues found:** 12
- **Critical:** 2 (error message clarity, radio label ambiguity)
- **Quick wins:** 7 (em-dash, redundancy, pluralisation, terminology)
- **Consistency:** 2 (terminology, radio label vs aria-label)
- **Legal review required:** 3 items flagged for 060-legal-advisor

---

## Button Labels

### ✅ "Send campaign"
**Status:** Compliant  
Action-oriented, verb + noun, sentence case.

### ✅ "Sending campaign..."
**Status:** Compliant  
Present continuous, clear loading state.

### ✅ "Save draft"
**Status:** Compliant  
Action-oriented, sentence case.

---

## Headings and Subheadings

### ❌ "Extend campaigns beyond email to WhatsApp—the dominant recruitment channel in GCC (5–15 min response vs 24–48 hours email)."
**Issues:**
- Em-dash (—) violates style guide (use hyphen or comma)
- Long parenthetical reduces scannability
- "24–48 hours email" – missing "for" (24–48 hours for email)

**✅ Recommended:** "Extend campaigns beyond email to WhatsApp, the dominant recruitment channel in GCC. Typical response time: 5–15 minutes vs 24–48 hours for email."

**Rationale:** Style guide forbids em-dashes; split into two sentences for clarity; fix grammar.

### ✅ "WhatsApp candidate campaign"
**Status:** Compliant  
Sentence case, concise.

### ✅ "Campaign details", "Recipients", "Create campaign", "Templates", "Analytics"
**Status:** Compliant  
Sentence case, scannable.

---

## Error Messages

### ❌ "No candidates have opted in to WhatsApp. Add candidates with consent or use email only."
**Issues:**
- "Add candidates with consent" – ambiguous (add consent? add consented candidates?)
- "use email only" – unclear who does what (system sends email, or user switches to email?)

**✅ Recommended:** "No candidates have opted in to WhatsApp. Add candidates who have opted in, or send this campaign via email only."

**Rationale:** Clearer action; specifies what "email only" means (send via email).

---

## Success Messages

### ❌ "Campaign sent successfully. Your campaign was sent to {optedInCount} candidates via WhatsApp. WhatsApp messages typically receive responses in 5–15 minutes vs 24–48 hours for email."
**Issues:**
- Redundant: "Campaign sent successfully" and "Your campaign was sent" repeat the same idea
- Third sentence is marketing/context, not essential for success confirmation
- Wordy for a success banner

**✅ Recommended:** "Campaign sent successfully to {optedInCount} candidates via WhatsApp."

**Rationale:** Concise, past tense + context, no redundancy. Response-time context can live in help text or analytics, not the success banner.

---

## Warning Messages (Recipients)

### ❌ "{noConsentCount} candidate(s) have not opted in to WhatsApp. They will receive email only. Ensure consent is captured for PDPL/PDPA compliance."
**Issues:**
- "candidate(s)" – awkward pluralisation; use dynamic text: "1 candidate has" vs "4 candidates have"
- **Legal-sensitive:** "Ensure consent is captured for PDPL/PDPA compliance" – compliance messaging; **flag for 060-legal-advisor**

**✅ Recommended (copy only):** "{noConsentCount} {noConsentCount === 1 ? 'candidate has' : 'candidates have'} not opted in to WhatsApp. They will receive email only. Ensure consent is captured for PDPL/PDPA compliance."

**Rationale:** Proper pluralisation. The PDPL/PDPA sentence should be validated by 060 for accuracy and completeness.

---

## Form Labels and Placeholders

### ✅ "Campaign name", "Message template", "Schedule", "Country filter"
**Status:** Compliant  
Sentence case, clear.

### ⚠️ "e.g. Q2 Interview Reminders"
**Issues:**
- Placeholder uses Title Case ("Q2 Interview Reminders"); should be sentence case for consistency

**✅ Recommended:** "e.g. Q2 interview reminders"

**Rationale:** Editorial Guidelines: sentence case for UI text.

---

## Radio Options (Schedule)

### ❌ "Schedule" (visible label) vs "Schedule for later" (aria-label)
**Issues:**
- Inconsistency between visible text and aria-label
- "Schedule" alone is ambiguous next to "Send now" (schedule what? when?)

**✅ Recommended:** "Schedule for later" (visible and aria-label)

**Rationale:** Specific, matches user intent, consistent with accessibility label.

---

## Table Headers

### ✅ "Candidate", "Company", "Country", "Consent", "Delivery status"
**Status:** Compliant  
Sentence case, consistent terminology.

---

## Consent Status Labels (Table)

### ⚠️ "Opted in", "No consent"
**Status:** **Flag for 060-legal-advisor**

**Context:** These labels indicate candidate consent status for WhatsApp messaging in GCC (PDPL/PDPA context). 060 should validate:
- Terminology accuracy for GCC regulations (UAE PDPL, Saudi PDPL, etc.)
- Whether "No consent" is sufficiently clear vs "Consent not given" or "Opted out"
- Consistency with Workday Recruiting consent terminology

**Recommendation:** Retain "Opted in" and "No consent" pending 060 validation. These are standard terms but should be confirmed for GCC compliance.

---

## Delivery Status Labels

### ✅ "Sent", "Delivered", "Read", "Failed", "Pending"
**Status:** Compliant  
Sentence case, consistent, clear.

---

## Recipient Summary Text

### ⚠️ "{optedInCount} candidates will receive this campaign via WhatsApp. {noConsentCount > 0 ? `${noConsentCount} will receive email only.` : ''}"
**Issues:**
- Second sentence: "{noConsentCount} will receive email only" – missing "candidates" for clarity
- Slightly abrupt

**✅ Recommended:** "{optedInCount} candidates will receive this campaign via WhatsApp.{noConsentCount > 0 ? ` ${noConsentCount} will receive via email only.` : ''}"

**Rationale:** "via email" is clearer than "email only". "candidates" is implied by context but could be explicit: "{noConsentCount} candidates will receive via email only."

---

## Templates Tab

### ⚠️ "Pre-approved WhatsApp Business API templates for common use cases. Templates must be approved by Meta before use."
**Issues:**
- "Meta" – some users may not associate Meta with WhatsApp; "WhatsApp" is clearer for recruiters
- "Pre-approved" – could mean "pre-approved by us" or "pre-approved by WhatsApp"; slightly ambiguous

**✅ Recommended:** "Pre-approved WhatsApp Business templates for common use cases. Templates must be approved by WhatsApp before use."

**Rationale:** "WhatsApp" is the product users know; "Meta" adds jargon. "WhatsApp Business API" can stay in technical docs.

---

## Analytics Tab

### ✅ "Campaign-level and message-level delivery status. 98% delivery rate typical for GCC (high WhatsApp penetration)."
**Status:** Compliant  
Numbers as numerals (98%), sentence case. Minor: "Campaign-level" and "message-level" are acceptable compound modifiers.

---

## Legal-Sensitive Copy – 060 Review Required

The following copy should be validated by **060-legal-advisor** before finalising:

| Location | Copy | Concern |
|----------|------|---------|
| Recipients warning | "Ensure consent is captured for PDPL/PDPA compliance." | Accuracy of PDPL/PDPA reference; completeness of compliance guidance |
| Consent status labels | "Opted in", "No consent" | GCC-specific terminology; alignment with UAE PDPL, Saudi PDPL, PDPA |
| Error message | "No candidates have opted in to WhatsApp. Add candidates who have opted in, or send this campaign via email only." | References consent; ensure no misleading implications |

**060 Checklist (from 060-legal-advisor):**
- [ ] Consent placement and wording (GDPR Art. 7 - specific, informed, unambiguous)
- [ ] Transparency (Art. 5, 13, 14): clear, plain language
- [ ] Accuracy: no misleading statements
- [ ] GCC-specific: PDPL (UAE, Saudi), PDPA alignment

### Preliminary Legal Assessment (310; 060 should confirm)

Based on 060-legal-advisor's documented expertise:

| Copy | Assessment |
|------|-------------|
| "Opted in" / "No consent" | Standard consent terminology. GCC (UAE PDPL, Saudi PDPL) requires consent for marketing/WhatsApp messaging. "Opted in" implies affirmative consent; "No consent" is clear. **060 should confirm** alignment with local law terminology. |
| "Ensure consent is captured for PDPL/PDPA compliance" | PDPL = UAE/Saudi data protection laws; PDPA = Singapore/Thailand. GCC context suggests PDPL. Message is accurate but **060 should verify** whether "PDPA" is appropriate for GCC (may cause confusion; GCC uses PDPL). |
| Error message | "Add candidates who have opted in" – clear, no misleading legal implications. ✓ |

**Recommendation:** Invoke **060-legal-advisor** to validate consent labels and PDPL/PDPA wording before finalising. Do not ship legal-sensitive copy without 060 confirmation.

---

## Implementation Summary

### Changes to apply in `gcc-whatsapp-campaign.tsx`

| Line / Area | Current | Recommended |
|-------------|---------|-------------|
| Subheading | "Extend campaigns beyond email to WhatsApp—the dominant..." | "Extend campaigns beyond email to WhatsApp, the dominant recruitment channel in GCC. Typical response time: 5–15 minutes vs 24–48 hours for email." |
| Success message | "Campaign sent successfully. Your campaign was sent to..." | "Campaign sent successfully to {optedInCount} candidates via WhatsApp." |
| Error message | "No candidates have opted in to WhatsApp. Add candidates with consent or use email only." | "No candidates have opted in to WhatsApp. Add candidates who have opted in, or send this campaign via email only." |
| Warning (recipients) | "{noConsentCount} candidate(s) have not opted in..." | Dynamic: `{noConsentCount} ${noConsentCount === 1 ? 'candidate has' : 'candidates have'} not opted in to WhatsApp. They will receive email only. Ensure consent is captured for PDPL/PDPA compliance.` |
| Placeholder | "e.g. Q2 Interview Reminders" | "e.g. Q2 interview reminders" |
| Radio label | "Schedule" | "Schedule for later" |
| Recipient summary | "{noConsentCount} will receive email only" | "{noConsentCount} candidates will receive via email only" |
| Templates body | "...approved by Meta before use" | "...approved by WhatsApp before use" |

---

## Overall Assessment

The prototype copy is largely aligned with Workday Editorial Guidelines. Most headings, buttons, and table headers use sentence case and clear terminology. The main improvements are:

1. **Style compliance:** Replace em-dash, fix pluralisation, ensure placeholders use sentence case.
2. **Clarity:** Tighten error and success messages; make the Schedule radio label explicit.
3. **Legal validation:** Consent labels and PDPL/PDPA messaging must be reviewed by 060-legal-advisor before production.

After 060 validates the legal-sensitive copy, the prototype is ready for 330-ux-designer Figma capture.
