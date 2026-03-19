# WhatsApp Candidate Communication for GCC (2026R2)
Product Requirements Document
March 2026

## Executive Summary

Workday is uniquely positioned to deliver WhatsApp as a candidate communication channel for the Gulf Cooperation Council (GCC) region. WhatsApp has 98% open rates for recruitment in GCC versus ~20% for email—the dominant channel for recruiter-candidate engagement—yet Workday Recruiting today relies exclusively on email for campaigns, status updates, and interview coordination. Workday Messaging (SMS) supports only U.S. and Canada; GCC recruiters have no native channel for their preferred communication method. GCC PMF research (v36) identified WhatsApp as a critical PMF theme: P1 (Accenture) stated "Absolutely WhatsApp is an absolute necessary… that's how I reach out to my candidates for quick closures. Emails will take whenever. But when you're looking at WhatsApp, you get immediate responses." P2 (Baker Hughes): "Having something like a WhatsApp or other communication methodologies would be helpful especially in markets like GCC and Saudi… the campaign functionality in workday is limited email campaigns at this point." P3 (Shell) has policy against WhatsApp for official business—an exception case. Workday is developing WhatsApp integration (early adopters); this PRD defines GA for GCC and extension of candidate engagement campaigns beyond email.

For our customers, this feature will enable recruiters to reach candidates on their preferred channel—WhatsApp—reducing time-to-response from 24–48 hours (email) to 5–15 minutes, improving offer acceptance rates, and eliminating manual workarounds (personal WhatsApp, email forwarding). PESTEL research: GCC has 30M+ WhatsApp users in Saudi alone; 98% open rate vs 20% email; smartphone penetration Saudi 92%, UAE 97% (highest in MENA); 40%+ career site traffic from mobile (P2). Recruiters will send job alerts, interview reminders, and status updates via WhatsApp within Workday, with full audit trail and consent management.

For Workday, this initiative will remove a PMF blocker in the high-growth GCC market, strengthen competitive positioning against regional specialists (ZenHR, Talentera) offering native WhatsApp, and drive adoption among enterprise customers who today use personal devices for candidate communication. Early adoption projections indicate 42% of GCC Recruiting customers will activate WhatsApp within 12 months of GA.

This feature will be delivered as part of the Candidate Engagement roadmap for 2026R2, with GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman) as the initial GA region.

