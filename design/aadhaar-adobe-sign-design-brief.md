# Design Brief: India Aadhaar eSign via Adobe Sign (Offer)

**Status:** **318 APPROVED** — PASS 1–2, PASS 2.5 complete; PASS 3–4 peer review appended 30 March 2026. **320** authorised.  
**Date:** 30 March 2026  
**PRD:** `docs/prds/india-aadhaar-adobe-sign-offer-prd.md`  
**PMF context:** `research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md` (Theme: India ID / OTP / offer leakage; honest positioning vs omnichannel True Gaps)  
**Mission:** INDIA-E2E-004 — Step 19 (315)

**Deployment Agent (placement validation):** Thread `22d01307-d483-4b43-a5fd-53f6df838364` (30 March 2026). Confirms: Candidate Home **Review Document** task; Adobe Sign in pop-up/window; task **does not** auto-complete — candidate must use **OK** / **Submit** in Workday; Adobe credentials in **Edit Tenant Setup – Business Processes**; offer BP **Review Document** step configures Adobe Sign; **no** per-candidate document packages inside a single Review Document step (use parallel steps + condition rules). Triangulate PRD threads `28947023-aeb7-4e0a-a769-bbc5619a7dfc`, `dac6739f-1c6e-49cf-a587-a06d6a8ababc` as needed.

**Canvas Kit MCP:** `get-canvas-kit-tokens` invoked; v14 migration and semantic colour roles available via resources (`docs://llm-token-migration-14`, `docs://tokens/color-roles`, `docs://tokens/color-palette`, etc.). Prototype uses `@workday/canvas-tokens-web` CSS imports per **320** pre-flight.

