# France Gap Analysis (108) - Local Presales Export (Unfiltered Extract)

**Analysis date:** 27 March 2026  
**Mission:** Standalone (France test)  
**Source:** Local CSV; **Tableau export was not pre-filtered by Opp Region** — **108** applied **Filter 2** locally per rule.  
**Source file:** `research/France/gap-data/presales-gaps-export-unfiltered.csv`

## Executive summary

• **Scope:** 2 gaps after **Product Area**, **Opp Region**, and **Created Date** filters (from 6 loaded rows).  
• **Local Opp Region rule:** France maps to **`France MFG HC & Edu`** and **`France Services Tech Media`** only (exact match on `Opp Region` / `Opp Segment` per Rule 108). Rows with **UKI***, **Germany***, Canada, and APJ are **not** part of the France allow-list.  
• **Top severity:** 1× Severity 2 (SKU removal risk), 1× Severity 3 (deal loss risk).  
• **Implication:** Unfiltered extracts are supported: load full file, then **always** apply regional allow-lists locally. **Do not** use `UKI CB Majors` for France or Germany.

## Filter cascade (attested)

| Stage | Count | Notes |
|-------|------:|-------|
| Rows loaded | 6 | Full export |
| After Product Area = Talent Acquisition | 5 | Excluded 1× HCM Core row |
| After Opp Region / Opp Segment ∈ {France MFG HC & Edu, France Services Tech Media} | 2 | Excluded Canada, APJ 1, Germany LE |
| After Created Date (last 5 years from 27 March 2026) | 2 | All remaining rows in range |

## Gap inventory

| Gap ID | Opportunity | Opp Region | Product Capability | Severity | Created Date |
|--------|-------------|------------|-------------------|----------|--------------|
| PG-90001001 | Not in export | France MFG HC & Edu | Offers & Contracts | 3 – Risk of Deal Loss | 15/01/2025 |
| PG-90001003 | Not in export | France Services Tech Media | Job Postings | 2 – Risk of Removal of SKU from Deal | 01/03/2025 |

## Severity-based grouping

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 1  

• **Job Postings:** PG-90001003 — buyer-reported gap in correct **France Services Tech Media** bucket.

### Severity 3: Risk of Deal Loss

**Count:** 1  

• **Offers & Contracts:** PG-90001001 — French labour practice alignment (`Country Specific Gap Detail` cites France).

## Capability gap themes

### Offers & Contracts

**Gap count:** 1 | **S3:** 1  
**Observations:** EU / residency and French labour practice context (PERCEPTION until validated).

### Job Postings

**Gap count:** 1 | **S2:** 1  
**Observations:** Elevated severity; validate against deployment and competitor posture via **101**.

## CI notes and competitive intelligence

No competitor names in CI Notes for this sample; pain text only.

## Native vs workaround analysis

`Is Internal/Native` not in export — skipped.

## Competitive factor matrix

| Capability | Severity 1–2 | Severity 3–5 | Is Internal |
|------------|--------------|---------------|-------------|
| Job Postings | 1 (S2) | 0 | Unknown |
| Offers & Contracts | 0 | 1 (S3) | Unknown |

## Implications for roadmap

• France slice uses **France-labelled** Opp Regions only; DACH opps fall under **`Germany *`** / **`UKI *`** buckets separately.  
• S2 on job postings warrants **101** parity check on local boards / ATS expectations.

## Link to competitive matrix (read-only)

For EU recruiting context, run **101** regional scans and matrices under `research/competitive/matrices/` (e.g. UK matrix for **UKI**-labelled deals — distinct from France-labelled Opp Regions). **101** remains source of truth for Native / Workaround / True Gap.

## Handoff to 120 (PMF triangulation)

**Gap Data (108):** France Opp Region slice (`France MFG HC & Edu`, `France Services Tech Media`), **n=2** (test file). Themes: **Offers & Contracts** (S3), **Job Postings** (S2).

## Sales enablement hooks

• French labour / offer workflow expectations — discovery for **France-labelled** presales gaps.  
• S2 job posting gap — confirm Broadbean / board coverage before citing externally.

## Fresh pass attestation

- **Mission ID:** Standalone  
- **Target region:** France  
- **Source mode:** local gap-data  
- **Unfiltered Tableau export:** Yes — **Opp Region filter applied by 108 locally**  
- **Allowed Opp Region / Opp Segment values (France):** `France MFG HC & Edu`, `France Services Tech Media`  
- **Files read (this run):**  
  - `research/France/gap-data/presales-gaps-export-unfiltered.csv` (6 rows + header)  
- **Filtering results:** Loaded 6 → after Product Area 5 → after regional 2 → after date 2  
- **Regional sanity:** `Germany LE` and `Canada LE & Industries` excluded; **UKI not used** for France allow-list  
- **Completed (UTC):** 2026-03-27T14:00:00Z  