**Epic Links:**
- WhatsApp GCC EA: RECRUIT-TBD
- WhatsApp GCC GA: RECRUIT-TBD

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters rely on WhatsApp for candidate communication—98% open rates vs ~20% email engagement—but Workday Recruiting campaigns and notifications are email-only. Workday Messaging (SMS) supports only U.S. and Canada. Recruiters use personal WhatsApp accounts for quick closures, status updates, and interview coordination, creating data governance risk, no audit trail, and fragmented candidate experience. P1: "Absolutely WhatsApp is an absolute necessary… that's how I reach out to my candidates for quick closures. Emails will take whenever. But when you're looking at WhatsApp, you get immediate responses." Email response times in GCC average 24–48 hours; WhatsApp enables 5–15 minute response. |
| **How is it done today?** | Today, GCC recruiters: (1) send Workday-generated email campaigns (job alerts, status updates) via Recruiting Campaigns with lower engagement, (2) use personal WhatsApp for time-sensitive outreach (offer discussions, interview confirmations), (3) manually copy-paste candidate phone numbers into WhatsApp, and (4) lose audit trail and consent records for WhatsApp conversations. P2: "Having something like a WhatsApp or other communication methodologies would be helpful especially in markets like GCC and Saudi… the campaign functionality in workday is limited email campaigns at this point." This creates compliance risk (Saudi PDPL, UAE PDPA require consent and data retention), recruiter inefficiency, and inconsistent candidate experience. |
| **How is our approach uniquely different from others?** | • **Native Workday integration**: WhatsApp delivered within Recruiting workflows—no separate tool; campaigns, templates, and audit trail in Workday<br>• **Consent-first**: Candidate opt-in for WhatsApp messaging; PDPL/PDPA compliant; consent captured and stored in Workday<br>• **Campaign extension**: Existing Recruiting Campaigns (job alerts, status updates, interview reminders) extended to WhatsApp—not email replacement, but channel choice<br>• **Enterprise scale**: Designed for high-volume GCC recruiting (Accenture, Baker Hughes, Shell scale); template management, delivery tracking, and reporting<br>• **Audit trail**: All WhatsApp messages logged in Workday for compliance and audit |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• Adoption Target: 42%<br>• Usage Volume: ~550,000 messages<br>  ○ Basis: ~70 GCC Recruiting customers × 42% adoption = 29 adopters; 29 adopters × 8 campaigns/month × 12 months × 200 avg recipients per campaign<br>  ○ Calculation: 29 × 8 × 12 × 200 = 556,800 messages (rounded to ~550,000)<br><br>**Strategic Value & Outcomes:**<br>1. **Increase candidate response rate**: Target 40% improvement in response rate vs email-only (baseline: ~20% email open; WhatsApp: 98% open rate in GCC). Success metric: Time to candidate response (target: 30% reduction; 5–15 min vs 24–48h email).<br>2. **Reduce recruiter manual work**: Eliminate personal WhatsApp workaround; 2–3 hours/week saved per recruiter on manual outreach. Success metric: % of candidate communications via Workday vs personal channels (target: 80% via Workday within 6 months).<br>3. **Drive Business & Platform Growth:**<br>   a. Monetization: Reduce churn risk; customers citing "no WhatsApp" as deal blocker in GCC<br>   b. Deal-Closing: Sales reports WhatsApp as objection in GCC deals; feature eliminates blocker<br>   c. Future Acceleration: Foundation for WhatsApp in other high-penetration regions (India, LATAM) |

### Audience / Personas

**Primary Persona**: GCC Recruiter
- Manages requisitions across Saudi, UAE, Kuwait, Qatar, Bahrain, Oman
- Reaches candidates for quick closures, status updates, interview coordination
- Today uses personal WhatsApp; needs Workday-native channel with audit trail

**Secondary Persona**: Candidate
- Applies for roles in GCC; expects WhatsApp for recruiter communication
- 98% WhatsApp penetration in UAE, Saudi, Kuwait; prefers WhatsApp over email

**Tertiary Persona**: Recruiting Leader
- Responsible for compliance (Saudi PDPL, UAE PDPA); needs consent and audit trail
- Today has no visibility into recruiter WhatsApp usage; needs governance

---

## Feature Solution

• **WhatsApp channel enablement**: Workday Recruiting enables WhatsApp as a candidate communication channel for GCC tenants (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman)
• **Campaign extension**: Existing Recruiting Campaigns (job alerts, status updates, interview reminders, offer notifications) can be sent via WhatsApp in addition to email
• **Channel selection**: Recruiters select Email, WhatsApp, or both when configuring campaigns
• **Recruiter-initiated messages**: Recruiters send templated WhatsApp messages from the Candidate Profile page or requisition context
• **Consent capture**: Candidates opt in to WhatsApp messaging; consent stored in Workday; PDPL/PDPA compliant
• **Template management**: Pre-approved WhatsApp Business API templates for common use cases (e.g., interview reminder, offer notification)
• **Audit trail**: All WhatsApp messages logged in Workday; delivery status, read receipts (where available)
• **Delivery tracking**: Campaign-level and message-level delivery status; reporting for Recruiting Leader
• **Scope**: GCC (Saudi, UAE, Kuwait, Qatar, Bahrain, Oman) at GA; Workday WhatsApp Business API integration

---

## Critical User Journey & Use Cases

**Use Case 1: Send Job Alert via WhatsApp**
• Recruiter creates job alert campaign for active candidates in talent pool
• Campaign configuration: Select channel (Email, WhatsApp, or both)
• Candidates who opted in to WhatsApp receive job alert via WhatsApp
• Candidates who did not opt in receive email; recruiter sees delivery status in Workday

