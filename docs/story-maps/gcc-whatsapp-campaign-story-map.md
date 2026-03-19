# GCC WhatsApp Campaign - Story Map

**Epic:** WhatsApp Candidate Communication for GCC (HRREC-90871)  
**Source:** docs/prds/gcc-whatsapp-integration-prd.md  
**Date:** March 18, 2026

---

## User Activities (Horizontal Backbone)

| Activity | User Tasks |
|----------|------------|
| **Create Campaign** | Name campaign, select channels (Email/WhatsApp), write message |
| **Select Recipients** | Choose candidate list, validate phone numbers (E.164 for WhatsApp) |
| **Send & Track** | Send campaign, view delivery status, monitor response rates |

---

## Value Slices

### VS1: Channel Foundation
**Goal:** Enable WhatsApp as campaign channel; reduce candidate response time from 24-48h (email) to 5-15 min (WhatsApp)

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 1 | As a recruiter I want to select WhatsApp as a campaign channel so that I can reach GCC candidates where they respond | [HRREC-90872](https://jira2.workday.com/browse/HRREC-90872) | Given I am creating a campaign, When I select "WhatsApp" channel, Then the system validates recipient phone numbers in E.164 format |
| 2 | As a recruiter I want phone validation for WhatsApp so that invalid numbers are flagged before send | [HRREC-90873](https://jira2.workday.com/browse/HRREC-90873) | Given I have selected WhatsApp, When the candidate list loads, Then invalid phone numbers (missing country code) are highlighted |
| 3 | As a recruiter I want to send campaigns via WhatsApp so that candidates receive messages in their preferred channel | [HRREC-90874](https://jira2.workday.com/browse/HRREC-90874) | Given I have valid phone numbers, When I click Send Campaign, Then messages are sent via WhatsApp Business API |

### VS2: Campaign Parity
**Goal:** Achieve feature parity between email and WhatsApp campaigns (templates, scheduling)

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 4 | As a recruiter I want to use campaign templates for WhatsApp so that I can reuse proven messages | [HRREC-90875](https://jira2.workday.com/browse/HRREC-90875) | Given I have saved templates, When I create a WhatsApp campaign, Then I can select and edit a template |
| 5 | As a recruiter I want delivery status for WhatsApp so that I know which messages were delivered | [HRREC-90876](https://jira2.workday.com/browse/HRREC-90876) | Given I sent a campaign, When I view status, Then I see delivered/read counts per channel |

### VS3: Two-Way Messaging
**Goal:** Enable two-way WhatsApp for scheduling and document requests (Phase 2)

| # | Story | Jira | BDD Scenario |
|---|-------|------|--------------|
| 6 | As a candidate I want to reply to WhatsApp messages so that I can confirm quickly | [HRREC-90877](https://jira2.workday.com/browse/HRREC-90877) | Given I received a WhatsApp message, When I reply YES/NO, Then my response is logged in Workday |
| 7 | As a recruiter I want interview confirmations via WhatsApp so that candidates get instant confirmation | [HRREC-90878](https://jira2.workday.com/browse/HRREC-90878) | Given I scheduled an interview, When confirmation is sent, Then candidate receives WhatsApp with reply option |

---

## Story Count Summary

| Value Slice | Stories | Goal |
|-------------|---------|------|
| VS1: Channel Foundation | 3 | WhatsApp as channel; E.164 validation |
