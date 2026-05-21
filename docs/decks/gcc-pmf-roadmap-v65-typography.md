# GCC PMF roadmap deck – v65 typography and layout (archival reference)

**Source:** `~/Downloads/GCC_Recruiting_PMF_Roadmap_v65.pptx` (50 slides), measured March 2026 with `python-pptx`.

**Purpose:** Historical technical measurements from the v65 deck for archival and regeneration purposes.

**CANONICAL STANDARDS**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → Typography Standards** for current workspace-wide slide styling rules. This document now serves as an archival reference.

**Owning agents:** **110-slide-generator** (short decks) and **130-pmf-slide-generator** (full PMF decks) both reference **010** for typography.

---

## Type scale (archival - current standards in 010-style-guide.mdc)

**Current workspace typography standards**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → Typography Standards**

**Historical v65 measurements** (for reference only):

| Role | Font | Size | Notes |
|------|------|------|--------|
| Slide title (layout placeholder) | Inherit from template | — | `Title Only` / `Title Only_Alt` placeholder index `0` |
| Body bullets (standard density) | Archivo | **12pt** | **Default** for 4-6 bullets; applies to most content slides |
| Body bullets (sparse) | Archivo | **14pt** | For emphasis slides with ≤3 bullets (key takeaways, 1/2 Headline content) |
| Body bullets (dense) | Archivo | **11pt** | For >6 bullets, comprehensive tables, PESTEL deep-dive slides |
| In-slide subheads (Executive summary blocks, theme titles in body) | Archivo | **12pt bold** | Use run-level `font_size_pt`: 12, `bold`: true |
| **Product implication:** (PESTEL and similar) | Archivo | **11pt bold** + **yellow highlight** | Run-level `highlight`: `FFFF00` (no `#`); prefix `Product implication: `; 11pt retained for dense PESTEL context |
| Section divider primary line | Archivo | **12pt bold** | e.g. `S E C T I O N  0 1` or `Workday Confidential` |
| Section divider secondary line | Archivo | **11pt** | e.g. `Research Challenge`; use **level 0** second paragraph (no bullet) to match v65 subtitle |
| Footer (optional, not in JSON spec today) | Archivo | **7pt** | v65 places `Workday Confidential` + slide number in footer shapes; omit unless MCP adds footer support |

---

## Content body text box (Title Only / Title Only_Alt)

**Current standards**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → Body text box**

**Historical v65 measurements** (for reference):

- `left_inches`: **0.7**
- `top_inches`: **1.2**
- `width_inches`: **8.6**
- `height_inches`: **2.8** (tighter than older specs that used 3.6–3.9; increase only for dense tables or charts)

**Font sizing by content density:**
- **14pt**: Sparse slides (≤3 bullets, emphasis/key takeaway slides, 1/2 Headline content)
- **12pt**: Standard slides (4-6 bullets) - **Default for most content**
- **11pt**: Dense slides only (>6 bullets, comprehensive tables, PESTEL deep-dive with Product implication)

Prefer **`paragraphs`** on the text box instead of one flat `text` string with Unicode `•` characters. The engine applies native bullets when `level` is **1** or higher.

---

## Section Title layout (divider slides)

Measured v65 right-hand column:

- Primary + secondary copy often live in one shape: **(3.3, 1.5)**, **5.6 × 2.2** in.
- **Do not** use **24pt** for the primary line; v65 uses **12pt bold**.
- To avoid a bullet on the subtitle (engine adds `•` when `level > 0`), use **two paragraphs both at level 0**: first paragraph 12pt bold primary; second 11pt secondary (optional `color`: `laptop` for de-emphasis).
- **Slide Deck MCP auto-agenda:** The **second** paragraph’s `"text"` MUST be a **plain string** (not an array of run dicts). Run-array subtitles are stringified into the agenda and appear as code like `[{'text': 'PESTEL', ...}]`. See **`.cursor/rules/130-pmf-slide-generator.mdc`** → **Auto-agenda slide**. Subtitle copy should be a **substantive** agenda line (2-4 words maximum) matching v65 minimalist style: "Research challenge", "PESTEL", "Competitive landscape", "Primary research", "Thematic analysis", "Win / Loss". Do NOT use verbose pipe-separated descriptions.

---

## Density and copy rules

**Current standards**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation** for font sizing logic and content guidelines.

**Historical v65 guidance** (for reference):

