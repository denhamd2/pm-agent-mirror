# GCC Candidate Grid v46 — UX copy spot-check (319)

**Prototype:** `design/gcc-candidate-grid-v46.tsx`  
**Mode:** Final spot-check (copy pre-approved in Discovery Brief; validate implementation vs Editorial Guidelines)  
**Reviewed:** 22 March 2026  
**Reviewer role:** 319-doc-writer (with 060 legal assessment for sensitive strings)

---

## Section 1: Copy inventory (spot-check)

Strings are grouped by category. Where the same text appears multiple times, it is listed once with a usage note.

### Buttons and button-like actions

| String | Source / notes |
|--------|----------------|
| Move to Screen | `COPY.moveToScreen` — primary bulk + modal footer |
| Reject candidate | `COPY.rejectCandidate` |
| Close | `COPY.close` — popup close, modal close |
| Open CV | `COPY.openCv` — grid + CV tab |
| Open full profile | `COPY.openFullProfile` |
| Clear filters | `COPY.clearFilters` |
| Save filter | `COPY.saveFilter` |
| Apply filters | `COPY.applyFilters` — main card + saved filters card |
| Boolean search tips | `COPY.booleanSearchTips` — tertiary popup trigger |

### Icon-only controls (visible to AT / screen readers)

| String | Source / notes |
|--------|----------------|
| Previous candidate | `COPY.prevCandidate` — `aria-label` |
| Next candidate | `COPY.nextCandidate` — `aria-label` |

### Labels and field text

| String | Source / notes |
|--------|----------------|
| Search candidates | `COPY.searchCandidates` |
| Stage | `COPY.stage` |
| Source | `COPY.source` |
| Saved filters | `COPY.savedFilters` — card heading and duplicate `<label>` |
| Filters and search | Inline heading |
| Boolean search | `Popup.Heading` |
| Name | `COPY.name` — column header |
| Applied date | `COPY.appliedDate` — column header |
| Match score | `COPY.matchScore` — column header + modal meta |
| Location | `COPY.location` — column header |
| Candidate | `COPY.candidateCol` — table header + `aria-label` prefix |
| CV | `COPY.cvCol` — column header + CV tab section |
| Contact | Modal overview section |
| Experience | Modal overview section |
| Education | Modal overview section |
| Skills | Modal overview section |
| Pages | CV tab thumbnails column |
| Page 1 … Page 4 | CV tab thumbnails |

### Placeholder and help

| String | Source / notes |
|--------|----------------|
| e.g. (skill AND location) NOT agency | Search `placeholder` |
| Use AND, OR, and NOT with parentheses. Example: (Arabic OR UAE) AND cybersecurity. | Popup body |

### Select options (filters)

| String | Notes |
|--------|--------|
| All stages | Stage filter |
| New, Review, Screen, Interview, Offer | Stage values (also used as badge text) |
| All sources | Source filter |
| Career site, LinkedIn, Referral, Agency | Source values |
| None | Saved filter default |
| GCC nationals, 5+ years security | Saved filter option |
| In Screen this week | Saved filter option |

### Headings and hub chrome

| String | Notes |
|--------|--------|
| Candidates | `COPY.candidatesTitle` |
| Requisitions, Candidates, Offers, Analytics | `HUB_TABS` + page titles |
| Recruiting | `WorkdayLeftTabBar` `secondaryTitle` |
| R-2026-4410 · Riyadh, KSA · Hybrid | `secondarySubtitle` (from mock req) |
| Pending approval | Offers KPI card |
| Accepted (30 days) | Offers KPI card |
| Role, Status | Offers table headers |
| Time in Screen (median) | Analytics card |
| Pass-through rate | Analytics card |
| Sourcing mix | Analytics card |
| Career site 42% · LinkedIn 28% · Referral 21% · Agency 9% | Analytics body |

### Requisitions tab (mock table)

| String | Notes |
|--------|--------|
| Requisition, Location, Stage, Candidates | Column headers |
| Riyadh / Dubai | Cell |
| Principal consultant — Qatar LNG | Mock req title |
| R-2026-3981 | Mock req id |
| Doha | Cell |

### Selection and counts

| String | Notes |
|--------|--------|
| {n} selected | Dynamic, e.g. `3 selected` |
| Select all candidates in view | Checkbox `aria-label` |
| Select {displayName} | Row checkbox `aria-label` |

### Modal tabs

| String | Notes |
|--------|--------|
| Overview | Tab |
| CV preview | Tab |
| Activity timeline | Tab |
| Notes | Tab |

### Timeline and notes (mock content)

| String | Notes |
|--------|--------|
| Application history | Card title |
| 19 March 2026 — Moved to {stage} by you | Timeline line (stage from data) |
| 12 March 2026 — Application submitted | Timeline line |
| 8 March 2026 — Sourced from {source} | Timeline line |
| Recruiter notes | Card title |
| Strong GCC enterprise references; confirm notice period. | Note body |
| Phone screen scheduled — panel availability TBC. | Note body |

### Error messages (banners)

