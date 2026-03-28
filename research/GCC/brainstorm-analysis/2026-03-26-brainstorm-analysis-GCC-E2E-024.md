# GCC brainstorm synthesis (106) — P&T Idea Dashboard (Talent Acquisition filter)

## Fresh pass attestation

- **Mission ID:** GCC-E2E-024
- **Target region:** GCC (orchestrator scope). **Source caveat:** The workbook is a **global** Qualtrics P&T Idea Results Dashboard export (not GCC-only session notes). **Tier 1:** file lives under `research/GCC/brainstorm-sessions/`. **Tier 3:** no GCC keywords in filename; dashboard text is worldwide customer and internal feedback. Treat findings as **internal P&T hypothesis signals for Talent Acquisition**, to be **validated against GCC customer transcripts (105)** and **120** triangulation, not as GCC-specific facts.
- **Brainstorm source files read (this run):**
  - `research/GCC/brainstorm-sessions/P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` (Tier 1: folder match; **region-ambiguous global P&T export**)
- **Scratch dump (mandatory for spreadsheets):** `research/GCC/brainstorm-analysis/_scratch-brainstorm-sources-GCC-E2E-024.md` (produced via `python3 scripts/dump_research_folder_to_text.py`)
- **Files excluded (region mismatch):** None (only one in-scope file in folder; `.gitkeep` ignored by dump script)
- **Dashboard filter applied in export (read from sheets):** Product Features Model: **Talent Management → Talent Acquisition**, **N = 9,922** idea records (Ideas Volume / linked widgets).
- **Completed (UTC):** 26 March 2026

---

## Executive summary

- **9,922** P&T ideas sit under the **Talent Acquisition** product-area filter in this export; sentiment for the **Talent Acquisition** row is **negative** (~**-0.164**), and **effort** is strongly negative (~**-1.23**), meaning contributors rate ideas in this space as **hard to deliver** as well as **frustration-weighted** (dashboard semantics: verify with Qualtrics field definitions if you need a strict sign convention).
- **Highest-volume product capabilities** in the TA slice include **Communications and Notifications**, **Job Requisitions**, **Candidate Job Application Flow**, and **Candidates and Prospects**; all show **negative sentiment** and **negative effort** in the capability table.
- Verbatim traffic is dominated by **Primary_Goal** and **Concatenated_Comments**, plus **Workaround**-tagged rows (**991**), which is a strong signal for **120** to compare with customer **workaround** language in **105**.
- Sample verbatims (Idea Question Responses) cluster around **application questionnaire configurability**, **candidate pool deletion vs inactivation**, **application help text and international name formats**, **candidate grid configuration limits**, **job application progress indicator / accessibility**, **custom fields on job requisition templates**, **offer document naming**, and **DocuSign friction in req approval** — several overlap **GCC interview / compliance / candidate experience** themes from **105**, but this file does **not** prove GCC prevalence; use **120** to triangulate.

## Session inventory

| Session / artefact | Type | Date (export) | Participants | Notes |
|--------------------|------|---------------|--------------|-------|
| `P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` | Qualtrics P&T dashboard export (multi-sheet) | 03/11/2026 9:59 AM on sheets | Owners **pavithra.krishna@workday.com** / **cynthia.johnson@workday.com** on filter pages | **25** sheets; global **N = 51,007** on unfiltered product-line pages; **9,922** under TA linked filter |

## Hypotheses table

| # | Hypothesis (testable) | Source (sheet / row kind) | How to validate / falsify |
|---|------------------------|----------------------------|---------------------------|
| H1 | Recruiters need **per-question control** of job application questionnaires at requisition level (not only whole-questionnaire assignment). | Idea Question Responses; Customer Idea example row | **105:** ask if GCC customers duplicate questionnaires or work around; **120:** theme vs **Compliance-Data-Privacy** / **Job-Application-Process**. |
| H2 | **Candidate pools** should support **hard delete** (or equivalent) to match Talent pool behaviour and support data hygiene. | Idea Question Responses (candidate pool deletion asks) | **105 / legal:** retention vs delete; **101:** competitor pool UX if relevant. |
| H3 | **External application “My Information”** needs configurable help text for **legal name / last name** edge cases (e.g. India, Singapore, Hong Kong, China). | Idea Question Responses | **105:** already strong GCC/APAC angle in some quotes; confirm GCC-specific prevalence vs global. |
| H4 | **Job application progress indicator** misleads users about completed steps; impacts **accessibility** and drop-off. | Idea Question Responses (progress indicator rows) | Quant funnel metrics if available; usability study; compare to **Paradox** / mobile apply narrative. |
| H5 | **Custom fields on job requisition templates** (or custom object linkage) reduce bottlenecks and extra “additional data” steps. | Idea Question Responses | Functional feasibility (@functional-knowledge); **120** tie to **req approval** friction. |
| H6 | **Candidate Grid** needs **label overrides for Group Columns** when many questionnaire columns are grouped (scale limit **16** called out in text). | Idea Question Responses | Design / CK pattern review (**315/320**); confirm with customer examples. |
| H7 | **Offer letter document naming** should support **dynamic fields** in filenames for audit and search. | Idea Question Responses | **060** if retention/audit; ops workflow validation. |
| H8 | **DocuSign** (or e-sign) forces users to **pause req approval** and manually shuttle documents (**8+ hours** cited in snippet). | Idea Question Responses | Process mining or CS tickets; **080** risk on approval workflows. |

## Strategic themes ( **[Brainstorm]** codes )

