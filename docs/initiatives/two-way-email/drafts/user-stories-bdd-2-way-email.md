# 2-Way Email Communication — User stories and BDD (draft)

**Sources:** User story map PDF ([`../story-map/user-story-map-export.pdf`](../story-map/user-story-map-export.pdf)), story-mapping transcript ([`../transcripts/110526-user-story-mapping-2-way-email.pdf`](../transcripts/110526-user-story-mapping-2-way-email.pdf)), user research readout ([`../user-research/2-way-email-research-readout.pdf`](../user-research/2-way-email-research-readout.pdf)), India profile PRD where overlapping ([`../../prds/india-candidate-profile-email-conversation-prd.md`](../../prds/india-candidate-profile-email-conversation-prd.md)), and functional-knowledge themes (audit trail, purge/PII, duplicate/merge).

**Story titles** match the **wording on the original post-it notes** from the map export (whitespace normalised only).

**Milestone grouping:** Stories are filed under **M1–M8** using the milestone **names** printed on the map and **semantic alignment** with each milestone’s intent (Initialisation, Compose, Send/Discard, List, Wide view, Errors/Info, Lifecycle/Reporting, Misc). The map arranges milestones on the **left** with **horizontal** band dividers — **please verify** each sticky still sits in the correct band on the PDF before Jira or 420 HITL sign-off; adjust section headers only if a note was mis-filed.

**BDD:** At least **three** scenarios per story: happy path, **negative or edge** path, and permission/integration/audit where relevant. Wording reflects **team discussion** (e.g. discard on navigation vs Discard control; opt-out as “in-between” state with reply/add hidden; no **templates** for MVP; subject validation; bounce/unread; conversation **hard stop at one year** per job app; purge of communication PII).

**Guardrails:** Draft only — no Jira creation ([430](.cursor/rules/430-story-writing.mdc) entry guard until 420 HITL). HRREC keys are **references** to existing XO/initialisation work where noted.

---

## M1 — Initialisation (View task & Empty state)

### VS1 — Recruiter sees Empty state of email task if opened

**As a** recruiter
**I want** to see a clear empty state when I open the email task before any thread exists
**So that** I understand what to do next and whether email is available for this candidate context

**Acceptance criteria**
- Empty state copy and layout match approved design (Figma).
- Empty state does not imply an error when no messages exist yet.
- If the tenant has disabled 2-way email channel, empty state reflects disabled/unavailable state per admin configuration.

```gherkin
Feature: M1 Email task empty state
  Scenario: First open shows helpful empty state
    Given I am a recruiter with access to the candidate profile email task
    And no conversation exists yet for this candidate context
    When I open the email task
    Then I see the empty state designed for “no messages yet”
    And I am not shown a generic system error
  Scenario: Empty state when channel disabled by admin
    Given tenant admin has disabled 2-way email as a comms channel
    When I open the email task on a candidate profile
    Then I see an empty or unavailable state consistent with disabled channel policy
    And I cannot start compose from this surface
  Scenario: Empty state after purge removed all messages
    Given a prior conversation existed but privacy admin purge removed message artefacts for this job application
    When I open the email task
    Then I see an empty or “no retained messages” state consistent with purge rules
    And I do not see purged message bodies
```

### VS1 — Recruiter receives a notification

**As a** recruiter
**I want** to be notified when a candidate or agency user replies to my recruiting email
**So that** I respond in Workday without living in an external inbox (team transcript: audit and handoff)

**Acceptance criteria**
- Notification is raised on inbound reply relevant to my subscribed conversation.
- Notification respects my security domain for the conversational email / notification task (transcript: recruiter without conversational notification domain).
- Deep link opens the correct candidate context and thread.

```gherkin
Feature: Inbound reply notifications
  Scenario: New inbound reply surfaces notification
    Given a candidate replied to the last outbound recruiting email
    When the integration ingests the inbound message for my tenant
    Then I receive a notification I can act on from Workday
    And opening it lands on the correct candidate and thread
  Scenario: No notification when I lack notification domain access
    Given I do not have access to the conversational notification domain
    When an inbound reply is ingested for a conversation I otherwise could not access
    Then I do not receive a misleading partial notification
    And access rules match security configuration
  Scenario: Duplicate ingest does not spam notifications
    Given the same inbound message id is processed twice by the integration
    When the duplicate event is detected
    Then I receive at most one user-visible notification for that reply
```

### VS1 — Admin can enable / disable 2-way email as a comms channel

**As a** tenant admin
**I want** to enable or disable 2-way email as a comms channel for my tenant
**So that** I control rollout and policy alignment before recruiters see compose surfaces

**Acceptance criteria**
- Toggle is explicit and auditable (who changed it, when).
- When disabled, recruiters cannot compose or send from the in-product email path covered by this initiative.
- When enabled, prerequisites (domains / tasks) follow engineering spike outcomes (transcript: tech deep dive follow-ups).

```gherkin
Feature: Tenant channel toggle
  Scenario: Enable channel for pilot tenant
    Given I am a tenant admin
    When I enable 2-way email as a comms channel
    Then recruiters in scope see the email affordances per configuration
  Scenario: Disable mid-flight blocks new sends
    Given 2-way email was enabled
    And a recruiter has an unsent draft open
    When I disable the channel
    Then the recruiter cannot successfully send new messages from the governed surface
    And they see messaging consistent with disabled channel policy
  Scenario: Audit entry for toggle change
    Given I change the channel toggle
    When the change is saved
    Then an auditable record exists suitable for enterprise compliance review
```

