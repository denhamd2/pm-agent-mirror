# Deck documentation

- **`gcc-pmf-roadmap-baseline-slides-spec.md`** – Canonical **v30-parity** structure, length, and pre-flight checks for full **Recruiting PMF roadmap** PowerPoints. Used by **130-pmf-slide-generator** (after **120** report); **110-slide-generator** does not build this deck type.
- **`gcc-pmf-roadmap-v30-slide-inventory.md`** – Extracted slide-by-slide **content classes** from `~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx` (50 slides). Use this to stop structural drift when cloning older `slides_spec_v*.json`.
- **`gcc-pmf-roadmap-v30-typography.md`** – Measured **font sizes, body box geometry, bullets, and Product implication** formatting from v30; use with Slide Deck MCP `text_boxes[].paragraphs` for visual parity.
