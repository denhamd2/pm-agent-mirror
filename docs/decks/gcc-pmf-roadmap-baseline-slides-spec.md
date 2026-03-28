# GCC PMF roadmap deck – canonical baseline (v65 parity)

**Purpose:** Single repo source of truth for **length, section order, structure, and content-class coverage** of full **Recruiting PMF roadmap** slide decks. The human reference is **`~/Downloads/GCC_Recruiting_PMF_Roadmap_v65.pptx`**. Agents cannot reliably parse binary `.pptx`; use this document and the 130 rule for the exact sequence.

**Region Applicability:** This baseline is derived from the GCC v65 deck but applies to **all Regional E2E pipelines** (GCC, UK, France, Germany, Japan, India, Canada, Australia). When generating decks for other regions, substitute region names in slide titles (e.g., "Why GCC Now" becomes "Why France Now" for a France PMF deck).

**Owning agent:** **130-pmf-slide-generator** (inputs: finalized **120-pmf-thematic-analysis** report). **110-slide-generator** is for **short** decks only (see **`110-slide-generator.mdc`**).

**JSON scaffold:** Prefer cloning **`slides_spec_vN.json`** only **after** aligning its **skeleton** to the **v65 inventory** (below). Copy-pasting older specs (e.g. v46+) without re-inserting missing blocks is a common cause of “deck doesn’t match v65”.

### Typography (v65)

Match **font sizes, body box height (2.8in), native bullets, and Product implication** styling to the human reference. See **`010-style-guide.mdc`**. **130** slide specs should use **`text_boxes[].paragraphs`** where appropriate (not only flat `text` with Unicode bullets).

---

## Guardrails (aligned to v65)

| Constraint | Rule |
|------------|------|
| **Target length** | **~50-60 content slides** in the spec array (v65 parity). Do not be too strict about matching v30 length exactly; it's only indicative. |
| **Auto-agenda (slide 2)** | Injected by MCP. **Section Title** subtitle lines must use **plain-string** `paragraphs[].text` and **SHORT** format (2-4 words: "PESTEL", "Primary research"). Do NOT use verbose pipe-separated descriptions. See **130** rule. |
| **Forbidden drift** | Do **not** ship a “full PMF” deck that **omits** any **mandatory content-class** row in the inventory (SWOT, Win/Loss slides, Ideation Hub block when CSV/ideas data exists, Full Funnel) unless the PM explicitly requests a **focus deck**. |
| **Tone** | McKinsey-style density; British English on body text per **`010-style-guide.mdc`** |
| **Speaker notes** | Mandatory on every content slide except TITLE, Section Title, Bumper (per **`110-slide-generator` / 120** rules) |
| **PESTEL** | **Six** factor slides; titles are **factor name only** (no "PESTEL -" prefix); each ends with **Product implication:** (per **`010-style-guide.mdc`**). **Body depth** must meet **130** v65 minimums (bullet count, anchors, sub-bullets, ~22-word implication) — see **`.cursor/rules/130-pmf-slide-generator.mdc`**. |
| **Primary research** | Interview strip + table + **one slide per customer**; **130** v65 minimums for intro and per-P slides (quote-led bullets, theme/JTBD, line counts). |
| **Strategic Context** | **Two separate slides** per v65: "Strategic Context - Why [REGION] Now" + "[REGION] Market Momentum - Key Indicators" (substitute actual region name, e.g., GCC, France, Japan). Do NOT combine unless PM requests compressed format. |
| **Recommendations** | **MAXIMUM 5 recommendation slides** (select highest-impact from report). Slide titles must be "Recommendation N: [Title]". |
| **Title slide subheader** | **"[Month YYYY]"** only (e.g., "March 2026"). Do NOT include "Thematic analysis and roadmap" prefix or version numbers. |

---

## Mandatory content classes (v65 order)

Cross-check against **`gcc-pmf-roadmap-v65-slide-inventory.md`** (legacy reference) but apply v65 updates.

