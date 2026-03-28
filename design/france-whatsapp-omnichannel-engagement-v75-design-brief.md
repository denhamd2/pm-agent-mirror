# Design Brief: France WhatsApp omnichannel engagement (v75)

**PRD:** `docs/prds/france-whatsapp-omnichannel-engagement-prd.md`  
**Pipeline:** France E2E  
**Version:** v75 (design brief only; prototype slug for 320 TBD)  
**Date:** 28 March 2026  
**315 status:** PASS 1–2 complete; **revised once per 318** (hub IA, heading hierarchy, dock styling, experience principles). Ready for **320**.

---

## PASS 1: Layout strategy

### 1. Jobs to be done (worksheet-aligned)

**Worksheet source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`  -  Talent Acquisition cluster, **Manage candidates throughout the recruiting process**.

**Verbatim anchors (recruiter):**

- Progress candidates through the stages of the pipeline as efficiently as possible  
- *(Implicit / adjacent)* Keep candidates engaged through the process  

**Synthesised job statement**

When **an RFP or stakeholder asks for omnichannel or WhatsApp-style candidate messaging**, I want **clear, in-context guidance on what Workday supports natively versus partner paths**, so I can **choose compliant channels, set expectations with hiring teams, and escalate to Success or IT without overclaiming parity**.

**Primary persona (PRD):** Talent Acquisition / Recruiting Operations Lead (France enterprise).  
**Secondary:** IT / Workday tenant administrator (entitlements, integrations).  
**Tertiary:** Candidate (external)  -  only where transparency copy appears; no candidate-primary UI in v1 scope.

**Prototype implications (surfaces-only scope):**

- Show **where** recruiters already think about channels (candidate profile, comms affordances).  
- Make **True Gap vs partner path** obvious without building a native WhatsApp composer.  
- Keep **France / SMS** caveats available as help text (high level; no reconciliation of DA threads in UI).  
  - **Demo focus:** Keep the opened **`CommunicationDock`** and 2-way WhatsApp/Email messaging threads as the **primary** story in the viewport.

### 2. Shell pattern

**Primary: Pattern B**  -  Candidate profile with global chrome, candidate hub, two-column cards, optional right communication rail (`design/references/recruiter-flow/README.md`, Communication prototypes row).

**Justification:** Recruiter-flow README directs email, SMS, WhatsApp, LINE explorations to combine **pattern B** with `CommunicationDock` and Sana comm patterns. Deployment Agent guidance (March 2026 thread `1bab3c2d-461b-4e6b-bd0a-d56d141318ab`) places neutral channel discovery **on the candidate profile communication area**, near Send Message / Candidate SMS context, rather than a disconnected global help page.

**Secondary (optional narrative only):** Pattern A+ if the storyboard starts on Recruiter Hub before drilling into a candidate; v1 **320** can open directly on profile to keep scope minimal.

### 3. Reference layouts

| Reference | Use |
|-----------|-----|
| `design/references/recruiter-flow/README.md` | Shell pattern B; comms prototypes note |
| `design/references/pattern-candidate-smart-view.md` | Candidate Smart View: `WorkdayTopNav`, `WorkdayLeftTabBar`, header card, two-column cards, `CommunicationDock` |
| `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` | Full Sana shell (grey top nav, pill search, rail) |
| `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` | Comm dock density, pill composer reference  -  **v1 uses dock for 2-way WhatsApp and Email threads** |

**Not used:** `pattern-hired-score-grid.md` (no grid-primary feature).

### 4. Layout regions

| Region | Content |
|--------|---------|
| **Top** | `WorkdayTopNav`  -  global pill search, utilities, avatar |
| **Left** | `WorkdayLeftTabBar`  -  primary rail + secondary hub tabs for **Candidate** (see Navigation) |
| **Centre** | **Single hierarchy for identity (Smart View):** profile **header `Card`** contains the **only** dominant **`Heading` size="large"** (candidate name). Optional applied-job or context lines as **`BodyText`** under it. **Do not** stack a second **`Heading` size="large"** above the header card. Below the header: two-column **white** `Card`s on `SANA_PAGE_CANVAS` (overview / job & history or similar). If a distinct in-page section label is needed, use **`Heading` size="small"** or **`Heading` size="medium"** inside a card, not a second large page title. |
| **Right** | `CommunicationDock`  -  collapsed rail by default; expanded panel shows **2-way WhatsApp or Email communication** (not end-to-end omnichannel composer) |

**No breadcrumbs or chevron path strips** (`010-style-guide.mdc`).

### 5. Hierarchy

1. **Dominant:** Candidate identity via **one** **`Heading` size="large"** inside the profile header **`Card`** (matches **`pattern-candidate-smart-view.md`**).  
2. **Secondary:** **`CommunicationDock`** when opened  -  panel title + short explanatory copy + actions.  
3. **Supporting:** Overview / detail cards; bottom-of-page neutral disclaimer (mock / legal pointer).

### 6. Interaction model

- **Hub secondary navigation:** Candidate hub sections use **`WorkdayLeftTabBar`** **`tabs`** with **`activeTabId`** / **`onTabChange`** (vertical pill sub-nav in the **secondary column** per **`pattern-candidate-smart-view.md`**). All entries populated with representative content  -  see Navigation. **Do not** implement hub IA as horizontal **`Tabs`** in the main content well.  
- **CommunicationDock:** Collapsed by default; user expands via rail.  
- **Channel rail:** Tapping **WhatsApp** or **Email** icons opens the respective communication panel. The Email panel uses a wider master-detail layout to accommodate thread history and a rich text composer.
- **External link:** Primary CTA opens Success Centre / help URL in new tab (placeholder URL in prototype).  
- **No modal wizard** unless copy review adds a legal gate (unlikely for v1).

### 7. Layout framework (A–F)

| ID | Application |
|----|-------------|
| **A – JTBD** | In-context channel clarity for TA Ops when evaluating omnichannel / WhatsApp asks. |
| **B – Shell** | Pattern B + Sana tokens from `sanaShellTheme.ts`. |
| **C – Hierarchy** | Identity **`Heading` large** in header card → supporting cards; dock brings guidance to foreground when opened. |
| **D – Density** | Medium; WhatsApp thread and composer. High; Email master-detail layout with rich text composer. |
| **E – Accessibility** | Rail `aria-label`s; focus order dock → panel; link text descriptive (not “click here”). |
| **F – Canvas coverage** | Single viewport desktop demo; optional tablet width later. |

### 8. Grounding: Deployment Agent (placement)

**Query summary (Workday Deployment Agent, thread `1bab3c2d-461b-4e6b-bd0a-d56d141318ab`):** Recruiters use **candidate profile** actions (**Send Message**, **Candidate SMS** icon, communications / recruiting history) and grid bulk actions; **Unanswered Conversations** on Recruiter Hub for SMS. For **neutral WhatsApp / partner-path discovery**, placement **on the candidate profile communication area** near those affordances is **most appropriate**  -  contextual, does not imply native WhatsApp in core UI.

### 9. Six Hats validation (trade-off check)

| Hat | Insight |
|-----|---------|
| **White** | PRD classifies native WhatsApp in core Recruiting UI as **True Gap**; v1 is enablement + optional discovery. |
| **Red** | Fear of being “behind” if we only show text  -  **mitigate** with clear partner path + Success CTA. |
| **Yellow** | Honest gap + suite strengths builds **trust** in competitive conversations. |
| **Black** | Overbuilt comms UI could imply native WhatsApp  -  **avoid** full composer / thread. |
| **Green** | Single **Messaging options** panel + external link is **low risk**, reusable for other regions. |
| **Blue** | **Decision:** Pattern B + 2-way WhatsApp and Email `CommunicationDock` panels satisfy user request. |

### 10. Functional knowledge note

PRD states **no new business object** for WhatsApp messages in v1; partner systems remain system of engagement. This brief does **not** introduce data entities; UI is **2-way WhatsApp and Email**. France **SMS** nuance stays in short help copy with pointer to tenant validation (DA + PS), not deep configuration UI.

### 11. PRD scope exception (navigation completeness)

**PRD:** “**Surfaces only** … **Out of scope**: a **full communications product prototype**.”

For **320**: Implement **full** `WorkdayLeftTabBar` tab set with **representative** Sana-compliant content on each tab (cards, short labels) per workspace prototype bar  -  **do not** leave sibling tabs empty. Primary demo story remains **communication discovery** on the profile. If product governance later limits to a **single-tab** demo, PM must confirm in writing; default is **full tab coverage**.

---

## PASS 2: UI composition (Canvas Kit + Sana)

### 0. Canvas Kit discovery

**Tool:** `user-canvas-kit-mcp` → `get-canvas-kit-tokens` (28 March 2026).  
**Resources available for 320:** `docs://tokens/color-roles`, `docs://tokens/color-contrast`, `docs://llm-token-migration-14`, palette / space / shape guides.

