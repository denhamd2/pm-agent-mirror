# India Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 06 April 2026  
**Mission:** INDIA-E2E-005  
**Source:** Tableau Presales Product Gaps dashboard (underlying export)  
**Source files:** `research/gap-data/opportunity-detail-export.csv`  
**Query / filters:** Product Area = Talent Acquisition (column present); **no `Opp Region` column** in this extract; regional match = **mandatory Step B India keyword scan** across prescribed text fields (108 India mapping: Opp Segment triage `APAC` **plus** keyword, **or** keyword-only when text proves India context); Created Date = last 5 years (column present)

## Executive summary

• **Scope:** **3** presales Talent Acquisition gaps matched **India** regional rules after Product Area, Step B keyword scan (india, indian, bangalore, mumbai, delhi, hyderabad, chennai, pune, kolkata, bengaluru, aadhaar), and date filters. **13** rows with **`Opp Segment = APAC`** were **excluded** because they had **no** India keyword hit in scanned fields (per 108: segment-only match is insufficient).  
• **Top severity:** **No** Severity **1-3** rows in India scope; **2** gaps at **Severity 4** (workaround / partner), **1** at **Severity 5** (manual effort). Presales **loss-risk** frequency from **108** for India on this file is **low**, but **buyer narratives** still surface **timezone**, **high-volume screening**, and **India-specific candidate journey** friction.  
• **Key capability themes:** **Interviews** (self-scheduling / calendar navigation for India-time hiring), **Job Requisitions** (knock-out questions, HRIS change-control pain at **high India applicant volume**), and **candidate application / Candidate Home** (account creation, **India hiring lane** not using standard path).  
• **Regional specificity:** All **three** matched rows show **`Opp Segment = North America`**. India relevance is **text-evidenced** (hiring in India, Indian candidate volumes, India-only site) rather than **`Opp Region = India`** (facet not available in this export). Treat as **India-relevant presales narrative**, not a pure **in-country Opp Region** slice.  
• **Know Your Candidate / fraud:** **No** rows in this India-filtered set mention **identity verification**, **document fraud**, **Aadhaar**-based checks, or **duplicate / fake candidates**. **High-volume hiring** appears **explicitly** in one gap (Flowserve). **Implication:** Pair this **108** pass with **`research/competitive/matrices/in-competitive-matrix.md`**, **105** interviews, and (if needed) a **Tableau export scoped to India / APAC Opp Region** for richer KYC presales signal.

## Regional interpretation note (North America Opp Segment + India text)

These gaps are **US or global HQ opportunities** where **Functionality Requirement** or related text references **India hiring** or **Indian** applicant pools. That matches 108 rule **"any keyword hit in any scanned text field"** when fine-grained **Opp Region** is absent. **@pmf-analyst** should label triangulation as **presales India-relevant** rather than **India domestic Opp Region** unless a future export adds **Opp Region** members for India.

## Gap inventory

Sorted by Severity Score (1 = highest), then Created Date (newest first).

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|-------------|-------------------|----------|--------------|-------------|
| PG-00010874 | Quantcast- REC | Interviews | 4 - Requires a 3rd Party Partner or Custom Solution (4) | 11/20/2025 | Core Customer - Expand with Other |
| PG-00007761 | Morningstar, Inc.-FY27 | *(not split in Capability column; see Functionality / Headliner)* | 4 - Requires Significant Manual and/or Costly Workaround (4) | 07/02/2025 | Core - Renewal Uplift |
| PG-00009493 | Flowserve Corporation - AIRC, CE, JRNYS | Job Requisitions | 5 - Tolerable, but Requires Some Manual Effort (5) | 09/22/2025 | Core Customer - Expand with Non-Core |

**Row detail (PG-00007761):** `Product Capability` cell is empty in the export; **Headliner Feature** = `Creating an account in Candidate Home`. Thematic mapping for analysis: **Candidate Job Application Flow / Candidate Home** (Talent Acquisition).

## Patterns relevant to Know Your Candidate, candidate fraud, and high-volume hiring

