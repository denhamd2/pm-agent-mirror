# PRD — India: Candidate profile two-way recruiting email

**Mission:** INDIA-E2E-006  
**Status:** Draft (Legal **060** and Red Team **080** pending)  
**Prototype:** `http://localhost:5199/india-candidate-profile-email-v92`  
**PMF:** `research/India/thematic-analysis/2026-05-07-India-PMF-Analysis-INDIA-E2E-006.md`

## 1. Problem

India hiring teams run **high-volume** pipelines where **email remains the system-of-record** for formal updates, document requests, and approvals—while **WhatsApp** handles fast nudges. Recruiters still read **candidate replies in external mail clients**; context is **lost on the candidate profile**, slowing decisions and weakening **audit trails** for **DPDP** and employer policy.

## 2. Goals

1. Show a **single threaded conversation** (recruiter ↔ candidate) **on the candidate profile** without leaving Recruiting.  
2. Support **two-way** behaviour: **inbound** candidate replies appear **in-thread** with timestamps and sender attribution.  
3. Preserve **transactional vs marketing** distinction for consent (India + DPDP).  
4. **Coexist** with the **WhatsApp** communication dock pattern (`india-native-whatsapp-v91`).

## 3. Non-goals (v1)

- Full **Microsoft 365 / Google Workspace** bi-directional sync architecture.  
- **Automated** sentiment or screening on message bodies.  
- Replacing **offer letter** generation or **document collection** BPs.

## 4. Personas

- **Recruiter (India BPO / high volume):** manages dozens of active threads; needs **profile-level** continuity.  
- **Candidate:** replies from personal email; expects **thread subject** stability and **clear employer identity**.

## 5. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | From candidate profile, open **Email** dock showing **subject**, **participants**, and **chronological** messages. |
| FR-2 | **Compose** outbound message with **rich text** parity to existing recruiting email (prototype: plain text). |
| FR-3 | **Inbound** messages ingested via integration (prototype: simulated / manual seed) render **inbound** alignment and **candidate** attribution. |
| FR-4 | **Audit:** each message stores **sent/received timestamp**, **channel=email**, **thread ID**, **recruiter user**. |
| FR-5 | **Consent banner** when **marketing** content selected; **transactional** path for stage-driven updates (Legal to classify strings). |
| FR-6 | **Identity context** (KYC status summary) visible on **Overview** tab adjacent to comms—not a substitute for document BP. |

## 6. NFRs

- **Accessibility:** dock and thread meet WCAG targets for recruiter-only UI.  
- **Performance:** thread load < 2s P95 for 200 messages (engineering target).  
- **Security:** no credential storage in browser; OAuth for mailbox integration (future).

## 7. Dependencies

- Messaging / **Communications** platform services (TBD with Engineering).  
- **060** review on consent copy, **cross-border** data flows, and **EU AI Act** if AI assists drafting.  
- **319** copy review on recruiter-facing strings.

## 8. Success metrics

- **Recruiter time on task:** reduction in **external inbox** context switches (baseline TBD in Pharos / research).  
- **Thread completeness:** % candidate replies visible in-profile within 5 min of delivery (integration SLO).

## 9. Rollout

- **Pilot:** India-heavy tenants with **email-centric** approval patterns (per 105).  
- **Flag:** tenant opt-in for **profile email dock**.