| String | Source |
|--------|--------|
| We can't load this CV. Open the CV in a new tab or try again later. | `COPY.errorCv` |
| We can't open this candidate. Refresh the list or return to the grid. | `COPY.errorMissing` (defined; confirm not wired in this file — **not observed in JSX paths read**) |
| We can't load candidates right now. Check your connection and refresh. | `COPY.errorGrid` |

### Empty states

| String | Source |
|--------|--------|
| No candidates match your filters. Clear or adjust filters. | `COPY.emptyGrid` |

### Loading states

| String | Source |
|--------|--------|
| Loading candidate profile… | `COPY.loadingProfile` |
| Loading CV… | `COPY.loadingCv` — **defined in `COPY` only; not referenced in JSX (dead string)** |

### Informational / privacy / anonymisation

| String | Source |
|--------|--------|
| Candidate data is processed in line with your organisation privacy notice and the consent provided when the candidate applied. | `COPY.gdprNotice` |
| Anonymised review mode active per Works Council agreement | `COPY.anonymisedBanner` |
| Some details are hidden for this candidate based on your organisation's screening settings. | `COPY.hiddenDetails` — overview + CV tab banner |

### Dynamic and symbolic display

| String | Notes |
|--------|--------|
| Candidate A{100+index} | `anonymisedLabel()` when `mode=anonymised` |
| — | Em dash placeholder in anonymised cells / subtitle |
| {selectedIndex + 1} of {sortedRows.length} | Modal position indicator |
| Match score {n}% | Modal subtitle (non-anonymised) |
| Skill pills | From row data (e.g. Zero trust, GDPR programmes) |
| Mock profile / CV body | `defaultProfile` — includes "Illustrative experience for prototype…", degree line, EXPERIENCE / EDUCATION / SKILLS blocks |

### REQ metadata under title (mock)

| String | Notes |
|--------|--------|
| R-2026-4410 · Senior cybersecurity engineer — GCC nationalisation programme | `MOCK_REQ.id` · `MOCK_REQ.title` |
| Riyadh, KSA · Hybrid | `MOCK_REQ.location` |

---

## Section 2: Editorial guidelines check

Legend: **Pass** = meets sentence case, British English (where applicable), active voice, and clarity; **Minor** = improve when convenient; **Fail** = fix before **330** / production capture.

### `COPY` constant (implemented in UI)

| String | Verdict | Notes |
|--------|---------|--------|
| Previous candidate | Pass | Sentence case; clear AT label |
| Next candidate | Pass | Same |
| **Move to Screen** | **Fail** | Title Case on "Screen". Per 319 / Editorial: **Move to screen** |
| Reject candidate | Pass | Verb + noun, sentence case |
| Close | Pass | |
| Open CV | Pass | Acronym CV acceptable |
| Open full profile | Pass | |
| Clear filters | Pass | |
| Save filter | Pass | |
| Apply filters | Pass | |
| Search candidates | Pass | |
| Boolean search tips | Pass | |
| We can't load this CV. Open the CV in a new tab or try again later. | Pass | Problem + next step |
| We can't open this candidate. Refresh the list or return to the grid. | Pass | (If wired later, same quality) |
| We can't load candidates right now. Check your connection and refresh. | Pass | |
| No candidates match your filters. Clear or adjust filters. | Pass | Actionable |
| Loading candidate profile… | Pass | Present continuous; ellipsis consistent |
| Loading CV… | N/A in UI | Not surfaced — remove or wire to avoid drift |
| Some details are hidden for this candidate based on your organisation's screening settings. | Pass | British **organisation's** correct |
| Stage, Applied date, Source, Match score, Location, Name | Pass | |
| Saved filters, Candidates, Candidate, CV | Pass | |
| Anonymised review mode active per Works Council agreement | Minor | **Works council** is often lower case in UK editorial unless starting a sentence; acceptable for DE context but consider **works council** for consistency with British editorial |
| **Candidate data is processed in line with your organisation privacy notice and the consent provided when the candidate applied.** | **Fail** | Missing possessive: **your organisation's privacy notice**. Also ensure product/legal own the factual claim on consent (see 060) |

### Inline headings and chrome

| String | Verdict | Notes |
|--------|---------|--------|
| Filters and search | Pass | Sentence case |
| Boolean search | Pass | |
| Popup help body | Pass | Clear; Boolean operators expected for audience |
| Requisitions / Offers / Analytics (page titles) | Pass | Single-word / standard hub titles |
| **Time in Screen (median)** | Minor | Prefer **Time in screen (median)** for strict sentence case (or **Time in Screen** if "Screen" is a formal stage name — align with product term) |
| Pass-through rate, Sourcing mix | Pass | |
| Overview, CV preview, Activity timeline, Notes | Pass | |
| Contact, Experience, Education, Skills, Pages, Page n | Pass | |
| Application history, Recruiter notes | Pass | |
| Pending approval, Accepted (30 days) | Pass | |
| Role, Status | Pass | |
| Select options (All stages, All sources, etc.) | Pass | |
| Mock narrative (timeline, notes, analytics percentages) | Pass | Illustrative; British date format in timeline |

