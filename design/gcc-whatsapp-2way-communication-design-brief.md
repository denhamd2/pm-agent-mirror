# Discovery & Design Brief: WhatsApp 2-Way Communication (Candidate Profile)

**PRD:** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
**Mission:** GCC-E2E-004  
**Created:** 20 March 2026  
**Agent:** 315-ux-designer  

---

## Executive Summary

This initiative adds **native, auditable 1-on-1 WhatsApp messaging** on the **candidate profile**, anchored to the same **collaboration / communication** pattern recruiters already use for **Candidate SMS (Workday Messaging)**. The prototype must use **Pattern B** (candidate profile) with the shared **`CommunicationDock`** (right rail + sliding sheet) and **Sana** comm patterns (`SanaCommComposer`, `SanaCommMessageBubble`). It must **not** depict the **Recruiting campaign builder**, bulk sends, or nurture flows; those stay **explicitly out of scope** per the PRD and differ from `docs/prds/gcc-whatsapp-integration-prd.md`.

Primary UX intent: give GCC recruiters **fast, governed dialogue** (templates to open sessions, then 2-way thread, consent and opt-out visible) without **shadow IT** on personal WhatsApp.

---

## Workflow Context

### Existing Workday Flow

- **App / module:** Recruiting → job requisition → **candidate pipeline** → **candidate profile**.
- **Current pattern (Deployment Agent):** **1-on-1 conversational messaging** is **Workday Messaging (SMS)** from the candidate profile **collaboration panel** (alongside other comms). Path: **Job Requisition** → select **candidate** → **Collaboration panel** → **Candidate SMS**. Unanswered threads surface on **Recruiter Hub** (**Unanswered Conversations**). Users with **Modify** on the job application security domain can participate.
- **Gap:** **Native WhatsApp** is **not** available as a built-in channel today; delivery requires **product integration** (connector, webhooks, templates), as stated in the PRD.

### When This Feature Is Used

- **Trigger:** Recruiter needs **time-sensitive** contact (interview coordination, offer prep, quick closure) where **WhatsApp is the regional norm** (GCC); tenant has **enabled** the channel and candidate meets **consent** rules.
- **Frequency:** Per candidate, per active stage; high-touch during **late pipeline** (not bulk broadcast).
- **Personas:** **Recruiter** (primary); **hiring manager** (secondary: visibility only, if policy allows); **candidate** (tertiary: device-side experience referenced in PRD, not the prototype primary surface).

---

## Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter (HR Professional)

- **Outcome area:** **Manage candidates throughout the recruiting process**, with **Keep candidates engaged through the process** as the worksheet’s **implicit** engagement line in that cluster (same section as pipeline progression).
- **Worksheet JTBD (verbatim):**
  - Progress candidates through the stages of the pipeline as efficiently as possible  
  - *(Implicit in worksheet structure: keep candidates engaged through the process)*  
- **Synthesised JTBD:** *When I am moving a GCC candidate through sensitive recruiting stages, I want **fast, 2-way WhatsApp conversation inside Workday from their profile**, so I can **get timely replies and keep momentum** without using **personal devices** or **losing audit and consent context**.*

### Manager (hiring manager) (secondary)

- **Outcome area:** **Grow and maintain my team** (hiring subset).
- **Worksheet JTBD (verbatim):** Track the progress of candidates through the hiring process  
- **Synthesised JTBD:** *When I need confidence that recruiting is advancing, I want **visibility that appropriate contact happened** (where policy allows), so I can **coordinate hiring without operating WhatsApp myself**.*

### Worker (candidate) (tertiary, PRD reference)

- **Outcome area (Worker cluster):** Engage with hiring organisation (pre-hire).  
- **Prototype note:** Show **lawful, transparent** recruiter-side indicators (consent state, opt-out consequence); do not build the candidate’s WhatsApp client UI.

### Prototype implications

