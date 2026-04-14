# Universal Profile: EUDI Wallet & Verifiable Credentials (2026R2)
Product Requirements Document
April 2026

## Executive Summary

Workday Recruiting will integrate with the **European Digital Identity (EUDI) Wallet** and the **W3C Verifiable Credentials (VC)** standard to enable cryptographically verified candidate profiles. This initiative directly addresses the 2026 EU mandate requiring member states to offer digital wallets, while simultaneously solving the global crisis of AI-generated resume fraud and identity misrepresentation. 

For our customers, this feature reduces manual background verification time by up to 80% for participating candidates, increases duplicate detection accuracy to >99% via cryptographic identity anchoring, and provides absolute trust in candidate qualifications (education, employment history, skills).

For Workday, this establishes our position as the **foundational trust layer** in enterprise recruiting, creating a defensive moat against LinkedIn and Microsoft by natively supporting open, decentralized identity standards before they become ubiquitous.

## Core Problem
The proliferation of generative AI has made resume inflation and fabrication effortless. Simultaneously, deepfake interviews and identity fraud are rising in high-volume markets (e.g., India, LatAm). Employers spend millions on manual background checks (BGV) and still suffer from candidate drop-off and bad hires. Furthermore, the EU has mandated the EUDI Wallet by 2026, meaning 450 million citizens will soon expect to share verified digital credentials (degrees, employment records) directly with employers. Currently, Workday Recruiting relies on self-reported data and post-offer third-party BGV integrations, leaving a massive gap in upfront trust.

## Feature Solution
- **EUDI Wallet "Apply" Integration**: Candidates can apply to jobs by scanning a QR code or deep-linking to their EUDI Wallet (or compatible W3C DID wallet), selectively sharing Verifiable Credentials (VCs) such as identity, degrees, and past employment.
- **Cryptographic Verification Engine**: Workday validates the issuer signatures (e.g., University of Texas, Accenture) against public DID registries without contacting the issuer, ensuring zero-knowledge privacy and instant verification.
- **Verified Profile UI**: Recruiter and Hiring Manager views display prominent "Verified" badges (using Canvas Kit `StatusIndicator`) next to cryptographically proven claims, distinguishing them from self-reported text.
- **Data Minimization & GDPR Compliance**: Workday only stores the cryptographic proof and necessary claims, automatically purging them per DPDP/GDPR retention schedules.

## Success Metrics
**Impact (Business Value):**
- **Time to Verify**: Reduce manual BGV/reference check time from 5-7 days to <1 day for candidates using VCs (80% reduction).
- **Quality of Hire / Fraud Reduction**: 0% credential fraud rate for VC-verified profile sections.

**Product Outcomes:**
- **Candidate Conversion**: Maintain or improve apply-flow conversion rates for users selecting the "Apply with EUDI Wallet" path.
- **Duplicate Detection**: 99.9% accuracy in UDMF when anchored to a DID.

**Outputs:**
- **Adoption**: 5% of EU-based applications use EUDI Wallet in Year 1 (Targeting 500k+ verified applications).

## Legal & Compliance Review (060)
- **EU AI Act**: This is **NOT** an AI matching system; it is deterministic cryptographic verification. It reduces AI Act risks by grounding decisions in verified facts rather than inferred traits.
- **GDPR (Art. 5, 17, 20)**: Highly compliant. VCs enforce data minimization (selective disclosure). Candidates can exercise Right to Erasure by revoking presentation access.
- **DPDP (India)**: Aligns perfectly with non-Aadhaar-first privacy principles. Candidates share proofs without exposing underlying national ID numbers to the employer.

## Red Team Risk Analysis (080)
1. **Wallet Adoption Lag**: *Risk*: EUDI wallet rollout by member states is delayed, leading to zero usage. *Mitigation*: Support generic W3C VC wallets (e.g., Microsoft Entra Verified ID) globally, not just EUDI.
2. **Issuer Ecosystem Immaturity**: *Risk*: Universities and employers aren't issuing VCs yet. *Mitigation*: Seed the ecosystem by allowing Workday Skills Cloud to *issue* VCs to candidates, creating immediate utility.
3. **Candidate Confusion**: *Risk*: Candidates abandon apply flow because they don't understand "Verifiable Credentials". *Mitigation*: UX must frame it simply as "Import Verified Profile" alongside standard "Upload Resume" options.