### Duplication / UX (editorial-adjacent)

| Issue | Verdict | Notes |
|-------|---------|--------|
| **Saved filters** repeated as card title and adjacent field label | Minor | Consider one visible label + `aria-labelledby` or visually hidden label to reduce redundancy |

---

## Section 3: Legal-sensitive copy (060 review)

**060 invoked for:** (1) GDPR / processing notice, (2) anonymisation / Works Council banner, (3) reference to consent and privacy notice, (4) screening / hidden details messaging.

### 060 — String 1: GDPR notice (`COPY.gdprNotice`)

**Text (as implemented):**  
Candidate data is processed in line with your organisation privacy notice and the consent provided when the candidate applied.

**Legal & compliance assessment (recruiter-facing informational line)**

- **Applicable:** GDPR Arts 5, 13–14 (transparency); employer remains controller for customer tenant — wording should not misstate Workday vs customer roles without product definition.
- **Risk level:** Medium (prototype copy — must not be shipped as final without alignment to actual privacy notice and lawful basis text).
- **Findings:**
  - **Grammar:** Add **organisation's** before "privacy notice" for clarity and professionalism.
  - **Accuracy:** "The consent provided when the candidate applied" may be **over-broad** — lawful basis varies (consent, legitimate interest, employment context). Product and Legal should align this line with tenant-configurable notices and actual application flow.
  - **Transparency:** For a **recruiter-only** view, short pointer copy is acceptable **if** it mirrors or links to the full notice; consider adding **link affordance** in product ("View privacy notice") — out of scope for this string alone but flag for build.
- **060 status:** **Passed for prototype** with **mandatory** grammar fix and **legal/product sign-off** before GA.

### 060 — String 2: Anonymisation banner (`COPY.anonymisedBanner`)

**Text:** Anonymised review mode active per Works Council agreement

- **Applicable:** Co-determination / DE fairness context; not a substitute for DPIA or agreement text.
- **Risk level:** Low–medium — must not imply legal adequacy beyond what the customer has agreed.
- **Findings:** Clear, factual tone. **Works council** capitalisation optional. Ensure real product ties this banner to **tenant configuration** and the actual agreement reference (not generic).
- **060 status:** **Passed for prototype** with sign-off for production wording and configuration behaviour.

### 060 — String 3: Hidden details (`COPY.hiddenDetails`)

**Text:** Some details are hidden for this candidate based on your organisation's screening settings.

- **Applicable:** GDPR data minimisation / purpose limitation; transparency to internal users.
- **Risk level:** Low.
- **Findings:** Accurate framing; **organisation's** correct. Good alignment with internal transparency.
- **060 status:** **Passed.**

### 060 — Overall

| Item | 060 result |
|------|------------|
| GDPR notice | Passed with conditions (grammar + substance review with Legal/PM) |
| Anonymisation banner | Passed with conditions (tie to real agreements / config) |
| Hidden details | Passed |
| **Aggregate 060** | **Passed** (prototype-appropriate — **not** waiver for production legal review) |

---

## Section 4: Recommendations

### Critical fixes (block 330 until resolved in source)

1. **Move to Screen → Move to screen** (`COPY.moveToScreen`) — Editorial sentence case.
2. **your organisation privacy notice → your organisation's privacy notice** (`COPY.gdprNotice`) — Grammar + aligns with transparency expectations.

### Optional improvements

1. **Time in Screen (median)** → **Time in stage: Screen (median)** or **Time in screen (median)** — align with product vocabulary for pipeline stages.
2. **Works Council → works council** if style guide prefers lower case for generic council reference.
3. Remove or implement **`COPY.loadingCv`** to avoid orphaned approved copy.
4. Reduce duplicate **Saved filters** label / heading.
5. Wire or remove **`COPY.errorMissing`** if it remains dead code.

### Overall verdict

**NEEDS REVISION** — two **Fail**-level editorial items (**Move to screen**, **organisation's privacy notice**) must be corrected in `design/gcc-candidate-grid-v46.tsx` before treating the prototype as aligned with 319 for Figma capture. **060** assessment: **passed** for prototype purposes with conditions noted above.

---

## Orchestrator summary

| Item | Value |
|------|--------|
| **Copy review file** | `design/gcc-candidate-grid-v46-copy-review.md` |
| **Strings catalogued** | **~92** user-visible strings (including hub tabs, mock table content, aria-labels, placeholders, and dynamic patterns); **`COPY` keys rendered:** **30** of **31** (`loadingCv` not surfaced) |
| **Issues** | **Critical / fail:** **2** (sentence case on primary CTA; GDPR line possessive + 060 substance note). **Minor:** **4** (Works Council casing, Time in Screen heading, Saved filters duplication, dead `loadingCv` / `errorMissing`) |
| **060 review** | **Passed** (with grammar fix and production sign-off conditions) |
| **Final verdict** | **NEEDS REVISION** until the two critical copy fixes are applied in the TSX file |

---

*319 spot-check complete. Hand back to **320** for string updates, then **330** when verdict can be set to **APPROVED**.*
