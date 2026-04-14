# Design Brief: Universal Profile Verification
**Feature**: EUDI Wallet & Verifiable Credentials Integration
**Date**: April 2026

## PASS 1: LAYOUT STRATEGY

**JTBD**: 
*Aligns with Recruiter JTBD: Screen & Shortlist*
"When evaluating a candidate, I want to instantly know which qualifications are verified by trusted authorities, so I can confidently fast-track them and skip manual background checks."

**Shell Pattern**: 
Candidate Smart View (Profile Page Layout). We are augmenting the existing candidate detail view, not creating a new workspace.

**Hierarchy**:
1. **Primary Focus**: The candidate's overall verification status (Identity Trust Anchor).
2. **Secondary**: Specific verified claims (Education, Experience) mixed with self-reported data.
3. **Supporting**: The cryptographic proof metadata (Issuer, Date, Revocation status) available on drill-down.

## PASS 2: UI COMPOSITION (CANVAS KIT & SANA STYLE)

**Sana Style Application**:
- Canvas: `SANA_PAGE_CANVAS` (Light grey)
- Cards: White with `soap300` borders, 16px radii.
- Trust Indicators: We will use Canvas Kit `StatusIndicator` (Green/Low emphasis) to denote verified claims, avoiding heavy visual clutter while maintaining clear trust signals.

**Component Mapping**:
- **Profile Header**: `ProfilePageLayout` header. Add a `StatusIndicator` for "Identity Verified".
- **Experience/Education Cards**: Standard `Card` components.
- **Verified Badges**: `StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Verified by Issuer" icon={checkCircleIcon}`
- **Unverified/Self-Reported**: `StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="Self-reported"`
- **Action Buttons**: `<SecondaryButton>Request Credentials</SecondaryButton>` in the Communication Dock or header.

### Copy Inventory (319 Reviewed)

**Badges:**
- ✅ Verified identity
- ✅ Verified by [Issuer Name]
- ✅ Self-reported

**Buttons:**
- ✅ Request verified credentials
- ✅ View cryptographic proof

**Empty/Promo State (If candidate has no VCs):**
- Heading: "Speed up verification"
- Body: "Ask this candidate to share their verified credentials via their digital wallet."
- CTA: "Request credentials"

## PASS 3: PEER REVIEW (318)
**Reviewer**: 318-design-peer-reviewer
**Findings**:
- The use of `StatusIndicator` perfectly aligns with Canvas Kit v14 standards for metadata tagging.
- Mixing verified and self-reported data on the same card is the correct mental model for recruiters (they read chronologically, not by data source).
- **Final Verdict: APPROVED**. Ready for 320 implementation.
