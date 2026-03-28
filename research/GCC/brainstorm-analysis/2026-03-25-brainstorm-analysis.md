# GCC internal brainstorm synthesis (P&T Idea Results)

**Analysis date:** 25 March 2026  
**Agent:** 106 Brainstorm Analyser  
**Mission:** GCC-E2E-020  
**Scope:** Workday P&T Qualtrics idea export, **Talent Management → Talent Acquisition** linked filter on dashboard widgets (same workbook as Step 2.5 source of truth).

## Fresh pass attestation

- **Mission ID:** GCC-E2E-020
- **Target region:** GCC (Tier 1: sources under `research/GCC/brainstorm-sessions/`; workbook is global P&T, triangulate GCC in **105** / **120**)
- **Brainstorm source files read (this run):**
  - `research/GCC/brainstorm-sessions/P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` (Tier 1: folder match; all sheets flattened via script; interpreted for TA filter: Ideas Volume, capability volume / sentiment / effort, Customer Idea, Top Associated Words, Filter by Brainstorm Question, negative sentiment and hardest-effort capability tables, Idea Question Responses)
- **Scratch dump (this run):** `research/GCC/brainstorm-analysis/_scratch-brainstorm-sources.md` (from `python3 scripts/dump_research_folder_to_text.py research/GCC/brainstorm-sessions -o research/GCC/brainstorm-analysis/_scratch-brainstorm-sources.md` after `pip install -r scripts/requirements-research-xlsx.txt`)
- **Files excluded (region mismatch):** None
- **Completed (UTC):** 2026-03-25T18:45:00Z

## Executive summary

- **Volume:** The TA-filtered slice shows **N = 9,922** idea documents in the export run **03/11/2026 9:59 AM** (Qualtrics `copper.qualtrics.io`, `WorkdayProduction`). This is a strong internal **signal of where friction clusters**, not proof of GCC-specific customer demand.
- **Capability hotspots:** Highest-volume TA capabilities in the flatten include **Communications and Notifications** (1,452), **Job Requisitions** (1,397), **Candidate Job Application Flow** (1,393), **Candidates and Prospects** (1,212), and **Offers and Employment Agreements** (922). These five sit prominently in **negative sentiment** and **hardest effort** capability rankings in the same export.
- **Verbatim themes:** Free text in **Idea Question Responses** (sampled in full scratch read) repeats asks for **finer-grained questionnaire control on reqs**, **candidate pool lifecycle (delete vs inactivate)**, **external application UX** (help text, name fields for jurisdictions without legal surnames), **resume bundling on candidate pools**, **inline e-signature in req approval**, **accurate job-application progress**, **req template custom fields**, **dynamic offer document naming**, and **candidate grid group-column label overrides** (questionnaire density limits).
- **Triangulation need:** Long-form cells can be **cross-product** (reporting, calculated fields, security). **120** should treat TA-filtered **volume** as recruiting-relevant and **validate** each theme against **105** GCC transcripts, SME, and **101** parity before roadmap commitment.

## Session inventory

| Session / artefact | Source | Date (export) | Participants / owner (from export) | Notes |
|--------------------|--------|---------------|-----------------------------------|-------|
| P&T Idea Results Dashboard | `P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` | 03/11/2026 9:59 AM | Metadata includes `pavithra.krishna@workday.com`; scatter description references dashboard intent | Qualtrics-driven P&T line |
| TA-linked filter | Same workbook, linked filter on multiple sheets | As above | N/A | **Product Features Model: Talent Management → Talent Acquisition** |

**Data caveat:** **Filtered Idea Volume** can show **N = 0** / “No data available” under some widget wiring; interpret alongside **Ideas Volume** (9,922) and **Customer Idea** dataset volume (9,922) as dashboard behaviour, not as absence of TA ideas.

## Hypotheses table

| # | Hypothesis (testable) | Source (sheet / row signal) | How to validate or falsify |
|---|------------------------|----------------------------|----------------------------|
| H1 | Recruiters will adopt **per-question selection** on job application questionnaires at req level if it reduces HRIS rework | Customer Idea; Idea Question Responses | **105:** req setup tasks; time to publish; **101:** competitor application flexibility |
| H2 | **True delete** for candidate pools (vs inactivate only) reduces hygiene support burden without breaking compliance | Idea Question Responses | **060** + retention; pilot with audit trail; admin interviews |
| H3 | **Inline e-sign** in requisition approval (vs DocuSign round-trip) materially cuts cycle time | Idea Question Responses | Workflow timing; integration feasibility; **101** e-sign parity |
| H4 | **Accurate multi-step progress** on external job application reduces drop-off | Idea Question Responses | Funnel analytics; **105** candidate journey |
| H5 | **Label override for candidate grid group columns** unlocks high-questionnaire tenants | Idea Question Responses | Admin configuration study; large-questionnaire desk checks |
| H6 | **Dynamic offer PDF naming** (candidate + date tokens) improves audit and HR ops efficiency | Idea Question Responses | Support volume; document management interviews |
| H7 | **Resume bundling on candidate pools** improves hiring-manager handoffs | Idea Question Responses | Pool vs req bundle usage; **105** collaboration themes |
| H8 | High **Communications and Notifications** volume with hard effort reflects **notification fatigue / configurability** gaps | Product Capability Volume + Hardest Effort | Preference research; message volume telemetry where available |

