# Story Map: Native WhatsApp and +91 SMS Candidate Messaging (India)

**Epic draft:** `docs/epics/india-whatsapp-sms-candidate-messaging-epic-draft.md`
**Jira epic:** *(not created until 430 - leave placeholder)*
**PRD:** `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`
**Design Brief:** `design/india-whatsapp-candidate-messaging-design-brief.md`
**Prototype:** `design/india-whatsapp-candidate-messaging-v88.tsx`
**Created:** 01 April 2026
**Author:** AI Story Mapping Specialist

## Epic Context

As a high-volume recruiter in India managing 800-2,000+ hires per month, I want to send WhatsApp messages and +91 SMS to candidates directly from the candidate profile using governed templates with consent tracking and delivery status, so that I can eliminate personal-device workarounds, reduce candidate chase time from >24 hours to <4 hours, and maintain a DPDP-compliant audit trail for every candidate communication.

**Key Personas:**
- Primary: Recruiter (high-volume, India)
- Secondary: Recruiting coordinator / hiring manager (India)
- Tertiary: TA leader / compliance officer

**Business Goals:**
- Close competitive parity gap (Zoho Recruit, PeopleStrong, Darwinbox)
- Candidate response rate from 15-20% (email) to 70-80% (WhatsApp)
- Avg. response time from >24h to <4h
- 30% adoption among India-tenant recruiters Year 1

## User Activities (Horizontal Backbone)

1. Collect consent
2. Send individual message
3. View conversation history
4. Send bulk messages
5. Manage templates
6. Monitor compliance

## User Tasks (Vertical Slices)

### Activity 1: Collect Consent

- 1.1 Trigger consent request to candidate via WhatsApp or SMS → **VS1**
- 1.2 Record consent with timestamp, channel, and purpose when candidate opts in → **VS1**
- 1.3 Process opt-out when candidate replies STOP (auto-update consent, block outbound) → **VS1**
- 1.4 Display consent status (granted / pending / opted-out) on candidate profile → **VS1**
- 1.5 View consent history with full audit trail (date, channel, action, recorded-by) → **VS2**

### Activity 2: Send Individual Message

- 2.1 Open WhatsApp panel from CommunicationDock rail on candidate profile → **VS1**
- 2.2 Select pre-approved WhatsApp template with merge field preview → **VS1**
- 2.3 Send WhatsApp template message with delivery confirmation → **VS1**
- 2.4 Compose and send free-text SMS with character count and auto opt-out footer → **VS1**
- 2.5 Switch between WhatsApp and SMS channels via rail icons → **VS1**
- 2.6 Block send when consent not granted, with clear explanation and consent request prompt → **VS1**
- 2.7 Send free-text WhatsApp reply within 24-hour conversation window → **VS2**

### Activity 3: View Conversation History

- 3.1 Display threaded message history per channel in sliding panel → **VS1**
- 3.2 Show delivery status indicators (sent, delivered, read, replied, failed) per message → **VS1**
- 3.3 Display sender attribution and template name on each outbound message → **VS1**
- 3.4 Show inbound candidate replies in near real-time → **VS2**
- 3.5 Log messaging activity in candidate Activity tab timeline → **VS2**

### Activity 4: Send Bulk Messages

- 4.1 Select multiple candidates from Find Candidates grid and initiate bulk send → **VS2**
- 4.2 Validate per-candidate consent status before bulk send (show blocked candidates) → **VS2**
- 4.3 Preview bulk message with per-candidate merge field resolution → **VS2**
- 4.4 Execute bulk send with real-time delivery dashboard (sent, delivered, read, replied counts) → **VS3**
- 4.5 Handle partial failures with retry option for failed candidates → **VS3**

### Activity 5: Manage Templates

- 5.1 Create and edit WhatsApp message templates (TA administrator, self-service) → **VS2**
- 5.2 Submit templates for Meta approval via WhatsApp Business Manager pipeline → **VS3**
- 5.3 Configure merge fields per template (candidate name, requisition, date, custom) → **VS2**
- 5.4 Deactivate or archive templates without IT dependency → **VS3**

### Activity 6: Monitor Compliance

- 6.1 Log every message with sender, recipient, channel, template, timestamp, delivery status, consent basis → **VS1**
- 6.2 Enforce message retention per customer-configured Workday purge schedules → **VS2**
- 6.3 Provide consent management dashboard for TA leaders (opt-in/opt-out rates, channel breakdown) → **VS3**
- 6.4 Generate DPDP audit report for compliance officers → **VS3**