**Sana reference PNGs validated (315):** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` (full shell, white cards on grey canvas); `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` (profile header card, two-column cards, sparing blue — comm dock not required for this feature but confirms density and radii). See `design/components/sanaShellTheme.ts` (`SANA_PAGE_CANVAS`, `SANA_CARD_RADIUS_LG`, `SANA_LINK_ACCENT`).

---

## PASS 1: Layout Strategy

### A. JTBD (worksheet-aligned)

**Primary (Recruiter — HR Professional, Talent Acquisition)**  
• **Worksheet lines:** *Make a successful offer to the chosen candidate*; *Progress candidates through the stages of the pipeline as efficiently as possible*; *Maintain data integrity throughout the recruiting process* (`docs/jtbd-recruiting-hr-professional-and-manager.md` — **Manage candidates throughout the recruiting process**).  
• **Synthesised job:** When an India offer needs Aadhaar-class e-authentication in Adobe Sign, I want to see clear signing and task completion state in Workday, so I can close the offer step without shadow PDF loops and know when the candidate still owes an in-product confirmation.

**Secondary (Recruiting Operations / TA Lead)**  
• **Worksheet lines:** *People strategy enablement* themes — configure processes that match legal and regional posture; *Identify ways that my HR systems can better meet my workflow*.  
• **Synthesised job:** When we enable India Aadhaar-capable signing, I want a governed tenant toggle and BP guidance, so I can align envelopes, consent, and parallel Review Document steps without breaking Japan or Germany offer models.

**Tertiary (External Candidate — Worker)**  
• **Worksheet lines:** *Accept or decline offer*; *Engage with hiring organisation* (`docs/jtbd-recruiting-hr-professional-and-manager.md` — **Worker**). Persona depth: `docs/workday-user-research/README.md` (External Candidate).  
• **Synthesised job:** When I finish signing in Adobe, I want an obvious next step back in Workday, so my offer task actually completes and I understand consent and retention in plain language.

### B. Shell pattern selection

| Surface | Pattern | Rationale |
|--------|---------|-----------|
| **Recruiter** | **B** (Candidate Smart View) | Offer and document status are contextual to a single candidate; matches `design/references/pattern-candidate-smart-view.md`: `WorkdayTopNav` + `WorkdayLeftTabBar` + main column on `SANA_PAGE_CANVAS`, optional `CommunicationDock` only if the prototype already shows comms (not required for Aadhaar/Adobe scope). |
| **Candidate** | **Task page** (Candidate Home) | Not A+ recruiter hub: single-task focus, high clarity, primary CTA. Visually align with Sana neutrals (grey canvas, white **Card**, no heavy blue chrome). Reference density: `design/references/recruiter-flow/README.md` **C** (modal task) for *stepped task* discipline; implement as **full-page task** if modal is not representative of Review Document in tenant (DA describes full task page flow). |
| **Tenant admin** | **A** or **A+** | Configuration lives outside candidate profile: global chrome + central **Card** stack (Edit Tenant Setup / Recruiting-related setup). Use **A+** if the prototype routes from Recruiter Hub into a settings area with left hub; **A** if a single setup task page. |

### C. Reference layouts (real Workday patterns)

• **Candidate profile / detail:** `design/references/pattern-candidate-smart-view.md` (header card, two-column **Card**s, no breadcrumbs).  
• **Recruiter hub / list context:** `design/references/recruiter-flow/README.md` — e.g. **My Candidates** (A+) if landing from list before opening candidate **B**.  
• **Grid pattern:** Not primary for this initiative; no **pattern-hired-score-grid** mandate.  
• **Figma (optional):** Candidate Smart View link in pattern doc if peer review needs pixel context.

### D. Layout regions

• **Top:** `WorkdayTopNav` (recruiter and admin); candidate task may use simplified candidate chrome per product standard (pill search optional; keep neutral top bar per Sana).  
• **Left:** `WorkdayLeftTabBar` (recruiter hub: primary rail + secondary tabs); admin/settings equivalent if A+.  
• **Centre:** Primary workspace — **Heading size="large"** page title, **Card**(s) for document/signing status and actions.  
• **Right:** `CommunicationDock` only when the same prototype documents comms; otherwise omit to reduce noise.

### E. Hierarchy

1. **Dominant:** For recruiter — candidate name + offer / Review Document step status (dual indicators: Adobe vs Workday task). For candidate — “Sign in Adobe” / “Return to Workday” clarity + **OK** primary action.  
2. **Secondary:** Document list, timestamps, deep link to Adobe (if shown).  
3. **Supporting:** Legal/consent copy, retention messaging, help links — **bottom of page** (neutral **BodyText**; no yellow **Banner** for mock disclaimers per **320**).

### F. Interaction model

• **Recruiter:** Inline **Card** + **StatusIndicator** row; optional **Tabs** on candidate profile (**Process** vs **Documents**) to separate timeline from artefacts.  
• **Candidate:** Single scrollable **Card**; **PrimaryButton** OK; **SecondaryButton** or text **link** for “Open Adobe Sign again” / “View document” where PRD allows.  
• **Admin:** **Checkbox** (enable India Aadhaar-capable path) + **BodyText** help + conditional **Radio** or **Select** for architecture branch **(b)** only after workshop confirms API.  
• **Modals:** Use **Modal** for destructive confirmations or “View signing requirements” detail; avoid nesting Adobe inside Workday (Adobe remains separate window — show **SystemIcon** + copy explaining external flow).

### G. Layout framework A–F summary

| Letter | Lens | Application |
|--------|------|-------------|
| **A** | JTBD | Recruiter outcome = trustworthy closure; candidate outcome = completed task; admin outcome = safe enablement. |
| **B** | Shell | B for recruiter candidate view; task page for candidate; A/A+ for admin. |
| **C** | Hierarchy | Status and OK always scannable within 3 seconds. |
| **D** | Density | Recruiter: medium (badges + one row metadata). Candidate: low (reduce anxiety). Admin: low–medium. |
| **E** | Accessibility | **FormField** labels, button labels explicit (“Confirm and complete task” not “Done” alone if ambiguous); focus order OK before secondary links. |
| **F** | Canvas coverage | All mapped components in PASS 2; no bespoke controls. |

### H. PMF-informed constraints (design)

• Do **not** imply resolution of native +91 SMS, WhatsApp-in-UI, or Naukri multipost (True Gaps per India matrix).  
• Surface **India-ID-OTP-Leakage** narrative only as **scoped** to Aadhaar auth **inside** this offer e-sign path when showing metrics or help copy.  
• **Japan / Germany:** No Aadhaar-specific branching shown on those country templates; toggle and copy gated to India-relevant contexts.

---

## PASS 2: UI Composition

### 0. Canvas Kit discovery summary

From **user-canvas-kit-mcp** `get-canvas-kit-tokens`: token migration guides and semantic **color roles** (`sys.color.*`, roles: primary, positive, caution, critical, muted, etc.). Implementation (**320**) uses Canvas Kit **v14** compounds: `Box`, `Flex`, `Card`, `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `FormField`, `TextInput`, `Checkbox`, `Radio`, `Select` (admin/branch **b** only), `Heading`, `BodyText`, `StatusIndicator`, `Avatar`, `Table` (optional admin audit preview), `Tabs`, `Modal`, `Banner` (errors only), `Toast` (optional success), `SystemIcon`, `Hyperlink` / link-styled **BodyText** with `SANA_LINK_ACCENT`.