**Use Case 2: Interview Reminder**
• Recruiter schedules interview; system sends reminder 24 hours before
• Recruiter selects WhatsApp channel for GCC candidates
• Candidate receives WhatsApp template message: "Your interview with [Company] is scheduled for [Date] at [Time]. Reply YES to confirm."
• Candidate confirms via WhatsApp; response captured in Workday

**Use Case 3: Recruiter-Initiated Outreach from Candidate Profile**
• Recruiter views candidate profile; WhatsApp consent status and "Send WhatsApp" action are visible on the profile page
• Candidate has opted in to WhatsApp; recruiter clicks "Send WhatsApp" or equivalent action
• Recruiter selects WhatsApp template (e.g., "Quick follow-up on your application")
• Message sent via Workday; audit trail logged; recruiter sees delivery status on the profile

**Use Case 4: Consent Management**
• Candidate applies via career site; consent checkbox: "I agree to receive recruitment updates via WhatsApp"
• Consent stored in candidate profile; recruiter sees WhatsApp channel indicator
• Candidate can opt out via link in WhatsApp message; opt-out updated in Workday

**Use Case 5: Compliance Reporting**
• Recruiting Leader runs "WhatsApp Campaign Report" for GCC entities
• Report shows: campaigns sent, delivery rate, opt-in rate, consent status
• Export for audit; PDPL/PDPA compliant data retention

---

## UX Designs for 2026R2

• **Candidate Profile – WhatsApp on Profile** - WhatsApp consent status, Send WhatsApp action, and message history visible on the Candidate Profile page - [Figma link pending - will be populated after 330 capture]
• **Candidate Profile – WhatsApp Opt-in** - [Figma link pending]
• **Recruiter – Send WhatsApp Message from Profile** - [Figma link pending]
• **Campaign Configuration – Channel Selection (Email + WhatsApp)** - [Figma link pending]
• **Compliance Report – WhatsApp Campaign Summary** - [Figma link pending]

---

## Releases & Production Thresholds

Legal review required: Saudi PDPL, UAE PDPA—consent for messaging, data retention, opt-out handling.
No AI/ML decision-making; communication channel extension only.

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD Approval | April 2026 |
| WhatsApp API Integration Design | May 2026 |
| Consent Capture & Opt-in Flow | June 2026 |
| Campaign Extension (Email + WhatsApp) | July 2026 |
| EA Release (GCC Pilot Customers) | September 2026 |
| GA Release (All GCC Customers) | November 2026 (2026R2) |

---

## Resources

• **Source Research**: research/GCC/thematic-analysis/2026-03-19-GCC-PMF-Analysis-v36.md
• **GCC PMF Theme**: Candidate Communication (WhatsApp) - Theme 5
• **Customer Evidence**: P1 (Accenture): "Absolutely WhatsApp is an absolute necessary… that's how I reach out to my candidates for quick closures. Emails will take whenever. But when you're looking at WhatsApp, you get immediate responses." P2 (Baker Hughes): "Having something like a WhatsApp or other communication methodologies would be helpful especially in markets like GCC and Saudi… the campaign functionality in workday is limited email campaigns at this point." P3 (Shell): Policy against WhatsApp for official business (exception case)
• **PESTEL Context**: GCC has 30M+ WhatsApp users in Saudi; 98% open rate vs 20% email; smartphone penetration Saudi 92%, UAE 97%; 40%+ career site traffic from mobile (P2); GCC app market growth 2.6% YoY vs 0.5% globally
• **Deployment Agent Context**: Workday Recruiting Campaigns use email only; Workday Messaging (SMS) supports U.S./Canada only; WhatsApp would extend campaigns as additional channel under Workday Messaging SKU
• **Legal Validation**: 060-legal-advisor—ensure candidate consent for messaging; data retention per PDPL/PDPA

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager |
| TBD | Recruiting Product Lead |
| TBD | Candidate Engagement Lead |
| TBD | Team App Dev Lead |
| TBD | Executive Sponsor (Product - Recruiting) |

---

*Workday Confidential    1*
*-- 1 of 1 --*
