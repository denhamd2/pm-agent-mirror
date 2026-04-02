# India Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 01 April 2026  
**Mission:** INDIA-PMF-006  
**Source:** Tableau Presales Product Gaps dashboard (Opportunity Detail underlying export)  
**Source files:** `research/gap-data/opportunity-detail-export.csv`  
**Query / filters:** Product Area = Talent Acquisition (column present), regional = **no `Opp Region` column** - applied **Opp Segment** broad mapping for India (**APAC** would be triage-only) plus mandatory **Step B** keyword scan; **all 3 matches** were **North America** segment with **India** hits in text fields, Created Date = last 5 years (cutoff 01 April 2021)  
**Per-country supplement:** `research/India/gap-data/` (empty; no additional files)

## Executive summary

• **Scope:** **3** presales gaps matched **India-relevant** filtering after Product Area and date gates (379 Talent Acquisition rows in export; all within 5-year window).  
• **Top severity:** **0** Severity 1–2 gaps in the India-matched set; **2** Severity **4** gaps, **1** Severity **5**.  
• **Key capability themes:** Interview scheduling and self-service (cross-border India hiring), job requisition questionnaires and high-volume screening (India call-out), Candidate Home / account creation (India hiring channel and local site).  
• **Regional specificity:** Matches are **cross-border and channel** signals (US-headquartered accounts citing India hiring, time zones, or India-only candidate paths) rather than in-India Opp Region rows; **no** dedicated `Opp Region` for India in this extract.  
• **APAC segment:** **13** APAC rows had **no** India (or India keyword list) hit and were **excluded** per 108 (mostly Australia/NZ job-board narratives such as SEEK).  
• **Implication:** Presales export underweights **in-territory India** gaps; triangulate with **105**, **@competitive-intel** (`in-competitive-matrix.md`), and ideally a Tableau export scoped to India facet labels when Sales Ops confirms them.

## Gap inventory

Sorted by Severity Score (1 = highest), then Created Date (newest first).

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|-------------|-------------------|----------|--------------|-------------|
| PG-00010874 | Quantcast- REC | Interviews | 4 - Requires a 3rd Party Partner or Custom Solution (4) | 11/20/2025 | Core Customer - Expand with Other |
| PG-00007761 | Morningstar, Inc.-FY27 | *(blank in export)* | 4 - Requires Significant Manual and/or Costly Workaround (4) | 07/02/2025 | Core - Renewal Uplift |
| PG-00009493 | Flowserve Corporation - AIRC, CE, JRNYS | Job Requisitions | 5 - Tolerable, but Requires Some Manual Effort (5) | 09/22/2025 | Core Customer - Expand with Non-Core |

**Internal keys (Opp export):** `aTEVT0000002d3h4AA`, `aTEVT0000001KCn4AM`, `aTEVT00000023BV4AY` respectively.

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 0

### Severity 3: Risk of Deal Loss

**Count:** 0

### Severity 4: Requires 3rd Party Partner or Custom Solution / Significant Manual or Costly Workaround

**Count:** 2 gaps

**Top capabilities affected:**

1. **Interviews / self-scheduling:** 1 gap - Quantcast- REC (cross-border scheduling, India time zones vs US).  
2. **Candidate experience (Candidate Home):** 1 gap - Morningstar, Inc.-FY27 (account creation; India hiring path and local site).

**Key pain points** (from Pain point(s) and Functionality Requirement):

• Costly workaround with partner; lack of automation for recruiters and candidates (self-scheduling).  
• Candidate drop-off concerns; **50% of hires in India** not aligned to Candidate Home; **local site forced in India**; integration in progress; candidates may never use Candidate Home.  
• Flowserve (Severity 5) cites **manual work** and HRIS-locked questionnaire configuration.

### Severity 5: Tolerable, but Requires Some Manual Effort

**Count:** 1 gap

**Top capabilities affected:**

1. **Job Requisitions / questionnaires:** 1 gap - Flowserve Corporation - AIRC, CE, JRNYS.

**Key pain points:**

• Knock-out questions via questionnaires exist but HRIS locks configuration; **Indian** requisitions called out with **100s of candidates** not meeting requirements; TA cannot adjust quickly vs other ATS expectations (see CI / industry detail below).

## Capability gap themes

### Theme 1: Interviews - Self-scheduling and timezone friction (India talent pool)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 1, S5: 0  

**Key observations:**

• Buyer need for **candidate self-scheduling** for phone screens and interviews.  
• Explicit **India hours vs San Francisco** coordination pain for recruiters and calendars.  
• **High-volume hiring** angle: operational load when scheduling across zones at scale.

**Deal examples:**

• **Quantcast- REC:** Severity 4; deal motion Core Customer - Expand with Other; closed/lost to Do Nothing (stage in export).