**Shared prototype components:** `WorkdayTopNav`, `WorkdayLeftTabBar`, `ProfilePageLayout` (if recruiter view matches hub profile), `FormSelect` / `FormTextInput` from `design/components/SharedFormControls.tsx` where applicable (filters); admin **simple** dropdowns prefer shared **FormSelect** per **315**.

### 1. Screen-by-screen mapping

#### Screen 1 — Recruiter: Candidate offer / Review Document status (Pattern B)

| Region | Component |
|--------|-----------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar`, `ProfilePageLayout` (header **Card** with `Avatar`, **Heading size="large"**, actions **SecondaryButton** / **PrimaryButton** as per existing profile) |
| Main | `Flex` column on `SANA_PAGE_CANVAS` |
| Title | `Heading size="large"` — e.g. “Offer documents” or “Review document” (final copy **319**) |
| Status row | Two `StatusIndicator`s: (1) Adobe envelope — Green when signed/auth complete, Blue when sent, Orange when action needed; (2) Workday task — Orange “Awaiting candidate confirmation” vs Green “Task complete” |
| Detail | `Card` with `BodyText` — last updated, envelope id or masked ref (token-oriented per PRD NFR) |
| Documents | `Card` + `Table` or list rows: document name, `SystemIcon` document icon, link to open (if in scope) |
| Tabs | `Tabs`: **Process** | **Documents** | **Overview** (hub-consistent with §Navigation completeness and **ProfilePageLayout**; every tab must have representative content per **320**, not stubs) |

#### Screen 2 — Candidate: After Adobe, complete Workday task

| Element | Component |
|---------|-----------|
| Layout | Centred or full-width **Card** on `SANA_PAGE_CANVAS` |
| Title | `Heading size="large"` — e.g. “You’re almost done” |
| Body | `BodyText` — explain signed copy visible; must tap OK to complete Recruiting task (aligns with DA) |
| Primary | `PrimaryButton` — “OK” or “Confirm and complete” (**319**) |
| Secondary | `SecondaryButton` — “Open Adobe Sign again” if session lost (optional per eng) |
| Consent | `Checkbox` + legal copy block (unbundled Aadhaar + e-sign; EN/HI **legal-approved**); **060** via **319** |
| Footer | Retention / purpose limitation **BodyText size="small"** at bottom |

#### Screen 3 — Tenant admin: India Aadhaar-capable offer signing

| Element | Component |
|---------|-----------|
| Layout | `Card` on neutral canvas; page `Heading size="large"` |
| Toggle | `FormField` + `Checkbox` — “Enable India Aadhaar-capable offer signing” (label TBD **319**) |
| Help | `BodyText` — multi-country safe; Japan/Germany exclusions; Adobe tenant + ASP responsibilities |
| Branch (b) | If product selects per-offer auth: `FormField` + `Select` or `Radio` group for authentication method (disabled/hidden until API confirmed) |
| Link | External help or PS prep doc as `BodyText` with link styling |

### 2. Sana Style validation

• **Page canvas:** `SANA_PAGE_CANVAS` (~#F3F5F7), white **Card**s, thin soap300-equivalent borders via **Card** / tokens.  
• **Top nav:** Grey bar, white pill search (recruiter/admin).  
• **Radii:** ~16–20px cards (`SANA_CARD_RADIUS_LG`).  
• **Blue:** `SANA_LINK_ACCENT` for links and **PrimaryButton** only; no blue chrome fills.  
• **No breadcrumbs** or chevron path strips (`010-style-guide.mdc`).

### 3. Navigation completeness

**Recruiter**  
• `WorkdayLeftTabBar`: primary rail items consistent with Recruiting hub (Overview, Job Requisitions, Candidates, Dashboard, etc. — match existing prototype manifest).  
• Candidate profile `Tabs`: at minimum **Process** (step timeline + Review Document status), **Documents** (files + signing metadata), **Overview** (summary). Additional tabs per **ProfilePageLayout** standard if used.  
• **Process** tab: show offer BP step including Review Document + dual status.  
• **Documents** tab: unsigned/signed artefact narrative (mock realistic filenames).

**Candidate**  
• Single-task view; optional link “Back to inbox” **SecondaryButton**.

**Admin**  
• Breadcrumb substitute: **Heading** + optional **BodyText** context line (“Tenant setup — Recruiting”); no path control.

### 4. Experience principles (`docs/experience-principles.md`)

| Principle | How this design upholds it |
|-----------|------------------------------|
| **Empower** | Candidate explicitly completes the task (**OK**); recruiter sees **two** states (Adobe vs Workday) so they are not fooled by “signed externally.” Admin enables capability with clear scope gates. |
| **Trust** | Plain-language steps; no claim of UIDAI approval; separate consent for Aadhaar vs e-sign; timestamps and statuses visible. |
| **Grow** | Toggle can be revised without reimplementation; BP parallelism documented in help text; history on documents tab supports audit expectations. |

**Heuristics:** Progressive disclosure (advanced auth settings collapsed until branch **b**); recognition over recall (badges, not codes); legal copy at bottom; **Heading** as page title.

---

### 5. Copy Inventory (for **319**)

**Buttons / CTAs**  
• Primary (candidate): [TBD — e.g. “Confirm and complete” / “OK”]  
• Secondary (candidate): [TBD — e.g. “Open Adobe Sign again”]  
• Primary (recruiter): [Existing profile actions if any — out of scope unless offer-specific]  
• Link: [TBD — “Learn about Adobe Sign” / “View integration setup”]

**Form labels / help**  
• Admin checkbox: [TBD — feature name per PRD “India Aadhaar-capable offer signing (name TBD)”]  
• Admin help: [TBD — multi-country, JP/DE exclusion, Adobe/ASP]  
• Consent (candidate): [TBD — unbundled EN; HI variant flagged for legal]  
• Branch (b) field: [TBD — “Authentication method” + options]

**Errors**  
• Adobe unavailable: [TBD — problem + retry + contact recruiter]  
• Envelope expired: [TBD]  
• OK blocked (validation): [TBD — e.g. consent not checked]

**Success**  
• Task complete (candidate): [TBD]  
• Task complete (recruiter view): [TBD — toast or inline **StatusIndicator** Green]

**Empty**  
• No documents: [TBD]

**Loading**  
• Checking Adobe status: [TBD — “Checking signature status…”]

**Legal / consent**  
• Aadhaar purpose block: [TBD — **060**]  
• E-sign purpose block: [TBD — **060**]  
• Retention: [TBD — DPDP-aligned; 30-day ceiling per PRD NFR where applicable]

---

### 6. Visual indicators specification (for **320**)

• **Adobe envelope signed / auth complete:** `StatusIndicator` `Type.Green` `Emphasis.Low` + label e.g. “Signed in Adobe Sign”  
• **Adobe awaiting candidate:** `StatusIndicator` `Type.Orange` `Emphasis.Low` — “Action needed in Adobe Sign”  
• **Workday task open (Adobe done):** `StatusIndicator` `Type.Blue` or `Orange` `Emphasis.Low` — “Awaiting confirmation in Workday”  
• **Workday task complete:** `StatusIndicator` `Type.Green` `Emphasis.Low` — “Task complete”  
• **India offer tag (optional):** `StatusIndicator` `Type.Gray` `Emphasis.Low` — “India offer”  
• **Document row:** `SystemIcon` `documentIcon` size 20–24  
• **External Adobe:** `SystemIcon` `externalLinkIcon` or equivalent size 16 with link text  
• **Metadata line:** `BodyText size="small"` colour muted — “Updated · [date] · [actor]”

**Button pairs:** **PrimaryButton** (OK) + **SecondaryButton** (Open again). No **TertiaryButton** for destructive actions.

---

## PASS 2.5: Copy Review Results (319 + 060)

**Reviewed:** 30 March 2026  
**Mission / pipeline:** INDIA-E2E-004 — Step 20 (319 copy review after PASS 2 Copy Inventory)  
**Inputs:** §5 Copy Inventory (PASS 2), `docs/prds/india-aadhaar-adobe-sign-offer-prd.md` (compliance, NFRs)

### Editorial summary (319)

• **Inventory was largely TBD:** Approved strings below replace placeholders; **320** and **318** should treat this section as the canonical copy source until legal publishes final templates.  
• **Sentence case** for buttons, labels, body, errors, and status chip labels (except proper nouns: Workday, Adobe Sign, Aadhaar, India).  
• **Action-oriented CTAs** with explicit outcomes (complete Recruiting task in Workday, reopen Adobe).  
• **Errors:** Problem + next step; avoid blame; no bare "Error" or exclamation-led alerts.  
• **Terminology:** Candidate, offer, Recruiting task, **Review document** (align with BP step name when surfaced to users).  
• **Numbers:** Use numerals (e.g. 30 days) per design exception to spelled-out numbers in running prose.

### Legal & compliance assessment (060)

**Applicable regulations / frameworks:** India **DPDP Act 2023** (consent, purpose limitation, data fiduciary duties, retention, rights); **Aadhaar Act / UIDAI** rules (authentication via authorised channels only; Requesting Entity / ASP roles sit with customer and Adobe ecosystem); **EU AI Act** — not primary for this screen copy (no AI disclosure required unless product adds AI in this flow). Cross-border processing: follow customer DPA and subprocessors; **do not** simplify transfer assurances in UI.

**Compliance requirements (copy-related):**

1. **Unbundled consent:** Separate checkboxes (or clearly separated attestations) for (i) Aadhaar e-authentication and (ii) electronic signature / document execution, each with its own purpose statement.  
2. **Transparency:** Identify **your employer (hiring organisation)** as the party determining purpose for candidate data in this journey; name **Adobe** as the signing and authentication service provider; **Workday** as the system used to manage the Recruiting task. Wording must not imply **UIDAI endorsement** of Workday.  
3. **No over-claim:** Avoid stating Section 8 eligibility or Requesting Entity status unless text is **signed off by qualified legal counsel** for the customer archetype.  
4. **Retention:** Any numeric ceiling (e.g. 30 days) must match **legal-approved** retention posture for the integration; if policy varies by tenant, surface **qualifying language** ("up to", "as described in the privacy notice") rather than a fixed number unless product guarantees it.

**Risk level:** **High** (special-category-style sensitivity for Aadhaar authentication, consent validity under DPDP, subprocessors).

**Risk factors:** Combined consent; missing identity of data fiduciary/controller messaging; implied government approval; inaccurate retention.

**Recommended actions:** DPIA / India privacy review per PRD; legal sign-off on EN and HI templates before GA; keep **link to organisation privacy notice** adjacent to consent blocks.

**Documentation needed:** [ ] DPIA or India equivalent where required [ ] Privacy notice updates [ ] Consent flow copy (EN + HI) [ ] Subprocessor / Adobe disclosures as applicable

**Disclaimer:** This assessment supports product and UX drafting only; it is **not** legal advice. Binding wording requires **Workday Legal** and customer counsel.

**Legal validation status:** **Draft for counsel review** — candidate Aadhaar / e-sign blocks and retention line below are **structurally** aligned to PRD NFRs; **do not ship** without **060 / Legal** template approval.

---

### Approved copy revisions (use in 320)

**Page titles (`Heading size="large"`)**

| Surface | Was (PASS 2 / TBD) | Approved |
|--------|---------------------|----------|
| Recruiter — documents context | "Offer documents" / "Review document" | **Review document** (match BP step name in recruiter-facing context) |
| Candidate — post-Adobe | "You're almost done" | **Almost done** |
| Tenant admin | (implicit) | **India offer signing setup** |

**Candidate task — body (intro, before consent)**

| Element | Approved copy |
|--------|----------------|
| Lead paragraph | **You've finished signing in Adobe Sign. Select the button below to complete this step in Workday and close your Recruiting task.** |

**Buttons / CTAs**

| Role | Approved |
|------|----------|
| Primary (candidate) | **Confirm and complete in Workday** |
| Secondary (candidate) | **Open Adobe Sign again** |
| Candidate — back | **Back to inbox** |
| Link (candidate / recruiter — help) | **Learn how Adobe Sign works with Workday** (destination: customer help or Adobe doc per enablement) |
| Link (admin) | **View integration setup** (or **Open Recruiting setup help** if internal only) |

**Form labels / help**

| Element | Approved |
|--------|----------|
| Admin checkbox label | **Enable Aadhaar e-authentication for India offers in Adobe Sign** |
| Admin help (short) | **Applies only where your organisation uses Adobe Sign for offers and is licensed for Aadhaar e-authentication. Does not change Japan or Germany offer processes. Your organisation manages Adobe accounts, authentication settings, and any ASP requirements.** |
| Branch (b) field label | **Authentication method** |
| Branch (b) options (placeholder until API confirmed) | **Use Adobe account default** · **Aadhaar e-authentication** (final list from product + legal) |

**Consent — checkbox 1 (Aadhaar) — draft for legal template**

`I agree to use Aadhaar e-authentication for this offer, as provided by Adobe Sign for [ORGANISATION NAME], and I understand this is separate from signing the document.`

**Consent — checkbox 2 (e-sign) — draft for legal template**

`I agree to sign this offer and related documents electronically in Adobe Sign for [ORGANISATION NAME].`

**Privacy / transparency (static block below checkboxes, small text)**

`[ORGANISATION NAME] decides why and how your information is used for this offer. Workday hosts this task; Adobe Sign presents the documents and authentication steps. For details, see the privacy information [ORGANISATION NAME] provides to you.`

*(Replace `[ORGANISATION NAME]` with dynamic hiring organisation name in implementation.)*

**Retention (footer `BodyText size="small"`) — draft; confirm ceiling with Legal**

`Authentication and signing metadata may be retained for up to 30 days for this integration where your organisation's settings and applicable law allow, unless a different period is stated in [ORGANISATION NAME]'s privacy notice.`

*If Legal cannot confirm a fixed window in UI, replace with:* **`Retention follows [ORGANISATION NAME]'s privacy notice and applicable law.`**

