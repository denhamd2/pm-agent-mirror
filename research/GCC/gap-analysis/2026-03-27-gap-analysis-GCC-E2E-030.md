# GCC Gap Analysis (108) - Tableau Presales Data

**Analysis date:** 27 March 2026  
**Mission:** GCC-E2E-030  
**Source:** Local export (Presales-style gap extract)  
**Source files:** `research/GCC/gap-data/presales-gaps-export.csv`  
**Query / filters:** Product Area filter *skipped* (column absent). Regional filter: GCC **Filter 2 fallback** (keywords in `Pain point(s)`, `CI Notes`, `Country Specific Gap Detail`). Created Date filter *skipped* (column absent).

## Executive summary

• **Scope:** **1** presales gap row retained after regional filtering from **2** loaded rows (very small extract; not a full underlying-data export).  
• **Top severity:** **0** Severity 1-2 gaps in the GCC-filtered set; the retained gap is **Severity 5** (tolerable manual effort).  
• **Key capability signal:** Interview scheduling and **Microsoft ecosystem** friction (Outlook, Microsoft Teams, HiredScore experience) called out explicitly for **GCC** populations in the pain text.  
• **Regional specificity:** Strong GCC mention in the retained row; second row (**PG-00005541**, CareerPlug / job posting) had **no** GCC regional markers and was **excluded** per Filter 2.  
• **Implication:** Treat this file as a **sparse signal** only; refresh `gap-data/` with a broader **Talent Acquisition** + regional export from Presales Product Gaps for statistically meaningful frequency analysis. Triangulate the scheduling / Teams theme with **105** and **101** rather than relying on N=1 presales rows.

## Gap inventory

| Gap ID | Opportunity | Product Capability | Severity | Created Date | Deal Motion |
|--------|---------------|-------------------|----------|--------------|-------------|
| PG-00009165 | *Not in export* | *Blank in source; inferred: Interview scheduling / calendar & Teams integrations* | 5 - Tolerable, but Requires Some Manual Effort (5) | *Not in export* | *Not in export* |

**Excluded by regional filter (this run):**

| Gap ID | Reason |
|--------|--------|
| PG-00005541 | No GCC keyword match in `Pain point(s)`, `CI Notes`, or `Country Specific Gap Detail`; content is job-board / CareerPlug (competitor) integration, not GCC-scoped. |

## Severity-based grouping

### Severity 1: Significantly Contributed to Deal Loss / SKU Removal

**Count:** 0 gaps (GCC-filtered set)

### Severity 2: Risk of Removal of SKU from Deal

**Count:** 0 gaps (GCC-filtered set)

### Severity 3: Risk of Deal Loss

**Count:** 0 gaps (GCC-filtered set)

### Severity 4: Requires 3rd Party Partner or Custom Solution / Requires Significant Manual and/or Costly Workaround

**Count:** 0 gaps (GCC-filtered set)

### Severity 5: Tolerable, but Requires Some Manual Effort

**Count:** 1 gap

**Top capabilities affected (inferred from pain text):**

1. **Interview scheduling + Microsoft stack (Outlook, Teams, HiredScore):** 1 gap - **PG-00009165**

**Key pain points** (from Pain point(s) field):

• GCC High populations cannot use WD's integrations with Outlook for interview scheduling or MS Team's HiredScore experience.

## Capability gap themes

### Theme 1: Interview scheduling and Microsoft ecosystem (Outlook, Teams, HiredScore)

**Gap count:** 1 (inferred theme; `Product Capability` empty in source)  
**Severity distribution:** S1: 0, S2: 0, S3: 0, S4: 0, S5: 1  
**Key observations:**

• Buyer-reported friction ties **GCC** explicitly to **calendar / Teams**-adjacent scheduling and **HiredScore** experience.  
• **PERCEPTION** only until **101** and Deployment Agent validate native coverage, configuration gaps, and regional constraints.

**Deal examples:**

• **PG-00009165:** Severity 5, GCC-specific scheduling / integration narrative (no opportunity name in export).

## CI notes and competitive intelligence

### Competitor Mentions

| Competitor | Capability | Gap Context (from CI Notes) | Gap ID |
|------------|------------|----------------------------|--------|
| *None in GCC-filtered rows* | - | `CI Notes` empty for PG-00009165 | - |

**Note:** **PG-00005541** (excluded from GCC set) references **CareerPlug** in pain text; do **not** treat as GCC presales evidence without regional re-tagging in source data.

### Parity Claims (Buyer-Reported)

• *No explicit parity claim in CI Notes for the GCC-filtered gap; pain text describes integration usability for GCC populations.* (Gap ID: **PG-00009165**)

**Validation needed:** Hand off to **101-competitive-intelligence** and Deployment Agent to verify Outlook/Teams/HiredScore behaviour for GCC tenants versus buyer wording.

## Native vs workaround analysis

**Context:** Export does **not** include `Is Internal/Native` or `Is Industry Std` columns; analysis below is **not** possible from this file alone.