- Show **req + application context** (ID, role) adjacent to the thread so the job is obviously **profile-scoped 1-on-1**, not a list send.
- Surface **WhatsApp consent** (opted in / no consent / opted out), **template-first** session open, **chronological thread**, **session window** hint (e.g. follow-up vs new template), and **blocked send** when not opted in.
- Include at least one **inbound** bubble and **outbound** bubble; optional **read/delivered** labels if space allows (API-dependent in production).
- **Do not** show campaign recipient grids, channel blast controls, or **marketing** language.

---

## Placement Decision

### Recommended Placement

- **Screen / page:** **Candidate profile** (from requisition pipeline or equivalent entry).
- **Implementation approach:** **Extend** the existing **collaboration / communication** affordance: add **WhatsApp** as a channel in the **right communication rail**, opening a **sliding panel** with thread + composer (same structural idea as SMS from the panel).
- **Entry point:** **Job requisition** → **Candidates** → open **candidate** → use **CommunicationDock** rail (**WhatsApp** tile); optionally align quick actions under the hub header with **Message** / comm patterns where product standards allow.
- **Navigation path:** Recruiting Hub / req workspace → **candidate record** → profile **hub tabs** (Summary, Overview, …) → **dock** for live conversation without leaving the record.

### Integration Points

- **Connects with:** Workday Messaging **pattern** (parallel channel, not replacing SMS); **candidate phone** and **normalisation**; **consent / preference** store; **template catalogue** (Meta-approved); **inbound webhooks** and **identity resolution** (phone + tenant → candidate; disambiguation when needed).
- **Data sources:** Candidate identity, application / req linkage, consent artefacts, template list, message thread and status events.
- **Downstream:** Audit metadata; reporting on volume and response time (PRD); **opt-out** hard stop for further sends.

### Alternative Placements Considered

- **Standalone “WhatsApp Inbox” app** — **Rejected:** Breaks **profile-anchored** context and duplicates the collaboration model; PRD anchors to **candidate profile**.
- **Campaign builder only** — **Rejected:** This mission is **2-way profile messaging**, not bulk campaigns.
- **Modal-only compose (no dock)** — **Rejected:** **315/320** standard for recruiter comms in this workspace is **`CommunicationDock`** + Sana panel patterns; modal may be used **inside** the flow for **template pick** or **disambiguation**, not as the primary shell.

---

## Visual shell & references

- **Primary shell pattern:** **B** — candidate profile: global chrome + **candidate hub** + main content cards + **right communication rail** (`design/references/recruiter-flow/README.md`).
- **Secondary pattern:** Optional **D → B** if the demo story starts from a **req candidate grid**; primary frame for the feature remains **B**.
- **Reference screens (recruiter-flow manifest):** Use **`design/references/recruiter-flow/README.md`** communication note; **`My_Candidates_-_Recruiter-….png`** or **`Find_Candidates_-_Recruiter-….png`** for list entry context if showing **D** first; profile density aligns with **Pattern B** and existing prototype **`design/gcc-whatsapp-integration.tsx`** (adapted: **remove** campaign-only UI).
- **Sana / WhatsApp panel:** **`design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png`**; shell neutrals **`Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`** (see `design/references/sana/README.md`).
- **Figma:** Pending 330 capture (per PRD).
- **Canvas Kit MCP:** Use **`user-canvas-kit-mcp`** (`get-canvas-kit-tokens`, resources `docs://tokens/color-contrast`, `docs://tokens/color-roles`) for any non-standard semantic colour or spacing decisions beyond `sanaShellTheme.ts`.

---

## Canvas Kit component mapping (verified)

**Note:** Prototype **`design/package.json`** pins **Canvas Kit v14** (see `320-prototype-developer.mdc`). The checklist below is **implementation-ready** for that stack.

### Primary UI components (Canvas Kit + shared)