**Errors**

| Scenario | Approved |
|----------|----------|
| Adobe unavailable | **We can't reach Adobe Sign right now. Check your connection, try again, or contact your recruiter if the problem continues.** |
| Envelope expired | **This signing request has expired. Contact your recruiter to resend the offer documents.** |
| Consent not checked (inline validation) | **Confirm both items above to continue.** |
| OK blocked — Adobe not complete | **Finish signing and authentication in Adobe Sign, then return here to complete this task.** |

**Success**

| Scenario | Approved |
|----------|----------|
| Task complete (candidate) | **You've completed this step in Workday.** |
| Task complete (recruiter — toast optional) | **Offer document step complete** |
| Recruiter inline (dual status resolved) | Use existing **StatusIndicator** labels in **Visual indicators (updated)** below |

**Empty**

| Context | Approved |
|--------|----------|
| No documents in list | **No documents to show yet.** |

**Loading**

| Context | Approved |
|--------|----------|
| Checking Adobe status | **Checking signature status…** |

**Hindi (HI)**

• **Not approved in this pass.** Flag: **Legal-owned** EN master first, then certified HI translation mirroring unbundled structure. **320** may use EN-only with a "Language" note in prototype if needed.

---

### Visual indicators — copy alignment (319)

Use these **sentence-case** labels with PASS 2 `StatusIndicator` specs:

