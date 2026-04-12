# GCC Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 05 April 2026  
**Mission:** GCC-E2E-034  
**Source:** Tableau Presales Product Gaps dashboard (underlying export)  
**Source files:** `research/gap-data/opportunity-detail-export.csv`  
**Query / filters:** Product Area = Talent Acquisition (column present), Opp Segment broad triage = EMEA plus mandatory Step B Gulf GCC keyword scan (108), Created Date = last 5 years (column present; all rows in export within range)

## Executive summary

• **Scope:** **0** presales Talent Acquisition gaps matched **Gulf GCC** regional rules after Product Area, Opp Segment + keyword, and date filters (see Fresh pass attestation for cascade).  
• **Top severity:** No Severity 1-2 Gulf GCC rows in this export; triangulation should not infer presales loss risk from **108** for GCC on this file alone.  
• **Key capability themes:** Not applicable at GCC scope (N=0); the global export is **North America-heavy** (337 of 379 rows).  
• **Regional specificity:** **22** rows are **EMEA** Opp Segment but **none** contain Gulf GCC geography tokens in scanned text fields; **no `Opp Region`** column exists in this extract to apply fine-grained MENAP labels.  
• **Implication:** Refresh **108** with a **Tableau export filtered to MENAP / GCC Opp Region** (or country-specific gap text) if presales gap frequency for GCC is required for PMF; pair with **`research/competitive/matrices/gcc-competitive-matrix.md`** and **105** interviews for signal.

## Data quality and keyword disambiguation

**Microsoft GCC High vs Gulf GCC:** One row (PG-00009165, North America, Textron) contains the token **"GCC High"** referring to **Microsoft Government Cloud (GCC High)** restrictions on Outlook / Teams integrations, **not** the Gulf Cooperation Council. That row was **excluded** from Gulf GCC scope. Naive keyword `gcc` without disambiguation would create a **false positive** for this mission.

## Gap inventory

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|-------------|-------------------|----------|--------------|-------------|
| *No rows matched Gulf GCC filters for this mission.* | | | | | |

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps (Gulf GCC scope)

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 0 gaps (Gulf GCC scope)

### Severity 3: Risk of Deal Loss

**Count:** 0 gaps (Gulf GCC scope)

### Severity 4: Requires 3rd Party Partner or Custom Solution / Requires Significant Manual and/or Costly Workaround

**Count:** 0 gaps (Gulf GCC scope)

### Severity 5: Tolerable, but Requires Some Manual Effort

**Count:** 0 gaps (Gulf GCC scope)

## Capability gap themes

*No Gulf GCC-scoped gaps to theme. For pipeline hygiene, the **EMEA** Opp Segment slice (22 rows, all Talent Acquisition) remains **multi-country**; per 108, rows were not promoted to GCC without Gulf keyword hits.*

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|----------------------------|--------|
| *No Gulf GCC-scoped rows.* | | | |

### Parity Claims (Buyer-Reported)

• None at Gulf GCC scope in this export.

**Validation needed:** When future GCC-filtered exports contain CI Notes, hand off buyer-reported claims to **@competitive-intel** for Native / Workaround / True Gap classification against **`research/competitive/matrices/gcc-competitive-matrix.md`**.

## Native vs workaround analysis

**Column note:** This export does **not** include an **`Is Internal/Native`** header per 108 column map; **`Available Capability`** is present but was not used to infer native status for zero-row GCC scope. **`Is Industry Gap`** and **`Is International Gap`** are present on the sheet.

### Gaps where Is Internal/Native = Yes

• N/A (field absent; no GCC-scoped rows).

### Gaps where Is Internal/Native = No

• N/A (no GCC-scoped rows).

### Gaps where Is Industry Std = Yes

• N/A (no GCC-scoped rows).

## Competitive factor matrix

| Capability | Severity 1-2 (Loss Risk) | Severity 3-5 (Workaround) | Is Internal (Native) |
|------------|------------------------|---------------------------|----------------------|
| *No Gulf GCC-scoped data* | 0 | 0 | N/A |

## Implications for roadmap

**Hypotheses** (not decisions):

1. **High-priority gaps (Severity 1-2, frequency >=3):** None evidenced in this export at Gulf GCC scope; do not prioritise from **108** alone for GCC-E2E-034.  
2. **Regional-specific (GCC):** Presales **row-level** Gulf signals are **missing** from the shared global file; likely need **Opp Region**-scoped download or **`research/GCC/gap-data/`** supplement.  
3. **Cross-regional:** No rows met **`Is International Gap = Yes`** plus Gulf keyword match after excluding the Microsoft GCC High collision.  
4. **Native but still gaps:** Not applicable (N=0).

## Link to competitive matrix (read-only)