## Value Slices

### VS1: Governed Individual Messaging
**Goal:** Recruiter can send a DPDP-compliant WhatsApp template or SMS to a single candidate from the candidate profile with consent gating and delivery tracking - replacing personal-device outreach for the core use case.

**Stories:**
1. 1.1 - Trigger consent request to candidate via WhatsApp or SMS
2. 1.2 - Record consent with timestamp, channel, and purpose when candidate opts in
3. 1.3 - Process opt-out when candidate replies STOP
4. 1.4 - Display consent status on candidate profile
5. 2.1 - Open WhatsApp panel from CommunicationDock rail on candidate profile
6. 2.2 - Select pre-approved WhatsApp template with merge field preview
7. 2.3 - Send WhatsApp template message with delivery confirmation
8. 2.4 - Compose and send free-text SMS with character count and auto opt-out footer
9. 2.5 - Switch between WhatsApp and SMS channels via rail icons
10. 2.6 - Block send when consent not granted
11. 3.1 - Display threaded message history per channel in sliding panel
12. 3.2 - Show delivery status indicators per message
13. 3.3 - Display sender attribution and template name on outbound messages
14. 6.1 - Log every message with full audit metadata

**Total Stories:** 14

### VS2: Conversation Depth and Bulk Efficiency
**Goal:** Enable two-way conversations (inbound replies, free-text WhatsApp within 24h window), bulk messaging from the candidate grid with consent validation, and template self-service for TA administrators - moving from one-way outreach to managed recruiting conversations at scale.

**Stories:**
1. 1.5 - View consent history with full audit trail
2. 2.7 - Send free-text WhatsApp reply within 24-hour conversation window
3. 3.4 - Show inbound candidate replies in near real-time
4. 3.5 - Log messaging activity in candidate Activity tab timeline
5. 4.1 - Select multiple candidates and initiate bulk send from Find Candidates grid
6. 4.2 - Validate per-candidate consent status before bulk send
7. 4.3 - Preview bulk message with per-candidate merge field resolution
8. 5.1 - Create and edit WhatsApp message templates (TA admin self-service)
9. 5.3 - Configure merge fields per template
10. 6.2 - Enforce message retention per customer-configured purge schedules

**Total Stories:** 10

### VS3: Scale, Analytics, and Governance
**Goal:** Full production readiness at enterprise scale: bulk delivery dashboard with retry, Meta template approval pipeline, consent analytics for TA leaders, and DPDP audit reporting for compliance officers.

**Stories:**
1. 4.4 - Execute bulk send with real-time delivery dashboard
2. 4.5 - Handle partial failures with retry option
3. 5.2 - Submit templates for Meta approval via WhatsApp Business Manager
4. 5.4 - Deactivate or archive templates without IT dependency
5. 6.3 - Provide consent management dashboard for TA leaders
6. 6.4 - Generate DPDP audit report for compliance officers

**Total Stories:** 6

## Story Map Visualisation

```
Collect Consent    Send Individual     View History       Send Bulk          Manage Templates   Monitor Compliance
--------------     ---------------     ------------       ---------          ----------------   ------------------
1.1 Trigger (VS1)  2.1 Open panel(VS1) 3.1 Thread  (VS1)  4.1 Select  (VS2)  5.1 Create  (VS2)  6.1 Log msg  (VS1)
1.2 Record  (VS1)  2.2 Template (VS1)  3.2 Status  (VS1)  4.2 Consent (VS2)  5.2 Meta ok (VS3)  6.2 Purge    (VS2)
1.3 Opt-out (VS1)  2.3 Send WA  (VS1)  3.3 Sender  (VS1)  4.3 Preview (VS2)  5.3 Fields  (VS2)  6.3 Dashboard(VS3)
1.4 Display (VS1)  2.4 Send SMS (VS1)  3.4 Replies (VS2)  4.4 Execute (VS3)  5.4 Archive (VS3)  6.4 Audit    (VS3)
1.5 History (VS2)  2.5 Switch   (VS1)  3.5 Activity(VS2)  4.5 Retry   (VS3)
                   2.6 Block    (VS1)
                   2.7 Free-txt (VS2)
```

## Summary

**Total Activities:** 6
**Total Tasks:** 30
**Value Slices:** 3
**VS1 Stories:** 14 (Governed Individual Messaging)
**VS2 Stories:** 10 (Conversation Depth and Bulk Efficiency)
**VS3 Stories:** 6 (Scale, Analytics, and Governance)