| State | Label |
|------|--------|
| Adobe — complete | **Signed in Adobe Sign** |
| Adobe — action needed | **Action needed in Adobe Sign** |
| Workday — awaiting after Adobe | **Confirmation needed in Workday** |
| Workday — task complete | **Task complete** |
| Optional region tag | **India offer** |

---

### Gaps / dependencies

• **ORGANISATION NAME** and privacy link URL must come from tenant / candidate-facing configuration.  
• **Section 8 / Requesting Entity** language: **not** drafted here; insert only after legal template.  
• **Branch (b)** option strings depend on Adobe API workshop.  
• **Recruiter primary** actions remain profile-standard unless offer-specific actions are in scope for **320**.

---

## Handoff

• **319:** Complete for Step 20 — see **PASS 2.5**.  
• **318:** Peer review; **Final Verdict** before **320**.  
• **320:** Do **not** start until **APPROVED**; use this brief + PRD + `get-canvas-kit-tokens` on build.

## Open design dependencies

• Adobe workshop: branch **(a)** vs **(b)** drives admin and send-offer UI depth.  
• Legal: final EN/HI consent and Section 8 / Requesting Entity wording.  
• BP: PS validation of parallel **Review Document** steps for Aadhaar vs non-Aadhaar packages.

---

## PASS 3: Peer Review Findings