- Keep clauses short. For **generic** slides, avoid more than **~5–6** top-level bullet paragraphs per **2.8in** body box unless content is intentionally light.
- **Font size strategy**: Use **12pt default** for standard density (4-6 bullets). Scale to **14pt for sparse** (≤3 bullets, emphasis slides) or **11pt for dense** (>6 bullets, data-heavy slides).
- **Exception — match golden v65 readout density:** **PESTEL** (six factor slides) and **per-customer interview** slides are **not** held to that cap. Follow **`130-pmf-slide-generator.mdc`** → **v65 depth (PESTEL body)** and **v65 depth (Primary research)** minimums (more bullets, **level-2** clusters, quote-led interview lines, longer **Product implication**). If the box overflows, move detail to **`speaker_notes`** rather than thinning slide body below those minimums.
- British English per [`010-style-guide.mdc`](../.cursor/rules/010-style-guide.mdc).
- PESTEL: exactly **six** factor slides; each ends with a **Product implication:** line (bold, 11pt, yellow highlight) with **substantive** copy per **130** (not a short fragment).

---

## Slide spec: `text_boxes[].paragraphs` schema

**Current standards and examples**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → Product Implication** for the canonical `paragraphs` schema with run-level formatting.

**Historical v65 example** (for reference):

Supported by the MCP engine (not always listed in the MCP JSON descriptor). Each text box may use:

```json
{
  "left_inches": 0.7,
  "top_inches": 1.2,
  "width_inches": 8.6,
  "height_inches": 2.8,
  "font_name": "Archivo",
  "font_size_pt": 12,
  "color": "ink",
  "paragraphs": [
    {
      "level": 1,
      "text": "Bullet body inherits 12pt from text box defaults (standard density)."
    },
    {
      "level": 0,
      "text": [
        {
          "text": "Product implication: ",
          "bold": true,
          "font_size_pt": 11,
          "highlight": "FFFF00"
        },
        {
          "text": "One line tied to the factor (11pt for dense PESTEL context).",
          "bold": true,
          "font_size_pt": 11,
          "highlight": "FFFF00"
        }
      ]
    }
  ]
}
```

`text` per paragraph may be a string, a single run dict, or a **list of run dicts** with optional `font_name`, `font_size_pt`, `bold`, `color`, `highlight`.

---

## Recommendation slides (v65 pattern)

**Current standards**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → Typography Standards** for font sizing.

**Historical v65 structure**:

Five lines at **level 1** (native bullets), **12pt default** (11pt if dense with 6+ bullets), same body box geometry:

- Problem: …
- Evidence: …
- Recommendation: …
- Why now: …
- Success metrics: …

---

## Executive summary (v65 pattern)

**Current standards**: See **`.cursor/rules/010-style-guide.mdc` → Deck Generation → In-slide subheadings**

**Historical v65 structure**:

Alternate **12pt bold** block headings (level 0, run formatting) with **level 1** supporting bullets (12pt default, or 11pt if dense). See reference deck slide 4.

---

## Regenerating metrics from a new golden deck

```bash
python3 -c "
from pptx import Presentation
from pptx.util import Emu
p = Presentation('$HOME/Downloads/GCC_Recruiting_PMF_Roadmap_v65.pptx')
# Inspect shape positions and paragraph runs per slide as needed
"
```

---

## Related paths

**Canonical standards (active):**
- [`.cursor/rules/010-style-guide.mdc`](../.cursor/rules/010-style-guide.mdc) → Deck Generation - **Typography Standards (SINGLE SOURCE OF TRUTH)**

**Structural references:**
- [`gcc-pmf-roadmap-v65-slide-inventory.md`](./gcc-pmf-roadmap-v65-slide-inventory.md) - 50-slide structure map
- [`gcc-pmf-roadmap-baseline-slides-spec.md`](./gcc-pmf-roadmap-baseline-slides-spec.md) - Content classes

**Agent rules:**
- [`.cursor/rules/110-slide-generator.mdc`](../.cursor/rules/110-slide-generator.mdc) - Short decks (references 010 typography)
- [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) - Full PMF decks (references 010 typography)
- [`.cursor/rules/120-pmf-thematic-analysis.mdc`](../.cursor/rules/120-pmf-thematic-analysis.mdc) - Research source

**Archival:**
- The one-off generator that produced `docs/decks/specs/slides_spec_v49.json` was removed from the tree; recover from **git history** if you need the exact script again (see [`scripts/README.md`](../../scripts/README.md) “Removed one-off generators”).