### VS1 — Recruiter does not have access to the compose email task

**As a** recruiter
**I want** the UI to reflect that I do not have security access to the compose email task
**So that** I am not shown controls I cannot use (transcript walkthrough of access variants)

**Acceptance criteria**
- Compose entry points are hidden or disabled with an explanation consistent with RBAC.
- No client-side bypass exposes compose APIs without server authorization.
- If I gain access later, compose becomes available without stale client cache showing dead ends.

```gherkin
Feature: Compose task security
  Scenario: No compose for unauthorized recruiter
    Given my security role does not grant compose email task access
    When I view the candidate profile communications area
    Then I do not see compose actions I cannot execute
  Scenario: Attempt deep link to compose while unauthorized
    Given I lack compose access
    When I attempt a deep link or bookmarked route that targets compose
    Then I am blocked with an access-denied experience
    And no draft is created server-side
  Scenario: Read-only still allows appropriate read paths
    Given I have read but not compose entitlement where product policy allows read
    When I open allowed read surfaces
    Then I can consume permitted thread metadata without compose controls
```

### VS1 — Recruiter sees the panel expand when clicking Add to compose an email

**As a** recruiter
**I want** the side panel to expand when I choose Add to compose an email
**So that** I get a wider layout suited to email composition (transcript: wider form factor vs SMS/WhatsApp)

**Acceptance criteria**
- Add triggers expansion consistent with Figma for MVP.
- Expansion preserves candidate context (sticky: context stays — validated against design spike outcomes).
- If Add is unavailable (closed conversation, opt-out, channel off), expansion does not occur and I see the correct blocking reason.

```gherkin
Feature: Panel expansion for compose
  Scenario: Add expands panel for compose
    Given I am eligible to compose
    When I click Add to compose an email
    Then the panel expands to the email composition layout
  Scenario: Add blocked when conversation not sendable
    Given the candidate has opted out (conversation in in-between state per transcript)
    When I attempt Add / compose entry
    Then I do not get compose expansion
    And reply/add remain suppressed per policy
  Scenario: Context preserved across expand
    Given I had candidate profile context visible before expand
    When I expand for compose
    Then key candidate identifiers for the active context remain available without navigation loss
```

### VS1 — HRREC-91946 [Initialisation] Recruiter can see Email Task on SSP (XO Only)

**As a** recruiter
**I want** to see the Email task on SSP as delivered by the XO initialisation track
**So that** I can enter the email experience from the standard task surface

**Acceptance criteria**
- XO task visibility matches HRREC-91946 scope.
- Feature flag / tenant config respected.
- No regression to unrelated SSP tasks.

```gherkin
Feature: SSP email task (XO)
  Scenario: Task visible when initialisation complete
    Given HRREC-91946 deliverables are deployed for my tenant
    When I open SSP for an in-scope candidate context
    Then I can see the Email task per XO configuration
  Scenario: Task hidden when not in scope
    Given my tenant is not configured for this task surface
    When I open SSP
    Then I do not see a broken or partial Email task entry
  Scenario: Task present but channel disabled
    Given the Email task exists
    And admin disabled 2-way email channel
    When I open the task
    Then behaviour matches combined XO + channel policy (no dead compose loop)
```

### VS1 — HRREC-91948 [Initialisation] Enabled SSP Growth/Expansion

**As a** recruiter
**I want** SSP growth/expansion enabled for the conversational email surfaces per XO
**So that** The sliding panel supports the wider email layout without layout corruption (transcript)

**Acceptance criteria**
- SSP expansion behaviour matches HRREC-91948.
- No clipping of message builder fields at common breakpoints.
- Accessibility targets maintained per NFR discussion.

```gherkin
Feature: SSP growth expansion
  Scenario: Expanded SSP region accommodates email chrome
    Given HRREC-91948 is active
    When I expand the panel for email
    Then growth/expansion behaviour matches design specifications
  Scenario: Small viewport degradation
    Given a narrow recruiter viewport
    When I expand for email
    Then the layout degrades safely without unusable overlap
  Scenario: Expansion disabled by policy
    Given tenant disables expansion feature for SSP (if configurable)
    When I attempt email compose
    Then I see a controlled fallback consistent with configuration
```

### VS1 — HRREC-91947 [Initialisation] New Conversational Email Domain (XO)

**As a** platform admin / engineer
**I want** the new conversational email security domain (XO) to exist and bind to the right tasks
**So that** RBAC can distinguish conversational email vs other messaging domains (transcript: notification domain variant)

**Acceptance criteria**
- Domain creation aligns with HRREC-91947.
- Recruiter without domain cannot access governed actions.
- Audit events reference domain-qualified actions where required.

```gherkin
Feature: Conversational email domain
  Scenario: Domain present for in-scope tenants
    Given HRREC-91947 is deployed
    When administrators review security configuration
    Then conversational email domain artefacts exist as designed
  Scenario: Recruiter missing conversational notification domain
    Given I lack conversational notification domain access (transcript)
    When I attempt notification-driven entry points that require it
    Then I am denied consistently on client and server
  Scenario: Misconfigured domain fails closed
    Given the domain is not assigned to my test user
    When I attempt governed actions
    Then the system fails closed without exposing message content
```