**Reviewer:** Design Peer Reviewer (318)  
**Date:** 30 March 2026  
**Pipeline:** INDIA-E2E-004 — Step 21  
**Inputs reviewed:** PASS 1, PASS 2, PASS 2.5 (319 + 060), `docs/experience-principles.md`, `design/references/recruiter-flow/README.md`, `design/references/sana/README.md`, `design/references/pattern-candidate-smart-view.md`

### PASS 1 — Layout strategy, JTBD, shell pattern

• **JTBD vs worksheet:** Primary recruiter lines (*Make a successful offer…*, *Progress candidates…*, *Maintain data integrity…*) match `docs/jtbd-recruiting-hr-professional-and-manager.md` (Manage candidates throughout the recruiting process). Secondary ops framing is plausible. Tertiary Worker lines match the document’s Worker cluster (*engage with hiring organisation*; *accept or decline offer*). Synthesised *When / I want / so I can* statements are outcome-led, not feature-led.

• **Shell pattern:** Recruiter **B** (candidate contextual work) with `WorkdayTopNav` + `WorkdayLeftTabBar` + main on `SANA_PAGE_CANVAS` aligns with `pattern-candidate-smart-view.md`. Candidate **task page** (Candidate Home) with Sana neutrals matches the stated DA placement and recruiter-flow **C** discipline (step clarity) adapted to full-page task. Admin **A / A+** for tenant setup is appropriate.