- **[Brainstorm] Application-Config-Questionnaire** — Selective questions on reqs; overlaps **Candidate Job Application Flow** volume.
- **[Brainstorm] Pool-Lifecycle-Parity** — Delete vs inactivate candidate pools; alignment with Talent module behaviour.
- **[Brainstorm] App-UX-International-Names** — Help text and mandatory field guidance for cross-border candidates.
- **[Brainstorm] App-Flow-Progress-Truth** — Progress indicator accuracy and accessibility.
- **[Brainstorm] Req-Template-CustomFields** — Custom fields / custom objects on requisition templates.
- **[Brainstorm] Grid-Column-Label-Override** — Candidate grid grouping and questionnaire column limits.
- **[Brainstorm] Offer-Doc-Naming-Dynamic** — Filename patterns with candidate and date tokens.
- **[Brainstorm] Req-Approval-Esign-Friction** — Pause-and-resume approval with external e-sign.

**Evidence:** Representative verbatim fragments are in the Idea Question Responses sheet (see scratch dump); the Customer Idea sheet in this export contains **one** illustrative document row (job application questionnaire flexibility).

## Cross-functional alignment matrix (evidence-based, not a survey)

Themes from hypotheses; cells show **Align** / **Tension** / **Not mentioned** based on **roles named in verbatims** only.

| Theme | PM | Eng | Design | Sales / CS | Other |
|-------|-----|-----|--------|------------|--------|
| Questionnaire configurability | Align (recruiter-facing) | Not mentioned | Not mentioned | Not mentioned | HRIS cited |
| Candidate pool delete | Align (recruiters) | Not mentioned | Not mentioned | Not mentioned | Talent vs Recruiting module **Tension** in text |
| Application help text / names | Align | Not mentioned | Align (a11y / UX) | Not mentioned | **India, Singapore, Hong Kong, China** called out |
| Progress indicator | Align | Not mentioned | Align (a11y) | Not mentioned | Applicants cited |
| Req template custom fields | Align | Align (custom object) | Not mentioned | Not mentioned | Not mentioned |
| Grid group column labels | Align | Not mentioned | Align | Not mentioned | System Administrator cited |
| Dynamic offer filenames | Align | Not mentioned | Not mentioned | Not mentioned | HR / audit implied |
| DocuSign pause | Align | Tension (integration) | Not mentioned | Align (time loss) | Not mentioned |

## Risks and blind spots

- **Global vs GCC:** This export is **not** a GCC brainstorm transcript; themes may **over-represent** large markets in P&T volume. **Do not** treat counts as GCC demand.
- **Selection bias:** P&T self-serve ideas skew toward **configurability** and **workarounds**; enterprise **compliance** (e.g. nationalisation) may be **under-represented** if customers route through CSMs instead.
- **Score interpretation:** Sentiment and effort are **modelled dashboard metrics**; confirm definitions before hard numeric claims in **130** slides.

## Recommendations for customer validation (105 / interviews)

- Probe **questionnaire granularity** on reqs vs library management cost.
- Ask how customers **retire candidate pools** and whether **inactivate** is blocking audits or hygiene.
- Validate **application progress** and **mobile** complaints in GCC segments.
- Cross-check **DocuSign / approval pause** with implementation partners in GCC.

## Handoff to 120 (top internal themes to cross-check)

1. **Application flow and questionnaire configurability** vs customer **scheduling / WhatsApp / nationalisation** priorities.
2. **Communications and notifications** volume and sentiment vs **messaging channel** gaps (**101** / **105**).
3. **Candidate Job Application Flow** and **Candidates and Prospects** (volume + effort) vs **candidate grid** and **pool** friction.
4. **Offers and employment agreements** and **document naming** vs **two-step offer** and **local document** realities.
5. **Interviews** capability slice vs **Paradox** and **scheduling** roadmap narrative.

---

## Appendix: Product capability volume / sentiment / effort (Talent Acquisition filter)

From sheet **Product Capability Volume, Sent** (Talent Management → Talent Acquisition, N = 9,922). Values copied from export rows.

| Product capability (model topic) | Volume | Sentiment | Effort |
|----------------------------------|--------|-----------|--------|
| Communications and Notifications | 1452 | -0.364 | -1.478 |
| Job Requisitions | 1397 | -0.226 | -1.039 |
| Candidate Job Application Flow | 1393 | -0.211 | -1.146 |
| Candidates and Prospects | 1212 | -0.205 | -1.545 |
| Offers and Employment Agreements | 922 | -0.248 | -1.533 |
| Job Application Process | 868 | -0.273 | -0.901 |
| Compliance and Data Privacy | 839 | -0.267 | -1.258 |
| Career Sites | 658 | -0.224 | -1.455 |
| Interviews | 476 | -0.165 | -1.480 |
| Job Postings | 445 | -0.212 | -0.962 |
| Screening and Assessments | 354 | -0.118 | -0.521 |
| Gen AI on Job Requisitions | 24 | -0.128 | +0.667 |

## Appendix: Verbatim type distribution (Brainstorm Question filter)

From sheet **Filter by Brainstorm Question** (TA filter, N = 9,922):

| Verbatim type | Volume |
|---------------|--------|
| Primary_Goal | 7132 |
| Concatenated_Comments | 4545 |
| Title | 4177 |
| Use_Cases | 1570 |
| Business_Value | 1352 |
| Role_Benefit | 1242 |
| Workaround | 991 |
| Proposed_Solution | 725 |
