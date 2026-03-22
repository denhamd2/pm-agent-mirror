# GCC PMF roadmap deck – canonical baseline (structure)

**Purpose:** Single repo source of truth for **length, section order, and structure** of full **Recruiting PMF roadmap** slide decks (e.g. `GCC_Recruiting_PMF_Roadmap_v30.pptx` and later `vN` outputs under `~/Downloads/`). Agents cannot reliably parse binary `.pptx`; this document plus **`120-pmf-thematic-analysis.mdc`** Phase 6b define what “match the PMF deck” means.

**Owning agent:** **120-pmf-thematic-analysis** (Phase 6b). **110-slide-generator** is for **short** decks only (see **`110-slide-generator.mdc`**).

**JSON scaffold:** When generating a new version, start from the latest `slides_spec_v*.json` in the repo root (or `slides_spec.json`) as a **layout skeleton**, then replace all body content from the current thematic analysis report. Full schema rules live in **`120-pmf-thematic-analysis.mdc`** (placeholders, `layout_name`, Section Title `text_boxes`, speaker notes, PESTEL “Product implication”).

---

## Guardrails

| Constraint | Rule |
|------------|------|
| **Length** | **36–50 slides** unless the PM explicitly asks for a **focus deck** only |
| **Compressed decks** | Forbidden by default: no skipping PESTEL (six factors), Win/Loss, Primary Research (participants + P1–P3), Thematic Analysis, or Roadmap / E2E handoff |
| **Tone** | McKinsey-style density; British English on body text per **`010-style-guide.mdc`** |
| **Speaker notes** | Mandatory on every content slide except TITLE, Section Title, Bumper |
| **PESTEL** | One slide per factor; each ends with **Product implication:** (format per **`010-style-guide.mdc`**) |

---

## Section order (mandatory)

1. **Title + Executive Summary** (2 slides)
2. **SECTION: Research Challenge** (section divider + 2 content slides)
3. **SECTION: Context Review** (section divider + 2+ slides)
4. **SECTION: PESTEL Analysis** (section divider + **6** factor slides: Political, Economic, Social, Technological, Environmental, Legal)
5. **SECTION: Competitive Landscape** (section divider + 2 slides)
6. **SECTION: Win/Loss Overview** (section divider + 2 slides)
7. **SECTION: Primary Research** (section divider + participants table + **one slide per customer** P1, P2, P3…)
8. **SECTION: Thematic Analysis** (section divider + 2+ theme slides + triangulation matrix slide)
9. **SECTION: Roadmap Recommendations** (section divider + **one slide per recommendation** + **E2E Handoff** numbered table for orchestrator HITL)
10. **Bumper Slide**

---

## Layout variety

Alternate **`Title Only`** and **`Title Only_Alt`** every 2–3 slides where possible. Use **`Section Title`** for section dividers (two `text_boxes` per **120** rule). Use **`1/2 Headline_Alt`** for key takeaways where appropriate.

---

## Related paths

- Rule: [`.cursor/rules/120-pmf-thematic-analysis.mdc`](../../.cursor/rules/120-pmf-thematic-analysis.mdc) Phase 6b and pre-flight checklist
- Orchestrator: [`.cursor/rules/000-master-orchestrator.mdc`](../../.cursor/rules/000-master-orchestrator.mdc) (GCC E2E includes **120** deck generation)
- Human reference deck (not in repo): `~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx` (visual spot-check only)