## M2 — Compose Email

### VS1 — Recruiter can compose an email if candidate is opted in & has modify access to new domain

**As a** recruiter
**I want** to compose when the candidate is opted in and I have modify access to the new domain
**So that** I only send compliant mail to candidates who can receive it

**Acceptance criteria**
- Compose is blocked when candidate not opted in.
- Compose requires modify access to the new domain.
- Transactional vs marketing paths follow PRD/legal classification for India overlap (FR-5).

```gherkin
Feature: Compose eligibility
  Scenario: Happy path compose when opted in
    Given the candidate is opted in to receive recruiting email
    And I have modify access to the new conversational email domain
    When I open compose
    Then I can enter body, subject, and recipients per MVP scope
  Scenario: Blocked when not opted in
    Given the candidate is not opted in
    When I attempt to open compose
    Then I am blocked with an explanation consistent with consent policy
  Scenario: Blocked without modify domain access
    Given the candidate is opted in
    But I lack modify access to the domain
    When I attempt compose
    Then I am blocked server-side and the UI does not allow send
```

### VS1 — Recruiter expands/collapses the panel to check candidate profile (context stays?)

**As a** recruiter
**I want** to expand or collapse the panel to check the candidate profile while composing
**So that** I do not lose email draft context when peeking at profile (sticky question)

**Acceptance criteria**
- Panel collapse/expand preserves unsent draft where product policy promises preservation.
- If discard is required on navigation, VS2 discard stories apply; conflict resolved in UX spec.
- Keyboard / focus order remains usable.

```gherkin
Feature: Compose context preservation
  Scenario: Toggle panel while drafting
    Given I have a non-empty draft
    When I temporarily collapse or expand to view profile fields
    Then my draft content is preserved per approved interaction model
  Scenario: Navigation away triggers discard rules
    Given discard-on-navigation is in scope for GA (VS2)
    When I navigate away without saving per policy
    Then I receive the discard prompt behaviour defined for that release slice
  Scenario: Rapid toggles do not corrupt draft
    Given I rapidly expand/collapse the panel
    When the UI settles
    Then draft text matches last stable editor state
```

### VS1 — Recruiter can compose an email to agency user or candidate & select the appropriate email (To field selection)

**As a** recruiter
**I want** to choose To = agency user or candidate on a single-recipient MVP compose
**So that** I match formal agency-heavy workflows (transcript: Germany/Japan agency patterns)

**Acceptance criteria**
- MVP supports one primary recipient per transcript.
- Invalid recipient combinations blocked.
- Agency cannot see recruiter-only threads (paired M7 story).

```gherkin
Feature: To field selection
  Scenario: Send to candidate
    Given I choose the candidate as To
    When I address and send a valid message
    Then routing targets candidate channel endpoints
  Scenario: Send to agency user
    Given I choose an agency user as To
    When I address and send a valid message
    Then routing targets agency channel endpoints
  Scenario: Invalid recipient
    Given I attempt To selection that violates MVP constraints
    When I try to send
    Then I see validation and cannot send
```

### VS1 — Recruiter attaches documents to send to candidate/agency user

**As a** recruiter
**I want** to attach allowed documents for the candidate or agency user
**So that** I exchange formal documents over email inside Workday (transcript: attachments in MVP)

**Acceptance criteria**
- Attachment types restricted per security policy.
- Oversized / disallowed types show clear errors.
- Virus scan / malware handling per platform standard (edge case discussed).

```gherkin
Feature: Outbound attachments
  Scenario: Attach allowed file and send
    Given I select an allowed attachment under size limits
    When I send the email
    Then the attachment is delivered with the message record auditable in Workday
  Scenario: Disallowed type blocked for recruiter
    Given I pick a disallowed file type (transcript: PSD / unsupported class)
    When I attempt to attach or send
    Then I see a specific validation error and send is blocked
  Scenario: Scan failure blocks send
    Given the attachment fails malware scanning
    When I try to send
    Then send is blocked and I see a safe error pattern
```

### VS1 — Recruiter wants to format the message & add subject

**As a** recruiter
**I want** to format the message body and set subject using message builder components where available
**So that** My emails are readable and professional (transcript: leverage message builder / rich text)

**Acceptance criteria**
- Subject required validation (transcript: missing subject line validation called out on walkthrough).
- Formatting within supported RTE subset for MVP.
- No templates control for MVP compose path (transcript: no templates for MVP).

```gherkin
Feature: Subject and formatting
  Scenario: Send blocked without subject when required
    Given subject is required for send
    When I attempt send with an empty subject
    Then I see UI validation on Send and cannot send
  Scenario: Basic formatting preserved
    Given I apply supported formatting in the editor
    When I save draft or send
    Then formatting round-trips within supported subset
  Scenario: Pasted rich content sanitised
    Given I paste content from an external editor with unsupported markup
    When the editor normalises content
    Then unsafe or unsupported constructs are stripped or rejected with user-visible outcome
```

### VS1 — Recruiter can select From address from list of valid email addresses

**As a** recruiter
**I want** to pick a From address from my organisation’s allowed list
**So that** Recipients see trusted sender domains (transcript: initial subdomain; vanity domains dependency out of MVP)

**Acceptance criteria**
- Only verified From identities list.
- If list empty / misconfigured, fail with actionable admin message.
- Changing From resets incompatible draft elements if required by policy.

