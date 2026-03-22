# UX copy review: GCC candidate grid v44

**Reviewer:** 319 — Doc Writer  
**Date:** 21 March 2026  
**Inputs:** `design/gcc-candidate-grid-v44-discovery-brief.md` (Final Verdict: APPROVED), `design/gcc-candidate-grid-v44.tsx`  
**Scope:** Recruiter-facing UI only (Workday shell + hub tabs + candidate grid + review modal + comm dock)

---

## Summary

| Metric | Value |
|--------|--------|
| **Copy review path** | `design/gcc-candidate-grid-v44-copy.md` |
| **Issues found** | **8** (see findings; em dash appears on **2** surfaces, counted as one issue type) |
| **Critical (legal blockers)** | **0** — prototype copy is directionally compliant; production needs counsel sign-off on final strings |

---

## Full UI copy inventory

### Global shell (`WorkdayTopNav`, defaults)

- Search placeholder (default prop): `Search or ask a question`

### Hub primary rail (`HUB_TABS`)

- `Overview`, `Job requisitions`, `Candidates`, `Dashboard`

### Secondary hub chrome

- Title: `Recruiter Hub`  
- Subtitle: `Job requisition · Candidates (concept)`

### Overview tab

- Page title: `Overview`  
- Supporting: `Tasks and requisition health for this hub. Representative content for navigation completeness.`  
- Cards: `Open requisitions`, `47`, `Owned or supported by you`  
- Cards: `Candidates in review`, `12`, `Awaiting next stage`  
- Cards: `Interviews this week`, `8`, `Panel and HM slots`  
- Section: `Recent activity`  
- Table headers: `Time`, `Event`, `Owner`  
- Rows: `Today` / `Boolean search saved for GCC consultant req` / `You`  
- Rows: `Yesterday` / `Similar-candidate suggestions refreshed (assistive)` / `System`

### Job requisitions tab

- Title: `Job requisitions`  
- Headers: `ID`, `Title`, `Location`, `Status`, `Candidates`  
- Body: mock IDs, titles, locations, statuses, numerals

### Dashboard tab

- Title: `Dashboard`  
- Body: `Pipeline velocity and sourcing funnel for your scope. Figures are illustrative for this prototype.`  
- Card title: `Stage conversion (illustrative)`  
- Headers: `Stage`, `Count`, `Δ vs last week`  
- Stages: `New`, `Screen`, `Interview` (and table numerals)

### Candidates tab (main)

- Title: `Candidates`  
- Intro: `R-2026-1842 · Senior consultant — GCC · Enhanced search and unified review (split modal). Match scores are assistive; recruiters confirm all stage changes.`  
- Card title: `Search and filters`  
- Label: `Search candidates (boolean)`  
- Placeholder: `Use AND, OR, NOT — e.g. (skill:"PM") AND location:Dubai*`  
- Button: `Boolean examples`  
- Labels: `Location`, `Status`, `Applied from`, `Applied to`  
- Location options: `All`, `Dubai`, `Riyadh`, …  
- Status options: `All`, `New`, `Screen`, `Review`, `Interview`, `Offer`  
- Switch block 1 title: `AI similar candidates`  
- Switch block 1 help: `Surface matches by skills, experience, and req text (assistive).`  
- Switch block 2 title: `Search across database`  
- Switch block 2 help: `Broaden to tenant candidate records (respects security).`  
- **AI disclosure (inline):** `AI-assisted ranking — human review required. Suggestions do not change candidate status or outcomes without an explicit recruiter action. Similar-candidate and database-wide modes are transparency aids only in this prototype.`  
- Conditional banners:  
  - `Similar candidates + database-wide scope active (illustrative).`  
  - `Similar candidates mode on — results emphasise skill and req overlap.`  
  - `Database-wide search on — results may include candidates outside this req view.`  
- Buttons: `Save filter`, `Clear filters`  
- Sortable headers: `Name`, `Job title`, `Location`, `Status`, `Match score`, `Applied date`  
- Row link style: candidate names (data)  
- Empty state: `No candidates match these filters. Widen the date range or clear status.`  
- `aria-label` on rows: `Open profile for [name]`  
- Match sublabels (from code): `Strong fit`, `Good fit`, `Moderate fit`, `Developing fit`  
- `aria-label` on match pill: `Match grade [letter], [n] percent`

