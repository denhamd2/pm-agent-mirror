# GCC brainstorm synthesis (106) — P&T Idea Dashboard (Talent Acquisition filter)

## Fresh pass attestation

- **Mission ID:** GCC-E2E-025
- **Target region:** GCC (orchestrator scope). **Source caveat:** The workbook is a **global** Qualtrics P&T Idea Results Dashboard export (not GCC-only session notes). **Tier 1:** file lives under `research/GCC/brainstorm-sessions/`. **Tier 3:** no GCC keywords in filename; dashboard text is worldwide customer and internal feedback. Treat findings as **internal P&T hypothesis signals for Talent Acquisition**, to be **validated against GCC customer transcripts (105)** and **120** triangulation, not as GCC-specific facts.
- **Brainstorm source files read (this run):**
  - `research/GCC/brainstorm-sessions/P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` (Tier 1: folder match; **region-ambiguous global P&T export**)
- **Scratch dump (mandatory for spreadsheets):** `research/GCC/brainstorm-analysis/_scratch-brainstorm-sources-GCC-E2E-025.md` (produced via `python3 scripts/dump_research_folder_to_text.py research/GCC/brainstorm-sessions -o …`; dependencies: `python3 -m pip install -r scripts/requirements-research-xlsx.txt`)
- **Files excluded (region mismatch):** None (only one in-scope file in folder; `.gitkeep` ignored by dump script)
- **Dashboard filter applied in export (read from sheets):** Product Features Model: **Talent Management → Talent Acquisition**, **N = 9,922** idea records (Ideas Volume / linked widgets). Unfiltered product-area baseline **N = 51,007** (Filter Page by Product Area).
- **Completed (UTC):** 2026-03-27T00:00:00Z (analysis run; export date on sheets **03/11/2026 9:59 AM**)

---

## Executive summary

- **9,922** P&T ideas sit under the **Talent Acquisition** product-area filter in this export. On **Sentiment- Product Area** (Talent Acquisition aggregate), **negative** bucket share is **~0.527** with **~5,233** ideas and modelled sentiment **~-1.918** (positive bucket **~0.395**, **~3,917** ideas, **~1.964**); overall **neutral** row shows **N = 9,922** and **~-0.164** sentiment (dashboard semantics: confirm field definitions before executive numeric claims).
- **Product Capability Volume, Sentiment and Effort** (Talent Acquisition model topics) shows **highest volume** in **Communications and Notifications**, **Job Requisitions**, **Candidate Job Application Flow**, and **Candidates and Prospects**; sentiment and effort remain **negative** on those rows in this export.
- Verbatim-type distribution (**Filter by Brainstorm Question**, TA filter) is dominated by **Primary_Goal** (**7,132**), **Concatenated_Comments** (**4,545**), and **Workaround** (**991**), a strong **120** triangulation signal against customer **workaround** language in **105**.
- Fresh keyword scans of **Idea Question Responses** (this run) surface recurring internal themes: **application questionnaire flexibility**, **candidate pool delete vs inactivate**, **DocuSign pause in req approval**, **application progress indicator accuracy**, **candidate grid group column label overrides**, **dynamic offer document naming**, and **name-format / legal name guidance** — overlap with **105** GCC narratives is **possible** but **not proven** by this file alone.

## Session inventory

| Session / artefact | Type | Date (export) | Participants | Notes |
|--------------------|------|---------------|--------------|-------|
| `P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` | Qualtrics P&T dashboard export (multi-sheet) | 03/11/2026 9:59 AM on sheets | Owners **pavithra.krishna@workday.com** (widgets); **cynthia.johnson@workday.com** (filter page) | **25** sheets; **9,922** under TA linked filter; **51,007** unfiltered product-area view |

## Hypotheses table

