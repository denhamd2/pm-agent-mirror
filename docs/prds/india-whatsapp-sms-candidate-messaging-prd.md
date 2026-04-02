# Native WhatsApp and +91 SMS Candidate Messaging (2026R2)
Product Requirements Document
April 2026

## Executive Summary

Workday is uniquely positioned to deliver native WhatsApp and +91 SMS candidate messaging within the core Recruiting UI for the 2026R2 release. India's 500 million social messaging identities and WhatsApp's dominance as the default professional communication channel create an urgent competitive gap: Workday Recruiting currently has no native WhatsApp or +91 SMS capability, confirmed as a True Gap across four consecutive Deployment Agent validations. Regional competitors - including Zoho Recruit, PeopleStrong, and Darwinbox - already offer WhatsApp-based candidate engagement, placing Workday at a disadvantage in India's high-volume recruiting market.

For our customers, this feature will eliminate the reliance on personal phones and external tools for candidate communication. Recruiters managing 800-1,000 hires per month (P4, TP) and 1,500-2,000 per week (P5, TP) currently chase candidates via personal WhatsApp or phone calls with no audit trail, no consent logging, and no integration with the candidate record. Native messaging will reduce time-to-response, improve candidate experience, and provide compliant communication records within the recruiting workflow.

For Workday, this initiative directly supports the India Scale growth target of 8 new customer wins in Q2 2026 and closes a competitive parity gap that surfaces in every India RFP. WhatsApp messaging appears on the Workday Talent Acquisition strategy next-wave roadmap, and DPDP Act compliance (Rules notified November 2025, core obligations phasing from approximately May 2027) makes a governed, consent-first messaging platform a market differentiator rather than a commodity feature.

This PRD scopes the v1 feature for India-first deployment, with architecture extensible to GCC and APAC markets where WhatsApp adoption is similarly high.

**Source research:** `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-006.md`

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | India recruiters operating at enterprise scale (800-2,000+ hires per week) have no native channel to reach candidates where they are: WhatsApp. Workday Recruiting supports email-based communications and task notifications, but Indian candidates overwhelmingly prefer WhatsApp for professional interactions (500M+ social messaging identities per DataReportal 2025, 72.5% mobile internet penetration). Recruiters resort to personal devices for WhatsApp and SMS outreach, creating compliance risk (no consent trail, no audit log, no DPDP-aligned opt-out), data leakage (candidate PII on personal phones), and operational inefficiency (manual copy-paste between systems, no delivery tracking). The absence of native +91 SMS compounds the problem - automated notifications cannot reach candidates who have not provided email addresses, which is common in frontline and high-volume hiring contexts. |
| **How is it done today?** | Recruiters use personal WhatsApp or phone calls to contact candidates, then manually update Workday with interaction notes. Some customers have built CPaaS workarounds using Workday Studio + Twilio-class providers with Business Process triggers, but these require significant implementation effort, lack native UI integration, and create DPDP consent management challenges. Email remains the only native outbound channel, yet India's email open rates for recruiting communications are significantly lower than WhatsApp message read rates. Task notifications generate volume (P3 reported 3,500+ generic tasks) but lack candidate context and actionable content. |
| **How is our approach uniquely different from others?** | - **Suite-native messaging**: WhatsApp and SMS embedded in the candidate profile and recruiting workflow, not a bolted-on integration or marketplace app - conversation history lives on the candidate record with full audit trail<br>- **DPDP-first consent architecture**: Consent collection, storage, withdrawal, and audit designed for India's Digital Personal Data Protection Act from day one, not retrofitted - providing customers with defensible compliance posture<br>- **Governed templates with recruiter flexibility**: Pre-approved message templates (WhatsApp Business API requirement) combined with configurable personalisation fields, balancing compliance with recruiter autonomy<br>- **Delivery intelligence**: Read receipts, delivery status, and response tracking visible on the candidate profile - replacing the black hole of personal phone outreach<br>- **Extensible architecture**: India-first design with channel abstraction supporting GCC, APAC, and future regional messaging channels without per-market rebuilds |
| **What customer benefits and value does our solution deliver?** | **Impact (Business Value):**<br>- Candidate Experience: channel response rate improvement from email baseline (~15-20%) to WhatsApp baseline (~70-80% read rate) for India recruiting communications<br>- Time to Hire: reduction in candidate chase cycles (P3: 16-17% offer drop-off attributed partly to communication delays)<br><br>**Product Outcomes:**<br>- Avg. time from message sent to candidate response (target: <4 hours vs >24 hours email baseline for India)<br>- % of candidate communications sent via native WhatsApp vs external tools (target: 60% Year 1)<br>- Recruiter time saved per week on manual candidate outreach (target: 3-5 hours per recruiter)<br><br>**Outputs (Product Catalogue):**<br>- Usage: WhatsApp messages sent per recruiter per month (target: 150+)<br>- Adoption: % of India-tenant recruiters using native WhatsApp messaging (target: 30% Year 1)<br><br>**Year 1 Forecast:**<br>Adoption target: 30% of recruiters on India tenants. Usage volume: approximately 450,000 messages per year across early adopters (based on 100 recruiters × 150 messages/month × 30% adoption × 10 tenants). Basis: India customer base scaling to 8+ customers with high-volume recruiting needs; WhatsApp adoption driven by recruiter preference and candidate response rates. |

