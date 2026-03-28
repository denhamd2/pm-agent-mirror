# GCC Win-Loss Analysis (107)

**Analysis date:** 27 March 2026  
**Mission:** GCC-E2E-027  
**Source folder:** `research/GCC/win-loss-interviews/`  
**Scratch dump (this run):** `research/GCC/win-loss-analysis/_scratch-winloss-sources-GCC-E2E-027.md`

## Executive summary

• **Scope:** Single in-scope source: `Opportunity Detail.xlsx` (Sheet 1, **598** data rows) in `research/GCC/win-loss-interviews/`. No `.txt` or `.csv` interview transcripts were present.  
• **Regional filter (GCC / Gulf):** After applying the **107** three-tier filter (folder = GCC, then keyword scan for Gulf GCC markers, then exclusion of known false positives), **0** rows qualify as **Gulf Cooperation Council** recruiting win-loss evidence.  
• **False positive:** One row matches the substring **GCC** in **Pain point(s)** only because of **Microsoft GCC High** (US government cloud compliance) for **Outlook** / **MS Teams** / **HiredScore** scheduling constraints. **Opp Segment** is **North America**; this is **not** a Gulf market deal. Exclude from GCC PMF triangulation.  
• **Implication for 120:** Triangulation can cite this run for **Win-Loss (107)** discipline and global pipeline shape, but **GCC-specific** buyer criteria from win-loss are **not** evidenced in this extract. **105** and **101** remain primary for GCC narrative until more Gulf-labelled win-loss rows or transcripts are added.  
• **Sales enablement:** Treat **buyer-reported** pain in the excluded row as **perception**; validate **Native / Workaround / True gap** via **101** and Deployment Agent, not from win-loss alone.

## Deal inventory

| Source | Rows | Notes |
| --- | ---: | --- |
| `Opportunity Detail.xlsx` (Sheet 1) | 598 | Full export ingested; columns include `Gap Name`, `Opportunity`, `Deal Motion`, `Opportunity Stage `, `Opp Pipeline Stage`, `CI Notes`, `Pain point(s)`, `Proposed Solution`, `Country Specific Gap Detail`, `Industry Specific Gap Detail`, etc. |

**Inferred outcome (global export, not GCC-filtered):**

| Field | Top values (illustrative) |
| --- | --- |
| `Opportunity Stage ` | Won **179**, Open **136**, Do Nothing **107**, Lost **96**, Closed **39**, plus merged / qual-out buckets |
| `Opp Pipeline Stage` | 9- Closed/Won **179**, 31- Closed/Lost to Do Nothing **107**, 30- Closed/Lost to Competition **96**, plus earlier-stage pipeline rows |
| `Deal Motion` | Prospect - Land with Core **192**, Core Customer - Expand with Other **190**, Core Customer - Expand with Non-Core **103**, etc. |

**Gulf GCC-filtered rows:** **0** (after excluding the Microsoft **GCC High** row as non-Gulf).

**Excluded row (non-Gulf):**

| Gap ID / name | Opp segment | Why excluded |
| --- | --- | --- |
| PG-00009165 | North America | **Pain point(s)** references **GCC High** in the **Microsoft** compliance sense (integrations with Outlook, MS Teams, HiredScore), not Gulf states. |

## Buying criteria hierarchy

**Gulf GCC-labelled evidence in this extract:** insufficient to rank must-haves / nice-to-haves / deal-breakers **for the Gulf** from win-loss alone.

**Global patterns visible in the export (buyer perception, not verified product fact):**

| Tier | Themes (high level) | Evidence strength for GCC |
| --- | --- | --- |
| Must-have (inferred globally) | Core HCM / Recruiting land and expand; integration with email/calendar for scheduling | **Low** for Gulf: no qualifying rows |
| Important | Competitive losses and **Do Nothing** outcomes appear in stage counts; need row-level competitor fields in future extracts | **Low** for Gulf |
| Nice-to-have | **Brainstorm** / gap linkage fields present for some rows | N/A for Gulf in this file |
| Deal-breaker | **Microsoft GCC High**-style compliance constraints appear as **buyer-reported** pain in **one** non-Gulf row | **Not** generalisable to Gulf |

## Win themes

**[WinLoss-W01]** **Won** volume in the export is **179** (stage fields), but **no** Gulf GCC row subset supports a GCC-specific **why Workday won** story.

**[WinLoss-W02]** For **120** triangulation, **do not** treat global win counts as GCC validation without regional labels in `Country Specific Gap Detail` or equivalent.

## Loss themes

