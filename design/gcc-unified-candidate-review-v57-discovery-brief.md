# Unified candidate review surface – Discovery & Design Brief (v57)

**Mission:** GCC-E2E-017 · **Pipeline step:** 7b (**315** PASS 3–4 complete)  
**PRD:** `docs/prds/gcc-unified-candidate-review-prd.md`  
**319 copy review:** `design/gcc-unified-candidate-review-v57-copy-review.md`  
**Date:** 24 March 2026  
**Final Verdict:** **APPROVED** (see **060 follow-up** for legal-sensitive strings; **320** implements **319**-approved text below unless **060** supplies canonical replacements)

---

## Grounding summary

| Source | Use in this brief |
|--------|-------------------|
| **Deployment Agent** (`ask_deployment_agent`, thread `34cb609c-b5ff-46ad-82ea-328b756656f0`) | Req **candidate list** as primary entry to review; **next/previous** sequential navigation is expected but **known issue** returning users to grid; placement: **full-page hub tab**, **split view**, and **primary drill-in from candidate name** align with patterns; **row action** weaker for dense surface; HiredScore UI surfacing **not documented** in DA corpus (treat as **programme-defined spotlight slot**). |
| **Functional knowledge** | **Recruiting Data Purge - Functional Overview** (`functional-knowledge/`, verification inventory): candidate/application **retention and processing** context for what appears in **timeline** and **audit**; notes visibility remains subject to **Pre-screen notes: spike gate** in PRD. **Recruiting Duplicate Management - Functional Overview** (UDMF): **multiple applications** and identity resolution inform **summary** and **req context** copy (this application on this req). |
| **`docs/jtbd-recruiting-hr-professional-and-manager.md`** | Recruiter cluster **Manage candidates throughout the recruiting process** and **Manage my assigned job requisitions** (determine fit, progress efficiently, keep reqs healthy). |
| **`docs/experience-principles.md`** | **Empower** (advisory HS, no auto-disposition); **Trust** (transparent signals, clear history); **Grow** (fallback to full profile, editable notes). |
| **Recruiter-flow references** | `design/references/recruiter-flow/README.md`: **Pattern D** (dense workspace: req list, filters, table) for hub/list; **Pattern A+** for Recruiter Hub chrome; **Sana** neutrals per `010-style-guide.mdc` (avoid legacy **Pattern B** heavy blue candidate column for this surface). |
| **Canvas Kit MCP** | `get-canvas-kit-tokens` consulted for v14 token resources (`docs://tokens/color-roles`, `docs://tokens/color-contrast` available); prototype to use **Canvas Kit primitives** + **`sanaShellTheme`** exports, not ad hoc chrome. |

---

## Six Hats validation (trade-offs)

| Hat | Insight |
|-----|---------|
| **White** | PRD mandates **single high-density surface**, **HS spotlight**, **RTL/AR**, **complement sequential**; DA notes **navigation reliability** and **grid return** as real risks (**PRD NFR** cites thread `593c667b-32ad-43c3-83bf-0c82ddbcf84e`). |
| **Red** | Recruiters want **speed**; fear of **AI deciding** if spotlight copy or visual weight is wrong. |
| **Black** | **Density** vs scannability; **RTL** + embedded **CV** viewer edge cases; **HS** version / licence **fragmentation**; **notes** policy still **spike-gated**. |
| **Yellow** | Clear win: **fewer tab hops**, **in-context fit signals**, **one workspace** for triage on large reqs (**105** / **120** alignment). |
| **Green** | Future: optional **split list + detail**, **keyboard-first** triage, **coordinator** handoff templates. |
| **Blue** | **Decision:** Proceed with **Pattern D + Sana** full-page workspace under **Candidates** on the req; **319** copy merged in PASS 3–4; **060** to confirm legal-sensitive lines before GA. |

---

# PASS 1: LAYOUT STRATEGIST (DESIGN THINKING)

## 1. Jobs To Be Done (worksheet-aligned)

**Verbatim anchors (from `docs/jtbd-recruiting-hr-professional-and-manager.md`):**

