# Brainstorm Analysis: GCC P&T Ideation (Qualtrics export)

**Mission:** GCC-E2E-022 (GCC E2E Step 2.5)  
**Analysis date:** 26 March 2026  
**Analyst role:** 106 Brainstorm Analyser

## Fresh pass attestation

- **Mission ID:** GCC-E2E-022
- **Target region:** GCC (folder-scoped sources; see regional caveat below)
- **Scratch dump (this run):** `research/GCC/brainstorm-analysis/_scratch-brainstorm-sources.md` (flattened text for all in-scope files via `python3 scripts/dump_research_folder_to_text.py research/GCC/brainstorm-sessions -o …`)
- **Brainstorm source files read (this run):**
  - `research/GCC/brainstorm-sessions/P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` (Tier 1: folder match; Qualtrics **P&T Idea Results** dashboard export, run **03/11/2026 9:59 AM** UTC context per export; linked filter **Talent Management → Talent Acquisition** where stated on sheets)
- **Files excluded (region mismatch):** None (only `.gitkeep` and the workbook were present; `.gitkeep` ignored by dump script)
- **Regional caveat:** Cell text in **Idea Question Responses** was scanned for GCC geography tokens (e.g. GCC, Gulf, Saudi, UAE, Nitaqat, Mudad, Qiwa, nationalisation). **No matches** were found. One row references **UK, India, USA** for event roster users. Treat internal themes below as **global Talent Acquisition** pressure, to be **cross-checked with GCC customer transcripts (105)** and SME input in **120**, not as GCC-specific proof.
- **Dependencies:** `python3 -m pip install -r scripts/requirements-research-xlsx.txt` (pandas / openpyxl stack) before dump
- **Completed (UTC):** 2026-03-26T10:16:43Z

---

## Executive summary

• The only in-scope source is a **Qualtrics Copper** export of the **P&T Idea Results Dashboard** (March 2026 snapshot), filtered in the workbook to **Talent Management → Talent Acquisition**, with **N = 9,922** ideas at dashboard level.  
• **Product Capability Volume** (same filter) shows highest idea volume in **Communications and Notifications**, **Job Requisitions**, **Candidate Job Application Flow**, and **Candidates and Prospects**; sentiment and effort indices are **negative** on those rows (internal frustration / perceived difficulty signals, not customer NPS).  
• Verbatim **Idea Question Responses** (125 rows in the export) mix recruiting and non-recruiting product areas; **68 rows** match recruiting-related keywords. Hypotheses cluster around **application UX**, **candidate pool lifecycle**, **req and document workflow**, **HiredScore labelling**, and **integrations** (e.g. LinkedIn export context).  
• **Customer Idea** widget data in this export contains **one** newest document row (questionnaire flexibility on reqs); deeper ideation content lives in **Idea Question Responses** and aggregate capability tables.  
• For **120** triangulation: use this file as **Internal Team (106)** input; **do not** infer GCC market fit without **105** and competitive (**101**) evidence.

## Session inventory

| Source | Type | Notes |
|--------|------|--------|
| `P&T Idea Results Dashboard_03_11_2026 9_59 AM.xlsx` | Qualtrics dashboard export | Multiple sheets: filter metadata, **Ideas Volume**, **Product Capability Volume, Sentiment and Effort**, **Top Associated Words**, **Idea Question Responses**, sentiment/effort breakdowns, etc. |
| **Participants** | Not stated per row | Roles inferred from text (Recruiter, HRIS, Hiring Manager, Administrator, etc.) |

## Aggregate signals (Talent Acquisition filter)

From sheet **Product Capability Volume, Sentiment and Effort (Model Topics)** (Top 3000 / N=9922, linked filter Talent Acquisition), capability rows include:

| Product capability (topic) | Volume | Sentiment (index) | Effort (index) |
|----------------------------|--------|-------------------|----------------|
| Communications and Notifications | 1,452 | -0.364 | -1.478 |
| Job Requisitions | 1,397 | -0.226 | -1.039 |
| Candidate Job Application Flow | 1,393 | -0.211 | -1.146 |
| Candidates and Prospects | 1,212 | -0.205 | -1.545 |
| Offers and Employment Agreements | 922 | -0.248 | -1.533 |
| Job Application Process | 868 | -0.273 | -0.901 |
| Compliance and Data Privacy | 839 | -0.267 | -1.258 |
| Career Sites | 658 | -0.224 | -1.455 |
| Interviews | 476 | -0.165 | -1.480 |

**Interpretation [Brainstorm]:** Volume concentrates on **messaging/comms**, **reqs**, and **application/candidate** objects; negative sentiment/effort suggests internal contributors associate pain with these areas (hypothesis for validation, not a quantified customer metric).

**Top associated word pairs** (sheet **Top Associated Words**, same filter) include high-volume pairs such as **Help → Brainstorm**, **Requisition → Job**, **Application → Job**, **Profile → Job**, **Experience → Candidate**, **Team → Recruiting**, reinforcing focus on **guided experience** and **req/application** language.

## Hypotheses table

| # | Hypothesis (testable) | Source (sheet / row logic) | Suggested validation path |
|---|------------------------|----------------------------|---------------------------|
| H1 | Recruiters need **per-question** selection on job application questionnaires per requisition, not only whole questionnaires | Idea Question Responses rows 25–28; Customer Idea doc 9439007 | **105** interview: ask how customers configure questionnaires by role/region; check config limits in **050** / Deployment Agent |
| H2 | **Delete** (not only inactivate) **candidate pools** is required for data hygiene | Rows 34–37, 84–88 | Product analytics on pool counts; **105** GCC: retention vs deletion expectations |
| H3 | **My Information** on external application needs **help text**; **last-name** mandatory fields harm candidates in markets without legal surnames (example geos: India, Singapore, Hong Kong) | Rows 39–44 | **105** GCC: naming and ID fields; legal/compliance **060** |
| H4 | **Bundle resumes** from **candidate pools** (parity with job requisition) would improve hiring manager sharing | Rows 48–52 | Time-on-task study with recruiters; adoption if shipped |
| H5 | **Inline e-signature** with requisition approval (vs stop/start DocuSign) would cut cycle time (stated 8–24 hours) | Rows 53–54 | Process observation; integration feasibility |
| H6 | **Job application progress indicator** misstates completed steps; hurts accessibility and completion | Rows 59–63 | **105** candidate journey; UX benchmark |
| H7 | **Custom fields on job requisition template** (not only additional data) would reduce friction | Rows 64–68 | Implementation pattern review |
| H8 | **Dynamic naming** for offer (and similar) attachments reduces manual rename and audit risk | Rows 70–75 | **105** high-volume offer cycles |
| H9 | **Candidate grid**: **label override for group columns** needed beyond field overrides when many questionnaires drive column groups | Rows 77–81 | Admin interviews; grid limits |
| H10 | **Event roster** in Candidate Engagement needs archive/remove and cleaner comms to withdrawn candidates | Rows 90–94 | **105** event recruiting; **060** comms consent |
| H11 | **Terminated internal applicants** lose visibility of applications on candidate home; workaround (cancel/reapply) is harmful | Rows 95–101 | **105** worker-candidate edge cases |
| H12 | **LinkedIn export to Workday** should show **requisition number** so recruiters map candidates to the correct req among similar titles | Rows 110–113 | Recruiter task analysis |
| H13 | **HiredScore** should not show combined **Internal + Rehire** for **active** internal employees; reduces false follow-up | Rows 121–124 | TABP workflow review; HiredScore config |

## Strategic themes (codes)