• **Hierarchy and regions:** Dominant elements (dual status for recruiter; OK + return path for candidate) are explicit; supporting legal copy at bottom matches **320** guidance (no yellow **Banner** for mock disclaimers).

• **PMF guardrails:** Scoped India narrative and non-claim on True Gaps are appropriate.

• **Reference alignment:** Brief cites Sana PNGs and `sanaShellTheme`; layout vocabulary matches `pattern-candidate-smart-view.md` (no breadcrumbs, grey canvas, white cards). `recruiter-flow/README.md` shell table is consistent with choosing **B** for profile-context work (note: that README’s one-line **B** blurb mentions a blue candidate column; implementation should follow **pattern-candidate-smart-view** + Sana neutrals, which the brief already does).

### PASS 2 — Canvas Kit, Sana, navigation, copy (incl. PASS 2.5)

• **Canvas Kit checklist (v75):** Status rows use **`StatusIndicator`** (not custom **Box**). India offer tag uses **Gray / Low**. Button pairs are **PrimaryButton** + **SecondaryButton**; no **TertiaryButton** for negative paths. **`ProfilePageLayout`** is named for recruiter Screen 1. No comms scope; **CommunicationDock** correctly optional. **Hyperlink** / link-styled **BodyText** for links is acceptable.

• **Minor spec gap (resolved for build):** PASS 2 §6 allowed **Blue** or **Orange** for “Workday — awaiting after Adobe.” PASS 2.5 copy is **Confirmation needed in Workday** (action-oriented). **320** should use **`StatusIndicator` `Type.Orange` `Emphasis.Low`** for that state to align with “action needed” semantics used elsewhere for Adobe Orange; reserve **Blue** for neutral/in-progress only if product later splits states.