### Theme 2: Job Requisitions - Questionnaires, knock-outs, and high-volume screening (India call-out)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 0, S5: 1  

**Key observations:**

• **Hundreds of candidates per requisition** in **India** not meeting requirements when questionnaires cannot be updated quickly.  
• **Competitive context (buyer-reported):** Industry detail references **Greenhouse** and **iCIMS** as making it easier for TA to add knock-out questions without HRIS security / configuration bottlenecks (**PERCEPTION** - validate via **@competitive-intel**).

**Deal examples:**

• **Flowserve Corporation - AIRC, CE, JRNYS:** Severity 5; Won.

### Theme 3: Candidate Job Application Flow / Candidate Home - Accounts, drop-off, India channel

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 1, S5: 0  

**Key observations:**

• Resistance to **mandatory Candidate Home accounts** due to expected **candidate drop-off**.  
• **India-specific hiring path:** ~**50% of hires in India**; **site forced in India**; parallel integration; those candidates **never** access Candidate Home.  
• **Local job boards / India:** Aligns with **011-product-context** - verify **Broadbean** coverage for India destinations before treating as native product gap; may be **partnership** or **local channel** positioning.

**Deal examples:**

• **Morningstar, Inc.-FY27:** Severity 4; renewal uplift; open pipeline.

### Theme 4: Identity verification, candidate fraud, and pure India job-board integrations

**Gap count:** 0 **in India-filtered set**  

**Key observations:**

• A **full-text scan** of the filtered Talent Acquisition rows for India keywords yielded **no** gaps whose primary narrative was **identity verification**, **fraud**, or **Aadhaar**.  
• The wider file contains **fraud / bad-actor** and **high-volume UI** gaps on **North America** opportunities; they **did not** match India regional filtering and are **not** counted in the India inventory.  
• **APAC** rows in this extract skew to **SEEK / LinkedIn / ANZ** job posting (excluded from India set for lack of India keyword hit).

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|----------------------------|--------|
| Greenhouse | Job Requisitions / questionnaires | Buyer-reported: easier for TA to add knock-out questions without HRIS security lock-in (Industry Specific Gap Detail) | PG-00009493 |
| iCIMS | Job Requisitions / questionnaires | Same parity-style claim as Greenhouse (buyer-reported) | PG-00009493 |

### Parity Claims (Buyer-Reported)

• **Greenhouse / iCIMS** allow recruiters to add knock-out questions **without** HRIS configuration permissions that Flowserve's TA cannot obtain quickly (Gap ID: **PG-00009493**).

**Validation needed:** Hand off to **@competitive-intel** to verify Native / Workaround / True Gap against `research/competitive/matrices/in-competitive-matrix.md`.

## Native vs workaround analysis

**Column note:** This export does **not** include **`Is Internal/Native`** or **`Is Industry Std`** as named in 108. **`Available Capability`** is present but **empty** on the three India-matched rows. **`Is Industry Gap`:** Yes on PG-00009493; No on the other two.

### Gaps where Available Capability is blank (buyer-reported gap; native status unknown from export)

• **Interviews (self-scheduling):** Severity 4; partner workaround implied (PG-00010874).  
• **Job Requisitions (knock-outs):** Severity 5; manual / HRIS process friction (PG-00009493).  
• **Candidate Home account:** Severity 4; India channel and alternate site (PG-00007761).

### True gaps vs deployment / discoverability

• **108** cannot classify **native vs true gap** from this file alone for these rows; **130** / Deployment Agent validation recommended when building gap slides.

## Competitive factor matrix

| Capability | Severity 1-2 (Loss Risk) | Severity 3-5 (Workaround) | Native (from export) |
|------------|-------------------------|---------------------------|-------------------------|
| Interviews (self-scheduling) | 0 | 1 (S4: Quantcast) | Unknown (empty Available Capability) |
| Job Requisitions (questionnaires) | 0 | 1 (S5: Flowserve) | Unknown |
| Candidate Home / account / India path | 0 | 1 (S4: Morningstar) | Unknown |

## Implications for roadmap

**Hypotheses** (not decisions):

1. **High-priority gaps (S1-2, frequency >=3):** **None** in India-filtered set; **do not** treat this export as sufficient evidence that India has no high-severity presales risk.  
2. **Regional-specific (India):** **Cross-border scheduling** and **India-only candidate journeys** (local site, no Candidate Home) are concrete signals for **India PMF** alongside DPDP and local board strategy.  
3. **Cross-regional:** Self-scheduling and questionnaire agility appear in **global** narratives; India is one **anchor example** in these three rows.  
4. **High-volume hiring:** Flowserve row ties **volume** (100s of applicants) to **India** reqs and questionnaire rigidity - relevant to **HiredScore** activation and **req template** governance stories (activation / configuration, not net-new product claims).  
5. **Job boards:** Morningstar **local site forced in India** - validate **Broadbean** and local board coverage before roadmap commits to native integrations.