**Candidate components (v14 prototypes in repo):**

- **Layout:** `Box`, `Flex`, `Card`  
- **Text:** `Heading`, `BodyText`, `Text`  
- **Actions:** `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton`  
- **Navigation (hub):** **`WorkdayLeftTabBar`** with **`tabs`**, **`activeTabId`**, **`onTabChange`** for candidate hub sections (canonical profile IA per **`pattern-candidate-smart-view.md`**).  
- **Navigation (optional second level):** Canvas Kit **`Tabs`** (`.List`, `.Item`, `.Panel`, `data-id`) **only** inside a **scoped** sub-area of the main column if the PRD later adds an explicit second-level tab set; **not required for v1** and **not** a substitute for hub navigation.  
- **Inputs:** `TextInput`, `FormField` (composition pattern)  -  minimal in v1  
- **Feedback:** `Hyperlink` / link-styled `TertiaryButton` for external help; `Banner` **only** for real in-flow states (not mock-data disclaimers)  
- **Table:** `Table`  -  use lightly in a hub section if needed for representative density  
- **Icons:** `SystemIcon` + `@workday/canvas-system-icons-web`  

### 1. Shared shell components (mandatory)

| Layer | Component / file |
|-------|-------------------|
| Top nav | `WorkdayTopNav` (`design/components/WorkdayTopNav.tsx`) |
| Hub | `WorkdayLeftTabBar` with `showSecondaryTitleIcon` for candidate |
| Theme tokens | `SANA_PAGE_CANVAS`, `SANA_CARD_RADIUS_LG`, `soap300` borders, `sanaShellTheme.ts` |
| Comm dock | `CommunicationDock` (`design/components/CommunicationDock.tsx`), **default collapsed** |
| Dock chrome (mandatory) | Rail tiles use **`communicationRailButtonStyle`**; panel header on **`SANA_COMM_PANEL_SURFACE`**; align with **`SanaCommPanelPatterns.tsx`** and **`sanaShellTheme.ts`** so the dock matches other comm prototypes. |
| Panel inner | White header surface; WhatsApp thread content in `Flex`; **use** `SanaCommComposer` and `SanaCommMessageBubble` for WhatsApp. Email uses a master-detail layout with a list of threads on the left and a rich text composer + thread history on the right. |

