# Legal & Compliance Assessment: GCC WhatsApp Integration – Figma Design Capture

**Invoked by**: 330-figma-creator (after capture to Figma)  
**Date**: 19 March 2026  
**Figma File**: https://www.figma.com/design/tW2Gmvwbqjtsn8I5oSk0jd  
**Mission**: MISSION-013 (GCC E2E Pipeline)

---

## Design Context (Captured Screens)

1. **Candidate Profile with collaboration panel** – Personal Information card with WhatsApp consent status (Opted in); Collaboration panel with Send WhatsApp action
2. **Template selector modal** – Pre-approved templates with variable preview; Recipient block; Send/Cancel actions
3. **Consent warning state** – (In prototype: Banner "Candidate has not opted in to WhatsApp. Consent required before sending." when candidate has no consent; Send button disabled)

---

## Design Compliance Checklist

| Item | Status | Notes |
|------|--------|-------|
| Consent placement and wording | ✅ Pass | Consent status visible on Personal Information card; clear labels (Opted in, No consent, Opted out) |
| Consent warning when no consent | ✅ Pass | Banner blocks Send; copy is clear and actionable |
| Privacy notice visibility | ⚠️ Note | Design does not show career site consent flow; PRD specifies consent capture during application |
| AI disclosure | N/A | No AI features |
| Data collection minimization | ✅ Pass | Forms show only necessary fields (recipient, template, preview) |
| Error messages about data | ✅ Pass | Consent warning is accurate and not misleading |
| Retention messaging | ⚠️ Future | Ensure production design includes opt-out link in message templates per PDPL/PDPA |
| Accessibility | ✅ Pass | Canvas Kit components with ARIA; keyboard navigation |

---

## Risk Level: **Low** (for design handoff)

---

## Recommended Actions for Design Handoff

1. **Production design** – Ensure opt-out link placement is specified in message template designs
2. **Consent flow** – Design career site consent capture flow (separate from this prototype)
3. **Template variables** – Design clearly shows variable preview; ensure production validates substitution

---

**Conclusion**: Captured Figma design demonstrates consent-first UX. No blocking compliance issues for design handoff to backlog refinement.
