# Discovery & Design Brief: WhatsApp Candidate Communication for GCC

**PRD**: docs/prds/gcc-whatsapp-integration-prd.md  
**Created**: 19 March 2026 (updated MISSION-015)  
**Agent**: 315-ux-designer  
**Mission**: MISSION-015 (GCC E2E Pipeline — HITL #5, research v38)  
**Research**: research/GCC/thematic-analysis/2026-03-19-GCC-PMF-Analysis-v38.md  
**Selected Recommendation**: #5 - WhatsApp Integration - GA WhatsApp for GCC; extend campaigns beyond email

---

## Executive Summary

WhatsApp candidate communication for GCC fits into **three Workday Recruiting touchpoints**, following the existing Workday Messaging (SMS) pattern. **(1) Campaigns**: Channel selector (Email, WhatsApp, or both) in campaign configuration—Find Candidates report → Send Message / Invite to Apply. **(2) Candidate Profile**: Send WhatsApp action on the **collaboration panel** (where Candidate SMS icon lives), not the Profile Header Card; consent status on Personal Information. **(3) Job Application / Career Site**: Consent checkbox during application; candidates manage preferences via Candidate Home → Profile → Contact Information. The prototype should demonstrate the Candidate Profile experience (collaboration panel + consent) and Campaign channel selector, grounded in actual Workday workflows.

---

## Workflow Context

### Existing Workday Flow

**Workday Messaging (SMS) – Current Pattern**:
- **Campaigns**: Find Candidates report → filters → Send Message or Invite to Apply. Configurable notifications for job alerts, interview reminders, talent pool engagement.
- **Recruiter-initiated**: Candidate Profile → **Collaboration panel** → Candidate SMS icon → message window. Unanswered conversations appear on Unanswered Conversations card in Recruiter Hub.
- **Consent**: Candidate Home → Profile → Contact Information → opt-in for SMS (phone must be mobile type). Recruiters can send automated email with Update Contact Information URL to encourage opt-in.

**Profile Header Card vs Collaboration Panel** (Deployment Agent clarification):
- **Profile Header Card**: Top card on Summary tab; displays key data (location, job title, company, contact info). Configurable via Configure Profile Header Card. **Not for action buttons**.
- **Collaboration panel**: Where action-oriented icons live—**Candidate SMS** button for initiating communication. **Send WhatsApp belongs here**.

### When This Feature Is Used

- **Trigger**: Recruiter needs to reach GCC candidates via WhatsApp (job alerts, interview reminders, status updates, offer notifications); or recruiter-initiated outreach from candidate context
- **Frequency**: Per campaign (8 campaigns/month per adopter per PRD); per-candidate for recruiter-initiated messages
- **User personas**: GCC Recruiter (primary), Candidate (secondary), Recruiting Leader (tertiary)

---

## Placement Decision

### Recommended Placement (Three Touchpoints)

| Touchpoint | Screen/Page | Implementation Approach |
|------------|-------------|--------------------------|
| **1. Send WhatsApp** (Primary) | Candidate Profile → **Collaboration panel** | Add WhatsApp icon/action alongside Candidate SMS on collaboration panel; opens template selector modal |
| **2. Consent Status** (Primary) | Candidate Profile → Personal Information card / Overview | Add WhatsApp consent field to Personal Information; visible alongside contact details |
| **3. Campaign Configuration** | Manage Recruiting Campaigns / Find Candidates → Send Message flow | Add channel selector (Email, WhatsApp, or both) in campaign configuration |
| **4. Job Application / Career Site** | Career site application flow; Candidate Home | Consent checkbox during application; Candidate Home → Contact Information for preference management |
| **5. Compliance Report** | Recruiting Reports / Analytics | New report: WhatsApp Campaign Summary |

**Entry point (Primary for prototype)**: Candidate Profile page → Collaboration panel → Send WhatsApp action

**Navigation path**: Main nav → Search candidate → Candidate Profile → Collaboration panel → [Send WhatsApp] → [Template selector] → Send

### Integration Points

- **Connects with**: Recruiting Campaigns, Candidate Pools, Candidate Profile, Notification/Message Templates, Career Site, Recruiter Hub (Unanswered Conversations)
- **Data sources**: Candidate consent (profile), phone numbers (E.164), GCC country filter, WhatsApp Business API templates
- **Downstream impacts**: Campaign delivery via WhatsApp; audit trail; Recruiting Leader reporting; Unanswered Conversations card for WhatsApp (future)

### Alternative Placements Considered

- **Option 2: Send WhatsApp on Profile Header Card** – **Rejected because**: Deployment Agent confirms Profile Header Card is for key data display, not action buttons; collaboration panel is where Candidate SMS lives
- **Option 3: Standalone WhatsApp app** – **Rejected because**: Creates isolated feature island; duplicates targeting/scheduling; breaks workflow continuity (per placement-patterns.md)
- **Option 4: WhatsApp only in Campaigns (no Profile)** – **Rejected because**: PRD Use Case 3 requires recruiter-initiated messages from Candidate Profile; P1: "that's how I reach out to my candidates for quick closures"

---

## Functionality Scope

### Prototype Should Demonstrate (Primary: Candidate Profile)

1. **Candidate Profile – WhatsApp on Profile (Primary)**
   - **Collaboration panel**: Send WhatsApp action (alongside SMS icon pattern)
   - Personal Information / Overview section: **WhatsApp consent status** (Opted in | No consent | Opted out)
   - When recruiter clicks "Send WhatsApp": template selector modal (interview reminder, quick follow-up, offer notification)
   - Consent warning: If candidate has not opted in, show "Candidate has not opted in to WhatsApp. Consent required before sending." (block or warn)
   - After send: delivery status indicator (Sent | Delivered | Failed)

2. **Template Selector Modal**
   - Pre-approved WhatsApp template selection (interview reminder, job alert, quick follow-up)
   - Template variable preview ({{company}}, {{date}}, {{time}}, etc.)
   - Arabic/English preview where applicable
   - Send button; cancel

3. **Consent & Audit**
   - Consent status visible on profile
   - Message history or audit trail indicator (optional for prototype)

4. **Campaign Configuration** (secondary, if scope allows)
   - Channel selector: Email | WhatsApp | Email and WhatsApp
   - Recipient list with consent status

### Specific Components Needed

- **Collaboration panel action**: WhatsApp icon/button (follow Candidate SMS pattern)
- **Channel Selector**: Radio group (Email, WhatsApp, Email and WhatsApp)
- **Template Selector**: Dropdown or list with template name, body preview, variable placeholders
- **Recipient Table**: Columns: Name, Company, Country, Consent Status, Phone (E.164), Delivery Status
- **Consent Warning Banner**: When no-consent candidates present; PDPL/PDPA messaging
- **Delivery Status Badges**: Sent, Delivered, Read, Failed (colour-coded)
- **GCC Country Filter**: Chips or multi-select for Saudi, UAE, Kuwait, Qatar, Bahrain, Oman

### Out of Scope for Prototype

- Backend WhatsApp Business API integration
- Actual SMS/email delivery
- Career site consent capture flow (show representative UI only)
- Full compliance report (show summary table structure)
- Paradox integration for interview scheduling (future)
- Recruiter Hub Unanswered Conversations for WhatsApp (future)

---

## Functional Requirements

### From Deployment Agent (Fresh Discovery)

- **Campaigns**: Find Candidates report → filters → Send Message / Invite to Apply. Add WhatsApp as channel option. Configurable notifications for job alerts, interview reminders, talent pool engagement.
- **Candidate Profile**: **Collaboration panel** (not Profile Header Card) hosts Candidate SMS icon. Add Send WhatsApp alongside. Message window opens for composition.
- **Consent**: Candidate Home → Profile → Contact Information → opt-in. Phone must be mobile type. External candidates manage via Candidate Home; internal via worker profile.
- **Profile Header Card**: Displays key data only; configurable via Configure Profile Header Card; not for action buttons.

### From Functional Knowledge

- **Recruiting Data Purge (GDPR)**: Candidate data retention applies; WhatsApp message audit trail must align with purge schedules
- **UDMF**: Duplicate candidates may have different consent; ensure consent is per-person, not per-application
- **Candidate lifecycle**: Consent applies across candidate status (applicant, prospect, hired)

### Compliance & Security

- **Saudi PDPL / UAE PDPA**: Consent required before WhatsApp messaging; opt-out link in messages; data retention per regulation
- **Permissions**: Recruiting Campaigns security domain; Recruiting Leader for compliance reports
- **Audit**: All WhatsApp messages logged; delivery status; consent status; export for audit
- **Localisation**: Arabic/English for GCC; template variables support RTL where needed

---

## Design Rationale (Six Hats Synthesis)

### Facts (White Hat)

- Workday Messaging: SMS via Candidate SMS icon on **collaboration panel** (not Profile Header Card)
- Profile Header Card displays key data (location, job title, contact info); configurable; not for actions
- Campaigns: Find Candidates report → Send Message; configurable notifications
- Consent: Candidate Home → Profile → Contact Information → opt-in
- GCC: 98% WhatsApp open rate vs 20% email; PDPL/PDPA require consent

### Emotions (Red Hat)

- **Recruiters**: Excited to replace personal WhatsApp with Workday-native channel; placement on collaboration panel (where SMS lives) feels natural
- **Candidates**: Prefer WhatsApp in GCC; 90%+ open rates; expect recruiter communication there
- **Recruiting Leaders**: Need visibility into WhatsApp usage; compliance reporting reduces anxiety

### Risks (Black Hat)

- **PDPL/PDPA**: Consent must be explicit, stored, and auditable; opt-out required
- **E.164 validation**: Invalid phone numbers cause delivery failure; validate before send
- **WhatsApp template approval**: Business API requires pre-approved templates; no free-form messaging
- **Spam**: Over-messaging risks opt-outs; respect frequency limits
- **Mitigation**: Consent-first design; template management; full audit trail; follow SMS pattern (collaboration panel)

### Benefits (Yellow Hat)

- 98% open rate vs ~20% email; 5–15 min response vs 24–48h
- Eliminates personal WhatsApp workaround; 2–3 hours/week saved per recruiter
- 42% adoption projection; competitive differentiation vs ZenHR, Talentera
- PDPL/PDPA compliant; audit trail for Recruiting Leaders

### Alternatives (Green Hat)

- **Placement**: Campaigns channel selector + Candidate Profile collaboration panel (both)—chosen
- **Consent**: Career site + candidate profile (both)
- **Future**: Recruiter Hub Unanswered Conversations for WhatsApp; Paradox integration for interview scheduling

### Decision (Blue Hat)

**Why this approach**:
- Follows Workday Messaging (SMS) pattern—collaboration panel for recruiter-initiated; campaigns for bulk
- Correct placement: collaboration panel (not Profile Header Card) per Deployment Agent
- Four touchpoints (Campaign, Profile, Consent, Report) cover PRD scope
- Consent-first design addresses PDPL/PDPA

**Critical success factors**:
- Consent captured and validated before send
- E.164 phone validation for GCC numbers (+966, +971, +965, +974, +973, +968)
- Template management aligned with WhatsApp Business API
- Full audit trail for compliance

---

## Implementation Guidance for 320-prototype-developer

### Canvas Kit Components to Use

- **Layout**: `Box`, `Flex`, `Card`
- **Buttons**: `PrimaryButton`, `SecondaryButton`, `ToolbarIconButton`
- **Inputs**: `TextInput`, `Radio`, `Checkbox`, `Select`
- **Display**: `Table` (`.Head`, `.Body`, `.Row`, `.Header`, `.Cell`)
- **Navigation**: `Tabs` (with `data-id` for Item/Panel linking)
- **Text**: `Heading`, `BodyText`
- **Icons**: `SystemIcon` (searchIcon, checkIcon, exclamationTriangleIcon)
- **Feedback**: `Banner` for consent warnings, success/error states

### UI Patterns to Follow

- **Collaboration panel**: Mimic Candidate SMS placement—action icon/button for Send WhatsApp
- **Top Navigation**: Workday standard (hamburger, logo, search, avatar) per 320 rule
- **Channel selector**: Radio group, same pattern as existing campaign options
- **Recipient table**: Consent column with status badges; delivery status with colour coding
- **Consent warning**: Cantaloupe/amber banner when no-consent candidates present

### Mock Data Needs

- **Candidates**: 5–6 with mix of opted_in, no_consent; GCC countries; delivery statuses (sent, delivered, read, failed)
- **Templates**: Interview reminder, Job alert, Offer notification (with {{variables}})
- **GCC countries**: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman

### Success Criteria for Prototype

- [ ] Demonstrates Candidate Profile with collaboration panel and Send WhatsApp action
- [ ] Shows WhatsApp consent status on Personal Information
- [ ] Template selector modal with variable preview
- [ ] Consent warning when candidate has not opted in
- [ ] Campaign channel selector (Email, WhatsApp, Email and WhatsApp) if scope allows
- [ ] Recipient table with consent status and delivery status
- [ ] Uses Canvas Kit components; follows Workday patterns

---

## Appendices

### Deployment Agent Thread (MISSION-013 Fresh Discovery)

**Thread ID**: f10d379b-f26c-4817-99eb-7bf497427017

**Key Q&A**:

**Q1**: Where does the WhatsApp channel selector fit in Workday Recruiting workflows? Campaigns? Candidate Profile? Job Application?

**A1**: Workday Messaging (SMS) pattern:
- **Campaigns**: Find Candidates report → filters → Send Message / Invite to Apply. Configurable notifications for job alerts, interview reminders, talent pool engagement.
- **Candidate Profile**: Candidate SMS icon on **collaboration panel**. Message window for composition. Unanswered Conversations card in Recruiter Hub.
- **Consent**: Candidate Home → Profile → Contact Information → opt-in for SMS. Phone must be mobile type. External candidates via Candidate Home; internal via worker profile.

**Q2**: Where exactly is the Candidate SMS icon? Profile Header Card or collaboration panel?

**A2**: **Collaboration panel**. Profile Header Card is for key data display (location, job title, company, contact info)—configurable, not for action buttons. Collaboration panel is where action-oriented icons like Candidate SMS live.

### Functional Knowledge Sources

- Recruiting Data Purge - Functional Overview (GDPR, retention)
- Recruiting Duplicate Management - Functional Overview (UDMF, consent per person)
- Admin-Guide-Human-Capital-Management (Candidate lifecycle)

### Six Hats Analysis Summary

- **White**: Collaboration panel (not Profile Header Card); Campaigns via Find Candidates; consent on profile; GCC scope; PDPL/PDPA
- **Red**: Recruiter excitement; candidate preference; Leader compliance need; collaboration panel feels natural
- **Black**: Consent, E.164, template approval, spam, audit; mitigate with consent-first, templates, audit trail, follow SMS pattern
- **Yellow**: 98% open, 5–15 min response, workaround elimination, 42% adoption
- **Green**: Campaigns + Profile collaboration panel (both); consent career site + profile; future Recruiter Hub, Paradox
- **Blue**: Follow SMS pattern; collaboration panel for Send WhatsApp; four touchpoints; consent-first; E.164; full audit

---

*Discovery Brief complete. Ready for 320-prototype-developer.*