• **Flag:** Re-run **108** on a full Presales export that includes native/industry columns when available.

### Gaps where Is Internal/Native = Yes

*Column absent in source - no rows classified.*

### Gaps where Is Internal/Native = No

*Column absent in source - no rows classified.*

### Gaps where Is Industry Std = Yes

*Column absent in source - no rows classified.*

## Competitive factor matrix

| Capability | Severity 1-2<br/>(Loss Risk) | Severity 3-5<br/>(Workaround) | Is Internal<br/>(Native) |
|------------|------------------------------|--------------------------------|-------------------------|
| Interview scheduling / Microsoft (Outlook, Teams) + HiredScore (GCC) | 0 | 1 (S5, PG-00009165) | *Unknown - column absent* |

## Implications for roadmap

**Hypotheses** (not decisions):

1. **High-priority gaps** (Severity 1-2, frequency >=3): **None** in this extract after GCC filter. Do not infer absence of risk from N=1 sample.  
2. **Regional-specific** (GCC): Scheduling and Microsoft-integrated interview experience may deserve **qualitative** follow-up with **105** and solution engineering (GCC calendar norms, Teams adoption, HiredScore rollout).  
3. **Cross-regional gaps:** Not assessable from this file (too few rows).  
4. **Native but still gaps:** Not assessable without `Is Internal/Native`.

## Link to competitive matrix (read-only)

**`research/competitive/matrices/gcc-competitive-matrix.md`** remains authoritative for Native / Workaround / True Gap classification. **108** provides **buyer-reported** evidence from this export; **101** validates parity claims before battle cards.

## Handoff to 120 (PMF triangulation)

**Gap Data (108) column for GCC-E2E-030:**

• **Coverage:** **1** GCC-scoped gap row from local CSV (**2** rows loaded, **1** excluded by regional Filter 2). Product Area and Created Date filters **skipped** (columns absent).  
• **Top themes for triangulation:**

  1. **Interview scheduling + Microsoft stack (GCC):** Severity 1-2 count **0**, Total **1** gap at **S5**. **Triangulation:** Use as **supporting** evidence if **105** mentions Teams, Outlook, or scheduling pain in GCC; do **not** overweight presales severity from this micro-sample.

• **Cross-check:** Prefer **101** matrices + **105** quotes for strength of evidence; use **108** here to show presales **mentioned** GCC + scheduling/Microsoft in at least one logged gap.

## Sales enablement hooks (3-5 bullets)

• One logged presales gap explicitly links **GCC** populations to **Outlook / Teams** interview scheduling and **HiredScore** experience (PG-00009165); useful as a **story hook** only until validated.  
• Severity in export is **low (5)**; position as **workflow / integration polish**, not deal-loss headline, unless other systems contradict.  
• Competitor **CareerPlug** appears in a **non-GCC-filtered** row; avoid GCC battle-card use without correct Opp Region / geography in source.  
• Recommend fuller **gap-data** export for pipeline reviews and QBRs with presales.  
• Route Microsoft/HiredScore parity language through **101** + Deployment Agent before external messaging.

## Fresh pass attestation

- **Mission ID:** GCC-E2E-030  
- **Target region:** GCC (Gulf Cooperation Council; Filter 2 keyword fallback per **108-tableau-gap-analyser.mdc**)  
- **Source mode:** local `gap-data`  
- **Files read (this run):**
  - `research/GCC/gap-data/presales-gaps-export.csv`  
- **Scratch markdown (dump script):** `research/GCC/gap-analysis/_scratch-gap-sources-GCC-E2E-030.md` (from `python3 scripts/dump_research_folder_to_text.py research/GCC/gap-data -o research/GCC/gap-analysis/_scratch-gap-sources-GCC-E2E-030.md`)  
- **Tableau MCP:** Not used (local export only).  
- **Filters applied:**
  - **Product Area:** *Skipped - column absent in CSV*  
  - **Opp Region / Opp Segment:** *Columns absent; applied Filter 2 GCC keyword fallback on* `Pain point(s)`, `CI Notes`, `Country Specific Gap Detail` *using keywords:* gcc, saudi, uae, qatar, bahrain, kuwait, oman, gulf, menap, ksa, emirates *(match: **gcc** in Pain point(s) for PG-00009165)*  
  - **Created Date:** *Skipped - column absent*  
- **Filtering results:**
  - Total rows loaded: **2**  
  - After Product Area filter: **2** (*skipped - column absent*)  
  - After Regional filter: **1**  
  - After Date filter: **1** (*skipped - column absent*; final gap count **1**)  
- **Ambiguities:** `region-ambiguous` not invoked for PG-00009165 (explicit **GCC** in pain text). Export is **minimal** (no Opportunity, Deal Motion, dates, Product Area); statistical conclusions are **not** valid. **PG-00005541** excluded as non-GCC.  
- **Completed (UTC):** 2026-03-27T17:46:25Z  

---

**Logged path for orchestrator / MISSION_LOG:** `research/GCC/gap-analysis/2026-03-27-gap-analysis-GCC-E2E-030.md`