### Audience / Personas

**Primary Persona**: Recruiter (High-Volume, India)
- Manages 50-200+ requisitions simultaneously across IT services, BPO, GCC, and agency hiring
- Needs to reach candidates quickly via their preferred channel (WhatsApp) with status updates, interview scheduling, and offer communications
- Currently uses personal phone for candidate WhatsApp, creating compliance and data leakage risk

**Secondary Persona**: Recruiting Coordinator / Hiring Manager (India)
- Coordinates interview scheduling and candidate logistics
- Needs templated, quick-send messaging for scheduling confirmations and reminders
- Benefits from delivery status visibility (sent, read, replied) without chasing recruiters

**Tertiary Persona**: Talent Acquisition Leader / Compliance Officer
- Requires audit trail of all candidate communications for DPDP compliance
- Needs consent management dashboard showing opt-in/opt-out status per candidate
- Benefits from governed templates that prevent non-compliant messaging

*Persona depth from `docs/workday-user-research/` (HR Professional Recruiting persona) and `docs/jtbd-recruiting-hr-professional-and-manager.md`.*

---

## Feature Solution

- Recruiter opens a candidate profile in Workday Recruiting and sees a **Messaging** tab alongside existing Activity, Documents, and Questionnaire tabs
- The Messaging tab displays conversation history across WhatsApp and SMS channels, threaded by date with delivery status indicators (sent, delivered, read, replied)
- Recruiter selects **Send Message** and chooses channel: WhatsApp or SMS (+91)
- For WhatsApp: recruiter selects from pre-approved **message templates** (WhatsApp Business API requirement) with merge fields for candidate name, requisition title, interview date/time, offer details, and custom notes
- For SMS: recruiter types a free-text message within character limits, with DPDP opt-out footer auto-appended
- Before first outreach, the system checks **consent status** on the candidate record:
  - If consent not yet collected: prompts recruiter to trigger a consent request via the candidate's preferred channel
  - If consent granted: message sends immediately
  - If consent withdrawn: messaging is blocked with clear explanation and link to consent history
- Candidate replies flow back into the conversation thread on the candidate profile in near real-time, visible to all recruiters with access to the candidate
- **Bulk messaging**: from the candidate grid (Find Candidates), recruiter selects multiple candidates and sends a templated message to all, with per-candidate merge field resolution and individual consent validation
- All messages are logged on the candidate record with timestamp, channel, template used, delivery status, and recruiter attribution for DPDP audit compliance
- Opt-out requests received via WhatsApp or SMS auto-update the candidate's consent record and block future outbound messaging on that channel

### Experience Principles Alignment

**Empower (Give Users Control)**
- Recruiters choose when and how to message candidates; the system suggests templates but never auto-sends without recruiter action
- Bulk messaging previews show exactly which candidates will receive messages and which are blocked (no consent, opted out) before execution
- Channel selection (WhatsApp vs SMS) is the recruiter's decision based on candidate preference

**Trust (Build Their Confidence)**
- Transparent delivery status: "Sent to 47 candidates, 42 delivered, 38 read, 12 replied" visible on the candidate grid
- Consent status is always visible on the candidate profile - recruiters know immediately whether they can message a candidate
- Message history is immutable and auditable, building confidence in DPDP compliance

**Grow (Enable Them to Change)**
- Message templates are editable by TA leaders without IT dependency (self-service template management)
- New channels can be added (e.g., regional SMS providers) without changing the recruiter workflow
- Consent preferences are candidate-controlled and update in real-time across all recruiter views

**Principle Validation:**
- [x] Feature keeps user in control (recruiter initiates all messaging)
- [x] Clear transparency about delivery and consent status
- [x] Easy to change templates and preferences without support tickets

---

## Critical User Journey & Use Cases

**Use Case 1: Individual candidate outreach (interview scheduling)**
- Recruiter opens candidate profile for a shortlisted candidate
- Navigates to Messaging tab, sees no prior WhatsApp history
- Selects "Send Message" → WhatsApp → "Interview Invitation" template
- System checks consent: consent granted via career site application (opt-in checkbox)
- Recruiter reviews pre-populated template with candidate name, role, and proposed time slots
- Recruiter adjusts time slots and adds a personal note, then sends
- Message delivered; candidate reads within 2 hours and replies with preferred slot
- Reply appears on candidate profile; recruiter confirms interview in Workday