| Area | Components / patterns |
|------|-------------------------|
| Buttons | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton` |
| Layout | `Flex`, `Box`, `Card` |
| Forms | `FormField` (+ `FormField.Label` / `FormField.Input`), `TextInput`, `Select`, `Checkbox`, `Radio`, `RadioGroup` |
| Data display | `Table` (compound), `Banner` (**in-flow** errors/success only — not for mock-data disclaimer), `StatusIndicator` / semantic text, `CountBadge` |
| Navigation | `Tabs` (`.List` / `.Item` / `.Panel`, **`data-id`** pairing), `Modal`, `Popup` |
| Typography | `Heading`, `BodyText`, `Text` |
| Icons | `SystemIcon` + `@workday/canvas-system-icons-web` |
| Feedback | `LoadingDots` or disabled button states for send |

**WhatsApp brand mark:** No CK system icon; **small inline SVG** (as in `gcc-whatsapp-integration.tsx`) is acceptable for the rail tile and panel header.

### Tokens

- **Colours / space:** `colors.*`, `space.*` from `@workday/canvas-kit-react/tokens`; prefer **`SANA_*`** from `design/components/sanaShellTheme.ts` for shell and comm panel.
- **Contrast:** Validate text/background pairs against MCP **colour contrast** resource where custom surfaces are used.

### Shared Workday components (`design/components/`)

- **WorkdayTopNav:** Yes  
- **WorkdayLeftTabBar:** Yes (candidate hub tabs)  
- **CommunicationDock:** Yes — **required** for this feature  

### Non-standard elements

- **None** beyond the **WhatsApp SVG** and composition of **`CommunicationDock`** `panel` / `rail` children.

### Verification notes

- **Canvas Kit MCP consulted:** Yes — `get-canvas-kit-tokens` (20 March 2026); resource URIs listed for migration/contrast reference.  
- **Reference prototype:** `design/gcc-whatsapp-integration.tsx` — reuse **dock + Sana comm patterns**; **strip** campaign channel selector, campaign teaser card, and any **bulk** affordances for **GCC-E2E-004**.

---

## Reusable layout components (for 320)

**Import from** `design/components/index.ts`. **Do not** reimplement top nav, left hub, or dock layout.

### WorkdayTopNav

- **Use:** Yes  

```tsx
<WorkdayTopNav
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  showWMark
  showMenuWordmark={false}
  notificationBadge={3}
  inboxBadge={5}
/>
```

*(Adjust badges to match demo narrative.)*

### WorkdayLeftTabBar

- **Use:** Yes  
- **`showSecondaryTitleIcon`:** `true` (candidate profile hub).  

```tsx
<WorkdayLeftTabBar
  showSecondaryTitleIcon
  secondaryTitle="Sara Al-Mansoori"
  secondarySubtitle="JR-0142 · Senior consultant — GCC"
  tabs={[
    { id: 'summary', label: 'Summary' },
    { id: 'overview', label: 'Overview' },
    { id: 'recruiting_history', label: 'Recruiting History' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'questionnaire_results', label: 'Questionnaire Results' },
    { id: 'interview', label: 'Interview' },
    { id: 'screening', label: 'Screening' },
    { id: 'employment_offer', label: 'Employment Offer' },
    { id: 'personal_notes', label: 'Personal Notes' },
  ]}
  activeTabId={activeNavId}
  onTabChange={setActiveNavId}
/>
```

### CommunicationDock

- **Use:** Yes  

The shared component API is **`headerOffsetPx`**, **`expanded`**, **`railWidthPx`**, **`expandedWidthPx`**, **`panel`**, **`rail`** (not a `channels` array — build the rail as children).

```tsx
import {
  CommunicationDock,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  DEFAULT_COMM_RAIL_PX,
  DEFAULT_COMM_EXPANDED_PX,
  communicationRailButtonStyle,
} from './components';

<CommunicationDock
  headerOffsetPx={WORKDAY_TOP_NAV_HEIGHT_PX}
  expanded={whatsappExpanded}
  railWidthPx={DEFAULT_COMM_RAIL_PX}
  expandedWidthPx={DEFAULT_COMM_EXPANDED_PX}
  panel={/* WhatsApp thread + template row + SanaCommComposer */}
  rail={
    <>
      {/* Email tile — opens or focuses email panel state if multi-channel demo */}
      {/* SMS tile — visual parity with Workday Messaging */}
      {/* WhatsApp tile — toggles expanded; use communicationRailButtonStyle(active) */}
    </>
  }
