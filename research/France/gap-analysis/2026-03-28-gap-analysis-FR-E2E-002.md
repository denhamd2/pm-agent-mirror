# France Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 28 March 2026  
**Mission:** FR-E2E-002  
**Source:** Tableau Presales Product Gaps style export (local underlying data)  
**Source files:** `research/France/gap-data/presales-gaps-export-unfiltered.csv`  
**Query / filters:** Product Area = Talent Acquisition (when column present), Opp Region or Opp Segment in {`France MFG HC & Edu`, `France Services Tech Media`}, Created Date within last 5 years (cutoff 28 March 2021) when parseable  

## Executive summary

• **Scope:** 2 presales gap rows match France + Talent Acquisition + date filters after local re-filtering of an unfiltered export (6 data rows ingested).  
• **Top severity:** 0 Severity 1 gaps; 1 Severity 2 gap (SKU removal risk); 1 Severity 3 gap (deal loss risk).  
• **Key capability themes:** Job postings (Severity 2) and offers and contracts (Severity 3) dominate this micro-sample.  
• **Regional specificity:** Both retained rows map to official France Opp Region / Segment labels; one row carries explicit France country gap detail (EU data residency).  
• **Implication:** Even in a thin export, France presales signal pressure on **localised offer artefacts** and **job posting / distribution** narratives; validate parity via **101** and workarounds via Deployment Agent before roadmap commits.  

## Gap inventory

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|---------------|-------------------|----------|--------------|-------------|
| PG-90001003 | PG-90001003 (x3) | Job Postings | 2 - Risk of Removal of SKU from Deal | 01/03/2025 | *Not in export* |
| PG-90001001 | PG-90001001 (x1) | Offers & Contracts | 3 - Risk of Deal Loss | 15/01/2025 | *Not in export* |

*Sorted by severity score (1 = highest), then Created Date (newest first). `Deal Motion` column absent from source; placeholder opportunity labels use Gap Name / internal id from export.*  

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps  

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 1 gap  

**Top capabilities affected:**  
1. **Job Postings:** 1 gap - PG-90001003 (`France Services Tech Media`).  

**Key pain points** (from Pain point(s) field):  
• France opp in correct France Opp Region bucket. (fixture-level note; still presales-context row.)  

### Severity 3: Risk of Deal Loss

**Count:** 1 gap  

**Top capabilities affected:**  
1. **Offers & Contracts:** 1 gap - PG-90001001 (`France MFG HC & Edu`).  

**Key pain points** (from Pain point(s) field):  
• Recruiter needs offer templates aligned to French labour practice.  

### Severity 4: Requires Partner/Workaround

**Count:** 0 gaps  

### Severity 5: Tolerable Manual Effort

**Count:** 0 gaps (after filters; unfiltered file contained Severity 5 rows in other regions.)  

## Capability gap themes

### Theme 1: Job Postings

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 1, S3: 0, S4: 0, S5: 0  
**Key observations:**  
• Single high-friction row at Severity 2 in France Services Tech Media; CI Notes empty in export.  
• Competitive context: none stated in source.  

**Deal examples:**  
• PG-90001003: Severity 2, France Services Tech Media, Talent Acquisition.  

### Theme 2: Offers & Contracts

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 1, S4: 0, S5: 0  
**Key observations:**  
• Pain text points to **French labour practice** alignment for offer templates.  
• Country Specific Gap Detail references **France - EU data residency ask** (flag for **060** if product scope touches hosting / residency messaging).  

**Deal examples:**  
• PG-90001001: Severity 3, France MFG HC & Edu, EU data residency detail present.  

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|-------------|------------------------------|--------|
| *None named* | - | CI Notes column empty for all in-scope rows | - |

### Parity Claims (Buyer-Reported)

• No explicit competitor parity claims in CI Notes for the filtered France Talent Acquisition slice.  

**Validation needed:** If future exports populate CI Notes, hand off to **101-competitive-intelligence** for Native / Workaround / True Gap classification.  

## Native vs workaround analysis

**Source limitation:** This export does not include `Is Internal/Native` or `Is Industry Std`. The following is structured for when those fields exist; for **FR-E2E-002** attest *columns absent*.  

