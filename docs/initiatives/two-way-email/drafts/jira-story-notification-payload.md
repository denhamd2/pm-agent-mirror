**Applied to Jira:** [HRREC-91975](https://jira2.workday.com/browse/HRREC-91975) (2026-05-13). **Push the companion wiki file** [`jira-story-notification-payload.jirawiki`](jira-story-notification-payload.jirawiki) via `setJiraTicketField` / REST — **not** the GFM markdown below (Jira stores Description as wiki markup).

---

## User story

**As a** recruiter  
**I want** to be notified when a candidate or agency user replies to my recruiting email  
**So that** I respond in Workday without living in an external inbox  

## Scenarios

### Scenario 1: New inbound reply surfaces notification

**Given** a candidate replied to the last outbound recruiting email  
**When** the integration ingests the inbound message for my tenant  
**Then** I receive a notification I can act on from Workday and opening it lands on the correct candidate and thread

### Scenario 2: No notification when I lack notification domain access

**Given** I do not have access to the conversational notification domain  
**When** an inbound reply is ingested for a conversation I otherwise could not access  
**Then** I do not receive a misleading partial notification and access rules match security configuration

### Scenario 3: Duplicate ingest does not spam notifications

**Given** the same inbound message id is processed twice by the integration  
**When** the duplicate event is detected  
**Then** I receive at most one user-visible notification for that reply

## Definition of Ready

| **Criterion** | **Any blocking issues to being ready / Notes** |
| We understand the value this work provides to customers and how it supports the product vision. | |
| We have clearly defined, understand, and agree on the Acceptance Criteria. | |
| We have no blocking open questions. | |
| There are no dependencies blocking completion. | |
| We agree on the Manual and Automation testing approach. | |
| We agree on the customer documentation impacts. | |
| We have relatively sized the Story. | |
| We can complete the Story according to our Workday Definition of Done in a sprint. | |
| We have documented our discussions and the key decision points. | |
| We have discussed toggles | |

## Notes

- Figma design: [2-Way Email Recruiting - MVP designs](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6913-20249&t=z4GjQzGKwojLlwJw-1)
- PRD: [2-Way Email PRD doc](https://docs.google.com/document/d/13JkI_kUlyz6JfLDuEfSyheLPZ6K-P_oMP9ZeoHcvG_w/edit?usp=sharing)