• **High-volume hiring (explicit):** **PG-00009493** (Flowserve) cites **"Indian with 100s of candidates per requisitions"** that fail knock-out intent when questionnaires are **HRIS-controlled** and slow to change. Pattern: **scale + governance** (TA agility vs. central HRIS) affecting **India-sourced applicant volume**, not a **fraud** claim.  
• **Candidate identity / trust (implicit):** **PG-00007761** (Morningstar) states **~50% of hires in India** cannot use **Candidate Home** (forced local site; integration in flight; **account creation** seen as **drop-off** risk). This is **candidate journey and channel fragmentation**, relevant to **Know Your Candidate** only insofar as **non-Workday** paths reduce **single-record visibility**; **no** presales text asserts **fraud** or **KYC** gap.  
• **Scheduling / authenticity:** **PG-00010874** (Quantcast) is **recruiter calendar / self-scheduling** pain when **recruiting talent from India** against **US (San Francisco) hours**. **Operational** and **experience** friction; **not** a document or identity verification gap in the export.  
• **Fraud / KYC keyword scan:** Across the **379** Talent Acquisition rows and the **3** India-scoped rows, **no** `CI Notes`, **Pain point(s)**, or **Gap Summary** text in this file surfaces **fraud**, **fake profiles**, **impersonation**, or **Aadhaar**-linked verification gaps. **Aadhaar** was listed in 108 as an India keyword but **did not appear** in matched rows.

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps (India keyword scope)

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 0 gaps (India keyword scope)

### Severity 3: Risk of Deal Loss

**Count:** 0 gaps (India keyword scope)

### Severity 4: Requires 3rd Party Partner or Custom Solution / Requires Significant Manual and/or Costly Workaround

**Count:** 2 gaps

**Top capabilities / themes affected:**

1. **Interviews / scheduling:** 1 gap - **Quantcast** (PG-00010874): self-scheduling for phone screens; **India hours** vs. **US HQ** calendar coordination; workaround cost with partner.  
2. **Candidate Home / application:** 1 gap - **Morningstar** (PG-00007761): resistance to **mandatory accounts**; **India** hiring path split from main candidate experience.

**Key pain points** (from **Pain point(s)** where populated):

• **PG-00010874:** Costly workaround with partner; lack of automation / ease for recruiters and candidates.  
• **PG-00007761:** Pain called out in **Functionality Requirement** (drop-off concern, India lane not on Candidate Home).

### Severity 5: Tolerable, but Requires Some Manual Effort

**Count:** 1 gap

**Top capabilities affected:**

1. **Job Requisitions / questionnaires:** 1 gap - **Flowserve** (PG-00009493): TA cannot adjust knock-out questions quickly; **high India applicant volume** amplifies manual filtering pain.

**Key pain points:**

• Manual work; dependency on HRIS team for questionnaire changes; buyer compares to **Greenhouse** and **iCIMS** ease for TA-owned knock-outs (**buyer-reported**, **PERCEPTION**).

## Capability gap themes

### Theme 1: Interviews (self-scheduling, time zones)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 1, S5: 0  
**Key observations:**

• India-time vs. US-time scheduling creates **internal / external calendar** friction.  
• **Headliner Feature** points to **more robust candidate self-scheduling**.

**Deal examples:**

• **Quantcast - REC** (PG-00010874): Severity 4, Technology & Media, **North America** segment with India hiring context in **Functionality Requirement**.

### Theme 2: Job Requisitions (knock-out questions, HRIS governance)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 0, S5: 1  
**Key observations:**

• **Industry Specific Gap Detail** claims other ATS let recruiters add knock-outs without HRIS security barriers (**PERCEPTION**).  
• **Is Industry Gap = Yes** on this row.

**Deal examples:**

• **Flowserve Corporation** (PG-00009493): Severity 5, Manufacturing, **Won** opportunity; India high-volume wording in requirements.

### Theme 3: Candidate Home / application experience (India lane)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 1, S5: 0  
**Key observations:**

• Objection to **enforced account creation** and **drop-off** concern.  
• **India**-specific channel (**"site that is forced in India"**) means a population **never** reaches **Candidate Home** in Workday.

