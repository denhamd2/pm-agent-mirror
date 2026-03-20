# Story Map: WhatsApp Candidate Communication for GCC

**Epic**: [HRREC-90966](https://jira2.workday.com/browse/HRREC-90966) - WhatsApp candidate communication for GCC (2026R2) — **MISSION-015 v38 E2E**  
**Prior epics (reference only):** [HRREC-90962](https://jira2.workday.com/browse/HRREC-90962) (MISSION-014), [HRREC-90928](https://jira2.workday.com/browse/HRREC-90928)  
**Created**: Thursday Mar 19, 2026  
**Updated**: Thursday Mar 19, 2026 (MISSION-015 — new epic after v38 HITL #5)  
**Author**: AI Story Mapping Specialist (420)

## Epic Context

As a GCC recruiter managing high-volume requisitions
I want to communicate with candidates via WhatsApp directly within Workday
So that I can reach candidates on their preferred channel (90%+ open rates) and reduce response time from 24-48 hours (email) to 5-15 minutes

**Key Personas**:
- Primary: GCC recruiters (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman)
- Secondary: Candidates applying in GCC
- Tertiary: Recruiting Leaders (compliance, audit trail)

**Business Goals**:
- Increase candidate response rate by 40% (WhatsApp 90%+ open rate vs 25% email)
- Reduce time-to-response from 24-48 hours to 5-15 minutes
- Eliminate recruiter workarounds (personal WhatsApp usage)
- Reduce manual work by 2-3 hours/week per recruiter
- Drive adoption: 42% of GCC customers projected to activate within 12 months

## User Activities (Horizontal Backbone)

1. **Enable WhatsApp channel** - Admin sets up WhatsApp Business API integration and tenant configuration
2. **Capture candidate consent** - Candidate opts in to WhatsApp messaging (career site or profile)
3. **Send campaign messages** - Recruiter creates WhatsApp campaign for job alerts, status updates, interview reminders
4. **Send ad-hoc messages** - Recruiter sends WhatsApp message from Candidate Profile (primary placement)
5. **Track delivery & engagement** - System logs messages, tracks delivery status, read receipts
6. **Manage templates** - Admin manages pre-approved WhatsApp Business API templates

## User Tasks (Vertical Slices)

### Activity 1: Enable WhatsApp channel
- Configure WhatsApp Business API integration → **VS1**
- Enable WhatsApp for GCC tenants (Saudi, UAE, Kuwait, Qatar, Bahrain, Oman) → **VS1**
- Set up WhatsApp consent fields in candidate profile → **VS1**
- Configure WhatsApp delivery settings (rate limits, retry logic) → **VS2**

### Activity 2: Capture candidate consent
- Display WhatsApp opt-in checkbox on career site application → **VS1**
- Store WhatsApp consent in candidate profile → **VS1**
- Display WhatsApp consent status on Candidate Profile page → **VS1**
- Handle WhatsApp opt-out via message link → **VS2**
- Update consent status when candidate opts out → **VS2**

### Activity 3: Send campaign messages
- Extend Recruiting Campaigns to support WhatsApp channel → **VS1**
- Select WhatsApp as campaign channel (in addition to Email) → **VS1**
- Filter campaign recipients by WhatsApp consent → **VS1**
- Select WhatsApp template for campaign message → **VS1**
- Send WhatsApp campaign messages via Workday Messaging framework → **VS1**
- Track campaign delivery status (sent, delivered, failed) → **VS2**
- Display campaign engagement metrics (open rate, response rate) → **VS3**

### Activity 4: Send ad-hoc messages (Primary Placement)
- Display "Send WhatsApp" action on Candidate Profile page → **VS1**
- Show WhatsApp consent indicator on Candidate Profile → **VS1**
- Select WhatsApp template for ad-hoc message → **VS1**
- Send WhatsApp message from Candidate Profile → **VS1**
- Display message delivery status on Candidate Profile → **VS2**
- View WhatsApp conversation history on Candidate Profile → **VS3**
- Enable two-way conversational messaging (candidate replies) → **VS3**

### Activity 5: Track delivery & engagement
- Log all WhatsApp messages in Workday audit trail → **VS1**
- Track message delivery status (sent, delivered, read, failed) → **VS2**
- Display read receipts for WhatsApp messages (where available) → **VS3**
- Generate WhatsApp Campaign Report for Recruiting Leaders → **VS3**
- Export WhatsApp message history for PDPL/PDPA compliance → **VS2**

### Activity 6: Manage templates
- Create pre-approved WhatsApp Business API templates → **VS1**
- Manage template library (add, edit, disable templates) → **VS2**
- Support multilingual templates (Arabic, English) → **VS2**
- Preview template before sending → **VS2**

## Value Slices

### VS1: WhatsApp Foundation
**Goal**: Enable WhatsApp as a candidate communication channel for GCC recruiters with 90%+ delivery success and full consent compliance (PDPL/PDPA)

**Stories** (Total: 15):
1. Configure WhatsApp Business API integration - Activity 1
2. Enable WhatsApp for GCC tenants - Activity 1
3. Set up WhatsApp consent fields in candidate profile - Activity 1
4. Display WhatsApp opt-in checkbox on career site application - Activity 2
5. Store WhatsApp consent in candidate profile - Activity 2
6. Display WhatsApp consent status on Candidate Profile page - Activity 2
7. Extend Recruiting Campaigns to support WhatsApp channel - Activity 3
8. Select WhatsApp as campaign channel (in addition to Email) - Activity 3
9. Filter campaign recipients by WhatsApp consent - Activity 3
10. Select WhatsApp template for campaign message - Activity 3
11. Send WhatsApp campaign messages via Workday Messaging framework - Activity 3
12. Display "Send WhatsApp" action on Candidate Profile page - Activity 4
13. Show WhatsApp consent indicator on Candidate Profile - Activity 4
14. Select WhatsApp template for ad-hoc message - Activity 4
15. Send WhatsApp message from Candidate Profile - Activity 4
16. Log all WhatsApp messages in Workday audit trail - Activity 5
17. Create pre-approved WhatsApp Business API templates - Activity 6

### VS2: Engagement & Compliance
**Goal**: Improve recruiter efficiency by 30% (reduce manual work from 3h to 2h/week) and ensure full PDPL/PDPA compliance with opt-out handling and audit trail

**Stories** (Total: 9):
1. Configure WhatsApp delivery settings (rate limits, retry logic) - Activity 1
2. Handle WhatsApp opt-out via message link - Activity 2
3. Update consent status when candidate opts out - Activity 2
4. Track campaign delivery status (sent, delivered, failed) - Activity 3
5. Display message delivery status on Candidate Profile - Activity 4
6. Track message delivery status (sent, delivered, read, failed) - Activity 5
7. Export WhatsApp message history for PDPL/PDPA compliance - Activity 5
8. Manage template library (add, edit, disable templates) - Activity 6
9. Support multilingual templates (Arabic, English) - Activity 6
10. Preview template before sending - Activity 6

### VS3: Advanced Experience
**Goal**: Increase candidate response rate by 50% (from 60% to 90%) with two-way conversational messaging and engagement analytics

**Stories** (Total: 5):
1. Display campaign engagement metrics (open rate, response rate) - Activity 3
2. View WhatsApp conversation history on Candidate Profile - Activity 4
3. Enable two-way conversational messaging (candidate replies) - Activity 4
4. Display read receipts for WhatsApp messages (where available) - Activity 5
5. Generate WhatsApp Campaign Report for Recruiting Leaders - Activity 5

## Story Map Visualization

```
Activity 1             Activity 2            Activity 3                    Activity 4                       Activity 5                    Activity 6
Enable Channel         Capture Consent       Send Campaigns                Send Ad-Hoc Messages             Track Delivery                Manage Templates
-----                 -----                 -----                         -----                            -----                         -----
Configure API (VS1)   Opt-in checkbox (VS1) Extend Campaigns (VS1)        "Send WhatsApp" action (VS1)     Log messages (VS1)            Create templates (VS1)
Enable GCC (VS1)      Store consent (VS1)   Select channel (VS1)          Show consent indicator (VS1)     Track delivery (VS2)          Manage library (VS2)
Consent fields (VS1)  Show consent (VS1)    Filter recipients (VS1)       Select template (VS1)            Read receipts (VS3)           Multilingual (VS2)
Delivery settings (VS2) Opt-out handling (VS2) Select template (VS1)       Send message (VS1)               Campaign report (VS3)         Preview (VS2)
                      Update consent (VS2)  Send messages (VS1)           Display status (VS2)             Export history (VS2)
                                            Track status (VS2)            Conversation history (VS3)
                                            Engagement metrics (VS3)      Two-way messaging (VS3)
```

## Summary

**Total Activities**: 6
**Total Stories**: 29

**Value Slice Breakdown**:
- **VS1 Stories**: 17 (WhatsApp Foundation)
- **VS2 Stories**: 10 (Engagement & Compliance)
- **VS3 Stories**: 5 (Advanced Experience)

**VS1** delivers end-to-end WhatsApp capability: API integration, consent capture, campaign send, ad-hoc send from Candidate Profile (primary placement), and audit trail. This walking skeleton enables GCC recruiters to reach candidates via WhatsApp with full PDPL/PDPA compliance.

**VS2** adds recruiter efficiency features (delivery tracking, opt-out handling, template management) and compliance enhancements (multilingual support, export for audit).

**VS3** enhances candidate experience with two-way conversational messaging, read receipts, engagement analytics, and campaign reporting for Recruiting Leaders.
