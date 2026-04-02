# Epic draft: Native WhatsApp and +91 SMS Candidate Messaging (India)

**PRD:** `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`
**Design Brief:** `design/india-whatsapp-candidate-messaging-design-brief.md`
**Prototype:** `design/india-whatsapp-candidate-messaging-v88.tsx`
**Status:** Draft - Jira epic is created in 430 after story map approval (420 HITL).

## Epic summary (for Jira Summary field)

Native WhatsApp and +91 SMS messaging on the candidate profile to eliminate personal-device workarounds and provide DPDP-compliant communication for India high-volume recruiting

## User story

As a high-volume recruiter in India managing 800-2,000+ hires per month,
I want to send WhatsApp messages and +91 SMS to candidates directly from the candidate profile using governed templates with consent tracking and delivery status,
So that I can eliminate personal-device workarounds, reduce candidate chase time from >24 hours to <4 hours, and maintain a DPDP-compliant audit trail for every candidate communication.

## Success metrics (for Jira epic)

**Impact (Business Value):**
- Candidate response rate: email baseline (~15-20%) to WhatsApp baseline (~70-80% read rate) for India recruiting communications
- Time to Hire: reduction in candidate chase cycles (16-17% offer drop-off attributed partly to communication delays)

**Product Outcomes:**
- Avg. time from message sent to candidate response: target <4 hours vs >24 hours email baseline for India - drives BV#1
- % of candidate communications sent via native WhatsApp vs external tools: target 60% Year 1 - drives BV#1, BV#2
- Recruiter time saved per week on manual candidate outreach: target 3-5 hours per recruiter - drives BV#2

**Outputs (Product Catalogue):**
- Usage: WhatsApp messages sent per recruiter per month (target: 150+)
- Adoption: % of India-tenant recruiters using native WhatsApp messaging (target: 30% Year 1)

## Jira-ready description

**User Story:**

As a high-volume recruiter in India managing 800-2,000+ hires per month, I want to send WhatsApp messages and +91 SMS to candidates directly from the candidate profile using governed templates with consent tracking and delivery status, so that I can eliminate personal-device workarounds, reduce candidate chase time from >24 hours to <4 hours, and maintain a DPDP-compliant audit trail for every candidate communication.

**PRD:** `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`

**Scope:**
- WhatsApp and SMS messaging via sliding CommunicationDock panel on candidate profile (right-side expandable rail)
- DPDP-compliant consent collection, storage, and withdrawal per channel
- Pre-approved WhatsApp Business API template selection with merge fields
- Free-text SMS composition with character count and auto opt-out footer
- Threaded conversation history with delivery status indicators (sent, delivered, read, replied, failed)
- Bulk messaging from Find Candidates grid with per-candidate consent validation
- Consent audit trail with timestamp, channel, action, and recorded-by attribution
- Template management for TA administrators (self-service, no IT dependency)

**Personas:**
- Primary: Recruiter (high-volume, India) - 50-200+ requisitions, IT services / BPO / GCC / agency
- Secondary: Recruiting coordinator / hiring manager (India) - scheduling and logistics
- Tertiary: TA leader / compliance officer - audit trail, consent dashboard, template governance

**Business Value:**
- Closes competitive parity gap vs Zoho Recruit, PeopleStrong, Darwinbox (all offer WhatsApp)
- Supports India Scale growth target of 8 new customer wins in Q2 2026
- Surfaces in every India RFP; on Workday TA strategy next-wave roadmap
- DPDP Act compliance (core obligations phasing from approximately May 2027) makes governed messaging a market differentiator

**Success Metrics:**
- Candidate response rate: 15-20% (email) to 70-80% (WhatsApp read rate)
- Avg. time to response: >24h (email) to <4h (WhatsApp)
- Recruiter time saved: 3-5 hours/week on manual outreach
- Adoption: 30% of India-tenant recruiters Year 1
- Usage: 150+ WhatsApp messages per recruiter per month

## Notes for story mapping

- **WhatsApp Business API constraint**: All business-initiated messages must use pre-approved templates (Meta policy); 24-hour window for free-form replies after candidate-initiated message
- **DLT registration**: +91 SMS requires India DLT (Distributed Ledger Technology) registration for commercial SMS - dependency on SMS aggregator partnership
- **DPDP consent**: Per-channel, per-purpose consent with withdrawal mechanism; consent must be captured before first outreach
- **Cross-border data**: WhatsApp Business API processes via Meta infrastructure; customer DPA must cover cross-border flows; negative-list check required
- **UI pattern**: Messaging implemented as CommunicationDock sliding right panel (not a primary tab) per PM direction; rail icons for WhatsApp, SMS, Email
- **Bulk messaging**: From Find Candidates grid, not from individual profile; per-candidate consent validation before send
- **Jira defaults for 430**: Project HRREC, Component Recruiting Purge, Assignee david.denham