## Link to competitive matrix (read-only)

**`research/competitive/matrices/in-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap classification. **108** provides buyer-reported presales evidence only.

## Handoff to @pmf-analyst (PMF triangulation)

**Gap Data (108) column for INDIA-PMF-006:**

• **Coverage:** 3 gaps after Product Area = Talent Acquisition, **Step B** India keyword / company scan (108 keyword-only path because **`Opp Region` absent**). All three rows are **North America** `Opp Segment` with India-relevant narrative. **13** **APAC** rows lacked India keywords and were excluded. Created Date >= 2021-04-01.  
• **Top themes for triangulation:**

  1. **Interview self-scheduling + India / US timezone friction** - S4, 1 gap - Recommend triangulation: **Yes** (concrete geo / ops pain).  
  2. **Questionnaire / knock-out agility vs high-volume India reqs** - S5, 1 gap - Recommend triangulation: **Yes** (volume + India explicitly).  
  3. **Candidate Home, account creation, India hiring channel** - S4, 1 gap - Recommend triangulation: **Yes** (local channel / drop-off).  
  4. **Identity / fraud / Aadhaar** - 0 filtered gaps - Recommend triangulation: **No** from **108** alone; use **105** / CI / legal scan.

• **Cross-check:** Prefer **@competitive-intel** matrices plus this 108 file over interview-only frequency claims for **questionnaire / ATS parity** narratives.

## Sales enablement hooks (3-5 bullets)

• **Cross-border India hiring:** Quantcast narrative on **self-scheduling** and **India hours** - good discovery question for global TA teams with India sourcing.  
• **High-volume India reqs:** Flowserve on **100s of candidates** and **knock-out** agility - position **governed questionnaire patterns** and **HiredScore** where appropriate.  
• **India candidate channel:** Morningstar on **Candidate Home** vs **local India site** - align with **Broadbean** and partner messaging before promising native board builds.  
• **Competitive:** Greenhouse / iCIMS **questionnaire** claims on PG-00009493 - validate with **in-competitive-matrix.md** before battle cards.

## Fresh pass attestation

- **Mission ID:** INDIA-PMF-006  
- **Target region:** India (with cross-border and India-keyword text signals)  
- **Source mode:** global gap-data + per-country gap-data (empty)  
- **Files read (this run):**
  - `.cursor/rules/108-tableau-gap-analyser.mdc` (full protocol)  
  - `research/gap-data/opportunity-detail-export.csv` (full parse, tab-delimited UTF-8)  
  - `research/India/gap-analysis/_scratch-gap-sources-INDIA-PMF-006.md` (output of `dump_research_folder_to_text.py`)  
  - `research/India/gap-data/` (verified empty; no supplemental CSV/XLSX)  
- **Script run:** `python3 scripts/dump_research_folder_to_text.py research/gap-data/ -o research/India/gap-analysis/_scratch-gap-sources-INDIA-PMF-006.md`  
- **Filters applied:**
  - **Product Area:** Talent Acquisition - **379** rows (all rows in file were already TA).  
  - **Opp Region:** **Column absent** - skipped exact-match; used **Opp Segment** + **Step B** keyword scan per 108 India fallback.  
  - **Opp Segment broad triage:** India list includes **APAC OR keyword-only**; **13** **APAC** rows **excluded** (no India keyword hit).  
  - **Regional keywords (Step B):** india, indian, bangalore, bengaluru, mumbai, delhi, hyderabad, chennai, pune, kolkata, aadhaar (+ **apac** only when paired with segment APAC per protocol; India matches here were **keyword** on NA opportunities for 3 rows).  
  - **Indian company regex:** Infosys, TCS, Wipro, etc. - **no** additional rows beyond keyword matches.  
  - **Created Date:** last 5 years from **01 April 2026** → cutoff **01 April 2021** - **379** rows retained; **0** parse failures.  
  - **Is International Gap cross-regional add-on:** **0** additional rows (no intl=Yes rows with India keywords outside the set).  
- **Filtering results:**
  - Total rows loaded: **379**  
  - After Product Area filter: **379**  
  - After Regional filter: **3** (India-relevant text signals)  
  - After Date filter: **379** → India set remains **3**  
  - **Final gap count for analysis:** **3**  
- **Ambiguities:** No **Opp Region** for India in rule table; India matches are **text-based** and include **headquarters outside India**; export lacks **Is Internal/Native**.  
- **Completed (UTC):** 2026-04-01T12:00:00Z  

---

**Output path:** `research/India/gap-analysis/2026-04-01-gap-analysis-INDIA-PMF-006.md`