### 2. Sana Style checklist (`010-style-guide.mdc`)

- Page canvas: **`SANA_PAGE_CANVAS`** (not full white viewport).  
- Top nav: grey strip, white pill search.  
- Cards: white on grey, ~16–20px radius, thin soap borders.  
- Blue: links, primary CTA, focus  -  not full-height blue chrome.  
- **No warning `Banner`** for “this is a prototype”  -  use bottom `BodyText` disclaimer.  
- **Communication dock:** Reuse shared **Sana** rail and panel surfaces from **`SanaCommPanelPatterns.tsx`** / **`sanaShellTheme.ts`** with **`CommunicationDock`**; do not build one-off rail or panel styling for this prototype.

### 3. Candidate hub  -  **all** secondary sections (`WorkdayLeftTabBar`)

**IA rule:** Hub sections live in the **`WorkdayLeftTabBar`** **secondary column** (vertical pill sub-nav), switching **main-column** content via **`tabs`** + **`activeTabId`** + **`onTabChange`**. This matches **`pattern-candidate-smart-view.md`**. **Do not** use horizontal Canvas Kit **`Tabs`** in the main well for these hub sections.

Default **active** section: **Overview** (or **Profile**  -  align label with **319**-approved copy).

| Section ID (`data-id` / tab key) | Representative main-column content |
|----------------------------------|-------------------------------------|
| `overview` | Summary card, key fields, skills snippet |
| `job-applications` | Small list or table of applications |
| `screening` | Placeholder assessments / screening card |
| `interviews` | Interview events list (sparse) |
| `offer` | Offer status or empty state |
| `personal` | Contact details card |
| `job-history` | Timeline or table (minimal rows) |
| `comments` | Notes card |
| `attachments` | Attachments list or empty state |
| `business-process` | BP history stub card |

