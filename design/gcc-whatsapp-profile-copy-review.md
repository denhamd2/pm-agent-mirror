# UX Copy Review: GCC WhatsApp on Candidate Profile

**Source:** `design/gcc-whatsapp-campaign.tsx`  
**Prototype URL:** http://localhost:5182/  
**Context:** MISSION-011 – GCC E2E Pipeline (Candidate Profile placement)  
**Reviewed:** 19 March 2026  
**Reviewer:** 310-doc-writer (Editorial Guidelines)

---

## Summary

- **Total issues found:** 3
- **Critical:** 0
- **Quick wins:** 2 (consent error message, banner text)
- **Consistency:** 1 (terminology)

---

## Button Labels

### ✅ "Send WhatsApp message"
**Status:** Compliant  
Action-oriented, verb + noun, sentence case.

### ✅ "Send message" / "Sending message..."
**Status:** Compliant  
Present continuous for loading state.

### ✅ "Cancel", "Email candidate", "View application"
**Status:** Compliant  
Sentence case, action-oriented.

---

## Error Messages

### ❌ "This candidate has not opted in to WhatsApp communication. Please obtain consent first."
**Issues:**
- "Please obtain consent first" – vague (how? where?)
- Could be more actionable

**✅ Recommended:** "This candidate has not opted in to WhatsApp. Add consent on the candidate profile or career site before sending."

**Rationale:** Clearer next step; references where consent is captured.

---

## Info Banner

### ❌ "WhatsApp messages typically receive responses in 5-15 minutes vs 24-48 hours for email. Ensure message complies with PDPL/PDPA requirements."
**Issues:**
- Two unrelated ideas in one sentence (response time + compliance)
- "Ensure message complies" – passive; could be clearer

**✅ Recommended:** Split into two:
- "WhatsApp messages typically receive responses in 5–15 minutes vs 24–48 hours for email."
- "Ensure your message complies with PDPL/PDPA requirements." (or move to help text)

**Rationale:** Separate context from compliance reminder; clearer structure.

---

## Headings and Labels

### ✅ "Candidate profile", "WhatsApp consent", "Message template", "Message preview", "Recipient"
**Status:** Compliant  
Sentence case, scannable.

### ✅ "Opted in", "Opted out", "No consent"
**Status:** Compliant  
Consistent terminology.

---

## Overall Assessment

Copy is largely compliant with Editorial Guidelines. Three minor improvements recommended. No legal-sensitive copy requiring 060-legal-advisor review for this candidate profile flow (consent status display and send action; consent capture is on career site per PRD).
