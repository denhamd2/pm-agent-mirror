# Win-loss analysis (GCC) — GCC-E2E-025

## Executive summary

• **Source:** `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (598 rows, one sheet). Flattened via `scripts/dump_research_folder_to_text.py` to `research/GCC/win-loss-analysis/_scratch-winloss-sources-GCC-E2E-025.md` for this run.

• **Gulf GCC coverage:** After applying **107** regional filtering (Tier 1 folder include, row-level Gulf keywords in `Country Specific Gap Detail`, `Gap Name`, `CI Notes`, `Pain point(s)`, `Proposed Solution`, `Gap Summary`, `Headliner Feature`, `Functionality Requirement`, `Opportunity`), **zero rows** reference Gulf Cooperation Council recruiting markets (Saudi, UAE, Qatar, Bahrain, Kuwait, Oman, nationalisation, Qiwa, Mudad, etc.).

• **Country column gap:** `Country Specific Gap Detail` is **empty for all 598 rows**, so row-level regional slicing per **107** Spreadsheet Filtering could not use that field.

• **Opp Segment distribution:** Predominantly **North America** (532), plus **EMEA** (29), **APAC** (25), and small other segments. EMEA rows contained **no** Middle East or Gulf keyword matches in the scanned columns.

• **False positive resolved:** One row matches the substring **GCC** in **Microsoft GCC High** (US government cloud compliance), **not** Gulf GCC. That row is **out of scope for Gulf win-loss themes** and is listed under **Excluded from Gulf synthesis** below.

• **Handoff to 120:** Treat **Win-Loss (107)** as a **data gap** for **Gulf-specific** buying criteria from this export; triangulate with **105**, **106**, **101**, and customer transcripts rather than this spreadsheet alone.

---

## Deal inventory

| Scope | Rows | Notes |
| --- | ---: | --- |
| Total in export | 598 | Sheet `Sheet 1` |
| `Country Specific Gap Detail` non-empty | 0 | No regional tagging in this column |
| **Gulf GCC region (content-filtered)** | **0** | No Saudisation, UAE, Qatar, Bahrain, Kuwait, Oman, Qiwa, Mudad, Bayt, Naukrigulf, etc. in scoped text fields |
| Opp Segment = North America | 532 | |
| Opp Segment = EMEA | 29 | No Gulf keyword hits in scanned columns |
| Opp Segment = APAC | 25 | |

**Ambiguous / excluded from Gulf synthesis (1 row)**

| Gap Name | Opp Segment | Headliner / theme | Reason excluded from Gulf |
| --- | --- | --- | --- |
| PG-00009165 | North America | WD doesn't support GCC High | **Microsoft GCC High** (US gov cloud); pain: Outlook / Teams integrations for that population. Not Gulf market. |

---

## Buying criteria hierarchy

**Gulf-specific:** **Insufficient evidence** in this export to rank must-have / nice-to-have / deal-breaker **for Gulf** buyers.

**Buyer-reported constraint (non-Gulf, PG-00009165):** For populations on **Microsoft GCC High**, **buyer perception** is that Workday does not support required integrations with Outlook (interview scheduling) and MS Teams (HiredScore experience). Validate with **101** / Deployment Agent; classify Native / Workaround / True Gap formally outside **107**.

---

## Win themes / Loss themes

**Gulf GCC:** No rows classified as wins or losses **for Gulf** in this extract; **Opportunity Stage** / pipeline fields are globally mixed and not interpreted here as Gulf outcomes.

**Non-Gulf annotation only:** The PG-00009165 row is **Open**, **4- Pre-Close**; it does not provide a closed win or loss outcome for thematic coding **[WinLoss]**.

---

## Competitive factor matrix (Gulf)

| Factor | Win | Loss | Mixed | Evidence in this export (Gulf) |
| --- | --- | --- | --- | --- |
| Local compliance / nationalisation | — | — | — | No Gulf rows |
| Messaging / WhatsApp | — | — | — | No Gulf rows |
| Scheduling / integrations | — | — | — | No Gulf rows |
| Implementation / time-to-value | — | — | — | No Gulf rows |

---

## Implications for product roadmap (hypotheses, not decisions)

• **Do not** infer Gulf roadmap priorities from this Opportunity Detail export alone; **120** should label **107** as **sparse / data gap** for Gulf in the triangulation matrix unless additional win-loss sources are added under `research/GCC/win-loss-interviews/`.

• **Microsoft GCC High** (US) is a **separate** compliance and integration thread from **Gulf** nationalisation or Mudad; avoid conflating acronyms in executive readouts.

• **Sales enablement hooks (buyer-reported, validate elsewhere):**

  • If targeting US gov contractors on GCC High, expect **scheduling and Teams-adjacent integration** questions; route competitive response through **101**, not from this Gulf-scoped **107** file.

---

## Link to competitive matrix (read-only)

• `research/competitive/matrices/gcc-competitive-matrix.md` — use **101** outputs for Native / Workaround / True Gap; **107** did not add new Gulf win-loss evidence from this extract.

---

## Fresh pass attestation

• **Mission ID:** GCC-E2E-025

• **Target region:** GCC (Gulf Cooperation Council recruiting markets)

• **Win-loss source files read (this run):**

  • `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (Tier 1: folder `research/GCC/win-loss-interviews/`; 598 rows on `Sheet 1`; **Gulf-relevant rows after keyword and Microsoft GCC High exclusion: 0**)

  • `research/GCC/win-loss-analysis/_scratch-winloss-sources-GCC-E2E-025.md` (dump produced by `python3 scripts/dump_research_folder_to_text.py research/GCC/win-loss-interviews -o research/GCC/win-loss-analysis/_scratch-winloss-sources-GCC-E2E-025.md`)

• **Files excluded (region mismatch):**

  • None at file level (single `.xlsx` in folder; `.gitkeep` ignored by dump script).

  • **Row-level:** PG-00009165 excluded from **Gulf** synthesis: **Microsoft GCC High** (US government cloud), not Gulf GCC (Tier 2/3: keyword `GCC` refers to Microsoft environment).

• **Completed (UTC):** 2026-03-27T18:00:00Z

---

**Remember:** Win-loss extracts are **biased** and this export is **not Gulf-enriched**. Triangulate with **105**, **106**, **101**, and **120** before treating any theme as settled product truth.