**320:** Implement each row as a **`WorkdayLeftTabBar`** tab entry; render the matching **main column** fragment when **`activeTabId`** changes. Labels in **sentence case** per **319**. Reserve Canvas Kit **`Tabs`** only for an optional, **explicitly scoped** second-level sub-area inside one section (not required for v1).

### 4. Main content (centre column)

- **Profile header `Card` (Smart View alignment):** Contains **`Avatar`**, the **single** **`Heading` size="large"** (candidate display name), applied-job or context meta as **`BodyText`**, and primary actions (e.g. Move forward / Reject) as **secondary** to the PRD story  -  may be static. **No** additional **`Heading` size="large"** above this card.  
- **Two-column grid** below the header card: Left overview card; right job/history card  -  matches **`pattern-candidate-smart-view.md`**.

### 5. Right rail  -  2-way WhatsApp communication panel

**Goal:** Explain channels honestly; route to Success / partner enablement.

**Shell parity:** Wrap the sliding column in **`CommunicationDock`** as today; use **`communicationRailButtonStyle`** on rail controls, **`SANA_COMM_PANEL_SURFACE`** on the panel header band, and other shared tokens from **`sanaShellTheme.ts`** / patterns exported by **`SanaCommPanelPatterns.tsx`** so this dock visually matches Email / SMS / WhatsApp comm prototypes.

| UI block | Canvas Kit / pattern |
|----------|----------------------|
| Panel container | `Card` `padding="zero"` inside `CommunicationDock` |
| Panel header | `Heading` size="small" + optional close / collapse control (dock handles width) |
| Body | `BodyText` paragraphs + optional bullet list (`BodyText` as list items with manual bullets or simple `Flex` stack) |
| Primary CTA | `PrimaryButton`  -  open Success Centre (external) |
| Secondary | `SecondaryButton` or `TertiaryButton`  -  “Copy link” optional; low priority |
| Footer disclaimer | Small `BodyText`  -  controller/processor / partner variability (see Copy Inventory; **060** via **319**) |

**Explicit non-goals in panel:** Live WhatsApp thread, message composer for WhatsApp, delivery status, template picker.

### 6. Experience principles (`docs/experience-principles.md`)

| Principle | How this design upholds it |
|-----------|----------------------------|
| **Empower** | Recruiter chooses **when** to open messaging guidance; CTA goes to Success for next steps  -  no forced channel. |
| **Trust** | Plain-language **True Gap** framing; **transparent boundaries** between in-product email/SMS and partner or unavailable channels; no imitation of native WhatsApp UI; familiar candidate profile shell so execution feels intentional, not evasive. |
| **Grow** | v1 is **pointer-first** by design (Success Centre, tenant validation) so enablement can update without a Recruiting release. **Roadmap hook:** where policy and roadmap allow, a later iteration can surface more **in-product** self-serve checks (e.g. entitlement hints) without replacing this discovery pattern. |

---

## Copy inventory (**319**-approved)

Do **not** change user-facing strings below without a new **319** pass. Legal/privacy lines remain flagged for **060** as noted in the table.

### Buttons and CTAs

| Element | Draft copy |
|---------|------------|
| Primary action | View channel options in Success Centre |
| Secondary action | Close panel *(if not using dock default dismiss)* |
| Optional | Copy Success Centre link |