- Determine if candidate meets requirements of the job  
- Progress candidates through the stages of the pipeline as efficiently as possible  
- Manage my assigned job requisitions  
- Identify ways that my HR systems can better meet my workflow  

**Synthesised JTBD (primary recruiter):**

> When I am triaging **large candidate volumes** on a **job requisition**, I want **summary, CV, timeline, and notes in one dense workspace** with **optional fit signals** and **reliable next/previous movement**, so I can **decide and document faster** without losing **auditability** or **control**.

**Prototype implications**

- Default view shows **all four panels** (summary, CV, timeline, notes) without forcing profile tab churn.  
- **HiredScore-style spotlight** is always present as a **region** (content vs empty state).  
- **Previous / Next candidate** and **return to candidate list** are always visible.  
- **RTL / Arabic**: layout and reading order mirror correctly; typography uses locale-appropriate fonts in production (prototype flags `dir="rtl"` for demo state).  
- **No breadcrumbs**; req and candidate context via **heading + subtitle + metadata** only (`010-style-guide.mdc`).

**Hiring manager (tertiary, PRD v1 likely recruiter-first):** JTBD *Determine if a candidate is the right fit* / *Track the progress of candidates* informs future read-only slices; **v57 brief** scopes **recruiter-primary** implementation.

## 2. Shell pattern selection

**Primary: Pattern D (dense workspace)** with **Pattern A+** global chrome.

**Justification**

- Work aligns with **job requisition candidate management** (see recruiter-flow manifest: **Job Requisitions** / table-heavy hub).  
- **High-density** triage matches **D** (tabs, filters, table, actions) more than **C** (modal) or **B** (legacy blue profile column).  
- **Complement sequential review:** unified surface is a **full-page drill-in** from the req candidate **list**, not a replacement for the list or for **Native** sequential patterns elsewhere.

## 3. Reference layouts (do not invent from scratch)

| Reference | Application |
|-----------|-------------|
| `design/references/recruiter-flow/README.md` · **Pattern D** | Req-scoped **table + filters + hub** density. |
| `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` | **White cards** on **grey field**, **pill** accents, **section hierarchy**. |
| `design/gcc-candidate-review-cv-carousel-v54.tsx` | **Hub tab** set (`Overview`, `Job requisitions`, `Candidates`, `Dashboard`) and **candidate table → detail** flow (reuse naming; **v57** replaces modal/carousel with **unified page**). |