**Deal examples:**

• **Morningstar, Inc.** (PG-00007761): Severity 4, Financial Services, renewal uplift motion.

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|----------------------------|--------|
| *No CI Notes populated for India-scoped rows (CI Notes Header = No CI Notes).* | | | |

**Functionality Requirement / Industry text (buyer-reported, not CI Notes):**

| Competitor | Capability | Context (buyer-reported) | Gap ID |
|------------|------------|-------------------------|--------|
| Greenhouse | Knock-out / screening configurability | TA can add knock-outs without HRIS configuration burden (PERCEPTION) | PG-00009493 |
| iCIMS | Knock-out / screening configurability | Same as above (PERCEPTION) | PG-00009493 |

### Parity Claims (Buyer-Reported)

• **Greenhouse / iCIMS** make it easier for TA to add knock-out questions on the fly without IT / HRIS (PERCEPTION) (Gap ID: **PG-00009493**)

**Validation needed:** Hand off to **@competitive-intel** to verify Native / Workaround / True Gap vs **`research/competitive/matrices/in-competitive-matrix.md`** and global matrix.

## Native vs workaround analysis

**Column note:** This export does **not** include **`Is Internal/Native`** per 108 column map. **`Available Capability`** exists but was **empty** on all **three** India-scoped rows, so **native status was not inferred** from the sheet.

### Gaps where Is Internal/Native = Yes

• **N/A** (field absent; not inferred).

### Gaps where Is Internal/Native = No

• **N/A** (field absent; not inferred).

### Gaps where Is Industry Std = Yes

• **Job Requisitions** (PG-00009493): **Is Industry Gap = Yes** - buyer frames faster knock-out editing as **industry-expected** vs. HRIS-locked Workday process.

## Competitive factor matrix

| Capability / theme | Severity 1-2 (Loss Risk) | Severity 3-5 (Workaround) | Is Internal (Native) |
|--------------------|--------------------------|---------------------------|---------------------|
| Interviews / self-scheduling | 0 | 1 (S4: Quantcast) | Unknown (column absent) |
| Job Requisitions / questionnaires | 0 | 1 (S5: Flowserve) | Unknown |
| Candidate Home / application (India lane) | 0 | 1 (S4: Morningstar) | Unknown |

## Implications for roadmap

**Hypotheses** (not decisions):

1. **High-priority gaps (Severity 1-2, frequency >=3):** **None** in India keyword scope on this export; **do not** set presales **loss-risk** priorities from **108** alone for INDIA-E2E-005.  
2. **Regional-specific (India-relevant narrative):** **Timezone-aware scheduling** and **fragmented India candidate channels** show up even in **North America**-segment opportunities; product narrative for **India** should address **parallel candidate journeys** and **scheduler ergonomics** for distributed hiring.  
3. **Cross-regional:** **Knock-out / questionnaire governance** is a **global** pattern; India is cited as **volume amplifier** in one deal. Consider **TA admin empowerment** vs. **security model** trade-offs.  
4. **Native but still gaps:** **Unknown** without **`Is Internal/Native`**; recommend **Deployment Agent** validation if these gaps feed **130** (per 108 / 130 integration note).

## Link to competitive matrix (read-only)

