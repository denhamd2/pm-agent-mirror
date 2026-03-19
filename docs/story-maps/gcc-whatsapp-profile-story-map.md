# Story Map: WhatsApp on Candidate Profile for GCC

**Epic**: HRREC-90925 - WhatsApp on Candidate Profile for GCC  
**Created**: 19 March 2026  
**Author**: Story Mapping Specialist  
**PRD**: docs/prds/gcc-whatsapp-integration-prd.md  
**Placement**: Candidate Profile page (primary)

---

## Epic Context

As a GCC recruiter, I want to send WhatsApp messages to candidates directly from the Candidate Profile page, so that I can reach candidates on their preferred channel (90%+ open rates) without leaving Workday or using personal devices.

**Key Personas**: GCC Recruiter (primary), Candidate, Recruiting Leader  
**Business Goals**: 40% improvement in response rate; 80% of candidate comms via Workday within 6 months; PDPL/PDPA compliance

---

## User Activities (Horizontal Backbone)

1. View candidate profile
2. Check WhatsApp consent status
3. Send WhatsApp message
4. Track delivery and audit

---

## User Tasks (Vertical Slices)

### Activity 1: View candidate profile
- Display WhatsApp consent status on Personal Information card → **VS1**
- Show Send WhatsApp action on Profile Header Card → **VS1**

### Activity 2: Check WhatsApp consent status
- Display Opted in / Opted out / No consent with visual indicator → **VS1**
- Block or warn when sending without consent → **VS1**

### Activity 3: Send WhatsApp message
- Open template selector modal from Send WhatsApp action → **VS1**
- Select pre-approved template (interview reminder, job alert, quick follow-up, offer notification) → **VS1**
- Preview message with variable substitution → **VS1**
- Send message and show delivery status → **VS1**
- Arabic/English template preview (where applicable) → **VS2**

### Activity 4: Track delivery and audit
- Log message in Workday audit trail → **VS1**
- Display delivery status (Sent | Delivered | Failed) on profile → **VS1**
- Message history view on profile → **VS2**

---

## Value Slices

### VS1: Candidate Profile WhatsApp (Walking Skeleton)
**Goal**: Recruiters can send WhatsApp from Candidate Profile with consent validation and audit trail

**Stories**:
1. Display WhatsApp consent status on Candidate Profile
2. Add Send WhatsApp action to Profile Header Card
3. Template selector modal with send flow
4. Consent validation before send (block or warn)
5. Audit trail and delivery status

**Total Stories**: 5

### VS2: Enhanced Experience
**Goal**: Arabic/English preview and message history

**Stories**:
1. Arabic/English template preview in selector
2. Message history view on Candidate Profile

**Total Stories**: 2

---

## Story Map Visualization

```
View Profile    Check Consent    Send Message    Track
-----           -----            -----           -----
Consent (VS1)   Status (VS1)     Modal (VS1)     Audit (VS1)
Send action     Block/warn       Template (VS1)  Status (VS1)
(VS1)           (VS1)           Preview (VS2)   History (VS2)
```

---

## Summary

**Total Activities**: 4  
**Total Tasks**: 9  
**Value Slices**: 2  
**VS1 Stories**: 5  
**VS2 Stories**: 2  