```gherkin
Feature: From address selection
  Scenario: Pick allowed From and preview headers
    Given multiple From addresses are provisioned for me
    When I select a different From
    Then headers preview update and send uses selected identity
  Scenario: No valid From configured
    Given no From addresses are available for my context
    When I open compose
    Then I am blocked with guidance for admin remediation
  Scenario: From switched after draft started
    Given I already typed a draft
    When I change From in a way that invalidates signatures or templates rules
    Then I am informed and blocked or guided per policy
```

### VS1 — Recruiter does not see any tabs for non-agency candidate

**As a** recruiter
**I want** not to see agency/candidate tabs when the candidate is not agency-associated
**So that** I avoid confusing chrome for direct candidate relationships (map sticky)

**Acceptance criteria**
- Tab chrome hidden when not applicable.
- If context later becomes agency-associated, tabs appear without data bleed.
- Security: never show agency tab content without entitlement.

```gherkin
Feature: Tab visibility
  Scenario: Non-agency candidate hides tabs
    Given the candidate is not agency-associated per rules
    When I open the email panel
    Then I do not see agency/candidate tabs meant for dual-channel switching
  Scenario: Agency-associated shows tabs
    Given an agency relationship exists
    When I open the email panel
    Then I can switch tabs per M7 story without cross-leak
  Scenario: Entitlement loss mid-session
    Given I lose agency entitlement while panel open
    When the client refreshes security context
    Then agency tab content is removed or masked
```

### VS1 — Recruiter attaches non-supported files

**As a** recruiter
**I want** to be stopped clearly when I try to attach a non-supported file type
**So that** I do not accidentally send insecure or unusable attachments

**Acceptance criteria**
- Mirror candidate-side unsupported attachment rules with recruiter-appropriate copy.
- Error pattern: problem + solution (319).
- Telemetry optional — not asserted here.

```gherkin
Feature: Recruiter unsupported attachment
  Scenario: Block exe or disallowed type
    Given I pick a recruiter attachment that is disallowed
    When I add the attachment
    Then I see a clear error and the file is not staged for send
  Scenario: Attempt send with unstaged blocked file
    Given a blocked file failed to attach
    When I attempt send
    Then send cannot proceed until I remove the failing attachment attempt
  Scenario: Large file exceeds limit
    Given file exceeds maximum configured size
    When I attach
    Then I see size-specific guidance
```


## M3 — Send/Discard Email

### VS1 — Recruiter sees UI error validations on Send

**As a** recruiter
**I want** inline validation when Send is pressed with invalid compose state
**So that** I fix issues before a failed round-trip (transcript: missing subject and other validations)

**Acceptance criteria**
- Validations cover required fields per MVP.
- Server-side validation mirrors client for security.
- Accessible error association to fields.

```gherkin
Feature: Send validations
  Scenario: Missing subject blocked
    Given subject is empty and required
    When I press Send
    Then I see validation on Send and the message is not sent
  Scenario: Invalid To blocked
    Given To selection violates rules
    When I press Send
    Then I see field-level validation and no outbound call succeeds
  Scenario: Network offline shows resilient error
    Given I lose connectivity after pressing Send
    When the client handles timeout
    Then I see a recoverable error state without silent loss of draft where policy requires retention
```

### VS1 — Recruiter sends message - recipient receives it and recruiter sees it in the panel

**As a** recruiter
**I want** to send and see the outbound appear in-thread with correct state
**So that** I trust the system of record (transcript: sent/delivered tags; audit)

**Acceptance criteria**
- Outbound persisted with timestamps and channel=email for audit (PRD FR-4 alignment).
- Recipient receives via integration path.
- Optimistic UI must reconcile with failure (REST error story).

```gherkin
Feature: Successful send
  Scenario: Happy send shows in panel
    Given a valid compose
    When I send
    Then the message appears in the thread with sent state
    And the recipient receives the email on the mail path
  Scenario: Send succeeds but delayed state update
    Given the provider acknowledges slowly
    When I send
    Then UI shows pending/processing state until acknowledgement
  Scenario: Duplicate send idempotency
    Given I double-tap Send accidentally
    When the client debounces or server dedupes
    Then only one logical message is created
```

### VS2 — Recruiter gets discard popup by changing pages

**As a** recruiter
**I want** a discard confirmation when I navigate away after editing
**So that** I do not lose work silently (transcript: discard when changing pages)

**Acceptance criteria**
- Popup matches Figma copy.
- Choosing Keep cancels navigation.
- Choosing Discard clears draft per policy.

```gherkin
Feature: Discard on navigation
  Scenario: Navigation with dirty draft prompts
    Given I edited the draft
    When I attempt to change pages without saving
    Then I see a discard confirmation dialog
  Scenario: Cancel navigation keeps draft
    Given the discard dialog is open
    When I cancel navigation
    Then I remain on the compose context with draft intact
  Scenario: Confirm discard clears draft
    Given the discard dialog is open
    When I confirm discard
    Then the draft is cleared and navigation proceeds
```

### VS2 — Recruiter gets discard popup when they click the Discard button

**As a** recruiter
**I want** an explicit discard confirmation when I click Discard
**So that** I avoid accidental loss (transcript: in Figma)

**Acceptance criteria**
- Discard button always confirms when draft dirty.
- If no changes, optional lightweight dismiss per UX spec.
- Discard is auditable if compliance requires non-repudiation of withdrawal.

