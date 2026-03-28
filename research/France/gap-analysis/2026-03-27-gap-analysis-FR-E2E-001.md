# France Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 27 March 2026  
**Mission:** FR-E2E-001  
**Source:** Tableau Presales Product Gaps dashboard (local underlying-style export)  
**Source files:** `research/France/gap-data/presales-gaps-export-unfiltered.csv`  
**Scratch dump (this run):** `research/France/gap-analysis/_scratch-gap-sources-FR-E2E-001.md`  
**Query / filters:** Product Area = Talent Acquisition (when column present), Opp Region or Opp Segment ∈ {`France MFG HC & Edu`, `France Services Tech Media`}, Created Date within last 5 years (cutoff 27 March 2021) when parseable

## Executive summary

• **Scope:** 2 presales gaps matched all filters (small fixture export; not a full production row count).  
• **Top severity:** 1 gap at Severity 2 (risk of SKU removal) and 1 at Severity 3 (risk of deal loss); **0** Severity 1 gaps in this slice.  
• **Key capability themes:** Offers & Contracts; Job Postings (1 gap each in this export).  
• **Regional specificity:** One row references France-specific context (EU data residency; French labour practice for offers); the other is bucketed under `France Services Tech Media` with France pipeline framing in pain text.  
• **Implication:** Even in a minimal slice, France TA deals surface **localised offer/compliance** and **distribution (job postings)** pressure; validate parity and workarounds via **101** and Deployment Agent before roadmap commits.

## Gap inventory

Sorted by severity score (1 = highest) then Created Date (newest first). **Opportunity Name** is not present in this export; **Gap Name** is used as the primary identifier column.

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|-------------|-------------------|----------|--------------|-------------|
| PG-90001003 | — (not in export) | Job Postings | 2 - Risk of Removal of SKU from Deal (2) | 01/03/2025 | — (column absent) |
| PG-90001001 | — (not in export) | Offers & Contracts | 3 - Risk of Deal Loss (3) | 15/01/2025 | — (column absent) |

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps in filtered France Talent Acquisition slice.

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 1 gap

**Top capabilities affected:**

1. **Job Postings:** 1 gap - PG-90001003 (`France Services Tech Media`)

**Key pain points** (from Pain point(s) field):

• France opp in correct France Opp Region bucket. (fixture / pipeline test narrative)

### Severity 3: Risk of Deal Loss

**Count:** 1 gap

**Top capabilities affected:**

1. **Offers & Contracts:** 1 gap - PG-90001001 (`France MFG HC & Edu`)

**Key pain points** (from Pain point(s) field):

• Recruiter needs offer templates aligned to French labour practice.

### Severity 4: Requires Partner/Workaround

**Count:** 0 gaps in filtered slice.

### Severity 5: Tolerable Manual Effort

**Count:** 0 gaps in filtered slice (excluded non-France and non-TA rows).

## Capability gap themes

### Theme 1: Offers & Contracts

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 1, S4: 0, S5: 0  
**Key observations:**

• **Country Specific Gap Detail** mentions a **France - EU data residency** ask (compliance / hosting dimension).  
• Pain text points to **French labour practice** alignment for offer templates (localisation / legal-adjacent product expectation).

**Deal examples:**

• PG-90001001: Severity 3, France MFG HC & Edu; EU residency + offer template localisation narrative.

### Theme 2: Job Postings

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 1, S3: 0, S4: 0, S5: 0  
**Key observations:**

• Severity 2 indicates **SKU removal risk** (buyer-reported presales signal).  
• CI Notes empty in export; treat competitive story as **unknown** until **101** enriches.

**Deal examples:**

• PG-90001003: Severity 2, France Services Tech Media; job posting / distribution pressure (fixture row).

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|------------------------------|--------|
| — | — | No CI Notes populated in this export | — |

### Parity Claims (Buyer-Reported)

• None stated in CI Notes for the filtered rows (empty field).

**Validation needed:** For any future France export with populated CI Notes, hand off competitor claims to **101** to verify Native / Workaround / True Gap against `research/competitive/matrices/fr-competitive-matrix.md`.

## Native vs workaround analysis

**Columns `Is Internal/Native` and `Is Industry Std` are absent** in this CSV. Per **108** protocol, Native vs workaround classification is **not applied** from this file alone.

**Recommendation:** When **130** builds Gap Analysis slides from a richer export, validate each gap via Deployment Agent and **101** as described in **108** / **130** integration notes.

## Competitive factor matrix

Top capabilities in this slice (N = 2 total):