• **Sana Style:** `SANA_PAGE_CANVAS`, white **Card**s, `SANA_CARD_RADIUS_LG`, `SANA_LINK_ACCENT`, no breadcrumbs — matches **010** / Sana README intent.

• **Navigation completeness:** Recruiter left rail, Process/Documents/Overview, candidate back path, and admin heading context are defined. **Peer review edit:** Screen 1 table previously listed a third tab **Job applications**, which contradicted §Navigation (**Overview**). Table updated to **Overview** so the brief is single-source for **320**.

• **Copy (319 / 060):** Sentence case, action-oriented CTAs, problem + next step on errors, unbundled consent structure, fiduciary / subprocessor transparency, and legal disclaimer (“draft for counsel”) are appropriate. **ORGANISATION NAME** and conditional retention string are correctly flagged as implementation / Legal dependencies.

### Experience principles (`docs/experience-principles.md`)

• **Empower:** Dual Adobe vs Workday status avoids false closure; candidate must confirm in Workday; admin toggle is explicit. Supports outcome focus and user control.

• **Trust:** Plain-language steps, separated consents, no UIDAI endorsement claim, visible timestamps / statuses. **Grow:** Toggle + BP parallelism + Documents tab narrative support revision and auditability; help text sets JP/DE boundaries.

---

## PASS 4: Final Improvements

• **Applied in this peer review:** Screen 1 **Tabs** row in PASS 2 §1 now uses **Overview** as the third tab, consistent with §3 Navigation and **ProfilePageLayout** (replacing **Job applications**).

• **For 320:** Implement **Orange** `StatusIndicator` for **Confirmation needed in Workday** unless Legal/PM explicitly requests a calmer Blue treatment; keep PASS 2.5 strings as canonical. Ship rich, non-stub content on **Process**, **Documents**, and **Overview** per **320** prototype standards.

• **For 315 (documentation only, no second 318 loop):** If **ProfilePageLayout** in repo uses different tab labels, align labels in a future brief revision to match the live manifest (labels must stay consistent with recruiter hub patterns).

---

## Final Verdict: APPROVED

**320** may proceed: build the Canvas Kit prototype from this Design Brief and `docs/prds/india-aadhaar-adobe-sign-offer-prd.md`. Strategy, Sana Style, Canvas Kit mapping, and copy (PASS 2.5) are pre-validated; apply PASS 4 notes for status colour and tabs.

---

Workday Confidential