**[WinLoss-L01]** **Lost to Competition** **96** and **Lost to Do Nothing** **107** (pipeline stages) indicate global **stalling or competitive** pressure, but **not** attributable to Gulf countries in this extract.

**[WinLoss-L02]** The **Microsoft GCC High** pain (row PG-00009165) is a **loss / integration** narrative for **US** government cloud constraints, **not** Gulf nationalisation, WhatsApp, or local job boards.

## Competitive factor matrix

Rows = factors relevant to Recruiting PMF; columns = Win / Loss / Mixed. Cells summarise **this extract** only (buyer perception).

| Factor | Win | Loss | Mixed |
| --- | --- | --- | --- |
| Gulf country-labelled win-loss rows | No evidence | No evidence | Export is **global**; **0** Gulf rows after filter |
| Scheduling / calendar integrations | Global wins exist | **One** row cites **GCC High** constraints (non-Gulf deal) | Perception: compliance stacks affect scheduling integrations |
| Localisation / nationalisation | No Gulf rows | No Gulf rows | **Data gap** for **107** |
| WhatsApp / messaging | No Gulf rows | No Gulf rows | **Data gap** |

## Implications for product roadmap

Hypotheses only (not decisions):

1. **Enrich win-loss exports** with reliable **country / region** (or mandate **Country Specific Gap Detail** for Gulf opportunities) so **107** can surface **GCC** buying criteria without keyword ambiguity.  
2. **Do not** prioritise **Microsoft GCC High** work for **Gulf** PMF on the basis of this row; route **US** public sector / compliance questions to the appropriate segment.  
3. For **GCC** roadmap gaps (WhatsApp, nationalisation reporting, local boards), continue to lean on **105**, **101**, **106**, and **120** until Gulf win-loss density improves.

## Link to competitive matrix (read-only)

**`research/competitive/matrices/gcc-competitive-matrix.md`** remains the authoritative **Native / Workaround / True gap** reference. **107** does **not** change matrix rows. **101** should validate any **buyer-reported** capability from **Opportunity Detail** before parity claims.

## Handoff to **120** (PMF triangulation)

**Win-Loss (107) column for GCC-E2E-027:**

• **Coverage:** Full re-read of `research/GCC/win-loss-interviews/` via scratch dump; **598** spreadsheet rows; **0** Gulf GCC rows after filtering.  
• **Triangulation:** Use this run to document **sparse** win-loss evidence for **Gulf** and **avoid** double-counting the **Microsoft GCC High** row as GCC.  
• **Cross-check:** If **120** cites competitive dynamics, prefer **101** Step 1 scan and matrix changelog for **GCC-E2E-027** over win-loss alone.

## Sales enablement hooks (3–5 bullets)

• Battle cards should **not** cite **GCC High** as Gulf weakness without segment clarification (US gov cloud vs Gulf).  
• **Do Nothing** and **Lost to Competition** counts in the export are **global**; **do not** pitch them as GCC-specific without regional splits.  
• When **Country Specific Gap Detail** is populated for Gulf, re-run **107** to refresh buying criteria.  
• For **integration** objections, hand off to **101** for Workday vs competitor positioning and Deployment Agent for **actual** integration posture.  
• **Buyer-reported** pain in spreadsheets remains **perception** until validated.

## Fresh pass attestation

- **Mission ID:** GCC-E2E-027  
- **Target region:** GCC (Gulf Cooperation Council recruiting context)  
- **Win-loss source files read (this run):**  
  - `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (Tier 1: folder match; **598** rows on Sheet 1; scratch: `research/GCC/win-loss-analysis/_scratch-winloss-sources-GCC-E2E-027.md`)  
  - `research/GCC/win-loss-interviews/.gitkeep` (ignored; no transcript content)  
- **Row-level filter (Gulf GCC):**  
  - Keyword scan across all columns for: `gcc`, `saudi`, `uae`, `qatar`, `bahrain`, `kuwait`, `oman`, `gulf`, `emirates`, `dubai`, `riyadh` (case-insensitive).  
  - **Matches:** **1** row (PG-00009165); **classified as non-Gulf** (Microsoft **GCC High**, North America segment).  
  - **Gulf GCC rows included after filter:** **0**  
- **Files excluded (region mismatch):**  
  - None at file level (only `Opportunity Detail.xlsx` plus `.gitkeep`).  
  - **Excluded at row level:** PG-00009165 (Microsoft **GCC High**; not Gulf GCC).  
- **Completed (UTC):** 2026-03-27T12:00:00Z  

---

**Remember:** Win-loss exports are **biased** and **segment-mixed**. Triangulate with **105**, **106**, **101**, and **120** before treating themes as settled product truth.