## 4. Layout regions

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TOP · WorkdayTopNav (Sana: grey bar, pill search, utilities, avatar)      │
├──────┬───────────────────────────────────────────────────────────────────┤
│ LEFT │ PRIMARY WORKSPACE (scrollable main column)                          │
│ ·    │ ┌─────────────────────────────────────────────────────────────────┐ │
│ Pri- │ │ Page header: candidate name (Heading) · subtitle (req, location) │ │
│ mary │ │ · index "12 of 128" · Stage badge                                 │ │
│ rail │ │ · Previous | Next · Secondary: Open full profile · Back to list   │ │
│ +    │ ├─────────────────────────────────────────────────────────────────┤ │
│ Sec- │ │ ROW 1 · HiredScore spotlight (full width Card) – mandatory slot  │ │
│ ond- │ │   [Show details / Hide details] · advisory copy · in-card **About this insight**; help **About HiredScore insights** │ │
│ ary  │ ├────────────────────────────┬──────────────────────────────────────┤ │
│ hub  │ │ COL A · Summary (Card)     │ COL B · CV / resume (Card, dominant)   │ │
│ tabs │ │ · key fields, fit snippet  │ · viewer / pages · download fallback   │ │
│      │ │ · status, source, applied  │ · attachment-only state                │ │
│      │ ├────────────────────────────┼──────────────────────────────────────┤ │
│      │ │ COL A cont. · Notes (Card) │ COL C · Timeline (Card)                │ │
│      │ │ · filter type (if supported)│ · applications, stages, events       │ │
│      │ │ · composer + list          │ · chronological, req-scoped            │ │
│      │ └────────────────────────────┴──────────────────────────────────────┘ │
│      │ RIGHT (optional): CommunicationDock · collapsed by default           │
│      │ · Rail: email / SMS / etc. per shared Sana comm patterns              │
└──────┴──────────────────────────────────────────────────────────────────────┘
```

**Responsive note (prototype v1):** Desktop-first grid; **narrow widths** stack **Summary → CV → Timeline → Notes** with **spotlight** remaining first below header.

## 5. Hierarchy

1. **Dominant:** **CV / resume** panel (largest card, primary scan target).  
2. **Strong secondary:** **HiredScore spotlight** (always first full-width row when present; visually distinct but **Sana-neutral** surface, not alarming).  
3. **Supporting:** **Summary** (fast context), **Timeline** (history), **Notes** (capture judgement).  
4. **Persistent chrome:** **Previous / Next** and **position in list** stay in **page header** for throughput.

## 6. Interaction model

- **Entry (PM TBD):** **Recommended primary:** **drill-in from candidate name** on req candidate list; **secondary:** explicit **"Unified review"** action on row or overflow menu. **Split view** (list + detail) documented as **v2** candidate unless PM selects for v1.  
- **Mass actions (319):** Prefer **Back to candidate list** as the single primary return to the grid where mass actions live; ship **View mass actions** only if engineering adds a **distinct** control (do not offer two similar exits without intent).  
- **Sequential navigation:** **Previous** / **Next** in header; must **preserve focus order** and **not skip** candidates (PRD **NFR**).  
- **Fallback:** **Open full profile** opens existing **Native sequential / profile** experience (use **319**-approved strings; errors reference **the candidate’s full profile** where applicable).  
- **Mass actions:** **Back to candidate list** returns to grid with selection preserved where possible (**TBD** engineering).  
- **Spotlight:** **Expand / collapse** for secondary metrics; default **collapsed** vs **expanded** **TBD** (default **expanded** if content is single primary score line).  
- **Notes:** Reflect **spike gate**; prototype shows **composer + list** with **realistic gating** message if pre-screen blocked (**319** + **060**).  
- **Sub-tabs inside panels:** Avoid for v1; if **Timeline** length forces **"Show more"**, use **TertiaryButton** / inline expansion.

## 7. Layout framework (A–F)

| ID | Assessment |
|----|------------|
| **A · JTBD** | Supports **efficient triage** and **documented judgement** on one req. |
| **B · Shell** | **D + A+** on req **Candidates** hub tab; complements **Native** sequential. |
| **C · Hierarchy** | **CV** dominant; **spotlight** high but **advisory**; supporting cards subordinate. |
| **D · Density** | High by design; mitigate with **card borders**, **spacing**, **progressive disclosure** in spotlight. |
| **E · Accessibility** | Logical focus order: header nav → spotlight → summary → CV → notes → timeline; **WCAG** targets per PRD; **RTL** mirror. |
| **F · Canvas coverage** | Full **WorkdayTopNav** + **WorkdayLeftTabBar**; **every hub tab** populated (see PASS 2). |

---

# PASS 2: UI COMPOSITION (CANVAS KIT)

## Sana Style (`010-style-guide.mdc`)

- **Page canvas:** `SANA_PAGE_CANVAS`; **cards:** white on grey field, `SANA_CARD_RADIUS_LG`, thin **soap** borders.  
- **No warning `Banner`** for mock data; use neutral **BodyText** under title if needed.  
- **No breadcrumbs** or chevron path strips.  
- **Spotlight:** neutral **Card** with subtle **left border** or **icon** for emphasis (token-safe); avoid full-bleed blueberry headers.

## Navigation completeness – `WorkdayLeftTabBar`

**Primary rail (match v54):** e.g. **Home**, **Job requisitions**, **Candidates**, **Dashboard** (icons + micro-labels per `WorkdayLeftTabBar`).

**Secondary column – hub tabs (all must ship representative content in 320):**

| Tab ID | Label | Representative content |
|--------|-------|-------------------------|
| `overview` | Overview | Req summary card, hiring team strip, key dates, status. |
| `requisitions` | Job requisitions | Compact **Table** of reqs (mock) or link row to current req context. |
| `candidates` | **Candidates** | **Active:** unified review surface **or** candidate **Table** with drill-in to unified view (320 may use route state toggle). |
| `dashboard` | Dashboard | Simple KPI **Cards** + **BodyText** (mock metrics). |

**CommunicationDock:** **Yes** – **collapsed** by default; **Sana** rail tiles; panel uses **`SanaCommComposer` / `SanaCommMessageBubble`** for **one** channel demo thread (e.g. **Email**) to satisfy shell parity; scope note: PRD v1 emphasis is **Notes** in main column.

## Canvas Kit mapping (v14)

| Area | Components (indicative) |
|------|-------------------------|
| Shell | `WorkdayTopNav`, `WorkdayLeftTabBar`, `CommunicationDock`, `Box`, `Flex` |
| Page structure | `Card`, `Heading`, `BodyText`, `Text`, `Avatar`, `Badge` / status pill |
| Header actions | `SecondaryButton`, `TertiaryButton`, `ToolbarIconButton`, `SystemIcon` |
| Grid layout | `Flex` + `gridTemplateColumns` on `Box` (responsive breakpoints) |
| CV panel | `Card` + scrollable `Box`; embedded viewer iframe/mock page strip; `TertiaryButton` **Download** |
| Timeline | `Table` **or** vertical `Flex` of rows with `BodyText` + metadata |
| Notes | `FormField` + `TextArea` (`FormTextInput` / shared controls where single-line); `PrimaryButton` **Add note**; list in `Card` |
| Spotlight | `Card` + `Heading` + `BodyText` + `TertiaryButton` **Learn more** / **Expand**; optional `Tabs` only if HS content grouped |
| Filters (notes) | `FormSelect` from `design/components/SharedFormControls.tsx` for **Note type** filter |
| RTL demo | Root content wrapper `dir={rtl ? 'rtl' : 'ltr'}` + mirrored `Flex` directions |

**320 pre-flight:** Call **`get-canvas-kit-tokens`** again at build; use **`colors` / `space`** from `@workday/canvas-kit-react/tokens` and **`sanaShellTheme`**.

## Telemetry hooks (for engineering)

| Event (PRD-aligned) | UI anchor |
|---------------------|-----------|
| Surface load | Route mount / candidate id change |
| Panel engagement | Scroll depth or section `onFocus` / expand |
| Note created | **Add note** success |
| Next / Previous | Header buttons |
| Spotlight expand/collapse | Toggle control |

---

## Copy Inventory (**319**-approved for **320**)

Merged from `design/gcc-unified-candidate-review-v57-copy-review.md`. **British English**, sentence case, numerals for counts. **060** may replace **Legal / AI / transparency** and **Navigation blocked (policy)** strings with canonical wording before GA; until then implement below.

### Buttons and CTAs

| Element | Approved copy |
|---------|----------------|
| Previous candidate | Previous candidate |
| Next candidate | Next candidate |
| Back to candidate list | Back to candidate list |
| Open full profile | Open full profile |
| Add note | Add note |
| Save note | Save note |
| Cancel | Cancel |
| Download (CV card) | Download |
| Expand spotlight | Show details |
| Collapse spotlight | Hide details |
| In-spotlight transparency link | About this insight |
| Show more timeline | Show more activity |
| Mass actions (only if distinct control) | View mass actions |
| HiredScore integration link (when URL exists) | **Update integration** *(or final label from HiredScore docs)* |

### Headings and labels

| Element | Approved copy |
|---------|----------------|
| Page title | `{Candidate preferred name}` |
| Subtitle line | `{Job posting title}` · `{Requisition ID}` · `{Location}` |
| Position indicator | `{n} of {total} candidates` (numerals in UI) |
| Spotlight region title | Prioritisation insight |
| Summary card | Summary |
| CV card | CV |
| Timeline card | Activity |
| Notes card | Notes |
| Note type filter | Note type |
| Stage badge | (dynamic stage name) |
| HiredScore help (distinct from in-card link) | About HiredScore insights *(or canonical article title when URL fixed)* |

### Form labels and help

| Field | Label | Help |
|-------|-------|------|
| Note body | Note | Add context for the hiring team. *(060 may append visibility / minimisation line after pre-screen spike.)* |
| Note type | Note type | Filter notes by type. |

### Empty states

| Context | Heading | Body | CTA |
|---------|---------|------|-----|
| No CV parseable | No preview available | Download the file to view this CV. | Download |
| No timeline events | No activity yet | Events appear as the candidate moves through the pipeline. | — |
| No notes | No notes yet | Add a note to record your decision for this job requisition. | Add note |
| HiredScore off / not licensed | Prioritisation insights unavailable | HiredScore isn’t activated for your organisation, or insights aren’t available for this candidate. | About this insight **only** when href exists; else omit |
| HiredScore below min version | Insights temporarily unavailable | Update your HiredScore integration to see prioritisation insights here. | **Update integration** *(when URL exists)* |

### Loading states

| Action | Approved copy |
|--------|----------------|
| Surface load | Loading candidate… |
| CV panel | Loading document… |
| Timeline | Loading activity… |
| Next / Previous | Loading candidate… |

### Error messages

| Scenario | Approved copy |
|----------|----------------|
| Failed to load candidate | We couldn’t load this candidate. Refresh the page or return to the candidate list. |
| Failed to load CV | We couldn’t load this document. Try downloading it or open the candidate’s full profile. |
| Failed to save note | We couldn’t save your note. Check your connection and try again. |
| Navigation blocked (policy) | You can’t add a note at this stage. Open the candidate’s full profile or contact your administrator to adjust the process. *(pending **060** / pre-screen spike)* |

### Success / confirmation

| Action | Approved copy |
|--------|----------------|
| Note saved | Note saved |

### Legal / AI / transparency (**060** to confirm before GA)

| Element | **319**-approved proposal (implement unless **060** supersedes) |
|---------|------------------------------------------------------------------|
| Spotlight disclaimer | This insight is advisory. It doesn’t replace your judgement. |
| Short AI disclosure | This insight uses assisted matching. You make the final hiring decision. |

### Tooltip / aria

| Control | Approved aria-label |
|---------|----------------------|
| Previous | Previous candidate |
| Next | Next candidate |
| Spotlight expand | Show insight details *(optional: Show prioritisation details for specificity)* |

---

## Placement recommendation (for PRD open question #2)

| Option | Fit |
|--------|-----|
| **Primary drill-in from name** | **Recommended** – matches DA and recruiter mental model; maximum space for dense layout. |
| **Dedicated req sub-tab "Review"** | Possible for tenants that want **default** unified mode; adds hub complexity. |
| **Split view** | Strong for **throughput**; higher engineering cost; consider **phase 2**. |

---

## Open items for PM / engineering

1. **Default experience:** global vs opt-in tenant default (**PRD open question 2**).  
2. **HiredScore** help URL and final **About HiredScore insights** label (**319** / docs).  
3. **Pre-screen notes:** final gate copy after **spike** + **060** (may replace table row above).  
4. **Mobile** in or out of v1 (**PRD open question 4**).  
5. **060** pass on legal-sensitive strings (see Copy Inventory).

---

# PASS 3: PEER REVIEW (DESIGN REVIEWER)

## Strategy validation

| Check | Finding |
|-------|---------|
| **JTBD** | **Pass.** Worksheet anchors are cited; synthesised job matches PRD (high-volume req triage, single surface, advisory signals, control). Hiring manager scope correctly deferred. |
| **Layout vs workflow** | **Pass.** List → drill-in → dense workspace matches DA guidance; sequential **Previous / Next** explicit; fallback to full profile preserved. |
| **Shell pattern** | **Pass.** **Pattern D + A+** appropriate for req context; **Sana neutrals** and explicit avoidance of legacy **Pattern B** blue column align with **010**. |

## Layout quality

| Check | Finding |
|-------|---------|
| **Primary focus within ~3s** | **Pass.** **CV** panel is dominant; spotlight is secondary signal, not the whole canvas. |
| **Workday-like** | **Pass.** References recruiter-flow + v54 hub naming; not generic. |
| **Regions** | **Pass.** Top / left hub / main column / optional comm dock clearly defined. |
| **Visual competition** | **Acceptable.** Mitigated by card hierarchy and progressive disclosure in spotlight; **320** must not let spotlight overpower CV (neutral Card only). |

## Design system validation

| Check | Finding |
|-------|---------|
| **Canvas Kit** | **Pass.** Mapping uses CK primitives + shared **FormSelect**; no fantasy components. |
| **Sana** | **Pass.** `SANA_PAGE_CANVAS`, cards, no mock **Banner**; spotlight styling constraints documented. |
| **Invented UI** | **Pass.** Document viewer called out as embedded / mock strip (acceptable prototype pattern). |

## Navigation + completeness

| Check | Finding |
|-------|---------|
| **All hub tabs** | **Pass.** Overview, Job requisitions, Candidates, Dashboard each have defined representative content for **320**. |
| **CommunicationDock** | **Pass.** Collapsed default; scoped note that **Notes** are primary in main column. |

## Copy quality (post-**319**)

| Check | Finding |
|-------|---------|
| **Editorial Guidelines** | **Pass.** Sentence case, action CTAs, problem + solution errors, **Loading candidate…** for next/previous. |
| **AI / transparency** | **Pass with flag.** Fragment fixed; **060** must confirm final customer-facing lines (**319** note). |
| **Terminology** | **Pass.** Candidate / requisition / full profile consistent with approved error strings. |

## Experience principles (`docs/experience-principles.md`)

| Principle | How the brief supports it |
|-----------|---------------------------|
| **Empower** | Advisory spotlight + explicit **You make the final hiring decision**; no auto-disposition in scope. |
| **Trust** | Transparent HS empty states; timeline and note attribution patterns implied; **060** on accuracy of restrictions. |
| **Grow** | **Open full profile** fallback; editable notes; return to list for mass actions. |

## No-breadcrumb rule

| Check | Finding |
|-------|---------|
| **010 / 320 hard rule** | **Pass.** Brief forbids breadcrumbs and chevron paths; context via **Heading**, subtitle, metadata, hub tabs only. |

### PASS 3 outcome

No blocking defects. **Proceed to PASS 4.**

---

# PASS 4: FINAL IMPROVEMENTS

1. Merged **319** **Approved** copy into **Copy Inventory** (this revision).  
2. Clarified **mass actions** escape hatch vs optional **View mass actions** per **319**.  
3. Aligned layout diagram with **About this insight** vs **About HiredScore insights** (in-card vs help).  
4. Documented **060** follow-up so **320** can ship while legal finalises a small string set.

No second full layout iteration required.

---

## Final Discovery & Design Brief (concise)

- **What:** Unified, high-density **req-scoped** candidate review: **Prioritisation insight** (HiredScore slot) + **Summary** + **CV** + **Activity** + **Notes**, with **Previous / Next** and **Back to candidate list**.  
- **Where:** **Candidates** on job requisition, **drill-in** from list (recommended); full **WorkdayTopNav** + **WorkdayLeftTabBar** + optional **CommunicationDock**.  
- **Visual system:** **Sana** neutrals, **Canvas Kit v14**, **no breadcrumbs**.  
- **Copy:** Implement **Copy Inventory** above; **060** may update legal-sensitive rows.  
- **RTL/AR:** Prototype and engineering must mirror layout and test recruiter shell (**PRD**).  
- **Quality bar:** NFR navigation reliability and HS fallback (**PRD**) drive **320** test scenarios.

---

## Handoff to **320**

Discovery & Design complete for **Unified candidate review surface (v57)**. **Final Verdict: APPROVED.**

- **Discovery Brief:** `design/gcc-unified-candidate-review-v57-discovery-brief.md`  
- **PRD:** `docs/prds/gcc-unified-candidate-review-prd.md`  
- **Copy:** `design/gcc-unified-candidate-review-v57-copy-review.md` (audit trail)

**320:** Build the Canvas Kit prototype from this brief and PRD. Use approved strings exactly; call **`get-canvas-kit-tokens`** at build; apply **060** updates to legal copy if provided before or during implementation.

---

**Deployment Agent thread (315 grounding):** `34cb609c-b5ff-46ad-82ea-328b756656f0`  
**PRD DA reference threads:** `593c667b-32ad-43c3-83bf-0c82ddbcf84e` (parity / navigation), `b6d8a019-23b1-4241-a0e6-34c93e96da2a` (notes)