/>
```

- **Channels in scope for v1 rail:** **Email**, **SMS**, **WhatsApp** (WhatsApp is the **hero** interaction; email/SMS tiles show **multi-channel context** without implementing full alternate panels unless trivial).  
- **Panel content:** `SANA_COMM_PANEL_SURFACE` header row; **consent strip**; **template** `Select` + preview (**EN / AR** line as in PRD); **`SanaCommMessageBubble`** list (in + out); **`SanaCommComposer`** for session messages; reserve **`Modal`** for **template picker** or **phone disambiguation** if needed.

### Custom chrome

- **None** unless PRD explicitly changes scope.

---

## Functionality scope

### Prototype should demonstrate

1. **Open profile** from req context (subtitle / metadata shows **JR + role**).  
2. **Review WhatsApp consent** (status + short guidance when **no consent** / **opted out**).  
3. **Open WhatsApp** from dock → **template** to start or refresh session → **send** → see **thread** update.  
4. **Inbound** message appears in thread (mock webhook).  
5. **Session constraint** state: e.g. **“24-hour window closed — choose a template to continue”** (neutral `Banner` or inline `BodyText`, not yellow **warning** for mock data).  
6. **Opt-out** reflected: send disabled + clear reason.  
7. **Explicitly not shown:** campaign builder, recipient counts, bulk **Send to all**.

### Specific components

- **Consent status module** (card row or panel strip).  
- **Template picker** + **preview** (including **RTL** sample for Arabic body).  
- **Thread** + **composer** (`SanaCommMessageBubble`, `SanaCommComposer`).  
- **Error** states: invalid phone, template rejected, provider error (representative copy).

### Out of scope for prototype

- Real **WhatsApp Cloud API** / BSP connectivity.  
- **Admin** tenant config screen (optional tiny link text only).  
- **Campaign** flows and **HiredScore** / **Paradox** automation.  
- **Voice/video** WhatsApp.

---

## Functional requirements

### From functional knowledge

The workspace **`functional-knowledge/`** folder **does not** currently expose Recruiting PDFs in-repo (only initialization / verification artefacts). Treat **PRD compliance section** and **050-functional-knowledge** process as the **product** bar; for **configuration specifics**, escalate to **@functional-knowledge** PDFs when available.

### From Deployment Agent

- **Placement:** Extend **candidate profile** **collaboration** pattern; **SMS** today: **Collaboration panel** → **Candidate SMS**.  
- **Navigation:** **Job Requisition** → **candidate** → panel.  
- **WhatsApp:** **Not** native today — **integration** required.  
- **Thread ID (MCP):** `451437fa-b105-4376-80f9-66c63ec5bdbb` (20 March 2026).

### Compliance & security

- **PDPL / PDPA / GDPR** (cross-border): consent, opt-out, retention, customer-owned legal copy (**060** + Legal sign-off for strings).  
- **Permissions:** Align with **job application** modify / messaging domains when defining roles (exact domain names TBD).  
- **Audit:** Message metadata, template used, sender, timestamps.  
- **Localisation:** **Arabic** UTF-8 and **RTL** presentation in preview and thread.

---

## Design rationale (Six Hats synthesis)

### Facts (White Hat)

- PRD defines **profile-scoped 2-way** threads, **templates** for session open, **consent/opt-out**, **Arabic**, **no AI**.  
- Deployment Agent confirms **SMS 1-on-1** lives on **candidate profile collaboration panel**; **WhatsApp** needs **product** integration.  
- **Information gaps:** precise **security domain** names for WhatsApp actions; **BSP vs Cloud API** tenancy; **RTL** edge cases in composed controls.

### Emotions (Red Hat)

- **MCP `red_hat_emotions` failed** (server error). **Synthesised:** Recruiters likely feel **relief** if Workday matches **speed** of informal WhatsApp with **audit**; **frustration** if **consent** or **corporate policy** blocks sends without clear explanation. Hiring managers want **trust**, not noise. Candidates need **transparency** and **easy opt-out**.

### Risks (Black Hat)

- Compliance and **cross-border** processing; **enterprise bans** on WhatsApp; **session window** confusion; **wrong-number** / duplicate matches; template **rejection**; **logging** PII.

### Benefits (Yellow Hat)

- **Governed** channel reduces **shadow IT**; faster **median first reply**; **GCC PMF** and competitive narrative; **integration spine** may later support **optional** campaigns **without** mixing into this MVP UI.

### Alternatives (Green Hat)

- **MCP `green_hat_creativity` failed** (server error). **Synthesised:** **Full-width comm tab** only — rejected (loses **dock** consistency). **Standalone inbox** — rejected. **Future:** disambiguation drawer, **saved replies** inside service window, **manager** read-only activity.

### Decision (Blue Hat)

- **Adopt Pattern B + CommunicationDock** with **WhatsApp** as the **primary** panel story; mirror **SMS placement** mentally for stakeholders.  
- **320** reuses **`gcc-whatsapp-integration.tsx`** patterns **minus campaign UI**.  
- **Critical success factors:** visible **consent**, **template discipline**, **thread clarity**, **tenant-off** story, and **no** conflation with **campaign builder**.

**Blue Hat MCP:** `blue_hat_control` invoked with summaries above (20 March 2026).

---

## Implementation guidance for 320-prototype-developer

### Navigation scope (mandatory)

**`WorkdayLeftTabBar` tabs** — implement **all** with **representative** content (cards, lists, or compact tables — no empty stubs):

| Tab | Representative content |
|-----|-------------------------|
| Summary | Overview cards, **WhatsApp consent** module, key application fields |
| Overview | Skills / experience summary cards |
| Recruiting History | `Table` of events / stages |
| Attachments | List with file rows + actions |
| Reminders | Upcoming tasks list |
| Questionnaire Results | Scores / completion status |
| Interview | Scheduled interviews card |
| Screening | Screening status + notes |
| Employment Offer | Offer state placeholder |
| Personal Notes | Notes list + add field |

**In-page `Tabs`:** If the **Summary** area uses nested `Tabs` (e.g. personal vs job application), implement **each** panel with real CK content.

### Shared shell imports

- Use **`SANA_PAGE_CANVAS`** for page background; reserve **`DEFAULT_COMM_RAIL_PX`** right padding on the main column when the dock is present.  
- **No `Breadcrumbs`** or chevron path strips.

### UX principles applied (framework #1–20)

**Information architecture (#1–5)**  
- **#1 Card grouping:** Consent, thread, and template controls in **separate** visual chunks (panel header, status strip, scrollable thread, composer).  
- **#2 F-pattern:** Candidate identity and req context **top-left**; **dock** holds **secondary** real-time comms.  
- **#3 No breadcrumbs:** Use **`Heading`** + hub tabs + subtitle only.  
- **#4 Hub-and-spoke:** Candidate **hub tabs** match profile exploration; comms are a **persistent** spoke via the dock.  
- **#5 Filter-then-act:** N/a for 1-on-1; if listing **templates**, show **picker** before **send**.

**Visual hierarchy (#6–10)**  
- **#6 Headline hierarchy:** Page / panel titles vs section labels vs metadata.  
- **#7 Whitespace:** `space.m` / `space.l` between thread groups; align with Sana reference.  
- **#8 Density:** **Moderate** — conversation legibility over table density.  
- **#9 Visual weight:** **Primary:** Send / template confirm; **Secondary:** collapse dock; **Semantic** for consent.  
- **#10 Contrast:** `blackPepper600` on white/grey surfaces; check link accent on **Sana** comm focus ring.

**Cognitive load (#11–15)**  
- **#11 Progressive disclosure:** Advanced template variables collapsed or secondary.  
- **#12 Defaults:** Sensible first template; composer empty until session allows free text.  
- **#13 Chunking:** Single scrolling panel, not a wizard, for the main demo.  
- **#14 Destructive:** If **revoke** or **delete thread** appears, use **Modal** (optional).  
- **#15 Loading:** Sending state on primary button / dots.

**Interaction design (#16–20)**  
- **#16 Fitts:** Large rail tiles; composer send control per **`SanaCommComposer`**.  
- **#17 Hick:** Limit rail to **3** channels in demo; avoid many primary buttons in the panel header.  
- **#18 Jakob:** Align with **email/SMS** mental model from collaboration UX.  
- **#19 Recognition:** Active tab + **expanded** dock state visible.  
- **#20 Keyboard:** **Esc** closes expanded panel (match existing prototype behaviour); focus moves to rail toggle.

**Layout decision (steps A–F)**  
- **A** Job: **2-way governed WhatsApp from profile** (JTBD above).  
- **B** Shell: **Pattern B** + **CommunicationDock**.  
- **C** Primary: **Thread + composer**; secondary: **consent + template**.  
- **D** Density: **Moderate** conversation UI.  
- **E** A11y: labels on **`FormField`**, **`aria-expanded`** on rail, dialog semantics when expanded.  
- **F** Canvas Kit: listed in mapping; **MCP** for edge tokens.

**Industry principles (8)**  
Consistency with **recruiter-flow** + **Sana**; progressive disclosure for templates; recognition via hub + dock; prevent errors with **consent gating**; minimal decorative chrome; accessible structure; recoverable **inline / Banner** errors.

### Canvas Kit components to use

See **Canvas Kit component mapping**; favour **`SanaCommComposer`** / **`SanaCommMessageBubble`** for the WhatsApp sheet.

### Mock data

- GCC-flavoured candidate (e.g. UAE/KSA), **E.164** phone, **opted-in** and **no-consent** variant (toggle or second story).  
- Mix of **English** and **Arabic** template preview text.  
- At least **two** inbound and **two** outbound messages.

### Success criteria for prototype

- [ ] Placed on **candidate profile** with req context  
- [ ] **CommunicationDock** with **WhatsApp** 2-way thread  
- [ ] **No** campaign / bulk UI  
- [ ] **Consent** and **blocked** states clear  
- [ ] **Worksheet JTBD** obvious to reviewers  
- [ ] **All** hub tabs populated  
- [ ] **Sana** + **Canvas Kit** alignment  
- [ ] **060** review before 330 handoff (consent copy)

---

## Appendices

### Deployment Agent Q&A

- **Q:** Where should **WhatsApp 2-way** (1-on-1, not campaigns) sit?  
- **A:** Same **collaboration** pattern as **SMS** on **candidate profile**; path from **JR** → **candidate** → **Collaboration panel**; **WhatsApp** not native without integration.

### Functional knowledge sources

- In-repo PDF corpus **not** mounted; use PRD + Deployment Agent + this brief until **@functional-knowledge** PDFs are available.

### Six Hats (full)

- **white_hat_analysis:** Returned process scaffold; gaps listed under White Hat.  
- **red_hat_emotions:** **Error** — synthesised under Red Hat.  
- **black_hat_assessment:** Returned risk-thinking scaffold.  
- **yellow_hat_opportunities:** Returned benefit-thinking scaffold.  
- **green_hat_creativity:** **Error** — synthesised under Green Hat.  
- **blue_hat_control:** Returned orchestration + embedded `hatSummaries`.

---

## Handoff (320)

Discovery & Design complete for **WhatsApp 2-way communication (candidate profile)**.

**Discovery Brief:** `design/gcc-whatsapp-2way-communication-discovery-brief.md`  

**Key findings:**  
- **Placement:** Candidate profile **collaboration / communication** area (parallel to **Candidate SMS**); **JR → candidate → dock**.  
- **JTBD:** **Manage candidates…** / **progress efficiently** + **keep engaged** — synthesised sentence in brief.  
- **Shell:** **Pattern B** + **`CommunicationDock`**; refs: **Sana WhatsApp panel** PNG + recruiter-flow README.  
- **Scope:** **1-on-1 thread**, templates, consent, inbound/outbound; **not** campaign builder.

**PRD:** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
