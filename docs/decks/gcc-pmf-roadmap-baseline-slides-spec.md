# GCC PMF roadmap deck – canonical baseline (v30 parity)

**Purpose:** Single repo source of truth for **length, section order, structure, and content-class coverage** of full **Recruiting PMF roadmap** slide decks. The human reference is **`~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx`** (**50 slides** as extracted 22 March 2026). Agents cannot reliably parse binary `.pptx`; use **`docs/decks/gcc-pmf-roadmap-v30-slide-inventory.md`** for the exact v30 sequence.

**Owning agent:** **130-pmf-slide-generator** (inputs: finalized **120-pmf-thematic-analysis** report). **110-slide-generator** is for **short** decks only (see **`110-slide-generator.mdc`**).

**JSON scaffold:** Prefer cloning **`slides_spec_vN.json`** only **after** aligning its **skeleton** to the **v30 inventory** (below). Copy-pasting older specs (e.g. v46+) without re-inserting missing blocks is a common cause of “deck doesn’t match v30”.

### Typography (v30)

Match **font sizes, body box height (2.8in), native bullets, and Product implication** styling to the human reference. See **[`gcc-pmf-roadmap-v30-typography.md`](./gcc-pmf-roadmap-v30-typography.md)**. **130** slide specs should use **`text_boxes[].paragraphs`** where appropriate (not only flat `text` with Unicode bullets).

---

## Guardrails (aligned to v30)

| Constraint | Rule |
|------------|------|
| **Target length** | **48–52 content slides** in the spec array (v30 = **50**). If the Slide Deck MCP **auto-inserts an agenda** slide, expect **+1** in the output `.pptx` vs array length — adjust so **total deck** still matches **v30 density**. |
| **Auto-agenda (slide 2)** | Injected by MCP. **Section Title** subtitle lines must use **plain-string** `paragraphs[].text` and **substantive** copy (12–22 words); run-arrays render as code on the agenda. See **130** rule. |
| **Forbidden drift** | Do **not** ship a “full PMF” deck that **omits** any **mandatory content-class** row in the inventory (SWOT, four Win/Loss slides, Ideation Hub block when CSV/ideas data exists, Full Funnel, Research Author) unless the PM explicitly requests a **focus deck**. |
| **Tone** | McKinsey-style density; British English on body text per **`010-style-guide.mdc`** |
| **Speaker notes** | Mandatory on every content slide except TITLE, Section Title, Bumper (per **`110-slide-generator` / 120** rules) |
| **PESTEL** | **Six** factor slides; each ends with **Product implication:** (per **`010-style-guide.mdc`**). **Body depth** must meet **130** v30 minimums (bullet count, anchors, sub-bullets, ~22-word implication) — see **`.cursor/rules/130-pmf-slide-generator.mdc`**. |
| **Primary research** | Interview strip + table + **one slide per customer**; **130** v30 minimums for intro and per-P slides (quote-led bullets, theme/JTBD, line counts). |

---

## Mandatory content classes (v30 order)

Cross-check against **`gcc-pmf-roadmap-v30-slide-inventory.md`** slide-by-slide.

1. **TITLE** — region + PMF research  
2. **Section divider** — confidential / section break (use **`Section Title`** or equivalent; subtitle may read “Workday Confidential” if policy requires)  
3. **Research Author** — who ran the analysis, date, sources  
4. **Executive Summary**  
5. **Section divider**  
6. **Research Question & Objectives**  
7. **5-Phase (Braun & Clarke) framework**  
8. **Section divider**  
9. **Strategic context** (why this market now)  
10. **Market momentum / key indicators**  
11. **Section divider**  
12. **PESTEL** — Political, Economic, Social, Technological, Environmental, Legal (**6 slides**)  
12a. **Section divider**  
13. **Competitive** — regional specialists (**1 slide**)  
14. **Competitive** — global platforms (**1 slide**)  
15. **Competitive SWOT** — Workday in region (**1 slide**) — **mandatory for v30 parity**  
15a. **Section divider**  
16. **Win/Loss** — **four** slides: dataset overview; top N gap themes (severity-weighted); gap charts; GCC-relevant / proxy gaps  
16a. **Section divider**  
17. **Primary research** — interview strip intro; participants table; **one slide per customer** (P1, P2, P3…)  
18. **Customer Ideation Hub / quant** — **four** slides when `raw-data` or ideas CSV supports it: overview (counts); top capability areas chart/table; key themes from verbatims; AI ideas spotlight (or equivalent)  
18a. **Section divider**  
19. **Thematic** — validated themes **split across up to 2 slides** + **triangulation matrix** (avoid replacing this with many single-theme deep dives unless adding slides **without** dropping inventory classes)  
19a. **Section divider**  
20. **Full funnel / gap diagnostic** — **at least one** slide (v30 uses “GCC Recruiting Gap Analysis - Full Funnel”; second slide may be divider or continuation — mirror v30 in file)  
20a. **Section divider**  
21. **Roadmap** — **one slide per recommendation** from the current PMF report (v30 had **6**; if the report has **8**, include **8** and add **E2E handoff** table — then **increase** divider or trim optional deep dives to stay near **50** total, or accept **52–54** with PM approval)  
22. **Bumper / closing**  

---

## Layout variety

Alternate **`Title Only`** and **`Title Only_Alt`** every 2–3 slides. Use **`Section Title`** for dividers (two `text_boxes` per **120** rule). Use **`1/2 Headline_Alt`** for key takeaways where appropriate. Use **charts/tables** on Win/Loss and Ideation slides to match v30 **information density**.

---

## Pre-flight (120, before `create_presentation`)

- [ ] Read **`docs/decks/gcc-pmf-roadmap-v30-slide-inventory.md`**  
- [ ] Read **`docs/decks/gcc-pmf-roadmap-v30-typography.md`** (body box 2.8in, 12pt section primary, 11pt body, PESTEL highlight)  
- [ ] Count slides in JSON: target **48–52** (explain if agenda MCP adds +1)  
- [ ] Confirm **Research Author**, **SWOT**, **4× Win/Loss**, **4× Ideation** (if data), **Full Funnel**, **6× PESTEL** present  
- [ ] Confirm recommendation count matches report + optional **E2E handoff** slide  

---

## Related paths

- **v30 inventory:** [`gcc-pmf-roadmap-v30-slide-inventory.md`](./gcc-pmf-roadmap-v30-slide-inventory.md)  
- **v30 typography:** [`gcc-pmf-roadmap-v30-typography.md`](./gcc-pmf-roadmap-v30-typography.md)  
- Rule: [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) (report from [`.cursor/rules/120-pmf-thematic-analysis.mdc`](../.cursor/rules/120-pmf-thematic-analysis.mdc))  
- Orchestrator: [`.cursor/rules/000-master-orchestrator.mdc`](../.cursor/rules/000-master-orchestrator.mdc)  
- Human reference: `~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx`  