### Gaps where Is Internal/Native = Yes

• *No rows* - field not present in source.  

### Gaps where Is Internal/Native = No

• *No rows* - field not present in source.  

### Gaps where Is Industry Std = Yes

• *No rows* - field not present in source.  

## Competitive factor matrix

| Capability | Severity 1-2 (Loss Risk) | Severity 3-5 (Workaround) | Is Internal (Native) |
|------------|--------------------------|---------------------------|----------------------|
| Job Postings | 1 gap (PG-90001003) | 0 | *Unknown - column absent* |
| Offers & Contracts | 0 | 1 gap (PG-90001001, S3) | *Unknown - column absent* |

## Implications for roadmap

**Hypotheses** (not decisions):  

1. **High-priority gaps** (Severity 1-2, frequency >=3):  
   • None meet the >=3 frequency bar in this export; the single Severity 2 **Job Postings** row still warrants **101** + Deployment Agent check if France pipeline work touches posting / board / distribution.  

2. **Regional-specific** (France):  
   • **Offers & Contracts** + **French labour practice** + **EU data residency** language suggests France GTM and legal copy need tight alignment; route residency claims to **060** when scoping PRDs.  

3. **Cross-regional gaps:**  
   • Not inferable from two-row France slice; full unfiltered exports would be needed.  

4. **Native but still gaps:**  
   • Undetermined until `Is Internal/Native` is present in exports.  

## Link to competitive matrix (read-only)

**`research/competitive/matrices/fr-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap. **108** supplies buyer-reported presales frequency; **101** validates claims.  

## Handoff to 120 (PMF triangulation)

**Gap Data (108) column for FR-E2E-002:**  

• **Coverage:** 2 gaps after Product Area = Talent Acquisition, France Opp Region / Segment filter, and 5-year Created Date window.  
• **Top themes for triangulation:**  
  1. **Job postings / distribution:** Severity 2, 1 gap - triangulate with customer / SME interview themes on boards and France posting.  
  2. **Offers and contracts (France labour + residency):** Severity 3, 1 gap - triangulate with PESTEL Legal / SWOT from **099** and interview narratives.  

• **Cross-check:** When **120** cites competitive or parity statements, prefer **101** matrix + this file over anecdote alone.  

## Sales enablement hooks (3-5 bullets)

• France Services Tech Media shows at least one **Severity 2** presales row on **Job Postings**; prepare discovery questions on board coverage and Broadbean posture.  
• France MFG HC & Edu row ties **Offers & Contracts** to **French labour practice**; align field messaging with documented offer capabilities and localisation.  
• **EU data residency** appears in Country Specific Gap Detail; ensure sales/engineering responses are legally vetted (**060**) not improvised.  
• Treat all severity as **buyer-reported** until Deployment Agent workaround review (**130** path).  

## Fresh pass attestation

- **Mission ID:** FR-E2E-002  
- **Target region:** France  
- **Source mode:** local gap-data  
- **Files read (this run):**  
  - `research/France/gap-data/presales-gaps-export-unfiltered.csv`  
- **Scratch markdown (dump script):** `research/France/gap-analysis/_scratch-gap-sources-FR-E2E-002.md`  
- **Tableau MCP:** Not used (local export only).  
- **Filters applied:**  
  - Product Area: `Talent Acquisition` (column present)  
  - Opp Region / Opp Segment: `France MFG HC & Edu`, `France Services Tech Media` (match if either field equals allow-list after trim)  
  - Created Date: last 5 years, cutoff **2021-03-28** through query date **2026-03-28** (DD/MM/YYYY parsed for in-scope rows)  
- **Filtering results:**  
  - Total rows loaded from file: **6** (excluding header)  
  - After Product Area filter: **5** (excluded 1 × HCM Core row)  
  - After Regional filter: **2**  
  - After Date filter: **2** (final gap count)  
- **Columns absent (noted):** `Deal Motion`, `Is Internal/Native`, `Is Industry Std`  
- **Ambiguities:** Fixture-scale export; Oppportunity names not populated (used Gap ID / Gap Name). No date parse failures for retained rows.  
- **Completed (UTC):** 2026-03-28T14:30:00Z  