| Capability | Severity 1-2 (Loss Risk) | Severity 3-5 (Workaround) | Is Internal (Native) |
|------------|---------------------------|----------------------------|----------------------|
| Job Postings | 1 gap (PG-90001003, S2) | — | Unknown (column absent) |
| Offers & Contracts | — | 1 gap (PG-90001001, S3) | Unknown (column absent) |

## Implications for roadmap

**Hypotheses** (not decisions):

1. **High-priority gaps** (Severity 1-2, frequency ≥3): **Not met in this tiny export** (only one S2 gap). With a full Tableau underlying pull, re-run **108** and re-evaluate frequency of S1-2 in France TA.

2. **Regional-specific** (France): **Offers & Contracts** tied to **French labour practice** and **EU data residency** narratives aligns with typical France compliance and localisation expectations; flag for **060** when PRDs touch consent, residency, or cross-border processing.

3. **Cross-regional gaps:** **Job Postings** pressure often appears in multiple regions; if confirmed at scale, prefer a **global** job distribution strategy (incl. Broadbean partnership posture per **010-style-guide**) with France-specific board coverage checks via **101**.

4. **Native but still gaps:** Not assessable without `Is Internal/Native`; recommend full export columns for presales dashboard.

## Link to competitive matrix (read-only)

**`research/competitive/matrices/fr-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap. **108** here is **buyer-reported** presales signal from a **small fixture**; **101** validates parity claims.

## Handoff to 120 (PMF triangulation)

**Gap Data (108) column for FR-E2E-001:**

• **Coverage:** 2 gaps after Product Area = Talent Acquisition, France Opp Region / Segment filter, and 5-year date window (see attestation for cascade counts).  
• **Top themes for triangulation:**

  1. **Offers & Contracts (localisation + residency narrative):** S1-2 count 0, Total 1 gap (S3) - **Recommend triangulation: Yes** (severity 3 + compliance-adjacent detail).  
  2. **Job Postings (SKU removal risk):** S1-2 count 1, Total 1 gap - **Recommend triangulation: Yes** (Severity 2).  

• **Cross-check:** When **120** cites competitive or frequency dynamics, combine **101** France scan + matrix with **108** once a **full** underlying export replaces this fixture.

## Sales enablement hooks (3-5 bullets)

• France TA presales rows can combine **offer template / labour practice** friction with **EU data residency** asks - arm SC with **060**-aware messaging and documented hosting / DPA story (validate with Legal before customer-facing claims).  
• **Severity 2** on **Job Postings** is a **deal-structure risk** signal - pair with **101** France parity on multipost and local boards (Broadbean coverage).  
• Empty **CI Notes** in this export limits battle-card quotes; pull richer underlying data for win-room narratives.  
• Treat all severity as **buyer perception** until Deployment Agent workaround pass (**130** guidance).  
• Link presales frequency to **fr-competitive-matrix.md** when **101** refreshes after FR-E2E-001 Step 1.

## Fresh pass attestation

- **Mission ID:** FR-E2E-001  
- **Target region:** France  
- **Source mode:** local gap-data  
- **Files read (this run):**
  - `research/France/gap-data/presales-gaps-export-unfiltered.csv` (primary; full file read for filtering and analysis)
  - `research/France/gap-analysis/_scratch-gap-sources-FR-E2E-001.md` (produced via `python3 scripts/dump_research_folder_to_text.py research/France/gap-data -o research/France/gap-analysis/_scratch-gap-sources-FR-E2E-001.md`)
- **Tableau MCP:** Not used (local export only).  
- **Filters applied:**
  - **Product Area:** Talent Acquisition (column present; exact match)  
  - **Opp Region / Opp Segment:** `France MFG HC & Edu`, `France Services Tech Media` (either field may match)  
  - **Created Date:** Last 5 years with cutoff **2021-03-27** inclusive logic: parsed as `DD/MM/YYYY`; rows on or after cutoff retained  
- **Filtering results:**
  - Total rows loaded (data rows only): **6**  
  - After Product Area filter: **5** (excluded 1 × HCM Core)  
  - After Regional filter: **2** (excluded Canada, APJ, Germany)  
  - After Date filter: **2** (both dates parseable and within window)  
  - **Final gap count for analysis:** **2**  
- **Columns absent (noted):** Deal Motion; Opportunity Name; Is Internal/Native; Is Industry Std.  
- **Ambiguities:** Export is a **small pipeline fixture** (6 rows); counts are **not** representative of production France TA volume - replace with full Presales Product Gaps underlying export for executive readouts.  
- **Completed (UTC):** 2026-03-27T12:00:00Z