## Strategic themes (**[Brainstorm]** codes)

1. **[Brainstorm] Req-Questionnaire-Granularity**  
   Evidence: “Allow individual questions to be selected when creating a job requisition rather than an entire questionnaire”; similar req-level pick-and-mix wording in Idea Question Responses.

2. **[Brainstorm] CandidatePool-Lifecycle**  
   Evidence: Request to **delete** candidate pools (contrast with inactivate); resume bundling on pools for HM sharing.

3. **[Brainstorm] Application-UX-Trust**  
   Evidence: Help text on external application **My Information**; last-name guidance for India / Singapore / Hong Kong / China; progress indicator accuracy.

4. **[Brainstorm] Req-Approval-Integration**  
   Evidence: DocuSign detour from req approval; desire for **in-line** signing.

5. **[Brainstorm] Offer-Docs-Operational**  
   Evidence: Dynamic fields in offer document filenames; high volume of offer-related ideas and manual rename risk.

6. **[Brainstorm] Recruiter-Grid-Config-Scale**  
   Evidence: Candidate grid **group column** label override; limits on grouped questionnaire fields.

7. **[Brainstorm] Req-Template-CustomFields**  
   Evidence: Custom fields on **job requisition template** vs additional-data workaround.

8. **[Brainstorm] Comms-Volume-Pain**  
   Evidence: **Communications and Notifications** leads TA capability volume (1,452) and ranks high on negative sentiment and hardest effort in this export.

**Associated language (bigrams, TA filter):** **Top Associated Words** in the scratch include patterns such as Requisition / Job, Application / Job, Experience / Candidate, Profile / Candidate, Team / Recruiting, Candidate / External or Internal, consistent with req, application, and candidate-journey focus.

**Verbatim mix (Filter by Brainstorm Question):** Primary_Goal, Concatenated_Comments, Title, Use_Cases, Business_Value, Role_Benefit, Workaround, Proposed_Solution appear at scale for the TA slice (counts visible on **Filter by Brainstorm Question** sheet in scratch).

## Cross-functional alignment matrix

*Cells reflect **explicit roles or functions** named in sampled verbatims, else **Not mentioned**. Volume / sentiment columns are **product-model signals**, not org votes.*

| Theme / hypothesis | PM | Eng | Design | Sales / CS | Other |
|--------------------|----|-----|--------|------------|-------|
| Req questionnaire granularity | Align (backlog signal) | Tension (data model + security) | Align (req + application UX) | Not mentioned | **HRIS** cited in snippets |
| Candidate pool delete | Align | Tension (purge / audit) | Align (admin clarity) | Not mentioned | Recruiters / ops |
| Inline e-sign on req approval | Align | Tension (integrations) | Align (approval UX) | Not mentioned | DocuSign workflow |
| Application progress accuracy | Align | Tension (statefulness) | Align (candidate trust) | Not mentioned | Not mentioned |
| Grid group column overrides | Align | Tension (limits) | Align (dense grid) | Not mentioned | **System Administrators** cited |
| Dynamic offer naming | Align | Align (document gen) | Not mentioned | Not mentioned | HR / compliance |
| Communications volume pain | Align | Tension (platform scale) | Align (notification UX) | Not mentioned | Not mentioned |

## Risks and blind spots

- **Geography:** Export is **global P&T**, not GCC-labelled. GCC-specific validation must come from **105** and SME, not this file alone.
- **Mixed content:** Some **Idea Question Responses** cells are **non-recruiting** (learning, security, reporting). TA filter still yields recruiting-heavy capability distribution; row-level “pure TA” would need Qualtrics re-pull or ID join.
- **Sentiment / effort indices:** Numeric sentiment and effort are **model outputs**; use for **relative ranking**, not as customer NPS.
- **Filtered Idea Volume = 0:** Treat as dashboard artefact where present; do not infer zero ideas.

## Recommendations for customer validation (105 / interviews)

- **Req-level questionnaire pick-and-mix:** Shadow req creation with 2 enterprise TA teams; count HRIS exceptions.
- **Candidate pools:** Admin interview on **retention vs delete**; map to purge and legal hold (**060** if pursued).
- **Application progress and help text:** Short candidate usability sessions on multi-step external apply.
- **Offer document naming and e-sign in approval:** Ops interview with high-volume offer teams.
- **Communications / notifications:** Recruiter diary study on inbox and task noise.

## Handoff to **120** (top themes to triangulate)

1. **[Brainstorm] Req-Questionnaire-Granularity** vs **105** themes on application and configuration load.  
2. **[Brainstorm] Application-UX-Trust** (progress, help text, names) vs **105** candidate and recruiter friction.  
3. **[Brainstorm] Comms-Volume-Pain** vs **105** messaging themes and **101** competitor comms parity.  
4. **[Brainstorm] CandidatePool-Lifecycle** and resume bundling vs **105** collaboration and pipeline hygiene.  
5. **[Brainstorm] Req-Approval-Integration** (e-sign) vs **101** workflow / integration gaps.

---

*Internal brainstorm and P&T idea volume are **hypotheses to validate** with customer research, win-loss, and competitive evidence.*