### Rail / panel chrome

| Element | Draft copy |
|---------|------------|
| Rail tile `aria-label` | Open messaging options for this candidate |
| Panel title | Messaging options |
| Link (inline) | Learn about partner messaging paths |

### Body copy (informational  -  **060 required**)

| Block | Draft copy |
|-------|------------|
| Lead paragraph | Workday Recruiting supports email and conversational SMS in product where your organisation has enabled the right subscriptions and policies. Native two-way WhatsApp inside core Recruiting is not available in this release. |
| Partner path | Many customers use an approved partner for WhatsApp or other messaging apps, alongside Workday. Your tenant administrator can confirm which integrations and subscriptions you have. |
| France SMS note (high level) | For SMS to French mobile numbers, your organisation may need an approved partner or third-party SMS path. Ask your Workday contact before promising a specific setup. |
| Success CTA helper | Success Centre has the latest guidance for France and EMEA deals, including checklists for presales and administrators. |

### Error / edge (if link fails in real product  -  optional for prototype)

| Scenario | Draft copy |
|----------|------------|
| Link unavailable | Unable to open Success Centre. Try again or contact your administrator. |

### Empty / loading

| Context | Draft copy |
|---------|------------|
| Loading Success redirect | Opening Success Centre… *(prototype may omit)* |

### Bottom-of-page disclaimer (neutral, not `Banner`)

| Context | Draft copy |
|---------|------------|
| Prototype | This screen is a prototype for review. Messaging capabilities depend on your subscriptions, policies, and region. |

### Legal / privacy (flag for **060**)

| Type | Draft copy |
|------|------------|
| Transparency | Candidates may receive messages through your organisation’s chosen channels. Your employer’s privacy notice and lawful basis apply. |
| Data locations | Message content may be processed by Workday, your organisation, and approved partners. Retention and deletion may require coordinated steps across systems. |
| No subprocessor list | Do not list Meta/WhatsApp subprocessors in UI; point to customer agreements and official subprocessor documentation. |

### AI disclosure

**Not required** on this surface unless copy mentions AI-assisted screening; **keep channel guidance separate** from hiring AI (per PRD).

---

## Handoff

- **319:** Copy inventory unchanged in this revision (strings remain as previously reviewed).  
- **320:** New versioned file `design/france-whatsapp-omnichannel-engagement-vNN.tsx` (increment **NN** per mission), route + `vite.config.ts` slug. Implement hub IA with **`WorkdayLeftTabBar`** per PASS 2 §3; **`Heading` size="large"** only inside the profile header **`Card`** per PASS 1 §4 and PASS 2 §4.

---

## Revision based on 318 feedback

**Date:** 28 March 2026  

Single revision pass applied per **`315-ux-designer.mdc`**. Changes:

- **Hub IA:** Candidate sections are **`WorkdayLeftTabBar`** **`tabs`** + **`activeTabId`** / **`onTabChange`** with main-column content switching ( **`pattern-candidate-smart-view.md`** ). Removed use of horizontal Canvas Kit **`Tabs`** for hub navigation; **`Tabs`** reserved only for an optional, scoped second-level sub-area (not required v1).
- **Heading hierarchy:** One **`Heading` size="large"** only, inside the profile header **`Card`** (identity); no duplicate large heading above the card.
- **Communication dock:** Mandated shared rail/panel styling via **`communicationRailButtonStyle`**, **`SANA_COMM_PANEL_SURFACE`**, **`SanaCommPanelPatterns.tsx`**, and **`sanaShellTheme.ts`** for shell parity.
- **Experience principles:** **Trust** now explicitly ties to channel-boundary transparency; **Grow** acknowledges pointer-first v1 and a roadmap hook for future in-product self-serve checks.
- **Demo emphasis:** Prototype implications note that the opened dock and guidance remain the primary story.
- **318 verdict blocks:** Removed from this document after incorporation (no second **318** pass per workspace rules).

**Design Brief revised per 318 feedback. Ready for prototype development (320).**