```gherkin
Feature: Discard button
  Scenario: Dirty draft shows confirmation
    Given I edited the draft
    When I click Discard
    Then I must confirm before draft is cleared
  Scenario: Clean draft may discard quickly
    Given I made no edits
    When I click Discard
    Then behaviour matches UX spec (immediate or single confirm)
  Scenario: Keyboard escape does not silently wipe
    Given I press Escape in compose
    Then I do not lose a dirty draft without confirmation
```


## M4 — View Email List

### VS1 — Recruiter sees list of messages with unread ones marked in blue

**As a** recruiter
**I want** a thread list with unread markers in blue
**So that** I triage volume quickly (transcript: unread in blue; list + tags discussion)

**Acceptance criteria**
- Unread state derives from server truth.
- Colour tokens match Figma accessibility checks.
- When all read, blue markers absent.

```gherkin
Feature: Thread list unread
  Scenario: Unread inbound highlights
    Given a thread has unread inbound messages
    When I view the list
    Then unread markers appear in blue per design
  Scenario: Mark read on open elsewhere
    Given another recruiter opened the message and marked read per policy
    When I refresh my list
    Then unread state matches server
  Scenario: Tenant colour-blind safe pattern
    Given accessibility mode requires non-colour cue
    When I view unread rows
    Then unread status is not conveyed by colour alone
```

### VS1 — Recruiter can see message threads when clicking on a message

**As a** recruiter
**I want** to open a thread preview or detail when I click a list row
**So that** I scan context before wide view (basic threading transcript)

**Acceptance criteria**
- Click selects thread and loads chronological messages.
- Large threads paginate or virtual-scroll under performance NFR.
- Broken thread id shows recoverable error.

```gherkin
Feature: Thread selection
  Scenario: Click loads thread
    Given multiple threads exist
    When I click a row
    Then I see messages in chronological order for that thread
  Scenario: Click row with missing remote messages
    Given provider returned partial history
    When I click the row
    Then I see explicit partial-history messaging and retry affordance
  Scenario: Double-click does not duplicate loads
    Given I click rapidly twice
    When loads complete
    Then only one active load runs and UI remains consistent
```

### VS1 — Recruiter sees blue "unread marker" removed after clicking in the view a message in full

**As a** recruiter
**I want** unread markers to clear after I fully view a message
**So that** My list reflects what I have actually processed (transcript list walkthrough)

**Acceptance criteria**
- Read receipt to server when policy defines read.
- If read fails to persist, marker returns on refresh (edge).
- Unread marker semantics consistent with notification read state.

```gherkin
Feature: Unread marker clearing
  Scenario: Full view clears unread
    Given a thread row is unread
    When I open the message in full view per policy
    Then the blue unread marker clears for that thread
  Scenario: Partial peek does not clear
    Given policy requires full view to mark read
    When I only peek without meeting read criteria
    Then unread marker remains
  Scenario: Concurrent recruiters
    Given another recruiter reads the same thread
    When I refresh
    Then unread state reflects per-user read model or shared model per product decision
```


## M5 — View Email (wide view)

### VS1 — Recruiter opens the message to read and reply

**As a** recruiter
**I want** to read full content and reply from wide view
**So that** I complete the loop without external mail (transcript)

**Acceptance criteria**
- Reply affordance obeys conversation state (paired with closed/opt-out rules).
- Inbound renders with sender attribution (PRD FR-1/FR-3 alignment).
- Attachments render per security preview rules.

```gherkin
Feature: Read and reply entry
  Scenario: Open and read inbound
    Given an inbound candidate reply exists
    When I open the message
    Then I see body and metadata with correct attribution
  Scenario: Reply hidden when not allowed
    Given both conversations are closed (transcript edge)
    When I view the message
    Then reply/add/forward are not offered and I see info message
  Scenario: Malformed MIME shows safe error
    Given inbound MIME is malformed
    When I open
    Then I see a safe parsing error without script execution
```

### VS1 — Recruiter sees the panel expand & views full message when clicking the grow button or clicking a single message

**As a** recruiter
**I want** wide reading layout via grow or single-message open
**So that** Long-form email is readable (transcript: wider panel vs SMS)

**Acceptance criteria**
- Grow toggles consistent with Figma.
- Single-message click opens same wide reader path.
- Focus management returns logically on collapse.

```gherkin
Feature: Wide reading layout
  Scenario: Grow expands reader
    Given I am in list or narrow reader
    When I click grow
    Then I see full message layout width per design
  Scenario: Single message click opens wide
    Given I click a single message row
    When the transition completes
    Then I land in wide reader with same content identity
  Scenario: Grow unavailable on tiny screens
    Given viewport below minimum supported width
    When I attempt grow
    Then I see responsive fallback without broken scroll
```

### VS1 — Style only - Recruiter sees messages showing, styled as per figma

**As a** recruiter
**I want** visual styling of messages to match Figma tokens
**So that** The experience matches Sana / recruiting patterns for trust

**Acceptance criteria**
- Typography, spacing, chips for states match design tokens.
- Dark mode / contrast if in scope for surface.
- No functional change — regression-only risk called out.