**`research/competitive/matrices/gcc-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap classification. **108** provides buyer-reported presales evidence when present; this run found **no** such Gulf GCC rows in `opportunity-detail-export.csv`.

## Handoff to @pmf-analyst (PMF triangulation)

**Gap Data (108) column for GCC-E2E-034:**

• **Coverage:** **0** gaps from Tableau underlying export after Product Area = Talent Acquisition, **Opp Segment EMEA + mandatory Gulf GCC keyword scan** (and Gulf-only token set excluding Microsoft GCC High), Created Date within last 5 years (all 379 rows dated Feb 2025 - Mar 2026).  
• **Top themes for triangulation:** None from **108** for this mission; mark **Gap Data (108)** as **no presales row-level signal** unless a GCC-scoped export is added.  
• **Cross-check:** Weight **105** customer / SME themes and **@competitive-intel** GCC matrix over this empty **108** slice; if stakeholders need presales frequency, re-run **108** after adding region-filtered underlying data.

## Sales enablement hooks (3-5 bullets)

• **Data gap:** Current global `opportunity-detail-export.csv` does not surface **Gulf GCC** deals in presales gaps; enablement should avoid citing **108** frequency for GCC from this file.  
• **Export hygiene:** Request **Opp Region** (MENAP / Middle East labels per your Tableau facet) on future downloads to align with 108 fine-grained mapping when available.  
• **Disambiguation:** Train sellers to distinguish **Microsoft GCC High** documentation issues from **Gulf** recruiting market gaps when logging Product Gaps.  
• **Competitive validation:** Continue to use **`gcc-competitive-matrix.md`** for validated parity language until presales CI Notes exist at GCC scope.  
• **Partnership:** If future gaps cite **job boards**, validate **Broadbean** coverage before proposing native integrations (see product context).

## Fresh pass attestation

- **Mission ID:** GCC-E2E-034  
- **Target region:** GCC (Gulf Cooperation Council presales scope; excludes Microsoft GCC High collision)  
- **Source mode:** global gap-data  
- **Files read (this run):**
  - `/Users/david.denham/product-manager-agent/research/gap-data/opportunity-detail-export.csv` (full ingest: **379** data rows + header; UTF-8 with BOM; **tab-delimited**; parsed with Python `csv.DictReader` delimiter `\t`)
  - `/Users/david.denham/product-manager-agent/research/GCC/gap-analysis/_scratch-gap-sources-GCC-E2E-034.md` (scratch dump from `scripts/dump_research_folder_to_text.py`; **not** used for row counts, comma-based CSV reader mangles this TSV)  
  - `/Users/david.denham/product-manager-agent/.cursor/rules/108-tableau-gap-analyser.mdc` (protocol)  
- **Per-country supplement:** `research/GCC/gap-data/` **not present** (no additional files).  
- **Query / export timestamp:** Unknown; file content dated **14 Feb 2025** to **31 Mar 2026** on `Created Date`.  
- **Filters applied:**
  - **Product Area:** Talent Acquisition → **379** rows (all rows in file are Talent Acquisition).  
  - **Opp Region / Opp Segment:** **`Opp Region` column absent.** **Opp Segment** broad triage for GCC = **EMEA**; **Step B** required Gulf GCC keywords in: Opportunity, Country Specific Gap Detail, CI Notes, Pain point(s), Functionality Requirement, Industry Specific Gap Detail, Proposed Solution, Gap Summary. **Gulf token set** used: Saudi, UAE, Qatar, Bahrain, Kuwait, Oman, MENAP, KSA, Emirates, Dubai, Riyadh, Abu Dhabi, Doha, United Arab, Saudi Arabia, GCC countries, Gulf cooperation, Middle Eastern, etc.; **`gcc` alone** not counted when part of **"GCC High"** (Microsoft). **EMEA + keyword matches:** **0**. **Rows excluded** as EMEA without keyword: **22**.  
  - **Cross-regional (`Is International Gap = Yes` + Gulf keywords, not already primary):** **0**.  
  - **Created Date:** Last 5 years, cutoff **05 April 2021** → **379** rows retained (all parse as MM/DD/YYYY; **0** parse failures).  
- **Filtering results:**
  - Total rows loaded: **379**  
  - After Product Area filter: **379**  
  - After regional filter (Gulf GCC): **0**  
  - After Date filter: **0** (unchanged)  
  - **Final gap count for analysis:** **0**  
- **Scratch markdown path:** `research/GCC/gap-analysis/_scratch-gap-sources-GCC-E2E-034.md`  
- **Ambiguities:** No **Opp Region** column; GCC Tableau facet labels not verifiable from file; **Microsoft GCC High** string collision with **GCC** acronym; global export skewed to **North America**.  
- **Completed (UTC):** 2026-04-05T00:00:00Z
