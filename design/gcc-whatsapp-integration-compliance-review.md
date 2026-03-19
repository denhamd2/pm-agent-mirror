# Legal & Compliance Assessment: GCC WhatsApp Integration Prototype

**Invoked by**: 320-prototype-developer (before handoff to 330-ux-designer)  
**Date**: 19 March 2026  
**Prototype**: design/gcc-whatsapp-integration.tsx  
**Mission**: MISSION-013 (GCC E2E Pipeline)

---

## Prototype Context

The prototype demonstrates WhatsApp candidate communication for GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman). Key screens reviewed:

1. **Candidate Profile** – Personal Information card with WhatsApp consent status (Opted in | No consent | Opted out)
2. **Collaboration panel** – Send WhatsApp action alongside SMS and Email icons
3. **Template selector modal** – Pre-approved templates with variable preview; consent warning when candidate has not opted in
4. **Campaign channel selector** – Email, WhatsApp, Email and WhatsApp options

---

## Applicable Regulations

- **Saudi PDPL** (Personal Data Protection Law) – Consent for messaging; data retention; opt-out
- **UAE PDPA** (Personal Data Protection Authority) – Similar consent and retention requirements
- **GCC regional equivalents** – Kuwait, Qatar, Bahrain, Oman have or are adopting data protection laws
- **GDPR** (if EU candidates) – Art. 6 (lawful basis), Art. 7 (consent), Art. 22 (automated decisions – N/A here)

---

## Compliance Checklist

| Item | Status | Notes |
|------|--------|-------|
| Consent placement and wording | ✅ Pass | Consent status visible on Personal Information card; clear labels (Opted in, No consent, Opted out) |
| Consent warning when no consent | ✅ Pass | Banner: "Candidate has not opted in to WhatsApp. Consent required before sending." – blocks Send when no consent |
| Privacy notice visibility | ⚠️ Note | Prototype does not show career site/application consent flow; PRD specifies consent capture during application |
| AI disclosure | N/A | No AI features |
| Data collection minimization | ✅ Pass | Only necessary fields (name, phone, template variables); no excessive data collection in prototype |
| Error messages about data | ✅ Pass | Consent warning is accurate and not misleading |
| Retention messaging | ⚠️ Future | PRD references audit trail and retention; prototype does not show retention/opt-out link in message – ensure production includes opt-out link per PDPL/PDPA |
| Accessibility | ✅ Pass | Uses Canvas Kit components with ARIA labels; keyboard navigation supported |

---

## Risk Level: **Low** (for prototype scope)

---

## Recommended Actions

1. **Production implementation**
   - Ensure opt-out link in every WhatsApp message (PDPL/PDPA requirement)
   - Ensure consent is captured at application (career site) and stored per candidate
   - Implement audit trail for all WhatsApp messages (PRD requirement)
   - Validate E.164 phone format for GCC numbers (+966, +971, +965, +974, +973, +968)

2. **Consent warning copy**
   - Current: "Candidate has not opted in to WhatsApp. Consent required before sending."
   - **Assessment**: Clear, specific, actionable. Compliant with GDPR Art. 7 (informed, unambiguous) and PDPL/PDPA expectations.

3. **Template variables**
   - Prototype shows {{name}}, {{company}}, {{date}}, {{time}}, etc. – ensure production validates and sanitises variable substitution to prevent data leakage or injection.

---

## Implementation Considerations

- **050-functional-knowledge**: Align WhatsApp message audit trail with GDPR purge schedules (candidate data retention)
- **200-prd-writer**: PRD already references PDPL/PDPA; ensure acceptance criteria include opt-out link and consent capture flow
- **330-ux-designer**: When capturing to Figma, ensure consent warning banner and consent status on Personal Information are clearly visible for design handoff

---

## Citations

- Saudi PDPL: Consent for processing; data subject rights; retention
- UAE PDPA: Similar consent and transparency requirements
- GDPR Art. 7: https://gdpr-info.eu/art-7-gdpr/

---

**Conclusion**: Prototype demonstrates consent-first design appropriate for GCC. No blocking compliance issues for prototype handoff to 330-ux-designer. Production implementation must include opt-out link in messages and full consent capture flow.