```gherkin
Feature: Visual parity
  Scenario: Default light theme matches Figma reference
    Given standard recruiter theme
    When I render thread and compose chrome
    Then styles match approved reference screenshots within tolerance
  Scenario: High contrast mode
    Given OS high contrast enabled
    When I view messages
    Then text and chips remain legible
  Scenario: Token drift caught in CI snapshot optional
    Given automated visual tests exist
    When a developer changes tokens incorrectly
    Then CI fails for unintended visual drift
```


## M6 — Error & Info Handling

### VS1 — Recruiter sees error messages if their email has bounced

**As a** recruiter
**I want** clear bounce diagnostics on affected outbound
**So that** I correct addressability issues quickly (transcript: bounce in list discussion)

**Acceptance criteria**
- Bounce reason codes surfaced without leaking PII inappropriately.
- Retry rules per provider constraints.
- Link to candidate email change story when relevant.

```gherkin
Feature: Bounce handling
  Scenario: Hard bounce shows actionable error
    Given provider returns hard bounce for last send
    When I view the thread row or detail
    Then I see bounce-specific messaging and next steps
  Scenario: Soft bounce temporary state
    Given soft bounce occurs
    When I view status chips
    Then I see a non-terminal state with retry guidance per policy
  Scenario: Bounce on thread I cannot access
    Given I lack access to underlying candidate
    When a bounce event occurs
    Then I do not see another recruiter's private bounce detail
```

### VS1 — Recruiter sees error when sending message (REST error)

**As a** recruiter
**I want** structured handling when REST send fails
**So that** I can recover or retry without silent loss (transcript: REST error called out)

**Acceptance criteria**
- Surface correlation id for support.
- Preserve draft where policy says so.
- 429/503 backoff messaging distinct from 400 validation.

```gherkin
Feature: REST send failure
  Scenario: 400 validation from service
    Given server rejects payload
    When send returns 400 with field errors
    Then I see mapped field errors and draft remains for correction
  Scenario: 503 transient
    Given service unavailable
    When I send
    Then I see retryable error and draft retained
  Scenario: 401 session expired
    Given my session expired mid-send
    When send fails with 401
    Then I am prompted to re-authenticate without misleading "validation" copy
```

### VS1 — Recruiter sees info message and cannot send email if the candidate changes their email

**As a** recruiter
**I want** blocking with explanation when candidate email identity changes mid-thread
**So that** I do not send to wrong person (map sticky + transcript)

**Acceptance criteria**
- Detect email change event vs thread binding.
- Offer remediation steps (refresh candidate contact).
- Audit log entry for block reason.

```gherkin
Feature: Candidate email change guard
  Scenario: Candidate email updated blocks new sends
    Given an active thread
    When candidate primary email changes per candidate record
    Then I see info message and cannot send until I resolve addressing per policy
  Scenario: No false positive on display-only refresh
    Given no actual email field change
    When UI refreshes candidate data
    Then I am not blocked incorrectly
  Scenario: Historical messages remain read-only
    Given prior messages under old email
    When I view history
    Then I can read per retention rules but not reply if blocked
```


## M7 — Conversation Lifecycle & Reporting

### VS1 — Candidates opt-out of receiving emails

**As a** recruiter / candidate
**I want** conversation to enter the opt-out in-between state
**So that** Recruiters cannot send new mail but conversation is not fully closed (transcript with DUB)

**Acceptance criteria**
- Hide reply and add per transcript.
- Re-opt-in path if business allows continuation.
- Marketing vs transactional consent rules respected where applicable.

```gherkin
Feature: Candidate opt-out
  Scenario: Opt-out hides reply and add
    Given candidate opts out
    When I view the conversation
    Then reply and add are hidden and I cannot send new messages
  Scenario: Not fully closed state
    Given opt-out in-between state applies
    Then conversation is not marked fully closed per transcript semantics
  Scenario: Re-opt-in restores send
    Given candidate re-opts in per policy
    When I refresh conversation state
    Then reply/add return if business rules allow
```

### VS1 — Recruiter can switch between tabs for candidate and agency comms

**As a** recruiter
**I want** tabs to switch candidate vs agency email threads where applicable
**So that** I manage formal agency coordination (transcript: agency-heavy regions)

**Acceptance criteria**
- No cross-leak of thread bodies.
- Tabs hidden per non-agency story.
- Deep link selects correct tab.

```gherkin
Feature: Candidate/agency tabs
  Scenario: Switch tabs preserves per-tab scroll where designed
    Given both tabs visible
    When I switch tabs
    Then I see the correct thread for each relationship
  Scenario: Agency tab forbidden without entitlement
    Given I lack agency entitlement
    When I attempt agency tab
    Then access is denied without exposing snippets
  Scenario: XSS in agency display name rejected
    Given agency display name contains HTML
    When I render tab label
    Then content is escaped per security baseline
```

### VS1 — Agency cannot see recruiter conversation

**As a** agency user
**I want** not to see recruiter-internal conversation artefacts outside my scope
**So that** Confidentiality matches enterprise recruiting practice (map sticky)

**Acceptance criteria**
- Server enforces scoping; never UI-only.
- Agency sees only threads addressed to agency per policy.
- Pen-test cases for IDOR on thread ids.

```gherkin
Feature: Agency isolation
  Scenario: Agency user thread list scoped
    Given I am authenticated as an agency user
    When I list threads
    Then I only see threads intended for agency visibility
  Scenario: Direct object reference attack fails
    Given I guess another thread id
    When I request it
    Then I receive 404 or 403 without content leak
  Scenario: Recruiter-only notes never in agency export
    Given recruiter added internal-only metadata if any exists
    When agency exports or views thread
    Then internal-only metadata is absent
```

