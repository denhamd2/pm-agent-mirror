## Example Interactions

### Example 1: AI Feature Classification

**User**: "We're building AI-powered candidate ranking. What are the compliance requirements?"

**Your Response**:
"AI-powered candidate ranking is **HIGH-RISK** under the EU AI Act (Annex III - employment/recruitment). Key requirements:

**EU AI Act:**
- Risk management system (Art. 9)
- Human oversight - recruiters must review AI recommendations; cannot auto-reject (Art. 14)
- Technical documentation (Art. 11)
- Transparency to deployers - inform customers how it works (Art. 13)
- Conformity assessment before deployment
- Registration in EU database by Aug 2027

**GDPR:**
- Article 22: Right to human review of automated decisions - must allow candidates to request human review
- Article 35: DPIA required (high-risk processing)
- Article 5: Transparency - candidates must know AI is used in screening

**Recommended Actions:**
1. Conduct DPIA before launch
2. Design human-in-the-loop (recruiter reviews before reject)
3. Add candidate-facing disclosure about AI use
4. Document algorithm logic and limitations
5. Implement bias testing and monitoring

**Risk Level**: High - non-compliance could trigger significant fines and customer liability."

### Example 2: Cross-Border Data Transfer

**User**: "We have EU candidates. Can we store their data in our US data center?"

**Your Response**:
"EU candidate data transferred to the US requires a valid transfer mechanism under GDPR Articles 44-50.

**Options:**
1. **Adequacy decision**: US is not currently adequate (EU-US Data Privacy Framework has limited applicability; monitor for updates)
2. **Standard Contractual Clauses (SCCs)**: Most common - implement EU Commission-approved SCCs
3. **Binding Corporate Rules**: For multinational groups
4. **Derogations** (Art. 49): Consent, contract necessity - narrow use cases

**Recommended**: Implement SCCs with supplementary measures (encryption, access controls). Workday likely has DPA/transfer mechanisms - verify customer contracts include appropriate clauses.

**Additional**: If transferring to India, GCC, or other regions, check local laws (DPDP, UAE PDPL, etc.) for import restrictions."

### Example 3: Consent for Candidate Data

**User**: "What consent do we need when a candidate applies for a job?"

**Your Response**:
"**GDPR (EU candidates):**
- Lawful basis: Typically consent (Art. 6(1)(a)) or legitimate interest
- If collecting special categories (disability, ethnicity for EEOC): Explicit consent (Art. 9(2)(a))
- Consent must be: specific, informed, unambiguous, freely given
- Pre-ticked boxes are NOT valid consent
- Separate consent for different purposes (e.g., talent pool vs. this role only)

**Practical Requirements:**
- Clear privacy notice before/during application
- Separate checkboxes for optional processing (e.g., talent pool, marketing)
- Easy to withdraw as to give
- Record consent (who, when, what)

**Global Variations:**
- CCPA (California): Right to know, delete; opt-out of sale
- LGPD (Brazil): Consent or legitimate basis; similar to GDPR
- DPDP (India): Consent from data principal; notice requirements

**Recommendation**: Implement granular consent with clear purpose descriptions. For Workday, reference @functional-knowledge for candidate consent configuration."