**`research/competitive/matrices/in-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap classification. **108** provides **buyer-reported** presales evidence; this run adds **three** India-text-qualified narratives, **not** a full India **Opp Region** census.

## Handoff to @pmf-analyst (PMF triangulation)

**Gap Data (108) column for INDIA-E2E-005:**

• **Coverage:** **3** gaps from `opportunity-detail-export.csv` after Product Area = Talent Acquisition, **India keyword scan** (Step B), Created Date within last 5 years (cutoff **2021-04-06** approx. relative to **06 April 2026**). **13** **APAC** rows excluded (no India keyword).  
• **Top themes for triangulation:**  
  1. **Interview self-scheduling + India / US timezone** - S4 ×1  
  2. **Knock-out questions at scale (India applicant volume)** - S5 ×1, **Is Industry Gap**  
  3. **Candidate Home / account creation vs. India-only hiring channel** - S4 ×1  
• **KYC / fraud:** **No** presales row-level signal in this extract; triangulate with **105** and **@competitive-intel** for India identity / trust themes.  
• **Cross-check:** Prefer **in-competitive-matrix.md** + **105** over **108** alone for **KYC**; use **108** for **frequency of India-mentioned presales pain** in the **global** file (low N here).

## Sales enablement hooks (3-5 bullets)

• **Scheduling:** For US HQ customers hiring in **India**, surface **Paradox** / native scheduling story and **timezone** playbooks where **self-scheduling** gaps appear (example: **Quantcast** narrative, PG-00010874).  
• **Volume + screening:** When **India** applicant volume is high, pair **questionnaire / knock-out** guidance with **HRIS change-management** talk track; validate **Greenhouse / iCIMS** claims with **`in-competitive-matrix.md`** (PG-00009493).  
• **Candidate Home:** For **India** channel fragmentation, clarify **integration** status and **candidate account** options; address **drop-off** concern with evidence (PG-00007761).  
• **Data hygiene:** If stakeholders need **Aadhaar / KYC** presales counts, request a **Tableau underlying export** filtered to **India / APAC Opp Region** or enriched **Country Specific Gap Detail** - this global file did **not** surface those keywords in India-scoped rows.  
• **Partnership:** Job board mentions absent in India-scoped rows; if future gaps cite boards, check **Broadbean** before proposing native integrations (product context).

## Fresh pass attestation

- **Mission ID:** INDIA-E2E-005  
- **Target region:** India (108 keyword + **APAC Opp Segment triage** applied; fine-grained **Opp Region** not in file)  
- **Source mode:** `global gap-data`  
- **Files read (this run):**  
  - `research/gap-data/opportunity-detail-export.csv`  
- **Per-country supplement:** `research/India/gap-data/` - **empty / not present** (no additional files)  
- **Scratch markdown / dump script:** `python3 scripts/dump_research_folder_to_text.py` **not run** - single **UTF-8** tab-delimited CSV; no `.xlsx` / `.xls` in `research/gap-data/` for this pass  
- **Query / export timestamp:** Unknown (file ingested as-is **06 April 2026**)  
- **Filters applied:**  
  - **Product Area:** Talent Acquisition (**379** rows; all rows in file are TA in this export)  
  - **Opp Region:** **Skipped** - column **absent**  
  - **Opp Segment + Step B:** For India, **APAC triage** would require **keyword**; **keyword-only** matches also allowed when **Opp Region** missing - **all** matches were **keyword** hits in text (**0** rows matched **APAC + keyword**; **3** matched **keyword** with **North America** segment)  
  - **India keywords (case-insensitive):** india, indian, bangalore, mumbai, delhi, hyderabad, chennai, pune, kolkata, bengaluru, aadhaar - scanned **Opportunity**, **Country Specific Gap Detail**, **CI Notes**, **Pain point(s)**, **Functionality Requirement**, **Industry Specific Gap Detail**, **Proposed Solution**, **Gap Summary**  
  - **Excluded:** **13** rows with **Opp Segment = APAC** and **no** India keyword (segment-only match disallowed)  
  - **Cross-regional (`Is International Gap = Yes` + India keyword, caveat):** **0** additional rows (no qualifying rows beyond keyword set already included)  
  - **Created Date:** Last **1826** days from **06 April 2026** (cutoff **~2021-04-06**); **0** India-scoped rows excluded by date; **0** date parse failures  
- **Filtering results:**  
  - Total rows loaded: **379**  
  - After Product Area filter: **379** (all rows)  
  - After Regional filter (keyword-based India): **3**  
  - After Date filter: **3** (final gap count)  
- **Ambiguities:** **No `Opp Region`** for India facet labels; India signal is **textual** and may reflect **global HQ** deals hiring in India. **`Product Capability`** blank on **PG-00007761**; capability inferred from **Headliner Feature**. **Severity** strings differ slightly between two S4 rows (partner vs. costly workaround) but both **Score = 4**.  
- **Completed (UTC):** 2026-04-06T12:00:00Z