- **[Brainstorm] AppQuest-Config-Flex** – Questionnaire and field configurability at req and application level (H1, H7, H9).  
- **[Brainstorm] Pool-Lifecycle-Hygiene** – Candidate pools, event rosters, duplication and withdrawal handling (H2, H10).  
- **[Brainstorm] CandExp-Truthful-UX** – Progress, help text, naming, post-termination access (H3, H6, H11).  
- **[Brainstorm] Recruiter-Throughput** – Bundling, LinkedIn export clarity, DocuSign inline, offer file naming (H4, H5, H8, H12).  
- **[Brainstorm] AI-Recruiting-Clarity** – HiredScore classification clarity for internal active workers (H13).  
- **[Brainstorm] Compliance-Comm-Volume** – **Compliance and Data Privacy** capability shows **839** ideas with negative sentiment/effort in the same TA slice; aligns with internal worry about regulatory and data handling (validate vs **105** / **060**).

**Evidence (illustrative quotes, anonymised):**  
• "Allow individual questions to be selected when creating a job requisition rather than an entire questionnaire."  
• "Only to inactivate a candidate pool in the Recruiting module. Could you please add a feature to delete a candidate pool?"  
• "Progress bar … will not indicate all progress made."  
• "Displaying the requisition number when exporting candidates to Workday from LinkedIn …"

## Cross-functional alignment matrix

Legend: **Align** = role benefits explicit; **Tension** = trade-off or conflict implied; **Not mentioned** = no signal in recruiting rows.

| Theme / hypothesis | PM | Eng | Design | Sales / CS | Notes |
|--------------------|----|-----|--------|------------|-------|
| H1 Question granularity | Align | Align | Align | Align | Config complexity vs flexibility |
| H2 Delete pools | Align | Align | Not mentioned | Align | Data retention vs hygiene **Tension** (purge/audit) |
| H3–H4 Candidate UX / pools | Align | Align | Align | Align | Regional naming **Tension** with one global template |
| H5 DocuSign inline | Align | Align | Not mentioned | Align | Integration **Tension** |
| H6 Progress bar | Align | Align | Align | Align | Accessibility called out in source |
| H9 Grid group overrides | Align | Align | Align | Not mentioned | Admin power vs supportability |
| H11 Terminated applicant | Align | Align | Align | Align | Security vs CX **Tension** |
| H13 HiredScore labels | Align | Align | Not mentioned | Align | AI clarity **060** |

## Risks and blind spots

• **Geography:** Corpus is **not GCC-labelled**; strongest regional hint is **APAC-style** naming (H3) and **UK/India/USA** event users (row 92). **GCC-specific** nationalisation, wage protection, or government portals are **not** visible in this export.  
• **Selection bias:** P&T ideation skews toward customers who submit ideas; under-represents silent churn.  
• **Volume ≠ priority:** Dashboard **N=9922** is a funnel count; capability volumes are **theme frequency**, not revenue or severity.  
• **Mixed sheet content:** Some **Idea Question Responses** rows are non-recruiting; analysis used keyword filter for recruiting subset.

## Recommendations for customer validation (105 / 120)

• Add interview probes on **questionnaire granularity**, **pool deletion**, and **application progress** accuracy for **GCC** recruiters and candidates.  
• Probe **communications** expectations (channels, compliance) given high **Communications and Notifications** volume in the TA slice.  
• For **H11**, test **former worker** application stories with GCC employers if relevant to contract types.  
• For **H13**, validate with internal TA teams using HiredScore at scale.

## Handoff to 120 (top internal themes to triangulate)

1. **Communications and notifications** volume and negative sentiment in TA capability model (pair with **105** on messaging and **101** on regional suites).  
2. **Candidate job application flow** and **career site** friction (progress, help text, naming).  
3. **Candidate pool and event roster** lifecycle (delete, archive, comms accuracy).  
4. **Requisition and approval** integration pain (e-sign, LinkedIn export metadata).  
5. **HiredScore** display logic for **internal active** applicants vs **rehire** signalling.

---

**Output path (this artefact):** `research/GCC/brainstorm-analysis/2026-03-26-brainstorm-analysis-GCC-E2E-022.md`