### VS1 — Recruiter can see both closed and non-closed conversation in the same panel if one conversation is still active

**As a** recruiter
**I want** mixed states in one panel when one thread remains active
**So that** I retain legal context without UI fragmentation (map sticky)

**Acceptance criteria**
- Closed threads read-only.
- Active thread still sendable per rules.
- Clarity on which thread receives send.

```gherkin
Feature: Mixed closed/active
  Scenario: One active allows send target selection
    Given one active and one closed thread in panel
    When I attempt send
    Then send targets the active thread only
  Scenario: Mis-select prevented
    Given UI could confuse target
    When I send
    Then explicit target confirmation or single active send path prevents mis-send
  Scenario: All closed shows M6/M7 combined messaging
    Given all threads closed
    When I view panel
    Then I see info that conversation is closed and send is disabled
```

### VS1 — Recruiter sees tags on messages showing updating state (sent, delivered etc.)

**As a** recruiter
**I want** state chips for sent/delivered etc. where MVP supports
**So that** I trust pipeline state; read receipts called out as post-MVP in transcript

**Acceptance criteria**
- At minimum sent; delivered only if provider truth available without read-receipt MVP.
- States transition without duplicate chips.
- Failure states visible.

```gherkin
Feature: Delivery state chips
  Scenario: Sent shows after acceptance by provider
    Given send accepted
    When I view row
    Then I see sent tag per design
  Scenario: Delivered only when supported
    Given provider exposes delivered without read-receipt MVP
    When state advances
    Then delivered chip appears per engineering contract
  Scenario: Failed send shows failure chip
    Given send failed permanently
    When I view row
    Then I see failed state distinct from bounce
```

### VS1 — Privacy Admin purges PDTs for 2-way email - Candidate/Job App

**As a** privacy admin
**I want** purge paths to remove conversational email PII for candidate/job application scope
**So that** GDPR / retention compliance (transcript: merge+purge; functional-knowledge purge themes)

**Acceptance criteria**
- Purge removes message bodies and metadata per PDT rules.
- Recruiter UI reflects purge outcomes.
- Legal hold blocks purge with visible reason.

```gherkin
Feature: Purge conversational email artefacts
  Scenario: Successful purge removes messages from recruiter view
    Given eligible purge for a candidate/job application
    When purge completes
    Then recruiter no longer sees purged message bodies
  Scenario: Legal hold blocks purge
    Given legal hold on candidate
    When admin attempts purge
    Then purge is blocked with hold-specific messaging
  Scenario: Partial purge failure surfaces
    Given some messages fail to purge due to provider retention
    When admin reviews purge report
    Then failures are listed with remediation guidance
```

### VS1 — Admin can configure conversation lifecycle tenant setting?

**As a** tenant admin
**I want** tenant settings for how long conversations stay open after disposition/hire and hard stop rules
**So that** Policy matches transcript: configurable days + hard one-year cap per job app conversation

**Acceptance criteria**
- Admin UI captures post-disposition open window where productised.
- Hard one-year maximum enforced regardless of hire state (transcript).
- Edge: clock skew does not extend past cap.

```gherkin
Feature: Conversation lifecycle admin settings
  Scenario: Configure post-disposition window within cap
    Given tenant policy allows N days after disposition
    When disposition occurs
    Then conversation remains open up to min(N, remaining-to-one-year-cap)
  Scenario: Hard one-year closure
    Given a conversation has been open one year for job app
    When scheduler runs
    Then conversation is closed automatically with audit
  Scenario: Invalid admin input rejected
    Given admin enters N beyond allowed maximum
    When saving
    Then validation prevents save with clear message
```

### VS1 — Existing reporting features are not broken

**As a** reporting consumer / admin
**I want** existing recruiting reports to remain accurate when email data lands
**So that** We avoid regression on compliance reporting (map sticky)

**Acceptance criteria**
- Report definitions updated or isolated so email does not corrupt unrelated metrics.
- Backfill strategy documented.
- Performance budgets for heavy tenants.

```gherkin
Feature: Reporting non-regression
  Scenario: Baseline report unchanged when feature off
    Given tenant feature flag off
    When I run baseline recruiting report
    Then results match pre-release golden within tolerance
  Scenario: Feature on adds columns not breaking old exports
    Given feature on
    When I export legacy format
    Then old columns remain stable and new data is additive or versioned export
  Scenario: Large volume load test
    Given tenant with high message volume
    When scheduled reports run
    Then they complete within SLA
```

### VS1 — Recruiter cannot see reply, forward or Add button when both conversations are closed & sees info message? that convo is closed

**As a** recruiter
**I want** clear closed-conversation affordances
**So that** I do not attempt impossible sends (transcript; DUB authorship)

**Acceptance criteria**
- When both candidate+agency threads closed if product defines “both”, hide reply/forward/add.
- Info message clarifies closure.
- If product defines single-thread model, adapt text accordingly — verify on map wording.

```gherkin
Feature: Closed conversation affordances
  Scenario: Both closed hides actions
    Given both conversations are closed per definition
    When I view the panel
    Then reply, forward, and add are hidden
    And I see info that the conversation is closed
  Scenario: One reopened re-enables actions on active only
    Given one thread reopens due to inbound within policy
    When I view panel
    Then actions appear only for the active thread path
  Scenario: Forward specifically out of MVP question
    Given forward is not MVP per transcript open question
    When I view closed state
    Then forward remains hidden regardless of stale Figma explorations
```


