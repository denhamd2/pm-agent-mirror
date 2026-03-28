# GCC Gap Analysis (108) - Local Presales Export

**Analysis date:** 27 March 2026  
**Mission:** Standalone  
**Source:** Local CSV export (107-style ingestion)  
**Source files:** `research/GCC/gap-data/presales-gaps-export.csv` (copy of filtered Opportunity Detail-style extract)  
**Query / filters:** Product Area = *column absent — filter skipped* | Region = *GCC (folder + row content)* | Created Date = *column absent — filter skipped*

## Executive summary

• **Scope:** 2 gap rows loaded from local `gap-data/` after regional inclusion (GCC signals in pain text / legacy filtered extract).  
• **Top severity:** 0 Severity 1–2 gaps; 1 Severity 3 gap (SKU removal risk); 1 Severity 5 gap (tolerable manual effort).  
• **Key capability themes:** Job postings / competitor integration (1 row); interview scheduling + Outlook / MS Teams / HiredScore (1 row; capability field blank in source).  
• **Regional specificity:** Both rows are GCC-relevant (explicit GCC wording or legacy GCC-filtered extract).  
• **Implication:** Small sample validates **108** local pipeline; expand `gap-data/` with full Presales **Underlying Data** export for inventory-scale analysis.

## Gap inventory

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|-------------|-------------------|----------|--------------|-------------|
| PG-00009165 | Not in export | *(not specified in source)* | 5 – Tolerable, but Requires Some Manual Effort | Not in export | Not in export |
| PG-00005541 | Not in export | Job Postings | 3 – Risk of Removal of SKU from Deal | Not in export | Not in export |

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps  

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 0 gaps  

### Severity 3: Risk of Deal Loss / Risk of Removal of SKU from Deal (labelled 3)

**Count:** 1 gap  

**Top capabilities affected:**  
1. Job Postings: 1 gap – CareerPlug integration / dual-posting friction (buyer-reported).

**Key pain points:**  
• Prospect would need to post in CareerPlug and manually move applicants to Workday, or stay on CareerPlug only (PG-00005541).

### Severity 5: Tolerable, but Requires Some Manual Effort

**Count:** 1 gap  

**Top capabilities affected:**  
1. Interview scheduling / ecosystem: 1 gap – GCC populations unable to use Outlook scheduling integrations or MS Teams HiredScore experience as described in export (PG-00009165).

**Key pain points:**  
• GCC High populations cannot use WD’s integrations with Outlook for interview scheduling or MS Teams HiredScore experience (PG-00009165).

## Capability gap themes

### Theme 1: Job Postings (CareerPlug competitor context)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 1, S4: 0, S5: 0  
**Key observations:**  
• Buyer-reported workflow cost: maintaining two systems vs single competitor ATS.  
• **Competitive context:** CareerPlug named as competitor (PERCEPTION — validate via **101**).

**Deal examples:**  
• PG-00005541: S3, CareerPlug integration / candidate data movement.

### Theme 2: Interview scheduling and integrations (Outlook / Teams / HiredScore)

**Gap count:** 1  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 0, S5: 1  
**Key observations:**  
• GCC-specific constraint called out in pain text.  
• Product Capability blank in source; theme inferred from pain point wording.

**Deal examples:**  
• PG-00009165: S5, Outlook and MS Teams HiredScore experience limitations for GCC populations.

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|-----------------------------|--------|
| CareerPlug | Job Postings | Dual posting / data movement vs Workday-only (pain text; CI Notes empty) | PG-00005541 |

### Parity Claims (Buyer-Reported)

• CareerPlug positioned as path of least resistance if Workday integration is missing: pain narrative on PG-00005541 (PERCEPTION — **101** to validate).

**Validation needed:** Hand off to **101-competitive-intelligence** for Native / Workaround / True Gap on CareerPlug and job board workflows.

## Native vs workaround analysis

**Is Internal/Native / Is Industry Std:** not present in this export — cannot split native vs true gap from file alone. Note in attestation.

## Competitive factor matrix

| Capability | Severity 1–2 (Loss risk) | Severity 3–5 (Workaround / tolerable) | Is Internal (Native) |
|------------|--------------------------|----------------------------------------|------------------------|
| Job Postings | 0 | 1 (S3) | Unknown (column absent) |
| Interview scheduling / integrations (inferred) | 0 | 1 (S5) | Unknown (column absent) |

## Implications for roadmap

**Hypotheses (not decisions):**

1. **High-priority gaps:** No S1–2 rows in this sample; monitor full export for loss-risk concentration.  
2. **Regional-specific:** GCC wording on scheduling / Teams / HiredScore — validate GCC deployment and partnership patterns before roadmap bets.  
3. **Cross-regional:** Job board + competitor ATS coexistence is a recurring enterprise theme — triangulate with **105** / **107**.  
4. **Data quality:** Add `Product Area`, `Opportunity`, `Created Date`, and native flags to exports for standard **108** filtering.

## Link to competitive matrix (read-only)

**`research/competitive/matrices/gcc-competitive-matrix.md`** remains authoritative. **108** adds buyer-reported signals from presales exports.

## Handoff to 120 (PMF triangulation)

**Gap Data (108) column (Standalone, limited sample):**

• **Coverage:** 2 gaps from local CSV (GCC-context); **not** a full Tableau population.  
• **Themes for triangulation (when merged with richer export):**  
  1. Job Postings / competitor board workflow: S3, 1 gap  
  2. Scheduling + Microsoft ecosystem + HiredScore in GCC: S5, 1 gap  

• **Cross-check:** Prefer **101** + **105** + **107** for frequency; this file is a **pipe validation** sample only.

## Sales enablement hooks

• One S3 gap on maintaining two posting systems (CareerPlug vs Workday) — useful discovery question in GCC and mid-market displacements.  
• GCC scheduling + Teams / Outlook / HiredScore narrative — confirm current enablement and docs before competitive reps repeat.  
• Full **Underlying Data** export needed for defensible gap counts and battle-card frequency.

## Fresh pass attestation

- **Mission ID:** Standalone  
- **Target region:** GCC  
- **Source mode:** local gap-data  
- **Files read (this run):**  
  - `research/GCC/gap-data/presales-gaps-export.csv` (Tier 1: `research/GCC/gap-data/`; 2 data rows after header)  
- **Tableau MCP:** Not used (local test).  
- **Filters applied:**  
  - Product Area: *skipped — column not in export*  
  - Regional: included by placement under `research/GCC/gap-data/` and GCC-specific pain text in source  
  - Created Date: *skipped — column not in export*  
- **Filtering results:**  
  - Total rows loaded: 2  
  - After Product Area filter: 2 (no column)  
  - After Regional filter: 2  
  - After Date filter: 2 (no column)  
  - Final gap count: 2  
- **Scratch markdown:** Not required (CSV only, no `.xlsx`).  
- **Ambiguities:** Minimal row count; `Product Capability` blank for PG-00009165; no Opportunity / Created / native columns.  
- **Completed (UTC):** 2026-03-27T12:00:00Z  