### Communication dock

- Panel title: `Messages`  
- Subtext: `Email and work notifications (prototype)`  
- Body: `Collapsed by default. Expand to preview outreach from the candidate grid flow.`  
- Rail: `Expand messages` / `Collapse messages` (`aria-label`)

### Review modal

- Heading: candidate name (data)  
- Subtitle pattern: `{jobTitle} · {status badge} · Match {n}%`  
- Toolbar: `Previous candidate`, `Next candidate` (`aria-label`)  
- Position: `{k} of {n}`  
- Hint glyphs: `← →`  
- Close: `Close profile`  
- Banner row title: `Similar candidates available`  
- Button: `View`  
- **AI disclosure (modal strip):** `AI-assisted ranking — human review required. No automatic reject or advance.`  
- Left column: `Current status`, `Skills summary`  
- Buttons: `Advance`, `Reject`, `Message`  
- Right column: `Resume / CV`, `Experience`, `Education`, `Skills detail`  
- Monospace block: resume text (data)

---

## Editorial checklist (319)

Applied: sentence case, concise, action-oriented, active voice where possible, specific, consistent terminology, plain language, numerals in UI counts and scores.

**Generally strong**

- Page and section headings use sentence case.  
- Intro under **Candidates** states assistive match + recruiter-owned stage changes (aligns with discovery brief).  
- Empty state follows “what’s wrong + what to do”.  
- Modal repeats human-review message near decisions.  
- Status badges and match band labels are scannable.

---

## Findings (prioritised)

### 1. Em dash in AI disclosure (editorial + consistency with `010-style-guide.mdc`)

**Current (grid):** `AI-assisted ranking — human review required. …`  
**Current (modal):** `AI-assisted ranking — human review required. …`  
**Issue:** Workspace style guide disallows em dashes; use a hyphen, comma, or colon.  
**Recommended:** `AI-assisted ranking: human review required.` (same in both places for consistency.)  
**Rationale:** Meets Editorial/`010` punctuation rules; keeps legal-adjacent text stable across surfaces.

### 2. Abbreviation “req” in recruiter help copy

**Current:** `… and req text (assistive).` and `… skill and req overlap.`  
**Issue:** “Req” is internal shorthand; not plain language for all recruiters.  
**Recommended:** `… and job requisition text (assistive).` / `… skill and job requisition overlap.`  
**Rationale:** Matches Workday product language and discovery brief wording.

### 3. Vague security line on database-wide search

**Current:** `Broaden to tenant candidate records (respects security).`  
**Issue:** “Respects security” does not say what the user can rely on.  
**Recommended:** `Broaden to tenant candidate records you’re allowed to view.` (or `… your permissions allow.` if preferred.)  
**Rationale:** Specific, active, reduces false confidence about scope.

### 4. Primary action “Advance” is under-specific

**Current:** `Advance`  
**Issue:** Discovery brief and `319` destructive/primary patterns favour verb + object / clear outcome.  
**Recommended:** `Advance stage` (or `Move to next stage` if that matches product terminology).  
**Rationale:** Clarifies that pipeline stage changes still require explicit recruiter intent.

### 5. Tertiary “View” is ambiguous

**Current:** `View` (next to “Similar candidates available”)  
**Issue:** View what?  
**Recommended:** `View similar candidates`  
**Rationale:** Action + object; matches the adjacent heading.

### 6. “Message” vs standard outreach pattern

**Current:** `Message`  
**Issue:** Slightly less action-forward than typical Workday patterns.  
**Recommended:** `Send message` (if channel is chosen elsewhere) or `Open messages` if it only opens the dock.  
**Rationale:** Verb-led button label; confirm against real navigation before shipping.

### 7. Carousel / keyboard hint `← →`

