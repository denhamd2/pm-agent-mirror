# GCC PMF roadmap deck – v30 typography and layout (reference)

**Source:** `~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx` (50 slides), measured March 2026 with `python-pptx`.

**Purpose:** Visual parity for Slide Deck MCP (`user-slide-deck-mcp`) specs. Use alongside [`gcc-pmf-roadmap-v30-slide-inventory.md`](./gcc-pmf-roadmap-v30-slide-inventory.md) (structure) and [`gcc-pmf-roadmap-baseline-slides-spec.md`](./gcc-pmf-roadmap-baseline-slides-spec.md) (content classes).

**Owning agent:** **130-pmf-slide-generator** (source content: **120-pmf-thematic-analysis** report).

---

## Type scale

| Role | Font | Size | Notes |
|------|------|------|--------|
| Slide title (layout placeholder) | Inherit from template | — | `Title Only` / `Title Only_Alt` placeholder index `0` |
| Body bullets | Archivo | **11pt** | Default for `text_boxes` via `font_size_pt`: 11 |
| In-slide subheads (Executive summary blocks, theme titles in body) | Archivo | **12pt bold** | Use run-level `font_size_pt`: 12, `bold`: true |
| **Product implication:** (PESTEL and similar) | Archivo | **11pt bold** + **yellow highlight** | Run-level `highlight`: `FFFF00` (no `#`); prefix `Product implication: ` |
| Section divider primary line | Archivo | **12pt bold** | e.g. `S E C T I O N  0 1` or `Workday Confidential` |
| Section divider secondary line | Archivo | **11pt** | e.g. `Research Challenge`; use **level 0** second paragraph (no bullet) to match v30 subtitle |
| Footer (optional, not in JSON spec today) | Archivo | **7pt** | v30 places `Workday Confidential` + slide number in footer shapes; omit unless MCP adds footer support |

---

## Content body text box (Title Only / Title Only_Alt)

Measured from v30 content slides (e.g. Executive summary, PESTEL, recommendations):

- `left_inches`: **0.7**
- `top_inches`: **1.2**
- `width_inches`: **8.6**
- `height_inches`: **2.8** (tighter than older specs that used 3.6–3.9; increase only for dense tables or charts)

Prefer **`paragraphs`** on the text box instead of one flat `text` string with Unicode `•` characters. The engine applies native bullets when `level` is **1** or higher ([`slide_engine.py`](file:///Users/david.denham/mcp-servers/wday-slidemcp/engine/slide_engine.py) `_apply_bullet_to_paragraph`).

---

## Section Title layout (divider slides)

Measured v30 right-hand column:

- Primary + secondary copy often live in one shape: **(3.3, 1.5)**, **5.6 × 2.2** in.
- **Do not** use **24pt** for the primary line; v30 uses **12pt bold**.
- To avoid a bullet on the subtitle (engine adds `•` when `level > 0`), use **two paragraphs both at level 0**: first paragraph 12pt bold primary; second 11pt secondary (optional `color`: `laptop` for de-emphasis).
- **Slide Deck MCP auto-agenda:** The **second** paragraph’s `"text"` MUST be a **plain string** (not an array of run dicts). Run-array subtitles are stringified into the agenda and appear as code like `[{'text': 'PESTEL', ...}]`. See **`.cursor/rules/130-pmf-slide-generator.mdc`** → **Auto-agenda slide**. Subtitle copy should be a **substantive** agenda line (12–22 words; `Section | substance`), not a one-word stub.

---

## Density and copy rules

- Keep clauses short. For **generic** slides, avoid more than **~5–6** top-level bullet paragraphs per **2.8in** body box unless content is intentionally light.
- **Exception — match golden v30 readout density:** **PESTEL** (six factor slides) and **per-customer interview** slides are **not** held to that cap. Follow **`.cursor/rules/130-pmf-slide-generator.mdc`** → **v30 depth (PESTEL body)** and **v30 depth (Primary research)** minimums (more bullets, **level-2** clusters, quote-led interview lines, longer **Product implication**). If the box overflows, move detail to **`speaker_notes`** rather than thinning slide body below those minimums.
- British English per [`010-style-guide.mdc`](../.cursor/rules/010-style-guide.mdc).
- PESTEL: exactly **six** factor slides; each ends with a **Product implication:** line (bold, 11pt, yellow highlight) with **substantive** copy per **130** (not a short fragment).

---

## Slide spec: `text_boxes[].paragraphs` schema

Supported by the MCP engine (not always listed in the MCP JSON descriptor). Each text box may use:

```json
{
  "left_inches": 0.7,
  "top_inches": 1.2,
  "width_inches": 8.6,
  "height_inches": 2.8,
  "font_name": "Archivo",
  "font_size_pt": 11,
  "color": "ink",
  "paragraphs": [
    {
      "level": 1,
      "text": "Bullet body inherits 11pt from text box defaults."
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
          "text": "One line tied to the factor.",
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

## Recommendation slides (v30 pattern)

Five lines at **level 1** (native bullets), **11pt**, same body box geometry:

- Problem: …
- Evidence: …
- Recommendation: …
- Why now: …
- Success metrics: …

---

## Executive summary (v30 pattern)

Alternate **12pt bold** block headings (level 0, run formatting) with **level 1** supporting bullets (11pt). See reference deck slide 4.

---

## Regenerating metrics from a new golden deck

```bash
python3 -c "
from pptx import Presentation
from pptx.util import Emu
p = Presentation('$HOME/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx')
# Inspect shape positions and paragraph runs per slide as needed
"
```

---

## Related paths

- [`gcc-pmf-roadmap-v30-slide-inventory.md`](./gcc-pmf-roadmap-v30-slide-inventory.md)
- [`gcc-pmf-roadmap-baseline-slides-spec.md`](./gcc-pmf-roadmap-baseline-slides-spec.md)
- [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) (report from [`.cursor/rules/120-pmf-thematic-analysis.mdc`](../.cursor/rules/120-pmf-thematic-analysis.mdc))
- Generator: `scripts/build_gcc_slides_spec_v49_v30_typography.py` (outputs `slides_spec_v49.json`)