| # | Hypothesis (testable) | Source (sheet / row kind) | How to validate / falsify |
|---|------------------------|----------------------------|---------------------------|
| H1 | Recruiters need **per-question** control of job application questionnaires at requisition level (not only whole-questionnaire assignment). | Idea Question Responses | **105:** ask if GCC customers duplicate questionnaires or accept library sprawl; **120:** theme vs **Compliance-Data-Privacy** / **Job-Application-Process**. |
| H2 | **Candidate pools** should support **hard delete** (or equivalent) to align with Talent pool behaviour and support data hygiene. | Idea Question Responses | **105 / legal:** retention vs delete; **101:** competitor pool UX if relevant. |
| H3 | **External application** flows need clearer **help text** and **name field** behaviour for international legal names (downstream payroll accuracy). | Idea Question Responses | **105:** GCC vs global prevalence; **060** if special-category data. |
| H4 | **Job application progress indicator** misleads users about completed steps; impacts **accessibility** and perceived data loss. | Idea Question Responses | Quant funnel metrics if available; usability study; compare to **Paradox** / mobile apply narrative. |
| H5 | **Custom fields on job requisition templates** reduce bottlenecks vs **additional data** steps. | Idea Question Responses | Functional feasibility (@functional-knowledge); **120** tie to **req approval** friction. |
| H6 | **Candidate Grid** needs **label overrides for Group Columns** when many questionnaire columns are grouped (scale limits cited in text). | Idea Question Responses | Design / CK pattern review (**315/320**); confirm with customer examples. |
| H7 | **Offer letter document naming** should support **dynamic fields** in filenames for audit and search. | Idea Question Responses | **060** if retention/audit; ops workflow validation. |
| H8 | **DocuSign** (or e-sign) forces users to **pause req approval** and manually shuttle documents (**8–24 hours** cited in verbatim). | Idea Question Responses | Process mining or CS tickets; **080** risk on approval workflows. |

## Strategic themes (**[Brainstorm]** codes)

- **[Brainstorm] Application-Config-Questionnaire** — Selective questions on reqs; overlaps **Candidate Job Application Flow** volume.
- **[Brainstorm] Pool-Lifecycle-Parity** — Delete vs inactivate candidate pools; alignment with Talent module behaviour.
- **[Brainstorm] App-UX-International-Names** — Help text and mandatory field guidance for cross-border candidates.
- **[Brainstorm] App-Flow-Progress-Truth** — Progress indicator accuracy and accessibility.
- **[Brainstorm] Req-Template-CustomFields** — Custom fields / custom objects on requisition templates.
- **[Brainstorm] Grid-Column-Label-Override** — Candidate grid grouping and questionnaire column limits.
- **[Brainstorm] Offer-Doc-Naming-Dynamic** — Filename patterns with candidate and date tokens.
- **[Brainstorm] Req-Approval-Esign-Friction** — Pause-and-resume approval with external e-sign.

**Evidence:** Representative verbatim fragments are in the **Idea Question Responses** sheet (see scratch dump and fresh keyword extraction this run).

## Cross-functional alignment matrix (evidence-based, not a survey)

Themes from hypotheses; cells show **Align** / **Tension** / **Not mentioned** based on **roles or functions implied in verbatims** only.

| Theme | PM | Eng | Design | Sales / CS | Other |
|-------|-----|-----|--------|------------|--------|
| Questionnaire configurability | Align (recruiter-facing) | Not mentioned | Not mentioned | Not mentioned | HRIS / process implied |
| Candidate pool delete | Align (recruiters) | Not mentioned | Not mentioned | Not mentioned | Talent vs Recruiting module **Tension** in text |
| Application help text / names | Align | Not mentioned | Align (a11y / UX) | Not mentioned | Payroll / downstream systems cited |
| Progress indicator | Align | Not mentioned | Align (a11y) | Not mentioned | Applicant experience cited |
| Req template custom fields | Align | Align (custom object) | Not mentioned | Not mentioned | Not mentioned |
| Grid group column labels | Align | Not mentioned | Align | Not mentioned | Grid configuration / admin cited |
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

From sheet **Product Capability Volume, Sent** (Talent Management → Talent Acquisition, **N = 9,922**). Values re-read from workbook **27 March 2026** (rounded for readability).

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

From sheet **Filter by Brainstorm Question** (TA filter, **N = 9,922**):

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
