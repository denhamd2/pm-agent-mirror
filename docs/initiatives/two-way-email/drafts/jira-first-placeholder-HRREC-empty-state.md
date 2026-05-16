# First placeholder Jira — created via MCP

**Created:** [HRREC-91974](https://jira2.workday.com/browse/HRREC-91974) — Epic link **HRREC-82977**, component **Candidate Two-Way Messaging**, Scrum Team **HRREC-Team 007**, labels **`M1`**, **`VS1`** only.

**Assignee:** David Denham (not Joanne Neilan). Set in Jira UI or via `setJiraTicketField` after MCP re-auth; value is usually your directory **accountId** or corporate **email**—pick from the assignee picker if the API rejects a display name.

Below: field cheat sheet + canonical description (paste into the ticket or push via MCP).

## Fields to set in Jira (UI or MCP)

| Field | Value |
|-------|--------|
| **Project** | HRREC |
| **Issue type** | Story |
| **Summary** | `PH: Recruiter sees Empty state of email task if opened` |
| **Epic link** | [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977) |
| **Components** | Same as epic HRREC-82977 (copy from epic — do not guess) |
| **Scrum Team** | Same as epic HRREC-82977 (copy from epic) |
| **Labels** | `M1`, `VS1` (milestone + release slice only) |
| **Acceptance Criteria** (custom field) | Blank wiki grid at create: `||ID||Acceptance Criteria||Test Owner||Test  ID||` then three `| | | | |` rows — populate during refinement (see **430** Step 6) |
| **Assignee** | David Denham |

---

## Description (canonical for [HRREC-91974](https://jira2.workday.com/browse/HRREC-91974))

Paste into the ticket description (or apply via `setJiraTicketField` after Jira MCP re-auth). **For REST/MCP**, use the wiki companion [`jira-first-placeholder-HRREC-empty-state.jirawiki`](jira-first-placeholder-HRREC-empty-state.jirawiki) — Jira does **not** accept raw GitHub markdown in `fields.description` (see **430** Step 6). The GFM block below is for Git review only: headings `##` / `###`, **Given** / **When** / **Then** with two trailing spaces + newline, no full stop at end of those lines; DoR pipe table without GFM separator row; **`## Notes`** last with default two-way-email links.

## User story

**As a** recruiter  
**I want** to see a clear empty state when I open the email task before any thread exists  
**So that** I understand what to do next and whether email is available for this candidate context  

## Scenarios

### Scenario 1: First open shows a true empty state, not an error

**Given** I am a recruiter with access to the candidate profile email task and no conversation exists yet for this candidate context  
**When** I open the email task  
**Then** I see the empty state designed for "no messages yet" and I am not shown a generic system error

### Scenario 2: Channel disabled reflects unavailable state

**Given** tenant admin has disabled 2-way email as a comms channel  
**When** I open the email task on a candidate profile  
**Then** I see an empty or unavailable state consistent with disabled channel policy and I cannot start compose from this surface

### Scenario 3: Empty state after purge of message artefacts

**Given** a prior conversation existed but a privacy admin purge removed message artefacts for this job application  
**When** I open the email task  
**Then** I see an empty or "no retained messages" state consistent with purge rules and I do not see purged message bodies

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