**Current:** Bare glyphs next to prev/next controls.  
**Issue:** Easy to miss; not a full substitute for visible instruction (toolbar buttons have good `aria-label`s).  
**Recommended:** Short line: `Use arrow keys to move between candidates.` (and drop isolated glyphs, or keep glyphs only as decoration with the sentence.)  
**Rationale:** Supports discoverability without relying on screen reader-only affordances.

### 8. Dashboard column `Δ vs last week`

**Current:** `Δ vs last week`  
**Issue:** Symbol may not read aloud well; some users will not parse “delta”.  
**Recommended:** `Change vs last week` or `Week-on-week change`  
**Rationale:** Plain language, same numerals in cells.

### Minor / prototype-only (no change required for 319 sign-off unless productising)

- **Boolean placeholder** uses field-style syntax (`skill:"PM"`); ensure examples match **actual** query grammar before GA.  
- **“Match score”** in table vs **“ranking”** in disclosure: align on one customer-facing term (`match score` / `fit score`) in legal and product copy sets.  
- **“Resume / CV”:** Acceptable dual label for GCC; if Editorial prefers a single term, pick the regional default per locale.

---

## 060 — Legal-sensitive copy validation (invoked from 319)

**Context:** Recruiter-only assessment UI; AI-assisted similarity, database-wide search, and match scoring; no candidate-facing strings in this prototype.

| Topic | Assessment |
|--------|-------------|
| **EU AI Act** | Features sit in **high-risk** recruitment context when they inform selection. In-product copy should **not** imply the system makes hiring decisions. Current strings state **human review** and **no automatic reject or advance** — aligned with **transparency** and **human oversight** expectations (cf. Arts 13–14, 50 as applicable to deployer/candidate-facing layers). This screen is recruiter-only; **candidate-facing** disclosures would still be required where candidates interact with AI-affected outcomes. |
| **GDPR Art. 22** | Copy correctly signals that **suggestions do not change status or outcomes without explicit recruiter action** and that there is **no automatic reject or advance**. That supports the position that decisions are **not solely automated** in the flow shown. **Final** Art. 22 compliance depends on backend behaviour, audit trails, and any fully automated steps elsewhere — not only UI text. |
| **Accuracy / transparency** | Avoid overstating what AI does (“transparency aids only in this prototype” is honest for a demo; remove or replace for production). **“Human review required”** is strong — ensure product behaviour matches (e.g. no auto stage moves from score alone). |
| **Risk level** | **Low–medium** for **prototype** copy direction; **medium** for **production** until privacy notice links, tenant configuration, and any cross-border / database-search purpose text are defined with Legal. |

**060 validation summary:** **No blocking flags** on the current recruiter-facing strings for a **prototype**; **conditional approval** for production pending: (1) removal of “prototype-only” caveats or replacement with accurate production language, (2) alignment of **ranking/match** terminology with product + Legal, (3) confirmation that no solely automated decisions occur in the shipped workflow, (4) candidate-facing surfaces reviewed separately if scores or AI influence what candidates see.

---

## Recommended string patch list (for 320)

| Location | Replace | With |
|----------|---------|------|
| Grid + modal AI headline | `AI-assisted ranking — human review required.` | `AI-assisted ranking: human review required.` |
| AI similar help | `… req text …` | `… job requisition text …` |
| Conditional banner | `… req overlap.` | `… job requisition overlap.` |
| Database switch help | `(respects security)` | `(you’re allowed to view)` or equivalent permission-based wording |
| Modal primary | `Advance` | `Advance stage` (or agreed product term) |
| Modal tertiary | `View` | `View similar candidates` |
| Modal tertiary | `Message` | `Send message` or `Open messages` (per real behaviour) |
| Modal toolbar | `← →` only | Add `Use arrow keys to move between candidates.` |
| Dashboard table | `Δ vs last week` | `Change vs last week` |

---

## Return payload (orchestrator)

- **Copy review path:** `design/gcc-candidate-grid-v44-copy.md`  
- **Issue count:** **8**  
- **060 validation summary:** Prototype recruiter copy **directionally compliant** with AI transparency and Art. 22 messaging; **no prototype blockers**; production requires Legal review, terminology alignment, and behaviour parity with claims.