**Use Case 2: Bulk status update (high-volume hiring)**
- Recruiter managing 200+ candidates for a BPO hiring drive
- From Find Candidates grid, filters to "Interview Complete - Pending Decision" status
- Selects 85 candidates, clicks "Send Message" → WhatsApp → "Application Status Update"
- System validates: 78 have consent, 5 have no consent, 2 have opted out
- Preview shows 78 messages will send; 7 candidates flagged for email fallback
- Recruiter confirms; 78 messages sent; delivery dashboard updates in real-time

**Use Case 3: Consent collection for new candidate**
- Agency uploads 50 candidate profiles via vendor portal
- Recruiter attempts to send WhatsApp message to a candidate without consent
- System blocks send with message: "Consent required. Send consent request to this candidate?"
- Recruiter triggers consent request; candidate receives WhatsApp message with opt-in link
- Candidate taps opt-in; consent recorded with timestamp; recruiter can now message

**Use Case 4: Candidate opts out**
- Candidate replies "STOP" to a WhatsApp message
- System auto-processes opt-out: updates consent record, blocks future WhatsApp outbound
- Recruiter sees "WhatsApp: Opted out (01 April 2026)" on candidate profile
- Recruiter can still contact via email or phone; SMS opt-out handled separately

---

## Compliance Considerations

### DPDP Act 2023 (India)

| Requirement | Implementation |
|------------|---------------|
| **Consent (Section 6)** | Explicit opt-in before first WhatsApp/SMS outreach; consent captured with timestamp, purpose, and channel; withdrawal mechanism via reply keyword ("STOP") or candidate portal |
| **Purpose limitation (Section 4)** | Messages restricted to recruiting-related communications only; template governance prevents misuse |
| **Data minimisation** | Only mobile number and consent status stored for messaging; message content retained per customer-configured retention period |
| **Cross-border transfer (Rule 15)** | WhatsApp Business API processes messages via Meta infrastructure; customer data processing agreements must cover cross-border flows; negative-list check required |
| **Retention** | Message history subject to customer-configured Workday purge schedules; DPDP alignment with candidate data lifecycle |
| **Audit trail** | Every message logged with sender, recipient, channel, template, timestamp, delivery status, consent basis |

### WhatsApp Business API Requirements

- All business-initiated messages must use pre-approved templates (Meta policy)
- Templates submitted via WhatsApp Business Manager; approval typically 24-48 hours
- 24-hour messaging window for free-form replies after candidate-initiated message
- Opt-out handling per WhatsApp policy (immediate processing required)

---

## UX Designs for 2026R2

- Candidate Profile - Messaging Tab: [Figma link TBD]
- Bulk Messaging Flow - Find Candidates Grid: [Figma link TBD]
- Consent Management - Candidate Profile: [Figma link TBD]
- Template Management - TA Admin: [Figma link TBD]

---

## Releases & Production Thresholds

Legal and compliance review to be completed prior to development start. DPDP impact assessment required given candidate PII processing via third-party messaging infrastructure (WhatsApp Business API / Meta).

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD approval and design kickoff | May 2026 |
| Design Brief and prototype review | June 2026 |
| WhatsApp Business API integration design | June 2026 |
| Engineering development start | July 2026 |
| Internal dogfood (Workday recruiting) | September 2026 |
| Customer EA (2 India tenants) | October 2026 |
| GA release (2026R2) | November 2026 |

---

## Key Dependencies

- **WhatsApp Business API**: Meta approval for Workday as a Business Solution Provider (BSP) or partnership with existing BSP
- **+91 SMS gateway**: Integration with India-compliant SMS aggregator (DLT registration required for commercial SMS in India)
- **DPDP compliance framework**: Workday platform consent management must support per-channel, per-purpose consent with withdrawal
- **Candidate mobile number**: Requires mobile number field populated on candidate record; career site application form must capture with country code
- **Template approval pipeline**: WhatsApp template submission and Meta approval workflow needed before go-live

---

## Resources

- PMF Analysis: `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-006.md`
- Competitive Matrix: `research/competitive/matrices/in-competitive-matrix.md` (v1.11)
- PESTEL Analysis: `research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-006.md`
- Customer Research: `research/India/105-user-research-findings.md`
- SME Research: `research/India/105-sme-research-findings.md`
- PRD (markdown): `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager |
| TBD | Engineering Lead |
| TBD | UX Design Lead |
| TBD | WhatsApp Business API Integration Lead |
| TBD | Legal & Compliance (DPDP) |
| TBD | Executive Sponsor (Product - Recruiting) |

---

Workday Confidential    1

-- 1 of 1 --