1. **TITLE** — region + PMF research  
2. **Section divider** — section break (use **`Section Title`** or equivalent)  
3. **Executive Summary**  
4. **Section divider**  
5. **Research Question & Objectives** (Do NOT include the "Research Approach - 5-Phase Framework" slide)  
6. **Section divider**
7. **Strategic Context - Why [REGION] Now** (market forces, buying committee dynamics, enterprise consolidation narrative; substitute actual region name) — **separate slide 1 of 2**
8. **[REGION] Market Momentum - Key Indicators** (market size, CAGR, smartphone penetration, digital transformation metrics; substitute actual region name) — **separate slide 2 of 2**
9. **Section divider**
10. **Product Strategy** — Q2 2026 Product Priorities (**1 slide**, required when Step 0 strategy context exists)
11. **Product Strategy** — Regional Expansion Strategy (**1 slide**, optional)
12. **Product Strategy** — Competitive Positioning (**1 slide**, optional)
13. **Section divider**
14. **PESTEL** — Political, Economic, Social, Technological, Environmental, Legal (**6 slides**; titles are factor name only, no "PESTEL -" prefix)
15. **Section divider**
16. **Competitive** — regional specialists (**1 slide**)
17. **Competitive** — global platforms (**1 slide**)
18. **Competitive SWOT** — Workday in region (**1 slide**) — **mandatory for v65 parity**
19. **Section divider**
20. **Win/Loss** — **three** slides: top N gap themes (severity-weighted); gap charts; GCC-relevant / proxy gaps (NO Dataset Overview slide)
21. **Section divider**
22. **Customer Ideation Hub / quant** — **three** slides when `raw-data` or ideas CSV supports it: (1) overview with counts, (2) top capability areas chart/table, (3) key themes with subheaders and quotes. **REMOVED**: AI ideas spotlight slide.
23. **Section divider**
24. **Primary research** — interview strip intro; participants table; **one slide per customer** (P1, P2, P3…)
25. **Section divider**
26. **Thematic** — **2-3 grouped slides** with 3-4 theme subheaders per slide (EXACTLY 3 bullets per theme: Key Insight & Evidence, Business Impact, Product Implications) + **triangulation matrix**
27. **Section divider**
28. **Full funnel / gap diagnostic** — **at least one** slide titled "Gap Analysis"
29. **Section divider**
30. **Roadmap** — **MAX 5 recommendation slides** (select highest-impact from report); **E2E handoff table** (all recommendations) for Regional E2E pipeline only
31. **Bumper / closing**

---

## Layout variety

Alternate **`Title Only`** and **`Title Only_Alt`** every 2–3 slides. Use **`Section Title`** for dividers (two `text_boxes` per **120** rule). Use **`1/2 Headline_Alt`** for key takeaways where appropriate. Use **charts/tables** on Win/Loss and Ideation slides to match v65 **information density**.

---

## Pre-flight (130, before `create_presentation`)

- [ ] Read **`010-style-guide.mdc`** for typography  
- [ ] Count slides in JSON: target **~50-60** (explain if agenda MCP adds +1)  
- [ ] Confirm **SWOT**, **3× Win/Loss**, **3× Ideation** (if data), **Gap Analysis**, **6× PESTEL** present  
- [ ] Confirm **2 Strategic Context slides** (Why [REGION] Now + Market Momentum; substitute actual region name)
- [ ] Confirm **1-3 Product Strategy slides** present (after Strategic Context; sourced from Step 0 strategy context file)
- [ ] Confirm **MAX 5 recommendations** + optional **E2E handoff table** (for Regional E2E pipeline only)
- [ ] Confirm **PESTEL titles** use factor name only (no "PESTEL -" prefix)  
- [ ] Confirm **section divider subtitles** are SHORT (2-4 words), not verbose pipe descriptions  
- [ ] Confirm **Thematic Analysis** uses grouped pattern (2-3 slides with 3-4 themes per slide; EXACTLY 3 bullets per theme)  
- [ ] Confirm **Gap Analysis** slide is titled exactly "Gap Analysis"  
- [ ] Confirm **Recommendation** slide titles are "Recommendation N: [Title]"  

---

## Related paths

- Rule: [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) (report from [`.cursor/rules/120-pmf-thematic-analysis.mdc`](../.cursor/rules/120-pmf-thematic-analysis.mdc))  
- Orchestrator: [`.cursor/rules/000-master-orchestrator.mdc`](../.cursor/rules/000-master-orchestrator.mdc)  
- Human reference: `~/Downloads/GCC_Recruiting_PMF_Roadmap_v65.pptx`  