## M8 — Misc

### VS1 — Candidate has 2 applications to the same JR and gets merged

**As a** recruiter  
**I want** threads and purge/merge rules to remain coherent when duplicate applications merge under UDMF  
**So that** I avoid wrong-thread sends after merge (transcript: merge+purge discussion; functional-knowledge UDMF)

**Acceptance criteria**
- After merge, email thread binding follows canonical job application.
- No orphan messages pointing at merged-away ids.
- Edge: concurrent merge during compose.

```gherkin
Feature: Merge coherence
  Scenario: Post-merge single canonical thread
    Given two applications merged for same JR
    When I view email
    Then I see a single canonical thread reference per policy
  Scenario: Compose during merge race
    Given I compose on pre-merge id
    When merge completes mid-send
    Then server rejects or reconciles with explicit error and no duplicate send
  Scenario: Purge after merge respects merged person model
    Given purge rules from Recruiting Data Purge overview apply
    When purge executes post-merge
    Then PII removal aligns with merged person model
```

### VS1 — Candidate attaches non-supported files

**As a** candidate  
**I want** inbound attachments that are unsupported to be rejected safely  
**So that** malware or unusable types do not enter recruiter workflow (transcript: virus/PSD discussion)

**Acceptance criteria**
- Inbound validation mirrors outbound policies where possible.
- Recruiter sees clear failure state on candidate attempt.
- No execution of attachment content in browser.

```gherkin
Feature: Inbound unsupported attachments
  Scenario: Candidate uploads disallowed type
    Given candidate replies with attachment type blocked
    When message is ingested
    Then recruiter sees failure state without downloading raw unsafe bytes blindly
  Scenario: Virus positive inbound
    Given scanner flags malware
    When ingestion runs
    Then message is quarantined or rejected with audit
  Scenario: Oversize inbound
    Given attachment exceeds limit
    When ingestion runs
    Then message is rejected with candidate-visible bounce or block per policy
```

### VS2 — Recruiter can forward messages?

**As a** recruiter  
**I want** forwarding behaviour to be decided and implemented per roadmap decision  
**So that** Japan/agency CC culture can be supported when we choose to (transcript: open question MVP vs GA)

**Acceptance criteria**
- Explicit product decision recorded before implementation.
- If deferred, UI must not imply forward exists.
- If enabled, security scan + audit on forwarded content.

```gherkin
Feature: Forward (decision gated)
  Scenario: Forward disabled in MVP
    Given product decision is MVP off
    When I view message actions
    Then forward is not shown
  Scenario: Forward enabled GA with audit
    Given product turns forward on for GA
    When I forward with comment
    Then audit trail records forward event with participants
  Scenario: Forward to external domain policy
    Given tenant blocks external forwards
    When I attempt forward to disallowed domain
    Then I am blocked with policy message
```

### VS1 — TRANMGMT-2499 Translations for 2-way email for Recruiting

**As a** localisation engineer  
**I want** translation keys for new strings to ship under TRANMGMT-2499  
**So that** global tenants receive localised recruiter UX

**Acceptance criteria**
- All net-new strings keyed.
- Pseudo-loc pass shows truncation issues.
- RTL if in scope per platform.

```gherkin
Feature: TRANMGMT-2499
  Scenario: English baseline complete
    Given TRANMGMT-2499 package
    When I scan for missing keys
    Then there are zero missing keys for MVP surfaces
  Scenario: Pseudo-localisation overflow
    Given pseudo-loc enabled
    When I render compose and list
    Then no critical clipping in supported locales list
  Scenario: Emergency English fallback
    Given translation missing for a locale
    When UI loads
    Then graceful English fallback occurs with telemetry for missing bundle
```

---

## Appendix — Map dependencies / OE follow-ons (not separate pink user stories)

These items appear on the map as **Dependency** / OE notes. Track as roadmap/engineering spikes rather than duplicating full BDD here:

- From OE: My Conversations will require an XO (small) refactor  
- Automated replies (Dependency)  
- Vanity domains (Dependency)  
- Conversations with more than 2 people; Cc; Bcc (Dependency)  
- General inboxes (Dependency)  
- Team member vs team assignment ownerships (Dependency)  
- Delivery statuses — e.g. read receipt, "Delivered" status, etc. (Dependency; read receipt explicitly post-MVP in transcript)  
- Engagement metrics (Dependency)  
- Environments — EU Sov? (Dependency)  
- Have the My Conversations icon sync with the SSP (Dependency)  
- See OE non-MVP items  

**Won't need any changes** (map note under M8 area): treat as explicit non-scope confirmation for affected surfaces — validate against engineering impact analysis.

**Key / swimlanes** on map (e.g. backbone headers *Admin Configures 2-Way Email*, *Recruiter Initiates 2-way Email Communication*, *Recipient (Candidate/Agency) Replies…*, *Privacy Admin Manages Data Purging & Merging*, *Non-Functional Requirements*) organise stickies but are **not** duplicated as separate stories above unless they appear as their own pink note text.

**Value Slice legend:** **VS1 (MVP: EA)** vs **VS2 (non-MVP: GA)** taken from the map export.
